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

// Web環境では expo-sqlite をインポートしない
let SQLite: any = null;
if (Platform.OS !== "web") {
  try {
    SQLite = require("expo-sqlite");
  } catch (error) {
    console.warn("[DatabaseService] SQLite import failed:", error);
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
    console.log(`[WebDB] Mock SQL実行: ${sql}`, params);

    // 基本的なSQL操作をシミュレート
    const rows: any[] = [];
    let changes = 0;
    let lastInsertRowId: number | undefined = undefined;

    if (sql.includes("PRAGMA")) {
      rows.push({ pragma: "ok" });
    } else if (sql.includes("CREATE TABLE") || sql.includes("CREATE INDEX")) {
      // テーブル作成・インデックス作成は成功をシミュレート
      changes = 0;
    } else if (sql.includes("SELECT")) {
      const tableName = this.extractTableName(sql);
      const data = this.tables.get(tableName) || [];
      rows.push(...data);
    } else if (sql.includes("INSERT")) {
      const tableName = this.extractTableName(sql);
      const data = this.tables.get(tableName) || [];
      const newId = data.length + 1;
      data.push({ id: newId, ...this.parseInsertParams(params) });
      this.tables.set(tableName, data);
      changes = 1;
      lastInsertRowId = newId;
    } else if (sql.includes("UPDATE") || sql.includes("DELETE")) {
      changes = 1;
    }

    const result = {
      getAllSync: () => {
        console.log(`[WebDB] getAllSync returning ${rows.length} rows:`, rows);
        return rows;
      },
      changes,
      lastInsertRowId,
    };

    console.log(
      `[WebDB] SQL実行結果: changes=${changes}, lastInsertRowId=${lastInsertRowId}, rows=${rows.length}`,
    );
    return result;
  }

  async withTransactionAsync(operations: Function): Promise<void> {
    console.log("[WebDB] Mock トランザクション実行");
    try {
      await operations(this);
      console.log("[WebDB] Mock トランザクション成功");
    } catch (error) {
      console.error("[WebDB] Mock トランザクションエラー:", error);
      throw error;
    }
  }

  closeSync(): void {
    console.log("[WebDB] Mock データベースクローズ");
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
    try {
      console.log(
        `[DatabaseService] データベース接続開始: ${DATABASE_CONFIG.name}`,
      );
      console.log(`[DatabaseService] Platform.OS: ${Platform.OS}`);

      // Web環境の場合はモック実装を使用
      if (Platform.OS === "web") {
        console.log("[DatabaseService] Web環境検出 - モック実装を使用");
        this.db = new WebDatabaseMock();
      } else {
        // ネイティブ環境ではSQLiteを使用
        if (!SQLite) {
          console.warn(
            "[DatabaseService] SQLite モジュールが利用できません - モックを使用",
          );
          this.db = new WebDatabaseMock();
        } else {
          try {
            this.db = SQLite.openDatabaseSync(DATABASE_CONFIG.name);
            console.log("[DatabaseService] SQLite接続成功");
          } catch (sqliteError) {
            console.warn(
              "[DatabaseService] SQLite初期化失敗、フォールバックを使用:",
              sqliteError,
            );
            this.db = new WebDatabaseMock();
          }
        }
      }

      // 外部キー制約を有効化
      await this.executeSql("PRAGMA foreign_keys = ON");

      // WALモードを有効化（パフォーマンス向上）
      await this.executeSql("PRAGMA journal_mode = WAL");

      // 同期モード設定（データ整合性とパフォーマンスのバランス）
      await this.executeSql("PRAGMA synchronous = NORMAL");

      // バキュームの自動実行設定
      await this.executeSql("PRAGMA auto_vacuum = INCREMENTAL");

      console.log("[DatabaseService] データベース接続完了");

      this.isInitialized = true;
    } catch (error) {
      const dbError = this.createDatabaseError(
        "Database initialization failed",
        error,
        "CRITICAL",
        { config: DATABASE_CONFIG, platform: Platform.OS },
      );
      console.error("[DatabaseService] 初期化エラー:", dbError);
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
      console.log(`[DatabaseService] SQL実行: ${sql}`, params);

      const result = this.db.runSync(sql, params);

      return {
        rows: result.getAllSync() as T[],
        rowsAffected: result.changes || 0,
        insertId: result.lastInsertRowId,
      };
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
      console.log("[DatabaseService] トランザクション開始");

      await this.db.withTransactionAsync(async () => {
        await operations(this.db!);
      });

      console.log("[DatabaseService] トランザクション成功");
      return { success: true };
    } catch (error) {
      const dbError = this.createDatabaseError(
        "Transaction execution failed",
        error,
        "HIGH",
      );
      console.error("[DatabaseService] トランザクションエラー:", dbError);
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
      console.error("[DatabaseService] 整合性チェックエラー:", error);
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
      console.error("[DatabaseService] 統計情報取得エラー:", error);
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
      console.log("[DatabaseService] データベース接続クローズ");

      try {
        this.db.closeSync();
        this.db = null;
        this.isInitialized = false;
        this.initializationPromise = null;
        console.log("[DatabaseService] データベース接続クローズ完了");
      } catch (error) {
        const dbError = this.createDatabaseError(
          "Failed to close database",
          error,
          "MEDIUM",
        );
        console.error("[DatabaseService] クローズエラー:", dbError);
        throw dbError;
      }
    }
  }

  /**
   * バキューム実行（デフラグ・最適化）
   */
  public async vacuum(): Promise<void> {
    try {
      console.log("[DatabaseService] データベース最適化開始");
      await this.executeSql("VACUUM");
      console.log("[DatabaseService] データベース最適化完了");
    } catch (error) {
      console.error("[DatabaseService] 最適化エラー:", error);
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
