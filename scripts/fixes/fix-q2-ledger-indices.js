/**
 * Q2_L問題のインデックス不整合修正スクリプト
 *
 * answer_template_json.blanks[].index に合わせて
 * correct_answer_json.blanks[].index を修正する
 */

const fs = require("fs");
const path = require("path");

// 修正データを読み込み
const fixDataPath = path.join(__dirname, "../data/q2-ledger-index-fixes.json");
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// 修正データが存在しない場合はエラー
if (!fs.existsSync(fixDataPath)) {
  console.error("❌ 修正データファイルが見つかりません");
  console.error("   先に check-q2-ledger-indices.js を実行してください");
  process.exit(1);
}

const fixes = JSON.parse(fs.readFileSync(fixDataPath, "utf-8"));

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  Q2_L問題のインデックス修正");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log(`修正対象: ${fixes.length}問\n`);

// バックアップ作成
const timestamp = Date.now();
const backupPath = `${masterQuestionsPath}.backup-${timestamp}`;
fs.copyFileSync(masterQuestionsPath, backupPath);
console.log(`✅ バックアップ作成: ${path.basename(backupPath)}\n`);

// master-questions.ts を読み込み
let content = fs.readFileSync(masterQuestionsPath, "utf-8");

// 各問題の修正を適用
fixes.forEach(({ id, templateBlanks, correctBlanks }) => {
  // 修正後の correct_answer_json を生成
  const fixedBlanks = templateBlanks.map((tb, idx) => ({
    index: tb.index,
    correctIndex: correctBlanks[idx]?.correctIndex || 0,
  }));

  const newCorrectAnswer = JSON.stringify({ blanks: fixedBlanks });

  // 問題データを検索して置換
  const oldCorrectAnswer = JSON.stringify({ blanks: correctBlanks });

  // エスケープ処理
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 問題IDでセクションを特定
  const idPattern = new RegExp(
    `(id:\\s*"${id}",[\\s\\S]*?correct_answer_json:\\s*')([^']+)(')`,
    "g",
  );

  const match = idPattern.exec(content);
  if (match) {
    const [fullMatch, prefix, oldJson, suffix] = match;

    // 古いJSONを新しいJSONに置換
    const newMatch = `${prefix}${newCorrectAnswer}${suffix}`;
    content = content.replace(fullMatch, newMatch);

    console.log(`✅ ${id}: 修正完了`);
    console.log(`   ${oldJson}`);
    console.log(`   → ${newCorrectAnswer}`);
  } else {
    console.log(`⚠️  ${id}: パターンマッチ失敗（手動確認が必要）`);
  }
});

// 修正後のファイルを保存
fs.writeFileSync(masterQuestionsPath, content, "utf-8");

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  修正完了");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log(`✅ ${fixes.length}問の修正を適用しました`);
console.log(`\n次のステップ:`);
console.log(`  1. src/data/migrations/index.ts の SAMPLE_DATA_VERSION を更新`);
console.log(`  2. forceUpdate = true に一時的に設定`);
console.log(`  3. npm start でシミュレーター起動・確認`);
console.log(`  4. forceUpdate = false に戻す\n`);
console.log(`バックアップから復元する場合:`);
console.log(`  cp ${backupPath} ${masterQuestionsPath}\n`);
