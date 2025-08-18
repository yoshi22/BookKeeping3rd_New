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
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import { SessionType } from "../../types/database";

// 分割コンポーネントのインポート
import { LearningModeJournalForm } from "./LearningModeJournalForm";
import { MockExamModeJournalForm } from "./MockExamModeJournalForm";
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
  createMockExamJournalAnswerRequest,
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
  const { theme } = useTheme();

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

      {/* Mode-specific form rendering */}
      {mode === "learning" ? (
        <LearningModeJournalForm
          debits={debits}
          credits={credits}
          onAddDebit={addDebitRow}
          onRemoveDebit={removeDebitRow}
          onUpdateDebit={updateDebit}
          onAddCredit={addCreditRow}
          onRemoveCredit={removeCreditRow}
          onUpdateCredit={updateCredit}
          onAccountSelect={showAccountSelector}
          onSubmit={validateAndSubmit}
          isSubmitting={formState.isSubmitting}
          showSubmitButton={showSubmitButton}
        />
      ) : (
        <MockExamModeJournalForm
          debits={debits}
          credits={credits}
          onAddDebit={addDebitRow}
          onRemoveDebit={removeDebitRow}
          onUpdateDebit={updateDebit}
          onAddCredit={addCreditRow}
          onRemoveCredit={removeCreditRow}
          onUpdateCredit={updateCredit}
          onAccountSelect={showAccountSelector}
          onSubmit={validateAndSubmit}
          onNext={onNext}
          onPrevious={onPrevious}
          explanation={explanation}
          questionText={questionText}
        />
      )}

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
