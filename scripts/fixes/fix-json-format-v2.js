/**
 * 複数仕訳エントリのJSON形式修正スクリプト v2
 *
 * 実際のパターンに基づいた修正
 */

const fs = require("fs");
const path = require("path");

function fixJsonFormat() {
  console.log("=== JSON形式修正スクリプト v2 開始 ===");

  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  console.log(`処理対象ファイル: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`エラー: ファイルが見つかりません: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  let fixedCount = 0;

  // 実際に見つかったパターン: '{"journalEntry":{...},{...}}'
  // 正規表現パターンを実際のファイル内容に合わせて調整
  const problematicPattern = /'(\{"journalEntry":\{[^}]+\}),(\{[^}]+\})'/g;

  content = content.replace(problematicPattern, (match, entry1, entry2) => {
    try {
      // journalEntry部分を除去して配列形式に変換
      const cleanEntry1 = entry1.replace('{"journalEntry":', "");
      const arrayFormat = `'[${cleanEntry1},${entry2}]'`;

      // JSON妥当性チェック（クォート除去して）
      const jsonToTest = arrayFormat.slice(1, -1); // クォートを除去
      JSON.parse(jsonToTest);

      fixedCount++;
      console.log(
        `修正 ${fixedCount}: ${match.substring(0, 80)}... -> ${arrayFormat.substring(0, 80)}...`,
      );

      return arrayFormat;
    } catch (e) {
      console.warn(`スキップ: ${match.substring(0, 80)}... - ${e.message}`);
      return match;
    }
  });

  // より複雑なパターンもチェック
  const complexPattern = /'(\{"journalEntry":\{[^}]+\}),(\{[^}]+\})\}'/g;

  content = content.replace(complexPattern, (match, entry1, entry2) => {
    try {
      const cleanEntry1 = entry1.replace('{"journalEntry":', "");
      const arrayFormat = `'[${cleanEntry1},${entry2}]'`;

      const jsonToTest = arrayFormat.slice(1, -1);
      JSON.parse(jsonToTest);

      fixedCount++;
      console.log(
        `修正 ${fixedCount}: ${match.substring(0, 80)}... -> ${arrayFormat.substring(0, 80)}...`,
      );

      return arrayFormat;
    } catch (e) {
      console.warn(`スキップ: ${match.substring(0, 80)}... - ${e.message}`);
      return match;
    }
  });

  // 結果の確認
  if (content === originalContent) {
    console.log("修正対象となるパターンが見つかりませんでした。");
    console.log("\n既存の複数仕訳パターンを確認中...");

    // デバッグ: 既存のjournalEntryパターンを表示
    const existingPatterns = content.match(/'[^']*journalEntry[^']*'/g);
    if (existingPatterns) {
      console.log(`既存のjournalEntryパターン: ${existingPatterns.length}件`);
      existingPatterns.slice(0, 5).forEach((pattern, index) => {
        console.log(`  ${index + 1}: ${pattern.substring(0, 100)}...`);
      });
    }

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
}

/**
 * JSON形式の検証
 */
function validateJsonFormat() {
  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  const content = fs.readFileSync(filePath, "utf8");

  // 配列形式の複数仕訳をカウント
  const arrayPatterns = content.match(/'\[\{[^\]]+\}[\s\S]*?\{[^\]]+\}\]'/g);
  if (arrayPatterns) {
    console.log(`✅ 配列形式の複数仕訳: ${arrayPatterns.length}件`);
  }

  // 残存する問題のあるパターンをチェック
  const remainingIssues = content.match(
    /'\{"journalEntry":\{[^}]+\}},\{[^}]+\}'/g,
  );
  if (remainingIssues) {
    console.log(`⚠️ 未修正の問題パターン: ${remainingIssues.length}件`);
    remainingIssues.slice(0, 3).forEach((pattern, index) => {
      console.log(`  ${index + 1}: ${pattern.substring(0, 100)}...`);
    });
  } else {
    console.log("✅ 問題のあるJSONパターンは検出されませんでした");
  }

  // 単一仕訳のパターンもカウント
  const singlePatterns = content.match(/'\{"journalEntry":\{[^,]+\}\}'/g);
  if (singlePatterns) {
    console.log(`ℹ️ 単一仕訳パターン: ${singlePatterns.length}件（修正不要）`);
  }
}

// スクリプト実行
if (require.main === module) {
  fixJsonFormat();
}

module.exports = { fixJsonFormat };
