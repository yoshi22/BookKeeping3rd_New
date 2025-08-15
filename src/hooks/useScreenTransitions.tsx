/**
 * 画面遷移アニメーションフック（Phase 2）
 * Expo Router用のカスタム画面遷移アニメーション
 */

import { useRef, useCallback } from "react";
import { Animated, Dimensions, Platform } from "react-native";
import { useAccessibility } from "./useAccessibility";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface TransitionConfig {
  duration?: number;
  easing?: Animated.TimingAnimationConfig["easing"];
  delay?: number;
}

export interface ScreenTransitionAnimations {
  // 基本トランジション
  slideInRight: (config?: TransitionConfig) => Promise<void>;
  slideInLeft: (config?: TransitionConfig) => Promise<void>;
  slideInUp: (config?: TransitionConfig) => Promise<void>;
  slideInDown: (config?: TransitionConfig) => Promise<void>;

  // フェードトランジション
  fadeIn: (config?: TransitionConfig) => Promise<void>;
  fadeOut: (config?: TransitionConfig) => Promise<void>;

  // スケールトランジション
  scaleIn: (config?: TransitionConfig) => Promise<void>;
  scaleOut: (config?: TransitionConfig) => Promise<void>;

  // 学習アプリ特化トランジション
  questionTransition: (config?: TransitionConfig) => Promise<void>;
  reviewTransition: (config?: TransitionConfig) => Promise<void>;
  resultTransition: (config?: TransitionConfig) => Promise<void>;

  // アニメーション値取得
  getTransformStyle: () => any;
  reset: () => void;
}

export function useScreenTransitions(): ScreenTransitionAnimations {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const { isReduceMotionEnabled } = useAccessibility();

  // デフォルト設定
  const defaultConfig: TransitionConfig = {
    duration: isReduceMotionEnabled ? 150 : 300,
    easing: Animated.Bezier(0.25, 0.46, 0.45, 0.94), // easeOutQuart
    delay: 0,
  };

  const animateValue = useCallback(
    (
      animatedValue: Animated.Value,
      toValue: number,
      config?: TransitionConfig,
    ): Promise<void> => {
      const finalConfig = { ...defaultConfig, ...config };

      return new Promise((resolve) => {
        Animated.timing(animatedValue, {
          toValue,
          duration: finalConfig.duration,
          easing: finalConfig.easing,
          delay: finalConfig.delay,
          useNativeDriver: true,
        }).start(() => resolve());
      });
    },
    [defaultConfig],
  );

  // 基本スライドアニメーション
  const slideInRight = useCallback(
    async (config?: TransitionConfig) => {
      translateX.setValue(screenWidth);
      opacity.setValue(1);
      await animateValue(translateX, 0, config);
    },
    [animateValue, translateX, opacity],
  );

  const slideInLeft = useCallback(
    async (config?: TransitionConfig) => {
      translateX.setValue(-screenWidth);
      opacity.setValue(1);
      await animateValue(translateX, 0, config);
    },
    [animateValue, translateX, opacity],
  );

  const slideInUp = useCallback(
    async (config?: TransitionConfig) => {
      translateY.setValue(screenHeight);
      opacity.setValue(1);
      await animateValue(translateY, 0, config);
    },
    [animateValue, translateY, opacity],
  );

  const slideInDown = useCallback(
    async (config?: TransitionConfig) => {
      translateY.setValue(-screenHeight);
      opacity.setValue(1);
      await animateValue(translateY, 0, config);
    },
    [animateValue, translateY, opacity],
  );

  // フェードアニメーション
  const fadeIn = useCallback(
    async (config?: TransitionConfig) => {
      opacity.setValue(0);
      await animateValue(opacity, 1, config);
    },
    [animateValue, opacity],
  );

  const fadeOut = useCallback(
    async (config?: TransitionConfig) => {
      await animateValue(opacity, 0, config);
    },
    [animateValue, opacity],
  );

  // スケールアニメーション
  const scaleIn = useCallback(
    async (config?: TransitionConfig) => {
      scale.setValue(0.8);
      opacity.setValue(0);
      await Promise.all([
        animateValue(scale, 1, config),
        animateValue(opacity, 1, config),
      ]);
    },
    [animateValue, scale, opacity],
  );

  const scaleOut = useCallback(
    async (config?: TransitionConfig) => {
      await Promise.all([
        animateValue(scale, 0.8, config),
        animateValue(opacity, 0, config),
      ]);
    },
    [animateValue, scale, opacity],
  );

  // 学習アプリ特化アニメーション
  const questionTransition = useCallback(
    async (config?: TransitionConfig) => {
      // 新しい問題への遷移：右からスライドイン
      await slideInRight({
        ...config,
        duration: isReduceMotionEnabled ? 200 : 400,
      });
    },
    [slideInRight, isReduceMotionEnabled],
  );

  const reviewTransition = useCallback(
    async (config?: TransitionConfig) => {
      // 復習画面への遷移：下からスライドアップ
      await slideInUp({
        ...config,
        duration: isReduceMotionEnabled ? 250 : 500,
      });
    },
    [slideInUp, isReduceMotionEnabled],
  );

  const resultTransition = useCallback(
    async (config?: TransitionConfig) => {
      // 結果画面への遷移：スケールイン + フェード
      await scaleIn({
        ...config,
        duration: isReduceMotionEnabled ? 200 : 600,
        easing: Animated.Bezier(0.175, 0.885, 0.32, 1.275), // easeOutBack
      });
    },
    [scaleIn, isReduceMotionEnabled],
  );

  // トランスフォームスタイル取得
  const getTransformStyle = useCallback(() => {
    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity,
    };
  }, [translateX, translateY, scale, opacity]);

  // リセット
  const reset = useCallback(() => {
    translateX.setValue(0);
    translateY.setValue(0);
    opacity.setValue(1);
    scale.setValue(1);
  }, [translateX, translateY, opacity, scale]);

  return {
    slideInRight,
    slideInLeft,
    slideInUp,
    slideInDown,
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    questionTransition,
    reviewTransition,
    resultTransition,
    getTransformStyle,
    reset,
  };
}

/**
 * ページトランジション用の高次コンポーネント
 */
import React, { useEffect } from "react";
import { Animated } from "react-native";

interface WithScreenTransitionProps {
  transitionType?:
    | "slideInRight"
    | "slideInLeft"
    | "slideInUp"
    | "slideInDown"
    | "fadeIn"
    | "scaleIn"
    | "questionTransition"
    | "reviewTransition"
    | "resultTransition";
  transitionConfig?: TransitionConfig;
  children: React.ReactNode;
}

export function WithScreenTransition({
  transitionType = "fadeIn",
  transitionConfig,
  children,
}: WithScreenTransitionProps) {
  const transitions = useScreenTransitions();

  useEffect(() => {
    const executeTransition = async () => {
      transitions.reset();

      switch (transitionType) {
        case "slideInRight":
          await transitions.slideInRight(transitionConfig);
          break;
        case "slideInLeft":
          await transitions.slideInLeft(transitionConfig);
          break;
        case "slideInUp":
          await transitions.slideInUp(transitionConfig);
          break;
        case "slideInDown":
          await transitions.slideInDown(transitionConfig);
          break;
        case "fadeIn":
          await transitions.fadeIn(transitionConfig);
          break;
        case "scaleIn":
          await transitions.scaleIn(transitionConfig);
          break;
        case "questionTransition":
          await transitions.questionTransition(transitionConfig);
          break;
        case "reviewTransition":
          await transitions.reviewTransition(transitionConfig);
          break;
        case "resultTransition":
          await transitions.resultTransition(transitionConfig);
          break;
        default:
          await transitions.fadeIn(transitionConfig);
      }
    };

    executeTransition();
  }, [transitionType, transitionConfig, transitions]);

  return (
    <Animated.View style={[{ flex: 1 }, transitions.getTransformStyle()]}>
      {children}
    </Animated.View>
  );
}

/**
 * Expo Router用のスクリーンオプション生成ヘルパー
 */
export function createScreenTransitionOptions(
  transitionType: WithScreenTransitionProps["transitionType"] = "fadeIn",
) {
  return {
    gestureEnabled: Platform.OS === "ios",
    headerShown: false,
    animationTypeForReplace: "push" as const,
    presentation: "card" as const,
    animation:
      transitionType === "slideInUp"
        ? ("slide_from_bottom" as const)
        : transitionType === "slideInDown"
          ? ("slide_from_top" as const)
          : transitionType === "slideInLeft"
            ? ("slide_from_left" as const)
            : ("slide_from_right" as const),
  };
}
