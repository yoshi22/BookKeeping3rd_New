import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import { useTheme } from "../../src/context/ThemeContext";
import {
  MockExamService,
  MockExamSession,
} from "../../src/services/mock-exam-service";
import UnifiedJournalEntryForm from "../../src/components/unified/JournalEntryForm";
import UnifiedLedgerEntryForm from "../../src/components/unified/LedgerEntryForm";
import TrialBalanceForm from "../../src/components/mock-exam/TrialBalanceForm";
import { JournalEntry } from "../../src/components/shared/FormTypes";
import { MockExamLedgerEntry } from "../../src/components/unified/LedgerFormTypes";
import { TrialBalanceEntry } from "../../src/components/mock-exam/TrialBalanceForm";

interface TimerState {
  remainingSeconds: number;
  isRunning: boolean;
}

export default function MockExamExecutionScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  // State management
  const [mockExamService] = useState(() => new MockExamService());
  const [session, setSession] = useState<MockExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState<TimerState>({
    remainingSeconds: 0,
    isRunning: false,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();
  const questionStartTimeRef = useRef<number>();

  // Load mock exam and questions
  useEffect(() => {
    loadMockExamData();
  }, [examId, loadMockExamData]);

  // Timer effect
  useEffect(() => {
    if (timer.isRunning && timer.remainingSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => ({
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        }));
      }, 1000);
    } else if (timer.remainingSeconds === 0 && timer.isRunning) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer.remainingSeconds, timer.isRunning, handleTimeUp]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      handleExitExam();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [handleExitExam]);

  const loadMockExamData = useCallback(async () => {
    try {
      // Start mock exam session using MockExamService
      const mockExamSession =
        await mockExamService.startMockExamSession(examId);

      setSession(mockExamSession);
      setTimer({
        remainingSeconds: mockExamSession.timeLimit * 60,
        isRunning: true,
      });

      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();
      setLoading(false);
    } catch {
      Alert.alert("エラー", "模試セッションの開始に失敗しました");
      router.back();
    }
  }, [examId, router, mockExamService]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleJournalSubmit = async (data: {
    debits: JournalEntry[];
    credits: JournalEntry[];
  }) => {
    if (!session || !session.questions[currentQuestionIndex]) return;

    const currentTime = Date.now();
    const answerTime = questionStartTimeRef.current
      ? currentTime - questionStartTimeRef.current
      : 0;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answerData = {
      questionType: "journal" as const,
      debits: data.debits,
      credits: data.credits,
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      // Show confirmation
      Alert.alert("解答を保存しました", [
        {
          text: "次の問題へ",
          onPress: () => handleNextQuestion(),
        },
      ]);
    } catch {
      Alert.alert("エラー", "解答の保存に失敗しました");
    }
  };

  const handleLedgerSubmit = async (entries: MockExamLedgerEntry[]) => {
    if (!session || !session.questions[currentQuestionIndex]) return;

    const currentTime = Date.now();
    const answerTime = questionStartTimeRef.current
      ? currentTime - questionStartTimeRef.current
      : 0;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answerData = {
      questionType: "ledger" as const,
      ledgerEntry: {
        entries: entries.map((entry) => ({
          date: entry.date,
          description: entry.description,
          receipt_amount: entry.debitAmount, // Map debitAmount to receipt_amount
          payment_amount: entry.creditAmount, // Map creditAmount to payment_amount
        })),
      },
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      // Show confirmation
      Alert.alert("解答を保存しました", [
        {
          text: "次の問題へ",
          onPress: () => handleNextQuestion(),
        },
      ]);
    } catch {
      Alert.alert("エラー", "解答の保存に失敗しました");
    }
  };

  const handleTrialBalanceSubmit = async (entries: TrialBalanceEntry[]) => {
    if (!session || !session.questions[currentQuestionIndex]) return;

    const currentTime = Date.now();
    const answerTime = questionStartTimeRef.current
      ? currentTime - questionStartTimeRef.current
      : 0;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answerData = {
      questionType: "trial_balance" as const,
      entries: entries.map((entry) => ({
        accountName: entry.accountName,
        debitAmount: entry.debitAmount,
        creditAmount: entry.creditAmount,
      })),
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      // Show confirmation
      Alert.alert("解答を保存しました", [
        {
          text: "次の問題へ",
          onPress: () => handleNextQuestion(),
        },
      ]);
    } catch {
      Alert.alert("エラー", "解答の保存に失敗しました");
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      questionStartTimeRef.current = Date.now();
    } else {
      handleFinishExam();
    }
  };

  const handlePreviousQuestion = () => {
    if (!session) return;

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      questionStartTimeRef.current = Date.now();
    }
  };

  const handleTimeUp = useCallback(() => {
    Alert.alert("時間終了", "制限時間が終了しました。自動的に提出します。", [
      { text: "OK", onPress: () => handleFinishExam() },
    ]);
  }, [handleFinishExam]);

  const handleFinishExam = useCallback(() => {
    if (isSubmitting || !session) return;

    setIsSubmitting(true);
    setTimer((prev) => ({ ...prev, isRunning: false }));

    Alert.alert("試験終了", [
      {
        text: "続行",
        style: "cancel",
        onPress: () => {
          setIsSubmitting(false);
          if (timer.remainingSeconds > 0) {
            setTimer((prev) => ({ ...prev, isRunning: true }));
          }
        },
      },
      {
        text: "終了",
        onPress: () => submitExam(),
      },
    ]);
  }, [isSubmitting, session, submitExam, timer.remainingSeconds]);

  const handleExitExam = useCallback(() => {
    if (isSubmitting) return;

    Alert.alert(
      "試験を中断しますか？",
      "進行中の試験を中断すると、解答内容は保存されません。",
      [
        { text: "続行", style: "cancel" },
        {
          text: "中断",
          style: "destructive",
          onPress: () => {
            setTimer((prev) => ({ ...prev, isRunning: false }));
            router.back();
          },
        },
      ],
    );
  }, [isSubmitting, router]);

  const submitExam = async () => {
    if (!session) return;

    try {
      // Complete the mock exam session and get real scoring results
      const result = await mockExamService.completeMockExamSession(session);

      // Navigate to result screen with the session result
      router.push({
        pathname: "/mock-exam/result",
        params: {
          examId: session.examId,
          sessionResult: JSON.stringify(result),
        },
      });
    } catch {
      Alert.alert("エラー", "模試の完了処理に失敗しました");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={[styles.container, styles.centered]}>
          <Text style={{ color: theme.colors.text }}>
            模試データを読み込んでいます...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!session || session.questions.length === 0) {
    return (
      <Screen>
        <View style={[styles.container, styles.centered]}>
          <Text style={{ color: theme.colors.error }}>
            模試セッションの開始に失敗しました
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: theme.colors.primary }}>戻る</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];

  const renderQuestionForm = () => {
    const questionType = currentQuestion.category_id;
    const commonProps = {
      questionText: currentQuestion.question_text,
      onNext:
        currentQuestionIndex < session.questions.length - 1
          ? handleNextQuestion
          : undefined,
      onPrevious: currentQuestionIndex > 0 ? handlePreviousQuestion : undefined,
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: session.questions.length,
      timeRemaining: formatTime(timer.remainingSeconds),
    };

    switch (questionType) {
      case "journal":
        return (
          <UnifiedJournalEntryForm
            {...commonProps}
            onDirectSubmit={handleJournalSubmit}
            mode="mock_exam"
            questionId={currentQuestion.question_id || currentQuestion.id}
          />
        );
      case "ledger":
        return (
          <UnifiedLedgerEntryForm
            {...commonProps}
            onDirectSubmit={handleLedgerSubmit}
            mode="mock_exam"
            questionId={currentQuestion.question_id || currentQuestion.id}
          />
        );
      case "trial_balance":
        return (
          <TrialBalanceForm
            {...commonProps}
            onSubmit={handleTrialBalanceSubmit}
          />
        );
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              未対応の問題タイプ: {questionType}
            </Text>
          </View>
        );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `模試 - 問${currentQuestionIndex + 1}`,
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.background,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleExitExam}
              style={styles.exitButton}
            >
              <Text style={{ color: theme.colors.background, fontSize: 16 }}>
                中断
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.timerContainer}>
              <Text
                style={[styles.timerText, { color: theme.colors.background }]}
              >
                残り {formatTime(timer.remainingSeconds)}
              </Text>
            </View>
          ),
        }}
      />

      <Screen safeArea={false}>
        <View style={styles.container}>{renderQuestionForm()}</View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  exitButton: {
    marginLeft: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timerContainer: {
    marginRight: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
