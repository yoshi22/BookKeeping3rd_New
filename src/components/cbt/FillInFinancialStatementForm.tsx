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

// 旧形式（Q3_FS_001-005）: itemsを直接持つ
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

// セクション定義（新形式用）
interface FinancialStatementSection {
  title: string;
  items: Array<{
    label: string | null;
    amount: number | null;
    indent: number;
    order: number;
    isBold?: boolean;
  }>;
}

// 新形式（Q3_FS_006、008、010、012、014）: sections配列を持つ
interface FinancialStatementTemplateWithSections {
  id: string;
  type: string;
  statementType: "income_statement" | "balance_sheet";
  date: string;
  sections: FinancialStatementSection[];
  blanks: Array<{
    sectionIndex: number;
    itemIndex: number;
    field: "label" | "amount";
    choices: (string | number)[];
    hint?: string;
  }>;
  context?: string;
}

// 損益計算書データ（comprehensive用）
interface IncomeStatementData {
  items: Array<{
    label: string | null;
    amount: number | null;
    indent: number;
    order: number;
    isBold?: boolean;
  }>;
}

// 貸借対照表データ（comprehensive用）
interface BalanceSheetData {
  sections: FinancialStatementSection[];
}

// Comprehensive形式（Q3_FS_015）: 損益計算書と貸借対照表を両方含む
interface FinancialStatementTemplateComprehensive {
  id: string;
  type: string;
  statementType: "comprehensive";
  date: string;
  incomeStatement: IncomeStatementData;
  balanceSheet: BalanceSheetData;
  blanks: Array<{
    statementType: "incomeStatement" | "balanceSheet";
    sectionIndex?: number;
    itemIndex: number;
    field: "label" | "amount";
    choices: (string | number)[];
    hint?: string;
  }>;
  context?: string;
}

// 全ての形式を統合したUnion型
type FinancialStatementTemplateUnion =
  | FinancialStatementTemplate
  | FinancialStatementTemplateWithSections
  | FinancialStatementTemplateComprehensive;

export default function FillInFinancialStatementForm({
  question,
  initialAnswer = {},
  onAnswerChange,
  disabled = false,
}: FillInFinancialStatementFormProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const [template, setTemplate] =
    useState<FinancialStatementTemplateUnion | null>(null);
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

  // 問題変更や親からの初期解答更新が入ったら必ずリセット
  useEffect(() => {
    setSelectedAnswers(initialAnswer);
    console.log(
      `[FillInFinancialStatementForm] Answer reset for question ${question.id}`,
    );
  }, [question.id, initialAnswer]);

  // 選択肢が選択されたときの処理
  const handleBlankSelect = (blankIndex: number, choiceIndex: number) => {
    const newAnswers = {
      ...selectedAnswers,
      [blankIndex]: choiceIndex,
    };
    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  // 型ガード: sections配列を持つ新形式かチェック
  const hasSections = (
    t: FinancialStatementTemplateUnion,
  ): t is FinancialStatementTemplateWithSections => {
    return "sections" in t && Array.isArray(t.sections);
  };

  // 型ガード: comprehensive形式かチェック
  const isComprehensive = (
    t: FinancialStatementTemplateUnion,
  ): t is FinancialStatementTemplateComprehensive => {
    return t.statementType === "comprehensive";
  };

  // 財務諸表タイトル取得
  const getStatementTitle = () => {
    if (!template) return "";
    if (isComprehensive(template)) return "財務諸表";
    return template.statementType === "income_statement"
      ? "損益計算書"
      : "貸借対照表";
  };

  // Comprehensive: 損益計算書の描画
  const renderComprehensiveIncomeStatement = (
    template: FinancialStatementTemplateComprehensive,
  ) => {
    const sortedItems = [...template.incomeStatement.items].sort(
      (a, b) => a.order - b.order,
    );

    return sortedItems.map((item, itemIndex) => {
      const originalIndex = template.incomeStatement.items.findIndex(
        (i) => i.order === item.order,
      );

      // この項目に関連する空欄を探す（statementType: "incomeStatement"）
      const labelBlank = template.blanks.find(
        (b) =>
          b.statementType === "incomeStatement" &&
          b.itemIndex === originalIndex &&
          b.field === "label",
      );

      const amountBlank = template.blanks.find(
        (b) =>
          b.statementType === "incomeStatement" &&
          b.itemIndex === originalIndex &&
          b.field === "amount",
      );

      const indentMargin = item.indent * 24;

      return (
        <View
          key={`income-${itemIndex}`}
          style={[
            styles.statementItem,
            { marginLeft: indentMargin },
            item.isBold && styles.statementItemBold,
          ]}
        >
          {/* ラベル部分 */}
          <View style={styles.labelContainer}>
            {item.label === null && labelBlank ? (
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

  // Comprehensive: 貸借対照表の描画
  const renderComprehensiveBalanceSheet = (
    template: FinancialStatementTemplateComprehensive,
  ) => {
    return template.balanceSheet.sections.map((section, sectionIndex) => {
      const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

      return (
        <View
          key={`balance-section-${sectionIndex}`}
          style={styles.sectionContainer}
        >
          {/* セクションタイトル */}
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {/* セクション内の項目 */}
          {sortedItems.map((item, itemIndex) => {
            const originalIndex = section.items.findIndex(
              (i) => i.order === item.order,
            );

            // この項目に関連する空欄を探す（statementType: "balanceSheet"）
            const labelBlank = template.blanks.find(
              (b) =>
                b.statementType === "balanceSheet" &&
                b.sectionIndex === sectionIndex &&
                b.itemIndex === originalIndex &&
                b.field === "label",
            );

            const amountBlank = template.blanks.find(
              (b) =>
                b.statementType === "balanceSheet" &&
                b.sectionIndex === sectionIndex &&
                b.itemIndex === originalIndex &&
                b.field === "amount",
            );

            const indentMargin = item.indent * 24;

            return (
              <View
                key={`balance-${sectionIndex}-${itemIndex}`}
                style={[
                  styles.statementItem,
                  { marginLeft: indentMargin },
                  item.isBold && styles.statementItemBold,
                ]}
              >
                {/* ラベル部分 */}
                <View style={styles.labelContainer}>
                  {item.label === null && labelBlank ? (
                    <BlankSelector
                      blankIndex={template.blanks.indexOf(labelBlank)}
                      choices={labelBlank.choices}
                      selectedIndex={
                        selectedAnswers[template.blanks.indexOf(labelBlank)] ??
                        null
                      }
                      onSelect={handleBlankSelect}
                      hint={labelBlank.hint}
                      placeholder="項目名を選択"
                      disabled={disabled}
                      buttonStyle={styles.labelBlankButton}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.labelText,
                        item.isBold && styles.labelTextBold,
                      ]}
                    >
                      {item.label}
                    </Text>
                  )}
                </View>

                {/* 金額部分 */}
                <View style={styles.amountContainer}>
                  {item.amount === null && amountBlank ? (
                    <BlankSelector
                      blankIndex={template.blanks.indexOf(amountBlank)}
                      choices={amountBlank.choices}
                      selectedIndex={
                        selectedAnswers[template.blanks.indexOf(amountBlank)] ??
                        null
                      }
                      onSelect={handleBlankSelect}
                      hint={amountBlank.hint}
                      placeholder="金額を選択"
                      disabled={disabled}
                      buttonStyle={styles.amountBlankButton}
                    />
                  ) : (
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
          })}
        </View>
      );
    });
  };

  // セクション付き項目の描画（新形式: Q3_FS_006、008、010、012、014）
  const renderSection = (
    section: FinancialStatementSection,
    sectionIndex: number,
  ) => {
    // 順序でソート
    const sortedItems = [...section.items].sort((a, b) => a.order - b.order);

    return (
      <View key={`section-${sectionIndex}`} style={styles.sectionContainer}>
        {/* セクションタイトル */}
        <Text style={styles.sectionTitle}>{section.title}</Text>

        {/* セクション内の項目 */}
        {sortedItems.map((item, itemIndex) => {
          const originalIndex = section.items.findIndex(
            (i) => i.order === item.order,
          );

          // このセクション・項目に関連する空欄を探す
          const labelBlank =
            template && hasSections(template)
              ? template.blanks.find(
                  (b) =>
                    b.sectionIndex === sectionIndex &&
                    b.itemIndex === originalIndex &&
                    b.field === "label",
                )
              : null;

          const amountBlank =
            template && hasSections(template)
              ? template.blanks.find(
                  (b) =>
                    b.sectionIndex === sectionIndex &&
                    b.itemIndex === originalIndex &&
                    b.field === "amount",
                )
              : null;

          // インデントレベルに応じたマージン
          const indentMargin = item.indent * 24;

          return (
            <View
              key={`${sectionIndex}-${itemIndex}`}
              style={[
                styles.statementItem,
                { marginLeft: indentMargin },
                item.isBold && styles.statementItemBold,
              ]}
            >
              {/* ラベル部分 */}
              <View style={styles.labelContainer}>
                {item.label === null && labelBlank ? (
                  <BlankSelector
                    blankIndex={
                      template && hasSections(template)
                        ? template.blanks.indexOf(labelBlank)
                        : 0
                    }
                    choices={labelBlank.choices}
                    selectedIndex={
                      selectedAnswers[
                        template && hasSections(template)
                          ? template.blanks.indexOf(labelBlank)
                          : 0
                      ] ?? null
                    }
                    onSelect={handleBlankSelect}
                    hint={labelBlank.hint}
                    placeholder="項目名を選択"
                    disabled={disabled}
                    buttonStyle={styles.labelBlankButton}
                  />
                ) : (
                  <Text
                    style={[
                      styles.labelText,
                      item.isBold && styles.labelTextBold,
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </View>

              {/* 金額部分 */}
              <View style={styles.amountContainer}>
                {item.amount === null && amountBlank ? (
                  <BlankSelector
                    blankIndex={
                      template && hasSections(template)
                        ? template.blanks.indexOf(amountBlank)
                        : 0
                    }
                    choices={amountBlank.choices}
                    selectedIndex={
                      selectedAnswers[
                        template && hasSections(template)
                          ? template.blanks.indexOf(amountBlank)
                          : 0
                      ] ?? null
                    }
                    onSelect={handleBlankSelect}
                    hint={amountBlank.hint}
                    placeholder="金額を選択"
                    disabled={disabled}
                    buttonStyle={styles.amountBlankButton}
                  />
                ) : (
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
        })}
      </View>
    );
  };

  // 財務諸表項目の描画
  const renderFinancialStatementItems = () => {
    if (!template) return null;

    // Comprehensive形式の処理（Q3_FS_015）
    if (isComprehensive(template)) {
      return (
        <View>
          {/* 損益計算書セクション */}
          <View style={styles.comprehensiveSection}>
            <Text style={styles.comprehensiveSectionTitle}>損益計算書</Text>
            <View style={styles.itemsContainer}>
              {renderComprehensiveIncomeStatement(template)}
            </View>
          </View>

          {/* 貸借対照表セクション */}
          <View style={styles.comprehensiveSection}>
            <Text style={styles.comprehensiveSectionTitle}>貸借対照表</Text>
            <View style={styles.itemsContainer}>
              {renderComprehensiveBalanceSheet(template)}
            </View>
          </View>
        </View>
      );
    }

    // セクション構造の処理（Q3_FS_006、008、010、012、014）
    if (hasSections(template)) {
      return (
        <View style={styles.itemsContainer}>
          {template.sections.map((section, index) =>
            renderSection(section, index),
          )}
        </View>
      );
    }

    // 旧形式の処理（Q3_FS_001-005）
    if (!template.items) return null;

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
      fontSize: 12,
      color: theme.colors.text,
      fontFamily: "monospace",
      textAlign: "right",
    },
    amountTextBold: {
      fontWeight: "bold",
      fontSize: 13,
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

    // セクション構造用スタイル（新形式）
    sectionContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },

    // Comprehensive形式用スタイル
    comprehensiveSection: {
      marginBottom: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 16,
      ...theme.shadows.small,
    },
    comprehensiveSectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 12,
      textAlign: "center",
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
  });
