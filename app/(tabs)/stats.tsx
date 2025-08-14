import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import {
  statisticsService,
  OverallStatistics,
  CategoryStatistics,
  LearningGoals,
} from "../../src/services/statistics-service";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import { setupDatabase } from "../../src/data/migrations";

export default function StatsScreen() {
  const [overallStats, setOverallStats] = useState<OverallStatistics | null>(
    null,
  );
  const [categoryStats, setCategoryStats] = useState<CategoryStatistics[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoals | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // カテゴリ表示設定
  const categoryDisplayConfig = {
    journal: { icon: "📝", color: "#2f95dc" },
    ledger: { icon: "📋", color: "#ff6b35" },
    trial_balance: { icon: "📊", color: "#4cd964" },
    financial_statement: { icon: "📈", color: "#9c27b0" },
    voucher_entry: { icon: "📄", color: "#795548" },
    multiple_blank_choice: { icon: "✅", color: "#607d8b" },
  };

  // データベース初期化確認
  const ensureDatabaseInitialized = async () => {
    try {
      console.log("[StatsScreen] データベース初期化確認開始");
      await setupDatabase();
      console.log("[StatsScreen] データベース初期化確認完了");
    } catch (error) {
      console.error("[StatsScreen] データベース初期化エラー:", error);
      console.error("[StatsScreen] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(
        `データベースの初期化に失敗しました: ${error instanceof Error ? error.message : error}`,
      );
    }
  };

  // 統計データ読み込み
  const loadStatistics = async () => {
    try {
      console.log("[StatsScreen] 統計データ読み込み開始");

      // データベース初期化確認
      await ensureDatabaseInitialized();

      // 全体統計
      const overall = await statisticsService.getOverallStatistics();
      setOverallStats(overall);

      // カテゴリ別統計
      const categories = await statisticsService.getCategoryStatistics();
      setCategoryStats(categories);

      // 学習目標
      const goals = await statisticsService.getLearningGoals();
      setLearningGoals(goals);

      console.log("[StatsScreen] 統計データ読み込み完了");
    } catch (error) {
      console.error("[StatsScreen] 統計データ読み込みエラー:", error);

      let errorMessage = "統計データの読み込みに失敗しました";
      if (error instanceof Error) {
        console.error("[StatsScreen] Error details:", {
          message: error.message,
          stack: error.stack,
        });

        if (error.message.includes("データベースの初期化に失敗しました")) {
          errorMessage = `データベースの初期化エラー`;
        } else if (error.message.includes("Database setup failed")) {
          errorMessage = "データベースの初期化エラー";
        } else if (error.message.includes("database initialization failed")) {
          errorMessage =
            "データベースの初期化に失敗しました。アプリを再起動してください。";
        } else if (
          error.message.includes("sqlite") ||
          error.message.includes("SQLite")
        ) {
          errorMessage = "データベースに接続できませんでした。";
        } else {
          errorMessage = `統計データ読み込みエラー：${error.message}`;
        }
      }

      Alert.alert("エラー", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 画面フォーカス時とマウント時にデータ読み込み
  useEffect(() => {
    loadStatistics();
  }, []);

  // 画面がフォーカスされたときに最新データを再取得
  useFocusEffect(
    useCallback(() => {
      console.log("[StatsScreen] 画面フォーカス - 最新統計データを取得");
      // キャッシュをクリアして最新のデータを取得
      try {
        const {
          statisticsCache,
        } = require("../../src/services/statistics-cache");
        statisticsCache.clearAll();
      } catch (error) {
        console.warn("[StatsScreen] キャッシュクリアに失敗:", error);
      }
      loadStatistics();
    }, []),
  );

  // リフレッシュ処理
  const onRefresh = () => {
    setRefreshing(true);
    // キャッシュをクリアして最新データを取得
    try {
      const {
        statisticsCache,
      } = require("../../src/services/statistics-cache");
      statisticsCache.clearAll();
      console.log("[StatsScreen] キャッシュクリア実行");
    } catch (error) {
      console.warn("キャッシュクリアに失敗:", error);
    }
    loadStatistics();
  };

  const formatTime = (timeMs: number): string => {
    const minutes = Math.floor(timeMs / (1000 * 60));
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const formatAccuracy = (accuracy: number): string => {
    return `${Math.round(accuracy * 100)}%`;
  };

  // ローディング表示
  if (loading) {
    return (
      <Screen
        safeArea={true}
        statusBarStyle="dark-content"
        testID="stats-screen-loading"
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>統計データを読み込み中...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      safeArea={true}
      scrollable={true}
      statusBarStyle="dark-content"
      testID="stats-screen"
    >
      {/* アプリタイトル（ヘッダー代替） */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>学習統計</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>学習統計</Text>
        <Text style={styles.subtitle}>あなたの学習状況を確認</Text>
      </View>

      {/* 学習目標進捗 */}
      {learningGoals && (
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>今日の目標</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>問題解答目標</Text>
              <Text style={styles.goalProgress}>
                {learningGoals.dailyGoal.achieved}/
                {learningGoals.dailyGoal.target}問
              </Text>
            </View>
            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  {
                    width: `${Math.min(learningGoals.dailyGoal.completion * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.goalSubtext}>
              {learningGoals.dailyGoal.completion >= 1
                ? "🎉 目標達成！"
                : `あと${learningGoals.dailyGoal.target - learningGoals.dailyGoal.achieved}問で目標達成`}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.overallStatsContainer}>
        <View style={styles.statRow}>
          <View style={styles.mainStatCard}>
            <Text style={styles.mainStatNumber}>
              {overallStats?.totalQuestions || 302}
            </Text>
            <Text style={styles.mainStatLabel}>総問題数</Text>
          </View>
          <View style={styles.mainStatCard}>
            <Text style={styles.mainStatNumber}>
              {overallStats?.answeredQuestions || 0}
            </Text>
            <Text style={styles.mainStatLabel}>解答済み問題数</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.subStatCard}>
            <Text style={styles.subStatNumber}>
              {formatAccuracy(overallStats?.accuracyRate || 0)}
            </Text>
            <Text style={styles.subStatLabel}>正答率</Text>
          </View>
          <View style={styles.subStatCard}>
            <Text style={styles.subStatNumber}>
              {overallStats?.studyDays || 0}
            </Text>
            <Text style={styles.subStatLabel}>学習日数</Text>
          </View>
          <View style={styles.subStatCard}>
            <Text style={styles.subStatNumber}>
              {formatTime(overallStats?.totalStudyTimeMs || 0)}
            </Text>
            <Text style={styles.subStatLabel}>学習時間</Text>
          </View>
          <View style={styles.subStatCard}>
            <Text style={styles.subStatNumber}>
              {overallStats?.currentStreak || 0}
            </Text>
            <Text style={styles.subStatLabel}>連続学習</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryStatsContainer}>
        <Text style={styles.sectionTitle}>分野別進捗</Text>
        {categoryStats.map((category) => {
          const config = categoryDisplayConfig[category.category];
          return (
            <View key={category.category} style={styles.categoryStatCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{config.icon}</Text>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
                <Text style={styles.categoryAccuracy}>
                  {formatAccuracy(category.accuracyRate)}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(category.completionRate * 100, 100)}%`,
                        backgroundColor: config.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.min(
                    category.answeredQuestions,
                    category.totalQuestions,
                  )}
                  /{category.totalQuestions}問
                </Text>
              </View>

              <View style={styles.categoryDetails}>
                <Text style={styles.detailText}>
                  正解:{" "}
                  {Math.min(
                    category.correctAnswers,
                    category.answeredQuestions,
                  )}
                  問
                </Text>
                <Text style={styles.detailText}>
                  不正解:{" "}
                  {Math.max(
                    0,
                    category.answeredQuestions - category.correctAnswers,
                  )}
                  問
                </Text>
                <Text style={styles.detailText}>
                  未回答:{" "}
                  {Math.max(
                    0,
                    category.totalQuestions - category.answeredQuestions,
                  )}
                  問
                </Text>
              </View>

              {/* 追加統計情報 */}
              <View style={styles.additionalStats}>
                <View style={styles.additionalStatItem}>
                  <Text style={styles.additionalStatLabel}>復習対象</Text>
                  <Text style={styles.additionalStatValue}>
                    {category.reviewItemsCount}問
                  </Text>
                </View>
                <View style={styles.additionalStatItem}>
                  <Text style={styles.additionalStatLabel}>克服済み</Text>
                  <Text style={styles.additionalStatValue}>
                    {category.masteredCount}問
                  </Text>
                </View>
                <View style={styles.additionalStatItem}>
                  <Text style={styles.additionalStatLabel}>平均時間</Text>
                  <Text style={styles.additionalStatValue}>
                    {Math.round(category.averageAnswerTimeMs / 1000)}秒
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {(overallStats?.answeredQuestions || 0) === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyTitle}>まだ統計データがありません</Text>
          <Text style={styles.emptySubtitle}>
            問題を解き始めると、ここに詳細な学習統計が表示されます
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/(tabs)/learning")}
            testID="stats-start-learning-button"
            accessibilityLabel="学習を始める"
          >
            <Text style={styles.startButtonText}>学習を始める</Text>
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerSection: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f95dc",
    textAlign: "center",
  },
  header: {
    padding: 20,
    alignItems: "center",
    paddingTop: 60, // ヘッダータイトル分のスペース
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f95dc",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  overallStatsContainer: {
    padding: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  mainStatCard: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainStatNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2f95dc",
  },
  mainStatLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  subStatCard: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  subStatNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subStatLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 3,
    textAlign: "center",
  },
  categoryStatsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryStatCard: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  categoryAccuracy: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f95dc",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 10,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    minWidth: 60,
  },
  categoryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: "#2f95dc",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  goalsContainer: {
    padding: 20,
  },
  goalCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f95dc",
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 10,
  },
  goalProgressFill: {
    height: 8,
    backgroundColor: "#4cd964",
    borderRadius: 4,
  },
  goalSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  additionalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  additionalStatItem: {
    alignItems: "center",
    flex: 1,
  },
  additionalStatLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  additionalStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
