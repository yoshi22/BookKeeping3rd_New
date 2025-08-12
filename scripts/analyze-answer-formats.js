/**
 * 全問題の answer_template_json と correct_answer_json のフォーマットを分析
 */

const fs = require("fs");
const path = require("path");

// master-questions.js ファイルを読み込み（コンパイル済みJSファイル）
const { masterQuestions } = require("../src/data/master-questions.js");
const questions = masterQuestions;

// 分析結果を格納
const analysis = {
  total: questions.length,
  byCategory: {},
  formatMismatches: [],
  emptyCorrectAnswers: [],
  samplesByCategory: {},
};

// カテゴリー別に分析
questions.forEach((q) => {
  const category = q.category_id;

  if (!analysis.byCategory[category]) {
    analysis.byCategory[category] = {
      count: 0,
      templateFormats: new Set(),
      correctAnswerFormats: new Set(),
      mismatches: [],
    };
  }

  analysis.byCategory[category].count++;

  // テンプレートと正答のフォーマットを解析
  let templateFormat = "unknown";
  let correctFormat = "unknown";
  let templateData = null;
  let correctData = null;

  try {
    templateData = JSON.parse(q.answer_template_json);
    if (templateData.type) {
      templateFormat = templateData.type;
    } else if (templateData.fields) {
      templateFormat = "fields-based";
    } else if (templateData.vouchers) {
      templateFormat = "voucher-based";
    } else if (templateData.columns) {
      templateFormat = "columns-based";
    }
  } catch (e) {
    templateFormat = "invalid-json";
  }

  try {
    correctData = JSON.parse(q.correct_answer_json);
    if (correctData.journalEntry) {
      correctFormat = "journalEntry";
    } else if (correctData.ledgerEntry) {
      correctFormat = "ledgerEntry";
    } else if (correctData.trialBalance) {
      correctFormat = "trialBalance";
    } else if (correctData.entries) {
      correctFormat = "entries-array";
    } else if (correctData.selected !== undefined) {
      correctFormat = "single-choice";
    } else if (correctData.selected_options) {
      correctFormat = "multiple-choice";
    } else if (correctData.debits && correctData.credits) {
      correctFormat = "debits-credits";
    } else {
      // 直接のフィールドを確認
      const keys = Object.keys(correctData);
      if (keys.includes("debit_account") || keys.includes("credit_account")) {
        correctFormat = "direct-journal";
      } else if (keys.includes("date") || keys.includes("description")) {
        correctFormat = "direct-ledger";
      } else {
        correctFormat = "other: " + keys.slice(0, 3).join(",");
      }
    }
  } catch (e) {
    correctFormat = "invalid-json";
  }

  analysis.byCategory[category].templateFormats.add(templateFormat);
  analysis.byCategory[category].correctAnswerFormats.add(correctFormat);

  // 空の正答をチェック
  if (
    !q.correct_answer_json ||
    q.correct_answer_json === "{}" ||
    q.correct_answer_json === "[]"
  ) {
    analysis.emptyCorrectAnswers.push({
      id: q.id,
      category: category,
      title: q.question_text.substring(0, 50),
    });
  }

  // フォーマット不一致をチェック（特に試算表）
  if (category === "trial_balance") {
    const mismatch = {
      id: q.id,
      templateFormat,
      correctFormat,
      templateKeys: templateData ? Object.keys(templateData).sort() : [],
      correctKeys: correctData ? Object.keys(correctData).sort() : [],
    };

    // 試算表の詳細分析
    if (templateData && correctData) {
      mismatch.templateType = templateData.type;
      mismatch.hasAccounts = !!templateData.accounts;
      mismatch.correctHasEntries = !!correctData.entries;
      mismatch.correctEntriesCount = correctData.entries
        ? correctData.entries.length
        : 0;
    }

    analysis.byCategory[category].mismatches.push(mismatch);
  }

  // 各カテゴリーの最初の問題をサンプルとして保存
  if (!analysis.samplesByCategory[category]) {
    analysis.samplesByCategory[category] = {
      id: q.id,
      template: templateData,
      correct: correctData,
    };
  }
});

// 結果を表示
console.log("=== 問題フォーマット分析結果 ===\n");
console.log(`総問題数: ${analysis.total}`);
console.log(`空の正答: ${analysis.emptyCorrectAnswers.length} 件\n`);

// カテゴリー別サマリー
Object.entries(analysis.byCategory).forEach(([category, data]) => {
  console.log(`\n【${category}】 (${data.count} 問)`);
  console.log(
    "  テンプレート形式:",
    Array.from(data.templateFormats).join(", "),
  );
  console.log("  正答形式:", Array.from(data.correctAnswerFormats).join(", "));

  if (category === "trial_balance" && data.mismatches.length > 0) {
    console.log("\n  試算表問題の詳細分析:");
    data.mismatches.slice(0, 3).forEach((m) => {
      console.log(`    ${m.id}:`);
      console.log(
        `      テンプレート: ${m.templateFormat} (keys: ${m.templateKeys.join(", ")})`,
      );
      console.log(
        `      正答: ${m.correctFormat} (keys: ${m.correctKeys.join(", ")})`,
      );
      if (m.correctHasEntries) {
        console.log(`      正答エントリ数: ${m.correctEntriesCount}`);
      }
    });
  }
});

// 空の正答リスト
if (analysis.emptyCorrectAnswers.length > 0) {
  console.log("\n\n=== 空の正答を持つ問題 ===");
  analysis.emptyCorrectAnswers.forEach((q) => {
    console.log(`  ${q.id} (${q.category}): ${q.title}`);
  });
}

// サンプルデータを表示
console.log("\n\n=== 各カテゴリーのサンプルデータ ===");
Object.entries(analysis.samplesByCategory).forEach(([category, sample]) => {
  console.log(`\n【${category}】 ${sample.id}`);
  console.log(
    "Template:",
    JSON.stringify(sample.template, null, 2).substring(0, 200),
  );
  console.log(
    "Correct:",
    JSON.stringify(sample.correct, null, 2).substring(0, 200),
  );
});

// JSONファイルに保存
fs.writeFileSync(
  path.join(__dirname, "answer-format-analysis.json"),
  JSON.stringify(analysis, null, 2),
);

console.log(
  "\n\n詳細な分析結果を answer-format-analysis.json に保存しました。",
);
