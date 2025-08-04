/**
 * スペーシングシステム
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * 一貫したレイアウトスペーシング定義
 */

/**
 * 基本スペーシングユニット (4px)
 */
export const SPACING_UNIT = 4;

/**
 * スペーシングスケール
 */
export const spacing = {
  xs: SPACING_UNIT,      // 4px
  sm: SPACING_UNIT * 2,  // 8px
  md: SPACING_UNIT * 3,  // 12px
  lg: SPACING_UNIT * 4,  // 16px
  xl: SPACING_UNIT * 5,  // 20px
  '2xl': SPACING_UNIT * 6, // 24px
  '3xl': SPACING_UNIT * 8, // 32px
  '4xl': SPACING_UNIT * 10, // 40px
  '5xl': SPACING_UNIT * 12, // 48px
  '6xl': SPACING_UNIT * 16, // 64px
} as const;

/**
 * コンポーネント別スペーシング
 */
export const componentSpacing = {
  // カード
  card: {
    padding: spacing.lg,
    margin: spacing.md,
    gap: spacing.md,
  },
  
  // ボタン
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    margin: spacing.sm,
    gap: spacing.sm,
  },
  
  // フォーム
  form: {
    fieldGap: spacing.lg,
    labelGap: spacing.sm,
    sectionGap: spacing['2xl'],
    padding: spacing.lg,
  },
  
  // リスト
  list: {
    itemPadding: spacing.lg,
    itemGap: spacing.sm,
    sectionGap: spacing.xl,
  },
  
  // ヘッダー
  header: {
    padding: spacing.lg,
    bottomMargin: spacing.md,
  },
  
  // タブバー
  tabBar: {
    padding: spacing.sm,
    iconGap: spacing.xs,
  },
  
  // モーダル
  modal: {
    padding: spacing['2xl'],
    margin: spacing.lg,
    gap: spacing.lg,
  },
  
  // 問題表示
  question: {
    padding: spacing.lg,
    titleGap: spacing.md,
    contentGap: spacing.lg,
    optionGap: spacing.md,
  },
  
  // 統計表示
  stats: {
    cardGap: spacing.md,
    itemGap: spacing.sm,
    sectionGap: spacing.xl,
  },
} as const;

/**
 * レイアウト用スペーシング
 */
export const layoutSpacing = {
  // 画面のパディング
  screenPadding: spacing.lg,
  screenPaddingHorizontal: spacing.lg,
  screenPaddingVertical: spacing.md,
  
  // セーフエリア
  safeAreaPadding: spacing.sm,
  
  // コンテナ
  containerPadding: spacing.lg,
  containerGap: spacing.xl,
  
  // グリッド
  gridGap: spacing.md,
  gridItemPadding: spacing.md,
  
  // フレックス
  flexGap: spacing.md,
} as const;

/**
 * アニメーション用のスペーシング
 */
export const animationSpacing = {
  slideDistance: spacing['4xl'],
  bounceDistance: spacing.sm,
  scaleOffset: spacing.xs,
} as const;

/**
 * レスポンシブスペーシング
 */
export const responsiveSpacing = {
  small: {
    screenPadding: spacing.md,
    cardPadding: spacing.md,
    buttonPadding: spacing.sm,
  },
  medium: {
    screenPadding: spacing.lg,
    cardPadding: spacing.lg,
    buttonPadding: spacing.md,
  },
  large: {
    screenPadding: spacing.xl,
    cardPadding: spacing.xl,
    buttonPadding: spacing.lg,
  },
} as const;

/**
 * スペーシングユーティリティ関数
 */
export class SpacingUtils {
  /**
   * カスタムスペーシング値の生成
   */
  static custom(multiplier: number): number {
    return SPACING_UNIT * multiplier;
  }

  /**
   * レスポンシブスペーシングの計算
   */
  static getResponsiveSpacing(
    baseSpacing: number,
    screenSize: 'small' | 'medium' | 'large'
  ): number {
    const multipliers = {
      small: 0.8,
      medium: 1,
      large: 1.2,
    };
    return Math.round(baseSpacing * multipliers[screenSize]);
  }

  /**
   * ネガティブマージンの生成
   */
  static negative(spacingValue: number): number {
    return -spacingValue;
  }

  /**
   * 均等スペーシングの計算
   */
  static distribute(totalSpace: number, itemCount: number): number {
    if (itemCount <= 1) return 0;
    return totalSpace / (itemCount - 1);
  }

  /**
   * 最小タッチターゲットサイズの確保
   */
  static ensureMinTouchTarget(size: number): number {
    const MIN_TOUCH_TARGET = 44; // iOS HIG推奨
    return Math.max(size, MIN_TOUCH_TARGET);
  }
}

/**
 * 特定用途向けのスペーシング定義
 */
export const specialSpacing = {
  // アクセシビリティ対応
  accessibility: {
    minTouchTarget: 44,
    focusOutlineWidth: 2,
    focusOutlineOffset: spacing.xs,
  },
  
  // CBT形式問題用
  cbtLayout: {
    questionPadding: spacing.lg,
    answerOptionGap: spacing.md,
    submitButtonMargin: spacing['2xl'],
    timerPadding: spacing.md,
  },
  
  // 統計表示用
  statsLayout: {
    chartPadding: spacing.lg,
    legendGap: spacing.sm,
    metricGap: spacing.md,
    progressBarHeight: spacing.sm,
  },
  
  // カードレイアウト用
  cardLayout: {
    borderRadius: spacing.sm,
    shadowOffset: spacing.xs,
    hoverLift: spacing.xs,
  },
} as const;