#!/usr/bin/env node

/**
 * 複合仕訳テンプレートエントリ数修正スクリプト（Phase 6）
 *
 * 目的: テンプレートのエントリ数を正答と同じ数に修正
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

function createBackup() {
  const backupFile = TARGET_FILE + ".backup-phase6-" + Date.now();
  fs.copyFileSync(TARGET_FILE, backupFile);
  console.log(`✅ バックアップ作成: ${path.basename(backupFile)}\n`);
  return backupFile;
}

function generateEmptyEntries(count) {
  // 指定された数の空エントリを生成
  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push({
      debit_account: "",
      debit_amount: 0,
      credit_account: "",
      credit_amount: 0,
    });
  }
  return entries;
}

function fixTemplateEntryCounts() {
  console.log("🚀 テンプレートエントリ数修正開始（Phase 6）\n");

  const backupFile = createBackup();

  let content = fs.readFileSync(TARGET_FILE, "utf8");
  const lines = content.split("\n");

  let fixCount = 0;
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
    if (
      inQuestion &&
      currentQuestionId &&
      line.includes("answer_template_json:")
    ) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.includes('"journalEntry":[')) {
        try {
          // 問題ブロック全体を取得して正答エントリ数を確認
          let blockEnd = i;
          for (let j = i; j < i + 20 && j < lines.length; j++) {
            if (lines[j].includes("correct_answer_json:")) {
              const answerLine = lines[j + 1];
              if (answerLine) {
                const answerMatch = answerLine.match(/'([^']+)'/);
                if (answerMatch) {
                  const answerJsonStr = answerMatch[1].replace(/\\"/g, '"');
                  const answerData = JSON.parse(answerJsonStr);
                  const requiredEntryCount = answerData.journalEntry.length;

                  // 現在のテンプレートエントリ数を確認
                  const templateMatch = nextLine.match(/'([^']+)'/);
                  if (templateMatch) {
                    const templateJsonStr = templateMatch[1].replace(
                      /\\"/g,
                      '"',
                    );
                    const templateData = JSON.parse(templateJsonStr);
                    const currentEntryCount = templateData.journalEntry.length;

                    if (currentEntryCount !== requiredEntryCount) {
                      // 新しいテンプレートを生成
                      const emptyEntries =
                        generateEmptyEntries(requiredEntryCount);
                      const newTemplate = {
                        type: "journal_entry",
                        journalEntry: emptyEntries,
                      };
                      const newTemplateStr = JSON.stringify(
                        newTemplate,
                      ).replace(/"/g, '\\"');

                      // 行を置き換え
                      const quote = nextLine.match(/^(\s*)(['"])/)[2];
                      lines[i + 1] = nextLine.replace(
                        /'([^']+)'/,
                        `${quote}${newTemplateStr}${quote}`,
                      );

                      fixCount++;
                      console.log(
                        `✅ ${currentQuestionId}: ${currentEntryCount}エントリ → ${requiredEntryCount}エントリに修正`,
                      );
                    }
                  }
                }
              }
              break;
            }
          }
        } catch (error) {
          console.log(`⚠️  ${currentQuestionId}: ${error.message}`);
        }
      }
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(TARGET_FILE, lines.join("\n"), "utf8");

  console.log("\n" + "=".repeat(60));
  console.log("\n✨ 修正完了\n");
  console.log(`📊 修正サマリー:`);
  console.log(`  - 修正問題数: ${fixCount}問`);
  console.log(`\n📌 バックアップ: ${path.basename(backupFile)}`);

  return fixCount;
}

if (require.main === module) {
  try {
    fixTemplateEntryCounts();
    process.exit(0);
  } catch (error) {
    console.error(`❌ エラー: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { fixTemplateEntryCounts };
