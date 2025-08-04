/**
 * メモリ最適化サービス
 * 簿記3級問題集アプリ - Step 4.1: パフォーマンス最適化
 *
 * 主な最適化:
 * - メモリ使用量監視
 * - 自動ガベージコレクション
 * - オブジェクトプール
 * - 大きなデータ構造の効率的管理
 */

/**
 * メモリ使用量統計
 */
export interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
  timestamp: number;
}

/**
 * オブジェクトプール設定
 */
interface PoolConfig<T> {
  maxSize: number;
  factory: () => T;
  reset?: (obj: T) => void;
  validate?: (obj: T) => boolean;
}

/**
 * メモリ警告しきい値
 */
const MEMORY_WARNING_THRESHOLDS = {
  LOW: 0.6, // 60%
  MEDIUM: 0.75, // 75%
  HIGH: 0.85, // 85%
  CRITICAL: 0.95, // 95%
};

/**
 * メモリ最適化サービスクラス
 */
export class MemoryOptimizer {
  private static instance: MemoryOptimizer;

  // オブジェクトプール
  private objectPools = new Map<string, any[]>();
  private poolConfigs = new Map<string, PoolConfig<any>>();

  // メモリ監視
  private memoryStats: MemoryStats[] = [];
  private readonly MAX_STATS_HISTORY = 100;
  private monitoringInterval: NodeJS.Timeout | null = null;

  // 弱参照マップ（メモリリーク防止）
  private weakRefs = new Set<WeakRef<any>>();

  // 大きなデータのキャッシュ
  private largeDataCache = new Map<
    string,
    { data: any; lastAccessed: number; size: number }
  >();
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private currentCacheSize = 0;

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  /**
   * メモリ監視開始
   */
  public startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      return; // 既に監視中
    }

    console.log("[MemoryOptimizer] メモリ監視開始");

    this.monitoringInterval = setInterval(() => {
      this.collectMemoryStats();
      this.checkMemoryPressure();
      this.performAutomaticCleanup();
    }, intervalMs);

    // 初回実行
    this.collectMemoryStats();
  }

  /**
   * メモリ監視停止
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log("[MemoryOptimizer] メモリ監視停止");
    }
  }

  /**
   * メモリ統計収集
   */
  private collectMemoryStats(): void {
    if (typeof performance === "undefined" || !(performance as any).memory) {
      return; // ブラウザ環境以外では利用不可
    }

    const memory = (performance as any).memory;
    const stats: MemoryStats = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
      timestamp: Date.now(),
    };

    this.memoryStats.push(stats);

    // 履歴サイズ制限
    if (this.memoryStats.length > this.MAX_STATS_HISTORY) {
      this.memoryStats.shift();
    }

    // デバッグ用ログ（開発時のみ）
    if (__DEV__ && stats.usagePercentage > MEMORY_WARNING_THRESHOLDS.MEDIUM) {
      console.warn(
        `[MemoryOptimizer] メモリ使用率: ${(stats.usagePercentage * 100).toFixed(1)}%`,
      );
    }
  }

  /**
   * メモリ圧迫チェック
   */
  private checkMemoryPressure(): void {
    const currentStats = this.getCurrentMemoryStats();
    if (!currentStats) return;

    const usage = currentStats.usagePercentage;

    if (usage > MEMORY_WARNING_THRESHOLDS.CRITICAL) {
      console.error("[MemoryOptimizer] 重要: メモリ使用量が危険レベルです");
      this.performEmergencyCleanup();
    } else if (usage > MEMORY_WARNING_THRESHOLDS.HIGH) {
      console.warn("[MemoryOptimizer] 警告: メモリ使用量が高レベルです");
      this.performAggressiveCleanup();
    } else if (usage > MEMORY_WARNING_THRESHOLDS.MEDIUM) {
      console.info("[MemoryOptimizer] 注意: メモリ使用量が中レベルです");
      this.performMildCleanup();
    }
  }

  /**
   * 自動クリーンアップ実行
   */
  private performAutomaticCleanup(): void {
    // 弱参照のクリーンアップ
    this.cleanupWeakRefs();

    // オブジェクトプールの最適化
    this.optimizeObjectPools();

    // 大きなデータキャッシュの整理
    this.cleanupLargeDataCache();
  }

  /**
   * 軽度なクリーンアップ
   */
  private performMildCleanup(): void {
    console.log("[MemoryOptimizer] 軽度クリーンアップ実行");

    // 古いキャッシュエントリの削除
    this.evictOldCacheEntries(0.1); // 10%削除

    // オブジェクトプールの縮小
    this.shrinkObjectPools(0.2); // 20%縮小
  }

  /**
   * 積極的なクリーンアップ
   */
  private performAggressiveCleanup(): void {
    console.log("[MemoryOptimizer] 積極的クリーンアップ実行");

    // より多くのキャッシュエントリを削除
    this.evictOldCacheEntries(0.3); // 30%削除

    // オブジェクトプールの大幅縮小
    this.shrinkObjectPools(0.5); // 50%縮小

    // 手動ガベージコレクション（可能な場合）
    this.triggerGarbageCollection();
  }

  /**
   * 緊急クリーンアップ
   */
  private performEmergencyCleanup(): void {
    console.error("[MemoryOptimizer] 緊急クリーンアップ実行");

    // ほぼ全てのキャッシュをクリア
    this.evictOldCacheEntries(0.8); // 80%削除

    // オブジェクトプールをほぼ空に
    this.shrinkObjectPools(0.9); // 90%縮小

    // 全ての弱参照をクリア
    this.clearWeakRefs();

    // 強制ガベージコレクション
    this.triggerGarbageCollection();
  }

  /**
   * オブジェクトプール作成
   */
  public createObjectPool<T>(name: string, config: PoolConfig<T>): void {
    if (this.objectPools.has(name)) {
      console.warn(
        `[MemoryOptimizer] オブジェクトプール '${name}' は既に存在します`,
      );
      return;
    }

    this.objectPools.set(name, []);
    this.poolConfigs.set(name, config);

    console.log(
      `[MemoryOptimizer] オブジェクトプール '${name}' を作成 (maxSize: ${config.maxSize})`,
    );
  }

  /**
   * オブジェクトプールから取得
   */
  public borrowFromPool<T>(name: string): T | null {
    const pool = this.objectPools.get(name);
    const config = this.poolConfigs.get(name) as PoolConfig<T>;

    if (!pool || !config) {
      console.warn(
        `[MemoryOptimizer] オブジェクトプール '${name}' が見つかりません`,
      );
      return null;
    }

    // プールから既存オブジェクトを取得
    let obj = pool.pop();

    if (obj) {
      // バリデーション
      if (config.validate && !config.validate(obj)) {
        obj = null;
      }
    }

    // プールが空の場合は新規作成
    if (!obj) {
      obj = config.factory();
    }

    return obj as T;
  }

  /**
   * オブジェクトプールに返却
   */
  public returnToPool<T>(name: string, obj: T): void {
    const pool = this.objectPools.get(name);
    const config = this.poolConfigs.get(name) as PoolConfig<T>;

    if (!pool || !config) {
      return;
    }

    // プールサイズ制限チェック
    if (pool.length >= config.maxSize) {
      return; // プールが満杯なので破棄
    }

    // オブジェクトのリセット
    if (config.reset) {
      config.reset(obj);
    }

    // プールに追加
    pool.push(obj);
  }

  /**
   * 大きなデータのキャッシュ
   */
  public cacheLargeData(key: string, data: any): void {
    const size = this.estimateObjectSize(data);

    // キャッシュサイズ制限チェック
    if (this.currentCacheSize + size > this.MAX_CACHE_SIZE) {
      this.evictOldCacheEntries(0.3); // 30%削除してスペース確保
    }

    // 既存エントリの削除
    if (this.largeDataCache.has(key)) {
      const oldEntry = this.largeDataCache.get(key)!;
      this.currentCacheSize -= oldEntry.size;
    }

    // 新しいエントリの追加
    this.largeDataCache.set(key, {
      data,
      lastAccessed: Date.now(),
      size,
    });

    this.currentCacheSize += size;

    console.log(
      `[MemoryOptimizer] 大きなデータキャッシュ: ${key} (${(size / 1024).toFixed(1)}KB)`,
    );
  }

  /**
   * 大きなデータの取得
   */
  public getLargeData(key: string): any | null {
    const entry = this.largeDataCache.get(key);

    if (!entry) {
      return null;
    }

    // アクセス時刻更新
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  /**
   * 弱参照の追加
   */
  public addWeakRef<T extends object>(obj: T): WeakRef<T> {
    const weakRef = new WeakRef(obj);
    this.weakRefs.add(weakRef);
    return weakRef;
  }

  /**
   * 弱参照のクリーンアップ
   */
  private cleanupWeakRefs(): void {
    let cleanedCount = 0;

    this.weakRefs.forEach((weakRef) => {
      if (weakRef.deref() === undefined) {
        this.weakRefs.delete(weakRef);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(
        `[MemoryOptimizer] 弱参照クリーンアップ: ${cleanedCount}件削除`,
      );
    }
  }

  /**
   * 弱参照の全クリア
   */
  private clearWeakRefs(): void {
    const count = this.weakRefs.size;
    this.weakRefs.clear();
    console.log(`[MemoryOptimizer] 弱参照全クリア: ${count}件削除`);
  }

  /**
   * オブジェクトプールの最適化
   */
  private optimizeObjectPools(): void {
    this.objectPools.forEach((pool, name) => {
      const config = this.poolConfigs.get(name);
      if (!config) return;

      // プールサイズが最大の80%を超えている場合は縮小
      if (pool.length > config.maxSize * 0.8) {
        const removeCount = Math.floor(pool.length * 0.2);
        pool.splice(0, removeCount);
        console.log(
          `[MemoryOptimizer] オブジェクトプール '${name}' を${removeCount}件縮小`,
        );
      }
    });
  }

  /**
   * オブジェクトプールの縮小
   */
  private shrinkObjectPools(ratio: number): void {
    this.objectPools.forEach((pool, name) => {
      const removeCount = Math.floor(pool.length * ratio);
      if (removeCount > 0) {
        pool.splice(0, removeCount);
        console.log(
          `[MemoryOptimizer] オブジェクトプール '${name}' を${removeCount}件削除`,
        );
      }
    });
  }

  /**
   * 大きなデータキャッシュのクリーンアップ
   */
  private cleanupLargeDataCache(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10分
    let removedCount = 0;
    let freedSize = 0;

    this.largeDataCache.forEach((entry, key) => {
      if (now - entry.lastAccessed > maxAge) {
        this.largeDataCache.delete(key);
        this.currentCacheSize -= entry.size;
        removedCount++;
        freedSize += entry.size;
      }
    });

    if (removedCount > 0) {
      console.log(
        `[MemoryOptimizer] 古いキャッシュ削除: ${removedCount}件 (${(freedSize / 1024).toFixed(1)}KB解放)`,
      );
    }
  }

  /**
   * 古いキャッシュエントリの削除
   */
  private evictOldCacheEntries(ratio: number): void {
    const entries = Array.from(this.largeDataCache.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed,
    );

    const removeCount = Math.floor(entries.length * ratio);
    let freedSize = 0;

    for (let i = 0; i < removeCount; i++) {
      const [key, entry] = entries[i];
      this.largeDataCache.delete(key);
      this.currentCacheSize -= entry.size;
      freedSize += entry.size;
    }

    if (removeCount > 0) {
      console.log(
        `[MemoryOptimizer] キャッシュ削除: ${removeCount}件 (${(freedSize / 1024).toFixed(1)}KB解放)`,
      );
    }
  }

  /**
   * ガベージコレクションのトリガー
   */
  private triggerGarbageCollection(): void {
    if (typeof global !== "undefined" && global.gc) {
      console.log("[MemoryOptimizer] 手動ガベージコレクション実行");
      global.gc();
    } else {
      console.log("[MemoryOptimizer] ガベージコレクション利用不可");
    }
  }

  /**
   * オブジェクトサイズの推定
   */
  private estimateObjectSize(obj: any): number {
    try {
      const jsonStr = JSON.stringify(obj);
      return jsonStr.length * 2; // UTF-16で概算
    } catch {
      return 1024; // デフォルト値
    }
  }

  /**
   * 現在のメモリ統計取得
   */
  public getCurrentMemoryStats(): MemoryStats | null {
    return this.memoryStats[this.memoryStats.length - 1] || null;
  }

  /**
   * メモリ統計履歴取得
   */
  public getMemoryStatsHistory(): MemoryStats[] {
    return [...this.memoryStats];
  }

  /**
   * メモリ最適化状況の取得
   */
  public getOptimizationStatus() {
    const currentStats = this.getCurrentMemoryStats();

    return {
      memoryStats: currentStats,
      objectPools: {
        count: this.objectPools.size,
        totalObjects: Array.from(this.objectPools.values()).reduce(
          (sum, pool) => sum + pool.length,
          0,
        ),
      },
      largeDataCache: {
        count: this.largeDataCache.size,
        totalSizeKB: Math.round(this.currentCacheSize / 1024),
        maxSizeKB: Math.round(this.MAX_CACHE_SIZE / 1024),
        usagePercentage: this.currentCacheSize / this.MAX_CACHE_SIZE,
      },
      weakRefs: {
        count: this.weakRefs.size,
      },
      isMonitoring: this.monitoringInterval !== null,
    };
  }

  /**
   * メモリ最適化の停止・クリーンアップ
   */
  public shutdown(): void {
    console.log("[MemoryOptimizer] シャットダウン開始");

    this.stopMonitoring();
    this.objectPools.clear();
    this.poolConfigs.clear();
    this.largeDataCache.clear();
    this.weakRefs.clear();
    this.memoryStats.length = 0;
    this.currentCacheSize = 0;

    console.log("[MemoryOptimizer] シャットダウン完了");
  }
}

/**
 * メモリ最適化サービスのシングルトンインスタンス
 */
export const memoryOptimizer = MemoryOptimizer.getInstance();
