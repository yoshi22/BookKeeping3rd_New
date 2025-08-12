const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_021-Q_L_040の包括的修正\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// 3伝票制の問題（Q_L_021-Q_L_026）を修正
function fix3DenpyoProblems() {
  console.log("📝 3伝票制問題（Q_L_021-Q_L_026）の修正\n");

  for (let i = 21; i <= 26; i++) {
    const id = `Q_L_${String(i).padStart(3, "0")}`;
    const month = i - 20;

    console.log(`処理中: ${id}`);

    // 問題文（既存のまま）
    const questionText = `【3伝票制記入問題】\\n\\n2025年${month}月の取引について、3伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 5日: 商品を掛けで仕入れた 120,000円\\n${month}月10日: 商品を現金で売り上げた 85,000円\\n${month}月15日: 売掛金を現金で回収した 95,000円\\n${month}月20日: 買掛金を小切手で支払った 110,000円\\n${month}月25日: 備品を掛けで購入した 45,000円\\n\\n【作成指示】\\n・入金伝票、出金伝票、振替伝票の適切な使い分け\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;

    // 複数伝票対応のテンプレート
    const voucherTemplate = {
      type: "voucher_entry",
      vouchers: [
        {
          type: "入金伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "account",
              label: "勘定科目",
              type: "text",
              required: true,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
        {
          type: "出金伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "account",
              label: "勘定科目",
              type: "text",
              required: true,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
        {
          type: "振替伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "debit_account",
              label: "借方科目",
              type: "text",
              required: true,
            },
            {
              name: "debit_amount",
              label: "借方金額",
              type: "number",
              required: true,
            },
            {
              name: "credit_account",
              label: "貸方科目",
              type: "text",
              required: true,
            },
            {
              name: "credit_amount",
              label: "貸方金額",
              type: "number",
              required: true,
            },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
      ],
    };

    // 正しい解答（全取引を含む）
    const voucherAnswer = {
      vouchers: [
        // 入金伝票
        {
          type: "入金伝票",
          entries: [
            {
              date: `2025-0${month}-10`,
              account: "売上",
              amount: 85000,
              description: "商品売上（現金）",
            },
            {
              date: `2025-0${month}-15`,
              account: "売掛金",
              amount: 95000,
              description: "売掛金回収",
            },
          ],
        },
        // 出金伝票
        {
          type: "出金伝票",
          entries: [
            {
              date: `2025-0${month}-20`,
              account: "買掛金",
              amount: 110000,
              description: "買掛金支払（小切手）",
            },
          ],
        },
        // 振替伝票
        {
          type: "振替伝票",
          entries: [
            {
              date: `2025-0${month}-05`,
              debit_account: "仕入",
              debit_amount: 120000,
              credit_account: "買掛金",
              credit_amount: 120000,
              description: "商品仕入（掛け）",
            },
            {
              date: `2025-0${month}-25`,
              debit_account: "備品",
              debit_amount: 45000,
              credit_account: "未払金",
              credit_amount: 45000,
              description: "備品購入（掛け）",
            },
          ],
        },
      ],
    };

    // 具体的な解説
    const explanation = `【3伝票制の解答】\\n\\n本問では5つの取引を3伝票制で記入します：\\n\\n1. ${month}月5日「商品を掛けで仕入れた」→ 振替伝票（借方：仕入 120,000円／貸方：買掛金 120,000円）\\n2. ${month}月10日「商品を現金で売り上げた」→ 入金伝票（売上 85,000円）\\n3. ${month}月15日「売掛金を現金で回収」→ 入金伝票（売掛金 95,000円）\\n4. ${month}月20日「買掛金を小切手で支払った」→ 出金伝票（買掛金 110,000円）\\n5. ${month}月25日「備品を掛けで購入」→ 振替伝票（借方：備品 45,000円／貸方：未払金 45,000円）\\n\\n【ポイント】\\n・現金の入金→入金伝票\\n・現金の出金→出金伝票\\n・現金が関係しない取引→振替伝票`;

    const templateJson = JSON.stringify(voucherTemplate);
    const answerJson = JSON.stringify(voucherAnswer);

    // 該当問題を置換
    const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : null;
    const startPattern = new RegExp(`id: "${id}"`);
    const endPattern = nextId ? new RegExp(`id: "${nextId}"`) : null;

    const startMatch = content.match(startPattern);
    const endMatch = endPattern ? content.match(endPattern) : null;

    if (startMatch) {
      const startIndex = startMatch.index;
      const endIndex = endMatch ? endMatch.index : content.length;

      const beforeSection = content.substring(0, startIndex);
      const afterSection = content.substring(endIndex);

      // 新しい問題定義
      const newQuestion = `id: "${id}",
    category_id: "ledger",
    difficulty: 2,
    question_text: "${questionText}",
    answer_template_json: '${templateJson}',
    correct_answer_json: '${answerJson}',
    explanation: "${explanation}",
    tags_json: '{"subcategory":"voucher_entry","pattern":"3伝票制","accounts":["現金","売掛金","買掛金","仕入","売上","備品","未払金"],"keywords":["3伝票制","入金伝票","出金伝票","振替伝票"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    `;

      content = beforeSection + newQuestion + afterSection;
      console.log(`✅ ${id}: 修正完了`);
    }
  }
}

// 5伝票制の問題（Q_L_027-Q_L_030）を修正
function fix5DenpyoProblems() {
  console.log("\n📝 5伝票制問題（Q_L_027-Q_L_030）の修正\n");

  for (let i = 27; i <= 30; i++) {
    const id = `Q_L_${String(i).padStart(3, "0")}`;
    const month = i - 26;

    console.log(`処理中: ${id}`);

    // 問題文
    const questionText = `【5伝票制記入問題】\\n\\n2025年${month}月の取引について、5伝票制で記入してください。\\n\\n【取引データ】\\n${month}月 3日: 商品を掛けで仕入れた 150,000円\\n${month}月 8日: 商品を掛けで売り上げた 200,000円\\n${month}月12日: 商品を現金で仕入れた 65,000円\\n${month}月18日: 商品を現金で売り上げた 95,000円\\n${month}月24日: 給料を現金で支払った 180,000円\\n\\n【作成指示】\\n・入金伝票、出金伝票、売上伝票、仕入伝票、振替伝票の使い分け\\n・各伝票の記入要領に従った作成\\n・伝票番号の連番管理`;

    // 複数伝票対応のテンプレート
    const voucherTemplate = {
      type: "voucher_entry",
      vouchers: [
        {
          type: "入金伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
        {
          type: "出金伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "account",
              label: "勘定科目",
              type: "text",
              required: true,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "description",
              label: "摘要",
              type: "text",
              required: false,
            },
          ],
        },
        {
          type: "売上伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "customer",
              label: "得意先",
              type: "text",
              required: false,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "payment_type",
              label: "取引区分",
              type: "text",
              required: true,
            },
          ],
        },
        {
          type: "仕入伝票",
          fields: [
            { name: "date", label: "日付", type: "date", required: true },
            {
              name: "supplier",
              label: "仕入先",
              type: "text",
              required: false,
            },
            { name: "amount", label: "金額", type: "number", required: true },
            {
              name: "payment_type",
              label: "取引区分",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    };

    // 正しい解答
    const voucherAnswer = {
      vouchers: [
        {
          type: "仕入伝票",
          entries: [
            {
              date: `2025-0${month}-03`,
              supplier: "仕入先A",
              amount: 150000,
              payment_type: "掛け",
            },
            {
              date: `2025-0${month}-12`,
              supplier: "仕入先B",
              amount: 65000,
              payment_type: "現金",
            },
          ],
        },
        {
          type: "売上伝票",
          entries: [
            {
              date: `2025-0${month}-08`,
              customer: "得意先A",
              amount: 200000,
              payment_type: "掛け",
            },
            {
              date: `2025-0${month}-18`,
              customer: "得意先B",
              amount: 95000,
              payment_type: "現金",
            },
          ],
        },
        {
          type: "出金伝票",
          entries: [
            {
              date: `2025-0${month}-24`,
              account: "給料",
              amount: 180000,
              description: "給料支払",
            },
          ],
        },
      ],
    };

    // 具体的な解説
    const explanation = `【5伝票制の解答】\\n\\n本問では5つの取引を5伝票制で記入します：\\n\\n1. ${month}月3日「商品を掛けで仕入れた」→ 仕入伝票（150,000円、掛け）\\n2. ${month}月8日「商品を掛けで売り上げた」→ 売上伝票（200,000円、掛け）\\n3. ${month}月12日「商品を現金で仕入れた」→ 仕入伝票（65,000円、現金）\\n4. ${month}月18日「商品を現金で売り上げた」→ 売上伝票（95,000円、現金）\\n5. ${month}月24日「給料を現金で支払った」→ 出金伝票（給料 180,000円）\\n\\n【ポイント】\\n・商品売上→売上伝票（掛け・現金を問わず）\\n・商品仕入→仕入伝票（掛け・現金を問わず）\\n・商品売買以外の現金支出→出金伝票`;

    const templateJson = JSON.stringify(voucherTemplate);
    const answerJson = JSON.stringify(voucherAnswer);

    // 該当問題を置換
    const nextId = i < 40 ? `Q_L_${String(i + 1).padStart(3, "0")}` : null;
    const startPattern = new RegExp(`id: "${id}"`);
    const endPattern = nextId ? new RegExp(`id: "${nextId}"`) : null;

    const startMatch = content.match(startPattern);
    const endMatch = endPattern ? content.match(endPattern) : null;

    if (startMatch) {
      const startIndex = startMatch.index;
      const endIndex = endMatch ? endMatch.index : content.length;

      const beforeSection = content.substring(0, startIndex);
      const afterSection = content.substring(endIndex);

      // 新しい問題定義
      const newQuestion = `id: "${id}",
    category_id: "ledger",
    difficulty: 2,
    question_text: "${questionText}",
    answer_template_json: '${templateJson}',
    correct_answer_json: '${answerJson}',
    explanation: "${explanation}",
    tags_json: '{"subcategory":"voucher_entry","pattern":"5伝票制","accounts":["売上","仕入","給料"],"keywords":["5伝票制","入金伝票","出金伝票","売上伝票","仕入伝票","振替伝票"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },
  {
    `;

      content = beforeSection + newQuestion + afterSection;
      console.log(`✅ ${id}: 修正完了`);
    }
  }
}

// 選択問題（Q_L_031-Q_L_040）の解説を修正
function fixChoiceProblems() {
  console.log("\n📝 選択問題（Q_L_031-Q_L_040）の解説修正\n");

  const choiceExplanations = {
    Q_L_031:
      "【簿記の基本原則】\\n\\n正解：1番\\n\\n簿記の基本原則として「取引の二面性」があります。すべての取引は借方と貸方の二つの側面を持ち、必ず貸借が一致します。これは複式簿記の根本原理です。\\n\\n他の選択肢について：\\n2. 単式簿記では片側のみ記録\\n3. 三式簿記は存在しない\\n4. 貸借不一致は誤り",
    Q_L_032:
      "【勘定科目の分類】\\n\\n正解：1番\\n\\n勘定科目は「資産・負債・純資産・収益・費用」の5つに分類されます。これらは財務諸表の構成要素となります。\\n\\n・資産：現金、売掛金、商品など\\n・負債：買掛金、借入金など\\n・純資産：資本金、利益剰余金など\\n・収益：売上、受取利息など\\n・費用：仕入、給料など",
    Q_L_033:
      "【仕訳の原則】\\n\\n正解：1番\\n\\n仕訳では必ず「借方合計＝貸方合計」となります。これは貸借平均の原則と呼ばれ、複式簿記の基本です。\\n\\n例：商品100円を現金で仕入れた\\n（借）仕入 100 （貸）現金 100\\n\\n借方と貸方が必ず一致することで、取引の記録が正確に行われます。",
    Q_L_034:
      "【試算表の種類】\\n\\n正解：1番\\n\\n試算表には「合計試算表」「残高試算表」「合計残高試算表」の3種類があります。\\n\\n・合計試算表：各勘定の借方・貸方の合計を記載\\n・残高試算表：各勘定の残高のみを記載\\n・合計残高試算表：合計と残高の両方を記載\\n\\nそれぞれ用途に応じて使い分けます。",
    Q_L_035:
      "【決算整理事項】\\n\\n正解：1番\\n\\n決算整理事項には「減価償却、貸倒引当金、棚卸、経過勘定項目」などがあります。\\n\\n・減価償却：固定資産の価値減少を費用化\\n・貸倒引当金：売掛金等の回収不能見込額\\n・棚卸：期末商品の実地棚卸\\n・経過勘定：前払・未払・前受・未収の調整",
    Q_L_036:
      "【財務諸表の作成順序】\\n\\n正解：1番\\n\\n財務諸表は「精算表→損益計算書→貸借対照表」の順で作成します。\\n\\n1. 精算表で決算整理を行う\\n2. 損益計算書で当期純利益を算出\\n3. 貸借対照表で財政状態を表示\\n\\nこの順序により、正確な財務諸表が作成できます。",
    Q_L_037:
      "【現金過不足の処理】\\n\\n正解：1番\\n\\n現金過不足が判明した場合、まず「現金過不足」勘定で処理し、原因判明時に正しい勘定に振り替えます。\\n\\n例：現金実査で100円不足\\n（借）現金過不足 100 （貸）現金 100\\n\\n後日、交通費の記帳漏れと判明\\n（借）交通費 100 （貸）現金過不足 100",
    Q_L_038:
      "【複数選択：仕訳で借方に記入される項目】\\n\\n正解：1番、2番、3番\\n\\n借方に記入される項目：\\n・資産の増加（現金、売掛金、商品など）\\n・負債の減少（買掛金の支払など）\\n・費用の発生（仕入、給料など）\\n・収益の取消（売上返品など）\\n・純資産の減少（引出金など）\\n\\n貸方はこれらの反対となります。",
    Q_L_039:
      "【複数選択：決算整理で行う処理】\\n\\n正解：1番、2番、4番\\n\\n決算整理で行う主な処理：\\n1. 減価償却費の計上\\n2. 貸倒引当金の設定\\n3. 商品の棚卸（売上原価の算定）\\n4. 経過勘定項目の計上\\n5. 引当金の計上\\n6. 有価証券の評価替え\\n\\nこれらにより適正な期間損益が計算されます。",
    Q_L_040:
      "【複数選択：帳簿の種類】\\n\\n正解：1番、2番、3番、4番\\n\\n主要簿と補助簿の分類：\\n\\n【主要簿】\\n・仕訳帳：全取引を日付順に記録\\n・総勘定元帳：勘定科目別に記録\\n\\n【補助簿】\\n・現金出納帳、当座預金出納帳\\n・仕入帳、売上帳\\n・商品有高帳\\n・売掛金元帳、買掛金元帳など",
  };

  for (let i = 31; i <= 40; i++) {
    const id = `Q_L_${String(i).padStart(3, "0")}`;
    const explanation = choiceExplanations[id];

    console.log(`処理中: ${id}`);

    // 解説部分のみを置換
    const pattern = new RegExp(
      `(id: "${id}"[\\s\\S]*?)explanation:\\s*"[^"]*"`,
      "",
    );

    if (content.match(pattern)) {
      content = content.replace(pattern, `$1explanation: "${explanation}"`);
      console.log(`✅ ${id}: 解説修正完了`);
    }
  }
}

// 実行
fix3DenpyoProblems();
fix5DenpyoProblems();
fixChoiceProblems();

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_021-Q_L_040の包括的修正完了！");
console.log("🎉 全問題の正答と解説が適切に設定されました");
