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
          "Q_J_200",
          "Q_J_210",
          "Q_J_220",
          "Q_J_230",
          "Q_J_240",
          "Q_J_250",
          "Q_J_260",
          "Q_J_270",
          "Q_J_280",
          "Q_J_290",
          "Q_J_300",
          "Q_J_310",
          "Q_J_320",
          "Q_J_330",
          "Q_J_340",
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
          "Q_J_350",
          "Q_J_360",
          "Q_J_370",
          "Q_J_380",
          "Q_J_390",
          "Q_J_400",
          "Q_J_410",
          "Q_J_420",
          "Q_J_430",
          "Q_J_440",
          "Q_J_450",
          "Q_J_460",
          "Q_J_470",
          "Q_J_480",
          "Q_J_490",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_050", "Q_L_060"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_015"],
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
          "Q_J_500",
          "Q_J_510",
          "Q_J_520",
          "Q_J_530",
          "Q_J_540",
          "Q_J_550",
          "Q_J_560",
          "Q_J_570",
          "Q_J_580",
          "Q_J_590",
          "Q_J_600",
          "Q_J_610",
          "Q_J_620",
          "Q_J_630",
          "Q_J_640",
        ],
      },
      section2: {
        count: 2,
        maxScore: 20, // 10点×2問
        questionCategory: "ledger",
        timeRecommendation: 15,
        questions: ["Q_L_070", "Q_L_080"],
      },
      section3: {
        count: 1,
        maxScore: 35, // 35点×1問
        questionCategory: "trial_balance",
        timeRecommendation: 25,
        questions: ["Q_T_020"],
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
    question_id: "Q_J_200",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_210",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_220",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_230",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_240",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_250",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_260",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_270",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_280",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_290",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_300",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_310",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_320",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_330",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_003",
    question_id: "Q_J_340",
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
    question_id: "Q_J_350",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_360",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_370",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_380",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_390",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_400",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_410",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_420",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_430",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_440",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_450",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_460",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_470",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_480",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_J_490",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点 = 20点)
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_L_050",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_L_060",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_004",
    question_id: "Q_T_015",
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
    question_id: "Q_J_500",
    section_number: 1,
    question_order: 1,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_510",
    section_number: 1,
    question_order: 2,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_520",
    section_number: 1,
    question_order: 3,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_530",
    section_number: 1,
    question_order: 4,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_540",
    section_number: 1,
    question_order: 5,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_550",
    section_number: 1,
    question_order: 6,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_560",
    section_number: 1,
    question_order: 7,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_570",
    section_number: 1,
    question_order: 8,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_580",
    section_number: 1,
    question_order: 9,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_590",
    section_number: 1,
    question_order: 10,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_600",
    section_number: 1,
    question_order: 11,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_610",
    section_number: 1,
    question_order: 12,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_620",
    section_number: 1,
    question_order: 13,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_630",
    section_number: 1,
    question_order: 14,
    points: 3,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_J_640",
    section_number: 1,
    question_order: 15,
    points: 3,
  },

  // 第2問: 帳簿問題 (2問, 各10点 = 20点)
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_L_070",
    section_number: 2,
    question_order: 1,
    points: 10,
  },
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_L_080",
    section_number: 2,
    question_order: 2,
    points: 10,
  },

  // 第3問: 試算表問題 (1問, 35点)
  {
    mock_exam_id: "MOCK_005",
    question_id: "Q_T_020",
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
