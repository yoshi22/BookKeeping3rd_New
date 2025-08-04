/**
 * 問題表示画面
 * Step 2.2: 解答記録機能実装統合
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
import QuestionDisplay from "../../src/components/QuestionDisplay";
import QuestionNavigation from "../../src/components/QuestionNavigation";
import AnswerResultDialog from "../../src/components/AnswerResultDialog";
import { useQuestionNavigation } from "../../src/hooks/useQuestionNavigation";
import { SubmitAnswerResponse } from "../../src/services/answer-service";
import { SessionType } from "../../src/types/database";

// サンプル問題データ（簡略化）
const sampleQuestions = {
  Q_J_001: {
    id: "Q_J_001",
    category_id: "journal",
    question_text: "商品200,000円を現金で仕入れた。",
    explanation:
      "商品を仕入れたときは「仕入」勘定で処理します。現金で支払っているので、現金が減少します。",
    difficulty: 1,
  },
  Q_J_002: {
    id: "Q_J_002",
    category_id: "journal",
    question_text: "商品300,000円を売り上げ、代金は掛けとした。",
    explanation:
      "商品を販売したときは「売上」勘定に記録します。代金が掛けの場合は「売掛金」勘定を使用します。",
    difficulty: 1,
  },
  Q_J_003: {
    id: "Q_J_003",
    category_id: "journal",
    question_text: "売掛金150,000円を現金で回収した。",
    explanation:
      "売掛金を現金で回収したときは、現金が増加し、売掛金が減少します。",
    difficulty: 1,
  },
  Q_L_001: {
    id: "Q_L_001",
    category_id: "ledger",
    question_text:
      "以下の取引を現金出納帳に記入してください。\n4月1日 商品100,000円を現金で仕入れた。\n4月3日 売上200,000円を現金で受け取った。\n4月1日の現金残高は50,000円でした。",
    explanation:
      "現金出納帳では、期首残高50,000円から仕入で100,000円減少（残高-50,000円）、その後売上で200,000円増加して最終残高150,000円となります。",
    difficulty: 2,
  },
  Q_T_001: {
    id: "Q_T_001",
    category_id: "trial_balance",
    question_text:
      "以下の残高から試算表を作成してください。\n現金: 100,000円\n売掛金: 200,000円\n商品: 150,000円\n買掛金: 80,000円\n資本金: 370,000円\n\n借方合計を求めてください。",
    explanation:
      "借方科目（現金100,000円 + 売掛金200,000円 + 商品150,000円）の合計は450,000円です。試算表では借方合計と貸方合計が一致する必要があります。",
    difficulty: 2,
  },
};

export default function QuestionScreen() {
  const { id } = useLocalSearchParams();
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
    questions: [], // 空配列でサンプルデータを使用
    initialQuestionId: id as string,
  });

  // 問題データ読み込み
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        if (!id || typeof id !== "string") {
          Alert.alert("エラー", "問題IDが指定されていません");
          router.back();
          return;
        }

        // 問題が見つからない場合
        if (!currentQuestion) {
          Alert.alert("エラー", "問題が見つかりません");
          router.back();
          return;
        }

        // 問題開始時間を記録
        setQuestionStartTime(Date.now());

        // 簡単な遅延でローディング状態をシミュレート
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        Alert.alert("エラー", "問題の読み込みに失敗しました");
        router.back();
      }
    };

    loadQuestion();
  }, [id, currentQuestion]);

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
      console.log(`[QuestionScreen] 復習対象問題: ${id}`);
      // TODO: 復習リスト追加処理（Step 2.3で実装）
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
    // TODO: 実際の復習リスト追加処理（Step 2.3で実装）
  };

  // 戻るボタン
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

  // 問題タイプに応じた解答フィールドを取得
  const getAnswerFields = (question: any) => {
    if (!question) return [];

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
        showQuestionNumbers={true}
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
        sessionType={"learning" as SessionType}
        startTime={questionStartTime}
        onSubmitAnswer={handleAnswerSubmitted}
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
  explanationSection: {
    backgroundColor: "#fff3e0",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
});
