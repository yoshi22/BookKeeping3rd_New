#!/usr/bin/env node

/**
 * 第一問（Q_J_001-045）の総合修正スクリプト
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔧 第一問（Q_J_001-045）を総合的に修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// 仕訳問題用の適切なテンプレート
const journalEntryTemplate = {
  type: "journal_entry",
  entries: [
    {
      label: "借方",
      fields: [
        {
          name: "debit_account",
          label: "勘定科目",
          type: "select",
          required: true,
        },
        { name: "debit_amount", label: "金額", type: "number", required: true },
      ],
    },
    {
      label: "貸方",
      fields: [
        {
          name: "credit_account",
          label: "勘定科目",
          type: "select",
          required: true,
        },
        {
          name: "credit_amount",
          label: "金額",
          type: "number",
          required: true,
        },
      ],
    },
  ],
  allowMultipleEntries: true,
  maxEntries: 5,
};

// 各問題の修正内容
const questionEnhancements = [
  // Q_J_001-007: 現金・預金取引
  {
    id: "Q_J_001",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n現金実査の結果、現金の実際有高が288,000円であったが、帳簿残高は809,000円であった。原因は不明である。",
    subcategory: "cash_deposit",
    pattern: "現金過不足",
  },
  {
    id: "Q_J_002",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n小口現金係に565,000円を前渡しした。小口現金はインプレスト・システムを採用している。",
    subcategory: "cash_deposit",
    pattern: "小口現金",
  },
  {
    id: "Q_J_003",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n得意先から売掛金567,000円が当座預金口座に振り込まれた。",
    subcategory: "cash_deposit",
    pattern: "当座預金振込",
  },
  {
    id: "Q_J_004",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n当座預金残高が不足したため、買掛金104,000円の小切手振出により当座借越となった。当座借越限度額は500,000円である。",
    subcategory: "cash_deposit",
    pattern: "当座借越",
  },
  {
    id: "Q_J_005",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n普通預金から現金380,000円を引き出した。",
    subcategory: "cash_deposit",
    pattern: "普通預金引出",
  },
  {
    id: "Q_J_006",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n定期預金150,000円が満期となり、利息2,000円（税引後）とともに普通預金に振り替えられた。",
    subcategory: "cash_deposit",
    pattern: "定期預金満期",
  },
  {
    id: "Q_J_007",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n現金過不足50,000円（借方残高）の原因を調査したところ、通信費30,000円の記入漏れが判明した。残額は原因不明である。",
    subcategory: "cash_deposit",
    pattern: "現金過不足原因判明",
  },

  // Q_J_008-015: 商品売買取引
  {
    id: "Q_J_008",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n商品850,000円を仕入れ、代金は掛けとした。",
    subcategory: "merchandise_trade",
    pattern: "掛け仕入",
  },
  {
    id: "Q_J_009",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n商品990,000円を売り上げ、代金のうち300,000円は現金で受け取り、残額は掛けとした。",
    subcategory: "merchandise_trade",
    pattern: "売上（現金・掛け）",
  },
  {
    id: "Q_J_010",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n仕入先に商品の注文を行い、内金として200,000円を現金で支払った。",
    subcategory: "merchandise_trade",
    pattern: "前払金",
  },
  {
    id: "Q_J_011",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n掛けで仕入れた商品100,000円について、品質不良のため50,000円の値引きを受けた。",
    subcategory: "merchandise_trade",
    pattern: "仕入値引き",
  },
  {
    id: "Q_J_012",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n商品300,000円を仕入れ、引取運賃5,000円を現金で支払った。",
    subcategory: "merchandise_trade",
    pattern: "仕入諸掛り",
  },
  {
    id: "Q_J_013",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n得意先から注文を受け、内金として150,000円を現金で受け取った。",
    subcategory: "merchandise_trade",
    pattern: "前受金",
  },
  {
    id: "Q_J_014",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n掛けで売り上げた商品80,000円が返品された。",
    subcategory: "merchandise_trade",
    pattern: "売上返品",
  },
  {
    id: "Q_J_015",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n商品500,000円を売り上げ、発送費8,000円を現金で支払った（当社負担）。",
    subcategory: "merchandise_trade",
    pattern: "売上諸掛り",
  },

  // Q_J_016-022: 債権・債務
  {
    id: "Q_J_016",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n得意先に対する売掛金450,000円を回収し、小切手で受け取った。",
    subcategory: "receivables_debts",
    pattern: "売掛金回収",
  },
  {
    id: "Q_J_017",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n仕入先に対する買掛金380,000円を小切手を振り出して支払った。",
    subcategory: "receivables_debts",
    pattern: "買掛金支払",
  },
  {
    id: "Q_J_018",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n得意先から売掛金の決済として約束手形600,000円を受け取った。",
    subcategory: "receivables_debts",
    pattern: "受取手形",
  },
  {
    id: "Q_J_019",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n仕入先に対する買掛金の決済として約束手形500,000円を振り出した。",
    subcategory: "receivables_debts",
    pattern: "支払手形",
  },
  {
    id: "Q_J_020",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n所有する受取手形300,000円を裏書譲渡して買掛金の支払いに充てた。",
    subcategory: "receivables_debts",
    pattern: "手形裏書",
  },
  {
    id: "Q_J_021",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n取引先に現金200,000円を貸し付け、借用証書を受け取った。",
    subcategory: "receivables_debts",
    pattern: "貸付金",
  },
  {
    id: "Q_J_022",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n銀行から現金1,000,000円を借り入れた。返済期限は1年後である。",
    subcategory: "receivables_debts",
    pattern: "借入金",
  },

  // Q_J_023-029: 給与・税金
  {
    id: "Q_J_023",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n従業員の給料総額800,000円から、源泉所得税50,000円、社会保険料60,000円を天引きし、差引額を現金で支払った。",
    subcategory: "salary_tax",
    pattern: "給与支払",
  },
  {
    id: "Q_J_024",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n前月分の源泉所得税35,000円と住民税25,000円を現金で納付した。",
    subcategory: "salary_tax",
    pattern: "源泉税納付",
  },
  {
    id: "Q_J_025",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n社会保険料120,000円（従業員負担分60,000円、会社負担分60,000円）を現金で納付した。",
    subcategory: "salary_tax",
    pattern: "社会保険料納付",
  },
  {
    id: "Q_J_026",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n賞与総額1,500,000円から源泉所得税100,000円、社会保険料150,000円を天引きし、差引額を振込で支払った。",
    subcategory: "salary_tax",
    pattern: "賞与支払",
  },
  {
    id: "Q_J_027",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n法人税の中間申告により、法人税等300,000円を現金で納付した。",
    subcategory: "salary_tax",
    pattern: "法人税中間納付",
  },
  {
    id: "Q_J_028",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n消費税の確定申告により、消費税200,000円を現金で納付した。",
    subcategory: "salary_tax",
    pattern: "消費税納付",
  },
  {
    id: "Q_J_029",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n従業員への前月分給料500,000円が未払いとなっていたため、当月初めに現金で支払った。",
    subcategory: "salary_tax",
    pattern: "未払給料支払",
  },

  // Q_J_030-036: 固定資産
  {
    id: "Q_J_030",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n備品600,000円を購入し、代金は現金で支払った。",
    subcategory: "fixed_assets",
    pattern: "固定資産取得",
  },
  {
    id: "Q_J_031",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n建物5,000,000円を取得し、登記料50,000円、仲介手数料100,000円を現金で支払った。",
    subcategory: "fixed_assets",
    pattern: "固定資産付随費用",
  },
  {
    id: "Q_J_032",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、建物（取得原価3,000,000円、残存価額10％、耐用年数30年）について定額法により減価償却を行う。",
    subcategory: "fixed_assets",
    pattern: "減価償却（定額法）",
  },
  {
    id: "Q_J_033",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n備品（取得原価400,000円、減価償却累計額250,000円）を100,000円で売却し、代金は現金で受け取った。",
    subcategory: "fixed_assets",
    pattern: "固定資産売却損",
  },
  {
    id: "Q_J_034",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n車両（取得原価800,000円、減価償却累計額600,000円）を300,000円で売却し、代金は月末に受け取ることにした。",
    subcategory: "fixed_assets",
    pattern: "固定資産売却益",
  },
  {
    id: "Q_J_035",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n不要となった機械（取得原価500,000円、減価償却累計額500,000円）を除却し、処分費用10,000円を現金で支払った。",
    subcategory: "fixed_assets",
    pattern: "固定資産除却",
  },
  {
    id: "Q_J_036",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n火災により建物（取得原価2,000,000円、減価償却累計額800,000円）が焼失した。",
    subcategory: "fixed_assets",
    pattern: "災害損失",
  },

  // Q_J_037-043: 決算整理
  {
    id: "Q_J_037",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、売掛金残高500,000円に対して2％の貸倒引当金を差額補充法により設定する。なお、貸倒引当金の残高は3,000円である。",
    subcategory: "year_end_adj",
    pattern: "貸倒引当金設定",
  },
  {
    id: "Q_J_038",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n前期に貸倒処理した売掛金20,000円が当期に回収され、現金で受け取った。",
    subcategory: "year_end_adj",
    pattern: "償却債権取立益",
  },
  {
    id: "Q_J_039",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、向こう1年分の保険料120,000円のうち、翌期分80,000円を前払費用に振り替える。",
    subcategory: "year_end_adj",
    pattern: "前払費用",
  },
  {
    id: "Q_J_040",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、当期の家賃収入360,000円のうち、翌期分30,000円が含まれているため、前受収益に振り替える。",
    subcategory: "year_end_adj",
    pattern: "前受収益",
  },
  {
    id: "Q_J_041",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、当月分の給料400,000円が未払いとなっているため、未払費用を計上する。",
    subcategory: "year_end_adj",
    pattern: "未払費用",
  },
  {
    id: "Q_J_042",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、貸付金100,000円に対する利息1,000円が未収となっているため、未収収益を計上する。",
    subcategory: "year_end_adj",
    pattern: "未収収益",
  },
  {
    id: "Q_J_043",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n決算において、消耗品の未使用高が25,000円あったため、貯蔵品に振り替える。",
    subcategory: "year_end_adj",
    pattern: "消耗品棚卸",
  },

  // Q_J_044-045: 混合問題
  {
    id: "Q_J_044",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n商品800,000円を仕入れ、代金のうち300,000円は現金で支払い、残額は約束手形を振り出した。",
    subcategory: "merchandise_trade",
    pattern: "複合仕訳",
  },
  {
    id: "Q_J_045",
    text: "【仕訳問題】次の取引について仕訳しなさい。\n\n得意先の売掛金50,000円が貸倒れとなった。なお、貸倒引当金の残高は30,000円である。",
    subcategory: "year_end_adj",
    pattern: "貸倒処理",
  },
];

// 各問題を修正
questionEnhancements.forEach((enhancement) => {
  const pattern = new RegExp(
    `("id":\\s*"${enhancement.id}"[\\s\\S]*?"question_text":\\s*")[^"]*"`,
    "g",
  );

  content = content.replace(pattern, (match, p1) => {
    return (
      p1 + enhancement.text.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"'
    );
  });

  // テンプレートを修正
  const templatePattern = new RegExp(
    `("id":\\s*"${enhancement.id}"[\\s\\S]*?"answer_template_json":\\s*")[^"]*"`,
    "g",
  );

  content = content.replace(templatePattern, (match, p1) => {
    return p1 + JSON.stringify(journalEntryTemplate).replace(/"/g, '\\"') + '"';
  });

  // タグを更新
  const tagsPattern = new RegExp(
    `("id":\\s*"${enhancement.id}"[\\s\\S]*?"tags_json":\\s*")[^"]*"`,
    "g",
  );

  const tags = {
    subcategory: enhancement.subcategory,
    pattern: enhancement.pattern,
    examSection: 1,
  };

  content = content.replace(tagsPattern, (match, p1) => {
    return p1 + JSON.stringify(tags).replace(/"/g, '\\"') + '"';
  });
});

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("✅ 第一問（Q_J_001-045）の修正が完了しました！");

// 修正結果の確認
console.log("\n【カテゴリ別配分】");
const categoryCounts = {};
questionEnhancements.forEach((q) => {
  const cat = q.subcategory;
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

Object.entries(categoryCounts).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}問`);
});

console.log("\n✅ すべての問題に対して以下を実施しました：");
console.log("  - 問題文に【仕訳問題】の指示を追加");
console.log("  - テンプレートをjournal_entry形式に統一");
console.log("  - サブカテゴリとパターンを適切に設定");
console.log("  - 問題文を具体的で実務的な内容に改善");
