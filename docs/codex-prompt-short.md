# Codex修正依頼プロンプト（簡潔版）

## 問題

簿記3級問題集アプリで、以下の2つのCritical問題が発生しています：

### 1. 復習タブ: 存在する問題が「存在しない」と表示

- 実際にはreview_itemsテーブルにデータがある
- しかし「復習対象問題がありません」と表示される
- ボタンクリックしても問題画面に遷移しない

### 2. 統計タブ: 回答済み問題が0問と表示

- 実際にはlearning_historyテーブルにデータがある
- しかし「回答済み: 0問」と表示される
- 分野別進捗も全て0問と表示

## 直前の変更

2025-10-19に以下の修正を実施した直後に問題発生：

1. `src/data/repositories/review-item-repository.ts`に`cleanupOrphanedItems()`メソッド追加
2. `src/data/migrations/index.ts`でサンプルデータ読み込み時に自動クリーンアップを追加
3. `src/services/review-service.ts`で詳細ログ追加

詳細: `docs/development-logs/2025-10-19-review-items-data-consistency-fix.md`

## 最も可能性が高い原因

**仮説**: クリーンアップが`questions`削除後、新データ挿入前に実行され、全てのreview_itemsが削除されている

`src/data/migrations/index.ts`の実行順序:

1. `DELETE FROM questions` (line 233)
2. `INSERT INTO questions` (lines 295-339)
3. `cleanupOrphanedItems()` (lines 434-455) ← ここで全件が「orphaned」と判定される可能性

## 推奨修正

### 即座に実施（緊急対応）

`src/data/migrations/index.ts` lines 434-455 をコメントアウト：

```typescript
// Orphaned review_itemsのクリーンアップ（一時無効化）
/*
try {
  logger.debug("[Database] orphaned review_itemsクリーンアップ開始");
  const { reviewItemRepository } = await import(
    "../repositories/review-item-repository"
  );
  const deletedCount = await reviewItemRepository.cleanupOrphanedItems();
  // ...
} catch (cleanupError) {
  // ...
}
*/
```

### 根本修正

**Option A**: forceUpdate時のみクリーンアップを実行

```typescript
// カテゴリ名称を更新（独立した関数で実行）
await updateCategoryNames();

// Orphaned review_itemsのクリーンアップ（forceUpdate時のみ）
if (forceUpdate) {
  try {
    logger.debug("[Database] orphaned review_itemsクリーンアップ開始（forceUpdate=true時のみ）");
    const { reviewItemRepository } = await import(
      "../repositories/review-item-repository"
    );
    const deletedCount = await reviewItemRepository.cleanupOrphanedItems();
    // ...
  }
}
```

**Option B**: クリーンアップを削除処理の前に移動

```typescript
// Before (現在):
// 1. DELETE questions
// 2. INSERT questions
// 3. cleanupOrphanedItems()

// After:
// 1. cleanupOrphanedItems() ← questionsが存在する時点で実行
// 2. DELETE questions
// 3. INSERT questions
```

## 検証方法

修正後、以下を確認：

1. **Metro bundlerログ**:

```
[DEBUG] orphaned review_itemsなし - データ整合性正常
[ReviewService] 復習リスト生成完了: 5/5件（orphaned: 0件）
```

2. **復習タブ**: 復習対象問題が正しく表示され、クリックで遷移する

3. **統計タブ**: 回答済み問題数が正しく表示される

## 関連ファイル

- `src/data/repositories/review-item-repository.ts`
- `src/data/migrations/index.ts`
- `src/services/review-service.ts`
- `docs/development-logs/2025-10-19-review-items-data-consistency-fix.md`
- `docs/codex-fix-request-2025-10-19.md` (詳細版)

## 優先度

**P0 (Critical)**: ユーザーが主要機能を使用できない状態
