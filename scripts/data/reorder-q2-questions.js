#!/usr/bin/env node

/**
 * Q2問題のquestion_order値を1-70連番に修正するスクリプト
 * Phase 3: 全Q2問題をID順にソートし、question_orderを1から70まで連番で割り当て
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("📝 master-questions.tsを読み込み中...");
const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");

// Q2問題を抽出（section_number: 2）
const q2QuestionPattern =
  /\{[^}]*id:\s*"(Q2_[^"]+)"[^}]*section_number:\s*2[^}]*\}/gs;

// すべてのQ2問題を抽出
const q2Questions = [];
let match;

// 各問題オブジェクトを抽出
const questionPattern = /(\{\s*id:\s*"Q2_[^"]+",[\s\S]*?\n  \},)/g;
const matches = content.match(questionPattern);

if (!matches) {
  console.error("❌ Q2問題が見つかりません");
  process.exit(1);
}

console.log(`✅ ${matches.length}個のQ2問題を発見`);

// 問題をパース
const parsedQuestions = matches
  .map((questionStr) => {
    const idMatch = questionStr.match(/id:\s*"(Q2_[^"]+)"/);
    const orderMatch = questionStr.match(/question_order:\s*(\d+)/);

    if (!idMatch || !orderMatch) {
      console.error("❌ パースエラー:", questionStr.substring(0, 100));
      return null;
    }

    return {
      id: idMatch[1],
      currentOrder: parseInt(orderMatch[1]),
      fullText: questionStr,
    };
  })
  .filter(Boolean);

console.log(`📊 パース完了: ${parsedQuestions.length}問`);

// IDでソート（Q2_V_001, Q2_V_002, ..., Q2_B_001, ...）
parsedQuestions.sort((a, b) => {
  // Q2_V と Q2_B を分離
  const aType = a.id.split("_")[1]; // "V" or "B"
  const bType = b.id.split("_")[1];

  if (aType !== bType) {
    return aType.localeCompare(bType); // V < B
  }

  // 同じタイプ内では番号でソート
  const aNum = parseInt(a.id.split("_")[2]);
  const bNum = parseInt(b.id.split("_")[2]);
  return aNum - bNum;
});

console.log("\n📋 ソート結果（最初の10問）:");
parsedQuestions.slice(0, 10).forEach((q, idx) => {
  console.log(
    `   ${idx + 1}. ${q.id} (現在のorder: ${q.currentOrder} → 新しいorder: ${idx + 1})`,
  );
});

console.log("\n📋 ソート結果（最後の10問）:");
parsedQuestions.slice(-10).forEach((q, idx) => {
  const newOrder = parsedQuestions.length - 10 + idx + 1;
  console.log(
    `   ${newOrder}. ${q.id} (現在のorder: ${q.currentOrder} → 新しいorder: ${newOrder})`,
  );
});

// 新しいquestion_order値を割り当て
const updatedQuestions = parsedQuestions.map((q, index) => {
  const newOrder = index + 1;
  const updatedText = q.fullText.replace(
    /question_order:\s*\d+/,
    `question_order: ${newOrder}`,
  );

  return {
    id: q.id,
    oldOrder: q.currentOrder,
    newOrder: newOrder,
    updatedText: updatedText,
  };
});

// バックアップを作成
const backupPath = MASTER_QUESTIONS_PATH + ".backup-" + Date.now();
fs.writeFileSync(backupPath, content, "utf-8");
console.log(`\n✅ バックアップ作成: ${path.basename(backupPath)}`);

// 元のファイルから非Q2問題を抽出
const beforeQ2 = content.substring(0, content.indexOf('id: "Q2_V_001"') - 4);
const afterQ2Index = content.lastIndexOf(
  updatedQuestions[updatedQuestions.length - 1].id,
);
const afterQ2Match = content.substring(afterQ2Index).match(/\},\n/);
const afterQ2 = afterQ2Match
  ? content.substring(
      afterQ2Index + afterQ2Match.index + afterQ2Match[0].length,
    )
  : "";

// 新しいコンテンツを構築
const newQ2Content = updatedQuestions.map((q) => q.updatedText).join("\n");

const newContent = beforeQ2 + newQ2Content + "\n" + afterQ2;

// ファイル書き込み
fs.writeFileSync(MASTER_QUESTIONS_PATH, newContent, "utf-8");

console.log("\n✅ question_order値を更新しました");
console.log(`   - 対象問題数: ${updatedQuestions.length}問`);
console.log(`   - 新しいorder範囲: 1 〜 ${updatedQuestions.length}`);

// 変更内容のサマリー
const changedCount = updatedQuestions.filter(
  (q) => q.oldOrder !== q.newOrder,
).length;
console.log(`   - 変更された問題数: ${changedCount}問`);

console.log("\n📊 変更詳細（order値が変わった問題）:");
updatedQuestions
  .filter((q) => q.oldOrder !== q.newOrder)
  .slice(0, 20) // 最初の20問のみ表示
  .forEach((q) => {
    console.log(`   ${q.id}: ${q.oldOrder} → ${q.newOrder}`);
  });

if (changedCount > 20) {
  console.log(`   ... 他 ${changedCount - 20}問`);
}

console.log("\n✅ Phase 3完了");
console.log(
  "次: Phase 1（キャッシュクリア）とPhase 4（検証）を実行してください",
);
