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
              {firstEntry.amount?.toLocaleString()}
              円
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTrialBalanceExample = () => {
    const balances = correctAnswer.trialBalance?.balances;
    if (!balances) return null;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>📝 正解例</Text>
        {Object.entries(balances).map(([account, amount]) => (
          <View key={account} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{account}:</Text>
            <Text style={styles.fieldValue}>
              {(amount as number).toLocaleString()}円
            </Text>
          </View>
        ))}
      </View>
    );
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
