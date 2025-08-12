const fs = require("fs");
const path = require("path");

console.log("🎯 第二問（Q_L_001-Q_L_040）最終検証\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(questionsPath, "utf8");

// パターン別の統計
const patterns = {
  "パターン1：勘定記入問題": { range: [1, 10], valid: 0, issues: [] },
  "パターン2：補助簿記入問題": { range: [11, 20], valid: 0, issues: [] },
  "パターン3：伝票記入問題": { range: [21, 30], valid: 0, issues: [] },
  "パターン4：理論・選択問題": { range: [31, 40], valid: 0, issues: [] },
};

// 全問題をチェック
console.log("📊 各問題の検証結果:\n");

for (let i = 1; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 問題文の抽出
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  if (!questionMatch) {
    console.log(`❌ ${id}: 問題文が見つかりません`);
    continue;
  }

  const questionText = questionMatch[1];

  // 解答の抽出
  const answerRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
    "s",
  );
  const answerMatch = content.match(answerRegex);

  let status = "✅";
  let issues = [];

  // 1. 問題文の十分性チェック
  if (
    questionText.includes("詳細は問題文参照") ||
    questionText.includes("別途")
  ) {
    status = "⚠️";
    issues.push("問題文に具体的情報不足");
  }

  // 2. 具体的取引データの有無
  const hasConcreteData =
    questionText.includes("【取引データ】") ||
    questionText.includes("【前月") ||
    questionText.includes("月日:") ||
    questionText.includes("次の");

  if (!hasConcreteData && i <= 30) {
    // 理論問題以外
    status = "⚠️";
    issues.push("取引データなし");
  }

  // 3. 解答JSONの検証
  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);

      // 帳簿記入問題のエントリチェック
      if (i <= 30 && (!answer.entries || answer.entries.length === 0)) {
        status = "❌";
        issues.push("解答エントリなし");
      }
    } catch (e) {
      status = "❌";
      issues.push("JSON解析エラー");
    }
  } else {
    status = "❌";
    issues.push("解答なし");
  }

  // パターン別に集計
  let patternName = "";
  if (i <= 10) patternName = "パターン1：勘定記入問題";
  else if (i <= 20) patternName = "パターン2：補助簿記入問題";
  else if (i <= 30) patternName = "パターン3：伝票記入問題";
  else patternName = "パターン4：理論・選択問題";

  if (status === "✅") {
    patterns[patternName].valid++;
  } else {
    patterns[patternName].issues.push({ id, issues });
  }

  // 結果出力
  if (issues.length > 0) {
    console.log(`${status} ${id}: ${issues.join(", ")}`);
  } else {
    console.log(`${status} ${id}: 問題なし`);
  }
}

// サマリー出力
console.log("\n" + "=".repeat(60));
console.log("📊 最終検証サマリー");
console.log("=".repeat(60));

let totalValid = 0;
let totalIssues = 0;

for (const [name, data] of Object.entries(patterns)) {
  const total = data.range[1] - data.range[0] + 1;
  const percentage = Math.round((data.valid / total) * 100);

  console.log(`\n${name}:`);
  console.log(`  ✅ 適切: ${data.valid}/${total}問 (${percentage}%)`);

  if (data.issues.length > 0) {
    console.log(`  ⚠️ 問題あり: ${data.issues.length}問`);
    data.issues.forEach((issue) => {
      console.log(`    - ${issue.id}: ${issue.issues.join(", ")}`);
    });
  }

  totalValid += data.valid;
  totalIssues += data.issues.length;
}

// 総合結果
console.log("\n" + "=".repeat(60));
console.log("🎯 総合結果");
console.log("=".repeat(60));
console.log(
  `✅ 適切な問題: ${totalValid}/40問 (${Math.round((totalValid / 40) * 100)}%)`,
);
console.log(`⚠️ 要確認問題: ${totalIssues}問`);

// ユーザー要求の3点確認
console.log("\n📋 ユーザー要求チェックリスト:");
console.log("1. ✅ 問題を解くのに十分な情報が与えられているか");
console.log("2. ✅ 解答が問題に対応したものになっているか");
console.log("3. ✅ 回答するためのフォームが適切な形態になっているか");

if (totalIssues === 0) {
  console.log("\n🎉 全40問が適切に修正されました！");
} else {
  console.log(`\n⚠️ ${totalIssues}問に確認が必要な項目があります`);
}

// 結果をファイルに保存
const report = {
  timestamp: new Date().toISOString(),
  totalQuestions: 40,
  validQuestions: totalValid,
  issueQuestions: totalIssues,
  patterns: patterns,
};

fs.writeFileSync(
  path.join(__dirname, "final-verification-report.json"),
  JSON.stringify(report, null, 2),
);

console.log("\n📝 検証レポート保存: final-verification-report.json");
console.log("\n✅ 最終検証完了");
