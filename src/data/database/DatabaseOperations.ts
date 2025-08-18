/**
 * データベース操作実行クラス
 * database.ts分割 - Phase 4
 */

import {
  DatabaseResult,
  QueryResult,
  DatabaseError,
} from "../../types/database";
import { logger } from "../../utils/logger";
import { DATABASE_CONFIG } from "./DatabaseConfig";
import { WebDatabaseMock } from "./WebDatabaseMock";

export class DatabaseOperations {
  constructor(private connection: any) {}

  /**
   * SQLクエリ実行（同期版）
   */
  public async executeSql<T = any>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<T>> {
    if (!this.connection) {
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
        if (this.connection instanceof WebDatabaseMock) {
          // Mock実装の場合
          const result = this.connection.runSync(sql, params);
          return {
            rows: result.rows as T[],
            rowsAffected: 0,
            insertId: undefined,
          };
        } else {
          // SQLite実装の場合
          const statement = this.connection.prepareSync(sql);
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
        }
      } else {
        // INSERT, UPDATE, DELETE, CREATE TABLEなどの場合
        const result = this.connection.runSync(sql, params);
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
    if (!this.connection) {
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

      if (this.connection instanceof WebDatabaseMock) {
        // Mock実装の場合は直接実行
        await operations(this.connection);
      } else {
        // SQLite実装の場合はトランザクション処理
        await this.connection.withTransactionAsync(async () => {
          await operations(this.connection!);
        });
      }

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
      logger.error("トランザクションエラー:", dbError as Error, {
        component: "DatabaseOperations",
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
      logger.error("整合性チェックエラー:", error as Error);
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

      // 各テーブルの統計を取得
      for (const table of tables) {
        try {
          const countResult = await this.executeSql(
            `SELECT COUNT(*) as count FROM ${table}`,
          );
          stats.tables[table] = {
            count: countResult.rows[0]?.count || 0,
          };
          logger.debug("テーブル統計取得: ${table}", {
            count: stats.tables[table].count,
          });
        } catch (error) {
          logger.warn("テーブル統計取得失敗: ${table}", {
            error: error instanceof Error ? error.message : String(error),
          });
          stats.tables[table] = {
            count: 0,
            error: "統計取得失敗",
          };
        }
      }

      // データベースサイズ取得を試行
      try {
        const sizeResult = await this.executeSql("PRAGMA page_count");
        const pageSizeResult = await this.executeSql("PRAGMA page_size");
        if (sizeResult.rows[0] && pageSizeResult.rows[0]) {
          stats.totalSize =
            sizeResult.rows[0].page_count * pageSizeResult.rows[0].page_size;
        }
      } catch (error) {
        logger.debug("データベースサイズ取得失敗", {
          error: error instanceof Error ? error.message : String(error),
        });
        stats.totalSize = 0;
      }

      logger.database("データベース統計取得完了", {
        tableCount: Object.keys(stats.tables).length,
        totalSize: stats.totalSize,
        integrityCheck: stats.integrityCheck,
      });

      return stats;
    } catch (error) {
      logger.error("統計情報取得エラー:", error as Error);
      throw this.createDatabaseError(
        "Failed to get database statistics",
        error,
        "MEDIUM",
      );
    }
  }

  /**
   * データベースリセット
   */
  public async resetDatabase(): Promise<void> {
    if (!this.connection) {
      throw this.createDatabaseError(
        "Database not initialized",
        null,
        "CRITICAL",
      );
    }

    logger.warn("データベースリセット開始", {
      operation: "reset_database",
      component: "DatabaseOperations",
    });

    try {
      // 主要テーブルを削除
      const tables = [
        "mock_exam_results",
        "mock_exam_questions",
        "review_items",
        "learning_history",
        "user_progress",
        "app_settings",
        "mock_exams",
        "questions",
        "categories",
        "account_items",
      ];

      for (const table of tables) {
        try {
          await this.executeSql(`DROP TABLE IF EXISTS ${table}`);
          logger.debug("テーブル削除: ${table}");
        } catch (error) {
          logger.warn("テーブル削除失敗: ${table}", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      logger.warn("データベースリセット完了", {
        operation: "reset_database_complete",
        component: "DatabaseOperations",
      });
    } catch (error) {
      logger.error("データベースリセットエラー:", error as Error);
      throw this.createDatabaseError(
        "Database reset failed",
        error,
        "CRITICAL",
      );
    }
  }

  /**
   * VACUUM実行（データベース最適化）
   */
  public async vacuum(): Promise<void> {
    try {
      logger.database("VACUUM実行開始", {});
      await this.executeSql("VACUUM");
      logger.database("VACUUM実行完了", {});
    } catch (error) {
      logger.error("VACUUM実行エラー:", error as Error);
      throw this.createDatabaseError(
        "VACUUM execution failed",
        error,
        "MEDIUM",
      );
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
