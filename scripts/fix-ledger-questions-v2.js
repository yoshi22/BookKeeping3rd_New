#!/usr/bin/env node
/**
 * Q_L_001からQ_L_040の問題文をproblemsStrategy.mdに基づいて修正するスクリプト
 * 第二問（帳簿問題）を正しい順番・内容に修正
 */

const fs = require("fs");
const path = require("path");

// 修正対象ファイルのパス
const FILES_TO_UPDATE = [
  path.join(__dirname, "../src/data/master-questions.ts"),
  path.join(__dirname, "../src/data/master-questions.js"),
];

// 勘定科目のリスト（簿記3級レベル）
const ACCOUNTS = [
  "現金",
  "小口現金",
  "当座預金",
  "普通預金",
  "受取手形",
  "売掛金",
  "商品",
  "繰越商品",
  "仕入",
  "売上",
  "支払手形",
  "買掛金",
  "前払金",
  "前受金",
  "貸付金",
  "借入金",
  "未払金",
  "未収入金",
  "仮払金",
  "仮受金",
  "立替金",
  "預り金",
  "給料",
  "家賃",
  "水道光熱費",
  "通信費",
  "旅費交通費",
  "消耗品費",
  "広告宣伝費",
  "支払利息",
  "受取利息",
  "売上原価",
  "資本金",
  "引出金",
];

// 金額生成（1,000円単位）
function generateAmount() {
  return Math.floor(Math.random() * 500 + 50) * 1000;
}

// 日付生成（1日から28日）
function generateDay() {
  return Math.floor(Math.random() * 28) + 1;
}

// パターン1: 勘定記入問題（Q_L_001〜Q_L_010）
function generateAccountEntryQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  let questionText = "";

  // 最初の5問は現金勘定関連
  if (num >= 1 && num <= 5) {
    // 現金勘定の記入・残高計算・過不足処理
    const beginningBalance = generateAmount();
    const transactions = [];

    // 3-5個の現金取引を生成
    const numTransactions = Math.floor(Math.random() * 3) + 3;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const isCashIn = Math.random() > 0.5;
      const amount = generateAmount();

      if (isCashIn) {
        const sources = ["売上", "売掛金", "借入金", "資本金"];
        const source = sources[Math.floor(Math.random() * sources.length)];
        transactions.push({
          day,
          debit: "現金",
          credit: source,
          amount,
          description:
            source === "売上"
              ? "現金売上"
              : source === "売掛金"
                ? "売掛金回収"
                : source === "借入金"
                  ? "借入"
                  : "資本金受入",
        });
      } else {
        const uses = ["仕入", "給料", "家賃", "買掛金", "借入金"];
        const use = uses[Math.floor(Math.random() * uses.length)];
        transactions.push({
          day,
          debit: use,
          credit: "現金",
          amount,
          description:
            use === "仕入"
              ? "現金仕入"
              : use === "給料"
                ? "給料支払"
                : use === "家賃"
                  ? "家賃支払"
                  : use === "買掛金"
                    ? "買掛金支払"
                    : "借入金返済",
        });
      }
    }

    // 日付順にソート
    transactions.sort((a, b) => a.day - b.day);

    // 現金過不足を追加（num >= 3の場合）
    if (num >= 3) {
      const shortageAmount = Math.floor(Math.random() * 10 + 1) * 1000;
      transactions.push({
        day: 28,
        debit: "現金過不足",
        credit: "現金",
        amount: shortageAmount,
        description: "現金実査による不足判明",
      });
    }

    questionText = `【現金勘定記入問題】\\n\\n`;
    questionText += `${year}年${month}月の現金勘定への記入を行い、残高を計算してください。\\n\\n`;
    questionText += `【前月繰越残高】\\n`;
    questionText += `現金：${beginningBalance.toLocaleString()}円\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.description}：`;
      if (t.debit === "現金") {
        questionText += `現金 ${t.amount.toLocaleString()}円 増加\\n`;
      } else {
        questionText += `現金 ${t.amount.toLocaleString()}円 減少\\n`;
      }
    });

    if (num >= 3) {
      questionText += `\\n【現金過不足の処理】\\n`;
      questionText += `月末に現金実査を行い、過不足を確認して処理してください。\\n`;
    }

    questionText += `\\n【作成指示】\\n`;
    questionText += `1. 現金勘定へ各取引を記入\\n`;
    questionText += `2. 借方・貸方の合計を計算\\n`;
    questionText += `3. 月末残高を算出\\n`;
    if (num >= 3) {
      questionText += `4. 現金過不足がある場合は適切に処理`;
    }
  } else if (num >= 6 && num <= 8) {
    // 当座預金勘定の記入
    const beginningBalance = generateAmount();
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 3;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const isDeposit = Math.random() > 0.5;
      const amount = generateAmount();

      if (isDeposit) {
        transactions.push({
          day,
          description: "売上代金振込",
          amount,
          type: "入金",
        });
      } else {
        const purposes = ["仕入代金支払", "給料振込", "家賃振込", "小切手振出"];
        const purpose = purposes[Math.floor(Math.random() * purposes.length)];
        transactions.push({
          day,
          description: purpose,
          amount,
          type: "出金",
        });
      }
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【当座預金勘定記入問題】\\n\\n`;
    questionText += `${year}年${month}月の当座預金勘定への記入を行い、残高を計算してください。\\n\\n`;
    questionText += `【前月繰越残高】\\n`;
    questionText += `当座預金：${beginningBalance.toLocaleString()}円\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.description}：${t.amount.toLocaleString()}円（${t.type}）\\n`;
    });

    questionText += `\\n【作成指示】\\n`;
    questionText += `1. 当座預金勘定へ各取引を記入\\n`;
    questionText += `2. 入金・出金を適切に処理\\n`;
    questionText += `3. 月末残高を算出\\n`;
    questionText += `4. 当座借越の有無を確認`;
  } else {
    // 売掛金・買掛金勘定の記入
    const account = Math.random() > 0.5 ? "売掛金" : "買掛金";
    const beginningBalance = generateAmount();
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 3;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const amount = generateAmount();

      if (account === "売掛金") {
        const isCredit = Math.random() > 0.5;
        if (isCredit) {
          transactions.push({
            day,
            description: "掛売上",
            amount,
            type: "発生",
          });
        } else {
          transactions.push({
            day,
            description: "現金回収",
            amount,
            type: "回収",
          });
        }
      } else {
        const isCredit = Math.random() > 0.5;
        if (isCredit) {
          transactions.push({
            day,
            description: "掛仕入",
            amount,
            type: "発生",
          });
        } else {
          transactions.push({
            day,
            description: "現金支払",
            amount,
            type: "支払",
          });
        }
      }
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【${account}勘定記入問題】\\n\\n`;
    questionText += `${year}年${month}月の${account}勘定への記入を行い、残高を計算してください。\\n\\n`;
    questionText += `【前月繰越残高】\\n`;
    questionText += `${account}：${beginningBalance.toLocaleString()}円\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.description}：${t.amount.toLocaleString()}円（${t.type}）\\n`;
    });

    questionText += `\\n【作成指示】\\n`;
    questionText += `1. ${account}勘定へ各取引を記入\\n`;
    questionText += `2. 発生と${account === "売掛金" ? "回収" : "支払"}を適切に処理\\n`;
    questionText += `3. 月末残高を算出\\n`;
    questionText += `4. 得意先別・仕入先別の管理を考慮`;
  }

  return questionText;
}

// パターン2: 補助簿記入問題（Q_L_011〜Q_L_020）
function generateSubsidiaryBookQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  let questionText = "";

  if (num >= 11 && num <= 13) {
    // 現金出納帳
    const beginningBalance = generateAmount();
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 4) + 4;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const isCashIn = Math.random() > 0.5;
      const amount = generateAmount();

      if (isCashIn) {
        const sources = ["売上", "売掛金回収", "借入", "雑収入"];
        const source = sources[Math.floor(Math.random() * sources.length)];
        transactions.push({
          day,
          description: source,
          income: amount,
          expense: 0,
        });
      } else {
        const uses = ["仕入", "給料", "家賃", "消耗品費", "水道光熱費"];
        const use = uses[Math.floor(Math.random() * uses.length)];
        transactions.push({
          day,
          description: use,
          income: 0,
          expense: amount,
        });
      }
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【現金出納帳記入問題】\\n\\n`;
    questionText += `${year}年${month}月の取引を現金出納帳に記入してください。\\n\\n`;
    questionText += `【前月繰越残高】\\n`;
    questionText += `${beginningBalance.toLocaleString()}円\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      if (t.income > 0) {
        questionText += `${month}月${t.day}日 ${t.description}：収入 ${t.income.toLocaleString()}円\\n`;
      } else {
        questionText += `${month}月${t.day}日 ${t.description}：支出 ${t.expense.toLocaleString()}円\\n`;
      }
    });

    questionText += `\\n【記入指示】\\n`;
    questionText += `1. 日付順に記入\\n`;
    questionText += `2. 収入・支出欄を正確に記入\\n`;
    questionText += `3. 残高を随時計算\\n`;
    questionText += `4. 月末残高を確定`;
  } else if (num >= 14 && num <= 16) {
    // 仕入帳・売上帳
    const book = Math.random() > 0.5 ? "仕入帳" : "売上帳";
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 3;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const quantity = Math.floor(Math.random() * 100 + 10);
      const unitPrice = Math.floor(Math.random() * 50 + 10) * 100;
      const amount = quantity * unitPrice;

      if (book === "仕入帳") {
        const suppliers = ["A商店", "B商事", "C物産", "D商会"];
        const supplier =
          suppliers[Math.floor(Math.random() * suppliers.length)];
        const paymentTerms = ["現金", "掛", "手形"];
        const payment =
          paymentTerms[Math.floor(Math.random() * paymentTerms.length)];

        transactions.push({
          day,
          supplier,
          description: "商品仕入",
          quantity,
          unitPrice,
          amount,
          payment,
        });
      } else {
        const customers = ["X商店", "Y商事", "Z物産", "W商会"];
        const customer =
          customers[Math.floor(Math.random() * customers.length)];
        const paymentTerms = ["現金", "掛", "手形"];
        const payment =
          paymentTerms[Math.floor(Math.random() * paymentTerms.length)];

        transactions.push({
          day,
          customer,
          description: "商品売上",
          quantity,
          unitPrice,
          amount,
          payment,
        });
      }
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【${book}記入問題】\\n\\n`;
    questionText += `${year}年${month}月の取引を${book}に記入してください。\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    if (book === "仕入帳") {
      transactions.forEach((t) => {
        questionText += `${month}月${t.day}日 ${t.supplier}より${t.description}：\\n`;
        questionText += `  数量 ${t.quantity}個 × 単価 ${t.unitPrice.toLocaleString()}円 = ${t.amount.toLocaleString()}円（${t.payment}）\\n`;
      });
    } else {
      transactions.forEach((t) => {
        questionText += `${month}月${t.day}日 ${t.customer}へ${t.description}：\\n`;
        questionText += `  数量 ${t.quantity}個 × 単価 ${t.unitPrice.toLocaleString()}円 = ${t.amount.toLocaleString()}円（${t.payment}）\\n`;
      });
    }

    questionText += `\\n【記入指示】\\n`;
    questionText += `1. 日付順に記入\\n`;
    questionText += `2. ${book === "仕入帳" ? "仕入先" : "得意先"}別に整理\\n`;
    questionText += `3. 数量・単価・金額を正確に記入\\n`;
    questionText += `4. 支払条件を明記`;
  } else {
    // 商品有高帳
    const beginningQuantity = Math.floor(Math.random() * 100 + 50);
    const beginningUnitPrice = Math.floor(Math.random() * 50 + 10) * 100;
    const beginningAmount = beginningQuantity * beginningUnitPrice;

    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 3;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const isReceiving = Math.random() > 0.5;
      const quantity = Math.floor(Math.random() * 50 + 10);
      const unitPrice = Math.floor(Math.random() * 50 + 10) * 100;

      transactions.push({
        day,
        type: isReceiving ? "受入" : "払出",
        quantity,
        unitPrice,
        amount: quantity * unitPrice,
      });
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【商品有高帳記入問題】\\n\\n`;
    questionText += `${year}年${month}月の商品の受払を商品有高帳に記入してください。\\n`;
    questionText += `（先入先出法を適用）\\n\\n`;
    questionText += `【前月繰越】\\n`;
    questionText += `数量：${beginningQuantity}個、単価：${beginningUnitPrice.toLocaleString()}円、金額：${beginningAmount.toLocaleString()}円\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.type}：`;
      questionText += `数量 ${t.quantity}個、単価 ${t.unitPrice.toLocaleString()}円\\n`;
    });

    questionText += `\\n【記入指示】\\n`;
    questionText += `1. 先入先出法により払出単価を決定\\n`;
    questionText += `2. 受入・払出・残高を正確に記入\\n`;
    questionText += `3. 数量・単価・金額を計算\\n`;
    questionText += `4. 月末在庫を確定`;
  }

  return questionText;
}

// パターン3: 伝票記入問題（Q_L_021〜Q_L_030）
function generateSlipQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  let questionText = "";

  if (num >= 21 && num <= 24) {
    // 3伝票制
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 4;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const transactionTypes = [
        { type: "入金", description: "現金売上", amount: generateAmount() },
        { type: "出金", description: "現金仕入", amount: generateAmount() },
        { type: "振替", description: "掛売上", amount: generateAmount() },
        { type: "振替", description: "掛仕入", amount: generateAmount() },
        { type: "入金", description: "売掛金回収", amount: generateAmount() },
        { type: "出金", description: "買掛金支払", amount: generateAmount() },
      ];

      const transaction =
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      transactions.push({
        day,
        ...transaction,
      });
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【3伝票制記入問題】\\n\\n`;
    questionText += `${year}年${month}月の取引を3伝票制により起票してください。\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.description}：${t.amount.toLocaleString()}円\\n`;
    });

    questionText += `\\n【起票指示】\\n`;
    questionText += `1. 取引内容により入金伝票・出金伝票・振替伝票を選択\\n`;
    questionText += `2. 各伝票に必要事項を記入\\n`;
    questionText += `3. 伝票番号を付与\\n`;
    questionText += `4. 仕訳への転記を確認`;
  } else if (num >= 25 && num <= 27) {
    // 5伝票制
    const transactions = [];
    const numTransactions = Math.floor(Math.random() * 3) + 4;
    const days = [];

    for (let i = 0; i < numTransactions; i++) {
      let day;
      do {
        day = generateDay();
      } while (days.includes(day));
      days.push(day);

      const transactionTypes = [
        { type: "入金", description: "現金売上", amount: generateAmount() },
        { type: "出金", description: "現金仕入", amount: generateAmount() },
        { type: "売上", description: "掛売上", amount: generateAmount() },
        { type: "仕入", description: "掛仕入", amount: generateAmount() },
        {
          type: "振替",
          description: "売掛金を受取手形で回収",
          amount: generateAmount(),
        },
      ];

      const transaction =
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      transactions.push({
        day,
        ...transaction,
      });
    }

    transactions.sort((a, b) => a.day - b.day);

    questionText = `【5伝票制記入問題】\\n\\n`;
    questionText += `${year}年${month}月の取引を5伝票制により起票してください。\\n\\n`;
    questionText += `【${month}月の取引】\\n`;

    transactions.forEach((t) => {
      questionText += `${month}月${t.day}日 ${t.description}：${t.amount.toLocaleString()}円\\n`;
    });

    questionText += `\\n【起票指示】\\n`;
    questionText += `1. 取引内容により入金・出金・売上・仕入・振替伝票を選択\\n`;
    questionText += `2. 各伝票に必要事項を記入\\n`;
    questionText += `3. 伝票番号を付与\\n`;
    questionText += `4. 仕訳への転記を確認`;
  } else {
    // 仕訳日計表
    const slips = [];
    const numSlips = Math.floor(Math.random() * 4) + 5;

    for (let i = 0; i < numSlips; i++) {
      const slipTypes = ["入金", "出金", "振替"];
      const slipType = slipTypes[Math.floor(Math.random() * slipTypes.length)];
      const amount = generateAmount();

      if (slipType === "入金") {
        slips.push({
          number: 100 + i,
          type: slipType,
          debit: "現金",
          credit: Math.random() > 0.5 ? "売上" : "売掛金",
          amount,
        });
      } else if (slipType === "出金") {
        slips.push({
          number: 200 + i,
          type: slipType,
          debit: Math.random() > 0.5 ? "仕入" : "買掛金",
          credit: "現金",
          amount,
        });
      } else {
        const accounts = [
          { debit: "売掛金", credit: "売上" },
          { debit: "仕入", credit: "買掛金" },
          { debit: "受取手形", credit: "売掛金" },
        ];
        const account = accounts[Math.floor(Math.random() * accounts.length)];
        slips.push({
          number: 300 + i,
          type: slipType,
          ...account,
          amount,
        });
      }
    }

    questionText = `【仕訳日計表作成問題】\\n\\n`;
    questionText += `${year}年${month}月${generateDay()}日の伝票から仕訳日計表を作成してください。\\n\\n`;
    questionText += `【本日の伝票】\\n`;

    slips.forEach((s) => {
      questionText += `${s.type}伝票No.${s.number}：${s.debit} ${s.amount.toLocaleString()} / ${s.credit} ${s.amount.toLocaleString()}\\n`;
    });

    questionText += `\\n【作成指示】\\n`;
    questionText += `1. 各伝票から仕訳を集計\\n`;
    questionText += `2. 勘定科目別に借方・貸方を集計\\n`;
    questionText += `3. 仕訳日計表を作成\\n`;
    questionText += `4. 借方合計と貸方合計の一致を確認`;
  }

  return questionText;
}

// パターン4: 理論・選択問題（Q_L_031〜Q_L_040）
function generateTheoryQuestion(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  const theoryTopics = [
    {
      title: "複式簿記の基本原理",
      content: `【簿記理論問題】\\n\\n複式簿記の基本原理について説明してください。\\n\\n【説明事項】\\n1. 貸借平均の原理\\n2. 取引の二面性\\n3. 勘定科目の増減ルール\\n4. 仕訳の基本構造\\n\\n【解答のポイント】\\n・具体的な取引例を用いて説明\\n・借方・貸方の意味を明確に\\n・実務での重要性を述べる`,
    },
    {
      title: "勘定科目の分類",
      content: `【簿記理論問題】\\n\\n勘定科目の5要素分類について説明してください。\\n\\n【説明事項】\\n1. 資産・負債・純資産の性質\\n2. 収益・費用の性質\\n3. 各要素の増減と借方・貸方の関係\\n4. 財務諸表での表示\\n\\n【解答のポイント】\\n・各要素の具体例を3つ以上挙げる\\n・貸借対照表と損益計算書の関係\\n・決算での締切方法`,
    },
    {
      title: "帳簿組織",
      content: `【簿記理論問題】\\n\\n帳簿組織の体系について説明してください。\\n\\n【説明事項】\\n1. 主要簿（仕訳帳・総勘定元帳）の役割\\n2. 補助簿の種類と機能\\n3. 主要簿と補助簿の関係\\n4. 内部統制における重要性\\n\\n【解答のポイント】\\n・各帳簿の記入例を示す\\n・照合・突合の重要性\\n・実務での活用方法`,
    },
    {
      title: "決算整理の意義",
      content: `【簿記理論問題】\\n\\n決算整理の意義と手続きについて説明してください。\\n\\n【説明事項】\\n1. 決算整理が必要な理由\\n2. 主な決算整理事項（8項目以上）\\n3. 費用・収益の対応原則\\n4. 継続性の原則\\n\\n【解答のポイント】\\n・期間損益計算の重要性\\n・具体的な決算整理仕訳\\n・財務諸表への影響`,
    },
    {
      title: "試算表の種類と作成",
      content: `【簿記理論問題】\\n\\n試算表の種類と作成方法について説明してください。\\n\\n【説明事項】\\n1. 合計試算表の特徴\\n2. 残高試算表の特徴\\n3. 合計残高試算表の特徴\\n4. 試算表の検証機能\\n\\n【解答のポイント】\\n・各試算表の作成手順\\n・誤謬発見の方法\\n・月次決算での活用`,
    },
    {
      title: "伝票制度",
      content: `【簿記理論問題】\\n\\n伝票制度について説明してください。\\n\\n【説明事項】\\n1. 3伝票制と5伝票制の違い\\n2. 各伝票の起票基準\\n3. 仕訳日計表の作成\\n4. 伝票制度のメリット\\n\\n【解答のポイント】\\n・具体的な取引での伝票選択\\n・内部統制上の利点\\n・電子化の影響`,
    },
    {
      title: "現金過不足の処理",
      content: `【簿記理論問題】\\n\\n現金過不足の処理について説明してください。\\n\\n【説明事項】\\n1. 現金過不足が生じる原因\\n2. 現金過不足勘定の性質\\n3. 決算での処理方法\\n4. 内部統制の観点\\n\\n【解答のポイント】\\n・具体的な仕訳例\\n・雑損・雑益への振替\\n・現金管理の重要性`,
    },
    {
      title: "商品売買の記帳方法",
      content: `【簿記理論問題】\\n\\n商品売買の記帳方法について説明してください。\\n\\n【説明事項】\\n1. 3分法の仕組み\\n2. 分記法との違い\\n3. 売上原価の計算\\n4. 棚卸資産の評価\\n\\n【解答のポイント】\\n・仕入勘定と売上勘定の関係\\n・決算整理での処理\\n・先入先出法の適用`,
    },
    {
      title: "減価償却",
      content: `【簿記理論問題】\\n\\n減価償却について説明してください。\\n\\n【説明事項】\\n1. 減価償却の必要性\\n2. 定額法の計算方法\\n3. 間接法と直接法\\n4. 固定資産の管理\\n\\n【解答のポイント】\\n・具体的な計算例\\n・決算整理仕訳\\n・実務での重要性`,
    },
    {
      title: "貸倒引当金",
      content: `【簿記理論問題】\\n\\n貸倒引当金について説明してください。\\n\\n【説明事項】\\n1. 貸倒引当金の意義\\n2. 設定基準と計算方法\\n3. 貸倒れの処理\\n4. 財務健全性への影響\\n\\n【解答のポイント】\\n・評価勘定としての性質\\n・差額補充法の仕訳\\n・与信管理の重要性`,
    },
  ];

  // 問題番号に基づいてトピックを選択
  const topicIndex = (num - 31) % theoryTopics.length;
  const topic = theoryTopics[topicIndex];

  return topic.content;
}

// 問題文を生成
function generateQuestionText(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  if (num >= 1 && num <= 10) {
    return generateAccountEntryQuestion(questionId);
  } else if (num >= 11 && num <= 20) {
    return generateSubsidiaryBookQuestion(questionId);
  } else if (num >= 21 && num <= 30) {
    return generateSlipQuestion(questionId);
  } else {
    return generateTheoryQuestion(questionId);
  }
}

// ファイルを更新
function updateFile(filePath) {
  console.log(`\n更新中: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf-8");
  let updateCount = 0;

  // Q_L_001からQ_L_040までを処理
  for (let i = 1; i <= 40; i++) {
    const questionId = `Q_L_${String(i).padStart(3, "0")}`;
    const newQuestionText = generateQuestionText(questionId);

    // 正規表現パターンを作成
    const isTypeScript = filePath.endsWith(".ts");

    if (isTypeScript) {
      // TypeScriptファイル用のパターン
      const pattern = new RegExp(
        `("id":\\s*"${questionId}",\\s*"category_id":\\s*"ledger",\\s*"question_text":\\s*)"[^"]*"`,
        "g",
      );

      if (content.match(pattern)) {
        content = content.replace(pattern, `$1"${newQuestionText}"`);
        updateCount++;
        console.log(`  ✅ ${questionId} を更新しました`);
      }
    } else {
      // JavaScriptファイル用のパターン
      const patterns = [
        // プロパティ名にクォートがある場合
        new RegExp(
          `("id":\\s*"${questionId}",\\s*"category_id":\\s*"ledger",\\s*"question_text":\\s*)"[^"]*"`,
          "g",
        ),
        // プロパティ名にクォートがない場合
        new RegExp(
          `(id:\\s*"${questionId}",\\s*category_id:\\s*"ledger",\\s*question_text:\\s*)"[^"]*"`,
          "g",
        ),
      ];

      for (const pattern of patterns) {
        if (content.match(pattern)) {
          content = content.replace(pattern, `$1"${newQuestionText}"`);
          updateCount++;
          console.log(`  ✅ ${questionId} を更新しました`);
          break;
        }
      }
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`\n合計 ${updateCount} 問を更新しました: ${filePath}`);

  return updateCount;
}

// メイン処理
function main() {
  console.log(
    "Q_L_001〜Q_L_040の問題文をproblemsStrategy.mdに基づいて修正します...\n",
  );
  console.log("パターン1（Q_L_001-010）: 勘定記入問題（現金勘定から開始）");
  console.log("パターン2（Q_L_011-020）: 補助簿記入問題");
  console.log("パターン3（Q_L_021-030）: 伝票記入問題");
  console.log("パターン4（Q_L_031-040）: 理論・選択問題\n");

  let totalUpdated = 0;

  FILES_TO_UPDATE.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      totalUpdated += updateFile(filePath);
    } else {
      console.log(`⚠️  ファイルが見つかりません: ${filePath}`);
    }
  });

  console.log(`\n✅ 完了！合計 ${totalUpdated} 件の問題を更新しました。`);
  console.log(
    "\n第二問の問題順序がproblemsStrategy.mdに準拠するよう修正されました。",
  );
}

// スクリプト実行
main();
