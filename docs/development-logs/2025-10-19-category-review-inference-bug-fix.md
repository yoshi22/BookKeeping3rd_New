# カテゴリ別復習のカテゴリ推論バグ修正

## 日時

2025年10月19日

## 問題の概要

カテゴリ別復習で「第2問」（帳簿問題カテゴリ）をクリックすると、統計表示では「復習対象1問」と表示されるが、実際に問題画面に遷移すると「復習対象の問題がありません」というエラーが発生する。

### 具体的な症状

- 復習タブで「第2問」ボタンをクリック
- 統計では1問が復習対象として認識されている
- 問題画面に遷移すると0問と判定されエラーになる

## 根本原因

問題画面（`app/(tabs)/review/question/[id].tsx`）が、ナビゲーション元から渡されたカテゴリ情報を使用せず、問題IDから独自にカテゴリを推論していたため。

### データフロー解析

**正常な処理（復習一覧画面）**:

```
1. ユーザーが「第2問」（ledger）をクリック
2. reviewService.startReviewSession({ category: "ledger", maxCount: 15 })
3. データベースクエリ: WHERE category='ledger' AND status IN ('needs_review', 'priority_review')
4. 結果: 1件取得（Q2_B_001）
5. 問題画面に遷移（params: { id: "Q2_B_001", categoryFilter: "true" }）
```

**バグのある処理（問題画面）**:

```
6. 問題画面でgetCategoryFromId("Q2_B_001")を実行
7. ID推論ロジック: "Q2_B_001"は"Q_J_"で始まらない → デフォルト"journal"を返す
8. reviewService.generateReviewList({ category: "journal", maxCount: 50 })
9. データベースクエリ: WHERE category='journal' AND status IN ('needs_review', 'priority_review')
10. 結果: 0件（実際のQ2_B_001はledgerカテゴリのため）
11. エラー表示: "復習対象の問題がありません"
```

### コードレベルの問題箇所

**`app/(tabs)/review/question/[id].tsx` (修正前)**:

```typescript
// Line 60-67: カテゴリをIDから推論（不正確）
const getCategoryFromId = (
  questionId: string,
): "journal" | "ledger" | "trial_balance" => {
  if (questionId.startsWith("Q_J_")) return "journal";
  if (questionId.startsWith("Q_L_")) return "ledger";
  if (questionId.startsWith("Q_T_")) return "trial_balance";
  return "journal"; // デフォルト
};

const category = getCategoryFromId(id as string);

// Line 125-136: 推論されたカテゴリを使用（問題！）
const reviewQuestions = await reviewService.generateReviewList(
  shouldFilterByCategory
    ? {
        category: category, // ← ここが間違い
        maxCount: 50,
      }
    : {
        maxCount: 50,
      },
);
```

## 修正内容

### 1. 復習一覧画面の修正

**ファイル**: `app/(tabs)/review/index.tsx`

**変更箇所**: Line 519-527

**変更内容**: カテゴリ別復習開始時に、選択されたカテゴリをナビゲーションパラメータとして渡す

```typescript
// 修正前
router.push({
  pathname: "/(tabs)/review/question/[id]",
  params: {
    id: session.questions[0].id,
    sessionId: session.sessionId,
    sessionType: "review",
    categoryFilter: "true",
  },
});

// 修正後
router.push({
  pathname: "/(tabs)/review/question/[id]",
  params: {
    id: session.questions[0].id,
    sessionId: session.sessionId,
    sessionType: "review",
    categoryFilter: "true",
    selectedCategory: categoryId, // ← 実際に選択されたカテゴリを渡す
  },
});
```

### 2. 問題画面の修正

**ファイル**: `app/(tabs)/review/question/[id].tsx`

**変更箇所1**: Line 39 - パラメータ抽出に`selectedCategory`を追加

```typescript
// 修正前
const { id, sessionId, sessionType, filteredQuestions, categoryFilter } =
  useLocalSearchParams();

// 修正後
const {
  id,
  sessionId,
  sessionType,
  filteredQuestions,
  categoryFilter,
  selectedCategory,
} = useLocalSearchParams();
```

**変更箇所2**: Line 128-138 - 実際のカテゴリ判定ロジック

```typescript
// 修正前
const reviewQuestions = await reviewService.generateReviewList(
  shouldFilterByCategory
    ? {
        category: category, // ID推論によるカテゴリ
        maxCount: 50,
      }
    : {
        maxCount: 50,
      },
);

// 修正後
// カテゴリフィルタリング時は、selectedCategoryが渡されていればそれを使用
// （カテゴリ別復習の場合）、なければIDから推定したカテゴリを使用（後方互換性）
const actualCategory =
  shouldFilterByCategory && selectedCategory
    ? (selectedCategory as "journal" | "ledger" | "trial_balance")
    : category;

const reviewQuestions = await reviewService.generateReviewList(
  shouldFilterByCategory
    ? {
        category: actualCategory, // ← 正確なカテゴリを使用
        maxCount: 50,
      }
    : {
        maxCount: 50,
      },
);
```

**変更箇所3**: Line 175-183 - useEffect依存配列に`selectedCategory`を追加

```typescript
// 修正前
}, [
  id,
  category,
  sessionType,
  sessionId,
  filteredQuestions,
  categoryFilter,
  router,
]);

// 修正後
}, [
  id,
  category,
  sessionType,
  sessionId,
  filteredQuestions,
  categoryFilter,
  selectedCategory,  // ← 追加
  router,
]);
```

## 技術的な考察

### 問題ID命名規則の不一致

この問題の根本的な原因は、問題IDの命名規則とカテゴリの対応が一貫していなかったこと：

- 推論ロジックの想定: `Q_J_xxx` = journal, `Q_L_xxx` = ledger, `Q_T_xxx` = trial_balance
- 実際のID: `Q2_B_001` のような形式も存在

### 設計パターンの問題

**アンチパターン**: データの推論に依存

- 問題画面が問題IDからカテゴリを「推測」していた
- 推測が外れると不整合が発生

**ベストプラクティス**: 明示的なデータ受け渡し

- ナビゲーション元で既に知っているカテゴリ情報を渡す
- 推測ではなく確実な情報を使用

### 後方互換性の確保

```typescript
const actualCategory =
  shouldFilterByCategory && selectedCategory
    ? (selectedCategory as "journal" | "ledger" | "trial_balance")
    : category;
```

この実装により：

- `selectedCategory`が渡される新しいフロー: 正確なカテゴリを使用
- `selectedCategory`が渡されない既存フロー: ID推論にフォールバック（後方互換性）

## 効果

### 修正前

- **カテゴリ別復習**: ユーザー選択カテゴリと実際の問題取得カテゴリが不一致
- **エラー発生**: 統計では表示されるが実際には問題が取得できない
- **ユーザー体験**: 混乱と不信感

### 修正後

- **カテゴリ別復習**: ユーザー選択カテゴリが正確に問題画面まで伝達
- **正常動作**: 統計と実際の問題取得が完全一致
- **ユーザー体験**: スムーズな復習フロー

## 検証方法

### 手動テスト手順

1. **復習タブを開く**
2. **「第2問」（帳簿問題カテゴリ）をクリック**
3. **期待結果**: 問題Q2_B_001が正常に表示される
4. **修正前の動作**: "復習対象の問題がありません"エラー

### デバッグログ確認

**修正前のログ**:

```
LOG  [DEBUG] startReviewSession() options: {"category":"ledger","maxCount":15}
LOG  [DEBUG] getReviewList() filter: {"status":["needs_review","priority_review"],"category":"ledger","limit":15}
LOG  [DEBUG] getReviewList() 結果件数: 1  ← 復習一覧では成功
LOG  [DEBUG] getReviewList() filter: {"status":["needs_review","priority_review"],"category":"journal","limit":50}
LOG  [DEBUG] getReviewList() 結果件数: 0  ← 問題画面では失敗（カテゴリ不一致）
```

**修正後のログ（期待値）**:

```
LOG  [DEBUG] startReviewSession() options: {"category":"ledger","maxCount":15}
LOG  [DEBUG] getReviewList() filter: {"status":["needs_review","priority_review"],"category":"ledger","limit":15}
LOG  [DEBUG] getReviewList() 結果件数: 1  ← 復習一覧で成功
LOG  [DEBUG] getReviewList() filter: {"status":["needs_review","priority_review"],"category":"ledger","limit":50}
LOG  [DEBUG] getReviewList() 結果件数: 1  ← 問題画面でも成功（カテゴリ一致）
```

## 関連する過去の修正

- **2025-10-19**: 復習統計とリスト取得の不一致修正（別の問題）
- **2025-10-19**: categoryFilterパラメータ導入（本修正の前提）

## 今後の改善案

### 問題ID命名規則の統一

現在の問題ID形式を標準化：

- 現状: `Q_J_xxx`, `Q_L_xxx`, `Q_T_xxx`, `Q2_B_xxx` など混在
- 提案: すべて `Q_{CATEGORY}_{NUMBER}` 形式に統一
  - journal: `Q_J_001`
  - ledger: `Q_L_001`
  - trial_balance: `Q_T_001`

### カテゴリ情報の一元管理

問題データに明示的なカテゴリフィールドを持たせ、IDからの推論を完全に排除。

## コミット情報

**コミットハッシュ**: (未コミット - 次のコミットで記録予定)

**コミットメッセージ案**:

```
fix: カテゴリ別復習で選択カテゴリを正確に問題画面に渡す

問題:
- カテゴリ別復習で問題画面がIDからカテゴリを推論していた
- 推論が不正確で、統計と実際の問題取得が不一致

修正:
- 復習一覧でselectedCategoryパラメータを追加
- 問題画面で渡されたカテゴリを優先使用
- ID推論にフォールバックして後方互換性を確保

影響範囲:
- app/(tabs)/review/index.tsx (L526)
- app/(tabs)/review/question/[id].tsx (L39, 130-138, 182)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 備考

この修正により、カテゴリ別復習機能が本来の設計通り動作するようになる。`categoryFilter`パラメータと`selectedCategory`パラメータの組み合わせにより、以下の3つの復習モードすべてが正確に機能する：

1. **全て復習**: `categoryFilter="false"` - カテゴリ制限なし
2. **重点復習**: `categoryFilter="false"` - 優先度フィルタのみ
3. **カテゴリ別復習**: `categoryFilter="true"` + `selectedCategory="ledger"` - 特定カテゴリのみ
