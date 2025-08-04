/**
 * データモデル型定義
 * 簿記3級問題集アプリ - 新コンテンツ構成対応
 */

import {
  QuestionCategory,
  QuestionDifficulty,
  SessionType,
  ReviewStatus,
  CBTAnswerData,
  ValidationErrorData,
  MockExamDetailedResults,
} from "./database";

// Re-export types for external use
export type {
  QuestionCategory,
  QuestionDifficulty,
  SessionType,
  ReviewStatus,
  CBTAnswerData,
  ValidationErrorData,
  MockExamDetailedResults,
} from "./database";

// === 問題関連モデル ===

/**
 * 問題テーブルモデル
 */
export interface Question {
  id: string; // Q_J_001〜Q_J_250(仕訳), Q_L_001〜Q_L_040(帳簿), Q_T_001〜Q_T_012(試算表)
  category_id: QuestionCategory;
  question_text: string;
  answer_template_json: string; // CBT解答テンプレート（プルダウン項目・入力欄定義）
  correct_answer_json: string; // 正解データ（勘定科目・金額のJSON）
  explanation: string;
  difficulty: QuestionDifficulty;
  tags_json?: string; // タグ配列JSON（オプション）
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

// === 模試関連モデル ===

/**
 * 模試定義テーブルモデル
 */
export interface MockExam {
  id: string; // MOCK_001〜005
  name: string;
  description: string;
  time_limit_minutes: number; // 60分固定
  total_score: number; // 100点満点
  passing_score: number; // 70点合格
  structure_json: string; // 問題構成JSON
  is_active: boolean;
  created_at: string;
}

/**
 * 模試問題関連テーブルモデル
 */
export interface MockExamQuestion {
  id: number;
  mock_exam_id: string;
  question_id: string;
  section_number: 1 | 2 | 3; // 1(仕訳15問)/2(帳簿2問)/3(試算表1問)
  question_order: number;
  points: number; // 配点
}

/**
 * 模試結果テーブルモデル
 */
export interface MockExamResult {
  id: number;
  exam_id: string;
  total_score: number; // 獲得点数(0-100)
  max_score: number; // 満点(100)
  is_passed: boolean; // 合格判定(70点以上)
  duration_seconds: number; // 所要時間
  detailed_results_json: string; // 詳細結果JSON
  taken_at: string;
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
  type: "journal_entry" | "ledger_entry" | "trial_balance";
  fields: Array<{
    label: string;
    type: "dropdown" | "number" | "text";
    name: string;
    required: boolean;
    format?: "currency" | "percentage";
    options?: string[]; // ドロップダウンの選択肢
  }>;
}

/**
 * 問題正解データ（JSON格納データ）
 */
export interface QuestionCorrectAnswer {
  // 仕訳問題の正解
  journalEntry?: {
    debit_account: string;
    debit_amount: number;
    credit_account: string;
    credit_amount: number;
  };

  // 帳簿問題の正解
  ledgerEntry?: {
    entries: Array<{
      account?: string;
      description?: string;
      amount?: number;
    }>;
  };

  // 試算表問題の正解
  trialBalance?: {
    balances: Record<string, number>;
  };
}

/**
 * 模試構成データ（JSON格納データ）
 */
export interface MockExamStructure {
  section1: {
    count: number; // 15問
    maxScore: number; // 60点
    questionCategory: "journal";
    timeRecommendation: number; // 推奨時間（分）
  };
  section2: {
    count: number; // 2問
    maxScore: number; // 20点
    questionCategory: "ledger";
    timeRecommendation: number;
  };
  section3: {
    count: number; // 1問
    maxScore: number; // 20点
    questionCategory: "trial_balance";
    timeRecommendation: number;
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

  // 模試統計
  mockExams: {
    totalAttempts: number;
    passedAttempts: number;
    passRate: number;
    averageScore: number;
    bestScore: number;
    averageTime: number; // 秒
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
