/**
 * マネタイズ設定
 * AdMob広告ID、IAP商品ID、頻度キャップ設定など
 */

import { Platform } from "react-native";
import type {
  AdFrequencyCapConfig,
  ReviewPromptConditions,
} from "@/types/monetization";

// ============================================
// 環境判定
// ============================================

const isDev = __DEV__;

// ============================================
// AdMob広告ユニットID
// ============================================

/**
 * AdMobテスト広告ID（開発用）
 * https://developers.google.com/admob/android/test-ads
 */
const TEST_AD_UNITS = {
  ios: {
    banner: "ca-app-pub-3940256099942544/2934735716",
    interstitial: "ca-app-pub-3940256099942544/4411468910",
  },
  android: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
  },
};

/**
 * AdMob本番広告ID
 * TODO: AdMobコンソールで作成した広告ユニットIDに置き換え
 */
const PROD_AD_UNITS = {
  ios: {
    banner: "ca-app-pub-XXXXXXXXXXXXX/XXXXXXXXXX", // TODO: 本番IDに置き換え
    interstitial: "ca-app-pub-XXXXXXXXXXXXX/XXXXXXXXXX", // TODO: 本番IDに置き換え
  },
  android: {
    banner: "ca-app-pub-XXXXXXXXXXXXX/XXXXXXXXXX", // TODO: 本番IDに置き換え
    interstitial: "ca-app-pub-XXXXXXXXXXXXX/XXXXXXXXXX", // TODO: 本番IDに置き換え
  },
};

/**
 * 現在の環境に応じた広告ユニットIDを取得
 */
export const AD_UNITS = {
  banner: Platform.select({
    ios: isDev ? TEST_AD_UNITS.ios.banner : PROD_AD_UNITS.ios.banner,
    android: isDev
      ? TEST_AD_UNITS.android.banner
      : PROD_AD_UNITS.android.banner,
    default: TEST_AD_UNITS.android.banner,
  }),
  interstitial: Platform.select({
    ios: isDev
      ? TEST_AD_UNITS.ios.interstitial
      : PROD_AD_UNITS.ios.interstitial,
    android: isDev
      ? TEST_AD_UNITS.android.interstitial
      : PROD_AD_UNITS.android.interstitial,
    default: TEST_AD_UNITS.android.interstitial,
  }),
};

// ============================================
// IAP商品ID
// ============================================

/**
 * IAP商品ID
 * iOS/Android両方で同じIDを使用
 */
export const IAP_PRODUCTS = {
  /** 広告削除（買い切り） */
  REMOVE_ADS: "remove_ads",
};

/**
 * IAP商品IDの配列（初期化用）
 */
export const IAP_PRODUCT_IDS = [IAP_PRODUCTS.REMOVE_ADS];

// ============================================
// 広告頻度キャップ設定
// ============================================

/**
 * インタースティシャル広告の頻度キャップ設定
 */
export const INTERSTITIAL_FREQUENCY_CAP: AdFrequencyCapConfig = {
  /** 1セッションにつき最大1回 */
  maxPerSession: 1,
  /** 1日最大2回 */
  maxPerDay: 2,
  /** 最低10分間隔（ミリ秒） */
  minIntervalMs: 10 * 60 * 1000, // 10分
};

// ============================================
// セッション設定
// ============================================

/**
 * セッションのバッチサイズ（問題数）
 */
export const SESSION_BATCH_SIZE = 10;

// ============================================
// レビュー依頼設定
// ============================================

/**
 * レビュー依頼の条件
 */
export const REVIEW_PROMPT_CONDITIONS: ReviewPromptConditions = {
  /** レビュー依頼を出すセッション完了回数（3回目と5回目） */
  requiredSessionCounts: [3, 5],
  /** クールダウン期間（7日） */
  cooldownDays: 7,
  /** 購入後の待機時間（24時間） */
  postPurchaseWaitHours: 24,
};

// ============================================
// 広告削除の価格表示
// ============================================

/**
 * 広告削除の表示価格
 * 実際の価格はストアから取得するが、UI表示用のデフォルト値
 */
export const REMOVE_ADS_DISPLAY_PRICE = "¥500";

// ============================================
// ストレージキー（SecureStore用）
// ============================================

export const SECURE_STORE_KEYS = {
  PURCHASE_STATE: "monetization_purchase_state",
  PURCHASE_TRANSACTION_ID: "monetization_purchase_transaction_id",
};

// ============================================
// ログ設定
// ============================================

/**
 * マネタイズ関連のログを有効にするか
 */
export const MONETIZATION_LOG_ENABLED = isDev;

/**
 * マネタイズログのプレフィックス
 */
export const MONETIZATION_LOG_PREFIX = "[Monetization]";
