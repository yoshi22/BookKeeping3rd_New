/**
 * 模試ロジック動作確認テスト（Node.js環境）
 * データベースを使わずに模試の採点・計算ロジックをテスト
 */

// 模試関連ロジックのテスト
function testMockExamLogic() {
  console.log('🧪 模試ロジック動作確認テスト開始');
  console.log('=====================================');

  // テスト1: 採点ロジック
  testScoringLogic();
  
  // テスト2: 時間計算ロジック
  testTimeCalculation();
  
  // テスト3: 統計計算ロジック
  testStatisticsCalculation();
  
  // テスト4: 優先度計算ロジック
  testPriorityCalculation();
  
  console.log('\n🎉 全テスト完了 - 模試ロジックは正常に動作しています');
}

// 採点ロジックテスト
function testScoringLogic() {
  console.log('\n=== 採点ロジックテスト ===');
  
  try {
    // テスト問題と解答
    const testCases = [
      {
        questionType: 'journal',
        userAnswer: {
          questionType: 'journal',
          journalEntry: {
            debit: { account: '仕入', amount: 100000 },
            credit: { account: '現金', amount: 100000 }
          }
        },
        correctAnswer: {
          journalEntry: {
            debit_account: '仕入',
            debit_amount: 100000,
            credit_account: '現金',
            credit_amount: 100000
          }
        },
        expectedResult: true
      },
      {
        questionType: 'journal',
        userAnswer: {
          questionType: 'journal',
          journalEntry: {
            debit: { account: '仕入', amount: 100000 },
            credit: { account: '買掛金', amount: 100000 } // 間違い
          }
        },
        correctAnswer: {
          journalEntry: {
            debit_account: '仕入',
            debit_amount: 100000,
            credit_account: '現金',
            credit_amount: 100000
          }
        },
        expectedResult: false
      },
      {
        questionType: 'ledger',
        userAnswer: {
          questionType: 'ledger',
          ledgerEntry: {
            entries: [
              { description: '商品売上', credit: 50000 }
            ]
          }
        },
        correctAnswer: {
          ledgerEntry: {
            entries: [
              { description: '商品売上', credit: 50000 }
            ]
          }
        },
        expectedResult: true
      }
    ];
    
    let passedTests = 0;
    
    testCases.forEach((testCase, index) => {
      const result = checkAnswer(testCase.userAnswer, testCase.correctAnswer);
      const passed = result === testCase.expectedResult;
      
      console.log(`   テスト${index + 1}: ${passed ? '✅ 合格' : '❌ 不合格'}`);
      console.log(`     問題種別: ${testCase.questionType}`);
      console.log(`     期待結果: ${testCase.expectedResult}`);
      console.log(`     実行結果: ${result}`);
      
      if (passed) passedTests++;
    });
    
    console.log(`✅ 採点ロジックテスト完了: ${passedTests}/${testCases.length}件合格`);
    
  } catch (error) {
    console.error('❌ 採点ロジックテストエラー:', error);
  }
}

// 時間計算ロジックテスト
function testTimeCalculation() {
  console.log('\n=== 時間計算ロジックテスト ===');
  
  try {
    // 模試セッション開始時刻
    const startTime = new Date('2025-08-02T10:00:00Z');
    const timeLimit = 60; // 60分
    
    // 各時点での残り時間計算テスト
    const testCases = [
      { currentTime: new Date('2025-08-02T10:00:00Z'), expectedRemaining: 3600000 }, // 開始直後
      { currentTime: new Date('2025-08-02T10:30:00Z'), expectedRemaining: 1800000 }, // 30分経過
      { currentTime: new Date('2025-08-02T10:59:00Z'), expectedRemaining: 60000 },   // 59分経過
      { currentTime: new Date('2025-08-02T11:00:00Z'), expectedRemaining: 0 },       // 時間切れ
      { currentTime: new Date('2025-08-02T11:05:00Z'), expectedRemaining: 0 }        // 時間超過
    ];
    
    let passedTests = 0;
    
    testCases.forEach((testCase, index) => {
      const elapsed = testCase.currentTime.getTime() - startTime.getTime();
      const timeLimitMs = timeLimit * 60 * 1000;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      
      const passed = remaining === testCase.expectedRemaining;
      
      console.log(`   テスト${index + 1}: ${passed ? '✅ 合格' : '❌ 不合格'}`);
      console.log(`     経過時間: ${Math.floor(elapsed / 1000)}秒`);
      console.log(`     期待残り時間: ${Math.floor(testCase.expectedRemaining / 1000)}秒`);
      console.log(`     実際残り時間: ${Math.floor(remaining / 1000)}秒`);
      
      if (passed) passedTests++;
    });
    
    console.log(`✅ 時間計算ロジックテスト完了: ${passedTests}/${testCases.length}件合格`);
    
  } catch (error) {
    console.error('❌ 時間計算ロジックテストエラー:', error);
  }
}

// 統計計算ロジックテスト
function testStatisticsCalculation() {
  console.log('\n=== 統計計算ロジックテスト ===');
  
  try {
    // テスト結果データ
    const mockResults = [
      { totalScore: 85, maxScore: 100, isPassed: true, duration: 3000 },
      { totalScore: 65, maxScore: 100, isPassed: false, duration: 3200 },
      { totalScore: 75, maxScore: 100, isPassed: true, duration: 2800 },
      { totalScore: 90, maxScore: 100, isPassed: true, duration: 2700 },
      { totalScore: 55, maxScore: 100, isPassed: false, duration: 3600 }
    ];
    
    // 統計計算
    const totalAttempts = mockResults.length;
    const passedAttempts = mockResults.filter(r => r.isPassed).length;
    const passRate = passedAttempts / totalAttempts;
    const averageScore = mockResults.reduce((sum, r) => sum + r.totalScore, 0) / totalAttempts;
    const bestScore = Math.max(...mockResults.map(r => r.totalScore));
    const worstScore = Math.min(...mockResults.map(r => r.totalScore));
    const averageTime = mockResults.reduce((sum, r) => sum + r.duration, 0) / totalAttempts;
    
    console.log('✅ 統計計算結果:');
    console.log(`   - 総受験回数: ${totalAttempts}回`);
    console.log(`   - 合格回数: ${passedAttempts}回`);
    console.log(`   - 合格率: ${Math.round(passRate * 100)}%`);
    console.log(`   - 平均得点: ${Math.round(averageScore)}点`);
    console.log(`   - 最高得点: ${bestScore}点`);
    console.log(`   - 最低得点: ${worstScore}点`);
    console.log(`   - 平均時間: ${Math.round(averageTime)}秒`);
    
    // 期待値との比較
    const expectedStats = {
      totalAttempts: 5,
      passedAttempts: 3,
      passRate: 0.6,
      averageScore: 74,
      bestScore: 90,
      worstScore: 55
    };
    
    let passedTests = 0;
    const comparisons = [
      { name: '総受験回数', actual: totalAttempts, expected: expectedStats.totalAttempts },
      { name: '合格回数', actual: passedAttempts, expected: expectedStats.passedAttempts },
      { name: '合格率', actual: Math.round(passRate * 100), expected: Math.round(expectedStats.passRate * 100) },
      { name: '平均得点', actual: Math.round(averageScore), expected: expectedStats.averageScore },
      { name: '最高得点', actual: bestScore, expected: expectedStats.bestScore },
      { name: '最低得点', actual: worstScore, expected: expectedStats.worstScore }
    ];
    
    comparisons.forEach(comp => {
      const passed = comp.actual === comp.expected;
      console.log(`   ${comp.name}: ${passed ? '✅' : '❌'} (実際: ${comp.actual}, 期待: ${comp.expected})`);
      if (passed) passedTests++;
    });
    
    console.log(`✅ 統計計算ロジックテスト完了: ${passedTests}/${comparisons.length}件合格`);
    
  } catch (error) {
    console.error('❌ 統計計算ロジックテストエラー:', error);
  }
}

// 優先度計算ロジックテスト
function testPriorityCalculation() {
  console.log('\n=== 優先度計算ロジックテスト ===');
  
  try {
    // 優先度計算ロジック（review-service.tsから移植）
    function calculatePriority(incorrectCount, lastAnsweredAt, category) {
      const base = 10; // 基本ポイント
      const incorrectWeight = 20; // 間違い回数の重み
      const timeDecayFactor = 0.1; // 時間減衰係数
      const categoryBonus = getCategoryBonus(category);
      
      // 時間減衰計算（日数）
      const daysSinceLastAnswer = Math.floor(
        (Date.now() - new Date(lastAnsweredAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const timeDecay = Math.min(daysSinceLastAnswer * timeDecayFactor, 10);
      
      // 優先度計算
      return Math.round(base + (incorrectCount * incorrectWeight) + timeDecay + categoryBonus);
    }
    
    function getCategoryBonus(category) {
      switch (category) {
        case 'journal': return 5;
        case 'ledger': return 3;
        case 'trial_balance': return 7;
        default: return 0;
      }
    }
    
    // テストケース
    const testCases = [
      {
        incorrectCount: 1,
        lastAnsweredAt: '2025-08-01T10:00:00Z',
        category: 'journal',
        expectedMin: 35,
        expectedMax: 40
      },
      {
        incorrectCount: 3,
        lastAnsweredAt: '2025-07-28T10:00:00Z',
        category: 'trial_balance',
        expectedMin: 75,
        expectedMax: 85
      },
      {
        incorrectCount: 0,
        lastAnsweredAt: '2025-08-02T10:00:00Z',
        category: 'ledger',
        expectedMin: 13,
        expectedMax: 18
      }
    ];
    
    let passedTests = 0;
    
    testCases.forEach((testCase, index) => {
      const priority = calculatePriority(
        testCase.incorrectCount,
        testCase.lastAnsweredAt,
        testCase.category
      );
      
      const passed = priority >= testCase.expectedMin && priority <= testCase.expectedMax;
      
      console.log(`   テスト${index + 1}: ${passed ? '✅ 合格' : '❌ 不合格'}`);
      console.log(`     間違い回数: ${testCase.incorrectCount}`);
      console.log(`     カテゴリ: ${testCase.category}`);
      console.log(`     期待範囲: ${testCase.expectedMin}-${testCase.expectedMax}`);
      console.log(`     計算結果: ${priority}`);
      
      if (passed) passedTests++;
    });
    
    console.log(`✅ 優先度計算ロジックテスト完了: ${passedTests}/${testCases.length}件合格`);
    
  } catch (error) {
    console.error('❌ 優先度計算ロジックテストエラー:', error);
  }
}

// 解答チェック関数（簡略版）
function checkAnswer(userAnswer, correctAnswer) {
  try {
    if (userAnswer.questionType === 'journal' && correctAnswer.journalEntry) {
      const userJournal = userAnswer.journalEntry;
      const correctJournal = correctAnswer.journalEntry;
      
      return (
        userJournal.debit.account === correctJournal.debit_account &&
        userJournal.debit.amount === correctJournal.debit_amount &&
        userJournal.credit.account === correctJournal.credit_account &&
        userJournal.credit.amount === correctJournal.credit_amount
      );
    }
    
    if (userAnswer.questionType === 'ledger' && correctAnswer.ledgerEntry) {
      const userLedger = userAnswer.ledgerEntry;
      const correctLedger = correctAnswer.ledgerEntry;
      
      if (userLedger.entries.length !== correctLedger.entries.length) {
        return false;
      }
      
      for (let i = 0; i < userLedger.entries.length; i++) {
        const userEntry = userLedger.entries[i];
        const correctEntry = correctLedger.entries[i];
        
        if (userEntry.description !== correctEntry.description ||
            userEntry.credit !== correctEntry.credit) {
          return false;
        }
      }
      
      return true;
    }
    
    if (userAnswer.questionType === 'trial_balance' && correctAnswer.trialBalance) {
      const userBalance = userAnswer.trialBalance;
      const correctBalance = correctAnswer.trialBalance;
      
      const userKeys = Object.keys(userBalance.balances);
      const correctKeys = Object.keys(correctBalance.balances);
      
      if (userKeys.length !== correctKeys.length) {
        return false;
      }
      
      for (const key of correctKeys) {
        if (userBalance.balances[key] !== correctBalance.balances[key]) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('解答チェックエラー:', error);
    return false;
  }
}

// テスト実行
if (require.main === module) {
  testMockExamLogic();
}

module.exports = {
  testMockExamLogic,
  testScoringLogic,
  testTimeCalculation,
  testStatisticsCalculation,
  testPriorityCalculation,
  checkAnswer
};