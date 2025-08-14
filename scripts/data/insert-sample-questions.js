#!/usr/bin/env node
/**
 * サンプル問題データ挿入スクリプト
 * Step 2.1.1: 問題表示機能開発用のテストデータをデータベースに投入
 */

const { Database } = require('sqlite3').verbose();
const path = require('path');

// サンプル問題データ
const sampleQuestions = [
  {
    id: 'Q_J_001',
    category_id: 'journal',
    question_text: '商品200,000円を現金で仕入れた。',
    answer_template_json: JSON.stringify({
      type: 'journal_entry',
      fields: [
        {
          label: '借方科目',
          type: 'dropdown',
          name: 'debit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '借方金額',
          type: 'number',
          name: 'debit_amount',
          required: true,
          format: 'currency'
        },
        {
          label: '貸方科目',
          type: 'dropdown',
          name: 'credit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '貸方金額',
          type: 'number',
          name: 'credit_amount',
          required: true,
          format: 'currency'
        }
      ]
    }),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '仕入',
        debit_amount: 200000,
        credit_account: '現金',
        credit_amount: 200000
      }
    }),
    explanation: '商品を仕入れたときは「仕入」勘定で処理します。現金で支払っているので、現金が減少します。',
    difficulty: 1,
    tags_json: JSON.stringify(['基本仕訳', '商品売買', '現金取引'])
  },
  {
    id: 'Q_J_002',
    category_id: 'journal',
    question_text: '商品300,000円を売り上げ、代金は掛けとした。',
    answer_template_json: JSON.stringify({
      type: 'journal_entry',
      fields: [
        {
          label: '借方科目',
          type: 'dropdown',
          name: 'debit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '借方金額',
          type: 'number',
          name: 'debit_amount',
          required: true,
          format: 'currency'
        },
        {
          label: '貸方科目',
          type: 'dropdown',
          name: 'credit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '貸方金額',
          type: 'number',
          name: 'credit_amount',
          required: true,
          format: 'currency'
        }
      ]
    }),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '売掛金',
        debit_amount: 300000,
        credit_account: '売上',
        credit_amount: 300000
      }
    }),
    explanation: '商品を販売したときは「売上」勘定に記録します。代金が掛けの場合は「売掛金」勘定を使用します。',
    difficulty: 1,
    tags_json: JSON.stringify(['基本仕訳', '商品売買', '掛取引'])
  },
  {
    id: 'Q_J_003',
    category_id: 'journal',
    question_text: '売掛金150,000円を現金で回収した。',
    answer_template_json: JSON.stringify({
      type: 'journal_entry',
      fields: [
        {
          label: '借方科目',
          type: 'dropdown',
          name: 'debit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '借方金額',
          type: 'number',
          name: 'debit_amount',
          required: true,
          format: 'currency'
        },
        {
          label: '貸方科目',
          type: 'dropdown',
          name: 'credit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形']
        },
        {
          label: '貸方金額',
          type: 'number',
          name: 'credit_amount',
          required: true,
          format: 'currency'
        }
      ]
    }),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '現金',
        debit_amount: 150000,
        credit_account: '売掛金',
        credit_amount: 150000
      }
    }),
    explanation: '売掛金を現金で回収したときは、現金が増加し、売掛金が減少します。',
    difficulty: 1,
    tags_json: JSON.stringify(['債権回収', '現金取引'])
  },
  {
    id: 'Q_L_001',
    category_id: 'ledger',
    question_text: '以下の取引を現金出納帳に記入してください。\n4月1日 商品100,000円を現金で仕入れた。\n4月3日 売上200,000円を現金で受け取った。\n4月1日の現金残高は50,000円でした。',
    answer_template_json: JSON.stringify({
      type: 'ledger_entry',
      fields: [
        {
          label: '4月3日残高',
          type: 'number',
          name: 'april_3_balance',
          required: true,
          format: 'currency'
        }
      ]
    }),
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          { account: '現金残高', amount: 150000 }
        ]
      }
    }),
    explanation: '現金出納帳では、期首残高50,000円から仕入で100,000円減少（残高-50,000円）、その後売上で200,000円増加して最終残高150,000円となります。',
    difficulty: 2,
    tags_json: JSON.stringify(['現金出納帳', '残高計算'])
  },
  {
    id: 'Q_T_001',
    category_id: 'trial_balance',
    question_text: '以下の残高から試算表を作成してください。\n現金: 100,000円\n売掛金: 200,000円\n商品: 150,000円\n買掛金: 80,000円\n資本金: 370,000円\n\n借方合計を求めてください。',
    answer_template_json: JSON.stringify({
      type: 'trial_balance',
      fields: [
        {
          label: '借方合計',
          type: 'number',
          name: 'debit_total',
          required: true,
          format: 'currency'
        }
      ]
    }),
    correct_answer_json: JSON.stringify({
      trialBalance: {
        balances: {
          debit_total: 450000
        }
      }
    }),
    explanation: '借方科目（現金100,000円 + 売掛金200,000円 + 商品150,000円）の合計は450,000円です。試算表では借方合計と貸方合計が一致する必要があります。',
    difficulty: 2,
    tags_json: JSON.stringify(['試算表作成', '残高試算表'])
  }
];

/**
 * サンプル問題データを挿入
 */
async function insertSampleQuestions() {
  const db = new Database(':memory:'); // メモリ内データベースを使用
  
  try {
    console.log('🗄️  データベース初期化中...');
    
    // 外部キー制約を有効化
    await runSQL(db, 'PRAGMA foreign_keys = ON');
    
    // テーブル作成（簡略版）
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
    
    await runSQL(db, `
      CREATE TABLE questions (
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
      )
    `);
    
    // カテゴリ初期データ投入
    await runSQL(db, `
      INSERT INTO categories (id, name, description, sort_order, total_questions) VALUES
        ('journal', '仕訳', '基本的な仕訳問題（25パターン×10問）', 1, 250),
        ('ledger', '帳簿', '元帳・補助簿に関する問題（4種類×10問）', 2, 40),
        ('trial_balance', '試算表', '試算表作成・修正に関する問題（3パターン×4問）', 3, 12)
    `);
    
    console.log('📝 サンプル問題データ挿入開始...');
    
    // サンプル問題データを挿入
    for (const question of sampleQuestions) {
      const sql = `
        INSERT INTO questions (
          id, 
          category_id, 
          question_text, 
          answer_template_json, 
          correct_answer_json, 
          explanation, 
          difficulty, 
          tags_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        question.id,
        question.category_id,
        question.question_text,
        question.answer_template_json,
        question.correct_answer_json,
        question.explanation,
        question.difficulty,
        question.tags_json
      ];
      
      await runSQL(db, sql, params);
      console.log(`✅ 問題 ${question.id} (${question.category_id}) を挿入しました`);
    }
    
    // データ確認
    const result = await getAllRows(db, `
      SELECT 
        id, 
        category_id, 
        SUBSTR(question_text, 1, 30) as question_preview,
        difficulty
      FROM questions 
      WHERE id LIKE 'Q_%' 
      ORDER BY category_id, id
    `);
    
    console.log('\n📊 挿入完了データ確認:');
    console.table(result);
    
    // カテゴリ別集計
    const categoryResult = await getAllRows(db, `
      SELECT 
        category_id, 
        COUNT(*) as question_count,
        AVG(difficulty) as avg_difficulty
      FROM questions 
      WHERE id LIKE 'Q_%'
      GROUP BY category_id
    `);
    
    console.log('\n📈 カテゴリ別統計:');
    console.table(categoryResult);
    
    console.log('\n🎉 サンプル問題データ挿入が完了しました！');
    
    return result;
    
  } catch (error) {
    console.error('❌ サンプル問題データ挿入中にエラーが発生しました:', error);
    throw error;
  } finally {
    db.close();
  }
}

/**
 * データベース接続テスト
 */
async function testDatabaseConnection() {
  const db = new Database(':memory:');
  
  try {
    console.log('🔍 データベース接続テスト中...');
    
    // シンプルなテストクエリ
    await runSQL(db, 'SELECT 1');
    console.log('✅ データベース接続テスト成功');
    
    return true;
  } catch (error) {
    console.error('❌ データベース接続テストに失敗しました:', error);
    return false;
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

/**
 * メイン実行
 */
async function main() {
  try {
    console.log('🚀 Step 2.1.1: サンプル問題データ挿入スクリプト実行開始\n');
    
    // データベース接続テスト
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.error('❌ データベース接続に失敗しました。処理を中止します。');
      return;
    }
    
    // サンプル問題データ挿入
    await insertSampleQuestions();
    
    console.log('\n✨ Step 2.1.1完了: 問題データモデル確認・サンプルデータ作成が完了しました');
    
  } catch (error) {
    console.error('\n💥 実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// CommonJS環境での実行
if (require.main === module) {
  main();
}

module.exports = { insertSampleQuestions, testDatabaseConnection };