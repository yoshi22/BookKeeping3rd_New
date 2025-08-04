import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { reviewService } from "../../src/services/review-service";
import { ReviewStatistics } from "../../src/data/repositories/review-item-repository";
import { Screen } from "../../src/components/layout/ResponsiveLayout";

export default function ReviewScreen() {
  const [reviewStats, setReviewStats] = useState<ReviewStatistics | null>(null);
  const [weaknessCategories, setWeaknessCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 復習統計データ読み込み
  const loadReviewData = async () => {
    try {
      setLoading(true);

      // 復習統計取得
      const stats = await reviewService.getReviewStatistics();
      setReviewStats(stats);

      // 弱点分野分析
      const weakAreas = await reviewService.analyzeWeakAreas();

      // UI表示用にフォーマット
      const formattedCategories = weakAreas.map((area) => ({
        id: area.category,
        name: area.categoryName,
        reviewCount: area.reviewCount,
        priority:
          area.averagePriority >= 70
            ? "high"
            : area.averagePriority >= 50
              ? "medium"
              : "low",
        averagePriority: area.averagePriority,
        recommendation: area.recommendation,
        lastReviewed: area.lastReviewedAt,
        icon:
          area.category === "journal"
            ? "📝"
            : area.category === "ledger"
              ? "📋"
              : "📊",
      }));

      setWeaknessCategories(formattedCategories);
    } catch (error) {
      console.error("復習データ読み込みエラー:", error);
      Alert.alert("エラー", "復習データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewData();
  }, []);

  // 復習セッション開始
  const startReviewSession = async (priorityOnly: boolean = false) => {
    try {
      const options = priorityOnly
        ? {
            priorityLevels: ["critical", "high"] as (
              | "critical"
              | "high"
              | "medium"
              | "low"
            )[],
            maxCount: 10,
          }
        : {
            maxCount: 20,
          };

      const session = await reviewService.startReviewSession(options);

      if (session.questions.length === 0) {
        Alert.alert("お知らせ", "復習対象の問題がありません");
        return;
      }

      // 復習問題画面に遷移（セッション情報を渡す）
      router.push({
        pathname: "/question/[id]",
        params: {
          id: session.questions[0].id,
          sessionId: session.sessionId,
          sessionType: "review",
        },
      });
    } catch (error) {
      console.error("復習セッション開始エラー:", error);
      Alert.alert("エラー", "復習セッションの開始に失敗しました");
    }
  };

  // カテゴリ別復習開始
  const startCategoryReview = async (categoryId: string) => {
    try {
      const session = await reviewService.startReviewSession({
        category: categoryId as any,
        maxCount: 15,
      });

      if (session.questions.length === 0) {
        Alert.alert("お知らせ", `${categoryId}の復習対象問題がありません`);
        return;
      }

      router.push({
        pathname: "/question/[id]",
        params: {
          id: session.questions[0].id,
          sessionId: session.sessionId,
          sessionType: "review",
        },
      });
    } catch (error) {
      console.error("カテゴリ別復習開始エラー:", error);
      Alert.alert("エラー", "復習の開始に失敗しました");
    }
  };

  if (loading) {
    return (
      <Screen safeArea={true} statusBarStyle="dark-content">
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>復習データを読み込み中...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea={true} scrollable={true} statusBarStyle="dark-content">
      <View style={styles.header}>
        <Text style={styles.title}>復習モード</Text>
        <Text style={styles.subtitle}>間違えた問題を効率的に復習</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {reviewStats?.totalReviewItems || 0}
          </Text>
          <Text style={styles.statLabel}>復習対象</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {reviewStats?.priorityReviewCount || 0}
          </Text>
          <Text style={styles.statLabel}>重点復習</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {reviewStats?.masteredCount || 0}
          </Text>
          <Text style={styles.statLabel}>克服済み</Text>
        </View>
      </View>

      {(reviewStats?.totalReviewItems || 0) > 0 ? (
        <>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => startReviewSession(true)}
            >
              <Text style={styles.buttonIcon}>🎯</Text>
              <Text style={styles.buttonTitle}>重点復習開始</Text>
              <Text style={styles.buttonSubtitle}>
                優先度の高い{reviewStats?.priorityReviewCount || 0}問から
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => startReviewSession(false)}
            >
              <Text style={styles.buttonIcon}>🔄</Text>
              <Text style={styles.buttonTitle}>全て復習</Text>
              <Text style={styles.buttonSubtitle}>
                復習対象{reviewStats?.totalReviewItems || 0}問全て
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>分野別弱点</Text>
            {weaknessCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => startCategoryReview(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {category.reviewCount}問復習対象
                  </Text>
                  <Text style={styles.categoryRecommendation}>
                    {category.recommendation}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    category.priority === "high"
                      ? styles.highPriority
                      : category.priority === "medium"
                        ? styles.mediumPriority
                        : styles.lowPriority,
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {category.priority === "high"
                      ? "高"
                      : category.priority === "medium"
                        ? "中"
                        : "低"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyTitle}>復習対象の問題がありません！</Text>
          <Text style={styles.emptySubtitle}>
            問題を解くと、間違えた問題が自動的に復習リストに追加されます
          </Text>
          <TouchableOpacity
            style={styles.startLearningButton}
            onPress={() => router.push("/(tabs)/learning")}
          >
            <Text style={styles.startLearningText}>学習を始める</Text>
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
  header: {
    padding: 20,
    alignItems: "center",
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
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-around",
  },
  statCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b35",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  actionContainer: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: "#ff6b35",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#2f95dc",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highPriority: {
    backgroundColor: "#ff4444",
  },
  mediumPriority: {
    backgroundColor: "#ff9500",
  },
  lowPriority: {
    backgroundColor: "#4cd964",
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
  startLearningButton: {
    backgroundColor: "#2f95dc",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startLearningText: {
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
  categoryRecommendation: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
});
