/**
 * 仕訳エントリフォーム ユーティリティ関数
 * JournalEntryForm分割 - Phase 3
 */

import { Alert } from "react-native";
import { logger } from "../../utils/logger";
import { SessionType } from "../../types/database";
import {
  JournalEntry,
  JournalFormState,
  JournalFormValidationResult,
} from "./JournalFormTypes";
import {
  answerService,
  SubmitAnswerRequest,
} from "../../services/answer-service";
import { formatAmount, removeDuplicateEntries } from "../shared/FormUtils";

/**
 * 初期フォーム状態を作成
 */
export const createInitialJournalFormState = (): JournalFormState => ({
  isSubmitting: false,
  errors: {},
});

/**
 * 初期仕訳エントリを作成
 */
export const createInitialJournalEntry = (): JournalEntry => ({
  account: "",
  amount: 0,
});

/**
 * 金額表示フォーマット
 */
export const formatAmountDisplay = (amount: number): string => {
  return amount > 0 ? formatAmount(amount) : "";
};

/**
 * 仕訳エントリの検証
 */
export const validateJournalEntries = (
  debits: JournalEntry[],
  credits: JournalEntry[],
): JournalFormValidationResult => {
  const errors: string[] = [];

  // 有効なエントリをフィルタリング
  const validDebits = debits.filter(
    (entry) => entry.account && entry.amount > 0,
  );
  const validCredits = credits.filter(
    (entry) => entry.account && entry.amount > 0,
  );

  // 基本検証
  if (validDebits.length === 0) {
    errors.push("借方に少なくとも1つの仕訳を入力してください。");
  }

  if (validCredits.length === 0) {
    errors.push("貸方に少なくとも1つの仕訳を入力してください。");
  }

  // 借方・貸方の合計計算
  const debitTotal = validDebits.reduce((sum, entry) => sum + entry.amount, 0);
  const creditTotal = validCredits.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  if (debitTotal !== creditTotal) {
    errors.push(
      `借方合計（${formatAmount(debitTotal)}円）と貸方合計（${formatAmount(creditTotal)}円）が一致しません。`,
    );
  }

  // 重複チェック
  const uniqueDebits = removeDuplicateEntries(
    validDebits,
    (entry) => entry.account,
  );
  const uniqueCredits = removeDuplicateEntries(
    validCredits,
    (entry) => entry.account,
  );

  if (uniqueDebits.length !== validDebits.length) {
    errors.push("借方に同一の勘定科目を複数回使用することはできません。");
  }

  if (uniqueCredits.length !== validCredits.length) {
    errors.push("貸方に同一の勘定科目を複数回使用することはできません。");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 学習モード用解答リクエスト作成
 */
export const createLearningJournalAnswerRequest = (
  questionId: string,
  debits: JournalEntry[],
  credits: JournalEntry[],
  sessionType: SessionType,
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  const validDebits = debits.filter(
    (entry) => entry.account && entry.amount > 0,
  );
  const validCredits = credits.filter(
    (entry) => entry.account && entry.amount > 0,
  );

  return {
    questionId,
    answerData: {
      questionType: "journal",
      journalEntry: {
        debit: validDebits[0] || { account: "", amount: 0 },
        credit: validCredits[0] || { account: "", amount: 0 },
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
export const createMockExamJournalAnswerRequest = (
  questionId: string,
  debits: JournalEntry[],
  credits: JournalEntry[],
  sessionType: SessionType,
  sessionId?: string,
  startTime: number = Date.now(),
): SubmitAnswerRequest => {
  return createLearningJournalAnswerRequest(
    questionId,
    debits,
    credits,
    sessionType,
    sessionId,
    startTime,
  );
};

/**
 * 学習モード解答送信
 */
export const submitLearningJournalAnswer = async (
  request: SubmitAnswerRequest,
  onSubmitAnswer?: (response: any) => void,
): Promise<void> => {
  try {
    const response = await answerService.submitAnswer(request);
    if (onSubmitAnswer) {
      onSubmitAnswer(response);
    }
  } catch (error) {
    logger.error("[JournalFormUtils] 解答送信エラー:", error as Error);
    throw error;
  }
};

/**
 * バリデーションエラー表示
 */
export const showJournalValidationErrors = (errors: string[]): void => {
  if (errors.length > 0) {
    Alert.alert("入力エラー", errors[0]);
  }
};

/**
 * 数値パッド用の金額確認処理
 */
export const confirmAmountFromPad = (
  tempAmount: string,
  type: "debit" | "credit",
  index: number,
  updateDebit: (index: number, field: keyof JournalEntry, value: any) => void,
  updateCredit: (index: number, field: keyof JournalEntry, value: any) => void,
): void => {
  const amount = parseInt(tempAmount) || 0;
  if (type === "debit") {
    updateDebit(index, "amount", amount);
  } else {
    updateCredit(index, "amount", amount);
  }
};
