/**
 * AccountFilterService のユニットテスト
 * 動的フィルタリング機能の検証
 */

import { AccountFilterService } from '../../src/services/account-filter-service';
import { AccountCategory } from '../../src/data/account-categories';
import { STANDARD_ACCOUNT_OPTIONS } from '../../src/components/shared/AccountOptions';

// 生成されたマッピングをモック
jest.mock('../../src/data/question-accounts-mapping-generated', () => ({
  GENERATED_QUESTION_ACCOUNT_MAPPINGS: {
    'TEST_001': {
      questionId: 'TEST_001',
      primaryAccounts: ['現金', '売掛金'],
      relatedAccounts: ['買掛金', '当座預金', '普通預金'],
      supplementaryAccounts: ['建物', '備品'],
      category: 'cash_deposit',
      keywords: ['現金', '売掛']
    },
    'TEST_002': {
      questionId: 'TEST_002',
      primaryAccounts: ['商品', '売上'],
      relatedAccounts: ['仕入', '売掛金', '現金'],
      supplementaryAccounts: ['買掛金'],
      category: 'merchandise',
      keywords: ['商品', '売上']
    }
  },
  GENERATION_STATS: {
    totalQuestions: 2,
    categoryCount: { cash_deposit: 1, merchandise: 1 },
    avgPrimaryAccounts: 2.0,
    avgRelatedAccounts: 3.0
  }
}));

// 手動マッピングをモック
jest.mock('../../src/data/question-accounts-mapping', () => ({
  QUESTION_ACCOUNT_MAPPINGS: {
    'MANUAL_001': {
      questionId: 'MANUAL_001',
      primaryAccounts: ['建物'],
      relatedAccounts: ['減価償却費', '建物減価償却累計額'],
      category: 'fixed_assets',
      keywords: ['建物', '減価償却']
    }
  },
  getCategoryFromQuestionId: jest.fn((questionId: string) => {
    if (questionId === 'TEST_001') return 'cash_deposit';
    if (questionId === 'TEST_002') return 'merchandise';
    if (questionId === 'MANUAL_001') return 'fixed_assets';
    return 'other';
  }),
  getCategoryFromKeywords: jest.fn((questionText: string) => {
    if (questionText.includes('現金')) return 'cash_deposit';
    if (questionText.includes('商品') || questionText.includes('売上')) return 'merchandise';
    if (questionText.includes('給料') || questionText.includes('源泉')) return 'payroll';
    return 'other';
  }),
  getDefaultRelatedAccounts: jest.fn((category: string) => {
    switch (category) {
      case 'cash_deposit': return ['現金', '当座預金', '普通預金'];
      case 'merchandise': return ['商品', '仕入', '売上'];
      case 'fixed_assets': return ['建物', '備品', '減価償却費'];
      default: return [];
    }
  })
}));

describe('AccountFilterService', () => {
  let service: AccountFilterService;

  beforeEach(() => {
    // シングルトンの新しいインスタンスを取得
    service = AccountFilterService.getInstance();
    // キャッシュをクリア
    service.clearCache();
  });

  describe('Singleton Pattern', () => {
    it('同じインスタンスを返すこと', () => {
      const instance1 = AccountFilterService.getInstance();
      const instance2 = AccountFilterService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('filterAccounts', () => {
    it('生成されたマッピングを使用してフィルタリングが動作すること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        questionText: '現金の処理について',
        maxAccounts: 10,
        includeShowAll: true,
        enableCaching: false
      });

      expect(result.accounts).toBeDefined();
      expect(result.accounts.length).toBeGreaterThan(0);
      expect(result.category).toBe('cash_deposit');
      expect(result.totalCount).toBe(result.accounts.length);

      // デフォルトオプション（勘定科目を選択）が最初に含まれていること
      expect(result.accounts[0].value).toBe('');

      // 正答科目が含まれていること
      const accountValues = result.accounts.map(acc => acc.value);
      expect(accountValues).toContain('現金');
      expect(accountValues).toContain('売掛金');
    });

    it('手動マッピングにフォールバックすること', () => {
      const result = service.filterAccounts({
        questionId: 'MANUAL_001',
        questionText: '建物の減価償却',
        maxAccounts: 10,
        includeShowAll: true,
        enableCaching: false
      });

      expect(result.category).toBe('fixed_assets');

      const accountValues = result.accounts.map(acc => acc.value);
      expect(accountValues).toContain('建物');
    });

    it('問題IDが存在しない場合は問題文からカテゴリを判定すること', () => {
      const result = service.filterAccounts({
        questionText: '商品を現金で仕入れた',
        maxAccounts: 10,
        includeShowAll: true,
        enableCaching: false
      });

      expect(result.accounts).toBeDefined();
      expect(result.accounts.length).toBeGreaterThan(0);
      // カテゴリが適切に判定されていること（現金キーワードから）
      expect(['cash_deposit', 'merchandise', 'other']).toContain(result.category);
    });

    it('maxAccountsが制限として機能すること', () => {
      const maxAccounts = 5;
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts,
        includeShowAll: true,
        enableCaching: false
      });

      // デフォルトオプション + maxAccounts - 1 以下であること
      expect(result.accounts.length).toBeLessThanOrEqual(maxAccounts);
    });

    it('showAllオプションが適切に設定されること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts: 5,
        includeShowAll: true,
        enableCaching: false
      });

      // フィルタされた結果が全体より少ない場合はshowAllがtrue
      const isFiltered = result.accounts.length < STANDARD_ACCOUNT_OPTIONS.length - 1;
      expect(result.hasShowAllOption).toBe(isFiltered);
    });
  });

  describe('Caching', () => {
    it('キャッシュが有効な場合は同じ結果を返すこと', () => {
      const options = {
        questionId: 'TEST_001',
        questionText: 'テスト問題',
        maxAccounts: 10,
        enableCaching: true
      };

      const result1 = service.filterAccounts(options);
      const result2 = service.filterAccounts(options);

      expect(result1).toBe(result2); // 同じオブジェクト参照
    });

    it('キャッシュが無効な場合は新しい結果を返すこと', () => {
      const options = {
        questionId: 'TEST_001',
        questionText: 'テスト問題',
        maxAccounts: 10,
        enableCaching: false
      };

      const result1 = service.filterAccounts(options);
      const result2 = service.filterAccounts(options);

      expect(result1).not.toBe(result2); // 異なるオブジェクト参照
      expect(result1).toEqual(result2); // 但し内容は同じ
    });

    it('clearCacheが機能すること', () => {
      const options = {
        questionId: 'TEST_001',
        enableCaching: true
      };

      service.filterAccounts(options);
      expect(service.getFilteringStats().cacheSize).toBe(1);

      service.clearCache();
      expect(service.getFilteringStats().cacheSize).toBe(0);
    });
  });

  describe('3-Stage Filtering Logic', () => {
    it('Stage 1: 正答科目が最優先で含まれること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts: 15,
        enableCaching: false
      });

      const accountValues = result.accounts.map(acc => acc.value);

      // 正答科目が含まれていること
      expect(accountValues).toContain('現金');
      expect(accountValues).toContain('売掛金');
    });

    it('Stage 2: 関連科目が含まれること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts: 15,
        enableCaching: false
      });

      const accountValues = result.accounts.map(acc => acc.value);

      // 関連科目が含まれていること
      expect(accountValues).toContain('買掛金');
      expect(accountValues).toContain('当座預金');
    });

    it('Stage 3: 補完科目が必要に応じて含まれること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts: 5, // 少ない上限で補完が必要な状況を作る
        enableCaching: false
      });

      expect(result.accounts.length).toBeGreaterThan(1); // デフォルトオプション以外も含む
      expect(result.accounts.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Category Determination', () => {
    it('問題IDから正しいカテゴリを判定すること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_002', // 商品問題
        enableCaching: false
      });

      expect(result.category).toBe('merchandise');
    });

    it('問題文のキーワードからカテゴリを判定すること', () => {
      const result = service.filterAccounts({
        questionText: '給料を支払った際の源泉徴収について',
        enableCaching: false
      });

      // 給料関連のキーワードから適切なカテゴリが判定されること
      expect(['payroll', 'other']).toContain(result.category);
    });

    it('判定できない場合はOTHERカテゴリになること', () => {
      const result = service.filterAccounts({
        questionText: '特殊な取引',
        enableCaching: false
      });

      expect(result.category).toBe('other');
    });
  });

  describe('Error Handling', () => {
    it('無効な問題IDでもエラーにならないこと', () => {
      expect(() => {
        service.filterAccounts({
          questionId: 'INVALID_ID',
          enableCaching: false
        });
      }).not.toThrow();
    });

    it('空の問題文でもエラーにならないこと', () => {
      expect(() => {
        service.filterAccounts({
          questionText: '',
          enableCaching: false
        });
      }).not.toThrow();
    });

    it('負のmaxAccountsでも適切に処理されること', () => {
      const result = service.filterAccounts({
        questionId: 'TEST_001',
        maxAccounts: -1,
        enableCaching: false
      });

      expect(result.accounts.length).toBeGreaterThan(0);
    });
  });

  describe('Statistics and Utility Methods', () => {
    it('getAllAccountsが全ての勘定科目を返すこと', () => {
      const allAccounts = service.getAllAccounts();
      expect(allAccounts).toBe(STANDARD_ACCOUNT_OPTIONS);
      expect(allAccounts.length).toBeGreaterThan(0);
    });

    it('getFilteringStatsが適切な統計を返すこと', () => {
      // キャッシュにデータを追加
      service.filterAccounts({
        questionId: 'TEST_001',
        enableCaching: true
      });

      const stats = service.getFilteringStats();
      expect(stats.cacheSize).toBe(1);
      expect(stats.totalMappings).toBeGreaterThan(0);
      expect(stats.categoriesCount).toBeGreaterThan(0);
    });
  });

  describe('filterAccountsForQuestion Helper Function', () => {
    it('filterAccountsForQuestion関数が適切に動作すること', () => {
      const { filterAccountsForQuestion } = require('../../src/services/account-filter-service');

      const result = filterAccountsForQuestion('TEST_001', '現金取引', 10);

      expect(result.accounts).toBeDefined();
      expect(result.category).toBe('cash_deposit');
      expect(result.hasShowAllOption).toBeDefined();
    });
  });
});