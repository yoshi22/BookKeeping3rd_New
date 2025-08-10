/**
 * 簿記3級試験 学習パス定義
 * problemsStrategy.mdの内容をTypeScript化
 */

export interface ExamStructure {
  section: number;
  name: string;
  points: number;
  timeAllocation: string;
  content: string;
  questionCount: number | string;
}

export interface LearningCategory {
  id: string;
  name: string;
  description: string;
  subcategories: SubCategory[];
  targetQuestionCount: number;
  importance: "high" | "medium" | "low";
  prerequisites?: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  patterns: QuestionPattern[];
  targetQuestionCount: number;
}

export interface QuestionPattern {
  id: string;
  name: string;
  description: string;
  examples: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  frequency: "high" | "medium" | "low";
}

export interface LearningPhase {
  phase: number;
  name: string;
  description: string;
  focusCategories: string[];
  targetCompletionDays: number;
  requiredMastery: number; // 0-100%
}

// 試験構成と配点
export const EXAM_STRUCTURE: ExamStructure[] = [
  {
    section: 1,
    name: "仕訳問題",
    points: 45,
    timeAllocation: "15-20分",
    content: "仕訳問題",
    questionCount: "15問（各3点）",
  },
  {
    section: 2,
    name: "補助簿・勘定記入・伝票",
    points: 20,
    timeAllocation: "15-20分",
    content: "補助簿・勘定記入・伝票",
    questionCount: "2問（各10点）",
  },
  {
    section: 3,
    name: "決算書作成",
    points: 35,
    timeAllocation: "25-30分",
    content: "決算書作成（財務諸表/精算表/試算表）",
    questionCount: "1問",
  },
];

// 第1問：仕訳問題のカテゴリー定義
export const JOURNAL_CATEGORIES: LearningCategory[] = [
  {
    id: "cash_deposit",
    name: "現金・預金取引",
    description: "現金、小口現金、当座預金、普通預金、定期預金に関する取引",
    targetQuestionCount: 42,
    importance: "high",
    subcategories: [
      {
        id: "cash_transactions",
        name: "現金取引パターン",
        targetQuestionCount: 12,
        patterns: [
          {
            id: "cash_shortage",
            name: "現金過不足",
            description: "現金実査による帳簿残高との差額処理",
            examples: [
              "原因不明の現金過不足発見→現金過不足勘定計上",
              "原因判明の現金過不足→該当勘定への直接修正",
              "決算時の現金過不足整理→雑損益への振替",
              "現金実査による帳簿残高との差額発見",
            ],
            difficulty: 2,
            frequency: "high",
          },
          {
            id: "petty_cash",
            name: "小口現金",
            description: "小口現金制度による経費精算",
            examples: [
              "小口現金制度の設定・資金前渡",
              "小口現金の定期補給（インプレスト・システム）",
              "小口現金からの経費支払・精算",
            ],
            difficulty: 2,
            frequency: "medium",
          },
          {
            id: "other_cash",
            name: "その他現金取引",
            description: "基本的な現金取引",
            examples: [
              "現金売上・現金仕入の基本処理",
              "現金による給与支払・源泉徴収",
              "現金による経費支払（交通費・消耗品等）",
              "現金による税金支払",
              "現金による利息・配当金の受取",
            ],
            difficulty: 1,
            frequency: "high",
          },
        ],
      },
      {
        id: "checking_account",
        name: "当座預金パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "checking_basic",
            name: "当座預金基本取引",
            description: "当座預金口座の基本的な入出金処理",
            examples: [
              "当座預金口座開設・資金預入",
              "小切手振出による支払",
              "振込による当座預金入金",
              "当座預金からの現金引出",
              "当座預金口座間振替",
              "銀行振込手数料の処理",
            ],
            difficulty: 2,
            frequency: "high",
          },
          {
            id: "overdraft",
            name: "当座借越",
            description: "当座借越契約による一時的な借入処理",
            examples: [
              "当座借越契約・限度額設定",
              "当座預金残高不足での小切手振出",
              "当座借越利息の計算・支払",
              "当座借越の返済・解消",
              "当座借越から当座預金への振替",
              "当座借越限度額の変更",
            ],
            difficulty: 3,
            frequency: "medium",
          },
        ],
      },
      {
        id: "other_deposits",
        name: "普通預金・定期預金パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "savings_account",
            name: "普通預金取引",
            description: "普通預金口座の入出金処理",
            examples: [
              "普通預金口座開設・資金預入",
              "普通預金からの現金引出",
              "自動引落による公共料金支払",
              "給与振込による普通預金入金",
              "普通預金利息の受取・源泉徴収",
              "普通預金と当座預金の振替",
              "ATM手数料の処理",
              "普通預金口座解約",
            ],
            difficulty: 1,
            frequency: "high",
          },
          {
            id: "time_deposit",
            name: "定期預金取引",
            description: "定期預金の預入・解約処理",
            examples: [
              "定期預金の預入・証書発行",
              "定期預金の満期解約・利息計算",
              "定期預金の中途解約・違約金",
              "自動継続定期預金の処理",
              "定期預金担保貸付の実行",
              "外貨定期預金の為替差損益",
              "定期預金から普通預金への振替",
            ],
            difficulty: 2,
            frequency: "low",
          },
        ],
      },
    ],
  },
  {
    id: "sales_purchase",
    name: "商品売買取引",
    description: "商品の売買、返品、値引き、諸掛りに関する取引",
    targetQuestionCount: 45,
    importance: "high",
    subcategories: [
      {
        id: "basic_trading",
        name: "基本売買パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "basic_four",
            name: "基本4パターン",
            description: "商品売買の基本的な仕訳",
            examples: [
              "商品の現金仕入",
              "商品の掛け仕入（買掛金計上）",
              "商品の現金売上",
              "商品の掛け売上（売掛金計上）",
              "掛け仕入代金の現金支払（買掛金決済）",
              "掛け売上代金の現金回収（売掛金回収）",
              "仕入・売上の混合取引（一部現金・一部掛け）",
              "三分法による商品勘定の処理",
            ],
            difficulty: 1,
            frequency: "high",
          },
          {
            id: "advance_payment",
            name: "前払金・前受金",
            description: "商品取引における前払・前受処理",
            examples: [
              "商品仕入時の前払金支払",
              "前払金残高での商品受取・決済",
              "商品売上時の前受金受取",
              "前受金残高での商品引渡・決済",
            ],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
      {
        id: "returns_discounts",
        name: "返品・値引きパターン",
        targetQuestionCount: 10,
        patterns: [
          {
            id: "purchase_returns",
            name: "仕入返品・値引き",
            description: "仕入商品の返品・値引き処理",
            examples: [
              "現金仕入品の返品・返金処理",
              "掛け仕入品の返品・買掛金減額",
              "仕入値引きの処理（品質不良等）",
              "前払金支払済み商品の返品処理",
              "返品商品の再販可能性による処理区分",
            ],
            difficulty: 2,
            frequency: "medium",
          },
          {
            id: "sales_returns",
            name: "売上返品・値引き",
            description: "売上商品の返品・値引き処理",
            examples: [
              "現金売上品の返品・返金処理",
              "掛け売上品の返品・売掛金減額",
              "売上値引きの処理（顧客クレーム対応等）",
              "前受金受取済み商品の返品処理",
              "返品理由別の会計処理区分",
            ],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
      {
        id: "shipping_costs",
        name: "諸掛り・特殊取引パターン",
        targetQuestionCount: 12,
        patterns: [
          {
            id: "purchase_costs",
            name: "仕入諸掛り",
            description: "仕入に伴う付随費用の処理",
            examples: [
              "仕入時運賃・保険料（当社負担）→仕入原価加算",
              "仕入時運賃・保険料（先方負担の立替）→立替金計上",
              "引取運賃・荷役料の処理",
              "仕入関連手数料・検査料",
              "輸入仕入時の関税・通関手数料",
              "仕入諸掛りの現金・掛け決済",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "sales_costs",
            name: "売上諸掛り",
            description: "売上に伴う付随費用の処理",
            examples: [
              "売上時運賃・保険料（当社負担）→販売費計上",
              "売上時運賃・保険料（先方負担）→売上原価から控除",
              "配送費・梱包費の処理",
              "売上関連手数料・広告宣伝費",
            ],
            difficulty: 3,
            frequency: "medium",
          },
        ],
      },
      {
        id: "year_end_adjustment",
        name: "決算関連パターン",
        targetQuestionCount: 8,
        patterns: [
          {
            id: "cost_of_sales",
            name: "売上原価算定",
            description: "売上原価の計算と仕訳",
            examples: [
              "売上原価対立法（期首商品→仕入→期末商品）",
              "分記法から三分法への期中転換",
              "商品勘定の決算振替（繰越商品勘定使用）",
              "売上原価の月次算定・調整",
            ],
            difficulty: 4,
            frequency: "high",
          },
          {
            id: "inventory_valuation",
            name: "商品評価・調整",
            description: "期末商品の評価と調整",
            examples: [
              "期末商品棚卸高の計上（実地棚卸）",
              "商品評価損の計上（低価法適用）",
              "商品廃棄損・盗難損失の処理",
              "季節商品の評価減・見切り販売",
            ],
            difficulty: 3,
            frequency: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "receivable_payable",
    name: "債権・債務",
    description: "売掛金、買掛金、手形、貸付金、借入金に関する取引",
    targetQuestionCount: 41,
    importance: "high",
    prerequisites: ["sales_purchase"],
    subcategories: [
      {
        id: "accounts_receivable_payable",
        name: "売掛金・買掛金パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "receivable_management",
            name: "売掛金管理",
            description: "売掛金の発生と回収",
            examples: [
              "掛け売上による売掛金発生",
              "売掛金の現金回収・消込",
              "売掛金の一部回収・残高管理",
              "売掛金の手形決済（受取手形への振替）",
              "売掛金の相殺決済（買掛金との相殺）",
              "売掛金の貸倒れ・貸倒損失計上",
              "回収済み売掛金の貸倒れ取消（貸倒引当金戻入）",
              "売掛金の期限管理・延滞処理",
            ],
            difficulty: 2,
            frequency: "high",
          },
          {
            id: "payable_management",
            name: "買掛金管理",
            description: "買掛金の発生と支払",
            examples: [
              "掛け仕入による買掛金発生",
              "買掛金の現金支払・消込",
              "買掛金の一部支払・残高管理",
              "買掛金の手形決済（支払手形への振替）",
              "買掛金と売掛金の相殺決済",
              "買掛金の支払遅延・延滞金",
              "買掛金の期限管理・支払計画",
            ],
            difficulty: 2,
            frequency: "high",
          },
        ],
      },
      {
        id: "notes",
        name: "手形取引パターン",
        targetQuestionCount: 16,
        patterns: [
          {
            id: "notes_receivable",
            name: "受取手形",
            description: "受取手形の処理",
            examples: [
              "約束手形の受取（売掛金からの振替）",
              "為替手形の受取（引受済み）",
              "受取手形の満期決済・当座預金入金",
              "受取手形の割引（銀行での現金化）",
              "受取手形の裏書譲渡（買掛金決済等）",
              "受取手形の不渡り・貸倒処理",
              "手形割引料・裏書手数料の処理",
              "受取手形の更改（期限延長）",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "notes_payable",
            name: "支払手形",
            description: "支払手形の処理",
            examples: [
              "約束手形の振出（買掛金からの振替）",
              "為替手形の引受",
              "支払手形の満期決済・当座預金支払",
              "支払手形の更改（期限延長依頼）",
              "支払手形の期日管理",
              "手形振出手数料の処理",
              "自己受為替手形の振出",
              "融通手形の処理",
            ],
            difficulty: 3,
            frequency: "medium",
          },
        ],
      },
      {
        id: "loans",
        name: "貸付・借入パターン",
        targetQuestionCount: 10,
        patterns: [
          {
            id: "lending",
            name: "貸付金",
            description: "金銭の貸付処理",
            examples: [
              "現金・振込による貸付実行",
              "貸付金利息の計算・受取",
              "貸付金の一部回収",
              "貸付金の全額回収",
              "貸付金の貸倒れ・回収不能処理",
            ],
            difficulty: 2,
            frequency: "low",
          },
          {
            id: "borrowing",
            name: "借入金",
            description: "金銭の借入処理",
            examples: [
              "現金・振込による借入実行",
              "借入金利息の計算・支払",
              "借入金の一部返済",
              "借入金の全額返済",
              "借入金の借換え・条件変更",
            ],
            difficulty: 2,
            frequency: "low",
          },
        ],
      },
    ],
  },
  {
    id: "salary_tax",
    name: "給与・税金",
    description: "給与支払、源泉徴収、社会保険、法人税等に関する取引",
    targetQuestionCount: 40,
    importance: "medium",
    subcategories: [
      {
        id: "salary_payment",
        name: "給与支払パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "basic_salary",
            name: "基本給与処理",
            description: "給与の計算と支払",
            examples: [
              "月次給与の総支給額計算",
              "基本給・諸手当の仕訳",
              "時間外手当・深夜手当の計算",
              "賞与の支給・仕訳",
              "退職金の支給処理",
            ],
            difficulty: 2,
            frequency: "high",
          },
          {
            id: "salary_deductions",
            name: "給与控除",
            description: "給与からの各種控除",
            examples: [
              "源泉所得税の控除・預り",
              "住民税の特別徴収",
              "社会保険料の控除（健康保険・厚生年金）",
              "雇用保険料の控除",
              "財形貯蓄・社内預金の控除",
            ],
            difficulty: 3,
            frequency: "high",
          },
        ],
      },
      {
        id: "withholding_tax",
        name: "源泉徴収・住民税パターン",
        targetQuestionCount: 10,
        patterns: [
          {
            id: "income_tax",
            name: "源泉所得税",
            description: "源泉所得税の処理",
            examples: [
              "給与からの源泉徴収",
              "賞与からの源泉徴収",
              "報酬・料金からの源泉徴収",
              "源泉徴収税の納付（翌月10日）",
              "年末調整による還付・追徴",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "resident_tax",
            name: "住民税",
            description: "住民税の特別徴収",
            examples: [
              "住民税の特別徴収開始",
              "月次住民税の控除",
              "住民税の納付（翌月10日）",
              "退職者の住民税一括徴収",
              "住民税の変更通知対応",
            ],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
      {
        id: "social_insurance",
        name: "社会保険料パターン",
        targetQuestionCount: 8,
        patterns: [
          {
            id: "health_pension",
            name: "健康保険・厚生年金",
            description: "社会保険料の処理",
            examples: [
              "健康保険料の計算（労使折半）",
              "厚生年金保険料の計算（労使折半）",
              "社会保険料の納付（月末）",
              "標準報酬月額の改定",
              "賞与からの社会保険料控除",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "employment_insurance",
            name: "雇用保険・労災保険",
            description: "労働保険料の処理",
            examples: [
              "雇用保険料の計算",
              "労災保険料の計算（全額事業主負担）",
              "労働保険料の年度更新",
              "概算保険料の納付",
              "確定保険料の精算",
            ],
            difficulty: 2,
            frequency: "low",
          },
        ],
      },
      {
        id: "corporate_tax",
        name: "法人税等パターン",
        targetQuestionCount: 7,
        patterns: [
          {
            id: "tax_payment",
            name: "法人税等の納付",
            description: "法人税、住民税、事業税の処理",
            examples: [
              "中間納付の処理",
              "確定申告による納付",
              "法人税等の還付",
              "更正・修正申告",
              "延滞税・加算税の処理",
            ],
            difficulty: 4,
            frequency: "low",
          },
        ],
      },
    ],
  },
  {
    id: "fixed_asset",
    name: "固定資産",
    description: "固定資産の取得、減価償却、売却、除却に関する取引",
    targetQuestionCount: 42,
    importance: "high",
    subcategories: [
      {
        id: "acquisition",
        name: "取得パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "purchase_acquisition",
            name: "購入による取得",
            description: "固定資産の購入処理",
            examples: [
              "建物の購入（付随費用込み）",
              "機械装置の購入・据付費用",
              "車両運搬具の購入（自動車税・保険料）",
              "土地の購入（仲介手数料・登記費用）",
              "中古資産の購入",
              "リース資産の取得",
              "建設仮勘定の計上",
              "資本的支出と修繕費の区分",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "self_construction",
            name: "自家建設",
            description: "自社で建設・製作する場合",
            examples: [
              "材料費・労務費・経費の集計",
              "建設仮勘定への振替",
              "完成時の本勘定振替",
              "借入金利息の原価算入",
              "試運転費用の処理",
            ],
            difficulty: 4,
            frequency: "low",
          },
        ],
      },
      {
        id: "depreciation",
        name: "減価償却パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "straight_line",
            name: "定額法",
            description: "定額法による減価償却",
            examples: [
              "年間減価償却費の計算",
              "月割計算（期中取得）",
              "残存価額の設定",
              "耐用年数の決定",
              "備忘価額（1円）までの償却",
              "減価償却累計額の計上",
            ],
            difficulty: 3,
            frequency: "high",
          },
          {
            id: "declining_balance",
            name: "定率法",
            description: "定率法による減価償却",
            examples: [
              "償却率による計算",
              "改定償却率の適用",
              "保証率・改定取得価額",
              "250%定率法（平成24年4月以降）",
              "200%定率法（平成19年4月〜平成24年3月）",
            ],
            difficulty: 4,
            frequency: "medium",
          },
        ],
      },
      {
        id: "disposal",
        name: "売却・除却パターン",
        targetQuestionCount: 12,
        patterns: [
          {
            id: "sale",
            name: "固定資産売却",
            description: "固定資産の売却処理",
            examples: [
              "期首売却（減価償却不要）",
              "期中売却（月割償却）",
              "期末売却（年間償却）",
              "売却益の計上",
              "売却損の計上",
              "下取り・交換の処理",
            ],
            difficulty: 3,
            frequency: "medium",
          },
          {
            id: "retirement",
            name: "固定資産除却",
            description: "固定資産の除却・廃棄処理",
            examples: [
              "除却時の帳簿価額算定",
              "除却損の計上",
              "廃棄費用の処理",
              "一部除却の処理",
              "災害による除却",
              "保険金受取時の処理",
            ],
            difficulty: 3,
            frequency: "low",
          },
        ],
      },
    ],
  },
  {
    id: "adjustment",
    name: "決算整理",
    description: "引当金、経過勘定、その他決算整理に関する取引",
    targetQuestionCount: 40,
    importance: "high",
    prerequisites: ["cash_deposit", "sales_purchase", "receivable_payable"],
    subcategories: [
      {
        id: "provisions",
        name: "引当金パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "bad_debt",
            name: "貸倒引当金",
            description: "貸倒引当金の設定と取崩し",
            examples: [
              "一括評価による貸倒引当金設定",
              "個別評価による貸倒引当金設定",
              "貸倒引当金の戻入（洗替法）",
              "貸倒引当金の戻入（差額補充法）",
              "貸倒損失の計上（引当金不足）",
              "貸倒債権の回収",
            ],
            difficulty: 3,
            frequency: "high",
          },
          {
            id: "other_provisions",
            name: "その他の引当金",
            description: "各種引当金の処理",
            examples: [
              "賞与引当金の設定",
              "退職給付引当金の設定",
              "修繕引当金の設定",
              "返品調整引当金の設定",
              "商品保証引当金の設定",
            ],
            difficulty: 3,
            frequency: "medium",
          },
        ],
      },
      {
        id: "accruals",
        name: "経過勘定パターン",
        targetQuestionCount: 15,
        patterns: [
          {
            id: "prepaid_accrued",
            name: "前払・前受",
            description: "前払費用と前受収益の処理",
            examples: [
              "前払保険料の計上",
              "前払家賃の計上",
              "前払利息の計上",
              "前受家賃の計上",
              "前受利息の計上",
              "前受手数料の計上",
            ],
            difficulty: 3,
            frequency: "high",
          },
          {
            id: "accrued_deferred",
            name: "未収・未払",
            description: "未収収益と未払費用の処理",
            examples: [
              "未収利息の計上",
              "未収家賃の計上",
              "未収手数料の計上",
              "未払利息の計上",
              "未払家賃の計上",
              "未払給与の計上",
            ],
            difficulty: 3,
            frequency: "high",
          },
        ],
      },
      {
        id: "other_adjustments",
        name: "その他決算整理パターン",
        targetQuestionCount: 10,
        patterns: [
          {
            id: "consumables",
            name: "消耗品費の整理",
            description: "消耗品の期末在庫処理",
            examples: [
              "消耗品の期末棚卸",
              "貯蔵品への振替",
              "切手・印紙の在庫計上",
              "事務用品の期末処理",
            ],
            difficulty: 2,
            frequency: "medium",
          },
          {
            id: "closing_entries",
            name: "決算振替仕訳",
            description: "損益勘定への振替",
            examples: [
              "収益勘定の損益振替",
              "費用勘定の損益振替",
              "当期純利益の振替",
              "繰越利益剰余金への振替",
              "資本金への組入れ",
            ],
            difficulty: 4,
            frequency: "medium",
          },
        ],
      },
    ],
  },
];

// 第2問：帳簿問題のカテゴリー定義
export const LEDGER_CATEGORIES: LearningCategory[] = [
  {
    id: "cash_book",
    name: "現金出納帳",
    description: "現金出納帳の記入と残高計算",
    targetQuestionCount: 15,
    importance: "high",
    subcategories: [
      {
        id: "cash_receipts",
        name: "入金記帳",
        targetQuestionCount: 8,
        patterns: [
          {
            id: "cash_sales_entry",
            name: "現金売上の記帳",
            description: "現金売上取引の記帳方法",
            examples: [
              "日付・摘要・金額の記入",
              "相手勘定科目の記入",
              "残高の計算と記入",
            ],
            difficulty: 1,
            frequency: "high",
          },
        ],
      },
      {
        id: "cash_payments",
        name: "出金記帳",
        targetQuestionCount: 7,
        patterns: [
          {
            id: "cash_purchase_entry",
            name: "現金仕入の記帳",
            description: "現金仕入取引の記帳方法",
            examples: [
              "日付・摘要・金額の記入",
              "相手勘定科目の記入",
              "残高の計算と記入",
            ],
            difficulty: 1,
            frequency: "high",
          },
        ],
      },
    ],
  },
  {
    id: "subsidiary_ledgers",
    name: "補助簿",
    description: "各種補助簿の作成と管理",
    targetQuestionCount: 15,
    importance: "medium",
    subcategories: [
      {
        id: "sales_ledger",
        name: "売上帳",
        targetQuestionCount: 5,
        patterns: [
          {
            id: "sales_recording",
            name: "売上取引の記録",
            description: "売上帳への記帳方法",
            examples: [
              "日付・得意先・品名の記入",
              "数量・単価・金額の計算",
              "月次集計の作成",
            ],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
      {
        id: "purchase_ledger",
        name: "仕入帳",
        targetQuestionCount: 5,
        patterns: [
          {
            id: "purchase_recording",
            name: "仕入取引の記録",
            description: "仕入帳への記帳方法",
            examples: [
              "日付・仕入先・品名の記入",
              "数量・単価・金額の計算",
              "月次集計の作成",
            ],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
      {
        id: "receivable_ledger",
        name: "売掛金元帳",
        targetQuestionCount: 5,
        patterns: [
          {
            id: "receivable_recording",
            name: "売掛金の管理",
            description: "得意先元帳の記帳",
            examples: ["売掛金の発生記録", "入金による消込", "残高の管理"],
            difficulty: 2,
            frequency: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "account_entries",
    name: "勘定記入",
    description: "総勘定元帳への記入",
    targetQuestionCount: 10,
    importance: "medium",
    subcategories: [
      {
        id: "general_ledger",
        name: "総勘定元帳",
        targetQuestionCount: 10,
        patterns: [
          {
            id: "ledger_posting",
            name: "転記処理",
            description: "仕訳帳から総勘定元帳への転記",
            examples: [
              "借方・貸方への記入",
              "相手勘定の記入",
              "残高の計算",
              "締切処理",
            ],
            difficulty: 3,
            frequency: "high",
          },
        ],
      },
    ],
  },
];

// 第3問：試算表問題のカテゴリー定義
export const TRIAL_BALANCE_CATEGORIES: LearningCategory[] = [
  {
    id: "trial_balance",
    name: "試算表作成",
    description: "合計残高試算表の作成",
    targetQuestionCount: 12,
    importance: "high",
    prerequisites: ["journal", "ledger"],
    subcategories: [
      {
        id: "total_trial_balance",
        name: "合計試算表",
        targetQuestionCount: 6,
        patterns: [
          {
            id: "total_calculation",
            name: "合計額の計算",
            description: "借方・貸方の合計計算",
            examples: [
              "各勘定の借方合計",
              "各勘定の貸方合計",
              "貸借一致の確認",
            ],
            difficulty: 3,
            frequency: "high",
          },
        ],
      },
      {
        id: "balance_trial_balance",
        name: "残高試算表",
        targetQuestionCount: 6,
        patterns: [
          {
            id: "balance_calculation",
            name: "残高の計算",
            description: "各勘定の残高計算",
            examples: ["借方残高の計算", "貸方残高の計算", "貸借一致の確認"],
            difficulty: 3,
            frequency: "high",
          },
        ],
      },
    ],
  },
];

// 学習フェーズの定義
export const LEARNING_PHASES: LearningPhase[] = [
  {
    phase: 1,
    name: "基礎固め",
    description: "簿記の基本概念と基本仕訳を習得",
    focusCategories: ["cash_deposit", "sales_purchase"],
    targetCompletionDays: 14,
    requiredMastery: 80,
  },
  {
    phase: 2,
    name: "応用力養成",
    description: "債権債務、固定資産など応用的な仕訳を習得",
    focusCategories: ["receivable_payable", "fixed_asset", "salary_tax"],
    targetCompletionDays: 21,
    requiredMastery: 75,
  },
  {
    phase: 3,
    name: "決算対策",
    description: "決算整理仕訳と帳簿作成を習得",
    focusCategories: ["adjustment", "ledger", "trial_balance"],
    targetCompletionDays: 14,
    requiredMastery: 85,
  },
  {
    phase: 4,
    name: "総合演習",
    description: "模試形式での実戦練習",
    focusCategories: ["all"],
    targetCompletionDays: 7,
    requiredMastery: 70,
  },
];

// 学習パス取得関数
export function getLearningPath(
  userLevel: "beginner" | "intermediate" | "advanced",
): LearningPhase[] {
  switch (userLevel) {
    case "beginner":
      return LEARNING_PHASES;
    case "intermediate":
      return LEARNING_PHASES.slice(1); // 基礎固めをスキップ
    case "advanced":
      return LEARNING_PHASES.slice(2); // 基礎と応用をスキップ
    default:
      return LEARNING_PHASES;
  }
}

// カテゴリー別の問題数取得
export function getTargetQuestionCount(categoryId: string): number {
  const journalCategory = JOURNAL_CATEGORIES.find((c) => c.id === categoryId);
  if (journalCategory) return journalCategory.targetQuestionCount;

  const ledgerCategory = LEDGER_CATEGORIES.find((c) => c.id === categoryId);
  if (ledgerCategory) return ledgerCategory.targetQuestionCount;

  const trialBalanceCategory = TRIAL_BALANCE_CATEGORIES.find(
    (c) => c.id === categoryId,
  );
  if (trialBalanceCategory) return trialBalanceCategory.targetQuestionCount;

  return 0;
}

// 重要度別のカテゴリー取得
export function getCategoriesByImportance(
  importance: "high" | "medium" | "low",
): LearningCategory[] {
  const allCategories = [
    ...JOURNAL_CATEGORIES,
    ...LEDGER_CATEGORIES,
    ...TRIAL_BALANCE_CATEGORIES,
  ];
  return allCategories.filter((c) => c.importance === importance);
}

// カテゴリーの前提条件チェック
export function checkPrerequisites(
  categoryId: string,
  completedCategories: string[],
): boolean {
  const allCategories = [
    ...JOURNAL_CATEGORIES,
    ...LEDGER_CATEGORIES,
    ...TRIAL_BALANCE_CATEGORIES,
  ];
  const category = allCategories.find((c) => c.id === categoryId);

  if (!category || !category.prerequisites) return true;

  return category.prerequisites.every((prereq) =>
    completedCategories.includes(prereq),
  );
}
