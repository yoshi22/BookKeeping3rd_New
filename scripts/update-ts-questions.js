#!/usr/bin/env node

/**
 * master-questions.ts を master-questions.js の内容で更新
 */

const fs = require("fs");
const path = require("path");

// ファイルパス
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const jsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.js",
);

console.log(
  "📝 master-questions.js から master-questions.ts への同期を開始...\n",
);

// JavaScriptファイルから questions を読み込み
const jsContent = fs.readFileSync(jsFilePath, "utf8");
const jsQuestionsMatch = jsContent.match(
  /exports\.masterQuestions = (\[[\s\S]*?\]);/,
);

if (!jsQuestionsMatch) {
  console.error(
    "❌ master-questions.js から questions データを抽出できませんでした",
  );
  process.exit(1);
}

// evalを使って JavaScript オブジェクトを取得（注意: セキュリティリスク）
let jsQuestions;
eval("jsQuestions = " + jsQuestionsMatch[1]);

// Q_L_ で始まる問題のみを抽出
const ledgerQuestions = jsQuestions.filter((q) => q.id.startsWith("Q_L_"));

console.log(`📋 ${ledgerQuestions.length} 件の帳簿問題を更新します\n`);

// TypeScriptファイルを読み込み
let tsContent = fs.readFileSync(tsFilePath, "utf8");

// 各問題を更新
let updateCount = 0;
ledgerQuestions.forEach((jsQuestion) => {
  const questionId = jsQuestion.id;

  // TypeScriptファイル内の該当問題を検索
  const tsQuestionRegex = new RegExp(
    `(\\{\\s*"id":\\s*"${questionId}"[^}]*?"question_text":\\s*)"[^"]*?"`,
    "s",
  );

  if (tsContent.match(tsQuestionRegex)) {
    // question_text を置換
    const escapedText = JSON.stringify(jsQuestion.question_text).slice(1, -1);
    tsContent = tsContent.replace(tsQuestionRegex, `$1"${escapedText}"`);

    // answer_template_json も更新
    const templateRegex = new RegExp(
      `("id":\\s*"${questionId}"[^}]*?"answer_template_json":\\s*)"[^"]*?"`,
      "s",
    );
    if (jsQuestion.answer_template_json) {
      const escapedTemplate = jsQuestion.answer_template_json
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
      tsContent = tsContent.replace(templateRegex, `$1"${escapedTemplate}"`);
    }

    console.log(`  ✓ ${questionId} を更新しました`);
    updateCount++;
  } else {
    console.log(`  ⚠ ${questionId} が見つかりませんでした`);
  }
});

// ファイルを保存
fs.writeFileSync(tsFilePath, tsContent, "utf8");

console.log(`\n✨ 更新完了: ${updateCount}/${ledgerQuestions.length} 問`);
console.log("\n📌 アプリを再起動して変更を反映させてください");
