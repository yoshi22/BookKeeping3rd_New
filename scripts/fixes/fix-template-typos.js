#!/usr/bin/env node

/**
 * answer_template_jsonのtypo修正スクリプト
 *
 * 対象: Q_J_018, Q_J_073, Q_J_108
 * 修正内容: "credit_account":0 → "credit_amount":0
 *
 * 実行方法:
 * node scripts/fixes/fix-template-typos.js
 */

const fs = require("fs");
const path = require("path");

const TARGET_FILE = path.join(__dirname, "../../src/data/master-questions.ts");

// バックアップを作成
function createBackup() {
  const backupFile = TARGET_FILE + ".backup-" + Date.now();
  fs.copyFileSync(TARGET_FILE, backupFile);
  console.log(`✅ バックアップ作成: ${path.basename(backupFile)}`);
  return backupFile;
}

// 修正を実行
function fixTypos() {
  console.log("📝 テンプレート誤記修正を開始...\n");

  // バックアップ作成
  const backupFile = createBackup();

  // ファイル読み込み
  let content = fs.readFileSync(TARGET_FILE, "utf8");
  const originalContent = content;

  // 誤記を修正
  const typoPattern = /"credit_account":\s*0/g;
  const correctedPattern = '"credit_amount": 0';

  const matches = content.match(typoPattern);
  if (!matches) {
    console.log("⚠️  修正対象のtypoが見つかりませんでした");
    return;
  }

  console.log(`🔍 ${matches.length}箇所のtypoを発見\n`);

  content = content.replace(typoPattern, correctedPattern);

  // 変更がない場合
  if (content === originalContent) {
    console.log("⚠️  変更がありませんでした");
    return;
  }

  // ファイルに書き込み
  fs.writeFileSync(TARGET_FILE, content, "utf8");

  console.log("✅ 修正完了\n");
  console.log(`修正内容:`);
  console.log(`  - "credit_account": 0 → "credit_amount": 0`);
  console.log(`  - 修正箇所数: ${matches.length}箇所`);
  console.log(`\n📌 バックアップファイル: ${path.basename(backupFile)}`);
  console.log(`📌 問題があれば、バックアップから復元できます`);
}

// 実行
if (require.main === module) {
  try {
    fixTypos();
    process.exit(0);
  } catch (error) {
    console.error(`❌ エラーが発生しました: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { fixTypos };
