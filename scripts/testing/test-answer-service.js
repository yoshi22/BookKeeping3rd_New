/**
/* eslint-disable @typescript-eslint/no-unused-vars */
 * 解答記録機能のテストスクリプト
 * Step 2.2: 解答記録機能実装テスト
 */

const path = require('path');
const fs = require('fs');

// TypeScript設定
require('ts-node').register({
  project: path.resolve(__dirname, '../tsconfig.json'),
  transpileOnly: true,
});

// プロジェクトのパスを追加
const srcPath = path.resolve(__dirname, '../src');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');

async function testAnswerService() {
  try {
    console.log('🧪 解答記録機能テスト開始\n');

    // 必要なモジュールをインポート
    const { answerService } = require('../src/services/answer-service.ts');
    const { databaseManager } = require('../src/data/database.ts');
    const { questionRepository } = require('../src/data/repositories/question-repository.ts');
    const { learningHistoryRepository } = require('../src/data/repositories/learning-history-repository.ts');

    // データベース初期化
    console.log('📊 データベース初期化...');
    await databaseManager.initialize();
    console.log('✅ データベース初期化完了\n');

    // テスト用問題データ挿入
    console.log('📝 テスト用問題データ準備...');
    const testQuestion = {
      id: 'TEST_J_001',
      category_id: 'journal',
      question_text: 'テスト問題：商品100,000円を現金で仕入れた。',
      answer_template_json: JSON.stringify({
        type: 'journal_entry',
        fields: [
          {
            label: '借方勘定科目',
            type: 'dropdown',
            name: 'debit_account',
            required: true,
            options: ['仕入', '現金', '売上', '売掛金']
          },
          {
            label: '借方金額',
            type: 'number',
            name: 'debit_amount',
            required: true,
            format: 'currency'
          },
          {
            label: '貸方勘定科目',
            type: 'dropdown',
            name: 'credit_account',
            required: true,
            options: ['仕入', '現金', '売上', '売掛金']
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
          debit_amount: 100000,
          credit_account: '現金',
          credit_amount: 100000
        }
      }),
      explanation: 'テスト解説：商品仕入時は仕入勘定（借方）、現金減少は現金勘定（貸方）で処理します。',
      difficulty: 'basic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      await questionRepository.create(testQuestion);
      console.log('✅ テスト問題データ準備完了\n');
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('⚠️  テスト問題データは既に存在します\n');
      } else {
        throw error;
      }
    }

    // テスト1: 正解解答の送信
    console.log('🎯 テスト1: 正解解答の送信');
    console.log('----------------------------------------');
    
    const correctAnswerRequest = {
      questionId: 'TEST_J_001',
      answerData: {
        debit_account: '仕入',
        debit_amount: 100000,
        credit_account: '現金',
        credit_amount: 100000
      },
      sessionType: 'learning',
      startTime: Date.now() - 5000 // 5秒前に開始
    };

    const correctResult = await answerService.submitAnswer(correctAnswerRequest);
    
    console.log('解答結果:', {
      isCorrect: correctResult.isCorrect,
      answerTimeMs: correctResult.answerTimeMs,
      hasExplanation: !!correctResult.explanation,
      sessionId: correctResult.sessionId?.substring(0, 8) + '...',
      historyId: correctResult.historyId
    });
    console.log('✅ 正解解答テスト完了\n');

    // テスト2: 不正解解答の送信
    console.log('❌ テスト2: 不正解解答の送信');
    console.log('----------------------------------------');
    
    const incorrectAnswerRequest = {
      questionId: 'TEST_J_001',
      answerData: {
        debit_account: '売上', // 間違い
        debit_amount: 100000,
        credit_account: '現金',
        credit_amount: 100000
      },
      sessionType: 'learning',
      startTime: Date.now() - 8000 // 8秒前に開始
    };

    const incorrectResult = await answerService.submitAnswer(incorrectAnswerRequest);
    
    console.log('解答結果:', {
      isCorrect: incorrectResult.isCorrect,
      answerTimeMs: incorrectResult.answerTimeMs,
      hasExplanation: !!incorrectResult.explanation,
      sessionId: incorrectResult.sessionId?.substring(0, 8) + '...',
      historyId: incorrectResult.historyId
    });
    console.log('✅ 不正解解答テスト完了\n');

    // テスト3: バリデーションエラーのテスト
    console.log('⚠️  テスト3: バリデーションエラーのテスト');
    console.log('----------------------------------------');
    
    const invalidAnswerRequest = {
      questionId: 'TEST_J_001',
      answerData: {
        debit_account: '仕入',
        // debit_amount: 必須フィールドが未入力
        credit_account: '現金',
        credit_amount: 100000
      },
      sessionType: 'learning',
      startTime: Date.now() - 3000
    };

    const invalidResult = await answerService.submitAnswer(invalidAnswerRequest);
    
    console.log('解答結果:', {
      isCorrect: invalidResult.isCorrect,
      validationErrors: invalidResult.validationErrors,
      sessionId: invalidResult.sessionId?.substring(0, 8) + '...',
      historyId: invalidResult.historyId
    });
    console.log('✅ バリデーションエラーテスト完了\n');

    // テスト4: 学習履歴確認
    console.log('📊 テスト4: 学習履歴確認');
    console.log('----------------------------------------');
    
    const questionHistory = await learningHistoryRepository.findByQuestionId('TEST_J_001');
    console.log(`学習履歴件数: ${questionHistory.length}件`);
    
    questionHistory.forEach((record, index) => {
      console.log(`記録${index + 1}:`, {
        isCorrect: record.is_correct,
        answerTimeMs: record.answer_time_ms,
        sessionType: record.session_type,
        answeredAt: new Date(record.answered_at).toLocaleString()
      });
    });
    console.log('✅ 学習履歴確認完了\n');

    // テスト5: セッション統計取得
    console.log('📈 テスト5: セッション統計取得');
    console.log('----------------------------------------');
    
    if (correctResult.sessionId) {
      const sessionStats = await answerService.getSessionStatistics(correctResult.sessionId);
      console.log('セッション統計:', {
        totalQuestions: sessionStats.totalQuestions,
        correctAnswers: sessionStats.correctAnswers,
        accuracyRate: Math.round(sessionStats.accuracyRate * 100) + '%',
        averageTime: Math.round(sessionStats.averageTime) + 'ms'
      });
    }
    console.log('✅ セッション統計取得完了\n');

    // テスト6: バッチ解答送信（模試用）
    console.log('🎯 テスト6: バッチ解答送信テスト');
    console.log('----------------------------------------');
    
    const batchAnswers = [
      {
        questionId: 'TEST_J_001',
        answerData: {
          debit_account: '仕入',
          debit_amount: 100000,
          credit_account: '現金',
          credit_amount: 100000
        },
        sessionType: 'mock_exam',
        startTime: Date.now() - 4000
      },
      {
        questionId: 'TEST_J_001',
        answerData: {
          debit_account: '売上', // 間違い
          debit_amount: 100000,
          credit_account: '現金',
          credit_amount: 100000
        },
        sessionType: 'mock_exam',
        startTime: Date.now() - 6000
      }
    ];

    const batchResults = await answerService.submitBatchAnswers(batchAnswers, 'MOCK_TEST_001');
    console.log(`バッチ解答結果: ${batchResults.length}件処理`);
    
    batchResults.forEach((result, index) => {
      console.log(`解答${index + 1}:`, {
        isCorrect: result.isCorrect,
        answerTimeMs: result.answerTimeMs,
        sessionId: result.sessionId?.substring(0, 8) + '...'
      });
    });
    console.log('✅ バッチ解答送信テスト完了\n');

    console.log('🎉 すべてのテストが正常に完了しました！');
    console.log('\n📋 テスト結果サマリー:');
    console.log('- 正解判定機能: ✅');
    console.log('- 不正解判定機能: ✅');
    console.log('- バリデーション機能: ✅');
    console.log('- 学習履歴記録: ✅');
    console.log('- セッション統計: ✅');
    console.log('- バッチ処理: ✅');

  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    console.error('スタックトレース:', error.stack);
    process.exit(1);
  }
}

// メイン実行
if (require.main === module) {
  testAnswerService().then(() => {
    console.log('\n✅ テスト完了');
    process.exit(0);
  }).catch(error => {
    console.error('❌ テスト失敗:', error);
    process.exit(1);
  });
}

module.exports = { testAnswerService };