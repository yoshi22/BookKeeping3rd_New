/**
 * 復習システム テストデータ作成スクリプト
 * 学習履歴と復習アイテムの両方を作成して復習機能をテスト可能にする
 */

const { openDatabase } = require("expo-sqlite/next");

async function createTestReviewData() {
  try {
    console.log("=== 復習システム テストデータ作成開始 ===");

    const db = openDatabase("bookkeeping.db");

    // 1. 既存データの確認
    console.log("\n1. 現在のデータ状況確認:");
    const currentQuestions = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM questions",
    );
    const currentHistory = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM learning_history",
    );
    const currentReviews = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM review_items",
    );

    console.log(`問題データ: ${currentQuestions[0].count}件`);
    console.log(`学習履歴: ${currentHistory[0].count}件`);
    console.log(`復習アイテム: ${currentReviews[0].count}件`);

    // 2. テスト用問題の取得
    const testQuestions = await db.getAllAsync(`
      SELECT id, category_id 
      FROM questions 
      WHERE category_id IN ('journal', 'ledger', 'trial_balance') 
      ORDER BY id 
      LIMIT 10
    `);

    if (testQuestions.length === 0) {
      throw new Error(
        "テスト用問題が見つかりません。問題データを確認してください。",
      );
    }

    console.log(`\n2. テスト用問題: ${testQuestions.length}件取得`);
    testQuestions.forEach((q) => console.log(`  - ${q.id} (${q.category_id})`));

    // 3. 学習履歴の作成（不正解データ）
    console.log("\n3. 不正解学習履歴の作成:");
    let historyCount = 0;

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      const incorrectCount = Math.floor(Math.random() * 3) + 1; // 1-3回の間違い

      for (let j = 0; j < incorrectCount; j++) {
        const sessionId = `test-session-${Date.now()}-${i}-${j}`;
        const answeredAt = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        await db.runAsync(
          `
          INSERT INTO learning_history (
            question_id, user_answer_json, is_correct, answer_time_ms,
            session_id, session_type, answered_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            question.id,
            JSON.stringify({ type: "test_incorrect_answer" }),
            0, // 不正解
            Math.floor(Math.random() * 120000) + 30000, // 30秒-2.5分
            sessionId,
            "learning",
            answeredAt,
          ],
        );
        historyCount++;
      }

      console.log(`  ✓ ${question.id}: ${incorrectCount}回の不正解履歴を作成`);
    }

    console.log(`不正解学習履歴 ${historyCount}件を作成完了`);

    // 4. 復習アイテムの作成
    console.log("\n4. 復習アイテムの作成:");
    let reviewCount = 0;

    for (const question of testQuestions) {
      // 問題の不正解回数を取得
      const incorrectHistory = await db.getAllAsync(
        `
        SELECT COUNT(*) as count FROM learning_history 
        WHERE question_id = ? AND is_correct = 0
      `,
        [question.id],
      );

      const incorrectCount = incorrectHistory[0].count;
      if (incorrectCount === 0) continue;

      // 優先度スコアを計算（簡易版）
      let priorityScore = incorrectCount * 25; // 基本スコア

      // カテゴリボーナス
      const categoryBonus = {
        journal: 10,
        ledger: 5,
        trial_balance: 15,
      };
      priorityScore += categoryBonus[question.category_id] || 0;

      // ステータス決定
      let status = "needs_review";
      if (priorityScore >= 60) {
        status = "priority_review";
      }

      // 最後の間違い日時を取得
      const lastIncorrect = await db.getAllAsync(
        `
        SELECT answered_at FROM learning_history 
        WHERE question_id = ? AND is_correct = 0 
        ORDER BY answered_at DESC LIMIT 1
      `,
        [question.id],
      );

      const lastAnsweredAt =
        lastIncorrect.length > 0
          ? lastIncorrect[0].answered_at
          : new Date().toISOString();

      // 復習アイテムを作成
      await db.runAsync(
        `
        INSERT OR REPLACE INTO review_items (
          question_id, incorrect_count, consecutive_correct_count, 
          status, priority_score, last_answered_at, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          question.id,
          incorrectCount,
          0, // 連続正解なし
          status,
          Math.min(priorityScore, 100), // 上限100
          lastAnsweredAt,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      );

      reviewCount++;
      console.log(
        `  ✓ ${question.id}: 優先度${priorityScore}, ステータス${status}`,
      );
    }

    console.log(`復習アイテム ${reviewCount}件を作成完了`);

    // 5. 作成結果の確認
    console.log("\n5. テストデータ作成結果:");

    const finalHistory = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM learning_history WHERE is_correct = 0",
    );
    const finalReviews = await db.getAllAsync(
      "SELECT COUNT(*) as count FROM review_items",
    );

    console.log(`不正解学習履歴: ${finalHistory[0].count}件`);
    console.log(`復習アイテム: ${finalReviews[0].count}件`);

    // 優先度別分布
    const priorityDist = await db.getAllAsync(`
      SELECT 
        CASE 
          WHEN priority_score >= 80 THEN 'critical'
          WHEN priority_score >= 60 THEN 'high'
          WHEN priority_score >= 40 THEN 'medium'
          ELSE 'low'
        END as priority_level,
        COUNT(*) as count
      FROM review_items
      GROUP BY priority_level
    `);

    console.log("\n優先度分布:");
    priorityDist.forEach((dist) => {
      console.log(`  ${dist.priority_level}: ${dist.count}件`);
    });

    // 6. 重点復習対象の確認
    const priorityItems = await db.getAllAsync(`
      SELECT question_id, priority_score, status 
      FROM review_items 
      WHERE priority_score >= 40
      ORDER BY priority_score DESC
    `);

    console.log(`\n重点復習対象 (スコア40以上): ${priorityItems.length}件`);
    priorityItems.forEach((item) => {
      console.log(
        `  - ${item.question_id}: スコア${item.priority_score} (${item.status})`,
      );
    });

    console.log("\n=== テストデータ作成完了 ===");
    console.log("✅ 復習タブでテストデータが表示されるはずです");
  } catch (error) {
    console.error("エラー:", error);
    throw error;
  }
}

// Node.js環境で直接実行
if (require.main === module) {
  createTestReviewData()
    .then(() => {
      console.log("\n🎉 テストデータ作成成功！");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ テストデータ作成失敗:", error);
      process.exit(1);
    });
}

module.exports = { createTestReviewData };
