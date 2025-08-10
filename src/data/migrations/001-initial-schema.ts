/**
 * 初期スキーマ作成マイグレーション
 * 簿記3級問題集アプリ - 新コンテンツ構成対応
 */

import { MigrationInfo } from "../../types/database";

/**
 * 初期スキーママイグレーション
 * - 全テーブルの作成
 - 初期データの投入
 - インデックスの作成
 */
export const migration001: MigrationInfo = {
  version: 1,
  name: "initial-schema",
  description: "初期データベーススキーマ作成（新コンテンツ構成対応）",
  timestamp: "2025-01-27T10:00:00Z",
  sql: [
    // === カテゴリテーブル作成 ===
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      total_questions INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT 1
    )`,

    // === 問題テーブル作成（CBT形式対応） ===
    `CREATE TABLE IF NOT EXISTS questions (
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

    // === 勘定科目マスタテーブル作成（CBT形式対応） ===
    `CREATE TABLE IF NOT EXISTS account_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      question_types_json TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      CHECK (category IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
      CHECK (json_valid(question_types_json))
    )`,

    // === 学習履歴テーブル作成（CBT形式対応） ===
    `CREATE TABLE IF NOT EXISTS learning_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      answer_time_ms INTEGER NOT NULL,
      session_id TEXT,
      session_type TEXT DEFAULT 'learning',
      validation_errors_json TEXT,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (question_id) REFERENCES questions (id),
      CHECK (json_valid(user_answer_json)),
      CHECK (validation_errors_json IS NULL OR json_valid(validation_errors_json)),
      CHECK (session_type IN ('learning', 'review', 'mock_exam')),
      CHECK (answer_time_ms > 0)
    )`,

    // === 復習アイテムテーブル作成 ===
    `CREATE TABLE IF NOT EXISTS review_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL UNIQUE,
      incorrect_count INTEGER NOT NULL DEFAULT 0,
      consecutive_correct_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'needs_review',
      priority_score INTEGER NOT NULL DEFAULT 0,
      last_answered_at DATETIME,
      last_reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (question_id) REFERENCES questions (id),
      CHECK (status IN ('needs_review', 'priority_review', 'mastered')),
      CHECK (incorrect_count >= 0),
      CHECK (consecutive_correct_count >= 0),
      CHECK (priority_score >= 0)
    )`,

    // === 学習進捗テーブル作成 ===
    `CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id TEXT NOT NULL UNIQUE,
      total_questions INTEGER NOT NULL DEFAULT 0,
      answered_questions INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      accuracy_rate REAL NOT NULL DEFAULT 0.0,
      last_studied_at DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (category_id) REFERENCES categories (id),
      CHECK (answered_questions <= total_questions),
      CHECK (correct_answers <= answered_questions),
      CHECK (accuracy_rate BETWEEN 0.0 AND 1.0)
    )`,

    // === 模試定義テーブル作成 ===
    `CREATE TABLE IF NOT EXISTS mock_exams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      time_limit_minutes INTEGER NOT NULL DEFAULT 60,
      total_score INTEGER NOT NULL DEFAULT 100,
      passing_score INTEGER NOT NULL DEFAULT 70,
      structure_json TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      CHECK (time_limit_minutes > 0),
      CHECK (total_score > 0),
      CHECK (passing_score > 0 AND passing_score <= total_score),
      CHECK (json_valid(structure_json))
    )`,

    // === 模試問題関連テーブル作成 ===
    `CREATE TABLE IF NOT EXISTS mock_exam_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mock_exam_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      section_number INTEGER NOT NULL,
      question_order INTEGER NOT NULL,
      points INTEGER NOT NULL DEFAULT 1,
      
      FOREIGN KEY (mock_exam_id) REFERENCES mock_exams (id),
      FOREIGN KEY (question_id) REFERENCES questions (id),
      CHECK (section_number BETWEEN 1 AND 3),
      CHECK (question_order > 0),
      CHECK (points > 0),
      
      UNIQUE(mock_exam_id, section_number, question_order)
    )`,

    // === 模試結果テーブル作成 ===
    `CREATE TABLE IF NOT EXISTS mock_exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id TEXT NOT NULL,
      total_score INTEGER NOT NULL,
      max_score INTEGER NOT NULL DEFAULT 100,
      is_passed BOOLEAN NOT NULL,
      duration_seconds INTEGER NOT NULL,
      detailed_results_json TEXT NOT NULL,
      taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      CHECK (total_score >= 0),
      CHECK (total_score <= max_score),
      CHECK (duration_seconds > 0),
      CHECK (json_valid(detailed_results_json))
    )`,

    // === アプリ設定テーブル作成 ===
    `CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'string',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      CHECK (type IN ('string', 'number', 'boolean', 'json'))
    )`,

    // === インデックス作成 ===
    // 問題テーブル
    `CREATE INDEX IF NOT EXISTS idx_questions_category ON questions (category_id)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty)`,

    // 学習履歴テーブル
    `CREATE INDEX IF NOT EXISTS idx_history_question ON learning_history (question_id)`,
    `CREATE INDEX IF NOT EXISTS idx_history_date ON learning_history (answered_at)`,
    `CREATE INDEX IF NOT EXISTS idx_history_session ON learning_history (session_id)`,

    // 勘定科目マスタ
    `CREATE INDEX IF NOT EXISTS idx_accounts_category ON account_items (category)`,
    `CREATE INDEX IF NOT EXISTS idx_accounts_sort ON account_items (sort_order)`,

    // 復習アイテム
    `CREATE INDEX IF NOT EXISTS idx_review_status ON review_items (status)`,
    `CREATE INDEX IF NOT EXISTS idx_review_priority ON review_items (priority_score DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_review_last_answered ON review_items (last_answered_at)`,

    // 学習進捗
    `CREATE INDEX IF NOT EXISTS idx_progress_category ON user_progress (category_id)`,

    // 模試結果
    `CREATE INDEX IF NOT EXISTS idx_exam_results_date ON mock_exam_results (taken_at)`,
    `CREATE INDEX IF NOT EXISTS idx_exam_results_score ON mock_exam_results (total_score)`,

    // 模試問題関連
    `CREATE INDEX IF NOT EXISTS idx_mock_questions_exam ON mock_exam_questions (mock_exam_id)`,
    `CREATE INDEX IF NOT EXISTS idx_mock_questions_section ON mock_exam_questions (mock_exam_id, section_number)`,

    // === 初期データ投入 ===
    // カテゴリ初期データ（新コンテンツ構成対応）
    `INSERT OR REPLACE INTO categories (id, name, description, sort_order, total_questions) VALUES
      ('journal', '仕訳', '基本的な仕訳問題（25パターン×10問）', 1, 250),
      ('ledger', '帳簿', '元帳・補助簿に関する問題（4種類×10問）', 2, 40),
      ('trial_balance', '試算表', '試算表作成・修正に関する問題（3パターン×4問）', 3, 12)`,

    // アプリ設定初期データ
    `INSERT OR REPLACE INTO app_settings (key, value, type) VALUES
      ('font_size', '16', 'number'),
      ('high_contrast', 'false', 'boolean'),
      ('sound_enabled', 'true', 'boolean'),
      ('daily_goal', '20', 'number'),
      ('reminder_enabled', 'true', 'boolean'),
      ('app_version', '1.0.0', 'string'),
      ('database_version', '1', 'number')`,

    // 勘定科目マスタ初期データ（簿記3級レベルの基本勘定科目）
    `INSERT OR REPLACE INTO account_items (code, name, category, question_types_json, sort_order) VALUES
      ('111', '現金', 'asset', '["journal", "ledger", "trial_balance"]', 1),
      ('112', '預金', 'asset', '["journal", "ledger", "trial_balance"]', 2),
      ('113', '売掛金', 'asset', '["journal", "ledger", "trial_balance"]', 3),
      ('114', '受取手形', 'asset', '["journal", "ledger", "trial_balance"]', 4),
      ('115', '商品', 'asset', '["journal", "ledger", "trial_balance"]', 5),
      ('116', '繰越商品', 'asset', '["journal", "trial_balance"]', 6),
      ('117', '前払費用', 'asset', '["journal", "trial_balance"]', 7),
      ('118', '建物', 'asset', '["journal", "trial_balance"]', 8),
      ('119', '備品', 'asset', '["journal", "trial_balance"]', 9),
      ('120', '減価償却累計額', 'asset', '["journal", "trial_balance"]', 10),
      
      ('211', '買掛金', 'liability', '["journal", "ledger", "trial_balance"]', 21),
      ('212', '支払手形', 'liability', '["journal", "ledger", "trial_balance"]', 22),
      ('213', '借入金', 'liability', '["journal", "trial_balance"]', 23),
      ('214', '未払金', 'liability', '["journal", "trial_balance"]', 24),
      ('215', '前受金', 'liability', '["journal", "trial_balance"]', 25),
      
      ('311', '資本金', 'equity', '["journal", "trial_balance"]', 31),
      ('312', '繰越利益剰余金', 'equity', '["trial_balance"]', 32),
      
      ('411', '売上', 'revenue', '["journal", "ledger", "trial_balance"]', 41),
      ('412', '受取利息', 'revenue', '["journal", "trial_balance"]', 42),
      ('413', '雑収入', 'revenue', '["journal", "trial_balance"]', 43),
      
      ('511', '仕入', 'expense', '["journal", "ledger", "trial_balance"]', 51),
      ('512', '給料', 'expense', '["journal", "trial_balance"]', 52),
      ('513', '旅費交通費', 'expense', '["journal", "trial_balance"]', 53),
      ('514', '通信費', 'expense', '["journal", "trial_balance"]', 54),
      ('515', '水道光熱費', 'expense', '["journal", "trial_balance"]', 55),
      ('516', '減価償却費', 'expense', '["journal", "trial_balance"]', 56),
      ('517', '支払利息', 'expense', '["journal", "trial_balance"]', 57),
      ('518', '雑費', 'expense', '["journal", "trial_balance"]', 58)`,

    // 模試定義初期データ（5セット）
    `INSERT OR REPLACE INTO mock_exams (id, name, description, structure_json) VALUES
      ('MOCK_001', '基礎レベル模試', '基本的な問題中心の模試', '{"section1":{"count":15,"maxScore":60,"questionCategory":"journal","timeRecommendation":30},"section2":{"count":2,"maxScore":20,"questionCategory":"ledger","timeRecommendation":15},"section3":{"count":1,"maxScore":20,"questionCategory":"trial_balance","timeRecommendation":15}}'),
      ('MOCK_002', '標準レベル模試', '標準的な難易度の模試', '{"section1":{"count":15,"maxScore":60,"questionCategory":"journal","timeRecommendation":30},"section2":{"count":2,"maxScore":20,"questionCategory":"ledger","timeRecommendation":15},"section3":{"count":1,"maxScore":20,"questionCategory":"trial_balance","timeRecommendation":15}}'),
      ('MOCK_003', '応用レベル模試', '応用問題を含む模試', '{"section1":{"count":15,"maxScore":60,"questionCategory":"journal","timeRecommendation":30},"section2":{"count":2,"maxScore":20,"questionCategory":"ledger","timeRecommendation":15},"section3":{"count":1,"maxScore":20,"questionCategory":"trial_balance","timeRecommendation":15}}'),
      ('MOCK_004', '実践レベル模試', '実践的な問題構成の模試', '{"section1":{"count":15,"maxScore":60,"questionCategory":"journal","timeRecommendation":30},"section2":{"count":2,"maxScore":20,"questionCategory":"ledger","timeRecommendation":15},"section3":{"count":1,"maxScore":20,"questionCategory":"trial_balance","timeRecommendation":15}}'),
      ('MOCK_005', '総合レベル模試', '総合的な実力測定模試', '{"section1":{"count":15,"maxScore":60,"questionCategory":"journal","timeRecommendation":30},"section2":{"count":2,"maxScore":20,"questionCategory":"ledger","timeRecommendation":15},"section3":{"count":1,"maxScore":20,"questionCategory":"trial_balance","timeRecommendation":15}}')`,
  ],

  rollbackSql: [
    "DROP INDEX IF EXISTS idx_mock_questions_section",
    "DROP INDEX IF EXISTS idx_mock_questions_exam",
    "DROP INDEX IF EXISTS idx_exam_results_score",
    "DROP INDEX IF EXISTS idx_exam_results_date",
    "DROP INDEX IF EXISTS idx_progress_category",
    "DROP INDEX IF EXISTS idx_review_last_answered",
    "DROP INDEX IF EXISTS idx_review_priority",
    "DROP INDEX IF EXISTS idx_review_status",
    "DROP INDEX IF EXISTS idx_accounts_sort",
    "DROP INDEX IF EXISTS idx_accounts_category",
    "DROP INDEX IF EXISTS idx_history_session",
    "DROP INDEX IF EXISTS idx_history_date",
    "DROP INDEX IF EXISTS idx_history_question",
    "DROP INDEX IF EXISTS idx_questions_difficulty",
    "DROP INDEX IF EXISTS idx_questions_category",

    "DROP TABLE IF EXISTS app_settings",
    "DROP TABLE IF EXISTS mock_exam_results",
    "DROP TABLE IF EXISTS mock_exam_questions",
    "DROP TABLE IF EXISTS mock_exams",
    "DROP TABLE IF EXISTS user_progress",
    "DROP TABLE IF EXISTS review_items",
    "DROP TABLE IF EXISTS learning_history",
    "DROP TABLE IF EXISTS account_items",
    "DROP TABLE IF EXISTS questions",
    "DROP TABLE IF EXISTS categories",
  ],
};
