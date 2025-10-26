/**
 * 復習アイテムのデータを確認するスクリプト
 * 統計と実際のデータの不整合を調査
 */

const path = require("path");

// TypeScriptファイルを読み込むためのパス設定
const projectRoot = path.resolve(__dirname, "../..");
const srcPath = path.join(projectRoot, "src");

// database.tsをrequireできるようにする
const { databaseService } = require(path.join(srcPath, "data/database"));

async function checkReviewData() {
  try {
    console.log("=== 復習データ診断開始 ===\n");
    await databaseService.initialize();

    // 1. review_itemsテーブルの全件確認
    console.log("【1】review_itemsテーブル全件:");
    const allReviewItems = await databaseService.executeSql(
      "SELECT * FROM review_items ORDER BY question_id",
    );
    console.log(`総件数: ${allReviewItems.rows.length}件\n`);

    // 2. ステータス別集計
    console.log("【2】ステータス別集計:");
    const statusCount = await databaseService.executeSql(
      "SELECT status, COUNT(*) as count FROM review_items GROUP BY status",
    );
    statusCount.rows.forEach((row) => {
      console.log(`  ${row.status}: ${row.count}件`);
    });
    console.log("");

    // 3. カテゴリ別・ステータス別集計（詳細）
    console.log("【3】カテゴリ別・ステータス別集計:");
    const categoryStatusCount = await databaseService.executeSql(`
      SELECT
        q.category_id,
        ri.status,
        COUNT(*) as count,
        AVG(ri.priority_score) as avg_priority
      FROM review_items ri
      INNER JOIN questions q ON ri.question_id = q.id
      GROUP BY q.category_id, ri.status
      ORDER BY q.category_id, ri.status
    `);

    const categoryData = {};
    categoryStatusCount.rows.forEach((row) => {
      if (!categoryData[row.category_id]) {
        categoryData[row.category_id] = {
          needs_review: 0,
          priority_review: 0,
          mastered: 0,
        };
      }
      categoryData[row.category_id][row.status] = row.count;
      console.log(
        `  ${row.category_id} - ${row.status}: ${row.count}件 (平均優先度: ${Math.round(row.avg_priority || 0)})`,
      );
    });
    console.log("");

    // 4. analyzeWeakAreasで使用される値（needs_review + priority_review）
    console.log("【4】analyzeWeakAreasで表示される復習件数:");
    Object.entries(categoryData).forEach(([category, data]) => {
      const reviewCount = data.needs_review + data.priority_review;
      console.log(
        `  ${category}: ${reviewCount}件 (needs_review: ${data.needs_review}, priority_review: ${data.priority_review})`,
      );
    });
    console.log("");

    // 5. getReviewStatistics()と同じクエリを実行
    console.log("【5】getReviewStatistics()クエリの結果:");
    const statsQuery = await databaseService.executeSql(`
      SELECT
        q.category_id,
        COUNT(*) as total,
        SUM(CASE WHEN ri.status = 'needs_review' THEN 1 ELSE 0 END) as needsReview,
        SUM(CASE WHEN ri.status = 'priority_review' THEN 1 ELSE 0 END) as priorityReview,
        SUM(CASE WHEN ri.status = 'mastered' THEN 1 ELSE 0 END) as mastered,
        AVG(ri.priority_score) as averagePriority
      FROM review_items ri
      INNER JOIN questions q ON ri.question_id = q.id
      GROUP BY q.category_id
    `);

    statsQuery.rows.forEach((row) => {
      console.log(`  ${row.category_id}:`);
      console.log(`    total: ${row.total}`);
      console.log(`    needsReview: ${row.needsReview}`);
      console.log(`    priorityReview: ${row.priorityReview}`);
      console.log(`    mastered: ${row.mastered}`);
      console.log(
        `    averagePriority: ${Math.round(row.averagePriority || 0)}`,
      );
      console.log(
        `    → UI表示件数: ${row.needsReview + row.priorityReview}件`,
      );
    });
    console.log("");

    // 6. getReviewList()で実際に取得されるデータ（第二問のみ）
    console.log("【6】getReviewList()で取得される第二問の復習アイテム:");
    const ledgerReviewItems = await databaseService.executeSql(`
      SELECT ri.*, q.category_id
      FROM review_items ri
      INNER JOIN questions q ON ri.question_id = q.id
      WHERE ri.status IN ('needs_review', 'priority_review')
        AND q.category_id = 'ledger'
      ORDER BY ri.priority_score DESC, ri.last_answered_at ASC
    `);

    console.log(`  取得件数: ${ledgerReviewItems.rows.length}件`);
    if (ledgerReviewItems.rows.length > 0) {
      console.log("  詳細:");
      ledgerReviewItems.rows.forEach((item, index) => {
        console.log(
          `    ${index + 1}. ${item.question_id} - status: ${item.status}, priority: ${item.priority_score}`,
        );
      });
    }
    console.log("");

    // 7. 結論
    console.log("【7】不整合チェック:");
    const ledgerStats = statsQuery.rows.find(
      (row) => row.category_id === "ledger",
    );
    if (ledgerStats) {
      const expectedCount =
        ledgerStats.needsReview + ledgerStats.priorityReview;
      const actualCount = ledgerReviewItems.rows.length;

      console.log(`  統計で表示される第二問の復習件数: ${expectedCount}件`);
      console.log(`  実際にgetReviewListで取得される件数: ${actualCount}件`);

      if (expectedCount !== actualCount) {
        console.log("  ❌ 不整合が発生しています！");
        console.log("  原因調査が必要です。");
      } else {
        console.log("  ✅ 件数は一致しています。");
        console.log("  他の原因を調査する必要があります。");
      }
    } else {
      console.log("  第二問のデータが存在しません。");
    }

    console.log("\n=== 復習データ診断完了 ===");
    await databaseService.close();
  } catch (error) {
    console.error("エラー:", error);
    console.error("スタックトレース:", error.stack);
    process.exit(1);
  }
}

checkReviewData();
