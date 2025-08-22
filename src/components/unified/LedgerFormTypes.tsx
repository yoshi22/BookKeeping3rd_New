/**
 * 帳簿エントリフォーム共通型定義
 * LedgerEntryForm分割 - Phase 2
 */

export interface MockExamLedgerEntry {
  date: string;
  description: string;
  account: string;
  amount: number;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
}

export interface LedgerEntry {
  date: string;
  description: string;
  account: string;
  amount: number;
  receipt_amount: number;
  payment_amount: number;
}

export interface LedgerFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface AccountSelectionState {
  type: "debitAccount" | "creditAccount";
  index: number;
}

export interface LedgerFormValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LearningModeProps {
  entries: LedgerEntry[];
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  onUpdateEntry: (index: number, field: keyof LedgerEntry, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  showSubmitButton: boolean;
}

export interface MockExamModeProps {
  entries: MockExamLedgerEntry[];
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  onUpdateEntry: (
    index: number,
    field: keyof MockExamLedgerEntry,
    value: any,
  ) => void;
  onAccountSelect: (
    type: "debitAccount" | "creditAccount",
    index: number,
  ) => void;
  onSubmit: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  explanation?: string;
  questionText?: string;
  onShowExplanation?: () => void;
}

export interface AccountSelectorProps {
  visible: boolean;
  onSelect: (account: { label: string; value: string }) => void;
  onClose: () => void;
  currentSelection: AccountSelectionState | null;
}
