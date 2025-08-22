/**
 * 最適化版基底Repositoryクラス - Phase 10: パフォーマンス最適化
 *
 * 最適化内容:
 * - OptimizedDatabaseService との統合
 * - クエリキャッシュ機能の活用
 * - バッチ処理最適化
 * - パフォーマンス監視の統合
 * - メモリ効率の改善
 */

import { optimizedDatabaseService } from "../database.optimized";
import { databaseService } from "../database";
import { DatabaseResult, QueryResult } from "../../types/database";
import { logger } from "../../utils/logger";

export interface RepositoryOptions {
  enableQueryCache?: boolean;
  cacheTimeoutMs?: number;
  enableBatchOptimization?: boolean;
  maxBatchSize?: number;
  enablePerformanceMonitoring?: boolean;
}

/**
 * 最適化版基底Repositoryクラス
 */
export abstract class OptimizedBaseRepository<T> {
  protected tableName: string;
  protected options: RepositoryOptions;
  private performanceMetrics = {
    queryCount: 0,
    totalQueryTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  constructor(tableName: string, options: RepositoryOptions = {}) {
    this.tableName = tableName;
    this.options = {
      enableQueryCache: true,
      cacheTimeoutMs: 5 * 60 * 1000, // 5分
      enableBatchOptimization: true,
      maxBatchSize: 100,
      enablePerformanceMonitoring: __DEV__,
      ...options,
    };
  }

  /**
   * パフォーマンス監視付きクエリ実行
   */
  protected async executeOptimizedQuery<R = T>(
    sql: string,
    params: any[] = [],
    cacheOptions?: {
      bypassCache?: boolean;
      cacheKey?: string;
    },
  ): Promise<QueryResult<R>> {
    const startTime = performance.now();

    try {
      let result: QueryResult<R>;

      if (this.options.enableQueryCache) {
        result = await optimizedDatabaseService.executeQueryCached<R>(
          sql,
          params,
          {
            ttlMs: this.options.cacheTimeoutMs,
            bypassCache: cacheOptions?.bypassCache,
            cacheKey: cacheOptions?.cacheKey,
          },
        );
      } else {
        result = await databaseService.executeSql<R>(sql, params);
      }

      // パフォーマンス監視
      if (this.options.enablePerformanceMonitoring) {
        const queryTime = performance.now() - startTime;
        this.updatePerformanceMetrics(queryTime);
      }

      return result;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] Optimized query error:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * パフォーマンスメトリクスの更新
   */
  private updatePerformanceMetrics(queryTime: number) {
    this.performanceMetrics.queryCount++;
    this.performanceMetrics.totalQueryTime += queryTime;

    // 遅いクエリの警告
    if (queryTime > 50) {
      logger.warn(
        `[${this.constructor.name}] Slow query detected: ${queryTime.toFixed(2)}ms`,
      );
    }
  }

  /**
   * IDによる単一レコード取得（キャッシュ対応）
   */
  public async findById(id: string | number): Promise<T | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const cacheKey = `${this.tableName}_findById_${id}`;

      const result = await this.executeOptimizedQuery<T>(sql, [id], {
        cacheKey,
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] findById エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 全レコード取得（キャッシュ対応）
   */
  public async findAll(limit?: number, offset?: number): Promise<T[]> {
    try {
      let sql = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];

      if (limit !== undefined) {
        sql += " LIMIT ?";
        params.push(limit);

        if (offset !== undefined) {
          sql += " OFFSET ?";
          params.push(offset);
        }
      }

      const cacheKey = `${this.tableName}_findAll_${limit}_${offset}`;
      const result = await this.executeOptimizedQuery<T>(sql, params, {
        cacheKey,
      });
      return result.rows;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] findAll エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 条件による検索（最適化クエリヒント対応）
   */
  public async findWhere(
    conditions: Record<string, any>,
    orderBy?: string,
    limit?: number,
    offset?: number,
    optimizationHints?: {
      useIndex?: string;
      orderByIndex?: boolean;
    },
  ): Promise<T[]> {
    try {
      const conditionParts: string[] = [];
      const params: any[] = [];

      // WHERE条件の構築
      for (const [column, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          conditionParts.push(`${column} = ?`);
          params.push(value);
        }
      }

      let sql = `SELECT * FROM ${this.tableName}`;

      if (conditionParts.length > 0) {
        sql += ` WHERE ${conditionParts.join(" AND ")}`;
      }

      if (orderBy) {
        sql += ` ORDER BY ${orderBy}`;
      }

      if (limit !== undefined) {
        sql += " LIMIT ?";
        params.push(limit);

        if (offset !== undefined) {
          sql += " OFFSET ?";
          params.push(offset);
        }
      }

      // 最適化ヒントの適用
      if (optimizationHints?.useIndex) {
        sql = sql.replace(
          `FROM ${this.tableName}`,
          `FROM ${this.tableName} INDEXED BY ${optimizationHints.useIndex}`,
        );
      }

      const result = await optimizedDatabaseService.executeOptimizedQuery<T>(
        sql,
        params,
        {
          useIndex: optimizationHints?.useIndex,
          limit,
          orderByIndex: optimizationHints?.orderByIndex,
          analyzeFirst: __DEV__,
        },
      );

      return result.rows;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] findWhere エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * レコード数取得（キャッシュ対応）
   */
  public async count(conditions?: Record<string, any>): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
      const params: any[] = [];

      if (conditions) {
        const conditionParts: string[] = [];

        for (const [column, value] of Object.entries(conditions)) {
          if (value !== undefined && value !== null) {
            conditionParts.push(`${column} = ?`);
            params.push(value);
          }
        }

        if (conditionParts.length > 0) {
          sql += ` WHERE ${conditionParts.join(" AND ")}`;
        }
      }

      const cacheKey = `${this.tableName}_count_${JSON.stringify(conditions)}`;
      const result = await this.executeOptimizedQuery<{ count: number }>(
        sql,
        params,
        { cacheKey },
      );
      return result.rows[0]?.count || 0;
    } catch (error) {
      logger.error(`[${this.constructor.name}] count エラー:`, error as Error);
      throw error;
    }
  }

  /**
   * 最適化版バッチ挿入
   */
  public async createMany(
    dataList: (Omit<T, "id"> & { id?: string | number })[],
  ): Promise<T[]> {
    try {
      if (dataList.length === 0) {
        return [];
      }

      const results: T[] = [];

      // バッチサイズによる分割処理
      const batchSize = this.options.maxBatchSize || 100;
      const batches: (typeof dataList)[] = [];

      for (let i = 0; i < dataList.length; i += batchSize) {
        batches.push(dataList.slice(i, i + batchSize));
      }

      // バッチクエリの準備
      for (const batch of batches) {
        const batchQueries = batch.map((data) => {
          const columns = Object.keys(data);
          const values = Object.values(data);
          return {
            query: `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
            params: values,
            identifier: `batch_insert_${Math.random().toString(36).substr(2, 9)}`,
          };
        });

        // 最適化されたバッチ実行
        const batchResults =
          await optimizedDatabaseService.executeBatch(batchQueries);

        // 結果の処理
        for (const result of batchResults) {
          if (result.error) {
            logger.error(
              `[${this.constructor.name}] Batch insert error:`,
              result.error,
            );
          }
        }
      }

      // キャッシュクリア（新しいデータが挿入されたため）
      if (this.options.enableQueryCache) {
        optimizedDatabaseService.clearCache(this.tableName);
      }

      logger.debug(
        `[${this.constructor.name}] バッチ挿入完了: ${dataList.length}件 (${batches.length}バッチ)`,
      );
      return results;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] createMany エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * レコード作成（キャッシュ無効化対応）
   */
  public async create(
    data: Omit<T, "id"> & { id?: string | number },
  ): Promise<T> {
    try {
      const columns = Object.keys(data);
      const placeholders = columns.map(() => "?").join(", ");
      const values = Object.values(data);

      const sql = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

      // キャッシュをバイパスして実行
      const result = await this.executeOptimizedQuery(sql, values, {
        bypassCache: true,
      });

      // 関連キャッシュのクリア
      if (this.options.enableQueryCache) {
        optimizedDatabaseService.clearCache(this.tableName);
      }

      // 挿入されたレコードの取得
      let insertedRecord: T | null = null;

      if (result.insertId) {
        insertedRecord = await this.findById(result.insertId);
      }

      if (!insertedRecord) {
        throw new Error(`Failed to retrieve inserted record`);
      }

      logger.debug(`[${this.constructor.name}] レコード作成完了:`, {
        details: { id: (insertedRecord as any).id, tableName: this.tableName },
      });
      return insertedRecord;
    } catch (error) {
      logger.error(`[${this.constructor.name}] create エラー:`, error as Error);
      throw error;
    }
  }

  /**
   * レコード更新（キャッシュ無効化対応）
   */
  public async update(
    id: string | number,
    data: Partial<T>,
  ): Promise<T | null> {
    try {
      const columns = Object.keys(data);
      const setParts = columns.map((col) => `${col} = ?`).join(", ");
      const values = [...Object.values(data), id];

      const sql = `UPDATE ${this.tableName} SET ${setParts} WHERE id = ?`;
      const result = await this.executeOptimizedQuery(sql, values, {
        bypassCache: true,
      });

      if (result.rowsAffected === 0) {
        logger.warn(
          `[${this.constructor.name}] 更新対象が見つかりません: ID ${id}`,
        );
        return null;
      }

      // 関連キャッシュのクリア
      if (this.options.enableQueryCache) {
        optimizedDatabaseService.clearCache(this.tableName);
      }

      logger.debug(`[${this.constructor.name}] レコード更新完了: ID ${id}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`[${this.constructor.name}] update エラー:`, error as Error);
      throw error;
    }
  }

  /**
   * レコード削除（キャッシュ無効化対応）
   */
  public async delete(id: string | number): Promise<boolean> {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const result = await this.executeOptimizedQuery(sql, [id], {
        bypassCache: true,
      });

      const success = result.rowsAffected > 0;

      if (success) {
        // 関連キャッシュのクリア
        if (this.options.enableQueryCache) {
          optimizedDatabaseService.clearCache(this.tableName);
        }
        logger.debug(`[${this.constructor.name}] レコード削除完了: ID ${id}`);
      } else {
        logger.warn(
          `[${this.constructor.name}] 削除対象が見つかりません: ID ${id}`,
        );
      }

      return success;
    } catch (error) {
      logger.error(`[${this.constructor.name}] delete エラー:`, error as Error);
      throw error;
    }
  }

  /**
   * パフォーマンスメトリクスの取得
   */
  public getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      averageQueryTime:
        this.performanceMetrics.queryCount > 0
          ? this.performanceMetrics.totalQueryTime /
            this.performanceMetrics.queryCount
          : 0,
      tableName: this.tableName,
      cacheEfficiency:
        this.performanceMetrics.cacheHits +
          this.performanceMetrics.cacheMisses >
        0
          ? (this.performanceMetrics.cacheHits /
              (this.performanceMetrics.cacheHits +
                this.performanceMetrics.cacheMisses)) *
            100
          : 0,
    };
  }

  /**
   * キャッシュクリア
   */
  public clearCache(pattern?: string) {
    if (this.options.enableQueryCache) {
      optimizedDatabaseService.clearCache(pattern || this.tableName);
    }
  }

  /**
   * メモリ最適化の実行
   */
  public optimizeMemoryUsage() {
    if (this.options.enableQueryCache) {
      optimizedDatabaseService.optimizeMemoryUsage();
    }
  }

  /**
   * 条件に一致する単一レコード取得（キャッシュ対応）
   */
  public async findOne(conditions: Partial<T>): Promise<T | null> {
    try {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      const values = Object.values(conditions);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`;
      const cacheKey = `${this.tableName}_findOne_${JSON.stringify(conditions)}`;

      const result = await this.executeOptimizedQuery<T>(sql, values, {
        cacheKey,
      });
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] findOne エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 統計クエリの最適化実行
   */
  protected async executeStatsQuery<R>(
    sql: string,
    params: any[] = [],
    cacheKey?: string,
  ): Promise<R[]> {
    try {
      // 統計クエリは通常重いので、長めのキャッシュ時間を設定
      const result = await optimizedDatabaseService.executeQueryCached<R>(
        sql,
        params,
        {
          ttlMs: 15 * 60 * 1000, // 15分
          cacheKey: cacheKey || `${this.tableName}_stats_${Date.now()}`,
        },
      );

      return result.rows;
    } catch (error) {
      logger.error(
        `[${this.constructor.name}] executeStatsQuery エラー:`,
        error as Error,
      );
      throw error;
    }
  }

  /**
   * パフォーマンス診断レポートの生成
   */
  public generatePerformanceReport(): string {
    const metrics = this.getPerformanceMetrics();
    const dbMetrics = optimizedDatabaseService.getPerformanceMetrics();

    return `
=== ${this.tableName} Repository Performance Report ===
Repository Metrics:
  - Total Queries: ${metrics.queryCount}
  - Average Query Time: ${metrics.averageQueryTime.toFixed(2)}ms
  - Cache Efficiency: ${metrics.cacheEfficiency.toFixed(1)}%

Database Metrics:
  - Total DB Queries: ${dbMetrics.queryCount}
  - Cache Hits: ${dbMetrics.cacheHits}
  - Cache Misses: ${dbMetrics.cacheMisses}
  - Average DB Query Time: ${dbMetrics.averageQueryTime.toFixed(2)}ms
  - Slow Queries: ${dbMetrics.slowQueries.length}

Optimization Suggestions:
${this.generateOptimizationSuggestions(metrics, dbMetrics)}
    `.trim();
  }

  /**
   * 最適化提案の生成
   */
  private generateOptimizationSuggestions(
    repoMetrics: any,
    dbMetrics: any,
  ): string {
    const suggestions: string[] = [];

    if (repoMetrics.averageQueryTime > 20) {
      suggestions.push(
        "- Consider adding database indexes for frequently queried columns",
      );
    }

    if (repoMetrics.cacheEfficiency < 50) {
      suggestions.push(
        "- Cache hit rate is low, consider increasing cache TTL or reviewing query patterns",
      );
    }

    if (dbMetrics.slowQueries.length > 0) {
      suggestions.push(
        "- Multiple slow queries detected, review query optimization",
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "- Performance looks good! No immediate optimizations needed",
      );
    }

    return suggestions.join("\n");
  }
}
