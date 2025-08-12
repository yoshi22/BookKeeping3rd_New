#!/usr/bin/env node
/**
 * Q_L_004からQ_L_040の問題文を生成・修正するスクリプト
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

// 取引内容のテンプレート
const TRANSACTION_TYPES = [
  { debit: "商品", credit: "買掛金", description: "商品仕入" },
  { debit: "現金", credit: "売上", description: "商品売上" },
  { debit: "給料", credit: "現金", description: "給料支払" },
  { debit: "買掛金", credit: "現金", description: "買掛金支払" },
  { debit: "仕入", credit: "買掛金", description: "商品仕入" },
  { debit: "売掛金", credit: "売上", description: "掛売上" },
  { debit: "現金", credit: "売掛金", description: "売掛金回収" },
  { debit: "家賃", credit: "現金", description: "家賃支払" },
  { debit: "水道光熱費", credit: "現金", description: "水道光熱費支払" },
  { debit: "消耗品費", credit: "現金", description: "消耗品購入" },
  { debit: "現金", credit: "借入金", description: "借入" },
  { debit: "借入金", credit: "現金", description: "借入金返済" },
  { debit: "広告宣伝費", credit: "現金", description: "広告費支払" },
  { debit: "通信費", credit: "現金", description: "通信費支払" },
  { debit: "旅費交通費", credit: "現金", description: "交通費支払" },
  { debit: "現金", credit: "資本金", description: "資本金受入" },
  { debit: "前払金", credit: "現金", description: "前払金支払" },
  { debit: "現金", credit: "前受金", description: "前受金受取" },
  { debit: "仮払金", credit: "現金", description: "仮払金支払" },
  { debit: "現金", credit: "仮受金", description: "仮受金受取" },
];

// 金額生成（1,000円単位）
function generateAmount() {
  return Math.floor(Math.random() * 500 + 50) * 1000;
}

// 日付生成（1日から28日）
function generateDay() {
  return Math.floor(Math.random() * 28) + 1;
}

// 仕訳データを生成
function generateJournalEntries() {
  const entries = [];
  const days = [];

  // 3-5個の取引を生成
  const numEntries = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < numEntries; i++) {
    let day;
    do {
      day = generateDay();
    } while (days.includes(day));
    days.push(day);

    const transaction =
      TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)];
    const amount = generateAmount();

    entries.push({
      day,
      debit: transaction.debit,
      credit: transaction.credit,
      amount,
      description: transaction.description,
    });
  }

  // 日付順にソート
  entries.sort((a, b) => a.day - b.day);

  return entries;
}

// 問題文を生成
function generateQuestionText(questionId, pattern) {
  const entries = generateJournalEntries();
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;

  // 転記対象の勘定科目を選択（最初の取引の借方または貸方）
  const targetAccount =
    Math.random() > 0.5 ? entries[0].debit : entries[0].credit;

  // 前期繰越残高を生成
  const beginningBalance = generateAmount();
  const balanceType = [
    "現金",
    "商品",
    "売掛金",
    "仕入",
    "給料",
    "家賃",
  ].includes(targetAccount)
    ? "借方残高"
    : "貸方残高";

  // 仕訳帳のテキストを作成
  let journalText = `【仕訳帳】\\n${year}年${month}月\\n`;
  entries.forEach((entry) => {
    journalText += `${entry.day}日 ${entry.debit} ${entry.amount.toLocaleString()} / ${entry.credit} ${entry.amount.toLocaleString()} （${entry.description}）\\n`;
  });

  let questionText = "";

  if (pattern === "general_ledger") {
    // 総勘定元帳転記パターン（Q_L_004〜Q_L_010）
    questionText =
      journalText +
      `\\n上記の仕訳帳から「${targetAccount}」勘定の総勘定元帳への転記を行ってください。\\n` +
      `前期繰越残高：${targetAccount} ${beginningBalance.toLocaleString()}円（${balanceType}）\\n\\n` +
      `【転記指示】\\n` +
      `・${targetAccount}勘定への転記のみを行う\\n` +
      `・摘要欄には取引内容を記入\\n` +
      `・金額は正確に転記する`;
  } else if (pattern === "subsidiary") {
    // 補助簿記入パターン（Q_L_011〜Q_L_020）
    const subsidiaryBooks = [
      "現金出納帳",
      "当座預金出納帳",
      "仕入帳",
      "売上帳",
      "商品有高帳",
    ];
    const book =
      subsidiaryBooks[Math.floor(Math.random() * subsidiaryBooks.length)];

    questionText =
      journalText +
      `\\n上記の仕訳帳から「${book}」への記入を行ってください。\\n` +
      `前月繰越残高：${beginningBalance.toLocaleString()}円\\n\\n` +
      `【記入指示】\\n` +
      `・${book}への記入を正確に行う\\n` +
      `・日付順に記入する\\n` +
      `・残高を正確に計算する`;
  } else if (pattern === "slip") {
    // 伝票記入パターン（Q_L_021〜Q_L_030）
    const slipTypes = ["入金伝票", "出金伝票", "振替伝票"];
    const slipType = slipTypes[Math.floor(Math.random() * slipTypes.length)];

    questionText =
      journalText +
      `\\n上記の取引について「${slipType}」を作成してください。\\n\\n` +
      `【作成指示】\\n` +
      `・${slipType}の様式に従って記入\\n` +
      `・日付・金額を正確に記入\\n` +
      `・摘要欄には取引内容を記入`;
  } else {
    // 理論・選択問題パターン（Q_L_031〜Q_L_040）
    const theoryTopics = [
      {
        topic: "勘定科目の5要素分類",
        instruction: "資産・負債・純資産・収益・費用の5要素に分類してください",
      },
      {
        topic: "仕訳の基本原則",
        instruction: "借方・貸方の記入原則を説明してください",
      },
      {
        topic: "帳簿組織の体系",
        instruction: "主要簿と補助簿の関係を説明してください",
      },
      {
        topic: "決算整理仕訳",
        instruction: "決算整理の必要性と種類を説明してください",
      },
      {
        topic: "試算表の作成方法",
        instruction: "合計試算表と残高試算表の違いを説明してください",
      },
    ];

    const theory =
      theoryTopics[Math.floor(Math.random() * theoryTopics.length)];

    questionText =
      `【簿記理論問題】\\n\\n` +
      `${theory.topic}について、以下の点を説明してください。\\n\\n` +
      `【説明事項】\\n` +
      `・${theory.instruction}\\n` +
      `・具体例を挙げて説明する\\n` +
      `・実務での重要性を述べる`;
  }

  return questionText;
}

// 問題パターンを決定
function getQuestionPattern(questionId) {
  const num = parseInt(questionId.replace("Q_L_", ""));

  if (num >= 4 && num <= 10) {
    return "general_ledger"; // 総勘定元帳転記
  } else if (num >= 11 && num <= 20) {
    return "subsidiary"; // 補助簿記入
  } else if (num >= 21 && num <= 30) {
    return "slip"; // 伝票記入
  } else {
    return "theory"; // 理論・選択問題
  }
}

// ファイルを更新
function updateFile(filePath) {
  console.log(`\n更新中: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf-8");
  let updateCount = 0;

  // Q_L_004からQ_L_040までを処理
  for (let i = 4; i <= 40; i++) {
    const questionId = `Q_L_${String(i).padStart(3, "0")}`;
    const pattern = getQuestionPattern(questionId);
    const newQuestionText = generateQuestionText(questionId, pattern);

    // 正規表現パターンを作成（TypeScript用とJavaScript用で微妙に違う）
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
  console.log("Q_L_004〜Q_L_040の問題文を生成・修正します...\n");

  let totalUpdated = 0;

  FILES_TO_UPDATE.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      totalUpdated += updateFile(filePath);
    } else {
      console.log(`⚠️  ファイルが見つかりません: ${filePath}`);
    }
  });

  console.log(`\n✅ 完了！合計 ${totalUpdated} 件の問題を更新しました。`);
}

// スクリプト実行
main();
