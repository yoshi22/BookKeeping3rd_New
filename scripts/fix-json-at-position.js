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

console.log("🔧 JSON二重定義を位置指定で修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");
let lines = content.split("\n");
let fixedCount = 0;

// 問題のある行を修正
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // answer_template_jsonの行を検出
  if (line.includes('"answer_template_json":') && line.includes('\":5}"type')) {
    // maxEntries":5}の後の不正な部分を削除
    const pos = line.indexOf('\":5}"type');
    if (pos !== -1) {
      // 5}までを保持し、その後から最後の",までを削除
      const beforeBad = line.substring(0, pos + 4); // "\":5}"まで
      const afterBad = line.lastIndexOf('",');
      if (afterBad !== -1) {
        lines[i] = beforeBad + line.substring(afterBad);
        console.log(`✅ Line ${i + 1}: answer_template_json修正`);
        fixedCount++;
      }
    }
  }

  // tags_jsonの行も同様に修正
  if (line.includes('"tags_json":') && line.includes('1}"subcategory":')) {
    const pos = line.indexOf('1}"subcategory":');
    if (pos !== -1) {
      const beforeBad = line.substring(0, pos + 2); // "1}"まで
      const afterBad = line.lastIndexOf('",');
      if (afterBad !== -1) {
        lines[i] = beforeBad + line.substring(afterBad);
        console.log(`✅ Line ${i + 1}: tags_json修正`);
        fixedCount++;
      }
    }
  }
}

// ファイル保存
fs.writeFileSync(tsFilePath, lines.join("\n"), "utf8");

console.log(`\n✅ ${fixedCount}箇所のJSON二重定義を修正しました！`);
