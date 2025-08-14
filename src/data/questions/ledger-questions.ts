/**
 * Ledger Questions (帳簿問題)
 * 簿記3級問題集アプリ - 帳簿問題データ
 * Generated from master-questions.ts
 */

import { Question } from "../../types/models";

export const ledgerQuestions: Question[] = [
  {
    id: "Q_L_001",
    category_id: "ledger",
    question_text:
      "【現金勘定記入問題】\n\n2025年10月の現金勘定への記入を行い、残高を計算してください。\n\n【前月繰越残高】\n現金：337,541円\n\n【10月の取引】\n10月5日 現金売上：276,641円（増加）\n10月10日 給料支払：215,025円（減少）\n10月15日 売掛金回収：184,924円（増加）\n10月20日 買掛金支払：241,381円（減少）\n10月28日 現金実査による過不足判明：8,502円（不足）\n\n【現金過不足の処理】\n月末に現金実査を行い、過不足を確認して適切に処理してください。\n\n【作成指示】\n1. 現金勘定へ各取引を記入\n2. 借方・貸方の合計を計算\n3. 月末残高を算出\n4. 現金過不足がある場合は適切に処理",
    answer_template_json:
      '{"type":"ledger_account","account_name":"現金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"10/1","description":"前月繰越","ref":"","debit":337541,"credit":0,"balance":337541},{"date":"10/5","description":"売上","ref":"","debit":276641,"credit":0,"balance":614182},{"date":"10/10","description":"給料","ref":"","debit":0,"credit":215025,"balance":399157},{"date":"10/15","description":"売掛金","ref":"","debit":184924,"credit":0,"balance":584081},{"date":"10/20","description":"買掛金","ref":"","debit":0,"credit":241381,"balance":342700},{"date":"10/28","description":"現金過不足","ref":"","debit":0,"credit":8502,"balance":334198}]}',
    explanation:
      "【現金勘定記入のポイント】\n1. 現金の増加（売上・回収）は借方に記入\n2. 現金の減少（支払）は貸方に記入\n3. 各取引後の残高を都度計算\n4. 現金過不足は実査時点で計上\n\n【計算過程】\n前月繰越 337,541円\n＋現金売上 276,641円\n－給料支払 215,025円\n＋売掛金回収 184,924円\n－買掛金支払 241,381円\n－現金過不足 8,502円\n＝月末残高 334,198円",
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
      '{"type":"ledger_account","account_name":"売掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"1/1","description":"前月繰越","ref":"","debit":564069,"credit":0,"balance":564069},{"date":"1/3","description":"売上","ref":"","debit":190909,"credit":0,"balance":754978},{"date":"1/8","description":"現金","ref":"","debit":0,"credit":51829,"balance":703149},{"date":"1/15","description":"売上","ref":"","debit":179338,"credit":0,"balance":882487},{"date":"1/22","description":"受取手形","ref":"","debit":0,"credit":111922,"balance":770565},{"date":"1/28","description":"貸倒引当金/貸倒損失","ref":"","debit":0,"credit":35813,"balance":734752}]}',
    explanation:
      "【売掛金勘定記入のポイント】\n1. 売掛金の発生（掛売上）は借方に記入\n2. 売掛金の回収（現金・手形）は貸方に記入\n3. 貸倒れ発生時は貸倒引当金を優先充当\n4. 引当金不足分は貸倒損失として処理\n\n【貸倒処理】\n貸倒れ額 35,813円\n－貸倒引当金充当 30,000円\n＝貸倒損失 5,813円",
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
      '{"type":"ledger_account","account_name":"商品","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"10/1","description":"繰越商品","ref":"","debit":914556,"credit":0,"balance":914556},{"date":"10/31","description":"仕入","ref":"","debit":1404670,"credit":0,"balance":2319226},{"date":"10/31","description":"繰越商品","ref":"","debit":0,"credit":558925,"balance":1760301}]}',
    explanation:
      "【三分法による商品売買記帳のポイント】\n1. 期首商品は仕入勘定へ振替（仕入/繰越商品）\n2. 当期仕入は仕入勘定に計上\n3. 期末商品は繰越商品勘定へ振替（繰越商品/仕入）\n4. 売上原価＝期首＋仕入－期末\n\n【計算】\n売上原価：1,760,301円\n売上総利益：1,826,071円－1,760,301円＝65,770円",
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
      '{"type":"ledger_account","account_name":"建物・減価償却累計額","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"3/31","description":"前期繰越","ref":"","debit":4960026,"credit":0,"balance":4960026},{"date":"3/31","description":"減価償却累計額","ref":"","debit":0,"credit":4464018,"balance":496008},{"date":"3/31","description":"減価償却費","ref":"","debit":0,"credit":248001,"balance":248007}]}',
    explanation:
      "【建物の減価償却記入のポイント】\n1. 定額法：（取得原価－残存価額）÷耐用年数\n2. 間接法：減価償却累計額勘定を使用\n3. 当期償却費＝4,960,026円÷20年＝248,001円\n4. 帳簿価額＝取得原価－減価償却累計額\n\n【19年目の処理】\n前期末累計額：4,464,018円\n当期償却費：248,001円\n当期末累計額：4,712,019円\n帳簿価額：248,007円",
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
      '{"type":"ledger_account","account_name":"買掛金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"11/1","description":"前月繰越","ref":"","debit":0,"credit":523589,"balance":523589},{"date":"11/7","description":"仕入","ref":"","debit":0,"credit":393285,"balance":916874},{"date":"11/14","description":"現金","ref":"","debit":227553,"credit":0,"balance":689321},{"date":"11/21","description":"売掛金","ref":"","debit":66069,"credit":0,"balance":623252}]}',
    explanation:
      "【買掛金勘定記入のポイント】\n1. 買掛金の発生（掛仕入）は貸方に記入\n2. 買掛金の支払（現金・相殺）は借方に記入\n3. 売掛金との相殺は両勘定から減少\n4. 残高は常に貸方残高（負債）\n\n【計算過程】\n前月繰越 523,589円\n＋掛仕入 393,285円\n－現金支払 227,553円\n－相殺 66,069円\n＝月末残高 623,252円",
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
      '{"type":"ledger_account","account_name":"借入金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"3/1","description":"前月繰越","ref":"","debit":0,"credit":725963,"balance":725963},{"date":"3/7","description":"現金","ref":"","debit":227258,"credit":0,"balance":498705},{"date":"3/14","description":"支払利息","ref":"","debit":20524,"credit":0,"balance":478181},{"date":"3/21","description":"現金","ref":"","debit":0,"credit":135870,"balance":614051}]}',
    explanation:
      "【借入金勘定記入のポイント】\n1. 借入金の借入は貸方に記入（負債増加）\n2. 借入金の返済は借方に記入（負債減少）\n3. 支払利息は別勘定で処理（費用）\n4. 元本と利息は区別して記帳\n\n【処理内容】\n元本残高：634,575円\n支払利息：20,524円（費用勘定へ）",
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
      '{"type":"ledger_account","account_name":"貸倒引当金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"8/1","description":"前月繰越","ref":"","debit":0,"credit":111039,"balance":111039},{"date":"8/7","description":"売掛金","ref":"","debit":17606,"credit":0,"balance":93433},{"date":"8/14","description":"貸倒引当金繰入","ref":"","debit":0,"credit":44781,"balance":138214},{"date":"8/21","description":"貸倒引当金戻入","ref":"","debit":11908,"credit":0,"balance":126306}]}',
    explanation:
      "【貸倒引当金勘定記入のポイント】\n1. 貸倒引当金は評価勘定（資産のマイナス）\n2. 設定・繰入は貸方、充当・戻入は借方\n3. 差額補充法：必要額との差額を繰入\n4. 戻入益は収益として計上\n\n【残高推移】\n前月繰越 111,039円\n－充当 17,606円\n＋繰入 44,781円\n－戻入 11,908円\n＝月末残高 126,306円",
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
      '{"type":"ledger_account","account_name":"資本金","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"6/30","description":"現金","ref":"","debit":0,"credit":397451,"balance":397451},{"date":"6/30","description":"売掛金","ref":"","debit":0,"credit":596176,"balance":993627},{"date":"6/30","description":"現金","ref":"","debit":260123,"credit":0,"balance":733504},{"date":"6/30","description":"買掛金","ref":"","debit":606954,"credit":0,"balance":126550}]}',
    explanation:
      "【売上・仕入勘定の対応関係のポイント】\n1. 売上勘定は貸方に記入（収益）\n2. 仕入勘定は借方に記入（費用）\n3. 現金取引と掛取引を区別して記帳\n4. 売上総利益＝売上－仕入\n\n【計算】\n売上高：993,627円\n仕入高：867,077円\n売上総利益：126,550円",
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
      '{"type":"ledger_account","account_name":"減価償却費","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"11/25","description":"現金","ref":"","debit":321134,"credit":0,"balance":321134},{"date":"11/30","description":"未払費用","ref":"","debit":53522,"credit":0,"balance":374656}]}',
    explanation:
      "【給料・未払費用の期間配分のポイント】\n1. 給料支払は費用計上と現金減少\n2. 決算時は未払分を日割計算\n3. 未払給料は未払費用勘定へ\n4. 期間対応の原則に従い配分\n\n【計算】\n月額給料：321,134円\n日割額：10,704円/日\n未払日数：5日（26日〜30日）\n未払給料：53,522円",
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
      '{"type":"ledger_account","account_name":"給料","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"25%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"ref","label":"元丁","type":"text","width":"10%"},{"name":"debit","label":"借方","type":"number","width":"20%"},{"name":"credit","label":"貸方","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"10%"}],"allowMultipleEntries":true,"maxEntries":15}',
    correct_answer_json:
      '{"entries":[{"date":"12/31","description":"前払費用","ref":"","debit":0,"credit":90500,"balance":90500},{"date":"12/31","description":"損益","ref":"","debit":90500,"credit":0,"balance":0}]}',
    explanation:
      "【諸口勘定を含む複合仕訳の転記のポイント】\n1. 複合仕訳は相手勘定が複数存在\n2. 元帳転記時は相手勘定欄に「諸口」と記入\n3. 各勘定への個別転記を正確に実施\n4. 貸借の一致を常に確認\n\n【諸口の使用】\n借方合計305,000円＝貸方合計305,000円\n各勘定の相手欄には「諸口」と記載",
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
      "【現金出納帳記入問題】\n\n2025年6月の現金出納帳を作成してください。\n\n収入・支出・残高記入を含む詳細な記帳を行います。\n\n【前月繰越】\n504,213円\n\n【当月の取引】\n6月5日　売掛金の回収　132,948円\n6月10日　商品仕入の代金支払　64,578円\n6月15日　現金売上　151,437円\n6月20日　経費支払　65,289円\n6月25日　従業員給料支払　258,360円\n6月30日　翌月繰越（残高を次月へ繰越）\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"6/1","description":"前月繰越","ref":"","balance":504213,"receipt":504213,"payment":0},{"date":"6/5","description":"売掛金","ref":"","balance":637161,"receipt":132948,"payment":0},{"date":"6/10","description":"仕入","ref":"","balance":572583,"receipt":0,"payment":64578},{"date":"6/15","description":"売上","ref":"","balance":724020,"receipt":151437,"payment":0},{"date":"6/20","description":"経費","ref":"","balance":658731,"receipt":0,"payment":65289},{"date":"6/25","description":"給料","ref":"","balance":400371,"receipt":0,"payment":258360},{"date":"6/30","description":"次月繰越","ref":"","balance":0,"receipt":0,"payment":400371}]}',
    explanation:
      "現金出納帳記入問題です。現金の収入・支出を時系列で記録し、常に残高を把握する補助簿です。前月繰越から各取引を順次記帳し、月末に次月繰越として締め切ります。",
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
      "【当座預金出納帳記入問題】\n\n2025年4月の当座預金出納帳を作成してください。\n\n預入・引出・残高管理を含む詳細な記帳を行います。\n\n【前月繰越】\n156,700円\n\n【当月の取引】\n4月5日　売上代金の支払（小切手振出）　115,400円\n4月12日　現金預入　86,200円\n4月20日　買掛金の支払（小切手振出）　73,800円\n4月28日　売上代金の支払（小切手振出）　19,500円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"当座預金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"4/1","description":"前月繰越","ref":"","balance":156700,"receipt":156700,"payment":0},{"date":"4/5","description":"売上","ref":"","balance":41300,"receipt":0,"payment":115400},{"date":"4/12","description":"現金","ref":"","balance":127500,"receipt":86200,"payment":0},{"date":"4/20","description":"買掛金","ref":"","balance":53700,"receipt":0,"payment":73800},{"date":"4/28","description":"売上","ref":"","balance":34200,"receipt":0,"payment":19500}]}',
    explanation:
      "当座預金出納帳記入問題です。当座預金口座の預入・引出を記録し、残高を管理する補助簿です。小切手振出や現金預入を順次記帳します。",
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
      "【小口現金出納帳記入問題】\n\n2025年9月の小口現金出納帳を作成してください。\n\n補給・支払・精算を含む詳細な記帳を行います。\n\n【前月繰越】\n245,600円\n\n【当月の取引】\n9月3日　商品仕入の支払　189,300円\n9月10日　現金補給（本店より）　156,200円\n9月18日　手形代金の受取　89,400円\n9月25日　仕入先への支払　67,800円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"小口現金出納帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"9/1","description":"前月繰越","ref":"","balance":245600,"receipt":0,"payment":245600},{"date":"9/3","description":"仕入","ref":"","balance":434900,"receipt":0,"payment":189300},{"date":"9/10","description":"現金","ref":"","balance":278700,"receipt":156200,"payment":0},{"date":"9/18","description":"手形","ref":"","balance":189300,"receipt":89400,"payment":0},{"date":"9/25","description":"仕入","ref":"","balance":257100,"receipt":0,"payment":67800}]}',
    explanation:
      "小口現金出納帳記入問題です。小額な支払いに使用する小口現金の管理を行う補助簿です。現金補給と各種支払いを記録し、残高を管理します。",
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
      "【普通預金通帳記入問題】\n\n2025年7月の普通預金通帳を作成してください。\n\n記帳・利息計算を含む詳細な記帳を行います。\n\n【前月繰越】\n残高なし（0円からスタート）\n\n【当月の取引】\n7月5日　売掛金の回収　145,200円\n7月12日　売掛金の回収　198,700円\n7月20日　売掛金の回収　87,600円\n7月28日　現金引出　56,300円\n\n【作成指示】\n1. 日付順に記帳\n2. 摘要欄の適切な記入\n3. 収入・支出・残高の計算\n4. 月末締切処理",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"普通預金通帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"7/5","description":"売掛金","ref":"","balance":145200,"receipt":0,"payment":145200},{"date":"7/12","description":"売掛金","ref":"","balance":343900,"receipt":0,"payment":198700},{"date":"7/20","description":"売掛金","ref":"","balance":431500,"receipt":0,"payment":87600},{"date":"7/28","description":"現金","ref":"","balance":487800,"receipt":0,"payment":56300}]}',
    explanation:
      "普通預金通帳記入問題です。銀行預金の預入・引出を記録し、残高を管理する補助簿です。利息計算や各種取引を記帳します。",
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
      "【仕入帳記入問題】\n\n2025年10月の仕入帳を作成してください。\n\n日付・仕入先・品名・金額記入を行います。\n\n【当月の仕入取引】\n10月3日　仕入先Aからの買掛仕入　234,500円\n10月10日　仕入先Bからの買掛仕入　167,800円\n10月18日　仕入先Cからの買掛仕入　89,200円\n10月25日　現金仕入　45,600円\n\n【作成指示】\n1. 取引順に記帳\n2. 単価計算方法の適用\n3. 残高の継続的管理\n4. 月末棚卸との照合",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"仕入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"10/3","description":"買掛金","ref":"","balance":234500,"receipt":234500,"payment":0},{"date":"10/10","description":"買掛金","ref":"","balance":402300,"receipt":167800,"payment":0},{"date":"10/18","description":"買掛金","ref":"","balance":491500,"receipt":89200,"payment":0},{"date":"10/25","description":"現金","ref":"","balance":537100,"receipt":45600,"payment":0}]}',
    explanation:
      "仕入帳記入に関する問題です。\n\n【仕入帳の基本】\n・商品の仕入取引を日付順に記録\n・仕入先別に管理することも可能\n・買掛金・現金の支払区分を明確化\n\n【記帳のポイント】\n・日付、摘要、金額を正確に記入\n・残高は累計で計算\n・月末に合計金額を確認\n\n【注意点】\n・仕入返品や仕入値引は控除項目として処理\n・消費税込み価格での記録が一般的",
    difficulty: 2,
    tags_json:
      '{"subcategory":"subsidiary_ledger","pattern":"仕入帳","accounts":[],"keywords":["仕入帳","補助簿","買掛金","仕入取引"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    id: "Q_L_016",
    category_id: "ledger",
    question_text:
      "【売上帳記入問題】\n\n2025年5月の売上帳を作成してください。\n\n【前月繰越】\n189,300円\n\n【当月の取引】\n5月7日　手形振出　145,600円\n5月15日　手形決済による入金　98,700円\n5月22日　手形振出　76,500円\n5月30日　手形決済による入金　123,400円\n\n上記の取引を売上帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売上帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"5/1","description":"前月繰越","ref":"","balance":189300,"receipt":0,"payment":189300},{"date":"5/7","description":"振出","ref":"","balance":334900,"receipt":0,"payment":145600},{"date":"5/15","description":"決済","ref":"","balance":236200,"receipt":98700,"payment":0},{"date":"5/22","description":"振出","ref":"","balance":312700,"receipt":0,"payment":76500},{"date":"5/30","description":"決済","ref":"","balance":189300,"receipt":123400,"payment":0}]}',
    explanation:
      "売上帳記入問題です。売上に関連する手形取引を記録し、残高を管理する補助簿です。",
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
      "【商品有高帳（先入先出法）記入問題】\n\n2025年8月の商品有高帳（先入先出法）を作成してください。\n\n【前月繰越】\n234,500円\n\n【当月の取引】\n8月5日　手形受取　178,900円\n8月12日　手形裏書譲渡　145,600円\n8月20日　手形受取　98,700円\n8月28日　手形満期決済　87,300円\n\n上記の取引を商品有高帳（先入先出法）に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（先入先出法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"8/1","description":"前月繰越","ref":"","balance":234500,"receipt":234500,"payment":0},{"date":"8/5","description":"受取","ref":"","balance":413400,"receipt":178900,"payment":0},{"date":"8/12","description":"裏書譲渡","ref":"","balance":267800,"receipt":0,"payment":145600},{"date":"8/20","description":"受取","ref":"","balance":366500,"receipt":98700,"payment":0},{"date":"8/28","description":"満期決済","ref":"","balance":279200,"receipt":0,"payment":87300}]}',
    explanation:
      "商品有高帳（先入先出法）記入問題です。商品の仕入・売上を先入先出法で管理する補助簿です。",
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
      "【商品有高帳（移動平均法）記入問題】\n\n2025年11月の商品有高帳（移動平均法）を作成してください。\n\n【前月繰越】\n456,700円\n\n【当月の取引】\n11月5日　商品仕入　234,500円\n11月12日　仕入返品　34,500円\n11月20日　商品仕入　189,300円\n11月28日　仕入値引　12,300円\n\n上記の取引を商品有高帳（移動平均法）に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"商品有高帳（移動平均法）","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"11/1","description":"前月繰越","ref":"","balance":456700,"receipt":456700,"payment":0},{"date":"11/5","description":"仕入","ref":"","balance":691200,"receipt":234500,"payment":0},{"date":"11/12","description":"仕入返品","ref":"","balance":656700,"receipt":0,"payment":34500},{"date":"11/20","description":"仕入","ref":"","balance":846000,"receipt":189300,"payment":0},{"date":"11/28","description":"仕入値引","ref":"","balance":833700,"receipt":0,"payment":12300}]}',
    explanation:
      "商品有高帳（移動平均法）記入問題です。商品の仕入・売上を移動平均法で管理する補助簿です。",
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
      "【売掛金元帳・買掛金元帳記入問題】\n\n2025年2月の売掛金元帳・買掛金元帳を作成してください。\n\n【前月繰越】\n567,800円\n\n【当月の取引】\n2月5日　売上取引　345,600円\n2月12日　売上返品　45,600円\n2月20日　売上取引　234,500円\n2月28日　売上値引　23,400円\n\n上記の取引を売掛金元帳・買掛金元帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"売掛金元帳・買掛金元帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"2/1","description":"前月繰越","ref":"","balance":567800,"receipt":0,"payment":567800},{"date":"2/5","description":"売上","ref":"","balance":913400,"receipt":0,"payment":345600},{"date":"2/12","description":"売上返品","ref":"","balance":867800,"receipt":45600,"payment":0},{"date":"2/20","description":"売上","ref":"","balance":1102300,"receipt":0,"payment":234500},{"date":"2/28","description":"売上値引","ref":"","balance":1078900,"receipt":23400,"payment":0}]}',
    explanation:
      "売掛金元帳・買掛金元帳記入問題です。得意先・仕入先との取引を管理し、売掛金・買掛金の残高を把握する補助簿です。",
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
      "【受取手形記入帳・支払手形記入帳記入問題】\n\n2025年3月の受取手形記入帳・支払手形記入帳を作成してください。\n\n【当月の取引】\n3月5日　仕入先Aからの手形受取　145,600円\n3月12日　仕入先Bからの手形受取　198,700円\n3月20日　仕入先Cからの手形受取　87,600円\n3月28日　仕入先Dからの手形受取　134,200円\n\n上記の取引を受取手形記入帳・支払手形記入帳に記帳し、各取引後の残高を計算してください。",
    answer_template_json:
      '{"type":"subsidiary_book","book_type":"受取手形記入帳・支払手形記入帳","columns":[{"name":"date","label":"日付","type":"text","width":"15%"},{"name":"description","label":"摘要","type":"dropdown","width":"30%","options":["前月繰越","次月繰越","損益","売上","売上返品","売上値引","受取利息","受取手数料","仕入","仕入返品","仕入値引","給料","支払家賃","水道光熱費","支払利息","通信費","消耗品費","旅費交通費","現金","当座預金","売掛金","受取手形","商品","備品","建物","土地","前払費用","未収収益","買掛金","支払手形","借入金","未払費用","前受収益","貸倒引当金","貸倒引当金繰入","貸倒引当金戻入","振出","受取","裏書譲渡","決済","満期決済","仕入先","得意先","諸口"]},{"name":"receipt","label":"収入","type":"number","width":"20%"},{"name":"payment","label":"支出","type":"number","width":"20%"},{"name":"balance","label":"残高","type":"number","width":"15%"}],"allowMultipleEntries":true,"maxEntries":20}',
    correct_answer_json:
      '{"entries":[{"date":"3/5","description":"仕入先A","ref":"","balance":145600,"receipt":145600,"payment":0},{"date":"3/12","description":"仕入先B","ref":"","balance":344300,"receipt":198700,"payment":0},{"date":"3/20","description":"仕入先C","ref":"","balance":431900,"receipt":87600,"payment":0},{"date":"3/28","description":"仕入先D","ref":"","balance":566100,"receipt":134200,"payment":0}]}',
    explanation:
      "受取手形記入帳・支払手形記入帳記入問題です。手形の受取・支払を管理し、期日管理を行う補助簿です。",
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
      "【3伝票制：入金伝票による現金収入取引】\n\n2025年5月の現金収入取引を入金伝票に記録してください。\n\n【取引内容】\n5月1日：売掛金319,066円を現金で回収した。\n5月20日：商品386,900円を現金で売り上げた。\n5月27日：得意先から受取手形627,660円を受け取った。\n\n【作成指示】\n1. 入金伝票を使用して記録\n2. 日付、勘定科目、金額、摘要を正確に記入\n3. 現金の増加取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"入金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["売掛金","売上","受取手形","前受金","雑収入","借入金","資本金","仮受金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["売掛金回収","現金売上","手形受取","前受金受取","その他"]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"入金伝票","entries":[{"date":"5/1","account":"売掛金","amount":319066,"description":"売掛金回収"},{"date":"5/20","account":"売上","amount":386900,"description":"現金売上"},{"date":"5/27","account":"受取手形","amount":627660,"description":"手形受取"}]}',
    explanation:
      "【入金伝票記入のポイント】\n1. 現金が増加する取引を記録\n2. 貸方は「現金」、借方は相手勘定\n3. 複数の相手勘定は「諸口」と記載\n4. 仕訳日計表への転記\n\n【仕訳】\n(借)現金 1,333,626 / (貸)売掛金 319,066\n　　　　　　　　　　　　売上 386,900\n　　　　　　　　　　　　受取手形 627,660",
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
      "【3伝票制：出金伝票による現金支出取引】\n\n2025年2月の現金支出取引を出金伝票に記録してください。\n\n【取引内容】\n2月8日：商品666,219円を現金で仕入れた。\n2月15日：従業員の給料572,665円を現金で支払った。\n2月24日：買掛金682,448円を現金で支払った。\n\n【作成指示】\n1. 出金伝票を使用して記録\n2. 日付、勘定科目、金額、摘要を正確に記入\n3. 現金の減少取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"出金伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["買掛金","仕入","支払手形","前払金","給料","水道光熱費","支払家賃","消耗品費","雑費","仮払金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["現金仕入","買掛金支払","給料支払","家賃支払","経費支払","その他"]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"出金伝票","entries":[{"date":"2/8","account":"仕入","amount":666219,"description":"現金仕入"},{"date":"2/15","account":"給料","amount":572665,"description":"給料支払"},{"date":"2/24","account":"買掛金","amount":682448,"description":"買掛金支払"}]}',
    explanation:
      "【出金伝票記入のポイント】\n1. 現金が減少する取引を記録\n2. 借方は「現金」、貸方は相手勘定\n3. 複数の相手勘定は「諸口」と記載\n4. 仕訳日計表への転記\n\n【仕訳】\n(借)仕入 666,219 / (貸)現金 1,921,332\n　　買掛金 572,665\n　　経費 682,448",
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
      "【3伝票制：振替伝票による現金以外の取引】\n\n2025年8月の現金以外の取引を振替伝票に記録してください。\n\n【取引内容】\n8月3日：商品301,530円を掛けで仕入れた。\n8月7日：商品280,539円を掛けで売り上げた。\n8月12日：買掛金406,302円について支払手形を振り出した。\n\n【作成指示】\n1. 振替伝票を使用して記録\n2. 借方・貸方の勘定科目と金額を正確に記入\n3. 現金が関わらない取引であることを確認",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"8/3","debit_account":"仕入","debit_amount":301530,"credit_account":"買掛金","credit_amount":301530},{"date":"8/7","debit_account":"売掛金","debit_amount":280539,"credit_account":"売上","credit_amount":280539},{"date":"8/12","debit_account":"支払手形","debit_amount":406302,"credit_account":"買掛金","credit_amount":406302}]}',
    explanation:
      "【振替伝票記入のポイント】\n1. 現金が関わらない取引を記録\n2. 借方・貸方を明確に記載\n3. 貸借の一致を確認\n4. 総勘定元帳への転記\n\n【取引内容】\n・掛売上：売掛金/売上\n・掛仕入：仕入/買掛金\n・手形振出：買掛金/支払手形",
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
      "【3伝票制：掛け取引の振替伝票記入】\n\n2025年9月の取引を3伝票制により記録してください。\n\n【取引内容】\n27日：取引金額 85,665円\n24日：取引金額 191,383円\n11日：取引金額 151,791円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"9/11","debit_account":"売掛金","debit_amount":151791,"credit_account":"売上","credit_amount":151791},{"date":"9/24","debit_account":"仕入","debit_amount":191383,"credit_account":"買掛金","credit_amount":191383},{"date":"9/27","debit_account":"買掛金","debit_amount":85665,"credit_account":"支払手形","credit_amount":85665}]}',
    explanation:
      "【掛取引の振替伝票記入のポイント】\n1. 掛売上：売掛金（借）/売上（貸）\n2. 掛仕入：仕入（借）/買掛金（貸）\n3. 相殺：買掛金（借）/売掛金（貸）\n4. 貸借の一致を確認\n\n【注意点】\n・信用取引は振替伝票に記載\n・相殺取引も現金を介さない",
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
      "【3伝票制：一部現金取引の伝票分割】\n\n2025年5月の取引を3伝票制により記録してください。\n\n【取引内容】\n13日：取引金額 252,840円\n27日：取引金額 235,649円\n28日：取引金額 248,951円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"5/13","debit_account":"仕入","debit_amount":252840,"credit_account":"現金","credit_amount":100000},{"date":"5/13","debit_account":"","debit_amount":0,"credit_account":"買掛金","credit_amount":152840},{"date":"5/27","debit_account":"売掛金","debit_amount":235649,"credit_account":"売上","credit_amount":235649},{"date":"5/28","debit_account":"現金","debit_amount":248951,"credit_account":"売上","credit_amount":248951}]}',
    explanation:
      "【一部現金取引の伝票分割のポイント】\n1. 現金部分→入金/出金伝票\n2. 掛け部分→振替伝票\n3. 取引を2枚の伝票に分割\n4. 合計額の一致を確認\n\n【分割方法】\n取引総額＝現金部分＋掛け部分\n例：売上252,840円＝現金150,000円＋掛け102,840円",
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
      "【3伝票制：3伝票から仕訳日計表への集計】\n\n2025年11月の取引を3伝票制により記録してください。\n\n【取引内容】\n28日：取引金額 159,981円\n12日：取引金額 300,530円\n4日：取引金額 125,950円\n\n【作成指示】\n1. 適切な伝票の選択\n2. 伝票への記入方法\n3. 一部現金取引の処理",
    answer_template_json:
      '{"type":"voucher_entry","voucher_type":"振替伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"debit_account","label":"借方科目","type":"select","required":true,"options":["仕入","買掛金","売掛金","受取手形","前払金","建物","備品","車両運搬具","給料","水道光熱費","支払家賃","消耗品費","雑費"]},{"name":"debit_amount","label":"借方金額","type":"number","required":true},{"name":"credit_account","label":"貸方科目","type":"select","required":true,"options":["売上","買掛金","売掛金","支払手形","前受金","借入金","資本金","未払金","預り金"]},{"name":"credit_amount","label":"貸方金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"振替伝票","entries":[{"date":"11/4","debit_account":"備品","debit_amount":125950,"credit_account":"未払金","credit_amount":125950},{"date":"11/12","debit_account":"売掛金","debit_amount":300530,"credit_account":"売上","credit_amount":300530},{"date":"11/28","debit_account":"買掛金","debit_amount":159981,"credit_account":"支払手形","credit_amount":159981}]}',
    explanation:
      "【3伝票から仕訳日計表への集計のポイント】\n1. 入金伝票の合計を集計\n2. 出金伝票の合計を集計\n3. 振替伝票の内容を転記\n4. 仕訳日計表で貸借一致を確認\n\n【集計手順】\n・各伝票の日付別集計\n・勘定科目別の合計\n・総勘定元帳への転記準備",
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
      '{"type":"voucher_entry","voucher_type":"売上伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"customer","label":"得意先","type":"text","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"売上伝票","entries":[{"date":"11/7","customer":"A社","amount":705035,"description":"商品売上"},{"date":"11/18","customer":"B社","amount":296150,"description":"商品売上"},{"date":"11/22","customer":"C社","amount":526373,"description":"商品売上"}]}',
    explanation:
      "【5伝票制の売上伝票記入のポイント】\n1. 売上取引専用の伝票を使用\n2. 現金売上と掛売上を区別\n3. 得意先別に記録\n4. 売上勘定への一括転記\n\n【5伝票制の特徴】\n・売上伝票（売上専用）\n・仕入伝票（仕入専用）\n・入金、出金、振替伝票",
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
      '{"type":"voucher_entry","voucher_type":"仕入伝票","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"supplier","label":"仕入先","type":"text","required":true},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"仕入伝票","entries":[{"date":"4/11","supplier":"X商事","amount":197758,"description":"商品仕入"},{"date":"4/17","supplier":"Y商店","amount":178273,"description":"商品仕入"},{"date":"4/28","supplier":"Z商会","amount":155282,"description":"商品仕入"}]}',
    explanation:
      "【5伝票制の仕入伝票記入のポイント】\n1. 仕入取引専用の伝票を使用\n2. 現金仕入と掛仕入を区別\n3. 仕入先別に記録\n4. 仕入勘定への一括転記\n\n【仕入伝票の活用】\n・仕入取引の効率的記録\n・仕入先管理の容易化\n・仕入統計の作成",
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
      '{"type":"voucher_entry","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["売掛金","売上","受取手形","前受金","雑収入","借入金","資本金","仮受金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"text","required":false}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"5伝票制組合せ","entries":[{"voucher":"仕入伝票","date":"4/8","amount":436244,"description":"商品仕入"},{"voucher":"売上伝票","date":"4/25","amount":611082,"description":"商品売上"},{"voucher":"入金伝票","date":"4/25","account":"売掛金","amount":739173,"description":"売掛金回収"}]}',
    explanation:
      "【5伝票制での取引分類のポイント】\n1. 売上→売上伝票（支払方法問わず）\n2. 仕入→仕入伝票（支払方法問わず）\n3. その他現金収入→入金伝票\n4. その他現金支出→出金伝票\n5. 現金以外→振替伝票\n\n【判定の優先順位】\n取引内容（売上・仕入）＞支払方法",
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
      '{"type":"voucher_entry","voucher_type":"5伝票制","fields":[{"name":"date","label":"日付","type":"text","required":true},{"name":"account","label":"勘定科目","type":"select","required":true,"options":["買掛金","仕入","支払手形","前払金","給料","水道光熱費","支払家賃","消耗品費","雑費","仮払金"]},{"name":"amount","label":"金額","type":"number","required":true},{"name":"description","label":"摘要","type":"select","required":false,"options":["売上取引","仕入取引","回収取引","支払取引","経費支払","給料支払","売掛金回収","買掛金支払","手形受取","手形支払","備品購入","現金売上","掛売上","現金仕入","掛仕入","返品処理","値引処理","振替取引","決算整理","月末処理",""]}],"allowMultipleEntries":true,"maxEntries":5}',
    correct_answer_json:
      '{"voucher_type":"5伝票制総勘定元帳転記","entries":[{"voucher":"出金伝票","date":"8/4","account":"給料","amount":764578},{"voucher":"売上伝票","date":"8/8","customer":"得意先","amount":605681},{"voucher":"仕入伝票","date":"8/8","supplier":"仕入先","amount":700622}]}',
    explanation:
      "【5伝票から総勘定元帳への転記のポイント】\n1. 各伝票の合計を集計\n2. 勘定科目別に転記\n3. 売上・仕入伝票は一括転記\n4. 貸借の一致を確認\n\n【転記の流れ】\n伝票→仕訳日計表→総勘定元帳\n・正確性の確保\n・効率的な記帳",
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
      '{"type":"multiple_choice","options":["複式","借方","貸方","貸借平均の原理"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"複式","b":"借方","c":"貸方","d":"貸借平均の原理"}}',
    explanation:
      "【複式簿記の基本原理】\n1. 複式簿記：すべての取引を二面的に記録\n2. 借方と貸方：左側（借方）と右側（貸方）への記入\n3. 貸借平均の原理：借方合計＝貸方合計\n4. 記録の検証可能性を確保\n\n【重要性】\n複式簿記により、財産状態と経営成績を同時に把握可能",
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
      "【理論問題：仕訳の原則と借方・貸方の理解】\n\n以下の説明文の空欄に入る適切な語句を選択してください。\n\n資産の増加は（ア）に、負債の増加は（イ）に記入する。\n収益の発生は（ウ）に、費用の発生は（エ）に記入する。\n\n【選択肢】\nA. 借方\nB. 貸方\nC. 左\nD. 右\n\n【解答形式】\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","options":["借方","貸方","左","右"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"D","d":"C"},"correctText":{"a":"借方","b":"貸方","c":"右","d":"左"}}',
    explanation:
      "【仕訳の原則】\n1. 資産の増加→借方（左）\n2. 負債の増加→貸方（右）\n3. 純資産の増加→貸方（右）\n4. 収益の発生→貸方（右）\n5. 費用の発生→借方（左）\n\n【覚え方】\n「資産・費用は借方」「負債・純資産・収益は貸方」",
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
      '{"type":"multiple_choice","options":["仕訳帳","総勘定元帳","現金出納帳","売掛金元帳"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"仕訳帳","b":"総勘定元帳","c":"現金出納帳","d":"売掛金元帳"}}',
    explanation:
      "【帳簿組織の体系】\n1. 主要簿：仕訳帳・総勘定元帳\n2. 補助簿：補助記入帳・補助元帳\n3. 補助記入帳：現金出納帳、売上帳、仕入帳等\n4. 補助元帳：売掛金元帳、買掛金元帳等\n\n【役割分担】\n主要簿で全体を把握、補助簿で詳細を管理",
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
      '{"type":"multiple_choice","options":["入金","出金","売上","仕入"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"入金","b":"出金","c":"売上","d":"仕入"}}',
    explanation:
      "【伝票制度の比較】\n■3伝票制\n・入金伝票：現金収入\n・出金伝票：現金支出\n・振替伝票：現金以外\n\n■5伝票制\n・上記3種類＋売上伝票＋仕入伝票\n・売上と仕入を専用伝票で効率化",
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
      '{"type":"multiple_choice","options":["合計","残高","合計残高","転記の正確性"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"合計","b":"残高","c":"合計残高","d":"転記の正確性"}}',
    explanation:
      "【試算表の種類と特徴】\n1. 合計試算表：各勘定の借方・貸方合計を表示\n2. 残高試算表：各勘定の残高のみ表示\n3. 合計残高試算表：合計と残高の両方を表示\n\n【作成目的】\n・転記の正確性検証\n・貸借平均の確認\n・財務諸表作成の準備",
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
      '{"type":"multiple_choice","options":["発生主義","棚卸","減価償却","貸倒引当金"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"発生主義","b":"棚卸","c":"減価償却","d":"貸倒引当金"}}',
    explanation:
      "【主要な決算整理事項】\n1. 発生主義の適用：収益・費用の期間配分\n2. 商品棚卸：期末商品の評価\n3. 減価償却：固定資産の価値減少\n4. 貸倒引当金：債権の回収リスク評価\n5. 経過勘定：前払・未払・前受・未収の調整",
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
      '{"type":"multiple_choice","options":["資産","収益","費用","株主資本等変動計算書"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"収益","c":"費用","d":"株主資本等変動計算書"}}',
    explanation:
      "【財務諸表の体系】\n■貸借対照表（B/S）\n・資産＝負債＋純資産\n・財政状態を表示\n\n■損益計算書（P/L）\n・収益－費用＝当期純利益\n・経営成績を表示\n\n■株主資本等変動計算書\n・純資産の変動内容を詳細表示",
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
      '{"type":"multiple_choice","options":["資産","負債","収益","費用"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産","b":"負債","c":"収益","d":"費用"}}',
    explanation:
      "【勘定科目の5分類】\n■貸借対照表項目\n1. 資産：現金、売掛金、建物等\n2. 負債：買掛金、借入金等\n3. 純資産：資本金、利益剰余金等\n\n■損益計算書項目\n4. 収益：売上、受取利息等\n5. 費用：仕入、給料、減価償却費等",
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
      '{"type":"multiple_choice","options":["資産・負債・純資産","該当しない","該当する","仕訳"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"資産・負債・純資産","b":"該当しない","c":"該当する","d":"仕訳"}}',
    explanation:
      "【簿記上の取引の要件】\n1. 資産・負債・純資産の増減が発生\n2. 金額で測定可能\n3. 企業の経済活動に関連\n\n【判定例】\n・商品売買→取引（○）\n・契約締結のみ→取引（×）\n・火災損失→取引（○）\n・商談→取引（×）",
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
      '{"type":"multiple_choice","options":["財政状態","経営成績","貸借平均の原理","財務諸表"],"questions":[{"id":"a","label":"（ア）"},{"id":"b","label":"（イ）"},{"id":"c","label":"（ウ）"},{"id":"d","label":"（エ）"}]}',
    correct_answer_json:
      '{"answers":{"a":"A","b":"B","c":"C","d":"D"},"correctText":{"a":"財政状態","b":"経営成績","c":"貸借平均の原理","d":"財務諸表"}}',
    explanation:
      "【複式簿記の利点】\n1. 財政状態の把握：貸借対照表で資産・負債・純資産を表示\n2. 経営成績の把握：損益計算書で収益・費用・利益を表示\n3. 自己検証機能：貸借平均により誤りを発見\n4. 情報提供機能：財務諸表により利害関係者へ報告\n\n【単式簿記との違い】\n単式簿記は現金の収支のみ記録、複式簿記は全取引を二面的に記録",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
];

export const ledgerQuestionCount = 40;
