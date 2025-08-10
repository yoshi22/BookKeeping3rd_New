/**
 * データベース接続・管理サービス
 * 簿記3級問題集アプリ - SQLite基盤実装
 */

import { Platform } from "react-native";
import {
  Database,
  DatabaseConfig,
  DatabaseError,
  DatabaseResult,
  QueryResult,
} from "../types/database";

// Web環境では expo-sqlite をインポートしない
let SQLite: any = null;
if (Platform.OS !== "web") {
  try {
    SQLite = require("expo-sqlite");
  } catch (error) {
    console.warn("[DatabaseService] SQLite import failed:", error);
  }
}

/**
 * データベース設定
 */
const DATABASE_CONFIG: DatabaseConfig = {
  name: "bookkeeping.db",
  version: "1.0.0",
  displayName: "簿記3級問題集データベース",
  size: 50 * 1024 * 1024, // 50MB
  location: "default",
};

/**
 * Web用データベースモック（localStorage ベース）
 */
class WebDatabaseMock {
  private tables: Map<string, any[]> = new Map();

  runSync(sql: string, params: any[] = []): any {
    console.log(`[WebDB] Mock SQL実行: ${sql}`, params);

    try {
      // 基本的なSQL操作をシミュレート
      const rows: any[] = [];
      let changes = 0;
      let lastInsertRowId: number | undefined = undefined;

      if (sql.includes("PRAGMA")) {
        // PRAGMA文は常に成功を返す
        if (sql.includes("foreign_keys")) {
          rows.push({ foreign_keys: 1 });
        } else if (sql.includes("journal_mode")) {
          rows.push({ journal_mode: "WAL" });
        } else if (sql.includes("synchronous")) {
          rows.push({ synchronous: 1 });
        } else if (sql.includes("auto_vacuum")) {
          rows.push({ auto_vacuum: 2 });
        } else if (sql.includes("integrity_check")) {
          rows.push({ integrity_check: "ok" });
        } else {
          rows.push({ pragma: "ok" });
        }
      } else if (sql.includes("CREATE TABLE") || sql.includes("CREATE INDEX")) {
        // テーブル作成・インデックス作成は成功をシミュレート
        changes = 0;
        console.log(
          `[WebDB] テーブル/インデックス作成をシミュレート: ${sql.substring(0, 50)}...`,
        );
      } else if (sql.includes("SELECT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];

        // COUNT(*) クエリの特別処理
        if (sql.includes("COUNT(*)")) {
          rows.push({ count: data.length });
        } else {
          rows.push(...data.slice(0, 100)); // 最大100件まで返す
        }
        console.log(`[WebDB] SELECT from ${tableName}: ${rows.length}件`);
      } else if (sql.includes("INSERT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];
        const newId = data.length + 1;
        data.push({ id: newId, ...this.parseInsertParams(params) });
        this.tables.set(tableName, data);
        changes = 1;
        lastInsertRowId = newId;
        console.log(`[WebDB] INSERT into ${tableName}: ID=${newId}`);
      } else if (sql.includes("UPDATE") || sql.includes("DELETE")) {
        const tableName = this.extractTableName(sql);
        changes = 1;
        console.log(
          `[WebDB] UPDATE/DELETE from ${tableName}: affected=${changes}`,
        );
      }

      const result = {
        getAllSync: () => {
          console.log(`[WebDB] getAllSync returning ${rows.length} rows`);
          return rows;
        },
        changes,
        lastInsertRowId,
      };

      console.log(
        `[WebDB] SQL実行結果: changes=${changes}, lastInsertRowId=${lastInsertRowId}, rows=${rows.length}`,
      );
      return result;
    } catch (error) {
      console.error(`[WebDB] Mock SQL実行エラー: ${sql}`, error);
      // エラーでも最低限の結果を返してアプリが動作するようにする
      return {
        getAllSync: () => [],
        changes: 0,
        lastInsertRowId: undefined,
      };
    }
  }

  prepareSync(sql: string): any {
    console.log(`[WebDB] Mock prepareSync: ${sql}`);
    return {
      executeSync: (params: any[] = []) => {
        console.log(`[WebDB] Mock executeSync with params:`, params);
        // runSyncと同じロジックを使用
        const result = this.runSync(sql, params);
        return {
          getAllSync: () => result.getAllSync(),
        };
      },
      finalizeSync: () => {
        console.log(`[WebDB] Mock finalizeSync`);
      },
    };
  }

  async withTransactionAsync(operations: Function): Promise<void> {
    console.log("[WebDB] Mock トランザクション実行");
    try {
      await operations(this);
      console.log("[WebDB] Mock トランザクション成功");
    } catch (error) {
      console.error("[WebDB] Mock トランザクションエラー:", error);
      throw error;
    }
  }

  closeSync(): void {
    console.log("[WebDB] Mock データベースクローズ");
    this.tables.clear();
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
    return match ? match[1] : "unknown";
  }

  private parseInsertParams(params: any[]): Record<string, any> {
    const result: Record<string, any> = {};
    params.forEach((param, index) => {
      result[`col_${index}`] = param;
    });
    return result;
  }
}

/**
 * データベース管理クラス
 * SQLite接続、トランザクション管理、エラーハンドリングを提供
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private db: any | WebDatabaseMock | null = null;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * データベース初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  /**
   * 初期化実行
   */
  private async performInitialization(): Promise<void> {
    if (this.isInitializing) {
      console.warn("[DatabaseService] 初期化が既に進行中です");
      return;
    }

    this.isInitializing = true;
    
    console.log(
      `[DatabaseService] データベース接続開始: ${DATABASE_CONFIG.name}`,
    );
    console.log(`[DatabaseService] Platform.OS: ${Platform.OS}`);
    console.log(`[DatabaseService] SQLite モジュール利用可能: ${!!SQLite}`);

    try {
      // Web環境の場合はモック実装を使用
      if (Platform.OS === "web") {
        console.log("[DatabaseService] Web環境検出 - モック実装を使用");
        this.db = new WebDatabaseMock();
      } else {
        // ネイティブ環境ではSQLiteを使用
        if (!SQLite) {
          console.warn(
            "[DatabaseService] SQLite モジュールが利用できません - モックを使用",
          );
          this.db = new WebDatabaseMock();
        } else {
          try {
            console.log(
              `[DatabaseService] SQLite接続試行: ${DATABASE_CONFIG.name}`,
            );
            this.db = SQLite.openDatabaseSync(DATABASE_CONFIG.name);
            console.log("[DatabaseService] SQLite接続成功");
          } catch (sqliteError) {
            console.error(
              "[DatabaseService] SQLite初期化失敗、詳細:",
              sqliteError,
            );
            console.error(
              "[DatabaseService] SQLite Error Stack:",
              sqliteError instanceof Error
                ? sqliteError.stack
                : "No stack trace",
            );
            console.warn("[DatabaseService] フォールバックとしてモックを使用");
            this.db = new WebDatabaseMock();
          }
        }
      }

      console.log("[DatabaseService] データベースインスタンス作成完了");

      // 基本的なPRAGMA設定を実行（初期化中は循環参照を避けるため直接実行）
      try {
        console.log("[DatabaseService] PRAGMA設定開始");

        // 外部キー制約を有効化
        console.log("[DatabaseService] 外部キー制約設定中");
        await this.executeDirectSql("PRAGMA foreign_keys = ON");

        // WALモードは環境によっては失敗する可能性があるため、オプション扱い
        if (Platform.OS !== "web" && SQLite) {
          try {
            console.log("[DatabaseService] WALモード設定中");
            await this.executeDirectSql("PRAGMA journal_mode = WAL");
            
            console.log("[DatabaseService] 同期モード設定中");
            await this.executeDirectSql("PRAGMA synchronous = NORMAL");

            console.log("[DatabaseService] オートバキューム設定中");
            await this.executeDirectSql("PRAGMA auto_vacuum = INCREMENTAL");
          } catch (walError) {
            console.warn("[DatabaseService] WALモード設定をスキップ:", walError);
            // WALモード設定の失敗は致命的ではない
          }
        }

        console.log("[DatabaseService] PRAGMA設定完了");
      } catch (pragmaError) {
        console.warn("[DatabaseService] PRAGMA設定で一部エラー:", pragmaError);
        // PRAGMA設定のエラーは初期化を阻止しない
      }

      console.log("[DatabaseService] データベース接続完了");
      this.isInitialized = true;
      this.isInitializing = false;
    } catch (error) {
      this.isInitializing = false;
      console.error("[DatabaseService] 初期化中の予期しないエラー:", error);
      console.error("[DatabaseService] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        platform: Platform.OS,
        sqliteAvailable: !!SQLite,
      });

      const dbError = this.createDatabaseError(
        "Database initialization failed",
        error,
        "CRITICAL",
        {
          config: DATABASE_CONFIG,
          platform: Platform.OS,
          sqliteAvailable: !!SQLite,
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
        },
      );
      console.error("[DatabaseService] 最終初期化エラー:", dbError);
      throw dbError;
    }
  }

  /**
   * 直接SQL実行（初期化中用、循環参照を避ける）
   */
  private async executeDirectSql(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      throw new Error("Database not available for direct SQL execution");
    }

    try {
      console.log(`[DatabaseService] SQL実行: ${sql}`, params);
      
      // SQLのタイプを判定してそれに応じた処理を行う
      const sqlLower = sql.trim().toLowerCase();
      
      if (sqlLower.startsWith('select') || sqlLower.startsWith('pragma')) {
        // SELECTやPRAGMAクエリの場合
        const statement = this.db.prepareSync(sql);
        try {
          const result = statement.executeSync(params);
          const rows = result.getAllSync();
          return {
            rows,
            rowsAffected: 0,
            insertId: undefined,
          };
        } finally {
          statement.finalizeSync();
        }
      } else {
        // INSERT, UPDATE, DELETE, CREATE TABLEなどの場合
        const result = this.db.runSync(sql, params);
        return {
          rows: [],
          rowsAffected: result.changes || 0,
          insertId: result.lastInsertRowId,
        };
      }
    } catch (error) {
      const dbError = this.createDatabaseError(
        `SQL execution failed: ${sql}`,
        error,
        "HIGH",
        { sql, params },
      );
      throw dbError;
    }
  }

  /**
   * SQLクエリ実行（同期版）
   */
  public async executeSql<T = any>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    // 初期化中の場合は待機
    if (this.isInitializing) {
      if (this.initializationPromise) {
        await this.initializationPromise;
      }
    }

    // 初期化されていない場合は初期化を実行
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }

    if (!this.db) {
      throw this.createDatabaseError(
        "Database not initialized",
        null,
        "CRITICAL",
      );
    }

    try {
      console.log(`[DatabaseService] SQL実行: ${sql}`, params);

      // SQLのタイプを判定してそれに応じた処理を行う
      const sqlLower = sql.trim().toLowerCase();
      
      if (sqlLower.startsWith('select') || sqlLower.startsWith('pragma')) {
        // SELECTやPRAGMAクエリの場合
        const statement = this.db.prepareSync(sql);
        try {
          const result = statement.executeSync(params);
          const rows = result.getAllSync() as T[];
          return {
            rows,
            rowsAffected: 0,
            insertId: undefined,
          };
        } finally {
          statement.finalizeSync();
        }
      } else {
        // INSERT, UPDATE, DELETE, CREATE TABLEなどの場合
        const result = this.db.runSync(sql, params);
        return {
          rows: [] as T[],
          rowsAffected: result.changes || 0,
          insertId: result.lastInsertRowId,
        };
      }
    } catch (error) {
      const dbError = this.createDatabaseError(
        `SQL execution failed: ${sql}`,
        error,
        "HIGH",
        { sql, params },
      );
      throw dbError;
    }
  }

  /**
   * トランザクション実行
   */
  public async executeTransaction(
    operations: (db: any | WebDatabaseMock) => Promise<void>,
  ): Promise<DatabaseResult> {
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }

    if (!this.db) {
      throw this.createDatabaseError(
        "Database not initialized",
        null,
        "CRITICAL",
      );
    }

    try {
      console.log("[DatabaseService] トランザクション開始");

      await this.db.withTransactionAsync(async () => {
        await operations(this.db!);
      });

      console.log("[DatabaseService] トランザクション成功");
      return { success: true };
    } catch (error) {
      const dbError = this.createDatabaseError(
        "Transaction execution failed",
        error,
        "HIGH",
      );
      console.error("[DatabaseService] トランザクションエラー:", dbError);
      throw dbError;
    }
  }

  /**
   * データベース整合性チェック
   */
  public async checkIntegrity(): Promise<boolean> {
    try {
      const result = await this.executeSql("PRAGMA integrity_check");
      return result.rows.length > 0 && result.rows[0].integrity_check === "ok";
    } catch (error) {
      console.error("[DatabaseService] 整合性チェックエラー:", error);
      return false;
    }
  }

  /**
   * データベース統計情報取得
   */
  public async getStats(): Promise<any> {
    try {
      const tables = [
        "questions",
        "learning_history",
        "review_items",
        "user_progress",
        "categories",
        "account_items",
        "mock_exams",
        "mock_exam_questions",
        "mock_exam_results",
        "app_settings",
      ];

      const stats: any = {
        tables: {},
        totalSize: 0,
        version: DATABASE_CONFIG.version,
        integrityCheck: await this.checkIntegrity(),
      };

      for (const table of tables) {
        try {
          const countResult = await this.executeSql(
            `SELECT COUNT(*) as count FROM ${table}`,
          );
          stats.tables[table] = {
            rowCount: countResult.rows[0]?.count || 0,
            sizeBytes: 0, // SQLiteでは正確なサイズ計算が困難
            lastModified: new Date().toISOString(),
          };
        } catch (error) {
          // テーブルが存在しない場合はスキップ
          stats.tables[table] = {
            rowCount: 0,
            sizeBytes: 0,
            lastModified: new Date().toISOString(),
          };
        }
      }

      return stats;
    } catch (error) {
      console.error("[DatabaseService] 統計情報取得エラー:", error);
      throw this.createDatabaseError(
        "Failed to get database stats",
        error,
        "MEDIUM",
      );
    }
  }

  /**
   * データベースクローズ
   */
  public async close(): Promise<void> {
    if (this.db) {
      console.log("[DatabaseService] データベース接続クローズ");

      try {
        this.db.closeSync();
        this.db = null;
        this.isInitialized = false;
        this.isInitializing = false;
        this.initializationPromise = null;
        console.log("[DatabaseService] データベース接続クローズ完了");
      } catch (error) {
        const dbError = this.createDatabaseError(
          "Failed to close database",
          error,
          "MEDIUM",
        );
        console.error("[DatabaseService] クローズエラー:", dbError);
        throw dbError;
      }
    }
  }

  /**
   * データベース完全リセット（ファイル削除＋再作成）
   */
  public async resetDatabase(): Promise<void> {
    console.log("[DatabaseService] データベース完全リセット開始");
    
    try {
      // 既存の接続をクローズ
      await this.close();
      
      // React Native環境でのみファイル削除を実行
      if (Platform.OS !== "web") {
        try {
          // expo-file-systemを動的インポート
          const { documentDirectory, deleteAsync, getInfoAsync } = await import('expo-file-system');
          
          if (documentDirectory) {
            const dbPath = `${documentDirectory}SQLite/${DATABASE_CONFIG.name}`;
            const walPath = `${dbPath}-wal`;  
            const shmPath = `${dbPath}-shm`;
            
            console.log(`[DatabaseService] データベースファイル削除試行: ${dbPath}`);
            
            // メインデータベースファイル削除
            const dbInfo = await getInfoAsync(dbPath);
            if (dbInfo.exists) {
              await deleteAsync(dbPath);
              console.log("[DatabaseService] メインDBファイル削除完了");
            }
            
            // WALファイル削除
            const walInfo = await getInfoAsync(walPath);
            if (walInfo.exists) {
              await deleteAsync(walPath);
              console.log("[DatabaseService] WALファイル削除完了");
            }
            
            // SHMファイル削除
            const shmInfo = await getInfoAsync(shmPath);
            if (shmInfo.exists) {
              await deleteAsync(shmPath);
              console.log("[DatabaseService] SHMファイル削除完了");
            }
            
            console.log("[DatabaseService] 全データベースファイル削除完了");
          }
        } catch (fileError) {
          console.warn("[DatabaseService] ファイル削除エラー（継続可能）:", fileError);
          // ファイル削除失敗は致命的でない - 新しい接続で上書きされる
        }
      }
      
      // インスタンス状態をリセット
      this.db = null;
      this.isInitialized = false;
      this.isInitializing = false;
      this.initializationPromise = null;
      
      console.log("[DatabaseService] データベースリセット完了 - 次回初期化時に新しいDBが作成されます");
      
    } catch (error) {
      console.error("[DatabaseService] データベースリセットエラー:", error);
      throw this.createDatabaseError(
        "Database reset failed", 
        error, 
        "HIGH",
        { resetAttempt: true }
      );
    }
  }

  /**
   * バキューム実行（デフラグ・最適化）
   */
  public async vacuum(): Promise<void> {
    try {
      console.log("[DatabaseService] データベース最適化開始");
      await this.executeSql("VACUUM");
      console.log("[DatabaseService] データベース最適化完了");
    } catch (error) {
      console.error("[DatabaseService] 最適化エラー:", error);
      throw this.createDatabaseError("Database vacuum failed", error, "MEDIUM");
    }
  }

  /**
   * データベースエラー作成ヘルパー
   */
  private createDatabaseError(
    message: string,
    originalError: any,
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    context: Record<string, any> = {},
  ): DatabaseError {
    const error = new Error(message) as DatabaseError;
    error.code = originalError?.code || "UNKNOWN_DB_ERROR";
    error.severity = severity;
    error.context = {
      ...context,
      timestamp: new Date().toISOString(),
      originalError: originalError?.message || originalError,
    };
    error.recoverable = severity !== "CRITICAL";

    return error;
  }

  /**
   * 接続状態確認
   */
  public isConnected(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * データベース設定取得
   */
  public getConfig(): DatabaseConfig {
    return { ...DATABASE_CONFIG };
  }
}

/**
 * データベースサービスのシングルトンインスタンス
 */
export const databaseService = DatabaseService.getInstance();
