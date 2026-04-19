/**
 * 勘定科目カテゴリ定義
 * 動的フィルタリング機能で使用するカテゴリ分類
 */

export enum AccountCategory {
  CASH_DEPOSIT = 'cash_deposit',        // 現金・預金系
  MERCHANDISE = 'merchandise',          // 商品売買系
  FIXED_ASSETS = 'fixed_assets',       // 固定資産系
  PAYROLL = 'payroll',                 // 給与・人件費系
  SETTLEMENT = 'settlement',            // 決算整理系
  RECEIVABLES_PAYABLES = 'receivables_payables', // 債権債務系
  OTHER = 'other'                      // その他
}

export interface CategoryDefinition {
  category: AccountCategory;
  coreAccounts: string[];      // コア勘定科目（必ず含める）
  relatedAccounts: string[];   // 関連勘定科目（状況に応じて追加）
  excludeAccounts: string[];   // 明示的に除外する科目
  keywords: string[];          // キーワード
}

/**
 * カテゴリ定義データ
 */
export const CATEGORY_DEFINITIONS: Record<AccountCategory, CategoryDefinition> = {
  [AccountCategory.CASH_DEPOSIT]: {
    category: AccountCategory.CASH_DEPOSIT,
    coreAccounts: [
      '現金',
      '現金過不足',
      '小口現金',
      '当座預金',
      '普通預金',
      '定期預金'
    ],
    relatedAccounts: [
      '当座借越',
      '雑収入',
      '雑損失'
    ],
    excludeAccounts: [
      '商品', '仕入', '売上',
      '建物', '備品', '車両運搬具',
      '給料', '賞与'
    ],
    keywords: ['現金', '小口', '実査', '預金', '当座', '普通']
  },

  [AccountCategory.MERCHANDISE]: {
    category: AccountCategory.MERCHANDISE,
    coreAccounts: [
      '商品',
      '仕入',
      '売上',
      '売掛金',
      '買掛金',
      '繰越商品'
    ],
    relatedAccounts: [
      '前払金',
      '前受金',
      '受取手形',
      '支払手形',
      '発送費',
      '保管費',
      '現金',
      '当座預金'
    ],
    excludeAccounts: [
      '建物', '備品', '車両運搬具',
      '給料', '賞与',
      '減価償却費'
    ],
    keywords: ['商品', '仕入', '売上', '売買', '掛け', '手形']
  },

  [AccountCategory.FIXED_ASSETS]: {
    category: AccountCategory.FIXED_ASSETS,
    coreAccounts: [
      '建物',
      '建物減価償却累計額',
      '備品',
      '備品減価償却累計額',
      '車両運搬具',
      '車両運搬具減価償却累計額',
      '土地',
      '機械装置',
      '機械装置減価償却累計額'
    ],
    relatedAccounts: [
      '減価償却費',
      '固定資産売却益',
      '固定資産売却損',
      '固定資産除却損',
      '建設仮勘定',
      '未払金',
      '現金',
      '当座預金'
    ],
    excludeAccounts: [
      '商品', '仕入', '売上',
      '給料', '賞与'
    ],
    keywords: ['建物', '備品', '車両', '減価償却', '固定資産', '土地']
  },

  [AccountCategory.PAYROLL]: {
    category: AccountCategory.PAYROLL,
    coreAccounts: [
      '給料',
      '賞与',
      '賞与引当金',
      '賞与引当金繰入',
      '法定福利費'
    ],
    relatedAccounts: [
      '預り金',
      '未払給料',
      '未払賞与',
      '現金',
      '当座預金',
      '福利厚生費'
    ],
    excludeAccounts: [
      '商品', '仕入', '売上',
      '建物', '備品', '車両運搬具'
    ],
    keywords: ['給料', '賞与', '源泉', '社会保険', '福利']
  },

  [AccountCategory.SETTLEMENT]: {
    category: AccountCategory.SETTLEMENT,
    coreAccounts: [
      '貸倒引当金',
      '貸倒引当金繰入',
      '貸倒引当金戻入',
      '減価償却費',
      '前払費用',
      '前受収益',
      '未払費用',
      '未収収益'
    ],
    relatedAccounts: [
      '売掛金',
      '受取手形',
      '保険料',
      '支払家賃',
      '受取家賃',
      '支払利息',
      '受取利息'
    ],
    excludeAccounts: [
      '現金', '小口現金'
    ],
    keywords: ['決算', '整理', '引当', '繰延', '見越', '償却']
  },

  [AccountCategory.RECEIVABLES_PAYABLES]: {
    category: AccountCategory.RECEIVABLES_PAYABLES,
    coreAccounts: [
      '売掛金',
      '買掛金',
      '受取手形',
      '支払手形',
      '貸付金',
      '借入金'
    ],
    relatedAccounts: [
      '未収金',
      '未払金',
      '立替金',
      '預り金',
      '仮払金',
      '仮受金',
      '受取利息',
      '支払利息',
      '手形売却損'
    ],
    excludeAccounts: [
      '建物', '備品', '車両運搬具',
      '商品', '仕入', '売上'
    ],
    keywords: ['手形', '掛け', '貸付', '借入', '債権', '債務']
  },

  [AccountCategory.OTHER]: {
    category: AccountCategory.OTHER,
    coreAccounts: [],
    relatedAccounts: [],
    excludeAccounts: [],
    keywords: []
  }
};

/**
 * 対になる勘定科目の定義
 */
export const PAIRED_ACCOUNTS: Record<string, string[]> = {
  '売掛金': ['買掛金'],
  '買掛金': ['売掛金'],
  '受取手形': ['支払手形'],
  '支払手形': ['受取手形'],
  '貸付金': ['借入金'],
  '借入金': ['貸付金'],
  '前払金': ['前受金'],
  '前受金': ['前払金'],
  '前払費用': ['前受収益'],
  '前受収益': ['前払費用'],
  '未収収益': ['未払費用'],
  '未払費用': ['未収収益'],
  '受取利息': ['支払利息'],
  '支払利息': ['受取利息'],
  '受取手数料': ['支払手数料'],
  '支払手数料': ['受取手数料'],
  '仮払金': ['仮受金'],
  '仮受金': ['仮払金'],
  '立替金': ['預り金'],
  '預り金': ['立替金']
};

/**
 * 類似勘定科目の定義（学習効果を高めるため）
 */
export const SIMILAR_ACCOUNTS: Record<string, string[]> = {
  '消耗品費': ['消耗品'],
  '消耗品': ['消耗品費'],
  '前払金': ['前払費用'],
  '前払費用': ['前払金'],
  '未払金': ['未払費用'],
  '未払費用': ['未払金'],
  '受取手形': ['売掛金'],
  '売掛金': ['受取手形'],
  '支払手形': ['買掛金'],
  '買掛金': ['支払手形'],
  '備品': ['消耗品'],
  '修繕費': ['修繕引当金繰入'],
  '修繕引当金繰入': ['修繕費']
};
