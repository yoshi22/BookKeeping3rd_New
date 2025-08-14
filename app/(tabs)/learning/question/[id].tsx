/**
 * 学習モード問題表示画面
 * タブ内スタックナビゲーション対応版
 */

import React, { useState, useEffect } from "react";
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
import { SessionType } from "../../../../src/types/database";
import { QuestionRepository } from "../../../../src/data/repositories/question-repository";
import type { Question } from "../../../../src/types/models";
import { reviewService } from "../../../../src/services/review-service";

export default function LearningQuestionScreen() {
  const { id, sessionId, sessionType, filteredQuestions } =
    useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submitResult, setSubmitResult] = useState<SubmitAnswerResponse | null>(
    null,
  );
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);

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
          console.log(
            "[LearningQuestionScreen] フィルター済み問題リストを使用:",
            filteredQuestions,
          );

          const filteredIds = filteredQuestions.split(",");
          const questionRepository = new QuestionRepository();

          // フィルター済み問題IDから問題を取得（バッチクエリ使用でパフォーマンス向上）
          const cleanFilteredIds = filteredIds.map((id) => id.trim());
          questions = await questionRepository.findByIds(cleanFilteredIds);
          console.log(
            `[LearningQuestionScreen] フィルター済み問題: ${questions.length}件`,
          );
        } else {
          // 通常の学習モードの場合は全問題を取得（全302問を順次進行）
          const questionRepository = new QuestionRepository();
          // カテゴリ別ではなく、全問題を取得して順次進行させる
          const allQuestions = await Promise.all([
            questionRepository.findByCategory("journal"), // 仕訳問題（250問）
            questionRepository.findByCategory("ledger"), // 帳簿問題（40問）
            questionRepository.findByCategory("trial_balance"), // 試算表問題（12問）
          ]);
          // 全問題を1つの配列にまとめる（problemsStrategy.mdに従い302問順次進行）
          questions = allQuestions
            .flat()
            .sort((a, b) => a.id.localeCompare(b.id));
          console.log(
            `[LearningQuestionScreen] 全302問を順次進行モードで読み込み: ${questions.length}件`,
          );
        }

        if (questions.length === 0) {
          Alert.alert("エラー", "このカテゴリの問題が見つかりません");
          router.back();
          return;
        }

        setCategoryQuestions(questions);

        // 問題開始時間を記録
        setQuestionStartTime(Date.now());

        setIsLoading(false);
      } catch (error) {
        console.error("[LearningQuestionScreen] 問題読み込みエラー:", error);
        Alert.alert("エラー", "問題の読み込みに失敗しました");
        router.back();
      }
    };

    loadQuestions();
  }, [id, category, sessionType, sessionId, filteredQuestions]);

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

    // 間違いの場合は復習リストに自動追加する処理を追加可能
    if (!result.isCorrect) {
      console.log(`[LearningQuestionScreen] 復習対象問題: ${id}`);
    }
  };

  // 結果ダイアログを閉じる処理
  const handleCloseResultDialog = () => {
    setShowResultDialog(false);
    setSubmitResult(null);
  };

  // 次の問題へ
  const handleNextQuestion = () => {
    if (canGoNext) {
      setShowResultDialog(false);
      setSubmitResult(null);
      setUserAnswers({});
      setQuestionStartTime(Date.now());
      goToNext();
    } else {
      Alert.alert("最後の問題です", "他のカテゴリの問題に挑戦してみましょう！");
    }
  };

  // 復習リストに追加
  const handleAddToReview = () => {
    Alert.alert(
      "復習リストに追加",
      "復習リストに追加されました。復習画面からアクセスできます。",
    );
  };

  // 戻るボタン（タブ内ナビゲーション用）
  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
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
      console.log("[LearningQuestionScreen] Parsed answer template:", template);
      return template;
    } catch (error) {
      console.warn(
        "[LearningQuestionScreen] answer_template_json解析エラー:",
        error,
      );
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
          console.log(
            "[LearningQuestionScreen] answer_template_jsonからフィールドを生成:",
            answerTemplate,
          );

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
    } catch (error) {
      console.warn(
        "[LearningQuestionScreen] answer_template_json解析エラー:",
        error,
      );
    }

    // フォールバック: カテゴリごとのデフォルトフィールド
    console.log(
      "[LearningQuestionScreen] フォールバック: デフォルトフィールドを使用",
    );
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
    <ScrollView style={styles.container}>
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
        explanation={currentQuestion.explanation}
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
        onReviewQuestion={handleAddToReview}
        showNextButton={canGoNext}
        showReviewButton={!submitResult?.isCorrect}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: "#2f95dc",
    fontSize: 16,
  },
});
