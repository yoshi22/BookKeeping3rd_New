/**
 * E2Eテストセットアップファイル
 * 簿記3級問題集アプリ - Step 4.2: E2Eテスト実装
 */

import { device, cleanup } from 'detox';

beforeAll(async () => {
  console.log('🚀 E2Eテスト開始: 簿記3級問題集アプリ');
  
  // デバイス準備とアプリ起動
  await device.launchApp({
    permissions: { notifications: 'YES' },
    newInstance: true
  });
  
  // アプリが完全に起動するまで待機
  await waitFor(element(by.id('app-ready-indicator')))
    .toBeVisible()
    .withTimeout(10000);
    
  console.log('✅ アプリ起動完了');
});

afterAll(async () => {
  console.log('🧹 E2Eテスト終了: クリーンアップ実行');
  await cleanup();
});

beforeEach(async () => {
  // 各テスト前にアプリをホーム画面にリセット
  await device.reloadReactNative();
  
  // ホーム画面の表示を確認
  await waitFor(element(by.id('home-screen')))
    .toBeVisible()
    .withTimeout(5000);
});

afterEach(async () => {
  // テスト後のスクリーンショット保存（失敗時）
  if (jasmine.currentSpec && jasmine.currentSpec.failedExpectations.length > 0) {
    const specName = jasmine.currentSpec.fullName.replace(/\s+/g, '-');
    await device.takeScreenshot(`${specName}-failed`);
  }
});