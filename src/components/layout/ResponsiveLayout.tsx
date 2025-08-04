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
  Text,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

  // より積極的なiOS SafeArea対応
  const iOSExtraPadding =
    Platform.OS === "ios" && additionalIOSPadding
      ? {
          paddingTop: Math.max(insets.top, 44), // ナビゲーションバーを考慮
          paddingBottom: Math.max(insets.bottom, 34), // ホームインジケーターを考慮
        }
      : {};

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
    // iOS用の追加マージン（より積極的）
    ...iOSExtraPadding,
  };

  // デバッグログ
  React.useEffect(() => {
    if (__DEV__ && Platform.OS === "ios" && additionalIOSPadding) {
      console.log("Container iOS Extra Padding:", iOSExtraPadding);
    }
  }, [additionalIOSPadding, JSON.stringify(iOSExtraPadding)]);

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
  const insets = useSafeAreaInsets();

  // ステータスバーのスタイルを自動決定
  const autoStatusBarStyle =
    statusBarStyle || (theme.isDark ? "light-content" : "dark-content");

  // デバッグログ：SafeArea値を出力
  React.useEffect(() => {
    if (__DEV__ && Platform.OS === "ios") {
      console.log("Screen SafeArea Insets:", {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
        statusBarHeight: StatusBar.currentHeight || 0,
      });
      console.log("Window dimensions:", Dimensions.get("window"));
      console.log("Screen dimensions:", Dimensions.get("screen"));
    }
  }, [insets]);

  // iOS用の強制的なSafeArea設定（ヘッダー非表示を考慮）
  const iosMinInsets = {
    // 上部：ステータスバーのみを考慮（ヘッダーは非表示なので）
    top: Math.max(insets.top, 50), // 最小値50pt（ステータスバー + マージン）
    bottom: Math.max(insets.bottom, 34), // 最小値34pt（ホームインジケーター対応）
    left: Math.max(insets.left, 0),
    right: Math.max(insets.right, 0),
  };

  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    // iOS用の強制マージン設定
    ...(Platform.OS === "ios" &&
      safeArea && {
        paddingTop: iosMinInsets.top,
        paddingBottom: iosMinInsets.bottom,
        paddingLeft: iosMinInsets.left,
        paddingRight: iosMinInsets.right,
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

  // iOSの場合はViewを使用してマージンを完全制御
  const screenContent =
    safeArea && Platform.OS === "ios" ? (
      <View style={[screenStyle, style]}>
        <StatusBar barStyle={autoStatusBarStyle} />
        {content}
      </View>
    ) : safeArea ? (
      <SafeAreaView style={[screenStyle, style]}>
        {Platform.OS === "ios" && <StatusBar barStyle={autoStatusBarStyle} />}
        {content}
      </SafeAreaView>
    ) : (
      <View style={[screenStyle, style]}>
        {Platform.OS === "android" && (
          <StatusBar
            barStyle={autoStatusBarStyle}
            backgroundColor={theme.colors.primary}
          />
        )}
        {content}
      </View>
    );

  return screenContent;
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
 * デバッグ用SafeAreaインジケーター（開発時のみ表示）
 */
interface SafeAreaDebugProps {
  children: React.ReactNode;
  showIndicators?: boolean;
}

export function SafeAreaDebug({
  children,
  showIndicators = __DEV__,
}: SafeAreaDebugProps) {
  const insets = useSafeAreaInsets();

  if (!showIndicators) {
    return <>{children}</>;
  }

  // iOS用の実際に適用されるマージン値（ヘッダー非表示を考慮）
  const actualInsets =
    Platform.OS === "ios"
      ? {
          top: Math.max(insets.top, 50),
          bottom: Math.max(insets.bottom, 34),
          left: Math.max(insets.left, 0),
          right: Math.max(insets.right, 0),
        }
      : insets;

  return (
    <>
      {/* SafeArea可視化用のインジケーター */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: actualInsets.top,
          backgroundColor: "rgba(255, 0, 0, 0.3)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: actualInsets.bottom,
          backgroundColor: "rgba(0, 255, 0, 0.3)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: actualInsets.left,
          backgroundColor: "rgba(0, 0, 255, 0.3)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: actualInsets.right,
          backgroundColor: "rgba(255, 255, 0, 0.3)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {/* デバッグ情報表示 */}
      {Platform.OS === "ios" && (
        <View
          style={{
            position: "absolute",
            top: actualInsets.top + 10,
            left: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 10,
            borderRadius: 5,
            zIndex: 10000,
            pointerEvents: "none",
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontFamily: "Courier" }}>
            SafeArea Debug{"\n"}
            Original: t:{insets.top} b:{insets.bottom} l:{insets.left} r:
            {insets.right}
            {"\n"}
            Applied: t:{actualInsets.top} b:{actualInsets.bottom} l:
            {actualInsets.left} r:{actualInsets.right}
          </Text>
        </View>
      )}

      {children}
    </>
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
