const fs = require("fs");

// master-questions.tsを読み込む
const content = fs.readFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts",
  "utf8",
);

// Q2_L_001-020のセクションを抽出
const q2lMatches = [
  ...content.matchAll(
    /id: "Q2_L_(\d{3})"[\s\S]*?answer_template_json:\s*'({.*?})'/g,
  ),
];

console.log(`Found ${q2lMatches.length} Q2_L problems\n`);

q2lMatches.forEach((match) => {
  const id = `Q2_L_${match[1]}`;
  const jsonStr = match[2];

  try {
    // JSONをパース（エスケープ解除）
    const data = JSON.parse(jsonStr);

    console.log(`\n=== ${id} ===`);
    console.log(`Hints:`);
    if (data.hints && Array.isArray(data.hints)) {
      data.hints.forEach((hint, index) => {
        console.log(`  ${index + 1}. ${hint}`);
      });
    } else {
      console.log("  (No hints)");
    }
  } catch (err) {
    console.error(`Error parsing ${id}:`, err.message);
  }
});
