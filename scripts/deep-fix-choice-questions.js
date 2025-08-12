const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031-Q_L_040の選択問題を徹底修正\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// 各問題の選択肢データ
const choiceQuestions = {
  Q_L_031: {
    type: "single_choice",
    options: [
      "主要簿とは、仕訳帳と総勘定元帳のことをいう",
      "補助簿は必ず作成しなければならない法定帳簿である",
      "伝票制度では主要簿の代わりに伝票を使用する",
      "すべての取引は必ず総勘定元帳に記録される",
    ],
    answer: "1",
  },
  Q_L_032: {
    type: "single_choice",
    options: [
      "資産・負債・純資産・収益・費用",
      "資産・負債・資本・収益・費用",
      "資産・負債・純資産・売上・費用",
      "資産・負債・資本金・収益・費用",
    ],
    answer: "1",
  },
  Q_L_033: {
    type: "single_choice",
    options: [
      "借方合計＝貸方合計",
      "資産＝負債＋純資産",
      "収益－費用＝利益",
      "期首残高＋当期増加－当期減少＝期末残高",
    ],
    answer: "1",
  },
  Q_L_034: {
    type: "single_choice",
    options: [
      "合計試算表・残高試算表・合計残高試算表",
      "前期試算表・当期試算表・次期試算表",
      "月次試算表・四半期試算表・年次試算表",
      "仮試算表・本試算表・確定試算表",
    ],
    answer: "1",
  },
  Q_L_035: {
    type: "single_choice",
    options: [
      "減価償却、貸倒引当金、棚卸、経過勘定項目",
      "現金過不足、当座借越、前払費用、未払費用",
      "売上原価、仕入値引、売上値引、返品",
      "支払利息、受取利息、支払手数料、受取手数料",
    ],
    answer: "1",
  },
  Q_L_036: {
    type: "single_choice",
    options: [
      "精算表→損益計算書→貸借対照表",
      "貸借対照表→損益計算書→精算表",
      "損益計算書→貸借対照表→精算表",
      "精算表→貸借対照表→損益計算書",
    ],
    answer: "1",
  },
  Q_L_037: {
    type: "single_choice",
    options: [
      "現金過不足勘定で処理し、原因判明時に正しい勘定に振り替える",
      "雑損または雑益として直接処理する",
      "現金勘定の金額を直接修正する",
      "決算まで処理を保留する",
    ],
    answer: "1",
  },
  Q_L_038: {
    type: "multiple_choice",
    options: ["資産の増加", "負債の減少", "費用の発生", "収益の発生"],
    answer: ["1", "2", "3"],
  },
  Q_L_039: {
    type: "multiple_choice",
    options: [
      "減価償却費の計上",
      "貸倒引当金の設定",
      "現金の実査",
      "経過勘定項目の計上",
    ],
    answer: ["1", "2", "4"],
  },
  Q_L_040: {
    type: "multiple_choice",
    options: ["仕訳帳", "総勘定元帳", "現金出納帳", "売掛金元帳"],
    answer: ["1", "2", "3", "4"],
  },
};

// 各問題を修正
for (let i = 31; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const questionData = choiceQuestions[id];

  if (!questionData) {
    console.log(`⚠️ ${id}: データなし`);
    continue;
  }

  console.log(`\n処理中: ${id}`);

  // テンプレートを作成
  const template = {
    type: questionData.type,
    options: questionData.options,
  };

  // 正答を作成
  const correctAnswer =
    questionData.type === "single_choice"
      ? { selected: questionData.answer }
      : { selected_options: questionData.answer };

  const templateJson = JSON.stringify(template);
  const answerJson = JSON.stringify(correctAnswer);

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
  const beforeSection = content.substring(0, startIndex);
  const afterSection = content.substring(endIndex);
  const questionSection = content.substring(startIndex, endIndex);

  // 既存のフィールドを保持しながら、テンプレートと正答を更新
  let updatedSection = questionSection;

  // answer_template_jsonを更新
  updatedSection = updatedSection.replace(
    /answer_template_json:\s*'[^']*'/,
    `answer_template_json: '${templateJson}'`,
  );

  // correct_answer_jsonを更新
  updatedSection = updatedSection.replace(
    /correct_answer_json:\s*'[^']*'/,
    `correct_answer_json: '${answerJson}'`,
  );

  content = beforeSection + updatedSection + afterSection;

  console.log(`✅ ${id}: 修正完了`);
  console.log(`  タイプ: ${questionData.type}`);
  console.log(`  選択肢数: ${questionData.options.length}`);
  console.log(`  正答: ${JSON.stringify(questionData.answer)}`);
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_031-Q_L_040の選択問題を完全修正！");

// 検証
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
    const answerMatch = section.match(/correct_answer_json:\s*'([^']+)'/);

    let templateOK = false;
    let answerOK = false;

    if (templateMatch) {
      try {
        const template = JSON.parse(templateMatch[1]);
        templateOK =
          template.type && template.options && Array.isArray(template.options);
      } catch (e) {}
    }

    if (answerMatch) {
      try {
        const answer = JSON.parse(answerMatch[1]);
        answerOK =
          answer.selected !== undefined ||
          answer.selected_options !== undefined;
      } catch (e) {}
    }

    console.log(
      `${id}: テンプレート${templateOK ? "✅" : "❌"} 正答${answerOK ? "✅" : "❌"}`,
    );
  }
}

console.log("\n🎉 選択問題が正しい形式で設定されました！");
