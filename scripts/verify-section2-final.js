#!/usr/bin/env node

/**
 * 第二問の最終確認スクリプト
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

console.log("🔍 第二問（Q_L_001〜Q_L_040）の最終確認を開始...\n");

// TypeScriptファイルを読み込む
const content = fs.readFileSync(tsFilePath, "utf8");

// 問題を抽出
const questionRegex =
  /"id":\s*"Q_L_(\d{3})"[^}]*?"question_text":\s*"([^"]*)"[^}]*?"answer_template_json":\s*"([^"]*)"[^}]*?"correct_answer_json":\s*"([^"]*)"/g;

let match;
let verificationResults = [];
let issueCount = 0;

while ((match = questionRegex.exec(content)) !== null) {
  const questionId = `Q_L_${match[1]}`;
  const questionText = match[2];
  const answerTemplate = match[3];
  const correctAnswer = match[4];

  let issues = [];

  // 問題文の確認
  if (
    questionText.includes("（詳細は問題文参照）") &&
    !questionText.includes("【当月の取引】")
  ) {
    issues.push("❌ 問題文: 取引の詳細が不足");
  } else {
    issues.push("✅ 問題文: 適切");
  }

  // 回答テンプレートの確認
  try {
    const template = JSON.parse(answerTemplate);
    const questionNum = parseInt(match[1]);

    if (questionNum >= 1 && questionNum <= 10) {
      // 勘定記入問題
      if (template.type === "ledger_account") {
        issues.push("✅ 回答フォーム: 勘定記入用テンプレート");
      } else {
        issues.push("❌ 回答フォーム: 勘定記入問題に不適切");
      }
    } else if (questionNum >= 11 && questionNum <= 20) {
      // 補助簿問題
      if (template.type === "subsidiary_book") {
        issues.push("✅ 回答フォーム: 補助簿用テンプレート");
      } else {
        issues.push("❌ 回答フォーム: 補助簿問題に不適切");
      }
    } else if (questionNum >= 21 && questionNum <= 30) {
      // 伝票問題
      if (template.type === "voucher") {
        issues.push("✅ 回答フォーム: 伝票用テンプレート");
      } else {
        issues.push("❌ 回答フォーム: 伝票問題に不適切");
      }
    } else if (questionNum >= 31 && questionNum <= 40) {
      // 理論問題
      if (template.type === "multiple_choice") {
        issues.push("✅ 回答フォーム: 選択式テンプレート");
      } else {
        issues.push("❌ 回答フォーム: 理論問題に不適切");
      }
    }
  } catch (e) {
    issues.push("❌ 回答フォーム: JSONパースエラー");
  }

  // 正解データの確認
  try {
    const answer = JSON.parse(correctAnswer);
    const questionNum = parseInt(match[1]);

    if (questionNum >= 1 && questionNum <= 10) {
      if (answer.ledger_account || answer.ledgerEntry) {
        issues.push("✅ 正解データ: 形式OK");
      } else {
        issues.push("⚠️  正解データ: 要確認");
      }
    } else if (questionNum >= 11 && questionNum <= 20) {
      if (answer.subsidiary_book || answer.ledgerEntry) {
        issues.push("✅ 正解データ: 形式OK");
      } else {
        issues.push("⚠️  正解データ: 要確認");
      }
    } else if (questionNum >= 21 && questionNum <= 30) {
      if (answer.voucher || answer.ledgerEntry) {
        issues.push("✅ 正解データ: 形式OK");
      } else {
        issues.push("⚠️  正解データ: 要確認");
      }
    } else if (questionNum >= 31 && questionNum <= 40) {
      if (answer.multiple_choice || answer.ledgerEntry) {
        issues.push("✅ 正解データ: 形式OK");
      } else {
        issues.push("⚠️  正解データ: 要確認");
      }
    }
  } catch (e) {
    issues.push("❌ 正解データ: JSONパースエラー");
  }

  // 問題がある場合のみ詳細を表示
  const hasIssue = issues.some((i) => i.includes("❌") || i.includes("⚠️"));
  if (hasIssue) {
    issueCount++;
    console.log(`\n${questionId}:`);
    issues.forEach((issue) => console.log(`  ${issue}`));
  }

  verificationResults.push({
    id: questionId,
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

if (issueCount === 0) {
  console.log("\n🎉 全40問の第二問が適切に設定されています！");
} else {
  console.log(`\n⚠️  ${issueCount} 問に確認が必要な項目があります。`);
}

// カテゴリ別の確認
console.log("\n【カテゴリ別状況】");
console.log(
  "Q_L_001-010 勘定記入問題: " +
    (verificationResults.slice(0, 10).every((r) => !r.hasIssue)
      ? "✅ OK"
      : "⚠️  要確認"),
);
console.log(
  "Q_L_011-020 補助簿問題: " +
    (verificationResults.slice(10, 20).every((r) => !r.hasIssue)
      ? "✅ OK"
      : "⚠️  要確認"),
);
console.log(
  "Q_L_021-030 伝票問題: " +
    (verificationResults.slice(20, 30).every((r) => !r.hasIssue)
      ? "✅ OK"
      : "⚠️  要確認"),
);
console.log(
  "Q_L_031-040 理論問題: " +
    (verificationResults.slice(30, 40).every((r) => !r.hasIssue)
      ? "✅ OK"
      : "⚠️  要確認"),
);
