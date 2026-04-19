/**
 * 問題-勘定科目マッピングデータ（自動生成）
 * 動的フィルタリング機能で使用する問題別の関連勘定科目
 *
 * 生成日時: 2026-04-19T10:15:00.511Z
 * 総問題数: 370
 * 生成スクリプト: scripts/data/generate-question-mappings.js
 */

import { AccountCategory } from './account-categories';

export interface QuestionAccountMapping {
  questionId: string;           // 問題ID (例: "Q_J_001")
  primaryAccounts: string[];    // 正答科目（必須表示）
  relatedAccounts: string[];    // 関連科目
  supplementaryAccounts?: string[]; // 補完科目
  category: AccountCategory;    // 問題カテゴリ
  keywords: string[];          // 問題文のキーワード
}

/**
 * 自動生成された問題-勘定科目マッピングデータ
 */
export const GENERATED_QUESTION_ACCOUNT_MAPPINGS: Record<string, QuestionAccountMapping> = {
  "Q_J_001": {
    "questionId": "Q_J_001",
    "primaryAccounts": [
      "現金過不足",
      "現金"
    ],
    "relatedAccounts": [
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "現金過不足",
      "現金",
      "実査"
    ]
  },
  "Q_J_002": {
    "questionId": "Q_J_002",
    "primaryAccounts": [
      "通信費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "現金過不足",
      "現金",
      "実査"
    ]
  },
  "Q_J_003": {
    "questionId": "Q_J_003",
    "primaryAccounts": [
      "雑損失",
      "現金過不足"
    ],
    "relatedAccounts": [
      "現金",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "現金過不足",
      "現金",
      "決算"
    ]
  },
  "Q_J_004": {
    "questionId": "Q_J_004",
    "primaryAccounts": [
      "現金",
      "現金過不足"
    ],
    "relatedAccounts": [
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "現金過不足",
      "現金",
      "実査"
    ]
  },
  "Q_J_005": {
    "questionId": "Q_J_005",
    "primaryAccounts": [
      "小口現金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "小口現金",
      "現金",
      "小口"
    ]
  },
  "Q_J_006": {
    "questionId": "Q_J_006",
    "primaryAccounts": [
      "小口現金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "小口現金",
      "現金",
      "小口"
    ]
  },
  "Q_J_007": {
    "questionId": "Q_J_007",
    "primaryAccounts": [
      "旅費交通費",
      "消耗品費",
      "小口現金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "小口現金",
      "現金",
      "小口"
    ]
  },
  "Q_J_008": {
    "questionId": "Q_J_008",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "その他現金取引",
      "現金",
      "商品"
    ]
  },
  "Q_J_009": {
    "questionId": "Q_J_009",
    "primaryAccounts": [
      "給料",
      "現金",
      "預り金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "その他現金取引",
      "現金",
      "源泉"
    ]
  },
  "Q_J_010": {
    "questionId": "Q_J_010",
    "primaryAccounts": [
      "旅費交通費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "その他現金取引",
      "現金"
    ]
  },
  "Q_J_011": {
    "questionId": "Q_J_011",
    "primaryAccounts": [
      "租税公課",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "その他現金取引",
      "現金",
      "固定資産"
    ]
  },
  "Q_J_012": {
    "questionId": "Q_J_012",
    "primaryAccounts": [
      "現金",
      "仮払金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "現金取引",
      "その他現金取引",
      "現金",
      "預金",
      "定期",
      "源泉"
    ]
  },
  "Q_J_013": {
    "questionId": "Q_J_013",
    "primaryAccounts": [
      "当座預金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引",
      "現金",
      "預金",
      "当座"
    ]
  },
  "Q_J_014": {
    "questionId": "Q_J_014",
    "primaryAccounts": [
      "買掛金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引"
    ]
  },
  "Q_J_015": {
    "questionId": "Q_J_015",
    "primaryAccounts": [
      "当座預金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引",
      "預金",
      "当座"
    ]
  },
  "Q_J_016": {
    "questionId": "Q_J_016",
    "primaryAccounts": [
      "現金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引",
      "現金",
      "預金",
      "当座"
    ]
  },
  "Q_J_017": {
    "questionId": "Q_J_017",
    "primaryAccounts": [
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引",
      "預金",
      "当座"
    ]
  },
  "Q_J_018": {
    "questionId": "Q_J_018",
    "primaryAccounts": [
      "当座預金",
      "支払手数料",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金基本取引"
    ]
  },
  "Q_J_019": {
    "questionId": "Q_J_019",
    "primaryAccounts": [
      "水道光熱費",
      "当座借越"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "預金",
      "当座"
    ]
  },
  "Q_J_020": {
    "questionId": "Q_J_020",
    "primaryAccounts": [
      "買掛金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "預金",
      "当座"
    ]
  },
  "Q_J_021": {
    "questionId": "Q_J_021",
    "primaryAccounts": [
      "支払利息",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "預金",
      "当座"
    ]
  },
  "Q_J_022": {
    "questionId": "Q_J_022",
    "primaryAccounts": [
      "当座借越",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "現金",
      "当座"
    ]
  },
  "Q_J_023": {
    "questionId": "Q_J_023",
    "primaryAccounts": [
      "当座預金",
      "当座借越",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "預金",
      "当座"
    ]
  },
  "Q_J_024": {
    "questionId": "Q_J_024",
    "primaryAccounts": [
      "買掛金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座借越",
      "預金",
      "当座"
    ]
  },
  "Q_J_025": {
    "questionId": "Q_J_025",
    "primaryAccounts": [
      "当座預金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金利息・手数料",
      "預金",
      "当座",
      "源泉"
    ]
  },
  "Q_J_026": {
    "questionId": "Q_J_026",
    "primaryAccounts": [
      "支払手数料",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金利息・手数料",
      "預金",
      "当座"
    ]
  },
  "Q_J_027": {
    "questionId": "Q_J_027",
    "primaryAccounts": [
      "買掛金",
      "当座預金",
      "受取手数料"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金・預金",
      "当座預金",
      "当座預金利息・手数料"
    ]
  },
  "Q_J_028": {
    "questionId": "Q_J_028",
    "primaryAccounts": [
      "普通預金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "口座開設",
      "資金預入",
      "現金",
      "預金",
      "普通"
    ]
  },
  "Q_J_029": {
    "questionId": "Q_J_029",
    "primaryAccounts": [
      "現金",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "現金引出",
      "事業資金",
      "現金",
      "預金",
      "普通"
    ]
  },
  "Q_J_030": {
    "questionId": "Q_J_030",
    "primaryAccounts": [
      "水道光熱費",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "自動引落",
      "公共料金",
      "預金",
      "普通"
    ]
  },
  "Q_J_031": {
    "questionId": "Q_J_031",
    "primaryAccounts": [
      "普通預金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "給与振込",
      "振込入金",
      "預金",
      "普通"
    ]
  },
  "Q_J_032": {
    "questionId": "Q_J_032",
    "primaryAccounts": [
      "普通預金",
      "租税公課",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "利息受取",
      "源泉徴収",
      "預金",
      "普通",
      "源泉"
    ]
  },
  "Q_J_033": {
    "questionId": "Q_J_033",
    "primaryAccounts": [
      "普通預金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "普通預金",
      "当座預金",
      "口座振替",
      "預金",
      "当座",
      "普通"
    ]
  },
  "Q_J_034": {
    "questionId": "Q_J_034",
    "primaryAccounts": [
      "現金",
      "支払手数料",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "小口現金",
      "前渡し",
      "インプレスト",
      "現金",
      "預金",
      "普通"
    ]
  },
  "Q_J_035": {
    "questionId": "Q_J_035",
    "primaryAccounts": [
      "当座預金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "当座預金",
      "振込",
      "売掛金回収",
      "預金",
      "当座"
    ]
  },
  "Q_J_036": {
    "questionId": "Q_J_036",
    "primaryAccounts": [
      "定期預金",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "定期預金証書",
      "預け入れ",
      "預金",
      "普通",
      "定期"
    ]
  },
  "Q_J_037": {
    "questionId": "Q_J_037",
    "primaryAccounts": [
      "普通預金",
      "定期預金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "満期解約",
      "利息計算",
      "預金",
      "普通",
      "定期"
    ]
  },
  "Q_J_038": {
    "questionId": "Q_J_038",
    "primaryAccounts": [
      "普通預金",
      "雑損失",
      "定期預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "当座借越",
      "雑収入"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "中途解約",
      "違約金",
      "預金",
      "普通",
      "定期"
    ]
  },
  "Q_J_039": {
    "questionId": "Q_J_039",
    "primaryAccounts": [
      "定期預金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "自動継続",
      "再預入",
      "預金",
      "定期"
    ]
  },
  "Q_J_040": {
    "questionId": "Q_J_040",
    "primaryAccounts": [
      "普通預金",
      "借入金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "貸付金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "担保貸付",
      "借入金",
      "預金",
      "普通",
      "定期"
    ]
  },
  "Q_J_041": {
    "questionId": "Q_J_041",
    "primaryAccounts": [
      "定期預金",
      "為替差益"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "外貨定期預金",
      "為替差損益",
      "評価替え",
      "預金",
      "定期",
      "決算",
      "評価"
    ]
  },
  "Q_J_042": {
    "questionId": "Q_J_042",
    "primaryAccounts": [
      "普通預金",
      "定期預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "定期預金",
      "振替",
      "部分解約",
      "預金",
      "普通",
      "定期"
    ]
  },
  "Q_J_043": {
    "questionId": "Q_J_043",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品仕入",
      "現金仕入",
      "三分法",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_044": {
    "questionId": "Q_J_044",
    "primaryAccounts": [
      "仕入",
      "買掛金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "掛け仕入",
      "買掛金",
      "商品",
      "仕入",
      "掛け"
    ]
  },
  "Q_J_045": {
    "questionId": "Q_J_045",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "現金売上",
      "販売",
      "現金",
      "商品"
    ]
  },
  "Q_J_046": {
    "questionId": "Q_J_046",
    "primaryAccounts": [
      "売掛金",
      "売上"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "掛け売上",
      "売掛金",
      "商品",
      "掛け"
    ]
  },
  "Q_J_047": {
    "questionId": "Q_J_047",
    "primaryAccounts": [
      "買掛金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "買掛金支払",
      "代金決済",
      "現金",
      "商品",
      "仕入",
      "掛け"
    ]
  },
  "Q_J_048": {
    "questionId": "Q_J_048",
    "primaryAccounts": [
      "現金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "売掛金回収",
      "代金回収",
      "現金",
      "商品",
      "掛け"
    ]
  },
  "Q_J_049": {
    "questionId": "Q_J_049",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "混合取引",
      "複合仕訳",
      "現金",
      "商品",
      "仕入",
      "掛け"
    ]
  },
  "Q_J_050": {
    "questionId": "Q_J_050",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "三分法",
      "商品仕入",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_051": {
    "questionId": "Q_J_051",
    "primaryAccounts": [
      "前払金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "前受金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "前払金",
      "手付金",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_052": {
    "questionId": "Q_J_052",
    "primaryAccounts": [
      "仕入",
      "前払金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "前受金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "前払金充当",
      "代金決済",
      "現金",
      "商品"
    ]
  },
  "Q_J_053": {
    "questionId": "Q_J_053",
    "primaryAccounts": [
      "現金",
      "前受金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "前払金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "前受金",
      "手付金",
      "現金",
      "商品",
      "売上"
    ]
  },
  "Q_J_054": {
    "questionId": "Q_J_054",
    "primaryAccounts": [
      "前受金",
      "売上"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "前払金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "前受金充当",
      "代金決済",
      "現金",
      "商品"
    ]
  },
  "Q_J_055": {
    "questionId": "Q_J_055",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "分割仕入",
      "分割支払",
      "買掛金",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_056": {
    "questionId": "Q_J_056",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "分割売上",
      "分割回収",
      "売掛金",
      "現金",
      "商品",
      "売上"
    ]
  },
  "Q_J_057": {
    "questionId": "Q_J_057",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "割賦販売",
      "分割払い",
      "割賦売掛金",
      "現金",
      "商品"
    ]
  },
  "Q_J_058": {
    "questionId": "Q_J_058",
    "primaryAccounts": [
      "現金",
      "仕入"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "返品",
      "現金仕入",
      "返金",
      "品質不良",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_059": {
    "questionId": "Q_J_059",
    "primaryAccounts": [
      "買掛金",
      "仕入"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "掛け仕入",
      "買掛金",
      "規格違い",
      "商品",
      "仕入",
      "掛け"
    ]
  },
  "Q_J_060": {
    "questionId": "Q_J_060",
    "primaryAccounts": [
      "買掛金",
      "仕入"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "仕入値引き",
      "品質不良",
      "代金減額",
      "商品",
      "仕入"
    ]
  },
  "Q_J_061": {
    "questionId": "Q_J_061",
    "primaryAccounts": [
      "現金",
      "前払金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "前払金",
      "返金",
      "商品欠陥",
      "商品",
      "仕入"
    ]
  },
  "Q_J_062": {
    "questionId": "Q_J_062",
    "primaryAccounts": [
      "買掛金",
      "仕入"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "商品交換",
      "破損",
      "再販不可能",
      "商品",
      "仕入"
    ]
  },
  "Q_J_063": {
    "questionId": "Q_J_063",
    "primaryAccounts": [
      "売上",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "返品",
      "現金売上",
      "返金",
      "不良品",
      "現金",
      "商品"
    ]
  },
  "Q_J_064": {
    "questionId": "Q_J_064",
    "primaryAccounts": [
      "売上",
      "売掛金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "掛け売上",
      "売掛金",
      "サイズ違い",
      "商品",
      "掛け"
    ]
  },
  "Q_J_065": {
    "questionId": "Q_J_065",
    "primaryAccounts": [
      "売上",
      "売掛金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "売上値引き",
      "顧客クレーム",
      "色違い",
      "価格減額",
      "商品",
      "売上"
    ]
  },
  "Q_J_066": {
    "questionId": "Q_J_066",
    "primaryAccounts": [
      "前受金",
      "現金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "前受金",
      "キャンセル",
      "顧客都合",
      "商品"
    ]
  },
  "Q_J_067": {
    "questionId": "Q_J_067",
    "primaryAccounts": [
      "売上",
      "現金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "返品",
      "返品理由",
      "手数料",
      "責任区分",
      "商品",
      "売上"
    ]
  },
  "Q_J_068": {
    "questionId": "Q_J_068",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "運賃",
      "仕入諸掛り",
      "当社負担",
      "取得原価",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_069": {
    "questionId": "Q_J_069",
    "primaryAccounts": [
      "立替金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "運賃",
      "立替金",
      "先方負担",
      "債権",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_070": {
    "questionId": "Q_J_070",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "引取運賃",
      "荷役料",
      "仕入諸掛り",
      "取得原価",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_071": {
    "questionId": "Q_J_071",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "検査料",
      "仲介手数料",
      "仕入諸掛り",
      "取得原価",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_072": {
    "questionId": "Q_J_072",
    "primaryAccounts": [
      "仕入",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "商品売買",
      "輸入",
      "関税",
      "通関手数料",
      "取得原価",
      "現金",
      "商品"
    ]
  },
  "Q_J_073": {
    "questionId": "Q_J_073",
    "primaryAccounts": [
      "仕入",
      "買掛金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品売買",
      "運賃",
      "仕入諸掛り",
      "買掛金",
      "相殺決済",
      "仕入"
    ]
  },
  "Q_J_074": {
    "questionId": "Q_J_074",
    "primaryAccounts": [
      "発送費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売上戻り",
      "返品",
      "品違い",
      "現金",
      "商品"
    ]
  },
  "Q_J_075": {
    "questionId": "Q_J_075",
    "primaryAccounts": [
      "売掛金",
      "売上",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "諸掛り",
      "運送費",
      "先方負担",
      "立替金",
      "販売時諸掛り",
      "現金",
      "商品",
      "売上"
    ]
  },
  "Q_J_076": {
    "questionId": "Q_J_076",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売上",
      "現金売上",
      "販売",
      "現金",
      "商品"
    ]
  },
  "Q_J_077": {
    "questionId": "Q_J_077",
    "primaryAccounts": [
      "支払手数料",
      "現金",
      "広告宣伝費"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "諸掛り",
      "販売手数料",
      "広告宣伝費",
      "販売促進費",
      "販売費",
      "現金",
      "商品"
    ]
  },
  "Q_J_078": {
    "questionId": "Q_J_078",
    "primaryAccounts": [
      "売上",
      "売掛金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "売上戻り",
      "返品",
      "品違い",
      "商品",
      "売上"
    ]
  },
  "Q_J_079": {
    "questionId": "Q_J_079",
    "primaryAccounts": [
      "広告宣伝費",
      "商品"
    ],
    "relatedAccounts": [
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "諸掛り",
      "試用品",
      "見本品",
      "無償提供",
      "販売促進",
      "特殊取引",
      "商品"
    ]
  },
  "Q_J_080": {
    "questionId": "Q_J_080",
    "primaryAccounts": [
      "仕入",
      "繰越商品"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "買掛金",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "決算整理",
      "売上原価",
      "期首商品",
      "三分法",
      "決算振替",
      "商品",
      "仕入",
      "売上",
      "決算"
    ]
  },
  "Q_J_081": {
    "questionId": "Q_J_081",
    "primaryAccounts": [
      "仕入",
      "商品"
    ],
    "relatedAccounts": [
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "決算整理",
      "会計方法変更",
      "分記法",
      "三分法",
      "期中転換",
      "商品",
      "仕入"
    ]
  },
  "Q_J_082": {
    "questionId": "Q_J_082",
    "primaryAccounts": [
      "繰越商品",
      "仕入"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "買掛金",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "決算整理",
      "売上原価",
      "期末商品",
      "三分法",
      "決算振替",
      "商品",
      "仕入",
      "繰越商品",
      "決算"
    ]
  },
  "Q_J_083": {
    "questionId": "Q_J_083",
    "primaryAccounts": [
      "仕入",
      "買掛金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "仕入",
      "買掛金",
      "掛け仕入",
      "商品",
      "掛け"
    ]
  },
  "Q_J_084": {
    "questionId": "Q_J_084",
    "primaryAccounts": [
      "現金",
      "売上"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売上",
      "現金売上",
      "販売",
      "現金",
      "商品"
    ]
  },
  "Q_J_085": {
    "questionId": "Q_J_085",
    "primaryAccounts": [
      "買掛金",
      "仕入"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "仕入戻し",
      "返品",
      "品違い",
      "商品",
      "仕入"
    ]
  },
  "Q_J_086": {
    "questionId": "Q_J_086",
    "primaryAccounts": [
      "売上",
      "売掛金"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "売上戻り",
      "返品",
      "品違い",
      "商品",
      "売上"
    ]
  },
  "Q_J_087": {
    "questionId": "Q_J_087",
    "primaryAccounts": [
      "仕入",
      "買掛金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "仕入",
      "買掛金",
      "掛け仕入",
      "商品",
      "掛け"
    ]
  },
  "Q_J_088": {
    "questionId": "Q_J_088",
    "primaryAccounts": [
      "売掛金",
      "売上"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "売掛金",
      "掛売上",
      "信用取引",
      "売掛金管理",
      "商品",
      "掛け"
    ]
  },
  "Q_J_089": {
    "questionId": "Q_J_089",
    "primaryAccounts": [
      "現金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売掛金",
      "回収",
      "現金",
      "消込",
      "売掛金管理"
    ]
  },
  "Q_J_090": {
    "questionId": "Q_J_090",
    "primaryAccounts": [
      "現金",
      "売掛金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売掛金",
      "一部回収",
      "残高管理",
      "分割回収",
      "売掛金管理",
      "現金"
    ]
  },
  "Q_J_091": {
    "questionId": "Q_J_091",
    "primaryAccounts": [
      "受取手形",
      "売掛金"
    ],
    "relatedAccounts": [
      "買掛金",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "売掛金",
      "受取手形",
      "約束手形",
      "手形決済",
      "売掛金管理",
      "手形"
    ]
  },
  "Q_J_092": {
    "questionId": "Q_J_092",
    "primaryAccounts": [
      "買掛金",
      "売掛金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "売掛金",
      "買掛金",
      "相殺",
      "相殺決済",
      "売掛金管理"
    ]
  },
  "Q_J_093": {
    "questionId": "Q_J_093",
    "primaryAccounts": [
      "貸倒損失",
      "売掛金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "買掛金",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "売掛金",
      "貸倒れ",
      "貸倒損失",
      "回収不能",
      "売掛金管理"
    ]
  },
  "Q_J_094": {
    "questionId": "Q_J_094",
    "primaryAccounts": [
      "現金",
      "貸倒引当金戻入"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "売掛金",
      "貸倒引当金戻入",
      "償却済み債権",
      "売掛金管理"
    ]
  },
  "Q_J_095": {
    "questionId": "Q_J_095",
    "primaryAccounts": [
      "現金",
      "売掛金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "買掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "売掛金",
      "延滞利息",
      "期日管理",
      "受取利息",
      "売掛金管理",
      "現金"
    ]
  },
  "Q_J_096": {
    "questionId": "Q_J_096",
    "primaryAccounts": [
      "仕入",
      "買掛金"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "買掛金",
      "掛仕入",
      "信用取引",
      "買掛金管理",
      "商品",
      "仕入",
      "掛け"
    ]
  },
  "Q_J_097": {
    "questionId": "Q_J_097",
    "primaryAccounts": [
      "買掛金",
      "当座預金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "売掛金",
      "現金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "買掛金",
      "支払",
      "小切手",
      "消込",
      "買掛金管理"
    ]
  },
  "Q_J_098": {
    "questionId": "Q_J_098",
    "primaryAccounts": [
      "買掛金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "買掛金",
      "一部支払",
      "残高管理",
      "分割支払",
      "買掛金管理",
      "現金"
    ]
  },
  "Q_J_099": {
    "questionId": "Q_J_099",
    "primaryAccounts": [
      "買掛金",
      "支払手形"
    ],
    "relatedAccounts": [
      "売掛金",
      "受取手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "買掛金",
      "支払手形",
      "約束手形",
      "手形決済",
      "買掛金管理",
      "手形"
    ]
  },
  "Q_J_100": {
    "questionId": "Q_J_100",
    "primaryAccounts": [
      "買掛金",
      "売掛金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "買掛金",
      "売掛金",
      "相殺",
      "相殺決済",
      "買掛金管理"
    ]
  },
  "Q_J_101": {
    "questionId": "Q_J_101",
    "primaryAccounts": [],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "繰越商品",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "買掛金",
      "期日管理",
      "期日延長",
      "支払期日調整",
      "買掛金管理",
      "仕入"
    ]
  },
  "Q_J_102": {
    "questionId": "Q_J_102",
    "primaryAccounts": [
      "現金",
      "仕入"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "買掛金",
      "返品",
      "返金",
      "支払済み",
      "買掛金管理",
      "現金",
      "商品",
      "仕入"
    ]
  },
  "Q_J_103": {
    "questionId": "Q_J_103",
    "primaryAccounts": [
      "受取手形",
      "売掛金"
    ],
    "relatedAccounts": [
      "買掛金",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "受取手形",
      "約束手形",
      "売掛金",
      "手形受取",
      "手形取引",
      "手形"
    ]
  },
  "Q_J_104": {
    "questionId": "Q_J_104",
    "primaryAccounts": [
      "当座預金",
      "受取手形"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "支払手形"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "受取手形",
      "満期日",
      "決済",
      "当座預金",
      "手形取引",
      "預金",
      "当座",
      "手形"
    ]
  },
  "Q_J_105": {
    "questionId": "Q_J_105",
    "primaryAccounts": [
      "買掛金",
      "受取手形"
    ],
    "relatedAccounts": [
      "売掛金",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "受取手形",
      "裏書譲渡",
      "買掛金",
      "債権譲渡",
      "手形取引",
      "手形"
    ]
  },
  "Q_J_106": {
    "questionId": "Q_J_106",
    "primaryAccounts": [
      "当座預金",
      "受取手形",
      "手形売却損"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "支払手形"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "受取手形",
      "手形割引",
      "割引料",
      "手形売却損",
      "手形取引",
      "預金",
      "当座",
      "手形"
    ]
  },
  "Q_J_107": {
    "questionId": "Q_J_107",
    "primaryAccounts": [],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "裏書手形",
      "偶発債務",
      "決済",
      "手形取引",
      "満期日",
      "手形",
      "債務",
      "受取手形"
    ]
  },
  "Q_J_108": {
    "questionId": "Q_J_108",
    "primaryAccounts": [],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "割引手形",
      "決済",
      "借入金返済",
      "手形取引",
      "満期日",
      "手形",
      "借入",
      "受取手形"
    ]
  },
  "Q_J_109": {
    "questionId": "Q_J_109",
    "primaryAccounts": [
      "貸倒損失",
      "受取手形"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "受取手形",
      "不渡り",
      "貸倒損失",
      "手形取引",
      "回収不能",
      "手形"
    ]
  },
  "Q_J_110": {
    "questionId": "Q_J_110",
    "primaryAccounts": [
      "当座預金",
      "受取手形",
      "支払手数料"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "支払手形"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "受取手形",
      "取立依頼",
      "取立手数料",
      "手形取引",
      "銀行委託",
      "預金",
      "当座",
      "手形"
    ]
  },
  "Q_J_111": {
    "questionId": "Q_J_111",
    "primaryAccounts": [
      "買掛金",
      "支払手形"
    ],
    "relatedAccounts": [
      "売掛金",
      "受取手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "支払手形",
      "約束手形",
      "買掛金",
      "手形取引",
      "手形振出",
      "手形"
    ]
  },
  "Q_J_112": {
    "questionId": "Q_J_112",
    "primaryAccounts": [
      "支払手形",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "受取手形"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "支払手形",
      "満期日",
      "決済",
      "当座預金",
      "手形取引",
      "預金",
      "当座",
      "手形"
    ]
  },
  "Q_J_113": {
    "questionId": "Q_J_113",
    "primaryAccounts": [
      "支払手形",
      "現金",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "受取手形"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "支払手形",
      "期日前決済",
      "割引料収益",
      "手形取引",
      "受取利息",
      "現金",
      "手形"
    ]
  },
  "Q_J_114": {
    "questionId": "Q_J_114",
    "primaryAccounts": [
      "支払手形",
      "支払利息"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "支払手形",
      "更新",
      "書替え",
      "手形取引",
      "支払利息",
      "手形"
    ]
  },
  "Q_J_115": {
    "questionId": "Q_J_115",
    "primaryAccounts": [
      "支払手形",
      "買掛金",
      "支払利息"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "受取手形",
      "売掛金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "支払手形",
      "不渡り",
      "当座預金停止",
      "手形取引",
      "遅延損害金",
      "預金",
      "当座",
      "手形"
    ]
  },
  "Q_J_116": {
    "questionId": "Q_J_116",
    "primaryAccounts": [
      "支払手数料",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "受取手形",
      "紛失",
      "再発行手続き",
      "手形取引",
      "支払手数料",
      "現金",
      "手形"
    ]
  },
  "Q_J_117": {
    "questionId": "Q_J_117",
    "primaryAccounts": [
      "租税公課",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "約束手形",
      "印紙税",
      "租税公課",
      "手形取引",
      "税金",
      "現金",
      "手形"
    ]
  },
  "Q_J_118": {
    "questionId": "Q_J_118",
    "primaryAccounts": [],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "約束手形",
      "保証債務",
      "偶発債務",
      "手形取引",
      "簿外取引",
      "手形",
      "債務"
    ]
  },
  "Q_J_119": {
    "questionId": "Q_J_119",
    "primaryAccounts": [
      "貸付金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "借入金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "貸付金",
      "金銭の貸付",
      "債権",
      "貸借取引",
      "資金貸付",
      "現金"
    ]
  },
  "Q_J_120": {
    "questionId": "Q_J_120",
    "primaryAccounts": [
      "現金",
      "未収利息",
      "受取利息"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "貸付金利息",
      "未収利息",
      "受取利息",
      "貸借取引",
      "複合仕訳",
      "現金",
      "貸付"
    ]
  },
  "Q_J_121": {
    "questionId": "Q_J_121",
    "primaryAccounts": [
      "現金",
      "貸付金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "借入金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "貸付金回収",
      "満期返済",
      "一括返済",
      "貸借取引",
      "元本回収",
      "現金",
      "貸付"
    ]
  },
  "Q_J_122": {
    "questionId": "Q_J_122",
    "primaryAccounts": [
      "貸倒損失",
      "貸付金"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "貸付金貸倒れ",
      "回収不能",
      "貸倒損失",
      "貸借取引",
      "直接償却",
      "貸付"
    ]
  },
  "Q_J_123": {
    "questionId": "Q_J_123",
    "primaryAccounts": [
      "貸付金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "借入金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "役員貸付",
      "貸付金",
      "当座預金",
      "貸借取引",
      "預金",
      "当座"
    ]
  },
  "Q_J_124": {
    "questionId": "Q_J_124",
    "primaryAccounts": [
      "当座預金",
      "借入金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "貸付金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "借入金",
      "金銭借入",
      "銀行借入",
      "貸借取引",
      "運転資金",
      "預金",
      "当座"
    ]
  },
  "Q_J_125": {
    "questionId": "Q_J_125",
    "primaryAccounts": [
      "未払利息",
      "支払利息",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "借入金利息",
      "未払利息",
      "支払利息",
      "貸借取引",
      "複合仕訳",
      "現金",
      "借入"
    ]
  },
  "Q_J_126": {
    "questionId": "Q_J_126",
    "primaryAccounts": [
      "借入金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "貸付金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "借入金",
      "一括返済",
      "満期日",
      "負債消滅",
      "元本返済",
      "現金",
      "借入"
    ]
  },
  "Q_J_127": {
    "questionId": "Q_J_127",
    "primaryAccounts": [
      "借入金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "貸付金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "借入金",
      "期限前償還",
      "繰上返済",
      "負債消滅",
      "資金効率",
      "預金",
      "当座",
      "借入"
    ]
  },
  "Q_J_128": {
    "questionId": "Q_J_128",
    "primaryAccounts": [
      "借入金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [
      "貸付金"
    ],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "借入金",
      "借替え",
      "条件変更",
      "資金調達",
      "複合仕訳",
      "預金",
      "当座",
      "借入"
    ]
  },
  "Q_J_129": {
    "questionId": "Q_J_129",
    "primaryAccounts": [
      "給料",
      "未払給料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "月次給与",
      "基本給",
      "諸手当",
      "給与支払パターン",
      "総支給額計上"
    ]
  },
  "Q_J_130": {
    "questionId": "Q_J_130",
    "primaryAccounts": [
      "給料",
      "未払給料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "残業代",
      "通勤手当",
      "住宅手当",
      "諸手当",
      "給与支払パターン"
    ]
  },
  "Q_J_131": {
    "questionId": "Q_J_131",
    "primaryAccounts": [
      "未払給料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "源泉所得税",
      "天引き",
      "預り金",
      "給与支払パターン",
      "現金",
      "源泉"
    ]
  },
  "Q_J_132": {
    "questionId": "Q_J_132",
    "primaryAccounts": [
      "未払給料",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "住民税",
      "天引き",
      "預り金",
      "給与支払パターン"
    ]
  },
  "Q_J_133": {
    "questionId": "Q_J_133",
    "primaryAccounts": [
      "未払給料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "社会保険料",
      "天引き",
      "預り金",
      "給与支払パターン",
      "現金",
      "社会保険"
    ]
  },
  "Q_J_134": {
    "questionId": "Q_J_134",
    "primaryAccounts": [
      "未払給料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "給与支払",
      "雇用保険料",
      "天引き",
      "複合仕訳",
      "現金"
    ]
  },
  "Q_J_135": {
    "questionId": "Q_J_135",
    "primaryAccounts": [
      "未払給料",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "給与支払",
      "差引支給額",
      "現金支払",
      "単純交換",
      "現金",
      "源泉"
    ]
  },
  "Q_J_136": {
    "questionId": "Q_J_136",
    "primaryAccounts": [
      "給料",
      "未払給料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "給与支払",
      "未払計上",
      "発生主義",
      "翌月支払"
    ]
  },
  "Q_J_137": {
    "questionId": "Q_J_137",
    "primaryAccounts": [
      "未払賞与",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "賞与支給",
      "天引き処理",
      "複合仕訳",
      "振込支給",
      "賞与",
      "源泉",
      "社会保険"
    ]
  },
  "Q_J_138": {
    "questionId": "Q_J_138",
    "primaryAccounts": [
      "賞与",
      "未払賞与"
    ],
    "relatedAccounts": [
      "給料",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "預り金",
      "未払給料",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "社会保険料",
      "法定福利費",
      "預り金",
      "賞与",
      "決算",
      "引当"
    ]
  },
  "Q_J_139": {
    "questionId": "Q_J_139",
    "primaryAccounts": [
      "退職給付費用",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "退職金",
      "源泉徴収",
      "所得税",
      "退職所得控除",
      "源泉"
    ]
  },
  "Q_J_140": {
    "questionId": "Q_J_140",
    "primaryAccounts": [
      "役員報酬",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "役員報酬",
      "源泉徴収",
      "所得税",
      "定期同額給与",
      "預金",
      "普通",
      "源泉"
    ]
  },
  "Q_J_141": {
    "questionId": "Q_J_141",
    "primaryAccounts": [
      "法定福利費",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "社会保険料",
      "法定福利費",
      "会社負担",
      "健康保険",
      "厚生年金",
      "預金",
      "普通",
      "社会保険",
      "福利"
    ]
  },
  "Q_J_142": {
    "questionId": "Q_J_142",
    "primaryAccounts": [
      "福利厚生費",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "福利厚生費",
      "食事代補助",
      "慶弔見舞金",
      "健康診断",
      "預金",
      "普通",
      "福利"
    ]
  },
  "Q_J_143": {
    "questionId": "Q_J_143",
    "primaryAccounts": [
      "法定福利費",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "労働保険料",
      "労災保険",
      "雇用保険",
      "法定福利費",
      "預金",
      "普通"
    ]
  },
  "Q_J_144": {
    "questionId": "Q_J_144",
    "primaryAccounts": [
      "未払給料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払賞与",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "源泉所得税",
      "給与",
      "預り金",
      "源泉"
    ]
  },
  "Q_J_145": {
    "questionId": "Q_J_145",
    "primaryAccounts": [
      "預り金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "源泉所得税",
      "納付",
      "預り金清算",
      "預金",
      "当座",
      "源泉"
    ]
  },
  "Q_J_146": {
    "questionId": "Q_J_146",
    "primaryAccounts": [
      "給料",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "年末調整",
      "源泉税不足",
      "追加支給",
      "現金",
      "源泉"
    ]
  },
  "Q_J_147": {
    "questionId": "Q_J_147",
    "primaryAccounts": [
      "賞与",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "賞与",
      "源泉所得税",
      "住民税",
      "賞与税率",
      "源泉"
    ]
  },
  "Q_J_148": {
    "questionId": "Q_J_148",
    "primaryAccounts": [
      "退職金",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "退職金",
      "退職所得控除",
      "源泉税",
      "天引き",
      "現金",
      "源泉"
    ]
  },
  "Q_J_149": {
    "questionId": "Q_J_149",
    "primaryAccounts": [
      "支払手数料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "報酬",
      "士業",
      "源泉税",
      "10.21%",
      "天引き",
      "現金",
      "源泉"
    ]
  },
  "Q_J_150": {
    "questionId": "Q_J_150",
    "primaryAccounts": [
      "預り金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "源泉税",
      "納期特例",
      "年2回納付",
      "上半期",
      "預金",
      "当座",
      "源泉"
    ]
  },
  "Q_J_151": {
    "questionId": "Q_J_151",
    "primaryAccounts": [
      "預り金",
      "現金",
      "租税公課"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "源泉税",
      "延滞税",
      "附帯税",
      "租税公課",
      "納付遅延",
      "現金",
      "源泉"
    ]
  },
  "Q_J_152": {
    "questionId": "Q_J_152",
    "primaryAccounts": [
      "給料",
      "預り金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "住民税",
      "特別徴収",
      "預り金",
      "天引き",
      "給与支給",
      "預金",
      "当座"
    ]
  },
  "Q_J_153": {
    "questionId": "Q_J_153",
    "primaryAccounts": [
      "預り金",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "住民税",
      "月次納付",
      "預り金",
      "特別徴収",
      "自治体納付",
      "預金",
      "当座"
    ]
  },
  "Q_J_154": {
    "questionId": "Q_J_154",
    "primaryAccounts": [
      "給料",
      "預り金",
      "当座預金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "住民税",
      "新年度",
      "税額変更",
      "年度切替",
      "6月変更"
    ]
  },
  "Q_J_155": {
    "questionId": "Q_J_155",
    "primaryAccounts": [
      "給料",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "住民税",
      "一括徴収",
      "退職者",
      "普通徴収",
      "特別徴収",
      "現金"
    ]
  },
  "Q_J_156": {
    "questionId": "Q_J_156",
    "primaryAccounts": [
      "給料",
      "預り金"
    ],
    "relatedAccounts": [
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "社会保険料",
      "従業員負担",
      "天引き",
      "預り金",
      "社会保険"
    ]
  },
  "Q_J_157": {
    "questionId": "Q_J_157",
    "primaryAccounts": [
      "法定福利費",
      "未払金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "預り金",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "社会保険料",
      "会社負担",
      "法定福利費",
      "未払金",
      "社会保険",
      "福利"
    ]
  },
  "Q_J_158": {
    "questionId": "Q_J_158",
    "primaryAccounts": [
      "未払金",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "社会保険料",
      "納付",
      "未払金",
      "預り金",
      "現金",
      "社会保険"
    ]
  },
  "Q_J_159": {
    "questionId": "Q_J_159",
    "primaryAccounts": [
      "給料",
      "預り金"
    ],
    "relatedAccounts": [
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "標準報酬月額",
      "社会保険料",
      "改定",
      "預り金",
      "社会保険"
    ]
  },
  "Q_J_160": {
    "questionId": "Q_J_160",
    "primaryAccounts": [
      "賞与",
      "預り金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "賞与",
      "社会保険料",
      "天引き",
      "預り金",
      "社会保険"
    ]
  },
  "Q_J_161": {
    "questionId": "Q_J_161",
    "primaryAccounts": [
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "社会保険",
      "資格喪失",
      "返還",
      "現金"
    ]
  },
  "Q_J_162": {
    "questionId": "Q_J_162",
    "primaryAccounts": [
      "法定福利費",
      "預り金",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "社会保険料",
      "納付",
      "労使折半",
      "現金",
      "社会保険"
    ]
  },
  "Q_J_163": {
    "questionId": "Q_J_163",
    "primaryAccounts": [
      "法定福利費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "労働保険料",
      "雇用保険",
      "労災保険",
      "現金"
    ]
  },
  "Q_J_164": {
    "questionId": "Q_J_164",
    "primaryAccounts": [
      "法定福利費",
      "預り金",
      "普通預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "雇用保険料",
      "納付",
      "労使負担",
      "預金",
      "普通"
    ]
  },
  "Q_J_165": {
    "questionId": "Q_J_165",
    "primaryAccounts": [
      "法人税等",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "法人税",
      "納付",
      "現金"
    ]
  },
  "Q_J_166": {
    "questionId": "Q_J_166",
    "primaryAccounts": [
      "法人税等",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "法人税",
      "中間申告",
      "中間納付",
      "預金",
      "当座"
    ]
  },
  "Q_J_167": {
    "questionId": "Q_J_167",
    "primaryAccounts": [
      "法人税等",
      "租税公課",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "修正申告",
      "追徴税額",
      "延滞税",
      "現金"
    ]
  },
  "Q_J_168": {
    "questionId": "Q_J_168",
    "primaryAccounts": [
      "法人税等",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "法人税",
      "納付",
      "当座預金",
      "預金",
      "当座"
    ]
  },
  "Q_J_169": {
    "questionId": "Q_J_169",
    "primaryAccounts": [
      "法人税等",
      "当座預金"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "中間申告",
      "中間納付",
      "法人税等",
      "預金",
      "当座"
    ]
  },
  "Q_J_170": {
    "questionId": "Q_J_170",
    "primaryAccounts": [
      "法人税等",
      "未払法人税等"
    ],
    "relatedAccounts": [
      "貸倒引当金",
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "決算",
      "法人税等",
      "未払法人税等"
    ]
  },
  "Q_J_171": {
    "questionId": "Q_J_171",
    "primaryAccounts": [
      "備品",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "備品",
      "固定資産",
      "購入",
      "現金"
    ]
  },
  "Q_J_172": {
    "questionId": "Q_J_172",
    "primaryAccounts": [
      "建物",
      "未払金"
    ],
    "relatedAccounts": [
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "建物",
      "掛け購入",
      "未払金"
    ]
  },
  "Q_J_173": {
    "questionId": "Q_J_173",
    "primaryAccounts": [
      "車両運搬具",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "車両",
      "付随費用",
      "登録費用",
      "現金"
    ]
  },
  "Q_J_174": {
    "questionId": "Q_J_174",
    "primaryAccounts": [
      "建物",
      "現金",
      "未払金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "建物",
      "分割購入",
      "割賦払い",
      "現金"
    ]
  },
  "Q_J_175": {
    "questionId": "Q_J_175",
    "primaryAccounts": [
      "車両運搬具",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "中古車両",
      "耐用年数",
      "車両運搬具",
      "現金",
      "車両"
    ]
  },
  "Q_J_176": {
    "questionId": "Q_J_176",
    "primaryAccounts": [
      "車両運搬具",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "固定資産交換",
      "車両",
      "差額精算",
      "現金"
    ]
  },
  "Q_J_177": {
    "questionId": "Q_J_177",
    "primaryAccounts": [
      "建物",
      "資本金"
    ],
    "relatedAccounts": [
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "現物出資",
      "建物",
      "資本金"
    ]
  },
  "Q_J_178": {
    "questionId": "Q_J_178",
    "primaryAccounts": [
      "備品",
      "受贈益"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "無償取得",
      "備品",
      "受贈益"
    ]
  },
  "Q_J_179": {
    "questionId": "Q_J_179",
    "primaryAccounts": [
      "建設仮勘定",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "建設仮勘定",
      "工事代金",
      "建設中",
      "現金",
      "建物"
    ]
  },
  "Q_J_180": {
    "questionId": "Q_J_180",
    "primaryAccounts": [
      "建物",
      "建設仮勘定"
    ],
    "relatedAccounts": [
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "建設仮勘定",
      "建設完成",
      "本勘定振替",
      "建物",
      "固定資産"
    ]
  },
  "Q_J_181": {
    "questionId": "Q_J_181",
    "primaryAccounts": [
      "機械装置",
      "材料費",
      "労務費",
      "経費"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "自家製作",
      "固定資産",
      "製作原価",
      "機械装置",
      "材料費",
      "労務費",
      "機械"
    ]
  },
  "Q_J_182": {
    "questionId": "Q_J_182",
    "primaryAccounts": [
      "建物",
      "修繕費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "改良費",
      "修繕費",
      "資本的支出",
      "収益的支出",
      "建物",
      "区分判定",
      "現金",
      "定期"
    ]
  },
  "Q_J_183": {
    "questionId": "Q_J_183",
    "primaryAccounts": [
      "リース資産",
      "リース債務",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "リース資産",
      "ファイナンス・リース",
      "利子込み法",
      "リース債務",
      "コピー機",
      "現金"
    ]
  },
  "Q_J_184": {
    "questionId": "Q_J_184",
    "primaryAccounts": [
      "ソフトウェア",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "無形固定資産",
      "ソフトウェア",
      "取得",
      "会計ソフト",
      "現金"
    ]
  },
  "Q_J_185": {
    "questionId": "Q_J_185",
    "primaryAccounts": [
      "投資不動産",
      "借入金",
      "現金"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "支払利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "投資不動産",
      "マンション",
      "借入金",
      "賃貸収入",
      "不動産投資",
      "借入"
    ]
  },
  "Q_J_186": {
    "questionId": "Q_J_186",
    "primaryAccounts": [
      "減価償却費",
      "車両運搬具減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定額法",
      "車両運搬具",
      "決算",
      "車両",
      "償却"
    ]
  },
  "Q_J_187": {
    "questionId": "Q_J_187",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定額法",
      "月割り計算",
      "期中取得",
      "機械装置",
      "機械",
      "決算",
      "償却"
    ]
  },
  "Q_J_188": {
    "questionId": "Q_J_188",
    "primaryAccounts": [
      "減価償却費",
      "建物減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定額法",
      "残存価額",
      "建物",
      "償却可能額",
      "決算",
      "償却"
    ]
  },
  "Q_J_189": {
    "questionId": "Q_J_189",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定額法",
      "累計額",
      "帳簿価額",
      "機械装置",
      "機械",
      "償却"
    ]
  },
  "Q_J_190": {
    "questionId": "Q_J_190",
    "primaryAccounts": [
      "減価償却費",
      "車両運搬具減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "耐用年数変更",
      "定額法",
      "将来適用法",
      "車両",
      "決算",
      "償却"
    ]
  },
  "Q_J_191": {
    "questionId": "Q_J_191",
    "primaryAccounts": [
      "消耗品費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "少額減価償却資産",
      "30万円未満",
      "全額費用処理",
      "消耗品費",
      "現金",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_192": {
    "questionId": "Q_J_192",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定率法",
      "償却率",
      "機械装置",
      "第1年度",
      "機械",
      "償却"
    ]
  },
  "Q_J_193": {
    "questionId": "Q_J_193",
    "primaryAccounts": [
      "減価償却費",
      "車両運搬具減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定率法",
      "月割計算",
      "期中取得",
      "車両運搬具",
      "車両",
      "償却"
    ]
  },
  "Q_J_194": {
    "questionId": "Q_J_194",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定率法",
      "改定取得価額",
      "保証率",
      "機械装置",
      "機械",
      "償却"
    ]
  },
  "Q_J_195": {
    "questionId": "Q_J_195",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定率法",
      "償却保証額",
      "定額法切替",
      "機械装置",
      "機械",
      "償却"
    ]
  },
  "Q_J_196": {
    "questionId": "Q_J_196",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "定率法",
      "累計額",
      "帳簿価額",
      "機械装置",
      "機械",
      "償却"
    ]
  },
  "Q_J_197": {
    "questionId": "Q_J_197",
    "primaryAccounts": [
      "減価償却費",
      "機械装置減価償却累計額"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "減価償却",
      "定率法",
      "中古資産",
      "耐用年数短縮",
      "機械装置",
      "現金",
      "機械",
      "償却"
    ]
  },
  "Q_J_198": {
    "questionId": "Q_J_198",
    "primaryAccounts": [
      "減価償却費",
      "一括償却資産減価償却累計額"
    ],
    "relatedAccounts": [
      "現金",
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "一括償却資産",
      "20万円未満",
      "3年均等償却",
      "パソコン",
      "現金",
      "減価償却",
      "決算",
      "償却"
    ]
  },
  "Q_J_199": {
    "questionId": "Q_J_199",
    "primaryAccounts": [
      "消耗品費",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "少額資産",
      "10万円未満",
      "即時損金算入",
      "消耗品費",
      "現金",
      "備品"
    ]
  },
  "Q_J_200": {
    "questionId": "Q_J_200",
    "primaryAccounts": [
      "繰延資産償却費",
      "開業費"
    ],
    "relatedAccounts": [
      "貸倒引当金",
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "繰延資産",
      "開業費",
      "5年均等償却",
      "繰延資産償却費",
      "決算",
      "繰延",
      "償却"
    ]
  },
  "Q_J_201": {
    "questionId": "Q_J_201",
    "primaryAccounts": [
      "現金",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "固定資産売却益"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "固定資産売却",
      "売却益",
      "減価償却累計額",
      "帳簿価額",
      "現金",
      "車両",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_202": {
    "questionId": "Q_J_202",
    "primaryAccounts": [
      "現金",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却損"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "固定資産売却",
      "売却損",
      "減価償却累計額",
      "帳簿価額",
      "現金",
      "減価償却",
      "機械",
      "償却"
    ]
  },
  "Q_J_203": {
    "questionId": "Q_J_203",
    "primaryAccounts": [
      "減価償却費",
      "車両運搬具減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "期中売却",
      "月割り計算",
      "減価償却費",
      "売却日",
      "車両",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_204": {
    "questionId": "Q_J_204",
    "primaryAccounts": [
      "現金",
      "建物",
      "未収入金",
      "固定資産売却益"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "分割回収",
      "割賦売却",
      "未収入金",
      "売却益",
      "現金",
      "建物"
    ]
  },
  "Q_J_205": {
    "questionId": "Q_J_205",
    "primaryAccounts": [
      "車両運搬具",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "固定資産交換",
      "交換差金",
      "等価交換",
      "下取り",
      "現金",
      "車両"
    ]
  },
  "Q_J_206": {
    "questionId": "Q_J_206",
    "primaryAccounts": [
      "現金",
      "車両運搬具",
      "固定資産売却益",
      "仮受消費税"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "消費税",
      "課税売上",
      "税込価格",
      "仮受消費税",
      "現金",
      "車両"
    ]
  },
  "Q_J_207": {
    "questionId": "Q_J_207",
    "primaryAccounts": [
      "備品減価償却累計額",
      "備品",
      "固定資産除却損"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "除却",
      "除却損",
      "使用不能",
      "帳簿価額",
      "備品",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_208": {
    "questionId": "Q_J_208",
    "primaryAccounts": [
      "機械装置減価償却累計額",
      "機械装置",
      "固定資産除却損",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "廃棄",
      "処分費用",
      "解体費用",
      "除却損",
      "現金",
      "減価償却",
      "機械",
      "償却"
    ]
  },
  "Q_J_209": {
    "questionId": "Q_J_209",
    "primaryAccounts": [
      "建物減価償却累計額",
      "建物",
      "未収入金",
      "災害損失"
    ],
    "relatedAccounts": [
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "減価償却費",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "災害",
      "地震",
      "保険金",
      "災害損失",
      "特別損失",
      "建物",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_210": {
    "questionId": "Q_J_210",
    "primaryAccounts": [
      "建物減価償却累計額",
      "建物",
      "固定資産除却損",
      "現金"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "取壊し",
      "解体費用",
      "スクラップ",
      "除却損",
      "解体",
      "現金",
      "建物",
      "減価償却",
      "償却"
    ]
  },
  "Q_J_211": {
    "questionId": "Q_J_211",
    "primaryAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "貸倒引当金",
      "差額補充法",
      "売掛金",
      "引当率",
      "決算",
      "引当"
    ]
  },
  "Q_J_212": {
    "questionId": "Q_J_212",
    "primaryAccounts": [
      "貸倒引当金",
      "貸倒引当金戻入"
    ],
    "relatedAccounts": [
      "貸倒引当金繰入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "貸倒引当金",
      "戻入",
      "差額補充法",
      "引当金調整",
      "引当"
    ]
  },
  "Q_J_213": {
    "questionId": "Q_J_213",
    "primaryAccounts": [
      "貸倒引当金",
      "売掛金",
      "貸倒損失"
    ],
    "relatedAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "買掛金",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "貸倒引当金",
      "実際貸倒",
      "引当金充当",
      "不足分",
      "貸倒損失",
      "引当"
    ]
  },
  "Q_J_214": {
    "questionId": "Q_J_214",
    "primaryAccounts": [
      "現金",
      "償却債権取立益"
    ],
    "relatedAccounts": [
      "現金過不足",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑収入",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "償却債権取立益",
      "貸倒損失",
      "債権回収",
      "営業外収益",
      "現金"
    ]
  },
  "Q_J_215": {
    "questionId": "Q_J_215",
    "primaryAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "個別引当金",
      "一般引当金",
      "破綻懸念先",
      "引当率",
      "引当",
      "債権"
    ]
  },
  "Q_J_216": {
    "questionId": "Q_J_216",
    "primaryAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "貸倒引当金",
      "貸付金",
      "引当率",
      "売上債権以外",
      "引当",
      "貸付"
    ]
  },
  "Q_J_217": {
    "questionId": "Q_J_217",
    "primaryAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "貸倒実績率",
      "過去実績",
      "引当率算定",
      "差額補充法",
      "引当"
    ]
  },
  "Q_J_218": {
    "questionId": "Q_J_218",
    "primaryAccounts": [
      "貸倒引当金繰入",
      "貸倒引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "法定繰入率",
      "税法基準",
      "損金算入",
      "繰入限度額",
      "引当"
    ]
  },
  "Q_J_219": {
    "questionId": "Q_J_219",
    "primaryAccounts": [
      "賞与引当金繰入",
      "賞与引当金"
    ],
    "relatedAccounts": [
      "給料",
      "賞与",
      "法定福利費",
      "預り金",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "賞与引当金",
      "従業員賞与",
      "期間対応",
      "費用収益対応",
      "賞与",
      "決算",
      "引当"
    ]
  },
  "Q_J_220": {
    "questionId": "Q_J_220",
    "primaryAccounts": [
      "修繕引当金繰入",
      "修繕引当金"
    ],
    "relatedAccounts": [
      "貸倒引当金",
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "修繕引当金",
      "定期修繕",
      "固定資産",
      "期間配分",
      "定期",
      "機械",
      "決算",
      "引当"
    ]
  },
  "Q_J_221": {
    "questionId": "Q_J_221",
    "primaryAccounts": [
      "前払費用",
      "保険料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前受収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前払費用",
      "保険料",
      "決算整理"
    ]
  },
  "Q_J_222": {
    "questionId": "Q_J_222",
    "primaryAccounts": [
      "前払費用",
      "支払家賃"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前受収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前払費用",
      "支払家賃",
      "期間配分",
      "決算整理"
    ]
  },
  "Q_J_223": {
    "questionId": "Q_J_223",
    "primaryAccounts": [
      "前払費用",
      "支払利息"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "前受収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "前払費用",
      "支払利息",
      "借入金利息",
      "期間配分",
      "借入"
    ]
  },
  "Q_J_224": {
    "questionId": "Q_J_224",
    "primaryAccounts": [
      "前払費用",
      "広告宣伝費"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前受収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前払費用",
      "広告宣伝費",
      "期間配分",
      "決算整理"
    ]
  },
  "Q_J_225": {
    "questionId": "Q_J_225",
    "primaryAccounts": [
      "受取家賃",
      "前受収益"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前受収益",
      "受取家賃",
      "期間配分",
      "決算整理"
    ]
  },
  "Q_J_226": {
    "questionId": "Q_J_226",
    "primaryAccounts": [
      "受取利息",
      "前受収益"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前受収益",
      "受取利息",
      "貸付金利息",
      "期間配分"
    ]
  },
  "Q_J_227": {
    "questionId": "Q_J_227",
    "primaryAccounts": [
      "受取手数料",
      "前受収益"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "前払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "前受収益",
      "受取手数料",
      "サービス提供",
      "期間配分"
    ]
  },
  "Q_J_228": {
    "questionId": "Q_J_228",
    "primaryAccounts": [
      "給料",
      "未払費用"
    ],
    "relatedAccounts": [
      "賞与",
      "賞与引当金",
      "賞与引当金繰入",
      "法定福利費",
      "預り金",
      "未払給料",
      "未払賞与",
      "現金",
      "当座預金",
      "福利厚生費"
    ],
    "supplementaryAccounts": [
      "未収収益",
      "普通預金"
    ],
    "category": AccountCategory.PAYROLL,
    "keywords": [
      "未払費用",
      "給料",
      "発生主義",
      "決算整理"
    ]
  },
  "Q_J_229": {
    "questionId": "Q_J_229",
    "primaryAccounts": [
      "支払利息",
      "未払費用"
    ],
    "relatedAccounts": [
      "売掛金",
      "買掛金",
      "受取手形",
      "支払手形",
      "貸付金",
      "借入金",
      "未収金",
      "未払金",
      "立替金",
      "預り金",
      "仮払金",
      "仮受金",
      "受取利息",
      "手形売却損"
    ],
    "supplementaryAccounts": [
      "未収収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.RECEIVABLES_PAYABLES,
    "keywords": [
      "未払費用",
      "支払利息",
      "借入金利息",
      "期間対応",
      "借入"
    ]
  },
  "Q_J_230": {
    "questionId": "Q_J_230",
    "primaryAccounts": [
      "賃借料",
      "未払費用"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未収収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未払費用",
      "賃借料",
      "家賃",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_231": {
    "questionId": "Q_J_231",
    "primaryAccounts": [
      "水道光熱費",
      "未払費用"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未収収益",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未払費用",
      "水道光熱費",
      "公共料金",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_232": {
    "questionId": "Q_J_232",
    "primaryAccounts": [
      "未収収益",
      "賃貸料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未収収益",
      "賃貸料",
      "家賃",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_233": {
    "questionId": "Q_J_233",
    "primaryAccounts": [
      "未収収益",
      "受取利息"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未収収益",
      "受取利息",
      "貸付金利息",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_234": {
    "questionId": "Q_J_234",
    "primaryAccounts": [
      "未収収益",
      "受取手数料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未収収益",
      "受取手数料",
      "受託業務",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_235": {
    "questionId": "Q_J_235",
    "primaryAccounts": [
      "未収収益",
      "受取手数料"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "未払費用",
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "未収収益",
      "業務委託料",
      "受託業務",
      "期間対応",
      "発生主義"
    ]
  },
  "Q_J_236": {
    "questionId": "Q_J_236",
    "primaryAccounts": [
      "消耗品",
      "消耗品費"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "消耗品",
      "期末棚卸",
      "決算整理",
      "資産計上"
    ]
  },
  "Q_J_237": {
    "questionId": "Q_J_237",
    "primaryAccounts": [
      "材料費",
      "貯蔵品"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貯蔵品",
      "実地棚卸",
      "在庫評価",
      "材料費"
    ]
  },
  "Q_J_238": {
    "questionId": "Q_J_238",
    "primaryAccounts": [
      "製品",
      "仕掛品"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "仕掛品",
      "製造原価",
      "製品完成",
      "棚卸"
    ]
  },
  "Q_J_239": {
    "questionId": "Q_J_239",
    "primaryAccounts": [
      "棚卸減耗損",
      "繰越商品"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "期末商品棚卸",
      "実地棚卸",
      "棚卸減耗損",
      "商品減耗",
      "商品"
    ]
  },
  "Q_J_240": {
    "questionId": "Q_J_240",
    "primaryAccounts": [
      "商品評価損",
      "繰越商品"
    ],
    "relatedAccounts": [
      "商品",
      "仕入",
      "売上",
      "売掛金",
      "買掛金",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "商品評価損",
      "低価法",
      "時価評価",
      "陳腐化",
      "商品"
    ]
  },
  "Q_J_241": {
    "questionId": "Q_J_241",
    "primaryAccounts": [
      "現金過不足",
      "雑収入"
    ],
    "relatedAccounts": [
      "現金",
      "小口現金",
      "当座預金",
      "普通預金",
      "定期預金",
      "当座借越",
      "雑損失"
    ],
    "supplementaryAccounts": [],
    "category": AccountCategory.CASH_DEPOSIT,
    "keywords": [
      "現金過不足",
      "決算整理",
      "雑収入",
      "原因不明",
      "現金",
      "決算",
      "整理"
    ]
  },
  "Q_J_242": {
    "questionId": "Q_J_242",
    "primaryAccounts": [
      "当期純利益",
      "繰越利益剰余金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "当期純利益",
      "繰越利益剰余金",
      "利益処分",
      "決算"
    ]
  },
  "Q_J_243": {
    "questionId": "Q_J_243",
    "primaryAccounts": [
      "資本金",
      "引出金"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "引出金",
      "資本金",
      "個人事業主",
      "資本減少"
    ]
  },
  "Q_J_244": {
    "questionId": "Q_J_244",
    "primaryAccounts": [
      "旅費交通費",
      "仮払金",
      "会議費"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "仮払金",
      "本科目振替",
      "旅費交通費",
      "会議費",
      "内容判明"
    ]
  },
  "Q_J_245": {
    "questionId": "Q_J_245",
    "primaryAccounts": [
      "受取手数料",
      "雑収入"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "雑収入",
      "受取手数料",
      "適正科目振替",
      "内容判明"
    ]
  },
  "Q_J_246": {
    "questionId": "Q_J_246",
    "primaryAccounts": [
      "減価償却費",
      "減価償却累計額"
    ],
    "relatedAccounts": [
      "建物",
      "建物減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "土地",
      "機械装置",
      "機械装置減価償却累計額",
      "固定資産売却益",
      "固定資産売却損",
      "固定資産除却損",
      "建設仮勘定",
      "未払金",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.FIXED_ASSETS,
    "keywords": [
      "減価償却",
      "固定資産",
      "決算整理",
      "直線法",
      "建物",
      "決算",
      "償却"
    ]
  },
  "Q_J_247": {
    "questionId": "Q_J_247",
    "primaryAccounts": [
      "仕入",
      "繰越商品"
    ],
    "relatedAccounts": [
      "商品",
      "売上",
      "売掛金",
      "買掛金",
      "前払金",
      "前受金",
      "受取手形",
      "支払手形",
      "発送費",
      "保管費",
      "現金",
      "当座預金"
    ],
    "supplementaryAccounts": [
      "普通預金"
    ],
    "category": AccountCategory.MERCHANDISE,
    "keywords": [
      "売上原価",
      "棚卸",
      "三分法",
      "しくりくりし",
      "商品",
      "売上",
      "決算"
    ]
  },
  "Q_J_248": {
    "questionId": "Q_J_248",
    "primaryAccounts": [
      "法人税等",
      "未払法人税等"
    ],
    "relatedAccounts": [
      "貸倒引当金",
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "法人税",
      "決算",
      "未払",
      "税金"
    ]
  },
  "Q_J_249": {
    "questionId": "Q_J_249",
    "primaryAccounts": [
      "租税公課",
      "未払消費税"
    ],
    "relatedAccounts": [
      "貸倒引当金",
      "貸倒引当金繰入",
      "貸倒引当金戻入",
      "減価償却費",
      "前払費用",
      "前受収益",
      "未払費用",
      "未収収益",
      "売掛金",
      "受取手形",
      "保険料",
      "支払家賃",
      "受取家賃",
      "支払利息",
      "受取利息"
    ],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.SETTLEMENT,
    "keywords": [
      "消費税",
      "決算",
      "未払",
      "租税公課"
    ]
  },
  "Q_J_250": {
    "questionId": "Q_J_250",
    "primaryAccounts": [
      "圧縮損",
      "機械装置"
    ],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "圧縮記帳",
      "国庫補助金",
      "固定資産",
      "税務",
      "機械"
    ]
  },
  "Q2_V_001": {
    "questionId": "Q2_V_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "評価"
    ]
  },
  "Q2_B_001": {
    "questionId": "Q2_B_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_001": {
    "questionId": "Q2_L_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_002": {
    "questionId": "Q2_V_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "商品",
      "売上"
    ]
  },
  "Q2_L_002": {
    "questionId": "Q2_L_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_003": {
    "questionId": "Q2_V_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "現金",
      "給料"
    ]
  },
  "Q2_L_003": {
    "questionId": "Q2_L_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_004": {
    "questionId": "Q2_V_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "商品",
      "評価"
    ]
  },
  "Q2_B_004": {
    "questionId": "Q2_B_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_004": {
    "questionId": "Q2_L_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_005": {
    "questionId": "Q2_V_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算"
    ]
  },
  "Q2_B_005": {
    "questionId": "Q2_B_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_005": {
    "questionId": "Q2_L_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_006": {
    "questionId": "Q2_V_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_006": {
    "questionId": "Q2_B_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_006": {
    "questionId": "Q2_L_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_007": {
    "questionId": "Q2_V_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_007": {
    "questionId": "Q2_B_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_007": {
    "questionId": "Q2_L_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_008": {
    "questionId": "Q2_V_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "現金"
    ]
  },
  "Q2_L_008": {
    "questionId": "Q2_L_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_009": {
    "questionId": "Q2_V_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_009": {
    "questionId": "Q2_B_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_009": {
    "questionId": "Q2_L_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_010": {
    "questionId": "Q2_V_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_011": {
    "questionId": "Q2_V_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "現金",
      "決算"
    ]
  },
  "Q2_V_012": {
    "questionId": "Q2_V_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "手形",
      "引当",
      "評価",
      "債権",
      "受取手形"
    ]
  },
  "Q2_V_013": {
    "questionId": "Q2_V_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "減価償却",
      "固定資産",
      "償却",
      "評価"
    ]
  },
  "Q2_B_010": {
    "questionId": "Q2_B_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_010": {
    "questionId": "Q2_L_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_011": {
    "questionId": "Q2_B_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_011": {
    "questionId": "Q2_L_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_012": {
    "questionId": "Q2_B_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_012": {
    "questionId": "Q2_L_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_013": {
    "questionId": "Q2_B_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_013": {
    "questionId": "Q2_L_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_014": {
    "questionId": "Q2_V_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_014": {
    "questionId": "Q2_B_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_014": {
    "questionId": "Q2_L_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_015": {
    "questionId": "Q2_V_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "商品"
    ]
  },
  "Q2_L_015": {
    "questionId": "Q2_L_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_016": {
    "questionId": "Q2_V_016",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_016": {
    "questionId": "Q2_B_016",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_016": {
    "questionId": "Q2_L_016",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_017": {
    "questionId": "Q2_V_017",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算",
      "整理"
    ]
  },
  "Q2_B_017": {
    "questionId": "Q2_B_017",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_017": {
    "questionId": "Q2_L_017",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_018": {
    "questionId": "Q2_V_018",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "商品",
      "評価"
    ]
  },
  "Q2_B_018": {
    "questionId": "Q2_B_018",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_018": {
    "questionId": "Q2_L_018",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_019": {
    "questionId": "Q2_V_019",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "売買",
      "評価"
    ]
  },
  "Q2_B_019": {
    "questionId": "Q2_B_019",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_019": {
    "questionId": "Q2_L_019",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_020": {
    "questionId": "Q2_V_020",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_020": {
    "questionId": "Q2_B_020",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_L_020": {
    "questionId": "Q2_L_020",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_023": {
    "questionId": "Q2_V_023",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "整理"
    ]
  },
  "Q2_V_024": {
    "questionId": "Q2_V_024",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "現金",
      "仕入",
      "売上",
      "手形",
      "受取手形",
      "支払手形"
    ]
  },
  "Q2_V_025": {
    "questionId": "Q2_V_025",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_027": {
    "questionId": "Q2_V_027",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "整理"
    ]
  },
  "Q2_V_028": {
    "questionId": "Q2_V_028",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_029": {
    "questionId": "Q2_V_029",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_030": {
    "questionId": "Q2_V_030",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算"
    ]
  },
  "Q3_TB_001": {
    "questionId": "Q3_TB_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_002": {
    "questionId": "Q3_TB_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_003": {
    "questionId": "Q3_TB_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_004": {
    "questionId": "Q3_TB_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_005": {
    "questionId": "Q3_TB_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_006": {
    "questionId": "Q3_TB_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_007": {
    "questionId": "Q3_TB_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_008": {
    "questionId": "Q3_TB_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_009": {
    "questionId": "Q3_TB_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_010": {
    "questionId": "Q3_TB_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q3_TB_011": {
    "questionId": "Q3_TB_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "売上原価",
      "三分法",
      "繰越商品"
    ]
  },
  "Q3_TB_012": {
    "questionId": "Q3_TB_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "有価証券",
      "時価評価",
      "評価益",
      "配当金"
    ]
  },
  "Q3_TB_013": {
    "questionId": "Q3_TB_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "未収利息",
      "未払費用",
      "見越し"
    ]
  },
  "Q3_TB_014": {
    "questionId": "Q3_TB_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "仮払金",
      "仮受金",
      "精算",
      "振替処理"
    ]
  },
  "Q3_TB_015": {
    "questionId": "Q3_TB_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "消耗品",
      "費用法",
      "棚卸"
    ]
  },
  "Q3_TB_016": {
    "questionId": "Q3_TB_016",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "貸倒引当金",
      "貸倒損失",
      "引当金繰入"
    ]
  },
  "Q3_TB_017": {
    "questionId": "Q3_TB_017",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "修繕引当金",
      "引当金繰入",
      "引当金取崩"
    ]
  },
  "Q3_TB_018": {
    "questionId": "Q3_TB_018",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "減価償却",
      "定額法",
      "複数固定資産",
      "減価償却累計額"
    ]
  },
  "Q3_TB_019": {
    "questionId": "Q3_TB_019",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "手形割引",
      "貸倒引当金",
      "手形売却損",
      "売掛債権"
    ]
  },
  "Q3_TB_020": {
    "questionId": "Q3_TB_020",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "売上原価",
      "貸倒引当金",
      "減価償却",
      "総合問題"
    ]
  },
  "Q3_CTB_001": {
    "questionId": "Q3_CTB_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "差額計算"
    ]
  },
  "Q3_CTB_002": {
    "questionId": "Q3_CTB_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "売掛金",
      "買掛金"
    ]
  },
  "Q3_CTB_003": {
    "questionId": "Q3_CTB_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "費用勘定",
      "給料",
      "経費"
    ]
  },
  "Q3_CTB_004": {
    "questionId": "Q3_CTB_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "決算整理",
      "減価償却",
      "評価勘定"
    ]
  },
  "Q3_CTB_005": {
    "questionId": "Q3_CTB_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "手形",
      "手形売却損"
    ]
  },
  "Q3_CTB_006": {
    "questionId": "Q3_CTB_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "貸付金",
      "借入金",
      "受取利息"
    ]
  },
  "Q3_CTB_007": {
    "questionId": "Q3_CTB_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "決算整理",
      "貸倒引当金",
      "差額補充法"
    ]
  },
  "Q3_CTB_008": {
    "questionId": "Q3_CTB_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "前払",
      "前受",
      "期間按分"
    ]
  },
  "Q3_CTB_009": {
    "questionId": "Q3_CTB_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "決算整理",
      "三分法",
      "売上原価",
      "繰越商品"
    ]
  },
  "Q3_CTB_010": {
    "questionId": "Q3_CTB_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "未収",
      "未払",
      "経過勘定"
    ]
  },
  "Q3_CTB_011": {
    "questionId": "Q3_CTB_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "決算整理",
      "消耗品",
      "購入時費用処理法"
    ]
  },
  "Q3_CTB_012": {
    "questionId": "Q3_CTB_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "仮払金",
      "仮受金",
      "経過勘定"
    ]
  },
  "Q3_CTB_013": {
    "questionId": "Q3_CTB_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "決算整理",
      "引出金",
      "資本金",
      "当期純利益"
    ]
  },
  "Q3_CTB_014": {
    "questionId": "Q3_CTB_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "決算整理",
      "売上原価",
      "減価償却",
      "貸倒引当金",
      "複合問題"
    ]
  },
  "Q3_CTB_015": {
    "questionId": "Q3_CTB_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "合計残高試算表",
      "総合問題",
      "資産",
      "負債",
      "資本",
      "収益",
      "費用"
    ]
  },
  "Q3_FS_001": {
    "questionId": "Q3_FS_001",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "売上原価",
      "営業利益"
    ]
  },
  "Q3_FS_002": {
    "questionId": "Q3_FS_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "流動資産",
      "繰越利益剰余金"
    ]
  },
  "Q3_FS_003": {
    "questionId": "Q3_FS_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "営業外損益",
      "経常利益"
    ]
  },
  "Q3_FS_004": {
    "questionId": "Q3_FS_004",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "固定資産",
      "減価償却累計額",
      "帳簿価額"
    ]
  },
  "Q3_FS_005": {
    "questionId": "Q3_FS_005",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "特別損益",
      "法人税",
      "当期純利益"
    ]
  },
  "Q3_FS_006": {
    "questionId": "Q3_FS_006",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "流動負債",
      "買掛金",
      "支払手形",
      "比率計算"
    ]
  },
  "Q3_FS_007": {
    "questionId": "Q3_FS_007",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "売上原価",
      "売上総利益",
      "三分法"
    ]
  },
  "Q3_FS_008": {
    "questionId": "Q3_FS_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "前払費用",
      "前受収益",
      "経過勘定",
      "決算整理"
    ]
  },
  "Q3_FS_009": {
    "questionId": "Q3_FS_009",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "営業利益",
      "販売費及び一般管理費",
      "営業利益率"
    ]
  },
  "Q3_FS_010": {
    "questionId": "Q3_FS_010",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "未収収益",
      "未払費用",
      "未収利息",
      "未払利息",
      "経過勘定",
      "決算整理"
    ]
  },
  "Q3_FS_011": {
    "questionId": "Q3_FS_011",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "株主資本等変動計算書",
      "繰越利益剰余金",
      "当期純利益",
      "剰余金の配当"
    ]
  },
  "Q3_FS_012": {
    "questionId": "Q3_FS_012",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "引出金",
      "繰越利益剰余金",
      "個人事業主",
      "決算整理"
    ]
  },
  "Q3_FS_013": {
    "questionId": "Q3_FS_013",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "損益計算書",
      "複合決算整理",
      "売上原価",
      "減価償却費",
      "貸倒引当金繰入",
      "営業利益",
      "経常利益"
    ]
  },
  "Q3_FS_014": {
    "questionId": "Q3_FS_014",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "貸借対照表",
      "複合決算整理",
      "貸倒引当金",
      "減価償却累計額",
      "経過勘定",
      "純資産"
    ]
  },
  "Q3_FS_015": {
    "questionId": "Q3_FS_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": [
      "総合問題",
      "損益計算書",
      "貸借対照表",
      "財務諸表",
      "決算整理",
      "当期純利益",
      "繰越利益剰余金"
    ]
  },
  "Q2_V_021": {
    "questionId": "Q2_V_021",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_022": {
    "questionId": "Q2_V_022",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_V_026": {
    "questionId": "Q2_V_026",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_002": {
    "questionId": "Q2_B_002",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_003": {
    "questionId": "Q2_B_003",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_008": {
    "questionId": "Q2_B_008",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  },
  "Q2_B_015": {
    "questionId": "Q2_B_015",
    "primaryAccounts": [],
    "relatedAccounts": [],
    "supplementaryAccounts": [
      "現金",
      "当座預金",
      "普通預金"
    ],
    "category": AccountCategory.OTHER,
    "keywords": []
  }
};

/**
 * 生成統計情報
 */
export const GENERATION_STATS = {
  "totalQuestions": 370,
  "categoryCount": {
    "cash_deposit": 136,
    "merchandise": 27,
    "receivables_payables": 14,
    "other": 151,
    "payroll": 12,
    "settlement": 12,
    "fixed_assets": 18
  },
  "avgPrimaryAccounts": 1.5,
  "avgRelatedAccounts": 5.8
};

/**
 * カテゴリからデフォルトの関連科目を取得（自動生成版）
 */
export const getDefaultRelatedAccountsGenerated = (category: AccountCategory): string[] => {
  // 既存の手動定義とマージして使用
  // src/data/question-accounts-mapping.ts の getDefaultRelatedAccounts と統合推奨
  return [];
};
