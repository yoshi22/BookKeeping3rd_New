const fs = require("fs");
const path = require("path");

console.log("🔍 第二問全問題（Q_L_001-Q_L_040）包括分析スクリプト\n");
console.log("📋 分析項目:");
console.log("1. 問題を解くのに十分な情報があるか");
console.log("2. 解答が問題に対応しているか");
console.log("3. 回答フォームが適切な形態になっているか");
console.log("\n" + "=".repeat(60) + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// problemsStrategy.mdに基づく問題分類
const problemPatterns = {
  "パターン1：勘定記入問題": {
    range: "Q_L_001-Q_L_010",
    questions: [
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
    ],
    subPatterns: {
      資産勘定: ["Q_L_001", "Q_L_002", "Q_L_003", "Q_L_004"],
      "負債・純資産勘定": ["Q_L_005", "Q_L_006", "Q_L_007"],
      "収益・費用勘定": ["Q_L_008", "Q_L_009", "Q_L_010"],
    },
  },
  "パターン2：補助簿記入問題": {
    range: "Q_L_011-Q_L_020",
    questions: [
      "Q_L_011",
      "Q_L_012",
      "Q_L_013",
      "Q_L_014",
      "Q_L_015",
      "Q_L_016",
      "Q_L_017",
      "Q_L_018",
      "Q_L_019",
      "Q_L_020",
    ],
    subPatterns: {
      "現金・預金補助簿": ["Q_L_011", "Q_L_012", "Q_L_013", "Q_L_014"],
      売買補助簿: ["Q_L_015", "Q_L_016", "Q_L_017", "Q_L_018"],
      "債権・債務補助簿": ["Q_L_019", "Q_L_020"],
    },
  },
  "パターン3：伝票記入問題": {
    range: "Q_L_021-Q_L_030",
    questions: [
      "Q_L_021",
      "Q_L_022",
      "Q_L_023",
      "Q_L_024",
      "Q_L_025",
      "Q_L_026",
      "Q_L_027",
      "Q_L_028",
      "Q_L_029",
      "Q_L_030",
    ],
    subPatterns: {
      "3伝票制": [
        "Q_L_021",
        "Q_L_022",
        "Q_L_023",
        "Q_L_024",
        "Q_L_025",
        "Q_L_026",
      ],
      "5伝票制": ["Q_L_027", "Q_L_028", "Q_L_029", "Q_L_030"],
    },
  },
  "パターン4：理論・選択問題": {
    range: "Q_L_031-Q_L_040",
    questions: [
      "Q_L_031",
      "Q_L_032",
      "Q_L_033",
      "Q_L_034",
      "Q_L_035",
      "Q_L_036",
      "Q_L_037",
      "Q_L_038",
      "Q_L_039",
      "Q_L_040",
    ],
    subPatterns: {
      帳簿組織: ["Q_L_031", "Q_L_032", "Q_L_033", "Q_L_034"],
      簿記理論: ["Q_L_035", "Q_L_036", "Q_L_037"],
      "試算表・決算": ["Q_L_038", "Q_L_039", "Q_L_040"],
    },
  },
};

// 問題データの読み込み
console.log("📖 master-questions.tsファイルを読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 問題抽出関数
function extractQuestionData(content, questionId) {
  const questionPattern = new RegExp(
    `{[\\s\\S]*?id:\\s*"${questionId}"[\\s\\S]*?}(?=,\\s*{|\\s*\\];)`,
    "g",
  );
  const match = content.match(questionPattern);

  if (!match) {
    return null;
  }

  const questionData = match[0];

  // 各フィールドを抽出
  const extractField = (fieldName) => {
    const fieldPattern = new RegExp(`${fieldName}:\\s*["'](.*?)["']`, "s");
    const fieldMatch = questionData.match(fieldPattern);
    return fieldMatch ? fieldMatch[1] : null;
  };

  return {
    id: questionId,
    title: extractField("title"),
    question_text: extractField("question_text"),
    answer_type: extractField("answer_type"),
    correct_answer_json: extractField("correct_answer_json"),
    difficulty: extractField("difficulty"),
    tags: extractField("tags"),
    rawData: questionData,
  };
}

// 分析結果保存用
let analysisResults = {
  totalProblems: 0,
  problemsNeedingFix: [],
  analysisDetails: {},
};

console.log("🔍 パターン別分析開始\n");

// 各パターンの分析
for (const [patternName, patternInfo] of Object.entries(problemPatterns)) {
  console.log(`📌 ${patternName} (${patternInfo.range})`);
  console.log(
    "=" + "=".repeat(patternName.length + patternInfo.range.length + 4),
  );

  analysisResults.analysisDetails[patternName] = {
    subPatternResults: {},
    problemsChecked: 0,
    problemsWithIssues: 0,
  };

  // サブパターンごとの分析
  for (const [subPatternName, questionIds] of Object.entries(
    patternInfo.subPatterns,
  )) {
    console.log(`\n🔸 ${subPatternName}`);

    let subPatternIssues = [];

    for (const questionId of questionIds) {
      console.log(`\n  📋 ${questionId}の分析中...`);

      const questionData = extractQuestionData(questionsContent, questionId);
      analysisResults.totalProblems++;

      if (!questionData) {
        console.log(`  ❌ ${questionId}: 問題データが見つかりません`);
        subPatternIssues.push({
          id: questionId,
          issues: ["問題データ未発見"],
        });
        continue;
      }

      let issues = [];

      // 1. 十分な情報があるかチェック
      const questionText = questionData.question_text || "";
      if (
        questionText.includes("詳細は問題文参照") ||
        questionText.includes("詳細な内容は別途") ||
        questionText.includes("具体的な取引は") ||
        questionText.length < 50
      ) {
        issues.push("問題文に十分な情報が含まれていない");
      }

      // 2. 解答が問題に対応しているかチェック
      const answerJson = questionData.correct_answer_json || "";

      // JSON構文チェック
      let parsedAnswer = null;
      try {
        parsedAnswer = JSON.parse(answerJson);
      } catch (e) {
        issues.push(`JSONパースエラー: ${e.message}`);
      }

      // 解答内容の妥当性チェック
      if (parsedAnswer) {
        // templateやサンプルデータっぽい内容をチェック
        const jsonString = JSON.stringify(parsedAnswer).toLowerCase();
        if (
          jsonString.includes("ledgerentry") ||
          jsonString.includes("template") ||
          jsonString.includes("sample") ||
          jsonString.includes("2025-08-11") ||
          jsonString.includes("example")
        ) {
          issues.push("解答データにテンプレートや汎用データが残存");
        }

        // 帳簿記入問題の形式チェック
        if (
          patternName.includes("勘定記入") ||
          patternName.includes("補助簿記入")
        ) {
          if (!parsedAnswer.entries || !Array.isArray(parsedAnswer.entries)) {
            issues.push("帳簿記入形式の解答にentriesフィールドが不正");
          } else if (parsedAnswer.entries.length === 0) {
            issues.push("帳簿記入のエントリが空");
          } else {
            // エントリの内容チェック
            for (let i = 0; i < parsedAnswer.entries.length; i++) {
              const entry = parsedAnswer.entries[i];
              if (!entry.date || !entry.description) {
                issues.push(
                  `エントリ${i + 1}に必須フィールド（date/description）が不足`,
                );
                break;
              }
            }
          }
        }
      }

      // 3. 回答フォームが適切かチェック
      const answerType = questionData.answer_type || "";
      if (
        patternName.includes("勘定記入") ||
        patternName.includes("補助簿記入")
      ) {
        if (answerType !== "ledger_entry") {
          issues.push(`回答形式が不適切: ${answerType} (期待値: ledger_entry)`);
        }
      } else if (patternName.includes("伝票記入")) {
        if (answerType !== "voucher_entry") {
          issues.push(
            `回答形式が不適切: ${answerType} (期待値: voucher_entry)`,
          );
        }
      } else if (patternName.includes("理論・選択")) {
        if (
          answerType !== "multiple_choice" &&
          answerType !== "single_choice"
        ) {
          issues.push(
            `回答形式が不適切: ${answerType} (期待値: multiple_choice/single_choice)`,
          );
        }
      }

      // 結果出力
      if (issues.length > 0) {
        console.log(`  ❌ ${questionId}: ${issues.length}個の問題を発見`);
        issues.forEach((issue) => console.log(`    - ${issue}`));

        subPatternIssues.push({
          id: questionId,
          issues: issues,
        });

        analysisResults.problemsNeedingFix.push({
          id: questionId,
          pattern: patternName,
          subPattern: subPatternName,
          issues: issues,
        });

        analysisResults.analysisDetails[patternName].problemsWithIssues++;
      } else {
        console.log(`  ✅ ${questionId}: 問題なし`);
      }

      analysisResults.analysisDetails[patternName].problemsChecked++;
    }

    // サブパターンまとめ
    analysisResults.analysisDetails[patternName].subPatternResults[
      subPatternName
    ] = {
      totalQuestions: questionIds.length,
      questionsWithIssues: subPatternIssues.length,
      issues: subPatternIssues,
    };

    console.log(
      `\n  📊 ${subPatternName}結果: ${subPatternIssues.length}/${questionIds.length}問に問題あり`,
    );
  }

  console.log(`\n📊 ${patternName}全体結果:`);
  console.log(
    `  - チェック済み問題数: ${analysisResults.analysisDetails[patternName].problemsChecked}`,
  );
  console.log(
    `  - 問題あり: ${analysisResults.analysisDetails[patternName].problemsWithIssues}`,
  );
  console.log(
    `  - 問題なし: ${analysisResults.analysisDetails[patternName].problemsChecked - analysisResults.analysisDetails[patternName].problemsWithIssues}`,
  );

  console.log("\n" + "-".repeat(60) + "\n");
}

// 総合結果出力
console.log("🎯 総合分析結果");
console.log("=".repeat(20));
console.log(`📊 総チェック問題数: ${analysisResults.totalProblems}`);
console.log(
  `❌ 修正が必要な問題数: ${analysisResults.problemsNeedingFix.length}`,
);
console.log(
  `✅ 問題なし: ${analysisResults.totalProblems - analysisResults.problemsNeedingFix.length}`,
);

if (analysisResults.problemsNeedingFix.length > 0) {
  console.log("\n🔧 修正が必要な問題一覧:");
  console.log("=" + "=".repeat(25));

  // パターンごとにグループ化して表示
  const groupedByPattern = {};
  analysisResults.problemsNeedingFix.forEach((problem) => {
    if (!groupedByPattern[problem.pattern]) {
      groupedByPattern[problem.pattern] = {};
    }
    if (!groupedByPattern[problem.pattern][problem.subPattern]) {
      groupedByPattern[problem.pattern][problem.subPattern] = [];
    }
    groupedByPattern[problem.pattern][problem.subPattern].push(problem);
  });

  for (const [pattern, subPatterns] of Object.entries(groupedByPattern)) {
    console.log(`\n📌 ${pattern}:`);
    for (const [subPattern, problems] of Object.entries(subPatterns)) {
      console.log(`  🔸 ${subPattern}:`);
      problems.forEach((problem) => {
        console.log(`    - ${problem.id}: ${problem.issues.join(", ")}`);
      });
    }
  }
}

// 分析結果をJSONファイルに保存
const analysisReportPath = path.join(
  __dirname,
  "comprehensive-analysis-report.json",
);
fs.writeFileSync(analysisReportPath, JSON.stringify(analysisResults, null, 2));
console.log(`\n💾 詳細分析結果を保存: ${path.basename(analysisReportPath)}`);

// 修正が必要な問題の優先度レベル設定
console.log("\n📋 修正優先度レベル:");
console.log("=" + "=".repeat(20));

let criticalIssues = analysisResults.problemsNeedingFix.filter((p) =>
  p.issues.some(
    (issue) =>
      issue.includes("詳細は問題文参照") ||
      issue.includes("JSONパースエラー") ||
      issue.includes("テンプレート"),
  ),
);

let minorIssues = analysisResults.problemsNeedingFix.filter(
  (p) => !criticalIssues.includes(p),
);

console.log(`🚨 最優先修正（Critical）: ${criticalIssues.length}問`);
criticalIssues.forEach((p) => console.log(`  - ${p.id}: ${p.issues[0]}`));

console.log(`⚠️  優先修正（Minor）: ${minorIssues.length}問`);
minorIssues.forEach((p) => console.log(`  - ${p.id}: ${p.issues[0]}`));

console.log("\n" + "=".repeat(60));
console.log("✅ 包括分析完了");
console.log("📝 次のステップ: 修正が必要な問題の具体的な修正スクリプトを作成");
