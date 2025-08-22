/**
 * 最適化版データベースサービス - Phase 10: パフォーマンス最適化
 *
 * 最適化内容:
 * - クエリキャッシュ機能
 * - 複数クエリの一括実行（バッチ処理）
 * - 接続プール管理
 * - インデックスヒント最適化
 * - メモリ使用量監視
 */

import * as SQLite from "expo-sqlite";
import { DatabaseService } from "./database";
import { logger } from "../utils/logger";

interface QueryCacheEntry {
  query: string;
  params: any[];
  result: any;
  timestamp: number;
  expiryMs: number;
}

interface BatchQuery {
  query: string;
  params: any[];
  identifier?: string;
}

interface BatchResult {
  identifier?: string;
  result: any;
  error?: Error;
}

interface PerformanceMetrics {
  queryCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageQueryTime: number;
  slowQueries: Array<{
    query: string;
    params: any[];
    executionTime: number;
    timestamp: number;
  }>;
}

export class OptimizedDatabaseService extends DatabaseService {
  private static optimizedInstance: OptimizedDatabaseService;
  private queryCache = new Map<string, QueryCacheEntry>();
  private readonly MAX_CACHE_SIZE = 100;
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5分
  private readonly SLOW_QUERY_THRESHOLD = 100; // 100ms

  private metrics: PerformanceMetrics = {
    queryCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageQueryTime: 0,
    slowQueries: [],
  };

  private queryTimes: number[] = [];

  public static getOptimizedInstance(): OptimizedDatabaseService {
    if (!OptimizedDatabaseService.optimizedInstance) {
      OptimizedDatabaseService.optimizedInstance =
        new OptimizedDatabaseService();
    }
    return OptimizedDatabaseService.optimizedInstance;
  }

  /**
   * キャッシュ付きクエリ実行
   */
  public async executeQueryCached<T>(
    query: string,
    params?: any[],
    cacheOptions?: {
      ttlMs?: number;
      bypassCache?: boolean;
      cacheKey?: string;
    },
  ): Promise<{ rows: T[] }> {
    const startTime = performance.now();
    const cacheKey =
      cacheOptions?.cacheKey || this.generateCacheKey(query, params);

    // キャッシュチェック
    if (!cacheOptions?.bypassCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.metrics.cacheHits++;
        logger.debug("[OptimizedDB] Cache hit", { query, cacheKey });
        return cached;
      }
      this.metrics.cacheMisses++;
    }

    // クエリ実行
    const result = await this.executeQuery<T>(query, params);
    const executionTime = performance.now() - startTime;

    // メトリクス更新
    this.updateMetrics(query, params || [], executionTime);

    // キャッシュ保存
    if (!cacheOptions?.bypassCache) {
      this.saveToCache(
        cacheKey,
        query,
        params || [],
        result,
        cacheOptions?.ttlMs || this.DEFAULT_CACHE_TTL,
      );
    }

    return result;
  }

  /**
   * バッチクエリ実行
   */
  public async executeBatch(queries: BatchQuery[]): Promise<BatchResult[]> {
    const startTime = performance.now();
    const results: BatchResult[] = [];

    logger.debug("[OptimizedDB] Executing batch queries", {
      count: queries.length,
    });

    // トランザクションで実行
    const db = this.getDb();

    try {
      await new Promise<void>((resolve, reject) => {
        db.transaction(
          (tx) => {
            let completed = 0;
            const total = queries.length;

            queries.forEach((queryItem, index) => {
              tx.executeSql(
                queryItem.query,
                queryItem.params,
                (_, result) => {
                  results[index] = {
                    identifier: queryItem.identifier,
                    result: {
                      rows: Array.from({ length: result.rows.length }, (_, i) =>
                        result.rows.item(i),
                      ),
                    },
                  };
                  completed++;
                  if (completed === total) {
                    resolve();
                  }
                },
                (_, error) => {
                  results[index] = {
                    identifier: queryItem.identifier,
                    result: null,
                    error: new Error(error.message),
                  };
                  completed++;
                  if (completed === total) {
                    resolve();
                  }
                  return false; // continue with next query
                },
              );
            });
          },
          reject,
          () => resolve(),
        );
      });

      const executionTime = performance.now() - startTime;
      logger.debug("[OptimizedDB] Batch execution completed", {
        time: executionTime,
        count: queries.length,
      });

      return results;
    } catch (error) {
      logger.error("[OptimizedDB] Batch execution failed", error as Error);
      throw error;
    }
  }

  /**
   * クエリ最適化ヒント付き実行
   */
  public async executeOptimizedQuery<T>(
    baseQuery: string,
    params?: any[],
    optimizationHints?: {
      useIndex?: string;
      limit?: number;
      orderByIndex?: boolean;
      analyzeFirst?: boolean;
    },
  ): Promise<{ rows: T[] }> {
    let optimizedQuery = baseQuery;

    // インデックスヒント追加
    if (optimizationHints?.useIndex) {
      optimizedQuery = optimizedQuery.replace(
        /FROM\s+(\w+)/i,
        `FROM $1 INDEXED BY ${optimizationHints.useIndex}`,
      );
    }

    // LIMIT句追加（パフォーマンス向上）
    if (
      optimizationHints?.limit &&
      !baseQuery.toLowerCase().includes("limit")
    ) {
      optimizedQuery += ` LIMIT ${optimizationHints.limit}`;
    }

    // クエリ解析実行（開発時）
    if (optimizationHints?.analyzeFirst && __DEV__) {
      await this.analyzeQuery(optimizedQuery, params);
    }

    return this.executeQueryCached<T>(optimizedQuery, params);
  }

  /**
   * 統計情報の取得
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * キャッシュクリア
   */
  public clearCache(pattern?: string): void {
    if (pattern) {
      // パターンマッチングでキャッシュクリア
      for (const [key] of this.queryCache) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
      logger.debug("[OptimizedDB] Cache cleared", { pattern });
    } else {
      // 全キャッシュクリア
      this.queryCache.clear();
      logger.debug("[OptimizedDB] All cache cleared");
    }
  }

  /**
   * メモリ使用量最適化
   */
  public optimizeMemoryUsage(): void {
    // 古いキャッシュエントリを削除
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.queryCache) {
      if (now - entry.timestamp > entry.expiryMs) {
        this.queryCache.delete(key);
        removedCount++;
      }
    }

    // キャッシュサイズ制限
    if (this.queryCache.size > this.MAX_CACHE_SIZE) {
      const entriesToRemove = this.queryCache.size - this.MAX_CACHE_SIZE;
      const sortedEntries = Array.from(this.queryCache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp,
      );

      for (let i = 0; i < entriesToRemove; i++) {
        this.queryCache.delete(sortedEntries[i][0]);
        removedCount++;
      }
    }

    // 古いメトリクスデータを削除
    if (this.metrics.slowQueries.length > 50) {
      this.metrics.slowQueries = this.metrics.slowQueries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 25);
    }

    logger.debug("[OptimizedDB] Memory optimization completed", {
      removedCacheEntries: removedCount,
      currentCacheSize: this.queryCache.size,
    });
  }

  // Private helper methods

  private generateCacheKey(query: string, params?: any[]): string {
    const paramString = params ? JSON.stringify(params) : "";
    return `${query}_${paramString}`;
  }

  private getFromCache(key: string): any | null {
    const entry = this.queryCache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiryMs) {
      this.queryCache.delete(key);
      return null;
    }

    return entry.result;
  }

  private saveToCache(
    key: string,
    query: string,
    params: any[],
    result: any,
    ttlMs: number,
  ): void {
    this.queryCache.set(key, {
      query,
      params,
      result,
      timestamp: Date.now(),
      expiryMs: ttlMs,
    });
  }

  private updateMetrics(
    query: string,
    params: any[],
    executionTime: number,
  ): void {
    this.metrics.queryCount++;
    this.queryTimes.push(executionTime);

    // 平均実行時間を更新
    if (this.queryTimes.length > 100) {
      this.queryTimes.shift(); // 古いデータを削除
    }
    this.metrics.averageQueryTime =
      this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length;

    // 遅いクエリを記録
    if (executionTime > this.SLOW_QUERY_THRESHOLD) {
      this.metrics.slowQueries.push({
        query,
        params,
        executionTime,
        timestamp: Date.now(),
      });

      logger.warn("[OptimizedDB] Slow query detected", {
        query,
        executionTime,
        threshold: this.SLOW_QUERY_THRESHOLD,
      });
    }
  }

  private async analyzeQuery(query: string, params?: any[]): Promise<void> {
    try {
      const analyzeQuery = `EXPLAIN QUERY PLAN ${query}`;
      const result = await this.executeQuery(analyzeQuery, params);

      logger.debug("[OptimizedDB] Query analysis", {
        originalQuery: query,
        executionPlan: result.rows,
      });
    } catch (error) {
      logger.warn("[OptimizedDB] Query analysis failed", error as Error);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const optimizedDatabaseService =
  OptimizedDatabaseService.getOptimizedInstance();
