/**
 * 直接SQLiteデータベースアクセスによる問題構造更新
 * React Native環境に依存しないNode.js用スクリプト
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// SQLiteファイルのパス
const dbPath = path.join(__dirname, "..", "bookkeeping.db");

console.log(`データベースファイルパス: ${dbPath}`);

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("データベース接続エラー:", err);
        reject(err);
      } else {
        console.log("データベース接続成功");
        resolve(db);
      }
    });
  });
}

function runSQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes, lastID: this.lastID });
      }
    });
  });
}

function getRows(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function addNewColumns(db) {
  console.log("\n=== 新しいカラムの追加開始 ===");

  // 既存のテーブル構造を確認
  console.log("現在のテーブル構造を確認中...");
  const tableInfo = await getRows(db, "PRAGMA table_info(questions)");
  const existingColumns = tableInfo.map((col) => col.name);
  console.log("既存カラム:", existingColumns);

  // 必要なカラムをチェックして追加
  const newColumns = [
    { name: "subcategory", type: "TEXT" },
    { name: "section_number", type: "INTEGER" },
    { name: "question_order", type: "INTEGER" },
    { name: "pattern_type", type: "TEXT" },
  ];

  for (const column of newColumns) {
    if (!existingColumns.includes(column.name)) {
      try {
        console.log(`カラム追加中: ${column.name} (${column.type})`);
        await runSQL(
          db,
          `ALTER TABLE questions ADD COLUMN ${column.name} ${column.type}`,
        );
        console.log(`✓ ${column.name} カラムを追加しました`);
      } catch (error) {
        if (error.message.includes("duplicate column name")) {
          console.log(`⚠ ${column.name} カラムは既に存在します（スキップ）`);
        } else {
          console.error(`✗ ${column.name} カラム追加エラー:`, error.message);
          throw error;
        }
      }
    } else {
      console.log(`⚠ ${column.name} カラムは既に存在します（スキップ）`);
    }
  }

  console.log("=== 新しいカラムの追加完了 ===");
}

async function applyQuestionClassification(db) {
  console.log("\n=== 問題分類の適用開始 ===");

  // 第1問（仕訳問題）の分類
  console.log("第1問（仕訳問題）を分類中...");
  const journalQuestions = await getRows(
    db,
    "SELECT id FROM questions WHERE category_id = 'journal' ORDER BY id",
  );

  let order = 1;

  // 現金・預金取引 (42問)
  for (let i = 0; i < Math.min(42, journalQuestions.length); i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 1, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["cash_deposit", order, "現金・預金取引", question.id],
    );
    order++;
  }
  console.log(
    `現金・預金取引: ${Math.min(42, journalQuestions.length)}問を分類`,
  );

  // 商品売買取引 (45問)
  for (let i = 42; i < Math.min(87, journalQuestions.length); i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 1, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["merchandise_trade", order, "商品売買取引", question.id],
    );
    order++;
  }
  console.log(
    `商品売買取引: ${Math.min(45, Math.max(0, journalQuestions.length - 42))}問を分類`,
  );

  // 債権・債務 (41問)
  for (let i = 87; i < Math.min(128, journalQuestions.length); i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 2, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["receivables_debts", order, "債権・債務", question.id],
    );
    order++;
  }
  console.log(
    `債権・債務: ${Math.min(41, Math.max(0, journalQuestions.length - 87))}問を分類`,
  );

  // 給与・税金 (42問)
  for (let i = 128; i < Math.min(170, journalQuestions.length); i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 2, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["salary_tax", order, "給与・税金", question.id],
    );
    order++;
  }
  console.log(
    `給与・税金: ${Math.min(42, Math.max(0, journalQuestions.length - 128))}問を分類`,
  );

  // 固定資産 (40問)
  for (let i = 170; i < Math.min(210, journalQuestions.length); i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 3, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["fixed_assets", order, "固定資産", question.id],
    );
    order++;
  }
  console.log(
    `固定資産: ${Math.min(40, Math.max(0, journalQuestions.length - 170))}問を分類`,
  );

  // 決算整理 (残り全て)
  for (let i = 210; i < journalQuestions.length; i++) {
    const question = journalQuestions[i];
    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 3, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      ["year_end_adj", order, "決算整理", question.id],
    );
    order++;
  }
  console.log(
    `決算整理: ${Math.max(0, journalQuestions.length - 210)}問を分類`,
  );

  // 第2問（帳簿問題）の分類
  console.log("\n第2問（帳簿問題）を分類中...");
  const ledgerQuestions = await getRows(
    db,
    "SELECT id FROM questions WHERE category_id = 'ledger' ORDER BY id",
  );

  order = 1;
  for (let i = 0; i < ledgerQuestions.length; i++) {
    const question = ledgerQuestions[i];
    let subcategory, pattern;

    if (i < 10) {
      subcategory = "account_posting";
      pattern = "勘定記入問題";
    } else if (i < 20) {
      subcategory = "subsidiary_books";
      pattern = "補助簿記入問題";
    } else if (i < 30) {
      subcategory = "voucher_entry";
      pattern = "伝票記入問題";
    } else {
      subcategory = "theory_selection";
      pattern = "理論・選択問題";
    }

    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 2, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      [subcategory, order, pattern, question.id],
    );
    order++;
  }
  console.log(`帳簿問題: ${ledgerQuestions.length}問を分類`);

  // 第3問（試算表問題）の分類
  console.log("\n第3問（試算表問題）を分類中...");
  const trialQuestions = await getRows(
    db,
    "SELECT id FROM questions WHERE category_id = 'trial_balance' ORDER BY id",
  );

  order = 1;
  for (let i = 0; i < trialQuestions.length; i++) {
    const question = trialQuestions[i];
    let subcategory, pattern;

    if (i < 4) {
      subcategory = "trial_balance";
      pattern = "試算表作成";
    } else if (i < 8) {
      subcategory = "worksheet";
      pattern = "精算表作成";
    } else {
      subcategory = "financial_statements";
      pattern = "財務諸表作成";
    }

    await runSQL(
      db,
      `
      UPDATE questions 
      SET subcategory = ?, section_number = 3, question_order = ?, pattern_type = ?
      WHERE id = ?
    `,
      [subcategory, order, pattern, question.id],
    );
    order++;
  }
  console.log(`試算表問題: ${trialQuestions.length}問を分類`);

  console.log("=== 問題分類の適用完了 ===");
}

async function createIndexes(db) {
  console.log("\n=== インデックスの作成開始 ===");

  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_questions_subcategory ON questions (subcategory)",
    "CREATE INDEX IF NOT EXISTS idx_questions_section_order ON questions (section_number, question_order)",
    "CREATE INDEX IF NOT EXISTS idx_questions_pattern ON questions (pattern_type)",
  ];

  for (const indexSQL of indexes) {
    try {
      await runSQL(db, indexSQL);
      console.log("✓ インデックスを作成しました");
    } catch (error) {
      console.log("⚠ インデックス作成エラー（継続）:", error.message);
    }
  }

  console.log("=== インデックスの作成完了 ===");
}

async function showResults(db) {
  console.log("\n=== 結果確認 ===");

  // 更新結果の確認
  const results = await getRows(
    db,
    `
    SELECT category_id, subcategory, pattern_type, COUNT(*) as count 
    FROM questions 
    WHERE subcategory IS NOT NULL 
    GROUP BY category_id, subcategory, pattern_type 
    ORDER BY category_id, subcategory
  `,
  );

  console.log("\n分類結果:");
  results.forEach((row) => {
    console.log(
      `${row.category_id} / ${row.subcategory} / ${row.pattern_type}: ${row.count}問`,
    );
  });

  // 全体統計
  const totalClassified = await getRows(
    db,
    "SELECT COUNT(*) as count FROM questions WHERE subcategory IS NOT NULL",
  );
  const totalQuestions = await getRows(
    db,
    "SELECT COUNT(*) as count FROM questions",
  );

  console.log(
    `\n分類済み: ${totalClassified[0].count}/${totalQuestions[0].count}問`,
  );
}

async function main() {
  let db;

  try {
    console.log("=== 直接データベース更新開始 ===");

    // データベースに接続
    db = await connectToDatabase();

    // 新しいカラムを追加
    await addNewColumns(db);

    // 問題分類を適用
    await applyQuestionClassification(db);

    // インデックスを作成
    await createIndexes(db);

    // 結果を表示
    await showResults(db);

    console.log("\n✅ データベース更新が完了しました！");
  } catch (error) {
    console.error("\n❌ データベース更新エラー:", error);
    process.exit(1);
  } finally {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error("データベースクローズエラー:", err);
        } else {
          console.log("データベース接続を閉じました");
        }
      });
    }
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}
