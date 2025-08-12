const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_021-Q_L_040の問題分析\n");
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

// 各問題を分析
const issues = [];

for (let i = 21; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const questionSection = extractQuestion(id);

  if (!questionSection) {
    console.log(`❌ ${id}: 問題が見つかりません`);
    continue;
  }

  console.log(`\n📝 ${id}の分析:`);

  // 問題文を抽出
  const questionMatch = questionSection.match(/question_text:\s*"([^"]+)"/);
  const questionText = questionMatch ? questionMatch[1] : "";

  // 解答テンプレートを抽出
  const templateMatch = questionSection.match(
    /answer_template_json:\s*'([^']+)'/,
  );
  const template = templateMatch ? JSON.parse(templateMatch[1]) : null;

  // 正答を抽出
  const answerMatch = questionSection.match(/correct_answer_json:\s*'([^']+)'/);
  const answer = answerMatch ? JSON.parse(answerMatch[1]) : null;

  // 解説を抽出
  const explanationMatch = questionSection.match(/explanation:\s*"([^"]+)"/);
  const explanation = explanationMatch ? explanationMatch[1] : "";

  // 問題タイプを判定
  let problemType = "";
  if (i <= 20) {
    problemType = "帳簿記入";
  } else if (i <= 30) {
    problemType = "伝票記入";
  } else {
    problemType = "理論・選択";
  }

  console.log(`  タイプ: ${problemType}`);
  console.log(`  テンプレートタイプ: ${template?.type || "不明"}`);

  // 問題を分析
  const issueList = [];

  // 伝票問題の場合
  if (i >= 21 && i <= 30) {
    // 問題文から取引数を確認
    const transactions = questionText.match(/\d+月[\s　]*\d+日[：:]/g) || [];
    console.log(`  取引数: ${transactions.length}`);

    // 正答の伝票数を確認
    const voucherCount = answer?.vouchers ? answer.vouchers.length : 0;
    console.log(`  正答の伝票数: ${voucherCount}`);

    if (transactions.length > 0 && voucherCount === 1) {
      issueList.push("正答が不完全（伝票が1枚のみ）");
    }

    // 解答テンプレートが単一伝票のみか確認
    if (template?.vouchers && template.vouchers.length === 1) {
      issueList.push("テンプレートが単一伝票のみ");
    }
  }

  // 解説の具体性を確認
  if (explanation.includes("帳簿記入問題") && !explanation.includes("具体的")) {
    issueList.push("解説が一般的すぎる");
  }

  if (issueList.length > 0) {
    console.log(`  ⚠️ 問題点:`);
    issueList.forEach((issue) => {
      console.log(`    - ${issue}`);
    });
    issues.push({ id, issues: issueList });
  } else {
    console.log(`  ✅ 問題なし`);
  }
}

// サマリー
console.log("\n" + "=" * 60);
console.log("📊 分析結果サマリー");
console.log("=" * 60);
console.log(`問題のある問題数: ${issues.length}問`);

if (issues.length > 0) {
  console.log("\n🔧 修正が必要な問題:");
  issues.forEach(({ id, issues }) => {
    console.log(`  ${id}:`);
    issues.forEach((issue) => {
      console.log(`    - ${issue}`);
    });
  });
}

// 詳細レポートを保存
const report = {
  timestamp: new Date().toISOString(),
  totalProblems: 20,
  issuesFound: issues.length,
  details: issues,
};

fs.writeFileSync(
  path.join(__dirname, "q-l-021-040-analysis.json"),
  JSON.stringify(report, null, 2),
);

console.log("\n📝 詳細レポート保存: q-l-021-040-analysis.json");
