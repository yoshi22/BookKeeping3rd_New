/**
 * 復習モード問題表示画面
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
import {
  ReviewService,
  reviewService,
} from "../../../../src/services/review-service";
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

export default function ReviewQuestionScreen() {
  // Phase 4: ダークモード対応のテーマシステム
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const {
    id,
    sessionId,
    sessionType,
    filteredQuestions,
    categoryFilter,
    selectedCategory,
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

  // サービスインスタンス
  const reviewService = new ReviewService();
  const questionRepository = new QuestionRepository();

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

        // フィルター済み問題リストがある場合はそれを使用
        if (filteredQuestions && typeof filteredQuestions === "string") {
          const filteredIds = filteredQuestions.split(",");
          const questionRepository = new QuestionRepository();

          // フィルター済み問題IDから問題を取得
          const questionsData = await Promise.all(
            filteredIds.map(async (questionId) => {
              return await questionRepository.findById(questionId.trim());
            }),
          );

          // nullでない問題のみを抽出
          questions = questionsData.filter((q) => q !== null) as Question[];
        }
        // 復習セッションの場合は復習対象問題のみを取得
        else if (sessionType === "review" && sessionId) {
          // categoryFilterパラメータでカテゴリフィルタの有無を判定
          const shouldFilterByCategory = categoryFilter === "true";

          // カテゴリフィルタリング時は、selectedCategoryが渡されていればそれを使用
          // （カテゴリ別復習の場合）、なければIDから推定したカテゴリを使用（後方互換性）
          const actualCategory =
            shouldFilterByCategory && selectedCategory
              ? (selectedCategory as "journal" | "ledger" | "trial_balance")
              : category;

          const reviewQuestions = await reviewService.generateReviewList(
            shouldFilterByCategory
              ? {
                  category: actualCategory,
                  maxCount: 50, // 十分な数を設定
                }
              : {
                  maxCount: 50, // カテゴリフィルタなし（全て復習モード）
                },
          );

          questions = reviewQuestions;
        } else {
          // 通常の復習モードの場合は復習対象問題を取得
          const reviewQuestions = await reviewService.generateReviewList({
            maxCount: 20,
          });

          questions = reviewQuestions;
        }

        if (questions.length === 0) {
          Alert.alert("お知らせ", "復習対象の問題がありません");
          router.back();
          return;
        }

        setCategoryQuestions(questions);

        // 問題開始時間を記録
        setQuestionStartTime(Date.now());

        // セッション開始（まだ開始していない場合）
        if (!sessionStarted) {
          startSession(
            "review",
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
  }, [
    id,
    category,
    sessionType,
    sessionId,
    filteredQuestions,
    categoryFilter,
    selectedCategory,
    router,
  ]);

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
          pathname: "/(tabs)/review/session-result",
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
      // 復習問題の最後だが、セッション途中の場合
      Alert.alert("復習完了", "復習対象の問題を全て完了しました！");
      router.back();
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
        <Text style={styles.loadingText}>復習問題を読み込み中...</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>復習対象の問題が見つかりません</Text>
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
          sessionType="review"
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
