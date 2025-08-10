/**
 * ローディング状態コンポーネント
 * 簿記3級問題集アプリ - Step 5.2: UX最適化
 *
 * 快適なローディング体験の提供
 */

import React from "react";
import { View, ViewStyle, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme, useThemedStyles } from "../../context/ThemeContext";
import { Typography } from "../ui/Typography";
import { Card, CardContent } from "../ui/Card";
import { Pulse, Rotate, FadeIn, AnimatedProgressBar } from "../ui/Animation";
import { Container } from "../layout/ResponsiveLayout";

export type LoadingSize = "small" | "medium" | "large";
export type LoadingVariant = "spinner" | "dots" | "progress" | "skeleton";

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  message?: string;
  progress?: number; // 0-100
  style?: ViewStyle;
}

export function Loading({
  size = "medium",
  variant = "spinner",
  message,
  progress,
  style,
}: LoadingProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const renderLoadingIndicator = () => {
    switch (variant) {
      case "spinner":
        return <LoadingSpinner size={size} />;
      case "dots":
        return <LoadingDots size={size} />;
      case "progress":
        return <LoadingProgress progress={progress || 0} />;
      case "skeleton":
        return <LoadingSkeleton />;
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderLoadingIndicator()}
      {message && (
        <FadeIn delay={300}>
          <Typography
            variant="body2"
            color="secondary"
            align="center"
            style={styles.message}
          >
            {message}
          </Typography>
        </FadeIn>
      )}
    </View>
  );
}

/**
 * スピナーローディング
 */
interface LoadingSpinnerProps {
  size: LoadingSize;
}

function LoadingSpinner({ size }: LoadingSpinnerProps) {
  const { theme } = useTheme();

  const getSpinnerSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 32;
      case "large":
        return 48;
      default:
        return 32;
    }
  };

  return (
    <ActivityIndicator size={getSpinnerSize()} color={theme.colors.primary} />
  );
}

/**
 * ドットローディング
 */
function LoadingDots({ size }: LoadingSpinnerProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const getDotSize = () => {
    switch (size) {
      case "small":
        return 6;
      case "medium":
        return 8;
      case "large":
        return 12;
      default:
        return 8;
    }
  };

  const dotSize = getDotSize();

  return (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map((index) => (
        <Pulse
          key={index}
          duration={800}
          minScale={0.6}
          maxScale={1}
          style={{
            ...styles.dot,
            width: dotSize,
            height: dotSize,
            backgroundColor: theme.colors.primary,
            marginHorizontal: dotSize / 2,
          }}
        >
          <View />
        </Pulse>
      ))}
    </View>
  );
}

/**
 * プログレスローディング
 */
interface LoadingProgressProps {
  progress: number;
}

function LoadingProgress({ progress }: LoadingProgressProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.progressContainer}>
      <AnimatedProgressBar
        progress={progress}
        height={6}
        backgroundColor={theme.colors.surface}
        progressColor={theme.colors.primary}
        style={styles.progressBar}
      />
      <Typography variant="caption" align="center" style={styles.progressText}>
        {Math.round(progress)}%
      </Typography>
    </View>
  );
}

/**
 * スケルトンローディング
 */
function LoadingSkeleton() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((index) => (
        <Pulse key={index} duration={1200} minScale={0.95} maxScale={1}>
          <View
            style={[
              styles.skeletonItem,
              { backgroundColor: theme.colors.surface },
              index === 1 && { width: "80%" },
              index === 2 && { width: "60%" },
            ]}
          />
        </Pulse>
      ))}
    </View>
  );
}

/**
 * フルスクリーンローディング
 */
interface FullScreenLoadingProps {
  message?: string;
  variant?: LoadingVariant;
}

export function FullScreenLoading({
  message,
  variant = "spinner",
}: FullScreenLoadingProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.fullScreenContainer}>
      <Container style={styles.fullScreenContent}>
        <Card variant="elevated" style={styles.fullScreenCard}>
          <CardContent>
            <Loading variant={variant} size="large" message={message} />
          </CardContent>
        </Card>
      </Container>
    </View>
  );
}

/**
 * インラインローディング
 */
interface InlineLoadingProps {
  text: string;
  isLoading: boolean;
}

export function InlineLoading({ text, isLoading }: InlineLoadingProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.inlineContainer}>
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.inlineSpinner}
        />
      )}
      <Typography variant="body2" color="secondary">
        {text}
      </Typography>
    </View>
  );
}

/**
 * ボタンローディング
 */
interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function ButtonLoading({ isLoading, children }: ButtonLoadingProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <View style={styles.buttonLoadingContainer}>
      <ActivityIndicator
        size="small"
        color={theme.colors.background}
        style={styles.buttonSpinner}
      />
      <View style={styles.buttonContent}>{children}</View>
    </View>
  );
}

/**
 * カードローディング
 */
export function CardLoading() {
  const styles = useThemedStyles(createStyles);

  return (
    <Card variant="outlined" style={styles.cardLoading}>
      <CardContent>
        <LoadingSkeleton />
      </CardContent>
    </Card>
  );
}

/**
 * リストローディング
 */
interface ListLoadingProps {
  itemCount?: number;
}

export function ListLoading({ itemCount = 3 }: ListLoadingProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: itemCount }, (_, index) => (
        <FadeIn key={index} delay={index * 100}>
          <CardLoading />
        </FadeIn>
      ))}
    </View>
  );
}

/**
 * 問題ローディング
 */
export function QuestionLoading() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Container>
      <Card variant="elevated">
        <CardContent>
          {/* 問題タイトル部分 */}
          <Pulse duration={1200}>
            <View
              style={[
                styles.skeletonItem,
                { height: 24, marginBottom: theme.spacing.lg },
              ]}
            />
          </Pulse>

          {/* 問題文部分 */}
          <View style={styles.questionTextSkeleton}>
            {[1, 2, 3].map((index) => (
              <Pulse key={index} duration={1200} delay={index * 100}>
                <View
                  style={[
                    styles.skeletonItem,
                    {
                      height: 16,
                      width: index === 3 ? "60%" : "100%",
                      marginBottom: theme.spacing.sm,
                    },
                  ]}
                />
              </Pulse>
            ))}
          </View>

          {/* 選択肢部分 */}
          <View style={styles.optionsSkeleton}>
            {[1, 2, 3, 4].map((index) => (
              <Pulse key={index} duration={1200} delay={index * 150}>
                <View
                  style={[
                    styles.optionSkeleton,
                    { marginBottom: theme.spacing.md },
                  ]}
                >
                  <View
                    style={[
                      styles.skeletonItem,
                      { width: 24, height: 24, borderRadius: 12 },
                    ]}
                  />
                  <View
                    style={[
                      styles.skeletonItem,
                      { flex: 1, height: 16, marginLeft: theme.spacing.md },
                    ]}
                  />
                </View>
              </Pulse>
            ))}
          </View>
        </CardContent>
      </Card>
    </Container>
  );
}

/**
 * 統計ローディング
 */
export function StatsLoading() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Container>
      <View style={styles.statsContainer}>
        {/* メイン統計カード */}
        <Card variant="elevated" style={styles.mainStatCard}>
          <CardContent>
            <Pulse duration={1200}>
              <View
                style={[
                  styles.skeletonItem,
                  { height: 48, marginBottom: theme.spacing.md },
                ]}
              />
            </Pulse>
            <Pulse duration={1200} delay={200}>
              <View
                style={[styles.skeletonItem, { height: 20, width: "70%" }]}
              />
            </Pulse>
          </CardContent>
        </Card>

        {/* サブ統計カード */}
        <View style={styles.subStatsContainer}>
          {[1, 2, 3].map((index) => (
            <FadeIn key={index} delay={index * 150}>
              <Card variant="outlined" style={styles.subStatCard}>
                <CardContent>
                  <Pulse duration={1200}>
                    <View
                      style={[
                        styles.skeletonItem,
                        { height: 32, marginBottom: theme.spacing.sm },
                      ]}
                    />
                  </Pulse>
                  <Pulse duration={1200} delay={100}>
                    <View
                      style={[
                        styles.skeletonItem,
                        { height: 16, width: "80%" },
                      ]}
                    />
                  </Pulse>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </View>
      </View>
    </Container>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.lg,
    },

    message: {
      marginTop: theme.spacing.md,
      maxWidth: 200,
    },

    // ドットローディング
    dotsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    dot: {
      borderRadius: 999,
    },

    // プログレスローディング
    progressContainer: {
      width: 200,
      alignItems: "center",
    },

    progressBar: {
      width: "100%",
      marginBottom: theme.spacing.sm,
    },

    progressText: {
      minWidth: 40,
    },

    // スケルトンローディング
    skeletonContainer: {
      width: "100%",
    },

    skeletonItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
      height: 20,
    },

    // フルスクリーンローディング
    fullScreenContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `${theme.colors.background}CC`,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },

    fullScreenContent: {
      width: "80%",
      maxWidth: 300,
    },

    fullScreenCard: {
      alignItems: "center",
    },

    // インラインローディング
    inlineContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    inlineSpinner: {
      marginRight: theme.spacing.sm,
    },

    // ボタンローディング
    buttonLoadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    buttonSpinner: {
      marginRight: theme.spacing.sm,
    },

    buttonContent: {
      opacity: 0.7,
    },

    // カードローディング
    cardLoading: {
      marginBottom: theme.spacing.md,
    },

    // リストローディング
    listContainer: {
      gap: theme.spacing.md,
    },

    // 問題ローディング
    questionTextSkeleton: {
      marginBottom: theme.spacing.xl,
    },

    optionsSkeleton: {
      marginTop: theme.spacing.lg,
    },

    optionSkeleton: {
      flexDirection: "row",
      alignItems: "center",
    },

    // 統計ローディング
    statsContainer: {
      gap: theme.spacing.lg,
    },

    mainStatCard: {
      alignItems: "center",
    },

    subStatsContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    subStatCard: {
      flex: 1,
      alignItems: "center",
    },
  });

/**
 * ローディング状態管理フック
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = React.useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      try {
        startLoading();
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
