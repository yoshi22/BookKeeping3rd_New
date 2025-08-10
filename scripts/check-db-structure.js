/**
 * データベース構造確認スクリプト
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "bookkeeping.db");

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}

function getRows(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function main() {
  let db;

  try {
    console.log("データベースファイル:", dbPath);
    db = await connectToDatabase();
    console.log("データベース接続成功");

    // 全テーブル一覧を取得
    console.log("\n=== テーブル一覧 ===");
    const tables = await getRows(
      db,
      "SELECT name FROM sqlite_master WHERE type='table'",
    );
    tables.forEach((table) => {
      console.log("テーブル:", table.name);
    });

    // questionsテーブルの構造を確認（存在する場合）
    const questionsTable = tables.find((t) => t.name === "questions");
    if (questionsTable) {
      console.log("\n=== questions テーブル構造 ===");
      const columns = await getRows(db, "PRAGMA table_info(questions)");
      columns.forEach((col) => {
        console.log(
          `${col.name}: ${col.type} ${col.notnull ? "NOT NULL" : ""} ${col.pk ? "PRIMARY KEY" : ""}`,
        );
      });

      // 問題数を確認
      const count = await getRows(
        db,
        "SELECT COUNT(*) as count FROM questions",
      );
      console.log(`\n問題数: ${count[0].count}件`);

      // カテゴリ別問題数
      const categoryCount = await getRows(
        db,
        `
        SELECT category_id, COUNT(*) as count 
        FROM questions 
        GROUP BY category_id 
        ORDER BY category_id
      `,
      );
      console.log("\nカテゴリ別問題数:");
      categoryCount.forEach((row) => {
        console.log(`${row.category_id}: ${row.count}問`);
      });
    } else {
      console.log("\nquestionsテーブルが見つかりません");
    }
  } catch (error) {
    console.error("エラー:", error);
  } finally {
    if (db) {
      db.close();
    }
  }
}

main();
