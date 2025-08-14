/**
 * 共通コンポーネント・ユーティリティ エクスポート
 * 簿記3級問題集アプリ - フォーム共通化
 */

// 型定義
export type {
  JournalEntry,
  LedgerEntry,
  TrialBalanceEntry,
  BaseFormProps,
  MockExamFormProps,
  AccountOption,
  FormState,
  BaseAnswerData,
} from "./FormTypes";

// 勘定科目オプション
export {
  STANDARD_ACCOUNT_OPTIONS,
  getAccountsByCategory,
  getAccountType,
} from "./AccountOptions";

// フォームユーティリティ
export {
  createInitialFormState,
  FormErrorManager,
  validateAmount,
  validateAccount,
  validateDate,
  validateDescription,
  createSubmitAnswerRequest,
  formatAmount,
  parseAmount,
  removeDuplicateEntries,
  resetFormState,
  debounce,
} from "./FormUtils";
