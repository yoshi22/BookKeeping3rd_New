/**
 * アプリ初期化最適化フック
 * 簿記3級問題集アプリ - Step 4.1: パフォーマンス最適化
 * 
 * 主な最適化:
 * - 段階的初期化（Progressive Loading）
 * - 重要データの事前読み込み
 * - 初期化エラーハンドリング
 * - 起動時間計測
 */

import { useState, useEffect, useCallback } from 'react';
import { optimizedDatabaseService } from '../data/database-optimized';
import { statisticsCache } from '../services/statistics-cache';
import { databaseService } from '../data/database';

/**
 * 初期化段階の定義
 */
export type InitializationStage = 
  | 'idle'
  | 'database_quick'
  | 'essential_data'
  | 'background_tasks'
  | 'completed'
  | 'error';

/**
 * 初期化状態
 */
export interface InitializationState {
  stage: InitializationStage;
  progress: number; // 0-100
  isReady: boolean;
  error: Error | null;
  timing: {
    startTime: number;
    quickInitTime?: number;
    essentialDataTime?: number;
    totalTime?: number;
  };
  details: {
    databaseReady: boolean;
    essentialDataLoaded: boolean;
    backgroundTasksCompleted: boolean;
  };
}

/**
 * 事前読み込み対象データ
 */
interface EssentialData {
  categories: any[];
  accountItems: any[];
  appSettings: any[];
}

/**
 * アプリ初期化最適化フック
 */
export function useAppInitialization() {
  const [state, setState] = useState<InitializationState>({
    stage: 'idle',
    progress: 0,
    isReady: false,
    error: null,
    timing: {
      startTime: 0,
    },
    details: {
      databaseReady: false,
      essentialDataLoaded: false,
      backgroundTasksCompleted: false,
    },
  });

  /**
   * 段階的初期化の実行
   */
  const initializeApp = useCallback(async () => {
    const startTime = performance.now();
    
    try {
      setState(prev => ({
        ...prev,
        stage: 'database_quick',
        progress: 10,
        timing: { ...prev.timing, startTime },
      }));

      // Stage 1: 高速データベース初期化
      console.log('[AppInit] Stage 1: 高速データベース初期化開始');
      await optimizedDatabaseService.quickInitialize();
      
      const quickInitTime = performance.now() - startTime;
      console.log(`[AppInit] Stage 1 完了: ${quickInitTime.toFixed(2)}ms`);

      setState(prev => ({
        ...prev,
        stage: 'essential_data',
        progress: 40,
        timing: { ...prev.timing, quickInitTime },
        details: { ...prev.details, databaseReady: true },
      }));

      // Stage 2: 必須データの事前読み込み
      console.log('[AppInit] Stage 2: 必須データ読み込み開始');
      const essentialData = await loadEssentialData();
      
      const essentialDataTime = performance.now() - startTime;
      console.log(`[AppInit] Stage 2 完了: ${essentialDataTime.toFixed(2)}ms`);

      setState(prev => ({
        ...prev,
        stage: 'background_tasks',
        progress: 70,
        timing: { ...prev.timing, essentialDataTime },
        details: { ...prev.details, essentialDataLoaded: true },
      }));

      // Stage 3: バックグラウンドタスク（非同期）
      console.log('[AppInit] Stage 3: バックグラウンドタスク開始');
      performBackgroundTasks(); // 非同期実行

      const totalTime = performance.now() - startTime;
      console.log(`[AppInit] 初期化完了: ${totalTime.toFixed(2)}ms`);

      setState(prev => ({
        ...prev,
        stage: 'completed',
        progress: 100,
        isReady: true,
        timing: { ...prev.timing, totalTime },
        details: { ...prev.details, backgroundTasksCompleted: true },
      }));

      // パフォーマンス統計をログ出力
      logPerformanceStats(totalTime, essentialData);

    } catch (error) {
      console.error('[AppInit] 初期化エラー:', error);
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: error as Error,
        isReady: false,
      }));
    }
  }, []);

  /**
   * 必須データの事前読み込み
   */
  const loadEssentialData = async (): Promise<EssentialData> => {
    const [categories, accountItems, appSettings] = await Promise.all([
      // カテゴリ情報（軽量）
      optimizedDatabaseService.executeSql(
        'SELECT id, name, total_questions FROM categories WHERE is_active = 1 ORDER BY sort_order',
        []
      ),
      
      // 勘定科目（頻繁に使用）
      optimizedDatabaseService.executeSql(
        'SELECT code, name, category FROM account_items WHERE is_active = 1 ORDER BY sort_order LIMIT 50',
        []
      ),
      
      // アプリ設定（UI表示に必要）
      optimizedDatabaseService.executeSql(
        'SELECT key, value, type FROM app_settings',
        []
      ),
    ]);

    return {
      categories: categories.rows,
      accountItems: accountItems.rows,
      appSettings: appSettings.rows,
    };
  };

  /**
   * バックグラウンドタスクの実行（非同期）
   */
  const performBackgroundTasks = async () => {
    try {
      console.log('[AppInit] バックグラウンドタスク開始');
      
      // タスク1: 統計キャッシュの温機
      await warmupStatisticsCache();
      
      // タスク2: 最近の学習データのプリロード
      await preloadRecentLearningData();
      
      // タスク3: データベース最適化
      await optimizeDatabaseInBackground();
      
      console.log('[AppInit] バックグラウンドタスク完了');
      
      setState(prev => ({
        ...prev,
        details: { ...prev.details, backgroundTasksCompleted: true },
      }));

    } catch (error) {
      console.warn('[AppInit] バックグラウンドタスク警告:', error);
      // バックグラウンドタスクのエラーはアプリ起動を阻止しない
    }
  };

  /**
   * 統計キャッシュの温機
   */
  const warmupStatisticsCache = async () => {
    try {
      // よく使用される統計データを事前にキャッシュ
      await optimizedDatabaseService.executeSql(
        `SELECT 
           COUNT(*) as total_answered,
           AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) as overall_accuracy
         FROM learning_history 
         WHERE answered_at >= DATE('now', '-30 days')`,
        []
      );

      console.log('[AppInit] 統計キャッシュ温機完了');
    } catch (error) {
      console.warn('[AppInit] 統計キャッシュ温機エラー:', error);
    }
  };

  /**
   * 最近の学習データのプリロード
   */
  const preloadRecentLearningData = async () => {
    try {
      // 最近の学習履歴（復習画面で使用）
      await optimizedDatabaseService.executeSql(
        `SELECT question_id, is_correct, answered_at 
         FROM learning_history 
         WHERE answered_at >= DATE('now', '-7 days')
         ORDER BY answered_at DESC 
         LIMIT 100`,
        []
      );

      // 復習対象問題（復習画面で使用）
      await optimizedDatabaseService.executeSql(
        `SELECT ri.question_id, ri.priority_score, q.category_id
         FROM review_items ri
         JOIN questions q ON ri.question_id = q.id
         WHERE ri.status IN ('needs_review', 'priority_review')
         ORDER BY ri.priority_score DESC
         LIMIT 20`,
        []
      );

      console.log('[AppInit] 最近の学習データプリロード完了');
    } catch (error) {
      console.warn('[AppInit] 学習データプリロードエラー:', error);
    }
  };

  /**
   * データベース最適化（バックグラウンド）
   */
  const optimizeDatabaseInBackground = async () => {
    try {
      // ANALYZE実行（統計情報更新）
      await optimizedDatabaseService.executeSql('ANALYZE', []);
      
      // 古い一時データのクリーンアップ
      await optimizedDatabaseService.executeSql(
        'DELETE FROM learning_history WHERE answered_at < DATE("now", "-90 days")',
        []
      );

      console.log('[AppInit] データベース最適化完了');
    } catch (error) {
      console.warn('[AppInit] データベース最適化エラー:', error);
    }
  };

  /**
   * パフォーマンス統計のログ出力
   */
  const logPerformanceStats = (totalTime: number, essentialData: EssentialData) => {
    const stats = optimizedDatabaseService.getPerformanceStats();
    
    console.log('[AppInit] パフォーマンス統計:', {
      totalInitTime: `${totalTime.toFixed(2)}ms`,
      databaseStats: stats,
      preloadedData: {
        categories: essentialData.categories.length,
        accountItems: essentialData.accountItems.length,
        settings: essentialData.appSettings.length,
      },
      targetAchieved: totalTime < 3000 ? '✅' : '❌', // 3秒以内が目標
    });
  };

  /**
   * 初期化の再試行
   */
  const retryInitialization = useCallback(() => {
    setState(prev => ({
      ...prev,
      stage: 'idle',
      progress: 0,
      isReady: false,
      error: null,
    }));
    
    // 少し遅延してから再試行
    setTimeout(() => {
      initializeApp();
    }, 1000);
  }, [initializeApp]);

  /**
   * 初期化状態のリセット
   */
  const resetInitialization = useCallback(() => {
    setState({
      stage: 'idle',
      progress: 0,
      isReady: false,
      error: null,
      timing: {
        startTime: 0,
      },
      details: {
        databaseReady: false,
        essentialDataLoaded: false,
        backgroundTasksCompleted: false,
      },
    });
  }, []);

  // アプリ起動時に自動初期化
  useEffect(() => {
    if (state.stage === 'idle') {
      initializeApp();
    }
  }, [state.stage, initializeApp]);

  return {
    ...state,
    initializeApp,
    retryInitialization,
    resetInitialization,
    
    // 便利なヘルパー
    isInitializing: state.stage !== 'idle' && state.stage !== 'completed' && state.stage !== 'error',
    hasError: state.stage === 'error',
    canRetry: state.stage === 'error',
    
    // パフォーマンス情報
    performanceStats: state.timing,
  };
}