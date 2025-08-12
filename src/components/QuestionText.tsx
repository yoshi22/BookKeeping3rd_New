/**
 * 問題文表示コンポーネント
 * Step 2.1.5: 問題文・解説表示コンポーネント実装
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

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

  // 難易度に応じたスタイルを取得
  const getDifficultyStyle = (level: number) => {
    switch (level) {
      case 1:
        return { color: "#4caf50", text: "基礎" }; // 緑
      case 2:
        return { color: "#ff9800", text: "標準" }; // オレンジ
      case 3:
        return { color: "#f44336", text: "応用" }; // 赤
      case 4:
        return { color: "#9c27b0", text: "発展" }; // 紫
      case 5:
        return { color: "#e91e63", text: "最高" }; // ピンク
      default:
        return { color: "#757575", text: "不明" }; // グレー
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
        {questionId && <Text style={styles.questionId}>{questionId}</Text>}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  questionId: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  difficultyContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
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
    color: "#333",
    padding: 20,
    textAlign: "left",
  },
  questionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 15,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  journalTable: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  journalHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  journalHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 12,
  },
  debitHeader: {
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  creditHeader: {
    // 貸方ヘッダー専用スタイル（現在は空）
  },
  journalRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 60,
  },
  journalCell: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  entryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    fontStyle: "italic",
  },
});
