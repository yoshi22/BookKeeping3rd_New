const fs = require("fs");
const path = require("path");

console.log("🔧 第二問包括修正スクリプト\n");
console.log("📋 修正対象:");
console.log("1. 問題文に具体的な取引データがない問題");
console.log("2. 解答と問題文が対応していない問題");
console.log("3. 回答フォームが不適切な問題\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("📖 master-questions.ts読み込み中...");
let content = fs.readFileSync(questionsPath, "utf8");

// 修正記録
const fixLog = [];

// ============================================
// パターン2: 補助簿記入問題（Q_L_011-Q_L_020）
// ============================================

console.log("\n📌 パターン2: 補助簿記入問題の修正開始\n");

// Q_L_015: 仕入帳問題 - 具体的取引データ追加
console.log("🔍 Q_L_015: 仕入帳記入問題の修正...");

const q015NewQuestion = `【仕入帳記入問題】

2025年9月の仕入帳を作成してください。

【取引データ】
9月 5日: A商店より商品を掛けで仕入れた 50,000円
9月12日: B商店より商品を掛けで仕入れた 30,000円
9月18日: C商店より商品を掛けで仕入れた 25,000円
9月25日: A商店に商品の一部を返品した 5,000円

【記入要求】
・日付、仕入先名、金額を適切に記入
・返品は赤字または△表示
・月次合計の計算`;

const q015Pattern = /(id:\s*"Q_L_015"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q015Pattern)) {
  content = content.replace(
    q015Pattern,
    `$1"${q015NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_015: 問題文に具体的取引データを追加");
}

// Q_L_015のタグ修正（売掛金元帳→仕入帳）
const q015TagsPattern = /(id:\s*"Q_L_015"[\s\S]*?tags_json:\s*')([^']+)'/;
const q015NewTags =
  '{"subcategory":"subsidiary_ledger","pattern":"仕入帳","accounts":["仕入","買掛金"],"keywords":["仕入帳","補助簿","仕入先"],"examSection":2}';
if (content.match(q015TagsPattern)) {
  content = content.replace(q015TagsPattern, `$1${q015NewTags}'`);
  fixLog.push("✅ Q_L_015: タグを仕入帳に修正");
}

// Q_L_016: 売上帳問題 - 具体的取引データ追加
console.log("🔍 Q_L_016: 売上帳記入問題の修正...");

const q016NewQuestion = `【売上帳記入問題】

2025年2月の売上帳を作成してください。

【取引データ】
2月 3日: X商店に商品を掛けで売り上げた 80,000円
2月10日: Y商店に商品を掛けで売り上げた 60,000円
2月15日: Z商店に商品を掛けで売り上げた 45,000円
2月22日: X商店より商品の一部返品があった 8,000円

【記入要求】
・日付、得意先名、金額を適切に記入
・返品は赤字または△表示
・月次合計の計算`;

const q016Pattern = /(id:\s*"Q_L_016"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q016Pattern)) {
  content = content.replace(
    q016Pattern,
    `$1"${q016NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_016: 問題文に具体的取引データを追加");
}

// Q_L_016のタグ修正（売掛金元帳→売上帳）
const q016TagsPattern = /(id:\s*"Q_L_016"[\s\S]*?tags_json:\s*')([^']+)'/;
const q016NewTags =
  '{"subcategory":"subsidiary_ledger","pattern":"売上帳","accounts":["売上","売掛金"],"keywords":["売上帳","補助簿","得意先"],"examSection":2}';
if (content.match(q016TagsPattern)) {
  content = content.replace(q016TagsPattern, `$1${q016NewTags}'`);
  fixLog.push("✅ Q_L_016: タグを売上帳に修正");
}

// Q_L_017: 商品有高帳問題 - 具体的取引データ追加と解答修正
console.log("🔍 Q_L_017: 商品有高帳記入問題の修正...");

const q017NewQuestion = `【商品有高帳（先入先出法）記入問題】

2025年10月の商品有高帳を先入先出法で作成してください。

【取引データ】
10月 1日: 前月繰越 10個 @1,000円
10月 5日: 仕入 20個 @1,100円
10月12日: 売上 15個
10月18日: 仕入 15個 @1,200円
10月25日: 売上 20個

【記入要求】
・受入、払出、残高の数量・単価・金額を記入
・先入先出法により払出単価を決定
・残高を継続的に計算`;

const q017Pattern = /(id:\s*"Q_L_017"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q017Pattern)) {
  content = content.replace(
    q017Pattern,
    `$1"${q017NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_017: 問題文に具体的取引データを追加");
}

// Q_L_017の正答修正
const q017CorrectAnswer = `{"entries":[{"date":"10/1","description":"前月繰越","receipt_qty":10,"receipt_price":1000,"receipt_amount":10000,"issue_qty":0,"issue_price":0,"issue_amount":0,"balance_qty":10,"balance_price":1000,"balance_amount":10000},{"date":"10/5","description":"仕入","receipt_qty":20,"receipt_price":1100,"receipt_amount":22000,"issue_qty":0,"issue_price":0,"issue_amount":0,"balance_qty":30,"balance_amount":32000},{"date":"10/12","description":"売上","receipt_qty":0,"receipt_price":0,"receipt_amount":0,"issue_qty":15,"issue_amount":16500,"balance_qty":15,"balance_amount":15500},{"date":"10/18","description":"仕入","receipt_qty":15,"receipt_price":1200,"receipt_amount":18000,"issue_qty":0,"issue_price":0,"issue_amount":0,"balance_qty":30,"balance_amount":33500},{"date":"10/25","description":"売上","receipt_qty":0,"receipt_price":0,"receipt_amount":0,"issue_qty":20,"issue_amount":22000,"balance_qty":10,"balance_amount":11500}]}`;

const q017AnswerPattern =
  /(id:\s*"Q_L_017"[\s\S]*?correct_answer_json:\s*')([^']+)'/;
if (content.match(q017AnswerPattern)) {
  content = content.replace(q017AnswerPattern, `$1${q017CorrectAnswer}'`);
  fixLog.push("✅ Q_L_017: 解答を商品有高帳形式に修正");
}

// Q_L_017のタグ修正
const q017TagsPattern = /(id:\s*"Q_L_017"[\s\S]*?tags_json:\s*')([^']+)'/;
const q017NewTags =
  '{"subcategory":"subsidiary_ledger","pattern":"商品有高帳","accounts":["商品","仕入","売上原価"],"keywords":["商品有高帳","先入先出法","補助簿"],"examSection":2}';
if (content.match(q017TagsPattern)) {
  content = content.replace(q017TagsPattern, `$1${q017NewTags}'`);
  fixLog.push("✅ Q_L_017: タグを商品有高帳に修正");
}

// Q_L_018: 買掛金元帳問題
console.log("🔍 Q_L_018: 買掛金元帳記入問題の修正...");

const q018NewQuestion = `【買掛金元帳記入問題】

2025年11月のD商店に対する買掛金元帳を作成してください。

【取引データ】
11月 1日: 前月繰越高 120,000円
11月 8日: D商店より商品仕入 85,000円
11月15日: D商店へ現金支払 100,000円
11月22日: D商店より商品仕入 65,000円
11月28日: D商店へ約束手形振出 80,000円

【記入要求】
・日付、摘要、借方、貸方、残高を記入
・継続的な残高管理`;

const q018Pattern = /(id:\s*"Q_L_018"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q018Pattern)) {
  content = content.replace(
    q018Pattern,
    `$1"${q018NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_018: 問題文に具体的取引データを追加");
}

// Q_L_019: 売掛金元帳問題
console.log("🔍 Q_L_019: 売掛金元帳記入問題の修正...");

const q019NewQuestion = `【売掛金元帳記入問題】

2025年12月のE商店に対する売掛金元帳を作成してください。

【取引データ】
12月 1日: 前月繰越高 95,000円
12月 7日: E商店へ商品売上 120,000円
12月14日: E商店より現金回収 95,000円
12月20日: E商店へ商品売上 88,000円
12月27日: E商店より約束手形受取 100,000円

【記入要求】
・日付、摘要、借方、貸方、残高を記入
・継続的な残高管理`;

const q019Pattern = /(id:\s*"Q_L_019"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q019Pattern)) {
  content = content.replace(
    q019Pattern,
    `$1"${q019NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_019: 問題文に具体的取引データを追加");
}

// Q_L_020: 手形記入帳問題
console.log("🔍 Q_L_020: 手形記入帳記入問題の修正...");

const q020NewQuestion = `【受取手形記入帳記入問題】

2025年3月の受取手形記入帳を作成してください。

【取引データ】
3月 5日: F商店より約束手形受取（振出人:F商店、満期日:5月31日、金額:150,000円）
3月12日: G商店より約束手形受取（振出人:G商店、満期日:6月30日、金額:200,000円）
3月20日: H商店より為替手形受取（振出人:H商店、満期日:5月15日、金額:180,000円）
3月28日: F商店の手形を銀行で割引（割引料:2,000円）

【記入要求】
・手形種類、振出人、満期日、金額、処分方法を記入`;

const q020Pattern = /(id:\s*"Q_L_020"[\s\S]*?question_text:\s*)"[^"]*"/;
if (content.match(q020Pattern)) {
  content = content.replace(
    q020Pattern,
    `$1"${q020NewQuestion.replace(/\n/g, "\\n")}"`,
  );
  fixLog.push("✅ Q_L_020: 問題文に具体的取引データを追加");
}

// ============================================
// パターン1: 勘定記入問題（Q_L_001-Q_L_010）も確認
// ============================================

console.log("\n📌 パターン1: 勘定記入問題の確認...");

// Q_L_001-Q_L_010の問題文確認（サンプル）
const checkPattern1 = (id, expectedAccount) => {
  const pattern = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*)"`,
    "g",
  );
  const match = content.match(pattern);
  if (match && match[0].includes("詳細は問題文参照")) {
    console.log(`⚠️ ${id}: 具体的取引データが不足している可能性`);
    return false;
  }
  return true;
};

["Q_L_001", "Q_L_002", "Q_L_003"].forEach((id) => checkPattern1(id));

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

// 修正結果のサマリー
console.log("\n📊 修正結果サマリー");
console.log("=" + "=".repeat(40));
fixLog.forEach((log) => console.log(log));

console.log("\n✅ 第二問包括修正完了");
console.log("📝 次のステップ: TypeScript構文チェック実行");
