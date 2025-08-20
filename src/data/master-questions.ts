import { Question } from "../types/models";

export const masterQuestions: Question[] = [
  {
    id: "Q_J_001",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が帳簿残高より200円不足していた。原因は不明である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"現金過不足","debit_amount":200,"credit_account":"現金","credit_amount":200}}',
    explanation:
      "原因不明の現金過不足は一時的に「現金過不足」勘定で処理し、決算時に原因を調査して適切な勘定に振り替える。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"現金過不足\",\"accounts\":[\"現金\",\"現金過不足\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"現金過不足\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.366Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_001",
    category_id: "ledger",
    question_text:
      "【現金勘定記入問題】\n\n10月の現金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n現金：350円\n\n【10月の取引】\n10/5 現金売上：300円（増加）\n10/10 給料支払：200円（減少）\n10/15 売掛金回収：200円（増加）\n10/20 買掛金支払：250円（減少）\n10/28 現金実査による過不足判明：10円（不足）\n\n【現金過不足の処理】\n月末に現金実査を行い、過不足を確認して適切に処理してください。\n\n【作成指示】\n1. 現金勘定へ各取引を記入\n2. 借方・貸方の合計を計算\n3. 月末残高を算出\n4. 現金過不足がある場合は適切に処理",
    answer_template_json:
      '{"type":"ledger_account","account_name":"現金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"10/1","description":"前月繰越","ref":"","debit":350,"credit":0,"balance":350},{"date":"10/5","description":"売上","ref":"","debit":300,"credit":0,"balance":650},{"date":"10/10","description":"給料","ref":"","debit":0,"credit":200,"balance":450},{"date":"10/15","description":"売掛金","ref":"","debit":200,"credit":0,"balance":650},{"date":"10/20","description":"買掛金","ref":"","debit":0,"credit":250,"balance":400},{"date":"10/28","description":"現金過不足","ref":"","debit":0,"credit":10,"balance":390}]}',
    explanation:
      "【基本概念】\n企業が所有する紙幣や硬貨などの通貨のことで、最も流動性の高い資産勘定です。現金勘定では、現金の増減と残高を管理します。\n\n【具体例・イメージ】\nお財布の中のお金をイメージしてください。お金が入ってくると増え、支払いをすると減ります。会社の金庫や手元現金も同様です。\n\n【現金勘定の記録パターン】\n・現金収入時: 借方に現金（現金増加）\n・現金支出時: 貸方に現金（現金減少）\n・売上代金受取: 借方に現金、貸方に売上\n・経費支払: 借方に経費、貸方に現金\n\n【間違えやすいポイント】\n・現金の増減を逆に記録してしまう\n・現金過不足の処理（実際残高と帳簿残高の差額処理）\n・現金以外の支払手段（小切手、振込等）との区別\n\n【覚え方のコツ】\n・現金は資産なので、増えるときは借方、減るときは貸方\n・「もらったら借方、払ったら貸方」\n・現金過不足は実査で判明した差額を調整\n\n【この問題の解き方】\n各取引の現金への影響を確認し、借方・貸方に適切に記録して残高を計算します。現金過不足があれば最後に調整します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.524Z",
  },
  {
    id: "Q_T_001",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題（基礎レベル）】\n\n9月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\n\n【期首貸借対照表（年9/1）】\n現金：500円\n建物：10円\n土地：900円\n資本金：10円\n\n【期中取引】\n9/2 現金 900 / 資本金 900 （資本金受入）\n9/5 水道光熱費 900 / 現金 900 （水道光熱費支払）\n9/10 仕入 900 / 買掛金 900 （商品仕入）\n9/15 現金 900 / 売上 900 （商品売上）\n9/20 買掛金 900 / 現金 900 （買掛金支払）\n\n【決算整理事項】\n・貸倒引当金設定：貸倒引当金繰入 150 / 貸倒引当金 150\n・減価償却：減価償却費 900 / 減価償却累計額 900\n\n【作成指示】\n1. 上記取引を仕訳する\n2. 決算整理仕訳を行う\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":900,"creditAmount":900},{"accountName":"資本金","debitAmount":0,"creditAmount":900},{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":900,"creditAmount":900},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"貸倒引当金繰入","debitAmount":150,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":150},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900}]}',
    explanation:
      "【基本概念】\n企業の財政状態と経営成績を表す重要な計算書類で、貸借対照表（B/S）は財政状態を、損益計算書（P/L）は経営成績を示します。\n\n【具体例・イメージ】\n家計簿をイメージしてください。貸借対照表は「今どれだけ財産があるか」、損益計算書は「今月どれだけ儲かったか」を表します。\n\n【作成の流れ】\n・期中取引の仕訳→決算整理仕訳→総勘定元帳転記→試算表作成→財務諸表作成\n・貸借対照表: 資産・負債・純資産を表示（左右が必ず一致）\n・損益計算書: 収益・費用を表示（差額が当期純利益）\n\n【間違えやすいポイント】\n・資産・負債・純資産の分類を間違える\n・収益・費用の計上時期を誤る\n・決算整理事項の処理漏れ\n・貸借対照表の貸借が一致しない\n\n【覚え方のコツ】\n・B/Sは「ストック」（ある時点の状態）\n・P/Lは「フロー」（一定期間の動き）\n・資産は左、負債・純資産は右\n・収益は右、費用は左\n\n【この問題の解き方】\n各取引を正確に仕訳し、決算整理を行った後、各勘定の残高を財務諸表の適切な科目に分類して表示します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.129Z",
  },
  {
    id: "Q_J_002",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金が100円不足していた。調査により通信費の記帳漏れと判明した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"通信費","debit_amount":100,"credit_account":"現金","credit_amount":100}}',
    explanation:
      "原因が判明した現金過不足は、該当する勘定科目に直接記帳する。通信費の記帳漏れなので通信費勘定で処理。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"現金過不足\",\"accounts\":[\"通信費\",\"現金\",\"現金過不足\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"現金過不足\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_002",
    category_id: "ledger",
    question_text:
      "【売掛金勘定記入問題】\n\n1月の売掛金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n売掛金：500円\n\n【1月の取引】\n1/3 掛売上：200円\n1/8 現金回収：10円\n1/15 掛売上：200円\n1/22 手形回収：100円\n1/28 貸倒れ発生：10円\n\n【貸倒処理】\n貸倒れが発生した場合は、貸倒引当金を優先充当し、不足分は貸倒損失として処理してください。\n（貸倒引当金残高：10円）\n\n【作成指示】\n1. 売掛金勘定へ各取引を記入\n2. 発生と回収を適切に処理\n3. 貸倒れの処理を行う\n4. 月末残高を算出",
    answer_template_json:
      '{"type":"ledger_account","account_name":"売掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"1/1","description":"前月繰越","ref":"","debit":500,"credit":0,"balance":500},{"date":"1/3","description":"売上","ref":"","debit":200,"credit":0,"balance":700},{"date":"1/8","description":"現金","ref":"","debit":0,"credit":10,"balance":690},{"date":"1/15","description":"売上","ref":"","debit":200,"credit":0,"balance":890},{"date":"1/22","description":"受取手形","ref":"","debit":0,"credit":100,"balance":790},{"date":"1/28","description":"貸倒引当金","ref":"","debit":0,"credit":10,"balance":780}]}',
    explanation:
      "【基本概念】\n商品やサービスを掛け（信用取引）で販売した際に発生する、顧客から代金を受け取る権利を表す資産勘定です。売掛金勘定では、売掛金の発生・回収・貸倒処理を管理します。\n\n【具体例・イメージ】\n商店が「ツケ」で商品を販売した状況をイメージしてください。お客様に「後で代金をください」と商品を渡し、その権利を記録する帳簿です。\n\n【売掛金勘定の記録パターン】\n・掛売上時: 借方に売掛金（債権発生）\n・現金回収時: 貸方に売掛金（現金で回収）\n・手形回収時: 貸方に売掛金（手形で回収）\n・貸倒発生時: 貸方に売掛金（回収不能）\n\n【間違えやすいポイント】\n・売掛金の増減を逆に記録してしまう\n・回収方法（現金・手形・振込等）による処理の違い\n・貸倒引当金と貸倒損失の使い分け\n・売上返品・値引との関係\n\n【覚え方のコツ】\n・売掛金は資産なので、発生時は借方、回収時は貸方\n・「売った→借方、回収した→貸方」\n・貸倒は「引当金優先、不足分は損失」\n・手形回収は「売掛金→受取手形」の振替\n\n【この問題の解き方】\n各取引の売掛金への影響を確認し、発生・回収・貸倒を適切に記録して残高を計算します。貸倒処理では引当金を優先的に充当します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.525Z",
  },
  {
    id: "Q_T_002",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\n\n10月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\n\n【期中取引】\n10/1 現金 900 / 資本金 900 （資本金受入）\n10/4 前払金 900 / 現金 900 （前払金支払）\n10/5 現金 900 / 前受金 900 （前受金受取）\n10/8 仕入 500 / 買掛金 500 （商品仕入）\n10/12 水道光熱費 900 / 現金 900 （水道光熱費支払）\n10/23 売掛金 900 / 売上 900 （掛売上）\n10/27 現金 900 / 売掛金 900 （売掛金回収）\n10/27 商品 900 / 買掛金 900 （商品仕入）\n\n【決算整理事項】\n・貸倒引当金設定：貸倒引当金繰入 900 / 貸倒引当金 900\n・減価償却：減価償却費 900 / 減価償却累計額 900\n\n【作成指示】\n1. 上記取引を仕訳する\n2. 決算整理仕訳を行う\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":900,"creditAmount":0},{"accountName":"資本金","debitAmount":0,"creditAmount":900},{"accountName":"前払金","debitAmount":900,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":900},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"売掛金","debitAmount":900,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"商品","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金繰入","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":900},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900}]}',
    explanation:
      "【基本概念】\n企業の財政状態と経営成績を表す重要な計算書類で、貸借対照表（B/S）は財政状態を、損益計算書（P/L）は経営成績を示します。期中取引と決算整理事項を集計して作成します。\n\n【具体例・イメージ】\n家計簿を企業規模にしたもので、「何を持っているか（資産）」「何を借りているか（負債）」「元手はいくらか（資本）」「いくら儲かったか（収益・費用）」を整理した表です。\n\n【作成手順】\n1. 期中取引を仕訳→各勘定科目の残高を計算\n2. 決算整理仕訳→修正後の残高を計算\n3. 貸借対照表（資産・負債・純資産）と損益計算書（収益・費用）に分類\n4. 各表の合計が一致することを確認\n\n【間違えやすいポイント】\n・資産・負債・資本の分類ミス\n・収益・費用の期間対応ミス\n・貸借対照表の借方・貸方合計不一致\n・決算整理仕訳の漏れ\n\n【覚え方のコツ】\n・貸借対照表：左側（借方）が資産、右側（貸方）が負債・純資産\n・損益計算書：収益から費用を引いて利益を計算\n・利益は貸借対照表の純資産に加算\n・「収支と残高」を常に意識する\n\n【この問題の解き方】\n各取引を正確に仕訳し、勘定科目ごとに集計して財務諸表を作成しましょう。決算整理事項も忘れずに反映させてください。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.130Z",
  },
  {
    id: "Q_J_003",
    category_id: "journal",
    question_text:
      "決算において、現金過不足勘定に借方残高150円がある。原因は不明のまま決算を迎えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"雑損","debit_amount":150,"credit_account":"現金過不足","credit_amount":150}}',
    explanation:
      "決算時に原因不明の現金過不足は、借方残高は雑損、貸方残高は雑益に振り替える。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"現金過不足\",\"accounts\":[\"雑損\",\"雑益\",\"現金過不足\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"現金過不足\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_003",
    category_id: "ledger",
    question_text:
      "【商品勘定記入問題（三分法）】\n\n10月の商品売買取引を三分法により記帳し、売上原価を算定してください。\n\n【期首商品棚卸高】\n500円\n\n【当月の取引】\n・当月仕入高：900円\n・当月売上高：900円\n\n【期末商品棚卸高】\n500円\n\n【作成指示】\n1. 仕入勘定、売上勘定、繰越商品勘定を作成\n2. 三分法による商品売買の記帳\n3. 売上原価の算定（期首＋仕入－期末）\n4. 売上総利益の計算",
    answer_template_json:
      '{"type":"ledger_account","account_name":"商品","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"10/1","description":"繰越商品","ref":"","debit":500,"credit":0,"balance":500},{"date":"10/31","description":"仕入","ref":"","debit":900,"credit":0,"balance":1400},{"date":"10/31","description":"繰越商品","ref":"","debit":0,"credit":500,"balance":900}]}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.527Z",
  },
  {
    id: "Q_T_003",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\n\n12月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\n\n【期中取引】\n12/16 水道光熱費 900 / 現金 900 （水道光熱費支払）\n12/17 旅費交通費 900 / 現金 900 （交通費支払）\n12/19 広告宣伝費 900 / 現金 900 （広告費支払）\n12/20 消耗品費 900 / 現金 900 （消耗品購入）\n12/20 水道光熱費 900 / 現金 900 （水道光熱費支払）\n12/22 仕入 900 / 買掛金 900 （商品仕入）\n12/22 広告宣伝費 900 / 現金 900 （広告費支払）\n12/27 広告宣伝費 900 / 現金 900 （広告費支払）\n\n【決算整理事項】\n・貸倒引当金設定：貸倒引当金繰入 900 / 貸倒引当金 900\n・減価償却：減価償却費 900 / 減価償却累計額 900\n・前払費用計上：前払費用 800 / 保険料 800\n\n【作成指示】\n1. 上記取引を仕訳する\n2. 決算整理仕訳を行う\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"旅費交通費","debitAmount":900,"creditAmount":0},{"accountName":"広告宣伝費","debitAmount":900,"creditAmount":0},{"accountName":"消耗品費","debitAmount":900,"creditAmount":0},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"貸倒引当金繰入","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":900},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900},{"accountName":"前払費用","debitAmount":800,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":800}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.131Z",
  },
  {
    id: "Q_J_004",
    category_id: "journal",
    question_text:
      "現金実査の結果、現金の実際有高が50,000円であったが、帳簿残高は48,000円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"現金","debit_amount":2000,"credit_account":"現金過不足","credit_amount":2000}}',
    explanation:
      "現金の実際有高が帳簿残高を上回る場合は、現金の増加と現金過不足勘定（貸方）で処理する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"現金過不足\",\"accounts\":[\"現金\",\"現金過不足\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"現金過不足\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_004",
    category_id: "ledger",
    question_text:
      "【建物勘定・減価償却累計額勘定記入問題】\n\n3月末決算において、建物の減価償却を行い、関連勘定への記入を行ってください。\n\n【建物情報】\n・取得原価：10,000円\n・耐用年数：20年\n・償却方法：定額法（残存価額なし）\n・使用年数：19年経過\n\n【前期末の状況】\n・建物勘定残高：10,000円\n・減価償却累計額：9,500円\n\n【作成指示】\n1. 当期の減価償却費を計算\n2. 建物減価償却累計額勘定への記入\n3. 減価償却費勘定への記入\n4. 建物の帳簿価額を算出",
    answer_template_json:
      '{"type":"ledger_account","account_name":"建物・減価償却累計額","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"3/31","description":"前期繰越","ref":"","debit":10000,"credit":0,"balance":10000},{"date":"3/31","description":"減価償却累計額","ref":"","debit":0,"credit":9500,"balance":9500},{"date":"3/31","description":"減価償却費","ref":"","debit":0,"credit":500,"balance":10000}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.528Z",
  },
  {
    id: "Q_T_004",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題】\n\n9月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\n\n【期中取引】\n9/9 前払金 900 / 現金 900 （前払金支払）\n9/10 商品 900 / 買掛金 900 （商品仕入）\n9/21 借入金 900 / 現金 900 （借入金返済）\n9/21 給料 900 / 現金 900 （給料支払）\n9/22 水道光熱費 900 / 現金 900 （水道光熱費支払）\n9/23 仕入 900 / 買掛金 900 （商品仕入）\n9/27 現金 900 / 資本金 900 （資本金受入）\n9/28 現金 900 / 前受金 900 （前受金受取）\n\n【決算整理事項】\n・貸倒引当金設定：貸倒引当金繰入 900 / 貸倒引当金 900\n・減価償却：減価償却費 900 / 減価償却累計額 900\n・前払費用計上：前払費用 900 / 保険料 900\n\n【作成指示】\n1. 上記取引を仕訳する\n2. 決算整理仕訳を行う\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"前払金","debitAmount":900,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"商品","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"借入金","debitAmount":900,"creditAmount":0},{"accountName":"給料","debitAmount":900,"creditAmount":0},{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"資本金","debitAmount":0,"creditAmount":900},{"accountName":"前受金","debitAmount":0,"creditAmount":900},{"accountName":"貸倒引当金繰入","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":900},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900},{"accountName":"前払費用","debitAmount":900,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":900}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.132Z",
  },
  {
    id: "Q_J_005",
    category_id: "journal",
    question_text: "小口現金制度を採用し、小口現金係に10,000円を前渡しした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"小口現金","debit_amount":10000,"credit_account":"現金","credit_amount":10000}}',
    explanation:
      "小口現金制度では、小口現金係への資金前渡を「小口現金」勘定の借方に計上する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"小口現金\",\"accounts\":[\"小口現金\",\"現金\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"小口現金\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_005",
    category_id: "ledger",
    question_text:
      "【買掛金勘定記入問題】\n\n11月の買掛金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n買掛金：500円\n\n【11月の取引】\n11/7 掛仕入：400円\n11/14 現金支払：250円\n11/21 買掛金相殺：10円\n\n【作成指示】\n1. 買掛金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"買掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"11/1","description":"前月繰越","ref":"","debit":0,"credit":500,"balance":500},{"date":"11/7","description":"仕入","ref":"","debit":0,"credit":400,"balance":900},{"date":"11/14","description":"現金","ref":"","debit":250,"credit":0,"balance":650},{"date":"11/21","description":"売掛金","ref":"","debit":10,"credit":0,"balance":640}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.529Z",
  },
  {
    id: "Q_T_005",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\n\n1月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\n\n【決算整理前試算表】\n現金（借方）：200円\n小口現金（借方）：300円\n当座預金（借方）：400円\n普通預金（借方）：450円\n受取手形（借方）：450円\n売掛金（借方）：500円\n商品（借方）：350円\n繰越商品（借方）：450円\n仕入（借方）：300円\n売上（貸方）：150円\n支払手形（貸方）：150円\n買掛金（貸方）：600円\n\n【決算整理事項】\n・貸倒引当金設定：800円\n・減価償却：250円\n\n【作成指示】\n1. 決算整理前試算表の残高を転記\n2. 決算整理仕訳を記入\n3. 決算整理後試算表を作成\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":200,"creditAmount":0},{"accountName":"小口現金","debitAmount":300,"creditAmount":0},{"accountName":"当座預金","debitAmount":400,"creditAmount":0},{"accountName":"普通預金","debitAmount":450,"creditAmount":0},{"accountName":"受取手形","debitAmount":450,"creditAmount":0},{"accountName":"売掛金","debitAmount":500,"creditAmount":0},{"accountName":"商品","debitAmount":350,"creditAmount":0},{"accountName":"繰越商品","debitAmount":450,"creditAmount":0},{"accountName":"仕入","debitAmount":300,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":150},{"accountName":"支払手形","debitAmount":0,"creditAmount":150},{"accountName":"買掛金","debitAmount":0,"creditAmount":600},{"accountName":"貸倒引当金繰入","debitAmount":800,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":800},{"accountName":"減価償却費","debitAmount":250,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":250}]}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.133Z",
  },
  {
    id: "Q_J_006",
    category_id: "journal",
    question_text:
      "小口現金の残高が2,000円となったため、8,000円を補給して10,000円とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"小口現金","debit_amount":8000,"credit_account":"現金","credit_amount":8000}}',
    explanation:
      "インプレスト・システムでは、小口現金を一定額に保つため不足分を補給する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"小口現金\",\"accounts\":[\"小口現金\",\"現金\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"小口現金\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_006",
    category_id: "ledger",
    question_text:
      "【借入金勘定・支払利息勘定記入問題】\n\n3月の借入金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n借入金：500円\n\n【3月の取引】\n3/7 借入金返済（元本）：250円\n3/14 支払利息：10円\n3/21 追加借入：150円\n\n【作成指示】\n1. 借入金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"借入金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"3/1","description":"前月繰越","ref":"","debit":0,"credit":500,"balance":500},{"date":"3/7","description":"現金","ref":"","debit":250,"credit":0,"balance":250},{"date":"3/21","description":"現金","ref":"","debit":0,"credit":150,"balance":400}]}',
    explanation:
      "【基本概念】\n将来の貸倒れに備えて売掛金等の一定割合を見積もり計上する評価勘定。差額補充法では既存残高との差額のみを調整します。\n\n【具体例・イメージ】\nクレジットカード会社が延滞リスクに備えて準備金を積む状況をイメージしてください。売掛金の一定割合を貸倒れ見込額として計上します。\n\n【仕訳パターン】\n・設定時（不足）: 借方に貸倒引当金繰入、貸方に貸倒引当金\n・戻入時（過剰）: 借方に貸倒引当金、貸方に貸倒引当金戻入\n・実際貸倒時: 借方に貸倒引当金、貸方に売掛金\n\n【間違えやすいポイント】\n・差額補充法の計算を間違える\n・実際の貸倒れ時に引当金を使い忘れる\n・貸借対照表の表示方法を間違える\n・評価勘定の性質を理解していない\n\n【覚え方のコツ】\n・差額補充法は「差額のみ調整」\n・貸倒引当金は「評価勘定（資産のマイナス）」\n・実際貸倒は「引当金を取り崩し」\n・BSでは「売掛金から控除表示」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.530Z",
  },
  {
    id: "Q_T_006",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\n\n5月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\n\n【決算整理前試算表】\n現金（借方）：450円\n小口現金（借方）：400円\n当座預金（借方）：800円\n普通預金（借方）：350円\n受取手形（借方）：400円\n売掛金（借方）：800円\n商品（借方）：10円\n繰越商品（借方）：450円\n仕入（借方）：250円\n売上（貸方）：800円\n支払手形（貸方）：500円\n買掛金（貸方）：300円\n\n【決算整理事項】\n・貸倒引当金設定：450円\n・減価償却：500円\n・前払費用計上：800円\n\n【作成指示】\n1. 決算整理前試算表の残高を転記\n2. 決算整理仕訳を記入\n3. 決算整理後試算表を作成\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":450,"creditAmount":0},{"accountName":"小口現金","debitAmount":400,"creditAmount":0},{"accountName":"当座預金","debitAmount":800,"creditAmount":0},{"accountName":"普通預金","debitAmount":350,"creditAmount":0},{"accountName":"受取手形","debitAmount":400,"creditAmount":0},{"accountName":"売掛金","debitAmount":800,"creditAmount":0},{"accountName":"商品","debitAmount":10,"creditAmount":0},{"accountName":"繰越商品","debitAmount":450,"creditAmount":0},{"accountName":"仕入","debitAmount":250,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":800},{"accountName":"支払手形","debitAmount":0,"creditAmount":500},{"accountName":"買掛金","debitAmount":0,"creditAmount":300},{"accountName":"貸倒引当金繰入","debitAmount":450,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":450},{"accountName":"減価償却費","debitAmount":500,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":500},{"accountName":"前払費用","debitAmount":800,"creditAmount":0},{"accountName":"保険料","debitAmount":0,"creditAmount":800}]}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.134Z",
  },
  {
    id: "Q_J_007",
    category_id: "journal",
    question_text: "小口現金から交通費1,500円、事務用品費800円を支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"交通費","debit_amount":1500,"credit_account":"小口現金","credit_amount":2300}}',
    explanation:
      "小口現金からの支払いは各費用勘定の借方と小口現金勘定の貸方で記録する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"小口現金\",\"accounts\":[\"小口現金\",\"交通費\",\"事務用品費\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"小口現金\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_007",
    category_id: "ledger",
    question_text:
      "【貸倒引当金勘定記入問題】\n\n8月の貸倒引当金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n貸倒引当金：100円\n\n【8月の取引】\n8/7 貸倒れ発生（充当）：10円\n8/14 決算時繰入：10円\n8/21 戻入益：10円\n\n【作成指示】\n1. 貸倒引当金勘定へ各取引を記入\n2. 関連勘定との連動を確認\n3. 月末残高を算出\n4. 必要に応じて関連勘定（支払利息等）も作成",
    answer_template_json:
      '{"type":"ledger_account","account_name":"貸倒引当金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"8/1","description":"前月繰越","ref":"","debit":0,"credit":100,"balance":100},{"date":"8/7","description":"売掛金","ref":"","debit":20,"credit":0,"balance":90},{"date":"8/14","description":"貸倒引当金繰入","ref":"","debit":0,"credit":40,"balance":150},{"date":"8/21","description":"貸倒引当金戻入","ref":"","debit":10,"credit":0,"balance":150}]}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.531Z",
  },
  {
    id: "Q_T_007",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\n\n9月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\n\n【決算整理前試算表】\n現金（借方）：10円\n小口現金（貸方）：500円\n当座預金（貸方）：250円\n普通預金（貸方）：10円\n受取手形（貸方）：800円\n売掛金（借方）：600円\n商品（借方）：300円\n繰越商品（貸方）：10円\n仕入（借方）：450円\n売上（貸方）：350円\n支払手形（貸方）：500円\n買掛金（貸方）：450円\n\n【決算整理事項】\n・貸倒引当金設定：800円\n・減価償却：450円\n・前払費用計上：150円\n\n【作成指示】\n1. 決算整理前試算表の残高を転記\n2. 決算整理仕訳を記入\n3. 決算整理後試算表を作成\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":900,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":900},{"accountName":"当座預金","debitAmount":0,"creditAmount":900},{"accountName":"普通預金","debitAmount":0,"creditAmount":900},{"accountName":"受取手形","debitAmount":0,"creditAmount":900},{"accountName":"売掛金","debitAmount":900,"creditAmount":0},{"accountName":"商品","debitAmount":900,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":900},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"支払手形","debitAmount":0,"creditAmount":900},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"貸倒引当金繰入","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":900},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900},{"accountName":"調整勘定","debitAmount":900,"creditAmount":0}]}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.135Z",
  },
  {
    id: "Q_J_008",
    category_id: "journal",
    question_text: "商品を現金8,000円で販売した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"現金","debit_amount":8000,"credit_account":"売上","credit_amount":8000}}',
    explanation:
      "現金売上は現金の増加（借方）と売上収益の計上（貸方）で処理する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"その他現金取引\",\"accounts\":[\"現金\",\"売上\",\"仕入\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"その他現金取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_008",
    category_id: "ledger",
    question_text:
      "【売上勘定・仕入勘定の対応関係】\n\n6月の売上勘定と仕入勘定の記入を行ってください。\n\n【6月の取引】\n・現金売上：900円\n・掛売上：900円\n・現金仕入：900円\n・掛仕入：900円\n\n【作成指示】\n1. 売上勘定と仕入勘定を作成\n2. 現金取引と掛取引を区別して記入\n3. 各勘定の月末残高を算出\n4. 売上総利益を計算（売上－仕入）",
    answer_template_json:
      '{"type":"ledger_account","account_name":"資本金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"6/30","description":"現金","ref":"","debit":0,"credit":500,"balance":500},{"date":"6/30","description":"売掛金","ref":"","debit":0,"credit":500,"balance":500},{"date":"6/30","description":"現金","ref":"","debit":500,"credit":0,"balance":500},{"date":"6/30","description":"買掛金","ref":"","debit":500,"credit":0,"balance":500}]}',
    explanation:
      "【基本概念】\n従業員への給与支払いと関連する社会保険料・源泉徴収の処理。給与総額から各種控除額を差し引いた手取額を支給します。\n\n【具体例・イメージ】\n毎月の給与明細で天引きされる項目をイメージしてください。総支給額から健康保険料、厚生年金保険料、雇用保険料、所得税が控除されます。\n\n【仕訳パターン】\n・給与支給時: 借方に給料、貸方に各種預り金と現金\n・社会保険料納付時: 借方に法定福利費・預り金、貸方に現金\n・源泉所得税納付時: 借方に預り金、貸方に現金\n\n【間違えやすいポイント】\n・総支給額と手取額を混同する\n・会社負担分と従業員負担分を間違える\n・預り金の処理を忘れる\n・賞与の社会保険料計算を間違える\n\n【覚え方のコツ】\n・給料は「総額で計上、差額は預り金」\n・社会保険料は「労使折半」\n・源泉徴収は「会社が代理納付」\n・預り金は負債（いずれ支払う義務）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.532Z",
  },
  {
    id: "Q_T_008",
    category_id: "trial_balance",
    question_text:
      "【8桁精算表作成問題】\n\n11月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\n\n【決算整理前試算表】\n現金（借方）：800円\n小口現金（貸方）：800円\n当座預金（貸方）：500円\n普通預金（貸方）：500円\n受取手形（貸方）：300円\n売掛金（借方）：600円\n商品（借方）：10円\n繰越商品（貸方）：350円\n仕入（借方）：300円\n売上（貸方）：300円\n支払手形（貸方）：450円\n買掛金（貸方）：10円\n\n【決算整理事項】\n・貸倒引当金設定：450円\n・減価償却：200円\n・前払費用計上：250円\n\n【作成指示】\n1. 決算整理前試算表の残高を転記\n2. 決算整理仕訳を記入\n3. 決算整理後試算表を作成\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json:
      '{"type":"worksheet","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":900,"creditAmount":0},{"accountName":"小口現金","debitAmount":0,"creditAmount":900},{"accountName":"当座預金","debitAmount":0,"creditAmount":900},{"accountName":"普通預金","debitAmount":0,"creditAmount":900},{"accountName":"受取手形","debitAmount":0,"creditAmount":900},{"accountName":"売掛金","debitAmount":900,"creditAmount":0},{"accountName":"商品","debitAmount":900,"creditAmount":0},{"accountName":"繰越商品","debitAmount":0,"creditAmount":900},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"支払手形","debitAmount":0,"creditAmount":900},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"貸倒引当金繰入","debitAmount":900,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":900},{"accountName":"減価償却費","debitAmount":900,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":900},{"accountName":"調整勘定","debitAmount":900,"creditAmount":0}]}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.135Z",
  },
  {
    id: "Q_J_009",
    category_id: "journal",
    question_text:
      "給与300,000円を現金で支払った。なお、源泉所得税20,000円を天引きした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"給料","debit_amount":300000,"credit_account":"現金","credit_amount":280000}}',
    explanation:
      "給与支払いは総支給額を給料勘定に計上し、手取額を現金で支払い、源泉税は預り金で処理。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"その他現金取引\",\"accounts\":[\"給料\",\"現金\",\"預り金\",\"所得税預り金\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"その他現金取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_009",
    category_id: "ledger",
    question_text:
      "【給料勘定・未払費用の期間配分記入】\n\n11月の給料勘定と未払費用の記入を行ってください。\n\n【給料情報】\n・月額給料：300円\n・支払日：毎月25日（当月分）\n・決算日：11月末\n\n【11月の処理】\n・11/25：当月給料支払\n・11月末：未払給料の計上（26日～月末分）\n\n【作成指示】\n1. 給料勘定への記入\n2. 未払給料の日割計算\n3. 未払費用勘定への記入\n4. 期間配分の適切な処理",
    answer_template_json:
      '{"type":"ledger_account","account_name":"減価償却費","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"11/25","description":"現金","ref":"","debit":300,"credit":0,"balance":300},{"date":"11/30","description":"未払費用","ref":"","debit":50,"credit":0,"balance":350}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.533Z",
  },
  {
    id: "Q_T_009",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2月の期首残高と期中取引から、2月末の合計試算表を作成してください。\n\n【期首残高】\n現金：500円（借方残高）\n商品：150円（借方残高）\n売掛金：450円（借方残高）\n買掛金：600円（貸方残高）\n資本金：600円（貸方残高）\n\n【期中取引】\n2/1 現金 900 / 借入金 900 （借入）\n2/2 給料 900 / 現金 900 （給料支払）\n2/6 売掛金 900 / 売上 900 （掛売上）\n2/7 仕入 900 / 買掛金 900 （商品仕入）\n2/10 前払金 900 / 現金 900 （前払金支払）\n2/12 買掛金 900 / 現金 900 （買掛金支払）\n2/13 現金 900 / 売上 900 （商品売上）\n2/21 水道光熱費 900 / 現金 900 （水道光熱費支払）\n2/27 借入金 900 / 現金 900 （借入金返済）\n2/27 現金 900 / 前受金 900 （前受金受取）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"借入金","debitAmount":900,"creditAmount":0},{"accountName":"給料","debitAmount":900,"creditAmount":0},{"accountName":"売掛金","debitAmount":900,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"前払金","debitAmount":900,"creditAmount":0},{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":900}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.136Z",
  },
  {
    id: "Q_L_010",
    category_id: "ledger",
    question_text:
      "【諸口勘定を含む複合仕訳の転記処理】\n\n5月の諸口勘定を含む複合仕訳の転記を行ってください。\n\n【複合仕訳の例】\n5/10の取引：\n（借方）\n・仕入 300円\n・支払手数料 10円\n（貸方）\n・現金 100円\n・買掛金 200円\n・未払金 10円\n\n【作成指示】\n1. 各勘定への個別転記\n2. 諸口勘定の使用方法を説明\n3. 相手勘定が複数ある場合の処理\n4. 転記の正確性を確認",
    answer_template_json:
      '{"type":"ledger_account","account_name":"給料","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"12/31","description":"前払費用","ref":"","debit":0,"credit":90,"balance":90},{"date":"12/31","description":"損益","ref":"","debit":90,"credit":0,"balance":0}]}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"general_ledger","pattern":"総勘定元帳転記","accounts":[],"keywords":["総勘定元帳","転記","仕訳帳"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.534Z",
  },
  {
    id: "Q_T_010",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n2月の期首残高と期中取引から、2月末の合計試算表を作成してください。\n\n【期首残高】\n現金：200円（借方残高）\n商品：300円（借方残高）\n売掛金：450円（借方残高）\n買掛金：300円（貸方残高）\n資本金：500円（貸方残高）\n\n【期中取引】\n2/1 現金 900 / 売上 900 （商品売上）\n2/2 仕入 500 / 買掛金 500 （商品仕入）\n2/5 現金 900 / 借入金 900 （借入）\n2/16 現金 900 / 売掛金 900 （売掛金回収）\n2/17 通信費 900 / 現金 900 （通信費支払）\n2/22 消耗品費 900 / 現金 900 （消耗品購入）\n2/24 仕入 900 / 買掛金 900 （商品仕入）\n2/25 広告宣伝費 900 / 現金 900 （広告費支払）\n2/26 現金 900 / 借入金 900 （借入）\n2/28 借入金 900 / 現金 900 （借入金返済）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"仕入","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"借入金","debitAmount":0,"creditAmount":900},{"accountName":"売掛金","debitAmount":0,"creditAmount":900},{"accountName":"通信費","debitAmount":900,"creditAmount":0},{"accountName":"消耗品費","debitAmount":900,"creditAmount":0},{"accountName":"広告宣伝費","debitAmount":900,"creditAmount":0}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.137Z",
  },
  {
    id: "Q_J_010",
    category_id: "journal",
    question_text: "営業活動のため交通費2,500円を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"交通費","debit_amount":2500,"credit_account":"現金","credit_amount":2500}}',
    explanation:
      "交通費の現金支払いは交通費勘定の借方と現金勘定の貸方で記録する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"その他現金取引\",\"accounts\":[\"交通費\",\"現金\",\"消耗品費\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"その他現金取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_J_011",
    category_id: "journal",
    question_text: "固定資産税50,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"租税公課","debit_amount":50000,"credit_account":"現金","credit_amount":50000}}',
    explanation: "固定資産税などの税金支払いは租税公課勘定で処理する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"その他現金取引\",\"accounts\":[\"租税公課\",\"現金\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"その他現金取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_011",
    category_id: "ledger",
    question_text:
      "【現金出納帳記入問題】\n\n6月の現金出納帳を作成してください。\n\n収入・支出・残高記入を含む詳細な記帳を行います。\n\n【前月繰越】\n500円\n\n【当月の取引】\n6/5　売掛金の回収　150円\n6/10　商品仕入の代金支払　10円\n6/15　現金売上　150円\n6/20　経費支払　10円\n6/25　従業員給料支払　250円\n6/30　翌月繰越（残高を次月へ繰越）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"6/1","description":"前月繰越","ref":"","balance":500,"receipt":500,"payment":0},{"date":"6/5","description":"売掛金","ref":"","balance":500,"receipt":500,"payment":0},{"date":"6/10","description":"仕入","ref":"","balance":500,"receipt":0,"payment":500},{"date":"6/15","description":"売上","ref":"","balance":500,"receipt":500,"payment":0},{"date":"6/20","description":"経費","ref":"","balance":500,"receipt":0,"payment":500},{"date":"6/25","description":"給料","ref":"","balance":400,"receipt":0,"payment":500},{"date":"6/30","description":"次月繰越","ref":"","balance":0,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.535Z",
  },
  {
    id: "Q_T_011",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n4月の期首残高と期中取引から、4月末の合計試算表を作成してください。\n\n【期首残高】\n現金：450円（借方残高）\n商品：300円（借方残高）\n売掛金：200円（借方残高）\n買掛金：300円（貸方残高）\n資本金：250円（貸方残高）\n\n【期中取引】\n4/9 前払金 900 / 現金 900 （前払金支払）\n4/10 買掛金 900 / 現金 900 （買掛金支払）\n4/10 通信費 900 / 現金 900 （通信費支払）\n4/18 現金 900 / 前受金 900 （前受金受取）\n4/18 旅費交通費 900 / 現金 900 （交通費支払）\n4/21 売掛金 900 / 売上 900 （掛売上）\n4/22 消耗品費 900 / 現金 900 （消耗品購入）\n4/24 消耗品費 900 / 現金 900 （消耗品購入）\n4/27 通信費 900 / 現金 900 （通信費支払）\n4/27 現金 900 / 売上 900 （商品売上）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"前払金","debitAmount":900,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"買掛金","debitAmount":900,"creditAmount":0},{"accountName":"通信費","debitAmount":900,"creditAmount":0},{"accountName":"前受金","debitAmount":0,"creditAmount":900},{"accountName":"旅費交通費","debitAmount":900,"creditAmount":0},{"accountName":"売掛金","debitAmount":900,"creditAmount":0},{"accountName":"売上","debitAmount":0,"creditAmount":900},{"accountName":"消耗品費","debitAmount":900,"creditAmount":0}]}',
    explanation:
      "【基本概念】\n一定期間内の全取引を勘定科目ごとに集計し、各勘定の借方合計・貸方合計・残高を一覧表示した計算表です。簿記の記録が正確かどうかを確認する重要な帳簿です。\n\n【具体例・イメージ】\n家計簿で各項目（食費、交通費など）の入金・支出の合計を月末に計算して、通帳残高と合うかチェックするイメージです。企業版では全勘定科目が対象になります。\n\n【合計試算表の特徴】\n・各勘定の借方合計・貸方合計を表示\n・期首残高＋期中取引合計の形\n・借方合計と貸方合計が必ず一致\n・残高は別途計算が必要\n\n【作成手順】\n1. 期首残高を各勘定に記入\n2. 期中取引を勘定科目ごとに集計\n3. 借方・貸方それぞれの合計を計算\n4. 全体の借方合計＝貸方合計を確認\n\n【間違えやすいポイント】\n・期首残高の記入漏れ\n・借方・貸方の取引集計ミス\n・勘定科目の分類間違い\n・合計の計算ミス\n\n【覚え方のコツ】\n・「合計」試算表 = 各勘定の「合計」を表示\n・借方合計＝貸方合計は複式簿記の原則\n・期首残高＋期中取引＝期末残高\n・試算表は簿記記録の「健康診断書」\n\n【この問題の解き方】\n期首残高から始めて、各取引を正しい勘定科目に振り分け、借方・貸方の合計を正確に計算しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.138Z",
  },
  {
    id: "Q_J_012",
    category_id: "journal",
    question_text:
      "定期預金の利息3,000円（源泉徴収税600円控除後）を現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"現金","debit_amount":2400,"credit_account":"受取利息","credit_amount":3000}}',
    explanation:
      "利息収入は総額を受取利息に計上し、源泉徴収税は仮払税金で処理。現金は手取額。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"現金取引\",\"subpattern\":\"その他現金取引\",\"accounts\":[\"現金\",\"受取利息\",\"仮払税金\"],\"keywords\":[\"現金・預金\",\"現金取引\",\"その他現金取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_012",
    category_id: "ledger",
    question_text:
      "【当座預金出納帳記入問題】\n\n4月の当座預金出納帳を作成してください。\n\n預入・引出・残高管理を含む詳細な記帳を行います。\n\n【前月繰越】\n150円\n\n【当月の取引】\n4/5　売上代金の支払（小切手振出）　100円\n4/12　現金預入　10円\n4/20　買掛金の支払（小切手振出）　10円\n4/28　売上代金の支払（小切手振出）　10円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"当座預金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"4/1","description":"前月繰越","ref":"","balance":150,"receipt":500,"payment":0},{"date":"4/5","description":"売上","ref":"","balance":40,"receipt":0,"payment":500},{"date":"4/12","description":"現金","ref":"","balance":150,"receipt":500,"payment":0},{"date":"4/20","description":"買掛金","ref":"","balance":50,"receipt":0,"payment":500},{"date":"4/28","description":"売上","ref":"","balance":30,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.536Z",
  },
  {
    id: "Q_T_012",
    category_id: "trial_balance",
    question_text:
      "【合計試算表作成問題】\n\n1月の期首残高と期中取引から、1月末の合計試算表を作成してください。\n\n【期首残高】\n現金：450円（借方残高）\n商品：450円（借方残高）\n売掛金：150円（借方残高）\n買掛金：800円（貸方残高）\n資本金：800円（貸方残高）\n\n【期中取引】\n1/3 水道光熱費 900 / 現金 900 （水道光熱費支払）\n1/3 給料 900 / 現金 900 （給料支払）\n1/7 商品 900 / 買掛金 900 （商品仕入）\n1/11 消耗品費 900 / 現金 900 （消耗品購入）\n1/13 現金 900 / 売掛金 900 （売掛金回収）\n1/14 借入金 900 / 現金 900 （借入金返済）\n1/22 借入金 900 / 現金 900 （借入金返済）\n1/24 家賃 900 / 現金 900 （家賃支払）\n1/24 給料 900 / 現金 900 （給料支払）\n1/25 現金 900 / 売掛金 900 （売掛金回収）\n\n【作成指示】\n1. 各勘定科目の借方合計と貸方合計を計算\n2. 合計試算表を作成\n3. 借方合計と貸方合計が一致することを確認\n4. 各勘定科目の残高を算出",
    answer_template_json:
      '{"type":"trial_balance","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"水道光熱費","debitAmount":900,"creditAmount":0},{"accountName":"現金","debitAmount":0,"creditAmount":900},{"accountName":"給料","debitAmount":900,"creditAmount":0},{"accountName":"商品","debitAmount":900,"creditAmount":0},{"accountName":"買掛金","debitAmount":0,"creditAmount":900},{"accountName":"消耗品費","debitAmount":900,"creditAmount":0},{"accountName":"売掛金","debitAmount":0,"creditAmount":900},{"accountName":"借入金","debitAmount":900,"creditAmount":0},{"accountName":"家賃","debitAmount":900,"creditAmount":0}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"trial_balance","pattern":"合計試算表","accounts":[],"keywords":["合計試算表","期中取引","集計"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T07:00:49.139Z",
  },
  {
    id: "Q_J_013",
    category_id: "journal",
    question_text: "A銀行に当座預金口座を開設し、現金500,000円を預け入れた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座預金","debit_amount":500000,"credit_account":"現金","credit_amount":500000}}',
    explanation:
      "当座預金への資金預入は当座預金勘定の借方と現金勘定の貸方で記録する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"当座預金\",\"現金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_013",
    category_id: "ledger",
    question_text:
      "【小口現金出納帳記入問題】\n\n9月の小口現金出納帳を作成してください。\n\n補給・支払・精算を含む詳細な記帳を行います。\n\n【前月繰越】\n250円\n\n【当月の取引】\n9/3　商品仕入の支払　200円\n9/10　現金補給（本店より）　150円\n9/18　手形代金の受取　10円\n9/25　仕入先への支払　10円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"小口現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"9/1","description":"前月繰越","ref":"","balance":250,"receipt":0,"payment":500},{"date":"9/3","description":"仕入","ref":"","balance":450,"receipt":0,"payment":500},{"date":"9/10","description":"現金","ref":"","balance":300,"receipt":500,"payment":0},{"date":"9/18","description":"手形","ref":"","balance":200,"receipt":500,"payment":0},{"date":"9/25","description":"仕入","ref":"","balance":250,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.536Z",
  },
  {
    id: "Q_L_014",
    category_id: "ledger",
    question_text:
      "【普通預金通帳記入問題】\n\n7月の普通預金通帳を作成してください。\n\n記帳・利息計算を含む詳細な記帳を行います。\n\n【前月繰越】\n残高なし（0円からスタート）\n\n【当月の取引】\n7/5　売掛金の回収　150円\n7/12　売掛金の回収　200円\n7/20　売掛金の回収　10円\n7/28　現金引出　10円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"普通預金通帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"7/5","description":"売掛金","ref":"","balance":150,"receipt":0,"payment":500},{"date":"7/12","description":"売掛金","ref":"","balance":350,"receipt":0,"payment":500},{"date":"7/20","description":"売掛金","ref":"","balance":450,"receipt":0,"payment":500},{"date":"7/28","description":"現金","ref":"","balance":500,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.537Z",
  },
  {
    id: "Q_J_014",
    category_id: "journal",
    question_text: "買掛金150,000円の支払いのため小切手を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"買掛金","debit_amount":150000,"credit_account":"当座預金","credit_amount":150000}}',
    explanation:
      "小切手振出による支払いは買掛金の減少と当座預金の減少で処理する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"買掛金\",\"当座預金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_J_015",
    category_id: "journal",
    question_text: "売掛金200,000円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座預金","debit_amount":200000,"credit_account":"売掛金","credit_amount":200000}}',
    explanation: "売掛金の振込回収は当座預金の増加と売掛金の減少で処理する。",
    difficulty: 1,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"当座預金\",\"売掛金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_015",
    category_id: "ledger",
    question_text:
      "【仕入帳記入問題】\n\n10月の仕入帳を作成してください。\n\n日付・仕入先・品名・金額記入を行います。\n\n【当月の仕入取引】\n10/3　仕入先Aからの買掛仕入　250円\n10/10　仕入先Bからの買掛仕入　150円\n10/18　仕入先Cからの買掛仕入　10円\n10/25　現金仕入　10円\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"仕入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"10/3","description":"買掛金","ref":"","balance":250,"receipt":500,"payment":0},{"date":"10/10","description":"買掛金","ref":"","balance":400,"receipt":500,"payment":0},{"date":"10/18","description":"買掛金","ref":"","balance":500,"receipt":500,"payment":0},{"date":"10/25","description":"現金","ref":"","balance":500,"receipt":500,"payment":0}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.538Z",
  },
  {
    id: "Q_J_016",
    category_id: "journal",
    question_text: "当座預金から現金100,000円を引き出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"現金","debit_amount":100000,"credit_account":"当座預金","credit_amount":100000}}',
    explanation:
      "当座預金からの現金引出は現金の増加と当座預金の減少で記録する。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"現金\",\"当座預金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_016",
    category_id: "ledger",
    question_text:
      "【売上帳記入問題】\n\n5月の売上帳を作成してください。\n\n【前月繰越】\n200円\n\n【当月の取引】\n5/7　手形振出　150円\n5/15　手形決済による入金　10円\n5/22　手形振出　10円\n5/30　手形決済による入金　100円\n\n上記の取引を売上帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売上帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"5/1","description":"前月繰越","ref":"","balance":200,"receipt":0,"payment":500},{"date":"5/7","description":"振出","ref":"","balance":350,"receipt":0,"payment":500},{"date":"5/15","description":"決済","ref":"","balance":250,"receipt":500,"payment":0},{"date":"5/22","description":"振出","ref":"","balance":300,"receipt":0,"payment":500},{"date":"5/30","description":"決済","ref":"","balance":200,"receipt":500,"payment":0}]}',
    explanation:
      "【基本概念】\n約束手形による決済で、支払手形は支払いの約束（負債）、受取手形は代金回収の権利（資産）を表します。裏書・割引により手形を活用できます。\n\n【具体例・イメージ】\n「○月○日に○○円支払います」という約束の証書をイメージしてください。受け取った側は期日に代金を回収でき、振り出した側は期日に支払い義務があります。\n\n【仕訳パターン】\n・手形振出時: 借方に買掛金等、貸方に支払手形\n・手形受取時: 借方に受取手形、貸方に売掛金等\n・手形決済時: 借方に支払手形、貸方に当座預金等\n・裏書譲渡時: 借方に買掛金等、貸方に受取手形\n・割引時: 借方に当座預金・手形売却損、貸方に受取手形\n\n【間違えやすいポイント】\n・受取手形と支払手形を逆に理解しがち\n・裏書と割引の処理を混同する\n・手形の期日と決済を忘れる\n・他人振出手形は現金扱いを知らない\n\n【覚え方のコツ】\n・「受取」手形は資産、「支払」手形は負債\n・裏書は「他社への支払い」、割引は「銀行で現金化」\n・手形は「支払いの約束証書」\n・期日が来たら必ず決済処理\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.539Z",
  },
  {
    id: "Q_J_017",
    category_id: "journal",
    question_text: "A銀行の当座預金300,000円をB銀行の当座預金に振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座預金","debit_amount":300000,"credit_account":"当座預金","credit_amount":300000}}',
    explanation:
      "同一科目内での銀行間振替は補助科目で区別するが、基本仕訳は当座預金勘定内の振替。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"当座預金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_017",
    category_id: "ledger",
    question_text:
      "【商品有高帳（先入先出法）記入問題】\n\n8月の商品有高帳（先入先出法）を作成してください。\n\n【前月繰越】\n250円\n\n【当月の取引】\n8/5　手形受取　200円\n8/12　手形裏書譲渡　150円\n8/20　手形受取　10円\n8/28　手形満期決済　10円\n\n上記の取引を商品有高帳（先入先出法）に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（先入先出法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"8/1","description":"前月繰越","ref":"","balance":250,"receipt":500,"payment":0},{"date":"8/5","description":"受取","ref":"","balance":400,"receipt":500,"payment":0},{"date":"8/12","description":"裏書譲渡","ref":"","balance":250,"receipt":0,"payment":500},{"date":"8/20","description":"受取","ref":"","balance":350,"receipt":500,"payment":0},{"date":"8/28","description":"満期決済","ref":"","balance":300,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.540Z",
  },
  {
    id: "Q_J_018",
    category_id: "journal",
    question_text:
      "売掛金の回収時に振込手数料440円が差し引かれた。回収額は99,560円であった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座預金","debit_amount":99560,"credit_account":"売掛金","credit_amount":100000}}',
    explanation:
      "振込手数料は支払手数料勘定で処理し、実際の入金額を当座預金に計上する。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座預金基本取引\",\"accounts\":[\"当座預金\",\"売掛金\",\"支払手数料\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座預金基本取引\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_018",
    category_id: "ledger",
    question_text:
      "【商品有高帳（移動平均法）記入問題】\n\n11月の商品有高帳（移動平均法）を作成してください。\n\n【前月繰越】\n450円\n\n【当月の取引】\n11/5　商品仕入　250円\n11/12　仕入返品　10円\n11/20　商品仕入　200円\n11/28　仕入値引　10円\n\n上記の取引を商品有高帳（移動平均法）に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（移動平均法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"11/1","description":"前月繰越","ref":"","balance":450,"receipt":500,"payment":0},{"date":"11/5","description":"仕入","ref":"","balance":500,"receipt":500,"payment":0},{"date":"11/12","description":"仕入返品","ref":"","balance":500,"receipt":0,"payment":500},{"date":"11/20","description":"仕入","ref":"","balance":500,"receipt":500,"payment":0},{"date":"11/28","description":"仕入値引","ref":"","balance":500,"receipt":0,"payment":500}]}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.541Z",
  },
  {
    id: "Q_J_019",
    category_id: "journal",
    question_text:
      "当座預金残高がゼロの状態で、水道光熱費30,000円を当座借越で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"水道光熱費","debit_amount":30000,"credit_account":"当座借越","credit_amount":30000}}',
    explanation:
      "当座預金残高が不足している状態での支払いは当座借越勘定を使用する。費用の発生により水道光熱費を借方に、支払い方法として当座借越を貸方に記入する。仕訳：(借)水道光熱費30,000/(貸)当座借越30,000",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"当座借越\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_019",
    category_id: "ledger",
    question_text:
      "【売掛金元帳・買掛金元帳記入問題】\n\n2月の売掛金元帳・買掛金元帳を作成してください。\n\n【前月繰越】\n500円\n\n【当月の取引】\n2/5　売上取引　350円\n2/12　売上返品　10円\n2/20　売上取引　250円\n2/28　売上値引　10円\n\n上記の取引を売掛金元帳・買掛金元帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売掛金元帳・買掛金元帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"2/1","description":"前月繰越","ref":"","balance":500,"receipt":0,"payment":500},{"date":"2/5","description":"売上","ref":"","balance":500,"receipt":0,"payment":500},{"date":"2/12","description":"売上返品","ref":"","balance":500,"receipt":500,"payment":0},{"date":"2/20","description":"売上","ref":"","balance":500,"receipt":0,"payment":500},{"date":"2/28","description":"売上値引","ref":"","balance":500,"receipt":500,"payment":0}]}',
    explanation:
      "【基本概念】\n約束手形による決済で、支払手形は支払いの約束（負債）、受取手形は代金回収の権利（資産）を表します。裏書・割引により手形を活用できます。\n\n【具体例・イメージ】\n「○月○日に○○円支払います」という約束の証書をイメージしてください。受け取った側は期日に代金を回収でき、振り出した側は期日に支払い義務があります。\n\n【仕訳パターン】\n・手形振出時: 借方に買掛金等、貸方に支払手形\n・手形受取時: 借方に受取手形、貸方に売掛金等\n・手形決済時: 借方に支払手形、貸方に当座預金等\n・裏書譲渡時: 借方に買掛金等、貸方に受取手形\n・割引時: 借方に当座預金・手形売却損、貸方に受取手形\n\n【間違えやすいポイント】\n・受取手形と支払手形を逆に理解しがち\n・裏書と割引の処理を混同する\n・手形の期日と決済を忘れる\n・他人振出手形は現金扱いを知らない\n\n【覚え方のコツ】\n・「受取」手形は資産、「支払」手形は負債\n・裏書は「他社への支払い」、割引は「銀行で現金化」\n・手形は「支払いの約束証書」\n・期日が来たら必ず決済処理\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.542Z",
  },
  {
    id: "Q_J_020",
    category_id: "journal",
    question_text:
      "当座預金残高が50,000円のとき、80,000円の小切手を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"買掛金","debit_amount":80000,"credit_account":"当座預金","credit_amount":50000}}',
    explanation:
      "当座預金残高を超える小切手振出時は当座借越が発生。不足分は当座借越勘定で処理。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"買掛金\",\"当座預金\",\"当座借越\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_020",
    category_id: "ledger",
    question_text:
      "【受取手形記入帳・支払手形記入帳記入問題】\n\n3月の受取手形記入帳・支払手形記入帳を作成してください。\n\n【当月の取引】\n3/5　仕入先Aからの手形受取　150円\n3/12　仕入先Bからの手形受取　200円\n3/20　仕入先Cからの手形受取　10円\n3/28　仕入先Dからの手形受取　150円\n\n上記の取引を受取手形記入帳・支払手形記入帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"受取手形記入帳・支払手形記入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"3/5","description":"仕入先A","ref":"","balance":150,"receipt":500,"payment":0},{"date":"3/12","description":"仕入先B","ref":"","balance":350,"receipt":500,"payment":0},{"date":"3/20","description":"仕入先C","ref":"","balance":450,"receipt":500,"payment":0},{"date":"3/28","description":"仕入先D","ref":"","balance":500,"receipt":500,"payment":0}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"売掛金元帳","accounts":[],"keywords":["売掛金元帳","補助簿","得意先"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.543Z",
  },
  {
    id: "Q_J_021",
    category_id: "journal",
    question_text: "当座借越の利息5,000円が当座預金から自動引き落としされた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"支払利息","debit_amount":5000,"credit_account":"当座預金","credit_amount":5000}}',
    explanation:
      "当座借越利息は支払利息勘定で処理し、通常は当座預金から自動引き落としされる。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"支払利息\",\"当座預金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_021",
    category_id: "ledger",
    question_text:
      "【3伝票制：入金伝票による現金収入取引】\n\n5月の現金収入取引を入金伝票に記録してください。\n\n【取引内容】\n5/1：売掛金300円を現金で回収した。\n5/20：商品400円を現金で売り上げた。\n5/27：得意先から受取手形500円を受け取った。\n\n【作成指示】\n1. 入金伝票を使用して記録\n2. 日付、勘定科目、金額、摘要を正確に記入\n3. 現金の増加取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"入金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["売掛金","売上","受取手形","前受金","雑収入","借入金","資本金","仮受金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["売掛金回収","現金売上","手形受取","前受金受取","その他"]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"入金伝票","entries":[{"date":"5/1","account":"売掛金","amount":500,"description":"売掛金回収"},{"date":"5/20","account":"売上","amount":500,"description":"現金売上"},{"date":"5/27","account":"受取手形","amount":500,"description":"手形受取"}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.544Z",
  },
  {
    id: "Q_L_022",
    category_id: "ledger",
    question_text:
      "【3伝票制：出金伝票による現金支出取引】\n\n2月の現金支出取引を出金伝票に記録してください。\n\n【取引内容】\n2/8：商品500円を現金で仕入れた。\n2/15：従業員の給料500円を現金で支払った。\n2/24：買掛金500円を現金で支払った。\n\n【作成指示】\n1. 出金伝票を使用して記録\n2. 日付、勘定科目、金額、摘要を正確に記入\n3. 現金の減少取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"出金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["買掛金","仕入","支払手形","前払金","給料","水道光熱費","支払家賃","消耗品費","雑費","仮払金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["現金仕入","買掛金支払","給料支払","家賃支払","経費支払","その他"]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"出金伝票","entries":[{"date":"2/8","account":"仕入","amount":500,"description":"現金仕入"},{"date":"2/15","account":"給料","amount":500,"description":"給料支払"},{"date":"2/24","account":"買掛金","amount":500,"description":"買掛金支払"}]}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.545Z",
  },
  {
    id: "Q_J_022",
    category_id: "journal",
    question_text: "当座借越200,000円を現金で返済した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座借越","debit_amount":200000,"credit_account":"現金","credit_amount":200000}}',
    explanation:
      "当座借越の返済は当座借越勘定の減少（借方）と現金の減少（貸方）で処理する。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"当座借越\",\"現金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_J_023",
    category_id: "journal",
    question_text:
      "売掛金の回収300,000円により当座借越が解消され、当座預金残高が3,000円となった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"当座預金","debit_amount":3000,"credit_account":"売掛金","credit_amount":300000}}',
    explanation:
      "当座借越の解消を伴う入金は、借越解消分と預金残高分を区別して処理する。",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"当座預金\",\"当座借越\",\"売掛金\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_L_023",
    category_id: "ledger",
    question_text:
      "【3伝票制：振替伝票による現金以外の取引】\n\n8月の現金以外の取引を振替伝票に記録してください。\n\n【取引内容】\n8/3：商品300円を掛けで仕入れた。\n8/7：商品300円を掛けで売り上げた。\n8/12：買掛金400円について支払手形を振り出した。\n\n【作成指示】\n1. 振替伝票を使用して記録\n2. 借方・貸方の勘定科目と金額を正確に記入\n3. 現金が関わらない取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"8/3","debit_account":"仕入","debit_amount":500,"credit_account":"買掛金","credit_amount":500},{"date":"8/7","debit_account":"売掛金","debit_amount":500,"credit_account":"売上","credit_amount":500},{"date":"8/12","debit_account":"支払手形","debit_amount":500,"credit_account":"買掛金","credit_amount":500}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.546Z",
  },
  {
    id: "Q_L_024",
    category_id: "ledger",
    question_text:
      "【3伝票制：掛け取引の振替伝票記入】\n\n9月の取引を3伝票制により記録してください。\n\n【取引内容】\n27日：取引金額 10円\n24日：取引金額 200円\n11日：取引金額 150円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"9/11","debit_account":"売掛金","debit_amount":500,"credit_account":"売上","credit_amount":500},{"date":"9/24","debit_account":"仕入","debit_amount":500,"credit_account":"買掛金","credit_amount":500},{"date":"9/27","debit_account":"買掛金","debit_amount":500,"credit_account":"支払手形","credit_amount":500}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.547Z",
  },
  {
    id: "Q_J_024",
    category_id: "journal",
    question_text:
      "当座預金残高がゼロの状態で、買掛金2,500円を当座借越で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"買掛金","debit_amount":2500,"credit_account":"当座借越","credit_amount":2500}}',
    explanation:
      "当座預金残高がない場合の支払いは当座借越で処理する。買掛金の支払義務を減少させ、当座借越（負債）を増加させる。仕訳：(借)買掛金2,500/(貸)当座借越2,500",
    difficulty: 2,
    tags_json:
      '{\"subcategory\":\"cash_deposit\",\"pattern\":\"当座預金\",\"subpattern\":\"当座借越\",\"accounts\":[\"当座借越\"],\"keywords\":[\"現金・預金\",\"当座預金\",\"当座借越\"],\"examSection\":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T18:00:00Z",
  },
  {
    id: "Q_J_025",
    category_id: "journal",
    question_text:
      "当座預金口座に利息800円が入金された（源泉徴収税は銀行で差し引き済み）。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":800,"credit_account":"受取利息","credit_amount":800}}',
    explanation:
      "【基本概念】\n当座預金に利息が付く場合の処理です。銀行預金の利息には源泉徴収税が課されますが、この問題では源泉徴収税は銀行で既に差し引かれた後の手取り額が入金された設定となっています。\n\n【具体例・イメージ】\n銀行から「当座預金に利息800円を入金しました（源泉徴収税200円は差し引き済み）」という通知が来た状況です。実際に口座残高が800円増加します。\n\n【仕訳パターン】\n借方：当座預金（実際の入金額）\n貸方：受取利息（手取り額）\n\n【間違えやすいポイント】\n・源泉徴収税の処理を複雑に考えすぎる\n・利息総額と手取り額を混同してしまう\n・当座預金と普通預金の利息処理を混同する\n\n【覚え方のコツ】\n・「銀行差し引き済み」＝手取り額での単純仕訳\n・当座預金が増える＝借方に当座預金\n・利息収入が発生＝貸方に受取利息\n\n【この問題の仕訳】\n当座預金 800円 / 受取利息 800円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金","subpattern":"当座預金利息・手数料","accounts":["当座預金","受取利息"],"keywords":["現金・預金","当座預金","当座預金利息・手数料"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:00:00Z",
  },
  {
    id: "Q_L_025",
    category_id: "ledger",
    question_text:
      "【3伝票制：一部現金取引の伝票分割】\n\n5月の取引を3伝票制により記録してください。\n\n【取引内容】\n13日：取引金額 250円\n27日：取引金額 250円\n28日：取引金額 250円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"5/13","debit_account":"仕入","debit_amount":500,"credit_account":"現金","credit_amount":500},{"date":"5/13","debit_account":"","debit_amount":0,"credit_account":"買掛金","credit_amount":500},{"date":"5/27","debit_account":"売掛金","debit_amount":500,"credit_account":"売上","credit_amount":500},{"date":"5/28","debit_account":"現金","debit_amount":500,"credit_account":"売上","credit_amount":500}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.548Z",
  },
  {
    id: "Q_J_026",
    category_id: "journal",
    question_text: "当座預金口座から銀行手数料300円が自動引落された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手数料","debit_amount":300,"credit_account":"当座預金","credit_amount":300}}',
    explanation:
      "【基本概念】\n銀行が提供するサービス利用に対する手数料が自動的に預金口座から引き落とされる処理です。振込手数料、口座維持手数料、ATM利用手数料などが該当し、銀行が事前に通知した上で口座から差し引きます。\n\n【具体例・イメージ】\n銀行から「今月の口座維持手数料300円を当座預金から引き落としました」という通知が来た状況です。通帳を見ると口座残高が300円減っています。\n\n【仕訳パターン】\n借方：支払手数料（銀行サービスの対価）\n貸方：当座預金（口座からの引き落とし）\n\n【間違えやすいポイント】\n・手数料の種類による勘定科目の使い分け\n・自動引落と振込手数料の区別\n・普通預金と当座預金の処理を混同する\n・支払手数料以外の勘定科目（雑費など）を使ってしまう\n\n【覚え方のコツ】\n・「銀行への支払い」＝支払手数料\n・「当座預金から引き落とし」＝貸方に当座預金\n・自動引落は銀行が勝手に行う処理\n・費用が発生するので借方に費用科目\n\n【この問題の仕訳】\n支払手数料 300円 / 当座預金 300円",
    difficulty: 1,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金","subpattern":"当座預金利息・手数料","accounts":["支払手数料","当座預金"],"keywords":["現金・預金","当座預金","当座預金利息・手数料"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:01:00Z",
  },
  {
    id: "Q_L_026",
    category_id: "ledger",
    question_text:
      "【3伝票制：3伝票から仕訳日計表への集計】\n\n11月の取引を3伝票制により記録してください。\n\n【取引内容】\n28日：取引金額 150円\n12日：取引金額 300円\n4日：取引金額 150円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"11/4","debit_account":"備品","debit_amount":500,"credit_account":"未払金","credit_amount":500},{"date":"11/12","debit_account":"売掛金","debit_amount":500,"credit_account":"売上","credit_amount":500},{"date":"11/28","debit_account":"買掛金","debit_amount":500,"credit_account":"支払手形","credit_amount":500}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.549Z",
  },
  {
    id: "Q_J_027",
    category_id: "journal",
    question_text:
      "取引先への買掛金5,000円を振込で支払った。振込手数料220円は先方負担とし、4,780円を振込んだ。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":5000,"credit_account":"当座預金","credit_amount":4780}}',
    explanation:
      "【基本概念】\n振込手数料の負担区分処理です。振込手数料を先方負担とする場合、振込金額から手数料を差し引いて支払い、手数料分は立替金として処理します。今回は簡略化のため立替金の仕訳は省略しています。\n\n【具体例・イメージ】\n「買掛金5,000円をお支払いしますが、振込手数料220円は御社負担でお願いします」という取り決めで、実際の振込額は4,780円になる状況です。\n\n【仕訳パターン】\n・先方負担時: 買掛金（総額）/ 当座預金（振込額）\n・当社負担時: 買掛金 / 当座預金, 支払手数料 / 当座預金\n\n【間違えやすいポイント】\n・振込手数料の負担者を混同する\n・立替金の処理を複雑に考えすぎる\n・振込額と買掛金額を一致させてしまう\n・手数料を別途費用計上してしまう\n\n【覚え方のコツ】\n・「先方負担」＝振込額から差し引き\n・買掛金は契約通りの満額で消し込み\n・当座預金は実際の振込額で減額\n・差額は相手方との精算事項\n\n【この問題の仕訳】\n買掛金 5,000円 / 当座預金 4,780円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金","subpattern":"当座預金利息・手数料","accounts":["買掛金","当座預金"],"keywords":["現金・預金","当座預金","当座預金利息・手数料"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_L_027",
    category_id: "ledger",
    question_text:
      "【5伝票制：売上伝票による売上取引専用記録】\n\n11月の取引を5伝票制により記録してください。\n\n【取引内容】\n22日：取引金額 500円\n7日：取引金額 500円\n18日：取引金額 300円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"売上伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"customer","label":"得意先","type":"text","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"売上伝票","entries":[{"date":"11/7","customer":"A社","amount":500,"description":"商品売上"},{"date":"11/18","customer":"B社","amount":500,"description":"商品売上"},{"date":"11/22","customer":"C社","amount":500,"description":"商品売上"}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.550Z",
  },
  {
    id: "Q_J_028",
    category_id: "journal",
    question_text: "普通預金口座開設のため、現金100,000円を預け入れた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":100000,"credit_account":"現金","credit_amount":100000}}',
    explanation:
      "【基本概念】\n普通預金は銀行に預けた資金で、いつでも自由に預け入れや引き出しができる流動性の高い預金です。口座開設時は現金を預け入れることで普通預金残高が増加します。\n\n【具体例・イメージ】\n銀行の窓口やATMで現金を預け入れる日常的な取引をイメージしてください。手持ちの現金が銀行の普通預金口座に移ります。\n\n【仕訳パターン】\n・預け入れ時: 借方に普通預金、貸方に現金\n・引き出し時: 借方に現金、貸方に普通預金\n・振込入金時: 借方に普通預金、貸方に対象科目\n・振込支払時: 借方に対象科目、貸方に普通預金\n\n【間違えやすいポイント】\n・当座預金と普通預金の使い分けを混同しやすい\n・預け入れと引き出しの借方・貸方を逆にしがち\n・普通預金は資産勘定であることを忘れがち\n\n【覚え方のコツ】\n・普通預金は「財布から銀行へ」→現金が減って預金が増える\n・資産の増減は同じ借方・貸方の関係\n・普通預金は流動資産として貸借対照表に計上\n\n【この問題の仕訳】\n普通預金 100,000 ／ 現金 100,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["普通預金","現金"],"keywords":["普通預金","口座開設","資金預入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.641Z",
  },
  {
    id: "Q_L_028",
    category_id: "ledger",
    question_text:
      "【5伝票制：仕入伝票による仕入取引専用記録】\n\n4月の取引を5伝票制により記録してください。\n\n【取引内容】\n17日：取引金額 200円\n11日：取引金額 200円\n28日：取引金額 150円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"仕入伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"supplier","label":"仕入先","type":"text","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"仕入伝票","entries":[{"date":"4/11","supplier":"X商事","amount":500,"description":"商品仕入"},{"date":"4/17","supplier":"Y商店","amount":500,"description":"商品仕入"},{"date":"4/28","supplier":"Z商会","amount":500,"description":"商品仕入"}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.551Z",
  },
  {
    id: "Q_J_029",
    category_id: "journal",
    question_text: "普通預金口座から事業資金として現金50,000円を引き出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":50000,"credit_account":"普通預金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n普通預金から現金を引き出す取引です。銀行ATMや窓口で普通預金口座から現金を引き出すと、現金（手元資金）が増加し、普通預金残高が減少します。\n\n【具体例・イメージ】\n銀行のATMでキャッシュカードを使って現金を引き出す日常的な取引をイメージしてください。口座残高が減り、手元の現金が増えます。\n\n【仕訳パターン】\n・現金引出時: 借方に現金、貸方に普通預金\n・振込による支払時: 借方に対象科目、貸方に普通預金\n・ATM手数料発生時: 借方に支払手数料、貸方に普通預金\n\n【間違えやすいポイント】\n・預け入れと引き出しの借方・貸方を逆にしがち\n・普通預金と当座預金の使い分けを混同しやすい\n・ATM手数料を含む場合の処理を忘れがち\n\n【覚え方のコツ】\n・「銀行から財布へ」→現金が増えて預金が減る\n・現金は借方、普通預金は貸方\n・資産同士の振替（現金↑、普通預金↓）\n\n【この問題の仕訳】\n現金 50,000 ／ 普通預金 50,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["現金","普通預金"],"keywords":["普通預金","現金引出","事業資金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.642Z",
  },
  {
    id: "Q_L_029",
    category_id: "ledger",
    question_text:
      "【5伝票制：5伝票制での取引分類・適用判定】\n\n4月の取引を5伝票制により記録してください。\n\n【取引内容】\n25日：取引金額 500円\n25日：取引金額 500円\n8日：取引金額 450円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["売掛金","売上","受取手形","前受金","雑収入","借入金","資本金","仮受金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"5伝票制組合せ","entries":[{"voucher":"仕入伝票","date":"4/8","amount":500,"description":"商品仕入"},{"voucher":"売上伝票","date":"4/25","amount":500,"description":"商品売上"},{"voucher":"入金伝票","date":"4/25","account":"売掛金","amount":500,"description":"売掛金回収"}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.552Z",
  },
  {
    id: "Q_J_030",
    category_id: "journal",
    question_text:
      "水道光熱費8,000円が普通預金口座から自動引落により支払われた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"水道光熱費","debit_amount":8000,"credit_account":"普通預金","credit_amount":8000}}',
    explanation:
      "【基本概念】\n公共料金（水道光熱費）の自動引落による支払いです。銀行と契約して口座振替を設定すると、毎月決まった日に普通預金口座から公共料金が自動的に引き落とされ、支払いが完了します。\n\n【具体例・イメージ】\n電気代やガス代、水道代などの公共料金を、毎月銀行口座から自動的に引き落とす契約をイメージしてください。支払い忘れがなく、便利な決済方法です。\n\n【仕訳パターン】\n・水道光熱費の自動引落: 借方に水道光熱費、貸方に普通預金\n・電話代の自動引落: 借方に通信費、貸方に普通預金\n・家賃の自動引落: 借方に支払家賃、貸方に普通預金\n・保険料の自動引落: 借方に支払保険料、貸方に普通預金\n\n【間違えやすいポイント】\n・費用の勘定科目を間違えやすい（電気代→水道光熱費）\n・現金ではなく普通預金から引き落とされることを忘れがち\n・引落日と使用期間のズレを考慮する必要がある場合もある\n\n【覚え方のコツ】\n・「自動引落」→「普通預金から直接支払い」\n・費用が発生して預金が減る\n・借方に費用科目、貸方に普通預金\n・現金を使わない支払い方法\n\n【この問題の仕訳】\n水道光熱費 8,000 ／ 普通預金 8,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["水道光熱費","普通預金"],"keywords":["普通預金","自動引落","公共料金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.643Z",
  },
  {
    id: "Q_L_030",
    category_id: "ledger",
    question_text:
      "【5伝票制：5伝票から総勘定元帳への転記】\n\n8月の取引を5伝票制により記録してください。\n\n【取引内容】\n8日：取引金額 500円\n8日：取引金額 500円\n4日：取引金額 500円\n\n【作成指示】\n1. 5伝票制の特徴理解\n2. 売上・仕入専用伝票の使用\n3. 他の伝票との使い分け\n4. 総勘定元帳への正確な転記",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["買掛金","仕入","支払手形","前払金","給料","水道光熱費","支払家賃","消耗品費","雑費","仮払金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["売上取引","仕入取引","回収取引","支払取引","経費支払","給料支払","売掛金回収","買掛金支払","手形受取","手形支払","備品購入","現金売上","掛売上","現金仕入","掛仕入","返品処理","値引処理","振替取引","決算整理","月末処理",""]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"5伝票制総勘定元帳転記","entries":[{"voucher":"出金伝票","date":"8/4","account":"給料","amount":500},{"voucher":"売上伝票","date":"8/8","customer":"得意先","amount":500},{"voucher":"仕入伝票","date":"8/8","supplier":"仕入先","amount":500}]}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"voucher","pattern":"入金伝票","accounts":[],"keywords":["入金伝票","現金売上","3伝票制"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.553Z",
  },
  {
    id: "Q_L_031",
    category_id: "ledger",
    question_text:
      "【理論問題：簿記の基本原理と記帳体系】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n簿記は（ア）簿記の原理に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。\nこの方法により、常に（エ）が保たれ、記録の正確性を検証できる。\n\n【選択肢】\nA. 複式\nB. 借方\nC. 貸方\nD. 貸借平均の原理\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["複式","借方","貸方","貸借平均の原理"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"複式","b":"借方","c":"貸方","d":"貸借平均の原理"}}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.553Z",
  },
  {
    id: "Q_J_031",
    category_id: "journal",
    question_text: "従業員の給与50,000円が普通預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":50000,"credit_account":"給与","credit_amount":50000}}',
    explanation:
      "【基本概念】\n普通預金は銀行に開設する一般的な預金口座で、給与振込や各種支払い・入金に使用されます。利息が付く場合があります。\n\n【具体例・イメージ】\n会社の給与が銀行振込で従業員の口座に入金される場面をイメージしてください。給与支払い側では給与（費用）の発生と普通預金（資産）の増加が同時に起こります。\n\n【仕訳パターン】\n・給与振込受取時: 借方に普通預金、貸方に給与\n・普通預金からの引出時: 借方に現金、貸方に普通預金\n・普通預金への現金預入時: 借方に普通預金、貸方に現金\n\n【間違えやすいポイント】\n・普通預金と当座預金の区別\n・給与は費用項目として貸方に計上\n・振込手数料がある場合の処理\n\n【覚え方のコツ】\n・「普通預金」= 一般的な銀行口座\n・給与振込 = 給与費用の発生と普通預金資産の増加\n・入金で普通預金増加（借方）、給与費用発生（貸方）\n\n【この問題の仕訳】\n（借方）普通預金 50,000円　（貸方）給与 50,000円\n給与振込による普通預金口座への入金を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["普通預金","給与"],"keywords":["普通預金","給与振込","振込入金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.644Z",
  },
  {
    id: "Q_L_032",
    category_id: "ledger",
    question_text:
      "【理論問題：仕訳の原則と借方・貸方の理解】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n資産の増加は（ア）に、負債の増加は（イ）に記入する。\n収益の発生は（ウ）に、費用の発生は（エ）に記入する。\n\n【選択肢】\nA. 借方\nB. 貸方\nC. 左\nD. 右\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["借方","貸方","左","右"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"D","d":"C"},"correctText":{"a":"借方","b":"貸方","c":"右","d":"左"}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.554Z",
  },
  {
    id: "Q_J_032",
    category_id: "journal",
    question_text: "普通預金の利息800円（源泉徴収税額80円）が入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":720,"credit_account":"受取利息","credit_amount":720}}',
    explanation:
      "【基本概念】\n普通預金に付与される利息収入で、銀行が所得税を源泉徴収してから入金される仕組みです。総支給額から源泉徴収税額を差し引いた差引支給額が実際に入金されます。\n\n【具体例・イメージ】\n銀行預金の利息800円のうち、80円が税金として差し引かれ、残りの720円が口座に入金される場面をイメージしてください。給与の源泉徴収と同様の仕組みです。\n\n【仕訳パターン】\n・簡便法（差引支給額のみ記録）: 借方に普通預金720円、貸方に受取利息720円\n・原則法（総額主義）: 借方に普通預金720円・租税公課80円、貸方に受取利息800円\n・年間20万円以下は申告不要（非課税枠あり）\n\n【間違えやすいポイント】\n・総額と差引額の処理方法の使い分け\n・受取利息は営業外収益（本業以外の収入）\n・源泉徴収税は租税公課（費用）として処理\n\n【覚え方のコツ】\n・預金利息は「もらった収入」なので貸方に受取利息\n・実際に入金された金額を借方の普通預金に計上\n・税金は後から還付される可能性があるため租税公課で処理\n\n【この問題の仕訳】\n（借方）普通預金 720円　（貸方）受取利息 720円\n利息800円から源泉徴収税80円を差し引いた720円の入金を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["普通預金","受取利息"],"keywords":["普通預金","利息受取","源泉徴収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.645Z",
  },
  {
    id: "Q_J_033",
    category_id: "journal",
    question_text: "当座預金から普通預金に30,000円を振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":30000,"credit_account":"当座預金","credit_amount":30000}}',
    explanation:
      "【基本概念】\n同一銀行内での預金口座間の資金移動処理です。普通預金と当座預金はどちらも銀行預金ですが、特徴が異なるため、資金管理の都合で口座間の振替を行うことがあります。\n\n【具体例・イメージ】\n会社が当座預金から普通預金に資金を移す場面をイメージしてください。当座預金（利息なし・小切手決済用）から普通預金（利息あり・貯蓄用）に資金を移すことで、効率的な資金管理を行います。\n\n【仕訳パターン】\n・当座預金→普通預金の振替: 借方に普通預金、貸方に当座預金\n・普通預金→当座預金の振替: 借方に当座預金、貸方に普通預金\n・同一銀行内での振替手数料は通常無料または少額\n\n【間違えやすいポイント】\n・振替の方向（どちらからどちらに移すか）を逆にしてしまう\n・両方とも資産勘定なので、増減の関係に注意\n・振替手数料がある場合の処理方法\n\n【覚え方のコツ】\n・「振替先」の口座が増える（借方に記入）\n・「振替元」の口座が減る（貸方に記入）\n・銀行預金同士の移動は現金は動かない\n・当座預金→普通預金なら「普通預金／当座預金」\n\n【この問題の仕訳】\n（借方）普通預金 30,000円　（貸方）当座預金 30,000円\n当座預金から普通預金への振替処理を記録します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"普通預金取引","accounts":["普通預金","当座預金"],"keywords":["普通預金","当座預金","口座振替"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.646Z",
  },
  {
    id: "Q_L_033",
    category_id: "ledger",
    question_text:
      "【理論問題：帳簿組織と補助簿の役割】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n（ア）は、すべての取引を仕訳帳に記入し、（イ）に転記する主要簿である。\n一方、（ウ）や（エ）などの補助簿は、特定の取引を詳細に記録する。\n\n【選択肢】\nA. 仕訳帳\nB. 総勘定元帳\nC. 現金出納帳\nD. 売掛金元帳\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["仕訳帳","総勘定元帳","現金出納帳","売掛金元帳"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"仕訳帳","b":"総勘定元帳","c":"現金出納帳","d":"売掛金元帳"}}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.555Z",
  },
  {
    id: "Q_J_034",
    category_id: "journal",
    question_text:
      "普通預金口座からATMで現金50,000円を引き出し、手数料110円がかかった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"小口現金","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。\n\n【具体例・イメージ】\n大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。\n\n【仕訳パターン】\n・前渡し時: 借方に小口現金、貸方に現金\n・支払報告時: 借方に各種費用、貸方に小口現金\n・補給時: 借方に小口現金、貸方に現金（使用分のみ）\n・即時補給: 借方に各種費用、貸方に現金（まとめて処理）\n\n【間違えやすいポイント】\n・「前渡し」と「補給」の処理を混同しやすい\n・補給時は使用した金額分だけを処理する\n・小口現金は資産勘定で、常に一定額を保持する\n・仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）\n\n【覚え方のコツ】\n・「小口現金を渡す」→「小口現金が増える（借方）」\n・「小さな支払い用の現金」→「小口現金」\n・定額制なので、使った分だけ補給する\n・①前渡し→②支払い→③報告→④補給のサイクル\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"小口現金","accounts":["小口現金","現金"],"keywords":["小口現金","前渡し","インプレスト"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.647Z",
  },
  {
    id: "Q_L_034",
    category_id: "ledger",
    question_text:
      "【理論問題：伝票制度の種類と特徴】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n3伝票制では、（ア）伝票、（イ）伝票、振替伝票の3種類を使用する。\n5伝票制では、さらに（ウ）伝票と（エ）伝票が追加される。\n\n【選択肢】\nA. 入金\nB. 出金\nC. 売上\nD. 仕入\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["入金","出金","売上","仕入"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"入金","b":"出金","c":"売上","d":"仕入"}}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.556Z",
  },
  {
    id: "Q_L_035",
    category_id: "ledger",
    question_text:
      "【理論問題：試算表の種類と作成目的】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n（ア）試算表は借方合計と貸方合計を表示し、（イ）試算表は借方残高と貸方残高を表示する。\n（ウ）試算表は両者を組み合わせたもので、最も情報量が多い。\n試算表の主な目的は（エ）の検証である。\n\n【選択肢】\nA. 合計\nB. 残高\nC. 合計残高\nD. 転記の正確性\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["合計","残高","合計残高","転記の正確性"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"合計","b":"残高","c":"合計残高","d":"転記の正確性"}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.557Z",
  },
  {
    id: "Q_J_035",
    category_id: "journal",
    question_text: "売掛金10円が当座預金口座に振り込まれた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":500,"credit_account":"売掛金","credit_amount":500}}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"当座預金振込","accounts":["当座預金","売掛金"],"keywords":["当座預金","振込","売掛金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.648Z",
  },
  {
    id: "Q_J_036",
    category_id: "journal",
    question_text:
      "普通預金から500,000円を定期預金に預け入れ、定期預金証書を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"定期預金","debit_amount":500000,"credit_account":"普通預金","credit_amount":500000}}',
    explanation:
      "【基本概念】\n定期預金は満期まで預け入れることを前提とした預金で、普通預金よりも高い利息が得られる金融商品です。預け入れ時に定期預金証書が発行され、満期日まで引き出しが制限されます。\n\n【具体例・イメージ】\n余裕資金を銀行に一定期間預けて利息収入を得る投資をイメージしてください。普通預金から定期預金へ資金を移すことで、より高い利回りを期待できます。\n\n【仕訳パターン】\n・定期預金預入時: 借方に定期預金、貸方に普通預金\n・満期解約時: 借方に普通預金、貸方に定期預金（元本）+ 受取利息（利息分）\n・中途解約時: 借方に普通預金、貸方に定期預金 + 雑損失（違約金分）\n\n【間違えやすいポイント】\n・定期預金と普通預金は両方とも資産勘定\n・満期時の利息計算と源泉徴収の処理\n・中途解約時の違約金処理を忘れがち\n\n【覚え方のコツ】\n・定期預金 = 満期まで引き出せない預金（資産）\n・預入 = 普通預金から定期預金へ振替\n・満期 = 定期預金から普通預金へ振替 + 利息\n\n【この問題の仕訳】\n普通預金から定期預金への資金移動なので、資産の振替取引です。\n（借）定期預金 500,000 （貸）普通預金 500,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["定期預金","普通預金"],"keywords":["定期預金","定期預金証書","預け入れ"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.648Z",
  },
  {
    id: "Q_L_036",
    category_id: "ledger",
    question_text:
      "【理論問題：決算整理の意義と手続き】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n決算整理では、（ア）の原則に従い収益と費用を適切な期間に配分する。\n（イ）は次期に繰り越す商品の金額を、（ウ）は使用により価値が減少した固定資産の金額を調整する。\n（エ）は回収不能と見込まれる債権に対して設定する。\n\n【選択肢】\nA. 発生主義\nB. 棚卸\nC. 減価償却\nD. 貸倒引当金\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["発生主義","棚卸","減価償却","貸倒引当金"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"発生主義","b":"棚卸","c":"減価償却","d":"貸倒引当金"}}',
    explanation:
      "【基本概念】\n資本金の増加や個人事業主の引出し、当期純利益の振替など、資本（純資産）に関する取引です。個人と法人で処理方法が異なります。\n\n【具体例・イメージ】\n個人事業主が生活費を事業用口座から引き出したり、出資者が会社に資金を投入したりする状況をイメージしてください。\n\n【仕訳パターン】\n・資本金受入時: 借方に現金、貸方に資本金\n・引出時（個人）: 借方に引出金、貸方に現金\n・当期純利益振替時: 借方に損益、貸方に資本金\n\n【間違えやすいポイント】\n・個人と法人の処理を混同する\n・引出金と費用を間違える\n・損益振替の方向を間違える\n・資本金と資本準備金を混同する\n\n【覚え方のコツ】\n・引出金は「資本の減少」\n・資本金は「出資者からの調達」\n・損益振替は「利益なら資本増加」\n・個人は引出金、法人は配当金\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.558Z",
  },
  {
    id: "Q_J_037",
    category_id: "journal",
    question_text:
      "定期預金500,000円が満期となり、利息20,000円とともに普通預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":520000,"credit_account":"定期預金","credit_amount":500000}}',
    explanation:
      "【基本概念】\n定期預金が満期を迎えると、預け入れた元本と利息を受け取ることができます。通常は普通預金口座に入金され、利息部分は収益として計上します。\n\n【具体例・イメージ】\n1年間500万円を定期預金に預け、満期時に元本500万円＋利息20万円の計520万円を受け取る状況をイメージしてください。\n\n【仕訳パターン】\n・満期解約時: 借方に普通預金、貸方に定期預金（元本）+ 受取利息（利息分）\n・源泉徴収がある場合: 借方に普通預金＋仮払税金、貸方に定期預金＋受取利息\n\n【間違えやすいポイント】\n・元本と利息を分けて計上することを忘れがち\n・定期預金は満期時に全額取り崩される\n・源泉徴収税がある場合の処理\n\n【覚え方のコツ】\n・定期預金（元本）→ 普通預金（元本分）\n・利息分は「受取利息」という収益勘定\n・預金の種類は変わるが、全体的には資産内の振替\n\n【この問題の仕訳】\n定期預金の満期解約で元本500,000円と利息20,000円を受取ります。\n（借）普通預金 520,000 （貸）定期預金 500,000\n　　　　　　　　　　　　　　　受取利息  20,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["普通預金","定期預金","受取利息"],"keywords":["定期預金","満期解約","利息計算"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.649Z",
  },
  {
    id: "Q_L_037",
    category_id: "ledger",
    question_text:
      "【理論問題：財務諸表の構成要素】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n貸借対照表は（ア）、負債、純資産から構成され、企業の財政状態を表す。\n損益計算書は（イ）から（ウ）を差し引いて当期純利益を算定する。\n（エ）は期中の純資産の変動を示す計算書である。\n\n【選択肢】\nA. 資産\nB. 収益\nC. 費用\nD. 株主資本等変動計算書\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["資産","収益","費用","株主資本等変動計算書"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"収益","c":"費用","d":"株主資本等変動計算書"}}',
    explanation:
      "【基本概念】\n損益計算書（1年間の経営成績）と貸借対照表（期末時点の財政状態）からなる企業の成績表。ステークホルダーに経営状況を報告する重要な書類です。\n\n【具体例・イメージ】\n学校の成績表のように、企業の1年間の成績（利益）と期末時点の財産状況を表にまとめたものをイメージしてください。\n\n【仕訳パターン】\n・損益計算書: 収益－費用＝当期純利益\n・貸借対照表: 資産＝負債＋純資産\n・当期純利益の貸借対照表への組み入れ\n\n【間違えやすいポイント】\n・PLとBSの役割を混同する\n・勘定科目の分類を間違える\n・当期純利益の表示場所を間違える\n・貸借の均衡を理解していない\n\n【覚え方のコツ】\n・PLは「期間の成績」、BSは「時点の状況」\n・PLの利益はBSの純資産に加算\n・資産＝負債＋純資産は絶対法則\n・投資家・債権者が見る「通信簿」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.559Z",
  },
  {
    id: "Q_L_038",
    category_id: "ledger",
    question_text:
      "【理論問題：勘定科目の分類と体系】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n勘定科目は大きく5つに分類される。\n貸借対照表項目は（ア）、（イ）、純資産の3つ、\n損益計算書項目は（ウ）と（エ）の2つである。\n\n【選択肢】\nA. 資産\nB. 負債\nC. 収益\nD. 費用\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["資産","負債","収益","費用"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"負債","c":"収益","d":"費用"}}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.560Z",
  },
  {
    id: "Q_J_038",
    category_id: "journal",
    question_text:
      "定期預金300,000円を満期前に中途解約し、違約金5,000円を差し引かれて普通預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":295000,"credit_account":"定期預金","credit_amount":300000}}',
    explanation:
      "【基本概念】\n定期預金を満期前に解約する場合、約定利率よりも低い利率が適用され、違約金が発生することがあります。中途解約時の違約金は雑損失として計上します。\n\n【具体例・イメージ】\n急にお金が必要になり、1年定期の定期預金を6ヶ月で解約する状況をイメージしてください。銀行は約束の満期まで預けてもらえなかったペナルティとして違約金を徴収します。\n\n【仕訳パターン】\n・中途解約時: 借方に普通預金＋雑損失（違約金）、貸方に定期預金\n・利息がある場合: 借方に普通預金、貸方に定期預金＋受取利息、借方に雑損失\n\n【間違えやすいポイント】\n・違約金を忘れて元本のみで処理してしまう\n・違約金は費用（雑損失）として処理する\n・定期預金は解約時に帳簿から消える\n\n【覚え方のコツ】\n・中途解約 = 約束を破る = 違約金（ペナルティ）\n・違約金 = 雑損失（費用）\n・受取金額 = 元本 - 違約金\n・定期預金は全額取り崩される\n\n【この問題の仕訳】\n定期預金300,000円を中途解約し、違約金5,000円を差し引かれて295,000円を受取ります。\n（借）普通預金 295,000 （貸）定期預金 300,000\n　　　雑損失　　 5,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["普通預金","定期預金","雑損失"],"keywords":["定期預金","中途解約","違約金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.650Z",
  },
  {
    id: "Q_L_039",
    category_id: "ledger",
    question_text:
      "【理論問題：簿記上の取引の定義】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n簿記上の取引とは、企業の（ア）に増減をもたらす事象をいう。\n契約の締結は簿記上の取引に（イ）。\n火災による商品の焼失は簿記上の取引に（ウ）。\n簿記上の取引は必ず（エ）の原因となる。\n\n【選択肢】\nA. 資産・負債・純資産\nB. 該当しない\nC. 該当する\nD. 仕訳\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["資産・負債・純資産","該当しない","該当する","仕訳"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産・負債・純資産","b":"該当しない","c":"該当する","d":"仕訳"}}',
    explanation:
      "【基本概念】\n主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。\n\n【具体例・イメージ】\n図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。\n\n【仕訳パターン】\n・仕訳帳→総勘定元帳への転記\n・補助元帳への記入\n・試算表の作成\n・財務諸表の作成\n\n【間違えやすいポイント】\n・転記のミスや記入漏れ\n・勘定科目の残高計算間違い\n・補助簿との照合を忘れる\n・試算表の貸借不一致\n\n【覚え方のコツ】\n・仕訳帳は「時系列の記録」\n・総勘定元帳は「科目別の整理」\n・補助簿は「詳細情報の管理」\n・転記は「左は左、右は右」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.561Z",
  },
  {
    id: "Q_J_039",
    category_id: "journal",
    question_text:
      "自動継続定期預金400,000円が満期を迎え、利息15,000円とともに新たな定期預金として再預入された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"定期預金","debit_amount":415000,"credit_account":"定期預金","credit_amount":400000}}',
    explanation:
      "【基本概念】\n自動継続定期預金は満期時に元本と利息を合わせて新たな定期預金として自動的に継続される預金商品です。利息部分は収益として計上し、新たな定期預金元本として処理します。\n\n【具体例・イメージ】\n1年定期400万円が満期となり、利息15万円とともに合計415万円で新たな1年定期がスタートする状況をイメージしてください。手続き不要で自動的に継続されます。\n\n【仕訳パターン】\n・自動継続時: 借方に定期預金（新規）、貸方に定期預金（旧）+ 受取利息\n・解約停止時: 借方に普通預金、貸方に定期預金\n\n【間違えやすいポイント】\n・利息分を忘れて元本のみで処理してしまう\n・新旧の定期預金を同じ金額で処理してしまう\n・受取利息を計上し忘れる\n\n【覚え方のコツ】\n・自動継続 = 満期時に自動で新契約\n・新定期預金額 = 旧元本 + 利息\n・利息は収益（受取利息）として計上\n・定期預金勘定内での振替取引\n\n【この問題の仕訳】\n定期預金400,000円に利息15,000円が加わり、415,000円の新定期預金になります。\n（借）定期預金 415,000 （貸）定期預金 400,000\n　　　　　　　　　　　　　　　受取利息  15,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["定期預金","受取利息"],"keywords":["定期預金","自動継続","再預入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.651Z",
  },
  {
    id: "Q_L_040",
    category_id: "ledger",
    question_text:
      "【理論問題：複式簿記の特徴と利点】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n複式簿記の最大の特徴は、（ア）と（イ）を同時に把握できることである。\nまた、（ウ）により記録の正確性を自己検証でき、\n（エ）の作成により利害関係者への情報提供が可能となる。\n\n【選択肢】\nA. 財政状態\nB. 経営成績\nC. 貸借平均の原理\nD. 財務諸表\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["財政状態","経営成績","貸借平均の原理","財務諸表"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"財政状態","b":"経営成績","c":"貸借平均の原理","d":"財務諸表"}}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:59:45.562Z",
  },
  {
    id: "Q_J_040",
    category_id: "journal",
    question_text:
      "定期預金を担保として銀行から200,000円を借り入れ、普通預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":200000,"credit_account":"借入金","credit_amount":200000}}',
    explanation:
      "【基本概念】\n定期預金を担保として銀行から資金を借り入れる制度です。定期預金の元本の一定割合（通常90%程度）まで借り入れが可能で、定期預金の利率より若干高い利率で借り入れできます。\n\n【具体例・イメージ】\n500万円の定期預金を担保に、急な資金需要で450万円を借り入れる状況をイメージしてください。定期預金は解約せずに済み、低利で資金調達できます。\n\n【仕訳パターン】\n・借入時: 借方に普通預金、貸方に借入金\n・利息支払時: 借方に支払利息、貸方に普通預金\n・返済時: 借方に借入金、貸方に普通預金\n\n【間違えやすいポイント】\n・定期預金は担保として残り続ける（取り崩されない）\n・担保貸付も通常の借入金として処理\n・定期預金勘定に変更はない\n\n【覚え方のコツ】\n・担保貸付 = 定期預金は残して借入\n・定期預金 ≠ 借入金（別々の取引）\n・借入金 = 返済義務のある負債\n・定期預金は担保として継続保有\n\n【この問題の仕訳】\n定期預金を担保として200,000円を借り入れ、普通預金に入金されました。\n（借）普通預金 200,000 （貸）借入金 200,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["普通預金","借入金"],"keywords":["定期預金","担保貸付","借入金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.652Z",
  },
  {
    id: "Q_J_041",
    category_id: "journal",
    question_text:
      "米ドル建て定期預金10,000ドルを決算時に評価替えした結果、為替差益30,000円が発生した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"定期預金","debit_amount":30000,"credit_account":"為替差益","credit_amount":30000}}',
    explanation:
      "【基本概念】\n外貨建て定期預金は決算時に期末レートで評価替えを行い、取得時レートとの差額を為替差損益として計上します。円安が進むと為替差益、円高が進むと為替差損が発生します。\n\n【具体例・イメージ】\n1ドル100円で1万ドルを定期預金にした後、決算時に1ドル103円になった状況をイメージしてください。3円×1万ドル=3万円の為替差益が発生します。\n\n【仕訳パターン】\n・為替差益発生時: 借方に定期預金、貸方に為替差益\n・為替差損発生時: 借方に為替差損、貸方に定期預金\n・解約時: 実際の受取額で処理\n\n【間違えやすいポイント】\n・円安・円高と差損益の関係を逆に覚える\n・評価替えは決算時のみ実施\n・外貨建て預金は外貨額は変わらず、円換算額が変動\n\n【覚え方のコツ】\n・円安 = 外貨の価値上昇 = 為替差益\n・円高 = 外貨の価値下落 = 為替差損\n・評価替え = 帳簿価額を時価に調整\n・定期預金の円換算額が増減\n\n【この問題の仕訳】\n米ドル建て定期預金の評価替えで為替差益30,000円が発生しました。\n（借）定期預金 30,000 （貸）為替差益 30,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["定期預金","為替差益"],"keywords":["外貨定期預金","為替差損益","評価替え"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.653Z",
  },
  {
    id: "Q_J_042",
    category_id: "journal",
    question_text: "定期預金600,000円の一部300,000円を普通預金に振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"普通預金","debit_amount":300000,"credit_account":"定期預金","credit_amount":300000}}',
    explanation:
      "【基本概念】\n定期預金の一部を流動性の高い普通預金に振り替える処理です。満期前の部分解約として処理される場合と、元々分割可能な定期預金として設定されている場合があります。\n\n【具体例・イメージ】\n600万円の定期預金のうち、急な資金需要で300万円分を普通預金に移して使用できるようにする状況をイメージしてください。\n\n【仕訳パターン】\n・振替時: 借方に普通預金、貸方に定期預金\n・違約金がある場合: 借方に普通預金＋雑損失、貸方に定期預金\n・利息がある場合: 借方に普通預金、貸方に定期預金＋受取利息\n\n【間違えやすいポイント】\n・全額解約と部分振替を混同しやすい\n・振替後も残りの定期預金は継続される\n・違約金の発生有無を確認する必要\n\n【覚え方のコツ】\n・定期預金 → 普通預金（資産内の振替）\n・流動性：定期預金（低）→ 普通預金（高）\n・部分振替 = 一部のみ移動\n・残りの定期預金は引き続き継続\n\n【この問題の仕訳】\n定期預金600,000円の一部300,000円を普通預金に振り替えます。\n（借）普通預金 300,000 （貸）定期預金 300,000",
    difficulty: 3,
    tags_json:
      '{"subcategory":"cash_deposit","pattern":"定期預金取引","accounts":["普通預金","定期預金"],"keywords":["定期預金","振替","部分解約"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.654Z",
  },
  {
    id: "Q_J_043",
    category_id: "journal",
    question_text: "商品50,000円を現金で仕入れた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":50000,"credit_account":"現金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n商品を現金で仕入れる最も基本的な取引です。簿記では商品の仕入に「仕入」勘定を使用し、現金での支払いは「現金」勘定から減少させます。\n\n【具体例・イメージ】\n小売店が問屋から商品を現金5万円で仕入れる状況をイメージしてください。商品を受け取ると同時に現金で代金を支払います。\n\n【仕訳パターン】\n・現金仕入時: 借方に仕入、貸方に現金\n・掛け仕入時: 借方に仕入、貸方に買掛金\n・仕入代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・仕入は費用勘定（売上原価を構成）\n・商品勘定ではなく仕入勘定を使用（三分法）\n・現金が減少するので貸方に記入\n\n【覚え方のコツ】\n・仕入 = 商品を買う費用\n・現金支払 = 現金の減少（貸方）\n・「買う」→「仕入」（借方）\n・「払う」→「現金」（貸方）\n\n【この問題の仕訳】\n商品50,000円を現金で仕入れた基本的な取引です。\n（借）仕入 50,000 （貸）現金 50,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"merchandise","pattern":"基本売買","accounts":["仕入","現金"],"keywords":["商品仕入","現金仕入","三分法"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.655Z",
  },
  {
    id: "Q_J_044",
    category_id: "journal",
    question_text: "商品80,000円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":80000,"credit_account":"買掛金","credit_amount":80000}}',
    explanation:
      "【基本概念】\n商品を掛けで仕入れる取引です。代金を後で支払う約束で商品を受け取るため、買掛金（負債）が発生します。買掛金は将来支払わなければならない債務を表します。\n\n【具体例・イメージ】\n小売店が問屋から商品を8万円で仕入れ、「来月末に支払います」という約束で取引する状況をイメージしてください。商品は受け取りますが、代金は後払いです。\n\n【仕訳パターン】\n・掛け仕入時: 借方に仕入、貸方に買掛金\n・買掛金支払時: 借方に買掛金、貸方に現金\n・一部支払時: 借方に買掛金、貸方に現金（支払額）\n\n【間違えやすいポイント】\n・買掛金は負債勘定（貸方で増加）\n・売掛金と買掛金を混同しやすい\n・支払時に買掛金を貸方に書いてしまう\n\n【覚え方のコツ】\n・掛け取引 = 後払いの約束\n・買掛金 = 買った商品の代金を払う義務（負債）\n・仕入で商品取得（借方）、買掛金で債務発生（貸方）\n・「買掛金」= 将来の支払義務\n\n【この問題の仕訳】\n商品80,000円を掛けで仕入れ、買掛金が発生しました。\n（借）仕入 80,000 （貸）買掛金 80,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"商品の掛け仕入（買掛金計上）","accounts":["仕入","買掛金"],"keywords":["商品売買","掛け仕入","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_045",
    category_id: "journal",
    question_text: "商品60,000円を現金で売り上げた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":60000,"credit_account":"売上","credit_amount":60000}}',
    explanation:
      "【基本概念】\n商品を現金で売り上げる取引です。商品を顧客に販売し、代金をその場で現金で受け取るため、現金（資産）が増加し、売上（収益）が発生します。\n\n【具体例・イメージ】\n小売店で商品を販売し、お客様から現金6万円をその場で受け取る状況をイメージしてください。商品は手放し、現金を受け取ります。\n\n【仕訳パターン】\n・現金売上時: 借方に現金、貸方に売上\n・掛け売上時: 借方に売掛金、貸方に売上\n・売掛金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売上は収益勘定（貸方で増加）\n・仕入と売上を混同しやすい\n・現金売上と掛け売上の処理を混同\n・売上原価の計上を同時に考えすぎる\n\n【覚え方のコツ】\n・「売る」= 売上（収益）が発生\n・現金売上 = その場で現金受取\n・現金増加（借方）、売上発生（貸方）\n・「商品→現金」の交換取引\n\n【この問題の仕訳】\n商品60,000円を現金で売り上げました。\n（借）現金 60,000 （貸）売上 60,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"商品の現金売上","accounts":["現金","売上"],"keywords":["商品売買","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_046",
    category_id: "journal",
    question_text: "商品90,000円を売り上げ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売掛金","debit_amount":90000,"credit_account":"売上","credit_amount":90000}}',
    explanation:
      "【基本概念】\n商品を掛けで売り上げる取引です。代金を後で受け取る約束で商品を販売するため、売掛金（資産）が発生します。売掛金は将来受け取る権利を表します。\n\n【具体例・イメージ】\n小売店が企業向けに商品を9万円で販売し、「来月末に支払います」という約束で取引する状況をイメージしてください。商品は引き渡しますが、代金は後で受け取ります。\n\n【仕訳パターン】\n・掛け売上時: 借方に売掛金、貸方に売上\n・売掛金回収時: 借方に現金、貸方に売掛金\n・一部回収時: 借方に現金、貸方に売掛金（回収額）\n\n【間違えやすいポイント】\n・売掛金は資産勘定（借方で増加）\n・売掛金と買掛金を混同しやすい\n・回収時に売掛金を借方に書いてしまう\n・売上は収益勘定（貸方で増加）\n\n【覚え方のコツ】\n・掛け取引 = 後払いの約束\n・売掛金 = 売った商品の代金をもらう権利（資産）\n・売上で収益発生（貸方）、売掛金で債権発生（借方）\n・「売掛金」= 将来の回収権利\n\n【この問題の仕訳】\n商品90,000円を掛けで売り上げ、売掛金が発生しました。\n（借）売掛金 90,000 （貸）売上 90,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"商品の掛け売上（売掛金計上）","accounts":["売掛金","売上"],"keywords":["商品売買","掛け売上","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_047",
    category_id: "journal",
    question_text: "先日掛けで仕入れた商品の代金70,000円を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":70000,"credit_account":"現金","credit_amount":70000}}',
    explanation:
      "【基本概念】\n掛けで仕入れた商品の代金を現金で支払う取引です。過去に発生した買掛金（債務）を現金で決済することで、買掛金が減少し、現金も減少します。\n\n【具体例・イメージ】\n以前に「後で払います」と約束して仕入れた商品の代金7万円を、約束通り現金で支払う状況をイメージしてください。借金を返済するのと同じです。\n\n【仕訳パターン】\n・買掛金支払時: 借方に買掛金、貸方に現金\n・買掛金一部支払時: 借方に買掛金（支払額）、貸方に現金\n・振込支払時: 借方に買掛金、貸方に普通預金\n・手形支払時: 借方に買掛金、貸方に支払手形\n\n【間違えやすいポイント】\n・買掛金の借方・貸方を逆にしがち（支払時は借方）\n・新しい仕入と混同してしまう\n・支払手数料が発生する場合の処理を忘れる\n・買掛金は負債なので、支払うと減る（借方記入）\n\n【覚え方のコツ】\n・「債務の返済」→ 買掛金減少（借方）\n・現金が出て行く → 現金減少（貸方）\n・「借りたものを返す」感覚\n・買掛金 ↓（借方）、現金 ↓（貸方）\n\n【この問題の仕訳】\n先日の掛け仕入の代金70,000円を現金で支払いました。\n（借）買掛金 70,000 （貸）現金 70,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"掛け仕入代金の現金支払（買掛金決済）","accounts":["買掛金","現金"],"keywords":["商品売買","買掛金支払","代金決済"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_048",
    category_id: "journal",
    question_text: "先日掛けで売り上げた商品の代金75,000円が現金で回収できた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":75000,"credit_account":"売掛金","credit_amount":75000}}',
    explanation:
      "【基本概念】\n掛けで売り上げた商品の代金を現金で回収する取引です。過去に発生した売掛金（債権）を現金で回収することで、売掛金が減少し、現金が増加します。\n\n【具体例・イメージ】\n以前に「後で払います」と約束してもらって販売した商品の代金7.5万円を、約束通り現金で受け取る状況をイメージしてください。借金を回収するのと同じです。\n\n【仕訳パターン】\n・売掛金回収時: 借方に現金、貸方に売掛金\n・売掛金一部回収時: 借方に現金（回収額）、貸方に売掛金\n・振込回収時: 借方に普通預金、貸方に売掛金\n・手形回収時: 借方に受取手形、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金の借方・貸方を逆にしがち（回収時は貸方）\n・新しい売上と混同してしまう\n・回収手数料が発生する場合の処理を忘れる\n・売掛金は資産なので、回収すると減る（貸方記入）\n\n【覚え方のコツ】\n・「債権の回収」→ 売掛金減少（貸方）\n・現金が入って来る → 現金増加（借方）\n・「貸したものを回収」感覚\n・現金 ↑（借方）、売掛金 ↓（貸方）\n\n【この問題の仕訳】\n先日の掛け売上の代金75,000円を現金で回収しました。\n（借）現金 75,000 （貸）売掛金 75,000",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"掛け売上代金の現金回収（売掛金回収）","accounts":["現金","売掛金"],"keywords":["商品売買","売掛金回収","代金回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_049",
    category_id: "journal",
    question_text:
      "商品100,000円を仕入れ、代金のうち40,000円は現金で支払い、残額は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_account_2":"","credit_amount_2":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":100000,"credit_account":"現金","credit_amount":40000,"credit_account_2":"買掛金","credit_amount_2":60000}}',
    explanation:
      "【基本概念】\n商品仕入の混合取引（一部現金・一部掛け）です。代金の一部を現金で支払い、残りは後払いの約束（掛け）とする取引で、複数の支払方法を組み合わせています。\n\n【具体例・イメージ】\n商品10万円を仕入れる際、手元に現金4万円しかないため、4万円は現金で支払い、残り6万円は「来月支払います」という約束にする状況をイメージしてください。\n\n【仕訳パターン】\n・混合仕入時: 借方に仕入、貸方に現金+買掛金\n・混合売上時: 借方に現金+売掛金、貸方に売上\n・支払方法の分割処理が基本\n\n【間違えやすいポイント】\n・複合仕訳の金額配分を間違える\n・現金部分と掛け部分の合計が仕入金額と一致しない\n・買掛金の金額計算を間違える（総額－現金＝買掛金）\n・仕訳の借方・貸方のバランスが取れない\n\n【覚え方のコツ】\n・「混合取引」= 支払方法の組み合わせ\n・借方は商品取得額（仕入100,000円）\n・貸方は支払方法の内訳（現金40,000円＋買掛金60,000円）\n・必ず借方＝貸方の合計になる\n\n【この問題の仕訳】\n商品100,000円を仕入れ、現金40,000円と掛け60,000円の混合支払いです。\n（借）仕入 100,000 （貸）現金 40,000\n　　　　　　　　　　　　　買掛金 60,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"仕入・売上の混合取引（一部現金・一部掛け）","accounts":["仕入","現金","買掛金"],"keywords":["商品売買","混合取引","複合仕訳"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_050",
    category_id: "journal",
    question_text: "三分法により商品120,000円を仕入れ、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":120000,"credit_account":"現金","credit_amount":120000}}',
    explanation:
      "【基本概念】\n三分法による商品勘定の処理です。三分法では商品の仕入・売上・在庫を「仕入」「売上」「繰越商品」の3つの勘定科目で管理します。商品仕入時は「仕入」勘定を使用します。\n\n【具体例・イメージ】\n小売店が問屋から商品12万円分を仕入れ、現金で支払う状況をイメージしてください。三分法では仕入時に商品勘定ではなく「仕入」勘定を使います。\n\n【仕訳パターン】\n・三分法仕入時: 借方に仕入、貸方に現金/買掛金\n・三分法売上時: 借方に現金/売掛金、貸方に売上\n・期末商品棚卸: 繰越商品勘定で処理\n・決算時売上原価算定: 期首商品＋仕入－期末商品\n\n【間違えやすいポイント】\n・分記法と三分法を混同する\n・商品勘定を使ってしまう（三分法では使わない）\n・期末の売上原価計算を忘れる\n・繰越商品の処理を理解していない\n\n【覚え方のコツ】\n・三分法 = 仕入・売上・繰越商品の3勘定で管理\n・仕入時は必ず「仕入」勘定を使用\n・売上時は必ず「売上」勘定を使用\n・「商品」勘定は三分法では使用しない\n\n【この問題の仕訳】\n三分法による商品仕入120,000円を現金で支払いました。\n（借）仕入 120,000 （貸）現金 120,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"三分法による商品勘定の処理","accounts":["仕入","現金"],"keywords":["商品売買","三分法","商品仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_051",
    category_id: "journal",
    question_text:
      "商品の仕入契約を結び、代金150,000円のうち50,000円を前払金として現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払金","debit_amount":50000,"credit_account":"現金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n商品仕入時の前払金支払いです。商品を実際に受け取る前に、代金の一部または全部を前もって支払う取引で、前払金（資産）が発生します。\n\n【具体例・イメージ】\n大型商品や特注商品を発注する際、「手付金として代金の一部を先に支払ってください」と言われて5万円を支払う状況をイメージしてください。商品はまだ受け取っていません。\n\n【仕訳パターン】\n・前払金支払時: 借方に前払金、貸方に現金\n・商品受取・決済時: 借方に仕入、貸方に前払金+現金/買掛金\n・前払金の一部充当: 残金の処理も同時に行う\n\n【間違えやすいポイント】\n・仕入勘定を使ってしまう（商品未受取のため不適切）\n・前払金は資産勘定（借方で増加）\n・商品受取時の処理を忘れがち\n・前払金と仮払金を混同しやすい\n\n【覚え方のコツ】\n・「前払い」= まだ商品を受け取っていない\n・前払金 = 将来商品を受け取る権利（資産）\n・支払時点では「仕入」ではなく「前払金」\n・商品受取時に前払金を仕入に振り替える\n\n【この問題の仕訳】\n商品代金150,000円のうち50,000円を前払金として現金で支払いました。\n（借）前払金 50,000 （貸）現金 50,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"商品仕入時の前払金支払","accounts":["前払金","現金"],"keywords":["商品売買","前払金","手付金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_052",
    category_id: "journal",
    question_text:
      "先日前払金50,000円を支払った商品150,000円を受け取り、残額100,000円は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_account_2":"","credit_amount_2":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":150000,"credit_account":"前払金","credit_amount":50000,"credit_account_2":"現金","credit_amount_2":100000}}',
    explanation:
      "【基本概念】\n前払金残高での商品受取・決済です。以前に支払った前払金を充当し、残額を現金で支払って商品を受け取る取引で、前払金の解消と仕入計上を同時に行います。\n\n【具体例・イメージ】\n以前に手付金5万円を支払った商品15万円が完成し、受け取り時に残金10万円を現金で支払う状況をイメージしてください。これで商品を正式に取得します。\n\n【仕訳パターン】\n・商品受取・決済時: 借方に仕入、貸方に前払金+現金\n・前払金全額充当時: 借方に仕入、貸方に前払金のみ\n・一部充当・残り掛け: 借方に仕入、貸方に前払金+買掛金\n\n【間違えやすいポイント】\n・前払金の金額を間違える\n・仕入金額と支払総額の関係を理解していない\n・前払金は貸方で減少（資産の減少）\n・複合仕訳の借方・貸方バランスを取り間違える\n\n【覚え方のコツ】\n・「商品受取」= 仕入計上（借方150,000円）\n・「前払金充当」= 前払金減少（貸方50,000円）\n・「残額支払」= 現金減少（貸方100,000円）\n・借方＝貸方の合計（150,000円）\n\n【この問題の仕訳】\n前払金50,000円を充当し、残額100,000円を現金で支払って商品150,000円を受け取りました。\n（借）仕入 150,000 （貸）前払金 50,000\n　　　　　　　　　　　　　現金 100,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"前払金残高での商品受取・決済","accounts":["仕入","前払金","現金"],"keywords":["商品売買","前払金充当","代金決済"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_053",
    category_id: "journal",
    question_text:
      "商品の売上契約を結び、代金200,000円のうち80,000円を前受金として現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":80000,"credit_account":"前受金","credit_amount":80000}}',
    explanation:
      "【基本概念】\n商品売上時の前受金受取です。商品を実際に引き渡す前に、代金の一部または全部を前もって受け取る取引で、前受金（負債）が発生します。\n\n【具体例・イメージ】\n大型商品や特注商品を受注する際、「手付金として代金の一部を先に受け取ります」として8万円を受け取る状況をイメージしてください。商品はまだ引き渡していません。\n\n【仕訳パターン】\n・前受金受取時: 借方に現金、貸方に前受金\n・商品引渡・決済時: 借方に前受金+現金/売掛金、貸方に売上\n・前受金の一部充当: 残金の処理も同時に行う\n\n【間違えやすいポイント】\n・売上勘定を使ってしまう（商品未引渡のため不適切）\n・前受金は負債勘定（貸方で増加）\n・商品引渡時の処理を忘れがち\n・前受金と仮受金を混同しやすい\n\n【覚え方のコツ】\n・「前受け」= まだ商品を引き渡していない\n・前受金 = 将来商品を引き渡す義務（負債）\n・受取時点では「売上」ではなく「前受金」\n・商品引渡時に前受金を売上に振り替える\n\n【この問題の仕訳】\n商品代金200,000円のうち80,000円を前受金として現金で受け取りました。\n（借）現金 80,000 （貸）前受金 80,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"商品売上時の前受金受取","accounts":["現金","前受金"],"keywords":["商品売買","前受金","手付金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_054",
    category_id: "journal",
    question_text:
      "先日前受金80,000円を受け取った商品200,000円を引き渡し、残額120,000円は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"debit_account_2":"","debit_amount_2":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前受金","debit_amount":80000,"debit_account_2":"現金","debit_amount_2":120000,"credit_account":"売上","credit_amount":200000}}',
    explanation:
      "【基本概念】\n前受金残高での商品引渡・決済です。以前に受け取った前受金を充当し、残額を現金で受け取って商品を引き渡す取引で、前受金の解消と売上計上を同時に行います。\n\n【具体例・イメージ】\n以前に手付金8万円を受け取った商品20万円が完成し、引渡時に残金12万円を現金で受け取る状況をイメージしてください。これで売上が正式に成立します。\n\n【仕訳パターン】\n・商品引渡・決済時: 借方に前受金+現金、貸方に売上\n・前受金全額充当時: 借方に前受金のみ、貸方に売上\n・一部充当・残り掛け: 借方に前受金+売掛金、貸方に売上\n\n【間違えやすいポイント】\n・前受金の金額を間違える\n・売上金額と受取総額の関係を理解していない\n・前受金は借方で減少（負債の減少）\n・複合仕訳の借方・貸方バランスを取り間違える\n\n【覚え方のコツ】\n・「商品引渡」= 売上計上（貸方200,000円）\n・「前受金充当」= 前受金減少（借方80,000円）\n・「残額受取」= 現金増加（借方120,000円）\n・借方の合計＝貸方（200,000円）\n\n【この問題の仕訳】\n前受金80,000円を充当し、残額120,000円を現金で受け取って商品200,000円を引き渡しました。\n（借）前受金 80,000 （貸）売上 200,000\n　　　現金 120,000",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"前受金残高での商品引渡・決済","accounts":["前受金","現金","売上"],"keywords":["商品売買","前受金充当","代金決済"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T20:02:00Z",
  },
  {
    id: "Q_J_055",
    category_id: "journal",
    question_text:
      "商品300,000円を分割仕入し、第1回分100,000円を現金で支払い、残額は買掛金とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":300000,"credit_account":"現金","credit_amount":100000,"credit_account_2":"買掛金","credit_amount_2":200000}}',
    explanation:
      "【基本概念】\n分割仕入・分割支払の処理は、高額な商品を仕入れる際に代金を複数回に分けて支払う取引です。第1回目の支払いは現金で行い、残額は買掛金として計上します。\n\n【具体例・イメージ】\n自動車販売店で30万円の商品を仕入れ、頭金10万円を現金で支払い、残り20万円は月末に支払うという取引をイメージしてください。\n\n【仕訳パターン】\n・分割仕入時: 借方に仕入、貸方に現金（第1回分）と買掛金（残額）\n・残額支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・一括仕入と分割仕入の処理を混同しやすい\n・第1回支払分と残額の金額計算ミス\n・複合仕訳の貸方を正しく記録できない\n\n【覚え方のコツ】\n・分割 = 複数の支払方法の組み合わせ\n・第1回現金支払 + 残額は買掛金\n・借方（仕入）= 貸方（現金 + 買掛金）の総額\n・分割でも商品価値は変わらない\n\n【この問題の仕訳】\n借方：仕入 300,000円\n貸方：現金 100,000円、買掛金 200,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"分割仕入・分割支払の処理","accounts":["仕入","現金","買掛金"],"keywords":["商品売買","分割仕入","分割支払","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.664Z",
  },
  {
    id: "Q_J_056",
    category_id: "journal",
    question_text:
      "商品500,000円を分割売上し、第1回分200,000円を現金で受け取り、残額は売掛金とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":200000,"debit_account_2":"売掛金","debit_amount_2":300000,"credit_account":"売上","credit_amount":500000}}',
    explanation:
      "【基本概念】\n分割売上・分割回収の処理は、高額な商品を販売する際に代金を複数回に分けて回収する取引です。第1回目の回収は現金で行い、残額は売掛金として計上します。\n\n【具体例・イメージ】\n家具店で50万円のソファを販売し、頭金20万円を現金で受け取り、残り30万円は来月に回収するという取引をイメージしてください。\n\n【仕訳パターン】\n・分割売上時: 借方に現金（第1回分）と売掛金（残額）、貸方に売上\n・残額回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・一括売上と分割売上の処理を混同しやすい\n・第1回回収分と残額の金額計算ミス\n・複合仕訳の借方を正しく記録できない\n\n【覚え方のコツ】\n・分割 = 複数の回収方法の組み合わせ\n・第1回現金回収 + 残額は売掛金\n・借方（現金 + 売掛金）= 貸方（売上）の総額\n・分割でも売上金額は変わらない\n\n【この問題の仕訳】\n借方：現金 200,000円、売掛金 300,000円\n貸方：売上 500,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"分割売上・分割回収の処理","accounts":["現金","売掛金","売上"],"keywords":["商品売買","分割売上","分割回収","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.665Z",
  },
  {
    id: "Q_J_057",
    category_id: "journal",
    question_text:
      "商品400,000円を割賦販売し、第1回分150,000円を現金で受け取り、残額は割賦売掛金とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":150000,"debit_account_2":"割賦売掛金","debit_amount_2":250000,"credit_account":"売上","credit_amount":400000}}',
    explanation:
      "【基本概念】\n割賦販売の基本処理は、商品を分割払いで販売する取引です。売上は一括計上し、代金回収は第1回分を現金で、残額は割賦売掛金として長期間に渡って回収します。\n\n【具体例・イメージ】\n自動車販売店で40万円の車を割賦販売し、頭金15万円を現金で受け取り、残り25万円は毎月分割で回収するという取引をイメージしてください。\n\n【仕訳パターン】\n・割賦販売時: 借方に現金（第1回分）と割賦売掛金（残額）、貸方に売上\n・分割回収時: 借方に現金、貸方に割賦売掛金\n\n【間違えやすいポイント】\n・通常の売掛金と割賦売掛金を混同しやすい\n・売上計上のタイミングを間違える（商品引渡時に一括計上）\n・長期回収予定額の管理ミス\n\n【覚え方のコツ】\n・割賦 = 長期分割払い契約\n・売上は商品引渡時に一括計上\n・回収は第1回現金 + 残額は割賦売掛金\n・割賦売掛金は長期債権として管理\n\n【この問題の仕訳】\n借方：現金 150,000円、割賦売掛金 250,000円\n貸方：売上 400,000円",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"基本売買","subpattern":"割賦販売の基本処理","accounts":["現金","割賦売掛金","売上"],"keywords":["商品売買","割賦販売","分割払い","割賦売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.666Z",
  },
  {
    id: "Q_J_058",
    category_id: "journal",
    question_text:
      "現金で仕入れた商品150,000円のうち20,000円分を品質不良のため返品し、代金を現金で返金してもらった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":20000,"credit_account":"仕入","credit_amount":20000}}',
    explanation:
      "【基本概念】\n現金で仕入れた商品を返品する場合、仕入原価から返品分を減額し、支払済みの現金の返還を受けます。\n\n【具体例・イメージ】\nコンビニで商品を現金で仕入れたが、一部の商品に傷があったため、その分だけ返品して現金を返してもらう状況をイメージしてください。\n\n【仕訳パターン】\n・現金仕入品の返品: 借方に現金、貸方に仕入\n・返品は仕入の逆仕訳として処理\n・現金での返金なので現金勘定が増加\n\n【間違えやすいポイント】\n・仕入戻し勘定を使うか仕入勘定を直接減額するかの判断\n・返品時の処理を売上返品と混同しやすい\n・現金返金と掛け返品の処理を間違える\n\n【覚え方のコツ】\n・返品は「逆仕訳」で考える\n・現金仕入の返品は現金が戻ってくる\n・仕入が減る（貸方）、現金が増える（借方）\n・「現金で買って現金で返す」\n\n【この問題の仕訳】\n現金で仕入れた商品20,000円分の返品により、仕入費用が減少（貸方）し、現金が返還されて増加（借方）します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"現金仕入品の返品・返金処理","accounts":["現金","仕入"],"keywords":["商品売買","返品","現金仕入","返金","品質不良"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.667Z",
  },
  {
    id: "Q_J_059",
    category_id: "journal",
    question_text:
      "掛けで仕入れた商品200,000円のうち30,000円分を規格違いのため返品し、買掛金を減額してもらった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":30000,"credit_account":"仕入","credit_amount":30000}}',
    explanation:
      "【基本概念】\n掛け仕入した商品を返品する場合、仕入原価から返品分を減額し、買掛金（支払義務）も同額減少させます。\n\n【具体例・イメージ】\n卸売業者からツケで仕入れた商品に不良品があったため、その分を返品して請求書の金額を減らしてもらう状況をイメージしてください。\n\n【仕訳パターン】\n・掛け仕入品の返品: 借方に買掛金、貸方に仕入\n・返品は掛け仕入の逆仕訳として処理\n・買掛金が減少するので借方に記入\n\n【間違えやすいポイント】\n・買掛金を貸方に書いてしまうミス\n・現金返品と掛け返品の処理を混同する\n・返品と値引きの処理方法を間違える\n\n【覚え方のコツ】\n・掛け仕入の返品は「逆仕訳」\n・買掛金（義務）が減る＝借方\n・仕入が減る＝貸方\n・「ツケで買ってツケで返す」\n\n【この問題の仕訳】\n掛けで仕入れた商品30,000円分の返品により、仕入費用が減少（貸方）し、買掛金の支払義務も減少（借方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"掛け仕入品の返品・買掛金減額","accounts":["買掛金","仕入"],"keywords":["商品売買","返品","掛け仕入","買掛金","規格違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.668Z",
  },
  {
    id: "Q_J_060",
    category_id: "journal",
    question_text:
      "仕入れた商品100,000円について、一部傷があったため10,000円の仕入値引きを受けた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":10000,"credit_account":"仕入","credit_amount":10000}}',
    explanation:
      "【基本概念】\n仕入値引きとは、仕入れた商品に品質不良や傷がある場合に、返品せずに代金の一部減額を受ける処理です。\n\n【具体例・イメージ】\n仕入れた商品に小さな傷があったが、販売に支障がないため返品せず、その分だけ代金を安くしてもらう状況をイメージしてください。\n\n【仕訳パターン】\n・仕入値引きの処理: 借方に買掛金、貸方に仕入\n・返品との違い: 商品は手元に残る\n・値引分だけ仕入原価と買掛金を減額\n\n【間違えやすいポイント】\n・返品と値引きの処理を混同する\n・仕入値引き勘定を使う場合との区別\n・値引き金額を間違える\n\n【覚え方のコツ】\n・値引き＝「安くしてもらう」\n・仕入が減る＝貸方\n・買掛金（義務）が減る＝借方\n・商品は手元に残る\n\n【この問題の仕訳】\n仕入値引き10,000円により、仕入原価が減少（貸方）し、買掛金の支払義務も減少（借方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"仕入値引きの処理（品質不良等）","accounts":["買掛金","仕入"],"keywords":["商品売買","仕入値引き","品質不良","代金減額"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.668Z",
  },
  {
    id: "Q_J_061",
    category_id: "journal",
    question_text:
      "商品仕入れのため前払金50,000円を支払っていたが、商品に欠陥があったため15,000円分を返品し、返金を受けた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":15000,"credit_account":"前払金","credit_amount":15000}}',
    explanation:
      "【基本概念】\n前払金で仕入れた商品を返品する場合、前払金勘定から返品分を減額し、返金された現金を計上します。\n\n【具体例・イメージ】\n商品を注文する際に前金を払っていたが、届いた商品に不具合があったため一部を返品し、その分の前金を返してもらう状況をイメージしてください。\n\n【仕訳パターン】\n・前払金支払済み商品の返品: 借方に現金、貸方に前払金\n・前払金が減少（貸方）、現金が増加（借方）\n・仕入勘定は使用しない（まだ仕入処理前のため）\n\n【間違えやすいポイント】\n・仕入勘定を使ってしまう間違い\n・前払金の処理を忘れる\n・買掛金勘定との混同\n\n【覚え方のコツ】\n・前払金＝「前もって払ったお金」\n・返品＝前払金が戻ってくる\n・現金増加（借方）、前払金減少（貸方）\n・まだ「仕入」していない段階\n\n【この問題の仕訳】\n前払金で支払済みの商品15,000円分の返品により、前払金が減少（貸方）し、返金で現金が増加（借方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"前払金支払済み商品の返品処理","accounts":["現金","前払金"],"keywords":["商品売買","返品","前払金","返金","商品欠陥"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.669Z",
  },
  {
    id: "Q_J_062",
    category_id: "journal",
    question_text:
      "仕入れた商品80,000円のうち、破損していて再販不可能な20,000円分を返品したが、返金ではなく他の商品と交換することになった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":20000,"credit_account":"仕入","credit_amount":20000}}',
    explanation:
      "【基本概念】\n返品商品の再販可能性により処理方法が異なります。破損商品の交換は、返品として処理し、新商品の仕入れを別途計上します。\n\n【具体例・イメージ】\n仕入れた商品が破損していて販売できないため、同じ価値の正常な商品と交換してもらう状況をイメージしてください。\n\n【仕訳パターン】\n・再販不可能商品の返品: 借方に買掛金、貸方に仕入\n・商品交換の場合も返品として処理\n・新商品受取時は別途仕入処理\n\n【間違えやすいポイント】\n・交換と返品の処理を混同する\n・再販可能性の判断基準\n・一括処理してしまうミス\n\n【覚え方のコツ】\n・破損＝再販不可能＝返品処理\n・交換＝返品＋新規仕入\n・買掛金減少（借方）、仕入減少（貸方）\n・処理区分は商品の状態で判断\n\n【この問題の仕訳】\n破損商品20,000円分の返品により、仕入原価が減少（貸方）し、買掛金の支払義務も減少（借方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"返品商品の再販可能性による処理区分","accounts":["買掛金","仕入"],"keywords":["商品売買","返品","商品交換","破損","再販不可能"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.670Z",
  },
  {
    id: "Q_J_063",
    category_id: "journal",
    question_text:
      "現金で販売した商品120,000円のうち25,000円分が不良品のため返品され、代金を現金で返金した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":25000,"credit_account":"現金","credit_amount":25000}}',
    explanation:
      "【基本概念】\n現金で販売した商品を返品された場合、売上高から返品分を減額し、返金として現金を支払います。\n\n【具体例・イメージ】\n小売店で現金で購入された商品に不具合があったため、お客様に商品を返品してもらい現金でお金を返す状況をイメージしてください。\n\n【仕訳パターン】\n・現金売上品の返品: 借方に売上、貸方に現金\n・売上の逆仕訳として処理\n・売上高が減少（借方）、現金が減少（貸方）\n\n【間違えやすいポイント】\n・売掛金を使ってしまう間違い\n・売上戻り勘定との使い分け\n・現金と掛けの処理区分を間違える\n\n【覚え方のコツ】\n・現金販売の返品は「逆仕訳」\n・売上減少（借方）、現金減少（貸方）\n・「現金で売って現金で返す」\n・返品＝売上のマイナス\n\n【この問題の仕訳】\n現金販売商品25,000円分の返品により、売上高が減少（借方）し、返金で現金が減少（貸方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"現金売上品の返品・返金処理","accounts":["売上","現金"],"keywords":["商品売買","返品","現金売上","返金","不良品"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-19T06:15:50.671Z",
  },
  {
    id: "Q_J_064",
    category_id: "journal",
    question_text:
      "掛けで販売した商品180,000円のうち40,000円分がサイズ違いのため返品され、売掛金を減額した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":40000,"credit_account":"売掛金","credit_amount":40000}}',
    explanation:
      "【基本概念】\n掛け販売した商品を返品された場合、売上高から返品分を減額し、売掛金（請求権）も同額減少させます。\n\n【具体例・イメージ】\n法人向けに掛けで販売した商品にサイズ間違いがあったため、返品を受けて請求書の金額を減額する状況をイメージしてください。\n\n【仕訳パターン】\n・掛け売上品の返品: 借方に売上、貸方に売掛金\n・掛け売上の逆仕訳として処理\n・売上高が減少（借方）、売掛金が減少（貸方）\n\n【間違えやすいポイント】\n・現金返金と掛け返品の処理を混同する\n・売掛金を借方に書いてしまうミス\n・売上戻り勘定との使い分け\n\n【覚え方のコツ】\n・掛け販売の返品は「逆仕訳」\n・売上減少（借方）、売掛金減少（貸方）\n・「ツケで売ってツケで返す」\n・請求権（売掛金）が消える\n\n【この問題の仕訳】\n掛け販売商品40,000円分の返品により、売上高が減少（借方）し、売掛金の請求権も減少（貸方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"掛け売上品の返品・売掛金減額","accounts":["売上","売掛金"],"keywords":["商品売買","返品","掛け売上","売掛金","サイズ違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.672Z",
  },
  {
    id: "Q_J_065",
    category_id: "journal",
    question_text:
      "販売した商品160,000円について、顧客からの色違いクレームに対応し、返品は受けずに15,000円の売上値引きを行った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":15000,"credit_account":"売掛金","credit_amount":15000}}',
    explanation:
      "【基本概念】\n売上値引きとは、販売した商品に色違いや小さな不具合がある場合に、返品を受けずに販売価格の一部を減額する処理です。\n\n【具体例・イメージ】\n顧客が注文した商品の色が若干違っていたが、使用に問題がないため返品は受けず、その分だけ販売価格を安くする状況をイメージしてください。\n\n【仕訳パターン】\n・売上値引きの処理: 借方に売上、貸方に売掛金\n・返品との違い: 商品は顧客の手元に残る\n・値引分だけ売上高と売掛金を減額\n\n【間違えやすいポイント】\n・返品と値引きの処理を混同する\n・売上値引き勘定を使う場合との区別\n・現金値引きとの処理区分を間違える\n\n【覚え方のコツ】\n・値引き＝「安くしてあげる」\n・売上が減る＝借方\n・売掛金（請求権）が減る＝貸方\n・商品は顧客の手元に残る\n\n【この問題の仕訳】\n売上値引き15,000円により、売上高が減少（借方）し、売掛金の請求権も減少（貸方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"売上値引きの処理（顧客クレーム対応等）","accounts":["売上","売掛金"],"keywords":["商品売買","売上値引き","顧客クレーム","色違い","価格減額"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.673Z",
  },
  {
    id: "Q_J_066",
    category_id: "journal",
    question_text:
      "商品注文のため前受金70,000円を受け取っていたが、顧客都合により20,000円分がキャンセルとなり、返金した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前受金","debit_amount":20000,"credit_account":"現金","credit_amount":20000}}',
    explanation:
      "【基本概念】\n前受金で受け取った商品代金について返品（キャンセル）された場合、前受金勘定から返品分を減額し、返金として現金を支払います。\n\n【具体例・イメージ】\n商品の受注時に前金を受け取っていたが、顧客の都合でキャンセルになったため、その分の前金を返金する状況をイメージしてください。\n\n【仕訳パターン】\n・前受金受取済み商品の返品: 借方に前受金、貸方に現金\n・前受金が減少（借方）、現金が減少（貸方）\n・売上勘定は使用しない（まだ売上処理前のため）\n\n【間違えやすいポイント】\n・売上勘定を使ってしまう間違い\n・前受金の処理を忘れる\n・売掛金勘定との混同\n\n【覚え方のコツ】\n・前受金＝「前もって受け取ったお金」\n・キャンセル＝前受金を返す\n・前受金減少（借方）、現金減少（貸方）\n・まだ「売上」していない段階\n\n【この問題の仕訳】\n前受金で受取済みの商品20,000円分のキャンセルにより、前受金が減少（借方）し、返金で現金が減少（貸方）します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"前受金受取済み商品の返品処理","accounts":["前受金","現金"],"keywords":["商品売買","返品","前受金","キャンセル","顧客都合"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.673Z",
  },
  {
    id: "Q_J_067",
    category_id: "journal",
    question_text:
      "売上商品の返品について、当社責任（検品ミス）による30,000円分は全額返金し、顧客責任（誤発注）による10,000円分は返品手数料2,000円を差し引いて返金した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0,"debit_account_2":"","debit_amount_2":0,"credit_account_2":"","credit_amount_2":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":40000,"debit_account_2":"現金","debit_amount_2":2000,"credit_account":"現金","credit_amount":38000,"credit_account_2":"雑収入","credit_amount_2":2000}}',
    explanation:
      "【基本概念】\n返品理由により会計処理を区分します。当社責任は全額返金、顧客責任は手数料を差し引いた返金が一般的です。\n\n【具体例・イメージ】\n商品返品の際、検品ミスなど当社の過失の場合は全額返金し、顧客の誤発注など顧客側の都合の場合は手数料を差し引いて返金する状況をイメージしてください。\n\n【仕訳パターン】\n・返品理由別の処理区分に応じた仕訳\n・当社責任: 売上減額＋全額返金\n・顧客責任: 売上減額＋手数料控除返金\n・手数料は雑収入として計上\n\n【間違えやすいポイント】\n・返品理由の区分を考慮しない一律処理\n・手数料の勘定科目を間違える\n・複合仕訳の作成方法\n\n【覚え方のコツ】\n・返品理由で処理方法が変わる\n・当社責任＝全額返金\n・顧客責任＝手数料控除\n・手数料＝雑収入\n\n【この問題の仕訳】\n売上40,000円の減額、手数料2,000円の受取、実際の返金38,000円を複合仕訳で処理します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"返品・値引き","subpattern":"返品理由別の会計処理区分","accounts":["売上","現金","雑収入"],"keywords":["商品売買","返品","返品理由","手数料","責任区分"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.674Z",
  },
  {
    id: "Q_J_068",
    category_id: "journal",
    question_text:
      "商品を仕入れた際に運賃5,000円が発生し、当社が負担することになった。運賃は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":5000,"credit_account":"現金","credit_amount":5000}}',
    explanation:
      "【基本概念】\n仕入時に発生する運賃・保険料等の諸掛りが当社負担の場合、これらは商品の取得原価に含めるべき付随費用となります。三分法では仕入勘定で処理し、商品原価として扱います。\n\n【具体例・イメージ】\n商品を遠方の取引先から仕入れる際の運送費や、輸入商品の保険料を想像してください。これらは商品を手に入れるために必要な費用なので、商品の原価の一部となります。\n\n【仕訳パターン】\n・当社負担の仕入諸掛り: 借方に仕入、貸方に現金/買掛金\n・先方負担の仕入諸掛り（立替）: 借方に立替金、貸方に現金\n・売上時の運賃（当社負担）: 借方に発送費/販売費、貸方に現金\n・売上時の運賃（先方負担）: 売上から控除\n\n【間違えやすいポイント】\n・当社負担と先方負担の処理を混同する\n・運賃を支払手数料や雑費で処理してしまう\n・仕入諸掛りと販売諸掛りの処理を間違える\n・立替金処理が必要な場合を見落とす\n\n【覚え方のコツ】\n・「当社負担」なら仕入原価に加算\n・「先方負担」なら立替金で処理\n・仕入時の費用は商品原価の一部\n・売上時の費用は販売費として処理\n\n【この問題の解き方】\n当社負担の運賃は商品の取得原価に含めるため、仕入勘定の借方に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"仕入時運賃・保険料（当社負担）","accounts":["仕入","現金"],"keywords":["商品売買","運賃","仕入諸掛り","当社負担","取得原価"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.675Z",
  },
  {
    id: "Q_J_069",
    category_id: "journal",
    question_text:
      "商品を仕入れた際に運賃3,000円が発生した。この運賃は取引先が負担することになっているが、当社が立て替えて現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"立替金","debit_amount":3000,"credit_account":"現金","credit_amount":3000}}',
    explanation:
      "【基本概念】\n仕入時の諸掛りが先方（取引先）負担の場合、当社が一時的に立て替えて支払った金額は「立替金」として処理します。これは後日、取引先から回収する債権となります。\n\n【具体例・イメージ】\n商品の配送料が本来は売り手負担なのに、買い手（当社）が配送業者に直接支払った場合を想像してください。後で売り手に請求して回収することになります。\n\n【仕訳パターン】\n・先方負担分の立替時: 借方に立替金、貸方に現金\n・立替金の回収時: 借方に現金、貸方に立替金\n・買掛金と相殺時: 借方に買掛金、貸方に立替金\n・従業員の立替時: 借方に立替金、貸方に現金\n\n【間違えやすいポイント】\n・当社負担と先方負担の処理を混同する\n・立替金を仕入原価に含めてしまう\n・立替金の回収処理を忘れる\n・未収入金との使い分けを間違える\n\n【覚え方のコツ】\n・「立替金」は「後で返してもらうお金」\n・先方負担なら立替金、当社負担なら仕入原価\n・立替は一時的な貸付、必ず回収する\n・買掛金から差し引かれることが多い\n\n【この問題の解き方】\n先方負担の運賃を当社が立て替えたため、立替金として債権に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"仕入時運賃・保険料（先方負担の立替）","accounts":["立替金","現金"],"keywords":["商品売買","運賃","立替金","先方負担","債権"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.676Z",
  },
  {
    id: "Q_J_070",
    category_id: "journal",
    question_text:
      "商品を仕入先から引き取るため、引取運賃2,500円と荷役料500円を現金で支払った。これらは当社負担である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":3000,"credit_account":"現金","credit_amount":3000}}',
    explanation:
      "【基本概念】\n仕入先から商品を引き取る際の引取運賃や荷役料（積み込み・積み降ろし作業料）が当社負担の場合、これらは商品の取得原価に含める付随費用として処理します。\n\n【具体例・イメージ】\n倉庫や工場から商品を引き取りに行くときのトラック運賃や、重い商品を積み込むための作業料を想像してください。これらは商品を入手するために必要な費用です。\n\n【仕訳パターン】\n・当社負担の引取運賃: 借方に仕入、貸方に現金\n・荷役料（当社負担）: 借方に仕入、貸方に現金\n・保管料（当社負担）: 借方に仕入、貸方に現金\n・複数の諸掛り: 合計金額で仕入勘定に計上\n\n【間違えやすいポイント】\n・引取運賃を運送費や交通費で処理してしまう\n・荷役料を雑費で処理してしまう\n・先方負担分まで仕入原価に含めてしまう\n・個別に勘定科目を作ってしまう\n\n【覚え方のコツ】\n・商品を「手に入れる」ための費用は仕入原価\n・引取り＝商品取得のための行為\n・荷役＝商品取扱いのための作業\n・複数の費用は合計して一つの仕訳で処理\n\n【この問題の解き方】\n引取運賃2,500円と荷役料500円の合計3,000円を、商品取得原価として仕入勘定に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"引取運賃・荷役料の処理","accounts":["仕入","現金"],"keywords":["商品売買","引取運賃","荷役料","仕入諸掛り","取得原価"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.676Z",
  },
  {
    id: "Q_J_071",
    category_id: "journal",
    question_text:
      "商品の仕入にあたり、検査料1,200円と仲介手数料800円を現金で支払った。これらは当社負担である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":2000,"credit_account":"現金","credit_amount":2000}}',
    explanation:
      "【基本概念】\n商品仕入時に発生する検査料や仲介手数料など、商品の品質確認や取引成立に必要な費用が当社負担の場合、これらは商品の取得原価に含める付随費用として処理します。\n\n【具体例・イメージ】\n精密機器の品質検査費用や、商品売買の仲介業者への手数料を想像してください。これらは商品を安全・確実に取得するために必要な費用です。\n\n【仕訳パターン】\n・検査料（当社負担）: 借方に仕入、貸方に現金\n・仲介手数料（当社負担）: 借方に仕入、貸方に現金\n・鑑定料（当社負担）: 借方に仕入、貸方に現金\n・複数の手数料: 合計金額で仕入勘定に計上\n\n【間違えやすいポイント】\n・検査料を支払手数料で処理してしまう\n・仲介手数料を雑費で処理してしまう\n・品質管理費と混同してしまう\n・個別に勘定科目を設定してしまう\n\n【覚え方のコツ】\n・商品取得に「直接関連」する費用は仕入原価\n・検査・鑑定・仲介は取得のための必要手続き\n・安全・確実な取得のための費用\n・複数の手数料は合算して処理\n\n【この問題の解き方】\n検査料1,200円と仲介手数料800円の合計2,000円を、商品取得原価として仕入勘定に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"仕入関連手数料・検査料","accounts":["仕入","現金"],"keywords":["商品売買","検査料","仲介手数料","仕入諸掛り","取得原価"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.677Z",
  },
  {
    id: "Q_J_072",
    category_id: "journal",
    question_text:
      "海外から商品を輸入する際、関税4,000円と通関手数料1,500円を現金で支払った。これらは当社負担である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":5500,"credit_account":"現金","credit_amount":5500}}',
    explanation:
      "【基本概念】\n海外から商品を輸入する際に発生する関税や通関手数料が当社負担の場合、これらは商品の取得原価に含める付随費用として処理します。輸入取引特有の費用も仕入原価の一部となります。\n\n【具体例・イメージ】\n海外の工場から機械部品を輸入する際の関税や、税関での手続き費用を想像してください。これらは商品を日本国内に持ち込むために必要な費用です。\n\n【仕訳パターン】\n・関税（当社負担）: 借方に仕入、貸方に現金\n・通関手数料（当社負担）: 借方に仕入、貸方に現金\n・検疫費用（当社負担）: 借方に仕入、貸方に現金\n・輸入関連費用: 合計金額で仕入勘定に計上\n\n【間違えやすいポイント】\n・関税を租税公課で処理してしまう\n・通関手数料を支払手数料で処理してしまう\n・輸入業者への手数料と混同する\n・消費税との区別ができない\n\n【覚え方のコツ】\n・輸入に必要な「法定費用」は仕入原価\n・関税＝商品を国内に持ち込むための税金\n・通関＝税関手続きのための費用\n・輸入取引では付随費用が多く発生\n\n【この問題の解き方】\n関税4,000円と通関手数料1,500円の合計5,500円を、輸入商品の取得原価として仕入勘定に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"輸入仕入時の関税・通関手数料","accounts":["仕入","現金"],"keywords":["商品売買","輸入","関税","通関手数料","取得原価"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.678Z",
  },
  {
    id: "Q_J_073",
    category_id: "journal",
    question_text:
      "仕入諸掛りとして運賃6,000円を支払い、買掛金から差し引かれることになった。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":6000,"credit_account":"買掛金","credit_amount":6000}}',
    explanation:
      "【基本概念】\n仕入諸掛りを現金以外の方法（買掛金との相殺等）で決済する場合の処理です。運賃等の諸掛りは仕入原価に含め、決済方法に応じて貸方の勘定科目を選択します。\n\n【具体例・イメージ】\n商品代金100,000円と運賃6,000円の合計106,000円が買掛金になるケースを想像してください。運賃分も商品代金と一緒に後日支払うことになります。\n\n【仕訳パターン】\n・諸掛りの掛け処理: 借方に仕入、貸方に買掛金\n・諸掛りの現金処理: 借方に仕入、貸方に現金\n・諸掛りの相殺処理: 借方に仕入、貸方に買掛金\n・複合的な決済: 決済方法に応じた貸方科目\n\n【間違えやすいポイント】\n・諸掛りを運送費等で処理してしまう\n・決済方法と貸方科目の対応を間違える\n・先方負担と当社負担の区別\n・立替金処理が必要な場合の見落とし\n\n【覚え方のコツ】\n・仕入諸掛りは「仕入原価」の一部\n・決済方法が貸方科目を決める\n・買掛金相殺＝後払い処理\n・現金支払い＝即時決済\n\n【この問題の解き方】\n運賃6,000円は仕入原価に含め、買掛金から差し引かれる（相殺される）ため、貸方は買掛金で処理します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"諸掛り・特殊取引","subpattern":"仕入諸掛りの現金・掛け決済","accounts":["仕入","買掛金"],"keywords":["商品売買","運賃","仕入諸掛り","買掛金","相殺決済"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.679Z",
  },
  {
    id: "Q_J_074",
    category_id: "journal",
    question_text:
      "商品を販売する際に発送費3,500円を現金で支払った。この発送費は当社負担である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"発送費","debit_amount":3500,"credit_account":"現金","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.680Z",
  },
  {
    id: "Q_J_075",
    category_id: "journal",
    question_text:
      "商品50,000円を販売し、運送費2,000円は先方負担であるが立替えて現金で支払った。なお、売上代金は後日回収する予定である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売掛金","debit_amount":52000,"credit_account":"売上","credit_amount":50000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":2000}}',
    explanation:
      "【基本概念】\n商品売上時に発生した運送費が先方負担の場合、当社が立替えて支払った運送費は売掛金に含めて請求します。売上代金と立替金を合算して売掛金として計上し、立替えた現金支払分を現金勘定から減額します。\n\n【具体例・イメージ】\nネット通販で商品を販売し、送料は顧客負担だが、当社が宅配業者に立替え払いする場面をイメージしてください。後日、商品代金と送料を合わせて顧客に請求します。\n\n【仕訳パターン】\n・先方負担運送費立替時: 借方に売掛金（売上代金＋運送費）、貸方に売上・現金\n・運送費回収時: 売掛金回収と同時に処理\n・当社負担の場合は販売費として別途計上\n\n【間違えやすいポイント】\n・当社負担と先方負担を混同する\n・立替金を別勘定で処理してしまう\n・売上代金に運送費を含めて処理する\n・現金支払分を忘れる\n\n【覚え方のコツ】\n・先方負担＝売掛金に含めて請求\n・当社負担＝販売費として費用計上\n・立替え＝一時的な代理支払い\n・回収時に立替分も同時回収\n\n【この問題の解き方】\n売上代金50,000円と立替運送費2,000円の合計52,000円を売掛金として計上し、現金2,000円を減額します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"shipping_special","pattern":"諸掛り・特殊取引","subpattern":"売上時運賃・保険料（先方負担）→売上原価から控除","accounts":["売掛金","売上","現金"],"keywords":["諸掛り","運送費","先方負担","立替金","販売時諸掛り"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.681Z",
  },
  {
    id: "Q_J_076",
    category_id: "journal",
    question_text: "商品を750円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":750,"credit_account":"売上","credit_amount":750}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.681Z",
  },
  {
    id: "Q_J_077",
    category_id: "journal",
    question_text:
      "商品の販売促進のため、販売手数料5,000円と広告宣伝費8,000円を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手数料","debit_amount":5000,"credit_account":"現金","credit_amount":5000},{"debit_account":"広告宣伝費","debit_amount":8000,"credit_account":"現金","credit_amount":8000}}',
    explanation:
      "【基本概念】\n商品販売に関連する手数料や広告宣伝費は、販売費及び一般管理費として処理します。販売手数料は支払手数料勘定、広告宣伝費は広告宣伝費勘定で処理し、それぞれ異なる勘定科目を使用します。\n\n【具体例・イメージ】\n営業代行会社への販売手数料や、チラシ・雑誌広告・ネット広告費の支払いをイメージしてください。これらは商品の販売促進に必要な費用です。\n\n【仕訳パターン】\n・販売手数料: 借方に支払手数料、貸方に現金\n・広告宣伝費: 借方に広告宣伝費、貸方に現金\n・複数の費用項目は別々の勘定科目で処理\n\n【間違えやすいポイント】\n・販売手数料と広告宣伝費を同一勘定で処理する\n・売上原価に含めて処理してしまう\n・仕入関連費用と混同する\n・雑費で一括処理してしまう\n\n【覚え方のコツ】\n・販売手数料＝支払手数料勘定\n・広告宣伝費＝専用勘定あり\n・販売促進活動の費用＝販売費\n・複数項目は個別勘定で処理\n\n【この問題の解き方】\n販売手数料5,000円は支払手数料勘定、広告宣伝費8,000円は広告宣伝費勘定でそれぞれ処理し、現金を減額します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"shipping_special","pattern":"諸掛り・特殊取引","subpattern":"売上関連手数料・広告宣伝費","accounts":["支払手数料","広告宣伝費","現金"],"keywords":["諸掛り","販売手数料","広告宣伝費","販売促進費","販売費"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.682Z",
  },
  {
    id: "Q_J_078",
    category_id: "journal",
    question_text: "売上げた商品のうち4000円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":4000,"credit_account":"売掛金","credit_amount":4000}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.683Z",
  },
  {
    id: "Q_J_079",
    category_id: "journal",
    question_text:
      "顧客への販売促進のため、試用品として商品15,000円相当を無償で提供した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"広告宣伝費","debit_amount":15000,"credit_account":"商品","credit_amount":15000}}',
    explanation:
      "【基本概念】\n試用品や見本品として商品を無償提供する場合、販売促進活動の一環として広告宣伝費で処理します。商品の所有権が顧客に移転するため、商品勘定から減額し、その原価を広告宣伝費として費用計上します。\n\n【具体例・イメージ】\n化粧品会社が新商品のサンプルを配布したり、食品会社が試食用商品を提供したりする場面をイメージしてください。これらは販売促進のための費用です。\n\n【仕訳パターン】\n・試用品提供時: 借方に広告宣伝費、貸方に商品\n・見本品提供時: 借方に広告宣伝費、貸方に商品\n・販売促進用景品: 借方に広告宣伝費、貸方に商品\n\n【間違えやすいポイント】\n・売上として処理してしまう\n・仕入戻しとして処理してしまう\n・雑損失で処理してしまう\n・商品の減少を処理し忘れる\n\n【覚え方のコツ】\n・無償提供＝売上ではない\n・販売促進＝広告宣伝費\n・商品の原価で費用計上\n・所有権移転で商品減少\n\n【この問題の解き方】\n試用品として提供した商品15,000円を商品勘定から減額し、広告宣伝費として費用計上します。",
    difficulty: 4,
    tags_json:
      '{"subcategory":"shipping_special","pattern":"諸掛り・特殊取引","subpattern":"試用販売・見本品販売の処理","accounts":["広告宣伝費","商品"],"keywords":["諸掛り","試用品","見本品","無償提供","販売促進","特殊取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.684Z",
  },
  {
    id: "Q_J_080",
    category_id: "journal",
    question_text:
      "決算において売上原価を算定するため、期首商品棚卸高60,000円を仕入勘定に振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":60000,"credit_account":"繰越商品","credit_amount":60000}}',
    explanation:
      "【基本概念】\n決算時に売上原価を正確に算定するため、三分法では期首商品を仕入勘定に振り替える処理を行います。これは売上原価対立法の第一段階で「期首商品を費用化」する仕訳です。\n\n【具体例・イメージ】\n前期末から持ち越した在庫商品60,000円分を、今期の売上に対応する費用（売上原価）の計算に含めるため、仕入勘定に移し替える処理を想像してください。\n\n【仕訳パターン】\n・期首商品振替: 借方に仕入、貸方に繰越商品\n・当期仕入計上: 借方に仕入、貸方に現金/買掛金\n・期末商品振替: 借方に繰越商品、貸方に仕入\n・売上原価算定: 期首+仕入-期末=売上原価\n\n【間違えやすいポイント】\n・期首と期末の振替方向を逆にしてしまう\n・繰越商品と商品勘定を混同する\n・売上原価の計算式を間違える\n・決算振替の順序を間違える\n\n【覚え方のコツ】\n・「しくりくりし」の順番（仕訳・繰越・繰越・仕訳）\n・期首は費用化（仕入の借方）\n・期末は資産化（繰越商品の借方）\n・売上原価＝期首＋仕入－期末\n\n【この問題の解き方】\n期首商品棚卸高を仕入勘定に振り替えるため、借方に仕入、貸方に繰越商品で処理します。",
    difficulty: 4,
    tags_json:
      '{"subcategory":"settlement","pattern":"決算関連","subpattern":"売上原価対立法（期首商品→仕入→期末商品）","accounts":["仕入","繰越商品"],"keywords":["決算整理","売上原価","期首商品","三分法","決算振替"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.685Z",
  },
  {
    id: "Q_J_081",
    category_id: "journal",
    question_text:
      "期中において、従来の分記法による処理を三分法に変更することとし、商品勘定（借方残高50,000円）を仕入勘定に振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":50000,"credit_account":"商品","credit_amount":50000}}',
    explanation:
      "【基本概念】\n分記法から三分法への期中転換では、分記法で使用していた商品勘定の借方残高を三分法の仕入勘定に振り替えます。商品勘定の借方残高は仕入原価を表すため、三分法の仕入勘定で管理することになります。\n\n【具体例・イメージ】\n分記法では商品を「商品」勘定で管理していましたが、三分法では「仕入」「売上」「繰越商品」の3つの勘定で管理します。期中での変更時は、商品勘定の借方残高（仕入原価）を仕入勘定に移管します。\n\n【仕訳パターン】\n・分記法→三分法転換: 借方に仕入、貸方に商品（借方残高分）\n・商品勘定借方残高 = 期首商品 + 当期仕入 - 当期売上原価\n・三分法では期末に売上原価を算定\n\n【間違えやすいポイント】\n・商品勘定の残高の意味を理解していない\n・分記法と三分法の違いを混同する\n・振替仕訳の借方・貸方を逆にする\n・期中転換のタイミングを間違える\n\n【覚え方のコツ】\n・分記法の「商品」→三分法の「仕入」\n・商品勘定借方残高 = 仕入原価相当額\n・三分法は「しくりくりし」で期末整理\n・期中転換は振替仕訳で対応\n\n【この問題の解き方】\n分記法の商品勘定借方残高50,000円を三分法の仕入勘定に振り替える仕訳を行います。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"settlement","pattern":"決算関連","subpattern":"分記法から三分法への期中転換","accounts":["仕入","商品"],"keywords":["決算整理","会計方法変更","分記法","三分法","期中転換"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.685Z",
  },
  {
    id: "Q_J_082",
    category_id: "journal",
    question_text:
      "決算において、商品勘定の決算振替を行うため、期末商品棚卸高90,000円を仕入勘定から繰越商品勘定に振り替えた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"繰越商品","debit_amount":90000,"credit_account":"仕入","credit_amount":90000}}',
    explanation:
      "【基本概念】\n三分法の決算整理では、期末商品を仕入勘定から繰越商品勘定に振り替えます。これにより、仕入勘定には当期の売上原価のみが残り、期末商品は資産として貸借対照表に計上されます。\n\n【具体例・イメージ】\n決算時の商品棚卸により、期末に残っている商品90,000円分を仕入勘定から分離し、繰越商品として資産計上します。これが「しくりくりし」の後半部分です。\n\n【仕訳パターン】\n・期末商品振替: 借方に繰越商品、貸方に仕入\n・「しくりくりし」= 仕入/繰越商品 → 繰越商品/仕入\n・売上原価算定の最終段階\n\n【間違えやすいポイント】\n・期首商品と期末商品の処理を混同する\n・仕入勘定と繰越商品勘定を逆にする\n・売上原価の計算構造を理解していない\n・決算振替の順序を間違える\n\n【覚え方のコツ】\n・「しくりくりし」の後半 = 期末商品の振替\n・期末商品は資産（繰越商品勘定）\n・仕入から繰越商品への移動\n・売上原価 = 期首商品 + 当期仕入 - 期末商品\n\n【この問題の解き方】\n期末商品棚卸高90,000円を仕入勘定から繰越商品勘定に振り替える仕訳を行います。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"settlement","pattern":"決算関連","subpattern":"商品勘定の決算振替（繰越商品勘定使用）","accounts":["繰越商品","仕入"],"keywords":["決算整理","売上原価","期末商品","三分法","決算振替"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.686Z",
  },
  {
    id: "Q_J_083",
    category_id: "journal",
    question_text: "商品300円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":300,"credit_account":"買掛金","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.687Z",
  },
  {
    id: "Q_J_084",
    category_id: "journal",
    question_text: "商品を4000円で販売し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":4000,"credit_account":"売上","credit_amount":4000}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品売上","accounts":["現金","売上"],"keywords":["売上","現金売上","販売"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.688Z",
  },
  {
    id: "Q_J_085",
    category_id: "journal",
    question_text: "仕入れた商品のうち500円分を品違いのため返品した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":500,"credit_account":"仕入","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"仕入戻し","accounts":["買掛金","仕入"],"keywords":["仕入戻し","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.689Z",
  },
  {
    id: "Q_J_086",
    category_id: "journal",
    question_text: "売上げた商品のうち400円分が品違いのため返品された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売上","debit_amount":400,"credit_account":"売掛金","credit_amount":400}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"売上戻り","accounts":["売上","売掛金"],"keywords":["売上戻り","返品","品違い"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.690Z",
  },
  {
    id: "Q_J_087",
    category_id: "journal",
    question_text: "商品150円を仕入れ、代金は掛けとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":150,"credit_account":"買掛金","credit_amount":150}}',
    explanation:
      "【基本概念】\n商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。\n\n【仕訳パターン】\n・掛仕入時: 借方に仕入、貸方に買掛金\n・代金支払時: 借方に買掛金、貸方に現金\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）を混同しやすい\n・支払時に買掛金を貸方に書いてしまうミス\n・未払金との区別（本業以外の支出は未払金）\n\n【覚え方のコツ】\n・「買」掛金 = 「買った」ツケ = 払う義務（負債）\n・支払うと買掛金は減る（借方）\n・「義務」は負債、「権利」は資産\n・買う側に発生するのが「買掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"sales_purchase","pattern":"商品仕入","accounts":["仕入","買掛金"],"keywords":["仕入","買掛金","掛け仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.690Z",
  },
  {
    id: "Q_J_088",
    category_id: "journal",
    question_text: "商品50,000円を掛けで売り上げた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"売掛金","debit_amount":50000,"credit_account":"売上","credit_amount":50000}}',
    explanation:
      "【基本概念】\n売掛金は商品やサービスの代金を将来的に受け取る権利で、掛取引（信用取引）で売上した際に発生する資産勘定です。\n\n【具体例・イメージ】\n小売店がお得意様に商品を販売し、請求書を渡して後日代金を回収する取引をイメージしてください。\n\n【仕訳パターン】\n・掛売上時: (借方)売掛金 (貸方)売上\n・代金回収時: (借方)現金 (貸方)売掛金\n・一部回収時: (借方)現金 (貸方)売掛金（回収分のみ）\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）の混同\n・売掛金の増減方向（借方で増加、貸方で減少）\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金＝売った代金をもらう権利（資産）\n・掛取引は「売掛金↔買掛金」の関係\n・売掛金は回収まで貸借対照表の資産に計上\n\n【この問題の仕訳】\n商品を掛けで売り上げたため、売掛金（資産）が増加し、売上（収益）が発生します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"掛け売上による売掛金発生","accounts":["売掛金","売上"],"keywords":["売掛金","掛売上","信用取引","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.691Z",
  },
  {
    id: "Q_J_089",
    category_id: "journal",
    question_text: "売掛金30,000円を現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":30000,"credit_account":"売掛金","credit_amount":30000}}',
    explanation:
      "【基本概念】\n売掛金の回収は、以前に掛取引で発生した債権を現金等で消込む処理です。売掛金（資産）が減少し、現金（資産）が増加します。\n\n【具体例・イメージ】\n月末締めで請求書を発行したお客様が、翌月に現金で代金を支払ってくれる場面をイメージしてください。\n\n【仕訳パターン】\n・全額回収時: (借方)現金 (貸方)売掛金\n・一部回収時: (借方)現金 (貸方)売掛金（回収分）\n・銀行振込: (借方)普通預金 (貸方)売掛金\n・手形回収: (借方)受取手形 (貸方)売掛金\n\n【間違えやすいポイント】\n・売掛金の増減方向を間違える（回収時は貸方で減少）\n・現金以外の回収方法との混同\n・一部回収時の金額を間違える\n\n【覚え方のコツ】\n・回収＝「もらう権利」が「現金」に変わる\n・売掛金は回収により減少（貸方）\n・現金は受取により増加（借方）\n・売掛金残高の管理が重要\n\n【この問題の仕訳】\n売掛金30,000円を現金で回収したため、現金が増加し売掛金が減少します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の現金回収・消込","accounts":["現金","売掛金"],"keywords":["売掛金","回収","現金","消込","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.692Z",
  },
  {
    id: "Q_J_090",
    category_id: "journal",
    question_text:
      "売掛金80,000円のうち、40,000円を現金で回収し、残額は来月回収予定とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":40000,"credit_account":"売掛金","credit_amount":40000}}',
    explanation:
      "【基本概念】\n売掛金の一部回収では、回収分のみを仕訳し、残額は売掛金残高として管理を継続します。売掛金は回収により部分的に減少します。\n\n【具体例・イメージ】\n顧客から「今回は半分だけ支払って、残りは来月に」と言われた場面をイメージしてください。入金分のみ処理し、残額は継続管理します。\n\n【仕訳パターン】\n・一部回収: (借方)現金 (貸方)売掛金（回収分のみ）\n・残額管理: 売掛金残高は自動的に減額される\n・分割回収: 回収の都度、同様の処理を繰り返す\n\n【間違えやすいポイント】\n・全額を仕訳してしまう間違い\n・残額を別の勘定で処理してしまう\n・売掛金残高の管理を怠る\n・一部回収の金額計算ミス\n\n【覚え方のコツ】\n・一部回収は「回収分のみ」処理\n・売掛金残高は「自動的に更新」\n・残額は「そのまま売掛金で継続管理」\n・顧客別の残高管理が重要\n\n【この問題の仕訳】\n80,000円のうち40,000円を回収したため、現金40,000円増加、売掛金40,000円減少し、売掛金残高は40,000円となります。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の一部回収・残高管理","accounts":["現金","売掛金"],"keywords":["売掛金","一部回収","残高管理","分割回収","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.693Z",
  },
  {
    id: "Q_J_091",
    category_id: "journal",
    question_text: "売掛金60,000円の代金として約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":60000,"credit_account":"売掛金","credit_amount":60000}}',
    explanation:
      "【基本概念】\n売掛金の手形決済は、現金ではなく約束手形で売掛金を回収する取引です。売掛金（債権）が受取手形（債権）に振り替わります。\n\n【具体例・イメージ】\n得意先から「現金は用意できないが、3か月後に必ず支払う手形を出します」と言われる場面をイメージしてください。\n\n【仕訳パターン】\n・手形受取時: (借方)受取手形 (貸方)売掛金\n・手形満期時: (借方)当座預金 (貸方)受取手形\n・手形割引時: (借方)当座預金・手形売却損 (貸方)受取手形\n\n【間違えやすいポイント】\n・受取手形と支払手形の混同\n・売掛金が消滅することを忘れる\n・手形の満期日と割引の区別\n・手形の裏書譲渡との混同\n\n【覚え方のコツ】\n・「売掛金」から「受取手形」への振替\n・債権の性質は変わらず、形態のみ変更\n・手形は「将来の確実な現金」として扱う\n・満期まで手形として管理\n\n【この問題の仕訳】\n売掛金60,000円を約束手形で回収したため、受取手形が増加し売掛金が減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の手形決済（受取手形への振替）","accounts":["受取手形","売掛金"],"keywords":["売掛金","受取手形","約束手形","手形決済","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.694Z",
  },
  {
    id: "Q_J_092",
    category_id: "journal",
    question_text:
      "A商店に対する売掛金70,000円と、A商店に対する買掛金45,000円を相殺した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":45000,"credit_account":"売掛金","credit_amount":45000}}',
    explanation:
      "【基本概念】\n相殺決済は、同一取引先に対する売掛金（債権）と買掛金（債務）を差し引きして決済する方法です。現金の授受なしに債権債務を消滅させます。\n\n【具体例・イメージ】\nA商店から商品を買って30万円の買掛金があり、A商店に商品を売って50万円の売掛金がある場合、30万円分を相殺して売掛金20万円だけ残す処理をイメージしてください。\n\n【仕訳パターン】\n・相殺処理: (借方)買掛金 (貸方)売掛金（小さい方の金額）\n・残額管理: 大きい方の勘定に差額が残る\n・完全相殺: 金額が同じなら両方とも消滅\n\n【間違えやすいポイント】\n・相殺する金額を間違える（小さい方の金額で処理）\n・売掛金と買掛金の増減方向を間違える\n・異なる取引先同士で相殺してしまう\n・残額の計算を間違える\n\n【覚え方のコツ】\n・相殺は「小さい方の金額」で処理\n・「もらう権利」と「払う義務」を打ち消し合う\n・同一取引先に対してのみ可能\n・現金の動きはなし\n\n【この問題の仕訳】\n買掛金45,000円分を相殺するため、買掛金が減少し売掛金も同額減少します。売掛金残高は25,000円となります。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の相殺決済（買掛金との相殺）","accounts":["買掛金","売掛金"],"keywords":["売掛金","買掛金","相殺","相殺決済","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.695Z",
  },
  {
    id: "Q_J_093",
    category_id: "journal",
    question_text:
      "得意先B社の売掛金25,000円が回収不能となり、貸倒れとして処理した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒損失","debit_amount":25000,"credit_account":"売掛金","credit_amount":25000}}',
    explanation:
      "【基本概念】\n貸倒れとは、取引先の倒産や支払不能により、売掛金等の債権が回収できなくなることです。確実に回収不能となった債権は貸倒損失として費用計上します。\n\n【具体例・イメージ】\n得意先が突然倒産し、売掛金が全く回収できなくなった状況をイメージしてください。期待していた入金がなくなり、損失として処理する必要があります。\n\n【仕訳パターン】\n・貸倒発生時: (借方)貸倒損失 (貸方)売掛金\n・貸倒引当金がある場合: (借方)貸倒引当金・貸倒損失 (貸方)売掛金\n・回収済み貸倒れの取消: (借方)売掛金 (貸方)貸倒引当金戻入\n\n【間違えやすいポイント】\n・貸倒損失と貸倒引当金の使い分け\n・一部回収可能な場合の処理\n・貸倒れの認定基準が曖昧\n・税務上の貸倒れ要件との混同\n\n【覚え方のコツ】\n・確実な貸倒れは「貸倒損失」で即座に処理\n・将来の貸倒れ予想は「貸倒引当金」で準備\n・売掛金の消滅＝債権放棄\n・損失の確定＝費用計上\n\n【この問題の仕訳】\nB社の売掛金25,000円が回収不能となったため、貸倒損失（費用）が発生し、売掛金（資産）が消滅します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の貸倒れ・貸倒損失計上","accounts":["貸倒損失","売掛金"],"keywords":["売掛金","貸倒れ","貸倒損失","回収不能","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.696Z",
  },
  {
    id: "Q_J_094",
    category_id: "journal",
    question_text:
      "前期に貸倒損失で処理したC社の売掛金15,000円が、今期になって回収できた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":15000,"credit_account":"貸倒引当金戻入","credit_amount":15000}}',
    explanation:
      "【基本概念】\n一度貸倒損失で処理した売掛金が後日回収できた場合、現金が増加し、その分を貸倒引当金戻入（収益）として処理します。\n\n【具体例・イメージ】\n倒産したと思った取引先が事業を再開し、「過去の債務も含めてきちんと支払います」と連絡があった場面をイメージしてください。\n\n【仕訳パターン】\n・回収時: (借方)現金 (貸方)貸倒引当金戻入\n・売掛金復活の場合: (借方)売掛金 (貸方)貸倒引当金戻入 → (借方)現金 (貸方)売掛金\n・引当金不足時: (借方)現金 (貸方)貸倒引当金戻入・雑収入\n\n【間違えやすいポイント】\n・売掛金を再計上してしまう間違い\n・貸倒損失の戻入勘定を間違える\n・前期の修正仕訳と混同する\n・雑収入との使い分けを間違える\n\n【覚え方のコツ】\n・「償却済み債権」の回収は「戻入」処理\n・売掛金の復活は不要（直接現金化）\n・貸倒引当金戻入は「収益」扱い\n・過去の損失取消＝収益発生\n\n【この問題の仕訳】\n前期に貸倒処理した売掛金15,000円を回収したため、現金が増加し、貸倒引当金戻入（収益）が発生します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"回収済み売掛金の貸倒れ取消（貸倒引当金戻入）","accounts":["現金","貸倒引当金戻入"],"keywords":["売掛金","貸倒引当金戻入","償却済み債権","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.697Z",
  },
  {
    id: "Q_J_095",
    category_id: "journal",
    question_text:
      "支払期日を過ぎた売掛金35,000円について、延滞利息800円とともに現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":35800,"credit_account":"売掛金","credit_amount":35000},{"debit_account":"","debit_amount":0,"credit_account":"受取利息","credit_amount":800}}',
    explanation:
      "【基本概念】\n売掛金の期日管理では、支払期日を過ぎた債権に対して延滞利息を請求することがあります。延滞利息は営業外収益として処理します。\n\n【具体例・イメージ】\n得意先から「支払が1か月遅れてしまいます。延滞利息もお支払いします」と連絡があり、元本と利息を合わせて回収する場面をイメージしてください。\n\n【仕訳パターン】\n・延滞利息付き回収: (借方)現金 (貸方)売掛金・受取利息\n・期日延長の場合: 仕訳なし（管理上の期日変更のみ）\n・遅延損害金: (借方)現金 (貸方)売掛金・雑収入\n\n【間違えやすいポイント】\n・延滞利息の勘定科目を間違える\n・複合仕訳の金額配分を間違える\n・売掛金元本と利息を区別できない\n・営業外収益の分類を間違える\n\n【覚え方のコツ】\n・延滞利息は「受取利息」（営業外収益）\n・元本＋利息の合計額を現金で受取\n・売掛金は元本分のみ減少\n・期日管理は債権回収の基本\n\n【この問題の仕訳】\n売掛金35,000円と延滞利息800円の合計35,800円を現金で回収したため、現金35,800円増加、売掛金35,000円減少、受取利息800円計上します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"売掛金の期限管理・延滞処理","accounts":["現金","売掛金","受取利息"],"keywords":["売掛金","延滞利息","期日管理","受取利息","売掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.698Z",
  },
  {
    id: "Q_J_096",
    category_id: "journal",
    question_text: "商品40,000円を掛けで仕入れた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":40000,"credit_account":"買掛金","credit_amount":40000}}',
    explanation:
      "【基本概念】\n買掛金は商品やサービスを掛取引（信用取引）で仕入れた際に発生する負債勘定です。将来的に支払わなければならない義務を表します。\n\n【具体例・イメージ】\n卸売業者から商品を仕入れ、「代金は来月末にお支払いします」と約束する取引をイメージしてください。請求書を受け取り、後日支払います。\n\n【仕訳パターン】\n・掛仕入時: (借方)仕入 (貸方)買掛金\n・代金支払時: (借方)買掛金 (貸方)現金\n・一部支払時: (借方)買掛金 (貸方)現金（支払分のみ）\n\n【間違えやすいポイント】\n・買掛金（負債）と売掛金（資産）の混同\n・買掛金の増減方向（貸方で増加、借方で減少）\n・未払金との区別（本業以外の支出は未払金）\n・支払時の仕訳を間違える\n\n【覚え方のコツ】\n・「買」掛金＝買った代金を払う義務（負債）\n・掛取引は「売掛金↔買掛金」の関係\n・買掛金は支払まで貸借対照表の負債に計上\n・仕入→費用の発生、買掛金→負債の発生\n\n【この問題の仕訳】\n商品を掛けで仕入れたため、仕入（費用）が発生し、買掛金（負債）が増加します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"掛け仕入による買掛金発生","accounts":["仕入","買掛金"],"keywords":["買掛金","掛仕入","信用取引","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.698Z",
  },
  {
    id: "Q_J_097",
    category_id: "journal",
    question_text: "買掛金28,000円を小切手を振り出して支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":28000,"credit_account":"当座預金","credit_amount":28000}}',
    explanation:
      "【基本概念】\n買掛金の支払は、以前に掛取引で発生した債務を現金等で消込む処理です。買掛金（負債）が減少し、当座預金（資産）も減少します。\n\n【具体例・イメージ】\n月初に請求書が届いた仕入先に対して、支払期日に小切手を振り出して代金を支払う場面をイメージしてください。\n\n【仕訳パターン】\n・小切手支払: (借方)買掛金 (貸方)当座預金\n・現金支払: (借方)買掛金 (貸方)現金\n・銀行振込: (借方)買掛金 (貸方)普通預金\n・手形支払: (借方)買掛金 (貸方)支払手形\n\n【間違えやすいポイント】\n・買掛金の増減方向を間違える（支払時は借方で減少）\n・小切手振出の相手勘定を間違える\n・一部支払時の金額を間違える\n・未払金との区別ができない\n\n【覚え方のコツ】\n・支払＝「払う義務」が「資産の減少」に変わる\n・買掛金は支払により減少（借方）\n・小切手振出＝当座預金の減少\n・買掛金残高の管理が重要\n\n【この問題の仕訳】\n買掛金28,000円を小切手で支払ったため、買掛金が減少し当座預金が減少します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"買掛金の現金支払・消込","accounts":["買掛金","当座預金"],"keywords":["買掛金","支払","小切手","消込","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.699Z",
  },
  {
    id: "Q_J_098",
    category_id: "journal",
    question_text:
      "買掛金60,000円のうち、32,000円を現金で支払い、残額は来月支払予定とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":32000,"credit_account":"現金","credit_amount":32000}}',
    explanation:
      "【基本概念】\n買掛金の一部支払では、支払分のみを仕訳し、残額は買掛金残高として管理を継続します。買掛金は支払により部分的に減少します。\n\n【具体例・イメージ】\n仕入先から「今月は資金繰りが厳しいので半分だけ支払わせてください」と相談し、残額は翌月に持ち越す場面をイメージしてください。\n\n【仕訳パターン】\n・一部支払: (借方)買掛金 (貸方)現金（支払分のみ）\n・残額管理: 買掛金残高は自動的に減額される\n・分割支払: 支払の都度、同様の処理を繰り返す\n\n【間違えやすいポイント】\n・全額を仕訳してしまう間違い\n・残額を別の勘定で処理してしまう\n・買掛金残高の管理を怠る\n・一部支払の金額計算ミス\n\n【覚え方のコツ】\n・一部支払は「支払分のみ」処理\n・買掛金残高は「自動的に更新」\n・残額は「そのまま買掛金で継続管理」\n・仕入先別の残高管理が重要\n\n【この問題の仕訳】\n60,000円のうち32,000円を支払ったため、買掛金32,000円減少、現金32,000円減少し、買掛金残高は28,000円となります。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"買掛金の一部支払・残高管理","accounts":["買掛金","現金"],"keywords":["買掛金","一部支払","残高管理","分割支払","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.700Z",
  },
  {
    id: "Q_J_099",
    category_id: "journal",
    question_text: "買掛金45,000円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":45000,"credit_account":"支払手形","credit_amount":45000}}',
    explanation:
      "【基本概念】\n買掛金の手形決済は、現金ではなく約束手形で買掛金を支払う取引です。買掛金（債務）が支払手形（債務）に振り替わります。\n\n【具体例・イメージ】\n仕入先から「現金での支払いは厳しいですが、3か月後の手形で決済させてください」と相談する場面をイメージしてください。\n\n【仕訳パターン】\n・手形振出時: (借方)買掛金 (貸方)支払手形\n・手形満期時: (借方)支払手形 (貸方)当座預金\n・手形不渡り時: (借方)不渡手形 (貸方)支払手形\n\n【間違えやすいポイント】\n・支払手形と受取手形の混同\n・買掛金が消滅することを忘れる\n・手形の満期日管理を怠る\n・手形の裏書譲渡との混同\n\n【覚え方のコツ】\n・「買掛金」から「支払手形」への振替\n・債務の性質は変わらず、形態のみ変更\n・手形は「将来の確実な支払約束」\n・満期まで支払手形として管理\n\n【この問題の仕訳】\n買掛金45,000円を約束手形で決済したため、買掛金が減少し支払手形が増加します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"買掛金の手形決済（支払手形の振出）","accounts":["買掛金","支払手形"],"keywords":["買掛金","支払手形","約束手形","手形決済","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.701Z",
  },
  {
    id: "Q_J_100",
    category_id: "journal",
    question_text:
      "X商店に対する買掛金55,000円と、X商店に対する売掛金38,000円を相殺した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":38000,"credit_account":"売掛金","credit_amount":38000}}',
    explanation:
      "【基本概念】\n相殺決済は、同一取引先に対する買掛金（債務）と売掛金（債権）を差し引きして決済する方法です。現金の授受なしに債権債務を消滅させます。\n\n【具体例・イメージ】\nX商店に商品を売って38万円の売掛金があり、X商店から商品を買って55万円の買掛金がある場合、38万円分を相殺して買掛金17万円だけ残す処理をイメージしてください。\n\n【仕訳パターン】\n・相殺処理: (借方)買掛金 (貸方)売掛金（小さい方の金額）\n・残額管理: 大きい方の勘定に差額が残る\n・完全相殺: 金額が同じなら両方とも消滅\n\n【間違えやすいポイント】\n・相殺する金額を間違える（小さい方の金額で処理）\n・買掛金と売掛金の増減方向を間違える\n・異なる取引先同士で相殺してしまう\n・残額の計算を間違える\n\n【覚え方のコツ】\n・相殺は「小さい方の金額」で処理\n・「払う義務」と「もらう権利」を打ち消し合う\n・同一取引先に対してのみ可能\n・現金の動きはなし\n\n【この問題の仕訳】\n売掛金38,000円分を相殺するため、買掛金が減少し売掛金も同額減少します。買掛金残高は17,000円となります。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"買掛金の相殺決済（売掛金との相殺）","accounts":["買掛金","売掛金"],"keywords":["買掛金","売掛金","相殺","相殺決済","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:15:50.702Z",
  },
  {
    id: "Q_J_101",
    category_id: "journal",
    question_text:
      "支払期日が到来した買掛金42,000円について、仕入先と協議し支払期日を1か月延長することとした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    explanation:
      "【基本概念】\n買掛金の期日管理では、支払期日の延長や調整について取引先と協議することがあります。期日延長の合意は管理上の変更であり、仕訳は不要です。\n\n【具体例・イメージ】\n資金繰りの都合で仕入先に「今月の支払いを来月まで延長してもらえませんか」と相談し、了承を得る場面をイメージしてください。\n\n【仕訳パターン】\n・期日延長合意: 仕訳なし（管理上の記録のみ）\n・延滞利息付き延長: 利息支払時に仕訳\n・期日短縮合意: 仕訳なし（管理上の記録のみ）\n・条件変更による調整: 必要に応じて仕訳\n\n【間違えやすいポイント】\n・期日延長で無用な仕訳をしてしまう\n・延滞利息の取り扱いを間違える\n・管理記録を怠る\n・期日管理システムの更新を忘れる\n\n【覚え方のコツ】\n・期日延長の「合意」は仕訳不要\n・実際の「支払」時に仕訳\n・管理台帳の「期日更新」が重要\n・取引先との「信頼関係」維持が前提\n\n【この問題の仕訳】\n支払期日の延長は管理上の変更のため仕訳は不要です。買掛金残高42,000円はそのまま維持し、管理上の支払期日のみ更新します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"買掛金の期限管理・支払期日調整","accounts":[],"keywords":["買掛金","期日管理","期日延長","支払期日調整","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.144Z",
  },
  {
    id: "Q_J_102",
    category_id: "journal",
    question_text:
      "既に代金を支払済みの仕入商品12,000円のうち、3,000円分が不良品であったため返品し、現金で返金を受けた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":3000,"credit_account":"仕入","credit_amount":3000}}',
    explanation:
      "【基本概念】\n支払済み買掛金の返品・調整処理では、既に支払いが完了している商品の返品時に、返品分の仕入を取り消し、返金を受けます。\n\n【具体例・イメージ】\n先月仕入れて代金も支払済みの商品の一部に不良品が見つかり、仕入先に返品して現金で返金してもらう場面をイメージしてください。\n\n【仕訳パターン】\n・現金返金の場合: (借方)現金 (貸方)仕入\n・掛けで調整の場合: (借方)売掛金 (貸方)仕入\n・相殺調整の場合: (借方)買掛金 (貸方)仕入\n・代替商品との交換: 金額による調整仕訳\n\n【間違えやすいポイント】\n・買掛金で処理してしまう間違い（既に支払済み）\n・返品額の計算を間違える\n・仕入取消の処理を忘れる\n・返金と返品の処理を混同する\n\n【覚え方のコツ】\n・支払済みなので「買掛金」は使わない\n・返品＝「仕入の取消」（貸方）\n・返金＝「現金の増加」（借方）\n・過去の仕入を「なかったこと」にする処理\n\n【この問題の仕訳】\n支払済み商品3,000円分を返品して現金で返金を受けたため、現金が増加し、仕入（費用）が減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"receivable_payable","pattern":"売掛金・買掛金","subpattern":"支払済み買掛金の返品・調整処理","accounts":["現金","仕入"],"keywords":["買掛金","返品","返金","支払済み","買掛金管理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.145Z",
  },
  {
    id: "Q_J_103",
    category_id: "journal",
    question_text:
      "売掛金80,000円の回収のため、得意先から約束手形を受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"受取手形","debit_amount":80000,"credit_account":"売掛金","credit_amount":80000}}',
    explanation:
      "【基本概念】\n受取手形は、得意先から支払いの約束として受け取った約束手形を表す資産勘定です。売掛金の回収手段として、将来の決まった日に確実に現金化できる債権です。\n\n【具体例・イメージ】\n得意先から「3か月後の8月31日に必ず80万円をお支払いします」という約束の紙（約束手形）を受け取る場面をイメージしてください。現金化が約束された債権です。\n\n【仕訳パターン】\n・手形受取時: (借方)受取手形 (貸方)売掛金\n・手形決済時: (借方)当座預金 (貸方)受取手形\n・手形割引時: (借方)当座預金・手形売却損 (貸方)受取手形\n・手形裏書時: (借方)買掛金 (貸方)受取手形\n\n【間違えやすいポイント】\n・受取手形（資産）と支払手形（負債）の混同\n・売掛金との関係を理解できない\n・手形の額面金額と現在価値の区別\n・手形割引と裏書譲渡の処理違い\n\n【覚え方のコツ】\n・「受取」手形＝「受け取った」約束手形（資産）\n・売掛金の回収方法の一つ\n・約束手形＝「支払約束」の証書\n・期日確定の債権＝より確実な資産\n\n【この問題の仕訳】\n売掛金80,000円を約束手形で回収したため、受取手形（資産）が増加し、売掛金（資産）が減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"約束手形の受取・受取手形計上","accounts":["受取手形","売掛金"],"keywords":["受取手形","約束手形","売掛金","手形受取","手形取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.146Z",
  },
  {
    id: "Q_J_104",
    category_id: "journal",
    question_text: "約束手形70,000円が満期となり、当座預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":70000,"credit_account":"受取手形","credit_amount":70000}}',
    explanation:
      "【基本概念】\n受取手形の満期日決済は、約束手形が支払期日に到達し、銀行で現金化される処理です。受取手形（資産）が消滅し、当座預金（資産）が増加します。\n\n【具体例・イメージ】\n3か月前に受け取った約束手形の支払期日が来て、銀行から「手形の代金70万円が口座に入金されました」と連絡がある場面をイメージしてください。\n\n【仕訳パターン】\n・手形決済時: (借方)当座預金 (貸方)受取手形\n・現金化の場合: (借方)現金 (貸方)受取手形\n・不渡りの場合: (借方)不渡手形 (貸方)受取手形\n・銀行取立の場合: (借方)当座預金 (貸方)受取手形・支払手数料\n\n【間違えやすいポイント】\n・手形決済と手形割引の区別\n・取立手数料がある場合の処理\n・不渡り時の処理方法\n・現金と当座預金の使い分け\n\n【覚え方のコツ】\n・満期日＝約束の実行日\n・受取手形の消滅＝現金・預金の発生\n・銀行取立＝通常は当座預金入金\n・満期決済＝確実な資金回収\n\n【この問題の仕訳】\n約束手形70,000円が満期となり銀行で決済されたため、当座預金（資産）が増加し、受取手形（資産）が減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"受取手形の満期日決済・現金化","accounts":["当座預金","受取手形"],"keywords":["受取手形","満期日","決済","当座預金","手形取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.147Z",
  },
  {
    id: "Q_J_105",
    category_id: "journal",
    question_text:
      "買掛金60,000円の支払いのため、受取手形60,000円を裏書譲渡した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":60000,"credit_account":"受取手形","credit_amount":60000}}',
    explanation:
      "【基本概念】\n手形の裏書譲渡は、受取手形を第三者に譲渡して代金支払等に使用する処理です。受取手形（資産）が減少し、買掛金等の債務（負債）が減少します。\n\n【具体例・イメージ】\n仕入先への買掛金60万円の支払期日が来たとき、別の得意先からもらった約束手形60万円を仕入先に渡して「この手形で代金に代えてください」と処理する場面をイメージしてください。\n\n【仕訳パターン】\n・裏書譲渡時: (借方)買掛金 (貸方)受取手形\n・裏書手形決済時: 偶発債務の消滅（仕訳なし）\n・裏書手形不渡時: (借方)受取手形・遅延損害金 (貸方)買掛金\n・売上代金受取: (借方)受取手形 (貸方)売上\n\n【間違えやすいポイント】\n・手形割引との区別（割引は銀行、裏書は第三者）\n・偶発債務の処理方法\n・手形不渡時の責任関係\n・現金取引との混同\n\n【覚え方のコツ】\n・裏書＝手形の譲渡（支払手段として使用）\n・受取手形の減少＝債務の減少\n・現金を使わない決済方法\n・偶発債務＝将来の責任\n\n【この問題の仕訳】\n買掛金60,000円の支払いのため受取手形を裏書譲渡したため、買掛金（負債）が減少し、受取手形（資産）も減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"受取手形の裏書譲渡（債権譲渡）","accounts":["買掛金","受取手形"],"keywords":["受取手形","裏書譲渡","買掛金","債権譲渡","手形取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.148Z",
  },
  {
    id: "Q_J_106",
    category_id: "journal",
    question_text:
      "受取手形50,000円を銀行で割引き、割引料800円を差し引かれて当座預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":49200,"credit_account":"受取手形","credit_amount":50000},{"debit_account":"手形売却損","debit_amount":800,"credit_account":"","credit_amount":0}}',
    explanation:
      "【基本概念】\n手形割引は、受取手形を満期日前に銀行で現金化する処理です。銀行に割引料を支払い、額面金額より少ない金額で現金化されます。\n\n【具体例・イメージ】\n3か月後に50万円もらえる約束手形を持っているが、今すぐ現金が必要になり、銀行に「手数料8千円払うので今すぐ現金化してください」と依頼する場面をイメージしてください。\n\n【仕訳パターン】\n・手形割引時: (借方)当座預金・手形売却損 (貸方)受取手形\n・割引手形決済時: 仕訳なし（銀行処理）\n・割引手形不渡時: (借方)不渡手形 (貸方)当座預金\n・割引料計算: 額面×利率×期間\n\n【間違えやすいポイント】\n・手形裏書との区別（割引は銀行、裏書は第三者）\n・手形売却損の勘定科目\n・複合仕訳の金額配分\n・不渡り時の処理方法\n\n【覚え方のコツ】\n・割引＝満期前の現金化（手数料負担）\n・手形売却損＝営業外費用\n・銀行割引＝確実な現金化\n・割引料＝時間に対する対価\n\n【この問題の仕訳】\n受取手形50,000円を割引き、割引料800円を差し引かれた49,200円が当座預金に入金されたため、当座預金49,200円と手形売却損800円が借方、受取手形50,000円が貸方となります。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"受取手形の割引（手形割引料負担）","accounts":["当座預金","手形売却損","受取手形"],"keywords":["受取手形","手形割引","割引料","手形売却損","手形取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.149Z",
  },
  {
    id: "Q_J_107",
    category_id: "journal",
    question_text:
      "以前に裏書譲渡した受取手形80,000円が満期日に決済され、偶発債務が消滅した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"note":"偶発債務の消滅は仕訳を必要としません。"}}',
    explanation:
      "【基本概念】\n裏書手形の決済時の偶発債務消滅は、以前に裏書譲渡した手形が満期日に正常決済された際の処理です。偶発債務が消滅するため仕訳は不要です。\n\n【具体例・イメージ】\n3か月前に買掛金の支払いのため受取手形を仕入先に裏書譲渡し、その手形が満期日に正常に決済された場面をイメージしてください。「手形が正常決済されました」という銀行からの連絡で安心できます。\n\n【仕訳パターン】\n・裏書譲渡時: (借方)買掛金 (貸方)受取手形\n・満期決済時: 仕訳なし（偶発債務消滅）\n・不渡り発生時: (借方)受取手形・遅延損害金 (貸方)買掛金\n・保証債務履行時: (借方)支払利息等 (貸方)現金等\n\n【間違えやすいポイント】\n・偶発債務消滅に仕訳が必要だと思ってしまう\n・裏書譲渡時との処理の区別\n・手形割引との混同\n・簿外取引の理解不足\n\n【覚え方のコツ】\n・満期決済＝責任終了（仕訳不要）\n・偶発債務＝将来の可能性（簿外管理）\n・正常決済＝心配事の終了\n・裏書責任＝手形が決済されるまで継続\n\n【この問題の仕訳】\n裏書譲渡した受取手形が満期日に正常決済されたため、偶発債務が消滅します。この処理は仕訳を必要とせず、簿外で管理していた偶発債務の記録を削除するのみです。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"裏書手形の決済・偶発債務消滅","accounts":[],"keywords":["裏書手形","偶発債務","決済","手形取引","満期日"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.150Z",
  },
  {
    id: "Q_J_108",
    category_id: "journal",
    question_text:
      "以前に割引いた受取手形90,000円が満期日に決済され、銀行借入金90,000円が自動返済された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_account":0}}',
    correct_answer_json:
      '{"journalEntry":{"note":"割引手形の満期決済は銀行処理のため仕訳を必要としません。"}}',
    explanation:
      "【基本概念】\n割引手形の決済は、以前に銀行で割引いた受取手形が満期日に決済される処理です。銀行が手形代金を回収し借入金を自動的に返済するため、仕訳は不要です。\n\n【具体例・イメージ】\n3か月前に資金調達のため受取手形90万円を銀行で割引き、借入金として処理していた手形が満期日に決済される場面をイメージしてください。銀行が「手形代金で借入金を相殺しました」と処理します。\n\n【仕訳パターン】\n・手形割引時: (借方)当座預金・手形売却損 (貸方)受取手形\n・満期決済時: 仕訳なし（銀行内部処理）\n・不渡り発生時: (借方)不渡手形 (貸方)当座預金\n・割引料負担: 手形売却損として処理済み\n\n【間違えやすいポイント】\n・満期決済時に仕訳が必要だと思ってしまう\n・借入金返済の仕訳を作ってしまう\n・手形割引時との処理の区別\n・銀行内部処理の理解不足\n\n【覚え方のコツ】\n・満期決済＝銀行処理（仕訳不要）\n・割引＝銀行との取引（自動処理）\n・手形代金＝借入金返済に充当\n・当社は処理完了の通知のみ受取\n\n【この問題の仕訳】\n割引いた受取手形が満期日に正常決済され、その代金が借入金の返済に充当されました。この処理は銀行内部で完結するため、当社側では仕訳を行いません。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"割引手形の決済・借入金返済","accounts":[],"keywords":["割引手形","決済","借入金返済","手形取引","満期日"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.151Z",
  },
  {
    id: "Q_J_109",
    category_id: "journal",
    question_text:
      "受取手形75,000円が不渡りとなり、貸倒れとして処理することにした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒損失","debit_amount":75000,"credit_account":"受取手形","credit_amount":75000}}',
    explanation:
      "【基本概念】\n受取手形の不渡り・貸倒処理は、手形が支払期日に決済されず、回収不能と判断された際の処理です。受取手形（資産）を減少させ、貸倒損失（費用）を計上します。\n\n【具体例・イメージ】\n得意先から受け取った約束手形75万円が支払期日になっても決済されず、「この会社は倒産しました」という連絡を受けて回収不能と判断する場面をイメージしてください。\n\n【仕訳パターン】\n・手形不渡時: (借方)不渡手形 (貸方)受取手形\n・貸倒処理時: (借方)貸倒損失 (貸方)不渡手形\n・一括処理時: (借方)貸倒損失 (貸方)受取手形\n・引当金利用時: (借方)貸倒引当金 (貸方)受取手形\n\n【間違えやすいポイント】\n・不渡手形勘定を経由する場合との区別\n・貸倒引当金との処理方法の違い\n・支払遅延と貸倒の判断基準\n・手形割引時の不渡処理との混同\n\n【覚え方のコツ】\n・不渡り＝約束破り（決済不能）\n・貸倒れ＝回収不能の確定\n・受取手形の消滅＝損失の計上\n・営業外費用として処理\n\n【この問題の仕訳】\n受取手形75,000円が不渡りとなり回収不能のため貸倒れとして処理するため、貸倒損失（費用）が発生し、受取手形（資産）が減少します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"受取手形の不渡り・貸倒処理","accounts":["貸倒損失","受取手形"],"keywords":["受取手形","不渡り","貸倒損失","手形取引","回収不能"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.152Z",
  },
  {
    id: "Q_J_110",
    category_id: "journal",
    question_text:
      "受取手形85,000円の取立てを銀行に依頼し、取立手数料500円が差し引かれて当座預金に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":84500,"credit_account":"受取手形","credit_amount":85000},{"debit_account":"支払手数料","debit_amount":500,"credit_account":"","credit_amount":0}}',
    explanation:
      "【基本概念】\n手形代金の取立依頼・取立手数料は、受取手形の決済を銀行に委託し、手数料を支払う処理です。手形額面から手数料を差し引いた金額が当座預金に入金されます。\n\n【具体例・イメージ】\n遠隔地の約束手形85万円があり、自社で取立てに行くのは大変なので、銀行に「この手形を取立ててください」と依頼し、手数料500円を支払う場面をイメージしてください。\n\n【仕訳パターン】\n・取立依頼時: 仕訳なし（銀行委託）\n・取立完了時: (借方)当座預金・支払手数料 (貸方)受取手形\n・取立不能時: (借方)不渡手形・支払手数料 (貸方)当座預金・受取手形\n・取立手数料: 営業外費用として処理\n\n【間違えやすいポイント】\n・手形割引との処理方法の混同\n・取立手数料の勘定科目\n・複合仕訳の金額配分\n・取立依頼時の仕訳の要否\n\n【覚え方のコツ】\n・取立て＝銀行への委託業務\n・手数料＝銀行への対価（支払手数料）\n・額面－手数料＝実際入金額\n・受取手形の確実な現金化\n\n【この問題の仕訳】\n受取手形85,000円の取立てを銀行に依頼し、取立手数料500円を差し引かれて84,500円が当座預金に入金されたため、当座預金84,500円と支払手数料500円が借方、受取手形85,000円が貸方となります。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"手形代金の取立依頼・取立手数料","accounts":["当座預金","支払手数料","受取手形"],"keywords":["受取手形","取立依頼","取立手数料","手形取引","銀行委託"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.153Z",
  },
  {
    id: "Q_J_111",
    category_id: "journal",
    question_text: "買掛金500円の支払いのため約束手形を振り出した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"買掛金","debit_amount":500,"credit_account":"支払手形","credit_amount":500}}',
    explanation:
      "【基本概念】\n約束手形の振出・支払手形計上は、買掛金等の債務の支払いのため約束手形を振り出す処理です。買掛金（負債）が減少し、支払手形（負債）が発生します。\n\n【具体例・イメージ】\n仕入先への買掛金500円の支払期日が来たが現金が不足しているため、「3か月後に500円を支払います」という約束手形を振り出して支払に代える場面をイメージしてください。\n\n【仕訳パターン】\n・手形振出時: (借方)買掛金 (貸方)支払手形\n・満期決済時: (借方)支払手形 (貸方)現金・当座預金\n・更新時: (借方)支払手形 (貸方)支払手形（新規）\n・不渡り時: (借方)支払手形 (貸方)当座預金・支払利息等\n\n【間違えやすいポイント】\n・受取手形との処理の混同\n・支払手形の借方・貸方の間違い\n・振出時と決済時の処理の区別\n・手形印紙代の処理方法\n\n【覚え方のコツ】\n・振出＝約束手形の発行（債務の振替）\n・支払手形＝将来の支払義務（負債）\n・買掛金から支払手形への振替\n・支払期限の延長効果\n\n【この問題の仕訳】\n買掛金500円の支払いのため約束手形を振り出したため、買掛金（負債）が減少し、支払手形（負債）が発生します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"約束手形の振出・支払手形計上","accounts":["買掛金","支払手形"],"keywords":["支払手形","約束手形","買掛金","手形取引","手形振出"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.153Z",
  },
  {
    id: "Q_J_112",
    category_id: "journal",
    question_text: "支払手形95,000円が満期となり、当座預金から支払われた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手形","debit_amount":95000,"credit_account":"当座預金","credit_amount":95000}}',
    explanation:
      "【基本概念】\n支払手形の満期日決済・現金支払は、以前に振り出した約束手形が支払期日に到達し、約束通り支払いを履行する処理です。支払手形（負債）が減少し、当座預金（資産）が減少します。\n\n【具体例・イメージ】\n3か月前に仕入先に振り出した約束手形95万円の支払期日が来て、銀行から「手形決済のため当座預金から95万円を支払いました」と連絡がある場面をイメージしてください。\n\n【仕訳パターン】\n・満期決済時: (借方)支払手形 (貸方)当座預金・現金\n・期日前決済時: (借方)支払手形・支払利息 (貸方)当座預金\n・更新処理時: (借方)支払手形 (貸方)支払手形（新規）\n・不渡り処理時: (借方)支払手形 (貸方)当座預金・支払利息等\n\n【間違えやすいポイント】\n・受取手形の決済との処理の混同\n・支払手形の借方・貸方の間違い\n・当座借越時の処理方法\n・手形印紙代の別途処理\n\n【覚え方のコツ】\n・満期決済＝約束の履行（債務の消滅）\n・支払手形の減少＝現金・預金の減少\n・借方に支払手形（負債の減少）\n・確実な債務履行\n\n【この問題の仕訳】\n支払手形95,000円が満期となり当座預金から支払われたため、支払手形（負債）が減少し、当座預金（資産）も減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"支払手形の満期日決済・現金支払","accounts":["支払手形","当座預金"],"keywords":["支払手形","満期日","決済","当座預金","手形取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.154Z",
  },
  {
    id: "Q_J_113",
    category_id: "journal",
    question_text:
      "支払手形100,000円を満期日の1ヶ月前に現金で決済し、割引料1,200円の収益が発生した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手形","debit_amount":100000,"credit_account":"現金","credit_amount":98800},{"debit_account":"","debit_amount":0,"credit_account":"受取利息","credit_amount":1200}}',
    explanation:
      "【基本概念】\n支払手形の期日前決済・割引料収益は、約束した支払期日より早く手形を決済することで、利息相当額の収益を得る処理です。支払手形（負債）が減少し、現金（資産）も減少しますが、受取利息（収益）が発生します。\n\n【具体例・イメージ】\n3か月後に10万円支払う約束の手形を1か月早く決済することで、「早期支払い割引として1,200円差し引いて98,800円で結構です」と言われる場面をイメージしてください。\n\n【仕訳パターン】\n・期日前決済時: (借方)支払手形 (貸方)現金・受取利息\n・通常決済時: (借方)支払手形 (貸方)現金\n・更新時: (借方)支払手形 (貸方)支払手形（新規）\n・不渡時: (借方)支払手形 (貸方)当座預金・支払利息等\n\n【間違えやすいポイント】\n・割引料を費用として処理してしまう\n・受取利息の勘定科目間違い\n・複合仕訳の金額配分\n・満期日決済との処理の区別\n\n【覚え方のコツ】\n・期日前決済＝早期支払い（割引メリット）\n・割引料＝時間価値（受取利息）\n・支払額＜手形額面（収益発生）\n・営業外収益として処理\n\n【この問題の仕訳】\n支払手形100,000円を期日前に決済し、割引料1,200円の収益が発生したため、支払手形100,000円が借方、現金98,800円と受取利息1,200円が貸方となります。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"支払手形の期日前決済・割引料収益","accounts":["支払手形","現金","受取利息"],"keywords":["支払手形","期日前決済","割引料収益","手形取引","受取利息"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.155Z",
  },
  {
    id: "Q_J_114",
    category_id: "journal",
    question_text:
      "支払手形120,000円を新しい支払手形150,000円に書き替えて更新した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手形","debit_amount":120000,"credit_account":"支払手形","credit_amount":150000},{"debit_account":"支払利息","debit_amount":30000,"credit_account":"","credit_amount":0}}',
    explanation:
      "【基本概念】\n支払手形の更新・書替え処理は、既存の支払手形を新しい条件の手形に書き替える処理です。旧手形（負債）が消滅し、新手形（負債）が発生し、通常は利息等の追加負担が発生します。\n\n【具体例・イメージ】\n12万円の手形の支払期日が来たが資金不足のため、「利息3万円を追加して15万円の新しい手形に書き替えてください」と依頼する場面をイメージしてください。\n\n【仕訳パターン】\n・手形更新時: (借方)支払手形・支払利息 (貸方)支払手形（新規）\n・満期決済時: (借方)支払手形 (貸方)現金・当座預金\n・再更新時: (借方)支払手形・支払利息 (貸方)支払手形（再新規）\n・不渡時: (借方)支払手形 (貸方)当座預金・支払利息等\n\n【間違えやすいポイント】\n・利息の勘定科目間違い\n・新旧手形の金額配分\n・複合仕訳の作成方法\n・手形振出時との処理の区別\n\n【覚え方のコツ】\n・更新＝支払期限の延長（追加負担）\n・旧手形消滅→新手形発生\n・差額＝利息等の費用\n・営業外費用として処理\n\n【この問題の仕訳】\n支払手形120,000円を新しい支払手形150,000円に書き替えたため、旧支払手形120,000円と支払利息30,000円が借方、新支払手形150,000円が貸方となります。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"支払手形の更新・書替え処理","accounts":["支払手形","支払利息"],"keywords":["支払手形","更新","書替え","手形取引","支払利息"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.156Z",
  },
  {
    id: "Q_J_115",
    category_id: "journal",
    question_text:
      "支払手形130,000円が資金不足で不渡りとなり、当座預金取引が停止された。遅延損害金5,000円も発生した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手形","debit_amount":130000,"credit_account":"買掛金","credit_amount":135000},{"debit_account":"支払利息","debit_amount":5000,"credit_account":"","credit_amount":0}}',
    explanation:
      "【基本概念】\n支払手形の不渡り・当座預金停止処理は、自社が振り出した手形が資金不足で決済できず、当座預金取引が停止される重大な処理です。支払手形（負債）が買掛金（負債）に戻り、遅延損害金（費用）も発生します。\n\n【具体例・イメージ】\n13万円の手形の支払期日が来たが当座預金残高不足で決済できず、銀行から「不渡りです。当座預金取引を停止します。遅延損害金5千円も発生しています」と連絡がある場面をイメージしてください。\n\n【仕訳パターン】\n・不渡り発生時: (借方)支払手形・支払利息 (貸方)買掛金\n・不渡り解消時: (借方)買掛金 (貸方)現金・当座預金\n・当座預金停止: 仕訳は不要（取引制限のみ）\n・再取引開始: 銀行との新規契約が必要\n\n【間違えやすいポイント】\n・不渡り時の勘定科目間違い\n・遅延損害金の処理方法\n・当座預金停止の仕訳要否\n・手形の債務関係の理解\n\n【覚え方のコツ】\n・不渡り＝約束不履行（信用失墜）\n・手形債務→買掛金債務への復帰\n・遅延損害金＝営業外費用\n・当座預金停止＝重大なペナルティ\n\n【この問題の仕訳】\n支払手形130,000円が不渡りとなり遅延損害金5,000円が発生したため、支払手形130,000円と支払利息5,000円が借方、買掛金135,000円が貸方となります。",
    difficulty: 4,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"支払手形の不渡り・当座預金停止処理","accounts":["支払手形","支払利息","買掛金"],"keywords":["支払手形","不渡り","当座預金停止","手形取引","遅延損害金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.157Z",
  },
  {
    id: "Q_J_116",
    category_id: "journal",
    question_text:
      "受取手形110,000円を紛失したため、再発行手続きを行い、手続費用2,500円を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払手数料","debit_amount":2500,"credit_account":"現金","credit_amount":2500}}',
    explanation:
      "【基本概念】\n手形の紛失・再発行手続きは、受取手形を紛失した際に行う再発行処理です。手形自体の価値は変わらないため、手続費用のみを費用として計上し、手形の帳簿価額は変更しません。\n\n【具体例・イメージ】\n大切な受取手形11万円を紛失してしまい、「公示催告手続きと再発行で手数料2,500円かかります」と言われて支払う場面をイメージしてください。手形の権利は失われていないので、手数料のみ支払います。\n\n【仕訳パターン】\n・手続費用支払時: (借方)支払手数料 (貸方)現金\n・再発行完了時: 仕訳なし（手形価値変わらず）\n・除権決定時: 仕訳なし（権利確定のみ）\n・回収時: (借方)現金・当座預金 (貸方)受取手形\n\n【間違えやすいポイント】\n・手形を損失として処理してしまう\n・再発行時に受取手形を増減させる\n・手続費用の勘定科目間違い\n・紛失と盗難の処理の区別\n\n【覚え方のコツ】\n・紛失＝物理的消失（権利は継続）\n・再発行＝権利の確認手続き\n・手続費用＝営業外費用\n・手形価値は不変\n\n【この問題の仕訳】\n受取手形の再発行手続きで手続費用2,500円を現金で支払ったため、支払手数料（費用）が発生し、現金（資産）が減少します。手形自体の価値は変わりません。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"手形の紛失・再発行手続き","accounts":["支払手数料","現金"],"keywords":["受取手形","紛失","再発行手続き","手形取引","支払手数料"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.158Z",
  },
  {
    id: "Q_J_117",
    category_id: "journal",
    question_text:
      "約束手形140,000円を振り出す際に、印紙税200円を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":200,"credit_account":"現金","credit_amount":200}}',
    explanation:
      "【基本概念】\n手形印紙税の処理は、約束手形を振り出す際に印紙税法に基づいて納める税金の処理です。手形振出時に印紙を貼付し、その費用を租税公課（費用）として計上します。\n\n【具体例・イメージ】\n14万円の約束手形を振り出す際、「この金額だと印紙税200円が必要です」と言われて現金で支払い、手形に印紙を貼る場面をイメージしてください。\n\n【仕訳パターン】\n・印紙税支払時: (借方)租税公課 (貸方)現金\n・手形振出時: (借方)買掛金等 (貸方)支払手形\n・印紙代立替時: (借方)仮払金 (貸方)現金\n・立替金回収時: (借方)現金 (貸方)仮払金\n\n【間違えやすいポイント】\n・印紙税の勘定科目間違い\n・手形振出と印紙税の仕訳を混同\n・立替えと直接支払いの区別\n・消費税の取扱い\n\n【覚え方のコツ】\n・印紙税＝国税（租税公課）\n・手形作成時の必要経費\n・金額に応じた税率適用\n・営業外費用として処理\n\n【この問題の仕訳】\n約束手形振り出し時の印紙税200円を現金で支払ったため、租税公課（費用）が発生し、現金（資産）が減少します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"手形印紙税の処理","accounts":["租税公課","現金"],"keywords":["約束手形","印紙税","租税公課","手形取引","税金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.159Z",
  },
  {
    id: "Q_J_118",
    category_id: "journal",
    question_text:
      "取引先A社の約束手形160,000円について、B社が保証人となった。保証債務の設定に伴う偶発債務の記録を行った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"note":"保証債務・偶発債務は簿外取引のため仕訳を必要としません。"}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"bill_of_exchange","pattern":"手形取引","subpattern":"手形の保証債務・偶発債務","accounts":[],"keywords":["約束手形","保証債務","偶発債務","手形取引","簿外取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.159Z",
  },
  {
    id: "Q_J_119",
    category_id: "journal",
    question_text: "取引先に事業資金100,000円を現金で貸し付けた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸付金","debit_amount":100000,"credit_account":"現金","credit_amount":100000}}',
    explanation:
      "【基本概念】\n貸付金は、他の企業や個人に金銭を貸し付けた際に計上する債権勘定です。将来的に返済を受ける権利を表す資産として記録します。\n\n【具体例・イメージ】\n取引先が一時的に資金不足になった際に、「助け合い」として事業資金を貸し付ける場面をイメージしてください。後日、約束した期日に返済を受けます。\n\n【仕訳パターン】\n・貸付実行時: (借方)貸付金 (貸方)現金\n・利息受取時: (借方)現金 (貸方)受取利息\n・元本回収時: (借方)現金 (貸方)貸付金\n\n【間違えやすいポイント】\n・貸し付けた時に貸付金を貸方に記入してしまう\n・売掛金との区別（商品売上以外は貸付金）\n・立替金との混同（一時的立替は立替金）\n・利息の取り扱いを忘れる\n\n【覚え方のコツ】\n・「貸し付けた」お金は「債権」（資産）\n・お金を渡したら現金減少（貸方）\n・将来の「回収権利」を取得（借方）\n・「金融取引」は本業外取引\n\n【この問題の仕訳】\n取引先に100,000円を現金で貸し付けたため、貸付金100,000円の増加（借方）と現金100,000円の減少（貸方）を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"金銭の貸付・貸付金計上","accounts":["貸付金","現金"],"keywords":["貸付金","金銭の貸付","債権","貸借取引","資金貸付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.160Z",
  },
  {
    id: "Q_J_120",
    category_id: "journal",
    question_text:
      "貸付金に対する利息5,000円（未収利息2,000円を含む）を現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"現金","debit_amount":5000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"未収利息","credit_amount":2000},{"debit_account":"","debit_amount":0,"credit_account":"受取利息","credit_amount":3000}]}',
    explanation:
      "【基本概念】\n貸付金利息は、金銭を貸し付けた際に発生する収益です。未収利息は既に発生している利息の債権部分で、受取利息は当期の収益部分として区分します。\n\n【具体例・イメージ】\n毎月末に利息を受け取る約束で資金を貸し付けた場面をイメージしてください。「前月分の未回収利息」と「今月分の新発生利息」を合わせて現金で受け取ります。\n\n【仕訳パターン】\n・未収利息の回収: (借方)現金 (貸方)未収利息\n・当期発生利息: (借方)現金 (貸方)受取利息\n・複合仕訳: 現金=未収利息消滅+当期利息収益\n\n【間違えやすいポイント】\n・全額を受取利息で処理してしまう\n・未収利息を借方に記入してしまう\n・複合仕訳を単一仕訳で処理してしまう\n・金額の内訳計算ミス\n\n【覚え方のコツ】\n・「未収」は既発生済み債権の回収\n・「受取利息」は当期新発生の収益\n・現金受取=債権回収+収益発生\n・複合仕訳は要素別に分解して考える\n\n【この問題の仕訳】\n利息5,000円のうち未収利息2,000円（債権消滅）と受取利息3,000円（収益発生）の複合仕訳となります。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"貸付金利息の定期受取（未収利息含む）","accounts":["現金","未収利息","受取利息"],"keywords":["貸付金利息","未収利息","受取利息","貸借取引","複合仕訳"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.161Z",
  },
  {
    id: "Q_J_121",
    category_id: "journal",
    question_text: "貸付金80,000円が満期となり、全額現金で回収した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":80000,"credit_account":"貸付金","credit_amount":80000}}',
    explanation:
      "【基本概念】\n貸付金の回収は、貸し付けた元本が満期により返済される取引です。債権である貸付金が消滅し、現金が増加する資産の振替取引となります。\n\n【具体例・イメージ】\n友人に貸していたお金が約束の期日に全額返済される場面をイメージしてください。「貸し付けていた権利」が「現金」に変わります。\n\n【仕訳パターン】\n・一括返済: (借方)現金 (貸方)貸付金\n・分割返済: 各回の返済分ずつ同様処理\n・期限前返済: 同じ仕訳（利息は別途計算）\n\n【間違えやすいポイント】\n・貸付金を借方に記入してしまう\n・利息と元本を混同してしまう\n・分割返済で全額処理してしまう\n・回収不能時の処理との混同\n\n【覚え方のコツ】\n・「回収」=債権の現金化\n・貸付金減少（貸方）、現金増加（借方）\n・「資産の形態変化」をイメージ\n・満期回収は全額処理\n\n【この問題の仕訳】\n貸付金80,000円の満期回収により、現金80,000円の増加と貸付金80,000円の減少を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"貸付金の期限一括返済・分割返済","accounts":["現金","貸付金"],"keywords":["貸付金回収","満期返済","一括返済","貸借取引","元本回収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.162Z",
  },
  {
    id: "Q_J_122",
    category_id: "journal",
    question_text: "貸付金50,000円が回収不能となり、貸倒損失として処理した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒損失","debit_amount":50000,"credit_account":"貸付金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n貸付金の貸倒れは、貸し付けた金銭が回収不能となった際の損失処理です。債権である貸付金を消去し、同額を貸倒損失として費用計上します。\n\n【具体例・イメージ】\n友人に貸していたお金が、相手の経営破綻により返してもらえなくなった場面をイメージしてください。「債権」を「損失」として処理します。\n\n【仕訳パターン】\n・直接償却: (借方)貸倒損失 (貸方)貸付金\n・引当金使用: (借方)貸倒引当金 (貸方)貸付金\n・一部回収不能: 回収不能分のみ処理\n\n【間違えやすいポイント】\n・貸付金を借方に記入してしまう\n・損失を貸方に記入してしまう\n・引当金との処理区分を間違える\n・一部回収可能時の金額計算ミス\n\n【覚え方のコツ】\n・「回収不能」=債権消滅+損失発生\n・貸付金減少（貸方）、損失増加（借方）\n・「諦める」=資産を費用に振替\n・直接償却が基本処理\n\n【この問題の仕訳】\n貸付金50,000円の回収不能により、貸倒損失50,000円の発生と貸付金50,000円の消去を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"貸付金の貸倒れ・回収不能処理","accounts":["貸倒損失","貸付金"],"keywords":["貸付金貸倒れ","回収不能","貸倒損失","貸借取引","直接償却"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.163Z",
  },
  {
    id: "Q_J_123",
    category_id: "journal",
    question_text:
      "役員A氏に50,000円を貸し付けた。なお、当座預金から支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸付金","debit_amount":50000,"credit_account":"当座預金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n役員や従業員への貸付金は、通常の貸付金とは区別して管理される資産勘定です。役員貸付金は利息を適切に設定する必要があります。\n\n【具体例・イメージ】\n会社が役員に一時的にお金を貸す場合をイメージしてください。個人的な用途でも、適正な利率で利息を設定する必要があります。\n\n【仕訳パターン】\n・貸付時: 借方に貸付金、貸方に現金/当座預金\n・利息受取時: 借方に現金、貸方に受取利息\n・返済時: 借方に現金、貸方に貸付金\n\n【間違えやすいポイント】\n・無利息の役員貸付は税務上問題となる場合がある\n・立替金と貸付金を混同しやすい\n・返済時に元本と利息を分けて処理する\n\n【覚え方のコツ】\n・「貸付金」は資産（将来回収する権利）\n・役員貸付は特に税務上の注意が必要\n・利息設定は適正レートで\n・貸す時は借方、回収時は貸方\n\n【この問題の仕訳】\n役員への貸付実行時の処理。貸付金（資産）が増加し、当座預金（資産）が減少する。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"役員・従業員向け貸付金の特別処理","accounts":["貸付金","当座預金"],"keywords":["役員貸付","貸付金","当座預金","貸借取引"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.164Z",
  },
  {
    id: "Q_J_124",
    category_id: "journal",
    question_text:
      "銀行から運転資金として200,000円を借り入れ、当座預金口座に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"当座預金","debit_amount":200000,"credit_account":"借入金","credit_amount":200000}}',
    explanation:
      "【基本概念】\n借入金は、銀行や金融機関から資金を借り入れた際に計上する負債勘定です。将来的に返済する義務を表し、通常は利息も併せて支払います。\n\n【具体例・イメージ】\n事業拡大のために銀行から融資を受ける場面をイメージしてください。お金を受け取る代わりに「返済する義務」が発生します。\n\n【仕訳パターン】\n・借入実行時: (借方)現金・当座預金 (貸方)借入金\n・利息支払時: (借方)支払利息 (貸方)現金\n・元本返済時: (借方)借入金 (貸方)現金\n\n【間違えやすいポイント】\n・借入時に借入金を借方に記入してしまう\n・貸付金との区別（借りる=借入金、貸す=貸付金）\n・利息と元本を混同してしまう\n・未払金との区分を間違える\n\n【覚え方のコツ】\n・「借りた」お金は「返済義務」（負債）\n・お金を受け取ったら資産増加（借方）\n・将来の「返済義務」を認識（貸方）\n・「金融取引」は本業外取引\n\n【この問題の仕訳】\n銀行から200,000円を借り入れたため、当座預金200,000円の増加（借方）と借入金200,000円の計上（貸方）を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"金銭の借入・借入金計上","accounts":["当座預金","借入金"],"keywords":["借入金","金銭借入","銀行借入","貸借取引","運転資金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.165Z",
  },
  {
    id: "Q_J_125",
    category_id: "journal",
    question_text:
      "借入金利息8,000円（未払利息3,000円を含む）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払利息","debit_amount":3000,"credit_account":"","credit_amount":0},{"debit_account":"支払利息","debit_amount":5000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":8000}]}',
    explanation:
      "【基本概念】\n未払利息を含む借入金利息の支払いは、前期からの未払分と当期発生分を区別して処理します。未払利息は負債の減少、新たな支払利息は費用の発生です。\n\n【具体例・イメージ】\n借入金の利息支払日に、前回支払日以降に発生した利息の一部が前期の未払分であった場合をイメージしてください。過去の負債を清算し、新たな費用を認識します。\n\n【仕訳パターン】\n・未払利息のある利息支払: 借方に未払利息+支払利息、貸方に現金\n・通常の利息支払: 借方に支払利息、貸方に現金\n・利息の未払計上: 借方に支払利息、貸方に未払利息\n\n【間違えやすいポイント】\n・未払利息と支払利息を混同する\n・複合仕訳の金額配分を間違える\n・前期分と当期分の区別ができない\n・支払総額と内訳の関係を理解しない\n\n【覚え方のコツ】\n・「未払」は過去の負債解消\n・「支払利息」は当期の費用\n・総支払額＝未払分＋当期分\n・複合仕訳では借方合計＝貸方金額\n\n【この問題の仕訳】\n借入金利息8,000円の支払いのうち、未払利息3,000円（前期分）と支払利息5,000円（当期分）に分けて処理します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"借入金利息の定期支払・未払利息含む","accounts":["未払利息","支払利息","現金"],"keywords":["借入金利息","未払利息","支払利息","貸借取引","複合仕訳"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.166Z",
  },
  {
    id: "Q_J_126",
    category_id: "journal",
    question_text: "借入金150,000円を満期日に一括返済し、現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"借入金","debit_amount":150000,"credit_account":"現金","credit_amount":150000}}',
    explanation:
      "【基本概念】\n借入金の返済は負債の減少を表す取引です。借入時とは逆の処理で、借入金勘定を借方に記入して負債を消滅させます。\n\n【具体例・イメージ】\n銀行から借りたお金を約束の満期日にまとめて返済する場面をイメージしてください。借金がなくなり、同時に手持ちの現金が減少します。\n\n【仕訳パターン】\n・一括返済: (借方)借入金 (貸方)現金\n・分割返済: (借方)借入金 (貸方)現金（毎回元本部分）\n・元利均等返済: (借方)借入金+支払利息 (貸方)現金\n\n【間違えやすいポイント】\n・借入金を貸方に記入してしまう\n・利息分と元本分を分けて考えない\n・返済時の借方・貸方を借入時と混同する\n・分割返済での元本・利息按分計算\n\n【覚え方のコツ】\n・「借入金」は負債（将来支払う義務）\n・返済=負債の「減少」→借方記入\n・現金で支払う=現金「減少」→貸方記入\n・「借りた時」と「返す時」は逆の仕訳\n\n【この問題の仕訳】\n借入金150,000円の満期一括返済により、借入金150,000円の減少（借方）と現金150,000円の減少（貸方）を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"借入金の期限一括返済・分割返済","accounts":["借入金","現金"],"keywords":["借入金","一括返済","満期日","負債消滅","元本返済"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.166Z",
  },
  {
    id: "Q_J_127",
    category_id: "journal",
    question_text:
      "借入金200,000円を約定満期日前に繰上返済し、当座預金から支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"借入金","debit_amount":200000,"credit_account":"当座預金","credit_amount":200000}}',
    explanation:
      "【基本概念】\n借入金の期限前償還（繰上返済）は、約定満期日よりも早く借入金を返済する取引です。通常の返済と同様に負債の減少として処理します。\n\n【具体例・イメージ】\n資金繰りに余裕ができたため、予定よりも早く銀行借入を完済する場面をイメージしてください。利息負担を軽減する目的で行われます。\n\n【仕訳パターン】\n・繰上返済: (借方)借入金 (貸方)当座預金\n・期限前償還手数料: (借方)支払手数料 (貸方)現金\n・繰上返済+手数料: (借方)借入金+支払手数料 (貸方)当座預金\n\n【間違えやすいポイント】\n・期限前償還手数料の処理を忘れる\n・借入金を貸方に記入してしまう\n・利息計算の日割り処理\n・違約金の発生する場合の処理\n\n【覚え方のコツ】\n・「繰上返済」も通常返済と同じ仕訳\n・「期限前」でも借入金は借方で消去\n・手数料発生時は支払手数料で計上\n・資金効率向上が目的\n\n【この問題の仕訳】\n借入金200,000円の期限前償還により、借入金200,000円の減少（借方）と当座預金200,000円の減少（貸方）を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"借入金の期限前償還・繰上返済","accounts":["借入金","当座預金"],"keywords":["借入金","期限前償還","繰上返済","負債消滅","資金効率"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.167Z",
  },
  {
    id: "Q_J_128",
    category_id: "journal",
    question_text:
      "既存の借入金300,000円を新たな条件の借入金400,000円に借り替えた。差額100,000円は当座預金に入金された。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"借入金","debit_amount":300000,"credit_account":"","credit_amount":0},{"debit_account":"当座預金","debit_amount":100000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"借入金","credit_amount":400000}]}',
    explanation:
      "【基本概念】\n借入金の借替えは、既存の借入金を新たな条件の借入金に変更する取引です。旧借入金の消滅と新借入金の発生、差額資金の増減が同時に行われます。\n\n【具体例・イメージ】\nより有利な金利条件で他の金融機関から借り換えする場面をイメージしてください。古い借金をなくして、新しい借金を作り、差額があれば追加資金が手に入ります。\n\n【仕訳パターン】\n・借替え（増額）: (借方)旧借入金+当座預金 (貸方)新借入金\n・借替え（減額）: (借方)旧借入金 (貸方)新借入金+当座預金\n・同額借替え: (借方)旧借入金 (貸方)新借入金\n\n【間違えやすいポイント】\n・新旧借入金の区別がつかない\n・差額計算を間違える\n・複合仕訳を単一仕訳で処理してしまう\n・手数料・諸費用の処理を忘れる\n\n【覚え方のコツ】\n・「古い借金」を消して「新しい借金」を作る\n・差額は資金の「追加調達」または「返済」\n・借替えは「条件変更」が目的\n・複合取引として要素別に分解\n\n【この問題の仕訳】\n旧借入金300,000円の消滅（借方）、新借入金400,000円の発生（貸方）、差額100,000円の資金調達（借方当座預金）の複合仕訳です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"lending_borrowing","pattern":"貸借取引","subpattern":"借入金の借替え・条件変更処理","accounts":["借入金","当座預金"],"keywords":["借入金","借替え","条件変更","資金調達","複合仕訳"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.168Z",
  },
  {
    id: "Q_J_129",
    category_id: "journal",
    question_text:
      "月次給与として基本給450,000円、諸手当50,000円の合計500,000円を計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":500000,"credit_account":"未払給料","credit_amount":500000}}',
    explanation:
      "【基本概念】\n月次給与の総支給額計上は、実際の支払前に給与債務を認識する発生主義処理です。基本給と諸手当を合計した総支給額を給料（費用）として計上します。\n\n【具体例・イメージ】\n毎月25日締めで翌月10日払いの給与制度をイメージしてください。月末時点で当月分給与を確定し、支払日まで未払給料として負債計上します。\n\n【仕訳パターン】\n・給与計上時: 借方に給料、貸方に未払給料\n・給与支払時: 借方に未払給料、貸方に各種預り金と現金\n・諸手当含む: 基本給+残業代+通勤手当等の合計\n\n【間違えやすいポイント】\n・手取額で計上してしまう（正解は総支給額）\n・支払時に直接給料を使ってしまう\n・基本給のみで諸手当を含めない\n・未払給料を忘れて現金で直接処理\n\n【覚え方のコツ】\n・「総支給額」＝基本給＋諸手当\n・「計上」＝費用認識（支払前）\n・「未払給料」＝将来の支払義務\n・発生主義＝発生時点で費用計上\n\n【この問題の仕訳】\n基本給450,000円と諸手当50,000円の合計500,000円を給料（費用）として計上し、未払給料（負債）を同額認識します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"給与支払パターン","subpattern":"月次給与の総支給額計算・計上","accounts":["給料","未払給料"],"keywords":["月次給与","基本給","諸手当","給与支払パターン","総支給額計上"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.169Z",
  },
  {
    id: "Q_J_130",
    category_id: "journal",
    question_text:
      "残業代40,000円、通勤手当15,000円、住宅手当10,000円を基本給に加算して支給する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":65000,"credit_account":"未払給料","credit_amount":65000}}',
    explanation:
      "【基本概念】\n諸手当の計上は、基本給以外の給与追加支給項目を統一して給料として計上する処理です。残業代、通勤手当、住宅手当等を合計します。\n\n【具体例・イメージ】\n毎月の給与明細で「残業手当」「通勤手当」「住宅手当」として表示される項目をイメージしてください。\n\n【仕訳パターン】\n・諸手当計上: 借方に給料、貸方に未払給料\n・支給時: 借方に未払給料、貸方に現金等\n・各種手当: 残業代+通勤手当+住宅手当\n\n【間違えやすいポイント】\n・諸手当を別々の勘定で処理してしまう\n・一部手当を含め忘れる\n・給料以外の勘定科目を使う\n・支給時に直接手当を計上する\n\n【覚え方のコツ】\n・「諸手当」＝基本給以外の給与\n・全て「給料」勘定で統一計上\n・手当の種類を問わず給料費用\n・支給前は未払給料で負債計上\n\n【この問題の仕訳】\n残業代40,000円、通勤手当15,000円、住宅手当10,000円の合計65,000円を給料で計上し、未払給料として負債認識します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"給与支払パターン","subpattern":"基本給・諸手当の合計支給","accounts":["給料","未払給料"],"keywords":["残業代","通勤手当","住宅手当","諸手当","給与支払パターン"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.170Z",
  },
  {
    id: "Q_J_131",
    category_id: "journal",
    question_text:
      "給与総支給額から源泉所得税45,000円を天引きして現金で支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":565000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":45000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":520000}]}',
    explanation:
      "【基本概念】\n給与からの源泉所得税天引き支給は、未払給料を減らし、預り金（負債）と現金支給に分けて処理する複合仕訳です。\n\n【具体例・イメージ】\n給与支給日に総支給額565,000円から所得税45,000円を天引きし、手取520,000円を現金で支給する場面をイメージしてください。\n\n【仕訳パターン】\n・天引き支給: 借方に未払給料、貸方に預り金+現金\n・源泉税納付: 借方に預り金、貸方に現金\n・複合仕訳: 借方合計=貸方合計\n\n【間違えやすいポイント】\n・総支給額ではなく手取額で未払給料を減らす\n・預り金を忘れて現金のみで処理\n・複合仕訳の金額バランスを間違える\n・源泉税を費用で計上してしまう\n\n【覚え方のコツ】\n・「天引き」=会社が代行徴収\n・預り金=将来の税務署納付義務\n・手取額=総支給額−天引き額\n・複合仕訳で未払給料を減らす\n\n【この問題の仕訳】\n未払給料565,000円を減らし、源泉税預り金45,000円と現金520,000円に分けて支給します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"給与支払パターン","subpattern":"給与からの源泉所得税天引き","accounts":["未払給料","預り金","現金"],"keywords":["源泉所得税","天引き","預り金","給与支払パターン"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.171Z",
  },
  {
    id: "Q_J_132",
    category_id: "journal",
    question_text: "給与から住民税18,000円を天引きして振込で支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":565000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":18000},{"debit_account":"","debit_amount":0,"credit_account":"普通預金","credit_amount":547000}]}',
    explanation:
      "【基本概念】\n給与からの住民税天引き支給は、未払給料を減らし、預り金（負債）と振込支給に分けて処理する複合仕訳です。住民税は前年所得に基づく確定額を12分割して毎月天引きします。\n\n【具体例・イメージ】\n給与支給日に総支給額565,000円から住民税18,000円を天引きし、手取547,000円を銀行振込で支給する場面をイメージしてください。\n\n【仕訳パターン】\n・住民税天引き支給: 借方に未払給料、貸方に預り金+普通預金\n・住民税納付: 借方に預り金、貸方に普通預金\n・複合仕訳: 借方合計=貸方合計\n・振込手数料: 通常会社負担で支払手数料計上\n\n【間違えやすいポイント】\n・総支給額ではなく手取額で未払給料を減らす\n・預り金を忘れて普通預金のみで処理\n・住民税を費用で計上してしまう\n・振込と現金支給の勘定科目を間違える\n\n【覚え方のコツ】\n・住民税=前年所得ベースの確定税額\n・預り金=将来の市町村納付義務\n・手取額=総支給額−住民税天引額\n・振込=普通預金、現金支給=現金勘定\n\n【この問題の仕訳】\n未払給料565,000円を減らし、住民税預り金18,000円と普通預金547,000円に分けて振込支給します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"給与支払パターン","subpattern":"給与からの住民税天引き","accounts":["未払給料","預り金","普通預金"],"keywords":["住民税","天引き","預り金","給与支払パターン"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.171Z",
  },
  {
    id: "Q_J_133",
    category_id: "journal",
    question_text:
      "給与から社会保険料（健康保険料・厚生年金保険料）35,000円を天引きして現金で支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":500000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":35000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":465000}]}',
    explanation:
      "【基本概念】\n給与からの社会保険料天引き支給は、未払給料を減らし、預り金（負債）と現金支給に分けて処理する複合仕訳です。社会保険料は健康保険料と厚生年金保険料を合わせた従業員負担分です。\n\n【具体例・イメージ】\n給与支給日に総支給額500,000円から社会保険料（健康保険+厚生年金）35,000円を天引きし、手取465,000円を現金で支給する場面をイメージしてください。\n\n【仕訳パターン】\n・社会保険料天引き支給: 借方に未払給料、貸方に預り金+現金\n・社会保険料納付: 借方に法定福利費+預り金、貸方に現金\n・複合仕訳: 借方合計=貸方合計\n・労使折半: 従業員負担分と会社負担分が同額\n\n【間違えやすいポイント】\n・総支給額ではなく手取額で未払給料を減らす\n・預り金を忘れて現金のみで処理\n・社会保険料を費用で計上してしまう\n・会社負担分と従業員負担分を混同する\n\n【覚え方のコツ】\n・社会保険料=健康保険+厚生年金\n・預り金=将来の年金機構・協会けんぽ等納付義務\n・手取額=総支給額−社会保険料天引額\n・労使折半=会社も同額負担（法定福利費）\n\n【この問題の仕訳】\n未払給料500,000円を減らし、社会保険料預り金35,000円と現金465,000円に分けて支給します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"給与支払パターン","subpattern":"給与からの社会保険料天引き","accounts":["未払給料","預り金","現金"],"keywords":["社会保険料","天引き","預り金","給与支払パターン"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.172Z",
  },
  {
    id: "Q_J_134",
    category_id: "journal",
    question_text:
      "給与から雇用保険料（従業員負担分）2,500円を天引きして現金で支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":450000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":2500},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":447500}]}',
    explanation:
      "【基本概念】\n給与からの雇用保険料天引き支給は、未払給料を減らし、預り金（負債）と現金支給に分けて処理する複合仕訳です。雇用保険料は従業員と会社がそれぞれ負担し、従業員負担分は預り金として処理します。\n\n【具体例・イメージ】\n月末の給与計算で、総支給額45万円から雇用保険料（従業員負担分）2,500円を天引きし、差引支給額447,500円を現金で支払う場面をイメージしてください。\n\n【仕訳パターン】\n・未払給料（借方）: 総支給額450,000円\n・預り金（貸方）: 雇用保険料2,500円\n・現金（貸方）: 差引支給額447,500円\n\n【間違えやすいポイント】\n・雇用保険料を法定福利費で処理する（会社負担分と混同）\n・総支給額と差引支給額を間違える\n・三分法の複合仕訳を単一仕訳で処理する\n・預り金の性質（負債）を理解していない\n\n【覚え方のコツ】\n・給与天引き処理は「未払給料→預り金＋支払方法」\n・雇用保険料の従業員負担分は「預り金」\n・会社負担分は「法定福利費」（別取引）\n・複合仕訳では貸借が必ず一致する\n\n【この問題の解き方】\n総支給額から天引き額を差し引いた差引支給額を計算し、未払給料（借方）、預り金・現金（貸方）の三分法仕訳で処理します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"雇用保険料天引き","accounts":["未払給料","預り金","現金"],"keywords":["給与支払","雇用保険料","天引き","複合仕訳"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.173Z",
  },
  {
    id: "Q_J_135",
    category_id: "journal",
    question_text:
      "給与450,000円を現金で支給した。源泉所得税などの天引きはなし。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":450000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":450000}]}',
    explanation:
      "【基本概念】\n差引支給額の現金支払は、未払給料を減らして現金で支払うシンプルな仕訳です。天引きがない場合は、未払給料と現金の単純な交換取引となります。\n\n【具体例・イメージ】\n月末に給与計算が確定し、天引き項目がないため総支給額45万円をそのまま現金で支払う場面をイメージしてください。\n\n【仕訳パターン】\n・未払給料（借方）: 450,000円\n・現金（貸方）: 450,000円\n※振込支払の場合は「現金」の代わりに「普通預金」\n\n【間違えやすいポイント】\n・給料費と未払給料を混同する（計上時と支払時の区別）\n・現金支払と振込支払の勘定科目を間違える\n・天引き項目がある場合の複合仕訳と混同する\n・未払給料の借貸方向を間違える\n\n【覚え方のコツ】\n・給与支払は「未払給料減少」\n・天引きなしの場合は単純交換取引\n・現金支払＝現金（貸方）、振込支払＝普通預金（貸方）\n・未払給料は負債なので減少は借方記入\n\n【この問題の解き方】\n天引きなしの給与現金支払は、未払給料（借方）と現金（貸方）の単純な二勘定仕訳で処理します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"差引支給額現金支払","accounts":["未払給料","現金"],"keywords":["給与支払","差引支給額","現金支払",「単純交換」],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.174Z",
  },
  {
    id: "Q_J_136",
    category_id: "journal",
    question_text:
      "月末に確定した給与500,000円は翌月支払いとし、未払いとして計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"給料","debit_amount":500000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"未払給料","credit_amount":500000}]}',
    explanation:
      "【基本概念】\n給与の未払計上は、給与費用を発生時期に計上し、実際の支払いは後日に行う発生主義の処理です。給料（費用）と未払給料（負債）を計上します。\n\n【具体例・イメージ】\n3月末に3月分の給与が確定したが、実際の支払いは4月10日の予定である場合をイメージしてください。サラリーマンの給与支払日の一般的なパターンです。\n\n【仕訳パターン】\n・給料（借方）: 500,000円\n・未払給料（貸方）: 500,000円\n※翌月の実際支払時には「未払給料/現金」の仕訳\n\n【間違えやすいポイント】\n・給料と未払給料の借貸方向を間違える\n・発生主義と現金主義を混同する\n・給料費用と給与支払を混同する\n・未払給料の性質（負債）を理解していない\n\n【覚え方のコツ】\n・給与計上は「給料（費用）発生」\n・未払いは「未払給料（負債）発生」\n・給料は費用なので借方、未払給料は負債なので貸方\n・発生主義では支払日でなく発生日で計上\n\n【この問題の解き方】\n給与の確定時点で給料費用を計上し、実際支払いまでの間は未払給料（負債）として処理します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"未払給料計上","accounts":["給料","未払給料"],"keywords":["給与支払","未払計上","発生主義","翌月支払"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.175Z",
  },
  {
    id: "Q_J_137",
    category_id: "journal",
    question_text:
      "賞与600,000円から源泉所得税60,000円、社会保険料30,000円を天引きして振込で支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払賞与","debit_amount":600000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":90000},{"debit_account":"","debit_amount":0,"credit_account":"普通預金","credit_amount":510000}]}',
    explanation:
      "【基本概念】\n賞与からの各種控除天引き支給は、未払賞与を減らし、預り金（負債）と振込支給に分けて処理する複合仕訳です。賞与は月給よりも天引き項目が多く、複雑な計算が必要です。\n\n【具体例・イメージ】\n夏期ボーナス支給時に、総支給額60万円から源泉所得税6万円、社会保険料3万円を天引きし、差引支給額51万円を振込で支払う場面をイメージしてください。\n\n【仕訳パターン】\n・未払賞与（借方）: 総支給額600,000円\n・預り金（貸方）: 天引き合計（源泉税+社会保険料）90,000円\n・普通預金（貸方）: 差引支給額510,000円\n\n【間違えやすいポイント】\n・賞与と月給の違いを理解していない\n・総支給額と差引支給額を混同する\n・複数の天引き項目を別々に処理する（まとめて預り金）\n・振込支払と現金支払の勘定科目を間違える\n\n【覚え方のコツ】\n・賞与天引き処理は「未払賞与→預り金＋振込」\n・複数天引きは「まとめて預り金」で処理\n・振込支払は「普通預金」、現金支払は「現金」\n・複合仕訳では貸借が必ず一致する\n\n【この問題の解き方】\n総支給額から各種天引きを差し引いた差引支給額を計算し、未払賞与（借方）、預り金・普通預金（貸方）の三分法仕訳で処理します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_payment","pattern":"賞与天引き支給","accounts":["未払賞与","預り金","普通預金"],"keywords":["賞与支給","天引き処理","複合仕訳","振込支給"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.176Z",
  },
  {
    id: "Q_J_138",
    category_id: "journal",
    question_text:
      "決算賞与800,000円を未払いとして計上し、同額の賞与引当金を設定した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":500,"credit_account":"預り金","credit_amount":500}}',
    explanation:
      "【基本概念】\n法人税等、消費税、固定資産税、印紙税などの税金処理。租税公課として費用計上するものと、仮払・仮受で処理するものがあります。\n\n【具体例・イメージ】\n会社が納める法人税や、商品に含まれる消費税、事務所の固定資産税などをイメージしてください。税金の種類により処理方法が異なります。\n\n【仕訳パターン】\n・法人税等: 借方に法人税等、貸方に未払法人税等\n・消費税（税抜）: 借方に仮払消費税、貸方に現金\n・固定資産税: 借方に租税公課、貸方に現金\n\n【間違えやすいポイント】\n・税込経理と税抜経理を混同する\n・消費税の仮払・仮受を間違える\n・法人税等の処理時期を間違える\n・租税公課に含まれない税金を理解していない\n\n【覚え方のコツ】\n・法人税等は「当期利益への課税」\n・消費税は「預り・立替」\n・租税公課は「事業活動に関する税金」\n・税抜経理では「仮払・仮受」を使用\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.177Z",
  },
  {
    id: "Q_J_139",
    category_id: "journal",
    question_text: "固定資産税300円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":300,"credit_account":"現金","credit_amount":300}}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.178Z",
  },
  {
    id: "Q_J_140",
    category_id: "journal",
    question_text: "法人税等300円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":300,"credit_account":"当座預金","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.179Z",
  },
  {
    id: "Q_J_141",
    category_id: "journal",
    question_text:
      "従業員に給料500円を支払った。なお、源泉所得税500円を差し引いた。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n従業員への給与支払いと関連する社会保険料・源泉徴収の処理。給与総額から各種控除額を差し引いた手取額を支給します。\n\n【具体例・イメージ】\n毎月の給与明細で天引きされる項目をイメージしてください。総支給額から健康保険料、厚生年金保険料、雇用保険料、所得税が控除されます。\n\n【仕訳パターン】\n・給与支給時: 借方に給料、貸方に各種預り金と現金\n・社会保険料納付時: 借方に法定福利費・預り金、貸方に現金\n・源泉所得税納付時: 借方に預り金、貸方に現金\n\n【間違えやすいポイント】\n・総支給額と手取額を混同する\n・会社負担分と従業員負担分を間違える\n・預り金の処理を忘れる\n・賞与の社会保険料計算を間違える\n\n【覚え方のコツ】\n・給料は「総額で計上、差額は預り金」\n・社会保険料は「労使折半」\n・源泉徴収は「会社が代理納付」\n・預り金は負債（いずれ支払う義務）\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"給料支払","accounts":["給料","現金","預り金"],"keywords":["給料","源泉所得税","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.179Z",
  },
  {
    id: "Q_J_142",
    category_id: "journal",
    question_text:
      "社会保険料350円（会社負担150円、従業員負担10円）を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":350,"credit_account":"預り金","credit_amount":350}}',
    explanation:
      "【基本概念】\n法人税等、消費税、固定資産税、印紙税などの税金処理。租税公課として費用計上するものと、仮払・仮受で処理するものがあります。\n\n【具体例・イメージ】\n会社が納める法人税や、商品に含まれる消費税、事務所の固定資産税などをイメージしてください。税金の種類により処理方法が異なります。\n\n【仕訳パターン】\n・法人税等: 借方に法人税等、貸方に未払法人税等\n・消費税（税抜）: 借方に仮払消費税、貸方に現金\n・固定資産税: 借方に租税公課、貸方に現金\n\n【間違えやすいポイント】\n・税込経理と税抜経理を混同する\n・消費税の仮払・仮受を間違える\n・法人税等の処理時期を間違える\n・租税公課に含まれない税金を理解していない\n\n【覚え方のコツ】\n・法人税等は「当期利益への課税」\n・消費税は「預り・立替」\n・租税公課は「事業活動に関する税金」\n・税抜経理では「仮払・仮受」を使用\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"社会保険料","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","法定福利費","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.180Z",
  },
  {
    id: "Q_J_143",
    category_id: "journal",
    question_text: "固定資産税450円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"租税公課","debit_amount":450,"credit_account":"現金","credit_amount":450}}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 1,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.181Z",
  },
  {
    id: "Q_J_144",
    category_id: "journal",
    question_text: "給与からの源泉所得税80,000円を預り金として計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払給料","debit_amount":500000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":80000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":420000}]}',
    explanation:
      "【基本概念】\n給与支給時の源泉所得税天引き処理。源泉所得税は雇用主が従業員の給与から天引きして代納する制度で、預り金として一時的に負債計上します。\n\n【具体例・イメージ】\n会社が従業員に給与500,000円を支給する際、源泉所得税80,000円を天引きして手取り420,000円を現金で支払う場面をイメージしてください。\n\n【仕訳パターン】\n・未払給料（または給料）で総支給額を計上\n・預り金で源泉税を負債として計上\n・現金で手取り額を資産減少として計上\n・複合仕訳: 借方1つ、貸方2つの形\n\n【間違えやすいポイント】\n・総支給額ではなく手取り額で給料を計上してしまう\n・源泉税を費用として処理してしまう（正しくは預り金）\n・金額の合計が合わない（借方＝貸方の原則）\n・源泉税率の計算ミス\n\n【覚え方のコツ】\n・「源泉税は会社が預かるお金」→預り金（負債）\n・給料総額から源泉税を引いた額が手取り\n・仕訳は「総額主義」で記帳\n・借方合計＝貸方合計を必ず確認\n\n【この問題の解き方】\n給与総額500,000円から源泉税80,000円を差し引いた手取り420,000円の構造を理解して仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_withholding","pattern":"源泉徴収・住民税パターン","accounts":["未払給料","預り金","現金"],"keywords":["源泉所得税","給与","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T07:45:15.000Z",
  },
  {
    id: "Q_J_145",
    category_id: "journal",
    question_text:
      "先月天引きした源泉所得税120,000円を納付期限までに当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"預り金","debit_amount":120000,"credit_account":"当座預金","credit_amount":120000}}',
    explanation:
      "【基本概念】\n源泉所得税の月次納付処理。前月給与支給時に天引きして預り金として計上した源泉所得税を、納付期限までに税務署に納付します。\n\n【具体例・イメージ】\n会社が前月天引きした源泉所得税120,000円を、翘月10日までに税務署に納付する場面をイメージしてください。\n\n【仕訳パターン】\n・預り金（負債）を借方で減少計上\n・当座預金（資産）を貸方で減少計上\n・預り金の清算：借方預り金、貸方現金/当座預金\n・単純仕訳: 借方1つ、貸方1つの形\n\n【間違えやすいポイント】\n・預り金ではなく給料で処理してしまう\n・納付時に新たに預り金を計上してしまう\n・納付期限を間違える（翘月10日まで）\n・遅納加算税を考慮してしまう\n\n【覚え方のコツ】\n・「預り金の清算」→借方預り金\n・納付方法は現金、当座預金、普通預金のいずれか\n・源泉税納付は翘月10日まで（原則）\n・天引き時と納付時で逆仕訳の関係\n\n【この問題の解き方】\n預り金（負債）の清算と当座預金（資産）の減少を理解して仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_withholding","pattern":"源泉徴収・住民税パターン","accounts":["預り金","当座預金"],"keywords":["源泉所得税","納付","預り金清算"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.183Z",
  },
  {
    id: "Q_J_146",
    category_id: "journal",
    question_text:
      "年末調整の結果、4月支給時の源泉所得税が15,000円不足していた。不足額を現金で追加支給した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":15000,"credit_account":"現金","credit_amount":15000}}',
    explanation:
      "【基本概念】\n年末調整による源泉税過不足調整処理。年間の実税額と月別天引き額の差額を調整し、不足時は追加支給、過剰時は精算します。\n\n【具体例・イメージ】\n12月給与支給時に年末調整を行い、従業員Aさんの年間実税額が月別天引額より15,000円不足していた場面をイメージしてください。\n\n【仕訳パターン】\n・不足時: 借方に給料、貸方に現金（追加支給）\n・過剰時: 借方に預り金、貸方に給料（精算）\n・年末調整は12月給与時に一括処理\n・単純仕訳: 借方1つ、貸方1つの形\n\n【間違えやすいポイント】\n・過不足の方向を間違える（不足＝追加支給）\n・年末調整を翘年以降に処理してしまう\n・給与ではなく預り金で処理してしまう\n・源泉税以外の税金と混同してしまう\n\n【覚え方のコツ】\n・「不足」は追加で支給→借方給料\n・「過剰」は精算で回収→借方預り金\n・年末調整は12月給与時に一括処理\n・年間税額＝月別天引総額±調整額\n\n【この問題の解き方】\n年末調整で不足した源泉税15,000円を追加支給する処理を理解して仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_withholding","pattern":"源泉徴収・住民税パターン","accounts":["給料","現金"],"keywords":["年末調整","源泉税不足","追加支給"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.183Z",
  },
  {
    id: "Q_J_147",
    category_id: "journal",
    question_text:
      "夏季賞与800,000円を支給した。なお、源泉所得税80,000円、住民税40,000円を天引きした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"賞与","debit_amount":800000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":120000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":680000}]}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.184Z",
  },
  {
    id: "Q_J_148",
    category_id: "journal",
    question_text:
      "退職金2,000,000円を支給し、退職所得控除後の源泉所得税200,000円を天引きして、差額を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"退職金","debit_amount":2000000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":200000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":1800000}]}',
    explanation:
      "【基本概念】\n退職金支給時の源泉徴収処理。退職所得控除を適用した後の課税退職所得に対して源泉税を計算し、天引きして支給します。\n\n【具体例・イメージ】\n長年勤務した従業員の退職時に支給する退職金の処理です。退職所得控除（勤続年数×40万円等）を適用した後、課税部分に対して源泉税を徴収します。\n\n【仕訳パターン】\n・退職金支給時: 借方に退職金、貸方に預り金（源泉税分）と現金（手取額）\n・源泉税納付時: 借方に預り金、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・退職所得控除の計算を忘れる\n・退職所得の1/2課税を考慮しない\n・源泉徴収税率（20.42%）を間違える\n・総支給額と手取額を混同する\n\n【覚え方のコツ】\n・退職金は「総額で計上、源泉税は預り金」\n・退職所得控除は「勤続年数で決まる」\n・課税退職所得は「控除後の1/2」\n・源泉税は「預り金として負債計上」\n\n【この問題の解き方】\n退職金総額2,000,000円から源泉税200,000円を天引きし、差額1,800,000円を現金支給する複合仕訳です。",
    difficulty: 4,
    tags_json:
      '{"subcategory":"source_tax","pattern":"退職金源泉税","accounts":["退職金","預り金","現金"],"keywords":["退職金","退職所得控除","源泉税","天引き"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.185Z",
  },
  {
    id: "Q_J_149",
    category_id: "journal",
    question_text:
      "税理士への報酬500,000円を支払った。なお、源泉所得税51,050円（10.21%）を天引きして、差額を現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"支払手数料","debit_amount":500000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":51050},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":448950}]}',
    explanation:
      "【基本概念】\n士業等への報酬支払時の源泉徴収処理。税理士、弁護士、司法書士等への報酬は10.21%の源泉徴収税率が適用されます。\n\n【具体例・イメージ】\n税理士に税務申告を依頼した際の報酬支払いです。報酬総額から10.21%の源泉税を天引きして、差額を支払います。\n\n【仕訳パターン】\n・報酬支払時: 借方に支払手数料、貸方に預り金（源泉税分）と現金（差額）\n・源泉税納付時: 借方に預り金、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・源泉徴収税率（10.21%）を間違える\n・総支払額と手取額を混同する\n・勘定科目を間違える（支払手数料 vs 外注費）\n・源泉税の預り金処理を忘れる\n\n【覚え方のコツ】\n・士業報酬は「10.21%源泉徴収」\n・報酬は「総額で計上、源泉税は預り金」\n・勘定科目は「支払手数料」\n・預り金は負債（税務署へ納付義務）\n\n【この問題の解き方】\n報酬総額500,000円から源泉税51,050円を天引きし、差額448,950円を現金支払いする複合仕訳です。",
    difficulty: 4,
    tags_json:
      '{"subcategory":"source_tax","pattern":"報酬源泉税","accounts":["支払手数料","預り金","現金"],"keywords":["報酬","士業","源泉税","10.21%","天引き"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.186Z",
  },
  {
    id: "Q_J_150",
    category_id: "journal",
    question_text:
      "源泉所得税の納期特例を適用し、上半期分（1月～6月）の源泉税240,000円を7月に当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"預り金","debit_amount":240000,"credit_account":"当座預金","credit_amount":240000}}',
    explanation:
      "【基本概念】\n源泉所得税の納期特例制度の処理。従業員が10人未満の小規模事業者は、源泉税の納付を年2回（7月・1月）にまとめることができます。\n\n【具体例・イメージ】\n小規模な会社で毎月の源泉税納付の事務負担を軽減するため、上半期分を7月、下半期分を翌年1月にまとめて納付する制度です。\n\n【仕訳パターン】\n・毎月の源泉徴収時: 借方に給料等、貸方に預り金と現金\n・納期特例納付時: 借方に預り金、貸方に当座預金/現金\n\n【間違えやすいポイント】\n・納付時期（7月・1月）を間違える\n・預り金の累計額を正確に把握していない\n・通常の毎月納付と混同する\n・適用要件（従業員10人未満）を理解していない\n\n【覚え方のコツ】\n・納期特例は「年2回納付」\n・上半期分は「7月10日まで」\n・下半期分は「翌年1月20日まで」\n・預り金の消込処理\n\n【この問題の解き方】\n上半期（1-6月）に天引きして預り金に計上した源泉税240,000円を7月に納付する処理です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"source_tax","pattern":"納期特例","accounts":["預り金","当座預金"],"keywords":["源泉税","納期特例","年2回納付","上半期"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.187Z",
  },
  {
    id: "Q_J_151",
    category_id: "journal",
    question_text:
      "源泉所得税の納付が遅れたため、本税50,000円に加えて延滞税5,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"預り金","debit_amount":50000,"credit_account":"","credit_amount":0},{"debit_account":"租税公課","debit_amount":5000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":55000}]}',
    explanation:
      "【基本概念】\n源泉所得税の納付遅延による延滞税は、法定期限内に納付しなかった場合に発生する附帯税です。本税（預り金）と延滞税（租税公課）を分けて処理します。\n\n【具体例・イメージ】\n給与から天引きした源泉税を期限までに納付し忘れた場面をイメージしてください。従業員から預かったお金（本税）と会社の負担となるペナルティ（延滞税）を分けて支払います。\n\n【仕訳パターン】\n・本税納付: (借方)預り金 (貸方)現金\n・延滞税納付: (借方)租税公課 (貸方)現金\n・複合納付: (借方)預り金+租税公課 (貸方)現金\n\n【間違えやすいポイント】\n・本税と延滞税を同じ勘定で処理してしまう\n・延滞税を預り金で処理してしまう\n・加算税と延滞税の区別がつかない\n・附帯税の会社負担を忘れる\n\n【覚え方のコツ】\n・「本税」は従業員から「預かった」お金\n・「延滞税」は会社の「ペナルティ」\n・預り金消滅＋租税公課発生\n・期限内納付で延滞税回避可能\n\n【この問題の仕訳】\n源泉税本税50,000円（預り金消滅）と延滞税5,000円（租税公課）を合わせて55,000円を現金で納付した複合仕訳です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"源泉徴収・住民税","subpattern":"源泉税の延滞税・加算税処理","accounts":["預り金","租税公課","現金"],"keywords":["源泉税","延滞税","附帯税","租税公課","納付遅延"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.187Z",
  },
  {
    id: "Q_J_152",
    category_id: "journal",
    question_text:
      "従業員への給与支給時に住民税25,000円を天引きし、差引支給額を当座預金から振込で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"給料","debit_amount":300000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":25000},{"debit_account":"","debit_amount":0,"credit_account":"当座預金","credit_amount":275000}]}',
    explanation:
      "【基本概念】\n給与からの住民税天引きは、地方税法に基づく特別徴収制度による処理です。会社が従業員に代わって住民税を徴収し、後日自治体に納付する義務があります。\n\n【具体例・イメージ】\n毎月の給与支給時に、前年の所得に基づいて決定された住民税額を天引きする場面をイメージしてください。会社が「代理徴収」して自治体に納付します。\n\n【仕訳パターン】\n・住民税天引き: (借方)給料 (貸方)預り金+当座預金\n・住民税納付: (借方)預り金 (貸方)現金\n・月次処理: 天引き→預り金計上→翌月納付\n\n【間違えやすいポイント】\n・住民税を費用で処理してしまう\n・天引き時に直接納付したと誤解する\n・源泉所得税と住民税の処理を混同する\n・預り金勘定の使用を忘れる\n\n【覚え方のコツ】\n・「住民税」は従業員の「個人負担」\n・会社は「代理徴収」するだけ\n・天引き時は「預り金」で一時計上\n・翌月10日までに自治体へ納付\n\n【この問題の仕訳】\n給与300,000円から住民税25,000円を天引きし、差引275,000円を振込支給。住民税は預り金として計上します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"源泉徴収・住民税","subpattern":"給与からの住民税天引き・預り金計上","accounts":["給料","預り金","当座預金"],"keywords":["住民税","特別徴収","預り金","天引き","給与支給"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.188Z",
  },
  {
    id: "Q_J_153",
    category_id: "journal",
    question_text:
      "前月給与から天引きした住民税80,000円を翌月10日に自治体へ当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"預り金","debit_amount":80000,"credit_account":"当座預金","credit_amount":80000}}',
    explanation:
      "【基本概念】\n住民税の月次納付は、前月分給与から天引きした住民税を翌月10日までに自治体に納付する処理です。預り金として計上していた負債を消滅させます。\n\n【具体例・イメージ】\n6月分給与で天引きした住民税を、7月10日に市区町村に納付する場面をイメージしてください。一時的に預かっていた税金を本来の納付先に支払います。\n\n【仕訳パターン】\n・住民税納付: (借方)預り金 (貸方)当座預金\n・納付書作成時: 仕訳なし（実際納付時のみ）\n・期限: 翌月10日まで（土日祝日の場合は翌営業日）\n\n【間違えやすいポイント】\n・預り金を費用で処理してしまう\n・天引き時と納付時を同じタイミングと誤解する\n・納付期限を間違える（当月ではなく翌月）\n・自治体別の管理を忘れる\n\n【覚え方のコツ】\n・「預り金」の消滅＝負債の減少\n・天引き時は「預り」、納付時は「支払」\n・月次サイクル：天引き→預り金計上→翌月納付\n・特別徴収義務者としての法的責任\n\n【この問題の仕訳】\n前月天引きした住民税80,000円を自治体に納付したため、預り金80,000円の減少（借方）と当座預金80,000円の減少（貸方）を記録します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"源泉徴収・住民税","subpattern":"住民税の月次納付・預り金消込","accounts":["預り金","当座預金"],"keywords":["住民税","月次納付","預り金","特別徴収","自治体納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.189Z",
  },
  {
    id: "Q_J_154",
    category_id: "journal",
    question_text:
      "6月から新年度住民税額に変更されることにより、従業員A氏の住民税が月額20,000円から30,000円に増額された。差額調整を給与支給時に行った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"給料","debit_amount":400000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":30000},{"debit_account":"","debit_amount":0,"credit_account":"当座預金","credit_amount":370000}]}',
    explanation:
      "【基本概念】\n新年度住民税額の変更は、毎年6月分給与から適用される新しい税額決定による処理です。前年所得に基づく新しい住民税額で天引きを開始します。\n\n【具体例・イメージ】\n5月までは前々年所得ベースの住民税、6月からは前年所得ベースの住民税に切り替わる場面をイメージしてください。通知書が5月に届き、6月から新税額で天引きします。\n\n【仕訳パターン】\n・新税額適用: (借方)給料 (貸方)預り金+当座預金\n・従来の給与処理と同様だが税額が変更\n・年度切替: 6月分給与から新税額適用開始\n\n【間違えやすいポイント】\n・変更タイミングを間違える（6月からが正確）\n・差額調整を複雑に考えすぎる\n・旧税額での処理を継続してしまう\n・通知書の税額を正確に反映しない\n\n【覚え方のコツ】\n・「6月」が住民税の「年度切替月」\n・新税額は「前年所得」がベース\n・処理方法は通常の天引きと同じ\n・自治体からの「税額決定通知書」が根拠\n\n【この問題の仕訳】\n新年度住民税額30,000円を適用し、給与400,000円から天引きして差引370,000円を振込支給。住民税は預り金として計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"源泉徴収・住民税","subpattern":"新年度住民税額の変更処理","accounts":["給料","預り金","当座預金"],"keywords":["住民税","新年度","税額変更","年度切替","6月変更"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.190Z",
  },
  {
    id: "Q_J_155",
    category_id: "journal",
    question_text:
      "従業員B氏が12月末で退職するため、翌年5月までの住民税残額120,000円を退職時給与から一括徴収し、現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"給料","debit_amount":350000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":120000},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":230000}]}',
    explanation:
      "【基本概念】\n退職者の住民税一括徴収は、特別徴収から普通徴収への切替に伴う処理です。翌年5月までの残額を退職時に一括で徴収する場合の仕訳です。\n\n【具体例・イメージ】\n12月退職者の住民税を翌年5月まで会社が代行徴収できなくなるため、本人の同意を得て残額を一括で天引きする場面をイメージしてください。\n\n【仕訳パターン】\n・一括徴収: (借方)給料 (貸方)預り金+現金\n・通常月額の数ヶ月分を一度に徴収\n・本人同意が前提（強制ではない）\n\n【間違えやすいポイント】\n・一括徴収を強制と誤解する\n・退職所得控除との混同\n・普通徴収への切替手続きを忘れる\n・残額計算を間違える\n\n【覚え方のコツ】\n・「一括徴収」は本人の「同意」が前提\n・退職後は「普通徴収」に切替\n・会社の代行義務は「退職まで」\n・自治体への切替届出が必要\n\n【この問題の仕訳】\n退職給与350,000円から住民税残額120,000円を一括徴収し、差引230,000円を現金支給。住民税は預り金として計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"源泉徴収・住民税","subpattern":"退職者住民税の一括徴収・普通徴収切替","accounts":["給料","預り金","現金"],"keywords":["住民税","一括徴収","退職者","普通徴収","特別徴収"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.191Z",
  },
  {
    id: "Q_J_156",
    category_id: "journal",
    question_text:
      "給与支給時に社会保険料（健康保険・厚生年金）の従業員負担分15,000円を天引きし、預り金として計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":15000,"credit_account":"預り金","credit_amount":15000}}',
    explanation:
      "【基本概念】\n社会保険料は健康保険・厚生年金保険・雇用保険・労災保険の総称で、従業員と会社が負担を分担します。従業員負担分は給与から天引きし預り金として処理します。\n\n【具体例・イメージ】\n毎月の給与明細で「健康保険料」「厚生年金保険料」が天引きされているのをイメージしてください。会社が従業員に代わって預かり、後で納付します。\n\n【仕訳パターン】\n・従業員負担分天引き: 借方に給料、貸方に預り金\n・会社負担分計上: 借方に法定福利費、貸方に未払金\n・納付時: 借方に預り金・未払金、貸方に現金・預金\n\n【間違えやすいポイント】\n・従業員負担分と会社負担分を混同する\n・預り金と未払金の使い分けを間違える\n・雇用保険と労災保険の負担割合を間違える\n・賞与からの特別保険料を忘れる\n\n【覚え方のコツ】\n・従業員負担分は「預り金」\n・会社負担分は「法定福利費」\n・納付時は「預り金・未払金の消込」\n・健康保険・厚生年金は「労使折半」\n\n【この問題の解き方】\n従業員負担分の社会保険料天引きなので、給料（借方）と預り金（貸方）で仕訳します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"payroll","pattern":"社会保険料天引き","accounts":["給料","預り金"],"keywords":["社会保険料","従業員負担","天引き","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.192Z",
  },
  {
    id: "Q_J_157",
    category_id: "journal",
    question_text:
      "社会保険料の会社負担分18,000円を法定福利費として計上し、未払金とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":18000,"credit_account":"未払金","credit_amount":18000}}',
    explanation:
      "【基本概念】\n社会保険料の会社負担分は法定福利費として費用計上します。健康保険・厚生年金は労使折半、労災保険は会社負担、雇用保険は一定比率で負担します。\n\n【具体例・イメージ】\n従業員が負担する社会保険料と同額（またはそれ以上）を会社も負担し、従業員の福利厚生として処理します。給与計算時に同時に発生する費用です。\n\n【仕訳パターン】\n・会社負担分計上: 借方に法定福利費、貸方に未払金\n・従業員負担分天引き: 借方に給料、貸方に預り金\n・納付時: 借方に未払金・預り金、貸方に現金・預金\n\n【間違えやすいポイント】\n・法定福利費と福利厚生費を混同する\n・労災保険の全額会社負担を忘れる\n・雇用保険の負担割合を間違える\n・未払金と預り金の区別を間違える\n\n【覚え方のコツ】\n・会社負担分は「法定福利費」\n・従業員負担分は「預り金」\n・労災保険は「会社が全額負担」\n・健康保険・厚生年金は「労使折半」\n\n【この問題の解き方】\n会社負担分の社会保険料計上なので、法定福利費（借方）と未払金（貸方）で仕訳します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"payroll","pattern":"社会保険料会社負担","accounts":["法定福利費","未払金"],"keywords":["社会保険料","会社負担","法定福利費","未払金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.192Z",
  },
  {
    id: "Q_J_158",
    category_id: "journal",
    question_text:
      "社会保険料33,000円（会社負担18,000円、従業員負担15,000円）を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"未払金","debit_amount":18000,"credit_account":"","credit_amount":0},{"debit_account":"預り金","debit_amount":15000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":33000}]}',
    explanation:
      "【基本概念】\n社会保険料の納付時は、事前に計上した会社負担分（未払金）と従業員から預かった分（預り金）を合計して納付します。\n\n【具体例・イメージ】\n月末に給与計算で発生した社会保険料を翌月納付するイメージです。会社負担分と従業員負担分を一括して年金事務所等に納付します。\n\n【仕訳パターン】\n・納付時: 借方に未払金・預り金、貸方に現金・預金\n・会社負担分計上時: 借方に法定福利費、貸方に未払金\n・従業員負担分天引き時: 借方に給料、貸方に預り金\n\n【間違えやすいポイント】\n・未払金と預り金を混同する\n・納付時に法定福利費を使用してしまう\n・会社負担分と従業員負担分の金額を間違える\n・複数月分をまとめて処理する際の計算ミス\n\n【覚え方のコツ】\n・納付時は「未払金・預り金の消込」\n・会社負担分は「未払金」\n・従業員負担分は「預り金」\n・合計額が現金・預金から減少\n\n【この問題の解き方】\n社会保険料納付なので、未払金18,000円と預り金15,000円（借方）、現金33,000円（貸方）の3行仕訳です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"payroll","pattern":"社会保険料納付","accounts":["未払金","預り金","現金"],"keywords":["社会保険料","納付","未払金","預り金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.193Z",
  },
  {
    id: "Q_J_159",
    category_id: "journal",
    question_text:
      "標準報酬月額の改定により、社会保険料が増額改定された。従業員負担分の増額3,000円を追加で預り金に計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"給料","debit_amount":3000,"credit_account":"預り金","credit_amount":3000}}',
    explanation:
      "【基本概念】\n銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。\n\n【具体例・イメージ】\n法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。\n\n【仕訳パターン】\n・入金時: 借方に当座預金、貸方に売掛金等\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越\n\n【間違えやすいポイント】\n・普通預金と当座預金を混同しやすい\n・他人振出小切手は「現金」として扱う\n・当座借越の処理方法（決算時の振替が必要）\n\n【覚え方のコツ】\n・「当座」= その場での決済用\n・小切手 = 当座預金から支払う\n・入金で当座預金増加（借方）\n・残高不足でも小切手振出可能（当座借越契約時）\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"租税公課","accounts":["租税公課","現金"],"keywords":["固定資産税","租税公課","納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.194Z",
  },
  {
    id: "Q_J_160",
    category_id: "journal",
    question_text:
      "賞与支給時に社会保険料（健康保険・厚生年金）の従業員負担分8,000円を天引きした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"賞与","debit_amount":8000,"credit_account":"預り金","credit_amount":8000}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.195Z",
  },
  {
    id: "Q_J_161",
    category_id: "journal",
    question_text:
      "社会保険の資格喪失により、従業員負担分の社会保険料5,000円を返還し、現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"預り金","debit_amount":5000,"credit_account":"現金","credit_amount":5000}}',
    explanation:
      "【基本概念】\n社会保険の資格喪失に伴う保険料返還処理。退職や雇用期間変更により、過払いとなった社会保険料を従業員に返還します。\n\n【具体例・イメージ】\n社員が月途中で退職した場合、月初に天引きした社会保険料のうち、資格喪失後の期間分を返還するケースです。預り金として計上していた社会保険料を現金で返還します。\n\n【仕訳パターン】\n・社会保険料返還時: 借方に預り金、貸方に現金\n・雇用保険料返還時: 借方に預り金、貸方に現金\n・労災保険料関連: 会社負担のため従業員への返還なし\n\n【間違えやすいポイント】\n・会社負担分と従業員負担分を混同する\n・返還すべき保険料の計算を間違える\n・預り金勘定の減少処理を忘れる\n・返還時期の判定を間違える\n\n【覚え方のコツ】\n・資格喪失＝保険料の返還が発生\n・預り金の減少は借方記入\n・社会保険料は「退職月は不要」\n・返還処理は「預り金→現金」のパターン\n\n【この問題の解き方】\n社会保険の資格喪失により過払いとなった従業員負担分の保険料を現金で返還する処理です。預り金の減少として処理します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"social_insurance","pattern":"社会保険料返還","accounts":["預り金","現金"],"keywords":["社会保険","資格喪失","返還"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.196Z",
  },
  {
    id: "Q_J_162",
    category_id: "journal",
    question_text:
      "社会保険料15,000円（会社負担7,500円、従業員負担7,500円）を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"法定福利費","debit_amount":7500,"credit_account":"","credit_amount":0},{"debit_account":"預り金","debit_amount":7500,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":15000}]}',
    explanation:
      "【基本概念】\n社会保険料の納付処理。会社負担分と従業員負担分を合算して納付する際の仕訳です。会社負担分は法定福利費、従業員負担分は預り金として処理します。\n\n【具体例・イメージ】\n毎月の給与から天引きした健康保険料・厚生年金保険料と、会社負担分を合わせて年金事務所等に納付するケースです。労使で折半した保険料を一括納付します。\n\n【仕訳パターン】\n・社会保険料納付時: 借方に法定福利費・預り金、貸方に現金\n・雇用保険料納付時: 借方に法定福利費・預り金、貸方に現金\n・労災保険料納付時: 借方に法定福利費、貸方に現金（全額会社負担）\n\n【間違えやすいポイント】\n・会社負担分と従業員負担分の勘定科目を間違える\n・合計金額の計算を間違える\n・預り金の減少処理を忘れる\n・労災保険料を従業員負担と誤解する\n\n【覚え方のコツ】\n・社会保険料は「労使折半」が基本\n・会社負担分＝法定福利費（費用）\n・従業員負担分＝預り金（負債の減少）\n・納付時は「合算して一括納付」\n\n【この問題の解き方】\n会社負担分7,500円は法定福利費、従業員負担分7,500円は預り金の減少、合計15,000円を現金で納付する処理です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"social_insurance","pattern":"社会保険料納付","accounts":["法定福利費","預り金","現金"],"keywords":["社会保険料","納付","労使折半"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.197Z",
  },
  {
    id: "Q_J_163",
    category_id: "journal",
    question_text:
      "労働保険料8,000円（雇用保険料6,000円、労災保険料2,000円）を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法定福利費","debit_amount":8000,"credit_account":"現金","credit_amount":8000}}',
    explanation:
      "【基本概念】\n労働保険料（雇用保険料・労災保険料）の納付処理。労働保険料は原則として全額会社負担ですが、雇用保険料の一部は従業員も負担します。\n\n【具体例・イメージ】\n年度初めに労働基準監督署やハローワークに納付する労働保険料をイメージしてください。雇用保険は労使で負担割合が決まっており、労災保険は全額会社負担です。\n\n【仕訳パターン】\n・労働保険料一括納付時: 借方に法定福利費、貸方に現金\n・雇用保険料分割納付時: 借方に法定福利費・預り金、貸方に現金\n・労災保険料納付時: 借方に法定福利費、貸方に現金（全額会社負担）\n\n【間違えやすいポイント】\n・雇用保険料の従業員負担分を預り金処理し忘れる\n・労災保険料を従業員負担と誤解する\n・社会保険料と労働保険料を混同する\n・納付先（労働基準監督署・ハローワーク）を間違える\n\n【覚え方のコツ】\n・労災保険料は「全額会社負担」\n・雇用保険料は「労使で負担分担」\n・労働保険料は「まとめて法定福利費」\n・年度更新時は「概算・確定同時処理」\n\n【この問題の解き方】\n労働保険料8,000円を一括して現金で納付する処理です。労働保険料は法定福利費として全額費用計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"social_insurance","pattern":"労働保険料納付","accounts":["法定福利費","現金"],"keywords":["労働保険料","雇用保険","労災保険"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.197Z",
  },
  {
    id: "Q_J_164",
    category_id: "journal",
    question_text:
      "雇用保険料3,000円（会社負担2,000円、従業員負担1,000円）を普通預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"法定福利費","debit_amount":2000,"credit_account":"","credit_amount":0},{"debit_account":"預り金","debit_amount":1000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"普通預金","credit_amount":3000}]}',
    explanation:
      "【基本概念】\n雇用保険料の納付処理。雇用保険料は労使で負担割合が決まっており、会社負担分は法定福利費、従業員負担分は預り金として処理します。\n\n【具体例・イメージ】\nハローワークに毎月納付する雇用保険料をイメージしてください。失業給付等の財源となる保険料で、会社と従業員が決められた割合で負担します。\n\n【仕訳パターン】\n・雇用保険料納付時: 借方に法定福利費・預り金、貸方に普通預金\n・労働保険料一括納付時: 借方に法定福利費、貸方に現金\n・年度更新時: 概算と確定の差額を調整\n\n【間違えやすいポイント】\n・会社負担分と従業員負担分の勘定科目を間違える\n・雇用保険料率の計算を間違える\n・労災保険料と混同する（労災は全額会社負担）\n・従業員負担分の預り金処理を忘れる\n\n【覚え方のコツ】\n・雇用保険料は「労使で分担」\n・会社負担分＝法定福利費（費用）\n・従業員負担分＝預り金（負債の減少）\n・納付先は「ハローワーク」\n\n【この問題の解き方】\n会社負担分2,000円は法定福利費、従業員負担分1,000円は預り金の減少、合計3,000円を普通預金から納付する処理です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"social_insurance","pattern":"雇用保険料納付","accounts":["法定福利費","預り金","普通預金"],"keywords":["雇用保険料","納付","労使負担"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.198Z",
  },
  {
    id: "Q_J_165",
    category_id: "journal",
    question_text: "法人税等50,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":50000,"credit_account":"現金","credit_amount":50000}}',
    explanation:
      "【基本概念】\n法人税等の納付処理。法人税、住民税、事業税を含む法人にかかる税金の納付を処理します。法人税等は費用として計上します。\n\n【具体例・イメージ】\n決算後に税務署や都道府県税事務所に納付する税金をイメージしてください。法人の所得に対して課税される法人税、住民税、事業税などです。\n\n【仕訳パターン】\n・法人税等納付時: 借方に法人税等、貸方に現金/当座預金\n・中間納付時: 借方に法人税等、貸方に現金（年度末に最終調整）\n・延滞税納付時: 借方に租税公課、貸方に現金\n\n【間違えやすいポイント】\n・消費税と法人税等を混同する\n・中間納付と確定納付の処理を間違える\n・延滞税を法人税等勘定で処理してしまう\n・源泉所得税と法人税を混同する\n\n【覚え方のコツ】\n・法人税等は「会社の所得税」\n・納付時は費用計上（借方）\n・延滞税・加算税は「租税公課」\n・中間納付も「法人税等」で処理\n\n【この問題の解き方】\n法人税等50,000円を現金で納付する基本的な処理です。法人税等は費用として借方に計上し、現金は資産の減少として貸方に計上します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"corporate_tax","pattern":"法人税等納付","accounts":["法人税等","現金"],"keywords":["法人税","納付","現金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.199Z",
  },
  {
    id: "Q_J_166",
    category_id: "journal",
    question_text:
      "法人税等の中間申告により、中間納付額30,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":30000,"credit_account":"当座預金","credit_amount":30000}}',
    explanation:
      "【基本概念】\n法人税等の中間申告・中間納付処理。前年度の法人税額をもとに算出した中間納付額を納付します。中間納付も法人税等として費用処理します。\n\n【具体例・イメージ】\n事業年度の中間時点（通常6ヶ月経過時）に、前年度法人税額の半分を目安として中間納付するケースです。確定申告時に最終調整を行います。\n\n【仕訳パターン】\n・中間納付時: 借方に法人税等、貸方に当座預金/現金\n・確定申告時: 借方に法人税等（差額）、貸方に未払金\n・追加納付時: 借方に未払金、貸方に当座預金/現金\n\n【間違えやすいポイント】\n・中間納付を仮払金で処理してしまう\n・確定申告時の調整処理を忘れる\n・消費税の中間納付と混同する\n・還付がある場合の処理を間違える\n\n【覚え方のコツ】\n・中間納付も「法人税等」で費用処理\n・仮払金ではなく直接費用計上\n・確定申告時に「差額調整」\n・還付時は「未収入金」で処理\n\n【この問題の解き方】\n法人税等の中間申告による中間納付額30,000円を当座預金から納付する処理です。法人税等として費用計上し、当座預金の減少を処理します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"corporate_tax","pattern":"法人税等中間納付","accounts":["法人税等","当座預金"],"keywords":["法人税","中間申告","中間納付"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.200Z",
  },
  {
    id: "Q_J_167",
    category_id: "journal",
    question_text:
      "過年度法人税等の修正申告により、追徴税額20,000円と延滞税3,000円を現金で納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":[{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}]}',
    correct_answer_json:
      '{"journalEntry":[{"debit_account":"法人税等","debit_amount":20000,"credit_account":"","credit_amount":0},{"debit_account":"租税公課","debit_amount":3000,"credit_account":"","credit_amount":0},{"debit_account":"","debit_amount":0,"credit_account":"現金","credit_amount":23000}]}',
    explanation:
      "【基本概念】\n過年度法人税等の修正申告処理。申告内容に誤りがあった場合の追徴税額と延滞税の納付を処理します。追徴税額は法人税等、延滞税は租税公課で処理します。\n\n【具体例・イメージ】\n税務署からの指摘や自主的な発見により、過去の申告書に誤りが判明した場合の修正申告をイメージしてください。不足していた税額と延滞税を合わせて納付します。\n\n【仕訳パターン】\n・修正申告追徴時: 借方に法人税等・租税公課、貸方に現金\n・更正決定時: 借方に法人税等・租税公課、貸方に現金\n・重加算税時: 借方に租税公課、貸方に現金\n\n【間違えやすいポイント】\n・延滞税を法人税等で処理してしまう\n・重加算税と延滞税を混同する\n・修正申告と更正決定の処理を混同する\n・過年度損益修正損として処理してしまう\n\n【覚え方のコツ】\n・追徴税額は「法人税等」（本税）\n・延滞税・重加算税は「租税公課」（附帯税）\n・修正申告は「自主的な訂正」\n・更正決定は「税務署による決定」\n\n【この問題の解き方】\n追徴税額20,000円は法人税等、延滞税3,000円は租税公課として処理し、合計23,000円を現金で納付する複合仕訳です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"corporate_tax","pattern":"法人税等修正申告","accounts":["法人税等","租税公課","現金"],"keywords":["修正申告","追徴税額","延滞税"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.201Z",
  },
  {
    id: "Q_J_168",
    category_id: "journal",
    question_text: "法人税等100円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":100,"credit_account":"当座預金","credit_amount":100}}',
    explanation:
      "【基本概念】\n法人税等の納付に関する処理。法人税等は企業の所得に対する税金で、法人税・地方法人税・地方法人住民税・地方法人事業税を含む負債勘定です。\n\n【具体例・イメージ】\n企業が1年間の利益に対する税金を計算し、税務署等に納付することをイメージしてください。決算で未払法人税等として計上した後、実際に納付する際の処理です。\n\n【仕訳パターン】\n・法人税等納付時: 借方に法人税等、貸方に現金/当座預金\n・中間申告時: 借方に法人税等、貸方に現金/当座預金\n・修正申告時: 借方に法人税等（追徴分）・租税公課（延滞税等）、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・法人税等を費用と間違える（負債勘定です）\n・延滞税等の附帯税は租税公課（費用）で処理\n・個人の所得税と混同しないよう注意\n・中間申告と確定申告の違いを理解する\n\n【覚え方のコツ】\n・法人税等は「負債の減少」\n・延滞税・加算税は「租税公課（費用）」\n・納付は「負債の現金払い」\n・附帯税は「別途費用計上」\n\n【この問題の解き方】\n法人税等（負債）を当座預金（資産）で納付したので、負債の減少（借方）と資産の減少（貸方）で仕訳します。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"salary_tax","pattern":"法人税等","accounts":["法人税等","当座預金"],"keywords":["法人税","納付","当座預金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.201Z",
  },
  {
    id: "Q_J_169",
    category_id: "journal",
    question_text:
      "法人税等の中間申告により、中間納付額40,000円を当座預金から納付した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":40000,"credit_account":"当座預金","credit_amount":40000}}',
    explanation:
      "【基本概念】\n法人税等の中間申告に関する処理。中間申告は前期の法人税額に基づいて半期分を前払いする制度で、確定申告時に精算されます。\n\n【具体例・イメージ】\n前期の法人税が年間100万円だった場合、今期の中間申告では50万円を納付することをイメージしてください。これは前払いなので、確定申告時に調整されます。\n\n【仕訳パターン】\n・中間申告納付時: 借方に法人税等、貸方に現金/当座預金\n・確定申告時: 不足額があれば追加納付、超過額があれば還付\n・修正申告時: 借方に法人税等（追徴分）・租税公課（延滞税等）、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・中間申告を費用として処理してしまう\n・確定申告時の精算処理を忘れる\n・延滞税等の附帯税の処理方法を間違える\n・所得税の中間納付と混同する\n\n【覚え方のコツ】\n・中間申告は「前払い」の概念\n・法人税等は「負債勘定」\n・確定申告で「精算」される\n・延滞税は「租税公課」で費用処理\n\n【この問題の解き方】\n法人税等の中間納付は負債勘定の法人税等を減少（借方）させ、当座預金という資産を減少（貸方）させる処理です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"corporate_tax","pattern":"法人税等中間申告","accounts":["法人税等","当座預金"],"keywords":["中間申告","中間納付","法人税等"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.202Z",
  },
  {
    id: "Q_J_170",
    category_id: "journal",
    question_text: "決算時に法人税等25,000円を計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"法人税等","debit_amount":25000,"credit_account":"未払法人税等","credit_amount":25000}}',
    explanation:
      "【基本概念】\n決算時の法人税等計上に関する処理。当期の所得に対する法人税・地方法人税・住民税・事業税を見積もって計上します。\n\n【具体例・イメージ】\n決算で当期の利益が確定したら、その利益に対する税金を計算して未払いとして計上することをイメージしてください。実際の納付は翌期に行います。\n\n【仕訳パターン】\n・決算時計上: 借方に法人税等、貸方に未払法人税等\n・翌期納付時: 借方に未払法人税等、貸方に現金/当座預金\n・中間申告時: 借方に法人税等、貸方に現金/当座預金\n・修正申告時: 借方に法人税等・租税公課、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・法人税等を費用勘定と間違える（負債勘定です）\n・未払法人税等の計上を忘れる\n・延滞税等の附帯税の処理を間違える\n・消費税等との区別ができない\n\n【覚え方のコツ】\n・決算時は「未払いで計上」\n・法人税等は「負債勘定」\n・納付時は「未払いを消去」\n・延滞税は「租税公課（費用）」\n\n【この問題の解き方】\n決算時の法人税等計上は、法人税等（負債）を増加（借方）させ、未払法人税等（負債）を増加（貸方）させる処理です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"corporate_tax","pattern":"法人税等決算計上","accounts":["法人税等","未払法人税等"],"keywords":["決算","法人税等","未払法人税等"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.203Z",
  },
  {
    id: "Q_J_171",
    category_id: "journal",
    question_text: "備品500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の取得に関する処理。備品は事業用に長期間使用する有形固定資産で、購入時は取得原価で資産として計上します。\n\n【具体例・イメージ】\n会社で使う机、椅子、棚、コピー機、パソコンなどの備品を購入することをイメージしてください。これらは長期間使用するため、購入時に全額費用にせず資産として計上します。\n\n【仕訳パターン】\n・備品購入時: 借方に備品、貸方に現金/当座預金/未払金\n・建物購入時: 借方に建物、貸方に現金/当座預金/借入金\n・車両購入時: 借方に車両運搬具、貸方に現金/当座預金\n・土地購入時: 借方に土地、貸方に現金/当座預金\n\n【間違えやすいポイント】\n・消耗品と備品を間違える（10万円未満は消耗品費）\n・付随費用（設置費、運搬費等）を含め忘れる\n・減価償却対象かどうかを間違える（土地は対象外）\n・取得時に減価償却費を計上してしまう\n\n【覚え方のコツ】\n・固定資産は「長期間使用する資産」\n・取得時は「全額資産計上」\n・付随費用も「取得原価に含める」\n・土地は「減価償却しない」\n\n【この問題の解き方】\n備品（固定資産）を現金で購入したので、資産の増加（借方）と資産の減少（貸方）で仕訳します。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.204Z",
  },
  {
    id: "Q_J_172",
    category_id: "journal",
    question_text: "建物800,000円を購入し、代金は買掛金とした。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"建物","debit_amount":800000,"credit_account":"買掛金","credit_amount":800000}}',
    explanation:
      "【基本概念】\n固定資産の掛け購入に関する処理。建物は事業用の有形固定資産で、掛けで購入した場合は未払金（買掛金）として負債に計上します。\n\n【具体例・イメージ】\n事務所や店舗として使用する建物を不動産会社から購入し、代金は後日支払う約束をすることをイメージしてください。建物という資産を取得し、支払い義務という負債が発生します。\n\n【仕訳パターン】\n・建物掛け購入時: 借方に建物、貸方に買掛金/未払金\n・建物現金購入時: 借方に建物、貸方に現金/当座預金\n・建物借入購入時: 借方に建物、貸方に借入金\n・土地掛け購入時: 借方に土地、貸方に買掛金/未払金\n\n【間違えやすいポイント】\n・買掛金と未払金を混同する（どちらでも正解）\n・付随費用（登記料、仲介手数料等）を含め忘れる\n・建物と土地を一緒に購入した場合の按分を忘れる\n・取得時に減価償却費を計上してしまう\n\n【覚え方のコツ】\n・掛け購入は「資産増加・負債増加」\n・建物は「減価償却対象」\n・土地は「減価償却対象外」\n・付随費用も「取得原価に含める」\n\n【この問題の解き方】\n建物（固定資産）を掛けで購入したので、資産の増加（借方）と負債の増加（貸方）で仕訳します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産掛け購入","accounts":["建物","買掛金"],"keywords":["建物","掛け購入","買掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.205Z",
  },
  {
    id: "Q_J_173",
    category_id: "journal",
    question_text:
      "車両運搬具300,000円を購入し、登録費用20,000円とともに現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"車両運搬具","debit_amount":320000,"credit_account":"現金","credit_amount":320000}}',
    explanation:
      "【基本概念】\n固定資産取得時の付随費用の処理。固定資産の取得原価は本体価格だけでなく、取得に要した付随費用も含めて計上します。\n\n【具体例・イメージ】\n営業車を購入する際の車両本体価格に加えて、登録手数料、納車費用、任意保険等の費用がかかることをイメージしてください。これらの費用は全て車両の取得原価に含めます。\n\n【仕訳パターン】\n・車両＋付随費用: 借方に車両運搬具（本体＋付随費用）、貸方に現金等\n・建物＋付随費用: 借方に建物（本体＋登記料＋仲介手数料等）、貸方に現金等\n・機械＋付随費用: 借方に機械装置（本体＋据付費＋試運転費等）、貸方に現金等\n・土地＋付随費用: 借方に土地（本体＋仲介手数料＋登記料等）、貸方に現金等\n\n【間違えやすいポイント】\n・付随費用を支払手数料等の費用で処理してしまう\n・取得原価に含めるべき費用と含めない費用を間違える\n・修繕費と改良費を混同する\n・税金（不動産取得税等）の処理を間違える\n\n【覚え方のコツ】\n・取得に必要な費用は「全て取得原価」\n・将来の経済効果があるものは「資産計上」\n・単なる維持費用は「費用処理」\n・付随費用は「本体価格に加算」\n\n【この問題の解き方】\n車両本体価格300,000円と登録費用20,000円の合計320,000円を車両運搬具として資産計上し、現金の減少として処理します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産付随費用","accounts":["車両運搬具","現金"],"keywords":["車両","付随費用","登録費用"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.206Z",
  },
  {
    id: "Q_J_174",
    category_id: "journal",
    question_text:
      "土地1,200,000円を購入し、仲介手数料60,000円とともに当座預金から支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"土地","debit_amount":1260000,"credit_account":"当座預金","credit_amount":1260000}}',
    explanation:
      "【基本概念】\n土地の取得と付随費用の処理。土地は事業用の固定資産で、取得原価は本体価格に仲介手数料等の付随費用を加えて計上します。土地は減価償却の対象外です。\n\n【具体例・イメージ】\n事務所や店舗用の土地を不動産会社を通じて購入することをイメージしてください。土地代金に加えて仲介手数料、登記費用、測量費等がかかり、これら全てが土地の取得原価になります。\n\n【仕訳パターン】\n・土地＋付随費用: 借方に土地（本体＋仲介手数料＋登記料等）、貸方に現金等\n・建物＋土地一括購入: 借方に建物・土地（按分計算）、貸方に現金等\n・土地改良費: 借方に土地（恒久的改良）または修繕費（一時的修繕）\n・土地借入購入: 借方に土地、貸方に借入金\n\n【間違えやすいポイント】\n・土地に減価償却を適用してしまう（土地は対象外）\n・付随費用を支払手数料等で処理してしまう\n・建物と土地の一括購入時の按分を忘れる\n・土地改良費と修繕費を混同する\n\n【覚え方のコツ】\n・土地は「減価償却しない」\n・付随費用は「取得原価に含める」\n・恒久的効果は「資産計上」\n・一時的費用は「費用処理」\n\n【この問題の解き方】\n土地本体価格1,200,000円と仲介手数料60,000円の合計1,260,000円を土地として資産計上し、当座預金の減少として処理します。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"土地取得付随費用","accounts":["土地","当座預金"],"keywords":["土地","仲介手数料","付随費用"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.207Z",
  },
  {
    id: "Q_J_175",
    category_id: "journal",
    question_text: "備品2500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":2500,"credit_account":"現金","credit_amount":2500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:30:10.207Z",
  },
  {
    id: "Q_J_176",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費400円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":400,"credit_account":"建物減価償却累計額","credit_amount":400}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.209Z",
  },
  {
    id: "Q_J_177",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を450円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":450,"credit_account":"車両","credit_amount":450}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.211Z",
  },
  {
    id: "Q_J_178",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価10円、減価償却累計額500円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":90,"credit_account":"固定資産除却損","credit_amount":90}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.211Z",
  },
  {
    id: "Q_J_179",
    category_id: "journal",
    question_text: "備品500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.212Z",
  },
  {
    id: "Q_J_180",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費100円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":100,"credit_account":"建物減価償却累計額","credit_amount":100}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.213Z",
  },
  {
    id: "Q_J_181",
    category_id: "journal",
    question_text:
      "帳簿価額300円の車両を500円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":500,"credit_account":"車両","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.214Z",
  },
  {
    id: "Q_J_182",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価10円、減価償却累計額500円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":30,"credit_account":"固定資産除却損","credit_amount":30}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.215Z",
  },
  {
    id: "Q_J_183",
    category_id: "journal",
    question_text: "備品450円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":450,"credit_account":"現金","credit_amount":450}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.216Z",
  },
  {
    id: "Q_J_184",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":500,"credit_account":"建物減価償却累計額","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.217Z",
  },
  {
    id: "Q_J_185",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を10円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":100,"credit_account":"車両","credit_amount":100}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.218Z",
  },
  {
    id: "Q_J_186",
    category_id: "journal",
    question_text:
      "決算時に、車両運搬具（取得原価2,400,000円、耐用年数8年、残存価額ゼロ）の減価償却費を定額法で計上した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":300000,"credit_account":"車両運搬具減価償却累計額","credit_amount":300000}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.219Z",
  },
  {
    id: "Q_J_187",
    category_id: "journal",
    question_text: "備品500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.220Z",
  },
  {
    id: "Q_J_188",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":500,"credit_account":"建物減価償却累計額","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.221Z",
  },
  {
    id: "Q_J_189",
    category_id: "journal",
    question_text:
      "帳簿価額100円の車両を400円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":500,"credit_account":"車両","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.222Z",
  },
  {
    id: "Q_J_190",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価300円、減価償却累計額450円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":300,"credit_account":"固定資産除却損","credit_amount":300}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.222Z",
  },
  {
    id: "Q_J_191",
    category_id: "journal",
    question_text: "備品500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.223Z",
  },
  {
    id: "Q_J_192",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費3500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":3500,"credit_account":"建物減価償却累計額","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.224Z",
  },
  {
    id: "Q_J_193",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を350円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":350,"credit_account":"車両","credit_amount":350}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.225Z",
  },
  {
    id: "Q_J_194",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価500円、減価償却累計額500円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":500,"credit_account":"固定資産除却損","credit_amount":500}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.226Z",
  },
  {
    id: "Q_J_195",
    category_id: "journal",
    question_text: "備品300円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":300,"credit_account":"現金","credit_amount":300}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.227Z",
  },
  {
    id: "Q_J_196",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":500,"credit_account":"建物減価償却累計額","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.228Z",
  },
  {
    id: "Q_J_197",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を500円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":500,"credit_account":"車両","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.228Z",
  },
  {
    id: "Q_J_198",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価710円、減価償却累計額4000円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":7000,"credit_account":"固定資産除却損","credit_amount":7000}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.229Z",
  },
  {
    id: "Q_J_199",
    category_id: "journal",
    question_text: "備品500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":500,"credit_account":"現金","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.230Z",
  },
  {
    id: "Q_J_200",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費3500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":3500,"credit_account":"建物減価償却累計額","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.231Z",
  },
  {
    id: "Q_J_201",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を500円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":500,"credit_account":"車両","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.232Z",
  },
  {
    id: "Q_J_202",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価450円、減価償却累計額10円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":450,"credit_account":"固定資産除却損","credit_amount":450}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.232Z",
  },
  {
    id: "Q_J_203",
    category_id: "journal",
    question_text: "備品2500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":2500,"credit_account":"現金","credit_amount":2500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.233Z",
  },
  {
    id: "Q_J_204",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費3500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":3500,"credit_account":"建物減価償却累計額","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.234Z",
  },
  {
    id: "Q_J_205",
    category_id: "journal",
    question_text:
      "帳簿価額500円の車両を300円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":300,"credit_account":"車両","credit_amount":300}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.235Z",
  },
  {
    id: "Q_J_206",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価500円、減価償却累計額200円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":500,"credit_account":"固定資産除却損","credit_amount":500}}',
    explanation:
      "【基本概念】\n1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。\n\n【具体例・イメージ】\n会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。\n\n【仕訳パターン】\n・購入時: 借方に各固定資産、貸方に現金等\n・除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産\n・売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益\n\n【間違えやすいポイント】\n・取得原価に付随費用を含め忘れる\n・土地の減価償却をしてしまう\n・除却と売却の処理を混同する\n・期中売却時の減価償却計算を忘れる\n\n【覚え方のコツ】\n・取得原価は「本体価格＋付随費用」\n・土地は「価値が減らない」\n・除却は「廃棄」、売却は「換金」\n・期中売却は「売却日まで償却」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.236Z",
  },
  {
    id: "Q_J_207",
    category_id: "journal",
    question_text: "備品4500円を購入し、代金は現金で支払った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品","debit_amount":4500,"credit_account":"現金","credit_amount":4500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産購入","accounts":["備品","現金"],"keywords":["備品","固定資産","購入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.237Z",
  },
  {
    id: "Q_J_208",
    category_id: "journal",
    question_text: "決算において、建物の減価償却費500円を計上する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"減価償却費","debit_amount":500,"credit_account":"建物減価償却累計額","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"減価償却","accounts":["減価償却費","建物減価償却累計額"],"keywords":["減価償却","決算","建物"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.237Z",
  },
  {
    id: "Q_J_209",
    category_id: "journal",
    question_text:
      "帳簿価額150円の車両を500円で売却し、代金は現金で受け取った。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"現金","debit_amount":500,"credit_account":"車両","credit_amount":500}}',
    explanation:
      "【基本概念】\n固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。\n\n【具体例・イメージ】\n車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。\n\n【仕訳パターン】\n・減価償却時: 借方に減価償却費、貸方に減価償却累計額\n・計算式: (取得原価-残存価額)÷耐用年数\n・月割計算: 年間償却額×利用月数÷12\n\n【間違えやすいポイント】\n・直接法と間接法を混同する\n・残存価額を忘れて計算する\n・期中取得の月割計算を間違える\n・土地は減価償却しないことを忘れる\n\n【覚え方のコツ】\n・間接法は「累計額」を使用\n・定額法は「毎年同じ金額」\n・土地は「価値が減らない」\n・期中取得は「月割り計算」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産売却","accounts":["現金","車両","固定資産売却益"],"keywords":["固定資産売却","車両","売却益"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.238Z",
  },
  {
    id: "Q_J_210",
    category_id: "journal",
    question_text:
      "使用不能となった備品（取得原価250円、減価償却累計額400円）を除却した。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"備品減価償却累計額","debit_amount":250,"credit_account":"固定資産除却損","credit_amount":250}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"fixed_asset","pattern":"固定資産除却","accounts":["備品減価償却累計額","固定資産除却損","備品"],"keywords":["除却","備品","除却損"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.239Z",
  },
  {
    id: "Q_J_211",
    category_id: "journal",
    question_text:
      "決算において、売掛金500円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":500,"credit_account":"貸倒引当金","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.368Z",
    updated_at: "2025-08-19T06:38:39.240Z",
  },
  {
    id: "Q_J_212",
    category_id: "journal",
    question_text:
      "期首商品棚卸高400円、当期商品仕入高300円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":400,"credit_account":"繰越商品","credit_amount":400}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.241Z",
  },
  {
    id: "Q_J_213",
    category_id: "journal",
    question_text: "支払保険料500円のうち、300円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":300,"credit_account":"保険料","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.243Z",
  },
  {
    id: "Q_J_214",
    category_id: "journal",
    question_text: "当期の支払利息150円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":150,"credit_account":"未払費用","credit_amount":150}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.244Z",
  },
  {
    id: "Q_J_215",
    category_id: "journal",
    question_text:
      "決算において、売掛金3500円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":3500,"credit_account":"貸倒引当金","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.244Z",
  },
  {
    id: "Q_J_216",
    category_id: "journal",
    question_text:
      "期首商品棚卸高500円、当期商品仕入高500円、期末商品棚卸高100円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":500,"credit_account":"繰越商品","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.245Z",
  },
  {
    id: "Q_J_217",
    category_id: "journal",
    question_text: "支払保険料400円のうち、10円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":90,"credit_account":"保険料","credit_amount":90}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.246Z",
  },
  {
    id: "Q_J_218",
    category_id: "journal",
    question_text: "当期の支払利息450円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":450,"credit_account":"未払費用","credit_amount":450}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.247Z",
  },
  {
    id: "Q_J_219",
    category_id: "journal",
    question_text:
      "決算において、売掛金500円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":500,"credit_account":"貸倒引当金","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.248Z",
  },
  {
    id: "Q_J_220",
    category_id: "journal",
    question_text:
      "期首商品棚卸高200円、当期商品仕入高500円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":200,"credit_account":"繰越商品","credit_amount":200}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.249Z",
  },
  {
    id: "Q_J_221",
    category_id: "journal",
    question_text: "支払保険料500円のうち、300円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":300,"credit_account":"保険料","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.249Z",
  },
  {
    id: "Q_J_222",
    category_id: "journal",
    question_text: "当期の支払利息500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":500,"credit_account":"未払費用","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.250Z",
  },
  {
    id: "Q_J_223",
    category_id: "journal",
    question_text:
      "決算において、売掛金250円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":250,"credit_account":"貸倒引当金","credit_amount":250}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.251Z",
  },
  {
    id: "Q_J_224",
    category_id: "journal",
    question_text:
      "期首商品棚卸高10円、当期商品仕入高250円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":500,"credit_account":"繰越商品","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 1,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.252Z",
  },
  {
    id: "Q_J_225",
    category_id: "journal",
    question_text: "支払保険料500円のうち、200円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":200,"credit_account":"保険料","credit_amount":200}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.253Z",
  },
  {
    id: "Q_J_226",
    category_id: "journal",
    question_text: "当期の支払利息500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":500,"credit_account":"未払費用","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.254Z",
  },
  {
    id: "Q_J_227",
    category_id: "journal",
    question_text:
      "決算において、売掛金3500円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":3500,"credit_account":"貸倒引当金","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.254Z",
  },
  {
    id: "Q_J_228",
    category_id: "journal",
    question_text:
      "期首商品棚卸高50円、当期商品仕入高10円、期末商品棚卸高500円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":500,"credit_account":"繰越商品","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.255Z",
  },
  {
    id: "Q_J_229",
    category_id: "journal",
    question_text: "支払保険料500円のうち、300円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":300,"credit_account":"保険料","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.256Z",
  },
  {
    id: "Q_J_230",
    category_id: "journal",
    question_text: "当期の支払利息4500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":4500,"credit_account":"未払費用","credit_amount":4500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.257Z",
  },
  {
    id: "Q_J_231",
    category_id: "journal",
    question_text:
      "決算において、売掛金500円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":500,"credit_account":"貸倒引当金","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.257Z",
  },
  {
    id: "Q_J_232",
    category_id: "journal",
    question_text:
      "期首商品棚卸高450円、当期商品仕入高150円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":450,"credit_account":"繰越商品","credit_amount":450}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.258Z",
  },
  {
    id: "Q_J_233",
    category_id: "journal",
    question_text: "支払保険料150円のうち、500円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":150,"credit_account":"保険料","credit_amount":150}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.259Z",
  },
  {
    id: "Q_J_234",
    category_id: "journal",
    question_text: "当期の支払利息250円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":250,"credit_account":"未払費用","credit_amount":250}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.260Z",
  },
  {
    id: "Q_J_235",
    category_id: "journal",
    question_text:
      "決算において、売掛金200円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":200,"credit_account":"貸倒引当金","credit_amount":200}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.261Z",
  },
  {
    id: "Q_J_236",
    category_id: "journal",
    question_text:
      "期首商品棚卸高250円、当期商品仕入高200円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":250,"credit_account":"繰越商品","credit_amount":250}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.262Z",
  },
  {
    id: "Q_J_237",
    category_id: "journal",
    question_text: "支払保険料200円のうち、450円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":200,"credit_account":"保険料","credit_amount":200}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.262Z",
  },
  {
    id: "Q_J_238",
    category_id: "journal",
    question_text: "当期の支払利息3500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":3500,"credit_account":"未払費用","credit_amount":3500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.263Z",
  },
  {
    id: "Q_J_239",
    category_id: "journal",
    question_text:
      "決算において、売掛金100円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":100,"credit_account":"貸倒引当金","credit_amount":100}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.264Z",
  },
  {
    id: "Q_J_240",
    category_id: "journal",
    question_text:
      "期首商品棚卸高150円、当期商品仕入高500円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":150,"credit_account":"繰越商品","credit_amount":150}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.265Z",
  },
  {
    id: "Q_J_241",
    category_id: "journal",
    question_text: "支払保険料500円のうち、150円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":500,"credit_account":"保険料","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.266Z",
  },
  {
    id: "Q_J_242",
    category_id: "journal",
    question_text: "当期の支払利息500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":500,"credit_account":"未払費用","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.266Z",
  },
  {
    id: "Q_J_243",
    category_id: "journal",
    question_text: "決算において、売掛金10円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":500,"credit_account":"貸倒引当金","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.268Z",
  },
  {
    id: "Q_J_244",
    category_id: "journal",
    question_text:
      "期首商品棚卸高250円、当期商品仕入高350円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":250,"credit_account":"繰越商品","credit_amount":250}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.268Z",
  },
  {
    id: "Q_J_245",
    category_id: "journal",
    question_text: "支払保険料500円のうち、500円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":500,"credit_account":"保険料","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.269Z",
  },
  {
    id: "Q_J_246",
    category_id: "journal",
    question_text: "当期の支払利息500円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":500,"credit_account":"未払費用","credit_amount":500}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.270Z",
  },
  {
    id: "Q_J_247",
    category_id: "journal",
    question_text:
      "決算において、売掛金3000円に対して2%の貸倒引当金を設定する。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"貸倒引当金繰入","debit_amount":3000,"credit_account":"貸倒引当金","credit_amount":3000}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"貸倒引当金設定","accounts":["貸倒引当金繰入","貸倒引当金"],"keywords":["貸倒引当金","決算","売掛金"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.271Z",
  },
  {
    id: "Q_J_248",
    category_id: "journal",
    question_text:
      "期首商品棚卸高300円、当期商品仕入高500円、期末商品棚卸高10円である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"仕入","debit_amount":300,"credit_account":"繰越商品","credit_amount":300}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"売上原価算定","accounts":["仕入","繰越商品"],"keywords":["売上原価","棚卸","仕入"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.272Z",
  },
  {
    id: "Q_J_249",
    category_id: "journal",
    question_text: "支払保険料150円のうち、500円は次期分である。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"前払費用","debit_amount":150,"credit_account":"保険料","credit_amount":150}}',
    explanation:
      "【基本概念】\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。\n\n【具体例・イメージ】\nスーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。\n\n【仕訳パターン】\n・仕入時: 借方に仕入、貸方に現金/買掛金\n・売上時: 借方に現金/売掛金、貸方に売上\n・返品時: 逆仕訳で処理\n・値引時: 売上値引/仕入値引勘定で処理\n\n【間違えやすいポイント】\n・分記法と三分法を混同しやすい\n・期末商品の振替処理を忘れがち\n・返品と値引の処理方法を間違える\n・売上原価の計算方法を理解していない\n\n【覚え方のコツ】\n・三分法は「仕入・売上・繰越商品」の3つで管理\n・仕入は費用（左側）、売上は収益（右側）\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\n・返品は「逆仕訳」、値引は「専用勘定」\n\n【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"前払費用","accounts":["前払費用","保険料"],"keywords":["前払費用","保険料","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.273Z",
  },
  {
    id: "Q_J_250",
    category_id: "journal",
    question_text: "当期の支払利息2250円が未払いである。",
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json:
      '{"journalEntry":{"debit_account":"支払利息","debit_amount":2250,"credit_account":"未払費用","credit_amount":2250}}',
    explanation:
      "【基本概念】\n商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。\n\n【具体例・イメージ】\nツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。\n\n【仕訳パターン】\n・掛売上時: 借方に売掛金、貸方に売上\n・代金回収時: 借方に現金、貸方に売掛金\n\n【間違えやすいポイント】\n・売掛金（資産）と買掛金（負債）を混同しやすい\n・回収時に売掛金を借方に書いてしまうミス\n・未収入金との区別（本業以外の収入は未収入金）\n\n【覚え方のコツ】\n・「売」掛金 = 「売った」ツケ = もらう権利（資産）\n・「権利」は資産、「義務」は負債\n・回収すると売掛金は減る（貸方）\n・売る側に発生するのが「売掛金」\n\n【この問題の仕訳】\n【この問題の仕訳】\n（仕訳データの解析に失敗しました）",
    difficulty: 3,
    tags_json:
      '{"subcategory":"adjustment","pattern":"未払費用","accounts":["支払利息","未払費用"],"keywords":["未払費用","支払利息","決算整理"],"examSection":1}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-19T06:38:39.274Z",
  },
];

// カテゴリ別に分割したエクスポート
export const journalQuestions = masterQuestions.filter(
  (q) => q.category_id === "journal",
);
export const ledgerQuestions = masterQuestions.filter(
  (q) => q.category_id === "ledger",
);
export const trialBalanceQuestions = masterQuestions.filter(
  (q) => q.category_id === "trial_balance",
);

// 統計情報を実際のデータから計算
export const questionStatistics = {
  totalQuestions: masterQuestions.length,
  byCategory: {
    journal: journalQuestions.length,
    ledger: ledgerQuestions.length,
    trial_balance: trialBalanceQuestions.length,
  },
  byDifficulty: masterQuestions.reduce(
    (acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
};

// 統合された問題配列のエクスポート（既存のimportとの互換性）
export const allQuestions = masterQuestions;
