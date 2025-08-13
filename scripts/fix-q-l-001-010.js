const fs = require("fs");
const path = require("path");

// 第2問（Q_L_001〜Q_L_010）勘定記入問題の修正スクリプト
const filePath = path.join(__dirname, "../src/data/master-questions.ts");

const corrections = [
  {
    id: "Q_L_001",
    correct_answer_json: JSON.stringify({
      ledgerEntries: [
        {
          date: "10月1日",
          description: "前月繰越",
          debit: 337541,
          credit: null,
          balance: 337541,
        },
        {
          date: "10月5日",
          description: "現金売上",
          debit: 276641,
          credit: null,
          balance: 614182,
        },
        {
          date: "10月10日",
          description: "給料支払",
          debit: null,
          credit: 215025,
          balance: 399157,
        },
        {
          date: "10月15日",
          description: "売掛金回収",
          debit: 184924,
          credit: null,
          balance: 584081,
        },
        {
          date: "10月20日",
          description: "買掛金支払",
          debit: null,
          credit: 241381,
          balance: 342700,
        },
        {
          date: "10月28日",
          description: "現金過不足",
          debit: null,
          credit: 8502,
          balance: 334198,
        },
      ],
      finalBalance: 334198,
      note: "現金実査により8,502円の不足が判明し、現金過不足として処理",
    }),
    explanation:
      "【現金勘定記入のポイント】\\n1. 現金の増加（売上・回収）は借方に記入\\n2. 現金の減少（支払）は貸方に記入\\n3. 各取引後の残高を都度計算\\n4. 現金過不足は実査時点で計上\\n\\n【計算過程】\\n前月繰越 337,541円\\n＋現金売上 276,641円\\n－給料支払 215,025円\\n＋売掛金回収 184,924円\\n－買掛金支払 241,381円\\n－現金過不足 8,502円\\n＝月末残高 334,198円",
  },
  {
    id: "Q_L_002",
    correct_answer_json: JSON.stringify({
      ledgerEntries: [
        {
          date: "1月1日",
          description: "前月繰越",
          debit: 564069,
          credit: null,
          balance: 564069,
        },
        {
          date: "1月3日",
          description: "掛売上",
          debit: 190909,
          credit: null,
          balance: 754978,
        },
        {
          date: "1月8日",
          description: "現金回収",
          debit: null,
          credit: 51829,
          balance: 703149,
        },
        {
          date: "1月15日",
          description: "掛売上",
          debit: 179338,
          credit: null,
          balance: 882487,
        },
        {
          date: "1月22日",
          description: "手形回収",
          debit: null,
          credit: 111922,
          balance: 770565,
        },
        {
          date: "1月28日",
          description: "貸倒引当金充当",
          debit: null,
          credit: 30000,
          balance: 740565,
        },
        {
          date: "1月28日",
          description: "貸倒損失",
          debit: null,
          credit: 5813,
          balance: 734752,
        },
      ],
      finalBalance: 734752,
      note: "貸倒れ35,813円のうち、貸倒引当金30,000円を充当し、不足分5,813円は貸倒損失として処理",
    }),
    explanation:
      "【売掛金勘定記入のポイント】\\n1. 売掛金の発生（掛売上）は借方に記入\\n2. 売掛金の回収（現金・手形）は貸方に記入\\n3. 貸倒れ発生時は貸倒引当金を優先充当\\n4. 引当金不足分は貸倒損失として処理\\n\\n【貸倒処理】\\n貸倒れ額 35,813円\\n－貸倒引当金充当 30,000円\\n＝貸倒損失 5,813円",
  },
  {
    id: "Q_L_003",
    correct_answer_json: JSON.stringify({
      journalEntries: [
        { account: "繰越商品", debit: 914556, credit: null },
        { account: "仕入", debit: null, credit: 914556 },
        { account: "仕入", debit: 1404670, credit: null },
        { account: "買掛金/現金", debit: null, credit: 1404670 },
        { account: "仕入", debit: 558925, credit: null },
        { account: "繰越商品", debit: null, credit: 558925 },
      ],
      costOfGoodsSold: 1760301,
      grossProfit: 65770,
      calculation:
        "売上原価 = 期首商品棚卸高914,556円 + 当期仕入高1,404,670円 - 期末商品棚卸高558,925円 = 1,760,301円",
    }),
    explanation:
      "【三分法による商品売買記帳のポイント】\\n1. 期首商品は仕入勘定へ振替（仕入/繰越商品）\\n2. 当期仕入は仕入勘定に計上\\n3. 期末商品は繰越商品勘定へ振替（繰越商品/仕入）\\n4. 売上原価＝期首＋仕入－期末\\n\\n【計算】\\n売上原価：1,760,301円\\n売上総利益：1,826,071円－1,760,301円＝65,770円",
  },
  {
    id: "Q_L_004",
    correct_answer_json: JSON.stringify({
      depreciationExpense: 248001,
      accumulatedDepreciation: 4712019,
      bookValue: 248007,
      journalEntry: {
        debit: { account: "減価償却費", amount: 248001 },
        credit: { account: "建物減価償却累計額", amount: 248001 },
      },
      calculation: "年間償却額 = 4,960,026円 ÷ 20年 = 248,001円",
    }),
    explanation:
      "【建物の減価償却記入のポイント】\\n1. 定額法：（取得原価－残存価額）÷耐用年数\\n2. 間接法：減価償却累計額勘定を使用\\n3. 当期償却費＝4,960,026円÷20年＝248,001円\\n4. 帳簿価額＝取得原価－減価償却累計額\\n\\n【19年目の処理】\\n前期末累計額：4,464,018円\\n当期償却費：248,001円\\n当期末累計額：4,712,019円\\n帳簿価額：248,007円",
  },
  {
    id: "Q_L_005",
    correct_answer_json: JSON.stringify({
      ledgerEntries: [
        {
          date: "11月1日",
          description: "前月繰越",
          debit: null,
          credit: 523589,
          balance: 523589,
        },
        {
          date: "11月7日",
          description: "掛仕入",
          debit: null,
          credit: 393285,
          balance: 916874,
        },
        {
          date: "11月14日",
          description: "現金支払",
          debit: 227553,
          credit: null,
          balance: 689321,
        },
        {
          date: "11月21日",
          description: "売掛金相殺",
          debit: 66069,
          credit: null,
          balance: 623252,
        },
      ],
      finalBalance: 623252,
      note: "買掛金と売掛金の相殺により66,069円を減少",
    }),
    explanation:
      "【買掛金勘定記入のポイント】\\n1. 買掛金の発生（掛仕入）は貸方に記入\\n2. 買掛金の支払（現金・相殺）は借方に記入\\n3. 売掛金との相殺は両勘定から減少\\n4. 残高は常に貸方残高（負債）\\n\\n【計算過程】\\n前月繰越 523,589円\\n＋掛仕入 393,285円\\n－現金支払 227,553円\\n－相殺 66,069円\\n＝月末残高 623,252円",
  },
  {
    id: "Q_L_006",
    correct_answer_json: JSON.stringify({
      ledgerEntries: [
        {
          date: "3月1日",
          description: "前月繰越",
          debit: null,
          credit: 725963,
          balance: 725963,
        },
        {
          date: "3月7日",
          description: "元本返済",
          debit: 227258,
          credit: null,
          balance: 498705,
        },
        {
          date: "3月14日",
          description: "支払利息",
          debit: 0,
          credit: 0,
          balance: 498705,
          note: "利息は別勘定",
        },
        {
          date: "3月21日",
          description: "追加借入",
          debit: null,
          credit: 135870,
          balance: 634575,
        },
      ],
      interestEntry: {
        account: "支払利息",
        debit: 20524,
        credit: "現金",
        amount: 20524,
      },
      finalBalance: 634575,
    }),
    explanation:
      "【借入金勘定記入のポイント】\\n1. 借入金の借入は貸方に記入（負債増加）\\n2. 借入金の返済は借方に記入（負債減少）\\n3. 支払利息は別勘定で処理（費用）\\n4. 元本と利息は区別して記帳\\n\\n【処理内容】\\n元本残高：634,575円\\n支払利息：20,524円（費用勘定へ）",
  },
  {
    id: "Q_L_007",
    correct_answer_json: JSON.stringify({
      ledgerEntries: [
        {
          date: "8月1日",
          description: "前月繰越",
          debit: null,
          credit: 111039,
          balance: 111039,
        },
        {
          date: "8月7日",
          description: "貸倒れ充当",
          debit: 17606,
          credit: null,
          balance: 93433,
        },
        {
          date: "8月14日",
          description: "決算時繰入",
          debit: null,
          credit: 44781,
          balance: 138214,
        },
        {
          date: "8月21日",
          description: "戻入益",
          debit: 11908,
          credit: null,
          balance: 126306,
        },
      ],
      finalBalance: 126306,
      relatedEntries: "貸倒引当金戻入益11,908円を収益計上",
    }),
    explanation:
      "【貸倒引当金勘定記入のポイント】\\n1. 貸倒引当金は評価勘定（資産のマイナス）\\n2. 設定・繰入は貸方、充当・戻入は借方\\n3. 差額補充法：必要額との差額を繰入\\n4. 戻入益は収益として計上\\n\\n【残高推移】\\n前月繰越 111,039円\\n－充当 17,606円\\n＋繰入 44,781円\\n－戻入 11,908円\\n＝月末残高 126,306円",
  },
  {
    id: "Q_L_008",
    correct_answer_json: JSON.stringify({
      salesAccount: {
        entries: [
          {
            date: "6月中",
            description: "現金売上",
            debit: null,
            credit: 397451,
            balance: 397451,
          },
          {
            date: "6月中",
            description: "掛売上",
            debit: null,
            credit: 596176,
            balance: 993627,
          },
        ],
        total: 993627,
      },
      purchaseAccount: {
        entries: [
          {
            date: "6月中",
            description: "現金仕入",
            debit: 260123,
            credit: null,
            balance: 260123,
          },
          {
            date: "6月中",
            description: "掛仕入",
            debit: 606954,
            credit: null,
            balance: 867077,
          },
        ],
        total: 867077,
      },
      grossProfit: 126550,
    }),
    explanation:
      "【売上・仕入勘定の対応関係のポイント】\\n1. 売上勘定は貸方に記入（収益）\\n2. 仕入勘定は借方に記入（費用）\\n3. 現金取引と掛取引を区別して記帳\\n4. 売上総利益＝売上－仕入\\n\\n【計算】\\n売上高：993,627円\\n仕入高：867,077円\\n売上総利益：126,550円",
  },
  {
    id: "Q_L_009",
    correct_answer_json: JSON.stringify({
      salaryPayment: {
        date: "11月25日",
        amount: 321134,
        entry: { debit: "給料", credit: "現金", amount: 321134 },
      },
      accruedSalary: {
        days: 5,
        dailyAmount: 10704,
        totalAccrued: 53522,
        entry: { debit: "給料", credit: "未払費用", amount: 53522 },
      },
      totalExpense: 374656,
      calculation: "日割計算：321,134円÷30日×5日＝53,522円",
    }),
    explanation:
      "【給料・未払費用の期間配分のポイント】\\n1. 給料支払は費用計上と現金減少\\n2. 決算時は未払分を日割計算\\n3. 未払給料は未払費用勘定へ\\n4. 期間対応の原則に従い配分\\n\\n【計算】\\n月額給料：321,134円\\n日割額：10,704円/日\\n未払日数：5日（26日〜30日）\\n未払給料：53,522円",
  },
  {
    id: "Q_L_010",
    correct_answer_json: JSON.stringify({
      journalEntry: {
        date: "5月10日",
        debit: [
          { account: "仕入", amount: 300000 },
          { account: "支払手数料", amount: 5000 },
        ],
        credit: [
          { account: "現金", amount: 100000 },
          { account: "買掛金", amount: 200000 },
          { account: "未払金", amount: 5000 },
        ],
      },
      ledgerPostings: [
        { account: "仕入", debit: 300000, counterparty: "諸口" },
        { account: "支払手数料", debit: 5000, counterparty: "諸口" },
        { account: "現金", credit: 100000, counterparty: "諸口" },
        { account: "買掛金", credit: 200000, counterparty: "諸口" },
        { account: "未払金", credit: 5000, counterparty: "諸口" },
      ],
      note: "相手勘定が複数ある場合は「諸口」と記入",
    }),
    explanation:
      "【諸口勘定を含む複合仕訳の転記のポイント】\\n1. 複合仕訳は相手勘定が複数存在\\n2. 元帳転記時は相手勘定欄に「諸口」と記入\\n3. 各勘定への個別転記を正確に実施\\n4. 貸借の一致を常に確認\\n\\n【諸口の使用】\\n借方合計305,000円＝貸方合計305,000円\\n各勘定の相手欄には「諸口」と記載",
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

console.log("✅ Q_L_001〜Q_L_010の修正が完了しました");
console.log("修正内容:");
console.log("- 正答データを勘定記入形式に修正");
console.log("- 解説を詳細な内容に更新");
