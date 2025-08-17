import React, { useState, useEffect, useCallback } from "react";
import { logger } from "../../../utils/logger";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { useTheme, useThemedStyles, type Theme } from "../../context/ThemeContext";
import ExplanationModal from "./ExplanationModal";
import {
  MockExamFormProps,
  STANDARD_ACCOUNT_OPTIONS,
  formatAmount,
} from "../shared";

export interface TrialBalanceEntry {
  accountName: string;
  debitAmount: number;
  creditAmount: number;
}

export interface TrialBalanceFormProps extends MockExamFormProps {
  onSubmit: (entries: TrialBalanceEntry[]) => void;
}

export default function TrialBalanceForm({
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
  questionText,
}: TrialBalanceFormProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState<
    number | null
  >(null);

  // 主要な勘定科目の初期セットアップ
  const [entries, setEntries] = useState<TrialBalanceEntry[]>([
    { accountName: "現金", debitAmount: 0, creditAmount: 0 },
    { accountName: "当座預金", debitAmount: 0, creditAmount: 0 },
    { accountName: "売掛金", debitAmount: 0, creditAmount: 0 },
    { accountName: "商品", debitAmount: 0, creditAmount: 0 },
    { accountName: "建物", debitAmount: 0, creditAmount: 0 },
    { accountName: "買掛金", debitAmount: 0, creditAmount: 0 },
    { accountName: "借入金", debitAmount: 0, creditAmount: 0 },
    { accountName: "資本金", debitAmount: 0, creditAmount: 0 },
    { accountName: "売上", debitAmount: 0, creditAmount: 0 },
    { accountName: "仕入", debitAmount: 0, creditAmount: 0 },
    { accountName: "給料", debitAmount: 0, creditAmount: 0 },
    { accountName: "水道光熱費", debitAmount: 0, creditAmount: 0 },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      { accountName: "", debitAmount: 0, creditAmount: 0 },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const updateEntry = useCallback(
    (index: number, field: keyof TrialBalanceEntry, value: any) => {
      logger.debug("[TrialBalanceForm] updateEntry called:", { details: {
        index,
        field,
        value,
      } });

      setEntries((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[index] = { ...newEntries[index], [field]: value };

        logger.debug("[TrialBalanceForm] updateEntry setting new state:", { details: {
          oldEntries: prevEntries,
          newEntries,
          targetEntry: newEntries[index],
        } });

        return newEntries;
      });
    },
    [],
  );

  const validateAndSubmit = () => {
    // 入力された項目を抽出
    const validEntries = entries.filter(
      (entry) =>
        entry.accountName.trim() &&
        (entry.debitAmount > 0 || entry.creditAmount > 0),
    );

    if (validEntries.length === 0) {
      Alert.alert(
        "エラー",
        "少なくとも1つの有効なエントリーを入力してください",
      );
      return;
    }

    // 借方・貸方の合計チェック
    const totalDebit = validEntries.reduce(
      (sum, entry) => sum + entry.debitAmount,
      0,
    );
    const totalCredit = validEntries.reduce(
      (sum, entry) => sum + entry.creditAmount,
      0,
    );

    if (totalDebit !== totalCredit) {
      Alert.alert(
        "確認",
        `借方合計(${formatAmount(totalDebit)}円)と貸方合計(${formatAmount(
          totalCredit,
        )}円)が一致しませんが、このまま解答しますか？`,
        [
          { text: "キャンセル", style: "cancel" },
          { text: "解答する", onPress: () => onSubmit(validEntries) },
        ],
      );
    } else {
      onSubmit(validEntries);
    }
  };

  const getTotalDebit = (): number => {
    return entries.reduce((sum, entry) => sum + entry.debitAmount, 0);
  };

  const getTotalCredit = (): number => {
    return entries.reduce((sum, entry) => sum + entry.creditAmount, 0);
  };

  const isBalanced = (): boolean => {
    return getTotalDebit() === getTotalCredit();
  };

  const showAccountSelector = (index: number) => {
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
            updateEntry(index, "accountName", selectedAccount.value);
          }
        },
      );
    } else {
      // Fallback to modal for Android or if ActionSheet doesn't work
      setCurrentSelectionIndex(index);
      setModalVisible(true);
    }
  };

  const selectAccountFromModal = (account: {
    label: string;
    value: string;
  }) => {
    if (currentSelectionIndex !== null) {
      updateEntry(currentSelectionIndex, "accountName", account.value);
    }
    setModalVisible(false);
    setCurrentSelectionIndex(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      testID="trial-balance-form"
    >
      {/* 試算表フォーム */}
      <View
        style={[styles.formCard, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          試算表作成
        </Text>

        {/* ヘッダー */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.headerCell,
              styles.accountHeader,
              { color: theme.colors.text },
            ]}
          >
            勘定科目
          </Text>
          <Text
            style={[
              styles.headerCell,
              styles.amountHeader,
              { color: theme.colors.text },
            ]}
          >
            借方
          </Text>
          <Text
            style={[
              styles.headerCell,
              styles.amountHeader,
              { color: theme.colors.text },
            ]}
          >
            貸方
          </Text>
        </View>

        {/* エントリー行 */}
        {entries.map((entry, index) => (
          <View
            key={index}
            style={[
              styles.entryRow,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            {/* 勘定科目 */}
            <View style={styles.accountCell}>
              <TouchableOpacity
                style={[
                  styles.accountPickerContainer,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => showAccountSelector(index)}
              >
                <Text
                  style={[
                    styles.accountPickerText,
                    {
                      color: entry.accountName
                        ? theme.colors.text
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {entry.accountName || "勘定科目を選択"}
                </Text>
                <Text
                  style={[
                    styles.accountPickerArrow,
                    { color: theme.colors.primary },
                  ]}
                >
                  ▼
                </Text>
              </TouchableOpacity>
              {index >= 12 && entries.length > 12 && (
                <TouchableOpacity
                  onPress={() => removeEntry(index)}
                  style={[
                    styles.removeSmallButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                >
                  <Text style={styles.removeSmallButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 借方金額 */}
            <View style={styles.amountCell}>
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={
                  entry.debitAmount > 0 ? entry.debitAmount.toString() : ""
                }
                onChangeText={(value) => {
                  // 数値のみを許可（空文字列も許可）
                  if (value === "" || /^\d+$/.test(value)) {
                    const numValue = value === "" ? 0 : parseInt(value);
                    updateEntry(index, "debitAmount", numValue);
                    // 借方に入力した場合は貸方をクリア
                    if (numValue > 0) {
                      updateEntry(index, "creditAmount", 0);
                    }
                  }
                }}
                placeholder="0"
                keyboardType="numeric"
                returnKeyType="done"
                selectTextOnFocus={true}
                placeholderTextColor={theme.colors.textSecondary}
                editable={true}
                multiline={false}
                testID={`debit-balance-input-${index}`}
                accessibilityLabel={`借方残高入力 ${index + 1}`}
              />
            </View>

            {/* 貸方金額 */}
            <View style={styles.amountCell}>
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={
                  entry.creditAmount > 0 ? entry.creditAmount.toString() : ""
                }
                onChangeText={(value) => {
                  // 数値のみを許可（空文字列も許可）
                  if (value === "" || /^\d+$/.test(value)) {
                    const numValue = value === "" ? 0 : parseInt(value);
                    updateEntry(index, "creditAmount", numValue);
                    // 貸方に入力した場合は借方をクリア
                    if (numValue > 0) {
                      updateEntry(index, "debitAmount", 0);
                    }
                  }
                }}
                placeholder="0"
                keyboardType="numeric"
                returnKeyType="done"
                selectTextOnFocus={true}
                placeholderTextColor={theme.colors.textSecondary}
                editable={true}
                multiline={false}
                testID={`credit-balance-input-${index}`}
                accessibilityLabel={`貸方残高入力 ${index + 1}`}
              />
            </View>
          </View>
        ))}

        {/* エントリー追加ボタン */}
        <TouchableOpacity
          onPress={addEntry}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.primary + "20",
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            + 勘定科目を追加
          </Text>
        </TouchableOpacity>

        {/* 合計行 */}
        <View
          style={[
            styles.totalRow,
            {
              backgroundColor: isBalanced()
                ? theme.colors.success + "20"
                : theme.colors.error + "20",
              borderColor: isBalanced()
                ? theme.colors.success
                : theme.colors.error,
            },
          ]}
        >
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            合計
          </Text>
          <Text
            style={[
              styles.totalAmount,
              {
                color: isBalanced() ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {formatAmount(getTotalDebit())}
          </Text>
          <Text
            style={[
              styles.totalAmount,
              {
                color: isBalanced() ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {formatAmount(getTotalCredit())}
          </Text>
        </View>

        {/* バランス状態表示 */}
        <View style={styles.balanceStatus}>
          <Text
            style={[
              styles.balanceText,
              {
                color: isBalanced() ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {isBalanced()
              ? "✅ 借方・貸方が一致しています"
              : "⚠️ 借方・貸方が一致していません"}
          </Text>
          {!isBalanced() && (
            <Text
              style={[styles.differenceText, { color: theme.colors.error }]}
            >
              差額: {formatAmount(Math.abs(getTotalDebit() - getTotalCredit()))}
              円
            </Text>
          )}
        </View>
      </View>

      {/* 操作ボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={validateAndSubmit}
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          testID="submit-answer-button"
          accessibilityLabel="解答を確認"
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: theme.colors.background },
            ]}
          >
            解答確認
          </Text>
        </TouchableOpacity>

        {explanation && (
          <TouchableOpacity
            onPress={() => setExplanationModalVisible(true)}
            style={[
              styles.explanationButton,
              { backgroundColor: theme.colors.success },
            ]}
          >
            <Text
              style={[
                styles.explanationButtonText,
                { color: theme.colors.background },
              ]}
            >
              📖 解説を見る
            </Text>
          </TouchableOpacity>
        )}

        {onNext && (
          <TouchableOpacity
            onPress={onNext}
            style={[
              styles.nextButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <Text
              style={[styles.nextButtonText, { color: theme.colors.primary }]}
            >
              次の問題
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ナビゲーションボタン */}
      {(onPrevious || onNext) && (
        <View style={styles.navigationContainer}>
          {onPrevious && (
            <TouchableOpacity
              onPress={onPrevious}
              style={[
                styles.navButton,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[styles.navButtonText, { color: theme.colors.primary }]}
              >
                ← 前の問題
              </Text>
            </TouchableOpacity>
          )}
          {onNext && (
            <TouchableOpacity
              onPress={onNext}
              style={[
                styles.navButton,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[styles.navButtonText, { color: theme.colors.primary }]}
              >
                次の問題 →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 勘定科目選択Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                勘定科目を選択
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: theme.colors.error },
                ]}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={STANDARD_ACCOUNT_OPTIONS.filter(
                (account) => account.value !== "",
              )}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: theme.colors.border + "30" },
                  ]}
                  onPress={() => selectAccountFromModal(item)}
                >
                  <Text
                    style={[styles.modalItemText, { color: theme.colors.text }]}
                  >
                    {item.label}
                  </Text>
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
        questionText={questionText || ""}
        correctAnswer={correctAnswer}
        userAnswer={userAnswer}
        isCorrect={isCorrect}
        questionType="trial_balance"
      />
    </ScrollView>
  );
}

const createStyles = (
  theme: Theme,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    questionCard: {
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
    },
    questionNumber: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    remainingTime: {
      fontSize: 14,
      marginBottom: 12,
    },
    questionText: {
      fontSize: 18,
      lineHeight: 26,
    },
    formCard: {
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    headerRow: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
      marginBottom: 8,
    },
    headerCell: {
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
    accountHeader: {
      flex: 3,
      textAlign: "left",
    },
    amountHeader: {
      flex: 2,
    },
    entryRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      alignItems: "center",
    },
    accountCell: {
      flex: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    accountInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 6,
      padding: 10,
      fontSize: 14,
      marginRight: 8,
    },
    amountCell: {
      flex: 2,
      paddingHorizontal: 4,
    },
    amountInput: {
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      textAlign: "right",
      minHeight: 44,
      includeFontPadding: false,
    },
    removeSmallButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    removeSmallButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "bold",
    },
    addButton: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    totalRow: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginTop: 16,
      borderWidth: 2,
      borderRadius: 8,
      alignItems: "center",
    },
    totalLabel: {
      flex: 3,
      fontSize: 18,
      fontWeight: "bold",
    },
    totalAmount: {
      flex: 2,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "right",
      paddingHorizontal: 8,
    },
    balanceStatus: {
      marginTop: 12,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    balanceText: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    differenceText: {
      fontSize: 14,
      fontWeight: "500",
    },
    buttonContainer: {
      gap: 12,
      marginBottom: 20,
    },
    submitButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: "600",
    },
    nextButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    explanationButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    explanationButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    navButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    // Account picker styles
    accountPickerContainer: {
      flex: 1,
      minHeight: 44,
      borderWidth: 1,
      borderRadius: 6,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      flexDirection: "row",
      marginRight: 8,
    },
    accountPickerText: {
      fontSize: 14,
      flex: 1,
    },
    accountPickerArrow: {
      fontSize: 12,
      marginLeft: 8,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "flex-end",
    },
    modalContent: {
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
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    modalCloseButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCloseText: {
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: "bold",
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
    },
    modalItemText: {
      fontSize: 16,
    },
  });
