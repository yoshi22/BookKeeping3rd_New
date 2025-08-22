/**
 * リファクタリング版 統合帳簿エントリフォーム
 * LedgerEntryForm分割 - Phase 2
 *
 * 元の1038行から約200行に削減
 * 学習モードと模試モードを分離したコンポーネントで構成
 */

import React, { useState } from "react";
import {
  Alert,
  Platform,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Button } from "../ui/Button";
import { logger } from "../../utils/logger";
import { UnifiedFormProps } from "../shared/FormTypes";
// 削除されたコンポーネントのインポートを除去
import { AccountSelector, showIOSAccountSelector } from "./AccountSelector";
import {
  LedgerEntry,
  MockExamLedgerEntry,
  LedgerFormState,
  AccountSelectionState,
} from "./LedgerFormTypes";
import {
  createInitialLedgerFormState,
  createInitialLearningEntry,
  createInitialMockExamEntry,
  validateLearningEntries,
  validateMockExamEntries,
  createLearningAnswerRequest,
  createMockExamAnswerRequest,
  submitLearningAnswer,
  showValidationErrors,
} from "./LedgerFormUtils";

export interface UnifiedLedgerEntryFormProps extends UnifiedFormProps {
  expectedEntries?: number; // 期待されるエントリ数
  // 模試モード用のコールバック
  onSubmit?: (entries: MockExamLedgerEntry[]) => void;
}

const UnifiedLedgerEntryForm = React.memo(function UnifiedLedgerEntryForm({
  questionId,
  questionText,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
  expectedEntries = 1,

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
}: UnifiedLedgerEntryFormProps) {
  // Form state
  const [formState, setFormState] = useState<LedgerFormState>(
    createInitialLedgerFormState(),
  );

  // Modal state for account selection
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] =
    useState<AccountSelectionState | null>(null);

  // Entry state - 学習モードと模試モードで異なる形式
  const [learningEntries, setLearningEntries] = useState<LedgerEntry[]>([
    createInitialLearningEntry(),
  ]);

  const [mockExamEntries, setMockExamEntries] = useState<MockExamLedgerEntry[]>(
    [createInitialMockExamEntry()],
  );

  // Entry management for learning mode
  const addLearningEntry = () => {
    setLearningEntries([...learningEntries, createInitialLearningEntry()]);
  };

  const removeLearningEntry = (index: number) => {
    if (learningEntries.length > 1) {
      setLearningEntries(learningEntries.filter((_, i) => i !== index));
    }
  };

  const updateLearningEntry = (
    index: number,
    field: keyof LedgerEntry,
    value: any,
  ) => {
    setLearningEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  // Entry management for mock exam mode
  const addMockExamEntry = () => {
    setMockExamEntries([...mockExamEntries, createInitialMockExamEntry()]);
  };

  const removeMockExamEntry = (index: number) => {
    if (mockExamEntries.length > 1) {
      setMockExamEntries(mockExamEntries.filter((_, i) => i !== index));
    }
  };

  const updateMockExamEntry = (
    index: number,
    field: keyof MockExamLedgerEntry,
    value: any,
  ) => {
    const newEntries = [...mockExamEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setMockExamEntries(newEntries);
  };

  // Account selection for learning mode
  const showLearningAccountSelector = (index: number) => {
    if (Platform.OS === "ios") {
      showIOSAccountSelector(
        "debitAccount",
        index,
        (type: any, idx: number, account: string) => {
          updateLearningEntry(idx, "account", account);
        },
      );
    } else {
      setCurrentSelection({ type: "debitAccount", index });
      setModalVisible(true);
    }
  };

  // Account selection for mock exam mode
  const showAccountSelector = (
    type: "debitAccount" | "creditAccount",
    index: number,
  ) => {
    if (Platform.OS === "ios") {
      showIOSAccountSelector(type, index, handleIOSAccountSelection);
    } else {
      setCurrentSelection({ type, index });
      setModalVisible(true);
    }
  };

  const handleIOSAccountSelection = (
    type: "debitAccount" | "creditAccount",
    index: number,
    account: string,
  ) => {
    updateMockExamEntry(index, type, account);
  };

  const selectAccountFromModal = (account: {
    label: string;
    value: string;
  }) => {
    if (currentSelection) {
      updateMockExamEntry(
        currentSelection.index,
        currentSelection.type,
        account.value,
      );
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  // Validation and submission
  const validateAndSubmit = async () => {
    if (formState.isSubmitting) return;

    try {
      setFormState({ ...formState, isSubmitting: true });

      if (mode === "learning") {
        // 学習モード: LedgerEntry形式
        const validation = validateLearningEntries(learningEntries);
        if (!validation.isValid) {
          showValidationErrors(validation.errors);
          return;
        }

        const request = createLearningAnswerRequest(
          questionId,
          learningEntries,
          sessionType,
          sessionId,
          startTime,
        );

        await submitLearningAnswer(request, onSubmitAnswer);
      } else {
        // 模試モード: MockExamLedgerEntry形式
        const validation = validateMockExamEntries(mockExamEntries);
        if (!validation.isValid) {
          showValidationErrors(validation.errors);
          return;
        }

        if (onSubmit) {
          onSubmit(mockExamEntries);
        } else if (onDirectSubmit) {
          const request = createMockExamAnswerRequest(
            questionId,
            mockExamEntries,
            sessionType,
            sessionId,
            startTime,
          );
          onDirectSubmit(request);
        }
      }

      logger.debug("[LedgerEntryForm] 解答送信完了");
    } catch (error) {
      logger.error("[LedgerEntryForm] 解答送信エラー:", error as Error);
      Alert.alert(
        "エラー",
        "解答の送信中にエラーが発生しました。もう一度お試しください。",
      );
    } finally {
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  // 統合されたフォーム表示
  return (
    <View style={formStyles.container}>
      {/* エントリセクション */}
      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>帳簿エントリ</Text>
        {mode === "learning"
          ? learningEntries.map((entry, index) => (
              <View key={index} style={formStyles.entryRow}>
                <TouchableOpacity
                  style={formStyles.accountButton}
                  onPress={() => showLearningAccountSelector(index)}
                >
                  <Text style={formStyles.accountButtonText}>
                    {entry.account || "勘定科目を選択"}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={formStyles.amountInput}
                  value={entry.amount > 0 ? entry.amount.toString() : ""}
                  onChangeText={(text) =>
                    updateLearningEntry(index, "amount", text)
                  }
                  placeholder="金額"
                  keyboardType="numeric"
                />
                {learningEntries.length > 1 && (
                  <TouchableOpacity
                    style={formStyles.removeButton}
                    onPress={() => removeLearningEntry(index)}
                  >
                    <Text style={formStyles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          : mockExamEntries.map((entry, index) => (
              <View key={index} style={formStyles.entryRow}>
                <TouchableOpacity
                  style={formStyles.accountButton}
                  onPress={() => showAccountSelector("debitAccount", index)}
                >
                  <Text style={formStyles.accountButtonText}>
                    {entry.account || "勘定科目を選択"}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={formStyles.amountInput}
                  value={entry.amount > 0 ? entry.amount.toString() : ""}
                  onChangeText={(text) =>
                    updateMockExamEntry(index, "amount", text)
                  }
                  placeholder="金額"
                  keyboardType="numeric"
                />
                {mockExamEntries.length > 1 && (
                  <TouchableOpacity
                    style={formStyles.removeButton}
                    onPress={() => removeMockExamEntry(index)}
                  >
                    <Text style={formStyles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

        <TouchableOpacity
          style={formStyles.addButton}
          onPress={mode === "learning" ? addLearningEntry : addMockExamEntry}
        >
          <Text style={formStyles.addButtonText}>+ エントリを追加</Text>
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
          />
        )}

        {mode === "mock_exam" && onNext && (
          <Button
            title="次の問題"
            onPress={onNext}
            variant="secondary"
            style={formStyles.navButton}
          />
        )}
      </View>

      {/* Account selection modal */}
      <AccountSelector
        visible={modalVisible}
        onSelect={selectAccountFromModal}
        onClose={() => setModalVisible(false)}
        currentSelection={currentSelection}
        onAccountSelect={handleIOSAccountSelection}
      />
    </View>
  );
});

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
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
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

export default UnifiedLedgerEntryForm;
