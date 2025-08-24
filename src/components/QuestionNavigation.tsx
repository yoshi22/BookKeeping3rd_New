/**
 * 問題ナビゲーションコンポーネント
 * Step 2.1.6: カテゴリ選択・問題ナビゲーション機能実装
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  categoryName: string;
  onPrevious: () => void;
  onNext: () => void;
  onQuestionSelect?: (index: number) => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  showQuestionNumbers?: boolean;
}

export default function QuestionNavigation({
  currentQuestionIndex,
  totalQuestions,
  categoryName,
  onPrevious,
  onNext,
  onQuestionSelect,
  canGoPrevious = true,
  canGoNext = true,
  showQuestionNumbers = false,
}: QuestionNavigationProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 進捗率の計算
  const progressPercentage =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  // 問題番号リストの生成（表示する場合）
  const renderQuestionNumbers = () => {
    if (!showQuestionNumbers || !onQuestionSelect) return null;

    const numbers = [];
    for (let i = 0; i < totalQuestions; i++) {
      numbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.questionNumber,
            i === currentQuestionIndex && styles.questionNumberActive,
          ]}
          onPress={() => onQuestionSelect(i)}
        >
          <Text
            style={[
              styles.questionNumberText,
              i === currentQuestionIndex && styles.questionNumberTextActive,
            ]}
          >
            {i + 1}
          </Text>
        </TouchableOpacity>,
      );
    }

    return (
      <View style={styles.questionNumbersContainer}>
        <Text style={styles.questionNumbersTitle}>問題選択:</Text>
        <View style={styles.questionNumbers}>{numbers}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー情報 */}
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {totalQuestions}
          </Text>
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 進捗バー */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.prevButton,
            !canGoPrevious && styles.navButtonDisabled,
          ]}
          onPress={onPrevious}
          disabled={!canGoPrevious}
          testID="previous-question-button"
        >
          <Text
            style={[
              styles.navButtonText,
              !canGoPrevious && styles.navButtonTextDisabled,
            ]}
          >
            ← 前の問題
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !canGoNext && styles.navButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!canGoNext}
          testID="next-question-button"
        >
          <Text
            style={[
              styles.navButtonText,
              styles.nextButtonText,
              !canGoNext && styles.navButtonTextDisabled,
            ]}
          >
            次の問題 →
          </Text>
        </TouchableOpacity>
      </View>

      {/* 問題番号選択（オプション） */}
      {renderQuestionNumbers()}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      margin: 15,
      borderRadius: 10,
      ...theme.shadows.medium,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 2,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    progressPercentage: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    progressBarContainer: {
      padding: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    navigationButtons: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
    },
    navButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    prevButton: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
    },
    navButtonDisabled: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderColor: theme.colors.border,
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
    },
    nextButtonText: {
      color: theme.colors.surface,
    },
    navButtonTextDisabled: {
      color: theme.colors.textDisabled,
    },
    questionNumbersContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    questionNumbersTitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    questionNumbers: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    questionNumber: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    questionNumberActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    questionNumberText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    questionNumberTextActive: {
      color: theme.colors.surface,
      fontWeight: "bold",
    },
  });
