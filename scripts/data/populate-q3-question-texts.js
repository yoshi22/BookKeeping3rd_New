/**
 * Q3問題（試算表・合計残高試算表・財務諸表穴埋め）のquestion_textを補完
 * 50問分のquestion_textを一括設定
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// 問題タイプごとの問題文テンプレート
const QUESTION_TEXTS = {
  fill_in_trial_balance:
    "以下の期首残高と期中取引を記帳した後の残高試算表を完成させてください。空欄に適切な金額を選択してください。",
  fill_in_comprehensive_trial_balance:
    "以下の合計残高試算表の空欄を埋めてください。借方合計・貸方合計から残高を計算して、適切な金額を選択してください。",
  fill_in_financial_statement:
    "以下の財務諸表の空欄を埋めてください。適切な項目名または金額を選択してください。",
};

// Q3問題IDのパターン
const Q3_PATTERNS = [
  { prefix: "Q3_TB_", count: 20, type: "fill_in_trial_balance" }, // 試算表穴埋め
  {
    prefix: "Q3_CTB_",
    count: 15,
    type: "fill_in_comprehensive_trial_balance",
  }, // 合計残高試算表穴埋め
  { prefix: "Q3_FS_", count: 15, type: "fill_in_financial_statement" }, // 財務諸表穴埋め
];

function main() {
  console.log("Q3問題のquestion_text補完を開始...");

  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");
  let updatedCount = 0;

  // 各問題タイプを処理
  for (const pattern of Q3_PATTERNS) {
    const questionText = QUESTION_TEXTS[pattern.type];

    for (let i = 1; i <= pattern.count; i++) {
      const questionId = `${pattern.prefix}${String(i).padStart(3, "0")}`;

      // より確実なパターン: id行の後、question_text: "" を探す
      const idPattern = new RegExp(
        `(id: "${questionId}",\\s+category_id: "trial_balance",\\s+question_text: ")(")`,
        "gm",
      );

      const before = content;
      content = content.replace(idPattern, `$1${questionText}"`);

      if (content !== before) {
        updatedCount++;
        console.log(`✓ ${questionId}: question_text設定完了`);
      } else {
        console.warn(`⚠ ${questionId}: パターンが見つかりませんでした`);
      }
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf-8");

  console.log(`\n完了: ${updatedCount}/50問のquestion_textを更新しました`);
}

main();
