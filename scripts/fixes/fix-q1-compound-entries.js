#!/usr/bin/env node

/**
 * Q1仕訳問題の複合仕訳テンプレート修正スクリプト
 *
 * 修正内容:
 * 1. 複合仕訳テンプレート不一致（20件）: \\"journalEntry\\":[ → \\"journalEntries\":[
 * 2. フィールド名typo（3件）: \\"credit_account\\":0 → \\"credit_amount\\":0
 *
 * 参照: docs/development-logs/2025-10-12-q1-q3-validation.md
 */

const fs = require("fs");
const path = require("path");

// 修正対象の問題ID
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
  "Q_J_131",
  "Q_J_132",
  "Q_J_133",
  "Q_J_134",
  "Q_J_135",
  "Q_J_136",
  "Q_J_137",
  "Q_J_144",
  "Q_J_244",
  "Q_J_018",
];

const TYPO_IDS = ["Q_J_018", "Q_J_073", "Q_J_108"];

const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

function main() {
  console.log("📝 Q1仕訳問題の修正を開始します...\n");

  let content = fs.readFileSync(masterQuestionsPath, "utf8");
  let fixedCount = 0;
  let typoFixedCount = 0;

  // Phase 1: 複合仕訳テンプレート修正
  console.log("Phase 1: 複合仕訳テンプレート修正（20件）");
  console.log("━".repeat(50));

  COMPOUND_ENTRY_IDS.forEach((id) => {
    // 問題IDから次の問題IDまでの範囲を取得
    const idMatch = content.match(
      new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?)(?=\\s+\\{\\s*id:|$)`, "m"),
    );
    if (!idMatch) {
      console.log(`⚠️  ${id}: 問題ブロックの抽出に失敗`);
      return;
    }

    const questionBlock = idMatch[1];

    // 文字列置換で \\"journalEntry\\":[ を \\"journalEntries\":[ に変更
    if (questionBlock.includes('\\"journalEntry\\":[')) {
      // answer_template_json内を修正
      content = content.replace(
        new RegExp(
          `(id:\\s*["']${id}["'][\\s\\S]*?answer_template_json:\\s*['"])([\\s\\S]*?)(["'],)`,
          "m",
        ),
        (match, before, json, after) => {
          const updatedJson = json.replace(
            '\\"journalEntry\\":[',
            '\\"journalEntries\\":[',
          );
          return before + updatedJson + after;
        },
      );

      // correct_answer_json内を修正
      content = content.replace(
        new RegExp(
          `(id:\\s*["']${id}["'][\\s\\S]*?correct_answer_json:\\s*['"])([\\s\\S]*?)(["'],)`,
          "m",
        ),
        (match, before, json, after) => {
          const updatedJson = json.replace(
            '\\"journalEntry\\":[',
            '\\"journalEntries\\":[',
          );
          return before + updatedJson + after;
        },
      );

      console.log(
        `✅ ${id}: \\"journalEntry\\":[] → \\"journalEntries\\":[] に修正`,
      );
      fixedCount++;
    } else if (questionBlock.includes('\\"journalEntries\\":[')) {
      console.log(`✓  ${id}: すでにjournalEntries形式です`);
    } else {
      console.log(`⚠️  ${id}: 配列形式のjournalEntryが見つかりません`);
    }
  });

  console.log("\n" + "━".repeat(50));
  console.log(`✅ 複合仕訳修正完了: ${fixedCount}件\n`);

  // Phase 2: typo修正
  console.log("Phase 2: フィールド名typo修正（3件）");
  console.log("━".repeat(50));

  TYPO_IDS.forEach((id) => {
    // 問題IDから次の問題IDまでの範囲を取得
    const idMatch = content.match(
      new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?)(?=\\s+\\{\\s*id:|$)`, "m"),
    );
    if (!idMatch) {
      console.log(`⚠️  ${id}: 問題ブロックの抽出に失敗`);
      return;
    }

    const questionBlock = idMatch[1];

    // 文字列置換で \\"credit_account\\":0 を \\"credit_amount\\":0 に修正
    if (questionBlock.includes('\\"credit_account\\":0')) {
      content = content.replace(
        new RegExp(
          `(id:\\s*["']${id}["'][\\s\\S]*?answer_template_json:\\s*['"])([\\s\\S]*?)(["'],)`,
          "m",
        ),
        (match, before, json, after) => {
          const updatedJson = json.replace(
            '\\"credit_account\\":0',
            '\\"credit_amount\\":0',
          );
          return before + updatedJson + after;
        },
      );
      console.log(
        `✅ ${id}: \\"credit_account\\":0 → \\"credit_amount\\":0 に修正`,
      );
      typoFixedCount++;
    } else {
      console.log(`✓  ${id}: typoは検出されませんでした`);
    }
  });

  console.log("\n" + "━".repeat(50));
  console.log(`✅ typo修正完了: ${typoFixedCount}件\n`);

  // ファイル保存
  fs.writeFileSync(masterQuestionsPath, content, "utf8");

  console.log("━".repeat(50));
  console.log("📊 修正サマリー");
  console.log("━".repeat(50));
  console.log(`複合仕訳修正: ${fixedCount}件`);
  console.log(`typo修正: ${typoFixedCount}件`);
  console.log(`合計: ${fixedCount + typoFixedCount}件`);
  console.log("\n✅ 修正完了: src/data/master-questions.ts");
}

main();
