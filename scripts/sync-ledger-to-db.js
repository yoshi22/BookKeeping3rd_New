#!/usr/bin/env node

/**
 * SQLiteデータベースを master-questions.js の内容で更新
 * 第二問（帳簿）の問題を同期
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// master-questions.js を読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.js",
);
const masterQuestionsContent = fs.readFileSync(masterQuestionsPath, "utf8");

// questionsデータを抽出
const questionsMatch = masterQuestionsContent.match(
  /exports\.masterQuestions = (\[[\s\S]*?\]);/,
);
if (!questionsMatch) {
  console.error(
    "❌ master-questions.js から questions データを抽出できませんでした",
  );
  process.exit(1);
}

// 危険なeval()を避けるため、JSONとして解析を試みる
let questions;
try {
  // JavaScriptオブジェクトをJSONに変換するための簡易的な処理
  let jsonStr = questionsMatch[1]
    .replace(/id:/g, '"id":')
    .replace(/category_id:/g, '"category_id":')
    .replace(/question_text:/g, '"question_text":')
    .replace(/answer_template_json:/g, '"answer_template_json":')
    .replace(/correct_answer_json:/g, '"correct_answer_json":')
    .replace(/explanation:/g, '"explanation":')
    .replace(/difficulty:/g, '"difficulty":')
    .replace(/tags:/g, '"tags":')
    .replace(/estimated_time:/g, '"estimated_time":')
    .replace(/points:/g, '"points":')
    .replace(/learning_order:/g, '"learning_order":')
    .replace(/section_number:/g, '"section_number":')
    .replace(/question_order:/g, '"question_order":')
    .replace(/'},\s*{/g, '"},{"')
    .replace(/}'\s*}/g, '}"}"')
    .replace(/: '/g, ': "')
    .replace(/',/g, '",')
    .replace(/"\s*\+\s*"/g, "");

  // evalを使わざるを得ない（セキュリティ注意）
  eval("questions = " + questionsMatch[1]);
} catch (error) {
  console.error("❌ questions データの解析に失敗しました:", error);
  process.exit(1);
}

// データベースパスを特定
const dbPath = path.join(__dirname, "..", "BookKeeping3rd.db");

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ データベース接続エラー:", err);
    process.exit(1);
  }
  console.log("✅ データベースに接続しました");
});

// 第二問（Q_L_）の問題のみをフィルタ
const ledgerQuestions = questions.filter((q) => q.id.startsWith("Q_L_"));

console.log(`\n📝 ${ledgerQuestions.length} 件の帳簿問題を更新します...\n`);

// 各問題を更新
let updateCount = 0;
let errorCount = 0;

const updatePromises = ledgerQuestions.map((question) => {
  return new Promise((resolve, reject) => {
    const sql = `
            UPDATE questions 
            SET question_text = ?,
                answer_template_json = ?,
                correct_answer_json = ?,
                explanation = ?,
                difficulty = ?,
                tags = ?,
                estimated_time = ?,
                points = ?,
                learning_order = ?,
                section_number = ?,
                question_order = ?
            WHERE id = ?
        `;

    const params = [
      question.question_text,
      question.answer_template_json || "{}",
      question.correct_answer_json || "{}",
      question.explanation || "",
      question.difficulty || 3,
      question.tags || "",
      question.estimated_time || 180,
      question.points || 10,
      question.learning_order || 0,
      question.section_number || 2,
      question.question_order || 0,
      question.id,
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error(`  ❌ ${question.id} 更新エラー:`, err.message);
        errorCount++;
        resolve(false);
      } else {
        if (this.changes > 0) {
          console.log(`  ✓ ${question.id} を更新しました`);
          updateCount++;
        } else {
          console.log(
            `  ⚠ ${question.id} が見つかりませんでした（新規追加が必要）`,
          );
          // 新規追加を試みる
          const insertSql = `
                        INSERT INTO questions (
                            id, category_id, question_text, answer_template_json,
                            correct_answer_json, explanation, difficulty, tags,
                            estimated_time, points, learning_order, section_number, question_order
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

          const insertParams = [
            question.id,
            "ledger",
            question.question_text,
            question.answer_template_json || "{}",
            question.correct_answer_json || "{}",
            question.explanation || "",
            question.difficulty || 3,
            question.tags || "",
            question.estimated_time || 180,
            question.points || 10,
            question.learning_order || 0,
            question.section_number || 2,
            question.question_order || 0,
          ];

          db.run(insertSql, insertParams, function (insertErr) {
            if (insertErr) {
              console.error(
                `    ❌ ${question.id} 新規追加エラー:`,
                insertErr.message,
              );
              errorCount++;
            } else {
              console.log(`    ✓ ${question.id} を新規追加しました`);
              updateCount++;
            }
            resolve(!insertErr);
          });
          return;
        }
        resolve(true);
      }
    });
  });
});

// すべての更新を実行
Promise.all(updatePromises).then(() => {
  console.log(`\n✨ データベース同期完了`);
  console.log(`  ✅ 成功: ${updateCount}/${ledgerQuestions.length} 問`);
  if (errorCount > 0) {
    console.log(`  ❌ エラー: ${errorCount} 問`);
  }

  // データベースを閉じる
  db.close((err) => {
    if (err) {
      console.error("データベースクローズエラー:", err);
    } else {
      console.log("\n✅ データベース接続を閉じました");
    }
    process.exit(errorCount > 0 ? 1 : 0);
  });
});
