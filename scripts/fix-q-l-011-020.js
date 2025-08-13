const fs = require("fs");
const path = require("path");

// 第2問（Q_L_011〜Q_L_020）補助簿記入問題の修正スクリプト
const filePath = path.join(__dirname, "../src/data/master-questions.ts");

const corrections = [
  {
    id: "Q_L_011",
    correct_answer_json: JSON.stringify({
      cashBookEntries: [
        {
          date: "6月1日",
          description: "前月繰越",
          receipt: null,
          payment: null,
          balance: 333931,
        },
        {
          date: "6月5日",
          description: "売掛金回収",
          receipt: 125500,
          payment: null,
          balance: 459431,
        },
        {
          date: "6月8日",
          description: "現金売上",
          receipt: 87300,
          payment: null,
          balance: 546731,
        },
        {
          date: "6月12日",
          description: "仕入支払",
          receipt: null,
          payment: 156200,
          balance: 390531,
        },
        {
          date: "6月18日",
          description: "給料支払",
          receipt: null,
          payment: 95000,
          balance: 295531,
        },
        {
          date: "6月25日",
          description: "経費支払",
          receipt: null,
          payment: 35800,
          balance: 259731,
        },
        {
          date: "6月30日",
          description: "次月繰越",
          receipt: null,
          payment: null,
          balance: 259731,
        },
      ],
      totalReceipts: 212800,
      totalPayments: 287000,
      finalBalance: 259731,
    }),
    explanation:
      "【現金出納帳記入のポイント】\\n1. 日付順に収入・支出を記帳\\n2. 各取引後の残高を計算\\n3. 摘要欄には取引内容を明記\\n4. 月末に締切処理を実施\\n\\n【計算】\\n前月繰越 333,931円\\n＋収入合計 212,800円\\n－支出合計 287,000円\\n＝次月繰越 259,731円",
  },
  {
    id: "Q_L_012",
    correct_answer_json: JSON.stringify({
      bankBookEntries: [
        {
          date: "3月1日",
          description: "前月繰越",
          deposit: null,
          withdrawal: null,
          balance: 455377,
        },
        {
          date: "3月3日",
          description: "売上代金振込",
          deposit: 250000,
          withdrawal: null,
          balance: 705377,
        },
        {
          date: "3月10日",
          description: "小切手振出",
          deposit: null,
          withdrawal: 180000,
          balance: 525377,
        },
        {
          date: "3月15日",
          description: "手形取立",
          deposit: 95000,
          withdrawal: null,
          balance: 620377,
        },
        {
          date: "3月20日",
          description: "買掛金支払",
          deposit: null,
          withdrawal: 210000,
          balance: 410377,
        },
        {
          date: "3月28日",
          description: "経費引落",
          deposit: null,
          withdrawal: 45000,
          balance: 365377,
        },
        {
          date: "3月31日",
          description: "次月繰越",
          deposit: null,
          withdrawal: null,
          balance: 365377,
        },
      ],
      totalDeposits: 345000,
      totalWithdrawals: 435000,
      finalBalance: 365377,
    }),
    explanation:
      "【当座預金出納帳記入のポイント】\\n1. 預入と引出を区別して記帳\\n2. 小切手振出は引出として記録\\n3. 手形取立は預入として記録\\n4. 残高管理を正確に実施\\n\\n【計算】\\n前月繰越 455,377円\\n＋預入合計 345,000円\\n－引出合計 435,000円\\n＝次月繰越 365,377円",
  },
  {
    id: "Q_L_013",
    correct_answer_json: JSON.stringify({
      pettyCashEntries: [
        {
          date: "4月1日",
          description: "前月繰越",
          supplement: null,
          payment: null,
          balance: 100326,
        },
        {
          date: "4月5日",
          description: "補給",
          supplement: 50000,
          payment: null,
          balance: 150326,
        },
        {
          date: "4月8日",
          description: "交通費",
          supplement: null,
          payment: 3500,
          balance: 146826,
        },
        {
          date: "4月12日",
          description: "消耗品費",
          supplement: null,
          payment: 8200,
          balance: 138626,
        },
        {
          date: "4月18日",
          description: "通信費",
          supplement: null,
          payment: 2800,
          balance: 135826,
        },
        {
          date: "4月25日",
          description: "雑費",
          supplement: null,
          payment: 1500,
          balance: 134326,
        },
        {
          date: "4月30日",
          description: "補給",
          supplement: 16000,
          payment: null,
          balance: 150326,
        },
        {
          date: "4月30日",
          description: "次月繰越",
          supplement: null,
          payment: null,
          balance: 150326,
        },
      ],
      totalSupplements: 66000,
      totalPayments: 16000,
      finalBalance: 150326,
    }),
    explanation:
      "【小口現金出納帳記入のポイント】\\n1. 定額資金前渡制度の理解\\n2. 補給は使用分を補充\\n3. 小額経費の支払記録\\n4. 月末に定額まで補給\\n\\n【計算】\\n前月繰越 100,326円\\n＋補給合計 66,000円\\n－支払合計 16,000円\\n＝次月繰越 150,326円",
  },
  {
    id: "Q_L_014",
    correct_answer_json: JSON.stringify({
      savingsBookEntries: [
        {
          date: "2月1日",
          description: "前月繰越",
          deposit: null,
          withdrawal: null,
          balance: 408537,
        },
        {
          date: "2月5日",
          description: "定期預入",
          deposit: 100000,
          withdrawal: null,
          balance: 508537,
        },
        {
          date: "2月10日",
          description: "売上代金預入",
          deposit: 85000,
          withdrawal: null,
          balance: 593537,
        },
        {
          date: "2月15日",
          description: "経費支払",
          deposit: null,
          withdrawal: 120000,
          balance: 473537,
        },
        {
          date: "2月20日",
          description: "給料振込",
          deposit: null,
          withdrawal: 95000,
          balance: 378537,
        },
        {
          date: "2月28日",
          description: "利息",
          deposit: 63,
          withdrawal: null,
          balance: 378600,
        },
        {
          date: "2月28日",
          description: "次月繰越",
          deposit: null,
          withdrawal: null,
          balance: 378600,
        },
      ],
      totalDeposits: 185063,
      totalWithdrawals: 215000,
      finalBalance: 378600,
    }),
    explanation:
      "【普通預金通帳記入のポイント】\\n1. 預入と払出を区別\\n2. 振込・引落の記録\\n3. 利息の計上処理\\n4. 通帳残高の管理\\n\\n【計算】\\n前月繰越 408,537円\\n＋預入合計 185,063円\\n－払出合計 215,000円\\n＝次月繰越 378,600円",
  },
  {
    id: "Q_L_015",
    correct_answer_json: JSON.stringify({
      purchaseBookEntries: [
        {
          date: "9月3日",
          supplier: "A商店",
          product: "商品A",
          quantity: 100,
          unitPrice: 1200,
          amount: 120000,
        },
        {
          date: "9月8日",
          supplier: "B商店",
          product: "商品B",
          quantity: 80,
          unitPrice: 1500,
          amount: 120000,
        },
        {
          date: "9月15日",
          supplier: "C商店",
          product: "商品A",
          quantity: 120,
          unitPrice: 1180,
          amount: 141600,
        },
        {
          date: "9月22日",
          supplier: "A商店",
          product: "商品C",
          quantity: 50,
          unitPrice: 2000,
          amount: 100000,
        },
        {
          date: "9月28日",
          supplier: "D商店",
          product: "商品B",
          quantity: 60,
          unitPrice: 1480,
          amount: 88800,
        },
      ],
      totalPurchases: 570400,
      suppliersCount: 4,
      productsCount: 3,
    }),
    explanation:
      "【仕入帳記入のポイント】\\n1. 日付・仕入先・品名を記録\\n2. 数量×単価＝金額を計算\\n3. 仕入先別の管理\\n4. 商品別の数量管理\\n\\n【集計】\\n仕入合計：570,400円\\n仕入先数：4社\\n商品種類：3種類",
  },
  {
    id: "Q_L_016",
    correct_answer_json: JSON.stringify({
      salesBookEntries: [
        {
          date: "2月2日",
          customer: "甲社",
          product: "製品X",
          quantity: 50,
          unitPrice: 3000,
          amount: 150000,
        },
        {
          date: "2月8日",
          customer: "乙社",
          product: "製品Y",
          quantity: 30,
          unitPrice: 4500,
          amount: 135000,
        },
        {
          date: "2月15日",
          customer: "丙社",
          product: "製品X",
          quantity: 40,
          unitPrice: 2950,
          amount: 118000,
        },
        {
          date: "2月22日",
          customer: "甲社",
          product: "製品Z",
          quantity: 25,
          unitPrice: 5000,
          amount: 125000,
        },
        {
          date: "2月28日",
          customer: "丁社",
          product: "製品Y",
          quantity: 35,
          unitPrice: 4400,
          amount: 154000,
        },
      ],
      totalSales: 682000,
      customersCount: 4,
      productsCount: 3,
    }),
    explanation:
      "【売上帳記入のポイント】\\n1. 日付・得意先・品名を記録\\n2. 数量×単価＝金額を計算\\n3. 得意先別の売上管理\\n4. 製品別の販売管理\\n\\n【集計】\\n売上合計：682,000円\\n得意先数：4社\\n製品種類：3種類",
  },
  {
    id: "Q_L_017",
    correct_answer_json: JSON.stringify({
      inventoryCardFIFO: [
        {
          date: "10月1日",
          description: "前月繰越",
          received: { quantity: 100, unitPrice: 1000, amount: 100000 },
          issued: null,
          balance: { quantity: 100, amount: 100000 },
        },
        {
          date: "10月5日",
          description: "仕入",
          received: { quantity: 150, unitPrice: 1100, amount: 165000 },
          issued: null,
          balance: { quantity: 250, amount: 265000 },
        },
        {
          date: "10月10日",
          description: "売上",
          received: null,
          issued: { quantity: 80, amount: 80000 },
          balance: { quantity: 170, amount: 185000 },
        },
        {
          date: "10月18日",
          description: "仕入",
          received: { quantity: 100, unitPrice: 1050, amount: 105000 },
          issued: null,
          balance: { quantity: 270, amount: 290000 },
        },
        {
          date: "10月25日",
          description: "売上",
          received: null,
          issued: { quantity: 120, amount: 128000 },
          balance: { quantity: 150, amount: 162000 },
        },
        {
          date: "10月31日",
          description: "次月繰越",
          received: null,
          issued: null,
          balance: { quantity: 150, amount: 162000 },
        },
      ],
      costOfGoodsSold: 208000,
      endingInventory: 162000,
      method: "先入先出法（FIFO）",
    }),
    explanation:
      "【商品有高帳（先入先出法）記入のポイント】\\n1. 先に仕入れた商品から払出\\n2. 単価別に在庫を管理\\n3. 払出時は古い単価から順に\\n4. 期末在庫は新しい仕入分\\n\\n【計算】\\n売上原価：208,000円\\n期末在庫：162,000円（@1,050×100個＋@1,100×50個）",
  },
  {
    id: "Q_L_018",
    correct_answer_json: JSON.stringify({
      inventoryCardAverage: [
        {
          date: "6月1日",
          description: "前月繰越",
          received: { quantity: 200, unitPrice: 2000, amount: 400000 },
          issued: null,
          balance: { quantity: 200, unitPrice: 2000, amount: 400000 },
        },
        {
          date: "6月5日",
          description: "仕入",
          received: { quantity: 300, unitPrice: 2100, amount: 630000 },
          issued: null,
          balance: { quantity: 500, unitPrice: 2060, amount: 1030000 },
        },
        {
          date: "6月10日",
          description: "売上",
          received: null,
          issued: { quantity: 150, unitPrice: 2060, amount: 309000 },
          balance: { quantity: 350, unitPrice: 2060, amount: 721000 },
        },
        {
          date: "6月18日",
          description: "仕入",
          received: { quantity: 200, unitPrice: 2050, amount: 410000 },
          issued: null,
          balance: { quantity: 550, unitPrice: 2056, amount: 1131000 },
        },
        {
          date: "6月25日",
          description: "売上",
          received: null,
          issued: { quantity: 250, unitPrice: 2056, amount: 514000 },
          balance: { quantity: 300, unitPrice: 2056, amount: 617000 },
        },
        {
          date: "6月30日",
          description: "次月繰越",
          received: null,
          issued: null,
          balance: { quantity: 300, unitPrice: 2056, amount: 617000 },
        },
      ],
      costOfGoodsSold: 823000,
      endingInventory: 617000,
      method: "移動平均法",
    }),
    explanation:
      "【商品有高帳（移動平均法）記入のポイント】\\n1. 仕入の都度、平均単価を計算\\n2. 平均単価＝総額÷総数量\\n3. 払出は平均単価で計算\\n4. 単価は小数点以下切捨て\\n\\n【計算】\\n売上原価：823,000円\\n期末在庫：617,000円（@2,056×300個）",
  },
  {
    id: "Q_L_019",
    correct_answer_json: JSON.stringify({
      accountsReceivableSubsidiary: [
        {
          customer: "A社",
          beginBalance: 250000,
          sales: 180000,
          collections: 200000,
          endBalance: 230000,
        },
        {
          customer: "B社",
          beginBalance: 180000,
          sales: 150000,
          collections: 170000,
          endBalance: 160000,
        },
        {
          customer: "C社",
          beginBalance: 95000,
          sales: 120000,
          collections: 100000,
          endBalance: 115000,
        },
      ],
      accountsPayableSubsidiary: [
        {
          supplier: "X商店",
          beginBalance: 180000,
          purchases: 200000,
          payments: 210000,
          endBalance: 170000,
        },
        {
          supplier: "Y商店",
          beginBalance: 120000,
          purchases: 150000,
          payments: 140000,
          endBalance: 130000,
        },
        {
          supplier: "Z商店",
          beginBalance: 85000,
          purchases: 100000,
          payments: 95000,
          endBalance: 90000,
        },
      ],
      totalReceivables: 505000,
      totalPayables: 390000,
    }),
    explanation:
      "【売掛金・買掛金元帳記入のポイント】\\n1. 得意先・仕入先別に管理\\n2. 発生と回収・支払を記録\\n3. 残高を継続的に管理\\n4. 総勘定元帳と照合\\n\\n【残高】\\n売掛金合計：505,000円\\n買掛金合計：390,000円",
  },
  {
    id: "Q_L_020",
    correct_answer_json: JSON.stringify({
      notesReceivableRegister: [
        {
          date: "1月5日",
          drawer: "甲社",
          amount: 150000,
          dueDate: "3月5日",
          status: "保有中",
        },
        {
          date: "1月12日",
          drawer: "乙社",
          amount: 200000,
          dueDate: "3月12日",
          status: "割引済",
        },
        {
          date: "1月20日",
          drawer: "丙社",
          amount: 180000,
          dueDate: "4月20日",
          status: "裏書済",
        },
        {
          date: "1月25日",
          drawer: "丁社",
          amount: 250000,
          dueDate: "4月25日",
          status: "保有中",
        },
      ],
      notesPayableRegister: [
        {
          date: "1月8日",
          payee: "A商店",
          amount: 180000,
          dueDate: "3月8日",
          status: "未決済",
        },
        {
          date: "1月15日",
          payee: "B商店",
          amount: 220000,
          dueDate: "3月15日",
          status: "未決済",
        },
        {
          date: "1月28日",
          payee: "C商店",
          amount: 195000,
          dueDate: "4月28日",
          status: "未決済",
        },
      ],
      totalReceivables: 780000,
      totalPayables: 595000,
      contingentLiabilities: 380000,
    }),
    explanation:
      "【受取・支払手形記入帳のポイント】\\n1. 手形の種類と期日を管理\\n2. 割引・裏書の記録\\n3. 偶発債務の把握\\n4. 期日管理の徹底\\n\\n【集計】\\n受取手形：780,000円\\n支払手形：595,000円\\n偶発債務：380,000円（割引・裏書分）",
  },
];

// ファイルを読み込み
let content = fs.readFileSync(filePath, "utf8");

// 各問題を修正
corrections.forEach((correction) => {
  // 正答データの修正
  const correctAnswerRegex = new RegExp(
    `(id: "${correction.id}"[\\s\\S]*?)correct_answer_json:\\s*'[^']*'`,
    "g",
  );
  content = content.replace(
    correctAnswerRegex,
    `$1correct_answer_json:\n      '${correction.correct_answer_json}'`,
  );

  // 解説の修正
  const explanationRegex = new RegExp(
    `(id: "${correction.id}"[\\s\\S]*?)explanation: "[^"]*"`,
    "g",
  );
  content = content.replace(
    explanationRegex,
    `$1explanation: "${correction.explanation}"`,
  );
});

// ファイルに書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log("✅ Q_L_011〜Q_L_020の修正が完了しました");
console.log("修正内容:");
console.log("- 正答データを補助簿記入形式に修正");
console.log("- 解説を詳細な内容に更新");
