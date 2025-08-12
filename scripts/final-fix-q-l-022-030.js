const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_022-Q_L_030の最終修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_022-Q_L_030を一つずつ修正
for (let i = 22; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : null;

  console.log(`処理中: ${id}`);

  // 伝票の種類を決定
  let voucherType;
  if (i <= 23) {
    voucherType = "入金伝票";
  } else if (i <= 26) {
    voucherType = "振替伝票";
  } else if (i <= 28) {
    voucherType = "売上伝票";
  } else {
    voucherType = "仕入伝票";
  }

  // 伝票記入用のテンプレート
  const voucherTemplate = {
    type: "voucher_entry",
    vouchers: [
      {
        type: voucherType,
        fields: [
          { name: "date", label: "日付", type: "date", required: true },
          { name: "account", label: "勘定科目", type: "text", required: true },
          { name: "amount", label: "金額", type: "number", required: true },
          { name: "description", label: "摘要", type: "text", required: false },
        ],
      },
    ],
  };

  // 解答データ
  const voucherAnswer = {
    vouchers: [
      {
        type: voucherType,
        entries: [
          {
            date: `2025-0${Math.min(i - 20, 9)}-05`,
            account:
              i <= 23
                ? "売掛金"
                : i <= 26
                  ? "買掛金"
                  : i <= 28
                    ? "売上"
                    : "仕入",
            amount:
              i <= 23 ? 85000 : i <= 26 ? 120000 : i <= 28 ? 200000 : 150000,
            description:
              i <= 26 ? "商品売買" : i <= 28 ? "商品売上" : "商品仕入",
          },
        ],
      },
    ],
  };

  const templateJson = JSON.stringify(voucherTemplate);
  const answerJson = JSON.stringify(voucherAnswer);

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

    console.log(`✅ ${id}: voucher_entry形式に修正（${voucherType}）`);
  } else {
    console.log(`⚠️ ${id}: 見つかりません`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_022-Q_L_030の最終修正完了！");
