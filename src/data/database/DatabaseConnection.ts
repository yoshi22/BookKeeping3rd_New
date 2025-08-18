/**
 * データベース接続管理
 * database.ts分割 - Phase 4
 */

import { Platform } from "react-native";
import { logger } from "../../utils/logger";
import { DATABASE_CONFIG } from "./DatabaseConfig";
import { WebDatabaseMock } from "./WebDatabaseMock";

// Web環境では expo-sqlite をインポートしない
let SQLite: any = null;
if (Platform.OS !== "web") {
  try {
    SQLite = require("expo-sqlite");
  } catch (error) {
    logger.warn("SQLite import failed:", {
      component: "DatabaseConnection",
      details: error,
    });
  }
}

export class DatabaseConnection {
  private db: any | WebDatabaseMock | null = null;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

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
      logger.warn("初期化が既に進行中です", {
        component: "DatabaseConnection",
      });
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
          component: "DatabaseConnection",
        });
        this.db = new WebDatabaseMock();
      } else {
        // ネイティブ環境ではSQLiteを使用
        if (!SQLite) {
          logger.warn("SQLite モジュールが利用できません - モックを使用", {
            component: "DatabaseConnection",
          });
          this.db = new WebDatabaseMock();
        } else {
          try {
            logger.database("SQLite接続試行", { name: DATABASE_CONFIG.name });
            this.db = SQLite.openDatabaseSync(DATABASE_CONFIG.name);
            logger.info("SQLite接続成功", { component: "DatabaseConnection" });
          } catch (sqliteError) {
            logger.error(
              "SQLite初期化失敗、フォールバックとしてモックを使用",
              sqliteError as Error,
              {
                component: "DatabaseConnection",
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
        component: "DatabaseConnection",
      });

      await this.configurePragmaSettings();

      this.isInitialized = true;
      this.isInitializing = false;

      logger.database("データベース初期化完了", {
        component: "DatabaseConnection",
        isInitialized: this.isInitialized,
      });
    } catch (error) {
      this.isInitializing = false;
      this.initializationPromise = null;
      logger.error("データベース初期化エラー", error as Error, {
        component: "DatabaseConnection",
      });
      throw error;
    }
  }

  /**
   * PRAGMA設定の実行
   */
  private async configurePragmaSettings(): Promise<void> {
    try {
      logger.database("PRAGMA設定開始", {});

      // 外部キー制約を有効化
      logger.database("外部キー制約設定中", {});
      await this.executeDirectSql("PRAGMA foreign_keys = ON");

      // WALモードを有効化（パフォーマンス向上）
      logger.database("WALモード設定中", {});
      await this.executeDirectSql("PRAGMA journal_mode = WAL");

      // 同期モードをFASTに設定（バランス重視）
      logger.database("同期モード設定中", {});
      await this.executeDirectSql("PRAGMA synchronous = FAST");

      // 自動VACUUM設定（容量管理）
      logger.database("自動VACUUM設定中", {});
      await this.executeDirectSql("PRAGMA auto_vacuum = INCREMENTAL");

      logger.database("PRAGMA設定完了", {});
    } catch (error) {
      logger.error("PRAGMA設定エラー", error as Error, {
        component: "DatabaseConnection",
      });
      // PRAGMA設定エラーは致命的ではないため、初期化を継続
    }
  }

  /**
   * 直接SQL実行（初期化時専用）
   */
  private async executeDirectSql(
    sql: string,
    params: any[] = [],
  ): Promise<any> {
    if (!this.db) {
      throw new Error("データベースが初期化されていません");
    }

    try {
      logger.database("SQL実行", { sql: sql.substring(0, 50) + "..." });
      const result = this.db.runSync(sql, params);
      logger.database("SQL実行成功", {
        changes: result?.changes || 0,
        rows: result?.rows?.length || 0,
      });
      return result;
    } catch (error) {
      logger.error("SQL実行エラー", error as Error, {
        component: "DatabaseConnection",
        sql: sql.substring(0, 100),
      });
      throw error;
    }
  }

  /**
   * データベースインスタンス取得
   */
  public getDatabase(): any | WebDatabaseMock | null {
    return this.db;
  }

  /**
   * 初期化状態確認
   */
  public isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * データベース接続クローズ
   */
  public async close(): Promise<void> {
    if (!this.isInitialized || !this.db) {
      logger.warn("データベースは既にクローズされています", {
        component: "DatabaseConnection",
      });
      return;
    }

    try {
      logger.database("データベースクローズ開始", {});

      // SQLiteの場合のみクローズ処理
      if (this.db && typeof this.db.closeSync === "function") {
        this.db.closeSync();
        logger.info("SQLiteデータベース正常クローズ", {
          component: "DatabaseConnection",
        });
      }

      this.db = null;
      this.isInitialized = false;
      this.initializationPromise = null;

      logger.database("データベースクローズ完了", {});
    } catch (error) {
      logger.error("データベースクローズエラー", error as Error, {
        component: "DatabaseConnection",
      });
      // クローズエラーの場合でも状態をリセット
      this.db = null;
      this.isInitialized = false;
      this.initializationPromise = null;
      throw error;
    }
  }
}
