/**
 * Web用データベースモック（localStorage ベース）
 * database.ts分割 - Phase 4
 */

import { logger } from "../../utils/logger";

export class WebDatabaseMock {
  private tables: Map<string, any[]> = new Map();

  runSync(sql: string, params: any[] = []): any {
    logger.debug("Mock SQL実行: ${sql}", {
      component: "WebDatabaseMock",
      params,
    });

    try {
      // 基本的なSQL操作をシミュレート
      const rows: any[] = [];
      let changes = 0;
      let lastInsertRowId: number | undefined = undefined;

      if (sql.includes("PRAGMA")) {
        // PRAGMA文は常に成功を返す
        if (sql.includes("foreign_keys")) {
          rows.push({ foreign_keys: 1 });
        } else if (sql.includes("journal_mode")) {
          rows.push({ journal_mode: "WAL" });
        } else if (sql.includes("synchronous")) {
          rows.push({ synchronous: 1 });
        } else if (sql.includes("auto_vacuum")) {
          rows.push({ auto_vacuum: 2 });
        } else if (sql.includes("integrity_check")) {
          rows.push({ integrity_check: "ok" });
        } else {
          rows.push({ pragma: "ok" });
        }
      } else if (sql.includes("CREATE TABLE") || sql.includes("CREATE INDEX")) {
        // テーブル作成・インデックス作成は成功をシミュレート
        changes = 0;
        logger.debug("テーブル/インデックス作成をシミュレート", {
          component: "WebDatabaseMock",
          sql: sql.substring(0, 50) + "...",
        });
      } else if (sql.includes("SELECT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];

        // COUNT(*) クエリの特別処理
        if (sql.includes("COUNT(*)")) {
          rows.push({ count: data.length });
        } else {
          rows.push(...data.slice(0, 100)); // 最大100件まで返す
        }
        logger.debug("SELECT from ${tableName}: ${rows.length}件", {
          component: "WebDatabaseMock",
        });
      } else if (sql.includes("INSERT")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];
        const newId = data.length + 1;
        data.push({ id: newId, ...this.parseInsertParams(params) });
        this.tables.set(tableName, data);
        changes = 1;
        lastInsertRowId = newId;
        logger.debug("INSERT into ${tableName}: id=${newId}", {
          component: "WebDatabaseMock",
        });
      } else if (sql.includes("UPDATE")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];
        changes = Math.min(1, data.length); // 簡単な更新シミュレート
        logger.debug("UPDATE ${tableName}: ${changes}件", {
          component: "WebDatabaseMock",
        });
      } else if (sql.includes("DELETE")) {
        const tableName = this.extractTableName(sql);
        const data = this.tables.get(tableName) || [];
        changes = Math.min(1, data.length); // 簡単な削除シミュレート
        logger.debug("DELETE from ${tableName}: ${changes}件", {
          component: "WebDatabaseMock",
        });
      }

      return {
        changes,
        lastInsertRowId,
        rows,
      };
    } catch (error) {
      logger.error("Mock SQL実行エラー", error as Error, {
        component: "WebDatabaseMock",
        sql: sql.substring(0, 100),
      });
      throw error;
    }
  }

  private extractTableName(sql: string): string {
    // 簡単なテーブル名抽出（FROM句またはINTO句から）
    const match = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
    return match ? match[1] : "unknown";
  }

  private parseInsertParams(params: any[]): Record<string, any> {
    // 簡単なパラメータ解析
    return params.reduce(
      (acc, param, index) => {
        acc[`field_${index}`] = param;
        return acc;
      },
      {} as Record<string, any>,
    );
  }
}
