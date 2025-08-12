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

console.log("🔍 修正前のQ_J_006を検索中...");

// Q_J_006の現在の誤った正答（複数の貸方エントリが間違った形式）
const q006WrongPattern =
  /"journalEntry":\{"entries":\[\{"debit_account":"普通預金","debit_amount":152000\},\{"credit_account":"定期預金","credit_amount":150000\},\{"credit_account":"受取利息","credit_amount":2000\}\]\}/;

// Q_J_006の正しい正答（複数エントリを正しい形式で）
const q006CorrectAnswer =
  '"journalEntry":{"entries":[{"debit_account":"普通預金","debit_amount":152000},{"credit_account":"定期預金","credit_amount":150000},{"credit_account":"受取利息","credit_amount":2000}]}';

if (content.includes(q006CorrectAnswer)) {
  console.log("❌ Q_J_006の現在の正答形式に問題があります。修正します...");

  // 正しい形式に修正（借方1つ、貸方2つの複合仕訳）
  const q006NewCorrectAnswer =
    '"journalEntry":{"debit_account":"普通預金","debit_amount":152000,"credit_entries":[{"account":"定期預金","amount":150000},{"account":"受取利息","amount":2000}]}';

  content = content.replace(q006CorrectAnswer, q006NewCorrectAnswer);
  fixCount++;
  console.log("✅ Q_J_006の正答を正しい形式に修正しました");
}

// Q_J_007も同様に確認・修正
const q007CurrentPattern =
  /"journalEntry":\{"entries":\[\{"debit_account":"通信費","debit_amount":30000\},\{"debit_account":"雑損","debit_amount":20000\},\{"credit_account":"現金過不足","credit_amount":50000\}\]\}/;

if (q007CurrentPattern.test(content)) {
  console.log("❌ Q_J_007の正答形式も修正が必要です...");

  const q007NewCorrectAnswer =
    '"journalEntry":{"debit_entries":[{"account":"通信費","amount":30000},{"account":"雑損","amount":20000}],"credit_account":"現金過不足","credit_amount":50000}';

  content = content.replace(q007CurrentPattern, q007NewCorrectAnswer);
  fixCount++;
  console.log("✅ Q_J_007の正答を正しい形式に修正しました");
}

// 実際には、簡単な仕訳の標準形式を確認して、それに合わせる必要がある
// 他の問題の形式を確認
console.log("\n📋 他の問題の正答形式を確認中...");

// Q_J_001の形式を確認（単純な仕訳の例）
const simpleFormatCheck = content.match(
  /Q_J_001[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (simpleFormatCheck) {
  console.log("Q_J_001の形式:", simpleFormatCheck[1].substring(0, 100) + "...");
}

// Q_J_009の形式を確認（複合仕訳の例）
const complexFormatCheck = content.match(
  /Q_J_009[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (complexFormatCheck) {
  console.log(
    "Q_J_009の形式:",
    complexFormatCheck[1].substring(0, 150) + "...",
  );
}

// 実際の修正を試みる - Q_J_006とQ_J_007を単純な形式に戻す
console.log("\n🔧 標準形式での修正を実施中...");

// Q_J_006: 定期預金満期の仕訳を複合仕訳形式で修正
const q006SimpleSearch =
  /("Q_J_006"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q006Match = content.match(q006SimpleSearch);

if (q006Match) {
  // 複合仕訳の正しい形式（借方1つ、貸方2つ）
  const q006CorrectJSON =
    '{"journalEntry":{"debit_account":"普通預金","debit_amount":152000,"credit_account":"定期預金,受取利息","credit_amount":"150000,2000"}}';

  // 実際には配列形式の方が適切
  const q006ArrayFormat =
    '{"journalEntry":[{"debit_account":"普通預金","debit_amount":152000,"credit_account":"定期預金","credit_amount":150000},{"debit_account":"","debit_amount":0,"credit_account":"受取利息","credit_amount":2000}]}';

  content = content.replace(q006SimpleSearch, `$1${q006ArrayFormat}$3`);
  console.log("✅ Q_J_006を配列形式で修正しました");
  fixCount++;
}

// Q_J_007: 現金過不足の仕訳を複合仕訳形式で修正
const q007SimpleSearch =
  /("Q_J_007"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q007Match = content.match(q007SimpleSearch);

if (q007Match) {
  // 複合仕訳の正しい形式（借方2つ、貸方1つ）
  const q007ArrayFormat =
    '{"journalEntry":[{"debit_account":"通信費","debit_amount":30000,"credit_account":"現金過不足","credit_amount":50000},{"debit_account":"雑損","debit_amount":20000,"credit_account":"","credit_amount":0}]}';

  content = content.replace(q007SimpleSearch, `$1${q007ArrayFormat}$3`);
  console.log("✅ Q_J_007を配列形式で修正しました");
  fixCount++;
}

// ファイル書き込み
if (fixCount > 0) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`\n✨ 合計 ${fixCount} 箇所の修正を完了しました`);
} else {
  console.log("\n⚠️ 修正が必要な箇所が見つかりませんでした");
}

// 修正後の確認
console.log("\n🔍 修正後の確認...");
const updatedContent = fs.readFileSync(filePath, "utf8");

// Q_J_006の確認
const q006Check = updatedContent.match(
  /Q_J_006[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (q006Check) {
  console.log("\nQ_J_006の修正後:");
  console.log(q006Check[1]);
}

// Q_J_007の確認
const q007Check = updatedContent.match(
  /Q_J_007[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (q007Check) {
  console.log("\nQ_J_007の修正後:");
  console.log(q007Check[1]);
}
