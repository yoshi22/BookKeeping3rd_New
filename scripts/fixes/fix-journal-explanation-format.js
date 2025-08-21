/**
 * 第一問（仕訳問題）250問の詳細解説フォーマット統一スクリプト
 *
 * このスクリプトは、Q_J_001〜Q_J_250の問題について、
 * 以下の6つのセクションを持つ統一フォーマットに修正します：
 * 1. 基本概念
 * 2. 具体例・イメージ
 * 3. 仕訳パターン
 * 4. 間違えやすいポイント
 * 5. 覚え方のコツ
 * 6. この問題の仕訳
 */

const fs = require("fs");
const path = require("path");

// 必要なセクション
const REQUIRED_SECTIONS = [
  "基本概念",
  "具体例・イメージ",
  "仕訳パターン",
  "間違えやすいポイント",
  "覚え方のコツ",
  "この問題の仕訳",
];

/**
 * 問題の勘定科目とカテゴリに基づいて適切な詳細解説を生成
 */
function generateDetailedExplanation(questionData) {
  const { id, questionText, correctAnswer, tags } = questionData;

  // 正答から勘定科目を抽出
  const answer = JSON.parse(correctAnswer);
  const debitAccount =
    answer.journalEntry?.debit_account || answer.debit_account || "";
  const creditAccount =
    answer.journalEntry?.credit_account || answer.credit_account || "";

  // タグ情報から分野を判定
  const tagsObj = JSON.parse(tags);
  const category = tagsObj.subcategory || "";
  const pattern = tagsObj.pattern || "";

  // カテゴリ別の詳細解説テンプレートを生成
  return generateExplanationByCategory(
    category,
    pattern,
    debitAccount,
    creditAccount,
    questionText,
    id,
  );
}

/**
 * カテゴリ別の詳細解説生成
 */
function generateExplanationByCategory(
  category,
  pattern,
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  // 現金・預金系の処理
  if (
    category === "cash_deposit" ||
    debitAccount.includes("現金") ||
    creditAccount.includes("現金")
  ) {
    return generateCashExplanation(
      debitAccount,
      creditAccount,
      questionText,
      questionId,
    );
  }

  // 売買系の処理
  if (category === "sales_purchase" || pattern.includes("売買")) {
    return generateSalesExplanation(
      debitAccount,
      creditAccount,
      questionText,
      questionId,
    );
  }

  // 売掛金・買掛金系の処理
  if (
    category === "receivable_payable" ||
    debitAccount.includes("売掛金") ||
    creditAccount.includes("買掛金")
  ) {
    return generateReceivablePayableExplanation(
      debitAccount,
      creditAccount,
      questionText,
      questionId,
    );
  }

  // 固定資産系の処理
  if (
    category === "fixed_asset" ||
    debitAccount.includes("減価償却") ||
    creditAccount.includes("減価償却")
  ) {
    return generateFixedAssetExplanation(
      debitAccount,
      creditAccount,
      questionText,
      questionId,
    );
  }

  // 手形系の処理
  if (
    pattern.includes("手形") ||
    debitAccount.includes("手形") ||
    creditAccount.includes("手形")
  ) {
    return generateBillExplanation(
      debitAccount,
      creditAccount,
      questionText,
      questionId,
    );
  }

  // 一般的な処理（デフォルト）
  return generateGeneralExplanation(
    debitAccount,
    creditAccount,
    questionText,
    questionId,
  );
}

/**
 * 現金・預金系の詳細解説生成
 */
function generateCashExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  const isDepositRelated =
    debitAccount.includes("当座預金") || creditAccount.includes("当座預金");
  const isCashShortageRelated =
    debitAccount.includes("現金過不足") || creditAccount.includes("現金過不足");

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isDepositRelated) {
    basicConcept =
      "銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付かず、法人が開設する専用の銀行口座です。";
    example =
      "法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。";
    pattern =
      "・入金時: 借方に当座預金、貸方に売掛金等\\n・支払時（残高あり）: 借方に買掛金等、貸方に当座預金\\n・支払時（残高不足）: 借方に買掛金等、貸方に当座借越";
    mistakes =
      "・普通預金と当座預金を混同しやすい\\n・他人振出小切手は「現金」として扱う\\n・当座借越の処理方法（決算時の振替が必要）";
    tips =
      "・「当座」= その場での決済用\\n・小切手 = 当座預金から支払う\\n・入金で当座預金増加（借方）\\n・残高不足でも小切手振出可能（当座借越契約時）";
  } else if (isCashShortageRelated) {
    basicConcept =
      "現金実査の結果、現金の実際有高と帳簿残高が一致しない場合の処理です。原因が判明するまで一時的に現金過不足勘定を使用します。";
    example =
      "レジの現金を数えたら、帳簿より多かったり少なかったりする状況をイメージしてください。原因がわからない時は「現金過不足」で処理します。";
    pattern =
      "・不足時: 借方に現金過不足、貸方に現金\\n・過剰時: 借方に現金、貸方に現金過不足\\n・原因判明時: 該当勘定科目で修正\\n・決算時: 雑損または雑益で処理";
    mistakes =
      "・不足と過剰の処理方向を間違える\\n・原因判明後の修正仕訳を忘れる\\n・決算時の雑損・雑益振替を忘れる";
    tips =
      "・実査 = 実際に数えること\\n・不足 = 現金過不足が借方\\n・過剰 = 現金過不足が貸方\\n・決算時は「雑損・雑益」で整理";
  } else {
    basicConcept =
      "企業が所有する紙幣や硬貨などの通貨のことで、最も流動性の高い資産勘定です。現金の増減を正確に記録・管理します。";
    example =
      "お財布の中のお金をイメージしてください。お金が入ってくると増え、支払いをすると減ります。会社の金庫や手元現金も同様です。";
    pattern =
      "・現金収入時: 借方に現金（現金増加）\\n・現金支出時: 貸方に現金（現金減少）\\n・売上代金受取: 借方に現金、貸方に売上\\n・経費支払: 借方に経費、貸方に現金";
    mistakes =
      "・現金の増減を逆に記録してしまう\\n・現金過不足の処理を忘れる\\n・現金以外の支払手段（小切手、振込等）との区別";
    tips =
      "・現金は資産なので、増えるときは借方、減るときは貸方\\n・「もらったら借方、払ったら貸方」\\n・現金は「見える・触れる」お金";
  }

  solution = `問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。${questionText.includes("現金過不足") ? "現金過不足の処理では実査結果と帳簿残高の差額に注意してください。" : ""}`;

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 売買系の詳細解説生成
 */
function generateSalesExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  const isThreeMethodRelated =
    questionText.includes("三分法") ||
    debitAccount === "仕入" ||
    creditAccount === "売上";

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isThreeMethodRelated) {
    basicConcept =
      "三分法による商品勘定の処理です。三分法では商品の仕入・売上・在庫を「仕入」「売上」「繰越商品」の3つの勘定科目で管理します。";
    example =
      "小売店が問屋から商品を仕入れ、お客様に販売する状況をイメージしてください。三分法では仕入時に商品勘定ではなく「仕入」勘定を使います。";
    pattern =
      "・三分法仕入時: 借方に仕入、貸方に現金/買掛金\\n・三分法売上時: 借方に現金/売掛金、貸方に売上\\n・期末商品棚卸: 繰越商品勘定で処理\\n・決算時売上原価算定: 期首商品＋仕入－期末商品";
    mistakes =
      "・分記法と三分法を混同する\\n・商品勘定を使ってしまう（三分法では使わない）\\n・期末の売上原価計算を忘れる\\n・繰越商品の処理を理解していない";
    tips =
      "・三分法 = 仕入・売上・繰越商品の3勘定で管理\\n・仕入時は必ず「仕入」勘定を使用\\n・売上時は必ず「売上」勘定を使用\\n・「商品」勘定は三分法では使用しない";
  } else {
    basicConcept =
      "商品の仕入れと売上に関する基本的な取引。商品売買では適切な勘定科目の選択と金額の記録が重要です。";
    example =
      "スーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。";
    pattern =
      "・仕入時: 借方に仕入、貸方に現金/買掛金\\n・売上時: 借方に現金/売掛金、貸方に売上\\n・返品時: 逆仕訳で処理\\n・値引時: 売上値引/仕入値引勘定で処理";
    mistakes =
      "・分記法と三分法を混同しやすい\\n・期末商品の振替処理を忘れがち\\n・返品と値引の処理方法を間違える\\n・売上原価の計算方法を理解していない";
    tips =
      "・三分法は「仕入・売上・繰越商品」の3つで管理\\n・仕入は費用（左側）、売上は収益（右側）\\n・期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）\\n・返品は「逆仕訳」、値引は「専用勘定」";
  }

  solution = `問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。${isThreeMethodRelated ? "三分法では仕入時に「仕入」勘定を使用することがポイントです。" : ""}`;

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 売掛金・買掛金系の詳細解説生成
 */
function generateReceivablePayableExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  const isReceivableRelated =
    debitAccount.includes("売掛金") || creditAccount.includes("売掛金");
  const isPayableRelated =
    debitAccount.includes("買掛金") || creditAccount.includes("買掛金");

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isReceivableRelated) {
    basicConcept =
      "商品やサービスを掛け（信用取引）で販売した際に発生する、顧客から代金を受け取る権利を表す資産勘定です。売掛金の発生・回収・管理を行います。";
    example =
      "商店が「ツケ」で商品を販売した状況をイメージしてください。お客様に「後で代金をください」と商品を渡し、その権利を記録します。";
    pattern =
      "・掛売上時: 借方に売掛金（債権発生）\\n・現金回収時: 貸方に売掛金（現金で回収）\\n・手形回収時: 貸方に売掛金（手形で回収）\\n・貸倒発生時: 貸方に売掛金（回収不能）";
    mistakes =
      "・売掛金の増減を逆に記録してしまう\\n・回収方法（現金・手形・振込等）による処理の違い\\n・貸倒引当金と貸倒損失の使い分け\\n・売上返品・値引との関係";
    tips =
      "・売掛金は資産なので、発生時は借方、回収時は貸方\\n・「売った→借方、回収した→貸方」\\n・貸倒は「引当金優先、不足分は損失」\\n・手形回収は「売掛金→受取手形」の振替";
  } else if (isPayableRelated) {
    basicConcept =
      "商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。";
    example =
      "ツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。";
    pattern =
      "・掛仕入時: 借方に仕入、貸方に買掛金\\n・代金支払時: 借方に買掛金、貸方に現金\\n・手形振出時: 借方に買掛金、貸方に支払手形\\n・相殺時: 借方に買掛金、貸方に売掛金";
    mistakes =
      "・買掛金（負債）と売掛金（資産）を混同しやすい\\n・支払時に買掛金を貸方に書いてしまうミス\\n・未払金との区別（本業以外の支出は未払金）\\n・相殺処理の金額を間違える";
    tips =
      "・「買」掛金 = 「買った」ツケ = 払う義務（負債）\\n・支払うと買掛金は減る（借方）\\n・「義務」は負債、「権利」は資産\\n・買う側に発生するのが「買掛金」";
  } else {
    basicConcept =
      "売掛金と買掛金の相殺や管理に関する処理です。同一取引先に対する債権と債務を効率的に管理します。";
    example =
      "同じ取引先に対して「売上代金をもらう権利」と「仕入代金を払う義務」がある場合の処理をイメージしてください。";
    pattern =
      "・相殺処理: 借方に買掛金、貸方に売掛金（小さい方の金額）\\n・残額管理: 大きい方の勘定に差額が残る\\n・完全相殺: 金額が同じなら両方とも消滅";
    mistakes =
      "・相殺する金額を間違える（小さい方の金額で処理）\\n・買掛金と売掛金の増減方向を間違える\\n・異なる取引先同士で相殺してしまう";
    tips =
      "・相殺は「小さい方の金額」で処理\\n・「払う義務」と「もらう権利」を打ち消し合う\\n・同一取引先に対してのみ可能\\n・現金の動きはなし";
  }

  solution = `問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。${questionText.includes("相殺") ? "相殺処理では小さい方の金額で処理することがポイントです。" : ""}`;

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 固定資産系の詳細解説生成
 */
function generateFixedAssetExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  const isDepreciationRelated =
    debitAccount.includes("減価償却") || creditAccount.includes("減価償却");

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isDepreciationRelated) {
    basicConcept =
      "固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。";
    example =
      "車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。";
    pattern =
      "・減価償却時: 借方に減価償却費、貸方に減価償却累計額\\n・計算式: (取得原価-残存価額)÷耐用年数\\n・月割計算: 年間償却額×利用月数÷12\\n・売却時: 帳簿価額との差額で損益計算";
    mistakes =
      "・直接法と間接法を混同する\\n・残存価額を忘れて計算する\\n・期中取得の月割計算を間違える\\n・土地は減価償却しないことを忘れる";
    tips =
      "・間接法は「累計額」を使用\\n・定額法は「毎年同じ金額」\\n・土地は「価値が減らない」\\n・期中取得は「月割り計算」";
  } else {
    basicConcept =
      "長期間にわたって事業に使用する資産で、建物・車両・備品などが該当します。取得・償却・売却・除却の処理を正確に行います。";
    example =
      "会社が使う建物、車、机、パソコンなどをイメージしてください。長い間使うものなので、毎年少しずつ価値が減っていきます。";
    pattern =
      "・取得時: 借方に固定資産、貸方に現金等\\n・減価償却時: 借方に減価償却費、貸方に累計額\\n・売却時: 帳簿価額と売却価額の差で損益\\n・除却時: 帳簿価額を固定資産除却損で処理";
    mistakes =
      "・取得原価に含める費用を間違える\\n・減価償却の計算を間違える\\n・売却益・売却損の計算を間違える\\n・除却と売却を混同する";
    tips =
      "・固定資産は「長く使うもの」\\n・取得原価には「付随費用」も含める\\n・帳簿価額 = 取得原価 - 減価償却累計額\\n・売却は「お金をもらう」、除却は「廃棄処分」";
  }

  solution = `問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。${isDepreciationRelated ? "減価償却では間接法で累計額勘定を使用することがポイントです。" : ""}`;

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 手形系の詳細解説生成
 */
function generateBillExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  const isReceivableBill =
    debitAccount.includes("受取手形") || creditAccount.includes("受取手形");
  const isPayableBill =
    debitAccount.includes("支払手形") || creditAccount.includes("支払手形");

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isReceivableBill) {
    basicConcept =
      "商品を掛けで売上げた際に、代金の代わりに受け取る約束手形です。支払期日に銀行で現金化できる有価証券として扱われます。";
    example =
      "「3か月後に代金を必ず払います」という約束が書かれた紙をもらう状況をイメージしてください。これを銀行に持っていけば現金に換えられます。";
    pattern =
      "・手形受取時: 借方に受取手形、貸方に売掛金\\n・手形決済時: 借方に現金、貸方に受取手形\\n・手形割引時: 借方に現金、貸方に受取手形\\n・手形裏書時: 借方に買掛金、貸方に受取手形";
    mistakes =
      "・受取手形と支払手形を混同する\\n・手形の振出人と受取人を間違える\\n・割引料の処理を間違える\\n・不渡手形の処理を理解していない";
    tips =
      "・受取手形は「もらう約束手形」（資産）\\n・手形 = 「○月○日に□□円払います」の約束\\n・割引 = 期日前に銀行で現金化\\n・裏書 = 手形を他人に譲渡";
  } else if (isPayableBill) {
    basicConcept =
      "商品を掛けで仕入れた際に、代金の代わりに振り出す約束手形です。支払期日に必ず代金を支払う約束を示す有価証券です。";
    example =
      "「3か月後に代金を必ず払います」という約束を紙に書いて相手に渡す状況をイメージしてください。これが約束手形の振出です。";
    pattern =
      "・手形振出時: 借方に買掛金、貸方に支払手形\\n・手形決済時: 借方に支払手形、貸方に現金\\n・手形不渡時: 借方に支払手形、貸方に当座預金\\n・不渡手形時: 借方に不渡手形、貸方に支払手形";
    mistakes =
      "・受取手形と支払手形を混同する\\n・手形の振出人と受取人を間違える\\n・決済時の処理を間違える\\n・不渡時の処理を理解していない";
    tips =
      "・支払手形は「出す約束手形」（負債）\\n・振出 = 手形を作って相手に渡すこと\\n・決済 = 期日に約束通り支払うこと\\n・不渡 = 約束を守れなかった状態";
  } else {
    basicConcept =
      "手形取引に関する処理です。約束手形は確定日払い・金額確定・譲渡可能な有価証券として扱われます。";
    example =
      "「○月○日に△△円を必ず支払います」という約束が書かれた証書をイメージしてください。この約束は銀行で現金に換えられます。";
    pattern =
      "・手形受取: 借方に受取手形\\n・手形振出: 貸方に支払手形\\n・手形決済: 現金との交換\\n・手形割引・裏書: 第三者への譲渡";
    mistakes =
      "・受取手形と支払手形の区別\\n・振出人と受取人の立場を間違える\\n・決済期日と割引日の区別\\n・手形の裏書譲渡の理解不足";
    tips =
      "・手形 = 支払いの約束証書\\n・受取手形 = もらった約束（資産）\\n・支払手形 = 出した約束（負債）\\n・期日になったら必ず決済";
  }

  solution = `問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。${questionText.includes("手形") ? "手形取引では受取手形（資産）と支払手形（負債）の区別がポイントです。" : ""}`;

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 一般的な詳細解説生成（デフォルト）
 */
function generateGeneralExplanation(
  debitAccount,
  creditAccount,
  questionText,
  questionId,
) {
  // 勘定科目から処理内容を推測
  const isExpenseRelated = [
    "給料",
    "家賃",
    "水道光熱費",
    "通信費",
    "消耗品費",
    "旅費交通費",
  ].some((acc) => debitAccount.includes(acc) || creditAccount.includes(acc));

  const isRevenueRelated = ["売上", "受取利息", "受取手数料", "雑益"].some(
    (acc) => debitAccount.includes(acc) || creditAccount.includes(acc),
  );

  let basicConcept, example, pattern, mistakes, tips, solution;

  if (isExpenseRelated) {
    basicConcept =
      "事業活動に必要な支出を表す費用勘定です。発生主義により、実際の支払時期に関係なく発生した時点で費用計上します。";
    example =
      "会社が事業を行うために必要な支出をイメージしてください。給料、家賃、光熱費などが代表的な費用です。";
    pattern =
      "・費用発生時: 借方に費用勘定、貸方に現金等\\n・前払時: 借方に前払費用、後で費用勘定に振替\\n・未払時: 借方に費用勘定、貸方に未払費用\\n・決算時: 費用勘定から損益勘定に振替";
    mistakes =
      "・現金主義と発生主義を混同する\\n・前払費用と未払費用の処理を間違える\\n・費用の発生時期を間違える\\n・決算時の振替仕訳を忘れる";
    tips =
      "・費用は左側（借方）に記録\\n・発生主義 = 実際に発生した時点で計上\\n・前払 = 先に払った費用\\n・未払 = 後で払う費用";
  } else if (isRevenueRelated) {
    basicConcept =
      "事業活動によって得られる収益を表す収益勘定です。発生主義により、実際の入金時期に関係なく発生した時点で収益計上します。";
    example =
      "会社が事業で稼いだお金をイメージしてください。商品売上、利息収入、手数料収入などが代表的な収益です。";
    pattern =
      "・収益発生時: 借方に現金等、貸方に収益勘定\\n・前受時: 借方に現金、貸方に前受収益、後で収益勘定に振替\\n・未収時: 借方に未収収益、貸方に収益勘定\\n・決算時: 収益勘定から損益勘定に振替";
    mistakes =
      "・現金主義と発生主義を混同する\\n・前受収益と未収収益の処理を間違える\\n・収益の発生時期を間違える\\n・決算時の振替仕訳を忘れる";
    tips =
      "・収益は右側（貸方）に記録\\n・発生主義 = 実際に発生した時点で計上\\n・前受 = 先にもらった収益\\n・未収 = 後でもらう収益";
  } else {
    basicConcept =
      "簿記3級で学習する基本的な仕訳処理です。取引の内容を正確に理解し、適切な勘定科目と金額で記録することが重要です。";
    example =
      "企業の日常的な取引をイメージしてください。どのような取引でも、必ず借方と貸方が等しくなる複式簿記の原則に従います。";
    pattern =
      "・取引発生時: 原因と結果を分析\\n・勘定科目選択: 資産・負債・純資産・収益・費用の5要素\\n・金額記録: 借方合計 = 貸方合計\\n・検算: 仕訳の妥当性を確認";
    mistakes =
      "・借方と貸方を間違える\\n・勘定科目の選択を間違える\\n・金額の計算を間違える\\n・取引の本質を理解していない";
    tips =
      "・複式簿記 = 借方と貸方が必ず等しい\\n・資産の増加・費用の発生 = 借方\\n・負債の増加・純資産の増加・収益の発生 = 貸方\\n・取引の原因と結果を常に意識";
  }

  solution =
    "問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。複式簿記の原則に従い、借方合計と貸方合計が一致することを確認してください。";

  return `【基本概念】\\n${basicConcept}\\n\\n【具体例・イメージ】\\n${example}\\n\\n【仕訳パターン】\\n${pattern}\\n\\n【間違えやすいポイント】\\n${mistakes}\\n\\n【覚え方のコツ】\\n${tips}\\n\\n【この問題の仕訳】\\n${solution}`;
}

/**
 * 問題の詳細解説が適切なフォーマットかチェック
 */
function hasValidFormat(explanation) {
  if (!explanation || typeof explanation !== "string") {
    return false;
  }

  return REQUIRED_SECTIONS.every((section) => explanation.includes(section));
}

/**
 * ファイルから全問題を抽出
 */
function extractAllQuestions(content) {
  const questions = [];
  const lines = content.split("\n");

  let currentQuestion = {};
  let inQuestion = false;
  let inExplanation = false;
  let explanationLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 仕訳問題の開始を検出
    if (line.includes('id: "Q_J_')) {
      if (inQuestion && currentQuestion.id) {
        questions.push({ ...currentQuestion });
      }

      const match = line.match(/id: "(Q_J_\d{3})"/);
      if (match) {
        currentQuestion = { id: match[1] };
        inQuestion = true;
        inExplanation = false;
        explanationLines = [];
      }
    }

    if (!inQuestion) continue;

    // 問題文を抽出
    if (line.includes("question_text:")) {
      let questionText = "";
      let j = i + 1;
      while (j < lines.length && !lines[j].includes("answer_template_json:")) {
        questionText +=
          lines[j].trim().replace(/^"/, "").replace(/",$/, "") + " ";
        j++;
      }
      currentQuestion.questionText = questionText.trim();
    }

    // 正答を抽出
    if (line.includes("correct_answer_json:")) {
      const match = line.match(/correct_answer_json: '(.*)'/);
      if (match) {
        currentQuestion.correctAnswer = match[1];
      }
    }

    // タグ情報を抽出
    if (line.includes("tags_json:")) {
      const match = line.match(/tags_json: '(.*)'/);
      if (match) {
        currentQuestion.tags = match[1].replace(/\\\\/g, "\\");
      }
    }

    // 詳細解説の開始
    if (line.includes("explanation:")) {
      inExplanation = true;
      explanationLines = [];
      continue;
    }

    // 詳細解説の終了
    if (inExplanation && line.includes("difficulty:")) {
      inExplanation = false;
      currentQuestion.explanation = explanationLines
        .join("\n")
        .trim()
        .replace(/^"/, "")
        .replace(/",?$/, "");
    }

    // 詳細解説の内容
    if (inExplanation) {
      explanationLines.push(line.trim());
    }
  }

  // 最後の問題を追加
  if (inQuestion && currentQuestion.id) {
    questions.push({ ...currentQuestion });
  }

  return questions;
}

/**
 * メイン処理
 */
function main() {
  const filePath =
    "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts";

  try {
    console.log("📖 仕訳問題の詳細解説フォーマット統一を開始します...");

    // ファイル読み込み
    const content = fs.readFileSync(filePath, "utf8");

    // 問題を抽出
    const questions = extractAllQuestions(content);
    console.log(`📊 合計 ${questions.length} 問の仕訳問題を検出しました`);

    // フォーマット不完全な問題を特定
    const incompleteQuestions = questions.filter(
      (q) => !hasValidFormat(q.explanation),
    );
    console.log(
      `🔧 フォーマット修正が必要な問題: ${incompleteQuestions.length} 問`,
    );

    if (incompleteQuestions.length === 0) {
      console.log("✅ すべての問題が適切なフォーマットになっています");
      return;
    }

    // 最初の10問を表示
    console.log("\\n修正対象の問題（最初の10問）:");
    incompleteQuestions.slice(0, 10).forEach((q) => {
      console.log(
        `- ${q.id}: ${q.explanation ? "部分的フォーマット" : "説明なし"}`,
      );
    });

    // 各問題の詳細解説を生成
    let modifiedContent = content;
    let modificationCount = 0;

    console.log("\\n🔨 詳細解説の生成と適用を開始します...");

    incompleteQuestions.forEach((question, index) => {
      try {
        const newExplanation = generateDetailedExplanation(question);

        // 既存の説明を新しい説明に置換
        const oldExplanationRegex = new RegExp(
          `(id: "${question.id}"[\\s\\S]*?explanation:[\\s\\S]*?")([\\s\\S]*?)(",\\s*difficulty:)`,
          "g",
        );

        const replacement = `$1${newExplanation}$3`;
        const newContent = modifiedContent.replace(
          oldExplanationRegex,
          replacement,
        );

        if (newContent !== modifiedContent) {
          modifiedContent = newContent;
          modificationCount++;

          if (
            (index + 1) % 25 === 0 ||
            index === incompleteQuestions.length - 1
          ) {
            console.log(
              `📝 進捗: ${index + 1}/${incompleteQuestions.length} 問完了`,
            );
          }
        }
      } catch (error) {
        console.error(`❌ ${question.id} の処理でエラー:`, error.message);
      }
    });

    // バックアップ作成
    const backupPath = `${filePath}.backup-explanation-format-${Date.now()}`;
    fs.writeFileSync(backupPath, content);
    console.log(`💾 バックアップを作成しました: ${path.basename(backupPath)}`);

    // 修正されたファイルを保存
    fs.writeFileSync(filePath, modifiedContent);

    console.log(
      `\\n✅ 修正完了: ${modificationCount} 問の詳細解説を統一フォーマットに更新しました`,
    );
    console.log("📋 次の手順:");
    console.log("1. データバージョンを更新 (src/data/migrations/index.ts)");
    console.log("2. forceUpdate = true に一時設定");
    console.log("3. アプリで動作確認");
    console.log("4. forceUpdate = false に戻す");
    console.log("5. 修正ログを作成");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { generateDetailedExplanation };
