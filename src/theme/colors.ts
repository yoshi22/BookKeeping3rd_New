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

  // Background Colors
  background: string;
  surface: string;
  card: string;

  // Text Colors
  text: string;
  textSecondary: string;
  textDisabled: string;

  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border Colors
  border: string;
  borderLight: string;

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

// 統合ブランドカラーパレット（Phase 1実装）
export const brandColors = {
  // プライマリ: 信頼感のある青（簿記の堅実さ + ゲーミフィケーションの楽しさ）
  primary: {
    50: "#E3F2FD", // 背景・淡い装飾
    100: "#BBDEFB", // カード背景
    200: "#90CAF9", // ボタン無効状態
    300: "#64B5F6", // セカンダリボタン
    400: "#42A5F5", // ホバー状態
    500: "#2196F3", // メイン（現在の primary）
    600: "#1E88E5", // アクティブ状態
    700: "#1976D2", // 重要ボタン
    800: "#1565C0", // フォーカス状態
    900: "#0D47A1", // 最大強調
  },

  // セカンダリ: 成長・達成を表す緑（ゲーミフィケーション連携）
  secondary: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50", // メイン
    600: "#43A047",
    700: "#388E3C", // 現在の secondary
    800: "#2E7D32",
    900: "#1B5E20",
  },

  // ゲーミフィケーション特化カラー（Phase 2以降で活用）
  gamification: {
    // ランクカラー（簿記師レベル）
    rank: {
      trainee: "#9E9E9E", // 見習い帳簿係
      clerk: "#795548", // 帳簿管理者
      supervisor: "#FF9800", // 経理主任
      manager: "#FF5722", // 会計課長
      director: "#9C27B0", // 経理部長
      cfo: "#3F51B5", // CFO
      master: "#FFD700", // 簿記マスター（金）
      grandmaster: "#FFFFFF", // 簿記師範（プラチナ）
    },

    // BP（Bookkeeping Points）関連
    bp: {
      primary: "#FFC107", // BPメインカラー
      earn: "#4CAF50", // 獲得時
      spend: "#FF5722", // 消費時
      bonus: "#FF9800", // ボーナス倍率
    },

    // ストリーク
    streak: {
      active: "#FF5722", // アクティブストリーク
      broken: "#9E9E9E", // 途切れたストリーク
      milestone: "#FFD700", // マイルストーン
      special: "#9C27B0", // 特殊ストリーク
    },

    // バッジ・アチーブメント
    badge: {
      bronze: "#CD7F32",
      silver: "#C0C0C0",
      gold: "#FFD700",
      platinum: "#E5E4E2",
      diamond: "#B9F2FF",
    },

    // 会社シミュレーション
    company: {
      level1: "#FFEB3B", // 個人商店
      level5: "#FF9800", // 中小企業
      level10: "#9C27B0", // 上場企業
      revenue: "#4CAF50", // 売上
      growth: "#2196F3", // 成長
    },
  },

  // セマンティックカラー（アクセシビリティ強化）
  semantic: {
    success: "#4CAF50",
    warning: "#FFC107", // コントラスト改善
    error: "#F44336",
    info: "#2196F3",

    // 学習状態専用
    notStarted: "#9E9E9E",
    inProgress: "#FF9800",
    completed: "#4CAF50",
    mastered: "#2E7D32",
    needsReview: "#FF5722",
  },

  // ニュートラル（段階的グレースケール）
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    1000: "#000000",
  },
};

// ダークモード対応（Phase 2で拡張予定）
export const darkBrandColors = {
  primary: {
    50: "#0D47A1",
    100: "#1565C0",
    200: "#1976D2",
    300: "#1E88E5",
    400: "#2196F3",
    500: "#42A5F5", // ダークモードメイン
    600: "#64B5F6",
    700: "#90CAF9",
    800: "#BBDEFB",
    900: "#E3F2FD",
  },
  // 他のカラーも同様に反転（Phase 2で完全実装）
  secondary: brandColors.secondary, // 暫定的に同じ値を使用
  gamification: brandColors.gamification,
  semantic: brandColors.semantic,
  neutral: {
    0: "#000000",
    50: "#121212",
    100: "#1E1E1E",
    200: "#2C2C2C",
    300: "#424242",
    400: "#616161",
    500: "#757575",
    600: "#9E9E9E",
    700: "#BDBDBD",
    800: "#E0E0E0",
    900: "#F5F5F5",
    1000: "#FFFFFF",
  },
};

// Phase 1: 既存インターフェース対応（後方互換性）
export const lightColors: ColorPalette = {
  // Primary - 新brandColorsを使用
  primary: brandColors.primary[500],
  primaryLight: brandColors.primary[400],
  primaryDark: brandColors.primary[700],

  // Secondary - 新brandColorsを使用
  secondary: brandColors.secondary[700],
  secondaryLight: brandColors.secondary[400],
  secondaryDark: brandColors.secondary[800],

  // Background
  background: brandColors.neutral[0],
  surface: brandColors.neutral[50],
  card: brandColors.neutral[0],

  // Text
  text: brandColors.neutral[900],
  textSecondary: brandColors.neutral[600],
  textDisabled: brandColors.neutral[400],

  // Status - アクセシビリティ改善
  success: brandColors.semantic.success,
  warning: brandColors.semantic.warning,
  error: brandColors.semantic.error,
  info: brandColors.semantic.info,

  // Border
  border: brandColors.neutral[300],
  borderLight: brandColors.neutral[200],

  // Interactive
  link: brandColors.primary[500],
  linkHover: brandColors.primary[700],
  buttonPrimary: brandColors.primary[500],
  buttonSecondary: brandColors.neutral[500],

  // Accessibility (Phase 1) - WCAG 2.2準拠
  focus: brandColors.primary[600], // フォーカスリング
  focusHighContrast: brandColors.primary[800], // ハイコントラストモード
  outline: brandColors.primary[500], // アウトライン
  disabled: brandColors.neutral[300], // 無効状態

  contrast: {
    high: brandColors.neutral[900], // 高コントラスト（テキスト）
    medium: brandColors.neutral[600], // 中コントラスト（セカンダリテキスト）
    low: brandColors.neutral[400], // 低コントラスト（装飾）
  },
};

export const darkColors: ColorPalette = {
  // Primary - ダークモード対応
  primary: darkBrandColors.primary[500],
  primaryLight: darkBrandColors.primary[400],
  primaryDark: darkBrandColors.primary[700],

  // Secondary
  secondary: brandColors.secondary[400],
  secondaryLight: brandColors.secondary[300],
  secondaryDark: brandColors.secondary[600],

  // Background
  background: darkBrandColors.neutral[50],
  surface: darkBrandColors.neutral[100],
  card: darkBrandColors.neutral[200],

  // Text
  text: darkBrandColors.neutral[1000],
  textSecondary: darkBrandColors.neutral[700],
  textDisabled: darkBrandColors.neutral[500],

  // Status
  success: brandColors.secondary[400],
  warning: "#FFB74D",
  error: "#EF5350",
  info: darkBrandColors.primary[500],

  // Border
  border: darkBrandColors.neutral[300],
  borderLight: darkBrandColors.neutral[200],

  // Interactive
  link: darkBrandColors.primary[500],
  linkHover: darkBrandColors.primary[400],
  buttonPrimary: darkBrandColors.primary[500],
  buttonSecondary: darkBrandColors.neutral[500],

  // Accessibility (Phase 1) - ダークモード対応
  focus: darkBrandColors.primary[400], // ダークモードでのフォーカスリング
  focusHighContrast: darkBrandColors.primary[300], // ハイコントラストモード
  outline: darkBrandColors.primary[500], // アウトライン
  disabled: darkBrandColors.neutral[500], // 無効状態

  contrast: {
    high: darkBrandColors.neutral[1000], // 高コントラスト（テキスト）
    medium: darkBrandColors.neutral[700], // 中コントラスト
    low: darkBrandColors.neutral[500], // 低コントラスト
  },
};

/**
 * 学習状態別カラー
 */
export const learningColors = {
  light: {
    notStarted: "#E0E0E0",
    inProgress: "#FFC107",
    completed: "#4CAF50",
    mastered: "#2E7D32",
    needsReview: "#FF5722",
  },
  dark: {
    notStarted: "#424242",
    inProgress: "#FFB74D",
    completed: "#66BB6A",
    mastered: "#81C784",
    needsReview: "#FF7043",
  },
};

/**
 * 分野別カラー
 */
export const categoryColors = {
  light: {
    journal: "#1976D2", // 仕訳 - ブルー
    ledger: "#388E3C", // 帳簿 - グリーン
    trialBalance: "#F57C00", // 試算表 - オレンジ
  },
  dark: {
    journal: "#90CAF9",
    ledger: "#81C784",
    trialBalance: "#FFB74D",
  },
};

/**
 * グラデーション定義
 */
export const gradients = {
  light: {
    primary: ["#1976D2", "#42A5F5"],
    secondary: ["#388E3C", "#66BB6A"],
    success: ["#4CAF50", "#81C784"],
    warning: ["#FF9800", "#FFB74D"],
    background: ["#F5F7FA", "#FFFFFF"],
  },
  dark: {
    primary: ["#64B5F6", "#90CAF9"],
    secondary: ["#66BB6A", "#81C784"],
    success: ["#66BB6A", "#A5D6A7"],
    warning: ["#FFB74D", "#FFCC02"],
    background: ["#121212", "#1E1E1E"],
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
