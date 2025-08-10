#!/usr/bin/env node

/**
 * タグデータとproblemsStrategy.mdの分類を詳細分析
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 タグデータの詳細分析開始\n");

// 生成された問題データから詳細な統計を取得
try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );
  const content = fs.readFileSync(generatedQuestionsPath, "utf8");

  // 第一問の全タグを詳細に分析
  console.log("📝 第一問（仕訳）の詳細タグ分析:");
  const journalQuestions = [];
  const journalPattern =
    /"id": "(Q_J_\d+)",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let journalMatch;

  while ((journalMatch = journalPattern.exec(content)) !== null) {
    const id = journalMatch[1];
    const tagsRaw = journalMatch[2]
      .replace(/\\"/g, '"')
      .replace(/"/g, "")
      .split(",")
      .map((t) => t.trim());
    journalQuestions.push({ id, tags: tagsRaw });
  }

  // タグの詳細統計
  const tagStats = {};
  journalQuestions.forEach((q) => {
    q.tags.forEach((tag) => {
      if (!tagStats[tag]) tagStats[tag] = [];
      tagStats[tag].push(q.id);
    });
  });

  console.log(`  総問題数: ${journalQuestions.length}問\n`);

  // 各タグの出現回数をソート表示
  const sortedTags = Object.entries(tagStats).sort(
    (a, b) => b[1].length - a[1].length,
  );
  console.log("  タグ別問題数（多い順）:");
  sortedTags.forEach(([tag, questions]) => {
    console.log(`    ${tag}: ${questions.length}問`);
  });

  console.log("\n🎯 problemsStrategy.mdとの対応分析:");

  // problemsStrategy.mdに基づく理想的な分類
  const idealCategories = {
    "現金・預金取引": 42,
    商品売買取引: 45,
    "債権・債務": 41,
    "給与・税金": 42,
    固定資産: 40,
    決算整理: 40,
  };

  console.log("\n  理想的な分類（problemsStrategy.md準拠）:");
  Object.entries(idealCategories).forEach(([category, count]) => {
    console.log(`    ${category}: ${count}問`);
  });

  // 現在のタグを理想的な分類にマッピング（推定）
  console.log("\n📊 推定マッピング:");

  const categoryMappings = {
    "現金・預金取引": [
      "現金取引",
      "現金・預金",
      "預け入れ",
      "引き出し",
      "現金過不足",
    ],
    商品売買取引: ["基本仕訳", "商品売買", "掛取引"],
    "債権・債務": [
      "売掛金",
      "買掛金",
      "手形取引",
      "受取手形",
      "支払手形",
      "債権回収",
      "債務支払",
    ],
    "給与・税金": ["租税公課"], // 他の給与・税金タグは見当たらない
    固定資産: ["減価償却", "定額法", "固定資産"],
    決算整理: [
      "決算整理",
      "貸倒引当金",
      "見積計上",
      "前払費用",
      "経過勘定",
      "未払費用",
      "前受収益",
      "消耗品",
    ],
  };

  Object.entries(categoryMappings).forEach(([category, mappedTags]) => {
    const totalQuestions = mappedTags.reduce((sum, tag) => {
      return sum + (tagStats[tag] ? tagStats[tag].length : 0);
    }, 0);
    console.log(
      `    ${category}: ${totalQuestions}問 (理想: ${idealCategories[category]}問)`,
    );
    mappedTags.forEach((tag) => {
      const count = tagStats[tag] ? tagStats[tag].length : 0;
      console.log(`      - ${tag}: ${count}問`);
    });
  });

  // 第二問の分析
  console.log("\n📋 第二問（帳簿）の詳細タグ分析:");
  const ledgerQuestions = [];
  const ledgerPattern =
    /"id": "(Q_L_\d+)",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let ledgerMatch;

  while ((ledgerMatch = ledgerPattern.exec(content)) !== null) {
    const id = ledgerMatch[1];
    const tagsRaw = ledgerMatch[2]
      .replace(/\\"/g, '"')
      .replace(/"/g, "")
      .split(",")
      .map((t) => t.trim());
    ledgerQuestions.push({ id, tags: tagsRaw });
  }

  const ledgerTagStats = {};
  ledgerQuestions.forEach((q) => {
    q.tags.forEach((tag) => {
      if (!ledgerTagStats[tag]) ledgerTagStats[tag] = [];
      ledgerTagStats[tag].push(q.id);
    });
  });

  console.log(`  総問題数: ${ledgerQuestions.length}問`);
  console.log("  タグ別問題数:");
  Object.entries(ledgerTagStats)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([tag, questions]) => {
      console.log(`    ${tag}: ${questions.length}問`);
    });

  // 第三問の分析
  console.log("\n📊 第三問（決算書）の詳細タグ分析:");
  const trialQuestions = [];
  const trialPattern = /"id": "(Q_T_\d+)",[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let trialMatch;

  while ((trialMatch = trialPattern.exec(content)) !== null) {
    const id = trialMatch[1];
    const tagsRaw = trialMatch[2]
      .replace(/\\"/g, '"')
      .replace(/"/g, "")
      .split(",")
      .map((t) => t.trim());
    trialQuestions.push({ id, tags: tagsRaw });
  }

  const trialTagStats = {};
  trialQuestions.forEach((q) => {
    q.tags.forEach((tag) => {
      if (!trialTagStats[tag]) trialTagStats[tag] = [];
      trialTagStats[tag].push(q.id);
    });
  });

  console.log(`  総問題数: ${trialQuestions.length}問`);
  console.log("  タグ別問題数:");
  Object.entries(trialTagStats)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([tag, questions]) => {
      console.log(`    ${tag}: ${questions.length}問`);
    });
} catch (error) {
  console.error("❌ 分析エラー:", error.message);
}
