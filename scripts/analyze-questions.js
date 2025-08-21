const fs = require("fs");
const path = require("path");

function analyzeQuestions() {
  console.log("=== 問題データ分析 ===");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const content = fs.readFileSync(filePath, "utf8");

  // Extract questions array
  const match = content.match(
    /export const allQuestions[^=]*=\s*\[([\s\S]*)\];/,
  );
  if (!match) {
    console.log("Failed to extract questions array");
    return;
  }

  let questionsStr = "[" + match[1] + "]";

  try {
    // Evaluate the questions array
    eval("const questions = " + questionsStr);

    const journalQuestions = questions.filter((q) => q.id.startsWith("Q_J_"));
    const ledgerQuestions = questions.filter((q) => q.id.startsWith("Q_L_"));
    const statementQuestions = questions.filter((q) => q.id.startsWith("Q_F_"));

    console.log("\n=== 問題数統計 ===");
    console.log("総問題数:", questions.length);
    console.log("仕訳問題 (Q_J_):", journalQuestions.length);
    console.log("帳簿問題 (Q_L_):", ledgerQuestions.length);
    console.log("決算書問題 (Q_F_):", statementQuestions.length);

    // Check JSON validity for journal questions
    let validCount = 0;
    let invalidQuestions = [];
    let lastValidId = null;

    journalQuestions.forEach((q, index) => {
      try {
        JSON.parse(q.answer_template_json);
        JSON.parse(q.correct_answer_json);
        JSON.parse(q.tags_json);
        validCount++;
        lastValidId = q.id;
      } catch (e) {
        invalidQuestions.push({
          id: q.id,
          index: index,
          error: e.message,
          field: e.message.includes("answer_template")
            ? "answer_template_json"
            : e.message.includes("correct_answer")
              ? "correct_answer_json"
              : "tags_json",
        });
      }
    });

    console.log("\n=== JSON検証結果 ===");
    console.log("有効な仕訳問題:", validCount);
    console.log("無効な仕訳問題:", invalidQuestions.length);

    if (lastValidId) {
      console.log("最後の有効な問題ID:", lastValidId);
    }

    if (invalidQuestions.length > 0) {
      console.log("\n=== 無効な問題の詳細 ===");
      invalidQuestions.slice(0, 10).forEach((q) => {
        console.log(`- ${q.id} (index: ${q.index}): ${q.error}`);
      });
    }

    // Check for the 134 cutoff
    if (validCount === 134) {
      console.log("\n⚠️ 134問で停止している可能性があります");
      console.log("135番目の問題:", journalQuestions[134]?.id);
      if (journalQuestions[134]) {
        console.log("問題内容を確認中...");
        try {
          JSON.parse(journalQuestions[134].correct_answer_json);
          console.log("135番目のJSON: 有効");
        } catch (e) {
          console.log("135番目のJSONエラー:", e.message);
        }
      }
    }
  } catch (e) {
    console.log("Error evaluating questions:", e.message);
    console.log("Stack:", e.stack);
  }
}

analyzeQuestions();
