#!/usr/bin/env node

// 全勘定科目を抽出するスクリプト
const fs = require("fs");
const path = require("path");

function extractAccounts() {
  const accountSet = new Set();

  try {
    // master-questions.tsを読み込み
    const masterQuestionsPath = path.join(
      __dirname,
      "src/data/master-questions.ts",
    );
    const content = fs.readFileSync(masterQuestionsPath, "utf8");

    // correct_answer_jsonから勘定科目を抽出
    const correctAnswerMatches = content.match(
      /"correct_answer_json":\s*"([^"]+)"/g,
    );

    if (correctAnswerMatches) {
      correctAnswerMatches.forEach((match) => {
        try {
          const jsonStr = match.match(/"correct_answer_json":\s*"([^"]+)"/)[1];
          const unescapedJson = jsonStr.replace(/\\"/g, '"');
          const answerData = JSON.parse(unescapedJson);

          if (answerData.journalEntry) {
            if (answerData.journalEntry.debit_account) {
              accountSet.add(answerData.journalEntry.debit_account);
            }
            if (answerData.journalEntry.credit_account) {
              accountSet.add(answerData.journalEntry.credit_account);
            }
          }

          // 複数仕訳の場合
          if (answerData.entries) {
            answerData.entries.forEach((entry) => {
              if (entry.account) {
                accountSet.add(entry.account);
              }
              if (entry.debit_account) {
                accountSet.add(entry.debit_account);
              }
              if (entry.credit_account) {
                accountSet.add(entry.credit_account);
              }
            });
          }
        } catch (e) {
          // JSONパースエラーは無視
        }
      });
    }

    // answer_template_jsonのoptionsからも抽出
    const templateMatches = content.match(
      /"answer_template_json":\s*"([^"]+)"/g,
    );

    if (templateMatches) {
      templateMatches.forEach((match) => {
        try {
          const jsonStr = match.match(/"answer_template_json":\s*"([^"]+)"/)[1];
          const unescapedJson = jsonStr.replace(/\\"/g, '"');
          const templateData = JSON.parse(unescapedJson);

          if (templateData.fields) {
            templateData.fields.forEach((field) => {
              if (field.options && Array.isArray(field.options)) {
                field.options.forEach((option) => {
                  if (typeof option === "string" && option.trim()) {
                    accountSet.add(option);
                  }
                });
              }
            });
          }
        } catch (e) {
          // JSONパースエラーは無視
        }
      });
    }

    const accounts = Array.from(accountSet).sort();

    console.log("=== データベース内で使用されている勘定科目 ===");
    accounts.forEach((account) => {
      console.log(`- ${account}`);
    });

    console.log(`\n合計: ${accounts.length}個`);

    return accounts;
  } catch (error) {
    console.error("エラー:", error.message);
    return [];
  }
}

if (require.main === module) {
  extractAccounts();
}

module.exports = { extractAccounts };
