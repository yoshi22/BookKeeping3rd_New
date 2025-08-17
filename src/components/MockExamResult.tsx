/**
 * 模試結果表示コンポーネント
 * 模試の詳細結果・分析・レポート表示
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
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";
import { MockExamSessionResult } from "../services/mock-exam-service";
import {
  MockExamDetailedResults,
  MockExamQuestionResult,
} from "../types/database";

interface MockExamResultProps {
  result: MockExamSessionResult;
  detailedResults?: MockExamDetailedResults;
  onReviewIncorrect?: () => void;
  onRetakeExam?: () => void;
  onClose: () => void;
}

export const MockExamResult: React.FC<MockExamResultProps> = ({
  result,
  detailedResults,
  onReviewIncorrect,
  onRetakeExam,
  onClose,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [activeTab, setActiveTab] = useState<
    "overview" | "sections" | "analysis"
  >("overview");

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  const getGradeText = (score: number): string => {
    if (score >= 90) return "A (優秀)";
    if (score >= 80) return "B (良好)";
    if (score >= 70) return "C (合格)";
    if (score >= 60) return "D (あと少し)";
    return "F (要復習)";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* 合格・不合格表示 */}
      <View style={styles.resultCard}>
        <View
          style={[
            styles.passStatusContainer,
            {
              backgroundColor: result.isPassed
                ? theme.colors.success + "20"
                : theme.colors.error + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.passStatusText,
              {
                color: result.isPassed
                  ? theme.colors.success
                  : theme.colors.error,
              },
            ]}
          >
            {result.isPassed ? "🎉 合格" : "❌ 不合格"}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>総合得点</Text>
          <Text
            style={[
              styles.scoreValue,
              { color: getScoreColor(result.totalScore) },
            ]}
          >
            {result.totalScore} / {result.maxScore}
          </Text>
          <Text style={styles.gradeText}>
            {getGradeText(result.totalScore)}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>正答率</Text>
            <Text style={styles.statValue}>
              {formatPercentage(result.totalScore / result.maxScore)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>所要時間</Text>
            <Text style={styles.statValue}>{formatTime(result.duration)}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>合格基準</Text>
            <Text style={styles.statValue}>70点以上</Text>
          </View>
        </View>
      </View>

      {/* セクション別概要 */}
      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>セクション別結果</Text>

        {Object.entries(result.sectionResults).map(
          ([sectionKey, section], index) => {
            const sectionNumber = index + 1;
            const sectionName = getSectionName(sectionNumber);

            return (
              <View key={sectionKey} style={styles.sectionRow}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>
                    第{sectionNumber}問: {sectionName}
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    {section.questions.length}問
                  </Text>
                </View>

                <View style={styles.sectionScore}>
                  <Text
                    style={[
                      styles.sectionScoreText,
                      {
                        color: getScoreColor(
                          (section.score / section.maxScore) * 100,
                        ),
                      },
                    ]}
                  >
                    {section.score} / {section.maxScore}
                  </Text>
                  <Text style={styles.sectionAccuracy}>
                    正答率: {formatPercentage(section.score / section.maxScore)}
                  </Text>
                </View>
              </View>
            );
          },
        )}
      </View>

      {/* 次のアクション */}
      <View style={styles.actionContainer}>
        {result.incorrectQuestions.length > 0 && onReviewIncorrect && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={onReviewIncorrect}
          >
            <Text style={styles.reviewButtonText}>
              間違い問題を復習 ({result.incorrectQuestions.length}問)
            </Text>
          </TouchableOpacity>
        )}

        {onRetakeExam && (
          <TouchableOpacity style={styles.retakeButton} onPress={onRetakeExam}>
            <Text style={styles.retakeButtonText}>もう一度挑戦</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSectionsTab = () => (
    <View style={styles.tabContent}>
      {Object.entries(result.sectionResults).map(
        ([sectionKey, section], index) => {
          const sectionNumber = index + 1;
          const sectionName = getSectionName(sectionNumber);

          return (
            <View key={sectionKey} style={styles.resultCard}>
              <Text style={styles.cardTitle}>
                第{sectionNumber}問: {sectionName}
              </Text>

              <View style={styles.sectionDetailHeader}>
                <View style={styles.sectionDetailScore}>
                  <Text style={styles.detailScoreValue}>
                    {section.score} / {section.maxScore}
                  </Text>
                  <Text style={styles.detailScoreLabel}>
                    正答率: {formatPercentage(section.score / section.maxScore)}
                  </Text>
                </View>
              </View>

              {/* 問題別結果 */}
              <View style={styles.questionsContainer}>
                {section.questions.map((question, questionIndex) => (
                  <View
                    key={question.questionId}
                    style={styles.questionResultRow}
                  >
                    <View style={styles.questionNumber}>
                      <Text style={styles.questionNumberText}>
                        {questionIndex + 1}
                      </Text>
                    </View>

                    <View style={styles.questionResultInfo}>
                      <View style={styles.questionResultHeader}>
                        <Text
                          style={[
                            styles.questionResultStatus,
                            {
                              color: question.isCorrect
                                ? theme.colors.success
                                : theme.colors.error,
                            },
                          ]}
                        >
                          {question.isCorrect ? "✓ 正解" : "✗ 不正解"}
                        </Text>
                        <Text style={styles.questionPoints}>
                          {question.earnedPoints} / {question.maxPoints}点
                        </Text>
                      </View>

                      {!question.isCorrect && (
                        <Text style={styles.incorrectNote}>
                          復習対象に追加されました
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        },
      )}
    </View>
  );

  const renderAnalysisTab = () => {
    const totalQuestions = Object.values(result.sectionResults).reduce(
      (sum, section) => sum + section.questions.length,
      0,
    );
    const correctQuestions = Object.values(result.sectionResults).reduce(
      (sum, section) =>
        sum + section.questions.filter((q) => q.isCorrect).length,
      0,
    );

    return (
      <View style={styles.tabContent}>
        {/* 全体分析 */}
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>全体分析</Text>

          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisValue}>{totalQuestions}</Text>
              <Text style={styles.analysisLabel}>総問題数</Text>
            </View>

            <View style={styles.analysisItem}>
              <Text
                style={[styles.analysisValue, { color: theme.colors.success }]}
              >
                {correctQuestions}
              </Text>
              <Text style={styles.analysisLabel}>正解数</Text>
            </View>

            <View style={styles.analysisItem}>
              <Text
                style={[styles.analysisValue, { color: theme.colors.error }]}
              >
                {totalQuestions - correctQuestions}
              </Text>
              <Text style={styles.analysisLabel}>不正解数</Text>
            </View>
          </View>
        </View>

        {/* 時間分析 */}
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>時間分析</Text>

          <View style={styles.timeAnalysis}>
            <View style={styles.timeAnalysisRow}>
              <Text style={styles.timeLabel}>所要時間</Text>
              <Text style={styles.timeValue}>
                {formatTime(result.duration)}
              </Text>
            </View>

            <View style={styles.timeAnalysisRow}>
              <Text style={styles.timeLabel}>制限時間</Text>
              <Text style={styles.timeValue}>60分</Text>
            </View>

            <View style={styles.timeAnalysisRow}>
              <Text style={styles.timeLabel}>残り時間</Text>
              <Text
                style={[
                  styles.timeValue,
                  {
                    color:
                      3600 - result.duration > 0
                        ? theme.colors.success
                        : theme.colors.error,
                  },
                ]}
              >
                {formatTime(Math.max(0, 3600 - result.duration))}
              </Text>
            </View>

            <View style={styles.timeAnalysisRow}>
              <Text style={styles.timeLabel}>平均解答時間</Text>
              <Text style={styles.timeValue}>
                {formatTime(Math.floor(result.duration / totalQuestions))}
              </Text>
            </View>
          </View>
        </View>

        {/* 改善ポイント */}
        <View style={styles.resultCard}>
          <Text style={styles.cardTitle}>改善ポイント</Text>
          {generateImprovementTips(result)}
        </View>
      </View>
    );
  };

  const generateImprovementTips = (result: MockExamSessionResult) => {
    const tips: string[] = [];

    // スコア別のアドバイス
    if (result.totalScore < 70) {
      tips.push("合格まであと少しです！間違えた問題を重点的に復習しましょう。");
    }

    // セクション別のアドバイス
    Object.entries(result.sectionResults).forEach(
      ([sectionKey, section], index) => {
        const accuracy = section.score / section.maxScore;
        const sectionName = getSectionName(index + 1);

        if (accuracy < 0.6) {
          tips.push(
            `${sectionName}の正答率が低めです。基礎的な問題から復習することをお勧めします。`,
          );
        }
      },
    );

    // 時間のアドバイス
    if (result.duration > 3000) {
      // 50分以上
      tips.push("時間配分を意識して、効率的に解答を進めましょう。");
    }

    if (tips.length === 0) {
      tips.push("素晴らしい結果です！この調子で学習を続けましょう。");
    }

    return (
      <View>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipContainer}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    );
  };

  const getSectionName = (sectionNumber: number): string => {
    switch (sectionNumber) {
      case 1:
        return "仕訳";
      case 2:
        return "帳簿";
      case 3:
        return "試算表";
      default:
        return "不明";
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>模試結果</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </View>

      {/* タブナビゲーション */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            概要
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "sections" && styles.activeTab]}
          onPress={() => setActiveTab("sections")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sections" && styles.activeTabText,
            ]}
          >
            詳細
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "analysis" && styles.activeTab]}
          onPress={() => setActiveTab("analysis")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "analysis" && styles.activeTabText,
            ]}
          >
            分析
          </Text>
        </TouchableOpacity>
      </View>

      {/* タブコンテンツ */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "sections" && renderSectionsTab()}
        {activeTab === "analysis" && renderAnalysisTab()}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      backgroundColor: theme.colors.textSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    closeButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    scrollContainer: {
      flex: 1,
    },
    tabContent: {
      padding: 16,
    },
    resultCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      ...theme.shadows.medium,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    passStatusContainer: {
      alignItems: "center",
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
    },
    passStatusText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    scoreContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    scoreLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    scoreValue: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 4,
    },
    gradeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    sectionInfo: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    sectionScore: {
      alignItems: "flex-end",
    },
    sectionScoreText: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
    },
    sectionAccuracy: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    actionContainer: {
      gap: 12,
    },
    reviewButton: {
      backgroundColor: theme.colors.warning,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    reviewButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    retakeButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    retakeButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    sectionDetailHeader: {
      marginBottom: 16,
    },
    sectionDetailScore: {
      alignItems: "center",
    },
    detailScoreValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    detailScoreLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    questionsContainer: {
      gap: 8,
    },
    questionResultRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
    },
    questionNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    questionNumberText: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    questionResultInfo: {
      flex: 1,
    },
    questionResultHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    questionResultStatus: {
      fontSize: 14,
      fontWeight: "600",
    },
    questionPoints: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    incorrectNote: {
      fontSize: 12,
      color: theme.colors.warning,
      fontStyle: "italic",
    },
    analysisGrid: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    analysisItem: {
      alignItems: "center",
    },
    analysisValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    analysisLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    timeAnalysis: {
      gap: 12,
    },
    timeAnalysisRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    timeLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    timeValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    tipContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    tipBullet: {
      fontSize: 16,
      color: theme.colors.primary,
      marginRight: 8,
      marginTop: 2,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });
