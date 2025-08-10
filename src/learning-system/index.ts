/**
 * 学習システム統合エクスポート
 * 新しい学習システムの全機能を統合的に提供
 */

// 戦略関連
export * from "./strategy/learning-paths";
export * from "./strategy/category-config";
export * from "./strategy/difficulty-matrix";

// エンジン関連
export * from "./engine/question-selector";

// 統合ヘルパー関数
import { Question } from "@/types/models";
import {
  QuestionSelector,
  SelectionCriteria,
} from "./engine/question-selector";
import {
  JOURNAL_CATEGORIES,
  LEDGER_CATEGORIES,
  TRIAL_BALANCE_CATEGORIES,
  LEARNING_PHASES,
  getLearningPath,
} from "./strategy/learning-paths";

/**
 * 学習システムの初期化
 */
export class LearningSystem {
  private questionSelector: QuestionSelector;
  private currentPhase: number;
  private userLevel: "beginner" | "intermediate" | "advanced";

  constructor(
    questions: Question[],
    userLevel: "beginner" | "intermediate" | "advanced" = "beginner",
  ) {
    this.questionSelector = new QuestionSelector(questions);
    this.userLevel = userLevel;
    this.currentPhase = 1;
  }

  /**
   * 現在のフェーズを設定
   */
  setPhase(phase: number): void {
    this.currentPhase = phase;
  }

  /**
   * ユーザーレベルを設定
   */
  setUserLevel(level: "beginner" | "intermediate" | "advanced"): void {
    this.userLevel = level;
  }

  /**
   * 次の学習問題を取得
   */
  getNextQuestions(
    completedQuestionIds: string[] = [],
    masteredCategoryIds: string[] = [],
    maxQuestions: number = 10,
  ) {
    const criteria: SelectionCriteria = {
      userLevel: this.userLevel,
      currentPhase: this.currentPhase,
      completedQuestionIds,
      masteredCategoryIds,
      maxQuestions,
    };

    return this.questionSelector.selectQuestions(criteria);
  }

  /**
   * 適応型学習で問題を取得
   */
  getAdaptiveQuestions(
    userPerformance: {
      correctRate: number;
      averageTime: number;
      streakCount: number;
    },
    completedQuestionIds: string[] = [],
    masteredCategoryIds: string[] = [],
    maxQuestions: number = 10,
  ) {
    const criteria: SelectionCriteria = {
      userLevel: this.userLevel,
      currentPhase: this.currentPhase,
      completedQuestionIds,
      masteredCategoryIds,
      maxQuestions,
    };

    return this.questionSelector.selectAdaptiveQuestions(
      userPerformance,
      criteria,
    );
  }

  /**
   * 学習戦略情報を取得
   */
  getStrategyInfo() {
    const learningPath = getLearningPath(this.userLevel);
    const currentPhaseInfo = LEARNING_PHASES.find(
      (p) => p.phase === this.currentPhase,
    );

    return {
      userLevel: this.userLevel,
      currentPhase: this.currentPhase,
      phaseInfo: currentPhaseInfo,
      totalPhases: LEARNING_PHASES.length,
      learningPath,
      categories: {
        journal: JOURNAL_CATEGORIES,
        ledger: LEDGER_CATEGORIES,
        trial_balance: TRIAL_BALANCE_CATEGORIES,
      },
    };
  }

  /**
   * フェーズの進行判定
   */
  shouldProgressToNextPhase(
    completedQuestions: number,
    averageCorrectRate: number,
  ): boolean {
    const currentPhaseInfo = LEARNING_PHASES.find(
      (p) => p.phase === this.currentPhase,
    );
    if (!currentPhaseInfo) return false;

    // 必要な習得率を達成しているかチェック
    return averageCorrectRate >= currentPhaseInfo.requiredMastery / 100;
  }

  /**
   * 次のフェーズへ進む
   */
  progressToNextPhase(): boolean {
    if (this.currentPhase < LEARNING_PHASES.length) {
      this.currentPhase++;
      return true;
    }
    return false;
  }
}

// デフォルトエクスポート
export default LearningSystem;
