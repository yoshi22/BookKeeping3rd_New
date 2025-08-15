import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { reviewService } from "../../../src/services/review-service";
import { ReviewStatistics } from "../../../src/data/repositories/review-item-repository";
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
  OrientationAwareView,
  RotationAwareContainer,
} from "../../../src/hooks/useTabletLayout";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
} from "../../../src/context/ThemeContext";

export default function ReviewScreen() {
  const [reviewStats, setReviewStats] = useState<ReviewStatistics | null>(null);
  const [weaknessCategories, setWeaknessCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Phase 4: ダークモード対応のテーマシステム
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();

  // タブレットレイアウト対応（オリエンテーション対応）
  const { 
    deviceInfo, 
    getValueByDevice, 
    shouldUseMasterDetail,
    getOrientationSpecificValue,
    getOrientationLayout,
  } = useTabletLayout();

  // Phase 4: テーマに応じたスタイル生成
  const styles = useThemedStyles(createStyles);

  // データベース初期化確認
  const ensureDatabaseInitialized = async (): Promise<boolean> => {
    try {
      console.log("[ReviewScreen] データベース初期化確認開始");
      await setupDatabase();
      console.log("[ReviewScreen] データベース初期化確認完了");
      return true; // 通常の初期化成功
    } catch (error) {
      console.error("[ReviewScreen] データベース初期化エラー:", error);
      console.error("[ReviewScreen] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // データベースリセットを試行
      const resetSuccess = await tryDatabaseReset(error);
      return resetSuccess; // リセット経由での初期化成功
    }
  };

  // データベースリセット試行
  const tryDatabaseReset = async (originalError: any) => {
    try {
      console.log("[ReviewScreen] データベースリセットを試行中...");

      // データベースサービスを取得してリセット実行
      const { databaseService } = await import("../../../src/data/database");
      await databaseService.resetDatabase();
      console.log("[ReviewScreen] データベースリセット完了");

      // リセット後に再初期化を試行
      await setupDatabase();
      console.log("[ReviewScreen] リセット後の初期化成功");

      // 初期化成功後、復習データの再読み込みを実行
      console.log("[ReviewScreen] リセット後の復習データ読み込み開始");
      return true; // 成功を示すフラグを返す
    } catch (resetError) {
      console.error("[ReviewScreen] データベースリセット失敗:", resetError);
      console.error("[ReviewScreen] Reset error details:", {
        message: resetError instanceof Error ? resetError.message : resetError,
        stack: resetError instanceof Error ? resetError.stack : undefined,
      });

      // リセットも失敗した場合はより詳細なエラー情報を提供
      const errorDetails =
        resetError instanceof Error ? resetError.message : String(resetError);

      throw new Error(
        `データベースの完全復旧に失敗しました。アプリを再起動してください。\n詳細: ${errorDetails}`,
      );
    }
  };

  // 復習統計データ読み込み
  const loadReviewData = async () => {
    try {
      setLoading(true);

      // データベース初期化確認
      const initSuccess = await ensureDatabaseInitialized();

      if (!initSuccess) {
        console.error("[ReviewScreen] データベース初期化に失敗しました");
        throw new Error("データベース初期化に失敗しました");
      }

      // 復習統計取得
      let stats: ReviewStatistics;
      let weakAreas: any[];

      try {
        // デバッグ用：直接SQLでreview_itemsテーブルを確認
        console.log("[ReviewScreen] デバッグ: review_itemsテーブルを直接確認");
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
        console.log(
          "[ReviewScreen] デバッグ: review_itemsテーブルの件数:",
          reviewItemsCount.rows,
        );
        console.log(
          "[ReviewScreen] デバッグ: review_itemsテーブルのデータ（先頭10件）:",
          reviewItemsData.rows,
        );
        console.log(
          "[ReviewScreen] デバッグ: 不正解の学習履歴（先頭5件）:",
          learningHistoryIncorrect.rows,
        );

        stats = await reviewService.getReviewStatistics();
        weakAreas = await reviewService.analyzeWeakAreas();
      } catch (dbError) {
        console.warn(
          "[ReviewScreen] データベースエラー、フォールバックデータを使用:",
          dbError,
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
            categoryName: "仕訳",
            reviewCount: 0,
            averagePriority: 0,
            recommendation: "学習を開始してください",
            lastReviewedAt: null,
          },
          {
            category: "ledger",
            categoryName: "帳簿",
            reviewCount: 0,
            averagePriority: 0,
            recommendation: "学習を開始してください",
            lastReviewedAt: null,
          },
          {
            category: "trial_balance",
            categoryName: "試算表",
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
            ? "📝"
            : area.category === "ledger"
              ? "📋"
              : "📊",
      }));

      setWeaknessCategories(formattedCategories);
    } catch (error) {
      console.error("[ReviewScreen] 復習データ読み込みエラー:", error);

      let errorMessage = "復習データの読み込みに失敗しました";
      if (error instanceof Error) {
        console.error("[ReviewScreen] Error details:", {
          message: error.message,
          stack: error.stack,
        });

        if (error.message.includes("データベースの初期化に失敗しました")) {
          errorMessage = `復讐データ読み込みエラー：Error: データベースの初期化に失敗しました`;
        } else if (error.message.includes("Database setup failed")) {
          errorMessage =
            "復習データ読み込みエラー：Error: データベースの初期化に失敗しました";
        } else if (error.message.includes("database initialization failed")) {
          errorMessage =
            "データベースの初期化に失敗しました。アプリを再起動してください。";
        } else if (
          error.message.includes("sqlite") ||
          error.message.includes("SQLite")
        ) {
          errorMessage = "データベースに接続できませんでした。";
        } else {
          errorMessage = `復習データ読み込みエラー：${error.message}`;
        }
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
          name: "仕訳",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "📝",
        },
        {
          id: "ledger",
          name: "帳簿",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "📋",
        },
        {
          id: "trial_balance",
          name: "試算表",
          reviewCount: 0,
          priority: "low",
          averagePriority: 0,
          recommendation: "学習を開始してください",
          lastReviewed: null,
          icon: "📊",
        },
      ]);

      console.warn("[ReviewScreen] フォールバックデータでUI表示を継続");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewData();
  }, []);

  // 画面がフォーカスされたときに最新データを再取得
  useFocusEffect(
    useCallback(() => {
      console.log("[ReviewScreen] 画面フォーカス - 最新データを取得");
      // キャッシュをクリアして最新のデータを取得
      try {
        const {
          statisticsCache,
        } = require("../../../src/services/statistics-cache");
        statisticsCache.clearAll();
      } catch (error) {
        console.warn("[ReviewScreen] キャッシュクリアに失敗:", error);
      }
      loadReviewData();
    }, []),
  );

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
        pathname: "./question/[id]",
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
        pathname: "./question/[id]",
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
          <View style={[
            styles.headerSection,
            { 
              paddingHorizontal: getValueByDevice({
                phone: 20,
                tablet: 40,
                desktop: 60,
                default: 20
              })
            }
          ]}>
            <Text style={[
              styles.appTitle,
              { fontSize: getValueByDevice({
                phone: 18,
                tablet: 22,
                desktop: 24,
                default: 18
              })}
            ]}>復習</Text>
          </View>

          <View style={[
            styles.header,
            { 
              paddingHorizontal: getValueByDevice({
                phone: 20,
                tablet: 40,
                desktop: 60,
                default: 20
              })
            }
          ]}>
            <Text style={[
              styles.title,
              { fontSize: getValueByDevice({
                phone: 24,
                tablet: 28,
                desktop: 32,
                default: 24
              })}
            ]}>復習モード</Text>
            <Text style={[
              styles.subtitle,
              { fontSize: getValueByDevice({
                phone: 16,
                tablet: 18,
                desktop: 20,
                default: 16
              })}
            ]}>間違えた問題を効率的に復習</Text>
          </View>

          <View style={[
            styles.statsContainer,
            { 
              paddingHorizontal: getValueByDevice({
                phone: 20,
                tablet: 40,
                desktop: 60,
                default: 20
              }),
              flexDirection: deviceInfo.isTablet ? 'row' : 'row',
              justifyContent: deviceInfo.isTablet ? 'space-around' : 'space-around'
            }
          ]}>
            <View style={[
              styles.statCard,
              { 
                minWidth: deviceInfo.isTablet ? 120 : 80,
                padding: deviceInfo.isTablet ? 20 : 15 
              }
            ]}>
              <CircularProgress
                progress={
                  reviewStats?.totalReviewItems
                    ? Math.min((reviewStats.totalReviewItems / 100) * 100, 100)
                    : 0
                }
                size={deviceInfo.isTablet ? 80 : 60}
                strokeWidth={deviceInfo.isTablet ? 6 : 4}
                color="#ff6b35"
                showPercentage={false}
              >
                <Text style={[
                  styles.statNumber,
                  { fontSize: deviceInfo.isTablet ? 28 : 24 }
                ]}>
                  {reviewStats?.totalReviewItems || 0}
                </Text>
              </CircularProgress>
              <Text style={[
                styles.statLabel,
                { fontSize: deviceInfo.isTablet ? 14 : 12 }
              ]}>復習対象</Text>
            </View>
            <View style={[
              styles.statCard,
              { 
                minWidth: deviceInfo.isTablet ? 120 : 80,
                padding: deviceInfo.isTablet ? 20 : 15 
              }
            ]}>
              <CircularProgress
                progress={
                  reviewStats?.priorityReviewCount
                    ? Math.min((reviewStats.priorityReviewCount / 50) * 100, 100)
                    : 0
                }
                size={deviceInfo.isTablet ? 80 : 60}
                strokeWidth={deviceInfo.isTablet ? 6 : 4}
                color="#ff5722"
                showPercentage={false}
              >
                <Text style={[
                  styles.statNumber,
                  { fontSize: deviceInfo.isTablet ? 28 : 24 }
                ]}>
                  {reviewStats?.priorityReviewCount || 0}
                </Text>
              </CircularProgress>
              <Text style={[
                styles.statLabel,
                { fontSize: deviceInfo.isTablet ? 14 : 12 }
              ]}>重点復習</Text>
            </View>
            <View style={[
              styles.statCard,
              { 
                minWidth: deviceInfo.isTablet ? 120 : 80,
                padding: deviceInfo.isTablet ? 20 : 15 
              }
            ]}>
              <CircularProgress
                progress={
                  reviewStats?.masteredCount
                    ? Math.min((reviewStats.masteredCount / 100) * 100, 100)
                    : 0
                }
                size={deviceInfo.isTablet ? 80 : 60}
                strokeWidth={deviceInfo.isTablet ? 6 : 4}
                color="#4CAF50"
                showPercentage={false}
              >
                <Text style={[
                  styles.statNumber,
                  { fontSize: deviceInfo.isTablet ? 28 : 24 }
                ]}>
                  {reviewStats?.masteredCount || 0}
                </Text>
              </CircularProgress>
              <Text style={[
                styles.statLabel,
                { fontSize: deviceInfo.isTablet ? 14 : 12 }
              ]}>克服済み</Text>
            </View>
          </View>

          {(reviewStats?.totalReviewItems || 0) > 0 ? (
            <>
              <View style={[
                styles.actionContainer,
                { 
                  paddingHorizontal: getValueByDevice({
                    phone: 20,
                    tablet: 40,
                    desktop: 60,
                    default: 20
                  }),
                  flexDirection: deviceInfo.isTablet ? 'row' : 'column',
                  justifyContent: deviceInfo.isTablet ? 'space-between' : 'stretch'
                }
              ]}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { 
                      marginBottom: deviceInfo.isTablet ? 0 : 15,
                      marginRight: deviceInfo.isTablet ? 10 : 0,
                      flex: deviceInfo.isTablet ? 1 : undefined,
                      minHeight: deviceInfo.isTablet ? 100 : 80,
                      justifyContent: 'center'
                    }
                  ]}
                  onPress={() => startReviewSession(true)}
                  testID="review-priority-button"
                  accessibilityLabel="重点復習を開始"
                >
                  <Text style={[
                    styles.buttonIcon,
                    { fontSize: deviceInfo.isTablet ? 28 : 24 }
                  ]}>🎯</Text>
                  <Text style={[
                    styles.buttonTitle,
                    { fontSize: deviceInfo.isTablet ? 20 : 18 }
                  ]}>重点復習開始</Text>
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
                      justifyContent: 'center'
                    }
                  ]}
                  onPress={() => startReviewSession(false)}
                  testID="review-all-button"
                  accessibilityLabel="全て復習を開始"
                >
                  <Text style={[
                    styles.buttonIcon,
                    { fontSize: deviceInfo.isTablet ? 28 : 24 }
                  ]}>🔄</Text>
                  <Text style={[
                    styles.buttonTitle,
                    { fontSize: deviceInfo.isTablet ? 20 : 18 }
                  ]}>全て復習</Text>
                  <Text style={styles.buttonSubtitle}>
                    復習対象{reviewStats?.totalReviewItems || 0}問全て
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[
                styles.categoriesContainer,
                { 
                  paddingHorizontal: getValueByDevice({
                    phone: 20,
                    tablet: 40,
                    desktop: 60,
                    default: 20
                  })
                }
              ]}>
                <Text style={[
                  styles.sectionTitle,
                  { fontSize: deviceInfo.isTablet ? 20 : 18 }
                ]}>分野別弱点</Text>
                <ResponsiveGrid>
                  {weaknessCategories.map((category) => (
                    <ResponsiveGridItem key={category.id}>
                      <TouchableOpacity
                        style={[
                          styles.categoryCard,
                          { 
                            minHeight: deviceInfo.isTablet ? 140 : 120,
                            paddingVertical: deviceInfo.isTablet ? 20 : 15
                          }
                        ]}
                        onPress={() => startCategoryReview(category.id)}
                        testID={`review-category-${category.id}-button`}
                        accessibilityLabel={`${category.name}の復習を開始`}
                      >
                        <Text style={[
                          styles.categoryIcon,
                          { fontSize: deviceInfo.isTablet ? 36 : 30 }
                        ]}>{category.icon}</Text>
                        <View style={styles.categoryInfo}>
                          <Text style={[
                            styles.categoryName,
                            { fontSize: deviceInfo.isTablet ? 18 : 16 }
                          ]}>{category.name}</Text>
                          <Text style={[
                            styles.categoryCount,
                            { fontSize: deviceInfo.isTablet ? 16 : 14 }
                          ]}>
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
                                    ? "#ff5722"
                                    : category.priority === "medium"
                                      ? "#FF9800"
                                      : "#4CAF50"
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
            <View style={[
              styles.emptyState,
              { 
                paddingHorizontal: getValueByDevice({
                  phone: 40,
                  tablet: 60,
                  desktop: 80,
                  default: 40
                })
              }
            ]}>
              <Text style={[
                styles.emptyIcon,
                { fontSize: deviceInfo.isTablet ? 80 : 64 }
              ]}>🎉</Text>
              <Text style={[
                styles.emptyTitle,
                { fontSize: deviceInfo.isTablet ? 24 : 20 }
              ]}>復習対象の問題がありません！</Text>
              <Text style={[
                styles.emptySubtitle,
                { fontSize: deviceInfo.isTablet ? 18 : 16 }
              ]}>
                問題を解くと、間違えた問題が自動的に復習リストに追加されます
              </Text>
              <TouchableOpacity
                style={[
                  styles.startLearningButton,
                  { 
                    paddingHorizontal: deviceInfo.isTablet ? 40 : 30,
                    paddingVertical: deviceInfo.isTablet ? 20 : 15,
                    borderRadius: deviceInfo.isTablet ? 30 : 25
                  }
                ]}
                onPress={() => router.push("/(tabs)/learning")}
                testID="review-start-learning-button"
                accessibilityLabel="学習を始める"
              >
                <Text style={[
                  styles.startLearningText,
                  { fontSize: deviceInfo.isTablet ? 18 : 16 }
                ]}>学習を始める</Text>
              </TouchableOpacity>
            </View>
          )}
      </Screen>
    </WithScreenTransition>
  );
}

// Phase 4: ダークモード対応のスタイル生成関数
const createStyles = (
  theme: typeof import("../../../src/context/ThemeContext").Theme,
) =>
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
      color: "#ff6b35",
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
      backgroundColor: "#ff6b35",
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
      color: theme.colors.text,
    },
    categoryCard: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      alignItems: "center",
      ...theme.shadows.medium,
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
      color: "white",
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
  });
