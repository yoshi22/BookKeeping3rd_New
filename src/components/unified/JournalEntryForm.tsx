/**
 * 統合版仕訳入力フォーム - 分割リファクタリング版
 * 学習モードと模試モードの両方をサポート
 * JournalEntryForm分割 - Phase 3
 */

import React, { useState } from "react";
import { logger } from "../../utils/logger";
import {
  View,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button } from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import { SessionType } from "../../types/database";

// 削除されたコンポーネントのインポートを除去
import { JournalAccountSelector } from "./JournalAccountSelector";

// 型定義とユーティリティのインポート
import {
  JournalEntry,
  JournalFormState,
  JournalSelectionState,
  UnifiedJournalEntryFormProps,
} from "./JournalFormTypes";
import {
  createInitialJournalFormState,
  createInitialJournalEntry,
  validateJournalEntries,
  createLearningJournalAnswerRequest,
  submitLearningJournalAnswer,
  showJournalValidationErrors,
} from "./JournalFormUtils";

const UnifiedJournalEntryForm = React.memo(function UnifiedJournalEntryForm({
  questionId,
  questionText,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,

  // 模試モード固有プロパティ
  questionNumber,
  totalQuestions,
  timeRemaining,
  explanation,
  correctAnswer,
  userAnswer,
  isCorrect,
  showExplanation,
  onNext,
  onPrevious,

  // 統合モード制御
  mode = "learning",
  onDirectSubmit,
  onSubmit,
}: UnifiedJournalEntryFormProps) {
  // Theme system integration
  useTheme();

  // Form state
  const [formState, setFormState] = useState<JournalFormState>(
    createInitialJournalFormState(),
  );

  // Journal entry state
  const [debits, setDebits] = useState<JournalEntry[]>([
    createInitialJournalEntry(),
  ]);
  const [credits, setCredits] = useState<JournalEntry[]>([
    createInitialJournalEntry(),
  ]);

  // Account selection state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] =
    useState<JournalSelectionState | null>(null);

  // Entry management functions
  const addDebitRow = () => {
    if (debits.length < 4) {
      setDebits([...debits, createInitialJournalEntry()]);
    }
  };

  const addCreditRow = () => {
    if (credits.length < 4) {
      setCredits([...credits, createInitialJournalEntry()]);
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

  // Account selection
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

  // Validation and submission
  const validateAndSubmit = async () => {
    if (formState.isSubmitting) return;

    // Validate entries
    const validation = validateJournalEntries(debits, credits);
    if (!validation.isValid) {
      showJournalValidationErrors(validation.errors);
      return;
    }

    try {
      setFormState({ ...formState, isSubmitting: true });

      // Handle submission based on mode
      if (mode === "mock_exam" && (onDirectSubmit || onSubmit)) {
        // 模試モード: 直接コールバック実行
        const validDebits = debits.filter(
          (entry) => entry.account && entry.amount > 0,
        );
        const validCredits = credits.filter(
          (entry) => entry.account && entry.amount > 0,
        );

        if (onDirectSubmit) {
          onDirectSubmit({ debits: validDebits, credits: validCredits });
        } else if (onSubmit) {
          onSubmit(validDebits, validCredits);
        }
      } else {
        // 学習モード: answerService経由
        const request = createLearningJournalAnswerRequest(
          questionId,
          debits,
          credits,
          sessionType as SessionType,
          sessionId,
          startTime,
        );

        await submitLearningJournalAnswer(request, onSubmitAnswer);
      }
    } catch (error) {
      logger.error("[UnifiedJournalEntryForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  return (
    <View style={{ flex: 1 }} testID="unified-journal-entry-form">
      {/* Header for mock exam mode */}
      {mode === "mock_exam" && questionNumber && totalQuestions && (
        <View style={headerStyles.header}>
          <Text style={headerStyles.questionInfo}>
            問{questionNumber} / {totalQuestions}
          </Text>
          {timeRemaining && (
            <Text style={headerStyles.timeRemaining}>残り {timeRemaining}</Text>
          )}
        </View>
      )}

      {/* 統合されたフォーム表示 */}
      <View style={formStyles.container}>
        {/* 借方セクション */}
        <View style={formStyles.section}>
          <Text style={formStyles.sectionTitle}>借方</Text>
          {debits.map((debit, index) => (
            <View key={index} style={formStyles.entryRow}>
              <TouchableOpacity
                style={formStyles.accountButton}
                onPress={() => showAccountSelector("debit", index)}
                testID={`debit-account-dropdown-${index}`}
              >
                <Text style={formStyles.accountButtonText}>
                  {debit.account || "勘定科目を選択"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={formStyles.amountInput}
                value={debit.amount > 0 ? debit.amount.toString() : ""}
                onChangeText={(text) => updateDebit(index, "amount", text)}
                placeholder="金額"
                keyboardType="numeric"
                testID={`debit-amount-input-${index}`}
              />
              {debits.length > 1 && (
                <TouchableOpacity
                  style={formStyles.removeButton}
                  onPress={() => removeDebitRow(index)}
                >
                  <Text>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={formStyles.addButton} onPress={addDebitRow}>
            <Text>+ 行を追加</Text>
          </TouchableOpacity>
        </View>

        {/* 貸方セクション */}
        <View style={formStyles.section}>
          <Text style={formStyles.sectionTitle}>貸方</Text>
          {credits.map((credit, index) => (
            <View key={index} style={formStyles.entryRow}>
              <TouchableOpacity
                style={formStyles.accountButton}
                onPress={() => showAccountSelector("credit", index)}
                testID={`credit-account-dropdown-${index}`}
              >
                <Text style={formStyles.accountButtonText}>
                  {credit.account || "勘定科目を選択"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={formStyles.amountInput}
                value={credit.amount > 0 ? credit.amount.toString() : ""}
                onChangeText={(text) => updateCredit(index, "amount", text)}
                placeholder="金額"
                keyboardType="numeric"
                testID={`credit-amount-input-${index}`}
              />
              {credits.length > 1 && (
                <TouchableOpacity
                  style={formStyles.removeButton}
                  onPress={() => removeCreditRow(index)}
                >
                  <Text>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={formStyles.addButton} onPress={addCreditRow}>
            <Text>+ 行を追加</Text>
          </TouchableOpacity>
        </View>

        {/* ボタンセクション */}
        <View style={formStyles.buttonContainer}>
          {mode === "mock_exam" && onPrevious && (
            <Button
              title="前の問題"
              onPress={onPrevious}
              variant="secondary"
              style={formStyles.navButton}
            />
          )}

          {showSubmitButton && (
            <Button
              title="解答する"
              onPress={validateAndSubmit}
              disabled={formState.isSubmitting}
              style={formStyles.submitButton}
              testID="submit-answer-button"
            />
          )}

          {mode === "mock_exam" && onNext && (
            <Button
              title="次の問題"
              onPress={onNext}
              variant="secondary"
              style={formStyles.navButton}
              testID="next-question-button"
            />
          )}
        </View>
      </View>

      {/* Account selection modal */}
      <JournalAccountSelector
        visible={modalVisible}
        onSelect={selectAccountFromModal}
        onClose={() => setModalVisible(false)}
        currentSelection={currentSelection}
      />
    </View>
  );
});

export default UnifiedJournalEntryForm;

// Header styles
const headerStyles = {
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  questionInfo: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#333",
  },
  timeRemaining: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600" as const,
  },
};

// Form styles
const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  accountButton: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    backgroundColor: "#f9f9f9",
  },
  accountButtonText: {
    color: "#333",
    fontSize: 16,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
    backgroundColor: "#fff",
  },
  removeButton: {
    marginLeft: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4444",
    borderRadius: 15,
  },
  addButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  navButton: {
    flex: 0.4,
    marginHorizontal: 4,
  },
});
