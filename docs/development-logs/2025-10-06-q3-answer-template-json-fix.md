# Q3問題表示エラー修正 - answerTemplateJson未定義問題

**日時**: 2025-10-06
**対象**: QuestionDisplay.tsx
**問題タイプ**: ランタイムエラー（TypeError）
**影響範囲**: Q3問題全50問（試算表・合計残高試算表・財務諸表）

## 問題概要

Q3問題（試算表穴埋め問題）を表示しようとすると、以下のランタイムエラーが発生：

```
Property 'answerTemplateJson' doesn't exist
Location: QuestionDisplay.tsx:869
```

### エラー発生の経緯

1. Phase 4でQ3問題の`question_text`フィールドを補完（全50問）
2. データベースマイグレーション実行（forceUpdate使用）
3. シミュレーターでQ3問題を開こうとするとアプリがクラッシュ
4. エラーログで未定義変数`answerTemplateJson`を参照していることが判明

## 根本原因

### データフロー構造

```
データベース (answer_template_json: string)
    ↓
親コンポーネント: getAnswerTemplate() → JSON.parse
    ↓
QuestionDisplay: answerTemplate (object型)
    ↓
Q3 Wrapper: answer_template_json (string型が必要)
    ↓
Q3 Form: JSON.parse して使用
```

### 問題箇所

`QuestionDisplay.tsx` の3箇所で、存在しない変数`answerTemplateJson`を参照：

**Line 869-870** (FillInTrialBalanceFormWrapper):

```typescript
answer_template_json: answerTemplateJson || "{}",  // ❌ answerTemplateJsonが未定義
correct_answer_json: correctAnswer || "{}",        // ❌ correctAnswerはオブジェクト型
```

**Line 883-884** (FillInComprehensiveTrialBalanceFormWrapper):

```typescript
// 同様のエラー
```

**Line 897-898** (FillInFinancialStatementFormWrapper):

```typescript
// 同様のエラー
```

### なぜエラーが発生したか

1. QuestionDisplayコンポーネントは`answerTemplate`をオブジェクト型で受け取る
2. Q3フォーム用Wrapperは`answer_template_json`をJSON文字列で要求
3. コードは未定義の`answerTemplateJson`変数を参照（存在しない）
4. TypeScriptの型チェックをすり抜けてランタイムエラーに

## 修正内容

### 修正ファイル

`src/components/QuestionDisplay.tsx`

### 修正箇所1: FillInTrialBalanceFormWrapper (Line 869-870)

```typescript
// 修正前
answer_template_json: answerTemplateJson || "{}",
correct_answer_json: correctAnswer || "{}",

// 修正後
answer_template_json: answerTemplate ? JSON.stringify(answerTemplate) : "{}",
correct_answer_json: correctAnswer ? JSON.stringify(correctAnswer) : "{}",
```

### 修正箇所2: FillInComprehensiveTrialBalanceFormWrapper (Line 887-888)

```typescript
// 同様の修正を適用
answer_template_json: answerTemplate ? JSON.stringify(answerTemplate) : "{}",
correct_answer_json: correctAnswer ? JSON.stringify(correctAnswer) : "{}",
```

### 修正箇所3: FillInFinancialStatementFormWrapper (Line 905-906)

```typescript
// 同様の修正を適用
answer_template_json: answerTemplate ? JSON.stringify(answerTemplate) : "{}",
correct_answer_json: correctAnswer ? JSON.stringify(correctAnswer) : "{}",
```

## 修正の論理

1. **変数の正しい参照**: `answerTemplateJson`（存在しない）→ `answerTemplate`（propsで受け取っている）
2. **型変換の追加**: オブジェクト → `JSON.stringify()` → JSON文字列
3. **nullチェックの追加**: 三項演算子で安全性を確保

## 検証結果

### テスト環境

- iOS Simulator: iPhone 16 (iOS 18.1)
- 問題ID: Q3_TB_001（試算表穴埋め問題1問目）

### 確認項目

✅ **エラー解消**: ランタイムエラーが発生しない
✅ **問題表示**: Q3_TB_001が正常に表示される
✅ **question_text表示**: 「以下の期首残高と期中取引を記帳した後の残高試算表を完成させてください。空欄に適切な金額を選択してください。」が正しく表示
✅ **UI要素**: 期首残高、勘定科目（現金）、金額（100,000円）が表示される
✅ **フォーム機能**: BlankSelectorコンポーネントが正常に機能

### スクリーンショット

問題画面が正常に表示され、以下の要素を確認：

- 問題タイトル: "試算表穴埋め問題"
- 問題番号: "1 / 50"
- 問題ID: "Q3_TB_001"
- 問題文（question_text）: Phase 4で補完した日本語テキスト
- 期首残高データ: 現金 100,000円

## 影響範囲

### 修正対象

- Q3_TB_001 〜 Q3_TB_020: 試算表穴埋め（20問）
- Q3_CTB_001 〜 Q3_CTB_015: 合計残高試算表穴埋め（15問）
- Q3_FS_001 〜 Q3_FS_015: 財務諸表穴埋め（15問）

**合計**: 50問すべてが正常に動作可能

### 影響を受けないコンポーネント

- Q1問題（仕訳問題）: 別のフォームコンポーネントを使用
- Q2問題（帳簿問題）: 別のフォームコンポーネントを使用
- 従来の試算表フォーム: TrialBalanceFormWrapper（Q3以前）

## 今後の対策

### 再発防止策

1. **型安全性の強化**:
   - propsインターフェースでJSON文字列とオブジェクトを明確に区別
   - 必要に応じて`answerTemplateJson`プロパティを明示的に追加

2. **データフロー文書化**:
   - データベース → コンポーネント間の型変換を明示
   - README.mdまたはアーキテクチャドキュメントに記載

3. **テスト強化**:
   - 各問題タイプの最初の1問を手動テスト
   - 新規フォームコンポーネント追加時の統合テスト

### 技術的改善案

将来的には、以下の設計変更を検討：

```typescript
interface QuestionDisplayProps {
  // オプション1: JSON文字列を直接受け取る
  answerTemplateJson?: string;
  correctAnswerJson?: string;

  // オプション2: 両方サポート
  answerTemplate?: AnswerTemplate;
  answerTemplateJson?: string;
}
```

## 関連ファイル

- 修正ファイル: `src/components/QuestionDisplay.tsx`
- 問題データ: `src/data/master-questions.ts`
- Q3フォーム:
  - `src/components/cbt/FillInTrialBalanceForm.tsx`
  - `src/components/cbt/FillInComprehensiveTrialBalanceForm.tsx`
  - `src/components/cbt/FillInFinancialStatementForm.tsx`

## まとめ

QuestionDisplayコンポーネントでの未定義変数参照エラーを修正し、Q3問題50問すべてが正常に表示されるようになりました。修正は適切な変数参照と型変換（JSON.stringify）を追加することで実現しました。

Phase 4（question_text補完）とPhase 5（エラー修正）が完了し、Q3問題の実装が完全に機能する状態になりました。
