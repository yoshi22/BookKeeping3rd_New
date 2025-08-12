#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

// Parse the exported array
const match = content.match(/export const masterQuestions.*?= (\[[\s\S]*?\]);/);
if (match) {
  const questions = eval(match[1]);
  const ledgerQuestions = questions.filter((q) => q.id.startsWith("Q_L_"));

  console.log("🔍 第二問の回答テンプレート確認\n");
  console.log("総問題数:", ledgerQuestions.length);
  console.log("");

  let categoryStats = {
    "勘定記入問題 (1-10)": { correct: 0, total: 0 },
    "補助簿問題 (11-20)": { correct: 0, total: 0 },
    "伝票問題 (21-30)": { correct: 0, total: 0 },
    "理論問題 (31-40)": { correct: 0, total: 0 },
  };

  let issues = [];

  ledgerQuestions.forEach((q) => {
    const num = parseInt(q.id.replace("Q_L_", ""));
    const template = JSON.parse(q.answer_template_json);

    let expectedType = "";
    let category = "";

    if (num >= 1 && num <= 10) {
      expectedType = "ledger_account";
      category = "勘定記入問題 (1-10)";
    } else if (num >= 11 && num <= 20) {
      expectedType = "subsidiary_book";
      category = "補助簿問題 (11-20)";
    } else if (num >= 21 && num <= 30) {
      expectedType = "voucher";
      category = "伝票問題 (21-30)";
    } else if (num >= 31 && num <= 40) {
      expectedType = "multiple_choice";
      category = "理論問題 (31-40)";
    }

    categoryStats[category].total++;

    if (template.type === expectedType) {
      categoryStats[category].correct++;
    } else {
      issues.push({
        id: q.id,
        expected: expectedType,
        actual: template.type,
        category: category,
      });
    }
  });

  // カテゴリ別の結果表示
  console.log("【カテゴリ別確認結果】");
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const status = stats.correct === stats.total ? "✅" : "❌";
    console.log(`${status} ${category}: ${stats.correct}/${stats.total}`);
  });

  if (issues.length > 0) {
    console.log("\n【問題のある項目】");
    issues.forEach((issue) => {
      console.log(
        `  ${issue.id}: 期待=${issue.expected}, 実際=${issue.actual}`,
      );
    });
    console.log(`\n❌ ${issues.length} 問に問題があります`);
  } else {
    console.log("\n✅ 全40問の回答フォームが適切に設定されています！");
  }
} else {
  console.log("❌ 問題データが見つかりません");
}
