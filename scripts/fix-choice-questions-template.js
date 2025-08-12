const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031-Q_L_040の選択問題テンプレート修正\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_031-Q_L_040の修正
for (let i = 31; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  console.log(`\n処理中: ${id}`);

  // 該当問題のセクションを探す
  const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : "Q_TB_001";
  const startPattern = new RegExp(`id: "${id}"`);
  const endPattern = new RegExp(`id: "${nextId}"`);

  const startMatch = content.match(startPattern);
  const endMatch = content.match(endPattern);

  if (!startMatch) {
    console.log(`❌ ${id}が見つかりません`);
    continue;
  }

  const startIndex = startMatch.index;
  const endIndex = endMatch ? endMatch.index : content.length;
  const questionSection = content.substring(startIndex, endIndex);

  // 問題文から選択肢を抽出
  const questionMatch = questionSection.match(/question_text:\s*"([^"]+)"/);
  const questionText = questionMatch ? questionMatch[1] : "";

  // 選択肢を解析（1. 2. 3. 4. の形式）
  const optionMatches = questionText.matchAll(
    /(\d+)\.\s*([^\\]+?)(?=\\n\d+\.|\\n\\n|$)/g,
  );
  const options = [];
  for (const match of optionMatches) {
    const optionText = match[2].trim().replace(/\\n/g, "");
    options.push(optionText);
  }

  // 単一選択か複数選択かを判定
  const isMultiple =
    questionText.includes("複数選択") ||
    questionText.includes("正しいものをすべて") ||
    questionText.includes("該当するものを選び");

  // 正しいテンプレートを作成
  const template = {
    type: isMultiple ? "multiple_choice" : "single_choice",
    options:
      options.length > 0
        ? options
        : ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  };

  const templateJson = JSON.stringify(template).replace(/"/g, '\\"'); // ダブルクォートをエスケープ

  // answer_template_jsonを更新
  const templatePattern = new RegExp(
    `(id: "${id}"[\\s\\S]*?)answer_template_json:\\s*'[^']*'`,
    "",
  );

  if (content.match(templatePattern)) {
    content = content.replace(
      templatePattern,
      `$1answer_template_json: '${templateJson}'`,
    );
    console.log(`✅ ${id}: テンプレート修正完了`);
    console.log(`  タイプ: ${template.type}`);
    console.log(`  選択肢数: ${template.options.length}`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_031-Q_L_040の選択問題テンプレート修正完了！");

// 修正後の検証
console.log("\n📊 修正後の検証:");
console.log("-" * 60);

const updatedContent = fs.readFileSync(questionsPath, "utf8");

for (let i = 31; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  const idPattern = new RegExp(`id: "${id}"`);
  const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : "Q_TB_001";
  const nextIdPattern = new RegExp(`id: "${nextId}"`);

  const startMatch = updatedContent.match(idPattern);
  const endMatch = updatedContent.match(nextIdPattern);

  if (startMatch) {
    const section = updatedContent.substring(
      startMatch.index,
      endMatch ? endMatch.index : updatedContent.length,
    );

    // テンプレートを確認
    const templateMatch = section.match(/answer_template_json:\s*'([^']+)'/);
    if (templateMatch) {
      try {
        const template = JSON.parse(templateMatch[1]);
        const optionsValid =
          template.options &&
          Array.isArray(template.options) &&
          template.options.every((opt) => typeof opt === "string");

        console.log(
          `${id}: ${template.type} - 選択肢${template.options ? template.options.length : 0}個 ${optionsValid ? "✅" : "❌"}`,
        );
      } catch (e) {
        console.log(`${id}: テンプレート解析エラー ❌`);
      }
    }
  }
}

console.log("\n🎉 選択問題のテンプレートが正しく設定されました！");
