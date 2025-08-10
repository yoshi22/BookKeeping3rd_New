/**
 * マイグレーション004: 問題構造データ投入
 * problemsStrategy.mdに基づく詳細分類・順序制御データの投入
 */
import { MigrationInfo } from "../../types/database";

export const migration004: MigrationInfo = {
  version: 4,
  name: "populate-question-structure",
  description:
    "問題構造データ投入 - problemsStrategy.md基準の分類・順序・タグ付け",
  timestamp: "2025-08-10T13:00:00Z",

  sql: [
    // 列は既にmigration003で追加済み、インデックス作成のみ実行
    `CREATE INDEX IF NOT EXISTS idx_questions_subcategory ON questions (subcategory)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_section_order ON questions (section_number, question_order)`,
    `CREATE INDEX IF NOT EXISTS idx_questions_pattern ON questions (pattern_type)`,

    // 第1問（仕訳問題）の分類データ更新
    // 現金・預金取引 (1-42問)
    `UPDATE questions 
     SET subcategory = 'cash_deposit', section_number = 1, pattern_type = '現金・預金取引'
     WHERE category_id = 'journal' AND id IN (
       SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 42
     )`,

    // 商品売買取引 (43-87問)
    `UPDATE questions 
     SET subcategory = 'merchandise_trade', section_number = 1, pattern_type = '商品売買取引'
     WHERE category_id = 'journal' AND id IN (
       SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 45 OFFSET 42
     )`,

    // 債権・債務 (88-128問)
    `UPDATE questions 
     SET subcategory = 'receivables_debts', section_number = 2, pattern_type = '債権・債務'
     WHERE category_id = 'journal' AND id IN (
       SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 41 OFFSET 87
     )`,

    // 給与・税金 (129-170問)
    `UPDATE questions 
     SET subcategory = 'salary_tax', section_number = 2, pattern_type = '給与・税金'
     WHERE category_id = 'journal' AND id IN (
       SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 42 OFFSET 128
     )`,

    // 固定資産 (171-210問)
    `UPDATE questions 
     SET subcategory = 'fixed_assets', section_number = 3, pattern_type = '固定資産'
     WHERE category_id = 'journal' AND id IN (
       SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id LIMIT 40 OFFSET 170
     )`,

    // 決算整理 (211問以降)
    `UPDATE questions 
     SET subcategory = 'year_end_adj', section_number = 3, pattern_type = '決算整理'
     WHERE category_id = 'journal' AND subcategory IS NULL`,

    // 第2問（帳簿問題）の分類
    `UPDATE questions 
     SET subcategory = 'account_posting', section_number = 2, pattern_type = '勘定記入問題'
     WHERE category_id = 'ledger' AND id IN (
       SELECT id FROM questions WHERE category_id = 'ledger' ORDER BY id LIMIT 10
     )`,

    `UPDATE questions 
     SET subcategory = 'subsidiary_books', section_number = 2, pattern_type = '補助簿記入問題'
     WHERE category_id = 'ledger' AND id IN (
       SELECT id FROM questions WHERE category_id = 'ledger' ORDER BY id LIMIT 10 OFFSET 10
     )`,

    `UPDATE questions 
     SET subcategory = 'voucher_entry', section_number = 2, pattern_type = '伝票記入問題'
     WHERE category_id = 'ledger' AND id IN (
       SELECT id FROM questions WHERE category_id = 'ledger' ORDER BY id LIMIT 10 OFFSET 20
     )`,

    `UPDATE questions 
     SET subcategory = 'theory_selection', section_number = 2, pattern_type = '理論・選択問題'
     WHERE category_id = 'ledger' AND subcategory IS NULL`,

    // 第3問（試算表問題）の分類
    `UPDATE questions 
     SET subcategory = 'trial_balance', section_number = 3, pattern_type = '試算表作成'
     WHERE category_id = 'trial_balance' AND id IN (
       SELECT id FROM questions WHERE category_id = 'trial_balance' ORDER BY id LIMIT 4
     )`,

    `UPDATE questions 
     SET subcategory = 'worksheet', section_number = 3, pattern_type = '精算表作成'
     WHERE category_id = 'trial_balance' AND id IN (
       SELECT id FROM questions WHERE category_id = 'trial_balance' ORDER BY id LIMIT 4 OFFSET 4
     )`,

    `UPDATE questions 
     SET subcategory = 'financial_statements', section_number = 3, pattern_type = '財務諸表作成'
     WHERE category_id = 'trial_balance' AND subcategory IS NULL`,

    // 問題順序の設定（section内での順序）
    // これはROW_NUMBERが使えないため、単純なカウンタで設定
    `UPDATE questions 
     SET question_order = (
       SELECT COUNT(*) FROM questions q2 
       WHERE q2.category_id = questions.category_id 
       AND q2.section_number = questions.section_number 
       AND q2.id <= questions.id
     )
     WHERE section_number IS NOT NULL`,
  ],

  rollbackSql: [
    `DROP INDEX IF EXISTS idx_questions_pattern`,
    `DROP INDEX IF EXISTS idx_questions_section_order`,
    `DROP INDEX IF EXISTS idx_questions_subcategory`,

    `UPDATE questions SET subcategory = NULL`,
    `UPDATE questions SET section_number = NULL`,
    `UPDATE questions SET question_order = NULL`,
    `UPDATE questions SET pattern_type = NULL`,
  ],
};
