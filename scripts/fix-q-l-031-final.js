const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031の最終修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_031を選択問題形式に修正
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

// Q_L_031のanswer_template_jsonを修正
const templatePattern =
  /(id:\s*"Q_L_031"[\s\S]*?)answer_template_json:\s*'[^']*'/;
content = content.replace(
  templatePattern,
  `$1answer_template_json: '${templateJson}'`,
);

// Q_L_031のcorrect_answer_jsonも修正
const choiceAnswer = {
  selected: "1",
};

const answerJson = JSON.stringify(choiceAnswer);

const answerPattern = /(id:\s*"Q_L_031"[\s\S]*?)correct_answer_json:\s*'[^']*'/;
content = content.replace(
  answerPattern,
  `$1correct_answer_json: '${answerJson}'`,
);

// ファイル保存
console.log("💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("✅ Q_L_031: single_choice形式に修正完了");
console.log("✅ Q_L_031: 解答も選択形式に修正完了");
console.log("\n🎉 全40問の入力フォーム修正が完了しました！");
