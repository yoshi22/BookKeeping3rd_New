/**
 * プログレスインジケーターフック（Phase 2）
 * 包括的な進捗表示システム - 円形・線形・スケルトン・ステップインジケーター
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { useAccessibility } from "./useAccessibility";
import { lightColors } from "../theme/colors";
import { useColors } from "../context/ThemeContext";

export interface ProgressConfig {
  duration?: number;
  color?: string;
  backgroundColor?: string;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
}

export interface CircularProgressProps extends ProgressConfig {
  progress: number; // 0-100
  children?: React.ReactNode;
}

export interface LinearProgressProps extends ProgressConfig {
  progress: number; // 0-100
  height?: number;
  borderRadius?: number;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  animated?: boolean;
  shimmerColor?: string;
  backgroundColor?: string;
}

export interface StepIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    completed?: boolean;
    active?: boolean;
  }>;
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  size?: number;
  activeColor?: string;
  completedColor?: string;
  inactiveColor?: string;
}

/**
 * 円形プログレスインジケーター
 */
export const CircularProgress = forwardRef<any, CircularProgressProps>(
  (
    {
      progress = 0,
      duration = 1000,
      color,
      backgroundColor,
      size = 100,
      strokeWidth = 8,
      animated = true,
      showPercentage = true,
      showLabel = false,
      label = "",
      children,
    },
    ref,
  ) => {
    const animatedProgress = useRef(new Animated.Value(0)).current;
    const { isReduceMotionEnabled } = useAccessibility();
    const colors = useColors();

    // Phase 4: テーマに応じたデフォルトカラー
    const effectiveColor = color || colors.primary;
    const effectiveBackgroundColor = backgroundColor || colors.borderLight;

    const animateToProgress = useCallback(
      (targetProgress: number) => {
        const finalDuration = isReduceMotionEnabled
          ? Math.min(duration, 300)
          : duration;

        Animated.timing(animatedProgress, {
          toValue: targetProgress,
          duration: animated ? finalDuration : 0,
          useNativeDriver: false,
        }).start();
      },
      [animatedProgress, duration, animated, isReduceMotionEnabled],
    );

    useEffect(() => {
      animateToProgress(progress);
    }, [progress, animateToProgress]);

    useImperativeHandle(ref, () => ({
      animateToProgress,
      reset: () => animatedProgress.setValue(0),
    }));

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    return (
      <View style={[styles.circularContainer, { width: size, height: size }]}>
        {/* 背景円 */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { width: size, height: size }]}
        >
          <View
            style={[
              styles.circularBackground,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: effectiveBackgroundColor,
              },
            ]}
          />
        </Animated.View>

        {/* プログレス円 */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { width: size, height: size },
            {
              transform: [
                {
                  rotate: animatedProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["-90deg", "270deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.circularProgress,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: effectiveColor,
                borderTopColor: "transparent",
                borderRightColor: "transparent",
              },
            ]}
          />
        </Animated.View>

        {/* 中央コンテンツ */}
        <View style={styles.circularContent}>
          {children || (
            <View style={styles.circularTextContainer}>
              {showPercentage && (
                <Animated.Text
                  style={[
                    styles.percentageText,
                    { fontSize: size * 0.15, color: effectiveColor },
                  ]}
                  accessibilityLabel={`進捗 ${Math.round(progress)}%`}
                >
                  {animatedProgress
                    .interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, progress],
                    })
                    .__getValue()
                    .toFixed(0)}
                  %
                </Animated.Text>
              )}
              {showLabel && label && (
                <Text style={[styles.labelText, { fontSize: size * 0.08 }]}>
                  {label}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  },
);

/**
 * 線形プログレスインジケーター
 */
export const LinearProgress = forwardRef<any, LinearProgressProps>(
  (
    {
      progress = 0,
      duration = 800,
      color,
      backgroundColor,
      height = 8,
      borderRadius = 4,
      animated = true,
      showPercentage = false,
      label = "",
    },
    ref,
  ) => {
    const animatedProgress = useRef(new Animated.Value(0)).current;
    const { isReduceMotionEnabled } = useAccessibility();
    const colors = useColors();

    // Phase 4: テーマに応じたデフォルトカラー
    const effectiveColor = color || colors.primary;
    const effectiveBackgroundColor = backgroundColor || colors.borderLight;

    const animateToProgress = useCallback(
      (targetProgress: number) => {
        const finalDuration = isReduceMotionEnabled
          ? Math.min(duration, 200)
          : duration;

        Animated.timing(animatedProgress, {
          toValue: targetProgress,
          duration: animated ? finalDuration : 0,
          useNativeDriver: false,
        }).start();
      },
      [animatedProgress, duration, animated, isReduceMotionEnabled],
    );

    useEffect(() => {
      animateToProgress(progress);
    }, [progress, animateToProgress]);

    useImperativeHandle(ref, () => ({
      animateToProgress,
      reset: () => animatedProgress.setValue(0),
    }));

    return (
      <View style={styles.linearContainer}>
        {label ? (
          <View style={styles.linearHeader}>
            <Text style={[styles.linearLabel, { color: colors.text }]}>
              {label}
            </Text>
            {showPercentage && (
              <Text
                style={[
                  styles.linearPercentage,
                  { color: colors.textSecondary },
                ]}
              >
                {Math.round(progress)}%
              </Text>
            )}
          </View>
        ) : null}

        <View
          style={[
            styles.linearBackground,
            {
              height,
              borderRadius,
              backgroundColor: effectiveBackgroundColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.linearFill,
              {
                height,
                borderRadius,
                backgroundColor: effectiveColor,
                width: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
            accessibilityLabel={`進捗 ${Math.round(progress)}%`}
          />
        </View>
      </View>
    );
  },
);

/**
 * スケルトンローダー
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  animated = true,
  shimmerColor = "#E0E0E0",
  backgroundColor = "#F5F5F5",
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const { isReduceMotionEnabled } = useAccessibility();

  useEffect(() => {
    if (!animated || isReduceMotionEnabled) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [shimmerAnimation, animated, isReduceMotionEnabled]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        styles.skeletonContainer,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
      ]}
      accessibilityLabel="読み込み中"
    >
      {animated && !isReduceMotionEnabled && (
        <Animated.View
          style={[
            styles.skeletonShimmer,
            {
              backgroundColor: shimmerColor,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
};

/**
 * ステップインジケーター
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps = [],
  currentStep = 0,
  orientation = "horizontal",
  size = 32,
  activeColor,
  completedColor,
  inactiveColor,
}) => {
  const { isReduceMotionEnabled } = useAccessibility();
  const colors = useColors();

  // Phase 4: テーマに応じたデフォルトカラー
  const effectiveActiveColor = activeColor || colors.primary;
  const effectiveCompletedColor = completedColor || colors.success;
  const effectiveInactiveColor = inactiveColor || colors.borderLight;

  const getStepColor = (index: number, step: any) => {
    if (step.completed) return effectiveCompletedColor;
    if (step.active || index === currentStep) return effectiveActiveColor;
    return effectiveInactiveColor;
  };

  const getStepTextColor = (index: number, step: any) => {
    if (step.completed || step.active || index === currentStep) {
      return "#FFFFFF";
    }
    return colors.textSecondary;
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <View
      style={[
        styles.stepContainer,
        isHorizontal ? styles.stepHorizontal : styles.stepVertical,
      ]}
    >
      {steps.map((step, index) => {
        const isActive = step.active || index === currentStep;
        const isCompleted = step.completed;
        const stepColor = getStepColor(index, step);
        const textColor = getStepTextColor(index, step);

        return (
          <View
            key={step.id}
            style={[
              styles.stepItem,
              isHorizontal
                ? styles.stepItemHorizontal
                : styles.stepItemVertical,
            ]}
          >
            {/* ステップ円 */}
            <View
              style={[
                styles.stepCircle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: stepColor,
                  borderWidth: 2,
                  borderColor: stepColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  {
                    color: textColor,
                    fontSize: size * 0.4,
                  },
                ]}
              >
                {isCompleted ? "✓" : index + 1}
              </Text>
            </View>

            {/* ステップ情報 */}
            <View
              style={[
                styles.stepInfo,
                isHorizontal
                  ? styles.stepInfoHorizontal
                  : styles.stepInfoVertical,
              ]}
            >
              <Text
                style={[
                  styles.stepTitle,
                  {
                    color: isActive ? effectiveActiveColor : colors.text,
                    fontWeight: isActive ? "bold" : "normal",
                  },
                ]}
              >
                {step.title}
              </Text>
              {step.description && (
                <Text style={styles.stepDescription}>{step.description}</Text>
              )}
            </View>

            {/* 接続線 */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepConnector,
                  isHorizontal
                    ? styles.stepConnectorHorizontal
                    : styles.stepConnectorVertical,
                  {
                    backgroundColor: isCompleted
                      ? completedColor
                      : inactiveColor,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

/**
 * 学習進捗可視化コンポーネント
 */
export interface LearningProgressProps {
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  categoryProgress?: Array<{
    name: string;
    total: number;
    completed: number;
    color: string;
  }>;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  totalQuestions,
  completedQuestions,
  correctAnswers,
  categoryProgress = [],
}) => {
  const completionPercentage = (completedQuestions / totalQuestions) * 100;
  const accuracyPercentage =
    completedQuestions > 0 ? (correctAnswers / completedQuestions) * 100 : 0;

  return (
    <View style={styles.learningProgressContainer}>
      {/* 全体進捗 */}
      <View style={styles.overallProgress}>
        <CircularProgress
          progress={completionPercentage}
          size={120}
          strokeWidth={10}
          color={lightColors.primary}
          showPercentage={true}
          showLabel={true}
          label="完了率"
        />

        <View style={styles.progressStats}>
          <Text style={styles.progressLabel}>学習進捗</Text>
          <Text style={styles.progressText}>
            {completedQuestions} / {totalQuestions} 問完了
          </Text>
          <Text style={styles.accuracyText}>
            正答率: {accuracyPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* カテゴリ別進捗 */}
      {categoryProgress.length > 0 && (
        <View style={styles.categoryProgressContainer}>
          <Text style={styles.categoryTitle}>分野別進捗</Text>
          {categoryProgress.map((category, index) => {
            const categoryPercentage =
              (category.completed / category.total) * 100;
            return (
              <LinearProgress
                key={index}
                progress={categoryPercentage}
                color={category.color}
                label={category.name}
                showPercentage={true}
                height={12}
                borderRadius={6}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // 円形プログレス
  circularContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circularBackground: {
    borderColor: "#E0E0E0",
  },
  circularProgress: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  circularContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  circularTextContainer: {
    alignItems: "center",
  },
  percentageText: {
    fontWeight: "bold",
  },
  labelText: {
    color: lightColors.textSecondary,
    marginTop: 2,
  },

  // 線形プログレス
  linearContainer: {
    width: "100%",
  },
  linearHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  linearLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  linearPercentage: {
    fontSize: 12,
  },
  linearBackground: {
    overflow: "hidden",
  },
  linearFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },

  // スケルトンローダー
  skeletonContainer: {
    overflow: "hidden",
    position: "relative",
  },
  skeletonShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },

  // ステップインジケーター
  stepContainer: {
    flex: 1,
  },
  stepHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepVertical: {
    flexDirection: "column",
  },
  stepItem: {
    position: "relative",
  },
  stepItemHorizontal: {
    flex: 1,
    alignItems: "center",
  },
  stepItemVertical: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepCircle: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  stepNumber: {
    fontWeight: "bold",
  },
  stepInfo: {
    marginLeft: 12,
  },
  stepInfoHorizontal: {
    marginTop: 8,
    alignItems: "center",
  },
  stepInfoVertical: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  stepDescription: {
    fontSize: 12,
    color: lightColors.textSecondary,
    marginTop: 2,
  },
  stepConnector: {
    position: "absolute",
  },
  stepConnectorHorizontal: {
    right: -50,
    top: 16,
    width: 100,
    height: 2,
  },
  stepConnectorVertical: {
    left: 16,
    bottom: -20,
    width: 2,
    height: 20,
  },

  // 学習進捗
  learningProgressContainer: {
    padding: 20,
  },
  overallProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  progressStats: {
    marginLeft: 20,
    flex: 1,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: lightColors.text,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: lightColors.textSecondary,
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 14,
    color: lightColors.success,
    fontWeight: "500",
  },
  categoryProgressContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: lightColors.text,
    marginBottom: 16,
  },
});

CircularProgress.displayName = "CircularProgress";
LinearProgress.displayName = "LinearProgress";
