#!/usr/bin/env node

/**
 * Q_J_001-045のJSON二重定義を最終修正
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

console.log("🔧 Q_J_001-045のJSON二重定義を最終修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");
let count = 0;

// ledger_entryテンプレートの二重定義を削除
// パターン: maxEntries":5}"type":"ledger_entry"...maxEntries":10}
const pattern =
  /("maxEntries":5\})"type":\\"ledger_entry\\",\\"fields\\":\[[^\]]*\],\\"allowMultipleEntries\\":true,\\"maxEntries\\":10\}/g;
content = content.replace(pattern, (match, p1) => {
  count++;
  return p1;
});

console.log(`✅ ${count}個のテンプレート二重定義を修正`);

// tags_jsonの二重定義も削除
// パターン: "examSection":1}"subcategory":"...examSection":1}
count = 0;
const tagsPattern =
  /("examSection":1\})"subcategory":\\"[^"]*\\",\\"pattern\\":\\"[^"]*\\",\\"accounts\\":\[[^\]]*\],\\"keywords\\":\[[^\]]*\],\\"examSection\\":1\}/g;
content = content.replace(tagsPattern, (match, p1) => {
  count++;
  return p1;
});

console.log(`✅ ${count}個のタグ二重定義を修正`);

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ すべてのJSON二重定義を修正しました！");
