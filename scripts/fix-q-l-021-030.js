const fs = require("fs");
const path = require("path");

// 第2問（Q_L_021〜Q_L_030）伝票記入問題の修正スクリプト
const filePath = path.join(__dirname, "../src/data/master-questions.ts");

const corrections = [
  {
    id: "Q_L_021",
    correct_answer_json: JSON.stringify({
      voucherType: "入金伝票",
      entries: [
        {
          date: "5月1日",
          account: "売掛金",
          amount: 319066,
          description: "売掛金回収",
        },
        {
          date: "5月20日",
          account: "売上",
          amount: 386900,
          description: "現金売上",
        },
        {
          date: "5月27日",
          account: "受取手形",
          amount: 627660,
          description: "手形決済",
        },
      ],
      totalAmount: 1333626,
      journalEntry: {
        debit: "現金 1,333,626",
        credit: "諸口 1,333,626",
      },
    }),
    explanation:
      "【入金伝票記入のポイント】\\n1. 現金が増加する取引を記録\\n2. 貸方は「現金」、借方は相手勘定\\n3. 複数の相手勘定は「諸口」と記載\\n4. 仕訳日計表への転記\\n\\n【仕訳】\\n(借)現金 1,333,626 / (貸)売掛金 319,066\\n　　　　　　　　　　　　売上 386,900\\n　　　　　　　　　　　　受取手形 627,660",
  },
  {
    id: "Q_L_022",
    correct_answer_json: JSON.stringify({
      voucherType: "出金伝票",
      entries: [
        {
          date: "2月8日",
          account: "仕入",
          amount: 666219,
          description: "現金仕入",
        },
        {
          date: "2月15日",
          account: "買掛金",
          amount: 572665,
          description: "買掛金支払",
        },
        {
          date: "2月24日",
          account: "経費",
          amount: 682448,
          description: "諸経費支払",
        },
      ],
      totalAmount: 1921332,
      journalEntry: {
        debit: "諸口 1,921,332",
        credit: "現金 1,921,332",
      },
    }),
    explanation:
      "【出金伝票記入のポイント】\\n1. 現金が減少する取引を記録\\n2. 借方は「現金」、貸方は相手勘定\\n3. 複数の相手勘定は「諸口」と記載\\n4. 仕訳日計表への転記\\n\\n【仕訳】\\n(借)仕入 666,219 / (貸)現金 1,921,332\\n　　買掛金 572,665\\n　　経費 682,448",
  },
  {
    id: "Q_L_023",
    correct_answer_json: JSON.stringify({
      voucherType: "振替伝票",
      entries: [
        {
          date: "8月3日",
          debit: { account: "売掛金", amount: 301530 },
          credit: { account: "売上", amount: 301530 },
          description: "掛売上",
        },
        {
          date: "8月7日",
          debit: { account: "仕入", amount: 280539 },
          credit: { account: "買掛金", amount: 280539 },
          description: "掛仕入",
        },
        {
          date: "8月12日",
          debit: { account: "買掛金", amount: 406302 },
          credit: { account: "支払手形", amount: 406302 },
          description: "手形振出",
        },
      ],
      totalDebit: 988371,
      totalCredit: 988371,
    }),
    explanation:
      "【振替伝票記入のポイント】\\n1. 現金が関わらない取引を記録\\n2. 借方・貸方を明確に記載\\n3. 貸借の一致を確認\\n4. 総勘定元帳への転記\\n\\n【取引内容】\\n・掛売上：売掛金/売上\\n・掛仕入：仕入/買掛金\\n・手形振出：買掛金/支払手形",
  },
  {
    id: "Q_L_024",
    correct_answer_json: JSON.stringify({
      voucherType: "振替伝票",
      entries: [
        {
          date: "9月11日",
          debit: { account: "仕入", amount: 151791 },
          credit: { account: "買掛金", amount: 151791 },
          description: "掛仕入",
        },
        {
          date: "9月24日",
          debit: { account: "売掛金", amount: 191383 },
          credit: { account: "売上", amount: 191383 },
          description: "掛売上",
        },
        {
          date: "9月27日",
          debit: { account: "買掛金", amount: 85665 },
          credit: { account: "売掛金", amount: 85665 },
          description: "相殺",
        },
      ],
      totalDebit: 428839,
      totalCredit: 428839,
    }),
    explanation:
      "【掛取引の振替伝票記入のポイント】\\n1. 掛売上：売掛金（借）/売上（貸）\\n2. 掛仕入：仕入（借）/買掛金（貸）\\n3. 相殺：買掛金（借）/売掛金（貸）\\n4. 貸借の一致を確認\\n\\n【注意点】\\n・信用取引は振替伝票に記載\\n・相殺取引も現金を介さない",
  },
  {
    id: "Q_L_025",
    correct_answer_json: JSON.stringify({
      cashVoucher: {
        type: "入金伝票",
        amount: 150000,
        account: "現金",
      },
      transferVoucher: {
        type: "振替伝票",
        debit: { account: "売掛金", amount: 102840 },
        credit: { account: "売上", amount: 102840 },
      },
      totalTransaction: 252840,
      splitMethod: "一部現金取引の分割記入",
      entries: [
        {
          date: "5月13日",
          description: "売上（現金150,000円、掛け102,840円）",
          total: 252840,
        },
        {
          date: "5月27日",
          description: "仕入（現金100,000円、掛け135,649円）",
          total: 235649,
        },
        {
          date: "5月28日",
          description: "売上（現金180,000円、掛け68,951円）",
          total: 248951,
        },
      ],
    }),
    explanation:
      "【一部現金取引の伝票分割のポイント】\\n1. 現金部分→入金/出金伝票\\n2. 掛け部分→振替伝票\\n3. 取引を2枚の伝票に分割\\n4. 合計額の一致を確認\\n\\n【分割方法】\\n取引総額＝現金部分＋掛け部分\\n例：売上252,840円＝現金150,000円＋掛け102,840円",
  },
  {
    id: "Q_L_026",
    correct_answer_json: JSON.stringify({
      dailySummary: {
        date: "11月30日",
        cashReceipts: {
          total: 450000,
          details: [
            { account: "売上", amount: 300000 },
            { account: "売掛金", amount: 150000 },
          ],
        },
        cashPayments: {
          total: 380000,
          details: [
            { account: "仕入", amount: 250000 },
            { account: "経費", amount: 130000 },
          ],
        },
        transfers: {
          total: 586461,
          details: [
            { debit: "仕入", credit: "買掛金", amount: 159981 },
            { debit: "売掛金", credit: "売上", amount: 300530 },
            { debit: "買掛金", credit: "支払手形", amount: 125950 },
          ],
        },
      },
      journalDaybook: {
        debitTotal: 1416461,
        creditTotal: 1416461,
      },
    }),
    explanation:
      "【3伝票から仕訳日計表への集計のポイント】\\n1. 入金伝票の合計を集計\\n2. 出金伝票の合計を集計\\n3. 振替伝票の内容を転記\\n4. 仕訳日計表で貸借一致を確認\\n\\n【集計手順】\\n・各伝票の日付別集計\\n・勘定科目別の合計\\n・総勘定元帳への転記準備",
  },
  {
    id: "Q_L_027",
    correct_answer_json: JSON.stringify({
      voucherType: "売上伝票",
      entries: [
        {
          date: "11月7日",
          customer: "A社",
          amount: 705035,
          paymentMethod: "掛け",
        },
        {
          date: "11月18日",
          customer: "B社",
          amount: 296150,
          paymentMethod: "現金",
        },
        {
          date: "11月22日",
          customer: "C社",
          amount: 526373,
          paymentMethod: "掛け",
        },
      ],
      totalSales: 1527558,
      salesBreakdown: {
        cash: 296150,
        credit: 1231408,
      },
      journalEntries: [
        { debit: "現金", credit: "売上", amount: 296150 },
        { debit: "売掛金", credit: "売上", amount: 1231408 },
      ],
    }),
    explanation:
      "【5伝票制の売上伝票記入のポイント】\\n1. 売上取引専用の伝票を使用\\n2. 現金売上と掛売上を区別\\n3. 得意先別に記録\\n4. 売上勘定への一括転記\\n\\n【5伝票制の特徴】\\n・売上伝票（売上専用）\\n・仕入伝票（仕入専用）\\n・入金、出金、振替伝票",
  },
  {
    id: "Q_L_028",
    correct_answer_json: JSON.stringify({
      voucherType: "仕入伝票",
      entries: [
        {
          date: "4月11日",
          supplier: "X商店",
          amount: 197758,
          paymentMethod: "掛け",
        },
        {
          date: "4月17日",
          supplier: "Y商店",
          amount: 178273,
          paymentMethod: "現金",
        },
        {
          date: "4月28日",
          supplier: "Z商店",
          amount: 155282,
          paymentMethod: "掛け",
        },
      ],
      totalPurchases: 531313,
      purchaseBreakdown: {
        cash: 178273,
        credit: 353040,
      },
      journalEntries: [
        { debit: "仕入", credit: "現金", amount: 178273 },
        { debit: "仕入", credit: "買掛金", amount: 353040 },
      ],
    }),
    explanation:
      "【5伝票制の仕入伝票記入のポイント】\\n1. 仕入取引専用の伝票を使用\\n2. 現金仕入と掛仕入を区別\\n3. 仕入先別に記録\\n4. 仕入勘定への一括転記\\n\\n【仕入伝票の活用】\\n・仕入取引の効率的記録\\n・仕入先管理の容易化\\n・仕入統計の作成",
  },
  {
    id: "Q_L_029",
    correct_answer_json: JSON.stringify({
      transactionClassification: [
        {
          date: "4月8日",
          transaction: "商品売上436,244円（現金）",
          voucher: "売上伝票",
          reason: "売上取引のため売上伝票使用",
        },
        {
          date: "4月25日",
          transaction: "商品仕入611,082円（掛け）",
          voucher: "仕入伝票",
          reason: "仕入取引のため仕入伝票使用",
        },
        {
          date: "4月25日",
          transaction: "売掛金回収739,173円（現金）",
          voucher: "入金伝票",
          reason: "現金収入のため入金伝票使用",
        },
      ],
      voucherSelection: {
        salesVoucher: "売上取引（現金・掛け問わず）",
        purchaseVoucher: "仕入取引（現金・掛け問わず）",
        receiptVoucher: "売上・仕入以外の現金収入",
        paymentVoucher: "売上・仕入以外の現金支出",
        transferVoucher: "現金が関わらない取引",
      },
    }),
    explanation:
      "【5伝票制での取引分類のポイント】\\n1. 売上→売上伝票（支払方法問わず）\\n2. 仕入→仕入伝票（支払方法問わず）\\n3. その他現金収入→入金伝票\\n4. その他現金支出→出金伝票\\n5. 現金以外→振替伝票\\n\\n【判定の優先順位】\\n取引内容（売上・仕入）＞支払方法",
  },
  {
    id: "Q_L_030",
    correct_answer_json: JSON.stringify({
      voucherSummary: {
        salesVoucher: {
          total: 605681,
          entries: [{ date: "8月8日", amount: 605681 }],
        },
        purchaseVoucher: {
          total: 700622,
          entries: [{ date: "8月8日", amount: 700622 }],
        },
        transferVoucher: {
          total: 764578,
          entries: [{ date: "8月4日", amount: 764578 }],
        },
      },
      generalLedgerPosting: [
        {
          account: "売上",
          debit: null,
          credit: 605681,
          source: "売上伝票",
        },
        {
          account: "仕入",
          debit: 700622,
          credit: null,
          source: "仕入伝票",
        },
        {
          account: "売掛金",
          debit: 605681,
          credit: null,
          source: "売上伝票（掛売上分）",
        },
        {
          account: "買掛金",
          debit: null,
          credit: 700622,
          source: "仕入伝票（掛仕入分）",
        },
      ],
      balanceCheck: {
        totalDebit: 1306303,
        totalCredit: 1306303,
        balanced: true,
      },
    }),
    explanation:
      "【5伝票から総勘定元帳への転記のポイント】\\n1. 各伝票の合計を集計\\n2. 勘定科目別に転記\\n3. 売上・仕入伝票は一括転記\\n4. 貸借の一致を確認\\n\\n【転記の流れ】\\n伝票→仕訳日計表→総勘定元帳\\n・正確性の確保\\n・効率的な記帳",
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

console.log("✅ Q_L_021〜Q_L_030の修正が完了しました");
console.log("修正内容:");
console.log("- 正答データを伝票記入形式に修正");
console.log("- 3伝票制と5伝票制の区別を明確化");
console.log("- 解説を詳細な内容に更新");
