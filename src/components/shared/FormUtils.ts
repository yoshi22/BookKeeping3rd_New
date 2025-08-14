/**
 * フォーム共通ユーティリティ
 * 簿記3級問題集アプリ - フォーム処理共通化
 */

import { FormState, BaseAnswerData } from "./FormTypes";
import { SubmitAnswerRequest } from "../../services/answer-service";

/**
 * 初期フォーム状態
 */
export const createInitialFormState = (): FormState => ({
  isSubmitting: false,
  errors: {},
  isDirty: false,
});

/**
 * フォームエラー管理
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
}

/**
 * 金額バリデーション
 */
export const validateAmount = (
  amount: number,
  fieldName: string = "金額",
): string | null => {
  if (isNaN(amount)) {
    return `${fieldName}は数値である必要があります`;
  }
  if (amount < 0) {
    return `${fieldName}は0以上である必要があります`;
  }
  if (amount > 999999999) {
    return `${fieldName}は999,999,999以下である必要があります`;
  }
  return null;
};

/**
 * 勘定科目バリデーション
 */
export const validateAccount = (
  account: string,
  fieldName: string = "勘定科目",
): string | null => {
  if (!account || account.trim() === "") {
    return `${fieldName}を選択してください`;
  }
  return null;
};

/**
 * 日付バリデーション
 */
export const validateDate = (
  date: string,
  fieldName: string = "日付",
): string | null => {
  if (!date || date.trim() === "") {
    return `${fieldName}を入力してください`;
  }

  // 簡単な日付形式チェック (MM/DD形式)
  const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(date)) {
    return `${fieldName}はMM/DD形式で入力してください`;
  }

  return null;
};

/**
 * 摘要バリデーション
 */
export const validateDescription = (
  description: string,
  fieldName: string = "摘要",
  required: boolean = true,
): string | null => {
  if (required && (!description || description.trim() === "")) {
    return `${fieldName}を入力してください`;
  }
  if (description && description.length > 50) {
    return `${fieldName}は50文字以内で入力してください`;
  }
  return null;
};

/**
 * 回答データ作成ヘルパー
 */
export const createSubmitAnswerRequest = (
  questionId: string,
  answerData: any,
  sessionType: string = "learning",
  sessionId?: string,
  startTime?: number,
): SubmitAnswerRequest => {
  return {
    questionId,
    answerData,
    sessionType: sessionType as any,
    sessionId,
    startTime: startTime || Date.now(),
  };
};

/**
 * 金額フォーマット
 */
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString("ja-JP");
};

/**
 * 金額パース（カンマ区切り対応）
 */
export const parseAmount = (amountStr: string): number => {
  const cleaned = amountStr.replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * 配列から重複削除
 */
export const removeDuplicateEntries = <T>(
  array: T[],
  keyExtractor: (item: T) => string,
): T[] => {
  const seen = new Set<string>();
  return array.filter((item) => {
    const key = keyExtractor(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * フォーム状態をリセット
 */
export const resetFormState = (setters: {
  setFormState: (state: FormState) => void;
  [key: string]: any;
}): void => {
  setters.setFormState(createInitialFormState());

  // その他のセッター関数があれば実行
  Object.entries(setters).forEach(([key, setter]) => {
    if (key !== "setFormState" && typeof setter === "function") {
      setter([]);
    }
  });
};

/**
 * デバウンス処理
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
