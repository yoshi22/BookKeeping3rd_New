/**
 * Journal Questions (仕訳問題)
 * 簿記3級問題集アプリ - 仕訳問題データ
 * Generated from master-questions.ts
 */

import { Question } from "../../types/models";

export const journalQuestions: Question[] = [
  {
    id: "Q_J_001",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が288,000円であったが、帳簿残高は809,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金過不足","debit_amount":521000,"credit_account":"現金","credit_amount":521000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金過不足 521,000円\n貸方：現金 521,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.366Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_002",
    category_id: "journal",
    question_text: "小口現金係に565,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":565000,"credit_account":"現金","credit_amount":565000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 565,000円\n貸方：現金 565,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_003",
    category_id: "journal",
    question_text: "売掛金567,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":567000,"credit_account":"売掛金","credit_amount":567000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 567,000円\n貸方：売掛金 567,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_004",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金104,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":104000,"credit_account":"当座借越","credit_amount":104000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 104,000円\n貸方：当座借越 104,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_005",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が475,000円であったが、帳簿残高は665,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金過不足","debit_amount":190000,"credit_account":"現金","credit_amount":190000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金過不足 190,000円\n貸方：現金 190,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_006",
    category_id: "journal",
    question_text: "小口現金係に241,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":241000,"credit_account":"現金","credit_amount":241000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 241,000円\n貸方：現金 241,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_007",
    category_id: "journal",
    question_text: "売掛金263,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":263000,"credit_account":"売掛金","credit_amount":263000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 263,000円\n貸方：売掛金 263,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_008",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金382,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":382000,"credit_account":"当座借越","credit_amount":382000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 382,000円\n貸方：当座借越 382,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_009",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が69,000円であったが、帳簿残高は318,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金過不足","debit_amount":249000,"credit_account":"現金","credit_amount":249000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金過不足 249,000円\n貸方：現金 249,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_010",
    category_id: "journal",
    question_text: "小口現金係に244,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":244000,"credit_account":"現金","credit_amount":244000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 244,000円\n貸方：現金 244,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_011",
    category_id: "journal",
    question_text: "売掛金501,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":501000,"credit_account":"売掛金","credit_amount":501000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 501,000円\n貸方：売掛金 501,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_012",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金811,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":811000,"credit_account":"当座借越","credit_amount":811000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 811,000円\n貸方：当座借越 811,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_013",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が581,000円であったが、帳簿残高は296,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":285000,"credit_account":"現金過不足","credit_amount":285000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 285,000円\n貸方：現金過不足 285,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_014",
    category_id: "journal",
    question_text: "小口現金係に587,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":587000,"credit_account":"現金","credit_amount":587000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 587,000円\n貸方：現金 587,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_015",
    category_id: "journal",
    question_text: "売掛金695,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":695000,"credit_account":"売掛金","credit_amount":695000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 695,000円\n貸方：売掛金 695,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_016",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金532,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":532000,"credit_account":"当座借越","credit_amount":532000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 532,000円\n貸方：当座借越 532,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_017",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が346,000円であったが、帳簿残高は601,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金過不足","debit_amount":255000,"credit_account":"現金","credit_amount":255000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金過不足 255,000円\n貸方：現金 255,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_018",
    category_id: "journal",
    question_text: "小口現金係に500,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":500000,"credit_account":"現金","credit_amount":500000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 500,000円\n貸方：現金 500,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_019",
    category_id: "journal",
    question_text: "売掛金904,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":904000,"credit_account":"売掛金","credit_amount":904000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 904,000円\n貸方：売掛金 904,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_020",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金904,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":904000,"credit_account":"当座借越","credit_amount":904000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 904,000円\n貸方：当座借越 904,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_021",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が643,000円であったが、帳簿残高は51,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":592000,"credit_account":"現金過不足","credit_amount":592000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 592,000円\n貸方：現金過不足 592,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_022",
    category_id: "journal",
    question_text: "小口現金係に537,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":537000,"credit_account":"現金","credit_amount":537000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 537,000円\n貸方：現金 537,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_023",
    category_id: "journal",
    question_text: "売掛金970,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":970000,"credit_account":"売掛金","credit_amount":970000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 970,000円\n貸方：売掛金 970,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_024",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金500,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":500000,"credit_account":"当座借越","credit_amount":500000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 500,000円\n貸方：当座借越 500,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_025",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が665,000円であったが、帳簿残高は278,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":665000,"credit_account":"現金過不足","credit_amount":665000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 665,000円\n貸方：現金過不足 665,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_026",
    category_id: "journal",
    question_text: "小口現金係に813,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":813000,"credit_account":"現金","credit_amount":813000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 813,000円\n貸方：現金 813,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_027",
    category_id: "journal",
    question_text: "売掛金134,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":134000,"credit_account":"売掛金","credit_amount":134000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 134,000円\n貸方：売掛金 134,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_028",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金572,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":572000,"credit_account":"当座借越","credit_amount":572000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 572,000円\n貸方：当座借越 572,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_029",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が127,000円であったが、帳簿残高は254,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":127000,"credit_account":"現金過不足","credit_amount":127000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 127,000円\n貸方：現金過不足 127,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_030",
    category_id: "journal",
    question_text: "小口現金係に390,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":390000,"credit_account":"現金","credit_amount":390000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 390,000円\n貸方：現金 390,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_031",
    category_id: "journal",
    question_text: "売掛金634,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":634000,"credit_account":"売掛金","credit_amount":634000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 634,000円\n貸方：売掛金 634,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_032",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金595,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":595000,"credit_account":"当座借越","credit_amount":595000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 595,000円\n貸方：当座借越 595,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_033",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が227,000円であったが、帳簿残高は136,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":227000,"credit_account":"現金過不足","credit_amount":227000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 227,000円\n貸方：現金過不足 227,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_034",
    category_id: "journal",
    question_text: "小口現金係に671,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":671000,"credit_account":"現金","credit_amount":671000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 671,000円\n貸方：現金 671,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_035",
    category_id: "journal",
    question_text: "売掛金981,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":981000,"credit_account":"売掛金","credit_amount":981000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 981,000円\n貸方：売掛金 981,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_036",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金22,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":22000,"credit_account":"当座借越","credit_amount":22000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 22,000円\n貸方：当座借越 22,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_037",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が229,000円であったが、帳簿残高は185,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":229000,"credit_account":"現金過不足","credit_amount":229000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 229,000円\n貸方：現金過不足 229,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_038",
    category_id: "journal",
    question_text: "小口現金係に515,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":515000,"credit_account":"現金","credit_amount":515000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 515,000円\n貸方：現金 515,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_039",
    category_id: "journal",
    question_text: "売掛金992,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":992000,"credit_account":"売掛金","credit_amount":992000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：当座預金 992,000円\n貸方：売掛金 992,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_040",
    category_id: "journal",
    question_text:
      "当座預金残高が不足したため、買掛金622,000円の支払いで当座借越となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":622000,"credit_account":"当座借越","credit_amount":622000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 622,000円\n貸方：当座借越 622,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座借越","accounts":["買掛金","当座借越"],"keywords":["当座借越","残高不足","買掛金支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_041",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が315,000円であったが、帳簿残高は755,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":315000,"credit_account":"現金過不足","credit_amount":315000}}',
    explanation:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\n\n【間違えやすいポイント】\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\n\n【覚え方のコツ】\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\n\n【仕訳】\n借方：現金 315,000円\n貸方：現金過不足 315,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"現金過不足","accounts":["現金","現金過不足"],"keywords":["現金実査","実際有高","帳簿残高"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_042",
    category_id: "journal",
    question_text: "小口現金係に999,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":999000,"credit_account":"現金","credit_amount":999000}}',
    explanation:
      "日常の少額支払いに備えて前渡しする現金です。\n\n【間違えやすいポイント】\n・小口現金の「補給」と「前渡し」を混同しやすい\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\n\n【覚え方のコツ】\n「小口現金を渡す」→「小口現金が増える（借方）」\n\n【仕訳】\n借方：小口現金 999,000円\n貸方：現金 999,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_043",
    category_id: "journal",
    question_text: "商品47,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":47000,"credit_account":"買掛金","credit_amount":47000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 47,000円\n貸方：買掛金 47,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_044",
    category_id: "journal",
    question_text: "商品を928,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":928000,"credit_account":"売上","credit_amount":928000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 928,000円\n貸方：売上 928,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_045",
    category_id: "journal",
    question_text: "仕入れた商品のうち548,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":548000,"credit_account":"仕入","credit_amount":548000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 548,000円\n貸方：仕入 548,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_046",
    category_id: "journal",
    question_text: "売上げた商品のうち68,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":68000,"credit_account":"売掛金","credit_amount":68000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 68,000円\n貸方：売掛金 68,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_047",
    category_id: "journal",
    question_text: "商品591,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":591000,"credit_account":"買掛金","credit_amount":591000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 591,000円\n貸方：買掛金 591,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_048",
    category_id: "journal",
    question_text: "商品を578,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":578000,"credit_account":"売上","credit_amount":578000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 578,000円\n貸方：売上 578,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_049",
    category_id: "journal",
    question_text: "仕入れた商品のうち924,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":924000,"credit_account":"仕入","credit_amount":924000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 924,000円\n貸方：仕入 924,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_050",
    category_id: "journal",
    question_text: "売上げた商品のうち776,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":776000,"credit_account":"売掛金","credit_amount":776000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 776,000円\n貸方：売掛金 776,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_051",
    category_id: "journal",
    question_text: "商品219,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":219000,"credit_account":"買掛金","credit_amount":219000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 219,000円\n貸方：買掛金 219,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_052",
    category_id: "journal",
    question_text: "商品を822,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":822000,"credit_account":"売上","credit_amount":822000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 822,000円\n貸方：売上 822,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_053",
    category_id: "journal",
    question_text: "仕入れた商品のうち950,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":950000,"credit_account":"仕入","credit_amount":950000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 950,000円\n貸方：仕入 950,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_054",
    category_id: "journal",
    question_text: "売上げた商品のうち898,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":898000,"credit_account":"売掛金","credit_amount":898000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 898,000円\n貸方：売掛金 898,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_055",
    category_id: "journal",
    question_text: "商品867,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":867000,"credit_account":"買掛金","credit_amount":867000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 867,000円\n貸方：買掛金 867,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_056",
    category_id: "journal",
    question_text: "商品を876,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":876000,"credit_account":"売上","credit_amount":876000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 876,000円\n貸方：売上 876,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_057",
    category_id: "journal",
    question_text: "仕入れた商品のうち804,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":804000,"credit_account":"仕入","credit_amount":804000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 804,000円\n貸方：仕入 804,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_058",
    category_id: "journal",
    question_text: "売上げた商品のうち189,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":189000,"credit_account":"売掛金","credit_amount":189000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 189,000円\n貸方：売掛金 189,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_059",
    category_id: "journal",
    question_text: "商品770,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":770000,"credit_account":"買掛金","credit_amount":770000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 770,000円\n貸方：買掛金 770,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_060",
    category_id: "journal",
    question_text: "商品を92,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":92000,"credit_account":"売上","credit_amount":92000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 92,000円\n貸方：売上 92,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_061",
    category_id: "journal",
    question_text: "仕入れた商品のうち201,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":201000,"credit_account":"仕入","credit_amount":201000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 201,000円\n貸方：仕入 201,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_062",
    category_id: "journal",
    question_text: "売上げた商品のうち909,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":909000,"credit_account":"売掛金","credit_amount":909000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 909,000円\n貸方：売掛金 909,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_063",
    category_id: "journal",
    question_text: "商品445,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":445000,"credit_account":"買掛金","credit_amount":445000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 445,000円\n貸方：買掛金 445,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  },
  {
    id: "Q_J_064",
    category_id: "journal",
    question_text: "商品を328,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":328000,"credit_account":"売上","credit_amount":328000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 328,000円\n貸方：売上 328,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_065",
    category_id: "journal",
    question_text: "仕入れた商品のうち582,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":582000,"credit_account":"仕入","credit_amount":582000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 582,000円\n貸方：仕入 582,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_066",
    category_id: "journal",
    question_text: "売上げた商品のうち108,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":108000,"credit_account":"売掛金","credit_amount":108000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 108,000円\n貸方：売掛金 108,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_067",
    category_id: "journal",
    question_text: "商品612,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":612000,"credit_account":"買掛金","credit_amount":612000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 612,000円\n貸方：買掛金 612,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_068",
    category_id: "journal",
    question_text: "商品を235,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":235000,"credit_account":"売上","credit_amount":235000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 235,000円\n貸方：売上 235,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_069",
    category_id: "journal",
    question_text: "仕入れた商品のうち786,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":786000,"credit_account":"仕入","credit_amount":786000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 786,000円\n貸方：仕入 786,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_070",
    category_id: "journal",
    question_text: "売上げた商品のうち695,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":695000,"credit_account":"売掛金","credit_amount":695000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 695,000円\n貸方：売掛金 695,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_071",
    category_id: "journal",
    question_text: "商品924,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":924000,"credit_account":"買掛金","credit_amount":924000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 924,000円\n貸方：買掛金 924,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_072",
    category_id: "journal",
    question_text: "商品を172,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":172000,"credit_account":"売上","credit_amount":172000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 172,000円\n貸方：売上 172,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_073",
    category_id: "journal",
    question_text: "仕入れた商品のうち860,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":860000,"credit_account":"仕入","credit_amount":860000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 860,000円\n貸方：仕入 860,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_074",
    category_id: "journal",
    question_text: "売上げた商品のうち146,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":146000,"credit_account":"売掛金","credit_amount":146000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 146,000円\n貸方：売掛金 146,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_075",
    category_id: "journal",
    question_text: "商品19,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":19000,"credit_account":"買掛金","credit_amount":19000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 19,000円\n貸方：買掛金 19,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_076",
    category_id: "journal",
    question_text: "商品を132,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":132000,"credit_account":"売上","credit_amount":132000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 132,000円\n貸方：売上 132,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_077",
    category_id: "journal",
    question_text: "仕入れた商品のうち824,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":824000,"credit_account":"仕入","credit_amount":824000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 824,000円\n貸方：仕入 824,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_078",
    category_id: "journal",
    question_text: "売上げた商品のうち775,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":775000,"credit_account":"売掛金","credit_amount":775000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 775,000円\n貸方：売掛金 775,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_079",
    category_id: "journal",
    question_text: "商品113,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":113000,"credit_account":"買掛金","credit_amount":113000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 113,000円\n貸方：買掛金 113,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_080",
    category_id: "journal",
    question_text: "商品を833,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":833000,"credit_account":"売上","credit_amount":833000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 833,000円\n貸方：売上 833,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_081",
    category_id: "journal",
    question_text: "仕入れた商品のうち872,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":872000,"credit_account":"仕入","credit_amount":872000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 872,000円\n貸方：仕入 872,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_082",
    category_id: "journal",
    question_text: "売上げた商品のうち263,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":263000,"credit_account":"売掛金","credit_amount":263000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 263,000円\n貸方：売掛金 263,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_083",
    category_id: "journal",
    question_text: "商品286,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":286000,"credit_account":"買掛金","credit_amount":286000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 286,000円\n貸方：買掛金 286,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_084",
    category_id: "journal",
    question_text: "商品を800,000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":800000,"credit_account":"売上","credit_amount":800000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：現金 800,000円\n貸方：売上 800,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_085",
    category_id: "journal",
    question_text: "仕入れた商品のうち84,000円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":84000,"credit_account":"仕入","credit_amount":84000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 84,000円\n貸方：仕入 84,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_086",
    category_id: "journal",
    question_text: "売上げた商品のうち390,000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":390000,"credit_account":"売掛金","credit_amount":390000}}',
    explanation:
      "商品やサービスを販売して得た収益を表す勘定科目です。\n\n【間違えやすいポイント】\n・売上は「収益」勘定なので貸方に記入\n・売掛金との混同に注意（売掛金は資産）\n\n【覚え方のコツ】\n「売上が上がる」→「収益の増加」→「貸方」\n\n【仕訳】\n借方：売上 390,000円\n貸方：売掛金 390,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_087",
    category_id: "journal",
    question_text: "商品150,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":150000,"credit_account":"買掛金","credit_amount":150000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 150,000円\n貸方：買掛金 150,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_088",
    category_id: "journal",
    question_text: "売掛金855,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":855000,"credit_account":"売掛金","credit_amount":855000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 855,000円\n貸方：売掛金 855,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_089",
    category_id: "journal",
    question_text: "買掛金696,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":696000,"credit_account":"当座預金","credit_amount":696000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 696,000円\n貸方：当座預金 696,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_090",
    category_id: "journal",
    question_text: "売掛金526,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":526000,"credit_account":"売掛金","credit_amount":526000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 526,000円\n貸方：売掛金 526,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_091",
    category_id: "journal",
    question_text: "買掛金387,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":387000,"credit_account":"支払手形","credit_amount":387000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 387,000円\n貸方：支払手形 387,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_092",
    category_id: "journal",
    question_text: "売掛金898,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":898000,"credit_account":"売掛金","credit_amount":898000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 898,000円\n貸方：売掛金 898,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_093",
    category_id: "journal",
    question_text: "買掛金106,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":106000,"credit_account":"当座預金","credit_amount":106000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 106,000円\n貸方：当座預金 106,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_094",
    category_id: "journal",
    question_text: "売掛金935,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":935000,"credit_account":"売掛金","credit_amount":935000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 935,000円\n貸方：売掛金 935,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_095",
    category_id: "journal",
    question_text: "買掛金169,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":169000,"credit_account":"支払手形","credit_amount":169000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 169,000円\n貸方：支払手形 169,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_096",
    category_id: "journal",
    question_text: "売掛金86,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":86000,"credit_account":"売掛金","credit_amount":86000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 86,000円\n貸方：売掛金 86,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_097",
    category_id: "journal",
    question_text: "買掛金606,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":606000,"credit_account":"当座預金","credit_amount":606000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 606,000円\n貸方：当座預金 606,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_098",
    category_id: "journal",
    question_text: "売掛金69,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":69000,"credit_account":"売掛金","credit_amount":69000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 69,000円\n貸方：売掛金 69,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_099",
    category_id: "journal",
    question_text: "買掛金489,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":489000,"credit_account":"支払手形","credit_amount":489000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 489,000円\n貸方：支払手形 489,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_100",
    category_id: "journal",
    question_text: "売掛金773,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":773000,"credit_account":"売掛金","credit_amount":773000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 773,000円\n貸方：売掛金 773,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_101",
    category_id: "journal",
    question_text: "買掛金897,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":897000,"credit_account":"当座預金","credit_amount":897000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 897,000円\n貸方：当座預金 897,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_102",
    category_id: "journal",
    question_text: "売掛金744,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":744000,"credit_account":"売掛金","credit_amount":744000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 744,000円\n貸方：売掛金 744,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_103",
    category_id: "journal",
    question_text: "買掛金535,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":535000,"credit_account":"支払手形","credit_amount":535000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 535,000円\n貸方：支払手形 535,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_104",
    category_id: "journal",
    question_text: "売掛金610,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":610000,"credit_account":"売掛金","credit_amount":610000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 610,000円\n貸方：売掛金 610,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_105",
    category_id: "journal",
    question_text: "買掛金675,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":675000,"credit_account":"当座預金","credit_amount":675000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 675,000円\n貸方：当座預金 675,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_106",
    category_id: "journal",
    question_text: "売掛金823,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":823000,"credit_account":"売掛金","credit_amount":823000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 823,000円\n貸方：売掛金 823,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_107",
    category_id: "journal",
    question_text: "買掛金698,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":698000,"credit_account":"支払手形","credit_amount":698000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 698,000円\n貸方：支払手形 698,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_108",
    category_id: "journal",
    question_text: "売掛金362,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":362000,"credit_account":"売掛金","credit_amount":362000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 362,000円\n貸方：売掛金 362,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_109",
    category_id: "journal",
    question_text: "買掛金708,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":708000,"credit_account":"当座預金","credit_amount":708000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 708,000円\n貸方：当座預金 708,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_110",
    category_id: "journal",
    question_text: "売掛金859,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":859000,"credit_account":"売掛金","credit_amount":859000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 859,000円\n貸方：売掛金 859,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_111",
    category_id: "journal",
    question_text: "買掛金88,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":88000,"credit_account":"支払手形","credit_amount":88000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 88,000円\n貸方：支払手形 88,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_112",
    category_id: "journal",
    question_text: "売掛金7,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":7000,"credit_account":"売掛金","credit_amount":7000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 7,000円\n貸方：売掛金 7,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_113",
    category_id: "journal",
    question_text: "買掛金639,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":639000,"credit_account":"当座預金","credit_amount":639000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 639,000円\n貸方：当座預金 639,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_114",
    category_id: "journal",
    question_text: "売掛金420,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":420000,"credit_account":"売掛金","credit_amount":420000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 420,000円\n貸方：売掛金 420,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_115",
    category_id: "journal",
    question_text: "買掛金249,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":249000,"credit_account":"支払手形","credit_amount":249000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 249,000円\n貸方：支払手形 249,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_116",
    category_id: "journal",
    question_text: "売掛金814,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":814000,"credit_account":"売掛金","credit_amount":814000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 814,000円\n貸方：売掛金 814,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_117",
    category_id: "journal",
    question_text: "買掛金111,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":111000,"credit_account":"当座預金","credit_amount":111000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 111,000円\n貸方：当座預金 111,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_118",
    category_id: "journal",
    question_text: "売掛金201,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":201000,"credit_account":"売掛金","credit_amount":201000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 201,000円\n貸方：売掛金 201,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_119",
    category_id: "journal",
    question_text: "買掛金248,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":248000,"credit_account":"支払手形","credit_amount":248000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 248,000円\n貸方：支払手形 248,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_120",
    category_id: "journal",
    question_text: "売掛金712,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":712000,"credit_account":"売掛金","credit_amount":712000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 712,000円\n貸方：売掛金 712,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_121",
    category_id: "journal",
    question_text: "買掛金314,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":314000,"credit_account":"当座預金","credit_amount":314000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 314,000円\n貸方：当座預金 314,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_122",
    category_id: "journal",
    question_text: "売掛金190,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":190000,"credit_account":"売掛金","credit_amount":190000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 190,000円\n貸方：売掛金 190,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_123",
    category_id: "journal",
    question_text: "買掛金85,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":85000,"credit_account":"支払手形","credit_amount":85000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 85,000円\n貸方：支払手形 85,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_124",
    category_id: "journal",
    question_text: "売掛金608,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":608000,"credit_account":"売掛金","credit_amount":608000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 608,000円\n貸方：売掛金 608,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_125",
    category_id: "journal",
    question_text: "買掛金975,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":975000,"credit_account":"当座預金","credit_amount":975000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 975,000円\n貸方：当座預金 975,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"買掛金支払","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_126",
    category_id: "journal",
    question_text: "売掛金472,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":472000,"credit_account":"売掛金","credit_amount":472000}}',
    explanation:
      "商品代金の支払いとして受け取った約束手形を表す資産勘定です。\n\n【間違えやすいポイント】\n・受取手形は「資産」、支払手形は「負債」\n・他店振出小切手は「現金」として処理\n\n【覚え方のコツ】\n「受取」手形＝手形を「もらう」＝資産\n\n【仕訳】\n借方：受取手形 472,000円\n貸方：売掛金 472,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形受取","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_127",
    category_id: "journal",
    question_text: "買掛金275,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":275000,"credit_account":"支払手形","credit_amount":275000}}',
    explanation:
      "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\n\n【間違えやすいポイント】\n・買掛金は「負債」、売掛金は「資産」\n・支払時は買掛金が減少（借方）\n\n【覚え方のコツ】\n「買」掛金＝「買った」ツケ＝払う義務（負債）\n\n【仕訳】\n借方：買掛金 275,000円\n貸方：支払手形 275,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"手形支払","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_128",
    category_id: "journal",
    question_text: "売掛金50,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":50000,"credit_account":"売掛金","credit_amount":50000}}',
    explanation:
      "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\n\n【間違えやすいポイント】\n・売掛金は「資産」、買掛金は「負債」\n・回収時は売掛金が減少（貸方）\n\n【覚え方のコツ】\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\n\n【仕訳】\n借方：現金 50,000円\n貸方：売掛金 50,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金回収","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_129",
    category_id: "journal",
    question_text:
      "従業員に給料563,000円を支払った。なお、源泉所得税146,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":563000,"credit_account":"現金","credit_amount":563000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 563,000円\n貸方：現金 563,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_130",
    category_id: "journal",
    question_text:
      "社会保険料584,000円（会社負担181,000円、従業員負担18,100円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":584000,"credit_account":"預り金","credit_amount":584000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 584,000円\n貸方：預り金 584,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_131",
    category_id: "journal",
    question_text: "固定資産税973,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":973000,"credit_account":"現金","credit_amount":973000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 973,000円\n貸方：現金 973,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_132",
    category_id: "journal",
    question_text: "法人税等33,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":33000,"credit_account":"当座預金","credit_amount":33000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 33,000円\n貸方：当座預金 33,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_133",
    category_id: "journal",
    question_text:
      "従業員に給料176,000円を支払った。なお、源泉所得税817,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":176000,"credit_account":"現金","credit_amount":176000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 176,000円\n貸方：現金 176,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_134",
    category_id: "journal",
    question_text:
      "社会保険料59,000円（会社負担387,000円、従業員負担38,700円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":59000,"credit_account":"預り金","credit_amount":59000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 59,000円\n貸方：預り金 59,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_135",
    category_id: "journal",
    question_text: "固定資産税729,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":729000,"credit_account":"現金","credit_amount":729000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 729,000円\n貸方：現金 729,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_136",
    category_id: "journal",
    question_text: "法人税等699,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":699000,"credit_account":"当座預金","credit_amount":699000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 699,000円\n貸方：当座預金 699,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_137",
    category_id: "journal",
    question_text:
      "従業員に給料573,000円を支払った。なお、源泉所得税151,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":573000,"credit_account":"現金","credit_amount":573000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 573,000円\n貸方：現金 573,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_138",
    category_id: "journal",
    question_text:
      "社会保険料994,000円（会社負担248,000円、従業員負担24,800円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":994000,"credit_account":"預り金","credit_amount":994000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 994,000円\n貸方：預り金 994,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_139",
    category_id: "journal",
    question_text: "固定資産税314,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":314000,"credit_account":"現金","credit_amount":314000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 314,000円\n貸方：現金 314,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_140",
    category_id: "journal",
    question_text: "法人税等314,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":314000,"credit_account":"当座預金","credit_amount":314000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 314,000円\n貸方：当座預金 314,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_141",
    category_id: "journal",
    question_text:
      "従業員に給料809,000円を支払った。なお、源泉所得税941,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":809000,"credit_account":"現金","credit_amount":809000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 809,000円\n貸方：現金 809,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_142",
    category_id: "journal",
    question_text:
      "社会保険料330,000円（会社負担169,000円、従業員負担16,900円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":330000,"credit_account":"預り金","credit_amount":330000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 330,000円\n貸方：預り金 330,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_143",
    category_id: "journal",
    question_text: "固定資産税435,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":435000,"credit_account":"現金","credit_amount":435000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 435,000円\n貸方：現金 435,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_144",
    category_id: "journal",
    question_text: "法人税等163,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":163000,"credit_account":"当座預金","credit_amount":163000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 163,000円\n貸方：当座預金 163,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_145",
    category_id: "journal",
    question_text:
      "従業員に給料919,000円を支払った。なお、源泉所得税824,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":919000,"credit_account":"現金","credit_amount":919000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 919,000円\n貸方：現金 919,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_146",
    category_id: "journal",
    question_text:
      "社会保険料691,000円（会社負担357,000円、従業員負担35,700円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":691000,"credit_account":"預り金","credit_amount":691000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 691,000円\n貸方：預り金 691,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_147",
    category_id: "journal",
    question_text: "固定資産税783,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":783000,"credit_account":"現金","credit_amount":783000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 783,000円\n貸方：現金 783,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_148",
    category_id: "journal",
    question_text: "法人税等550,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":550000,"credit_account":"当座預金","credit_amount":550000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 550,000円\n貸方：当座預金 550,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_149",
    category_id: "journal",
    question_text:
      "従業員に給料223,000円を支払った。なお、源泉所得税504,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":223000,"credit_account":"現金","credit_amount":223000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 223,000円\n貸方：現金 223,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_150",
    category_id: "journal",
    question_text:
      "社会保険料435,000円（会社負担119,000円、従業員負担11,900円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":435000,"credit_account":"預り金","credit_amount":435000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 435,000円\n貸方：預り金 435,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_151",
    category_id: "journal",
    question_text: "固定資産税54,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":54000,"credit_account":"現金","credit_amount":54000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 54,000円\n貸方：現金 54,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_152",
    category_id: "journal",
    question_text: "法人税等310,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":310000,"credit_account":"当座預金","credit_amount":310000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 310,000円\n貸方：当座預金 310,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_153",
    category_id: "journal",
    question_text:
      "従業員に給料512,000円を支払った。なお、源泉所得税48,000円を差し引いて現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":512000,"credit_account":"現金","credit_amount":464000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":48000}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_154",
    category_id: "journal",
    question_text:
      "社会保険料250,800円（会社負担228,000円、従業員負担22,800円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":228000,"credit_account":"現金","credit_amount":250800},{"debit_account":"預り金","debit_amount":22800,"credit_account":"","credit_amount":0}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_155",
    category_id: "journal",
    question_text: "固定資産税947,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":947000,"credit_account":"現金","credit_amount":947000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 947,000円\n貸方：現金 947,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_156",
    category_id: "journal",
    question_text: "法人税等497,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":497000,"credit_account":"当座預金","credit_amount":497000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 497,000円\n貸方：当座預金 497,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_157",
    category_id: "journal",
    question_text:
      "従業員に給料377,000円を支払った。なお、源泉所得税52,000円を差し引いて現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":377000,"credit_account":"現金","credit_amount":325000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":52000}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_158",
    category_id: "journal",
    question_text:
      "社会保険料174,900円（会社負担159,000円、従業員負担15,900円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":159000,"credit_account":"現金","credit_amount":174900},{"debit_account":"預り金","debit_amount":15900,"credit_account":"","credit_amount":0}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_159",
    category_id: "journal",
    question_text: "固定資産税540,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":540000,"credit_account":"現金","credit_amount":540000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 540,000円\n貸方：現金 540,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_160",
    category_id: "journal",
    question_text: "法人税等847,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":847000,"credit_account":"当座預金","credit_amount":847000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 847,000円\n貸方：当座預金 847,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_161",
    category_id: "journal",
    question_text:
      "従業員に給料604,000円を支払った。なお、源泉所得税63,000円を差し引いて現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":604000,"credit_account":"現金","credit_amount":541000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":63000}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_162",
    category_id: "journal",
    question_text:
      "社会保険料814,000円（会社負担740,000円、従業員負担74,000円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":740000,"credit_account":"現金","credit_amount":814000},{"debit_account":"預り金","debit_amount":74000,"credit_account":"","credit_amount":0}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_163",
    category_id: "journal",
    question_text: "固定資産税462,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":462000,"credit_account":"現金","credit_amount":462000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 462,000円\n貸方：現金 462,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_164",
    category_id: "journal",
    question_text: "法人税等814,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":814000,"credit_account":"当座預金","credit_amount":814000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 814,000円\n貸方：当座預金 814,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_165",
    category_id: "journal",
    question_text:
      "従業員に給料292,000円を支払った。なお、源泉所得税38,000円を差し引いて現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":292000,"credit_account":"現金","credit_amount":254000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":38000}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_166",
    category_id: "journal",
    question_text:
      "社会保険料382,800円（会社負担348,000円、従業員負担34,800円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"entries":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}}',
    correct_answer_json:
      '{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":348000,"credit_account":"現金","credit_amount":382800},{"debit_account":"預り金","debit_amount":34800,"credit_account":"","credit_amount":0}]}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方： 0円\n貸方： 0円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_167",
    category_id: "journal",
    question_text: "固定資産税18,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":18000,"credit_account":"現金","credit_amount":18000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：租税公課 18,000円\n貸方：現金 18,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_168",
    category_id: "journal",
    question_text: "法人税等111,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":111000,"credit_account":"当座預金","credit_amount":111000}}',
    explanation:
      "銀行の当座預金口座への入金・振込を処理する仕訳です。\n\n【間違えやすいポイント】\n・当座預金と普通預金を混同しやすい\n・他人振出小切手は「現金」として扱うことに注意\n\n【覚え方のコツ】\n「当座に入金」→「当座預金が増える（借方）」\n\n【仕訳】\n借方：法人税等 111,000円\n貸方：当座預金 111,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_169",
    category_id: "journal",
    question_text:
      "従業員に給料598,000円を支払った。なお、源泉所得税819,000円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":598000,"credit_account":"現金","credit_amount":598000}}',
    explanation:
      "従業員に支払う給与・賃金を表す費用勘定です。\n\n【間違えやすいポイント】\n・源泉所得税は「預り金」として処理\n・手取額と総支給額の違いに注意\n\n【覚え方のコツ】\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）\n\n【仕訳】\n借方：給料 598,000円\n貸方：現金 598,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_170",
    category_id: "journal",
    question_text:
      "社会保険料39,000円（会社負担500,000円、従業員負担50,000円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":39000,"credit_account":"預り金","credit_amount":39000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：法定福利費 39,000円\n貸方：預り金 39,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_171",
    category_id: "journal",
    question_text: "備品507,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":507000,"credit_account":"現金","credit_amount":507000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 507,000円\n貸方：現金 507,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_172",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費273,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":273000,"credit_account":"建物減価償却累計額","credit_amount":273000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 273,000円\n貸方：建物減価償却累計額 273,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_173",
    category_id: "journal",
    question_text:
      "帳簿価額702,000円の車両を943,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":943000,"credit_account":"車両","credit_amount":943000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 943,000円\n貸方：車両 943,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_174",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価536,000円、減価償却累計額633,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":536000,"credit_account":"固定資産除却損","credit_amount":536000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 536,000円\n貸方：固定資産除却損 536,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_175",
    category_id: "journal",
    question_text: "備品536,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":536000,"credit_account":"現金","credit_amount":536000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 536,000円\n貸方：現金 536,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_176",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費413,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":413000,"credit_account":"建物減価償却累計額","credit_amount":413000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 413,000円\n貸方：建物減価償却累計額 413,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_177",
    category_id: "journal",
    question_text:
      "帳簿価額823,000円の車両を435,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":435000,"credit_account":"車両","credit_amount":435000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 435,000円\n貸方：車両 435,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_178",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価89,000円、減価償却累計額822,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":89000,"credit_account":"固定資産除却損","credit_amount":89000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 89,000円\n貸方：固定資産除却損 89,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_179",
    category_id: "journal",
    question_text: "備品25,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":25000,"credit_account":"現金","credit_amount":25000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 25,000円\n貸方：現金 25,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_180",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費966,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":966000,"credit_account":"建物減価償却累計額","credit_amount":966000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 966,000円\n貸方：建物減価償却累計額 966,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_181",
    category_id: "journal",
    question_text:
      "帳簿価額315,000円の車両を604,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":604000,"credit_account":"車両","credit_amount":604000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 604,000円\n貸方：車両 604,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_182",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価30,000円、減価償却累計額717,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":30000,"credit_account":"固定資産除却損","credit_amount":30000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 30,000円\n貸方：固定資産除却損 30,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_183",
    category_id: "journal",
    question_text: "備品425,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":425000,"credit_account":"現金","credit_amount":425000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 425,000円\n貸方：現金 425,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_184",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費713,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":713000,"credit_account":"建物減価償却累計額","credit_amount":713000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 713,000円\n貸方：建物減価償却累計額 713,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_185",
    category_id: "journal",
    question_text:
      "帳簿価額751,000円の車両を96,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":96000,"credit_account":"車両","credit_amount":96000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 96,000円\n貸方：車両 96,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_186",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価92,000円、減価償却累計額472,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":92000,"credit_account":"固定資産除却損","credit_amount":92000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 92,000円\n貸方：固定資産除却損 92,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_187",
    category_id: "journal",
    question_text: "備品910,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":910000,"credit_account":"現金","credit_amount":910000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 910,000円\n貸方：現金 910,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_188",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費93,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":93000,"credit_account":"建物減価償却累計額","credit_amount":93000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 93,000円\n貸方：建物減価償却累計額 93,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_189",
    category_id: "journal",
    question_text:
      "帳簿価額984,000円の車両を4,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":4000,"credit_account":"車両","credit_amount":4000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 4,000円\n貸方：車両 4,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_190",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価305,000円、減価償却累計額440,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":305000,"credit_account":"固定資産除却損","credit_amount":305000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 305,000円\n貸方：固定資産除却損 305,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_191",
    category_id: "journal",
    question_text: "備品656,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":656000,"credit_account":"現金","credit_amount":656000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 656,000円\n貸方：現金 656,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_192",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費655,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":655000,"credit_account":"建物減価償却累計額","credit_amount":655000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 655,000円\n貸方：建物減価償却累計額 655,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_193",
    category_id: "journal",
    question_text:
      "帳簿価額806,000円の車両を360,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":360000,"credit_account":"車両","credit_amount":360000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 360,000円\n貸方：車両 360,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_194",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価539,000円、減価償却累計額836,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":539000,"credit_account":"固定資産除却損","credit_amount":539000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 539,000円\n貸方：固定資産除却損 539,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_195",
    category_id: "journal",
    question_text: "備品324,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":324000,"credit_account":"現金","credit_amount":324000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 324,000円\n貸方：現金 324,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_196",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費112,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":112000,"credit_account":"建物減価償却累計額","credit_amount":112000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 112,000円\n貸方：建物減価償却累計額 112,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_197",
    category_id: "journal",
    question_text:
      "帳簿価額603,000円の車両を767,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":767000,"credit_account":"車両","credit_amount":767000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 767,000円\n貸方：車両 767,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_198",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価71,000円、減価償却累計額831,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":71000,"credit_account":"固定資産除却損","credit_amount":71000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 71,000円\n貸方：固定資産除却損 71,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_199",
    category_id: "journal",
    question_text: "備品633,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":633000,"credit_account":"現金","credit_amount":633000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 633,000円\n貸方：現金 633,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_200",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費670,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":670000,"credit_account":"建物減価償却累計額","credit_amount":670000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 670,000円\n貸方：建物減価償却累計額 670,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_201",
    category_id: "journal",
    question_text:
      "帳簿価額580,000円の車両を613,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":613000,"credit_account":"車両","credit_amount":613000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 613,000円\n貸方：車両 613,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_202",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価431,000円、減価償却累計額989,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":431000,"credit_account":"固定資産除却損","credit_amount":431000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 431,000円\n貸方：固定資産除却損 431,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_203",
    category_id: "journal",
    question_text: "備品504,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":504000,"credit_account":"現金","credit_amount":504000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 504,000円\n貸方：現金 504,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_204",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費668,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":668000,"credit_account":"建物減価償却累計額","credit_amount":668000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 668,000円\n貸方：建物減価償却累計額 668,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_205",
    category_id: "journal",
    question_text:
      "帳簿価額529,000円の車両を310,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":310000,"credit_account":"車両","credit_amount":310000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 310,000円\n貸方：車両 310,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_206",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価719,000円、減価償却累計額191,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":719000,"credit_account":"固定資産除却損","credit_amount":719000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 719,000円\n貸方：固定資産除却損 719,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_207",
    category_id: "journal",
    question_text: "備品862,000円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":862000,"credit_account":"現金","credit_amount":862000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品 862,000円\n貸方：現金 862,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_208",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費563,000円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":563000,"credit_account":"建物減価償却累計額","credit_amount":563000}}',
    explanation:
      "固定資産の価値減少分を費用として計上する勘定科目です。\n\n【間違えやすいポイント】\n・直接法と間接法の違い\n・間接法では「減価償却累計額」を使用\n\n【覚え方のコツ】\n間接法：借方）減価償却費／貸方）減価償却累計額\n\n【仕訳】\n借方：減価償却費 563,000円\n貸方：建物減価償却累計額 563,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_209",
    category_id: "journal",
    question_text:
      "帳簿価額142,000円の車両を521,000円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":521000,"credit_account":"車両","credit_amount":521000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：現金 521,000円\n貸方：車両 521,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_210",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価269,000円、減価償却累計額390,000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":269000,"credit_account":"固定資産除却損","credit_amount":269000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：備品減価償却累計額 269,000円\n貸方：固定資産除却損 269,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_211",
    category_id: "journal",
    question_text:
      "決算において、売掛金668,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":668000,"credit_account":"貸倒引当金","credit_amount":668000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 668,000円\n貸方：貸倒引当金 668,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-07T00:31:25.368Z",
  },
  {
    id: "Q_J_212",
    category_id: "journal",
    question_text:
      "期首商品棚卸高417,000円、当期商品仕入高318,000円、期末商品棚卸高31,800円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":417000,"credit_account":"繰越商品","credit_amount":417000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 417,000円\n貸方：繰越商品 417,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_213",
    category_id: "journal",
    question_text: "支払保険料712,000円のうち、275,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":275000,"credit_account":"保険料","credit_amount":275000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 275,000円\n貸方：保険料 275,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_214",
    category_id: "journal",
    question_text: "当期の支払利息166,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":166000,"credit_account":"未払費用","credit_amount":166000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 166,000円\n貸方：未払費用 166,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_215",
    category_id: "journal",
    question_text:
      "決算において、売掛金716,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":716000,"credit_account":"貸倒引当金","credit_amount":716000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 716,000円\n貸方：貸倒引当金 716,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_216",
    category_id: "journal",
    question_text:
      "期首商品棚卸高75,000円、当期商品仕入高12,000円、期末商品棚卸高1,200円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":75000,"credit_account":"繰越商品","credit_amount":75000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 75,000円\n貸方：繰越商品 75,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_217",
    category_id: "journal",
    question_text: "支払保険料405,000円のうち、90,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":90000,"credit_account":"保険料","credit_amount":90000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 90,000円\n貸方：保険料 90,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_218",
    category_id: "journal",
    question_text: "当期の支払利息435,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":435000,"credit_account":"未払費用","credit_amount":435000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 435,000円\n貸方：未払費用 435,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_219",
    category_id: "journal",
    question_text:
      "決算において、売掛金573,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":573000,"credit_account":"貸倒引当金","credit_amount":573000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 573,000円\n貸方：貸倒引当金 573,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_220",
    category_id: "journal",
    question_text:
      "期首商品棚卸高207,000円、当期商品仕入高898,000円、期末商品棚卸高89,800円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":207000,"credit_account":"繰越商品","credit_amount":207000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 207,000円\n貸方：繰越商品 207,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_221",
    category_id: "journal",
    question_text: "支払保険料557,000円のうち、304,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":304000,"credit_account":"保険料","credit_amount":304000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 304,000円\n貸方：保険料 304,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_222",
    category_id: "journal",
    question_text: "当期の支払利息859,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":859000,"credit_account":"未払費用","credit_amount":859000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 859,000円\n貸方：未払費用 859,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_223",
    category_id: "journal",
    question_text:
      "決算において、売掛金240,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":240000,"credit_account":"貸倒引当金","credit_amount":240000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 240,000円\n貸方：貸倒引当金 240,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_224",
    category_id: "journal",
    question_text:
      "期首商品棚卸高963,000円、当期商品仕入高231,000円、期末商品棚卸高23,100円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":963000,"credit_account":"繰越商品","credit_amount":963000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 963,000円\n貸方：繰越商品 963,000円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_225",
    category_id: "journal",
    question_text: "支払保険料742,000円のうち、209,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":209000,"credit_account":"保険料","credit_amount":209000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 209,000円\n貸方：保険料 209,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_226",
    category_id: "journal",
    question_text: "当期の支払利息692,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":692000,"credit_account":"未払費用","credit_amount":692000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 692,000円\n貸方：未払費用 692,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_227",
    category_id: "journal",
    question_text:
      "決算において、売掛金724,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":724000,"credit_account":"貸倒引当金","credit_amount":724000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 724,000円\n貸方：貸倒引当金 724,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_228",
    category_id: "journal",
    question_text:
      "期首商品棚卸高48,000円、当期商品仕入高967,000円、期末商品棚卸高96,700円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":48000,"credit_account":"繰越商品","credit_amount":48000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 48,000円\n貸方：繰越商品 48,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_229",
    category_id: "journal",
    question_text: "支払保険料488,000円のうち、321,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":321000,"credit_account":"保険料","credit_amount":321000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 321,000円\n貸方：保険料 321,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_230",
    category_id: "journal",
    question_text: "当期の支払利息938,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":938000,"credit_account":"未払費用","credit_amount":938000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 938,000円\n貸方：未払費用 938,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_231",
    category_id: "journal",
    question_text:
      "決算において、売掛金862,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":862000,"credit_account":"貸倒引当金","credit_amount":862000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 862,000円\n貸方：貸倒引当金 862,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_232",
    category_id: "journal",
    question_text:
      "期首商品棚卸高425,000円、当期商品仕入高143,000円、期末商品棚卸高14,300円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":425000,"credit_account":"繰越商品","credit_amount":425000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 425,000円\n貸方：繰越商品 425,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_233",
    category_id: "journal",
    question_text: "支払保険料132,000円のうち、628,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":132000,"credit_account":"保険料","credit_amount":132000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 132,000円\n貸方：保険料 132,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_234",
    category_id: "journal",
    question_text: "当期の支払利息265,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":265000,"credit_account":"未払費用","credit_amount":265000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 265,000円\n貸方：未払費用 265,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_235",
    category_id: "journal",
    question_text:
      "決算において、売掛金183,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":183000,"credit_account":"貸倒引当金","credit_amount":183000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 183,000円\n貸方：貸倒引当金 183,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_236",
    category_id: "journal",
    question_text:
      "期首商品棚卸高268,000円、当期商品仕入高182,000円、期末商品棚卸高18,200円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":268000,"credit_account":"繰越商品","credit_amount":268000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 268,000円\n貸方：繰越商品 268,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_237",
    category_id: "journal",
    question_text: "支払保険料213,000円のうち、450,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":213000,"credit_account":"保険料","credit_amount":213000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 213,000円\n貸方：保険料 213,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_238",
    category_id: "journal",
    question_text: "当期の支払利息658,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":658000,"credit_account":"未払費用","credit_amount":658000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 658,000円\n貸方：未払費用 658,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_239",
    category_id: "journal",
    question_text:
      "決算において、売掛金998,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":998000,"credit_account":"貸倒引当金","credit_amount":998000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 998,000円\n貸方：貸倒引当金 998,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_240",
    category_id: "journal",
    question_text:
      "期首商品棚卸高134,000円、当期商品仕入高585,000円、期末商品棚卸高58,500円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":134000,"credit_account":"繰越商品","credit_amount":134000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 134,000円\n貸方：繰越商品 134,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_241",
    category_id: "journal",
    question_text: "支払保険料882,000円のうち、150,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":882000,"credit_account":"保険料","credit_amount":882000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 882,000円\n貸方：保険料 882,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_242",
    category_id: "journal",
    question_text: "当期の支払利息488,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":488000,"credit_account":"未払費用","credit_amount":488000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 488,000円\n貸方：未払費用 488,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_243",
    category_id: "journal",
    question_text:
      "決算において、売掛金1,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":1000,"credit_account":"貸倒引当金","credit_amount":1000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 1,000円\n貸方：貸倒引当金 1,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_244",
    category_id: "journal",
    question_text:
      "期首商品棚卸高254,000円、当期商品仕入高326,000円、期末商品棚卸高32,600円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":254000,"credit_account":"繰越商品","credit_amount":254000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 254,000円\n貸方：繰越商品 254,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_245",
    category_id: "journal",
    question_text: "支払保険料828,000円のうち、690,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":828000,"credit_account":"保険料","credit_amount":828000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 828,000円\n貸方：保険料 828,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_246",
    category_id: "journal",
    question_text: "当期の支払利息49,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":49000,"credit_account":"未払費用","credit_amount":49000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 49,000円\n貸方：未払費用 49,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_247",
    category_id: "journal",
    question_text:
      "決算において、売掛金568,000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":568000,"credit_account":"貸倒引当金","credit_amount":568000}}',
    explanation:
      "売掛金等の回収不能見込額に備える引当金です。\n\n【間違えやすいポイント】\n・貸倒引当金は「資産のマイナス」勘定\n・設定時は「貸倒引当金繰入」（費用）を使用\n\n【覚え方のコツ】\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\n\n【仕訳】\n借方：貸倒引当金繰入 568,000円\n貸方：貸倒引当金 568,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_248",
    category_id: "journal",
    question_text:
      "期首商品棚卸高284,000円、当期商品仕入高683,000円、期末商品棚卸高68,300円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":284000,"credit_account":"繰越商品","credit_amount":284000}}',
    explanation:
      "販売目的で商品を購入した際の原価を表す勘定科目です。\n\n【間違えやすいポイント】\n・仕入は「費用」勘定なので借方に記入\n・買掛金との混同に注意（買掛金は負債）\n\n【覚え方のコツ】\n「仕入れる」→「費用の発生」→「借方」\n\n【仕訳】\n借方：仕入 284,000円\n貸方：繰越商品 284,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_249",
    category_id: "journal",
    question_text: "支払保険料143,000円のうち、659,000円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":143000,"credit_account":"保険料","credit_amount":143000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：前払費用 143,000円\n貸方：保険料 143,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_J_250",
    category_id: "journal",
    question_text: "当期の支払利息446,000円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":446000,"credit_account":"未払費用","credit_amount":446000}}',
    explanation:
      "簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。\n\n【仕訳】\n借方：支払利息 446,000円\n貸方：未払費用 446,000円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
];

export const journalQuestionCount = 250;
