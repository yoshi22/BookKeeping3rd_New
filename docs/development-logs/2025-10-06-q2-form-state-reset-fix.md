# Q2問題の選択肢が次の問題に残る問題の修正

**日時**: 2025-10-06
**カテゴリ**: バグ修正（UX問題）
**影響範囲**: Q2問題（vocabulary, fill_in_ledger）全33問

## 問題の概要

Q2問題（用語問題・勘定記入問題）で、前の問題で選択した選択肢が次の問題に移った際も残ってしまう問題が発生していた。

### 症状

1. Q2_V_001（用語問題）で空欄を選択
2. QuestionNavigationコンポーネントの「次へ」ボタンで次の問題に移動
3. Q2_V_002のフォームに前の問題の選択が残っている
4. ユーザーが混乱し、誤答の原因になる

## 原因分析

問題には**2つの独立した原因**がありました。

### 原因1: 親コンポーネントの`userAnswers`がリセットされない

**問題の流れ**:

```typescript
// QuestionNavigationの「次へ」ボタンクリック
↓
useQuestionNavigation.goToNext() 呼び出し
↓
currentIndex更新 → currentQuestion変更
↓
❌ userAnswersステートはリセットされない
```

**既存の実装**:

- `handleNextQuestion()`（解答結果ダイアログからの遷移）では`setUserAnswers({})`を実行
- しかしQuestionNavigationの前へ/次へボタンからの直接ナビゲーションでは実行されない

**コード例**（学習画面）:

```typescript
// app/(tabs)/learning/question/[id].tsx

// handleNextQuestion()（解答結果ダイアログから）
const handleNextQuestion = () => {
  if (canGoNext) {
    setShowResultDialog(false);
    setSubmitResult(null);
    setUserAnswers({}); // ✅ ここでリセット
    setQuestionStartTime(Date.now());
    goToNext();
  }
};

// ❌ しかしQuestionNavigationから直接goToNext()が呼ばれた場合はリセットされない
```

### 原因2: フォームコンポーネント内部の`selectedAnswers`がリセットされない

**VocabularyForm/FillInLedgerFormの問題**:

```typescript
// src/components/VocabularyForm.tsx

export default function VocabularyForm({
  questionId,
  answerTemplate,
  ...
}) {
  // 内部でselectedAnswersステートを保持
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  // ❌ questionIdが変わっても自動的にリセットされない
}
```

**問題点**:

- Reactコンポーネントは再レンダリングされても既存のステートを維持する
- `questionId`が変わっただけではステートはリセットされない
- 明示的なリセット処理が必要

## 修正内容

### 1. 学習画面の修正

**ファイル**: `app/(tabs)/learning/question/[id].tsx` (Lines 177-183)

```typescript
// 問題が切り替わった時にuserAnswersをリセット
useEffect(() => {
  if (currentQuestion?.id) {
    setUserAnswers({});
    setQuestionStartTime(Date.now());
  }
}, [currentQuestion?.id]);
```

**変更内容**:

- `currentQuestion.id`が変わった時に`userAnswers`を空オブジェクトにリセット
- 同時に`questionStartTime`も新しい時刻に更新

### 2. 復習画面の修正

**ファイル**: `app/(tabs)/review/question/[id].tsx` (Lines 156-162)

```typescript
// 問題が切り替わった時にuserAnswersをリセット
useEffect(() => {
  if (currentQuestion?.id) {
    setUserAnswers({});
    setQuestionStartTime(Date.now());
  }
}, [currentQuestion?.id]);
```

**変更内容**: 学習画面と同じリセット処理を実装

### 3. VocabularyFormの修正

**ファイル**: `src/components/VocabularyForm.tsx`

#### import文の更新 (Line 6)

```typescript
// 修正前
import React, { useState, useCallback } from "react";

// 修正後
import React, { useState, useCallback, useEffect } from "react";
```

#### リセット処理の追加 (Lines 71-74)

```typescript
// questionIdが変わった時にselectedAnswersをリセット
useEffect(() => {
  setSelectedAnswers({});
}, [questionId]);
```

**変更内容**:

- `useEffect`フックで`questionId`の変更を監視
- `questionId`が変わると`selectedAnswers`を空オブジェクトにリセット

### 4. FillInLedgerFormの修正

**ファイル**: `src/components/FillInLedgerForm.tsx`

#### import文の更新 (Line 7)

```typescript
// 修正前
import React, { useState, useCallback, useMemo } from "react";

// 修正後
import React, { useState, useCallback, useMemo, useEffect } from "react";
```

#### リセット処理の追加 (Lines 82-85)

```typescript
// questionIdが変わった時にselectedAnswersをリセット
useEffect(() => {
  setSelectedAnswers({});
}, [questionId]);
```

**変更内容**: VocabularyFormと同じリセット処理を実装

## 修正後の動作フロー

### 正常なフロー（修正後）

```
ユーザーがQuestionNavigationの「次へ」ボタンをクリック
↓
useQuestionNavigation.goToNext()
↓
currentIndex更新 → currentQuestion.id変更
↓
✅ useEffect([currentQuestion.id])が発火
↓
親コンポーネント: setUserAnswers({})
親コンポーネント: setQuestionStartTime(Date.now())
↓
currentQuestionが変更 → questionIdプロパティが変更
↓
✅ VocabularyForm/FillInLedgerForm内のuseEffect([questionId])が発火
↓
フォームコンポーネント: setSelectedAnswers({})
↓
フォームが完全にリセットされた状態で新しい問題を表示
```

### すべてのナビゲーションパターンに対応

1. **QuestionNavigationの「次へ」ボタン**: ✅ リセットされる
2. **QuestionNavigationの「前へ」ボタン**: ✅ リセットされる
3. **解答結果ダイアログの「次の問題へ」**: ✅ 既存の処理とuseEffectで二重にリセット（問題なし）

## 期待される動作（修正後）

### テストシナリオ1: Q2_V問題

1. Q2_V_001を表示
2. 空欄①に「事業活動」を選択
3. 空欄②に「固定資産」を選択
4. QuestionNavigationの「次へ」ボタンをクリック
5. Q2_V_002に移動
6. **✅ フォームが空の状態にリセットされている**
7. 前の問題の選択（「事業活動」「固定資産」）が残っていない

### テストシナリオ2: Q2_L問題

1. Q2_L_001を表示
2. 空欄①に「25,000円」を選択
3. 空欄②に「50,000円」を選択
4. QuestionNavigationの「次へ」ボタンをクリック
5. Q2_L_002に移動
6. **✅ フォームが空の状態にリセットされている**
7. 前の問題の選択が残っていない

## 影響範囲

### 修正対象問題

- **Q2_V問題** (vocabulary): 13問
- **Q2_L問題** (fill_in_ledger): 20問
- **合計**: 33問

### 影響しない問題

- **Q1問題** (journal_entry): 異なるフォーム構造（UnifiedJournalEntryForm）
- **Q3問題** (trial_balance): 異なるフォーム構造（TrialBalanceForm）

これらの問題は異なるコンポーネントを使用しており、独自のステート管理を行っているため、本修正の影響を受けない。

## 技術的詳細

### Reactのステート管理とライフサイクル

#### コンポーネント再レンダリング時のステート保持

```typescript
// ❌ 誤解: propsが変わるとステートがリセットされる
// ✅ 正解: propsが変わってもステートは保持される

function MyComponent({ itemId }) {
  const [selection, setSelection] = useState({});

  // itemIdが変わっても、selectionステートは保持される
  // 明示的なリセット処理が必要
}
```

#### useEffectによるステートリセット

```typescript
function MyComponent({ itemId }) {
  const [selection, setSelection] = useState({});

  // ✅ 正しいアプローチ: useEffectで依存値の変更を監視
  useEffect(() => {
    setSelection({}); // itemIdが変わった時にリセット
  }, [itemId]);
}
```

### 依存配列の重要性

```typescript
// currentQuestion?.idを依存配列に指定
useEffect(() => {
  setUserAnswers({});
}, [currentQuestion?.id]); // ← IDが変わった時だけ実行
```

**メリット**:

- IDが同じ問題（再レンダリング）では実行されない
- 無駄な再実行を防ぐ
- パフォーマンス最適化

## 残タスク

- [x] 学習画面の修正
- [x] 復習画面の修正
- [x] VocabularyFormの修正
- [x] FillInLedgerFormの修正
- [x] 開発ログ作成
- [ ] シミュレーターでの手動検証
  - Q2_V_001 → Q2_V_002の遷移確認
  - Q2_L_001 → Q2_L_002の遷移確認
  - 「前へ」ボタンでも同様にリセットされるか確認

## 関連ファイル

### 修正ファイル

- `app/(tabs)/learning/question/[id].tsx` - 学習画面（useEffect追加）
- `app/(tabs)/review/question/[id].tsx` - 復習画面（useEffect追加）
- `src/components/VocabularyForm.tsx` - 用語問題フォーム（useEffect追加）
- `src/components/FillInLedgerForm.tsx` - 勘定記入問題フォーム（useEffect追加）

### 参照ファイル

- `src/hooks/useQuestionNavigation.ts` - 問題ナビゲーション管理フック
- `src/components/QuestionNavigation.tsx` - 問題ナビゲーションUI

## 過去の関連修正

- **2025-09-24**: Q2問題の初期実装（vocabulary, fill_in_ledger形式）
- **2025-10-05**: Q2問題のorder修正、insert column追加
- **2025-10-06**: AnswerResultDialogの正解表示修正
- **2025-10-06**: Q2_L問題のインデックス不整合修正
- **2025-10-06**: Q2問題のフォーム状態リセット修正（本修正）

## まとめ

Q2問題で前の問題の選択肢が次の問題に残ってしまう問題は、**親コンポーネントのuserAnswers**と**フォームコンポーネント内部のselectedAnswers**の2つのステートが問題切り替え時にリセットされないことが原因でした。

両方のレベルで`useEffect`を使用したステートリセット処理を追加することで、QuestionNavigationからの直接ナビゲーションでもフォームが正しくリセットされるようになりました。

この修正により、ユーザー体験が改善され、前の問題の選択が残ることによる混乱や誤答を防ぐことができます。
