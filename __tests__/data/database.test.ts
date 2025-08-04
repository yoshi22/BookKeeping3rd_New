/**
 * データベースサービス単体テスト
 * 簿記3級問題集アプリ - データベース基盤テスト
 */

import { DatabaseService } from '../../src/data/database';

// SQLiteのモック
jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
    close: jest.fn()
  }))
}));

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    // 各テスト前に新しいインスタンスを作成
    databaseService = DatabaseService.getInstance();
    
    // モックをリセット
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    if (databaseService.isConnected()) {
      await databaseService.close();
    }
  });

  describe('初期化', () => {
    test('シングルトンパターンが正しく動作する', () => {
      const instance1 = DatabaseService.getInstance();
      const instance2 = DatabaseService.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    test('initialize()が成功する', async () => {
      // モックの設定
      const mockDb = {
        transaction: jest.fn((callback) => {
          const mockTx = {
            executeSql: jest.fn((sql, params, success) => {
              if (success) success(mockTx, { rows: { length: 0 }, rowsAffected: 0 });
            })
          };
          callback(mockTx);
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await expect(databaseService.initialize()).resolves.not.toThrow();
      expect(databaseService.isConnected()).toBe(true);
    });

    test('initialize()で失敗した場合にエラーが投げられる', async () => {
      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockImplementation(() => {
        throw new Error('Database initialization failed');
      });

      await expect(databaseService.initialize()).rejects.toThrow();
    });
  });

  describe('SQL実行', () => {
    beforeEach(async () => {
      // テスト用のデータベース初期化
      const mockDb = {
        transaction: jest.fn((callback) => {
          const mockTx = {
            executeSql: jest.fn((sql, params, success) => {
              if (success) {
                success(mockTx, { 
                  rows: { 
                    length: 1, 
                    item: jest.fn(() => ({ id: 1, name: 'test' }))
                  }, 
                  rowsAffected: 1,
                  insertId: 1
                });
              }
            })
          };
          callback(mockTx);
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();
    });

    test('executeSql()が正常に動作する', async () => {
      const result = await databaseService.executeSql('SELECT * FROM test', []);
      
      expect(result).toHaveProperty('rows');
      expect(result).toHaveProperty('rowsAffected');
      expect(result.rowsAffected).toBe(1);
    });

    test('SQLエラーが適切にハンドリングされる', async () => {
      // エラーを発生させるモックの設定
      const mockDb = {
        transaction: jest.fn((callback, errorCallback) => {
          errorCallback(new Error('SQL syntax error'));
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      // 新しいインスタンスでエラーテスト
      const errorService = DatabaseService.getInstance();
      await errorService.initialize();

      await expect(
        errorService.executeSql('INVALID SQL', [])
      ).rejects.toThrow();
    });
  });

  describe('トランザクション', () => {
    beforeEach(async () => {
      const mockDb = {
        transaction: jest.fn((callback, errorCallback, successCallback) => {
          const mockTx = {
            executeSql: jest.fn((sql, params, success) => {
              if (success) success(mockTx, { rows: { length: 0 }, rowsAffected: 1 });
            })
          };
          try {
            callback(mockTx);
            if (successCallback) successCallback();
          } catch (error) {
            if (errorCallback) errorCallback(error);
          }
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();
    });

    test('executeTransaction()が正常に動作する', async () => {
      const operations = jest.fn(async (tx) => {
        // トランザクション内での操作をシミュレート
        return new Promise<void>((resolve) => {
          tx.executeSql('INSERT INTO test VALUES (?)', ['test'], resolve);
        });
      });

      const result = await databaseService.executeTransaction(operations);
      
      expect(result.success).toBe(true);
      expect(operations).toHaveBeenCalled();
    });

    test('トランザクション内でエラーが発生した場合のロールバック', async () => {
      const operations = jest.fn(async () => {
        throw new Error('Transaction operation failed');
      });

      await expect(
        databaseService.executeTransaction(operations)
      ).rejects.toThrow();
    });
  });

  describe('データベース管理', () => {
    beforeEach(async () => {
      const mockDb = {
        transaction: jest.fn((callback) => {
          const mockTx = {
            executeSql: jest.fn((sql, params, success) => {
              if (success) {
                if (sql.includes('integrity_check')) {
                  success(mockTx, { 
                    rows: { 
                      length: 1, 
                      item: jest.fn(() => ({ integrity_check: 'ok' }))
                    }
                  });
                } else {
                  success(mockTx, { rows: { length: 0 }, rowsAffected: 0 });
                }
              }
            })
          };
          callback(mockTx);
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();
    });

    test('checkIntegrity()が正常に動作する', async () => {
      const isHealthy = await databaseService.checkIntegrity();
      expect(isHealthy).toBe(true);
    });

    test('getStats()が統計情報を返す', async () => {
      const stats = await databaseService.getStats();
      
      expect(stats).toHaveProperty('tables');
      expect(stats).toHaveProperty('version');
      expect(stats).toHaveProperty('integrityCheck');
      expect(stats.integrityCheck).toBe(true);
    });

    test('getConfig()が設定情報を返す', () => {
      const config = databaseService.getConfig();
      
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('version');
      expect(config.name).toBe('bookkeeping.db');
    });
  });

  describe('接続管理', () => {
    test('isConnected()が正しい状態を返す', async () => {
      expect(databaseService.isConnected()).toBe(false);

      const mockDb = {
        transaction: jest.fn(),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();
      expect(databaseService.isConnected()).toBe(true);
    });

    test('close()が正常に動作する', async () => {
      const mockClose = jest.fn((success) => {
        if (success) success();
      });

      const mockDb = {
        transaction: jest.fn(),
        executeSql: jest.fn(),
        close: mockClose
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();
      await databaseService.close();

      expect(mockClose).toHaveBeenCalled();
      expect(databaseService.isConnected()).toBe(false);
    });
  });

  describe('エラーハンドリング', () => {
    test('createDatabaseErrorが適切なエラーオブジェクトを作成する', async () => {
      const mockDb = {
        transaction: jest.fn((callback, errorCallback) => {
          const error = new Error('Database error');
          (error as any).code = 'SQLITE_ERROR';
          errorCallback(error);
        }),
        executeSql: jest.fn(),
        close: jest.fn()
      };

      const { openDatabase } = require('expo-sqlite');
      openDatabase.mockReturnValue(mockDb);

      await databaseService.initialize();

      try {
        await databaseService.executeSql('INVALID SQL');
      } catch (error: any) {
        expect(error.code).toBeDefined();
        expect(error.severity).toBeDefined();
        expect(error.context).toBeDefined();
        expect(error.recoverable).toBeDefined();
      }
    });
  });
});