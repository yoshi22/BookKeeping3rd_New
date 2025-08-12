const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_015-Q_L_040 最終包括検証\n");
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
  const num = parseInt(id.split("_")[2]);
  const nextId =
    num < 40 ? `Q_L_${String(num + 1).padStart(3, "0")}` : "Q_TB_001";

  const startPattern = new RegExp(`id: "${id}"`);
  const endPattern = new RegExp(`id: "${nextId}"`);

  const startMatch = content.match(startPattern);
  const endMatch = content.match(endPattern);

  if (!startMatch) return null;

  const startIndex = startMatch.index;
  const endIndex = endMatch ? endMatch.index : content.length;

  return content.substring(startIndex, endIndex);
}

// 検証結果の集計
const results = {
  byPattern: {
    pattern2: { range: "Q_L_011-020", passed: [], failed: [] },
    pattern3: { range: "Q_L_021-030", passed: [], failed: [] },
    pattern4: { range: "Q_L_031-040", passed: [], failed: [] },
  },
  total: { passed: [], failed: [] },
};

console.log("📋 検証対象: Q_L_015-Q_L_040 (26問)\n");

// Q_L_015-Q_L_040を検証
for (let i = 15; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const questionSection = extractQuestion(id);

  if (!questionSection) {
    results.total.failed.push({ id, issue: "問題が見つかりません" });
    continue;
  }

  // パターンを判定
  let pattern = "";
  let expectedTemplate = "";

  if (i <= 20) {
    pattern = "pattern2";
    expectedTemplate = "ledger_entry";
  } else if (i <= 30) {
    pattern = "pattern3";
    expectedTemplate = "voucher_entry";
  } else {
    pattern = "pattern4";
    expectedTemplate = ["single_choice", "multiple_choice"];
  }

  // 各フィールドの存在確認
  const hasQuestionText = questionSection.includes("question_text:");
  const hasTemplate = questionSection.includes("answer_template_json:");
  const hasAnswer = questionSection.includes("correct_answer_json:");
  const hasExplanation = questionSection.includes("explanation:");
  const hasCategory = questionSection.includes('category_id: "ledger"');

  // テンプレートタイプを確認
  const templateMatch = questionSection.match(
    /answer_template_json:\s*'([^']+)'/,
  );
  let templateValid = false;
  let templateType = null;

  if (templateMatch) {
    try {
      const template = JSON.parse(templateMatch[1]);
      templateType = template.type;

      if (Array.isArray(expectedTemplate)) {
        templateValid = expectedTemplate.includes(templateType);
      } else {
        templateValid = templateType === expectedTemplate;
      }
    } catch (e) {
      templateValid = false;
    }
  }

  // 解答の完全性を確認
  const answerMatch = questionSection.match(/correct_answer_json:\s*'([^']+)'/);
  let answerValid = false;
  let detailInfo = "";

  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);

      if (i <= 20) {
        // 補助簿記入問題
        answerValid = answer.entries && answer.entries.length > 0;
        detailInfo = `記入${answer.entries ? answer.entries.length : 0}件`;
      } else if (i <= 30) {
        // 伝票記入問題
        if (answer.vouchers && answer.vouchers.length > 0) {
          let totalEntries = 0;
          answer.vouchers.forEach((v) => {
            if (v.entries) totalEntries += v.entries.length;
          });
          answerValid = answer.vouchers.length > 1 || totalEntries > 0;
          detailInfo = `伝票${answer.vouchers.length}枚、記入${totalEntries}件`;
        }
      } else {
        // 選択問題
        answerValid =
          answer.selected !== undefined ||
          answer.selected_options !== undefined;
        detailInfo = answer.selected_options
          ? `複数選択(${answer.selected_options.length}個)`
          : `単一選択`;
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

    if (i <= 20) {
      // 補助簿関連キーワード
      explanationSpecific =
        (explanation.includes("出納帳") ||
          explanation.includes("元帳") ||
          explanation.includes("仕入帳") ||
          explanation.includes("売上帳")) &&
        !explanation.includes("一般的");
    } else if (i <= 30) {
      // 伝票関連キーワード
      explanationSpecific =
        explanation.includes("伝票") &&
        (explanation.includes("入金") ||
          explanation.includes("出金") ||
          explanation.includes("振替") ||
          explanation.includes("売上") ||
          explanation.includes("仕入"));
    } else {
      // 理論問題キーワード
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
  if (!templateValid) issues.push(`テンプレート不適切(${templateType})`);
  if (!answerValid) issues.push("正答不完全");
  if (!explanationSpecific) issues.push("解説が一般的");

  if (issues.length === 0) {
    console.log(`✅ ${id}: OK (${detailInfo})`);
    results.byPattern[pattern].passed.push(id);
    results.total.passed.push(id);
  } else {
    console.log(`❌ ${id}: ${issues.join(", ")}`);
    results.byPattern[pattern].failed.push({ id, issues });
    results.total.failed.push({ id, issues });
  }
}

// サマリー表示
console.log("\n" + "=" * 60);
console.log("📊 最終検証結果サマリー");
console.log("=" * 60);

// パターン別結果
Object.entries(results.byPattern).forEach(([key, data]) => {
  const total = data.passed.length + data.failed.length;
  if (total > 0) {
    console.log(`\n${data.range}:`);
    console.log(`  ✅ 合格: ${data.passed.length}/${total}問`);
    console.log(`  ❌ 不合格: ${data.failed.length}/${total}問`);

    if (data.failed.length > 0) {
      data.failed.forEach(({ id, issues }) => {
        console.log(`     ${id}: ${issues.join(", ")}`);
      });
    }
  }
});

// 全体結果
console.log("\n" + "-" * 60);
console.log("全体 (Q_L_015-Q_L_040):");
console.log(`  ✅ 合格: ${results.total.passed.length}/26問`);
console.log(`  ❌ 不合格: ${results.total.failed.length}/26問`);

if (results.total.failed.length === 0) {
  console.log("\n🎉 全26問が正常に修正されています！");
  console.log("Q_L_015-Q_L_040の修正作業が完了しました。");
} else {
  console.log("\n⚠️ まだ問題が残っています。");
}

// 詳細レポートを保存
const report = {
  timestamp: new Date().toISOString(),
  range: "Q_L_015-Q_L_040",
  totalProblems: 26,
  summary: {
    passed: results.total.passed.length,
    failed: results.total.failed.length,
  },
  byPattern: results.byPattern,
  details: {
    passed: results.total.passed,
    failed: results.total.failed,
  },
};

fs.writeFileSync(
  path.join(__dirname, "final-verification-q-l-015-040.json"),
  JSON.stringify(report, null, 2),
);

console.log("\n📝 詳細レポート保存: final-verification-q-l-015-040.json");
