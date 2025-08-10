/**
 * マイグレーション003: 問題構造拡張
 * problemsStrategy.mdに基づく詳細分類・順序制御機能を追加
 */
import { MigrationInfo } from "../../types/database";

export const migration003: MigrationInfo = {
  version: 3,
  name: "add-question-structure",
  description: "問題構造拡張 - サブカテゴリ・順序制御・パターン分類追加",
  timestamp: "2025-08-10T12:00:00Z",

  sql: [
    // problemsStrategy.mdに基づく詳細分類・順序制御・パターン分類列を追加
    // エラーハンドリングで重複カラムエラーは無視される

    // サブカテゴリ列（現金・預金取引、商品売買取引など）
    `ALTER TABLE questions ADD COLUMN subcategory TEXT`,

    // セクション番号列（第一問=1, 第二問=2, 第三問=3）
    `ALTER TABLE questions ADD COLUMN section_number INTEGER`,

    // 問題順序列（セクション内での順序）
    `ALTER TABLE questions ADD COLUMN question_order INTEGER`,

    // パターン種別列（現金過不足、仕訳パターンなど）
    `ALTER TABLE questions ADD COLUMN pattern_type TEXT`,

    // インデックス作成
    `CREATE INDEX IF NOT EXISTS idx_questions_subcategory ON questions (subcategory)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_section_order ON questions (section_number, question_order)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_pattern ON questions (pattern_type)`,
  ],

  rollbackSql: [
    `DROP INDEX IF EXISTS idx_questions_pattern`,
    `DROP INDEX IF EXISTS idx_questions_section_order`,
    `DROP INDEX IF EXISTS idx_questions_subcategory`,

    // SQLiteではALTER TABLE DROP COLUMNがサポートされていないため
    // テーブル再作成が必要（ロールバック時）
    `CREATE TABLE questions_backup AS SELECT 
      id, category_id, question_text, answer_template_json, 
      correct_answer_json, explanation, difficulty, tags_json,
      created_at, updated_at 
      FROM questions`,

    `DROP TABLE questions`,

    `CREATE TABLE questions (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      answer_template_json TEXT NOT NULL,
      correct_answer_json TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty INTEGER NOT NULL DEFAULT 1,
      tags_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (category_id) REFERENCES categories (id),
      CHECK (difficulty BETWEEN 1 AND 5),
      CHECK (json_valid(answer_template_json)),
      CHECK (json_valid(correct_answer_json)),
      CHECK (tags_json IS NULL OR json_valid(tags_json))
    )`,

    `INSERT INTO questions SELECT * FROM questions_backup`,
    `DROP TABLE questions_backup`,

    // 元のインデックス再作成
    `CREATE INDEX IF NOT EXISTS idx_questions_category ON questions (category_id)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty)`,
  ],
};
