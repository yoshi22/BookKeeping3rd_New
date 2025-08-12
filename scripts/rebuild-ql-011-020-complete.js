const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_011〜Q_L_020の完全再構築スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 帳簿記入問題の完全なデータ定義
const completeProblems = {
  Q_L_011: {
    title: "現金出納帳記入問題",
    month: "6月",
    previousBalance: 333931,
    questionText: `【現金出納帳記入問題】

2025年6月の現金出納帳を作成してください。

【前月繰越残高】
333,931円

【6月の取引】
6月3日　売上代金現金収入　125,000円
6月7日　旅費交通費支払い　18,500円
6月12日　現金売上　87,400円
6月15日　事務用品購入　12,300円
6月20日　売掛金回収（現金）　156,800円
6月25日　給料支払い　280,000円
6月28日　雑収入（現金）　25,600円

【作成指示】
1. 日付順に記帳
2. 摘要欄の適切な記入
3. 収入・支出・残高の計算
4. 月末締切処理`,
    transactions: [
      { date: "6/1", description: "前月繰越", debit: 333931, credit: 0 },
      { date: "6/3", description: "売上代金", debit: 125000, credit: 0 },
      { date: "6/7", description: "旅費交通費", debit: 0, credit: 18500 },
      { date: "6/12", description: "現金売上", debit: 87400, credit: 0 },
      { date: "6/15", description: "事務用品", debit: 0, credit: 12300 },
      { date: "6/20", description: "売掛金回収", debit: 156800, credit: 0 },
      { date: "6/25", description: "給料支払い", debit: 0, credit: 280000 },
      { date: "6/28", description: "雑収入", debit: 25600, credit: 0 },
    ],
  },

  Q_L_012: {
    title: "当座預金出納帳記入問題",
    month: "3月",
    previousBalance: 455377,
    questionText: `【当座預金出納帳記入問題】

2025年3月の当座預金出納帳を作成してください。

【前月繰越残高】
455,377円

【3月の取引】
3月5日　売掛金回収（小切手）　234,500円
3月8日　買掛金支払い（小切手振出）　187,300円
3月12日　借入金返済（小切手振出）　150,000円
3月18日　売上代金（小切手受取）　298,400円
3月22日　水道光熱費支払い（小切手振出）　45,600円
3月26日　受取手形取立て（当座預金入金）　178,900円

【作成指示】
1. 日付順に記帳
2. 摘要欄の適切な記入
3. 預入・引出・残高の計算
4. 月末締切処理`,
    transactions: [
      { date: "3/1", description: "前月繰越", debit: 455377, credit: 0 },
      { date: "3/5", description: "売掛金回収", debit: 234500, credit: 0 },
      { date: "3/8", description: "買掛金支払い", debit: 0, credit: 187300 },
      { date: "3/12", description: "借入金返済", debit: 0, credit: 150000 },
      { date: "3/18", description: "売上代金", debit: 298400, credit: 0 },
      { date: "3/22", description: "水道光熱費", debit: 0, credit: 45600 },
      { date: "3/26", description: "手形取立て", debit: 178900, credit: 0 },
    ],
  },

  Q_L_013: {
    title: "小口現金出納帳記入問題",
    month: "4月",
    previousBalance: 100326,
    questionText: `【小口現金出納帳記入問題】

2025年4月の小口現金出納帳を作成してください。

【前月繰越残高】
100,000円（4月1日に326円の不足を発見し、本社より補給）

【4月の取引】
4月3日　交通費　2,500円
4月5日　事務用品購入　8,400円
4月8日　通信費（郵券）　5,200円
4月12日　接待費　15,600円
4月15日　交通費　3,800円
4月18日　消耗品費　4,900円
4月20日　本社より補給　30,000円
4月25日　雑費　6,700円
4月28日　交通費　2,100円

【作成指示】
1. 日付順に記帳
2. 摘要欄の適切な記入
3. 補給・支払・残高の計算
4. 月末精算処理`,
    transactions: [
      { date: "4/1", description: "前月繰越", debit: 100000, credit: 0 },
      { date: "4/1", description: "不足補給", debit: 326, credit: 0 },
      { date: "4/3", description: "交通費", debit: 0, credit: 2500 },
      { date: "4/5", description: "事務用品", debit: 0, credit: 8400 },
      { date: "4/8", description: "通信費", debit: 0, credit: 5200 },
      { date: "4/12", description: "接待費", debit: 0, credit: 15600 },
      { date: "4/15", description: "交通費", debit: 0, credit: 3800 },
      { date: "4/18", description: "消耗品費", debit: 0, credit: 4900 },
      { date: "4/20", description: "本社補給", debit: 30000, credit: 0 },
      { date: "4/25", description: "雑費", debit: 0, credit: 6700 },
      { date: "4/28", description: "交通費", debit: 0, credit: 2100 },
    ],
  },

  Q_L_014: {
    title: "受取手形記入帳記入問題",
    month: "5月",
    questionText: `【受取手形記入帳記入問題】

2025年5月の受取手形記入帳を作成してください。

【5月の取引】
5月2日　A商事振出手形受取　金額200,000円　期日7月末日
5月8日　B会社振出手形受取　金額150,000円　期日8月10日
5月15日　4月受取手形期日到来　120,000円　当座預金入金
5月18日　C商店振出手形受取　金額180,000円　期日9月末日
5月22日　B会社手形を銀行で割引　金額150,000円　割引料3,000円
5月28日　D商会振出手形受取　金額250,000円　期日10月15日

【作成指示】
1. 日付順に記帳
2. 振出人・期日・金額の管理
3. 割引・取立てに関する記録
4. 残高の確認`,
    transactions: [
      {
        date: "5/2",
        description: "A商事振出（期日7/末）",
        debit: 200000,
        credit: 0,
      },
      {
        date: "5/8",
        description: "B会社振出（期日8/10）",
        debit: 150000,
        credit: 0,
      },
      { date: "5/15", description: "手形期日取立て", debit: 0, credit: 120000 },
      {
        date: "5/18",
        description: "C商店振出（期日9/末）",
        debit: 180000,
        credit: 0,
      },
      { date: "5/22", description: "B会社手形割引", debit: 0, credit: 150000 },
      {
        date: "5/28",
        description: "D商会振出（期日10/15）",
        debit: 250000,
        credit: 0,
      },
    ],
  },

  Q_L_015: {
    title: "仕入帳記入問題",
    month: "9月",
    questionText: `【仕入帳記入問題】

2025年9月の仕入帳を作成してください。

【9月の取引】
9月3日　X商事より商品A　100個×@1,200円＝120,000円（掛け）
9月7日　Y会社より商品B　80個×@2,500円＝200,000円（現金）
9月12日　Z商店より商品C　150個×@800円＝120,000円（手形）
9月16日　X商事より商品A　50個×@1,250円＝62,500円（掛け）
9月22日　W商会より商品D　200個×@600円＝120,000円（掛け）
9月28日　Y会社より商品B　60個×@2,600円＝156,000円（現金）

【作成指示】
1. 日付・仕入先・品名・数量・単価・金額の記録
2. 決済条件の記載
3. 月末合計の算出
4. 仕入先別集計`,
    transactions: [
      {
        date: "9/3",
        description: "X商事（商品A・100個・掛け）",
        debit: 120000,
        credit: 0,
      },
      {
        date: "9/7",
        description: "Y会社（商品B・80個・現金）",
        debit: 200000,
        credit: 0,
      },
      {
        date: "9/12",
        description: "Z商店（商品C・150個・手形）",
        debit: 120000,
        credit: 0,
      },
      {
        date: "9/16",
        description: "X商事（商品A・50個・掛け）",
        debit: 62500,
        credit: 0,
      },
      {
        date: "9/22",
        description: "W商会（商品D・200個・掛け）",
        debit: 120000,
        credit: 0,
      },
      {
        date: "9/28",
        description: "Y会社（商品B・60個・現金）",
        debit: 156000,
        credit: 0,
      },
    ],
  },
};

// 残りの問題（Q_L_016-Q_L_020）も同様に定義
const additionalProblems = {
  Q_L_016: {
    title: "売上帳記入問題",
    month: "2月",
    questionText: `【売上帳記入問題】

2025年2月の売上帳を作成してください。

【2月の取引】
2月2日　甲商店へ商品A　50個×@3,000円＝150,000円（掛け）
2月6日　乙会社へ商品B　30個×@5,000円＝150,000円（現金）
2月10日　丙商事へ商品C　100個×@1,800円＝180,000円（手形）
2月15日　甲商店へ商品A　80個×@2,900円＝232,000円（掛け）
2月20日　丁会社へ商品D　40個×@4,500円＝180,000円（掛け）
2月25日　乙会社へ商品B　25個×@5,200円＝130,000円（現金）

【作成指示】
1. 日付・得意先・品名・数量・単価・金額の記録
2. 決済条件の記載
3. 月末合計の算出
4. 得意先別集計`,
    transactions: [
      {
        date: "2/2",
        description: "甲商店（商品A・50個・掛け）",
        debit: 150000,
        credit: 0,
      },
      {
        date: "2/6",
        description: "乙会社（商品B・30個・現金）",
        debit: 150000,
        credit: 0,
      },
      {
        date: "2/10",
        description: "丙商事（商品C・100個・手形）",
        debit: 180000,
        credit: 0,
      },
      {
        date: "2/15",
        description: "甲商店（商品A・80個・掛け）",
        debit: 232000,
        credit: 0,
      },
      {
        date: "2/20",
        description: "丁会社（商品D・40個・掛け）",
        debit: 180000,
        credit: 0,
      },
      {
        date: "2/25",
        description: "乙会社（商品B・25個・現金）",
        debit: 130000,
        credit: 0,
      },
    ],
  },

  Q_L_017: {
    title: "商品有高帳（先入先出法）記入問題",
    month: "10月",
    questionText: `【商品有高帳（先入先出法）記入問題】

商品「電子部品A」の2025年10月分商品有高帳を先入先出法で作成してください。

【前月繰越】
数量：100個　単価：@1,000円　金額：100,000円

【10月の取引】
10月3日　仕入　200個　@1,100円　220,000円
10月8日　売上　150個　
10月15日　仕入　150個　@1,200円　180,000円
10月20日　売上　180個　
10月28日　仕入　100個　@1,150円　115,000円

【作成指示】
1. 先入先出法による払出単価の計算
2. 受入・払出・残高数量の管理
3. 各取引後の平均単価算出
4. 月末在庫の評価`,
    transactions: [
      {
        date: "10/1",
        description: "前月繰越（100個・@1,000）",
        debit: 100000,
        credit: 0,
      },
      {
        date: "10/3",
        description: "仕入（200個・@1,100）",
        debit: 220000,
        credit: 0,
      },
      {
        date: "10/8",
        description: "売上（150個・先入先出）",
        debit: 0,
        credit: 155000,
      },
      {
        date: "10/15",
        description: "仕入（150個・@1,200）",
        debit: 180000,
        credit: 0,
      },
      {
        date: "10/20",
        description: "売上（180個・先入先出）",
        debit: 0,
        credit: 197000,
      },
      {
        date: "10/28",
        description: "仕入（100個・@1,150）",
        debit: 115000,
        credit: 0,
      },
    ],
  },

  Q_L_018: {
    title: "商品有高帳（移動平均法）記入問題",
    month: "6月",
    questionText: `【商品有高帳（移動平均法）記入問題】

商品「事務用品セット」の2025年6月分商品有高帳を移動平均法で作成してください。

【前月繰越】
数量：80個　単価：@2,500円　金額：200,000円

【6月の取引】
6月5日　仕入　120個　@2,600円　312,000円
6月12日　売上　100個　
6月18日　仕入　100個　@2,700円　270,000円
6月25日　売上　90個　
6月30日　仕入　80個　@2,550円　204,000円

【作成指示】
1. 移動平均法による払出単価の計算
2. 受入・払出・残高数量の管理
3. 各取引後の平均単価算出
4. 月末在庫の評価`,
    transactions: [
      {
        date: "6/1",
        description: "前月繰越（80個・@2,500）",
        debit: 200000,
        credit: 0,
      },
      {
        date: "6/5",
        description: "仕入（120個・@2,600）",
        debit: 312000,
        credit: 0,
      },
      {
        date: "6/12",
        description: "売上（100個・@2,560）",
        debit: 0,
        credit: 256000,
      },
      {
        date: "6/18",
        description: "仕入（100個・@2,700）",
        debit: 270000,
        credit: 0,
      },
      {
        date: "6/25",
        description: "売上（90個・@2,628）",
        debit: 0,
        credit: 236520,
      },
      {
        date: "6/30",
        description: "仕入（80個・@2,550）",
        debit: 204000,
        credit: 0,
      },
    ],
  },

  Q_L_019: {
    title: "売掛金元帳記入問題",
    month: "2月",
    questionText: `【売掛金元帳記入問題】

得意先「田中商店」の2025年2月分売掛金元帳を作成してください。

【前月繰越残高】
150,000円

【2月の取引】
2月3日　商品売上　280,000円
2月8日　現金回収　150,000円（前月分）
2月15日　商品売上　220,000円
2月18日　手形受取　200,000円
2月25日　商品売上　180,000円
2月28日　現金回収　280,000円（2月3日分）

【作成指示】
1. 得意先別の売掛金管理
2. 発生・回収の記録
3. 回収条件の管理
4. 残高の確認と照合`,
    transactions: [
      { date: "2/1", description: "前月繰越", debit: 150000, credit: 0 },
      { date: "2/3", description: "商品売上", debit: 280000, credit: 0 },
      { date: "2/8", description: "現金回収", debit: 0, credit: 150000 },
      { date: "2/15", description: "商品売上", debit: 220000, credit: 0 },
      { date: "2/18", description: "手形受取", debit: 0, credit: 200000 },
      { date: "2/25", description: "商品売上", debit: 180000, credit: 0 },
      { date: "2/28", description: "現金回収", debit: 0, credit: 280000 },
    ],
  },

  Q_L_020: {
    title: "支払手形記入帳記入問題",
    month: "1月",
    questionText: `【支払手形記入帳記入問題】

2025年1月の支払手形記入帳を作成してください。

【1月の取引】
1月5日　P商事への買掛金決済　手形振出　150,000円　期日4月末日
1月10日　Q会社への買掛金決済　手形振出　200,000円　期日5月10日
1月15日　昨年振出手形期日到来　120,000円　当座預金より決済
1月20日　R商店への買掛金決済　手形振出　180,000円　期日6月末日
1月25日　S会社への買掛金決済　手形振出　250,000円　期日7月15日
1月30日　昨年振出手形期日到来　100,000円　当座預金より決済

【作成指示】
1. 日付順に記帳
2. 支払先・期日・金額の管理
3. 期日到来による決済記録
4. 残高の確認`,
    transactions: [
      {
        date: "1/5",
        description: "P商事宛手形振出（期日4/末）",
        debit: 0,
        credit: 150000,
      },
      {
        date: "1/10",
        description: "Q会社宛手形振出（期日5/10）",
        debit: 0,
        credit: 200000,
      },
      { date: "1/15", description: "手形期日決済", debit: 120000, credit: 0 },
      {
        date: "1/20",
        description: "R商店宛手形振出（期日6/末）",
        debit: 0,
        credit: 180000,
      },
      {
        date: "1/25",
        description: "S会社宛手形振出（期日7/15）",
        debit: 0,
        credit: 250000,
      },
      { date: "1/30", description: "手形期日決済", debit: 100000, credit: 0 },
    ],
  },
};

// 問題データの生成
function generateCorrectAnswer(problemData) {
  let balance = problemData.previousBalance || 0;
  const entries = [];

  problemData.transactions.forEach((transaction) => {
    balance += transaction.debit - transaction.credit;
    entries.push({
      date: transaction.date,
      description: transaction.description,
      debit: transaction.debit,
      credit: transaction.credit,
      balance: balance,
    });
  });

  return { entries };
}

console.log("📊 Q_L_011〜Q_L_020の完全再構築開始:\n");

let questionsContent = fs.readFileSync(questionsPath, "utf8");

// バックアップ作成
const backupPath = questionsPath + ".backup-ql-rebuild-" + Date.now();
fs.writeFileSync(backupPath, questionsContent);
console.log(`バックアップ作成: ${backupPath}\n`);

// 各問題の修正処理
const allProblems = { ...completeProblems, ...additionalProblems };
let fixedCount = 0;

Object.keys(allProblems).forEach((problemId) => {
  const problemData = allProblems[problemId];

  console.log(`🔧 ${problemId}: ${problemData.title}の再構築中...`);

  // 正答データ生成
  const correctAnswer = generateCorrectAnswer(problemData);
  const correctAnswerJson = JSON.stringify(correctAnswer);

  console.log(`  対象月: ${problemData.month || "設定済み"}`);
  console.log(`  取引数: ${problemData.transactions.length}件`);
  console.log(
    `  最終残高: ${correctAnswer.entries[correctAnswer.entries.length - 1].balance.toLocaleString()}円`,
  );

  // 問題文の置換
  const questionRegex = new RegExp(
    `(id: "${problemId}",[\\s\\S]*?question_text:\\s*")([\\s\\S]*?)(",)`,
    "g",
  );

  if (questionsContent.match(questionRegex)) {
    questionsContent = questionsContent.replace(
      questionRegex,
      `$1${problemData.questionText}$3`,
    );
    console.log(`  ✅ ${problemId}の問題文を修正しました`);
  }

  // 正答データの置換
  const answerRegex = new RegExp(
    `(id: "${problemId}",[\\s\\S]*?correct_answer_json:\\s*')([^']*)(')`,
    "g",
  );

  if (questionsContent.match(answerRegex)) {
    questionsContent = questionsContent.replace(
      answerRegex,
      `$1${correctAnswerJson}$3`,
    );
    console.log(`  ✅ ${problemId}の正答データを修正しました`);
    fixedCount++;
  }

  console.log("");
});

// 修正版を保存
fs.writeFileSync(questionsPath, questionsContent);

console.log("🎯 修正完了");
console.log(`- 修正成功: ${fixedCount}問`);
console.log("- 全ての問題に具体的な取引内容を追加");
console.log("- 実際の月日と実在の日付を使用");
console.log("- 問題の種類に応じた適切な内容を設定");
console.log("- 帳簿記入に必要な全ての情報を提供");
