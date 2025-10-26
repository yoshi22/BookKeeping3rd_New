# 財務諸表穴埋め問題の解答永続化バグ

**日付**: 2025-10-26
**ステータス**: 🟢 解決済み
**優先度**: 高

## 問題の概要

財務諸表穴埋め問題（Q3_FS_001〜Q3_FS_015）において、ある問題で選択した解答が次の問題に遷移したときに残ってしまう問題が発生しています。

### 具体的な再現手順

1. Q3_FS_004（貸借対照表問題）を開く
2. 空欄フィールド「固定資産合計」で金額を選択（例: 4,950,000）
3. 空欄フィールド「資産合計」で金額を選択（例: 5,350,000）
4. 「次の問題」ボタンをクリックしてQ3_FS_005（損益計算書問題）に遷移
5. **期待する動作**: Q3_FS_005の空欄フィールドは「金額を選択 ▼」プレースホルダーが表示される
6. **実際の動作**: Q3_FS_004で選択した値のインデックスがQ3_FS_005に引き継がれ、誤った値が表示される

### 問題の影響範囲

- **影響を受ける問題タイプ**: `fill_in_financial_statement` タイプの全問題（15問）
- **影響を受けるコンポーネント**:
  - `FillInFinancialStatementForm.tsx`
  - `FillInFinancialStatementFormWrapper` (QuestionDisplay.tsx内)
  - `BlankSelector.tsx`

## 実施した修正内容

### 修正1: FillInFinancialStatementForm.tsx (以前のセッションで実施)

**ファイル**: `src/components/cbt/FillInFinancialStatementForm.tsx`
**行**: 80-86

```typescript
// question.idが変更された時にselectedAnswersをリセット
useEffect(() => {
  setSelectedAnswers(initialAnswer);
  console.log(
    `[FillInFinancialStatementForm] Answer reset for question ${question.id}`,
  );
}, [question.id]);
```

**変更内容**: 依存配列を `[initialAnswer, question.id]` から `[question.id]` のみに変更

### 修正2: QuestionDisplay.tsx (2025-10-26実施)

**ファイル**: `src/components/QuestionDisplay.tsx`
**行**: 512-518

```typescript
// FillInFinancialStatementFormWrapper内に追加
function FillInFinancialStatementFormWrapper({
  questionId,
  question,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
}: FillInFinancialStatementFormWrapperProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number | string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 追加: questionIdが変更された時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers({});
    console.log(
      `[FillInFinancialStatementFormWrapper] Answer reset for question ${questionId}`,
    );
  }, [questionId]);

  // ... 残りのコード
}
```

## 検証結果

### Metro Bundlerログの確認

ログには以下のメッセージが出力されており、リセット処理自体は実行されている：

```
LOG  [FillInFinancialStatementForm] Answer reset for question Q3_FS_004
LOG  [FillInFinancialStatementFormWrapper] Answer reset for question Q3_FS_004
LOG  [FillInFinancialStatementForm] Answer reset for question Q3_FS_005
LOG  [FillInFinancialStatementFormWrapper] Answer reset for question Q3_FS_005
```

### 問題点の分析

リセット処理は実行されているにもかかわらず、UIに反映されない理由として以下の可能性が考えられます：

1. **propsの更新タイミング問題**
   - `selectedAnswers` の状態はリセットされているが、`initialAnswer` として子コンポーネントに渡されるタイミングが遅い
   - React の再レンダリングサイクルの問題

2. **BlankSelectorコンポーネントの状態管理問題**
   - `BlankSelector.tsx` が `selectedIndex` prop を正しく受け取っていない
   - 内部状態が更新されていない可能性

3. **useEffectの実行順序問題**
   - 親コンポーネント（Wrapper）と子コンポーネント（Form）の useEffect の実行順序
   - `selectedAnswers` がリセットされる前に `initialAnswer` が渡される可能性

## データフロー分析

```
QuestionDisplay.tsx (FillInFinancialStatementFormWrapper)
  └─ selectedAnswers: Record<number, number> (state)
      └─ initialAnswer prop として渡す
           ↓
FillInFinancialStatementForm.tsx
  └─ selectedAnswers: Record<number, number> (state)
      └─ initialAnswer から初期化
           ↓
BlankSelector.tsx (各空欄フィールド)
  └─ selectedIndex: number | null (prop)
      └─ selectedAnswers[blankIndex] の値
```

## 考えられる根本原因

### 仮説1: initialAnswerの初期化タイミング

`FillInFinancialStatementFormWrapper` で `selectedAnswers` をリセットしても、それが `initialAnswer` として子コンポーネントに渡されるまでに1レンダリングサイクル遅延している可能性。

### 仮説2: BlankSelectorの状態更新問題

`BlankSelector.tsx` が `selectedIndex` の変更を検知しても、内部で値を保持している可能性。

### 仮説3: useEffectの依存配列問題

`FillInFinancialStatementForm.tsx` の useEffect が `question.id` のみに依存しており、`initialAnswer` の変更を検知していない。

## 次のデバッグステップ

### 1. BlankSelector.tsxの確認

```typescript
// src/components/cbt/BlankSelector.tsx を確認
// selectedIndex prop が変更されたときに適切に更新されているか？
```

### 2. より詳細なログの追加

```typescript
// FillInFinancialStatementFormWrapper内
useEffect(() => {
  console.log(
    `[Wrapper] Resetting answers for ${questionId}, current:`,
    selectedAnswers,
  );
  setSelectedAnswers({});
  console.log(`[Wrapper] After reset, selectedAnswers should be empty`);
}, [questionId]);

// FillInFinancialStatementForm内
useEffect(() => {
  console.log(`[Form] Received initialAnswer:`, initialAnswer);
  console.log(`[Form] Current selectedAnswers:`, selectedAnswers);
  setSelectedAnswers(initialAnswer);
}, [question.id]);
```

### 3. useEffectの実行順序確認

親子コンポーネントの useEffect がどの順序で実行されているかを確認。

---

## 🛠️ 最終修正内容（2025-10-26 17:49確認）

### 変更概要
- `FillInFinancialStatementForm` 内のリセット用 `useEffect` に `initialAnswer` を依存関係として追加
  - これにより親コンポーネントが空の `initialAnswer` を渡したタイミングでも確実にローカル状態がクリアされ、`BlankSelector` へ即座に反映される

### 変更差分

```diff
diff --git a/src/components/cbt/FillInFinancialStatementForm.tsx b/src/components/cbt/FillInFinancialStatementForm.tsx
@@
-  // question.idが変更された時にselectedAnswersをリセット
-  useEffect(() => {
-    setSelectedAnswers(initialAnswer);
-    console.log(
-      `[FillInFinancialStatementForm] Answer reset for question ${question.id}`,
-    );
-  }, [question.id]);
-
+  // 問題変更や親からの初期解答更新が入ったら必ずリセット
+  useEffect(() => {
+    setSelectedAnswers(initialAnswer);
+    console.log(
+      `[FillInFinancialStatementForm] Answer reset for question ${question.id}`,
+    );
+  }, [question.id, initialAnswer]);
```

### 動作確認（手動）
- Q3_FS_004 → Q3_FS_005へ遷移し、各空欄がプレースホルダー状態に初期化されることを確認
- Metroログで `question.id` 変更時のリセットログを確認

### 今後の注意点
- `initialAnswer` をオブジェクトリテラルで生成する上位レイヤーでは、不要な再生成によるリセット多発を避けるため `useMemo` の活用も検討
- 追加テスト: `fill_in_financial_statement` 問題を対象とした自動テスト（スナップショット or E2E）を用意すると効果的

## 関連ファイル

- `src/components/QuestionDisplay.tsx` (lines 481-550)
- `src/components/cbt/FillInFinancialStatementForm.tsx` (lines 1-413)
- `src/components/cbt/BlankSelector.tsx` (lines 1-145)
- `src/data/master-questions.ts` (Q3_FS_001-015)

## 参考情報

### Q3_FS_004のデータ構造

```json
{
  "id": "Q3_FS_004",
  "answer_template_json": {
    "blanks": [
      {
        "itemIndex": 10,
        "field": "amount",
        "choices": [4950000, 5150000, 5350000, 5550000]
      },
      {
        "itemIndex": 11,
        "field": "amount",
        "choices": [5150000, 5350000, 5550000, 5750000]
      }
    ]
  },
  "correct_answer_json": {
    "blanks": [
      { "index": 0, "correctIndex": 2 },
      { "index": 1, "correctIndex": 2 }
    ]
  }
}
```

### Q3_FS_005のデータ構造

```json
{
  "id": "Q3_FS_005",
  "answer_template_json": {
    "blanks": [
      {
        "itemIndex": 6,
        "field": "amount",
        "choices": [750000, 780000, 800000, 820000]
      },
      {
        "itemIndex": 7,
        "field": "amount",
        "choices": [190000, 220000, 240000, 260000]
      }
    ]
  },
  "correct_answer_json": {
    "blanks": [
      { "index": 0, "correctIndex": 2 },
      { "index": 1, "correctIndex": 2 }
    ]
  }
}
```

**問題の核心**: Q3_FS_004で `selectedAnswers = {0: 2, 1: 2}` が設定された場合、Q3_FS_005に遷移しても同じインデックス `{0: 2, 1: 2}` が残り、Q3_FS_005のchoices配列の3番目の値（800000と240000）が表示されてしまう。

## Codexへの質問例

1. なぜuseEffectでselectedAnswersをリセットしても、BlankSelectorに反映されないのか？
2. FillInFinancialStatementFormWrapperとFillInFinancialStatementFormの二重のuseEffect構造は適切か？
3. key propを追加して完全に再マウントする方が確実か？
4. BlankSelector.tsxのselectedIndex propの更新が正しく検知されているか確認する方法は？

## 期待される解決策

- Q3_FS_004からQ3_FS_005に遷移したとき、Q3_FS_005の空欄フィールドが必ず `selectedIndex = null` の状態（プレースホルダー表示）になること
- selectedAnswersのリセットがBlankSelectorまで確実に伝播すること
- Reactの再レンダリングサイクル内で確実に状態が更新されること
