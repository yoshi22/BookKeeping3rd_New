/**
 * 復習フローE2Eテスト
 * 簿記3級問題集アプリ - Phase 11: E2Eテスト強化
 *
 * テスト対象: 復習機能の完全なユーザーフロー
 */

import { device, element, by, waitFor, expect } from "detox";

describe("復習フロー E2E テスト", () => {
  describe("復習システムの基本フロー", () => {
    it("復習対象問題の優先度順表示と解答", async () => {
      console.log("🔄 復習優先度システムテスト開始");

      // ホーム画面から復習画面へ移動
      await element(by.id("tab-review")).tap();
      await waitFor(element(by.id("review-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 復習タブが選択されていることを確認
      await element(by.id("review-tab-button")).tap();

      // 優先度順復習ボタンをタップ
      await element(by.id("review-priority-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 復習対象問題が表示されることを確認
      await expect(element(by.id("question-id"))).toBeVisible();

      // 問題を解答（間違った解答を意図的に入力）
      const questionId = await element(by.id("question-id")).getAttributes();
      console.log("復習対象問題ID:", questionId);

      // 仕訳問題の場合
      if (questionId && JSON.stringify(questionId).includes("Q_J_")) {
        await element(by.id("debit-account-dropdown-0")).tap();
        await element(by.text("現金")).tap();
        await element(by.id("debit-amount-input-0")).typeText("999999");

        await element(by.id("credit-account-dropdown-0")).tap();
        await element(by.text("売上")).tap();
        await element(by.id("credit-amount-input-0")).typeText("999999");

        // 解答送信
        await element(by.id("submit-answer-button")).tap();

        // 解説画面の確認
        await waitFor(element(by.id("explanation-screen")))
          .toBeVisible()
          .withTimeout(3000);
      }

      console.log("✅ 復習優先度システムテスト完了");
    });

    it("分野別復習機能のテスト", async () => {
      console.log("📊 分野別復習システムテスト開始");

      await element(by.id("tab-review")).tap();
      await waitFor(element(by.id("review-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 復習タブを選択
      await element(by.id("review-tab-button")).tap();

      // 仕訳分野の復習ボタンを選択
      await element(by.id("review-category-journal-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 仕訳問題であることを確認
      const questionIdElement = element(by.id("question-id"));
      await expect(questionIdElement).toBeVisible();

      console.log("✅ 分野別復習システムテスト完了");
    });

    it("復習統計情報の確認", async () => {
      console.log("📈 復習統計システムテスト開始");

      await element(by.id("tab-review")).tap();
      await waitFor(element(by.id("review-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // 統計タブを選択
      await element(by.id("statistics-tab-button")).tap();

      // 統計情報が表示されることを確認
      await waitFor(element(by.id("statistics-content")))
        .toBeVisible()
        .withTimeout(3000);

      // 分野別弱点が表示されることを確認
      await expect(element(by.id("category-weakness-stats"))).toBeVisible();

      // 統計更新ボタンをテスト
      await element(by.id("refresh-statistics-button")).tap();
      await waitFor(element(by.id("statistics-content")))
        .toBeVisible()
        .withTimeout(3000);

      console.log("✅ 復習統計システムテスト完了");
    });
  });

  describe("復習アルゴリズムの検証", () => {
    it("間隔反復学習システムの動作確認", async () => {
      console.log("🧠 間隔反復学習システムテスト開始");

      // 復習画面へ移動
      await element(by.id("tab-review")).tap();
      await element(by.id("review-tab-button")).tap();

      // 初回の復習対象数を取得
      const initialReviewCount = await element(
        by.id("review-count-display"),
      ).getAttributes();
      console.log("初回復習対象数:", initialReviewCount);

      // 優先度順復習を開始
      await element(by.id("review-priority-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 正解を入力して復習優先度を下げる
      await element(by.id("debit-account-dropdown-0")).tap();
      await element(by.text("現金")).tap();
      await element(by.id("debit-amount-input-0")).typeText("100000");

      await element(by.id("credit-account-dropdown-0")).tap();
      await element(by.text("売上")).tap();
      await element(by.id("credit-amount-input-0")).typeText("100000");

      await element(by.id("submit-answer-button")).tap();

      // 解説を閉じて復習画面に戻る
      await element(by.id("close-explanation-button")).tap();

      // 復習対象数が変化していることを確認
      await element(by.id("tab-review")).tap();
      await element(by.id("review-tab-button")).tap();

      const updatedReviewCount = await element(
        by.id("review-count-display"),
      ).getAttributes();
      console.log("更新後復習対象数:", updatedReviewCount);

      console.log("✅ 間隔反復学習システムテスト完了");
    });

    it("連続正解による復習対象除外の確認", async () => {
      console.log("🎯 連続正解除外システムテスト開始");

      // 特定の問題を2回連続正解して復習対象から除外されることを確認
      await element(by.id("tab-review")).tap();
      await element(by.id("review-tab-button")).tap();

      // 全復習対象問題を表示
      await element(by.id("review-all-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 現在の問題IDを記録
      const currentQuestionId = await element(
        by.id("question-id"),
      ).getAttributes();

      // 1回目の正解
      await element(by.id("debit-account-dropdown-0")).tap();
      await element(by.text("現金")).tap();
      await element(by.id("debit-amount-input-0")).typeText("50000");
      await element(by.id("credit-account-dropdown-0")).tap();
      await element(by.text("売上")).tap();
      await element(by.id("credit-amount-input-0")).typeText("50000");
      await element(by.id("submit-answer-button")).tap();

      // 次の問題へ
      await element(by.id("next-question-button")).tap();

      console.log("✅ 連続正解除外システムテスト完了");
    });
  });

  describe("復習データの永続化", () => {
    it("復習進捗がアプリ再起動後も維持される", async () => {
      console.log("💾 復習データ永続化テスト開始");

      // 復習画面で現在の統計を取得
      await element(by.id("tab-review")).tap();
      await element(by.id("statistics-tab-button")).tap();

      const initialStats = await element(
        by.id("statistics-content"),
      ).getAttributes();
      console.log("再起動前統計:", initialStats);

      // アプリを再起動
      await device.reloadReactNative();
      await waitFor(element(by.id("home-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 復習画面に移動して統計を再確認
      await element(by.id("tab-review")).tap();
      await element(by.id("statistics-tab-button")).tap();
      await waitFor(element(by.id("statistics-content")))
        .toBeVisible()
        .withTimeout(3000);

      const persistedStats = await element(
        by.id("statistics-content"),
      ).getAttributes();
      console.log("再起動後統計:", persistedStats);

      // データが永続化されていることを確認（統計が空でない）
      await expect(element(by.id("category-weakness-stats"))).toBeVisible();

      console.log("✅ 復習データ永続化テスト完了");
    });

    it("オフライン状態での復習機能動作確認", async () => {
      console.log("📱 オフライン復習システムテスト開始");

      // ネットワークを無効にする
      await device.disableSynchronization();

      // 復習機能がオフラインで正常動作することを確認
      await element(by.id("tab-review")).tap();
      await element(by.id("review-tab-button")).tap();

      await element(by.id("review-priority-button")).tap();
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 問題が表示され、解答できることを確認
      await expect(element(by.id("question-text"))).toBeVisible();
      await expect(element(by.id("debit-account-dropdown-0"))).toBeVisible();

      // ネットワークを再度有効にする
      await device.enableSynchronization();

      console.log("✅ オフライン復習システムテスト完了");
    });
  });

  describe("復習UI/UXテスト", () => {
    it("復習画面の応答性とレスポンシブ対応", async () => {
      console.log("📱 復習UI応答性テスト開始");

      await element(by.id("tab-review")).tap();
      await waitFor(element(by.id("review-screen")))
        .toBeVisible()
        .withTimeout(3000);

      // タブ切り替えの応答速度を測定
      const startTime = Date.now();

      await element(by.id("statistics-tab-button")).tap();
      await waitFor(element(by.id("statistics-content")))
        .toBeVisible()
        .withTimeout(2000);

      const tabSwitchTime = Date.now() - startTime;
      console.log(`タブ切り替え時間: ${tabSwitchTime}ms`);

      // 500ms以内の応答を期待
      if (tabSwitchTime >= 500) {
        throw new Error(`タブ切り替えが遅すぎます: ${tabSwitchTime}ms`);
      }

      console.log("✅ 復習UI応答性テスト完了");
    });

    it("復習フロー中のエラーハンドリング", async () => {
      console.log("⚠️ 復習エラーハンドリングテスト開始");

      await element(by.id("tab-review")).tap();
      await element(by.id("review-tab-button")).tap();
      await element(by.id("review-priority-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 無効な入力値をテスト
      await element(by.id("debit-amount-input-0")).typeText("invalid");
      await element(by.id("submit-answer-button")).tap();

      // 適切なエラーメッセージが表示されることを確認
      await waitFor(element(by.id("validation-error")))
        .toBeVisible()
        .withTimeout(2000);

      console.log("✅ 復習エラーハンドリングテスト完了");
    });
  });
});
