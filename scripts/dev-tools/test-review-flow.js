/**
 * 復習システムデバッグ用テストスクリプト
 * 間違えた問題が復習タブに表示されない問題を調査
 */

import { answerService } from "./src/services/answer-service";
import { reviewService } from "./src/services/review-service";
import { questionRepository } from "./src/data/repositories/question-repository";
import { reviewItemRepository } from "./src/data/repositories/review-item-repository";
import { setupDatabase } from "./src/data/migrations";

const testReviewFlow = async () => {
  console.log("=== 復習システムデバッグテスト開始 ===");

  try {
    // 1. データベース初期化
    console.log("1. データベース初期化中...");
    await setupDatabase();
    console.log("データベース初期化完了");

    // 2. テスト用の問題取得
    console.log("2. テスト用問題を取得中...");
    const questions = await questionRepository.findAll({ limit: 3 });
    console.log(`取得した問題数: ${questions.length}`);
    console.log(
      "問題ID:",
      questions.map((q) => q.id),
    );

    if (questions.length === 0) {
      console.error("テスト用問題が見つかりません");
      return;
    }

    // 3. 間違えた解答をシミュレート
    const testQuestion = questions[0];
    console.log(
      `3. 問題 ${testQuestion.id} に対して間違った解答をシミュレート`,
    );

    // 間違った答えを作成
    const wrongAnswer = {
      type: "journal_entry",
      entries: [
        {
          debit_account: "不正解アカウント",
          debit_amount: 1000,
          credit_account: "不正解アカウント2",
          credit_amount: 1000,
        },
      ],
    };

    // 4. 解答サービスで処理
    console.log("4. 解答サービスで不正解処理中...");
    const result = await answerService.submitAnswer(
      testQuestion.id,
      wrongAnswer,
      "learning",
      5000,
    );
    console.log("解答結果:", result);

    // 5. 復習アイテムが作成されたか確認
    console.log("5. 復習アイテム作成確認中...");
    const reviewItem = await reviewItemRepository.findByQuestionId(
      testQuestion.id,
    );
    console.log("復習アイテム:", reviewItem);

    // 6. 復習統計を確認
    console.log("6. 復習統計確認中...");
    const stats = await reviewService.getReviewStatistics();
    console.log("復習統計:", JSON.stringify(stats, null, 2));

    // 7. 復習リスト取得確認
    console.log("7. 復習リスト取得確認中...");
    const reviewList = await reviewService.generateReviewList();
    console.log(`復習リスト件数: ${reviewList.length}`);
    console.log(
      "復習リスト問題ID:",
      reviewList.map((q) => q.id),
    );

    console.log("=== 復習システムデバッグテスト完了 ===");
  } catch (error) {
    console.error("テスト中にエラーが発生:", error);
    console.error("エラー詳細:", {
      message: error.message,
      stack: error.stack,
    });
  }
};

// Node.js環境で実行する場合
if (typeof require !== "undefined" && require.main === module) {
  testReviewFlow();
}

export { testReviewFlow };
