/**
/* eslint-disable */
 * データベース初期化テストスクリプト
 * アプリと同じ方法でデータベース初期化を実行してエラーを確認
 */

// Expo/React Native 環境のモック設定
process.env.NODE_ENV = "development";

// React Native 環境のグローバル変数をモック
global.__DEV__ = true;
global.console = console;

// AsyncStorage のモック
const mockAsyncStorage = {
  getItem: async (key) => {
    console.log(`[MockAsyncStorage] getItem: ${key}`);
    return null;
  },
  setItem: async (key, value) => {
    console.log(`[MockAsyncStorage] setItem: ${key} = ${value}`);
  },
  removeItem: async (key) => {
    console.log(`[MockAsyncStorage] removeItem: ${key}`);
  },
};

// グローバルにAsyncStorageを設定
global.AsyncStorage = mockAsyncStorage;

async function testDatabaseInitialization() {
  console.log("=== データベース初期化テスト ===");

  try {
    console.log("1. モジュールのインポート中...");

    // データベース初期化関数をインポート
    const { initializeDatabase } = require("../../src/data/migrations/index");
    console.log("   ✅ initializeDatabase インポート成功");

    console.log("\n2. データベース初期化実行中...");

    // 実際に初期化を実行
    await initializeDatabase();

    console.log("   ✅ データベース初期化完了");

    console.log("\n3. 初期化結果確認中...");

    // データベースの内容を確認
    const Database = require("better-sqlite3");
    const path = require("path");

    const dbFiles = [
      "../../BookKeeping3rd.db",
      "../../bookkeeping.db",
      "../../ios/bookkeeping.db",
    ];

    let foundData = false;

    for (const dbFile of dbFiles) {
      try {
        const dbPath = path.join(__dirname, dbFile);
        console.log(`   ${dbFile} を確認中...`);

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
          console.log(`     テーブルなし`);
        } else {
          console.log(`     ${tables.length}個のテーブル:`);
          tables.forEach((table) => {
            console.log(`       - ${table.name}`);
          });

          // questionsテーブルがある場合は詳細を確認
          if (tables.some((t) => t.name === "questions")) {
            const count = db
              .prepare("SELECT COUNT(*) as count FROM questions")
              .get();
            console.log(`       questions テーブル: ${count.count}件`);
            foundData = true;

            if (count.count > 0) {
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

              console.log("       カテゴリ別:");
              categories.forEach((cat) => {
                console.log(`         ${cat.category_id}: ${cat.count}件`);
              });
            }
          }
        }

        db.close();
      } catch (dbError) {
        console.log(`     エラー: ${dbError.message}`);
      }
    }

    console.log("\n=== テスト結果 ===");
    console.log(`データベース初期化: ✅ 成功`);
    console.log(`データ確認: ${foundData ? "✅ データあり" : "❌ データなし"}`);

    return { success: true, foundData };
  } catch (error) {
    console.error("\n❌ データベース初期化エラー:");
    console.error("エラー:", error.message);
    console.error("スタック:", error.stack);

    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  testDatabaseInitialization()
    .then((result) => {
      console.log("\n最終結果:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("実行エラー:", error.message);
      process.exit(1);
    });
}

module.exports = { testDatabaseInitialization };
