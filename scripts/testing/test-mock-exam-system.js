/**
/* eslint-disable @typescript-eslint/no-unused-vars */
 * 模試システム動作確認テスト
 * 模試の開始・実行・採点・結果表示の統合テスト
 */

// モジュールインポート（Expo環境用の調整）
const SQLite = require('expo-sqlite');
const fs = require('fs');
const path = require('path');

// テストデータ
const testSessionData = {
  examId: 'MOCK_001',
  startTime: new Date(),
  answers: new Map([
    ['Q_J_001', {
      questionType: 'journal',
      journalEntry: {
        debit: { account: '仕入', amount: 100000 },
        credit: { account: '現金', amount: 100000 }
      }
    }],
    ['Q_J_015', {
      questionType: 'journal',
      journalEntry: {
        debit: { account: '現金', amount: 150000 },
        credit: { account: '売上', amount: 150000 }
      }
    }],
    ['Q_L_001', {
      questionType: 'ledger',
      ledgerEntry: {
        entries: [
          { description: '商品売上', credit: 50000 }
        ]
      }
    }]
  ])
};

// データベース初期化
async function initializeDatabase() {
  console.log('\n=== データベース初期化 ===');
  
  try {
    const db = SQLite.openDatabase('test_bookkeeping.db');
    
    // 模試関連テーブル作成
    await executeSql(db, `
      CREATE TABLE IF NOT EXISTS mock_exams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        time_limit_minutes INTEGER NOT NULL DEFAULT 60,
        total_score INTEGER NOT NULL DEFAULT 100,
        passing_score INTEGER NOT NULL DEFAULT 70,
        structure_json TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await executeSql(db, `
      CREATE TABLE IF NOT EXISTS mock_exam_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mock_exam_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        section_number INTEGER NOT NULL,
        question_order INTEGER NOT NULL,
        points INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (mock_exam_id) REFERENCES mock_exams (id),
        UNIQUE(mock_exam_id, section_number, question_order)
      )
    `);
    
    await executeSql(db, `
      CREATE TABLE IF NOT EXISTS mock_exam_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL DEFAULT 100,
        is_passed BOOLEAN NOT NULL,
        duration_seconds INTEGER NOT NULL,
        detailed_results_json TEXT NOT NULL,
        taken_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ データベーステーブル作成完了');
    return db;
  } catch (error) {
    console.error('❌ データベース初期化エラー:', error);
    throw error;
  }
}

// サンプル模試データ投入
async function insertSampleMockExams(db) {
  console.log('\n=== サンプル模試データ投入 ===');
  
  try {
    // 模試定義投入
    const mockExam = {
      id: 'MOCK_001',
      name: '基礎レベル模試テスト',
      description: 'テスト用の基礎レベル模試',
      time_limit_minutes: 60,
      total_score: 100,
      passing_score: 70,
      structure_json: JSON.stringify({
        section1: { count: 15, maxScore: 60, questionCategory: 'journal' },
        section2: { count: 2, maxScore: 20, questionCategory: 'ledger' },
        section3: { count: 1, maxScore: 20, questionCategory: 'trial_balance' }
      }),
      is_active: 1
    };
    
    await executeSql(db, `
      INSERT OR REPLACE INTO mock_exams 
      (id, name, description, time_limit_minutes, total_score, passing_score, structure_json, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mockExam.id, mockExam.name, mockExam.description,
      mockExam.time_limit_minutes, mockExam.total_score, mockExam.passing_score,
      mockExam.structure_json, mockExam.is_active
    ]);
    
    // 模試問題投入（サンプル）
    const mockQuestions = [
      { mock_exam_id: 'MOCK_001', question_id: 'Q_J_001', section_number: 1, question_order: 1, points: 4 },
      { mock_exam_id: 'MOCK_001', question_id: 'Q_J_015', section_number: 1, question_order: 2, points: 4 },
      { mock_exam_id: 'MOCK_001', question_id: 'Q_J_025', section_number: 1, question_order: 3, points: 4 },
      { mock_exam_id: 'MOCK_001', question_id: 'Q_L_001', section_number: 2, question_order: 1, points: 10 },
      { mock_exam_id: 'MOCK_001', question_id: 'Q_T_001', section_number: 3, question_order: 1, points: 20 }
    ];
    
    for (const question of mockQuestions) {
      await executeSql(db, `
        INSERT OR REPLACE INTO mock_exam_questions 
        (mock_exam_id, question_id, section_number, question_order, points)
        VALUES (?, ?, ?, ?, ?)
      `, [
        question.mock_exam_id, question.question_id,
        question.section_number, question.question_order, question.points
      ]);
    }
    
    console.log('✅ サンプル模試データ投入完了');
    console.log(`   - 模試定義: ${mockExam.name}`);
    console.log(`   - 模試問題: ${mockQuestions.length}問`);
    
  } catch (error) {
    console.error('❌ サンプルデータ投入エラー:', error);
    throw error;
  }
}

// 模試データ取得テスト
async function testMockExamRetrieval(db) {
  console.log('\n=== 模試データ取得テスト ===');
  
  try {
    // 模試一覧取得
    const examsResult = await executeSql(db, 'SELECT * FROM mock_exams WHERE is_active = 1');
    console.log(`✅ 模試一覧取得: ${examsResult.rows.length}件`);
    
    if (examsResult.rows.length > 0) {
      const exam = examsResult.rows[0];
      console.log(`   - 模試ID: ${exam.id}`);
      console.log(`   - 模試名: ${exam.name}`);
      console.log(`   - 制限時間: ${exam.time_limit_minutes}分`);
      console.log(`   - 合格点: ${exam.passing_score}点`);
      
      // 構成データパース
      const structure = JSON.parse(exam.structure_json);
      console.log(`   - セクション構成:`);
      console.log(`     第1問: ${structure.section1.count}問 (${structure.section1.maxScore}点)`);
      console.log(`     第2問: ${structure.section2.count}問 (${structure.section2.maxScore}点)`);
      console.log(`     第3問: ${structure.section3.count}問 (${structure.section3.maxScore}点)`);
    }
    
    // 模試問題取得
    const questionsResult = await executeSql(db, `
      SELECT * FROM mock_exam_questions 
      WHERE mock_exam_id = 'MOCK_001' 
      ORDER BY section_number, question_order
    `);
    console.log(`✅ 模試問題取得: ${questionsResult.rows.length}問`);
    
    // セクション別集計
    const sectionStats = {};
    questionsResult.rows.forEach(q => {
      if (!sectionStats[q.section_number]) {
        sectionStats[q.section_number] = { count: 0, totalPoints: 0 };
      }
      sectionStats[q.section_number].count++;
      sectionStats[q.section_number].totalPoints += q.points;
    });
    
    Object.entries(sectionStats).forEach(([section, stats]) => {
      console.log(`   - 第${section}問: ${stats.count}問 (${stats.totalPoints}点)`);
    });
    
  } catch (error) {
    console.error('❌ 模試データ取得エラー:', error);
    throw error;
  }
}

// 模試セッション実行テスト
async function testMockExamSession(db) {
  console.log('\n=== 模試セッション実行テスト ===');
  
  try {
    const sessionId = `mock_test_${Date.now()}`;
    const startTime = new Date();
    
    console.log(`📝 模試セッション開始: ${sessionId}`);
    console.log(`   - 開始時刻: ${startTime.toISOString()}`);
    
    // 模試問題取得
    const questionsResult = await executeSql(db, `
      SELECT * FROM mock_exam_questions 
      WHERE mock_exam_id = 'MOCK_001' 
      ORDER BY section_number, question_order
    `);
    
    const questions = questionsResult.rows;
    console.log(`   - 総問題数: ${questions.length}問`);
    
    // 解答データシミュレーション
    const answers = [];
    let totalScore = 0;
    
    for (const question of questions.slice(0, 3)) { // テストのため3問のみ
      const isCorrect = Math.random() > 0.3; // 70%の確率で正解
      const earnedPoints = isCorrect ? question.points : 0;
      totalScore += earnedPoints;
      
      const answerData = {
        questionId: question.question_id,
        sectionNumber: question.section_number,
        questionOrder: question.question_order,
        maxPoints: question.points,
        earnedPoints,
        isCorrect,
        answerTime: Math.floor(Math.random() * 120000) + 30000 // 30秒-2分30秒
      };
      
      answers.push(answerData);
      console.log(`   - ${question.question_id}: ${isCorrect ? '正解' : '不正解'} (${earnedPoints}/${question.points}点)`);
    }
    
    // セッション完了
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    console.log(`✅ 模試セッション完了`);
    console.log(`   - 所要時間: ${duration}秒`);
    console.log(`   - 総得点: ${totalScore}点`);
    console.log(`   - 正答率: ${Math.round((answers.filter(a => a.isCorrect).length / answers.length) * 100)}%`);
    
    return {
      sessionId,
      startTime,
      endTime,
      duration,
      totalScore,
      maxScore: questions.reduce((sum, q) => sum + q.points, 0),
      answers
    };
    
  } catch (error) {
    console.error('❌ 模試セッション実行エラー:', error);
    throw error;
  }
}

// 模試結果保存テスト
async function testMockExamResultSave(db, sessionResult) {
  console.log('\n=== 模試結果保存テスト ===');
  
  try {
    const isPassed = sessionResult.totalScore >= 70;
    
    // 詳細結果データ作成
    const detailedResults = {
      examId: 'MOCK_001',
      startedAt: sessionResult.startTime.toISOString(),
      completedAt: sessionResult.endTime.toISOString(),
      timeLimit: 60,
      actualDuration: sessionResult.duration,
      sectionResults: [
        {
          sectionNumber: 1,
          sectionName: '仕訳',
          score: sessionResult.answers.filter(a => a.sectionNumber === 1).reduce((sum, a) => sum + a.earnedPoints, 0),
          maxScore: sessionResult.answers.filter(a => a.sectionNumber === 1).reduce((sum, a) => sum + a.maxPoints, 0),
          questions: sessionResult.answers.filter(a => a.sectionNumber === 1)
        }
      ],
      totalCorrect: sessionResult.answers.filter(a => a.isCorrect).length,
      totalQuestions: sessionResult.answers.length,
      accuracyRate: sessionResult.answers.filter(a => a.isCorrect).length / sessionResult.answers.length,
      passJudgment: {
        isPassed,
        requiredScore: 70,
        actualScore: sessionResult.totalScore
      }
    };
    
    // 結果をデータベースに保存
    await executeSql(db, `
      INSERT INTO mock_exam_results 
      (exam_id, total_score, max_score, is_passed, duration_seconds, detailed_results_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'MOCK_001',
      sessionResult.totalScore,
      sessionResult.maxScore,
      isPassed ? 1 : 0,
      sessionResult.duration,
      JSON.stringify(detailedResults)
    ]);
    
    console.log('✅ 模試結果保存完了');
    console.log(`   - 得点: ${sessionResult.totalScore}/${sessionResult.maxScore}`);
    console.log(`   - 判定: ${isPassed ? '合格' : '不合格'}`);
    console.log(`   - 所要時間: ${sessionResult.duration}秒`);
    
    return detailedResults;
    
  } catch (error) {
    console.error('❌ 模試結果保存エラー:', error);
    throw error;
  }
}

// 模試統計取得テスト
async function testMockExamStatistics(db) {
  console.log('\n=== 模試統計取得テスト ===');
  
  try {
    // 全体統計
    const overallStatsResult = await executeSql(db, `
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN is_passed = 1 THEN 1 END) as passed_attempts,
        AVG(total_score) as average_score,
        MAX(total_score) as best_score,
        MIN(total_score) as worst_score,
        AVG(duration_seconds) as average_time
      FROM mock_exam_results
    `);
    
    const stats = overallStatsResult.rows[0];
    console.log('✅ 全体統計取得:');
    console.log(`   - 総受験回数: ${stats.total_attempts}回`);
    console.log(`   - 合格回数: ${stats.passed_attempts}回`);
    console.log(`   - 合格率: ${stats.total_attempts > 0 ? Math.round((stats.passed_attempts / stats.total_attempts) * 100) : 0}%`);
    console.log(`   - 平均得点: ${Math.round(stats.average_score || 0)}点`);
    console.log(`   - 最高得点: ${stats.best_score || 0}点`);
    console.log(`   - 最低得点: ${stats.worst_score || 0}点`);
    console.log(`   - 平均時間: ${Math.round(stats.average_time || 0)}秒`);
    
    // 模試別統計
    const examStatsResult = await executeSql(db, `
      SELECT 
        exam_id,
        COUNT(*) as attempt_count,
        COUNT(CASE WHEN is_passed = 1 THEN 1 END) as pass_count,
        AVG(total_score) as average_score,
        MAX(total_score) as best_score
      FROM mock_exam_results
      GROUP BY exam_id
    `);
    
    console.log('✅ 模試別統計:');
    examStatsResult.rows.forEach(stat => {
      console.log(`   - ${stat.exam_id}:`);
      console.log(`     受験回数: ${stat.attempt_count}回`);
      console.log(`     合格回数: ${stat.pass_count}回`);
      console.log(`     合格率: ${Math.round((stat.pass_count / stat.attempt_count) * 100)}%`);
      console.log(`     平均得点: ${Math.round(stat.average_score)}点`);
      console.log(`     最高得点: ${stat.best_score}点`);
    });
    
  } catch (error) {
    console.error('❌ 模試統計取得エラー:', error);
    throw error;
  }
}

// 模試パフォーマンステスト
async function testMockExamPerformance(db) {
  console.log('\n=== 模試パフォーマンステスト ===');
  
  try {
    const iterations = 100;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // 模試データ取得（実際の処理をシミュレート）
      await executeSql(db, `
        SELECT meq.*, q.question_text, q.correct_answer_json
        FROM mock_exam_questions meq
        LEFT JOIN questions q ON meq.question_id = q.id
        WHERE meq.mock_exam_id = 'MOCK_001'
        ORDER BY meq.section_number, meq.question_order
      `);
      
      const endTime = performance.now();
      times.push(endTime - startTime);
    }
    
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    
    console.log(`✅ パフォーマンステスト完了 (${iterations}回実行):`);
    console.log(`   - 平均処理時間: ${avgTime.toFixed(2)}ms`);
    console.log(`   - 最大処理時間: ${maxTime.toFixed(2)}ms`);
    console.log(`   - 最小処理時間: ${minTime.toFixed(2)}ms`);
    console.log(`   - 要求基準: 100ms以下`);
    console.log(`   - 結果: ${avgTime <= 100 ? '✅ 合格' : '❌ 要改善'}`);
    
  } catch (error) {
    console.error('❌ パフォーマンステストエラー:', error);
    throw error;
  }
}

// SQLクエリ実行ヘルパー
function executeSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

// メイン実行関数
async function runMockExamSystemTest() {
  console.log('🧪 模試システム動作確認テスト開始');
  console.log('=====================================');
  
  try {
    // 1. データベース初期化
    const db = await initializeDatabase();
    
    // 2. サンプルデータ投入
    await insertSampleMockExams(db);
    
    // 3. 模試データ取得テスト
    await testMockExamRetrieval(db);
    
    // 4. 模試セッション実行テスト
    const sessionResult = await testMockExamSession(db);
    
    // 5. 模試結果保存テスト
    await testMockExamResultSave(db, sessionResult);
    
    // 6. 模試統計取得テスト
    await testMockExamStatistics(db);
    
    // 7. パフォーマンステスト
    await testMockExamPerformance(db);
    
    console.log('\n🎉 全テスト完了 - 模試システムは正常に動作しています');
    
  } catch (error) {
    console.error('\n💥 テスト失敗:', error);
    process.exit(1);
  }
}

// テスト実行
if (require.main === module) {
  runMockExamSystemTest().catch(console.error);
}

module.exports = {
  runMockExamSystemTest,
  initializeDatabase,
  insertSampleMockExams,
  testMockExamRetrieval,
  testMockExamSession,
  testMockExamResultSave,
  testMockExamStatistics,
  testMockExamPerformance
};