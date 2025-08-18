/**
 * 重点復習機能修正スクリプト
 * 既存の復習アイテムの優先度スコアを調整して重点復習対象にする
 */

const { openDatabase } = require("expo-sqlite/next");

async function fixPriorityReview() {
  try {
    console.log("=== 重点復習機能修正開始 ===");

    const db = openDatabase("bookkeeping.db");

    // 1. 現在の復習アイテム状況を確認
    console.log("\n1. 現在の復習アイテム状況:");
    const currentItems = await db.getAllAsync("SELECT * FROM review_items");
    console.log(`復習アイテム総数: ${currentItems.length}件`);

    for (const item of currentItems) {
      console.log(
        `- ID: ${item.question_id}, スコア: ${item.priority_score}, ステータス: ${item.status}`,
      );
    }

    // 2. 優先度スコアを重点復習対象レベルに調整
    console.log("\n2. 優先度スコア調整実行:");

    if (currentItems.length > 0) {
      // 既存のアイテムの優先度を65に設定（high レベル）
      const updateResult = await db.runAsync(
        "UPDATE review_items SET priority_score = 65, status = ? WHERE priority_score < 60",
        ["priority_review"],
      );
      console.log(`調整完了: ${updateResult.changes}件のアイテムを更新`);

      // 更新後の状況を確認
      const updatedItems = await db.getAllAsync("SELECT * FROM review_items");
      console.log("\n3. 調整後の復習アイテム状況:");
      for (const item of updatedItems) {
        console.log(
          `- ID: ${item.question_id}, スコア: ${item.priority_score}, ステータス: ${item.status}`,
        );
      }

      // 4. 重点復習対象フィルターのテスト
      console.log("\n4. 重点復習対象フィルターテスト:");
      const priorityItems = await db.getAllAsync(
        "SELECT * FROM review_items WHERE status IN (?, ?) AND priority_score >= ? AND priority_score <= ?",
        ["needs_review", "priority_review", 60, 100],
      );
      console.log(`重点復習対象: ${priorityItems.length}件`);

      if (priorityItems.length > 0) {
        console.log("✅ 修正成功: 重点復習対象が見つかりました");
        for (const item of priorityItems) {
          console.log(`  - ${item.question_id}: スコア ${item.priority_score}`);
        }
      } else {
        console.log("❌ まだ重点復習対象が見つかりません");
      }
    } else {
      console.log(
        "復習アイテムが存在しません。学習タブで問題に間違えてから再実行してください。",
      );
    }

    console.log("\n=== 重点復習機能修正完了 ===");
  } catch (error) {
    console.error("修正エラー:", error);
  }
}

fixPriorityReview();
