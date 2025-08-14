/**
 * 模試サンプルデータ
 * CBT形式の模試定義・問題構成データ
 */

import { MockExam, MockExamQuestion } from "../types/models";

// 模試定義データ
export const sampleMockExams: Omit<MockExam, "created_at">[] = [
  {
    id: "MOCK_001",
    name: "基礎徹底模試",
    description:
      "基本的な取引と処理の理解確認。初学者向けの基礎力確認模試です。",
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20, // 15-20分
        questions: [
          "Q_J_001",
          "Q_J_015",
          "Q_J_025",
          "Q_J_035",
          "Q_J_045",
          "Q_J_055",
          "Q_J_065",
          "Q_J_075",
          "Q_J_085",
          "Q_J_095",
          "Q_J_105",
          "Q_J_115",
          "Q_J_125",
          "Q_J_135",
          "Q_J_145",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15, // 15-20分
        questions: ["Q_L_001", "Q_L_015"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25, // 25-30分
        questions: ["Q_T_001"],
      },
    }),
    is_active: true,
  },
  {
    id: "MOCK_002",
    name: "標準実力模試",
    description:
      "実際の試験レベルの問題で実力確認。標準的な難易度の総合模試です。",
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20,
        questions: [
          "Q_J_050",
          "Q_J_060",
          "Q_J_070",
          "Q_J_080",
          "Q_J_090",
          "Q_J_100",
          "Q_J_110",
          "Q_J_120",
          "Q_J_130",
          "Q_J_140",
          "Q_J_150",
          "Q_J_160",
          "Q_J_170",
          "Q_J_180",
          "Q_J_190",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_010", "Q_L_020"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_005"],
      },
    }),
    is_active: true,
  },
  {
    id: "MOCK_003",
    name: "応用力強化模試",
    description:
      "応用的な取引処理と複雑な決算整理。上級者向けの実践力強化模試です。",
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20,
        questions: [
          "Q_J_151",
          "Q_J_152",
          "Q_J_153",
          "Q_J_154",
          "Q_J_155",
          "Q_J_156",
          "Q_J_157",
          "Q_J_158",
          "Q_J_159",
          "Q_J_160",
          "Q_J_161",
          "Q_J_162",
          "Q_J_163",
          "Q_J_164",
          "Q_J_165",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_030", "Q_L_040"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_010"],
      },
    }),
    is_active: true,
  },
  {
    id: "MOCK_004",
    name: "総合実践模試",
    description:
      "本番想定の総合的な実力試験。実際の試験形式に最も近い模試です。",
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20,
        questions: [
          "Q_J_166",
          "Q_J_167",
          "Q_J_168",
          "Q_J_169",
          "Q_J_170",
          "Q_J_171",
          "Q_J_172",
          "Q_J_173",
          "Q_J_174",
          "Q_J_175",
          "Q_J_176",
          "Q_J_177",
          "Q_J_178",
          "Q_J_179",
          "Q_J_180",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_031", "Q_L_032"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_011"],
      },
    }),
    is_active: true,
  },
  {
    id: "MOCK_005",
    name: "完成度確認模試",
    description: "最終確認と弱点克服。全範囲を網羅した完成度チェック模試です。",
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20,
        questions: [
          "Q_J_181",
          "Q_J_182",
          "Q_J_183",
          "Q_J_184",
          "Q_J_185",
          "Q_J_186",
          "Q_J_187",
          "Q_J_188",
          "Q_J_189",
          "Q_J_190",
          "Q_J_191",
          "Q_J_192",
          "Q_J_193",
          "Q_J_194",
          "Q_J_195",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_033", "Q_L_034"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_012"],
      },
    }),
    is_active: true,
  },
];

// 模試問題構成データ (基礎レベル模試用サンプル)
export const sampleMockExamQuestions: Omit<MockExamQuestion, "id">[] = [
  // 第1問: 仕訳問題 (15問, 各3点 = 45点)
  // 基本的な仕訳パターンを厳選
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_001", // 商品の仕入
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_015", // 商品の売上
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_025", // 現金の受取
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_035", // 現金の支払
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_045", // 買掛金の計上
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_055", // 売掛金の計上
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_065", // 手形の振出
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_075", // 手形の受取
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_085", // 貸付金
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_095", // 借入金
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_105", // 前払費用
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_115", // 前受収益
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_125", // 減価償却
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_135", // 貸倒引当金
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_J_145", // 決算整理仕訳
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点)
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_L_001", // 現金出納帳
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_L_015", // 売掛金元帳
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_001",
    question_id: "Q_T_001", // 合計残高試算表
    section_number: 3,
    question_order: 1,
    points: 35,
  },
];

// 標準レベル模試用問題構成データ
export const standardMockExamQuestions: Omit<MockExamQuestion, "id">[] = [
  // 第1問: 仕訳問題 (15問, 各3点 = 45点) - 中級レベル
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_050",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_060",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_070",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_080",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_090",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_100",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_110",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_120",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_130",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_140",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_150",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_160",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_170",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_180",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_J_190",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点)
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_L_010",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_L_020",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_002",
    question_id: "Q_T_005",
    section_number: 3,
    question_order: 1,
    points: 35,
  },
];

// 応用力強化模試用問題構成データ (MOCK_003)
export const advancedMockExamQuestions: Omit<MockExamQuestion, "id">[] = [
  // 第1問: 仕訳問題 (15問, 各3点 = 45点) - 応用レベル
  // 複雑な取引処理
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_151",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_152",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_153",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_154",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_155",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_156",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_157",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_158",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_159",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_160",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_161",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_162",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_163",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_164",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_165",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点 = 20点)
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_L_030",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_L_040",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_T_010",
    section_number: 3,
    question_order: 1,
    points: 35,
  },
];

// 総合実践模試用問題構成データ (MOCK_004)
export const comprehensiveMockExamQuestions: Omit<MockExamQuestion, "id">[] = [
  // 第1問: 仕訳問題 (15問, 各3点 = 45点) - 実践レベル
  // 本番想定の総合問題
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_166",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_167",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_168",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_169",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_170",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_171",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_172",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_173",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_174",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_175",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_176",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_177",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_178",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_179",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_180",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点 = 20点)
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_L_031",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_L_032",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_T_011",
    section_number: 3,
    question_order: 1,
    points: 35,
  },
];

// 完成度確認模試用問題構成データ (MOCK_005)
export const finalMockExamQuestions: Omit<MockExamQuestion, "id">[] = [
  // 第1問: 仕訳問題 (15問, 各3点 = 45点) - 最終確認レベル
  // 弱点克服と総仕上げ
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_181",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_182",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_183",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_184",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_185",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_186",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_187",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_188",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_189",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_190",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_191",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_192",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_193",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_194",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_195",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点 = 20点)
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_L_033",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_L_034",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_T_012",
    section_number: 3,
    question_order: 1,
    points: 35,
  },
];

// 全模試問題構成データ
export const allMockExamQuestions = [
  ...sampleMockExamQuestions,
  ...standardMockExamQuestions,
  ...advancedMockExamQuestions,
  ...comprehensiveMockExamQuestions,
  ...finalMockExamQuestions,
];

// 模試データ初期化用関数
export function generateMockExamData() {
  const exams = sampleMockExams.map((exam) => ({
    ...exam,
    created_at: new Date().toISOString(),
  }));

  const questions = allMockExamQuestions;

  return {
    exams,
    questions,
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
  },
): {
  exam: Omit<MockExam, "created_at">;
  questions: Omit<MockExamQuestion, "id">[];
} {
  // ランダムに問題を選択
  const selectedJournalQuestions = shuffleArray(
    availableQuestions.journal,
  ).slice(0, 15);
  const selectedLedgerQuestions = shuffleArray(availableQuestions.ledger).slice(
    0,
    2,
  );
  const selectedTrialBalanceQuestions = shuffleArray(
    availableQuestions.trial_balance,
  ).slice(0, 1);

  const exam: Omit<MockExam, "created_at"> = {
    id: examId,
    name,
    description,
    time_limit_minutes: 60,
    total_score: 100,
    passing_score: 70,
    structure_json: JSON.stringify({
      section1: {
        count: 15,
        maxScore: 45, // 3点×15問
        questionCategory: "journal",
        timeRecommendation: 20, // 15-20分
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15, // 15-20分
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25, // 25-30分
      },
    }),
    is_active: true,
  };

  const questions: Omit<MockExamQuestion, "id">[] = [
    // 第1問: 仕訳問題
    ...selectedJournalQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 1 as const,
      question_order: index + 1,
      points: 3,
    })),

    // 第2問: 帳簿問題
    ...selectedLedgerQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 2 as const,
      question_order: index + 1,
      points: 10,
    })),

    // 第3問: 試算表問題
    ...selectedTrialBalanceQuestions.map((questionId, index) => ({
      mock_exam_id: examId,
      question_id: questionId,
      section_number: 3 as const,
      question_order: index + 1,
      points: 35,
    })),
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
    warnings.push("問題数が不足しています（最低18問必要）");
  }

  // セクション別バランスチェック
  const journalQuestions = questions.filter((id) => id.startsWith("Q_J_"));
  const ledgerQuestions = questions.filter((id) => id.startsWith("Q_L_"));
  const trialBalanceQuestions = questions.filter((id) => id.startsWith("Q_T_"));

  if (journalQuestions.length < 15) {
    warnings.push("仕訳問題が不足しています");
  }

  if (ledgerQuestions.length < 2) {
    warnings.push("帳簿問題が不足しています");
  }

  if (trialBalanceQuestions.length < 1) {
    warnings.push("試算表問題が不足しています");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
