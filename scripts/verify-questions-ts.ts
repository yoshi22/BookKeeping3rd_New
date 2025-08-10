#!/usr/bin/env tsx

import { allSampleQuestions } from "../src/data/sample-questions-new";
import { Question } from "../src/types/models";

// Helper function to get question by ID
const getSampleQuestionById = (id: string): Question | undefined => {
  return allSampleQuestions.find((q: Question) => q.id === id);
};

console.log("\n=== 問題データ検証 ===");
console.log(`総問題数: ${allSampleQuestions.length}`);

// カテゴリ別に集計
const journalCount = allSampleQuestions.filter(
  (q: Question) => q.category_id === "journal",
).length;
const ledgerCount = allSampleQuestions.filter(
  (q: Question) => q.category_id === "ledger",
).length;
const trialBalanceCount = allSampleQuestions.filter(
  (q: Question) => q.category_id === "trial_balance",
).length;

console.log(`\nカテゴリ別内訳:`);
console.log(`- 仕訳問題: ${journalCount}問`);
console.log(`- 帳簿問題: ${ledgerCount}問`);
console.log(`- 試算表問題: ${trialBalanceCount}問`);

// 最初の5問を表示
console.log("\n最初の5問:");
for (let i = 0; i < 5 && i < allSampleQuestions.length; i++) {
  const q = allSampleQuestions[i];
  console.log(`${i + 1}. [${q.id}] ${q.question_text.substring(0, 50)}...`);
}

// 最後の5問を表示
console.log("\n最後の5問:");
const start = Math.max(0, allSampleQuestions.length - 5);
for (let i = start; i < allSampleQuestions.length; i++) {
  const q = allSampleQuestions[i];
  console.log(`${i + 1}. [${q.id}] ${q.question_text.substring(0, 50)}...`);
}

// IDで問題を取得
console.log("\nID検索テスト:");
const testIds = ["Q_MD_001", "Q_MD_100", "Q_MD_200", "Q_MD_302"];
for (const id of testIds) {
  const q = getSampleQuestionById(id);
  if (q) {
    console.log(`✓ ${id}: ${q.question_text.substring(0, 50)}...`);
  } else {
    console.log(`✗ ${id}: 見つかりません`);
  }
}

// 勘定科目の確認
console.log("\n勘定科目の確認:");
const firstQuestion = allSampleQuestions[0];
if (firstQuestion) {
  const template = JSON.parse(firstQuestion.answer_template_json);
  const options = template.fields[0].options;
  console.log(`勘定科目数: ${options.length}`);
  console.log(`最初の5つ: ${options.slice(0, 5).join(", ")}`);
  console.log(`「給料」が含まれる: ${options.includes("給料") ? "✓" : "✗"}`);
  console.log(
    `「支払利息」が含まれる: ${options.includes("支払利息") ? "✓" : "✗"}`,
  );
}
