const fs = require("fs");
const path = require("path");

console.log("🔧 改善された抽出スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 改善された問題抽出関数
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の改善抽出 ---`);

  // まず問題オブジェクト全体を抽出
  const questionPattern = new RegExp(
    `{[\\s\\S]*?id:\\s*"${questionId}"[\\s\\S]*?}(?=,\\s*{|\\s*\\];)`,
    "g",
  );
  const match = content.match(questionPattern);

  if (!match) {
    console.log(`❌ ${questionId}: 問題データが見つかりません`);
    return null;
  }

  const questionDataRaw = match[0];
  console.log(`📋 問題データの長さ: ${questionDataRaw.length} 文字`);

  // より堅牢なフィールド抽出関数
  const extractField = (fieldName) => {
    // TypeScriptオブジェクト形式を考慮したパターン
    const fieldPattern = new RegExp(
      `${fieldName}:\\s*["']((?:[\\s\\S](?!["']\\s*,))*)[\\s\\S]*?["']`,
      "",
    );

    let fieldMatch = questionDataRaw.match(fieldPattern);

    if (!fieldMatch) {
      // 別のパターンを試行（複数行文字列の場合）
      const multilinePattern = new RegExp(
        `${fieldName}:\\s*["']([\\s\\S]*?)["']\\s*,`,
        "",
      );
      fieldMatch = questionDataRaw.match(multilinePattern);
    }

    if (fieldMatch && fieldMatch[1]) {
      const extracted = fieldMatch[1];
      console.log(`✅ ${fieldName}: 見つかりました (${extracted.length} 文字)`);

      if (fieldName === "correct_answer_json") {
        console.log(`🔍 JSON内容: "${extracted.substring(0, 150)}..."`);

        // JSON解析を試行
        try {
          const parsed = JSON.parse(extracted);
          console.log(`✅ JSON解析成功!`);
          console.log(
            `📊 構造: ${JSON.stringify(parsed).substring(0, 200)}...`,
          );
          return extracted;
        } catch (e) {
          console.log(`❌ JSON解析エラー: ${e.message}`);
          return extracted; // エラーでも元の値を返す
        }
      }
      return extracted;
    } else {
      console.log(`❌ ${fieldName}: 見つかりません`);
      return null;
    }
  };

  // 簡易な数値フィールド抽出
  const extractNumericField = (fieldName) => {
    const pattern = new RegExp(`${fieldName}:\\s*(\\d+)`, "");
    const match = questionDataRaw.match(pattern);
    if (match) {
      console.log(`✅ ${fieldName}: ${match[1]}`);
      return match[1];
    } else {
      console.log(`❌ ${fieldName}: 見つかりません`);
      return null;
    }
  };

  // カテゴリIDの抽出
  const extractCategory = () => {
    const pattern = /category_id:\s*["']([^"']+)["']/;
    const match = questionDataRaw.match(pattern);
    if (match) {
      console.log(`✅ category_id: ${match[1]}`);
      return match[1];
    }
    return null;
  };

  return {
    id: questionId,
    category_id: extractCategory(),
    question_text: extractField("question_text"),
    answer_template_json: extractField("answer_template_json"),
    correct_answer_json: extractField("correct_answer_json"),
    difficulty: extractNumericField("difficulty"),
    tags_json: extractField("tags_json"),
    explanation: extractField("explanation"),
  };
}

// テスト実行
const testQuestions = ["Q_L_001", "Q_L_011", "Q_L_015", "Q_L_016"];

let validQuestions = 0;
let invalidQuestions = 0;

for (const questionId of testQuestions) {
  const result = extractQuestionData(questionsContent, questionId);

  if (result) {
    console.log(`\n📊 ${questionId} 詳細結果:`);
    console.log(`- category_id: ${result.category_id || "不明"}`);
    console.log(
      `- question_text長さ: ${result.question_text?.length || 0}文字`,
    );
    console.log(
      `- answer_template_json長さ: ${result.answer_template_json?.length || 0}文字`,
    );
    console.log(
      `- correct_answer_json長さ: ${result.correct_answer_json?.length || 0}文字`,
    );
    console.log(`- difficulty: ${result.difficulty || "不明"}`);
    console.log(`- tags_json長さ: ${result.tags_json?.length || 0}文字`);
    console.log(`- explanation長さ: ${result.explanation?.length || 0}文字`);

    // 問題の妥当性をチェック
    if (result.correct_answer_json && result.correct_answer_json.length > 10) {
      try {
        JSON.parse(result.correct_answer_json);
        validQuestions++;
        console.log(`✅ ${questionId}: 有効な問題データ`);
      } catch {
        invalidQuestions++;
        console.log(`❌ ${questionId}: JSON構文エラーあり`);
      }
    } else {
      invalidQuestions++;
      console.log(`❌ ${questionId}: JSONデータが短すぎる/存在しない`);
    }
  } else {
    invalidQuestions++;
  }

  console.log("\n" + "=".repeat(60));
}

console.log(`\n🎯 抽出テスト結果:`);
console.log(`✅ 有効な問題: ${validQuestions}`);
console.log(`❌ 無効な問題: ${invalidQuestions}`);
console.log(`📊 総テスト問題数: ${testQuestions.length}`);

if (validQuestions > 0) {
  console.log(`\n🔍 結論: 抽出ロジックは改善されました！`);
  console.log(`📝 次のステップ: 全問題での包括的な分析を再実行`);
} else {
  console.log(`\n⚠️ 警告: まだ抽出に問題があります。さらなる調査が必要です。`);
}
