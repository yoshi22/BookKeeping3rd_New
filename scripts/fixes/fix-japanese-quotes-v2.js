const fs = require("fs");
const path = require("path");

/**
 * 134問制限問題修正スクリプト - 反復1 (v2)
 * JSON文字列内の日本語引用符「」のみを通常の引用符""に置換
 * 説明文（explanation）内の日本語引用符は保護
 */

function fixJapaneseQuotesInJson() {
  console.log("=== 日本語引用符修正スクリプト v2 (JSON限定) ===");

  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  const backupPath = `${filePath}.backup-japanese-quotes-v2-${Date.now()}`;

  // バックアップ作成
  console.log("1. バックアップ作成中...");
  const originalContent = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(backupPath, originalContent);
  console.log(`   → ${path.basename(backupPath)}`);

  // JSON文字列内の日本語引用符を特定して修正
  console.log("\n2. JSON文字列内の日本語引用符パターンを検索...");

  let modifiedContent = originalContent;
  let totalFixes = 0;
  let jsonFieldErrors = [];

  // tags_json, correct_answer_json, answer_template_json フィールドを処理
  const jsonFieldPattern =
    /(tags_json|correct_answer_json|answer_template_json):\s*'([^']+)'/g;

  modifiedContent = modifiedContent.replace(
    jsonFieldPattern,
    (match, fieldName, jsonString) => {
      let originalJsonString = jsonString;
      let modifiedJsonString = jsonString;
      let fieldFixes = 0;

      // JSON文字列内の日本語引用符を置換
      modifiedJsonString = jsonString.replace(
        /「([^」]+)」/g,
        (quoteMatch, content) => {
          fieldFixes++;
          totalFixes++;
          console.log(
            `   修正${totalFixes}: ${fieldName}内 「${content}」 → "${content}"`,
          );
          return `"${content}"`;
        },
      );

      // 修正後のJSON妥当性をチェック
      if (fieldFixes > 0) {
        try {
          JSON.parse(modifiedJsonString);
          console.log(`   ✅ ${fieldName}: JSON妥当性確認済み`);
        } catch (e) {
          jsonFieldErrors.push(`${fieldName}: ${e.message}`);
          console.log(`   ❌ ${fieldName}: JSONエラー - ${e.message}`);
          // エラーの場合は元の文字列を使用
          modifiedJsonString = originalJsonString;
          totalFixes -= fieldFixes; // 失敗したカウントを減算
          fieldFixes = 0;
        }
      }

      return `${fieldName}: '${modifiedJsonString}'`;
    },
  );

  console.log(`\n3. 修正結果: ${totalFixes}件の日本語引用符を修正`);

  if (jsonFieldErrors.length > 0) {
    console.log("\n⚠️  修正をスキップしたJSONエラー:");
    jsonFieldErrors.forEach((error) => {
      console.log(`   - ${error}`);
    });
  }

  // 特定の問題 Q_J_135 を確認
  console.log("\n4. Q_J_135の確認...");
  const q135Match = modifiedContent.match(
    /id:\s*["']Q_J_135["'][^}]+tags_json:\s*'([^']+)'/s,
  );
  if (q135Match) {
    try {
      const parsedJson = JSON.parse(q135Match[1]);
      console.log("   ✅ Q_J_135のtags_json: 修正完了・有効");
      console.log(
        `   内容: ${JSON.stringify(parsedJson.keywords || []).substring(0, 100)}...`,
      );
    } catch (e) {
      console.log(`   ❌ Q_J_135のtags_json: まだエラーあり - ${e.message}`);
      return {
        success: false,
        error: `Q_J_135 tags_json still invalid: ${e.message}`,
        fixesApplied: totalFixes,
      };
    }
  } else {
    console.log("   ⚠️  Q_J_135が見つかりません");
  }

  // 全体的なJSONフィールドチェック（修正後）
  console.log("\n5. 全体JSON妥当性チェック...");
  const checkPattern =
    /(tags_json|correct_answer_json|answer_template_json):\s*'([^']+)'/g;
  let checkMatch;
  let validCount = 0;
  let invalidCount = 0;
  let sampleErrors = [];

  while (
    (checkMatch = checkPattern.exec(modifiedContent)) !== null &&
    validCount + invalidCount < 20
  ) {
    try {
      JSON.parse(checkMatch[2]);
      validCount++;
    } catch (e) {
      invalidCount++;
      if (sampleErrors.length < 3) {
        sampleErrors.push(`${checkMatch[1]}: ${e.message.substring(0, 50)}...`);
      }
    }
  }

  console.log(`   サンプルチェック: ${validCount}有効 / ${invalidCount}無効`);
  if (sampleErrors.length > 0) {
    console.log("   残存エラー例:");
    sampleErrors.forEach((error) => console.log(`     - ${error}`));
  }

  // ファイルに保存
  if (totalFixes > 0) {
    console.log("\n6. 修正版を保存...");
    fs.writeFileSync(filePath, modifiedContent);
  } else {
    console.log("\n6. 修正対象がありませんでした。");
  }

  console.log("\n=== 修正完了 ===");
  console.log(`修正件数: ${totalFixes}件`);
  console.log(`バックアップ: ${path.basename(backupPath)}`);
  console.log(`JSONエラー: ${jsonFieldErrors.length}件`);

  return {
    success: totalFixes > 0 && jsonFieldErrors.length === 0,
    fixesApplied: totalFixes,
    jsonErrors: jsonFieldErrors,
    backupFile: backupPath,
  };
}

if (require.main === module) {
  try {
    const result = fixJapaneseQuotesInJson();
    console.log("\n修正結果:", {
      success: result.success,
      fixes: result.fixesApplied,
      errors: result.jsonErrors?.length || 0,
    });

    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("修正エラー:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

module.exports = { fixJapaneseQuotesInJson };
