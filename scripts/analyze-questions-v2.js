const fs = require("fs");
const path = require("path");

function analyzeQuestions() {
  console.log("=== 問題データ分析 V2 ===");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const content = fs.readFileSync(filePath, "utf8");

  // More flexible extraction
  const startIdx = content.indexOf("export const allQuestions");
  if (startIdx === -1) {
    console.log("Could not find allQuestions export");
    return;
  }

  const arrayStart = content.indexOf("[", startIdx);
  if (arrayStart === -1) {
    console.log("Could not find array start");
    return;
  }

  // Find the matching closing bracket
  let bracketCount = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === "[") bracketCount++;
    if (content[i] === "]") bracketCount--;
    if (bracketCount === 0) {
      arrayEnd = i;
      break;
    }
  }

  if (arrayEnd === -1) {
    console.log("Could not find array end");
    return;
  }

  const questionsStr = content.substring(arrayStart, arrayEnd + 1);

  try {
    // Use Function constructor instead of eval for better safety
    const questions = new Function("return " + questionsStr)();

    const journalQuestions = questions.filter((q) => q.id.startsWith("Q_J_"));
    const ledgerQuestions = questions.filter((q) => q.id.startsWith("Q_L_"));
    const statementQuestions = questions.filter((q) => q.id.startsWith("Q_F_"));

    console.log("\n=== 問題数統計 ===");
    console.log("総問題数:", questions.length);
    console.log("仕訳問題 (Q_J_):", journalQuestions.length);
    console.log("帳簿問題 (Q_L_):", ledgerQuestions.length);
    console.log("決算書問題 (Q_F_):", statementQuestions.length);

    // Check each journal question
    let successCount = 0;
    let errorsByQuestion = [];

    for (let i = 0; i < journalQuestions.length; i++) {
      const q = journalQuestions[i];
      let hasError = false;
      let errors = [];

      // Check answer_template_json
      try {
        JSON.parse(q.answer_template_json);
      } catch (e) {
        hasError = true;
        errors.push("answer_template_json: " + e.message);
      }

      // Check correct_answer_json
      try {
        JSON.parse(q.correct_answer_json);
      } catch (e) {
        hasError = true;
        errors.push("correct_answer_json: " + e.message);
      }

      // Check tags_json
      try {
        JSON.parse(q.tags_json);
      } catch (e) {
        hasError = true;
        errors.push("tags_json: " + e.message);
      }

      if (hasError) {
        errorsByQuestion.push({
          id: q.id,
          index: i,
          errors: errors,
        });
      } else {
        successCount++;
      }
    }

    console.log("\n=== JSON検証結果 ===");
    console.log("✅ 有効な仕訳問題:", successCount);
    console.log("❌ 無効な仕訳問題:", errorsByQuestion.length);

    if (successCount === 134) {
      console.log("\n⚠️ 警告: ちょうど134問で停止しています！");
      console.log("135番目の問題を確認します...");

      if (journalQuestions[134]) {
        const problemQuestion = journalQuestions[134];
        console.log("\n問題ID:", problemQuestion.id);
        console.log(
          "問題文:",
          problemQuestion.question_text.substring(0, 50) + "...",
        );

        // Check specific fields
        console.log("\ncorrect_answer_json の内容（最初の200文字）:");
        console.log(problemQuestion.correct_answer_json.substring(0, 200));
      }
    }

    if (errorsByQuestion.length > 0) {
      console.log("\n=== エラーのある問題（最初の10件） ===");
      errorsByQuestion.slice(0, 10).forEach((item) => {
        console.log(`\n${item.id} (インデックス: ${item.index}):`);
        item.errors.forEach((err) => console.log("  - " + err));
      });
    }
  } catch (e) {
    console.log("Error parsing questions:", e.message);
    console.log("Stack:", e.stack);
  }
}

analyzeQuestions();
