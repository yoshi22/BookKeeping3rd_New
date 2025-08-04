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
  private async createMigrationTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        checksum TEXT
      );
    `;

    try {
      console.log("[MigrationManager] マイグレーションテーブル作成開始");

      // データベース接続状態確認
      if (!databaseService.isConnected()) {
        throw new Error("Database not connected");
      }

      await databaseService.executeSql(sql);
      console.log("[MigrationManager] マイグレーションテーブル作成完了");
    } catch (error) {
      console.error(
        "[MigrationManager] マイグレーションテーブル作成エラー:",
        error,
      );
      console.error(
        "[MigrationManager] Error details:",
        error instanceof Error ? error.stack : error,
      );
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
  private async executeMigration(migration: MigrationInfo): Promise<void> {
    console.log(
      `[MigrationManager] マイグレーション実行開始: v${migration.version} - ${migration.name}`,
    );

    try {
      // トランザクション内でマイグレーション実行
      await databaseService.executeTransaction(async (tx) => {
        // 各SQLステートメントを実行
        for (const sql of migration.sql) {
          await databaseService.executeSql(sql, []);
        }

        // マイグレーション記録を保存
        await databaseService.executeSql(
          "INSERT INTO migrations (version, name, description, checksum) VALUES (?, ?, ?, ?)",
          [
            migration.version,
            migration.name,
            migration.description,
            this.calculateChecksum(migration.sql.join("")),
          ],
        );
      });

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
