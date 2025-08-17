#!/usr/bin/env node

/**
 * 全問題の数値を暗算可能な単純な値に修正するスクリプト
 * 仕訳・帳簿・試算表問題すべてを対象とした包括的な数値簡素化
 */

const fs = require("fs");
const path = require("path");

class ComprehensiveNumberSimplifier {
  constructor() {
    this.log = [];
    this.errors = [];
    this.modifiedCount = 0;

    // 単純な数値セット（暗算可能）
    this.simpleNumbers = [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400,
      450, 500, 600, 700, 800, 900, 1000,
    ];
  }

  /**
   * 複雑な数値を単純な数値に変換
   */
  simplifyNumber(originalNumber, category = "journal", maxValue = 500) {
    if (!originalNumber || originalNumber === 0) return 0;

    // 年号は削除（2025 → 削除）
    if (originalNumber >= 2020 && originalNumber <= 2030) {
      return null; // 年号は削除
    }

    // 日付の日・月は維持（1-31）
    if (originalNumber >= 1 && originalNumber <= 31) {
      return originalNumber;
    }

    // 既に単純な数値の場合はそのまま
    if (
      this.simpleNumbers.includes(originalNumber) &&
      originalNumber <= maxValue
    ) {
      return originalNumber;
    }

    // カテゴリ別の最大値設定
    if (category === "trial_balance") {
      maxValue = 1000;
    } else if (category === "ledger") {
      maxValue = 500;
    }

    // 適切な単純数値を選択
    const candidates = this.simpleNumbers.filter((n) => n <= maxValue);

    // 最も近い値を選択（ただし分かりやすい値を優先）
    if (originalNumber <= 50) {
      return candidates.find((n) => n >= originalNumber && n <= 50) || 50;
    } else if (originalNumber <= 100) {
      return 100;
    } else if (originalNumber <= 300) {
      // 100の倍数を優先
      return Math.min(Math.ceil(originalNumber / 100) * 100, maxValue);
    } else {
      // 大きな数値は適切な範囲に丸める
      const ratio = originalNumber / Math.max(...candidates);
      const selected =
        candidates[
          Math.min(Math.floor(ratio * candidates.length), candidates.length - 1)
        ];
      return selected;
    }
  }

  /**
   * テキスト内の数値を簡素化
   */
  simplifyTextNumbers(text, category) {
    if (!text) return text;

    return text.replace(/\b(\d{1,7})\b/g, (match, numberStr) => {
      const originalNumber = parseInt(numberStr);

      // 年号の削除処理
      if (originalNumber >= 2020 && originalNumber <= 2030) {
        // 年号を含む表現を簡素化
        return match.replace(/\d{4}年?/g, "").trim();
      }

      const simplified = this.simplifyNumber(originalNumber, category);
      return simplified !== null ? simplified.toString() : match;
    });
  }

  /**
   * 日付表記の簡素化
   */
  simplifyDateFormat(text) {
    if (!text) return text;

    // "2025年8月7日" → "8/7"
    text = text.replace(/2025年(\d{1,2})月(\d{1,2})日/g, "$1/$2");

    // "8月7日" → "8/7"
    text = text.replace(/(\d{1,2})月(\d{1,2})日/g, "$1/$2");

    // "2025年8月" → "8月"
    text = text.replace(/2025年(\d{1,2})月/g, "$1月");

    return text;
  }

  /**
   * JSON内の数値を簡素化
   */
  simplifyJsonNumbers(jsonString, category) {
    try {
      const data = JSON.parse(jsonString);

      const processObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "number") {
            const simplified = this.simplifyNumber(obj[key], category);
            if (simplified !== null) {
              obj[key] = simplified;
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            processObject(obj[key]);
          }
        }
      };

      processObject(data);
      return JSON.stringify(data);
    } catch (error) {
      this.errors.push(`JSON parse error: ${error.message}`);
      return jsonString;
    }
  }

  /**
   * 仕訳問題の借方・貸方バランス検証
   */
  validateJournalBalance(question) {
    try {
      const answer = JSON.parse(question.correct_answer_json);

      if (answer.journalEntry) {
        const debit = answer.journalEntry.debit_amount || 0;
        const credit = answer.journalEntry.credit_amount || 0;

        if (debit !== credit) {
          this.errors.push(
            `Balance error in ${question.id}: debit=${debit} != credit=${credit}`,
          );
          return false;
        }
      }

      if (answer.journalEntries && Array.isArray(answer.journalEntries)) {
        let debitTotal = 0,
          creditTotal = 0;
        answer.journalEntries.forEach((entry) => {
          debitTotal += entry.debit_amount || 0;
          creditTotal += entry.credit_amount || 0;
        });

        if (debitTotal !== creditTotal) {
          this.errors.push(
            `Balance error in ${question.id}: debitTotal=${debitTotal} != creditTotal=${creditTotal}`,
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      this.errors.push(`Validation error in ${question.id}: ${error.message}`);
      return false;
    }
  }

  /**
   * 単一問題の数値簡素化
   */
  simplifyQuestion(question) {
    const originalQuestion = JSON.parse(JSON.stringify(question));
    let modified = false;

    try {
      // 問題文の簡素化
      const simplifiedText = this.simplifyDateFormat(
        this.simplifyTextNumbers(question.question_text, question.category_id),
      );

      if (simplifiedText !== question.question_text) {
        question.question_text = simplifiedText;
        modified = true;
      }

      // 正答JSONの簡素化
      const simplifiedJson = this.simplifyJsonNumbers(
        question.correct_answer_json,
        question.category_id,
      );
      if (simplifiedJson !== question.correct_answer_json) {
        question.correct_answer_json = simplifiedJson;
        modified = true;
      }

      // 説明文の簡素化
      if (question.explanation) {
        const simplifiedExplanation = this.simplifyDateFormat(
          this.simplifyTextNumbers(question.explanation, question.category_id),
        );

        if (simplifiedExplanation !== question.explanation) {
          question.explanation = simplifiedExplanation;
          modified = true;
        }
      }

      // 仕訳問題のバランス検証
      if (question.category_id === "journal" && modified) {
        if (!this.validateJournalBalance(question)) {
          console.warn(`Validation failed for ${question.id}, reverting...`);
          return originalQuestion;
        }
      }

      // ログ記録
      if (modified) {
        this.log.push({
          id: question.id,
          category: question.category_id,
          before: {
            question_text: originalQuestion.question_text,
            correct_answer_json: originalQuestion.correct_answer_json,
            explanation: originalQuestion.explanation,
          },
          after: {
            question_text: question.question_text,
            correct_answer_json: question.correct_answer_json,
            explanation: question.explanation,
          },
        });

        this.modifiedCount++;
        console.log(`Simplified ${question.id} (${question.category_id})`);
      }

      return question;
    } catch (error) {
      this.errors.push(`Error processing ${question.id}: ${error.message}`);
      console.error(`Error processing ${question.id}:`, error);
      return originalQuestion;
    }
  }

  /**
   * 全問題の数値簡素化
   */
  simplifyAllQuestions(questions, testMode = false) {
    console.log(
      `Starting comprehensive number simplification of ${questions.length} questions`,
    );

    const questionsToProcess = testMode ? questions.slice(0, 10) : questions;

    const processedQuestions = questionsToProcess.map((question) => {
      return this.simplifyQuestion(question);
    });

    // testModeの場合は元の配列の最初の10個だけを置き換え
    if (testMode) {
      const result = [...questions];
      processedQuestions.forEach((processed, index) => {
        result[index] = processed;
      });
      return result;
    }

    return processedQuestions;
  }

  /**
   * ログファイルの保存
   */
  saveLog(filename) {
    const logData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalProcessed: this.log.length,
        modified: this.modifiedCount,
        errors: this.errors.length,
      },
      errors: this.errors,
      modifications: this.log,
    };

    fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
    console.log(`Comprehensive simplification log saved to ${filename}`);
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");
  const dryRun = args.includes("--dry-run");

  console.log("全問題包括的数値簡素化スクリプト");
  console.log(
    `Mode: ${testMode ? "TEST (first 10)" : "FULL"}, Dry run: ${dryRun}`,
  );

  try {
    // 1. 元データの読み込み
    const masterQuestionsPath = path.join(
      __dirname,
      "../src/data/master-questions.ts",
    );
    const originalContent = fs.readFileSync(masterQuestionsPath, "utf8");

    const arrayMatch = originalContent.match(
      /export const masterQuestions: Question\[\] = (\[[\s\S]*\]);/,
    );
    if (!arrayMatch) {
      throw new Error("Could not parse masterQuestions array");
    }

    const questionsArrayStr = arrayMatch[1];
    const questions = eval("(" + questionsArrayStr + ")");

    console.log(`Loaded ${questions.length} questions`);

    // 2. バックアップ作成（dry-runでない場合）
    if (!dryRun) {
      const backupPath = `${masterQuestionsPath}.backup-comprehensive-${Date.now()}`;
      fs.copyFileSync(masterQuestionsPath, backupPath);
      console.log(`Backup created: ${backupPath}`);
    }

    // 3. 数値簡素化実行
    const simplifier = new ComprehensiveNumberSimplifier();
    const simplifiedQuestions = simplifier.simplifyAllQuestions(
      questions,
      testMode,
    );

    // 4. 結果の出力
    if (!dryRun) {
      const newContent = originalContent.replace(
        /export const masterQuestions: Question\[\] = \[[\s\S]*\];/,
        `export const masterQuestions: Question[] = ${JSON.stringify(simplifiedQuestions, null, 2)};`,
      );

      fs.writeFileSync(masterQuestionsPath, newContent);
      console.log(`Updated ${masterQuestionsPath}`);
    }

    // 5. ログ保存
    const logFilename = `comprehensive-simplification-log-${Date.now()}.json`;
    simplifier.saveLog(path.join(__dirname, logFilename));

    // 6. 結果サマリー
    console.log("\n=== Comprehensive Simplification Summary ===");
    console.log(`Total questions: ${questions.length}`);
    console.log(`Modified questions: ${simplifier.modifiedCount}`);
    console.log(`Errors: ${simplifier.errors.length}`);

    if (simplifier.errors.length > 0) {
      console.log("\nErrors:");
      simplifier.errors.forEach((error) => console.log(`  - ${error}`));
    }

    console.log(
      "\nComprehensive number simplification completed successfully!",
    );
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { ComprehensiveNumberSimplifier };
