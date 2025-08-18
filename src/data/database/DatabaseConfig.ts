/**
 * データベース設定と定数
 * database.ts分割 - Phase 4
 */

import { DatabaseConfig } from "../../types/database";

/**
 * データベース設定
 */
export const DATABASE_CONFIG: DatabaseConfig = {
  name: "bookkeeping.db",
  version: "1.0.0",
  displayName: "簿記3級問題集データベース",
  size: 50 * 1024 * 1024, // 50MB
  location: "default",
};

/**
 * データベース設定取得
 */
export const getDatabaseConfig = (): DatabaseConfig => {
  return { ...DATABASE_CONFIG };
};
