/**
 * データベースサービス - メインオーケストレーター
 * database.ts分割 - Phase 4
 */

import {
  Database,
  DatabaseConfig,
  DatabaseError,
  DatabaseResult,
  QueryResult,
} from "../../types/database";
import { logger } from "../../utils/logger";
import { DATABASE_CONFIG, getDatabaseConfig } from "./DatabaseConfig";
import { DatabaseConnection } from "./DatabaseConnection";
import { DatabaseOperations } from "./DatabaseOperations";

/**
 * データベース管理クラス - 分割版
 * 接続管理と操作実行を分離し、責任を明確化
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private connection: DatabaseConnection;
  private operations: DatabaseOperations | null = null;

  private constructor() {
    this.connection = new DatabaseConnection();
  }

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * データベース初期化
   */
  public async initialize(): Promise<void> {
    try {
      logger.database("DatabaseService初期化開始", {
        component: "DatabaseService",
      });

      // 接続の初期化
      await this.connection.initialize();

      // 操作クラスの初期化
      const db = this.connection.getDatabase();
      if (!db) {
        throw new Error("データベース接続の取得に失敗しました");
      }

      this.operations = new DatabaseOperations(db);

      logger.database("DatabaseService初期化完了", {
        component: "DatabaseService",
        isReady: this.isReady(),
      });
    } catch (error) {
      logger.error("DatabaseService初期化エラー", error as Error, {
        component: "DatabaseService",
      });
      throw error;
    }
  }

  /**
   * SQLクエリ実行
   */
  public async executeSql<T = any>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    await this.ensureInitialized();

    if (!this.operations) {
      throw this.createDatabaseError(
        "Database operations not initialized",
        null,
        "CRITICAL",
      );
    }

    return this.operations.executeSql<T>(sql, params);
  }

  /**
   * トランザクション実行
   */
  public async executeTransaction(
    operations: (db: any) => Promise<void>,
  ): Promise<DatabaseResult> {
    await this.ensureInitialized();

    if (!this.operations) {
      throw this.createDatabaseError(
        "Database operations not initialized",
        null,
        "CRITICAL",
      );
    }

    return this.operations.executeTransaction(operations);
  }

  /**
   * データベース整合性チェック
   */
  public async checkIntegrity(): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.operations) {
      logger.warn("Database operations not initialized for integrity check");
      return false;
    }

    return this.operations.checkIntegrity();
  }

  /**
   * データベース統計情報取得
   */
  public async getStats(): Promise<any> {
    await this.ensureInitialized();

    if (!this.operations) {
      throw this.createDatabaseError(
        "Database operations not initialized",
        null,
        "CRITICAL",
      );
    }

    return this.operations.getStats();
  }

  /**
   * データベース接続クローズ
   */
  public async close(): Promise<void> {
    try {
      logger.database("DatabaseService クローズ開始", {
        component: "DatabaseService",
      });

      await this.connection.close();
      this.operations = null;

      logger.database("DatabaseService クローズ完了", {
        component: "DatabaseService",
      });
    } catch (error) {
      logger.error("DatabaseService クローズエラー", error as Error, {
        component: "DatabaseService",
      });
      throw error;
    }
  }

  /**
   * データベースリセット
   */
  public async resetDatabase(): Promise<void> {
    await this.ensureInitialized();

    if (!this.operations) {
      throw this.createDatabaseError(
        "Database operations not initialized",
        null,
        "CRITICAL",
      );
    }

    return this.operations.resetDatabase();
  }

  /**
   * VACUUM実行（データベース最適化）
   */
  public async vacuum(): Promise<void> {
    await this.ensureInitialized();

    if (!this.operations) {
      throw this.createDatabaseError(
        "Database operations not initialized",
        null,
        "CRITICAL",
      );
    }

    return this.operations.vacuum();
  }

  /**
   * 初期化状態確認
   */
  public isReady(): boolean {
    return this.connection.isReady() && this.operations !== null;
  }

  /**
   * 接続状態確認 (後方互換性)
   * @deprecated isReady() を使用してください
   */
  public isConnected(): boolean {
    return this.isReady();
  }

  /**
   * データベース設定取得
   */
  public getConfig(): DatabaseConfig {
    return getDatabaseConfig();
  }

  /**
   * 初期化を確実に実行
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isReady()) {
      await this.initialize();
    }
  }

  /**
   * データベースエラー作成
   */
  private createDatabaseError(
    message: string,
    originalError: any,
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    context?: Record<string, any>,
  ): DatabaseError {
    const error = new Error(message) as DatabaseError;
    error.name = "DatabaseError";
    error.code = "DB_ERROR";
    error.severity = severity;
    error.recoverable = severity !== "CRITICAL";
    error.context = context || {};

    if (originalError) {
      error.cause = originalError;
      if (originalError.stack) {
        error.stack = originalError.stack;
      }
    }

    return error;
  }
}

/**
 * データベースサービスのシングルトンインスタンス
 */
export const databaseService = DatabaseService.getInstance();
