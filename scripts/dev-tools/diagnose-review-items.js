/**
 * 復習アイテムの整合性診断スクリプト
 * orphaned review_items（存在しない問題を参照）の検出
 */

const path = require("path");

// TypeScriptファイルを読み込むためのパス設定
const projectRoot = path.resolve(__dirname, "../..");
const srcPath = path.join(projectRoot, "src");

// database.tsをrequireできるようにする
const { databaseService } = require(path.join(srcPath, "data/database"));

async function diagnoseReviewItems() {
  try {
    console.log("=== 復習アイテム整合性診断開始 ===\n");

    // データベース初期化
    console.log("【1】データベース初期化");
    await databaseService.initialize();
    console.log("✓ 初期化完了\n");

    // review_itemsテーブルの全件確認
    console.log("【2】review_itemsテーブル全件確認:");
    const allReviewItems = await databaseService.executeSql(
      "SELECT * FROM review_items ORDER BY question_id",
    );
    console.log(`総件数: ${allReviewItems.rows.length}件`);
    if (allReviewItems.rows.length > 0) {
      console.table(allReviewItems.rows);
    }
    console.log("");

    // questionsテーブルの存在確認
    console.log("【3】questionsテーブル確認:");
    const questionCount = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );
    console.log(`問題データ総数: ${questionCount.rows[0].count}件\n`);

    // orphaned review_items の検出（存在しない問題を参照しているアイテム）
    console.log("【4】orphaned review_items検出:");
    const orphanedItems = await databaseService.executeSql(`
      SELECT ri.*
      FROM review_items ri
      LEFT JOIN questions q ON ri.question_id = q.id
      WHERE q.id IS NULL
    `);

    if (orphanedItems.rows.length > 0) {
      console.log(
        `⚠️ orphaned review_items発見: ${orphanedItems.rows.length}件`,
      );
      console.table(orphanedItems.rows);
    } else {
      console.log("✓ orphaned review_itemsなし（すべて有効な問題を参照）");
    }
    console.log("");

    // カテゴリ別のreview_items集計（JOIN成功したもののみ）
    console.log("【5】カテゴリ別review_items集計（有効なアイテムのみ）:");
    const categoryStats = await databaseService.executeSql(`
      SELECT
        q.category_id,
        ri.status,
        COUNT(*) as count
      FROM review_items ri
      INNER JOIN questions q ON ri.question_id = q.id
      GROUP BY q.category_id, ri.status
      ORDER BY q.category_id, ri.status
    `);

    if (categoryStats.rows.length > 0) {
      console.table(categoryStats.rows);
    } else {
      console.log("データなし");
    }
    console.log("");

    // learning_historyの確認（誤答データがあるか）
    console.log("【6】learning_history確認（誤答データ）:");
    const incorrectHistory = await databaseService.executeSql(
      "SELECT * FROM learning_history WHERE is_correct = 0 LIMIT 10",
    );
    console.log(`誤答履歴件数: ${incorrectHistory.rows.length}件`);
    if (incorrectHistory.rows.length > 0) {
      console.table(incorrectHistory.rows);
    }
    console.log("");

    // 結論と推奨アクション
    console.log("【7】診断結果サマリー:");
    console.log(`- review_items総数: ${allReviewItems.rows.length}件`);
    console.log(`- orphaned review_items: ${orphanedItems.rows.length}件`);
    console.log(`- 問題データ総数: ${questionCount.rows[0].count}件`);
    console.log(`- 誤答履歴: ${incorrectHistory.rows.length}件`);

    if (orphanedItems.rows.length > 0) {
      console.log(
        "\n⚠️ アクション必要: orphaned review_itemsを削除してください",
      );
      console.log("実行コマンド例:");
      console.log(
        '  await databaseService.executeSql("DELETE FROM review_items WHERE question_id NOT IN (SELECT id FROM questions)");',
      );
    } else if (allReviewItems.rows.length > 0) {
      console.log(
        "\n⚠️ アクション推奨: 新規インストール後にreview_itemsが存在するのは異常です",
      );
      console.log("実行コマンド例:");
      console.log(
        '  await databaseService.executeSql("DELETE FROM review_items");',
      );
    } else {
      console.log("\n✓ 問題なし: データ整合性は正常です");
    }

    console.log("\n=== 診断完了 ===");
    await databaseService.close();
  } catch (error) {
    console.error("診断エラー:", error);
    console.error("スタックトレース:", error.stack);
    process.exit(1);
  }
}

diagnoseReviewItems();
