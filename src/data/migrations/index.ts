/**
 * マイグレーション統合ファイル
 * 簿記3級問題集アプリ - データベースマイグレーション管理
 */

import { migrationManager } from './migration-manager';
import { migration001 } from './001-initial-schema';

/**
 * 全マイグレーションの登録と実行
 */
export async function initializeDatabase(): Promise<void> {
  console.log('[Database] データベース初期化開始');

  try {
    // マイグレーション管理システムの初期化
    await migrationManager.initialize();

    // 全マイグレーションの登録
    migrationManager.registerMigration(migration001);

    // マイグレーション実行
    await migrationManager.runMigrations();

    // マイグレーション状態確認
    const status = await migrationManager.getStatus();
    console.log('[Database] マイグレーション状態:', status);

    console.log('[Database] データベース初期化完了');
  } catch (error) {
    console.error('[Database] データベース初期化エラー:', error);
    throw new Error(`Database initialization failed: ${error}`);
  }
}

/**
 * データベースのセットアップ（アプリ起動時に呼び出し）
 */
export async function setupDatabase(): Promise<void> {
  const { databaseService } = await import('../database');
  
  // データベース接続初期化
  await databaseService.initialize();
  
  // マイグレーション実行
  await initializeDatabase();
  
  // データベース整合性チェック
  const isHealthy = await databaseService.checkIntegrity();
  if (!isHealthy) {
    throw new Error('Database integrity check failed');
  }
  
  console.log('[Database] データベースセットアップ完了');
}

/**
 * マイグレーション管理システムのエクスポート
 */
export { migrationManager } from './migration-manager';
export { migration001 } from './001-initial-schema';