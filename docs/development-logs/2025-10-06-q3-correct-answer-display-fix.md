# Q3問題正解表示修正 - blanks形式対応とquestionType路由修正

**日時**: 2025-10-06
**対象**: Q3問題50問（試算表・合計残高試算表・財務諸表穴埋め問題）
**問題**: 解答結果ダイアログで正解と解説が表示されない

## 問題概要

Q3問題（試算表・合計残高試算表・財務諸表の穴埋め問題）で解答送信後、結果ダイアログの以下セクションが空白で表示される：

- **正解**: セクション（空欄）
- **解説**: セクション（空欄）

### 影響範囲

- Q3_TB_001 〜 Q3_TB_020: 試算表穴埋め（20問）
- Q3_CTB_001 〜 Q3_CTB_015: 合計残高試算表穴埋め（15問）
- Q3_FS_001 〜 Q3_FS_015: 財務諸表穴埋め（15問）

**合計**: 50問全て

## 根本原因分析

### 原因1: QuestionDisplay.tsxのquestionType判定ロジック不備（主要原因）

**ファイル**: `src/components/QuestionDisplay.tsx` (lines 1000-1004)

**問題のコード**:

```typescript
const determinedQuestionType =
  answerTemplate?.type === "fill_in_ledger" ||
  answerTemplate?.type === "vocabulary"
    ? "ledger"
    : "journal"; // ❌ Q3タイプがデフォルトで"journal"になる
```

**問題点**:

- Q3問題のテンプレートタイプ（fill_in_trial_balance, fill_in_comprehensive_trial_balance, fill_in_financial_statement）が考慮されていない
- これらのタイプは全てデフォルトの"journal"に分類されてしまう
- UnifiedExplanationに間違ったquestionType="journal"が渡される
- CorrectAnswerExampleでtrial_balanceケースに到達しない

**ログからの証拠**:

```
LOG  [QuestionDisplay] UnifiedExplanation Props: {
  "answerTemplateType": "fill_in_trial_balance",
  "determinedQuestionType": "journal",  // ❌ 本来は"trial_balance"であるべき
  "questionId": "Q3_TB_001"
}
```

### 原因2: CorrectAnswerExample.tsxでblanks形式の表示ロジック欠如（副次的原因）

**ファイル**: `src/components/CorrectAnswerExample.tsx`

**問題点**:

1. Q3問題のblanks形式データ構造に対応した表示メソッドが存在しない
2. trial_balanceケースが従来の試算表問題（Q_T_001など）のみを想定
3. blanks形式：`{"blanks":[{"index":0,"correctIndex":2}]}`への対応なし

### データフロー構造

```
QuestionDisplay.tsx
    ↓ (questionType判定)
UnifiedExplanation.tsx
    ↓ (questionType="journal" を渡す) ← ❌ ここが間違い
CorrectAnswerExample.tsx
    ↓ renderExample() switch
    ├─ case "journal": → renderJournalExample() ← ❌ Q3がここに来てしまう
    ├─ case "ledger": → renderFillInLedgerExample()
    └─ case "trial_balance": → ❌ 到達しない
```

## 修正内容

### 修正1: QuestionDisplay.tsxのquestionType判定ロジック追加

**ファイル**: `src/components/QuestionDisplay.tsx` (lines 1000-1008)

**修正前**:

```typescript
const determinedQuestionType =
  answerTemplate?.type === "fill_in_ledger" ||
  answerTemplate?.type === "vocabulary"
    ? "ledger"
    : "journal";
```

**修正後**:

```typescript
const determinedQuestionType =
  answerTemplate?.type === "fill_in_ledger" ||
  answerTemplate?.type === "vocabulary"
    ? "ledger"
    : answerTemplate?.type === "fill_in_trial_balance" ||
        answerTemplate?.type === "fill_in_comprehensive_trial_balance" ||
        answerTemplate?.type === "fill_in_financial_statement"
      ? "trial_balance"
      : "journal";
```

**効果**:

- Q3問題のテンプレートタイプを正しく"trial_balance"に分類
- UnifiedExplanationに正しいquestionType="trial_balance"を渡す
- CorrectAnswerExampleのtrial_balanceケースに到達可能になる

### 修正2: CorrectAnswerExample.tsxにrenderFillInExample()メソッド追加

**ファイル**: `src/components/CorrectAnswerExample.tsx` (lines 265-322)

**新規追加メソッド**:

```typescript
/**
 * Q3 fill-in形式（試算表・合計残高試算表・財務諸表）の正解表示
 * blanks形式の問題に対応
 */
const renderFillInExample = () => {
  console.log("[renderFillInExample] Called", {
    hasBlanks: !!correctAnswer.blanks,
    hasQuestionTemplate: !!questionTemplate,
    correctBlanks: correctAnswer.blanks,
    templateBlanks: questionTemplate?.blanks,
    templateType: questionTemplate?.type,
  });

  // blanks形式の正解データを表示
  if (!correctAnswer.blanks || !questionTemplate) {
    console.log("[renderFillInExample] Early return - missing data");
    return null;
  }

  const { blanks: correctBlanks } = correctAnswer;
  const { blanks: templateBlanks } = questionTemplate;

  if (!correctBlanks || !templateBlanks) {
    console.log(
      "[renderFillInExample] Early return - blanks validation failed",
    );
    return null;
  }

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>📝 正解例</Text>
      {correctBlanks.map((blank: any, blankArrayIndex: number) => {
        // 配列の順序でマッピング（indexの不一致に対応）
        const templateBlank = templateBlanks[blankArrayIndex];

        if (!templateBlank) return null;

        const correctValue = templateBlank.choices[blank.correctIndex];

        // 金額の場合はフォーマット、それ以外はそのまま表示
        const displayValue =
          typeof correctValue === "number"
            ? `${correctValue.toLocaleString("ja-JP")}円`
            : correctValue;

        return (
          <View key={`blank-${blankArrayIndex}`} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>空欄{blankArrayIndex + 1}:</Text>
            <Text style={styles.fieldValue}>{displayValue}</Text>
          </View>
        );
      })}
    </View>
  );
};
```

**機能**:

1. blanks配列から正解インデックスを取得
2. template.blanks.choices配列から正解値を参照
3. 金額は日本語フォーマット（カンマ区切り + 円）で表示
4. 各空欄を「空欄1: 160,000円」の形式で表示

### 修正3: renderExample()のtrial_balanceケース拡張

**ファイル**: `src/components/CorrectAnswerExample.tsx` (lines 619-634)

**修正後のtrial_balanceケース**:

```typescript
case "trial_balance":
  // Q3 fill-in形式（blanks）の場合は専用レンダリング
  if (correctAnswer.blanks) {
    const templateType = questionTemplate?.type;
    if (
      templateType === "fill_in_trial_balance" ||
      templateType === "fill_in_comprehensive_trial_balance" ||
      templateType === "fill_in_financial_statement"
    ) {
      console.log("[renderExample] Using renderFillInExample for Q3");
      return renderFillInExample();
    }
  }
  // 従来の試算表形式（Q_T_001など）
  console.log("[renderExample] Using renderTrialBalanceExample");
  return renderTrialBalanceExample();
```

**ロジック**:

1. correctAnswer.blanksの存在を確認
2. questionTemplate.typeがQ3タイプか判定
3. 条件を満たせばrenderFillInExample()を使用
4. 満たさなければ従来のrenderTrialBalanceExample()を使用

## 検証結果

### ログからの確認

**修正前**:

```
LOG  [QuestionDisplay] UnifiedExplanation Props: {
  "answerTemplateType": "fill_in_trial_balance",
  "determinedQuestionType": "journal",  // ❌ 間違い
  "questionId": "Q3_TB_001"
}
LOG  [renderExample] Using renderJournalExample  // ❌ 間違ったレンダリング
```

**修正後**:

```
LOG  [QuestionDisplay] UnifiedExplanation Props: {
  "answerTemplateType": "fill_in_trial_balance",
  "determinedQuestionType": "trial_balance",  // ✅ 正しい
  "questionId": "Q3_TB_001"
}
```

### 動作確認

- ✅ QuestionDisplay.tsxのquestionType判定が正しく動作
- ✅ Q3問題がtrial_balanceとして分類される
- ✅ renderFillInExample()メソッドの実装完了
- ✅ trial_balanceケースの路由ロジック実装完了

**残りの確認項目**:

- ⏳ 新しい解答送信での正解表示確認（実際のUI表示）
- ⏳ Q3_TB_001-010の解説欄埋め（Phase 2で対応）

## Phase 2: 解説補完（未実施）

### 現状

Q3_TB_001からQ3_TB_010までの10問は`explanation`フィールドが空文字列：

```typescript
{
  id: "Q3_TB_001",
  explanation: "",  // ❌ 空
  // ...
}
```

Q3_TB_011以降は解説あり：

```typescript
{
  id: "Q3_TB_011",
  explanation: "期首残高と期中取引を記帳した後の残高試算表を完成させる問題です...",  // ✅ あり
  // ...
}
```

### Phase 2の作業内容

1. **populate-q3-explanations.jsスクリプト作成**
   - Q3_TB_001-010の解説テキスト生成
   - Q3_CTB_001-015, Q3_FS_001-015の解説確認・補完

2. **データベース更新**
   - `src/data/master-questions.ts`更新
   - マイグレーションバージョン更新
   - forceUpdate一時有効化→確認→無効化

3. **動作確認**
   - 各問題タイプの解説表示テスト
   - UI/UX確認

## 修正ファイル一覧

1. `src/components/QuestionDisplay.tsx`
   - questionType判定ロジック追加（lines 1000-1008）

2. `src/components/CorrectAnswerExample.tsx`
   - renderFillInExample()メソッド追加（lines 265-322）
   - renderExample()のtrial_balanceケース拡張（lines 619-634）

## 技術的教訓

1. **データフロー追跡の重要性**: QuestionDisplay → UnifiedExplanation → CorrectAnswerExampleの各段階でのデータ変換を正確に把握する必要がある

2. **ログ駆動デバッグ**: console.logによる各段階のデータ状態確認が問題特定に非常に有効

3. **型システムの活用**: questionType, answerTemplate.typeなどの文字列リテラル型を適切に管理することで、こうした路由バグを防止できる

4. **段階的修正アプローチ**:
   - Phase 1で正解表示の修正（完了）
   - Phase 2で解説補完（次のステップ）
   - 明確な段階分けにより、各問題を独立して解決可能

## Phase 3: AnswerResultDialog.tsxの修正（2025-10-06 完了）

### 問題の再発見

Phase 1修正後もQ3問題で正解表示されない現象が継続。ログから**2箇所でquestionType判定が実施**されていることが判明：

1. ✅ **QuestionDisplay.tsx** (lines 1000-1009) - Phase 1で修正済み → `"trial_balance"`
2. ❌ **AnswerResultDialog.tsx** (lines 165-171) - **未修正** → `"journal"`（デフォルト値）

**ログからの証拠**:

```
// QuestionDisplay (正常)
LOG  [QuestionDisplay] UnifiedExplanation Props:
  "determinedQuestionType": "trial_balance" ✅

// AnswerResultDialog (問題 - Phase 3修正前)
LOG  [AnswerResultDialog] Debug Info:
  "determinedQuestionType": "journal" ❌

// CorrectAnswerExample (Phase 3修正前)
LOG  [renderExample] Using renderJournalExample ❌
```

### 根本原因

AnswerResultDialogが**解答結果表示時に独自でquestionTypeを再計算**しており、QuestionDisplayで正しく判定された値が上書きされていた。

### 修正内容

**ファイル**: `src/components/AnswerResultDialog.tsx` (lines 165-176)

**修正前**:

```typescript
const determinedQuestionType =
  answerTemplate?.type === "fill_in_ledger" ||
  answerTemplate?.type === "vocabulary"
    ? "ledger"
    : answerTemplate?.type === "auxiliary_book"
      ? "auxiliary_book"
      : "journal"; // ❌ Q3がデフォルトで"journal"に
```

**修正後**:

```typescript
const determinedQuestionType =
  answerTemplate?.type === "fill_in_ledger" ||
  answerTemplate?.type === "vocabulary"
    ? "ledger"
    : answerTemplate?.type === "auxiliary_book"
      ? "auxiliary_book"
      : answerTemplate?.type === "fill_in_trial_balance" ||
          answerTemplate?.type === "fill_in_comprehensive_trial_balance" ||
          answerTemplate?.type === "fill_in_financial_statement"
        ? "trial_balance"
        : "journal";
```

### 検証結果

**修正後のログ**:

```
LOG  [AnswerResultDialog] Debug Info:
  "determinedQuestionType": "trial_balance" ✅

LOG  [CorrectAnswerExample] Props:
  "questionType": "trial_balance" ✅

LOG  [renderExample] Using renderFillInExample for Q3 ✅

LOG  [renderFillInExample] Called {
  "correctBlanks": [...],
  "templateBlanks": [...]
} ✅
```

### 動作確認

- ✅ Q3_TB_001, Q3_CTB_001, Q3_FS_001で正常動作確認
- ✅ AnswerResultDialogで`questionType = "trial_balance"`と正しく判定
- ✅ renderFillInExample()が呼ばれ、正解が表示される
- ✅ Phase 2で補完した解説も正しく表示される

## Phase 2: 解説補完（2025-10-06 完了）

### 実行内容

1. **スクリプト作成**: `scripts/data/populate-q3-explanations.js`
2. **解説テンプレート定義**: Q3_TB_001-010の詳細な日本語解説
3. **スクリプト実行**: 10問の解説を正常に更新
4. **データベース更新**:
   - `SAMPLE_DATA_VERSION = "2025-10-06-q3-explanations"`
   - `forceUpdate = true` (一時的に有効化)
5. **確認後復元**: `forceUpdate = false` に戻して完了

### 解説補完結果

- ✅ Q3_TB_001-010: 詳細な日本語解説を設定
- ℹ️ Q3_CTB_001-011: 既に解説あり
- ℹ️ Q3_FS_001-010: 既に解説あり
- ⚠️ Q3_CTB_012-015, Q3_FS_011-015: 解説なし（今後の課題）

## 最終検証結果

### 修正完了項目

1. ✅ QuestionDisplay.tsxのquestionType路由修正
2. ✅ AnswerResultDialog.tsxのquestionType路由修正
3. ✅ CorrectAnswerExampleへのrenderFillInExample()追加
4. ✅ Q3_TB_001-010の解説補完

### 動作確認

- ✅ 正解表示: 「空欄1: 160,000円」などが正常表示
- ✅ 解説表示: Phase 2で補完した日本語解説が表示
- ✅ データベース保護: forceUpdate = false に復元

## 修正ファイル一覧

1. `src/components/QuestionDisplay.tsx` (lines 1000-1009) - Phase 1
2. `src/components/CorrectAnswerExample.tsx` (lines 265-322, 619-634) - Phase 1
3. `src/components/AnswerResultDialog.tsx` (lines 165-176) - Phase 3
4. `scripts/data/populate-q3-explanations.js` - Phase 2 (新規作成)
5. `src/data/master-questions.ts` - Phase 2 (10問の解説更新)
6. `src/data/migrations/index.ts` - Phase 2 (バージョン更新)

## 技術的教訓

1. **複数箇所での判定ロジック重複に注意**: QuestionDisplayとAnswerResultDialogの2箇所で同じ判定ロジックが必要だった
2. **ログ駆動デバッグの有効性**: 各コンポーネントのログ出力により、問題箇所を正確に特定できた
3. **段階的修正の重要性**: Phase 1→Phase 2→Phase 3と段階的に問題を解決
4. **データフロー追跡**: コンポーネント間のデータ伝播を正確に把握する必要性

## 今後の課題

1. Q3_CTB_012-015, Q3_FS_011-015の解説補完
2. QuestionDisplayとAnswerResultDialogでのquestionType判定ロジックの共通化検討
3. 型システムによる questionType の厳密な管理
