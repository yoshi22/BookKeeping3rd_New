#!/usr/bin/env node

/**
 * Phase D1: category_id一括修正スクリプト
 * - category_id: "journal" → "journal_entry" 一括修正
 * - updated_at: 2025-08-19T16:00:00Z 統一
 * - 対象: Q_J_001-Q_J_250のうち118問
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

console.log("🔧 Phase D1: category_id一括修正スクリプト開始...");

try {
  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  let modifiedCount = 0;

  // category_id: "journal" を "journal_entry" に一括修正
  const originalContent = content;

  // 正規表現で category_id: "journal" を category_id: "journal_entry" に置換
  content = content.replace(
    /category_id: "journal",/g,
    'category_id: "journal_entry",',
  );

  // 同時に updated_at も統一
  content = content.replace(
    /(category_id: "journal_entry",[\s\S]*?)updated_at: "[^"]*"/g,
    '$1updated_at: "2025-08-19T16:00:00Z"',
  );

  // 変更数をカウント
  const matches = originalContent.match(/category_id: "journal",/g);
  modifiedCount = matches ? matches.length : 0;

  // ファイル書き込み
  if (modifiedCount > 0) {
    fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
    console.log(
      `\n🎉 Phase D1 category_id一括修正完了！修正問題数: ${modifiedCount}問`,
    );
    console.log("📝 以下の修正を実施しました:");
    console.log('   - category_id: "journal" → "journal_entry" 一括修正');
    console.log('   - updated_at: "2025-08-19T16:00:00Z" 統一');
  } else {
    console.log("\nℹ️  修正対象の問題がありませんでした（既に修正済み）");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
