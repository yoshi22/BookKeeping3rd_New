# 推奨コマンド集

## 開発サーバー
```bash
npm start              # Expo開発サーバー起動
npm run ios           # iOSシミュレーター起動
npm run android       # Androidエミュレーター起動
npm run web           # Web版起動（開発用）
```

## ビルド・実行
```bash
npx expo run:ios      # iOS Dev Buildの作成・実行
npx expo run:android  # Android Dev Buildの作成・実行
```

## 品質管理
```bash
npm test              # Jestテスト実行
npm run lint          # ESLint実行
npm run check:quick   # TypeScript型チェック + Lint + Test
npx tsc --noEmit      # TypeScript型チェックのみ
```

## Git操作
```bash
git status            # 変更状況確認
git add .             # 変更をステージング
git commit -m "..."   # コミット
git push              # リモートにプッシュ
```

## 有用なExpoコマンド
```bash
npx expo install      # Expo対応パッケージインストール
npx expo doctor       # 環境診断
npx expo prebuild     # ネイティブコード生成
```