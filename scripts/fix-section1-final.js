const fs = require("fs");
const path = require("path");

// ファイルパス
const filePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// ファイル読み込み
let content = fs.readFileSync(filePath, "utf8");

// 修正カウンター
let fixCount = 0;

console.log("🔍 問題の正答形式を修正中...\n");

// Q_J_006の修正（定期預金満期）
// 問題: 定期預金150,000円が満期となり、利息2,000円（税引後）とともに普通預金に振り替えられた
// 正答: 借方: 普通預金 152,000円、貸方: 定期預金 150,000円 + 受取利息 2,000円

const q006Pattern = /("Q_J_006"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q006Match = content.match(q006Pattern);

if (q006Match) {
  console.log("Q_J_006の現在の正答:", q006Match[2].substring(0, 100) + "...");

  // 正しい仕訳（複合仕訳）
  const q006CorrectAnswer =
    '{"journalEntry":{"debit_account":"普通預金","debit_amount":152000,"credit_account":["定期預金","受取利息"],"credit_amount":[150000,2000]}}';

  content = content.replace(q006Pattern, `$1${q006CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_006を修正しました\n");
}

// Q_J_007の修正（現金過不足原因判明）
// 問題: 現金過不足50,000円（借方残高）の原因を調査したところ、通信費30,000円の記入漏れが判明した。残額は原因不明である
// 正答: 借方: 通信費 30,000円 + 雑損 20,000円、貸方: 現金過不足 50,000円

const q007Pattern = /("Q_J_007"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q007Match = content.match(q007Pattern);

if (q007Match) {
  console.log("Q_J_007の現在の正答:", q007Match[2].substring(0, 100) + "...");

  // 正しい仕訳（複合仕訳）
  const q007CorrectAnswer =
    '{"journalEntry":{"debit_account":["通信費","雑損"],"debit_amount":[30000,20000],"credit_account":"現金過不足","credit_amount":50000}}';

  content = content.replace(q007Pattern, `$1${q007CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_007を修正しました\n");
}

// ファイル書き込み
if (fixCount > 0) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✨ 合計 ${fixCount} 箇所の修正を完了しました\n`);

  // 修正後の確認
  console.log("📋 修正後の確認:");
  const updatedContent = fs.readFileSync(filePath, "utf8");

  // Q_J_006の確認
  const q006Check = updatedContent.match(
    /Q_J_006[\s\S]*?correct_answer_json:\s*'([^']+)'/,
  );
  if (q006Check) {
    console.log("\nQ_J_006の修正後:");
    const parsed006 = JSON.parse(q006Check[1]);
    console.log(JSON.stringify(parsed006, null, 2));
  }

  // Q_J_007の確認
  const q007Check = updatedContent.match(
    /Q_J_007[\s\S]*?correct_answer_json:\s*'([^']+)'/,
  );
  if (q007Check) {
    console.log("\nQ_J_007の修正後:");
    const parsed007 = JSON.parse(q007Check[1]);
    console.log(JSON.stringify(parsed007, null, 2));
  }
} else {
  console.log("⚠️ 修正が必要な箇所が見つかりませんでした");
}
