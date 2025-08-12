const fs = require("fs");
const path = require("path");

console.log("🔧 堅牢な第二問抽出・分析スクリプト（TypeScript構造対応）\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

/**
 * TypeScript object property extraction for multi-line strings
 * Handles format: fieldName:\n  "content" or 'content',
 */
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の抽出 ---`);

  // Find the object containing this question ID
  const idRegex = new RegExp(`id:\\s*"${questionId}"`);
  const idMatch = content.search(idRegex);

  if (idMatch === -1) {
    console.log(`❌ ${questionId}: IDが見つかりません`);
    return null;
  }

  // Find object start (previous {)
  let objStart = idMatch;
  while (objStart > 0 && content[objStart] !== "{") {
    objStart--;
  }

  // Find object end using proper brace counting
  let braceCount = 0;
  let objEnd = objStart;
  let inString = false;
  let stringChar = null;
  let escapeNext = false;

  for (let i = objStart; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (!inString) {
      if (char === '"' || char === "'" || char === "`") {
        inString = true;
        stringChar = char;
      } else if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          objEnd = i + 1;
          break;
        }
      }
    } else {
      if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }
  }

  const questionObject = content.substring(objStart, objEnd);
  console.log(`📋 問題オブジェクト抽出: ${questionObject.length}文字`);

  /**
   * Extract field value handling TypeScript multi-line format
   * Patterns:
   * 1. fieldName: "single line value",
   * 2. fieldName:\n      "multi-line\nvalue",
   */
  const extractField = (fieldName) => {
    // Pattern 1: Same line - fieldName: "value",
    let pattern = new RegExp(
      `${fieldName}:\\s*(['"]\[\\s\\S]*?['"]),?\\s*(?=\\w+:|$|\\})`,
      "m",
    );
    let match = questionObject.match(pattern);

    if (match) {
      // Remove outer quotes
      const value = match[1].slice(1, -1);
      console.log(`✅ ${fieldName}: ${value.length}文字 (同一行)`);
      return value;
    }

    // Pattern 2: Multi-line - fieldName:\n  "value",
    pattern = new RegExp(
      `${fieldName}:\\s*\\n\\s*(['"]\[\\s\\S]*?['"]),?\\s*(?=\\w+:|\\}|$)`,
      "m",
    );
    match = questionObject.match(pattern);

    if (match) {
      const value = match[1].slice(1, -1);
      console.log(`✅ ${fieldName}: ${value.length}文字 (複数行)`);

      // JSON validation for JSON fields
      if (fieldName.includes("json")) {
        try {
          JSON.parse(value);
          console.log(`  📊 JSON解析: 成功`);
        } catch (e) {
          console.log(`  ❌ JSON解析エラー: ${e.message.substring(0, 50)}...`);
        }
      }

      return value;
    }

    console.log(`❌ ${fieldName}: フィールドが見つかりません`);
    return null;
  };

  // Extract numeric fields
  const extractNumber = (fieldName) => {
    const pattern = new RegExp(`${fieldName}:\\s*(\\d+)`);
    const match = questionObject.match(pattern);
    if (match) {
      console.log(`✅ ${fieldName}: ${match[1]}`);
      return parseInt(match[1]);
    }
    return null;
  };

  return {
    id: questionId,
    category_id: extractField("category_id"),
    question_text: extractField("question_text"),
    answer_type: extractField("answer_type"),
    answer_template_json: extractField("answer_template_json"),
    correct_answer_json: extractField("correct_answer_json"),
    difficulty: extractNumber("difficulty"),
    tags_json: extractField("tags_json"),
    explanation: extractField("explanation"),
  };
}

/**
 * 問題分析関数 - ユーザー要求の3つのチェックポイント
 */
function analyzeQuestionIssues(questionData, patternName, subPatternName) {
  const issues = [];

  if (!questionData) {
    return ["問題データが抽出できません"];
  }

  const questionId = questionData.id;
  console.log(`\n🔍 ${questionId}の内容分析 (${subPatternName})`);

  // 1. 問題を解くのに十分な情報があるかチェック
  const questionText = questionData.question_text || "";

  // 不完全な問題文の検出
  const insufficientPatterns = [
    "詳細は問題文参照",
    "詳細な内容は別途",
    "具体的な取引は",
    "問題文を参照",
    "別紙参照",
    "別途資料",
  ];

  for (const pattern of insufficientPatterns) {
    if (questionText.includes(pattern)) {
      issues.push(`❌ 不十分な問題文: "${pattern}" を含む`);
    }
  }

  // 問題文の長さと具体性チェック
  if (questionText.length < 50) {
    issues.push("❌ 問題文が短すぎる（50文字未満）");
  }

  // 具体的な取引情報の有無
  const hasSpecificInfo =
    questionText.includes("円") ||
    questionText.includes("月") ||
    questionText.includes("日") ||
    questionText.includes("年");

  if (!hasSpecificInfo) {
    issues.push("⚠️ 具体的な数値・日付情報が不足");
  }

  // 2. 解答が問題に対応しているかチェック
  const correctAnswerJson = questionData.correct_answer_json || "";
  let parsedAnswer = null;

  try {
    parsedAnswer = JSON.parse(correctAnswerJson);
    console.log("  ✅ JSON解析成功");
  } catch (e) {
    issues.push(`❌ JSON構文エラー: ${e.message}`);
    return issues; // JSON壊れている場合は他のチェックをスキップ
  }

  // 解答内容の妥当性チェック
  if (parsedAnswer) {
    const jsonStr = JSON.stringify(parsedAnswer).toLowerCase();

    // テンプレートデータ残存チェック
    const templatePatterns = [
      "template",
      "sample",
      "example",
      "placeholder",
      "ledgerentry",
      "2025-08-11", // 今日の日付
    ];

    for (const template of templatePatterns) {
      if (jsonStr.includes(template)) {
        issues.push(`❌ テンプレートデータ残存: "${template}"`);
      }
    }

    // 問題と解答の整合性チェック（パターン特有）
    if (questionText.includes("仕入帳") && jsonStr.includes("定期預金")) {
      issues.push("❌ 重大な不整合: 仕入帳問題に定期預金解答");
    }

    if (questionText.includes("売上帳") && jsonStr.includes("売掛金元帳")) {
      issues.push("❌ 重大な不整合: 売上帳問題に売掛金元帳解答");
    }

    // 帳簿記入問題のエントリ構造チェック
    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (!parsedAnswer.entries || !Array.isArray(parsedAnswer.entries)) {
        issues.push("❌ 帳簿記入形式でentriesが不正");
      } else if (parsedAnswer.entries.length === 0) {
        issues.push("❌ 帳簿エントリが空");
      } else {
        // エントリの必須フィールドチェック
        let validEntryCount = 0;
        for (let i = 0; i < parsedAnswer.entries.length; i++) {
          const entry = parsedAnswer.entries[i];
          if (entry.date && entry.description) {
            validEntryCount++;
          }
        }
        if (validEntryCount === 0) {
          issues.push("❌ 有効なエントリが存在しない");
        } else {
          console.log(`  ✅ ${validEntryCount}個の有効エントリを確認`);
        }
      }
    }
  }

  // 3. 回答フォームが適切な形態になっているかチェック
  const answerTemplateJson = questionData.answer_template_json || "";

  try {
    const template = JSON.parse(answerTemplateJson);
    console.log("  ✅ 回答テンプレート解析成功");

    // パターン別のフォーム形式チェック
    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (template.type !== "ledger_entry") {
        issues.push(
          `❌ 回答フォーム不適切: ${template.type} (期待: ledger_entry)`,
        );
      }
    } else if (patternName.includes("伝票記入")) {
      if (template.type !== "voucher_entry") {
        issues.push(
          `❌ 回答フォーム不適切: ${template.type} (期待: voucher_entry)`,
        );
      }
    } else if (patternName.includes("理論・選択")) {
      if (!["multiple_choice", "single_choice"].includes(template.type)) {
        issues.push(`❌ 回答フォーム不適切: ${template.type} (期待: choice系)`);
      }
    }
  } catch (e) {
    issues.push(`❌ 回答テンプレートJSONエラー: ${e.message}`);
  }

  // 結果の出力
  if (issues.length === 0) {
    console.log("  🎯 問題なし - 全チェック項目をクリア");
  } else {
    console.log(`  ⚠️ ${issues.length}個の問題を検出`);
  }

  return issues;
}

// problemsStrategy.md に基づくパターン分類
const problemPatterns = {
  "パターン1：勘定記入問題": {
    range: "Q_L_001-Q_L_010",
    subPatterns: {
      資産勘定: ["Q_L_001", "Q_L_002", "Q_L_003", "Q_L_004"],
      "負債・純資産勘定": ["Q_L_005", "Q_L_006", "Q_L_007"],
      "収益・費用勘定": ["Q_L_008", "Q_L_009", "Q_L_010"],
    },
  },
  "パターン2：補助簿記入問題": {
    range: "Q_L_011-Q_L_020",
    subPatterns: {
      "現金・預金補助簿": ["Q_L_011", "Q_L_012", "Q_L_013", "Q_L_014"],
      売買補助簿: ["Q_L_015", "Q_L_016", "Q_L_017", "Q_L_018"],
      "債権・債務補助簿": ["Q_L_019", "Q_L_020"],
    },
  },
  "パターン3：伝票記入問題": {
    range: "Q_L_021-Q_L_030",
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
    subPatterns: {
      帳簿組織: ["Q_L_031", "Q_L_032", "Q_L_033", "Q_L_034"],
      簿記理論: ["Q_L_035", "Q_L_036", "Q_L_037"],
      "試算表・決算": ["Q_L_038", "Q_L_039", "Q_L_040"],
    },
  },
};

// メイン処理実行
console.log("📖 master-questions.ts読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 抽出ロジックテスト
console.log("\n🧪 改良された抽出ロジックのテスト");
console.log("=".repeat(40));

const testQuestions = ["Q_L_001", "Q_L_015", "Q_L_016", "Q_L_025", "Q_L_035"];
let testResults = { success: 0, failed: 0 };

for (const qId of testQuestions) {
  const testData = extractQuestionData(questionsContent, qId);
  if (
    testData &&
    testData.correct_answer_json &&
    testData.correct_answer_json.length > 50
  ) {
    console.log(
      `✅ ${qId}: 抽出成功 (正答JSON: ${testData.correct_answer_json.length}文字)`,
    );
    testResults.success++;
  } else {
    console.log(`❌ ${qId}: 抽出失敗`);
    testResults.failed++;
  }
}

console.log(
  `\n📊 テスト結果: ${testResults.success}/${testQuestions.length}問成功`,
);

if (testResults.success < testQuestions.length) {
  console.log("⚠️ 抽出ロジックにまだ問題があります。処理を中止します。");
  process.exit(1);
}

// 全問題の包括分析
console.log("\n\n🔍 第二問全40問の包括分析開始");
console.log("=".repeat(60));

let analysisResults = {
  totalProblems: 0,
  validProblems: 0,
  problemsNeedingFix: [],
  patternSummary: {},
  criticalIssues: 0,
  minorIssues: 0,
};

// パターン別分析実行
for (const [patternName, patternInfo] of Object.entries(problemPatterns)) {
  console.log(`\n📌 ${patternName} (${patternInfo.range})`);
  console.log("=".repeat(patternName.length + 15));

  let patternValid = 0;
  let patternTotal = 0;

  for (const [subPatternName, questionIds] of Object.entries(
    patternInfo.subPatterns,
  )) {
    console.log(`\n🔸 ${subPatternName}`);

    for (const questionId of questionIds) {
      const questionData = extractQuestionData(questionsContent, questionId);
      const issues = analyzeQuestionIssues(
        questionData,
        patternName,
        subPatternName,
      );

      analysisResults.totalProblems++;
      patternTotal++;

      if (issues.length === 0) {
        analysisResults.validProblems++;
        patternValid++;
        console.log(`✅ ${questionId}: 適切`);
      } else {
        console.log(`❌ ${questionId}: ${issues.length}個の問題`);
        issues.forEach((issue) => console.log(`    ${issue}`));

        analysisResults.problemsNeedingFix.push({
          id: questionId,
          pattern: patternName,
          subPattern: subPatternName,
          issues: issues,
        });

        // 重要度判定
        const hasCriticalIssue = issues.some(
          (issue) =>
            issue.includes("重大な不整合") ||
            issue.includes("JSON構文エラー") ||
            issue.includes("詳細は問題文参照"),
        );

        if (hasCriticalIssue) {
          analysisResults.criticalIssues++;
        } else {
          analysisResults.minorIssues++;
        }
      }
      console.log("-".repeat(30));
    }
  }

  analysisResults.patternSummary[patternName] = {
    valid: patternValid,
    total: patternTotal,
  };

  console.log(`📊 ${patternName}結果: ${patternValid}/${patternTotal}問が適切`);
}

// 総合結果
console.log("\n" + "=".repeat(60));
console.log("🎯 第二問包括分析結果");
console.log("=".repeat(25));
console.log(`📊 総問題数: ${analysisResults.totalProblems}`);
console.log(`✅ 適切な問題: ${analysisResults.validProblems}`);
console.log(`❌ 修正要問題: ${analysisResults.problemsNeedingFix.length}`);
console.log(`🚨 重要度高: ${analysisResults.criticalIssues}問`);
console.log(`⚠️ 重要度低: ${analysisResults.minorIssues}問`);
console.log(
  `📈 適切率: ${Math.round((analysisResults.validProblems / analysisResults.totalProblems) * 100)}%`,
);

// 修正が必要な問題の詳細
if (analysisResults.problemsNeedingFix.length > 0) {
  console.log("\n🔧 修正が必要な問題詳細:");
  console.log("=".repeat(30));

  // パターン別に整理
  const groupedByPattern = {};
  analysisResults.problemsNeedingFix.forEach((problem) => {
    if (!groupedByPattern[problem.pattern]) {
      groupedByPattern[problem.pattern] = [];
    }
    groupedByPattern[problem.pattern].push(problem);
  });

  for (const [patternName, problems] of Object.entries(groupedByPattern)) {
    console.log(`\n📌 ${patternName}:`);
    problems.forEach((problem) => {
      console.log(`  • ${problem.id} (${problem.subPattern})`);
      problem.issues.forEach((issue) => console.log(`    ${issue}`));
    });
  }
}

// 結果保存
const reportPath = path.join(__dirname, "robust-analysis-report.json");
fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
console.log(`\n💾 詳細分析結果保存: ${path.basename(reportPath)}`);

console.log("\n✅ 堅牢な抽出ロジックによる包括分析完了");

if (analysisResults.problemsNeedingFix.length > 0) {
  console.log("\n📝 次のステップ:");
  console.log("1. 重要度の高い問題から優先的に修正");
  console.log("2. 修正スクリプトの作成・実行");
  console.log("3. 修正後の再検証");
} else {
  console.log("\n🎉 全ての第二問問題が適切に構成されています！");
}
