/**
 * アクセシビリティ設定コンポーネント（Phase 4）
 * 視覚・聴覚サポート・スクリーンリーダー・ダークモード統合設定
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Slider,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, useAccessibleStyles } from "../../context/ThemeContext";
import { useAccessibility } from "../../hooks/useAccessibility";
import {
  useVisualAudioSupport,
  useAudioSettings,
} from "../../hooks/useVisualAudioSupport";
import { audioFeedbackService } from "../../services/audio-feedback-service";
import { useScreenReaderOptimization } from "../../hooks/useScreenReaderOptimization";

export interface AccessibilitySettingsProps {
  onSettingsChange?: (settings: any) => void;
  showAdvanced?: boolean;
  compactMode?: boolean;
}

export function AccessibilitySettings({
  onSettingsChange,
  showAdvanced = true,
  compactMode = false,
}: AccessibilitySettingsProps) {
  const {
    theme,
    isDark,
    isHighContrastMode,
    setHighContrastMode,
    getOptimalTextColor,
  } = useTheme();
  const { getHighContrastColor, getMinTouchTargetStyle, checkContrast } =
    useAccessibleStyles();
  const {
    isScreenReaderEnabled,
    isVoiceOverRunning,
    isReduceMotionEnabled,
    isLargeTextEnabled,
    checkSystemAccessibility,
  } = useAccessibility();
  const { triggerCBTFeedback, testAllFeedbacks } = useVisualAudioSupport();
  const { settings: audioSettings, updateSetting } = useAudioSettings();
  const { announceWithContext, announceKeyboardHelp } =
    useScreenReaderOptimization();

  // ローカル設定状態
  const [localSettings, setLocalSettings] = useState({
    enableSoundEffects: audioSettings.enableSoundEffects,
    enableHapticFeedback: audioSettings.enableHapticFeedback,
    enableVisualFeedback: audioSettings.enableVisualFeedback,
    soundVolume: audioSettings.soundVolume || 0.7,
    enableScreenReaderOptimizations: true,
    enableKeyboardNavigation: true,
    enableFocusIndicators: true,
    enableHighContrast: isHighContrastMode,
    announceScreenChanges: true,
    showVisualCues: true,
    largeTextMode: false,
    reduceMotionOverride: false,
  });

  // システムアクセシビリティ状態
  const [systemStatus, setSystemStatus] = useState({
    screenReader: isScreenReaderEnabled,
    voiceOver: isVoiceOverRunning,
    reduceMotion: isReduceMotionEnabled,
    largeText: isLargeTextEnabled,
  });

  // 設定変更時の処理
  const handleSettingChange = useCallback(
    async (key: string, value: any) => {
      const newSettings = { ...localSettings, [key]: value };
      setLocalSettings(newSettings);

      // 音声設定の更新
      if (
        [
          "enableSoundEffects",
          "enableHapticFeedback",
          "enableVisualFeedback",
          "soundVolume",
        ].includes(key)
      ) {
        updateSetting(key as any, value);
      }

      // ハイコントラストモードの変更
      if (key === "enableHighContrast") {
        await setHighContrastMode(value);
        await audioFeedbackService.playAccessibilityNotification(
          value ? "high_contrast_on" : "high_contrast_off",
        );
      }

      // スクリーンリーダー用アナウンス
      if (isScreenReaderEnabled) {
        const settingNames = {
          enableSoundEffects: "音声効果",
          enableHapticFeedback: "触覚フィードバック",
          enableVisualFeedback: "視覚的フィードバック",
          enableHighContrast: "ハイコントラストモード",
          enableScreenReaderOptimizations: "スクリーンリーダー最適化",
          enableKeyboardNavigation: "キーボードナビゲーション",
          announceScreenChanges: "画面変更の音声案内",
          showVisualCues: "視覚的手がかり",
        };

        const settingName = settingNames[key] || key;
        const statusText = value ? "有効" : "無効";
        announceWithContext(`${settingName}を${statusText}にしました`, {
          priority: "medium",
          context: false,
        });
      }

      // CBTフィードバックテスト
      if (key === "enableSoundEffects" && value) {
        triggerCBTFeedback("correct");
      }

      onSettingsChange?.(newSettings);
    },
    [
      localSettings,
      updateSetting,
      setHighContrastMode,
      isScreenReaderEnabled,
      announceWithContext,
      triggerCBTFeedback,
      onSettingsChange,
    ],
  );

  // システム状態の更新
  useEffect(() => {
    const updateSystemStatus = async () => {
      const status = await checkSystemAccessibility();
      setSystemStatus({
        screenReader: status.isScreenReaderEnabled,
        voiceOver: status.isVoiceOverRunning,
        reduceMotion: status.isReduceMotionEnabled,
        largeText: status.isLargeTextEnabled,
      });
    };

    updateSystemStatus();
    const interval = setInterval(updateSystemStatus, 5000);
    return () => clearInterval(interval);
  }, [checkSystemAccessibility]);

  // 設定項目コンポーネント
  const SettingItem = ({
    title,
    description,
    value,
    onValueChange,
    type = "switch",
    icon,
    testId,
    disabled = false,
    ...props
  }: {
    title: string;
    description?: string;
    value: any;
    onValueChange: (value: any) => void;
    type?: "switch" | "slider" | "button";
    icon?: string;
    testId?: string;
    disabled?: boolean;
    [key: string]: any;
  }) => {
    const styles = useStyles(theme, compactMode);
    const isHighContrast = isHighContrastMode;

    const containerStyle = [
      styles.settingItem,
      getMinTouchTargetStyle(),
      disabled && styles.disabledItem,
    ];

    const titleColor = getHighContrastColor(
      theme.colors.text,
      theme.colors.contrast.high,
    );

    const renderControl = () => {
      switch (type) {
        case "slider":
          return (
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderValue, { color: titleColor }]}>
                {Math.round(value * 100)}%
              </Text>
              <Slider
                style={styles.slider}
                value={value}
                onValueChange={onValueChange}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.border}
                thumbTintColor={theme.colors.primary}
                accessibilityLabel={`${title} ${Math.round(value * 100)}パーセント`}
                accessibilityRole="adjustable"
                disabled={disabled}
                {...props}
              />
            </View>
          );
        case "button":
          return (
            <TouchableOpacity
              style={[styles.button, disabled && styles.disabledButton]}
              onPress={() => !disabled && onValueChange()}
              accessibilityRole="button"
              accessibilityLabel={title}
              disabled={disabled}
            >
              <Text
                style={[styles.buttonText, { color: theme.colors.primary }]}
              >
                {props.buttonText || "実行"}
              </Text>
            </TouchableOpacity>
          );
        default:
          return (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={
                value ? theme.colors.surface : theme.colors.background
              }
              accessibilityRole="switch"
              accessibilityLabel={`${title} ${value ? "有効" : "無効"}`}
              disabled={disabled}
            />
          );
      }
    };

    return (
      <View style={containerStyle} accessibilityRole="listitem" testID={testId}>
        <View style={styles.settingContent}>
          {icon && (
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={titleColor}
              style={styles.settingIcon}
            />
          )}
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: titleColor }]}>
              {title}
            </Text>
            {description && (
              <Text
                style={[
                  styles.settingDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.settingControl}>{renderControl()}</View>
      </View>
    );
  };

  const styles = useStyles(theme, compactMode);

  return (
    <ScrollView style={styles.container} accessibilityRole="list">
      {/* システムアクセシビリティ状態 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          システム状態
        </Text>

        <View style={styles.statusGrid}>
          <View
            style={[
              styles.statusItem,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <MaterialCommunityIcons
              name={systemStatus.screenReader ? "check-circle" : "close-circle"}
              size={20}
              color={
                systemStatus.screenReader
                  ? theme.colors.success
                  : theme.colors.error
              }
            />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              スクリーンリーダー
            </Text>
          </View>

          <View
            style={[
              styles.statusItem,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <MaterialCommunityIcons
              name={systemStatus.reduceMotion ? "check-circle" : "close-circle"}
              size={20}
              color={
                systemStatus.reduceMotion
                  ? theme.colors.success
                  : theme.colors.warning
              }
            />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              モーション削減
            </Text>
          </View>
        </View>
      </View>

      {/* 音声・触覚フィードバック */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          音声・触覚フィードバック
        </Text>

        <SettingItem
          title="音声効果"
          description="ボタンタップや操作時の音声フィードバック"
          value={localSettings.enableSoundEffects}
          onValueChange={(value) =>
            handleSettingChange("enableSoundEffects", value)
          }
          icon="volume-high"
          testId="sound-effects-toggle"
        />

        {localSettings.enableSoundEffects && (
          <SettingItem
            title="音量"
            description="音声効果の音量レベル"
            value={localSettings.soundVolume}
            onValueChange={(value) => handleSettingChange("soundVolume", value)}
            type="slider"
            icon="volume-medium"
            testId="sound-volume-slider"
          />
        )}

        <SettingItem
          title="触覚フィードバック"
          description="バイブレーションによる操作確認"
          value={localSettings.enableHapticFeedback}
          onValueChange={(value) =>
            handleSettingChange("enableHapticFeedback", value)
          }
          icon="vibrate"
          testId="haptic-feedback-toggle"
        />

        <SettingItem
          title="視覚的フィードバック"
          description="画面上での視覚的な操作確認"
          value={localSettings.enableVisualFeedback}
          onValueChange={(value) =>
            handleSettingChange("enableVisualFeedback", value)
          }
          icon="eye"
          testId="visual-feedback-toggle"
        />
      </View>

      {/* 視覚サポート */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          視覚サポート
        </Text>

        <SettingItem
          title="ハイコントラストモード"
          description="文字と背景のコントラストを強化"
          value={localSettings.enableHighContrast}
          onValueChange={(value) =>
            handleSettingChange("enableHighContrast", value)
          }
          icon="contrast-box"
          testId="high-contrast-toggle"
        />

        <SettingItem
          title="フォーカス表示"
          description="キーボード操作時のフォーカス可視化"
          value={localSettings.enableFocusIndicators}
          onValueChange={(value) =>
            handleSettingChange("enableFocusIndicators", value)
          }
          icon="target"
          testId="focus-indicators-toggle"
        />

        <SettingItem
          title="視覚的手がかり"
          description="アイコンや色による追加情報表示"
          value={localSettings.showVisualCues}
          onValueChange={(value) =>
            handleSettingChange("showVisualCues", value)
          }
          icon="lightbulb-on"
          testId="visual-cues-toggle"
        />
      </View>

      {/* スクリーンリーダー対応 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          スクリーンリーダー対応
        </Text>

        <SettingItem
          title="スクリーンリーダー最適化"
          description="読み上げ内容の詳細化と構造化"
          value={localSettings.enableScreenReaderOptimizations}
          onValueChange={(value) =>
            handleSettingChange("enableScreenReaderOptimizations", value)
          }
          icon="account-voice"
          testId="screen-reader-optimizations-toggle"
          disabled={!systemStatus.screenReader}
        />

        <SettingItem
          title="画面変更の音声案内"
          description="画面遷移時の自動アナウンス"
          value={localSettings.announceScreenChanges}
          onValueChange={(value) =>
            handleSettingChange("announceScreenChanges", value)
          }
          icon="microphone"
          testId="announce-screen-changes-toggle"
          disabled={!systemStatus.screenReader}
        />

        <SettingItem
          title="キーボードナビゲーション"
          description="キーボードによる操作サポート"
          value={localSettings.enableKeyboardNavigation}
          onValueChange={(value) =>
            handleSettingChange("enableKeyboardNavigation", value)
          }
          icon="keyboard"
          testId="keyboard-navigation-toggle"
        />
      </View>

      {/* テスト・デバッグ */}
      {showAdvanced && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            テスト・デバッグ
          </Text>

          <SettingItem
            title="フィードバックテスト"
            description="全フィードバック機能のテスト実行"
            value={null}
            onValueChange={() => testAllFeedbacks()}
            type="button"
            icon="test-tube"
            buttonText="テスト実行"
            testId="feedback-test-button"
          />

          <SettingItem
            title="キーボードヘルプ"
            description="利用可能なキーボードショートカットの案内"
            value={null}
            onValueChange={() => announceKeyboardHelp()}
            type="button"
            icon="help-circle"
            buttonText="ヘルプ表示"
            testId="keyboard-help-button"
          />

          <SettingItem
            title="音声効果テスト"
            description="音声システムの動作確認"
            value={null}
            onValueChange={() => audioFeedbackService.testSoundEffects()}
            type="button"
            icon="music-note"
            buttonText="音声テスト"
            testId="audio-test-button"
            disabled={!localSettings.enableSoundEffects}
          />
        </View>
      )}
    </ScrollView>
  );
}

const useStyles = (theme: any, compactMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginBottom: compactMode ? 16 : 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: compactMode ? 18 : 20,
      fontWeight: "600",
      marginBottom: compactMode ? 8 : 12,
      ...theme.typography.subtitle1,
    },
    statusGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderRadius: 8,
      minWidth: 120,
      gap: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    settingItem: {
      flexDirection: "column",
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: compactMode ? 12 : 16,
      marginBottom: compactMode ? 8 : 12,
      ...theme.shadows.small,
    },
    disabledItem: {
      opacity: 0.6,
    },
    settingContent: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
      marginBottom: 8,
    },
    settingIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: compactMode ? 16 : 17,
      fontWeight: "600",
      lineHeight: 24,
      ...theme.typography.body1,
    },
    settingDescription: {
      fontSize: compactMode ? 13 : 14,
      lineHeight: 20,
      marginTop: 2,
      ...theme.typography.body2,
    },
    settingControl: {
      alignSelf: "flex-end",
    },
    sliderContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      gap: 12,
    },
    slider: {
      flex: 1,
      height: 40,
    },
    sliderValue: {
      fontSize: 14,
      fontWeight: "600",
      minWidth: 40,
      textAlign: "right",
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      minHeight: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    disabledButton: {
      backgroundColor: theme.colors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.surface,
    },
  });

export default AccessibilitySettings;
