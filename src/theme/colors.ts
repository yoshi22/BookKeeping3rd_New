/**
 * カラーテーマ定義
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * ライトモード・ダークモード対応のカラーシステム
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
}

export const lightColors: ColorPalette = {
  // Primary - 簿記らしい落ち着いたブルー
  primary: '#1976D2',
  primaryLight: '#42A5F5',
  primaryDark: '#1565C0',
  
  // Secondary - アクセントとしてのグリーン
  secondary: '#388E3C',
  secondaryLight: '#66BB6A',
  secondaryDark: '#2E7D32',
  
  // Background
  background: '#FFFFFF',
  surface: '#F5F7FA',
  card: '#FFFFFF',
  
  // Text
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  
  // Interactive
  link: '#1976D2',
  linkHover: '#1565C0',
  buttonPrimary: '#1976D2',
  buttonSecondary: '#6C757D',
};

export const darkColors: ColorPalette = {
  // Primary - ダークモード対応
  primary: '#90CAF9',
  primaryLight: '#BBDEFB',
  primaryDark: '#64B5F6',
  
  // Secondary
  secondary: '#81C784',
  secondaryLight: '#A5D6A7',
  secondaryDark: '#66BB6A',
  
  // Background
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textDisabled: '#666666',
  
  // Status
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  info: '#64B5F6',
  
  // Border
  border: '#424242',
  borderLight: '#333333',
  
  // Interactive
  link: '#90CAF9',
  linkHover: '#BBDEFB',
  buttonPrimary: '#90CAF9',
  buttonSecondary: '#757575',
};

/**
 * 学習状態別カラー
 */
export const learningColors = {
  light: {
    notStarted: '#E0E0E0',
    inProgress: '#FFC107',
    completed: '#4CAF50',
    mastered: '#2E7D32',
    needsReview: '#FF5722',
  },
  dark: {
    notStarted: '#424242',
    inProgress: '#FFB74D',
    completed: '#66BB6A',
    mastered: '#81C784',
    needsReview: '#FF7043',
  },
};

/**
 * 分野別カラー
 */
export const categoryColors = {
  light: {
    journal: '#1976D2',     // 仕訳 - ブルー
    ledger: '#388E3C',      // 帳簿 - グリーン
    trialBalance: '#F57C00', // 試算表 - オレンジ
  },
  dark: {
    journal: '#90CAF9',
    ledger: '#81C784',
    trialBalance: '#FFB74D',
  },
};

/**
 * グラデーション定義
 */
export const gradients = {
  light: {
    primary: ['#1976D2', '#42A5F5'],
    secondary: ['#388E3C', '#66BB6A'],
    success: ['#4CAF50', '#81C784'],
    warning: ['#FF9800', '#FFB74D'],
    background: ['#F5F7FA', '#FFFFFF'],
  },
  dark: {
    primary: ['#64B5F6', '#90CAF9'],
    secondary: ['#66BB6A', '#81C784'],
    success: ['#66BB6A', '#A5D6A7'],
    warning: ['#FFB74D', '#FFCC02'],
    background: ['#121212', '#1E1E1E'],
  },
};

/**
 * Shadow定義
 */
export const shadows = {
  light: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};