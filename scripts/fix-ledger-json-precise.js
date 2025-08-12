#!/usr/bin/env node

/**
 * Q_L_問題のanswer_template_jsonを精密に修正
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

console.log("🔧 Q_L_問題のanswer_template_jsonを精密修正中...\n");

// 正しいanswer_template_json
const correctJsonString =
  '{"type":"ledger_entry","fields":[{"name":"date","label":"日付","type":"text","required":true,"placeholder":"例: 10/5"},{"name":"description","label":"摘要","type":"text","required":true,"placeholder":"例: 現金売上"},{"name":"debit_amount","label":"借方金額","type":"number","required":false,"format":"currency"},{"name":"credit_amount","label":"貸方金額","type":"number","required":false,"format":"currency"},{"name":"balance","label":"残高","type":"number","required":true,"format":"currency"}],"allowMultipleEntries":true,"maxEntries":10}';

let tsContent = fs.readFileSync(tsFilePath, "utf8");

// Q_L_001から Q_L_040 まで個別に処理
let fixCount = 0;
for (let i = 1; i <= 40; i++) {
  const questionId = `Q_L_${i.toString().padStart(3, "0")}`;
  console.log(`処理中: ${questionId}`);

  // この問題のブロック全体を検索
  const questionBlockRegex = new RegExp(
    `(\\{\\s*"id":\\s*"${questionId}"[\\s\\S]*?"answer_template_json":\\s*)"[^"]*"([\\s\\S]*?"\\}\\s*,?)`,
    "g",
  );

  const match = tsContent.match(questionBlockRegex);
  if (match) {
    // answer_template_json部分を置換
    tsContent = tsContent.replace(
      questionBlockRegex,
      `$1"${correctJsonString.replace(/"/g, '\\"')}"$2`,
    );
    fixCount++;
    console.log(`  ✅ ${questionId} 修正完了`);
  } else {
    console.log(`  ⚠️  ${questionId} が見つかりません`);
  }
}

fs.writeFileSync(tsFilePath, tsContent, "utf8");
console.log(`\n🎉 ${fixCount}/40 問の修正完了！`);
