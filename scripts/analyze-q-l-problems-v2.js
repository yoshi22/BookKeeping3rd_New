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

// 各Q_L問題のIDを探し、そのcorrect_answer_jsonを抽出
for (let i = 1; i <= 50; i++) {
  const questionId = `Q_L_${String(i).padStart(3, "0")}`;

  // 該当する問題のIDを探す
  const idPattern = new RegExp(`id: "${questionId}"`);
  const idMatch = questionsContent.search(idPattern);

  if (idMatch !== -1) {
    // correct_answer_jsonの部分を抽出
    const answerPattern = new RegExp(
      `id: "${questionId}"[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
    );
    const answerMatch = questionsContent.match(answerPattern);

    if (answerMatch && answerMatch[1]) {
      try {
        const correctAnswer = JSON.parse(answerMatch[1]);
        qLProblems.push({
          id: questionId,
          correctAnswer: correctAnswer,
        });
      } catch (e) {
        console.log(`❌ ${questionId}: JSONパースエラー - ${e.message}`);
      }
    } else {
      console.log(`⚠️ ${questionId}: correct_answer_json が見つかりません`);
    }
  } else {
    // Q_L_050より大きい番号は存在しない可能性があるのでスキップ
    if (i <= 10) {
      console.log(`⚠️ ${questionId}: 問題が見つかりません`);
    }
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
  } else {
    console.log(`⚠️ ${id}: entries配列が見つかりません`);
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
  incorrectProblems.slice(0, 15).forEach((problem) => {
    console.log(
      `  ${problem.id}: 日付="${problem.date}", 摘要="${problem.description}", 問題=[${problem.issues.join(", ")}]`,
    );
  });

  if (incorrectProblems.length > 15) {
    console.log(`  ... 他 ${incorrectProblems.length - 15}問`);
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

// 具体的な修正パターンの提案
if (qL001) {
  console.log("\n💡 **Q_L_001の正しい修正例**:");
  console.log("問題文に基づく正答データは以下のようになるべき:");
  console.log("前月繰越: 残高 337,541円");
  console.log("10月5日 現金売上: 借方 276,641円, 残高 614,182円");
  console.log("10月10日 給料支払: 貸方 215,025円, 残高 399,157円");
  console.log("10月15日 売掛金回収: 借方 184,924円, 残高 584,081円");
  console.log("10月20日 買掛金支払: 貸方 241,381円, 残高 342,700円");
  console.log("10月28日 現金過不足: 貸方 8,502円, 残高 334,198円");
}
