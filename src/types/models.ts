/**
 * データモデル型定義
 * 簿記3級問題集アプリ - 新コンテンツ構成対応
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  QuestionCategory,
  QuestionDifficulty,
  QuestionSubcategory,
  SessionType,
  ReviewStatus,
  CBTAnswerData,
} from "./database";

// Re-export types for external use
export type {
  QuestionCategory,
  QuestionDifficulty,
  QuestionSubcategory,
  SessionType,
  ReviewStatus,
  CBTAnswerData,
} from "./database";

// === 問題関連モデル ===

/**
 * 問題テーブルモデル
 */
export interface Question {
  id: string; // Q_J_001〜Q_J_250(仕訳), Q_L_001〜Q_L_040(帳簿), Q_T_001〜Q_T_012(試算表)
  category_id: QuestionCategory;
  subcategory?: QuestionSubcategory; // 詳細カテゴリ（現金・預金取引など）
  question_text: string;
  answer_template_json: string; // CBT解答テンプレート（プルダウン項目・入力欄定義）
  correct_answer_json: string; // 正解データ（勘定科目・金額のJSON）
  explanation: string;
  difficulty: QuestionDifficulty;
  tags_json?: string; // タグ配列JSON（現金過不足、小口現金等の詳細パターン）

  // problemsStrategy.mdに基づく順序制御
  section_number?: 1 | 2 | 3; // 第1問/第2問/第3問
  question_order?: number; // 各セクション内での出題順序
  pattern_type?: string; // パターン識別（現金過不足、商品売買基本等）

  created_at: string;
  updated_at: string;
}

/**
 * カテゴリテーブルモデル
 */
export interface Category {
  id: QuestionCategory;
  name: string; // 仕訳/帳簿/試算表
  description: string;
  total_questions: number; // 250/40/12
  sort_order: number;
  is_active: boolean;
}

/**
 * 勘定科目マスタテーブルモデル（CBT形式対応）
 */
export interface AccountItem {
  id: number;
  code: string; // 勘定科目コード
  name: string; // 勘定科目名
  category: "asset" | "liability" | "equity" | "revenue" | "expense";
  question_types_json: string; // 使用可能な問題タイプ（["journal","ledger"]等）
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// === 学習履歴関連モデル ===

/**
 * 学習履歴テーブルモデル（CBT形式対応）
 */
export interface LearningHistory {
  id: number;
  question_id: string;
  user_answer_json: string; // CBT解答データのJSON（勘定科目・金額等）
  is_correct: boolean;
  answer_time_ms: number;
  session_id?: string;
  session_type: SessionType;
  validation_errors_json?: string; // 検証エラー情報JSON
  answered_at: string;
}

/**
 * 復習アイテムテーブルモデル
 */
export interface ReviewItem {
  id: number;
  question_id: string;
  incorrect_count: number;
  consecutive_correct_count: number;
  status: ReviewStatus;
  priority_score: number;
  last_answered_at?: string;
  last_reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 学習進捗テーブルモデル
 */
export interface UserProgress {
  id: number;
  category_id: QuestionCategory;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  accuracy_rate: number; // 0.0-1.0
  last_studied_at?: string;
  updated_at: string;
}

// === アプリ設定モデル ===

/**
 * アプリ設定テーブルモデル
 */
export interface AppSetting {
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  updated_at: string;
}

// === 追加の型定義 ===

/**
 * 問題解答テンプレート（JSON格納データ）
 */
export interface QuestionAnswerTemplate {
  type: "journal_entry" | "ledger_entry" | "trial_balance" | "vocabulary";
  allowMultipleEntries?: boolean;
  maxEntries?: number;
  fields: {
    label: string;
    type: "dropdown" | "number" | "text" | "date";
    name: string;
    required: boolean;
    format?: "currency" | "percentage";
    placeholder?: string;
    options?: string[]; // ドロップダウンの選択肢
  }[];
}

/**
 * CBT解答テンプレート（テーブル形式問題用）
 */
export interface CBTAnswerTemplate {
  template_type: string;
  layout_variant: string;
  rows: RowDefinition[];
  columns: ColumnDefinition[];
  allowed_accounts?: string[];
  guidance?: GuidanceStep[];
}

/**
 * 列定義（CBTテーブル形式用）
 */
export interface ColumnDefinition {
  key: string;
  label: string;
  input: "text" | "dropdown" | "number" | "currency" | "computed";
  width?: any;
  options?: string[];
  options_ref?: string;
  group?: string;
  formula?: string;
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
}

/**
 * 行定義（CBTテーブル形式用）
 */
export interface RowDefinition {
  row_id: string | number;
  default_values?: Record<string, any>;
  label?: string;
  readonly?: boolean;
  locked?: boolean;
}

export interface GuidanceStep {
  stage: number;
  title: string;
  body: string;
}

/**
 * 問題正解データ（JSON格納データ）
 */
export interface QuestionCorrectAnswer {
  // 仕訳問題の正解
  journalEntry?:
    | {
        debit_account: string;
        debit_amount: number;
        credit_account: string;
        credit_amount: number;
      }
    | {
        debit_account: string;
        debit_amount: number;
        credit_account: string;
        credit_amount: number;
      }[];
  journalEntries?: {
    debit_account: string;
    debit_amount: number;
    credit_account: string;
    credit_amount: number;
  }[];

  // 伝票問題の正解
  voucher_type?: string; // 入金伝票、出金伝票、振替伝票など

  // 帳簿問題の正解
  ledgerEntry?: {
    entries: {
      account?: string;
      description?: string;
      amount?: number;
    }[];
  };

  // 試算表問題の正解
  trialBalance?: {
    balances: Record<string, number>;
  };

  // 試算表問題の別形式（エントリー配列）と伝票問題のエントリー
  entries?: {
    // 試算表用
    accountName?: string;
    debitAmount?: number;
    creditAmount?: number;
    // 帳簿用
    date?: string;
    description?: string;
    debit?: number;
    credit?: number;
    balance?: number;
    // 伝票用
    account?: string;
    amount?: number;
    debit_account?: string;
    debit_amount?: number;
    credit_account?: string;
    credit_amount?: number;
    customer?: string;
    supplier?: string;
    payment_type?: string;
  }[];

  // 用語穴埋め問題の正解
  blanks?: {
    index: number;
    correctIndex: number;
  }[];

  // 財務諸表形式（複雑な試算表問題用）
  financialStatements?: {
    balanceSheet?: {
      assets?: { accountName: string; amount: number }[];
      liabilities?: { accountName: string; amount: number }[];
      equity?: { accountName: string; amount: number }[];
    };
    incomeStatement?: {
      revenues?: { accountName: string; amount: number }[];
      expenses?: { accountName: string; amount: number }[];
      netIncome?: number;
    };
  };
}

/**
 * 統計計算用の集計データ
 */
export interface StudyStatistics {
  // 全体統計
  overall: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    accuracyRate: number;
    totalStudyTime: number; // ミリ秒
    averageAnswerTime: number; // ミリ秒
    studyDays: number;
    lastStudiedAt?: string;
  };

  // 分野別統計（新コンテンツ構成対応）
  categories: {
    journal: {
      totalQuestions: 250;
      answeredQuestions: number;
      correctAnswers: number;
      accuracyRate: number;
      averageAnswerTime: number;
    };
    ledger: {
      totalQuestions: 40;
      answeredQuestions: number;
      correctAnswers: number;
      accuracyRate: number;
      averageAnswerTime: number;
    };
    trial_balance: {
      totalQuestions: 12;
      answeredQuestions: number;
      correctAnswers: number;
      accuracyRate: number;
      averageAnswerTime: number;
    };
  };

  // 復習統計
  review: {
    needsReview: number;
    priorityReview: number;
    mastered: number;
    totalReviewSessions: number;
    averageImprovementRate: number;
  };
}

/**
 * データベース操作用のフィルタオプション
 */
export interface QueryFilter {
  category?: QuestionCategory;
  difficulty?: QuestionDifficulty;
  status?: ReviewStatus;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
