/**
 * 回答ガイダンスコンポーネント
 * 各問題タイプの回答方法と入力例を表示
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../context/ThemeContext";

interface AnswerGuideProps {
  questionType: "journal" | "ledger" | "trial_balance";
  visible: boolean;
  onClose: () => void;
}

interface GuideSection {
  title: string;
  content: string[];
  examples: { label: string; value: string }[];
}

export default function AnswerGuide({
  questionType,
  visible,
  onClose,
}: AnswerGuideProps) {
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);
  const getGuideContent = (): GuideSection => {
    switch (questionType) {
      case "journal":
        return {
          title: "仕訳問題の回答方法",
          content: [
            "• 借方・貸方の勘定科目をプルダウンから選択してください",
            "• 金額は半角数字で入力してください（カンマは不要）",
            "• 借方金額と貸方金額は必ず一致させてください",
            "• 同じ勘定科目を借方・貸方に重複して使用することはできません",
          ],
          examples: [
            { label: "借方勘定科目", value: "現金" },
            { label: "借方金額", value: "100000" },
            { label: "貸方勘定科目", value: "売上" },
            { label: "貸方金額", value: "100000" },
          ],
        };

      case "ledger":
        return {
          title: "帳簿問題の回答方法",
          content: [
            "• 日付は「月/日」の形式で入力してください",
            "• 摘要は取引内容を簡潔に記入してください",
            "• 借方金額または貸方金額のどちらかに金額を入力してください",
            "• 入力しない方の金額は0または空白のままにしてください",
          ],
          examples: [
            { label: "日付", value: "4/1" },
            { label: "摘要", value: "商品仕入" },
            { label: "借方金額", value: "490000" },
            { label: "貸方金額", value: "0" },
          ],
        };

      case "trial_balance":
        return {
          title: "試算表問題の回答方法",
          content: [
            "• 各勘定科目の残高を計算してください",
            "• 借方残高の場合は正の値を入力してください",
            "• 貸方残高の場合は負の値を入力してください",
            "• 残高が0の場合は0を入力してください",
          ],
          examples: [
            { label: "現金", value: "150000" },
            { label: "売掛金", value: "300000" },
            { label: "買掛金", value: "-200000" },
            { label: "売上", value: "-500000" },
          ],
        };

      default:
        return {
          title: "回答方法",
          content: ["問題の指示に従って回答してください。"],
          examples: [],
        };
    }
  };

  const guide = getGuideContent();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>💡 {guide.title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 入力方法</Text>
              {guide.content.map((item, index) => (
                <Text key={index} style={styles.contentText}>
                  {item}
                </Text>
              ))}
            </View>

            {guide.examples.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 入力例</Text>
                <View style={styles.exampleContainer}>
                  {guide.examples.map((example, index) => (
                    <View key={index} style={styles.exampleRow}>
                      <Text style={styles.exampleLabel}>{example.label}:</Text>
                      <Text style={styles.exampleValue}>{example.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ 注意事項</Text>
              <Text style={styles.contentText}>
                • 必須項目（*マーク）は必ず入力してください
              </Text>
              <Text style={styles.contentText}>
                • 入力内容に誤りがある場合はエラーメッセージが表示されます
              </Text>
              <Text style={styles.contentText}>
                • 解答送信前に入力内容を確認してください
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>理解しました</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Theme-aware styles function for dark mode support
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 15,
      maxHeight: "80%",
      width: "100%",
      maxWidth: 400,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    closeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    content: {
      maxHeight: 400,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 10,
    },
    contentText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 5,
    },
    exampleContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      padding: 15,
    },
    exampleRow: {
      flexDirection: "row",
      marginBottom: 8,
    },
    exampleLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      minWidth: 80,
    },
    exampleValue: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: "monospace",
      backgroundColor: theme.colors.infoBackground,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      margin: 20,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    confirmButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
