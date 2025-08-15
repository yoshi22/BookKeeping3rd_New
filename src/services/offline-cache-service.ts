/**
 * オフラインキャッシュサービス（Phase 4）
 * SQLite活用・データ同期・パフォーマンス最適化
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../data/database";
import { StatisticsService } from "./statistics-service";
import { ReviewService } from "./review-service";

export interface CacheConfig {
  maxCacheSize: number; // MB
  maxCacheAge: number; // ms
  enableCompression: boolean;
  enablePreloading: boolean;
  syncInterval: number; // ms
}

export interface CacheEntry<T = any> {
  id: string;
  key: string;
  data: T;
  timestamp: number;
  size: number; // bytes
  accessCount: number;
  lastAccessed: number;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  totalSize: number; // bytes
  totalEntries: number;
  hitRate: number;
  oldestEntry: number;
  newestEntry: number;
}

export class OfflineCacheService {
  private static instance: OfflineCacheService;
  private isInitialized = false;
  private memoryCache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private accessLog = new Map<string, number[]>();
  private cacheStats: CacheStats = {
    totalSize: 0,
    totalEntries: 0,
    hitRate: 0,
    oldestEntry: 0,
    newestEntry: 0,
  };

  // キャッシュキー定義
  private readonly cacheKeys = {
    questions: "cache_questions",
    categories: "cache_categories",
    user_progress: "cache_user_progress",
    statistics: "cache_statistics",
    review_items: "cache_review_items",
    mock_exams: "cache_mock_exams",
    learning_history: "cache_learning_history",
    account_items: "cache_account_items",
  } as const;

  private constructor() {
    this.config = {
      maxCacheSize: 50 * 1024 * 1024, // 50MB
      maxCacheAge: 24 * 60 * 60 * 1000, // 24時間
      enableCompression: true,
      enablePreloading: true,
      syncInterval: 5 * 60 * 1000, // 5分
    };
  }

  public static getInstance(): OfflineCacheService {
    if (!OfflineCacheService.instance) {
      OfflineCacheService.instance = new OfflineCacheService();
    }
    return OfflineCacheService.instance;
  }

  /**
   * キャッシュシステムの初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("[OfflineCacheService] キャッシュシステム初期化開始");

      // 設定読み込み
      await this.loadConfig();

      // SQLiteキャッシュテーブル作成
      await this.createCacheTables();

      // メモリキャッシュの復元
      await this.restoreMemoryCache();

      // 期限切れキャッシュのクリーンアップ
      await this.cleanupExpiredCache();

      // プリロード実行
      if (this.config.enablePreloading) {
        await this.preloadCriticalData();
      }

      // 統計更新
      await this.updateCacheStats();

      this.isInitialized = true;
      console.log("[OfflineCacheService] キャッシュシステム初期化完了");
    } catch (error) {
      console.error("[OfflineCacheService] 初期化エラー:", error);
      throw error;
    }
  }

  /**
   * SQLiteキャッシュテーブルの作成
   */
  private async createCacheTables(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS cache_data (
        id TEXT PRIMARY KEY,
        cache_key TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        size INTEGER NOT NULL,
        access_count INTEGER DEFAULT 0,
        last_accessed INTEGER NOT NULL,
        expires_at INTEGER,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_cache_key ON cache_data(cache_key);
      CREATE INDEX IF NOT EXISTS idx_expires_at ON cache_data(expires_at);
      CREATE INDEX IF NOT EXISTS idx_last_accessed ON cache_data(last_accessed);
    `;

    await database.executeQuery(query);
  }

  /**
   * データの取得（キャッシュファースト）
   */
  public async get<T>(
    key: string,
    fallbackFn?: () => Promise<T>,
  ): Promise<T | null> {
    try {
      // メモリキャッシュから確認
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && !this.isCacheExpired(memoryEntry)) {
        this.recordCacheAccess(key);
        return memoryEntry.data as T;
      }

      // SQLiteキャッシュから確認
      const sqliteEntry = await this.getFromSQLiteCache<T>(key);
      if (sqliteEntry && !this.isCacheExpired(sqliteEntry)) {
        // メモリキャッシュに昇格
        this.memoryCache.set(key, sqliteEntry);
        this.recordCacheAccess(key);
        return sqliteEntry.data;
      }

      // フォールバック関数の実行
      if (fallbackFn) {
        const data = await fallbackFn();
        if (data !== null && data !== undefined) {
          await this.set(key, data);
          return data;
        }
      }

      return null;
    } catch (error) {
      console.warn(
        `[OfflineCacheService] キャッシュ取得エラー (${key}):`,
        error,
      );
      if (fallbackFn) {
        return await fallbackFn();
      }
      return null;
    }
  }

  /**
   * データの保存
   */
  public async set<T>(
    key: string,
    data: T,
    options: {
      expiresIn?: number; // ms
      metadata?: Record<string, any>;
      priority?: "low" | "normal" | "high";
    } = {},
  ): Promise<void> {
    try {
      const { expiresIn, metadata, priority = "normal" } = options;
      const now = Date.now();
      const serializedData = JSON.stringify(data);
      const size = new Blob([serializedData]).size;

      const cacheEntry: CacheEntry<T> = {
        id: `cache_${key}_${now}`,
        key,
        data,
        timestamp: now,
        size,
        accessCount: 1,
        lastAccessed: now,
        expiresAt: expiresIn ? now + expiresIn : undefined,
        metadata,
      };

      // メモリキャッシュに保存
      this.memoryCache.set(key, cacheEntry);

      // SQLiteキャッシュに保存（優先度が normal 以上の場合）
      if (priority !== "low") {
        await this.saveToSQLiteCache(cacheEntry, serializedData);
      }

      // キャッシュサイズ管理
      await this.enforceCacheSize();

      // 統計更新
      this.updateCacheStatsSync();
    } catch (error) {
      console.error(
        `[OfflineCacheService] キャッシュ保存エラー (${key}):`,
        error,
      );
    }
  }

  /**
   * SQLiteからのキャッシュ取得
   */
  private async getFromSQLiteCache<T>(
    key: string,
  ): Promise<CacheEntry<T> | null> {
    try {
      const query = `
        SELECT id, cache_key, data, timestamp, size, access_count, 
               last_accessed, expires_at, metadata
        FROM cache_data
        WHERE cache_key = ?
        ORDER BY last_accessed DESC
        LIMIT 1
      `;

      const result = await database.executeQuery(query, [key]);

      if (result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        return {
          id: row.id,
          key: row.cache_key,
          data: JSON.parse(row.data),
          timestamp: row.timestamp,
          size: row.size,
          accessCount: row.access_count,
          lastAccessed: row.last_accessed,
          expiresAt: row.expires_at,
          metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        };
      }

      return null;
    } catch (error) {
      console.warn(
        `[OfflineCacheService] SQLiteキャッシュ取得エラー (${key}):`,
        error,
      );
      return null;
    }
  }

  /**
   * SQLiteへのキャッシュ保存
   */
  private async saveToSQLiteCache(
    entry: CacheEntry,
    serializedData: string,
  ): Promise<void> {
    try {
      const query = `
        INSERT OR REPLACE INTO cache_data 
        (id, cache_key, data, timestamp, size, access_count, last_accessed, expires_at, metadata, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const params = [
        entry.id,
        entry.key,
        serializedData,
        entry.timestamp,
        entry.size,
        entry.accessCount,
        entry.lastAccessed,
        entry.expiresAt || null,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ];

      await database.executeQuery(query, params);
    } catch (error) {
      console.error("[OfflineCacheService] SQLiteキャッシュ保存エラー:", error);
    }
  }

  /**
   * 重要データのプリロード
   */
  private async preloadCriticalData(): Promise<void> {
    try {
      console.log("[OfflineCacheService] 重要データプリロード開始");

      const preloadTasks = [
        // 基本マスタデータ
        this.preloadQuestions(),
        this.preloadCategories(),
        this.preloadAccountItems(),

        // ユーザーデータ
        this.preloadUserProgress(),
        this.preloadReviewItems(),

        // 統計データ
        this.preloadStatistics(),
      ];

      await Promise.allSettled(preloadTasks);
      console.log("[OfflineCacheService] 重要データプリロード完了");
    } catch (error) {
      console.warn("[OfflineCacheService] プリロードエラー:", error);
    }
  }

  /**
   * 問題データのプリロード
   */
  private async preloadQuestions(): Promise<void> {
    try {
      const questions = await database.executeQuery(`
        SELECT id, type, difficulty, category_id, title, statement,
               options, correct_answer, explanation
        FROM questions
        ORDER BY difficulty ASC, id ASC
        LIMIT 100
      `);

      if (questions.rows && questions.rows.length > 0) {
        await this.set(this.cacheKeys.questions, questions.rows, {
          expiresIn: this.config.maxCacheAge,
          priority: "high",
        });
      }
    } catch (error) {
      console.warn("[OfflineCacheService] 問題プリロードエラー:", error);
    }
  }

  /**
   * カテゴリデータのプリロード
   */
  private async preloadCategories(): Promise<void> {
    try {
      const categories = await database.executeQuery(`
        SELECT id, name, description, parent_id, sort_order
        FROM categories
        ORDER BY sort_order ASC
      `);

      if (categories.rows && categories.rows.length > 0) {
        await this.set(this.cacheKeys.categories, categories.rows, {
          expiresIn: this.config.maxCacheAge * 2, // 長期キャッシュ
          priority: "high",
        });
      }
    } catch (error) {
      console.warn("[OfflineCacheService] カテゴリプリロードエラー:", error);
    }
  }

  /**
   * 勘定科目データのプリロード
   */
  private async preloadAccountItems(): Promise<void> {
    try {
      const accounts = await database.executeQuery(`
        SELECT id, name, category, normal_balance
        FROM account_items
        ORDER BY category, name
      `);

      if (accounts.rows && accounts.rows.length > 0) {
        await this.set(this.cacheKeys.account_items, accounts.rows, {
          expiresIn: this.config.maxCacheAge * 2, // 長期キャッシュ
          priority: "high",
        });
      }
    } catch (error) {
      console.warn("[OfflineCacheService] 勘定科目プリロードエラー:", error);
    }
  }

  /**
   * ユーザー進捗のプリロード
   */
  private async preloadUserProgress(): Promise<void> {
    try {
      const progress = await database.executeQuery(`
        SELECT category_id, total_questions, correct_answers, accuracy_rate,
               last_updated
        FROM user_progress
        ORDER BY last_updated DESC
      `);

      if (progress.rows && progress.rows.length > 0) {
        await this.set(this.cacheKeys.user_progress, progress.rows, {
          expiresIn: 60 * 60 * 1000, // 1時間
          priority: "high",
        });
      }
    } catch (error) {
      console.warn(
        "[OfflineCacheService] ユーザー進捗プリロードエラー:",
        error,
      );
    }
  }

  /**
   * 復習アイテムのプリロード
   */
  private async preloadReviewItems(): Promise<void> {
    try {
      const reviewItems = await database.executeQuery(`
        SELECT ri.*, q.title, q.type, q.difficulty
        FROM review_items ri
        JOIN questions q ON ri.question_id = q.id
        WHERE ri.status = 'active'
        ORDER BY ri.priority DESC, ri.next_review_date ASC
        LIMIT 50
      `);

      if (reviewItems.rows && reviewItems.rows.length > 0) {
        await this.set(this.cacheKeys.review_items, reviewItems.rows, {
          expiresIn: 30 * 60 * 1000, // 30分
          priority: "high",
        });
      }
    } catch (error) {
      console.warn(
        "[OfflineCacheService] 復習アイテムプリロードエラー:",
        error,
      );
    }
  }

  /**
   * 統計データのプリロード
   */
  private async preloadStatistics(): Promise<void> {
    try {
      const statsService = StatisticsService.getInstance();
      const stats = await statsService.getOverallStatistics();

      await this.set(this.cacheKeys.statistics, stats, {
        expiresIn: 15 * 60 * 1000, // 15分
        priority: "normal",
      });
    } catch (error) {
      console.warn("[OfflineCacheService] 統計プリロードエラー:", error);
    }
  }

  /**
   * キャッシュの期限切れ確認
   */
  private isCacheExpired(entry: CacheEntry): boolean {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  /**
   * キャッシュアクセスの記録
   */
  private recordCacheAccess(key: string): void {
    const now = Date.now();

    // メモリキャッシュの更新
    const entry = this.memoryCache.get(key);
    if (entry) {
      entry.accessCount++;
      entry.lastAccessed = now;
    }

    // アクセスログの更新
    const accesses = this.accessLog.get(key) || [];
    accesses.push(now);

    // 直近100回のアクセスのみ保持
    if (accesses.length > 100) {
      accesses.splice(0, accesses.length - 100);
    }

    this.accessLog.set(key, accesses);
  }

  /**
   * キャッシュサイズの管理
   */
  private async enforceCacheSize(): Promise<void> {
    const currentSize = this.getCurrentCacheSize();

    if (currentSize > this.config.maxCacheSize) {
      await this.evictLeastRecentlyUsed();
    }
  }

  /**
   * 現在のキャッシュサイズ計算
   */
  private getCurrentCacheSize(): number {
    let totalSize = 0;
    for (const entry of this.memoryCache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  /**
   * LRU方式でのキャッシュ削除
   */
  private async evictLeastRecentlyUsed(): Promise<void> {
    const entries = Array.from(this.memoryCache.entries());

    // 最後のアクセス時間順でソート
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    // 下位25%を削除
    const evictCount = Math.ceil(entries.length * 0.25);

    for (let i = 0; i < evictCount; i++) {
      const [key] = entries[i];
      this.memoryCache.delete(key);

      // SQLiteからも削除
      try {
        await database.executeQuery(
          "DELETE FROM cache_data WHERE cache_key = ?",
          [key],
        );
      } catch (error) {
        console.warn(
          `[OfflineCacheService] SQLiteキャッシュ削除エラー (${key}):`,
          error,
        );
      }
    }

    console.log(`[OfflineCacheService] LRU削除完了: ${evictCount}エントリ`);
  }

  /**
   * 期限切れキャッシュのクリーンアップ
   */
  private async cleanupExpiredCache(): Promise<void> {
    try {
      const now = Date.now();

      // メモリキャッシュの期限切れ削除
      for (const [key, entry] of this.memoryCache.entries()) {
        if (this.isCacheExpired(entry)) {
          this.memoryCache.delete(key);
        }
      }

      // SQLiteの期限切れ削除
      await database.executeQuery(
        "DELETE FROM cache_data WHERE expires_at IS NOT NULL AND expires_at < ?",
        [now],
      );

      console.log("[OfflineCacheService] 期限切れキャッシュクリーンアップ完了");
    } catch (error) {
      console.error("[OfflineCacheService] クリーンアップエラー:", error);
    }
  }

  /**
   * メモリキャッシュの復元
   */
  private async restoreMemoryCache(): Promise<void> {
    try {
      const query = `
        SELECT cache_key, data, timestamp, size, access_count, 
               last_accessed, expires_at, metadata
        FROM cache_data
        WHERE expires_at IS NULL OR expires_at > ?
        ORDER BY access_count DESC, last_accessed DESC
        LIMIT 50
      `;

      const result = await database.executeQuery(query, [Date.now()]);

      if (result.rows) {
        for (const row of result.rows) {
          const entry: CacheEntry = {
            id: `restored_${row.cache_key}`,
            key: row.cache_key,
            data: JSON.parse(row.data),
            timestamp: row.timestamp,
            size: row.size,
            accessCount: row.access_count,
            lastAccessed: row.last_accessed,
            expiresAt: row.expires_at,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
          };

          this.memoryCache.set(row.cache_key, entry);
        }
      }

      console.log(
        `[OfflineCacheService] メモリキャッシュ復元完了: ${this.memoryCache.size}エントリ`,
      );
    } catch (error) {
      console.warn("[OfflineCacheService] メモリキャッシュ復元エラー:", error);
    }
  }

  /**
   * 設定の読み込み
   */
  private async loadConfig(): Promise<void> {
    try {
      const savedConfig = await AsyncStorage.getItem("offline_cache_config");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn("[OfflineCacheService] 設定読み込みエラー:", error);
    }
  }

  /**
   * キャッシュ統計の更新
   */
  private async updateCacheStats(): Promise<void> {
    try {
      const result = await database.executeQuery(`
        SELECT 
          COUNT(*) as total_entries,
          SUM(size) as total_size,
          MIN(timestamp) as oldest_entry,
          MAX(timestamp) as newest_entry
        FROM cache_data
      `);

      if (result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        this.cacheStats = {
          totalEntries: row.total_entries || 0,
          totalSize: row.total_size || 0,
          oldestEntry: row.oldest_entry || 0,
          newestEntry: row.newest_entry || 0,
          hitRate: this.calculateHitRate(),
        };
      }
    } catch (error) {
      console.warn("[OfflineCacheService] 統計更新エラー:", error);
    }
  }

  /**
   * 同期版キャッシュ統計更新
   */
  private updateCacheStatsSync(): void {
    let totalSize = 0;
    let totalEntries = 0;
    let oldestEntry = Number.MAX_SAFE_INTEGER;
    let newestEntry = 0;

    for (const entry of this.memoryCache.values()) {
      totalSize += entry.size;
      totalEntries++;
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
    }

    this.cacheStats = {
      totalSize,
      totalEntries,
      oldestEntry: oldestEntry === Number.MAX_SAFE_INTEGER ? 0 : oldestEntry,
      newestEntry,
      hitRate: this.calculateHitRate(),
    };
  }

  /**
   * ヒット率の計算
   */
  private calculateHitRate(): number {
    let totalAccesses = 0;
    let totalHits = 0;

    for (const accesses of this.accessLog.values()) {
      totalAccesses += accesses.length;
      totalHits += accesses.length; // アクセスログに記録された = ヒット
    }

    return totalAccesses > 0 ? (totalHits / totalAccesses) * 100 : 0;
  }

  /**
   * 特定キーのキャッシュ削除
   */
  public async invalidate(key: string): Promise<void> {
    try {
      // メモリキャッシュから削除
      this.memoryCache.delete(key);

      // SQLiteキャッシュから削除
      await database.executeQuery(
        "DELETE FROM cache_data WHERE cache_key = ?",
        [key],
      );

      // アクセスログからも削除
      this.accessLog.delete(key);

      console.log(`[OfflineCacheService] キャッシュ無効化完了: ${key}`);
    } catch (error) {
      console.error(
        `[OfflineCacheService] キャッシュ無効化エラー (${key}):`,
        error,
      );
    }
  }

  /**
   * パターンマッチでのキャッシュ削除
   */
  public async invalidatePattern(pattern: string): Promise<void> {
    try {
      const regex = new RegExp(pattern);
      const keysToDelete: string[] = [];

      // メモリキャッシュから該当キーを特定
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          keysToDelete.push(key);
        }
      }

      // 削除実行
      for (const key of keysToDelete) {
        await this.invalidate(key);
      }

      console.log(
        `[OfflineCacheService] パターンキャッシュ無効化完了: ${pattern} (${keysToDelete.length}件)`,
      );
    } catch (error) {
      console.error(
        `[OfflineCacheService] パターンキャッシュ無効化エラー (${pattern}):`,
        error,
      );
    }
  }

  /**
   * 全キャッシュクリア
   */
  public async clear(): Promise<void> {
    try {
      // メモリキャッシュクリア
      this.memoryCache.clear();

      // SQLiteキャッシュクリア
      await database.executeQuery("DELETE FROM cache_data");

      // アクセスログクリア
      this.accessLog.clear();

      // 統計リセット
      this.cacheStats = {
        totalSize: 0,
        totalEntries: 0,
        hitRate: 0,
        oldestEntry: 0,
        newestEntry: 0,
      };

      console.log("[OfflineCacheService] 全キャッシュクリア完了");
    } catch (error) {
      console.error("[OfflineCacheService] 全キャッシュクリアエラー:", error);
    }
  }

  /**
   * キャッシュ統計の取得
   */
  public getCacheStats(): CacheStats {
    return { ...this.cacheStats };
  }

  /**
   * 設定の取得
   */
  public getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * 設定の更新
   */
  public async updateConfig(newConfig: Partial<CacheConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      await AsyncStorage.setItem(
        "offline_cache_config",
        JSON.stringify(this.config),
      );
      console.log("[OfflineCacheService] 設定更新完了");
    } catch (error) {
      console.error("[OfflineCacheService] 設定更新エラー:", error);
    }
  }

  /**
   * リソースのクリーンアップ
   */
  public async cleanup(): Promise<void> {
    try {
      await this.cleanupExpiredCache();
      this.memoryCache.clear();
      this.accessLog.clear();
      this.isInitialized = false;
      console.log("[OfflineCacheService] クリーンアップ完了");
    } catch (error) {
      console.error("[OfflineCacheService] クリーンアップエラー:", error);
    }
  }
}

// シングルトンインスタンスのエクスポート
export const offlineCacheService = OfflineCacheService.getInstance();
