/**
 * カテゴリー設定とタグシステム
 * 問題の分類と管理を行う
 */

import { QuestionCategory, QuestionDifficulty } from "@/types/models";

export interface CategoryMapping {
  categoryId: QuestionCategory;
  strategyCategories: string[]; // learning-paths.tsのカテゴリーIDと対応
  displayName: string;
  description: string;
  targetCount: number;
  examSection: 1 | 2 | 3;
}

export interface TagMapping {
  tag: string;
  displayName: string;
  categoryId: string; // learning-paths.tsのカテゴリーID
  subcategoryId?: string;
  patternId?: string;
}

export interface DifficultyConfig {
  level: QuestionDifficulty;
  displayName: string;
  description: string;
  recommendedPhase: number; // 学習フェーズ（1-4）
  masteryThreshold: number; // 習得判定基準（正答率%）
}

// カテゴリーマッピング（問題カテゴリー → 戦略カテゴリー）
export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    categoryId: "journal",
    strategyCategories: [
      "cash_deposit",
      "sales_purchase",
      "receivable_payable",
      "salary_tax",
      "fixed_asset",
      "adjustment",
    ],
    displayName: "仕訳問題",
    description: "第1問：仕訳問題（15問・45点）",
    targetCount: 250,
    examSection: 1,
  },
  {
    categoryId: "ledger",
    strategyCategories: ["cash_book", "subsidiary_ledgers", "account_entries"],
    displayName: "帳簿問題",
    description: "第2問：補助簿・勘定記入・伝票（2問・20点）",
    targetCount: 40,
    examSection: 2,
  },
  {
    categoryId: "trial_balance",
    strategyCategories: ["trial_balance"],
    displayName: "試算表問題",
    description: "第3問：決算書作成（1問・35点）",
    targetCount: 12,
    examSection: 3,
  },
];

// タグマッピング（問題タグ → 戦略カテゴリー）
export const TAG_MAPPINGS: TagMapping[] = [
  // 現金・預金取引
  {
    tag: "現金取引",
    displayName: "現金取引",
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
  },
  {
    tag: "現金過不足",
    displayName: "現金過不足",
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
    patternId: "cash_shortage",
  },
  {
    tag: "小口現金",
    displayName: "小口現金",
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
    patternId: "petty_cash",
  },
  {
    tag: "当座預金",
    displayName: "当座預金",
    categoryId: "cash_deposit",
    subcategoryId: "checking_account",
  },
  {
    tag: "当座借越",
    displayName: "当座借越",
    categoryId: "cash_deposit",
    subcategoryId: "checking_account",
    patternId: "overdraft",
  },
  {
    tag: "普通預金",
    displayName: "普通預金",
    categoryId: "cash_deposit",
    subcategoryId: "other_deposits",
    patternId: "savings_account",
  },
  {
    tag: "定期預金",
    displayName: "定期預金",
    categoryId: "cash_deposit",
    subcategoryId: "other_deposits",
    patternId: "time_deposit",
  },

  // 商品売買取引
  {
    tag: "基本売買",
    displayName: "基本売買",
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
  },
  {
    tag: "商品売買",
    displayName: "商品売買",
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
  },
  {
    tag: "前払金",
    displayName: "前払金・前受金",
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
    patternId: "advance_payment",
  },
  {
    tag: "前受金",
    displayName: "前払金・前受金",
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
    patternId: "advance_payment",
  },
  {
    tag: "返品",
    displayName: "返品・値引き",
    categoryId: "sales_purchase",
    subcategoryId: "returns_discounts",
  },
  {
    tag: "値引き",
    displayName: "返品・値引き",
    categoryId: "sales_purchase",
    subcategoryId: "returns_discounts",
  },
  {
    tag: "諸掛り",
    displayName: "諸掛り",
    categoryId: "sales_purchase",
    subcategoryId: "shipping_costs",
  },
  {
    tag: "売上原価",
    displayName: "売上原価",
    categoryId: "sales_purchase",
    subcategoryId: "year_end_adjustment",
    patternId: "cost_of_sales",
  },

  // 債権・債務
  {
    tag: "売掛金",
    displayName: "売掛金",
    categoryId: "receivable_payable",
    subcategoryId: "accounts_receivable_payable",
    patternId: "receivable_management",
  },
  {
    tag: "買掛金",
    displayName: "買掛金",
    categoryId: "receivable_payable",
    subcategoryId: "accounts_receivable_payable",
    patternId: "payable_management",
  },
  {
    tag: "手形取引",
    displayName: "手形取引",
    categoryId: "receivable_payable",
    subcategoryId: "notes",
  },
  {
    tag: "受取手形",
    displayName: "受取手形",
    categoryId: "receivable_payable",
    subcategoryId: "notes",
    patternId: "notes_receivable",
  },
  {
    tag: "支払手形",
    displayName: "支払手形",
    categoryId: "receivable_payable",
    subcategoryId: "notes",
    patternId: "notes_payable",
  },
  {
    tag: "貸付金",
    displayName: "貸付金",
    categoryId: "receivable_payable",
    subcategoryId: "loans",
    patternId: "lending",
  },
  {
    tag: "借入金",
    displayName: "借入金",
    categoryId: "receivable_payable",
    subcategoryId: "loans",
    patternId: "borrowing",
  },

  // 給与・税金
  {
    tag: "給与支払",
    displayName: "給与支払",
    categoryId: "salary_tax",
    subcategoryId: "salary_payment",
  },
  {
    tag: "源泉徴収",
    displayName: "源泉徴収",
    categoryId: "salary_tax",
    subcategoryId: "withholding_tax",
    patternId: "income_tax",
  },
  {
    tag: "住民税",
    displayName: "住民税",
    categoryId: "salary_tax",
    subcategoryId: "withholding_tax",
    patternId: "resident_tax",
  },
  {
    tag: "社会保険料",
    displayName: "社会保険料",
    categoryId: "salary_tax",
    subcategoryId: "social_insurance",
  },
  {
    tag: "法人税等",
    displayName: "法人税等",
    categoryId: "salary_tax",
    subcategoryId: "corporate_tax",
  },

  // 固定資産
  {
    tag: "固定資産取得",
    displayName: "固定資産取得",
    categoryId: "fixed_asset",
    subcategoryId: "acquisition",
  },
  {
    tag: "減価償却",
    displayName: "減価償却",
    categoryId: "fixed_asset",
    subcategoryId: "depreciation",
  },
  {
    tag: "固定資産売却",
    displayName: "固定資産売却",
    categoryId: "fixed_asset",
    subcategoryId: "disposal",
    patternId: "sale",
  },
  {
    tag: "固定資産除却",
    displayName: "固定資産除却",
    categoryId: "fixed_asset",
    subcategoryId: "disposal",
    patternId: "retirement",
  },

  // 決算整理
  {
    tag: "引当金",
    displayName: "引当金",
    categoryId: "adjustment",
    subcategoryId: "provisions",
  },
  {
    tag: "貸倒引当金",
    displayName: "貸倒引当金",
    categoryId: "adjustment",
    subcategoryId: "provisions",
    patternId: "bad_debt",
  },
  {
    tag: "経過勘定",
    displayName: "経過勘定",
    categoryId: "adjustment",
    subcategoryId: "accruals",
  },
  {
    tag: "前払費用",
    displayName: "前払・前受",
    categoryId: "adjustment",
    subcategoryId: "accruals",
    patternId: "prepaid_accrued",
  },
  {
    tag: "前受収益",
    displayName: "前払・前受",
    categoryId: "adjustment",
    subcategoryId: "accruals",
    patternId: "prepaid_accrued",
  },
  {
    tag: "未収収益",
    displayName: "未収・未払",
    categoryId: "adjustment",
    subcategoryId: "accruals",
    patternId: "accrued_deferred",
  },
  {
    tag: "未払費用",
    displayName: "未収・未払",
    categoryId: "adjustment",
    subcategoryId: "accruals",
    patternId: "accrued_deferred",
  },
  {
    tag: "決算振替",
    displayName: "決算振替",
    categoryId: "adjustment",
    subcategoryId: "other_adjustments",
    patternId: "closing_entries",
  },

  // 帳簿関連
  { tag: "現金出納帳", displayName: "現金出納帳", categoryId: "cash_book" },
  {
    tag: "売上帳",
    displayName: "売上帳",
    categoryId: "subsidiary_ledgers",
    subcategoryId: "sales_ledger",
  },
  {
    tag: "仕入帳",
    displayName: "仕入帳",
    categoryId: "subsidiary_ledgers",
    subcategoryId: "purchase_ledger",
  },
  {
    tag: "売掛金元帳",
    displayName: "売掛金元帳",
    categoryId: "subsidiary_ledgers",
    subcategoryId: "receivable_ledger",
  },
  {
    tag: "総勘定元帳",
    displayName: "総勘定元帳",
    categoryId: "account_entries",
    subcategoryId: "general_ledger",
  },

  // 試算表関連
  {
    tag: "合計試算表",
    displayName: "合計試算表",
    categoryId: "trial_balance",
    subcategoryId: "total_trial_balance",
  },
  {
    tag: "残高試算表",
    displayName: "残高試算表",
    categoryId: "trial_balance",
    subcategoryId: "balance_trial_balance",
  },
];

// 難易度設定
export const DIFFICULTY_CONFIGS: DifficultyConfig[] = [
  {
    level: 1,
    displayName: "基礎",
    description: "基本的な仕訳・帳簿記入",
    recommendedPhase: 1,
    masteryThreshold: 90,
  },
  {
    level: 2,
    displayName: "基本",
    description: "標準的な取引・処理",
    recommendedPhase: 1,
    masteryThreshold: 85,
  },
  {
    level: 3,
    displayName: "標準",
    description: "応用的な仕訳・複合取引",
    recommendedPhase: 2,
    masteryThreshold: 80,
  },
  {
    level: 4,
    displayName: "応用",
    description: "決算整理・複雑な処理",
    recommendedPhase: 3,
    masteryThreshold: 75,
  },
  {
    level: 5,
    displayName: "発展",
    description: "総合問題・実戦形式",
    recommendedPhase: 4,
    masteryThreshold: 70,
  },
];

// タグから戦略カテゴリーを取得
export function getStrategyCategory(tags: string[]): {
  categoryId: string;
  subcategoryId?: string;
  patternId?: string;
} | null {
  for (const tag of tags) {
    const mapping = TAG_MAPPINGS.find((m) => m.tag === tag);
    if (mapping) {
      return {
        categoryId: mapping.categoryId,
        subcategoryId: mapping.subcategoryId,
        patternId: mapping.patternId,
      };
    }
  }
  return null;
}

// 問題カテゴリーから戦略カテゴリーを取得
export function getStrategyCategoriesByQuestionCategory(
  categoryId: QuestionCategory,
): string[] {
  const mapping = CATEGORY_MAPPINGS.find((m) => m.categoryId === categoryId);
  return mapping ? mapping.strategyCategories : [];
}

// 難易度から推奨学習フェーズを取得
export function getRecommendedPhase(difficulty: QuestionDifficulty): number {
  const config = DIFFICULTY_CONFIGS.find((d) => d.level === difficulty);
  return config ? config.recommendedPhase : 1;
}

// 難易度から習得判定基準を取得
export function getMasteryThreshold(difficulty: QuestionDifficulty): number {
  const config = DIFFICULTY_CONFIGS.find((d) => d.level === difficulty);
  return config ? config.masteryThreshold : 80;
}

// タグの正規化（類似タグを統一）
export function normalizeTags(tags: string[]): string[] {
  const normalized = new Set<string>();

  for (const tag of tags) {
    // 類似タグの統一処理
    if (tag.includes("現金") && !tag.includes("小口")) {
      normalized.add("現金取引");
    } else if (tag.includes("小口現金")) {
      normalized.add("小口現金");
    } else if (tag.includes("当座") && tag.includes("借越")) {
      normalized.add("当座借越");
    } else if (tag.includes("当座")) {
      normalized.add("当座預金");
    } else if (tag.includes("売掛")) {
      normalized.add("売掛金");
    } else if (tag.includes("買掛")) {
      normalized.add("買掛金");
    } else if (tag.includes("手形")) {
      if (tag.includes("受取")) {
        normalized.add("受取手形");
      } else if (tag.includes("支払")) {
        normalized.add("支払手形");
      } else {
        normalized.add("手形取引");
      }
    } else if (tag.includes("給与") || tag.includes("給料")) {
      normalized.add("給与支払");
    } else if (tag.includes("源泉")) {
      normalized.add("源泉徴収");
    } else if (
      tag.includes("社会保険") ||
      tag.includes("健康保険") ||
      tag.includes("厚生年金")
    ) {
      normalized.add("社会保険料");
    } else if (tag.includes("減価償却")) {
      normalized.add("減価償却");
    } else if (tag.includes("貸倒")) {
      normalized.add("貸倒引当金");
    } else if (tag.includes("前払") && tag.includes("費用")) {
      normalized.add("前払費用");
    } else if (tag.includes("前受") && tag.includes("収益")) {
      normalized.add("前受収益");
    } else if (tag.includes("未収")) {
      normalized.add("未収収益");
    } else if (tag.includes("未払")) {
      normalized.add("未払費用");
    } else {
      // そのまま追加
      normalized.add(tag);
    }
  }

  return Array.from(normalized);
}
