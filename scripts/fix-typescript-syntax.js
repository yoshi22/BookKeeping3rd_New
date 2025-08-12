#!/usr/bin/env node

/**
 * TypeScriptファイルの構文エラーを修正
 * 不正なエスケープシーケンスを正しい改行文字に変換
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

console.log("🔧 TypeScriptファイルの構文エラーを修正中...\n");

// ファイルを読み込み
const content = fs.readFileSync(tsFilePath, "utf8");

// 問題のある部分を修正
let fixedContent = content
  // 配列の開始部分の不正な\nを修正
  .replace(/= \[\\n  \{/g, "= [\n  {")
  // 配列の終了部分を修正
  .replace(/\}\\n\];/, "}];")
  // オブジェクト間の不正な\nを修正
  .replace(/\},\\n  \{/g, "},\n  {")
  // explanation内の\nは保持（これらは文字列内の改行文字として正しい）
  .replace(
    /explanation: "([^"]*?)\\n\\n([^"]*?)\\n\\n([^"]*?)"/g,
    (match, p1, p2, p3) => {
      return `explanation: "${p1}\\n\\n${p2}\\n\\n${p3}"`;
    },
  );

// ファイルに書き戻し
fs.writeFileSync(tsFilePath, fixedContent, "utf8");

console.log("✅ TypeScriptファイルの構文エラーを修正しました！");
console.log("📋 修正内容:");
console.log("  - 配列宣言部分の不正な\\n文字を修正");
console.log("  - オブジェクト区切りの\\n文字を修正");
console.log("  - explanation内の改行文字は適切に保持");

console.log("\n🚀 アプリケーションが正常に動作するはずです！");
