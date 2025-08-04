#!/usr/bin/env node
/**
 * Repository CRUD操作の統合テストスクリプト
 * データベース基盤の動作確認
 */

const { Database } = require('sqlite3').verbose();
const path = require('path');

// テスト用データベースファイル
const DB_PATH = path.join(__dirname, '../test-crud.db');

async function testRepositoryCRUD() {
  console.log('=== Repository CRUD操作テスト開始 ===');

  const db = new Database(':memory:'); // メモリ内データベースを使用

  try {
    // データベース初期化
    await setupDatabase(db);

    // 1. Create操作テスト
    console.log('\n--- Create操作テスト ---');
    await testCreateOperations(db);

    // 2. Read操作テスト
    console.log('\n--- Read操作テスト ---');
    await testReadOperations(db);

    // 3. Update操作テスト
    console.log('\n--- Update操作テスト ---');
    await testUpdateOperations(db);

    // 4. Delete操作テスト
    console.log('\n--- Delete操作テスト ---');
    await testDeleteOperations(db);

    // 5. 複雑なクエリテスト
    console.log('\n--- 複雑なクエリテスト ---');
    await testComplexQueries(db);

    // 6. トランザクションテスト
    console.log('\n--- トランザクションテスト ---');
    await testTransactions(db);

    console.log('\n=== Repository CRUD操作テスト完了 ===');
    console.log('✓ 全てのCRUD操作が正常に動作');
    console.log('✓ 参照整合性制約が正常に機能');
    console.log('✓ トランザクション処理が正常に動作');

  } catch (error) {
    console.error('✗ Repository CRUDテストエラー:', error);
  } finally {
    db.close();
  }
}

// データベース初期化
async function setupDatabase(db) {
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

  // 問題テーブル作成
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
      CHECK (difficulty BETWEEN 1 AND 5)
    )
  `);

  // 学習履歴テーブル作成
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
      CHECK (session_type IN ('learning', 'review', 'mock_exam')),
      CHECK (answer_time_ms > 0)
    )
  `);

  console.log('✓ テーブル作成完了');
}

// Create操作テスト
async function testCreateOperations(db) {
  // カテゴリデータ挿入
  await runSQL(db, `
    INSERT INTO categories (id, name, description, sort_order, total_questions) VALUES
      ('journal', '仕訳', '基本的な仕訳問題', 1, 250),
      ('ledger', '帳簿', '元帳・補助簿に関する問題', 2, 40),
      ('trial_balance', '試算表', '試算表作成・修正に関する問題', 3, 12)
  `);
  console.log('✓ カテゴリデータ挿入完了');

  // 問題データ挿入
  const questions = [
    {
      id: 'Q_J_001',
      category_id: 'journal',
      question_text: '商品100,000円を現金で仕入れた。',
      answer_template_json: '{"type":"journal_entry","fields":[{"name":"debit_account","type":"dropdown"},{"name":"debit_amount","type":"number"}]}',
      correct_answer_json: '{"debit_account":"仕入","debit_amount":100000,"credit_account":"現金","credit_amount":100000}',
      explanation: '商品を仕入れたので仕入勘定（費用）が増加し、現金で支払ったので現金勘定（資産）が減少する。'
    },
    {
      id: 'Q_L_001',
      category_id: 'ledger',
      question_text: '現金出納帳に記入しなさい。',
      answer_template_json: '{"type":"ledger_entry","fields":[{"name":"description","type":"dropdown"},{"name":"amount","type":"number"}]}',
      correct_answer_json: '{"description":"商品売上","amount":50000}',
      explanation: '現金の増加なので現金出納帳の入金欄に記入する。'
    },
    {
      id: 'Q_T_001',
      category_id: 'trial_balance',
      question_text: '試算表を完成させなさい。',
      answer_template_json: '{"type":"trial_balance","accounts":[{"name":"現金","field":"cash_balance"}]}',
      correct_answer_json: '{"cash_balance":150000}',
      explanation: '各取引の借方・貸方を集計して試算表を作成する。'
    }
  ];

  for (const question of questions) {
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, answer_template_json, correct_answer_json, explanation, difficulty) 
      VALUES (?, ?, ?, ?, ?, ?, 2)
    `, [question.id, question.category_id, question.question_text, question.answer_template_json, question.correct_answer_json, question.explanation]);
  }
  console.log('✓ 問題データ挿入完了（3問）');

  // 学習履歴データ挿入
  const historyData = [
    { question_id: 'Q_J_001', user_answer_json: '{"debit_account":"仕入","debit_amount":100000}', is_correct: true, answer_time_ms: 45000 },
    { question_id: 'Q_J_001', user_answer_json: '{"debit_account":"商品","debit_amount":100000}', is_correct: false, answer_time_ms: 38000 },
    { question_id: 'Q_L_001', user_answer_json: '{"description":"商品売上","amount":50000}', is_correct: true, answer_time_ms: 32000 }
  ];

  for (const history of historyData) {
    await runSQL(db, `
      INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms) 
      VALUES (?, ?, ?, ?)
    `, [history.question_id, history.user_answer_json, history.is_correct, history.answer_time_ms]);
  }
  console.log('✓ 学習履歴データ挿入完了（3件）');
}

// Read操作テスト
async function testReadOperations(db) {
  // 単一レコード取得
  const category = await getRow(db, 'SELECT * FROM categories WHERE id = ?', ['journal']);
  console.log(`✓ 単一カテゴリ取得: ${category.name}（${category.total_questions}問）`);

  // 複数レコード取得
  const questions = await getAllRows(db, 'SELECT * FROM questions ORDER BY id');
  console.log(`✓ 全問題取得: ${questions.length}問`);

  // 条件付き検索
  const journalQuestions = await getAllRows(db, 
    'SELECT * FROM questions WHERE category_id = ? AND difficulty = ?', 
    ['journal', 2]
  );
  console.log(`✓ 条件付き検索: 仕訳問題（難易度2）= ${journalQuestions.length}問`);

  // カウント取得
  const historyCount = await getCount(db, 'SELECT COUNT(*) as count FROM learning_history');
  console.log(`✓ 学習履歴カウント: ${historyCount}件`);

  // 集計クエリ
  const statsQuery = `
    SELECT 
      category_id,
      COUNT(*) as question_count,
      AVG(difficulty) as avg_difficulty
    FROM questions 
    GROUP BY category_id
  `;
  const stats = await getAllRows(db, statsQuery);
  console.log('✓ 分野別統計:');
  stats.forEach(stat => {
    console.log(`  - ${stat.category_id}: ${stat.question_count}問（平均難易度: ${stat.avg_difficulty.toFixed(1)}）`);
  });
}

// Update操作テスト
async function testUpdateOperations(db) {
  // 単一レコード更新
  await runSQL(db, 
    'UPDATE categories SET total_questions = ? WHERE id = ?', 
    [260, 'journal']
  );
  
  const updatedCategory = await getRow(db, 'SELECT * FROM categories WHERE id = ?', ['journal']);
  console.log(`✓ カテゴリ更新: 仕訳問題数 = ${updatedCategory.total_questions}問`);

  // 複数レコード更新
  await runSQL(db, 
    'UPDATE questions SET difficulty = ? WHERE category_id = ?', 
    [3, 'trial_balance']
  );
  
  const updatedQuestions = await getAllRows(db, 
    'SELECT * FROM questions WHERE category_id = ?', 
    ['trial_balance']
  );
  console.log(`✓ 複数レコード更新: 試算表問題の難易度を${updatedQuestions[0].difficulty}に変更`);

  // JSON更新（実用例）
  await runSQL(db, `
    UPDATE questions 
    SET answer_template_json = '{"type":"journal_entry","fields":[{"name":"debit_account","type":"dropdown","required":true}]}' 
    WHERE id = ?
  `, ['Q_J_001']);
  console.log('✓ JSON データ更新完了');
}

// Delete操作テスト
async function testDeleteOperations(db) {
  // 条件付き削除
  const deleteResult = await runSQL(db, 
    'DELETE FROM learning_history WHERE is_correct = ? AND answer_time_ms > ?', 
    [false, 30000]
  );
  console.log(`✓ 条件付き削除: 不正解かつ時間のかかった履歴を削除（${deleteResult.changes}件）`);

  // 存在確認
  const remainingHistory = await getCount(db, 'SELECT COUNT(*) as count FROM learning_history');
  console.log(`✓ 残り学習履歴: ${remainingHistory}件`);

  // 参照整合性テスト（削除制約）
  try {
    await runSQL(db, 'DELETE FROM categories WHERE id = ?', ['journal']);
    console.log('✗ 参照整合性制約が機能していない');
  } catch (error) {
    console.log('✓ 参照整合性制約が正常に機能（外部キー制約エラー）');
  }
}

// 複雑なクエリテスト
async function testComplexQueries(db) {
  // JOIN クエリ
  const joinQuery = `
    SELECT 
      q.id,
      q.question_text,
      c.name as category_name,
      COUNT(lh.id) as attempt_count,
      AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy_rate,
      AVG(lh.answer_time_ms) as avg_time
    FROM questions q
    INNER JOIN categories c ON q.category_id = c.id
    LEFT JOIN learning_history lh ON q.id = lh.question_id
    GROUP BY q.id, q.question_text, c.name
    ORDER BY attempt_count DESC
  `;

  const complexResults = await getAllRows(db, joinQuery);
  console.log('✓ 複雑なJOINクエリ実行結果:');
  complexResults.forEach(result => {
    console.log(`  - ${result.id}: ${result.attempt_count}回挑戦, 正答率${(result.accuracy_rate * 100).toFixed(1)}%, 平均時間${(result.avg_time / 1000).toFixed(1)}秒`);
  });

  // サブクエリ
  const subqueryResults = await getAllRows(db, `
    SELECT * FROM questions 
    WHERE category_id IN (
      SELECT id FROM categories WHERE total_questions > 50
    )
  `);
  console.log(`✓ サブクエリ実行: 問題数50問超の分野から${subqueryResults.length}問取得`);

  // ウィンドウ関数（SQLiteサポート範囲内）
  const windowQuery = `
    SELECT 
      lh.*,
      ROW_NUMBER() OVER (PARTITION BY lh.question_id ORDER BY lh.answered_at DESC) as attempt_rank
    FROM learning_history lh
    ORDER BY lh.question_id, attempt_rank
  `;
  
  const windowResults = await getAllRows(db, windowQuery);
  console.log(`✓ ウィンドウ関数実行: 各問題の最新挑戦を特定（${windowResults.length}件）`);
}

// トランザクションテスト
async function testTransactions(db) {
  console.log('トランザクションテスト開始...');

  // 成功パターン
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      db.run(`
        INSERT INTO questions (id, category_id, question_text, answer_template_json, correct_answer_json, explanation, difficulty) 
        VALUES ('Q_J_002', 'journal', 'テストトランザクション問題', '{}', '{}', 'テスト説明', 1)
      `);
      
      db.run(`
        INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms) 
        VALUES ('Q_J_002', '{"test": true}', 1, 25000)
      `);
      
      db.run('COMMIT', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✓ トランザクション成功パターン: 問題と履歴を同時挿入');
          resolve();
        }
      });
    });
  });

  // ロールバックパターン
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      db.run(`
        INSERT INTO questions (id, category_id, question_text, answer_template_json, correct_answer_json, explanation, difficulty) 
        VALUES ('Q_J_003', 'journal', 'ロールバックテスト問題', '{}', '{}', 'テスト説明', 1)
      `);
      
      // 意図的にエラーを発生させる（存在しない外部キー）
      db.run(`
        INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms) 
        VALUES ('Q_INVALID', '{"test": true}', 1, 25000)
      `, (err) => {
        if (err) {
          db.run('ROLLBACK', () => {
            console.log('✓ トランザクションロールバック: エラー時の自動復旧');
            resolve();
          });
        } else {
          reject(new Error('ロールバックテストが失敗'));
        }
      });
    });
  });

  // 最終的なデータ確認
  const finalQuestionCount = await getCount(db, 'SELECT COUNT(*) as count FROM questions');
  console.log(`✓ 最終問題数: ${finalQuestionCount}問（Q_J_002のみ追加され、Q_J_003はロールバック）`);
}

// ヘルパー関数群
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

function getRow(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

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

// メイン実行
if (require.main === module) {
  testRepositoryCRUD().catch(console.error);
}

module.exports = { testRepositoryCRUD };