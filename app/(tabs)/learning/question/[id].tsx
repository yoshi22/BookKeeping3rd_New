/**
 * 学習モード問題表示画面
 * タブ内スタックナビゲーション対応版
 * 10問バッチセッション対応
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuestionDisplay from "../../../../src/components/QuestionDisplay";
import QuestionNavigation from "../../../../src/components/QuestionNavigation";
import AnswerResultDialog from "../../../../src/components/AnswerResultDialog";
import { useQuestionNavigation } from "../../../../src/hooks/useQuestionNavigation";
import { SubmitAnswerResponse } from "../../../../src/services/answer-service";
import { reviewService } from "../../../../src/services/review-service";
import { QuestionRepository } from "../../../../src/data/repositories/question-repository";
import type { Question } from "../../../../src/types/models";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../../../src/context/ThemeContext";
import { BannerAdWrapper } from "@/components/ads/BannerAdWrapper";
import { useSession } from "@/hooks/useSession";
import { SESSION_BATCH_SIZE } from "@/config/monetization";

export default function LearningQuestionScreen() {
  // Phase 4: ダークモード対応のテーマシステム
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const {
    id,
    sessionId,
    sessionType,
    filteredQuestions,
    categoryId,
    learningMode,
  } = useLocalSearchParams();
  const router = useRouter();

  // セッション管理（10問バッチ）
  const {
    session,
    isSessionComplete,
    startSession,
    recordAnswer,
    completeSession,
  } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submitResult, setSubmitResult] = useState<SubmitAnswerResponse | null>(
    null,
  );
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  // 問題IDからカテゴリを推定
  const getCategoryFromId = (
    questionId: string,
  ): "journal" | "ledger" | "trial_balance" => {
    if (questionId.startsWith("Q_J_")) return "journal";
    if (questionId.startsWith("Q_L_")) return "ledger";
    if (questionId.startsWith("Q_T_")) return "trial_balance";
    return "journal"; // デフォルト
  };

  const category = getCategoryFromId(id as string);

  // 問題ナビゲーションフックを使用
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    goToQuestion,
    getCategoryName,
  } = useQuestionNavigation({
    category,
    questions: categoryQuestions,
    initialQuestionId: id as string,
  });

  // 問題データ読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        if (!id || typeof id !== "string") {
          Alert.alert("エラー", "問題IDが指定されていません");
          router.back();
          return;
        }

        setIsLoading(true);

        let questions: Question[] = [];

        // 学習モードの判定
        const currentLearningMode = learningMode || "all";

        if (filteredQuestions && typeof filteredQuestions === "string") {
          // フィルター済み問題リストがある場合は優先的に使用
          const filteredIds = filteredQuestions.split(",");
          const questionRepository = new QuestionRepository();

          // フィルター済み問題IDから問題を取得（順序維持）
          const cleanFilteredIds = filteredIds.map((id) => id.trim());
          questions =
            await questionRepository.findByIdsInOrder(cleanFilteredIds);
        } else if (currentLearningMode === "category" && categoryId) {
          // フィルターがない場合のみカテゴリ別学習モード：指定されたカテゴリの問題のみ取得
          const questionRepository = new QuestionRepository();
          questions = await questionRepository.findByCategory(
            categoryId as any,
            { useProblemsStrategyOrder: true },
          );
        } else {
          // 全問題順次進行モード（全302問を順次進行）
          const questionRepository = new QuestionRepository();
          // カテゴリ別ではなく、全問題を取得して順次進行させる
          const allQuestions = await Promise.all([
            questionRepository.findByCategory("journal", {
              useProblemsStrategyOrder: true,
            }), // 仕訳問題（250問）
            questionRepository.findByCategory("ledger", {
              useProblemsStrategyOrder: true,
            }), // 帳簿問題（40問）
            questionRepository.findByCategory("trial_balance", {
              useProblemsStrategyOrder: true,
            }), // 試算表問題（12問）
          ]);
          // 全問題を1つの配列にまとめる（problemsStrategy.mdに従い302問順次進行）
          questions = allQuestions.flat().sort((a, b) => {
            // section_number → question_order の順でソート
            const aSection = a.section_number ?? 0;
            const bSection = b.section_number ?? 0;
            if (aSection !== bSection) {
              return aSection - bSection;
            }
            const aOrder = a.question_order ?? 0;
            const bOrder = b.question_order ?? 0;
            return aOrder - bOrder;
          });

          // Q2問題のデバッグ用：ソート後の最初の15問を確認
          const q2Questions = questions
            .filter((q) => q.category_id === "ledger")
            .slice(0, 15);
          if (q2Questions.length > 0) {
            console.log(
              "[DEBUG-Q2-APP] ソート後のQ2順序:",
              q2Questions.map((q) => `${q.id}(${q.question_order})`).join(", "),
            );
          }
        }

        if (questions.length === 0) {
          Alert.alert("エラー", "このカテゴリの問題が見つかりません");
          router.back();
          return;
        }

        setCategoryQuestions(questions);

        // 問題開始時間を記録
        setQuestionStartTime(Date.now());

        // セッション開始（まだ開始していない場合）
        if (!sessionStarted) {
          startSession(
            "learning",
            questions.map((q) => q.id),
          );
          setSessionStarted(true);
        }

        setIsLoading(false);
      } catch {
        Alert.alert("エラー", "問題の読み込みに失敗しました");
        router.back();
      }
    };

    loadQuestions();
  }, [id, category, sessionType, sessionId, filteredQuestions, router]);

  // 問題が切り替わった時にuserAnswersをリセット
  useEffect(() => {
    if (currentQuestion?.id) {
      setUserAnswers({});
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion?.id]);

  // 解答変更処理
  const handleAnswerChange = (fieldName: string, value: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // 解答送信後の処理
  const handleAnswerSubmitted = (result: SubmitAnswerResponse) => {
    setSubmitResult(result);
    setShowResultDialog(true);

    // セッションに解答を記録
    recordAnswer(result.isCorrect);

    // 間違いの場合は復習リストに自動追加する処理を追加可能
    if (!result.isCorrect) {
    }
  };

  // 結果ダイアログを閉じる処理
  const handleCloseResultDialog = () => {
    setShowResultDialog(false);
    setSubmitResult(null);
  };

  // 復習対象に追加
  const handleAddToReview = async (questionId: string) => {
    try {
      await reviewService.forceAddToReview(questionId, "自信なし");
      Alert.alert(
        "復習対象に追加",
        "この問題を復習対象に追加しました。復習タブで確認できます。",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert(
        "エラー",
        "復習対象への追加に失敗しました。もう一度お試しください。",
        [{ text: "OK" }],
      );
    }
  };

  // 次の問題へ
  const handleNextQuestion = useCallback(async () => {
    // セッション完了（10問解答済み）の場合は結果画面へ
    if (isSessionComplete) {
      const result = await completeSession();
      setShowResultDialog(false);
      setSubmitResult(null);

      if (result) {
        // セッション結果画面へ遷移
        router.push({
          pathname: "/(tabs)/learning/session-result",
          params: {
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            incorrectAnswers: result.incorrectAnswers,
            accuracy: result.accuracy,
            totalTimeMs: result.totalTimeMs,
            averageTimeMs: result.averageTimeMs,
          },
        });
      }
      return;
    }

    if (canGoNext) {
      setShowResultDialog(false);
      setSubmitResult(null);
      setUserAnswers({});
      setQuestionStartTime(Date.now());
      goToNext();
    } else {
      // 問題リストの最後だが、セッション途中の場合
      // 学習画面に戻る（次回開始時に続きから）
      Alert.alert("最後の問題です", "他のカテゴリの問題に挑戦してみましょう！");
    }
  }, [isSessionComplete, canGoNext, completeSession, goToNext, router]);

  // 戻るボタン（タブ内ナビゲーション用）
  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>問題を読み込み中...</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>問題が見つかりません</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parse answer template from question data
  const getAnswerTemplate = (question: any) => {
    if (!question?.answer_template_json) return undefined;

    try {
      const template = JSON.parse(question.answer_template_json);

      return template;
    } catch {
      return undefined;
    }
  };

  // 問題タイプに応じた解答フィールドを取得
  const getAnswerFields = (question: any) => {
    if (!question) return [];

    // まずanswer_template_jsonから解答フィールドを取得を試みる
    try {
      if (question.answer_template_json) {
        const answerTemplate = JSON.parse(question.answer_template_json);

        if (
          answerTemplate &&
          answerTemplate.fields &&
          Array.isArray(answerTemplate.fields)
        ) {
          return answerTemplate.fields.map((field: any) => ({
            label: field.label,
            type: field.type as "dropdown" | "number" | "text",
            name: field.name,
            required: field.required || false,
            format: field.format,
            options: field.options,
          }));
        }
      }
    } catch {}

    // フォールバック: カテゴリごとのデフォルトフィールド
    switch (question.category_id) {
      case "journal":
        return [
          {
            label: "借方科目",
            type: "dropdown" as const,
            name: "debit_account",
            required: true,
          },
          {
            label: "借方金額",
            type: "number" as const,
            name: "debit_amount",
            required: true,
            format: "currency" as const,
          },
          {
            label: "貸方科目",
            type: "dropdown" as const,
            name: "credit_account",
            required: true,
          },
          {
            label: "貸方金額",
            type: "number" as const,
            name: "credit_amount",
            required: true,
            format: "currency" as const,
          },
        ];
      case "ledger":
        return [
          {
            label: "計算結果",
            type: "number" as const,
            name: "result_amount",
            required: true,
            format: "currency" as const,
          },
        ];
      case "trial_balance":
        return [
          {
            label: "借方合計",
            type: "number" as const,
            name: "debit_total",
            required: true,
            format: "currency" as const,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* セッション進捗表示 */}
        {session && (
          <View style={styles.sessionProgress}>
            <Text style={styles.sessionProgressText}>
              セッション: {session.answeredCount}/{SESSION_BATCH_SIZE}問
            </Text>
          </View>
        )}

        {/* 問題ナビゲーション */}
        <QuestionNavigation
          currentQuestionIndex={currentIndex}
          totalQuestions={totalQuestions}
          categoryName={getCategoryName()}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onQuestionSelect={goToQuestion}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          showQuestionNumbers={false}
        />

        {/* 問題表示 */}
        <QuestionDisplay
          questionId={currentQuestion.id}
          categoryName={getCategoryName()}
          questionText={currentQuestion.question_text}
          difficulty={currentQuestion.difficulty}
          answerFields={getAnswerFields(currentQuestion)}
          answers={userAnswers}
          explanation={submitResult?.explanation || currentQuestion.explanation}
          showExplanation={showExplanation}
          isCorrect={submitResult?.isCorrect}
          correctAnswer={submitResult?.correctAnswer}
          onBack={handleGoBack}
          onAnswerChange={handleAnswerChange}
          sessionType="learning"
          startTime={questionStartTime}
          onSubmitAnswer={handleAnswerSubmitted}
          answerTemplate={getAnswerTemplate(currentQuestion)}
        />

        {/* 解答結果ダイアログ */}
        <AnswerResultDialog
          visible={showResultDialog}
          result={submitResult}
          onClose={handleCloseResultDialog}
          onNextQuestion={handleNextQuestion}
          showNextButton={canGoNext || isSessionComplete}
          questionId={currentQuestion.id}
          onAddToReview={handleAddToReview}
          answerTemplate={getAnswerTemplate(currentQuestion)}
        />
      </ScrollView>

      {/* バナー広告（非プレミアムユーザーのみ） */}
      <BannerAdWrapper />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    sessionProgress: {
      backgroundColor: theme.colors.primaryLight,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 8,
    },
    sessionProgressText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "center",
      marginBottom: 20,
    },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
  });
