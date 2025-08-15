/**
 * フィードバックアニメーションフック（Phase 2）
 * 成功・エラー・警告・情報のフィードバック強化
 */

import { useRef, useCallback } from "react";
import { Animated, Vibration, Platform } from "react-native";
import { useAccessibility } from "./useAccessibility";

export interface FeedbackAnimations {
  // 成功フィードバック
  successPulse: (config?: AnimationConfig) => Promise<void>;
  successScale: (config?: AnimationConfig) => Promise<void>;
  successGlow: (config?: AnimationConfig) => Promise<void>;

  // エラーフィードバック
  errorShake: (config?: AnimationConfig) => Promise<void>;
  errorFlash: (config?: AnimationConfig) => Promise<void>;
  errorBounce: (config?: AnimationConfig) => Promise<void>;

  // 警告フィードバック
  warningWiggle: (config?: AnimationConfig) => Promise<void>;
  warningPulse: (config?: AnimationConfig) => Promise<void>;

  // 情報フィードバック
  infoSlide: (config?: AnimationConfig) => Promise<void>;
  infoBounce: (config?: AnimationConfig) => Promise<void>;

  // アニメーション値とスタイル
  getAnimatedStyle: () => any;
  reset: () => void;
}

export interface AnimationConfig {
  duration?: number;
  intensity?: number; // アニメーション強度（0-1）
  haptic?: boolean; // ハプティックフィードバック
  repeat?: number; // 繰り返し回数
}

export function useFeedbackAnimations(): FeedbackAnimations {
  // アニメーション値
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const { isReduceMotionEnabled } = useAccessibility();

  // ハプティックフィードバック実行
  const triggerHaptic = useCallback(
    (type: "success" | "error" | "warning" | "info") => {
      if (Platform.OS === "ios") {
        const { HapticFeedback } = require("expo-haptics");
        switch (type) {
          case "success":
            HapticFeedback.notificationAsync(
              HapticFeedback.NotificationFeedbackType.Success,
            );
            break;
          case "error":
            HapticFeedback.notificationAsync(
              HapticFeedback.NotificationFeedbackType.Error,
            );
            break;
          case "warning":
            HapticFeedback.notificationAsync(
              HapticFeedback.NotificationFeedbackType.Warning,
            );
            break;
          case "info":
            HapticFeedback.impactAsync(
              HapticFeedback.ImpactFeedbackStyle.Light,
            );
            break;
        }
      } else {
        // Android向けの振動パターン
        switch (type) {
          case "success":
            Vibration.vibrate([0, 100]);
            break;
          case "error":
            Vibration.vibrate([0, 100, 50, 100]);
            break;
          case "warning":
            Vibration.vibrate([0, 150]);
            break;
          case "info":
            Vibration.vibrate(50);
            break;
        }
      }
    },
    [],
  );

  // 基本アニメーション実行関数
  const animateValue = useCallback(
    (
      animatedValue: Animated.Value,
      toValue: number,
      config: AnimationConfig = {},
    ): Promise<void> => {
      const { duration = 300, repeat = 0 } = config;
      const finalDuration = isReduceMotionEnabled
        ? Math.min(duration, 150)
        : duration;

      return new Promise((resolve) => {
        const animation = Animated.timing(animatedValue, {
          toValue,
          duration: finalDuration,
          useNativeDriver: true,
        });

        if (repeat > 0) {
          Animated.sequence([
            animation,
            ...Array(repeat - 1)
              .fill(0)
              .map(() =>
                Animated.sequence([
                  Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: finalDuration * 0.5,
                    useNativeDriver: true,
                  }),
                  animation,
                ]),
              ),
          ]).start(() => resolve());
        } else {
          animation.start(() => resolve());
        }
      });
    },
    [isReduceMotionEnabled],
  );

  // 成功アニメーション
  const successPulse = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true } = config;

      if (haptic) triggerHaptic("success");

      if (isReduceMotionEnabled) {
        // Reduce Motion: 軽微な透明度変化のみ
        opacity.setValue(0.8);
        await animateValue(opacity, 1, { duration: 200 });
        return;
      }

      // 拡大→縮小のパルス効果
      scale.setValue(1);
      await Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [animateValue, triggerHaptic, isReduceMotionEnabled, scale, opacity],
  );

  const successScale = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true, intensity = 0.2 } = config;

      if (haptic) triggerHaptic("success");

      const scaleValue = 1 + intensity;
      scale.setValue(1);
      await animateValue(scale, scaleValue, config);
      await animateValue(scale, 1, {
        ...config,
        duration: config.duration || 200,
      });
    },
    [animateValue, triggerHaptic, scale],
  );

  const successGlow = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true } = config;

      if (haptic) triggerHaptic("success");

      // 透明度変化でグロー効果をシミュレート
      opacity.setValue(1);
      await Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [triggerHaptic, opacity],
  );

  // エラーアニメーション
  const errorShake = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true, intensity = 10 } = config;

      if (haptic) triggerHaptic("error");

      if (isReduceMotionEnabled) {
        // Reduce Motion: 色変化のみ（透明度で代用）
        opacity.setValue(0.5);
        await animateValue(opacity, 1, { duration: 200 });
        return;
      }

      // 左右に震えるアニメーション
      translateX.setValue(0);
      await Animated.sequence([
        Animated.timing(translateX, {
          toValue: intensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -intensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: intensity * 0.5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [animateValue, triggerHaptic, isReduceMotionEnabled, translateX, opacity],
  );

  const errorFlash = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true } = config;

      if (haptic) triggerHaptic("error");

      // 急激な透明度変化でフラッシュ効果
      opacity.setValue(1);
      await Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [triggerHaptic, opacity],
  );

  const errorBounce = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true, intensity = 0.1 } = config;

      if (haptic) triggerHaptic("error");

      const scaleValue = 1 - intensity;
      scale.setValue(1);
      await Animated.sequence([
        Animated.timing(scale, {
          toValue: scaleValue,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [triggerHaptic, scale],
  );

  // 警告アニメーション
  const warningWiggle = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true, intensity = 2 } = config;

      if (haptic) triggerHaptic("warning");

      if (isReduceMotionEnabled) return;

      // 微妙な回転運動
      rotation.setValue(0);
      await Animated.sequence([
        Animated.timing(rotation, {
          toValue: intensity,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -intensity,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [triggerHaptic, isReduceMotionEnabled, rotation],
  );

  const warningPulse = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true } = config;

      if (haptic) triggerHaptic("warning");

      // ゆっくりとしたパルス効果
      scale.setValue(1);
      await Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [triggerHaptic, scale],
  );

  // 情報アニメーション
  const infoSlide = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true, intensity = 20 } = config;

      if (haptic) triggerHaptic("info");

      if (isReduceMotionEnabled) return;

      // 上から下への軽いスライド
      translateY.setValue(-intensity);
      await animateValue(translateY, 0, { duration: 300 });
    },
    [animateValue, triggerHaptic, isReduceMotionEnabled, translateY],
  );

  const infoBounce = useCallback(
    async (config: AnimationConfig = {}) => {
      const { haptic = true } = config;

      if (haptic) triggerHaptic("info");

      // 軽いバウンス効果
      scale.setValue(1);
      await Animated.spring(scale, {
        toValue: 1.03,
        tension: 400,
        friction: 10,
        useNativeDriver: true,
      }).start();

      await Animated.spring(scale, {
        toValue: 1,
        tension: 400,
        friction: 10,
        useNativeDriver: true,
      }).start();
    },
    [triggerHaptic, scale],
  );

  // アニメーションスタイル取得
  const getAnimatedStyle = useCallback(() => {
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        {
          rotate: rotation.interpolate({
            inputRange: [-360, 360],
            outputRange: ["-360deg", "360deg"],
          }),
        },
      ],
      opacity,
    };
  }, [translateX, translateY, scale, rotation, opacity]);

  // リセット
  const reset = useCallback(() => {
    translateX.setValue(0);
    translateY.setValue(0);
    scale.setValue(1);
    opacity.setValue(1);
    rotation.setValue(0);
  }, [translateX, translateY, scale, opacity, rotation]);

  return {
    successPulse,
    successScale,
    successGlow,
    errorShake,
    errorFlash,
    errorBounce,
    warningWiggle,
    warningPulse,
    infoSlide,
    infoBounce,
    getAnimatedStyle,
    reset,
  };
}

/**
 * フィードバック付きコンポーネントのラッパー
 */
import React, { forwardRef, useImperativeHandle } from "react";

export interface FeedbackAnimatedViewRef {
  triggerSuccess: (config?: AnimationConfig) => Promise<void>;
  triggerError: (config?: AnimationConfig) => Promise<void>;
  triggerWarning: (config?: AnimationConfig) => Promise<void>;
  triggerInfo: (config?: AnimationConfig) => Promise<void>;
  reset: () => void;
}

interface FeedbackAnimatedViewProps {
  children: React.ReactNode;
  style?: any;
  feedbackType?:
    | "pulse"
    | "shake"
    | "scale"
    | "bounce"
    | "glow"
    | "flash"
    | "wiggle"
    | "slide";
}

export const FeedbackAnimatedView = forwardRef<
  FeedbackAnimatedViewRef,
  FeedbackAnimatedViewProps
>(({ children, style, feedbackType = "pulse" }, ref) => {
  const feedbackAnimations = useFeedbackAnimations();

  useImperativeHandle(ref, () => ({
    triggerSuccess: async (config?: AnimationConfig) => {
      feedbackAnimations.reset();
      switch (feedbackType) {
        case "pulse":
          await feedbackAnimations.successPulse(config);
          break;
        case "scale":
          await feedbackAnimations.successScale(config);
          break;
        case "glow":
          await feedbackAnimations.successGlow(config);
          break;
        default:
          await feedbackAnimations.successPulse(config);
      }
    },
    triggerError: async (config?: AnimationConfig) => {
      feedbackAnimations.reset();
      switch (feedbackType) {
        case "shake":
          await feedbackAnimations.errorShake(config);
          break;
        case "flash":
          await feedbackAnimations.errorFlash(config);
          break;
        case "bounce":
          await feedbackAnimations.errorBounce(config);
          break;
        default:
          await feedbackAnimations.errorShake(config);
      }
    },
    triggerWarning: async (config?: AnimationConfig) => {
      feedbackAnimations.reset();
      switch (feedbackType) {
        case "wiggle":
          await feedbackAnimations.warningWiggle(config);
          break;
        case "pulse":
          await feedbackAnimations.warningPulse(config);
          break;
        default:
          await feedbackAnimations.warningPulse(config);
      }
    },
    triggerInfo: async (config?: AnimationConfig) => {
      feedbackAnimations.reset();
      switch (feedbackType) {
        case "slide":
          await feedbackAnimations.infoSlide(config);
          break;
        case "bounce":
          await feedbackAnimations.infoBounce(config);
          break;
        default:
          await feedbackAnimations.infoBounce(config);
      }
    },
    reset: feedbackAnimations.reset,
  }));

  return (
    <Animated.View style={[style, feedbackAnimations.getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
});

FeedbackAnimatedView.displayName = "FeedbackAnimatedView";
