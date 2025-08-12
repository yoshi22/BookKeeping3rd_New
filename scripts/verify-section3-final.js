#!/usr/bin/env node

/**
 * 第三問の最終確認スクリプト
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

console.log("🔍 第三問（Q_T_001〜Q_T_012）の最終確認を開始...\n");

// TypeScriptファイルを読み込む
const content = fs.readFileSync(tsFilePath, "utf8");

// 問題を抽出 - より柔軟なパターン
const questionRegex =
  /"id":\s*"(Q_T_\d{3})"[\s\S]*?"question_text":\s*"([^"]*)"[\s\S]*?"answer_template_json":\s*"([^"]*)"[\s\S]*?"correct_answer_json":\s*"([^"]*)"/g;

let match;
let verificationResults = [];
let issueCount = 0;

console.log("【パターン別確認】");
console.log("=".repeat(60));

while ((match = questionRegex.exec(content)) !== null) {
  const questionId = match[1]; // 既にQ_T_XXX形式
  const questionText = match[2];
  const answerTemplate = match[3];
  const correctAnswer = match[4];

  let issues = [];
  let patternName = "";

  // テンプレートタイプの確認
  try {
    const template = JSON.parse(answerTemplate.replace(/\\"/g, '"'));
    const questionNum = parseInt(questionId.replace("Q_T_", ""));

    if (questionNum >= 1 && questionNum <= 4) {
      patternName = "財務諸表作成";
      if (template.type === "financial_statement") {
        issues.push("✅ テンプレート: 財務諸表形式");
      } else {
        issues.push(
          `❌ テンプレート: ${template.type}（財務諸表形式ではない）`,
        );
      }
    } else if (questionNum >= 5 && questionNum <= 8) {
      patternName = "精算表作成";
      if (template.type === "worksheet") {
        issues.push("✅ テンプレート: 精算表形式");
      } else {
        issues.push(`❌ テンプレート: ${template.type}（精算表形式ではない）`);
      }
    } else if (questionNum >= 9 && questionNum <= 12) {
      patternName = "試算表作成";
      if (template.type === "trial_balance") {
        issues.push("✅ テンプレート: 試算表形式");
      } else {
        issues.push(`❌ テンプレート: ${template.type}（試算表形式ではない）`);
      }
    }

    // テンプレート構造の確認
    if (template.type === "financial_statement") {
      if (template.sections && template.sections.length === 2) {
        issues.push("✅ 構造: 貸借対照表・損益計算書の2セクション");
      } else {
        issues.push("❌ 構造: セクション構成が不適切");
      }
    } else if (template.type === "worksheet") {
      if (template.columns && template.columns.length >= 8) {
        issues.push("✅ 構造: 8桁精算表の列構成");
      } else {
        issues.push("❌ 構造: 精算表の列構成が不適切");
      }
    } else if (template.type === "trial_balance") {
      if (template.columns && template.columns.length === 4) {
        issues.push("✅ 構造: 試算表の4列構成（科目・借方・貸方・残高）");
      } else {
        issues.push("❌ 構造: 試算表の列構成が不適切");
      }
    }
  } catch (e) {
    issues.push("❌ テンプレート: JSONパースエラー");
  }

  // 問題文の確認
  if (questionText.includes("【") && questionText.includes("】")) {
    issues.push("✅ 問題文: 適切な形式");
  } else {
    issues.push("⚠️  問題文: 形式確認が必要");
  }

  // 正解データの確認
  try {
    const answer = JSON.parse(correctAnswer.replace(/\\"/g, '"'));
    const questionNum = parseInt(questionId.replace("Q_T_", ""));

    if (questionNum >= 1 && questionNum <= 4) {
      if (answer.balance_sheet && answer.income_statement) {
        issues.push("✅ 正解データ: 財務諸表データあり");
      } else {
        issues.push("⚠️  正解データ: 財務諸表データ要確認");
      }
    } else if (questionNum >= 5 && questionNum <= 8) {
      if (answer.worksheet) {
        issues.push("✅ 正解データ: 精算表データあり");
      } else {
        issues.push("⚠️  正解データ: 精算表データ要確認");
      }
    } else if (questionNum >= 9 && questionNum <= 12) {
      if (answer.trial_balance) {
        issues.push("✅ 正解データ: 試算表データあり");
      } else {
        issues.push("⚠️  正解データ: 試算表データ要確認");
      }
    }
  } catch (e) {
    issues.push("❌ 正解データ: JSONパースエラー");
  }

  // 問題がある場合のみ詳細を表示
  const hasIssue = issues.some((i) => i.includes("❌") || i.includes("⚠️"));
  if (hasIssue) {
    issueCount++;
  }

  console.log(`\n${questionId} [${patternName}]:`);
  issues.forEach((issue) => console.log(`  ${issue}`));

  verificationResults.push({
    id: questionId,
    pattern: patternName,
    issues: issues,
    hasIssue: hasIssue,
  });
}

// サマリー表示
console.log("\n" + "=".repeat(60));
console.log("📊 最終確認サマリー");
console.log("=".repeat(60));

const totalQuestions = verificationResults.length;
const perfectQuestions = verificationResults.filter((r) => !r.hasIssue).length;

console.log(`\n総問題数: ${totalQuestions}`);
console.log(`問題なし: ${perfectQuestions} 問`);
console.log(`要確認: ${issueCount} 問`);

// パターン別の確認
console.log("\n【パターン別状況】");
const patterns = ["財務諸表作成", "精算表作成", "試算表作成"];
patterns.forEach((pattern) => {
  const patternQuestions = verificationResults.filter(
    (r) => r.pattern === pattern,
  );
  const patternPerfect = patternQuestions.filter((r) => !r.hasIssue).length;
  const status = patternPerfect === patternQuestions.length ? "✅" : "⚠️";
  console.log(
    `${status} ${pattern}: ${patternPerfect}/${patternQuestions.length}`,
  );
});

if (issueCount === 0) {
  console.log("\n🎉 第三問の全12問が適切に設定されています！");
} else {
  console.log(`\n⚠️  ${issueCount} 問に確認が必要な項目があります。`);
}
