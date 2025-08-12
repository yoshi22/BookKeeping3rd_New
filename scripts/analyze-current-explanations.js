#!/usr/bin/env node

/**
 * 現在の解説内容を分析し、汎用的な解説を使用している問題を特定
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

// 解説パターンを分析
const explanationPatterns = new Map();
const genericPatterns = [
  "この仕訳では、借方と貸方の金額を一致させることが重要です",
  "帳簿への転記・記入問題です",
  "表作成問題です",
];

questions.forEach((question) => {
  const explanation = question.explanation;

  // 汎用的パターンをチェック
  const isGeneric = genericPatterns.some((pattern) =>
    explanation.includes(pattern),
  );

  if (isGeneric) {
    // 汎用的解説を使用している問題
    const patternKey = genericPatterns.find((pattern) =>
      explanation.includes(pattern),
    );

    if (!explanationPatterns.has(patternKey)) {
      explanationPatterns.set(patternKey, []);
    }
    explanationPatterns.get(patternKey).push({
      id: question.id,
      question_text: question.question_text.substring(0, 100) + "...",
    });
  }
});

console.log("📊 汎用的解説を使用している問題の分析結果\n");

explanationPatterns.forEach((questions, pattern) => {
  console.log(`🔍 パターン: "${pattern}"`);
  console.log(`📝 該当問題数: ${questions.length}問\n`);

  console.log("【該当問題の例】:");
  questions.slice(0, 5).forEach((q, index) => {
    console.log(`${index + 1}. ${q.id}: ${q.question_text}`);
  });

  if (questions.length > 5) {
    console.log(`   ... 他${questions.length - 5}問`);
  }
  console.log("\n" + "=".repeat(60) + "\n");
});

// 具体的にカスタマイズされている解説の分析
const customizedCount = questions.filter(
  (q) => !genericPatterns.some((pattern) => q.explanation.includes(pattern)),
).length;

console.log(`✅ カスタマイズされた解説: ${customizedCount}問`);
console.log(`❌ 汎用的な解説: ${questions.length - customizedCount}問`);
console.log(
  `📊 カスタマイズ率: ${((customizedCount / questions.length) * 100).toFixed(1)}%`,
);

// カスタマイズされた解説の例を表示
const customizedExamples = questions
  .filter(
    (q) => !genericPatterns.some((pattern) => q.explanation.includes(pattern)),
  )
  .slice(0, 5);

console.log("\n🎯 カスタマイズされた解説の例:");
customizedExamples.forEach((q, index) => {
  console.log(`\n${index + 1}. ${q.id}:`);
  console.log(q.explanation.substring(0, 200) + "...");
});
