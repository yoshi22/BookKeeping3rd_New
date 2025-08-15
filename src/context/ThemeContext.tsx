/**
 * テーマコンテキスト（Phase 4）
 * ダークモード完全対応・システム設定連携・テーマ永続化
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  Appearance,
  ColorSchemeName,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeDatabase } from "../data/migrations/index";
import {
  lightColors,
  darkColors,
  ColorPalette,
  learningColors,
  categoryColors,
  gradients,
  shadows,
  brandColors,
  AccessibilityColors,
} from "../theme/colors";
import { typography, TypographyVariant } from "../theme/typography";
import { spacing, componentSpacing, layoutSpacing } from "../theme/spacing";
import { useAccessibility } from "../hooks/useAccessibility";

export type ThemeMode = "light" | "dark" | "system";
export type ActiveTheme = "light" | "dark";
export type CustomThemeVariant =
  | "default"
  | "oceanic"
  | "forest"
  | "sunset"
  | "professional"
  | "high-contrast";

export interface Theme {
  mode: ThemeMode;
  activeTheme: ActiveTheme;
  isDark: boolean;
  colors: ColorPalette;
  learningColors: typeof learningColors.light;
  categoryColors: typeof categoryColors.light;
  gradients: typeof gradients.light;
  shadows: typeof shadows.light;
  typography: typeof typography;
  spacing: typeof spacing;
  componentSpacing: typeof componentSpacing;
  layoutSpacing: typeof layoutSpacing;

  // Phase 4: ダークモード拡張機能
  brandColors: typeof brandColors;
  isSystemMode: boolean;
  systemTheme: ActiveTheme;

  // カスタムテーマ機能
  customVariant: CustomThemeVariant;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Phase 4: 新機能
  activeTheme: ActiveTheme;
  isDark: boolean;
  isSystemMode: boolean;
  getThemedColor: (lightColor: string, darkColor: string) => string;
  getStatusBarStyle: () => "light-content" | "dark-content";
  getOptimalTextColor: (backgroundColor: string) => string;

  // カスタムテーマ機能
  customVariant: CustomThemeVariant;
  setCustomVariant: (variant: CustomThemeVariant) => void;

  // アクセシビリティ対応
  isHighContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "bookkeeping_theme_mode";
const HIGH_CONTRAST_STORAGE_KEY = "bookkeeping_high_contrast";
const CUSTOM_VARIANT_STORAGE_KEY = "bookkeeping_custom_variant";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  const [customVariant, setCustomVariantState] =
    useState<CustomThemeVariant>("default");
  const { isHighContrastEnabled } = useAccessibility();

  // システムテーマの取得
  const systemTheme: ActiveTheme =
    systemColorScheme === "dark" ? "dark" : "light";

  // アクティブテーマの計算
  const activeTheme: ActiveTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemTheme;
    }
    return themeMode as ActiveTheme;
  }, [themeMode, systemTheme]);

  // 実際のテーマ（ライト/ダーク）を決定
  const isDark = activeTheme === "dark";
  const isSystemMode = themeMode === "system";

  // カラーパレットの選択（アクセシビリティ対応）
  const colors = useMemo(() => {
    const baseColors = isDark ? darkColors : lightColors;

    // ハイコントラストモード対応
    if (isHighContrastMode || isHighContrastEnabled) {
      return {
        ...baseColors,
        text: baseColors.contrast.high,
        focus: baseColors.focusHighContrast,
        border: isDark ? "#FFFFFF" : "#000000",
        surface: isDark ? "#000000" : "#FFFFFF",
        background: isDark ? "#000000" : "#FFFFFF",
      };
    }

    return baseColors;
  }, [isDark, isHighContrastMode, isHighContrastEnabled]);

  // テーマオブジェクトの構築
  const theme: Theme = useMemo(
    () => ({
      mode: themeMode,
      activeTheme,
      isDark,
      colors,
      learningColors: isDark ? learningColors.dark : learningColors.light,
      categoryColors: isDark ? categoryColors.dark : categoryColors.light,
      gradients: isDark ? gradients.dark : gradients.light,
      shadows: isDark ? shadows.dark : shadows.light,
      typography,
      spacing,
      componentSpacing,
      layoutSpacing,
      brandColors,
      isSystemMode,
      systemTheme,
    }),
    [themeMode, activeTheme, isDark, colors, isSystemMode, systemTheme],
  );

  // システムのカラースキーム変更を監視
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // StatusBarの更新（Phase 4）
  useEffect(() => {
    if (Platform.OS === "ios") {
      StatusBar.setBarStyle(isDark ? "light-content" : "dark-content", true);
    } else {
      StatusBar.setBackgroundColor(colors.surface, true);
      StatusBar.setBarStyle(isDark ? "light-content" : "dark-content", true);
    }
  }, [isDark, colors.surface]);

  // データベース初期化とテーマ設定復元
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("[ThemeProvider] アプリ初期化開始");
        // データベース初期化を最優先で実行
        await initializeDatabase();
        console.log("[ThemeProvider] データベース初期化完了");

        // テーマ設定復元
        await loadThemeSettings();
        console.log("[ThemeProvider] テーマ設定復元完了");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("[ThemeProvider] アプリ初期化エラー:", errorMessage);
        console.error("[ThemeProvider] エラー詳細:", error);
        // エラーメッセージを短縮して表示
        const shortMessage =
          errorMessage.length > 100
            ? errorMessage.substring(0, 100) + "..."
            : errorMessage;
        Alert.alert(
          "初期化エラー",
          `データベース初期化に失敗しました: ${shortMessage}`,
          [{ text: "OK" }],
        );
        // エラーが発生してもアプリは継続
      }
    };

    initializeApp();
  }, []);

  // テーマ設定の読み込み（Phase 4拡張）
  const loadThemeSettings = useCallback(async () => {
    try {
      const [savedMode, savedHighContrast] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(HIGH_CONTRAST_STORAGE_KEY),
      ]);

      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }

      if (savedHighContrast) {
        setIsHighContrastMode(savedHighContrast === "true");
      }
    } catch (error) {
      console.error("[ThemeProvider] テーマ設定読み込みエラー:", error);
    }
  }, []);

  // テーマモード設定（Phase 4拡張）
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("[ThemeProvider] テーマモード保存エラー:", error);
    }
  }, []);

  // ハイコントラストモード設定（Phase 4新機能）
  const setHighContrastMode = useCallback(async (enabled: boolean) => {
    try {
      setIsHighContrastMode(enabled);
      await AsyncStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, enabled.toString());
    } catch (error) {
      console.error("[ThemeProvider] ハイコントラスト設定保存エラー:", error);
    }
  }, []);

  // テーマ切り替え（Phase 4拡張：system モードを含む）
  const toggleTheme = useCallback(() => {
    const nextMode: ThemeMode =
      themeMode === "light"
        ? "dark"
        : themeMode === "dark"
          ? "system"
          : "light";
    setThemeMode(nextMode);
  }, [themeMode, setThemeMode]);

  // ユーティリティ関数（Phase 4新機能）
  const getThemedColor = useCallback(
    (lightColor: string, darkColor: string) => {
      return isDark ? darkColor : lightColor;
    },
    [isDark],
  );

  const getStatusBarStyle = useCallback(() => {
    return isDark ? "light-content" : "dark-content";
  }, [isDark]);

  const getOptimalTextColor = useCallback(
    (backgroundColor: string) => {
      return AccessibilityColors.getOptimalTextColor(
        backgroundColor,
        isDark ? "dark" : "light",
      );
    },
    [isDark],
  );

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
      toggleTheme,

      // Phase 4: 新機能
      activeTheme,
      isDark,
      isSystemMode,
      getThemedColor,
      getStatusBarStyle,
      getOptimalTextColor,

      // アクセシビリティ対応
      isHighContrastMode,
      setHighContrastMode,
    }),
    [
      theme,
      themeMode,
      setThemeMode,
      toggleTheme,
      activeTheme,
      isDark,
      isSystemMode,
      getThemedColor,
      getStatusBarStyle,
      getOptimalTextColor,
      isHighContrastMode,
      setHighContrastMode,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * テーマユーティリティフック（Phase 4拡張）
 */
export function useThemedStyles<T extends Record<string, any>>(
  createStyles: (theme: Theme) => T,
): T {
  const { theme } = useTheme();
  return useMemo(() => createStyles(theme), [createStyles, theme]);
}

/**
 * カラーパレットの取得
 */
export function useColors(): ColorPalette {
  const { theme } = useTheme();
  return theme.colors;
}

/**
 * 学習状態に応じた色の取得
 */
export function useLearningColors() {
  const { theme } = useTheme();
  return theme.learningColors;
}

/**
 * 分野別カラーの取得
 */
export function useCategoryColors() {
  const { theme } = useTheme();
  return theme.categoryColors;
}

/**
 * タイポグラフィスタイルの取得
 */
export function useTypography() {
  const { theme } = useTheme();
  return theme.typography;
}

/**
 * スペーシングの取得
 */
export function useSpacing() {
  const { theme } = useTheme();
  return {
    spacing: theme.spacing,
    componentSpacing: theme.componentSpacing,
    layoutSpacing: theme.layoutSpacing,
  };
}

/**
 * テーマアウェア値フック（Phase 4新機能）
 */
export function useThemedValue<T>(lightValue: T, darkValue: T): T {
  const { isDark } = useTheme();
  return isDark ? darkValue : lightValue;
}

/**
 * 条件付きカラーフック（Phase 4新機能）
 */
export function useThemedColor(lightColor: string, darkColor: string): string {
  const { getThemedColor } = useTheme();
  return getThemedColor(lightColor, darkColor);
}

/**
 * 動的カラーフック（Phase 4新機能）
 */
export function useDynamicColors() {
  const { theme, getThemedColor, getOptimalTextColor } = useTheme();

  return {
    ...theme.colors,
    getThemedColor,
    getOptimalTextColor,
    adaptive: {
      card: getThemedColor("#FFFFFF", "#1E1E1E"),
      border: getThemedColor("#E0E0E0", "#424242"),
      divider: getThemedColor("#F0F0F0", "#333333"),
      overlay: getThemedColor("rgba(0,0,0,0.5)", "rgba(255,255,255,0.1)"),
    },
  };
}

/**
 * アクセシビリティ対応のスタイル取得（Phase 4拡張）
 */
export function useAccessibleStyles() {
  const { theme, isHighContrastMode, getOptimalTextColor } = useTheme();
  const { isReduceMotionEnabled, isLargeTextEnabled } = useAccessibility();

  return {
    // 高コントラストモード対応（Phase 4改善）
    getHighContrastColor: (normalColor: string, highContrastColor?: string) => {
      if (isHighContrastMode) {
        return highContrastColor || theme.colors.contrast.high;
      }
      return normalColor;
    },

    // 大きなフォントサイズ対応（Phase 4改善）
    getScaledFontSize: (baseFontSize: number, scale: number = 1) => {
      const adaptiveScale = isLargeTextEnabled ? 1.3 : 1;
      return Math.round(baseFontSize * scale * adaptiveScale);
    },

    // 最小タッチターゲットサイズの確保（Phase 4拡張）
    getMinTouchTargetStyle: () => ({
      minHeight: 44,
      minWidth: 44,
      padding: 8, // 余裕を持たせる
    }),

    // Phase 4: 新機能
    getOptimalTextColor,

    // フォーカス可視化スタイル
    getFocusStyle: () => ({
      borderWidth: 2,
      borderColor: theme.colors.focus,
      borderRadius: 4,
    }),

    // アニメーション制御
    getAnimationDuration: (duration: number) => {
      return isReduceMotionEnabled ? 0 : duration;
    },

    // コントラスト比確認
    checkContrast: (foreground: string, background: string) => {
      return AccessibilityColors.isWCAGCompliant(foreground, background);
    },
  };
}

/**
 * レスポンシブデザイン対応
 */
export function useResponsiveTheme(screenWidth: number) {
  const { theme } = useTheme();

  const getBreakpoint = () => {
    if (screenWidth < 360) return "xs";
    if (screenWidth < 414) return "sm";
    if (screenWidth < 768) return "md";
    if (screenWidth < 1024) return "lg";
    return "xl";
  };

  const breakpoint = getBreakpoint();

  const getResponsiveSpacing = (base: number) => {
    const multipliers = { xs: 0.8, sm: 0.9, md: 1, lg: 1.1, xl: 1.2 };
    return Math.round(base * (multipliers[breakpoint] || 1));
  };

  const getResponsiveFontSize = (base: number) => {
    const multipliers = { xs: 0.9, sm: 0.95, md: 1, lg: 1.05, xl: 1.1 };
    return Math.round(base * (multipliers[breakpoint] || 1));
  };

  return {
    ...theme,
    breakpoint,
    getResponsiveSpacing,
    getResponsiveFontSize,
  };
}
