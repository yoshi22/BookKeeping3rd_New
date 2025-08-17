#!/usr/bin/env node

/**
 * 残った重複問題の削除スクリプト
 * Q_J_125, Q_J_120, Q_J_196 を削除
 */

const fs = require("fs");
const path = require("path");

function main() {
  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  console.log("残った重複問題を削除します...");

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-remaining-${Date.now()}`;
  fs.copyFileSync(masterQuestionsPath, backupPath);
  console.log(`バックアップ作成: ${backupPath}`);

  // ファイル読み込み
  const originalContent = fs.readFileSync(masterQuestionsPath, "utf8");
  const arrayMatch = originalContent.match(
    /export const masterQuestions: Question\[\] = (\[[\s\S]*\]);/,
  );

  if (!arrayMatch) {
    throw new Error("Could not parse masterQuestions array");
  }

  const questions = eval("(" + arrayMatch[1] + ")");
  console.log(`元の問題数: ${questions.length}`);

  // 削除対象IDを指定
  const toRemove = new Set(["Q_J_125", "Q_J_120", "Q_J_196"]);

  // 削除実行
  const filteredQuestions = questions.filter((q) => {
    if (toRemove.has(q.id)) {
      console.log(`削除: ${q.id} - "${q.question_text}"`);
      return false;
    }
    return true;
  });

  console.log(`削除後問題数: ${filteredQuestions.length}`);
  console.log(
    `削除された問題数: ${questions.length - filteredQuestions.length}`,
  );

  // ファイル更新
  const newContent = originalContent.replace(
    /export const masterQuestions: Question\[\] = \[[\s\S]*\];/,
    `export const masterQuestions: Question[] = ${JSON.stringify(filteredQuestions, null, 2)};`,
  );

  fs.writeFileSync(masterQuestionsPath, newContent);
  console.log(`ファイル更新完了: ${masterQuestionsPath}`);
  console.log("残った重複問題の削除が完了しました！");
}

if (require.main === module) {
  main();
}
