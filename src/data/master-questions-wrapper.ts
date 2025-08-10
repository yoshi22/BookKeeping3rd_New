/**
 * マスター問題データラッパー
 * React Native (Expo) 環境でのrequire互換性を提供
 */

import { Question } from "../types/models";

// TypeScriptファイルから生成されたJavaScriptデータ
const masterQuestionsData = require("./master-questions.js");

// 型定義
export interface MasterQuestionsData {
  masterQuestions: Question[];
  questionStatistics: {
    total: number;
    byCategory: {
      journal: number;
      ledger: number;
      trial_balance: number;
    };
  };
}

// エクスポート（型安全性を追加）
export const masterQuestions: Question[] =
  masterQuestionsData.masterQuestions || [];
export const questionStatistics = masterQuestionsData.questionStatistics || {
  total: 0,
  byCategory: {
    journal: 0,
    ledger: 0,
    trial_balance: 0,
  },
};

// 従来のCommonJS形式での互換性エクスポート
module.exports = {
  masterQuestions,
  questionStatistics,
};
