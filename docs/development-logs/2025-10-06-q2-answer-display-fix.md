# Q2問題の正解表示修正（AnswerResultDialog修正）

**日時**: 2025-10-06
**カテゴリ**: バグ修正
**影響範囲**: Q2*V*_ (vocabulary), Q2*L*_ (fill_in_ledger) 問題の正解表示

## 問題の概要

Q2 vocabulary問題とfill_in_ledger問題で、解答送信後の結果ダイアログ（AnswerResultDialog）の「正解:」セクションが空の黄色いボックスとして表示され、正解内容が表示されない問題が発生していた。

### 症状

- Q2_V_001などのvocabulary問題を解答
- 解答送信後のモーダルダイアログで「正解:」セクションが空
- 用語の正解（資産、負債、純資産など）が表示されない
- 代わりに空の黄色いボックスのみ表示

## 原因分析

### データフロー調査

デバッグログの追加により、以下のデータフローを確認：

1. **QuestionDisplay** → UnifiedExplanation (✅ 正常)

   ```
   LOG [QuestionDisplay] UnifiedExplanation Props: {
     "answerTemplateType": "vocabulary",
     "determinedQuestionType": "ledger",
     "hasAnswerTemplate": true
   }
   ```

2. **AnswerResultDialog** → UnifiedExplanation (❌ 問題箇所)

   ```
   LOG [UnifiedExplanation] renderAnswerComparison {
     "hasQuestionTemplate": false,  ← answerTemplateが渡されていない
     "questionTemplateType": undefined,
     "questionType": undefined
   }
   ```

3. **CorrectAnswerExample** (❌ 誤ったレンダラー選択)
   ```
   LOG [CorrectAnswerExample] Props: {
     "questionType": "journal",  ← 本来は"ledger"であるべき
     "hasQuestionTemplate": false
   }
   LOG [renderExample] Using renderJournalExample  ← 誤り
   ```

### 根本原因

`AnswerResultDialog`コンポーネントが`UnifiedExplanation`を呼び出す際に、以下のpropsが欠落していた：

- `questionType` - vocabulary/fill_in_ledgerの判定に必要
- `questionTemplate` - 正解データの構造情報に必要

## 修正内容

### 1. AnswerResultDialog.tsx - インターフェース拡張

**ファイル**: `src/components/AnswerResultDialog.tsx`

```typescript
interface AnswerResultDialogProps {
  visible: boolean;
  result: SubmitAnswerResponse | null;
  onClose: () => void;
  showNextButton?: boolean;
  onNextQuestion?: () => void;
  questionId?: string;
  onAddToReview?: (questionId: string) => void;
  answerTemplate?: any; // Q2 vocabulary/fill_in_ledger形式の正解表示に必要
}
```

**変更点**:

- `answerTemplate?: any`プロパティを追加
- コメントで用途を明記（Q2形式の正解表示に必要）

### 2. AnswerResultDialog.tsx - UnifiedExplanation呼び出し修正

**変更箇所**: Lines 163-180

```typescript
<UnifiedExplanation
  explanation={result.explanation}
  mode="panel"
  isVisible={true}
  isCorrect={result.isCorrect}
  correctAnswer={formatCorrectAnswer(result.correctAnswer)}
  showAnswerComparison={true}
  questionType={
    answerTemplate?.type === "fill_in_ledger" ||
    answerTemplate?.type === "vocabulary"
      ? "ledger"
      : "journal"
  }
  questionTemplate={answerTemplate}
  sessionMode="learning"
/>
```

**追加したprops**:

- `questionType`: answerTemplate.typeに基づいて"ledger"または"journal"を設定
- `questionTemplate`: answerTemplateをそのまま渡す

### 3. 学習画面 - answerTemplate渡し

**ファイル**: `app/(tabs)/learning/question/[id].tsx`
**変更箇所**: Lines 387-397

```typescript
<AnswerResultDialog
  visible={showResultDialog}
  result={submitResult}
  onClose={handleCloseResultDialog}
  onNextQuestion={handleNextQuestion}
  showNextButton={canGoNext}
  questionId={currentQuestion.id}
  onAddToReview={handleAddToReview}
  answerTemplate={getAnswerTemplate(currentQuestion)}  // ← 追加
/>
```

### 4. 復習画面 - answerTemplate渡し

**ファイル**: `app/(tabs)/review/question/[id].tsx`
**変更箇所**: Lines 367-377

```typescript
<AnswerResultDialog
  visible={showResultDialog}
  result={submitResult}
  onClose={handleCloseResultDialog}
  onNextQuestion={handleNextQuestion}
  showNextButton={canGoNext}
  questionId={currentQuestion.id}
  onAddToReview={handleAddToReview}
  answerTemplate={getAnswerTemplate(currentQuestion)}  // ← 追加
/>
```

## 検証結果

### デバッグログによる確認

修正後のログ（Q2_V_001、Q2_V_002で確認）:

```
LOG [UnifiedExplanation] renderAnswerComparison {
  "hasQuestionTemplate": true,  ✅
  "questionTemplateType": "vocabulary",  ✅
  "questionType": "ledger"  ✅
}

LOG [CorrectAnswerExample] Props: {
  "questionType": "ledger",  ✅
  "hasQuestionTemplate": true,  ✅
  "questionTemplateType": "vocabulary",  ✅
  "templateBlanksLength": 3  ✅
}

LOG [renderExample] Routing decision: {
  "questionType": "ledger",
  "templateType": "vocabulary",
  "willUseVocabulary": true  ✅
}

LOG [renderExample] Using renderVocabularyExample  ✅

LOG [renderVocabularyExample] Called {
  "correctBlanks": [...],
  "hasBlanks": true,
  "hasQuestionTemplate": true,
  "templateBlanks": [...]
}
```

### 期待される動作

1. Q2 vocabulary問題を解答
2. 解答送信後、AnswerResultDialogが表示
3. 「正解:」セクションに用語の正解が表示される
   - 例: 空欄①: 事業活動
   - 例: 空欄②: 固定資産
   - 例: 空欄③: 時価

### データフロー（修正後）

```
Screen (learning/review)
  ↓ answerTemplate={getAnswerTemplate(currentQuestion)}
AnswerResultDialog
  ↓ questionType="ledger" (vocabulary/fill_in_ledger時)
  ↓ questionTemplate={answerTemplate}
UnifiedExplanation
  ↓ questionTemplate, questionType
CorrectAnswerExample
  ↓ renderVocabularyExample() 呼び出し
正解表示（用語形式）
```

## 影響範囲

### 修正対象問題

- **Q2_V_001 ~ Q2_V_013**: vocabulary問題（13問）
- **Q2_L_001 ~ Q2_L_027**: fill_in_ledger問題（27問）
- **合計**: 40問

### 影響しない問題

- Q1 journal問題: 既存のjournalEntry形式で正常動作
- Q3 trial_balance問題: 既存のtrialBalance形式で正常動作

## 技術的詳細

### answerTemplateの構造（vocabulary）

```typescript
{
  type: "vocabulary",
  blanks: [
    {
      index: 1,
      choices: ["事業活動", "営業活動", "経営活動", "企業活動"]
    },
    {
      index: 2,
      choices: ["固定資産", "流動資産", "繰延資産", "無形資産"]
    },
    {
      index: 3,
      choices: ["時価", "公正価値", "市場価格", "評価額"]
    }
  ]
}
```

### answerTemplateの構造（fill_in_ledger）

```typescript
{
  type: "fill_in_ledger",
  ledger_type: "T字勘定",
  account_name: "現金",
  blanks: [
    {
      index: 1,
      side: "debit",
      choices: ["120,000", "100,000", "80,000", "50,000"]
    }
  ]
}
```

## 残タスク

- [x] AnswerResultDialog修正
- [x] 学習画面修正
- [x] 復習画面修正
- [x] デバッグログによる検証
- [ ] デバッグログの削除（本番リリース前）
  - QuestionDisplay.tsx
  - UnifiedExplanation.tsx
  - CorrectAnswerExample.tsx

## 関連ファイル

- `src/components/AnswerResultDialog.tsx` - メイン修正箇所
- `src/components/unified/UnifiedExplanation.tsx` - デバッグログ追加
- `src/components/CorrectAnswerExample.tsx` - デバッグログ追加（既存）
- `src/components/QuestionDisplay.tsx` - デバッグログ追加
- `app/(tabs)/learning/question/[id].tsx` - answerTemplate渡し
- `app/(tabs)/review/question/[id].tsx` - answerTemplate渡し

## 過去の関連修正

- **2025-09-24**: Q2問題の初期実装（vocabulary, fill_in_ledger形式）
- **2025-10-05**: Q2問題のorder修正、insert column追加
- **2025-10-06**: AnswerResultDialogの正解表示修正（本修正）

## まとめ

AnswerResultDialogコンポーネントがUnifiedExplanationにanswerTemplateを渡していなかったことが原因で、Q2問題の正解表示が空になっていた。answerTemplateプロパティの追加とquestionTypeの適切な設定により、vocabulary/fill_in_ledger問題の正解が正しく表示されるようになった。

修正はシンプルかつ影響範囲が限定的で、既存のQ1/Q3問題には影響しない。デバッグログにより修正の効果を確認済み。
