/**
 * Q2_L問題のインデックス不整合チェックスクリプト
 *
 * answer_template_json.blanks[].index と correct_answer_json.blanks[].index の
 * 不整合を検出し、修正が必要な問題をリスト化する
 */

const fs = require("fs");
const path = require("path");

// master-questions.tsを読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);
const content = fs.readFileSync(masterQuestionsPath, "utf-8");

// Q2_L問題を抽出する正規表現
const q2LQuestions = [];
const questionPattern =
  /\{[\s\S]*?id:\s*"(Q2_L_\d+)"[\s\S]*?answer_template_json:\s*'([^']+)'[\s\S]*?correct_answer_json:\s*'([^']+)'[\s\S]*?\}/g;

let match;
while ((match = questionPattern.exec(content)) !== null) {
  const [, id, answerTemplate, correctAnswer] = match;

  try {
    const template = JSON.parse(answerTemplate);
    const correct = JSON.parse(correctAnswer);

    if (
      template.type === "fill_in_ledger" &&
      template.blanks &&
      correct.blanks
    ) {
      q2LQuestions.push({
        id,
        templateBlanks: template.blanks,
        correctBlanks: correct.blanks,
      });
    }
  } catch (error) {
    console.error(`❌ ${id}: JSON解析エラー`, error.message);
  }
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  Q2_L問題のインデックス整合性チェック");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

let mismatchCount = 0;
const mismatches = [];

q2LQuestions.forEach((question, idx) => {
  const { id, templateBlanks, correctBlanks } = question;

  // インデックス配列を取得
  const templateIndices = templateBlanks
    .map((b) => b.index)
    .sort((a, b) => a - b);
  const correctIndices = correctBlanks
    .map((b) => b.index)
    .sort((a, b) => a - b);

  // インデックスが一致しているか確認
  const isMatch =
    templateIndices.length === correctIndices.length &&
    templateIndices.every((val, i) => val === correctIndices[i]);

  if (!isMatch) {
    mismatchCount++;
    console.log(`❌ ${id}:`);
    console.log(`   answer_template indices: [${templateIndices.join(", ")}]`);
    console.log(`   correct_answer indices:  [${correctIndices.join(", ")}]`);
    console.log("");

    mismatches.push({
      id,
      templateIndices,
      correctIndices,
      templateBlanks,
      correctBlanks,
    });
  } else {
    console.log(`✅ ${id}: インデックス一致`);
  }
});

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(
  `  検査結果: ${q2LQuestions.length}問中 ${mismatchCount}問に不整合`,
);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (mismatchCount > 0) {
  console.log("修正が必要な問題の詳細:");
  console.log("");

  mismatches.forEach(
    ({
      id,
      templateIndices,
      correctIndices,
      templateBlanks,
      correctBlanks,
    }) => {
      console.log(`${id}:`);
      console.log(`  修正前: ${JSON.stringify(correctBlanks)}`);

      // 修正後のデータを生成
      const fixed = templateBlanks.map((tb, idx) => ({
        index: tb.index,
        correctIndex: correctBlanks[idx]?.correctIndex || 0,
      }));

      console.log(`  修正後: ${JSON.stringify(fixed)}`);
      console.log("");
    },
  );

  // 修正スクリプト用のデータを出力
  const fixData = JSON.stringify(mismatches, null, 2);
  const fixDataPath = path.join(
    __dirname,
    "../data/q2-ledger-index-fixes.json",
  );
  fs.writeFileSync(fixDataPath, fixData, "utf-8");
  console.log(`\n修正データを保存しました: ${fixDataPath}`);
}

process.exit(mismatchCount > 0 ? 1 : 0);
