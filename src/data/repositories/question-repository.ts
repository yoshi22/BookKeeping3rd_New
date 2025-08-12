/**
 * 問題データRepository
 * 簿記3級問題集アプリ - CBT形式対応問題管理
 */

import { BaseRepository } from "./base-repository";
import {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from "../../types/models";
import { QueryFilter } from "../../types/models";

/**
 * 問題検索フィルター
 */
export interface QuestionFilter extends QueryFilter {
  category?: QuestionCategory;
  difficulty?: QuestionDifficulty;
  tags?: string[];
  excludeIds?: string[];
  randomize?: boolean;
}

/**
 * 問題統計情報
 */
export interface QuestionStats {
  totalQuestions: number;
  categoryBreakdown: {
    journal: number;
    ledger: number;
    trial_balance: number;
    financial_statement: number;
  };
  difficultyBreakdown: Record<QuestionDifficulty, number>;
  averageDifficulty: number;
}

/**
 * 問題Repositoryクラス
 * 新コンテンツ構成（仕訳250問・帳簿40問・試算表12問）に対応
 */
export class QuestionRepository extends BaseRepository<Question> {
  constructor() {
    super("questions");
  }

  /**
   * カテゴリ別問題取得（新コンテンツ構成対応）
   */
  public async findByCategory(
    category: QuestionCategory,
    options: {
      difficulty?: QuestionDifficulty;
      limit?: number;
      randomize?: boolean;
      excludeIds?: string[];
      useProblemsStrategyOrder?: boolean;
    } = {},
  ): Promise<Question[]> {
    try {
      let sql = "SELECT * FROM questions WHERE category_id = ?";
      const params: any[] = [category];

      // 難易度フィルター
      if (options.difficulty) {
        sql += " AND difficulty = ?";
        params.push(options.difficulty);
      }

      // 除外ID
      if (options.excludeIds && options.excludeIds.length > 0) {
        const placeholders = options.excludeIds.map(() => "?").join(", ");
        sql += ` AND id NOT IN (${placeholders})`;
        params.push(...options.excludeIds);
      }

      // ソート順序の決定
      if (options.randomize) {
        sql += " ORDER BY RANDOM()";
      } else if (options.useProblemsStrategyOrder) {
        // problemsStrategy.mdに基づく順序
        sql += " ORDER BY section_number ASC, question_order ASC";
      } else {
        // 従来の順序
        sql += " ORDER BY id ASC";
      }

      // 制限
      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] カテゴリ ${category} から ${result.rows.length}問取得 (problemsStrategy順序: ${options.useProblemsStrategyOrder || false})`,
      );
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findByCategory エラー:`, error);
      throw error;
    }
  }

  /**
   * 未学習問題取得
   */
  public async findUnstudiedQuestions(
    category?: QuestionCategory,
    limit: number = 10,
  ): Promise<Question[]> {
    try {
      let sql = `
        SELECT q.* FROM questions q
        LEFT JOIN learning_history lh ON q.id = lh.question_id
        WHERE lh.question_id IS NULL
      `;
      const params: any[] = [];

      if (category) {
        sql += " AND q.category_id = ?";
        params.push(category);
      }

      sql += " ORDER BY q.difficulty ASC, q.id ASC LIMIT ?";
      params.push(limit);

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] 未学習問題 ${result.rows.length}問取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(
        `[QuestionRepository] findUnstudiedQuestions エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 復習対象問題取得（優先度順）
   */
  public async findReviewQuestions(
    category?: QuestionCategory,
    limit: number = 10,
  ): Promise<Question[]> {
    try {
      let sql = `
        SELECT q.*, ri.priority_score, ri.incorrect_count, ri.status
        FROM questions q
        INNER JOIN review_items ri ON q.id = ri.question_id
        WHERE ri.status IN ('needs_review', 'priority_review')
      `;
      const params: any[] = [];

      if (category) {
        sql += " AND q.category_id = ?";
        params.push(category);
      }

      sql +=
        " ORDER BY ri.priority_score DESC, ri.last_answered_at ASC LIMIT ?";
      params.push(limit);

      const result = await this.executeQuery<Question>(sql, params);

      console.log(`[QuestionRepository] 復習問題 ${result.rows.length}問取得`);
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findReviewQuestions エラー:`, error);
      throw error;
    }
  }

  /**
   * 問題ID配列による取得（模試用）
   */
  public async findByIds(questionIds: string[]): Promise<Question[]> {
    try {
      if (questionIds.length === 0) {
        return [];
      }

      const placeholders = questionIds.map(() => "?").join(", ");
      const sql = `SELECT * FROM questions WHERE id IN (${placeholders}) ORDER BY id`;

      const result = await this.executeQuery<Question>(sql, questionIds);

      console.log(`[QuestionRepository] ID指定で ${result.rows.length}問取得`);
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findByIds エラー:`, error);
      throw error;
    }
  }

  /**
   * タグによる検索
   */
  public async findByTag(
    tag: string,
    category?: QuestionCategory,
    limit?: number,
  ): Promise<Question[]> {
    try {
      let sql = `
        SELECT * FROM questions 
        WHERE tags_json IS NOT NULL 
        AND json_extract(tags_json, '$') LIKE ?
      `;
      const params: any[] = [`%"${tag}"%`];

      if (category) {
        sql += " AND category_id = ?";
        params.push(category);
      }

      sql += " ORDER BY id ASC";

      if (limit) {
        sql += " LIMIT ?";
        params.push(limit);
      }

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] タグ "${tag}" で ${result.rows.length}問取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findByTag エラー:`, error);
      throw error;
    }
  }

  /**
   * problemsStrategy.mdに基づく問題取得（セクション・順序・サブカテゴリ対応）
   */
  public async findWithProblemsStrategyOrder(
    options: {
      sectionNumber?: 1 | 2 | 3;
      subcategory?: string;
      patternType?: string;
      difficulty?: QuestionDifficulty;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<Question[]> {
    try {
      let sql = "SELECT * FROM questions WHERE 1=1";
      const params: any[] = [];

      // セクション番号フィルタ（第1問、第2問、第3問）
      if (options.sectionNumber) {
        sql += " AND section_number = ?";
        params.push(options.sectionNumber);
      }

      // サブカテゴリフィルタ
      if (options.subcategory) {
        sql += " AND subcategory = ?";
        params.push(options.subcategory);
      }

      // パターンタイプフィルタ
      if (options.patternType) {
        sql += " AND pattern_type = ?";
        params.push(options.patternType);
      }

      // 難易度フィルタ
      if (options.difficulty) {
        sql += " AND difficulty = ?";
        params.push(options.difficulty);
      }

      // problemsStrategy.mdの順序に従ってソート
      sql += " ORDER BY section_number ASC, question_order ASC";

      // ページネーション
      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);

        if (options.offset) {
          sql += " OFFSET ?";
          params.push(options.offset);
        }
      }

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] problemsStrategy順序で ${result.rows.length}問取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(
        `[QuestionRepository] findWithProblemsStrategyOrder エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * サブカテゴリ一覧取得（problemsStrategy.md基準）
   */
  public async getSubcategoriesWithCounts(sectionNumber?: 1 | 2 | 3): Promise<
    Array<{
      subcategory: string;
      pattern_type: string;
      count: number;
      section_number: number;
    }>
  > {
    try {
      let sql = `
        SELECT 
          subcategory,
          pattern_type,
          section_number,
          COUNT(*) as count
        FROM questions 
        WHERE subcategory IS NOT NULL
      `;
      const params: any[] = [];

      if (sectionNumber) {
        sql += " AND section_number = ?";
        params.push(sectionNumber);
      }

      sql += `
        GROUP BY subcategory, pattern_type, section_number
        ORDER BY section_number ASC, MIN(question_order) ASC
      `;

      const result = await this.executeQuery<{
        subcategory: string;
        pattern_type: string;
        count: number;
        section_number: number;
      }>(sql, params);

      console.log(
        `[QuestionRepository] サブカテゴリ一覧 ${result.rows.length}件取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(
        `[QuestionRepository] getSubcategoriesWithCounts エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 問題のタグ情報を解析して3層階層で取得
   */
  public async getQuestionWithTagHierarchy(questionId: string): Promise<
    Question & {
      tagHierarchy?: {
        category: string;
        pattern: string;
        detailed: string[];
      };
    }
  > {
    try {
      const question = await this.findById(questionId);
      if (!question) {
        throw new Error(`Question not found: ${questionId}`);
      }

      let tagHierarchy = undefined;

      if (question.tags_json) {
        try {
          const tags = JSON.parse(question.tags_json);

          // サブカテゴリからカテゴリ名を取得
          const categoryMap: { [key: string]: string } = {
            cash_deposit: "現金・預金取引",
            merchandise_trade: "商品売買取引",
            receivables_debts: "債権・債務",
            salary_tax: "給与・税金",
            fixed_assets: "固定資産",
            year_end_adj: "決算整理",
            account_posting: "勘定記入問題",
            subsidiary_books: "補助簿記入問題",
            voucher_entry: "伝票記入問題",
            theory_selection: "理論・選択問題",
            financial_statements: "財務諸表作成",
            worksheet: "精算表作成",
            trial_balance: "試算表作成",
          };

          tagHierarchy = {
            category:
              categoryMap[question.subcategory as string] ||
              question.subcategory ||
              "",
            pattern: question.pattern_type || "",
            detailed: Array.isArray(tags) ? tags : [],
          };
        } catch (parseError) {
          console.warn(
            `[QuestionRepository] タグJSON解析エラー for ${questionId}:`,
            parseError,
          );
        }
      }

      return { ...question, tagHierarchy };
    } catch (error) {
      console.error(
        `[QuestionRepository] getQuestionWithTagHierarchy エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 問題統計情報（problemsStrategy.md基準）
   */
  public async getProblemsStrategyStats(): Promise<{
    totalQuestions: number;
    sectionBreakdown: Record<1 | 2 | 3, number>;
    subcategoryBreakdown: Record<string, number>;
    patternBreakdown: Record<string, number>;
  }> {
    try {
      // 全問題数
      const totalResult = await this.executeQuery<{ count: number }>(
        "SELECT COUNT(*) as count FROM questions",
      );
      const totalQuestions = totalResult.rows[0]?.count || 0;

      // セクション別集計
      const sectionResult = await this.executeQuery<{
        section_number: 1 | 2 | 3;
        count: number;
      }>(
        "SELECT section_number, COUNT(*) as count FROM questions WHERE section_number IS NOT NULL GROUP BY section_number",
      );

      const sectionBreakdown: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
      sectionResult.rows.forEach((row) => {
        sectionBreakdown[row.section_number] = row.count;
      });

      // サブカテゴリ別集計
      const subcategoryResult = await this.executeQuery<{
        subcategory: string;
        count: number;
      }>(
        "SELECT subcategory, COUNT(*) as count FROM questions WHERE subcategory IS NOT NULL GROUP BY subcategory",
      );

      const subcategoryBreakdown: Record<string, number> = {};
      subcategoryResult.rows.forEach((row) => {
        subcategoryBreakdown[row.subcategory] = row.count;
      });

      // パターン別集計
      const patternResult = await this.executeQuery<{
        pattern_type: string;
        count: number;
      }>(
        "SELECT pattern_type, COUNT(*) as count FROM questions WHERE pattern_type IS NOT NULL GROUP BY pattern_type",
      );

      const patternBreakdown: Record<string, number> = {};
      patternResult.rows.forEach((row) => {
        patternBreakdown[row.pattern_type] = row.count;
      });

      const stats = {
        totalQuestions,
        sectionBreakdown,
        subcategoryBreakdown,
        patternBreakdown,
      };

      console.log(
        "[QuestionRepository] problemsStrategy統計情報取得完了:",
        stats,
      );
      return stats;
    } catch (error) {
      console.error(
        "[QuestionRepository] getProblemsStrategyStats エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * 問題統計情報取得（新コンテンツ構成対応）
   */
  public async getStats(): Promise<QuestionStats> {
    try {
      // 全問題数取得
      const totalResult = await this.executeQuery<{ count: number }>(
        "SELECT COUNT(*) as count FROM questions",
      );
      const totalQuestions = totalResult.rows[0]?.count || 0;

      // カテゴリ別集計
      const categoryResult = await this.executeQuery<{
        category_id: QuestionCategory;
        count: number;
      }>(
        "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id",
      );

      const categoryBreakdown = {
        journal: 0,
        ledger: 0,
        trial_balance: 0,
        financial_statement: 0,
      };

      categoryResult.rows.forEach((row) => {
        categoryBreakdown[row.category_id] = row.count;
      });

      // 難易度別集計
      const difficultyResult = await this.executeQuery<{
        difficulty: QuestionDifficulty;
        count: number;
      }>(
        "SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty",
      );

      const difficultyBreakdown: Record<QuestionDifficulty, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      difficultyResult.rows.forEach((row) => {
        difficultyBreakdown[row.difficulty] = row.count;
      });

      // 平均難易度計算
      const avgResult = await this.executeQuery<{ avg_difficulty: number }>(
        "SELECT AVG(difficulty) as avg_difficulty FROM questions",
      );
      const averageDifficulty = avgResult.rows[0]?.avg_difficulty || 0;

      const stats: QuestionStats = {
        totalQuestions,
        categoryBreakdown,
        difficultyBreakdown,
        averageDifficulty: Math.round(averageDifficulty * 100) / 100,
      };

      console.log("[QuestionRepository] 問題統計情報取得完了:", stats);
      return stats;
    } catch (error) {
      console.error("[QuestionRepository] getStats エラー:", error);
      throw error;
    }
  }

  /**
   * カテゴリ別問題数を取得（学習画面用）
   */
  public async getQuestionCountsByCategory(): Promise<
    Record<QuestionCategory, number>
  > {
    try {
      const categoryResult = await this.executeQuery<{
        category_id: QuestionCategory;
        count: number;
      }>(
        "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id",
      );

      const counts: Record<QuestionCategory, number> = {
        journal: 0,
        ledger: 0,
        trial_balance: 0,
        financial_statement: 0,
      };

      categoryResult.rows.forEach((row) => {
        counts[row.category_id] = row.count;
      });

      console.log("[QuestionRepository] カテゴリ別問題数取得完了:", counts);
      return counts;
    } catch (error) {
      console.error(
        "[QuestionRepository] getQuestionCountsByCategory エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * 試験セクション別問題取得
   */
  public async findByExamSection(
    examSection: 1 | 2 | 3,
    options: {
      subcategory?: string;
      difficulty?: QuestionDifficulty;
      limit?: number;
      randomize?: boolean;
      excludeIds?: string[];
    } = {},
  ): Promise<Question[]> {
    try {
      let sql = "SELECT * FROM questions WHERE exam_section = ?";
      const params: any[] = [examSection];

      // サブカテゴリフィルター
      if (options.subcategory) {
        sql += " AND subcategory_id = ?";
        params.push(options.subcategory);
      }

      // 難易度フィルター
      if (options.difficulty) {
        sql += " AND difficulty = ?";
        params.push(options.difficulty);
      }

      // 除外ID
      if (options.excludeIds && options.excludeIds.length > 0) {
        const placeholders = options.excludeIds.map(() => "?").join(", ");
        sql += ` AND id NOT IN (${placeholders})`;
        params.push(...options.excludeIds);
      }

      // ランダム化またはソート
      if (options.randomize) {
        sql += " ORDER BY RANDOM()";
      } else {
        sql += " ORDER BY id ASC";
      }

      // 制限
      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] 第${examSection}問から ${result.rows.length}問取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findByExamSection エラー:`, error);
      throw error;
    }
  }

  /**
   * 試験セクション別問題数取得
   */
  public async getQuestionCountsByExamSection(): Promise<
    Record<1 | 2 | 3, number>
  > {
    try {
      const sectionResult = await this.executeQuery<{
        exam_section: 1 | 2 | 3;
        count: number;
      }>(
        "SELECT exam_section, COUNT(*) as count FROM questions WHERE exam_section IS NOT NULL GROUP BY exam_section",
      );

      const counts: Record<1 | 2 | 3, number> = {
        1: 0,
        2: 0,
        3: 0,
      };

      sectionResult.rows.forEach((row) => {
        counts[row.exam_section] = row.count;
      });

      console.log("[QuestionRepository] セクション別問題数取得完了:", counts);
      return counts;
    } catch (error) {
      console.error(
        "[QuestionRepository] getQuestionCountsByExamSection エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * サブカテゴリ別問題取得
   */
  public async findBySubcategory(
    subcategoryId: string,
    options: {
      difficulty?: QuestionDifficulty;
      limit?: number;
      randomize?: boolean;
      excludeIds?: string[];
    } = {},
  ): Promise<Question[]> {
    try {
      let sql = "SELECT * FROM questions WHERE subcategory_id = ?";
      const params: any[] = [subcategoryId];

      // 難易度フィルター
      if (options.difficulty) {
        sql += " AND difficulty = ?";
        params.push(options.difficulty);
      }

      // 除外ID
      if (options.excludeIds && options.excludeIds.length > 0) {
        const placeholders = options.excludeIds.map(() => "?").join(", ");
        sql += ` AND id NOT IN (${placeholders})`;
        params.push(...options.excludeIds);
      }

      // ランダム化またはソート
      if (options.randomize) {
        sql += " ORDER BY RANDOM()";
      } else {
        sql += " ORDER BY id ASC";
      }

      // 制限
      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const result = await this.executeQuery<Question>(sql, params);

      console.log(
        `[QuestionRepository] サブカテゴリ ${subcategoryId} から ${result.rows.length}問取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findBySubcategory エラー:`, error);
      throw error;
    }
  }

  /**
   * サブカテゴリ情報取得
   */
  public async getSubcategories(examSection?: 1 | 2 | 3): Promise<any[]> {
    try {
      let sql = "SELECT * FROM subcategories";
      const params: any[] = [];

      if (examSection) {
        sql += " WHERE exam_section = ?";
        params.push(examSection);
      }

      sql += " ORDER BY exam_section, sort_order";

      const result = await this.executeQuery<any>(sql, params);

      console.log(
        `[QuestionRepository] ${result.rows.length}個のサブカテゴリ取得`,
      );
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] getSubcategories エラー:`, error);
      throw error;
    }
  }

  /**
   * 問題コンテンツ構成検証（新コンテンツ構成対応）
   */
  public async validateContentStructure(): Promise<{
    isValid: boolean;
    issues: string[];
    expectedCounts: Record<QuestionCategory, number>;
    actualCounts: Record<QuestionCategory, number>;
  }> {
    try {
      const expectedCounts = {
        journal: 250,
        ledger: 40,
        trial_balance: 12,
        financial_statement: 2,
      };

      const stats = await this.getStats();
      const actualCounts = stats.categoryBreakdown;

      const issues: string[] = [];

      // 各カテゴリの問題数検証
      for (const [category, expectedCount] of Object.entries(expectedCounts)) {
        const actualCount = actualCounts[category as QuestionCategory];
        if (actualCount !== expectedCount) {
          issues.push(
            `${category}: 期待値${expectedCount}問, 実際${actualCount}問`,
          );
        }
      }

      // 問題IDの形式検証
      const idFormatResult = await this.executeQuery<{
        id: string;
        category_id: QuestionCategory;
      }>("SELECT id, category_id FROM questions");

      idFormatResult.rows.forEach((row) => {
        const expectedPrefix = {
          journal: "Q_J_",
          ledger: "Q_L_",
          trial_balance: "Q_T_",
          financial_statement: "Q_F_",
        }[row.category_id];

        if (!row.id.startsWith(expectedPrefix)) {
          issues.push(
            `問題ID形式エラー: ${row.id} (カテゴリ: ${row.category_id})`,
          );
        }
      });

      const validation = {
        isValid: issues.length === 0,
        issues,
        expectedCounts,
        actualCounts,
      };

      console.log("[QuestionRepository] コンテンツ構成検証完了:", validation);
      return validation;
    } catch (error) {
      console.error(
        "[QuestionRepository] validateContentStructure エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * CBT解答テンプレート検証
   */
  public async validateAnswerTemplates(): Promise<{
    validCount: number;
    invalidCount: number;
    errors: Array<{ questionId: string; error: string }>;
  }> {
    try {
      const allQuestions = await this.findAll();
      const errors: Array<{ questionId: string; error: string }> = [];
      let validCount = 0;
      let invalidCount = 0;

      for (const question of allQuestions) {
        try {
          // JSONの妥当性チェック
          const template = JSON.parse(question.answer_template_json);
          const correctAnswer = JSON.parse(question.correct_answer_json);

          // 基本構造の検証
          if (!template.type || !template.fields) {
            errors.push({
              questionId: question.id,
              error: "テンプレート構造が不正",
            });
            invalidCount++;
            continue;
          }

          // カテゴリとテンプレートタイプの整合性チェック
          const expectedTypes = {
            journal: "journal_entry",
            ledger: "ledger_entry",
            trial_balance: "trial_balance",
            financial_statement: "financial_statement",
          };

          if (template.type !== expectedTypes[question.category_id]) {
            errors.push({
              questionId: question.id,
              error: `テンプレートタイプ不一致: 期待値${expectedTypes[question.category_id]}, 実際${template.type}`,
            });
            invalidCount++;
            continue;
          }

          validCount++;
        } catch (parseError) {
          errors.push({
            questionId: question.id,
            error: `JSON解析エラー: ${parseError}`,
          });
          invalidCount++;
        }
      }

      const validation = {
        validCount,
        invalidCount,
        errors,
      };

      console.log(
        "[QuestionRepository] CBT解答テンプレート検証完了:",
        validation,
      );
      return validation;
    } catch (error) {
      console.error(
        "[QuestionRepository] validateAnswerTemplates エラー:",
        error,
      );
      throw error;
    }
  }
}

/**
 * 問題Repositoryのシングルトンインスタンス
 */
export const questionRepository = new QuestionRepository();
