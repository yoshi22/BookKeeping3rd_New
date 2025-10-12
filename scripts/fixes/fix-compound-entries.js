#!/usr/bin/env node

/**
 * 複合仕訳問題の包括的修正スクリプト
 *
 * 修正内容:
 * 1. 複合仕訳テンプレート修正（20問）
 * 2. 勘定科目配列修正（5問）
 *
 * 実行方法:
 * node scripts/fixes/fix-compound-entries.js
 */

const fs = require("fs");
const path = require("path");

const TARGET_FILE = path.join(__dirname, "../../src/data/master-questions.ts");

// 複合仕訳の問題ID一覧
const COMPOUND_ENTRY_IDS = [
  "Q_J_018",
  "Q_J_023",
  "Q_J_027",
  "Q_J_032",
  "Q_J_034",
  "Q_J_037",
  "Q_J_038",
  "Q_J_039",
  "Q_J_120",
  "Q_J_125",
  "Q_J_128",
  "Q_J_131",
  "Q_J_132",
  "Q_J_133",
  "Q_J_134",
  "Q_J_135",
  "Q_J_136",
  "Q_J_137",
  "Q_J_144",
  "Q_J_244",
];

// 勘定科目配列の修正データ（Phase 2の分析結果）
const ACCOUNTS_FIXES = {
  Q_J_018: ["当座預金", "支払手数料", "売掛金"],
  Q_J_023: ["当座預金", "当座借越", "売掛金"],
  Q_J_027: ["買掛金", "当座預金", "受取手数料"],
  Q_J_032: ["普通預金", "租税公課", "受取利息"],
  Q_J_034: ["現金", "支払手数料", "普通預金"],
};

// バックアップを作成
function createBackup() {
  const backupFile = TARGET_FILE + ".backup-compound-" + Date.now();
  fs.copyFileSync(TARGET_FILE, backupFile);
  console.log(`✅ バックアップ作成: ${path.basename(backupFile)}`);
  return backupFile;
}

// 複合仕訳テンプレートを修正
function fixCompoundTemplates() {
  console.log("📝 複合仕訳テンプレート修正を開始...\n");

  // バックアップ作成
  const backupFile = createBackup();

  // ファイル読み込み
  let content = fs.readFileSync(TARGET_FILE, "utf8");
  let modifiedCount = 0;

  // 単純仕訳テンプレートのパターン
  const simpleTemplatePattern =
    /"type":"journal_entry","journalEntry":\{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0\}"/g;

  // 複合仕訳テンプレート（配列形式）
  const compoundTemplate =
    '"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]"';

  // 各複合仕訳問題について処理
  COMPOUND_ENTRY_IDS.forEach((questionId) => {
    // 問題IDの位置を探す
    const idPattern = new RegExp(`id: "${questionId}"`, "g");
    const idMatch = idPattern.exec(content);

    if (!idMatch) {
      console.log(`⚠️  ${questionId}: 見つかりませんでした`);
      return;
    }

    // その問題のanswer_template_jsonを探す
    const startPos = idMatch.index;
    const endPos = content.indexOf("created_at:", startPos);
    const questionSection = content.substring(startPos, endPos);

    // answer_template_jsonが単純仕訳テンプレートかチェック
    if (
      questionSection.includes(
        '"type":"journal_entry","journalEntry":{"debit_account":""',
      )
    ) {
      // 修正を適用
      const beforeMod = content;
      content = content.replace(
        new RegExp(
          `(id: "${questionId}"[\\s\\S]*?answer_template_json:\\s*['"])` +
            `(\\{"type":"journal_entry","journalEntry":\\{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0\\}\\})` +
            `(['"])`,
        ),
        `$1${JSON.parse('"' + compoundTemplate + '"')}$3`,
      );

      if (content !== beforeMod) {
        modifiedCount++;
        console.log(`✅ ${questionId}: テンプレートを複合仕訳形式に修正`);
      }
    }
  });

  // ファイルに書き込み
  fs.writeFileSync(TARGET_FILE, content, "utf8");

  console.log(`\n✅ 複合仕訳テンプレート修正完了: ${modifiedCount}問\n`);
  return modifiedCount;
}

// 勘定科目配列を修正
function fixAccountsArrays() {
  console.log("📝 勘定科目配列修正を開始...\n");

  // ファイル読み込み
  let content = fs.readFileSync(TARGET_FILE, "utf8");
  let modifiedCount = 0;

  // 各問題について処理
  Object.entries(ACCOUNTS_FIXES).forEach(([questionId, accounts]) => {
    // 問題IDの位置を探す
    const idPattern = new RegExp(`id: "${questionId}"`, "g");
    const idMatch = idPattern.exec(content);

    if (!idMatch) {
      console.log(`⚠️  ${questionId}: 見つかりませんでした`);
      return;
    }

    // その問題のtags_jsonを探す
    const startPos = idMatch.index;
    const endPos = content.indexOf("created_at:", startPos);
    const questionSection = content.substring(startPos, endPos);

    // tags_jsonの"accounts"配列を探す
    const tagsMatch = questionSection.match(/tags_json:\s*\n\s*['"](.+?)['"]/);
    if (!tagsMatch) {
      console.log(`⚠️  ${questionId}: tags_jsonが見つかりませんでした`);
      return;
    }

    let tagsJson = tagsMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    let tagsObj;

    try {
      tagsObj = JSON.parse(tagsJson);
    } catch (error) {
      console.log(
        `⚠️  ${questionId}: tags_jsonのパースに失敗: ${error.message}`,
      );
      return;
    }

    // accounts配列を更新
    const oldAccounts = tagsObj.accounts || [];
    tagsObj.accounts = accounts;

    // 新しいtags_jsonを生成
    const newTagsJson = JSON.stringify(tagsObj);
    const escapedNewTagsJson = newTagsJson
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    // 置換
    const oldTagsJsonEscaped = tagsMatch[1].replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    content = content.replace(
      new RegExp(
        `(id: "${questionId}"[\\s\\S]*?tags_json:\\s*\\n\\s*['"])${oldTagsJsonEscaped}(['"])`,
      ),
      `$1${escapedNewTagsJson}$2`,
    );

    modifiedCount++;
    console.log(`✅ ${questionId}: accounts配列を更新`);
    console.log(`   旧: [${oldAccounts.join(", ")}]`);
    console.log(`   新: [${accounts.join(", ")}]`);
  });

  // ファイルに書き込み
  fs.writeFileSync(TARGET_FILE, content, "utf8");

  console.log(`\n✅ 勘定科目配列修正完了: ${modifiedCount}問\n`);
  return modifiedCount;
}

// 実行
if (require.main === module) {
  try {
    console.log("🚀 複合仕訳問題の包括的修正を開始\n");
    console.log("=".repeat(60) + "\n");

    const templateCount = fixCompoundTemplates();
    const accountsCount = fixAccountsArrays();

    console.log("=".repeat(60));
    console.log("\n✨ すべての修正が完了しました\n");
    console.log(`📊 修正サマリー:`);
    console.log(`  - 複合仕訳テンプレート: ${templateCount}問`);
    console.log(`  - 勘定科目配列: ${accountsCount}問`);
    console.log(`\n📌 バックアップファイルから復元可能です`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ エラーが発生しました: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { fixCompoundTemplates, fixAccountsArrays };
