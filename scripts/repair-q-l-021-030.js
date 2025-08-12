const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_021-Q_L_030のファイル構造修復\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_021の破損箇所を修正
const brokenPattern = /id: "Q_L_021"\{"entries":\[.*?\]\}correct_answer_json:/s;
const fixedText = `id: "Q_L_021",
    question_text: "【3伝票制記入問題】\\n\\n2025年1月の取引について、3伝票制で記入してください。\\n\\n【取引データ】\\n1月 5日: 商品を掛けで仕入れた 120,000円\\n1月10日: 商品を現金で売り上げた 85,000円\\n1月15日: 売掛金を現金で回収した 95,000円\\n1月20日: 買掛金を小切手で支払った 110,000円\\n1月25日: 備品を掛けで購入した 45,000円\\n\\n【作成指示】\\n・入金伝票、出金伝票、振替伝票の適切な使い分け\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理",
    answer_template_json: '{"type":"voucher_entry","vouchers":[{"type":"入金伝票","fields":[{"name":"date","label":"日付","type":"date","required":true},{"name":"account","label":"勘定科目","type":"text","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}]}]}',
    correct_answer_json:`;

content = content.replace(brokenPattern, fixedText);

// Q_L_022-Q_L_030のanswer_template_jsonを確実に修正
for (let i = 22; i <= 30; i++) {
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

  // IDで問題を特定して、answer_template_jsonを置換
  const idPattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?)answer_template_json:\\s*'[^']*'`,
    "",
  );

  // まず現在の値を確認
  const currentMatch = content.match(idPattern);
  if (currentMatch) {
    // answer_template_jsonを新しい値に置換
    content = content.replace(
      idPattern,
      `$1answer_template_json: '${templateJson}'`,
    );
    console.log(`✅ ${id}: voucher_entry形式に修正（${voucherType}）`);
  } else {
    // パターンが見つからない場合、別の方法で試す
    const simplePattern = new RegExp(
      `"${id}"[\\s\\S]{0,2000}answer_template_json:\\s*'\\{[^']*\\}'`,
      "",
    );

    const match = content.match(simplePattern);
    if (match) {
      const replacement = match[0].replace(
        /answer_template_json:\s*'[^']*'/,
        `answer_template_json: '${templateJson}'`,
      );
      content = content.replace(match[0], replacement);
      console.log(
        `✅ ${id}: voucher_entry形式に修正（${voucherType}） - 別パターン`,
      );
    } else {
      console.log(`⚠️ ${id}: 見つからないためスキップ`);
    }
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_021-Q_L_030の構造修復完了");
