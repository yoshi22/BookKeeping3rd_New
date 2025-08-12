const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031-Q_L_037を単一選択フォーマットに修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_031-Q_L_037の各問題を修正
for (let i = 31; i <= 37; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : null;

  console.log(`処理中: ${id}`);

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

  // 解答データ（単一選択）
  const choiceAnswer = { selected: "1" };
  const answerJson = JSON.stringify(choiceAnswer);

  // 該当問題の範囲を特定
  const startPattern = new RegExp(`id: "${id}"`);
  const endPattern = nextId ? new RegExp(`id: "${nextId}"`) : null;

  const startMatch = content.match(startPattern);
  const endMatch = endPattern ? content.match(endPattern) : null;

  if (startMatch) {
    const startIndex = startMatch.index;
    const endIndex = endMatch ? endMatch.index : content.length;

    const beforeSection = content.substring(0, startIndex);
    const section = content.substring(startIndex, endIndex);
    const afterSection = content.substring(endIndex);

    // answer_template_jsonを置換
    let updatedSection = section.replace(
      /answer_template_json:\s*'[^']*'/,
      `answer_template_json: '${templateJson}'`,
    );

    // correct_answer_jsonも置換
    updatedSection = updatedSection.replace(
      /correct_answer_json:\s*'[^']*'/,
      `correct_answer_json: '${answerJson}'`,
    );

    // 全体を再構築
    content = beforeSection + updatedSection + afterSection;

    console.log(`✅ ${id}: single_choice形式に修正`);
  } else {
    console.log(`⚠️ ${id}: 見つかりません`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_031-Q_L_037の修正完了！");
console.log("📝 次は最終検証を実行してください");
