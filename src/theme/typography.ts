/**
 * タイポグラフィ定義
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * 一貫したテキストスタイルシステム
 */

import { TextStyle } from 'react-native';

export interface TypographyVariant {
  fontSize: number;
  lineHeight: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number;
}

/**
 * フォントサイズスケール
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

/**
 * 行の高さスケール
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

/**
 * 文字間隔スケール
 */
export const letterSpacings = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

/**
 * タイポグラフィバリアント
 */
export const typography: Record<string, TypographyVariant> = {
  // 見出し
  h1: {
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    fontWeight: '700',
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    fontWeight: '600',
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
    fontWeight: '600',
  },
  h4: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.normal,
    fontWeight: '600',
  },
  h5: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: '600',
  },
  h6: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: '600',
  },

  // 本文
  body1: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    fontWeight: '400',
  },
  body2: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    fontWeight: '400',
  },

  // キャプション・補助テキスト
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: '400',
    letterSpacing: letterSpacings.wide,
  },
  subtitle1: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: '500',
  },
  subtitle2: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: '500',
  },

  // ボタン
  button: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.tight,
    fontWeight: '600',
    letterSpacing: letterSpacings.wide,
  },
  buttonLarge: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.tight,
    fontWeight: '600',
    letterSpacing: letterSpacings.wide,
  },

  // 数値・データ表示
  numeric: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.tight,
    fontWeight: '600',
    letterSpacing: letterSpacings.normal,
  },
  numericLarge: {
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
    fontWeight: '700',
  },

  // 問題・解説用
  question: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    fontWeight: '400',
  },
  questionTitle: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: '600',
  },
  explanation: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    fontWeight: '400',
  },

  // エラー・警告
  error: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: '500',
  },
  warning: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: '500',
  },
};

/**
 * 日本語フォント最適化
 */
export const japaneseFontFamily = {
  ios: 'Hiragino Sans',
  android: 'Noto Sans CJK JP',
  default: 'System',
};

/**
 * タイポグラフィユーティリティ関数
 */
export class TypographyUtils {
  /**
   * バリアントからTextStyleを生成
   */
  static getTextStyle(variant: keyof typeof typography): TextStyle {
    const typographyVariant = typography[variant];
    return {
      fontSize: typographyVariant.fontSize,
      lineHeight: typographyVariant.lineHeight,
      fontWeight: typographyVariant.fontWeight,
      letterSpacing: typographyVariant.letterSpacing,
      fontFamily: japaneseFontFamily.default,
    };
  }

  /**
   * レスポンシブフォントサイズ計算
   */
  static getResponsiveFontSize(baseSize: number, screenWidth: number): number {
    const baseWidth = 375; // iPhone X baseline
    const scaleFactor = screenWidth / baseWidth;
    const minScale = 0.8;
    const maxScale = 1.2;
    
    const clampedScale = Math.max(minScale, Math.min(maxScale, scaleFactor));
    return Math.round(baseSize * clampedScale);
  }

  /**
   * アクセシビリティ対応フォントサイズ
   */
  static getAccessibleFontSize(baseSize: number, fontSizeMultiplier: number = 1): number {
    return Math.round(baseSize * fontSizeMultiplier);
  }

  /**
   * 行の高さを自動計算
   */
  static calculateLineHeight(fontSize: number, density: 'tight' | 'normal' | 'relaxed' = 'normal'): number {
    return fontSize * lineHeights[density];
  }
}

/**
 * 特定用途向けのテキストスタイル
 */
export const specialTextStyles = {
  // 勘定科目名
  accountName: {
    ...typography.subtitle1,
    fontWeight: '600' as const,
    letterSpacing: letterSpacings.normal,
  },
  
  // 金額表示
  amount: {
    ...typography.numeric,
    fontWeight: '700' as const,
    letterSpacing: letterSpacings.normal,
  },
  
  // 日付表示
  date: {
    ...typography.caption,
    fontWeight: '500' as const,
    letterSpacing: letterSpacings.wide,
  },
  
  // スコア表示
  score: {
    ...typography.numericLarge,
    fontWeight: '800' as const,
  },
  
  // タイマー表示
  timer: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
    fontWeight: '700' as const,
    letterSpacing: letterSpacings.normal,
  },
};