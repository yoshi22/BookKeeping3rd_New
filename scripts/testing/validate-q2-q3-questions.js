#!/usr/bin/env node

/**
 * Q2/Q3問題専用検証スクリプト
 * vocabulary, fill_in_ledger, 試算表問題の構造整合性を検証
 */

const fs = require("fs");
const path = require("path");

const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("🔍 Q2/Q3問題検証スクリプト");
console.log("====================================\n");

// ログディレクトリ設定
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
const logFile = path.join(logDir, `q2-q3-validation-${timestamp}.json`);

// 問題データ抽出（v2から流用）
function extractQuestionsFromTS() {
  const content = fs.readFileSync(masterQuestionsPath, "utf8");
  const questions = [];
  let currentPos = 0;

  while (true) {
    const idMatch = content.indexOf('id: "Q', currentPos);
    if (idMatch === -1) break;

    const nextIdMatch = content.indexOf('id: "Q', idMatch + 1);
    const endPos = nextIdMatch === -1 ? content.length : nextIdMatch;
    const questionText = content.substring(idMatch, endPos);

    try {
      const question = extractSingleQuestion(questionText);
      if (
        question &&
        (question.id.startsWith("Q2_") || question.id.startsWith("Q3_"))
      ) {
        questions.push(question);
      }
    } catch (error) {
      // Skip parse errors
    }

    currentPos = nextIdMatch;
    if (currentPos === -1) break;
  }

  return questions;
}

function extractSingleQuestion(questionText) {
  const id = extractField(questionText, /id:\s*["']([^"']+)["']/);
  const category_id = extractField(
    questionText,
    /category_id:\s*["']([^"']+)["']/,
  );

  if (!id || !category_id) return null;

  const answer_template_json = extractJsonField(
    questionText,
    "answer_template_json",
  );
  const correct_answer_json = extractJsonField(
    questionText,
    "correct_answer_json",
  );

  return {
    id: id.trim(),
    category_id: category_id.trim(),
    answer_template_json: cleanJsonString(answer_template_json),
    correct_answer_json: cleanJsonString(correct_answer_json),
  };
}

function extractField(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function extractJsonField(text, fieldName) {
  const fieldStart = text.indexOf(`${fieldName}:`);
  if (fieldStart === -1) return "";

  const searchStart = fieldStart + fieldName.length + 1;
  let quotePos = -1;
  let quoteChar = "";

  for (let i = searchStart; i < text.length; i++) {
    if (text[i] === '"' || text[i] === "'") {
      quotePos = i;
      quoteChar = text[i];
      break;
    }
  }

  if (quotePos === -1) return "";

  let endPos = quotePos + 1;
  let escaped = false;

  while (endPos < text.length) {
    const char = text[endPos];
    if (escaped) {
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === quoteChar) {
      break;
    }
    endPos++;
  }

  return endPos < text.length ? text.substring(quotePos + 1, endPos) : "";
}

function cleanJsonString(jsonString) {
  if (!jsonString) return "";
  return jsonString.replace(/\\"/g, '"').replace(/\\'/g, "'");
}

// Q2_V (vocabulary) 問題の検証
function validateVocabularyQuestion(question) {
  const issues = [];

  try {
    const template = JSON.parse(question.answer_template_json);
    const correctAnswer = JSON.parse(question.correct_answer_json);

    if (template.type !== "vocabulary") {
      return { valid: true, issues: [] };
    }

    // blanks配列の存在確認
    if (!template.blanks || !Array.isArray(template.blanks)) {
      issues.push({
        severity: "CRITICAL",
        message: "answer_template_json に blanks 配列が存在しません",
      });
      return { valid: false, issues };
    }

    if (!correctAnswer.blanks || !Array.isArray(correctAnswer.blanks)) {
      issues.push({
        severity: "CRITICAL",
        message: "correct_answer_json に blanks 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // 各blankの検証
    template.blanks.forEach((templateBlank, idx) => {
      // choices配列の存在
      if (!templateBlank.choices || !Array.isArray(templateBlank.choices)) {
        issues.push({
          severity: "CRITICAL",
          message: `Template blank[${idx}] に choices 配列がありません`,
          blankIndex: templateBlank.index,
        });
        return;
      }

      // 対応するcorrect_answerのblankを探す
      const correspondingAnswer = correctAnswer.blanks.find(
        (ans) => ans.index === idx,
      );

      if (!correspondingAnswer) {
        issues.push({
          severity: "CRITICAL",
          message: `Template blank[${idx}] に対応する correct_answer が見つかりません`,
          templateIndex: templateBlank.index,
        });
        return;
      }

      // correctIndexの範囲チェック
      if (
        correspondingAnswer.correctIndex === undefined ||
        correspondingAnswer.correctIndex === null
      ) {
        issues.push({
          severity: "CRITICAL",
          message: `Correct answer blank[${idx}] に correctIndex がありません`,
        });
        return;
      }

      const correctIdx = correspondingAnswer.correctIndex;
      if (correctIdx < 0 || correctIdx >= templateBlank.choices.length) {
        issues.push({
          severity: "CRITICAL",
          message: `correctIndex ${correctIdx} が choices 配列の範囲外です (choices.length=${templateBlank.choices.length})`,
          blankIndex: idx,
          correctIndex: correctIdx,
          choicesLength: templateBlank.choices.length,
        });
      }

      // index番号の整合性警告（1始まり vs 0始まり）
      if (
        templateBlank.index !== undefined &&
        templateBlank.index !== idx + 1 &&
        templateBlank.index !== idx
      ) {
        issues.push({
          severity: "WARNING",
          message: `Template blank.index=${templateBlank.index} と配列インデックス=${idx} に不整合の可能性`,
          templateIndex: templateBlank.index,
          arrayIndex: idx,
        });
      }
    });

    return {
      valid: issues.filter((i) => i.severity === "CRITICAL").length === 0,
      issues,
    };
  } catch (error) {
    return {
      valid: false,
      issues: [
        {
          severity: "CRITICAL",
          message: `JSON解析エラー: ${error.message}`,
        },
      ],
    };
  }
}

// 統合型構造（template内にcorrectIndexまたはcorrect_answer）の判定
function isIntegratedStructure(template) {
  if (!template.blanks || !Array.isArray(template.blanks)) {
    return false;
  }

  // blanks配列の最初の要素をチェック
  const firstBlank = template.blanks[0];

  // correctIndexまたはcorrect_answerが存在すれば統合型
  return (
    firstBlank.correctIndex !== undefined ||
    firstBlank.correct_answer !== undefined
  );
}

// Q2_B (auxiliary_book) 専用検証
function validateAuxiliaryBookQuestion(question) {
  const issues = [];

  try {
    const template = JSON.parse(question.answer_template_json);

    if (template.type !== "auxiliary_book") {
      return { valid: true, issues: [] };
    }

    // transactions配列の存在確認
    if (!template.transactions || !Array.isArray(template.transactions)) {
      issues.push({
        severity: "CRITICAL",
        message: "auxiliary_book問題に transactions 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // books配列の存在確認
    if (!template.books || !Array.isArray(template.books)) {
      issues.push({
        severity: "CRITICAL",
        message: "auxiliary_book問題に books 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // correctAnswers配列の存在確認
    if (!template.correctAnswers || !Array.isArray(template.correctAnswers)) {
      issues.push({
        severity: "CRITICAL",
        message: "auxiliary_book問題に correctAnswers 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // transactionsの構造検証
    template.transactions.forEach((transaction, idx) => {
      if (transaction.index === undefined || transaction.index === null) {
        issues.push({
          severity: "CRITICAL",
          message: `Transaction[${idx}] に index がありません`,
        });
      }
      if (!transaction.description) {
        issues.push({
          severity: "WARNING",
          message: `Transaction[${idx}] に description がありません`,
        });
      }
    });

    // booksの構造検証
    const bookIds = new Set();
    template.books.forEach((book, idx) => {
      if (!book.id) {
        issues.push({
          severity: "CRITICAL",
          message: `Book[${idx}] に id がありません`,
        });
      } else {
        bookIds.add(book.id);
      }
      if (!book.name) {
        issues.push({
          severity: "WARNING",
          message: `Book[${idx}] に name がありません`,
        });
      }
    });

    // correctAnswersの構造検証
    template.correctAnswers.forEach((answer, idx) => {
      // transactionIndexの検証
      if (
        answer.transactionIndex === undefined ||
        answer.transactionIndex === null
      ) {
        issues.push({
          severity: "CRITICAL",
          message: `CorrectAnswer[${idx}] に transactionIndex がありません`,
        });
      } else {
        const transactionExists = template.transactions.some(
          (t) => t.index === answer.transactionIndex,
        );
        if (!transactionExists) {
          issues.push({
            severity: "CRITICAL",
            message: `CorrectAnswer[${idx}] の transactionIndex ${answer.transactionIndex} が transactions に存在しません`,
          });
        }
      }

      // bookIdsの検証
      if (!answer.bookIds || !Array.isArray(answer.bookIds)) {
        issues.push({
          severity: "CRITICAL",
          message: `CorrectAnswer[${idx}] に bookIds 配列がありません`,
        });
      } else {
        answer.bookIds.forEach((bookId) => {
          if (!bookIds.has(bookId)) {
            issues.push({
              severity: "CRITICAL",
              message: `CorrectAnswer[${idx}] の bookId "${bookId}" が books に存在しません`,
            });
          }
        });
      }
    });

    return {
      valid: issues.filter((i) => i.severity === "CRITICAL").length === 0,
      issues,
    };
  } catch (error) {
    return {
      valid: false,
      issues: [
        {
          severity: "CRITICAL",
          message: `JSON解析エラー: ${error.message}`,
        },
      ],
    };
  }
}

// Q2_L/Q2_B (fill_in_ledger, insert_column, auxiliary_book) 問題の検証
function validateLedgerQuestion(question) {
  const issues = [];

  try {
    const template = JSON.parse(question.answer_template_json);
    const correctAnswer = JSON.parse(question.correct_answer_json);

    const ledgerTypes = ["fill_in_ledger", "insert_column", "auxiliary_book"];
    if (!ledgerTypes.includes(template.type)) {
      return { valid: true, issues: [] };
    }

    // auxiliary_book問題は専用の検証関数に委譲
    if (template.type === "auxiliary_book") {
      return validateAuxiliaryBookQuestion(question);
    }

    // blanks配列の存在確認（fill_in_ledger, insert_columnのみ）
    if (!template.blanks || !Array.isArray(template.blanks)) {
      issues.push({
        severity: "CRITICAL",
        message: "answer_template_json に blanks 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // 統合型構造（template内にcorrectIndex）の検証
    template.blanks.forEach((blank, idx) => {
      if (!blank.choices || !Array.isArray(blank.choices)) {
        issues.push({
          severity: "CRITICAL",
          message: `Blank[${idx}] に choices 配列がありません`,
          blankIndex: blank.index || idx,
        });
        return;
      }

      // correctIndexの存在と範囲チェック（統合型）
      if (blank.correctIndex !== undefined) {
        const correctIdx = blank.correctIndex;
        if (correctIdx < 0 || correctIdx >= blank.choices.length) {
          issues.push({
            severity: "CRITICAL",
            message: `correctIndex ${correctIdx} が choices 配列の範囲外です (choices.length=${blank.choices.length})`,
            blankIndex: blank.index || idx,
            correctIndex: correctIdx,
            choicesLength: blank.choices.length,
          });
        }
      }

      // ledger_indexの重複チェック
      if (blank.ledger_index !== undefined) {
        const duplicates = template.blanks.filter(
          (b, i) => i !== idx && b.ledger_index === blank.ledger_index,
        );
        if (duplicates.length > 0) {
          issues.push({
            severity: "CRITICAL",
            message: `ledger_index ${blank.ledger_index} が重複しています`,
            blankIndex: blank.index || idx,
            ledgerIndex: blank.ledger_index,
          });
        }
      }
    });

    // correct_answer_json の blanks 検証（分離型の場合）
    if (correctAnswer.blanks && Array.isArray(correctAnswer.blanks)) {
      correctAnswer.blanks.forEach((answer, idx) => {
        if (answer.correctIndex === undefined || answer.correctIndex === null) {
          issues.push({
            severity: "WARNING",
            message: `Correct answer blank[${idx}] に correctIndex がありません`,
            answerIndex: answer.index || idx,
          });
        }
      });
    }

    return {
      valid: issues.filter((i) => i.severity === "CRITICAL").length === 0,
      issues,
    };
  } catch (error) {
    return {
      valid: false,
      issues: [
        {
          severity: "CRITICAL",
          message: `JSON解析エラー: ${error.message}`,
        },
      ],
    };
  }
}

// Q3 (試算表系) 問題の検証
function validateTrialBalanceQuestion(question) {
  const issues = [];

  try {
    const template = JSON.parse(question.answer_template_json);
    const correctAnswer = JSON.parse(question.correct_answer_json);

    const trialBalanceTypes = [
      "fill_in_trial_balance",
      "fill_in_comprehensive_trial_balance",
      "fill_in_financial_statement",
    ];

    if (!trialBalanceTypes.includes(template.type)) {
      return { valid: true, issues: [] };
    }

    // blanks配列の存在確認
    if (!template.blanks || !Array.isArray(template.blanks)) {
      issues.push({
        severity: "CRITICAL",
        message: "answer_template_json に blanks 配列が存在しません",
      });
      return { valid: false, issues };
    }

    if (!correctAnswer.blanks || !Array.isArray(correctAnswer.blanks)) {
      issues.push({
        severity: "CRITICAL",
        message: "correct_answer_json に blanks 配列が存在しません",
      });
      return { valid: false, issues };
    }

    // 統合型構造（template内にcorrect_answer）の判定
    const isIntegrated = isIntegratedStructure(template);

    // 各blankの検証
    template.blanks.forEach((templateBlank, idx) => {
      // choices配列の存在（統合型の場合は必須ではない場合もある）
      if (!templateBlank.choices && !Array.isArray(templateBlank.choices)) {
        // 統合型でcorrect_answerが直接指定されている場合はOK
        if (isIntegrated && templateBlank.correct_answer !== undefined) {
          return; // choices不要
        }
        issues.push({
          severity: "CRITICAL",
          message: `Template blank[${idx}] に choices 配列がありません`,
          blankIndex: templateBlank.index || templateBlank.id,
        });
        return;
      }

      // 統合型構造の検証
      if (isIntegrated && templateBlank.correct_answer !== undefined) {
        // template内のcorrect_answerを検証
        if (templateBlank.choices && Array.isArray(templateBlank.choices)) {
          const correctAnswer = templateBlank.correct_answer;
          // correct_answerがchoices配列に含まれるか確認
          if (!templateBlank.choices.includes(correctAnswer)) {
            issues.push({
              severity: "CRITICAL",
              message: `Template blank[${idx}] の correct_answer ${correctAnswer} が choices に存在しません`,
              blankIndex: templateBlank.index || templateBlank.id,
              correctAnswer: correctAnswer,
              choices: templateBlank.choices,
            });
          }
        }
        return; // 統合型の場合、correct_answer_jsonのcorrectIndexチェックは不要
      }

      // 分離型構造の検証
      // 対応するcorrect_answerのblankを探す
      const correspondingAnswer = correctAnswer.blanks.find(
        (ans) => ans.index === idx,
      );

      if (!correspondingAnswer) {
        issues.push({
          severity: "WARNING",
          message: `Template blank[${idx}] に対応する correct_answer が見つかりません`,
          templateIndex: templateBlank.index,
        });
        return;
      }

      // correctIndexの範囲チェック（分離型のみ）
      if (
        correspondingAnswer.correctIndex === undefined ||
        correspondingAnswer.correctIndex === null
      ) {
        issues.push({
          severity: "CRITICAL",
          message: `Correct answer blank[${idx}] に correctIndex がありません (分離型構造)`,
        });
        return;
      }

      const correctIdx = correspondingAnswer.correctIndex;
      if (
        templateBlank.choices &&
        (correctIdx < 0 || correctIdx >= templateBlank.choices.length)
      ) {
        issues.push({
          severity: "CRITICAL",
          message: `correctIndex ${correctIdx} が choices 配列の範囲外です (choices.length=${templateBlank.choices.length})`,
          blankIndex: idx,
          correctIndex: correctIdx,
          choicesLength: templateBlank.choices.length,
        });
      }
    });

    return {
      valid: issues.filter((i) => i.severity === "CRITICAL").length === 0,
      issues,
    };
  } catch (error) {
    return {
      valid: false,
      issues: [
        {
          severity: "CRITICAL",
          message: `JSON解析エラー: ${error.message}`,
        },
      ],
    };
  }
}

// メイン検証処理
function validateAllQ2Q3Questions() {
  console.log("📂 master-questions.ts からQ2/Q3問題を抽出中...\n");
  const questions = extractQuestionsFromTS();

  console.log(`✅ ${questions.length}問を抽出しました\n`);
  console.log("🔍 検証を開始します...\n");

  const results = {
    timestamp: new Date().toISOString(),
    totalQuestions: questions.length,
    summary: {
      vocabulary: { total: 0, valid: 0, invalid: 0, criticalIssues: 0 },
      ledger: { total: 0, valid: 0, invalid: 0, criticalIssues: 0 },
      trialBalance: { total: 0, valid: 0, invalid: 0, criticalIssues: 0 },
    },
    details: [],
  };

  questions.forEach((question) => {
    let validation;
    let category;

    // 問題タイプを判定して適切な検証を実行
    try {
      const template = JSON.parse(question.answer_template_json);
      const type = template.type;

      if (type === "vocabulary") {
        category = "vocabulary";
        validation = validateVocabularyQuestion(question);
      } else if (
        ["fill_in_ledger", "insert_column", "auxiliary_book"].includes(type)
      ) {
        category = "ledger";
        validation = validateLedgerQuestion(question);
      } else if (
        [
          "fill_in_trial_balance",
          "fill_in_comprehensive_trial_balance",
          "fill_in_financial_statement",
        ].includes(type)
      ) {
        category = "trialBalance";
        validation = validateTrialBalanceQuestion(question);
      } else {
        // Q2/Q3でも対象外のタイプはスキップ
        return;
      }

      // 統計更新
      results.summary[category].total++;
      if (validation.valid) {
        results.summary[category].valid++;
      } else {
        results.summary[category].invalid++;
      }

      const criticalCount = validation.issues.filter(
        (i) => i.severity === "CRITICAL",
      ).length;
      results.summary[category].criticalIssues += criticalCount;

      // 詳細記録（問題がある場合のみ）
      if (validation.issues.length > 0) {
        results.details.push({
          questionId: question.id,
          category: question.category_id,
          questionType: type,
          valid: validation.valid,
          issues: validation.issues,
        });

        // コンソール出力
        const status = validation.valid ? "⚠️  WARNING" : "❌ ERROR";
        console.log(`${status} ${question.id} (${type})`);
        validation.issues.forEach((issue) => {
          console.log(`  [${issue.severity}] ${issue.message}`);
        });
        console.log();
      }
    } catch (error) {
      console.log(`💥 ${question.id}: 検証中にエラー - ${error.message}\n`);
    }
  });

  return results;
}

// メイン実行
function main() {
  try {
    const results = validateAllQ2Q3Questions();

    // 結果をJSONファイルに保存
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\n📄 詳細結果を保存: ${logFile}\n`);

    // サマリー表示
    console.log("=".repeat(60));
    console.log("📊 検証結果サマリー");
    console.log("=".repeat(60));
    console.log(`総問題数: ${results.totalQuestions}`);
    console.log();

    ["vocabulary", "ledger", "trialBalance"].forEach((cat) => {
      const s = results.summary[cat];
      if (s.total > 0) {
        const catName =
          cat === "vocabulary"
            ? "Q2_V (vocabulary)"
            : cat === "ledger"
              ? "Q2_L/B (帳簿系)"
              : "Q3 (試算表系)";
        console.log(`${catName}:`);
        console.log(`  総数: ${s.total}`);
        console.log(
          `  正常: ${s.valid} (${((s.valid / s.total) * 100).toFixed(1)}%)`,
        );
        console.log(
          `  異常: ${s.invalid} (${((s.invalid / s.total) * 100).toFixed(1)}%)`,
        );
        console.log(`  Critical問題: ${s.criticalIssues}`);
        console.log();
      }
    });

    const totalIssues = results.details.length;
    const totalCritical = results.details.reduce(
      (sum, d) =>
        sum + d.issues.filter((i) => i.severity === "CRITICAL").length,
      0,
    );

    console.log(`問題のある問題数: ${totalIssues}`);
    console.log(`Critical問題総数: ${totalCritical}`);
    console.log("=".repeat(60));

    if (totalCritical > 0) {
      console.log(
        "\n⚠️  Critical問題が検出されました。詳細はログファイルを確認してください。",
      );
      process.exit(1);
    } else if (totalIssues > 0) {
      console.log(
        "\n⚠️  警告が検出されました。詳細はログファイルを確認してください。",
      );
      process.exit(0);
    } else {
      console.log("\n✅ すべてのQ2/Q3問題が正常です！");
      process.exit(0);
    }
  } catch (error) {
    console.error(`💥 致命的エラー: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = {
  validateVocabularyQuestion,
  validateLedgerQuestion,
  validateTrialBalanceQuestion,
  validateAllQ2Q3Questions,
};
