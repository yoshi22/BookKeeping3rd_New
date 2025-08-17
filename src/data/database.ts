/**
 * データベース接続・管理サービス
 * 簿記3級問題集アプリ - SQLite基盤実装
 */

import { Platform } from "react-native";
import {
  Database,
  DatabaseConfig,
  DatabaseError,
  DatabaseResult,
  QueryResult,
} from "../types/database";
import { logger } from "../utils/logger";

// Web環境では expo-sqlite をインポートしない
let SQLite: any = null;
if (Platform.OS !== "web") {
  try {
    SQLite = require("expo-sqlite");
  } catch (error) {
    logger.warn("SQLite import failed:", {
      component: "DatabaseService",
      details: error,
    });
  }
}

/**
 * データベース設定
 */
const DATABASE_CONFIG: DatabaseConfig = {
  name: "bookkeeping.db",
  version: "1.0.0",
  displayName: "簿記3級問題集データベース",
  size: 50 * 1024 * 1024, // 50MB
  location: "default",
};

/**
 * Web用データベースモック（localStorage ベース）
 */
class WebDatabaseMock {
  private tables: Map<string, any[]> = new Map();

  runSync(sql: string, params: any[] = []): any {
    logger.debug("Mock SQL実行: ${sql}", {
      component: "WebDatabaseMock",
      params,
    });

    try {
      // 基本的なSQL操作をシミュレート
      const rows: any[] = [];
      let changes = 0;
      let lastInsertRowId: number | undefined = undefined;

      if (sql.includes("PRAGMA")) {
        // PRAGMA文は常に成功を返す
        if (sql.includes("foreign_keys")) {
          rows.push({ foreign_keys: 1 });
        } else if (sql.includes("journal_mode")) {
          rows.push({ journal_mode: "WAL" });
        } else if (sql.includes("synchronous")) {
          rows.push({ synchronous: 1 });
        } else if (sql.includes("auto_vacuum")) {
          rows.push({ auto_vacuum: 2 });
        } else if (sql.includes("integrity_check")) {
          rows.push({ integrity_check: "ok" });
        } else {
          rows.push({ pragma: "ok" });
        }
      } else if (sql.includes("CREATE TABLE") || sql.includes("CREATE INDEX")) {
        // テーブル作成・インデックス作成は成功をシミュレート
        changes = 0;
        logger.debug("テーブル/インデックス作成をシミュレート", {
          component: "WebDatabaseMock",
          sql: sql.substring(0, 50) + "...",
        });
      } else if (sql.includes("SELECT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];

        // COUNT(*) クエリの特別処理
        if (sql.includes("COUNT(*)")) {
          rows.push({ count: data.length });
        } else {
          rows.push(...data.slice(0, 100)); // 最大100件まで返す
        }
        logger.debug("SELECT from ${tableName}: ${rows.length}件", {
          component: "WebDatabaseMock",
        });
      } else if (sql.includes("INSERT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];
        const newId = data.length + 1;
        data.push({ id: newId, ...this.parseInsertParams(params) });
        this.tables.set(tableName, data);
        changes = 1;
        lastInsertRowId = newId;
        logger.debug("INSERT into ${tableName}: ID=${newId}", {
          component: "WebDatabaseMock",
        });
      } else if (sql.includes("UPDATE") || sql.includes("DELETE")) {
        const tableName = this.extractTableName(sql);
        changes = 1;
        logger.debug("UPDATE/DELETE from テーブル", {
          component: "WebDatabaseMock",
          tableName,
          affected: changes,
        });
      }

      const result = {
        getAllSync: () => {
          logger.debug("getAllSync returning ${rows.length} rows", {
            component: "WebDatabaseMock",
          });
          return rows;
        },
        changes,
        lastInsertRowId,
      };

      logger.debug("SQL実行結果", {
        component: "WebDatabaseMock",
        changes,
        lastInsertRowId,
        rowCount: rows.length,
      });
      return result;
    } catch (error) {
      logger.error("Mock SQL実行エラー: ${sql}", null, {
        component: "WebDatabaseMock",
        error,
      });
      // エラーでも最低限の結果を返してアプリが動作するようにする
      return {
        getAllSync: () => [],
        changes: 0,
        lastInsertRowId: undefined,
      };
    }
  }

  prepareSync(sql: string): any {
    logger.debug("Mock prepareSync: ${sql}", { component: "WebDatabaseMock" });
    return {
      executeSync: (params: any[] = []) => {
        logger.debug("Mock executeSync with params:", {
          component: "WebDatabaseMock",
          params,
        });
        // runSyncと同じロジックを使用
        const result = this.runSync(sql, params);
        return {
          getAllSync: () => result.getAllSync(),
        };
      },
      finalizeSync: () => {
        logger.debug("Mock finalizeSync", { component: "WebDatabaseMock" });
      },
    };
  }

  async withTransactionAsync(operations: Function): Promise<void> {
    logger.debug("Mock トランザクション実行", { component: "WebDatabaseMock" });
    try {
      await operations(this);
      logger.debug("Mock トランザクション成功", {
        component: "WebDatabaseMock",
      });
    } catch (error) {
      logger.error("Mock トランザクションエラー:", error, {
        component: "WebDatabaseMock",
      });
      throw error;
    }
  }

  closeSync(): void {
    logger.debug("Mock データベースクローズ", { component: "WebDatabaseMock" });
    this.tables.clear();
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
    return match ? match[1] : "unknown";
  }

  private parseInsertParams(params: any[]): Record<string, any> {
    const result: Record<string, any> = {};
    params.forEach((param, index) => {
      result[`col_${index}`] = param;
    });
    return result;
  }
}

/**
 * データベース管理クラス
 * SQLite接続、トランザクション管理、エラーハンドリングを提供
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private db: any | WebDatabaseMock | null = null;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

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
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  /**
   * 初期化実行
   */
  private async performInitialization(): Promise<void> {
    if (this.isInitializing) {
      logger.warn("初期化が既に進行中です", { component: "DatabaseService" });
      return;
    }

    this.isInitializing = true;

    logger.database("データベース接続開始", {
      name: DATABASE_CONFIG.name,
      platform: Platform.OS,
      sqliteAvailable: !!SQLite,
    });

    try {
      // Web環境の場合はモック実装を使用
      if (Platform.OS === "web") {
        logger.info("Web環境検出 - モック実装を使用", {
          component: "DatabaseService",
        });
        this.db = new WebDatabaseMock();
      } else {
        // ネイティブ環境ではSQLiteを使用
        if (!SQLite) {
          logger.warn("SQLite モジュールが利用できません - モックを使用", {
            component: "DatabaseService",
          });
          this.db = new WebDatabaseMock();
        } else {
          try {
            logger.database("SQLite接続試行", { name: DATABASE_CONFIG.name });
            this.db = SQLite.openDatabaseSync(DATABASE_CONFIG.name);
            logger.info("SQLite接続成功", { component: "DatabaseService" });
          } catch (sqliteError) {
            logger.error(
              "SQLite初期化失敗、フォールバックとしてモックを使用",
              sqliteError,
              {
                component: "DatabaseService",
                errorType:
                  sqliteError instanceof Error
                    ? sqliteError.constructor.name
                    : typeof sqliteError,
              },
            );
            this.db = new WebDatabaseMock();
          }
        }
      }

      logger.info("データベースインスタンス作成完了", {
        component: "DatabaseService",
      });

      // 基本的なPRAGMA設定を実行（初期化中は循環参照を避けるため直接実行）
      try {
        logger.database("PRAGMA設定開始", {});

        // 外部キー制約を有効化
        logger.database("外部キー制約設定中", {});
        await this.executeDirectSql("PRAGMA foreign_keys = ON");

        // WALモードは環境によっては失敗する可能性があるため、オプション扱い
        if (Platform.OS !== "web" && SQLite) {
          try {
            logger.database("WALモード設定中", { operation: "wal_mode" });
            await this.executeDirectSql("PRAGMA journal_mode = WAL");

            logger.database("同期モード設定中", { operation: "synchronous" });
            await this.executeDirectSql("PRAGMA synchronous = NORMAL");

            logger.database("オートバキューム設定中", {
              operation: "auto_vacuum",
            });
            await this.executeDirectSql("PRAGMA auto_vacuum = INCREMENTAL");
          } catch (walError) {
            logger.warn("WALモード設定をスキップ", {
              component: "DatabaseService",
              error: walError instanceof Error ? walError.message : walError,
            });
            // WALモード設定の失敗は致命的ではない
          }
        }

        logger.database("PRAGMA設定完了", { operation: "pragma_complete" });
      } catch (pragmaError) {
        logger.warn("PRAGMA設定で一部エラー", {
          component: "DatabaseService",
          error:
            pragmaError instanceof Error ? pragmaError.message : pragmaError,
        });
        // PRAGMA設定のエラーは初期化を阻止しない
      }

      logger.info("データベース接続完了", { component: "DatabaseService" });
      this.isInitialized = true;
      this.isInitializing = false;
    } catch (error) {
      this.isInitializing = false;
      logger.error("初期化中の予期しないエラー", error, {
        component: "DatabaseService",
      });
      logger.error("初期化エラー詳細", null, {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        platform: Platform.OS,
        sqliteAvailable: !!SQLite,
      });

      const dbError = this.createDatabaseError(
        "Database initialization failed",
        error,
        "CRITICAL",
        {
          config: DATABASE_CONFIG,
          platform: Platform.OS,
          sqliteAvailable: !!SQLite,
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
        },
      );
      logger.error("最終初期化エラー:", dbError, {
        component: "DatabaseService",
      });
      throw dbError;
    }
  }

  /**
   * 直接SQL実行（初期化中用、循環参照を避ける）
   */
  private async executeDirectSql(
    sql: string,
    params: any[] = [],
  ): Promise<any> {
    if (!this.db) {
      throw new Error("Database not available for direct SQL execution");
    }

    try {
      logger.database("SQL実行", {
        sql: sql.substring(0, 100),
        params: params.length,
      });

      // SQLのタイプを判定してそれに応じた処理を行う
      const sqlLower = sql.trim().toLowerCase();

      if (sqlLower.startsWith("select") || sqlLower.startsWith("pragma")) {
        // SELECTやPRAGMAクエリの場合
        const statement = this.db.prepareSync(sql);
        try {
          const result = statement.executeSync(params);
          const rows = result.getAllSync();
          return {
            rows,
            rowsAffected: 0,
            insertId: undefined,
          };
        } finally {
          statement.finalizeSync();
        }
      } else {
        // INSERT, UPDATE, DELETE, CREATE TABLEなどの場合
        const result = this.db.runSync(sql, params);
        return {
          rows: [],
          rowsAffected: result.changes || 0,
          insertId: result.lastInsertRowId,
        };
      }
    } catch (error) {
      const dbError = this.createDatabaseError(
        `SQL execution failed: ${sql}`,
        error,
        "HIGH",
        { sql, params },
      );
      throw dbError;
    }
  }

  /**
   * SQLクエリ実行（同期版）
   */
  public async executeSql<T = any>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    // 初期化中の場合は待機
    if (this.isInitializing) {
      if (this.initializationPromise) {
        await this.initializationPromise;
      }
    }

    // 初期化されていない場合は初期化を実行
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }

    if (!this.db) {
      throw this.createDatabaseError(
        "Database not initialized",
        null,
        "CRITICAL",
      );
    }

    try {
      logger.database("SQL実行", {
        sql: sql.substring(0, 100),
        params: params.length,
      });

      // SQLのタイプを判定してそれに応じた処理を行う
      const sqlLower = sql.trim().toLowerCase();

      if (sqlLower.startsWith("select") || sqlLower.startsWith("pragma")) {
        // SELECTやPRAGMAクエリの場合
        const statement = this.db.prepareSync(sql);
        try {
          const result = statement.executeSync(params);
          const rows = result.getAllSync() as T[];
          return {
            rows,
            rowsAffected: 0,
            insertId: undefined,
          };
        } finally {
          statement.finalizeSync();
        }
      } else {
        // INSERT, UPDATE, DELETE, CREATE TABLEなどの場合
        const result = this.db.runSync(sql, params);
        return {
          rows: [] as T[],
          rowsAffected: result.changes || 0,
          insertId: result.lastInsertRowId,
        };
      }
    } catch (error) {
      const dbError = this.createDatabaseError(
        `SQL execution failed: ${sql}`,
        error,
        "HIGH",
        { sql, params },
      );
      throw dbError;
    }
  }

  /**
   * トランザクション実行
   */
  public async executeTransaction(
    operations: (db: any | WebDatabaseMock) => Promise<void>,
  ): Promise<DatabaseResult> {
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }

    if (!this.db) {
      throw this.createDatabaseError(
        "Database not initialized",
        null,
        "CRITICAL",
      );
    }

    try {
      logger.database("トランザクション開始", {
        operation: "transaction_begin",
      });

      await this.db.withTransactionAsync(async () => {
        await operations(this.db!);
      });

      logger.database("トランザクション成功", {
        operation: "transaction_commit",
      });
      return { success: true };
    } catch (error) {
      const dbError = this.createDatabaseError(
        "Transaction execution failed",
        error,
        "HIGH",
      );
      logger.error("トランザクションエラー:", dbError, {
        component: "DatabaseService",
      });
      throw dbError;
    }
  }

  /**
   * データベース整合性チェック
   */
  public async checkIntegrity(): Promise<boolean> {
    try {
      const result = await this.executeSql("PRAGMA integrity_check");
      return result.rows.length > 0 && result.rows[0].integrity_check === "ok";
    } catch (error) {
      logger.error("整合性チェックエラー:", error, {
        component: "DatabaseService",
      });
      return false;
    }
  }

  /**
   * データベース統計情報取得
   */
  public async getStats(): Promise<any> {
    try {
      const tables = [
        "questions",
        "learning_history",
        "review_items",
        "user_progress",
        "categories",
        "account_items",
        "mock_exams",
        "mock_exam_questions",
        "mock_exam_results",
        "app_settings",
      ];

      const stats: any = {
        tables: {},
        totalSize: 0,
        version: DATABASE_CONFIG.version,
        integrityCheck: await this.checkIntegrity(),
      };

      for (const table of tables) {
        try {
          const countResult = await this.executeSql(
            `SELECT COUNT(*) as count FROM ${table}`,
          );
          stats.tables[table] = {
            rowCount: countResult.rows[0]?.count || 0,
            sizeBytes: 0, // SQLiteでは正確なサイズ計算が困難
            lastModified: new Date().toISOString(),
          };
        } catch (error) {
          // テーブルが存在しない場合はスキップ
          stats.tables[table] = {
            rowCount: 0,
            sizeBytes: 0,
            lastModified: new Date().toISOString(),
          };
        }
      }

      return stats;
    } catch (error) {
      logger.error("統計情報取得エラー:", error, {
        component: "DatabaseService",
      });
      throw this.createDatabaseError(
        "Failed to get database stats",
        error,
        "MEDIUM",
      );
    }
  }

  /**
   * データベースクローズ
   */
  public async close(): Promise<void> {
    if (this.db) {
      logger.database("データベース接続クローズ", {});

      try {
        this.db.closeSync();
        this.db = null;
        this.isInitialized = false;
        this.isInitializing = false;
        this.initializationPromise = null;
        logger.database("データベース接続クローズ完了", {});
      } catch (error) {
        const dbError = this.createDatabaseError(
          "Failed to close database",
          error,
          "MEDIUM",
        );
        logger.error("クローズエラー:", dbError, {
          component: "DatabaseService",
        });
        throw dbError;
      }
    }
  }

  /**
   * データベース完全リセット（ファイル削除＋再作成）
   */
  public async resetDatabase(): Promise<void> {
    logger.database("データベース完全リセット開始", {
      operation: "database_reset",
    });

    try {
      // 既存の接続をクローズ
      await this.close();

      // React Native環境でのみファイル削除を実行
      if (Platform.OS !== "web") {
        try {
          // expo-file-systemを動的インポート
          const { documentDirectory, deleteAsync, getInfoAsync } = await import(
            "expo-file-system"
          );

          if (documentDirectory) {
            const dbPath = `${documentDirectory}SQLite/${DATABASE_CONFIG.name}`;
            const walPath = `${dbPath}-wal`;
            const shmPath = `${dbPath}-shm`;

            logger.database("データベースファイル削除試行", { path: dbPath });

            // メインデータベースファイル削除
            const dbInfo = await getInfoAsync(dbPath);
            if (dbInfo.exists) {
              await deleteAsync(dbPath);
              logger.database("メインDBファイル削除完了", {});
            }

            // WALファイル削除
            const walInfo = await getInfoAsync(walPath);
            if (walInfo.exists) {
              await deleteAsync(walPath);
              logger.database("WALファイル削除完了", {});
            }

            // SHMファイル削除
            const shmInfo = await getInfoAsync(shmPath);
            if (shmInfo.exists) {
              await deleteAsync(shmPath);
              logger.database("SHMファイル削除完了", {});
            }

            logger.database("全データベースファイル削除完了", {});
          }
        } catch (fileError) {
          logger.warn("ファイル削除エラー（継続可能）:", {
            component: "DatabaseService",
            error: fileError instanceof Error ? fileError.message : fileError,
          });
          // ファイル削除失敗は致命的でない - 新しい接続で上書きされる
        }
      }

      // インスタンス状態をリセット
      this.db = null;
      this.isInitialized = false;
      this.isInitializing = false;
      this.initializationPromise = null;

      logger.info(
        "データベースリセット完了 - 次回初期化時に新しいDBが作成されます",
        {
          component: "DatabaseService",
        },
      );
    } catch (error) {
      logger.error("データベースリセットエラー:", error, {
        component: "DatabaseService",
      });
      throw this.createDatabaseError("Database reset failed", error, "HIGH", {
        resetAttempt: true,
      });
    }
  }

  /**
   * バキューム実行（デフラグ・最適化）
   */
  public async vacuum(): Promise<void> {
    try {
      logger.database("データベース最適化開始", {});
      await this.executeSql("VACUUM");
      logger.database("データベース最適化完了", {});
    } catch (error) {
      logger.error("最適化エラー:", error, { component: "DatabaseService" });
      throw this.createDatabaseError("Database vacuum failed", error, "MEDIUM");
    }
  }

  /**
   * データベースエラー作成ヘルパー
   */
  private createDatabaseError(
    message: string,
    originalError: any,
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    context: Record<string, any> = {},
  ): DatabaseError {
    const error = new Error(message) as DatabaseError;
    error.code = originalError?.code || "UNKNOWN_DB_ERROR";
    error.severity = severity;
    error.context = {
      ...context,
      timestamp: new Date().toISOString(),
      originalError: originalError?.message || originalError,
    };
    error.recoverable = severity !== "CRITICAL";

    return error;
  }

  /**
   * 接続状態確認
   */
  public isConnected(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * データベース設定取得
   */
  public getConfig(): DatabaseConfig {
    return { ...DATABASE_CONFIG };
  }
}

/**
 * データベースサービスのシングルトンインスタンス
 */
export const databaseService = DatabaseService.getInstance();
