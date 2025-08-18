/**
 * データベース関連モジュールエクスポート
 * database.ts分割 - Phase 4 統合エクスポート
 */

// 設定
export { DATABASE_CONFIG, getDatabaseConfig } from "./DatabaseConfig";

// Web モック実装
export { WebDatabaseMock } from "./WebDatabaseMock";

// 接続管理
export { DatabaseConnection } from "./DatabaseConnection";

// 操作実行
export { DatabaseOperations } from "./DatabaseOperations";

// メインサービス
export { DatabaseService, databaseService } from "./DatabaseService";

// 型定義（再エクスポート）
export type {
  Database,
  DatabaseConfig,
  DatabaseError,
  DatabaseResult,
  QueryResult,
} from "../../types/database";
