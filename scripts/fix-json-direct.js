#!/usr/bin/env node

/**
 * 第三問のJSON不正連結を直接修正
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

console.log("🔧 JSON不正連結を直接修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// 修正カウンター
let fixCount = 0;

// 不正なパターンを検出して修正
// パターン: 30}"type\":\"ledger_entry\"
const malformedPattern = /30\}"type\\":\\"ledger_entry[^"]*?\}/g;

content = content.replace(malformedPattern, (match) => {
  fixCount++;
  console.log(`✅ 不正なJSON連結を修正: ${match.substring(0, 50)}...`);
  return "30}";
});

// 別のパターンも修正（精算表と試算表用）
// worksheet用
const worksheetPattern = /(\d+)\}"type\\":\\"ledger_entry[^"]*?\}/g;
content = content.replace(worksheetPattern, (match, p1) => {
  if (p1 !== "30") {
    // 既に処理したものは除外
    fixCount++;
    console.log(`✅ 不正なJSON連結を修正（${p1}で終わるパターン）`);
    return p1 + "}";
  }
  return match;
});

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log(`\n✅ ${fixCount} 箇所のJSON不正連結を修正しました！`);
