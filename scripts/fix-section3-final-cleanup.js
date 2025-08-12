#!/usr/bin/env node

/**
 * 第三問の最終クリーンアップ - 二重テンプレート問題を修正
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔧 第三問の二重テンプレート問題を修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// Q_T_001-012それぞれに対して、二重テンプレートを修正
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // 不要な ledger_entry テンプレートを削除
  // パターン: }"type":"ledger_entry"...}",
  const doubleTemplatePattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*"[^"]*?\\})(\"type[^"]*?ledger_entry[^"]*?\\})"`,
    "g",
  );

  content = content.replace(doubleTemplatePattern, (match, p1, p2) => {
    console.log(`✅ ${id} の二重テンプレートを修正`);
    return p1 + '"';
  });

  // 正解データも修正（trialBalanceだけの単純な形式から適切な形式へ）
  if (i >= 1 && i <= 4) {
    // 財務諸表用の正解データ（既に修正済みの場合はスキップ）
    const correctAnswerPattern = new RegExp(
      `("id":\\s*"${id}"[\\s\\S]*?"correct_answer_json":\\s*")\\{[^}]*?trialBalance[^}]*?\\}(")`,
      "g",
    );

    content = content.replace(correctAnswerPattern, (match, p1, p2) => {
      console.log(`✅ ${id} の正解データを財務諸表形式に修正`);
      const newAnswer = {
        balance_sheet: {
          assets: { current: {}, fixed: {}, total: 0 },
          liabilities: { current: {}, fixed: {}, total: 0 },
          equity: { capital: 0, retained_earnings: 0, total: 0 },
          total: 0,
        },
        income_statement: {
          sales: 0,
          cost_of_sales: 0,
          gross_profit: 0,
          operating_expenses: {},
          operating_income: 0,
          net_income: 0,
        },
      };
      return p1 + JSON.stringify(newAnswer).replace(/"/g, '\\"') + p2;
    });
  } else if (i >= 5 && i <= 8) {
    // 精算表用の正解データ
    const correctAnswerPattern = new RegExp(
      `("id":\\s*"${id}"[\\s\\S]*?"correct_answer_json":\\s*")\\{[^}]*?trialBalance[^}]*?\\}(")`,
      "g",
    );

    content = content.replace(correctAnswerPattern, (match, p1, p2) => {
      console.log(`✅ ${id} の正解データを精算表形式に修正`);
      const newAnswer = {
        worksheet: {
          accounts: [],
          totals: {
            trial: { debit: 0, credit: 0 },
            adjustments: { debit: 0, credit: 0 },
            income: { debit: 0, credit: 0 },
            balance: { debit: 0, credit: 0 },
          },
        },
      };
      return p1 + JSON.stringify(newAnswer).replace(/"/g, '\\"') + p2;
    });
  } else if (i >= 9 && i <= 12) {
    // 試算表用の正解データ
    const correctAnswerPattern = new RegExp(
      `("id":\\s*"${id}"[\\s\\S]*?"correct_answer_json":\\s*")\\{[^}]*?trialBalance[^}]*?\\}(")`,
      "g",
    );

    content = content.replace(correctAnswerPattern, (match, p1, p2) => {
      console.log(`✅ ${id} の正解データを試算表形式に修正`);
      const newAnswer = {
        trial_balance: {
          accounts: [],
          totals: {
            debit: 0,
            credit: 0,
            difference: 0,
          },
        },
      };
      return p1 + JSON.stringify(newAnswer).replace(/"/g, '\\"') + p2;
    });
  }
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ 第三問の最終クリーンアップが完了しました！");
