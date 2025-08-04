/**
 * 統計データキャッシュサービス
 * 簿記3級問題集アプリ - 統計計算パフォーマンス最適化
 * Step 3.1: 学習統計機能実装 - パフォーマンス最適化
 */

import { OverallStatistics, CategoryStatistics, LearningGoals, DailyStatistics } from './statistics-service';

/**
 * キャッシュエントリ
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * キャッシュキー
 */
type CacheKey = 
  | 'overall_stats'
  | 'category_stats'
  | 'learning_goals'
  | `daily_stats_${number}` // daily_stats_{days}
  | `category_${string}_stats`; // category_{categoryId}_stats

/**
 * 統計キャッシュサービスクラス
 */
export class StatisticsCacheService {
  private cache = new Map<CacheKey, CacheEntry<any>>();
  
  // キャッシュ有効期限設定（ミリ秒）
  private readonly cacheConfig = {
    overall_stats: 5 * 60 * 1000,      // 5分
    category_stats: 5 * 60 * 1000,     // 5分
    learning_goals: 60 * 1000,         // 1分（目標は頻繁に更新）
    daily_stats: 10 * 60 * 1000,       // 10分
    category_specific: 5 * 60 * 1000   // 5分
  };

  /**
   * キャッシュから統計データ取得
   */
  public get<T>(key: CacheKey): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // 有効期限チェック
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`[StatisticsCache] キャッシュヒット: ${key}`);
    return entry.data;
  }

  /**
   * 統計データをキャッシュに保存
   */
  public set<T>(key: CacheKey, data: T): void {
    const now = Date.now();
    const ttl = this.getTTL(key);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    this.cache.set(key, entry);
    console.log(`[StatisticsCache] キャッシュ保存: ${key}, TTL: ${ttl}ms`);
    
    // メモリ使用量管理
    this.cleanupExpiredEntries();
  }

  /**
   * 全体統計キャッシュ操作
   */
  public getOverallStats(): OverallStatistics | null {
    return this.get<OverallStatistics>('overall_stats');
  }

  public setOverallStats(stats: OverallStatistics): void {
    this.set('overall_stats', stats);
  }

  /**
   * カテゴリ別統計キャッシュ操作
   */
  public getCategoryStats(): CategoryStatistics[] | null {
    return this.get<CategoryStatistics[]>('category_stats');
  }

  public setCategoryStats(stats: CategoryStatistics[]): void {
    this.set('category_stats', stats);
  }

  /**
   * 学習目標キャッシュ操作
   */
  public getLearningGoals(): LearningGoals | null {
    return this.get<LearningGoals>('learning_goals');
  }

  public setLearningGoals(goals: LearningGoals): void {
    this.set('learning_goals', goals);
  }

  /**
   * 日別統計キャッシュ操作
   */
  public getDailyStats(days: number): DailyStatistics[] | null {
    return this.get<DailyStatistics[]>(`daily_stats_${days}`);
  }

  public setDailyStats(days: number, stats: DailyStatistics[]): void {
    this.set(`daily_stats_${days}`, stats);
  }

  /**
   * 学習データ更新時のキャッシュ無効化
   */
  public invalidateOnAnswerSubmit(): void {
    console.log('[StatisticsCache] 解答記録によるキャッシュ無効化');
    
    // 影響を受ける統計キャッシュを削除
    const keysToInvalidate: CacheKey[] = [
      'overall_stats',
      'category_stats', 
      'learning_goals'
    ];
    
    keysToInvalidate.forEach(key => {
      this.cache.delete(key);
    });
    
    // 日別統計も無効化（当日分のみ）
    this.invalidateDailyStatsForToday();
  }

  /**
   * カテゴリ特定のキャッシュ無効化
   */
  public invalidateCategory(categoryId: string): void {
    console.log(`[StatisticsCache] カテゴリ特定キャッシュ無効化: ${categoryId}`);
    
    this.cache.delete(`category_${categoryId}_stats` as CacheKey);
    this.cache.delete('category_stats');
    this.cache.delete('overall_stats');
  }

  /**
   * 復習データ更新時のキャッシュ無効化
   */
  public invalidateOnReviewUpdate(): void {
    console.log('[StatisticsCache] 復習データ更新によるキャッシュ無効化');
    
    // 復習関連統計に影響するキャッシュを削除
    this.cache.delete('category_stats');
    this.cache.delete('overall_stats');
  }

  /**
   * 手動キャッシュクリア
   */
  public clearAll(): void {
    console.log('[StatisticsCache] 全キャッシュクリア');
    this.cache.clear();
  }

  /**
   * キャッシュ統計情報取得
   */
  public getCacheInfo() {
    const totalEntries = this.cache.size;
    const validEntries = Array.from(this.cache.values())
      .filter(entry => Date.now() <= entry.expiresAt).length;
    const expiredEntries = totalEntries - validEntries;
    
    const memoryUsage = this.estimateMemoryUsage();
    
    return {
      totalEntries,
      validEntries,
      expiredEntries,
      hitRate: this.calculateHitRate(),
      memoryUsageKB: Math.round(memoryUsage / 1024)
    };
  }

  /**
   * キャッシュTTL取得
   */
  private getTTL(key: CacheKey): number {
    if (key.startsWith('daily_stats_')) {
      return this.cacheConfig.daily_stats;
    }
    if (key.startsWith('category_')) {
      return this.cacheConfig.category_specific;
    }
    
    return this.cacheConfig[key as keyof typeof this.cacheConfig] || 
           this.cacheConfig.overall_stats;
  }

  /**
   * 期限切れエントリのクリーンアップ
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: CacheKey[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });
    
    if (expiredKeys.length > 0) {
      console.log(`[StatisticsCache] 期限切れエントリ削除: ${expiredKeys.length}件`);
    }
    
    // メモリ使用量チェック
    if (this.cache.size > 50) { // 最大50エントリ
      this.evictOldestEntries();
    }
  }

  /**
   * 当日の日別統計キャッシュ無効化
   */
  private invalidateDailyStatsForToday(): void {
    const keysToCheck = Array.from(this.cache.keys()).filter(key => 
      typeof key === 'string' && key.startsWith('daily_stats_')
    );
    
    keysToCheck.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * 古いエントリの削除（LRU的な動作）
   */
  private evictOldestEntries(): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, 10); // 古い10件を削除
    
    entries.forEach(([key]) => {
      this.cache.delete(key);
    });
    
    console.log(`[StatisticsCache] 古いエントリ削除: ${entries.length}件`);
  }

  /**
   * ヒット率計算（簡易版）
   */
  private calculateHitRate(): number {
    // 実装省略 - 実際にはアクセス履歴を記録して計算
    return 0.85; // 仮の値
  }

  /**
   * メモリ使用量推定
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    this.cache.forEach(entry => {
      // JSON文字列化してサイズ推定（概算）
      const jsonStr = JSON.stringify(entry.data);
      totalSize += jsonStr.length * 2; // UTF-16なので2バイト/文字
      totalSize += 100; // メタデータのオーバーヘッド
    });
    
    return totalSize;
  }

  /**
   * 定期的なメンテナンス
   */
  public performMaintenance(): void {
    console.log('[StatisticsCache] 定期メンテナンス開始');
    
    const beforeCount = this.cache.size;
    this.cleanupExpiredEntries();
    const afterCount = this.cache.size;
    
    const cacheInfo = this.getCacheInfo();
    
    console.log(`[StatisticsCache] メンテナンス完了: ${beforeCount} -> ${afterCount}エントリ`);
    console.log(`[StatisticsCache] メモリ使用量: ${cacheInfo.memoryUsageKB}KB`);
  }
}

/**
 * 統計キャッシュサービスのシングルトンインスタンス
 */
export const statisticsCache = new StatisticsCacheService();

// 定期メンテナンス（5分ごと）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    statisticsCache.performMaintenance();
  }, 5 * 60 * 1000);
}