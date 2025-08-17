#!/usr/bin/env node

/**
 * 仕訳データ修正スクリプト
 * 解説の仕訳部分を正しいデータで修正
 */

const fs = require("fs");
const path = require("path");

// 正しい仕訳データ
const correctEntries = {
  Q_J_001: {
    debit: "現金過不足",
    debit_amount: "500,000",
    credit: "現金",
    credit_amount: "500,000",
  },
  Q_J_002: {
    debit: "小口現金",
    debit_amount: "600,000",
    credit: "現金",
    credit_amount: "600,000",
  },
  Q_J_003: {
    debit: "当座預金",
    debit_amount: "600,000",
    credit: "売掛金",
    credit_amount: "600,000",
  },
  Q_J_004: {
    debit: "買掛金",
    debit_amount: "100,000",
    credit: "当座借越",
    credit_amount: "100,000",
  },
  Q_J_005: {
    debit: "現金過不足",
    debit_amount: "200,000",
    credit: "現金",
    credit_amount: "200,000",
  },
  Q_J_006: {
    debit: "小口現金",
    debit_amount: "250,000",
    credit: "現金",
    credit_amount: "250,000",
  },
  Q_J_007: {
    debit: "当座預金",
    debit_amount: "150,000",
    credit: "売掛金",
    credit_amount: "150,000",
  },
  Q_J_008: {
    debit: "買掛金",
    debit_amount: "300,000",
    credit: "現金",
    credit_amount: "300,000",
  },
  Q_J_009: {
    debit: "商品",
    debit_amount: "400,000",
    credit: "買掛金",
    credit_amount: "400,000",
  },
  Q_J_010: {
    debit: "現金過不足",
    debit_amount: "50,000",
    credit: "現金",
    credit_amount: "50,000",
  },
};

function fixJournalEntries() {
  console.log("仕訳データ修正スクリプト開始...");

  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  let content = fs.readFileSync(masterQuestionsPath, "utf-8");

  // 問題ごとに修正
  Object.entries(correctEntries).forEach(([questionId, entry]) => {
    const oldPattern = `【この問題の仕訳】\\n【この問題の仕訳】\\n（仕訳データの解析に失敗しました）`;
    const newPattern = `【この問題の仕訳】\\n借方：${entry.debit} ${entry.debit_amount}円\\n貸方：${entry.credit} ${entry.credit_amount}円`;

    // 該当する問題IDの範囲で置換
    const questionStartPattern = new RegExp(`id: "${questionId}"`);
    const questionEndPattern = /},\s*{/;

    const questionStart = content.search(questionStartPattern);
    if (questionStart !== -1) {
      let questionEnd = content.indexOf("},", questionStart);
      if (questionEnd === -1) {
        questionEnd = content.length;
      }

      const beforeQuestion = content.substring(0, questionStart);
      const questionSection = content.substring(questionStart, questionEnd);
      const afterQuestion = content.substring(questionEnd);

      const fixedSection = questionSection.replace(
        new RegExp(oldPattern, "g"),
        newPattern,
      );

      content = beforeQuestion + fixedSection + afterQuestion;
      console.log(`修正完了: ${questionId}`);
    }
  });

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-fix-${Date.now()}`;
  fs.copyFileSync(masterQuestionsPath, backupPath);

  // 変更を保存
  fs.writeFileSync(masterQuestionsPath, content, "utf-8");

  console.log("仕訳データ修正完了！");
  console.log(`バックアップファイル: ${backupPath}`);
}

// スクリプト実行
if (require.main === module) {
  fixJournalEntries();
}

module.exports = { fixJournalEntries };
