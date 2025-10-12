/**
 * Q2_L_006-020のanswer_template_jsonにproblemStatementを追加するスクリプト（改善版）
 *
 * 実行方法：
 *   node scripts/data/add-problem-statements-to-master-v2.js
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
  console.log("=== Q2_L_006-020へのproblemStatement追加（改善版） ===\n");

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

    // 問題データを正規表現で検索（より厳密なパターン）
    const regex = new RegExp(
      `(\\s*id:\\s*["']${id}["'],\\s*[\\s\\S]*?answer_template_json:\\s*)(["'])({[\\s\\S]*?})\\2(,)`,
      "m",
    );

    const match = content.match(regex);

    if (!match) {
      console.error(`  ❌ ${id} が見つかりません`);
      return;
    }

    try {
      const prefix = match[1];
      const quote = match[2];
      const jsonContent = match[3];
      const suffix = match[4];

      // JSONをパース（エスケープ解除）
      let json;
      try {
        // まず、TypeScriptファイル内のエスケープを解除
        const unescaped = jsonContent
          .replace(/\\"/g, '"')
          .replace(/\\n/g, "\n")
          .replace(/\\\\\\\\/g, "\\\\")
          .replace(/\\\\/g, "\\");

        json = JSON.parse(unescaped);
      } catch (parseError) {
        console.error(`  ❌ JSON解析エラー:`, parseError.message);
        return;
      }

      // problemStatementを追加
      const updatedJson = {
        type: json.type,
        accountName: json.accountName,
        problemStatement: problemStatement,
        entries: json.entries,
        blanks: json.blanks,
        hints: json.hints,
      };

      // JSON文字列化
      const jsonString = JSON.stringify(updatedJson);

      // TypeScriptファイル用にエスケープ
      // 1. バックスラッシュを二重エスケープ
      // 2. ダブルクォートをエスケープ
      const escaped = jsonString.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

      // 新しい文字列を構築
      const replacement = `${prefix}${quote}${escaped}${quote}${suffix}`;

      // 置換
      content = content.replace(match[0], replacement);

      console.log(`  ✅ 追加完了`);
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
      console.error(`  スタックトレース:`, error.stack);
    }
  });

  // 修正後のファイルを保存
  fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");

  console.log("\n=== 完了 ===");
  console.log(`✅ ${MASTER_QUESTIONS_PATH} を更新しました`);
  console.log(`\n次のステップ:`);
  console.log("1. npx tsc --noEmit で型チェック");
  console.log("2. アプリで動作確認");
}

if (require.main === module) {
  main();
}
