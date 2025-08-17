#!/usr/bin/env node

/**
 * 簿記問題データの重複除去と変換エラー修正スクリプト
 * 1. 重複問題の除去（最初のIDを残し後の重複を削除）
 * 2. 金額変換エラーの修正（"1,0円"等の異常表記を修正）
 */

const fs = require("fs");
const path = require("path");

class ProblemFixer {
  constructor() {
    this.log = [];
    this.errors = [];
    this.removedCount = 0;
    this.fixedCount = 0;
  }

  /**
   * 重複問題を検出し、除去対象を特定
   */
  findDuplicates(questions) {
    const textToIds = {};
    const duplicateGroups = [];
    const toRemove = new Set();

    // 問題文をキーとしてグループ化
    questions.forEach((q) => {
      const text = q.question_text;
      if (!textToIds[text]) {
        textToIds[text] = [];
      }
      textToIds[text].push(q);
    });

    // 重複グループを特定
    Object.entries(textToIds).forEach(([text, questionList]) => {
      if (questionList.length > 1) {
        duplicateGroups.push({
          text: text,
          questions: questionList,
        });

        // 最初のID（番号が若い）を残し、後の重複を削除対象に
        const sorted = questionList.sort((a, b) => a.id.localeCompare(b.id));
        for (let i = 1; i < sorted.length; i++) {
          toRemove.add(sorted[i].id);
        }
      }
    });

    return { duplicateGroups, toRemove };
  }

  /**
   * 金額変換エラーを修正
   */
  fixConversionErrors(question) {
    const originalQuestion = JSON.parse(JSON.stringify(question));
    let fixed = false;

    // 問題文の修正
    const fixedQuestionText = question.question_text.replace(
      /([0-9]+),([0-9]{1,2})円/g,
      (match, beforeComma, afterComma) => {
        // 1,0 → 100、22,0 → 220、などに修正
        const amount = parseInt(beforeComma + afterComma.padEnd(2, "0"));
        fixed = true;
        return `${amount}円`;
      },
    );

    // 正答JSONの修正
    let fixedAnswerJson = question.correct_answer_json;
    try {
      const answer = JSON.parse(question.correct_answer_json);

      // 単一仕訳の場合
      if (answer.journalEntry) {
        const debitAmount = answer.journalEntry.debit_amount;
        const creditAmount = answer.journalEntry.credit_amount;

        // 1000000などの大きな値を適切な値に修正
        if (debitAmount >= 1000000 && fixedQuestionText.includes("円")) {
          // 問題文から金額を抽出
          const amountMatch = fixedQuestionText.match(/([0-9,]+)円/);
          if (amountMatch) {
            const correctAmount = parseInt(amountMatch[1].replace(/,/g, ""));
            answer.journalEntry.debit_amount = correctAmount;
            answer.journalEntry.credit_amount = correctAmount;
            fixed = true;
          }
        }
      }

      // 複数仕訳の場合も同様に処理
      if (answer.journalEntries && Array.isArray(answer.journalEntries)) {
        answer.journalEntries.forEach((entry) => {
          if (entry.debit_amount >= 1000000) {
            const amountMatch = fixedQuestionText.match(/([0-9,]+)円/);
            if (amountMatch) {
              const correctAmount = parseInt(amountMatch[1].replace(/,/g, ""));
              entry.debit_amount = correctAmount;
              entry.credit_amount = correctAmount;
              fixed = true;
            }
          }
        });
      }

      fixedAnswerJson = JSON.stringify(answer);
    } catch (error) {
      this.errors.push(`JSON parse error for ${question.id}: ${error.message}`);
    }

    // 説明文の修正
    const fixedExplanation = question.explanation
      ? question.explanation.replace(
          /([0-9]+),([0-9]{1,2})円/g,
          (match, beforeComma, afterComma) => {
            const amount = parseInt(beforeComma + afterComma.padEnd(2, "0"));
            return `${amount}円`;
          },
        )
      : question.explanation;

    if (fixed) {
      this.log.push({
        id: question.id,
        type: "conversion_error_fix",
        before: {
          question_text: originalQuestion.question_text,
          correct_answer_json: originalQuestion.correct_answer_json,
          explanation: originalQuestion.explanation,
        },
        after: {
          question_text: fixedQuestionText,
          correct_answer_json: fixedAnswerJson,
          explanation: fixedExplanation,
        },
      });

      this.fixedCount++;

      return {
        ...question,
        question_text: fixedQuestionText,
        correct_answer_json: fixedAnswerJson,
        explanation: fixedExplanation,
      };
    }

    return question;
  }

  /**
   * 問題データの修正処理
   */
  fixProblems(questions) {
    console.log(`開始: ${questions.length}問の問題を処理中...`);

    // 1. 重複問題の検出
    const { duplicateGroups, toRemove } = this.findDuplicates(questions);

    console.log(`重複グループ数: ${duplicateGroups.length}`);
    console.log(`削除対象問題数: ${toRemove.size}`);

    // 2. 重複ログ記録
    duplicateGroups.forEach((group) => {
      const sorted = group.questions.sort((a, b) => a.id.localeCompare(b.id));
      this.log.push({
        type: "duplicate_removal",
        text: group.text,
        kept: sorted[0].id,
        removed: sorted.slice(1).map((q) => q.id),
      });
    });

    // 3. 重複除去と変換エラー修正
    const fixedQuestions = questions
      .filter((q) => {
        if (toRemove.has(q.id)) {
          this.removedCount++;
          return false;
        }
        return true;
      })
      .map((q) => this.fixConversionErrors(q));

    console.log(`処理完了:`);
    console.log(`  削除された重複問題: ${this.removedCount}問`);
    console.log(`  修正された変換エラー: ${this.fixedCount}問`);
    console.log(`  最終問題数: ${fixedQuestions.length}問`);

    return fixedQuestions;
  }

  /**
   * ログファイルの保存
   */
  saveLog(filename) {
    const logData = {
      timestamp: new Date().toISOString(),
      summary: {
        originalCount: this.removedCount + this.fixedCount,
        duplicatesRemoved: this.removedCount,
        conversionErrorsFixed: this.fixedCount,
        errors: this.errors.length,
      },
      errors: this.errors,
      changes: this.log,
    };

    fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
    console.log(`修正ログ保存: ${filename}`);
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("簿記問題データ重複・変換エラー修正スクリプト");
  console.log(`Dry run: ${dryRun}`);

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

    const questionsArrayStr = arrayMatch[1];
    const questions = eval("(" + questionsArrayStr + ")");

    console.log(`読み込み完了: ${questions.length}問`);

    // 2. バックアップ作成（dry-runでない場合）
    if (!dryRun) {
      const backupPath = `${masterQuestionsPath}.backup-${Date.now()}`;
      fs.copyFileSync(masterQuestionsPath, backupPath);
      console.log(`バックアップ作成: ${backupPath}`);
    }

    // 3. 修正実行
    const fixer = new ProblemFixer();
    const fixedQuestions = fixer.fixProblems(questions);

    // 4. 結果の出力
    if (!dryRun) {
      const newContent = originalContent.replace(
        /export const masterQuestions: Question\[\] = \[[\s\S]*\];/,
        `export const masterQuestions: Question[] = ${JSON.stringify(fixedQuestions, null, 2)};`,
      );

      fs.writeFileSync(masterQuestionsPath, newContent);
      console.log(`ファイル更新完了: ${masterQuestionsPath}`);
    }

    // 5. ログ保存
    const logFilename = `fix-log-${Date.now()}.json`;
    fixer.saveLog(path.join(__dirname, logFilename));

    // 6. 結果サマリー
    console.log("\n=== 修正サマリー ===");
    console.log(`処理前問題数: ${questions.length}`);
    console.log(`削除された重複: ${fixer.removedCount}問`);
    console.log(`修正された変換エラー: ${fixer.fixedCount}問`);
    console.log(`処理後問題数: ${fixedQuestions.length}問`);
    console.log(`エラー: ${fixer.errors.length}件`);

    if (fixer.errors.length > 0) {
      console.log("\nエラー詳細:");
      fixer.errors.forEach((error) => console.log(`  - ${error}`));
    }

    console.log("\n修正処理が正常に完了しました！");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { ProblemFixer };
