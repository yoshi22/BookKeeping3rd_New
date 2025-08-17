#!/usr/bin/env node

/**
 * 残った複雑な数値を修正するスクリプト
 * 小数点付き数値の整数化と1000以上の数値の簡素化
 */

const fs = require("fs");
const path = require("path");

class RemainingNumberFixer {
  constructor() {
    this.log = [];
    this.errors = [];
    this.modifiedCount = 0;
  }

  /**
   * 小数点付き数値を整数に変換
   */
  removeDecimals(text) {
    if (!text) return text;

    // "350,450.8円" → "350円"
    return text.replace(/([0-9,]+)\.([0-9]+)円/g, (match, intPart, decPart) => {
      const baseNumber = parseInt(intPart.replace(/,/g, ""));
      // 100以下に簡素化
      const simplified = Math.max(10, Math.round(baseNumber / 1000) * 10);
      return simplified + "円";
    });
  }

  /**
   * 大きな数値を簡素化
   */
  simplifyLargeNumbers(text) {
    if (!text) return text;

    return text.replace(/\b([0-9,]+)\b/g, (match) => {
      const number = parseInt(match.replace(/,/g, ""));

      // 年号は保持
      if (number >= 2020 && number <= 2030) return match;

      // 日付は保持
      if (number >= 1 && number <= 31) return match;

      // 1000以上の数値を簡素化
      if (number >= 1000) {
        // 1000-9999 → 100-900
        if (number < 10000) {
          return Math.min(900, Math.round(number / 100) * 100).toString();
        }
        // 10000以上 → 200-500
        else {
          return Math.min(500, Math.round(number / 1000) * 100).toString();
        }
      }

      return match;
    });
  }

  /**
   * JSON内の数値を修正
   */
  fixJsonNumbers(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      const processObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "number") {
            const num = obj[key];
            if (num >= 1000) {
              // 1000以上の数値を簡素化
              if (num < 10000) {
                obj[key] = Math.min(900, Math.round(num / 100) * 100);
              } else {
                obj[key] = Math.min(500, Math.round(num / 1000) * 100);
              }
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
   * 単一問題の修正
   */
  fixQuestion(question) {
    const originalQuestion = JSON.parse(JSON.stringify(question));
    let modified = false;

    try {
      // 問題文の修正
      const fixedQuestionText = this.simplifyLargeNumbers(
        this.removeDecimals(question.question_text),
      );

      if (fixedQuestionText !== question.question_text) {
        question.question_text = fixedQuestionText;
        modified = true;
      }

      // 正答JSONの修正
      const fixedJson = this.fixJsonNumbers(question.correct_answer_json);
      if (fixedJson !== question.correct_answer_json) {
        question.correct_answer_json = fixedJson;
        modified = true;
      }

      // 説明文の修正
      if (question.explanation) {
        const fixedExplanation = this.simplifyLargeNumbers(
          this.removeDecimals(question.explanation),
        );

        if (fixedExplanation !== question.explanation) {
          question.explanation = fixedExplanation;
          modified = true;
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
        console.log(`Fixed remaining complex numbers in ${question.id}`);
      }

      return question;
    } catch (error) {
      this.errors.push(`Error processing ${question.id}: ${error.message}`);
      console.error(`Error processing ${question.id}:`, error);
      return originalQuestion;
    }
  }

  /**
   * 全問題の修正
   */
  fixAllQuestions(questions) {
    console.log(
      `Starting remaining complex number fixes for ${questions.length} questions`,
    );

    const processedQuestions = questions.map((question) => {
      return this.fixQuestion(question);
    });

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
    console.log(`Remaining complex number fix log saved to ${filename}`);
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("残った複雑数値修正スクリプト");
  console.log(`Dry run: ${dryRun}`);

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
      const backupPath = `${masterQuestionsPath}.backup-remaining-fix-${Date.now()}`;
      fs.copyFileSync(masterQuestionsPath, backupPath);
      console.log(`Backup created: ${backupPath}`);
    }

    // 3. 修正実行
    const fixer = new RemainingNumberFixer();
    const fixedQuestions = fixer.fixAllQuestions(questions);

    // 4. 結果の出力
    if (!dryRun) {
      const newContent = originalContent.replace(
        /export const masterQuestions: Question\[\] = \[[\s\S]*\];/,
        `export const masterQuestions: Question[] = ${JSON.stringify(fixedQuestions, null, 2)};`,
      );

      fs.writeFileSync(masterQuestionsPath, newContent);
      console.log(`Updated ${masterQuestionsPath}`);
    }

    // 5. ログ保存
    const logFilename = `remaining-complex-fix-log-${Date.now()}.json`;
    fixer.saveLog(path.join(__dirname, logFilename));

    // 6. 結果サマリー
    console.log("\\n=== Remaining Complex Number Fix Summary ===");
    console.log(`Total questions: ${questions.length}`);
    console.log(`Modified questions: ${fixer.modifiedCount}`);
    console.log(`Errors: ${fixer.errors.length}`);

    if (fixer.errors.length > 0) {
      console.log("\\nErrors:");
      fixer.errors.forEach((error) => console.log(`  - ${error}`));
    }

    console.log("\\nRemaining complex number fixes completed successfully!");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { RemainingNumberFixer };
