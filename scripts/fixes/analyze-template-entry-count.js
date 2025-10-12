#!/usr/bin/env node

/**
 * 複合仕訳問題のテンプレートエントリ数調査スクリプト
 *
 * 目的: テンプレートと正答のエントリ数差分を確認
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

function analyzeEntryCount() {
  console.log("🔍 複合仕訳問題のエントリ数調査開始\n");

  const content = fs.readFileSync(TARGET_FILE, "utf8");
  const results = [];
  const mismatches = [];

  COMPOUND_ENTRY_IDS.forEach((questionId) => {
    // 問題ブロックを抽出
    const regex = new RegExp(
      `id: "${questionId}"[\\s\\S]*?answer_template_json:[\\s\\S]*?'([^']+)'[\\s\\S]*?correct_answer_json:[\\s\\S]*?'([^']+)'`,
      "m",
    );

    const match = content.match(regex);

    if (!match) {
      console.log(`⚠️  ${questionId}: 見つかりませんでした`);
      return;
    }

    try {
      // エスケープされたJSONをパース
      const templateJsonStr = match[1].replace(/\\"/g, '"');
      const answerJsonStr = match[2].replace(/\\"/g, '"');

      const templateData = JSON.parse(templateJsonStr);
      const answerData = JSON.parse(answerJsonStr);

      const templateCount = templateData.journalEntry.length;
      const answerCount = answerData.journalEntry.length;

      const result = {
        id: questionId,
        templateCount,
        answerCount,
        mismatch: templateCount !== answerCount,
      };

      results.push(result);

      if (result.mismatch) {
        mismatches.push(result);
      }
    } catch (error) {
      console.log(`❌ ${questionId}: パースエラー - ${error.message}`);
    }
  });

  // 結果出力
  console.log("=".repeat(70));
  console.log("📊 調査結果サマリー");
  console.log("=".repeat(70));
  console.log(`\n総対象問題数: ${COMPOUND_ENTRY_IDS.length}問`);
  console.log(
    `正常（エントリ数一致）: ${results.length - mismatches.length}問`,
  );
  console.log(`不一致: ${mismatches.length}問\n`);

  if (mismatches.length > 0) {
    console.log("❌ エントリ数不一致の問題:\n");
    mismatches.forEach((m) => {
      console.log(
        `  ${m.id}: テンプレート=${m.templateCount}エントリ, 正答=${m.answerCount}エントリ`,
      );
    });
    console.log("");
  } else {
    console.log("✅ 全ての複合仕訳問題でエントリ数が一致しています\n");
  }

  // 詳細リスト
  console.log("=".repeat(70));
  console.log("📋 全問題の詳細");
  console.log("=".repeat(70));
  console.log("");

  results.forEach((r) => {
    const status = r.mismatch ? "❌" : "✅";
    console.log(
      `${status} ${r.id}: テンプレート=${r.templateCount}, 正答=${r.answerCount}`,
    );
  });

  return { results, mismatches };
}

if (require.main === module) {
  try {
    const { mismatches } = analyzeEntryCount();
    process.exit(mismatches.length > 0 ? 1 : 0);
  } catch (error) {
    console.error(`❌ エラー: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { analyzeEntryCount };
