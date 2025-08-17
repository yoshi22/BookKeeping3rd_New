/**
 * 問題文表示コンポーネント
 * Step 2.1.5: 問題文・解説表示コンポーネント実装
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../context/ThemeContext";

// レンダリング状態追跡用のグローバルMap - より確実な重複防止
const renderingInstances = new Map<
  string,
  { count: number; renderedAt: number }
>();

interface QuestionTextProps {
  questionText: string;
  questionId?: string;
  difficulty?: number;
  showDifficulty?: boolean;
}

export default function QuestionText({
  questionText,
  questionId,
  difficulty,
  showDifficulty = true,
}: QuestionTextProps) {
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  // 重複レンダリング防止 - 改善版
  const instanceIdRef = useRef<string>();
  const shouldRender = useRef<boolean>(true);
  const renderAttemptTime = useRef<number>(Date.now());

  // より堅牢な重複防止: 時間ベースとカウントベースの組み合わせ
  if (questionId && !instanceIdRef.current) {
    const now = Date.now();
    const existing = renderingInstances.get(questionId);

    if (existing && now - existing.renderedAt < 100) {
      // 100ms以内の再レンダリングは重複とみなす
      existing.count += 1;
      console.warn(
        `[QuestionText] 重複検出 (${existing.count}回目) - レンダリングをスキップ: ${questionId}`,
        { timeDiff: now - existing.renderedAt, existingCount: existing.count },
      );
      shouldRender.current = false;
    } else {
      // 新しいインスタンスまたは十分時間が経過した再レンダリング
      instanceIdRef.current = Math.random().toString(36).substr(2, 9);
      renderAttemptTime.current = now;
      renderingInstances.set(questionId, { count: 1, renderedAt: now });
      shouldRender.current = true;

      console.log(`[QuestionText] インスタンス登録: ${questionId}`, {
        instanceId: instanceIdRef.current,
        isFirstRender: !existing,
        totalInstances: renderingInstances.size,
      });
    }
  }

  useEffect(() => {
    // クリーンアップのみ - インスタンス削除
    return () => {
      if (questionId && instanceIdRef.current) {
        // 遅延削除: 即座に削除せず、少し待ってから削除して安定性を向上
        setTimeout(() => {
          const existing = renderingInstances.get(questionId);
          if (existing && existing.count <= 1) {
            renderingInstances.delete(questionId);
            console.log(`[QuestionText] インスタンス削除: ${questionId}`, {
              instanceId: instanceIdRef.current,
              remainingInstances: renderingInstances.size,
            });
          } else if (existing) {
            existing.count -= 1;
            console.log(
              `[QuestionText] インスタンスカウント減少: ${questionId}`,
              {
                remainingCount: existing.count,
              },
            );
          }
        }, 50);
      }
    };
  }, [questionId]);

  // 重複の場合は何もレンダリングしない
  if (!shouldRender.current) {
    return null;
  }
  // 改行や特殊文字を適切に表示するためのフォーマット
  const formatQuestionText = (text: string): string => {
    return text
      .replace(/\\n/g, "\n") // エスケープされた改行を実際の改行に変換
      .trim();
  };

  // 試算表問題の仕訳を借方・貸方の2列に分けて表示するかどうか判定
  const isTrialBalanceProblem = (text: string, id?: string): boolean => {
    return (
      (id && id.startsWith("Q_T_")) ||
      text.includes("試算表") ||
      text.includes("決算整理後試算表")
    );
  };

  // 仕訳行を抽出して2列表示用にフォーマット
  const formatJournalEntries = (text: string) => {
    const lines = text.split("\n");
    const journalEntries: Array<{
      date: string;
      debit: string;
      credit: string;
      description: string;
    }> = [];
    let currentSection = "";

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // セクションヘッダーを検出
      if (trimmedLine.startsWith("【") && trimmedLine.endsWith("】")) {
        currentSection = trimmedLine;
        return;
      }

      // 仕訳行を検出（日付 勘定科目 金額 / 勘定科目 金額 (摘要)の形式）
      const journalMatch = trimmedLine.match(
        /^(\d+月\d+日)\s+(.+?)\s+([0-9,]+)\s+\/\s+(.+?)\s+([0-9,]+)\s+（(.+?)）$/,
      );
      if (journalMatch) {
        const [
          ,
          date,
          debitAccount,
          debitAmount,
          creditAccount,
          creditAmount,
          description,
        ] = journalMatch;
        journalEntries.push({
          date,
          debit: `${debitAccount} ${debitAmount.replace(/,/g, ",")}`,
          credit: `${creditAccount} ${creditAmount.replace(/,/g, ",")}`,
          description,
        });
      }

      // 決算整理仕訳行も検出（・で始まる行の場合）
      const adjustmentMatch = trimmedLine.match(
        /^・(.+?)：(.+?)\s+([0-9,]+)\s+\/\s+(.+?)\s+([0-9,]+)$/,
      );
      if (adjustmentMatch) {
        const [
          ,
          description,
          debitAccount,
          debitAmount,
          creditAccount,
          creditAmount,
        ] = adjustmentMatch;
        journalEntries.push({
          date: "",
          debit: `${debitAccount} ${debitAmount.replace(/,/g, ",")}`,
          credit: `${creditAccount} ${creditAmount.replace(/,/g, ",")}`,
          description,
        });
      }
    });

    return { journalEntries, otherContent: text };
  };

  // 難易度に応じたスタイルを取得（テーマ対応）
  const getDifficultyStyle = (level: number) => {
    switch (level) {
      case 1:
        return { color: theme.colors.success, text: "基礎" }; // 緑
      case 2:
        return { color: theme.colors.warning, text: "標準" }; // オレンジ
      case 3:
        return { color: theme.colors.error, text: "応用" }; // 赤
      case 4:
        return { color: theme.colors.secondary, text: "発展" }; // 紫
      case 5:
        return { color: theme.colors.accent, text: "最高" }; // ピンク
      default:
        return { color: theme.colors.textSecondary, text: "不明" }; // グレー
    }
  };

  const difficultyInfo = difficulty ? getDifficultyStyle(difficulty) : null;
  const isTrialBalance = isTrialBalanceProblem(questionText, questionId);
  const { journalEntries } = formatJournalEntries(questionText);

  // 仕訳を2列で表示するコンポーネント
  const renderJournalEntriesTable = () => (
    <View style={styles.journalTable}>
      <View style={styles.journalHeader}>
        <Text style={[styles.journalHeaderText, styles.debitHeader]}>借方</Text>
        <Text style={[styles.journalHeaderText, styles.creditHeader]}>
          貸方
        </Text>
      </View>
      {journalEntries.map((entry, index) => (
        <View key={index} style={styles.journalRow}>
          <View style={styles.journalCell}>
            <Text style={styles.dateText}>{entry.date}</Text>
            <Text style={styles.entryText}>{entry.debit}</Text>
          </View>
          <View style={styles.journalCell}>
            <Text style={styles.entryText}>{entry.credit}</Text>
            <Text style={styles.descriptionText}>（{entry.description}）</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 問題ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>問題</Text>
        {showDifficulty && difficultyInfo && (
          <View style={styles.difficultyContainer}>
            <Text
              style={[styles.difficultyText, { color: difficultyInfo.color }]}
            >
              {difficultyInfo.text}
            </Text>
          </View>
        )}
      </View>

      {/* 問題文 */}
      <ScrollView
        style={styles.textContainer}
        showsVerticalScrollIndicator={false}
      >
        {isTrialBalance && journalEntries.length > 0 ? (
          <View style={styles.questionContent}>
            <Text style={styles.questionText}>
              {formatQuestionText(questionText).split("【期中取引】")[0].trim()}
            </Text>

            {/* 期中取引セクション */}
            <Text style={styles.sectionTitle}>【期中取引】</Text>
            {renderJournalEntriesTable()}

            {/* 残りのセクション（決算整理事項など） */}
            {formatQuestionText(questionText).includes("【決算整理事項】") && (
              <>
                <Text style={styles.sectionTitle}>【決算整理事項】</Text>
                <Text style={styles.questionText}>
                  {formatQuestionText(questionText)
                    .split("【決算整理事項】")[1]
                    .split("【作成指示】")[0]
                    .trim()}
                </Text>
              </>
            )}

            {/* 作成指示セクション */}
            {formatQuestionText(questionText).includes("【作成指示】") && (
              <>
                <Text style={styles.sectionTitle}>【作成指示】</Text>
                <Text style={styles.questionText}>
                  {formatQuestionText(questionText)
                    .split("【作成指示】")[1]
                    .trim()}
                </Text>
              </>
            )}
          </View>
        ) : (
          <Text style={styles.questionText}>
            {formatQuestionText(questionText)}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

// Theme-aware styles function for dark mode support
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
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    questionId: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginRight: 12,
    },
    difficultyContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.borderLight,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    textContainer: {
      maxHeight: 300, // 長い問題文の場合はスクロール可能
    },
    questionText: {
      fontSize: 16,
      lineHeight: 26,
      color: theme.colors.text,
      padding: 20,
      textAlign: "left",
    },
    questionContent: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginTop: 15,
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    journalTable: {
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: 8,
      overflow: "hidden",
      marginHorizontal: 20,
    },
    journalHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.backgroundSecondary,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    journalHeaderText: {
      flex: 1,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      paddingVertical: 12,
    },
    debitHeader: {
      borderRightWidth: 1,
      borderRightColor: theme.colors.borderLight,
    },
    creditHeader: {
      // 貸方ヘッダー専用スタイル（現在は空）
    },
    journalRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      minHeight: 60,
    },
    journalCell: {
      flex: 1,
      padding: 12,
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: theme.colors.borderLight,
    },
    dateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    entryText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "500",
    },
    descriptionText: {
      fontSize: 12,
      color: theme.colors.textDisabled,
      marginTop: 4,
      fontStyle: "italic",
    },
  });
