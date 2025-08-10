"use strict";
/**
 * 問題データマスター生成スクリプト
 * problemsStrategy.mdの要件を完全に満たす問題データを生成
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ========== 設定定数 ==========
const QUESTION_TARGETS = {
    journal: {
        total: 250,
        subcategories: {
            cash_deposit: 42,
            sales_purchase: 45,
            receivable_payable: 41,
            salary_tax: 42,
            fixed_asset: 40,
            adjustment: 40,
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
            {
                name: "現金過不足",
                template: "現金実査の結果、現金の実際有高が{amount1}円であったが、帳簿残高は{amount2}円であった。",
                accounts: ["現金", "現金過不足"],
                keywords: ["現金実査", "実際有高", "帳簿残高"],
            },
            {
                name: "小口現金",
                template: "小口現金係に{amount}円を前渡しした。",
                accounts: ["小口現金", "現金"],
                keywords: ["小口現金", "前渡し", "インプレスト"],
            },
            {
                name: "当座預金振込",
                template: "売掛金{amount}円が当座預金口座に振り込まれた。",
                accounts: ["当座預金", "売掛金"],
                keywords: ["当座預金", "振込", "売掛金回収"],
            },
            {
                name: "当座借越",
                template: "当座預金残高が不足したため、買掛金{amount}円の支払いで当座借越となった。",
                accounts: ["買掛金", "当座借越"],
                keywords: ["当座借越", "残高不足", "買掛金支払"],
            },
        ],
    },
    sales_purchase: {
        patterns: [
            {
                name: "商品仕入",
                template: "商品{amount}円を仕入れ、代金は掛けとした。",
                accounts: ["仕入", "買掛金"],
                keywords: ["仕入", "買掛金", "掛け仕入"],
            },
            {
                name: "商品売上",
                template: "商品を{amount}円で販売し、代金は現金で受け取った。",
                accounts: ["現金", "売上"],
                keywords: ["売上", "現金売上", "販売"],
            },
            {
                name: "仕入戻し",
                template: "仕入れた商品のうち{amount}円分を品違いのため返品した。",
                accounts: ["買掛金", "仕入"],
                keywords: ["仕入戻し", "返品", "品違い"],
            },
            {
                name: "売上戻り",
                template: "売上げた商品のうち{amount}円分が品違いのため返品された。",
                accounts: ["売上", "売掛金"],
                keywords: ["売上戻り", "返品", "品違い"],
            },
        ],
    },
    receivable_payable: {
        patterns: [
            {
                name: "売掛金回収",
                template: "売掛金{amount}円を現金で回収した。",
                accounts: ["現金", "売掛金"],
                keywords: ["売掛金", "回収", "現金"],
            },
            {
                name: "買掛金支払",
                template: "買掛金{amount}円を小切手を振り出して支払った。",
                accounts: ["買掛金", "当座預金"],
                keywords: ["買掛金", "支払", "小切手"],
            },
            {
                name: "手形受取",
                template: "売掛金{amount}円の代金として約束手形を受け取った。",
                accounts: ["受取手形", "売掛金"],
                keywords: ["受取手形", "約束手形", "売掛金"],
            },
            {
                name: "手形支払",
                template: "買掛金{amount}円の支払いのため約束手形を振り出した。",
                accounts: ["買掛金", "支払手形"],
                keywords: ["支払手形", "約束手形", "買掛金"],
            },
        ],
    },
    salary_tax: {
        patterns: [
            {
                name: "給料支払",
                template: "従業員に給料{amount1}円を支払った。なお、源泉所得税{amount2}円を差し引いた。",
                accounts: ["給料", "現金", "預り金"],
                keywords: ["給料", "源泉所得税", "預り金"],
            },
            {
                name: "社会保険料",
                template: "社会保険料{amount1}円（会社負担{amount2}円、従業員負担{amount3}円）を現金で支払った。",
                accounts: ["法定福利費", "預り金", "現金"],
                keywords: ["社会保険料", "法定福利費", "預り金"],
            },
            {
                name: "租税公課",
                template: "固定資産税{amount}円を現金で納付した。",
                accounts: ["租税公課", "現金"],
                keywords: ["固定資産税", "租税公課", "納付"],
            },
            {
                name: "法人税等",
                template: "法人税等{amount}円を当座預金から納付した。",
                accounts: ["法人税等", "当座預金"],
                keywords: ["法人税", "納付", "当座預金"],
            },
        ],
    },
    fixed_asset: {
        patterns: [
            {
                name: "固定資産購入",
                template: "備品{amount}円を購入し、代金は現金で支払った。",
                accounts: ["備品", "現金"],
                keywords: ["備品", "固定資産", "購入"],
            },
            {
                name: "減価償却",
                template: "決算において、建物の減価償却費{amount}円を計上する。",
                accounts: ["減価償却費", "建物減価償却累計額"],
                keywords: ["減価償却", "決算", "建物"],
            },
            {
                name: "固定資産売却",
                template: "帳簿価額{amount1}円の車両を{amount2}円で売却し、代金は現金で受け取った。",
                accounts: ["現金", "車両", "固定資産売却益"],
                keywords: ["固定資産売却", "車両", "売却益"],
            },
            {
                name: "固定資産除却",
                template: "使用不能となった備品（取得原価{amount1}円、減価償却累計額{amount2}円）を除却した。",
                accounts: ["備品減価償却累計額", "固定資産除却損", "備品"],
                keywords: ["除却", "備品", "除却損"],
            },
        ],
    },
    adjustment: {
        patterns: [
            {
                name: "貸倒引当金設定",
                template: "決算において、売掛金{amount1}円に対して{percent}%の貸倒引当金を設定する。",
                accounts: ["貸倒引当金繰入", "貸倒引当金"],
                keywords: ["貸倒引当金", "決算", "売掛金"],
            },
            {
                name: "売上原価算定",
                template: "期首商品棚卸高{amount1}円、当期商品仕入高{amount2}円、期末商品棚卸高{amount3}円である。",
                accounts: ["仕入", "繰越商品"],
                keywords: ["売上原価", "棚卸", "仕入"],
            },
            {
                name: "前払費用",
                template: "支払保険料{amount1}円のうち、{amount2}円は次期分である。",
                accounts: ["前払費用", "保険料"],
                keywords: ["前払費用", "保険料", "決算整理"],
            },
            {
                name: "未払費用",
                template: "当期の支払利息{amount}円が未払いである。",
                accounts: ["支払利息", "未払費用"],
                keywords: ["未払費用", "支払利息", "決算整理"],
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
function generateQuestionId(category, index) {
    const prefix = {
        journal: "Q_J",
        ledger: "Q_L",
        trial_balance: "Q_T",
    }[category];
    return `${prefix}_${String(index).padStart(3, "0")}`;
}
function generateAmount() {
    // 100円単位で1,000円から999,000円までのランダムな金額
    return Math.floor(Math.random() * 999 + 1) * 1000;
}
function getCurrentTimestamp() {
    return new Date().toISOString();
}
function calculateDifficulty(index, total, distribution) {
    const ratio = index / total;
    const level1Threshold = distribution[1];
    const level2Threshold = distribution[1] + distribution[2];
    if (ratio < level1Threshold)
        return 1;
    if (ratio < level2Threshold)
        return 2;
    return 3;
}
function serializeTags(tags) {
    return JSON.stringify(tags, null, 0);
}
// ========== 問題生成関数 ==========
function generateJournalQuestions() {
    const questions = [];
    let questionIndex = 1;
    // 各サブカテゴリーごとに問題を生成
    for (const [subcategory, targetCount] of Object.entries(QUESTION_TARGETS.journal.subcategories)) {
        const templates = JOURNAL_TEMPLATES[subcategory];
        for (let i = 0; i < targetCount; i++) {
            const pattern = templates.patterns[i % templates.patterns.length];
            const difficulty = calculateDifficulty(i, targetCount, DIFFICULTY_DISTRIBUTION.journal);
            // 金額を生成
            const amount1 = generateAmount();
            const amount2 = generateAmount();
            const amount3 = Math.floor(amount2 * 0.1); // 10%など
            // 問題文を生成
            let questionText = pattern.template
                .replace("{amount}", amount1.toLocaleString())
                .replace("{amount1}", amount1.toLocaleString())
                .replace("{amount2}", amount2.toLocaleString())
                .replace("{amount3}", amount3.toLocaleString())
                .replace("{percent}", "2");
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
            // タグを生成
            const tags = {
                subcategory: subcategory,
                pattern: pattern.name,
                accounts: pattern.accounts,
                keywords: pattern.keywords,
                examSection: 1,
            };
            // 問題を作成
            const question = {
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
function generateLedgerQuestions() {
    const questions = [];
    let questionIndex = 1;
    for (const [pattern, targetCount] of Object.entries(QUESTION_TARGETS.ledger.patterns)) {
        const templates = LEDGER_TEMPLATES[pattern];
        for (let i = 0; i < targetCount; i++) {
            const patternTemplate = templates.patterns[0];
            const difficulty = calculateDifficulty(i, targetCount, DIFFICULTY_DISTRIBUTION.ledger);
            const amount = generateAmount();
            let questionText = patternTemplate.template.replace("{amount}", amount.toLocaleString());
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
            const tags = {
                subcategory: pattern,
                pattern: patternTemplate.name,
                accounts: [],
                keywords: patternTemplate.keywords,
                examSection: 2,
            };
            const question = {
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
function generateTrialBalanceQuestions() {
    const questions = [];
    let questionIndex = 1;
    for (const [pattern, targetCount] of Object.entries(QUESTION_TARGETS.trial_balance.patterns)) {
        const templates = TRIAL_BALANCE_TEMPLATES[pattern];
        for (let i = 0; i < targetCount; i++) {
            const patternTemplate = templates.patterns[0];
            const difficulty = calculateDifficulty(i, targetCount, DIFFICULTY_DISTRIBUTION.trial_balance);
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
            const tags = {
                subcategory: pattern,
                pattern: patternTemplate.name,
                accounts: [],
                keywords: patternTemplate.keywords,
                examSection: 3,
            };
            const question = {
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
function validateQuestions(questions) {
    const result = {
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
    const ids = new Set();
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
            const tags = JSON.parse(q.tags_json);
            const key = `${q.category_id}_${tags.subcategory}`;
            result.statistics.bySubcategory[key] =
                (result.statistics.bySubcategory[key] || 0) + 1;
        }
    }
    // 目標数との比較
    // 仕訳問題
    const journalCount = result.statistics.byCategory["journal"] || 0;
    if (journalCount !== QUESTION_TARGETS.journal.total) {
        result.errors.push(`仕訳問題数不一致: 期待${QUESTION_TARGETS.journal.total}問、実際${journalCount}問`);
        result.valid = false;
    }
    // 仕訳サブカテゴリー
    for (const [sub, target] of Object.entries(QUESTION_TARGETS.journal.subcategories)) {
        const actual = result.statistics.bySubcategory[`journal_${sub}`] || 0;
        if (actual !== target) {
            result.errors.push(`仕訳/${sub}の問題数不一致: 期待${target}問、実際${actual}問`);
            result.valid = false;
        }
    }
    // 帳簿問題
    const ledgerCount = result.statistics.byCategory["ledger"] || 0;
    if (ledgerCount !== QUESTION_TARGETS.ledger.total) {
        result.errors.push(`帳簿問題数不一致: 期待${QUESTION_TARGETS.ledger.total}問、実際${ledgerCount}問`);
        result.valid = false;
    }
    // 試算表問題
    const trialBalanceCount = result.statistics.byCategory["trial_balance"] || 0;
    if (trialBalanceCount !== QUESTION_TARGETS.trial_balance.total) {
        result.errors.push(`試算表問題数不一致: 期待${QUESTION_TARGETS.trial_balance.total}問、実際${trialBalanceCount}問`);
        result.valid = false;
    }
    // 難易度分布チェック
    for (const [category, distribution] of Object.entries(DIFFICULTY_DISTRIBUTION)) {
        const total = result.statistics.byCategory[category] || 0;
        if (total > 0) {
            for (const [level, ratio] of Object.entries(distribution)) {
                const expected = Math.round(total * ratio);
                const actual = result.statistics.byDifficulty[category][parseInt(level)] || 0;
                const diff = Math.abs(expected - actual);
                if (diff > 2) {
                    // 許容誤差2問まで
                    result.warnings.push(`${category}の難易度${level}分布: 期待${expected}問±2、実際${actual}問`);
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
    for (const [subcat, count] of Object.entries(validation.statistics.bySubcategory)) {
        console.log(`     ${subcat}: ${count}問`);
    }
    console.log("\n   難易度分布:");
    for (const [cat, levels] of Object.entries(validation.statistics.byDifficulty)) {
        console.log(`     ${cat}:`);
        for (const [level, count] of Object.entries(levels)) {
            console.log(`       難易度${level}: ${count}問`);
        }
    }
    // ファイル出力
    if (validation.valid) {
        const outputPath = path.join(__dirname, "..", "src", "data", "master-questions.ts");
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
    }
    else {
        console.log("\n❌ 検証エラーのため出力をスキップしました");
        process.exit(1);
    }
}
// 実行
main().catch(console.error);
