/**
 * 新しい学習システム統合用の問題データエクスポート
 * problemsStrategy.mdに基づいた統合データを提供
 * 更新日: 2025-08-06
 */

import { Question } from "../types/models";

// 統合データのインポートを試みる
let allSampleQuestions: Question[] = [];
let integratedJournalQuestions: Question[] = [];
let integratedLedgerQuestions: Question[] = [];
let integratedTrialBalanceQuestions: Question[] = [];
let integratedStatistics: any = {};
let INTEGRATED_DATA_VERSION = "2025-08-06-strategy-aligned";

try {
  // マスター問題データを読み込む（ラッパー経由）
  const masterData = require("./master-questions-wrapper");

  if (
    masterData &&
    masterData.masterQuestions &&
    masterData.masterQuestions.length > 0
  ) {
    allSampleQuestions = masterData.masterQuestions;

    // カテゴリー別に分類
    integratedJournalQuestions = masterData.masterQuestions.filter(
      (q: Question) => q.category_id === "journal",
    );
    integratedLedgerQuestions = masterData.masterQuestions.filter(
      (q: Question) => q.category_id === "ledger",
    );
    integratedTrialBalanceQuestions = masterData.masterQuestions.filter(
      (q: Question) => q.category_id === "trial_balance",
    );

    integratedStatistics = masterData.questionStatistics || {};
    INTEGRATED_DATA_VERSION = "2025-08-07-master-questions";

    console.log("[Data] マスター問題データ読み込み成功:", {
      total: allSampleQuestions.length,
      journal: integratedJournalQuestions.length,
      ledger: integratedLedgerQuestions.length,
      trial_balance: integratedTrialBalanceQuestions.length,
      version: INTEGRATED_DATA_VERSION,
    });
  } else {
    console.log("[Data] マスター問題データが空または無効です");
    // フォールバックデータは使用せず、空配列のままにする
  }
} catch (error) {
  console.log(
    "[Data] マスター問題データの読み込みエラー:",
    error instanceof Error ? error.message : String(error),
  );
  // フォールバックデータは使用せず、空配列のままにする
}

// データ検証 - フォールバックデータを削除
if (!allSampleQuestions || allSampleQuestions.length === 0) {
  console.log(
    "[Data] 警告：統合データが空です。データファイルを確認してください。",
  );
  // フォールバックデータは使用しない
  allSampleQuestions = [];
}

// データバージョン管理（INTEGRATED_DATA_VERSIONを使用）
export const SAMPLE_DATA_VERSION = INTEGRATED_DATA_VERSION;

// エクスポート - allSampleQuestionsが正しく定義されていることを確認
export { allSampleQuestions };

// カテゴリー別エクスポート（互換性のため）
export const sampleJournalQuestions =
  integratedJournalQuestions.length > 0
    ? integratedJournalQuestions
    : allSampleQuestions.filter((q) => q.category_id === "journal");

export const sampleLedgerQuestions =
  integratedLedgerQuestions.length > 0
    ? integratedLedgerQuestions
    : allSampleQuestions.filter((q) => q.category_id === "ledger");

export const sampleTrialBalanceQuestions =
  integratedTrialBalanceQuestions.length > 0
    ? integratedTrialBalanceQuestions
    : allSampleQuestions.filter((q) => q.category_id === "trial_balance");

// 統計情報
export const questionStatistics =
  Object.keys(integratedStatistics).length > 0
    ? integratedStatistics
    : {
        total: allSampleQuestions.length,
        byCategory: {
          journal: sampleJournalQuestions.length,
          ledger: sampleLedgerQuestions.length,
          trial_balance: sampleTrialBalanceQuestions.length,
        },
      };

// デバッグ出力
console.log("[Data] sample-questions-new.ts エクスポート状態:", {
  version: SAMPLE_DATA_VERSION,
  totalQuestions: allSampleQuestions.length,
  journal: sampleJournalQuestions.length,
  ledger: sampleLedgerQuestions.length,
  trial_balance: sampleTrialBalanceQuestions.length,
});
