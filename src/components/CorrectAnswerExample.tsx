/**
 * 正解例表示コンポーネント
 * 間違った回答後に正解の入力例を表示
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { QuestionCorrectAnswer } from "../types/models";

interface CorrectAnswerExampleProps {
  questionType: "journal" | "ledger" | "trial_balance";
  correctAnswer: QuestionCorrectAnswer;
  show: boolean;
}

export default function CorrectAnswerExample({
  questionType,
  correctAnswer,
  show,
}: CorrectAnswerExampleProps) {
  if (!show || !correctAnswer) return null;

  const renderJournalExample = () => {
    const entry = correctAnswer.journalEntry;
    if (!entry) return null;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>借方勘定科目:</Text>
          <Text style={styles.fieldValue}>{entry.debit_account}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>借方金額:</Text>
          <Text style={styles.fieldValue}>
            {entry.debit_amount?.toLocaleString()}円
          </Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>貸方勘定科目:</Text>
          <Text style={styles.fieldValue}>{entry.credit_account}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>貸方金額:</Text>
          <Text style={styles.fieldValue}>
            {entry.credit_amount?.toLocaleString()}円
          </Text>
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

  const renderEntriesFromArray = (
    entriesArray: Array<{
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }>,
  ) => {
    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {entriesArray.map((entry: any, index: number) => {
          // 借方金額または貸方金額がある勘定科目のみ表示
          if (entry.debitAmount > 0) {
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
          } else if (entry.creditAmount > 0) {
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

    return renderEntriesFromArray(entries);
  };

  /**
   * 財務諸表形式のデータを試算表エントリ形式に変換
   */
  const convertFinancialStatementsToEntries = (
    financialStatements: any,
  ): Array<{
    accountName: string;
    debitAmount: number;
    creditAmount: number;
  }> => {
    const entries: Array<{
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }> = [];

    // 貸借対照表の資産（借方）
    if (financialStatements.balanceSheet?.assets) {
      for (const asset of financialStatements.balanceSheet.assets) {
        if (asset.amount > 0) {
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
        if (liability.amount > 0) {
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
        } else if (equity.amount > 0) {
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
        if (revenue.amount > 0) {
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
        if (expense.amount > 0) {
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
    switch (questionType) {
      case "journal":
        return renderJournalExample();
      case "ledger":
        return renderLedgerExample();
      case "trial_balance":
        return renderTrialBalanceExample();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderExample()}
      <Text style={styles.hintText}>
        💡
        上記の形式で入力してください。不明な点があれば❓ボタンを押してヘルプをご覧ください。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    padding: 15,
    margin: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  exampleContainer: {
    marginBottom: 10,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    minWidth: 100,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d84315",
    fontFamily: "monospace",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5,
    lineHeight: 16,
  },
});
