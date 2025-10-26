/**
 * 復習アイテムのステータスとカテゴリ別データを確認するスクリプト
 * 問題のデバッグ用
 */

const path = require("path");
const fs = require("fs");
const os = require("os");

// シミュレーターのUDIDを取得
function getSimulatorUDID() {
  const simulatorDir = path.join(
    os.homedir(),
    "Library/Developer/CoreSimulator/Devices",
  );

  try {
    const devices = fs.readdirSync(simulatorDir);

    // 最新のデバイスを探す
    let latestDevice = null;
    let latestTime = 0;

    for (const deviceId of devices) {
      const devicePath = path.join(simulatorDir, deviceId);
      const stats = fs.statSync(devicePath);

      if (stats.isDirectory() && stats.mtimeMs > latestTime) {
        const dataPath = path.join(
          devicePath,
          "data/Containers/Data/Application",
        );

        if (fs.existsSync(dataPath)) {
          latestDevice = deviceId;
          latestTime = stats.mtimeMs;
        }
      }
    }

    return latestDevice;
  } catch (error) {
    console.error("シミュレーターUDID取得エラー:", error);
    return null;
  }
}

// データベースパスを取得
function getDatabasePath() {
  const udid = getSimulatorUDID();

  if (!udid) {
    console.error("シミュレーターが見つかりません");
    return null;
  }

  const appDataPath = path.join(
    os.homedir(),
    `Library/Developer/CoreSimulator/Devices/${udid}/data/Containers/Data/Application`,
  );

  const apps = fs.readdirSync(appDataPath);

  for (const appId of apps) {
    const dbPath = path.join(
      appDataPath,
      appId,
      "Library/LocalDatabase/SQLite.db",
    );

    if (fs.existsSync(dbPath)) {
      console.log("データベース発見:", dbPath);
      return dbPath;
    }
  }

  return null;
}

// メイン処理
async function main() {
  try {
    const dbPath = getDatabasePath();

    if (!dbPath) {
      console.error("データベースが見つかりません");
      process.exit(1);
    }

    const sqlite3 = require("sqlite3").verbose();
    const db = new sqlite3.Database(dbPath);

    console.log("\n=== 復習アイテムのステータス別・カテゴリ別集計 ===\n");

    // カテゴリ別・ステータス別集計
    const categoryStatsQuery = `
      SELECT
        q.category_id,
        ri.status,
        COUNT(*) as count,
        AVG(ri.priority_score) as avg_priority
      FROM review_items ri
      INNER JOIN questions q ON ri.question_id = q.id
      GROUP BY q.category_id, ri.status
      ORDER BY q.category_id, ri.status
    `;

    db.all(categoryStatsQuery, [], (err, rows) => {
      if (err) {
        console.error("クエリエラー:", err);
        return;
      }

      console.log("カテゴリ別・ステータス別の詳細:");
      console.table(rows);

      // カテゴリごとの合計を計算
      const categoryTotals = {};
      rows.forEach((row) => {
        if (!categoryTotals[row.category_id]) {
          categoryTotals[row.category_id] = {
            category: row.category_id,
            needs_review: 0,
            priority_review: 0,
            mastered: 0,
            total: 0,
          };
        }

        categoryTotals[row.category_id][row.status] = row.count;
        categoryTotals[row.category_id].total += row.count;
      });

      console.log("\nカテゴリ別合計:");
      console.table(Object.values(categoryTotals));

      console.log(
        "\n=== analyzeWeakAreasで使用される値（needsReview + priorityReview）===",
      );
      Object.values(categoryTotals).forEach((cat) => {
        const reviewCount = cat.needs_review + cat.priority_review;
        console.log(
          `${cat.category}: ${reviewCount}件（needs_review: ${cat.needs_review}, priority_review: ${cat.priority_review}）`,
        );
      });

      // 統計クエリと同じものを実行
      console.log("\n=== getReviewStatistics()と同じクエリ結果 ===\n");
      const statsQuery = `
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
      `;

      db.all(statsQuery, [], (err, statsRows) => {
        if (err) {
          console.error("統計クエリエラー:", err);
        } else {
          console.table(statsRows);
        }

        db.close();
      });
    });
  } catch (error) {
    console.error("エラー:", error);
    process.exit(1);
  }
}

main();
