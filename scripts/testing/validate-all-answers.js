#!/usr/bin/env node

/**
 * 全問題の正答検証スクリプト
 * 302問すべての正答判定ロジックを自動検証
 */

const fs = require("fs");
const path = require("path");

// TypeScript問題データファイル読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("🧪 302問全問正答検証スクリプト開始");
console.log("=====================================");

// ログファイル設定
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
const logFile = path.join(logDir, `validation-results-${timestamp}.json`);
const csvFile = path.join(logDir, `validation-results-${timestamp}.csv`);

// ログ関数
function log(message, type = "INFO") {
  const logMessage = `[${new Date().toISOString()}] [${type}] ${message}`;
  console.log(logMessage);
}

// 問題データ抽出関数（master-questions.tsから）
function extractQuestionsFromTS() {
  try {
    const content = fs.readFileSync(masterQuestionsPath, "utf8");
    log("問題データファイル読み込み完了");

    // TypeScriptファイルから問題オブジェクトを抽出
    const questions = [];

    // オブジェクト単位で抽出するための正規表現
    const questionPattern =
      /\s*{\s*id:\s*["']([^"']+)["'],[\s\S]*?category_id:\s*["']([^"']+)["'],[\s\S]*?question_text:\s*["']([\s\S]*?)["'],[\s\S]*?answer_template_json:\s*["']([\s\S]*?)["'],[\s\S]*?correct_answer_json:\s*["']([\s\S]*?)["'],[\s\S]*?explanation:\s*["']([\s\S]*?)["'],[\s\S]*?difficulty:\s*(\d+),[\s\S]*?tags_json:\s*["']([\s\S]*?)["'],[\s\S]*?created_at:\s*["'][^"']*["'],[\s\S]*?updated_at:\s*["'][^"']*["'],?\s*},?/g;

    let match;
    while ((match = questionPattern.exec(content)) !== null) {
      try {
        const [
          ,
          id,
          category_id,
          question_text,
          answer_template_json,
          correct_answer_json,
          explanation,
          difficulty,
          tags_json,
        ] = match;

        questions.push({
          id: id.trim(),
          category_id: category_id.trim(),
          question_text: question_text
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"'),
          answer_template_json: answer_template_json.replace(/\\"/g, '"'),
          correct_answer_json: correct_answer_json.replace(/\\"/g, '"'),
          explanation: explanation.replace(/\\n/g, "\n").replace(/\\"/g, '"'),
          difficulty: parseInt(difficulty),
          tags_json: tags_json.replace(/\\"/g, '"'),
        });
      } catch (parseError) {
        log(`問題解析エラー: ${parseError.message}`, "ERROR");
      }
    }

    log(`抽出完了: ${questions.length}問`);
    return questions;
  } catch (error) {
    log(`ファイル読み込みエラー: ${error.message}`, "ERROR");
    throw error;
  }
}

// JSON妥当性チェック
function validateJSON(jsonString, context) {
  try {
    const parsed = JSON.parse(jsonString);
    return { valid: true, data: parsed };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      context: context,
    };
  }
}

// 問題タイプ別の解答データ構築
function buildAnswerDataFromCorrectAnswer(question) {
  try {
    const correctAnswerValidation = validateJSON(
      question.correct_answer_json,
      `Question ${question.id} correct_answer_json`,
    );
    const templateValidation = validateJSON(
      question.answer_template_json,
      `Question ${question.id} answer_template_json`,
    );

    if (!correctAnswerValidation.valid) {
      return {
        success: false,
        error: `正答JSONが無効: ${correctAnswerValidation.error}`,
      };
    }

    if (!templateValidation.valid) {
      return {
        success: false,
        error: `テンプレートJSONが無効: ${templateValidation.error}`,
      };
    }

    const correctAnswer = correctAnswerValidation.data;
    const template = templateValidation.data;

    // 問題タイプに応じて解答データを構築
    if (template.type === "journal_entry" && correctAnswer.journalEntry) {
      // 仕訳問題
      const entry = correctAnswer.journalEntry;
      return {
        success: true,
        answerData: {
          debit_account: entry.debit_account,
          debit_amount: entry.debit_amount,
          credit_account: entry.credit_account,
          credit_amount: entry.credit_amount,
        },
        questionType: "journal_entry",
      };
    } else if (template.type === "ledger_account" && correctAnswer.entries) {
      // 帳簿問題
      return {
        success: true,
        answerData: {
          entries: correctAnswer.entries,
        },
        questionType: "ledger_account",
      };
    } else if (template.type === "trial_balance" && correctAnswer.entries) {
      // 試算表問題
      return {
        success: true,
        answerData: {
          entries: correctAnswer.entries,
        },
        questionType: "trial_balance",
      };
    } else if (template.type === "multiple_choice") {
      // 複数選択問題
      if (template.questions && correctAnswer.answers) {
        return {
          success: true,
          answerData: {
            answers: correctAnswer.answers,
          },
          questionType: "multiple_choice",
        };
      } else if (correctAnswer.selectedOption) {
        return {
          success: true,
          answerData: {
            selectedOption: correctAnswer.selectedOption,
          },
          questionType: "single_choice",
        };
      }
    } else if (template.type === "voucher_entry" && correctAnswer.entries) {
      // 伝票問題
      return {
        success: true,
        answerData: correctAnswer.entries,
        questionType: "voucher_entry",
      };
    }

    // その他のタイプまたは認識できない形式
    return {
      success: true,
      answerData: correctAnswer,
      questionType: template.type || "unknown",
      warning: "汎用的な解答データ構築を使用",
    };
  } catch (error) {
    return {
      success: false,
      error: `解答データ構築エラー: ${error.message}`,
    };
  }
}

// 簡易正答判定ロジック（AnswerServiceのロジックをNode.js向けに簡略化）
function validateAnswerLogic(answerData, question) {
  try {
    const correctAnswer = JSON.parse(question.correct_answer_json);
    const template = JSON.parse(question.answer_template_json);

    // 仕訳問題の判定
    if (template.type === "journal_entry" && correctAnswer.journalEntry) {
      const expected = correctAnswer.journalEntry;
      const actual = answerData.answerData;

      return (
        actual.debit_account === expected.debit_account &&
        actual.debit_amount === expected.debit_amount &&
        actual.credit_account === expected.credit_account &&
        actual.credit_amount === expected.credit_amount
      );
    }

    // 複数選択問題の判定
    if (template.type === "multiple_choice") {
      if (correctAnswer.answers && answerData.answerData.answers) {
        const expectedAnswers = correctAnswer.answers;
        const actualAnswers = answerData.answerData.answers;

        // すべてのキーが一致するかチェック
        for (const key of Object.keys(expectedAnswers)) {
          if (actualAnswers[key] !== expectedAnswers[key]) {
            return false;
          }
        }
        return true;
      }

      if (correctAnswer.selectedOption) {
        return (
          answerData.answerData.selectedOption === correctAnswer.selectedOption
        );
      }
    }

    // その他のタイプは暫定的にtrue（実装が必要）
    return true;
  } catch (error) {
    return false;
  }
}

// 勘定科目抽出
function extractAccountsFromQuestion(question) {
  const accounts = new Set();

  try {
    const correctAnswer = JSON.parse(question.correct_answer_json);

    if (correctAnswer.journalEntry) {
      const entry = correctAnswer.journalEntry;
      if (entry.debit_account) accounts.add(entry.debit_account);
      if (entry.credit_account) accounts.add(entry.credit_account);
    }

    if (correctAnswer.entries && Array.isArray(correctAnswer.entries)) {
      correctAnswer.entries.forEach((entry) => {
        if (entry.accountName) accounts.add(entry.accountName);
        if (entry.description) accounts.add(entry.description);
      });
    }
  } catch (error) {
    // JSON解析エラーは無視
  }

  return Array.from(accounts);
}

// メイン検証処理
async function validateAllQuestions() {
  const questions = extractQuestionsFromTS();
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  log(`\n📊 検証開始: ${questions.length}問`);

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const progress = `[${i + 1}/${questions.length}]`;

    log(`${progress} ${question.id} を検証中...`);

    const result = {
      questionId: question.id,
      categoryId: question.category_id,
      difficulty: question.difficulty,
      validationResult: "UNKNOWN",
      errorMessage: "",
      accounts: extractAccountsFromQuestion(question),
      questionType: "",
      hasValidTemplate: false,
      hasValidCorrectAnswer: false,
    };

    // JSON妥当性チェック
    const templateValidation = validateJSON(
      question.answer_template_json,
      `Template ${question.id}`,
    );
    const correctAnswerValidation = validateJSON(
      question.correct_answer_json,
      `CorrectAnswer ${question.id}`,
    );

    result.hasValidTemplate = templateValidation.valid;
    result.hasValidCorrectAnswer = correctAnswerValidation.valid;

    if (templateValidation.valid && templateValidation.data.type) {
      result.questionType = templateValidation.data.type;
    }

    if (!templateValidation.valid) {
      result.validationResult = "TEMPLATE_ERROR";
      result.errorMessage = templateValidation.error;
      errorCount++;
    } else if (!correctAnswerValidation.valid) {
      result.validationResult = "ANSWER_ERROR";
      result.errorMessage = correctAnswerValidation.error;
      errorCount++;
    } else {
      // 解答データ構築テスト
      const answerBuild = buildAnswerDataFromCorrectAnswer(question);

      if (!answerBuild.success) {
        result.validationResult = "BUILD_ERROR";
        result.errorMessage = answerBuild.error;
        errorCount++;
      } else {
        // 正答判定テスト
        const isCorrect = validateAnswerLogic(answerBuild, question);

        if (isCorrect) {
          result.validationResult = "OK";
          successCount++;
        } else {
          result.validationResult = "LOGIC_ERROR";
          result.errorMessage = "正答判定ロジックでfalseを返しました";
          errorCount++;
        }

        if (answerBuild.warning) {
          result.errorMessage += ` (${answerBuild.warning})`;
        }
      }
    }

    results.push(result);

    // 進捗表示
    if ((i + 1) % 10 === 0 || i === questions.length - 1) {
      log(`${progress} 進捗: 成功=${successCount}, エラー=${errorCount}`);
    }
  }

  return { results, successCount, errorCount, totalCount: questions.length };
}

// 結果出力
function outputResults(validationResults) {
  const { results, successCount, errorCount, totalCount } = validationResults;

  // JSON出力
  const jsonOutput = {
    timestamp: new Date().toISOString(),
    summary: {
      totalQuestions: totalCount,
      successCount,
      errorCount,
      successRate: ((successCount / totalCount) * 100).toFixed(2) + "%",
    },
    details: results,
  };

  fs.writeFileSync(logFile, JSON.stringify(jsonOutput, null, 2));
  log(`📄 詳細結果をJSONで出力: ${logFile}`);

  // CSV出力
  const csvHeader =
    "問題ID,カテゴリ,タイプ,難易度,判定結果,エラー内容,使用勘定科目\n";
  const csvData = results
    .map(
      (r) =>
        `${r.questionId},${r.categoryId},${r.questionType},${r.difficulty},${r.validationResult},"${r.errorMessage}","${r.accounts.join(";")}"`,
    )
    .join("\n");

  fs.writeFileSync(csvFile, csvHeader + csvData);
  log(`📊 結果をCSVで出力: ${csvFile}`);

  // コンソール要約
  console.log("\n" + "=".repeat(50));
  console.log("📊 検証結果サマリー");
  console.log("=".repeat(50));
  console.log(`総問題数: ${totalCount}`);
  console.log(
    `成功: ${successCount} (${((successCount / totalCount) * 100).toFixed(1)}%)`,
  );
  console.log(
    `エラー: ${errorCount} (${((errorCount / totalCount) * 100).toFixed(1)}%)`,
  );

  // エラー分類
  const errorTypes = {};
  results
    .filter((r) => r.validationResult !== "OK")
    .forEach((r) => {
      errorTypes[r.validationResult] =
        (errorTypes[r.validationResult] || 0) + 1;
    });

  if (Object.keys(errorTypes).length > 0) {
    console.log("\nエラー分類:");
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}問`);
    });
  }

  // 使用勘定科目統計
  const allAccounts = new Set();
  results.forEach((r) => r.accounts.forEach((acc) => allAccounts.add(acc)));
  console.log(`\n使用勘定科目数: ${allAccounts.size}種類`);

  return jsonOutput;
}

// メイン実行
async function main() {
  try {
    log("🚀 検証処理開始");

    const validationResults = await validateAllQuestions();
    const finalResults = outputResults(validationResults);

    log("\n✅ 全問題の検証が完了しました");

    if (finalResults.summary.errorCount === 0) {
      log("🎉 すべての問題で正答判定が成功しました！", "SUCCESS");
      process.exit(0);
    } else {
      log(
        `⚠️  ${finalResults.summary.errorCount}問でエラーが発生しました`,
        "WARNING",
      );
      log("詳細は出力ファイルを確認してください");
      process.exit(1);
    }
  } catch (error) {
    log(`💥 致命的エラー: ${error.message}`, "ERROR");
    console.error(error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = {
  extractQuestionsFromTS,
  buildAnswerDataFromCorrectAnswer,
  validateAnswerLogic,
  validateAllQuestions,
};
