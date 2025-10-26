/**
 * 財務諸表穴埋め問題フォーム
 * Q3_FS_001-015に対応（15問）
 * 損益計算書・貸借対照表の穴埋め問題
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

export interface FillInFinancialStatementFormProps {
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

interface FinancialStatementTemplate {
  id: string;
  type: string;
  statementType: "income_statement" | "balance_sheet";
  date: string;
  items: Array<{
    label: string | null;
    amount: number | null;
    indent: number;
    order: number;
    isBold?: boolean;
  }>;
  blanks: Array<{
    itemIndex: number;
    field: "label" | "amount";
    choices: (string | number)[];
    hint?: string;
  }>;
  context?: string;
}

export default function FillInFinancialStatementForm({
  question,
  initialAnswer = {},
  onAnswerChange,
  disabled = false,
}: FillInFinancialStatementFormProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const [template, setTemplate] = useState<FinancialStatementTemplate | null>(
    null,
  );
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

  // initialAnswerが変更された時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers(initialAnswer);
    console.log(
      `[FillInFinancialStatementForm] Answer reset for question ${question.id}`,
    );
  }, [initialAnswer, question.id]);

  // 選択肢が選択されたときの処理
  const handleBlankSelect = (blankIndex: number, choiceIndex: number) => {
    const newAnswers = {
      ...selectedAnswers,
      [blankIndex]: choiceIndex,
    };
    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  // 財務諸表タイトル取得
  const getStatementTitle = () => {
    if (!template) return "";
    return template.statementType === "income_statement"
      ? "損益計算書"
      : "貸借対照表";
  };

  // 財務諸表項目の描画
  const renderFinancialStatementItems = () => {
    if (!template?.items) return null;

    // 順序でソート
    const sortedItems = [...template.items].sort((a, b) => a.order - b.order);

    return sortedItems.map((item, index) => {
      // この項目に関連する空欄を探す
      const originalIndex = template.items.findIndex(
        (i) => i.order === item.order,
      );
      const labelBlank = template.blanks.find(
        (b) => b.itemIndex === originalIndex && b.field === "label",
      );
      const amountBlank = template.blanks.find(
        (b) => b.itemIndex === originalIndex && b.field === "amount",
      );

      // インデントレベルに応じたマージン
      const indentMargin = item.indent * 24;

      return (
        <View
          key={index}
          style={[
            styles.statementItem,
            { marginLeft: indentMargin },
            item.isBold && styles.statementItemBold,
          ]}
        >
          {/* ラベル部分 */}
          <View style={styles.labelContainer}>
            {item.label === null && labelBlank ? (
              // ラベルが空欄の場合
              <BlankSelector
                blankIndex={template.blanks.indexOf(labelBlank)}
                choices={labelBlank.choices}
                selectedIndex={
                  selectedAnswers[template.blanks.indexOf(labelBlank)] ?? null
                }
                onSelect={handleBlankSelect}
                hint={labelBlank.hint}
                placeholder="項目名を選択"
                disabled={disabled}
                buttonStyle={styles.labelBlankButton}
              />
            ) : (
              // 通常のラベル表示
              <Text
                style={[styles.labelText, item.isBold && styles.labelTextBold]}
              >
                {item.label}
              </Text>
            )}
          </View>

          {/* 金額部分 */}
          <View style={styles.amountContainer}>
            {item.amount === null && amountBlank ? (
              // 金額が空欄の場合
              <BlankSelector
                blankIndex={template.blanks.indexOf(amountBlank)}
                choices={amountBlank.choices}
                selectedIndex={
                  selectedAnswers[template.blanks.indexOf(amountBlank)] ?? null
                }
                onSelect={handleBlankSelect}
                hint={amountBlank.hint}
                placeholder="金額を選択"
                disabled={disabled}
                buttonStyle={styles.amountBlankButton}
              />
            ) : (
              // 通常の金額表示
              item.amount !== null && (
                <Text
                  style={[
                    styles.amountText,
                    item.isBold && styles.amountTextBold,
                  ]}
                >
                  {item.amount.toLocaleString("ja-JP")}
                </Text>
              )
            )}
          </View>
        </View>
      );
    });
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

        {/* 財務諸表 */}
        <View style={styles.statementContainer}>
          {/* ヘッダー */}
          <View style={styles.statementHeader}>
            <Text style={styles.statementTitle}>{getStatementTitle()}</Text>
            {template.date && (
              <Text style={styles.dateText}>{template.date}</Text>
            )}
          </View>

          {/* 項目リスト */}
          <View style={styles.itemsContainer}>
            {renderFinancialStatementItems()}
          </View>
        </View>

        {/* 説明テキスト */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionIcon}>💡</Text>
          <Text style={styles.instructionText}>
            {template.statementType === "income_statement"
              ? "損益計算書の空欄に適切な項目名または金額を選択してください。売上高から当期純利益までの流れを理解しましょう。"
              : "貸借対照表の空欄に適切な項目名または金額を選択してください。資産・負債・純資産のバランスを確認しましょう。"}
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
      marginBottom: 16,
    },
    questionText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
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

    // 財務諸表コンテナ
    statementContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      overflow: "hidden",
      ...theme.shadows.medium,
      marginBottom: 16,
    },
    statementHeader: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      alignItems: "center",
    },
    statementTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    dateText: {
      fontSize: 13,
      color: "#FFFFFF",
      opacity: 0.9,
    },

    // 項目リストコンテナ
    itemsContainer: {
      padding: 16,
    },

    // 個別項目スタイル
    statementItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      minHeight: 50,
    },
    statementItemBold: {
      backgroundColor: theme.colors.infoBackground,
      marginHorizontal: -8,
      paddingHorizontal: 8,
      borderRadius: 4,
    },

    // ラベルスタイル
    labelContainer: {
      flex: 2,
      marginRight: 12,
    },
    labelText: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 20,
    },
    labelTextBold: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.colors.text,
    },
    labelBlankButton: {
      minHeight: 40,
    },

    // 金額スタイル
    amountContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    amountText: {
      fontSize: 15,
      color: theme.colors.text,
      fontFamily: "monospace",
      textAlign: "right",
    },
    amountTextBold: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.colors.text,
    },
    amountBlankButton: {
      minHeight: 40,
      minWidth: 120, // 金額表示に必要な最小幅を確保
    },

    // 説明スタイル
    instructionContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.infoBackground,
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
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
