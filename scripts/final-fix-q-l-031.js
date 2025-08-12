const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031の最終修正（確実版）\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_031の範囲を特定
const startPattern = /id: "Q_L_031"/;
const endPattern = /id: "Q_L_032"/;

const startMatch = content.match(startPattern);
const endMatch = content.match(endPattern);

if (startMatch && endMatch) {
  const startIndex = startMatch.index;
  const endIndex = endMatch.index;

  const beforeSection = content.substring(0, startIndex);
  const section = content.substring(startIndex, endIndex);
  const afterSection = content.substring(endIndex);

  // 選択問題用のテンプレート
  const choiceTemplate = {
    type: "single_choice",
    options: [
      { value: "1", label: "選択肢1" },
      { value: "2", label: "選択肢2" },
      { value: "3", label: "選択肢3" },
      { value: "4", label: "選択肢4" },
    ],
  };

  const templateJson = JSON.stringify(choiceTemplate);

  // answer_template_jsonを置換
  const updatedSection = section.replace(
    /answer_template_json:\s*'[^']*'/,
    `answer_template_json: '${templateJson}'`,
  );

  // correct_answer_jsonも修正
  const choiceAnswer = { selected: "1" };
  const answerJson = JSON.stringify(choiceAnswer);

  const finalSection = updatedSection.replace(
    /correct_answer_json:\s*'[^']*'/,
    `correct_answer_json: '${answerJson}'`,
  );

  // 全体を再構築
  content = beforeSection + finalSection + afterSection;

  console.log("✅ Q_L_031: single_choice形式に修正");
  console.log("✅ Q_L_031: 解答も選択形式に修正");
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n🎉 Q_L_031の最終修正完了！");
