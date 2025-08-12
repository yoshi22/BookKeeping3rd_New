const fs = require("fs");
const path = require("path");

console.log("🔧 パターン3・4の包括チェックと修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

const fixLog = [];

// パターン3：伝票記入問題（Q_L_021-Q_L_030）のチェック
console.log("📌 パターン3：伝票記入問題のチェック\n");

const pattern3Ids = [
  "Q_L_021",
  "Q_L_022",
  "Q_L_023",
  "Q_L_024",
  "Q_L_025",
  "Q_L_026",
  "Q_L_027",
  "Q_L_028",
  "Q_L_029",
  "Q_L_030",
];

const pattern3Fixes = {};

for (const id of pattern3Ids) {
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  if (questionMatch) {
    const questionText = questionMatch[1];
    console.log(`${id}: ${questionText.length}文字`);

    // 具体的取引データの不足チェック
    if (
      questionText.includes("詳細は問題文参照") ||
      questionText.includes("別途") ||
      (!questionText.includes("【取引データ】") &&
        !questionText.includes("月日:") &&
        !questionText.includes("取引:"))
    ) {
      console.log(`⚠️ ${id}: 具体的取引データ不足`);

      // 修正データを生成
      const num = parseInt(id.split("_")[2]);
      if (num >= 21 && num <= 26) {
        // 3伝票制
        pattern3Fixes[id] = {
          question: `【3伝票制記入問題】

2025年${num - 20}月の取引について、3伝票制で記入してください。

【取引データ】
${num - 20}月 5日: 商品を掛けで仕入れた 120,000円
${num - 20}月10日: 商品を現金で売り上げた 85,000円
${num - 20}月15日: 売掛金を現金で回収した 95,000円
${num - 20}月20日: 買掛金を小切手で支払った 110,000円
${num - 20}月25日: 備品を掛けで購入した 45,000円

【作成指示】
・入金伝票、出金伝票、振替伝票の適切な使い分け
・各伝票の記入要領に従った作成
・伝票番号の連番管理`,
          tags: '{"subcategory":"voucher_entry","pattern":"3伝票制","accounts":["現金","売掛金","買掛金"],"keywords":["3伝票制","入金伝票","出金伝票","振替伝票"],"examSection":2}',
        };
      } else {
        // 5伝票制
        pattern3Fixes[id] = {
          question: `【5伝票制記入問題】

2025年${num - 26}月の取引について、5伝票制で記入してください。

【取引データ】
${num - 26}月 3日: 商品を掛けで仕入れた 150,000円
${num - 26}月 8日: 商品を掛けで売り上げた 200,000円
${num - 26}月12日: 商品を現金で仕入れた 65,000円
${num - 26}月18日: 商品を現金で売り上げた 95,000円
${num - 26}月24日: 給料を現金で支払った 180,000円

【作成指示】
・入金伝票、出金伝票、売上伝票、仕入伝票、振替伝票の使い分け
・各伝票の記入要領に従った作成
・伝票番号の連番管理`,
          tags: '{"subcategory":"voucher_entry","pattern":"5伝票制","accounts":["現金","売掛金","買掛金","売上","仕入"],"keywords":["5伝票制","売上伝票","仕入伝票"],"examSection":2}',
        };
      }
    } else {
      console.log(`✅ ${id}: 問題文適切`);
    }
  }
}

// パターン4：理論・選択問題（Q_L_031-Q_L_040）のチェック
console.log("\n📌 パターン4：理論・選択問題のチェック\n");

const pattern4Ids = [
  "Q_L_031",
  "Q_L_032",
  "Q_L_033",
  "Q_L_034",
  "Q_L_035",
  "Q_L_036",
  "Q_L_037",
  "Q_L_038",
  "Q_L_039",
  "Q_L_040",
];

const pattern4Fixes = {};

for (const id of pattern4Ids) {
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  if (questionMatch) {
    const questionText = questionMatch[1];
    console.log(`${id}: ${questionText.length}文字`);

    // 理論問題は具体的な選択肢が必要
    if (questionText.length < 150 || !questionText.includes("次の")) {
      console.log(`⚠️ ${id}: 問題文が不十分`);

      const num = parseInt(id.split("_")[2]);
      if (num >= 31 && num <= 34) {
        // 帳簿組織
        pattern4Fixes[id] = {
          question: `【帳簿組織に関する理論問題】

次の記述のうち、正しいものを選びなさい。

1. 主要簿とは、仕訳帳と総勘定元帳のことをいう
2. 補助簿は必ず作成しなければならない法定帳簿である
3. 仕訳帳は取引を勘定科目別に記録する帳簿である
4. 総勘定元帳は取引を発生順に記録する帳簿である

【解答形式】
正しい選択肢の番号を選択してください。`,
          tags: '{"subcategory":"theory","pattern":"帳簿組織","accounts":[],"keywords":["主要簿","補助簿","仕訳帳","総勘定元帳"],"examSection":2}',
        };
      } else if (num >= 35 && num <= 37) {
        // 簿記理論
        pattern4Fixes[id] = {
          question: `【簿記の基本理論に関する問題】

次の記述のうち、誤っているものを選びなさい。

1. 借方は資産の増加、費用の発生を表す
2. 貸方は負債の増加、収益の発生を表す
3. 貸借対照表は一定期間の経営成績を表す
4. 損益計算書は一定期間の収益と費用を表す

【解答形式】
誤っている選択肢の番号を選択してください。`,
          tags: '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["借方貸方","貸借対照表","損益計算書"],"examSection":2}',
        };
      } else {
        // 試算表・決算
        pattern4Fixes[id] = {
          question: `【試算表に関する理論問題】

次の記述のうち、正しいものを選びなさい。

1. 合計試算表は各勘定の借方合計と貸方合計を記載する
2. 残高試算表は各勘定の残高のみを記載する
3. 合計残高試算表は合計と残高の両方を記載する
4. 試算表の借方合計と貸方合計は必ず一致する

【解答形式】
正しい選択肢をすべて選択してください（複数選択可）。`,
          tags: '{"subcategory":"theory","pattern":"試算表","accounts":[],"keywords":["合計試算表","残高試算表","貸借平均の原理"],"examSection":2}',
        };
      }
    } else {
      console.log(`✅ ${id}: 問題文適切`);
    }
  }
}

// 修正実行
console.log("\n📝 修正実行中...\n");

// パターン3の修正
for (const [id, fixData] of Object.entries(pattern3Fixes)) {
  const questionPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?question_text:\\s*)"[^"]*"`,
    "s",
  );

  if (content.match(questionPattern)) {
    content = content.replace(
      questionPattern,
      `$1"${fixData.question.replace(/\n/g, "\\n")}"`,
    );
    fixLog.push(`✅ ${id}: 問題文修正完了`);
  }

  const tagsPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?tags_json:\\s*')([^']*)'`,
    "s",
  );

  if (content.match(tagsPattern)) {
    content = content.replace(tagsPattern, `$1${fixData.tags}'`);
    fixLog.push(`✅ ${id}: タグ修正完了`);
  }
}

// パターン4の修正
for (const [id, fixData] of Object.entries(pattern4Fixes)) {
  const questionPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?question_text:\\s*)"[^"]*"`,
    "s",
  );

  if (content.match(questionPattern)) {
    content = content.replace(
      questionPattern,
      `$1"${fixData.question.replace(/\n/g, "\\n")}"`,
    );
    fixLog.push(`✅ ${id}: 問題文修正完了`);
  }

  const tagsPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?tags_json:\\s*')([^']*)'`,
    "s",
  );

  if (content.match(tagsPattern)) {
    content = content.replace(tagsPattern, `$1${fixData.tags}'`);
    fixLog.push(`✅ ${id}: タグ修正完了`);
  }
}

// ファイル保存
if (fixLog.length > 0) {
  console.log("💾 修正内容を保存中...");
  fs.writeFileSync(questionsPath, content);
}

// 修正結果のサマリー
console.log("\n📊 パターン3・4修正結果サマリー");
console.log("=" + "=".repeat(40));
if (fixLog.length > 0) {
  fixLog.forEach((log) => console.log(log));
} else {
  console.log("✅ 修正が必要な問題はありませんでした");
}

console.log("\n✅ パターン3・4のチェックと修正完了");
console.log("📝 次のステップ: 最終検証");
