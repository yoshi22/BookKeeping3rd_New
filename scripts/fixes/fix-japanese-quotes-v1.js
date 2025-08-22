const fs = require("fs");
/* eslint-disable */
const path = require("path");

/**
 * 134問制限問題修正スクリプト - 反復1
 * 日本語引用符「」を通常の引用符""に置換
 */

function fixJapaneseQuotes() {
  console.log("=== 日本語引用符修正スクリプト v1 ===");

  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  const backupPath = `${filePath}.backup-japanese-quotes-${Date.now()}`;

  // バックアップ作成
  console.log("1. バックアップ作成中...");
  const originalContent = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(backupPath, originalContent);
  console.log(`   → ${path.basename(backupPath)}`);

  // 日本語引用符を検索
  console.log("\n2. 日本語引用符パターンを検索...");
  const japaneseQuotePattern = /「([^」]+)」/g;
  const matches = [];
  let match;

  let lineNumber = 1;
  const lines = originalContent.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let matchInLine;
    while ((matchInLine = japaneseQuotePattern.exec(line)) !== null) {
      matches.push({
        line: i + 1,
        match: matchInLine[0],
        content: matchInLine[1],
        fullLine: line.trim(),
      });
    }
    // Reset regex lastIndex for each line
    japaneseQuotePattern.lastIndex = 0;
  }

  console.log(`   → ${matches.length}件の日本語引用符を発見`);

  if (matches.length === 0) {
    console.log("   修正対象がありません。");
    return { success: true, fixesApplied: 0 };
  }

  // 発見した問題を表示
  console.log("\n3. 発見された問題:");
  matches.forEach((match, index) => {
    console.log(`   ${index + 1}. 行${match.line}: 「${match.content}」`);
    console.log(`      → "${match.content}"に変更予定`);
  });

  // 修正実行
  console.log("\n4. 修正を実行...");
  let modifiedContent = originalContent;
  let fixCount = 0;

  // 日本語引用符を通常の引用符に置換
  modifiedContent = modifiedContent.replace(
    /「([^」]+)」/g,
    (match, content) => {
      fixCount++;
      console.log(`   修正${fixCount}: 「${content}」 → "${content}"`);
      return `"${content}"`;
    },
  );

  // JSON妥当性をチェック
  console.log("\n5. JSON妥当性チェック...");
  let jsonErrors = [];

  // Q_J_135周辺の問題をテスト
  const q135Match = modifiedContent.match(
    /id:\s*["']Q_J_135["'][^}]+tags_json:\s*'([^']+)'/s,
  );
  if (q135Match) {
    try {
      JSON.parse(q135Match[1]);
      console.log("   ✅ Q_J_135のtags_json: 有効");
    } catch (e) {
      jsonErrors.push(`Q_J_135 tags_json: ${e.message}`);
      console.log(`   ❌ Q_J_135のtags_json: ${e.message}`);
    }
  }

  // 全体的なJSONフィールドチェック（サンプル）
  const jsonFieldPattern =
    /(tags_json|correct_answer_json|answer_template_json):\s*'([^']+)'/g;
  let jsonMatch;
  let checkedCount = 0;
  let errorCount = 0;

  while (
    (jsonMatch = jsonFieldPattern.exec(modifiedContent)) !== null &&
    checkedCount < 10
  ) {
    checkedCount++;
    try {
      JSON.parse(jsonMatch[2]);
    } catch (e) {
      errorCount++;
      jsonErrors.push(`${jsonMatch[1]}: ${e.message.substring(0, 50)}...`);
    }
  }

  console.log(`   チェック済みJSONフィールド: ${checkedCount}件`);
  console.log(`   エラー: ${errorCount}件`);

  if (jsonErrors.length > 0) {
    console.log("\n⚠️  残存するJSONエラー:");
    jsonErrors.slice(0, 5).forEach((error) => {
      console.log(`   - ${error}`);
    });
  }

  // ファイルに保存
  console.log("\n6. 修正版を保存...");
  fs.writeFileSync(filePath, modifiedContent);

  console.log("\n=== 修正完了 ===");
  console.log(`修正件数: ${fixCount}件`);
  console.log(`バックアップ: ${path.basename(backupPath)}`);
  console.log(`残存JSONエラー: ${jsonErrors.length}件`);

  return {
    success: true,
    fixesApplied: fixCount,
    jsonErrors: jsonErrors,
    backupFile: backupPath,
  };
}

if (require.main === module) {
  try {
    const result = fixJapaneseQuotes();
    console.log("\\n修正結果:", {
      success: result.success,
      fixes: result.fixesApplied,
      errors: result.jsonErrors?.length || 0,
    });
  } catch (error) {
    console.error("修正エラー:", error.message);
    process.exit(1);
  }
}

module.exports = { fixJapaneseQuotes };
