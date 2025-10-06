/**
 * 合計残高試算表穴埋め問題フォーム
 * Q3_CTB_001-015に対応（15問）
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

export interface FillInComprehensiveTrialBalanceFormProps {
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

interface ComprehensiveTrialBalanceTemplate {
  id: string;
  type: string;
  date: string;
  title: string;
  accounts: Array<{
    name: string;
    debitTotal: number | null;
    creditTotal: number | null;
    debitBalance: number | null;
    creditBalance: number | null;
    order: number;
  }>;
  blanks: Array<{
    accountIndex: number;
    column: "debitTotal" | "creditTotal" | "debitBalance" | "creditBalance";
    choices: number[];
    hint?: string;
  }>;
  context?: string;
}

export default function FillInComprehensiveTrialBalanceForm({
  question,
  initialAnswer = {},
  onAnswerChange,
  disabled = false,
}: FillInComprehensiveTrialBalanceFormProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const [template, setTemplate] =
    useState<ComprehensiveTrialBalanceTemplate | null>(null);
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

  // 合計残高試算表テーブルの描画
  const renderComprehensiveTrialBalanceTable = () => {
    if (!template?.accounts) return null;

    // テーブル列定義（5列構成）
    const columns: TableColumn[] = [
      { key: "account", header: "勘定科目", flex: 2, alignRight: false },
      { key: "debitTotal", header: "借方合計", flex: 1.5, alignRight: true },
      { key: "creditTotal", header: "貸方合計", flex: 1.5, alignRight: true },
      { key: "debitBalance", header: "借方残高", flex: 1.5, alignRight: true },
      {
        key: "creditBalance",
        header: "貸方残高",
        flex: 1.5,
        alignRight: true,
      },
    ];

    // 勘定科目を順序でソート
    const sortedAccounts = [...template.accounts].sort(
      (a, b) => a.order - b.order,
    );

    // テーブル行データ作成
    const rows: TableRow[] = sortedAccounts.map((account, rowIndex) => {
      // この勘定科目に関連する空欄を探す
      const findBlankForColumn = (
        column: "debitTotal" | "creditTotal" | "debitBalance" | "creditBalance",
      ) => {
        const originalIndex = template.accounts.findIndex(
          (a) => a.name === account.name,
        );
        return template.blanks.find(
          (b) => b.accountIndex === originalIndex && b.column === column,
        );
      };

      // 各列のセルを作成
      const createCell = (
        value: number | null,
        column: "debitTotal" | "creditTotal" | "debitBalance" | "creditBalance",
      ): TableCell => {
        const blankInfo = findBlankForColumn(column);

        if (value === null && blankInfo) {
          // 空欄の場合はBlankSelectorを埋め込む
          const blankIndex = template.blanks.indexOf(blankInfo);
          return {
            value: (
              <BlankSelector
                blankIndex={blankIndex}
                choices={blankInfo.choices}
                selectedIndex={selectedAnswers[blankIndex] ?? null}
                onSelect={handleBlankSelect}
                hint={blankInfo.hint}
                placeholder="選択"
                disabled={disabled}
              />
            ),
          };
        } else {
          // 通常の数値セルまたは0
          return {
            value: value ?? 0,
            bold: value !== null && value > 0,
          };
        }
      };

      return {
        key: `row-${rowIndex}`,
        cells: {
          account: {
            value: account.name,
            bold: true,
          },
          debitTotal: createCell(account.debitTotal, "debitTotal"),
          creditTotal: createCell(account.creditTotal, "creditTotal"),
          debitBalance: createCell(account.debitBalance, "debitBalance"),
          creditBalance: createCell(account.creditBalance, "creditBalance"),
        },
      };
    });

    return (
      <View style={styles.section}>
        <AccountTable
          title={template.title || "合計残高試算表"}
          columns={columns}
          rows={rows}
          containerStyle={styles.tableContainer}
        />
        {template.date && <Text style={styles.dateText}>{template.date}</Text>}
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

        {/* コンテキスト説明 */}
        {template.context && (
          <View style={styles.contextContainer}>
            <Text style={styles.contextIcon}>📌</Text>
            <Text style={styles.contextText}>{template.context}</Text>
          </View>
        )}

        {/* 合計残高試算表（穴埋め） */}
        {renderComprehensiveTrialBalanceTable()}

        {/* 説明テキスト */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionIcon}>💡</Text>
          <Text style={styles.instructionText}>
            合計残高試算表の空欄に適切な金額を選択してください。借方合計・貸方合計から残高を計算する問題です。
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
    questionText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },

    // コンテキスト説明スタイル
    contextContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      ...theme.shadows.small,
    },
    contextIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    contextText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      fontWeight: "600",
    },

    // テーブルコンテナ
    tableContainer: {
      marginTop: 8,
    },

    // 日付スタイル
    dateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "right",
      marginTop: 8,
      fontStyle: "italic",
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
    },

    // エラースタイル
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 32,
    },
  });
