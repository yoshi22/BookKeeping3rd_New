# Q_J_018 複合仕訳問題の修正

**日時**: 2025-10-12
**バージョン**: 2025-10-12-q-j-018-fix
**影響範囲**: 複合仕訳問題（約20問）

## 問題の概要

Q_J_018を含む複合仕訳問題（`journalEntry`が配列形式の問題）で、以下の2つの重大なバグが発生していました：

### バグ1: 正答科目がプルダウンに表示されない

- **現象**: Q_J_018の勘定科目プルダウンに「当座預金」「支払手数料」「売掛金」が表示されない
- **影響**: ユーザーが正答を入力できない

### バグ2: 空欄で正解判定される

- **現象**: 何も入力していないのに「正解」と判定される
- **影響**: 学習効果が損なわれ、復習システムが正常に機能しない

## 根本原因

### 原因1: マッピング生成スクリプトのバグ

**ファイル**: `scripts/data/generate-question-mappings.js`

`extractAccountsFromAnswer`関数が複合仕訳の配列形式に未対応：

```javascript
// 単一仕訳: {"journalEntry": {"debit_account": "現金", ...}}
// 複合仕訳: {"journalEntry": [{"debit_account": "当座預金", ...}, ...]}

// ❌ 旧コード: 配列チェックなし
if (answer.journalEntry) {
  if (answer.journalEntry.debit_account) {
    // 配列には debit_account プロパティがない
    accounts.add(answer.journalEntry.debit_account);
  }
}
```

**結果**: 複合仕訳問題の`primaryAccounts`が空配列となり、正答科目がプルダウンに表示されない

### 原因2: 解答判定ロジックのバグ

**ファイル**: `src/services/answer-service.ts`

`isJournalAnswerCorrect`メソッドで`journalEntry`が配列の場合の処理が欠落：

```typescript
// ❌ 旧コード: 配列チェックなし
const entry = correctAnswer.journalEntry;
if (!entry) return false;

// entry が配列なのに、オブジェクトとして扱おうとする
const data = answerData as AnswerData & {
  debit_account?: string; // entry.debit_account は undefined
  ...
};
```

**結果**: 常に`false`を返すか、予期しない動作となり、空欄でも正解判定される

## 修正内容

### 修正1: マッピング生成スクリプト

**ファイル**: `scripts/data/generate-question-mappings.js` (行52-57)

```javascript
// ✅ 新コード: journalEntryが配列の場合の処理を追加
if (answer.type === "journal_entry") {
  // journalEntryがオブジェクトの場合（単一仕訳）
  if (answer.journalEntry && !Array.isArray(answer.journalEntry)) {
    if (answer.journalEntry.debit_account) {
      accounts.add(answer.journalEntry.debit_account);
    }
    if (answer.journalEntry.credit_account) {
      accounts.add(answer.journalEntry.credit_account);
    }
  }

  // journalEntryが配列の場合（複合仕訳）
  if (Array.isArray(answer.journalEntry)) {
    answer.journalEntry.forEach((entry) => {
      if (entry.debit_account) accounts.add(entry.debit_account);
      if (entry.credit_account) accounts.add(entry.credit_account);
    });
  }
}
```

**実行結果**:

```bash
node scripts/data/generate-question-mappings.js
# 370問のマッピングを再生成
# Q_J_018の primaryAccounts: ["当座預金", "支払手数料", "売掛金"]
```

### 修正2: 解答判定ロジック

**ファイル**: `src/services/answer-service.ts` (行668-671)

```typescript
// ✅ 新コード: journalEntryが配列の場合のチェックを追加
const entry = correctAnswer.journalEntry;
if (!entry) return false;

// Check if journalEntry is an array (compound entries with multiple debits/credits)
if (Array.isArray(entry)) {
  return this.isCompoundJournalEntriesCorrect(answerData, entry);
}

// 既存のオブジェクト処理を継続
const data = answerData as AnswerData & { ... };
```

### 修正3: データベースバージョン更新

**ファイル**: `src/data/migrations/index.ts` (行142, 145)

```typescript
const SAMPLE_DATA_VERSION = "2025-10-12-q-j-018-fix";
const forceUpdate = false; // ✅ 修正完了後、ユーザーデータ保護のためfalseに復元
```

## 修正範囲

### 影響を受けた問題

複合仕訳問題（`journalEntry`が配列形式）：約20問

**代表例**:

- Q_J_018: 売掛金回収時の振込手数料処理（当座預金・支払手数料・売掛金）
- その他の複合仕訳問題

### 修正されたファイル

1. **scripts/data/generate-question-mappings.js**
   - `extractAccountsFromAnswer`関数に配列処理を追加

2. **src/data/question-accounts-mapping-generated.ts**
   - 370問のマッピングデータを再生成
   - Q_J_018の`primaryAccounts`に正答科目を追加

3. **src/services/answer-service.ts**
   - `isJournalAnswerCorrect`メソッドに配列チェックを追加

4. **src/data/migrations/index.ts**
   - データバージョンを更新

## 検証結果

### テスト1: プルダウンに正答科目が表示 ✅

- Q_J_018の勘定科目プルダウンに「当座預金」「支払手数料」「売掛金」が表示される

### テスト2: 空欄で不正解判定 ✅

- 何も入力せずに解答送信 → **不正解**と判定される

### テスト3: 正答で正解判定 ✅

- 借方1: 当座預金 99,560円
- 借方2: 支払手数料 440円
- 貸方1: 売掛金 100,000円
- 解答送信 → **正解**と判定される

### テスト4: 既存問題へのデグレ確認 ✅

- Q_J_001, Q_J_002など単一仕訳問題で正常に動作

## 技術的詳細

### Q_J_018の正答データ構造

```json
{
  "type": "journal_entry",
  "journalEntry": [
    {
      "debit_account": "当座預金",
      "debit_amount": 99560,
      "credit_account": "",
      "credit_amount": 0
    },
    {
      "debit_account": "支払手数料",
      "debit_amount": 440,
      "credit_account": "",
      "credit_amount": 0
    },
    {
      "debit_account": "",
      "debit_amount": 0,
      "credit_account": "売掛金",
      "credit_amount": 100000
    }
  ]
}
```

### 動的フィルタリングの動作

修正後、Q_J_018で以下の科目がフィルタリングされて表示される：

**Primary Accounts（正答科目）**:

- 当座預金
- 支払手数料
- 売掛金

**Related Accounts（関連科目）**:

- 現金、現金過不足、小口現金
- 普通預金、定期預金
- 当座借越
- 雑収入、雑損失

合計約10-15科目に絞り込まれ、ユーザビリティが向上。

## 教訓

### 今後の開発での注意点

1. **データ構造の多様性を考慮**
   - 単一形式だけでなく、配列形式の可能性を常にチェック
   - `Array.isArray()`による型チェックを習慣化

2. **自動生成スクリプトの重要性**
   - マッピングデータは手動では管理しきれない
   - スクリプトのバグは大規模な問題を引き起こす

3. **早期検出の仕組み**
   - 全問題の自動検証スクリプト（`validate-all-answers-v2.js`）が有効
   - 代表問題での手動確認も重要

4. **段階的リリース**
   - `forceUpdate`の適切な管理
   - ユーザーデータ保護と修正適用のバランス

## 関連ドキュメント

- [動的フィルタリング仕様](../engineering/improvement-plan/account-filtering-spec.md)
- [動的フィルタリング進捗](../engineering/improvement-plan/account-filtering-progress.md)
- [テスト計画](../engineering/test-plan.md)

## 次のステップ

1. **全問題の再検証**
   - `node scripts/testing/validate-all-answers-v2.js` を実行
   - 複合仕訳問題を重点的にチェック

2. **E2Eテストの追加**
   - Q_J_018を含む複合仕訳問題のE2Eテストを作成
   - 空欄での不正解判定を自動化

3. **ドキュメント更新**
   - 複合仕訳問題の処理フローを文書化
   - 開発者ガイドに配列チェックの重要性を記載

---

**修正者**: Claude Code
**レビュー**: 2025-10-12 動作確認完了
**ステータス**: ✅ 完了
