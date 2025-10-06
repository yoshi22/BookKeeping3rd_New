/**
 * 試算表穴埋め問題フォーム
 * Q3_TB_001-020に対応（20問）
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  type Theme,
} from "../../context/ThemeContext";
import BlankSelector from "./BlankSelector";
import AccountTable, { TableColumn, TableRow, TableCell } from "./AccountTable";

export interface FillInTrialBalanceFormProps {
  /** 問題データ */
  question: {
    id: string;
    question_text: string;
    answer_template_json: string;
    correct_answer_json: string;
  };
  /** 初期解答値（復元用） */
  initialAnswer?: Record<number, number>;
  /** 解答変更時のコールバック */
  onAnswerChange?: (answer: Record<number, number>) => void;
  /** 無効化フラグ */
  disabled?: boolean;
}

interface TrialBalanceTemplate {
  id: string;
  type: string;
  subType: string;
  initialBalances: Record<string, { side: "debit" | "credit"; amount: number }>;
  transactions: Array<{
    description: string;
    accounts: Array<{
      account: string;
      side: "debit" | "credit";
      amount: number;
    }>;
  }>;
  trialBalance: Array<{
    account: string;
    debitBalance: number | null;
    creditBalance: number | null;
    blankIndex?: number;
  }>;
  blanks: Array<{
    index: number;
    choices: number[];
    hint?: string;
  }>;
}

export default function FillInTrialBalanceForm({
  question,
  initialAnswer = {},
  onAnswerChange,
  disabled = false,
}: FillInTrialBalanceFormProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const [template, setTemplate] = useState<TrialBalanceTemplate | null>(null);
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, number>>(initialAnswer);

  // テンプレートデータのパース
  useEffect(() => {
    try {
      const parsed = JSON.parse(question.answer_template_json);
      setTemplate(parsed);
    } catch (error) {
      console.error("Failed to parse answer template:", error);
    }
  }, [question.answer_template_json]);

  // 選択肢が選択されたときの処理
  const handleBlankSelect = (blankIndex: number, choiceIndex: number) => {
    const newAnswers = {
      ...selectedAnswers,
      [blankIndex]: choiceIndex,
    };
    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  // 初期残高セクションの描画
  const renderInitialBalances = () => {
    if (!template?.initialBalances) return null;

    const balanceEntries = Object.entries(template.initialBalances);
    if (balanceEntries.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 期首残高</Text>
        <View style={styles.balancesContainer}>
          {balanceEntries.map(([account, balance]) => (
            <View key={account} style={styles.balanceItem}>
              <Text style={styles.accountName}>{account}</Text>
              <View style={styles.balanceAmountContainer}>
                <Text style={styles.balanceSide}>
                  {balance.side === "debit" ? "借方" : "貸方"}
                </Text>
                <Text style={styles.balanceAmount}>
                  {balance.amount.toLocaleString("ja-JP")}円
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // 取引セクションの描画
  const renderTransactions = () => {
    if (!template?.transactions || template.transactions.length === 0)
      return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 期中取引</Text>
        <View style={styles.transactionsContainer}>
          {template.transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text style={styles.transactionNumber}>取引{index + 1}:</Text>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // 試算表テーブルの描画
  const renderTrialBalanceTable = () => {
    if (!template?.trialBalance) return null;

    // テーブル列定義
    const columns: TableColumn[] = [
      { key: "account", header: "勘定科目", flex: 2, alignRight: false },
      { key: "debit", header: "借方", flex: 1.5, alignRight: true },
      { key: "credit", header: "貸方", flex: 1.5, alignRight: true },
    ];

    // テーブル行データ作成
    const rows: TableRow[] = template.trialBalance.map((entry, rowIndex) => {
      const blankInfo =
        entry.blankIndex !== undefined
          ? template.blanks.find((b) => b.index === entry.blankIndex)
          : null;

      // 借方セル
      const debitCell: TableCell =
        entry.debitBalance === null && blankInfo
          ? {
              value: (
                <BlankSelector
                  blankIndex={blankInfo.index}
                  choices={blankInfo.choices}
                  selectedIndex={selectedAnswers[blankInfo.index] ?? null}
                  onSelect={handleBlankSelect}
                  hint={blankInfo.hint}
                  placeholder="選択"
                  disabled={disabled}
                />
              ),
            }
          : {
              value: entry.debitBalance ?? 0,
              bold: entry.debitBalance !== null && entry.debitBalance > 0,
            };

      // 貸方セル
      const creditCell: TableCell =
        entry.creditBalance === null && blankInfo
          ? {
              value: (
                <BlankSelector
                  blankIndex={blankInfo.index}
                  choices={blankInfo.choices}
                  selectedIndex={selectedAnswers[blankInfo.index] ?? null}
                  onSelect={handleBlankSelect}
                  hint={blankInfo.hint}
                  placeholder="選択"
                  disabled={disabled}
                />
              ),
            }
          : {
              value: entry.creditBalance ?? 0,
              bold: entry.creditBalance !== null && entry.creditBalance > 0,
            };

      return {
        key: `row-${rowIndex}`,
        cells: {
          account: {
            value: entry.account,
            bold: true,
          },
          debit: debitCell,
          credit: creditCell,
        },
      };
    });

    return (
      <View style={styles.section}>
        <AccountTable
          title="残高試算表"
          columns={columns}
          rows={rows}
          containerStyle={styles.tableContainer}
        />
      </View>
    );
  };

  if (!template) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>問題データの読み込みに失敗しました</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        {/* 問題文（もしあれば） */}
        {question.question_text && (
          <View style={styles.section}>
            <Text style={styles.questionText}>{question.question_text}</Text>
          </View>
        )}

        {/* 期首残高 */}
        {renderInitialBalances()}

        {/* 期中取引 */}
        {renderTransactions()}

        {/* 試算表（穴埋め） */}
        {renderTrialBalanceTable()}

        {/* 説明テキスト */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionIcon}>💡</Text>
          <Text style={styles.instructionText}>
            上記の取引を記帳した後の残高試算表を完成させてください。空欄に適切な金額を選択してください。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    questionText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },

    // 期首残高スタイル
    balancesContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      ...theme.shadows.small,
    },
    balanceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    accountName: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
    },
    balanceAmountContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    balanceSide: {
      fontSize: 13,
      color: theme.colors.text,
      backgroundColor: theme.colors.backgroundSecondary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      fontWeight: "600",
    },
    balanceAmount: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.colors.primary,
      fontFamily: "monospace",
    },

    // 取引スタイル
    transactionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      ...theme.shadows.small,
    },
    transactionItem: {
      flexDirection: "row",
      marginBottom: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    transactionNumber: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginRight: 8,
      minWidth: 50,
    },
    transactionDescription: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 20,
    },

    // テーブルコンテナ
    tableContainer: {
      marginTop: 8,
    },

    // 説明スタイル
    instructionContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.backgroundSecondary,
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      marginTop: 8,
    },
    instructionIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    instructionText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      fontWeight: "500",
    },

    // エラースタイル
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 32,
    },
  });
