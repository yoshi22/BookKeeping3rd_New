# 問題データ同期エラーの解決策

## 実装日時

2025-08-06

## 実装した解決策

### 1. 環境変数による強制更新機能

開発環境で問題データを強制的に更新できる機能を追加しました。

**使用方法:**

```bash
# .envファイルを作成
cp .env.example .env

# .envファイルを編集して強制更新を有効化
EXPO_PUBLIC_FORCE_UPDATE_QUESTIONS=true

# アプリを再起動（キャッシュクリア付き）
npx expo start -c
```

**動作:**

- 既存の問題データ、学習履歴、復習データを削除
- extracted-questions.tsから新しいデータを読み込み

### 2. 自動データバージョン管理

データが更新されたことを自動的に検知し、必要に応じて更新する機能を実装しました。

**仕組み:**

1. `SAMPLE_DATA_VERSION`定数でデータのバージョンを管理
2. app_settingsテーブルにバージョン情報を保存
3. アプリ起動時にバージョンを比較
4. バージョンが異なる場合は自動的にデータを更新

**メリット:**

- 手動での強制更新が不要
- データ更新の履歴が追跡可能
- ユーザーの学習データを必要最小限の削除に留める

## 修正されたファイル

1. **src/data/migrations/index.ts**
   - loadSampleData関数に強制更新とバージョンチェック機能を追加
   - データ投入後にバージョン情報を保存

2. **src/data/sample-questions.ts**
   - SAMPLE_DATA_VERSION定数を追加

3. **.env.example**
   - 環境変数の使用例を記載

## 今後の使い方

### 通常の開発時

何も設定する必要はありません。extracted-questions.tsが更新されると、アプリ起動時に自動的に新しいデータが読み込まれます。

### データ更新を強制したい場合

```bash
# 方法1: 環境変数を使用
EXPO_PUBLIC_FORCE_UPDATE_QUESTIONS=true npx expo start -c

# 方法2: .envファイルを使用
echo "EXPO_PUBLIC_FORCE_UPDATE_QUESTIONS=true" > .env
npx expo start -c
```

### キャッシュクリア

データが反映されない場合は、以下のコマンドでキャッシュをクリア:

```bash
# Expoのキャッシュクリア
npx expo start -c

# Metro バンドラーのキャッシュクリア
npx react-native start --reset-cache

# watchmanのキャッシュクリア (macOS)
watchman watch-del-all
```

## 確認方法

1. アプリを起動してコンソールログを確認
2. 以下のようなログが表示されれば成功:

   ```
   [Database] データバージョンが更新されています
   [Database] 現在: なし
   [Database] 新規: 2025-08-05T16:36:08.431Z
   [Database] データバージョンが更新されたため、既存データを更新します
   ```

3. 学習画面で最初の問題が「10桁精算表の作成」になっていることを確認

## 注意事項

- 強制更新を行うと、学習履歴と復習データも削除されます
- 本番環境では環境変数による強制更新は無効化されます
- データバージョンは自動的に管理されるため、通常は手動介入不要です
