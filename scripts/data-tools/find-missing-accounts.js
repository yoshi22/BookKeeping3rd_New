#!/usr/bin/env node

const fs = require("fs");

function findMissingAccounts() {
  try {
    // master-questions.tsから勘定科目を抽出
    const content = fs.readFileSync("src/data/master-questions.ts", "utf8");

    // 勘定科目を抽出する正規表現
    const accountMatches = content.match(
      /(debit_account|credit_account)":"([^"]+)/g,
    );

    const databaseAccounts = new Set();

    if (accountMatches) {
      accountMatches.forEach((match) => {
        const account = match.split('":"')[1];
        if (account && account.trim()) {
          databaseAccounts.add(account.trim());
        }
      });
    }

    console.log("=== データベースで使用されている勘定科目 ===");
    const sortedAccounts = Array.from(databaseAccounts).sort();
    sortedAccounts.forEach((account) => {
      console.log(`- ${account}`);
    });

    // 現在のACCOUNT_OPTIONSを取得
    const journalFormContent = fs.readFileSync(
      "src/components/mock-exam/JournalEntryForm.tsx",
      "utf8",
    );
    const optionsMatch = journalFormContent.match(
      /const ACCOUNT_OPTIONS = \[([\s\S]*?)\];/,
    );

    const currentOptions = new Set();

    if (optionsMatch) {
      const optionsText = optionsMatch[1];
      const labelMatches = optionsText.match(/{ label: "([^"]+)"/g);
      if (labelMatches) {
        labelMatches.forEach((match) => {
          const label = match.match(/{ label: "([^"]+)"/)[1];
          if (label !== "勘定科目を選択") {
            currentOptions.add(label);
          }
        });
      }
    }

    console.log("\n=== 現在のプルダウンオプション ===");
    Array.from(currentOptions)
      .sort()
      .forEach((option) => {
        console.log(`- ${option}`);
      });

    // 不足している勘定科目を特定
    const missingAccounts = [];
    databaseAccounts.forEach((account) => {
      if (!currentOptions.has(account)) {
        missingAccounts.push(account);
      }
    });

    console.log("\n=== ❌ 不足している勘定科目 ===");
    if (missingAccounts.length > 0) {
      missingAccounts.sort().forEach((account) => {
        console.log(`- ${account}`);
      });
    } else {
      console.log("不足している勘定科目はありません。");
    }

    return {
      databaseAccounts: sortedAccounts,
      currentOptions: Array.from(currentOptions).sort(),
      missingAccounts: missingAccounts.sort(),
    };
  } catch (error) {
    console.error("エラー:", error);
    return null;
  }
}

findMissingAccounts();
