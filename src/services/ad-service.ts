/**
 * 広告サービス
 * AdMob広告の表示制御・頻度キャップ管理
 */

import { Platform } from "react-native";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { AD_UNITS, INTERSTITIAL_FREQUENCY_CAP } from "@/config/monetization";
import { settingsRepository } from "@/data/repositories/settings-repository";
import type { AdTrackingInfo } from "@/types/monetization";
import {
  logInterstitialShown,
  logInterstitialFailed,
} from "@/services/analytics-service";
import { logger } from "@/utils/logger";

/**
 * 広告サービスクラス
 * インタースティシャル広告の読み込み・表示・頻度管理
 */
export class AdService {
  private static instance: AdService;
  private interstitialAd: InterstitialAd | null = null;
  private isInterstitialLoaded = false;
  private isInterstitialLoading = false;
  private sessionShowCount = 0;

  // リスナー管理用
  private loadedUnsubscribe: (() => void) | null = null;
  private errorUnsubscribe: (() => void) | null = null;
  private closedUnsubscribe: (() => void) | null = null;

  private constructor() {}

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  /**
   * 広告ユニットIDを取得
   */
  private getInterstitialAdUnitId(): string {
    // Web環境またはテスト環境ではテストIDを返す
    if (Platform.OS === "web") {
      return TestIds.INTERSTITIAL;
    }

    const adUnitId = AD_UNITS.interstitial;
    if (!adUnitId) {
      logger.warn("インタースティシャル広告ユニットIDが未設定");
      return TestIds.INTERSTITIAL;
    }
    return adUnitId;
  }

  /**
   * インタースティシャル広告を読み込み
   */
  async loadInterstitial(): Promise<void> {
    // Web環境ではスキップ
    if (Platform.OS === "web") {
      logger.info("AdService: Web環境のため広告読み込みをスキップ");
      return;
    }

    // 既に読み込み済みまたは読み込み中
    if (this.isInterstitialLoaded || this.isInterstitialLoading) {
      return;
    }

    try {
      this.isInterstitialLoading = true;

      // 既存のリスナーをクリーンアップ
      this.cleanupListeners();

      // 新しい広告インスタンスを作成
      const adUnitId = this.getInterstitialAdUnitId();
      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      // イベントリスナーを設定
      this.loadedUnsubscribe = this.interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          this.isInterstitialLoaded = true;
          this.isInterstitialLoading = false;
          logger.info("インタースティシャル広告読み込み完了");
        },
      );

      this.errorUnsubscribe = this.interstitialAd.addAdEventListener(
        AdEventType.ERROR,
        (error: Error) => {
          this.isInterstitialLoaded = false;
          this.isInterstitialLoading = false;
          logger.error("インタースティシャル広告読み込みエラー", error);
          logInterstitialFailed(error.message || "広告読み込みエラー");
        },
      );

      this.closedUnsubscribe = this.interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          // 広告が閉じられたら次の広告を読み込み
          this.isInterstitialLoaded = false;
          this.loadInterstitial();
        },
      );

      // 広告を読み込み
      await this.interstitialAd.load();
    } catch (error) {
      this.isInterstitialLoading = false;
      logger.error("インタースティシャル広告読み込み例外", error as Error);
      logInterstitialFailed((error as Error).message || "読み込み例外");
    }
  }

  /**
   * リスナーをクリーンアップ
   */
  private cleanupListeners(): void {
    if (this.loadedUnsubscribe) {
      this.loadedUnsubscribe();
      this.loadedUnsubscribe = null;
    }
    if (this.errorUnsubscribe) {
      this.errorUnsubscribe();
      this.errorUnsubscribe = null;
    }
    if (this.closedUnsubscribe) {
      this.closedUnsubscribe();
      this.closedUnsubscribe = null;
    }
  }

  /**
   * インタースティシャル広告が準備できているか
   */
  isInterstitialReady(): boolean {
    return this.isInterstitialLoaded;
  }

  /**
   * 頻度キャップを確認
   * @returns 表示可能な場合はtrue
   */
  async canShowInterstitial(): Promise<boolean> {
    // セッション内制限
    if (this.sessionShowCount >= INTERSTITIAL_FREQUENCY_CAP.maxPerSession) {
      logger.info("インタースティシャル: セッション制限に到達");
      return false;
    }

    // 日次制限と時間間隔の確認
    const trackingInfo = await settingsRepository.getAdTrackingInfo();

    // 1日の制限
    if (trackingInfo.todayCount >= INTERSTITIAL_FREQUENCY_CAP.maxPerDay) {
      logger.info("インタースティシャル: 日次制限に到達", {
        todayCount: trackingInfo.todayCount,
      });
      return false;
    }

    // 時間間隔
    if (trackingInfo.lastShownAt) {
      const elapsed = Date.now() - trackingInfo.lastShownAt;
      if (elapsed < INTERSTITIAL_FREQUENCY_CAP.minIntervalMs) {
        logger.info("インタースティシャル: 時間間隔が不足", {
          elapsed,
          required: INTERSTITIAL_FREQUENCY_CAP.minIntervalMs,
        });
        return false;
      }
    }

    return true;
  }

  /**
   * インタースティシャル広告を表示
   * @returns 表示に成功した場合はtrue
   */
  async showInterstitial(): Promise<boolean> {
    // Web環境ではスキップ
    if (Platform.OS === "web") {
      logger.info("AdService: Web環境のため広告表示をスキップ");
      return false;
    }

    // 広告が準備できていない
    if (!this.isInterstitialLoaded || !this.interstitialAd) {
      logger.info("インタースティシャル広告が準備されていません");
      return false;
    }

    // 頻度キャップを確認
    const canShow = await this.canShowInterstitial();
    if (!canShow) {
      return false;
    }

    try {
      // 広告を表示
      await this.interstitialAd.show();

      // 表示を記録
      this.sessionShowCount += 1;
      await settingsRepository.recordInterstitialShown();
      logInterstitialShown();

      this.isInterstitialLoaded = false;

      logger.info("インタースティシャル広告表示成功", {
        sessionCount: this.sessionShowCount,
      });
      return true;
    } catch (error) {
      logger.error("インタースティシャル広告表示エラー", error as Error);
      logInterstitialFailed((error as Error).message || "表示エラー");
      return false;
    }
  }

  /**
   * セッションカウントをリセット
   * 新しいアプリセッション開始時に呼び出し
   */
  resetSessionCount(): void {
    this.sessionShowCount = 0;
    logger.info("インタースティシャルセッションカウントをリセット");
  }

  /**
   * 広告追跡情報を取得
   */
  async getAdTrackingInfo(): Promise<AdTrackingInfo> {
    const info = await settingsRepository.getAdTrackingInfo();
    return {
      ...info,
      sessionCount: this.sessionShowCount,
    };
  }

  /**
   * リソースをクリーンアップ
   */
  cleanup(): void {
    this.cleanupListeners();
    this.interstitialAd = null;
    this.isInterstitialLoaded = false;
    this.isInterstitialLoading = false;
  }
}

// シングルトンインスタンスをエクスポート
export const adService = AdService.getInstance();
