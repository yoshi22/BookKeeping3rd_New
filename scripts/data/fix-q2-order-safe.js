#!/usr/bin/env node

/**
 * Q2問題のquestion_order値を安全に修正するスクリプト（改良版）
 * sedを使った個別置換で構文エラーを回避
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("📝 Q2問題のquestion_order値を修正中...\n");

// Step 1: すべてのQ2問題のIDとcurrent question_orderを抽出
const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");
const lines = content.split("\n");

const q2Questions = [];
let currentId = null;
let currentOrder = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // IDを検出
  const idMatch = line.match(/id:\s*"(Q2_[VB]_\d+)"/);
  if (idMatch) {
    currentId = idMatch[1];
  }

  // question_orderを検出
  const orderMatch = line.match(/question_order:\s*(\d+)/);
  if (orderMatch && currentId) {
    currentOrder = parseInt(orderMatch[1]);
    q2Questions.push({
      id: currentId,
      currentOrder: currentOrder,
      lineNumber: i + 1,
    });
    currentId = null; // リセット
    currentOrder = null;
  }
}

console.log(`✅ ${q2Questions.length}個のQ2問題を検出\n`);

// Step 2: ID順にソート
q2Questions.sort((a, b) => {
  const aType = a.id.split("_")[1]; // "V" or "B"
  const bType = b.id.split("_")[1];

  if (aType !== bType) {
    return aType === "B" ? -1 : 1; // B < V (補助簿を先に)
  }

  const aNum = parseInt(a.id.split("_")[2]);
  const bNum = parseInt(b.id.split("_")[2]);
  return aNum - bNum;
});

// Step 3: 新しいorder値を計算
const orderMapping = {};
q2Questions.forEach((q, index) => {
  const newOrder = index + 1;
  orderMapping[q.id] = {
    oldOrder: q.currentOrder,
    newOrder: newOrder,
  };
});

console.log("📊 順序調整マッピング（最初の10問）:");
q2Questions.slice(0, 10).forEach((q, idx) => {
  const mapping = orderMapping[q.id];
  console.log(
    `   ${idx + 1}. ${q.id}: order ${mapping.oldOrder} → ${mapping.newOrder}`,
  );
});

console.log("\n📊 順序調整マッピング（最後の10問）:");
q2Questions.slice(-10).forEach((q, idx) => {
  const mapping = orderMapping[q.id];
  const newOrder = mapping.newOrder;
  console.log(
    `   ${newOrder}. ${q.id}: order ${mapping.oldOrder} → ${newOrder}`,
  );
});

// バックアップ作成
const backupPath = MASTER_QUESTIONS_PATH + ".backup-" + Date.now();
fs.copyFileSync(MASTER_QUESTIONS_PATH, backupPath);
console.log(`\n✅ バックアップ作成: ${path.basename(backupPath)}\n`);

// Step 4: 各問題のquestion_orderを個別にsedで置換
let changedCount = 0;

for (const [questionId, mapping] of Object.entries(orderMapping)) {
  if (mapping.oldOrder !== mapping.newOrder) {
    // sedで該当問題のquestion_order値のみを置換
    // パターン: 問題IDの直後（数行以内）にあるquestion_order行を探して置換
    const sedCommand = `sed -i.bak '/id: "${questionId}"/,/question_order:/ s/question_order: ${mapping.oldOrder},/question_order: ${mapping.newOrder},/' "${MASTER_QUESTIONS_PATH}"`;

    try {
      execSync(sedCommand, { stdio: "pipe" });
      changedCount++;
    } catch (error) {
      console.error(`❌ ${questionId}の置換エラー:`, error.message);
    }
  }
}

// 一時的なバックアップファイル（.bakファイル）を削除
try {
  fs.unlinkSync(MASTER_QUESTIONS_PATH + ".bak");
} catch (e) {
  // 無視
}

console.log(`✅ question_order値の更新完了`);
console.log(`   - 変更された問題数: ${changedCount}/${q2Questions.length}問`);
console.log(`   - 新しいorder範囲: 1 〜 ${q2Questions.length}\n`);

// 検証: 更新後のファイルを読み込んで確認
const updatedContent = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");
let verificationErrors = 0;

for (const [questionId, mapping] of Object.entries(orderMapping)) {
  const regex = new RegExp(
    `id:\\s*"${questionId}"[\\s\\S]{0,200}question_order:\\s*(\\d+)`,
  );
  const match = updatedContent.match(regex);

  if (match) {
    const actualOrder = parseInt(match[1]);
    if (actualOrder !== mapping.newOrder) {
      console.error(
        `⚠️  ${questionId}: 期待値 ${mapping.newOrder}, 実際 ${actualOrder}`,
      );
      verificationErrors++;
    }
  } else {
    console.error(`⚠️  ${questionId}: question_order値が見つかりません`);
    verificationErrors++;
  }
}

if (verificationErrors === 0) {
  console.log("✅ 検証完了: すべての問題のorder値が正しく更新されました\n");
} else {
  console.error(
    `❌ 検証エラー: ${verificationErrors}個の問題に不整合があります\n`,
  );
  process.exit(1);
}

console.log("📊 Phase 3完了: question_order値の1-70連番調整が完了しました");
console.log("次: Expoサーバーを再起動してアプリで動作確認してください");
