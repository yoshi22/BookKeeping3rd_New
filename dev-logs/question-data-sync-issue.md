# 問題データ同期エラーの分析レポート

## 発生日時

2025-08-06

## 問題の概要

problemsAndAnswers.mdの内容とアプリに表示される問題が一致していない

## 現在の状況

### 1. データフロー

```
problemsAndAnswers.md (ドキュメント)
    ↓ [parse-problems-md.ts で変換]
extracted-questions.ts (TypeScriptデータ)
    ↓ [sample-questions.ts 経由]
データベース (SQLite)
    ↓ [QuestionRepository 経由]
アプリ画面表示
```

### 2. 確認済みの事実

#### extracted-questions.ts の内容

- 最初の問題: Q_MD_001「10桁精算表の作成」（金額0円）
- 2番目: Q_MD_002「8桁精算表の作成」（金額0円）
- 3番目: Q_MD_003「キャッシュ・フロー計算書」（金額0円）
- 4番目: Q_MD_004「ソフトウェアの購入」（正常な仕訳）

#### problemsAndAnswers.md の内容

- 同じ順序で問題が記載されている
- 精算表問題も含まれている

## 考えられる原因

### 1. データベースの更新タイミング

- **最も可能性が高い**: アプリ起動時にデータベースが既に存在する場合、新しいデータが読み込まれない
- `loadSampleData()` 関数は既存データがある場合スキップする仕組み

```typescript
// src/data/migrations/index.ts
if (existingCount.rows[0]?.count > 0) {
  console.log(
    "既存の問題データが見つかりました。サンプルデータ読み込みをスキップします",
  );
  return;
}
```

### 2. キャッシュの問題

- Expo の開発サーバーキャッシュ
- TypeScript/JavaScript のモジュールキャッシュ
- SQLite のキャッシュ

### 3. ビルドプロセスの問題

- TypeScript のコンパイル結果が反映されていない
- Metro バンドラーのキャッシュ

## 推奨される解決策

### 即時対応

1. **データベースのリセット**

   ```bash
   # アプリのデータを完全にクリア
   npx expo start -c  # キャッシュクリア付きで起動
   ```

2. **手動でのデータベース削除**
   - iOSシミュレータ: Settings > General > Reset > Reset All Content and Settings
   - または、アプリをアンインストール後、再インストール

3. **強制的なデータ更新スクリプトの作成**
   ```javascript
   // scripts/force-update-questions.js
   // 既存データを削除して新しいデータを投入
   ```

### 長期的な改善

1. **データベースのバージョン管理**
   - questions テーブルにバージョンカラムを追加
   - データ更新時にバージョンチェック

2. **開発環境での自動リロード**
   - extracted-questions.ts の変更を検知して自動でデータベース更新

3. **データ同期の可視化**
   - 開発環境でデータソースを表示するデバッグ画面の追加

## 検証手順

### 1. 現在のデータベース内容の確認

```sql
SELECT id, question_text, correct_answer_json
FROM questions
ORDER BY id
LIMIT 5;
```

### 2. アプリの表示内容との比較

- 学習画面で最初に表示される問題のIDと内容を記録
- extracted-questions.ts の内容と照合

### 3. データ更新プロセスの追跡

- console.log を追加してデータの流れを可視化
- 各段階でのデータ変換を確認

## 次のアクション

1. アプリのデータを完全にクリアして再起動
2. それでも問題が解決しない場合は、強制更新スクリプトを作成
3. 長期的な改善策の実装を検討

## 関連ファイル

- `/src/data/extracted-questions.ts` - 問題データの定義
- `/src/data/migrations/index.ts` - データベース初期化
- `/src/data/repositories/question-repository.ts` - 問題データアクセス
- `/app/(tabs)/learning.tsx` - 学習画面
