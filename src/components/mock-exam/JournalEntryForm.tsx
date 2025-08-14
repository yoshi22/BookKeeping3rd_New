import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import ExplanationModal from "./ExplanationModal";
import {
  JournalEntry,
  MockExamFormProps,
  STANDARD_ACCOUNT_OPTIONS,
  formatAmount,
  removeDuplicateEntries,
} from "../shared";

export interface JournalEntryFormProps extends MockExamFormProps {
  onSubmit: (debits: JournalEntry[], credits: JournalEntry[]) => void;
}

export default function JournalEntryForm({
  questionText,
  onSubmit,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  timeRemaining,
  explanation,
  correctAnswer,
  userAnswer,
  isCorrect,
  showExplanation,
}: JournalEntryFormProps) {
  const { theme } = useTheme();

  const [debits, setDebits] = useState<JournalEntry[]>([
    { account: "", amount: 0 },
  ]);
  const [credits, setCredits] = useState<JournalEntry[]>([
    { account: "", amount: 0 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    type: "debit" | "credit";
    index: number;
  } | null>(null);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);

  const addDebitRow = () => {
    if (debits.length < 4) {
      setDebits([...debits, { account: "", amount: 0 }]);
    }
  };

  const addCreditRow = () => {
    if (credits.length < 4) {
      setCredits([...credits, { account: "", amount: 0 }]);
    }
  };

  const removeDebitRow = (index: number) => {
    if (debits.length > 1) {
      setDebits(debits.filter((_, i) => i !== index));
    }
  };

  const removeCreditRow = (index: number) => {
    if (credits.length > 1) {
      setCredits(credits.filter((_, i) => i !== index));
    }
  };

  const updateDebit = (
    index: number,
    field: keyof JournalEntry,
    value: string | number,
  ) => {
    const newDebits = [...debits];
    if (field === "amount") {
      newDebits[index].amount =
        typeof value === "string" ? parseInt(value) || 0 : value;
    } else {
      newDebits[index].account = value as string;
    }
    setDebits(newDebits);
  };

  const updateCredit = (
    index: number,
    field: keyof JournalEntry,
    value: string | number,
  ) => {
    const newCredits = [...credits];
    if (field === "amount") {
      newCredits[index].amount =
        typeof value === "string" ? parseInt(value) || 0 : value;
    } else {
      newCredits[index].account = value as string;
    }
    setCredits(newCredits);
  };

  const showAccountSelector = (type: "debit" | "credit", index: number) => {
    if (Platform.OS === "ios") {
      const options = STANDARD_ACCOUNT_OPTIONS.map((option) => option.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "勘定科目を選択",
          options: ["キャンセル", ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedAccount = STANDARD_ACCOUNT_OPTIONS[buttonIndex - 1];
            if (type === "debit") {
              updateDebit(index, "account", selectedAccount.value);
            } else {
              updateCredit(index, "account", selectedAccount.value);
            }
          }
        },
      );
    } else {
      // Fallback to modal for Android or if ActionSheet doesn't work
      setCurrentSelection({ type, index });
      setModalVisible(true);
    }
  };

  const selectAccountFromModal = (account: {
    label: string;
    value: string;
  }) => {
    if (currentSelection) {
      if (currentSelection.type === "debit") {
        updateDebit(currentSelection.index, "account", account.value);
      } else {
        updateCredit(currentSelection.index, "account", account.value);
      }
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  const validateAndSubmit = () => {
    // 借方の合計を計算
    const debitTotal = debits
      .filter((entry) => entry.account && entry.amount > 0)
      .reduce((sum, entry) => sum + entry.amount, 0);

    // 貸方の合計を計算
    const creditTotal = credits
      .filter((entry) => entry.account && entry.amount > 0)
      .reduce((sum, entry) => sum + entry.amount, 0);

    if (debitTotal === 0 || creditTotal === 0) {
      Alert.alert(
        "入力エラー",
        "借方・貸方ともに少なくとも1つの仕訳を入力してください。",
      );
      return;
    }

    if (debitTotal !== creditTotal) {
      Alert.alert(
        "仕訳エラー",
        `借方合計（${formatAmount(debitTotal)}円）と貸方合計（${formatAmount(creditTotal)}円）が一致しません。`,
      );
      return;
    }

    // 有効な仕訳のみを取得
    const validDebits = debits.filter(
      (entry) => entry.account && entry.amount > 0,
    );
    const validCredits = credits.filter(
      (entry) => entry.account && entry.amount > 0,
    );

    // 重複チェック
    const uniqueDebits = removeDuplicateEntries(
      validDebits,
      (entry) => entry.account,
    );
    const uniqueCredits = removeDuplicateEntries(
      validCredits,
      (entry) => entry.account,
    );

    if (uniqueDebits.length !== validDebits.length) {
      Alert.alert(
        "入力エラー",
        "借方に同一の勘定科目を複数回使用することはできません。",
      );
      return;
    }

    if (uniqueCredits.length !== validCredits.length) {
      Alert.alert(
        "入力エラー",
        "貸方に同一の勘定科目を複数回使用することはできません。",
      );
      return;
    }

    onSubmit(validDebits, validCredits);
  };

  const formatAmountDisplay = (amount: number) => {
    return amount > 0 ? formatAmount(amount) : "";
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      {/* 問題文 */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      {/* 仕訳表 */}
      <View style={styles.journalTable}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.debitHeader]}>借方</Text>
          <Text style={[styles.headerText, styles.creditHeader]}>貸方</Text>
        </View>

        <View style={styles.tableContent}>
          <View style={styles.debitSection}>
            <Text style={styles.sectionLabel}>借方</Text>
            {debits.map((debit, index) => (
              <View key={index} style={styles.entryRow}>
                <TouchableOpacity
                  style={styles.accountPickerContainer}
                  onPress={() => showAccountSelector("debit", index)}
                >
                  <Text style={styles.accountPickerText}>
                    {debit.account || "勘定科目を選択"}
                  </Text>
                  <Text style={styles.accountPickerArrow}>▼</Text>
                </TouchableOpacity>

                <View style={styles.amountRow}>
                  <TextInput
                    style={[
                      styles.amountInput,
                      debits.length > 1 ? styles.amountInputWithButton : {},
                    ]}
                    value={debit.amount > 0 ? debit.amount.toString() : ""}
                    onChangeText={(text) => updateDebit(index, "amount", text)}
                    placeholder="金額"
                    keyboardType="numeric"
                    textAlign="right"
                  />

                  {debits.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeDebitRow(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {debits.length < 4 && (
              <TouchableOpacity style={styles.addButton} onPress={addDebitRow}>
                <Text style={styles.addButtonText}>+ 借方を追加</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.creditSection}>
            <Text style={styles.sectionLabel}>貸方</Text>
            {credits.map((credit, index) => (
              <View key={index} style={styles.entryRow}>
                <TouchableOpacity
                  style={styles.accountPickerContainer}
                  onPress={() => showAccountSelector("credit", index)}
                >
                  <Text style={styles.accountPickerText}>
                    {credit.account || "勘定科目を選択"}
                  </Text>
                  <Text style={styles.accountPickerArrow}>▼</Text>
                </TouchableOpacity>

                <View style={styles.amountRow}>
                  <TextInput
                    style={[
                      styles.amountInput,
                      credits.length > 1 ? styles.amountInputWithButton : {},
                    ]}
                    value={credit.amount > 0 ? credit.amount.toString() : ""}
                    onChangeText={(text) => updateCredit(index, "amount", text)}
                    placeholder="金額"
                    keyboardType="numeric"
                    textAlign="right"
                  />

                  {credits.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeCreditRow(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {credits.length < 4 && (
              <TouchableOpacity style={styles.addButton} onPress={addCreditRow}>
                <Text style={styles.addButtonText}>+ 貸方を追加</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 合計表示 */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>借方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatAmountDisplay(
              debits.reduce((sum, entry) => sum + (entry.amount || 0), 0),
            )}
            円
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>貸方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatAmountDisplay(
              credits.reduce((sum, entry) => sum + (entry.amount || 0), 0),
            )}
            円
          </Text>
        </View>
      </View>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationContainer}>
        {onPrevious && (
          <TouchableOpacity style={styles.navButton} onPress={onPrevious}>
            <Text style={styles.navButtonText}>前の問題</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
        >
          <Text style={styles.submitButtonText}>解答確認</Text>
        </TouchableOpacity>

        {explanation && (
          <TouchableOpacity
            style={styles.explanationButton}
            onPress={() => setExplanationModalVisible(true)}
          >
            <Text style={styles.explanationButtonText}>📖 解説を見る</Text>
          </TouchableOpacity>
        )}

        {onNext && (
          <TouchableOpacity style={styles.navButton} onPress={onNext}>
            <Text style={styles.navButtonText}>次の問題</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 勘定科目選択Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>勘定科目を選択</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={STANDARD_ACCOUNT_OPTIONS.filter(
                (account) => account.value !== "",
              )} // 空の選択肢を除外
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectAccountFromModal(item)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* 解説Modal */}
      <ExplanationModal
        visible={explanationModalVisible}
        onClose={() => setExplanationModalVisible(false)}
        explanation={explanation || ""}
        questionText={questionText}
        correctAnswer={correctAnswer}
        userAnswer={userAnswer}
        isCorrect={isCorrect}
      />
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    questionContainer: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      margin: 16,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    questionText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
    },
    journalTable: {
      margin: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      overflow: "hidden",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
    },
    headerText: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.background,
    },
    debitHeader: {
      borderRightWidth: 1,
      borderRightColor: theme.colors.background,
    },
    creditHeader: {},
    tableContent: {
      flexDirection: "row",
      minHeight: 200,
    },
    debitSection: {
      flex: 1,
      padding: 12,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    creditSection: {
      flex: 1,
      padding: 12,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    entryRow: {
      flexDirection: "column",
      marginBottom: 12,
      gap: 8,
    },
    accountPickerContainer: {
      width: "100%",
      minHeight: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      backgroundColor: theme.colors.background,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      flexDirection: "row",
    },
    accountPickerText: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
    },
    accountPickerArrow: {
      fontSize: 12,
      color: theme.colors.primary,
      marginLeft: 8,
    },
    amountRow: {
      flexDirection: "row",
      width: "100%",
      gap: 8,
      alignItems: "center",
    },
    amountInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "600",
    },
    amountInputWithButton: {
      // 削除ボタンがある場合は幅を調整
    },
    removeButton: {
      width: 36,
      height: 36,
      backgroundColor: theme.colors.error,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    removeButtonText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    addButton: {
      padding: 8,
      backgroundColor: theme.colors.primary + "20",
      borderRadius: 4,
      alignItems: "center",
      marginTop: 8,
    },
    addButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    totalContainer: {
      margin: 16,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      gap: 12,
    },
    navButton: {
      flex: 1,
      padding: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 8,
      alignItems: "center",
    },
    navButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "600",
    },
    submitButton: {
      flex: 1,
      padding: 12,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: 16,
      color: theme.colors.background,
      fontWeight: "bold",
    },
    explanationButton: {
      flex: 1,
      padding: 12,
      backgroundColor: theme.colors.success,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    explanationButtonText: {
      fontSize: 16,
      color: theme.colors.background,
      fontWeight: "600",
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalCloseButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCloseText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    modalItemText: {
      fontSize: 16,
      color: theme.colors.text,
    },
  });
