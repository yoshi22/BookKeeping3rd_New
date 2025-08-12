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

// Q_J_001の部分を抽出
const startIndex = content.indexOf('"Q_J_001"');
const endIndex = content.indexOf('"Q_J_002"');
const q_j_001_content = content.substring(startIndex - 20, endIndex);

console.log("Q_J_001のRAWデータ:");
console.log(q_j_001_content);

// 正規表現でマッチングテスト - エスケープされたJSONを考慮
const regex = /"answer_template_json":\s*"((?:[^"\\]|\\.)*)"/;
const match = q_j_001_content.match(regex);

if (match) {
  console.log("\n抽出されたanswer_template_json:");
  console.log(match[1]);

  console.log("\nJSON.parseテスト:");
  try {
    // エスケープされた文字列を元に戻す
    const unescaped = match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    console.log("\nアンエスケープ後:");
    console.log(unescaped);
    const parsed = JSON.parse(unescaped);
    console.log("✅ パース成功:", parsed);
  } catch (error) {
    console.log("❌ パースエラー:", error.message);
  }
}
