/**
 * 広告コンテキスト
 * AdMob広告の状態をグローバルに管理
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Platform, AppState, type AppStateStatus } from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import { adService } from "@/services/ad-service";
import { usePurchase } from "@/context/PurchaseContext";
import type { AdContextType } from "@/types/monetization";
import { logger } from "@/utils/logger";

/**
 * 広告コンテキストのデフォルト値
 */
const defaultAdContext: AdContextType = {
  showBannerAd: false,
  isInterstitialReady: false,
  canShowInterstitial: false,
  loadInterstitial: async () => {},
  showInterstitial: async () => false,
  isInitialized: false,
};

const AdContext = createContext<AdContextType>(defaultAdContext);

/**
 * 広告コンテキストフック
 */
export function useAds(): AdContextType {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useAds must be used within an AdProvider");
  }
  return context;
}

/**
 * 広告プロバイダーのProps
 */
interface AdProviderProps {
  children: ReactNode;
}

/**
 * 広告プロバイダー
 * アプリ全体で広告状態を管理
 */
export function AdProvider({ children }: AdProviderProps): React.ReactElement {
  const { isPremium, isLoading: isPurchaseLoading } = usePurchase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInterstitialReady, setIsInterstitialReady] = useState(false);
  const [canShowInterstitialState, setCanShowInterstitialState] =
    useState(false);

  // プレミアムユーザーは広告非表示
  const showBannerAd = !isPremium && isInitialized;

  /**
   * AdMob SDKを初期化
   */
  const initializeAds = useCallback(async () => {
    // Web環境またはプレミアムユーザーはスキップ
    if (Platform.OS === "web") {
      logger.info("AdContext: Web環境のため広告初期化をスキップ");
      setIsInitialized(true);
      return;
    }

    try {
      await mobileAds().initialize();
      setIsInitialized(true);
      logger.info("AdMob SDK初期化完了");
    } catch (error) {
      logger.error("AdMob SDK初期化エラー", error as Error);
      // エラーがあっても続行（広告なしで動作）
      setIsInitialized(true);
    }
  }, []);

  /**
   * インタースティシャル広告を読み込み
   */
  const loadInterstitial = useCallback(async () => {
    // プレミアムユーザーは広告読み込み不要
    if (isPremium) {
      return;
    }

    await adService.loadInterstitial();
    setIsInterstitialReady(adService.isInterstitialReady());

    // 表示可能か確認
    const canShow = await adService.canShowInterstitial();
    setCanShowInterstitialState(canShow && adService.isInterstitialReady());
  }, [isPremium]);

  /**
   * インタースティシャル広告を表示
   */
  const showInterstitial = useCallback(async (): Promise<boolean> => {
    // プレミアムユーザーは広告非表示
    if (isPremium) {
      logger.info("AdContext: プレミアムユーザーのため広告表示スキップ");
      return false;
    }

    const success = await adService.showInterstitial();

    // 状態を更新
    setIsInterstitialReady(adService.isInterstitialReady());
    const canShow = await adService.canShowInterstitial();
    setCanShowInterstitialState(canShow && adService.isInterstitialReady());

    return success;
  }, [isPremium]);

  /**
   * 初期化処理
   */
  useEffect(() => {
    // 購入状態の読み込みが完了してから初期化
    if (!isPurchaseLoading) {
      initializeAds();
    }
  }, [isPurchaseLoading, initializeAds]);

  /**
   * 広告初期化後にインタースティシャルを事前読み込み
   */
  useEffect(() => {
    if (isInitialized && !isPremium) {
      loadInterstitial();
    }
  }, [isInitialized, isPremium, loadInterstitial]);

  /**
   * アプリ状態変化でセッションカウントをリセット
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // アプリがアクティブになった時にセッションカウントをリセット
        // （長時間バックグラウンドからの復帰時）
        adService.resetSessionCount();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * クリーンアップ
   */
  useEffect(() => {
    return () => {
      adService.cleanup();
    };
  }, []);

  const contextValue: AdContextType = {
    showBannerAd,
    isInterstitialReady,
    canShowInterstitial: canShowInterstitialState,
    loadInterstitial,
    showInterstitial,
    isInitialized,
  };

  return (
    <AdContext.Provider value={contextValue}>{children}</AdContext.Provider>
  );
}

export default AdContext;
