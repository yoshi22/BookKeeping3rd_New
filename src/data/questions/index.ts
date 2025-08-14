/**
 * Questions Index
 * 簿記3級問題集アプリ - 問題データ統合インデックス
 * Generated from master-questions.ts split
 */

import { Question } from "../../types/models";
import { journalQuestions, journalQuestionCount } from "./journal-questions";
import { ledgerQuestions, ledgerQuestionCount } from "./ledger-questions";
import { trialbalanceQuestions, trialbalanceQuestionCount } from "./trial-balance-questions";

// Combined questions array (maintains original order)
export const allQuestions: Question[] = [
  ...journalQuestions,
  ...ledgerQuestions, 
  ...trialbalanceQuestions,
];

// Category-specific exports
export {
  journalQuestions,
  ledgerQuestions,
  trialbalanceQuestions,
};

// Question counts
export const questionCounts = {
  journal: journalQuestionCount,
  ledger: ledgerQuestionCount,
  trial_balance: trialbalanceQuestionCount,
  total: journalQuestionCount + ledgerQuestionCount + trialbalanceQuestionCount,
};

// Statistics
export const questionStatistics = {
  totalQuestions: questionCounts.total,
  categoryCounts: questionCounts,
  categories: [
    { 
      id: "journal", 
      name: "仕訳問題", 
      englishName: "Journal Questions",
      count: questionCounts.journal 
    },
    { 
      id: "ledger", 
      name: "帳簿問題", 
      englishName: "Ledger Questions",
      count: questionCounts.ledger 
    },
    { 
      id: "trial_balance", 
      name: "試算表問題", 
      englishName: "Trial Balance Questions",
      count: questionCounts.trial_balance 
    },
  ],
};
