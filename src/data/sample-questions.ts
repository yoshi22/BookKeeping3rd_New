/**
 * サンプル問題データ
 * Step 2.1.1: 問題表示機能開発用のテストデータ
 */

import type { Question, QuestionAnswerTemplate, QuestionCorrectAnswer } from '../types/models';

/**
 * 仕訳問題のサンプルデータ (5問)
 * CBT形式の基本的な仕訳問題
 */
export const sampleJournalQuestions: Question[] = [
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '仕入',
        debit_amount: 200000,
        credit_account: '現金',
        credit_amount: 200000
      }
    } as QuestionCorrectAnswer),
    explanation: '商品を仕入れたときは「仕入」勘定で処理します。現金で支払っているので、現金が減少します。',
    difficulty: 1,
    tags_json: JSON.stringify(['基本仕訳', '商品売買', '現金取引']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '売掛金',
        debit_amount: 300000,
        credit_account: '売上',
        credit_amount: 300000
      }
    } as QuestionCorrectAnswer),
    explanation: '商品を販売したときは「売上」勘定に記録します。代金が掛けの場合は「売掛金」勘定を使用します。',
    difficulty: 1,
    tags_json: JSON.stringify(['基本仕訳', '商品売買', '掛取引']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '現金',
        debit_amount: 150000,
        credit_account: '売掛金',
        credit_amount: 150000
      }
    } as QuestionCorrectAnswer),
    explanation: '売掛金を現金で回収したときは、現金が増加し、売掛金が減少します。',
    difficulty: 1,
    tags_json: JSON.stringify(['債権回収', '現金取引']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  },
  {
    id: 'Q_J_004',
    category_id: 'journal',
    question_text: '買掛金100,000円を現金で支払った。',
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '買掛金',
        debit_amount: 100000,
        credit_account: '現金',
        credit_amount: 100000
      }
    } as QuestionCorrectAnswer),
    explanation: '買掛金を現金で支払ったときは、買掛金が減少し、現金も減少します。',
    difficulty: 1,
    tags_json: JSON.stringify(['債務支払', '現金取引']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  },
  {
    id: 'Q_J_005',
    category_id: 'journal',
    question_text: '銀行から500,000円を借り入れ、預金口座に入金された。',
    answer_template_json: JSON.stringify({
      type: 'journal_entry',
      fields: [
        {
          label: '借方科目',
          type: 'dropdown',
          name: 'debit_account',
          required: true,
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形', '借入金']
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
          options: ['現金', '預金', '売掛金', '受取手形', '商品', '仕入', '売上', '買掛金', '支払手形', '借入金']
        },
        {
          label: '貸方金額',
          type: 'number',
          name: 'credit_amount',
          required: true,
          format: 'currency'
        }
      ]
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: '預金',
        debit_amount: 500000,
        credit_account: '借入金',
        credit_amount: 500000
      }
    } as QuestionCorrectAnswer),
    explanation: '銀行から借入をしたときは「借入金」勘定で負債を記録し、預金口座への入金は「預金」勘定で資産の増加を記録します。',
    difficulty: 2,
    tags_json: JSON.stringify(['借入取引', '預金取引']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  }
];

/**
 * 帳簿問題のサンプルデータ (2問)
 * 現金出納帳と売掛金元帳の基本的な記帳問題
 */
export const sampleLedgerQuestions: Question[] = [
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          { account: '現金残高', amount: 150000 }
        ]
      }
    } as QuestionCorrectAnswer),
    explanation: '現金出納帳では、期首残高50,000円から仕入で100,000円減少（残高-50,000円）、その後売上で200,000円増加して最終残高150,000円となります。',
    difficulty: 2,
    tags_json: JSON.stringify(['現金出納帳', '残高計算']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  },
  {
    id: 'Q_L_002',
    category_id: 'ledger',
    question_text: '以下の取引を売掛金元帳に記入してください。\n4月1日 売上300,000円（掛け）\n4月5日 売掛金150,000円を現金で回収\n期首売掛金残高は80,000円でした。',
    answer_template_json: JSON.stringify({
      type: 'ledger_entry',
      fields: [
        {
          label: '4月5日残高',
          type: 'number',
          name: 'april_5_balance',
          required: true,
          format: 'currency'
        }
      ]
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      ledgerEntry: {
        entries: [
          { account: '売掛金残高', amount: 230000 }
        ]
      }
    } as QuestionCorrectAnswer),
    explanation: '売掛金元帳では、期首残高80,000円に掛売上300,000円を加算し、回収額150,000円を減算して最終残高230,000円となります。',
    difficulty: 2,
    tags_json: JSON.stringify(['売掛金元帳', '債権管理']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  }
];

/**
 * 試算表問題のサンプルデータ (1問)
 * 基本的な試算表作成問題
 */
export const sampleTrialBalanceQuestions: Question[] = [
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
    } as QuestionAnswerTemplate),
    correct_answer_json: JSON.stringify({
      trialBalance: {
        balances: {
          debit_total: 450000
        }
      }
    } as QuestionCorrectAnswer),
    explanation: '借方科目（現金100,000円 + 売掛金200,000円 + 商品150,000円）の合計は450,000円です。試算表では借方合計と貸方合計が一致する必要があります。',
    difficulty: 2,
    tags_json: JSON.stringify(['試算表作成', '残高試算表']),
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z'
  }
];

/**
 * 全サンプル問題を結合
 */
export const allSampleQuestions: Question[] = [
  ...sampleJournalQuestions,
  ...sampleLedgerQuestions,
  ...sampleTrialBalanceQuestions
];

/**
 * カテゴリ別に問題を取得するヘルパー関数
 */
export const getSampleQuestionsByCategory = (category: 'journal' | 'ledger' | 'trial_balance'): Question[] => {
  switch (category) {
    case 'journal':
      return sampleJournalQuestions;
    case 'ledger':
      return sampleLedgerQuestions;
    case 'trial_balance':
      return sampleTrialBalanceQuestions;
    default:
      return [];
  }
};

/**
 * 問題IDで問題を取得するヘルパー関数
 */
export const getSampleQuestionById = (id: string): Question | undefined => {
  return allSampleQuestions.find(question => question.id === id);
};