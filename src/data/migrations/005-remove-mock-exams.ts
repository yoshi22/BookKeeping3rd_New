/**
 * 模試機能削除マイグレーション
 * CBT模試システムのテーブルを削除
 */

import { MigrationInfo } from "../../types/database";

/**
 * 模試機能削除マイグレーション
 * - mock_exam_results テーブル削除
 * - mock_exam_questions テーブル削除
 * - mock_exams テーブル削除
 */
export const migration005: MigrationInfo = {
  version: 5,
  name: "remove-mock-exams",
  description: "CBT模擬試験機能削除（競合分析により不要と判断）",
  timestamp: "2025-10-06T12:00:00Z",
  sql: [
    // 外部キー制約のため、逆順で削除
    `DROP TABLE IF EXISTS mock_exam_results`,
    `DROP TABLE IF EXISTS mock_exam_questions`,
    `DROP TABLE IF EXISTS mock_exams`,
  ],
};
