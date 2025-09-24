/**
 * 問題-勘定科目マッピングデータ
 * 動的フィルタリング機能で使用する問題別の関連勘定科目
 */

import { AccountCategory } from './account-categories';

export interface QuestionAccountMapping {
  questionId: string;           // 問題ID (例: "Q_J_001")
  primaryAccounts: string[];    // 正答科目（必須表示）2-4個
  relatedAccounts: string[];    // 関連科目 5-10個
  supplementaryAccounts?: string[]; // 補完科目 0-3個
  category: AccountCategory;    // 問題カテゴリ
  keywords: string[];          // 問題文のキーワード
}

/**
 * 問題-勘定科目マッピングデータ
 * 初期実装では主要な問題のみを定義し、後で全問題に拡張
 */
export const QUESTION_ACCOUNT_MAPPINGS: Record<string, QuestionAccountMapping> = {
  // 現金・預金系の問題
  'Q_J_001': {
    questionId: 'Q_J_001',
    primaryAccounts: ['現金', '現金過不足'],
    relatedAccounts: ['雑収入', '雑損失', '小口現金', '当座預金'],
    supplementaryAccounts: ['普通預金'],
    category: AccountCategory.CASH_DEPOSIT,
    keywords: ['現金', '実査', '過不足']
  },

  'Q_J_002': {
    questionId: 'Q_J_002',
    primaryAccounts: ['小口現金', '現金'],
    relatedAccounts: ['旅費交通費', '消耗品費', '通信費', '雑費'],
    supplementaryAccounts: ['前払金'],
    category: AccountCategory.CASH_DEPOSIT,
    keywords: ['小口現金', '前渡し', '補給']
  },

  // 商品売買系の問題
  'Q_J_010': {
    questionId: 'Q_J_010',
    primaryAccounts: ['旅費交通費', '現金'],
    relatedAccounts: ['消耗品費', '通信費', '交通費', '小口現金', '当座預金'],
    supplementaryAccounts: ['雑費'],
    category: AccountCategory.CASH_DEPOSIT,
    keywords: ['交通費', '現金', '営業']
  },

  'Q_J_011': {
    questionId: 'Q_J_011',
    primaryAccounts: ['租税公課', '現金'],
    relatedAccounts: ['固定資産税', '印紙税', '事業所税', '当座預金', '未払金'],
    supplementaryAccounts: ['法定福利費'],
    category: AccountCategory.CASH_DEPOSIT,
    keywords: ['固定資産税', '現金', '納付']
  },

  'Q_J_012': {
    questionId: 'Q_J_012',
    primaryAccounts: ['現金', '仮払金', '受取利息'],
    relatedAccounts: ['定期預金', '普通預金', '当座預金', '法人税等'],
    supplementaryAccounts: ['雑収入'],
    category: AccountCategory.CASH_DEPOSIT,
    keywords: ['定期預金', '利息', '源泉徴収']
  }
};

/**
 * カテゴリからデフォルトの関連科目を取得
 */
export const getDefaultRelatedAccounts = (category: AccountCategory): string[] => {
  switch (category) {
    case AccountCategory.CASH_DEPOSIT:
      return ['現金', '当座預金', '普通預金', '小口現金', '現金過不足'];

    case AccountCategory.MERCHANDISE:
      return ['商品', '仕入', '売上', '売掛金', '買掛金', '現金', '当座預金'];

    case AccountCategory.FIXED_ASSETS:
      return ['建物', '備品', '車両運搬具', '減価償却費', '現金', '当座預金'];

    case AccountCategory.PAYROLL:
      return ['給料', '賞与', '預り金', '法定福利費', '現金', '当座預金'];

    case AccountCategory.SETTLEMENT:
      return ['貸倒引当金', '減価償却費', '前払費用', '未払費用'];

    case AccountCategory.RECEIVABLES_PAYABLES:
      return ['売掛金', '買掛金', '受取手形', '支払手形', '貸付金', '借入金'];

    default:
      return [];
  }
};

/**
 * 問題IDからカテゴリを推定
 */
export const getCategoryFromQuestionId = (questionId: string): AccountCategory => {
  // 既存のマッピングから取得
  const mapping = QUESTION_ACCOUNT_MAPPINGS[questionId];
  if (mapping) {
    return mapping.category;
  }

  // 問題IDの接頭辞から推定
  if (questionId.startsWith('Q_J_')) {
    return AccountCategory.OTHER; // 仕訳問題は内容による判定が必要
  } else if (questionId.startsWith('Q_L_')) {
    return AccountCategory.OTHER; // 帳簿問題
  } else if (questionId.startsWith('Q_T_')) {
    return AccountCategory.OTHER; // 試算表問題
  }

  return AccountCategory.OTHER;
};

/**
 * 問題文のキーワードからカテゴリを判定
 */
export const getCategoryFromKeywords = (questionText: string): AccountCategory => {
  const text = questionText.toLowerCase();

  if (text.includes('現金') || text.includes('小口') || text.includes('実査') ||
      text.includes('預金') || text.includes('当座')) {
    return AccountCategory.CASH_DEPOSIT;
  }

  if (text.includes('商品') || text.includes('仕入') || text.includes('売上') ||
      text.includes('売買') || text.includes('掛け')) {
    return AccountCategory.MERCHANDISE;
  }

  if (text.includes('建物') || text.includes('備品') || text.includes('車両') ||
      text.includes('減価償却') || text.includes('固定資産')) {
    return AccountCategory.FIXED_ASSETS;
  }

  if (text.includes('給料') || text.includes('賞与') || text.includes('源泉') ||
      text.includes('社会保険')) {
    return AccountCategory.PAYROLL;
  }

  if (text.includes('決算') || text.includes('整理') || text.includes('引当') ||
      text.includes('繰延') || text.includes('見越')) {
    return AccountCategory.SETTLEMENT;
  }

  if (text.includes('手形') || text.includes('貸付') || text.includes('借入') ||
      text.includes('債権') || text.includes('債務')) {
    return AccountCategory.RECEIVABLES_PAYABLES;
  }

  return AccountCategory.OTHER;
};