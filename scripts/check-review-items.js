#!/usr/bin/env node

/**
 * 復習アイテムデータベース確認スクリプト
 * Q_J_001が正しく追加されているか確認
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function checkReviewItems() {
  console.log("🔍 復習アイテムデータベース確認開始");
  console.log("================================");

  return new Promise((resolve, reject) => {
    // SQLiteデータベースに接続
    const dbPath = path.join(__dirname, "../assets/database.db");
    console.log("📁 Database path:", dbPath);

    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error("❌ データベース接続エラー:", err.message);
        reject(err);
        return;
      }
      console.log("✅ データベース接続成功");
    });

    // review_itemsテーブルの全データを取得
    db.all(
      "SELECT * FROM review_items ORDER BY created_at DESC",
      [],
      (err, reviewItems) => {
        if (err) {
          console.error("❌ review_items取得エラー:", err.message);
          db.close();
          reject(err);
          return;
        }

        console.log(`📊 Total review items: ${reviewItems.length}`);
        console.log("");

        if (reviewItems.length === 0) {
          console.log("❌ 復習アイテムが見つかりませんでした");
        } else {
          console.log("📋 復習アイテム一覧:");
          reviewItems.forEach((item, index) => {
            console.log(`${index + 1}. ID: ${item.id}`);
            console.log(`   Question: ${item.question_id}`);
            console.log(`   Status: ${item.status}`);
            console.log(`   Priority: ${item.priority_score}`);
            console.log(`   Incorrect: ${item.incorrect_count}`);
            console.log(`   Created: ${item.created_at}`);
            console.log("");
          });
        }

        // Q_J_001を特定検索
        db.get(
          "SELECT * FROM review_items WHERE question_id = ?",
          ["Q_J_001"],
          (err, q001Item) => {
            if (err) {
              console.error("❌ Q_J_001検索エラー:", err.message);
              db.close();
              reject(err);
              return;
            }

            if (q001Item) {
              console.log("✅ Q_J_001がreview_itemsテーブルに見つかりました:");
              console.log(JSON.stringify(q001Item, null, 2));
            } else {
              console.log(
                "❌ Q_J_001がreview_itemsテーブルに見つかりませんでした",
              );
            }

            // learning_historyテーブルも確認
            db.all(
              "SELECT * FROM learning_history WHERE question_id = ? ORDER BY answered_at DESC",
              ["Q_J_001"],
              (err, learningHistory) => {
                if (err) {
                  console.error("❌ learning_history取得エラー:", err.message);
                } else {
                  console.log(
                    `\\n📚 Q_J_001の学習履歴: ${learningHistory.length}件`,
                  );
                  learningHistory.forEach((history, index) => {
                    console.log(
                      `${index + 1}. Correct: ${history.is_correct}, Date: ${history.answered_at}`,
                    );
                  });
                }

                db.close((err) => {
                  if (err) {
                    console.error(
                      "❌ データベースクローズエラー:",
                      err.message,
                    );
                  }
                  resolve();
                });
              },
            );
          },
        );
      },
    );
  }).catch((error) => {
    console.error("❌ データベース確認エラー:", error.message);

    // ファイルが存在しない場合の代替確認
    console.log("\\n🔄 代替確認: data/sample-data.jsからの情報");
    try {
      const fs = require("fs");
      const dataPath = path.join(__dirname, "../src/data");
      const files = fs.readdirSync(dataPath);
      console.log("📁 Data directory files:", files);
    } catch (fsError) {
      console.error("ファイルシステムエラー:", fsError.message);
    }
  });
}

// 実行
checkReviewItems();
