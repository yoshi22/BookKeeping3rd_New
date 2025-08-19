#!/usr/bin/env node

/**
 * Phase D2: 金額簡素化修正スクリプト
 * - 大きな金額をスマホ入力に最適化（1/10〜1/100スケール）
 * - 問題文、correct_answer_json、explanation全て更新
 * - updated_at: 2025-08-19T16:10:00Z 統一
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

// 金額修正対応表
const AMOUNT_FIXES = {
  Q_J_023: { from: "30000", to: "3000" },
  Q_J_027: { from: "80000", to: "8000", from2: "500", to2: "100" },
  Q_J_028: { from: "500000", to: "5000" },
  Q_J_029: { from: "200000", to: "2000" },
  Q_J_031: { from: "320000", to: "3000" },
  Q_J_033: { from: "500000", to: "5000" },
  Q_J_035: { from: "800000", to: "8000" },
  Q_J_036: { from: "1000000", to: "10000" },
  Q_J_037: {
    from: "1000000",
    to: "10000",
    from2: "50000",
    to2: "5000",
    from3: "10000",
    to3: "1000",
  },
  Q_J_038: {
    from: "500000",
    to: "5000",
    from2: "15000",
    to2: "1000",
    from3: "3000",
    to3: "500",
  },
  Q_J_039: {
    from: "800000",
    to: "8000",
    from2: "30000",
    to2: "3000",
    from3: "6000",
    to3: "500",
  },
  Q_J_040: { from: "1000000", to: "10000", from2: "600000", to2: "6000" },
  Q_J_041: { from: "100000", to: "10000" }, // 為替関連簡素化
  Q_J_042: { from: "1200000", to: "10000" },
  Q_J_043: { from: "25000", to: "2000" },
  Q_J_044: { from: "450000", to: "4000" },
  Q_J_045: { from: "330000", to: "3000" },
};

console.log("🔧 Phase D2: 金額簡素化修正スクリプト開始...");

try {
  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  let modifiedCount = 0;

  // 各問題を修正
  for (const [questionId, fixes] of Object.entries(AMOUNT_FIXES)) {
    console.log(`🔍 ${questionId}を処理中...`);

    // 問題ブロックを特定する正規表現
    const questionBlockRegex = new RegExp(
      `(\\s+{\\s*id: "${questionId}",\\s*category_id: "[^"]*",[\\s\\S]*?tags_json:[\\s\\S]*?},)`,
      "g",
    );

    const match = content.match(questionBlockRegex);
    if (match) {
      let questionBlock = match[0];
      let originalBlock = questionBlock;

      // メイン金額修正
      if (fixes.from && fixes.to) {
        const amountRegex = new RegExp(fixes.from, "g");
        questionBlock = questionBlock.replace(amountRegex, fixes.to);
      }

      // 追加金額修正（複数金額がある場合）
      if (fixes.from2 && fixes.to2) {
        const amountRegex2 = new RegExp(fixes.from2, "g");
        questionBlock = questionBlock.replace(amountRegex2, fixes.to2);
      }

      if (fixes.from3 && fixes.to3) {
        const amountRegex3 = new RegExp(fixes.from3, "g");
        questionBlock = questionBlock.replace(amountRegex3, fixes.to3);
      }

      // updated_at修正
      questionBlock = questionBlock.replace(
        /updated_at: "[^"]*"/g,
        'updated_at: "2025-08-19T16:10:00Z"',
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
    console.log(
      `\n🎉 Phase D2金額簡素化修正完了！修正問題数: ${modifiedCount}問`,
    );
    console.log("📝 以下の修正を実施しました:");
    console.log("   - 大きな金額をスマホ入力最適化（1/10〜1/100スケール）");
    console.log("   - 問題文・correct_answer_json・explanation全て更新");
    console.log("   - updated_at: 2025-08-19T16:10:00Z");
  } else {
    console.log("\nℹ️  修正対象の問題がありませんでした（既に修正済み）");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
