#!/usr/bin/env node

/**
 * Step 6 (Q_J_211-Q_J_250) 一括修正スクリプト
 * - category_id: "journal" → "journal_entry"
 * - JSON形式統一: 文字列リテラル → JSON.stringify()
 * - updated_at: 2025-08-19T00:00:00Z
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

console.log("🔧 Step 6 一括修正スクリプト開始...");

try {
  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  let modifiedCount = 0;

  // Q_J_211からQ_J_250の範囲で処理
  for (let i = 211; i <= 250; i++) {
    const questionId = `Q_J_${i}`;

    // 問題ブロックを特定する正規表現
    const questionBlockRegex = new RegExp(
      `(\\s+{\\s*id: "${questionId}",\\s*category_id: "journal",[\\s\\S]*?tags_json:[\\s\\S]*?},)`,
      "g",
    );

    const match = content.match(questionBlockRegex);
    if (match) {
      console.log(`🔍 ${questionId}を処理中...`);

      let questionBlock = match[0];
      let originalBlock = questionBlock;

      // 1. category_id修正
      questionBlock = questionBlock.replace(
        /category_id: "journal",/g,
        'category_id: "journal_entry",',
      );

      // 2. answer_template_json修正（文字列リテラル → JSON.stringify）
      questionBlock = questionBlock.replace(
        /answer_template_json:\s*'({[^']+})'/g,
        "answer_template_json: JSON.stringify($1)",
      );

      // 3. correct_answer_json修正（文字列リテラル → JSON.stringify）
      questionBlock = questionBlock.replace(
        /correct_answer_json:\s*'({[^']+})'/g,
        "correct_answer_json: JSON.stringify($1)",
      );

      // 4. updated_at修正
      questionBlock = questionBlock.replace(
        /updated_at: "[^"]*"/g,
        'updated_at: "2025-08-19T00:00:00Z"',
      );

      // 変更があった場合のみ置換
      if (questionBlock !== originalBlock) {
        content = content.replace(originalBlock, questionBlock);
        modifiedCount++;
        console.log(`✅ ${questionId}修正完了`);
      } else {
        console.log(`⏭️  ${questionId}は既に修正済み`);
      }
    } else {
      console.log(`⚠️  ${questionId}が見つかりません`);
    }
  }

  // ファイル書き込み
  if (modifiedCount > 0) {
    fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
    console.log(`\n🎉 Step 6一括修正完了！修正問題数: ${modifiedCount}問`);
    console.log("📝 以下の修正を実施しました:");
    console.log('   - category_id: "journal" → "journal_entry"');
    console.log("   - JSON形式統一: 文字列リテラル → JSON.stringify()");
    console.log("   - updated_at: 2025-08-19T00:00:00Z");
  } else {
    console.log("\nℹ️  修正対象の問題がありませんでした（既に修正済み）");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
