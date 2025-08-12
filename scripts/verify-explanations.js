#!/usr/bin/env node

/**
 * 最初の10問の解説を確認して、個別カスタマイズされているかをチェック
 */

const fs = require("fs");
const path = require("path");

// TypeScriptファイルを読み込む
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

console.log("📋 最初の10問の解説確認:\n");

// データを抽出
const startPattern = /export const masterQuestions[^=]*=\s*\[/;
const startMatch = content.match(startPattern);
const startIndex = startMatch.index + startMatch[0].length - 1;

let depth = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex; i < content.length; i++) {
  const char = content[i];

  if (escapeNext) {
    escapeNext = false;
    continue;
  }

  if (char === "\\") {
    escapeNext = true;
    continue;
  }

  if (char === '"' && !inString) {
    inString = true;
  } else if (char === '"' && inString) {
    inString = false;
  }

  if (!inString) {
    if (char === "[" || char === "{") {
      depth++;
    } else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0 && char === "]") {
        endIndex = i + 1;
        break;
      }
    }
  }
}

const dataString = content.substring(startIndex, endIndex);
const questions = eval(dataString);

questions.slice(0, 10).forEach((q, index) => {
  console.log(`${index + 1}. ${q.id}:`);
  console.log(`   問題: ${q.question_text.substring(0, 50)}...`);
  console.log(`   解説: ${q.explanation}`);
  console.log("");
});

console.log(
  "✅ 解説の確認が完了しました。各問題が個別にカスタマイズされていることを確認できます。",
);
