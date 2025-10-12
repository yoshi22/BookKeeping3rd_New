/**
 * Q2_L_006-020のanswer_template_jsonにproblemStatementを追加するスクリプト
 *
 * 実行方法：
 *   node scripts/data/add-problem-statements-to-master.js
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);
const STATEMENTS_JSON_PATH = path.join(
  __dirname,
  "q2l-problem-statements.json",
);

function main() {
  console.log("=== Q2_L_006-020へのproblemStatement追加 ===\n");

  // 生成された問題文を読み込み
  const statements = JSON.parse(fs.readFileSync(STATEMENTS_JSON_PATH, "utf8"));
  console.log(`✅ 問題文データ読み込み: ${statements.length}件\n`);

  // master-questions.tsを読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");

  // バックアップ作成
  const backupPath = `${MASTER_QUESTIONS_PATH}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, content, "utf8");
  console.log(`✅ バックアップ作成: ${backupPath}\n`);

  // 各問題を処理
  statements.forEach(({ id, problemStatement }) => {
    console.log(`処理中: ${id}`);

    // 問題データを正規表現で検索
    const regex = new RegExp(
      `(id:\\s*["']${id}["'][\\s\\S]*?answer_template_json:\\s*["'])({[\\s\\S]*?})["'],`,
      "m",
    );

    const match = content.match(regex);

    if (!match) {
      console.error(`  ❌ ${id} が見つかりません`);
      return;
    }

    try {
      // 既存のJSONを解析
      const jsonStr = match[2]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");

      const json = JSON.parse(jsonStr);

      // problemStatementを追加（先頭に配置）
      const updatedJson = {
        type: json.type,
        accountName: json.accountName,
        problemStatement: problemStatement, // 新規追加
        entries: json.entries,
        blanks: json.blanks,
        hints: json.hints,
      };

      // JSON文字列化（エスケープ処理）
      const newJsonStr = JSON.stringify(updatedJson)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

      // 元の文字列を置換
      const replacement = `${match[1]}${newJsonStr}",`;
      content = content.replace(match[0], replacement);

      console.log(`  ✅ 追加完了`);
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  });

  // 修正後のファイルを保存
  fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");

  console.log("\n=== 完了 ===");
  console.log(`✅ ${MASTER_QUESTIONS_PATH} を更新しました`);
  console.log(`\n次のステップ:`);
  console.log("1. npx tsc --noEmit で型チェック");
  console.log("2. データバージョンを更新 (migrations/index.ts)");
  console.log("3. アプリで動作確認");
}

if (require.main === module) {
  main();
}
