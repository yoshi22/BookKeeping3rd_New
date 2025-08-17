/**
 * ログユーティリティ
 * 環境変数による制御とログレベル管理を提供
 */

/**
 * ログレベル定義
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * ログ設定
 */
interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFileLogging: boolean;
  prefix: string;
}

/**
 * ログコンテキスト情報
 */
interface LogContext {
  component?: string;
  method?: string;
  sessionId?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * ログエントリ
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

/**
 * ログサービスクラス
 */
class LogService {
  private config: LogConfig;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 1000;

  constructor() {
    // 環境変数による設定
    const isDev = __DEV__;
    const logLevelEnv = process.env.EXPO_PUBLIC_LOG_LEVEL;

    let logLevel = LogLevel.INFO;
    if (logLevelEnv) {
      switch (logLevelEnv.toUpperCase()) {
        case "DEBUG":
          logLevel = LogLevel.DEBUG;
          break;
        case "INFO":
          logLevel = LogLevel.INFO;
          break;
        case "WARN":
          logLevel = LogLevel.WARN;
          break;
        case "ERROR":
          logLevel = LogLevel.ERROR;
          break;
        case "NONE":
          logLevel = LogLevel.NONE;
          break;
      }
    } else {
      // 開発環境ではDEBUG、本番環境ではWARN
      logLevel = isDev ? LogLevel.DEBUG : LogLevel.WARN;
    }

    this.config = {
      level: logLevel,
      enableConsole:
        isDev || process.env.EXPO_PUBLIC_ENABLE_CONSOLE_LOG === "true",
      enableFileLogging: process.env.EXPO_PUBLIC_ENABLE_FILE_LOG === "true",
      prefix: "📚 BookKeeping3rd",
    };
  }

  /**
   * デバッグログ
   */
  public debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * 情報ログ
   */
  public info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * 警告ログ
   */
  public warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * エラーログ
   */
  public error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * データベース操作ログ
   */
  public database(operation: string, details?: any): void {
    this.debug(`[Database] ${operation}`, {
      component: "Database",
      operation,
      details,
    });
  }

  /**
   * サービス層ログ
   */
  public service(
    serviceName: string,
    method: string,
    message: string,
    context?: LogContext,
  ): void {
    this.debug(`[${serviceName}] ${method}: ${message}`, {
      component: serviceName,
      method,
      ...context,
    });
  }

  /**
   * UI操作ログ
   */
  public ui(component: string, action: string, details?: any): void {
    this.debug(`[UI] ${component} - ${action}`, {
      component: "UI",
      uiComponent: component,
      action,
      details,
    });
  }

  /**
   * パフォーマンスログ
   */
  public performance(
    operation: string,
    durationMs: number,
    details?: any,
  ): void {
    const level = durationMs > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `[Performance] ${operation}: ${durationMs}ms`, {
      component: "Performance",
      operation,
      duration: durationMs,
      details,
    });
  }

  /**
   * ログ出力の共通処理
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ): void {
    // ログレベルチェック
    if (level < this.config.level) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp,
      error,
    };

    // バッファに追加
    this.addToBuffer(logEntry);

    // コンソール出力
    if (this.config.enableConsole) {
      this.outputToConsole(logEntry);
    }

    // ファイル出力（実装予定）
    if (this.config.enableFileLogging) {
      // TODO: ファイルログ実装
    }
  }

  /**
   * バッファ管理
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // バッファサイズ制限
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize * 0.8);
    }
  }

  /**
   * コンソール出力
   */
  private outputToConsole(entry: LogEntry): void {
    const prefix = `${this.config.prefix} [${this.getLevelString(entry.level)}]`;
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
    const fullMessage = `${prefix} ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage);
        break;
      case LogLevel.INFO:
        console.info(fullMessage);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage);
        if (entry.error) {
          console.error("Error details:", entry.error);
        }
        break;
    }
  }

  /**
   * ログレベル文字列変換
   */
  private getLevelString(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "DEBUG";
      case LogLevel.INFO:
        return "INFO";
      case LogLevel.WARN:
        return "WARN";
      case LogLevel.ERROR:
        return "ERROR";
      default:
        return "UNKNOWN";
    }
  }

  /**
   * ログバッファ取得
   */
  public getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * ログバッファクリア
   */
  public clearLogBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * 設定取得
   */
  public getConfig(): LogConfig {
    return { ...this.config };
  }

  /**
   * 設定更新
   */
  public updateConfig(updates: Partial<LogConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

/**
 * ログサービスのシングルトンインスタンス
 */
export const logger = new LogService();

/**
 * 従来のconsole.log置き換え用ヘルパー
 */
export const log = {
  debug: (message: string, ...args: any[]) => {
    logger.debug(message, { args });
  },
  info: (message: string, ...args: any[]) => {
    logger.info(message, { args });
  },
  warn: (message: string, ...args: any[]) => {
    logger.warn(message, { args });
  },
  error: (message: string, error?: Error, ...args: any[]) => {
    logger.error(message, error, { args });
  },
};

export default logger;
