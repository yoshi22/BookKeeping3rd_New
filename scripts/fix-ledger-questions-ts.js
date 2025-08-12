#!/usr/bin/env node

/**
 * 第二問（帳簿問題）修正スクリプト v3
 * problemsStrategy.mdの仕様に完全準拠した修正版
 *
 * パターン1：勘定記入問題（Q_L_001-010）
 * - 資産勘定（Q_L_001-004）
 * - 負債・純資産勘定（Q_L_005-007）
 * - 収益・費用勘定（Q_L_008-010）
 *
 * パターン2：補助簿記入問題（Q_L_011-020）
 * パターン3：伝票記入問題（Q_L_021-030）
 * パターン4：理論・選択問題（Q_L_031-040）
 */

const fs = require("fs");
const path = require("path");

// =====================================
// パターン1：勘定記入問題（Q_L_001-010）
// =====================================

// Q_L_001: 現金勘定の記入・残高計算・過不足処理
function generateCashAccountQuestion() {
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;
  const openingBalance = Math.floor(Math.random() * 500000) + 100000;

  const transactions = [
    {
      day: 5,
      desc: "現金売上",
      amount: Math.floor(Math.random() * 300000) + 100000,
      type: "increase",
    },
    {
      day: 10,
      desc: "給料支払",
      amount: Math.floor(Math.random() * 200000) + 150000,
      type: "decrease",
    },
    {
      day: 15,
      desc: "売掛金回収",
      amount: Math.floor(Math.random() * 250000) + 100000,
      type: "increase",
    },
    {
      day: 20,
      desc: "買掛金支払",
      amount: Math.floor(Math.random() * 200000) + 100000,
      type: "decrease",
    },
    {
      day: 28,
      desc: "現金実査による過不足判明",
      amount: Math.floor(Math.random() * 10000) + 1000,
      type: "shortage",
    },
  ];

  const questionText = `【現金勘定記入問題】

${year}年${month}月の現金勘定への記入を行い、残高を計算してください。

【前月繰越残高】
現金：${openingBalance.toLocaleString()}円

【${month}月の取引】
${transactions
  .map(
    (t) =>
      `${month}月${t.day}日 ${t.desc}：${t.amount.toLocaleString()}円${
        t.type === "increase"
          ? "（増加）"
          : t.type === "decrease"
            ? "（減少）"
            : "（不足）"
      }`,
  )
  .join("\n")}

【現金過不足の処理】
月末に現金実査を行い、過不足を確認して適切に処理してください。

【作成指示】
1. 現金勘定へ各取引を記入
2. 借方・貸方の合計を計算
3. 月末残高を算出
4. 現金過不足がある場合は適切に処理`;

  return {
    questionText,
    correctAnswer: {
      balance: transactions.reduce((bal, t) => {
        if (t.type === "increase") return bal + t.amount;
        if (t.type === "decrease" || t.type === "shortage")
          return bal - t.amount;
        return bal;
      }, openingBalance),
    },
  };
}

// Q_L_002: 売掛金勘定の記入・回収・貸倒処理
function generateAccountsReceivableQuestion() {
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;
  const openingBalance = Math.floor(Math.random() * 600000) + 200000;

  const transactions = [
    {
      day: 3,
      desc: "掛売上",
      amount: Math.floor(Math.random() * 300000) + 100000,
      type: "sale",
    },
    {
      day: 8,
      desc: "現金回収",
      amount: Math.floor(Math.random() * 200000) + 50000,
      type: "collection",
    },
    {
      day: 15,
      desc: "掛売上",
      amount: Math.floor(Math.random() * 250000) + 150000,
      type: "sale",
    },
    {
      day: 22,
      desc: "手形回収",
      amount: Math.floor(Math.random() * 150000) + 50000,
      type: "collection",
    },
    {
      day: 28,
      desc: "貸倒れ発生",
      amount: Math.floor(Math.random() * 50000) + 10000,
      type: "baddebt",
    },
  ];

  const questionText = `【売掛金勘定記入問題】

${year}年${month}月の売掛金勘定への記入を行い、残高を計算してください。

【前月繰越残高】
売掛金：${openingBalance.toLocaleString()}円

【${month}月の取引】
${transactions
  .map((t) => `${month}月${t.day}日 ${t.desc}：${t.amount.toLocaleString()}円`)
  .join("\n")}

【貸倒処理】
貸倒れが発生した場合は、貸倒引当金を優先充当し、不足分は貸倒損失として処理してください。
（貸倒引当金残高：30,000円）

【作成指示】
1. 売掛金勘定へ各取引を記入
2. 発生と回収を適切に処理
3. 貸倒れの処理を行う
4. 月末残高を算出`;

  return {
    questionText,
    correctAnswer: {
      balance: transactions.reduce((bal, t) => {
        if (t.type === "sale") return bal + t.amount;
        if (t.type === "collection" || t.type === "baddebt")
          return bal - t.amount;
        return bal;
      }, openingBalance),
    },
  };
}

// Q_L_003: 商品勘定の記入・売上原価算定（三分法）
function generateMerchandiseAccountQuestion() {
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;
  const openingInventory = Math.floor(Math.random() * 800000) + 300000;
  const purchases = Math.floor(Math.random() * 1500000) + 500000;
  const closingInventory = Math.floor(Math.random() * 700000) + 250000;

  const questionText = `【商品勘定記入問題（三分法）】

${year}年${month}月の商品売買取引を三分法により記帳し、売上原価を算定してください。

【期首商品棚卸高】
${openingInventory.toLocaleString()}円

【当月の取引】
・当月仕入高：${purchases.toLocaleString()}円
・当月売上高：${(purchases * 1.3).toLocaleString()}円

【期末商品棚卸高】
${closingInventory.toLocaleString()}円

【作成指示】
1. 仕入勘定、売上勘定、繰越商品勘定を作成
2. 三分法による商品売買の記帳
3. 売上原価の算定（期首＋仕入－期末）
4. 売上総利益の計算`;

  const cogs = openingInventory + purchases - closingInventory;

  return {
    questionText,
    correctAnswer: {
      costOfGoodsSold: cogs,
      grossProfit: purchases * 1.3 - cogs,
    },
  };
}

// Q_L_004: 建物勘定・減価償却累計額勘定の対応記入
function generateBuildingDepreciationQuestion() {
  const year = 2025;
  const month = 3; // 決算月
  const buildingCost = Math.floor(Math.random() * 5000000) + 3000000;
  const usefulLife = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
  const yearsUsed = Math.floor(Math.random() * (usefulLife - 1)) + 1;

  const annualDepreciation = Math.floor(buildingCost / usefulLife);
  const accumulatedDepreciation = annualDepreciation * yearsUsed;

  const questionText = `【建物勘定・減価償却累計額勘定記入問題】

${year}年${month}月末決算において、建物の減価償却を行い、関連勘定への記入を行ってください。

【建物情報】
・取得原価：${buildingCost.toLocaleString()}円
・耐用年数：${usefulLife}年
・償却方法：定額法（残存価額なし）
・使用年数：${yearsUsed}年経過

【前期末の状況】
・建物勘定残高：${buildingCost.toLocaleString()}円
・減価償却累計額：${(accumulatedDepreciation - annualDepreciation).toLocaleString()}円

【作成指示】
1. 当期の減価償却費を計算
2. 建物減価償却累計額勘定への記入
3. 減価償却費勘定への記入
4. 建物の帳簿価額を算出`;

  return {
    questionText,
    correctAnswer: {
      currentDepreciation: annualDepreciation,
      accumulatedTotal: accumulatedDepreciation,
      bookValue: buildingCost - accumulatedDepreciation,
    },
  };
}

// Q_L_005-007: 負債・純資産勘定（3問）
function generateLiabilityEquityQuestion(num) {
  const types = [
    {
      // Q_L_005: 買掛金勘定
      title: "買掛金勘定記入問題",
      account: "買掛金",
      opening: Math.floor(Math.random() * 500000) + 200000,
      transactions: [
        {
          desc: "掛仕入",
          amount: Math.floor(Math.random() * 300000) + 100000,
          type: "increase",
        },
        {
          desc: "現金支払",
          amount: Math.floor(Math.random() * 200000) + 50000,
          type: "decrease",
        },
        {
          desc: "買掛金相殺",
          amount: Math.floor(Math.random() * 50000) + 20000,
          type: "decrease",
        },
      ],
    },
    {
      // Q_L_006: 借入金勘定
      title: "借入金勘定・支払利息勘定記入問題",
      account: "借入金",
      opening: Math.floor(Math.random() * 1000000) + 500000,
      transactions: [
        {
          desc: "借入金返済（元本）",
          amount: Math.floor(Math.random() * 200000) + 100000,
          type: "decrease",
        },
        {
          desc: "支払利息",
          amount: Math.floor(Math.random() * 20000) + 5000,
          type: "interest",
        },
        {
          desc: "追加借入",
          amount: Math.floor(Math.random() * 300000) + 100000,
          type: "increase",
        },
      ],
    },
    {
      // Q_L_007: 貸倒引当金勘定
      title: "貸倒引当金勘定記入問題",
      account: "貸倒引当金",
      opening: Math.floor(Math.random() * 100000) + 30000,
      transactions: [
        {
          desc: "貸倒れ発生（充当）",
          amount: Math.floor(Math.random() * 30000) + 10000,
          type: "use",
        },
        {
          desc: "決算時繰入",
          amount: Math.floor(Math.random() * 50000) + 20000,
          type: "increase",
        },
        {
          desc: "戻入益",
          amount: Math.floor(Math.random() * 10000) + 5000,
          type: "decrease",
        },
      ],
    },
  ];

  const typeIndex = num - 5; // Q_L_005 = 0, Q_L_006 = 1, Q_L_007 = 2
  const selected = types[typeIndex];

  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  const questionText = `【${selected.title}】

${year}年${month}月の${selected.account}勘定への記入を行い、残高を計算してください。

【前月繰越残高】
${selected.account}：${selected.opening.toLocaleString()}円

【${month}月の取引】
${selected.transactions
  .map(
    (t, i) =>
      `${month}月${(i + 1) * 7}日 ${t.desc}：${t.amount.toLocaleString()}円`,
  )
  .join("\n")}

【作成指示】
1. ${selected.account}勘定へ各取引を記入
2. 関連勘定との連動を確認
3. 月末残高を算出
4. 必要に応じて関連勘定（支払利息等）も作成`;

  return {
    questionText,
    correctAnswer: {},
  };
}

// Q_L_008-010: 収益・費用勘定（3問）
function generateRevenueExpenseQuestion(num) {
  const types = [
    {
      // Q_L_008: 売上・仕入勘定
      title: "売上勘定・仕入勘定の対応関係",
      focus: "売上と仕入の記録",
    },
    {
      // Q_L_009: 給料勘定
      title: "給料勘定・未払費用の期間配分記入",
      focus: "給料の期間配分",
    },
    {
      // Q_L_010: 諸口勘定
      title: "諸口勘定を含む複合仕訳の転記処理",
      focus: "複合仕訳の転記",
    },
  ];

  const typeIndex = num - 8; // Q_L_008 = 0, Q_L_009 = 1, Q_L_010 = 2
  const selected = types[typeIndex];

  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  let questionText = `【${selected.title}】\n\n`;

  if (typeIndex === 0) {
    // 売上・仕入
    const sales = Math.floor(Math.random() * 1000000) + 500000;
    const purchases = Math.floor(Math.random() * 700000) + 300000;

    questionText += `${year}年${month}月の売上勘定と仕入勘定の記入を行ってください。

【${month}月の取引】
・現金売上：${(sales * 0.4).toLocaleString()}円
・掛売上：${(sales * 0.6).toLocaleString()}円
・現金仕入：${(purchases * 0.3).toLocaleString()}円
・掛仕入：${(purchases * 0.7).toLocaleString()}円

【作成指示】
1. 売上勘定と仕入勘定を作成
2. 現金取引と掛取引を区別して記入
3. 各勘定の月末残高を算出
4. 売上総利益を計算（売上－仕入）`;
  } else if (typeIndex === 1) {
    // 給料
    const monthlyPay = Math.floor(Math.random() * 300000) + 200000;
    const payDay = 25;

    questionText += `${year}年${month}月の給料勘定と未払費用の記入を行ってください。

【給料情報】
・月額給料：${monthlyPay.toLocaleString()}円
・支払日：毎月${payDay}日（当月分）
・決算日：${month}月末

【${month}月の処理】
・${month}月${payDay}日：当月給料支払
・${month}月末：未払給料の計上（${payDay + 1}日～月末分）

【作成指示】
1. 給料勘定への記入
2. 未払給料の日割計算
3. 未払費用勘定への記入
4. 期間配分の適切な処理`;
  } else {
    // 諸口
    questionText += `${year}年${month}月の諸口勘定を含む複合仕訳の転記を行ってください。

【複合仕訳の例】
${month}月10日の取引：
（借方）
・仕入 300,000円
・支払手数料 5,000円
（貸方）
・現金 100,000円
・買掛金 200,000円
・未払金 5,000円

【作成指示】
1. 各勘定への個別転記
2. 諸口勘定の使用方法を説明
3. 相手勘定が複数ある場合の処理
4. 転記の正確性を確認`;
  }

  return {
    questionText,
    correctAnswer: {},
  };
}

// =====================================
// パターン2：補助簿記入問題（Q_L_011-020）
// =====================================

function generateSubsidiaryBookQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  if (num >= 11 && num <= 14) {
    // 現金・預金補助簿（4問）
    const types = [
      { title: "現金出納帳", desc: "収入・支出・残高記入" },
      { title: "当座預金出納帳", desc: "預入・引出・残高管理" },
      { title: "小口現金出納帳", desc: "補給・支払・精算" },
      { title: "普通預金通帳", desc: "記帳・利息計算" },
    ];
    const selected = types[num - 11];

    const questionText = `【${selected.title}記入問題】

2025年${Math.floor(Math.random() * 12) + 1}月の${selected.title}を作成してください。

${selected.desc}を含む詳細な記帳を行います。

【前月繰越】
${Math.floor(Math.random() * 500000 + 100000).toLocaleString()}円

【当月の取引】
複数の収入・支出取引（詳細は問題文参照）

【作成指示】
1. 日付順に記帳
2. 摘要欄の適切な記入
3. 収入・支出・残高の計算
4. 月末締切処理`;

    return { questionText, correctAnswer: {} };
  } else if (num >= 15 && num <= 18) {
    // 売買補助簿（4問）
    const types = [
      { title: "仕入帳", desc: "日付・仕入先・品名・金額記入" },
      { title: "売上帳", desc: "日付・得意先・品名・金額記入" },
      { title: "商品有高帳（先入先出法）", desc: "単価・残高計算" },
      { title: "商品有高帳（移動平均法）", desc: "単価・残高計算" },
    ];
    const selected = types[num - 15];

    const questionText = `【${selected.title}記入問題】

2025年${Math.floor(Math.random() * 12) + 1}月の${selected.title}を作成してください。

${selected.desc}を行います。

【記入項目】
・日付
・取引先/品名
・数量・単価・金額
・残高計算

【作成指示】
1. 取引順に記帳
2. 単価計算方法の適用
3. 残高の継続的管理
4. 月末棚卸との照合`;

    return { questionText, correctAnswer: {} };
  } else {
    // 債権・債務補助簿（2問）
    const types = [
      { title: "売掛金元帳・買掛金元帳", desc: "残高管理" },
      { title: "受取手形記入帳・支払手形記入帳", desc: "期日管理" },
    ];
    const selected = types[num - 19];

    const questionText = `【${selected.title}記入問題】

2025年${Math.floor(Math.random() * 12) + 1}月の${selected.title}を作成してください。

${selected.desc}を含む詳細な記帳を行います。

【作成指示】
1. 得意先別・仕入先別の管理
2. 発生・回収・支払の記録
3. 手形期日の管理
4. 残高の確認と照合`;

    return { questionText, correctAnswer: {} };
  }
}

// =====================================
// パターン3：伝票記入問題（Q_L_021-030）
// =====================================

function generateSlipQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  if (num >= 21 && num <= 26) {
    // 3伝票制（6問）
    const types = [
      "入金伝票による現金収入取引",
      "出金伝票による現金支出取引",
      "振替伝票による現金以外取引",
      "掛け取引の振替伝票記入",
      "一部現金取引の伝票分割",
      "3伝票から仕訳日計表への集計",
    ];
    const selected = types[num - 21];

    const questionText = `【3伝票制：${selected}】

2025年${Math.floor(Math.random() * 12) + 1}月の取引を3伝票制により記録してください。

【取引内容】
${generateTransactionDetails(selected)}

【作成指示】
1. 適切な伝票の選択
2. 伝票への記入方法
3. 一部現金取引の処理
4. 伝票から帳簿への転記`;

    return { questionText, correctAnswer: {} };
  } else {
    // 5伝票制（4問）
    const types = [
      "売上伝票による売上取引専用記録",
      "仕入伝票による仕入取引専用記録",
      "5伝票制での取引分類・適用判定",
      "5伝票から総勘定元帳への転記",
    ];
    const selected = types[num - 27];

    const questionText = `【5伝票制：${selected}】

2025年${Math.floor(Math.random() * 12) + 1}月の取引を5伝票制により記録してください。

【取引内容】
${generateTransactionDetails(selected)}

【作成指示】
1. 5伝票制の特徴理解
2. 売上・仕入専用伝票の使用
3. 他の伝票との使い分け
4. 総勘定元帳への正確な転記`;

    return { questionText, correctAnswer: {} };
  }
}

// =====================================
// パターン4：理論・選択問題（Q_L_031-040）
// =====================================

function generateTheoryQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));
  const topics = [
    "簿記の基本原理と記帳体系",
    "仕訳の原則と借方・貸方の理解",
    "帳簿組織と補助簿の役割",
    "伝票制度の種類と特徴",
    "試算表の種類と作成目的",
    "決算整理の意義と手続き",
    "財務諸表の構成要素",
    "勘定科目の分類と体系",
    "簿記上の取引の定義",
    "複式簿記の特徴と利点",
  ];

  const selected = topics[num - 31];

  const questionText = `【理論問題：${selected}】

以下の説明文の空欄に入る適切な語句を選択してください。

${generateTheoryExplanation(selected)}

【選択肢】
A. ${generateOption("A", selected)}
B. ${generateOption("B", selected)}
C. ${generateOption("C", selected)}
D. ${generateOption("D", selected)}

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`;

  return { questionText, correctAnswer: {} };
}

// ヘルパー関数
function generateTransactionDetails(type) {
  const baseAmount = Math.floor(Math.random() * 500000) + 100000;
  const transactions = [];

  for (let i = 0; i < 3; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const amount = Math.floor(baseAmount * (0.5 + Math.random()));
    transactions.push(`${day}日：取引金額 ${amount.toLocaleString()}円`);
  }

  return transactions.join("\n");
}

function generateTheoryExplanation(topic) {
  return `${topic}に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

簿記は（ア）に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。
この方法により、常に（エ）が保たれ、記録の正確性を検証できる。`;
}

function generateOption(letter, topic) {
  const options = {
    A: ["複式簿記", "借方", "貸借平均", "資産"],
    B: ["単式簿記", "貸方", "損益計算", "負債"],
    C: ["商業簿記", "収益", "貸借対照", "純資産"],
    D: ["工業簿記", "費用", "試算表", "収益"],
  };

  const index = Math.floor(Math.random() * 4);
  return options[letter][index];
}

// =====================================
// メイン処理
// =====================================

function generateLedgerQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  // パターン1：勘定記入問題（Q_L_001-010）
  if (num === 1) {
    return generateCashAccountQuestion();
  } else if (num === 2) {
    return generateAccountsReceivableQuestion();
  } else if (num === 3) {
    return generateMerchandiseAccountQuestion();
  } else if (num === 4) {
    return generateBuildingDepreciationQuestion();
  } else if (num >= 5 && num <= 7) {
    return generateLiabilityEquityQuestion(num);
  } else if (num >= 8 && num <= 10) {
    return generateRevenueExpenseQuestion(num);
  }
  // パターン2：補助簿記入問題（Q_L_011-020）
  else if (num >= 11 && num <= 20) {
    return generateSubsidiaryBookQuestion(questionId);
  }
  // パターン3：伝票記入問題（Q_L_021-030）
  else if (num >= 21 && num <= 30) {
    return generateSlipQuestion(questionId);
  }
  // パターン4：理論・選択問題（Q_L_031-040）
  else if (num >= 31 && num <= 40) {
    return generateTheoryQuestion(questionId);
  }

  return { questionText: "問題生成エラー", correctAnswer: {} };
}

// 難易度設定
function getDifficulty(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  if (num >= 1 && num <= 10) return 2; // 勘定記入：中級
  if (num >= 11 && num <= 20) return 2; // 補助簿：中級
  if (num >= 21 && num <= 30) return 3; // 伝票：応用
  if (num >= 31 && num <= 40) return 1; // 理論：基礎

  return 2;
}

// 解答テンプレート生成
function generateAnswerTemplate(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  // 勘定記入問題（Q_L_001-010）
  if (num >= 1 && num <= 10) {
    return {
      type: "ledger_entry",
      fields: [
        {
          name: "date",
          label: "日付",
          type: "text",
          required: true,
          placeholder: "例: 4/8",
        },
        {
          name: "description",
          label: "摘要",
          type: "text",
          required: true,
          placeholder: "例: 売掛金回収",
        },
        {
          name: "debit_amount",
          label: "借方金額",
          type: "number",
          required: false,
          format: "currency",
        },
        {
          name: "credit_amount",
          label: "貸方金額",
          type: "number",
          required: false,
          format: "currency",
        },
      ],
      allowMultipleEntries: true,
      maxEntries: 10,
    };
  }

  // 補助簿記入問題（Q_L_011-020）
  if (num >= 11 && num <= 20) {
    if (num <= 14) {
      // 現金・預金補助簿
      return {
        type: "cash_book",
        fields: [
          { name: "date", label: "日付", type: "text", required: true },
          { name: "description", label: "摘要", type: "text", required: true },
          {
            name: "income",
            label: "収入",
            type: "number",
            required: false,
            format: "currency",
          },
          {
            name: "expense",
            label: "支出",
            type: "number",
            required: false,
            format: "currency",
          },
          {
            name: "balance",
            label: "残高",
            type: "number",
            required: true,
            format: "currency",
          },
        ],
        allowMultipleEntries: true,
      };
    } else {
      // 売買補助簿など
      return {
        type: "subsidiary_book",
        fields: [
          { name: "date", label: "日付", type: "text", required: true },
          { name: "party", label: "取引先", type: "text", required: true },
          { name: "quantity", label: "数量", type: "number", required: true },
          {
            name: "unit_price",
            label: "単価",
            type: "number",
            required: true,
            format: "currency",
          },
          {
            name: "amount",
            label: "金額",
            type: "number",
            required: true,
            format: "currency",
          },
        ],
        allowMultipleEntries: true,
      };
    }
  }

  // 伝票記入問題（Q_L_021-030）
  if (num >= 21 && num <= 30) {
    return {
      type: "slip",
      fields: [
        {
          name: "slip_type",
          label: "伝票種類",
          type: "dropdown",
          required: true,
          options: ["入金伝票", "出金伝票", "振替伝票"],
        },
        { name: "date", label: "日付", type: "text", required: true },
        { name: "account", label: "勘定科目", type: "text", required: true },
        {
          name: "amount",
          label: "金額",
          type: "number",
          required: true,
          format: "currency",
        },
      ],
    };
  }

  // 理論・選択問題（Q_L_031-040）
  if (num >= 31 && num <= 40) {
    return {
      type: "multiple_choice",
      fields: [
        {
          name: "answer_a",
          label: "空欄（ア）",
          type: "dropdown",
          required: true,
          options: ["A", "B", "C", "D"],
        },
        {
          name: "answer_b",
          label: "空欄（イ）",
          type: "dropdown",
          required: true,
          options: ["A", "B", "C", "D"],
        },
        {
          name: "answer_c",
          label: "空欄（ウ）",
          type: "dropdown",
          required: true,
          options: ["A", "B", "C", "D"],
        },
        {
          name: "answer_d",
          label: "空欄（エ）",
          type: "dropdown",
          required: true,
          options: ["A", "B", "C", "D"],
        },
      ],
    };
  }

  return { type: "default", fields: [] };
}

// ファイル更新処理
function updateMasterQuestions() {
  console.log("帳簿問題（第二問）の修正を開始します（v3）...");

  const questionIds = [];
  for (let i = 1; i <= 40; i++) {
    questionIds.push(`Q_L_${String(i).padStart(3, "0")}`);
  }

  // TypeScriptファイルのみを更新
  const files = [path.join(__dirname, "../src/data/master-questions.ts")];

  files.forEach((filePath) => {
    console.log(`\n${path.basename(filePath)} を更新中...`);

    let content = fs.readFileSync(filePath, "utf8");
    let updatedCount = 0;

    questionIds.forEach((questionId) => {
      const { questionText, correctAnswer } =
        generateLedgerQuestion(questionId);
      const difficulty = getDifficulty(questionId);
      const answerTemplate = generateAnswerTemplate(questionId);

      // エスケープ処理
      const escapedQuestionText = questionText
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

      const escapedAnswerTemplate = JSON.stringify(answerTemplate).replace(
        /"/g,
        '\\"',
      );

      // 正規表現パターン（より柔軟に）
      const pattern = new RegExp(
        `(\\{[^}]*id:\\s*["']${questionId}["'][^}]*question_text:\\s*["'])[^"']*?(["'][^}]*\\})`,
        "gs",
      );

      if (pattern.test(content)) {
        content = content.replace(pattern, (match, before, after) => {
          // difficulty と answer_template_json も更新
          let result = match;

          // question_text の更新
          result = result.replace(
            /(question_text:\s*["'])[^"']*?(["'])/,
            `$1${escapedQuestionText}$2`,
          );

          // difficulty の更新
          result = result.replace(/(difficulty:\s*)\d+/, `$1${difficulty}`);

          // answer_template_json の更新
          result = result.replace(
            /(answer_template_json:\s*["'])[^"']*?(["'])/,
            `$1${escapedAnswerTemplate}$2`,
          );

          return result;
        });

        updatedCount++;
        console.log(`  ✓ ${questionId} を更新しました`);
      } else {
        console.log(`  ⚠ ${questionId} が見つかりませんでした`);
      }
    });

    // ファイル書き込み
    fs.writeFileSync(filePath, content, "utf8");
    console.log(
      `✅ ${path.basename(filePath)} の更新完了: ${updatedCount}/${questionIds.length} 問`,
    );
  });

  console.log("\n✨ 帳簿問題の修正が完了しました（v3）");
  console.log("\n📝 修正内容：");
  console.log("  - Q_L_001: 現金勘定の記入・残高計算・過不足処理");
  console.log("  - Q_L_002: 売掛金勘定の記入・回収・貸倒処理");
  console.log("  - Q_L_003: 商品勘定の記入・売上原価算定（三分法）");
  console.log("  - Q_L_004: 建物勘定・減価償却累計額勘定の対応記入");
  console.log(
    "  - Q_L_005-007: 負債・純資産勘定（買掛金、借入金、貸倒引当金）",
  );
  console.log("  - Q_L_008-010: 収益・費用勘定（売上・仕入、給料、諸口）");
  console.log("  - Q_L_011-020: 補助簿記入問題");
  console.log("  - Q_L_021-030: 伝票記入問題");
  console.log("  - Q_L_031-040: 理論・選択問題");
}

// 実行
updateMasterQuestions();
