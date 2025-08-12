#!/usr/bin/env node

/**
 * TypeScriptファイルのJSON構文エラーを修正
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

console.log("🔧 TypeScriptファイルのJSON構文エラーを修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// 壊れたJSONパターンを検索して修正
// パターン: "...}],"allowMultipleEntries":true,"maxEntries":15}"type\":\"ledger_entry\"...
const brokenJsonPattern =
  /(\}\],"allowMultipleEntries":true,"maxEntries":\d+\})"type\\":\\"[^"]+\\"/g;

content = content.replace(brokenJsonPattern, (match, validPart) => {
  console.log("❌ 壊れたJSONを発見:", match.substring(0, 50) + "...");
  return validPart + '"'; // 正しい部分だけを残す
});

// もう一つのパターン: 末尾に余分なJSONが付いている場合
const extraJsonPattern =
  /"(answer_template_json":\s*"[^"]*?\})"[^"]*?"type\\"/g;
content = content.replace(extraJsonPattern, '"$1",');

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("✅ JSON構文エラーを修正しました");

// TypeScript構文チェック
const { exec } = require("child_process");
exec(
  'npx tsc --noEmit --project . 2>&1 | grep -E "(master-questions.ts)" | head -10',
  (error, stdout, stderr) => {
    if (stdout.trim()) {
      console.log("\n⚠️  まだTypeScriptエラーがあります:");
      console.log(stdout);
    } else {
      console.log("\n✅ TypeScript構文チェック: OK");
    }
  },
);
