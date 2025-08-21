/**
 * 複数仕訳エントリのJSON形式修正スクリプト
 *
 * 問題: Q_J_075以降の複数仕訳問題でJSON形式が無効
 * 誤った形式: '{"journalEntry":{...},{...}}'
 * 正しい形式: '[{...},{...}]'
 */

const fs = require("fs");
const path = require("path");

function fixMultipleJournalEntries() {
  console.log("=== 複数仕訳エントリJSON修正スクリプト開始 ===");

  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  console.log(`処理対象ファイル: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`エラー: ファイルが見つかりません: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  let fixedCount = 0;
  const fixedQuestions = [];

  // パターン1: 最も一般的な無効形式を検出・修正
  // '{"journalEntry":{...},{...}}' -> '[{...},{...}]'
  const pattern1 =
    /correct_answer_json:\s*'(\{"journalEntry":\{[^}]+\}),(\{[^}]+\})"/g;

  content = content.replace(pattern1, (match, entry1, entry2) => {
    try {
      // journalEntry部分を取り除いて配列形式に変換
      const cleanEntry1 = entry1.replace('{"journalEntry":', "");
      const arrayFormat = `[${cleanEntry1},${entry2}]`;

      // JSON形式の妥当性をチェック
      JSON.parse(arrayFormat);

      fixedCount++;
      console.log(`修正 ${fixedCount}: ${match.substring(0, 100)}...`);

      return `correct_answer_json: '${arrayFormat}'`;
    } catch (e) {
      console.warn(
        `スキップ（パターン1）: ${match.substring(0, 100)}... - ${e.message}`,
      );
      return match;
    }
  });

  // パターン2: より複雑な無効形式を検出・修正
  // '{"journalEntry":{"debit_account":"..."}},{"debit_account":"..."}}'
  const pattern2 =
    /correct_answer_json:\s*'(\{"journalEntry":\{[^}]+\}),(\{[^}]+\})\}'/g;

  content = content.replace(pattern2, (match, entry1, entry2) => {
    try {
      const cleanEntry1 = entry1.replace('{"journalEntry":', "");
      const arrayFormat = `[${cleanEntry1},${entry2}]`;

      JSON.parse(arrayFormat);

      fixedCount++;
      console.log(`修正 ${fixedCount}: ${match.substring(0, 100)}...`);

      return `correct_answer_json: '${arrayFormat}'`;
    } catch (e) {
      console.warn(
        `スキップ（パターン2）: ${match.substring(0, 100)}... - ${e.message}`,
      );
      return match;
    }
  });

  // パターン3: 手動で特定の問題を修正（Q_J_075など）
  const manualFixes = [
    {
      from: `correct_answer_json:
      '{"journalEntry":{"debit_account":"売掛金","debit_amount":52000,"credit_account":"売上","credit_amount":50000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":2000}}',`,
      to: `correct_answer_json:
      '[{"debit_account":"売掛金","debit_amount":52000,"credit_account":"売上","credit_amount":50000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":2000}]',`,
    },
    {
      from: `'{"journalEntry":{"debit_account":"売掛金","debit_amount":52000,"credit_account":"売上","credit_amount":50000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":2000}}'`,
      to: `'[{"debit_account":"売掛金","debit_amount":52000,"credit_account":"売上","credit_amount":50000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":2000}]'`,
    },
  ];

  manualFixes.forEach((fix, index) => {
    if (content.includes(fix.from)) {
      content = content.replace(fix.from, fix.to);
      fixedCount++;
      console.log(`手動修正 ${index + 1}: 適用済み`);
    }
  });

  // 結果の確認
  if (content === originalContent) {
    console.log("修正対象となるパターンが見つかりませんでした。");
    return;
  }

  console.log(`\n=== 修正結果サマリー ===`);
  console.log(`修正された問題数: ${fixedCount}`);

  // 修正後の内容を保存
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ファイルを更新しました: ${filePath}`);
  } catch (error) {
    console.error(`❌ ファイル保存エラー:`, error);
    return;
  }

  console.log("\n=== JSON形式検証 ===");
  validateJsonFormat();

  console.log("\n=== 修正完了 ===");
  console.log("次のステップ:");
  console.log("1. src/data/migrations/index.ts でSAMPLE_DATA_VERSIONを更新");
  console.log("2. forceUpdate = true を一時的に設定");
  console.log("3. アプリを起動して250問が表示されることを確認");
  console.log("4. forceUpdate = false に戻す");
}

/**
 * 修正後のJSON形式を検証
 */
function validateJsonFormat() {
  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  const content = fs.readFileSync(filePath, "utf8");

  // 配列形式の仕訳エントリをチェック
  const arrayPatterns = content.match(/correct_answer_json:\s*'\[{[^\]]+}\]'/g);
  if (arrayPatterns) {
    console.log(`✅ 配列形式の複数仕訳: ${arrayPatterns.length}件`);
  }

  // 無効なパターンが残っていないかチェック
  const invalidPatterns = content.match(
    /\{"journalEntry":\{[^}]+\}},\{[^}]+\}/g,
  );
  if (invalidPatterns) {
    console.log(`⚠️  未修正の無効パターン: ${invalidPatterns.length}件`);
    invalidPatterns.slice(0, 3).forEach((pattern, index) => {
      console.log(`  ${index + 1}: ${pattern.substring(0, 100)}...`);
    });
  } else {
    console.log(`✅ 無効なJSONパターンは検出されませんでした`);
  }
}

// スクリプト実行
if (require.main === module) {
  fixMultipleJournalEntries();
}

module.exports = { fixMultipleJournalEntries };
