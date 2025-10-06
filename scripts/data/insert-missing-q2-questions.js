#!/usr/bin/env node

/**
 * 欠損7問題をmaster-questions.tsに追加するスクリプト
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// 7問題のデータ（missingQ2Questions配列から生成）
const newQuestions = `  {
    id: "Q2_V_021",
    category_id: "ledger",
    section_number: 2,
    question_order: 21,
    question_text:
      "簿記における帳簿は、（①）と補助簿に分類される。主要簿には（②）と総勘定元帳があり、補助簿には（③）などがある。",
    answer_template_json:
      '{"id":"Q2_V_021","type":"vocabulary","questionText":"簿記における帳簿は、（①）と補助簿に分類される。主要簿には（②）と総勘定元帳があり、補助簿には（③）などがある。","blanks":[{"index":1,"choices":["主要簿","基本簿","総括簿","中心簿"]},{"index":2,"choices":["仕訳帳","現金出納帳","売掛金元帳","仕入帳"]},{"index":3,"choices":["現金出納帳","資本金勘定","損益勘定","繰越試算表"]}]}',
    correct_answer_json:
      '{"blanks":[{"index":0,"correctIndex":0},{"index":1,"correctIndex":0},{"index":2,"correctIndex":0}]}',
    explanation:
      "簿記の帳簿は主要簿と補助簿に分類されます。主要簿は仕訳帳と総勘定元帳の2つで、すべての取引を記録します。補助簿は現金出納帳、仕入帳、売上帳などで、特定の取引の詳細を記録します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"vocabulary","pattern":"帳簿","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_V_022",
    category_id: "ledger",
    section_number: 2,
    question_order: 22,
    question_text:
      "すべての取引を（①）順に記録する帳簿を仕訳帳という。仕訳帳では、取引を（②）と（③）に分けて記録する。",
    answer_template_json:
      '{"id":"Q2_V_022","type":"vocabulary","questionText":"すべての取引を（①）順に記録する帳簿を仕訳帳という。仕訳帳では、取引を（②）と（③）に分けて記録する。","blanks":[{"index":1,"choices":["日付","金額","科目","取引先"]},{"index":2,"choices":["借方","資産","収益","入金"]},{"index":3,"choices":["貸方","負債","費用","出金"]}]}',
    correct_answer_json:
      '{"blanks":[{"index":0,"correctIndex":0},{"index":1,"correctIndex":0},{"index":2,"correctIndex":0}]}',
    explanation:
      "仕訳帳は、すべての取引を日付順に記録する主要簿です。各取引を借方と貸方に分けて記録し、複式簿記の原則に従います。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"vocabulary","pattern":"仕訳帳","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_V_026",
    category_id: "ledger",
    section_number: 2,
    question_order: 26,
    question_text:
      "総勘定元帳の各勘定残高を集計した表を（①）という。試算表には、（②）試算表、（③）試算表、合計残高試算表の3種類がある。",
    answer_template_json:
      '{"id":"Q2_V_026","type":"vocabulary","questionText":"総勘定元帳の各勘定残高を集計した表を（①）という。試算表には、（②）試算表、（③）試算表、合計残高試算表の3種類がある。","blanks":[{"index":1,"choices":["試算表","精算表","財務諸表","決算書"]},{"index":2,"choices":["合計","残高","損益","貸借"]},{"index":3,"choices":["残高","損益","貸借","合計"]}]}',
    correct_answer_json:
      '{"blanks":[{"index":0,"correctIndex":0},{"index":1,"correctIndex":0},{"index":2,"correctIndex":0}]}',
    explanation:
      "試算表は、総勘定元帳の各勘定残高を集計した表で、記帳の正確性を確認するために作成します。合計試算表、残高試算表、合計残高試算表の3種類があります。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"vocabulary","pattern":"決算","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_B_002",
    category_id: "ledger",
    section_number: 2,
    question_order: 29,
    question_text: "",
    answer_template_json:
      '{"id":"Q2_B_002","type":"auxiliary_book","transactions":[{"index":1,"description":"当座預金から80,000円を引き出して、現金として受け取った"},{"index":2,"description":"仕入先への買掛金120,000円を当座預金から支払った"},{"index":3,"description":"商品150,000円を仕入れ、代金は小切手を振り出して支払った"}],"books":[{"id":"cash_book","name":"現金出納帳"},{"id":"checking_book","name":"当座預金出納帳"},{"id":"purchase_book","name":"仕入帳"},{"id":"sales_book","name":"売上帳"},{"id":"inventory_book","name":"商品有高帳"},{"id":"accounts_payable_ledger","name":"買掛金元帳"},{"id":"accounts_receivable_ledger","name":"売掛金元帳"},{"id":"notes_receivable_register","name":"受取手形記入帳"},{"id":"notes_payable_register","name":"支払手形記入帳"},{"id":"fixed_asset_ledger","name":"固定資産台帳"}],"correctAnswers":[{"transactionIndex":1,"bookIds":["cash_book","checking_book"]},{"transactionIndex":2,"bookIds":["checking_book","accounts_payable_ledger"]},{"transactionIndex":3,"bookIds":["checking_book","purchase_book","inventory_book"]}]}',
    correct_answer_json: "{}",
    explanation:
      "取引1（当座預金引出）は現金出納帳と当座預金出納帳に記入。取引2（買掛金支払）は当座預金出納帳と買掛金元帳に記入。取引3（小切手振出仕入）は当座預金出納帳、仕入帳、商品有高帳に記入します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"auxiliary_book","pattern":"当座預金取引","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_B_003",
    category_id: "ledger",
    section_number: 2,
    question_order: 30,
    question_text: "",
    answer_template_json:
      '{"id":"Q2_B_003","type":"auxiliary_book","transactions":[{"index":1,"description":"商品200,000円を売り上げ、代金は約束手形で受け取った"},{"index":2,"description":"商品150,000円を仕入れ、代金は約束手形を振り出して支払った"},{"index":3,"description":"受取手形100,000円が満期となり、当座預金に入金された"}],"books":[{"id":"cash_book","name":"現金出納帳"},{"id":"checking_book","name":"当座預金出納帳"},{"id":"purchase_book","name":"仕入帳"},{"id":"sales_book","name":"売上帳"},{"id":"inventory_book","name":"商品有高帳"},{"id":"accounts_payable_ledger","name":"買掛金元帳"},{"id":"accounts_receivable_ledger","name":"売掛金元帳"},{"id":"notes_receivable_register","name":"受取手形記入帳"},{"id":"notes_payable_register","name":"支払手形記入帳"},{"id":"fixed_asset_ledger","name":"固定資産台帳"}],"correctAnswers":[{"transactionIndex":1,"bookIds":["sales_book","inventory_book","notes_receivable_register"]},{"transactionIndex":2,"bookIds":["purchase_book","inventory_book","notes_payable_register"]},{"transactionIndex":3,"bookIds":["checking_book","notes_receivable_register"]}]}',
    correct_answer_json: "{}",
    explanation:
      "取引1（手形売上）は売上帳、商品有高帳、受取手形記入帳に記入。取引2（手形仕入）は仕入帳、商品有高帳、支払手形記入帳に記入。取引3（手形決済）は当座預金出納帳と受取手形記入帳に記入します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"auxiliary_book","pattern":"手形取引","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_B_008",
    category_id: "ledger",
    section_number: 2,
    question_order: 35,
    question_text: "",
    answer_template_json:
      '{"id":"Q2_B_008","type":"auxiliary_book","transactions":[{"index":1,"description":"商品300,000円を仕入れ、代金のうち100,000円は現金で支払い、残額は掛とした"},{"index":2,"description":"前月の買掛金200,000円のうち、150,000円を小切手を振り出して支払った"},{"index":3,"description":"商品250,000円を売り上げ、代金のうち100,000円は現金で受け取り、残額は掛とした"}],"books":[{"id":"cash_book","name":"現金出納帳"},{"id":"checking_book","name":"当座預金出納帳"},{"id":"purchase_book","name":"仕入帳"},{"id":"sales_book","name":"売上帳"},{"id":"inventory_book","name":"商品有高帳"},{"id":"accounts_payable_ledger","name":"買掛金元帳"},{"id":"accounts_receivable_ledger","name":"売掛金元帳"},{"id":"notes_receivable_register","name":"受取手形記入帳"},{"id":"notes_payable_register","name":"支払手形記入帳"},{"id":"fixed_asset_ledger","name":"固定資産台帳"}],"correctAnswers":[{"transactionIndex":1,"bookIds":["cash_book","purchase_book","inventory_book","accounts_payable_ledger"]},{"transactionIndex":2,"bookIds":["checking_book","accounts_payable_ledger"]},{"transactionIndex":3,"bookIds":["cash_book","sales_book","inventory_book","accounts_receivable_ledger"]}]}',
    correct_answer_json: "{}",
    explanation:
      "取引1（一部現金・一部掛仕入）は現金出納帳、仕入帳、商品有高帳、買掛金元帳に記入。取引2（買掛金一部支払）は当座預金出納帳と買掛金元帳に記入。取引3（一部現金・一部掛売上）は現金出納帳、売上帳、商品有高帳、売掛金元帳に記入します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"auxiliary_book","pattern":"複合取引","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "Q2_B_015",
    category_id: "ledger",
    section_number: 2,
    question_order: 42,
    question_text: "",
    answer_template_json:
      '{"id":"Q2_B_015","type":"auxiliary_book","transactions":[{"index":1,"description":"商品150,000円を仕入れ、代金は保有していた約束手形を裏書譲渡して支払った"},{"index":2,"description":"裏書譲渡した手形が満期日に不渡りとなり、振出人に対して償還請求した"},{"index":3,"description":"不渡手形の金額を現金で受け取った"}],"books":[{"id":"cash_book","name":"現金出納帳"},{"id":"checking_book","name":"当座預金出納帳"},{"id":"purchase_book","name":"仕入帳"},{"id":"sales_book","name":"売上帳"},{"id":"inventory_book","name":"商品有高帳"},{"id":"accounts_payable_ledger","name":"買掛金元帳"},{"id":"accounts_receivable_ledger","name":"売掛金元帳"},{"id":"notes_receivable_register","name":"受取手形記入帳"},{"id":"notes_payable_register","name":"支払手形記入帳"},{"id":"fixed_asset_ledger","name":"固定資産台帳"}],"correctAnswers":[{"transactionIndex":1,"bookIds":["purchase_book","inventory_book","notes_receivable_register"]},{"transactionIndex":2,"bookIds":["notes_receivable_register"]},{"transactionIndex":3,"bookIds":["cash_book"]}]}',
    correct_answer_json: "{}",
    explanation:
      "取引1（手形裏書譲渡）は仕入帳、商品有高帳、受取手形記入帳に記入。取引2（手形不渡）は受取手形記入帳に不渡手形として記録。取引3（不渡手形回収）は現金出納帳に記入します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"auxiliary_book","pattern":"特殊取引","examSection":2,"keywords":[]}',
    created_at: "2025-10-05T00:00:00.000Z",
    updated_at: "2025-10-05T00:00:00.000Z",
  },`;

console.log("📝 master-questions.tsを読み込み中...");
const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");

// 最後の]; を見つける
const lastBracket = content.lastIndexOf("];");
if (lastBracket === -1) {
  console.error("❌ エラー: 配列の終わりが見つかりません");
  process.exit(1);
}

// 新しい問題を挿入
const before = content.substring(0, lastBracket);
const after = content.substring(lastBracket);

const newContent = before + newQuestions + "\n" + after;

// バックアップを作成
const backupPath = MASTER_QUESTIONS_PATH + ".backup-" + Date.now();
fs.writeFileSync(backupPath, content, "utf-8");
console.log(`✅ バックアップ作成: ${path.basename(backupPath)}`);

// 新しいファイルを書き込み
fs.writeFileSync(MASTER_QUESTIONS_PATH, newContent, "utf-8");

console.log("✅ 7問題を追加しました:");
console.log("   - Q2_V_021（主要簿と補助簿）");
console.log("   - Q2_V_022（仕訳帳）");
console.log("   - Q2_V_026（試算表）");
console.log("   - Q2_B_002（当座預金取引）");
console.log("   - Q2_B_003（手形取引）");
console.log("   - Q2_B_008（掛仕入と一部現金支払）");
console.log("   - Q2_B_015（手形の裏書譲渡）");
console.log("");
console.log("📊 Q2問題総数: 63問 → 70問");
console.log("");
console.log("⚠️  注意: Phase 3でquestion_order値を調整する必要があります");
