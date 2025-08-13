#!/usr/bin/env node

/**
 * Phase 2.2修正スクリプト: 給与・税金分野の会計処理エラー修正
 * 対象: Q_J_153,157,161,165 (給料支払) + Q_J_154,158,162,166 (社会保険料)
 */

const fs = require("fs");
const path = require("path");

function fixPhase22AccountingErrors() {
  console.log("🔧 Phase 2.2修正: 給与・税金分野会計処理エラー修正開始");
  console.log("===============================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  let fileContent = fs.readFileSync(filePath, "utf8");

  // 給料支払問題の修正 (複合仕訳に変更)
  const salaryFixes = {
    Q_J_153: {
      question_text: `従業員に給料512,000円を支払った。なお、源泉所得税48,000円を差し引いて現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":512000,"credit_account":"現金","credit_amount":464000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":48000}]}}`,
      explanation:
        "給料支払で源泉所得税を差し引いた複合仕訳です。借方：給料512,000円、貸方：現金464,000円・預り金48,000円",
    },
    Q_J_157: {
      question_text: `従業員に給料377,000円を支払った。なお、源泉所得税52,000円を差し引いて現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":377000,"credit_account":"現金","credit_amount":325000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":52000}]}}`,
      explanation:
        "給料支払で源泉所得税を差し引いた複合仕訳です。借方：給料377,000円、貸方：現金325,000円・預り金52,000円",
    },
    Q_J_161: {
      question_text: `従業員に給料604,000円を支払った。なお、源泉所得税63,000円を差し引いて現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":604000,"credit_account":"現金","credit_amount":541000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":63000}]}}`,
      explanation:
        "給料支払で源泉所得税を差し引いた複合仕訳です。借方：給料604,000円、貸方：現金541,000円・預り金63,000円",
    },
    Q_J_165: {
      question_text: `従業員に給料292,000円を支払った。なお、源泉所得税38,000円を差し引いて現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"給料","debit_amount":292000,"credit_account":"現金","credit_amount":254000},{"debit_account":"","debit_amount":0,"credit_account":"預り金","credit_amount":38000}]}}`,
      explanation:
        "給料支払で源泉所得税を差し引いた複合仕訳です。借方：給料292,000円、貸方：現金254,000円・預り金38,000円",
    },
  };

  // 社会保険料問題の修正 (現金支払に変更)
  const insuranceFixes = {
    Q_J_154: {
      question_text: `社会保険料250,800円（会社負担228,000円、従業員負担22,800円）を現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":228000,"credit_account":"現金","credit_amount":250800},{"debit_account":"預り金","debit_amount":22800,"credit_account":"","credit_amount":0}]}}`,
      explanation:
        "社会保険料の現金支払です。借方：法定福利費228,000円・預り金22,800円、貸方：現金250,800円",
    },
    Q_J_158: {
      question_text: `社会保険料174,900円（会社負担159,000円、従業員負担15,900円）を現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":159000,"credit_account":"現金","credit_amount":174900},{"debit_account":"預り金","debit_amount":15900,"credit_account":"","credit_amount":0}]}}`,
      explanation:
        "社会保険料の現金支払です。借方：法定福利費159,000円・預り金15,900円、貸方：現金174,900円",
    },
    Q_J_162: {
      question_text: `社会保険料814,000円（会社負担740,000円、従業員負担74,000円）を現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":740000,"credit_account":"現金","credit_amount":814000},{"debit_account":"預り金","debit_amount":74000,"credit_account":"","credit_amount":0}]}}`,
      explanation:
        "社会保険料の現金支払です。借方：法定福利費740,000円・預り金74,000円、貸方：現金814,000円",
    },
    Q_J_166: {
      question_text: `社会保険料382,800円（会社負担348,000円、従業員負担34,800円）を現金で支払った。`,
      correct_answer_json: `{"journalEntry":{"entries":[{"debit_account":"法定福利費","debit_amount":348000,"credit_account":"現金","credit_amount":382800},{"debit_account":"預り金","debit_amount":34800,"credit_account":"","credit_amount":0}]}}`,
      explanation:
        "社会保険料の現金支払です。借方：法定福利費348,000円・預り金34,800円、貸方：現金382,800円",
    },
  };

  let fixedCount = 0;

  // 給料支払問題の修正
  Object.entries(salaryFixes).forEach(([questionId, fixes]) => {
    const questionPattern = new RegExp(
      `(id: "${questionId}",[\\s\\S]*?question_text:\\s*)"([^"]*)"([\\s\\S]*?correct_answer_json:\\s*)'([^']*)'([\\s\\S]*?explanation:\\s*)"([^"]*)"`,
      "g",
    );

    const beforeReplace = fileContent.match(questionPattern);
    if (beforeReplace) {
      fileContent = fileContent.replace(
        questionPattern,
        `$1"${fixes.question_text}"$3'${fixes.correct_answer_json}'$5"${fixes.explanation}"`,
      );
      fixedCount++;
      console.log(`✅ ${questionId}: 給料支払複合仕訳修正完了`);
    } else {
      console.log(`⚠️ ${questionId}: パターンが見つかりませんでした`);
    }
  });

  // 社会保険料問題の修正
  Object.entries(insuranceFixes).forEach(([questionId, fixes]) => {
    const questionPattern = new RegExp(
      `(id: "${questionId}",[\\s\\S]*?question_text:\\s*)"([^"]*)"([\\s\\S]*?correct_answer_json:\\s*)'([^']*)'([\\s\\S]*?explanation:\\s*)"([^"]*)"`,
      "g",
    );

    const beforeReplace = fileContent.match(questionPattern);
    if (beforeReplace) {
      fileContent = fileContent.replace(
        questionPattern,
        `$1"${fixes.question_text}"$3'${fixes.correct_answer_json}'$5"${fixes.explanation}"`,
      );
      fixedCount++;
      console.log(`✅ ${questionId}: 社会保険料現金支払修正完了`);
    } else {
      console.log(`⚠️ ${questionId}: パターンが見つかりませんでした`);
    }
  });

  // ファイルに書き戻し
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log(`\\n📊 Phase 2.2修正完了:`);
  console.log(`  修正対象問題数: 8問 (給料4問 + 社会保険料4問)`);
  console.log(`  実際修正問題数: ${fixedCount}問`);
  console.log(`  修正成功率: ${Math.round((fixedCount / 8) * 100)}%`);

  if (fixedCount === 8) {
    console.log("🎉 Phase 2.2給与・税金分野の会計処理修正が完了しました！");
    console.log("💡 これにより正しい複合仕訳と現金支払処理が実現されます。");
  } else {
    console.log("❌ 一部の問題で修正に失敗しました。手動確認が必要です。");
  }

  return fixedCount === 8;
}

// 実行
try {
  const success = fixPhase22AccountingErrors();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ Phase 2.2修正スクリプトエラー:", error);
  process.exit(1);
}
