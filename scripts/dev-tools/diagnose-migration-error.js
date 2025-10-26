/**
 * マイグレーションエラー診断スクリプト
 * 003-add-question-structureマイグレーションの問題を調査
 */

const path = require("path");

// TypeScriptファイルを読み込むためのパス設定
const projectRoot = path.resolve(__dirname, "../..");
const srcPath = path.join(projectRoot, "src");

// database.tsをrequireできるようにする
const { databaseService } = require(path.join(srcPath, "data/database"));

async function diagnoseMigrationError() {
  try {
    console.log("=== マイグレーションエラー診断開始 ===\n");

    // データベース初期化
    console.log("【1】データベース初期化");
    await databaseService.initialize();
    console.log("✓ 初期化完了\n");

    // questionsテーブルの現在のスキーマ確認
    console.log("【2】questionsテーブルのスキーマ確認:");
    try {
      const schema = await databaseService.executeSql(
        "PRAGMA table_info(questions)",
      );
      console.table(schema.rows);
    } catch (error) {
      console.error("スキーマ取得エラー:", error.message);
    }
    console.log("");

    // マイグレーションテーブルの確認
    console.log("【3】実行済みマイグレーション確認:");
    try {
      const migrations = await databaseService.executeSql(
        "SELECT * FROM migrations ORDER BY version",
      );
      console.table(migrations.rows);
    } catch (error) {
      console.error("マイグレーション確認エラー:", error.message);
    }
    console.log("");

    // migration003のSQL文を個別実行してエラー確認
    console.log("【4】migration003のSQL文を個別実行:");
    const migration003Sqls = [
      "ALTER TABLE questions ADD COLUMN subcategory TEXT",
      "ALTER TABLE questions ADD COLUMN section_number INTEGER",
      "ALTER TABLE questions ADD COLUMN question_order INTEGER",
      "ALTER TABLE questions ADD COLUMN pattern_type TEXT",
    ];

    for (let i = 0; i < migration003Sqls.length; i++) {
      const sql = migration003Sqls[i];
      console.log(`\n  実行 ${i + 1}/${migration003Sqls.length}: ${sql}`);
      try {
        await databaseService.executeSql(sql, []);
        console.log("  → ✓ 成功");
      } catch (error) {
        console.log(`  → ✗ エラー: ${error.message}`);
        console.log(`  エラータイプ: ${error.constructor.name}`);
        console.log(`  エラー詳細:`, error);
      }
    }

    console.log("\n【5】実行後のスキーマ確認:");
    const schemaAfter = await databaseService.executeSql(
      "PRAGMA table_info(questions)",
    );
    console.table(schemaAfter.rows);

    console.log("\n=== 診断完了 ===");
    await databaseService.close();
  } catch (error) {
    console.error("診断エラー:", error);
    console.error("スタックトレース:", error.stack);
    process.exit(1);
  }
}

diagnoseMigrationError();
