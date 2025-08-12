#!/usr/bin/env node

/**
 * Q_J_001-045のJSON二重定義を簡単に修正
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

console.log("🔧 Q_J_001-045のJSON二重定義を簡単に修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");
let modified = false;

// 二重定義の開始部分を探して削除
const startPattern = '}"type":\\"ledger_entry\\"';
const endPattern = '\\"maxEntries\\":10}';

let startIndex = content.indexOf(startPattern);
while (startIndex !== -1) {
  const endIndex = content.indexOf(endPattern, startIndex);
  if (endIndex !== -1) {
    // 削除する部分
    const toRemove = content.substring(
      startIndex + 1,
      endIndex + endPattern.length,
    );
    content =
      content.substring(0, startIndex + 1) +
      content.substring(endIndex + endPattern.length);
    console.log(`✅ JSON二重定義を削除しました`);
    modified = true;
  }
  startIndex = content.indexOf(startPattern, startIndex + 1);
}

// tags_jsonの二重定義も同様に修正
const tagsStartPattern = '}"subcategory":\\"';
const tagsEndPattern = '\\"examSection\\":1}';

startIndex = content.indexOf(tagsStartPattern);
while (startIndex !== -1) {
  const endIndex = content.indexOf(tagsEndPattern, startIndex);
  if (endIndex !== -1 && endIndex > startIndex && endIndex - startIndex < 500) {
    // 削除する部分
    const toRemove = content.substring(
      startIndex + 1,
      endIndex + tagsEndPattern.length,
    );
    if (toRemove.includes("accounts") && toRemove.includes("keywords")) {
      content =
        content.substring(0, startIndex + 1) +
        content.substring(endIndex + tagsEndPattern.length);
      console.log(`✅ Tags JSON二重定義を削除しました`);
      modified = true;
    }
  }
  startIndex = content.indexOf(tagsStartPattern, startIndex + 1);
}

if (modified) {
  // ファイル保存
  fs.writeFileSync(tsFilePath, content, "utf8");
  console.log("\n✅ Q_J_001-045のJSON二重定義を修正しました！");
} else {
  console.log("⚠️ 修正対象が見つかりませんでした");
}
