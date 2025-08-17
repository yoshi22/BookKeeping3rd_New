#!/usr/bin/env node

/**
 * 手動仕訳修正スクリプト
 * 各問題に応じた正しい仕訳データを個別に設定
 */

const fs = require("fs");
const path = require("path");

function manualFixEntries() {
  console.log("手動仕訳修正スクリプト開始...");

  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  let content = fs.readFileSync(masterQuestionsPath, "utf-8");

  // 各問題の仕訳を個別に修正
  const fixes = [
    {
      id: "Q_J_001",
      debit: "現金過不足",
      debit_amount: "500,000",
      credit: "現金",
      credit_amount: "500,000",
    },
    {
      id: "Q_J_002",
      debit: "小口現金",
      debit_amount: "600,000",
      credit: "現金",
      credit_amount: "600,000",
    },
    {
      id: "Q_J_003",
      debit: "当座預金",
      debit_amount: "600,000",
      credit: "売掛金",
      credit_amount: "600,000",
    },
    {
      id: "Q_J_004",
      debit: "買掛金",
      debit_amount: "100,000",
      credit: "当座借越",
      credit_amount: "100,000",
    },
    {
      id: "Q_J_005",
      debit: "現金過不足",
      debit_amount: "200,000",
      credit: "現金",
      credit_amount: "200,000",
    },
    {
      id: "Q_J_006",
      debit: "小口現金",
      debit_amount: "250,000",
      credit: "現金",
      credit_amount: "250,000",
    },
  ];

  fixes.forEach((fix) => {
    const questionPattern = new RegExp(
      `(id:\\s*"${fix.id}"[\\s\\S]*?explanation:\\s*"[\\s\\S]*?)【この問題の仕訳】\\\\n【この問題の仕訳】\\\\n（仕訳データの解析に失敗しました）([\\s\\S]*?",[\\s\\S]*?difficulty:)`,
      "g",
    );

    const replacement = `$1【この問題の仕訳】\\n借方：${fix.debit} ${fix.debit_amount}円\\n貸方：${fix.credit} ${fix.credit_amount}円$2`;

    const before = content;
    content = content.replace(questionPattern, replacement);

    if (content !== before) {
      console.log(`修正完了: ${fix.id} - ${fix.debit}/${fix.credit}`);
    } else {
      console.log(`修正失敗: ${fix.id}`);
    }
  });

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-manual-${Date.now()}`;
  fs.copyFileSync(masterQuestionsPath, backupPath);

  // 変更を保存
  fs.writeFileSync(masterQuestionsPath, content, "utf-8");

  console.log("手動仕訳修正完了！");
  console.log(`バックアップファイル: ${backupPath}`);
}

// スクリプト実行
if (require.main === module) {
  manualFixEntries();
}

module.exports = { manualFixEntries };
