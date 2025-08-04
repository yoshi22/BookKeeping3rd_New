/**
 * 模試サンプルデータ
 * CBT形式の模試定義・問題構成データ
 */

import { MockExam, MockExamQuestion } from '../types/models';

// 模試定義データ
export const sampleMockExams: Omit<MockExam, 'created_at'>[] = [
  {
    id: 'MOCK_001',
    name: '基礎レベル模試',
    description: '基本的な問題を中心とした初学者向けの模試です。基礎力確認にお役立てください。',
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  },
  {
    id: 'MOCK_002',
    name: '標準レベル模試',
    description: '標準的な難易度の問題で構成された模試です。実力の確認に最適です。',
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  },
  {
    id: 'MOCK_003',
    name: '応用レベル模試',
    description: '応用問題を含む上級者向けの模試です。実践力を試すことができます。',
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  },
  {
    id: 'MOCK_004',
    name: '実践レベル模試',
    description: '実際の試験により近い形式と難易度の模試です。本番前の最終確認にどうぞ。',
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  },
  {
    id: 'MOCK_005',
    name: '総合レベル模試',
    description: '全範囲を網羅した総合的な実力測定模試です。現在の実力を正確に把握できます。',
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  }
];

// 模試問題構成データ (基礎レベル模試用サンプル)
export const sampleMockExamQuestions: Omit<MockExamQuestion, 'id'>[] = [
  // 第1問: 仕訳問題 (15問, 各4点)
  // 基本的な仕訳パターンを厳選
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_001', // 商品の仕入
    section_number: 1,
    question_order: 1,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_015', // 商品の売上
    section_number: 1,
    question_order: 2,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_025', // 現金の受取
    section_number: 1,
    question_order: 3,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_035', // 現金の支払
    section_number: 1,
    question_order: 4,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_045', // 買掛金の計上
    section_number: 1,
    question_order: 5,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_055', // 売掛金の計上
    section_number: 1,
    question_order: 6,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_065', // 手形の振出
    section_number: 1,
    question_order: 7,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_075', // 手形の受取
    section_number: 1,
    question_order: 8,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_085', // 貸付金
    section_number: 1,
    question_order: 9,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_095', // 借入金
    section_number: 1,
    question_order: 10,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_105', // 前払費用
    section_number: 1,
    question_order: 11,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_115', // 前受収益
    section_number: 1,
    question_order: 12,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_125', // 減価償却
    section_number: 1,
    question_order: 13,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_135', // 貸倒引当金
    section_number: 1,
    question_order: 14,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_J_145', // 決算整理仕訳
    section_number: 1,
    question_order: 15,
    points: 4
  },

  // 第2問: 帳簿問題 (2問, 各10点)
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_L_001', // 現金出納帳
    section_number: 2,
    question_order: 1,
    points: 10
  },
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_L_015', // 売掛金元帳
    section_number: 2,
    question_order: 2,
    points: 10
  },

  // 第3問: 試算表問題 (1問, 20点)
  {
    mock_exam_id: 'MOCK_001',
    question_id: 'Q_T_001', // 合計残高試算表
    section_number: 3,
    question_order: 1,
    points: 20
  }
];

// 標準レベル模試用問題構成データ
export const standardMockExamQuestions: Omit<MockExamQuestion, 'id'>[] = [
  // 第1問: 仕訳問題 (15問, 各4点) - 中級レベル
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_050',
    section_number: 1,
    question_order: 1,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_060',
    section_number: 1,
    question_order: 2,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_070',
    section_number: 1,
    question_order: 3,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_080',
    section_number: 1,
    question_order: 4,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_090',
    section_number: 1,
    question_order: 5,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_100',
    section_number: 1,
    question_order: 6,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_110',
    section_number: 1,
    question_order: 7,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_120',
    section_number: 1,
    question_order: 8,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_130',
    section_number: 1,
    question_order: 9,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_140',
    section_number: 1,
    question_order: 10,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_150',
    section_number: 1,
    question_order: 11,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_160',
    section_number: 1,
    question_order: 12,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_170',
    section_number: 1,
    question_order: 13,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_180',
    section_number: 1,
    question_order: 14,
    points: 4
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_J_190',
    section_number: 1,
    question_order: 15,
    points: 4
  },

  // 第2問: 帳簿問題 (2問, 各10点)
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_L_010',
    section_number: 2,
    question_order: 1,
    points: 10
  },
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_L_020',
    section_number: 2,
    question_order: 2,
    points: 10
  },

  // 第3問: 試算表問題 (1問, 20点)
  {
    mock_exam_id: 'MOCK_002',
    question_id: 'Q_T_005',
    section_number: 3,
    question_order: 1,
    points: 20
  }
];

// 全模試問題構成データ
export const allMockExamQuestions = [
  ...sampleMockExamQuestions,
  ...standardMockExamQuestions
];

// 模試データ初期化用関数
export function generateMockExamData() {
  const exams = sampleMockExams.map(exam => ({
    ...exam,
    created_at: new Date().toISOString()
  }));

  const questions = allMockExamQuestions;

  return {
    exams,
    questions
  };
}

// ランダム模試生成用ヘルパー
export function generateRandomMockExam(
  examId: string,
  name: string,
  description: string,
  availableQuestions: {
    journal: string[];
    ledger: string[];
    trial_balance: string[];
  }
): {
  exam: Omit<MockExam, 'created_at'>;
  questions: Omit<MockExamQuestion, 'id'>[];
} {
  // ランダムに問題を選択
  const selectedJournalQuestions = shuffleArray(availableQuestions.journal).slice(0, 15);
  const selectedLedgerQuestions = shuffleArray(availableQuestions.ledger).slice(0, 2);
  const selectedTrialBalanceQuestions = shuffleArray(availableQuestions.trial_balance).slice(0, 1);

  const exam: Omit<MockExam, 'created_at'> = {
    id: examId,
    name,
    description,
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 60,
        questionCategory: 'journal',
        timeRecommendation: 30
      },
      section2: {
        count: 2,
        maxScore: 20,
        questionCategory: 'ledger',
        timeRecommendation: 15
      },
      section3: {
        count: 1,
        maxScore: 20,
        questionCategory: 'trial_balance',
        timeRecommendation: 15
      }
    }),
    is_active: true
  };

  const questions: Omit<MockExamQuestion, 'id'>[] = [
    // 第1問: 仕訳問題
    ...selectedJournalQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 1 as const,
      question_order: index + 1,
      points: 4
    })),
    
    // 第2問: 帳簿問題
    ...selectedLedgerQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 2 as const,
      question_order: index + 1,
      points: 10
    })),
    
    // 第3問: 試算表問題
    ...selectedTrialBalanceQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 3 as const,
      question_order: index + 1,
      points: 20
    }))
  ];

  return { exam, questions };
}

// 配列シャッフルヘルパー関数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 模試難易度チェック関数
export function validateMockExamDifficulty(questions: string[]): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // 最低限の問題数チェック
  if (questions.length < 18) {
    warnings.push('問題数が不足しています（最低18問必要）');
  }
  
  // セクション別バランスチェック
  const journalQuestions = questions.filter(id => id.startsWith('Q_J_'));
  const ledgerQuestions = questions.filter(id => id.startsWith('Q_L_'));
  const trialBalanceQuestions = questions.filter(id => id.startsWith('Q_T_'));
  
  if (journalQuestions.length < 15) {
    warnings.push('仕訳問題が不足しています');
  }
  
  if (ledgerQuestions.length < 2) {
    warnings.push('帳簿問題が不足しています');
  }
  
  if (trialBalanceQuestions.length < 1) {
    warnings.push('試算表問題が不足しています');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}