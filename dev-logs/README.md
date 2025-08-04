# 開発ログ管理

このディレクトリは簿記3級問題集アプリの開発プロセスを記録・管理するためのものです。

## ディレクトリ構造

```
dev-logs/
├── README.md                    # このファイル
├── session-template.md          # セッションログテンプレート
├── sessions/                    # 開発セッションログ
│   ├── setup-YYYYMMDD.md       # 環境構築ログ
│   ├── database-YYYYMMDD.md    # データベース実装ログ
│   └── [feature]-YYYYMMDD.md   # 各機能実装ログ
├── progress/                    # 進捗管理
│   ├── progress-tracker.md     # 進捗トラッカー
│   └── weekly-reports/         # 週次レポート
├── decisions/                   # 技術的決定記録
│   ├── architecture-decisions.md
│   └── implementation-choices.md
└── testing/                     # テスト関連ログ
    ├── test-results/           # テスト実行結果
    └── performance-logs/       # パフォーマンス測定結果
```

## 使用方法

### 1. 開発セッション開始時

```bash
# 新しいセッションログを作成
cp dev-logs/session-template.md dev-logs/sessions/[feature]-$(date +%Y%m%d).md
```

### 2. セッション中

- 実装内容をリアルタイムで記録
- 技術的判断の理由を記載
- 問題・課題は都度記録

### 3. セッション終了時

1. セッションログを完成
2. `DEV-ROADMAP.md`の該当ステップを更新
3. `dev-logs/progress/progress-tracker.md`を更新

### 4. 週次レビュー時

- 週次進捗レポート作成
- ロードマップの調整検討
- 次週計画の策定

## ログ記録のルール

### 必須記録項目
- 実装した機能・コンポーネント
- 技術的決定とその理由
- 発生した問題と解決方法
- 工数（見積もりvs実績）
- テスト結果

### 記録タイミング
- 開発セッション毎に必須
- 重要な技術判断時
- 問題発生・解決時
- ステップ完了時

## Claude Codeとの連携

### 開発指示例
```
"Step 1.1の環境構築を実装してください。
完了後、dev-logs/sessions/setup-YYYYMMDD.mdに
セッションログを記録し、DEV-ROADMAP.mdの
該当ステップを更新してください。"
```

### ログ更新指示例
```
"今回のセッション内容をもとに：
1. セッションログを完成させる
2. DEV-ROADMAP.mdの進捗を更新
3. 次のステップの準備状況を記録
してください。"
```

## 品質管理

### レビューポイント
- ログの完全性（必須項目の記載）
- 技術判断の妥当性
- 工数見積もりの精度
- 問題解決の適切性

### 定期メンテナンス
- 週次: 進捗トラッカー更新
- 月次: ログの整理・アーカイブ
- フェーズ完了時: 総括レポート作成