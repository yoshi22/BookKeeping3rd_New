const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_022-Q_L_030の根本的修復（Ultra Fix）\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_022-Q_L_030の各問題を修正
for (let i = 22; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  console.log(`\n処理中: ${id}`);

  // 破損パターンを検出して修正
  // IDが破損している場合のパターン
  const corruptedIdPattern = new RegExp(
    `id: "${id}"\\{[^\\}]*\\}.*?correct_answer_json:`,
    "s",
  );

  const match = content.match(corruptedIdPattern);

  if (match) {
    console.log(`  ❌ 破損検出: ${match[0].substring(0, 50)}...`);

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
      const month = i - 20;
      questionText = `【3伝票制記入問題】\\n\\n2025年${month}月の取引について、3伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 5日: 商品を掛けで仕入れた 120,000円\\n${month}月10日: 商品を現金で売り上げた 85,000円\\n${month}月15日: 売掛金を現金で回収した 95,000円\\n${month}月20日: 買掛金を小切手で支払った 110,000円\\n${month}月25日: 備品を掛けで購入した 45,000円\\n\\n【作成指示】\\n・${voucherType}を作成\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
    } else {
      const month = i - 26;
      questionText = `【5伝票制記入問題】\\n\\n2025年${month}月の取引について、5伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 3日: 商品を掛けで仕入れた 150,000円\\n${month}月 8日: 商品を掛けで売り上げた 200,000円\\n${month}月12日: 商品を現金で仕入れた 65,000円\\n${month}月18日: 商品を現金で売り上げた 95,000円\\n${month}月24日: 給料を現金で支払った 180,000円\\n\\n【作成指示】\\n・${voucherType}を作成\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
    }

    // 伝票記入用のテンプレート
    const voucherTemplate = {
      type: "voucher_entry",
      vouchers: [
        {
          type: voucherType,
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "account",
              label: "勘定科目",
              type: "text",
              required: true,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
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

    // 完全な構造に置き換え
    const replacement = `id: "${id}",
    question_text: "${questionText}",
    answer_template_json: '${templateJson}',
    correct_answer_json:`;

    content = content.replace(corruptedIdPattern, replacement);
    console.log(`  ✅ 破損部分を完全修復`);
  } else {
    console.log(`  ℹ️ 破損パターンなし - 通常の方法で修正`);

    // 通常のパターンで修正
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
      const month = i - 20;
      questionText = `【3伝票制記入問題】\\n\\n2025年${month}月の取引について、3伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 5日: 商品を掛けで仕入れた 120,000円\\n${month}月10日: 商品を現金で売り上げた 85,000円\\n${month}月15日: 売掛金を現金で回収した 95,000円\\n${month}月20日: 買掛金を小切手で支払った 110,000円\\n${month}月25日: 備品を掛けで購入した 45,000円\\n\\n【作成指示】\\n・${voucherType}を作成\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
    } else {
      const month = i - 26;
      questionText = `【5伝票制記入問題】\\n\\n2025年${month}月の取引について、5伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 3日: 商品を掛けで仕入れた 150,000円\\n${month}月 8日: 商品を掛けで売り上げた 200,000円\\n${month}月12日: 商品を現金で仕入れた 65,000円\\n${month}月18日: 商品を現金で売り上げた 95,000円\\n${month}月24日: 給料を現金で支払った 180,000円\\n\\n【作成指示】\\n・${voucherType}を作成\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;
    }

    // 伝票記入用のテンプレート
    const voucherTemplate = {
      type: "voucher_entry",
      vouchers: [
        {
          type: voucherType,
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "account",
              label: "勘定科目",
              type: "text",
              required: true,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
      ],
    };

    const templateJson = JSON.stringify(voucherTemplate);

    // answer_template_jsonパターンで修正
    const templatePattern = new RegExp(
      `(id:\\s*"${id}"[\\s\\S]*?)answer_template_json:\\s*'[^']*'`,
      "",
    );

    if (content.match(templatePattern)) {
      content = content.replace(
        templatePattern,
        `$1answer_template_json: '${templateJson}'`,
      );
      console.log(`  ✅ テンプレート修正`);
    }

    // question_textも修正
    const questionPattern = new RegExp(
      `(id:\\s*"${id}"[\\s\\S]*?)question_text:\\s*"[^"]*"`,
      "",
    );

    if (content.match(questionPattern)) {
      content = content.replace(
        questionPattern,
        `$1question_text: "${questionText}"`,
      );
      console.log(`  ✅ 問題文修正`);
    }
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_022-Q_L_030のUltra Fix完了！");
console.log("🎉 根本的な修復が完了しました");
