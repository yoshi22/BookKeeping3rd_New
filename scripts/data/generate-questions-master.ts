/**
 * 問題データマスター生成スクリプト
 * problemsStrategy.mdの要件を完全に満たす問題データを生成
 */

import * as fs from "fs";
import * as path from "path";

// ========== 型定義 ==========

interface Question {
  id: string;
  category_id: "journal" | "ledger" | "trial_balance";
  question_text: string;
  answer_template_json: string;
  correct_answer_json: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
  tags_json?: string;
  created_at: string;
  updated_at: string;
}

type JournalSubCategory =
  | "cash_deposit" // 現金・預金取引（42問）
  | "sales_purchase" // 商品売買取引（45問）
  | "receivable_payable" // 債権・債務（41問）
  | "salary_tax" // 給与・税金（42問）
  | "fixed_asset" // 固定資産（40問）
  | "adjustment"; // 決算整理（40問）

type LedgerPattern =
  | "general_ledger" // 総勘定元帳（10問）
  | "subsidiary_ledger" // 補助簿（10問）
  | "voucher" // 伝票記入（10問）
  | "theory"; // 理論・選択（10問）

type TrialBalancePattern =
  | "financial_statement" // 財務諸表作成（4問）
  | "worksheet" // 精算表作成（4問）
  | "trial_balance"; // 試算表作成（4問）

interface QuestionTags {
  subcategory: string;
  pattern?: string;
  subpattern?: string;
  accounts: string[];
  keywords: string[];
  examSection: number;
  // problemsStrategy.md準拠の階層タグ
  category_layer_1?: string; // 大カテゴリー（現金・預金取引など）
  category_layer_2?: string; // 中カテゴリー（現金取引パターンなど）
  category_layer_3?: string; // 小カテゴリー（現金過不足など）
}

// ========== 設定定数 ==========

const QUESTION_TARGETS = {
  journal: {
    total: 250,
    subcategories: {
      // カテゴリー1：現金・預金取引（42問）
      cash_deposit: {
        total: 42,
        patterns: {
          // 現金取引パターン（12問）
          cash_transaction: 12,
          // 当座預金パターン（15問）  
          checking_account: 15,
          // 普通預金・定期預金パターン（15問）
          savings_deposit: 15,
        },
      },
      // カテゴリー2：商品売買取引（45問）
      sales_purchase: {
        total: 45,
        patterns: {
          // 基本売買パターン（15問）
          basic_trading: 15,
          // 返品・値引きパターン（10問）
          returns_allowances: 10,
          // 諸掛り・特殊取引パターン（12問）
          incidental_special: 12,
          // 決算関連パターン（8問）
          settlement_related: 8,
        },
      },
      // カテゴリー3：債権・債務（41問）
      receivable_payable: {
        total: 41,
        patterns: {
          // 売掛金・買掛金パターン（15問）
          accounts_receivable_payable: 15,
          // 手形取引パターン（16問）
          promissory_notes: 16,
          // 貸借取引パターン（10問）
          loans_borrowings: 10,
        },
      },
      // カテゴリー4：給与・税金（42問）
      salary_tax: {
        total: 42,
        patterns: {
          // 給与支払パターン（15問）
          salary_payment: 15,
          // 源泉徴収・住民税パターン（12問）
          withholding_tax: 12,
          // 社会保険料パターン（9問）
          social_insurance: 9,
          // 法人税等パターン（6問）
          corporate_tax: 6,
        },
      },
      // カテゴリー5：固定資産（40問）
      fixed_asset: {
        total: 40,
        patterns: {
          // 取得パターン（15問）
          asset_acquisition: 15,
          // 減価償却パターン（15問）
          depreciation: 15,
          // 売却・除却パターン（10問）
          disposal_retirement: 10,
        },
      },
      // カテゴリー6：決算整理（40問）
      adjustment: {
        total: 40,
        patterns: {
          // 引当金パターン（10問）
          allowances: 10,
          // 経過勘定パターン（15問）
          accrual_accounts: 15,
          // その他決算整理パターン（15問）
          other_adjustments: 15,
        },
      },
    },
  },
  ledger: {
    total: 40,
    patterns: {
      general_ledger: 10,
      subsidiary_ledger: 10,
      voucher: 10,
      theory: 10,
    },
  },
  trial_balance: {
    total: 12,
    patterns: {
      financial_statement: 4,
      worksheet: 4,
      trial_balance: 4,
    },
  },
};

const DIFFICULTY_DISTRIBUTION = {
  journal: {
    1: 0.35, // 35% 基礎（約88問）
    2: 0.4, // 40% 標準（約100問）
    3: 0.25, // 25% 応用（約62問）
  },
  ledger: {
    1: 0.3, // 30% 基礎（約12問）
    2: 0.4, // 40% 標準（約16問）
    3: 0.3, // 30% 応用（約12問）
  },
  trial_balance: {
    1: 0.25, // 25% 基礎（3問）
    2: 0.5, // 50% 標準（6問）
    3: 0.25, // 25% 応用（3問）
  },
};

// ========== 問題テンプレート ==========

const JOURNAL_TEMPLATES = {
  cash_deposit: {
    patterns: [
      // 現金取引パターン（12問）
      {
        name: "現金過不足_原因不明",
        template: "現金実査の結果、現金の実際有高が{amount1}円であったが、帳簿残高は{amount2}円であった。",
        accounts: ["現金過不足", "現金"],
        keywords: ["現金実査", "実際有高", "帳簿残高"],
      },
      {
        name: "現金過不足_原因判明",
        template: "現金過不足{amount}円の原因を調査したところ、通信費の支払漏れであることが判明した。",
        accounts: ["通信費", "現金過不足"],
        keywords: ["現金過不足", "原因判明", "通信費"],
      },
      {
        name: "現金過不足_決算整理",
        template: "決算において、現金過不足勘定に{amount}円の借方残高がある。",
        accounts: ["雑損", "現金過不足"],
        keywords: ["決算整理", "現金過不足", "雑損"],
      },
      {
        name: "現金実査_差額発見",
        template: "現金の帳簿残高{amount1}円に対し、実際有高は{amount2}円であった。",
        accounts: ["現金", "現金過不足"],
        keywords: ["現金実査", "帳簿残高", "実際有高"],
      },
      {
        name: "小口現金_制度設定",
        template: "小口現金制度を設定し、小口現金係に{amount}円を前渡しした。",
        accounts: ["小口現金", "現金"],
        keywords: ["小口現金", "制度設定", "前渡し"],
      },
      {
        name: "小口現金_定期補給",
        template: "小口現金の定期補給として{amount}円を追加で前渡しした。",
        accounts: ["小口現金", "現金"],
        keywords: ["小口現金", "定期補給", "インプレスト"],
      },
      {
        name: "小口現金_経費支払",
        template: "小口現金から交通費{amount}円を支払った。",
        accounts: ["交通費", "小口現金"],
        keywords: ["小口現金", "交通費", "経費支払"],
      },
      {
        name: "現金売上",
        template: "商品を{amount}円で現金販売した。",
        accounts: ["現金", "売上"],
        keywords: ["現金売上", "現金販売", "商品"],
      },
      {
        name: "現金仕入",
        template: "商品{amount}円を現金で仕入れた。",
        accounts: ["仕入", "現金"],
        keywords: ["現金仕入", "商品", "仕入"],
      },
      {
        name: "給与支払_現金",
        template: "従業員への給料{amount1}円を現金で支払った。なお、源泉所得税{amount2}円を差し引いた。",
        accounts: ["給料", "現金", "預り金"],
        keywords: ["給料", "現金支払", "源泉所得税"],
      },
      {
        name: "税金支払_現金",
        template: "固定資産税{amount}円を現金で納付した。",
        accounts: ["租税公課", "現金"],
        keywords: ["固定資産税", "租税公課", "納付"],
      },
      {
        name: "利息配当_現金",
        template: "定期預金の利息{amount}円が現金で支払われた。",
        accounts: ["現金", "受取利息"],
        keywords: ["定期預金", "利息", "受取利息"],
      },

      // 当座預金パターン（15問）
      {
        name: "当座預金_口座開設",
        template: "銀行に当座預金口座を開設し、現金{amount}円を預け入れた。",
        accounts: ["当座預金", "現金"],
        keywords: ["当座預金", "口座開設", "預け入れ"],
      },
      {
        name: "小切手振出",
        template: "買掛金{amount}円を小切手を振り出して支払った。",
        accounts: ["買掛金", "当座預金"],
        keywords: ["小切手", "買掛金", "振出"],
      },
      {
        name: "振込_当座預金",
        template: "売掛金{amount}円が当座預金口座に振り込まれた。",
        accounts: ["当座預金", "売掛金"],
        keywords: ["当座預金", "振込", "売掛金"],
      },
      {
        name: "当座預金_現金引出",
        template: "当座預金から現金{amount}円を引き出した。",
        accounts: ["現金", "当座預金"],
        keywords: ["当座預金", "現金", "引出"],
      },
      {
        name: "当座預金_振替",
        template: "普通預金{amount}円を当座預金に振り替えた。",
        accounts: ["当座預金", "普通預金"],
        keywords: ["当座預金", "普通預金", "振替"],
      },
      {
        name: "振込手数料",
        template: "振込手数料{amount}円が当座預金から自動引き落とされた。",
        accounts: ["支払手数料", "当座預金"],
        keywords: ["振込手数料", "支払手数料", "自動引落"],
      },
      {
        name: "当座借越_契約",
        template: "銀行と当座借越契約を締結し、限度額を{amount}円に設定した。",
        accounts: ["当座借越", "当座預金"],
        keywords: ["当座借越", "契約", "限度額"],
      },
      {
        name: "当座借越_発生",
        template: "当座預金残高が不足したため、小切手{amount}円の振出で当座借越となった。",
        accounts: ["買掛金", "当座借越"],
        keywords: ["当座借越", "残高不足", "小切手"],
      },
      {
        name: "当座借越_利息",
        template: "当座借越の利息{amount}円が当座預金から引き落とされた。",
        accounts: ["支払利息", "当座預金"],
        keywords: ["当座借越", "利息", "支払利息"],
      },
      {
        name: "当座借越_返済",
        template: "当座借越{amount}円を普通預金から振り替えて返済した。",
        accounts: ["当座借越", "普通預金"],
        keywords: ["当座借越", "返済", "普通預金"],
      },
      {
        name: "当座借越_預金振替",
        template: "当座借越{amount}円が当座預金の入金により解消された。",
        accounts: ["当座借越", "当座預金"],
        keywords: ["当座借越", "解消", "当座預金"],
      },
      {
        name: "当座借越_限度額変更",
        template: "当座借越の限度額を{amount}円に変更した。",
        accounts: ["当座借越", "当座預金"],
        keywords: ["当座借越", "限度額", "変更"],
      },
      {
        name: "当座預金_利息",
        template: "当座預金の利息{amount1}円が入金された。なお、源泉徴収税{amount2}円が差し引かれた。",
        accounts: ["当座預金", "受取利息", "預り金"],
        keywords: ["当座預金", "利息", "源泉徴収"],
      },
      {
        name: "銀行手数料_自動引落",
        template: "銀行手数料{amount}円が当座預金から自動引き落とされた。",
        accounts: ["支払手数料", "当座預金"],
        keywords: ["銀行手数料", "自動引落", "支払手数料"],
      },
      {
        name: "振込手数料_負担区分",
        template: "売上代金の振込で、振込手数料{amount}円を当社が負担した。",
        accounts: ["当座預金", "支払手数料", "売掛金"],
        keywords: ["振込手数料", "負担区分", "売上代金"],
      },

      // 普通預金・定期預金パターン（15問）
      {
        name: "普通預金_口座開設",
        template: "銀行に普通預金口座を開設し、現金{amount}円を預け入れた。",
        accounts: ["普通預金", "現金"],
        keywords: ["普通預金", "口座開設", "預け入れ"],
      },
      {
        name: "普通預金_引出",
        template: "普通預金から現金{amount}円を引き出した。",
        accounts: ["現金", "普通預金"],
        keywords: ["普通預金", "現金", "引出"],
      },
      {
        name: "公共料金_自動引落",
        template: "電気料金{amount}円が普通預金から自動引き落とされた。",
        accounts: ["水道光熱費", "普通預金"],
        keywords: ["電気料金", "自動引落", "水道光熱費"],
      },
      {
        name: "給与振込",
        template: "従業員への給料{amount}円を普通預金に振り込んだ。",
        accounts: ["給料", "普通預金"],
        keywords: ["給料", "給与振込", "普通預金"],
      },
      {
        name: "普通預金_利息",
        template: "普通預金の利息{amount1}円が入金された。なお、源泉徴収税{amount2}円が差し引かれた。",
        accounts: ["普通預金", "受取利息", "預り金"],
        keywords: ["普通預金", "利息", "源泉徴収"],
      },
      {
        name: "普通預金_当座振替",
        template: "普通預金{amount}円を当座預金に振り替えた。",
        accounts: ["当座預金", "普通預金"],
        keywords: ["普通預金", "当座預金", "振替"],
      },
      {
        name: "ATM手数料",
        template: "ATM手数料{amount}円が普通預金から差し引かれた。",
        accounts: ["支払手数料", "普通預金"],
        keywords: ["ATM手数料", "支払手数料", "普通預金"],
      },
      {
        name: "普通預金_口座解約",
        template: "普通預金口座を解約し、残高{amount}円を現金で受け取った。",
        accounts: ["現金", "普通預金"],
        keywords: ["口座解約", "普通預金", "現金"],
      },
      {
        name: "定期預金_預入",
        template: "普通預金から{amount}円を定期預金に預け入れた。",
        accounts: ["定期預金", "普通預金"],
        keywords: ["定期預金", "預入", "普通預金"],
      },
      {
        name: "定期預金_満期解約",
        template: "定期預金{amount1}円が満期となり、利息{amount2}円とともに普通預金に入金された。",
        accounts: ["普通預金", "定期預金", "受取利息"],
        keywords: ["定期預金", "満期", "利息"],
      },
      {
        name: "定期預金_中途解約",
        template: "定期預金{amount1}円を中途解約し、違約金{amount2}円を差し引かれた。",
        accounts: ["普通預金", "雑損", "定期預金"],
        keywords: ["定期預金", "中途解約", "違約金"],
      },
      {
        name: "自動継続定期",
        template: "定期預金{amount}円が自動継続された。",
        accounts: ["定期預金", "普通預金"],
        keywords: ["定期預金", "自動継続", "更新"],
      },
      {
        name: "定期預金担保貸付",
        template: "定期預金を担保に{amount}円を借り入れた。",
        accounts: ["普通預金", "借入金"],
        keywords: ["定期預金", "担保", "借入金"],
      },
      {
        name: "外貨定期_為替差益",
        template: "外貨定期預金の解約により、為替差益{amount}円が発生した。",
        accounts: ["普通預金", "為替差益"],
        keywords: ["外貨定期", "為替差益", "解約"],
      },
      {
        name: "定期預金_振替",
        template: "定期預金{amount}円を普通預金に振り替えた。",
        accounts: ["普通預金", "定期預金"],
        keywords: ["定期預金", "普通預金", "振替"],
      },
    ],
  },
  sales_purchase: {
    patterns: [
      // 基本売買パターン（15問）
      {
        name: "商品現金仕入",
        template: "商品{amount}円を現金で仕入れた。",
        accounts: ["仕入", "現金"],
        keywords: ["仕入", "現金", "商品"],
      },
      {
        name: "商品掛仕入",
        template: "商品{amount}円を掛けで仕入れた。",
        accounts: ["仕入", "買掛金"],
        keywords: ["仕入", "買掛金", "掛け"],
      },
      {
        name: "商品現金売上",
        template: "商品を{amount}円で現金販売した。",
        accounts: ["現金", "売上"],
        keywords: ["売上", "現金", "販売"],
      },
      {
        name: "商品掛売上",
        template: "商品を{amount}円で掛け販売した。",
        accounts: ["売掛金", "売上"],
        keywords: ["売上", "売掛金", "掛け"],
      },
      {
        name: "買掛金支払",
        template: "買掛金{amount}円を現金で支払った。",
        accounts: ["買掛金", "現金"],
        keywords: ["買掛金", "支払", "現金"],
      },
      {
        name: "売掛金回収",
        template: "売掛金{amount}円を現金で回収した。",
        accounts: ["現金", "売掛金"],
        keywords: ["売掛金", "回収", "現金"],
      },
      {
        name: "混合取引_仕入",
        template: "商品{amount1}円を仕入れ、代金の一部{amount2}円を現金で支払い、残額は掛けとした。",
        accounts: ["仕入", "現金", "買掛金"],
        keywords: ["仕入", "混合取引", "現金掛け"],
      },
      {
        name: "三分法_商品勘定",
        template: "三分法により商品{amount}円を仕入勘定で処理した。",
        accounts: ["仕入", "現金"],
        keywords: ["三分法", "仕入勘定", "商品"],
      },
      {
        name: "前払金_仕入",
        template: "商品の仕入れに際し、前払金として{amount}円を支払った。",
        accounts: ["前払金", "現金"],
        keywords: ["前払金", "仕入", "支払"],
      },
      {
        name: "前払金決済_仕入",
        template: "前払金{amount1}円を支払済みの商品{amount2}円を受け取り、残額を現金で支払った。",
        accounts: ["仕入", "前払金", "現金"],
        keywords: ["前払金", "決済", "仕入"],
      },
      {
        name: "前受金_売上",
        template: "商品の販売に際し、前受金として{amount}円を受け取った。",
        accounts: ["現金", "前受金"],
        keywords: ["前受金", "売上", "受取"],
      },
      {
        name: "前受金決済_売上",
        template: "前受金{amount1}円を受取済みの商品{amount2}円を引き渡し、残額を現金で受け取った。",
        accounts: ["現金", "前受金", "売上"],
        keywords: ["前受金", "決済", "売上"],
      },
      {
        name: "分割仕入",
        template: "商品{amount}円を分割で仕入れ、第1回分として現金で支払った。",
        accounts: ["仕入", "現金"],
        keywords: ["分割仕入", "分割払", "第1回"],
      },
      {
        name: "分割売上",
        template: "商品を{amount}円で分割販売し、第1回分として現金で受け取った。",
        accounts: ["現金", "売上"],
        keywords: ["分割売上", "分割", "第1回"],
      },
      {
        name: "割賦販売",
        template: "商品を{amount}円で割賦販売し、手付金として現金を受け取った。",
        accounts: ["現金", "売上"],
        keywords: ["割賦販売", "手付金", "現金"],
      },

      // 返品・値引きパターン（10問）
      {
        name: "現金仕入返品",
        template: "現金で仕入れた商品のうち{amount}円分を品違いのため返品し、返金を受けた。",
        accounts: ["現金", "仕入"],
        keywords: ["仕入返品", "品違い", "返金"],
      },
      {
        name: "掛仕入返品",
        template: "掛けで仕入れた商品のうち{amount}円分を品質不良のため返品した。",
        accounts: ["買掛金", "仕入"],
        keywords: ["仕入返品", "品質不良", "買掛金"],
      },
      {
        name: "仕入値引",
        template: "仕入れた商品が品質不良のため、{amount}円の値引きを受けた。",
        accounts: ["買掛金", "仕入"],
        keywords: ["仕入値引", "品質不良", "値引"],
      },
      {
        name: "前払金仕入返品",
        template: "前払金を支払済みの商品{amount}円分を返品し、前払金を回収した。",
        accounts: ["現金", "前払金"],
        keywords: ["前払金", "仕入返品", "回収"],
      },
      {
        name: "仕入返品_再販可能",
        template: "仕入返品した商品{amount}円は再販可能として処理した。",
        accounts: ["商品", "仕入"],
        keywords: ["仕入返品", "再販可能", "商品"],
      },
      {
        name: "現金売上返品",
        template: "現金で販売した商品のうち{amount}円分が返品され、返金した。",
        accounts: ["売上", "現金"],
        keywords: ["売上返品", "返品", "返金"],
      },
      {
        name: "掛売上返品",
        template: "掛けで販売した商品のうち{amount}円分が返品された。",
        accounts: ["売上", "売掛金"],
        keywords: ["売上返品", "返品", "売掛金"],
      },
      {
        name: "売上値引",
        template: "販売した商品にクレームがあったため、{amount}円の値引きを行った。",
        accounts: ["売上", "売掛金"],
        keywords: ["売上値引", "クレーム", "値引"],
      },
      {
        name: "前受金売上返品",
        template: "前受金を受取済みの商品{amount}円分が返品され、前受金を返金した。",
        accounts: ["前受金", "現金"],
        keywords: ["前受金", "売上返品", "返金"],
      },
      {
        name: "売上返品_理由別",
        template: "配送ミスによる売上返品{amount}円を処理した。",
        accounts: ["売上", "現金"],
        keywords: ["売上返品", "配送ミス", "理由別"],
      },

      // 諸掛り・特殊取引パターン（12問）
      {
        name: "仕入諸掛_当社負担",
        template: "商品{amount1}円を仕入れ、引取運賃{amount2}円（当社負担）を現金で支払った。",
        accounts: ["仕入", "現金"],
        keywords: ["仕入諸掛", "引取運賃", "当社負担"],
      },
      {
        name: "仕入諸掛_先方負担立替",
        template: "商品仕入時に運賃{amount}円（先方負担）を立て替えて支払った。",
        accounts: ["立替金", "現金"],
        keywords: ["仕入諸掛", "先方負担", "立替金"],
      },
      {
        name: "引取運賃",
        template: "商品の引取運賃{amount}円を現金で支払った。",
        accounts: ["仕入", "現金"],
        keywords: ["引取運賃", "仕入", "運賃"],
      },
      {
        name: "仕入関連手数料",
        template: "商品仕入に関連する検査料{amount}円を現金で支払った。",
        accounts: ["仕入", "現金"],
        keywords: ["検査料", "仕入関連", "手数料"],
      },
      {
        name: "輸入関税",
        template: "輸入商品の関税{amount}円を現金で納付した。",
        accounts: ["仕入", "現金"],
        keywords: ["関税", "輸入", "納付"],
      },
      {
        name: "仕入諸掛_掛決済",
        template: "商品{amount1}円と運賃{amount2}円を合わせて掛けで仕入れた。",
        accounts: ["仕入", "買掛金"],
        keywords: ["仕入諸掛", "運賃", "掛け決済"],
      },
      {
        name: "売上諸掛_当社負担",
        template: "商品販売に伴う配送費{amount}円を現金で支払った。",
        accounts: ["販売費", "現金"],
        keywords: ["配送費", "販売費", "当社負担"],
      },
      {
        name: "売上諸掛_先方負担",
        template: "商品{amount1}円を販売し、配送費{amount2}円は顧客負担として売上に加算した。",
        accounts: ["売掛金", "売上"],
        keywords: ["配送費", "先方負担", "売上加算"],
      },
      {
        name: "梱包費",
        template: "商品の梱包費{amount}円を現金で支払った。",
        accounts: ["販売費", "現金"],
        keywords: ["梱包費", "販売費", "梱包"],
      },
      {
        name: "広告宣伝費",
        template: "商品販売に関する広告宣伝費{amount}円を現金で支払った。",
        accounts: ["広告宣伝費", "現金"],
        keywords: ["広告宣伝費", "販売", "広告"],
      },
      {
        name: "委託販売",
        template: "商品{amount}円を委託販売のため発送した。",
        accounts: ["積送品", "仕入"],
        keywords: ["委託販売", "積送品", "発送"],
      },
      {
        name: "試用販売",
        template: "商品{amount}円を試用販売として顧客に発送した。",
        accounts: ["試用品", "仕入"],
        keywords: ["試用販売", "試用品", "顧客"],
      },

      // 決算関連パターン（8問）
      {
        name: "売上原価_対立法",
        template: "決算において、期首商品{amount1}円を仕入に振り替え、期末商品{amount2}円を仕入から控除した。",
        accounts: ["仕入", "繰越商品"],
        keywords: ["売上原価", "対立法", "期首商品"],
      },
      {
        name: "分記法転換",
        template: "分記法から三分法に転換するため、商品勘定{amount}円を仕入勘定に振り替えた。",
        accounts: ["仕入", "商品"],
        keywords: ["分記法", "三分法", "転換"],
      },
      {
        name: "商品決算振替",
        template: "決算において、繰越商品勘定を使用して売上原価を算定した。期末商品{amount}円。",
        accounts: ["繰越商品", "仕入"],
        keywords: ["決算振替", "繰越商品", "売上原価"],
      },
      {
        name: "月次売上原価",
        template: "月次決算において、売上原価{amount}円を算定・調整した。",
        accounts: ["売上原価", "商品"],
        keywords: ["月次決算", "売上原価", "調整"],
      },
      {
        name: "期末棚卸",
        template: "実地棚卸により、期末商品棚卸高{amount}円を計上した。",
        accounts: ["商品", "仕入"],
        keywords: ["実地棚卸", "期末商品", "棚卸高"],
      },
      {
        name: "商品評価損",
        template: "低価法の適用により、商品評価損{amount}円を計上した。",
        accounts: ["商品評価損", "商品"],
        keywords: ["低価法", "商品評価損", "評価"],
      },
      {
        name: "商品廃棄損",
        template: "商品の廃棄により廃棄損{amount}円が発生した。",
        accounts: ["商品廃棄損", "商品"],
        keywords: ["商品廃棄", "廃棄損", "損失"],
      },
      {
        name: "季節商品評価減",
        template: "季節商品の評価減{amount}円を見切り販売損として計上した。",
        accounts: ["見切販売損", "商品"],
        keywords: ["季節商品", "評価減", "見切販売"],
      },
    ],
  },
  receivable_payable: {
    patterns: [
      // 売掛金・買掛金パターン（15問）
      {
        name: "売掛金発生",
        template: "商品を{amount}円で掛け販売した。",
        accounts: ["売掛金", "売上"],
        keywords: ["売掛金", "掛け販売", "発生"],
      },
      {
        name: "売掛金回収",
        template: "売掛金{amount}円を現金で回収した。",
        accounts: ["現金", "売掛金"],
        keywords: ["売掛金", "回収", "現金"],
      },
      {
        name: "売掛金一部回収",
        template: "売掛金のうち{amount}円を現金で回収し、残額は次月回収予定とした。",
        accounts: ["現金", "売掛金"],
        keywords: ["売掛金", "一部回収", "残額"],
      },
      {
        name: "売掛金手形決済",
        template: "売掛金{amount}円の代金として約束手形を受け取った。",
        accounts: ["受取手形", "売掛金"],
        keywords: ["売掛金", "手形決済", "約束手形"],
      },
      {
        name: "売掛買掛相殺",
        template: "売掛金と買掛金を相殺し、差額{amount}円を現金で受け取った。",
        accounts: ["現金", "買掛金", "売掛金"],
        keywords: ["相殺決済", "売掛金", "買掛金"],
      },
      {
        name: "売掛金貸倒",
        template: "売掛金{amount}円が回収不能となり、貸倒損失として処理した。",
        accounts: ["貸倒損失", "売掛金"],
        keywords: ["売掛金", "貸倒", "回収不能"],
      },
      {
        name: "貸倒取消",
        template: "既に貸倒処理した売掛金{amount}円が回収された。",
        accounts: ["現金", "償却債権取立益"],
        keywords: ["貸倒取消", "回収", "償却債権取立益"],
      },
      {
        name: "売掛金延滞",
        template: "売掛金{amount}円の回収期限が延滞したため、延滞利息を請求した。",
        accounts: ["売掛金", "受取利息"],
        keywords: ["売掛金", "延滞", "延滞利息"],
      },
      {
        name: "買掛金発生",
        template: "商品{amount}円を掛けで仕入れた。",
        accounts: ["仕入", "買掛金"],
        keywords: ["買掛金", "掛け仕入", "発生"],
      },
      {
        name: "買掛金支払",
        template: "買掛金{amount}円を現金で支払った。",
        accounts: ["買掛金", "現金"],
        keywords: ["買掛金", "支払", "現金"],
      },
      {
        name: "買掛金一部支払",
        template: "買掛金のうち{amount}円を現金で支払い、残額は翌月支払予定とした。",
        accounts: ["買掛金", "現金"],
        keywords: ["買掛金", "一部支払", "残額"],
      },
      {
        name: "買掛金手形決済",
        template: "買掛金{amount}円の支払いのため約束手形を振り出した。",
        accounts: ["買掛金", "支払手形"],
        keywords: ["買掛金", "手形決済", "約束手形"],
      },
      {
        name: "買掛金期限調整",
        template: "買掛金{amount}円の支払期限を延長し、延滞利息を支払った。",
        accounts: ["買掛金", "支払利息", "現金"],
        keywords: ["買掛金", "期限延長", "延滞利息"],
      },
      {
        name: "買掛金返品調整",
        template: "支払済み買掛金の商品{amount}円分を返品し、返金を受けた。",
        accounts: ["現金", "仕入"],
        keywords: ["買掛金", "返品調整", "返金"],
      },
      {
        name: "買掛金相殺",
        template: "当社の買掛金と先方の売掛金を相殺し、差額を調整した。",
        accounts: ["買掛金", "売掛金"],
        keywords: ["買掛金", "相殺", "調整"],
      },

      // 手形取引パターン（16問）
      {
        name: "約束手形受取",
        template: "売掛金{amount}円の代金として約束手形を受け取った。",
        accounts: ["受取手形", "売掛金"],
        keywords: ["約束手形", "受取", "売掛金"],
      },
      {
        name: "受取手形決済",
        template: "受取手形{amount}円が満期日に決済され、当座預金に入金された。",
        accounts: ["当座預金", "受取手形"],
        keywords: ["受取手形", "満期決済", "当座預金"],
      },
      {
        name: "手形裏書譲渡",
        template: "受取手形{amount}円を買掛金の支払いに裏書譲渡した。",
        accounts: ["買掛金", "受取手形"],
        keywords: ["裏書譲渡", "買掛金", "債権譲渡"],
      },
      {
        name: "手形割引",
        template: "受取手形{amount1}円を銀行で割り引き、手形割引料{amount2}円を差し引かれた。",
        accounts: ["当座預金", "手形割引料", "受取手形"],
        keywords: ["手形割引", "割引料", "銀行"],
      },
      {
        name: "裏書手形決済",
        template: "裏書譲渡した手形{amount}円が決済され、偶発債務が消滅した。",
        accounts: ["受取手形", "買掛金"],
        keywords: ["裏書手形", "決済", "偶発債務"],
      },
      {
        name: "割引手形決済",
        template: "割り引いた手形{amount}円が決済され、借入金が返済された。",
        accounts: ["借入金", "受取手形"],
        keywords: ["割引手形", "決済", "借入金返済"],
      },
      {
        name: "受取手形不渡",
        template: "受取手形{amount}円が不渡りとなり、貸倒損失として処理した。",
        accounts: ["貸倒損失", "受取手形"],
        keywords: ["受取手形", "不渡り", "貸倒損失"],
      },
      {
        name: "手形取立依頼",
        template: "受取手形{amount1}円の取立を銀行に依頼し、取立手数料{amount2}円を支払った。",
        accounts: ["当座預金", "支払手数料", "受取手形"],
        keywords: ["手形取立", "取立手数料", "銀行"],
      },
      {
        name: "約束手形振出",
        template: "買掛金{amount}円の支払いのため約束手形を振り出した。",
        accounts: ["買掛金", "支払手形"],
        keywords: ["約束手形", "振出", "買掛金"],
      },
      {
        name: "支払手形決済",
        template: "支払手形{amount}円が満期日に決済され、当座預金から支払われた。",
        accounts: ["支払手形", "当座預金"],
        keywords: ["支払手形", "満期決済", "当座預金"],
      },
      {
        name: "手形期日前決済",
        template: "支払手形{amount1}円を期日前に決済し、割引料{amount2}円の収益が発生した。",
        accounts: ["支払手形", "現金", "受取利息"],
        keywords: ["期日前決済", "割引料", "収益"],
      },
      {
        name: "手形書替",
        template: "支払手形{amount1}円を更新し、利息{amount2}円を現金で支払った。",
        accounts: ["支払手形", "支払利息", "現金"],
        keywords: ["手形更新", "書替え", "利息"],
      },
      {
        name: "支払手形不渡",
        template: "支払手形{amount}円が不渡りとなり、当座預金取引が停止された。",
        accounts: ["支払手形", "当座預金"],
        keywords: ["支払手形", "不渡り", "取引停止"],
      },
      {
        name: "手形紛失再発行",
        template: "紛失した手形の再発行手続きで手数料{amount}円を支払った。",
        accounts: ["支払手数料", "現金"],
        keywords: ["手形紛失", "再発行", "手数料"],
      },
      {
        name: "手形印紙税",
        template: "約束手形振出時の印紙税{amount}円を現金で支払った。",
        accounts: ["租税公課", "現金"],
        keywords: ["手形", "印紙税", "租税公課"],
      },
      {
        name: "手形保証債務",
        template: "手形の保証をし、偶発債務{amount}円を注記した。",
        accounts: ["保証債務", "保証債務見返"],
        keywords: ["手形保証", "偶発債務", "保証"],
      },

      // 貸借取引パターン（10問）
      {
        name: "金銭貸付",
        template: "取引先に金銭{amount}円を貸し付けた。",
        accounts: ["貸付金", "現金"],
        keywords: ["貸付金", "金銭", "貸付"],
      },
      {
        name: "貸付金利息受取",
        template: "貸付金の利息{amount}円を現金で受け取った。",
        accounts: ["現金", "受取利息"],
        keywords: ["貸付金", "利息", "受取利息"],
      },
      {
        name: "貸付金一括返済",
        template: "貸付金{amount}円が一括返済され、現金で受け取った。",
        accounts: ["現金", "貸付金"],
        keywords: ["貸付金", "一括返済", "現金"],
      },
      {
        name: "貸付金貸倒",
        template: "貸付金{amount}円が回収不能となり、貸倒損失として処理した。",
        accounts: ["貸倒損失", "貸付金"],
        keywords: ["貸付金", "貸倒", "回収不能"],
      },
      {
        name: "役員貸付金",
        template: "役員に対する貸付金{amount}円を現金で実行した。",
        accounts: ["役員貸付金", "現金"],
        keywords: ["役員貸付金", "役員", "貸付"],
      },
      {
        name: "金銭借入",
        template: "銀行から{amount}円を借り入れ、当座預金に入金された。",
        accounts: ["当座預金", "借入金"],
        keywords: ["借入金", "金銭", "銀行"],
      },
      {
        name: "借入金利息支払",
        template: "借入金の利息{amount}円を現金で支払った。",
        accounts: ["支払利息", "現金"],
        keywords: ["借入金", "利息", "支払利息"],
      },
      {
        name: "借入金一括返済",
        template: "借入金{amount}円を一括返済し、当座預金から支払った。",
        accounts: ["借入金", "当座預金"],
        keywords: ["借入金", "一括返済", "当座預金"],
      },
      {
        name: "借入金繰上返済",
        template: "借入金{amount1}円を期限前に返済し、経過利息{amount2}円を支払った。",
        accounts: ["借入金", "支払利息", "当座預金"],
        keywords: ["借入金", "繰上返済", "経過利息"],
      },
      {
        name: "借入金借替",
        template: "借入金{amount}円を他行からの借入で借り替えた。",
        accounts: ["借入金", "借入金"],
        keywords: ["借入金", "借替え", "条件変更"],
      },
    ],
  },
  salary_tax: {
    patterns: [
      // 給与支払パターン（15問）
      {
        name: "月次給与_基本",
        template: "従業員への給料{amount1}円を支給し、源泉所得税{amount2}円を差し引いた。",
        accounts: ["給料", "現金", "預り金"],
        keywords: ["給料", "源泉所得税", "預り金"],
      },
      {
        name: "基本給_諸手当",
        template: "基本給{amount1}円と残業代{amount2}円の合計を給料として支給した。",
        accounts: ["給料", "現金"],
        keywords: ["基本給", "残業代", "諸手当"],
      },
      {
        name: "源泉所得税",
        template: "給料支払時に源泉所得税{amount}円を差し引いた。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["源泉所得税", "天引き", "預り金"],
      },
      {
        name: "住民税天引",
        template: "給料支払時に住民税{amount}円を差し引いた。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["住民税", "天引き", "預り金"],
      },
      {
        name: "社会保険料_従業員",
        template: "給料支払時に社会保険料（従業員負担分）{amount}円を差し引いた。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["社会保険料", "従業員負担", "預り金"],
      },
      {
        name: "雇用保険料_従業員",
        template: "給料支払時に雇用保険料（従業員負担分）{amount}円を差し引いた。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["雇用保険料", "従業員負担", "預り金"],
      },
      {
        name: "差引支給額",
        template: "給料の差引支給額{amount}円を普通預金に振り込んだ。",
        accounts: ["給料", "普通預金"],
        keywords: ["差引支給額", "振込", "普通預金"],
      },
      {
        name: "未払給料",
        template: "当月分給料{amount}円を翌月支払いとして未払計上した。",
        accounts: ["給料", "未払金"],
        keywords: ["未払給料", "翌月支払", "未払金"],
      },
      {
        name: "賞与支給",
        template: "従業員に賞与{amount1}円を支給し、各種控除{amount2}円を差し引いた。",
        accounts: ["賞与", "現金", "預り金"],
        keywords: ["賞与", "控除", "預り金"],
      },
      {
        name: "決算賞与",
        template: "決算賞与{amount}円を未払計上し、引当金を設定した。",
        accounts: ["賞与", "賞与引当金"],
        keywords: ["決算賞与", "未払計上", "引当金"],
      },
      {
        name: "退職金支給",
        template: "退職者に退職金{amount1}円を支給し、退職所得控除後の源泉税{amount2}円を差し引いた。",
        accounts: ["退職金", "現金", "預り金"],
        keywords: ["退職金", "退職所得控除", "源泉税"],
      },
      {
        name: "役員報酬",
        template: "役員報酬{amount1}円を支給し、源泉所得税{amount2}円を差し引いた。",
        accounts: ["役員報酬", "現金", "預り金"],
        keywords: ["役員報酬", "源泉所得税", "役員"],
      },
      {
        name: "法定福利費",
        template: "社会保険料の会社負担分{amount}円を法定福利費として計上した。",
        accounts: ["法定福利費", "未払金"],
        keywords: ["法定福利費", "会社負担", "社会保険料"],
      },
      {
        name: "福利厚生費",
        template: "従業員の食事代補助{amount}円を福利厚生費として支払った。",
        accounts: ["福利厚生費", "現金"],
        keywords: ["福利厚生費", "食事代補助", "従業員"],
      },
      {
        name: "労働保険料",
        template: "労災保険料と雇用保険料の会社負担分{amount}円を計上した。",
        accounts: ["法定福利費", "未払金"],
        keywords: ["労働保険料", "労災保険", "雇用保険"],
      },

      // 源泉徴収・住民税パターン（12問）
      {
        name: "源泉税_給与天引",
        template: "給料から源泉所得税{amount}円を天引きし、預り金に計上した。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["源泉所得税", "天引き", "預り金"],
      },
      {
        name: "源泉税_月次納付",
        template: "源泉所得税{amount}円を税務署に納付し、預り金を消込んだ。",
        accounts: ["預り金", "現金"],
        keywords: ["源泉所得税", "月次納付", "消込"],
      },
      {
        name: "年末調整_過不足",
        template: "年末調整により源泉税の過納額{amount}円を従業員に還付した。",
        accounts: ["現金", "預り金"],
        keywords: ["年末調整", "過納", "還付"],
      },
      {
        name: "賞与_源泉税",
        template: "賞与から源泉所得税{amount}円（賞与税率適用）を天引きした。",
        accounts: ["賞与", "預り金", "現金"],
        keywords: ["賞与", "源泉税", "賞与税率"],
      },
      {
        name: "退職金_源泉税",
        template: "退職金から源泉所得税{amount}円（退職所得控除後）を天引きした。",
        accounts: ["退職金", "預り金", "現金"],
        keywords: ["退職金", "源泉税", "退職所得控除"],
      },
      {
        name: "報酬_源泉税",
        template: "外注費{amount1}円の支払時に源泉所得税{amount2}円（10.21%）を天引きした。",
        accounts: ["外注費", "預り金", "現金"],
        keywords: ["報酬", "外注費", "10.21%"],
      },
      {
        name: "納期特例",
        template: "納期特例により源泉所得税{amount}円を年2回納付で処理した。",
        accounts: ["預り金", "現金"],
        keywords: ["納期特例", "年2回納付", "源泉税"],
      },
      {
        name: "源泉税_延滞税",
        template: "源泉所得税の納付遅延により延滞税{amount}円を支払った。",
        accounts: ["租税公課", "現金"],
        keywords: ["源泉税", "延滞税", "納付遅延"],
      },
      {
        name: "住民税_給与天引",
        template: "給料から住民税{amount}円を天引きし、預り金に計上した。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["住民税", "天引き", "預り金"],
      },
      {
        name: "住民税_月次納付",
        template: "住民税{amount}円を市町村に納付し、預り金を消込んだ。",
        accounts: ["預り金", "現金"],
        keywords: ["住民税", "月次納付", "市町村"],
      },
      {
        name: "住民税_年度変更",
        template: "新年度の住民税額変更により、差額{amount}円を調整した。",
        accounts: ["預り金", "現金"],
        keywords: ["住民税", "年度変更", "調整"],
      },
      {
        name: "住民税_退職者",
        template: "退職者の住民税{amount}円を一括徴収し、普通徴収に切り替えた。",
        accounts: ["預り金", "現金"],
        keywords: ["住民税", "退職者", "普通徴収"],
      },

      // 社会保険料パターン（9問）
      {
        name: "健康保険_従業員負担",
        template: "健康保険料の従業員負担分{amount}円を給料から天引きした。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["健康保険料", "従業員負担", "天引き"],
      },
      {
        name: "厚生年金_従業員負担",
        template: "厚生年金保険料の従業員負担分{amount}円を給料から天引きした。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["厚生年金", "従業員負担", "天引き"],
      },
      {
        name: "社会保険料_会社負担",
        template: "社会保険料の会社負担分{amount}円を法定福利費として計上した。",
        accounts: ["法定福利費", "未払金"],
        keywords: ["社会保険料", "会社負担", "法定福利費"],
      },
      {
        name: "社会保険料_納付",
        template: "社会保険料{amount1}円（従業員負担{amount2}円、会社負担{amount3}円）を納付した。",
        accounts: ["預り金", "未払金", "現金"],
        keywords: ["社会保険料", "納付", "従業員会社負担"],
      },
      {
        name: "標準報酬改定",
        template: "標準報酬月額の変更により、社会保険料{amount}円を調整した。",
        accounts: ["法定福利費", "預り金"],
        keywords: ["標準報酬", "月額変更", "保険料改定"],
      },
      {
        name: "賞与_社会保険料",
        template: "賞与から社会保険料{amount}円（特別保険料）を天引きした。",
        accounts: ["賞与", "預り金", "現金"],
        keywords: ["賞与", "社会保険料", "特別保険料"],
      },
      {
        name: "労災保険料",
        template: "労災保険料{amount}円を全額会社負担として法定福利費に計上した。",
        accounts: ["法定福利費", "未払金"],
        keywords: ["労災保険料", "全額会社負担", "法定福利費"],
      },
      {
        name: "雇用保険料_従業員",
        template: "雇用保険料の従業員負担分{amount}円を給料から天引きした。",
        accounts: ["給料", "預り金", "現金"],
        keywords: ["雇用保険料", "従業員負担", "天引き"],
      },
      {
        name: "労働保険料_年度更新",
        template: "労働保険料の年度更新により、概算保険料{amount}円を納付した。",
        accounts: ["法定福利費", "現金"],
        keywords: ["労働保険料", "年度更新", "概算保険料"],
      },

      // 法人税等パターン（6問）
      {
        name: "法人税_中間申告",
        template: "法人税等の中間申告により{amount}円を納付した。",
        accounts: ["法人税等", "現金"],
        keywords: ["法人税", "中間申告", "中間納付"],
      },
      {
        name: "法人税_確定申告",
        template: "法人税等の確定申告により{amount}円を未払計上した。",
        accounts: ["法人税等", "未払金"],
        keywords: ["法人税", "確定申告", "未払計上"],
      },
      {
        name: "法人税_修正申告",
        template: "過年度法人税等の修正申告により追徴課税{amount}円を納付した。",
        accounts: ["租税公課", "現金"],
        keywords: ["法人税", "修正申告", "追徴課税"],
      },
      {
        name: "法人税_還付",
        template: "法人税等の還付{amount1}円と還付加算金{amount2}円を受け取った。",
        accounts: ["現金", "法人税等", "雑収入"],
        keywords: ["法人税", "還付", "還付加算金"],
      },
      {
        name: "消費税_中間申告",
        template: "消費税の中間申告により{amount}円を納付した。",
        accounts: ["消費税", "現金"],
        keywords: ["消費税", "中間申告", "中間納付"],
      },
      {
        name: "消費税_確定申告",
        template: "消費税の確定申告により{amount}円を未払計上した。",
        accounts: ["消費税", "未払金"],
        keywords: ["消費税", "確定申告", "未払計上"],
      },
    ],
  },
  fixed_asset: {
    patterns: [
      // 取得パターン（15問）
      {
        name: "固定資産_現金購入",
        template: "備品{amount}円を現金で購入した。",
        accounts: ["備品", "現金"],
        keywords: ["備品", "固定資産", "現金購入"],
      },
      {
        name: "固定資産_掛購入",
        template: "車両{amount}円を掛けで購入し、未払金とした。",
        accounts: ["車両", "未払金"],
        keywords: ["車両", "掛け購入", "未払金"],
      },
      {
        name: "固定資産_付随費用",
        template: "建物{amount1}円を購入し、登記費用{amount2}円を現金で支払った。",
        accounts: ["建物", "現金"],
        keywords: ["建物", "付随費用", "登記費用"],
      },
      {
        name: "固定資産_分割購入",
        template: "機械装置{amount}円を分割で購入し、第1回分を現金で支払った。",
        accounts: ["機械装置", "現金", "未払金"],
        keywords: ["機械装置", "分割購入", "割賦"],
      },
      {
        name: "中古固定資産",
        template: "中古車両{amount}円を購入し、耐用年数を再計算した。",
        accounts: ["車両", "現金"],
        keywords: ["中古", "車両", "耐用年数"],
      },
      {
        name: "固定資産_交換",
        template: "旧備品{amount1}円と新備品{amount2}円を交換し、差額を現金で支払った。",
        accounts: ["備品", "現金", "備品"],
        keywords: ["固定資産", "交換", "差額"],
      },
      {
        name: "現物出資",
        template: "建物{amount}円を現物出資として受け入れた。",
        accounts: ["建物", "資本金"],
        keywords: ["現物出資", "建物", "受入"],
      },
      {
        name: "無償取得",
        template: "備品{amount}円を無償で取得し、受贈益を計上した。",
        accounts: ["備品", "受贈益"],
        keywords: ["無償取得", "備品", "受贈益"],
      },
      {
        name: "建設仮勘定",
        template: "建物建設の工事代金{amount}円を建設仮勘定で処理した。",
        accounts: ["建設仮勘定", "現金"],
        keywords: ["建設仮勘定", "工事代金", "建設"],
      },
      {
        name: "建設完成",
        template: "建設仮勘定{amount}円を建物の完成により本勘定に振り替えた。",
        accounts: ["建物", "建設仮勘定"],
        keywords: ["建設完成", "本勘定", "振替"],
      },
      {
        name: "自家製作",
        template: "自社製作した機械装置{amount}円の製作原価を集計した。",
        accounts: ["機械装置", "材料費", "労務費"],
        keywords: ["自家製作", "機械装置", "製作原価"],
      },
      {
        name: "改良_修繕区分",
        template: "建物の改良工事{amount}円を資本的支出として処理した。",
        accounts: ["建物", "現金"],
        keywords: ["改良工事", "資本的支出", "建物"],
      },
      {
        name: "リース資産",
        template: "リース資産{amount1}円を取得し、リース料{amount2}円を支払った。",
        accounts: ["リース資産", "現金", "リース債務"],
        keywords: ["リース資産", "リース料", "リース債務"],
      },
      {
        name: "無形固定資産",
        template: "ソフトウェア{amount}円を購入し、無形固定資産として計上した。",
        accounts: ["ソフトウェア", "現金"],
        keywords: ["ソフトウェア", "無形固定資産", "購入"],
      },
      {
        name: "投資不動産",
        template: "投資用不動産{amount}円を取得し、賃貸料収入を見込んだ。",
        accounts: ["投資不動産", "現金"],
        keywords: ["投資不動産", "賃貸料", "投資"],
      },

      // 減価償却パターン（15問）
      {
        name: "定額法_年間",
        template: "建物（取得原価{amount1}円、耐用年数{years}年）の定額法による年間減価償却費を計算した。",
        accounts: ["減価償却費", "建物減価償却累計額"],
        keywords: ["定額法", "年間", "減価償却費"],
      },
      {
        name: "定額法_月割",
        template: "期中取得した車両の定額法による減価償却費{amount}円を月割計算した。",
        accounts: ["減価償却費", "車両減価償却累計額"],
        keywords: ["定額法", "月割計算", "期中取得"],
      },
      {
        name: "定額法_残存価額",
        template: "機械装置（取得原価{amount1}円、残存価額{amount2}円）の減価償却費を計算した。",
        accounts: ["減価償却費", "機械装置減価償却累計額"],
        keywords: ["定額法", "残存価額", "機械装置"],
      },
      {
        name: "定額法_累計額",
        template: "備品の減価償却累計額が{amount}円となり、帳簿価額を算定した。",
        accounts: ["減価償却費", "備品減価償却累計額"],
        keywords: ["定額法", "累計額", "帳簿価額"],
      },
      {
        name: "定額法_耐用年数変更",
        template: "車両の耐用年数変更により、減価償却費{amount}円を再計算した。",
        accounts: ["減価償却費", "車両減価償却累計額"],
        keywords: ["定額法", "耐用年数変更", "再計算"],
      },
      {
        name: "少額減価償却資産",
        template: "30万円未満の備品{amount}円を少額減価償却資産として即時償却した。",
        accounts: ["減価償却費", "備品"],
        keywords: ["少額減価償却", "30万円未満", "即時償却"],
      },
      {
        name: "定率法_年間",
        template: "機械装置（取得原価{amount}円）の定率法による年間減価償却費を計算した。",
        accounts: ["減価償却費", "機械装置減価償却累計額"],
        keywords: ["定率法", "年間", "機械装置"],
      },
      {
        name: "定率法_月割",
        template: "期中取得した備品の定率法による減価償却費{amount}円を月割計算した。",
        accounts: ["減価償却費", "備品減価償却累計額"],
        keywords: ["定率法", "月割計算", "期中取得"],
      },
      {
        name: "定率法_改定取得価額",
        template: "定率法の改定取得価額により、減価償却費{amount}円を計算した。",
        accounts: ["減価償却費", "車両減価償却累計額"],
        keywords: ["定率法", "改定取得価額", "保証率"],
      },
      {
        name: "定率法_定額法切替",
        template: "定率法の償却保証額により、定額法に切り替えて{amount}円を計算した。",
        accounts: ["減価償却費", "機械装置減価償却累計額"],
        keywords: ["定率法", "定額法切替", "償却保証額"],
      },
      {
        name: "定率法_累計額",
        template: "建物の定率法による累計額{amount}円から帳簿価額を算定した。",
        accounts: ["減価償却費", "建物減価償却累計額"],
        keywords: ["定率法", "累計額", "帳簿価額"],
      },
      {
        name: "中古資産_定率法",
        template: "中古機械装置の定率法による耐用年数短縮で{amount}円を計算した。",
        accounts: ["減価償却費", "機械装置減価償却累計額"],
        keywords: ["中古資産", "定率法", "耐用年数短縮"],
      },
      {
        name: "一括償却資産",
        template: "20万円未満の備品{amount}円を一括償却資産として3年均等償却した。",
        accounts: ["減価償却費", "一括償却資産"],
        keywords: ["一括償却資産", "20万円未満", "3年均等"],
      },
      {
        name: "少額資産",
        template: "10万円未満の消耗品{amount}円を少額資産として即時損金算入した。",
        accounts: ["消耗品費", "現金"],
        keywords: ["少額資産", "10万円未満", "即時損金"],
      },
      {
        name: "繰延資産",
        template: "繰延資産{amount}円を5年以内の均等償却で処理した。",
        accounts: ["償却費", "繰延資産"],
        keywords: ["繰延資産", "5年均等", "償却"],
      },

      // 売却・除却パターン（10問）
      {
        name: "固定資産_売却益",
        template: "帳簿価額{amount1}円の車両を{amount2}円で売却し、売却益が発生した。",
        accounts: ["現金", "車両減価償却累計額", "車両", "固定資産売却益"],
        keywords: ["固定資産売却", "車両", "売却益"],
      },
      {
        name: "固定資産_売却損",
        template: "帳簿価額{amount1}円の機械装置を{amount2}円で売却し、売却損が発生した。",
        accounts: ["現金", "機械装置減価償却累計額", "固定資産売却損", "機械装置"],
        keywords: ["固定資産売却", "機械装置", "売却損"],
      },
      {
        name: "期中売却_月割償却",
        template: "期中売却した備品の減価償却費{amount}円を月割計算した。",
        accounts: ["減価償却費", "備品減価償却累計額"],
        keywords: ["期中売却", "月割計算", "減価償却"],
      },
      {
        name: "分割売却",
        template: "建物{amount1}円を分割売却し、第1回分{amount2}円を受け取った。",
        accounts: ["現金", "売掛金", "建物減価償却累計額", "建物"],
        keywords: ["分割売却", "割賦売却", "建物"],
      },
      {
        name: "固定資産_交換",
        template: "旧車両と新車両を交換し、交換差金{amount}円で交換損益を計算した。",
        accounts: ["車両", "現金", "車両減価償却累計額", "車両"],
        keywords: ["固定資産", "交換", "交換損益"],
      },
      {
        name: "売却時消費税",
        template: "建物{amount1}円を売却し、消費税{amount2}円を課税売上として処理した。",
        accounts: ["現金", "建物減価償却累計額", "建物", "固定資産売却益"],
        keywords: ["売却", "消費税", "課税売上"],
      },
      {
        name: "固定資産_除却",
        template: "使用不能となった機械装置（帳簿価額{amount}円）を除却した。",
        accounts: ["機械装置減価償却累計額", "固定資産除却損", "機械装置"],
        keywords: ["固定資産", "除却", "除却損"],
      },
      {
        name: "固定資産_廃棄",
        template: "備品を廃棄し、処分費用{amount}円を現金で支払った。",
        accounts: ["備品減価償却累計額", "固定資産除却損", "現金", "備品"],
        keywords: ["固定資産", "廃棄", "処分費用"],
      },
      {
        name: "災害損失",
        template: "災害により建物（帳簿価額{amount}円）が損失した。",
        accounts: ["建物減価償却累計額", "災害損失", "建物"],
        keywords: ["災害", "固定資産", "災害損失"],
      },
      {
        name: "取壊_解体費用",
        template: "建物の取壊しに伴い、解体費用{amount}円を現金で支払った。",
        accounts: ["建物減価償却累計額", "固定資産除却損", "現金", "建物"],
        keywords: ["取壊し", "解体費用", "建物"],
      },
    ],
  },
  adjustment: {
    patterns: [
      // 引当金パターン（10問）
      {
        name: "貸倒引当金_設定",
        template: "売掛金{amount1}円に対して{percent}%の貸倒引当金を差額補充法で設定する。",
        accounts: ["貸倒引当金繰入", "貸倒引当金"],
        keywords: ["貸倒引当金", "差額補充法", "売掛金"],
      },
      {
        name: "貸倒引当金_戻入",
        template: "前期の貸倒引当金{amount}円を戻入れる。",
        accounts: ["貸倒引当金", "貸倒引当金戻入"],
        keywords: ["貸倒引当金", "戻入れ", "前期"],
      },
      {
        name: "実際貸倒_引当金充当",
        template: "売掛金{amount1}円が貸倒れ、引当金{amount2}円を充当し、不足分は損失とした。",
        accounts: ["貸倒引当金", "貸倒損失", "売掛金"],
        keywords: ["実際貸倒", "引当金充当", "不足分"],
      },
      {
        name: "償却債権取立益",
        template: "既に償却した債権{amount}円が回収され、償却債権取立益とした。",
        accounts: ["現金", "償却債権取立益"],
        keywords: ["償却債権", "取立益", "回収"],
      },
      {
        name: "個別引当金",
        template: "特定の売掛金{amount}円に対して個別に引当金を設定した。",
        accounts: ["貸倒引当金繰入", "貸倒引当金"],
        keywords: ["個別引当金", "特定", "売掛金"],
      },
      {
        name: "債権別引当金",
        template: "貸付金{amount}円に対して引当金を設定した。",
        accounts: ["貸倒引当金繰入", "貸倒引当金"],
        keywords: ["債権別", "貸付金", "引当金"],
      },
      {
        name: "貸倒実績率",
        template: "貸倒実績率{percent}%により引当金{amount}円を算定した。",
        accounts: ["貸倒引当金繰入", "貸倒引当金"],
        keywords: ["貸倒実績率", "算定", "引当金"],
      },
      {
        name: "法定繰入率",
        template: "税法の法定繰入率により引当金{amount}円を計算した。",
        accounts: ["貸倒引当金繰入", "貸倒引当金"],
        keywords: ["法定繰入率", "税法", "引当金"],
      },
      {
        name: "賞与引当金_設定",
        template: "翌期支給予定の賞与に対して引当金{amount}円を設定した。",
        accounts: ["賞与引当金繰入", "賞与引当金"],
        keywords: ["賞与引当金", "翌期支給", "設定"],
      },
      {
        name: "修繕引当金",
        template: "定期修繕に備えて修繕引当金{amount}円を設定した。",
        accounts: ["修繕引当金繰入", "修繕引当金"],
        keywords: ["修繕引当金", "定期修繕", "設定"],
      },

      // 経過勘定パターン（15問）
      {
        name: "前払保険料",
        template: "支払保険料{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["前払費用", "保険料"],
        keywords: ["前払保険料", "保険料", "次期分"],
      },
      {
        name: "前払家賃",
        template: "支払家賃{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["前払費用", "支払家賃"],
        keywords: ["前払家賃", "支払家賃", "次期分"],
      },
      {
        name: "前払利息",
        template: "支払利息{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["前払費用", "支払利息"],
        keywords: ["前払利息", "支払利息", "次期分"],
      },
      {
        name: "前払費用_その他",
        template: "支払広告料{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["前払費用", "広告宣伝費"],
        keywords: ["前払費用", "広告料", "期間配分"],
      },
      {
        name: "前受家賃",
        template: "受取家賃{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["受取家賃", "前受収益"],
        keywords: ["前受家賃", "受取家賃", "次期分"],
      },
      {
        name: "前受利息",
        template: "受取利息{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["受取利息", "前受収益"],
        keywords: ["前受利息", "受取利息", "次期分"],
      },
      {
        name: "前受収益_その他",
        template: "受取手数料{amount1}円のうち、{amount2}円は次期分である。",
        accounts: ["受取手数料", "前受収益"],
        keywords: ["前受収益", "手数料", "期間配分"],
      },
      {
        name: "未払給料",
        template: "当期の給料{amount}円が未払いである。",
        accounts: ["給料", "未払費用"],
        keywords: ["未払給料", "給料", "未払い"],
      },
      {
        name: "未払利息",
        template: "当期の支払利息{amount}円が未払いである。",
        accounts: ["支払利息", "未払費用"],
        keywords: ["未払利息", "支払利息", "未払い"],
      },
      {
        name: "未払家賃",
        template: "当期の支払家賃{amount}円が未払いである。",
        accounts: ["支払家賃", "未払費用"],
        keywords: ["未払家賃", "支払家賃", "未払い"],
      },
      {
        name: "未払費用_その他",
        template: "当期の水道光熱費{amount}円が未払いである。",
        accounts: ["水道光熱費", "未払費用"],
        keywords: ["未払費用", "水道光熱費", "未払い"],
      },
      {
        name: "未収家賃",
        template: "当期の受取家賃{amount}円が未収である。",
        accounts: ["未収収益", "受取家賃"],
        keywords: ["未収家賃", "受取家賃", "未収"],
      },
      {
        name: "未収利息",
        template: "当期の受取利息{amount}円が未収である。",
        accounts: ["未収収益", "受取利息"],
        keywords: ["未収利息", "受取利息", "未収"],
      },
      {
        name: "未収手数料",
        template: "当期の受取手数料{amount}円が未収である。",
        accounts: ["未収収益", "受取手数料"],
        keywords: ["未収手数料", "受取手数料", "未収"],
      },
      {
        name: "未収収益_その他",
        template: "当期の受託収益{amount}円が未収である。",
        accounts: ["未収収益", "受託収益"],
        keywords: ["未収収益", "受託収益", "期間配分"],
      },

      // その他決算整理パターン（15問）
      {
        name: "消耗品棚卸",
        template: "消耗品費{amount1}円のうち、期末在庫{amount2}円を資産に振り替える。",
        accounts: ["消耗品", "消耗品費"],
        keywords: ["消耗品", "棚卸", "資産計上"],
      },
      {
        name: "貯蔵品棚卸",
        template: "期末の貯蔵品棚卸高{amount}円を在庫として計上した。",
        accounts: ["貯蔵品", "材料費"],
        keywords: ["貯蔵品", "棚卸高", "在庫"],
      },
      {
        name: "仕掛品棚卸",
        template: "製造業における仕掛品の期末棚卸高{amount}円を計上した。",
        accounts: ["仕掛品", "製造原価"],
        keywords: ["仕掛品", "製造業", "製造原価"],
      },
      {
        name: "期末商品棚卸",
        template: "実地棚卸による期末商品棚卸高{amount}円を反映させた。",
        accounts: ["商品", "仕入"],
        keywords: ["期末商品", "実地棚卸", "反映"],
      },
      {
        name: "棚卸資産_評価損",
        template: "棚卸資産の陳腐化により評価損{amount}円を計上した。",
        accounts: ["棚卸評価損", "商品"],
        keywords: ["棚卸資産", "陳腐化", "評価損"],
      },
      {
        name: "現金過不足_決算整理",
        template: "現金過不足勘定の残高{amount}円を雑損益に振り替える。",
        accounts: ["雑損", "現金過不足"],
        keywords: ["現金過不足", "決算整理", "雑損益"],
      },
      {
        name: "当期純利益",
        template: "当期純利益{amount}円を繰越利益剰余金に振り替える。",
        accounts: ["損益", "繰越利益剰余金"],
        keywords: ["当期純利益", "繰越利益剰余金", "振替"],
      },
      {
        name: "引出金",
        template: "個人事業主の引出金{amount}円を資本金から控除する。",
        accounts: ["資本金", "引出金"],
        keywords: ["引出金", "個人事業", "資本金"],
      },
      {
        name: "仮払金_振替",
        template: "仮払金{amount}円の内容が判明し、旅費交通費に振り替える。",
        accounts: ["旅費交通費", "仮払金"],
        keywords: ["仮払金", "内容判明", "振替"],
      },
      {
        name: "仮受金_振替",
        template: "仮受金{amount}円の内容が判明し、売上に振り替える。",
        accounts: ["仮受金", "売上"],
        keywords: ["仮受金", "内容判明", "売上"],
      },
      {
        name: "減価償却_決算",
        template: "決算において、減価償却費{amount}円を一括計上する。",
        accounts: ["減価償却費", "減価償却累計額"],
        keywords: ["減価償却", "決算", "一括計上"],
      },
      {
        name: "売上原価_算定",
        template: "期首商品{amount1}円と期末商品{amount2}円により売上原価を算定する。",
        accounts: ["仕入", "繰越商品"],
        keywords: ["売上原価", "期首期末", "算定"],
      },
      {
        name: "法人税等_決算",
        template: "法人税等{amount}円を確定申告により未払計上する。",
        accounts: ["法人税等", "未払金"],
        keywords: ["法人税等", "確定申告", "未払"],
      },
      {
        name: "消費税_決算",
        template: "消費税{amount}円を確定申告により未払計上する。",
        accounts: ["消費税", "未払金"],
        keywords: ["消費税", "確定申告", "未払"],
      },
      {
        name: "圧縮記帳",
        template: "国庫補助金による圧縮記帳{amount}円を処理した。",
        accounts: ["圧縮損", "建物"],
        keywords: ["圧縮記帳", "国庫補助金", "特別償却"],
      },
    ],
  },
};

const LEDGER_TEMPLATES = {
  general_ledger: {
    patterns: [
      {
        name: "総勘定元帳転記",
        template: "仕訳帳から総勘定元帳への転記を行う。",
        keywords: ["総勘定元帳", "転記", "仕訳帳"],
      },
    ],
  },
  subsidiary_ledger: {
    patterns: [
      {
        name: "売掛金元帳",
        template: "売掛金元帳を作成し、得意先別の残高を管理する。",
        keywords: ["売掛金元帳", "補助簿", "得意先"],
      },
    ],
  },
  voucher: {
    patterns: [
      {
        name: "入金伝票",
        template: "現金売上{amount}円を入金伝票に記入する。",
        keywords: ["入金伝票", "現金売上", "3伝票制"],
      },
    ],
  },
  theory: {
    patterns: [
      {
        name: "簿記理論",
        template: "勘定科目の5要素分類について説明する。",
        keywords: ["5要素", "理論", "勘定科目"],
      },
    ],
  },
};

const TRIAL_BALANCE_TEMPLATES = {
  financial_statement: {
    patterns: [
      {
        name: "財務諸表作成",
        template: "決算整理後の試算表から貸借対照表と損益計算書を作成する。",
        keywords: ["財務諸表", "貸借対照表", "損益計算書"],
      },
    ],
  },
  worksheet: {
    patterns: [
      {
        name: "精算表作成",
        template: "決算整理前試算表から8桁精算表を作成する。",
        keywords: ["精算表", "8桁", "決算整理"],
      },
    ],
  },
  trial_balance: {
    patterns: [
      {
        name: "合計試算表",
        template: "期中取引から合計試算表を作成する。",
        keywords: ["合計試算表", "期中取引", "集計"],
      },
    ],
  },
};

// ========== ヘルパー関数 ==========

function generateQuestionId(
  category: "journal" | "ledger" | "trial_balance",
  index: number,
): string {
  const prefix = {
    journal: "Q_J",
    ledger: "Q_L",
    trial_balance: "Q_T",
  }[category];

  return `${prefix}_${String(index).padStart(3, "0")}`;
}

function generateAmount(): number {
  // 100円単位で1,000円から999,000円までのランダムな金額
  return Math.floor(Math.random() * 999 + 1) * 1000;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

function calculateDifficulty(
  index: number,
  total: number,
  distribution: { 1: number; 2: number; 3: number },
): 1 | 2 | 3 {
  const ratio = index / total;
  const level1Threshold = distribution[1];
  const level2Threshold = distribution[1] + distribution[2];

  if (ratio < level1Threshold) return 1;
  if (ratio < level2Threshold) return 2;
  return 3;
}

function serializeTags(tags: QuestionTags): string {
  return JSON.stringify(tags, null, 0);
}

// problemsStrategy.md準拠の階層タグ取得関数
function getCategoryLayer1(subcategory: string): string {
  const categoryMap: Record<string, string> = {
    cash_deposit: "現金・預金取引",
    sales_purchase: "商品売買取引", 
    receivable_payable: "債権・債務",
    salary_tax: "給与・税金",
    fixed_asset: "固定資産",
    adjustment: "決算整理",
  };
  return categoryMap[subcategory] || subcategory;
}

function getCategoryLayer2(subcategory: string, patternName: string): string {
  const patternMap: Record<string, Record<string, string>> = {
    cash_deposit: {
      cash_transaction: "現金取引パターン",
      checking_account: "当座預金パターン", 
      savings_deposit: "普通預金・定期預金パターン",
    },
    sales_purchase: {
      basic_trading: "基本売買パターン",
      returns_allowances: "返品・値引きパターン",
      incidental_special: "諸掛り・特殊取引パターン",
      settlement_related: "決算関連パターン",
    },
    receivable_payable: {
      accounts_receivable_payable: "売掛金・買掛金パターン",
      promissory_notes: "手形取引パターン", 
      loans_borrowings: "貸借取引パターン",
    },
    salary_tax: {
      salary_payment: "給与支払パターン",
      withholding_tax: "源泉徴収・住民税パターン",
      social_insurance: "社会保険料パターン",
      corporate_tax: "法人税等パターン",
    },
    fixed_asset: {
      asset_acquisition: "取得パターン",
      depreciation: "減価償却パターン",
      disposal_retirement: "売却・除却パターン",
    },
    adjustment: {
      allowances: "引当金パターン",
      accrual_accounts: "経過勘定パターン", 
      other_adjustments: "その他決算整理パターン",
    },
  };
  
  return patternMap[subcategory]?.[patternName] || patternName;
}

// ========== 問題生成関数 ==========

function generateJournalQuestions(): Question[] {
  const questions: Question[] = [];
  let questionIndex = 1;
  
  // 総問題数を計算
  const totalQuestions = QUESTION_TARGETS.journal.total;

  // problemsStrategy.mdの順序に従って問題を生成
  const orderedSubcategories = [
    'cash_deposit',
    'sales_purchase', 
    'receivable_payable',
    'salary_tax',
    'fixed_asset',
    'adjustment'
  ];

  // 各サブカテゴリーごとに問題を生成
  for (const subcategory of orderedSubcategories) {
    const subcategoryConfig = QUESTION_TARGETS.journal.subcategories[subcategory as JournalSubCategory];
    const templates = JOURNAL_TEMPLATES[subcategory as JournalSubCategory];
    
    if (!subcategoryConfig || !templates) continue;

    // 通常の処理でmodulo使用を防ぐため、全subcategoryで統一処理
    const targetCount = subcategoryConfig.total;
    
    for (let i = 0; i < targetCount; i++) {
      // パターンを順番に選択（modulo使用を避ける）
      const patternIndex = Math.floor(i * templates.patterns.length / targetCount);
      const pattern = templates.patterns[patternIndex] || templates.patterns[0];
      
      if (!pattern) continue;

      const difficulty = calculateDifficulty(
        questionIndex - 1,
        totalQuestions,
        DIFFICULTY_DISTRIBUTION.journal,
      );

      // 金額を生成
      const amount1 = generateAmount();
      const amount2 = generateAmount();
      const amount3 = Math.floor(amount2 * 0.1);

      // 問題文を生成
      let questionText = pattern.template
        .replace("{amount}", amount1.toLocaleString())
        .replace("{amount1}", amount1.toLocaleString())
        .replace("{amount2}", amount2.toLocaleString())
        .replace("{amount3}", amount3.toLocaleString())
        .replace("{percent}", "2")
        .replace("{years}", "10");

      // 解答テンプレートを生成
      const answerTemplate = {
        type: "journal_entry",
        fields: [
          {
            label: "借方勘定科目",
            type: "dropdown",
            name: "debit_account",
            required: true,
            options: pattern.accounts,
          },
          {
            label: "借方金額",
            type: "number",
            name: "debit_amount",
            required: true,
            format: "currency",
          },
          {
            label: "貸方勘定科目",
            type: "dropdown",
            name: "credit_account",
            required: true,
            options: pattern.accounts,
          },
          {
            label: "貸方金額",
            type: "number",
            name: "credit_amount",
            required: true,
            format: "currency",
          },
        ],
      };

      // 正解データを生成
      const correctAnswer = {
        journalEntry: {
          debit_account: pattern.accounts[0],
          debit_amount: amount1,
          credit_account: pattern.accounts[1],
          credit_amount: amount1,
        },
      };

      // パターンカテゴリーを取得（現金過不足、小口現金など）
      let patternCategory = pattern.name;
      if (pattern.name.includes('現金過不足')) {
        patternCategory = '現金過不足';
      } else if (pattern.name.includes('小口現金')) {
        patternCategory = '小口現金';
      } else if (pattern.name.includes('当座')) {
        patternCategory = '当座預金';
      } else if (pattern.name.includes('普通預金')) {
        patternCategory = '普通預金';
      } else if (pattern.name.includes('定期預金')) {
        patternCategory = '定期預金';
      } else if (pattern.name.includes('売上') || pattern.name.includes('仕入')) {
        patternCategory = '商品売買';
      } else if (pattern.name.includes('売掛金') || pattern.name.includes('買掛金')) {
        patternCategory = '売掛買掛';
      } else if (pattern.name.includes('手形')) {
        patternCategory = '手形取引';
      } else if (pattern.name.includes('給与')) {
        patternCategory = '給与';
      } else if (pattern.name.includes('税金') || pattern.name.includes('源泉')) {
        patternCategory = '税金';
      } else if (pattern.name.includes('固定資産') || pattern.name.includes('減価償却')) {
        patternCategory = '固定資産';
      } else if (pattern.name.includes('決算') || pattern.name.includes('整理')) {
        patternCategory = '決算整理';
      }

      // problemsStrategy.md準拠の階層タグを生成
      const tags: QuestionTags = {
        subcategory: subcategory,
        pattern: patternCategory,
        subpattern: pattern.name,
        accounts: pattern.accounts,
        keywords: pattern.keywords,
        examSection: 1,
        // 階層情報を追加
        category_layer_1: getCategoryLayer1(subcategory),
        category_layer_2: getCategoryLayer2(subcategory, patternCategory),
        category_layer_3: pattern.name,
      };

      // 問題を作成
      const question: Question = {
        id: generateQuestionId("journal", questionIndex),
        category_id: "journal",
        question_text: questionText,
        answer_template_json: JSON.stringify(answerTemplate),
        correct_answer_json: JSON.stringify(correctAnswer),
        explanation: `${pattern.name}の仕訳です。借方に${pattern.accounts[0]}、貸方に${pattern.accounts[1]}を記入します。`,
        difficulty: difficulty,
        tags_json: serializeTags(tags),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      questions.push(question);
      questionIndex++;
    }
  }

  return questions;
}

function generateLedgerQuestions(): Question[] {
  const questions: Question[] = [];
  let questionIndex = 1;

  for (const [pattern, targetCount] of Object.entries(
    QUESTION_TARGETS.ledger.patterns,
  )) {
    const templates = LEDGER_TEMPLATES[pattern as LedgerPattern];

    for (let i = 0; i < targetCount; i++) {
      const patternTemplate = templates.patterns[0];
      const difficulty = calculateDifficulty(
        i,
        targetCount,
        DIFFICULTY_DISTRIBUTION.ledger,
      );

      const amount = generateAmount();
      let questionText = patternTemplate.template.replace(
        "{amount}",
        amount.toLocaleString(),
      );

      const answerTemplate = {
        type: "ledger_entry",
        fields: [
          {
            label: "記入内容",
            type: "text",
            name: "entry",
            required: true,
          },
        ],
      };

      const correctAnswer = {
        ledgerEntry: {
          entries: [
            {
              description: patternTemplate.name,
              amount: amount,
            },
          ],
        },
      };

      const tags: QuestionTags = {
        subcategory: pattern,
        pattern: patternTemplate.name,
        accounts: [],
        keywords: patternTemplate.keywords,
        examSection: 2,
      };

      const question: Question = {
        id: generateQuestionId("ledger", questionIndex),
        category_id: "ledger",
        question_text: questionText,
        answer_template_json: JSON.stringify(answerTemplate),
        correct_answer_json: JSON.stringify(correctAnswer),
        explanation: `${patternTemplate.name}に関する問題です。`,
        difficulty: difficulty,
        tags_json: serializeTags(tags),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      questions.push(question);
      questionIndex++;
    }
  }

  return questions;
}

function generateTrialBalanceQuestions(): Question[] {
  const questions: Question[] = [];
  let questionIndex = 1;

  for (const [pattern, targetCount] of Object.entries(
    QUESTION_TARGETS.trial_balance.patterns,
  )) {
    const templates = TRIAL_BALANCE_TEMPLATES[pattern as TrialBalancePattern];

    for (let i = 0; i < targetCount; i++) {
      const patternTemplate = templates.patterns[0];
      const difficulty = calculateDifficulty(
        i,
        targetCount,
        DIFFICULTY_DISTRIBUTION.trial_balance,
      );

      const questionText = patternTemplate.template;

      const answerTemplate = {
        type: "trial_balance",
        fields: [
          {
            label: "解答",
            type: "text",
            name: "answer",
            required: true,
          },
        ],
      };

      const correctAnswer = {
        trialBalance: {
          balances: {},
        },
      };

      const tags: QuestionTags = {
        subcategory: pattern,
        pattern: patternTemplate.name,
        accounts: [],
        keywords: patternTemplate.keywords,
        examSection: 3,
      };

      const question: Question = {
        id: generateQuestionId("trial_balance", questionIndex),
        category_id: "trial_balance",
        question_text: questionText,
        answer_template_json: JSON.stringify(answerTemplate),
        correct_answer_json: JSON.stringify(correctAnswer),
        explanation: `${patternTemplate.name}に関する問題です。`,
        difficulty: difficulty,
        tags_json: serializeTags(tags),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      questions.push(question);
      questionIndex++;
    }
  }

  return questions;
}

// ========== 検証関数 ==========

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    total: number;
    byCategory: Record<string, number>;
    bySubcategory: Record<string, number>;
    byDifficulty: Record<string, Record<number, number>>;
  };
}

function validateQuestions(questions: Question[]): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    statistics: {
      total: questions.length,
      byCategory: {},
      bySubcategory: {},
      byDifficulty: {},
    },
  };

  // IDの重複チェック
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) {
      result.errors.push(`重複ID検出: ${q.id}`);
      result.valid = false;
    }
    ids.add(q.id);
  }

  // カテゴリー別集計
  for (const q of questions) {
    result.statistics.byCategory[q.category_id] =
      (result.statistics.byCategory[q.category_id] || 0) + 1;

    if (!result.statistics.byDifficulty[q.category_id]) {
      result.statistics.byDifficulty[q.category_id] = {};
    }
    result.statistics.byDifficulty[q.category_id][q.difficulty] =
      (result.statistics.byDifficulty[q.category_id][q.difficulty] || 0) + 1;

    // サブカテゴリー集計
    if (q.tags_json) {
      const tags = JSON.parse(q.tags_json) as QuestionTags;
      const key = `${q.category_id}_${tags.subcategory}`;
      result.statistics.bySubcategory[key] =
        (result.statistics.bySubcategory[key] || 0) + 1;
    }
  }

  // 目標数との比較
  // 仕訳問題
  const journalCount = result.statistics.byCategory["journal"] || 0;
  if (journalCount !== QUESTION_TARGETS.journal.total) {
    result.errors.push(
      `仕訳問題数不一致: 期待${QUESTION_TARGETS.journal.total}問、実際${journalCount}問`,
    );
    result.valid = false;
  }

  // 仕訳サブカテゴリー
  for (const [sub, target] of Object.entries(
    QUESTION_TARGETS.journal.subcategories,
  )) {
    const actual = result.statistics.bySubcategory[`journal_${sub}`] || 0;
    if (actual !== target.total) {
      result.errors.push(
        `仕訳/${sub}の問題数不一致: 期待${target.total}問、実際${actual}問`,
      );
      result.valid = false;
    }
  }

  // 帳簿問題
  const ledgerCount = result.statistics.byCategory["ledger"] || 0;
  if (ledgerCount !== QUESTION_TARGETS.ledger.total) {
    result.errors.push(
      `帳簿問題数不一致: 期待${QUESTION_TARGETS.ledger.total}問、実際${ledgerCount}問`,
    );
    result.valid = false;
  }

  // 試算表問題
  const trialBalanceCount = result.statistics.byCategory["trial_balance"] || 0;
  if (trialBalanceCount !== QUESTION_TARGETS.trial_balance.total) {
    result.errors.push(
      `試算表問題数不一致: 期待${QUESTION_TARGETS.trial_balance.total}問、実際${trialBalanceCount}問`,
    );
    result.valid = false;
  }

  // 難易度分布チェック
  for (const [category, distribution] of Object.entries(
    DIFFICULTY_DISTRIBUTION,
  )) {
    const total = result.statistics.byCategory[category] || 0;
    if (total > 0) {
      for (const [level, ratio] of Object.entries(distribution)) {
        const expected = Math.round(total * ratio);
        const actual =
          result.statistics.byDifficulty[category][parseInt(level)] || 0;
        const diff = Math.abs(expected - actual);

        if (diff > 2) {
          // 許容誤差2問まで
          result.warnings.push(
            `${category}の難易度${level}分布: 期待${expected}問±2、実際${actual}問`,
          );
        }
      }
    }
  }

  return result;
}

// ========== メイン処理 ==========

async function main() {
  console.log("📝 問題データ生成開始...\n");

  // 問題生成
  console.log("1️⃣ 仕訳問題生成中...");
  const journalQuestions = generateJournalQuestions();
  console.log(`   ✅ ${journalQuestions.length}問生成完了`);

  console.log("2️⃣ 帳簿問題生成中...");
  const ledgerQuestions = generateLedgerQuestions();
  console.log(`   ✅ ${ledgerQuestions.length}問生成完了`);

  console.log("3️⃣ 試算表問題生成中...");
  const trialBalanceQuestions = generateTrialBalanceQuestions();
  console.log(`   ✅ ${trialBalanceQuestions.length}問生成完了`);

  // 全問題を統合
  const allQuestions = [
    ...journalQuestions,
    ...ledgerQuestions,
    ...trialBalanceQuestions,
  ];

  console.log(`\n📊 合計${allQuestions.length}問生成完了\n`);

  // 検証
  console.log("🔍 データ検証中...");
  const validation = validateQuestions(allQuestions);

  // 検証結果表示
  console.log("\n===== 検証結果 =====");
  console.log(`✅ 有効性: ${validation.valid ? "合格" : "不合格"}`);

  if (validation.errors.length > 0) {
    console.log("\n❌ エラー:");
    validation.errors.forEach((e) => console.log(`   - ${e}`));
  }

  if (validation.warnings.length > 0) {
    console.log("\n⚠️  警告:");
    validation.warnings.forEach((w) => console.log(`   - ${w}`));
  }

  console.log("\n📈 統計情報:");
  console.log(`   総問題数: ${validation.statistics.total}問`);
  console.log("\n   カテゴリー別:");
  for (const [cat, count] of Object.entries(validation.statistics.byCategory)) {
    console.log(`     ${cat}: ${count}問`);
  }

  console.log("\n   サブカテゴリー別:");
  for (const [subcat, count] of Object.entries(
    validation.statistics.bySubcategory,
  )) {
    console.log(`     ${subcat}: ${count}問`);
  }

  console.log("\n   難易度分布:");
  for (const [cat, levels] of Object.entries(
    validation.statistics.byDifficulty,
  )) {
    console.log(`     ${cat}:`);
    for (const [level, count] of Object.entries(levels)) {
      console.log(`       難易度${level}: ${count}問`);
    }
  }

  // ファイル出力
  if (validation.valid) {
    const outputPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "master-questions.ts",
    );
    const outputContent = `/**
 * マスター問題データ
 * 自動生成: ${getCurrentTimestamp()}
 * problemsStrategy.md準拠
 */

export const masterQuestions = ${JSON.stringify(allQuestions, null, 2)};

export const questionStatistics = ${JSON.stringify(validation.statistics, null, 2)};
`;

    fs.writeFileSync(outputPath, outputContent, "utf-8");
    console.log(`\n✅ ファイル出力完了: ${outputPath}`);
  } else {
    console.log("\n❌ 検証エラーのため出力をスキップしました");
    process.exit(1);
  }
}

// 実行
main().catch(console.error);
