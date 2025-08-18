/**
 * 復習アイテムの詳細確認スクリプト
 */

const {
  reviewItemRepository,
} = require("../src/data/repositories/review-item-repository");
const { reviewService } = require("../src/services/review-service");

async function checkReviewItems() {
  try {
    console.log("=== 復習アイテム詳細確認 ===");

    // 1. 全復習アイテム取得
    const allItems = await reviewItemRepository.getReviewList({ limit: 100 });
    console.log(`全復習アイテム数: ${allItems.length}`);

    if (allItems.length > 0) {
      console.log("\n=== 復習アイテム詳細 ===");
      for (const item of allItems) {
        console.log(`ID: ${item.question_id}`);
        console.log(`優先度スコア: ${item.priority_score}`);
        console.log(`ステータス: ${item.status}`);
        console.log(`誤答回数: ${item.incorrect_count}`);
        console.log(`連続正解数: ${item.consecutive_correct_count}`);
        console.log("---");
      }
    }

    // 2. 重点復習対象フィルター（medium以上）
    console.log("\n=== 重点復習フィルターテスト ===");
    const priorityFilter = {
      status: ["needs_review", "priority_review"],
      minPriorityScore: 40, // medium以上
      maxPriorityScore: 100,
      limit: 15,
    };
    console.log("フィルター条件:", priorityFilter);

    const priorityItems =
      await reviewItemRepository.getReviewList(priorityFilter);
    console.log(`重点復習対象: ${priorityItems.length}件`);

    if (priorityItems.length > 0) {
      console.log("重点復習対象の詳細:");
      for (const item of priorityItems) {
        console.log(
          `ID: ${item.question_id}, スコア: ${item.priority_score}, ステータス: ${item.status}`,
        );
      }
    }

    // 3. 実際のreviewServiceでの動作テスト
    console.log("\n=== ReviewService動作テスト ===");
    const reviewOptions = {
      priorityLevels: ["critical", "high", "medium"],
      maxCount: 15,
    };
    console.log("reviewService使用オプション:", reviewOptions);

    const reviewQuestions =
      await reviewService.generateReviewList(reviewOptions);
    console.log(`ReviewServiceで取得された問題数: ${reviewQuestions.length}`);

    if (reviewQuestions.length > 0) {
      console.log("取得された問題:");
      for (const question of reviewQuestions.slice(0, 3)) {
        console.log(`- ${question.id}: ${question.text.substring(0, 50)}...`);
      }
    }

    // 4. 復習統計
    console.log("\n=== 復習統計 ===");
    const stats = await reviewService.getReviewStatistics();
    console.log(`総復習対象: ${stats.totalReview}`);
    console.log(`重点復習対象: ${stats.priorityReview}`);
    console.log(`通常復習対象: ${stats.needsReview}`);

    process.exit(0);
  } catch (error) {
    console.error("エラー:", error);
    process.exit(1);
  }
}

checkReviewItems();
