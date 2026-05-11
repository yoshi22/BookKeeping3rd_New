/**
 * 学習セッション結果画面
 * 10問完了後に表示される結果サマリー
 */

import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SessionResultScreen } from "@/components/session/SessionResultScreen";
import { usePurchase } from "@/context/PurchaseContext";
import { useAds } from "@/context/AdContext";
import { reviewPromptService } from "@/services/review-prompt-service";
import { settingsRepository } from "@/data/repositories/settings-repository";
import type { SessionResult } from "@/types/monetization";
import { logger } from "@/utils/logger";

export default function LearningSessionResultRoute() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isPremium, purchaseRemoveAds, canPurchaseRemoveAds } = usePurchase();
  const { showInterstitial, canShowInterstitial } = useAds();

  // セッション結果をパラメータから復元
  const sessionResult: SessionResult = {
    sessionId: (params.sessionId as string) || `learning-${Date.now()}`,
    totalQuestions: Number(params.totalQuestions) || 10,
    correctAnswers: Number(params.correctAnswers) || 0,
    incorrectAnswers: Number(params.incorrectAnswers) || 0,
    accuracy: Number(params.accuracy) || 0,
    totalTimeMs: Number(params.totalTimeMs) || 0,
    averageTimeMs: Number(params.averageTimeMs) || 0,
    sessionType: "learning",
  };

  // セッション完了時にレビュー依頼を試行
  useEffect(() => {
    const tryReviewPrompt = async () => {
      try {
        // セッション完了回数を取得
        const sessionCount =
          await settingsRepository.getSessionCompletedCount();
        // レビュー依頼を試行
        await reviewPromptService.tryShowReviewPromptAfterSession(sessionCount);
      } catch (error) {
        logger.error("レビュー依頼の表示エラー", error as Error);
      }
    };

    tryReviewPrompt();
  }, []);

  // 次の10問へ
  const handleNextSession = async () => {
    // プレミアムでない場合、インタースティシャル広告を表示
    if (!isPremium && canShowInterstitial) {
      await showInterstitial();
    }

    // 学習画面に戻る
    router.replace("/(tabs)/learning");
  };

  // 終了
  const handleFinish = () => {
    router.replace("/(tabs)/learning");
  };

  // 広告非表示購入
  const handlePurchaseRemoveAds = async () => {
    await purchaseRemoveAds();
  };

  return (
    <SessionResultScreen
      result={sessionResult}
      onNextSession={handleNextSession}
      onFinish={handleFinish}
      onPurchaseRemoveAds={
        !isPremium && canPurchaseRemoveAds ? handlePurchaseRemoveAds : undefined
      }
    />
  );
}
