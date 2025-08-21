const fs = require("fs");
const path = require("path");

/**
 * 包括的JSON検証スクリプト - 134問制限問題分析
 * 全問題のJSONフィールドを検証してエラー箇所を特定
 */

function validateAllQuestionsJson() {
  console.log("=== 包括的JSON検証スクリプト ===");

  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  console.log(`対象ファイル: ${filePath}`);

  const content = fs.readFileSync(filePath, "utf8");

  // 全問題データを正規表現で抽出
  const questionPattern = /{[^}]*id:\s*["']([^"']+)["'][^}]*}/gs;
  let matches = [];
  let match;

  console.log("\n1. 問題データの抽出...");

  while ((match = questionPattern.exec(content)) !== null) {
    const questionId = match[1];
    const questionData = match[0];

    // JSONフィールドを抽出
    const tagsMatch = questionData.match(/tags_json:\s*'([^']+)'/);
    const correctAnswerMatch = questionData.match(
      /correct_answer_json:\s*'([^']+)'/,
    );
    const answerTemplateMatch = questionData.match(
      /answer_template_json:\s*'([^']+)'/,
    );

    matches.push({
      id: questionId,
      tags_json: tagsMatch ? tagsMatch[1] : null,
      correct_answer_json: correctAnswerMatch ? correctAnswerMatch[1] : null,
      answer_template_json: answerTemplateMatch ? answerTemplateMatch[1] : null,
    });
  }

  console.log(`   → ${matches.length}件の問題データを検出`);

  // 各問題のJSON妥当性をチェック
  console.log("\n2. JSON妥当性チェック...");

  let totalValidCount = 0;
  let totalErrorCount = 0;
  let firstErrorDetails = [];
  let errorsByType = {
    tags_json: 0,
    correct_answer_json: 0,
    answer_template_json: 0,
  };

  for (let i = 0; i < matches.length; i++) {
    const question = matches[i];
    let questionHasError = false;

    // 各JSONフィールドをチェック
    ["tags_json", "correct_answer_json", "answer_template_json"].forEach(
      (fieldName) => {
        const jsonString = question[fieldName];
        if (jsonString) {
          try {
            JSON.parse(jsonString);
          } catch (error) {
            if (!questionHasError) {
              totalErrorCount++;
              questionHasError = true;

              if (firstErrorDetails.length < 10) {
                firstErrorDetails.push({
                  questionNumber: i + 1,
                  questionId: question.id,
                  field: fieldName,
                  error: error.message.substring(0, 100),
                  jsonPreview: jsonString.substring(0, 150) + "...",
                });
              }
            }

            errorsByType[fieldName]++;
            console.log(
              `   ❌ ${question.id} (${i + 1}/${matches.length}) - ${fieldName}: ${error.message.substring(0, 50)}...`,
            );
          }
        }
      },
    );

    if (!questionHasError) {
      totalValidCount++;
    }

    // 進捗表示（50件ごと）
    if ((i + 1) % 50 === 0) {
      console.log(`   進捗: ${i + 1}/${matches.length} 問題をチェック済み`);
    }
  }

  console.log("\n3. 検証結果サマリー");
  console.log(`   総問題数: ${matches.length}件`);
  console.log(`   有効問題数: ${totalValidCount}件`);
  console.log(`   エラー問題数: ${totalErrorCount}件`);
  console.log(
    `   エラー率: ${((totalErrorCount / matches.length) * 100).toFixed(1)}%`,
  );

  console.log("\n4. エラー分類");
  Object.entries(errorsByType).forEach(([field, count]) => {
    if (count > 0) {
      console.log(`   ${field}: ${count}件のエラー`);
    }
  });

  if (firstErrorDetails.length > 0) {
    console.log("\n5. 最初のエラー詳細（最大10件）");
    firstErrorDetails.forEach((error, index) => {
      console.log(`\n   エラー${index + 1}:`);
      console.log(
        `     問題: ${error.questionId} (${error.questionNumber}番目)`,
      );
      console.log(`     フィールド: ${error.field}`);
      console.log(`     エラー: ${error.error}`);
      console.log(`     JSON: ${error.jsonPreview}`);
    });
  }

  // 134番目の問題を特別にチェック
  if (matches.length >= 134) {
    console.log("\n6. 134番目の問題の詳細チェック");
    const question134 = matches[133]; // 0-based index
    console.log(`   問題ID: ${question134.id}`);

    let has134Error = false;
    ["tags_json", "correct_answer_json", "answer_template_json"].forEach(
      (fieldName) => {
        const jsonString = question134[fieldName];
        if (jsonString) {
          try {
            JSON.parse(jsonString);
            console.log(`   ✅ ${fieldName}: 有効`);
          } catch (error) {
            has134Error = true;
            console.log(`   ❌ ${fieldName}: ${error.message}`);
            console.log(`   内容: ${jsonString.substring(0, 200)}...`);
          }
        }
      },
    );

    if (!has134Error) {
      console.log("   → 134番目の問題は正常です");
    }
  }

  console.log("\n=== 検証完了 ===");
  return {
    totalQuestions: matches.length,
    validQuestions: totalValidCount,
    errorQuestions: totalErrorCount,
    errorsByType: errorsByType,
    firstErrors: firstErrorDetails,
  };
}

if (require.main === module) {
  try {
    const result = validateAllQuestionsJson();
    console.log("\n最終結果:", {
      questions: result.totalQuestions,
      valid: result.validQuestions,
      errors: result.errorQuestions,
    });

    if (result.errorQuestions === 0) {
      console.log("✅ 全問題のJSONが有効です");
      process.exit(0);
    } else {
      console.log(`❌ ${result.errorQuestions}件の問題にJSONエラーがあります`);
      process.exit(1);
    }
  } catch (error) {
    console.error("検証エラー:", error.message);
    process.exit(1);
  }
}

module.exports = { validateAllQuestionsJson };
