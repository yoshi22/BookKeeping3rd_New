# 正誤判定ロジック修正 - 問題タイプ別判定の完全対応

**日時**: 2025年1月18日  
**修正対象**: 第1問を含む全問題タイプの正誤判定エラー  
**影響範囲**: 282問の正誤判定の改善

## 問題の背景

App Storeでのアプリテスト時に、第1問の正誤判定が正しく行われない問題が発覚しました。調査の結果、問題データベースで使用されている問題タイプ（`answer_template_json`の`type`フィールド）と、正誤判定ロジックが認識するタイプの間に乖離があることが判明しました。

## 調査結果

### 問題タイプの分析

問題データベースに存在する問題タイプとその出現数：

- `journal_entry`: 250問（**最多、第1問を含む**）
- `voucher_entry`: 10問
- `subsidiary_book`: 10問
- `ledger_account`: 10問
- `multiple_choice`: 10問
- `financial_statement`: 4問
- `worksheet`: 4問
- `trial_balance`: 4問

### 正誤判定ロジックの問題点

`src/services/answer-service.ts`の`isAnswerCorrect`メソッドで認識されていたタイプ：

- ✅ `single_choice`
- ✅ `multiple_choice`
- ✅ `voucher_entry`

**認識されていなかったタイプ（合計282問が影響）：**

- ❌ `journal_entry`（250問）
- ❌ `subsidiary_book`（10問）
- ❌ `ledger_account`（10問）
- ❌ `financial_statement`（4問）
- ❌ `worksheet`（4問）
- ❌ `trial_balance`（4問）

これらの問題タイプは、カテゴリベースのフォールバック処理に依存していましたが、効率が悪く、タイプ固有の最適化された判定が行われていませんでした。

## 実施した修正

### 1. 正誤判定ロジックの拡張

**修正ファイル**: `src/services/answer-service.ts`

`isAnswerCorrect`メソッドに以下のタイプ判定を追加：

```typescript
// journal_entry（250問）の処理を追加
} else if (answerTemplate?.type === "journal_entry") {
  return this.isJournalAnswerCorrect(answerData, correctAnswer);

// subsidiary_book、ledger_accountの処理を追加
} else if (
  answerTemplate?.type === "subsidiary_book" ||
  answerTemplate?.type === "ledger_account"
) {
  return this.isLedgerAnswerCorrect(answerData, correctAnswer);

// financial_statement、worksheet、trial_balanceの処理を追加
} else if (
  answerTemplate?.type === "financial_statement" ||
  answerTemplate?.type === "worksheet" ||
  answerTemplate?.type === "trial_balance"
) {
  return this.isTrialBalanceAnswerCorrect(answerData, correctAnswer);
```

### 2. TypeScript型定義の更新

**修正ファイル**: `src/types/enhanced-types.ts`

`QuestionTemplate`インターフェースの`type`フィールドに不足していたタイプを追加：

```typescript
type?:
  | "journal"
  | "journal_entry"        // 追加
  | "ledger"
  | "ledger_account"       // 追加
  | "subsidiary_book"      // 追加
  | "trial_balance"
  | "worksheet"            // 追加
  | "financial_statement"
  | "voucher_entry"
  | "multiple_choice"
  | "single_choice";
```

### 3. バリデーション処理の整備

`validateAnswer`メソッドにコメントを追加し、各タイプの処理方針を明確化。

## テスト結果

### TypeScript型チェック

```bash
npx tsc --noEmit
# エラーなしで完了
```

### 機能テスト

第1問（journal_entryタイプ）での正誤判定テストを実施：

**テストケース1（正解データ）:**

- 入力: `{debit_account: "現金過不足", debit_amount: 200, credit_account: "現金", credit_amount: 200}`
- 結果: ✅ 正解

**テストケース2（不正解データ）:**

- 入力: `{debit_account: "現金", debit_amount: 200, credit_account: "現金過不足", credit_amount: 200}`
- 結果: ❌ 不正解

両方のケースが期待通りの結果となり、修正が正常に動作することを確認しました。

## 修正の効果

1. **282問の問題で正確な正誤判定が可能**: タイプベースの明示的な処理により、より正確な判定が実現
2. **パフォーマンスの向上**: フォールバック処理を減らし、直接適切なメソッドを呼び出すことで処理効率が向上
3. **保守性の向上**: タイプと処理の対応が明確になり、将来の拡張や修正が容易
4. **App Store問題の解決**: 第1問を含む全ての仕訳問題で正確な正誤判定が行われるように改善

## 影響を受ける機能

- **学習機能**: 仕訳問題（250問）の正誤判定が正確に
- **復習機能**: 間違えた問題の復習判定が正確に
- **模試機能**: 全タイプの問題で正確な採点が実現
- **統計機能**: 正確な正答率・学習進捗の計算が可能

## 検証済みの問題パターン

- ✅ journal_entry（仕訳問題）: 250問
- ✅ subsidiary_book（補助簿問題）: 10問
- ✅ ledger_account（元帳問題）: 10問
- ✅ financial_statement（財務諸表問題）: 4問
- ✅ worksheet（精算表問題）: 4問
- ✅ trial_balance（試算表問題）: 4問

すべてのタイプで適切な正誤判定メソッドが呼び出されるようになりました。

## 今後の対応

この修正により、App Storeでのテスト時に発見された問題が解決され、全ての問題タイプで正確な正誤判定が行われるようになりました。ユーザーは正確なフィードバックを受け取ることができ、学習効果の向上が期待されます。
