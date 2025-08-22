/**
 * パフォーマンス監視フック - Phase 10: パフォーマンス最適化
 *
 * React コンポーネントのパフォーマンスを監視し、
 * レンダリング時間、メモリ使用量、再レンダリング回数を追跡
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { logger } from "../utils/logger";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  totalRenderTime: number;
  memoryUsage?: number;
  componentName: string;
  propsChangeCount: number;
}

interface PerformanceMonitorOptions {
  componentName: string;
  enableLogging?: boolean;
  logThreshold?: number; // ms - この値を超えるレンダリング時間でログ出力
  trackMemory?: boolean;
  maxSamples?: number; // 保持するサンプル数の上限
}

/**
 * コンポーネントのパフォーマンスを監視するフック
 */
export function usePerformanceMonitor(options: PerformanceMonitorOptions) {
  const {
    componentName,
    enableLogging = __DEV__,
    logThreshold = 16, // 60FPS基準
    trackMemory = false,
    maxSamples = 100,
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: Infinity,
    totalRenderTime: 0,
    componentName,
    propsChangeCount: 0,
  });

  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const prevPropsRef = useRef<any>(null);

  // レンダリング開始時刻を記録
  const startRender = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  // レンダリング終了時刻を記録し、メトリクスを更新
  const endRender = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    // メトリクスを更新
    const metrics = metricsRef.current;
    metrics.renderCount += 1;
    metrics.lastRenderTime = renderTime;
    metrics.totalRenderTime += renderTime;

    // レンダリング時間の配列を管理
    renderTimesRef.current.push(renderTime);
    if (renderTimesRef.current.length > maxSamples) {
      renderTimesRef.current.shift();
    }

    // 統計値を計算
    const times = renderTimesRef.current;
    metrics.averageRenderTime = times.reduce((a, b) => a + b, 0) / times.length;
    metrics.maxRenderTime = Math.max(metrics.maxRenderTime, renderTime);
    metrics.minRenderTime = Math.min(metrics.minRenderTime, renderTime);

    // メモリ使用量の追跡（可能な場合）
    if (trackMemory && "memory" in performance) {
      // @ts-ignore - performance.memory は標準ではないが Chrome で利用可能
      metrics.memoryUsage =
        (performance.memory?.usedJSHeapSize || 0) / 1024 / 1024; // MB
    }

    // 遅いレンダリングのログ出力
    if (enableLogging && renderTime > logThreshold) {
      logger.warn(`[Performance] Slow render detected in ${componentName}`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: metrics.renderCount,
        averageTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        maxTime: `${metrics.maxRenderTime.toFixed(2)}ms`,
        memoryUsage: metrics.memoryUsage
          ? `${metrics.memoryUsage.toFixed(2)}MB`
          : "N/A",
      });
    }
  }, [componentName, enableLogging, logThreshold, trackMemory, maxSamples]);

  // Props変更の追跡
  const trackPropsChange = useCallback((currentProps: any) => {
    if (prevPropsRef.current !== null) {
      const hasPropsChanged =
        JSON.stringify(prevPropsRef.current) !== JSON.stringify(currentProps);
      if (hasPropsChanged) {
        metricsRef.current.propsChangeCount += 1;
      }
    }
    prevPropsRef.current = currentProps;
  }, []);

  // コンポーネントのマウント時とアンマウント時のログ
  useEffect(() => {
    if (enableLogging) {
      logger.debug(`[Performance] ${componentName} mounted`);
    }

    return () => {
      if (enableLogging) {
        const metrics = metricsRef.current;
        logger.debug(`[Performance] ${componentName} unmounted`, {
          totalRenders: metrics.renderCount,
          averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
          maxRenderTime: `${metrics.maxRenderTime.toFixed(2)}ms`,
          minRenderTime:
            metrics.minRenderTime === Infinity
              ? "0ms"
              : `${metrics.minRenderTime.toFixed(2)}ms`,
          propsChangeCount: metrics.propsChangeCount,
          finalMemoryUsage: metrics.memoryUsage
            ? `${metrics.memoryUsage.toFixed(2)}MB`
            : "N/A",
        });
      }
    };
  }, [componentName, enableLogging]);

  // メトリクスを取得する関数
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  // メトリクスをリセットする関数
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      minRenderTime: Infinity,
      totalRenderTime: 0,
      componentName,
      propsChangeCount: 0,
    };
    renderTimesRef.current = [];
    prevPropsRef.current = null;
  }, [componentName]);

  // パフォーマンス警告を出力する関数
  const reportPerformanceIssues = useCallback(() => {
    const metrics = metricsRef.current;
    const issues: string[] = [];

    if (metrics.averageRenderTime > logThreshold) {
      issues.push(
        `平均レンダリング時間が${logThreshold}msを超えています (${metrics.averageRenderTime.toFixed(2)}ms)`,
      );
    }

    if (metrics.maxRenderTime > logThreshold * 3) {
      issues.push(
        `最大レンダリング時間が非常に遅いです (${metrics.maxRenderTime.toFixed(2)}ms)`,
      );
    }

    if (
      metrics.renderCount > 0 &&
      metrics.propsChangeCount / metrics.renderCount < 0.3
    ) {
      issues.push(
        `不要な再レンダリングが多い可能性があります (Props変更率: ${((metrics.propsChangeCount / metrics.renderCount) * 100).toFixed(1)}%)`,
      );
    }

    if (issues.length > 0) {
      logger.warn(
        `[Performance] ${componentName} でパフォーマンスの問題を検出:`,
        issues,
      );
      return issues;
    }

    return null;
  }, [componentName, logThreshold]);

  return {
    startRender,
    endRender,
    trackPropsChange,
    getMetrics,
    resetMetrics,
    reportPerformanceIssues,
    metrics: metricsRef.current,
  };
}

/**
 * HOC: コンポーネントを自動的にパフォーマンス監視でラップ
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<PerformanceMonitorOptions, "componentName">,
) {
  const componentName =
    Component.displayName || Component.name || "UnknownComponent";

  const WrappedComponent = React.memo<P>((props) => {
    const performanceMonitor = usePerformanceMonitor({
      ...options,
      componentName,
    });

    // Props変更の追跡
    performanceMonitor.trackPropsChange(props);

    // レンダリング開始
    performanceMonitor.startRender();

    React.useEffect(() => {
      // レンダリング終了（DOM更新後）
      performanceMonitor.endRender();
    });

    return React.createElement(Component, props);
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return WrappedComponent;
}

/**
 * グローバルパフォーマンス統計の管理
 */
class GlobalPerformanceTracker {
  private components = new Map<string, PerformanceMetrics[]>();
  private maxComponentHistory = 10;

  registerComponentMetrics(metrics: PerformanceMetrics) {
    const { componentName } = metrics;

    if (!this.components.has(componentName)) {
      this.components.set(componentName, []);
    }

    const history = this.components.get(componentName)!;
    history.push({ ...metrics });

    // 履歴サイズの制限
    if (history.length > this.maxComponentHistory) {
      history.shift();
    }
  }

  getComponentMetrics(componentName: string): PerformanceMetrics[] {
    return this.components.get(componentName) || [];
  }

  getAllMetrics(): Record<string, PerformanceMetrics[]> {
    const result: Record<string, PerformanceMetrics[]> = {};
    for (const [name, metrics] of this.components.entries()) {
      result[name] = [...metrics];
    }
    return result;
  }

  getPerformanceReport(): string {
    let report = "\n=== Performance Report ===\n";

    for (const [componentName, history] of this.components.entries()) {
      const latest = history[history.length - 1];
      if (latest) {
        report += `${componentName}:\n`;
        report += `  Renders: ${latest.renderCount}\n`;
        report += `  Avg Time: ${latest.averageRenderTime.toFixed(2)}ms\n`;
        report += `  Max Time: ${latest.maxRenderTime.toFixed(2)}ms\n`;
        report += `  Props Changes: ${latest.propsChangeCount}\n`;
        if (latest.memoryUsage) {
          report += `  Memory: ${latest.memoryUsage.toFixed(2)}MB\n`;
        }
        report += "\n";
      }
    }

    return report;
  }

  clear() {
    this.components.clear();
  }
}

export const globalPerformanceTracker = new GlobalPerformanceTracker();

/**
 * アプリ全体のパフォーマンス統計を取得するフック
 */
export function useGlobalPerformanceStats() {
  const [stats, setStats] = useState(() =>
    globalPerformanceTracker.getAllMetrics(),
  );

  const refreshStats = useCallback(() => {
    setStats(globalPerformanceTracker.getAllMetrics());
  }, []);

  const getReport = useCallback(() => {
    return globalPerformanceTracker.getPerformanceReport();
  }, []);

  const clearStats = useCallback(() => {
    globalPerformanceTracker.clear();
    setStats({});
  }, []);

  return {
    stats,
    refreshStats,
    getReport,
    clearStats,
  };
}
