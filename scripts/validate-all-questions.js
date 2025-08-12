#!/usr/bin/env node

/**
 * 包括的質問検証スクリプト
 * 全302問の質問を検証し、以下の問題を特定します：
 * - 不整合な解答データ（金額・勘定科目の不一致）
 * - 一般的すぎる説明文
 * - 構造的な問題
 */

const fs = require("fs");
const path = require("path");

// 勘定科目マスタデータ（schema定義から取得）
const ACCOUNT_MASTER = {
  // 資産
  現金: { category: "asset", code: "111", normalSide: "debit" },
  当座預金: { category: "asset", code: "112", normalSide: "debit" },
  普通預金: { category: "asset", code: "112", normalSide: "debit" },
  預金: { category: "asset", code: "112", normalSide: "debit" },
  売掛金: { category: "asset", code: "113", normalSide: "debit" },
  受取手形: { category: "asset", code: "114", normalSide: "debit" },
  商品: { category: "asset", code: "115", normalSide: "debit" },
  繰越商品: { category: "asset", code: "116", normalSide: "debit" },
  前払費用: { category: "asset", code: "117", normalSide: "debit" },
  前払金: { category: "asset", code: "117", normalSide: "debit" },
  建物: { category: "asset", code: "118", normalSide: "debit" },
  備品: { category: "asset", code: "119", normalSide: "debit" },
  減価償却累計額: {
    category: "asset_contra",
    code: "120",
    normalSide: "credit",
  },
  小口現金: { category: "asset", code: "111", normalSide: "debit" },
  現金過不足: { category: "temporary", code: "999", normalSide: "both" },

  // 負債
  買掛金: { category: "liability", code: "211", normalSide: "credit" },
  支払手形: { category: "liability", code: "212", normalSide: "credit" },
  借入金: { category: "liability", code: "213", normalSide: "credit" },
  短期借入金: { category: "liability", code: "213", normalSide: "credit" },
  未払金: { category: "liability", code: "214", normalSide: "credit" },
  未払費用: { category: "liability", code: "214", normalSide: "credit" },
  前受金: { category: "liability", code: "215", normalSide: "credit" },
  預り金: { category: "liability", code: "216", normalSide: "credit" },

  // 純資産
  資本金: { category: "equity", code: "311", normalSide: "credit" },
  繰越利益剰余金: { category: "equity", code: "312", normalSide: "credit" },

  // 収益
  売上: { category: "revenue", code: "411", normalSide: "credit" },
  受取利息: { category: "revenue", code: "412", normalSide: "credit" },
  雑収入: { category: "revenue", code: "413", normalSide: "credit" },
  受取手数料: { category: "revenue", code: "413", normalSide: "credit" },

  // 費用
  仕入: { category: "expense", code: "511", normalSide: "debit" },
  給料: { category: "expense", code: "512", normalSide: "debit" },
  旅費交通費: { category: "expense", code: "513", normalSide: "debit" },
  通信費: { category: "expense", code: "514", normalSide: "debit" },
  水道光熱費: { category: "expense", code: "515", normalSide: "debit" },
  減価償却費: { category: "expense", code: "516", normalSide: "debit" },
  支払利息: { category: "expense", code: "517", normalSide: "debit" },
  雑費: { category: "expense", code: "518", normalSide: "debit" },
  支払手数料: { category: "expense", code: "518", normalSide: "debit" },
};

// 一般的すぎる説明文パターン
const GENERIC_EXPLANATION_PATTERNS = [
  "基本的な仕訳問題",
  "標準的な処理",
  "一般的な取引",
  "シンプルな仕訳",
  "基礎的な内容",
  "通常の処理",
  "簿記の基本",
];

// 問題パターン検出用
const TRANSACTION_PATTERNS = {
  現金売上: { accounts: ["現金", "売上"], amounts: "equal" },
  掛け売上: { accounts: ["売掛金", "売上"], amounts: "equal" },
  現金仕入: { accounts: ["仕入", "現金"], amounts: "equal" },
  掛け仕入: { accounts: ["仕入", "買掛金"], amounts: "equal" },
  売掛金回収: { accounts: ["現金", "売掛金"], amounts: "equal" },
  買掛金支払: { accounts: ["買掛金", "現金"], amounts: "equal" },
  現金過不足: { accounts: ["現金過不足", "現金"], amounts: "equal" },
  小口現金前渡: { accounts: ["小口現金", "現金"], amounts: "equal" },
};

class QuestionValidator {
  constructor() {
    this.issues = [];
    this.statistics = {
      totalQuestions: 0,
      journalQuestions: 0,
      ledgerQuestions: 0,
      trialBalanceQuestions: 0,
      issuesFound: 0,
      amountMismatches: 0,
      accountIssues: 0,
      genericExplanations: 0,
      structuralIssues: 0,
    };
  }

  addIssue(questionId, severity, category, message, details = {}) {
    this.issues.push({
      questionId,
      severity, // 'critical', 'warning', 'info'
      category,
      message,
      details,
      timestamp: new Date().toISOString(),
    });

    if (severity === "critical" || severity === "warning") {
      this.statistics.issuesFound++;
    }
  }

  validateQuestion(question) {
    try {
      // 基本構造チェック
      this.validateBasicStructure(question);

      // カテゴリ別検証
      switch (question.category_id) {
        case "journal":
          this.validateJournalQuestion(question);
          this.statistics.journalQuestions++;
          break;
        case "ledger":
          this.validateLedgerQuestion(question);
          this.statistics.ledgerQuestions++;
          break;
        case "trial_balance":
          this.validateTrialBalanceQuestion(question);
          this.statistics.trialBalanceQuestions++;
          break;
        default:
          this.addIssue(
            question.id,
            "warning",
            "structure",
            `未知のカテゴリ: ${question.category_id}`,
          );
      }

      // 説明文検証
      this.validateExplanation(question);
    } catch (error) {
      this.addIssue(
        question.id,
        "critical",
        "validation_error",
        `検証エラー: ${error.message}`,
        { error: error.stack },
      );
    }
  }

  validateBasicStructure(question) {
    const required = [
      "id",
      "category_id",
      "question_text",
      "answer_template_json",
      "correct_answer_json",
      "explanation",
    ];

    for (const field of required) {
      if (!question[field]) {
        this.addIssue(
          question.id,
          "critical",
          "structure",
          `必須フィールドが空: ${field}`,
        );
      }
    }

    // JSON構造の妥当性チェック
    try {
      JSON.parse(question.answer_template_json);
    } catch (e) {
      this.addIssue(
        question.id,
        "critical",
        "structure",
        "answer_template_jsonの構文エラー",
        { error: e.message },
      );
    }

    try {
      JSON.parse(question.correct_answer_json);
    } catch (e) {
      this.addIssue(
        question.id,
        "critical",
        "structure",
        "correct_answer_jsonの構文エラー",
        { error: e.message },
      );
    }
  }

  validateJournalQuestion(question) {
    try {
      const answerData = JSON.parse(question.correct_answer_json);

      if (!answerData.journalEntry) {
        this.addIssue(
          question.id,
          "critical",
          "structure",
          "仕訳問題にjournalEntryが設定されていません",
        );
        return;
      }

      const entry = answerData.journalEntry;

      // 複合仕訳の場合
      if (entry.entries) {
        this.validateComplexJournalEntry(question, entry.entries);
      } else {
        // 単純仕訳の場合
        this.validateSimpleJournalEntry(question, entry);
      }
    } catch (error) {
      this.addIssue(
        question.id,
        "critical",
        "validation_error",
        `仕訳検証エラー: ${error.message}`,
      );
    }
  }

  validateSimpleJournalEntry(question, entry) {
    const { debit_account, debit_amount, credit_account, credit_amount } =
      entry;

    // 金額の一致チェック
    if (debit_amount !== credit_amount) {
      this.addIssue(
        question.id,
        "critical",
        "amount_mismatch",
        `借方・貸方金額不一致: 借方=${debit_amount}, 貸方=${credit_amount}`,
      );
      this.statistics.amountMismatches++;
    }

    // 勘定科目の妥当性チェック
    this.validateAccount(question, debit_account, "debit");
    this.validateAccount(question, credit_account, "credit");

    // 金額と問題文の整合性チェック
    this.validateAmountConsistency(question, [debit_amount, credit_amount]);

    // 取引パターン検証
    this.validateTransactionPattern(
      question,
      debit_account,
      credit_account,
      debit_amount,
    );
  }

  validateComplexJournalEntry(question, entries) {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {
      if (entry.debit_account && entry.debit_amount) {
        totalDebit += entry.debit_amount;
        this.validateAccount(question, entry.debit_account, "debit");
      }
      if (entry.credit_account && entry.credit_amount) {
        totalCredit += entry.credit_amount;
        this.validateAccount(question, entry.credit_account, "credit");
      }
    }

    // 複合仕訳の貸借一致チェック
    if (totalDebit !== totalCredit) {
      this.addIssue(
        question.id,
        "critical",
        "amount_mismatch",
        `複合仕訳の貸借不一致: 借方計=${totalDebit}, 貸方計=${totalCredit}`,
      );
      this.statistics.amountMismatches++;
    }

    // 金額と問題文の整合性チェック
    this.validateAmountConsistency(question, [totalDebit, totalCredit]);
  }

  validateAccount(question, accountName, side) {
    if (!accountName) {
      this.addIssue(
        question.id,
        "critical",
        "account_issue",
        `勘定科目が空: ${side}側`,
      );
      this.statistics.accountIssues++;
      return;
    }

    const accountInfo = ACCOUNT_MASTER[accountName];
    if (!accountInfo) {
      this.addIssue(
        question.id,
        "warning",
        "account_issue",
        `未定義の勘定科目: ${accountName}`,
      );
      this.statistics.accountIssues++;
      return;
    }

    // 勘定科目の借方・貸方の妥当性（厳密すぎるため警告レベル）
    if (
      accountInfo.normalSide !== "both" &&
      ((side === "debit" && accountInfo.normalSide === "credit") ||
        (side === "credit" && accountInfo.normalSide === "debit"))
    ) {
      // 特殊なケースは除外（例：現金過不足、減価償却累計額など）
      if (!this.isSpecialCase(question, accountName, side)) {
        this.addIssue(
          question.id,
          "info",
          "account_issue",
          `${accountName}の${side === "debit" ? "借方" : "貸方"}計上（通常は${accountInfo.normalSide === "debit" ? "借方" : "貸方"}科目）`,
        );
      }
    }
  }

  isSpecialCase(question, accountName, side) {
    const questionText = question.question_text.toLowerCase();

    // 現金過不足の特殊処理
    if (accountName === "現金過不足") return true;

    // 減価償却累計額の特殊処理
    if (accountName === "減価償却累計額") return true;

    // 売上値引き・仕入値引きなど
    if (questionText.includes("値引") || questionText.includes("返品"))
      return true;

    // 修正仕訳
    if (questionText.includes("修正") || questionText.includes("訂正"))
      return true;

    return false;
  }

  validateAmountConsistency(question, amounts) {
    const questionText = question.question_text;

    // 問題文から数値を抽出
    const questionAmounts = this.extractAmountsFromText(questionText);

    if (questionAmounts.length === 0) {
      this.addIssue(
        question.id,
        "warning",
        "amount_mismatch",
        "問題文に金額が見つかりません",
      );
      return;
    }

    // 解答の金額が問題文の金額と一致するかチェック
    for (const answerAmount of amounts) {
      if (!questionAmounts.includes(answerAmount)) {
        // 複合仕訳や特殊計算のケースを考慮
        if (!this.isCalculatedAmount(questionAmounts, answerAmount)) {
          this.addIssue(
            question.id,
            "warning",
            "amount_mismatch",
            `解答金額${answerAmount}円が問題文の金額と一致しません`,
            { questionAmounts, answerAmount },
          );
        }
      }
    }
  }

  extractAmountsFromText(text) {
    // 金額パターンの抽出（カンマ区切りの数字、円表記など）
    const patterns = [
      /(\d{1,3}(?:,\d{3})*)\s*円/g,
      /(\d{1,3}(?:,\d{3})*)\s*(?=円|万円|千円)/g,
      /(\d+)\s*円/g,
    ];

    const amounts = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const amount = parseInt(match[1].replace(/,/g, ""));
        if (amount > 0 && !amounts.includes(amount)) {
          amounts.push(amount);
        }
      }
    }

    return amounts.sort((a, b) => a - b);
  }

  isCalculatedAmount(questionAmounts, answerAmount) {
    // 差額計算（現金過不足など）
    for (let i = 0; i < questionAmounts.length; i++) {
      for (let j = i + 1; j < questionAmounts.length; j++) {
        if (
          Math.abs(questionAmounts[j] - questionAmounts[i]) === answerAmount
        ) {
          return true;
        }
      }
    }

    // 合計計算
    let sum = questionAmounts.reduce((acc, val) => acc + val, 0);
    if (sum === answerAmount) return true;

    // 部分合計計算
    for (let i = 0; i < questionAmounts.length; i++) {
      let partialSum = 0;
      for (let j = i; j < questionAmounts.length; j++) {
        partialSum += questionAmounts[j];
        if (partialSum === answerAmount) return true;
      }
    }

    return false;
  }

  validateTransactionPattern(question, debitAccount, creditAccount, amount) {
    const pattern = this.identifyTransactionPattern(
      debitAccount,
      creditAccount,
    );

    if (pattern) {
      // 特定パターンの妥当性チェック
      if (
        !this.isValidPattern(question, pattern, debitAccount, creditAccount)
      ) {
        this.addIssue(
          question.id,
          "warning",
          "transaction_pattern",
          `取引パターン「${pattern}」の処理に疑問があります`,
        );
      }
    }
  }

  identifyTransactionPattern(debitAccount, creditAccount) {
    for (const [patternName, patternData] of Object.entries(
      TRANSACTION_PATTERNS,
    )) {
      if (
        patternData.accounts.includes(debitAccount) &&
        patternData.accounts.includes(creditAccount)
      ) {
        return patternName;
      }
    }
    return null;
  }

  isValidPattern(question, pattern, debitAccount, creditAccount) {
    const questionText = question.question_text.toLowerCase();

    // パターン別の妥当性チェック
    switch (pattern) {
      case "現金売上":
        return questionText.includes("売上") && questionText.includes("現金");
      case "掛け売上":
        return questionText.includes("売上") && questionText.includes("掛け");
      case "現金仕入":
        return questionText.includes("仕入") && questionText.includes("現金");
      case "掛け仕入":
        return questionText.includes("仕入") && questionText.includes("掛け");
      default:
        return true;
    }
  }

  validateLedgerQuestion(question) {
    try {
      const answerData = JSON.parse(question.correct_answer_json);

      if (!answerData.entries) {
        this.addIssue(
          question.id,
          "critical",
          "structure",
          "元帳問題にentriesが設定されていません",
        );
        return;
      }

      // 元帳記入の妥当性チェック
      for (const entry of answerData.entries) {
        if (!entry.description || entry.description === "ledgerEntry") {
          this.addIssue(
            question.id,
            "warning",
            "generic_content",
            "元帳記入の摘要が一般的すぎます",
          );
        }

        if (entry.debit && entry.credit) {
          this.addIssue(
            question.id,
            "warning",
            "ledger_issue",
            "同一行に借方・貸方が両方設定されています",
          );
        }
      }
    } catch (error) {
      this.addIssue(
        question.id,
        "critical",
        "validation_error",
        `元帳検証エラー: ${error.message}`,
      );
    }
  }

  validateTrialBalanceQuestion(question) {
    try {
      const answerData = JSON.parse(question.correct_answer_json);

      // 試算表の構造チェック
      if (!answerData.accounts && !answerData.entries) {
        this.addIssue(
          question.id,
          "critical",
          "structure",
          "試算表問題にaccountsまたはentriesが設定されていません",
        );
        return;
      }

      // 貸借一致チェック（可能な場合）
      if (answerData.accounts) {
        this.validateTrialBalanceAccounts(question, answerData.accounts);
      }
    } catch (error) {
      this.addIssue(
        question.id,
        "critical",
        "validation_error",
        `試算表検証エラー: ${error.message}`,
      );
    }
  }

  validateTrialBalanceAccounts(question, accounts) {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const [accountName, data] of Object.entries(accounts)) {
      if (data.debit) totalDebit += data.debit;
      if (data.credit) totalCredit += data.credit;

      // 勘定科目の存在チェック
      if (!ACCOUNT_MASTER[accountName]) {
        this.addIssue(
          question.id,
          "warning",
          "account_issue",
          `試算表に未定義の勘定科目: ${accountName}`,
        );
      }
    }

    if (totalDebit !== totalCredit && totalDebit > 0 && totalCredit > 0) {
      this.addIssue(
        question.id,
        "critical",
        "amount_mismatch",
        `試算表の貸借不一致: 借方計=${totalDebit}, 貸方計=${totalCredit}`,
      );
      this.statistics.amountMismatches++;
    }
  }

  validateExplanation(question) {
    const explanation = question.explanation;

    if (!explanation || explanation.trim().length < 10) {
      this.addIssue(
        question.id,
        "warning",
        "explanation",
        "説明文が短すぎます",
      );
      return;
    }

    // 一般的すぎる説明文の検出
    for (const pattern of GENERIC_EXPLANATION_PATTERNS) {
      if (explanation.includes(pattern) && !explanation.includes("⚠️")) {
        this.addIssue(
          question.id,
          "warning",
          "generic_explanation",
          `一般的すぎる説明文: 「${pattern}」を含む説明文に具体的な解説がありません`,
        );
        this.statistics.genericExplanations++;
        break;
      }
    }

    // 説明文と問題・解答の整合性
    this.validateExplanationConsistency(question, explanation);
  }

  validateExplanationConsistency(question, explanation) {
    try {
      const answerData = JSON.parse(question.correct_answer_json);

      if (question.category_id === "journal" && answerData.journalEntry) {
        // 説明文に勘定科目が言及されているかチェック
        const entry = answerData.journalEntry;
        const accounts = [];

        if (entry.entries) {
          entry.entries.forEach((e) => {
            if (e.debit_account) accounts.push(e.debit_account);
            if (e.credit_account) accounts.push(e.credit_account);
          });
        } else {
          if (entry.debit_account) accounts.push(entry.debit_account);
          if (entry.credit_account) accounts.push(entry.credit_account);
        }

        const mentionedAccounts = accounts.filter((acc) =>
          explanation.includes(acc),
        );
        if (mentionedAccounts.length === 0 && accounts.length > 0) {
          this.addIssue(
            question.id,
            "info",
            "explanation",
            "説明文に解答の勘定科目が言及されていません",
          );
        }
      }
    } catch (error) {
      // JSON解析エラーは既に他で検出されているためスキップ
    }
  }

  generateReport() {
    const report = {
      summary: {
        ...this.statistics,
        validationDate: new Date().toISOString(),
        successRate:
          (
            ((this.statistics.totalQuestions - this.statistics.issuesFound) /
              this.statistics.totalQuestions) *
            100
          ).toFixed(2) + "%",
      },

      issuesByCategory: this.categorizeIssues(),

      criticalIssues: this.issues.filter(
        (issue) => issue.severity === "critical",
      ),

      warningIssues: this.issues.filter(
        (issue) => issue.severity === "warning",
      ),

      recommendations: this.generateRecommendations(),

      detailedIssues: this.issues,
    };

    return report;
  }

  categorizeIssues() {
    const categories = {};

    for (const issue of this.issues) {
      if (!categories[issue.category]) {
        categories[issue.category] = [];
      }
      categories[issue.category].push(issue);
    }

    return Object.entries(categories)
      .map(([category, issues]) => ({
        category,
        count: issues.length,
        critical: issues.filter((i) => i.severity === "critical").length,
        warning: issues.filter((i) => i.severity === "warning").length,
        info: issues.filter((i) => i.severity === "info").length,
        issues,
      }))
      .sort((a, b) => b.count - a.count);
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.statistics.amountMismatches > 0) {
      recommendations.push({
        priority: "high",
        category: "金額不一致",
        message: `${this.statistics.amountMismatches}件の金額不一致が発見されました。借方・貸方の金額、および問題文との整合性を確認してください。`,
      });
    }

    if (this.statistics.accountIssues > 0) {
      recommendations.push({
        priority: "medium",
        category: "勘定科目問題",
        message: `${this.statistics.accountIssues}件の勘定科目に関する問題が発見されました。未定義科目や異常な使用方法を確認してください。`,
      });
    }

    if (this.statistics.genericExplanations > 0) {
      recommendations.push({
        priority: "medium",
        category: "説明文改善",
        message: `${this.statistics.genericExplanations}件の一般的すぎる説明文が見つかりました。より具体的で教育的な説明を追加することを推奨します。`,
      });
    }

    if (this.statistics.structuralIssues > 0) {
      recommendations.push({
        priority: "high",
        category: "構造的問題",
        message: `構造的な問題が発見されました。JSON構文エラーや必須フィールドの不備を修正してください。`,
      });
    }

    return recommendations;
  }
}

// メイン実行関数
async function main() {
  try {
    console.log("📋 全問題検証スクリプト開始...");
    console.log("================================================");

    // master-questions.js からデータを読み込み
    const masterQuestionsPath = path.join(
      __dirname,
      "../src/data/master-questions.js",
    );
    const { masterQuestions } = require(masterQuestionsPath);

    const validator = new QuestionValidator();
    validator.statistics.totalQuestions = masterQuestions.length;

    console.log(`📊 検証対象: ${masterQuestions.length} 問`);
    console.log("");

    // 各問題を検証
    let processed = 0;
    for (const question of masterQuestions) {
      validator.validateQuestion(question);
      processed++;

      if (processed % 50 === 0) {
        console.log(
          `⏳ 進捗: ${processed}/${masterQuestions.length} (${((processed / masterQuestions.length) * 100).toFixed(1)}%)`,
        );
      }
    }

    console.log("✅ 検証完了");
    console.log("");

    // レポート生成
    console.log("📄 レポート生成中...");
    const report = validator.generateReport();

    // コンソール出力
    console.log("================================================");
    console.log("📊 検証結果サマリー");
    console.log("================================================");
    console.log(`総問題数: ${report.summary.totalQuestions}`);
    console.log(`  - 仕訳問題: ${report.summary.journalQuestions}`);
    console.log(`  - 元帳問題: ${report.summary.ledgerQuestions}`);
    console.log(`  - 試算表問題: ${report.summary.trialBalanceQuestions}`);
    console.log("");
    console.log(
      `問題のある問題数: ${report.summary.issuesFound} (${((report.summary.issuesFound / report.summary.totalQuestions) * 100).toFixed(1)}%)`,
    );
    console.log(`成功率: ${report.summary.successRate}`);
    console.log("");

    console.log("🔍 問題分類:");
    console.log(`  - 金額不一致: ${report.summary.amountMismatches}`);
    console.log(`  - 勘定科目問題: ${report.summary.accountIssues}`);
    console.log(`  - 一般的な説明: ${report.summary.genericExplanations}`);
    console.log(`  - 構造的問題: ${report.summary.structuralIssues}`);
    console.log("");

    // 重要な問題を表示
    if (report.criticalIssues.length > 0) {
      console.log("🚨 重大な問題:");
      report.criticalIssues.slice(0, 10).forEach((issue) => {
        console.log(`  [${issue.questionId}] ${issue.message}`);
      });
      if (report.criticalIssues.length > 10) {
        console.log(`  ... 他${report.criticalIssues.length - 10}件`);
      }
      console.log("");
    }

    // 推奨事項
    if (report.recommendations.length > 0) {
      console.log("💡 推奨事項:");
      report.recommendations.forEach((rec, index) => {
        console.log(
          `  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`,
        );
      });
      console.log("");
    }

    // レポートファイル出力
    const reportPath = path.join(__dirname, "question-validation-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`📄 詳細レポートを保存しました: ${reportPath}`);

    // 簡易版HTML レポート生成
    const htmlReport = generateHtmlReport(report);
    const htmlPath = path.join(__dirname, "question-validation-report.html");
    fs.writeFileSync(htmlPath, htmlReport, "utf-8");
    console.log(`🌐 HTMLレポートを保存しました: ${htmlPath}`);

    console.log("");
    console.log("✨ 検証完了！");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function generateHtmlReport(report) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>簿記問題検証レポート</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .critical { background: #e74c3c; color: white; padding: 10px; border-radius: 4px; margin: 5px 0; }
        .warning { background: #f39c12; color: white; padding: 10px; border-radius: 4px; margin: 5px 0; }
        .info { background: #3498db; color: white; padding: 10px; border-radius: 4px; margin: 5px 0; }
        .category { border: 1px solid #bdc3c7; padding: 15px; margin: 10px 0; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #34495e; color: white; }
        .recommendation { background: #27ae60; color: white; padding: 10px; margin: 5px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 簿記問題検証レポート</h1>
        <p>検証日時: ${report.summary.validationDate}</p>
    </div>

    <div class="summary">
        <h2>📊 検証結果サマリー</h2>
        <table>
            <tr><td>総問題数</td><td>${report.summary.totalQuestions}</td></tr>
            <tr><td>仕訳問題</td><td>${report.summary.journalQuestions}</td></tr>
            <tr><td>元帳問題</td><td>${report.summary.ledgerQuestions}</td></tr>
            <tr><td>試算表問題</td><td>${report.summary.trialBalanceQuestions}</td></tr>
            <tr><td>問題のある問題数</td><td>${report.summary.issuesFound}</td></tr>
            <tr><td>成功率</td><td>${report.summary.successRate}</td></tr>
        </table>
    </div>

    <div class="category">
        <h2>🔍 問題分類</h2>
        <ul>
            <li>金額不一致: ${report.summary.amountMismatches}</li>
            <li>勘定科目問題: ${report.summary.accountIssues}</li>
            <li>一般的な説明: ${report.summary.genericExplanations}</li>
            <li>構造的問題: ${report.summary.structuralIssues}</li>
        </ul>
    </div>

    ${
      report.criticalIssues.length > 0
        ? `
    <div class="category">
        <h2>🚨 重大な問題 (${report.criticalIssues.length}件)</h2>
        ${report.criticalIssues
          .slice(0, 20)
          .map(
            (issue) =>
              `<div class="critical">[${issue.questionId}] ${issue.message}</div>`,
          )
          .join("")}
        ${report.criticalIssues.length > 20 ? `<p>... 他${report.criticalIssues.length - 20}件</p>` : ""}
    </div>
    `
        : ""
    }

    ${
      report.warningIssues.length > 0
        ? `
    <div class="category">
        <h2>⚠️ 警告 (${report.warningIssues.length}件)</h2>
        ${report.warningIssues
          .slice(0, 20)
          .map(
            (issue) =>
              `<div class="warning">[${issue.questionId}] ${issue.message}</div>`,
          )
          .join("")}
        ${report.warningIssues.length > 20 ? `<p>... 他${report.warningIssues.length - 20}件</p>` : ""}
    </div>
    `
        : ""
    }

    <div class="category">
        <h2>💡 推奨事項</h2>
        ${report.recommendations
          .map(
            (rec) =>
              `<div class="recommendation">[${rec.priority.toUpperCase()}] ${rec.message}</div>`,
          )
          .join("")}
    </div>

    <div class="category">
        <h2>📊 カテゴリ別問題数</h2>
        <table>
            <tr><th>カテゴリ</th><th>件数</th><th>重大</th><th>警告</th><th>情報</th></tr>
            ${report.issuesByCategory
              .map(
                (cat) =>
                  `<tr><td>${cat.category}</td><td>${cat.count}</td><td>${cat.critical}</td><td>${cat.warning}</td><td>${cat.info}</td></tr>`,
              )
              .join("")}
        </table>
    </div>
</body>
</html>
  `.trim();
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { QuestionValidator };
