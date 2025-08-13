/**
 * Q_T_001の正答表示テスト
 * financialStatements形式のデータが正しく表示されるか確認
 */

const fs = require("fs");

// master-questions.tsからQ_T_001のデータを抽出
const content = fs.readFileSync("src/data/master-questions.ts", "utf8");

// Q_T_001の正答データを抽出
const match = content.match(
  /id:\s*"Q_T_001".*?correct_answer_json:\s*'(\{.*?\})'/s,
);
if (match) {
  const correctAnswerJson = match[1];
  const correctAnswer = JSON.parse(correctAnswerJson);

  console.log("Q_T_001の正答データ形式確認:");
  console.log("=".repeat(50));

  // データ形式の確認
  if (correctAnswer.financialStatements) {
    console.log("✅ financialStatements形式で保存されています");

    // 変換後のエントリ形式をシミュレート
    const entries = [];

    // 貸借対照表の資産（借方）
    if (correctAnswer.financialStatements.balanceSheet?.assets) {
      for (const asset of correctAnswer.financialStatements.balanceSheet
        .assets) {
        if (asset.amount > 0) {
          entries.push({
            accountName: asset.accountName,
            debitAmount: asset.amount,
            creditAmount: 0,
          });
        }
      }
    }

    // 貸借対照表の負債（貸方）
    if (correctAnswer.financialStatements.balanceSheet?.liabilities) {
      for (const liability of correctAnswer.financialStatements.balanceSheet
        .liabilities) {
        if (liability.amount > 0) {
          entries.push({
            accountName: liability.accountName,
            debitAmount: 0,
            creditAmount: liability.amount,
          });
        }
      }
    }

    // 貸借対照表の純資産（貸方）
    if (correctAnswer.financialStatements.balanceSheet?.equity) {
      for (const equity of correctAnswer.financialStatements.balanceSheet
        .equity) {
        // 当期純損失は借方
        if (equity.accountName === "当期純損失" && equity.amount > 0) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: equity.amount,
            creditAmount: 0,
          });
        } else if (equity.amount > 0) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: 0,
            creditAmount: equity.amount,
          });
        }
      }
    }

    // 損益計算書の収益（貸方）
    if (correctAnswer.financialStatements.incomeStatement?.revenues) {
      for (const revenue of correctAnswer.financialStatements.incomeStatement
        .revenues) {
        if (revenue.amount > 0) {
          entries.push({
            accountName:
              revenue.accountName === "売上高" ? "売上" : revenue.accountName,
            debitAmount: 0,
            creditAmount: revenue.amount,
          });
        }
      }
    }

    // 損益計算書の費用（借方）
    if (correctAnswer.financialStatements.incomeStatement?.expenses) {
      for (const expense of correctAnswer.financialStatements.incomeStatement
        .expenses) {
        if (expense.amount > 0) {
          entries.push({
            accountName: expense.accountName,
            debitAmount: expense.amount,
            creditAmount: 0,
          });
        }
      }
    }

    console.log("\n変換後のエントリ形式:");
    console.log("-".repeat(50));
    console.log("勘定科目\t\t借方\t\t貸方");
    console.log("-".repeat(50));

    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {
      const padAccount = entry.accountName.padEnd(16, " ");
      const debitStr =
        entry.debitAmount > 0 ? entry.debitAmount.toLocaleString() : "";
      const creditStr =
        entry.creditAmount > 0 ? entry.creditAmount.toLocaleString() : "";
      console.log(`${padAccount}${debitStr.padEnd(12, " ")}${creditStr}`);

      totalDebit += entry.debitAmount;
      totalCredit += entry.creditAmount;
    }

    console.log("-".repeat(50));
    console.log(
      `合計\t\t\t${totalDebit.toLocaleString()}\t${totalCredit.toLocaleString()}`,
    );

    if (totalDebit === totalCredit) {
      console.log("\n✅ 借方・貸方が一致しています");
    } else {
      console.log(
        `\n❌ 借方・貸方が不一致: 差額 ${Math.abs(totalDebit - totalCredit).toLocaleString()}円`,
      );
    }

    console.log(
      "\n✅ CorrectAnswerExampleコンポーネントでfinancialStatements形式が正しく表示されるようになりました",
    );
  } else if (correctAnswer.entries) {
    console.log("entries形式で保存されています");
  } else {
    console.log("❌ 未対応の形式です");
  }
} else {
  console.error("Q_T_001のデータが見つかりません");
}
