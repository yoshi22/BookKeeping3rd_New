#!/usr/bin/env node

/**
 * 壊れたanswer_template_jsonフィールドを修正
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
const jsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.js",
);

console.log("🔧 壊れたanswer_template_jsonフィールドを修正中...\n");

// 正しいanswer_template_jsonテンプレート
const correctAnswerTemplate = {
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

const correctAnswerTemplateJson = JSON.stringify(correctAnswerTemplate);
console.log("正しいテンプレート:", correctAnswerTemplateJson, "\n");

// TypeScriptファイルを修正
console.log("📝 TypeScriptファイルを修正中...");
let tsContent = fs.readFileSync(tsFilePath, "utf8");

// 壊れたanswer_template_jsonフィールドを検索・置換
const brokenJsonRegex = /"answer_template_json":\s*"[^"]*\{.*?\}[^"]*"/g;

let matches = tsContent.match(brokenJsonRegex);
if (matches) {
  console.log(`${matches.length}個の壊れたJSONフィールドを発見しました`);

  // すべてのQ_L_問題の answer_template_json を正しいものに置換
  tsContent = tsContent.replace(
    /"answer_template_json":\s*"[^"]*\{.*?\}[^"]*"/g,
    `"answer_template_json": "${correctAnswerTemplateJson.replace(/"/g, '\\"')}"`,
  );

  fs.writeFileSync(tsFilePath, tsContent, "utf8");
  console.log("✅ TypeScriptファイル修正完了");
} else {
  console.log("⚠️  TypeScriptファイルで壊れたJSONが見つかりませんでした");
}

// JavaScriptファイルも修正
console.log("\n📝 JavaScriptファイルを修正中...");
let jsContent = fs.readFileSync(jsFilePath, "utf8");

// JavaScriptファイルの修正 (シングルクォートを使用)
jsContent = jsContent.replace(
  /answer_template_json:\s*'[^']*\{.*?\}[^']*'/g,
  `answer_template_json: '${correctAnswerTemplateJson.replace(/'/g, "\\'")}'`,
);

fs.writeFileSync(jsFilePath, jsContent, "utf8");
console.log("✅ JavaScriptファイル修正完了");

console.log("\n🎉 修正完了！アプリを再起動してください。");
