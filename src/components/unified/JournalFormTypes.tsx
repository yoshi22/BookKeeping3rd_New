/**
 * 仕訳エントリフォーム共通型定義
 * JournalEntryForm分割 - Phase 3
 */

import { JournalEntry, UnifiedFormProps } from "../shared/FormTypes";

export { JournalEntry };

export interface JournalFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface JournalSelectionState {
  type: "debit" | "credit";
  index: number;
}

export interface JournalFormValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LearningModeJournalProps {
  debits: JournalEntry[];
  credits: JournalEntry[];
  onAddDebit: () => void;
  onRemoveDebit: (index: number) => void;
  onUpdateDebit: (index: number, field: keyof JournalEntry, value: any) => void;
  onAddCredit: () => void;
  onRemoveCredit: (index: number) => void;
  onUpdateCredit: (
    index: number,
    field: keyof JournalEntry,
    value: any,
  ) => void;
  onAccountSelect: (type: "debit" | "credit", index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  showSubmitButton: boolean;
}

export interface MockExamModeJournalProps {
  debits: JournalEntry[];
  credits: JournalEntry[];
  onAddDebit: () => void;
  onRemoveDebit: (index: number) => void;
  onUpdateDebit: (index: number, field: keyof JournalEntry, value: any) => void;
  onAddCredit: () => void;
  onRemoveCredit: (index: number) => void;
  onUpdateCredit: (
    index: number,
    field: keyof JournalEntry,
    value: any,
  ) => void;
  onAccountSelect: (type: "debit" | "credit", index: number) => void;
  onSubmit: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  explanation?: string;
  questionText?: string;
  onShowExplanation?: () => void;
}

export interface JournalAccountSelectorProps {
  visible: boolean;
  onSelect: (account: { label: string; value: string }) => void;
  onClose: () => void;
  currentSelection: JournalSelectionState | null;
}

export interface UnifiedJournalEntryFormProps extends UnifiedFormProps {
  // JournalEntry特有のプロパティ
  onSubmit?: (debits: JournalEntry[], credits: JournalEntry[]) => void;
  answerTemplate?: {
    type?: string;
    journalEntry?: Array<{
      debit_account: string;
      debit_amount: number;
      credit_account: string;
      credit_amount: number;
    }>;
  };
}
