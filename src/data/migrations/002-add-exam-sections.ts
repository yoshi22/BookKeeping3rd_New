/**
 * Migration: Add exam sections and subcategories for CBT format
 * Version: 002
 * Description: Adds exam_section field to questions, creates subcategories table,
 *              and maps existing categories to the new CBT exam structure
 */

export const addExamSectionsMigration = {
  version: 2,
  name: "add-exam-sections",
  description: "CBT試験形式対応 - 試験セクションとサブカテゴリの追加",
  timestamp: "2025-01-27T11:00:00Z",

  sql: [
    // === Drop and recreate exam_sections table to ensure clean schema ===
    `DROP TABLE IF EXISTS exam_sections`,
    
    `CREATE TABLE exam_sections (
      section_number INTEGER PRIMARY KEY CHECK (section_number BETWEEN 1 AND 3),
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      total_points INTEGER NOT NULL,
      question_count INTEGER NOT NULL,
      points_per_question INTEGER,
      time_allocation_minutes INTEGER NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,

    // === Insert exam section definitions (with OR IGNORE to prevent duplicates) ===
    `INSERT OR IGNORE INTO exam_sections (section_number, name, display_name, total_points, question_count, points_per_question, time_allocation_minutes, description, sort_order) VALUES
      (1, '仕訳問題', '第1問', 45, 15, 3, 20, '基本的な仕訳能力を問う問題。各種取引の仕訳処理を行う。', 1)`,

    `INSERT OR IGNORE INTO exam_sections (section_number, name, display_name, total_points, question_count, points_per_question, time_allocation_minutes, description, sort_order) VALUES
      (2, '帳簿・補助簿', '第2問', 20, 2, 10, 20, '帳簿記入・補助簿作成・伝票処理などの実務的な問題。', 2)`,

    `INSERT OR IGNORE INTO exam_sections (section_number, name, display_name, total_points, question_count, points_per_question, time_allocation_minutes, description, sort_order) VALUES
      (3, '決算書作成', '第3問', 35, 1, 35, 20, '財務諸表・精算表・試算表の作成を行う総合問題。', 3)`,

    // === Create subcategories table ===
    `CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      exam_section INTEGER NOT NULL,
      parent_category_id TEXT NOT NULL,
      description TEXT,
      question_pattern TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (parent_category_id) REFERENCES categories (id),
      CHECK (exam_section BETWEEN 1 AND 3)
    )`,

    // === Insert subcategories for 第1問 (journal/仕訳) (with OR IGNORE to prevent duplicates) ===
    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('cash_deposits', '現金・預金取引', 1, 'journal', '現金・預金・小口現金関連の取引（42問）', 1)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('sales_transactions', '商品売買取引', 1, 'journal', '売上・仕入・返品・値引き取引（45問）', 2)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('receivables_payables', '債権・債務', 1, 'journal', '売掛金・買掛金・手形・貸借取引（41問）', 3)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('payroll_taxes', '給与・税金', 1, 'journal', '給与・源泉徴収・社会保険・税金（42問）', 4)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('fixed_assets', '固定資産', 1, 'journal', '固定資産取得・減価償却・売却処理（40問）', 5)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('closing_adjustments', '決算整理', 1, 'journal', '引当金・経過勘定・棚卸資産整理（40問）', 6)`,

    // === Insert subcategories for 第2問 (ledger/帳簿) ===
    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('account_entries', '勘定記入', 2, 'ledger', '各種勘定の記入・残高計算（10問）', 1)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('auxiliary_books', '補助簿記入', 2, 'ledger', '現金出納帳・仕入帳・売上帳等（10問）', 2)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('voucher_system', '伝票記入', 2, 'ledger', '3伝票制・5伝票制の処理（10問）', 3)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('theory_selection', '理論・選択', 2, 'ledger', '簿記理論・帳簿組織の理解（10問）', 4)`,

    // === Insert subcategories for 第3問 (trial_balance/試算表) ===
    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('financial_statements', '財務諸表作成', 3, 'trial_balance', '貸借対照表・損益計算書作成（4問）', 1)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('worksheets', '精算表作成', 3, 'trial_balance', '6桁・8桁精算表の作成（4問）', 2)`,

    `INSERT OR IGNORE INTO subcategories (id, name, exam_section, parent_category_id, description, sort_order) VALUES
      ('trial_balances', '試算表作成', 3, 'trial_balance', '合計・残高・合計残高試算表（4問）', 3)`,

    // === Update categories table to show CBT format names ===
    `UPDATE categories SET 
      name = '第1問：仕訳問題', 
      description = 'CBT形式 第1問（45点）- 仕訳15問（各3点）'
     WHERE id = 'journal'`,

    `UPDATE categories SET 
      name = '第2問：帳簿・補助簿', 
      description = 'CBT形式 第2問（20点）- 帳簿・補助簿・伝票2問（各10点）'
     WHERE id = 'ledger'`,

    `UPDATE categories SET 
      name = '第3問：決算書作成', 
      description = 'CBT形式 第3問（35点）- 財務諸表・精算表・試算表1問'
     WHERE id = 'trial_balance'`,

    // === Create indexes for performance ===
    `CREATE INDEX IF NOT EXISTS idx_subcategories_section ON subcategories (exam_section)`,
    `CREATE INDEX IF NOT EXISTS idx_subcategories_parent ON subcategories (parent_category_id)`,

    // === Update app_settings to track migration ===
    `INSERT OR REPLACE INTO app_settings (key, value, type) VALUES
      ('exam_format_version', '2', 'number')`,

    `INSERT OR REPLACE INTO app_settings (key, value, type) VALUES
      ('cbt_mode_enabled', 'true', 'boolean')`,
  ],

  rollbackSql: [
    // Drop indexes
    "DROP INDEX IF EXISTS idx_subcategories_parent",
    "DROP INDEX IF EXISTS idx_subcategories_section",

    // Drop new tables
    "DROP TABLE IF EXISTS exam_sections",
    "DROP TABLE IF EXISTS subcategories",

    // Revert category names
    `UPDATE categories SET 
      name = '仕訳', 
      description = '基本的な仕訳問題（25パターン×10問）'
     WHERE id = 'journal'`,

    `UPDATE categories SET 
      name = '帳簿', 
      description = '元帳・補助簿に関する問題（4種類×10問）'
     WHERE id = 'ledger'`,

    `UPDATE categories SET 
      name = '試算表', 
      description = '試算表作成・修正に関する問題（3パターン×4問）'
     WHERE id = 'trial_balance'`,

    // Remove app settings
    `DELETE FROM app_settings WHERE key IN ('exam_format_version', 'cbt_mode_enabled')`,
  ],
};
