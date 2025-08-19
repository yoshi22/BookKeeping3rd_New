#!/usr/bin/env node

/**
 * Phase D3: Q_J_043個別修正スクリプト
 * - 文房具購入なのに「仕入」勘定 → 「消耗品費」に修正
 * - 問題文の「25,000円で仕入れ」→「2,000円で購入」に修正
 * - 説明文を文房具専用に全面更新
 * - updated_at: 2025-08-19T16:15:00Z
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

console.log("🔧 Phase D3: Q_J_043個別修正スクリプト開始...");

try {
  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  // Q_J_043問題ブロックを特定する正規表現
  const questionBlockRegex = new RegExp(
    `(\\s+{\\s*id: "Q_J_043",\\s*category_id: "journal",[\\s\\S]*?tags_json:[\\s\\S]*?},)`,
    "g",
  );

  const match = content.match(questionBlockRegex);
  if (match) {
    console.log("🔍 Q_J_043を処理中...");

    let questionBlock = match[0];
    let originalBlock = questionBlock;

    // 1. 問題文修正: 商品500円を仕入れ → 文房具2,000円で購入
    questionBlock = questionBlock.replace(
      /question_text: "商品500円を仕入れ、代金は掛けとした。"/,
      'question_text: "事務所で使用する文房具一式を2,000円で購入し、代金は現金で支払った。"',
    );

    // 2. 正答修正: 仕入→消耗品費、買掛金→現金、金額500→2000
    questionBlock = questionBlock.replace(
      /"debit_account":"仕入","debit_amount":500,"credit_account":"買掛金","credit_amount":500/g,
      '"debit_account":"消耗品費","debit_amount":2000,"credit_account":"現金","credit_amount":2000',
    );

    // 3. 説明文を文房具専用に全面更新
    const newExplanation = `"【基本概念】\\\\n事務用品（文房具）の購入は、事業活動に必要な消耗品を購入する取引です。ペン、紙、ファイルなどの文房具は「消耗品費」勘定（費用）で処理し、現金の減少は「現金」勘定（資産）の減少として処理します。\\\\n\\\\n【具体例・イメージ】\\\\nオフィスで使用するボールペン、コピー用紙、付箋、ファイルなどを文具店で購入し、その場で現金決済する場合をイメージしてください。これらは事業に必要な消耗品です。\\\\n\\\\n【仕訳パターン】\\\\n・文房具購入時: 借方に「消耗品費」、貸方に「現金」\\\\n・掛け購入の場合: 借方に「消耗品費」、貸方に「買掛金」\\\\n・商品仕入との違い: 文房具は「消耗品費」、販売商品は「仕入」\\\\n・事務用品全般: プリンター用紙、封筒、文具等も同様処理\\\\n\\\\n【間違えやすいポイント】\\\\n・「仕入」と混同してしまう（仕入は販売用商品のみ）\\\\n・「事務用品費」と「消耗品費」の使い分けを間違える\\\\n・現金の増減を逆に記入してしまう\\\\n・備品との区別ができない（備品は資産、文房具は費用）\\\\n\\\\n【覚え方のコツ】\\\\n・文房具は「消耗品」= 費用勘定（借方）\\\\n・現金が減るので貸方（右側）\\\\n・「消耗品買って現金減る」で覚える\\\\n・販売用でない = 仕入ではない\\\\n\\\\n【この問題の仕訳】\\\\n借方：消耗品費 2,000円\\\\n貸方：現金 2,000円"`;

    questionBlock = questionBlock.replace(
      /explanation:\s*"[\\s\\S]*?",/g,
      `explanation:\n      ${newExplanation},`,
    );

    // 4. tags_json修正: 消耗品費関連に変更
    questionBlock = questionBlock.replace(
      /tags_json:\s*'[^']*'/g,
      'tags_json:\n      \'{"subcategory":"cash_deposit","pattern":"消耗品費支払","accounts":["消耗品費","現金"],"keywords":["消耗品費","文房具","事務用品","現金支払"],"examSection":1}\'',
    );

    // 5. updated_at修正
    questionBlock = questionBlock.replace(
      /updated_at: "[^"]*"/g,
      'updated_at: "2025-08-19T16:15:00Z"',
    );

    // 変更があった場合のみ置換
    if (questionBlock !== originalBlock) {
      content = content.replace(originalBlock, questionBlock);
      console.log("✅ Q_J_043修正完了");

      // ファイル書き込み
      fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
      console.log("\n🎉 Q_J_043個別修正完了！");
      console.log("📝 以下の修正を実施しました:");
      console.log("   - 問題文: 25,000円で仕入れ → 2,000円で購入");
      console.log("   - 正答: 仕入 → 消耗品費");
      console.log("   - 説明文: 商品売買 → 文房具専用説明に全面更新");
      console.log("   - tags: 消耗品費関連に変更");
      console.log("   - updated_at: 2025-08-19T16:15:00Z");
    } else {
      console.log("⏭️  Q_J_043は既に修正済み");
    }
  } else {
    console.log("⚠️  Q_J_043が見つかりません");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
