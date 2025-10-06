/**
 * CBT準拠共通ヘッダーコンポーネント
 * タイマー、問題番号、マークボタンを含む
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CBTHeaderProps {
  sectionNumber: 1 | 2 | 3;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number; // 秒単位
  isMarked: boolean;
  onBackPress: () => void;
  onMarkToggle: () => void;
  onTimeUp?: () => void;
}

export const CBTHeader: React.FC<CBTHeaderProps> = ({
  sectionNumber,
  questionIndex,
  totalQuestions,
  timeRemaining,
  isMarked,
  onBackPress,
  onMarkToggle,
  onTimeUp,
}) => {
  // 時間フォーマット (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 時間警告色の判定
  const getTimeColor = (): string => {
    if (timeRemaining <= 300) return "#FF4444"; // 5分以下で赤
    if (timeRemaining <= 600) return "#FF8800"; // 10分以下で橙
    return "#0066CC"; // 通常は青
  };

  // 時間が0になったら通知
  React.useEffect(() => {
    if (timeRemaining <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <View style={styles.container} testID="cbt-header">
      {/* 左側: 戻るボタン */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        testID="cbt-header-back-button"
      >
        <Ionicons name="arrow-back" size={24} color="#333333" />
      </TouchableOpacity>

      {/* 中央: 問題番号 */}
      <View style={styles.centerSection}>
        <Text style={styles.sectionText} testID="cbt-header-section">
          第{sectionNumber}問 {questionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      {/* 右側: タイマーとマークボタン */}
      <View style={styles.rightSection}>
        <Text
          style={[styles.timerText, { color: getTimeColor() }]}
          testID="cbt-header-timer"
        >
          {formatTime(timeRemaining)}
        </Text>

        <TouchableOpacity
          style={[styles.markButton, isMarked && styles.markButtonActive]}
          onPress={onMarkToggle}
          testID="cbt-header-mark-button"
        >
          <Ionicons
            name={isMarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isMarked ? "#0066CC" : "#666666"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    height: 60,
  },
  backButton: {
    padding: 8,
    minWidth: 80,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
    justifyContent: "flex-end",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
    fontFamily: "monospace",
  },
  markButton: {
    padding: 8,
  },
  markButtonActive: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
});
