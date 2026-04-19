/**
 * 統合カラーシステム - 簿記3級問題集アプリ
 * UI/UX改善 + ゲーミフィケーション統合対応
 *
 * Phase 1: ブランドアイデンティティを反映した統一カラーパレット
 * アクセシビリティ（WCAG 2.2）準拠・ゲーミフィケーション要素対応
 */

export interface ColorPalette {
  // Primary Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary Colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Accent Color
  accent: string;

  // Background Colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceLight?: string;
  surfaceVariant?: string;
  card: string;

  // Status Background Colors
  infoBackground: string;
  warningBackground: string;
  successBackground: string;
  errorBackground: string;

  // Text Colors
  text: string;
  textSecondary: string;
  textDisabled: string;

  // Status Colors
  success: string;
  successLight?: string;
  successDark: string;
  warning: string;
  warningLight?: string;
  error: string;
  info: string;

  // Border Colors
  border: string;
  borderLight: string;

  // Status Border Colors
  successBorder: string;
  errorBorder: string;
  warningBorder: string;
  infoBorder: string;
  primaryBorder: string;

  // Interactive Colors
  link: string;
  linkHover: string;
  buttonPrimary: string;
  buttonSecondary: string;

  // Accessibility Colors (Phase 1)
  focus: string;
  focusHighContrast: string;
  outline: string;
  disabled: string;
  contrast: {
    high: string;
    medium: string;
    low: string;
  };
}

// 統合ブランドカラーパレット（刷新トンマナ対応）
export const brandColors = {
  // プライマリ: 落ち着きのあるティール
  primary: {
    50: "#F0F6F7",
    100: "#D7ECF0",
    200: "#B7DEE4",
    300: "#8DCBD4",
    400: "#65BBC8",
    500: "#3FADBB",
    600: "#2F8795",
    700: "#276F7B",
    800: "#1F5360",
    900: "#153A42",
  },

  // セカンダリ: 温かみのあるコーラル
  secondary: {
    50: "#FFF0EB",
    100: "#FFD9CF",
    200: "#FFB7A8",
    300: "#FF927F",
    400: "#FA7662",
    500: "#EB6A55",
    600: "#E15A3D",
    700: "#C74A31",
    800: "#AC3A24",
    900: "#7F2616",
  },

  // ゲーミフィケーション特化カラー（トンマナ調整）
  gamification: {
    rank: {
      trainee: "#B8B1AD",
      clerk: "#9B6B4E",
      supervisor: "#E6A75A",
      manager: "#EB6A55",
      director: "#B15E79",
      cfo: "#3FADBB",
      master: "#F3C863",
      grandmaster: "#F6F1E9",
    },
    bp: {
      primary: "#F3C863",
      earn: "#3FADBB",
      spend: "#E15A3D",
      bonus: "#F58B5A",
    },
    streak: {
      active: "#E15A3D",
      broken: "#9B9590",
      milestone: "#F3C863",
      special: "#B15E79",
    },
    badge: {
      bronze: "#C0825E",
      silver: "#C9C3BF",
      gold: "#F3C863",
      platinum: "#E8E2DC",
      diamond: "#B8E0E4",
    },
    company: {
      level1: "#F7E6B5",
      level5: "#F58B5A",
      level10: "#B15E79",
      revenue: "#3FADBB",
      growth: "#2F8795",
    },
  },

  // セマンティックカラー（アクセシビリティ強化）
  semantic: {
    success: "#2F8F80",
    warning: "#E6A75A",
    error: "#D6453D",
    info: "#3FADBB",
    notStarted: "#B8B1AD",
    inProgress: "#EB6A55",
    completed: "#3FADBB",
    mastered: "#276F7B",
    needsReview: "#D6453D",
  },

  // ニュートラル（温かみのあるトーン）
  neutral: {
    0: "#FFFFFF",
    50: "#FCFCFC",
    100: "#F7F3F0",
    200: "#EEE8E4",
    300: "#E0DAD8",
    400: "#CFC8C4",
    500: "#B8B1AD",
    600: "#9B9590",
    700: "#78736E",
    800: "#4F4B48",
    900: "#212121",
    1000: "#121111",
  },
};

// ダークモード対応パレット
export const darkBrandColors = {
  primary: {
    50: "#102E33",
    100: "#153D44",
    200: "#1B4D57",
    300: "#1F5E6A",
    400: "#23707E",
    500: "#2D8C99",
    600: "#45A6B3",
    700: "#6BC1CC",
    800: "#95D5DD",
    900: "#C4E7EE",
  },
  secondary: {
    50: "#401712",
    100: "#561C16",
    200: "#6E231B",
    300: "#872B21",
    400: "#A4352A",
    500: "#C14136",
    600: "#D95A4E",
    700: "#E98177",
    800: "#F4A9A0",
    900: "#FCD4CC",
  },
  gamification: brandColors.gamification,
  semantic: brandColors.semantic,
  neutral: {
    0: "#0F1112",
    50: "#141C1D",
    100: "#192325",
    200: "#1F2C2F",
    300: "#28373B",
    400: "#36474C",
    500: "#4C5D62",
    600: "#6A7A7E",
    700: "#8EA0A4",
    800: "#B5C3C5",
    900: "#E0EBEC",
    1000: "#FFFFFF",
  },
};

// Phase 1: 既存インターフェース対応（後方互換性）
export const lightColors: ColorPalette = {
  primary: brandColors.primary[600],
  primaryLight: brandColors.primary[400],
  primaryDark: brandColors.primary[700],

  secondary: brandColors.secondary[600],
  secondaryLight: brandColors.secondary[400],
  secondaryDark: brandColors.secondary[700],

  accent: brandColors.secondary[500],

  background: brandColors.neutral[50],
  backgroundSecondary: brandColors.neutral[100],
  surface: brandColors.neutral[0],
  card: brandColors.secondary[50],

  infoBackground: brandColors.primary[50],
  warningBackground: "#FFF3E5",
  successBackground: "#E4F3F2",
  errorBackground: "#FFE6E3",

  text: brandColors.neutral[900],
  textSecondary: brandColors.neutral[600],
  textDisabled: brandColors.neutral[400],

  success: brandColors.semantic.success,
  successDark: brandColors.primary[700],
  warning: brandColors.semantic.warning,
  error: brandColors.semantic.error,
  info: brandColors.semantic.info,

  border: brandColors.neutral[300],
  borderLight: brandColors.neutral[200],

  successBorder: brandColors.semantic.success,
  errorBorder: brandColors.semantic.error,
  warningBorder: brandColors.semantic.warning,
  infoBorder: brandColors.semantic.info,
  primaryBorder: brandColors.primary[600],

  link: brandColors.primary[600],
  linkHover: brandColors.primary[700],
  buttonPrimary: brandColors.primary[600],
  buttonSecondary: brandColors.neutral[500],

  focus: brandColors.secondary[600],
  focusHighContrast: brandColors.secondary[700],
  outline: brandColors.primary[600],
  disabled: brandColors.neutral[300],

  contrast: {
    high: brandColors.neutral[900],
    medium: brandColors.neutral[600],
    low: brandColors.neutral[400],
  },
};

export const darkColors: ColorPalette = {
  primary: darkBrandColors.primary[500],
  primaryLight: darkBrandColors.primary[400],
  primaryDark: darkBrandColors.primary[600],

  secondary: darkBrandColors.secondary[500],
  secondaryLight: darkBrandColors.secondary[400],
  secondaryDark: darkBrandColors.secondary[600],

  accent: darkBrandColors.secondary[500],

  background: darkBrandColors.neutral[50],
  backgroundSecondary: darkBrandColors.neutral[100],
  surface: darkBrandColors.neutral[100],
  card: darkBrandColors.neutral[200],

  infoBackground: darkBrandColors.primary[100],
  warningBackground: "#4A3426",
  successBackground: "#1F3C3B",
  errorBackground: "#3B2221",

  text: darkBrandColors.neutral[900],
  textSecondary: darkBrandColors.neutral[700],
  textDisabled: darkBrandColors.neutral[500],

  success: brandColors.semantic.success,
  successDark: darkBrandColors.primary[400],
  warning: brandColors.semantic.warning,
  error: brandColors.semantic.error,
  info: darkBrandColors.primary[500],

  border: darkBrandColors.neutral[300],
  borderLight: darkBrandColors.neutral[200],

  successBorder: brandColors.semantic.success,
  errorBorder: brandColors.semantic.error,
  warningBorder: brandColors.semantic.warning,
  infoBorder: darkBrandColors.primary[500],
  primaryBorder: darkBrandColors.primary[400],

  link: darkBrandColors.primary[500],
  linkHover: darkBrandColors.primary[600],
  buttonPrimary: darkBrandColors.primary[500],
  buttonSecondary: darkBrandColors.neutral[500],

  focus: darkBrandColors.secondary[500],
  focusHighContrast: darkBrandColors.secondary[600],
  outline: darkBrandColors.primary[400],
  disabled: darkBrandColors.neutral[500],

  contrast: {
    high: darkBrandColors.neutral[900],
    medium: darkBrandColors.neutral[700],
    low: darkBrandColors.neutral[500],
  },
};

/**
 * 学習状態別カラー
 */
export const learningColors = {
  light: {
    notStarted: "#D6D0CB",
    inProgress: "#F3A46C",
    completed: "#3FADBB",
    mastered: "#276F7B",
    needsReview: "#E15A3D",
  },
  dark: {
    notStarted: "#4C5D62",
    inProgress: "#E6A75A",
    completed: darkBrandColors.primary[500],
    mastered: darkBrandColors.primary[300],
    needsReview: darkBrandColors.secondary[500],
  },
};

/**
 * 分野別カラー
 */
export const categoryColors = {
  light: {
    journal: "#2F8795",
    ledger: "#84B3AC",
    trialBalance: "#E15A3D",
  },
  dark: {
    journal: darkBrandColors.primary[600],
    ledger: "#6BC1CC",
    trialBalance: darkBrandColors.secondary[600],
  },
};

/**
 * グラデーション定義
 */
export const gradients = {
  light: {
    primary: [brandColors.primary[400], brandColors.primary[600]],
    secondary: [brandColors.secondary[400], brandColors.secondary[600]],
    success: ["#3FAD9A", "#2F8F80"],
    warning: ["#F3A46C", "#E68041"],
    background: ["#FFF7F4", "#FCFCFC"],
  },
  dark: {
    primary: [darkBrandColors.primary[400], darkBrandColors.primary[600]],
    secondary: [darkBrandColors.secondary[400], darkBrandColors.secondary[600]],
    success: ["#2F6C6A", "#45A6B3"],
    warning: ["#B8713C", "#E6A75A"],
    background: ["#101517", "#192325"],
  },
};

/**
 * Shadow定義
 */
export const shadows = {
  light: {
    small: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

/**
 * カスタムテーマバリエーション（Phase 4拡張）
 */
export const customThemeVariants = {
  oceanic: {
    light: {
      primary: "#006064",
      primaryLight: "#4DB6AC",
      primaryDark: "#004D40",
      secondary: "#00ACC1",
      secondaryLight: "#4DD0E1",
      secondaryDark: "#00838F",
      accent: "#26C6DA",
      background: "#E0F2F1",
      surface: "#B2DFDB",
      card: "#FFFFFF",
    },
    dark: {
      primary: "#4DB6AC",
      primaryLight: "#80CBC4",
      primaryDark: "#26A69A",
      secondary: "#4DD0E1",
      secondaryLight: "#80DEEA",
      secondaryDark: "#26C6DA",
      accent: "#00BCD4",
      background: "#004D40",
      surface: "#00695C",
      card: "#00796B",
    },
  },
  forest: {
    light: {
      primary: "#2E7D32",
      primaryLight: "#66BB6A",
      primaryDark: "#1B5E20",
      secondary: "#689F38",
      secondaryLight: "#9CCC65",
      secondaryDark: "#33691E",
      accent: "#8BC34A",
      background: "#F1F8E9",
      surface: "#DCEDC8",
      card: "#FFFFFF",
    },
    dark: {
      primary: "#66BB6A",
      primaryLight: "#81C784",
      primaryDark: "#4CAF50",
      secondary: "#9CCC65",
      secondaryLight: "#AED581",
      secondaryDark: "#8BC34A",
      accent: "#CDDC39",
      background: "#1B5E20",
      surface: "#2E7D32",
      card: "#388E3C",
    },
  },
  sunset: {
    light: {
      primary: "#FF5722",
      primaryLight: "#FF8A65",
      primaryDark: "#D84315",
      secondary: "#FF9800",
      secondaryLight: "#FFB74D",
      secondaryDark: "#F57C00",
      accent: "#FFC107",
      background: "#FFF3E0",
      surface: "#FFE0B2",
      card: "#FFFFFF",
    },
    dark: {
      primary: "#FF8A65",
      primaryLight: "#FFAB91",
      primaryDark: "#FF7043",
      secondary: "#FFB74D",
      secondaryLight: "#FFCC02",
      secondaryDark: "#FF9800",
      accent: "#FFC107",
      background: "#D84315",
      surface: "#F4511E",
      card: "#FF5722",
    },
  },
  professional: {
    light: {
      primary: "#37474F",
      primaryLight: "#62727B",
      primaryDark: "#102027",
      secondary: "#546E7A",
      secondaryLight: "#819CA9",
      secondaryDark: "#29434E",
      accent: "#607D8B",
      background: "#FAFAFA",
      surface: "#F5F5F5",
      card: "#FFFFFF",
    },
    dark: {
      primary: "#62727B",
      primaryLight: "#90A4AE",
      primaryDark: "#455A64",
      secondary: "#819CA9",
      secondaryLight: "#B0BEC5",
      secondaryDark: "#607D8B",
      accent: "#90A4AE",
      background: "#102027",
      surface: "#263238",
      card: "#37474F",
    },
  },
  "high-contrast": {
    light: {
      primary: "#000000",
      primaryLight: "#424242",
      primaryDark: "#000000",
      secondary: "#1976D2",
      secondaryLight: "#42A5F5",
      secondaryDark: "#0D47A1",
      accent: "#D32F2F",
      background: "#FFFFFF",
      surface: "#F5F5F5",
      card: "#FFFFFF",
    },
    dark: {
      primary: "#FFFFFF",
      primaryLight: "#F5F5F5",
      primaryDark: "#EEEEEE",
      secondary: "#64B5F6",
      secondaryLight: "#90CAF9",
      secondaryDark: "#42A5F5",
      accent: "#FF5252",
      background: "#000000",
      surface: "#121212",
      card: "#1E1E1E",
    },
  },
};

/**
 * アクセシビリティユーティリティ（Phase 1）
 * WCAG 2.2準拠のコントラスト比計算と色選択
 */
export class AccessibilityColors {
  /**
   * 色をRGBに変換
   */
  private static hexToRgb(
    hex: string,
  ): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * 相対輝度の計算
   */
  private static luminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * コントラスト比の計算（WCAG 2.2準拠）
   */
  static calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = this.luminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.luminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * WCAG準拠チェック
   */
  static isWCAGCompliant(
    foreground: string,
    background: string,
    level: "AA" | "AAA" = "AA",
  ): boolean {
    const contrast = this.calculateContrastRatio(foreground, background);
    return level === "AA" ? contrast >= 4.5 : contrast >= 7;
  }

  /**
   * 最適なテキストカラーの選択
   */
  static getOptimalTextColor(
    backgroundColor: string,
    theme: "light" | "dark" = "light",
  ): string {
    const colors = theme === "light" ? lightColors : darkColors;

    // 高コントラストテキストをまず試す
    if (this.isWCAGCompliant(colors.contrast.high, backgroundColor)) {
      return colors.contrast.high;
    }

    // 中コントラストを試す
    if (this.isWCAGCompliant(colors.contrast.medium, backgroundColor)) {
      return colors.contrast.medium;
    }

    // フォールバック
    return colors.text;
  }

  /**
   * フォーカスカラーの選択（キーボードナビゲーション用）
   */
  static getFocusColor(
    isHighContrast: boolean = false,
    theme: "light" | "dark" = "light",
  ): string {
    const colors = theme === "light" ? lightColors : darkColors;
    return isHighContrast ? colors.focusHighContrast : colors.focus;
  }
}
