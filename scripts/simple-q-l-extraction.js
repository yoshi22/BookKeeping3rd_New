const fs = require("fs");
const path = require("path");

console.log("🔧 シンプルな第二問抽出・分析スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// TypeScriptオブジェクト配列からの直接的な抽出関数
function extractQuestionData(content, questionId) {
  console.log(`\n--- ${questionId} の抽出 ---`);

  // より直接的なアプローチ：IDから次のオブジェクトの始まりまでを抽出
  const idPattern = new RegExp(`id:\\s*["']${questionId}["']`);
  const idMatch = content.search(idPattern);

  if (idMatch === -1) {
    console.log(`❌ ${questionId}: IDが見つかりません`);
    return null;
  }

  // IDの前の{を見つける
  let objectStart = idMatch;
  while (objectStart > 0 && content[objectStart] !== "{") {
    objectStart--;
  }

  // オブジェクトの終了位置を見つける（より確実な方法）
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

  // 各フィールドの抽出（より確実な方法）
  const extractField = (fieldName) => {
    // 複数のパターンを試す
    const patterns = [
      // 基本パターン: fieldName: "value"
      new RegExp(`${fieldName}:\\s*["']([\\s\\S]*?)["'](?=\\s*[,}])`),
      // バックティック: fieldName: \`value\`
      new RegExp(`${fieldName}:\\s*\`([\\s\\S]*?)\`(?=\\s*[,}])`),
    ];

    for (const pattern of patterns) {
      const match = questionObject.match(pattern);
      if (match) {
        const value = match[1];
        console.log(`✅ ${fieldName}: ${value.length}文字`);

        // JSONフィールドのvalidation
        if (fieldName.includes("json")) {
          try {
            JSON.parse(value);
            console.log(`  📊 JSON有効`);
          } catch (e) {
            console.log(`  ❌ JSONエラー: ${e.message.substring(0, 50)}...`);
          }
        }
        return value;
      }
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

// 問題の分析関数
function analyzeQuestion(questionData) {
  const issues = [];

  if (!questionData) {
    return ["問題データが見つかりません"];
  }

  // 1. 問題文チェック
  const questionText = questionData.question_text || "";
  if (questionText.includes("詳細は問題文参照")) {
    issues.push("問題文に「詳細は問題文参照」が含まれている");
  }
  if (questionText.length < 100) {
    issues.push("問題文が短すぎる");
  }

  // 2. JSON検証
  const correctAnswerJson = questionData.correct_answer_json || "";
  try {
    const parsed = JSON.parse(correctAnswerJson);

    // テンプレートデータチェック
    const jsonStr = JSON.stringify(parsed).toLowerCase();
    if (jsonStr.includes("template") || jsonStr.includes("sample")) {
      issues.push("解答にテンプレート・サンプルデータ残存");
    }

    // 帳簿問題のエントリチェック
    if (parsed.entries && Array.isArray(parsed.entries)) {
      if (parsed.entries.length === 0) {
        issues.push("帳簿エントリが空");
      } else {
        let hasValidEntries = true;
        for (let i = 0; i < parsed.entries.length; i++) {
          const entry = parsed.entries[i];
          if (!entry.date || !entry.description) {
            hasValidEntries = false;
            break;
          }
        }
        if (!hasValidEntries) {
          issues.push("帳簿エントリに必須フィールド不足");
        }
      }
    }
  } catch (e) {
    issues.push(`JSON構文エラー: ${e.message}`);
  }

  // 3. 回答タイプチェック
  // Note: answer_type フィールドが見つからない場合があるので、category_idから推測
  const categoryId = questionData.category_id;
  if (categoryId === "ledger") {
    // 帳簿問題は ledger_entry である必要がある
    const answerType = questionData.answer_type;
    if (answerType && answerType !== "ledger_entry") {
      issues.push(`回答タイプ不一致: ${answerType} (期待: ledger_entry)`);
    }
  }

  return issues;
}

// メイン処理
console.log("📖 master-questions.ts読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// テスト用にいくつかの問題で確認
const testQuestions = [
  "Q_L_001",
  "Q_L_011",
  "Q_L_015",
  "Q_L_016",
  "Q_L_021",
  "Q_L_031",
];

let results = {
  successful: 0,
  failed: 0,
  issues: [],
};

console.log("\n🔍 テスト抽出と分析開始\n");
console.log("=".repeat(50));

for (const questionId of testQuestions) {
  const questionData = extractQuestionData(questionsContent, questionId);

  if (questionData && questionData.question_text) {
    results.successful++;
    console.log(`✅ ${questionId}: 抽出成功`);

    // 分析実行
    const issues = analyzeQuestion(questionData);
    if (issues.length > 0) {
      console.log(`⚠️  ${questionId}の問題:`);
      issues.forEach((issue) => console.log(`  - ${issue}`));
      results.issues.push({ id: questionId, issues });
    } else {
      console.log(`✅ ${questionId}: 問題なし`);
    }
  } else {
    results.failed++;
    console.log(`❌ ${questionId}: 抽出失敗`);
  }

  console.log("-".repeat(30));
}

console.log(`\n📊 テスト結果:`);
console.log(`✅ 成功: ${results.successful}/${testQuestions.length}`);
console.log(`❌ 失敗: ${results.failed}/${testQuestions.length}`);
console.log(`⚠️  問題あり: ${results.issues.length}問`);

if (results.successful > 0) {
  console.log(
    "\n🎯 抽出ロジック改善成功！全40問での分析を実行する準備ができました。",
  );
} else {
  console.log("\n⚠️ 抽出ロジックにまだ問題があります。更なる調整が必要です。");
}

// 実際の問題データの構造確認
console.log("\n🔍 Q_L_001の詳細構造:");
const q001Data = extractQuestionData(questionsContent, "Q_L_001");
if (q001Data) {
  console.log("- ID:", q001Data.id);
  console.log("- カテゴリ:", q001Data.category_id);
  console.log("- 問題文長さ:", q001Data.question_text?.length || 0);
  console.log("- 正答JSON長さ:", q001Data.correct_answer_json?.length || 0);
  console.log("- 説明長さ:", q001Data.explanation?.length || 0);

  if (q001Data.correct_answer_json) {
    try {
      const parsed = JSON.parse(q001Data.correct_answer_json);
      console.log("- エントリ数:", parsed.entries?.length || 0);
    } catch (e) {
      console.log("- JSON解析エラー:", e.message);
    }
  }
}
