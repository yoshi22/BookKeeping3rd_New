const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_030の詳細検証\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

let questionsContent = fs.readFileSync(questionsPath, "utf8");

// Q_L_030の詳細チェック
const questionRegex = new RegExp(
  `id: "Q_L_030",[\\s\\S]*?question_text:\\s*"([\\s\\S]*?)"`,
  "g",
);

const questionMatch = questionRegex.exec(questionsContent);

if (questionMatch) {
  const questionText = questionMatch[1];

  console.log("📝 Q_L_030の問題文内容:");
  console.log("─".repeat(50));
  console.log(questionText);
  console.log("─".repeat(50));

  console.log(`📏 文字数: ${questionText.length}文字`);
  console.log(
    `🎫 "5伝票制"を含む: ${questionText.includes("5伝票制") ? "✅" : "❌"}`,
  );
  console.log(
    `💰 "現金"を含む: ${questionText.includes("現金") ? "✅" : "❌"}`,
  );
  console.log(
    `📊 "前月繰越"を含む: ${questionText.includes("前月繰越") ? "✅" : "❌"}`,
  );
  console.log(`📏 300文字以上: ${questionText.length > 300 ? "✅" : "❌"}`);

  // 汎用テンプレートではないかチェック
  const isNotGeneric = !questionText.includes(
    "複数の収入・支出取引（詳細は問題文参照）",
  );
  console.log(`🚫 汎用テンプレートでない: ${isNotGeneric ? "✅" : "❌"}`);

  // 総合判定
  const passesAll =
    questionText.includes("5伝票制") &&
    questionText.includes("現金") &&
    questionText.includes("前月繰越") &&
    questionText.length > 300 &&
    isNotGeneric;

  console.log(`\n🎯 総合判定: ${passesAll ? "✅ 修正完了" : "❌ 修正不十分"}`);

  if (!passesAll) {
    console.log("\n⚠️ 判定失敗の理由:");
    if (!questionText.includes("5伝票制"))
      console.log("- 「5伝票制」が見つからない");
    if (!questionText.includes("現金")) console.log("- 「現金」が見つからない");
    if (!questionText.includes("前月繰越"))
      console.log("- 「前月繰越」が見つからない");
    if (questionText.length <= 300)
      console.log(`- 文字数不足: ${questionText.length}文字`);
    if (!isNotGeneric) console.log("- 汎用テンプレートが含まれている");
  }
} else {
  console.log("❌ Q_L_030が見つかりませんでした");
}

// 正答データも確認
console.log("\n💰 Q_L_030の正答データ:");
const answerRegex = new RegExp(
  `id: "Q_L_030",[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
  "g",
);

const answerMatch = answerRegex.exec(questionsContent);

if (answerMatch) {
  const answerJson = answerMatch[1];
  try {
    const answerData = JSON.parse(answerJson);
    console.log(
      `📊 エントリ数: ${answerData.entries ? answerData.entries.length : 0}件`,
    );

    if (answerData.entries && answerData.entries.length > 0) {
      console.log("📅 日付確認:");
      answerData.entries.forEach((entry, index) => {
        console.log(
          `  ${index + 1}. ${entry.date}: ${entry.description} - ${entry.debit || 0}/${entry.credit || 0}`,
        );
      });

      const hasValidDates =
        !answerJson.includes('"date":"8/33"') &&
        !answerJson.includes('"date":"8/40"');
      console.log(`✅ 有効な日付: ${hasValidDates ? "✅" : "❌"}`);
    }
  } catch (e) {
    console.log("❌ JSONパースエラー");
  }
} else {
  console.log("❌ 正答データが見つかりませんでした");
}
