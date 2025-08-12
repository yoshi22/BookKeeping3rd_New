const fs = require("fs");
const path = require("path");

console.log("🔧 修正された第二問抽出・分析スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 堅牢な問題データ抽出関数
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の抽出 ---`);

  // まず問題オブジェクト全体を抽出 - より堅牢なパターン
  const questionStartPattern = new RegExp(
    `\\{[\\s\\S]*?id:\\s*["']${questionId}["']`,
    "g",
  );
  const startMatch = content.match(questionStartPattern);

  if (!startMatch) {
    console.log(`❌ ${questionId}: 問題の開始が見つかりません`);
    return null;
  }

  // 開始位置を見つけて、オブジェクトの終了まで抽出
  const startIndex = content.indexOf(startMatch[0]);
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let stringChar = null;
  let endIndex = startIndex;

  for (let i = startIndex; i < content.length; i++) {
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
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
      } else if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i + 1;
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

  const questionData = content.substring(startIndex, endIndex);
  console.log(`📋 問題データ抽出完了: ${questionData.length}文字`);

  // より安全なフィールド抽出関数
  const extractField = (fieldName) => {
    // TypeScriptオブジェクトプロパティの様々なパターンに対応
    const patterns = [
      // 通常のパターン: fieldName: "content"
      new RegExp(`${fieldName}:\\s*["']([\\s\\S]*?)["'](?=\\s*[,}])`, "m"),
      // バックティック付きパターン: fieldName: \`content\`
      new RegExp(`${fieldName}:\\s*\`([\\s\\S]*?)\`(?=\\s*[,}])`, "m"),
      // 複数行パターンを考慮
      new RegExp(`${fieldName}:\\s*["']([\\s\\S]*?)["']\\s*[,}]`, ""),
    ];

    for (const pattern of patterns) {
      const match = questionData.match(pattern);
      if (match) {
        const extracted = match[1];
        console.log(`✅ ${fieldName}: 抽出成功 (${extracted.length}文字)`);

        // JSONフィールドの場合は解析テスト
        if (fieldName.includes("json")) {
          try {
            JSON.parse(extracted);
            console.log(`  📊 JSON解析: 成功`);
          } catch (e) {
            console.log(`  ❌ JSON解析: エラー - ${e.message}`);
          }
        }

        return extracted;
      }
    }

    console.log(`❌ ${fieldName}: 見つかりません`);
    return null;
  };

  // 数値フィールドの抽出
  const extractNumericField = (fieldName) => {
    const pattern = new RegExp(`${fieldName}:\\s*(\\d+)`, "");
    const match = questionData.match(pattern);
    return match ? parseInt(match[1]) : null;
  };

  return {
    id: questionId,
    category_id: extractField("category_id"),
    question_text: extractField("question_text"),
    answer_type: extractField("answer_type"),
    answer_template_json: extractField("answer_template_json"),
    correct_answer_json: extractField("correct_answer_json"),
    difficulty: extractNumericField("difficulty"),
    tags_json: extractField("tags_json"),
    explanation: extractField("explanation"),
  };
}

// 問題の内容妥当性チェック関数
function analyzeQuestionContent(questionData, patternName, subPatternName) {
  const issues = [];

  if (!questionData) {
    return ["問題データが見つかりません"];
  }

  // 1. 問題文の十分性チェック
  const questionText = questionData.question_text || "";

  // 不完全な問題文のパターン
  const insufficientPatterns = [
    "詳細は問題文参照",
    "詳細な内容は別途",
    "具体的な取引は",
    "問題文を参照",
    "別紙参照",
  ];

  for (const pattern of insufficientPatterns) {
    if (questionText.includes(pattern)) {
      issues.push(`問題文に不完全な参照: "${pattern}"`);
    }
  }

  // 問題文の長さチェック
  if (questionText.length < 100) {
    issues.push("問題文が短すぎる可能性");
  }

  // 2. 解答データの妥当性チェック
  const answerJson = questionData.correct_answer_json || "";
  let parsedAnswer = null;

  try {
    parsedAnswer = JSON.parse(answerJson);
  } catch (e) {
    issues.push(`JSON構文エラー: ${e.message}`);
    return issues; // JSON自体が壊れている場合は他のチェックをスキップ
  }

  // 解答データの内容チェック
  if (parsedAnswer) {
    const jsonString = JSON.stringify(parsedAnswer).toLowerCase();

    // テンプレート・サンプルデータの検出
    const templatePatterns = [
      "ledgerentry",
      "template",
      "sample",
      "example",
      "2025-08-11", // 今日の日付など
      "placeholder",
    ];

    for (const pattern of templatePatterns) {
      if (jsonString.includes(pattern)) {
        issues.push(`解答にテンプレートデータ残存: "${pattern}"`);
      }
    }

    // パターン別の解答形式チェック
    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (!parsedAnswer.entries || !Array.isArray(parsedAnswer.entries)) {
        issues.push("帳簿記入形式でentriesが不正");
      } else if (parsedAnswer.entries.length === 0) {
        issues.push("帳簿記入のエントリが空");
      } else {
        // エントリの必須フィールドチェック
        for (let i = 0; i < parsedAnswer.entries.length; i++) {
          const entry = parsedAnswer.entries[i];
          if (!entry.date || !entry.description) {
            issues.push(`エントリ${i + 1}の必須フィールド不足`);
            break;
          }
          // 金額データの妥当性
          if (
            typeof entry.debit !== "number" ||
            typeof entry.credit !== "number"
          ) {
            issues.push(`エントリ${i + 1}の金額データが数値でない`);
            break;
          }
        }
      }
    }
  }

  // 3. 回答フォーム形式の妥当性チェック
  const answerType = questionData.answer_type || "";

  if (patternName.includes("勘定記入") || patternName.includes("補助簿記入")) {
    if (answerType !== "ledger_entry") {
      issues.push(`回答形式不適切: ${answerType} (期待: ledger_entry)`);
    }
  } else if (patternName.includes("伝票記入")) {
    if (answerType !== "voucher_entry") {
      issues.push(`回答形式不適切: ${answerType} (期待: voucher_entry)`);
    }
  } else if (patternName.includes("理論・選択")) {
    if (!["multiple_choice", "single_choice"].includes(answerType)) {
      issues.push(
        `回答形式不適切: ${answerType} (期待: multiple_choice/single_choice)`,
      );
    }
  }

  return issues;
}

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

// メイン分析実行
console.log("📖 master-questions.ts読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

let analysisResults = {
  totalProblems: 0,
  problemsNeedingFix: [],
  patternResults: {},
  summary: {
    validProblems: 0,
    invalidProblems: 0,
    criticalIssues: 0,
    minorIssues: 0,
  },
};

console.log("\n🔍 第二問全問題の包括分析開始\n");
console.log("=".repeat(60));

// パターン別分析実行
for (const [patternName, patternInfo] of Object.entries(problemPatterns)) {
  console.log(`\n📌 ${patternName} (${patternInfo.range})`);
  console.log("=".repeat(patternName.length + 10));

  analysisResults.patternResults[patternName] = {
    total: 0,
    valid: 0,
    invalid: 0,
    subPatterns: {},
  };

  for (const [subPatternName, questionIds] of Object.entries(
    patternInfo.subPatterns,
  )) {
    console.log(`\n🔸 ${subPatternName}`);

    let subPatternIssues = [];
    let validCount = 0;

    for (const questionId of questionIds) {
      console.log(`\n  📋 ${questionId}...`);

      const questionData = extractQuestionData(questionsContent, questionId);
      analysisResults.totalProblems++;
      analysisResults.patternResults[patternName].total++;

      const issues = analyzeQuestionContent(
        questionData,
        patternName,
        subPatternName,
      );

      if (issues.length === 0) {
        console.log(`  ✅ ${questionId}: 問題なし`);
        validCount++;
        analysisResults.summary.validProblems++;
        analysisResults.patternResults[patternName].valid++;
      } else {
        console.log(`  ❌ ${questionId}: ${issues.length}個の問題発見`);
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

        // 重要度分類
        const hasCriticalIssue = issues.some(
          (issue) =>
            issue.includes("詳細は問題文参照") ||
            issue.includes("JSON構文エラー") ||
            issue.includes("テンプレートデータ"),
        );

        if (hasCriticalIssue) {
          analysisResults.summary.criticalIssues++;
        } else {
          analysisResults.summary.minorIssues++;
        }

        analysisResults.summary.invalidProblems++;
        analysisResults.patternResults[patternName].invalid++;
      }
    }

    analysisResults.patternResults[patternName].subPatterns[subPatternName] = {
      total: questionIds.length,
      valid: validCount,
      invalid: questionIds.length - validCount,
      issues: subPatternIssues,
    };

    console.log(
      `\n  📊 ${subPatternName}: ${validCount}/${questionIds.length}問が適切`,
    );
  }

  console.log(
    `\n📊 ${patternName}まとめ: ${analysisResults.patternResults[patternName].valid}/${analysisResults.patternResults[patternName].total}問が適切`,
  );
}

// 総合結果出力
console.log("\n" + "=".repeat(60));
console.log("🎯 総合分析結果");
console.log("=".repeat(20));
console.log(`📊 総問題数: ${analysisResults.totalProblems}`);
console.log(`✅ 適切な問題: ${analysisResults.summary.validProblems}`);
console.log(`❌ 要修正問題: ${analysisResults.summary.invalidProblems}`);
console.log(`🚨 重要度高: ${analysisResults.summary.criticalIssues}問`);
console.log(`⚠️  重要度低: ${analysisResults.summary.minorIssues}問`);

// 修正が必要な問題の詳細
if (analysisResults.problemsNeedingFix.length > 0) {
  console.log("\n🔧 修正が必要な問題詳細:");
  console.log("=".repeat(30));

  analysisResults.problemsNeedingFix.forEach((problem) => {
    console.log(`\n📋 ${problem.id} (${problem.subPattern})`);
    problem.issues.forEach((issue) => console.log(`  - ${issue}`));
  });
}

// 結果をファイルに保存
const reportPath = path.join(__dirname, "corrected-analysis-report.json");
fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
console.log(`\n💾 詳細分析結果を保存: ${path.basename(reportPath)}`);

console.log("\n✅ 修正された抽出ロジックによる包括分析完了");

// 次のステップガイド
if (analysisResults.summary.invalidProblems > 0) {
  console.log("\n📝 次のステップ:");
  console.log("1. 修正が必要な問題の具体的な修正スクリプトを作成");
  console.log("2. 重要度の高い問題から優先的に修正");
  console.log("3. 修正後の再検証");
} else {
  console.log("\n🎉 全ての第二問問題が適切に構成されています！");
}
