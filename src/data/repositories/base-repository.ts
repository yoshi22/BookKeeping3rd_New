/**
 * 基底Repositoryクラス
 * 簿記3級問題集アプリ - データアクセス層基盤
 */

import { databaseService } from "../database";
import { DatabaseResult, QueryResult } from "../../types/database";

/**
 * 基底Repositoryクラス
 * 各テーブル固有のRepositoryが継承する共通機能を提供
 */
export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * IDによる単一レコード取得
   */
  public async findById(id: string | number): Promise<T | null> {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const result = await databaseService.executeSql<T>(sql, [id]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error(`[${this.constructor.name}] findById エラー:`, error);
      throw error;
    }
  }

  /**
   * 全レコード取得
   */
  public async findAll(limit?: number, offset?: number): Promise<T[]> {
    try {
      let sql = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];

      if (limit !== undefined) {
        sql += " LIMIT ?";
        params.push(limit);

        if (offset !== undefined) {
          sql += " OFFSET ?";
          params.push(offset);
        }
      }

      const result = await databaseService.executeSql<T>(sql, params);
      return result.rows;
    } catch (error) {
      console.error(`[${this.constructor.name}] findAll エラー:`, error);
      throw error;
    }
  }

  /**
   * 条件による検索
   */
  public async findWhere(
    conditions: Record<string, any>,
    orderBy?: string,
    limit?: number,
    offset?: number,
  ): Promise<T[]> {
    try {
      const conditionParts: string[] = [];
      const params: any[] = [];

      // WHERE条件の構築
      for (const [column, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          conditionParts.push(`${column} = ?`);
          params.push(value);
        }
      }

      let sql = `SELECT * FROM ${this.tableName}`;

      if (conditionParts.length > 0) {
        sql += ` WHERE ${conditionParts.join(" AND ")}`;
      }

      if (orderBy) {
        sql += ` ORDER BY ${orderBy}`;
      }

      if (limit !== undefined) {
        sql += " LIMIT ?";
        params.push(limit);

        if (offset !== undefined) {
          sql += " OFFSET ?";
          params.push(offset);
        }
      }

      const result = await databaseService.executeSql<T>(sql, params);
      return result.rows;
    } catch (error) {
      console.error(`[${this.constructor.name}] findWhere エラー:`, error);
      throw error;
    }
  }

  /**
   * レコード数取得
   */
  public async count(conditions?: Record<string, any>): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
      const params: any[] = [];

      if (conditions) {
        const conditionParts: string[] = [];

        for (const [column, value] of Object.entries(conditions)) {
          if (value !== undefined && value !== null) {
            conditionParts.push(`${column} = ?`);
            params.push(value);
          }
        }

        if (conditionParts.length > 0) {
          sql += ` WHERE ${conditionParts.join(" AND ")}`;
        }
      }

      const result = await databaseService.executeSql<{ count: number }>(
        sql,
        params,
      );
      return result.rows[0]?.count || 0;
    } catch (error) {
      console.error(`[${this.constructor.name}] count エラー:`, error);
      throw error;
    }
  }

  /**
   * レコード挿入
   */
  public async create(
    data: Omit<T, "id"> & { id?: string | number },
  ): Promise<T> {
    try {
      const columns = Object.keys(data);
      const placeholders = columns.map(() => "?").join(", ");
      const values = Object.values(data);

      const sql = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
      const result = await databaseService.executeSql(sql, values);

      // 挿入されたレコードを取得して返す
      const insertedId = result.insertId || (data as any).id;
      const insertedRecord = await this.findById(insertedId);

      if (!insertedRecord) {
        throw new Error(
          `Failed to retrieve inserted record with id: ${insertedId}`,
        );
      }

      console.log(`[${this.constructor.name}] レコード作成完了:`, insertedId);
      return insertedRecord;
    } catch (error) {
      console.error(`[${this.constructor.name}] create エラー:`, error);
      throw error;
    }
  }

  /**
   * レコード更新
   */
  public async update(
    id: string | number,
    data: Partial<T>,
  ): Promise<T | null> {
    try {
      const columns = Object.keys(data);
      const setParts = columns.map((col) => `${col} = ?`).join(", ");
      const values = [...Object.values(data), id];

      const sql = `UPDATE ${this.tableName} SET ${setParts} WHERE id = ?`;
      const result = await databaseService.executeSql(sql, values);

      if (result.rowsAffected === 0) {
        console.warn(
          `[${this.constructor.name}] 更新対象が見つかりません: ID ${id}`,
        );
        return null;
      }

      console.log(`[${this.constructor.name}] レコード更新完了: ID ${id}`);
      return await this.findById(id);
    } catch (error) {
      console.error(`[${this.constructor.name}] update エラー:`, error);
      throw error;
    }
  }

  /**
   * レコード削除
   */
  public async delete(id: string | number): Promise<boolean> {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const result = await databaseService.executeSql(sql, [id]);

      const success = result.rowsAffected > 0;
      if (success) {
        console.log(`[${this.constructor.name}] レコード削除完了: ID ${id}`);
      } else {
        console.warn(
          `[${this.constructor.name}] 削除対象が見つかりません: ID ${id}`,
        );
      }

      return success;
    } catch (error) {
      console.error(`[${this.constructor.name}] delete エラー:`, error);
      throw error;
    }
  }

  /**
   * 条件による削除
   */
  public async deleteWhere(conditions: Record<string, any>): Promise<number> {
    try {
      const conditionParts: string[] = [];
      const params: any[] = [];

      for (const [column, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          conditionParts.push(`${column} = ?`);
          params.push(value);
        }
      }

      if (conditionParts.length === 0) {
        throw new Error("Delete conditions cannot be empty");
      }

      const sql = `DELETE FROM ${this.tableName} WHERE ${conditionParts.join(" AND ")}`;
      const result = await databaseService.executeSql(sql, params);

      console.log(
        `[${this.constructor.name}] 条件削除完了: ${result.rowsAffected}件`,
      );
      return result.rowsAffected;
    } catch (error) {
      console.error(`[${this.constructor.name}] deleteWhere エラー:`, error);
      throw error;
    }
  }

  /**
   * Upsert操作（INSERT OR REPLACE）
   */
  public async upsert(data: T): Promise<T> {
    try {
      const columns = Object.keys(data as Record<string, any>);
      const placeholders = columns.map(() => "?").join(", ");
      const values = Object.values(data as Record<string, any>);

      const sql = `INSERT OR REPLACE INTO ${this.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
      const result = await databaseService.executeSql(sql, values);

      // 操作されたレコードを取得して返す
      const recordId = result.insertId || (data as any).id;
      const record = await this.findById(recordId);

      if (!record) {
        throw new Error(
          `Failed to retrieve upserted record with id: ${recordId}`,
        );
      }

      console.log(`[${this.constructor.name}] Upsert完了:`, recordId);
      return record;
    } catch (error) {
      console.error(`[${this.constructor.name}] upsert エラー:`, error);
      throw error;
    }
  }

  /**
   * バッチ挿入
   */
  public async createMany(
    dataList: Array<Omit<T, "id"> & { id?: string | number }>,
  ): Promise<T[]> {
    try {
      const results: T[] = [];

      // トランザクション内でバッチ処理
      await databaseService.executeTransaction(async (db) => {
        for (const data of dataList) {
          const columns = Object.keys(data);
          const placeholders = columns.map(() => "?").join(", ");
          const values = Object.values(data);

          const sql = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

          // SQLite同期メソッドを使用
          db.runSync(sql, values);
        }
      });

      // 挿入されたデータを再取得（実装は各Repository固有）
      console.log(
        `[${this.constructor.name}] バッチ挿入完了: ${dataList.length}件`,
      );
      return results;
    } catch (error) {
      console.error(`[${this.constructor.name}] createMany エラー:`, error);
      throw error;
    }
  }

  /**
   * テーブル存在確認
   */
  public async tableExists(): Promise<boolean> {
    try {
      const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
      const result = await databaseService.executeSql(sql, [this.tableName]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(`[${this.constructor.name}] tableExists エラー:`, error);
      return false;
    }
  }

  /**
   * カスタムクエリ実行
   */
  public async executeQuery<R = T>(
    sql: string,
    params: any[] = [],
  ): Promise<QueryResult<R>> {
    try {
      return await databaseService.executeSql<R>(sql, params);
    } catch (error) {
      console.error(`[${this.constructor.name}] executeQuery エラー:`, error);
      throw error;
    }
  }

  /**
   * トランザクション実行ヘルパー
   */
  protected async withTransaction<R>(operation: () => Promise<R>): Promise<R> {
    try {
      let result: R;

      await databaseService.executeTransaction(async (db) => {
        result = await operation();
      });

      return result!;
    } catch (error) {
      console.error(
        `[${this.constructor.name}] withTransaction エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 条件に一致する単一レコード取得
   */
  public async findOne(conditions: Partial<T>): Promise<T | null> {
    try {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      const values = Object.values(conditions);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`;
      const result = await databaseService.executeSql<T>(sql, values);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error(`[${this.constructor.name}] findOne エラー:`, error);
      throw error;
    }
  }

  /**
   * 条件に一致するレコードを一括更新
   */
  public async updateWhere(
    conditions: Partial<T>,
    data: Partial<T>,
  ): Promise<number> {
    try {
      const setClause = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      const values = [...Object.values(data), ...Object.values(conditions)];

      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
      const result = await databaseService.executeSql(sql, values);

      console.log(
        `[${this.constructor.name}] 一括更新完了: ${result.rowsAffected}件`,
      );
      return result.rowsAffected;
    } catch (error) {
      console.error(`[${this.constructor.name}] updateWhere エラー:`, error);
      throw error;
    }
  }
}
