/**
 * 問題構造更新スクリプト
 * problemsStrategy.mdに基づく詳細分類・順序制御・タグ付けを実行
 */

import { databaseService } from "../../src/data/database";
import fs from "fs";
import path from "path";

// problemsStrategy.mdベースの詳細分類定義
const JOURNAL_SUBCATEGORIES = {
  cash_deposit: "現金・預金取引",
  merchandise_trade: "商品売買取引",
  receivables_debts: "債権・債務",
  salary_tax: "給与・税金",
  fixed_assets: "固定資産",
  year_end_adj: "決算整理",
};

const LEDGER_SUBCATEGORIES = {
  account_posting: "勘定記入問題",
  subsidiary_books: "補助簿記入問題",
  voucher_entry: "伝票記入問題",
  theory_selection: "理論・選択問題",
};

const TRIAL_BALANCE_SUBCATEGORIES = {
  financial_statements: "財務諸表作成",
  worksheet: "精算表作成",
  trial_balance: "試算表作成",
};

// problemsStrategy.mdベースの詳細パターン定義（第1問）
const JOURNAL_PATTERNS = {
  // カテゴリー1：現金・預金取引（42問）
  cash_deposit: [
    // 現金取引パターン（12問）
    {
      pattern: "現金過不足",
      count: 4,
      tags: ["現金過不足発見", "原因判明処理", "決算整理", "帳簿残高差額"],
    },
    {
      pattern: "小口現金",
      count: 3,
      tags: ["小口現金制度", "定期補給", "経費支払精算"],
    },
    {
      pattern: "その他現金取引",
      count: 5,
      tags: ["現金売上仕入", "給与支払", "経費支払", "税金支払", "利息配当"],
    },

    // 当座預金パターン（15問）
    {
      pattern: "当座預金基本取引",
      count: 6,
      tags: [
        "口座開設",
        "小切手振出",
        "振込入金",
        "現金引出",
        "口座振替",
        "振込手数料",
      ],
    },
    {
      pattern: "当座借越",
      count: 6,
      tags: [
        "借越契約",
        "残高不足振出",
        "借越利息",
        "借越返済",
        "借越解消",
        "限度額変更",
      ],
    },
    {
      pattern: "当座預金利息・手数料",
      count: 3,
      tags: ["預金利息", "銀行手数料", "振込手数料"],
    },

    // 普通預金・定期預金パターン（15問）
    {
      pattern: "普通預金取引",
      count: 8,
      tags: [
        "口座開設",
        "現金引出",
        "自動引落",
        "給与振込",
        "預金利息",
        "預金振替",
        "ATM手数料",
        "口座解約",
      ],
    },
    {
      pattern: "定期預金取引",
      count: 7,
      tags: [
        "定期預金",
        "満期解約",
        "中途解約",
        "自動継続",
        "担保貸付",
        "外貨預金",
        "預金振替",
      ],
    },
  ],

  // カテゴリー2：商品売買取引（45問）
  merchandise_trade: [
    // 基本売買パターン（15問）
    {
      pattern: "基本売買",
      count: 8,
      tags: [
        "現金仕入",
        "掛け仕入",
        "現金売上",
        "掛け売上",
        "買掛決済",
        "売掛回収",
        "混合取引",
        "三分法",
      ],
    },
    {
      pattern: "前払金・前受金",
      count: 4,
      tags: ["前払金支払", "前払決済", "前受金受取", "前受決済"],
    },
    {
      pattern: "分割取引",
      count: 3,
      tags: ["分割仕入", "分割売上", "割賦販売"],
    },

    // 返品・値引きパターン（10問）
    {
      pattern: "仕入返品・値引き",
      count: 5,
      tags: ["現金返品", "掛け返品", "仕入値引", "前払返品", "再販処理"],
    },
    {
      pattern: "売上返品・値引き",
      count: 5,
      tags: ["現金返品", "掛け返品", "売上値引", "前受返品", "返品理由"],
    },

    // 諸掛り・特殊取引パターン（12問）
    {
      pattern: "仕入諸掛り",
      count: 6,
      tags: [
        "運賃保険料",
        "立替処理",
        "引取運賃",
        "手数料",
        "関税通関",
        "諸掛決済",
      ],
    },
    {
      pattern: "売上諸掛り",
      count: 4,
      tags: ["販売運賃", "原価控除", "配送梱包", "販売手数料"],
    },
    { pattern: "特殊取引", count: 2, tags: ["委託販売", "試用販売"] },

    // 決算関連パターン（8問）
    {
      pattern: "売上原価算定",
      count: 4,
      tags: ["売上原価対立法", "分記転換", "決算振替", "月次算定"],
    },
    {
      pattern: "商品評価・調整",
      count: 4,
      tags: ["期末棚卸", "商品評価損", "廃棄盗難", "見切販売"],
    },
  ],

  // カテゴリー3：債権・債務（41問）
  receivables_debts: [
    // 売掛金・買掛金パターン（15問）
    {
      pattern: "売掛金管理",
      count: 8,
      tags: [
        "掛け売上",
        "現金回収",
        "一部回収",
        "手形決済",
        "相殺決済",
        "貸倒れ",
        "貸倒取消",
        "期限管理",
      ],
    },
    {
      pattern: "買掛金管理",
      count: 7,
      tags: [
        "掛け仕入",
        "現金支払",
        "一部支払",
        "手形決済",
        "相殺決済",
        "期限管理",
        "返品調整",
      ],
    },

    // 手形取引パターン（16問）
    {
      pattern: "受取手形",
      count: 8,
      tags: [
        "手形受取",
        "満期決済",
        "裏書譲渡",
        "手形割引",
        "裏書決済",
        "割引決済",
        "手形不渡",
        "取立依頼",
      ],
    },
    {
      pattern: "支払手形",
      count: 8,
      tags: [
        "手形振出",
        "満期決済",
        "期日前決済",
        "手形更新",
        "手形不渡",
        "手形再発行",
        "印紙税",
        "保証債務",
      ],
    },

    // 貸借取引パターン（10問）
    {
      pattern: "貸付金取引",
      count: 5,
      tags: ["金銭貸付", "貸付利息", "返済処理", "貸倒処理", "役員貸付"],
    },
    {
      pattern: "借入金取引",
      count: 5,
      tags: ["金銭借入", "借入利息", "返済処理", "繰上返済", "借替処理"],
    },
  ],

  // カテゴリー4：給与・税金（42問）
  salary_tax: [
    // 給与支払パターン（15問）
    {
      pattern: "基本給与処理",
      count: 8,
      tags: [
        "給与計算",
        "基本給手当",
        "源泉所得税",
        "住民税",
        "社会保険料",
        "雇用保険料",
        "差引支給",
        "未払計上",
      ],
    },
    {
      pattern: "賞与・特別給与",
      count: 4,
      tags: ["賞与支給", "決算賞与", "退職金", "役員報酬"],
    },
    {
      pattern: "給与関連費用",
      count: 3,
      tags: ["法定福利費", "福利厚生費", "労働保険料"],
    },

    // 源泉徴収・住民税パターン（12問）
    {
      pattern: "源泉所得税",
      count: 8,
      tags: [
        "給与源泉",
        "月次納付",
        "年末調整",
        "賞与源泉",
        "退職源泉",
        "報酬源泉",
        "納期特例",
        "延滞加算",
      ],
    },
    {
      pattern: "住民税",
      count: 4,
      tags: ["給与住民税", "月次納付", "税額変更", "一括普通"],
    },

    // 社会保険料パターン（9問）
    {
      pattern: "健康保険・厚生年金",
      count: 6,
      tags: [
        "従業員負担",
        "会社負担",
        "月次納付",
        "標準報酬",
        "賞与保険料",
        "資格得喪",
      ],
    },
    {
      pattern: "労働保険",
      count: 3,
      tags: ["労災保険", "雇用保険", "年度更新"],
    },

    // 法人税等パターン（6問）
    {
      pattern: "法人税・住民税・事業税",
      count: 4,
      tags: ["中間申告", "確定申告", "修正申告", "還付処理"],
    },
    { pattern: "消費税", count: 2, tags: ["中間申告", "確定申告"] },
  ],

  // カテゴリー5：固定資産（40問）
  fixed_assets: [
    // 取得パターン（15問）
    {
      pattern: "基本取得",
      count: 8,
      tags: [
        "現金購入",
        "掛け購入",
        "付随費用",
        "分割購入",
        "中古取得",
        "資産交換",
        "現物出資",
        "無償取得",
      ],
    },
    {
      pattern: "建設・製作",
      count: 4,
      tags: ["建設仮勘定", "建設完成", "自家製作", "改良修繕"],
    },
    {
      pattern: "特殊取得",
      count: 3,
      tags: ["リース資産", "無形資産", "投資不動産"],
    },

    // 減価償却パターン（15問）
    {
      pattern: "定額法",
      count: 6,
      tags: [
        "年間償却",
        "月割計算",
        "残存価額",
        "累計帳簿価額",
        "耐用変更",
        "少額資産",
      ],
    },
    {
      pattern: "定率法",
      count: 6,
      tags: [
        "年間償却",
        "月割計算",
        "改定取得",
        "償却保証",
        "累計帳簿価額",
        "中古耐用",
      ],
    },
    {
      pattern: "特殊償却",
      count: 3,
      tags: ["一括償却", "少額損金", "繰延資産"],
    },

    // 売却・除却パターン（10問）
    {
      pattern: "売却処理",
      count: 6,
      tags: ["売却益", "売却損", "期中売却", "分割回収", "交換差金", "消費税"],
    },
    {
      pattern: "除却・廃棄",
      count: 4,
      tags: ["除却損", "廃棄費用", "災害損失", "取壊費用"],
    },
  ],

  // カテゴリー6：決算整理（40問）
  year_end_adj: [
    // 引当金パターン（10問）
    {
      pattern: "貸倒引当金",
      count: 8,
      tags: [
        "差額補充法",
        "引当戻入",
        "実際貸倒",
        "償却取立",
        "個別一般",
        "他債権",
        "実績率",
        "法定繰入",
      ],
    },
    {
      pattern: "その他引当金",
      count: 2,
      tags: ["賞与引当金", "修繕退職引当金"],
    },

    // 経過勘定パターン（15問）
    {
      pattern: "前払費用",
      count: 4,
      tags: ["前払保険料", "前払家賃", "前払利息", "その他前払"],
    },
    {
      pattern: "前受収益",
      count: 3,
      tags: ["前受家賃", "前受利息", "その他前受"],
    },
    {
      pattern: "未払費用",
      count: 4,
      tags: ["未払給料", "未払利息", "未払家賃", "その他未払"],
    },
    {
      pattern: "未収収益",
      count: 4,
      tags: ["未収家賃", "未収利息", "未収手数料", "その他未収"],
    },

    // その他決算整理パターン（15問）
    {
      pattern: "棚卸資産",
      count: 5,
      tags: ["消耗品", "貯蔵品", "仕掛品", "商品棚卸", "評価損"],
    },
    {
      pattern: "収益・費用の整理",
      count: 5,
      tags: [
        "現金過不足",
        "純利益振替",
        "引出金振替",
        "仮勘定振替",
        "適正科目",
      ],
    },
    {
      pattern: "税務・その他",
      count: 5,
      tags: ["減価償却", "売上原価", "法人税等", "消費税", "圧縮特償"],
    },
  ],
};

// 第2問のパターン定義
const LEDGER_PATTERNS = {
  account_posting: [
    {
      pattern: "資産勘定",
      count: 4,
      tags: ["現金勘定", "売掛金勘定", "商品勘定", "建物勘定"],
    },
    {
      pattern: "負債・純資産勘定",
      count: 3,
      tags: ["買掛金勘定", "借入金勘定", "引当金勘定"],
    },
    {
      pattern: "収益・費用勘定",
      count: 3,
      tags: ["売上仕入", "給料未払", "諸口転記"],
    },
  ],
  subsidiary_books: [
    {
      pattern: "現金・預金補助簿",
      count: 4,
      tags: ["現金出納帳", "当座出納帳", "小口出納帳", "預金通帳"],
    },
    {
      pattern: "売買補助簿",
      count: 4,
      tags: ["仕入帳", "売上帳", "先入先出", "移動平均"],
    },
    {
      pattern: "債権・債務補助簿",
      count: 2,
      tags: ["売買掛元帳", "手形記入帳"],
    },
  ],
  voucher_entry: [
    {
      pattern: "3伝票制",
      count: 6,
      tags: [
        "入金伝票",
        "出金伝票",
        "振替伝票",
        "掛け取引",
        "一部現金",
        "仕訳日計",
      ],
    },
    {
      pattern: "5伝票制",
      count: 4,
      tags: ["売上伝票", "仕入伝票", "取引分類", "総勘定転記"],
    },
  ],
  theory_selection: [
    {
      pattern: "帳簿組織",
      count: 4,
      tags: ["主補関係", "帳簿選択", "法的義務", "訂正方法"],
    },
    {
      pattern: "簿記理論",
      count: 3,
      tags: ["5要素分類", "借貸ルール", "貸借等式"],
    },
    {
      pattern: "試算表・決算",
      count: 3,
      tags: ["試算表種類", "決算意義", "会計期間"],
    },
  ],
};

// 第3問のパターン定義
const TRIAL_BALANCE_PATTERNS = {
  financial_statements: [
    {
      pattern: "基礎レベル",
      count: 1,
      tags: ["決算整理5項目", "簡易財務諸表"],
    },
    { pattern: "標準レベル", count: 1, tags: ["決算整理8項目", "勘定式"] },
    { pattern: "応用レベル", count: 1, tags: ["決算整理10項目", "報告式"] },
    {
      pattern: "発展レベル",
      count: 1,
      tags: ["決算整理12項目", "完全財務諸表"],
    },
  ],
  worksheet: [
    { pattern: "基礎レベル", count: 1, tags: ["6桁精算表", "基本整理"] },
    { pattern: "標準レベル", count: 1, tags: ["8桁精算表", "経過勘定"] },
    { pattern: "応用レベル", count: 1, tags: ["8桁完備", "応用整理"] },
    { pattern: "発展レベル", count: 1, tags: ["高難度整理", "特殊税務"] },
  ],
  trial_balance: [
    { pattern: "基礎レベル", count: 1, tags: ["合計試算表", "単純取引"] },
    { pattern: "標準レベル", count: 1, tags: ["残高試算表", "手形固定資産"] },
    { pattern: "応用レベル", count: 1, tags: ["整理前試算表", "修正仕訳"] },
    { pattern: "発展レベル", count: 1, tags: ["整理後試算表", "完全処理"] },
  ],
};

async function updateQuestionStructure() {
  console.log("=== 問題構造更新開始 ===");

  try {
    // データベース初期化
    console.log("データベース接続中...");
    await databaseService.initialize();

    if (!databaseService.isConnected()) {
      throw new Error("データベース接続失敗");
    }

    console.log("問題データ取得中...");
    const questions = await databaseService.executeSql(
      "SELECT id, category_id, difficulty, tags_json FROM questions ORDER BY category_id, id",
    );

    console.log(`取得問題数: ${questions.rows.length}件`);

    // カテゴリ別の問題を分類
    const journalQuestions = questions.rows.filter(
      (q) => q.category_id === "journal",
    );
    const ledgerQuestions = questions.rows.filter(
      (q) => q.category_id === "ledger",
    );
    const trialBalanceQuestions = questions.rows.filter(
      (q) => q.category_id === "trial_balance",
    );

    console.log(`第1問(仕訳): ${journalQuestions.length}問`);
    console.log(`第2問(帳簿): ${ledgerQuestions.length}問`);
    console.log(`第3問(試算表): ${trialBalanceQuestions.length}問`);

    // 第1問の更新
    await updateJournalQuestions(journalQuestions);

    // 第2問の更新
    await updateLedgerQuestions(ledgerQuestions);

    // 第3問の更新
    await updateTrialBalanceQuestions(trialBalanceQuestions);

    console.log("=== 問題構造更新完了 ===");

    // 更新結果の確認
    const updatedQuestions = await databaseService.executeSql(`
      SELECT category_id, subcategory, pattern_type, COUNT(*) as count 
      FROM questions 
      WHERE subcategory IS NOT NULL 
      GROUP BY category_id, subcategory, pattern_type 
      ORDER BY category_id, subcategory, pattern_type
    `);

    console.log("\n=== 更新結果 ===");
    for (const row of updatedQuestions.rows) {
      console.log(
        `${row.category_id} / ${row.subcategory} / ${row.pattern_type}: ${row.count}問`,
      );
    }
  } catch (error) {
    console.error("問題構造更新エラー:", error);
    throw error;
  }
}

async function updateJournalQuestions(questions: any[]) {
  console.log("\n第1問（仕訳）の構造更新中...");

  let questionIndex = 0;
  let globalOrder = 1;

  // 各サブカテゴリを順番に処理
  for (const [subcategoryKey, subcategoryName] of Object.entries(
    JOURNAL_SUBCATEGORIES,
  )) {
    console.log(`\n処理中: ${subcategoryName}`);
    const patterns = (JOURNAL_PATTERNS as any)[subcategoryKey] || [];

    for (const patternInfo of patterns) {
      const { pattern, count, tags } = patternInfo;
      console.log(`  パターン: ${pattern} (${count}問)`);

      // 指定された問題数分を更新
      for (let i = 0; i < count && questionIndex < questions.length; i++) {
        const question = questions[questionIndex];

        await databaseService.executeSql(
          `
          UPDATE questions 
          SET subcategory = ?, 
              section_number = 1,
              question_order = ?,
              pattern_type = ?,
              tags_json = ?
          WHERE id = ?
        `,
          [
            subcategoryKey,
            globalOrder,
            pattern,
            JSON.stringify(tags),
            question.id,
          ],
        );

        questionIndex++;
        globalOrder++;

        if (questionIndex % 10 === 0) {
          console.log(`    進捗: ${questionIndex}/${questions.length}問完了`);
        }
      }
    }
  }

  console.log(`第1問更新完了: ${questionIndex}問処理`);
}

async function updateLedgerQuestions(questions: any[]) {
  console.log("\n第2問（帳簿）の構造更新中...");

  let questionIndex = 0;
  let globalOrder = 1;

  // 各サブカテゴリを順番に処理
  for (const [subcategoryKey, subcategoryName] of Object.entries(
    LEDGER_SUBCATEGORIES,
  )) {
    console.log(`\n処理中: ${subcategoryName}`);
    const patterns = (LEDGER_PATTERNS as any)[subcategoryKey] || [];

    for (const patternInfo of patterns) {
      const { pattern, count, tags } = patternInfo;
      console.log(`  パターン: ${pattern} (${count}問)`);

      // 指定された問題数分を更新
      for (let i = 0; i < count && questionIndex < questions.length; i++) {
        const question = questions[questionIndex];

        await databaseService.executeSql(
          `
          UPDATE questions 
          SET subcategory = ?, 
              section_number = 2,
              question_order = ?,
              pattern_type = ?,
              tags_json = ?
          WHERE id = ?
        `,
          [
            subcategoryKey,
            globalOrder,
            pattern,
            JSON.stringify(tags),
            question.id,
          ],
        );

        questionIndex++;
        globalOrder++;
      }
    }
  }

  console.log(`第2問更新完了: ${questionIndex}問処理`);
}

async function updateTrialBalanceQuestions(questions: any[]) {
  console.log("\n第3問（試算表）の構造更新中...");

  let questionIndex = 0;
  let globalOrder = 1;

  // 各サブカテゴリを順番に処理
  for (const [subcategoryKey, subcategoryName] of Object.entries(
    TRIAL_BALANCE_SUBCATEGORIES,
  )) {
    console.log(`\n処理中: ${subcategoryName}`);
    const patterns = (TRIAL_BALANCE_PATTERNS as any)[subcategoryKey] || [];

    for (const patternInfo of patterns) {
      const { pattern, count, tags } = patternInfo;
      console.log(`  パターン: ${pattern} (${count}問)`);

      // 指定された問題数分を更新
      for (let i = 0; i < count && questionIndex < questions.length; i++) {
        const question = questions[questionIndex];

        await databaseService.executeSql(
          `
          UPDATE questions 
          SET subcategory = ?, 
              section_number = 3,
              question_order = ?,
              pattern_type = ?,
              tags_json = ?
          WHERE id = ?
        `,
          [
            subcategoryKey,
            globalOrder,
            pattern,
            JSON.stringify(tags),
            question.id,
          ],
        );

        questionIndex++;
        globalOrder++;
      }
    }
  }

  console.log(`第3問更新完了: ${questionIndex}問処理`);
}

// スクリプト実行
if (require.main === module) {
  updateQuestionStructure()
    .then(() => {
      console.log("\n✅ 問題構造更新成功");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ 問題構造更新失敗:", error);
      process.exit(1);
    });
}

module.exports = { updateQuestionStructure };
