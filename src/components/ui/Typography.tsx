/**
 * 統一タイポグラフィコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * レスポンシブ・アクセシブル・テーマ対応のテキスト
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme, useThemedStyles } from '../../context/ThemeContext';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2'
  | 'button' | 'buttonLarge'
  | 'numeric' | 'numericLarge'
  | 'question' | 'questionTitle' | 'explanation'
  | 'error' | 'warning';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextColor = 'primary' | 'secondary' | 'disabled' | 'success' | 'warning' | 'error';

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: TextAlign;
  style?: TextStyle;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}: TypographyProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const textStyle = [
    styles[`variant_${variant}`],
    styles[`color_${color}`],
    styles[`align_${align}`],
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

const createStyles = (theme: any) => {
  const variantStyles: Record<string, TextStyle> = {};
  const colorStyles: Record<string, TextStyle> = {};
  const alignStyles: Record<string, TextStyle> = {};

  // バリアントスタイルの生成
  Object.entries(theme.typography).forEach(([key, value]) => {
    variantStyles[`variant_${key}`] = {
      fontSize: value.fontSize,
      lineHeight: value.lineHeight,
      fontWeight: value.fontWeight,
      letterSpacing: value.letterSpacing,
    };
  });

  // カラースタイルの生成
  colorStyles.color_primary = { color: theme.colors.text };
  colorStyles.color_secondary = { color: theme.colors.textSecondary };
  colorStyles.color_disabled = { color: theme.colors.textDisabled };
  colorStyles.color_success = { color: theme.colors.success };
  colorStyles.color_warning = { color: theme.colors.warning };
  colorStyles.color_error = { color: theme.colors.error };

  // 配置スタイルの生成
  alignStyles.align_left = { textAlign: 'left' };
  alignStyles.align_center = { textAlign: 'center' };
  alignStyles.align_right = { textAlign: 'right' };
  alignStyles.align_justify = { textAlign: 'justify' };

  return {
    ...variantStyles,
    ...colorStyles,
    ...alignStyles,
  };
};

/**
 * 見出しコンポーネント
 */
interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level, ...props }: HeadingProps) {
  const variant = `h${level}` as TypographyVariant;
  
  return (
    <Typography
      variant={variant}
      accessible={true}
      accessibilityRole="header"
      accessibilityLevel={level}
      {...props}
    />
  );
}

/**
 * 本文コンポーネント
 */
interface BodyTextProps extends Omit<TypographyProps, 'variant'> {
  size?: 'small' | 'medium';
}

export function BodyText({ size = 'medium', ...props }: BodyTextProps) {
  const variant = size === 'small' ? 'body2' : 'body1';
  
  return <Typography variant={variant} {...props} />;
}

/**
 * キャプションコンポーネント
 */
export function Caption(props: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography
      variant="caption"
      color="secondary"
      {...props}
    />
  );
}

/**
 * エラーテキストコンポーネント
 */
export function ErrorText(props: Omit<TypographyProps, 'variant' | 'color'>) {
  return (
    <Typography
      variant="error"
      color="error"
      accessible={true}
      accessibilityRole="alert"
      {...props}
    />
  );
}

/**
 * 警告テキストコンポーネント
 */
export function WarningText(props: Omit<TypographyProps, 'variant' | 'color'>) {
  return (
    <Typography
      variant="warning"
      color="warning"
      accessible={true}
      accessibilityRole="alert"
      {...props}
    />
  );
}

/**
 * 特定用途向けのタイポグラフィコンポーネント
 */

// 勘定科目表示
interface AccountNameProps extends Omit<TypographyProps, 'variant'> {
  account: string;
}

export function AccountName({ account, ...props }: AccountNameProps) {
  const { theme } = useTheme();
  
  const accountStyle = {
    fontWeight: '600' as const,
    color: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.xs,
  };

  return (
    <Typography
      variant="subtitle1"
      style={accountStyle}
      accessible={true}
      accessibilityLabel={`勘定科目: ${account}`}
      {...props}
    >
      {account}
    </Typography>
  );
}

// 金額表示
interface AmountProps extends Omit<TypographyProps, 'variant'> {
  amount: number;
  currency?: string;
}

export function Amount({ amount, currency = '円', ...props }: AmountProps) {
  const { theme } = useTheme();
  
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  const amountStyle = {
    fontWeight: '700' as const,
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'] as any,
  };

  return (
    <Typography
      variant="numeric"
      style={amountStyle}
      accessible={true}
      accessibilityLabel={`金額: ${formatAmount(amount)}${currency}`}
      {...props}
    >
      {formatAmount(amount)}{currency}
    </Typography>
  );
}

// スコア表示
interface ScoreProps extends Omit<TypographyProps, 'variant'> {
  score: number;
  maxScore: number;
  showPercentage?: boolean;
}

export function Score({ score, maxScore, showPercentage = true, ...props }: ScoreProps) {
  const { theme } = useTheme();
  
  const percentage = Math.round((score / maxScore) * 100);
  const getScoreColor = () => {
    if (percentage >= 80) return theme.colors.success;
    if (percentage >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const scoreStyle = {
    color: getScoreColor(),
    fontWeight: '800' as const,
  };

  const displayText = showPercentage ? `${score}点 (${percentage}%)` : `${score}/${maxScore}`;

  return (
    <Typography
      variant="numericLarge"
      style={scoreStyle}
      accessible={true}
      accessibilityLabel={`得点: ${score}点 最高点: ${maxScore}点 正答率: ${percentage}%`}
      {...props}
    >
      {displayText}
    </Typography>
  );
}

// タイマー表示
interface TimerProps extends Omit<TypographyProps, 'variant'> {
  seconds: number;
  format?: 'mm:ss' | 'hh:mm:ss';
}

export function Timer({ seconds, format = 'mm:ss', ...props }: TimerProps) {
  const { theme } = useTheme();
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (format === 'hh:mm:ss') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (seconds <= 60) return theme.colors.error;    // 1分以下は赤
    if (seconds <= 300) return theme.colors.warning; // 5分以下は黄
    return theme.colors.text;
  };

  const timerStyle = {
    color: getTimerColor(),
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as any,
  };

  return (
    <Typography
      variant="numeric"
      style={timerStyle}
      accessible={true}
      accessibilityLabel={`残り時間: ${formatTime(seconds)}`}
      {...props}
    >
      {formatTime(seconds)}
    </Typography>
  );
}

// 進捗パーセンテージ表示
interface ProgressPercentProps extends Omit<TypographyProps, 'variant'> {
  percentage: number;
}

export function ProgressPercent({ percentage, ...props }: ProgressPercentProps) {
  const { theme } = useTheme();
  
  const getProgressColor = () => {
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 75) return theme.learningColors.completed;
    if (percentage >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const progressStyle = {
    color: getProgressColor(),
    fontWeight: '600' as const,
  };

  return (
    <Typography
      variant="numeric"
      style={progressStyle}
      accessible={true}
      accessibilityLabel={`進捗率: ${percentage}%`}
      {...props}
    >
      {percentage}%
    </Typography>
  );
}