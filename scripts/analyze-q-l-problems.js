const fs = require("fs");
const path = require("path");

// 問題データファイルのパス
const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔍 第二問（帳簿問題）Q_L_001〜Q_L_050の正答データ分析\n");

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// Q_L問題のパターンを検索
const qLProblems = [];
const qLPattern = /(Q_L_\d{3})[^}]*?correct_answer_json:\s*'([^']+)'/g;
let match;

while ((match = qLPattern.exec(questionsContent)) !== null) {
  const [_, questionId, correctAnswerJson] = match;

  try {
    const correctAnswer = JSON.parse(correctAnswerJson);
    qLProblems.push({
      id: questionId,
      correctAnswer: correctAnswer,
    });
  } catch (e) {
    console.log(`❌ ${questionId}: JSONパースエラー - ${e.message}`);
  }
}

console.log(`📊 分析対象: ${qLProblems.length}問\n`);

// 汎用テンプレートデータのパターン分析
let genericTemplateCount = 0;
let correctDatePatterns = {};
let correctDescriptions = {};
let incorrectProblems = [];

qLProblems.forEach((problem) => {
  const { id, correctAnswer } = problem;

  if (correctAnswer.entries && Array.isArray(correctAnswer.entries)) {
    const firstEntry = correctAnswer.entries[0];

    if (firstEntry) {
      const date = firstEntry.date;
      const description = firstEntry.description;

      // 汎用テンプレートの検出
      const isGenericTemplate =
        date === "2025-08-11" ||
        description === "ledgerEntry" ||
        (firstEntry.debit &&
          firstEntry.debit.entries &&
          firstEntry.debit.entries[0]?.description === "総勘定元帳転記");

      if (isGenericTemplate) {
        genericTemplateCount++;
        incorrectProblems.push({
          id,
          date,
          description,
          issues: [],
        });

        if (date === "2025-08-11") {
          incorrectProblems[incorrectProblems.length - 1].issues.push(
            "汎用日付",
          );
        }
        if (description === "ledgerEntry") {
          incorrectProblems[incorrectProblems.length - 1].issues.push(
            "汎用摘要",
          );
        }
        if (firstEntry.debit?.entries?.[0]?.description === "総勘定元帳転記") {
          incorrectProblems[incorrectProblems.length - 1].issues.push(
            "汎用金額データ",
          );
        }
      } else {
        // 正しいパターンの記録
        correctDatePatterns[date] = (correctDatePatterns[date] || 0) + 1;
        correctDescriptions[description] =
          (correctDescriptions[description] || 0) + 1;
      }
    }
  }
});

// 結果出力
console.log("🚨 **重大な問題を発見**:");
console.log(
  `  汎用テンプレートデータを使用している問題数: ${genericTemplateCount}/${qLProblems.length}問`,
);
console.log(`  正しい問題数: ${qLProblems.length - genericTemplateCount}問\n`);

if (incorrectProblems.length > 0) {
  console.log("❌ **汎用テンプレートを使用している問題一覧**:");
  incorrectProblems.slice(0, 10).forEach((problem) => {
    console.log(
      `  ${problem.id}: 日付="${problem.date}", 摘要="${problem.description}", 問題=[${problem.issues.join(", ")}]`,
    );
  });

  if (incorrectProblems.length > 10) {
    console.log(`  ... 他 ${incorrectProblems.length - 10}問`);
  }
}

if (Object.keys(correctDatePatterns).length > 0) {
  console.log("\n✅ **正しい日付パターン**:");
  Object.entries(correctDatePatterns).forEach(([date, count]) => {
    console.log(`  ${date}: ${count}問`);
  });
}

if (Object.keys(correctDescriptions).length > 0) {
  console.log("\n✅ **正しい摘要パターン**:");
  Object.entries(correctDescriptions)
    .slice(0, 10)
    .forEach(([desc, count]) => {
      console.log(`  "${desc}": ${count}問`);
    });
}

// 代表的な問題の詳細分析
console.log("\n🔍 **代表的な問題の詳細**:");

// Q_L_001の詳細
const qL001 = qLProblems.find((p) => p.id === "Q_L_001");
if (qL001) {
  console.log("\nQ_L_001の現在の正答データ:");
  console.log(JSON.stringify(qL001.correctAnswer, null, 2));
}

// 修正の必要性
console.log("\n🎯 **修正の必要性**:");
console.log(`- ${genericTemplateCount}問の正答データが問題文と不整合`);
console.log(
  "- 各問題の具体的な取引内容に基づいて正答データを再生成する必要あり",
);
console.log("- 日付、摘要、金額すべてが問題文に基づいて修正されるべき");
