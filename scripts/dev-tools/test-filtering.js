#!/usr/bin/env node

/**
 * フィルタリング機能のテスト
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 フィルタリング機能テスト開始\n");

// 生成された問題データから統計を取得
try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );
  const content = fs.readFileSync(generatedQuestionsPath, "utf8");

  // 難易度分布の確認
  console.log("📊 難易度分布:");
  const difficultyMatches = content.match(/"difficulty": (\d+)/g) || [];
  const diffCounts = {};
  difficultyMatches.forEach((match) => {
    const level = match.match(/(\d+)/)[1];
    diffCounts[level] = (diffCounts[level] || 0) + 1;
  });

  Object.entries(diffCounts)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([level, count]) => {
      console.log(`  難易度${level}: ${count}問`);
    });

  console.log(
    `  合計: ${Object.values(diffCounts).reduce((a, b) => a + b, 0)}問\n`,
  );

  // タグ分布の確認（第一問）
  console.log("🏷️ 第一問（仕訳）のタグ分布:");
  const journalTags = new Set();
  const journalPattern = /"id": "Q_J_\d+",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let journalMatch;
  while ((journalMatch = journalPattern.exec(content)) !== null) {
    const tags = journalMatch[1]
      .replace(/\\"/g, '"')
      .split(",")
      .map((t) => t.replace(/"/g, "").trim());
    tags.forEach((tag) => journalTags.add(tag));
  }
  console.log(`  利用可能なタグ: ${Array.from(journalTags).join(", ")}\n`);

  // タグ分布の確認（第二問）
  console.log("📚 第二問（帳簿）のタグ分布:");
  const ledgerTags = new Set();
  const ledgerPattern = /"id": "Q_L_\d+",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let ledgerMatch;
  while ((ledgerMatch = ledgerPattern.exec(content)) !== null) {
    const tags = ledgerMatch[1]
      .replace(/\\"/g, '"')
      .split(",")
      .map((t) => t.replace(/"/g, "").trim());
    tags.forEach((tag) => ledgerTags.add(tag));
  }
  console.log(`  利用可能なタグ: ${Array.from(ledgerTags).join(", ")}\n`);

  // タグ分布の確認（第三問）
  console.log("📈 第三問（試算表等）のタグ分布:");
  const trialTags = new Set();
  const trialPattern = /"id": "Q_T_\d+",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let trialMatch;
  while ((trialMatch = trialPattern.exec(content)) !== null) {
    const tags = trialMatch[1]
      .replace(/\\"/g, '"')
      .split(",")
      .map((t) => t.replace(/"/g, "").trim());
    tags.forEach((tag) => trialTags.add(tag));
  }
  console.log(`  利用可能なタグ: ${Array.from(trialTags).join(", ")}\n`);

  console.log("✅ フィルタリングデータ準備完了");
  console.log("\n📱 アプリでの確認事項:");
  console.log("  1. カテゴリ画面で難易度フィルター（1-5）が表示されるか");
  console.log("  2. 問題類型フィルターでタグに基づいた分類が正しく動作するか");
  console.log("  3. フィルター組み合わせで適切に絞り込まれるか");
} catch (error) {
  console.error("❌ テスト実行エラー:", error.message);
}
