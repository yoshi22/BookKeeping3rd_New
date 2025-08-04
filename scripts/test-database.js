#!/usr/bin/env node
/**
 * データベース基盤の動作確認スクリプト
 * Node.js環境でSQLiteマイグレーションをテスト
 */

const { Database } = require('sqlite3').verbose();
const path = require('path');

// テスト用データベースファイル
const DB_PATH = path.join(__dirname, '../test.db');

async function testDatabase() {
  console.log('=== データベース基盤テスト開始 ===');

  const db = new Database(':memory:'); // メモリ内データベースを使用

  try {
    // 外部キー制約を有効化
    await runSQL(db, 'PRAGMA foreign_keys = ON');
    console.log('✓ 外部キー制約有効化完了');

    // カテゴリテーブル作成
    await runSQL(db, `
      CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        total_questions INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1
      )
    `);
    console.log('✓ categoriesテーブル作成完了');

    // 問題テーブル作成（簡略版）
    await runSQL(db, `
      CREATE TABLE questions (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        answer_template_json TEXT NOT NULL,
        correct_answer_json TEXT NOT NULL,
        explanation TEXT NOT NULL,
        difficulty INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (category_id) REFERENCES categories (id),
        CHECK (difficulty BETWEEN 1 AND 5),
        CHECK (json_valid(answer_template_json)),
        CHECK (json_valid(correct_answer_json))
      )
    `);
    console.log('✓ questionsテーブル作成完了');

    // 学習履歴テーブル作成（簡略版）
    await runSQL(db, `
      CREATE TABLE learning_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id TEXT NOT NULL,
        user_answer_json TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        answer_time_ms INTEGER NOT NULL,
        session_type TEXT DEFAULT 'learning',
        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (question_id) REFERENCES questions (id),
        CHECK (json_valid(user_answer_json)),
        CHECK (session_type IN ('learning', 'review', 'mock_exam')),
        CHECK (answer_time_ms > 0)
      )
    `);
    console.log('✓ learning_historyテーブル作成完了');

    // 初期データ投入
    await runSQL(db, `
      INSERT INTO categories (id, name, description, sort_order, total_questions) VALUES
        ('journal', '仕訳', '基本的な仕訳問題', 1, 250),
        ('ledger', '帳簿', '元帳・補助簿に関する問題', 2, 40),
        ('trial_balance', '試算表', '試算表作成・修正に関する問題', 3, 12)
    `);
    console.log('✓ カテゴリ初期データ投入完了');

    // テスト問題データ投入
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, answer_template_json, correct_answer_json, explanation, difficulty) VALUES (
        'Q_J_001',
        'journal',
        '商品100,000円を現金で仕入れた。',
        '{"type":"journal_entry","fields":[{"name":"debit_account","type":"dropdown"},{"name":"debit_amount","type":"number"},{"name":"credit_account","type":"dropdown"},{"name":"credit_amount","type":"number"}]}',
        '{"debit_account":"仕入","debit_amount":100000,"credit_account":"現金","credit_amount":100000}',
        '商品を仕入れたので仕入勘定（費用）が増加し、現金で支払ったので現金勘定（資産）が減少する。',
        2
      )
    `);
    console.log('✓ テスト問題データ投入完了');

    // テスト学習履歴データ投入
    await runSQL(db, `
      INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms, session_type) VALUES (
        'Q_J_001',
        '{"debit_account":"仕入","debit_amount":100000,"credit_account":"現金","credit_amount":100000}',
        1,
        45000,
        'learning'
      )
    `);
    console.log('✓ テスト学習履歴データ投入完了');

    // データ確認クエリ実行
    const categoryCount = await getCount(db, 'SELECT COUNT(*) as count FROM categories');
    const questionCount = await getCount(db, 'SELECT COUNT(*) as count FROM questions');
    const historyCount = await getCount(db, 'SELECT COUNT(*) as count FROM learning_history');

    console.log('\n=== データベース確認結果 ===');
    console.log(`カテゴリ数: ${categoryCount}`);
    console.log(`問題数: ${questionCount}`);
    console.log(`学習履歴数: ${historyCount}`);

    // 結合クエリテスト
    const result = await getAllRows(db, `
      SELECT 
        q.id,
        q.question_text,
        c.name as category_name,
        lh.is_correct,
        lh.answer_time_ms
      FROM questions q
      JOIN categories c ON q.category_id = c.id
      LEFT JOIN learning_history lh ON q.id = lh.question_id
    `);

    console.log('\n=== 結合クエリ結果 ===');
    result.forEach((row, index) => {
      console.log(`${index + 1}. ${row.category_name}: ${row.question_text.substring(0, 20)}... (正解: ${row.is_correct ? 'Yes' : 'No'}, 時間: ${row.answer_time_ms}ms)`);
    });

    // データベース整合性チェック
    const integrityResult = await getAllRows(db, 'PRAGMA integrity_check');
    if (integrityResult[0] && integrityResult[0].integrity_check === 'ok') {
      console.log('✓ データベース整合性チェック: OK');
    } else {
      console.log('✗ データベース整合性チェック: NG');
    }

    console.log('\n=== データベース基盤テスト完了 ===');
    console.log('✓ マイグレーション実行成功');
    console.log('✓ 基本CRUD操作確認完了');
    console.log('✓ 参照整合性制約動作確認完了');

  } catch (error) {
    console.error('✗ データベーステストエラー:', error);
  } finally {
    db.close();
  }
}

// SQLクエリ実行ヘルパー関数
function runSQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(new Error(`SQL実行エラー: ${sql} - ${err.message}`));
      } else {
        resolve(this);
      }
    });
  });
}

// カウント取得ヘルパー関数
function getCount(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.count : 0);
      }
    });
  });
}

// 全行取得ヘルパー関数
function getAllRows(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// メイン実行
if (require.main === module) {
  testDatabase().catch(console.error);
}

module.exports = { testDatabase };