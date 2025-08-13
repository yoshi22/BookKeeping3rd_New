/**
 * データベース関連の型定義
 * 簿記3級問題集アプリ - CBT形式対応
 */

// 基本的なDB操作結果型
export interface DatabaseResult {
  success: boolean;
  error?: string;
  rowsAffected?: number;
  insertId?: number;
}

// SQLクエリ実行結果型
export interface QueryResult<T = any> {
  rows: T[];
  rowsAffected: number;
  insertId?: number;
}

// トランザクション型
export interface Transaction {
  executeSql(
    sql: string,
    params?: any[],
    success?: (tx: Transaction, results: any) => void,
    error?: (tx: Transaction, error: any) => void,
  ): void;
}

// データベース接続型
export interface Database {
  transaction(
    fn: (tx: Transaction) => void,
    error?: (error: any) => void,
    success?: () => void,
  ): void;

  executeSql(
    sql: string,
    params?: any[],
    success?: (results: any) => void,
    error?: (error: any) => void,
  ): void;

  close(success?: () => void, error?: (error: any) => void): void;
}

// 問題カテゴリ型（新コンテンツ構成対応）
export type QuestionCategory =
  | "journal"
  | "ledger"
  | "trial_balance"
  | "financial_statement";

// problemsStrategy.mdに基づく詳細分類
export type JournalSubcategory =
  | "cash_deposit" // 現金・預金取引
  | "merchandise_trade" // 商品売買取引
  | "receivables_debts" // 債権・債務
  | "salary_tax" // 給与・税金
  | "fixed_assets" // 固定資産
  | "year_end_adj"; // 決算整理

export type LedgerSubcategory =
  | "account_posting" // 勘定記入問題
  | "subsidiary_books" // 補助簿記入問題
  | "voucher_entry" // 伝票記入問題
  | "theory_selection"; // 理論・選択問題

export type TrialBalanceSubcategory =
  | "financial_statements" // 財務諸表作成
  | "worksheet" // 精算表作成
  | "trial_balance"; // 試算表作成

export type QuestionSubcategory =
  | JournalSubcategory
  | LedgerSubcategory
  | TrialBalanceSubcategory;

// CBT解答形式型
export type CBTAnswerFormat = "dropdown_input" | "number_input" | "text_input";

// 問題難易度型
export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5;

// セッション種別型
export type SessionType = "learning" | "review" | "mock_exam";

// 復習ステータス型
export type ReviewStatus = "needs_review" | "priority_review" | "mastered";

// ログレベル型
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

// データベース設定型
export interface DatabaseConfig {
  name: string;
  version: string;
  displayName: string;
  size: number; // SQLiteのサイズ制限
  location: string;
}

// エラー型
export interface DatabaseError extends Error {
  code?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  context?: Record<string, any>;
  recoverable?: boolean;
}

// CBT解答データ構造（JSON格納用）
export interface CBTAnswerData {
  questionType: QuestionCategory;

  // 仕訳問題の解答
  journalEntry?: {
    debit: { account: string; amount: number };
    credit: { account: string; amount: number };
  };

  // 帳簿問題の解答
  ledgerEntry?: {
    entries: Array<{
      account?: string;
      description?: string;
      amount?: number;
    }>;
  };

  // 試算表問題の解答
  trialBalance?: {
    balances: Record<string, number>;
  };

  // 財務諸表問題の解答
  financialStatements?: {
    balanceSheet: {
      assets: Array<{ accountName: string; amount: number }>;
      liabilities: Array<{ accountName: string; amount: number }>;
      equity: Array<{ accountName: string; amount: number }>;
    };
    incomeStatement: {
      revenues: Array<{ accountName: string; amount: number }>;
      expenses: Array<{ accountName: string; amount: number }>;
      netIncome: number;
    };
  };
}

// 検証エラー情報（JSON格納用）
export interface ValidationErrorData {
  field: string;
  code: string;
  message: string;
  severity: "ERROR" | "WARNING";
}

// 模試詳細結果（JSON格納用）
export interface MockExamDetailedResults {
  examId: string;
  startedAt: string;
  completedAt: string;
  timeLimit: number; // 分
  actualDuration: number; // 秒

  // セクション別結果
  sectionResults: Array<{
    sectionNumber: 1 | 2 | 3;
    sectionName: string;
    score: number;
    maxScore: number;
    questions: MockExamQuestionResult[];
  }>;

  // 全体統計
  totalCorrect: number;
  totalQuestions: number;
  accuracyRate: number;

  // 合格判定
  passJudgment: {
    isPassed: boolean;
    requiredScore: number;
    actualScore: number;
  };
}

// 模試問題結果詳細
export interface MockExamQuestionResult {
  questionId: string;
  sectionNumber: 1 | 2 | 3;
  questionOrder: number;
  maxPoints: number;
  earnedPoints: number;
  isCorrect: boolean;
  userAnswer: CBTAnswerData | null;
  correctAnswer: any;
  answerTime: number; // ミリ秒
}

// マイグレーション情報型
export interface MigrationInfo {
  version: number;
  name: string;
  description: string;
  sql: string[];
  rollbackSql?: string[];
  timestamp: string;
}

// データベース統計情報型
export interface DatabaseStats {
  tables: Record<
    string,
    {
      rowCount: number;
      sizeBytes: number;
      lastModified: string;
    }
  >;
  totalSize: number;
  version: string;
  lastBackup?: string;
  integrityCheck: boolean;
}
