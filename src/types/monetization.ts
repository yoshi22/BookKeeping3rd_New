/**
 * マネタイズ関連の型定義
 * 広告、IAP、レビュー依頼、セッション管理
 */

// ============================================
// セッション関連
// ============================================

/**
 * セッションの状態
 */
export interface SessionState {
  sessionId: string;
  sessionType: "learning" | "review";
  questionIds: string[];
  currentIndex: number;
  answeredCount: number;
  correctCount: number;
  startedAt: number;
  completedAt?: number;
}

/**
 * セッション完了時の結果
 */
export interface SessionResult {
  sessionId: string;
  sessionType: "learning" | "review";
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  totalTimeMs: number;
  averageTimeMs: number;
}

// ============================================
// 購入関連
// ============================================

/**
 * 購入状態
 */
export type PurchaseState = "unknown" | "free" | "premium";

/**
 * 広告非表示商品のストア情報
 */
export interface RemoveAdsProduct {
  productId: string;
  price: string;
  currency?: string;
  countryCode?: string;
  localizedPrice: string;
  title: string;
  description?: string;
}

/**
 * 購入コンテキストの型
 */
export interface PurchaseContextType {
  /** 現在の購入状態 */
  purchaseState: PurchaseState;
  /** ローディング中かどうか */
  isLoading: boolean;
  /** プレミアム（広告非表示済み）かどうか */
  isPremium: boolean;
  /** 広告非表示商品のストア情報 */
  removeAdsProduct: RemoveAdsProduct | null;
  /** 広告非表示を購入可能か */
  canPurchaseRemoveAds: boolean;
  /** ストアの商品情報を再取得 */
  refreshPurchaseCatalog: () => Promise<void>;
  /** 広告非表示を購入 */
  purchaseRemoveAds: () => Promise<boolean>;
  /** 購入を復元 */
  restorePurchases: () => Promise<boolean>;
  /** エラーメッセージ */
  error: string | null;
  /** エラーをクリア */
  clearError: () => void;
}

/**
 * 購入情報
 */
export interface PurchaseInfo {
  productId: string;
  transactionId?: string;
  purchaseTime?: number;
  purchaseState: PurchaseState;
}

// ============================================
// 広告関連
// ============================================

/**
 * 広告コンテキストの型
 */
export interface AdContextType {
  /** バナー広告を表示するか */
  showBannerAd: boolean;
  /** インタースティシャルの準備ができているか */
  isInterstitialReady: boolean;
  /** インタースティシャルを表示できるか（頻度キャップ考慮） */
  canShowInterstitial: boolean;
  /** インタースティシャルを読み込み */
  loadInterstitial: () => Promise<void>;
  /** インタースティシャルを表示 */
  showInterstitial: () => Promise<boolean>;
  /** 広告の初期化が完了しているか */
  isInitialized: boolean;
}

/**
 * 広告頻度キャップ設定
 */
export interface AdFrequencyCapConfig {
  /** セッションごとの最大表示回数 */
  maxPerSession: number;
  /** 1日の最大表示回数 */
  maxPerDay: number;
  /** 表示間隔（ミリ秒） */
  minIntervalMs: number;
}

/**
 * 広告追跡情報
 */
export interface AdTrackingInfo {
  /** 本日の表示回数 */
  todayCount: number;
  /** 現在セッションの表示回数 */
  sessionCount: number;
  /** 最後に表示した時刻 */
  lastShownAt: number | null;
  /** 本日の日付（YYYY-MM-DD形式） */
  todayDate: string;
}

// ============================================
// レビュー依頼関連
// ============================================

/**
 * レビュー依頼の追跡情報
 */
export interface ReviewTrackingInfo {
  /** セッション完了回数 */
  sessionCompletedCount: number;
  /** 最後にレビュー依頼を出した時刻 */
  lastPromptTime: number | null;
  /** レビュー依頼を出した回数 */
  promptCount: number;
  /** 購入時刻（レビュー依頼を避けるため） */
  purchaseTime: number | null;
}

/**
 * レビュー依頼の条件
 */
export interface ReviewPromptConditions {
  /** 必要なセッション完了回数 */
  requiredSessionCounts: number[];
  /** クールダウン期間（日数） */
  cooldownDays: number;
  /** 購入後の待機時間（時間） */
  postPurchaseWaitHours: number;
}

// ============================================
// 設定永続化関連
// ============================================

/**
 * マネタイズ設定（DB保存用）
 */
export interface MonetizationSettings {
  // 購入関連
  purchaseState: PurchaseState;
  purchaseTimestamp: number | null;
  purchaseTransactionId: string | null;

  // セッション関連
  sessionCompletedCount: number;

  // 広告関連
  interstitialShownCount: number;
  lastInterstitialTime: number | null;
  lastInterstitialDate: string | null;

  // レビュー関連
  lastReviewPromptTime: number | null;
  reviewPromptCount: number;
}

/**
 * 設定キーの定数
 */
export const SETTINGS_KEYS = {
  PURCHASE_STATE: "purchase_state",
  PURCHASE_TIMESTAMP: "purchase_timestamp",
  PURCHASE_TRANSACTION_ID: "purchase_transaction_id",
  SESSION_COMPLETED_COUNT: "session_completed_count",
  INTERSTITIAL_SHOWN_COUNT: "interstitial_shown_count",
  LAST_INTERSTITIAL_TIME: "last_interstitial_time",
  LAST_INTERSTITIAL_DATE: "last_interstitial_date",
  LAST_REVIEW_PROMPT_TIME: "last_review_prompt_time",
  REVIEW_PROMPT_COUNT: "review_prompt_count",
} as const;

// ============================================
// イベントログ関連
// ============================================

/**
 * ログイベント名
 */
export type AnalyticsEventName =
  | "session_completed"
  | "interstitial_shown"
  | "interstitial_failed"
  | "banner_shown"
  | "banner_failed"
  | "remove_ads_cta_clicked"
  | "purchase_started"
  | "purchase_success"
  | "purchase_failed"
  | "purchase_restored"
  | "review_prompt_shown"
  | "review_prompt_accepted";

/**
 * ログイベントのパラメータ
 */
export interface AnalyticsEventParams {
  session_completed: {
    sessionType: "learning" | "review";
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    totalTimeMs: number;
  };
  interstitial_shown: Record<string, never>;
  interstitial_failed: { error: string };
  banner_shown: Record<string, never>;
  banner_failed: { error: string };
  remove_ads_cta_clicked: { source: "session_result" | "settings" };
  purchase_started: Record<string, never>;
  purchase_success: { transactionId?: string };
  purchase_failed: { error: string };
  purchase_restored: Record<string, never>;
  review_prompt_shown: { sessionCount: number };
  review_prompt_accepted: Record<string, never>;
}
