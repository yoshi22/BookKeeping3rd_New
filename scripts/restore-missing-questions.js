const fs = require("fs");

// Missing question IDs identified by analysis
const missingIds = [
  "Q_J_010",
  "Q_J_014",
  "Q_J_022",
  "Q_J_024",
  "Q_J_031",
  "Q_J_032",
  "Q_J_035",
  "Q_J_038",
  "Q_J_039",
  "Q_J_040",
  "Q_J_041",
  "Q_J_056",
  "Q_J_062",
  "Q_J_067",
  "Q_J_069",
  "Q_J_071",
  "Q_J_073",
  "Q_J_076",
  "Q_J_077",
  "Q_J_078",
  "Q_J_080",
  "Q_J_081",
  "Q_J_084",
  "Q_J_092",
  "Q_J_103",
  "Q_J_105",
  "Q_J_109",
  "Q_J_110",
  "Q_J_113",
  "Q_J_116",
  "Q_J_117",
  "Q_J_119",
  "Q_J_120",
  "Q_J_122",
  "Q_J_124",
  "Q_J_125",
  "Q_J_137",
  "Q_J_152",
  "Q_J_163",
  "Q_J_164",
  "Q_J_175",
  "Q_J_192",
  "Q_J_196",
  "Q_J_198",
  "Q_J_200",
  "Q_J_203",
  "Q_J_204",
  "Q_J_207",
  "Q_J_215",
  "Q_J_227",
  "Q_J_230",
  "Q_J_238",
  "Q_J_243",
  "Q_J_247",
  "Q_J_250",
];

// Extract questions from file content
function extractQuestions(content) {
  const match = content.match(
    /export const masterQuestions: Question\[\] = (\[[\s\S]+?\]);/,
  );
  if (!match) {
    throw new Error("Could not find masterQuestions in file");
  }

  // Clean up the match to make it valid JSON
  let questionsStr = match[1]
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/\/\/.*$/gm, "") // Remove line comments
    .replace(/,\s*\]/g, "]") // Remove trailing commas
    .replace(/,\s*\}/g, "}"); // Remove trailing commas in objects

  try {
    return eval(questionsStr);
  } catch (e) {
    console.error("Failed to parse questions:", e);
    return [];
  }
}

// Function to simplify complex numbers to 2-4 digits
function simplifyNumbers(text) {
  if (!text) return text;

  return (
    text
      // 6-7桁の数値を簡略化 (100,000以上)
      .replace(/\b(\d{1,3}),(\d{3}),(\d{3})\b/g, (match, p1, p2, p3) => {
        const num = parseInt(p1 + p2 + p3);
        if (num >= 1000000) return Math.round(num / 100000) * 100 + ""; // 100万以上は100の倍数
        if (num >= 100000) return Math.round(num / 10000) * 100 + ""; // 10万以上は100の倍数
        return match;
      })

      // 5桁の数値を簡略化 (10,000-99,999)
      .replace(/\b(\d{2}),(\d{3})\b/g, (match, p1, p2) => {
        const num = parseInt(p1 + p2);
        if (num >= 50000) return Math.round(num / 1000) * 100 + ""; // 5万以上は100の倍数
        if (num >= 10000) return Math.round(num / 1000) * 50 + ""; // 1万以上は50の倍数
        return match;
      })

      // 4桁の数値を簡略化 (1,000-9,999)
      .replace(/\b(\d{1}),(\d{3})\b/g, (match, p1, p2) => {
        const num = parseInt(p1 + p2);
        if (num >= 5000) return Math.round(num / 100) * 100 + ""; // 5000以上は100の倍数
        if (num >= 1000) return Math.round(num / 50) * 50 + ""; // 1000以上は50の倍数
        return match;
      })

      // カンマなしの大きな数値
      .replace(/\b(\d{6,})\b/g, (match) => {
        const num = parseInt(match);
        if (num >= 1000000) return Math.round(num / 100000) * 100 + "";
        if (num >= 100000) return Math.round(num / 10000) * 100 + "";
        if (num >= 10000) return Math.round(num / 1000) * 50 + "";
        if (num >= 1000) return Math.round(num / 100) * 50 + "";
        return match;
      })

      // 特殊なケースの修正
      .replace(/\b(\d+),0+\b/g, (match, p1) => p1 + "0") // 1,000 -> 100, 22,000 -> 220など
      .replace(/\b(\d+)00+\b/g, (match) => {
        const num = parseInt(match);
        if (num >= 10000) return Math.round(num / 1000) * 100 + "";
        if (num >= 1000) return Math.round(num / 100) * 50 + "";
        return match;
      })
  );
}

// Function to simplify all JSON fields in a question
function simplifyQuestionNumbers(question) {
  const simplified = { ...question };

  // Simplify question text
  if (simplified.question_text) {
    simplified.question_text = simplifyNumbers(simplified.question_text);
  }

  // Simplify explanation
  if (simplified.explanation) {
    simplified.explanation = simplifyNumbers(simplified.explanation);
  }

  // Simplify answer template
  if (simplified.answer_template_json) {
    try {
      const template = JSON.parse(simplified.answer_template_json);
      const templateStr = JSON.stringify(template);
      const simplifiedTemplateStr = simplifyNumbers(templateStr);
      simplified.answer_template_json = simplifiedTemplateStr;
    } catch (e) {
      console.warn(
        `Failed to simplify answer_template_json for ${question.id}:`,
        e,
      );
    }
  }

  // Simplify correct answer
  if (simplified.correct_answer_json) {
    try {
      const answer = JSON.parse(simplified.correct_answer_json);
      const answerStr = JSON.stringify(answer);
      const simplifiedAnswerStr = simplifyNumbers(answerStr);
      simplified.correct_answer_json = simplifiedAnswerStr;
    } catch (e) {
      console.warn(
        `Failed to simplify correct_answer_json for ${question.id}:`,
        e,
      );
    }
  }

  return simplified;
}

// Read current and backup files
console.log("Reading files...");
const currentContent = fs.readFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts",
  "utf8",
);
const backupContent = fs.readFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts.backup-1755417187910",
  "utf8",
);

// Extract questions
const currentQuestions = extractQuestions(currentContent);
const backupQuestions = extractQuestions(backupContent);

console.log(`Current questions: ${currentQuestions.length}`);
console.log(`Backup questions: ${backupQuestions.length}`);

// Find missing questions in backup
const missingQuestions = backupQuestions.filter((q) =>
  missingIds.includes(q.id),
);
console.log(`Found ${missingQuestions.length} missing questions in backup`);

// Simplify numbers in missing questions
console.log("Simplifying numbers in missing questions...");
const simplifiedMissingQuestions = missingQuestions.map((q) => {
  console.log(`Processing ${q.id}...`);
  return simplifyQuestionNumbers(q);
});

// Combine current questions with simplified missing questions
const allQuestions = [...currentQuestions, ...simplifiedMissingQuestions];

// Sort by ID to maintain order
allQuestions.sort((a, b) => {
  // Extract numeric part from Q_J_XXX format
  const aNum = parseInt(a.id.split("_")[2]);
  const bNum = parseInt(b.id.split("_")[2]);
  return aNum - bNum;
});

console.log(`Total questions after restoration: ${allQuestions.length}`);
console.log(
  `Journal questions: ${allQuestions.filter((q) => q.category_id === "journal").length}`,
);
console.log(
  `Ledger questions: ${allQuestions.filter((q) => q.category_id === "ledger").length}`,
);
console.log(
  `Trial balance questions: ${allQuestions.filter((q) => q.category_id === "trial_balance").length}`,
);

// Create the new file content
const newFileContent = currentContent.replace(
  /export const masterQuestions: Question\[\] = \[[\s\S]+?\];/,
  `export const masterQuestions: Question[] = ${JSON.stringify(allQuestions, null, 2)};`,
);

// Create a backup of current file
const backupPath = `/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts.backup-${Date.now()}`;
fs.writeFileSync(backupPath, currentContent);
console.log(`Created backup: ${backupPath}`);

// Write the restored file
fs.writeFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts",
  newFileContent,
);

console.log("✅ Questions restored successfully!");
console.log("Next step: Update database version in migrations/index.ts");
