/**
 * データベース接続・管理サービス - 分割リファクタリング版
 * 簿記3級問題集アプリ - SQLite基盤実装
 *
 * database.ts分割 - Phase 4 完了
 * 754行 → 分割構成:
 * - DatabaseConfig.ts: 設定管理
 * - WebDatabaseMock.ts: Web環境用モック
 * - DatabaseConnection.ts: 接続管理・初期化
 * - DatabaseOperations.ts: SQL実行・トランザクション
 * - DatabaseService.ts: メインサービスオーケストレーター
 */

// 分割されたモジュールから必要な機能を再エクスポート
export {
  DATABASE_CONFIG,
  getDatabaseConfig,
  WebDatabaseMock,
  DatabaseConnection,
  DatabaseOperations,
  DatabaseService,
  databaseService,
} from "./database/index";

// 型定義の再エクスポート
export type {
  Database,
  DatabaseConfig,
  DatabaseError,
  DatabaseResult,
  QueryResult,
} from "../types/database";
