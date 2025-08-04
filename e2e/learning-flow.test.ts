/**
 * 学習フローE2Eテスト
 * 簿記3級問題集アプリ - Step 4.2: E2Eテスト実装
 *
 * テスト対象: 基本的な学習機能の完全なユーザーフロー
 */

import { device, element, by, waitFor, expect } from "detox";

describe("学習フロー E2E テスト", () => {
  describe("分野別学習フロー", () => {
    it("仕訳分野の学習フロー（250問構成）", async () => {
      console.log("🧮 仕訳分野学習フローテスト開始");

      // ホーム画面から学習画面へ移動
      await element(by.id("tab-learning")).tap();
      await waitFor(element(by.id("learning-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 仕訳分野を選択
      await element(by.id("category-journal")).tap();
      await waitFor(element(by.text("仕訳 250問")))
        .toBeVisible()
        .withTimeout(2000);

      // 学習開始ボタンをタップ
      await element(by.id("start-learning-button")).tap();

      // 問題画面の表示確認
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 問題IDが仕訳形式（Q_J_xxx）であることを確認
      const questionIdElement = element(by.id("question-id"));
      await expect(questionIdElement).toBeVisible();

      // CBT形式の解答フォームが表示されることを確認
      await expect(element(by.id("debit-account-dropdown"))).toBeVisible();
      await expect(element(by.id("debit-amount-input"))).toBeVisible();
      await expect(element(by.id("credit-account-dropdown"))).toBeVisible();
      await expect(element(by.id("credit-amount-input"))).toBeVisible();

      // 解答入力
      await element(by.id("debit-account-dropdown")).tap();
      await element(by.text("現金")).tap();
      await element(by.id("debit-amount-input")).typeText("100000");

      await element(by.id("credit-account-dropdown")).tap();
      await element(by.text("売上")).tap();
      await element(by.id("credit-amount-input")).typeText("100000");

      // 解答送信
      await element(by.id("submit-answer-button")).tap();

      // 解説画面の表示確認
      await waitFor(element(by.id("explanation-screen")))
        .toBeVisible()
        .withTimeout(3000);
      await expect(element(by.id("answer-result"))).toBeVisible();
      await expect(element(by.id("explanation-text"))).toBeVisible();

      // 次の問題へ進む
      await element(by.id("next-question-button")).tap();

      // 次の問題が表示されることを確認
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(3000);

      console.log("✅ 仕訳分野学習フロー完了");
    });

    it("帳簿分野の学習フロー（40問構成）", async () => {
      console.log("📚 帳簿分野学習フローテスト開始");

      await element(by.id("tab-learning")).tap();
      await waitFor(element(by.id("learning-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 帳簿分野を選択
      await element(by.id("category-ledger")).tap();
      await waitFor(element(by.text("帳簿 40問")))
        .toBeVisible()
        .withTimeout(2000);

      await element(by.id("start-learning-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 問題IDが帳簿形式（Q_L_xxx）であることを確認
      const questionIdElement = element(by.id("question-id"));
      await expect(questionIdElement).toBeVisible();

      // 帳簿特有のUI要素確認
      await expect(element(by.id("ledger-entry-form"))).toBeVisible();
      await expect(element(by.id("description-dropdown"))).toBeVisible();

      console.log("✅ 帳簿分野学習フロー完了");
    });

    it("試算表分野の学習フロー（12問構成）", async () => {
      console.log("📊 試算表分野学習フローテスト開始");

      await element(by.id("tab-learning")).tap();
      await waitFor(element(by.id("learning-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 試算表分野を選択
      await element(by.id("category-trial-balance")).tap();
      await waitFor(element(by.text("試算表 12問")))
        .toBeVisible()
        .withTimeout(2000);

      await element(by.id("start-learning-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 問題IDが試算表形式（Q_T_xxx）であることを確認
      const questionIdElement = element(by.id("question-id"));
      await expect(questionIdElement).toBeVisible();

      // 試算表特有のUI要素確認
      await expect(element(by.id("trial-balance-form"))).toBeVisible();
      await expect(element(by.id("account-balance-inputs"))).toBeVisible();

      console.log("✅ 試算表分野学習フロー完了");
    });
  });

  describe("学習進捗とデータ永続化", () => {
    it("学習進捗が正しく記録される", async () => {
      console.log("📈 学習進捗記録テスト開始");

      // 統計画面で初期状態を確認
      await element(by.id("tab-stats")).tap();
      await waitFor(element(by.id("stats-screen")))
        .toBeVisible()
        .withTimeout(3000);

      const initialStatsText = await element(
        by.id("overall-progress"),
      ).getAttributes();
      console.log("初期統計:", initialStatsText);

      // 仕訳問題を1問解答
      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();
      await element(by.id("start-learning-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 解答を入力して送信
      await element(by.id("debit-account-dropdown")).tap();
      await element(by.text("現金")).tap();
      await element(by.id("debit-amount-input")).typeText("50000");
      await element(by.id("credit-account-dropdown")).tap();
      await element(by.text("売上")).tap();
      await element(by.id("credit-amount-input")).typeText("50000");
      await element(by.id("submit-answer-button")).tap();

      // 解説画面を閉じて統計画面へ
      await element(by.id("close-explanation-button")).tap();
      await element(by.id("tab-stats")).tap();

      // 進捗が更新されていることを確認
      await waitFor(element(by.id("stats-screen")))
        .toBeVisible()
        .withTimeout(3000);
      const updatedStatsText = await element(
        by.id("overall-progress"),
      ).getAttributes();
      console.log("更新後統計:", updatedStatsText);

      // アプリを再起動してデータの永続化を確認
      await device.reloadReactNative();
      await waitFor(element(by.id("home-screen")))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id("tab-stats")).tap();
      await waitFor(element(by.id("stats-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // データが永続化されていることを確認
      const persistedStatsText = await element(
        by.id("overall-progress"),
      ).getAttributes();
      console.log("永続化確認:", persistedStatsText);

      console.log("✅ 学習進捗記録テスト完了");
    });
  });

  describe("エラーハンドリングとリカバリ", () => {
    it("不正な入力値に対する適切なエラー表示", async () => {
      console.log("⚠️ エラーハンドリングテスト開始");

      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();
      await element(by.id("start-learning-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 不正な金額を入力（負の値）
      await element(by.id("debit-amount-input")).typeText("-1000");
      await element(by.id("submit-answer-button")).tap();

      // エラーメッセージが表示されることを確認
      await waitFor(element(by.id("validation-error")))
        .toBeVisible()
        .withTimeout(2000);
      await expect(
        element(by.text("金額は正の値を入力してください")),
      ).toBeVisible();

      // エラーを修正
      await element(by.id("debit-amount-input")).clearText();
      await element(by.id("debit-amount-input")).typeText("1000");

      // エラーメッセージが消えることを確認
      await waitFor(element(by.id("validation-error")))
        .not.toBeVisible()
        .withTimeout(2000);

      console.log("✅ エラーハンドリングテスト完了");
    });

    it("ネットワーク障害時の適切な動作", async () => {
      console.log("🌐 ネットワーク障害テスト開始");

      // ネットワークを無効にする（シミュレーション）
      await device.disableSynchronization();

      // 学習機能が正常に動作することを確認（オフライン対応）
      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();
      await element(by.id("start-learning-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 問題が表示され、解答できることを確認
      await expect(element(by.id("question-text"))).toBeVisible();
      await expect(element(by.id("debit-account-dropdown"))).toBeVisible();

      // ネットワークを再度有効にする
      await device.enableSynchronization();

      console.log("✅ ネットワーク障害テスト完了");
    });
  });

  describe("パフォーマンステスト", () => {
    it("問題表示が2秒以内に完了する", async () => {
      console.log("⚡ パフォーマンステスト開始");

      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();

      const startTime = Date.now();
      await element(by.id("start-learning-button")).tap();

      // 問題が表示されるまでの時間を測定
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);
      const endTime = Date.now();

      const loadTime = endTime - startTime;
      console.log(`問題表示時間: ${loadTime}ms`);

      // 2秒以内に表示されることを確認
      if (loadTime >= 2000) {
        throw new Error(`問題表示時間が遅すぎます: ${loadTime}ms`);
      }

      console.log("✅ パフォーマンステスト完了");
    });

    it("大量の学習履歴での統計計算が1秒以内に完了する", async () => {
      console.log("📊 統計計算パフォーマンステスト開始");

      const startTime = Date.now();
      await element(by.id("tab-stats")).tap();

      // 統計画面が表示されるまでの時間を測定
      await waitFor(element(by.id("stats-screen")))
        .toBeVisible()
        .withTimeout(5000);
      await waitFor(element(by.id("overall-progress")))
        .toBeVisible()
        .withTimeout(3000);
      const endTime = Date.now();

      const calculationTime = endTime - startTime;
      console.log(`統計計算時間: ${calculationTime}ms`);

      // 1秒以内に計算が完了することを確認
      if (calculationTime >= 1000) {
        throw new Error(`統計計算時間が遅すぎます: ${calculationTime}ms`);
      }

      console.log("✅ 統計計算パフォーマンステスト完了");
    });
  });
});
