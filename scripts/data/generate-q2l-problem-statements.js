/**
 * Q2_L_006-020の問題文（problemStatement）を自動生成するスクリプト
 *
 * 目的：
 * - Q2_L_006-020にはproblemStatementフィールドがないため、
 *   entriesデータからQ2_L_001-005と同様の形式の問題文を生成
 *
 * 実行方法：
 *   node scripts/data/generate-q2l-problem-statements.js
 */

const fs = require("fs");
const path = require("path");

// master-questions.tsのパス
const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// Q2_L_001-005の形式に準拠した問題文を生成
function generateProblemStatement(accountName, entries) {
  // ヘッダー部分
  let statement = `以下の取引が行われました。${accountName}勘定の記入を行ってください。\n\n`;

  // 各取引を箇条書きで追加
  entries.forEach((entry) => {
    const amountStr = entry.amount ? `${entry.amount.toLocaleString()}円` : "";
    statement += `• ${entry.date}: ${entry.description} ${amountStr}\n`;
  });

  // フッター部分
  statement += "\nなお、借方合計と貸方合計は必ず一致します。";

  return statement;
}

// master-questions.tsを読み込み
function main() {
  console.log("master-questions.tsを読み込み中...\n");

  const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");

  const results = [];

  // Q2_L_006-020を処理
  for (let i = 6; i <= 20; i++) {
    const id = `Q2_L_${String(i).padStart(3, "0")}`;

    // 問題データを正規表現で抽出
    const regex = new RegExp(
      `id:\\s*["']${id}["'][\\s\\S]*?answer_template_json:\\s*["']({[\\s\\S]*?})["'],`,
      "m",
    );

    const match = content.match(regex);

    if (!match) {
      console.error(`❌ ${id} が見つかりません`);
      continue;
    }

    try {
      // JSONパース（エスケープ処理）
      const jsonStr = match[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");

      const json = JSON.parse(jsonStr);

      // problemStatementを生成
      const problemStatement = generateProblemStatement(
        json.accountName,
        json.entries,
      );

      results.push({
        id,
        accountName: json.accountName,
        entriesCount: json.entries.length,
        problemStatement,
      });

      console.log(
        `✅ ${id} - ${json.accountName}勘定（${json.entries.length}件の取引）`,
      );
      console.log(`   ${problemStatement.substring(0, 60)}...`);
      console.log("");
    } catch (error) {
      console.error(`❌ ${id} の解析エラー:`, error.message);
    }
  }

  // 結果をJSON形式で保存
  const outputPath = path.join(__dirname, "q2l-problem-statements.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");

  console.log("\n=== 生成完了 ===");
  console.log(`処理件数: ${results.length}/15`);
  console.log(`出力ファイル: ${outputPath}`);
  console.log("\n次のステップ:");
  console.log("1. 生成された問題文を確認");
  console.log("2. master-questions.tsに手動で追加");
  console.log("3. データバージョンを更新");
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { generateProblemStatement };
