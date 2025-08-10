/**
 * 模試関連データアクセス Repository
 * 模試定義・模試問題・模試結果の CRUD 操作を管理
 */

import { BaseRepository } from "./base-repository";
import { databaseService } from "../database";
import {
  MockExam,
  MockExamQuestion,
  MockExamResult,
  MockExamStructure,
  QueryFilter,
} from "../../types/models";
import { MockExamDetailedResults } from "../../types/database";

export class MockExamRepository extends BaseRepository<MockExam> {
  constructor() {
    super("mock_exams");
  }

  // === 模試定義操作 ===

  /**
   * 全ての有効な模試を取得
   */
  async findAllMockExams(): Promise<MockExam[]> {
    try {
      const result = await databaseService.executeSql(
        "SELECT * FROM mock_exams WHERE is_active = 1 ORDER BY id",
      );

      return result.rows.map((row: any) => ({
        ...row,
        is_active: Boolean(row.is_active),
      }));
    } catch (error) {
      console.error("MockExamRepository.findAllMockExams error:", error);
      throw error;
    }
  }

  /**
   * ID で模試を取得
   */
  async findMockExamById(examId: string): Promise<MockExam | null> {
    try {
      const result = await databaseService.executeSql(
        "SELECT * FROM mock_exams WHERE id = ? AND is_active = 1",
        [examId],
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        is_active: Boolean(row.is_active),
      };
    } catch (error) {
      console.error("MockExamRepository.findMockExamById error:", error);
      throw error;
    }
  }

  /**
   * 模試の構成情報を取得（JSON デシリアライズ済み）
   */
  async getMockExamStructure(
    examId: string,
  ): Promise<MockExamStructure | null> {
    try {
      const exam = await this.findMockExamById(examId);
      if (!exam) {
        return null;
      }

      return JSON.parse(exam.structure_json) as MockExamStructure;
    } catch (error) {
      console.error("MockExamRepository.getMockExamStructure");
      throw error;
    }
  }

  // === 模試問題関連操作 ===

  /**
   * 模試の問題一覧を取得（セクション・順序で並べ替え）
   */
  async findMockExamQuestions(examId: string): Promise<MockExamQuestion[]> {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT * FROM mock_exam_questions 
        WHERE mock_exam_id = ? 
        ORDER BY section_number ASC, question_order ASC
      `,
        [examId],
      );

      return result.rows;
    } catch (error) {
      console.error("MockExamRepository.findMockExamQuestions");
      throw error;
    }
  }

  /**
   * 模試の特定セクション問題を取得
   */
  async findMockExamQuestionsBySection(
    examId: string,
    sectionNumber: 1 | 2 | 3,
  ): Promise<MockExamQuestion[]> {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT * FROM mock_exam_questions 
        WHERE mock_exam_id = ? AND section_number = ?
        ORDER BY question_order ASC
      `,
        [examId, sectionNumber],
      );

      return result.rows;
    } catch (error) {
      console.error("MockExamRepository.findMockExamQuestionsBySection");
      throw error;
    }
  }

  /**
   * 模試問題と実際の問題データを結合して取得
   */
  async findMockExamQuestionsWithDetails(examId: string) {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT 
          meq.*,
          q.question_text,
          q.answer_template_json,
          q.correct_answer_json,
          q.explanation,
          q.difficulty,
          q.category_id
        FROM mock_exam_questions meq
        INNER JOIN questions q ON meq.question_id = q.id
        WHERE meq.mock_exam_id = ?
        ORDER BY meq.section_number ASC, meq.question_order ASC
      `,
        [examId],
      );

      return result.rows;
    } catch (error) {
      console.error("MockExamRepository.findMockExamQuestionsWithDetails");
      throw error;
    }
  }

  /**
   * 模試問題を追加
   */
  async createMockExamQuestion(
    data: Omit<MockExamQuestion, "id">,
  ): Promise<number> {
    try {
      const result = await databaseService.executeSql(
        `
        INSERT INTO mock_exam_questions (
          mock_exam_id, question_id, section_number, question_order, points
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [
          data.mock_exam_id,
          data.question_id,
          data.section_number,
          data.question_order,
          data.points,
        ],
      );

      return result.insertId || 0;
    } catch (error) {
      console.error("MockExamRepository.createMockExamQuestion");
      throw error;
    }
  }

  // === 模試結果操作 ===

  /**
   * 模試結果を記録
   */
  async createMockExamResult(
    data: Omit<MockExamResult, "id" | "taken_at">,
  ): Promise<number> {
    try {
      const result = await databaseService.executeSql(
        `
        INSERT INTO mock_exam_results (
          exam_id, total_score, max_score, is_passed, 
          duration_seconds, detailed_results_json, taken_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
        [
          data.exam_id,
          data.total_score,
          data.max_score,
          data.is_passed ? 1 : 0,
          data.duration_seconds,
          data.detailed_results_json,
        ],
      );

      return result.insertId || 0;
    } catch (error) {
      console.error("MockExamRepository.createMockExamResult");
      throw error;
    }
  }

  /**
   * ユーザーの模試結果履歴を取得
   */
  async findMockExamResults(
    filter: QueryFilter = {},
  ): Promise<MockExamResult[]> {
    try {
      let query = "SELECT * FROM mock_exam_results";
      const params: any[] = [];

      const conditions: string[] = [];

      if (filter.dateFrom) {
        conditions.push("taken_at >= ?");
        params.push(filter.dateFrom);
      }

      if (filter.dateTo) {
        conditions.push("taken_at <= ?");
        params.push(filter.dateTo);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY taken_at DESC";

      if (filter.limit) {
        query += " LIMIT ?";
        params.push(filter.limit);
      }

      const result = await databaseService.executeSql(query, params);

      return result.rows.map((row: any) => ({
        ...row,
        is_passed: Boolean(row.is_passed),
      }));
    } catch (error) {
      console.error("MockExamRepository.findMockExamResults");
      throw error;
    }
  }

  /**
   * 特定の模試の結果履歴を取得
   */
  async findMockExamResultsByExamId(examId: string): Promise<MockExamResult[]> {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT * FROM mock_exam_results 
        WHERE exam_id = ? 
        ORDER BY taken_at DESC
      `,
        [examId],
      );

      return result.rows.map((row: any) => ({
        ...row,
        is_passed: Boolean(row.is_passed),
      }));
    } catch (error) {
      console.error("MockExamRepository.findMockExamResultsByExamId");
      throw error;
    }
  }

  /**
   * 最新の模試結果を取得
   */
  async findLatestMockExamResult(
    examId?: string,
  ): Promise<MockExamResult | null> {
    try {
      let query = "SELECT * FROM mock_exam_results";
      const params: any[] = [];

      if (examId) {
        query += " WHERE exam_id = ?";
        params.push(examId);
      }

      query += " ORDER BY taken_at DESC LIMIT 1";

      const result = await databaseService.executeSql(query, params);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        is_passed: Boolean(row.is_passed),
      };
    } catch (error) {
      console.error("MockExamRepository.findLatestMockExamResult");
      throw error;
    }
  }

  /**
   * 模試結果の詳細データを取得（JSON デシリアライズ済み）
   */
  async getMockExamDetailedResults(
    resultId: number,
  ): Promise<MockExamDetailedResults | null> {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT detailed_results_json FROM mock_exam_results WHERE id = ?
      `,
        [resultId],
      );

      if (result.rows.length === 0) {
        return null;
      }

      return JSON.parse(
        result.rows[0].detailed_results_json,
      ) as MockExamDetailedResults;
    } catch (error) {
      console.error("MockExamRepository.getMockExamDetailedResults");
      throw error;
    }
  }

  // === 統計・分析操作 ===

  /**
   * 模試統計を取得
   */
  async getMockExamStatistics() {
    try {
      const result = await databaseService.executeSql(`
        SELECT 
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN is_passed = 1 THEN 1 END) as passed_attempts,
          AVG(total_score) as average_score,
          MAX(total_score) as best_score,
          MIN(total_score) as worst_score,
          AVG(duration_seconds) as average_time
        FROM mock_exam_results
      `);

      const stats = result.rows[0];

      return {
        totalAttempts: stats.total_attempts || 0,
        passedAttempts: stats.passed_attempts || 0,
        passRate:
          stats.total_attempts > 0
            ? stats.passed_attempts / stats.total_attempts
            : 0,
        averageScore: stats.average_score || 0,
        bestScore: stats.best_score || 0,
        worstScore: stats.worst_score || 0,
        averageTime: stats.average_time || 0,
      };
    } catch (error) {
      console.error("MockExamRepository.getMockExamStatistics");
      throw error;
    }
  }

  /**
   * 模試別の統計情報を取得
   */
  async getMockExamStatisticsByExam() {
    try {
      const result = await databaseService.executeSql(`
        SELECT 
          exam_id,
          COUNT(*) as attempt_count,
          COUNT(CASE WHEN is_passed = 1 THEN 1 END) as pass_count,
          AVG(total_score) as average_score,
          MAX(total_score) as best_score,
          AVG(duration_seconds) as average_time
        FROM mock_exam_results
        GROUP BY exam_id
        ORDER BY exam_id
      `);

      return result.rows.map((row: any) => ({
        examId: row.exam_id,
        attemptCount: row.attempt_count,
        passCount: row.pass_count,
        passRate:
          row.attempt_count > 0 ? row.pass_count / row.attempt_count : 0,
        averageScore: row.average_score || 0,
        bestScore: row.best_score || 0,
        averageTime: row.average_time || 0,
      }));
    } catch (error) {
      console.error("MockExamRepository.getMockExamStatisticsByExam");
      throw error;
    }
  }

  /**
   * 最近の模試結果の推移を取得
   */
  async getRecentMockExamTrend(limit: number = 10) {
    try {
      const result = await databaseService.executeSql(
        `
        SELECT 
          exam_id,
          total_score,
          is_passed,
          duration_seconds,
          taken_at
        FROM mock_exam_results
        ORDER BY taken_at DESC
        LIMIT ?
      `,
        [limit],
      );

      return result.rows.map((row: any) => ({
        examId: row.exam_id,
        score: row.total_score,
        passed: Boolean(row.is_passed),
        duration: row.duration_seconds,
        takenAt: row.taken_at,
      }));
    } catch (error) {
      console.error("MockExamRepository.getRecentMockExamTrend");
      throw error;
    }
  }
}
