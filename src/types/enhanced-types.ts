/**
 * Phase 2: 強化型定義
 * any型を具体的な型に置換するための新しい型定義
 */

// ================================
// データベース関連の強化型
// ================================

// SQLクエリパラメータ型
export type SqlParameter = string | number | boolean | null;

// SQLクエリ結果の汎用型
export interface TypedQueryResult<T> {
  rows: T[];
  rowsAffected: number;
  insertId?: number;
}

// データベースエラー型
export interface DatabaseError extends Error {
  code?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  context?: Record<string, unknown>;
  recoverable?: boolean;
}

// トランザクション型（SQLite用）
export interface SQLiteTransaction {
  executeSql(
    sql: string,
    params?: SqlParameter[],
    success?: (tx: SQLiteTransaction, results: any) => void,
    error?: (tx: SQLiteTransaction, error: DatabaseError) => void,
  ): void;
}

// トランザクション成功/失敗コールバック型
export type TransactionSuccessCallback<T = unknown> = (
  tx: SQLiteTransaction,
  results: T,
) => void;
export type TransactionErrorCallback = (
  tx: SQLiteTransaction,
  error: DatabaseError,
) => void;
export type DatabaseSuccessCallback<T = unknown> = (results: T) => void;
export type DatabaseErrorCallback = (error: DatabaseError) => void;

// ================================
// 問題テンプレート関連の強化型
// ================================

// フィールド型定義
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "dropdown"
  | "date"
  | "amount"
  | "account";

// 問題テンプレートフィールド
export interface QuestionField {
  name: string;
  type: FieldType;
  required?: boolean;
  label?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// 問題テンプレート
export interface QuestionTemplate {
  id?: string;
  category?: string;
  type?:
    | "journal"
    | "journal_entry"
    | "ledger"
    | "ledger_account"
    | "subsidiary_book"
    | "trial_balance"
    | "worksheet"
    | "financial_statement"
    | "voucher_entry"
    | "multiple_choice"
    | "single_choice";
  fields?: QuestionField[];
  questions?: {
    id: string;
    label: string;
  }[];
  validation?: {
    required?: string[];
    optional?: string[];
  };
}

// ================================
// 解答データ関連の強化型
// ================================

// 基本解答データ（CBTAnswerDataとの互換性を考慮）
export interface AnswerData {
  [fieldName: string]: string | number | boolean | null | undefined | any;

  // Multiple choice specific fields
  selected_options?: string[];
  selected_option?: string;
}

// 仕訳エントリ
export interface JournalEntry {
  debit_account: string;
  debit_amount: number;
  credit_account: string;
  credit_amount: number;
  description?: string;
}

// 帳簿エントリ
export interface LedgerEntry {
  date?: string;
  description?: string;
  debit_amount?: number;
  credit_amount?: number;
  balance?: number;
  account_name?: string;
  account?: string;
  amount?: number;
}

// 試算表エントリ
export interface TrialBalanceEntry {
  accountName: string;
  debitAmount: number;
  creditAmount: number;
}

// 財務諸表エントリ
export interface FinancialStatementEntry {
  accountName: string;
  amount: number;
  category: "assets" | "liabilities" | "equity" | "revenues" | "expenses";
}

// ================================
// 正解データ関連の強化型
// ================================

// 仕訳正解データ
export interface JournalCorrectAnswer {
  journalEntries: JournalEntry[];
}

// 帳簿正解データ
export interface LedgerCorrectAnswer {
  entries: LedgerEntry[];
}

// 試算表正解データ
export interface TrialBalanceCorrectAnswer {
  entries: TrialBalanceEntry[];
}

// 財務諸表正解データ
export interface FinancialStatementCorrectAnswer {
  financialStatements: {
    assets?: FinancialStatementEntry[];
    liabilities?: FinancialStatementEntry[];
    equity?: FinancialStatementEntry[];
    revenues?: FinancialStatementEntry[];
    expenses?: FinancialStatementEntry[];
  };
}

// 汎用正解データ型
export type CorrectAnswer =
  | JournalCorrectAnswer
  | LedgerCorrectAnswer
  | TrialBalanceCorrectAnswer
  | FinancialStatementCorrectAnswer;

// ================================
// コンポーネント Props 関連
// ================================

// 解答変更ハンドラー型
export type AnswerChangeHandler<T = string | number> = (
  fieldName: string,
  value: T,
) => void;

// 汎用プロパティ型
export interface ComponentProps {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Function
    | object;
}

// ================================
// UI関連の強化型
// ================================

// エラー表示データ
export interface UIError {
  message: string;
  field?: string;
  code?: string;
  severity?: "info" | "warning" | "error";
}

// ローディング状態
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// ================================
// ユーティリティ型
// ================================

// 深いPartial型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 非null型
export type NonNullable<T> = T extends null | undefined ? never : T;

// 型安全なオブジェクトキー
export type KeyOf<T> = keyof T extends string ? keyof T : string;

// 値の型を取得
export type ValueOf<T> = T[keyof T];

// ================================
// 型ガード関数
// ================================

// 仕訳解答の型ガード
export function isJournalCorrectAnswer(
  answer: unknown,
): answer is JournalCorrectAnswer {
  return (
    typeof answer === "object" &&
    answer !== null &&
    "journalEntries" in answer &&
    Array.isArray((answer as any).journalEntries)
  );
}

// 帳簿解答の型ガード
export function isLedgerCorrectAnswer(
  answer: unknown,
): answer is LedgerCorrectAnswer {
  return (
    typeof answer === "object" &&
    answer !== null &&
    "entries" in answer &&
    Array.isArray((answer as any).entries)
  );
}

// 試算表解答の型ガード
export function isTrialBalanceCorrectAnswer(
  answer: unknown,
): answer is TrialBalanceCorrectAnswer {
  return (
    typeof answer === "object" &&
    answer !== null &&
    "entries" in answer &&
    Array.isArray((answer as any).entries) &&
    (answer as any).entries.every(
      (entry: any) =>
        "accountName" in entry &&
        "debitAmount" in entry &&
        "creditAmount" in entry,
    )
  );
}

// 財務諸表解答の型ガード
export function isFinancialStatementCorrectAnswer(
  answer: unknown,
): answer is FinancialStatementCorrectAnswer {
  return (
    typeof answer === "object" &&
    answer !== null &&
    "financialStatements" in answer
  );
}

// 型安全なObject.entries
export function typedEntries<T extends Record<string, unknown>>(
  obj: T,
): [KeyOf<T>, ValueOf<T>][] {
  return Object.entries(obj) as [KeyOf<T>, ValueOf<T>][];
}

// 型安全なObject.keys
export function typedKeys<T extends Record<string, unknown>>(
  obj: T,
): KeyOf<T>[] {
  return Object.keys(obj) as KeyOf<T>[];
}

// 型安全なJSON.parse
export function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// ================================
// レガシー型の段階的移行サポート
// ================================

// @deprecated: Phase 2後に削除予定。代わりにAnswerDataを使用
export type LegacyAnswerData = Record<string, any>;

// @deprecated: Phase 2後に削除予定。代わりにQuestionTemplateを使用
export type LegacyTemplate = any;

// @deprecated: Phase 2後に削除予定。代わりにCorrectAnswerを使用
export type LegacyCorrectAnswer = any;
