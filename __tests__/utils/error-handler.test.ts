/**
 * エラーハンドラー単体テスト
 * 簿記3級問題集アプリ - エラー処理テスト
 */

import { 
  AppError,
  DatabaseAppError,
  ValidationError,
  BusinessLogicError,
  ErrorHandler,
  ErrorRecoveryStrategy,
  safeAsyncOperation,
  getUserFriendlyErrorMessage
} from '../../src/utils/error-handler';

describe('エラークラス', () => {
  describe('AppError', () => {
    test('基本的なAppErrorが正しく作成される', () => {
      const error = new AppError(
        'Test error message',
        'TEST_ERROR',
        'HIGH',
        { userId: '123' },
        false
      );

      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.severity).toBe('HIGH');
      expect(error.context.userId).toBe('123');
      expect(error.recoverable).toBe(false);
      expect(error.timestamp).toBeDefined();
      expect(error.name).toBe('AppError');
    });

    test('デフォルト値が正しく設定される', () => {
      const error = new AppError('Test message');

      expect(error.code).toBe('UNKNOWN_ERROR');
      expect(error.severity).toBe('MEDIUM');
      expect(error.context).toEqual({});
      expect(error.recoverable).toBe(true);
    });
  });

  describe('DatabaseAppError', () => {
    test('データベースロックエラーが正しく分類される', () => {
      const originalError = new Error('database is locked');
      const dbError = new DatabaseAppError('DB operation failed', originalError);

      expect(dbError.code).toBe('DB_LOCKED');
      expect(dbError.severity).toBe('CRITICAL');
      expect(dbError.context.originalError).toBe('database is locked');
    });

    test('外部キー制約エラーが正しく分類される', () => {
      const originalError = new Error('FOREIGN KEY constraint failed');
      const dbError = new DatabaseAppError('FK violation', originalError);

      expect(dbError.code).toBe('DB_FK_VIOLATION');
      expect(dbError.severity).toBe('HIGH');
    });

    test('テーブル不存在エラーが正しく分類される', () => {
      const originalError = new Error('no such table: users');
      const dbError = new DatabaseAppError('Table not found', originalError);

      expect(dbError.code).toBe('DB_TABLE_NOT_FOUND');
      expect(dbError.severity).toBe('CRITICAL');
    });

    test('一般的なSQLエラーが正しく分類される', () => {
      const originalError = new Error('syntax error near SELECT');
      const dbError = new DatabaseAppError('SQL error', originalError);

      expect(dbError.code).toBe('DB_SYNTAX_ERROR');
      expect(dbError.severity).toBe('MEDIUM');
    });
  });

  describe('ValidationError', () => {
    test('バリデーションエラーが正しく作成される', () => {
      const error = new ValidationError(
        'Invalid email format',
        'email',
        'email_format',
        { inputValue: 'invalid-email' }
      );

      expect(error.message).toBe('Invalid email format');
      expect(error.field).toBe('email');
      expect(error.validationRule).toBe('email_format');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.severity).toBe('MEDIUM');
      expect(error.context.field).toBe('email');
      expect(error.context.inputValue).toBe('invalid-email');
    });
  });

  describe('BusinessLogicError', () => {
    test('ビジネスロジックエラーが正しく作成される', () => {
      const error = new BusinessLogicError(
        'Insufficient balance',
        'INSUFFICIENT_BALANCE',
        { currentBalance: 100, requiredAmount: 500 }
      );

      expect(error.message).toBe('Insufficient balance');
      expect(error.code).toBe('INSUFFICIENT_BALANCE');
      expect(error.severity).toBe('HIGH');
      expect(error.context.currentBalance).toBe(100);
    });
  });
});

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let mockListener: jest.Mock;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    mockListener = jest.fn();
    
    // 既存のリスナーをクリア
    while (errorHandler['errorListeners'].length > 0) {
      errorHandler.removeErrorListener(errorHandler['errorListeners'][0]);
    }
  });

  afterEach(() => {
    // コンソールモックのクリーンアップ
    jest.restoreAllMocks();
  });

  describe('シングルトンパターン', () => {
    test('同じインスタンスが返される', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('エラーリスナー管理', () => {
    test('リスナーの追加と削除', () => {
      errorHandler.addErrorListener(mockListener);
      expect(errorHandler['errorListeners']).toContain(mockListener);

      errorHandler.removeErrorListener(mockListener);
      expect(errorHandler['errorListeners']).not.toContain(mockListener);
    });

    test('エラー処理時にリスナーが呼び出される', () => {
      errorHandler.addErrorListener(mockListener);
      
      const testError = new AppError('Test error');
      errorHandler.handle(testError);

      expect(mockListener).toHaveBeenCalledWith(testError);
    });
  });

  describe('エラー処理', () => {
    test('AppErrorがそのまま処理される', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const appError = new AppError('Test app error', 'TEST_ERROR', 'MEDIUM');
      
      const result = errorHandler.handle(appError, { additional: 'context' });

      expect(result).toBe(appError);
      expect(result.context.additional).toBe('context');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('一般的なErrorがAppErrorに変換される', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const genericError = new Error('Generic error message');
      
      const result = errorHandler.handle(genericError);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('Generic error message');
      expect(result.code).toBe('GENERAL_ERROR');
      
      consoleSpy.mockRestore();
    });

    test('SQLiteエラーがDatabaseAppErrorに変換される', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const sqliteError = new Error('database connection failed');
      
      const result = errorHandler.handle(sqliteError);

      expect(result).toBeInstanceOf(DatabaseAppError);
      expect(result.code).toBe('DB_GENERAL_ERROR');
      
      consoleSpy.mockRestore();
    });
  });

  describe('データベースエラー専用処理', () => {
    test('handleDatabaseErrorが正しく動作する', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const originalError = new Error('SQLITE_BUSY: database is locked');
      
      const result = errorHandler.handleDatabaseError(
        originalError,
        'insertQuestion',
        { questionId: 'Q001' }
      );

      expect(result).toBeInstanceOf(DatabaseAppError);
      expect(result.code).toBe('DB_LOCKED');
      expect(result.context.operation).toBe('insertQuestion');
      expect(result.context.questionId).toBe('Q001');
      
      consoleSpy.mockRestore();
    });
  });

  describe('ログ出力', () => {
    test('CRITICALエラーがERRORレベルでログ出力される', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const criticalError = new AppError('Critical error', 'CRITICAL_ERROR', 'CRITICAL');
      
      errorHandler.handle(criticalError);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorHandler]',
        expect.objectContaining({
          level: 'ERROR',
          severity: 'CRITICAL'
        })
      );
      
      consoleSpy.mockRestore();
    });

    test('MEDIUMエラーがWARNレベルでログ出力される', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const mediumError = new AppError('Medium error', 'MEDIUM_ERROR', 'MEDIUM');
      
      errorHandler.handle(mediumError);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ErrorHandler]',
        expect.objectContaining({
          level: 'WARN',
          severity: 'MEDIUM'
        })
      );
      
      consoleSpy.mockRestore();
    });
  });
});

describe('ErrorRecoveryStrategy', () => {
  describe('recoverFromDatabaseLock', () => {
    test('成功した操作がそのまま返される', async () => {
      const successfulOperation = jest.fn().mockResolvedValue('success');
      
      const result = await ErrorRecoveryStrategy.recoverFromDatabaseLock(successfulOperation);

      expect(result).toBe('success');
      expect(successfulOperation).toHaveBeenCalledTimes(1);
    });

    test('データベースロックエラーでリトライが実行される', async () => {
      const lockError = new Error('database is locked');
      const failingOperation = jest.fn()
        .mockRejectedValueOnce(lockError)
        .mockRejectedValueOnce(lockError)
        .mockResolvedValueOnce('success');

      const result = await ErrorRecoveryStrategy.recoverFromDatabaseLock(
        failingOperation,
        3,
        10
      );

      expect(result).toBe('success');
      expect(failingOperation).toHaveBeenCalledTimes(3);
    });

    test('非データベースロックエラーは即座に投げられる', async () => {
      const otherError = new Error('syntax error');
      const failingOperation = jest.fn().mockRejectedValue(otherError);

      await expect(
        ErrorRecoveryStrategy.recoverFromDatabaseLock(failingOperation)
      ).rejects.toThrow('syntax error');

      expect(failingOperation).toHaveBeenCalledTimes(1);
    });

    test('最大リトライ回数に達した場合はDatabaseAppErrorが投げられる', async () => {
      const lockError = new Error('database is locked');
      const failingOperation = jest.fn().mockRejectedValue(lockError);

      await expect(
        ErrorRecoveryStrategy.recoverFromDatabaseLock(failingOperation, 2, 10)
      ).rejects.toThrow(DatabaseAppError);

      expect(failingOperation).toHaveBeenCalledTimes(2);
    });
  });
});

describe('ユーティリティ関数', () => {
  describe('safeAsyncOperation', () => {
    test('成功した操作の結果が返される', async () => {
      const successfulOperation = jest.fn().mockResolvedValue('success');
      
      const result = await safeAsyncOperation(successfulOperation);

      expect(result.result).toBe('success');
      expect(result.error).toBeUndefined();
    });

    test('失敗した操作のエラーが返される', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const failingOperation = jest.fn().mockRejectedValue(new Error('Test error'));
      
      const result = await safeAsyncOperation(failingOperation, { context: 'test' });

      expect(result.result).toBeUndefined();
      expect(result.error).toBeInstanceOf(AppError);
      expect(result.error?.message).toBe('Test error');
      expect(result.error?.context.context).toBe('test');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    test('既知のエラーコードに対してユーザーフレンドリーなメッセージが返される', () => {
      const dbLockedError = new AppError('DB locked', 'DB_LOCKED');
      const message = getUserFriendlyErrorMessage(dbLockedError);

      expect(message).toBe('データベースが使用中です。しばらく待ってから再試行してください。');
    });

    test('未知のエラーコードに対してデフォルトメッセージが返される', () => {
      const unknownError = new AppError('Unknown error', 'UNKNOWN_CODE');
      const message = getUserFriendlyErrorMessage(unknownError);

      expect(message).toBe('予期しないエラーが発生しました。');
    });

    test('各エラーコードのメッセージが正しく返される', () => {
      const testCases = [
        { code: 'DB_TABLE_NOT_FOUND', expected: 'データベースの設定に問題があります。アプリを再起動してください。' },
        { code: 'DB_FK_VIOLATION', expected: 'データの整合性に問題があります。' },
        { code: 'VALIDATION_ERROR', expected: '入力内容に問題があります。' },
        { code: 'BUSINESS_LOGIC_ERROR', expected: '処理を完了できませんでした。' }
      ];

      testCases.forEach(({ code, expected }) => {
        const error = new AppError('Test', code);
        const message = getUserFriendlyErrorMessage(error);
        expect(message).toBe(expected);
      });
    });
  });
});