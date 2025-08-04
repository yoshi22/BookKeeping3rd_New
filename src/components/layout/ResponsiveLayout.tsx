/**
 * レスポンシブレイアウトコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 *
 * 画面サイズに対応したレイアウトシステム
 */

import React from "react";
import {
  View,
  ViewStyle,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useResponsiveTheme } from "../../context/ThemeContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
export type Orientation = "portrait" | "landscape";

/**
 * ブレークポイント定義
 */
export const breakpoints = {
  xs: 0, // ~ 359px
  sm: 360, // 360px ~ 413px
  md: 414, // 414px ~ 767px
  lg: 768, // 768px ~ 1023px
  xl: 1024, // 1024px ~
};

/**
 * 現在のブレークポイントを取得
 */
export function getCurrentBreakpoint(width: number = screenWidth): Breakpoint {
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

/**
 * 画面向きを取得
 */
export function getOrientation(
  width: number = screenWidth,
  height: number = screenHeight,
): Orientation {
  return width > height ? "landscape" : "portrait";
}

/**
 * コンテナコンポーネント
 */
interface ContainerProps {
  children: React.ReactNode;
  padding?: boolean;
  maxWidth?: number;
  style?: ViewStyle;
  additionalIOSPadding?: boolean; // iOSで追加マージンを適用するか
}

export function Container({
  children,
  padding = true,
  maxWidth,
  style,
  additionalIOSPadding = false,
}: ContainerProps) {
  const { theme } = useTheme();
  const responsiveTheme = useResponsiveTheme(screenWidth);

  const containerStyle: ViewStyle = {
    flex: 1,
    width: "100%",
    maxWidth: maxWidth || "100%",
    alignSelf: "center",
    ...(padding && {
      paddingHorizontal: responsiveTheme.getResponsiveSpacing(
        theme.layoutSpacing.screenPaddingHorizontal,
      ),
      paddingVertical: responsiveTheme.getResponsiveSpacing(
        theme.layoutSpacing.screenPaddingVertical,
      ),
    }),
  };

  return <View style={[containerStyle, style]}>{children}</View>;
}

/**
 * グリッドシステム
 */
interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  style?: ViewStyle;
}

export function Grid({ children, columns = 2, gap, style }: GridProps) {
  const { theme } = useTheme();
  const defaultGap = gap || theme.spacing.md;

  const gridStyle: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -defaultGap / 2,
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <View style={[gridStyle, style]}>
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / columns}%`,
            paddingHorizontal: defaultGap / 2,
            marginBottom: defaultGap,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

/**
 * フレックスレイアウト
 */
interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  wrap?: boolean;
  gap?: number;
  style?: ViewStyle;
}

export function Flex({
  children,
  direction = "column",
  justify = "flex-start",
  align = "stretch",
  wrap = false,
  gap,
  style,
}: FlexProps) {
  const { theme } = useTheme();
  const defaultGap = gap || theme.spacing.md;

  const flexStyle: ViewStyle = {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: defaultGap,
  };

  return <View style={[flexStyle, style]}>{children}</View>;
}

/**
 * レスポンシブ表示制御
 */
interface ShowProps {
  children: React.ReactNode;
  breakpoint?: Breakpoint;
  orientation?: Orientation;
  above?: Breakpoint;
  below?: Breakpoint;
}

export function Show({
  children,
  breakpoint,
  orientation,
  above,
  below,
}: ShowProps) {
  const currentBreakpoint = getCurrentBreakpoint();
  const currentOrientation = getOrientation();

  // ブレークポイント条件チェック
  if (breakpoint && currentBreakpoint !== breakpoint) {
    return null;
  }

  // 向き条件チェック
  if (orientation && currentOrientation !== orientation) {
    return null;
  }

  // above条件チェック
  if (above) {
    const currentIndex = Object.keys(breakpoints).indexOf(currentBreakpoint);
    const aboveIndex = Object.keys(breakpoints).indexOf(above);
    if (currentIndex <= aboveIndex) {
      return null;
    }
  }

  // below条件チェック
  if (below) {
    const currentIndex = Object.keys(breakpoints).indexOf(currentBreakpoint);
    const belowIndex = Object.keys(breakpoints).indexOf(below);
    if (currentIndex >= belowIndex) {
      return null;
    }
  }

  return <>{children}</>;
}

/**
 * 画面サイズ別レイアウト
 */
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  xs?: ViewStyle;
  sm?: ViewStyle;
  md?: ViewStyle;
  lg?: ViewStyle;
  xl?: ViewStyle;
  style?: ViewStyle;
}

export function ResponsiveLayout({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  style,
}: ResponsiveLayoutProps) {
  const currentBreakpoint = getCurrentBreakpoint();

  const getResponsiveStyle = (): ViewStyle => {
    switch (currentBreakpoint) {
      case "xs":
        return xs || {};
      case "sm":
        return sm || xs || {};
      case "md":
        return md || sm || xs || {};
      case "lg":
        return lg || md || sm || xs || {};
      case "xl":
        return xl || lg || md || sm || xs || {};
      default:
        return {};
    }
  };

  return <View style={[getResponsiveStyle(), style]}>{children}</View>;
}

/**
 * スクリーンコンテナ
 */
interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  statusBarStyle?: "light-content" | "dark-content";
  style?: ViewStyle;
}

export function Screen({
  children,
  scrollable = false,
  safeArea = true,
  statusBarStyle,
  style,
}: ScreenProps) {
  const { theme } = useTheme();

  // ステータスバーのスタイルを自動決定
  const autoStatusBarStyle =
    statusBarStyle || (theme.isDark ? "light-content" : "dark-content");

  // シンプルで確実なスタイル設定
  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    // iOS用の固定マージン設定（シンプルで確実）
    ...(Platform.OS === "ios" &&
      safeArea && {
        paddingTop: 44, // ステータスバー用固定値
        paddingBottom: 34, // ホームインジケーター用固定値
      }),
  };

  const content = scrollable ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  // シンプルな実装：safeAreaがtrueの場合はSafeAreaView、falseの場合はView
  return safeArea ? (
    <SafeAreaView style={[screenStyle, style]}>
      <StatusBar barStyle={autoStatusBarStyle} />
      {content}
    </SafeAreaView>
  ) : (
    <View style={[screenStyle, style]}>
      <StatusBar
        barStyle={autoStatusBarStyle}
        backgroundColor={
          Platform.OS === "android" ? theme.colors.primary : undefined
        }
      />
      {content}
    </View>
  );
}

/**
 * カードグリッド（レスポンシブ）
 */
interface CardGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardGrid({ children, style }: CardGridProps) {
  const currentBreakpoint = getCurrentBreakpoint();

  const getColumns = (): number => {
    switch (currentBreakpoint) {
      case "xs":
        return 1;
      case "sm":
        return 1;
      case "md":
        return 2;
      case "lg":
        return 3;
      case "xl":
        return 4;
      default:
        return 2;
    }
  };

  return (
    <Grid columns={getColumns()} style={style}>
      {children}
    </Grid>
  );
}

/**
 * 統計表示レイアウト
 */
interface StatsLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function StatsLayout({ children, style }: StatsLayoutProps) {
  const currentBreakpoint = getCurrentBreakpoint();
  const orientation = getOrientation();

  // 横向きの場合は横並び、縦向きの場合は縦並び
  const isHorizontal =
    orientation === "landscape" && currentBreakpoint !== "xs";

  return (
    <Flex
      direction={isHorizontal ? "row" : "column"}
      justify="space-between"
      style={style}
    >
      {children}
    </Flex>
  );
}

/**
 * 問題表示レイアウト
 */
interface QuestionLayoutProps {
  question: React.ReactNode;
  answers: React.ReactNode;
  actions: React.ReactNode;
  style?: ViewStyle;
}

export function QuestionLayout({
  question,
  answers,
  actions,
  style,
}: QuestionLayoutProps) {
  const { theme } = useTheme();

  return (
    <Container style={style}>
      <Flex gap={theme.spacing.lg}>
        {/* 問題文 */}
        <View style={{ flex: 1 }}>{question}</View>

        {/* 解答欄 */}
        <View style={{ flex: 2 }}>{answers}</View>

        {/* アクションボタン */}
        <View>{actions}</View>
      </Flex>
    </Container>
  );
}

/**
 * レスポンシブフック
 */
export function useResponsive() {
  const [dimensions, setDimensions] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const breakpoint = getCurrentBreakpoint(dimensions.width);
  const orientation = getOrientation(dimensions.width, dimensions.height);

  return {
    dimensions,
    breakpoint,
    orientation,
    isSmallScreen: breakpoint === "xs" || breakpoint === "sm",
    isMediumScreen: breakpoint === "md",
    isLargeScreen: breakpoint === "lg" || breakpoint === "xl",
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
}
