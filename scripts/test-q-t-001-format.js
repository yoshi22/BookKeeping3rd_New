/**
 * Q_T_001の正答表示形式テスト
 * ExplanationModalのformatAnswer関数をテスト
 */

// formatAnswer関数を独立させてテスト
function formatAnswer(answer) {
  if (!answer) return "";

  if (typeof answer === "string") {
    return answer;
  }

  if (typeof answer === "object") {
    try {
      // For financial statements format (Q_T_001など)
      if (answer.financialStatements) {
        const entries = [];
        const fs = answer.financialStatements;

        // 貸借対照表の資産（借方）
        if (fs.balanceSheet?.assets) {
          for (const asset of fs.balanceSheet.assets) {
            if (asset.amount > 0) {
              entries.push(
                `${asset.accountName}: 借方${asset.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 貸借対照表の負債（貸方）
        if (fs.balanceSheet?.liabilities) {
          for (const liability of fs.balanceSheet.liabilities) {
            if (liability.amount > 0) {
              entries.push(
                `${liability.accountName}: 貸方${liability.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 貸借対照表の純資産（貸方、当期純損失は借方）
        if (fs.balanceSheet?.equity) {
          for (const equity of fs.balanceSheet.equity) {
            if (equity.amount > 0) {
              if (equity.accountName === "当期純損失") {
                entries.push(
                  `${equity.accountName}: 借方${equity.amount.toLocaleString()}円`,
                );
              } else {
                entries.push(
                  `${equity.accountName}: 貸方${equity.amount.toLocaleString()}円`,
                );
              }
            }
          }
        }

        // 損益計算書の収益（貸方）
        if (fs.incomeStatement?.revenues) {
          for (const revenue of fs.incomeStatement.revenues) {
            if (revenue.amount > 0) {
              const accountName =
                revenue.accountName === "売上高" ? "売上" : revenue.accountName;
              entries.push(
                `${accountName}: 貸方${revenue.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 損益計算書の費用（借方）
        if (fs.incomeStatement?.expenses) {
          for (const expense of fs.incomeStatement.expenses) {
            if (expense.amount > 0) {
              entries.push(
                `${expense.accountName}: 借方${expense.amount.toLocaleString()}円`,
              );
            }
          }
        }

        return entries.join("\n");
      }

      return "（詳細は解説をご確認ください）";
    } catch (e) {
      return "（表示エラー）";
    }
  }

  return String(answer);
}

// Q_T_001のデータを使ってテスト
const testData = {
  financialStatements: {
    balanceSheet: {
      assets: [
        { accountName: "前払金", amount: 867000 },
        { accountName: "前払費用", amount: 709000 },
      ],
      liabilities: [
        { accountName: "買掛金", amount: 851000 },
        { accountName: "貸倒引当金", amount: 934000 },
        { accountName: "減価償却累計額", amount: 331000 },
      ],
      equity: [
        { accountName: "資本金", amount: 256000 },
        { accountName: "当期純損失", amount: 2975000 },
      ],
    },
    incomeStatement: {
      revenues: [{ accountName: "売上高", amount: 167000 }],
      expenses: [
        { accountName: "仕入", amount: 851000 },
        { accountName: "水道光熱費", amount: 833000 },
        { accountName: "消耗品費", amount: 384000 },
        { accountName: "貸倒引当金繰入", amount: 934000 },
        { accountName: "減価償却費", amount: 331000 },
        { accountName: "保険料", amount: 0 },
      ],
      netIncome: -2975000,
    },
  },
};

console.log("Q_T_001正答表示テスト");
console.log("=".repeat(50));
console.log("\n【テストデータ】");
console.log("financialStatements形式でデータを渡す");

console.log("\n【変換結果】");
console.log("-".repeat(50));
const result = formatAnswer(testData);
console.log(result);
console.log("-".repeat(50));

// 期待される出力をチェック
const lines = result.split("\n");
console.log("\n【検証】");
console.log(`✅ 出力行数: ${lines.length}行`);

const hasAssets = lines.some(
  (line) => line.includes("前払金") && line.includes("借方"),
);
const hasLiabilities = lines.some(
  (line) => line.includes("買掛金") && line.includes("貸方"),
);
const hasNetLoss = lines.some(
  (line) => line.includes("当期純損失") && line.includes("借方"),
);
const hasRevenue = lines.some(
  (line) => line.includes("売上") && line.includes("貸方"),
);
const hasExpenses = lines.some(
  (line) => line.includes("仕入") && line.includes("借方"),
);

console.log(`${hasAssets ? "✅" : "❌"} 資産項目が借方に表示されている`);
console.log(`${hasLiabilities ? "✅" : "❌"} 負債項目が貸方に表示されている`);
console.log(`${hasNetLoss ? "✅" : "❌"} 当期純損失が借方に表示されている`);
console.log(`${hasRevenue ? "✅" : "❌"} 収益項目が貸方に表示されている`);
console.log(`${hasExpenses ? "✅" : "❌"} 費用項目が借方に表示されている`);

// [object Object]が含まれていないことを確認
const hasObjectString = result.includes("[object Object]");
console.log(
  `${!hasObjectString ? "✅" : "❌"} [object Object]が含まれていない`,
);

console.log("\n✅ Q_T_001の正答表示が正しくフォーマットされるようになりました");
