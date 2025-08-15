/**
 * ローカルストレージ最適化サービス（Phase 4）
 * SQLite圧縮・インデックス最適化・ストレージ管理
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../data/database";
import { offlineCacheService } from "./offline-cache-service";

export interface StorageStats {
  totalSize: number; // bytes
  usedSize: number; // bytes
  freeSize: number; // bytes
  databaseSize: number; // bytes
  cacheSize: number; // bytes
  asyncStorageSize: number; // bytes
  fragmentationRatio: number; // 0-1
}

export interface OptimizationConfig {
  enableAutoOptimization: boolean;
  optimizationInterval: number; // ms
  vacuumThreshold: number; // fragmentation ratio threshold
  maxDatabaseSize: number; // bytes
  enableCompression: boolean;
  enableIndexOptimization: boolean;
}

export interface OptimizationResult {
  operation: string;
  sizeBefore: number;
  sizeAfter: number;
  timeTaken: number; // ms
  success: boolean;
  details: string;
}

export class StorageOptimizer {
  private static instance: StorageOptimizer;
  private isInitialized = false;
  private config: OptimizationConfig;
  private optimizationTimer?: NodeJS.Timeout;
  private isOptimizing = false;
  private optimizationHistory: OptimizationResult[] = [];

  private constructor() {
    this.config = {
      enableAutoOptimization: true,
      optimizationInterval: 60 * 60 * 1000, // 1時間
      vacuumThreshold: 0.3, // 30%のフラグメンテーション
      maxDatabaseSize: 100 * 1024 * 1024, // 100MB
      enableCompression: true,
      enableIndexOptimization: true,
    };
  }

  public static getInstance(): StorageOptimizer {
    if (!StorageOptimizer.instance) {
      StorageOptimizer.instance = new StorageOptimizer();
    }
    return StorageOptimizer.instance;
  }

  /**
   * 最適化システムの初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("[StorageOptimizer] ストレージ最適化システム初期化開始");

      // 設定読み込み
      await this.loadConfig();

      // 最適化履歴復元
      await this.loadOptimizationHistory();

      // 初回ストレージ分析
      const stats = await this.analyzeStorage();
      console.log("[StorageOptimizer] 初期ストレージ状態:", stats);

      // 自動最適化スケジュール開始
      if (this.config.enableAutoOptimization) {
        this.startAutoOptimization();
      }

      this.isInitialized = true;
      console.log("[StorageOptimizer] ストレージ最適化システム初期化完了");
    } catch (error) {
      console.error("[StorageOptimizer] 初期化エラー:", error);
      throw error;
    }
  }

  /**
   * ストレージ分析
   */
  public async analyzeStorage(): Promise<StorageStats> {
    try {
      const [databaseStats, cacheStats, asyncStorageStats] = await Promise.all([
        this.analyzeDatabaseSize(),
        this.analyzeCacheSize(),
        this.analyzeAsyncStorageSize(),
      ]);

      const totalUsed =
        databaseStats.size + cacheStats.totalSize + asyncStorageStats.size;
      const fragmentationRatio = await this.calculateFragmentationRatio();

      const stats: StorageStats = {
        totalSize: 0, // プラットフォームによって取得困難
        usedSize: totalUsed,
        freeSize: 0, // 計算困難
        databaseSize: databaseStats.size,
        cacheSize: cacheStats.totalSize,
        asyncStorageSize: asyncStorageStats.size,
        fragmentationRatio,
      };

      return stats;
    } catch (error) {
      console.error("[StorageOptimizer] ストレージ分析エラー:", error);
      throw error;
    }
  }

  /**
   * データベースサイズの分析
   */
  private async analyzeDatabaseSize(): Promise<{
    size: number;
    pageCount: number;
    pageSize: number;
  }> {
    try {
      const pragmaQueries = [
        "PRAGMA page_count",
        "PRAGMA page_size",
        "PRAGMA freelist_count",
      ];

      const results = await Promise.all(
        pragmaQueries.map((query) => database.executeQuery(query)),
      );

      const pageCount = results[0].rows?.[0]?.page_count || 0;
      const pageSize = results[1].rows?.[0]?.page_size || 4096;
      const freelistCount = results[2].rows?.[0]?.freelist_count || 0;

      const totalSize = pageCount * pageSize;
      const freeSize = freelistCount * pageSize;
      const usedSize = totalSize - freeSize;

      return {
        size: usedSize,
        pageCount,
        pageSize,
      };
    } catch (error) {
      console.warn("[StorageOptimizer] データベースサイズ分析エラー:", error);
      return { size: 0, pageCount: 0, pageSize: 4096 };
    }
  }

  /**
   * キャッシュサイズの分析
   */
  private async analyzeCacheSize(): Promise<{
    totalSize: number;
    totalEntries: number;
  }> {
    try {
      const cacheStats = offlineCacheService.getCacheStats();
      return {
        totalSize: cacheStats.totalSize,
        totalEntries: cacheStats.totalEntries,
      };
    } catch (error) {
      console.warn("[StorageOptimizer] キャッシュサイズ分析エラー:", error);
      return { totalSize: 0, totalEntries: 0 };
    }
  }

  /**
   * AsyncStorageサイズの分析
   */
  private async analyzeAsyncStorageSize(): Promise<{
    size: number;
    keyCount: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      // サンプリングベースのサイズ推定（全キー読み込みは重い）
      const sampleSize = Math.min(keys.length, 20);
      const sampleKeys = keys.slice(0, sampleSize);

      const sampleData = await AsyncStorage.multiGet(sampleKeys);

      for (const [key, value] of sampleData) {
        if (key && value) {
          totalSize += new Blob([key + value]).size;
        }
      }

      // 全体サイズを推定
      const estimatedTotalSize =
        keys.length > 0 ? (totalSize / sampleSize) * keys.length : 0;

      return {
        size: Math.round(estimatedTotalSize),
        keyCount: keys.length,
      };
    } catch (error) {
      console.warn("[StorageOptimizer] AsyncStorageサイズ分析エラー:", error);
      return { size: 0, keyCount: 0 };
    }
  }

  /**
   * フラグメンテーション率の計算
   */
  private async calculateFragmentationRatio(): Promise<number> {
    try {
      const results = await Promise.all([
        database.executeQuery("PRAGMA page_count"),
        database.executeQuery("PRAGMA freelist_count"),
      ]);

      const pageCount = results[0].rows?.[0]?.page_count || 0;
      const freelistCount = results[1].rows?.[0]?.freelist_count || 0;

      return pageCount > 0 ? freelistCount / pageCount : 0;
    } catch (error) {
      console.warn("[StorageOptimizer] フラグメンテーション計算エラー:", error);
      return 0;
    }
  }

  /**
   * 自動最適化の開始
   */
  private startAutoOptimization(): void {
    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
    }

    this.optimizationTimer = setInterval(async () => {
      if (!this.isOptimizing) {
        await this.performScheduledOptimization();
      }
    }, this.config.optimizationInterval);

    console.log(
      `[StorageOptimizer] 自動最適化開始 (${this.config.optimizationInterval}ms間隔)`,
    );
  }

  /**
   * 定期最適化の実行
   */
  private async performScheduledOptimization(): Promise<void> {
    try {
      const stats = await this.analyzeStorage();

      // 最適化が必要かチェック
      const needsOptimization =
        stats.fragmentationRatio > this.config.vacuumThreshold ||
        stats.databaseSize > this.config.maxDatabaseSize;

      if (needsOptimization) {
        console.log("[StorageOptimizer] 定期最適化実行 - 条件満たす");
        await this.optimizeStorage();
      }
    } catch (error) {
      console.error("[StorageOptimizer] 定期最適化エラー:", error);
    }
  }

  /**
   * ストレージ最適化の実行
   */
  public async optimizeStorage(): Promise<OptimizationResult[]> {
    if (this.isOptimizing) {
      throw new Error("最適化は既に実行中です");
    }

    this.isOptimizing = true;
    const results: OptimizationResult[] = [];

    try {
      console.log("[StorageOptimizer] ストレージ最適化開始");

      // 1. データベースVACUUM
      if (this.config.enableCompression) {
        const vacuumResult = await this.performDatabaseVacuum();
        results.push(vacuumResult);
      }

      // 2. インデックス最適化
      if (this.config.enableIndexOptimization) {
        const indexResult = await this.optimizeIndexes();
        results.push(indexResult);
      }

      // 3. 古いキャッシュデータの削除
      const cacheResult = await this.cleanupExpiredCache();
      results.push(cacheResult);

      // 4. AsyncStorage最適化
      const asyncStorageResult = await this.optimizeAsyncStorage();
      results.push(asyncStorageResult);

      // 5. 統計更新
      const statsResult = await this.updateStatistics();
      results.push(statsResult);

      // 履歴に記録
      this.optimizationHistory.push(...results);
      await this.saveOptimizationHistory();

      console.log("[StorageOptimizer] ストレージ最適化完了");
      return results;
    } catch (error) {
      console.error("[StorageOptimizer] ストレージ最適化エラー:", error);
      throw error;
    } finally {
      this.isOptimizing = false;
    }
  }

  /**
   * データベースVACUUMの実行
   */
  private async performDatabaseVacuum(): Promise<OptimizationResult> {
    const startTime = Date.now();
    let sizeBefore = 0;
    let sizeAfter = 0;
    let success = false;
    let details = "";

    try {
      // VACUUM前のサイズ取得
      const statsBefore = await this.analyzeDatabaseSize();
      sizeBefore = statsBefore.size;

      // VACUUM実行
      await database.executeQuery("VACUUM");

      // VACUUM後のサイズ取得
      const statsAfter = await this.analyzeDatabaseSize();
      sizeAfter = statsAfter.size;

      success = true;
      details = `ページ数: ${statsBefore.pageCount} → ${statsAfter.pageCount}`;

      console.log(
        `[StorageOptimizer] VACUUM完了: ${sizeBefore} → ${sizeAfter} bytes`,
      );
    } catch (error) {
      details = `VACUUMエラー: ${error instanceof Error ? error.message : String(error)}`;
      console.error("[StorageOptimizer] VACUUMエラー:", error);
    }

    return {
      operation: "database_vacuum",
      sizeBefore,
      sizeAfter,
      timeTaken: Date.now() - startTime,
      success,
      details,
    };
  }

  /**
   * インデックス最適化
   */
  private async optimizeIndexes(): Promise<OptimizationResult> {
    const startTime = Date.now();
    let success = false;
    let details = "";

    try {
      // 既存インデックスの分析
      const indexQuery = `
        SELECT name, sql FROM sqlite_master 
        WHERE type = 'index' AND sql IS NOT NULL
      `;
      const indexResult = await database.executeQuery(indexQuery);

      const indexCount = indexResult.rows?.length || 0;

      // ANALYZE実行（統計情報更新）
      await database.executeQuery("ANALYZE");

      // REINDEX実行（インデックス再構築）
      await database.executeQuery("REINDEX");

      success = true;
      details = `${indexCount}個のインデックスを最適化`;

      console.log(`[StorageOptimizer] インデックス最適化完了: ${indexCount}個`);
    } catch (error) {
      details = `インデックス最適化エラー: ${error instanceof Error ? error.message : String(error)}`;
      console.error("[StorageOptimizer] インデックス最適化エラー:", error);
    }

    return {
      operation: "index_optimization",
      sizeBefore: 0, // インデックス最適化はサイズ変化を測定困難
      sizeAfter: 0,
      timeTaken: Date.now() - startTime,
      success,
      details,
    };
  }

  /**
   * 期限切れキャッシュのクリーンアップ
   */
  private async cleanupExpiredCache(): Promise<OptimizationResult> {
    const startTime = Date.now();
    let sizeBefore = 0;
    let sizeAfter = 0;
    let success = false;
    let details = "";

    try {
      // クリーンアップ前のサイズ
      const cacheBefore = offlineCacheService.getCacheStats();
      sizeBefore = cacheBefore.totalSize;

      // 期限切れキャッシュ削除の実行
      // offlineCacheServiceの内部メソッドは直接呼べないため、
      // 強制的に古いキャッシュをクリア
      const oldCacheQuery = `
        DELETE FROM cache_data 
        WHERE expires_at IS NOT NULL 
        AND expires_at < ?
      `;
      await database.executeQuery(oldCacheQuery, [Date.now()]);

      // 1週間以上古いキャッシュも削除
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const oldDataQuery = `
        DELETE FROM cache_data 
        WHERE last_accessed < ?
      `;
      await database.executeQuery(oldDataQuery, [weekAgo]);

      // クリーンアップ後のサイズ
      const cacheAfter = offlineCacheService.getCacheStats();
      sizeAfter = cacheAfter.totalSize;

      success = true;
      const deletedItems = cacheBefore.totalEntries - cacheAfter.totalEntries;
      details = `${deletedItems}個のキャッシュエントリを削除`;

      console.log(
        `[StorageOptimizer] キャッシュクリーンアップ完了: ${deletedItems}個削除`,
      );
    } catch (error) {
      details = `キャッシュクリーンアップエラー: ${error instanceof Error ? error.message : String(error)}`;
      console.error(
        "[StorageOptimizer] キャッシュクリーンアップエラー:",
        error,
      );
    }

    return {
      operation: "cache_cleanup",
      sizeBefore,
      sizeAfter,
      timeTaken: Date.now() - startTime,
      success,
      details,
    };
  }

  /**
   * AsyncStorage最適化
   */
  private async optimizeAsyncStorage(): Promise<OptimizationResult> {
    const startTime = Date.now();
    let sizeBefore = 0;
    let sizeAfter = 0;
    let success = false;
    let details = "";

    try {
      // 最適化前のサイズ
      const statsBefore = await this.analyzeAsyncStorageSize();
      sizeBefore = statsBefore.size;

      // 古い設定データの削除
      const keys = await AsyncStorage.getAllKeys();
      const keysToDelete: string[] = [];

      // 一時的なキーや古いキーを特定
      for (const key of keys) {
        if (
          key.startsWith("temp_") ||
          key.startsWith("cache_") ||
          key.endsWith("_backup")
        ) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              // 1週間以上古いデータは削除
              if (
                parsed.timestamp &&
                Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000
              ) {
                keysToDelete.push(key);
              }
            }
          } catch {
            // パースできないキーは削除対象
            keysToDelete.push(key);
          }
        }
      }

      // 削除実行
      if (keysToDelete.length > 0) {
        await AsyncStorage.multiRemove(keysToDelete);
      }

      // 最適化後のサイズ
      const statsAfter = await this.analyzeAsyncStorageSize();
      sizeAfter = statsAfter.size;

      success = true;
      details = `${keysToDelete.length}個のキーを削除`;

      console.log(
        `[StorageOptimizer] AsyncStorage最適化完了: ${keysToDelete.length}個削除`,
      );
    } catch (error) {
      details = `AsyncStorage最適化エラー: ${error instanceof Error ? error.message : String(error)}`;
      console.error("[StorageOptimizer] AsyncStorage最適化エラー:", error);
    }

    return {
      operation: "async_storage_optimization",
      sizeBefore,
      sizeAfter,
      timeTaken: Date.now() - startTime,
      success,
      details,
    };
  }

  /**
   * 統計情報の更新
   */
  private async updateStatistics(): Promise<OptimizationResult> {
    const startTime = Date.now();
    let success = false;
    let details = "";

    try {
      // データベース統計の更新
      await database.executeQuery("ANALYZE");

      // 各テーブルの行数カウント更新
      const tables = [
        "questions",
        "learning_history",
        "review_items",
        "mock_exams",
        "categories",
        "user_progress",
      ];

      let totalRows = 0;
      for (const table of tables) {
        try {
          const result = await database.executeQuery(
            `SELECT COUNT(*) as count FROM ${table}`,
          );
          const count = result.rows?.[0]?.count || 0;
          totalRows += count;
        } catch (error) {
          console.warn(
            `[StorageOptimizer] テーブル ${table} のカウント取得エラー:`,
            error,
          );
        }
      }

      success = true;
      details = `${tables.length}テーブル、合計${totalRows}行を分析`;

      console.log(`[StorageOptimizer] 統計更新完了: ${totalRows}行`);
    } catch (error) {
      details = `統計更新エラー: ${error instanceof Error ? error.message : String(error)}`;
      console.error("[StorageOptimizer] 統計更新エラー:", error);
    }

    return {
      operation: "statistics_update",
      sizeBefore: 0,
      sizeAfter: 0,
      timeTaken: Date.now() - startTime,
      success,
      details,
    };
  }

  /**
   * 最適化履歴の読み込み
   */
  private async loadOptimizationHistory(): Promise<void> {
    try {
      const historyData = await AsyncStorage.getItem(
        "storage_optimization_history",
      );
      if (historyData) {
        const parsed = JSON.parse(historyData);
        this.optimizationHistory = parsed.slice(-50); // 最新50件のみ保持
      }
    } catch (error) {
      console.warn("[StorageOptimizer] 最適化履歴読み込みエラー:", error);
      this.optimizationHistory = [];
    }
  }

  /**
   * 最適化履歴の保存
   */
  private async saveOptimizationHistory(): Promise<void> {
    try {
      // 最新50件のみ保持
      const recentHistory = this.optimizationHistory.slice(-50);
      await AsyncStorage.setItem(
        "storage_optimization_history",
        JSON.stringify(recentHistory),
      );
    } catch (error) {
      console.error("[StorageOptimizer] 最適化履歴保存エラー:", error);
    }
  }

  /**
   * 設定の読み込み
   */
  private async loadConfig(): Promise<void> {
    try {
      const configData = await AsyncStorage.getItem("storage_optimizer_config");
      if (configData) {
        const parsed = JSON.parse(configData);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn("[StorageOptimizer] 設定読み込みエラー:", error);
    }
  }

  /**
   * 設定の更新
   */
  public async updateConfig(
    newConfig: Partial<OptimizationConfig>,
  ): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      await AsyncStorage.setItem(
        "storage_optimizer_config",
        JSON.stringify(this.config),
      );

      // 自動最適化の再開始
      if (newConfig.enableAutoOptimization !== undefined) {
        if (this.config.enableAutoOptimization) {
          this.startAutoOptimization();
        } else if (this.optimizationTimer) {
          clearInterval(this.optimizationTimer);
          this.optimizationTimer = undefined;
        }
      }

      console.log("[StorageOptimizer] 設定更新完了");
    } catch (error) {
      console.error("[StorageOptimizer] 設定更新エラー:", error);
    }
  }

  /**
   * 最適化履歴の取得
   */
  public getOptimizationHistory(): OptimizationResult[] {
    return [...this.optimizationHistory];
  }

  /**
   * 現在の設定取得
   */
  public getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  /**
   * 最適化状況の取得
   */
  public isCurrentlyOptimizing(): boolean {
    return this.isOptimizing;
  }

  /**
   * 手動最適化の実行
   */
  public async forceOptimization(): Promise<OptimizationResult[]> {
    console.log("[StorageOptimizer] 手動最適化実行");
    return await this.optimizeStorage();
  }

  /**
   * ストレージ使用量のレポート生成
   */
  public async generateStorageReport(): Promise<{
    stats: StorageStats;
    recommendations: string[];
    lastOptimization: OptimizationResult | null;
  }> {
    const stats = await this.analyzeStorage();
    const recommendations: string[] = [];
    const lastOptimization =
      this.optimizationHistory.length > 0
        ? this.optimizationHistory[this.optimizationHistory.length - 1]
        : null;

    // 推奨事項の生成
    if (stats.fragmentationRatio > 0.3) {
      recommendations.push(
        "データベースのフラグメンテーションが高いため、VACUUM実行を推奨します",
      );
    }

    if (stats.databaseSize > 50 * 1024 * 1024) {
      recommendations.push(
        "データベースサイズが大きいため、古いデータの削除を検討してください",
      );
    }

    if (stats.cacheSize > 20 * 1024 * 1024) {
      recommendations.push(
        "キャッシュサイズが大きいため、クリーンアップを推奨します",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("ストレージは適切に最適化されています");
    }

    return {
      stats,
      recommendations,
      lastOptimization,
    };
  }

  /**
   * リソースのクリーンアップ
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.optimizationTimer) {
        clearInterval(this.optimizationTimer);
        this.optimizationTimer = undefined;
      }

      this.isInitialized = false;
      console.log("[StorageOptimizer] クリーンアップ完了");
    } catch (error) {
      console.error("[StorageOptimizer] クリーンアップエラー:", error);
    }
  }
}

// シングルトンインスタンスのエクスポート
export const storageOptimizer = StorageOptimizer.getInstance();
