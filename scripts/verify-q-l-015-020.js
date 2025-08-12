const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_015-Q_L_020の検証\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(questionsPath, "utf8");

// 問題を抽出する関数
function extractQuestion(id) {
  const nextId = parseInt(id.split("_")[2]) + 1;
  const nextIdStr = `Q_L_${String(nextId).padStart(3, "0")}`;

  const startPattern = new RegExp(`id: "${id}"`);
  const endPattern = new RegExp(`id: "${nextIdStr}"`);

  const startMatch = content.match(startPattern);
  const endMatch = content.match(endPattern);

  if (!startMatch) return null;

  const startIndex = startMatch.index;
  const endIndex = endMatch ? endMatch.index : content.length;

  return content.substring(startIndex, endIndex);
}

// 検証結果
const results = {
  passed: [],
  failed: [],
};

console.log("📊 パターン2: 補助簿記入問題（Q_L_011-Q_L_020）\n");

for (let i = 15; i <= 20; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const questionSection = extractQuestion(id);

  if (!questionSection) {
    results.failed.push({ id, issue: "問題が見つかりません" });
    continue;
  }

  console.log(`\n📝 ${id}の検証:`);

  // 各フィールドを抽出
  const hasQuestionText = questionSection.includes("question_text:");
  const hasTemplate = questionSection.includes("answer_template_json:");
  const hasAnswer = questionSection.includes("correct_answer_json:");
  const hasExplanation = questionSection.includes("explanation:");
  const hasCategory = questionSection.includes("category_id:");

  // テンプレートタイプを確認
  const templateMatch = questionSection.match(
    /answer_template_json:\s*'([^']+)'/,
  );
  let templateType = null;
  let templateValid = false;

  if (templateMatch) {
    try {
      const template = JSON.parse(templateMatch[1]);
      templateType = template.type;

      // 補助簿問題は ledger_entry タイプを使用すべき
      if (templateType === "ledger_entry") {
        templateValid = true;
        console.log(`  テンプレートタイプ: ${templateType} ✅`);
      } else {
        console.log(
          `  テンプレートタイプ: ${templateType} ❌ (ledger_entryであるべき)`,
        );
      }
    } catch (e) {
      console.log("  テンプレート解析エラー");
    }
  }

  // 解答を詳しく確認
  const answerMatch = questionSection.match(/correct_answer_json:\s*'([^']+)'/);
  let answerValid = false;
  let entryCount = 0;

  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);

      // 補助簿記入問題の解答形式を確認
      if (answer.entries && answer.entries.length > 0) {
        entryCount = answer.entries.length;
        answerValid = true;
        console.log(`  記入項目数: ${entryCount} ✅`);
      } else {
        console.log(`  記入項目数: 0 ❌`);
      }
    } catch (e) {
      console.log("  解答解析エラー");
      answerValid = false;
    }
  }

  // 解説の具体性を確認
  const explanationMatch = questionSection.match(/explanation:\s*"([^"]+)"/);
  let explanationSpecific = false;

  if (explanationMatch) {
    const explanation = explanationMatch[1];
    // 補助簿関連のキーワードを確認
    explanationSpecific =
      (explanation.includes("現金出納帳") ||
        explanation.includes("当座預金出納帳") ||
        explanation.includes("仕入帳") ||
        explanation.includes("売上帳") ||
        explanation.includes("商品有高帳") ||
        explanation.includes("売掛金元帳") ||
        explanation.includes("買掛金元帳")) &&
      !explanation.includes("一般的");

    if (explanationSpecific) {
      console.log("  解説の具体性: ✅");
    } else {
      console.log("  解説の具体性: ❌");
    }
  }

  // 結果判定
  const issues = [];

  if (!hasQuestionText) issues.push("問題文なし");
  if (!hasTemplate) issues.push("テンプレートなし");
  if (!hasAnswer) issues.push("正答なし");
  if (!hasExplanation) issues.push("解説なし");
  if (!hasCategory) issues.push("カテゴリなし");
  if (!templateValid) issues.push("テンプレートタイプが不適切");
  if (!answerValid) issues.push("正答が不完全");
  if (!explanationSpecific) issues.push("解説が一般的");

  if (issues.length === 0) {
    console.log("  ✅ 全項目OK");
    results.passed.push(id);
  } else {
    console.log(`  ❌ 問題あり: ${issues.join(", ")}`);
    results.failed.push({ id, issues });
  }
}

// サマリー
console.log("\n" + "=" * 60);
console.log("📊 検証結果サマリー");
console.log("=" * 60);
console.log(`✅ 合格: ${results.passed.length}問`);
console.log(`❌ 不合格: ${results.failed.length}問`);

if (results.failed.length > 0) {
  console.log("\n⚠️ 問題のある問題:");
  results.failed.forEach(({ id, issues }) => {
    console.log(
      `  ${id}: ${Array.isArray(issues) ? issues.join(", ") : issues}`,
    );
  });
} else {
  console.log("\n🎉 Q_L_015-Q_L_020が正常です！");
}

// 詳細レポートを保存
const report = {
  timestamp: new Date().toISOString(),
  totalProblems: 6,
  passed: results.passed.length,
  failed: results.failed.length,
  details: {
    passed: results.passed,
    failed: results.failed,
  },
};

fs.writeFileSync(
  path.join(__dirname, "q-l-015-020-verification.json"),
  JSON.stringify(report, null, 2),
);

console.log("\n📝 詳細レポート保存: q-l-015-020-verification.json");
