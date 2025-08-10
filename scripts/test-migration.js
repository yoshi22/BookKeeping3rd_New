/**
 * マイグレーションテストスクリプト
 * 新しいexam_sectionsテーブルとsubcategoriesテーブルの動作確認
 */

const Database = require("expo-sqlite");

async function testMigration() {
  console.log("🔍 マイグレーションテスト開始...\n");

  try {
    // データベース接続
    const db = Database.openDatabase("bookkeeping.db");

    // トランザクション実行のヘルパー関数
    const executeSql = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              params,
              (_, result) => resolve(result),
              (_, error) => {
                console.error("SQL Error:", error);
                reject(error);
                return false;
              },
            );
          },
          (error) => {
            console.error("Transaction Error:", error);
            reject(error);
          },
        );
      });
    };

    // 1. exam_sectionsテーブルの確認
    console.log("1️⃣ exam_sectionsテーブルの確認:");
    try {
      const sections = await executeSql(
        "SELECT * FROM exam_sections ORDER BY section_number",
      );
      console.log(`  ✅ ${sections.rows.length}個のセクションが見つかりました`);
      for (let i = 0; i < sections.rows.length; i++) {
        const section = sections.rows.item(i);
        console.log(
          `    - ${section.display_name}: ${section.name} (${section.total_points}点)`,
        );
      }
    } catch (error) {
      console.log(
        "  ❌ exam_sectionsテーブルが存在しません（マイグレーション未実行）",
      );
    }
    console.log();

    // 2. subcategoriesテーブルの確認
    console.log("2️⃣ subcategoriesテーブルの確認:");
    try {
      const subcategories = await executeSql(
        "SELECT * FROM subcategories ORDER BY exam_section, sort_order",
      );
      console.log(
        `  ✅ ${subcategories.rows.length}個のサブカテゴリが見つかりました`,
      );

      let currentSection = 0;
      for (let i = 0; i < subcategories.rows.length; i++) {
        const subcat = subcategories.rows.item(i);
        if (subcat.exam_section !== currentSection) {
          currentSection = subcat.exam_section;
          console.log(`\n  第${currentSection}問のサブカテゴリ:`);
        }
        console.log(`    - ${subcat.name}: ${subcat.description}`);
      }
    } catch (error) {
      console.log(
        "  ❌ subcategoriesテーブルが存在しません（マイグレーション未実行）",
      );
    }
    console.log();

    // 3. questionsテーブルのexam_sectionカラム確認
    console.log("3️⃣ questionsテーブルのexam_sectionカラム確認:");
    try {
      const questions = await executeSql(
        "SELECT exam_section, COUNT(*) as count FROM questions WHERE exam_section IS NOT NULL GROUP BY exam_section",
      );
      if (questions.rows.length > 0) {
        console.log("  ✅ exam_sectionカラムが追加されています");
        for (let i = 0; i < questions.rows.length; i++) {
          const row = questions.rows.item(i);
          console.log(`    - 第${row.exam_section}問: ${row.count}問`);
        }
      } else {
        console.log(
          "  ⚠️ exam_sectionカラムは存在しますが、値が設定されていません",
        );
      }
    } catch (error) {
      console.log(
        "  ❌ exam_sectionカラムが存在しません（マイグレーション未実行）",
      );
    }
    console.log();

    // 4. categoriesテーブルの更新確認
    console.log("4️⃣ categoriesテーブルの更新確認:");
    const categories = await executeSql(
      "SELECT * FROM categories ORDER BY sort_order",
    );
    console.log(`  ${categories.rows.length}個のカテゴリ:`);
    for (let i = 0; i < categories.rows.length; i++) {
      const cat = categories.rows.item(i);
      console.log(`    - ${cat.id}: ${cat.name}`);
      if (cat.name.includes("第")) {
        console.log("      ✅ CBT形式の名前に更新されています");
      }
    }
    console.log();

    // 5. question_detailsビューの確認
    console.log("5️⃣ question_detailsビューの確認:");
    try {
      const details = await executeSql(
        "SELECT * FROM question_details LIMIT 1",
      );
      if (details.rows.length > 0) {
        console.log("  ✅ question_detailsビューが作成されています");
        const sample = details.rows.item(0);
        console.log(
          `    サンプル: ${sample.section_name || "N/A"} - ${sample.subcategory_name || "N/A"}`,
        );
      }
    } catch (error) {
      console.log("  ❌ question_detailsビューが存在しません");
    }
    console.log();

    // 6. マイグレーション履歴の確認
    console.log("6️⃣ マイグレーション履歴の確認:");
    try {
      const migrations = await executeSql(
        "SELECT * FROM migrations ORDER BY version",
      );
      console.log(`  ${migrations.rows.length}個のマイグレーション実行済み:`);
      for (let i = 0; i < migrations.rows.length; i++) {
        const mig = migrations.rows.item(i);
        console.log(
          `    - Version ${mig.version}: ${mig.name} (${new Date(mig.executed_at).toLocaleString()})`,
        );
      }
    } catch (error) {
      console.log("  ❌ migrationsテーブルが存在しません");
    }

    console.log("\n✨ マイグレーションテスト完了!");
  } catch (error) {
    console.error("\n❌ エラーが発生しました:", error);
  }
}

// 実行
testMigration().catch(console.error);
