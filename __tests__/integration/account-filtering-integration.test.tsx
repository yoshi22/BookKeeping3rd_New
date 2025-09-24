/**
 * アカウントフィルタリング統合テスト
 * AccountFilterService の統合テスト
 */

import { AccountFilterService } from '../../src/services/account-filter-service';

// モックデータセットアップ
jest.mock('../../src/data/question-accounts-mapping-generated', () => ({
  GENERATED_QUESTION_ACCOUNT_MAPPINGS: {
    'Q_J_001': {
      questionId: 'Q_J_001',
      primaryAccounts: ['現金', '売掛金'],
      relatedAccounts: ['買掛金', '当座預金', '普通預金', '定期預金'],
      supplementaryAccounts: ['建物', '備品'],
      category: 'cash_deposit',
      keywords: ['現金', '売掛']
    },
    'Q_J_002': {
      questionId: 'Q_J_002',
      primaryAccounts: ['商品', '売上'],
      relatedAccounts: ['仕入', '売掛金', '現金', '買掛金'],
      supplementaryAccounts: ['前払金', '前受金'],
      category: 'merchandise',
      keywords: ['商品', '売上', '仕入']
    }
  },
  GENERATION_STATS: {
    totalQuestions: 2,
    categoryCount: { cash_deposit: 1, merchandise: 1 },
    avgPrimaryAccounts: 2.0,
    avgRelatedAccounts: 4.0
  }
}));

jest.mock('../../src/data/question-accounts-mapping', () => ({
  QUESTION_ACCOUNT_MAPPINGS: {},
  getCategoryFromQuestionId: jest.fn((questionId: string) => {
    if (questionId === 'Q_J_001') return 'cash_deposit';
    if (questionId === 'Q_J_002') return 'merchandise';
    return 'other';
  }),
  getCategoryFromKeywords: jest.fn((questionText: string) => {
    if (questionText.includes('現金')) return 'cash_deposit';
    if (questionText.includes('給料') || questionText.includes('源泉')) return 'payroll';
    if (questionText.includes('商品') || questionText.includes('売上')) return 'merchandise';
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

describe('Account Filtering Integration', () => {
  let service: AccountFilterService;

  beforeEach(() => {
    service = AccountFilterService.getInstance();
    service.clearCache();
  });

  describe('End-to-End Filtering Scenarios', () => {
    it('完全なフィルタリングワークフローが動作すること', () => {
      // 実際の問題解答シナリオをシミュレート
      const result = service.filterAccounts({
        questionId: 'Q_J_001',
        questionText: '現金で商品を購入した',
        maxAccounts: 15,
        includeShowAll: true,
        enableCaching: true
      });

      // 結果検証
      expect(result.accounts).toBeDefined();
      expect(result.accounts.length).toBeGreaterThan(0);
      expect(result.category).toBe('cash_deposit');
      expect(result.totalCount).toBe(result.accounts.length);

      // 正答科目が最優先で含まれること
      const accountValues = result.accounts.map(acc => acc.value);
      expect(accountValues).toContain('現金');
      expect(accountValues).toContain('売掛金');

      // 関連科目が含まれること
      expect(accountValues).toContain('買掛金');
      expect(accountValues).toContain('当座預金');
    });

    it('異なる問題タイプで適切なフィルタリングが動作すること', () => {
      // 商品問題のテスト
      const merchandiseResult = service.filterAccounts({
        questionId: 'Q_J_002',
        questionText: '商品を売上げた',
        maxAccounts: 15,
        enableCaching: false
      });

      expect(merchandiseResult.category).toBe('merchandise');
      const merchandiseAccounts = merchandiseResult.accounts.map(acc => acc.value);
      expect(merchandiseAccounts).toContain('商品');
      expect(merchandiseAccounts).toContain('売上');
      expect(merchandiseAccounts).toContain('仕入');

      // 現金問題のテスト
      const cashResult = service.filterAccounts({
        questionId: 'Q_J_001',
        questionText: '現金取引',
        maxAccounts: 15,
        enableCaching: false
      });

      expect(cashResult.category).toBe('cash_deposit');
      const cashAccounts = cashResult.accounts.map(acc => acc.value);
      expect(cashAccounts).toContain('現金');
      expect(cashAccounts).toContain('売掛金');
    });

    it('制限数によるフィルタリングが適切に動作すること', () => {
      // 制限数が少ない場合
      const limitedResult = service.filterAccounts({
        questionId: 'Q_J_001',
        maxAccounts: 5,
        enableCaching: false
      });

      expect(limitedResult.accounts.length).toBeLessThanOrEqual(5);
      expect(limitedResult.hasShowAllOption).toBe(true);

      // 制限数が多い場合
      const extendedResult = service.filterAccounts({
        questionId: 'Q_J_001',
        maxAccounts: 50,
        enableCaching: false
      });

      expect(extendedResult.accounts.length).toBeGreaterThan(limitedResult.accounts.length);
    });

    it('除外勘定科目が正しく処理されること', () => {
      const result = service.filterAccounts({
        questionId: 'Q_J_001',
        excludeAccounts: ['現金', '売掛金'],
        maxAccounts: 15,
        enableCaching: false
      });

      const accountValues = result.accounts.map(acc => acc.value);
      expect(accountValues).not.toContain('現金');
      expect(accountValues).not.toContain('売掛金');

      // 他の関連科目は含まれること
      expect(accountValues).toContain('買掛金');
      expect(accountValues).toContain('当座預金');
    });

    it('問題文のみでもカテゴリ判定が動作すること', () => {
      const result = service.filterAccounts({
        questionText: '給料を支払った際の源泉徴収',
        maxAccounts: 15,
        enableCaching: false
      });

      expect(result.accounts).toBeDefined();
      expect(result.accounts.length).toBeGreaterThan(0);
      // 給料関連のキーワードから適切なカテゴリが判定される
      expect(['payroll', 'other']).toContain(result.category);
    });
  });

  describe('Performance and Caching', () => {
    it('同じ条件でのフィルタリングがキャッシュを使用すること', () => {
      const initialCacheSize = service.getFilteringStats().cacheSize;

      // 初回フィルタリング
      service.filterAccounts({
        questionId: 'Q_J_001',
        enableCaching: true
      });

      const newCacheSize = service.getFilteringStats().cacheSize;
      expect(newCacheSize).toBe(initialCacheSize + 1);

      // 同じ条件で再度フィルタリング
      const result1 = service.filterAccounts({
        questionId: 'Q_J_001',
        enableCaching: true
      });

      const result2 = service.filterAccounts({
        questionId: 'Q_J_001',
        enableCaching: true
      });

      // 同じオブジェクト参照（キャッシュヒット）
      expect(result1).toBe(result2);

      // キャッシュサイズが変わらない
      const finalCacheSize = service.getFilteringStats().cacheSize;
      expect(finalCacheSize).toBe(initialCacheSize + 1);
    });

    it('キャッシュが無効な場合は毎回新しいフィルタリングが実行されること', () => {
      service.clearCache();

      const result1 = service.filterAccounts({
        questionId: 'Q_J_001',
        enableCaching: false
      });

      const result2 = service.filterAccounts({
        questionId: 'Q_J_001',
        enableCaching: false
      });

      // 異なるオブジェクト参照（キャッシュなし）
      expect(result1).not.toBe(result2);
      // しかし内容は同じ
      expect(result1).toEqual(result2);

      // キャッシュサイズが0のまま
      const cacheSize = service.getFilteringStats().cacheSize;
      expect(cacheSize).toBe(0);
    });

    it('統計情報が正しく取得されること', () => {
      service.clearCache();

      // いくつかのフィルタリングを実行
      service.filterAccounts({ questionId: 'Q_J_001', enableCaching: true });
      service.filterAccounts({ questionId: 'Q_J_002', enableCaching: true });

      const stats = service.getFilteringStats();
      expect(stats.cacheSize).toBe(2);
      expect(stats.totalMappings).toBeGreaterThanOrEqual(0);
      expect(stats.categoriesCount).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('無効な問題IDでもエラーにならずデフォルトフィルタリングが動作すること', () => {
      expect(() => {
        const result = service.filterAccounts({
          questionId: 'INVALID_QUESTION_ID',
          enableCaching: false
        });

        expect(result.accounts).toBeDefined();
        expect(result.accounts.length).toBeGreaterThan(0);
        expect(result.category).toBe('other');
      }).not.toThrow();
    });

    it('問題テキストのみでも適切にフィルタリングが動作すること', () => {
      const result = service.filterAccounts({
        questionText: '現金で商品を購入した',
        enableCaching: false
      });

      expect(result.accounts).toBeDefined();
      expect(result.accounts.length).toBeGreaterThan(0);
      // 問題文のキーワードから判定される
      expect(['cash_deposit', 'merchandise', 'other']).toContain(result.category);
    });

    it('空の条件でもエラーにならずデフォルト表示が動作すること', () => {
      expect(() => {
        const result = service.filterAccounts({
          enableCaching: false
        });

        expect(result.accounts).toBeDefined();
        expect(result.accounts.length).toBeGreaterThan(0);
        expect(result.category).toBe('other');
      }).not.toThrow();
    });

    it('極端な制限値でも適切に処理されること', () => {
      // 非常に小さい制限（デフォルトオプション + 最低限の正答科目）
      const smallResult = service.filterAccounts({
        questionId: 'Q_J_001',
        maxAccounts: 1,
        enableCaching: false
      });

      // デフォルトオプション + 最低1つの勘定科目は保証される
      expect(smallResult.accounts.length).toBeGreaterThan(0);
      expect(smallResult.accounts.length).toBeLessThanOrEqual(5); // 現実的な上限

      // 負の制限（無効値）
      const negativeResult = service.filterAccounts({
        questionId: 'Q_J_001',
        maxAccounts: -5,
        enableCaching: false
      });

      expect(negativeResult.accounts.length).toBeGreaterThan(0);

      // 非常に大きい制限
      const largeResult = service.filterAccounts({
        questionId: 'Q_J_001',
        maxAccounts: 1000,
        enableCaching: false
      });

      expect(largeResult.accounts.length).toBeGreaterThan(0);
    });
  });
});