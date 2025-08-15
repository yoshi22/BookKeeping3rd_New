/**
 * 統合タイポグラフィシステム - 簿記3級問題集アプリ
 * UI/UX改善 Phase 1: UDフォント・視認性向上対応
 *
 * UDフォント採用によるアクセシビリティ向上
 * プラットフォーム別最適化でフォントレンダリング品質統一
 */

import { TextStyle, Platform } from "react-native";

export interface TypographyVariant {
  fontSize: number;
  lineHeight: number;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  letterSpacing?: number;
}

/**
 * フォントサイズスケール（視認性向上・アクセシビリティ対応）
 * 最小可読サイズを14pxに引き上げ
 */
export const fontSizes = {
  xs: 14, // 12 → 14 (最小可読サイズ確保)
  sm: 16, // 14 → 16
  base: 18, // 16 → 18 (基準サイズアップ)
  lg: 20, // 18 → 20
  xl: 24, // 20 → 24
  "2xl": 28, // 24 → 28
  "3xl": 32, // 30 → 32
  "4xl": 40, // 36 → 40
  "5xl": 52, // 48 → 52
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
    fontSize: fontSizes["4xl"],
    lineHeight: fontSizes["4xl"] * lineHeights.tight,
    fontWeight: "700",
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontSize: fontSizes["3xl"],
    lineHeight: fontSizes["3xl"] * lineHeights.tight,
    fontWeight: "600",
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontSize: fontSizes["2xl"],
    lineHeight: fontSizes["2xl"] * lineHeights.normal,
    fontWeight: "600",
  },
  h4: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.normal,
    fontWeight: "600",
  },
  h5: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: "600",
  },
  h6: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: "600",
  },

  // 本文
  body1: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    fontWeight: "400",
  },
  body2: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    fontWeight: "400",
  },

  // キャプション・補助テキスト
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: "400",
    letterSpacing: letterSpacings.wide,
  },
  subtitle1: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: "500",
  },
  subtitle2: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: "500",
  },

  // ボタン
  button: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.tight,
    fontWeight: "600",
    letterSpacing: letterSpacings.wide,
  },
  buttonLarge: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.tight,
    fontWeight: "600",
    letterSpacing: letterSpacings.wide,
  },

  // 数値・データ表示
  numeric: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.tight,
    fontWeight: "600",
    letterSpacing: letterSpacings.normal,
  },
  numericLarge: {
    fontSize: fontSizes["2xl"],
    lineHeight: fontSizes["2xl"] * lineHeights.tight,
    fontWeight: "700",
  },

  // 問題・解説用
  question: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    fontWeight: "400",
  },
  questionTitle: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: "600",
  },
  explanation: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    fontWeight: "400",
  },

  // エラー・警告
  error: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: "500",
  },
  warning: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: "500",
  },
};

/**
 * 統合フォントシステム（UD・アクセシビリティ対応）
 * プラットフォーム別最適化で視認性統一
 */
export const japaneseFontFamily = {
  ios: {
    primary: "Hiragino UD Sans", // UD版に変更
    fallback: "Hiragino Sans",
    systemFallback: "System",
  },
  android: {
    primary: "Noto Sans JP", // CJK JPより軽量・高品質
    weight: {
      regular: "400",
      medium: "500",
      bold: "700",
    },
    systemFallback: "sans-serif",
  },
  web: 'Inter, "Noto Sans JP", sans-serif',
};

/**
 * プラットフォーム最適化フォント取得
 */
export const getOptimizedFont = (weight: string = "400") => {
  if (Platform.OS === "ios") {
    return {
      fontFamily: japaneseFontFamily.ios.primary,
      fontWeight: weight,
      letterSpacing: 0.15, // iOS最適化
    };
  } else if (Platform.OS === "android") {
    return {
      fontFamily: japaneseFontFamily.android.primary,
      fontWeight: weight,
      letterSpacing: 0.25, // Android最適化
      includeFontPadding: false, // Android特有の余白問題解決
      textAlignVertical: "center" as const,
    };
  }
  return {
    fontFamily: "System",
    fontWeight: weight,
  };
};

/**
 * タイポグラフィユーティリティ関数
 */
export class TypographyUtils {
  /**
   * バリアントからTextStyleを生成（最適化フォント適用）
   */
  static getTextStyle(variant: keyof typeof typography): TextStyle {
    const typographyVariant = typography[variant];
    const optimizedFont = getOptimizedFont(typographyVariant.fontWeight);

    return {
      fontSize: typographyVariant.fontSize,
      lineHeight: typographyVariant.lineHeight,
      letterSpacing:
        typographyVariant.letterSpacing || optimizedFont.letterSpacing,
      ...optimizedFont, // プラットフォーム最適化を適用
    };
  }

  /**
   * カスタムスタイル付きTextStyle生成
   */
  static getCustomTextStyle(
    variant: keyof typeof typography,
    customWeight?: string,
    customSpacing?: number,
  ): TextStyle {
    const typographyVariant = typography[variant];
    const weight = customWeight || typographyVariant.fontWeight;
    const optimizedFont = getOptimizedFont(weight);

    return {
      fontSize: typographyVariant.fontSize,
      lineHeight: typographyVariant.lineHeight,
      letterSpacing:
        customSpacing ??
        typographyVariant.letterSpacing ??
        optimizedFont.letterSpacing,
      ...optimizedFont,
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
  static getAccessibleFontSize(
    baseSize: number,
    fontSizeMultiplier: number = 1,
  ): number {
    return Math.round(baseSize * fontSizeMultiplier);
  }

  /**
   * 行の高さを自動計算
   */
  static calculateLineHeight(
    fontSize: number,
    density: "tight" | "normal" | "relaxed" = "normal",
  ): number {
    return fontSize * lineHeights[density];
  }

  /**
   * 簿記アプリ特化：数値表示用スタイル
   */
  static getNumericStyle(
    size: "small" | "medium" | "large" = "medium",
  ): TextStyle {
    const baseSize =
      size === "small"
        ? fontSizes.base
        : size === "large"
          ? fontSizes["2xl"]
          : fontSizes.lg;
    const optimizedFont = getOptimizedFont("600");

    return {
      fontSize: baseSize,
      lineHeight: baseSize * lineHeights.tight,
      letterSpacing: 0.5, // 数字の視認性向上
      ...optimizedFont,
      fontVariant: ["tabular-nums"], // 等幅数字
    };
  }

  /**
   * 簿記アプリ特化：勘定科目名用スタイル
   */
  static getAccountNameStyle(): TextStyle {
    const optimizedFont = getOptimizedFont("500");

    return {
      fontSize: fontSizes.base,
      lineHeight: fontSizes.base * lineHeights.normal,
      letterSpacing: 0.2, // 日本語テキストの視認性向上
      ...optimizedFont,
    };
  }

  /**
   * Dynamic Type対応（iOS）とFont Scale対応（Android）
   */
  static getAccessibilityOptimizedStyle(
    variant: keyof typeof typography,
    accessibilityScale: number = 1,
  ): TextStyle {
    const baseStyle = this.getTextStyle(variant);
    const scaledFontSize = Math.round(baseStyle.fontSize! * accessibilityScale);

    return {
      ...baseStyle,
      fontSize: scaledFontSize,
      lineHeight: scaledFontSize * lineHeights.normal,
    };
  }
}

/**
 * 特定用途向けのテキストスタイル（最適化フォント適用）
 */
export const specialTextStyles = {
  // 勘定科目名
  accountName: {
    ...TypographyUtils.getAccountNameStyle(),
    fontWeight: "600" as const,
  },

  // 金額表示
  amount: {
    ...TypographyUtils.getNumericStyle("medium"),
    fontWeight: "700" as const,
  },

  // 大きな金額表示
  amountLarge: {
    ...TypographyUtils.getNumericStyle("large"),
    fontWeight: "800" as const,
  },

  // 日付表示
  date: {
    ...TypographyUtils.getTextStyle("caption"),
    fontWeight: "500" as const,
    letterSpacing: letterSpacings.wide,
  },

  // スコア表示
  score: {
    ...TypographyUtils.getNumericStyle("large"),
    fontWeight: "800" as const,
    fontSize: fontSizes["3xl"], // さらに大きく
  },

  // タイマー表示
  timer: {
    ...TypographyUtils.getNumericStyle("medium"),
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
    fontWeight: "700" as const,
  },

  // 問題文表示（視認性重視）
  questionText: {
    ...TypographyUtils.getTextStyle("question"),
    fontSize: fontSizes.base, // 18px（増量）
    lineHeight: fontSizes.base * lineHeights.relaxed,
  },

  // 選択肢表示
  choiceText: {
    ...TypographyUtils.getTextStyle("body1"),
    fontSize: fontSizes.sm, // 16px（増量）
  },

  // ヘルプ・説明文
  helpText: {
    ...TypographyUtils.getTextStyle("explanation"),
    fontSize: fontSizes.sm, // 16px（増量）
    color: "#666666", // 控えめな色
  },
};
