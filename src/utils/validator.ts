/**
 * データバリデーションユーティリティ
 * 簿記3級問題集アプリ - CBT形式対応バリデーション
 */

import { ValidationError } from './error-handler';
import { CBTAnswerData, QuestionCategory, QuestionDifficulty } from '../types/database';

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

/**
 * バリデータークラス
 */
export class Validator {
  /**
   * 必須項目チェック
   */
  public static required(value: any, fieldName: string): ValidationResult {
    if (value === null || value === undefined || value === '') {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          code: 'REQUIRED',
          message: `${fieldName}は必須項目です`
        }]
      };
    }
    return { isValid: true, errors: [] };
  }

  /**
   * 文字列長チェック
   */
  public static stringLength(
    value: string,
    fieldName: string,
    min?: number,
    max?: number
  ): ValidationResult {
    const errors: Array<{ field: string; code: string; message: string }> = [];

    if (typeof value !== 'string') {
      errors.push({
        field: fieldName,
        code: 'INVALID_TYPE',
        message: `${fieldName}は文字列である必要があります`
      });
    } else {
      if (min !== undefined && value.length < min) {
        errors.push({
          field: fieldName,
          code: 'TOO_SHORT',
          message: `${fieldName}は${min}文字以上である必要があります`
        });
      }
      if (max !== undefined && value.length > max) {
        errors.push({
          field: fieldName,
          code: 'TOO_LONG',
          message: `${fieldName}は${max}文字以下である必要があります`
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 数値範囲チェック
   */
  public static numberRange(
    value: number,
    fieldName: string,
    min?: number,
    max?: number
  ): ValidationResult {
    const errors: Array<{ field: string; code: string; message: string }> = [];

    if (typeof value !== 'number' || isNaN(value)) {
      errors.push({
        field: fieldName,
        code: 'INVALID_TYPE',
        message: `${fieldName}は有効な数値である必要があります`
      });
    } else {
      if (min !== undefined && value < min) {
        errors.push({
          field: fieldName,
          code: 'TOO_SMALL',
          message: `${fieldName}は${min}以上である必要があります`
        });
      }
      if (max !== undefined && value > max) {
        errors.push({
          field: fieldName,
          code: 'TOO_LARGE',
          message: `${fieldName}は${max}以下である必要があります`
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * JSONバリデーション
   */
  public static jsonString(value: string, fieldName: string): ValidationResult {
    try {
      JSON.parse(value);
      return { isValid: true, errors: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          code: 'INVALID_JSON',
          message: `${fieldName}は正しいJSON形式である必要があります`
        }]
      };
    }
  }

  /**
   * 列挙値チェック
   */
  public static enumValue<T>(
    value: T,
    fieldName: string,
    validValues: T[]
  ): ValidationResult {
    if (!validValues.includes(value)) {
      return {
        isValid: false,
        errors: [{
          field: fieldName,
          code: 'INVALID_ENUM',
          message: `${fieldName}は有効な値である必要があります（${validValues.join(', ')}）`
        }]
      };
    }
    return { isValid: true, errors: [] };
  }
}

/**
 * 問題データバリデーター
 */
export class QuestionValidator {
  /**
   * 問題IDバリデーション
   */
  public static validateQuestionId(id: string): ValidationResult {
    const errors: Array<{ field: string; code: string; message: string }> = [];

    // 必須チェック
    const requiredResult = Validator.required(id, 'questionId');
    if (!requiredResult.isValid) {
      return requiredResult;
    }

    // フォーマットチェック（Q_J_001, Q_L_001, Q_T_001形式）
    const idPattern = /^Q_[JLT]_\d{3}$/;
    if (!idPattern.test(id)) {
      errors.push({
        field: 'questionId',
        code: 'INVALID_FORMAT',
        message: '問題IDは Q_J_001, Q_L_001, Q_T_001 形式である必要があります'
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * カテゴリIDバリデーション
   */
  public static validateCategoryId(categoryId: QuestionCategory): ValidationResult {
    return Validator.enumValue(
      categoryId,
      'categoryId',
      ['journal', 'ledger', 'trial_balance']
    );
  }

  /**
   * 難易度バリデーション
   */
  public static validateDifficulty(difficulty: QuestionDifficulty): ValidationResult {
    return Validator.enumValue(
      difficulty,
      'difficulty',
      [1, 2, 3, 4, 5]
    );
  }

  /**
   * 問題文バリデーション
   */
  public static validateQuestionText(text: string): ValidationResult {
    const requiredResult = Validator.required(text, 'questionText');
    if (!requiredResult.isValid) {
      return requiredResult;
    }

    return Validator.stringLength(text, 'questionText', 5, 1000);
  }

  /**
   * 解説バリデーション
   */
  public static validateExplanation(explanation: string): ValidationResult {
    const requiredResult = Validator.required(explanation, 'explanation');
    if (!requiredResult.isValid) {
      return requiredResult;
    }

    return Validator.stringLength(explanation, 'explanation', 10, 2000);
  }
}

/**
 * CBT解答データバリデーター
 */
export class CBTAnswerValidator {
  /**
   * 仕訳解答バリデーション
   */
  public static validateJournalAnswer(answer: any): ValidationResult {
    const errors: Array<{ field: string; code: string; message: string }> = [];

    if (!answer.journalEntry) {
      errors.push({
        field: 'journalEntry',
        code: 'REQUIRED',
        message: '仕訳情報が必要です'
      });
      return { isValid: false, errors };
    }

    const { debit, credit } = answer.journalEntry;

    // 借方チェック
    if (!debit || !debit.account || typeof debit.amount !== 'number') {
      errors.push({
        field: 'debit',
        code: 'INVALID_STRUCTURE',
        message: '借方の勘定科目と金額が必要です'
      });
    }

    // 貸方チェック
    if (!credit || !credit.account || typeof credit.amount !== 'number') {
      errors.push({
        field: 'credit',
        code: 'INVALID_STRUCTURE',
        message: '貸方の勘定科目と金額が必要です'
      });
    }

    // 借方・貸方同額チェック
    if (debit && credit && debit.amount !== credit.amount) {
      errors.push({
        field: 'amounts',
        code: 'AMOUNT_MISMATCH',
        message: '借方と貸方の金額が一致していません'
      });
    }

    // 同一勘定科目チェック
    if (debit && credit && debit.account === credit.account) {
      errors.push({
        field: 'accounts',
        code: 'DUPLICATE_ACCOUNT',
        message: '借方と貸方に同じ勘定科目は使用できません'
      });
    }

    // 金額が正数かチェック
    if (debit && debit.amount <= 0) {
      errors.push({
        field: 'debit.amount',
        code: 'INVALID_AMOUNT',
        message: '借方金額は正の数である必要があります'
      });
    }

    if (credit && credit.amount <= 0) {
      errors.push({
        field: 'credit.amount',
        code: 'INVALID_AMOUNT',
        message: '貸方金額は正の数である必要があります'
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 学習履歴バリデーション
   */
  public static validateLearningHistory(data: {
    questionId: string;
    answerTimeMs: number;
    sessionType?: string;
  }): ValidationResult {
    const errors: Array<{ field: string; code: string; message: string }> = [];

    // 問題IDバリデーション
    const questionIdResult = QuestionValidator.validateQuestionId(data.questionId);
    if (!questionIdResult.isValid) {
      errors.push(...questionIdResult.errors);
    }

    // 解答時間バリデーション
    const timeResult = Validator.numberRange(data.answerTimeMs, 'answerTimeMs', 1000, 600000); // 1秒〜10分
    if (!timeResult.isValid) {
      errors.push(...timeResult.errors);
    }

    // セッションタイプバリデーション
    if (data.sessionType) {
      const sessionTypeResult = Validator.enumValue(
        data.sessionType,
        'sessionType',
        ['learning', 'review', 'mock_exam']
      );
      if (!sessionTypeResult.isValid) {
        errors.push(...sessionTypeResult.errors);
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * 複合バリデーション
 */
export class CompositeValidator {
  /**
   * 複数のバリデーション結果を統合
   */
  public static combine(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(result => result.errors);
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * バリデーション結果からValidationErrorを生成
   */
  public static createValidationError(result: ValidationResult, operation: string): ValidationError {
    if (result.isValid) {
      throw new Error('Valid result cannot be converted to ValidationError');
    }

    const firstError = result.errors[0];
    return new ValidationError(
      firstError.message,
      firstError.field,
      firstError.code,
      {
        operation,
        allErrors: result.errors
      }
    );
  }
}

/**
 * データサニタイゼーション
 */
export class DataSanitizer {
  /**
   * HTMLタグ除去
   */
  public static stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * 数値フォーマット（カンマ区切り対応）
   */
  public static parseNumber(input: string): number | null {
    const cleaned = input.replace(/[,\s]/g, '');
    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
  }

  /**
   * 文字列トリム・正規化
   */
  public static normalizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * 勘定科目名正規化
   */
  public static normalizeAccountName(input: string): string {
    return this.normalizeString(input)
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
        // 全角→半角変換
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
      });
  }
}

/**
 * 便利な関数群
 */

/**
 * オブジェクトの必須フィールドチェック
 */
export function validateRequiredFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): ValidationResult {
  const errors: Array<{ field: string; code: string; message: string }> = [];

  for (const field of requiredFields) {
    const result = Validator.required(obj[field], field as string);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * 条件付きバリデーション
 */
export function conditionalValidation(
  condition: boolean,
  validation: () => ValidationResult
): ValidationResult {
  if (!condition) {
    return { isValid: true, errors: [] };
  }
  return validation();
}