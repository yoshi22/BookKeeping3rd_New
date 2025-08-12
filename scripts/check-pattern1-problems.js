const fs = require("fs");
const path = require("path");

console.log("📌 パターン1：勘定記入問題（Q_L_001-Q_L_010）チェック\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(questionsPath, "utf8");

// 各問題を個別にチェック
const problemIds = [
  "Q_L_001",
  "Q_L_002",
  "Q_L_003",
  "Q_L_004",
  "Q_L_005",
  "Q_L_006",
  "Q_L_007",
  "Q_L_008",
  "Q_L_009",
  "Q_L_010",
];

const issues = [];

for (const id of problemIds) {
  console.log(`\n🔍 ${id} チェック中...`);

  // 問題文の抽出
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  if (!questionMatch) {
    console.log(`❌ ${id}: 問題文が見つかりません`);
    issues.push({ id, type: "missing", issue: "問題文が見つかりません" });
    continue;
  }

  const questionText = questionMatch[1];
  console.log(`📝 問題文長さ: ${questionText.length}文字`);

  // 1. 問題文の十分性チェック
  const hasConcreteData =
    questionText.includes("【取引データ】") ||
    questionText.includes("【前月末残高】") ||
    questionText.includes("【期首残高】") ||
    questionText.includes("取引：") ||
    questionText.includes("月日:");

  if (!hasConcreteData) {
    console.log(`⚠️ ${id}: 具体的な取引データが不足している可能性`);
    issues.push({ id, type: "insufficient", issue: "具体的取引データ不足" });
  }

  // 2. 解答形式チェック
  const answerRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
    "s",
  );
  const answerMatch = content.match(answerRegex);

  if (!answerMatch) {
    console.log(`❌ ${id}: 解答が見つかりません`);
    issues.push({ id, type: "missing", issue: "解答が見つかりません" });
    continue;
  }

  try {
    const answer = JSON.parse(answerMatch[1]);
    if (!answer.entries || !Array.isArray(answer.entries)) {
      console.log(`❌ ${id}: 解答形式が不適切（entriesなし）`);
      issues.push({ id, type: "format", issue: "解答形式不適切" });
    } else {
      console.log(`✅ ${id}: ${answer.entries.length}個のエントリ確認`);
    }
  } catch (e) {
    console.log(`❌ ${id}: JSON解析エラー`);
    issues.push({ id, type: "json", issue: "JSON解析エラー" });
  }

  // 3. タグチェック
  const tagsRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?tags_json:\\s*'([^']*)'`,
    "s",
  );
  const tagsMatch = content.match(tagsRegex);

  if (tagsMatch) {
    try {
      const tags = JSON.parse(tagsMatch[1]);
      if (tags.pattern && tags.pattern.includes("勘定")) {
        console.log(`✅ ${id}: タグ適切`);
      } else {
        console.log(`⚠️ ${id}: タグパターンが不適切`);
        issues.push({ id, type: "tags", issue: "タグパターン不適切" });
      }
    } catch (e) {
      console.log(`⚠️ ${id}: タグJSON解析エラー`);
    }
  }
}

// サマリー出力
console.log("\n" + "=".repeat(50));
console.log("📊 パターン1チェック結果サマリー");
console.log("=".repeat(50));
console.log(`総問題数: 10`);
console.log(`問題あり: ${issues.length}件`);

if (issues.length > 0) {
  console.log("\n🔧 修正が必要な問題:");
  issues.forEach((issue) => {
    console.log(`  • ${issue.id}: ${issue.issue}`);
  });
}

// 結果をファイルに保存
fs.writeFileSync(
  path.join(__dirname, "pattern1-check-result.json"),
  JSON.stringify(issues, null, 2),
);

console.log("\n✅ パターン1チェック完了");
