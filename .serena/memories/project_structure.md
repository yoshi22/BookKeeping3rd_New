# プロジェクト構造

## ディレクトリ構成
```
BookKeeping3rd/
├── app/                    # Expo Router ベースの画面構成
│   ├── (tabs)/            # タブナビゲーション画面
│   │   ├── index.tsx      # ホーム画面
│   │   ├── learning.tsx   # 学習画面
│   │   ├── review.tsx     # 復習画面
│   │   └── stats.tsx      # 統計画面
│   ├── question/          # 問題詳細画面
│   └── _layout.tsx        # ルートレイアウト
├── src/                   # メインソースコード
│   ├── components/        # UIコンポーネント
│   ├── data/             # データ層（SQLite・リポジトリ）
│   ├── services/         # ビジネスロジック
│   ├── hooks/            # カスタムフック
│   ├── types/            # TypeScript型定義
│   ├── theme/            # テーマ・スタイル定義
│   ├── context/          # React Context
│   └── utils/            # ユーティリティ関数
└── docs/                 # 設計ドキュメント
```

## アーキテクチャパターン
- **データ層**: Repository Pattern実装
- **サービス層**: ビジネスロジック分離
- **プレゼンテーション層**: Component Architecture
- **状態管理**: React Context + Custom Hooks