/**
 * サンプル問題データ
 * problemsAndAnswers.mdから抽出された問題データを使用
 */

import type { Question } from "../types/models";
import {
  extractedJournalQuestions,
  extractedLedgerQuestions,
  extractedTrialBalanceQuestions,
  allExtractedQuestions,
  ALL_ACCOUNT_OPTIONS,
} from "./extracted-questions";

/**
 * データバージョン
 * extracted-questions.tsの生成日時に基づく
 * データが更新された場合は、このバージョンが変更される
 */
export const SAMPLE_DATA_VERSION = new Date().toISOString();

// 型定義のエクスポート
export type {
  Question,
  QuestionAnswerTemplate,
  QuestionCorrectAnswer,
  QuestionDifficulty,
  QuestionCategory,
} from "../types/models";

/**
 * 仕訳問題のサンプルデータ
 * CBT形式の基本的な仕訳問題
 */
export const sampleJournalQuestions: Question[] = extractedJournalQuestions;

/**
 * 帳簿問題のサンプルデータ
 * 帳簿転記・記入に関する問題
 */
export const sampleLedgerQuestions: Question[] = extractedLedgerQuestions;

/**
 * 試算表問題のサンプルデータ
 * 試算表作成・修正に関する問題
 */
export const sampleTrialBalanceQuestions: Question[] =
  extractedTrialBalanceQuestions;

/**
 * 全てのサンプル問題データ
 * problemsAndAnswers.mdから抽出された302問
 */
export const allSampleQuestions: Question[] = allExtractedQuestions;

/**
 * 完全な仕訳問題リスト (302問)
 */
export const allJournalQuestions: Question[] = extractedJournalQuestions;

/**
 * 完全な帳簿問題リスト (0問 - 現在は未実装)
 */
export const allLedgerQuestions: Question[] = extractedLedgerQuestions;

/**
 * 完全な試算表問題リスト (0問 - 現在は未実装)
 */
export const allTrialBalanceQuestions: Question[] =
  extractedTrialBalanceQuestions;

/**
 * カテゴリ別に問題を取得するヘルパー関数
 */
export const getSampleQuestionsByCategory = (
  category: "journal" | "ledger" | "trial_balance",
): Question[] => {
  switch (category) {
    case "journal":
      return extractedJournalQuestions;
    case "ledger":
      return extractedLedgerQuestions;
    case "trial_balance":
      return extractedTrialBalanceQuestions;
    default:
      return [];
  }
};

/**
 * 問題IDで問題を取得するヘルパー関数
 */
export const getSampleQuestionById = (id: string): Question | undefined => {
  return allSampleQuestions.find((question) => question.id === id);
};

/**
 * 使用可能な全勘定科目（problemsAndAnswers.mdから抽出）
 */
export const AVAILABLE_ACCOUNT_OPTIONS = ALL_ACCOUNT_OPTIONS;
