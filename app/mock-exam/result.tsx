import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../src/context/ThemeContext";
import { MockExamSessionResult } from "../../src/services/mock-exam-service";

export default function MockExamResultScreen() {
  const { examId, sessionResult } = useLocalSearchParams<{
    examId: string;
    sessionResult: string;
  }>();

  const router = useRouter();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [result, setResult] = useState<MockExamSessionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const calculateResults = useCallback(async () => {
    try {
      if (!sessionResult) {
        Alert.alert("エラー", "模試結果データが見つかりません");
        router.back();
        return;
      }

      // Parse the real session result from MockExamService
      const parsedResult = JSON.parse(sessionResult) as MockExamSessionResult;

      setResult(parsedResult);
    } catch {
      Alert.alert("エラー", "結果データの解析に失敗しました");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [sessionResult, router]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const getScoreColor = (
    score: number,
    maxScore: number,
    passingScore: number,
  ): string => {
    const percentage = (score / maxScore) * 100;
    const passingPercentage = (passingScore / maxScore) * 100;

    if (percentage >= passingPercentage) return theme.colors.success;
    if (percentage >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  if (loading) {
    return (
      <Screen>
        <View style={[styles.container, styles.centered]}>
          <Text style={{ color: theme.colors.text }}>
            結果を計算しています...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!result) {
    return (
      <Screen>
        <View style={[styles.container, styles.centered]}>
          <Text style={{ color: theme.colors.error }}>
            結果の計算に失敗しました
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "模試結果",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.background,
          headerLeft: () => null, // Prevent going back to exam
        }}
      />

      <Screen>
        <ScrollView style={styles.container}>
          {/* Overall Result Header */}
          <View
            style={[
              styles.resultHeader,
              {
                backgroundColor: result.isPassed
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          >
            <Text style={styles.resultTitle}>
              {result.isPassed ? "🎉 合格" : "📝 不合格"}
            </Text>
            <Text style={styles.resultSubtitle}>模試結果</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {result.totalScore}点 / {result.maxScore}点
              </Text>
              <Text style={styles.passingText}>(合格基準: 70点以上)</Text>
            </View>
          </View>

          {/* Summary Stats */}
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              試験概要
            </Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  解答数
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {Object.values(result.sectionResults).reduce(
                    (sum, section) => sum + section.questions.length,
                    0,
                  )}
                  問
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  所要時間
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {formatTime(result.duration)}
                </Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  正答率
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {Math.round((result.totalScore / result.maxScore) * 100)}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  得点率
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {Math.round((result.totalScore / result.maxScore) * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Section Results */}
          {Object.entries(result.sectionResults).map(
            ([sectionKey, section]) => (
              <View
                key={sectionKey}
                style={[
                  styles.sectionCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  {sectionKey === "section1"
                    ? "第1問：仕訳問題"
                    : sectionKey === "section2"
                      ? "第2問：帳簿問題"
                      : sectionKey === "section3"
                        ? "第3問：試算表問題"
                        : sectionKey}
                </Text>

                <View style={styles.sectionStats}>
                  <View style={styles.sectionStat}>
                    <Text
                      style={[
                        styles.sectionStatLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      問題数
                    </Text>
                    <Text
                      style={[
                        styles.sectionStatValue,
                        { color: theme.colors.text },
                      ]}
                    >
                      {section.questions.length}問
                    </Text>
                  </View>
                  <View style={styles.sectionStat}>
                    <Text
                      style={[
                        styles.sectionStatLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      正解数
                    </Text>
                    <Text
                      style={[
                        styles.sectionStatValue,
                        { color: theme.colors.text },
                      ]}
                    >
                      {section.questions.filter((q) => q.isCorrect).length}問
                    </Text>
                  </View>
                  <View style={styles.sectionStat}>
                    <Text
                      style={[
                        styles.sectionStatLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      得点
                    </Text>
                    <Text
                      style={[
                        styles.sectionStatValue,
                        {
                          color: getScoreColor(
                            section.score,
                            section.maxScore,
                            70,
                          ),
                        },
                      ]}
                    >
                      {section.score}/{section.maxScore}点
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((section.score / section.maxScore) * 100, 100)}%`,
                        backgroundColor: getScoreColor(
                          section.score,
                          section.maxScore,
                          70,
                        ),
                      },
                    ]}
                  />
                </View>
              </View>
            ),
          )}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.retryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                Alert.alert(
                  "再チャレンジ",
                  "同じ模試をもう一度受験しますか？",
                  [
                    { text: "キャンセル", style: "cancel" },
                    {
                      text: "再受験",
                      onPress: () =>
                        router.push({
                          pathname: "/mock-exam/[examId]",
                          params: { examId: examId },
                        }),
                    },
                  ],
                );
              }}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: theme.colors.background },
                ]}
              >
                再チャレンジ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.homeButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={() => router.push("/")}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: theme.colors.primary },
                ]}
              >
                ホームに戻る
              </Text>
            </TouchableOpacity>
          </View>

          {/* Note about real scoring */}
          <View
            style={[
              styles.noteCard,
              { backgroundColor: theme.colors.success + "20" },
            ]}
          >
            <Text style={[styles.noteText, { color: theme.colors.text }]}>
              ✅
              この結果は実際の採点システムによるものです。間違えた問題は自動的に復習リストに追加されました。
            </Text>
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    resultHeader: {
      padding: 32,
      alignItems: "center",
    },
    resultTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.surface,
      marginBottom: 8,
    },
    resultSubtitle: {
      fontSize: 18,
      color: theme.colors.surface,
      opacity: 0.9,
      marginBottom: 16,
    },
    scoreContainer: {
      alignItems: "center",
    },
    scoreText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.surface,
    },
    passingText: {
      fontSize: 14,
      color: theme.colors.surface,
      opacity: 0.8,
    },
    summaryCard: {
      margin: 16,
      padding: 20,
      borderRadius: 12,
      ...theme.shadows.medium,
    },
    sectionCard: {
      margin: 16,
      marginTop: 8,
      padding: 20,
      borderRadius: 12,
      ...theme.shadows.medium,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    statRow: {
      flexDirection: "row",
      marginBottom: 12,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "600",
    },
    sectionStats: {
      flexDirection: "row",
      marginBottom: 16,
    },
    sectionStat: {
      flex: 1,
      alignItems: "center",
    },
    sectionStatLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    sectionStatValue: {
      fontSize: 14,
      fontWeight: "600",
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    actionContainer: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    retryButton: {},
    homeButton: {},
    actionButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    noteCard: {
      margin: 16,
      padding: 16,
      borderRadius: 8,
    },
    noteText: {
      fontSize: 14,
      textAlign: "center",
      fontStyle: "italic",
    },
  });
