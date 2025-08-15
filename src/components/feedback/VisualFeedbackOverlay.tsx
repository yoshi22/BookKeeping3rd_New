/**
 * 視覚的フィードバックオーバーレイコンポーネント（Phase 4）
 * スクリーンリーダー対応・ダークモード対応・アニメーション対応
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useVisualFeedbackRenderer,
  VisualFeedbackOptions,
} from "../../hooks/useVisualAudioSupport";
import { useTheme } from "../../context/ThemeContext";
import { useAccessibility } from "../../hooks/useAccessibility";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface VisualFeedbackOverlayProps {
  /** フィードバック表示の優先度 */
  priority?: "low" | "normal" | "high";
  /** オーバーレイの最大表示数 */
  maxItems?: number;
  /** カスタムスタイル */
  style?: any;
}

export function VisualFeedbackOverlay({
  priority = "normal",
  maxItems = 3,
  style,
}: VisualFeedbackOverlayProps) {
  const { theme, isDark } = useTheme();
  const { isReduceMotionEnabled } = useAccessibility();
  const { visualFeedbacks, renderFeedbackItem } = useVisualFeedbackRenderer();

  // 表示するフィードバックを優先度とタイムスタンプでソート
  const displayFeedbacks = visualFeedbacks
    .sort((a, b) => {
      // 優先度順: error > warning > success > info > navigation > action
      const priorityOrder = {
        error: 6,
        warning: 5,
        success: 4,
        info: 3,
        navigation: 2,
        action: 1,
      };

      const aPriority = priorityOrder[a.options.type] || 0;
      const bPriority = priorityOrder[b.options.type] || 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // 同じ優先度の場合は新しいものを優先
      return b.timestamp - a.timestamp;
    })
    .slice(0, maxItems);

  if (displayFeedbacks.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.overlay, style]} pointerEvents="none">
      <View style={styles.container}>
        {displayFeedbacks.map((feedback, index) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            index={index}
            isReduceMotionEnabled={isReduceMotionEnabled}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

interface FeedbackItemProps {
  feedback: {
    id: string;
    options: VisualFeedbackOptions;
    timestamp: number;
  };
  index: number;
  isReduceMotionEnabled: boolean;
}

function FeedbackItem({
  feedback,
  index,
  isReduceMotionEnabled,
}: FeedbackItemProps) {
  const { theme } = useTheme();
  const { renderFeedbackItem } = useVisualFeedbackRenderer();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const renderedItem = renderFeedbackItem(feedback);

  // アニメーション設定
  useEffect(() => {
    if (isReduceMotionEnabled) {
      // モーション削減時は即座に表示
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
    } else {
      // 通常のアニメーション
      const animations = [
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ];

      Animated.parallel(animations).start();
    }

    // 退場アニメーション
    const duration = feedback.options.duration || 3000;
    const hideTimer = setTimeout(() => {
      if (!isReduceMotionEnabled) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, duration - 200);

    return () => {
      clearTimeout(hideTimer);
    };
  }, [feedback.id, isReduceMotionEnabled, fadeAnim, slideAnim, scaleAnim]);

  // アイコンの取得
  const getIcon = (type: VisualFeedbackOptions["type"]) => {
    const icons = {
      success: "check-circle",
      error: "alert-circle",
      warning: "alert",
      info: "information",
      navigation: "navigation",
      action: "lightning-bolt",
    };
    return icons[type] || "information";
  };

  // ポジション計算
  const getPositionStyle = () => {
    const { position = "center" } = feedback.options;
    const baseTop = index * 70; // 各アイテム間のスペース

    switch (position) {
      case "top":
        return {
          top: 100 + baseTop, // StatusBar + SafeArea考慮
          alignSelf: "center" as const,
        };
      case "bottom":
        return {
          bottom: 100 + baseTop,
          alignSelf: "center" as const,
        };
      case "center":
      default:
        return {
          top: screenHeight / 2 - 50 + baseTop,
          alignSelf: "center" as const,
        };
    }
  };

  const positionStyle = getPositionStyle();

  return (
    <Animated.View
      style={[
        styles.feedbackItem,
        renderedItem.style,
        positionStyle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={feedback.options.message}
    >
      <View style={styles.feedbackContent}>
        {feedback.options.showIcon && (
          <MaterialCommunityIcons
            name={getIcon(feedback.options.type) as any}
            size={24}
            color={renderedItem.textColor}
            style={styles.feedbackIcon}
          />
        )}
        {feedback.options.message && (
          <Text
            style={[
              styles.feedbackText,
              { color: renderedItem.textColor },
              theme.typography.body,
            ]}
            numberOfLines={2}
            accessibilityRole="text"
          >
            {feedback.options.message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

// 高コントラスト対応フィードバックオーバーレイ
export function HighContrastFeedbackOverlay({
  ...props
}: VisualFeedbackOverlayProps) {
  const { theme, isHighContrastMode } = useTheme();

  if (!isHighContrastMode) {
    return <VisualFeedbackOverlay {...props} />;
  }

  return (
    <VisualFeedbackOverlay
      {...props}
      style={[
        props.style,
        {
          // 高コントラストモード用の追加スタイル
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 16,
        },
      ]}
    />
  );
}

// CBT専用フィードバックオーバーレイ
interface CBTFeedbackOverlayProps extends VisualFeedbackOverlayProps {
  questionType?: "journal" | "ledger" | "trial_balance";
  showQuestionTypeIcon?: boolean;
}

export function CBTFeedbackOverlay({
  questionType,
  showQuestionTypeIcon = true,
  ...props
}: CBTFeedbackOverlayProps) {
  const { theme } = useTheme();

  const getQuestionTypeIcon = () => {
    if (!questionType || !showQuestionTypeIcon) return null;

    const icons = {
      journal: "book-open-variant",
      ledger: "table-large",
      trial_balance: "calculator",
    };

    return icons[questionType];
  };

  const questionTypeIcon = getQuestionTypeIcon();

  return (
    <View style={styles.cbtContainer}>
      <VisualFeedbackOverlay {...props} />
      {questionTypeIcon && (
        <View
          style={[
            styles.questionTypeIndicator,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <MaterialCommunityIcons
            name={questionTypeIcon as any}
            size={20}
            color={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "none",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  feedbackItem: {
    position: "absolute",
    maxWidth: screenWidth - 40,
    minWidth: 200,
    borderRadius: 8,
    marginHorizontal: 20,
    elevation: 8, // Android shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  feedbackContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  cbtContainer: {
    flex: 1,
  },
  questionTypeIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default VisualFeedbackOverlay;
