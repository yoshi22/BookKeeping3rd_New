/**
 * 最適化学習画面の実装例 - Phase 10: パフォーマンス最適化
 *
 * このファイルは Phase 10 で作成された最適化技術を
 * 実際のコンポーネントで統合的に活用する例を示します
 */

import React, { useCallback, useMemo, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { usePerformanceMonitor } from "../../hooks/usePerformanceMonitor";
import { performanceIntegration } from "../../services/performance-integration";
import { logger } from "../../utils/logger";

// 最適化されたコンポーネントのインポート
import ButtonOptimized from "../ui/Button.optimized";
import NumericPadOptimized from "../ui/NumericPad.optimized";

// 最適化されたリポジトリの使用例
import { OptimizedBaseRepository } from "../../data/repositories/base-repository.optimized";
import type { Question } from "../../types/question";

interface OptimizedLearningScreenProps {
  onQuestionComplete: (questionId: string, isCorrect: boolean) => void;
  onNavigateToReview: () => void;
}

/**
 * 最適化学習画面コンポーネント
 *
 * Phase 10 の最適化技術を活用:
 * - React.memo によるコンポーネントメモ化
 * - useCallback による関数メモ化
 * - useMemo による計算結果メモ化
 * - パフォーマンス監視フックの統合
 * - 最適化データベースサービスの利用
 */
const OptimizedLearningScreen = React.memo<OptimizedLearningScreenProps>(
  ({ onQuestionComplete, onNavigateToReview }) => {
    const { theme } = useTheme();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [isNumericPadVisible, setIsNumericPadVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // パフォーマンス監視の統合
    const performanceMonitor = usePerformanceMonitor({
      componentName: "OptimizedLearningScreen",
      enableLogging: __DEV__,
      logThreshold: 16, // 60FPS基準
      trackMemory: true,
    });

    // コンポーネントのレンダリング開始
    performanceMonitor.startRender();

    // Props変更の追跡
    performanceMonitor.trackPropsChange({
      onQuestionComplete,
      onNavigateToReview,
    });

    // 最適化されたリポジトリの使用例
    const optimizedQuestionRepository = useMemo(() => {
      class OptimizedQuestionRepository extends OptimizedBaseRepository<Question> {
        constructor() {
          super("questions", {
            enableQueryCache: true,
            cacheTimeoutMs: 10 * 60 * 1000, // 10分
            enableBatchOptimization: true,
            maxBatchSize: 50,
            enablePerformanceMonitoring: __DEV__,
          });

          // パフォーマンス統合サービスにリポジトリを登録
          performanceIntegration.registerRepository("questions", this);
        }

        // 学習用問題の最適化取得
        async getLearningQuestions(limit: number = 10): Promise<Question[]> {
          return await this.findWhere(
            { is_active: 1 },
            "difficulty ASC, id ASC",
            limit,
            undefined,
            {
              useIndex: "idx_questions_active_difficulty", // インデックスヒント
              orderByIndex: true,
            },
          );
        }

        // 問題統計の最適化取得
        async getQuestionStats(): Promise<any> {
          const sql = `
            SELECT 
              category_id,
              COUNT(*) as total_questions,
              AVG(difficulty) as avg_difficulty
            FROM questions 
            WHERE is_active = 1 
            GROUP BY category_id
          `;
          return await this.executeStatsQuery(
            sql,
            [],
            "question_stats_by_category",
          );
        }
      }

      return new OptimizedQuestionRepository();
    }, []);

    // 問題データの取得（メモ化）
    const loadQuestions = useCallback(async () => {
      try {
        setLoading(true);
        const loadedQuestions =
          await optimizedQuestionRepository.getLearningQuestions(10);
        setQuestions(loadedQuestions);

        if (loadedQuestions.length === 0) {
          logger.warn("[OptimizedLearningScreen] No questions loaded");
        }
      } catch (error) {
        logger.error(
          "[OptimizedLearningScreen] Failed to load questions:",
          error as Error,
        );
      } finally {
        setLoading(false);
      }
    }, [optimizedQuestionRepository]);

    // 初期データ読み込み
    useEffect(() => {
      loadQuestions();
    }, [loadQuestions]);

    // 現在の問題（メモ化）
    const currentQuestion = useMemo(() => {
      return questions[currentQuestionIndex] || null;
    }, [questions, currentQuestionIndex]);

    // 解答送信処理（メモ化）
    const handleSubmitAnswer = useCallback(async () => {
      if (!currentQuestion || !userAnswer.trim()) {
        return;
      }

      const startTime = performance.now();

      try {
        // 解答の正誤判定（簡略化された例）
        const correctAnswer = JSON.parse(currentQuestion.correct_answer_json);
        const isCorrect =
          userAnswer.trim() === correctAnswer.amount?.toString();

        // 解答完了コールバック
        onQuestionComplete(currentQuestion.id, isCorrect);

        // 次の問題に移動
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setUserAnswer("");
        }

        const processingTime = performance.now() - startTime;
        if (processingTime > 100) {
          logger.warn(
            `[OptimizedLearningScreen] Slow answer processing: ${processingTime.toFixed(2)}ms`,
          );
        }
      } catch (error) {
        logger.error(
          "[OptimizedLearningScreen] Answer submission failed:",
          error as Error,
        );
      }
    }, [
      currentQuestion,
      userAnswer,
      onQuestionComplete,
      currentQuestionIndex,
      questions.length,
    ]);

    // 数字パッド表示切り替え（メモ化）
    const toggleNumericPad = useCallback(() => {
      setIsNumericPadVisible((prev) => !prev);
    }, []);

    // 数字パッド値変更（メモ化）
    const handleNumericPadChange = useCallback((value: string) => {
      setUserAnswer(value);
    }, []);

    // 復習画面への遷移（メモ化）
    const handleNavigateToReview = useCallback(() => {
      onNavigateToReview();
    }, [onNavigateToReview]);

    // パフォーマンスレポートの表示（開発環境のみ）
    const showPerformanceReport = useCallback(() => {
      if (__DEV__) {
        const report = performanceIntegration.generatePerformanceReport();
        const componentMetrics = performanceMonitor.getMetrics();

        console.log("=== Component Performance ===");
        console.log(`Renders: ${componentMetrics.renderCount}`);
        console.log(
          `Avg Render Time: ${componentMetrics.averageRenderTime.toFixed(2)}ms`,
        );
        console.log(
          `Max Render Time: ${componentMetrics.maxRenderTime.toFixed(2)}ms`,
        );
        console.log("\n" + report);
      }
    }, [performanceMonitor]);

    // スタイルの計算（メモ化）
    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: theme.colors.background,
          },
          content: {
            flex: 1,
            padding: theme.spacing.lg,
          },
          questionContainer: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            ...theme.shadows.small,
          },
          questionText: {
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          },
          inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          },
          answerInput: {
            flex: 1,
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.spacing.sm,
            padding: theme.spacing.md,
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.text,
            marginRight: theme.spacing.sm,
          },
          buttonContainer: {
            flexDirection: "row",
            gap: theme.spacing.md,
          },
          loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          loadingText: {
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
          },
          debugContainer: {
            position: "absolute",
            top: 50,
            right: 10,
            zIndex: 1000,
          },
        }),
      [theme],
    );

    // レンダリング終了（DOM更新後）
    useEffect(() => {
      performanceMonitor.endRender();
    });

    // ローディング状態の表示
    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>問題を読み込み中...</Text>
          </View>
        </SafeAreaView>
      );
    }

    // 問題がない場合の表示
    if (!currentQuestion) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.questionText}>
              学習できる問題がありません。
            </Text>
            <ButtonOptimized
              title="復習に移動"
              onPress={handleNavigateToReview}
              variant="primary"
              fullWidth
            />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {/* 開発環境でのパフォーマンス情報表示 */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <ButtonOptimized
              title="Performance"
              onPress={showPerformanceReport}
              size="small"
              variant="ghost"
            />
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 問題表示 */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              問題 {currentQuestionIndex + 1} / {questions.length}
            </Text>
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>
          </View>

          {/* 解答入力 */}
          <View style={styles.inputContainer}>
            <Text style={styles.answerInput} onPress={toggleNumericPad}>
              {userAnswer || "金額を入力してください"}
            </Text>
          </View>

          {/* 操作ボタン */}
          <View style={styles.buttonContainer}>
            <ButtonOptimized
              title="数字パッド"
              onPress={toggleNumericPad}
              variant="outline"
              style={{ flex: 1 }}
            />
            <ButtonOptimized
              title="解答送信"
              onPress={handleSubmitAnswer}
              variant="primary"
              disabled={!userAnswer.trim()}
              style={{ flex: 2 }}
            />
          </View>

          <ButtonOptimized
            title="復習に移動"
            onPress={handleNavigateToReview}
            variant="secondary"
            fullWidth
            style={{ marginTop: theme.spacing.lg }}
          />
        </ScrollView>

        {/* 最適化された数字パッド */}
        <NumericPadOptimized
          visible={isNumericPadVisible}
          value={userAnswer}
          onValueChange={handleNumericPadChange}
          onClose={toggleNumericPad}
          placeholder="金額を入力"
          label="解答入力"
        />
      </SafeAreaView>
    );
  },
);

OptimizedLearningScreen.displayName = "OptimizedLearningScreen";

export default OptimizedLearningScreen;

/**
 * パフォーマンス最適化の要点まとめ:
 *
 * 1. React.memo: コンポーネント全体をメモ化し、不要な再レンダリングを防止
 *
 * 2. useCallback: イベントハンドラーをメモ化し、子コンポーネントの再レンダリングを防止
 *
 * 3. useMemo: 重い計算（スタイル作成、データ変換）をメモ化
 *
 * 4. パフォーマンス監視: usePerformanceMonitor でレンダリング性能を追跡
 *
 * 5. 最適化データベース: OptimizedBaseRepository でキャッシュ・バッチ処理を活用
 *
 * 6. パフォーマンス統合: performanceIntegration で全体的な性能管理
 *
 * 7. 最適化コンポーネント: ButtonOptimized, NumericPadOptimized を使用
 *
 * 8. 効果的なメモ化: 依存配列を正確に管理し、適切なメモ化を実装
 *
 * 9. パフォーマンス診断: 開発環境でのリアルタイムパフォーマンス情報表示
 *
 * 10. メモリ効率: 不要なオブジェクト作成を避け、メモリ使用量を最小化
 */
