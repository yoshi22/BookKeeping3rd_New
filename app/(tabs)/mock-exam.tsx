import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MockExam } from "../../src/types/models";
import { MockExamRepository } from "../../src/data/repositories/mock-exam-repository";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import { WithScreenTransition } from "../../src/hooks/useScreenTransitions";
import {
  SkeletonLoader,
  StepIndicator,
} from "../../src/hooks/useProgressIndicators";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
} from "../../src/context/ThemeContext";

export default function MockExamTabScreen() {
  // Phase 4: ダークモード対応のテーマシステム
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  const router = useRouter();
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockExams();
  }, []);

  const loadMockExams = async () => {
    try {
      const mockExamRepo = new MockExamRepository();
      const exams = await mockExamRepo.findAll();
      const activeExams = exams.filter((exam) => exam.is_active);
      setMockExams(activeExams);
    } catch (error) {
      console.error("Error loading mock exams:", error);
      Alert.alert("エラー", "模試データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const startMockExam = (exam: MockExam) => {
    Alert.alert(
      "模試開始確認",
      `${exam.name}を開始しますか？\n\n制限時間: ${exam.time_limit_minutes}分\n合格基準: ${exam.passing_score}点以上`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "開始",
          onPress: () => {
            router.push({
              pathname: "/mock-exam/[examId]",
              params: { examId: exam.id },
            });
          },
        },
      ],
    );
  };

  return (
    <WithScreenTransition
      transitionType="slideInUp"
      transitionConfig={{ duration: 350 }}
    >
      <Screen
        safeArea={true}
        scrollable={false}
        statusBarStyle={getStatusBarStyle()}
        testID="mock-exam-screen"
      >
        <View style={styles.header}>
          <Text style={styles.title}>模擬試験</Text>
          <Text style={styles.subtitle}>
            本試験形式のCBT模擬試験で実力をチェックしましょう。{"\n"}
            制限時間内に全問題に取り組んでください。
          </Text>
        </View>

        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <SkeletonLoader width="100%" height={120} borderRadius={12} />
              <SkeletonLoader width="100%" height={120} borderRadius={12} />
              <SkeletonLoader width="100%" height={120} borderRadius={12} />
            </View>
          ) : (
            <View testID="mock-exam-list">
              {mockExams.map((exam) => {
                let structure;
                try {
                  structure = JSON.parse(exam.structure_json);
                } catch {
                  structure = {
                    section1: { count: 15 },
                    section2: { count: 2 },
                    section3: { count: 1 },
                  };
                }
                const totalQuestions =
                  (structure.section1?.count || 0) +
                  (structure.section2?.count || 0) +
                  (structure.section3?.count || 0);

                // Format exam ID as 3-digit string for testID
                const examIdFormatted = exam.id.toString().padStart(3, "0");

                return (
                  <TouchableOpacity
                    key={exam.id}
                    style={styles.examCard}
                    onPress={() => startMockExam(exam)}
                    testID={`mock-exam-${examIdFormatted}`}
                    accessibilityLabel={`${exam.name}模試を開始`}
                  >
                    <View style={styles.examInfo}>
                      <Text style={styles.examName}>{exam.name}</Text>
                      <Text style={styles.examDescription}>
                        {exam.description}
                      </Text>
                      <View style={styles.examDetails}>
                        <Text style={styles.examDetail}>
                          📝 {totalQuestions}問
                        </Text>
                        <Text style={styles.examDetail}>
                          ⏰ {exam.time_limit_minutes}分
                        </Text>
                        <Text style={styles.examDetail}>
                          🎯 {exam.total_score}点満点
                        </Text>
                        <Text style={styles.examDetail}>
                          ✅ {exam.passing_score}点で合格
                        </Text>
                      </View>

                      {/* 模試セクション構成 */}
                      <View style={styles.stepContainer}>
                        <StepIndicator
                          steps={[
                            {
                              id: "section1",
                              title: "第1問",
                              description: `仕訳問題 ${structure.section1?.count || 15}問`,
                              completed: false,
                              active: false,
                            },
                            {
                              id: "section2",
                              title: "第2問",
                              description: `補助簿等 ${structure.section2?.count || 2}問`,
                              completed: false,
                              active: false,
                            },
                            {
                              id: "section3",
                              title: "第3問",
                              description: `決算書 ${structure.section3?.count || 1}問`,
                              completed: false,
                              active: false,
                            },
                          ]}
                          currentStep={-1}
                          orientation="horizontal"
                          size={24}
                          activeColor={theme.colors.primary}
                          inactiveColor={theme.colors.borderLight}
                        />
                      </View>
                    </View>
                    <View style={styles.startButton}>
                      <Text style={styles.startButtonText}>開始</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </Screen>
    </WithScreenTransition>
  );
}

const createStyles = (
  theme: typeof import("../../src/context/ThemeContext").Theme,
) =>
  StyleSheet.create({
    header: {
      padding: 20,
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    content: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    examCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      ...theme.shadows.medium,
    },
    examInfo: {
      flex: 1,
    },
    examName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    examDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    examDetails: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    examDetail: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginRight: 16,
      marginBottom: 4,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    startButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    stepContainer: {
      marginTop: 16,
      paddingTop: 8,
    },
  });
