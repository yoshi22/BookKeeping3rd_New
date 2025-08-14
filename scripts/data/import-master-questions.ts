/**
 * マスター問題データをデータベースに投入するスクリプト
 * problemsStrategy.md準拠の302問を一括インポート
 */

import * as fs from "fs";
import * as path from "path";
import * as sqlite3 from "sqlite3";
// マスター問題データを直接読み込み（型キャストして使用）
const masterQuestionsModule = require("../src/data/master-questions");
const masterQuestions = masterQuestionsModule.masterQuestions as Question[];
const questionStatistics = masterQuestionsModule.questionStatistics;

// 型定義
interface Question {
  id: string;
  category_id: "journal" | "ledger" | "trial_balance";
  question_text: string;
  answer_template_json: string;
  correct_answer_json: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
  tags_json?: string;
  created_at: string;
  updated_at: string;
}

// データベース設定
const DB_PATH = path.join(__dirname, "..", "bookkeeping.db");
const BACKUP_DIR = path.join(__dirname, "..", "backup", "db-backup");

// カラーコード
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
};

// ========== ヘルパー関数 ==========

function log(
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
) {
  const timestamp = new Date().toISOString().slice(11, 19);
  const color = {
    info: COLORS.cyan,
    success: COLORS.green,
    warning: COLORS.yellow,
    error: COLORS.red,
  }[type];

  console.log(`${color}[${timestamp}] ${message}${COLORS.reset}`);
}

function createBackup(dbPath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(BACKUP_DIR, `bookkeeping-${timestamp}.db`);

  // バックアップディレクトリ作成
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // データベースファイルをコピー
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath);
    log(`バックアップ作成: ${backupPath}`, "success");
    return backupPath;
  }

  return "";
}

// ========== データベース操作 ==========

class DatabaseImporter {
  private db: sqlite3.Database | null = null;
  private stats = {
    total: 0,
    inserted: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
  };

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          log(`データベース接続エラー: ${err.message}`, "error");
          reject(err);
        } else {
          log("データベース接続成功", "success");
          resolve();
        }
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) {
          log(`データベースクローズエラー: ${err.message}`, "error");
          reject(err);
        } else {
          log("データベース接続終了", "info");
          resolve();
        }
      });
    });
  }

  async initializeTables(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL CHECK(category_id IN ('journal', 'ledger', 'trial_balance')),
        question_text TEXT NOT NULL,
        answer_template_json TEXT NOT NULL,
        correct_answer_json TEXT NOT NULL,
        explanation TEXT,
        difficulty INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 3),
        tags_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;

    const createIndexSQL = [
      `CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);`,
      `CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);`,
      `CREATE INDEX IF NOT EXISTS idx_questions_category_difficulty ON questions(category_id, difficulty);`,
    ];

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      // テーブル作成
      this.db.run(createTableSQL, (err) => {
        if (err) {
          log(`テーブル作成エラー: ${err.message}`, "error");
          reject(err);
          return;
        }

        log("questionsテーブル確認完了", "success");

        // インデックス作成
        let indexCount = 0;
        createIndexSQL.forEach((sql, index) => {
          this.db!.run(sql, (err) => {
            if (err) {
              log(`インデックス作成エラー: ${err.message}`, "warning");
            }
            indexCount++;
            if (indexCount === createIndexSQL.length) {
              log("インデックス作成完了", "success");
              resolve();
            }
          });
        });
      });
    });
  }

  async clearExistingQuestions(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      // 既存のレコード数を取得
      this.db.get(
        "SELECT COUNT(*) as count FROM questions",
        (err, row: any) => {
          if (err) {
            log(`既存データカウントエラー: ${err.message}`, "error");
            reject(err);
            return;
          }

          const existingCount = row?.count || 0;

          if (existingCount > 0) {
            log(`既存の${existingCount}件のデータを削除中...`, "warning");

            // 既存データを削除
            this.db!.run("DELETE FROM questions", (err) => {
              if (err) {
                log(`データ削除エラー: ${err.message}`, "error");
                reject(err);
              } else {
                log(`${existingCount}件のデータを削除しました`, "success");
                resolve(existingCount);
              }
            });
          } else {
            log("既存データなし", "info");
            resolve(0);
          }
        },
      );
    });
  }

  async importQuestion(question: Question): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      const insertSQL = `
        INSERT INTO questions (
          id, category_id, question_text, 
          answer_template_json, correct_answer_json,
          explanation, difficulty, tags_json,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        question.id,
        question.category_id,
        question.question_text,
        question.answer_template_json,
        question.correct_answer_json,
        question.explanation,
        question.difficulty,
        question.tags_json || null,
        question.created_at,
        question.updated_at,
      ];

      this.db.run(insertSQL, params, (err) => {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            // 既存レコードの更新を試みる
            this.updateQuestion(question)
              .then(() => {
                this.stats.updated++;
                resolve();
              })
              .catch(reject);
          } else {
            this.stats.failed++;
            log(`インポートエラー [${question.id}]: ${err.message}`, "error");
            reject(err);
          }
        } else {
          this.stats.inserted++;
          resolve();
        }
      });
    });
  }

  async updateQuestion(question: Question): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      const updateSQL = `
        UPDATE questions SET
          category_id = ?,
          question_text = ?,
          answer_template_json = ?,
          correct_answer_json = ?,
          explanation = ?,
          difficulty = ?,
          tags_json = ?,
          updated_at = ?
        WHERE id = ?
      `;

      const params = [
        question.category_id,
        question.question_text,
        question.answer_template_json,
        question.correct_answer_json,
        question.explanation,
        question.difficulty,
        question.tags_json || null,
        new Date().toISOString(),
        question.id,
      ];

      this.db.run(updateSQL, params, (err) => {
        if (err) {
          log(`更新エラー [${question.id}]: ${err.message}`, "error");
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async importAllQuestions(questions: Question[]): Promise<void> {
    this.stats.total = questions.length;

    log(`\n📦 ${questions.length}問のインポート開始`, "info");

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // プログレス表示
      if ((i + 1) % 50 === 0 || i === questions.length - 1) {
        const progress = Math.round(((i + 1) / questions.length) * 100);
        process.stdout.write(
          `\r  進捗: [${"█".repeat(progress / 2).padEnd(50)}] ${progress}% (${i + 1}/${questions.length})`,
        );
      }

      try {
        await this.importQuestion(question);
      } catch (error) {
        // エラーは個別に記録済みなので続行
      }
    }

    console.log("\n"); // 改行
  }

  async verifyImport(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      // カテゴリー別カウント
      const verifySql = `
        SELECT 
          category_id,
          COUNT(*) as count,
          COUNT(DISTINCT difficulty) as difficulty_types
        FROM questions 
        GROUP BY category_id
        ORDER BY category_id
      `;

      this.db.all(verifySql, (err, rows: any[]) => {
        if (err) {
          log(`検証エラー: ${err.message}`, "error");
          reject(err);
          return;
        }

        log("\n📊 インポート結果検証", "info");
        console.log("------------------------");

        let totalInDb = 0;
        rows.forEach((row) => {
          totalInDb += row.count;
          console.log(
            `  ${row.category_id}: ${row.count}問 (難易度${row.difficulty_types}種類)`,
          );
        });

        console.log("------------------------");
        console.log(`  合計: ${totalInDb}問`);

        // サブカテゴリー検証
        const subcategorySql = `
          SELECT 
            category_id,
            json_extract(tags_json, '$.subcategory') as subcategory,
            COUNT(*) as count
          FROM questions
          WHERE tags_json IS NOT NULL
          GROUP BY category_id, subcategory
          ORDER BY category_id, subcategory
        `;

        this.db!.all(subcategorySql, (err, rows: any[]) => {
          if (err) {
            log(`サブカテゴリー検証エラー: ${err.message}`, "warning");
          } else {
            console.log("\n📑 サブカテゴリー分布");
            console.log("------------------------");

            let currentCategory = "";
            rows.forEach((row) => {
              if (row.category_id !== currentCategory) {
                currentCategory = row.category_id;
                console.log(`\n  [${currentCategory}]`);
              }
              console.log(`    ${row.subcategory}: ${row.count}問`);
            });
          }

          resolve();
        });
      });
    });
  }

  getStats() {
    return this.stats;
  }
}

// ========== メイン処理 ==========

async function main() {
  console.log(`${COLORS.bright}${COLORS.blue}`);
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║     📚 マスター問題データインポートツール      ║");
  console.log("║         problemsStrategy.md準拠版              ║");
  console.log("╚════════════════════════════════════════════════╝");
  console.log(COLORS.reset);

  const importer = new DatabaseImporter();

  try {
    // 1. データ確認
    log("\n1️⃣  データソース確認", "info");
    const questionCount = masterQuestions.length;
    log(`  マスター問題数: ${questionCount}問`, "info");

    // カテゴリー別表示
    const byCategory = masterQuestions.reduce(
      (acc, q) => {
        acc[q.category_id] = (acc[q.category_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`    - ${cat}: ${count}問`);
    });

    // 2. データベース接続
    log("\n2️⃣  データベース接続", "info");
    await importer.connect();

    // 3. バックアップ作成
    log("\n3️⃣  バックアップ作成", "info");
    const backupPath = createBackup(DB_PATH);

    // 4. テーブル初期化
    log("\n4️⃣  テーブル初期化", "info");
    await importer.initializeTables();

    // 5. 既存データクリア（オプション）
    log("\n5️⃣  既存データ処理", "info");
    const clearedCount = await importer.clearExistingQuestions();

    // 6. データインポート
    log("\n6️⃣  データインポート実行", "info");
    await importer.importAllQuestions(masterQuestions);

    // 7. 結果統計
    const stats = importer.getStats();
    log("\n7️⃣  インポート統計", "info");
    console.log("------------------------");
    console.log(`  対象データ: ${stats.total}件`);
    console.log(
      `  ${COLORS.green}✅ 新規追加: ${stats.inserted}件${COLORS.reset}`,
    );
    console.log(
      `  ${COLORS.yellow}♻️  更新: ${stats.updated}件${COLORS.reset}`,
    );
    console.log(
      `  ${COLORS.cyan}⏭️  スキップ: ${stats.skipped}件${COLORS.reset}`,
    );
    console.log(`  ${COLORS.red}❌ 失敗: ${stats.failed}件${COLORS.reset}`);

    // 8. データ検証
    log("\n8️⃣  データ検証", "info");
    await importer.verifyImport();

    // 9. クローズ
    await importer.close();

    // 完了メッセージ
    console.log(`\n${COLORS.bright}${COLORS.green}`);
    console.log("╔════════════════════════════════════════════════╗");
    console.log("║           ✅ インポート完了！                  ║");
    console.log("╚════════════════════════════════════════════════╝");
    console.log(COLORS.reset);

    if (stats.failed > 0) {
      log(
        `\n⚠️  ${stats.failed}件のエラーが発生しました。詳細はログを確認してください。`,
        "warning",
      );
    }

    if (backupPath) {
      log(`\n💾 バックアップファイル: ${backupPath}`, "info");
    }
  } catch (error) {
    log(`\n致命的エラー: ${error}`, "error");
    await importer.close();
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseImporter };
