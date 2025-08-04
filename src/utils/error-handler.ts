/**
 * エラーハンドリングユーティリティ
 * 簿記3級問題集アプリ - 統一的なエラー処理
 */

import { DatabaseError, LogLevel } from '../types/database';

/**
 * アプリケーションエラーのベースクラス
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  public readonly context: Record<string, any>;
  public readonly recoverable: boolean;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    context: Record<string, any> = {},
    recoverable: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.recoverable = recoverable;
    this.timestamp = new Date().toISOString();

    // スタックトレースの設定
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * データベース関連エラー
 */
export class DatabaseAppError extends AppError {
  constructor(
    message: string,
    originalError?: any,
    context: Record<string, any> = {}
  ) {
    const severity = DatabaseAppError.determineSeverity(originalError);
    const code = DatabaseAppError.determineErrorCode(originalError);
    
    super(
      message,
      code,
      severity,
      {
        ...context,
        originalError: originalError?.message || originalError,
        sqlCode: originalError?.code
      },
      severity !== 'CRITICAL'
    );
  }

  private static determineSeverity(error: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (!error) return 'MEDIUM';
    
    const errorMessage = error.message || error.toString();
    
    // データベース破損・接続不可
    if (errorMessage.includes('database is locked') || 
        errorMessage.includes('no such table') ||
        errorMessage.includes('disk I/O error')) {
      return 'CRITICAL';
    }
    
    // データ整合性エラー
    if (errorMessage.includes('FOREIGN KEY constraint') ||
        errorMessage.includes('UNIQUE constraint') ||
        errorMessage.includes('CHECK constraint')) {
      return 'HIGH';
    }
    
    // 一般的なSQLエラー
    if (errorMessage.includes('syntax error') ||
        errorMessage.includes('no such column')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }

  private static determineErrorCode(error: any): string {
    if (!error) return 'DB_UNKNOWN_ERROR';
    
    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes('database is locked')) return 'DB_LOCKED';
    if (errorMessage.includes('no such table')) return 'DB_TABLE_NOT_FOUND';
    if (errorMessage.includes('no such column')) return 'DB_COLUMN_NOT_FOUND';
    if (errorMessage.includes('FOREIGN KEY constraint')) return 'DB_FK_VIOLATION';
    if (errorMessage.includes('UNIQUE constraint')) return 'DB_UNIQUE_VIOLATION';
    if (errorMessage.includes('CHECK constraint')) return 'DB_CHECK_VIOLATION';
    if (errorMessage.includes('syntax error')) return 'DB_SYNTAX_ERROR';
    if (errorMessage.includes('disk I/O error')) return 'DB_IO_ERROR';
    
    return 'DB_GENERAL_ERROR';
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly validationRule?: string;
  
  constructor(
    message: string,
    field?: string,
    validationRule?: string,
    context: Record<string, any> = {}
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      'MEDIUM',
      { ...context, field, validationRule },
      true
    );
    
    this.field = field;
    this.validationRule = validationRule;
  }
}

/**
 * ビジネスロジックエラー
 */
export class BusinessLogicError extends AppError {
  constructor(
    message: string,
    code: string = 'BUSINESS_LOGIC_ERROR',
    context: Record<string, any> = {}
  ) {
    super(message, code, 'HIGH', context, true);
  }
}

/**
 * エラーハンドラークラス
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * エラーリスナー追加
   */
  public addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * エラーリスナー削除
   */
  public removeErrorListener(listener: (error: AppError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * エラー処理
   */
  public handle(error: Error | AppError, context: Record<string, any> = {}): AppError {
    let appError: AppError;

    // AppErrorの場合はそのまま使用
    if (error instanceof AppError) {
      appError = error;
      // コンテキストを追加
      Object.assign(appError.context, context);
    } else {
      // 一般的なErrorをAppErrorに変換
      appError = this.convertToAppError(error, context);
    }

    // ログ出力
    this.logError(appError);

    // リスナーに通知
    this.notifyListeners(appError);

    return appError;
  }

  /**
   * データベースエラー専用処理
   */
  public handleDatabaseError(
    error: any,
    operation: string,
    context: Record<string, any> = {}
  ): DatabaseAppError {
    const dbError = new DatabaseAppError(
      `Database operation failed: ${operation}`,
      error,
      { ...context, operation }
    );

    this.logError(dbError);
    this.notifyListeners(dbError);

    return dbError;
  }

  /**
   * 一般的なErrorをAppErrorに変換
   */
  private convertToAppError(error: Error, context: Record<string, any>): AppError {
    // SQLiteエラーの場合
    if (error.message && (
        error.message.includes('database') || 
        error.message.includes('SQL') ||
        error.message.includes('sqlite')
      )) {
      return new DatabaseAppError('Database operation failed', error, context);
    }

    // その他の一般的なエラー
    return new AppError(
      error.message || 'Unknown error occurred',
      'GENERAL_ERROR',
      'MEDIUM',
      { ...context, originalError: error.message },
      true
    );
  }

  /**
   * エラーログ出力
   */
  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logData = {
      timestamp: error.timestamp,
      level: logLevel,
      code: error.code,
      message: error.message,
      severity: error.severity,
      recoverable: error.recoverable,
      context: error.context,
      stack: error.stack
    };

    // コンソール出力（実際の実装では適切なログシステムを使用）
    switch (logLevel) {
      case 'ERROR':
        console.error('[ErrorHandler]', logData);
        break;
      case 'WARN':
        console.warn('[ErrorHandler]', logData);
        break;
      case 'INFO':
        console.info('[ErrorHandler]', logData);
        break;
      case 'DEBUG':
      default:
        console.log('[ErrorHandler]', logData);
        break;
    }
  }

  /**
   * 重要度からログレベルを決定
   */
  private getLogLevel(severity: string): LogLevel {
    switch (severity) {
      case 'CRITICAL':
        return 'ERROR';
      case 'HIGH':
        return 'ERROR';
      case 'MEDIUM':
        return 'WARN';
      case 'LOW':
      default:
        return 'INFO';
    }
  }

  /**
   * エラーリスナーに通知
   */
  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('[ErrorHandler] リスナーエラー:', listenerError);
      }
    });
  }
}

/**
 * エラー回復戦略
 */
export class ErrorRecoveryStrategy {
  /**
   * データベースロックエラーの回復
   */
  public static async recoverFromDatabaseLock<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 100
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!this.isDatabaseLockError(error)) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // 指数バックオフで待機
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`[ErrorRecoveryStrategy] データベースロック検出, ${delay}ms後にリトライ (${attempt}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new DatabaseAppError(
      `Database operation failed after ${maxRetries} retries`,
      lastError!,
      { maxRetries, operation: operation.name }
    );
  }

  /**
   * データベースロックエラーかどうかを判定
   */
  private static isDatabaseLockError(error: any): boolean {
    const message = error?.message || error?.toString() || '';
    return message.includes('database is locked') || message.includes('SQLITE_BUSY');
  }
}

/**
 * エラーハンドラーのシングルトンインスタンス
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * 便利な関数群
 */

/**
 * 非同期操作をエラーハンドリング付きで実行
 */
export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  errorContext: Record<string, any> = {}
): Promise<{ result?: T; error?: AppError }> {
  try {
    const result = await operation();
    return { result };
  } catch (error) {
    const appError = errorHandler.handle(error as Error, errorContext);
    return { error: appError };
  }
}

/**
 * エラーメッセージをユーザーフレンドリーに変換
 */
export function getUserFriendlyErrorMessage(error: AppError): string {
  const userMessages: Record<string, string> = {
    'DB_LOCKED': 'データベースが使用中です。しばらく待ってから再試行してください。',
    'DB_TABLE_NOT_FOUND': 'データベースの設定に問題があります。アプリを再起動してください。',
    'DB_FK_VIOLATION': 'データの整合性に問題があります。',
    'DB_UNIQUE_VIOLATION': '重複するデータが存在します。',
    'VALIDATION_ERROR': '入力内容に問題があります。',
    'BUSINESS_LOGIC_ERROR': '処理を完了できませんでした。',
    'NETWORK_ERROR': 'ネットワーク接続を確認してください。',
    'UNKNOWN_ERROR': '予期しないエラーが発生しました。'
  };

  return userMessages[error.code] || userMessages['UNKNOWN_ERROR'];
}