#!/usr/bin/env node

/**
 * 複合仕訳テンプレート一括修正スクリプト（改良版）
 *
 * 安全な行ベース置換を使用
 */

const fs = require("fs");
const path = require("path");

const TARGET_FILE = path.join(__dirname, "../../src/data/master-questions.ts");

// 複合仕訳の問題ID（Q_J_018は既に修正済みなのでスキップ）
const COMPOUND_ENTRY_IDS = [
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

// 修正が必要な勘定科目配列
const ACCOUNTS_FIXES = {
  Q_J_023: ["当座預金", "当座借越", "売掛金"],
  Q_J_027: ["買掛金", "当座預金", "受取手数料"],
  Q_J_032: ["普通預金", "租税公課", "受取利息"],
  Q_J_034: ["現金", "支払手数料", "普通預金"],
};

function createBackup() {
  const backupFile = TARGET_FILE + ".backup-bulk-" + Date.now();
  fs.copyFileSync(TARGET_FILE, backupFile);
  console.log(`✅ バックアップ作成: ${path.basename(backupFile)}\n`);
  return backupFile;
}

function fixTemplatesAndAccounts() {
  console.log("🚀 複合仕訳問題の一括修正を開始\n");

  const backupFile = createBackup();

  let content = fs.readFileSync(TARGET_FILE, "utf8");
  const lines = content.split("\n");

  let templateFixCount = 0;
  let accountsFixCount = 0;
  let currentQuestionId = null;
  let inQuestion = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 問題IDを検出
    const idMatch = line.match(/id: "(Q_J_\d+)"/);
    if (idMatch) {
      currentQuestionId = idMatch[1];
      inQuestion = COMPOUND_ENTRY_IDS.includes(currentQuestionId);
    }

    // answer_template_jsonの修正
    if (inQuestion && line.includes("answer_template_json:")) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.includes('"journalEntry":{"debit_account"')) {
        // 単純仕訳テンプレートを複合仕訳テンプレートに変更
        lines[i + 1] = nextLine.replace(
          '"journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}',
          '"journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]',
        );
        if (lines[i + 1] !== nextLine) {
          templateFixCount++;
          console.log(
            `✅ ${currentQuestionId}: answer_template_jsonを複合仕訳形式に修正`,
          );
        }
      }
    }

    // tags_jsonのaccounts配列修正
    if (
      currentQuestionId &&
      ACCOUNTS_FIXES[currentQuestionId] &&
      line.includes("tags_json:")
    ) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        try {
          // エスケープされたJSONを抽出
          const jsonMatch = nextLine.match(/['"](.+)['"]/);
          if (jsonMatch) {
            // Double-escaped (\\") と single-escaped (\") の両方に対応
            let jsonStr = jsonMatch[1];
            // まず \\\" を \" に変換（over-escaped対応）
            jsonStr = jsonStr.replace(/\\\\/g, "\\");
            // 次に \" を " に変換（通常のescape）
            jsonStr = jsonStr.replace(/\\"/g, '"');
            const tagsObj = JSON.parse(jsonStr);

            // accounts配列を更新
            const oldAccounts = tagsObj.accounts || [];
            tagsObj.accounts = ACCOUNTS_FIXES[currentQuestionId];

            // 新しいJSONを生成
            // Single-quoted stringでは"のみエスケープが必要（\\"ではなく\"）
            const newJsonStr = JSON.stringify(tagsObj).replace(/"/g, '\\"');
            const quote = nextLine.match(/^(\s*)(['"])/)[2];
            lines[i + 1] = nextLine.replace(
              /['"](.+)['"]/,
              `${quote}${newJsonStr}${quote}`,
            );

            if (lines[i + 1] !== nextLine) {
              accountsFixCount++;
              console.log(`✅ ${currentQuestionId}: accounts配列を更新`);
              console.log(`   旧: [${oldAccounts.join(", ")}]`);
              console.log(
                `   新: [${ACCOUNTS_FIXES[currentQuestionId].join(", ")}]`,
              );
            }
          }
        } catch (error) {
          console.log(
            `⚠️  ${currentQuestionId}: accounts配列の更新をスキップ (${error.message})`,
          );
        }
      }
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(TARGET_FILE, lines.join("\n"), "utf8");

  console.log("\n" + "=".repeat(60));
  console.log("\n✨ 修正完了\n");
  console.log(`📊 修正サマリー:`);
  console.log(`  - 複合仕訳テンプレート: ${templateFixCount}問`);
  console.log(`  - 勘定科目配列: ${accountsFixCount}問`);
  console.log(`\n📌 バックアップ: ${path.basename(backupFile)}`);

  return { templateFixCount, accountsFixCount };
}

if (require.main === module) {
  try {
    fixTemplatesAndAccounts();
    process.exit(0);
  } catch (error) {
    console.error(`❌ エラー: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { fixTemplatesAndAccounts };
