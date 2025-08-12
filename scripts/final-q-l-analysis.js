const fs = require("fs");
const path = require("path");

console.log("🎯 最終版 第二問分析スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

/**
 * Simple and reliable field extraction from TypeScript object
 */
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} 抽出 ---`);

  // Find the question object by ID
  const idRegex = new RegExp(`id:\\s*"${questionId}"`);
  const idMatch = content.search(idRegex);

  if (idMatch === -1) {
    console.log(`❌ ${questionId}: IDが見つかりません`);
    return null;
  }

  // Find object boundaries
  let objStart = idMatch;
  while (objStart > 0 && content[objStart] !== "{") {
    objStart--;
  }

  // Find object end by counting braces
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
  console.log(`📋 オブジェクト抽出: ${questionObject.length}文字`);

  // Simple field extraction
  const extractField = (fieldName) => {
    // Match fieldName: followed by quoted string
    const regex = new RegExp(
      `${fieldName}:\\s*\\n?\\s*(['"])((?:[^\\1\\\\]|\\\\.)*)\\1`,
      "s",
    );
    const match = questionObject.match(regex);

    if (match) {
      const value = match[2];
      console.log(`✅ ${fieldName}: ${value.length}文字`);

      // JSON validation
      if (fieldName.includes("json") && value) {
        try {
          JSON.parse(value);
          console.log(`  📊 JSON有効`);
        } catch (e) {
          console.log(`  ❌ JSON無効: ${e.message.substring(0, 30)}...`);
        }
      }

      return value;
    }

    console.log(`❌ ${fieldName}: 見つからない`);
    return null;
  };

  const extractNumber = (fieldName) => {
    const regex = new RegExp(`${fieldName}:\\s*(\\d+)`);
    const match = questionObject.match(regex);
    return match ? parseInt(match[1]) : null;
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
 * 問題の分析（ユーザー要求の3つのチェックポイント）
 */
function analyzeQuestion(questionData, patternName, subPatternName) {
  const issues = [];

  if (!questionData) {
    return ["❌ 問題データ抽出失敗"];
  }

  const questionId = questionData.id;
  console.log(`\n🔍 ${questionId} 分析中 (${subPatternName})`);

  // 1. 問題文の十分性チェック
  const questionText = questionData.question_text || "";

  const insufficientPatterns = [
    "詳細は問題文参照",
    "詳細な内容は別途",
    "具体的な取引は",
    "問題文を参照",
    "別紙参照",
  ];

  for (const pattern of insufficientPatterns) {
    if (questionText.includes(pattern)) {
      issues.push(`❌ 不十分な問題文: "${pattern}"`);
    }
  }

  if (questionText.length < 50) {
    issues.push("❌ 問題文が短すぎる");
  }

  // 2. 解答の対応チェック
  const answerJson = questionData.correct_answer_json || "";
  let parsedAnswer = null;

  try {
    parsedAnswer = JSON.parse(answerJson);
    console.log("  ✅ JSON解析成功");
  } catch (e) {
    issues.push(`❌ JSON構文エラー: ${e.message}`);
    return issues;
  }

  if (parsedAnswer) {
    const jsonStr = JSON.stringify(parsedAnswer).toLowerCase();

    // テンプレート残存チェック
    const templatePatterns = [
      "template",
      "sample",
      "example",
      "placeholder",
      "ledgerentry",
      "2025-08-11",
    ];

    for (const template of templatePatterns) {
      if (jsonStr.includes(template)) {
        issues.push(`❌ テンプレートデータ残存: "${template}"`);
      }
    }

    // 問題と解答の整合性（重要）
    if (questionText.includes("仕入帳") && jsonStr.includes("定期預金")) {
      issues.push("🚨 重大不整合: 仕入帳問題に定期預金解答");
    }

    if (questionText.includes("売上帳") && jsonStr.includes("売掛金元帳")) {
      issues.push("🚨 重大不整合: 売上帳問題に売掛金元帳解答");
    }

    // 帳簿記入問題のエントリチェック
    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (!parsedAnswer.entries || !Array.isArray(parsedAnswer.entries)) {
        issues.push("❌ entriesフィールド不正");
      } else if (parsedAnswer.entries.length === 0) {
        issues.push("❌ エントリが空");
      } else {
        let validEntries = 0;
        parsedAnswer.entries.forEach((entry) => {
          if (entry.date && entry.description) validEntries++;
        });
        if (validEntries === 0) {
          issues.push("❌ 有効エントリなし");
        } else {
          console.log(`  ✅ ${validEntries}個の有効エントリ`);
        }
      }
    }
  }

  // 3. 回答フォーム適切性チェック
  const templateJson = questionData.answer_template_json || "";

  try {
    const template = JSON.parse(templateJson);
    console.log("  ✅ テンプレート解析成功");

    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (template.type !== "ledger_entry") {
        issues.push(`❌ フォーム不適切: ${template.type} (期待:ledger_entry)`);
      }
    } else if (patternName.includes("伝票記入")) {
      if (template.type !== "voucher_entry") {
        issues.push(`❌ フォーム不適切: ${template.type} (期待:voucher_entry)`);
      }
    } else if (patternName.includes("理論・選択")) {
      if (!["multiple_choice", "single_choice"].includes(template.type)) {
        issues.push(`❌ フォーム不適切: ${template.type} (期待:choice系)`);
      }
    }
  } catch (e) {
    issues.push(`❌ テンプレートJSONエラー: ${e.message}`);
  }

  if (issues.length === 0) {
    console.log("  🎯 問題なし");
  } else {
    console.log(`  ⚠️ ${issues.length}個の問題`);
  }

  return issues;
}

// problemsStrategy.md パターン分類
const patterns = {
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

// メイン実行
console.log("📖 master-questions.ts読み込み中...");
const content = fs.readFileSync(questionsPath, "utf8");

// まずテスト実行
console.log("\n🧪 抽出テスト");
console.log("=".repeat(30));

const testIds = ["Q_L_001", "Q_L_015", "Q_L_016"];
let testSuccess = 0;

for (const id of testIds) {
  const data = extractQuestionData(content, id);
  if (
    data &&
    data.correct_answer_json &&
    data.correct_answer_json.length > 20
  ) {
    console.log(`✅ ${id}: 抽出成功 (${data.correct_answer_json.length}文字)`);
    testSuccess++;
  } else {
    console.log(`❌ ${id}: 抽出失敗`);
  }
}

if (testSuccess < testIds.length) {
  console.log("⚠️ 抽出失敗のため中断");
  process.exit(1);
}

// 全問題分析実行
console.log("\n\n🔍 全40問包括分析開始");
console.log("=".repeat(50));

let results = {
  total: 0,
  valid: 0,
  issues: [],
  critical: 0,
  minor: 0,
  patterns: {},
};

for (const [patternName, patternInfo] of Object.entries(patterns)) {
  console.log(`\n📌 ${patternName} (${patternInfo.range})`);
  console.log("=".repeat(patternName.length + 10));

  let patternValid = 0;
  let patternTotal = 0;

  for (const [subName, questionIds] of Object.entries(
    patternInfo.subPatterns,
  )) {
    console.log(`\n🔸 ${subName}`);

    for (const qId of questionIds) {
      const questionData = extractQuestionData(content, qId);
      const issues = analyzeQuestion(questionData, patternName, subName);

      results.total++;
      patternTotal++;

      if (issues.length === 0) {
        results.valid++;
        patternValid++;
        console.log(`✅ ${qId}: 適切`);
      } else {
        console.log(`❌ ${qId}: ${issues.length}個問題`);
        issues.forEach((issue) => console.log(`    ${issue}`));

        results.issues.push({
          id: qId,
          pattern: patternName,
          subPattern: subName,
          issues: issues,
        });

        // 重要度判定
        const hasCritical = issues.some(
          (issue) =>
            issue.includes("🚨") ||
            issue.includes("JSON構文エラー") ||
            issue.includes("詳細は問題文参照"),
        );

        if (hasCritical) {
          results.critical++;
        } else {
          results.minor++;
        }
      }
      console.log("-".repeat(25));
    }
  }

  results.patterns[patternName] = {
    valid: patternValid,
    total: patternTotal,
  };

  console.log(`📊 ${patternName}: ${patternValid}/${patternTotal}問適切`);
}

// 総合結果出力
console.log("\n" + "=".repeat(60));
console.log("🎯 第二問包括分析結果");
console.log("=".repeat(25));
console.log(`📊 総問題数: ${results.total}`);
console.log(`✅ 適切: ${results.valid}`);
console.log(`❌ 要修正: ${results.issues.length}`);
console.log(`🚨 重要度高: ${results.critical}問`);
console.log(`⚠️ 重要度低: ${results.minor}問`);
console.log(`📈 適切率: ${Math.round((results.valid / results.total) * 100)}%`);

// 修正要問題詳細
if (results.issues.length > 0) {
  console.log("\n🔧 修正が必要な問題:");
  console.log("=".repeat(25));

  // パターン別整理
  const grouped = {};
  results.issues.forEach((problem) => {
    if (!grouped[problem.pattern]) grouped[problem.pattern] = [];
    grouped[problem.pattern].push(problem);
  });

  for (const [pattern, problems] of Object.entries(grouped)) {
    console.log(`\n📌 ${pattern}:`);
    problems.forEach((problem) => {
      console.log(`  • ${problem.id} (${problem.subPattern})`);
      problem.issues.forEach((issue) => console.log(`    ${issue}`));
    });
  }
}

// 結果保存
const reportPath = path.join(__dirname, "final-analysis-report.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n💾 結果保存: ${path.basename(reportPath)}`);

console.log("\n✅ 包括分析完了");

if (results.issues.length > 0) {
  console.log("\n📝 次のステップ:");
  console.log("1. 重要度高の問題から修正");
  console.log("2. 修正スクリプト作成・実行");
  console.log("3. 再検証");
} else {
  console.log("\n🎉 全問題が適切です！");
}
