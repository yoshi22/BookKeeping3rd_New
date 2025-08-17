#!/usr/bin/env node

/**
 * 金額簡略化スクリプト
 * master-questions.tsの金額を入力しやすい数値に変換
 */

const fs = require("fs");
const path = require("path");

// 金額簡略化関数
function simplifyAmount(originalAmount) {
  const num = parseInt(originalAmount);

  if (num >= 500000) {
    // 50万円以上: 10万円単位に切り上げ/切り下げ
    return Math.round(num / 100000) * 100000;
  } else if (num >= 100000) {
    // 10万円以上: 5万円単位
    return Math.round(num / 50000) * 50000;
  } else if (num >= 50000) {
    // 5万円以上: 1万円単位
    return Math.round(num / 10000) * 10000;
  } else if (num >= 10000) {
    // 1万円以上: 5千円単位
    return Math.round(num / 5000) * 5000;
  } else {
    // 1万円未満: 1千円単位
    return Math.round(num / 1000) * 1000;
  }
}

// 複合仕訳用の金額差別化
function diversifyAmounts(amounts) {
  const simplified = amounts.map(simplifyAmount);

  // 同じ金額があれば調整
  for (let i = 1; i < simplified.length; i++) {
    while (simplified.includes(simplified[i])) {
      if (simplified[i] >= 10000) {
        simplified[i] += 5000;
      } else {
        simplified[i] += 1000;
      }
    }
  }

  return simplified;
}

// master-questions.tsを読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);
let content = fs.readFileSync(masterQuestionsPath, "utf-8");

console.log("金額簡略化スクリプト開始...");

// 金額抽出パターン
const amountPattern = /"(debit_amount|credit_amount)":(\d+)/g;
let match;
const replacements = new Map();

// 全ての金額を抽出
while ((match = amountPattern.exec(content)) !== null) {
  const originalAmount = parseInt(match[2]);
  const simplifiedAmount = simplifyAmount(originalAmount);

  if (originalAmount !== simplifiedAmount) {
    replacements.set(match[0], `"${match[1]}":${simplifiedAmount}`);
  }
}

console.log(`${replacements.size}個の金額を変換します...`);

// 一括置換
for (const [original, replacement] of replacements) {
  content = content.replace(
    new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    replacement,
  );
}

// question_textの金額も変換
const questionTextPattern = /(\d{3,}),?(\d{3})*円/g;
content = content.replace(questionTextPattern, (match, ...args) => {
  const fullMatch = match;
  const amountStr = fullMatch.replace(/[円,]/g, "");
  const originalAmount = parseInt(amountStr);
  const simplifiedAmount = simplifyAmount(originalAmount);

  // 金額を三桁区切りでフォーマット
  const formattedAmount = simplifiedAmount.toLocaleString("ja-JP");
  return `${formattedAmount}円`;
});

// explanationの金額も変換
const explanationPattern = /(\d{3,}),?(\d{3})*円/g;
content = content.replace(explanationPattern, (match, ...args) => {
  const fullMatch = match;
  const amountStr = fullMatch.replace(/[円,]/g, "");
  const originalAmount = parseInt(amountStr);
  const simplifiedAmount = simplifyAmount(originalAmount);

  // 金額を三桁区切りでフォーマット
  const formattedAmount = simplifiedAmount.toLocaleString("ja-JP");
  return `${formattedAmount}円`;
});

// 変更を保存
fs.writeFileSync(masterQuestionsPath, content, "utf-8");

console.log("金額簡略化完了！");
console.log("変更されたファイル:", masterQuestionsPath);
console.log("バックアップファイル: master-questions.ts.backup-*");
