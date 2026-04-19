/**
 * バナー広告ラッパーコンポーネント
 * 問題画面下部に固定表示されるAdMobバナー広告
 */

import React, { useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAds } from "@/context/AdContext";
import { AD_UNITS } from "@/config/monetization";
import { logBannerShown, logBannerFailed } from "@/services/analytics-service";
import { logger } from "@/utils/logger";

/**
 * バナー広告ラッパーのProps
 */
interface BannerAdWrapperProps {
  /**
   * カスタムスタイル
   */
  style?: object;
}

/**
 * バナー広告ユニットIDを取得
 */
function getBannerAdUnitId(): string {
  if (Platform.OS === "web") {
    return TestIds.BANNER;
  }

  const adUnitId = AD_UNITS.banner;
  if (!adUnitId) {
    logger.warn("バナー広告ユニットIDが未設定");
    return TestIds.BANNER;
  }
  return adUnitId;
}

/**
 * バナー広告ラッパーコンポーネント
 * プレミアムユーザーには表示されない
 */
export function BannerAdWrapper({
  style,
}: BannerAdWrapperProps): React.ReactElement | null {
  const { showBannerAd, isInitialized } = useAds();
  const [hasError, setHasError] = useState(false);

  /**
   * 広告読み込み成功時
   */
  const handleAdLoaded = useCallback(() => {
    setHasError(false);
    logBannerShown();
    logger.info("バナー広告読み込み完了");
  }, []);

  /**
   * 広告読み込み失敗時
   */
  const handleAdFailed = useCallback((error: Error) => {
    setHasError(true);
    logBannerFailed(error.message || "バナー広告読み込みエラー");
    logger.error("バナー広告読み込みエラー", error);
  }, []);

  // 表示条件: 初期化完了 + バナー表示フラグ + Web以外 + エラーなし
  if (!isInitialized || !showBannerAd || Platform.OS === "web" || hasError) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default BannerAdWrapper;
