/**
 * 視覚・聴覚サポートフック（Phase 4）
 * 音声フィードバック・視覚的アナウンス・高コントラストモード対応
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Vibration, Alert } from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "../context/ThemeContext";
import { useAccessibility } from "./useAccessibility";
import { useScreenReaderOptimization } from "./useScreenReaderOptimization";

export interface AudioFeedbackOptions {
  enableSoundEffects?: boolean;
  enableHapticFeedback?: boolean;
  enableVisualFeedback?: boolean;
  soundVolume?: number;
  hapticIntensity?: "light" | "medium" | "heavy";
}

export interface VisualFeedbackOptions {
  type: "success" | "error" | "warning" | "info" | "navigation" | "action";
  duration?: number;
  position?: "top" | "center" | "bottom";
  showIcon?: boolean;
  animate?: boolean;
}

export interface SoundEffect {
  id: string;
  name: string;
  file: any; // Expo Audio source
  duration: number;
  category: "ui" | "feedback" | "navigation" | "alert";
}

export function useVisualAudioSupport(options: AudioFeedbackOptions = {}) {
  const {
    enableSoundEffects = true,
    enableHapticFeedback = true,
    enableVisualFeedback = true,
    soundVolume = 0.7,
    hapticIntensity = "medium",
  } = options;

  const { theme, isDark } = useTheme();
  const { isReduceMotionEnabled, isScreenReaderEnabled } = useAccessibility();
  const { announceWithContext } = useScreenReaderOptimization();

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [visualFeedbacks, setVisualFeedbacks] = useState<
    Array<{ id: string; options: VisualFeedbackOptions; timestamp: number }>
  >([]);
  const soundsRef = useRef<Map<string, Audio.Sound>>(new Map());
  const feedbackTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 音声システムの初期化
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (enableSoundEffects) {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          setIsAudioEnabled(true);
        }
      } catch (error) {
        console.warn("[VisualAudioSupport] 音声初期化エラー:", error);
        setIsAudioEnabled(false);
      }
    };

    initializeAudio();

    return () => {
      // クリーンアップ
      soundsRef.current.forEach(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.warn("[VisualAudioSupport] 音声クリーンアップエラー:", error);
        }
      });
      soundsRef.current.clear();

      feedbackTimeoutRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      feedbackTimeoutRef.current.clear();
    };
  }, [enableSoundEffects]);

  // サウンドエフェクトの読み込み
  const loadSoundEffect = useCallback(
    async (effect: SoundEffect) => {
      if (!isAudioEnabled || !enableSoundEffects) return null;

      try {
        const { sound } = await Audio.Sound.createAsync(effect.file, {
          shouldPlay: false,
          volume: soundVolume,
        });

        soundsRef.current.set(effect.id, sound);
        return sound;
      } catch (error) {
        console.warn(
          `[VisualAudioSupport] サウンドエフェクト読み込みエラー (${effect.name}):`,
          error,
        );
        return null;
      }
    },
    [isAudioEnabled, enableSoundEffects, soundVolume],
  );

  // サウンドエフェクトの再生
  const playSoundEffect = useCallback(
    async (effectId: string, options: { volume?: number } = {}) => {
      if (!isAudioEnabled || !enableSoundEffects) return;

      const sound = soundsRef.current.get(effectId);
      if (sound) {
        try {
          await sound.setVolumeAsync(options.volume || soundVolume);
          await sound.replayAsync();
        } catch (error) {
          console.warn(
            `[VisualAudioSupport] サウンド再生エラー (${effectId}):`,
            error,
          );
        }
      }
    },
    [isAudioEnabled, enableSoundEffects, soundVolume],
  );

  // ハプティックフィードバック
  const triggerHapticFeedback = useCallback(
    (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => {
      if (!enableHapticFeedback) return;

      try {
        if (Platform.OS === "ios") {
          // iOS HapticFeedback
          const { HapticFeedback } = require("expo-haptics");

          switch (type) {
            case "light":
              HapticFeedback.impactAsync(
                HapticFeedback.ImpactFeedbackStyle.Light,
              );
              break;
            case "medium":
              HapticFeedback.impactAsync(
                HapticFeedback.ImpactFeedbackStyle.Medium,
              );
              break;
            case "heavy":
              HapticFeedback.impactAsync(
                HapticFeedback.ImpactFeedbackStyle.Heavy,
              );
              break;
            case "success":
              HapticFeedback.notificationAsync(
                HapticFeedback.NotificationFeedbackType.Success,
              );
              break;
            case "warning":
              HapticFeedback.notificationAsync(
                HapticFeedback.NotificationFeedbackType.Warning,
              );
              break;
            case "error":
              HapticFeedback.notificationAsync(
                HapticFeedback.NotificationFeedbackType.Error,
              );
              break;
          }
        } else {
          // Android バイブレーション
          const patterns = {
            light: [0, 50],
            medium: [0, 100],
            heavy: [0, 200],
            success: [0, 50, 50, 50],
            warning: [0, 100, 100, 100],
            error: [0, 200, 100, 200],
          };
          Vibration.vibrate(patterns[type]);
        }
      } catch (error) {
        console.warn(
          "[VisualAudioSupport] ハプティックフィードバックエラー:",
          error,
        );
      }
    },
    [enableHapticFeedback],
  );

  // 視覚的フィードバックの表示
  const showVisualFeedback = useCallback(
    (options: VisualFeedbackOptions & { message?: string }) => {
      if (!enableVisualFeedback) return;

      const feedbackId = `feedback_${Date.now()}_${Math.random()}`;
      const duration = options.duration || 3000;

      // 視覚的フィードバックを状態に追加
      setVisualFeedbacks((prev) => [
        ...prev,
        {
          id: feedbackId,
          options,
          timestamp: Date.now(),
        },
      ]);

      // スクリーンリーダー用のアナウンス
      if (isScreenReaderEnabled && options.message) {
        const priority =
          options.type === "error"
            ? "assertive"
            : options.type === "warning"
              ? "high"
              : "medium";

        announceWithContext(options.message, {
          priority: priority as any,
          context: false,
        });
      }

      // 自動削除タイマー
      const timeout = setTimeout(() => {
        setVisualFeedbacks((prev) =>
          prev.filter((feedback) => feedback.id !== feedbackId),
        );
        feedbackTimeoutRef.current.delete(feedbackId);
      }, duration);

      feedbackTimeoutRef.current.set(feedbackId, timeout);

      return feedbackId;
    },
    [enableVisualFeedback, isScreenReaderEnabled, announceWithContext],
  );

  // 統合フィードバック（音声・ハプティック・視覚を同時実行）
  const triggerIntegratedFeedback = useCallback(
    (
      type: "success" | "error" | "warning" | "info" | "navigation" | "action",
      options: {
        message?: string;
        soundEffectId?: string;
        visualPosition?: "top" | "center" | "bottom";
        skipHaptic?: boolean;
        skipSound?: boolean;
        skipVisual?: boolean;
      } = {},
    ) => {
      const {
        message,
        soundEffectId,
        visualPosition = "center",
        skipHaptic = false,
        skipSound = false,
        skipVisual = false,
      } = options;

      // ハプティックフィードバック
      if (!skipHaptic) {
        triggerHapticFeedback(
          type === "navigation" ? "light" : type === "action" ? "medium" : type,
        );
      }

      // サウンドエフェクト
      if (!skipSound && soundEffectId) {
        playSoundEffect(soundEffectId);
      }

      // 視覚的フィードバック
      if (!skipVisual) {
        showVisualFeedback({
          type,
          message,
          position: visualPosition,
          showIcon: true,
          animate: !isReduceMotionEnabled,
        });
      }
    },
    [
      triggerHapticFeedback,
      playSoundEffect,
      showVisualFeedback,
      isReduceMotionEnabled,
    ],
  );

  // CBT問題専用のフィードバック
  const triggerCBTFeedback = useCallback(
    (
      action:
        | "answer_correct"
        | "answer_incorrect"
        | "question_navigate"
        | "form_submit"
        | "hint_show",
      options: {
        questionType?: "journal" | "ledger" | "trial_balance";
        customMessage?: string;
      } = {},
    ) => {
      const { questionType, customMessage } = options;

      const feedbackConfig = {
        answer_correct: {
          type: "success" as const,
          message: customMessage || "正解です！",
          soundId: "success",
          haptic: "success" as const,
        },
        answer_incorrect: {
          type: "error" as const,
          message: customMessage || "不正解です。もう一度確認してください。",
          soundId: "error",
          haptic: "error" as const,
        },
        question_navigate: {
          type: "navigation" as const,
          message: customMessage || "問題を移動しました",
          soundId: "navigation",
          haptic: "light" as const,
        },
        form_submit: {
          type: "action" as const,
          message: customMessage || "解答を送信しました",
          soundId: "submit",
          haptic: "medium" as const,
        },
        hint_show: {
          type: "info" as const,
          message: customMessage || "ヒントを表示しました",
          soundId: "info",
          haptic: "light" as const,
        },
      };

      const config = feedbackConfig[action];

      triggerIntegratedFeedback(config.type, {
        message: config.message,
        soundEffectId: config.soundId,
      });

      // 問題タイプ固有のフィードバック
      if (questionType && action === "answer_correct") {
        const typeMessages = {
          journal: "仕訳問題正解！",
          ledger: "帳簿問題正解！",
          trial_balance: "試算表問題正解！",
        };

        setTimeout(() => {
          if (isScreenReaderEnabled) {
            announceWithContext(typeMessages[questionType], {
              priority: "medium",
              delay: 500,
            });
          }
        }, 1000);
      }
    },
    [triggerIntegratedFeedback, isScreenReaderEnabled, announceWithContext],
  );

  // 視覚的インジケーターのスタイル取得
  const getVisualIndicatorStyle = useCallback(
    (type: VisualFeedbackOptions["type"]) => {
      const baseStyle = {
        padding: 12,
        borderRadius: 8,
        minHeight: 44, // アクセシビリティ対応
        justifyContent: "center" as const,
        alignItems: "center" as const,
        marginVertical: 4,
      };

      const typeStyles = {
        success: {
          backgroundColor: theme.colors.success,
          borderColor: theme.colors.successBorder,
        },
        error: {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.errorBorder,
        },
        warning: {
          backgroundColor: theme.colors.warning,
          borderColor: theme.colors.warningBorder,
        },
        info: {
          backgroundColor: theme.colors.info,
          borderColor: theme.colors.infoBorder,
        },
        navigation: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        action: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primaryBorder,
        },
      };

      return {
        ...baseStyle,
        ...typeStyles[type],
        borderWidth: 1,
        ...theme.shadows.small,
      };
    },
    [theme],
  );

  // 音声説明の生成
  const generateAudioDescription = useCallback(
    (
      context: "form" | "navigation" | "result" | "help",
      details: Record<string, any>,
    ) => {
      const descriptions = {
        form: `フォーム入力中。${details.fieldName || ""}フィールドにフォーカスしています。`,
        navigation: `${details.screenName || ""}画面に移動しました。${details.availableActions ? `利用可能な操作: ${details.availableActions.join(", ")}` : ""}`,
        result: `解答結果: ${details.isCorrect ? "正解" : "不正解"}。${details.explanation || ""}`,
        help: `ヘルプ情報: ${details.helpText || ""}`,
      };

      return descriptions[context] || "";
    },
    [],
  );

  // デバッグ・テスト用のフィードバック
  const testAllFeedbacks = useCallback(() => {
    if (__DEV__) {
      console.log("[VisualAudioSupport] 全フィードバックテスト開始");

      const tests = [
        { type: "success" as const, message: "成功テスト" },
        { type: "error" as const, message: "エラーテスト" },
        { type: "warning" as const, message: "警告テスト" },
        { type: "info" as const, message: "情報テスト" },
      ];

      tests.forEach((test, index) => {
        setTimeout(() => {
          triggerIntegratedFeedback(test.type, { message: test.message });
        }, index * 1000);
      });
    }
  }, [triggerIntegratedFeedback]);

  return {
    // 設定状態
    isAudioEnabled,
    enableSoundEffects,
    enableHapticFeedback,
    enableVisualFeedback,

    // 基本フィードバック
    playSoundEffect,
    triggerHapticFeedback,
    showVisualFeedback,
    triggerIntegratedFeedback,

    // CBT専用フィードバック
    triggerCBTFeedback,

    // 視覚的フィードバック管理
    visualFeedbacks,
    getVisualIndicatorStyle,

    // 音声サポート
    loadSoundEffect,
    generateAudioDescription,

    // ユーティリティ
    testAllFeedbacks,

    // アクセシビリティ情報
    isScreenReaderEnabled,
    isReduceMotionEnabled,
  };
}

/**
 * フィードバック表示コンポーネント用のフック
 */
export function useVisualFeedbackRenderer() {
  const { visualFeedbacks, getVisualIndicatorStyle } = useVisualAudioSupport();
  const { theme } = useTheme();

  const renderFeedbackItem = useCallback(
    (feedback: {
      id: string;
      options: VisualFeedbackOptions;
      timestamp: number;
    }) => {
      const style = getVisualIndicatorStyle(feedback.options.type);
      const textColor =
        feedback.options.type === "navigation"
          ? theme.colors.text
          : theme.colors.surface;

      return {
        id: feedback.id,
        style,
        textColor,
        options: feedback.options,
      };
    },
    [getVisualIndicatorStyle, theme.colors.text, theme.colors.surface],
  );

  return {
    visualFeedbacks,
    renderFeedbackItem,
  };
}

/**
 * 音声フィードバック設定フック
 */
export function useAudioSettings() {
  const [settings, setSettings] = useState<AudioFeedbackOptions>({
    enableSoundEffects: true,
    enableHapticFeedback: true,
    enableVisualFeedback: true,
    soundVolume: 0.7,
    hapticIntensity: "medium",
  });

  const updateSetting = useCallback(
    <K extends keyof AudioFeedbackOptions>(
      key: K,
      value: AudioFeedbackOptions[K],
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return {
    settings,
    updateSetting,

    // 便利なゲッター
    isSoundEnabled: settings.enableSoundEffects,
    isHapticEnabled: settings.enableHapticFeedback,
    isVisualEnabled: settings.enableVisualFeedback,
  };
}
