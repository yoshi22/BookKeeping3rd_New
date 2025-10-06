/**
 * CBTテンプレート機能E2Eテスト
 * 簿記3級問題集アプリ - Phase A CBT機能検証
 *
 * テスト対象: 新しいCBTテンプレート（Q_L / Q_T問題）の完全なユーザーフロー
 */

import { device, element, by, waitFor, expect } from "detox";

describe("CBTテンプレート機能 E2E テスト", () => {
  describe("総勘定元帳テンプレート（Q_L）", () => {
    it("Q_L_001問題でCBT総勘定元帳テンプレートが正常動作する", async () => {
      console.log("📖 CBT総勘定元帳テンプレートテスト開始");

      // 学習画面へ移動し、帳簿分野を選択
      await element(by.id("tab-learning")).tap();
      await waitFor(element(by.id("learning-screen")))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id("category-ledger")).tap();
      await element(by.id("start-learning-button")).tap();

      // CBTテンプレート問題の表示確認
      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // CBTヘッダーの確認
      await expect(element(by.id("cbt-header"))).toBeVisible();
      await expect(element(by.id("section-number"))).toHaveText("第2問");
      await expect(element(by.id("question-counter"))).toBeVisible();
      await expect(element(by.id("mark-button"))).toBeVisible();

      // 総勘定元帳フォームの確認
      await expect(element(by.id("cbt-general-ledger-form"))).toBeVisible();
      await expect(element(by.id("table-container"))).toBeVisible();

      // テーブルヘッダーの確認
      await expect(element(by.text("日付"))).toBeVisible();
      await expect(element(by.text("摘要"))).toBeVisible();
      await expect(element(by.text("借方"))).toBeVisible();
      await expect(element(by.text("貸方"))).toBeVisible();
      await expect(element(by.text("残高"))).toBeVisible();

      // 前月繰越行の確認（ロック済み）
      await expect(element(by.id("date-input-0"))).toBeVisible();
      await expect(element(by.id("description-dropdown-0"))).toBeVisible();

      // 取引入力行の確認
      await expect(element(by.id("date-input-1"))).toBeVisible();
      await expect(element(by.id("description-dropdown-1"))).toBeVisible();
      await expect(element(by.id("debit-amount-input-1"))).toBeVisible();
      await expect(element(by.id("credit-amount-input-1"))).toBeVisible();

      // ガイダンスパネルの確認
      await expect(element(by.id("guidance-panel"))).toBeVisible();
      await expect(element(by.id("guidance-stage-1"))).toBeVisible();
      await expect(element(by.text("取引確認"))).toBeVisible();

      // データ入力のテスト
      await element(by.id("date-input-1")).tap();
      await element(by.id("date-input-1")).typeText("10/5");

      await element(by.id("description-dropdown-1")).tap();
      await element(by.text("売上")).tap();

      await element(by.id("debit-amount-input-1")).tap();
      await element(by.id("numeric-pad-3")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-confirm")).tap();

      // 残高自動計算の確認
      await expect(element(by.id("balance-display-1"))).toBeVisible();

      console.log("✅ CBT総勘定元帳テンプレートテスト完了");
    });

    it("ガイダンス段階的表示が正常動作する", async () => {
      console.log("📋 ガイダンス段階的表示テスト開始");

      // Stage 1の確認
      await expect(element(by.id("guidance-stage-1"))).toBeVisible();
      await expect(element(by.text("取引確認"))).toBeVisible();

      // 次のステージに進む
      await element(by.id("next-guidance-stage")).tap();

      // Stage 2の確認
      await expect(element(by.id("guidance-stage-2"))).toBeVisible();
      await expect(element(by.text("転記"))).toBeVisible();

      // 最終ステージに進む
      await element(by.id("next-guidance-stage")).tap();

      // Stage 3の確認
      await expect(element(by.id("guidance-stage-3"))).toBeVisible();
      await expect(element(by.text("残高検証"))).toBeVisible();

      console.log("✅ ガイダンス段階的表示テスト完了");
    });
  });

  describe("試算表テンプレート（Q_T）", () => {
    it("Q_T_001問題でCBT試算表テンプレートが正常動作する", async () => {
      console.log("📊 CBT試算表テンプレートテスト開始");

      // 試算表分野を選択
      await element(by.id("tab-learning")).tap();
      await element(by.id("category-trial-balance")).tap();
      await element(by.id("start-learning-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // CBTヘッダーの確認
      await expect(element(by.id("cbt-header"))).toBeVisible();
      await expect(element(by.id("section-number"))).toHaveText("第3問");

      // 試算表フォームの確認
      await expect(element(by.id("cbt-trial-balance-form"))).toBeVisible();
      await expect(element(by.id("trial-balance-table"))).toBeVisible();

      // テーブルヘッダーの確認
      await expect(element(by.text("勘定科目"))).toBeVisible();
      await expect(element(by.text("借方"))).toBeVisible();
      await expect(element(by.text("貸方"))).toBeVisible();

      // 勘定科目行の確認
      await expect(element(by.id("account-name-input-0"))).toBeVisible();
      await expect(element(by.id("debit-balance-input-0"))).toBeVisible();
      await expect(element(by.id("credit-balance-input-0"))).toBeVisible();

      // データ入力のテスト
      await element(by.id("account-name-input-0")).tap();
      await element(by.id("account-name-input-0")).typeText("現金");

      await element(by.id("debit-balance-input-0")).tap();
      await element(by.id("numeric-pad-1")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-confirm")).tap();

      // 借貸平均の自動計算確認
      await expect(element(by.id("total-debit"))).toBeVisible();
      await expect(element(by.id("total-credit"))).toBeVisible();

      console.log("✅ CBT試算表テンプレートテスト完了");
    });
  });

  describe("CBTテンプレート共通機能", () => {
    it("動的勘定科目フィルタリングが正常動作する", async () => {
      console.log("🔍 動的勘定科目フィルタリングテスト開始");

      // 仕訳問題で勘定科目フィルタリングを確認
      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();
      await element(by.id("start-learning-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 勘定科目ドロップダウンを開く
      await element(by.id("debit-account-dropdown-0")).tap();

      // フィルタリングされた勘定科目のみ表示されることを確認
      // （全71科目ではなく、問題に関連する10-15科目のみ）
      await expect(element(by.text("現金"))).toBeVisible();
      await expect(element(by.text("売掛金"))).toBeVisible();
      await expect(element(by.text("現金過不足"))).toBeVisible();

      // 非関連勘定科目が表示されないことを確認
      await expect(element(by.text("建物"))).not.toBeVisible();
      await expect(element(by.text("法人税等"))).not.toBeVisible();

      console.log("✅ 動的勘定科目フィルタリングテスト完了");
    });

    it("CBTタイマー機能が正常動作する", async () => {
      console.log("⏰ CBTタイマーテスト開始");

      // 模試モードでタイマーを確認
      await element(by.id("tab-mock-exam")).tap();
      await element(by.id("mock-exam-001")).tap();
      await element(by.id("start-mock-exam-button")).tap();
      await element(by.id("confirm-start-button")).tap();

      await waitFor(element(by.id("mock-exam-question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // CBTヘッダーのタイマー表示確認
      await expect(element(by.id("timer-display"))).toBeVisible();
      await expect(element(by.id("remaining-time"))).toBeVisible();

      // タイマーの色変化確認（残り時間による）
      const timerColor = await element(by.id("timer-display")).getAttributes();
      console.log("タイマー色:", timerColor);

      console.log("✅ CBTタイマーテスト完了");
    });

    it("解答送信とバリデーションが正常動作する", async () => {
      console.log("✔️ CBT解答送信・バリデーションテスト開始");

      await element(by.id("tab-learning")).tap();
      await element(by.id("category-journal")).tap();
      await element(by.id("start-learning-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 不完全な解答で送信を試行
      await element(by.id("debit-account-dropdown-0")).tap();
      await element(by.text("現金")).tap();
      // 金額を入力せずに送信
      await element(by.id("submit-answer-button")).tap();

      // バリデーションエラーの確認
      await waitFor(element(by.id("validation-error")))
        .toBeVisible()
        .withTimeout(2000);
      await expect(
        element(by.text("借方金額を入力してください")),
      ).toBeVisible();

      // 完全な解答で再送信
      await element(by.id("debit-amount-input-0")).tap();
      await element(by.id("numeric-pad-1")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-confirm")).tap();

      await element(by.id("credit-account-dropdown-0")).tap();
      await element(by.text("売上")).tap();
      await element(by.id("credit-amount-input-0")).tap();
      await element(by.id("numeric-pad-1")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-0")).tap();
      await element(by.id("numeric-pad-confirm")).tap();

      await element(by.id("submit-answer-button")).tap();

      // 解説画面への遷移確認
      await waitFor(element(by.id("explanation-screen")))
        .toBeVisible()
        .withTimeout(3000);
      await expect(element(by.id("answer-result"))).toBeVisible();

      console.log("✅ CBT解答送信・バリデーションテスト完了");
    });
  });

  describe("CBTテンプレート回帰テスト", () => {
    it("既存の非CBT問題が正常動作する", async () => {
      console.log("🔄 既存問題回帰テスト開始");

      // CBTテンプレートが適用されていない一般的な仕訳問題を確認
      await element(by.id("tab-learning")).tap();
      await element(by.id("learning-all-questions-button")).tap();
      await element(by.id("start-learning-button")).tap();

      await waitFor(element(by.id("question-screen")))
        .toBeVisible()
        .withTimeout(5000);

      // 従来型のUIが表示されることを確認
      await expect(element(by.id("unified-journal-entry-form"))).toBeVisible();
      await expect(element(by.id("debit-account-dropdown-0"))).toBeVisible();
      await expect(element(by.id("credit-account-dropdown-0"))).toBeVisible();

      // CBT専用要素が表示されないことを確認
      await expect(element(by.id("cbt-header"))).not.toBeVisible();
      await expect(element(by.id("guidance-panel"))).not.toBeVisible();

      console.log("✅ 既存問題回帰テスト完了");
    });

    it("フォームバリデーション互換性確認", async () => {
      console.log("📝 フォームバリデーション互換性テスト開始");

      // CBTテンプレートと非CBTテンプレートで同じバリデーションロジックが動作することを確認

      // 従来型フォームでのバリデーション
      await element(by.id("submit-answer-button")).tap();
      await waitFor(element(by.id("validation-error")))
        .toBeVisible()
        .withTimeout(2000);

      // エラーメッセージの一貫性確認
      await expect(element(by.id("validation-error"))).toBeVisible();

      console.log("✅ フォームバリデーション互換性テスト完了");
    });
  });
});
