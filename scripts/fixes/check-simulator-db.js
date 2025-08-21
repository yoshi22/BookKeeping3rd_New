/**
 * シミュレーター内の実際のデータベースファイルを確認
 */

const path = require("path");
const Database = require("better-sqlite3");

async function checkSimulatorDatabase() {
  console.log("=== シミュレーターデータベース確認 ===");

  // 実際のシミュレーターデータベースパス
  const dbPath =
    "/Users/muroiyousuke/Library/Developer/CoreSimulator/Devices/151E4BCD-4290-4A06-B74F-BF78A874FB03/data/Containers/Data/Application/60CA975C-7C0E-478C-A1B3-36A152D85052/Documents/SQLite/bookkeeping.db";

  try {
    console.log("1. データベースファイル接続...");
    console.log(`   データベースパス: ${dbPath}`);

    const db = Database(dbPath);
    console.log("   ✅ データベース接続成功");

    // テーブル一覧を取得
    console.log("\n2. 既存テーブル確認...");
    const tables = db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `,
      )
      .all();

    console.log(`   テーブル数: ${tables.length}`);
    tables.forEach((table) => {
      console.log(`     - ${table.name}`);
    });

    // categoriesテーブルがある場合の内容確認
    if (tables.some((t) => t.name === "categories")) {
      console.log("\n3. categoriesテーブル内容確認...");
      const categories = db
        .prepare("SELECT * FROM categories ORDER BY sort_order")
        .all();
      console.log(`   カテゴリ数: ${categories.length}`);
      categories.forEach((cat) => {
        console.log(`     - ${cat.id}: ${cat.name} (${cat.total_questions}問)`);
      });
    }

    // questionsテーブルがある場合の内容確認
    if (tables.some((t) => t.name === "questions")) {
      console.log("\n4. questionsテーブル内容確認...");
      const questionCount = db
        .prepare("SELECT COUNT(*) as count FROM questions")
        .get();
      console.log(`   問題総数: ${questionCount.count}件`);

      if (questionCount.count > 0) {
        // カテゴリ別の問題数
        const categoryStats = db
          .prepare(
            `
          SELECT category_id, COUNT(*) as count 
          FROM questions 
          GROUP BY category_id 
          ORDER BY category_id
        `,
          )
          .all();

        console.log("   カテゴリ別問題数:");
        categoryStats.forEach((stat) => {
          console.log(`     ${stat.category_id}: ${stat.count}件`);
        });

        // 最初の問題を確認
        console.log("\n5. サンプル問題データ確認...");
        const sampleQuestion = db
          .prepare(
            "SELECT id, category_id, question_text FROM questions LIMIT 3",
          )
          .all();
        sampleQuestion.forEach((q) => {
          console.log(
            `     ${q.id}: category="${q.category_id}" - ${q.question_text.substring(0, 50)}...`,
          );
        });
      }
    }

    // migrationsテーブルの確認
    if (tables.some((t) => t.name === "migrations")) {
      console.log("\n6. migrationsテーブル確認...");
      const migrations = db
        .prepare("SELECT version, name FROM migrations ORDER BY version")
        .all();
      console.log(`   実行済みマイグレーション: ${migrations.length}個`);
      migrations.forEach((m) => {
        console.log(`     v${m.version}: ${m.name}`);
      });
    }

    db.close();

    console.log("\n=== 結果 ===");
    console.log("✅ シミュレーターデータベース確認完了");

    return { success: true, tables: tables.length };
  } catch (error) {
    console.error("\n❌ シミュレーターデータベース確認エラー:");
    console.error("エラー:", error.message);
    console.error("スタック:", error.stack);

    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  checkSimulatorDatabase()
    .then((result) => {
      console.log("\n最終結果:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("実行エラー:", error.message);
      process.exit(1);
    });
}

module.exports = { checkSimulatorDatabase };
