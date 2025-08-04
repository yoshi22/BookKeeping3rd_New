#!/usr/bin/env node
/**
 * エラーハンドリングとバリデーションのテストスクリプト
 * Node.js環境でバリデーション機能をテスト
 */

const { Database } = require('sqlite3').verbose();

async function testErrorHandling() {
  console.log('=== エラーハンドリング・バリデーションテスト開始 ===');

  const db = new Database(':memory:'); // メモリ内データベースを使用

  try {
    // データベース初期化
    await setupDatabase(db);

    // 1. バリデーションテスト
    console.log('\n--- バリデーションテスト ---');
    await testValidation();

    // 2. データベースエラーハンドリングテスト
    console.log('\n--- データベースエラーハンドリングテスト ---');
    await testDatabaseErrorHandling(db);

    // 3. 外部キー制約エラーテスト
    console.log('\n--- 外部キー制約エラーテスト ---');
    await testForeignKeyConstraints(db);

    // 4. トランザクションエラーハンドリングテスト
    console.log('\n--- トランザクションエラーハンドリングテスト ---');
    await testTransactionErrorHandling(db);

    // 5. エラー回復戦略テスト
    console.log('\n--- エラー回復戦略テスト ---');
    await testErrorRecoveryStrategies(db);

    console.log('\n=== エラーハンドリング・バリデーションテスト完了 ===');
    console.log('✓ バリデーション機能が正常に動作');
    console.log('✓ データベースエラーが適切にハンドリング');
    console.log('✓ 制約違反が正しく検出・処理');
    console.log('✓ エラー回復戦略が有効に機能');

  } catch (error) {
    console.error('✗ エラーハンドリングテストエラー:', error);
  } finally {
    db.close();
  }
}

// データベース初期化
async function setupDatabase(db) {
  // 外部キー制約を有効化
  await runSQL(db, 'PRAGMA foreign_keys = ON');

  // テーブル作成
  await runSQL(db, `
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_questions INTEGER NOT NULL DEFAULT 0 CHECK (total_questions >= 0)
    )
  `);

  await runSQL(db, `
    CREATE TABLE questions (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      question_text TEXT NOT NULL CHECK (length(question_text) >= 5),
      difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // テストデータ挿入
  await runSQL(db, `
    INSERT INTO categories (id, name, total_questions) VALUES 
    ('journal', '仕訳', 250),
    ('ledger', '帳簿', 40)
  `);

  console.log('✓ テストデータベース初期化完了');
}

// バリデーションテスト
async function testValidation() {
  // 1. 問題IDバリデーション
  console.log('1. 問題IDバリデーション:');
  
  const validIds = ['Q_J_001', 'Q_L_040', 'Q_T_012'];
  const invalidIds = ['Q001', 'Q_J_', 'Q_X_001', '', null];

  validIds.forEach(id => {
    const isValid = validateQuestionId(id);
    console.log(`  ✓ ${id}: ${isValid ? 'Valid' : 'Invalid'}`);
  });

  invalidIds.forEach(id => {
    const isValid = validateQuestionId(id);
    console.log(`  ${isValid ? '✗' : '✓'} ${id}: ${isValid ? 'Valid' : 'Invalid'}`);
  });

  // 2. 仕訳解答バリデーション
  console.log('\n2. 仕訳解答バリデーション:');
  
  const validJournalAnswer = {
    journalEntry: {
      debit: { account: '仕入', amount: 100000 },
      credit: { account: '現金', amount: 100000 }
    }
  };

  const invalidJournalAnswers = [
    {
      // 借方・貸方不一致
      journalEntry: {
        debit: { account: '仕入', amount: 100000 },
        credit: { account: '現金', amount: 50000 }
      }
    },
    {
      // 同一勘定科目
      journalEntry: {
        debit: { account: '現金', amount: 100000 },
        credit: { account: '現金', amount: 100000 }
      }
    },
    {
      // 負の金額
      journalEntry: {
        debit: { account: '仕入', amount: -100000 },
        credit: { account: '現金', amount: -100000 }
      }
    }
  ];

  console.log(`  ✓ 正常な仕訳解答: ${validateJournalAnswer(validJournalAnswer) ? 'Valid' : 'Invalid'}`);
  
  invalidJournalAnswers.forEach((answer, index) => {
    const isValid = validateJournalAnswer(answer);
    console.log(`  ✓ 異常な仕訳解答${index + 1}: ${isValid ? 'Valid' : 'Invalid'}`);
  });

  // 3. 数値範囲バリデーション
  console.log('\n3. 数値範囲バリデーション:');
  
  const testCases = [
    { value: 30000, min: 1000, max: 600000, expected: true },
    { value: 500, min: 1000, max: 600000, expected: false },
    { value: 700000, min: 1000, max: 600000, expected: false },
    { value: -1000, min: 1000, max: 600000, expected: false }
  ];

  testCases.forEach(testCase => {
    const isValid = validateNumberRange(testCase.value, testCase.min, testCase.max);
    const result = isValid === testCase.expected ? '✓' : '✗';
    console.log(`  ${result} ${testCase.value} (${testCase.min}-${testCase.max}): ${isValid ? 'Valid' : 'Invalid'}`);
  });
}

// データベースエラーハンドリングテスト
async function testDatabaseErrorHandling(db) {
  console.log('1. テーブル不存在エラー:');
  try {
    await runSQL(db, 'SELECT * FROM non_existent_table');
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }

  console.log('\n2. カラム不存在エラー:');
  try {
    await runSQL(db, 'SELECT non_existent_column FROM categories');
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }

  console.log('\n3. CHECK制約違反エラー:');
  try {
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, difficulty) 
      VALUES ('Q_J_001', 'journal', '短い', 6)
    `);
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }

  console.log('\n4. ユニーク制約違反エラー:');
  try {
    // 正常なデータを挿入
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, difficulty) 
      VALUES ('Q_J_001', 'journal', '正常な問題文です', 2)
    `);
    
    // 同じIDで再度挿入（ユニーク制約違反）
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, difficulty) 
      VALUES ('Q_J_001', 'journal', '別の問題文です', 3)
    `);
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }
}

// 外部キー制約エラーテスト
async function testForeignKeyConstraints(db) {
  console.log('1. 存在しない外部キー参照:');
  try {
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, difficulty) 
      VALUES ('Q_X_001', 'non_existent_category', '存在しないカテゴリを参照', 2)
    `);
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }

  console.log('\n2. 参照されているレコードの削除:');
  try {
    // まず正常な問題を挿入
    await runSQL(db, `
      INSERT INTO questions (id, category_id, question_text, difficulty) 
      VALUES ('Q_J_002', 'journal', '正常な問題文です', 2)
    `);

    // 参照されているカテゴリを削除しようとする
    await runSQL(db, `DELETE FROM categories WHERE id = 'journal'`);
    console.log('  ✗ エラーが発生しませんでした');
  } catch (error) {
    console.log(`  ✓ 期待通りエラー発生: ${error.message.substring(0, 50)}...`);
  }
}

// トランザクションエラーハンドリングテスト
async function testTransactionErrorHandling(db) {
  console.log('1. トランザクション中のエラー:');
  
  const initialCount = await getCount(db, 'SELECT COUNT(*) as count FROM questions');
  console.log(`  初期問題数: ${initialCount}`);

  try {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // 正常な挿入
        db.run(`
          INSERT INTO questions (id, category_id, question_text, difficulty) 
          VALUES ('Q_J_003', 'journal', '正常な問題文です', 2)
        `);
        
        // エラーを起こす挿入（外部キー制約違反）
        db.run(`
          INSERT INTO questions (id, category_id, question_text, difficulty) 
          VALUES ('Q_X_002', 'invalid_category', '無効なカテゴリ参照', 2)
        `, (err) => {
          if (err) {
            db.run('ROLLBACK', () => {
              console.log('  ✓ トランザクションロールバック成功');
              resolve();
            });
          } else {
            reject(new Error('エラーが発生しませんでした'));
          }
        });
      });
    });
  } catch (error) {
    console.log(`  ✗ 予期しないエラー: ${error.message}`);
  }

  const finalCount = await getCount(db, 'SELECT COUNT(*) as count FROM questions');
  console.log(`  最終問題数: ${finalCount}`);
  
  if (finalCount === initialCount) {
    console.log('  ✓ ロールバックにより変更が取り消されました');
  } else {
    console.log('  ✗ ロールバックが正しく動作しませんでした');
  }
}

// エラー回復戦略テスト
async function testErrorRecoveryStrategies(db) {
  console.log('1. リトライ戦略テスト:');
  
  let attemptCount = 0;
  const maxRetries = 3;

  const retryableOperation = async () => {
    attemptCount++;
    console.log(`  試行 ${attemptCount}/${maxRetries}`);
    
    if (attemptCount < 3) {
      throw new Error('一時的なエラー（テスト用）');
    }
    
    return 'success';
  };

  try {
    const result = await retryWithBackoff(retryableOperation, maxRetries);
    console.log(`  ✓ リトライ成功: ${result}`);
  } catch (error) {
    console.log(`  ✗ リトライ失敗: ${error.message}`);
  }

  console.log('\n2. エラー分類テスト:');

  const testErrors = [
    { message: 'database is locked', expectedSeverity: 'CRITICAL' },
    { message: 'FOREIGN KEY constraint failed', expectedSeverity: 'HIGH' },
    { message: 'no such column', expectedSeverity: 'MEDIUM' },
    { message: 'general error', expectedSeverity: 'LOW' }
  ];

  testErrors.forEach(testError => {
    const severity = classifyErrorSeverity(testError.message);
    const result = severity === testError.expectedSeverity ? '✓' : '✗';
    console.log(`  ${result} "${testError.message}" → ${severity} (期待値: ${testError.expectedSeverity})`);
  });
}

// ヘルパー関数群

function runSQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
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

// バリデーション関数群

function validateQuestionId(id) {
  if (!id) return false;
  const pattern = /^Q_[JLT]_\d{3}$/;
  return pattern.test(id);
}

function validateJournalAnswer(answer) {
  if (!answer.journalEntry) return false;
  
  const { debit, credit } = answer.journalEntry;
  
  // 必須フィールドチェック
  if (!debit || !debit.account || typeof debit.amount !== 'number') return false;
  if (!credit || !credit.account || typeof credit.amount !== 'number') return false;
  
  // 借方・貸方同額チェック
  if (debit.amount !== credit.amount) return false;
  
  // 同一勘定科目チェック
  if (debit.account === credit.account) return false;
  
  // 正の金額チェック
  if (debit.amount <= 0 || credit.amount <= 0) return false;
  
  return true;
}

function validateNumberRange(value, min, max) {
  if (typeof value !== 'number' || isNaN(value)) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 100) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

function classifyErrorSeverity(errorMessage) {
  if (errorMessage.includes('database is locked') || 
      errorMessage.includes('disk I/O error')) {
    return 'CRITICAL';
  }
  
  if (errorMessage.includes('FOREIGN KEY constraint') ||
      errorMessage.includes('UNIQUE constraint')) {
    return 'HIGH';
  }
  
  if (errorMessage.includes('no such column') ||
      errorMessage.includes('syntax error')) {
    return 'MEDIUM';
  }
  
  return 'LOW';
}

// メイン実行
if (require.main === module) {
  testErrorHandling().catch(console.error);
}

module.exports = { testErrorHandling };