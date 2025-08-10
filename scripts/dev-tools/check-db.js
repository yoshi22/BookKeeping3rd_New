const { databaseService } = require("./src/data/database");

async function checkDatabase() {
  try {
    console.log("=== データベース診断開始 ===");
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
    console.log("\nQuestions by category:");
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

    // exam_sectionsテーブルの確認
    try {
      const examSections = await databaseService.executeSql(
        "SELECT * FROM exam_sections ORDER BY section_number",
      );
      console.log("\nExam sections table:");
      examSections.rows.forEach((row) => {
        console.log(
          `  第${row.section_number}問:`,
          row.display_name,
          "-",
          row.name,
          `(${row.total_points}点)`,
        );
      });
    } catch (e) {
      console.log("\nExam sections table: テーブルが存在しません");
    }

    console.log("\n=== データベース診断完了 ===");
    await databaseService.close();
  } catch (error) {
    console.error("Database check failed:", error);
  }
}

checkDatabase();
