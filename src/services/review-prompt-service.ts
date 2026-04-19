/**
 * レビュー依頼サービス
 * App Storeレビュー依頼のタイミング制御
 */

import { Platform } from "react-native";
import InAppReview from "react-native-in-app-review";
import { settingsRepository } from "@/data/repositories/settings-repository";
import { REVIEW_PROMPT_CONDITIONS } from "@/config/monetization";
import type { ReviewTrackingInfo } from "@/types/monetization";
import {
  logReviewPromptShown,
  logReviewPromptAccepted,
} from "@/services/analytics-service";
import { logger } from "@/utils/logger";

/**
 * ミリ秒を日数に変換
 */
function msToDays(ms: number): number {
  return ms / (1000 * 60 * 60 * 24);
}

/**
 * ミリ秒を時間に変換
 */
function msToHours(ms: number): number {
  return ms / (1000 * 60 * 60);
}

/**
 * レビュー依頼サービスクラス
 * セッション完了後にレビュー依頼を表示するかどうかを判定
 */
export class ReviewPromptService {
  private static instance: ReviewPromptService;

  private constructor() {}

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): ReviewPromptService {
    if (!ReviewPromptService.instance) {
      ReviewPromptService.instance = new ReviewPromptService();
    }
    return ReviewPromptService.instance;
  }

  /**
   * レビュー依頼を表示すべきかどうかを判定
   * @param sessionCount 現在のセッション完了回数
   * @returns 表示すべき場合はtrue
   */
  async shouldShowReviewPrompt(sessionCount: number): Promise<boolean> {
    // Web環境ではスキップ
    if (Platform.OS === "web") {
      logger.info("ReviewPrompt: Web環境のためスキップ");
      return false;
    }

    // In-App Reviewが利用可能か確認
    const isAvailable = InAppReview.isAvailable();
    if (!isAvailable) {
      logger.info("ReviewPrompt: In-App Reviewが利用不可");
      return false;
    }

    // 条件1: セッション完了回数が指定回数に一致するか
    const isTargetSession =
      REVIEW_PROMPT_CONDITIONS.requiredSessionCounts.includes(sessionCount);
    if (!isTargetSession) {
      logger.info("ReviewPrompt: 対象セッション回数ではない", { sessionCount });
      return false;
    }

    // 追跡情報を取得
    const trackingInfo = await settingsRepository.getReviewTrackingInfo();

    // 条件2: クールダウン期間を過ぎているか
    if (trackingInfo.lastPromptTime) {
      const daysSinceLastPrompt = msToDays(
        Date.now() - trackingInfo.lastPromptTime,
      );
      if (daysSinceLastPrompt < REVIEW_PROMPT_CONDITIONS.cooldownDays) {
        logger.info("ReviewPrompt: クールダウン期間中", {
          daysSinceLastPrompt,
          cooldownDays: REVIEW_PROMPT_CONDITIONS.cooldownDays,
        });
        return false;
      }
    }

    // 条件3: 購入直後ではないか
    if (trackingInfo.purchaseTime) {
      const hoursSincePurchase = msToHours(
        Date.now() - trackingInfo.purchaseTime,
      );
      if (hoursSincePurchase < REVIEW_PROMPT_CONDITIONS.postPurchaseWaitHours) {
        logger.info("ReviewPrompt: 購入直後のためスキップ", {
          hoursSincePurchase,
          waitHours: REVIEW_PROMPT_CONDITIONS.postPurchaseWaitHours,
        });
        return false;
      }
    }

    logger.info("ReviewPrompt: 表示条件を満たす", { sessionCount });
    return true;
  }

  /**
   * レビュー依頼を表示
   * @param sessionCount 現在のセッション完了回数
   * @returns 表示に成功した場合はtrue
   */
  async showReviewPrompt(sessionCount: number): Promise<boolean> {
    // Web環境ではスキップ
    if (Platform.OS === "web") {
      return false;
    }

    try {
      // 表示を記録
      await settingsRepository.recordReviewPrompt();
      logReviewPromptShown(sessionCount);

      // In-App Reviewを表示
      const result = await InAppReview.RequestInAppReview();

      logger.info("レビュー依頼表示完了", { result });

      // iOSでは結果が常にtrueになるため、アクションは追跡できない
      // Androidではユーザーのアクションに基づいて結果が変わる
      if (result) {
        logReviewPromptAccepted();
      }

      return true;
    } catch (error) {
      logger.error("レビュー依頼表示エラー", error as Error);
      return false;
    }
  }

  /**
   * セッション完了後にレビュー依頼を試行
   * @param sessionCount 現在のセッション完了回数
   * @returns 表示された場合はtrue
   */
  async tryShowReviewPromptAfterSession(
    sessionCount: number,
  ): Promise<boolean> {
    const shouldShow = await this.shouldShowReviewPrompt(sessionCount);

    if (!shouldShow) {
      return false;
    }

    return this.showReviewPrompt(sessionCount);
  }

  /**
   * レビュー追跡情報を取得
   */
  async getTrackingInfo(): Promise<ReviewTrackingInfo> {
    return settingsRepository.getReviewTrackingInfo();
  }
}

// シングルトンインスタンスをエクスポート
export const reviewPromptService = ReviewPromptService.getInstance();
