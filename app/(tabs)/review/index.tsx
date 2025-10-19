import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { logger } from "../../../src/utils/logger";
import { useFocusEffect } from "@react-navigation/native";
import { reviewService } from "../../../src/services/review-service";
import { ReviewStatistics } from "../../../src/data/repositories/review-item-repository";
import { statisticsService } from "../../../src/services/statistics-service";
import { statisticsCache } from "../../../src/services/statistics-cache";
import { Screen } from "../../../src/components/layout/ResponsiveLayout";
import { setupDatabase } from "../../../src/data/migrations";
import { WithScreenTransition } from "../../../src/hooks/useScreenTransitions";
import {
  CircularProgress,
  LinearProgress,
  SkeletonLoader,
} from "../../../src/hooks/useProgressIndicators";
import {
  useTabletLayout,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveGridItem,
} from "../../../src/hooks/useTabletLayout";
import {
  useTheme,
  useThemedStyles,
  useDynamicColors,
  type Theme,
} from "../../../src/context/ThemeContext";
import { AppIcon, IconContextSizes } from "../../../src/theme/icons";

const withOpacity = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export default function ReviewScreen() {
  const [reviewStats, setReviewStats] = useState<ReviewStatistics | null>(null);
  const [weaknessCategories, setWeaknessCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"review" | "statistics">("review");
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [loadingStatistics, setLoadingStatistics] = useState(false);

  // Phase 4: ダークモード対応のテーマシステム
  const { theme, getStatusBarStyle } = useTheme();
  const dynamicColors = useDynamicColors();

  // タブレットレイアウト対応（オリエンテーション対応）
  const { deviceInfo, getValueByDevice } = useTabletLayout();

  // Phase 4: テーマに応じたスタイル生成
  const styles = useThemedStyles(createStyles);

  // データベース初期化確認
  const ensureDatabaseInitialized = useCallback(async (): Promise<boolean> => {
    try {
      logger.debug("[ReviewScreen] データベース初期化確認開始");
      await setupDatabase();
      logger.debug("[ReviewScreen] データベース初期化確認完了");
      return true; // 通常の初期化成功
    } catch (error) {
      logger.error("[ReviewScreen] データベース初期化エラー:", error as Error);
      logger.error("[ReviewScreen] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      } as any);

      // データベースリセットを試行
      const resetSuccess = await tryDatabaseReset(error);
      return resetSuccess; // リセット経由での初期化成功
    }
  }, []);

  // データベースリセット試行
  const tryDatabaseReset = async (originalError: any) => {
    try {
      logger.info("[ReviewScreen] データベースリセットを試行中...");

      // データベースサービスを取得してリセット実行
      const { databaseService } = await import("../../../src/data/database");
      await databaseService.resetDatabase();
      logger.debug("[ReviewScreen] データベースリセット完了");

      // リセット後に再初期化を試行
      await setupDatabase();
      logger.debug("[ReviewScreen] リセット後の初期化成功");

      // 初期化成功後、復習データの再読み込みを実行
      logger.debug("[ReviewScreen] リセット後の復習データ読み込み開始");
      return true; // 成功を示すフラグを返す
    } catch (resetError) {
      logger.error(
        "[ReviewScreen] データベースリセット失敗:",
        resetError as Error,
      );
      logger.error("[ReviewScreen] Reset error details:", resetError as Error, {
        message: resetError instanceof Error ? resetError.message : resetError,
        stack: resetError instanceof Error ? resetError.stack : undefined,
      });

      // リセットも失敗した場合はより詳細なエラー情報を提供

      throw new Error();
    }
  };

  // 復習統計データ読み込み
  const loadReviewData = useCallback(async () => {
    try {
      setLoading(true);

      // データベース初期化確認
      const initSuccess = await ensureDatabaseInitialized();

      if (!initSuccess) {
        logger.error("[ReviewScreen] データベース初期化に失敗しました");
        throw new Error("データベース初期化に失敗しました");
      }

      // 復習統計取得
      let stats: ReviewStatistics;
      let weakAreas: any[];

      try {
        // デバッグ用：直接SQLでreview_itemsテーブルを確認
        logger.debug("[ReviewScreen] デバッグ: review_itemsテーブルを直接確認");
        const { databaseService } = await import("../../../src/data/database");

        // SQLクエリを実行してデバッグ情報を取得
        const reviewItemsCount = await databaseService.executeSql(
          "SELECT COUNT(*) as count FROM review_items",
        );
        const reviewItemsData = await databaseService.executeSql(
          "SELECT * FROM review_items LIMIT 10",
        );
        const learningHistoryIncorrect = await databaseService.executeSql(
          "SELECT * FROM learning_history WHERE is_correct = 0 LIMIT 5",
        );
        logger.debug("[ReviewScreen] デバッグ: review_itemsテーブルの件数:", {
          details: reviewItemsCount.rows,
        });
        logger.debug(
          "[ReviewScreen] デバッグ: review_itemsテーブルのデータ（先頭10件）:",
          { details: reviewItemsData.rows },
        );
        logger.debug("[ReviewScreen] デバッグ: 不正解の学習履歴（先頭5件）:", {
          details: learningHistoryIncorrect.rows,
        });

        stats = await reviewService.getReviewStatistics();
        weakAreas = await reviewService.analyzeWeakAreas();
      } catch (dbError) {
        logger.warn(
          "[ReviewScreen] データベースエラー、フォールバックデータを使用:",
          { details: dbError },
        );

        // フォールバックデータを設定
        stats = {
          totalReviewItems: 0,
          needsReviewCount: 0,
          priorityReviewCount: 0,
          masteredCount: 0,
          priorityDistribution: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          },
          categoryBreakdown: {
            journal: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
            ledger: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
            trial_balance: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
            financial_statement: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
            voucher_entry: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
            multiple_blank_choice: {
              total: 0,
              needsReview: 0,
              priorityReview: 0,
              mastered: 0,
              averagePriority: 0,
            },
          },
          lastUpdated: new Date().toISOString(),
        };

        weakAreas = [
          {
            category: "journal",
            categoryName: "第一問",
            reviewCount: 0,
            averagePriority: 0,
            recommendation: "学習を開始してください",
            lastReviewedAt: null,
          },
          {
            category: "ledger",
            categoryName: "第二問",
            reviewCount: 0,
            averagePriority: 0,
            recommendation: "学習を開始してください",
            lastReviewedAt: null,
          },
          {
            category: "trial_balance",
            categoryName: "第三問",
            reviewCount: 0,
            averagePriority: 0,
            recommendation: "学習を開始してください",
            lastReviewedAt: null,
          },
        ];
      }

      setReviewStats(stats);

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
            ? ("journal" as const)
            : area.category === "ledger"
              ? ("ledger" as const)
              : ("trialBalance" as const),
      }));

      setWeaknessCategories(formattedCategories);
    } catch (error) {
      logger.error("[ReviewScreen] 復習データ読み込みエラー:", error as Error);

      if (error instanceof Error) {
        logger.error("[ReviewScreen] Error details:", error as Error, {
          message: error.message,
          stack: error.stack,
        });
      }

      // フォールバックデータでUI表示を継続
      setReviewStats({
        totalReviewItems: 0,
        needsReviewCount: 0,
        priorityReviewCount: 0,
        masteredCount: 0,
        priorityDistribution: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        categoryBreakdown: {
          journal: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
          ledger: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
          trial_balance: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
          financial_statement: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
          voucher_entry: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
          multiple_blank_choice: {
            total: 0,
            needsReview: 0,
            priorityReview: 0,
            mastered: 0,
            averagePriority: 0,
          },
        },
        lastUpdated: new Date().toISOString(),
      });

      setWeaknessCategories([
        {
          id: "journal",
          name: "第一問",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "journal" as const,
        },
        {
          id: "ledger",
          name: "第二問",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "ledger" as const,
        },
        {
          id: "trial_balance",
          name: "第三問",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "trialBalance" as const,
        },
      ]);

      logger.warn("[ReviewScreen] フォールバックデータでUI表示を継続");
    } finally {
      setLoading(false);
    }
  }, [ensureDatabaseInitialized]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  // 統計タブが選択されたときに統計データを読み込み
  useEffect(() => {
    if (activeTab === "statistics" && !statisticsData) {
      loadStatisticsData();
    }
  }, [activeTab, statisticsData]);

  // 画面がフォーカスされたときに最新データを再取得
  useFocusEffect(
    useCallback(() => {
      logger.debug("[ReviewScreen] 画面フォーカス - 最新データを取得");
      // キャッシュをクリアして最新のデータを取得
      try {
        statisticsCache.clearAll();
      } catch (error) {
        logger.warn("[ReviewScreen] キャッシュクリアに失敗:", {
          details: error,
        });
      }
      loadReviewData();
    }, [loadReviewData]),
  );

  // 統計データ読み込み
  const loadStatisticsData = async () => {
    try {
      setLoadingStatistics(true);
      logger.debug("[ReviewScreen] 統計データ読み込み開始");

      const stats = await statisticsService.getOverallStatistics();
      const categoryProgress = await statisticsService.getCategoryProgress();
      const learningTrends = await statisticsService.getLearningTrends();

      const normalizedOverall = {
        totalQuestions: stats.totalQuestions,
        totalAnswered: stats.answeredQuestions,
        correctAnswers: stats.correctAnswers,
        incorrectAnswers: stats.incorrectAnswers,
        accuracy: Math.round(stats.accuracyRate * 100),
        totalStudyTime: Math.round(stats.totalStudyTimeMs / 1000),
        averageStudyTime: Math.round(stats.averageStudyTimeMs / 1000),
        currentStreak: stats.currentStreak,
        maxStreak: stats.maxStreak,
        lastStudiedAt: stats.lastStudiedAt,
        firstStudiedAt: stats.firstStudiedAt,
      };

      const normalizedCategoryProgress = categoryProgress.map((category) => ({
        category: category.category,
        categoryName: category.categoryName,
        answered: category.answeredQuestions,
        correct: category.correctAnswers,
        incorrect: category.incorrectAnswers,
        accuracy: Math.round(category.accuracyRate * 100),
        completionRate: Math.round(category.completionRate * 100),
        reviewItems: category.reviewItemsCount,
        mastered: category.masteredCount,
        averageAnswerTime: category.averageAnswerTimeMs,
        lastStudiedAt: category.lastStudiedAt,
      }));

      setStatisticsData({
        overall: normalizedOverall,
        categoryProgress: normalizedCategoryProgress,
        learningTrends,
      });
      logger.debug("[ReviewScreen] 統計データ読み込み完了");
    } catch (error) {
      logger.error("[ReviewScreen] 統計データ読み込みエラー:", error as Error);
      // フォールバックデータ
      setStatisticsData({
        overall: {
          totalQuestions: 0,
          totalAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          totalStudyTime: 0,
        },
        categoryProgress: [],
        learningTrends: [],
      });
    } finally {
      setLoadingStatistics(false);
    }
  };

  // 復習セッション開始
  const startReviewSession = async (priorityOnly: boolean = false) => {
    try {
      const options = priorityOnly
        ? {
            priorityLevels: ["critical", "high", "medium"] as (
              | "critical"
              | "high"
              | "medium"
              | "low"
            )[],
            maxCount: 15,
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
        pathname: "/(tabs)/review/question/[id]",
        params: {
          id: session.questions[0].id,
          sessionId: session.sessionId,
          sessionType: "review",
          categoryFilter: "false", // 全て復習モードなのでカテゴリフィルタなし
        },
      });
    } catch (error) {
      logger.error("復習セッション開始エラー:", error as Error);
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
        pathname: "/(tabs)/review/question/[id]",
        params: {
          id: session.questions[0].id,
          sessionId: session.sessionId,
          sessionType: "review",
          categoryFilter: "true", // カテゴリ別復習モードなのでカテゴリフィルタあり
        },
      });
    } catch (error) {
      logger.error("カテゴリ別復習開始エラー:", error as Error);
      Alert.alert("エラー", "復習の開始に失敗しました");
    }
  };

  if (loading) {
    return (
      <Screen
        safeArea={true}
        statusBarStyle={getStatusBarStyle()}
        testID="review-screen-loading"
      >
        <ResponsiveContainer>
          <View
            style={[
              styles.loadingContainer,
              {
                paddingHorizontal: getValueByDevice({
                  phone: 20,
                  tablet: 40,
                  desktop: 60,
                  default: 20,
                }),
              },
            ]}
          >
            <SkeletonLoader
              width={getValueByDevice({
                phone: 200,
                tablet: 300,
                desktop: 400,
                default: 200,
              })}
              height={deviceInfo.isTablet ? 24 : 20}
              borderRadius={10}
              backgroundColor={theme.colors.borderLight}
              shimmerColor={dynamicColors.adaptive.divider}
            />
            <View
              style={[
                styles.skeletonStats,
                {
                  justifyContent: deviceInfo.isTablet
                    ? "space-around"
                    : "space-between",
                  marginVertical: getValueByDevice({
                    phone: 20,
                    tablet: 30,
                    desktop: 40,
                    default: 20,
                  }),
                },
              ]}
            >
              <SkeletonLoader
                width={deviceInfo.isTablet ? 100 : 80}
                height={deviceInfo.isTablet ? 80 : 60}
                borderRadius={8}
                backgroundColor={theme.colors.borderLight}
                shimmerColor={dynamicColors.adaptive.divider}
              />
              <SkeletonLoader
                width={deviceInfo.isTablet ? 100 : 80}
                height={deviceInfo.isTablet ? 80 : 60}
                borderRadius={8}
                backgroundColor={theme.colors.borderLight}
                shimmerColor={dynamicColors.adaptive.divider}
              />
              <SkeletonLoader
                width={deviceInfo.isTablet ? 100 : 80}
                height={deviceInfo.isTablet ? 80 : 60}
                borderRadius={8}
                backgroundColor={theme.colors.borderLight}
                shimmerColor={dynamicColors.adaptive.divider}
              />
            </View>
            <ResponsiveGrid>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ResponsiveGridItem key={index}>
                    <SkeletonLoader
                      width="100%"
                      height={deviceInfo.isTablet ? 100 : 80}
                      borderRadius={10}
                      backgroundColor={theme.colors.borderLight}
                      shimmerColor={dynamicColors.adaptive.divider}
                    />
                  </ResponsiveGridItem>
                ))}
            </ResponsiveGrid>
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <WithScreenTransition
      transitionType="reviewTransition"
      transitionConfig={{ duration: 400 }}
    >
      <Screen
        safeArea={true}
        scrollable={true}
        statusBarStyle={getStatusBarStyle()}
        testID="review-screen"
      >
        <ResponsiveContainer>
          {/* アプリタイトル（ヘッダー代替） */}
          <View
            style={[
              styles.headerSection,
              {
                paddingHorizontal: getValueByDevice({
                  phone: 20,
                  tablet: 40,
                  desktop: 60,
                  default: 20,
                }),
              },
            ]}
          >
            <Text
              style={[
                styles.appTitle,
                {
                  fontSize: getValueByDevice({
                    phone: 18,
                    tablet: 22,
                    desktop: 24,
                    default: 18,
                  }),
                },
              ]}
            >
              復習
            </Text>
          </View>

          <View
            style={[
              styles.header,
              {
                paddingHorizontal: getValueByDevice({
                  phone: 20,
                  tablet: 40,
                  desktop: 60,
                  default: 20,
                }),
              },
            ]}
          >
            <View style={styles.titleRow}>
              <View style={styles.titleIcon}>
                <AppIcon
                  name="stats"
                  color={theme.colors.primary}
                  size={IconContextSizes.header}
                />
              </View>
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: getValueByDevice({
                      phone: 24,
                      tablet: 28,
                      desktop: 32,
                      default: 24,
                    }),
                  },
                ]}
              >
                復習・進捗
              </Text>
            </View>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: getValueByDevice({
                    phone: 16,
                    tablet: 18,
                    desktop: 20,
                    default: 16,
                  }),
                },
              ]}
            >
              復習管理と学習進捗の確認
            </Text>
          </View>

          {/* タブナビゲーション */}
          <View
            style={[
              styles.tabContainer,
              {
                marginHorizontal: getValueByDevice({
                  phone: 20,
                  tablet: 40,
                  desktop: 60,
                  default: 20,
                }),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "review" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("review")}
              testID="review-tab-button"
            >
              <View style={styles.tabButtonContent}>
                <AppIcon
                  name="review"
                  color={
                    activeTab === "review"
                      ? theme.colors.surface
                      : theme.colors.textSecondary
                  }
                  size={IconContextSizes.button}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "review" && styles.activeTabButtonText,
                  ]}
                >
                  復習
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "statistics" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("statistics")}
              testID="statistics-tab-button"
            >
              <View style={styles.tabButtonContent}>
                <AppIcon
                  name="stats"
                  color={
                    activeTab === "statistics"
                      ? theme.colors.surface
                      : theme.colors.textSecondary
                  }
                  size={IconContextSizes.button}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "statistics" && styles.activeTabButtonText,
                  ]}
                >
                  統計
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* タブコンテンツ */}
          {activeTab === "review" && (
            <View
              style={[
                styles.statsContainer,
                {
                  paddingHorizontal: getValueByDevice({
                    phone: 20,
                    tablet: 40,
                    desktop: 60,
                    default: 20,
                  }),
                  flexDirection: deviceInfo.isTablet ? "row" : "row",
                  justifyContent: deviceInfo.isTablet
                    ? "space-around"
                    : "space-around",
                },
              ]}
            >
              <View
                style={[
                  styles.statCard,
                  {
                    minWidth: deviceInfo.isTablet ? 120 : 80,
                    padding: deviceInfo.isTablet ? 20 : 15,
                  },
                ]}
              >
                <CircularProgress
                  progress={
                    reviewStats?.totalReviewItems
                      ? Math.min(
                          (reviewStats.totalReviewItems / 100) * 100,
                          100,
                        )
                      : 0
                  }
                  size={deviceInfo.isTablet ? 80 : 60}
                  strokeWidth={deviceInfo.isTablet ? 6 : 4}
                  color={theme.colors.warning}
                  showPercentage={false}
                >
                  <Text
                    style={[
                      styles.statNumber,
                      { fontSize: deviceInfo.isTablet ? 28 : 24 },
                    ]}
                  >
                    {reviewStats?.totalReviewItems || 0}
                  </Text>
                </CircularProgress>
                <Text
                  style={[
                    styles.statLabel,
                    { fontSize: deviceInfo.isTablet ? 14 : 12 },
                  ]}
                >
                  復習対象
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  {
                    minWidth: deviceInfo.isTablet ? 120 : 80,
                    padding: deviceInfo.isTablet ? 20 : 15,
                  },
                ]}
              >
                <CircularProgress
                  progress={
                    reviewStats?.priorityReviewCount
                      ? Math.min(
                          (reviewStats.priorityReviewCount / 50) * 100,
                          100,
                        )
                      : 0
                  }
                  size={deviceInfo.isTablet ? 80 : 60}
                  strokeWidth={deviceInfo.isTablet ? 6 : 4}
                  color={theme.colors.error}
                  showPercentage={false}
                >
                  <Text
                    style={[
                      styles.statNumber,
                      { fontSize: deviceInfo.isTablet ? 28 : 24 },
                    ]}
                  >
                    {reviewStats?.priorityReviewCount || 0}
                  </Text>
                </CircularProgress>
                <Text
                  style={[
                    styles.statLabel,
                    { fontSize: deviceInfo.isTablet ? 14 : 12 },
                  ]}
                >
                  重点復習
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  {
                    minWidth: deviceInfo.isTablet ? 120 : 80,
                    padding: deviceInfo.isTablet ? 20 : 15,
                  },
                ]}
              >
                <CircularProgress
                  progress={
                    reviewStats?.masteredCount
                      ? Math.min((reviewStats.masteredCount / 100) * 100, 100)
                      : 0
                  }
                  size={deviceInfo.isTablet ? 80 : 60}
                  strokeWidth={deviceInfo.isTablet ? 6 : 4}
                  color={theme.colors.success}
                  showPercentage={false}
                >
                  <Text
                    style={[
                      styles.statNumber,
                      { fontSize: deviceInfo.isTablet ? 28 : 24 },
                    ]}
                  >
                    {reviewStats?.masteredCount || 0}
                  </Text>
                </CircularProgress>
                <Text
                  style={[
                    styles.statLabel,
                    { fontSize: deviceInfo.isTablet ? 14 : 12 },
                  ]}
                >
                  克服済み
                </Text>
              </View>
            </View>
          )}

          {(reviewStats?.totalReviewItems || 0) > 0 ? (
            <>
              <View
                style={[
                  styles.actionContainer,
                  {
                    paddingHorizontal: getValueByDevice({
                      phone: 20,
                      tablet: 40,
                      desktop: 60,
                      default: 20,
                    }),
                    flexDirection: deviceInfo.isTablet ? "row" : "column",
                    justifyContent: deviceInfo.isTablet
                      ? "space-between"
                      : "center",
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    {
                      marginBottom: deviceInfo.isTablet ? 0 : 15,
                      marginRight: deviceInfo.isTablet ? 10 : 0,
                      flex: deviceInfo.isTablet ? 1 : undefined,
                      minHeight: deviceInfo.isTablet ? 100 : 80,
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => startReviewSession(true)}
                  testID="review-priority-button"
                  accessibilityLabel="重点復習を開始"
                >
                  <View style={styles.buttonIconWrapper}>
                    <AppIcon
                      name="challenge"
                      color={theme.colors.surface}
                      size={
                        deviceInfo.isTablet
                          ? IconContextSizes.header
                          : IconContextSizes.listItem
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.buttonTitle,
                      { fontSize: deviceInfo.isTablet ? 20 : 18 },
                    ]}
                  >
                    重点復習開始
                  </Text>
                  <Text style={styles.buttonSubtitle}>
                    優先度の高い{reviewStats?.priorityReviewCount || 0}問から
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    {
                      marginLeft: deviceInfo.isTablet ? 10 : 0,
                      flex: deviceInfo.isTablet ? 1 : undefined,
                      minHeight: deviceInfo.isTablet ? 100 : 80,
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => startReviewSession(false)}
                  testID="review-all-button"
                  accessibilityLabel="全て復習を開始"
                >
                  <View style={styles.buttonIconWrapper}>
                    <AppIcon
                      name="refresh"
                      color={theme.colors.primary}
                      size={
                        deviceInfo.isTablet
                          ? IconContextSizes.header
                          : IconContextSizes.listItem
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.buttonTitle,
                      { fontSize: deviceInfo.isTablet ? 20 : 18 },
                    ]}
                  >
                    全て復習
                  </Text>
                  <Text style={styles.buttonSubtitle}>
                    復習対象{reviewStats?.totalReviewItems || 0}問全て
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.categoriesContainer,
                  {
                    paddingHorizontal: getValueByDevice({
                      phone: 20,
                      tablet: 40,
                      desktop: 60,
                      default: 20,
                    }),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: deviceInfo.isTablet ? 20 : 18 },
                  ]}
                >
                  分野別弱点
                </Text>
                <ResponsiveGrid>
                  {weaknessCategories.map((category) => (
                    <ResponsiveGridItem key={category.id}>
                      <TouchableOpacity
                        style={[
                          styles.categoryCard,
                          {
                            minHeight: deviceInfo.isTablet ? 140 : 120,
                            paddingVertical: deviceInfo.isTablet ? 20 : 15,
                          },
                        ]}
                        onPress={() => startCategoryReview(category.id)}
                        testID={`review-category-${category.id}-button`}
                        accessibilityLabel={`${category.name}の復習を開始`}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            {
                              width: deviceInfo.isTablet ? 56 : 48,
                              height: deviceInfo.isTablet ? 56 : 48,
                            },
                          ]}
                        >
                          <AppIcon
                            name={category.icon}
                            size={
                              deviceInfo.isTablet
                                ? IconContextSizes.header
                                : IconContextSizes.listItem
                            }
                            color={
                              theme.categoryColors[
                                category.id as keyof typeof theme.categoryColors
                              ] ?? theme.colors.primary
                            }
                          />
                        </View>
                        <View style={styles.categoryInfo}>
                          <Text
                            style={[
                              styles.categoryName,
                              { fontSize: deviceInfo.isTablet ? 18 : 16 },
                            ]}
                          >
                            {category.name}
                          </Text>
                          <Text
                            style={[
                              styles.categoryCount,
                              { fontSize: deviceInfo.isTablet ? 16 : 14 },
                            ]}
                          >
                            {category.reviewCount}問復習対象
                          </Text>
                          <Text style={styles.categoryRecommendation}>
                            {category.recommendation}
                          </Text>

                          {/* カテゴリ別プログレスバー */}
                          {category.reviewCount > 0 && (
                            <View style={styles.categoryProgressContainer}>
                              <LinearProgress
                                progress={category.averagePriority}
                                color={
                                  category.priority === "high"
                                    ? theme.colors.error
                                    : category.priority === "medium"
                                      ? theme.colors.warning
                                      : theme.colors.success
                                }
                                backgroundColor={theme.colors.borderLight}
                                height={deviceInfo.isTablet ? 6 : 4}
                                borderRadius={2}
                                animated={true}
                              />
                            </View>
                          )}
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
                    </ResponsiveGridItem>
                  ))}
                </ResponsiveGrid>
              </View>
            </>
          ) : (
            <View
              style={[
                styles.emptyState,
                {
                  paddingHorizontal: getValueByDevice({
                    phone: 40,
                    tablet: 60,
                    desktop: 80,
                    default: 40,
                  }),
                },
              ]}
            >
              <Text
                style={[
                  styles.emptyIcon,
                  { fontSize: deviceInfo.isTablet ? 80 : 64 },
                ]}
              >
                🎉
              </Text>
              <Text
                style={[
                  styles.emptyTitle,
                  { fontSize: deviceInfo.isTablet ? 24 : 20 },
                ]}
              >
                復習対象の問題がありません！
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { fontSize: deviceInfo.isTablet ? 18 : 16 },
                ]}
              >
                問題を解くと、間違えた問題が自動的に復習リストに追加されます
              </Text>
              <TouchableOpacity
                style={[
                  styles.startLearningButton,
                  {
                    paddingHorizontal: deviceInfo.isTablet ? 40 : 30,
                    paddingVertical: deviceInfo.isTablet ? 20 : 15,
                    borderRadius: deviceInfo.isTablet ? 30 : 25,
                  },
                ]}
                onPress={() => router.push("/(tabs)/learning")}
                testID="review-start-learning-button"
                accessibilityLabel="学習を始める"
              >
                <Text
                  style={[
                    styles.startLearningText,
                    { fontSize: deviceInfo.isTablet ? 18 : 16 },
                  ]}
                >
                  学習を始める
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 統計タブコンテンツ */}
          {activeTab === "statistics" && (
            <View
              style={[
                styles.statisticsContainer,
                {
                  paddingHorizontal: getValueByDevice({
                    phone: 20,
                    tablet: 40,
                    desktop: 60,
                    default: 20,
                  }),
                },
              ]}
            >
              {loadingStatistics ? (
                <View style={styles.loadingContainer}>
                  <SkeletonLoader
                    width="100%"
                    height={120}
                    borderRadius={12}
                    backgroundColor={theme.colors.borderLight}
                    shimmerColor={dynamicColors.adaptive.divider}
                  />
                  <SkeletonLoader
                    width="100%"
                    height={120}
                    borderRadius={12}
                    backgroundColor={theme.colors.borderLight}
                    shimmerColor={dynamicColors.adaptive.divider}
                  />
                </View>
              ) : (
                <>
                  {/* 全体統計 */}
                  <View
                    style={[
                      styles.overallStatsCard,
                      {
                        marginBottom: getValueByDevice({
                          phone: 20,
                          tablet: 30,
                          desktop: 40,
                          default: 20,
                        }),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        { fontSize: deviceInfo.isTablet ? 20 : 18 },
                      ]}
                    >
                      学習統計
                    </Text>
                    <View
                      style={[
                        styles.overallStatsGrid,
                        {
                          flexDirection: deviceInfo.isTablet ? "row" : "row",
                          justifyContent: deviceInfo.isTablet
                            ? "space-around"
                            : "space-between",
                        },
                      ]}
                    >
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statValue,
                            { fontSize: deviceInfo.isTablet ? 28 : 24 },
                          ]}
                        >
                          {statisticsData?.overall?.totalAnswered || 0}
                        </Text>
                        <Text
                          style={[
                            styles.statLabel,
                            { fontSize: deviceInfo.isTablet ? 14 : 12 },
                          ]}
                        >
                          解答済み
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statValue,
                            {
                              fontSize: deviceInfo.isTablet ? 28 : 24,
                              color: theme.colors.success,
                            },
                          ]}
                        >
                          {Math.round(statisticsData?.overall?.accuracy || 0)}%
                        </Text>
                        <Text
                          style={[
                            styles.statLabel,
                            { fontSize: deviceInfo.isTablet ? 14 : 12 },
                          ]}
                        >
                          正答率
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text
                          style={[
                            styles.statValue,
                            { fontSize: deviceInfo.isTablet ? 28 : 24 },
                          ]}
                        >
                          {Math.round(
                            (statisticsData?.overall?.totalStudyTime || 0) / 60,
                          )}
                        </Text>
                        <Text
                          style={[
                            styles.statLabel,
                            { fontSize: deviceInfo.isTablet ? 14 : 12 },
                          ]}
                        >
                          学習時間(分)
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* カテゴリ別進捗 */}
                  <View
                    style={[
                      styles.categoryProgressCard,
                      {
                        marginBottom: getValueByDevice({
                          phone: 20,
                          tablet: 30,
                          desktop: 40,
                          default: 20,
                        }),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        { fontSize: deviceInfo.isTablet ? 20 : 18 },
                      ]}
                    >
                      分野別進捗
                    </Text>
                    <ResponsiveGrid>
                      {(statisticsData?.categoryProgress || []).map(
                        (category: any, index: number) => (
                          <ResponsiveGridItem key={category.category || index}>
                            <View
                              style={[
                                styles.categoryProgressItem,
                                {
                                  minHeight: deviceInfo.isTablet ? 120 : 100,
                                  padding: deviceInfo.isTablet ? 20 : 15,
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.categoryProgressIcon,
                                  {
                                    width: deviceInfo.isTablet ? 56 : 48,
                                    height: deviceInfo.isTablet ? 56 : 48,
                                  },
                                ]}
                              >
                                <AppIcon
                                  name={
                                    category.category === "journal"
                                      ? "journal"
                                      : category.category === "ledger"
                                        ? "ledger"
                                        : "trialBalance"
                                  }
                                  size={
                                    deviceInfo.isTablet
                                      ? IconContextSizes.header
                                      : IconContextSizes.listItem
                                  }
                                  color={
                                    theme.categoryColors[
                                      category.category as keyof typeof theme.categoryColors
                                    ] ?? theme.colors.primary
                                  }
                                />
                              </View>
                              <Text
                                style={[
                                  styles.categoryProgressName,
                                  { fontSize: deviceInfo.isTablet ? 16 : 14 },
                                ]}
                              >
                                {category.categoryName ||
                                  (category.category === "journal"
                                    ? "第一問"
                                    : category.category === "ledger"
                                      ? "第二問"
                                      : "第三問")}
                              </Text>
                              <Text
                                style={[
                                  styles.categoryProgressPercent,
                                  { fontSize: deviceInfo.isTablet ? 18 : 16 },
                                ]}
                              >
                                {Math.round(category.accuracy || 0)}%
                              </Text>
                              <View style={styles.categoryProgressBarContainer}>
                                <LinearProgress
                                  progress={category.accuracy || 0}
                                  color={
                                    (category.accuracy || 0) >= 80
                                      ? theme.colors.success
                                      : (category.accuracy || 0) >= 60
                                        ? theme.colors.warning
                                        : theme.colors.error
                                  }
                                  backgroundColor={theme.colors.borderLight}
                                  height={deviceInfo.isTablet ? 6 : 4}
                                  borderRadius={2}
                                  animated={true}
                                />
                              </View>
                            </View>
                          </ResponsiveGridItem>
                        ),
                      )}
                    </ResponsiveGrid>
                  </View>

                  {/* データ更新情報 */}
                  <View style={styles.dataInfoCard}>
                    <Text style={styles.dataInfoText}>
                      💡 統計データは学習・復習の進行に伴って自動更新されます
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.refreshButton,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() => {
                        loadReviewData();
                        loadStatisticsData();
                      }}
                      testID="refresh-statistics-button"
                    >
                      <View style={styles.tabButtonContent}>
                        <AppIcon
                          name="refresh"
                          color={theme.colors.surface}
                          size={IconContextSizes.button}
                        />
                        <Text style={styles.refreshButtonText}>データ更新</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        </ResponsiveContainer>
      </Screen>
    </WithScreenTransition>
  );
}

// Phase 4: ダークモード対応のスタイル生成関数
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      color: theme.colors.primary,
      textAlign: "center",
    },
    header: {
      padding: 20,
      alignItems: "center",
      paddingTop: 60, // ヘッダータイトル分のスペース
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    titleIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: withOpacity(theme.colors.primary, "12"),
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
    },
    statsContainer: {
      flexDirection: "row",
      padding: 20,
      justifyContent: "space-around",
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      minWidth: 80,
      ...theme.shadows.medium,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.warning,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 5,
    },
    actionContainer: {
      padding: 20,
    },
    primaryButton: {
      backgroundColor: theme.colors.warning,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 15,
      ...theme.shadows.medium,
    },
    secondaryButton: {
      backgroundColor: theme.colors.primary,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      ...theme.shadows.medium,
    },
    buttonIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: withOpacity(theme.colors.surface, "1F"),
      marginBottom: theme.spacing.sm,
    },
    buttonTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.surface,
      marginBottom: 5,
    },
    buttonSubtitle: {
      fontSize: 14,
      color: theme.colors.surface,
      textAlign: "center",
    },
    categoriesContainer: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.colors.text,
    },
    categoryCard: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.spacing["2xl"],
      alignItems: "center",
      gap: theme.spacing.lg,
      shadowColor: "rgba(17, 24, 28, 0.08)",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 6,
    },
    categoryIcon: {
      borderRadius: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: withOpacity(theme.colors.primary, "12"),
    },
    categoryInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.colors.text,
    },
    categoryCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    highPriority: {
      backgroundColor: theme.colors.error,
    },
    mediumPriority: {
      backgroundColor: theme.colors.warning,
    },
    lowPriority: {
      backgroundColor: theme.colors.success,
    },
    priorityText: {
      color: theme.colors.surface,
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
      color: theme.colors.text,
    },
    emptySubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 24,
    },
    startLearningButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 25,
    },
    startLearningText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    categoryRecommendation: {
      fontSize: 12,
      color: theme.colors.textDisabled,
      marginTop: 2,
      fontStyle: "italic",
    },
    skeletonStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    categoryProgressContainer: {
      marginTop: 8,
    },
    // タブナビゲーション関連スタイル
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderRadius: 25,
      padding: 4,
      marginBottom: 20,
      ...theme.shadows.small,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    tabButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    activeTabButton: {
      backgroundColor: theme.colors.primary,
      ...theme.shadows.small,
    },
    tabButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    activeTabButtonText: {
      color: theme.colors.surface,
    },
    // 統計関連スタイル
    statisticsContainer: {
      flex: 1,
      paddingBottom: 20,
    },
    overallStatsCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 15,
      padding: 20,
      ...theme.shadows.medium,
    },
    overallStatsGrid: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 15,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 5,
    },
    categoryProgressCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing["2xl"],
      padding: theme.spacing.xl,
      ...theme.shadows.medium,
    },
    categoryProgressItem: {
      backgroundColor: withOpacity(theme.colors.primary, "08"),
      borderRadius: theme.spacing["2xl"],
      padding: theme.spacing.lg,
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    categoryProgressIcon: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.spacing.lg,
      backgroundColor: withOpacity(theme.colors.surface, "26"),
      marginBottom: theme.spacing.sm,
    },
    categoryProgressName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 5,
    },
    categoryProgressPercent: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 8,
    },
    categoryProgressBarContainer: {
      width: "100%",
      marginTop: 5,
    },
    dataInfoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 15,
      padding: 20,
      alignItems: "center",
      ...theme.shadows.medium,
    },
    dataInfoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 15,
      lineHeight: 20,
    },
    refreshButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
    },
    refreshButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
  });
