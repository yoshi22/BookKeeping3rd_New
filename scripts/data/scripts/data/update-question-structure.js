"use strict";
/**
 * 問題構造更新スクリプト - CBTテンプレート適用
 * Phase A: 既存問題の20%（約60問）にテンプレート適用
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
exports.updateQuestionStructure = updateQuestionStructure;
exports.generateCBTTemplate = generateCBTTemplate;
exports.getPhaseAQuestions = getPhaseAQuestions;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// テンプレート定義
const TEMPLATE_DEFINITIONS = {
    // 総勘定元帳テンプレート
    general_ledger: {
        template_type: "general_ledger",
        layout_variant: "ledger_A",
        columns: [
            { key: "date", label: "日付", input: "text", width: 80, required: true },
            {
                key: "description",
                label: "摘要",
                input: "dropdown",
                width: 160,
                options_ref: "allowed_accounts",
                required: true,
            },
            { key: "debit", label: "借方", input: "currency", width: 120 },
            { key: "credit", label: "貸方", input: "currency", width: 120 },
            {
                key: "balance",
                label: "残高",
                input: "computed",
                width: 120,
                formula: "prev + debit - credit",
            },
        ],
        rows: [
            {
                row_id: "r1",
                label: "前月繰越",
                locked: true,
                default_values: {
                    date: "4/1",
                    description: "前月繰越",
                    debit: 0,
                    credit: 0,
                },
            },
            { row_id: "r2", label: "取引1", locked: false },
            { row_id: "r3", label: "取引2", locked: false },
            { row_id: "r4", label: "取引3", locked: false },
            { row_id: "r5", label: "取引4", locked: false },
        ],
        guidance: [
            {
                stage: 1,
                title: "取引確認",
                body: "問題文の取引明細を確認し、日付順に整理します。",
            },
            {
                stage: 2,
                title: "転記",
                body: "借方・貸方を入力すると残高が自動更新されます。",
            },
            {
                stage: 3,
                title: "残高検証",
                body: "合計残高を確認し、現金過不足を調整します。",
            },
        ],
        max_rows: 10,
        auto_calculate: true,
    },
    // 試算表テンプレート
    trial_balance_simple: {
        template_type: "trial_balance_simple",
        layout_variant: "trial_v1",
        columns: [
            {
                key: "accountName",
                label: "勘定科目",
                input: "text",
                width: 160,
                required: true,
            },
            { key: "debit", label: "借方", input: "currency", width: 120 },
            { key: "credit", label: "貸方", input: "currency", width: 120 },
        ],
        rows: [
            { row_id: "r1", label: "現金", locked: false },
            { row_id: "r2", label: "売掛金", locked: false },
            { row_id: "r3", label: "商品", locked: false },
            { row_id: "r4", label: "建物", locked: false },
            { row_id: "r5", label: "買掛金", locked: false },
        ],
        guidance: [
            {
                stage: 1,
                title: "整理事項確認",
                body: "決算整理事項を順番に確認します。",
            },
            { stage: 2, title: "勘定別集計", body: "各勘定科目の残高を計算します。" },
            {
                stage: 3,
                title: "借貸平均確認",
                body: "借方合計と貸方合計が一致することを確認します。",
            },
        ],
        max_rows: 20,
        auto_calculate: true,
    },
};
// 問題IDからテンプレートタイプを判定
function getTemplateType(questionId) {
    if (questionId.startsWith("Q_L_")) {
        const num = parseInt(questionId.split("_")[2]);
        if (num >= 1 && num <= 10)
            return "general_ledger";
        if (num >= 11 && num <= 20)
            return "subsidiary_ledger";
        if (num >= 21 && num <= 30)
            return "voucher";
        if (num >= 31 && num <= 40)
            return "ledger_mcq";
    }
    if (questionId.startsWith("Q_T_")) {
        const num = parseInt(questionId.split("_")[2]);
        if ((num >= 1 && num <= 4) || (num >= 9 && num <= 12))
            return "trial_balance_simple";
        if (num >= 5 && num <= 8)
            return "trial_balance_extended";
    }
    return null;
}
// allowed_accounts を取得（簡易版）
function getAllowedAccounts(questionId) {
    const templateType = getTemplateType(questionId);
    switch (templateType) {
        case "general_ledger":
            return ["現金", "売掛金", "売上", "現金過不足", "仕入", "買掛金"];
        case "trial_balance_simple":
            return [
                "現金",
                "売掛金",
                "商品",
                "建物",
                "買掛金",
                "売上",
                "仕入",
                "給料",
            ];
        default:
            return ["現金", "売掛金", "買掛金", "売上", "仕入"];
    }
}
// CBTテンプレートを生成
function generateCBTTemplate(questionId) {
    const templateType = getTemplateType(questionId);
    if (!templateType)
        return null;
    const baseTemplate = TEMPLATE_DEFINITIONS[templateType];
    if (!baseTemplate)
        return null;
    const allowedAccounts = getAllowedAccounts(questionId);
    return {
        template_type: templateType,
        layout_variant: baseTemplate.layout_variant,
        allowed_accounts: allowedAccounts,
        rows: baseTemplate.rows,
        columns: baseTemplate.columns,
        guidance: baseTemplate.guidance,
        max_rows: baseTemplate.max_rows,
        auto_calculate: baseTemplate.auto_calculate,
        validation_rules: ["required_fields", "balance_check"],
    };
}
// Phase A対象問題を取得（20%の問題）
function getPhaseAQuestions() {
    const phaseAQuestions = [];
    // 第2問から10問選択
    for (let i = 1; i <= 10; i++) {
        phaseAQuestions.push(`Q_L_${i.toString().padStart(3, "0")}`);
    }
    // 第3問から6問選択
    for (let i = 1; i <= 6; i++) {
        phaseAQuestions.push(`Q_T_${i.toString().padStart(3, "0")}`);
    }
    return phaseAQuestions;
}
// メイン実行関数
async function updateQuestionStructure() {
    console.log("🚀 Phase A: CBTテンプレート適用を開始します...");
    const phaseAQuestions = getPhaseAQuestions();
    console.log(`📋 対象問題: ${phaseAQuestions.length}問`);
    const updates = [];
    for (const questionId of phaseAQuestions) {
        const template = generateCBTTemplate(questionId);
        if (template) {
            updates.push({ questionId, template });
            console.log(`✅ ${questionId}: ${template.template_type} テンプレート生成完了`);
        }
        else {
            console.log(`⚠️  ${questionId}: テンプレート生成失敗`);
        }
    }
    // 結果をJSONファイルに出力
    const outputPath = path.join(__dirname, "phase-a-templates.json");
    fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2), "utf-8");
    console.log(`📄 テンプレートデータを出力: ${outputPath}`);
    console.log(`🎉 Phase A テンプレート適用完了: ${updates.length}問`);
    // 統計出力
    const templateTypes = updates.reduce((acc, { template }) => {
        acc[template.template_type] = (acc[template.template_type] || 0) + 1;
        return acc;
    }, {});
    console.log("\n📊 テンプレート種別統計:");
    Object.entries(templateTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}問`);
    });
}
// 実行
if (require.main === module) {
    updateQuestionStructure().catch(console.error);
}
