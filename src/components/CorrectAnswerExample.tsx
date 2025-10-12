/**
 * 正解例表示コンポーネント
 * 間違った回答後に正解の入力例を表示
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";
import { QuestionCorrectAnswer } from "../types/models";

interface CorrectAnswerExampleProps {
  questionType: "journal" | "ledger" | "trial_balance" | "auxiliary_book";
  correctAnswer: QuestionCorrectAnswer;
  show: boolean;
  questionTemplate?: any; // fill_in_ledger形式の正解表示に必要
}

export default function CorrectAnswerExample({
  questionType,
  correctAnswer,
  show,
  questionTemplate,
}: CorrectAnswerExampleProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // デバッグログ
  console.log("[CorrectAnswerExample] Props:", {
    questionType,
    hasCorrectAnswer: !!correctAnswer,
    correctAnswerKeys: correctAnswer ? Object.keys(correctAnswer) : [],
    hasBlanks: !!correctAnswer?.blanks,
    blanksLength: correctAnswer?.blanks?.length,
    hasQuestionTemplate: !!questionTemplate,
    questionTemplateType: questionTemplate?.type,
    templateBlanksLength: questionTemplate?.blanks?.length,
  });

  if (!show || !correctAnswer) return null;

  const renderJournalExample = () => {
    // 複合仕訳の配列を取得（journalEntries または journalEntry が配列の場合）
    const journalArray =
      correctAnswer.journalEntries &&
      Array.isArray(correctAnswer.journalEntries)
        ? correctAnswer.journalEntries
        : correctAnswer.journalEntry &&
            Array.isArray(correctAnswer.journalEntry)
          ? correctAnswer.journalEntry
          : null;

    // 新形式: journalEntries/journalEntry 配列（複合仕訳対応）
    if (journalArray) {
      // 借方と貸方のエントリを分離
      const debits = journalArray
        .filter((entry: any) => entry.debit_account && entry.debit_amount > 0)
        .map((entry: any) => ({
          account: entry.debit_account,
          amount: entry.debit_amount,
        }));

      const credits = journalArray
        .filter((entry: any) => entry.credit_account && entry.credit_amount > 0)
        .map((entry: any) => ({
          account: entry.credit_account,
          amount: entry.credit_amount,
        }));

      return (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>📝 正解例</Text>
          <View style={styles.journalRow}>
            {/* 借方（左側） */}
            <View style={styles.debitColumn}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnHeaderText}>借方</Text>
              </View>
              {debits.map((debit: any, index: number) => (
                <View key={`debit-${index}`} style={styles.accountRow}>
                  <Text style={styles.accountName}>{debit.account}</Text>
                  <Text style={styles.amount}>
                    {debit.amount?.toLocaleString()}円
                  </Text>
                </View>
              ))}
            </View>

            {/* 貸方（右側） */}
            <View style={styles.creditColumn}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnHeaderText}>貸方</Text>
              </View>
              {credits.map((credit: any, index: number) => (
                <View key={`credit-${index}`} style={styles.accountRow}>
                  <Text style={styles.accountName}>{credit.account}</Text>
                  <Text style={styles.amount}>
                    {credit.amount?.toLocaleString()}円
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 合計表示 */}
          {debits.length > 0 && credits.length > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsText}>
                借方合計:{" "}
                {debits.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                円　 貸方合計:{" "}
                {credits.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                円
              </Text>
            </View>
          )}
        </View>
      );
    }

    // 旧形式: journalEntry 単一オブジェクト（後方互換性）
    // 注: journalEntryが配列の場合は上で処理済み
    const entry = correctAnswer.journalEntry;
    if (!entry || Array.isArray(entry)) return null;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        <View style={styles.journalRow}>
          {/* 借方（左側） */}
          <View style={styles.debitColumn}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>借方</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountName}>{entry.debit_account}</Text>
              <Text style={styles.amount}>
                {entry.debit_amount?.toLocaleString()}
              </Text>
            </View>
          </View>
          {/* 貸方（右側） */}
          <View style={styles.creditColumn}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>貸方</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountName}>{entry.credit_account}</Text>
              <Text style={styles.amount}>
                {entry.credit_amount?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLedgerExample = () => {
    const entry = correctAnswer.ledgerEntry;
    if (!entry?.entries || entry.entries.length === 0) return null;

    const firstEntry = entry.entries[0];

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>日付:</Text>
          <Text style={styles.fieldValue}>4/1</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>摘要:</Text>
          <Text style={styles.fieldValue}>
            {firstEntry.description || "取引内容"}
          </Text>
        </View>
        {firstEntry.amount && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>金額:</Text>
            <Text style={styles.fieldValue}>
              {firstEntry.amount?.toLocaleString()}円
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFillInLedgerExample = () => {
    // fill_in_ledger形式の正解データを表示
    if (!correctAnswer.blanks || !questionTemplate) return null;

    const { blanks: correctBlanks } = correctAnswer;
    const { blanks: templateBlanks, entries } = questionTemplate;

    if (!correctBlanks || !templateBlanks || !entries) return null;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {correctBlanks.map((blank: any, blankArrayIndex: number) => {
          // 配列の順序でマッピング（indexの不一致に対応）
          const templateBlank = templateBlanks[blankArrayIndex];
          const entry = entries[templateBlank.index];

          if (!templateBlank || !entry) return null;

          const correctValue = templateBlank.choices[blank.correctIndex];

          return (
            <View key={`blank-${blankArrayIndex}`} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                空欄{blankArrayIndex + 1} ({entry.date || entry.description}):
              </Text>
              <Text style={styles.fieldValue}>
                {correctValue?.toLocaleString()}円
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderVocabularyExample = () => {
    console.log("[renderVocabularyExample] Called", {
      hasBlanks: !!correctAnswer.blanks,
      hasQuestionTemplate: !!questionTemplate,
      correctBlanks: correctAnswer.blanks,
      templateBlanks: questionTemplate?.blanks,
    });

    // vocabulary形式の正解データを表示
    if (!correctAnswer.blanks || !questionTemplate) {
      console.log("[renderVocabularyExample] Early return - missing data");
      return null;
    }

    const { blanks: correctBlanks } = correctAnswer;
    const { blanks: templateBlanks } = questionTemplate;

    if (!correctBlanks || !templateBlanks) {
      console.log(
        "[renderVocabularyExample] Early return - blanks validation failed",
      );
      return null;
    }

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {correctBlanks.map((blank: any, blankArrayIndex: number) => {
          // 配列の順序でマッピング（indexの不一致に対応）
          const templateBlank = templateBlanks[blankArrayIndex];

          if (!templateBlank) return null;

          const correctValue = templateBlank.choices[blank.correctIndex];

          return (
            <View key={`blank-${blankArrayIndex}`} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                空欄{blankArrayIndex + 1} (①②③の{blankArrayIndex + 1}番目):
              </Text>
              <Text style={styles.fieldValue}>{correctValue}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  /**
   * Q3 fill-in形式（試算表・合計残高試算表・財務諸表）の正解表示
   * blanks形式の問題に対応
   */
  const renderFillInExample = () => {
    console.log("[renderFillInExample] Called", {
      hasBlanks: !!correctAnswer.blanks,
      hasQuestionTemplate: !!questionTemplate,
      correctBlanks: correctAnswer.blanks,
      templateBlanks: questionTemplate?.blanks,
      templateType: questionTemplate?.type,
    });

    // blanks形式の正解データを表示
    if (!correctAnswer.blanks || !questionTemplate) {
      console.log("[renderFillInExample] Early return - missing data");
      return null;
    }

    const { blanks: correctBlanks } = correctAnswer;
    const { blanks: templateBlanks } = questionTemplate;

    if (!correctBlanks || !templateBlanks) {
      console.log(
        "[renderFillInExample] Early return - blanks validation failed",
      );
      return null;
    }

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {correctBlanks.map((blank: any, blankArrayIndex: number) => {
          // 配列の順序でマッピング（indexの不一致に対応）
          const templateBlank = templateBlanks[blankArrayIndex];

          if (!templateBlank) return null;

          const correctValue = templateBlank.choices[blank.correctIndex];

          // 金額の場合はフォーマット、それ以外はそのまま表示
          const displayValue =
            typeof correctValue === "number"
              ? `${correctValue.toLocaleString("ja-JP")}円`
              : correctValue;

          return (
            <View key={`blank-${blankArrayIndex}`} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>空欄{blankArrayIndex + 1}:</Text>
              <Text style={styles.fieldValue}>{displayValue}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderEntriesFromArray = (
    entriesArray: {
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }[],
  ) => {
    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {entriesArray.map((entry: any, index: number) => {
          // 借方金額または貸方金額がある勘定科目のみ表示
          if (entry.debitAmount > 0 && entry.accountName) {
            return (
              <View
                key={`${entry.accountName}-${index}`}
                style={styles.fieldRow}
              >
                <Text style={styles.fieldLabel}>
                  {entry.accountName}（借方）:
                </Text>
                <Text style={styles.fieldValue}>
                  {entry.debitAmount.toLocaleString()}円
                </Text>
              </View>
            );
          } else if (entry.creditAmount > 0 && entry.accountName) {
            return (
              <View
                key={`${entry.accountName}-${index}`}
                style={styles.fieldRow}
              >
                <Text style={styles.fieldLabel}>
                  {entry.accountName}（貸方）:
                </Text>
                <Text style={styles.fieldValue}>
                  {entry.creditAmount.toLocaleString()}円
                </Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderTrialBalanceExample = () => {
    // entriesフォーマットに対応（試算表問題の実際のデータ形式）
    const entries = correctAnswer.entries;
    if (!entries || !Array.isArray(entries)) {
      // financialStatements形式（Q_T_001など）の処理
      const financialStatements = (correctAnswer as any).financialStatements;
      if (financialStatements) {
        const convertedEntries =
          convertFinancialStatementsToEntries(financialStatements);
        if (convertedEntries && convertedEntries.length > 0) {
          return renderEntriesFromArray(convertedEntries);
        }
      }

      // trialBalance.balances形式の場合はオブジェクトを配列に変換
      const balances = correctAnswer.trialBalance?.balances;
      if (balances && typeof balances === "object") {
        const balanceEntries = Object.entries(balances).map(
          ([accountName, amount]) => ({
            accountName,
            debitAmount: amount > 0 ? amount : 0,
            creditAmount: amount < 0 ? Math.abs(amount) : 0,
          }),
        );
        return renderEntriesFromArray(balanceEntries);
      }
      return null;
    }

    // Filter and transform entries to ensure required properties
    const validEntries = entries
      .filter(
        (entry) =>
          entry.accountName &&
          typeof entry.debitAmount === "number" &&
          typeof entry.creditAmount === "number",
      )
      .map((entry) => ({
        accountName: entry.accountName!,
        debitAmount: entry.debitAmount!,
        creditAmount: entry.creditAmount!,
      }));

    return renderEntriesFromArray(validEntries);
  };

  /**
   * 補助簿記入問題の正解表示
   */
  const renderAuxiliaryBookExample = () => {
    console.log("[renderAuxiliaryBookExample] Called with:", {
      correctAnswer,
      correctAnswerKeys: correctAnswer ? Object.keys(correctAnswer) : [],
      questionTemplate,
      questionTemplateKeys: questionTemplate
        ? Object.keys(questionTemplate)
        : [],
    });

    // 補助簿名のマッピング
    const bookNameMapping: Record<string, string> = {
      cash_book: "現金出納帳",
      purchase_book: "仕入帳",
      sales_book: "売上帳",
      inventory_book: "商品有高帳",
      accounts_receivable_ledger: "売掛金元帳",
      accounts_payable_ledger: "買掛金元帳",
    };

    // correctAnswerにcorrectAnswers配列があるか確認
    const correctAnswersArray = (correctAnswer as any).correctAnswers;
    const transactions = questionTemplate?.transactions;

    console.log("[renderAuxiliaryBookExample] Data check:", {
      hasCorrectAnswersArray: !!correctAnswersArray,
      isCorrectAnswersArray: Array.isArray(correctAnswersArray),
      correctAnswersArrayLength: correctAnswersArray?.length,
      hasTransactions: !!transactions,
      isTransactionsArray: Array.isArray(transactions),
      transactionsLength: transactions?.length,
    });

    if (!correctAnswersArray || !Array.isArray(correctAnswersArray)) {
      console.log("[renderAuxiliaryBookExample] No correctAnswers array found");
      return null;
    }

    if (!transactions || !Array.isArray(transactions)) {
      console.log("[renderAuxiliaryBookExample] No transactions found");
      return null;
    }

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {correctAnswersArray.map((answerItem: any, index: number) => {
          const transaction = transactions.find(
            (t: any) => t.index === answerItem.transactionIndex,
          );

          if (!transaction) {
            return null;
          }

          // bookIdsを日本語名に変換
          const bookNames = answerItem.bookIds
            .map((bookId: string) => bookNameMapping[bookId] || bookId)
            .join("、");

          return (
            <View key={`transaction-${index}`} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                取引{answerItem.transactionIndex}: {transaction.description}
              </Text>
              <Text style={styles.fieldValue}>→ {bookNames}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  /**
   * 財務諸表形式のデータを試算表エントリ形式に変換
   */
  const convertFinancialStatementsToEntries = (
    financialStatements: any,
  ): {
    accountName: string;
    debitAmount: number;
    creditAmount: number;
  }[] => {
    const entries: {
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }[] = [];

    // 貸借対照表の資産（借方）
    if (financialStatements.balanceSheet?.assets) {
      for (const asset of financialStatements.balanceSheet.assets) {
        if (asset.amount > 0 && asset.accountName) {
          entries.push({
            accountName: asset.accountName,
            debitAmount: asset.amount,
            creditAmount: 0,
          });
        }
      }
    }

    // 貸借対照表の負債（貸方）
    if (financialStatements.balanceSheet?.liabilities) {
      for (const liability of financialStatements.balanceSheet.liabilities) {
        if (liability.amount > 0 && liability.accountName) {
          entries.push({
            accountName: liability.accountName,
            debitAmount: 0,
            creditAmount: liability.amount,
          });
        }
      }
    }

    // 貸借対照表の純資産（貸方）
    if (financialStatements.balanceSheet?.equity) {
      for (const equity of financialStatements.balanceSheet.equity) {
        // 当期純損失は借方
        if (equity.accountName === "当期純損失" && equity.amount > 0) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: equity.amount,
            creditAmount: 0,
          });
        } else if (equity.amount > 0 && equity.accountName) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: 0,
            creditAmount: equity.amount,
          });
        }
      }
    }

    // 損益計算書の収益（貸方）
    if (financialStatements.incomeStatement?.revenues) {
      for (const revenue of financialStatements.incomeStatement.revenues) {
        if (revenue.amount > 0 && revenue.accountName) {
          entries.push({
            accountName:
              revenue.accountName === "売上高" ? "売上" : revenue.accountName,
            debitAmount: 0,
            creditAmount: revenue.amount,
          });
        }
      }
    }

    // 損益計算書の費用（借方）
    if (financialStatements.incomeStatement?.expenses) {
      for (const expense of financialStatements.incomeStatement.expenses) {
        // 保険料が0の場合はスキップ
        if (expense.amount > 0 && expense.accountName) {
          entries.push({
            accountName: expense.accountName,
            debitAmount: expense.amount,
            creditAmount: 0,
          });
        }
      }
    }

    return entries;
  };

  const renderExample = () => {
    console.log("[renderExample] Routing decision:", {
      questionType,
      hasBlanks: !!correctAnswer.blanks,
      templateType: questionTemplate?.type,
      willUseVocabulary:
        questionType === "ledger" &&
        correctAnswer.blanks &&
        questionTemplate?.type === "vocabulary",
      willUseFillInLedger:
        questionType === "ledger" &&
        correctAnswer.blanks &&
        questionTemplate?.type === "fill_in_ledger",
    });

    switch (questionType) {
      case "journal":
        console.log("[renderExample] Using renderJournalExample");
        return renderJournalExample();
      case "ledger":
        // vocabulary形式の場合
        if (correctAnswer.blanks && questionTemplate?.type === "vocabulary") {
          console.log("[renderExample] Using renderVocabularyExample");
          return renderVocabularyExample();
        }
        // fill_in_ledger形式の場合は専用レンダリングを使用
        if (
          correctAnswer.blanks &&
          questionTemplate?.type === "fill_in_ledger"
        ) {
          console.log("[renderExample] Using renderFillInLedgerExample");
          return renderFillInLedgerExample();
        }
        console.log("[renderExample] Using renderLedgerExample (fallback)");
        return renderLedgerExample();
      case "trial_balance":
        // Q3 fill-in形式（blanks）の場合は専用レンダリング
        if (correctAnswer.blanks) {
          const templateType = questionTemplate?.type;
          if (
            templateType === "fill_in_trial_balance" ||
            templateType === "fill_in_comprehensive_trial_balance" ||
            templateType === "fill_in_financial_statement"
          ) {
            console.log("[renderExample] Using renderFillInExample for Q3");
            return renderFillInExample();
          }
        }
        // 従来の試算表形式（Q_T_001など）
        console.log("[renderExample] Using renderTrialBalanceExample");
        return renderTrialBalanceExample();
      case "auxiliary_book":
        console.log("[renderExample] Using renderAuxiliaryBookExample");
        return renderAuxiliaryBookExample();
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderExample()}</View>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.warningBackground,
      borderRadius: 8,
      padding: 15,
      margin: 10,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    exampleContainer: {
      marginBottom: 10,
    },
    entryContainer: {
      marginBottom: 8,
    },
    entrySeparator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 8,
      marginHorizontal: 10,
    },
    journalRow: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 6,
      backgroundColor: theme.colors.surface,
    },
    debitColumn: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    creditColumn: {
      flex: 1,
    },
    columnHeader: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingVertical: 6,
      paddingHorizontal: 10,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    columnHeaderText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    accountRow: {
      padding: 10,
      alignItems: "center",
    },
    accountName: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    amount: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    exampleTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    fieldRow: {
      flexDirection: "column",
      marginBottom: 10,
      alignItems: "flex-start",
      width: "100%",
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    fieldValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.primary,
      fontFamily: "monospace",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginTop: 4,
      flexShrink: 1,
      maxWidth: "100%",
    },
    hintText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginTop: 5,
      lineHeight: 16,
    },
    totalsRow: {
      marginTop: 12,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalsText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
      textAlign: "center",
    },
  });
