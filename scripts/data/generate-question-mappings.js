/**
 * 問題-勘定科目マッピング自動生成スクリプト
 * 全302問の問題データから動的フィルタリング用のマッピングを生成
 */

const fs = require('fs');
const path = require('path');

// マスター問題データを読み込み
function loadMasterQuestions() {
  try {
    // TypeScriptファイルの内容を読み込み
    const filePath = path.join(__dirname, '../../src/data/master-questions.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    // 簡易的なパース（ESモジュールの配列データを抽出）
    const match = content.match(/export const masterQuestions: Question\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('masterQuestions配列が見つかりません');
    }

    // JSONとして評価するために調整
    const arrayString = match[1];
    const questionsData = eval(`(${arrayString})`);
    return questionsData;
  } catch (error) {
    console.error('マスター問題データの読み込みに失敗:', error);
    return [];
  }
}

// 正答から勘定科目を抽出
function extractAccountsFromAnswer(correctAnswerJson) {
  const accounts = new Set();

  try {
    const answer = JSON.parse(correctAnswerJson);

    // 仕訳問題の場合
    if (answer.type === 'journal_entry') {
      if (answer.journalEntry) {
        if (answer.journalEntry.debit_account) {
          accounts.add(answer.journalEntry.debit_account);
        }
        if (answer.journalEntry.credit_account) {
          accounts.add(answer.journalEntry.credit_account);
        }
      }

      // 複合仕訳の場合
      if (answer.entries) {
        answer.entries.forEach(entry => {
          if (entry.account) accounts.add(entry.account);
          if (entry.debit_account) accounts.add(entry.debit_account);
          if (entry.credit_account) accounts.add(entry.credit_account);
        });
      }
    }

    // 帳簿問題の場合
    else if (answer.type === 'ledger_account' && answer.entries) {
      answer.entries.forEach(entry => {
        if (entry.description && entry.description !== '前月繰越' && entry.description !== '次月繰越') {
          accounts.add(entry.description);
        }
      });
    }

    // 試算表問題の場合
    else if (answer.type === 'financial_statement' && answer.entries) {
      answer.entries.forEach(entry => {
        if (entry.accountName) {
          accounts.add(entry.accountName);
        }
      });
    }
  } catch (error) {
    console.warn('正答JSON解析エラー:', error.message);
  }

  return Array.from(accounts).filter(account => account && account.trim());
}

// tagsから勘定科目とカテゴリ情報を抽出
function extractFromTags(tagsJson) {
  try {
    const tags = JSON.parse(tagsJson);
    return {
      subcategory: tags.subcategory || 'other',
      accounts: tags.accounts || [],
      keywords: tags.keywords || []
    };
  } catch (error) {
    console.warn('tagsJSON解析エラー:', error.message);
    return {
      subcategory: 'other',
      accounts: [],
      keywords: []
    };
  }
}

// 問題文からキーワードを抽出
function extractKeywordsFromText(questionText) {
  const keywords = [];

  // 基本的なキーワードマッピング
  const keywordMap = {
    'cash_deposit': ['現金', '小口', '実査', '預金', '当座', '普通', '定期'],
    'merchandise': ['商品', '仕入', '売上', '売買', '掛け', '手形', '繰越商品'],
    'fixed_assets': ['建物', '備品', '車両', '減価償却', '固定資産', '土地', '機械'],
    'payroll': ['給料', '賞与', '源泉', '社会保険', '福利', '法定福利費'],
    'settlement': ['決算', '整理', '引当', '繰延', '見越', '償却', '評価'],
    'receivables_payables': ['手形', '貸付', '借入', '債権', '債務', '受取手形', '支払手形']
  };

  for (const [category, words] of Object.entries(keywordMap)) {
    for (const word of words) {
      if (questionText.includes(word)) {
        keywords.push(word);
      }
    }
  }

  return [...new Set(keywords)];
}

// カテゴリを判定
function determineCategory(questionId, questionText, tagInfo) {
  // 1. tagsから判定
  if (tagInfo.subcategory && tagInfo.subcategory !== 'other') {
    const categoryMap = {
      'cash_deposit': 'cash_deposit',
      'general_ledger': 'cash_deposit', // 多くの帳簿問題は現金系
      'merchandise': 'merchandise',
      'fixed_assets': 'fixed_assets',
      'payroll': 'payroll',
      'settlement': 'settlement',
      'receivables_payables': 'receivables_payables'
    };

    if (categoryMap[tagInfo.subcategory]) {
      return categoryMap[tagInfo.subcategory];
    }
  }

  // 2. 問題IDから判定
  if (questionId.startsWith('Q_J_')) {
    // 仕訳問題のキーワード判定
    const text = questionText.toLowerCase();

    if (text.includes('現金') || text.includes('小口') || text.includes('実査') ||
        text.includes('預金') || text.includes('当座')) {
      return 'cash_deposit';
    }

    if (text.includes('商品') || text.includes('仕入') || text.includes('売上') ||
        text.includes('売買') || text.includes('掛け')) {
      return 'merchandise';
    }

    if (text.includes('建物') || text.includes('備品') || text.includes('車両') ||
        text.includes('減価償却') || text.includes('固定資産')) {
      return 'fixed_assets';
    }

    if (text.includes('給料') || text.includes('賞与') || text.includes('源泉') ||
        text.includes('社会保険')) {
      return 'payroll';
    }

    if (text.includes('決算') || text.includes('整理') || text.includes('引当') ||
        text.includes('繰延') || text.includes('見越')) {
      return 'settlement';
    }

    if (text.includes('手形') || text.includes('貸付') || text.includes('借入') ||
        text.includes('債権') || text.includes('債務')) {
      return 'receivables_payables';
    }
  }

  return 'other';
}

// 関連科目を生成
function generateRelatedAccounts(category, primaryAccounts) {
  const categoryRelatedMap = {
    'cash_deposit': [
      '現金', '現金過不足', '小口現金', '当座預金', '普通預金', '定期預金',
      '当座借越', '雑収入', '雑損失'
    ],
    'merchandise': [
      '商品', '仕入', '売上', '売掛金', '買掛金', '繰越商品',
      '前払金', '前受金', '受取手形', '支払手形', '発送費', '保管費', '現金', '当座預金'
    ],
    'fixed_assets': [
      '建物', '建物減価償却累計額', '備品', '備品減価償却累計額',
      '車両運搬具', '車両運搬具減価償却累計額', '土地', '機械装置', '機械装置減価償却累計額',
      '減価償却費', '固定資産売却益', '固定資産売却損', '固定資産除却損',
      '建設仮勘定', '未払金', '現金', '当座預金'
    ],
    'payroll': [
      '給料', '賞与', '賞与引当金', '賞与引当金繰入', '法定福利費',
      '預り金', '未払給料', '未払賞与', '現金', '当座預金', '福利厚生費'
    ],
    'settlement': [
      '貸倒引当金', '貸倒引当金繰入', '貸倒引当金戻入', '減価償却費',
      '前払費用', '前受収益', '未払費用', '未収収益',
      '売掛金', '受取手形', '保険料', '支払家賃', '受取家賃', '支払利息', '受取利息'
    ],
    'receivables_payables': [
      '売掛金', '買掛金', '受取手形', '支払手形', '貸付金', '借入金',
      '未収金', '未払金', '立替金', '預り金', '仮払金', '仮受金',
      '受取利息', '支払利息', '手形売却損'
    ]
  };

  const baseRelated = categoryRelatedMap[category] || [];
  const related = new Set(baseRelated);

  // 正答科目も関連科目に追加
  primaryAccounts.forEach(account => related.add(account));

  return Array.from(related);
}

// 補完科目を生成
function generateSupplementaryAccounts(category, primaryAccounts, relatedAccounts) {
  const allExisting = new Set([...primaryAccounts, ...relatedAccounts]);
  const supplementary = new Set();

  // 対になる科目を追加
  const pairedAccounts = {
    '売掛金': ['買掛金'],
    '買掛金': ['売掛金'],
    '受取手形': ['支払手形'],
    '支払手形': ['受取手形'],
    '貸付金': ['借入金'],
    '借入金': ['貸付金'],
    '前払金': ['前受金'],
    '前受金': ['前払金'],
    '前払費用': ['前受収益'],
    '前受収益': ['前払費用'],
    '未収収益': ['未払費用'],
    '未払費用': ['未収収益']
  };

  primaryAccounts.forEach(account => {
    if (pairedAccounts[account]) {
      pairedAccounts[account].forEach(paired => {
        if (!allExisting.has(paired)) {
          supplementary.add(paired);
        }
      });
    }
  });

  // 汎用的な補完科目
  const commonAccounts = ['現金', '当座預金', '普通預金'];
  commonAccounts.forEach(account => {
    if (!allExisting.has(account) && supplementary.size < 5) {
      supplementary.add(account);
    }
  });

  return Array.from(supplementary);
}

// メイン処理
function generateMappings() {
  console.log('問題-勘定科目マッピング生成を開始...');

  const questions = loadMasterQuestions();
  console.log(`${questions.length}問の問題データを読み込みました`);

  const mappings = {};
  let processedCount = 0;

  for (const question of questions) {
    try {
      // 基本情報の抽出
      const primaryAccounts = extractAccountsFromAnswer(question.correct_answer_json);
      const tagInfo = extractFromTags(question.tags_json);
      const textKeywords = extractKeywordsFromText(question.question_text);

      // カテゴリ判定
      const category = determineCategory(question.id, question.question_text, tagInfo);

      // 関連科目・補完科目の生成
      const relatedAccounts = generateRelatedAccounts(category, primaryAccounts);
      const supplementaryAccounts = generateSupplementaryAccounts(category, primaryAccounts, relatedAccounts);

      // キーワードの統合
      const allKeywords = [...new Set([...tagInfo.keywords, ...textKeywords])];

      // マッピング生成
      mappings[question.id] = {
        questionId: question.id,
        primaryAccounts: primaryAccounts,
        relatedAccounts: relatedAccounts.filter(acc => !primaryAccounts.includes(acc)),
        supplementaryAccounts: supplementaryAccounts,
        category: category,
        keywords: allKeywords
      };

      processedCount++;

      if (processedCount % 50 === 0) {
        console.log(`${processedCount}問を処理しました...`);
      }

    } catch (error) {
      console.error(`問題 ${question.id} の処理中にエラー:`, error.message);
    }
  }

  console.log(`\n生成完了: ${processedCount}問のマッピングを生成しました`);

  // 統計情報
  const stats = {
    totalQuestions: processedCount,
    categoryCount: {},
    avgPrimaryAccounts: 0,
    avgRelatedAccounts: 0
  };

  let totalPrimary = 0;
  let totalRelated = 0;

  for (const mapping of Object.values(mappings)) {
    stats.categoryCount[mapping.category] = (stats.categoryCount[mapping.category] || 0) + 1;
    totalPrimary += mapping.primaryAccounts.length;
    totalRelated += mapping.relatedAccounts.length;
  }

  stats.avgPrimaryAccounts = Math.round(totalPrimary / processedCount * 10) / 10;
  stats.avgRelatedAccounts = Math.round(totalRelated / processedCount * 10) / 10;

  console.log('\n生成統計:');
  console.log(`- 総問題数: ${stats.totalQuestions}`);
  console.log(`- カテゴリ別内訳:`);
  for (const [category, count] of Object.entries(stats.categoryCount)) {
    console.log(`  - ${category}: ${count}問`);
  }
  console.log(`- 平均正答科目数: ${stats.avgPrimaryAccounts}`);
  console.log(`- 平均関連科目数: ${stats.avgRelatedAccounts}`);

  return { mappings, stats };
}

// TypeScriptファイルとして出力
function outputMappings(mappings, stats) {
  const outputPath = path.join(__dirname, '../../src/data/question-accounts-mapping-generated.ts');

  const content = `/**
 * 問題-勘定科目マッピングデータ（自動生成）
 * 動的フィルタリング機能で使用する問題別の関連勘定科目
 *
 * 生成日時: ${new Date().toISOString()}
 * 総問題数: ${stats.totalQuestions}
 * 生成スクリプト: scripts/data/generate-question-mappings.js
 */

import { AccountCategory } from './account-categories';

export interface QuestionAccountMapping {
  questionId: string;           // 問題ID (例: "Q_J_001")
  primaryAccounts: string[];    // 正答科目（必須表示）
  relatedAccounts: string[];    // 関連科目
  supplementaryAccounts?: string[]; // 補完科目
  category: AccountCategory;    // 問題カテゴリ
  keywords: string[];          // 問題文のキーワード
}

/**
 * 自動生成された問題-勘定科目マッピングデータ
 */
export const GENERATED_QUESTION_ACCOUNT_MAPPINGS: Record<string, QuestionAccountMapping> = ${JSON.stringify(mappings, null, 2).replace(/"category": "([^"]+)"/g, (match, categoryName) => {
  const categoryMap = {
    'cash_deposit': 'CASH_DEPOSIT',
    'merchandise': 'MERCHANDISE',
    'fixed_assets': 'FIXED_ASSETS',
    'payroll': 'PAYROLL',
    'settlement': 'SETTLEMENT',
    'receivables_payables': 'RECEIVABLES_PAYABLES',
    'other': 'OTHER'
  };
  const enumValue = categoryMap[categoryName] || 'OTHER';
  return `"category": AccountCategory.${enumValue}`;
})};

/**
 * 生成統計情報
 */
export const GENERATION_STATS = ${JSON.stringify(stats, null, 2)};

/**
 * カテゴリからデフォルトの関連科目を取得（自動生成版）
 */
export const getDefaultRelatedAccountsGenerated = (category: AccountCategory): string[] => {
  // 既存の手動定義とマージして使用
  // src/data/question-accounts-mapping.ts の getDefaultRelatedAccounts と統合推奨
  return [];
};
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`\nマッピングファイルを出力しました: ${outputPath}`);
}

// 実行
if (require.main === module) {
  try {
    const { mappings, stats } = generateMappings();
    outputMappings(mappings, stats);
    console.log('\n✅ 問題-勘定科目マッピング生成が完了しました');
  } catch (error) {
    console.error('❌ 生成処理でエラーが発生しました:', error);
    process.exit(1);
  }
}

module.exports = {
  generateMappings,
  outputMappings,
  extractAccountsFromAnswer,
  determineCategory
};