#!/usr/bin/env node

/**
 * Q2問題のquestion_order修正スクリプト
 *
 * 目的: Q2問題を希望する順序で表示するためにquestion_orderを更新
 *
 * 現在の並び順:
 * - Q2_B (補助簿記入): question_order 1-20
 * - Q2_L (勘定記入): question_order 21-40
 * - Q2_V (用語): question_order 41-70
 *
 * 修正後の並び順:
 * - Q2_V (用語): question_order 1-30
 * - Q2_L (勘定記入): question_order 31-50
 * - Q2_B (補助簿記入): question_order 51-70
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("Q2問題のquestion_order修正スクリプト開始...");
console.log(`対象ファイル: ${MASTER_QUESTIONS_PATH}`);

// バックアップファイル作成
const backupPath = `${MASTER_QUESTIONS_PATH}.backup-${Date.now()}`;
fs.copyFileSync(MASTER_QUESTIONS_PATH, backupPath);
console.log(`バックアップ作成: ${backupPath}`);

// ファイル読み込み
let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
console.log("ファイル読み込み完了");

// 修正対象のパターンと変換ルール
const patterns = [
  // Q2_V_001 から Q2_V_030: question_order 41-70 → 1-30
  {
    prefix: "Q2_V_",
    count: 30,
    getCurrentOrder: (num) => 40 + num, // Q2_V_001 = 41, Q2_V_002 = 42, ...
    getNewOrder: (num) => num, // Q2_V_001 = 1, Q2_V_002 = 2, ...
  },
  // Q2_L_001 から Q2_L_020: question_order 21-40 → 31-50
  {
    prefix: "Q2_L_",
    count: 20,
    getCurrentOrder: (num) => 20 + num, // Q2_L_001 = 21, Q2_L_002 = 22, ...
    getNewOrder: (num) => 30 + num, // Q2_L_001 = 31, Q2_L_002 = 32, ...
  },
  // Q2_B_001 から Q2_B_020: question_order 1-20 → 51-70
  {
    prefix: "Q2_B_",
    count: 20,
    getCurrentOrder: (num) => num, // Q2_B_001 = 1, Q2_B_002 = 2, ...
    getNewOrder: (num) => 50 + num, // Q2_B_001 = 51, Q2_B_002 = 52, ...
  },
];

let totalUpdates = 0;

patterns.forEach(({ prefix, count, getCurrentOrder, getNewOrder }) => {
  console.log(`\n${prefix}xxx の question_order を更新中...`);

  for (let i = 1; i <= count; i++) {
    const questionNum = String(i).padStart(3, "0");
    const questionId = `${prefix}${questionNum}`;
    const currentOrder = getCurrentOrder(i);
    const newOrder = getNewOrder(i);

    // 問題IDを探して、その後のquestion_orderを更新
    const idPattern = new RegExp(
      `(id:\\s*"${questionId}",[\\s\\S]*?question_order:\\s*)${currentOrder}(,)`,
      "g",
    );

    const beforeUpdate = content;
    content = content.replace(idPattern, `$1${newOrder}$2`);

    if (content !== beforeUpdate) {
      console.log(`  ✓ ${questionId}: ${currentOrder} → ${newOrder}`);
      totalUpdates++;
    } else {
      console.log(
        `  ⚠ ${questionId}: 更新対象が見つかりませんでした（既に修正済みの可能性）`,
      );
    }
  }
});

// ファイル書き込み
fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
console.log(`\n✅ 修正完了: ${totalUpdates}問のquestion_orderを更新しました`);
console.log(`修正ファイル: ${MASTER_QUESTIONS_PATH}`);
console.log(`バックアップ: ${backupPath}`);

// 検証: 更新後のquestion_order値を確認
console.log("\n更新後のquestion_order値を検証中...");
const verifyPatterns = [
  { prefix: "Q2_V_", expectedRange: "1-30" },
  { prefix: "Q2_L_", expectedRange: "31-50" },
  { prefix: "Q2_B_", expectedRange: "51-70" },
];

verifyPatterns.forEach(({ prefix, expectedRange }) => {
  const sampleId = `${prefix}001`;
  const match = content.match(
    new RegExp(`id:\\s*"${sampleId}",[\\s\\S]*?question_order:\\s*(\\d+)`, "m"),
  );
  if (match) {
    console.log(
      `  ${prefix}xxx: question_order = ${match[1]} (期待値範囲: ${expectedRange})`,
    );
  }
});

console.log("\n次のステップ:");
console.log("1. src/data/migrations/index.ts の SAMPLE_DATA_VERSION を更新");
console.log("2. forceUpdate = true に一時設定");
console.log("3. アプリで動作確認");
console.log("4. forceUpdate = false に復元");
