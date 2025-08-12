#!/usr/bin/env node

/**
 * master-questions.js の malformed JSON を修正
 */

const fs = require("fs");
const path = require("path");

const jsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.js",
);

console.log("🔧 master-questions.js の malformed JSON を修正中...\n");

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

let content = fs.readFileSync(jsFilePath, "utf8");
let fixCount = 0;

console.log("Q_L_ 問題の malformed answer_template_json を修正中...");

// Q_L_問題の malformed answer_template_json を修正
// 正規表現で answer_template_json フィールドを検索し、複数のJSON objectが連結されたものを単一の正しいJSONに置換
const malformedJsonRegex =
  /answer_template_json:\s*'[^']*\{[^']*allowMultipleEntries[^']*\}[^']*'/g;

content = content.replace(malformedJsonRegex, (match) => {
  // Q_L_ 問題かどうかをチェック
  const beforeMatch = content.substring(0, content.indexOf(match));
  const isLedgerQuestion =
    beforeMatch.includes('id: "Q_L_') &&
    beforeMatch.lastIndexOf('id: "Q_L_') > beforeMatch.lastIndexOf("},");

  if (isLedgerQuestion) {
    fixCount++;
    console.log(`  ✅ Q_L_問題 ${fixCount} を修正しました`);
    return `answer_template_json: '${correctJsonString}'`;
  }

  return match;
});

// バックアップを作成
fs.writeFileSync(jsFilePath + ".backup", fs.readFileSync(jsFilePath, "utf8"));

// 修正されたファイルを保存
fs.writeFileSync(jsFilePath, content, "utf8");

console.log(`\n🎉 ${fixCount} 問の malformed JSON を修正しました！`);
console.log("📝 JavaScriptファイルのバックアップを .backup として保存しました");

// 簡単な構文チェック
try {
  require(jsFilePath);
  console.log("✅ JavaScript ファイルの構文チェック: OK");
} catch (error) {
  console.log("❌ JavaScript構文エラー:", error.message);
}
