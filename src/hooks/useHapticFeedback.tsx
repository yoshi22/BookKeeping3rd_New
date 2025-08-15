/**
 * ハプティックフィードバックシステム - 簿記3級問題集アプリ
 * UI/UX改善 Phase 1: 触覚フィードバックによるユーザー体験向上
 *
 * iOS・Android両対応の統一ハプティック体験
 * 学習アプリに適した段階的フィードバック設計
 */

import React, { useCallback, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * ハプティックフィードバックの種類定義
 */
export type HapticImpactType = 'light' | 'medium' | 'heavy';
export type HapticNotificationType = 'success' | 'warning' | 'error';
export type HapticSelectionType = 'selection';

/**
 * 学習アプリ特化のハプティックコンテキスト
 */
export type LearningHapticContext = 
  | 'correct_answer'     // 正解時
  | 'incorrect_answer'   // 不正解時
  | 'partial_correct'    // 部分正解時
  | 'question_submit'    // 解答送信時
  | 'level_up'          // レベルアップ時
  | 'streak_milestone'   // ストリーク達成時
  | 'exam_complete'     // 模試完了時
  | 'button_press'      // 一般ボタン押下
  | 'navigation'        // ナビゲーション
  | 'form_validation'   // フォーム検証エラー
  | 'timer_warning'     // 時間警告
  | 'achievement_unlock'; // 実績解除

/**
 * ハプティック設定オプション
 */
export interface HapticSettings {
  enabled: boolean;
  intensity: 'minimal' | 'moderate' | 'full';
  disableInSilentMode: boolean;
  customPatterns: boolean;
}

/**
 * ハプティックフィードバック統合フック
 */
export const useHapticFeedback = () => {
  const [settings, setSettings] = useState<HapticSettings>({
    enabled: true,
    intensity: 'moderate',
    disableInSilentMode: true,
    customPatterns: Platform.OS === 'ios',
  });

  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  // ハプティック機能の可用性チェック
  useEffect(() => {
    checkHapticAvailability();
  }, []);

  const checkHapticAvailability = useCallback(async () => {
    try {
      // Expo Hapticsの基本機能をテスト
      if (Platform.OS === 'ios') {
        setIsAvailable(true); // iOSは基本的にサポート
      } else if (Platform.OS === 'android') {
        // Androidはデバイス依存のため、軽量テストを実行
        try {
          await Haptics.selectionAsync();
          setIsAvailable(true);
        } catch {
          setIsAvailable(false);
        }
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
      setIsAvailable(false);
    }
  }, []);

  /**
   * 基本的なインパクトフィードバック
   */
  const impact = useCallback(async (type: HapticImpactType = 'medium') => {
    if (!settings.enabled || !isAvailable) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      console.warn('Impact haptic failed:', error);
    }
  }, [settings.enabled, isAvailable]);

  /**
   * 通知フィードバック（成功・警告・エラー）
   */
  const notification = useCallback(async (type: HapticNotificationType) => {
    if (!settings.enabled || !isAvailable) return;

    try {
      switch (type) {
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.warn('Notification haptic failed:', error);
    }
  }, [settings.enabled, isAvailable]);

  /**
   * 選択フィードバック（UI要素選択時）
   */
  const selection = useCallback(async () => {
    if (!settings.enabled || !isAvailable) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Selection haptic failed:', error);
    }
  }, [settings.enabled, isAvailable]);

  /**
   * 学習コンテキスト特化フィードバック
   */
  const learningFeedback = useCallback(async (context: LearningHapticContext) => {
    if (!settings.enabled || !isAvailable) return;

    try {
      switch (context) {
        case 'correct_answer':
          // 正解: 心地よい成功フィードバック
          await notification('success');
          break;

        case 'incorrect_answer':
          // 不正解: 優しいエラーフィードバック
          await notification('error');
          break;

        case 'partial_correct':
          // 部分正解: 中程度の警告フィードバック
          await notification('warning');
          break;

        case 'question_submit':
          // 解答送信: 軽いインパクト
          await impact('light');
          break;

        case 'level_up':
          // レベルアップ: 特別なパターン（成功 + 重いインパクト）
          await notification('success');
          setTimeout(() => impact('heavy'), 100);
          break;

        case 'streak_milestone':
          // ストリーク達成: 段階的フィードバック
          await impact('medium');
          setTimeout(() => impact('medium'), 100);
          setTimeout(() => notification('success'), 200);
          break;

        case 'exam_complete':
          // 模試完了: 長めの成功フィードバック
          await notification('success');
          setTimeout(() => impact('heavy'), 150);
          break;

        case 'button_press':
          // 一般ボタン: 選択フィードバック
          await selection();
          break;

        case 'navigation':
          // ナビゲーション: 軽い選択フィードバック
          await selection();
          break;

        case 'form_validation':
          // フォーム検証エラー: 軽いエラー
          await impact('light');
          break;

        case 'timer_warning':
          // 時間警告: 強い警告
          await notification('warning');
          setTimeout(() => impact('heavy'), 100);
          break;

        case 'achievement_unlock':
          // 実績解除: 特別な祝福パターン
          await impact('medium');
          setTimeout(() => notification('success'), 80);
          setTimeout(() => impact('light'), 160);
          break;

        default:
          // フォールバック: 基本的な選択フィードバック
          await selection();
          break;
      }
    } catch (error) {
      console.warn(`Learning haptic failed for context ${context}:`, error);
    }
  }, [settings.enabled, isAvailable, notification, impact, selection]);

  /**
   * カスタムハプティックパターン（iOSのみ）
   */
  const customPattern = useCallback(async (pattern: number[]) => {
    if (!settings.enabled || !isAvailable || Platform.OS !== 'ios') return;

    try {
      // iOS専用のカスタムパターン実装
      // 現在のExpo Hapticsでは直接サポートされていないため、
      // 将来的な拡張のためのプレースホルダー
      for (let i = 0; i < pattern.length; i++) {
        const intensity = pattern[i];
        if (intensity > 0) {
          if (intensity < 0.3) {
            await impact('light');
          } else if (intensity < 0.7) {
            await impact('medium');
          } else {
            await impact('heavy');
          }
        }
        if (i < pattern.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.warn('Custom haptic pattern failed:', error);
    }
  }, [settings.enabled, isAvailable, impact]);

  /**
   * 設定更新
   */
  const updateSettings = useCallback((newSettings: Partial<HapticSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  /**
   * ハプティックの無効化/有効化
   */
  const toggleHaptics = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  /**
   * 強度調整
   */
  const setIntensity = useCallback((intensity: HapticSettings['intensity']) => {
    setSettings(prev => ({ ...prev, intensity }));
  }, []);

  /**
   * プリセットテスト（設定画面用）
   */
  const testHaptics = useCallback(async () => {
    if (!isAvailable) return;

    try {
      // 各種フィードバックのテスト
      await impact('light');
      setTimeout(() => impact('medium'), 200);
      setTimeout(() => impact('heavy'), 400);
      setTimeout(() => notification('success'), 600);
      setTimeout(() => selection(), 800);
    } catch (error) {
      console.warn('Haptic test failed:', error);
    }
  }, [isAvailable, impact, notification, selection]);

  return {
    // 基本フィードバック
    impact,
    notification,
    selection,

    // 学習特化フィードバック
    learningFeedback,

    // カスタムパターン
    customPattern,

    // 設定管理
    settings,
    updateSettings,
    toggleHaptics,
    setIntensity,

    // ユーティリティ
    isAvailable,
    testHaptics,

    // 便利な短縮メソッド
    correct: () => learningFeedback('correct_answer'),
    incorrect: () => learningFeedback('incorrect_answer'),
    submit: () => learningFeedback('question_submit'),
    navigate: () => learningFeedback('navigation'),
    buttonPress: () => learningFeedback('button_press'),
    levelUp: () => learningFeedback('level_up'),
    achievement: () => learningFeedback('achievement_unlock'),
  };
};

/**
 * ハプティック対応ボタンコンポーネント用ヘルパー
 */
export const withHapticFeedback = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
  hapticType: LearningHapticContext = 'button_press'
) => {
  return React.forwardRef<any, T>((props, ref) => {
    const { learningFeedback } = useHapticFeedback();

    const handlePress = useCallback(async (originalOnPress?: () => void) => {
      await learningFeedback(hapticType);
      originalOnPress?.();
    }, [learningFeedback]);

    return (
      <WrappedComponent
        ref={ref}
        {...props}
        onPress={handlePress}
      />
    );
  });
};

/**
 * ハプティック設定のローカルストレージキー
 */
export const HAPTIC_SETTINGS_KEY = '@haptic_settings';

/**
 * デフォルトハプティック設定
 */
export const DEFAULT_HAPTIC_SETTINGS: HapticSettings = {
  enabled: true,
  intensity: 'moderate',
  disableInSilentMode: true,
  customPatterns: Platform.OS === 'ios',
};