// データベースサービス用のモック実装（スクリプト実行用）
/* eslint-disable */
const path = require("path");
const fs = require("fs");

// Node.js環境でSQLiteを使用
const Database = require("better-sqlite3");

async function createDatabaseConnection() {
  const dbPath = path.join(__dirname, "../../bookkeeping.db");
  const db = Database(dbPath);

  return {
    executeSql: (sql, params = []) => {
      try {
        const stmt = db.prepare(sql);
        if (sql.toLowerCase().startsWith("select")) {
          const rows = stmt.all(...params);
          return { rows };
        } else {
          const result = stmt.run(...params);
          return { rows: [result] };
        }
      } catch (error) {
        throw new Error(`SQL execution error: ${error.message}`);
      }
    },
    isConnected: () => true,
    checkIntegrity: () => {
      try {
        const result = db.prepare("PRAGMA integrity_check").get();
        return result.integrity_check === "ok";
      } catch {
        return false;
      }
    },
    close: () => db.close(),
  };
}

let databaseService = null;

/**
 * データベース内容デバッグスクリプト
 * 実際にデータベースに保存されている問題数と内容を確認
 */

async function debugDatabaseContent() {
  console.log("=== データベース内容デバッグ ===");

  try {
    console.log("1. データベース接続中...");
    databaseService = await createDatabaseConnection();

    if (!databaseService.isConnected()) {
      throw new Error("Database connection failed");
    }
    console.log("   ✅ データベース接続成功");

    // 全体の問題数確認
    console.log("\n2. 全体問題数確認");
    const totalResult = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );
    const totalCount = totalResult.rows[0]?.count || 0;
    console.log(`   総問題数: ${totalCount}件`);

    // カテゴリ別問題数確認
    console.log("\n3. カテゴリ別問題数確認");
    const categoryResult = await databaseService.executeSql(
      "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id ORDER BY category_id",
    );

    categoryResult.rows.forEach((row) => {
      console.log(`   ${row.category_id}: ${row.count}件`);
    });

    // journal カテゴリの詳細確認
    console.log("\n4. journal カテゴリの詳細確認");
    const journalResult = await databaseService.executeSql(
      "SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 10",
    );

    console.log(
      `   journal 問題数: ${categoryResult.rows.find((r) => r.category_id === "journal")?.count || 0}`,
    );
    console.log("   最初の10問:");
    journalResult.rows.forEach((row, index) => {
      console.log(`     ${index + 1}. ${row.id}`);
    });

    // journal カテゴリの最後の問題を確認
    const journalLastResult = await databaseService.executeSql(
      "SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id DESC LIMIT 5",
    );

    console.log("   最後の5問:");
    journalLastResult.rows.reverse().forEach((row, index) => {
      const actualIndex =
        (categoryResult.rows.find((r) => r.category_id === "journal")?.count ||
          0) -
        4 +
        index;
      console.log(`     ${actualIndex}. ${row.id}`);
    });

    // Q_J_135 が存在するか確認
    console.log("\n5. Q_J_135 の存在確認");
    const q135Result = await databaseService.executeSql(
      "SELECT id, category_id, tags_json FROM questions WHERE id = 'Q_J_135'",
    );

    if (q135Result.rows.length > 0) {
      const q135 = q135Result.rows[0];
      console.log(`   ✅ Q_J_135 存在: category=${q135.category_id}`);

      // tags_json の内容確認
      try {
        const tags = JSON.parse(q135.tags_json);
        console.log(
          `   tags_json: 有効 - keywords=${JSON.stringify(tags.keywords || [])}`,
        );
      } catch (e) {
        console.log(`   ❌ tags_json: 無効 - ${e.message}`);
      }
    } else {
      console.log("   ❌ Q_J_135 が見つかりません");
    }

    // Q_J_250 が存在するか確認
    console.log("\n6. Q_J_250 の存在確認");
    const q250Result = await databaseService.executeSql(
      "SELECT id, category_id FROM questions WHERE id = 'Q_J_250'",
    );

    if (q250Result.rows.length > 0) {
      console.log("   ✅ Q_J_250 存在");
    } else {
      console.log("   ❌ Q_J_250 が見つかりません");
    }

    // 範囲確認: Q_J_131-140
    console.log("\n7. Q_J_131-140 範囲の確認");
    const rangeResult = await databaseService.executeSql(
      `SELECT id FROM questions 
       WHERE id LIKE 'Q_J_%' 
       AND CAST(SUBSTR(id, 5) AS INTEGER) BETWEEN 131 AND 140
       ORDER BY CAST(SUBSTR(id, 5) AS INTEGER)`,
    );

    console.log(`   Q_J_131-140: ${rangeResult.rows.length}/10 問存在`);
    rangeResult.rows.forEach((row) => {
      console.log(`     - ${row.id}`);
    });

    // データベース整合性チェック
    console.log("\n8. データベース整合性チェック");
    const integrityCheck = await databaseService.checkIntegrity();
    console.log(`   整合性: ${integrityCheck ? "✅ 正常" : "❌ 異常"}`);

    // サンプルデータバージョン確認
    console.log("\n9. サンプルデータバージョン確認");
    try {
      const versionResult = await databaseService.executeSql(
        "SELECT value FROM app_settings WHERE key = 'sample_data_version'",
      );
      const currentVersion = versionResult.rows[0]?.value || "なし";
      console.log(`   現在のバージョン: ${currentVersion}`);
    } catch (e) {
      console.log(`   バージョン取得エラー: ${e.message}`);
    }

    console.log("\n=== デバッグ完了 ===");
    return {
      totalCount,
      categoryBreakdown: categoryResult.rows.reduce((acc, row) => {
        acc[row.category_id] = row.count;
        return acc;
      }, {}),
      hasQ135: q135Result.rows.length > 0,
      hasQ250: q250Result.rows.length > 0,
      integrityCheck,
    };
  } catch (error) {
    console.error("デバッグエラー:", error.message);
    console.error("詳細:", error.stack);
    throw error;
  }
}

if (require.main === module) {
  debugDatabaseContent()
    .then((result) => {
      console.log("\n最終結果:", JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error("実行エラー:", error.message);
      process.exit(1);
    });
}

module.exports = { debugDatabaseContent };
