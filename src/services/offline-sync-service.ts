/**
 * オフライン同期サービス（Phase 4）
 * 接続状態管理・バックグラウンド同期・競合解決
 */

import NetInfo, { NetInfoState } from "@react-native-netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";
import { database } from "../data/database";
import { offlineCacheService } from "./offline-cache-service";
import { StatisticsService } from "./statistics-service";
import { ReviewService } from "./review-service";

export interface SyncConfig {
  enableBackgroundSync: boolean;
  syncInterval: number; // ms
  retryAttempts: number;
  retryDelay: number; // ms
  batchSize: number;
  conflictResolution: "client" | "server" | "merge";
}

export interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  table: string;
  data: any;
  timestamp: number;
  status: "pending" | "syncing" | "completed" | "failed";
  retryCount: number;
  lastError?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: number;
  pendingOperations: number;
  failedOperations: number;
  isCurrentlySyncing: boolean;
  syncProgress: number; // 0-100
}

export interface ConflictData {
  id: string;
  table: string;
  clientData: any;
  serverData: any;
  timestamp: number;
  resolutionStrategy: "client" | "server" | "merge" | "manual";
}

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private isInitialized = false;
  private config: SyncConfig;
  private syncStatus: SyncStatus;
  private operationQueue: SyncOperation[] = [];
  private conflictQueue: ConflictData[] = [];
  private syncTimer?: NodeJS.Timeout;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  private constructor() {
    this.config = {
      enableBackgroundSync: true,
      syncInterval: 30 * 1000, // 30秒
      retryAttempts: 3,
      retryDelay: 5 * 1000, // 5秒
      batchSize: 20,
      conflictResolution: "client", // クライアント優先
    };

    this.syncStatus = {
      isOnline: false,
      lastSyncTime: 0,
      pendingOperations: 0,
      failedOperations: 0,
      isCurrentlySyncing: false,
      syncProgress: 0,
    };
  }

  public static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  /**
   * 同期システムの初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("[OfflineSyncService] 同期システム初期化開始");

      // 設定読み込み
      await this.loadConfig();

      // 同期テーブル作成
      await this.createSyncTables();

      // 未処理操作の復元
      await this.restorePendingOperations();

      // ネットワーク状態監視開始
      await this.startNetworkMonitoring();

      // アプリ状態監視開始
      this.startAppStateMonitoring();

      // バックグラウンド同期開始
      if (this.config.enableBackgroundSync) {
        this.startBackgroundSync();
      }

      this.isInitialized = true;
      console.log("[OfflineSyncService] 同期システム初期化完了");
    } catch (error) {
      console.error("[OfflineSyncService] 初期化エラー:", error);
      throw error;
    }
  }

  /**
   * 同期用テーブルの作成
   */
  private async createSyncTables(): Promise<void> {
    const queries = [
      // 同期操作キュー
      `CREATE TABLE IF NOT EXISTS sync_operations (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // 競合データ
      `CREATE TABLE IF NOT EXISTS sync_conflicts (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        client_data TEXT NOT NULL,
        server_data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        resolution_strategy TEXT DEFAULT 'manual',
        resolved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // 同期メタデータ
      `CREATE TABLE IF NOT EXISTS sync_metadata (
        table_name TEXT PRIMARY KEY,
        last_sync_timestamp INTEGER DEFAULT 0,
        client_version INTEGER DEFAULT 1,
        server_version INTEGER DEFAULT 0,
        sync_strategy TEXT DEFAULT 'incremental'
      )`,

      // インデックス作成
      `CREATE INDEX IF NOT EXISTS idx_sync_operations_status ON sync_operations(status)`,
      `CREATE INDEX IF NOT EXISTS idx_sync_operations_timestamp ON sync_operations(timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_sync_conflicts_resolved ON sync_conflicts(resolved)`,
    ];

    for (const query of queries) {
      await database.executeQuery(query);
    }
  }

  /**
   * ネットワーク状態監視の開始
   */
  private async startNetworkMonitoring(): Promise<void> {
    try {
      // 初期状態取得
      const initialState = await NetInfo.fetch();
      this.updateNetworkStatus(initialState);

      // 変更監視
      NetInfo.addEventListener((state) => {
        this.updateNetworkStatus(state);
      });

      console.log("[OfflineSyncService] ネットワーク監視開始");
    } catch (error) {
      console.error("[OfflineSyncService] ネットワーク監視エラー:", error);
    }
  }

  /**
   * ネットワーク状態の更新
   */
  private updateNetworkStatus(state: NetInfoState): void {
    const wasOnline = this.syncStatus.isOnline;
    const isOnline = state.isConnected && state.isInternetReachable;

    this.syncStatus.isOnline = isOnline;

    // オンラインに復帰した場合は即座に同期
    if (!wasOnline && isOnline) {
      console.log("[OfflineSyncService] オンライン復帰 - 同期開始");
      this.triggerSync();
    }

    this.notifyStatusChange();
  }

  /**
   * アプリ状態監視の開始
   */
  private startAppStateMonitoring(): void {
    AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && this.syncStatus.isOnline) {
        // アプリがアクティブになったら同期
        console.log("[OfflineSyncService] アプリアクティブ - 同期開始");
        this.triggerSync();
      }
    });
  }

  /**
   * バックグラウンド同期の開始
   */
  private startBackgroundSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.isCurrentlySyncing) {
        this.triggerSync();
      }
    }, this.config.syncInterval);

    console.log(
      `[OfflineSyncService] バックグラウンド同期開始 (${this.config.syncInterval}ms間隔)`,
    );
  }

  /**
   * 同期操作の登録
   */
  public async registerOperation(
    type: "create" | "update" | "delete",
    table: string,
    data: any,
  ): Promise<string> {
    try {
      const operation: SyncOperation = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        table,
        data,
        timestamp: Date.now(),
        status: "pending",
        retryCount: 0,
      };

      // メモリキューに追加
      this.operationQueue.push(operation);

      // SQLiteに永続化
      await this.persistOperation(operation);

      // 統計更新
      this.updateSyncStats();

      // オンライン状態なら即座に同期試行
      if (this.syncStatus.isOnline && !this.syncStatus.isCurrentlySyncing) {
        setTimeout(() => this.triggerSync(), 1000); // 1秒後に実行
      }

      console.log(
        `[OfflineSyncService] 同期操作登録: ${operation.id} (${type} ${table})`,
      );
      return operation.id;
    } catch (error) {
      console.error("[OfflineSyncService] 操作登録エラー:", error);
      throw error;
    }
  }

  /**
   * 同期操作のSQLite永続化
   */
  private async persistOperation(operation: SyncOperation): Promise<void> {
    const query = `
      INSERT INTO sync_operations 
      (id, type, table_name, data, timestamp, status, retry_count, last_error)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      operation.id,
      operation.type,
      operation.table,
      JSON.stringify(operation.data),
      operation.timestamp,
      operation.status,
      operation.retryCount,
      operation.lastError || null,
    ];

    await database.executeQuery(query, params);
  }

  /**
   * 未処理操作の復元
   */
  private async restorePendingOperations(): Promise<void> {
    try {
      const query = `
        SELECT id, type, table_name, data, timestamp, status, retry_count, last_error
        FROM sync_operations
        WHERE status IN ('pending', 'failed')
        ORDER BY timestamp ASC
      `;

      const result = await database.executeQuery(query);

      if (result.rows) {
        for (const row of result.rows) {
          const operation: SyncOperation = {
            id: row.id,
            type: row.type,
            table: row.table_name,
            data: JSON.parse(row.data),
            timestamp: row.timestamp,
            status: row.status,
            retryCount: row.retry_count,
            lastError: row.last_error,
          };

          this.operationQueue.push(operation);
        }
      }

      console.log(
        `[OfflineSyncService] 未処理操作復元完了: ${this.operationQueue.length}件`,
      );
      this.updateSyncStats();
    } catch (error) {
      console.warn("[OfflineSyncService] 未処理操作復元エラー:", error);
    }
  }

  /**
   * 同期の実行
   */
  public async triggerSync(): Promise<void> {
    if (this.syncStatus.isCurrentlySyncing || !this.syncStatus.isOnline) {
      return;
    }

    if (this.operationQueue.length === 0) {
      return;
    }

    try {
      this.syncStatus.isCurrentlySyncing = true;
      this.syncStatus.syncProgress = 0;
      this.notifyStatusChange();

      console.log(
        `[OfflineSyncService] 同期開始: ${this.operationQueue.length}件の操作`,
      );

      // バッチ処理
      const batchSize = this.config.batchSize;
      const batches = this.chunkOperations(this.operationQueue, batchSize);

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        await this.processBatch(batch);

        // 進捗更新
        this.syncStatus.syncProgress = Math.round(
          ((i + 1) / batches.length) * 100,
        );
        this.notifyStatusChange();
      }

      // 同期完了処理
      this.syncStatus.lastSyncTime = Date.now();
      this.updateSyncStats();

      console.log("[OfflineSyncService] 同期完了");
    } catch (error) {
      console.error("[OfflineSyncService] 同期エラー:", error);
    } finally {
      this.syncStatus.isCurrentlySyncing = false;
      this.syncStatus.syncProgress = 0;
      this.notifyStatusChange();
    }
  }

  /**
   * 操作をバッチに分割
   */
  private chunkOperations(
    operations: SyncOperation[],
    batchSize: number,
  ): SyncOperation[][] {
    const chunks: SyncOperation[][] = [];
    for (let i = 0; i < operations.length; i += batchSize) {
      chunks.push(operations.slice(i, i + batchSize));
    }
    return chunks;
  }

  /**
   * バッチ処理
   */
  private async processBatch(batch: SyncOperation[]): Promise<void> {
    for (const operation of batch) {
      try {
        // リトライ制限チェック
        if (operation.retryCount >= this.config.retryAttempts) {
          console.warn(
            `[OfflineSyncService] リトライ上限到達: ${operation.id}`,
          );
          await this.markOperationFailed(operation, "リトライ上限到達");
          continue;
        }

        // 操作実行
        operation.status = "syncing";
        await this.updateOperationStatus(operation);

        await this.executeOperation(operation);

        // 成功処理
        operation.status = "completed";
        await this.updateOperationStatus(operation);
        await this.removeOperationFromQueue(operation);

        console.log(`[OfflineSyncService] 操作成功: ${operation.id}`);
      } catch (error) {
        console.error(`[OfflineSyncService] 操作失敗: ${operation.id}`, error);

        operation.retryCount++;
        operation.lastError =
          error instanceof Error ? error.message : String(error);

        if (operation.retryCount < this.config.retryAttempts) {
          operation.status = "pending";
          await this.updateOperationStatus(operation);

          // リトライ遅延
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay),
          );
        } else {
          await this.markOperationFailed(operation, operation.lastError);
        }
      }
    }
  }

  /**
   * 個別操作の実行（モック実装）
   */
  private async executeOperation(operation: SyncOperation): Promise<void> {
    // 実際の実装では、ここでREST APIやGraphQLエンドポイントにリクエストを送信
    // このアプリはオフライン専用なので、ローカルデータベースの整合性チェックのみ実行

    switch (operation.type) {
      case "create":
        await this.handleCreateOperation(operation);
        break;
      case "update":
        await this.handleUpdateOperation(operation);
        break;
      case "delete":
        await this.handleDeleteOperation(operation);
        break;
      default:
        throw new Error(`未対応の操作タイプ: ${operation.type}`);
    }

    // 関連キャッシュの無効化
    await offlineCacheService.invalidatePattern(`cache_${operation.table}`);
  }

  /**
   * 作成操作の処理
   */
  private async handleCreateOperation(operation: SyncOperation): Promise<void> {
    // データ整合性チェック
    const existingData = await this.checkExistingData(
      operation.table,
      operation.data.id,
    );

    if (existingData) {
      // 競合検出
      await this.handleConflict(operation, existingData);
    } else {
      // ローカルDBに正常に保存されていることを確認
      console.log(
        `[OfflineSyncService] 作成操作確認: ${operation.table} ID=${operation.data.id}`,
      );
    }
  }

  /**
   * 更新操作の処理
   */
  private async handleUpdateOperation(operation: SyncOperation): Promise<void> {
    const existingData = await this.checkExistingData(
      operation.table,
      operation.data.id,
    );

    if (!existingData) {
      throw new Error(
        `更新対象データが存在しません: ${operation.table} ID=${operation.data.id}`,
      );
    }

    // タイムスタンプベースの競合チェック
    if (existingData.updated_at > operation.timestamp) {
      await this.handleConflict(operation, existingData);
    } else {
      console.log(
        `[OfflineSyncService] 更新操作確認: ${operation.table} ID=${operation.data.id}`,
      );
    }
  }

  /**
   * 削除操作の処理
   */
  private async handleDeleteOperation(operation: SyncOperation): Promise<void> {
    const existingData = await this.checkExistingData(
      operation.table,
      operation.data.id,
    );

    if (!existingData) {
      // すでに削除済み（正常）
      console.log(
        `[OfflineSyncService] 削除操作確認（既に削除済み）: ${operation.table} ID=${operation.data.id}`,
      );
    } else {
      console.log(
        `[OfflineSyncService] 削除操作確認: ${operation.table} ID=${operation.data.id}`,
      );
    }
  }

  /**
   * 既存データの確認
   */
  private async checkExistingData(
    tableName: string,
    id: string,
  ): Promise<any | null> {
    try {
      const query = `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`;
      const result = await database.executeQuery(query, [id]);

      return result.rows && result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.warn(
        `[OfflineSyncService] データ確認エラー: ${tableName}`,
        error,
      );
      return null;
    }
  }

  /**
   * 競合の処理
   */
  private async handleConflict(
    operation: SyncOperation,
    existingData: any,
  ): Promise<void> {
    const conflict: ConflictData = {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table: operation.table,
      clientData: operation.data,
      serverData: existingData,
      timestamp: Date.now(),
      resolutionStrategy: this.config.conflictResolution,
    };

    this.conflictQueue.push(conflict);
    await this.persistConflict(conflict);

    // 競合解決戦略に基づく自動処理
    switch (this.config.conflictResolution) {
      case "client":
        await this.resolveConflictClientWins(conflict);
        break;
      case "server":
        await this.resolveConflictServerWins(conflict);
        break;
      case "merge":
        await this.resolveConflictMerge(conflict);
        break;
      default:
        console.log(`[OfflineSyncService] 手動解決待ち競合: ${conflict.id}`);
    }
  }

  /**
   * 競合データのSQLite永続化
   */
  private async persistConflict(conflict: ConflictData): Promise<void> {
    const query = `
      INSERT INTO sync_conflicts 
      (id, table_name, client_data, server_data, timestamp, resolution_strategy)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      conflict.id,
      conflict.table,
      JSON.stringify(conflict.clientData),
      JSON.stringify(conflict.serverData),
      conflict.timestamp,
      conflict.resolutionStrategy,
    ];

    await database.executeQuery(query, params);
  }

  /**
   * クライアント優先での競合解決
   */
  private async resolveConflictClientWins(
    conflict: ConflictData,
  ): Promise<void> {
    console.log(
      `[OfflineSyncService] 競合解決（クライアント優先）: ${conflict.id}`,
    );
    // クライアントデータを維持（何もしない）
    await this.markConflictResolved(conflict.id);
  }

  /**
   * サーバー優先での競合解決
   */
  private async resolveConflictServerWins(
    conflict: ConflictData,
  ): Promise<void> {
    console.log(
      `[OfflineSyncService] 競合解決（サーバー優先）: ${conflict.id}`,
    );
    // この実装ではサーバーが存在しないため、既存データを維持
    await this.markConflictResolved(conflict.id);
  }

  /**
   * マージでの競合解決
   */
  private async resolveConflictMerge(conflict: ConflictData): Promise<void> {
    console.log(`[OfflineSyncService] 競合解決（マージ）: ${conflict.id}`);

    try {
      // 簡単なマージロジック（フィールドレベルでの最新値採用）
      const mergedData = { ...conflict.serverData };

      for (const [key, value] of Object.entries(conflict.clientData)) {
        if (key !== "id" && key !== "updated_at") {
          mergedData[key] = value;
        }
      }

      mergedData.updated_at = Date.now();

      // マージ結果を適用
      const updateQuery = this.buildUpdateQuery(conflict.table, mergedData);
      await database.executeQuery(updateQuery.query, updateQuery.params);

      await this.markConflictResolved(conflict.id);
      console.log(`[OfflineSyncService] マージ完了: ${conflict.id}`);
    } catch (error) {
      console.error(`[OfflineSyncService] マージエラー: ${conflict.id}`, error);
    }
  }

  /**
   * 更新クエリの構築
   */
  private buildUpdateQuery(
    tableName: string,
    data: any,
  ): { query: string; params: any[] } {
    const fields = Object.keys(data).filter((key) => key !== "id");
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => data[field]);

    return {
      query: `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
      params: [...values, data.id],
    };
  }

  /**
   * 競合解決完了のマーク
   */
  private async markConflictResolved(conflictId: string): Promise<void> {
    await database.executeQuery(
      "UPDATE sync_conflicts SET resolved = 1 WHERE id = ?",
      [conflictId],
    );

    // メモリからも削除
    this.conflictQueue = this.conflictQueue.filter((c) => c.id !== conflictId);
  }

  /**
   * 操作の失敗マーク
   */
  private async markOperationFailed(
    operation: SyncOperation,
    error: string,
  ): Promise<void> {
    operation.status = "failed";
    operation.lastError = error;
    await this.updateOperationStatus(operation);
  }

  /**
   * 操作ステータスの更新
   */
  private async updateOperationStatus(operation: SyncOperation): Promise<void> {
    const query = `
      UPDATE sync_operations 
      SET status = ?, retry_count = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await database.executeQuery(query, [
      operation.status,
      operation.retryCount,
      operation.lastError || null,
      operation.id,
    ]);
  }

  /**
   * 操作をキューから削除
   */
  private async removeOperationFromQueue(
    operation: SyncOperation,
  ): Promise<void> {
    // メモリキューから削除
    this.operationQueue = this.operationQueue.filter(
      (op) => op.id !== operation.id,
    );

    // SQLiteからも削除
    await database.executeQuery("DELETE FROM sync_operations WHERE id = ?", [
      operation.id,
    ]);
  }

  /**
   * 同期統計の更新
   */
  private updateSyncStats(): void {
    const pending = this.operationQueue.filter(
      (op) => op.status === "pending",
    ).length;
    const failed = this.operationQueue.filter(
      (op) => op.status === "failed",
    ).length;

    this.syncStatus.pendingOperations = pending;
    this.syncStatus.failedOperations = failed;
  }

  /**
   * 状態変更の通知
   */
  private notifyStatusChange(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.syncStatus);
      } catch (error) {
        console.warn("[OfflineSyncService] リスナーエラー:", error);
      }
    }
  }

  /**
   * 状態変更リスナーの追加
   */
  public addStatusListener(listener: (status: SyncStatus) => void): void {
    this.listeners.add(listener);
  }

  /**
   * 状態変更リスナーの削除
   */
  public removeStatusListener(listener: (status: SyncStatus) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * 現在の同期状態の取得
   */
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * 未解決競合の取得
   */
  public getUnresolvedConflicts(): ConflictData[] {
    return [...this.conflictQueue];
  }

  /**
   * 手動で同期実行
   */
  public async forcSync(): Promise<void> {
    console.log("[OfflineSyncService] 手動同期実行");
    await this.triggerSync();
  }

  /**
   * 設定の読み込み
   */
  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem("offline_sync_config");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn("[OfflineSyncService] 設定読み込みエラー:", error);
    }
  }

  /**
   * 設定の更新
   */
  public async updateConfig(newConfig: Partial<SyncConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      await AsyncStorage.setItem(
        "offline_sync_config",
        JSON.stringify(this.config),
      );

      // バックグラウンド同期の再開始
      if (newConfig.enableBackgroundSync !== undefined) {
        if (this.config.enableBackgroundSync) {
          this.startBackgroundSync();
        } else if (this.syncTimer) {
          clearInterval(this.syncTimer);
          this.syncTimer = undefined;
        }
      }

      console.log("[OfflineSyncService] 設定更新完了");
    } catch (error) {
      console.error("[OfflineSyncService] 設定更新エラー:", error);
    }
  }

  /**
   * リソースのクリーンアップ
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
        this.syncTimer = undefined;
      }

      this.listeners.clear();
      this.operationQueue = [];
      this.conflictQueue = [];
      this.isInitialized = false;

      console.log("[OfflineSyncService] クリーンアップ完了");
    } catch (error) {
      console.error("[OfflineSyncService] クリーンアップエラー:", error);
    }
  }
}

// シングルトンインスタンスのエクスポート
export const offlineSyncService = OfflineSyncService.getInstance();
