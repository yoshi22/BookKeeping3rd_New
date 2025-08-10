/**
 * マイグレーション管理システム
 * 簿記3級問題集アプリ - データベーススキーマ管理
 */

import { databaseService } from "../database";
import { MigrationInfo } from "../../types/database";

/**
 * マイグレーション管理クラス
 */
export class MigrationManager {
  private static instance: MigrationManager;
  private migrations: MigrationInfo[] = [];

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  /**
   * 初期化
   */
  public async initialize(): Promise<void> {
    console.log("[MigrationManager] 初期化開始");
    try {
      await this.createMigrationTable();
      await this.loadMigrations();
      console.log("[MigrationManager] 初期化完了");
    } catch (error) {
      console.error("[MigrationManager] 初期化エラー:", error);
      throw error;
    }
  }

  /**
   * マイグレーションテーブル作成
   */
  /**
   * マイグレーションテーブル作成
   */
  private async createMigrationTable(): Promise<void> {
    console.log("[MigrationManager] マイグレーションテーブル作成開始");

    try {
      // シンプルなトランザクション無しでテーブル作成を試行
      const sql = `CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        checksum TEXT
      )`;

      console.log("[MigrationManager] SQL実行:", sql);
      await databaseService.executeSql(sql);
      console.log("[MigrationManager] マイグレーションテーブル作成完了");

      // テーブル作成後、存在確認（オプション）
      try {
        const testResult = await databaseService.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'",
        );

        if (testResult.rows.length === 0) {
          throw new Error("Migration table was not created successfully");
        }

        console.log("[MigrationManager] マイグレーションテーブル存在確認完了");
      } catch (verifyError) {
        console.error(
          "[MigrationManager] テーブル存在確認エラー:",
          verifyError,
        );
        throw verifyError;
      }
    } catch (error) {
      console.error(
        "[MigrationManager] マイグレーションテーブル作成エラー:",
        error,
      );
      console.error("[MigrationManager] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // データベースが破損している可能性がある場合の処理
      if (
        error instanceof Error &&
        (error.message.includes("database is locked") ||
          error.message.includes("Transaction execution failed") ||
          error.message.includes("database disk image is malformed"))
      ) {
        console.warn(
          "[MigrationManager] データベース破損の可能性 - リセットが必要",
        );
        throw new Error(`Database corruption detected: ${error.message}`);
      }

      throw error;
    }
  }

  /**
   * マイグレーション定義の登録
   */
  public registerMigration(migration: MigrationInfo): void {
    this.migrations.push(migration);
    // バージョン順でソート
    this.migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * 全マイグレーション実行
   */
  public async runMigrations(): Promise<void> {
    console.log("[MigrationManager] マイグレーション実行開始");

    // 実行済みマイグレーションを確認
    const executedVersions = await this.getExecutedMigrations();
    console.log(
      "[MigrationManager] 実行済みマイグレーション:",
      executedVersions,
    );

    // 未実行のマイグレーションを抽出
    const pendingMigrations = this.migrations.filter(
      (migration) => !executedVersions.includes(migration.version),
    );

    if (pendingMigrations.length === 0) {
      console.log("[MigrationManager] 実行すべきマイグレーションがありません");
      return;
    }

    console.log(
      `[MigrationManager] ${pendingMigrations.length}個のマイグレーションを実行します`,
    );

    // 各マイグレーションを順次実行
    for (const migration of pendingMigrations) {
      await this.executeMigration(migration);
    }

    console.log("[MigrationManager] 全マイグレーション実行完了");
  }

  /**
   * 個別マイグレーション実行
   */
  /**
   * 個別マイグレーション実行
   */
  private async executeMigration(migration: MigrationInfo): Promise<void> {
    console.log(
      `[MigrationManager] マイグレーション実行開始: v${migration.version} - ${migration.name}`,
    );

    // 既に実行済みかチェック（重複実行防止）
    try {
      const executed = await databaseService.executeSql(
        "SELECT version FROM migrations WHERE version = ?",
        [migration.version],
      );
      if (executed.rows.length > 0) {
        console.log(
          `[MigrationManager] マイグレーション v${migration.version} は既に実行済みです。スキップします。`,
        );
        return;
      }
    } catch (checkError) {
      console.log(
        `[MigrationManager] マイグレーション実行状態チェック時のエラー（継続）:`,
        checkError,
      );
    }

    try {
      // SQLステートメントを小さなチャンクに分割して実行
      const CHUNK_SIZE = 3; // 一度に実行するSQL文の数をさらに制限
      const sqlChunks: string[][] = [];

      for (let i = 0; i < migration.sql.length; i += CHUNK_SIZE) {
        sqlChunks.push(migration.sql.slice(i, i + CHUNK_SIZE));
      }

      console.log(
        `[MigrationManager] ${migration.sql.length}のSQL文を${sqlChunks.length}個のチャンクで実行`,
      );

      // 各チャンクを個別に実行（トランザクション無し）
      for (let chunkIndex = 0; chunkIndex < sqlChunks.length; chunkIndex++) {
        const chunk = sqlChunks[chunkIndex];

        try {
          for (const sql of chunk) {
            console.log(
              `[MigrationManager] SQL実行 (チャンク ${chunkIndex + 1}/${sqlChunks.length}): ${sql.substring(0, 50)}...`,
            );
            await databaseService.executeSql(sql, []);
          }

          console.log(
            `[MigrationManager] チャンク ${chunkIndex + 1}/${sqlChunks.length} 完了`,
          );
        } catch (chunkError) {
          // IF NOT EXISTSやOR REPLACEがあるので、既存エラーは無視
          const errorMessage =
            chunkError instanceof Error
              ? chunkError.message
              : String(chunkError);
          if (
            errorMessage.includes("already exists") ||
            errorMessage.includes("UNIQUE constraint failed") ||
            errorMessage.includes("duplicate column name") ||
            errorMessage.includes("column already exists")
          ) {
            console.log(
              `[MigrationManager] チャンク ${chunkIndex + 1} 既存オブジェクト検出（継続）`,
            );
          } else {
            console.error(
              `[MigrationManager] チャンク ${chunkIndex + 1} エラー:`,
              chunkError,
            );
            throw chunkError;
          }
        }
      }

      // マイグレーション記録を保存（単独実行）
      try {
        await databaseService.executeSql(
          "INSERT OR REPLACE INTO migrations (version, name, description, checksum) VALUES (?, ?, ?, ?)",
          [
            migration.version,
            migration.name,
            migration.description,
            this.calculateChecksum(migration.sql.join("")),
          ],
        );

        console.log(`[MigrationManager] マイグレーション記録保存完了`);
      } catch (recordError) {
        console.warn(
          `[MigrationManager] マイグレーション記録保存失敗（SQLは実行済み）:`,
          recordError,
        );
        // 記録保存の失敗は致命的でない - SQLは既に実行済み
      }

      console.log(
        `[MigrationManager] マイグレーション完了: v${migration.version} - ${migration.name}`,
      );
    } catch (error) {
      console.error(
        `[MigrationManager] マイグレーションエラー: v${migration.version} - ${migration.name}`,
        error,
      );
      throw new Error(`Migration failed: ${migration.name} - ${error}`);
    }
  }

  /**
   * 実行済みマイグレーション取得
   */
  private async getExecutedMigrations(): Promise<number[]> {
    try {
      const result = await databaseService.executeSql(
        "SELECT version FROM migrations ORDER BY version",
      );
      return result.rows.map((row) => row.version);
    } catch (error) {
      console.error(
        "[MigrationManager] 実行済みマイグレーション取得エラー:",
        error,
      );
      return [];
    }
  }

  /**
   * マイグレーション定義の読み込み
   */
  private async loadMigrations(): Promise<void> {
    // マイグレーション定義をここで登録
    // 実際の使用時は、マイグレーションファイルから動的に読み込む
    console.log("[MigrationManager] マイグレーション定義読み込み完了");
  }

  /**
   * チェックサム計算（簡易版）
   */
  private calculateChecksum(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32bitに変換
    }
    return hash.toString(16);
  }

  /**
   * マイグレーション状態取得
   */
  public async getStatus(): Promise<{
    totalMigrations: number;
    executedMigrations: number;
    pendingMigrations: number;
    lastExecuted?: number;
  }> {
    const executedVersions = await this.getExecutedMigrations();

    return {
      totalMigrations: this.migrations.length,
      executedMigrations: executedVersions.length,
      pendingMigrations: this.migrations.length - executedVersions.length,
      lastExecuted:
        executedVersions.length > 0 ? Math.max(...executedVersions) : undefined,
    };
  }

  /**
   * ロールバック実行（注意：データ損失の可能性）
   */
  public async rollback(targetVersion: number): Promise<void> {
    console.warn(
      `[MigrationManager] ロールバック実行: バージョン ${targetVersion} まで`,
    );

    const executedVersions = await this.getExecutedMigrations();
    const rollbackVersions = executedVersions
      .filter((v) => v > targetVersion)
      .sort((a, b) => b - a);

    if (rollbackVersions.length === 0) {
      console.log("[MigrationManager] ロールバック対象がありません");
      return;
    }

    for (const version of rollbackVersions) {
      const migration = this.migrations.find((m) => m.version === version);
      if (migration && migration.rollbackSql) {
        await this.executeRollback(migration);
      } else {
        console.warn(
          `[MigrationManager] バージョン ${version} のロールバックSQLが見つかりません`,
        );
      }
    }
  }

  /**
   * ロールバック実行
   */
  private async executeRollback(migration: MigrationInfo): Promise<void> {
    if (!migration.rollbackSql) {
      throw new Error(
        `Rollback SQL not available for migration: ${migration.name}`,
      );
    }

    console.log(
      `[MigrationManager] ロールバック実行: v${migration.version} - ${migration.name}`,
    );

    try {
      await databaseService.executeTransaction(async (tx) => {
        // ロールバックSQL実行
        for (const sql of migration.rollbackSql!) {
          await databaseService.executeSql(sql, []);
        }

        // マイグレーション記録を削除
        await databaseService.executeSql(
          "DELETE FROM migrations WHERE version = ?",
          [migration.version],
        );
      });

      console.log(
        `[MigrationManager] ロールバック完了: v${migration.version} - ${migration.name}`,
      );
    } catch (error) {
      console.error(
        `[MigrationManager] ロールバックエラー: v${migration.version} - ${migration.name}`,
        error,
      );
      throw error;
    }
  }
}

/**
 * マイグレーション管理のシングルトンインスタンス
 */
export const migrationManager = MigrationManager.getInstance();
