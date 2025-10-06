/**
 * CBT準拠仕訳入力フォーム
 * Phase C: Q2/Q3 CBT UI改善 - CBTレイアウト統合版
 * 統合レイアウト、メモ機能、タイマー機能を含む本格的CBTフォーム
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CBTLayout } from "./CBTLayout";
import { UnifiedAccountSelector } from "../unified/UnifiedAccountSelector";
import NumericPad from "../ui/NumericPad";

interface JournalEntry {
  account: string;
  amount: number;
}

interface CBTJournalEntryFormProps {
  // 問題情報
  questionId: string;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;

  // セッション情報
  sectionNumber: 1 | 2 | 3;
  timeRemaining?: number;
  isMarked?: boolean;

  // 正解データ（採点用）
  correctAnswer?: {
    journalEntries?: JournalEntry[];
  };

  // コールバック
  onSubmitAnswer: (answer: any) => void;
  onBackPress: () => void;
  onMarkToggle?: () => void;
  onTimeUp?: () => void;

  // メモ機能
  initialMemo?: string;
  onMemoChange?: (memo: string) => void;

  // テスト用
  testID?: string;
}

export const CBTJournalEntryForm: React.FC<CBTJournalEntryFormProps> = ({
  questionId,
  questionText,
  questionNumber,
  totalQuestions,
  sectionNumber,
  timeRemaining = 0,
  isMarked = false,
  correctAnswer,
  onSubmitAnswer,
  onBackPress,
  onMarkToggle,
  onTimeUp,
  initialMemo = "",
  onMemoChange,
  testID = "cbt-journal-form",
}) => {
  // 仕訳エントリの状態
  const [debits, setDebits] = useState<JournalEntry[]>([
    { account: "", amount: 0 },
  ]);
  const [credits, setCredits] = useState<JournalEntry[]>([
    { account: "", amount: 0 },
  ]);

  // NumericPadの状態
  const [numericPadVisible, setNumericPadVisible] = useState(false);
  const [currentAmountEdit, setCurrentAmountEdit] = useState<{
    type: "debit" | "credit";
    index: number;
  } | null>(null);
  const [tempAmount, setTempAmount] = useState("");

  // 問題変更時にフォームをリセット
  useEffect(() => {
    setDebits([{ account: "", amount: 0 }]);
    setCredits([{ account: "", amount: 0 }]);
    setNumericPadVisible(false);
    setCurrentAmountEdit(null);
    setTempAmount("");
  }, [questionId]);

  // 借方エントリの追加
  const addDebitEntry = () => {
    if (debits.length < 4) {
      setDebits([...debits, { account: "", amount: 0 }]);
    }
  };

  // 貸方エントリの追加
  const addCreditEntry = () => {
    if (credits.length < 4) {
      setCredits([...credits, { account: "", amount: 0 }]);
    }
  };

  // エントリの削除
  const removeDebitEntry = (index: number) => {
    if (debits.length > 1) {
      setDebits(debits.filter((_, i) => i !== index));
    }
  };

  const removeCreditEntry = (index: number) => {
    if (credits.length > 1) {
      setCredits(credits.filter((_, i) => i !== index));
    }
  };

  // 勘定科目の更新
  const updateDebitAccount = (index: number, account: string) => {
    const newDebits = [...debits];
    newDebits[index].account = account;
    setDebits(newDebits);
  };

  const updateCreditAccount = (index: number, account: string) => {
    const newCredits = [...credits];
    newCredits[index].account = account;
    setCredits(newCredits);
  };

  // 金額入力の開始
  const openNumericPad = (type: "debit" | "credit", index: number) => {
    const currentValue =
      type === "debit"
        ? debits[index].amount.toString()
        : credits[index].amount.toString();
    setTempAmount(currentValue === "0" ? "" : currentValue);
    setCurrentAmountEdit({ type, index });
    setNumericPadVisible(true);
  };

  // 金額の確定
  const confirmAmount = () => {
    if (currentAmountEdit && tempAmount) {
      const numericAmount = parseInt(tempAmount) || 0;
      if (currentAmountEdit.type === "debit") {
        const newDebits = [...debits];
        newDebits[currentAmountEdit.index].amount = numericAmount;
        setDebits(newDebits);
      } else {
        const newCredits = [...credits];
        newCredits[currentAmountEdit.index].amount = numericAmount;
        setCredits(newCredits);
      }
    }
    setNumericPadVisible(false);
    setCurrentAmountEdit(null);
    setTempAmount("");
  };

  // 合計金額の計算
  const calculateTotal = (entries: JournalEntry[]): number => {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const debitTotal = calculateTotal(debits);
  const creditTotal = calculateTotal(credits);
  const isBalanced = debitTotal === creditTotal && debitTotal > 0;

  // バリデーション
  const validateEntries = (): string[] => {
    const errors: string[] = [];

    // 借方チェック
    debits.forEach((debit, index) => {
      if (!debit.account && debit.amount > 0) {
        errors.push(`借方${index + 1}行目: 勘定科目を選択してください`);
      }
      if (debit.account && debit.amount <= 0) {
        errors.push(`借方${index + 1}行目: 金額を入力してください`);
      }
    });

    // 貸方チェック
    credits.forEach((credit, index) => {
      if (!credit.account && credit.amount > 0) {
        errors.push(`貸方${index + 1}行目: 勘定科目を選択してください`);
      }
      if (credit.account && credit.amount <= 0) {
        errors.push(`貸方${index + 1}行目: 金額を入力してください`);
      }
    });

    // 貸借平衡チェック
    if (!isBalanced) {
      errors.push("借方と貸方の金額が一致していません");
    }

    // 最低一つのエントリチェック
    const hasValidEntry = [...debits, ...credits].some(
      (entry) => entry.account && entry.amount > 0,
    );
    if (!hasValidEntry) {
      errors.push("最低一つの仕訳エントリを入力してください");
    }

    return errors;
  };

  // 解答送信
  const submitAnswer = () => {
    const errors = validateEntries();
    if (errors.length > 0) {
      Alert.alert("入力エラー", errors.join("\n"));
      return;
    }

    // 有効な仕訳エントリのみを送信
    const validDebits = debits.filter(
      (entry) => entry.account && entry.amount > 0,
    );
    const validCredits = credits.filter(
      (entry) => entry.account && entry.amount > 0,
    );

    const answer = {
      questionId,
      journalEntries: [...validDebits, ...validCredits],
      debitTotal,
      creditTotal,
      isBalanced,
      answerTime: Date.now(),
    };

    onSubmitAnswer(answer);
  };

  // 仕訳エントリ行のレンダリング
  const renderJournalEntry = (
    entry: JournalEntry,
    index: number,
    type: "debit" | "credit",
  ) => (
    <View key={index} style={styles.entryRow} testID={`${type}-entry-${index}`}>
      {/* 勘定科目選択 */}
      <View style={styles.accountColumn}>
        <UnifiedAccountSelector
          selectedAccount={entry.account}
          onAccountSelect={(account) =>
            type === "debit"
              ? updateDebitAccount(index, account)
              : updateCreditAccount(index, account)
          }
          questionId={questionId}
          placeholder="勘定科目を選択"
          testID={`${type}-account-dropdown-${index}`}
        />
      </View>

      {/* 金額入力 */}
      <View style={styles.amountColumn}>
        <TouchableOpacity
          style={styles.amountButton}
          onPress={() => openNumericPad(type, index)}
          testID={`${type}-amount-input-${index}`}
        >
          <Text style={styles.amountText}>
            {entry.amount > 0 ? entry.amount.toLocaleString() : "金額を入力"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 削除ボタン */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          type === "debit" ? removeDebitEntry(index) : removeCreditEntry(index)
        }
        testID={`${type}-delete-${index}`}
        disabled={(type === "debit" ? debits.length : credits.length) <= 1}
      >
        <Ionicons
          name="close-circle"
          size={20}
          color={
            (type === "debit" ? debits.length : credits.length) > 1
              ? "#F44336"
              : "#CCCCCC"
          }
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <CBTLayout
      sectionNumber={sectionNumber}
      questionIndex={questionNumber - 1}
      totalQuestions={totalQuestions}
      timeRemaining={timeRemaining}
      isMarked={isMarked}
      onBackPress={onBackPress}
      onMarkToggle={onMarkToggle}
      onTimeUp={onTimeUp}
      enableMemo={true}
      initialMemo={initialMemo}
      onMemoChange={onMemoChange}
      testID={testID}
    >
      <ScrollView style={styles.container} testID={`${testID}-content`}>
        {/* 問題文 */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questionText}</Text>
        </View>

        {/* 仕訳入力セクション */}
        <View style={styles.journalContainer}>
          {/* 借方セクション */}
          <View style={styles.sideContainer}>
            <View style={styles.sideHeader}>
              <Text style={styles.sideTitle}>借方</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addDebitEntry}
                disabled={debits.length >= 4}
                testID="add-debit-entry-button"
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={debits.length < 4 ? "#0066CC" : "#CCCCCC"}
                />
              </TouchableOpacity>
            </View>

            {debits.map((debit, index) =>
              renderJournalEntry(debit, index, "debit"),
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>借方合計:</Text>
              <Text style={styles.totalAmount}>
                {debitTotal.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* 貸方セクション */}
          <View style={styles.sideContainer}>
            <View style={styles.sideHeader}>
              <Text style={styles.sideTitle}>貸方</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addCreditEntry}
                disabled={credits.length >= 4}
                testID="add-credit-entry-button"
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={credits.length < 4 ? "#0066CC" : "#CCCCCC"}
                />
              </TouchableOpacity>
            </View>

            {credits.map((credit, index) =>
              renderJournalEntry(credit, index, "credit"),
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>貸方合計:</Text>
              <Text style={styles.totalAmount}>
                {creditTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 貸借差額表示 */}
        <View
          style={[
            styles.balanceBar,
            isBalanced ? styles.balanceBarGreen : styles.balanceBarRed,
          ]}
        >
          <Text style={styles.balanceText}>
            差額: {Math.abs(debitTotal - creditTotal).toLocaleString()}
            {isBalanced && debitTotal > 0 && " ✓ 貸借平衡"}
          </Text>
        </View>

        {/* 解答送信ボタン */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isBalanced && debitTotal > 0
              ? styles.submitButtonEnabled
              : styles.submitButtonDisabled,
          ]}
          onPress={submitAnswer}
          testID="submit-answer-button"
          disabled={!isBalanced || debitTotal === 0}
        >
          <Text style={styles.submitButtonText}>解答を送信</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* NumericPad */}
      {numericPadVisible && (
        <NumericPad
          visible={numericPadVisible}
          initialValue={tempAmount}
          onConfirm={confirmAmount}
          onCancel={() => {
            setNumericPadVisible(false);
            setCurrentAmountEdit(null);
            setTempAmount("");
          }}
          onChange={setTempAmount}
          testID="numeric-pad"
        />
      )}
    </CBTLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0066CC",
  },
  questionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  journalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sideContainer: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  addButton: {
    padding: 4,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  accountColumn: {
    flex: 1,
    marginRight: 8,
  },
  amountColumn: {
    width: 100,
    marginRight: 8,
  },
  amountButton: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  amountText: {
    fontSize: 14,
    color: "#333333",
  },
  deleteButton: {
    padding: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E3F2FD",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066CC",
    fontFamily: "monospace",
  },
  balanceBar: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceBarGreen: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  balanceBarRed: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
    borderWidth: 1,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonEnabled: {
    backgroundColor: "#0066CC",
  },
  submitButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
