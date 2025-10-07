const fs = require("fs");

// master-questions.tsを読み込む
const filePath =
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts";
let content = fs.readFileSync(filePath, "utf8");

console.log("Q2_L_001-020のヒント削除スクリプト開始\n");

// Q2_L_001からQ2_L_020まで処理
for (let i = 1; i <= 20; i++) {
  const id = `Q2_L_${String(i).padStart(3, "0")}`;
  console.log(`Processing ${id}...`);

  // 該当するセクションを探す（id行からanswer_template_jsonまで）
  const idPattern = new RegExp(`id: "${id}",`);
  const match = content.match(idPattern);

  if (!match) {
    console.log(`  ⚠️ ${id} not found`);
    continue;
  }

  // answer_template_jsonのJSON部分を抽出
  const jsonPattern = new RegExp(
    `(id: "${id}",[\\s\\S]*?answer_template_json:\\s*)'({[\\s\\S]*?})',`,
  );
  const jsonMatch = content.match(jsonPattern);

  if (!jsonMatch) {
    console.log(`  ⚠️ ${id} answer_template_json not found`);
    continue;
  }

  const originalJson = jsonMatch[2];

  try {
    // JSONをパース
    const data = JSON.parse(originalJson);

    // hintsキーが存在する場合のみ処理
    if (data.hints) {
      console.log(`  ✅ Found hints: ${data.hints.length} items`);

      // hintsキーを削除
      delete data.hints;

      // 新しいJSONを生成
      const newJson = JSON.stringify(data);

      // 元のanswe_template_json全体を置換
      const oldSection = jsonMatch[0];
      const newSection = `${jsonMatch[1]}'${newJson}',`;

      content = content.replace(oldSection, newSection);

      console.log(`  ✅ Hints removed from ${id}`);
    } else {
      console.log(`  ℹ️ No hints found in ${id}`);
    }
  } catch (err) {
    console.error(`  ❌ Error parsing ${id}:`, err.message);
  }
}

// ファイルに書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log("\n✅ Q2_L_001-020のヒント削除完了");
console.log(`Updated: ${filePath}`);
