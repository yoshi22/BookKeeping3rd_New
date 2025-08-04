/**
 * 統一カードコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 * 
 * レスポンシブ・テーマ対応のカードレイアウト
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme, useThemedStyles } from '../../context/ThemeContext';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';

interface BaseCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  style?: ViewStyle;
}

interface StaticCardProps extends BaseCardProps {
  onPress?: never;
}

interface TouchableCardProps extends BaseCardProps, Omit<TouchableOpacityProps, 'style'> {
  onPress: () => void;
}

type CardProps = StaticCardProps | TouchableCardProps;

export function Card({
  children,
  variant = 'default',
  size = 'medium',
  style,
  onPress,
  ...props
}: CardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const cardStyle = [
    styles.card,
    styles[`card_${variant}`],
    styles[`card_${size}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} accessible={true}>
      {children}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    borderRadius: theme.spacing.md,
    overflow: 'hidden',
  },

  // バリアント
  card_default: {
    backgroundColor: theme.colors.card,
    ...theme.shadows.small,
  },
  card_elevated: {
    backgroundColor: theme.colors.card,
    ...theme.shadows.large,
  },
  card_outlined: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  card_filled: {
    backgroundColor: theme.colors.surface,
  },

  // サイズ
  card_small: {
    padding: theme.spacing.md,
  },
  card_medium: {
    padding: theme.spacing.lg,
  },
  card_large: {
    padding: theme.spacing.xl,
  },
});

/**
 * カードヘッダーコンポーネント
 */
interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  const styles = useThemedStyles(createHeaderStyles);

  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

const createHeaderStyles = (theme: any) => StyleSheet.create({
  header: {
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing.md,
  },
});

/**
 * カードコンテンツコンポーネント
 */
interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  const styles = useThemedStyles(createContentStyles);

  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

const createContentStyles = (theme: any) => StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
});

/**
 * カードアクションコンポーネント
 */
interface CardActionsProps {
  children: React.ReactNode;
  style?: ViewStyle;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

export function CardActions({ children, style, justify = 'flex-end' }: CardActionsProps) {
  const styles = useThemedStyles(createActionsStyles);

  return (
    <View style={[styles.actions, { justifyContent: justify }, style]}>
      {children}
    </View>
  );
}

const createActionsStyles = (theme: any) => StyleSheet.create({
  actions: {
    flexDirection: 'row',
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
  },
});

/**
 * 特定用途向けのカードコンポーネント
 */

// 問題カード
interface QuestionCardProps extends BaseCardProps {
  questionId: string;
  category: 'journal' | 'ledger' | 'trial-balance';
  onPress?: () => void;
}

export function QuestionCard({ 
  questionId, 
  category, 
  children, 
  onPress, 
  ...props 
}: QuestionCardProps) {
  const { theme } = useTheme();
  const categoryColor = theme.categoryColors[category];

  const cardStyle = {
    borderLeftWidth: 4,
    borderLeftColor: categoryColor,
  };

  return (
    <Card
      style={cardStyle}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${category}問題 ${questionId}`}
      {...props}
    >
      {children}
    </Card>
  );
}

// 統計カード
interface StatCardProps extends BaseCardProps {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ value, label, trend, children, ...props }: StatCardProps) {
  const { theme } = useTheme();
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return theme.colors.success;
      case 'down': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const cardStyle = {
    borderTopWidth: 3,
    borderTopColor: getTrendColor(),
  };

  return (
    <Card
      variant="elevated"
      style={cardStyle}
      accessible={true}
      accessibilityLabel={`${label}: ${value}`}
      {...props}
    >
      {children}
    </Card>
  );
}

// 進捗カード
interface ProgressCardProps extends BaseCardProps {
  progress: number; // 0-100
  title: string;
  subtitle?: string;
}

export function ProgressCard({ progress, title, subtitle, children, ...props }: ProgressCardProps) {
  const { theme } = useTheme();
  
  const getProgressColor = () => {
    if (progress >= 80) return theme.colors.success;
    if (progress >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const cardStyle = {
    borderWidth: 2,
    borderColor: getProgressColor(),
  };

  return (
    <Card
      style={cardStyle}
      accessible={true}
      accessibilityLabel={`${title} 進捗率 ${progress}%`}
      accessibilityHint={subtitle}
      {...props}
    >
      {children}
    </Card>
  );
}