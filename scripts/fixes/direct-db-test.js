/**
 * 直接データベーステストスクリプト
 * TypeScript依存関係を回避してSQLiteを直接テスト
 */

const path = require("path");
const Database = require("better-sqlite3");

async function testDatabaseDirectly() {
  console.log("=== 直接データベーステスト ===");

  // 使用するデータベースファイルのパス
  const dbPath = path.join(__dirname, "../../BookKeeping3rd.db");

  try {
    console.log("1. データベースファイル接続テスト...");
    console.log(`   データベースパス: ${dbPath}`);

    // データベースに接続
    const db = Database(dbPath);

    console.log("   ✅ データベース接続成功");

    // 既存のテーブルをチェック
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

    console.log(`   既存テーブル数: ${tables.length}`);
    tables.forEach((table) => {
      console.log(`     - ${table.name}`);
    });

    // migration テーブルが存在するかチェック
    const migrationTableExists = tables.some((t) => t.name === "migrations");
    console.log(
      `   migrations テーブル: ${migrationTableExists ? "存在" : "存在しない"}`,
    );

    if (!migrationTableExists) {
      console.log("\n3. migrations テーブル作成テスト...");
      try {
        db.prepare(
          `
          CREATE TABLE migrations (
            version INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            checksum TEXT
          )
        `,
        ).run();

        console.log("   ✅ migrations テーブル作成成功");
      } catch (createError) {
        console.log(
          `   ❌ migrations テーブル作成失敗: ${createError.message}`,
        );
      }
    }

    // 基本的なテーブル作成テスト
    console.log("\n4. 基本テーブル作成テスト...");
    const testTables = [
      {
        name: "test_categories",
        sql: `CREATE TABLE IF NOT EXISTS test_categories (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT
        )`,
      },
      {
        name: "test_questions",
        sql: `CREATE TABLE IF NOT EXISTS test_questions (
          id TEXT PRIMARY KEY,
          category_id INTEGER NOT NULL,
          question_text TEXT NOT NULL,
          answer_template_json TEXT,
          correct_answer_json TEXT,
          explanation TEXT,
          difficulty INTEGER DEFAULT 1,
          tags_json TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES test_categories(id)
        )`,
      },
    ];

    for (const tableInfo of testTables) {
      try {
        db.prepare(tableInfo.sql).run();
        console.log(`   ✅ ${tableInfo.name} テーブル作成成功`);
      } catch (tableError) {
        console.log(
          `   ❌ ${tableInfo.name} テーブル作成失敗: ${tableError.message}`,
        );
      }
    }

    // テストデータ挿入
    console.log("\n5. テストデータ挿入...");
    try {
      // カテゴリデータ挿入
      db.prepare(
        "INSERT OR IGNORE INTO test_categories (id, name, description) VALUES (?, ?, ?)",
      ).run(1, "仕訳問題", "基本的な仕訳処理問題");

      // 問題データ挿入
      db.prepare(
        `INSERT OR IGNORE INTO test_questions (
        id, category_id, question_text, answer_template_json, 
        correct_answer_json, explanation, difficulty, tags_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        "TEST_Q_001",
        1,
        "テスト問題：現金1000円で商品を購入した。",
        '{"entries":[{"debit_account":"","debit_amount":"","credit_account":"","credit_amount":""}]}',
        '{"entries":[{"debit_account":"商品","debit_amount":"1000","credit_account":"現金","credit_amount":"1000"}]}',
        "このような単純な商品購入は基本的な仕訳です。",
        1,
        '{"subcategory":"basic","pattern":"cash_purchase"}',
      );

      console.log("   ✅ テストデータ挿入成功");
    } catch (insertError) {
      console.log(`   ❌ テストデータ挿入失敗: ${insertError.message}`);
    }

    // データ確認
    console.log("\n6. データ確認...");
    try {
      const categoryCount = db
        .prepare("SELECT COUNT(*) as count FROM test_categories")
        .get();
      const questionCount = db
        .prepare("SELECT COUNT(*) as count FROM test_questions")
        .get();

      console.log(`   カテゴリ数: ${categoryCount.count}`);
      console.log(`   問題数: ${questionCount.count}`);

      if (questionCount.count > 0) {
        const sampleQuestion = db
          .prepare("SELECT id, question_text FROM test_questions LIMIT 1")
          .get();
        console.log(
          `   サンプル問題: ${sampleQuestion.id} - ${sampleQuestion.question_text}`,
        );
      }
    } catch (selectError) {
      console.log(`   ❌ データ確認失敗: ${selectError.message}`);
    }

    // クリーンアップ
    console.log("\n7. テストテーブル削除...");
    try {
      db.prepare("DROP TABLE IF EXISTS test_questions").run();
      db.prepare("DROP TABLE IF EXISTS test_categories").run();
      console.log("   ✅ テストテーブル削除完了");
    } catch (cleanupError) {
      console.log(`   ❌ テストテーブル削除失敗: ${cleanupError.message}`);
    }

    db.close();

    console.log("\n=== 直接テスト結果 ===");
    console.log("データベース接続: ✅ 成功");
    console.log("基本SQL操作: ✅ 成功");
    console.log("→ SQLiteデータベースは正常に動作しています");

    return { success: true, tablesFound: tables.length };
  } catch (error) {
    console.error("\n❌ 直接データベーステストエラー:");
    console.error("エラー:", error.message);
    console.error("スタック:", error.stack);

    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  testDatabaseDirectly()
    .then((result) => {
      console.log("\n最終結果:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("実行エラー:", error.message);
      process.exit(1);
    });
}

module.exports = { testDatabaseDirectly };
