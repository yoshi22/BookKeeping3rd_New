# データベースリセット機能のSQL文法エラー調査ログ

**日時**: 2025年11月1日

## 問題

設定画面からデータベースリセットを実行すると、以下のエラーが発生します：

```
データベースのリセット中にエラーが発生しました。
SQL execution failed: delete frome mock_exam_results
```

### エラーの特徴

- **SQL文法エラー**: "delete frome" という誤った構文（正しくは "delete from"）
- **対象テーブル**: `mock_exam_results`
- **発生タイミング**: データベースリセット処理の実行時
- **ユーザー影響**: データベースリセット機能が使用不可

## 調査内容

### 1. ソースコード検証（2025-11-01実施）

#### reset-database.tsの確認

`src/utils/reset-database.ts`（17-33行目）を確認：

```typescript
async function safeDeleteFrom(tableName: string): Promise<void> {
  try {
    await databaseService.executeSql(`DELETE FROM ${tableName}`);
    logger.debug(`[ResetDatabase] ${tableName} のデータを削除しました`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.toLowerCase().includes("no such table")) {
      logger.debug(
        `[ResetDatabase] ${tableName} テーブルは存在しません（スキップ）`,
      );
    } else {
      throw error;
    }
  }
}
```

**結果**: コードは正しく `DELETE FROM` を使用しており、"delete frome" という誤記は存在しない。

#### プロジェクト全体検索

Grepツールでsrcディレクトリ全体を検索：

```bash
pattern: "delete frome"
path: src/
```

**結果**: "delete frome" というパターンは**一切見つからず**。

### 2. ビルド状況確認

Xcodeビルド状況：

- **状態**: React-Fabricコンポーネントのコンパイル中
- **経過時間**: 5分以上
- **推定残り時間**: 5-10分

### 3. 呼び出しフロー確認

データベースリセット処理の実行フロー：

1. `confirmResetDatabase()` - ユーザー確認ダイアログ（123-145行目）
2. `resetDatabase()` - メインリセット処理（35-118行目）
3. `safeDeleteFrom()` - 安全な削除実行（17-33行目）
   - `mock_exams` テーブル削除（47行目）
   - `mock_exam_results` テーブル削除（45行目）
   - `mock_exam_questions` テーブル削除（46行目）

すべての呼び出しで正しく `DELETE FROM` 構文が使用されている。

## 原因の仮説

### 仮説1: 古いコードキャッシュ（最有力）

**根拠**:

- 現在のソースコードに誤記は存在しない
- Xcodeビルドが完了していない（React-Fabric コンパイル中）
- Metro bundlerの古いJavaScriptバンドルが実行されている可能性

**確認方法**:

1. 現在進行中のXcodeビルド完了を待つ
2. シミュレーターアプリを完全再起動
3. データベースリセットを再実行

### 仮説2: 過去のマイグレーションファイル

**根拠**:

- migration-manager.tsで複数のマイグレーションファイルを実行
- 過去のマイグレーションに誤記が含まれている可能性

**確認方法**:

1. `src/data/migrations/` ディレクトリ内の全ファイルを検索
2. 特に `mock_exam_results` テーブル関連のマイグレーションを確認

### 仮説3: エラーメッセージの転記ミス

**根拠**:

- エラーメッセージが別の場所から来ている可能性
- 実際のエラーは異なる内容かもしれない

**確認方法**:

1. シミュレーターのログ出力を直接確認
2. Xcodeコンソールでの正確なエラーメッセージを取得

## 実施済み修正（前回セッション）

以下の修正は既に完了済み：

1. **テーブル名修正**: `migration_history` → `migrations`
2. **テンプレートリテラル修正**: バッククォート構文の修正
3. **初期化キャッシュクリア**: `resetDatabaseInitialization()` 関数追加
4. **安全な削除処理**: `safeDeleteFrom()` 関数追加（非存在テーブル対応）

## 次のアクションプラン

### 優先度1: ビルド完了後の検証（推奨）

1. **Xcodeビルド完了を待機**（推定5-10分）
2. **アプリの完全再起動**
   ```bash
   # シミュレーターアプリを終了
   # 新しくビルドされたアプリを起動
   ```
3. **データベースリセット再実行**
4. **エラー発生有無を確認**

### 優先度2: 詳細ログ取得

ビルド完了後もエラーが継続する場合：

1. **Xcodeコンソールでログ確認**
   - [ResetDatabase] タグのログエントリを確認
   - 正確なSQL文とエラーメッセージを取得

2. **マイグレーションファイル全体検索**

   ```bash
   grep -r "delete.*mock_exam" src/data/migrations/
   ```

3. **データベースサービス層の確認**
   - `src/data/database.ts` でSQL実行前後のログ確認

### 優先度3: 緊急対応（エラー継続時）

1. **該当テーブル削除のスキップ**
   - mock_exam関連テーブルの削除を一時的に無効化
   - 他のテーブルのリセットは継続

2. **手動SQL実行**
   ```sql
   DROP TABLE IF EXISTS mock_exam_results;
   DROP TABLE IF EXISTS mock_exam_questions;
   DROP TABLE IF EXISTS mock_exams;
   ```

## 技術的考察

### SQL文法エラーの発生原因

SQLiteにおける `DELETE FROM` 構文：

```sql
-- 正しい構文
DELETE FROM table_name;

-- 誤った構文（今回のエラー）
DELETE FROME table_name;  -- "FROME" はSQLキーワードではない
```

### テンプレートリテラルの動作

JavaScript/TypeScriptのテンプレートリテラル：

```typescript
// 現在の実装（正しい）
`DELETE FROM ${tableName}`
// もし誤記があった場合の例
`DELETE FROME ${tableName}`; // しかしこれは見つからなかった
```

### React Native/Expoのコードキャッシュ

Metro bundlerのキャッシュ問題：

- JavaScriptバンドルは `node_modules/.cache/` にキャッシュ
- ネイティブコード変更時は完全リビルド必要
- `npx expo start --clear` でキャッシュクリア可能

## 関連ファイル

- **メイン処理**: `src/utils/reset-database.ts`
- **データベースサービス**: `src/data/database.ts`
- **マイグレーション管理**: `src/data/migrations/migration-manager.ts`
- **マイグレーション定義**: `src/data/migrations/003-add-question-structure.ts`
- **サンプルデータ**: `src/data/migrations/index.ts`

## 結論

### 現状認識

1. **ソースコード**: 誤記は存在せず、正しい構文を使用
2. **ビルド状況**: Xcodeビルドが未完了（React-Fabric コンパイル中）
3. **エラー報告**: ユーザーから継続的にエラー報告あり

### 最も可能性の高い原因

**古いJavaScriptバンドルの実行**

- 現在のシミュレーターアプリは修正前のコードを実行中
- Xcodeビルド完了後、新しいコードでテストが必要

### 推奨アクション

1. **即座**: Xcodeビルド完了まで待機（残り5-10分）
2. **完了後**: アプリ再起動とデータベースリセット再実行
3. **エラー継続時**: 詳細ログ取得と追加調査

---

## 🎉 修正完了（2025年11月1日 23:05更新）

### 実際のエラー内容（ビルド完了後に判明）

ビルド完了後、実際のエラーは当初の報告「delete frome」ではなく、以下の**2つの異なる問題**であることが判明：

#### エラー1: 存在しないテーブル

```
ERROR: SQL execution failed: DELETE FROM mock_exam_results
Error code 1: no such table: mock_exam_results
```

#### エラー2: 外部キー制約違反（より深刻）

```
ERROR: SQL execution failed: DELETE FROM categories
Error code 19: FOREIGN KEY constraint failed
```

### 根本原因

1. **外部キー制約の問題**: `categories` テーブルを削除しようとしたが、`questions` テーブルが `category_id` で参照しているため、外部キー制約違反が発生
2. **削除順序の問題**: 依存関係を考慮せずにテーブルを削除していた
3. **存在しないテーブル**: 一部のテーブル（mock_exam関連）が既に存在しない状態で削除を試みていた

### 実施した修正

**修正ファイル**: `src/utils/reset-database.ts`

#### 1. 外部キー制約の一時的無効化（58-59行目追加）

```typescript
// 1. 外部キー制約を一時的に無効化（削除時のFK制約エラーを回避）
logger.debug("[ResetDatabase] 外部キー制約を無効化");
await databaseService.executeSql("PRAGMA foreign_keys = OFF");
```

#### 2. 外部キー制約の再有効化（83-85行目追加）

```typescript
// 3. 外部キー制約を再有効化
logger.debug("[ResetDatabase] 外部キー制約を再有効化");
await databaseService.executeSql("PRAGMA foreign_keys = ON");
```

#### 3. エラーハンドリングの改善（18-51行目：既存改善）

`safeDeleteFrom()` 関数は既に適切に実装されており、以下の機能を持つ：

- "no such table" エラーを検出してスキップ
- エラーメッセージの詳細な解析（DatabaseError.cause も含む）
- 致命的でないエラーのログ出力

### 修正結果

#### ✅ テスト実行結果（2025-11-01 23:00）

**テスト環境**:

- シミュレーター: iPhone 16
- ビルド: Xcode完全リビルド完了
- アプリバージョン: 3Alpha (Build 13)

**実行手順**:

1. 設定画面に移動
2. 「データベースリセット」ボタンをタップ
3. 確認ダイアログで「リセット」を選択

**結果**:

- ✅ **成功メッセージ表示**: 「リセット完了」ダイアログが表示
- ✅ **データ再読み込み成功**: 問題データが正常に再読み込み
- ✅ **アプリ正常動作**: リセット後もアプリが正常に起動
- ✅ **エラーゼロ**: 外部キー制約エラーが完全に解消

**ログ出力（成功時）**:

```
LOG  [DEBUG] [ResetDatabase] データベースリセット開始
LOG  [DEBUG] [ResetDatabase] 外部キー制約を無効化
LOG  [DEBUG] [ResetDatabase] 既存データ削除中...
LOG  [DEBUG] [ResetDatabase] mock_exam_results テーブルは存在しません（スキップ）
LOG  [DEBUG] [ResetDatabase] 既存データ削除完了
LOG  [DEBUG] [ResetDatabase] 外部キー制約を再有効化
LOG  [DEBUG] [ResetDatabase] データベース再初期化中...
LOG  [DEBUG] loadSampleData() 実行開始（フラグ設定完了）
LOG  [DEBUG] 挿入トランザクション完了
LOG  [DEBUG] データ挿入完了
LOG  [DEBUG] カテゴリ名称更新完了
LOG  [DEBUG] loadSampleData() 実行完了（フラグ解除）
```

### 技術的なポイント

#### SQLite外部キー制約制御

SQLiteでは、外部キー制約は以下のPRAGMAコマンドで制御可能：

```sql
-- 無効化
PRAGMA foreign_keys = OFF;

-- 有効化
PRAGMA foreign_keys = ON;
```

**重要**: この設定は**接続ごと**に有効で、データベース自体には保存されない。そのため、リセット処理の開始時に無効化し、完了後に再有効化する必要がある。

#### 削除順序の最適化

外部キー制約を無効化することで、以下の順序で安全に削除可能：

1. 学習履歴・復習アイテム（依存なし）
2. 模試関連（依存関係あり）
3. ユーザー進捗（依存なし）
4. 問題データ（categoriesを参照）
5. カテゴリ（他から参照される）← 最後に削除

外部キー制約無効化により、この順序に関係なく削除可能になった。

### 影響範囲

**修正対象**: 1ファイルのみ

- `src/utils/reset-database.ts`

**影響を受ける機能**:

- ✅ 設定画面のデータベースリセット機能
- ✅ 開発時のデータベース初期化処理

**影響を受けない機能**:

- ✅ 通常のデータベース操作（外部キー制約は通常時は有効のまま）
- ✅ マイグレーション実行
- ✅ サンプルデータ読み込み

### まとめ

| 項目                         | 修正前              | 修正後              |
| ---------------------------- | ------------------- | ------------------- |
| **外部キー制約エラー**       | ❌ 発生             | ✅ 解消             |
| **存在しないテーブルエラー** | ❌ 致命的           | ✅ スキップ（正常） |
| **データベースリセット**     | ❌ 失敗             | ✅ 成功             |
| **ユーザー体験**             | ❌ エラーダイアログ | ✅ 成功メッセージ   |
| **コード行数**               | -                   | +4行（PRAGMA制御）  |
| **テスト結果**               | -                   | ✅ 100%成功         |

### 学んだこと

1. **SQLiteの外部キー制約**: デフォルトでは接続ごとに有効だが、PRAGMAで一時的に無効化可能
2. **エラーメッセージの解析**: 初期報告の「delete frome」は実際には異なるエラーだった
3. **ビルドキャッシュの影響**: React Native/Expoでは、修正が反映されるまでに完全リビルドが必要な場合がある
4. **段階的デバッグの重要性**: ソースコード検証 → ビルド完了待ち → 実際のエラー確認の順序が重要

---

**記録者**: Claude Code
**調査日時**: 2025年11月1日 13:00-14:00
**修正完了**: 2025年11月1日 23:05
**ステータス**: ✅ 修正完了・テスト成功
**修正ファイル**: `src/utils/reset-database.ts` (58-59行目、83-85行目追加)
