/**
 * 問題データRepository
 * 簿記3級問題集アプリ - CBT形式対応問題管理
 */

import { BaseRepository } from './base-repository';
import { Question, QuestionCategory, QuestionDifficulty } from '../../types/models';
import { QueryFilter } from '../../types/models';

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
    super('questions');
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
    } = {}
  ): Promise<Question[]> {
    try {
      let sql = 'SELECT * FROM questions WHERE category_id = ?';
      const params: any[] = [category];

      // 難易度フィルター
      if (options.difficulty) {
        sql += ' AND difficulty = ?';
        params.push(options.difficulty);
      }

      // 除外ID
      if (options.excludeIds && options.excludeIds.length > 0) {
        const placeholders = options.excludeIds.map(() => '?').join(', ');
        sql += ` AND id NOT IN (${placeholders})`;
        params.push(...options.excludeIds);
      }

      // ランダム化またはソート
      if (options.randomize) {
        sql += ' ORDER BY RANDOM()';
      } else {
        sql += ' ORDER BY difficulty ASC, id ASC';
      }

      // 制限
      if (options.limit) {
        sql += ' LIMIT ?';
        params.push(options.limit);
      }

      const result = await this.executeQuery<Question>(sql, params);
      
      console.log(`[QuestionRepository] カテゴリ ${category} から ${result.rows.length}問取得`);
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
    limit: number = 10
  ): Promise<Question[]> {
    try {
      let sql = `
        SELECT q.* FROM questions q
        LEFT JOIN learning_history lh ON q.id = lh.question_id
        WHERE lh.question_id IS NULL
      `;
      const params: any[] = [];

      if (category) {
        sql += ' AND q.category_id = ?';
        params.push(category);
      }

      sql += ' ORDER BY q.difficulty ASC, q.id ASC LIMIT ?';
      params.push(limit);

      const result = await this.executeQuery<Question>(sql, params);
      
      console.log(`[QuestionRepository] 未学習問題 ${result.rows.length}問取得`);
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findUnstudiedQuestions エラー:`, error);
      throw error;
    }
  }

  /**
   * 復習対象問題取得（優先度順）
   */
  public async findReviewQuestions(
    category?: QuestionCategory,
    limit: number = 10
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
        sql += ' AND q.category_id = ?';
        params.push(category);
      }

      sql += ' ORDER BY ri.priority_score DESC, ri.last_answered_at ASC LIMIT ?';
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

      const placeholders = questionIds.map(() => '?').join(', ');
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
    limit?: number
  ): Promise<Question[]> {
    try {
      let sql = `
        SELECT * FROM questions 
        WHERE tags_json IS NOT NULL 
        AND json_extract(tags_json, '$') LIKE ?
      `;
      const params: any[] = [`%"${tag}"%`];

      if (category) {
        sql += ' AND category_id = ?';
        params.push(category);
      }

      sql += ' ORDER BY difficulty ASC, id ASC';

      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }

      const result = await this.executeQuery<Question>(sql, params);
      
      console.log(`[QuestionRepository] タグ "${tag}" で ${result.rows.length}問取得`);
      return result.rows;
    } catch (error) {
      console.error(`[QuestionRepository] findByTag エラー:`, error);
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
        'SELECT COUNT(*) as count FROM questions'
      );
      const totalQuestions = totalResult.rows[0]?.count || 0;

      // カテゴリ別集計
      const categoryResult = await this.executeQuery<{ category_id: QuestionCategory; count: number }>(
        'SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id'
      );
      
      const categoryBreakdown = {
        journal: 0,
        ledger: 0,
        trial_balance: 0
      };
      
      categoryResult.rows.forEach(row => {
        categoryBreakdown[row.category_id] = row.count;
      });

      // 難易度別集計
      const difficultyResult = await this.executeQuery<{ difficulty: QuestionDifficulty; count: number }>(
        'SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty'
      );
      
      const difficultyBreakdown: Record<QuestionDifficulty, number> = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };
      
      difficultyResult.rows.forEach(row => {
        difficultyBreakdown[row.difficulty] = row.count;
      });

      // 平均難易度計算
      const avgResult = await this.executeQuery<{ avg_difficulty: number }>(
        'SELECT AVG(difficulty) as avg_difficulty FROM questions'
      );
      const averageDifficulty = avgResult.rows[0]?.avg_difficulty || 0;

      const stats: QuestionStats = {
        totalQuestions,
        categoryBreakdown,
        difficultyBreakdown,
        averageDifficulty: Math.round(averageDifficulty * 100) / 100
      };

      console.log('[QuestionRepository] 問題統計情報取得完了:', stats);
      return stats;
    } catch (error) {
      console.error('[QuestionRepository] getStats エラー:', error);
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
        trial_balance: 12
      };

      const stats = await this.getStats();
      const actualCounts = stats.categoryBreakdown;
      
      const issues: string[] = [];
      
      // 各カテゴリの問題数検証
      for (const [category, expectedCount] of Object.entries(expectedCounts)) {
        const actualCount = actualCounts[category as QuestionCategory];
        if (actualCount !== expectedCount) {
          issues.push(`${category}: 期待値${expectedCount}問, 実際${actualCount}問`);
        }
      }

      // 問題IDの形式検証
      const idFormatResult = await this.executeQuery<{ id: string; category_id: QuestionCategory }>(
        'SELECT id, category_id FROM questions'
      );
      
      idFormatResult.rows.forEach(row => {
        const expectedPrefix = {
          journal: 'Q_J_',
          ledger: 'Q_L_',
          trial_balance: 'Q_T_'
        }[row.category_id];
        
        if (!row.id.startsWith(expectedPrefix)) {
          issues.push(`問題ID形式エラー: ${row.id} (カテゴリ: ${row.category_id})`);
        }
      });

      const validation = {
        isValid: issues.length === 0,
        issues,
        expectedCounts,
        actualCounts
      };

      console.log('[QuestionRepository] コンテンツ構成検証完了:', validation);
      return validation;
    } catch (error) {
      console.error('[QuestionRepository] validateContentStructure エラー:', error);
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
              error: 'テンプレート構造が不正'
            });
            invalidCount++;
            continue;
          }

          // カテゴリとテンプレートタイプの整合性チェック
          const expectedTypes = {
            journal: 'journal_entry',
            ledger: 'ledger_entry',
            trial_balance: 'trial_balance'
          };
          
          if (template.type !== expectedTypes[question.category_id]) {
            errors.push({
              questionId: question.id,
              error: `テンプレートタイプ不一致: 期待値${expectedTypes[question.category_id]}, 実際${template.type}`
            });
            invalidCount++;
            continue;
          }

          validCount++;
        } catch (parseError) {
          errors.push({
            questionId: question.id,
            error: `JSON解析エラー: ${parseError}`
          });
          invalidCount++;
        }
      }

      const validation = {
        validCount,
        invalidCount,
        errors
      };

      console.log('[QuestionRepository] CBT解答テンプレート検証完了:', validation);
      return validation;
    } catch (error) {
      console.error('[QuestionRepository] validateAnswerTemplates エラー:', error);
      throw error;
    }
  }
}

/**
 * 問題Repositoryのシングルトンインスタンス
 */
export const questionRepository = new QuestionRepository();