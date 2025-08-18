/**
 * リファクタリング版 統合帳簿エントリフォーム
 * LedgerEntryForm分割 - Phase 2
 *
 * 元の1038行から約200行に削減
 * 学習モードと模試モードを分離したコンポーネントで構成
 */

import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import { logger } from "../../utils/logger";
import { UnifiedFormProps } from "../shared/FormTypes";
import { LearningModeEntryForm } from "./LearningModeEntryForm";
import { MockExamModeEntryForm } from "./MockExamModeEntryForm";
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

  // Render appropriate form based on mode
  if (mode === "learning") {
    return (
      <LearningModeEntryForm
        entries={learningEntries}
        onAddEntry={addLearningEntry}
        onRemoveEntry={removeLearningEntry}
        onUpdateEntry={updateLearningEntry}
        onSubmit={validateAndSubmit}
        isSubmitting={formState.isSubmitting}
        showSubmitButton={showSubmitButton}
      />
    );
  } else {
    return (
      <>
        <MockExamModeEntryForm
          entries={mockExamEntries}
          onAddEntry={addMockExamEntry}
          onRemoveEntry={removeMockExamEntry}
          onUpdateEntry={updateMockExamEntry}
          onAccountSelect={showAccountSelector}
          onSubmit={validateAndSubmit}
          onNext={onNext}
          onPrevious={onPrevious}
          explanation={explanation}
          questionText={questionText}
        />

        {/* Account selection modal (模試モード用) */}
        <AccountSelector
          visible={modalVisible}
          onSelect={selectAccountFromModal}
          onClose={() => setModalVisible(false)}
          currentSelection={currentSelection}
          onAccountSelect={handleIOSAccountSelection}
        />
      </>
    );
  }
});

export default UnifiedLedgerEntryForm;
