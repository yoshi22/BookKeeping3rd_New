const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_021-Q_L_030の包括的修正\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// 各問題の破損パターンを修正
for (let i = 21; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  console.log(`修正中: ${id}`);

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

  // 問題文を設定
  let questionText;
  if (i <= 26) {
    questionText = `【3伝票制記入問題】\\n\\n2025年${i - 20}月の取引について、3伝票制で記入してください。\\n\\n【取引データ】\\n${i - 20}月 5日: 商品を掛けで仕入れた 120,000円\\n${i - 20}月10日: 商品を現金で売り上げた 85,000円\\n${i - 20}月15日: 売掛金を現金で回収した 95,000円\\n${i - 20}月20日: 買掛金を小切手で支払った 110,000円\\n${i - 20}月25日: 備品を掛けで購入した 45,000円\\n\\n【作成指示】\\n・入金伝票、出金伝票、振替伝票の適切な使い分け\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
  } else {
    questionText = `【5伝票制記入問題】\\n\\n2025年${i - 26}月の取引について、5伝票制で記入してください。\\n\\n【取引データ】\\n${i - 26}月 3日: 商品を掛けで仕入れた 150,000円\\n${i - 26}月 8日: 商品を掛けで売り上げた 200,000円\\n${i - 26}月12日: 商品を現金で仕入れた 65,000円\\n${i - 26}月18日: 商品を現金で売り上げた 95,000円\\n${i - 26}月24日: 給料を現金で支払った 180,000円\\n\\n【作成指示】\\n・入金伝票、出金伝票、売上伝票、仕入伝票、振替伝票の使い分け\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
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
            date: `2025-0${i - 20}-05`,
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

  // 破損パターンを探して修正
  const brokenPattern = new RegExp(
    `id: "${id}"\\{[^}]*\\}correct_answer_json:.*?'[^']*'`,
    "s",
  );

  if (content.match(brokenPattern)) {
    // 破損している場合は完全に置き換え
    const replacement = `id: "${id}",
    question_text: "${questionText}",
    answer_template_json: '${templateJson}',
    correct_answer_json: '${answerJson}'`;

    content = content.replace(brokenPattern, replacement);
    console.log(`✅ ${id}: 構造を完全修復`);
  } else {
    // 破損していない場合は個別に修正
    // answer_template_jsonの修正
    const templatePattern = new RegExp(
      `(id:\\s*"${id}"[\\s\\S]*?)answer_template_json:\\s*'[^']*'`,
      "",
    );

    if (content.match(templatePattern)) {
      content = content.replace(
        templatePattern,
        `$1answer_template_json: '${templateJson}'`,
      );
      console.log(`✅ ${id}: テンプレート修正`);
    }

    // correct_answer_jsonの修正
    const answerPattern = new RegExp(
      `(id:\\s*"${id}"[\\s\\S]*?)correct_answer_json:\\s*'[^']*'`,
      "",
    );

    if (content.match(answerPattern)) {
      content = content.replace(
        answerPattern,
        `$1correct_answer_json: '${answerJson}'`,
      );
      console.log(`✅ ${id}: 解答修正`);
    }
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_021-Q_L_030の包括的修正完了");
console.log("🎉 全40問の入力フォーム修正が完了しました！");
