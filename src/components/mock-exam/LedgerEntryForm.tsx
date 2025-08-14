import React, { useState, useEffect } from "react";
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
import { useTheme } from "../../context/ThemeContext";
import ExplanationModal from "./ExplanationModal";

export interface LedgerEntry {
  date: string;
  description: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
}

export interface LedgerEntryFormProps {
  questionText: string;
  onSubmit: (entries: LedgerEntry[]) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: string;
  explanation?: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
  showExplanation?: boolean;
}

const ACCOUNT_OPTIONS = [
  { label: "勘定科目を選択", value: "" },
  // 資産
  { label: "現金", value: "現金" },
  { label: "現金過不足", value: "現金過不足" },
  { label: "当座預金", value: "当座預金" },
  { label: "当座借越", value: "当座借越" },
  { label: "普通預金", value: "普通預金" },
  { label: "小口現金", value: "小口現金" },
  { label: "売掛金", value: "売掛金" },
  { label: "受取手形", value: "受取手形" },
  { label: "商品", value: "商品" },
  { label: "前払金", value: "前払金" },
  { label: "前払費用", value: "前払費用" },
  { label: "仮払金", value: "仮払金" },
  { label: "貸付金", value: "貸付金" },
  { label: "建物", value: "建物" },
  { label: "備品", value: "備品" },
  { label: "土地", value: "土地" },
  { label: "車両運搬具", value: "車両運搬具" },
  { label: "投資有価証券", value: "投資有価証券" },
  // 負債
  { label: "買掛金", value: "買掛金" },
  { label: "支払手形", value: "支払手形" },
  { label: "前受金", value: "前受金" },
  { label: "前受収益", value: "前受収益" },
  { label: "仮受金", value: "仮受金" },
  { label: "未払金", value: "未払金" },
  { label: "未払費用", value: "未払費用" },
  { label: "借入金", value: "借入金" },
  { label: "預り金", value: "預り金" },
  { label: "貸倒引当金", value: "貸倒引当金" },
  { label: "減価償却累計額", value: "減価償却累計額" },
  // 純資産
  { label: "資本金", value: "資本金" },
  { label: "繰越利益剰余金", value: "繰越利益剰余金" },
  { label: "引出金", value: "引出金" },
  // 収益
  { label: "売上", value: "売上" },
  { label: "受取利息", value: "受取利息" },
  { label: "受取手数料", value: "受取手数料" },
  { label: "受取配当金", value: "受取配当金" },
  { label: "固定資産売却益", value: "固定資産売却益" },
  { label: "雑収入", value: "雑収入" },
  // 費用
  { label: "仕入", value: "仕入" },
  { label: "給料", value: "給料" },
  { label: "支払利息", value: "支払利息" },
  { label: "支払手数料", value: "支払手数料" },
  { label: "減価償却費", value: "減価償却費" },
  { label: "貸倒引当金繰入", value: "貸倒引当金繰入" },
  { label: "租税公課", value: "租税公課" },
  { label: "水道光熱費", value: "水道光熱費" },
  { label: "通信費", value: "通信費" },
  { label: "旅費交通費", value: "旅費交通費" },
  { label: "消耗品費", value: "消耗品費" },
  { label: "修繕費", value: "修繕費" },
  { label: "固定資産売却損", value: "固定資産売却損" },
  { label: "雑損失", value: "雑損失" },
];

export default function LedgerEntryForm({
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
}: LedgerEntryFormProps) {
  const { theme } = useTheme();
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    type: "debitAccount" | "creditAccount";
    index: number;
  } | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([
    {
      date: "",
      description: "",
      debitAccount: "",
      debitAmount: 0,
      creditAccount: "",
      creditAmount: 0,
    },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        description: "",
        debitAccount: "",
        debitAmount: 0,
        creditAccount: "",
        creditAmount: 0,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const updateEntry = (index: number, field: keyof LedgerEntry, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const validateAndSubmit = () => {
    // 基本バリデーション
    const validEntries = entries.filter(
      (entry) =>
        entry.description.trim() &&
        (entry.debitAmount > 0 || entry.creditAmount > 0),
    );

    if (validEntries.length === 0) {
      Alert.alert(
        "エラー",
        "少なくとも1つの有効なエントリーを入力してください",
      );
      return;
    }

    onSubmit(validEntries);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("ja-JP");
  };

  const showAccountSelector = (
    type: "debitAccount" | "creditAccount",
    index: number,
  ) => {
    if (Platform.OS === "ios") {
      const options = ACCOUNT_OPTIONS.map((option) => option.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "勘定科目を選択",
          options: ["キャンセル", ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedAccount = ACCOUNT_OPTIONS[buttonIndex - 1];
            updateEntry(index, type, selectedAccount.value);
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
      updateEntry(currentSelection.index, currentSelection.type, account.value);
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 問題文 */}
      <View
        style={[styles.questionCard, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {questionText}
        </Text>
      </View>

      {/* 帳簿エントリーフォーム */}
      <View
        style={[styles.formCard, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          総勘定元帳記入
        </Text>

        {entries.map((entry, index) => (
          <View
            key={index}
            style={[
              styles.entryCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.entryHeader}>
              <Text style={[styles.entryLabel, { color: theme.colors.text }]}>
                エントリー {index + 1}
              </Text>
              {entries.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeEntry(index)}
                  style={[
                    styles.removeButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                >
                  <Text style={styles.removeButtonText}>削除</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 日付入力 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                日付
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                  },
                ]}
                value={entry.date}
                onChangeText={(value) => updateEntry(index, "date", value)}
                placeholder="例: 4/1"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* 摘要入力 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                摘要
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                  },
                ]}
                value={entry.description}
                onChangeText={(value) =>
                  updateEntry(index, "description", value)
                }
                placeholder="取引内容を入力"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* 借方・貸方エントリー */}
            <View style={styles.entryRow}>
              <View style={styles.entryColumn}>
                <Text
                  style={[styles.columnTitle, { color: theme.colors.text }]}
                >
                  借方
                </Text>
                <View style={styles.accountGroup}>
                  <Text
                    style={[styles.inputLabel, { color: theme.colors.text }]}
                  >
                    勘定科目
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.accountPickerContainer,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => showAccountSelector("debitAccount", index)}
                  >
                    <Text
                      style={[
                        styles.accountPickerText,
                        {
                          color: entry.debitAccount
                            ? theme.colors.text
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {entry.debitAccount || "勘定科目を選択"}
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
                </View>
                <View style={styles.accountGroup}>
                  <Text
                    style={[styles.inputLabel, { color: theme.colors.text }]}
                  >
                    金額
                  </Text>
                  <TextInput
                    style={[
                      styles.numberInput,
                      {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                      },
                    ]}
                    value={
                      entry.debitAmount > 0 ? entry.debitAmount.toString() : ""
                    }
                    onChangeText={(value) => {
                      const numValue = parseInt(value.replace(/,/g, "")) || 0;
                      updateEntry(index, "debitAmount", numValue);
                    }}
                    placeholder="金額"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.entryColumn}>
                <Text
                  style={[styles.columnTitle, { color: theme.colors.text }]}
                >
                  貸方
                </Text>
                <View style={styles.accountGroup}>
                  <Text
                    style={[styles.inputLabel, { color: theme.colors.text }]}
                  >
                    勘定科目
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.accountPickerContainer,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => showAccountSelector("creditAccount", index)}
                  >
                    <Text
                      style={[
                        styles.accountPickerText,
                        {
                          color: entry.creditAccount
                            ? theme.colors.text
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {entry.creditAccount || "勘定科目を選択"}
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
                </View>
                <View style={styles.accountGroup}>
                  <Text
                    style={[styles.inputLabel, { color: theme.colors.text }]}
                  >
                    金額
                  </Text>
                  <TextInput
                    style={[
                      styles.numberInput,
                      {
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                      },
                    ]}
                    value={
                      entry.creditAmount > 0
                        ? entry.creditAmount.toString()
                        : ""
                    }
                    onChangeText={(value) => {
                      const numValue = parseInt(value.replace(/,/g, "")) || 0;
                      updateEntry(index, "creditAmount", numValue);
                    }}
                    placeholder="金額"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* エントリー追加ボタン */}
        <TouchableOpacity
          onPress={addEntry}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={[styles.addButtonText, { color: theme.colors.background }]}
          >
            + エントリーを追加
          </Text>
        </TouchableOpacity>

        {/* 合計表示 */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              借方合計:
            </Text>
            <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
              {formatCurrency(
                entries.reduce((sum, entry) => sum + entry.debitAmount, 0),
              )}
              円
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              貸方合計:
            </Text>
            <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
              {formatCurrency(
                entries.reduce((sum, entry) => sum + entry.creditAmount, 0),
              )}
              円
            </Text>
          </View>
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
              data={ACCOUNT_OPTIONS.filter((account) => account.value !== "")}
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
        questionText={questionText}
        correctAnswer={correctAnswer}
        userAnswer={userAnswer}
        isCorrect={isCorrect}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
  entryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  entryLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  entryRow: {
    flexDirection: "row",
    gap: 16,
  },
  entryColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  accountGroup: {
    marginBottom: 12,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
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
  accountPickerContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    color: "#fff",
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
  // Explanation button styles
  explanationButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  explanationButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
