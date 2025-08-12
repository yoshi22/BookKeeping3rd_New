const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_021-Q_L_040の最終検証\n");
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
  const nextIdStr =
    nextId <= 40 ? `Q_L_${String(nextId).padStart(3, "0")}` : "Q_TB_001";

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

for (let i = 21; i <= 40; i++) {
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

  // 解答を詳しく確認
  const answerMatch = questionSection.match(/correct_answer_json:\s*'([^']+)'/);
  let answerValid = false;
  let voucherCount = 0;
  let entryCount = 0;

  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);

      if (i >= 21 && i <= 30) {
        // 伝票問題の場合
        if (answer.vouchers && answer.vouchers.length > 0) {
          voucherCount = answer.vouchers.length;
          answer.vouchers.forEach((v) => {
            if (v.entries) {
              entryCount += v.entries.length;
            }
          });
          answerValid = voucherCount > 0 && entryCount > 0;
        }
      } else {
        // 選択問題の場合
        answerValid =
          answer.selected !== undefined ||
          answer.selected_options !== undefined;
      }
    } catch (e) {
      answerValid = false;
    }
  }

  // 解説の具体性を確認
  const explanationMatch = questionSection.match(/explanation:\s*"([^"]+)"/);
  let explanationSpecific = false;

  if (explanationMatch) {
    const explanation = explanationMatch[1];
    if (i >= 21 && i <= 30) {
      // 伝票問題：具体的な取引と伝票種類が含まれているか
      explanationSpecific =
        explanation.includes("伝票") &&
        (explanation.includes("入金伝票") ||
          explanation.includes("出金伝票") ||
          explanation.includes("振替伝票") ||
          explanation.includes("売上伝票") ||
          explanation.includes("仕入伝票"));
    } else {
      // 選択問題：正解番号と具体的な説明が含まれているか
      explanationSpecific =
        explanation.includes("正解") || explanation.includes("番");
    }
  }

  // 結果判定
  const issues = [];

  if (!hasQuestionText) issues.push("問題文なし");
  if (!hasTemplate) issues.push("テンプレートなし");
  if (!hasAnswer) issues.push("正答なし");
  if (!hasExplanation) issues.push("解説なし");
  if (!hasCategory) issues.push("カテゴリなし");
  if (!answerValid) issues.push("正答が不完全");
  if (!explanationSpecific) issues.push("解説が一般的");

  if (issues.length === 0) {
    console.log("  ✅ 全項目OK");
    if (i >= 21 && i <= 30) {
      console.log(`     伝票数: ${voucherCount}、エントリー数: ${entryCount}`);
    }
    results.passed.push(id);
  } else {
    console.log(`  ❌ 問題あり: ${issues.join(", ")}`);
    results.failed.push({ id, issues });
  }
}

// サマリー
console.log("\n" + "=" * 60);
console.log("📊 最終検証結果");
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
  console.log("\n🎉 全20問が正常に修正されています！");
}

// 詳細レポートを保存
const report = {
  timestamp: new Date().toISOString(),
  totalProblems: 20,
  passed: results.passed.length,
  failed: results.failed.length,
  details: {
    passed: results.passed,
    failed: results.failed,
  },
};

fs.writeFileSync(
  path.join(__dirname, "final-verification-report.json"),
  JSON.stringify(report, null, 2),
);

console.log("\n📝 詳細レポート保存: final-verification-report.json");
