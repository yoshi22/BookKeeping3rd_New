/**
 * パフォーマンス統合サービス - Phase 10: パフォーマンス最適化
 *
 * 最適化されたコンポーネント、データベースサービス、メモリ最適化を
 * 統合して管理するサービス
 */

import { optimizedDatabaseService } from "../data/database.optimized";
import { memoryOptimizer } from "./memory-optimizer";
import { statisticsCache } from "./statistics-cache";
import { logger } from "../utils/logger";

interface PerformanceConfig {
  enableAutoOptimization?: boolean;
  optimizationInterval?: number; // ms
  memoryThreshold?: number; // MB
  cacheCleanupInterval?: number; // ms
  performanceReportingInterval?: number; // ms
}

interface SystemPerformanceMetrics {
  timestamp: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    queryCount: number;
    averageQueryTime: number;
    cacheHitRate: number;
    slowQueryCount: number;
  };
  cache: {
    hitRate: number;
    entryCount: number;
    memoryUsage: number;
  };
  repositories: Record<string, any>;
}

class PerformanceIntegrationService {
  private config: PerformanceConfig;
  private isRunning = false;
  private optimizationTimer?: NodeJS.Timeout;
  private reportingTimer?: NodeJS.Timeout;
  private performanceHistory: SystemPerformanceMetrics[] = [];
  private readonly maxHistorySize = 100;
  private registeredRepositories = new Map<string, any>();

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableAutoOptimization: true,
      optimizationInterval: 5 * 60 * 1000, // 5分
      memoryThreshold: 100, // 100MB
      cacheCleanupInterval: 10 * 60 * 1000, // 10分
      performanceReportingInterval: 60 * 1000, // 1分
      ...config,
    };
  }

  /**
   * パフォーマンス統合サービスの開始
   */
  public start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    logger.info("[PerformanceIntegration] Performance monitoring started");

    // 自動最適化の開始
    if (this.config.enableAutoOptimization) {
      this.startAutoOptimization();
    }

    // パフォーマンスレポート定期出力
    if (this.config.performanceReportingInterval) {
      this.startPerformanceReporting();
    }
  }

  /**
   * パフォーマンス統合サービスの停止
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
      this.optimizationTimer = undefined;
    }

    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
      this.reportingTimer = undefined;
    }

    logger.info("[PerformanceIntegration] Performance monitoring stopped");
  }

  /**
   * リポジトリの登録
   */
  public registerRepository(name: string, repository: any): void {
    this.registeredRepositories.set(name, repository);
    logger.debug(`[PerformanceIntegration] Repository registered: ${name}`);
  }

  /**
   * 自動最適化の開始
   */
  private startAutoOptimization(): void {
    this.optimizationTimer = setInterval(() => {
      this.performAutoOptimization();
    }, this.config.optimizationInterval);
  }

  /**
   * パフォーマンスレポート定期出力の開始
   */
  private startPerformanceReporting(): void {
    this.reportingTimer = setInterval(() => {
      this.collectAndReportMetrics();
    }, this.config.performanceReportingInterval);
  }

  /**
   * 自動最適化の実行
   */
  private async performAutoOptimization(): Promise<void> {
    try {
      logger.debug("[PerformanceIntegration] Running auto optimization");

      const metrics = await this.collectSystemMetrics();

      // メモリ使用量チェック
      if (metrics.memory.used > this.config.memoryThreshold!) {
        await this.performMemoryOptimization();
      }

      // データベースキャッシュの最適化
      if (metrics.database.cacheHitRate < 50) {
        await this.optimizeDatabaseCache();
      }

      // 統計キャッシュのクリーンアップ
      await this.optimizeStatisticsCache();

      logger.debug("[PerformanceIntegration] Auto optimization completed");
    } catch (error) {
      logger.error(
        "[PerformanceIntegration] Auto optimization failed:",
        error as Error,
      );
    }
  }

  /**
   * システム全体のメトリクス収集
   */
  private async collectSystemMetrics(): Promise<SystemPerformanceMetrics> {
    const timestamp = Date.now();

    // メモリ使用量の取得
    const memoryMetrics = memoryOptimizer.getMemoryStatus();

    // データベースメトリクスの取得
    const dbMetrics = optimizedDatabaseService.getPerformanceMetrics();

    // 統計キャッシュメトリクスの取得
    const cacheMetrics = statisticsCache.getPerformanceMetrics();

    // 登録されたリポジトリのメトリクス収集
    const repositoryMetrics: Record<string, any> = {};
    for (const [name, repo] of this.registeredRepositories.entries()) {
      if (repo.getPerformanceMetrics) {
        repositoryMetrics[name] = repo.getPerformanceMetrics();
      }
    }

    const metrics: SystemPerformanceMetrics = {
      timestamp,
      memory: {
        used: memoryMetrics.used,
        total: memoryMetrics.total,
        percentage: (memoryMetrics.used / memoryMetrics.total) * 100,
      },
      database: {
        queryCount: dbMetrics.queryCount,
        averageQueryTime: dbMetrics.averageQueryTime,
        cacheHitRate:
          dbMetrics.cacheHits + dbMetrics.cacheMisses > 0
            ? (dbMetrics.cacheHits /
                (dbMetrics.cacheHits + dbMetrics.cacheMisses)) *
              100
            : 0,
        slowQueryCount: dbMetrics.slowQueries.length,
      },
      cache: {
        hitRate: cacheMetrics.hitRate,
        entryCount: cacheMetrics.entryCount,
        memoryUsage: cacheMetrics.memoryUsage,
      },
      repositories: repositoryMetrics,
    };

    // 履歴に追加
    this.performanceHistory.push(metrics);
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }

    return metrics;
  }

  /**
   * メトリクス収集とレポート出力
   */
  private async collectAndReportMetrics(): Promise<void> {
    try {
      const metrics = await this.collectSystemMetrics();

      if (__DEV__) {
        // 開発環境でのみ詳細ログを出力
        logger.debug("[PerformanceIntegration] System metrics:", {
          memory: `${metrics.memory.used}MB (${metrics.memory.percentage.toFixed(1)}%)`,
          dbQueries: metrics.database.queryCount,
          avgQueryTime: `${metrics.database.averageQueryTime.toFixed(2)}ms`,
          cacheHitRate: `${metrics.database.cacheHitRate.toFixed(1)}%`,
          slowQueries: metrics.database.slowQueryCount,
        });
      }

      // パフォーマンス警告の確認
      this.checkPerformanceWarnings(metrics);
    } catch (error) {
      logger.error(
        "[PerformanceIntegration] Metrics collection failed:",
        error as Error,
      );
    }
  }

  /**
   * パフォーマンス警告のチェック
   */
  private checkPerformanceWarnings(metrics: SystemPerformanceMetrics): void {
    const warnings: string[] = [];

    // メモリ使用量警告
    if (metrics.memory.percentage > 80) {
      warnings.push(
        `High memory usage: ${metrics.memory.percentage.toFixed(1)}%`,
      );
    }

    // データベースパフォーマンス警告
    if (metrics.database.averageQueryTime > 50) {
      warnings.push(
        `Slow database queries: ${metrics.database.averageQueryTime.toFixed(2)}ms avg`,
      );
    }

    if (metrics.database.cacheHitRate < 30) {
      warnings.push(
        `Low cache hit rate: ${metrics.database.cacheHitRate.toFixed(1)}%`,
      );
    }

    if (metrics.database.slowQueryCount > 10) {
      warnings.push(
        `Too many slow queries: ${metrics.database.slowQueryCount}`,
      );
    }

    // キャッシュパフォーマンス警告
    if (metrics.cache.hitRate < 50) {
      warnings.push(
        `Poor cache performance: ${metrics.cache.hitRate.toFixed(1)}% hit rate`,
      );
    }

    // 警告がある場合はログ出力
    if (warnings.length > 0) {
      logger.warn(
        "[PerformanceIntegration] Performance warnings detected:",
        warnings,
      );
    }
  }

  /**
   * メモリ最適化の実行
   */
  private async performMemoryOptimization(): Promise<void> {
    logger.info("[PerformanceIntegration] Performing memory optimization");

    // メモリオプティマイザーの実行
    memoryOptimizer.forceGarbageCollection();
    await memoryOptimizer.optimizeMemoryUsage();

    // データベースキャッシュのクリーンアップ
    optimizedDatabaseService.optimizeMemoryUsage();

    // 統計キャッシュの最適化
    statisticsCache.cleanup();

    // 登録されたリポジトリのメモリ最適化
    for (const [name, repo] of this.registeredRepositories.entries()) {
      if (repo.optimizeMemoryUsage) {
        repo.optimizeMemoryUsage();
      }
    }
  }

  /**
   * データベースキャッシュの最適化
   */
  private async optimizeDatabaseCache(): Promise<void> {
    logger.info("[PerformanceIntegration] Optimizing database cache");

    // 古いキャッシュエントリの削除
    optimizedDatabaseService.optimizeMemoryUsage();

    // キャッシュ統計の分析
    const dbMetrics = optimizedDatabaseService.getPerformanceMetrics();
    if (dbMetrics.cacheHits + dbMetrics.cacheMisses > 1000) {
      // 大量のキャッシュアクセスがある場合、部分的にクリア
      optimizedDatabaseService.clearCache();
    }
  }

  /**
   * 統計キャッシュの最適化
   */
  private async optimizeStatisticsCache(): Promise<void> {
    const cacheMetrics = statisticsCache.getPerformanceMetrics();

    // キャッシュサイズが大きい場合はクリーンアップ
    if (cacheMetrics.entryCount > 100) {
      logger.info("[PerformanceIntegration] Optimizing statistics cache");
      statisticsCache.cleanup();
    }
  }

  /**
   * パフォーマンスレポートの生成
   */
  public generatePerformanceReport(): string {
    if (this.performanceHistory.length === 0) {
      return "No performance data available";
    }

    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    const history = this.performanceHistory.slice(-10); // 直近10回のデータ

    let report = "\n=== System Performance Report ===\n";
    report += `Generated: ${new Date(latest.timestamp).toISOString()}\n\n`;

    // 現在のシステム状態
    report += "--- Current System Status ---\n";
    report += `Memory Usage: ${latest.memory.used.toFixed(1)}MB (${latest.memory.percentage.toFixed(1)}%)\n`;
    report += `Database Queries: ${latest.database.queryCount}\n`;
    report += `Avg Query Time: ${latest.database.averageQueryTime.toFixed(2)}ms\n`;
    report += `DB Cache Hit Rate: ${latest.database.cacheHitRate.toFixed(1)}%\n`;
    report += `Slow Queries: ${latest.database.slowQueryCount}\n`;
    report += `Stats Cache Hit Rate: ${latest.cache.hitRate.toFixed(1)}%\n\n`;

    // パフォーマンストレンド
    if (history.length > 1) {
      report += "--- Performance Trends (Last 10 samples) ---\n";
      const avgMemory =
        history.reduce((sum, m) => sum + m.memory.percentage, 0) /
        history.length;
      const avgQueryTime =
        history.reduce((sum, m) => sum + m.database.averageQueryTime, 0) /
        history.length;
      const avgCacheHit =
        history.reduce((sum, m) => sum + m.database.cacheHitRate, 0) /
        history.length;

      report += `Average Memory Usage: ${avgMemory.toFixed(1)}%\n`;
      report += `Average Query Time: ${avgQueryTime.toFixed(2)}ms\n`;
      report += `Average Cache Hit Rate: ${avgCacheHit.toFixed(1)}%\n\n`;
    }

    // 登録されたリポジトリの情報
    if (Object.keys(latest.repositories).length > 0) {
      report += "--- Repository Performance ---\n";
      for (const [name, metrics] of Object.entries(latest.repositories)) {
        report += `${name}: ${JSON.stringify(metrics, null, 2)}\n`;
      }
      report += "\n";
    }

    // 最適化提案
    report += "--- Optimization Suggestions ---\n";
    report += this.generateOptimizationSuggestions(latest);

    return report;
  }

  /**
   * 最適化提案の生成
   */
  private generateOptimizationSuggestions(
    metrics: SystemPerformanceMetrics,
  ): string {
    const suggestions: string[] = [];

    if (metrics.memory.percentage > 80) {
      suggestions.push(
        "- Consider implementing more aggressive garbage collection or reducing memory footprint",
      );
    }

    if (metrics.database.averageQueryTime > 30) {
      suggestions.push(
        "- Database queries are slow, consider adding indexes or optimizing queries",
      );
    }

    if (metrics.database.cacheHitRate < 50) {
      suggestions.push(
        "- Database cache hit rate is low, consider increasing cache TTL or reviewing caching strategy",
      );
    }

    if (metrics.cache.hitRate < 60) {
      suggestions.push(
        "- Statistics cache performance is poor, review cache invalidation logic",
      );
    }

    if (metrics.database.slowQueryCount > 5) {
      suggestions.push(
        "- Multiple slow queries detected, implement query optimization",
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "- System performance is optimal! No immediate actions needed",
      );
    }

    return suggestions.join("\n");
  }

  /**
   * パフォーマンス履歴の取得
   */
  public getPerformanceHistory(): SystemPerformanceMetrics[] {
    return [...this.performanceHistory];
  }

  /**
   * 手動最適化の実行
   */
  public async performManualOptimization(): Promise<void> {
    logger.info("[PerformanceIntegration] Manual optimization requested");
    await this.performAutoOptimization();
  }

  /**
   * 設定の更新
   */
  public updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info("[PerformanceIntegration] Configuration updated");

    // サービスが実行中の場合は再起動
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// シングルトンインスタンス
export const performanceIntegration = new PerformanceIntegrationService();

// 開発環境でのみ自動開始
if (__DEV__) {
  performanceIntegration.start();
}
