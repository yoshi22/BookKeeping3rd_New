/**
 * アクセシビリティフック（Phase 1）
 * WCAG 2.2準拠のアクセシビリティ機能を提供
 */

import { useState, useEffect } from "react";
import { Platform, AccessibilityInfo, Appearance } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { AccessibilityColors } from "../theme/colors";

export interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isHighContrastEnabled: boolean;
  isReduceMotionEnabled: boolean;
  preferredColorScheme: "light" | "dark" | "auto";
  isKeyboardNavigationActive: boolean;
}

export interface AccessibilityHelpers {
  getFocusColor: (isHighContrast?: boolean) => string;
  getOptimalTextColor: (backgroundColor: string) => string;
  isColorContrastCompliant: (foreground: string, background: string) => boolean;
  getAccessibilityProps: (
    label: string,
    hint?: string,
    role?: string,
  ) => object;
  announceForScreenReader: (message: string) => void;
}

export function useAccessibility(): AccessibilityState & AccessibilityHelpers {
  const { theme } = useTheme();

  // アクセシビリティ状態
  const [accessibilityState, setAccessibilityState] =
    useState<AccessibilityState>({
      isScreenReaderEnabled: false,
      isHighContrastEnabled: false,
      isReduceMotionEnabled: false,
      preferredColorScheme: "auto",
      isKeyboardNavigationActive: false,
    });

  useEffect(() => {
    // スクリーンリーダーの検出
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setAccessibilityState((prev) => ({
          ...prev,
          isScreenReaderEnabled: isEnabled,
        }));
      } catch (error) {
        console.warn("Failed to check screen reader status:", error);
      }
    };

    // 色彩設定の検出
    const checkColorScheme = () => {
      const colorScheme = Appearance.getColorScheme();
      setAccessibilityState((prev) => ({
        ...prev,
        preferredColorScheme: colorScheme || "light",
      }));
    };

    // ハイコントラストモードの検出（iOS）
    const checkHighContrast = async () => {
      if (Platform.OS === "ios") {
        try {
          // iOS高コントラストAPIの利用可能性をチェック
          if (AccessibilityInfo.isHighContrastTextEnabled) {
            const isHighContrast =
              await AccessibilityInfo.isHighContrastTextEnabled();
            setAccessibilityState((prev) => ({
              ...prev,
              isHighContrastEnabled: isHighContrast || false,
            }));
          }
        } catch (error) {
          console.warn("Failed to check high contrast status:", error);
        }
      }
    };

    // モーション設定の検出（iOS）
    const checkReduceMotion = async () => {
      if (Platform.OS === "ios") {
        try {
          // Reduce Motion APIの利用可能性をチェック
          if (AccessibilityInfo.isReduceMotionEnabled) {
            const isReduceMotion =
              await AccessibilityInfo.isReduceMotionEnabled();
            setAccessibilityState((prev) => ({
              ...prev,
              isReduceMotionEnabled: isReduceMotion || false,
            }));
          }
        } catch (error) {
          console.warn("Failed to check reduce motion status:", error);
        }
      }
    };

    // 初期チェック
    checkScreenReader();
    checkColorScheme();
    checkHighContrast();
    checkReduceMotion();

    // リスナーの設定
    const screenReaderListener = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (isEnabled) => {
        setAccessibilityState((prev) => ({
          ...prev,
          isScreenReaderEnabled: isEnabled,
        }));
      },
    );

    const colorSchemeListener = Appearance.addChangeListener(
      ({ colorScheme }) => {
        setAccessibilityState((prev) => ({
          ...prev,
          preferredColorScheme: colorScheme || "light",
        }));
      },
    );

    // 高コントラストリスナー（iOS）- API制限のため基本的なリスナーを使用
    const highContrastListener =
      Platform.OS === "ios" && AccessibilityInfo.addEventListener
        ? null // 現在のReact Native版では高コントラスト変更イベントは未対応
        : null;

    // Reduce Motionリスナー（iOS）- API制限のため基本的なリスナーを使用
    const reduceMotionListener =
      Platform.OS === "ios" && AccessibilityInfo.addEventListener
        ? null // 現在のReact Native版ではReduce Motion変更イベントは未対応
        : null;

    // クリーンアップ
    return () => {
      screenReaderListener?.remove?.();
      colorSchemeListener?.remove?.();
      highContrastListener?.remove?.();
      reduceMotionListener?.remove?.();
    };
  }, []);

  // ヘルパー関数
  const getFocusColor = (isHighContrast?: boolean): string => {
    const useHighContrast =
      isHighContrast ?? accessibilityState.isHighContrastEnabled;
    return AccessibilityColors.getFocusColor(
      useHighContrast,
      theme?.name === "dark" ? "dark" : "light",
    );
  };

  const getOptimalTextColor = (backgroundColor: string): string => {
    return AccessibilityColors.getOptimalTextColor(
      backgroundColor,
      theme?.name === "dark" ? "dark" : "light",
    );
  };

  const isColorContrastCompliant = (
    foreground: string,
    background: string,
  ): boolean => {
    return AccessibilityColors.isWCAGCompliant(foreground, background, "AA");
  };

  const getAccessibilityProps = (
    label: string,
    hint?: string,
    role?: string,
  ) => {
    const props: any = {
      accessible: true,
      accessibilityLabel: label,
    };

    if (hint) {
      props.accessibilityHint = hint;
    }

    if (role) {
      props.accessibilityRole = role;
    }

    // スクリーンリーダー対応
    if (accessibilityState.isScreenReaderEnabled) {
      props.importantForAccessibility = "yes";
    }

    return props;
  };

  const announceForScreenReader = (message: string): void => {
    if (accessibilityState.isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  };

  return {
    ...accessibilityState,
    getFocusColor,
    getOptimalTextColor,
    isColorContrastCompliant,
    getAccessibilityProps,
    announceForScreenReader,
  };
}

/**
 * フォーカス管理フック
 * キーボードナビゲーション対応
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const { getFocusColor } = useAccessibility();

  const getFocusStyle = (
    elementId: string,
    isHighContrast: boolean = false,
  ) => {
    if (focusedElement !== elementId) return {};

    return {
      borderWidth: 2,
      borderColor: getFocusColor(isHighContrast),
      borderRadius: 4,
      outlineColor: getFocusColor(isHighContrast), // Web対応
      outlineWidth: 2,
      outlineStyle: "solid",
    };
  };

  const setFocus = (elementId: string) => {
    setFocusedElement(elementId);
  };

  const clearFocus = () => {
    setFocusedElement(null);
  };

  return {
    focusedElement,
    getFocusStyle,
    setFocus,
    clearFocus,
  };
}

/**
 * Dynamic Type対応フック（iOS）
 * ユーザーの文字サイズ設定に応じてフォントサイズを調整
 */
export function useDynamicType() {
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    if (Platform.OS === "ios") {
      // iOS Dynamic Type対応
      const updateFontScale = async () => {
        try {
          // カテゴリに基づいてスケール計算
          const scaleMap: Record<string, number> = {
            extraSmall: 0.8,
            small: 0.85,
            medium: 0.9,
            large: 1.0, // デフォルト
            extraLarge: 1.15,
            extraExtraLarge: 1.3,
            extraExtraExtraLarge: 1.5,
            accessibilityMedium: 1.6,
            accessibilityLarge: 1.8,
            accessibilityExtraLarge: 2.0,
            accessibilityExtraExtraLarge: 2.3,
            accessibilityExtraExtraExtraLarge: 2.6,
          };

          // Dynamic Type APIが利用可能かチェック
          if (AccessibilityInfo.getContentSizeCategory) {
            const scale = await AccessibilityInfo.getContentSizeCategory();
            setFontScale(scaleMap[scale as string] || 1.0);
          } else {
            setFontScale(1.0); // フォールバック
          }
        } catch (error) {
          console.warn("Failed to get font scale:", error);
          setFontScale(1.0); // エラー時はデフォルト
        }
      };

      updateFontScale();

      // Dynamic Type変更のリスナー
      const listener = AccessibilityInfo.addEventListener?.(
        "boldTextChanged", // closest available event
        updateFontScale,
      );

      return () => listener?.remove?.();
    }
  }, []);

  const getScaledFontSize = (baseFontSize: number): number => {
    return Math.round(baseFontSize * fontScale);
  };

  return {
    fontScale,
    getScaledFontSize,
  };
}
