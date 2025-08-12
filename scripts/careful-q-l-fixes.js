const fs = require("fs");
const path = require("path");

console.log("🔧 慎重な第二問修正スクリプト（TypeScript構文保持）\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("📖 master-questions.ts読み込み中...");
let content = fs.readFileSync(questionsPath, "utf8");

console.log("🔍 Q_L_015の修正（構文保持）...");

// Q_L_015の correct_answer_json のみを修正（仕入帳データ）
const q015CorrectAnswer = `{"entries":[{"date":"9/5","description":"A商店","debit":50000,"credit":0,"balance":50000},{"date":"9/12","description":"B商店","debit":30000,"credit":0,"balance":80000},{"date":"9/18","description":"C商店","debit":25000,"credit":0,"balance":105000},{"date":"9/25","description":"返品A商店","debit":-5000,"credit":0,"balance":100000}]}`;

// Q_L_015の正答データのみ安全に置換
const q015AnswerPattern =
  /(id:\s*"Q_L_015"[\s\S]*?correct_answer_json:\s*')([^']+)(',)/;
const q015Match = content.match(q015AnswerPattern);

if (q015Match) {
  content = content.replace(q015AnswerPattern, `$1${q015CorrectAnswer}$3`);
  console.log("✅ Q_L_015の解答データを仕入帳形式に修正");
} else {
  console.log("❌ Q_L_015のパターンが見つかりません");
}

console.log("🔍 Q_L_016の修正（構文保持）...");

// Q_L_016の correct_answer_json のみを修正（売上帳データ）
const q016CorrectAnswer = `{"entries":[{"date":"2/3","description":"X商店","debit":0,"credit":80000,"balance":80000},{"date":"2/10","description":"Y商店","debit":0,"credit":60000,"balance":140000},{"date":"2/15","description":"Z商店","debit":0,"credit":45000,"balance":185000},{"date":"2/22","description":"返品X商店","debit":0,"credit":-8000,"balance":177000}]}`;

// Q_L_016の正答データのみ安全に置換
const q016AnswerPattern =
  /(id:\s*"Q_L_016"[\s\S]*?correct_answer_json:\s*')([^']+)(',)/;
const q016Match = content.match(q016AnswerPattern);

if (q016Match) {
  content = content.replace(q016AnswerPattern, `$1${q016CorrectAnswer}$3`);
  console.log("✅ Q_L_016の解答データを売上帳形式に修正");
} else {
  console.log("❌ Q_L_016のパターンが見つかりません");
}

console.log("💾 修正されたファイルを保存中...");
fs.writeFileSync(questionsPath, content);

console.log("🔍 修正結果の検証...");

// 検証
const verifyContent = fs.readFileSync(questionsPath, "utf8");

if (
  verifyContent.includes("A商店から商品を掛けで仕入れた") ||
  verifyContent.includes('A商店","debit":50000')
) {
  console.log("✅ Q_L_015: 仕入帳データに修正確認");
} else {
  console.log("❌ Q_L_015: 修正が反映されていません");
}

if (
  verifyContent.includes("X商店に商品を掛けで売上げた") ||
  verifyContent.includes('X商店","debit":0,"credit":80000')
) {
  console.log("✅ Q_L_016: 売上帳データに修正確認");
} else {
  console.log("❌ Q_L_016: 修正が反映されていません");
}

console.log("\n✅ 慎重な修正完了");
console.log(
  "📝 修正内容: Q_L_015とQ_L_016の解答データのみを適切に修正（構文保持）",
);
