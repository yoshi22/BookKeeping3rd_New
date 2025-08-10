# Step 1: 型定義とデータ構造の明確化

**実施日時**: 2025年8月6日  
**目的**: problemsStrategy.mdの要件を満たす問題データ構造の定義

## 📋 問題データの型定義

### 基本型定義（既存のmodels.tsベース）

```typescript
interface Question {
  id: string; // Q_J_001〜Q_J_250(仕訳), Q_L_001〜Q_L_040(帳簿), Q_T_001〜Q_T_012(試算表)
  category_id: "journal" | "ledger" | "trial_balance";
  question_text: string;
  answer_template_json: string;
  correct_answer_json: string;
  explanation: string;
  difficulty: 1 | 2 | 3; // 3段階の難易度
  tags_json?: string; // サブカテゴリー情報を格納
  created_at: string;
  updated_at: string;
}
```

### 拡張型定義（生成・管理用）

```typescript
// サブカテゴリー定義（仕訳問題用）
type JournalSubCategory =
  | "cash_deposit" // 現金・預金取引（42問）
  | "sales_purchase" // 商品売買取引（45問）
  | "receivable_payable" // 債権・債務（41問）
  | "salary_tax" // 給与・税金（42問）
  | "fixed_asset" // 固定資産（40問）
  | "adjustment"; // 決算整理（40問）

// 帳簿問題のパターン
type LedgerPattern =
  | "general_ledger" // 総勘定元帳（10問）
  | "subsidiary_ledger" // 補助簿（10問）
  | "voucher" // 伝票記入（10問）
  | "theory"; // 理論・選択（10問）

// 試算表問題のパターン
type TrialBalancePattern =
  | "financial_statement" // 財務諸表作成（4問）
  | "worksheet" // 精算表作成（4問）
  | "trial_balance"; // 試算表作成（4問）

// 問題生成用の拡張型
interface QuestionData extends Question {
  subcategory?: JournalSubCategory | LedgerPattern | TrialBalancePattern;
  pattern?: string; // 詳細パターン
  targetCount?: number; // 目標問題数
  actualCount?: number; // 実際の問題数
}
```

## 📊 データ構造の設計

### 1. カテゴリー別の目標数

```typescript
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
```

### 2. 難易度配分の設計

```typescript
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
```

### 3. ID生成ルール

```typescript
function generateQuestionId(
  category: "journal" | "ledger" | "trial_balance",
  index: number,
): string {
  const prefix = {
    journal: "Q_J",
    ledger: "Q_L",
    trial_balance: "Q_T",
  }[category];

  return `${prefix}_${String(index).padStart(3, "0")}`;
}
```

## 📝 タグシステムの設計

### タグ構造

```typescript
interface QuestionTags {
  subcategory: string; // サブカテゴリー
  pattern?: string; // 詳細パターン
  accounts: string[]; // 関連勘定科目
  keywords: string[]; // キーワード
  examSection: number; // 試験での出題セクション（1-3）
}
```

### タグのJSON化

```typescript
function serializeTags(tags: QuestionTags): string {
  return JSON.stringify(tags);
}

function deserializeTags(tagsJson: string): QuestionTags {
  return JSON.parse(tagsJson);
}
```

## ✅ 検証項目

1. **カテゴリー別問題数**: 目標数に対する達成率
2. **サブカテゴリー分布**: 各サブカテゴリーの問題数バランス
3. **難易度分布**: 難易度別の問題数比率
4. **ID一意性**: 重複IDの有無
5. **タグ整合性**: タグデータの構造検証

## 🎯 次のステップ

型定義と構造が明確になったので、次は：

1. 実際の問題データの生成
2. 検証システムの構築
3. データベースへの投入

---

**完了時刻**: [timestamp]  
**次のアクション**: 問題データ生成スクリプトの作成
