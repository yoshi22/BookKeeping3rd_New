#!/usr/bin/env node

/**
 * 第一問（Q_J_001-045）の分析スクリプト
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔍 第一問（Q_J_001〜Q_J_045）の分析を開始...\n");

// TypeScriptファイルを読み込む
const content = fs.readFileSync(tsFilePath, "utf8");

// 問題を抽出
const questionRegex =
  /"id":\s*"(Q_J_\d{3})"[\s\S]*?"question_text":\s*"([^"]*)"[\s\S]*?"answer_template_json":\s*"([^"]*)"[\s\S]*?"correct_answer_json":\s*"([^"]*)"[\s\S]*?"tags_json":\s*"([^"]*)"/g;

let match;
const questions = [];

while ((match = questionRegex.exec(content)) !== null) {
  const questionId = match[1];
  const questionText = match[2].replace(/\\n/g, "\n").replace(/\\/g, "");
  const answerTemplate = match[3];
  const correctAnswer = match[4];
  const tags = match[5];

  // Q_J_001-045のみ対象
  const num = parseInt(questionId.replace("Q_J_", ""));
  if (num >= 1 && num <= 45) {
    // タグからサブカテゴリを抽出
    let subcategory = "不明";
    try {
      const tagsObj = JSON.parse(tags.replace(/\\/g, ""));
      subcategory = tagsObj.subcategory || "不明";
    } catch (e) {
      // エラー無視
    }

    // テンプレートタイプを確認
    let templateType = "不明";
    try {
      const template = JSON.parse(answerTemplate.replace(/\\/g, ""));
      templateType = template.type || "不明";
    } catch (e) {
      // エラー無視
    }

    questions.push({
      id: questionId,
      text: questionText.substring(0, 50) + "...",
      subcategory: subcategory,
      templateType: templateType,
      hasAmount: questionText.includes("円"),
      hasDate: questionText.includes("月") || questionText.includes("日"),
    });
  }
}

// problemsStrategy.mdに基づく理想的な配分
const idealDistribution = {
  "現金・預金取引": 7, // 42問 / 6 ≈ 7問
  商品売買取引: 8, // 45問 / 6 ≈ 8問
  "債権・債務": 7, // 41問 / 6 ≈ 7問
  "給与・税金": 7, // 42問 / 6 ≈ 7問
  固定資産: 7, // 40問 / 6 ≈ 7問
  決算整理: 7, // 40問 / 6 ≈ 7問
};

// カテゴリマッピング
const categoryMapping = {
  cash_deposit: "現金・預金取引",
  merchandise_trade: "商品売買取引",
  receivables_debts: "債権・債務",
  salary_tax: "給与・税金",
  fixed_assets: "固定資産",
  year_end_adj: "決算整理",
};

// 現在の分布を集計
const currentDistribution = {};
questions.forEach((q) => {
  const category = categoryMapping[q.subcategory] || q.subcategory;
  currentDistribution[category] = (currentDistribution[category] || 0) + 1;
});

// レポート出力
console.log("【問題数】", questions.length, "問\n");

console.log("【理想的な配分】");
Object.entries(idealDistribution).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}問`);
});

console.log("\n【現在の配分】");
Object.entries(currentDistribution).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}問`);
});

console.log("\n【カテゴリー別問題詳細】");
questions.forEach((q, i) => {
  if (i % 5 === 0) console.log("");
  const category = categoryMapping[q.subcategory] || q.subcategory;
  console.log(`${q.id}: ${category} | template:${q.templateType}`);
});

// 問題文の妥当性チェック
console.log("\n【問題文チェック】");
let issueCount = 0;
questions.forEach((q) => {
  const issues = [];

  // 金額がない問題
  if (!q.hasAmount) {
    issues.push("金額なし");
  }

  // テンプレートタイプが不適切
  if (q.templateType !== "journal_entry") {
    issues.push(`テンプレート:${q.templateType}`);
  }

  if (issues.length > 0) {
    issueCount++;
    console.log(`  ${q.id}: ${issues.join(", ")}`);
  }
});

if (issueCount === 0) {
  console.log("  ✅ 全問題に金額が含まれており、適切なテンプレートを使用");
} else {
  console.log(`\n  ⚠️ ${issueCount}問に問題あり`);
}

// 総合評価
console.log("\n【総合評価】");
const distributionDiff = Object.keys(idealDistribution).reduce((sum, cat) => {
  const ideal = idealDistribution[cat];
  const current = currentDistribution[cat] || 0;
  return sum + Math.abs(ideal - current);
}, 0);

if (distributionDiff <= 5) {
  console.log("✅ カテゴリー配分は概ね適切");
} else {
  console.log(`⚠️ カテゴリー配分に偏りあり（偏差合計: ${distributionDiff}）`);
}
