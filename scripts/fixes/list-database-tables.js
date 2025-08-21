const path = require("path");
const Database = require("better-sqlite3");

/**
 * データベーステーブル一覧確認スクリプト
 */

async function listDatabaseTables() {
  console.log("=== データベーステーブル一覧 ===");

  const dbFiles = [
    "../../BookKeeping3rd.db",
    "../../bookkeeping.db",
    "../../ios/bookkeeping.db",
  ];

  for (const dbFile of dbFiles) {
    try {
      const dbPath = path.join(__dirname, dbFile);
      console.log(`\n${dbFile}:`);

      const db = Database(dbPath);

      // テーブル一覧を取得
      const tables = db
        .prepare(
          `
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name
      `,
        )
        .all();

      if (tables.length === 0) {
        console.log("  テーブルなし");
      } else {
        console.log(`  ${tables.length}個のテーブル:`);
        tables.forEach((table) => {
          console.log(`    - ${table.name}`);
        });

        // questionsテーブルがある場合は詳細を確認
        if (tables.some((t) => t.name === "questions")) {
          const count = db
            .prepare("SELECT COUNT(*) as count FROM questions")
            .get();
          console.log(`    questions テーブル: ${count.count}件`);

          // カテゴリ別内訳
          const categories = db
            .prepare(
              `
            SELECT category_id, COUNT(*) as count 
            FROM questions 
            GROUP BY category_id 
            ORDER BY category_id
          `,
            )
            .all();

          console.log("    カテゴリ別:");
          categories.forEach((cat) => {
            console.log(`      ${cat.category_id}: ${cat.count}件`);
          });
        }
      }

      db.close();
    } catch (error) {
      console.log(`  エラー: ${error.message}`);
    }
  }

  console.log("\n=== 完了 ===");
}

if (require.main === module) {
  listDatabaseTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("実行エラー:", error.message);
      process.exit(1);
    });
}

module.exports = { listDatabaseTables };
