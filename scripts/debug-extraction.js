const fs = require("fs");
const path = require("path");

console.log("🔍 JSON抽出デバッグスクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 問題抽出関数（デバッグ版）
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の抽出デバッグ ---`);

  // より緩い正規表現を使用
  const questionPattern = new RegExp(
    `{[\\s\\S]*?id:\\s*"${questionId}"[\\s\\S]*?}(?=,\\s*{|\\s*\\];)`,
    "g",
  );
  const match = content.match(questionPattern);

  if (!match) {
    console.log(`❌ ${questionId}: 問題データが見つかりません`);
    return null;
  }

  const questionData = match[0];
  console.log(`📋 問題データの長さ: ${questionData.length} 文字`);

  // 各フィールドを抽出（デバッグ版）
  const extractField = (fieldName) => {
    // シングル・ダブルクォート両方対応、改行も考慮
    const fieldPattern = new RegExp(
      `${fieldName}:\\s*["']([\\s\\S]*?)["']\\s*,?`,
      "",
    );
    const fieldMatch = questionData.match(fieldPattern);

    if (fieldMatch) {
      console.log(
        `✅ ${fieldName}: 見つかりました (${fieldMatch[1].length} 文字)`,
      );
      if (fieldName === "correct_answer_json") {
        console.log(
          `🔍 正答JSON内容の最初100文字: "${fieldMatch[1].substring(0, 100)}..."`,
        );

        // JSON解析を試行
        try {
          const parsed = JSON.parse(fieldMatch[1]);
          console.log(
            `✅ JSON解析成功: ${JSON.stringify(parsed).substring(0, 100)}...`,
          );
        } catch (e) {
          console.log(`❌ JSON解析エラー: ${e.message}`);
          console.log(`🔍 問題のあるJSON: "${fieldMatch[1]}"`);
        }
      }
      return fieldMatch[1];
    } else {
      console.log(`❌ ${fieldName}: 見つかりません`);
      return null;
    }
  };

  return {
    id: questionId,
    title: extractField("title"),
    question_text: extractField("question_text"),
    answer_template_json: extractField("answer_template_json"),
    correct_answer_json: extractField("correct_answer_json"),
    difficulty: extractField("difficulty"),
    tags_json: extractField("tags_json"),
  };
}

// テスト用に数問だけ抽出
const testQuestions = ["Q_L_001", "Q_L_002", "Q_L_015", "Q_L_016"];

for (const questionId of testQuestions) {
  const result = extractQuestionData(questionsContent, questionId);
  console.log(`\n📊 ${questionId} 抽出結果まとめ:`);
  if (result) {
    console.log(`- title: ${result.title ? "あり" : "なし"}`);
    console.log(
      `- question_text: ${result.question_text ? result.question_text.length + "文字" : "なし"}`,
    );
    console.log(
      `- answer_template_json: ${result.answer_template_json ? result.answer_template_json.length + "文字" : "なし"}`,
    );
    console.log(
      `- correct_answer_json: ${result.correct_answer_json ? result.correct_answer_json.length + "文字" : "なし"}`,
    );
    console.log(`- difficulty: ${result.difficulty || "なし"}`);
    console.log(
      `- tags_json: ${result.tags_json ? result.tags_json.length + "文字" : "なし"}`,
    );
  }
  console.log("\n" + "=".repeat(60));
}
