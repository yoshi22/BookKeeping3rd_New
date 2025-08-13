#!/usr/bin/env node

/**
 * 仕訳問題テンプレート修正スクリプト
 * 全ての第1問（Q_J_001-250）のanswer_template_jsonを正しい形式に修正
 *
 * 誤った形式: date, description, balance などのフィールド
 * 正しい形式: 仕訳入力に必要な標準フィールドのみ
 */

const fs = require("fs");
const path = require("path");

// 正しいテンプレート形式（単一仕訳用）
const CORRECT_SINGLE_ENTRY_TEMPLATE = {
  type: "journal_entry",
  journalEntry: {
    debit_account: "",
    debit_amount: 0,
    credit_account: "",
    credit_amount: 0,
  },
};

// 正しいテンプレート形式（複合仕訳用）
const CORRECT_MULTIPLE_ENTRY_TEMPLATE = {
  type: "journal_entry",
  journalEntry: {
    entries: [
      {
        debit_account: "",
        debit_amount: 0,
        credit_account: "",
        credit_amount: 0,
      },
    ],
  },
};

function fixJournalEntryTemplates() {
  console.log("🔧 仕訳問題テンプレート修正開始");
  console.log("=================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  let fileContent = fs.readFileSync(filePath, "utf8");

  let fixedCount = 0;
  let errorCount = 0;
  const fixedQuestions = [];

  // 第1問の問題のみを対象とする（Q_J_001からQ_J_250）
  for (let i = 1; i <= 250; i++) {
    const questionId = `Q_J_${String(i).padStart(3, "0")}`;

    // 該当する問題を検索
    const questionRegex = new RegExp(
      `id: "${questionId}",[\\s\\S]*?answer_template_json:\\s*'([^']+)'[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
      "g",
    );

    const match = questionRegex.exec(fileContent);

    if (match) {
      const currentTemplate = match[1];
      const correctAnswer = match[2];

      // 現在のテンプレートが間違った形式（date, description, balance等を含む）かチェック
      if (
        currentTemplate.includes('"date"') ||
        currentTemplate.includes('"description"') ||
        currentTemplate.includes('"balance"') ||
        !currentTemplate.includes('"journal_entry"')
      ) {
        // 正答データから複合仕訳かどうかを判定
        let newTemplate;
        if (correctAnswer.includes('"entries"')) {
          // 複合仕訳の場合
          newTemplate = JSON.stringify(CORRECT_MULTIPLE_ENTRY_TEMPLATE);
        } else {
          // 単一仕訳の場合
          newTemplate = JSON.stringify(CORRECT_SINGLE_ENTRY_TEMPLATE);
        }

        // テンプレートを置換
        const replaceRegex = new RegExp(
          `(id: "${questionId}"[\\s\\S]*?answer_template_json:\\s*)'[^']+'`,
          "g",
        );

        fileContent = fileContent.replace(replaceRegex, `$1'${newTemplate}'`);

        fixedCount++;
        fixedQuestions.push(questionId);
        console.log(`✅ ${questionId}: テンプレート修正完了`);

        // 10問ごとに進捗表示
        if (fixedCount % 10 === 0) {
          console.log(`  📊 進捗: ${fixedCount}問修正済み`);
        }
      }
    } else {
      errorCount++;
      console.log(`⚠️ ${questionId}: 問題が見つかりませんでした`);
    }
  }

  // ファイルに書き戻し
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log("\n📊 修正結果:");
  console.log(`  対象問題数: 250問`);
  console.log(`  修正済み: ${fixedCount}問`);
  console.log(`  エラー: ${errorCount}問`);
  console.log(`  修正率: ${Math.round((fixedCount / 250) * 100)}%`);

  if (fixedCount > 0) {
    console.log("\n🎉 仕訳問題テンプレート修正が完了しました！");
    console.log("修正された問題:");
    // 最初の10問と最後の10問を表示
    if (fixedQuestions.length <= 20) {
      console.log(fixedQuestions.join(", "));
    } else {
      console.log(
        fixedQuestions.slice(0, 10).join(", ") +
          " ... " +
          fixedQuestions.slice(-10).join(", "),
      );
    }
  } else {
    console.log("\n✅ 修正が必要な問題はありませんでした。");
  }

  return fixedCount > 0;
}

// 実行
try {
  const success = fixJournalEntryTemplates();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ 仕訳テンプレート修正エラー:", error);
  process.exit(1);
}
