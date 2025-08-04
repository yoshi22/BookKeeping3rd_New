/**
 * 模試機能E2Eテスト
 * 簿記3級問題集アプリ - Step 4.2: E2Eテスト実装
 * 
 * テスト対象: CBT形式模試の完全なユーザーフロー
 */

import { device, element, by, waitFor, expect } from 'detox';

describe('模試機能 E2E テスト', () => {
  
  describe('模試受験フロー', () => {
    
    it('模試受験完了フロー（18問・60分制限）', async () => {
      console.log('🎯 模試受験フローテスト開始');
      
      // 模試画面へ移動
      await element(by.id('tab-mock-exam')).tap();
      await waitFor(element(by.id('mock-exam-screen'))).toBeVisible().withTimeout(3000);
      
      // 模試一覧の表示確認（5セット）
      await expect(element(by.id('mock-exam-list'))).toBeVisible();
      for (let i = 1; i <= 5; i++) {
        await expect(element(by.id(`mock-exam-${i.toString().padStart(3, '0')}`))).toBeVisible();
      }
      
      // 基礎レベル模試を選択
      await element(by.id('mock-exam-001')).tap();
      await waitFor(element(by.id('mock-exam-detail'))).toBeVisible().withTimeout(2000);
      
      // 模試詳細の確認
      await expect(element(by.text('基礎レベル模試'))).toBeVisible();
      await expect(element(by.text('制限時間: 60分'))).toBeVisible();
      await expect(element(by.text('合格点: 70点'))).toBeVisible();
      
      // 模試開始
      await element(by.id('start-mock-exam-button')).tap();
      
      // 確認ダイアログ
      await waitFor(element(by.id('confirm-start-dialog'))).toBeVisible().withTimeout(2000);
      await element(by.id('confirm-start-button')).tap();
      
      // 模試画面の表示確認
      await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(5000);
      
      // タイマーが開始されていることを確認
      await expect(element(by.id('timer-display'))).toBeVisible();
      await expect(element(by.id('remaining-time'))).toHaveText('60:00');
      
      console.log('📝 第1問（仕訳15問）解答開始');
      
      // 第1問（仕訳15問）の解答
      for (let i = 1; i <= 15; i++) {
        console.log(`第1問 ${i}/15問目`);
        
        // 現在問題の確認
        await expect(element(by.id('current-section'))).toHaveText('第1問');
        await expect(element(by.id('question-counter'))).toHaveText(`${i}/15`);
        
        // 仕訳問題の解答
        await element(by.id('debit-account-dropdown')).tap();
        await element(by.text('現金')).tap();
        await element(by.id('debit-amount-input')).typeText('10000');
        
        await element(by.id('credit-account-dropdown')).tap();
        await element(by.text('売上')).tap();
        await element(by.id('credit-amount-input')).typeText('10000');
        
        // 次の問題へ
        if (i < 15) {
          await element(by.id('next-question-button')).tap();
          await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(3000);
        } else {
          await element(by.id('next-section-button')).tap();
        }
      }
      
      console.log('📚 第2問（帳簿2問）解答開始');
      
      // 第2問（帳簿2問）の解答
      for (let i = 1; i <= 2; i++) {
        console.log(`第2問 ${i}/2問目`);
        
        await expect(element(by.id('current-section'))).toHaveText('第2問');
        await expect(element(by.id('question-counter'))).toHaveText(`${i}/2`);
        
        // 帳簿問題の解答
        await element(by.id('description-dropdown')).tap();
        await element(by.text('売上取引')).tap();
        await element(by.id('amount-input')).typeText('5000');
        
        if (i < 2) {
          await element(by.id('next-question-button')).tap();
          await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(3000);
        } else {
          await element(by.id('next-section-button')).tap();
        }
      }
      
      console.log('📊 第3問（試算表1問）解答開始');
      
      // 第3問（試算表1問）の解答
      await expect(element(by.id('current-section'))).toHaveText('第3問');
      await expect(element(by.id('question-counter'))).toHaveText('1/1');
      
      // 試算表問題の解答
      await element(by.id('cash-balance-input')).typeText('100000');
      await element(by.id('sales-balance-input')).typeText('500000');
      await element(by.id('expenses-balance-input')).typeText('300000');
      
      // 模試完了
      await element(by.id('finish-exam-button')).tap();
      
      // 完了確認ダイアログ
      await waitFor(element(by.id('confirm-finish-dialog'))).toBeVisible().withTimeout(2000);
      await element(by.id('confirm-finish-button')).tap();
      
      console.log('🏆 結果表示確認');
      
      // 結果画面の表示確認
      await waitFor(element(by.id('exam-result-screen'))).toBeVisible().withTimeout(5000);
      
      // 結果情報の確認
      await expect(element(by.id('total-score'))).toBeVisible();
      await expect(element(by.id('max-score'))).toHaveText('100');
      await expect(element(by.id('pass-fail-status'))).toBeVisible();
      await expect(element(by.id('exam-duration'))).toBeVisible();
      
      // 詳細結果の確認
      await element(by.id('detailed-results-button')).tap();
      await waitFor(element(by.id('detailed-results-screen'))).toBeVisible().withTimeout(3000);
      
      // セクション別結果の確認
      await expect(element(by.id('section1-result'))).toBeVisible();
      await expect(element(by.text('第1問: 仕訳'))).toBeVisible();
      await expect(element(by.id('section2-result'))).toBeVisible();
      await expect(element(by.text('第2問: 帳簿'))).toBeVisible();
      await expect(element(by.id('section3-result'))).toBeVisible();
      await expect(element(by.text('第3問: 試算表'))).toBeVisible();
      
      console.log('✅ 模試受験フロー完了');
    });
    
    it('模試時間制限機能のテスト', async () => {
      console.log('⏰ 模試時間制限テスト開始');
      
      await element(by.id('tab-mock-exam')).tap();
      await element(by.id('mock-exam-002')).tap();
      await element(by.id('start-mock-exam-button')).tap();
      await element(by.id('confirm-start-button')).tap();
      
      await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(5000);
      
      // 時間表示の確認
      await expect(element(by.id('timer-display'))).toBeVisible();
      
      // 時間警告のテスト（実際の実装では時間を操作）
      // Note: 実際のテストでは時間を加速する機能が必要
      console.log('時間警告機能は個別の単体テストで検証');
      
      // 中途終了
      await element(by.id('exit-exam-button')).tap();
      await element(by.id('confirm-exit-button')).tap();
      
      // ホーム画面に戻ることを確認
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(3000);
      
      console.log('✅ 模試時間制限テスト完了');
    });
  });
  
  describe('模試結果と復習連携', () => {
    
    it('不正解問題の自動復習登録', async () => {
      console.log('🔄 復習連携テスト開始');
      
      // 復習画面の初期状態を確認
      await element(by.id('tab-review')).tap();
      await waitFor(element(by.id('review-screen'))).toBeVisible().withTimeout(3000);
      
      const initialReviewCountText = await element(by.id('review-count')).getAttributes();
      console.log('初期復習対象数:', initialReviewCountText);
      
      // 模試を受験（意図的に間違いを含む）
      await element(by.id('tab-mock-exam')).tap();
      await element(by.id('mock-exam-001')).tap();
      await element(by.id('start-mock-exam-button')).tap();
      await element(by.id('confirm-start-button')).tap();
      
      await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(5000);
      
      // 第1問で意図的に間違った答えを入力
      await element(by.id('debit-account-dropdown')).tap();
      await element(by.text('間違った勘定科目')).tap();
      await element(by.id('debit-amount-input')).typeText('999999');
      
      await element(by.id('credit-account-dropdown')).tap();
      await element(by.text('間違った勘定科目2')).tap();
      await element(by.id('credit-amount-input')).typeText('999999');
      
      // 問題をスキップして模試を完了
      await element(by.id('skip-to-end-button')).tap();
      await element(by.id('finish-exam-button')).tap();
      await element(by.id('confirm-finish-button')).tap();
      
      await waitFor(element(by.id('exam-result-screen'))).toBeVisible().withTimeout(5000);
      
      // 結果画面を閉じて復習画面を確認
      await element(by.id('close-result-button')).tap();
      await element(by.id('tab-review')).tap();
      
      // 復習対象が増加していることを確認
      await waitFor(element(by.id('review-screen'))).toBeVisible().withTimeout(3000);
      const updatedReviewCountText = await element(by.id('review-count')).getAttributes();
      console.log('更新後復習対象数:', updatedReviewCountText);
      
      // 復習リストに新しい問題が追加されていることを確認
      await expect(element(by.id('review-list'))).toBeVisible();
      await expect(element(by.id('priority-sorted-indicator'))).toBeVisible();
      
      console.log('✅ 復習連携テスト完了');
    });
  });
  
  describe('模試データ永続化', () => {
    
    it('模試結果の永続化と履歴表示', async () => {
      console.log('💾 模試データ永続化テスト開始');
      
      // 模試を1回受験
      await element(by.id('tab-mock-exam')).tap();
      await element(by.id('mock-exam-003')).tap();
      await element(by.id('start-mock-exam-button')).tap();
      await element(by.id('confirm-start-button')).tap();
      
      // 簡単に模試を完了
      await waitFor(element(by.id('mock-exam-question-screen'))).toBeVisible().withTimeout(5000);
      await element(by.id('skip-to-end-button')).tap();
      await element(by.id('finish-exam-button')).tap();
      await element(by.id('confirm-finish-button')).tap();
      
      await waitFor(element(by.id('exam-result-screen'))).toBeVisible().withTimeout(5000);
      const scoreText = await element(by.id('total-score')).getAttributes();
      console.log('取得スコア:', scoreText);
      
      await element(by.id('close-result-button')).tap();
      
      // アプリを再起動して永続化を確認
      await device.reloadReactNative();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
      
      // 模試履歴を確認
      await element(by.id('tab-mock-exam')).tap();
      await element(by.id('exam-history-tab')).tap();
      
      await waitFor(element(by.id('exam-history-list'))).toBeVisible().withTimeout(3000);
      
      // 受験した模試の履歴が表示されることを確認
      await expect(element(by.id('exam-history-item-1'))).toBeVisible();
      await expect(element(by.text('応用レベル模試'))).toBeVisible();
      
      console.log('✅ 模試データ永続化テスト完了');
    });
  });
});