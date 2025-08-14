/**
 * 共通フォーム型定義
 * 簿記3級問題集アプリ - フォームコンポーネント共通化
 */

import { SessionType } from "../../types/database";
import { SubmitAnswerResponse } from "../../services/answer-service";

/**
 * 仕訳エントリ
 */
export interface JournalEntry {
  account: string;
  amount: number;
}

/**
 * 帳簿エントリ
 */
/**
 * 帳簿エントリ
 */
/**
 * 帳簿エントリ
 */
export interface LedgerEntry {
  date: string;
  description: string;
  receipt_amount: number;
  payment_amount: number;
}

/**
 * 試算表エントリ
 */
/**
 * 試算表エントリ
 */
export interface TrialBalanceEntry {
  accountName: string;
  debitAmount: number;
  creditAmount: number;
}

/**
 * 共通フォームベースプロパティ
 */
export interface BaseFormProps {
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

/**
 * 模試用フォームベースプロパティ
 */
export interface MockExamFormProps {
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining?: string;
  explanation?: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
  showExplanation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

/**
 * 勘定科目オプション
 */
export interface AccountOption {
  label: string;
  value: string;
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
 * 回答データの基底型
 */
export interface BaseAnswerData {
  questionType: string;
  [key: string]: any;
}
