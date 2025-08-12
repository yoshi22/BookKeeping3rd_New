const fs = require("fs");
const path = require("path");

console.log("🔧 直接的な第二問分析スクリプト - Q_L_015、Q_L_016検証\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 簡単で確実な抽出関数
function extractQuestionInfo(content, questionId) {
  // sedコマンドのような直接的な抽出
  const lines = content.split("\n");
  let capturing = false;
  let questionLines = [];
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(`id: "${questionId}"`)) {
      capturing = true;
      // この行より前の{を見つける
      for (let j = i - 1; j >= 0; j--) {
        if (lines[j].trim().includes("{")) {
          questionLines.push(lines[j]);
          braceCount++;
          break;
        }
      }
      questionLines.push(line);
    }

    if (capturing) {
      if (
        !questionLines.includes(line) &&
        line !== questionLines[questionLines.length - 1]
      ) {
        questionLines.push(line);
      }

      // 大雑把な終了判定
      if (line.trim() === "},") {
        braceCount--;
        if (braceCount === 0) {
          break;
        }
      }

      if (line.includes('id: "Q_L_') && !line.includes(`"${questionId}"`)) {
        // 次の問題に到達したら停止
        questionLines.pop(); // 次の問題の行を除去
        break;
      }
    }
  }

  const questionText = questionLines.join("\n");
  console.log(`📋 ${questionId}: ${questionText.length}文字の問題データを抽出`);

  // 簡単なフィールド抽出
  const extractValue = (fieldName) => {
    const regex = new RegExp(
      `${fieldName}:\\s*(?:\\n\\s*)?['"]([\\s\\S]*?)['"]\\s*,`,
      "m",
    );
    const match = questionText.match(regex);
    return match ? match[1] : null;
  };

  return {
    id: questionId,
    raw: questionText,
    question_text: extractValue("question_text"),
    correct_answer_json: extractValue("correct_answer_json"),
    explanation: extractValue("explanation"),
    category_id: extractValue("category_id"),
  };
}

// 分析関数
function analyzeQuestionsDirectly(questionsContent) {
  console.log("🔍 Q_L_015、Q_L_016の直接分析\n");
  console.log("=".repeat(50));

  const targetQuestions = ["Q_L_015", "Q_L_016"];

  for (const questionId of targetQuestions) {
    console.log(`\n📌 ${questionId}の詳細分析`);
    console.log("-".repeat(30));

    const data = extractQuestionInfo(questionsContent, questionId);

    if (!data.question_text) {
      console.log(`❌ ${questionId}: 問題文を抽出できません`);
      continue;
    }

    console.log(`問題文: ${data.question_text?.substring(0, 100)}...`);
    console.log(`問題文長さ: ${data.question_text?.length || 0}文字`);
    console.log(`カテゴリ: ${data.category_id}`);

    // 1. 問題を解くのに十分な情報があるかチェック
    const issues = [];

    const questionText = data.question_text || "";
    if (questionText.includes("詳細は問題文参照")) {
      issues.push("❌ 問題文に「詳細は問題文参照」が含まれている");
    }

    if (questionText.length < 150) {
      issues.push("⚠️ 問題文が短すぎる（150文字未満）");
    }

    if (!questionText.includes("円") && !questionText.includes("取引")) {
      issues.push("⚠️ 問題文に具体的な取引や金額情報が不足");
    }

    // 2. 解答データのチェック
    const answerJson = data.correct_answer_json || "";
    if (answerJson) {
      console.log(`正答JSON: ${answerJson.substring(0, 100)}...`);
      console.log(`正答JSON長さ: ${answerJson.length}文字`);

      try {
        const parsed = JSON.parse(answerJson);
        console.log("✅ JSON解析成功");

        // 仕入帳問題なのに定期預金データが入っている問題をチェック
        if (
          questionText.includes("仕入帳") &&
          JSON.stringify(parsed).includes("定期預金")
        ) {
          issues.push("❌ 仕入帳問題なのに解答データが定期預金関連");
        }

        if (parsed.entries && Array.isArray(parsed.entries)) {
          console.log(`エントリ数: ${parsed.entries.length}`);
          if (parsed.entries.length > 0) {
            console.log(`最初のエントリ: ${JSON.stringify(parsed.entries[0])}`);
          }
        }
      } catch (e) {
        issues.push(`❌ JSON解析エラー: ${e.message}`);
      }
    } else {
      issues.push("❌ 正答JSONが見つからない");
    }

    // 結果出力
    if (issues.length === 0) {
      console.log("✅ 問題なし");
    } else {
      console.log(`\n📋 発見された問題 (${issues.length}件):`);
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }

    console.log("\n" + "=".repeat(40));
  }
}

// 全40問の簡易チェック
function quickAnalysisAll40(questionsContent) {
  console.log("\n🔍 全40問の簡易チェック");
  console.log("=".repeat(30));

  const allQL = [];
  for (let i = 1; i <= 40; i++) {
    const qId = `Q_L_${i.toString().padStart(3, "0")}`;
    allQL.push(qId);
  }

  let validCount = 0;
  let issueCount = 0;
  let criticalIssues = [];

  for (const qId of allQL) {
    const data = extractQuestionInfo(questionsContent, qId);

    if (!data.question_text || data.question_text.length < 50) {
      console.log(`❌ ${qId}: 問題文が不適切`);
      issueCount++;
      criticalIssues.push(qId);
      continue;
    }

    if (data.question_text.includes("詳細は問題文参照")) {
      console.log(`❌ ${qId}: 「詳細は問題文参照」を含む`);
      issueCount++;
      criticalIssues.push(qId);
      continue;
    }

    if (!data.correct_answer_json || data.correct_answer_json.length < 50) {
      console.log(`❌ ${qId}: 正答データが不適切`);
      issueCount++;
      criticalIssues.push(qId);
      continue;
    }

    // 基本的な整合性チェック
    if (
      data.question_text.includes("仕入") &&
      data.correct_answer_json.includes("定期預金")
    ) {
      console.log(`❌ ${qId}: 問題と解答の不整合 (仕入問題に定期預金解答)`);
      issueCount++;
      criticalIssues.push(qId);
      continue;
    }

    validCount++;
    if (validCount <= 5) {
      console.log(`✅ ${qId}: 適切`);
    } else if (validCount === 6) {
      console.log(`✅ 他適切な問題多数...`);
    }
  }

  console.log(`\n📊 簡易チェック結果:`);
  console.log(`✅ 適切: ${validCount}/40`);
  console.log(`❌ 要修正: ${issueCount}/40`);
  console.log(`📈 適切率: ${Math.round((validCount / 40) * 100)}%`);

  if (criticalIssues.length > 0) {
    console.log(`\n🚨 修正が必要な問題:`);
    console.log(criticalIssues.join(", "));
  }
}

// メイン処理実行
console.log("📖 master-questions.ts読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// 特定問題の詳細分析
analyzeQuestionsDirectly(questionsContent);

// 全問題の簡易チェック
quickAnalysisAll40(questionsContent);

console.log("\n🎯 分析完了");
console.log("📝 次のステップ: 見つかった問題の具体的な修正");
