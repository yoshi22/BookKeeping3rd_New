#!/usr/bin/env node

/**
 * 全302問の解説を分析し、カスタマイズ状況を詳細に確認
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

console.log("🔍 全302問の解説カスタマイズ状況を分析中...\n");

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

// 汎用的な解説パターンを定義
const genericPatterns = [
  "基本的な仕訳処理です。借方・貸方の金額を一致させて記入してください。",
  "基本的な仕訳処理。取引の内容を理解し、適切な勘定科目で借方・貸方の金額を一致させてください。",
  "帳簿記入の基本ルールに従い、正確に転記・記入してください。",
  "表作成の基本原則に従い、貸借の一致を確認しながら作成してください。",
  "試算表の作成。借方・貸方の合計が一致することで仕訳の正確性を検証。",
];

// 解説パターンの分析
let customizedCount = 0;
let genericCount = 0;
let uniqueExplanations = new Set();
let duplicateExplanations = new Map();

const analysisResults = {
  journal: { customized: 0, generic: 0, total: 0 },
  ledger: { customized: 0, generic: 0, total: 0 },
  statement: { customized: 0, generic: 0, total: 0 },
};

questions.forEach((question) => {
  const explanation = question.explanation.trim();
  const questionId = question.id;

  // 問題タイプを判定
  let type = "journal";
  if (questionId.startsWith("Q_L_")) type = "ledger";
  else if (questionId.startsWith("Q_T_")) type = "statement";

  analysisResults[type].total++;

  // 汎用的な解説かどうかを判定
  const isGeneric = genericPatterns.some((pattern) => explanation === pattern);

  if (isGeneric) {
    genericCount++;
    analysisResults[type].generic++;
  } else {
    customizedCount++;
    analysisResults[type].customized++;
  }

  // 重複解説の検出
  if (uniqueExplanations.has(explanation)) {
    if (!duplicateExplanations.has(explanation)) {
      duplicateExplanations.set(explanation, []);
    }
    duplicateExplanations.get(explanation).push(questionId);
  } else {
    uniqueExplanations.add(explanation);
    duplicateExplanations.set(explanation, [questionId]);
  }
});

console.log("📊 解説カスタマイズ状況の分析結果:\n");
console.log(
  `✅ カスタマイズ済み: ${customizedCount}問 (${((customizedCount / questions.length) * 100).toFixed(1)}%)`,
);
console.log(
  `❌ 汎用解説: ${genericCount}問 (${((genericCount / questions.length) * 100).toFixed(1)}%)`,
);
console.log(`📝 総問題数: ${questions.length}問\n`);

console.log("📋 問題タイプ別の詳細:");
Object.entries(analysisResults).forEach(([type, stats]) => {
  const typeName = {
    journal: "第1問（仕訳）",
    ledger: "第2問（帳簿）",
    statement: "第3問（表作成）",
  }[type];

  console.log(`${typeName}:`);
  console.log(
    `  カスタマイズ済み: ${stats.customized}/${stats.total} (${((stats.customized / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `  汎用解説: ${stats.generic}/${stats.total} (${((stats.generic / stats.total) * 100).toFixed(1)}%)`,
  );
});

console.log("\n🔍 重複している解説の検出:");
const duplicates = Array.from(duplicateExplanations.entries())
  .filter(([explanation, questionIds]) => questionIds.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

if (duplicates.length === 0) {
  console.log("✅ 重複する解説はありません！すべて固有の解説です。");
} else {
  console.log(`❌ ${duplicates.length}種類の解説で重複が発見されました:\n`);

  duplicates.slice(0, 10).forEach(([explanation, questionIds], index) => {
    console.log(`${index + 1}. 重複数: ${questionIds.length}問`);
    console.log(`   問題ID: ${questionIds.join(", ")}`);
    console.log(
      `   解説: ${explanation.substring(0, 80)}${explanation.length > 80 ? "..." : ""}`,
    );
    console.log("");
  });

  if (duplicates.length > 10) {
    console.log(`   ... 他 ${duplicates.length - 10}種類の重複解説\n`);
  }
}

// 汎用解説を使用している問題の詳細表示
if (genericCount > 0) {
  console.log("\n❌ 汎用解説を使用している問題:");
  const genericQuestions = questions.filter((q) =>
    genericPatterns.some((pattern) => q.explanation.trim() === pattern),
  );

  genericQuestions.slice(0, 15).forEach((q, index) => {
    console.log(
      `${index + 1}. ${q.id}: ${q.question_text.substring(0, 40)}...`,
    );
    console.log(`   解説: ${q.explanation}`);
    console.log("");
  });

  if (genericQuestions.length > 15) {
    console.log(
      `   ... 他 ${genericQuestions.length - 15}問も汎用解説を使用\n`,
    );
  }
}

console.log("\n📈 結論:");
if (customizedCount === questions.length) {
  console.log("🎉 すべての問題がカスタマイズ済みです！");
} else {
  console.log(`⚠️ ${genericCount}問がまだ汎用解説を使用しています。`);
  console.log("   これらの問題も個別カスタマイズが推奨されます。");
}
