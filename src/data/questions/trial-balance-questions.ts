/**
 * Trial Balance Questions (試算表問題)
 * 簿記3級問題集アプリ - 試算表問題データ
 * Generated from master-questions.ts
 */

import { Question } from "../../types/models";

export const trialbalanceQuestions: Question[] = [
  {
    id: "Q_T_001",
    category_id: "trial_balance",
    question_text:
      "【財務諸表作成問題（基礎レベル）】\\n\\n2025年9月期の取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首貸借対照表（2025年9月1日）】\\n現金：500,000円\\n建物：2,000,000円\\n土地：1,500,000円\\n資本金：4,000,000円\\n\\n【期中取引】\\n9月2日 現金 300,000 / 資本金 300,000 （資本金受入）\\n9月5日 水道光熱費 150,000 / 現金 150,000 （水道光熱費支払）\\n9月10日 仕入 400,000 / 買掛金 400,000 （商品仕入）\\n9月15日 現金 200,000 / 売上 200,000 （商品売上）\\n9月20日 買掛金 100,000 / 現金 100,000 （買掛金支払）\\n\\n【決算整理事項】\\n・貸倒引当金設定：貸倒引当金繰入 15,000 / 貸倒引当金 15,000\\n・減価償却：減価償却費 100,000 / 減価償却累計額 100,000\\n\\n【作成指示】\\n1. 上記取引を仕訳する\\n2. 決算整理仕訳を行う\\n3. 貸借対照表と損益計算書を作成する",
    answer_template_json:
      '{"type":"financial_statement","columns":["借方","貸方"],"accounts":["現金","当座預金","売掛金","受取手形","商品","前払金","建物","備品","土地","買掛金","支払手形","借入金","前受金","資本金","繰越利益剰余金","売上","受取利息","仕入","給料","支払利息","減価償却費","租税公課"],"totals":true}',
    correct_answer_json:
      '{"entries":[{"accountName":"現金","debitAmount":450000,"creditAmount":250000},{"accountName":"資本金","debitAmount":0,"creditAmount":300000},{"accountName":"水道光熱費","debitAmount":150000,"creditAmount":0},{"accountName":"仕入","debitAmount":400000,"creditAmount":0},{"accountName":"買掛金","debitAmount":100000,"creditAmount":400000},{"accountName":"売上","debitAmount":0,"creditAmount":200000},{"accountName":"貸倒引当金繰入","debitAmount":15000,"creditAmount":0},{"accountName":"貸倒引当金","debitAmount":0,"creditAmount":15000},{"accountName":"減価償却費","debitAmount":100000,"creditAmount":0},{"accountName":"減価償却累計額","debitAmount":0,"creditAmount":100000}]}',
    explanation:
      "財務諸表作成の基礎問題です。\n\n【解答のポイント】\n1. 期中取引5件を正確に仕訳する\n2. 決算整理仕訳2項目を適切に行う\n3. 試算表を経由して財務諸表を作成\n\n【注意点】\n・貸倒引当金は売上債権に対して設定\n・減価償却は定額法で計算\n・借方合計と貸方合計が一致することを確認\n\n【よくある間違い】\n・決算整理の二重計上\n・勘定科目の分類ミス\n・金額の転記ミス",
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

export const trialbalanceQuestionCount = 12;
