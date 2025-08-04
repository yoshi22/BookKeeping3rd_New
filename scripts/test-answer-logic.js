/**
 * 解答ロジックのテストスクリプト（Node.js環境）
 * Step 2.2: 解答記録機能実装テスト
 */

// 解答判定ロジックのテスト（Expo SQLiteに依存しない部分）
function testAnswerLogic() {
  console.log('🧪 解答判定ロジックテスト開始\n');

  // テスト1: 仕訳問題の正解判定
  console.log('🎯 テスト1: 仕訳問題の正解判定');
  console.log('----------------------------------------');
  
  const journalCorrectAnswer = {
    journalEntry: {
      debit_account: '仕入',
      debit_amount: 100000,
      credit_account: '現金',
      credit_amount: 100000
    }
  };

  // 正解パターン
  const correctAnswerData = {
    debit_account: '仕入',
    debit_amount: 100000,
    credit_account: '現金',
    credit_amount: 100000
  };

  const isCorrect1 = isJournalAnswerCorrect(correctAnswerData, journalCorrectAnswer);
  console.log(`正解データ: ${JSON.stringify(correctAnswerData)}`);
  console.log(`判定結果: ${isCorrect1 ? '✅ 正解' : '❌ 不正解'}`);

  // 不正解パターン（勘定科目間違い）
  const incorrectAnswerData1 = {
    debit_account: '売上', // 間違い
    debit_amount: 100000,
    credit_account: '現金',
    credit_amount: 100000
  };

  const isCorrect2 = isJournalAnswerCorrect(incorrectAnswerData1, journalCorrectAnswer);
  console.log(`不正解データ1: ${JSON.stringify(incorrectAnswerData1)}`);
  console.log(`判定結果: ${isCorrect2 ? '✅ 正解' : '❌ 不正解'}`);

  // 不正解パターン（金額間違い）
  const incorrectAnswerData2 = {
    debit_account: '仕入',
    debit_amount: 50000, // 間違い
    credit_account: '現金',
    credit_amount: 100000
  };

  const isCorrect3 = isJournalAnswerCorrect(incorrectAnswerData2, journalCorrectAnswer);
  console.log(`不正解データ2: ${JSON.stringify(incorrectAnswerData2)}`);
  console.log(`判定結果: ${isCorrect3 ? '✅ 正解' : '❌ 不正解'}`);
  console.log('✅ 仕訳問題判定テスト完了\n');

  // テスト2: バリデーション機能
  console.log('⚠️  テスト2: バリデーション機能');
  console.log('----------------------------------------');

  const template = {
    fields: [
      {
        label: '借方勘定科目',
        type: 'dropdown',
        name: 'debit_account',
        required: true
      },
      {
        label: '借方金額',
        type: 'number',
        name: 'debit_amount',
        required: true
      },
      {
        label: '貸方勘定科目',
        type: 'dropdown',
        name: 'credit_account',
        required: true
      },
      {
        label: '貸方金額',
        type: 'number',
        name: 'credit_amount',
        required: true
      }
    ]
  };

  // 必須フィールド未入力
  const invalidData1 = {
    debit_account: '仕入',
    // debit_amount: 未入力
    credit_account: '現金',
    credit_amount: 100000
  };

  const errors1 = validateAnswer(invalidData1, template);
  console.log(`バリデーション対象: ${JSON.stringify(invalidData1)}`);
  console.log(`エラー結果: ${errors1.length > 0 ? errors1.join(', ') : 'エラーなし'}`);

  // 負の数値
  const invalidData2 = {
    debit_account: '仕入',
    debit_amount: -1000, // 負の値
    credit_account: '現金',
    credit_amount: 100000
  };

  const errors2 = validateAnswer(invalidData2, template);
  console.log(`バリデーション対象: ${JSON.stringify(invalidData2)}`);
  console.log(`エラー結果: ${errors2.length > 0 ? errors2.join(', ') : 'エラーなし'}`);

  // 同一勘定科目の重複
  const invalidData3 = {
    debit_account: '現金',
    debit_amount: 100000,
    credit_account: '現金', // 重複
    credit_amount: 100000
  };

  const errors3 = validateDuplicateAccounts(invalidData3);
  console.log(`重複チェック対象: ${JSON.stringify(invalidData3)}`);
  console.log(`重複エラー: ${errors3.length > 0 ? errors3.join(', ') : 'エラーなし'}`);
  console.log('✅ バリデーション機能テスト完了\n');

  // テスト3: 解答時間計算
  console.log('⏱️  テスト3: 解答時間計算');
  console.log('----------------------------------------');

  const startTime1 = Date.now() - 5000; // 5秒前
  const answerTime1 = Date.now() - startTime1;
  console.log(`開始時刻から現在まで: ${answerTime1}ms (約${Math.round(answerTime1/1000)}秒)`);

  const startTime2 = Date.now() - 30000; // 30秒前
  const answerTime2 = Date.now() - startTime2;
  console.log(`開始時刻から現在まで: ${answerTime2}ms (約${Math.round(answerTime2/1000)}秒)`);
  console.log('✅ 解答時間計算テスト完了\n');

  console.log('🎉 すべてのロジックテストが完了しました！');
}

// 仕訳問題の正解判定ロジック
function isJournalAnswerCorrect(answerData, correctAnswer) {
  const entry = correctAnswer.journalEntry;
  if (!entry) return false;
  
  return (
    answerData.debit_account === entry.debit_account &&
    answerData.debit_amount === entry.debit_amount &&
    answerData.credit_account === entry.credit_account &&
    answerData.credit_amount === entry.credit_amount
  );
}

// バリデーション機能
function validateAnswer(answerData, template) {
  const errors = [];
  
  // 必須フィールドチェック
  template.fields?.forEach((field) => {
    if (field.required && !answerData[field.name]) {
      errors.push(`${field.label}は必須項目です`);
    }
  });
  
  // 数値フィールドチェック
  Object.entries(answerData).forEach(([key, value]) => {
    const field = template.fields?.find((f) => f.name === key);
    if (field?.type === 'number' && value !== null && value !== undefined) {
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push(`${field.label}は有効な数値を入力してください`);
      } else if (value < 0) {
        errors.push(`${field.label}は0以上の値を入力してください`);
      }
    }
  });
  
  return errors;
}

// 勘定科目重複チェック
function validateDuplicateAccounts(answerData) {
  const errors = [];
  const accounts = Object.entries(answerData)
    .filter(([key, value]) => key.includes('account') && value)
    .map(([key, value]) => value);
  
  const uniqueAccounts = new Set(accounts);
  if (accounts.length !== uniqueAccounts.size) {
    errors.push('同じ勘定科目を複数回選択することはできません');
  }
  
  return errors;
}

// メイン実行
if (require.main === module) {
  try {
    testAnswerLogic();
    console.log('\n✅ テスト完了');
    process.exit(0);
  } catch (error) {
    console.error('❌ テスト失敗:', error);
    process.exit(1);
  }
}

module.exports = { 
  testAnswerLogic,
  isJournalAnswerCorrect,
  validateAnswer,
  validateDuplicateAccounts
};