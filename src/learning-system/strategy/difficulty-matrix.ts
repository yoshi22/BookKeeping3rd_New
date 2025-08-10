/**
 * 難易度マトリックス
 * 問題の難易度とカテゴリーに基づく学習順序の管理
 */

import { QuestionDifficulty } from "@/types/models";
import { LearningCategory } from "./learning-paths";

export interface DifficultyMatrix {
  categoryId: string;
  subcategoryId?: string;
  patternId?: string;
  baseDifficulty: QuestionDifficulty;
  adjustmentFactors: AdjustmentFactor[];
  recommendedOrder: number; // 学習推奨順序（1が最初）
}

export interface AdjustmentFactor {
  condition: string;
  adjustment: -2 | -1 | 0 | 1 | 2;
  description: string;
}

export interface DifficultyProgression {
  phase: number;
  targetDifficulties: QuestionDifficulty[];
  minimumQuestions: number;
  masteryRequirement: number; // %
}

// カテゴリー別の基本難易度設定
export const DIFFICULTY_MATRIX: DifficultyMatrix[] = [
  // === 第1フェーズ：基礎固め ===
  {
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
    patternId: "other_cash",
    baseDifficulty: 1,
    adjustmentFactors: [],
    recommendedOrder: 1,
  },
  {
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
    patternId: "basic_four",
    baseDifficulty: 1,
    adjustmentFactors: [],
    recommendedOrder: 2,
  },
  {
    categoryId: "cash_deposit",
    subcategoryId: "other_deposits",
    patternId: "savings_account",
    baseDifficulty: 1,
    adjustmentFactors: [],
    recommendedOrder: 3,
  },

  // === 第2フェーズ：基本取引 ===
  {
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
    patternId: "cash_shortage",
    baseDifficulty: 2,
    adjustmentFactors: [
      {
        condition: "決算時処理",
        adjustment: 1,
        description: "決算時の現金過不足は難易度上昇",
      },
    ],
    recommendedOrder: 4,
  },
  {
    categoryId: "cash_deposit",
    subcategoryId: "cash_transactions",
    patternId: "petty_cash",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 5,
  },
  {
    categoryId: "cash_deposit",
    subcategoryId: "checking_account",
    patternId: "checking_basic",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 6,
  },
  {
    categoryId: "sales_purchase",
    subcategoryId: "basic_trading",
    patternId: "advance_payment",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 7,
  },
  {
    categoryId: "sales_purchase",
    subcategoryId: "returns_discounts",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 8,
  },
  {
    categoryId: "receivable_payable",
    subcategoryId: "accounts_receivable_payable",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 9,
  },

  // === 第3フェーズ：応用取引 ===
  {
    categoryId: "cash_deposit",
    subcategoryId: "checking_account",
    patternId: "overdraft",
    baseDifficulty: 3,
    adjustmentFactors: [],
    recommendedOrder: 10,
  },
  {
    categoryId: "sales_purchase",
    subcategoryId: "shipping_costs",
    baseDifficulty: 3,
    adjustmentFactors: [
      {
        condition: "当社負担と先方負担の混在",
        adjustment: 1,
        description: "負担区分が複雑な場合",
      },
    ],
    recommendedOrder: 11,
  },
  {
    categoryId: "receivable_payable",
    subcategoryId: "notes",
    baseDifficulty: 3,
    adjustmentFactors: [
      {
        condition: "手形の割引・裏書",
        adjustment: 1,
        description: "手形の特殊処理",
      },
    ],
    recommendedOrder: 12,
  },
  {
    categoryId: "salary_tax",
    subcategoryId: "salary_payment",
    baseDifficulty: 2,
    adjustmentFactors: [
      {
        condition: "源泉徴収・社会保険料控除",
        adjustment: 1,
        description: "各種控除を含む給与処理",
      },
    ],
    recommendedOrder: 13,
  },
  {
    categoryId: "fixed_asset",
    subcategoryId: "acquisition",
    baseDifficulty: 3,
    adjustmentFactors: [],
    recommendedOrder: 14,
  },
  {
    categoryId: "fixed_asset",
    subcategoryId: "depreciation",
    patternId: "straight_line",
    baseDifficulty: 3,
    adjustmentFactors: [
      {
        condition: "期中取得",
        adjustment: 1,
        description: "月割計算が必要",
      },
    ],
    recommendedOrder: 15,
  },

  // === 第4フェーズ：決算整理 ===
  {
    categoryId: "adjustment",
    subcategoryId: "provisions",
    patternId: "bad_debt",
    baseDifficulty: 3,
    adjustmentFactors: [
      {
        condition: "個別評価",
        adjustment: 1,
        description: "個別評価による貸倒引当金",
      },
    ],
    recommendedOrder: 16,
  },
  {
    categoryId: "adjustment",
    subcategoryId: "accruals",
    baseDifficulty: 3,
    adjustmentFactors: [],
    recommendedOrder: 17,
  },
  {
    categoryId: "sales_purchase",
    subcategoryId: "year_end_adjustment",
    patternId: "cost_of_sales",
    baseDifficulty: 4,
    adjustmentFactors: [],
    recommendedOrder: 18,
  },
  {
    categoryId: "adjustment",
    subcategoryId: "other_adjustments",
    patternId: "closing_entries",
    baseDifficulty: 4,
    adjustmentFactors: [],
    recommendedOrder: 19,
  },

  // === 第5フェーズ：帳簿・試算表 ===
  {
    categoryId: "cash_book",
    baseDifficulty: 1,
    adjustmentFactors: [
      {
        condition: "複数取引の記帳",
        adjustment: 1,
        description: "複数の入出金取引がある場合",
      },
    ],
    recommendedOrder: 20,
  },
  {
    categoryId: "subsidiary_ledgers",
    baseDifficulty: 2,
    adjustmentFactors: [],
    recommendedOrder: 21,
  },
  {
    categoryId: "account_entries",
    baseDifficulty: 3,
    adjustmentFactors: [],
    recommendedOrder: 22,
  },
  {
    categoryId: "trial_balance",
    baseDifficulty: 3,
    adjustmentFactors: [
      {
        condition: "決算整理後",
        adjustment: 1,
        description: "決算整理後試算表の作成",
      },
    ],
    recommendedOrder: 23,
  },
];

// 学習フェーズ別の難易度進行
export const DIFFICULTY_PROGRESSIONS: DifficultyProgression[] = [
  {
    phase: 1,
    targetDifficulties: [1, 2],
    minimumQuestions: 50,
    masteryRequirement: 80,
  },
  {
    phase: 2,
    targetDifficulties: [2, 3],
    minimumQuestions: 80,
    masteryRequirement: 75,
  },
  {
    phase: 3,
    targetDifficulties: [3, 4],
    minimumQuestions: 60,
    masteryRequirement: 75,
  },
  {
    phase: 4,
    targetDifficulties: [3, 4, 5],
    minimumQuestions: 40,
    masteryRequirement: 70,
  },
];

// 難易度調整関数
export function adjustDifficulty(
  baseDifficulty: QuestionDifficulty,
  factors: AdjustmentFactor[],
  conditions: string[],
): QuestionDifficulty {
  let adjustedDifficulty = baseDifficulty;

  for (const factor of factors) {
    if (conditions.includes(factor.condition)) {
      adjustedDifficulty += factor.adjustment;
    }
  }

  // 1-5の範囲に収める
  return Math.max(1, Math.min(5, adjustedDifficulty)) as QuestionDifficulty;
}

// カテゴリーの推奨学習順序を取得
export function getRecommendedOrder(
  categoryId: string,
  subcategoryId?: string,
  patternId?: string,
): number {
  const matrix = DIFFICULTY_MATRIX.find(
    (m) =>
      m.categoryId === categoryId &&
      (!subcategoryId || m.subcategoryId === subcategoryId) &&
      (!patternId || m.patternId === patternId),
  );

  return matrix ? matrix.recommendedOrder : 999;
}

// フェーズに適した難易度かチェック
export function isAppropriateForPhase(
  difficulty: QuestionDifficulty,
  phase: number,
): boolean {
  const progression = DIFFICULTY_PROGRESSIONS.find((p) => p.phase === phase);
  if (!progression) return false;

  return progression.targetDifficulties.includes(difficulty);
}

// ユーザーレベルに基づく難易度調整
export function adjustDifficultyForUserLevel(
  baseDifficulty: QuestionDifficulty,
  userLevel: "beginner" | "intermediate" | "advanced",
): QuestionDifficulty {
  const adjustments = {
    beginner: -1,
    intermediate: 0,
    advanced: 1,
  };

  const adjusted = baseDifficulty + adjustments[userLevel];
  return Math.max(1, Math.min(5, adjusted)) as QuestionDifficulty;
}

// 難易度分布の推奨比率
export const DIFFICULTY_DISTRIBUTION = {
  1: 0.15, // 15% - 基礎
  2: 0.25, // 25% - 基本
  3: 0.3, // 30% - 標準
  4: 0.2, // 20% - 応用
  5: 0.1, // 10% - 発展
};

// 問題セットの難易度バランスチェック
export function checkDifficultyBalance(
  questions: { difficulty: QuestionDifficulty }[],
): {
  isBalanced: boolean;
  distribution: Record<QuestionDifficulty, number>;
  recommendations: string[];
} {
  const distribution: Record<QuestionDifficulty, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // 実際の分布を計算
  questions.forEach((q) => {
    distribution[q.difficulty]++;
  });

  const total = questions.length;
  const percentages: Record<QuestionDifficulty, number> = {
    1: distribution[1] / total,
    2: distribution[2] / total,
    3: distribution[3] / total,
    4: distribution[4] / total,
    5: distribution[5] / total,
  };

  // バランスチェック
  const recommendations: string[] = [];
  let isBalanced = true;

  for (const level of [1, 2, 3, 4, 5] as QuestionDifficulty[]) {
    const actual = percentages[level];
    const target = DIFFICULTY_DISTRIBUTION[level];
    const deviation = Math.abs(actual - target);

    if (deviation > 0.1) {
      // 10%以上の乖離
      isBalanced = false;
      if (actual < target) {
        recommendations.push(
          `難易度${level}の問題が不足しています（現在: ${(actual * 100).toFixed(1)}%, 推奨: ${(target * 100).toFixed(1)}%）`,
        );
      } else {
        recommendations.push(
          `難易度${level}の問題が多すぎます（現在: ${(actual * 100).toFixed(1)}%, 推奨: ${(target * 100).toFixed(1)}%）`,
        );
      }
    }
  }

  return {
    isBalanced,
    distribution,
    recommendations,
  };
}
