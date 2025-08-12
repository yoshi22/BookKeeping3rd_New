const fs = require("fs");
const path = require("path");

console.log("🔧 修正済み第二問抽出・分析スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 修正された抽出関数 - 複数行JSON対応
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の抽出 ---`);

  // IDから問題オブジェクトを抽出
  const idPattern = new RegExp(`id:\\s*["']${questionId}["']`);
  const idMatch = content.search(idPattern);

  if (idMatch === -1) {
    console.log(`❌ ${questionId}: IDが見つかりません`);
    return null;
  }

  // オブジェクトの開始位置を見つける
  let objectStart = idMatch;
  while (objectStart > 0 && content[objectStart] !== "{") {
    objectStart--;
  }

  // オブジェクトの終了位置を見つける（より堅牢な方法）
  let braceCount = 0;
  let objectEnd = objectStart;
  let inString = false;
  let stringChar = null;
  let escapeNext = false;

  for (let i = objectStart; i < content.length; i++) {
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
          objectEnd = i + 1;
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

  const questionObject = content.substring(objectStart, objectEnd);
  console.log(`📋 問題オブジェクト抽出: ${questionObject.length}文字`);

  // 改善されたフィールド抽出関数 - 複数行文字列対応
  const extractField = (fieldName) => {
    // パターン1: fieldName: "value", - 単行
    let pattern = new RegExp(`${fieldName}:\\s*["']([^"']*?)["']\\s*[,}]`);
    let match = questionObject.match(pattern);

    if (match) {
      console.log(`✅ ${fieldName}: ${match[1].length}文字 (単行)`);
      return match[1];
    }

    // パターン2: fieldName:\n      'long multi-line value', - 複数行
    pattern = new RegExp(
      `${fieldName}:\\s*\\n\\s*['"]([\\s\\S]*?)['"]\\s*[,}]`,
    );
    match = questionObject.match(pattern);

    if (match) {
      console.log(`✅ ${fieldName}: ${match[1].length}文字 (複数行)`);

      // JSONフィールドのvalidation
      if (fieldName.includes("json")) {
        try {
          JSON.parse(match[1]);
          console.log(`  📊 JSON有効`);
        } catch (e) {
          console.log(`  ❌ JSONエラー: ${e.message.substring(0, 50)}...`);
        }
      }
      return match[1];
    }

    // パターン3: より柔軟なパターン
    pattern = new RegExp(
      `${fieldName}:\\s*(['"]([\\s\\S]*?)['"])\\s*[,}]`,
      "m",
    );
    match = questionObject.match(pattern);

    if (match) {
      console.log(`✅ ${fieldName}: ${match[2].length}文字 (柔軟)`);
      return match[2];
    }

    console.log(`❌ ${fieldName}: 見つかりません`);
    return null;
  };

  // 数値フィールド
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

// 分析関数 - user要求に基づく3つのチェックポイント
function analyzeQuestion(questionData, patternName, subPatternName) {
  const issues = [];

  if (!questionData) {
    return ["問題データが見つかりません"];
  }

  const questionId = questionData.id;
  console.log(`\n🔍 ${questionId}の分析 (${subPatternName})`);

  // 1. 問題を解くのに十分な情報があるかチェック
  const questionText = questionData.question_text || "";

  // 不完全な問題文パターン
  const insufficientPatterns = [
    "詳細は問題文参照",
    "詳細な内容は別途",
    "具体的な取引は",
    "問題文を参照",
    "別紙参照",
  ];

  for (const pattern of insufficientPatterns) {
    if (questionText.includes(pattern)) {
      issues.push(`❌ 問題文に不完全な参照: "${pattern}"`);
    }
  }

  if (questionText.length < 100) {
    issues.push("❌ 問題文が短すぎる（100文字未満）");
  }

  // 取引内容の具体性チェック
  if (
    !questionText.includes("円") &&
    !questionText.includes("月") &&
    !questionText.includes("日")
  ) {
    issues.push("❌ 問題文に具体的な数値や日付が不足");
  }

  // 2. 解答が問題に対応しているかチェック
  const correctAnswerJson = questionData.correct_answer_json || "";
  let parsedAnswer = null;

  try {
    parsedAnswer = JSON.parse(correctAnswerJson);
    console.log("  ✅ JSON解析成功");
  } catch (e) {
    issues.push(`❌ JSON構文エラー: ${e.message}`);
    return issues; // JSON が壊れている場合は他のチェックをスキップ
  }

  if (parsedAnswer) {
    // テンプレート・サンプルデータの検出
    const jsonStr = JSON.stringify(parsedAnswer).toLowerCase();
    const templatePatterns = [
      "template",
      "sample",
      "example",
      "placeholder",
      "ledgerentry",
    ];

    for (const pattern of templatePatterns) {
      if (jsonStr.includes(pattern)) {
        issues.push(`❌ 解答にテンプレートデータ残存: "${pattern}"`);
      }
    }

    // パターン別の解答内容チェック
    if (
      patternName.includes("勘定記入") ||
      patternName.includes("補助簿記入")
    ) {
      if (!parsedAnswer.entries || !Array.isArray(parsedAnswer.entries)) {
        issues.push("❌ 帳簿記入問題で entries フィールドが不正");
      } else if (parsedAnswer.entries.length === 0) {
        issues.push("❌ 帳簿エントリが空");
      } else {
        // エントリの内容チェック
        let validEntries = 0;
        for (let i = 0; i < parsedAnswer.entries.length; i++) {
          const entry = parsedAnswer.entries[i];
          if (
            entry.date &&
            entry.description &&
            (typeof entry.debit === "number" ||
              typeof entry.credit === "number")
          ) {
            validEntries++;
          }
        }
        if (validEntries === 0) {
          issues.push("❌ 有効な帳簿エントリが存在しない");
        } else {
          console.log(`  ✅ ${validEntries}個の有効エントリを確認`);
        }
      }
    }
  }

  // 3. 回答フォームが適切な形態になっているかチェック
  const answerTemplateJson = questionData.answer_template_json || "";

  try {
    const template = JSON.parse(answerTemplateJson);
    console.log("  ✅ 回答テンプレート解析成功");

    // パターン別のフォームチェック
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
        issues.push(
          `❌ 回答フォーム不適切: ${template.type} (期待: multiple_choice/single_choice)`,
        );
      }
    }
  } catch (e) {
    issues.push(`❌ 回答テンプレートJSONエラー: ${e.message}`);
  }

  if (issues.length === 0) {
    console.log("  🎯 問題なし - 全チェック項目をクリア");
  } else {
    console.log(`  ⚠️  ${issues.length}個の問題を検出`);
  }

  return issues;
}

// problemsStrategy.md に基づく分類での分析
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

// メイン処理
console.log("📖 master-questions.ts読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 最初にテスト実行
console.log("\n🧪 抽出ロジックテスト実行");
console.log("=".repeat(40));

const testQuestions = ["Q_L_001", "Q_L_015", "Q_L_016"];

for (const qId of testQuestions) {
  const testData = extractQuestionData(questionsContent, qId);
  if (
    testData &&
    testData.correct_answer_json &&
    testData.correct_answer_json.length > 100
  ) {
    console.log(
      `✅ ${qId}: 抽出成功 (正答JSON: ${testData.correct_answer_json.length}文字)`,
    );
  } else {
    console.log(`❌ ${qId}: 抽出失敗`);
    return; // テスト失敗時は処理を停止
  }
}

console.log("\n🎯 抽出ロジック検証完了！全問題分析を開始します...\n");

// 全問題分析
let analysisResults = {
  totalProblems: 0,
  validProblems: 0,
  problemsNeedingFix: [],
  patternSummary: {},
};

console.log("🔍 第二問全問題分析開始");
console.log("=".repeat(50));

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
      const issues = analyzeQuestion(questionData, patternName, subPatternName);

      analysisResults.totalProblems++;
      patternTotal++;

      if (issues.length === 0) {
        analysisResults.validProblems++;
        patternValid++;
        console.log(`✅ ${questionId}: 適切`);
      } else {
        console.log(`❌ ${questionId}: 修正要`);
        issues.forEach((issue) => console.log(`    ${issue}`));

        analysisResults.problemsNeedingFix.push({
          id: questionId,
          pattern: patternName,
          subPattern: subPatternName,
          issues: issues,
        });
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
console.log(
  `📈 適切率: ${Math.round((analysisResults.validProblems / analysisResults.totalProblems) * 100)}%`,
);

// 修正が必要な問題の詳細
if (analysisResults.problemsNeedingFix.length > 0) {
  console.log("\n🔧 修正が必要な問題一覧:");
  console.log("=".repeat(30));

  for (const [patternName, problemList] of Object.entries(
    analysisResults.problemsNeedingFix.reduce((acc, problem) => {
      if (!acc[problem.pattern]) acc[problem.pattern] = [];
      acc[problem.pattern].push(problem);
      return acc;
    }, {}),
  )) {
    console.log(`\n📌 ${patternName}:`);
    problemList.forEach((problem) => {
      console.log(`  • ${problem.id} (${problem.subPattern})`);
      problem.issues.forEach((issue) => console.log(`    ${issue}`));
    });
  }

  console.log("\n📝 次のステップ: 修正スクリプトの作成");
} else {
  console.log("\n🎉 全ての第二問問題が適切に構成されています！");
}

// 結果保存
const reportPath = path.join(__dirname, "fixed-analysis-report.json");
fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
console.log(`\n💾 詳細分析結果保存: ${path.basename(reportPath)}`);
