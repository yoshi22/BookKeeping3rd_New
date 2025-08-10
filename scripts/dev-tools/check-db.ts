import { databaseService } from "./src/data/database";

async function checkDatabase() {
  try {
    await databaseService.initialize();

    // questionsテーブルの存在確認
    const tables = await databaseService.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='questions'",
    );
    console.log("Questions table exists:", tables.rows.length > 0);

    // 問題数の確認
    const count = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );
    console.log("Total questions:", count.rows[0]?.count || 0);

    // カテゴリ別の問題数
    const categoryCount = await databaseService.executeSql(
      "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id",
    );
    console.log("Questions by category:");
    categoryCount.rows.forEach((row) => {
      console.log("  " + row.category_id + ":", row.count);
    });

    // categoriesテーブルの内容確認
    const categories = await databaseService.executeSql(
      "SELECT * FROM categories",
    );
    console.log("\nCategories table:");
    categories.rows.forEach((row) => {
      console.log("  " + row.id + ":", row.name);
    });

    await databaseService.close();
  } catch (error) {
    console.error("Database check failed:", error);
  }
}

checkDatabase();
