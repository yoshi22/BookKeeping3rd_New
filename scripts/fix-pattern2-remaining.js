const fs = require("fs");
const path = require("path");

console.log("🔧 パターン2：補助簿記入問題（Q_L_011-Q_L_014）の修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

const fixLog = [];

// 各問題の修正データ
const fixes = {
  Q_L_011: {
    question: `【現金出納帳記入問題】

2025年6月の現金出納帳を作成してください。

【前月繰越】
333,931円

【当月の取引】
6月 3日: 商品売上（現金） 85,000円
6月 7日: 給料支払 120,000円
6月10日: 家賃支払 45,000円
6月15日: 備品購入 25,000円
6月18日: 売掛金回収 60,000円
6月22日: 水道光熱費支払 8,500円
6月25日: 商品仕入（現金） 35,000円
6月28日: 雑収入 12,000円

【作成指示】
1. 日付順に記帳
2. 摘要欄の適切な記入
3. 収入・支出・残高の計算
4. 月末締切処理`,
    tags: '{"subcategory":"subsidiary_ledger","pattern":"現金出納帳","accounts":["現金"],"keywords":["現金出納帳","補助簿","収支管理"],"examSection":2}',
  },
  Q_L_012: {
    question: `【当座預金出納帳記入問題】

2025年7月の当座預金出納帳を作成してください。

【前月繰越】
850,000円

【当月の取引】
7月 2日: 売掛金入金 250,000円
7月 5日: 小切手振出（仕入代金） 180,000円
7月 8日: 手形決済 150,000円
7月12日: 売上代金入金 320,000円
7月15日: 給料振込 280,000円
7月20日: 買掛金支払（小切手） 95,000円
7月24日: 家賃振込 85,000円
7月28日: 受取手形の取立入金 200,000円

【作成指示】
1. 日付順に記帳
2. 預入・引出・残高の管理
3. 小切手番号の記載
4. 月末残高の確定`,
    tags: '{"subcategory":"subsidiary_ledger","pattern":"当座預金出納帳","accounts":["当座預金"],"keywords":["当座預金出納帳","小切手","補助簿"],"examSection":2}',
  },
  Q_L_013: {
    question: `【普通預金出納帳記入問題】

2025年8月の普通預金出納帳を作成してください。

【前月繰越】
1,200,000円

【当月の取引】
8月 1日: 売上代金振込入金 450,000円
8月 5日: 仕入代金振込支払 280,000円
8月10日: 給料振込 350,000円
8月13日: 現金預入 100,000円
8月17日: 水道光熱費引落 28,000円
8月20日: 売掛金回収振込 180,000円
8月25日: 家賃引落 95,000円
8月30日: 利息入金 850円

【作成指示】
1. 日付順に記帳
2. 預入・払出・残高の管理
3. 振込・引落の区別
4. 月末残高の確定`,
    tags: '{"subcategory":"subsidiary_ledger","pattern":"預金出納帳","accounts":["普通預金"],"keywords":["普通預金出納帳","振込","引落"],"examSection":2}',
  },
  Q_L_014: {
    question: `【小口現金出納帳記入問題】

2025年9月の小口現金出納帳を作成してください。（定額資金前渡制度）

【基準額】
50,000円

【前月繰越】
50,000円

【当月の取引】
9月 3日: 文具購入 3,500円
9月 7日: 交通費支払 2,800円
9月10日: 収入印紙購入 4,000円
9月14日: 郵便切手購入 2,400円
9月18日: 新聞代支払 3,800円
9月22日: 来客用茶菓代 1,500円
9月25日: 事務用品購入 5,200円
9月28日: 雑費支払 2,300円
9月30日: 補給額受入 25,500円

【作成指示】
1. 定額資金前渡制度による記帳
2. 支払内訳の分類
3. 月末補給額の計算
4. 残高管理`,
    tags: '{"subcategory":"subsidiary_ledger","pattern":"小口現金出納帳","accounts":["小口現金"],"keywords":["小口現金出納帳","定額資金前渡","補給"],"examSection":2}',
  },
};

// 修正実行
for (const [id, fixData] of Object.entries(fixes)) {
  console.log(`\n🔍 ${id} 修正中...`);

  // 問題文の修正
  const questionPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?question_text:\\s*)"[^"]*"`,
    "s",
  );

  if (content.match(questionPattern)) {
    content = content.replace(
      questionPattern,
      `$1"${fixData.question.replace(/\n/g, "\\n")}"`,
    );
    fixLog.push(`✅ ${id}: 問題文に具体的取引データを追加`);
  }

  // タグの修正
  const tagsPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?tags_json:\\s*')([^']*)'`,
    "s",
  );

  if (content.match(tagsPattern)) {
    content = content.replace(tagsPattern, `$1${fixData.tags}'`);
    fixLog.push(`✅ ${id}: タグを適切に修正`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

// 修正結果のサマリー
console.log("\n📊 パターン2残り修正結果サマリー");
console.log("=" + "=".repeat(40));
fixLog.forEach((log) => console.log(log));

console.log("\n✅ パターン2（Q_L_011-Q_L_014）の修正完了");
console.log("📝 次のステップ: パターン3の確認");
