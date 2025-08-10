import React, { useState, useEffect, useRef } from "react";
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
import { MockExamRepository } from "../../src/data/repositories/mock-exam-repository";
import { QuestionRepository } from "../../src/data/repositories/question-repository";
import { MockExam, Question } from "../../src/types/models";
import {
  MockExamService,
  MockExamSession,
} from "../../src/services/mock-exam-service";
import JournalEntryForm from "../../src/components/mock-exam/JournalEntryForm";
import { JournalEntry } from "../../src/components/mock-exam/JournalEntryForm";
import LedgerEntryForm from "../../src/components/mock-exam/LedgerEntryForm";
import { LedgerEntry } from "../../src/components/mock-exam/LedgerEntryForm";
import TrialBalanceForm from "../../src/components/mock-exam/TrialBalanceForm";
import { TrialBalanceEntry } from "../../src/components/mock-exam/TrialBalanceForm";

interface MockExamAnswer {
  questionId: string;
  sectionNumber: number;
  questionOrder: number;
  userAnswer: any;
  timeSpent: number;
  isCorrect?: boolean;
  score?: number;
}

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
  }, [examId]);

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
  }, [timer.remainingSeconds, timer.isRunning]);

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
  }, []);

  const loadMockExamData = async () => {
    try {
      console.log("Starting mock exam session for:", examId);

      // Start mock exam session using MockExamService
      const mockExamSession =
        await mockExamService.startMockExamSession(examId);

      console.log("Mock exam session started:", {
        examId: mockExamSession.examId,
        questionCount: mockExamSession.questions.length,
        timeLimit: mockExamSession.timeLimit,
      });

      setSession(mockExamSession);
      setTimer({
        remainingSeconds: mockExamSession.timeLimit * 60,
        isRunning: true,
      });

      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();
      setLoading(false);
    } catch (error) {
      console.error("Failed to start mock exam session:", error);
      Alert.alert("エラー", "模試セッションの開始に失敗しました");
      router.back();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleJournalSubmit = async (
    debits: JournalEntry[],
    credits: JournalEntry[],
  ) => {
    if (!session || !session.questions[currentQuestionIndex]) return;

    const currentTime = Date.now();
    const answerTime = questionStartTimeRef.current
      ? currentTime - questionStartTimeRef.current
      : 0;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answerData = {
      questionType: "journal" as const,
      debits,
      credits,
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      console.log(
        "Answer recorded for question:",
        currentQuestion.question_id || currentQuestion.id,
      );

      // Show confirmation
      Alert.alert(
        "解答を保存しました",
        `問${currentQuestionIndex + 1}の解答を保存しました。`,
        [
          {
            text: "次の問題へ",
            onPress: () => handleNextQuestion(),
          },
        ],
      );
    } catch (error) {
      console.error("Failed to record answer:", error);
      Alert.alert("エラー", "解答の保存に失敗しました");
    }
  };

  const handleLedgerSubmit = async (entries: LedgerEntry[]) => {
    if (!session || !session.questions[currentQuestionIndex]) return;

    const currentTime = Date.now();
    const answerTime = questionStartTimeRef.current
      ? currentTime - questionStartTimeRef.current
      : 0;

    const currentQuestion = session.questions[currentQuestionIndex];
    const answerData = {
      questionType: "ledger" as const,
      entries,
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      console.log(
        "Ledger answer recorded for question:",
        currentQuestion.question_id || currentQuestion.id,
      );

      // Show confirmation
      Alert.alert(
        "解答を保存しました",
        `問${currentQuestionIndex + 1}の解答を保存しました。`,
        [
          {
            text: "次の問題へ",
            onPress: () => handleNextQuestion(),
          },
        ],
      );
    } catch (error) {
      console.error("Failed to record ledger answer:", error);
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
      entries,
    };

    try {
      // Record the answer using MockExamService
      await mockExamService.recordMockExamAnswer(
        session,
        currentQuestion.question_id || currentQuestion.id,
        answerData,
        answerTime,
      );

      console.log(
        "Trial balance answer recorded for question:",
        currentQuestion.question_id || currentQuestion.id,
      );

      // Show confirmation
      Alert.alert(
        "解答を保存しました",
        `問${currentQuestionIndex + 1}の解答を保存しました。`,
        [
          {
            text: "次の問題へ",
            onPress: () => handleNextQuestion(),
          },
        ],
      );
    } catch (error) {
      console.error("Failed to record trial balance answer:", error);
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

  const handleTimeUp = () => {
    Alert.alert("時間終了", "制限時間が終了しました。自動的に提出します。", [
      { text: "OK", onPress: () => handleFinishExam() },
    ]);
  };

  const handleFinishExam = () => {
    if (isSubmitting || !session) return;

    setIsSubmitting(true);
    setTimer((prev) => ({ ...prev, isRunning: false }));

    Alert.alert(
      "試験終了",
      `解答済み: ${session.answers.size}問 / ${session.questions.length}問\n\n本当に終了しますか？`,
      [
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
      ],
    );
  };

  const handleExitExam = () => {
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
  };

  const submitExam = async () => {
    if (!session) return;

    try {
      console.log("Completing mock exam session...");

      // Complete the mock exam session and get real scoring results
      const result = await mockExamService.completeMockExamSession(session);

      console.log("Mock exam completed with results:", {
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        isPassed: result.isPassed,
        duration: result.duration,
      });

      // Navigate to result screen with the session result
      router.push({
        pathname: "/mock-exam/result",
        params: {
          examId: session.examId,
          sessionResult: JSON.stringify(result),
        },
      });
    } catch (error) {
      console.error("Failed to complete mock exam session:", error);
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
          <JournalEntryForm {...commonProps} onSubmit={handleJournalSubmit} />
        );
      case "ledger":
        return (
          <LedgerEntryForm {...commonProps} onSubmit={handleLedgerSubmit} />
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
          headerLeft: () => (
            <TouchableOpacity onPress={handleExitExam}>
              <Text style={{ color: theme.colors.background, marginLeft: 16 }}>
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

      <Screen>
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
