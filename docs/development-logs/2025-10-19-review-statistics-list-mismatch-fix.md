# 復習統計とリスト取得の不一致修正

## 日時

2025年10月19日

## 問題の概要

復習タブで統計表示は「復習対象1問」と表示されるが、「全て復習」ボタンをクリックすると「復習対象の問題はありません」というエラーが表示される不一致が発生していた。

## 根本原因

統計取得クエリとリスト取得クエリでWHERE句の条件が異なっていたため、データベースに不正なステータス値を持つreview_itemsが存在する場合に不一致が発生していた。

### クエリの違い

**統計取得クエリ** (`getReviewStatistics`):

```sql
WHERE ri.status != 'mastered'
```

→ mastered以外のすべてのステータスをカウント

**リスト取得クエリ** (`getReviewList`):

```sql
WHERE ri.status IN ('needs_review', 'priority_review')
```

→ 2つの特定ステータスのみ取得

### 問題のシナリオ

1. データベースに`status`が空文字列やnull、または不正な値を持つreview_itemsが存在
2. 統計クエリ: `status != 'mastered'` なので、これらのアイテムがカウントされる
3. リスト取得クエリ: `status IN ('needs_review', 'priority_review')` なので、これらのアイテムは除外される
4. 結果: 統計では「1問」と表示されるが、実際にリスト取得すると0件になる

## 修正内容

### src/data/repositories/review-item-repository.ts

#### 1. 基本統計クエリの修正（line 329）

**変更前:**

```typescript
SUM(CASE WHEN ri.status != 'mastered' THEN 1 ELSE 0 END) as totalReviewItems
```

**変更後:**

```typescript
SUM(CASE WHEN ri.status IN ('needs_review', 'priority_review') THEN 1 ELSE 0 END) as totalReviewItems
```

#### 2. 優先度分布クエリの修正（line 356）

**変更前:**

```sql
WHERE ri.status != 'mastered'
```

**変更後:**

```sql
WHERE ri.status IN ('needs_review', 'priority_review')
```

#### 3. カテゴリ別統計クエリの修正（line 381, 385）

**変更前:**

```typescript
SUM(CASE WHEN ri.status != 'mastered' THEN 1 ELSE 0 END) as total
AVG(CASE WHEN ri.status != 'mastered' THEN ri.priority_score ELSE NULL END) as averagePriority
```

**変更後:**

```typescript
SUM(CASE WHEN ri.status IN ('needs_review', 'priority_review') THEN 1 ELSE 0 END) as total
AVG(CASE WHEN ri.status IN ('needs_review', 'priority_review') THEN ri.priority_score ELSE NULL END) as averagePriority
```

## 技術的な考察

### ReviewStatusの型定義

`src/types/database.ts`で定義されているReviewStatus型：

```typescript
export type ReviewStatus = "needs_review" | "priority_review" | "mastered";
```

TypeScript型定義では3つの値しか許可されていないが、データベースレベルでは不正な値が入る可能性がある：

- データマイグレーション時のバグ
- 手動のSQL実行
- アプリの以前のバージョンからの残存データ
- データベースの破損

### 防御的プログラミングの観点

今回の修正により、統計クエリとリスト取得クエリの両方が**明示的に有効なステータスのみ**を対象とするようになり、不正なデータに対して堅牢になった。

## 効果

### 修正前

- 統計: 不正なステータスを持つreview_itemsもカウント
- リスト: 不正なステータスを持つreview_itemsは除外
- 結果: 不一致が発生

### 修正後

- 統計: 'needs_review'と'priority_review'のみカウント
- リスト: 'needs_review'と'priority_review'のみ取得
- 結果: 完全一致

## forceUpdate問題の解決

### 調査中の状況

修正の調査中に`forceUpdate`フラグを一時的に`true`に設定していたが、これは以下のリスクがあった：

- アプリ起動のたびにユーザーデータが削除される
- learning_history（学習履歴）の消失
- review_items（復習対象）の消失
- user_progress（学習進捗）の消失

### 復元

コミット`92b37ed`で`forceUpdate`を`false`に戻し、ユーザーデータ保護を復元した。

## 検証結果

### コンパイル確認

- TypeScriptエラー: なし（既存のエラーのみ）
- 修正ファイル: src/data/repositories/review-item-repository.ts のみ
- 影響範囲: 復習統計表示、優先度分布、カテゴリ別統計

### アプリ起動確認

- Expoバンドル: 正常（1229モジュール、7100ms）
- forceUpdate: false として正常動作
- 既存データ: 370問が保持されていることを確認

## 今後の対応

### 推奨テスト

ユーザーに以下の動作確認を依頼：

1. **復習タブを開く**
2. **統計表示を確認**（「復習対象N問」の表示）
3. **「全て復習」ボタンをクリック**
4. **期待結果**: 統計で表示された問題数と同じ数の問題が表示される
5. **エラー**: 「復習対象の問題はありません」が表示されないこと

### データクリーンアップ

もし不正なステータスを持つreview_itemsが存在する場合、以下のSQLで修正可能：

```sql
-- 不正なステータスをneeds_reviewに修正
UPDATE review_items
SET status = 'needs_review'
WHERE status NOT IN ('needs_review', 'priority_review', 'mastered');

-- orphaned review_itemsを削除
DELETE FROM review_items
WHERE question_id NOT IN (SELECT id FROM questions);
```

ただし、`ensureReviewItemsIntegrity()`関数がアプリ起動時に自動的にorphaned itemsをクリーンアップするため、通常は手動実行は不要。

## 関連する過去の修正

- **2025-10-19**: データベース初期化エラー修正（別の問題）
- **2025-08-14**: 復習リスト表示問題の修復（forceUpdate問題）

この修正により、統計とリストの完全一致が保証され、ユーザー体験が改善される。

## コミット情報

- **修正コミット**: `78e9828` - 復習統計とリスト取得のWHERE句を完全一致に修正
- **forceUpdate復元**: `92b37ed` - forceUpdateをfalseに戻してユーザーデータ保護を復元
- **診断ツール**: `scripts/dev-tools/diagnose-review-mismatch.js` - 問題診断用スクリプト作成

## 備考

この問題の根本原因は「統計とリストで異なる条件を使用していた」ことであり、不正なデータの存在ではなかった。修正により、データベースに不正な値が存在する場合でも、統計とリストの両方で無視されるため、一貫性が保たれる。
