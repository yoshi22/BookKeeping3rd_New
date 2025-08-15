/**
 * 統合アイコンシステム - 簿記3級問題集アプリ
 * UI/UX改善 Phase 1: MaterialCommunityIcons統一採用
 *
 * アイコンの不統一性解消・プロフェッショナル感向上
 * 一貫したアイコンスタイル・サイズ・重み統一
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TextStyle } from 'react-native';

// MaterialCommunityIconsのアイコン名の型
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

/**
 * アプリ統一アイコンセット定義
 */
export const AppIcons = {
  // 学習関連
  learning: "school-outline" as IconName,
  review: "refresh" as IconName,
  exam: "clipboard-text-outline" as IconName,
  mockExam: "file-document-multiple-outline" as IconName,
  study: "book-open-variant" as IconName,
  practice: "pencil-outline" as IconName,
  
  // 統計・進捗
  stats: "chart-line" as IconName,
  progress: "chart-arc" as IconName,
  trophy: "trophy-outline" as IconName,
  medal: "medal-outline" as IconName,
  streak: "fire" as IconName,
  calendar: "calendar-outline" as IconName,

  // ナビゲーション
  home: "home-outline" as IconName,
  back: "chevron-left" as IconName,
  forward: "chevron-right" as IconName,
  up: "chevron-up" as IconName,
  down: "chevron-down" as IconName,
  menu: "menu" as IconName,
  close: "close" as IconName,
  expand: "chevron-down" as IconName,
  collapse: "chevron-up" as IconName,

  // アクション
  submit: "send-outline" as IconName,
  save: "content-save-outline" as IconName,
  edit: "pencil-outline" as IconName,
  delete: "delete-outline" as IconName,
  add: "plus-circle-outline" as IconName,
  remove: "minus-circle-outline" as IconName,
  search: "magnify" as IconName,
  filter: "filter-outline" as IconName,
  sort: "sort" as IconName,

  // 状態表示
  success: "check-circle-outline" as IconName,
  error: "alert-circle-outline" as IconName,
  warning: "alert-outline" as IconName,
  info: "information-outline" as IconName,
  loading: "loading" as IconName,
  correct: "check" as IconName,
  incorrect: "close" as IconName,

  // 設定・ツール
  settings: "cog-outline" as IconName,
  help: "help-circle-outline" as IconName,
  about: "information-outline" as IconName,
  debug: "bug-outline" as IconName,
  reset: "refresh" as IconName,
  backup: "backup-restore" as IconName,
  download: "download-outline" as IconName,
  upload: "upload-outline" as IconName,

  // 簿記特化アイコン
  journal: "book-outline" as IconName, // 仕訳
  ledger: "notebook-outline" as IconName, // 帳簿
  trialBalance: "calculator-variant-outline" as IconName, // 試算表
  account: "card-account-details-outline" as IconName, // 勘定科目
  debit: "arrow-up-circle-outline" as IconName, // 借方
  credit: "arrow-down-circle-outline" as IconName, // 貸方
  amount: "currency-jpy" as IconName, // 金額
  date: "calendar-clock" as IconName, // 日付

  // ユーザー・プロフィール
  user: "account-outline" as IconName,
  profile: "account-circle-outline" as IconName,
  rank: "star-outline" as IconName,
  level: "trending-up" as IconName,

  // ゲーミフィケーション
  badge: "shield-star-outline" as IconName,
  achievement: "trophy-variant-outline" as IconName,
  points: "star-circle-outline" as IconName,
  leaderboard: "podium" as IconName,
  challenge: "target" as IconName,

  // 時間関連
  timer: "timer-outline" as IconName,
  clock: "clock-outline" as IconName,
  stopwatch: "stopwatch-outline" as IconName,
  history: "history" as IconName,

  // コミュニティ（将来実装）
  community: "account-group-outline" as IconName,
  chat: "chat-outline" as IconName,
  share: "share-outline" as IconName,
  favorite: "heart-outline" as IconName,
  bookmark: "bookmark-outline" as IconName,
} as const;

/**
 * アイコンサイズの標準化
 */
export const IconSizes = {
  tiny: 16,
  small: 20,
  medium: 24,
  large: 32,
  xlarge: 48,
  xxlarge: 64,
} as const;

/**
 * アイコンのウェイト（太さ）統一
 * MaterialCommunityIconsは基本的に均一な太さだが、
 * 将来のカスタマイズ用に定義
 */
export const IconWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 600,
} as const;

/**
 * コンテキスト別アイコンサイズ推奨値
 */
export const IconContextSizes = {
  // UI要素内
  button: IconSizes.small,
  listItem: IconSizes.medium,
  header: IconSizes.medium,
  tab: IconSizes.medium,
  
  // フィードバック・状態
  notification: IconSizes.large,
  success: IconSizes.large,
  error: IconSizes.large,
  
  // 強調表示
  hero: IconSizes.xlarge,
  achievement: IconSizes.xxlarge,
  
  // 数値・データ表示
  metric: IconSizes.small,
  statCard: IconSizes.medium,
} as const;

/**
 * 統一アイコンコンポーネントのProps
 */
export interface AppIconProps {
  name: keyof typeof AppIcons;
  size?: keyof typeof IconSizes | number;
  color?: string;
  style?: TextStyle;
  testID?: string;
}

/**
 * 統一アイコンコンポーネント
 */
export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 'medium',
  color = '#000000',
  style,
  testID,
}) => {
  const iconName = AppIcons[name];
  const iconSize = typeof size === 'number' ? size : IconSizes[size];

  return (
    <MaterialCommunityIcons
      name={iconName}
      size={iconSize}
      color={color}
      style={style}
      testID={testID}
    />
  );
};

/**
 * アイコンユーティリティクラス
 */
export class IconUtils {
  /**
   * コンテキストに応じた適切なサイズを取得
   */
  static getContextSize(context: keyof typeof IconContextSizes): number {
    return IconContextSizes[context];
  }

  /**
   * 状態に応じたアイコンを取得
   */
  static getStatusIcon(status: 'success' | 'error' | 'warning' | 'info'): keyof typeof AppIcons {
    const statusIconMap = {
      success: 'success' as const,
      error: 'error' as const,
      warning: 'warning' as const,
      info: 'info' as const,
    };
    return statusIconMap[status];
  }

  /**
   * 学習状態に応じたアイコンを取得
   */
  static getLearningStatusIcon(
    status: 'not_started' | 'in_progress' | 'completed' | 'mastered' | 'needs_review'
  ): keyof typeof AppIcons {
    const learningIconMap = {
      not_started: 'study' as const,
      in_progress: 'loading' as const,
      completed: 'correct' as const,
      mastered: 'trophy' as const,
      needs_review: 'review' as const,
    };
    return learningIconMap[status];
  }

  /**
   * 問題タイプに応じたアイコンを取得
   */
  static getQuestionTypeIcon(
    type: 'journal' | 'ledger' | 'trial_balance'
  ): keyof typeof AppIcons {
    const typeIconMap = {
      journal: 'journal' as const,
      ledger: 'ledger' as const,
      trial_balance: 'trialBalance' as const,
    };
    return typeIconMap[type];
  }

  /**
   * アクセシビリティ向上のためのアイコン説明テキスト生成
   */
  static getAccessibilityLabel(iconName: keyof typeof AppIcons): string {
    const labelMap: Record<keyof typeof AppIcons, string> = {
      // 学習関連
      learning: '学習',
      review: '復習',
      exam: '試験',
      mockExam: '模試',
      study: '勉強',
      practice: '練習',
      
      // 統計・進捗
      stats: '統計',
      progress: '進捗',
      trophy: 'トロフィー',
      medal: 'メダル',
      streak: 'ストリーク',
      calendar: 'カレンダー',

      // ナビゲーション
      home: 'ホーム',
      back: '戻る',
      forward: '進む',
      up: '上',
      down: '下',
      menu: 'メニュー',
      close: '閉じる',
      expand: '展開',
      collapse: '折りたたみ',

      // アクション
      submit: '送信',
      save: '保存',
      edit: '編集',
      delete: '削除',
      add: '追加',
      remove: '削除',
      search: '検索',
      filter: 'フィルター',
      sort: 'ソート',

      // 状態表示
      success: '成功',
      error: 'エラー',
      warning: '警告',
      info: '情報',
      loading: '読み込み中',
      correct: '正解',
      incorrect: '不正解',

      // 設定・ツール
      settings: '設定',
      help: 'ヘルプ',
      about: '情報',
      debug: 'デバッグ',
      reset: 'リセット',
      backup: 'バックアップ',
      download: 'ダウンロード',
      upload: 'アップロード',

      // 簿記特化
      journal: '仕訳',
      ledger: '帳簿',
      trialBalance: '試算表',
      account: '勘定科目',
      debit: '借方',
      credit: '貸方',
      amount: '金額',
      date: '日付',

      // ユーザー・プロフィール
      user: 'ユーザー',
      profile: 'プロフィール',
      rank: 'ランク',
      level: 'レベル',

      // ゲーミフィケーション
      badge: 'バッジ',
      achievement: '実績',
      points: 'ポイント',
      leaderboard: 'ランキング',
      challenge: 'チャレンジ',

      // 時間関連
      timer: 'タイマー',
      clock: '時計',
      stopwatch: 'ストップウォッチ',
      history: '履歴',

      // コミュニティ
      community: 'コミュニティ',
      chat: 'チャット',
      share: '共有',
      favorite: 'お気に入り',
      bookmark: 'ブックマーク',
    };

    return labelMap[iconName] || iconName.toString();
  }
}

/**
 * 特定画面用のアイコンセット
 */
export const ScreenIcons = {
  // ホーム画面
  home: {
    learning: AppIcons.learning,
    review: AppIcons.review,
    stats: AppIcons.stats,
    mockExam: AppIcons.mockExam,
  },
  
  // 学習画面
  learning: {
    journal: AppIcons.journal,
    ledger: AppIcons.ledger,
    trialBalance: AppIcons.trialBalance,
    progress: AppIcons.progress,
  },
  
  // 復習画面
  review: {
    priority: AppIcons.warning,
    all: AppIcons.review,
    completed: AppIcons.success,
    streak: AppIcons.streak,
  },
  
  // 統計画面
  stats: {
    chart: AppIcons.stats,
    trophy: AppIcons.trophy,
    calendar: AppIcons.calendar,
    history: AppIcons.history,
  },
  
  // 設定画面
  settings: {
    general: AppIcons.settings,
    help: AppIcons.help,
    about: AppIcons.about,
    debug: AppIcons.debug,
    reset: AppIcons.reset,
  },
} as const;

/**
 * テーマカラーと連動したアイコンカラー
 */
export const getThemedIconColor = (
  theme: 'light' | 'dark',
  variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'text' = 'text'
) => {
  const lightColors = {
    primary: '#2196F3',
    secondary: '#4CAF50',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    text: '#212121',
  };

  const darkColors = {
    primary: '#90CAF9',
    secondary: '#81C784',
    success: '#81C784',
    error: '#EF5350',
    warning: '#FFB74D',
    info: '#90CAF9',
    text: '#FFFFFF',
  };

  return theme === 'light' ? lightColors[variant] : darkColors[variant];
};