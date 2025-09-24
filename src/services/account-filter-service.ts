/**
 * 勘定科目動的フィルタリングサービス
 * 問題に応じて最適な勘定科目選択肢を提供
 */

import { AccountOption, STANDARD_ACCOUNT_OPTIONS } from '@/components/shared/AccountOptions';
import {
  AccountCategory,
  CATEGORY_DEFINITIONS,
  PAIRED_ACCOUNTS,
  SIMILAR_ACCOUNTS
} from '@/data/account-categories';
import {
  QUESTION_ACCOUNT_MAPPINGS,
  QuestionAccountMapping,
  getCategoryFromQuestionId,
  getCategoryFromKeywords
} from '@/data/question-accounts-mapping';
import {
  GENERATED_QUESTION_ACCOUNT_MAPPINGS,
  GENERATION_STATS
} from '@/data/question-accounts-mapping-generated';

export interface FilteredAccountOptions {
  accounts: AccountOption[];
  totalCount: number;
  hasShowAllOption: boolean;
  category: AccountCategory;
}

export interface AccountFilterOptions {
  questionId?: string;
  questionText?: string;
  maxAccounts?: number;
  includeShowAll?: boolean;
  enableCaching?: boolean;
  excludeAccounts?: string[];
}

/**
 * 勘定科目フィルタリングサービス
 */
export class AccountFilterService {
  private static instance: AccountFilterService;
  private filterCache = new Map<string, FilteredAccountOptions>();
  private readonly MAX_CACHE_SIZE = 100;

  private constructor() {}

  static getInstance(): AccountFilterService {
    if (!AccountFilterService.instance) {
      AccountFilterService.instance = new AccountFilterService();
    }
    return AccountFilterService.instance;
  }

  /**
   * 問題IDまたは問題文に基づいて勘定科目をフィルタリング
   */
  filterAccounts(options: AccountFilterOptions): FilteredAccountOptions {
    const {
      questionId,
      questionText = '',
      maxAccounts = 15,
      includeShowAll = true,
      enableCaching = true,
      excludeAccounts = []
    } = options;

    // キャッシュチェック
    const cacheKey = this.generateCacheKey(options);
    if (enableCaching && this.filterCache.has(cacheKey)) {
      return this.filterCache.get(cacheKey)!;
    }

    // カテゴリ判定
    const category = this.determineCategory(questionId, questionText);

    // 3段階フィルタリングの実行
    const filteredAccounts = this.performThreeStageFiltering(
      questionId,
      category,
      questionText,
      maxAccounts,
      excludeAccounts
    );

    const result: FilteredAccountOptions = {
      accounts: filteredAccounts,
      totalCount: filteredAccounts.length,
      hasShowAllOption: includeShowAll && filteredAccounts.length < STANDARD_ACCOUNT_OPTIONS.length - 1,
      category
    };

    // キャッシュに保存
    if (enableCaching) {
      this.cacheResult(cacheKey, result);
    }

    return result;
  }

  /**
   * 3段階フィルタリングの実行
   */
  private performThreeStageFiltering(
    questionId: string | undefined,
    category: AccountCategory,
    questionText: string,
    maxAccounts: number,
    excludeAccounts: string[] = []
  ): AccountOption[] {
    const accountSet = new Set<string>();
    const defaultOption = STANDARD_ACCOUNT_OPTIONS[0]; // "勘定科目を選択"

    // Stage 1: 正答科目の取得（最優先）
    const primaryAccounts = this.getPrimaryAccounts(questionId);
    primaryAccounts.forEach(account => {
      if (!excludeAccounts.includes(account)) {
        accountSet.add(account);
      }
    });

    // Stage 2: 関連科目の追加
    const relatedAccounts = this.getRelatedAccounts(questionId, category, questionText);
    relatedAccounts.forEach(account => {
      if (accountSet.size < maxAccounts - 1 && !excludeAccounts.includes(account)) { // デフォルトオプション分を除く
        accountSet.add(account);
      }
    });

    // Stage 3: 補完科目の追加（必要に応じて）
    if (accountSet.size < Math.min(10, maxAccounts - 1)) {
      const supplementaryAccounts = this.getSupplementaryAccounts(category, Array.from(accountSet));
      supplementaryAccounts.forEach(account => {
        if (accountSet.size < maxAccounts - 1 && !excludeAccounts.includes(account)) {
          accountSet.add(account);
        }
      });
    }

    // 勘定科目オプションに変換
    const result = [defaultOption];
    Array.from(accountSet).forEach(accountName => {
      const option = STANDARD_ACCOUNT_OPTIONS.find(opt => opt.value === accountName);
      if (option) {
        result.push(option);
      }
    });

    return result;
  }

  /**
   * Stage 1: 正答科目の取得
   */
  private getPrimaryAccounts(questionId: string | undefined): string[] {
    if (!questionId) return [];

    // 1. 自動生成されたマッピングを優先使用
    const generatedMapping = GENERATED_QUESTION_ACCOUNT_MAPPINGS[questionId];
    if (generatedMapping && generatedMapping.primaryAccounts.length > 0) {
      return generatedMapping.primaryAccounts;
    }

    // 2. 手動マッピングをフォールバックとして使用
    const manualMapping = QUESTION_ACCOUNT_MAPPINGS[questionId];
    if (manualMapping) {
      return manualMapping.primaryAccounts;
    }

    // 3. 両方とも存在しない場合は空の配列
    return [];
  }

  /**
   * Stage 2: 関連科目の取得
   */
  private getRelatedAccounts(
    questionId: string | undefined,
    category: AccountCategory,
    questionText: string
  ): string[] {
    const relatedAccounts = new Set<string>();

    // 1. 自動生成された問題固有の関連科目
    if (questionId && GENERATED_QUESTION_ACCOUNT_MAPPINGS[questionId]) {
      GENERATED_QUESTION_ACCOUNT_MAPPINGS[questionId].relatedAccounts.forEach(account =>
        relatedAccounts.add(account)
      );
    }

    // 2. 手動マッピングからの関連科目（フォールバック）
    if (questionId && QUESTION_ACCOUNT_MAPPINGS[questionId]) {
      QUESTION_ACCOUNT_MAPPINGS[questionId].relatedAccounts.forEach(account =>
        relatedAccounts.add(account)
      );
    }

    // 3. カテゴリベースの関連科目
    const categoryDef = CATEGORY_DEFINITIONS[category];
    if (categoryDef) {
      categoryDef.coreAccounts.forEach(account => relatedAccounts.add(account));
      categoryDef.relatedAccounts.forEach(account => relatedAccounts.add(account));
    }

    // 4. 対になる勘定科目の追加
    Array.from(relatedAccounts).forEach(account => {
      const pairedAccounts = PAIRED_ACCOUNTS[account];
      if (pairedAccounts) {
        pairedAccounts.forEach(paired => relatedAccounts.add(paired));
      }
    });

    return Array.from(relatedAccounts);
  }

  /**
   * Stage 3: 補完科目の取得
   */
  private getSupplementaryAccounts(category: AccountCategory, existingAccounts: string[]): string[] {
    const supplementary = new Set<string>();

    // 類似科目の追加（学習効果のため）
    existingAccounts.forEach(account => {
      const similarAccounts = SIMILAR_ACCOUNTS[account];
      if (similarAccounts) {
        similarAccounts.forEach(similar => supplementary.add(similar));
      }
    });

    // カテゴリの補完科目
    if (category !== AccountCategory.OTHER) {
      const categoryDef = CATEGORY_DEFINITIONS[category];
      categoryDef.relatedAccounts.forEach(account => {
        if (!existingAccounts.includes(account)) {
          supplementary.add(account);
        }
      });
    }

    // 汎用的によく使われる科目（最後の手段）
    if (supplementary.size < 3) {
      ['現金', '当座預金', '普通預金'].forEach(account => {
        if (!existingAccounts.includes(account)) {
          supplementary.add(account);
        }
      });
    }

    return Array.from(supplementary);
  }

  /**
   * カテゴリの判定
   */
  private determineCategory(questionId: string | undefined, questionText: string): AccountCategory {
    // 1. 問題IDからの判定
    if (questionId) {
      const category = getCategoryFromQuestionId(questionId);
      if (category !== AccountCategory.OTHER) {
        return category;
      }
    }

    // 2. 問題文からの判定
    if (questionText) {
      const category = getCategoryFromKeywords(questionText);
      if (category !== AccountCategory.OTHER) {
        return category;
      }
    }

    // 3. デフォルト
    return AccountCategory.OTHER;
  }

  /**
   * キャッシュキーの生成
   */
  private generateCacheKey(options: AccountFilterOptions): string {
    const { questionId = '', questionText = '', maxAccounts = 15, excludeAccounts = [] } = options;
    const excludeKey = excludeAccounts.sort().join(',');
    return `${questionId}|${questionText.substring(0, 50)}|${maxAccounts}|${excludeKey}`;
  }

  /**
   * キャッシュへの結果保存
   */
  private cacheResult(key: string, result: FilteredAccountOptions): void {
    // LRUキャッシュの簡易実装
    if (this.filterCache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.filterCache.keys().next().value;
      if (firstKey) {
        this.filterCache.delete(firstKey);
      }
    }
    this.filterCache.set(key, result);
  }

  /**
   * キャッシュのクリア
   */
  clearCache(): void {
    this.filterCache.clear();
  }

  /**
   * 全ての勘定科目を取得（"その他を表示"用）
   */
  getAllAccounts(): AccountOption[] {
    return STANDARD_ACCOUNT_OPTIONS;
  }

  /**
   * 統計情報の取得
   */
  getFilteringStats(): {
    cacheSize: number;
    totalMappings: number;
    categoriesCount: number;
  } {
    return {
      cacheSize: this.filterCache.size,
      totalMappings: Object.keys(QUESTION_ACCOUNT_MAPPINGS).length,
      categoriesCount: Object.keys(CATEGORY_DEFINITIONS).length - 1 // OTHERを除く
    };
  }
}

/**
 * サービスのインスタンスを取得するヘルパー関数
 */
export const getAccountFilterService = (): AccountFilterService => {
  return AccountFilterService.getInstance();
};

/**
 * 問題に応じた勘定科目フィルタリングのメイン関数
 * コンポーネントから直接呼び出し可能
 */
export const filterAccountsForQuestion = (
  questionId?: string,
  questionText?: string,
  maxAccounts: number = 15
): FilteredAccountOptions => {
  const service = getAccountFilterService();
  return service.filterAccounts({
    questionId,
    questionText,
    maxAccounts,
    includeShowAll: true,
    enableCaching: true
  });
};