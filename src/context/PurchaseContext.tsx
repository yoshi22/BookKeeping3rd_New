/**
 * 購入コンテキスト
 * IAP（アプリ内課金）の状態をグローバルに管理
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Platform } from "react-native";
import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Product,
  type Purchase,
  type PurchaseError,
} from "react-native-iap";
import { settingsRepository } from "@/data/repositories/settings-repository";
import { IAP_PRODUCTS, IAP_PRODUCT_IDS } from "@/config/monetization";
import type { PurchaseContextType, PurchaseState } from "@/types/monetization";
import {
  logPurchaseStarted,
  logPurchaseSuccess,
  logPurchaseFailed,
  logPurchaseRestored,
} from "@/services/analytics-service";
import { logger } from "@/utils/logger";

/**
 * 購入コンテキストのデフォルト値
 */
const defaultPurchaseContext: PurchaseContextType = {
  purchaseState: "unknown",
  isLoading: true,
  isPremium: false,
  purchaseRemoveAds: async () => false,
  restorePurchases: async () => false,
  error: null,
  clearError: () => {},
};

const PurchaseContext = createContext<PurchaseContextType>(
  defaultPurchaseContext,
);

/**
 * 購入コンテキストフック
 */
export function usePurchase(): PurchaseContextType {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
}

/**
 * 購入プロバイダーのProps
 */
interface PurchaseProviderProps {
  children: ReactNode;
}

/**
 * 購入プロバイダー
 * アプリ全体で購入状態を管理
 */
export function PurchaseProvider({
  children,
}: PurchaseProviderProps): React.ReactElement {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const isPremium = purchaseState === "premium";

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * IAP接続を初期化
   */
  const initializeIAP = useCallback(async () => {
    try {
      // Web環境ではスキップ
      if (Platform.OS === "web") {
        logger.info("IAP: Web環境のためスキップ");
        setIsLoading(false);
        return;
      }

      const connection = await initConnection();
      logger.info("IAP接続成功", { connection });
      setIsConnected(true);

      // 商品情報を取得
      const availableProducts = await getProducts({ skus: IAP_PRODUCT_IDS });
      setProducts(availableProducts);
      logger.info("IAP商品取得完了", {
        count: availableProducts.length,
        products: availableProducts.map((p: Product) => p.productId),
      });
    } catch (err) {
      logger.error("IAP初期化エラー", err as Error);
      // エラーがあっても続行（無料版として動作）
    }
  }, []);

  /**
   * 保存済み購入状態を読み込み
   */
  const loadPurchaseState = useCallback(async () => {
    try {
      const savedState = await settingsRepository.getPurchaseState();
      setPurchaseState(savedState);
      logger.info("購入状態を読み込み", { state: savedState });
    } catch (err) {
      logger.error("購入状態の読み込みエラー", err as Error);
      setPurchaseState("free");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 購入を処理（トランザクション完了）
   */
  const handlePurchase = useCallback(async (purchase: Purchase) => {
    try {
      const transactionId = purchase.transactionId;

      // 購入状態を保存
      await settingsRepository.setPurchaseState("premium", transactionId);
      setPurchaseState("premium");

      // トランザクションを完了
      await finishTransaction({ purchase, isConsumable: false });

      logPurchaseSuccess(transactionId);
      logger.info("購入完了", { transactionId });

      return true;
    } catch (err) {
      logger.error("購入処理エラー", err as Error);
      return false;
    }
  }, []);

  /**
   * 広告削除を購入
   */
  const purchaseRemoveAds = useCallback(async (): Promise<boolean> => {
    if (!isConnected) {
      setError("ストアに接続できません");
      return false;
    }

    try {
      setIsLoading(true);
      clearError();
      logPurchaseStarted();

      // 購入リクエスト
      await requestPurchase({
        sku: IAP_PRODUCTS.REMOVE_ADS,
      });

      // 購入成功の処理はリスナーで行う
      return true;
    } catch (err) {
      const purchaseError = err as PurchaseError;
      const errorMessage =
        purchaseError.message || "購入処理中にエラーが発生しました";
      setError(errorMessage);
      logPurchaseFailed(errorMessage);
      logger.error("購入エラー", err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, clearError]);

  /**
   * 購入を復元
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!isConnected) {
      setError("ストアに接続できません");
      return false;
    }

    try {
      setIsLoading(true);
      clearError();

      const purchases = await getAvailablePurchases();
      logger.info("購入履歴取得", { count: purchases.length });

      // 広告削除購入を探す
      const removeAdsPurchase = purchases.find(
        (p: Purchase) => p.productId === IAP_PRODUCTS.REMOVE_ADS,
      );

      if (removeAdsPurchase) {
        await settingsRepository.setPurchaseState(
          "premium",
          removeAdsPurchase.transactionId,
        );
        setPurchaseState("premium");
        logPurchaseRestored();
        logger.info("購入復元成功", {
          transactionId: removeAdsPurchase.transactionId,
        });
        return true;
      } else {
        logger.info("復元可能な購入なし");
        return false;
      }
    } catch (err) {
      const errorMessage = "購入の復元中にエラーが発生しました";
      setError(errorMessage);
      logger.error("購入復元エラー", err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, clearError]);

  /**
   * 初期化処理
   */
  useEffect(() => {
    const initialize = async () => {
      await loadPurchaseState();
      await initializeIAP();
    };

    initialize();

    return () => {
      if (isConnected && Platform.OS !== "web") {
        endConnection();
      }
    };
  }, [loadPurchaseState, initializeIAP, isConnected]);

  /**
   * 購入イベントリスナー
   */
  useEffect(() => {
    if (Platform.OS === "web") return;

    // 購入成功リスナー
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        logger.info("購入イベント受信", { productId: purchase.productId });
        if (purchase.productId === IAP_PRODUCTS.REMOVE_ADS) {
          await handlePurchase(purchase);
        }
      },
    );

    // 購入エラーリスナー
    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        // ユーザーキャンセルは通常のエラーとして扱わない
        if (error.code === "E_USER_CANCELLED") {
          logger.info("購入キャンセル");
          return;
        }

        const errorMessage = error.message || "購入エラーが発生しました";
        setError(errorMessage);
        logPurchaseFailed(errorMessage);
        logger.error("購入エラーイベント", new Error(errorMessage));
      },
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, [handlePurchase]);

  const contextValue: PurchaseContextType = {
    purchaseState,
    isLoading,
    isPremium,
    purchaseRemoveAds,
    restorePurchases,
    error,
    clearError,
  };

  return (
    <PurchaseContext.Provider value={contextValue}>
      {children}
    </PurchaseContext.Provider>
  );
}

export default PurchaseContext;
