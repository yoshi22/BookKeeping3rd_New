import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../src/components/layout/ResponsiveLayout";
import { QuestionRepository } from "../../../src/data/repositories/question-repository";
import type { QuestionCategory } from "../../../src/types/models";
import { WithScreenTransition } from "../../../src/hooks/useScreenTransitions";
import {
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
  useDynamicColors,
  type Theme,
} from "../../../src/context/ThemeContext";
import { AppIcon, IconContextSizes } from "../../../src/theme/icons";

const withOpacity = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export default function LearningScreen() {
  const router = useRouter();
  const [questionCounts, setQuestionCounts] = useState<
    Record<QuestionCategory, number>
  >({
    journal: 0,
    ledger: 0,
    trial_balance: 0,
    financial_statement: 0,
    voucher_entry: 0,
    multiple_blank_choice: 0,
  });
  const [loading, setLoading] = useState(true);

  // Phase 4: ダークモード対応のテーマシステム
  const { theme, getStatusBarStyle } = useTheme();
  const dynamicColors = useDynamicColors();

  // タブレットレイアウト対応（オリエンテーション対応）
  const { deviceInfo, getValueByDevice } = useTabletLayout();

  // Phase 4: テーマに応じたスタイル生成
  const styles = useThemedStyles(createStyles);

  const categories = [
    {
      id: "journal" as QuestionCategory,
      name: "第1問",
      subtitle: "仕訳問題",
      description: "基本的な仕訳から応用仕訳まで",
      totalQuestions: questionCounts.journal,
      completedQuestions: 0,
      icon: "journal" as const,
      color: theme.categoryColors.journal,
      points: "45点",
      examCount: "15問",
      examTime: "15-20分",
      details:
        "現金・預金、商品売買、債権・債務、給与・税金、固定資産、決算整理",
    },
    {
      id: "ledger" as QuestionCategory,
      name: "第2問",
      subtitle: "補助簿・勘定記入・伝票",
      description: "帳簿記入と勘定の理解",
      totalQuestions: questionCounts.ledger,
      completedQuestions: 0,
      icon: "ledger" as const,
      color: theme.categoryColors.ledger,
      points: "20点",
      examCount: "2問",
      examTime: "15-20分",
      details: "勘定記入、補助簿記入、伝票記入、理論・選択問題",
    },
    {
      id: "trial_balance" as QuestionCategory,
      name: "第3問",
      subtitle: "決算書作成",
      description: "財務諸表・精算表・試算表の作成",
      totalQuestions: questionCounts.trial_balance,
      completedQuestions: 0,
      icon: "trialBalance" as const,
      color: theme.categoryColors.trialBalance,
      points: "35点",
      examCount: "1問",
      examTime: "25-30分",
      details: "財務諸表作成、精算表作成、試算表作成",
    },
  ];

  useEffect(() => {
    const loadQuestionCounts = async () => {
      try {
        // 問題数の取得を開始
        const questionRepository = new QuestionRepository();
        const counts = await questionRepository.getQuestionCountsByCategory();
        // 問題数取得成功
        setQuestionCounts(counts);
        // データがない場合のデフォルト値を設定
        if (
          !counts.journal &&
          !counts.ledger &&
          !counts.trial_balance &&
          !counts.financial_statement
        ) {
          setQuestionCounts({
            journal: 0,
            ledger: 0,
            trial_balance: 0,
            financial_statement: 0,
            voucher_entry: 0,
            multiple_blank_choice: 0,
          });
        }
      } catch {
        // エラー時はデフォルト値を設定
        setQuestionCounts({
          journal: 0,
          ledger: 0,
          trial_balance: 0,
          financial_statement: 0,
          voucher_entry: 0,
          multiple_blank_choice: 0,
        });
        // エラー時でもローディング状態を解除
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionCounts();
  }, []);

  return (
    <WithScreenTransition
      transitionType="fadeIn"
      transitionConfig={{ duration: 300 }}
    >
      <Screen
        safeArea={true}
        scrollable={true}
        statusBarStyle={getStatusBarStyle()}
        testID="learning-screen"
      >
        <RotationAwareContainer animationDuration={250}>
          <ResponsiveContainer>
            {/* アプリタイトル（ヘッダー代替） */}
            <OrientationAwareView
              style={styles.headerSection}
              portraitStyle={{
                paddingHorizontal: getValueByDevice({
                  phone: 20,
                  tablet: 40,
                  desktop: 60,
                  default: 20,
                }),
              }}
              landscapeStyle={{
                paddingHorizontal: getValueByDevice({
                  phone: 16,
                  tablet: 32,
                  desktop: 48,
                  default: 16,
                }),
              }}
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
                学習
              </Text>
            </OrientationAwareView>

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
                📚 学習モード
              </Text>
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
                段階的学習で簿記3級を完全攻略
              </Text>
              <Text style={styles.totalQuestions}>
                全{Object.values(questionCounts).reduce((a, b) => a + b, 0)}
                問の豊富な問題で実力アップ
              </Text>
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
              {loading ? (
                <ResponsiveGrid>
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <ResponsiveGridItem key={index}>
                        <SkeletonLoader
                          width="100%"
                          height={deviceInfo.isTablet ? 140 : 120}
                          borderRadius={10}
                          backgroundColor={theme.colors.borderLight}
                          shimmerColor={dynamicColors.adaptive.divider}
                        />
                      </ResponsiveGridItem>
                    ))}
                </ResponsiveGrid>
              ) : (
                <ResponsiveGrid>
                  {/* 全370問順次進行ボタン */}
                  <ResponsiveGridItem>
                    <TouchableOpacity
                      style={[
                        styles.categoryCard,
                        {
                          borderLeftColor: theme.colors.secondary,
                          minHeight: deviceInfo.isTablet ? 200 : 160,
                        },
                      ]}
                      onPress={() => {
                        // 第一問から順次進行（Q_J_001から開始）- 全問題順次進行モード
                        router.push(
                          "/(tabs)/learning/question/Q_J_001?sessionType=learning&learningMode=all",
                        );
                      }}
                      testID="learning-all-questions-button"
                      accessibilityLabel="全問題順次進行を開始"
                    >
                      <View style={styles.categoryHeader}>
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
                            name="challenge"
                            size={
                              deviceInfo.isTablet
                                ? IconContextSizes.header
                                : IconContextSizes.listItem
                            }
                            color={theme.colors.secondary}
                          />
                        </View>
                        <View style={styles.categoryTitleContainer}>
                          <Text
                            style={[
                              styles.categoryName,
                              { fontSize: deviceInfo.isTablet ? 20 : 18 },
                            ]}
                          >
                            全問題順次進行
                          </Text>
                          <Text style={styles.categorySubtitle}>
                            370問完全制覇モード
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.pointsBadge,
                            { backgroundColor: theme.colors.secondary },
                          ]}
                        >
                          <Text style={styles.pointsText}>370問</Text>
                        </View>
                      </View>

                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryDescription}>
                          第1問→第2問→第3問の全370問を順次進行
                        </Text>
                        <View style={styles.examInfo}>
                          <Text style={styles.examInfoText}>
                            📚 仕訳250問 • 📋 帳簿40問 • 📊 決算書12問
                          </Text>
                        </View>
                        <Text style={styles.categoryDetails}>
                          🎯 体系的に学べる完全版問題集
                        </Text>
                        <Text style={styles.categoryProgress}>
                          全
                          {Object.values(questionCounts).reduce(
                            (a, b) => a + b,
                            0,
                          )}
                          問の順次学習
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.categoryAction,
                          { backgroundColor: theme.colors.secondary },
                        ]}
                        testID="learning-all-questions-start"
                      >
                        <Text
                          style={styles.actionText}
                          testID="learning-all-questions-start-text"
                        >
                          開始
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </ResponsiveGridItem>

                  {/* 既存のカテゴリ別学習 */}
                  {categories.map((category) => (
                    <ResponsiveGridItem key={category.id}>
                      <TouchableOpacity
                        style={[
                          styles.categoryCard,
                          {
                            borderLeftColor: category.color,
                            minHeight: deviceInfo.isTablet ? 200 : 160,
                          },
                        ]}
                        onPress={() => {
                          // カテゴリ詳細画面に遷移
                          router.push(
                            `/(tabs)/learning/category/${category.id}`,
                          );
                        }}
                        testID={`category-${category.id}`}
                        accessibilityLabel={`${category.name} ${category.subtitle}を開始`}
                      >
                        <View style={styles.categoryHeader}>
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
                              color={category.color}
                            />
                          </View>
                          <View style={styles.categoryTitleContainer}>
                            <Text
                              style={[
                                styles.categoryName,
                                { fontSize: deviceInfo.isTablet ? 20 : 18 },
                              ]}
                            >
                              {category.name}
                            </Text>
                            <Text style={styles.categorySubtitle}>
                              {category.subtitle}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.pointsBadge,
                              { backgroundColor: category.color },
                            ]}
                          >
                            <Text style={styles.pointsText}>
                              {category.points}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.categoryInfo}>
                          <Text style={styles.categoryDescription}>
                            {category.description}
                          </Text>
                          <View style={styles.examInfo}>
                            <Text style={styles.examInfoText}>
                              🎯 本試験: {category.examCount} • ⏱{" "}
                              {category.examTime}
                            </Text>
                          </View>
                          <Text style={styles.categoryDetails}>
                            📚 {category.details}
                          </Text>

                          {/* プログレスバー追加 */}
                          <View style={styles.progressContainer}>
                            <LinearProgress
                              progress={
                                Math.round(
                                  (category.completedQuestions /
                                    category.totalQuestions) *
                                    100,
                                ) || 0
                              }
                              color={category.color}
                              backgroundColor={theme.colors.borderLight}
                              height={6}
                              borderRadius={3}
                              animated={true}
                              label={`練習問題 ${category.completedQuestions}/${category.totalQuestions}問完了`}
                              showPercentage={true}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </ResponsiveGridItem>
                  ))}
                </ResponsiveGrid>
              )}
            </View>
          </ResponsiveContainer>
        </RotationAwareContainer>
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
      paddingTop: 40,
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
      marginBottom: 8,
    },
    totalQuestions: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    categoriesContainer: {
      padding: theme.spacing.xl,
    },
    categoryCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.spacing["2xl"],
      borderLeftWidth: 4,
      shadowColor: "rgba(17, 24, 28, 0.08)",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
      elevation: 6,
    },
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      gap: theme.spacing.lg,
    },
    categoryIcon: {
      borderRadius: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: withOpacity(theme.colors.primary, "12"),
    },
    categoryTitleContainer: {
      flex: 1,
    },
    categoryName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    categorySubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    pointsBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    pointsText: {
      color: theme.colors.surface,
      fontWeight: "bold",
      fontSize: 14,
    },
    categoryInfo: {
      marginLeft: theme.spacing.lg,
    },
    categoryDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 5,
    },
    examInfo: {
      marginBottom: 5,
    },
    examInfoText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    categoryDetails: {
      fontSize: 12,
      color: theme.colors.textDisabled,
      marginBottom: 5,
    },
    categoryProgress: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    progressContainer: {
      marginTop: 8,
      marginBottom: 5,
    },
    categoryAction: {
      position: "absolute",
      right: 15,
      bottom: 15,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
    },
    actionText: {
      color: theme.colors.surface,
      fontWeight: "bold",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.colors.text,
      textAlign: "center",
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 15,
    },
    mockExamSection: {
      padding: 20,
      backgroundColor: `${theme.colors.primary}08`,
      borderRadius: 15,
      margin: 20,
    },
    mockExamButton: {
      backgroundColor: `${theme.colors.primary}15`,
      padding: 20,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: `${theme.colors.primary}30`,
      ...theme.shadows.large,
      elevation: 8,
    },
    mockExamIcon: {
      fontSize: 30,
      marginRight: 15,
    },
    mockExamInfo: {
      flex: 1,
    },
    mockExamTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    mockExamSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 3,
    },
    mockExamDetail: {
      fontSize: 12,
      color: theme.colors.textDisabled,
    },
    examAction: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,
    },
    examActionText: {
      color: theme.colors.surface,
      fontWeight: "bold",
    },
    loadingContainer: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      ...theme.shadows.medium,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });
