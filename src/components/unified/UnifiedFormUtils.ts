/**
 * 統合フォームユーティリティ
 * Phase 12: Component Integration
 *
 * FormUtils、JournalFormUtils、LedgerFormUtilsを統合
 * 全ての問題タイプ（仕訳・帳簿・試算表）のフォーム処理を統一
 */

import { Alert } from "react-native";
import { logger } from "../../utils/logger";
import { SessionType } from "../../types/database";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../../services/answer-service";

// ================================
// 型定義（統合版）
// ================================

/**
 * 仕訳エントリ
 */
export interface JournalEntry {
  account: string;
  amount: number;
  type?: "debit" | "credit"; // 借方・貸方の識別
}

/**
 * 帳簿エントリ
 */
export interface LedgerEntry {
  date?: string;
  description?: string;
  account?: string;
  amount: number;
  receipt_amount?: number;
  payment_amount?: number;
}

/**
 * 模試用仕訳エントリ（拡張版）
 */
export interface MockExamJournalEntry {
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
}

/**
 * 模試用帳簿エントリ（拡張版）
 */
export interface MockExamLedgerEntry {
  account: string;
  amount: number;
  debitAccount?: string;
  creditAccount?: string;
}

/**
 * 試算表エントリ
 */
export interface TrialBalanceEntry {
  accountName: string;
  debitAmount: number;
  creditAmount: number;
}

/**
 * 勘定科目オプション
 */
export interface AccountOption {
  label: string;
  value: string;
  category?: "asset" | "liability" | "equity" | "revenue" | "expense";
}

/**
 * フォーム状態
 */
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Record<string, string>;
}

/**
 * 共通フォームベースプロパティ
 */
export interface BaseFormProps {
  questionId: string;
  questionText?: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

/**
 * 統合フォームプロパティ
 */
export interface UnifiedFormProps extends BaseFormProps {
  // 模試モード固有（オプション）
  questionNumber?: number;
  totalQuestions?: number;
  timeRemaining?: string;
  explanation?: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
  showExplanation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;

  // モード切り替え
  mode?: "learning" | "mock_exam";

  // 模試モード用の直接送信コールバック
  onDirectSubmit?: (data: any) => void;
}

// ================================
// フォーム状態管理
// ================================

/**
 * 初期フォーム状態を作成
 */
export const createInitialFormState = (): FormState => ({
  isSubmitting: false,
  errors: {},
  isDirty: false,
});

/**
 * フォームエラー管理クラス
 */
export class FormErrorManager {
  private errors: Record<string, string> = {};

  setError(field: string, message: string): void {
    this.errors[field] = message;
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  clearAllErrors(): void {
    this.errors = {};
  }

  getError(field: string): string | undefined {
    return this.errors[field];
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getAllErrors(): Record<string, string> {
    return { ...this.errors };
  }

  getErrorMessages(): string[] {
    return Object.values(this.errors);
  }
}

// ================================
// エントリ作成関数
// ================================

/**
 * 初期仕訳エントリを作成（学習モード）
 */
export const createInitialJournalEntry = (): JournalEntry => ({
  account: "",
  amount: 0,
});

/**
 * 初期帳簿エントリを作成（学習モード）
 */
export const createInitialLedgerEntry = (): LedgerEntry => ({
  account: "",
  amount: 0,
});

/**
 * 初期模試仕訳エントリを作成
 */
export const createInitialMockExamJournalEntry = (): MockExamJournalEntry => ({
  debitAccount: "",
  debitAmount: 0,
  creditAccount: "",
  creditAmount: 0,
});

/**
 * 初期模試帳簿エントリを作成
 */
export const createInitialMockExamLedgerEntry = (): MockExamLedgerEntry => ({
  account: "",
  amount: 0,
});

// ================================
// バリデーション関数
// ================================

/**
 * 金額バリデーション
 */
export const validateAmount = (
  value: any,
): { isValid: boolean; error?: string } => {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: "有効な数値を入力してください" };
  }

  if (numValue < 0) {
    return { isValid: false, error: "金額は0以上で入力してください" };
  }

  if (numValue > 99999999) {
    return { isValid: false, error: "金額が大きすぎます（99,999,999円以下）" };
  }

  return { isValid: true };
};

/**
 * 勘定科目バリデーション
 */
export const validateAccount = (
  account: string,
): { isValid: boolean; error?: string } => {
  if (!account || account.trim() === "") {
    return { isValid: false, error: "勘定科目を選択してください" };
  }

  if (account === "勘定科目を選択" || account === "") {
    return { isValid: false, error: "有効な勘定科目を選択してください" };
  }

  return { isValid: true };
};

/**
 * 仕訳エントリバリデーション（学習モード）
 */
export const validateJournalEntries = (
  entries: JournalEntry[],
): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  if (entries.length === 0) {
    errors.push("最低1つの仕訳エントリが必要です");
    return { isValid: false, errors, fieldErrors };
  }

  entries.forEach((entry, index) => {
    const accountValidation = validateAccount(entry.account);
    if (!accountValidation.isValid) {
      fieldErrors[`account-${index}`] = accountValidation.error || "";
      errors.push(`${index + 1}行目: ${accountValidation.error}`);
    }

    const amountValidation = validateAmount(entry.amount);
    if (!amountValidation.isValid) {
      fieldErrors[`amount-${index}`] = amountValidation.error || "";
      errors.push(`${index + 1}行目: ${amountValidation.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
};

/**
 * 帳簿エントリバリデーション（学習モード）
 */
export const validateLedgerEntries = (
  entries: LedgerEntry[],
): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  if (entries.length === 0) {
    errors.push("最低1つの帳簿エントリが必要です");
    return { isValid: false, errors, fieldErrors };
  }

  entries.forEach((entry, index) => {
    if (entry.account) {
      const accountValidation = validateAccount(entry.account);
      if (!accountValidation.isValid) {
        fieldErrors[`account-${index}`] = accountValidation.error || "";
        errors.push(`${index + 1}行目: ${accountValidation.error}`);
      }
    }

    const amountValidation = validateAmount(entry.amount);
    if (!amountValidation.isValid) {
      fieldErrors[`amount-${index}`] = amountValidation.error || "";
      errors.push(`${index + 1}行目: ${amountValidation.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
};

/**
 * 模試仕訳エントリバリデーション
 */
export const validateMockExamJournalEntries = (
  entries: MockExamJournalEntry[],
): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  if (entries.length === 0) {
    errors.push("最低1つの仕訳エントリが必要です");
    return { isValid: false, errors, fieldErrors };
  }

  entries.forEach((entry, index) => {
    // Debit account validation
    const debitAccountValidation = validateAccount(entry.debitAccount);
    if (!debitAccountValidation.isValid) {
      fieldErrors[`debitAccount-${index}`] = debitAccountValidation.error || "";
      errors.push(`${index + 1}行目（借方）: ${debitAccountValidation.error}`);
    }

    // Credit account validation
    const creditAccountValidation = validateAccount(entry.creditAccount);
    if (!creditAccountValidation.isValid) {
      fieldErrors[`creditAccount-${index}`] =
        creditAccountValidation.error || "";
      errors.push(`${index + 1}行目（貸方）: ${creditAccountValidation.error}`);
    }

    // Debit amount validation
    const debitAmountValidation = validateAmount(entry.debitAmount);
    if (!debitAmountValidation.isValid) {
      fieldErrors[`debitAmount-${index}`] = debitAmountValidation.error || "";
      errors.push(
        `${index + 1}行目（借方金額）: ${debitAmountValidation.error}`,
      );
    }

    // Credit amount validation
    const creditAmountValidation = validateAmount(entry.creditAmount);
    if (!creditAmountValidation.isValid) {
      fieldErrors[`creditAmount-${index}`] = creditAmountValidation.error || "";
      errors.push(
        `${index + 1}行目（貸方金額）: ${creditAmountValidation.error}`,
      );
    }

    // Balance validation
    if (entry.debitAmount !== entry.creditAmount) {
      const balanceError = "借方・貸方の金額が一致しません";
      fieldErrors[`balance-${index}`] = balanceError;
      errors.push(`${index + 1}行目: ${balanceError}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
};

// ================================
// ユーティリティ関数
// ================================

/**
 * 金額フォーマット
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * 金額パース
 */
export const parseAmount = (value: string): number => {
  const cleanValue = value.replace(/[^\d.-]/g, "");
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * 重複エントリ削除
 */
export const removeDuplicateEntries = <T extends { account: string }>(
  entries: T[],
): T[] => {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.account)) {
      return false;
    }
    seen.add(entry.account);
    return true;
  });
};

/**
 * バリデーションエラー表示
 */
export const showValidationErrors = (errors: string[]): void => {
  if (errors.length === 0) return;

  const message =
    errors.length === 1
      ? errors[0]
      : `以下の項目を修正してください:\n\n${errors.map((error, index) => `${index + 1}. ${error}`).join("\n")}`;

  Alert.alert("入力エラー", message);
};

// ================================
// リクエスト作成関数
// ================================

/**
 * 学習モード仕訳解答リクエスト作成
 */
export const createJournalAnswerRequest = (
  questionId: string,
  entries: JournalEntry[],
  sessionType: SessionType = "learning",
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  // JournalEntryを適切な形式に変換
  const debitEntry = entries.find((e) => e.type === "debit");
  const creditEntry = entries.find((e) => e.type === "credit");

  return {
    questionId,
    answerData: {
      questionType: "journal",
      journalEntry:
        debitEntry && creditEntry
          ? {
              debit: { account: debitEntry.account, amount: debitEntry.amount },
              credit: {
                account: creditEntry.account,
                amount: creditEntry.amount,
              },
            }
          : undefined,
    },
    sessionType,
    sessionId,
    startTime,
  };
};

/**
 * 学習モード帳簿解答リクエスト作成
 */
export const createLedgerAnswerRequest = (
  questionId: string,
  entries: LedgerEntry[],
  sessionType: SessionType = "learning",
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => ({
  questionId,
  answerData: {
    questionType: "ledger",
    ledgerEntry: {
      entries: entries.map((e) => ({
        account: e.account,
        description: e.description,
        amount: e.amount,
        date: e.date,
        receipt_amount: e.receipt_amount,
        payment_amount: e.payment_amount,
      })),
    },
  },
  sessionType,
  sessionId,
  startTime,
});

/**
 * 模試モード仕訳解答リクエスト作成
 */
export const createMockExamJournalAnswerRequest = (
  questionId: string,
  entries: MockExamJournalEntry[],
  sessionType: SessionType = "mock_exam",
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  // MockExamJournalEntryを適切な形式に変換
  const firstEntry = entries[0];

  return {
    questionId,
    answerData: {
      questionType: "journal",
      journalEntry: firstEntry
        ? {
            debit: {
              account: firstEntry.debitAccount,
              amount: firstEntry.debitAmount,
            },
            credit: {
              account: firstEntry.creditAccount,
              amount: firstEntry.creditAmount,
            },
          }
        : undefined,
    },
    sessionType,
    sessionId,
    startTime,
  };
};

/**
 * 模試モード帳簿解答リクエスト作成
 */
export const createMockExamLedgerAnswerRequest = (
  questionId: string,
  entries: MockExamLedgerEntry[],
  sessionType: SessionType = "mock_exam",
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => ({
  questionId,
  answerData: {
    questionType: "ledger",
    ledgerEntry: {
      entries: entries.map((e) => ({
        account: e.account,
        amount: e.amount,
        debitAccount: e.debitAccount,
        creditAccount: e.creditAccount,
      })),
    },
  },
  sessionType,
  sessionId,
  startTime,
});

// ================================
// 解答送信関数
// ================================

/**
 * 学習モード解答送信
 */
export const submitLearningAnswer = async (
  request: SubmitAnswerRequest,
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void,
): Promise<void> => {
  try {
    const response = await answerService.submitAnswer(request);

    if (onSubmitAnswer) {
      onSubmitAnswer(response);
    } else {
      // Default result display
      Alert.alert(
        response.isCorrect ? "正解！" : "不正解",
        response.isCorrect
          ? "正解です。よくできました！"
          : "不正解です。解説を確認して復習しましょう。",
        [{ text: "OK" }],
      );
    }
  } catch (error) {
    logger.error(
      "[UnifiedFormUtils] 学習モード解答送信エラー:",
      error as Error,
    );
    throw error;
  }
};

/**
 * 模試モード解答送信
 */
export const submitMockExamAnswer = async (
  request: SubmitAnswerRequest,
  onDirectSubmit?: (data: any) => void,
): Promise<void> => {
  try {
    if (onDirectSubmit) {
      onDirectSubmit(request);
    } else {
      const response = await answerService.submitAnswer(request);
      logger.info("[UnifiedFormUtils] 模試解答送信完了", {
        questionId: request.questionId,
      });
    }
  } catch (error) {
    logger.error(
      "[UnifiedFormUtils] 模試モード解答送信エラー:",
      error as Error,
    );
    throw error;
  }
};

// ================================
// 便利な結合関数
// ================================

/**
 * 統合バリデーション関数
 */
export const validateEntries = (
  entries: any[],
  mode: "learning" | "mock_exam",
  questionType: "journal" | "ledger",
): ValidationResult => {
  if (mode === "learning") {
    return questionType === "journal"
      ? validateJournalEntries(entries as JournalEntry[])
      : validateLedgerEntries(entries as LedgerEntry[]);
  } else {
    return questionType === "journal"
      ? validateMockExamJournalEntries(entries as MockExamJournalEntry[])
      : validateLedgerEntries(entries as LedgerEntry[]); // Use same validation for mock exam ledger
  }
};

/**
 * 統合解答送信関数
 */
export const submitAnswer = async (
  questionId: string,
  entries: any[],
  mode: "learning" | "mock_exam",
  questionType: "journal" | "ledger",
  sessionType: SessionType = "learning",
  sessionId?: string,
  startTime: number = Date.now(),
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void,
  onDirectSubmit?: (data: any) => void,
): Promise<void> => {
  const request =
    mode === "learning"
      ? questionType === "journal"
        ? createJournalAnswerRequest(
            questionId,
            entries,
            sessionType,
            sessionId,
            startTime,
          )
        : createLedgerAnswerRequest(
            questionId,
            entries,
            sessionType,
            sessionId,
            startTime,
          )
      : questionType === "journal"
        ? createMockExamJournalAnswerRequest(
            questionId,
            entries,
            sessionType,
            sessionId,
            startTime,
          )
        : createMockExamLedgerAnswerRequest(
            questionId,
            entries,
            sessionType,
            sessionId,
            startTime,
          );

  if (mode === "learning") {
    await submitLearningAnswer(request, onSubmitAnswer);
  } else {
    await submitMockExamAnswer(request, onDirectSubmit);
  }
};

export default {
  // Types
  FormErrorManager,

  // Form state
  createInitialFormState,

  // Entry creators
  createInitialJournalEntry,
  createInitialLedgerEntry,
  createInitialMockExamJournalEntry,
  createInitialMockExamLedgerEntry,

  // Validation
  validateAmount,
  validateAccount,
  validateJournalEntries,
  validateLedgerEntries,
  validateMockExamJournalEntries,
  validateEntries,
  showValidationErrors,

  // Utilities
  formatAmount,
  parseAmount,
  removeDuplicateEntries,

  // Submission
  submitAnswer,
  submitLearningAnswer,
  submitMockExamAnswer,
};
