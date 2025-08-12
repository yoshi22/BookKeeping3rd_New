#!/usr/bin/env node

/**
 * 全てのQ_L_問題のanswer_template_jsonを一括修正
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

console.log("🔧 全Q_L_問題のanswer_template_json一括修正中...\n");

// 正しいanswer_template_json
const correctJson = {
  type: "ledger_entry",
  fields: [
    {
      name: "date",
      label: "日付",
      type: "text",
      required: true,
      placeholder: "例: 10/5",
    },
    {
      name: "description",
      label: "摘要",
      type: "text",
      required: true,
      placeholder: "例: 現金売上",
    },
    {
      name: "debit_amount",
      label: "借方金額",
      type: "number",
      required: false,
      format: "currency",
    },
    {
      name: "credit_amount",
      label: "貸方金額",
      type: "number",
      required: false,
      format: "currency",
    },
    {
      name: "balance",
      label: "残高",
      type: "number",
      required: true,
      format: "currency",
    },
  ],
  allowMultipleEntries: true,
  maxEntries: 10,
};

const correctJsonString = JSON.stringify(correctJson);

let content = fs.readFileSync(tsFilePath, "utf8");
let fixCount = 0;

console.log("修正対象のQ_L_問題を検索中...");

// Q_L_問題のanswer_template_jsonフィールドを一括置換
// 正規表現で問題ブロック全体をマッチして、answer_template_json部分だけ置換
const questionPattern =
  /("id":\s*"Q_L_\d+",[\s\S]*?"answer_template_json":\s*)"[^"]*"([\s\S]*?(?="correct_answer_json"|$))/g;

content = content.replace(questionPattern, (match, beforeJson, afterJson) => {
  fixCount++;
  // IDを抽出
  const idMatch = match.match(/"id":\s*"(Q_L_\d+)"/);
  const questionId = idMatch ? idMatch[1] : `問題${fixCount}`;
  console.log(`  ✅ ${questionId} を修正しました`);

  return beforeJson + `"${correctJsonString.replace(/"/g, '\\"')}"` + afterJson;
});

fs.writeFileSync(tsFilePath, content, "utf8");
console.log(`\n🎉 ${fixCount} 問の修正完了！`);
console.log("TypeScript構文エラーをチェック中...");

// TypeScriptコンパイルエラーをチェック
const { exec } = require("child_process");
exec(
  'npx tsc --noEmit --project . 2>&1 | grep "master-questions.ts" | head -5',
  (error, stdout, stderr) => {
    if (stdout.trim()) {
      console.log("\n⚠️  まだエラーがあります:");
      console.log(stdout);
    } else {
      console.log("\n✅ TypeScript構文エラーは解消されました！");
    }
  },
);
