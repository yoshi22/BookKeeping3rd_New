const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_022-Q_L_030の深層修復\n");
console.log("Phase 1: 破損構造の分析");
console.log("=" * 50 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// 修正ログ
const fixes = [];

// Q_L_022-Q_L_030の破損パターンを修正
for (let i = 22; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  console.log(`\n🔍 ${id}の分析:`);

  // 破損パターンを検出
  const brokenPattern = new RegExp(
    `id: "${id}"\\{[^}]*\\}[^}]*\\}[^}]*\\}\\]\\}correct_answer_json:`,
    "s",
  );

  const brokenMatch = content.match(brokenPattern);

  if (brokenMatch) {
    console.log(`  ❌ 破損検出: ID行にJSONデータが混入`);
    console.log(`  📝 破損データ長: ${brokenMatch[0].length}文字`);

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
    correct_answer_json: '${answerJson}'`;

    content = content.replace(brokenMatch[0], replacement);

    console.log(`  ✅ 構造修復: 正しいフォーマットに置換`);
    console.log(`  ✅ テンプレート: voucher_entry (${voucherType})`);
    fixes.push(`${id}: 破損修復完了`);
  } else {
    console.log(`  ℹ️ 破損パターンなし - 別の方法で確認`);

    // 通常のパターンで確認
    const normalPattern = new RegExp(
      `id:\\s*"${id}"[\\s\\S]*?(?=id:\\s*"Q_L_|$)`,
      "",
    );

    const normalMatch = content.match(normalPattern);

    if (normalMatch) {
      const section = normalMatch[0];

      // answer_template_jsonが存在するか確認
      if (!section.includes("answer_template_json")) {
        console.log(`  ⚠️ answer_template_jsonフィールドが欠落`);

        // フィールドを追加する必要がある
        const idLinePattern = new RegExp(`(id:\\s*"${id}"[^,]*,)`);

        if (content.match(idLinePattern)) {
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
                  {
                    name: "account",
                    label: "勘定科目",
                    type: "text",
                    required: true,
                  },
                  {
                    name: "amount",
                    label: "金額",
                    type: "number",
                    required: true,
                  },
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

          // question_textの後に追加
          const questionTextPattern = new RegExp(
            `(id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"[^"]*",)`,
            "",
          );

          if (content.match(questionTextPattern)) {
            content = content.replace(
              questionTextPattern,
              `$1\n    answer_template_json: '${templateJson}',`,
            );
            console.log(`  ✅ answer_template_jsonフィールドを追加`);
            fixes.push(`${id}: フィールド追加`);
          }
        }
      } else {
        // answer_template_jsonは存在するが、形式が間違っている可能性
        const templateMatch = section.match(
          /answer_template_json:\s*'([^']*)'/,
        );

        if (templateMatch) {
          try {
            const template = JSON.parse(templateMatch[1]);
            console.log(`  📝 現在のタイプ: ${template.type}`);

            if (template.type !== "voucher_entry") {
              console.log(`  ⚠️ 不適切なタイプ - voucher_entryに修正が必要`);

              // この部分は次のPhaseで処理
            }
          } catch (e) {
            console.log(`  ❌ JSONパースエラー`);
          }
        }
      }
    }
  }
}

console.log("\n" + "=" * 50);
console.log("Phase 2: 残りの形式修正");
console.log("=" * 50 + "\n");

// 再度全体をチェックして、まだsingle_choiceのものをvoucher_entryに修正
for (let i = 22; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

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

  // answer_template_jsonをvoucher_entryに更新
  const updatePattern = new RegExp(
    `(id:\\s*"${id}"[\\s\\S]*?)answer_template_json:\\s*'\\{"type":"single_choice"[^']*\\}'`,
    "",
  );

  if (content.match(updatePattern)) {
    content = content.replace(
      updatePattern,
      `$1answer_template_json: '${templateJson}'`,
    );
    console.log(`✅ ${id}: single_choice → voucher_entry修正`);
    fixes.push(`${id}: フォーマット修正`);
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

// 結果サマリー
console.log("\n" + "=" * 50);
console.log("📊 深層修復結果サマリー");
console.log("=" * 50);
console.log(`修正項目数: ${fixes.length}`);
if (fixes.length > 0) {
  console.log("\n修正内容:");
  fixes.forEach((fix) => console.log(`  • ${fix}`));
}

console.log("\n✅ Q_L_022-Q_L_030の深層修復完了！");
console.log("📝 次のステップ: 最終検証を実行してください");
