/**
 * テーマコンテキスト
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * ライト/ダークモード切り替えとテーマ管理
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  lightColors, 
  darkColors, 
  ColorPalette, 
  learningColors, 
  categoryColors, 
  gradients, 
  shadows 
} from '../theme/colors';
import { typography, TypographyVariant } from '../theme/typography';
import { spacing, componentSpacing, layoutSpacing } from '../theme/spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
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
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'bookkeeping_theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // 実際のテーマ（ライト/ダーク）を決定
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // テーマオブジェクトの構築
  const theme: Theme = {
    mode: themeMode,
    isDark,
    colors: isDark ? darkColors : lightColors,
    learningColors: isDark ? learningColors.dark : learningColors.light,
    categoryColors: isDark ? categoryColors.dark : categoryColors.light,
    gradients: isDark ? gradients.dark : gradients.light,
    shadows: isDark ? shadows.dark : shadows.light,
    typography,
    spacing,
    componentSpacing,
    layoutSpacing,
  };

  // システムのカラースキーム変更を監視
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // 保存されたテーマ設定を復元
  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * テーマユーティリティフック
 */
export function useThemedStyles<T extends Record<string, any>>(
  createStyles: (theme: Theme) => T
): T {
  const { theme } = useTheme();
  return createStyles(theme);
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
 * アクセシビリティ対応のスタイル取得
 */
export function useAccessibleStyles() {
  const { theme } = useTheme();
  
  return {
    // 高コントラストモード対応
    getHighContrastColor: (normalColor: string, highContrastColor?: string) => {
      // 実際の実装では、ユーザーの設定を確認
      return highContrastColor || normalColor;
    },
    
    // 大きなフォントサイズ対応
    getScaledFontSize: (baseFontSize: number, scale: number = 1) => {
      return Math.round(baseFontSize * scale);
    },
    
    // 最小タッチターゲットサイズの確保
    getMinTouchTargetStyle: () => ({
      minHeight: 44,
      minWidth: 44,
    }),
  };
}

/**
 * レスポンシブデザイン対応
 */
export function useResponsiveTheme(screenWidth: number) {
  const { theme } = useTheme();
  
  const getBreakpoint = () => {
    if (screenWidth < 360) return 'xs';
    if (screenWidth < 414) return 'sm';
    if (screenWidth < 768) return 'md';
    if (screenWidth < 1024) return 'lg';
    return 'xl';
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