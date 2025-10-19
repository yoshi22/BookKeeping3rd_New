#!/usr/bin/env node

/**
 * 復習タブの統計とリスト取得の不一致を診断するスクリプト
 *
 * 症状: 統計で「1問復習対象」と表示されるが、リスト取得で0件になる
 */

const sqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

console.log("=== 復習データ不一致診断スクリプト ===\n");

// シミュレーターのデータベースファイルを検索
function findDatabasePath() {
  const simulatorBase = path.join(
    process.env.HOME,
    "Library/Developer/CoreSimulator/Devices",
  );

  try {
    const output = execSync(
      `find "${simulatorBase}" -name "SQLite.db" -path "*/Library/LocalDatabase/*" 2>/dev/null | head -1`,
      { encoding: "utf8" },
    ).trim();

    if (!output) {
      console.error("❌ データベースファイルが見つかりません");
      console.log(
        "アプリを起動して、一度復習タブを開いてから再実行してください\n",
      );
      return null;
    }

    console.log(`✅ データベース発見: ${output}\n`);
    return output;
  } catch (error) {
    console.error("❌ データベース検索エラー:", error.message);
    return null;
  }
}

const dbPath = findDatabasePath();
if (!dbPath) {
  process.exit(1);
}

const db = sqlite3(dbPath);

console.log("=== 1. review_items テーブル全件確認 ===\n");
const allReviewItems = db
  .prepare(
    `
  SELECT
    ri.id,
    ri.question_id,
    ri.status,
    ri.incorrect_count,
    ri.consecutive_correct_count,
    ri.priority_score,
    ri.created_at,
    ri.updated_at,
    CASE WHEN q.id IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as question_exists
  FROM review_items ri
  LEFT JOIN questions q ON ri.question_id = q.id
  ORDER BY ri.id
`,
  )
  .all();

console.log(`📊 review_items 総数: ${allReviewItems.length}件\n`);

if (allReviewItems.length === 0) {
  console.log(
    "⚠️ review_items が空です。学習タブで問題を間違えて復習対象を作成してください。\n",
  );
  process.exit(0);
}

// ステータス別集計
const statusCounts = {};
const orphanedItems = [];
const validItems = [];

allReviewItems.forEach((item) => {
  statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;

  if (item.question_exists === "MISSING") {
    orphanedItems.push(item);
  } else {
    validItems.push(item);
  }
});

console.log("--- ステータス別集計 ---");
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}件`);
});
console.log();

if (orphanedItems.length > 0) {
  console.log(`❌ Orphaned review_items 検出: ${orphanedItems.length}件`);
  console.log("（対応するquestionが存在しないreview_items）\n");
  orphanedItems.forEach((item) => {
    console.log(
      `  - ID: ${item.id}, question_id: ${item.question_id}, status: ${item.status}`,
    );
  });
  console.log();
} else {
  console.log("✅ Orphaned review_items なし\n");
}

console.log("=== 2. 統計クエリ（画面表示と同じロジック） ===\n");
const statsQuery = db
  .prepare(
    `
  SELECT
    SUM(CASE WHEN ri.status != 'mastered' THEN 1 ELSE 0 END) as totalReviewItems,
    SUM(CASE WHEN ri.status = 'needs_review' THEN 1 ELSE 0 END) as needsReviewCount,
    SUM(CASE WHEN ri.status = 'priority_review' THEN 1 ELSE 0 END) as priorityReviewCount,
    SUM(CASE WHEN ri.status = 'mastered' THEN 1 ELSE 0 END) as masteredCount,
    COUNT(*) as totalWithJoin
  FROM review_items ri
  INNER JOIN questions q ON ri.question_id = q.id
`,
  )
  .get();

console.log("統計結果（INNER JOIN使用）:");
console.log(
  `  復習対象総数: ${statsQuery.totalReviewItems}件 (status != 'mastered')`,
);
console.log(`  needs_review: ${statsQuery.needsReviewCount}件`);
console.log(`  priority_review: ${statsQuery.priorityReviewCount}件`);
console.log(`  mastered: ${statsQuery.masteredCount}件`);
console.log(`  JOIN後の総数: ${statsQuery.totalWithJoin}件`);
console.log();

console.log(
  "=== 3. リスト取得クエリ（generateReviewListと同じロジック） ===\n",
);
const listQuery = db
  .prepare(
    `
  SELECT ri.*, q.id as question_exists
  FROM review_items ri
  INNER JOIN questions q ON ri.question_id = q.id
  WHERE ri.status IN ('needs_review', 'priority_review')
  ORDER BY ri.priority_score DESC, ri.last_answered_at ASC
  LIMIT 20
`,
  )
  .all();

console.log(`リスト取得結果: ${listQuery.length}件`);
console.log(`（status IN ('needs_review', 'priority_review') 条件）\n`);

if (listQuery.length > 0) {
  listQuery.forEach((item, index) => {
    console.log(
      `  ${index + 1}. question_id: ${item.question_id}, status: ${item.status}, score: ${item.priority_score}`,
    );
  });
  console.log();
}

console.log("=== 4. 問題の診断 ===\n");

const mismatch = statsQuery.totalReviewItems !== listQuery.length;

if (mismatch) {
  console.log(`❌ 不一致検出！`);
  console.log(`   統計: ${statsQuery.totalReviewItems}件`);
  console.log(`   リスト: ${listQuery.length}件`);
  console.log(`   差分: ${statsQuery.totalReviewItems - listQuery.length}件\n`);

  // 不一致の原因を調査
  const otherStatusItems = db
    .prepare(
      `
    SELECT ri.*, q.id as question_exists
    FROM review_items ri
    INNER JOIN questions q ON ri.question_id = q.id
    WHERE ri.status != 'mastered'
      AND ri.status NOT IN ('needs_review', 'priority_review')
  `,
    )
    .all();

  if (otherStatusItems.length > 0) {
    console.log(`🔍 原因: 予期しないステータスのreview_itemsが存在`);
    console.log(`   件数: ${otherStatusItems.length}件\n`);
    otherStatusItems.forEach((item) => {
      console.log(
        `  - question_id: ${item.question_id}, status: "${item.status}" (不正なステータス)`,
      );
    });
    console.log();
    console.log(
      '💡 修正方法: これらのステータスを "needs_review" に更新する必要があります\n',
    );
  } else if (orphanedItems.length > 0) {
    console.log(`🔍 原因: Orphaned review_itemsが統計でカウントされている\n`);
    console.log(
      "💡 修正方法: ensureReviewItemsIntegrity() を実行して削除する必要があります\n",
    );
  } else {
    console.log(`🔍 原因: 不明（さらなる調査が必要）\n`);
  }
} else {
  console.log(`✅ 一致しています！`);
  console.log(
    `   統計とリスト取得の結果が一致: ${statsQuery.totalReviewItems}件\n`,
  );
}

console.log("=== 5. 推奨アクション ===\n");

if (orphanedItems.length > 0) {
  console.log("1. Orphaned review_itemsを削除:");
  console.log(
    "   - migrations/index.ts で ensureReviewItemsIntegrity() が実行されているか確認",
  );
  console.log("   - または手動で削除SQL実行:\n");
  console.log(
    "   DELETE FROM review_items WHERE question_id NOT IN (SELECT id FROM questions);\n",
  );
}

const otherStatusCheck = db
  .prepare(
    `
  SELECT COUNT(*) as count
  FROM review_items ri
  INNER JOIN questions q ON ri.question_id = q.id
  WHERE ri.status != 'mastered'
    AND ri.status NOT IN ('needs_review', 'priority_review')
`,
  )
  .get();

if (otherStatusCheck.count > 0) {
  console.log("2. 不正なステータスを修正:");
  console.log("   - 以下のSQLで修正:\n");
  console.log(
    `   UPDATE review_items SET status = 'needs_review' WHERE status NOT IN ('needs_review', 'priority_review', 'mastered');\n`,
  );
}

if (!mismatch && orphanedItems.length === 0 && otherStatusCheck.count === 0) {
  console.log(
    "✅ データは正常です。問題が報告されている場合は、他の原因を調査してください。\n",
  );
}

db.close();
console.log("=== 診断完了 ===\n");
