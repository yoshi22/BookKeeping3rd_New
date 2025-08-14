#!/usr/bin/env node

/**
 * 改善版: 全問題の動作確認テストスクリプト
 */

const fs = require("fs");
const path = require("path");

// TypeScriptファイルを読み込む
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

// ログファイルの準備
const logPath = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}
const logFile = path.join(
  logPath,
  `test-results-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.log`,
);

// ログ出力関数
function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + "\n");
}

// TypeScriptファイルからJavaScriptデータを抽出
function extractQuestionsData() {
  // export const masterQuestions = [ ... ] の部分を抽出
  const startPattern = /export const masterQuestions[^=]*=\s*\[/;
  const startMatch = content.match(startPattern);
  if (!startMatch) {
    throw new Error("masterQuestions配列の開始が見つかりません");
  }

  const startIndex = startMatch.index + startMatch[0].length - 1; // '['の位置

  // 対応する閉じ括弧を見つける
  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !inString) {
      inString = true;
    } else if (char === '"' && inString) {
      inString = false;
    }

    if (!inString) {
      if (char === "[" || char === "{") {
        depth++;
      } else if (char === "]" || char === "}") {
        depth--;
        if (depth === 0 && char === "]") {
          endIndex = i + 1;
          break;
        }
      }
    }
  }

  if (endIndex === -1) {
    throw new Error("masterQuestions配列の終了が見つかりません");
  }

  const dataString = content.substring(startIndex, endIndex);

  // JavaScriptとして評価してデータを取得
  try {
    const questions = eval(dataString);
    return questions;
  } catch (error) {
    throw new Error(`データの評価に失敗: ${error.message}`);
  }
}

// JSONパース
function parseJSONField(jsonString) {
  try {
    return { valid: true, data: JSON.parse(jsonString) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// テンプレートタイプ別の検証
function validateTemplate(template, questionId) {
  const errors = [];

  switch (template.type) {
    case "journal_entry":
      if (!template.entries || !Array.isArray(template.entries)) {
        errors.push("entries配列が必要");
      } else {
        if (template.entries.length !== 2) {
          errors.push("借方・貸方の2エントリが必要");
        }
        template.entries.forEach((entry, index) => {
          if (!entry.fields || !Array.isArray(entry.fields)) {
            errors.push(`エントリ${index + 1}にfields配列が必要`);
          }
        });
      }
      break;

    case "ledger_entry":
      if (!template.fields || !Array.isArray(template.fields)) {
        errors.push("fields配列が必要");
      }
      break;

    case "financial_statement":
    case "trial_balance":
    case "worksheet":
      if (template.type === "financial_statement" && !template.sections) {
        errors.push("sectionsが必要");
      }
      if (
        (template.type === "trial_balance" || template.type === "worksheet") &&
        !template.columns
      ) {
        errors.push("columnsが必要");
      }
      break;

    default:
      errors.push(`不明なテンプレートタイプ: ${template.type}`);
  }

  return errors;
}

// 正答データの検証
function validateCorrectAnswer(answer, template, questionId) {
  const errors = [];

  if (template.type === "journal_entry") {
    if (!answer.journalEntry && !answer.entries) {
      errors.push("journalEntryまたはentriesが必要");
    }
  } else if (template.type === "ledger_entry") {
    if (!answer.entries && !Array.isArray(answer)) {
      errors.push("entriesまたは配列形式が必要");
    }
  } else if (
    template.type === "financial_statement" ||
    template.type === "trial_balance" ||
    template.type === "worksheet"
  ) {
    if (!answer.entries && !answer.items && !Array.isArray(answer)) {
      errors.push("entriesまたはitemsまたは配列形式が必要");
    }
  }

  return errors;
}

// Answer Serviceのシミュレーション
function simulateAnswerCheck(question, template, correctAnswer) {
  const results = {
    canInput: true,
    canJudge: true,
    errors: [],
  };

  // テンプレートタイプに応じた入力可能性チェック
  if (template.type === "journal_entry") {
    if (!template.entries || template.entries.length !== 2) {
      results.canInput = false;
      results.errors.push("借方・貸方の入力フィールドが不正");
    }
  }

  // 正答判定可能性チェック
  if (!correctAnswer || Object.keys(correctAnswer).length === 0) {
    results.canJudge = false;
    results.errors.push("正答データが空");
  }

  return results;
}

// メイン処理
async function main() {
  log("===== 全問題動作確認テスト開始 =====");
  log(`ログファイル: ${logFile}`);

  let questions;
  try {
    questions = extractQuestionsData();
    log(`総問題数: ${questions.length}`);
  } catch (error) {
    log(`問題データの抽出に失敗: ${error.message}`, "FATAL");
    process.exit(1);
  }

  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    bySection: {
      section1: { total: 0, valid: 0, invalid: 0, errors: [] },
      section2: { total: 0, valid: 0, invalid: 0, errors: [] },
      section3: { total: 0, valid: 0, invalid: 0, errors: [] },
    },
  };

  // 各問題をテスト
  questions.forEach((question) => {
    results.total++;

    // セクション判定
    let section = null;
    if (question.id.startsWith("Q_J_")) section = "section1";
    else if (question.id.startsWith("Q_L_")) section = "section2";
    else if (question.id.startsWith("Q_T_")) section = "section3";

    if (section) {
      results.bySection[section].total++;
    }

    let hasError = false;
    const errorDetails = [];

    // 1. テンプレートJSON検証
    const templateResult = parseJSONField(question.answer_template_json);
    if (!templateResult.valid) {
      hasError = true;
      errorDetails.push(`テンプレートJSON解析エラー: ${templateResult.error}`);
    } else {
      // テンプレート構造検証
      const templateErrors = validateTemplate(templateResult.data, question.id);
      if (templateErrors.length > 0) {
        hasError = true;
        errorDetails.push(
          `テンプレート構造エラー: ${templateErrors.join(", ")}`,
        );
      }
    }

    // 2. 正答JSON検証
    const answerResult = parseJSONField(question.correct_answer_json);
    if (!answerResult.valid) {
      hasError = true;
      errorDetails.push(`正答JSON解析エラー: ${answerResult.error}`);
    } else if (templateResult.valid) {
      // 正答データ構造検証
      const answerErrors = validateCorrectAnswer(
        answerResult.data,
        templateResult.data,
        question.id,
      );
      if (answerErrors.length > 0) {
        hasError = true;
        errorDetails.push(`正答データエラー: ${answerErrors.join(", ")}`);
      }
    }

    // 3. タグJSON検証
    const tagsResult = parseJSONField(question.tags_json);
    if (!tagsResult.valid) {
      hasError = true;
      errorDetails.push(`タグJSON解析エラー: ${tagsResult.error}`);
    }

    // 4. Answer Service判定シミュレーション
    if (templateResult.valid && answerResult.valid) {
      const checkResult = simulateAnswerCheck(
        question,
        templateResult.data,
        answerResult.data,
      );
      if (!checkResult.canInput) {
        hasError = true;
        errorDetails.push(`入力不可: ${checkResult.errors.join(", ")}`);
      }
      if (!checkResult.canJudge) {
        hasError = true;
        errorDetails.push(`判定不可: ${checkResult.errors.join(", ")}`);
      }
    }

    // 結果集計
    if (hasError) {
      results.invalid++;
      if (section) {
        results.bySection[section].invalid++;
        results.bySection[section].errors.push({
          id: question.id,
          errors: errorDetails,
        });
      }
      log(`❌ ${question.id}: ${errorDetails.join(" | ")}`, "ERROR");
    } else {
      results.valid++;
      if (section) {
        results.bySection[section].valid++;
      }
      log(`✅ ${question.id}: OK`, "SUCCESS");
    }
  });

  // サマリー出力
  log("\n===== テスト結果サマリー =====");
  log(`総問題数: ${results.total}`);
  log(
    `✅ 正常: ${results.valid} (${((results.valid / results.total) * 100).toFixed(1)}%)`,
  );
  log(
    `❌ エラー: ${results.invalid} (${((results.invalid / results.total) * 100).toFixed(1)}%)`,
  );

  log("\n【第一問（仕訳問題）】");
  const s1 = results.bySection.section1;
  log(`  総数: ${s1.total}, 正常: ${s1.valid}, エラー: ${s1.invalid}`);
  if (s1.errors.length > 0 && s1.errors.length <= 5) {
    log("  エラー詳細:");
    s1.errors.forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  } else if (s1.errors.length > 5) {
    log(`  エラー詳細: ${s1.errors.length}件のエラー（最初の5件のみ表示）`);
    s1.errors.slice(0, 5).forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  }

  log("\n【第二問（帳簿問題）】");
  const s2 = results.bySection.section2;
  log(`  総数: ${s2.total}, 正常: ${s2.valid}, エラー: ${s2.invalid}`);
  if (s2.errors.length > 0 && s2.errors.length <= 5) {
    log("  エラー詳細:");
    s2.errors.forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  } else if (s2.errors.length > 5) {
    log(`  エラー詳細: ${s2.errors.length}件のエラー（最初の5件のみ表示）`);
    s2.errors.slice(0, 5).forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  }

  log("\n【第三問（表作成問題）】");
  const s3 = results.bySection.section3;
  log(`  総数: ${s3.total}, 正常: ${s3.valid}, エラー: ${s3.invalid}`);
  if (s3.errors.length > 0 && s3.errors.length <= 5) {
    log("  エラー詳細:");
    s3.errors.forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  } else if (s3.errors.length > 5) {
    log(`  エラー詳細: ${s3.errors.length}件のエラー（最初の5件のみ表示）`);
    s3.errors.slice(0, 5).forEach((e) => {
      log(`    - ${e.id}: ${e.errors.join(", ")}`);
    });
  }

  log("\n===== テスト完了 =====");
  log(`詳細ログは ${logFile} に保存されました`);

  // 終了コード設定
  process.exit(results.invalid > 0 ? 1 : 0);
}

// 実行
main().catch((error) => {
  log(`致命的エラー: ${error.message}`, "FATAL");
  process.exit(1);
});
