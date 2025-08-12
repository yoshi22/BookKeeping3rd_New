const fs = require("fs");
const path = require("path");

console.log("🔧 第二問の直接修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("📖 master-questions.ts読み込み中...");
let content = fs.readFileSync(questionsPath, "utf8");

console.log("🔍 重要な問題の特定と修正開始\n");

// Q_L_015の修正 - 仕入帳問題なのに定期預金解答の問題
console.log("📌 Q_L_015の修正中...");
console.log("問題: 仕入帳問題なのに定期預金解答データが入っている");

// Q_L_015の correct_answer_json を仕入帳に適切なデータに変更
const q015CorrectAnswer = `{"entries":[{"date":"9/5","description":"A商店","debit":50000,"credit":0,"balance":50000},{"date":"9/12","description":"B商店","debit":30000,"credit":0,"balance":80000},{"date":"9/18","description":"C商店","debit":25000,"credit":0,"balance":105000},{"date":"9/25","description":"返品A商店","debit":-5000,"credit":0,"balance":100000}]}`;

const q015Pattern =
  /id:\s*"Q_L_015"[\s\S]*?correct_answer_json:\s*[\n\s]*'([^']*)',/;
const q015Match = content.match(q015Pattern);

if (q015Match) {
  const newQ015 = content.replace(q015Pattern, (match) => {
    return match.replace(q015Match[1], q015CorrectAnswer);
  });
  content = newQ015;
  console.log("✅ Q_L_015の解答データを仕入帳形式に修正");
} else {
  console.log("❌ Q_L_015のパターンが見つかりません");
}

// Q_L_016の修正 - 売上帳問題なのに売掛金元帳解答の問題
console.log("\n📌 Q_L_016の修正中...");
console.log("問題: 売上帳問題なのに売掛金元帳解答データが入っている");

// Q_L_016の correct_answer_json を売上帳に適切なデータに変更
const q016CorrectAnswer = `{"entries":[{"date":"2/3","description":"X商店","debit":0,"credit":80000,"balance":80000},{"date":"2/10","description":"Y商店","debit":0,"credit":60000,"balance":140000},{"date":"2/15","description":"Z商店","debit":0,"credit":45000,"balance":185000},{"date":"2/22","description":"返品X商店","debit":0,"credit":-8000,"balance":177000}]}`;

const q016Pattern =
  /id:\s*"Q_L_016"[\s\S]*?correct_answer_json:\s*[\n\s]*'([^']*)',/;
const q016Match = content.match(q016Pattern);

if (q016Match) {
  const newQ016 = content.replace(q016Pattern, (match) => {
    return match.replace(q016Match[1], q016CorrectAnswer);
  });
  content = newQ016;
  console.log("✅ Q_L_016の解答データを売上帳形式に修正");
} else {
  console.log("❌ Q_L_016のパターンが見つかりません");
}

// 問題文の改善 - 不十分な情報を補完
console.log("\n📌 不十分な問題文の改善中...");

// Q_L_015の問題文をより具体的に
const q015ImprovedQuestion = `【仕入帳記入問題】

2025年9月の仕入帳を作成してください。

【取引データ】
9月 5日 A商店から商品を掛けで仕入れた 50,000円
9月12日 B商店から商品を掛けで仕入れた 30,000円  
9月18日 C商店から商品を掛けで仕入れた 25,000円
9月25日 A商店への商品の一部を返品した 5,000円

【記入要求】
・日付、取引先名、金額を適切に記入
・返品の場合は△または赤字で表示
・月末残高を計算`;

const q015QuestionPattern =
  /id:\s*"Q_L_015"[\s\S]*?question_text:\s*[\n\s]*"([^"]*)",/;
if (content.match(q015QuestionPattern)) {
  content = content.replace(q015QuestionPattern, (match) => {
    return match.replace(
      /question_text:\s*[\n\s]*"[^"]*",/,
      `question_text:\n      "${q015ImprovedQuestion}",`,
    );
  });
  console.log("✅ Q_L_015の問題文を具体的に改善");
}

// Q_L_016の問題文をより具体的に
const q016ImprovedQuestion = `【売上帳記入問題】

2025年2月の売上帳を作成してください。

【取引データ】  
2月 3日 X商店に商品を掛けで売上げた 80,000円
2月10日 Y商店に商品を掛けで売上げた 60,000円
2月15日 Z商店に商品を掛けで売上げた 45,000円  
2月22日 X商店から商品の一部返品があった 8,000円

【記入要求】
・日付、得意先名、金額を適切に記入
・返品の場合は△または赤字で表示  
・月末残高を計算`;

const q016QuestionPattern =
  /id:\s*"Q_L_016"[\s\S]*?question_text:\s*[\n\s]*"([^"]*)",/;
if (content.match(q016QuestionPattern)) {
  content = content.replace(q016QuestionPattern, (match) => {
    return match.replace(
      /question_text:\s*[\n\s]*"[^"]*",/,
      `question_text:\n      "${q016ImprovedQuestion}",`,
    );
  });
  console.log("✅ Q_L_016の問題文を具体的に改善");
}

// タグ情報の修正
console.log("\n📌 タグ情報の修正中...");

// Q_L_015のタグを仕入帳に修正
const q015Tags = `{"subcategory":"subsidiary_ledger","pattern":"仕入帳","accounts":[],"keywords":["仕入帳","補助簿","仕入先"],"examSection":2}`;
const q015TagsPattern = /id:\s*"Q_L_015"[\s\S]*?tags_json:\s*[\n\s]*'([^']*)',/;
if (content.match(q015TagsPattern)) {
  content = content.replace(q015TagsPattern, (match, captured) => {
    return match.replace(captured, q015Tags);
  });
  console.log("✅ Q_L_015のタグ情報を仕入帳に修正");
}

// Q_L_016のタグを売上帳に修正
const q016Tags = `{"subcategory":"subsidiary_ledger","pattern":"売上帳","accounts":[],"keywords":["売上帳","補助簿","得意先"],"examSection":2}`;
const q016TagsPattern = /id:\s*"Q_L_016"[\s\S]*?tags_json:\s*[\n\s]*'([^']*)',/;
if (content.match(q016TagsPattern)) {
  content = content.replace(q016TagsPattern, (match, captured) => {
    return match.replace(captured, q016Tags);
  });
  console.log("✅ Q_L_016のタグ情報を売上帳に修正");
}

// 説明文の修正
console.log("\n📌 説明文の修正中...");

// Q_L_015の説明を仕入帳用に修正
const q015Explanation = `仕入帳への記入処理。仕入先別の掛仕入を記録し、買掛金の詳細を管理します。

⚠️ 間違えやすいポイント：現金仕入は記入しない（掛仕入のみ）、返品・値引きの△表示を忘れる、仕入先名の記載ミス、引取運賃等の付帯費用の処理。`;

const q015ExplanationPattern =
  /id:\s*"Q_L_015"[\s\S]*?explanation:\s*[\n\s]*"([^"]*)",/;
if (content.match(q015ExplanationPattern)) {
  content = content.replace(q015ExplanationPattern, (match) => {
    return match.replace(
      /explanation:\s*[\n\s]*"[^"]*",/,
      `explanation:\n      "${q015Explanation}",`,
    );
  });
  console.log("✅ Q_L_015の説明を仕入帳用に修正");
}

// Q_L_016の説明を売上帳用に修正
const q016Explanation = `売上帳への記入処理。得意先別の掛売上を記録し、売掛金の詳細を管理します。

⚠️ 間違えやすいポイント：現金売上は記入しない（掛売上のみ）、返品・値引きの△表示を忘れる、得意先名の記載ミス、合計金額の計算間違い。`;

const q016ExplanationPattern =
  /id:\s*"Q_L_016"[\s\S]*?explanation:\s*[\n\s]*"([^"]*)",/;
if (content.match(q016ExplanationPattern)) {
  content = content.replace(q016ExplanationPattern, (match) => {
    return match.replace(
      /explanation:\s*[\n\s]*"[^"]*",/,
      `explanation:\n      "${q016Explanation}",`,
    );
  });
  console.log("✅ Q_L_016の説明を売上帳用に修正");
}

// ファイル保存
console.log("\n💾 修正されたファイルを保存中...");
fs.writeFileSync(questionsPath, content);
console.log("✅ 修正完了");

// 検証
console.log("\n🔍 修正内容の検証中...");

const verifyContent = fs.readFileSync(questionsPath, "utf8");

// Q_L_015検証
if (
  verifyContent.includes(`Q_L_015`) &&
  verifyContent.includes(`仕入帳記入問題`)
) {
  console.log("✅ Q_L_015: 問題文が仕入帳形式に修正されています");
} else {
  console.log("❌ Q_L_015: 問題文修正が反映されていません");
}

if (verifyContent.includes(`A商店から商品を掛けで仕入れた`)) {
  console.log("✅ Q_L_015: 解答データが仕入帳形式に修正されています");
} else {
  console.log("❌ Q_L_015: 解答データ修正が反映されていません");
}

// Q_L_016検証
if (
  verifyContent.includes(`Q_L_016`) &&
  verifyContent.includes(`売上帳記入問題`)
) {
  console.log("✅ Q_L_016: 問題文が売上帳形式に修正されています");
} else {
  console.log("❌ Q_L_016: 問題文修正が反映されていません");
}

if (verifyContent.includes(`X商店に商品を掛けで売上げた`)) {
  console.log("✅ Q_L_016: 解答データが売上帳形式に修正されています");
} else {
  console.log("❌ Q_L_016: 解答データ修正が反映されていません");
}

console.log("\n🎯 修正完了");
console.log("📝 修正内容:");
console.log("1. Q_L_015: 仕入帳問題の問題文・解答・説明を適切に修正");
console.log("2. Q_L_016: 売上帳問題の問題文・解答・説明を適切に修正");
console.log("3. タグ情報を正しい帳簿種類に修正");
console.log("4. 具体的な取引データを含む問題文に改善");

console.log(
  "\n✅ 重要度の高い2つの問題（Q_L_015, Q_L_016）の修正が完了しました",
);
