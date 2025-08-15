/**
 * アクセシビリティフォーカス管理フック（Phase 4）
 * スクリーンリーダー・キーボードナビゲーション・フォーカストラップ対応
 */

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  UIManager,
  View,
} from "react-native";
import { useAccessibility } from "./useAccessibility";
import { useTheme } from "../context/ThemeContext";

export interface FocusableElement {
  ref: React.RefObject<any>;
  id: string;
  label?: string;
  priority?: number;
  disabled?: boolean;
  onFocus?: () => void;
}

export interface FocusGroup {
  id: string;
  elements: FocusableElement[];
  orientation?: "horizontal" | "vertical" | "grid";
  wrap?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export interface AccessibilityFocusOptions {
  announceOnFocus?: boolean;
  delayBeforeFocus?: number;
  respectReducedMotion?: boolean;
  highlightFocus?: boolean;
}

export function useAccessibilityFocus(options: AccessibilityFocusOptions = {}) {
  const {
    announceOnFocus = true,
    delayBeforeFocus = 100,
    respectReducedMotion = true,
    highlightFocus = true,
  } = options;

  const { isScreenReaderEnabled, isReduceMotionEnabled, isVoiceOverRunning } =
    useAccessibility();

  const { theme } = useTheme();

  const focusGroupsRef = useRef<Map<string, FocusGroup>>(new Map());
  const currentFocusRef = useRef<string | null>(null);
  const focusHistoryRef = useRef<string[]>([]);

  // フォーカスグループの登録
  const registerFocusGroup = useCallback(
    (group: FocusGroup) => {
      focusGroupsRef.current.set(group.id, group);

      // 自動フォーカス処理
      if (group.autoFocus && isScreenReaderEnabled) {
        const firstElement = group.elements
          .filter((el) => !el.disabled)
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];

        if (firstElement) {
          requestAnimationFrame(() => {
            focusElement(firstElement.id, group.id);
          });
        }
      }
    },
    [isScreenReaderEnabled],
  );

  // フォーカスグループの登録解除
  const unregisterFocusGroup = useCallback((groupId: string) => {
    focusGroupsRef.current.delete(groupId);
  }, []);

  // 要素にフォーカスを設定
  const focusElement = useCallback(
    (
      elementId: string,
      groupId?: string,
      options: { announce?: boolean } = {},
    ) => {
      const delay =
        respectReducedMotion && isReduceMotionEnabled ? 0 : delayBeforeFocus;

      setTimeout(() => {
        let targetElement: FocusableElement | undefined;

        if (groupId) {
          const group = focusGroupsRef.current.get(groupId);
          targetElement = group?.elements.find((el) => el.id === elementId);
        } else {
          // 全グループから検索
          for (const group of focusGroupsRef.current.values()) {
            targetElement = group.elements.find((el) => el.id === elementId);
            if (targetElement) break;
          }
        }

        if (
          targetElement &&
          targetElement.ref.current &&
          !targetElement.disabled
        ) {
          try {
            const node = findNodeHandle(targetElement.ref.current);
            if (node) {
              // iOS/Android対応のフォーカス設定
              if (Platform.OS === "ios") {
                AccessibilityInfo.setAccessibilityFocus(node);
              } else {
                UIManager.sendAccessibilityEvent(
                  node,
                  UIManager.AccessibilityEventTypes.typeViewFocused,
                );
              }

              // フォーカス履歴更新
              currentFocusRef.current = elementId;
              focusHistoryRef.current.push(elementId);

              // 履歴制限（最大10件）
              if (focusHistoryRef.current.length > 10) {
                focusHistoryRef.current.shift();
              }

              // カスタムフォーカスハンドラー実行
              targetElement.onFocus?.();

              // アナウンス
              if (
                (announceOnFocus || options.announce) &&
                targetElement.label
              ) {
                AccessibilityInfo.announceForAccessibility(
                  `フォーカス: ${targetElement.label}`,
                );
              }
            }
          } catch (error) {
            console.warn("[AccessibilityFocus] フォーカス設定エラー:", error);
          }
        }
      }, delay);
    },
    [
      delayBeforeFocus,
      respectReducedMotion,
      isReduceMotionEnabled,
      announceOnFocus,
    ],
  );

  // 次の要素にフォーカス移動
  const focusNext = useCallback(
    (groupId: string) => {
      const group = focusGroupsRef.current.get(groupId);
      if (!group) return;

      const currentIndex = group.elements.findIndex(
        (el) => el.id === currentFocusRef.current,
      );

      const enabledElements = group.elements.filter((el) => !el.disabled);
      const enabledCurrentIndex = enabledElements.findIndex(
        (el) => el.id === currentFocusRef.current,
      );

      let nextIndex = enabledCurrentIndex + 1;

      if (nextIndex >= enabledElements.length) {
        if (group.wrap) {
          nextIndex = 0;
        } else if (group.trapFocus) {
          return; // フォーカストラップが有効な場合は移動しない
        } else {
          return;
        }
      }

      const nextElement = enabledElements[nextIndex];
      if (nextElement) {
        focusElement(nextElement.id, groupId);
      }
    },
    [focusElement],
  );

  // 前の要素にフォーカス移動
  const focusPrevious = useCallback(
    (groupId: string) => {
      const group = focusGroupsRef.current.get(groupId);
      if (!group) return;

      const enabledElements = group.elements.filter((el) => !el.disabled);
      const enabledCurrentIndex = enabledElements.findIndex(
        (el) => el.id === currentFocusRef.current,
      );

      let prevIndex = enabledCurrentIndex - 1;

      if (prevIndex < 0) {
        if (group.wrap) {
          prevIndex = enabledElements.length - 1;
        } else if (group.trapFocus) {
          return;
        } else {
          return;
        }
      }

      const prevElement = enabledElements[prevIndex];
      if (prevElement) {
        focusElement(prevElement.id, groupId);
      }
    },
    [focusElement],
  );

  // グリッドナビゲーション（上下左右）
  const focusDirection = useCallback(
    (groupId: string, direction: "up" | "down" | "left" | "right") => {
      const group = focusGroupsRef.current.get(groupId);
      if (!group || group.orientation !== "grid") return;

      // グリッドナビゲーションの実装は必要に応じて拡張
      // 現在は単純な次/前ナビゲーションにフォールバック
      if (direction === "right" || direction === "down") {
        focusNext(groupId);
      } else if (direction === "left" || direction === "up") {
        focusPrevious(groupId);
      }
    },
    [focusNext, focusPrevious],
  );

  // フォーカス履歴を戻る
  const focusBack = useCallback(() => {
    const history = focusHistoryRef.current;
    if (history.length > 1) {
      // 現在のフォーカスを除く最新の履歴
      history.pop(); // 現在のフォーカスを削除
      const previousElementId = history[history.length - 1];

      if (previousElementId) {
        focusElement(previousElementId);
      }
    }
  }, [focusElement]);

  // アクセシビリティアナウンス
  const announce = useCallback(
    (message: string, priority: "high" | "low" = "high") => {
      if (isScreenReaderEnabled) {
        // iOSの場合は優先度を考慮
        if (Platform.OS === "ios" && priority === "high") {
          AccessibilityInfo.announceForAccessibility(message);
        } else {
          AccessibilityInfo.announceForAccessibility(message);
        }
      }
    },
    [isScreenReaderEnabled],
  );

  // フォーカス可視化スタイル
  const getFocusStyle = useCallback(
    (isFocused: boolean) => {
      if (!highlightFocus || !isFocused) return {};

      return {
        borderWidth: 2,
        borderColor: theme.colors.focus,
        borderRadius: 4,
        ...theme.shadows.small,
      };
    },
    [highlightFocus, theme],
  );

  // キーボードイベントハンドラー
  const handleKeyPress = useCallback(
    (event: any, groupId: string, elementId: string) => {
      const { key } = event.nativeEvent || event;

      switch (key) {
        case "Tab":
          event.preventDefault();
          if (event.shiftKey) {
            focusPrevious(groupId);
          } else {
            focusNext(groupId);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          focusDirection(groupId, "up");
          break;
        case "ArrowDown":
          event.preventDefault();
          focusDirection(groupId, "down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          focusDirection(groupId, "left");
          break;
        case "ArrowRight":
          event.preventDefault();
          focusDirection(groupId, "right");
          break;
        case "Enter":
        case " ":
          // スペースキーとエンターキーはコンポーネント側で処理
          break;
        case "Escape":
          if (focusHistoryRef.current.length > 1) {
            focusBack();
          }
          break;
      }
    },
    [focusNext, focusPrevious, focusDirection, focusBack],
  );

  // 現在のフォーカス状態
  const focusState = useMemo(
    () => ({
      currentFocus: currentFocusRef.current,
      focusHistory: [...focusHistoryRef.current],
      isScreenReaderActive: isScreenReaderEnabled,
      isVoiceOverActive: isVoiceOverRunning,
    }),
    [isScreenReaderEnabled, isVoiceOverRunning],
  );

  return {
    // フォーカスグループ管理
    registerFocusGroup,
    unregisterFocusGroup,

    // フォーカス制御
    focusElement,
    focusNext,
    focusPrevious,
    focusDirection,
    focusBack,

    // ユーティリティ
    announce,
    getFocusStyle,
    handleKeyPress,

    // 状態
    focusState,

    // アクセシビリティ情報
    isScreenReaderEnabled,
    isVoiceOverRunning,
  };
}

/**
 * フォーカス可能な要素のコンポーネント
 */
export const FocusableView = React.forwardRef<
  View,
  {
    focusId: string;
    groupId: string;
    children: React.ReactNode;
    onFocus?: () => void;
    disabled?: boolean;
    priority?: number;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    accessibilityHint?: string;
    style?: any;
  }
>(
  (
    {
      focusId,
      groupId,
      children,
      onFocus,
      disabled = false,
      priority = 0,
      accessibilityLabel,
      accessibilityRole = "button",
      accessibilityHint,
      style,
      ...props
    },
    ref,
  ) => {
    const { getFocusStyle, handleKeyPress, focusState } =
      useAccessibilityFocus();

    const isFocused = focusState.currentFocus === focusId;
    const focusStyle = getFocusStyle(isFocused);

    return (
      <View
        ref={ref}
        accessible={true}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        onAccessibilityFocus={onFocus}
        onKeyPress={(event) => handleKeyPress(event, groupId, focusId)}
        style={[style, focusStyle]}
        {...props}
      >
        {children}
      </View>
    );
  },
);

FocusableView.displayName = "FocusableView";
