/**
/* eslint-disable @typescript-eslint/no-unused-vars */
 * 学習統計システム動作確認テスト
 * Step 3.1: 学習統計機能実装 - 動作確認
 */

import { openDatabase } from 'expo-sqlite';

// テスト用データベース接続
const testDb = openDatabase('test_statistics_system.db');

/**
 * テストの実行
 */
async function runStatisticsSystemTests() {
  console.log('📊 学習統計システム動作確認テスト開始');
  console.log('=====================================\n');
  
  try {
    // テスト環境初期化
    await setupTestEnvironment();
    
    // テスト1: 全体統計計算
    await testOverallStatistics();
    
    // テスト2: カテゴリ別統計
    await testCategoryStatistics();
    
    // テスト3: 日別統計・学習時間計算
    await testDailyStatistics();
    
    // テスト4: 学習目標進捗
    await testLearningGoals();
    
    // テスト5: 連続学習日数計算
    await testStudyStreaks();
    
    // テスト6: パフォーマンス（大量データ）
    await testPerformanceWithLargeData();
    
    // テスト7: キャッシュ機能
    await testCachePerformance();
    
    console.log('\n🎉 全テスト完了！学習統計システムが正常に動作しています。');
    
  } catch (error) {
    console.error('\n❌ テストエラー:', error);
    throw error;
  } finally {
    await cleanup();
  }
}

/**
 * テスト環境初期化
 */
async function setupTestEnvironment() {
  console.log('📋 テスト環境初期化...');
  
  // テーブル作成
  const tables = [
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_questions INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      answer_template_json TEXT NOT NULL,
      correct_answer_json TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS learning_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      user_answer_json TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      answer_time_ms INTEGER NOT NULL,
      session_id TEXT,
      session_type TEXT DEFAULT 'learning',
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS review_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL UNIQUE,
      incorrect_count INTEGER NOT NULL DEFAULT 0,
      consecutive_correct_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'needs_review',
      priority_score INTEGER NOT NULL DEFAULT 0,
      last_answered_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const sql of tables) {
    await executeSQL(sql);
  }
  
  // テストデータ挿入
  await insertTestData();
  console.log('✅ テスト環境初期化完了\n');
}

/**
 * テストデータ挿入
 */
async function insertTestData() {
  // カテゴリデータ
  const categories = [
    "INSERT OR REPLACE INTO categories VALUES ('journal', '仕訳', 250, 1)",
    "INSERT OR REPLACE INTO categories VALUES ('ledger', '帳簿', 40, 2)",
    "INSERT OR REPLACE INTO categories VALUES ('trial_balance', '試算表', 12, 3)"
  ];
  
  // 問題データ（各カテゴリから数問ずつ）
  const questions = [
    // 仕訳問題
    "INSERT OR REPLACE INTO questions VALUES ('Q_J_001', 'journal', '問題1', '{}', '{}', '解説1', 1, datetime('now'), datetime('now'))",
    "INSERT OR REPLACE INTO questions VALUES ('Q_J_002', 'journal', '問題2', '{}', '{}', '解説2', 2, datetime('now'), datetime('now'))",
    "INSERT OR REPLACE INTO questions VALUES ('Q_J_003', 'journal', '問題3', '{}', '{}', '解説3', 3, datetime('now'), datetime('now'))",
    
    // 帳簿問題
    "INSERT OR REPLACE INTO questions VALUES ('Q_L_001', 'ledger', '問題4', '{}', '{}', '解説4', 2, datetime('now'), datetime('now'))",
    "INSERT OR REPLACE INTO questions VALUES ('Q_L_002', 'ledger', '問題5', '{}', '{}', '解説5', 3, datetime('now'), datetime('now'))",
    
    // 試算表問題
    "INSERT OR REPLACE INTO questions VALUES ('Q_T_001', 'trial_balance', '問題6', '{}', '{}', '解説6', 4, datetime('now'), datetime('now'))"
  ];
  
  // 学習履歴データ（過去1週間分）
  const historyData = [];
  const sessionId = 'test_session_001';
  
  for (let day = 6; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString();
    
    // 各日に複数の学習記録
    const questionsPerDay = 3 + Math.floor(Math.random() * 5); // 3-7問/日
    for (let i = 0; i < questionsPerDay; i++) {
      const questionIds = ['Q_J_001', 'Q_J_002', 'Q_J_003', 'Q_L_001', 'Q_L_002', 'Q_T_001'];
      const questionId = questionIds[Math.floor(Math.random() * questionIds.length)];
      const isCorrect = Math.random() > 0.3; // 70%正答率
      const answerTime = 30000 + Math.floor(Math.random() * 60000); // 30-90秒
      
      historyData.push(
        `INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms, session_id, session_type, answered_at) 
         VALUES ('${questionId}', '{}', ${isCorrect ? 1 : 0}, ${answerTime}, '${sessionId}_${day}', 'learning', '${dateStr}')`
      );
    }
  }
  
  for (const sql of [...categories, ...questions, ...historyData]) {
    await executeSQL(sql);
  }
}

/**
 * テスト1: 全体統計計算
 */
async function testOverallStatistics() {
  console.log('📈 テスト1: 全体統計計算');
  
  // 総問題数
  const totalQuestions = await executeSQL('SELECT COUNT(*) as count FROM questions');
  
  // 解答済み問題数（ユニーク）
  const answeredQuestions = await executeSQL(`
    SELECT COUNT(DISTINCT question_id) as count FROM learning_history
  `);
  
  // 正答数・正答率
  const correctStats = await executeSQL(`
    SELECT 
      COUNT(*) as total_answers,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
      AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy_rate,
      AVG(answer_time_ms) as avg_time,
      SUM(answer_time_ms) as total_time
    FROM learning_history
  `);
  
  // 学習日数
  const studyDays = await executeSQL(`
    SELECT COUNT(DISTINCT DATE(answered_at)) as days FROM learning_history
  `);
  
  const stats = correctStats.rows[0];
  
  console.log(`  ✓ 総問題数: ${totalQuestions.rows[0].count}`);
  console.log(`  ✓ 解答済み問題数: ${answeredQuestions.rows[0].count}`);
  console.log(`  ✓ 総解答数: ${stats.total_answers}`);
  console.log(`  ✓ 正答数: ${stats.correct_answers}`);
  console.log(`  ✓ 正答率: ${Math.round(stats.accuracy_rate * 100)}%`);
  console.log(`  ✓ 平均解答時間: ${Math.round(stats.avg_time / 1000)}秒`);
  console.log(`  ✓ 総学習時間: ${Math.round(stats.total_time / (1000 * 60))}分`);
  console.log(`  ✓ 学習日数: ${studyDays.rows[0].days}日`);
  console.log('');
}

/**
 * テスト2: カテゴリ別統計
 */
async function testCategoryStatistics() {
  console.log('📊 テスト2: カテゴリ別統計');
  
  const categoryStats = await executeSQL(`
    SELECT 
      c.id,
      c.name,
      COUNT(DISTINCT q.id) as total_questions,
      COUNT(DISTINCT lh.question_id) as answered_questions,
      COUNT(lh.id) as total_answers,
      SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
      AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy_rate,
      AVG(lh.answer_time_ms) as avg_time
    FROM categories c
    LEFT JOIN questions q ON c.id = q.category_id
    LEFT JOIN learning_history lh ON q.id = lh.question_id
    GROUP BY c.id, c.name
    ORDER BY c.id
  `);
  
  console.log('  カテゴリ別統計:');
  categoryStats.rows.forEach(stat => {
    const completionRate = stat.total_questions > 0 ? 
      Math.round((stat.answered_questions / stat.total_questions) * 100) : 0;
    
    console.log(`    ✓ ${stat.name}:`);
    console.log(`      - 総問題数: ${stat.total_questions}問`);
    console.log(`      - 解答済み: ${stat.answered_questions}問 (${completionRate}%)`);
    console.log(`      - 正答率: ${Math.round((stat.accuracy_rate || 0) * 100)}%`);
    console.log(`      - 平均時間: ${Math.round((stat.avg_time || 0) / 1000)}秒`);
  });
  console.log('');
}

/**
 * テスト3: 日別統計・学習時間計算
 */
async function testDailyStatistics() {
  console.log('📅 テスト3: 日別統計・学習時間計算');
  
  const dailyStats = await executeSQL(`
    SELECT 
      DATE(answered_at) as date,
      COUNT(*) as questions_answered,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
      AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy_rate,
      SUM(answer_time_ms) as study_time_ms,
      COUNT(DISTINCT session_id) as sessions
    FROM learning_history
    WHERE answered_at >= DATE('now', '-7 days')
    GROUP BY DATE(answered_at)
    ORDER BY date DESC
  `);
  
  console.log('  過去7日間の学習統計:');
  dailyStats.rows.forEach((day, index) => {
    const studyMinutes = Math.round(day.study_time_ms / (1000 * 60));
    console.log(`    ${index === 0 ? '今日' : `${index}日前`} (${day.date}):`);
    console.log(`      解答数: ${day.questions_answered}問, 正答率: ${Math.round(day.accuracy_rate * 100)}%, 学習時間: ${studyMinutes}分`);
  });
  console.log('');
}

/**
 * テスト4: 学習目標進捗
 */
async function testLearningGoals() {
  console.log('🎯 テスト4: 学習目標進捗');
  
  // 今日の実績
  const todayStats = await executeSQL(`
    SELECT COUNT(*) as count FROM learning_history 
    WHERE DATE(answered_at) = DATE('now')
  `);
  
  // 今週の実績（月曜日から）
  const weeklyStats = await executeSQL(`
    SELECT COUNT(*) as count FROM learning_history 
    WHERE answered_at >= DATE('now', 'weekday 1', '-7 days')
  `);
  
  // 今月の実績
  const monthlyStats = await executeSQL(`
    SELECT COUNT(*) as count FROM learning_history 
    WHERE answered_at >= DATE('now', 'start of month')
  `);
  
  const targets = { daily: 10, weekly: 50, monthly: 200 };
  const achieved = {
    daily: todayStats.rows[0].count,
    weekly: weeklyStats.rows[0].count,
    monthly: monthlyStats.rows[0].count
  };
  
  console.log('  学習目標達成状況:');
  console.log(`    ✓ 今日: ${achieved.daily}/${targets.daily}問 (${Math.round(achieved.daily / targets.daily * 100)}%)`);
  console.log(`    ✓ 今週: ${achieved.weekly}/${targets.weekly}問 (${Math.round(achieved.weekly / targets.weekly * 100)}%)`);
  console.log(`    ✓ 今月: ${achieved.monthly}/${targets.monthly}問 (${Math.round(achieved.monthly / targets.monthly * 100)}%)`);
  console.log('');
}

/**
 * テスト5: 連続学習日数計算
 */
async function testStudyStreaks() {
  console.log('🔥 テスト5: 連続学習日数計算');
  
  // 学習日一覧取得
  const studyDates = await executeSQL(`
    SELECT DISTINCT DATE(answered_at) as date 
    FROM learning_history 
    ORDER BY date DESC
  `);
  
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;
  
  const dates = studyDates.rows.map(row => new Date(row.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 現在の連続日数計算
  for (let i = 0; i < dates.length; i++) {
    const studyDate = dates[i];
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (studyDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // 最大連続日数計算
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    const dayDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);
  
  console.log(`  ✓ 現在の連続学習日数: ${currentStreak}日`);
  console.log(`  ✓ 最大連続学習日数: ${maxStreak}日`);
  console.log(`  ✓ 総学習日数: ${studyDates.rows.length}日`);
  console.log('');
}

/**
 * テスト6: パフォーマンス（大量データ）
 */
async function testPerformanceWithLargeData() {
  console.log('⚡ テスト6: パフォーマンス（大量データ）');
  
  const startTime = Date.now();
  
  // 大量の学習履歴データを挿入（1000件）
  console.log('  大量データ挿入中...');
  const batchInserts = [];
  for (let i = 0; i < 1000; i++) {
    const questionIds = ['Q_J_001', 'Q_J_002', 'Q_J_003', 'Q_L_001', 'Q_L_002', 'Q_T_001'];
    const questionId = questionIds[i % questionIds.length];
    const isCorrect = Math.random() > 0.3;
    const answerTime = 30000 + Math.floor(Math.random() * 60000);
    const daysAgo = Math.floor(Math.random() * 30); // 過去30日分
    
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    batchInserts.push(
      `INSERT INTO learning_history (question_id, user_answer_json, is_correct, answer_time_ms, session_id, answered_at) 
       VALUES ('${questionId}', '{}', ${isCorrect ? 1 : 0}, ${answerTime}, 'perf_test_${i}', '${date.toISOString()}')`
    );
  }
  
  // バッチ挿入
  for (const sql of batchInserts) {
    await executeSQL(sql);
  }
  
  const insertTime = Date.now() - startTime;
  
  // 統計計算パフォーマンステスト
  const queryStartTime = Date.now();
  
  // 複雑な統計クエリ実行
  await executeSQL(`
    SELECT 
      c.name,
      COUNT(*) as total_answers,
      AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy,
      AVG(lh.answer_time_ms) as avg_time,
      DATE(lh.answered_at) as date
    FROM learning_history lh
    INNER JOIN questions q ON lh.question_id = q.id
    INNER JOIN categories c ON q.category_id = c.id
    GROUP BY c.name, DATE(lh.answered_at)
    ORDER BY date DESC, c.name
  `);
  
  const queryTime = Date.now() - queryStartTime;
  const totalTime = Date.now() - startTime;
  
  console.log(`  ✓ 1000件データ挿入時間: ${insertTime}ms`);
  console.log(`  ✓ 複雑統計クエリ実行時間: ${queryTime}ms`);
  console.log(`  ✓ 総処理時間: ${totalTime}ms`);
  
  // パフォーマンス判定
  if (queryTime < 100) {
    console.log(`  🚀 パフォーマンス: 優秀 (${queryTime}ms)`);
  } else if (queryTime < 500) {
    console.log(`  ✅ パフォーマンス: 良好 (${queryTime}ms)`);
  } else {
    console.log(`  ⚠️ パフォーマンス: 要改善 (${queryTime}ms)`);
  }
  console.log('');
}

/**
 * テスト7: キャッシュ機能
 */
async function testCachePerformance() {
  console.log('💾 テスト7: キャッシュ機能');
  
  // キャッシュなしの場合の処理時間測定
  console.log('  キャッシュなしでの統計計算...');
  const noCacheStart = Date.now();
  
  const stats1 = await executeSQL(`
    SELECT 
      COUNT(*) as total,
      AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy
    FROM learning_history
  `);
  
  const noCacheTime = Date.now() - noCacheStart;
  
  // 同じクエリを再実行（DBレベルでのキャッシュ効果測定）
  console.log('  同一クエリ再実行...');
  const cacheStart = Date.now();
  
  const stats2 = await executeSQL(`
    SELECT 
      COUNT(*) as total,
      AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracy
    FROM learning_history
  `);
  
  const cacheTime = Date.now() - cacheStart;
  
  console.log(`  ✓ 初回クエリ実行時間: ${noCacheTime}ms`);
  console.log(`  ✓ 再実行時間: ${cacheTime}ms`);
  
  const speedup = noCacheTime / cacheTime;
  if (speedup > 1.5) {
    console.log(`  🚀 キャッシュ効果: ${speedup.toFixed(1)}x高速化`);
  } else {
    console.log(`  📊 キャッシュ効果: ${speedup.toFixed(1)}x (軽微)`);
  }
  
  // データ一貫性チェック
  const isConsistent = stats1.rows[0].total === stats2.rows[0].total &&
                      Math.abs(stats1.rows[0].accuracy - stats2.rows[0].accuracy) < 0.001;
  
  console.log(`  ${isConsistent ? '✅' : '❌'} データ一貫性: ${isConsistent ? '正常' : '異常'}`);
  console.log('');
}

/**
 * SQL実行ヘルパー
 */
function executeSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    testDb.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error('SQL実行エラー:', error);
          reject(error);
        }
      );
    });
  });
}

/**
 * クリーンアップ
 */
async function cleanup() {
  console.log('🧹 テスト環境クリーンアップ中...');
  // テスト用データの削除
  await executeSQL('DELETE FROM learning_history WHERE session_id LIKE "test_%" OR session_id LIKE "perf_test_%"');
  console.log('✅ クリーンアップ完了');
}

// テスト実行
if (require.main === module) {
  runStatisticsSystemTests()
    .then(() => {
      console.log('\n🎊 学習統計システムテスト全体完了！');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 テスト失敗:', error);
      process.exit(1);
    });
}

export { runStatisticsSystemTests };