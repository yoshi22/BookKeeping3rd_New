/**
 * 模試サービス
 * 模試の実行・結果計算・分析機能を管理
 */

import { MockExamRepository } from "../data/repositories/mock-exam-repository";
import { QuestionRepository } from "../data/repositories/question-repository";
import { LearningHistoryRepository } from "../data/repositories/learning-history-repository";
import { ReviewItemRepository } from "../data/repositories/review-item-repository";
import { AnswerService } from "./answer-service";

import {
  MockExam,
  MockExamQuestion,
  MockExamResult,
  MockExamStructure,
  Question,
} from "../types/models";
import {
  CBTAnswerData,
  MockExamDetailedResults,
  MockExamQuestionResult,
} from "../types/database";

export interface MockExamSession {
  examId: string;
  startedAt: Date;
  timeLimit: number; // 分
  currentQuestionIndex: number;
  questions: Array<Question & MockExamQuestion>;
  answers: Map<string, CBTAnswerData>;
  sectionProgress: {
    section1: { completed: number; total: number };
    section2: { completed: number; total: number };
    section3: { completed: number; total: number };
  };
}

export interface MockExamSessionResult {
  totalScore: number;
  maxScore: number;
  isPassed: boolean;
  duration: number; // 秒
  sectionResults: {
    section1: {
      score: number;
      maxScore: number;
      questions: MockExamQuestionResult[];
    };
    section2: {
      score: number;
      maxScore: number;
      questions: MockExamQuestionResult[];
    };
    section3: {
      score: number;
      maxScore: number;
      questions: MockExamQuestionResult[];
    };
  };
  incorrectQuestions: string[]; // 復習登録用
}

export class MockExamService {
  private mockExamRepo: MockExamRepository;
  private questionRepo: QuestionRepository;
  private historyRepo: LearningHistoryRepository;
  private reviewRepo: ReviewItemRepository;
  private answerService: AnswerService;

  constructor() {
    this.mockExamRepo = new MockExamRepository();
    this.questionRepo = new QuestionRepository();
    this.historyRepo = new LearningHistoryRepository();
    this.reviewRepo = new ReviewItemRepository();
    this.answerService = new AnswerService();
  }

  // === 模試セッション管理 ===

  /**
   * 利用可能な模試一覧を取得
   */
  async getAvailableMockExams(): Promise<MockExam[]> {
    return await this.mockExamRepo.findAllMockExams();
  }

  /**
   * 模試セッションを開始
   */
  async startMockExamSession(examId: string): Promise<MockExamSession> {
    try {
      // 模試定義を取得
      const exam = await this.mockExamRepo.findMockExamById(examId);
      if (!exam) {
        throw new Error(`模試が見つかりません: ${examId}`);
      }

      // 模試問題を取得
      const examQuestions =
        await this.mockExamRepo.findMockExamQuestionsWithDetails(examId);
      if (examQuestions.length === 0) {
        throw new Error(`模試問題が設定されていません: ${examId}`);
      }

      // セクション別の進捗を初期化
      const sectionProgress = {
        section1: {
          completed: 0,
          total: examQuestions.filter((q: any) => q.section_number === 1)
            .length,
        },
        section2: {
          completed: 0,
          total: examQuestions.filter((q: any) => q.section_number === 2)
            .length,
        },
        section3: {
          completed: 0,
          total: examQuestions.filter((q: any) => q.section_number === 3)
            .length,
        },
      };

      const session: MockExamSession = {
        examId,
        startedAt: new Date(),
        timeLimit: exam.time_limit_minutes,
        currentQuestionIndex: 0,
        questions: examQuestions,
        answers: new Map(),
        sectionProgress,
      };

      return session;
    } catch (error) {
      console.error("Failed to start mock exam session:", error);
      throw error;
    }
  }

  /**
   * 模試セッションで解答を記録
   */
  async recordMockExamAnswer(
    session: MockExamSession,
    questionId: string,
    answer: CBTAnswerData,
    answerTime: number,
  ): Promise<void> {
    try {
      // 解答をセッションに記録
      session.answers.set(questionId, answer);

      // セクション進捗を更新
      const question = session.questions.find(
        (q) => q.question_id === questionId,
      );
      if (question) {
        const sectionKey =
          `section${question.section_number}` as keyof typeof session.sectionProgress;
        session.sectionProgress[sectionKey].completed++;
      }

      // 学習履歴に記録（一時的に判定なしで記録）
      await this.historyRepo.create({
        question_id: questionId,
        user_answer_json: JSON.stringify(answer),
        is_correct: false, // 後で判定
        answer_time_ms: answerTime,
        session_id: `mock_${session.examId}_${session.startedAt.getTime()}`,
        session_type: "mock_exam",
        answered_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to record mock exam answer:", error);
      throw error;
    }
  }

  /**
   * 模試セッションを完了・採点
   */
  async completeMockExamSession(
    session: MockExamSession,
  ): Promise<MockExamSessionResult> {
    try {
      const endTime = new Date();
      const durationSeconds = Math.floor(
        (endTime.getTime() - session.startedAt.getTime()) / 1000,
      );

      // 各問題を採点
      const questionResults = await this.gradeMockExamAnswers(session);

      // セクション別結果を集計
      const sectionResults = this.aggregateSectionResults(questionResults);

      // 総合結果を計算
      const totalScore = Object.values(sectionResults).reduce(
        (sum, section) => sum + section.score,
        0,
      );
      const maxScore = Object.values(sectionResults).reduce(
        (sum, section) => sum + section.maxScore,
        0,
      );
      const isPassed = totalScore >= 70; // 70点以上で合格

      // 不正解問題を抽出
      const incorrectQuestions = questionResults
        .filter((result) => !result.isCorrect)
        .map((result) => result.questionId);

      const result: MockExamSessionResult = {
        totalScore,
        maxScore,
        isPassed,
        duration: durationSeconds,
        sectionResults,
        incorrectQuestions,
      };

      // 結果をデータベースに保存
      await this.saveMockExamResult(session, result);

      // 不正解問題を復習リストに追加
      await this.addIncorrectQuestionsToReview(incorrectQuestions);

      // 学習履歴の正解フラグを更新
      await this.updateLearningHistoryResults(session, questionResults);

      return result;
    } catch (error) {
      console.error("Failed to complete mock exam session:", error);
      throw error;
    }
  }

  // === 採点・分析機能 ===

  /**
   * 模試解答を採点
   */
  private async gradeMockExamAnswers(
    session: MockExamSession,
  ): Promise<MockExamQuestionResult[]> {
    const results: MockExamQuestionResult[] = [];

    for (const question of session.questions) {
      const userAnswer = session.answers.get(question.question_id);
      const mockQuestion = question as MockExamQuestion;

      if (!userAnswer) {
        // 未解答の場合
        results.push({
          questionId: question.question_id,
          sectionNumber: mockQuestion.section_number,
          questionOrder: mockQuestion.question_order,
          maxPoints: mockQuestion.points,
          earnedPoints: 0,
          isCorrect: false,
          userAnswer: null,
          correctAnswer: JSON.parse(question.correct_answer_json),
          answerTime: 0,
        });
        continue;
      }

      // AnswerServiceで正解判定
      const isCorrect = this.answerService.isAnswerCorrect(
        userAnswer,
        question,
      );

      results.push({
        questionId: question.question_id,
        sectionNumber: mockQuestion.section_number,
        questionOrder: mockQuestion.question_order,
        maxPoints: mockQuestion.points,
        earnedPoints: isCorrect ? mockQuestion.points : 0,
        isCorrect,
        userAnswer,
        correctAnswer: JSON.parse(question.correct_answer_json),
        answerTime: 0, // TODO: 実際の解答時間を記録
      });
    }

    return results;
  }

  /**
   * セクション別結果を集計
   */
  private aggregateSectionResults(questionResults: MockExamQuestionResult[]) {
    const sections = [1, 2, 3] as const;
    const sectionResults: MockExamSessionResult["sectionResults"] = {
      section1: { score: 0, maxScore: 0, questions: [] },
      section2: { score: 0, maxScore: 0, questions: [] },
      section3: { score: 0, maxScore: 0, questions: [] },
    };

    for (const section of sections) {
      const sectionQuestions = questionResults.filter(
        (q) => q.sectionNumber === section,
      );
      const sectionKey = `section${section}` as keyof typeof sectionResults;

      sectionResults[sectionKey] = {
        score: sectionQuestions.reduce((sum, q) => sum + q.earnedPoints, 0),
        maxScore: sectionQuestions.reduce((sum, q) => sum + q.maxPoints, 0),
        questions: sectionQuestions,
      };
    }

    return sectionResults;
  }

  /**
   * 模試結果をデータベースに保存
   */
  private async saveMockExamResult(
    session: MockExamSession,
    result: MockExamSessionResult,
  ): Promise<void> {
    const detailedResults: MockExamDetailedResults = {
      examId: session.examId,
      startedAt: session.startedAt.toISOString(),
      completedAt: new Date().toISOString(),
      timeLimit: session.timeLimit,
      actualDuration: result.duration,
      sectionResults: Object.entries(result.sectionResults).map(
        ([sectionName, section]) => ({
          sectionNumber: parseInt(sectionName.replace("section", "")) as
            | 1
            | 2
            | 3,
          sectionName: this.getSectionName(
            parseInt(sectionName.replace("section", "")) as 1 | 2 | 3,
          ),
          score: section.score,
          maxScore: section.maxScore,
          questions: section.questions,
        }),
      ),
      totalCorrect:
        result.sectionResults.section1.questions.filter((q) => q.isCorrect)
          .length +
        result.sectionResults.section2.questions.filter((q) => q.isCorrect)
          .length +
        result.sectionResults.section3.questions.filter((q) => q.isCorrect)
          .length,
      totalQuestions: session.questions.length,
      accuracyRate: result.totalScore / result.maxScore,
      passJudgment: {
        isPassed: result.isPassed,
        requiredScore: 70,
        actualScore: result.totalScore,
      },
    };

    await this.mockExamRepo.createMockExamResult({
      exam_id: session.examId,
      total_score: result.totalScore,
      max_score: result.maxScore,
      is_passed: result.isPassed,
      duration_seconds: result.duration,
      detailed_results_json: JSON.stringify(detailedResults),
    });
  }

  /**
   * 不正解問題を復習リストに追加
   */
  private async addIncorrectQuestionsToReview(
    incorrectQuestions: string[],
  ): Promise<void> {
    for (const questionId of incorrectQuestions) {
      try {
        // 復習アイテムとして追加する（incrementIncorrectCountの代替）
        await this.reviewRepo.create({
          question_id: questionId,
          incorrect_count: 1,
          consecutive_correct_count: 0,
          status: "needs_review",
          priority_score: 80, // 高優先度として設定
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.warn(`Failed to add question to review: ${questionId}`, error);
      }
    }
  }

  /**
   * 学習履歴の正解フラグを更新
   */
  private async updateLearningHistoryResults(
    session: MockExamSession,
    questionResults: MockExamQuestionResult[],
  ): Promise<void> {
    const sessionId = `mock_${session.examId}_${session.startedAt.getTime()}`;

    for (const result of questionResults) {
      try {
        await this.historyRepo.updateCorrectStatus(
          result.questionId,
          sessionId,
          result.isCorrect,
        );
      } catch (error) {
        console.warn(
          `Failed to update learning history: ${result.questionId}`,
          error,
        );
      }
    }
  }

  // === 統計・履歴機能 ===

  /**
   * 模試結果履歴を取得
   */
  async getMockExamHistory(limit?: number): Promise<MockExamResult[]> {
    return await this.mockExamRepo.findMockExamResults({ limit });
  }

  /**
   * 模試統計を取得
   */
  async getMockExamStatistics() {
    return await this.mockExamRepo.getMockExamStatistics();
  }

  /**
   * 模試別統計を取得
   */
  async getMockExamStatisticsByExam() {
    return await this.mockExamRepo.getMockExamStatisticsByExam();
  }

  /**
   * 最新の模試結果を取得
   */
  async getLatestMockExamResult(
    examId?: string,
  ): Promise<MockExamResult | null> {
    return await this.mockExamRepo.findLatestMockExamResult(examId);
  }

  /**
   * 模試結果の詳細を取得
   */
  async getMockExamDetailedResults(
    resultId: number,
  ): Promise<MockExamDetailedResults | null> {
    return await this.mockExamRepo.getMockExamDetailedResults(resultId);
  }

  /**
   * 模試進捗の推移を取得
   */
  async getMockExamTrend(limit: number = 10) {
    return await this.mockExamRepo.getRecentMockExamTrend(limit);
  }

  // === ヘルパーメソッド ===

  private getSectionName(sectionNumber: 1 | 2 | 3): string {
    switch (sectionNumber) {
      case 1:
        return "仕訳";
      case 2:
        return "帳簿";
      case 3:
        return "試算表";
      default:
        return "不明";
    }
  }

  /**
   * 残り時間を計算
   */
  getRemainingTime(session: MockExamSession): number {
    const now = new Date();
    const elapsed = now.getTime() - session.startedAt.getTime();
    const timeLimit = session.timeLimit * 60 * 1000; // 分を ミリ秒に変換
    return Math.max(0, timeLimit - elapsed);
  }

  /**
   * セッション進捗を計算
   */
  getSessionProgress(session: MockExamSession): {
    answeredQuestions: number;
    totalQuestions: number;
    progressPercentage: number;
  } {
    const answeredQuestions = session.answers.size;
    const totalQuestions = session.questions.length;
    const progressPercentage =
      totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    return {
      answeredQuestions,
      totalQuestions,
      progressPercentage,
    };
  }

  /**
   * 模試が完了可能かチェック
   */
  canCompleteMockExam(session: MockExamSession): boolean {
    // 全問題に解答しているかチェック
    return session.answers.size === session.questions.length;
  }

  /**
   * 時間切れかチェック
   */
  isTimeUp(session: MockExamSession): boolean {
    return this.getRemainingTime(session) <= 0;
  }
}
