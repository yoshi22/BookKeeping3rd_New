/**
 * 設定リポジトリ
 * マネタイズ関連の設定をapp_settingsテーブルで管理
 */

import { databaseService } from "../database";
import { logger } from "../../utils/logger";
import {
  type PurchaseState,
  type MonetizationSettings,
  type AdTrackingInfo,
  type ReviewTrackingInfo,
  SETTINGS_KEYS,
} from "../../types/monetization";

/**
 * app_settingsテーブルの行型
 */
interface AppSettingRow {
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  updated_at: string;
}

/**
 * 設定リポジトリクラス
 */
export class SettingsRepository {
  private static instance: SettingsRepository;

  private constructor() {}

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }
    return SettingsRepository.instance;
  }

  // ============================================
  // 汎用設定操作
  // ============================================

  /**
   * 設定値を取得
   */
  async getSetting(key: string): Promise<string | null> {
    try {
      const result = await databaseService.executeSql<AppSettingRow>(
        "SELECT value FROM app_settings WHERE key = ?",
        [key],
      );

      if (result.rows && result.rows.length > 0) {
        return result.rows[0].value;
      }
      return null;
    } catch (error) {
      logger.error("設定の取得に失敗", error as Error, { key });
      return null;
    }
  }

  /**
   * 設定値を保存（UPSERT）
   */
  async setSetting(
    key: string,
    value: string,
    type: "string" | "number" | "boolean" | "json" = "string",
  ): Promise<boolean> {
    try {
      await databaseService.executeSql(
        `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
         VALUES (?, ?, ?, datetime('now'))`,
        [key, value, type],
      );
      return true;
    } catch (error) {
      logger.error("設定の保存に失敗", error as Error, { key, value });
      return false;
    }
  }

  /**
   * 数値設定を取得
   */
  async getNumberSetting(
    key: string,
    defaultValue: number = 0,
  ): Promise<number> {
    const value = await this.getSetting(key);
    if (value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * 数値設定を保存
   */
  async setNumberSetting(key: string, value: number): Promise<boolean> {
    return this.setSetting(key, value.toString(), "number");
  }

  // ============================================
  // 購入状態管理
  // ============================================

  /**
   * 購入状態を取得
   */
  async getPurchaseState(): Promise<PurchaseState> {
    const value = await this.getSetting(SETTINGS_KEYS.PURCHASE_STATE);
    if (value === "premium" || value === "free") {
      return value;
    }
    return "free";
  }

  /**
   * 購入状態を保存
   */
  async setPurchaseState(
    state: PurchaseState,
    transactionId?: string,
  ): Promise<boolean> {
    try {
      const timestamp = Date.now();

      await databaseService.executeTransaction(async () => {
        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'string', datetime('now'))`,
          [SETTINGS_KEYS.PURCHASE_STATE, state],
        );

        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'number', datetime('now'))`,
          [SETTINGS_KEYS.PURCHASE_TIMESTAMP, timestamp.toString()],
        );

        if (transactionId) {
          await databaseService.executeSql(
            `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
             VALUES (?, ?, 'string', datetime('now'))`,
            [SETTINGS_KEYS.PURCHASE_TRANSACTION_ID, transactionId],
          );
        }
      });

      logger.info("購入状態を保存", { state, transactionId });
      return true;
    } catch (error) {
      logger.error("購入状態の保存に失敗", error as Error);
      return false;
    }
  }

  /**
   * 購入タイムスタンプを取得
   */
  async getPurchaseTimestamp(): Promise<number | null> {
    const value = await this.getSetting(SETTINGS_KEYS.PURCHASE_TIMESTAMP);
    if (value === null) return null;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }

  // ============================================
  // セッション管理
  // ============================================

  /**
   * セッション完了回数を取得
   */
  async getSessionCompletedCount(): Promise<number> {
    return this.getNumberSetting(SETTINGS_KEYS.SESSION_COMPLETED_COUNT, 0);
  }

  /**
   * セッション完了回数をインクリメント
   */
  async incrementSessionCompletedCount(): Promise<number> {
    const current = await this.getSessionCompletedCount();
    const newCount = current + 1;
    await this.setNumberSetting(
      SETTINGS_KEYS.SESSION_COMPLETED_COUNT,
      newCount,
    );
    logger.info("セッション完了回数を更新", { newCount });
    return newCount;
  }

  // ============================================
  // 広告追跡
  // ============================================

  /**
   * 広告追跡情報を取得
   */
  async getAdTrackingInfo(): Promise<AdTrackingInfo> {
    const today = this.getTodayDateString();
    const lastDate = await this.getSetting(
      SETTINGS_KEYS.LAST_INTERSTITIAL_DATE,
    );

    // 日付が変わっていたらカウントをリセット
    let todayCount = 0;
    if (lastDate === today) {
      todayCount = await this.getNumberSetting(
        SETTINGS_KEYS.INTERSTITIAL_SHOWN_COUNT,
        0,
      );
    }

    const lastShownAt = await this.getSetting(
      SETTINGS_KEYS.LAST_INTERSTITIAL_TIME,
    );

    return {
      todayCount,
      sessionCount: 0, // セッション内カウントはメモリで管理
      lastShownAt: lastShownAt ? parseInt(lastShownAt, 10) : null,
      todayDate: today,
    };
  }

  /**
   * インタースティシャル表示を記録
   */
  async recordInterstitialShown(): Promise<boolean> {
    try {
      const now = Date.now();
      const today = this.getTodayDateString();
      const lastDate = await this.getSetting(
        SETTINGS_KEYS.LAST_INTERSTITIAL_DATE,
      );

      // 日付が変わっていたらカウントをリセット
      let newCount = 1;
      if (lastDate === today) {
        const currentCount = await this.getNumberSetting(
          SETTINGS_KEYS.INTERSTITIAL_SHOWN_COUNT,
          0,
        );
        newCount = currentCount + 1;
      }

      await databaseService.executeTransaction(async () => {
        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'number', datetime('now'))`,
          [SETTINGS_KEYS.INTERSTITIAL_SHOWN_COUNT, newCount.toString()],
        );

        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'number', datetime('now'))`,
          [SETTINGS_KEYS.LAST_INTERSTITIAL_TIME, now.toString()],
        );

        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'string', datetime('now'))`,
          [SETTINGS_KEYS.LAST_INTERSTITIAL_DATE, today],
        );
      });

      logger.info("インタースティシャル表示を記録", {
        count: newCount,
        time: now,
      });
      return true;
    } catch (error) {
      logger.error("インタースティシャル記録の保存に失敗", error as Error);
      return false;
    }
  }

  // ============================================
  // レビュー依頼追跡
  // ============================================

  /**
   * レビュー追跡情報を取得
   */
  async getReviewTrackingInfo(): Promise<ReviewTrackingInfo> {
    const [sessionCount, lastPromptTime, promptCount, purchaseTime] =
      await Promise.all([
        this.getSessionCompletedCount(),
        this.getSetting(SETTINGS_KEYS.LAST_REVIEW_PROMPT_TIME),
        this.getNumberSetting(SETTINGS_KEYS.REVIEW_PROMPT_COUNT, 0),
        this.getPurchaseTimestamp(),
      ]);

    return {
      sessionCompletedCount: sessionCount,
      lastPromptTime: lastPromptTime ? parseInt(lastPromptTime, 10) : null,
      promptCount,
      purchaseTime,
    };
  }

  /**
   * レビュー依頼を記録
   */
  async recordReviewPrompt(): Promise<boolean> {
    try {
      const now = Date.now();
      const currentCount = await this.getNumberSetting(
        SETTINGS_KEYS.REVIEW_PROMPT_COUNT,
        0,
      );

      await databaseService.executeTransaction(async () => {
        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'number', datetime('now'))`,
          [SETTINGS_KEYS.LAST_REVIEW_PROMPT_TIME, now.toString()],
        );

        await databaseService.executeSql(
          `INSERT OR REPLACE INTO app_settings (key, value, type, updated_at)
           VALUES (?, ?, 'number', datetime('now'))`,
          [SETTINGS_KEYS.REVIEW_PROMPT_COUNT, (currentCount + 1).toString()],
        );
      });

      logger.info("レビュー依頼を記録", { count: currentCount + 1, time: now });
      return true;
    } catch (error) {
      logger.error("レビュー依頼記録の保存に失敗", error as Error);
      return false;
    }
  }

  // ============================================
  // 全設定取得・リセット
  // ============================================

  /**
   * 全マネタイズ設定を取得
   */
  async getAllMonetizationSettings(): Promise<MonetizationSettings> {
    const [
      purchaseState,
      purchaseTimestamp,
      purchaseTransactionId,
      sessionCompletedCount,
      adTrackingInfo,
      reviewTrackingInfo,
    ] = await Promise.all([
      this.getPurchaseState(),
      this.getPurchaseTimestamp(),
      this.getSetting(SETTINGS_KEYS.PURCHASE_TRANSACTION_ID),
      this.getSessionCompletedCount(),
      this.getAdTrackingInfo(),
      this.getReviewTrackingInfo(),
    ]);

    return {
      purchaseState,
      purchaseTimestamp,
      purchaseTransactionId,
      sessionCompletedCount,
      interstitialShownCount: adTrackingInfo.todayCount,
      lastInterstitialTime: adTrackingInfo.lastShownAt,
      lastInterstitialDate: adTrackingInfo.todayDate,
      lastReviewPromptTime: reviewTrackingInfo.lastPromptTime,
      reviewPromptCount: reviewTrackingInfo.promptCount,
    };
  }

  /**
   * セッションカウントをリセット（デバッグ用）
   */
  async resetSessionCount(): Promise<boolean> {
    return this.setNumberSetting(SETTINGS_KEYS.SESSION_COMPLETED_COUNT, 0);
  }

  // ============================================
  // ヘルパー
  // ============================================

  /**
   * 今日の日付文字列を取得（YYYY-MM-DD形式）
   */
  private getTodayDateString(): string {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }
}

// シングルトンインスタンスをエクスポート
export const settingsRepository = SettingsRepository.getInstance();
