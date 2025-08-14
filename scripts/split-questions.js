#!/usr/bin/env node

/**
 * Script to split master-questions.ts into category-based files
 * 簿記3級問題集アプリ - 問題データファイル分割ツール
 */

const fs = require("fs");
const path = require("path");

const MASTER_FILE = path.join(__dirname, "../src/data/master-questions.ts");
const OUTPUT_DIR = path.join(__dirname, "../src/data/questions");

async function splitQuestions() {
  console.log(
    "📚 Starting to split master-questions.ts into category files...",
  );

  // Read the master file
  const masterContent = fs.readFileSync(MASTER_FILE, "utf8");

  // Extract the masterQuestions array content
  const arrayStart = masterContent.indexOf(
    "export const masterQuestions: Question[] = [",
  );
  const arrayEnd = masterContent.indexOf("export const questionStatistics");

  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error("Could not find masterQuestions array boundaries");
  }

  const arrayContent = masterContent.substring(arrayStart, arrayEnd);

  // Split into individual question objects
  const questions = [];
  let depth = 0;
  let currentQuestion = "";
  let inQuestion = false;

  for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];

    if (char === "{") {
      depth++;
      if (depth === 1) {
        inQuestion = true;
        currentQuestion = char;
      } else if (inQuestion) {
        currentQuestion += char;
      }
    } else if (char === "}") {
      depth--;
      if (inQuestion) {
        currentQuestion += char;
      }
      if (depth === 0 && inQuestion) {
        // Complete question object
        questions.push(currentQuestion.trim());
        currentQuestion = "";
        inQuestion = false;
      }
    } else if (inQuestion) {
      currentQuestion += char;
    }
  }

  console.log(`🔍 Found ${questions.length} questions to process`);

  // Group questions by category
  const categories = {
    journal: [],
    ledger: [],
    trial_balance: [],
  };

  for (const questionStr of questions) {
    if (questionStr.includes('category_id: "journal"')) {
      categories.journal.push(questionStr);
    } else if (questionStr.includes('category_id: "ledger"')) {
      categories.ledger.push(questionStr);
    } else if (questionStr.includes('category_id: "trial_balance"')) {
      categories.trial_balance.push(questionStr);
    }
  }

  console.log(`📊 Questions by category:`);
  console.log(`  - Journal: ${categories.journal.length} questions`);
  console.log(`  - Ledger: ${categories.ledger.length} questions`);
  console.log(
    `  - Trial Balance: ${categories.trial_balance.length} questions`,
  );

  // Create category files
  await createCategoryFile(
    "journal",
    categories.journal,
    "Journal Questions",
    "仕訳問題",
  );
  await createCategoryFile(
    "ledger",
    categories.ledger,
    "Ledger Questions",
    "帳簿問題",
  );
  await createCategoryFile(
    "trial_balance",
    categories.trial_balance,
    "Trial Balance Questions",
    "試算表問題",
  );

  // Create index file to combine all questions
  await createIndexFile(categories);

  console.log("✅ Successfully split master-questions.ts into category files!");
}

async function createCategoryFile(
  category,
  questions,
  englishName,
  japaneseName,
) {
  const filename = `${category.replace("_", "-")}-questions.ts`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const content = `/**
 * ${englishName} (${japaneseName})
 * 簿記3級問題集アプリ - ${japaneseName}データ
 * Generated from master-questions.ts
 */

import { Question } from "../../types/models";

export const ${category.replace('_', '')}Questions: Question[] = [
${questions.map((q) => "  " + q).join(",\n")},
];

export const ${category.replace('_', '')}QuestionCount = ${questions.length};
`;

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`📝 Created ${filename} with ${questions.length} questions`);
}

async function createIndexFile(categories) {
  const filepath = path.join(OUTPUT_DIR, "index.ts");

  const content = `/**
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
`;

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`📝 Created index.ts with combined exports`);
}

// Run the script
splitQuestions().catch(console.error);
