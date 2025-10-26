# 復習・統計システムのデータ不整合問題 - Codex修正依頼

## 🚨 現在発生している問題（Critical）

### 問題1: 復習タブ - 存在する問題が「存在しない」と表示される

**症状**:

- 実際には復習対象の問題（review_items）が存在する
- しかし、復習タブで「復習対象問題がありません」と表示される
- または、カテゴリボタンをクリックしても「○○の復習対象問題がありません」というアラートが出る

**期待される動作**:

- review_itemsテーブルにデータがあり、対応するquestionsも存在する場合
- 復習タブで正しく件数が表示され、ボタンクリックで問題画面に遷移する

### 問題2: 統計タブ - 回答済み問題が0問と表示される

**症状**:

- 実際には学習して回答済みの問題（learning_history）が存在する
- しかし、統計タブで「回答済み: 0問」と表示される
- または、分野別進捗が全て0問と表示される

**期待される動作**:

- learning_historyテーブルにデータがある場合
- 統計タブで正しく回答済み件数が表示される
- 分野別進捗も正確に表示される

## 📋 背景情報

### 直前に実施した修正（2025-10-19）

以下の修正を実施した直後に問題が発生しました：

1. **Orphaned review_itemsクリーンアップ機能の追加**
   - ファイル: `src/data/repositories/review-item-repository.ts`
   - メソッド: `cleanupOrphanedItems()`
   - 機能: 存在しない問題を参照しているreview_itemsを削除

2. **データベース初期化時の自動クリーンアップ**
   - ファイル: `src/data/migrations/index.ts`
   - 追加箇所: `loadSampleData()` 関数内（lines 434-455）
   - タイミング: サンプルデータ読み込み時に毎回実行

3. **Orphaned items検出ログの強化**
   - ファイル: `src/services/review-service.ts`
   - メソッド: `generateReviewList()` (lines 383-412)

### 修正の詳細ドキュメント

`docs/development-logs/2025-10-19-review-items-data-consistency-fix.md`

## 🔍 調査すべきポイント

### 1. データベースの実際の状態確認

**確認が必要なデータ**:

```sql
-- 1. review_itemsテーブルの件数と内容
SELECT COUNT(*) FROM review_items;
SELECT * FROM review_items LIMIT 10;

-- 2. learning_historyテーブルの件数と内容
SELECT COUNT(*) FROM learning_history;
SELECT * FROM learning_history WHERE is_correct = 0 LIMIT 10;

-- 3. orphaned review_itemsの確認（存在しない問題を参照）
SELECT ri.*
FROM review_items ri
LEFT JOIN questions q ON ri.question_id = q.id
WHERE q.id IS NULL;

-- 4. カテゴリ別のreview_items集計
SELECT q.category_id, ri.status, COUNT(*) as count
FROM review_items ri
INNER JOIN questions q ON ri.question_id = q.id
GROUP BY q.category_id, ri.status;

-- 5. カテゴリ別の回答済み問題数
SELECT q.category_id, COUNT(DISTINCT lh.question_id) as answered_count
FROM learning_history lh
INNER JOIN questions q ON lh.question_id = q.id
GROUP BY q.category_id;
```

### 2. クリーンアップロジックの検証

**確認ポイント**:

- `cleanupOrphanedItems()`が正常なreview_itemsまで削除していないか？
- LEFT JOINのロジックが正しいか？
- カテゴリIDの不一致でJOINが失敗していないか？

**該当コード**: `src/data/repositories/review-item-repository.ts` lines 514-563

```typescript
// Step 1: orphaned itemsの検出
const detectSql = `
  SELECT ri.question_id
  FROM review_items ri
  LEFT JOIN questions q ON ri.question_id = q.id
  WHERE q.id IS NULL
`;

// Step 2: orphaned itemsの削除
const deleteSql = `
  DELETE FROM review_items
  WHERE question_id NOT IN (SELECT id FROM questions)
`;
```

### 3. 統計計算ロジックの検証

**確認ポイント**:

- `getReviewStatistics()`が正しく集計しているか？
- `analyzeWeakAreas()`が正しく件数を計算しているか？
- カテゴリIDのマッピングが正しいか？

**該当コード**:

- `src/data/repositories/review-item-repository.ts` lines 321-444: `getReviewStatistics()`
- `src/services/review-service.ts` lines 463-532: `analyzeWeakAreas()`
- `src/services/statistics-service.ts`: 統計全般

### 4. データベーストランザクションの確認

**確認ポイント**:

- サンプルデータ読み込み時のトランザクション範囲は適切か？
- `DELETE FROM questions` と `cleanupOrphanedItems()` の実行順序は正しいか？
- FOREIGN KEY制約は適切に設定されているか？

**該当コード**: `src/data/migrations/index.ts` lines 189-244

## 🎯 修正の方向性（仮説）

### 仮説1: クリーンアップが過剰に動作している

**可能性**:

- カテゴリID不一致により、正常なreview_itemsが「orphaned」と誤判定されている
- 例: questions.category_id = "journal" vs review_items参照先のquestion_id = "Q_J_001"
- LEFT JOINが意図せず失敗し、全てのreview_itemsが削除されている

**検証方法**:

```typescript
// cleanupOrphanedItems() の前にログ出力
logger.debug("[ReviewItemRepository] クリーンアップ前のreview_items件数:", {
  details: await this.executeQuery("SELECT COUNT(*) FROM review_items", []),
});

// JOINの結果を確認
logger.debug("[ReviewItemRepository] JOIN成功件数:", {
  details: await this.executeQuery(
    `
    SELECT COUNT(*)
    FROM review_items ri
    INNER JOIN questions q ON ri.question_id = q.id
  `,
    [],
  ),
});
```

### 仮説2: 統計取得時のクエリエラー

**可能性**:

- `getReviewStatistics()`のSQLクエリにエラーがある
- GROUP BYやJOINの条件が正しくない
- カテゴリIDのマッピングが誤っている

**検証方法**:

```typescript
// statistics-service.ts または review-service.ts で
logger.debug("[StatisticsService] 統計取得開始");
const rawStats = await databaseService.executeSql(`
  SELECT q.category_id, COUNT(DISTINCT lh.question_id) as count
  FROM learning_history lh
  INNER JOIN questions q ON lh.question_id = q.id
  GROUP BY q.category_id
`);
logger.debug("[StatisticsService] 生統計データ:", rawStats.rows);
```

### 仮説3: データベース初期化タイミングの問題

**可能性**:

- `cleanupOrphanedItems()`が`questions`削除後、新データ挿入前に実行されている
- その結果、全てのreview_itemsが「orphaned」と判定され削除される
- その後にquestionsが再挿入されても、review_itemsは復元されない

**修正案**:

```typescript
// migrations/index.ts の実行順序を変更
// Before:
// 1. DELETE questions
// 2. INSERT questions
// 3. cleanupOrphanedItems()

// After:
// 1. DELETE questions
// 2. DELETE review_items (forceUpdateの場合のみ)
// 3. INSERT questions
// 4. cleanupOrphanedItems() は実行しない or 条件付き実行
```

## 📝 推奨する修正手順

### Step 1: 緊急対応（即座に実施）

**Option A: クリーンアップ機能の一時無効化**

`src/data/migrations/index.ts` lines 434-455 を以下のようにコメントアウト：

```typescript
// Orphaned review_itemsのクリーンアップ（一時無効化）
// try {
//   logger.debug("[Database] orphaned review_itemsクリーンアップ開始");
//   const { reviewItemRepository } = await import(
//     "../repositories/review-item-repository"
//   );
//   const deletedCount = await reviewItemRepository.cleanupOrphanedItems();
//   ...
// }
```

**Option B: 条件付き実行**

```typescript
// forceUpdate時のみクリーンアップを実行
if (forceUpdate) {
  try {
    logger.debug("[Database] orphaned review_itemsクリーンアップ開始（forceUpdate=true時のみ）");
    const { reviewItemRepository } = await import(
      "../repositories/review-item-repository"
    );
    const deletedCount = await reviewItemRepository.cleanupOrphanedItems();
    ...
  }
}
```

### Step 2: 詳細調査の実施

**診断スクリプトの実行**:

```bash
# データベースの現在の状態を確認
sqlite3 ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application/*/Library/LocalDatabase/SQLite.db "
SELECT 'review_items', COUNT(*) FROM review_items
UNION ALL
SELECT 'learning_history', COUNT(*) FROM learning_history
UNION ALL
SELECT 'questions', COUNT(*) FROM questions;
"
```

**ログの確認**:
Metro bundlerのログで以下を確認：

- `[Database] orphaned review_itemsクリーンアップ開始`
- `[Database] orphaned review_itemsクリーンアップ完了: N件削除`
- `[ReviewService] 復習リスト生成完了`
- `[ReviewService] Orphaned review_items検出`

### Step 3: 根本的な修正

**修正案1: クリーンアップロジックの改善**

```typescript
// review-item-repository.ts
public async cleanupOrphanedItems(): Promise<number> {
  try {
    logger.debug("[ReviewItemRepository] orphaned review_items検出開始");

    // より安全な検出ロジック
    const detectSql = `
      SELECT ri.question_id, ri.status, ri.priority_score
      FROM review_items ri
      LEFT JOIN questions q ON ri.question_id = q.id
      WHERE q.id IS NULL
    `;

    const orphanedItems = await this.executeQuery<{
      question_id: string;
      status: string;
      priority_score: number;
    }>(detectSql, []);

    // 詳細ログ出力
    logger.debug(
      `[ReviewItemRepository] orphaned検出結果: ${orphanedItems.rows.length}件`,
      { details: orphanedItems.rows }
    );

    if (orphanedItems.rows.length === 0) {
      logger.debug("[ReviewItemRepository] orphaned review_itemsなし");
      return 0;
    }

    // 削除前に確認
    logger.warn(
      `[ReviewItemRepository] 以下のreview_itemsを削除します:`,
      { details: orphanedItems.rows.map(r => r.question_id) }
    );

    // 安全な削除（NOT IN句ではなくEXISTSを使用）
    const deleteSql = `
      DELETE FROM review_items
      WHERE NOT EXISTS (
        SELECT 1 FROM questions
        WHERE questions.id = review_items.question_id
      )
    `;

    const result = await this.executeQuery(deleteSql, []);

    logger.info(
      `[ReviewItemRepository] orphaned review_itemsクリーンアップ完了: ${result.rowsAffected}件削除`
    );

    return result.rowsAffected;
  } catch (error) {
    logger.error(
      "[ReviewItemRepository] cleanupOrphanedItems エラー:",
      error as Error
    );
    throw error;
  }
}
```

**修正案2: 統計取得の強化**

```typescript
// statistics-service.ts または review-service.ts
public async getAnsweredQuestionsCount(): Promise<number> {
  try {
    logger.debug("[StatisticsService] 回答済み問題数取得開始");

    // デバッグ用の詳細クエリ
    const debugQuery = await databaseService.executeSql(`
      SELECT
        COUNT(DISTINCT lh.question_id) as answered_count,
        COUNT(*) as total_attempts
      FROM learning_history lh
      INNER JOIN questions q ON lh.question_id = q.id
    `);

    logger.debug("[StatisticsService] 回答済み問題数:", {
      details: debugQuery.rows[0]
    });

    return debugQuery.rows[0].answered_count;
  } catch (error) {
    logger.error("[StatisticsService] 回答済み問題数取得エラー:", error);
    return 0;
  }
}
```

## 🔧 デバッグ用のログ追加箇所

以下の箇所に詳細ログを追加して、問題の切り分けを行ってください：

### 1. データベース初期化時

```typescript
// src/data/migrations/index.ts
console.log("[DEBUG] クリーンアップ前:");
console.log(
  "  review_items件数:",
  await databaseService.executeSql("SELECT COUNT(*) FROM review_items"),
);
console.log(
  "  questions件数:",
  await databaseService.executeSql("SELECT COUNT(*) FROM questions"),
);

await reviewItemRepository.cleanupOrphanedItems();

console.log("[DEBUG] クリーンアップ後:");
console.log(
  "  review_items件数:",
  await databaseService.executeSql("SELECT COUNT(*) FROM review_items"),
);
```

### 2. 復習リスト生成時

```typescript
// src/services/review-service.ts
logger.debug("[ReviewService] generateReviewList開始:", {
  category: options.category,
  maxCount: options.maxCount,
});

const reviewItems = await this.reviewItemRepository.getReviewList(filter);
logger.debug("[ReviewService] review_items取得結果:", {
  count: reviewItems.length,
  details: reviewItems.slice(0, 3), // 最初の3件のみログ出力
});
```

### 3. 統計計算時

```typescript
// src/services/statistics-service.ts または review-service.ts
logger.debug("[StatisticsService] 統計計算開始");

const rawData = await databaseService.executeSql(`
  SELECT
    q.category_id,
    COUNT(DISTINCT lh.question_id) as answered,
    COUNT(*) as total_attempts
  FROM learning_history lh
  INNER JOIN questions q ON lh.question_id = q.id
  GROUP BY q.category_id
`);

logger.debug("[StatisticsService] 生データ:", { details: rawData.rows });
```

## 📊 期待される出力

修正後、以下のログが出力されることを確認してください：

```
[DEBUG] クリーンアップ前:
  review_items件数: 5
  questions件数: 370

[DEBUG] orphaned review_items検出開始
[DEBUG] orphaned検出結果: 0件
[DEBUG] orphaned review_itemsなし

[DEBUG] クリーンアップ後:
  review_items件数: 5

[ReviewService] generateReviewList開始: { category: "ledger", maxCount: 15 }
[ReviewService] review_items取得結果: { count: 5, details: [...] }
[ReviewService] 復習リスト生成完了: 5/5件（orphaned: 0件）

[StatisticsService] 統計計算開始
[StatisticsService] 生データ: { details: [
  { category_id: "journal", answered: 10, total_attempts: 15 },
  { category_id: "ledger", answered: 5, total_attempts: 8 }
] }
```

## ✅ 修正完了の確認基準

以下の全てが正常に動作することを確認してください：

1. **データベース初期化**
   - [ ] orphaned review_itemsのクリーンアップが正しく動作
   - [ ] 正常なreview_itemsが削除されない
   - [ ] questionsデータが正しく読み込まれる

2. **復習タブ**
   - [ ] review_itemsが存在する場合、正しく件数が表示される
   - [ ] カテゴリボタンクリックで問題画面に遷移する
   - [ ] 「復習対象問題がありません」が誤表示されない

3. **統計タブ**
   - [ ] learning_historyが存在する場合、正しく回答済み件数が表示される
   - [ ] 分野別進捗が正確に表示される
   - [ ] 0問と誤表示されない

4. **ログ出力**
   - [ ] orphaned items検出時に適切なWARNログが出力される
   - [ ] クリーンアップ件数が正しく報告される
   - [ ] エラーログが出力されない

## 📚 関連ファイル

- `src/data/repositories/review-item-repository.ts`
- `src/data/migrations/index.ts`
- `src/services/review-service.ts`
- `src/services/statistics-service.ts`
- `app/(tabs)/review/index.tsx`
- `app/(tabs)/statistics.tsx`
- `docs/development-logs/2025-10-19-review-items-data-consistency-fix.md`

## 🚀 優先度

**P0 (Critical)**: 即座に修正が必要

- ユーザーがアプリの主要機能（復習・統計）を使用できない
- データ損失の可能性がある（review_itemsの誤削除）

---

**作成日**: 2025-10-19
**報告者**: ユーザー
**対応予定**: Codex AI
