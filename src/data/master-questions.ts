import { Question } from "../types/models";

export const masterQuestions: Question[] = [
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
  {
    id: "Q_L_001",
    category_id: "ledger",
    question_text:
      "【現金勘定記入問題】\n\n2025年10月の現金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n現金：337,541円\n\n【10月の取引】\n10月5日 現金売上：276,641円（増加）\n10月10日 給料支払：215,025円（減少）\n10月15日 売掛金回収：184,924円（増加）\n10月20日 買掛金支払：241,381円（減少）\n10月28日 現金実査による過不足判明：8,502円（不足）\n\n【現金過不足の処理】\n月末に現金実査を行い、過不足を確認して適切に処理してください。\n\n【作成指示】\n1. 現金勘定へ各取引を記入\n2. 借方・貸方の合計を計算\n3. 月末残高を算出\n4. 現金過不足がある場合は適切に処理",
    answer_template_json:
      '{"type":"ledger_account","account_name":"現金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"前月繰越 337,541円","amount":337541},{"description":"現金売上 +276,641円","amount":276641},{"description":"給料支払 -215,025円","amount":215025},{"description":"売掛金回収 +184,924円","amount":184924},{"description":"買掛金支払 -241,381円","amount":241381},{"description":"現金過不足 -8,502円","amount":8502},{"description":"月末残高","amount":334198}]}}',
    explanation: "【現金勘定記入のポイント】\n1. 現金の増加（売上・回収）は借方に記入\n2. 現金の減少（支払）は貸方に記入\n3. 各取引後の残高を都度計算\n4. 現金過不足は実査時点で計上\n\n【計算過程】\n前月繰越 337,541円\n＋現金売上 276,641円\n－給料支払 215,025円\n＋売掛金回収 184,924円\n－買掛金支払 241,381円\n－現金過不足 8,502円\n＝月末残高 334,198円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_002",
    category_id: "ledger",
    question_text:
      "【売掛金勘定記入問題】\n\n2025年1月の売掛金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n売掛金：564,069円\n\n【1月の取引】\n1月3日 掛売上：190,909円\n1月8日 現金回収：51,829円\n1月15日 掛売上：179,338円\n1月22日 手形回収：111,922円\n1月28日 貸倒れ発生：35,813円\n\n【貸倒処理】\n貸倒れが発生した場合は、貸倒引当金を優先充当し、不足分は貸倒損失として処理してください。\n（貸倒引当金残高：30,000円）\n\n【作成指示】\n1. 売掛金勘定へ各取引を記入\n2. 発生と回収を適切に処理\n3. 貸倒れの処理を行う\n4. 月末残高を算出",
    answer_template_json:
      '{"type":"ledger_account","account_name":"売掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"前月繰越 564,069円","amount":564069},{"description":"掛売上 +190,909円","amount":190909},{"description":"現金回収 -51,829円","amount":51829},{"description":"掛売上 +179,338円","amount":179338},{"description":"手形回収 -111,922円","amount":111922},{"description":"貸倒処理（引当金充当 -30,000円、損失 -5,813円）","amount":35813},{"description":"月末残高","amount":734752}]}}',
    explanation: "【売掛金勘定記入のポイント】\n1. 売掛金の発生（掛売上）は借方に記入\n2. 売掛金の回収（現金・手形）は貸方に記入\n3. 貸倒れ発生時は貸倒引当金を優先充当\n4. 引当金不足分は貸倒損失として処理\n\n【貸倒処理】\n貸倒れ額 35,813円\n－貸倒引当金充当 30,000円\n＝貸倒損失 5,813円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_003",
    category_id: "ledger",
    question_text:
      "【商品勘定記入問題（三分法）】\n\n2025年10月の商品売買取引を三分法により記帳し、売上原価を算定してください。\n\n【期首商品棚卸高】\n914,556円\n\n【当月の取引】\n・当月仕入高：1,404,670円\n・当月売上高：1,826,071円\n\n【期末商品棚卸高】\n558,925円\n\n【作成指示】\n1. 仕入勘定、売上勘定、繰越商品勘定を作成\n2. 三分法による商品売買の記帳\n3. 売上原価の算定（期首＋仕入－期末）\n4. 売上総利益の計算",
    answer_template_json:
      '{"type":"ledger_account","account_name":"商品","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"期首商品棚卸高 914,556円","amount":914556},{"description":"当期仕入高 1,404,670円","amount":1404670},{"description":"期末商品棚卸高 -558,925円","amount":558925},{"description":"売上原価","amount":1760301},{"description":"売上総利益","amount":65770}]}}',
    explanation: "【三分法による商品売買記帳のポイント】\n1. 期首商品は仕入勘定へ振替（仕入/繰越商品）\n2. 当期仕入は仕入勘定に計上\n3. 期末商品は繰越商品勘定へ振替（繰越商品/仕入）\n4. 売上原価＝期首＋仕入－期末\n\n【計算】\n売上原価：1,760,301円\n売上総利益：1,826,071円－1,760,301円＝65,770円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_004",
    category_id: "ledger",
    question_text:
      "【建物勘定・減価償却累計額勘定記入問題】\n\n2025年3月末決算において、建物の減価償却を行い、関連勘定への記入を行ってください。\n\n【建物情報】\n・取得原価：4,960,026円\n・耐用年数：20年\n・償却方法：定額法（残存価額なし）\n・使用年数：19年経過\n\n【前期末の状況】\n・建物勘定残高：4,960,026円\n・減価償却累計額：4,464,018円\n\n【作成指示】\n1. 当期の減価償却費を計算\n2. 建物減価償却累計額勘定への記入\n3. 減価償却費勘定への記入\n4. 建物の帳簿価額を算出",
    answer_template_json:
      '{"type":"ledger_account","account_name":"建物・減価償却累計額","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"建物取得原価 4,960,026円","amount":4960026},{"description":"減価償却累計額（前期末） -4,464,018円","amount":4464018},{"description":"当期減価償却費 -248,001円","amount":248001},{"description":"減価償却累計額（当期末） -4,712,019円","amount":4712019},{"description":"帳簿価額","amount":248007}]}}',
    explanation: "【建物の減価償却記入のポイント】\n1. 定額法：（取得原価－残存価額）÷耐用年数\n2. 間接法：減価償却累計額勘定を使用\n3. 当期償却費＝4,960,026円÷20年＝248,001円\n4. 帳簿価額＝取得原価－減価償却累計額\n\n【19年目の処理】\n前期末累計額：4,464,018円\n当期償却費：248,001円\n当期末累計額：4,712,019円\n帳簿価額：248,007円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_005",
    category_id: "ledger",
    question_text:
      "【買掛金勘定記入問題】\n\n2025年11月の買掛金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n買掛金：523,589円\n\n【11月の取引】\n11月7日 掛仕入：393,285円\n11月14日 現金支払：227,553円\n11月21日 買掛金相殺：66,069円\n\n【作成指示】\n1. 買掛金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"買掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"前月繰越 523,589円","amount":523589},{"description":"掛仕入 +393,285円","amount":393285},{"description":"現金支払 -227,553円","amount":227553},{"description":"売掛金相殺 -66,069円","amount":66069},{"description":"月末残高","amount":623252}]}}',
    explanation: "【買掛金勘定記入のポイント】\n1. 買掛金の発生（掛仕入）は貸方に記入\n2. 買掛金の支払（現金・相殺）は借方に記入\n3. 売掛金との相殺は両勘定から減少\n4. 残高は常に貸方残高（負債）\n\n【計算過程】\n前月繰越 523,589円\n＋掛仕入 393,285円\n－現金支払 227,553円\n－相殺 66,069円\n＝月末残高 623,252円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_006",
    category_id: "ledger",
    question_text:
      "【借入金勘定・支払利息勘定記入問題】\n\n2025年3月の借入金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n借入金：725,963円\n\n【3月の取引】\n3月7日 借入金返済（元本）：227,258円\n3月14日 支払利息：20,524円\n3月21日 追加借入：135,870円\n\n【作成指示】\n1. 借入金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"借入金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"前月繰越 725,963円","amount":725963},{"description":"元本返済 -227,258円","amount":227258},{"description":"追加借入 +135,870円","amount":135870},{"description":"支払利息（別勘定） 20,524円","amount":20524},{"description":"月末残高","amount":634575}]}}',
    explanation: "【借入金勘定記入のポイント】\n1. 借入金の借入は貸方に記入（負債増加）\n2. 借入金の返済は借方に記入（負債減少）\n3. 支払利息は別勘定で処理（費用）\n4. 元本と利息は区別して記帳\n\n【処理内容】\n元本残高：634,575円\n支払利息：20,524円（費用勘定へ）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_007",
    category_id: "ledger",
    question_text:
      "【貸倒引当金勘定記入問題】\n\n2025年8月の貸倒引当金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n貸倒引当金：111,039円\n\n【8月の取引】\n8月7日 貸倒れ発生（充当）：17,606円\n8月14日 決算時繰入：44,781円\n8月21日 戻入益：11,908円\n\n【作成指示】\n1. 貸倒引当金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"貸倒引当金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"前月繰越 111,039円","amount":111039},{"description":"貸倒れ充当 -17,606円","amount":17606},{"description":"決算時繰入 +44,781円","amount":44781},{"description":"戻入益 -11,908円","amount":11908},{"description":"月末残高","amount":126306}]}}',
    explanation: "【貸倒引当金勘定記入のポイント】\n1. 貸倒引当金は評価勘定（資産のマイナス）\n2. 設定・繰入は貸方、充当・戻入は借方\n3. 差額補充法：必要額との差額を繰入\n4. 戻入益は収益として計上\n\n【残高推移】\n前月繰越 111,039円\n－充当 17,606円\n＋繰入 44,781円\n－戻入 11,908円\n＝月末残高 126,306円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_008",
    category_id: "ledger",
    question_text:
      "【売上勘定・仕入勘定の対応関係】\n\n2025年6月の売上勘定と仕入勘定の記入を行ってください。\n\n【6月の取引】\n・現金売上：397,450.8円\n・掛売上：596,176.2円\n・現金仕入：260,123.1円\n・掛仕入：606,953.9円\n\n【作成指示】\n1. 売上勘定と仕入勘定を作成\n2. 現金取引と掛取引を区別して記入\n3. 各勘定の月末残高を算出\n4. 売上総利益を計算（売上－仕入）",
    answer_template_json:
      '{"type":"ledger_account","account_name":"資本金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"現金売上 397,451円","amount":397451},{"description":"掛売上 596,176円","amount":596176},{"description":"売上高合計","amount":993627},{"description":"現金仕入 260,123円","amount":260123},{"description":"掛仕入 606,954円","amount":606954},{"description":"仕入高合計","amount":867077},{"description":"売上総利益","amount":126550}]}}',
    explanation: "【売上・仕入勘定の対応関係のポイント】\n1. 売上勘定は貸方に記入（収益）\n2. 仕入勘定は借方に記入（費用）\n3. 現金取引と掛取引を区別して記帳\n4. 売上総利益＝売上－仕入\n\n【計算】\n売上高：993,627円\n仕入高：867,077円\n売上総利益：126,550円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_009",
    category_id: "ledger",
    question_text:
      "【給料勘定・未払費用の期間配分記入】\n\n2025年11月の給料勘定と未払費用の記入を行ってください。\n\n【給料情報】\n・月額給料：321,134円\n・支払日：毎月25日（当月分）\n・決算日：11月末\n\n【11月の処理】\n・11月25日：当月給料支払\n・11月末：未払給料の計上（26日～月末分）\n\n【作成指示】\n1. 給料勘定への記入\n2. 未払給料の日割計算\n3. 未払費用勘定への記入\n4. 期間配分の適切な処理",
    answer_template_json:
      '{"type":"ledger_account","account_name":"減価償却費","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"11月25日 給料支払","amount":321134},{"description":"未払給料（26日〜30日の5日分）","amount":53522},{"description":"当月費用計上額","amount":374656}]}}',
    explanation: "【給料・未払費用の期間配分のポイント】\n1. 給料支払は費用計上と現金減少\n2. 決算時は未払分を日割計算\n3. 未払給料は未払費用勘定へ\n4. 期間対応の原則に従い配分\n\n【計算】\n月額給料：321,134円\n日割額：10,704円/日\n未払日数：5日（26日〜30日）\n未払給料：53,522円",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_010",
    category_id: "ledger",
    question_text:
      "【諸口勘定を含む複合仕訳の転記処理】\n\n2025年5月の諸口勘定を含む複合仕訳の転記を行ってください。\n\n【複合仕訳の例】\n5月10日の取引：\n（借方）\n・仕入 300,000円\n・支払手数料 5,000円\n（貸方）\n・現金 100,000円\n・買掛金 200,000円\n・未払金 5,000円\n\n【作成指示】\n1. 各勘定への個別転記\n2. 諸口勘定の使用方法を説明\n3. 相手勘定が複数ある場合の処理\n4. 転記の正確性を確認",
    answer_template_json:
      '{"type":"ledger_account","account_name":"給料","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"25%"},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"仕入（借方） 300,000円","amount":300000},{"description":"支払手数料（借方） 5,000円","amount":5000},{"description":"現金（貸方） 100,000円","amount":100000},{"description":"買掛金（貸方） 200,000円","amount":200000},{"description":"未払金（貸方） 5,000円","amount":5000},{"description":"相手勘定：諸口","amount":0}]}}',
    explanation: "【諸口勘定を含む複合仕訳の転記のポイント】\n1. 複合仕訳は相手勘定が複数存在\n2. 元帳転記時は相手勘定欄に「諸口」と記入\n3. 各勘定への個別転記を正確に実施\n4. 貸借の一致を常に確認\n\n【諸口の使用】\n借方合計305,000円＝貸方合計305,000円\n各勘定の相手欄には「諸口」と記載",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_011",
    category_id: "ledger",
    question_text:
      "【現金出納帳記入問題】\n\n2025年6月の現金出納帳を作成してください。\n\n収入・支出・残高記入を含む詳細な記帳を行います。\n\n【前月繰越】\n333,931円\n\n【当月の取引】\n複数の収入・支出取引（詳細は問題文参照）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"6月1日 前月繰越 333,931円","amount":333931},{"description":"6月5日 売掛金回収 +125,500円","amount":125500},{"description":"6月8日 現金売上 +87,300円","amount":87300},{"description":"6月12日 仕入支払 -156,200円","amount":156200},{"description":"6月18日 給料支払 -95,000円","amount":95000},{"description":"6月25日 経費支払 -35,800円","amount":35800},{"description":"6月30日 次月繰越","amount":259731}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_012",
    category_id: "ledger",
    question_text:
      "【当座預金出納帳記入問題】\n\n2025年3月の当座預金出納帳を作成してください。\n\n預入・引出・残高管理を含む詳細な記帳を行います。\n\n【前月繰越】\n455,377円\n\n【当月の取引】\n複数の収入・支出取引（詳細は問題文参照）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"当座預金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"3月1日 前月繰越 455,377円","amount":455377},{"description":"3月3日 売上代金振込 +250,000円","amount":250000},{"description":"3月10日 小切手振出 -180,000円","amount":180000},{"description":"3月15日 手形取立 +95,000円","amount":95000},{"description":"3月20日 買掛金支払 -210,000円","amount":210000},{"description":"3月28日 経費引落 -45,000円","amount":45000},{"description":"3月31日 次月繰越","amount":365377}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_013",
    category_id: "ledger",
    question_text:
      "【小口現金出納帳記入問題】\n\n2025年4月の小口現金出納帳を作成してください。\n\n補給・支払・精算を含む詳細な記帳を行います。\n\n【前月繰越】\n100,326円\n\n【当月の取引】\n複数の収入・支出取引（詳細は問題文参照）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"小口現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"4月1日 前月繰越 100,326円","amount":100326},{"description":"4月5日 補給 +50,000円","amount":50000},{"description":"4月8日 交通費 -3,500円","amount":3500},{"description":"4月12日 消耗品費 -8,200円","amount":8200},{"description":"4月18日 通信費 -2,800円","amount":2800},{"description":"4月25日 雑費 -1,500円","amount":1500},{"description":"4月30日 補給 +16,000円（定額補充）","amount":16000},{"description":"4月30日 次月繰越","amount":150326}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_014",
    category_id: "ledger",
    question_text:
      "【普通預金通帳記入問題】\n\n2025年2月の普通預金通帳を作成してください。\n\n記帳・利息計算を含む詳細な記帳を行います。\n\n【前月繰越】\n408,537円\n\n【当月の取引】\n複数の収入・支出取引（詳細は問題文参照）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"普通預金通帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"2月1日 前月繰越 408,537円","amount":408537},{"description":"2月5日 定期預入 +100,000円","amount":100000},{"description":"2月10日 売上代金預入 +85,000円","amount":85000},{"description":"2月15日 経費支払 -120,000円","amount":120000},{"description":"2月20日 給料振込 -95,000円","amount":95000},{"description":"2月28日 利息 +63円","amount":63},{"description":"2月28日 次月繰越","amount":378600}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_015",
    category_id: "ledger",
    question_text:
      "【仕入帳記入問題】\n\n2025年9月の仕入帳を作成してください。\n\n日付・仕入先・品名・金額記入を行います。\n\n【記入項目】\n・日付\n・取引先/品名\n・数量・単価・金額\n・残高計算\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"仕入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"9月3日 A商店 商品A 100個×1,200円","amount":120000},{"description":"9月8日 B商店 商品B 80個×1,500円","amount":120000},{"description":"9月15日 C商店 商品A 120個×1,180円","amount":141600},{"description":"9月22日 A商店 商品C 50個×2,000円","amount":100000},{"description":"9月28日 D商店 商品B 60個×1,480円","amount":88800},{"description":"仕入合計","amount":570400}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_016",
    category_id: "ledger",
    question_text:
      "【売上帳記入問題】\n\n2025年2月の売上帳を作成してください。\n\n日付・得意先・品名・金額記入を行います。\n\n【記入項目】\n・日付\n・取引先/品名\n・数量・単価・金額\n・残高計算\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売上帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"2月2日 甲社 製品X 50個×3,000円","amount":150000},{"description":"2月8日 乙社 製品Y 30個×4,500円","amount":135000},{"description":"2月15日 丙社 製品X 40個×2,950円","amount":118000},{"description":"2月22日 甲社 製品Z 25個×5,000円","amount":125000},{"description":"2月28日 丁社 製品Y 35個×4,400円","amount":154000},{"description":"売上合計","amount":682000}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_017",
    category_id: "ledger",
    question_text:
      "【商品有高帳（先入先出法）記入問題】\n\n2025年10月の商品有高帳（先入先出法）を作成してください。\n\n単価・残高計算を行います。\n\n【記入項目】\n・日付\n・取引先/品名\n・数量・単価・金額\n・残高計算\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（先入先出法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"10月1日 前月繰越 100個@1,000円","amount":100000},{"description":"10月5日 仕入 150個@1,100円","amount":165000},{"description":"10月10日 売上 80個（先入先出法により@1,000円）","amount":80000},{"description":"10月18日 仕入 100個@1,050円","amount":105000},{"description":"10月25日 売上 120個（20個@1,000円+100個@1,100円）","amount":128000},{"description":"10月31日 期末在庫 150個（50個@1,100円+100個@1,050円）","amount":162000}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_018",
    category_id: "ledger",
    question_text:
      "【商品有高帳（移動平均法）記入問題】\n\n2025年6月の商品有高帳（移動平均法）を作成してください。\n\n単価・残高計算を行います。\n\n【記入項目】\n・日付\n・取引先/品名\n・数量・単価・金額\n・残高計算\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（移動平均法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"6月1日 前月繰越 200個@2,000円","amount":400000},{"description":"6月5日 仕入 300個@2,100円（平均単価@2,060円）","amount":630000},{"description":"6月10日 売上 150個@2,060円","amount":309000},{"description":"6月18日 仕入 200個@2,050円（平均単価@2,056円）","amount":410000},{"description":"6月25日 売上 250個@2,056円","amount":514000},{"description":"6月30日 期末在庫 300個@2,056円","amount":617000}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_019",
    category_id: "ledger",
    question_text:
      "【売掛金元帳・買掛金元帳記入問題】\n\n2025年2月の売掛金元帳・買掛金元帳を作成してください。\n\n残高管理を含む詳細な記帳を行います。\n\n【作成指示】\n1. 得意先別・仕入先別の管理\n2. 発生・回収・支払の記録\n3. 手形期日の管理\n4. 残高の確認と照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売掛金元帳・買掛金元帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"売掛金元帳 A社：期首250,000円→期末230,000円","amount":230000},{"description":"売掛金元帳 B社：期首180,000円→期末160,000円","amount":160000},{"description":"売掛金元帳 C社：期首95,000円→期末115,000円","amount":115000},{"description":"買掛金元帳 X商店：期首180,000円→期末170,000円","amount":170000},{"description":"買掛金元帳 Y商店：期首120,000円→期末130,000円","amount":130000},{"description":"買掛金元帳 Z商店：期首85,000円→期末90,000円","amount":90000}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_020",
    category_id: "ledger",
    question_text:
      "【受取手形記入帳・支払手形記入帳記入問題】\n\n2025年1月の受取手形記入帳・支払手形記入帳を作成してください。\n\n期日管理を含む詳細な記帳を行います。\n\n【作成指示】\n1. 得意先別・仕入先別の管理\n2. 発生・回収・支払の記録\n3. 手形期日の管理\n4. 残高の確認と照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"受取手形記入帳・支払手形記入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"text","width":"30%"},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"受取手形 甲社 150,000円（3/5期日）保有中","amount":150000},{"description":"受取手形 乙社 200,000円（3/12期日）割引済","amount":200000},{"description":"受取手形 丙社 180,000円（4/20期日）裏書済","amount":180000},{"description":"受取手形 丁社 250,000円（4/25期日）保有中","amount":250000},{"description":"支払手形 A商店 180,000円（3/8期日）","amount":180000},{"description":"支払手形 B商店 220,000円（3/15期日）","amount":220000},{"description":"支払手形 C商店 195,000円（4/28期日）","amount":195000},{"description":"偶発債務（割引・裏書分）","amount":380000}]}}',
    explanation: "売掛金元帳に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_021",
    category_id: "ledger",
    question_text:
      "【3伝票制：入金伝票による現金収入取引】\n\n2025年5月の取引を3伝票制により記録してください。\n\n【取引内容】\n27日：取引金額 627,660円\n20日：取引金額 386,900円\n1日：取引金額 319,066円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"入金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【入金伝票】5月1日 売掛金回収","amount":319066},{"description":"【入金伝票】5月20日 現金売上","amount":386900},{"description":"【入金伝票】5月27日 受取手形決済","amount":627660},{"description":"入金合計","amount":1333626}]}}',
    explanation: "【入金伝票記入のポイント】\n1. 現金が増加する取引を記録\n2. 貸方は「現金」、借方は相手勘定\n3. 複数の相手勘定は「諸口」と記載\n4. 仕訳日計表への転記\n\n【仕訳】\n(借)現金 1,333,626 / (貸)売掛金 319,066\n　　　　　　　　　　　　売上 386,900\n　　　　　　　　　　　　受取手形 627,660",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_022",
    category_id: "ledger",
    question_text:
      "【3伝票制：出金伝票による現金支出取引】\n\n2025年2月の取引を3伝票制により記録してください。\n\n【取引内容】\n24日：取引金額 682,448円\n15日：取引金額 572,665円\n8日：取引金額 666,219円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"入金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【出金伝票】2月8日 現金仕入","amount":666219},{"description":"【出金伝票】2月15日 買掛金支払","amount":572665},{"description":"【出金伝票】2月24日 諸経費支払","amount":682448},{"description":"出金合計","amount":1921332}]}}',
    explanation: "【出金伝票記入のポイント】\n1. 現金が減少する取引を記録\n2. 借方は「現金」、貸方は相手勘定\n3. 複数の相手勘定は「諸口」と記載\n4. 仕訳日計表への転記\n\n【仕訳】\n(借)仕入 666,219 / (貸)現金 1,921,332\n　　買掛金 572,665\n　　経費 682,448",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_023",
    category_id: "ledger",
    question_text:
      "【3伝票制：振替伝票による現金以外取引】\n\n2025年8月の取引を3伝票制により記録してください。\n\n【取引内容】\n3日：取引金額 301,530円\n7日：取引金額 280,539円\n12日：取引金額 406,302円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"出金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【振替伝票】8月3日 売掛金/売上（掛売上）","amount":301530},{"description":"【振替伝票】8月7日 仕入/買掛金（掛仕入）","amount":280539},{"description":"【振替伝票】8月12日 買掛金/支払手形（手形振出）","amount":406302},{"description":"振替合計","amount":988371}]}}',
    explanation: "【振替伝票記入のポイント】\n1. 現金が関わらない取引を記録\n2. 借方・貸方を明確に記載\n3. 貸借の一致を確認\n4. 総勘定元帳への転記\n\n【取引内容】\n・掛売上：売掛金/売上\n・掛仕入：仕入/買掛金\n・手形振出：買掛金/支払手形",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_024",
    category_id: "ledger",
    question_text:
      "【3伝票制：掛け取引の振替伝票記入】\n\n2025年9月の取引を3伝票制により記録してください。\n\n【取引内容】\n27日：取引金額 85,665円\n24日：取引金額 191,383円\n11日：取引金額 151,791円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"出金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【振替伝票】9月11日 仕入/買掛金（掛仕入）","amount":151791},{"description":"【振替伝票】9月24日 売掛金/売上（掛売上）","amount":191383},{"description":"【振替伝票】9月27日 買掛金/売掛金（相殺）","amount":85665},{"description":"振替合計","amount":428839}]}}',
    explanation: "【掛取引の振替伝票記入のポイント】\n1. 掛売上：売掛金（借）/売上（貸）\n2. 掛仕入：仕入（借）/買掛金（貸）\n3. 相殺：買掛金（借）/売掛金（貸）\n4. 貸借の一致を確認\n\n【注意点】\n・信用取引は振替伝票に記載\n・相殺取引も現金を介さない",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_025",
    category_id: "ledger",
    question_text:
      "【3伝票制：一部現金取引の伝票分割】\n\n2025年5月の取引を3伝票制により記録してください。\n\n【取引内容】\n13日：取引金額 252,840円\n27日：取引金額 235,649円\n28日：取引金額 248,951円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"5月13日 売上252,840円（現金150,000円＋掛け102,840円）","amount":252840},{"description":"【入金伝票】現金部分","amount":150000},{"description":"【振替伝票】掛け部分","amount":102840},{"description":"5月27日 仕入235,649円（現金100,000円＋掛け135,649円）","amount":235649},{"description":"5月28日 売上248,951円（現金180,000円＋掛け68,951円）","amount":248951}]}}',
    explanation: "【一部現金取引の伝票分割のポイント】\n1. 現金部分→入金/出金伝票\n2. 掛け部分→振替伝票\n3. 取引を2枚の伝票に分割\n4. 合計額の一致を確認\n\n【分割方法】\n取引総額＝現金部分＋掛け部分\n例：売上252,840円＝現金150,000円＋掛け102,840円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_026",
    category_id: "ledger",
    question_text:
      "【3伝票制：3伝票から仕訳日計表への集計】\n\n2025年11月の取引を3伝票制により記録してください。\n\n【取引内容】\n28日：取引金額 159,981円\n12日：取引金額 300,530円\n4日：取引金額 125,950円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理\n4. 伝票から帳簿への転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【入金伝票集計】現金収入","amount":450000},{"description":"【出金伝票集計】現金支出","amount":380000},{"description":"【振替伝票】仕入/買掛金","amount":159981},{"description":"【振替伝票】売掛金/売上","amount":300530},{"description":"【振替伝票】買掛金/支払手形","amount":125950},{"description":"仕訳日計表 借方・貸方合計","amount":1416461}]}}',
    explanation: "【3伝票から仕訳日計表への集計のポイント】\n1. 入金伝票の合計を集計\n2. 出金伝票の合計を集計\n3. 振替伝票の内容を転記\n4. 仕訳日計表で貸借一致を確認\n\n【集計手順】\n・各伝票の日付別集計\n・勘定科目別の合計\n・総勘定元帳への転記準備",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_027",
    category_id: "ledger",
    question_text:
      "【5伝票制：売上伝票による売上取引専用記録】\n\n2025年11月の取引を5伝票制により記録してください。\n\n【取引内容】\n22日：取引金額 526,373円\n7日：取引金額 705,035円\n18日：取引金額 296,150円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"仕訳伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【売上伝票】11月7日 A社 掛売上","amount":705035},{"description":"【売上伝票】11月18日 B社 現金売上","amount":296150},{"description":"【売上伝票】11月22日 C社 掛売上","amount":526373},{"description":"売上合計（現金296,150円＋掛け1,231,408円）","amount":1527558}]}}',
    explanation: "【5伝票制の売上伝票記入のポイント】\n1. 売上取引専用の伝票を使用\n2. 現金売上と掛売上を区別\n3. 得意先別に記録\n4. 売上勘定への一括転記\n\n【5伝票制の特徴】\n・売上伝票（売上専用）\n・仕入伝票（仕入専用）\n・入金、出金、振替伝票",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_028",
    category_id: "ledger",
    question_text:
      "【5伝票制：仕入伝票による仕入取引専用記録】\n\n2025年4月の取引を5伝票制により記録してください。\n\n【取引内容】\n17日：取引金額 178,273円\n11日：取引金額 197,758円\n28日：取引金額 155,282円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"仕訳伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【仕入伝票】4月11日 X商店 掛仕入","amount":197758},{"description":"【仕入伝票】4月17日 Y商店 現金仕入","amount":178273},{"description":"【仕入伝票】4月28日 Z商店 掛仕入","amount":155282},{"description":"仕入合計（現金178,273円＋掛け353,040円）","amount":531313}]}}',
    explanation: "【5伝票制の仕入伝票記入のポイント】\n1. 仕入取引専用の伝票を使用\n2. 現金仕入と掛仕入を区別\n3. 仕入先別に記録\n4. 仕入勘定への一括転記\n\n【仕入伝票の活用】\n・仕入取引の効率的記録\n・仕入先管理の容易化\n・仕入統計の作成",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_029",
    category_id: "ledger",
    question_text:
      "【5伝票制：5伝票制での取引分類・適用判定】\n\n2025年4月の取引を5伝票制により記録してください。\n\n【取引内容】\n25日：取引金額 611,082円\n25日：取引金額 739,173円\n8日：取引金額 436,244円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"4月8日 商品売上436,244円→【売上伝票】","amount":436244},{"description":"4月25日 商品仕入611,082円→【仕入伝票】","amount":611082},{"description":"4月25日 売掛金回収739,173円→【入金伝票】","amount":739173},{"description":"5伝票制：売上・仕入は専用伝票、現金収支は入金・出金伝票","amount":0}]}}',
    explanation: "【5伝票制での取引分類のポイント】\n1. 売上→売上伝票（支払方法問わず）\n2. 仕入→仕入伝票（支払方法問わず）\n3. その他現金収入→入金伝票\n4. その他現金支出→出金伝票\n5. 現金以外→振替伝票\n\n【判定の優先順位】\n取引内容（売上・仕入）＞支払方法",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_030",
    category_id: "ledger",
    question_text:
      "【5伝票制：5伝票から総勘定元帳への転記】\n\n2025年8月の取引を5伝票制により記録してください。\n\n【取引内容】\n8日：取引金額 605,681円\n8日：取引金額 700,622円\n4日：取引金額 764,578円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"ledgerEntry":{"entries":[{"description":"【売上伝票】8月8日","amount":605681},{"description":"【仕入伝票】8月8日","amount":700622},{"description":"【振替伝票】8月4日","amount":764578},{"description":"総勘定元帳への転記 借方合計","amount":1306303},{"description":"総勘定元帳への転記 貸方合計","amount":1306303}]}}',
    explanation: "【5伝票から総勘定元帳への転記のポイント】\n1. 各伝票の合計を集計\n2. 勘定科目別に転記\n3. 売上・仕入伝票は一括転記\n4. 貸借の一致を確認\n\n【転記の流れ】\n伝票→仕訳日計表→総勘定元帳\n・正確性の確保\n・効率的な記帳",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_031",
    category_id: "ledger",
    question_text:
      "【理論問題：簿記の基本原理と記帳体系】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n簿記は（ア）簿記の原理に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。\nこの方法により、常に（エ）が保たれ、記録の正確性を検証できる。\n\n【選択肢】\nA. 複式\nB. 借方\nC. 貸方\nD. 貸借平均の原理\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"複式","b":"借方","c":"貸方","d":"貸借平均の原理"}}',
    explanation: "【複式簿記の基本原理】\n1. 複式簿記：すべての取引を二面的に記録\n2. 借方と貸方：左側（借方）と右側（貸方）への記入\n3. 貸借平均の原理：借方合計＝貸方合計\n4. 記録の検証可能性を確保\n\n【重要性】\n複式簿記により、財産状態と経営成績を同時に把握可能",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_032",
    category_id: "ledger",
    question_text:
      "【理論問題：仕訳の原則と借方・貸方の理解】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n資産の増加は（ア）に、負債の増加は（イ）に記入する。\n収益の発生は（ウ）に、費用の発生は（エ）に記入する。\n\n【選択肢】\nA. 借方\nB. 貸方\nC. 借方\nD. 貸方\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"D","d":"C"},"correctText":{"a":"借方","b":"貸方","c":"貸方","d":"借方"}}',
    explanation: "【仕訳の原則】\n1. 資産の増加→借方（左）\n2. 負債の増加→貸方（右）\n3. 純資産の増加→貸方（右）\n4. 収益の発生→貸方（右）\n5. 費用の発生→借方（左）\n\n【覚え方】\n「資産・費用は借方」「負債・純資産・収益は貸方」",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_033",
    category_id: "ledger",
    question_text:
      "【理論問題：帳簿組織と補助簿の役割】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n（ア）は、すべての取引を仕訳帳に記入し、（イ）に転記する主要簿である。\n一方、（ウ）や（エ）などの補助簿は、特定の取引を詳細に記録する。\n\n【選択肢】\nA. 仕訳帳\nB. 総勘定元帳\nC. 現金出納帳\nD. 売掛金元帳\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"仕訳帳","b":"総勘定元帳","c":"現金出納帳","d":"売掛金元帳"}}',
    explanation: "【帳簿組織の体系】\n1. 主要簿：仕訳帳・総勘定元帳\n2. 補助簿：補助記入帳・補助元帳\n3. 補助記入帳：現金出納帳、売上帳、仕入帳等\n4. 補助元帳：売掛金元帳、買掛金元帳等\n\n【役割分担】\n主要簿で全体を把握、補助簿で詳細を管理",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_034",
    category_id: "ledger",
    question_text:
      "【理論問題：伝票制度の種類と特徴】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n3伝票制では、（ア）伝票、（イ）伝票、振替伝票の3種類を使用する。\n5伝票制では、さらに（ウ）伝票と（エ）伝票が追加される。\n\n【選択肢】\nA. 入金\nB. 出金\nC. 売上\nD. 仕入\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"入金","b":"出金","c":"売上","d":"仕入"}}',
    explanation: "【伝票制度の比較】\n■3伝票制\n・入金伝票：現金収入\n・出金伝票：現金支出\n・振替伝票：現金以外\n\n■5伝票制\n・上記3種類＋売上伝票＋仕入伝票\n・売上と仕入を専用伝票で効率化",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_035",
    category_id: "ledger",
    question_text:
      "【理論問題：試算表の種類と作成目的】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n（ア）試算表は借方合計と貸方合計を表示し、（イ）試算表は借方残高と貸方残高を表示する。\n（ウ）試算表は両者を組み合わせたもので、最も情報量が多い。\n試算表の主な目的は（エ）の検証である。\n\n【選択肢】\nA. 合計\nB. 残高\nC. 合計残高\nD. 転記の正確性\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"合計","b":"残高","c":"合計残高","d":"転記の正確性"}}',
    explanation: "【試算表の種類と特徴】\n1. 合計試算表：各勘定の借方・貸方合計を表示\n2. 残高試算表：各勘定の残高のみ表示\n3. 合計残高試算表：合計と残高の両方を表示\n\n【作成目的】\n・転記の正確性検証\n・貸借平均の確認\n・財務諸表作成の準備",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_036",
    category_id: "ledger",
    question_text:
      "【理論問題：決算整理の意義と手続き】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n決算整理では、（ア）の原則に従い収益と費用を適切な期間に配分する。\n（イ）は次期に繰り越す商品の金額を、（ウ）は使用により価値が減少した固定資産の金額を調整する。\n（エ）は回収不能と見込まれる債権に対して設定する。\n\n【選択肢】\nA. 発生主義\nB. 棚卸\nC. 減価償却\nD. 貸倒引当金\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"発生主義","b":"棚卸","c":"減価償却","d":"貸倒引当金"}}',
    explanation: "【主要な決算整理事項】\n1. 発生主義の適用：収益・費用の期間配分\n2. 商品棚卸：期末商品の評価\n3. 減価償却：固定資産の価値減少\n4. 貸倒引当金：債権の回収リスク評価\n5. 経過勘定：前払・未払・前受・未収の調整",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_037",
    category_id: "ledger",
    question_text:
      "【理論問題：財務諸表の構成要素】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n貸借対照表は（ア）、負債、純資産から構成され、企業の財政状態を表す。\n損益計算書は（イ）から（ウ）を差し引いて当期純利益を算定する。\n（エ）は期中の純資産の変動を示す計算書である。\n\n【選択肢】\nA. 資産\nB. 収益\nC. 費用\nD. 株主資本等変動計算書\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"収益","c":"費用","d":"株主資本等変動計算書"}}',
    explanation: "【財務諸表の体系】\n■貸借対照表（B/S）\n・資産＝負債＋純資産\n・財政状態を表示\n\n■損益計算書（P/L）\n・収益－費用＝当期純利益\n・経営成績を表示\n\n■株主資本等変動計算書\n・純資産の変動内容を詳細表示",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_038",
    category_id: "ledger",
    question_text:
      "【理論問題：勘定科目の分類と体系】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n勘定科目は大きく5つに分類される。\n貸借対照表項目は（ア）、（イ）、純資産の3つ、\n損益計算書項目は（ウ）と（エ）の2つである。\n\n【選択肢】\nA. 資産\nB. 負債\nC. 収益\nD. 費用\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"負債","c":"収益","d":"費用"}}',
    explanation: "【勘定科目の5分類】\n■貸借対照表項目\n1. 資産：現金、売掛金、建物等\n2. 負債：買掛金、借入金等\n3. 純資産：資本金、利益剰余金等\n\n■損益計算書項目\n4. 収益：売上、受取利息等\n5. 費用：仕入、給料、減価償却費等",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_039",
    category_id: "ledger",
    question_text:
      "【理論問題：簿記上の取引の定義】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n簿記上の取引とは、企業の（ア）に増減をもたらす事象をいう。\n契約の締結は簿記上の取引に（イ）。\n火災による商品の焼失は簿記上の取引に（ウ）。\n簿記上の取引は必ず（エ）の原因となる。\n\n【選択肢】\nA. 資産・負債・純資産\nB. 該当しない\nC. 該当する\nD. 仕訳\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産・負債・純資産","b":"該当しない","c":"該当する","d":"仕訳"}}',
    explanation: "【簿記上の取引の要件】\n1. 資産・負債・純資産の増減が発生\n2. 金額で測定可能\n3. 企業の経済活動に関連\n\n【判定例】\n・商品売買→取引（○）\n・契約締結のみ→取引（×）\n・火災損失→取引（○）\n・商談→取引（×）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_040",
    category_id: "ledger",
    question_text:
      "【理論問題：複式簿記の特徴と利点】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n複式簿記の最大の特徴は、（ア）と（イ）を同時に把握できることである。\nまた、（ウ）により記録の正確性を自己検証でき、\n（エ）の作成により利害関係者への情報提供が可能となる。\n\n【選択肢】\nA. 財政状態\nB. 経営成績\nC. 貸借平均の原理\nD. 財務諸表\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"財政状態","b":"経営成績","c":"貸借平均の原理","d":"財務諸表"}}',
    explanation: "【複式簿記の利点】\n1. 財政状態の把握：貸借対照表で資産・負債・純資産を表示\n2. 経営成績の把握：損益計算書で収益・費用・利益を表示\n3. 自己検証機能：貸借平均により誤りを発見\n4. 情報提供機能：財務諸表により利害関係者へ報告\n\n【単式簿記との違い】\n単式簿記は現金の収支のみ記録、複式簿記は全取引を二面的に記録",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_001",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\\n\\n2025年9月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首貸借対照表（2025年9月1日）】\\n現金：500,000円\\n建物：2,000,000円\\n土地：1,500,000円\\n資本金：4,000,000円\\n\\n【期中取引】\\n9月2日 前払金 867,000 / 現金 867,000 （前払金支払）\\n9月4日 水道光熱費 833,000 / 現金 833,000 （水道光熱費支払）\\n9月4日 現金 256,000 / 資本金 256,000 （資本金受入）\\n9月9日 消耗品費 384,000 / 現金 384,000 （消耗品購入）\\n9月9日 借入金 447,000 / 現金 447,000 （借入金返済）\\n9月10日 仕入 851,000 / 買掛金 851,000 （商品仕入）\\n9月15日 借入金 105,000 / 現金 105,000 （借入金返済）\\n9月17日 現金 167,000 / 売上 167,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：貸倒引当金繰入 934,000 / 貸倒引当金 934,000\\n・減価償却：減価償却費 331,000 / 減価償却累計額 331,000\\n・前払費用計上：前払費用 709,000 / 保険料 709,000\\n\\n【作成指示】\\n1. 上記取引を仕訳する\\n2. 決算整理仕訳を行う\\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"前払金","debitAmount":867000,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":2213000},{"accountName":"水道光熱費","debitAmount":833000,"creditAmount":0},{"accountName":"資本金","debitAmount":0,"creditAmount":256000},{"accountName":"消耗品費","debitAmount":384000,"creditAmount":0},{"accountName":"借入金","debitAmount":552000,"creditAmount":0},{"accountName":"仕入","debitAmount":851000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":851000},{"accountName":"売上","debitAmount":0,"creditAmount":167000},{"accountName":"・貸倒引当金設定：貸倒引当金繰入","debitAmount":934000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":934000},{"accountName":"・減価償却：減価償却費","debitAmount":331000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":331000},{"accountName":"・前払費用計上：前払費用","debitAmount":709000,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":709000}]}',
    explanation: "財務諸表作成に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_002",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\\n\\n2025年10月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期中取引】\\n10月1日 現金 757,000 / 資本金 757,000 （資本金受入）\\n10月4日 前払金 353,000 / 現金 353,000 （前払金支払）\\n10月5日 現金 624,000 / 前受金 624,000 （前受金受取）\\n10月8日 仕入 970,000 / 買掛金 970,000 （商品仕入）\\n10月12日 水道光熱費 229,000 / 現金 229,000 （水道光熱費支払）\\n10月23日 売掛金 941,000 / 売上 941,000 （掛売上）\\n10月27日 現金 857,000 / 売掛金 857,000 （売掛金回収）\\n10月27日 商品 806,000 / 買掛金 806,000 （商品仕入）\\n\\n【決算整理事項】\\n・貸倒引当金設定：貸倒引当金繰入 590,000 / 貸倒引当金 590,000\\n・減価償却：減価償却費 386,000 / 減価償却累計額 386,000\\n\\n【作成指示】\\n1. 上記取引を仕訳する\\n2. 決算整理仕訳を行う\\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":1656000,"creditAmount":0},{"accountName":"資本金","debitAmount":0,"creditAmount":757000},{"accountName":"前払金","debitAmount":353000,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":624000},{"accountName":"仕入","debitAmount":970000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":1776000},{"accountName":"水道光熱費","debitAmount":229000,"creditAmount":0},{"accountName":"売掛金","debitAmount":84000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":941000},{"accountName":"商品","debitAmount":806000,"creditAmount":0},{"accountName":"・貸倒引当金設定：貸倒引当金繰入","debitAmount":590000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":590000},{"accountName":"・減価償却：減価償却費","debitAmount":386000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":386000}]}',
    explanation: "財務諸表作成に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_003",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\\n\\n2025年12月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期中取引】\\n12月16日 水道光熱費 517,000 / 現金 517,000 （水道光熱費支払）\\n12月17日 旅費交通費 847,000 / 現金 847,000 （交通費支払）\\n12月19日 広告宣伝費 631,000 / 現金 631,000 （広告費支払）\\n12月20日 消耗品費 399,000 / 現金 399,000 （消耗品購入）\\n12月20日 水道光熱費 832,000 / 現金 832,000 （水道光熱費支払）\\n12月22日 仕入 140,000 / 買掛金 140,000 （商品仕入）\\n12月22日 広告宣伝費 836,000 / 現金 836,000 （広告費支払）\\n12月27日 広告宣伝費 189,000 / 現金 189,000 （広告費支払）\\n\\n【決算整理事項】\\n・貸倒引当金設定：貸倒引当金繰入 185,000 / 貸倒引当金 185,000\\n・減価償却：減価償却費 426,000 / 減価償却累計額 426,000\\n・前払費用計上：前払費用 341,000 / 保険料 341,000\\n\\n【作成指示】\\n1. 上記取引を仕訳する\\n2. 決算整理仕訳を行う\\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"水道光熱費","debitAmount":1349000,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":4251000},{"accountName":"旅費交通費","debitAmount":847000,"creditAmount":0},{"accountName":"広告宣伝費","debitAmount":1656000,"creditAmount":0},{"accountName":"消耗品費","debitAmount":399000,"creditAmount":0},{"accountName":"仕入","debitAmount":140000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":140000},{"accountName":"・貸倒引当金設定：貸倒引当金繰入","debitAmount":185000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":185000},{"accountName":"・減価償却：減価償却費","debitAmount":426000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":426000},{"accountName":"・前払費用計上：前払費用","debitAmount":341000,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":341000}]}',
    explanation: "財務諸表作成に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_004",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\\n\\n2025年9月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期中取引】\\n9月9日 前払金 674,000 / 現金 674,000 （前払金支払）\\n9月10日 商品 245,000 / 買掛金 245,000 （商品仕入）\\n9月21日 借入金 798,000 / 現金 798,000 （借入金返済）\\n9月21日 給料 786,000 / 現金 786,000 （給料支払）\\n9月22日 水道光熱費 917,000 / 現金 917,000 （水道光熱費支払）\\n9月23日 仕入 645,000 / 買掛金 645,000 （商品仕入）\\n9月27日 現金 214,000 / 資本金 214,000 （資本金受入）\\n9月28日 現金 372,000 / 前受金 372,000 （前受金受取）\\n\\n【決算整理事項】\\n・貸倒引当金設定：貸倒引当金繰入 630,000 / 貸倒引当金 630,000\\n・減価償却：減価償却費 818,000 / 減価償却累計額 818,000\\n・前払費用計上：前払費用 104,000 / 保険料 104,000\\n\\n【作成指示】\\n1. 上記取引を仕訳する\\n2. 決算整理仕訳を行う\\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"前払金","debitAmount":674000,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":2589000},{"accountName":"商品","debitAmount":245000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":890000},{"accountName":"借入金","debitAmount":798000,"creditAmount":0},{"accountName":"給料","debitAmount":786000,"creditAmount":0},{"accountName":"水道光熱費","debitAmount":917000,"creditAmount":0},{"accountName":"仕入","debitAmount":645000,"creditAmount":0},{"accountName":"資本金","debitAmount":0,"creditAmount":214000},{"accountName":"前受金","debitAmount":0,"creditAmount":372000},{"accountName":"・貸倒引当金設定：貸倒引当金繰入","debitAmount":630000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":630000},{"accountName":"・減価償却：減価償却費","debitAmount":818000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":818000},{"accountName":"・前払費用計上：前払費用","debitAmount":104000,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":104000}]}',
    explanation: "財務諸表作成に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_005",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\\n\\n2025年1月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\\n\\n【決算整理前試算表】\\n現金（借方）：213,000円\\n小口現金（貸方）：311,000円\\n当座預金（貸方）：399,000円\\n普通預金（貸方）：471,000円\\n受取手形（貸方）：697,000円\\n売掛金（借方）：528,000円\\n商品（借方）：369,000円\\n繰越商品（貸方）：433,000円\\n仕入（借方）：324,000円\\n売上（貸方）：156,000円\\n支払手形（貸方）：149,000円\\n買掛金（貸方）：759,000円\\n\\n【決算整理事項】\\n・貸倒引当金設定：935,000円\\n・減価償却：268,000円\\n\\n【作成指示】\\n1. 決算整理前試算表の残高を転記\\n2. 決算整理仕訳を記入\\n3. 決算整理後試算表を作成\\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":213000,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":311000},{"accountName":"当座預金","debitAmount":0,"creditAmount":399000},{"accountName":"普通預金","debitAmount":0,"creditAmount":471000},{"accountName":"受取手形","debitAmount":0,"creditAmount":697000},{"accountName":"売掛金","debitAmount":528000,"creditAmount":0},{"accountName":"商品","debitAmount":369000,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":433000},{"accountName":"仕入","debitAmount":324000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":156000},{"accountName":"支払手形","debitAmount":0,"creditAmount":149000},{"accountName":"買掛金","debitAmount":0,"creditAmount":759000},{"accountName":"貸倒引当金繰入","debitAmount":935000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":935000},{"accountName":"減価償却費","debitAmount":268000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":268000},{"accountName":"調整勘定","debitAmount":1941000,"creditAmount":0}]}',
    explanation: "精算表作成に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_006",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\\n\\n2025年5月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\\n\\n【決算整理前試算表】\\n現金（借方）：680,000円\\n小口現金（貸方）：423,000円\\n当座預金（貸方）：854,000円\\n普通預金（貸方）：344,000円\\n受取手形（貸方）：382,000円\\n売掛金（借方）：943,000円\\n商品（借方）：953,000円\\n繰越商品（貸方）：447,000円\\n仕入（借方）：241,000円\\n売上（貸方）：933,000円\\n支払手形（貸方）：488,000円\\n買掛金（貸方）：565,000円\\n\\n【決算整理事項】\\n・貸倒引当金設定：728,000円\\n・減価償却：536,000円\\n・前払費用計上：875,000円\\n\\n【作成指示】\\n1. 決算整理前試算表の残高を転記\\n2. 決算整理仕訳を記入\\n3. 決算整理後試算表を作成\\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":680000,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":423000},{"accountName":"当座預金","debitAmount":0,"creditAmount":854000},{"accountName":"普通預金","debitAmount":0,"creditAmount":344000},{"accountName":"受取手形","debitAmount":0,"creditAmount":382000},{"accountName":"売掛金","debitAmount":943000,"creditAmount":0},{"accountName":"商品","debitAmount":953000,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":447000},{"accountName":"仕入","debitAmount":241000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":933000},{"accountName":"支払手形","debitAmount":0,"creditAmount":488000},{"accountName":"買掛金","debitAmount":0,"creditAmount":565000},{"accountName":"貸倒引当金繰入","debitAmount":728000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":728000},{"accountName":"減価償却費","debitAmount":536000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":536000},{"accountName":"調整勘定","debitAmount":1619000,"creditAmount":0}]}',
    explanation: "精算表作成に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_007",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\\n\\n2025年9月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\\n\\n【決算整理前試算表】\\n現金（借方）：992,000円\\n小口現金（貸方）：488,000円\\n当座預金（貸方）：242,000円\\n普通預金（貸方）：979,000円\\n受取手形（貸方）：854,000円\\n売掛金（借方）：841,000円\\n商品（借方）：594,000円\\n繰越商品（貸方）：960,000円\\n仕入（借方）：650,000円\\n売上（貸方）：363,000円\\n支払手形（貸方）：540,000円\\n買掛金（貸方）：679,000円\\n\\n【決算整理事項】\\n・貸倒引当金設定：947,000円\\n・減価償却：744,000円\\n・前払費用計上：153,000円\\n\\n【作成指示】\\n1. 決算整理前試算表の残高を転記\\n2. 決算整理仕訳を記入\\n3. 決算整理後試算表を作成\\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":992000,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":488000},{"accountName":"当座預金","debitAmount":0,"creditAmount":242000},{"accountName":"普通預金","debitAmount":0,"creditAmount":979000},{"accountName":"受取手形","debitAmount":0,"creditAmount":854000},{"accountName":"売掛金","debitAmount":841000,"creditAmount":0},{"accountName":"商品","debitAmount":594000,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":960000},{"accountName":"仕入","debitAmount":650000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":363000},{"accountName":"支払手形","debitAmount":0,"creditAmount":540000},{"accountName":"買掛金","debitAmount":0,"creditAmount":679000},{"accountName":"貸倒引当金繰入","debitAmount":947000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":947000},{"accountName":"減価償却費","debitAmount":744000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":744000},{"accountName":"調整勘定","debitAmount":2028000,"creditAmount":0}]}',
    explanation: "精算表作成に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_008",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\\n\\n2025年11月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\\n\\n【決算整理前試算表】\\n現金（借方）：863,000円\\n小口現金（貸方）：875,000円\\n当座預金（貸方）：508,000円\\n普通預金（貸方）：488,000円\\n受取手形（貸方）：310,000円\\n売掛金（借方）：797,000円\\n商品（借方）：977,000円\\n繰越商品（貸方）：328,000円\\n仕入（借方）：636,000円\\n売上（貸方）：624,000円\\n支払手形（貸方）：741,000円\\n買掛金（貸方）：972,000円\\n\\n【決算整理事項】\\n・貸倒引当金設定：693,000円\\n・減価償却：178,000円\\n・前払費用計上：263,000円\\n\\n【作成指示】\\n1. 決算整理前試算表の残高を転記\\n2. 決算整理仕訳を記入\\n3. 決算整理後試算表を作成\\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":863000,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":875000},{"accountName":"当座預金","debitAmount":0,"creditAmount":508000},{"accountName":"普通預金","debitAmount":0,"creditAmount":488000},{"accountName":"受取手形","debitAmount":0,"creditAmount":310000},{"accountName":"売掛金","debitAmount":797000,"creditAmount":0},{"accountName":"商品","debitAmount":977000,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":328000},{"accountName":"仕入","debitAmount":636000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":624000},{"accountName":"支払手形","debitAmount":0,"creditAmount":741000},{"accountName":"買掛金","debitAmount":0,"creditAmount":972000},{"accountName":"貸倒引当金繰入","debitAmount":693000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":693000},{"accountName":"減価償却費","debitAmount":178000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":178000},{"accountName":"調整勘定","debitAmount":1573000,"creditAmount":0}]}',
    explanation: "精算表作成に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_009",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2025年2月の期首残高と期中取引から、2月末の合計試算表を作成してください。\n\n【期首残高】\n現金：525,000円（借方残高）\n商品：151,000円（借方残高）\n売掛金：473,000円（借方残高）\n買掛金：798,000円（貸方残高）\n資本金：796,000円（貸方残高）\n\n【期中取引】\n2月1日 現金 414,000 / 借入金 414,000 （借入）\n2月2日 給料 784,000 / 現金 784,000 （給料支払）\n2月6日 売掛金 591,000 / 売上 591,000 （掛売上）\n2月7日 仕入 923,000 / 買掛金 923,000 （商品仕入）\n2月10日 前払金 274,000 / 現金 274,000 （前払金支払）\n2月12日 買掛金 461,000 / 現金 461,000 （買掛金支払）\n2月13日 現金 405,000 / 売上 405,000 （商品売上）\n2月21日 水道光熱費 196,000 / 現金 196,000 （水道光熱費支払）\n2月27日 借入金 663,000 / 現金 663,000 （借入金返済）\n2月27日 現金 705,000 / 前受金 705,000 （前受金受取）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":0,"creditAmount":854000},{"accountName":"借入金","debitAmount":249000,"creditAmount":0},{"accountName":"給料","debitAmount":784000,"creditAmount":0},{"accountName":"売掛金","debitAmount":591000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":996000},{"accountName":"仕入","debitAmount":923000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":462000},{"accountName":"前払金","debitAmount":274000,"creditAmount":0},{"accountName":"水道光熱費","debitAmount":196000,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":705000}]}',
    explanation: "合計試算表に関する問題です。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_010",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2025年2月の期首残高と期中取引から、2月末の合計試算表を作成してください。\n\n【期首残高】\n現金：192,000円（借方残高）\n商品：283,000円（借方残高）\n売掛金：727,000円（借方残高）\n買掛金：318,000円（貸方残高）\n資本金：476,000円（貸方残高）\n\n【期中取引】\n2月1日 現金 504,000 / 売上 504,000 （商品売上）\n2月2日 仕入 983,000 / 買掛金 983,000 （商品仕入）\n2月5日 現金 744,000 / 借入金 744,000 （借入）\n2月16日 現金 445,000 / 売掛金 445,000 （売掛金回収）\n2月17日 通信費 628,000 / 現金 628,000 （通信費支払）\n2月22日 消耗品費 624,000 / 現金 624,000 （消耗品購入）\n2月24日 仕入 946,000 / 買掛金 946,000 （商品仕入）\n2月25日 広告宣伝費 933,000 / 現金 933,000 （広告費支払）\n2月26日 現金 756,000 / 借入金 756,000 （借入）\n2月28日 借入金 932,000 / 現金 932,000 （借入金返済）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":0,"creditAmount":668000},{"accountName":"売上","debitAmount":0,"creditAmount":504000},{"accountName":"仕入","debitAmount":1929000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":1929000},{"accountName":"借入金","debitAmount":0,"creditAmount":568000},{"accountName":"売掛金","debitAmount":0,"creditAmount":445000},{"accountName":"通信費","debitAmount":628000,"creditAmount":0},{"accountName":"消耗品費","debitAmount":624000,"creditAmount":0},{"accountName":"広告宣伝費","debitAmount":933000,"creditAmount":0}]}',
    explanation: "合計試算表に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_011",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2025年4月の期首残高と期中取引から、4月末の合計試算表を作成してください。\n\n【期首残高】\n現金：667,000円（借方残高）\n商品：282,000円（借方残高）\n売掛金：201,000円（借方残高）\n買掛金：624,000円（貸方残高）\n資本金：264,000円（貸方残高）\n\n【期中取引】\n4月9日 前払金 772,000 / 現金 772,000 （前払金支払）\n4月10日 買掛金 809,000 / 現金 809,000 （買掛金支払）\n4月10日 通信費 176,000 / 現金 176,000 （通信費支払）\n4月18日 現金 383,000 / 前受金 383,000 （前受金受取）\n4月18日 旅費交通費 401,000 / 現金 401,000 （交通費支払）\n4月21日 売掛金 593,000 / 売上 593,000 （掛売上）\n4月22日 消耗品費 580,000 / 現金 580,000 （消耗品購入）\n4月24日 消耗品費 763,000 / 現金 763,000 （消耗品購入）\n4月27日 通信費 567,000 / 現金 567,000 （通信費支払）\n4月27日 現金 143,000 / 売上 143,000 （商品売上）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"前払金","debitAmount":772000,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":3542000},{"accountName":"買掛金","debitAmount":809000,"creditAmount":0},{"accountName":"通信費","debitAmount":743000,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":383000},{"accountName":"旅費交通費","debitAmount":401000,"creditAmount":0},{"accountName":"売掛金","debitAmount":593000,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":736000},{"accountName":"消耗品費","debitAmount":1343000,"creditAmount":0}]}',
    explanation: "合計試算表に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_T_012",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2025年1月の期首残高と期中取引から、1月末の合計試算表を作成してください。\n\n【期首残高】\n現金：707,000円（借方残高）\n商品：429,000円（借方残高）\n売掛金：167,000円（借方残高）\n買掛金：931,000円（貸方残高）\n資本金：919,000円（貸方残高）\n\n【期中取引】\n1月3日 水道光熱費 619,000 / 現金 619,000 （水道光熱費支払）\n1月3日 給料 661,000 / 現金 661,000 （給料支払）\n1月7日 商品 177,000 / 買掛金 177,000 （商品仕入）\n1月11日 消耗品費 392,000 / 現金 392,000 （消耗品購入）\n1月13日 現金 950,000 / 売掛金 950,000 （売掛金回収）\n1月14日 借入金 875,000 / 現金 875,000 （借入金返済）\n1月22日 借入金 754,000 / 現金 754,000 （借入金返済）\n1月24日 家賃 493,000 / 現金 493,000 （家賃支払）\n1月24日 給料 747,000 / 現金 747,000 （給料支払）\n1月25日 現金 637,000 / 売掛金 637,000 （売掛金回収）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"水道光熱費","debitAmount":619000,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":2954000},{"accountName":"給料","debitAmount":1408000,"creditAmount":0},{"accountName":"商品","debitAmount":177000,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":177000},{"accountName":"消耗品費","debitAmount":392000,"creditAmount":0},{"accountName":"売掛金","debitAmount":0,"creditAmount":1587000},{"accountName":"借入金","debitAmount":1629000,"creditAmount":0},{"accountName":"家賃","debitAmount":493000,"creditAmount":0}]}',
    explanation: "合計試算表に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
];

export const questionStatistics = {
  totalQuestions: 302,
  byCategory: {
    journal: 250,
    ledger: 40,
    trial_balance: 12,
  },
  byDifficulty: {
    "1": 104,
    "2": 122,
    "3": 76,
    "4": 0,
    "5": 0,
  },
};
