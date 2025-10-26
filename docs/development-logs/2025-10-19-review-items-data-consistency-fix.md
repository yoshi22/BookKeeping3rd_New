# 2025-10-19 復習アイテムのデータ整合性修正

## 概要

新規インストール後に復習タブで「1問復習対象」と誤った表示が出る問題と、分野別弱点から復習対象問題をクリックしてもナビゲーションが動作しない問題を修正。

Orphaned review_items（存在しない問題を参照しているreview_items）の自動検出・クリーンアップ機能を実装し、データ整合性を保証するようにした。

## 問題の詳細

### 問題1: 誤った復習件数表示

**症状**:

- 新規インストール後、復習タブの分野別弱点で「第二問: 1問復習対象」と表示される
- 実際には学習履歴がないため、復習対象は0問であるべき

**スクリーンショット証跡**:
復習タブUIで以下の表示:

```
全て復習: 復習対象1問全て
第一問: 0問復習対象
第二問: 1問復習対象
第三問: 0問復習対象
```

### 問題2: ナビゲーション失敗

**症状**:

- 分野別弱点の「第二問」ボタンをクリックしても問題画面に遷移しない
- アラートやエラーメッセージも表示されない（サイレント失敗）

**ユーザーフィードバック**:

> "依然として回答すみの問題や分野別進捗がゼロ問になっており、分野別弱点から復習対象の問題をクリックしても遷移しません"

## 根本原因の分析

### データフロー分析

```
ユーザー操作
  ↓
startCategoryReview() [review/index.tsx:478-502]
  ↓
reviewService.startReviewSession()
  ↓
generateReviewList() [review-service.ts:341-403]
  ↓
reviewItemRepository.getReviewList() [review-item-repository.ts:240-316]
  ↓
questionRepository.findById() [question-repository.ts]
  ↓
問題データ取得（ここで失敗）
```

### 特定された根本原因

1. **forceUpdate = false の副作用**
   - `src/data/migrations/index.ts` line 145: `const forceUpdate = false;`
   - この設定により、`review_items`と`learning_history`はバージョン更新時に削除されない（line 189-211）
   - ユーザーデータ保護が目的だが、orphaned dataが残る可能性がある

2. **Orphaned review_items の存在**
   - `review_items`テーブルに古いデータが残っている
   - それらのデータが参照する`question_id`が`questions`テーブルに存在しない
   - JOINクエリでは`review_items`は取得できるが、対応する`Question`オブジェクトは取得できない

3. **generateReviewList() の問題**
   - `review-service.ts` lines 387-392で問題データを取得
   - `question`がnullの場合、サイレントにスキップしていた（ログなし）
   - review_items: 1件 → questions: 0件 → 空配列を返す
   - 空配列により`startCategoryReview()`でアラート表示してreturn（line 486-488）

## 実装した修正

### 修正1: Orphaned review_itemsクリーンアップ機能の実装

**ファイル**: `src/data/repositories/review-item-repository.ts`

**追加メソッド**: `cleanupOrphanedItems()` (lines 508-563)

```typescript
/**
 * Orphaned review_itemsのクリーンアップ
 * 存在しない問題を参照しているreview_itemsを削除
 */
public async cleanupOrphanedItems(): Promise<number> {
  try {
    logger.debug("[ReviewItemRepository] orphaned review_items検出開始");

    // Step 1: orphaned itemsの検出
    const detectSql = `
      SELECT ri.question_id
      FROM review_items ri
      LEFT JOIN questions q ON ri.question_id = q.id
      WHERE q.id IS NULL
    `;

    const orphanedItems = await this.executeQuery<{ question_id: string }>(
      detectSql,
      [],
    );

    if (orphanedItems.rows.length === 0) {
      logger.debug(
        "[ReviewItemRepository] orphaned review_itemsなし - データ整合性正常",
      );
      return 0;
    }

    logger.warn(
      `[ReviewItemRepository] orphaned review_items検出: ${orphanedItems.rows.length}件`,
      { details: orphanedItems.rows.map((r) => r.question_id) },
    );

    // Step 2: orphaned itemsの削除
    const deleteSql = `
      DELETE FROM review_items
      WHERE question_id NOT IN (SELECT id FROM questions)
    `;

    const result = await this.executeQuery(deleteSql, []);

    logger.info(
      `[ReviewItemRepository] orphaned review_itemsクリーンアップ完了: ${result.rowsAffected}件削除`,
    );

    return result.rowsAffected;
  } catch (error) {
    logger.error(
      "[ReviewItemRepository] cleanupOrphanedItems エラー:",
      error as Error,
    );
    throw error;
  }
}
```

**技術的特徴**:

- LEFT JOINを使用してorphaned itemsを検出
- 検出時にWARNログで詳細を出力
- NOT IN句で安全に削除
- エラー時も例外をthrowしてアプリ起動を阻害しない

### 修正2: データベース初期化時の自動クリーンアップ

**ファイル**: `src/data/migrations/index.ts`

**追加箇所**: `loadSampleData()` 関数内 (lines 434-455)

```typescript
// Orphaned review_itemsのクリーンアップ（存在しない問題を参照しているアイテムを削除）
try {
  logger.debug("[Database] orphaned review_itemsクリーンアップ開始");
  const { reviewItemRepository } = await import(
    "../repositories/review-item-repository"
  );
  const deletedCount = await reviewItemRepository.cleanupOrphanedItems();
  if (deletedCount > 0) {
    logger.info(
      `[Database] orphaned review_itemsクリーンアップ完了: ${deletedCount}件削除`,
    );
  } else {
    logger.debug("[Database] orphaned review_itemsなし - データ整合性正常");
  }
} catch (cleanupError) {
  logger.warn("[Database] orphaned review_itemsクリーンアップエラー:", {
    details: cleanupError,
  });
  // クリーンアップエラーはアプリ起動を阻止しない
}
```

**実行タイミング**:

- カテゴリ名称更新（`updateCategoryNames()`）の直後
- バージョン情報保存の直前
- サンプルデータ読み込み時に毎回実行される

**安全性**:

- エラー時はWARNログのみ、アプリ起動は継続
- 0件削除でも正常動作（DEBUGログで確認可能）

### 修正3: Orphaned review_items検出ログの強化

**ファイル**: `src/services/review-service.ts`

**変更箇所**: `generateReviewList()` メソッド (lines 383-412)

**Before**:

```typescript
for (const questionId of questionIds) {
  const question = await this.questionRepository.findById(questionId);
  if (question) {
    questions.push(question);
  }
}

logger.debug("[ReviewService] 復習リスト生成完了: ${questions.length}件");
return questions;
```

**After**:

```typescript
const questions: Question[] = [];
const missingQuestionIds: string[] = [];

for (const questionId of questionIds) {
  const question = await this.questionRepository.findById(questionId);
  if (question) {
    questions.push(question);
  } else {
    // Orphaned review_item detected - review_item exists but question doesn't
    missingQuestionIds.push(questionId);
    logger.warn(
      `[ReviewService] 警告: review_itemが存在しますが、対応する問題が見つかりません: ${questionId}`,
    );
  }
}

// Orphaned review_itemsの検出をログ出力
if (missingQuestionIds.length > 0) {
  logger.warn(
    `[ReviewService] Orphaned review_items検出: ${missingQuestionIds.length}/${reviewItems.length}件`,
    { details: { missingQuestionIds, category: options.category } },
  );
}

logger.debug(
  `[ReviewService] 復習リスト生成完了: ${questions.length}/${reviewItems.length}件（orphaned: ${missingQuestionIds.length}件）`,
);
return questions;
```

**改善点**:

- Orphaned review_itemsの検出を明示的にログ出力
- どの`question_id`が見つからないかを記録
- カテゴリ情報も含めてトラブルシューティングを容易化

### 診断スクリプトの作成

**ファイル**: `scripts/dev-tools/diagnose-review-items.js`

**機能**:

1. review_itemsテーブル全件確認
2. questionsテーブル件数確認
3. Orphaned review_items検出（LEFT JOIN）
4. カテゴリ別review_items集計
5. learning_history誤答データ確認
6. 診断結果サマリーと推奨アクション提示

**使用方法**:

```bash
node scripts/dev-tools/diagnose-review-items.js
```

**注意**: TypeScript requireの問題により、現在は直接実行できない。Metro bundler経由でのログ確認を推奨。

## 検証手順

### 1. コード変更の確認

- [x] review-item-repository.ts: cleanupOrphanedItems()追加
- [x] migrations/index.ts: 自動クリーンアップ追加
- [x] review-service.ts: orphaned items検出ログ追加

### 2. アプリ起動時の確認

期待されるログ:

```
[DEBUG] orphaned review_itemsクリーンアップ開始
[DEBUG] orphaned review_itemsなし - データ整合性正常
```

または：

```
[DEBUG] orphaned review_itemsクリーンアップ開始
[WARN] orphaned review_items検出: 1件
[INFO] orphaned review_itemsクリーンアップ完了: 1件削除
```

### 3. 復習タブの確認

**確認項目**:

- [ ] 新規インストール後、全カテゴリの復習件数が0問と表示されるか
- [ ] 分野別弱点で誤った復習件数（1問等）が表示されないか
- [ ] 問題を1問間違えた後、復習タブで正しく1問と表示されるか
- [ ] 復習ボタンクリック時、正しく問題画面に遷移するか

### 4. ログ確認

**Metro bundler ログで確認**:

```bash
# Metro bundlerを起動
npm start

# 復習タブに遷移して以下のログを確認
# - [ReviewService] 復習リスト生成完了
# - orphaned: 0件 であること
# - WARNログが出力されないこと
```

## 影響範囲

### 影響あり

- **復習システム全体**: orphaned itemsのクリーンアップにより正確な件数表示
- **データベース初期化**: 毎回自動クリーンアップが実行される
- **復習リスト生成**: orphaned items検出時にWARNログが出力される

### 影響なし

- **学習システム**: 変更なし（answer-service.tsは未変更）
- **統計システム**: 間接的に正確な統計が得られる（orphaned itemsが減るため）
- **既存ユーザー**: forceUpdate=falseのまま、ユーザーデータは保護される

## 今後の検討事項

### 短期（次回リリースまで）

1. **実機での検証**
   - iOSシミュレーターでの動作確認
   - 新規インストール → 学習 → 復習の完全フロー確認

2. **パフォーマンステスト**
   - cleanupOrphanedItems()の実行時間測定
   - 大量のreview_items（100件以上）での動作確認

3. **ログレベルの調整**
   - orphaned items検出時のログレベル検討（WARNのままか、INFOに下げるか）

### 中期（次期バージョン）

1. **予防的データ検証**
   - review_items作成時にquestion存在チェックを追加
   - answer-service.tsでの防御的プログラミング

2. **定期クリーンアップ**
   - 週次での自動クリーンアップ実行
   - ユーザー設定で手動クリーンアップ機能追加

3. **データベース制約の強化**
   - FOREIGN KEY制約のON DELETE CASCADE検討
   - ただしSQLiteの制約に注意

### 長期（将来バージョン）

1. **マイグレーション戦略の見直し**
   - forceUpdate以外のデータ更新方法の検討
   - スキーマバージョン管理の強化

2. **データ整合性テスト**
   - E2Eテストでのデータ整合性検証
   - Detoxテストにorphaned items検出を追加

3. **ユーザー向けデータ修復機能**
   - 設定画面に「データベース整合性チェック」機能追加
   - ユーザー自身でorphaned itemsをクリーンアップ可能にする

## 技術的な学び

### Orphaned dataの発生原因

1. **バージョン管理の複雑性**
   - forceUpdate=falseでユーザーデータ保護
   - しかしquestion_idが変更された場合、review_itemsが孤立する

2. **SQLiteのFOREIGN KEY制約**
   - デフォルトではOFF（PRAGMA foreign_keys = OFF）
   - ON DELETE CASCADEが機能していない可能性

3. **トランザクション分離の重要性**
   - questionsテーブル削除とreview_items削除を同一トランザクションで実行すべき
   - 現在は別々のトランザクションのため、データ不整合が発生しうる

### データ整合性の保証方法

1. **検出 (Detection)**
   - LEFT JOINによるorphaned items検出
   - 定期的なデータ整合性チェック

2. **予防 (Prevention)**
   - FOREIGN KEY制約の適切な設定
   - トランザクション範囲の最適化

3. **修復 (Repair)**
   - 自動クリーンアップの実装
   - ユーザー向け修復ツールの提供

### ログ戦略の重要性

1. **適切なログレベル**
   - DEBUG: 通常フロー
   - WARN: orphaned items検出（データ不整合）
   - INFO: クリーンアップ完了（ユーザーデータ変更）
   - ERROR: クリティカルエラー

2. **診断可能性**
   - 問題IDを含む詳細ログ
   - カテゴリ情報の記録
   - 件数の明示

## 関連Issue・ドキュメント

### 過去の関連修正

- `2025-10-19-database-initialization-error-fix.md`: migration003のエラーハンドリング強化
- `2025-08-14-review-list-display-fix.md`: forceUpdate問題の初期対応

### 関連スクリプト

- `scripts/dev-tools/diagnose-review-items.js`: 診断スクリプト（新規作成）
- `scripts/dev-tools/check-review-data.js`: 既存の復習データ確認スクリプト
- `scripts/dev-tools/diagnose-migration-error.js`: マイグレーション診断スクリプト

### 参考資料

- SQLite FOREIGN KEY制約: https://www.sqlite.org/foreignkeys.html
- React Native デバッグ: https://reactnative.dev/docs/debugging
- Expo ログ出力: https://docs.expo.dev/workflow/logging/

## まとめ

**修正内容**:

1. Orphaned review_itemsの自動検出・削除機能を実装
2. データベース初期化時に自動クリーンアップを追加
3. 詳細なログ出力で問題の可視化を実現

**期待される効果**:

- 新規インストール後の誤った復習件数表示が解消される
- 分野別弱点からの正常なナビゲーションが実現される
- データ整合性が自動的に保証される
- トラブルシューティングが容易になる

**ユーザーへの影響**:

- ユーザーデータ（learning_history, review_items）は引き続き保護される（forceUpdate=false）
- Orphaned review_itemsのみが削除されるため、正常なデータは影響を受けない
- 復習システムの信頼性が向上する

---

## 追加修正: 統計クエリの整合性問題（2025-10-19 続き）

### 新たに発見された問題

orphaned review_items自動クリーンアップ機能を実装した後も、以下の不整合が残っていました：

**症状**:

- 復習タブの統計表示: 「復習対象: 2問」
- 「全て復習」ボタンをクリック: 「復習対象の問題がありません」というアラート

### 原因分析

1. **getReviewList()は正しく動作**: 既にINNER JOINでorphaned itemsを除外済み（前回修正）
2. **getReviewStatistics()に問題**: 統計クエリがorphaned itemsをカウントしていた
3. **結果**: 統計では2件とカウント、実際のリスト取得では0件 → 不整合

データベースには2件のorphaned review_itemsが残存していたため、統計とリスト取得の結果が一致しませんでした。

### 実施した追加修正

**ファイル**: `src/data/repositories/review-item-repository.ts`

#### 修正A: 基本統計クエリにINNER JOIN追加 (lines 324-335)

**修正前**:

```typescript
const basicStatsQuery = `
  SELECT
    SUM(CASE WHEN ri.status != 'mastered' THEN 1 ELSE 0 END) as totalReviewItems,
    SUM(CASE WHEN ri.status = 'needs_review' THEN 1 ELSE 0 END) as needsReviewCount,
    SUM(CASE WHEN ri.status = 'priority_review' THEN 1 ELSE 0 END) as priorityReviewCount,
    SUM(CASE WHEN ri.status = 'mastered' THEN 1 ELSE 0 END) as masteredCount
  FROM review_items ri
`;
```

**修正後**:

```typescript
const basicStatsQuery = `
  SELECT
    SUM(CASE WHEN ri.status != 'mastered' THEN 1 ELSE 0 END) as totalReviewItems,
    SUM(CASE WHEN ri.status = 'needs_review' THEN 1 ELSE 0 END) as needsReviewCount,
    SUM(CASE WHEN ri.status = 'priority_review' THEN 1 ELSE 0 END) as priorityReviewCount,
    SUM(CASE WHEN ri.status = 'mastered' THEN 1 ELSE 0 END) as masteredCount
  FROM review_items ri
  INNER JOIN questions q ON ri.question_id = q.id
`;
```

#### 修正B: 優先度分布クエリにINNER JOIN追加 (lines 343-358)

**修正前**:

```typescript
const priorityDistQuery = `
  SELECT
    CASE
      WHEN ri.priority_score >= 80 THEN 'critical'
      WHEN ri.priority_score >= 60 THEN 'high'
      WHEN ri.priority_score >= 40 THEN 'medium'
      ELSE 'low'
    END as priority_level,
    COUNT(*) as count
  FROM review_items ri
  WHERE ri.status != 'mastered'
  GROUP BY priority_level
`;
```

**修正後**:

```typescript
const priorityDistQuery = `
  SELECT
    CASE
      WHEN ri.priority_score >= 80 THEN 'critical'
      WHEN ri.priority_score >= 60 THEN 'high'
      WHEN ri.priority_score >= 40 THEN 'medium'
      ELSE 'low'
    END as priority_level,
    COUNT(*) as count
  FROM review_items ri
  INNER JOIN questions q ON ri.question_id = q.id
  WHERE ri.status != 'mastered'
  GROUP BY priority_level
`;
```

### 修正の効果

- **完全な整合性確保**: 統計表示とリスト取得が完全に一致
- **期待される動作**:
  - orphaned items 2件が存在 → 統計「復習対象: 0問」、リスト取得0件（一致）
  - orphaned itemsクリーンアップ後 → 統計「復習対象: 0問」、リスト取得0件（整合性維持）

### 検証状況

**完了した検証**:

- [x] コード変更の実施と保存確認
- [x] Expoサーバーの再起動（キャッシュクリア付き）
- [x] JavaScript bundleの再構築確認
- [x] アプリの再起動

**未完了の検証**（手動確認が必要）:

- [ ] 復習タブで統計が「復習対象: 0問」と表示されることを確認
- [ ] 「全て復習」ボタンクリック時のアラート表示（正常動作）を確認

### 検証困難の理由

以下の技術的制約により、自動検証が実施できませんでした：

1. **Mobile MCPツールの障害**: デバイス名解決エラーで利用不可
2. **testID未実装**: タブボタンにtestIDが設定されていない
3. **座標操作禁止**: CLAUDE.mdガイドラインにより座標ベース操作は厳格に禁止
4. **データベース直接アクセス困難**: シミュレーターのデータベースパスが特定できない

### 今後の必須タスク

#### 短期（最優先）

1. **手動検証の実施**:

   ```
   手順:
   1. Expoアプリを起動
   2. 画面下部の「復習・進捗」タブをタップ
   3. 統計表示を確認: 「復習対象: 0問」（以前は「復習対象: 2問」だった）
   4. 「全て復習」ボタンをタップ
   5. アラート「復習対象の問題がありません」が表示されることを確認（正常動作）
   ```

2. **タブボタンへのtestID実装**:
   ```typescript
   // app/(tabs)/_layout.tsx で実装
   <Tabs.Screen
     name="review"
     options={{
       testID: 'tab-review',  // 追加
       title: '復習・進捗',
       // ...
     }}
   />
   ```

#### 中期（品質改善）

1. **Mobile MCPツールの修復**: デバイス名解決問題の調査
2. **E2Eテストの追加**: Detoxで統計整合性テストを実装
3. **CI/CDパイプライン**: データ整合性チェックの自動化

### 技術的教訓

#### データ整合性の3つのレベル

1. **データベースレベル**: FOREIGN KEY制約、ON DELETE CASCADE
2. **アプリケーションレベル**: クリーンアップ処理、整合性チェック
3. **UIレベル**: 統計表示とリスト取得の一致

今回の問題は「UIレベル」での不整合であり、アプリケーションレベルのクリーンアップだけでは不十分でした。すべてのクエリに対して一貫した JOIN 戦略を適用する必要があります。

#### クエリ整合性のベストプラクティス

```typescript
// ❌ 悪い例: 一部のクエリのみINNER JOIN
async getReviewList() {
  // INNER JOIN使用 → orphaned items除外
}

async getReviewStatistics() {
  // LEFT JOINまたはJOINなし → orphaned items含む
}

// ✅ 良い例: すべてのクエリで同じJOIN戦略
async getReviewList() {
  // INNER JOIN使用 → orphaned items除外
}

async getReviewStatistics() {
  // INNER JOIN使用 → orphaned items除外
}
```

### まとめ（追加修正）

**実施内容**:

- `getReviewStatistics()` のすべてのクエリにINNER JOINを追加
- 統計表示とリスト取得の完全な整合性を確保

**期待される結果**:

- 復習タブの統計が「復習対象: 0問」と正しく表示される（以前は「復習対象: 2問」だった）
- 「全て復習」ボタンクリック時に適切なアラートが表示される

**残りのタスク**:

- 手動検証の実施（シミュレーターで確認）
- タブボタンへのtestID実装（将来の自動テスト用）
