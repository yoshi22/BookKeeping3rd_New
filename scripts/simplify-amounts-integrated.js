#!/usr/bin/env node

/**
 * 簿記問題データの数値簡素化スクリプト（統合版）
 * 問題文・正答・説明文の金額を整合性を保って一括変換
 */

const fs = require("fs");
const path = require("path");

class AmountSimplifier {
  constructor() {
    this.log = [];
    this.errors = [];
  }

  /**
   * テキストから金額を抽出
   */
  extractAmounts(text) {
    const matches = text.match(/([0-9,]+)円/g);
    if (!matches) return [];

    return matches.map((match) => {
      const amount = parseInt(match.replace(/[,円]/g, ""));
      return { original: match, amount: amount };
    });
  }

  /**
   * 変換スケールを決定
   */
  determineScale(amounts) {
    if (amounts.length === 0) return 1;

    const maxAmount = Math.max(...amounts.map((a) => a.amount));

    if (maxAmount >= 1000000) return 1 / 1000; // 1,000,000円以上 → 1/1000
    if (maxAmount >= 100000) return 1 / 1000; // 100,000円〜999,999円 → 1/1000
    if (maxAmount >= 10000) return 1 / 100; // 10,000円〜99,999円 → 1/100
    if (maxAmount >= 1000) return 1 / 10; // 1,000円〜9,999円 → 1/10

    return 1; // そのまま
  }

  /**
   * 端数処理
   */
  roundAmount(amount) {
    if (amount === 0) return 0;

    if (amount < 50) {
      return Math.max(10, Math.round(amount / 10) * 10);
    }
    if (amount < 100) {
      return Math.round(amount / 10) * 10;
    }
    if (amount < 1000) {
      return Math.round(amount / 50) * 50;
    }

    return Math.round(amount / 100) * 100;
  }

  /**
   * テキスト内の金額を変換
   */
  transformText(text, scale) {
    if (!text) return text;

    return text.replace(/([0-9,]+)円/g, (match, amountStr) => {
      const originalAmount = parseInt(amountStr.replace(/,/g, ""));
      const scaledAmount = originalAmount * scale;
      const roundedAmount = this.roundAmount(scaledAmount);

      // カンマ区切りは3桁以上の場合のみ
      if (roundedAmount >= 1000) {
        return roundedAmount.toLocaleString() + "円";
      } else {
        return roundedAmount + "円";
      }
    });
  }

  /**
   * JSON内の金額を変換
   */
  transformAnswerJson(answerJson, scale) {
    try {
      const answer = JSON.parse(answerJson);

      // 単一仕訳の場合
      if (answer.journalEntry) {
        answer.journalEntry.debit_amount = this.roundAmount(
          answer.journalEntry.debit_amount * scale,
        );
        answer.journalEntry.credit_amount = this.roundAmount(
          answer.journalEntry.credit_amount * scale,
        );
      }

      // 複数仕訳の場合
      if (answer.journalEntries && Array.isArray(answer.journalEntries)) {
        answer.journalEntries.forEach((entry) => {
          entry.debit_amount = this.roundAmount(entry.debit_amount * scale);
          entry.credit_amount = this.roundAmount(entry.credit_amount * scale);
        });
      }

      // 帳簿問題の場合
      if (answer.entries && Array.isArray(answer.entries)) {
        answer.entries.forEach((entry) => {
          if (entry.debit) entry.debit = this.roundAmount(entry.debit * scale);
          if (entry.credit)
            entry.credit = this.roundAmount(entry.credit * scale);
          if (entry.balance)
            entry.balance = this.roundAmount(entry.balance * scale);
        });
      }

      // 試算表問題の場合
      if (answer.trialBalance && Array.isArray(answer.trialBalance)) {
        answer.trialBalance.forEach((entry) => {
          if (entry.debit_balance)
            entry.debit_balance = this.roundAmount(entry.debit_balance * scale);
          if (entry.credit_balance)
            entry.credit_balance = this.roundAmount(
              entry.credit_balance * scale,
            );
          if (entry.debit_total)
            entry.debit_total = this.roundAmount(entry.debit_total * scale);
          if (entry.credit_total)
            entry.credit_total = this.roundAmount(entry.credit_total * scale);
        });
      }

      return JSON.stringify(answer);
    } catch (error) {
      this.errors.push(`JSON parse error: ${error.message}`);
      return answerJson; // エラー時は元のJSONを返す
    }
  }

  /**
   * 問題の検証
   */
  validateQuestion(question) {
    try {
      const answer = JSON.parse(question.correct_answer_json);

      // 借方・貸方のバランス確認（仕訳問題のみ）
      if (answer.journalEntry) {
        const debit = answer.journalEntry.debit_amount;
        const credit = answer.journalEntry.credit_amount;

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
   * 単一問題の変換
   */
  simplifyQuestion(question) {
    const originalQuestion = JSON.parse(JSON.stringify(question)); // 深いコピー

    try {
      // 1. 問題文から金額を抽出
      const amounts = this.extractAmounts(question.question_text);

      // 2. 変換スケールを決定
      const scale = this.determineScale(amounts);

      if (scale === 1) {
        console.log(`Skipping ${question.id}: no conversion needed`);
        return question;
      }

      console.log(`Converting ${question.id} with scale ${scale}`);

      // 3. 問題文の変換
      question.question_text = this.transformText(
        question.question_text,
        scale,
      );

      // 4. 正答JSONの変換
      question.correct_answer_json = this.transformAnswerJson(
        question.correct_answer_json,
        scale,
      );

      // 5. 説明文の変換
      question.explanation = this.transformText(question.explanation, scale);

      // 6. 検証
      if (!this.validateQuestion(question)) {
        console.error(`Validation failed for ${question.id}, reverting...`);
        return originalQuestion;
      }

      // 7. ログ記録
      this.log.push({
        id: question.id,
        scale: scale,
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

      return question;
    } catch (error) {
      this.errors.push(`Error processing ${question.id}: ${error.message}`);
      console.error(`Error processing ${question.id}:`, error);
      return originalQuestion; // エラー時は元の問題を返す
    }
  }

  /**
   * 問題データ全体の変換
   */
  simplifyQuestions(questions, testMode = false) {
    console.log(
      `Starting conversion of ${questions.length} questions (testMode: ${testMode})`,
    );

    const questionsToProcess = testMode ? questions.slice(0, 10) : questions;

    const convertedQuestions = questionsToProcess.map((question) => {
      return this.simplifyQuestion(question);
    });

    // testModeの場合は元の配列の最初の10個だけを置き換え
    if (testMode) {
      const result = [...questions];
      convertedQuestions.forEach((converted, index) => {
        result[index] = converted;
      });
      return result;
    }

    return convertedQuestions;
  }

  /**
   * ログファイルの保存
   */
  saveLog(filename) {
    const logData = {
      timestamp: new Date().toISOString(),
      totalProcessed: this.log.length,
      errors: this.errors,
      conversions: this.log,
    };

    fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
    console.log(`Conversion log saved to ${filename}`);
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes("--test");
  const dryRun = args.includes("--dry-run");

  console.log("簿記問題データ数値簡素化スクリプト");
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

    // TypeScriptファイルから配列部分を抽出
    const arrayMatch = originalContent.match(
      /export const masterQuestions: Question\[\] = (\[[\s\S]*\]);/,
    );
    if (!arrayMatch) {
      throw new Error("Could not parse masterQuestions array");
    }

    // JSONとして評価するために、exportと型注釈を除去
    const questionsArrayStr = arrayMatch[1];
    const questions = eval("(" + questionsArrayStr + ")");

    console.log(`Loaded ${questions.length} questions`);

    // 2. バックアップ作成（dry-runでない場合）
    if (!dryRun) {
      const backupPath = `${masterQuestionsPath}.backup-${Date.now()}`;
      fs.copyFileSync(masterQuestionsPath, backupPath);
      console.log(`Backup created: ${backupPath}`);
    }

    // 3. 変換実行
    const simplifier = new AmountSimplifier();
    const convertedQuestions = simplifier.simplifyQuestions(
      questions,
      testMode,
    );

    // 4. 結果の出力
    if (!dryRun) {
      const newContent = originalContent.replace(
        /export const masterQuestions: Question\[\] = \[[\s\S]*\];/,
        `export const masterQuestions: Question[] = ${JSON.stringify(convertedQuestions, null, 2)};`,
      );

      fs.writeFileSync(masterQuestionsPath, newContent);
      console.log(`Updated ${masterQuestionsPath}`);
    }

    // 5. ログ保存
    const logFilename = `conversion-log-${Date.now()}.json`;
    simplifier.saveLog(path.join(__dirname, logFilename));

    // 6. 結果サマリー
    console.log("\n=== Conversion Summary ===");
    console.log(`Processed: ${simplifier.log.length} questions`);
    console.log(`Errors: ${simplifier.errors.length}`);

    if (simplifier.errors.length > 0) {
      console.log("\nErrors:");
      simplifier.errors.forEach((error) => console.log(`  - ${error}`));
    }

    console.log("\nConversion completed successfully!");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { AmountSimplifier };
