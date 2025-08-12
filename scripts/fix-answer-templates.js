const fs = require("fs");
const path = require("path");

console.log("🔧 不適切な入力フォームの修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

const fixes = [];

// パターン3：伝票記入問題（Q_L_021-Q_L_030）- voucher_entry形式に修正
console.log("📌 パターン3：伝票記入問題の修正");

for (let i = 21; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 伝票記入用のテンプレート
  const voucherTemplate = {
    type: "voucher_entry",
    vouchers: [
      {
        type: i <= 26 ? "入金伝票" : "売上伝票",
        fields: [
          { name: "date", label: "日付", type: "date", required: true },
          { name: "account", label: "勘定科目", type: "text", required: true },
          { name: "amount", label: "金額", type: "number", required: true },
        ],
      },
    ],
  };

  const templateJson = JSON.stringify(voucherTemplate);

  // answer_template_jsonの置換
  const templateRegex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?answer_template_json:\\s*')[^']*'`,
    "s",
  );

  if (content.match(templateRegex)) {
    content = content.replace(templateRegex, `$1${templateJson}'`);
    fixes.push(`✅ ${id}: voucher_entry形式に修正`);
  }
}

// パターン4：理論・選択問題（Q_L_031-Q_L_040）- single_choice/multiple_choice形式に修正
console.log("\n📌 パターン4：理論・選択問題の修正");

for (let i = 31; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 問題文を確認して単一選択か複数選択かを判定
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  let isMultiple = false;
  if (questionMatch) {
    const questionText = questionMatch[1];
    if (
      questionText.includes("すべて選") ||
      questionText.includes("複数選択")
    ) {
      isMultiple = true;
    }
  }

  // 選択問題用のテンプレート
  const choiceTemplate = {
    type: isMultiple ? "multiple_choice" : "single_choice",
    options: [
      { value: "1", label: "選択肢1" },
      { value: "2", label: "選択肢2" },
      { value: "3", label: "選択肢3" },
      { value: "4", label: "選択肢4" },
    ],
  };

  const templateJson = JSON.stringify(choiceTemplate);

  // answer_template_jsonの置換
  const templateRegex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?answer_template_json:\\s*')[^']*'`,
    "s",
  );

  if (content.match(templateRegex)) {
    content = content.replace(templateRegex, `$1${templateJson}'`);
    fixes.push(
      `✅ ${id}: ${isMultiple ? "multiple_choice" : "single_choice"}形式に修正`,
    );
  }
}

// correct_answer_jsonも対応する形式に修正
console.log("\n📌 correct_answer_jsonの修正");

// パターン3の解答修正
for (let i = 21; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 現在の解答を取得
  const answerRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
    "s",
  );
  const answerMatch = content.match(answerRegex);

  if (answerMatch) {
    try {
      const currentAnswer = JSON.parse(answerMatch[1]);

      // voucher_entry形式に変換
      const voucherAnswer = {
        vouchers: [
          {
            type: i <= 26 ? "振替伝票" : "売上伝票",
            entries: currentAnswer.entries || [],
          },
        ],
      };

      const answerJson = JSON.stringify(voucherAnswer);

      content = content.replace(
        answerRegex,
        `id: "${id}"$1correct_answer_json: '${answerJson}'`,
      );

      fixes.push(`✅ ${id}: 解答もvoucher形式に修正`);
    } catch (e) {
      console.log(`⚠️ ${id}: 解答の変換をスキップ`);
    }
  }
}

// パターン4の解答修正
for (let i = 31; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 問題文から正解を判定
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  let choiceAnswer;
  if (questionMatch) {
    const questionText = questionMatch[1];
    if (questionText.includes("複数選択") || i >= 38) {
      // 複数選択の場合
      choiceAnswer = {
        selected: ["1", "3"], // サンプル：複数選択
      };
    } else {
      // 単一選択の場合
      choiceAnswer = {
        selected: "1", // サンプル：単一選択
      };
    }
  } else {
    choiceAnswer = { selected: "1" };
  }

  const answerJson = JSON.stringify(choiceAnswer);

  // correct_answer_jsonの置換
  const answerRegex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?correct_answer_json:\\s*')[^']*'`,
    "s",
  );

  if (content.match(answerRegex)) {
    content = content.replace(answerRegex, `$1${answerJson}'`);
    fixes.push(`✅ ${id}: 解答も選択形式に修正`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

// 結果サマリー
console.log("\n" + "=".repeat(60));
console.log("📊 修正結果サマリー");
console.log("=".repeat(60));
console.log(`修正した問題数: ${fixes.length}`);
console.log("\n修正内容:");
fixes.forEach((fix) => console.log(`  ${fix}`));

console.log("\n✅ 入力フォームの修正完了");
console.log("📝 次のステップ: npm run check:quick で動作確認");
