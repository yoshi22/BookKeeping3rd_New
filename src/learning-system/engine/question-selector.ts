/**
 * 問題選択エンジン
 * 学習戦略に基づいて適切な問題を選択
 */

import { Question, QuestionCategory, QuestionDifficulty } from "@/types/models";
import { LearningPhase, LEARNING_PHASES } from "../strategy/learning-paths";
import {
  getRecommendedPhase,
  getStrategyCategory,
  normalizeTags,
} from "../strategy/category-config";
import {
  isAppropriateForPhase,
  adjustDifficultyForUserLevel,
  getRecommendedOrder,
} from "../strategy/difficulty-matrix";

export interface SelectionCriteria {
  userLevel: "beginner" | "intermediate" | "advanced";
  currentPhase: number;
  completedQuestionIds: string[];
  masteredCategoryIds: string[];
  focusCategories?: string[];
  excludeCategories?: string[];
  targetDifficulty?: QuestionDifficulty;
  maxQuestions?: number;
}

export interface SelectionResult {
  questions: Question[];
  metadata: {
    totalAvailable: number;
    selectedCount: number;
    averageDifficulty: number;
    categoryDistribution: Record<string, number>;
    reason: string;
  };
}

export interface QuestionWithScore extends Question {
  selectionScore: number;
  scoreBreakdown: {
    phaseAlignment: number;
    difficultyAlignment: number;
    categoryPriority: number;
    novelty: number;
    learningOrder: number;
  };
}

// 問題選択エンジンクラス
export class QuestionSelector {
  private allQuestions: Question[];

  constructor(questions: Question[]) {
    this.allQuestions = questions;
  }

  /**
   * 学習戦略に基づいて問題を選択
   */
  selectQuestions(criteria: SelectionCriteria): SelectionResult {
    // フェーズ情報を取得
    const phase =
      LEARNING_PHASES.find((p) => p.phase === criteria.currentPhase) ||
      LEARNING_PHASES[0];

    // 候補問題をフィルタリング
    let candidates = this.filterCandidates(criteria, phase);

    // 各問題にスコアを付与
    const scoredQuestions = this.scoreQuestions(candidates, criteria, phase);

    // スコアでソート
    scoredQuestions.sort((a, b) => b.selectionScore - a.selectionScore);

    // 指定数だけ選択
    const maxCount = criteria.maxQuestions || 10;
    const selected = scoredQuestions.slice(0, maxCount);

    // メタデータを生成
    const metadata = this.generateMetadata(
      selected,
      candidates.length,
      phase,
      criteria,
    );

    return {
      questions: selected,
      metadata,
    };
  }

  /**
   * 候補問題のフィルタリング
   */
  private filterCandidates(
    criteria: SelectionCriteria,
    phase: LearningPhase,
  ): Question[] {
    return this.allQuestions.filter((question) => {
      // 完了済み問題を除外
      if (criteria.completedQuestionIds.includes(question.id)) {
        return false;
      }

      // タグを正規化して戦略カテゴリーを取得
      const tags = question.tags_json ? JSON.parse(question.tags_json) : [];
      const normalizedTags = normalizeTags(tags);
      const strategyInfo = getStrategyCategory(normalizedTags);

      // フォーカスカテゴリーのチェック
      if (criteria.focusCategories && criteria.focusCategories.length > 0) {
        if (!phase.focusCategories.includes("all")) {
          const categoryMatch =
            strategyInfo &&
            criteria.focusCategories.includes(strategyInfo.categoryId);
          if (!categoryMatch) return false;
        }
      }

      // 除外カテゴリーのチェック
      if (criteria.excludeCategories && criteria.excludeCategories.length > 0) {
        if (
          strategyInfo &&
          criteria.excludeCategories.includes(strategyInfo.categoryId)
        ) {
          return false;
        }
      }

      // マスター済みカテゴリーのチェック
      if (criteria.masteredCategoryIds.length > 0) {
        if (
          strategyInfo &&
          criteria.masteredCategoryIds.includes(strategyInfo.categoryId)
        ) {
          return false;
        }
      }

      // フェーズに適した難易度かチェック
      const adjustedDifficulty = adjustDifficultyForUserLevel(
        question.difficulty,
        criteria.userLevel,
      );
      if (!isAppropriateForPhase(adjustedDifficulty, phase.phase)) {
        return false;
      }

      return true;
    });
  }

  /**
   * 問題のスコアリング
   */
  private scoreQuestions(
    questions: Question[],
    criteria: SelectionCriteria,
    phase: LearningPhase,
  ): QuestionWithScore[] {
    return questions.map((question) => {
      const tags = question.tags_json ? JSON.parse(question.tags_json) : [];
      const normalizedTags = normalizeTags(tags);
      const strategyInfo = getStrategyCategory(normalizedTags);

      const scoreBreakdown = {
        // フェーズとの整合性（0-30点）
        phaseAlignment: this.calculatePhaseAlignment(question, phase),

        // 難易度の適切性（0-25点）
        difficultyAlignment: this.calculateDifficultyAlignment(
          question.difficulty,
          criteria,
        ),

        // カテゴリーの優先度（0-20点）
        categoryPriority: this.calculateCategoryPriority(
          strategyInfo?.categoryId || "unknown",
          phase,
        ),

        // 新規性（未回答の価値）（0-15点）
        novelty: 15, // 全て未回答なので満点

        // 学習順序（0-10点）
        learningOrder: this.calculateLearningOrder(
          strategyInfo?.categoryId || "unknown",
          strategyInfo?.subcategoryId,
          strategyInfo?.patternId,
        ),
      };

      const selectionScore = Object.values(scoreBreakdown).reduce(
        (a, b) => a + b,
        0,
      );

      return {
        ...question,
        selectionScore,
        scoreBreakdown,
      } as QuestionWithScore;
    });
  }

  /**
   * フェーズ整合性スコアの計算
   */
  private calculatePhaseAlignment(
    question: Question,
    phase: LearningPhase,
  ): number {
    const recommendedPhase = getRecommendedPhase(question.difficulty);
    const phaseDiff = Math.abs(recommendedPhase - phase.phase);

    // 差が0なら30点、1なら20点、2なら10点、3以上なら0点
    const scores = [30, 20, 10, 0];
    return scores[Math.min(phaseDiff, 3)];
  }

  /**
   * 難易度整合性スコアの計算
   */
  private calculateDifficultyAlignment(
    difficulty: QuestionDifficulty,
    criteria: SelectionCriteria,
  ): number {
    const targetDifficulty =
      criteria.targetDifficulty ||
      (criteria.userLevel === "beginner"
        ? 2
        : criteria.userLevel === "intermediate"
          ? 3
          : 4);

    const diff = Math.abs(difficulty - targetDifficulty);

    // 差が0なら25点、1なら15点、2なら5点、3以上なら0点
    const scores = [25, 15, 5, 0];
    return scores[Math.min(diff, 3)];
  }

  /**
   * カテゴリー優先度スコアの計算
   */
  private calculateCategoryPriority(
    categoryId: string,
    phase: LearningPhase,
  ): number {
    if (phase.focusCategories.includes("all")) {
      return 10; // 全カテゴリー対象の場合は中間点
    }

    if (phase.focusCategories.includes(categoryId)) {
      return 20; // フォーカスカテゴリーなら満点
    }

    return 0; // それ以外
  }

  /**
   * 学習順序スコアの計算
   */
  private calculateLearningOrder(
    categoryId: string,
    subcategoryId?: string,
    patternId?: string,
  ): number {
    const order = getRecommendedOrder(categoryId, subcategoryId, patternId);

    // 順序が早いほど高スコア
    if (order <= 5) return 10;
    if (order <= 10) return 8;
    if (order <= 15) return 5;
    if (order <= 20) return 3;
    return 1;
  }

  /**
   * メタデータの生成
   */
  private generateMetadata(
    selected: QuestionWithScore[],
    totalAvailable: number,
    phase: LearningPhase,
    criteria: SelectionCriteria,
  ): SelectionResult["metadata"] {
    // 平均難易度を計算
    const averageDifficulty =
      selected.length > 0
        ? selected.reduce((sum, q) => sum + q.difficulty, 0) / selected.length
        : 0;

    // カテゴリー分布を計算
    const categoryDistribution: Record<string, number> = {};
    selected.forEach((question) => {
      const tags = question.tags_json ? JSON.parse(question.tags_json) : [];
      const normalizedTags = normalizeTags(tags);
      const strategyInfo = getStrategyCategory(normalizedTags);
      const categoryId = strategyInfo?.categoryId || "unknown";

      categoryDistribution[categoryId] =
        (categoryDistribution[categoryId] || 0) + 1;
    });

    // 選択理由を生成
    const reason = this.generateSelectionReason(
      phase,
      criteria,
      selected.length,
      totalAvailable,
    );

    return {
      totalAvailable,
      selectedCount: selected.length,
      averageDifficulty,
      categoryDistribution,
      reason,
    };
  }

  /**
   * 選択理由の生成
   */
  private generateSelectionReason(
    phase: LearningPhase,
    criteria: SelectionCriteria,
    selectedCount: number,
    totalAvailable: number,
  ): string {
    const parts: string[] = [];

    parts.push(`フェーズ${phase.phase}「${phase.name}」の問題を選択`);
    parts.push(`ユーザーレベル: ${criteria.userLevel}`);

    if (criteria.focusCategories && criteria.focusCategories.length > 0) {
      parts.push(`重点カテゴリー: ${criteria.focusCategories.join(", ")}`);
    }

    if (criteria.targetDifficulty) {
      parts.push(`目標難易度: ${criteria.targetDifficulty}`);
    }

    parts.push(`${totalAvailable}問中${selectedCount}問を選択`);

    return parts.join(" / ");
  }

  /**
   * 適応型問題選択（ユーザーの成績に基づく）
   */
  selectAdaptiveQuestions(
    userPerformance: {
      correctRate: number;
      averageTime: number;
      streakCount: number;
    },
    criteria: SelectionCriteria,
  ): SelectionResult {
    // パフォーマンスに基づいて難易度を調整
    let adjustedCriteria = { ...criteria };

    if (userPerformance.correctRate > 0.8 && userPerformance.streakCount > 3) {
      // 成績が良い場合は難易度を上げる
      adjustedCriteria.targetDifficulty = Math.min(
        5,
        (criteria.targetDifficulty || 3) + 1,
      ) as QuestionDifficulty;
    } else if (userPerformance.correctRate < 0.5) {
      // 成績が悪い場合は難易度を下げる
      adjustedCriteria.targetDifficulty = Math.max(
        1,
        (criteria.targetDifficulty || 3) - 1,
      ) as QuestionDifficulty;
    }

    return this.selectQuestions(adjustedCriteria);
  }
}
