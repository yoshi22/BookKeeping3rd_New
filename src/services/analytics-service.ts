/**
 * アナリティクスサービス
 * マネタイズ関連イベントのログ出力
 */

import {
  MONETIZATION_LOG_ENABLED,
  MONETIZATION_LOG_PREFIX,
} from "@/config/monetization";
import type {
  AnalyticsEventName,
  AnalyticsEventParams,
} from "@/types/monetization";

/**
 * イベントをログ出力
 * 将来的にFirebase Analytics等に接続可能
 */
export function logEvent<T extends AnalyticsEventName>(
  eventName: T,
  params?: AnalyticsEventParams[T],
): void {
  if (!MONETIZATION_LOG_ENABLED) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logData = {
    event: eventName,
    timestamp,
    ...(params ? { params } : {}),
  };

  console.log(`${MONETIZATION_LOG_PREFIX} ${eventName}`, logData);

  // TODO: 将来的にFirebase Analytics等に送信
  // analytics().logEvent(eventName, params);
}

/**
 * セッション完了をログ
 */
export function logSessionCompleted(
  params: AnalyticsEventParams["session_completed"],
): void {
  logEvent("session_completed", params);
}

/**
 * インタースティシャル表示をログ
 */
export function logInterstitialShown(): void {
  logEvent("interstitial_shown");
}

/**
 * インタースティシャル失敗をログ
 */
export function logInterstitialFailed(error: string): void {
  logEvent("interstitial_failed", { error });
}

/**
 * バナー表示をログ
 */
export function logBannerShown(): void {
  logEvent("banner_shown");
}

/**
 * バナー失敗をログ
 */
export function logBannerFailed(error: string): void {
  logEvent("banner_failed", { error });
}

/**
 * 広告非表示CTAクリックをログ
 */
export function logRemoveAdsCTAClicked(
  source: "session_result" | "settings",
): void {
  logEvent("remove_ads_cta_clicked", { source });
}

/**
 * 購入開始をログ
 */
export function logPurchaseStarted(): void {
  logEvent("purchase_started");
}

/**
 * 購入成功をログ
 */
export function logPurchaseSuccess(transactionId?: string): void {
  logEvent("purchase_success", { transactionId });
}

/**
 * 購入失敗をログ
 */
export function logPurchaseFailed(error: string): void {
  logEvent("purchase_failed", { error });
}

/**
 * 購入復元をログ
 */
export function logPurchaseRestored(): void {
  logEvent("purchase_restored");
}

/**
 * レビュー依頼表示をログ
 */
export function logReviewPromptShown(sessionCount: number): void {
  logEvent("review_prompt_shown", { sessionCount });
}

/**
 * レビュー依頼受諾をログ
 */
export function logReviewPromptAccepted(): void {
  logEvent("review_prompt_accepted");
}
