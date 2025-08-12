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

console.log("🔧 tags_jsonの二重定義を修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");
let lines = content.split("\n");
let fixedCount = 0;

// tags_jsonの行を修正
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // tags_jsonの行を検出
  if (line.includes('"tags_json":') && line.includes('\":1}"subcat')) {
    const pos = line.indexOf('\":1}"subcat');
    if (pos !== -1) {
      // 1}までを保持し、その後から最後の",までを削除
      const beforeBad = line.substring(0, pos + 4); // "\":1}"まで
      const afterBad = line.lastIndexOf('",');
      if (afterBad !== -1 && afterBad > pos) {
        lines[i] = beforeBad + line.substring(afterBad);
        console.log(`✅ Line ${i + 1}: tags_json修正`);
        fixedCount++;
      }
    }
  }
}

// ファイル保存
fs.writeFileSync(tsFilePath, lines.join("\n"), "utf8");

console.log(`\n✅ ${fixedCount}箇所のtags_json二重定義を修正しました！`);
