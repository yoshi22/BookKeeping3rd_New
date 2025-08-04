/**
 * 遅延ローディングコンポーネント
 * 簿記3級問題集アプリ - Step 4.1: パフォーマンス最適化
 * 
 * 主な最適化:
 * - Dynamic Import による遅延ローディング
 * - Intersection Observer による可視性検出
 * - プリロード機能
 * - エラー境界とフォールバック
 */

import React, { 
  lazy, 
  Suspense, 
  memo, 
  useState, 
  useEffect, 
  useRef, 
  ComponentType 
} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * 遅延ローディング設定
 */
export interface LazyLoadingConfig {
  // 基本設定
  rootMargin?: string; // Intersection Observer の rootMargin
  threshold?: number; // 可視性の閾値
  
  // プリロード設定
  preload?: boolean; // 事前ローディング
  preloadDelay?: number; // プリロード遅延時間（ms）
  
  // フォールバック設定
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType<{ error: Error; retry: () => void }>;
  
  // パフォーマンス設定
  enableMemoryOptimization?: boolean; // メモリ最適化
  unloadWhenHidden?: boolean; // 非表示時にアンロード
}

/**
 * デフォルト設定
 */
const DEFAULT_CONFIG: Required<LazyLoadingConfig> = {
  rootMargin: '50px',
  threshold: 0.1,
  preload: false,
  preloadDelay: 1000,
  loadingComponent: DefaultLoadingComponent,
  errorComponent: DefaultErrorComponent,
  enableMemoryOptimization: true,
  unloadWhenHidden: false,
};

/**
 * デフォルトローディングコンポーネント
 */
const DefaultLoadingComponent = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#2f95dc" />
    <Text style={styles.loadingText}>読み込み中...</Text>
  </View>
));

DefaultLoadingComponent.displayName = 'DefaultLoadingComponent';

/**
 * デフォルトエラーコンポーネント
 */
const DefaultErrorComponent = memo<{ error: Error; retry: () => void }>(({ error, retry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>読み込みエラー</Text>
    <Text style={styles.errorMessage}>{error.message}</Text>
    <Text style={styles.retryButton} onPress={retry}>
      再試行
    </Text>
  </View>
));

DefaultErrorComponent.displayName = 'DefaultErrorComponent';

/**
 * 遅延ローディングコンポーネントファクトリー
 */
export function createLazyComponent<P = {}>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  config?: LazyLoadingConfig
): ComponentType<P> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Dynamic Import でコンポーネントを遅延ローディング
  const LazyLoadedComponent = lazy(importFunction);
  
  return memo<P>((props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(finalConfig.preload);
    const containerRef = useRef<View>(null);
    const preloadTimeoutRef = useRef<NodeJS.Timeout>();

    // Intersection Observer による可視性検出（Web環境のみ）
    useEffect(() => {
      if (typeof IntersectionObserver === 'undefined') {
        // React Native環境では即座にロード
        setIsVisible(true);
        setShouldLoad(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
            setShouldLoad(true);
          } else if (finalConfig.unloadWhenHidden) {
            setIsVisible(false);
          }
        },
        {
          rootMargin: finalConfig.rootMargin,
          threshold: finalConfig.threshold,
        }
      );

      const currentElement = containerRef.current as any;
      if (currentElement) {
        observer.observe(currentElement);
      }

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }, [finalConfig.rootMargin, finalConfig.threshold, finalConfig.unloadWhenHidden]);

    // プリロード処理
    useEffect(() => {
      if (finalConfig.preload && !isPreloaded) {
        preloadTimeoutRef.current = setTimeout(() => {
          setIsPreloaded(true);
          setShouldLoad(true);
        }, finalConfig.preloadDelay);
      }

      return () => {
        if (preloadTimeoutRef.current) {
          clearTimeout(preloadTimeoutRef.current);
        }
      };
    }, [finalConfig.preload, finalConfig.preloadDelay, isPreloaded]);

    // ローディング状態でフォールバックを表示
    if (!shouldLoad) {
      return (
        <View ref={containerRef} style={styles.container}>
          <finalConfig.loadingComponent />
        </View>
      );
    }

    // メモリ最適化: 非表示時はアンロード
    if (finalConfig.unloadWhenHidden && !isVisible) {
      return (
        <View ref={containerRef} style={styles.container}>
          <finalConfig.loadingComponent />
        </View>
      );
    }

    return (
      <View ref={containerRef} style={styles.container}>
        <Suspense fallback={<finalConfig.loadingComponent />}>
          <ErrorBoundary ErrorComponent={finalConfig.errorComponent}>
            <LazyLoadedComponent {...props} />
          </ErrorBoundary>
        </Suspense>
      </View>
    );
  });
}

/**
 * エラー境界コンポーネント
 */
class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    ErrorComponent: ComponentType<{ error: Error; retry: () => void }>;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[LazyComponent] Error boundary caught:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { ErrorComponent } = this.props;
      return <ErrorComponent error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

/**
 * 遅延ローディング用の高次コンポーネント（HOC）
 */
export function withLazyLoading<P = {}>(
  Component: ComponentType<P>,
  config?: LazyLoadingConfig
): ComponentType<P> {
  return createLazyComponent(() => Promise.resolve({ default: Component }), config);
}

/**
 * プリロード機能付き遅延ローディング
 */
export function createPreloadableLazyComponent<P = {}>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  config?: LazyLoadingConfig
) {
  const LazyComponent = createLazyComponent(importFunction, config);
  
  // プリロード関数
  const preload = () => {
    return importFunction();
  };
  
  // コンポーネントにプリロード関数を追加
  (LazyComponent as any).preload = preload;
  
  return LazyComponent as ComponentType<P> & { preload: () => Promise<any> };
}

/**
 * 遅延ローディング管理クラス
 */
export class LazyComponentManager {
  private static instance: LazyComponentManager;
  private preloadedComponents = new Set<string>();
  private loadingComponents = new Map<string, Promise<any>>();

  public static getInstance(): LazyComponentManager {
    if (!LazyComponentManager.instance) {
      LazyComponentManager.instance = new LazyComponentManager();
    }
    return LazyComponentManager.instance;
  }

  /**
   * 複数コンポーネントの一括プリロード
   */
  public async preloadComponents(
    components: Array<{ name: string; loader: () => Promise<any> }>
  ): Promise<void> {
    console.log('[LazyComponentManager] 一括プリロード開始:', components.length);
    const startTime = performance.now();

    const preloadPromises = components.map(async ({ name, loader }) => {
      if (this.preloadedComponents.has(name)) {
        return; // 既にプリロード済み
      }

      if (this.loadingComponents.has(name)) {
        return this.loadingComponents.get(name); // ロード中
      }

      const loadPromise = loader();
      this.loadingComponents.set(name, loadPromise);

      try {
        await loadPromise;
        this.preloadedComponents.add(name);
        console.log(`[LazyComponentManager] プリロード完了: ${name}`);
      } catch (error) {
        console.error(`[LazyComponentManager] プリロードエラー: ${name}`, error);
      } finally {
        this.loadingComponents.delete(name);
      }
    });

    await Promise.allSettled(preloadPromises);

    const endTime = performance.now();
    console.log(`[LazyComponentManager] 一括プリロード完了: ${endTime - startTime}ms`);
  }

  /**
   * プリロード状況の取得
   */
  public getPreloadStatus() {
    return {
      preloaded: Array.from(this.preloadedComponents),
      loading: Array.from(this.loadingComponents.keys()),
      preloadedCount: this.preloadedComponents.size,
      loadingCount: this.loadingComponents.size,
    };
  }

  /**
   * プリロードキャッシュのクリア
   */
  public clearPreloadCache(): void {
    this.preloadedComponents.clear();
    this.loadingComponents.clear();
    console.log('[LazyComponentManager] プリロードキャッシュクリア');
  }
}

/**
 * 遅延ローディング用のフック
 */
export function useLazyLoading() {
  const manager = LazyComponentManager.getInstance();

  return {
    preloadComponents: manager.preloadComponents.bind(manager),
    getPreloadStatus: manager.getPreloadStatus.bind(manager),
    clearPreloadCache: manager.clearPreloadCache.bind(manager),
  };
}

/**
 * スタイル定義
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f95dc',
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
});

/**
 * 使用例:
 * 
 * // 基本的な遅延ローディング
 * const LazyQuestionDisplay = createLazyComponent(
 *   () => import('./QuestionDisplay'),
 *   { preload: true, preloadDelay: 2000 }
 * );
 * 
 * // プリロード機能付き
 * const PreloadableStats = createPreloadableLazyComponent(
 *   () => import('./StatsScreen')
 * );
 * 
 * // 使用時
 * PreloadableStats.preload(); // 事前ローディング
 */