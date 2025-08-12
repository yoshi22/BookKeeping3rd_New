const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_021-Q_L_030の伝票記入形式への修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

const fixes = [];

// Q_L_021-Q_L_030を伝票記入形式(voucher_entry)に修正
for (let i = 21; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
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

  const templateJson = JSON.stringify(voucherTemplate);

  // より具体的な正規表現でanswer_template_jsonを探す
  const idRegex = new RegExp(`id:\\s*"${id}"`, "g");

  const matches = [];
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    matches.push(match.index);
  }

  if (matches.length > 0) {
    // 最初のマッチから次の問題までの範囲で置換
    const startPos = matches[0];
    const nextId = `Q_L_${String(i + 1).padStart(3, "0")}`;
    const endRegex = new RegExp(`id:\\s*"${nextId}"`);
    const endMatch = endRegex.exec(content);
    const endPos = endMatch ? endMatch.index : content.length;

    const sectionBefore = content.substring(0, startPos);
    const section = content.substring(startPos, endPos);
    const sectionAfter = content.substring(endPos);

    // この範囲内でanswer_template_jsonを置換
    const updatedSection = section.replace(
      /answer_template_json:\s*'[^']*'/,
      `answer_template_json: '${templateJson}'`,
    );

    if (section !== updatedSection) {
      content = sectionBefore + updatedSection + sectionAfter;
      fixes.push(`✅ ${id}: voucher_entry形式に修正（${voucherType}）`);
    }
  }

  // correct_answer_jsonも修正
  const answerRegex = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?)correct_answer_json:\\s*'([^']*)'`,
    "s",
  );
  const answerMatch = content.match(answerRegex);

  if (answerMatch) {
    try {
      const currentAnswer = JSON.parse(answerMatch[2]);

      // voucher_entry形式の解答を作成
      const voucherAnswer = {
        vouchers: [
          {
            type: voucherType,
            entries: [
              {
                date: "2025-01-05",
                account: "現金",
                amount: 100000,
                description: "商品売上",
              },
            ],
          },
        ],
      };

      // 既存のentriesがあれば使用
      if (currentAnswer.entries && currentAnswer.entries.length > 0) {
        voucherAnswer.vouchers[0].entries = currentAnswer.entries;
      }

      const answerJson = JSON.stringify(voucherAnswer);

      content = content.replace(
        answerRegex,
        `$1correct_answer_json: '${answerJson}'`,
      );

      fixes.push(`✅ ${id}: 解答もvoucher形式に修正`);
    } catch (e) {
      console.log(`⚠️ ${id}: 解答の変換エラー`);
    }
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

// 結果サマリー
console.log("\n" + "=".repeat(60));
console.log("📊 修正結果サマリー");
console.log("=".repeat(60));
console.log(`修正した項目数: ${fixes.length}`);
console.log("\n修正内容:");
fixes.forEach((fix) => console.log(`  ${fix}`));

console.log("\n✅ Q_L_021-Q_L_030の伝票記入形式への修正完了");
