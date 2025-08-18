/**
 * 帳簿エントリフォーム ユーティリティ関数
 * LedgerEntryForm分割 - Phase 2
 */

import { Alert } from "react-native";
import { logger } from "../../utils/logger";
import { SessionType } from "../../types/database";
import {
  LedgerEntry,
  MockExamLedgerEntry,
  LedgerFormState,
  LedgerFormValidationResult,
} from "./LedgerFormTypes";
import {
  answerService,
  SubmitAnswerRequest,
} from "../../services/answer-service";

/**
 * 初期フォーム状態を作成
 */
export const createInitialLedgerFormState = (): LedgerFormState => ({
  isSubmitting: false,
  errors: {},
});

/**
 * 初期学習モードエントリを作成
 */
export const createInitialLearningEntry = (): LedgerEntry => ({
  date: "",
  description: "",
  receipt_amount: 0,
  payment_amount: 0,
});

/**
 * 初期模試モードエントリを作成
 */
export const createInitialMockExamEntry = (): MockExamLedgerEntry => ({
  date: "",
  description: "",
  debitAccount: "",
  debitAmount: 0,
  creditAccount: "",
  creditAmount: 0,
});

/**
 * 金額をフォーマット（3桁区切り）
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("ja-JP");
};

/**
 * 学習モードエントリの検証
 */
export const validateLearningEntries = (
  entries: LedgerEntry[],
): LedgerFormValidationResult => {
  const errors: string[] = [];

  const validEntries = entries.filter(
    (entry) =>
      entry.date.trim() ||
      entry.description.trim() ||
      entry.receipt_amount > 0 ||
      entry.payment_amount > 0,
  );

  if (validEntries.length === 0) {
    errors.push("少なくとも1つの有効なエントリを入力してください。");
  }

  // 各エントリの詳細検証
  validEntries.forEach((entry, index) => {
    if (!entry.date.trim()) {
      errors.push(`エントリー ${index + 1}: 日付を入力してください。`);
    }

    if (!entry.description.trim()) {
      errors.push(`エントリー ${index + 1}: 摘要を入力してください。`);
    }

    if (entry.receipt_amount <= 0 && entry.payment_amount <= 0) {
      errors.push(`エントリー ${index + 1}: 金額を入力してください。`);
    }

    if (entry.receipt_amount > 0 && entry.payment_amount > 0) {
      errors.push(
        `エントリー ${index + 1}: 入金・出金の両方に金額が入力されています。どちらか一方のみ入力してください。`,
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 模試モードエントリの検証
 */
export const validateMockExamEntries = (
  entries: MockExamLedgerEntry[],
): LedgerFormValidationResult => {
  const errors: string[] = [];

  const validEntries = entries.filter(
    (entry) =>
      entry.date.trim() ||
      entry.description.trim() ||
      entry.debitAccount.trim() ||
      entry.creditAccount.trim() ||
      entry.debitAmount > 0 ||
      entry.creditAmount > 0,
  );

  if (validEntries.length === 0) {
    errors.push("少なくとも1つの有効なエントリを入力してください。");
  }

  // 各エントリの詳細検証
  validEntries.forEach((entry, index) => {
    if (!entry.date.trim()) {
      errors.push(`エントリー ${index + 1}: 日付を入力してください。`);
    }

    if (!entry.description.trim()) {
      errors.push(`エントリー ${index + 1}: 摘要を入力してください。`);
    }

    if (!entry.debitAccount.trim()) {
      errors.push(`エントリー ${index + 1}: 借方勘定科目を選択してください。`);
    }

    if (!entry.creditAccount.trim()) {
      errors.push(`エントリー ${index + 1}: 貸方勘定科目を選択してください。`);
    }

    if (entry.debitAmount <= 0) {
      errors.push(`エントリー ${index + 1}: 借方金額を入力してください。`);
    }

    if (entry.creditAmount <= 0) {
      errors.push(`エントリー ${index + 1}: 貸方金額を入力してください。`);
    }

    if (entry.debitAmount !== entry.creditAmount) {
      errors.push(
        `エントリー ${index + 1}: 借方と貸方の金額が一致していません。`,
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 学習モード用解答リクエスト作成
 */
export const createLearningAnswerRequest = (
  questionId: string,
  entries: LedgerEntry[],
  sessionType: SessionType,
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  const validEntries = entries.filter(
    (entry) =>
      entry.date.trim() ||
      entry.description.trim() ||
      entry.receipt_amount > 0 ||
      entry.payment_amount > 0,
  );

  return {
    questionId,
    answerData: {
      questionType: "ledger",
      ledgerEntry: {
        entries: validEntries,
      },
    },
    sessionType,
    sessionId,
    startTime,
  };
};

/**
 * 模試モード用解答リクエスト作成
 */
export const createMockExamAnswerRequest = (
  questionId: string,
  entries: MockExamLedgerEntry[],
  sessionType: SessionType,
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  const validEntries = entries.filter(
    (entry) =>
      entry.date.trim() ||
      entry.description.trim() ||
      entry.debitAccount.trim() ||
      entry.creditAccount.trim() ||
      entry.debitAmount > 0 ||
      entry.creditAmount > 0,
  );

  return {
    questionId,
    answerData: {
      questionType: "ledger",
      ledgerEntry: {
        entries: validEntries,
      },
    },
    sessionType,
    sessionId,
    startTime,
  };
};

/**
 * 学習モード解答送信
 */
export const submitLearningAnswer = async (
  request: SubmitAnswerRequest,
  onSubmitAnswer?: (response: any) => void,
): Promise<void> => {
  try {
    logger.debug("[LedgerFormUtils] 学習モード解答送信開始:", {
      details: request.questionId,
    });

    const response = await answerService.submitAnswer(request);

    logger.debug("[LedgerFormUtils] 学習モード解答送信完了:", {
      details: response,
    });

    if (onSubmitAnswer) {
      onSubmitAnswer(response);
    }
  } catch (error) {
    logger.error("[LedgerFormUtils] 学習モード解答送信エラー:", error as Error);
    throw error;
  }
};

/**
 * 検証エラーをアラート表示
 */
export const showValidationErrors = (errors: string[]): void => {
  Alert.alert("入力エラー", errors.join("\n"));
};

/**
 * 数値入力のパース
 */
export const parseNumericInput = (value: string): number => {
  return parseInt(value.replace(/,/g, "")) || 0;
};
