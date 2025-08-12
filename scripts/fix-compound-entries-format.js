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

console.log("🔍 複合仕訳の形式を修正中...\n");

// Q_J_006の修正（定期預金満期）
// 現在: {"journalEntry":{"debit_account":"普通預金","debit_amount":152000,"credit_account":["定期預金","受取利息"],"credit_amount":[150000,2000]}}
// 修正後: 標準的な複合仕訳形式（各行に借方・貸方を明示）
const q006Pattern = /(id: "Q_J_006"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q006Match = content.match(q006Pattern);

if (q006Match) {
  console.log("Q_J_006を修正中...");

  // 標準的な簿記形式：各行に借方・貸方を完全に記載
  const q006CorrectAnswer = JSON.stringify({
    journalEntries: [
      {
        debit_account: "普通預金",
        debit_amount: 152000,
        credit_account: "定期預金",
        credit_amount: 150000,
      },
      {
        debit_account: "",
        debit_amount: 0,
        credit_account: "受取利息",
        credit_amount: 2000,
      },
    ],
  });

  content = content.replace(q006Pattern, `$1${q006CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_006を修正しました\n");
}

// Q_J_007の修正（現金過不足原因判明）
// 現在: {"journalEntry":{"debit_account":["通信費","雑損"],"debit_amount":[30000,20000],"credit_account":"現金過不足","credit_amount":50000}}
const q007Pattern = /(id: "Q_J_007"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q007Match = content.match(q007Pattern);

if (q007Match) {
  console.log("Q_J_007を修正中...");

  const q007CorrectAnswer = JSON.stringify({
    journalEntries: [
      {
        debit_account: "通信費",
        debit_amount: 30000,
        credit_account: "現金過不足",
        credit_amount: 50000,
      },
      {
        debit_account: "雑損",
        debit_amount: 20000,
        credit_account: "",
        credit_amount: 0,
      },
    ],
  });

  content = content.replace(q007Pattern, `$1${q007CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_007を修正しました\n");
}

// Q_J_009の修正（売上・現金と売掛金）
// 現在: {"journalEntry":{"entries":[{"debit_account":"現金","debit_amount":300000},{"debit_account":"売掛金","debit_amount":690000},{"credit_account":"売上","credit_amount":990000}]}}
const q009Pattern = /(id: "Q_J_009"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q009Match = content.match(q009Pattern);

if (q009Match) {
  console.log("Q_J_009を修正中...");

  const q009CorrectAnswer = JSON.stringify({
    journalEntries: [
      {
        debit_account: "現金",
        debit_amount: 300000,
        credit_account: "売上",
        credit_amount: 990000,
      },
      {
        debit_account: "売掛金",
        debit_amount: 690000,
        credit_account: "",
        credit_amount: 0,
      },
    ],
  });

  content = content.replace(q009Pattern, `$1${q009CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_009を修正しました\n");
}

// Q_J_012の修正（仕入諸掛り）
// 現在: {"journalEntry":{"entries":[{"debit_account":"仕入","debit_amount":305000},{"credit_account":"買掛金","credit_amount":300000},{"credit_account":"現金","credit_amount":5000}]}}
const q012Pattern = /(id: "Q_J_012"[\s\S]*?correct_answer_json:\s*')([^']+)(')/;
const q012Match = content.match(q012Pattern);

if (q012Match) {
  console.log("Q_J_012を修正中...");

  const q012CorrectAnswer = JSON.stringify({
    journalEntries: [
      {
        debit_account: "仕入",
        debit_amount: 305000,
        credit_account: "買掛金",
        credit_amount: 300000,
      },
      {
        debit_account: "",
        debit_amount: 0,
        credit_account: "現金",
        credit_amount: 5000,
      },
    ],
  });

  content = content.replace(q012Pattern, `$1${q012CorrectAnswer}$3`);
  fixCount++;
  console.log("✅ Q_J_012を修正しました\n");
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

  // Q_J_009の確認
  const q009Check = updatedContent.match(
    /Q_J_009[\s\S]*?correct_answer_json:\s*'([^']+)'/,
  );
  if (q009Check) {
    console.log("\nQ_J_009の修正後:");
    const parsed009 = JSON.parse(q009Check[1]);
    console.log(JSON.stringify(parsed009, null, 2));
  }

  // Q_J_012の確認
  const q012Check = updatedContent.match(
    /Q_J_012[\s\S]*?correct_answer_json:\s*'([^']+)'/,
  );
  if (q012Check) {
    console.log("\nQ_J_012の修正後:");
    const parsed012 = JSON.parse(q012Check[1]);
    console.log(JSON.stringify(parsed012, null, 2));
  }
} else {
  console.log("⚠️ 修正が必要な箇所が見つかりませんでした");
}
