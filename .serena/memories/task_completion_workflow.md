# タスク完了時のワークフロー

## コードタスク完了時の手順

### 1. 品質チェック
```bash
npm run check:quick   # TypeScript + ESLint + Jest
```

### 2. 個別チェック（必要に応じて）
```bash
npx tsc --noEmit      # TypeScript型チェック
npm run lint          # ESLint
npm test              # Jestテスト
```

### 3. コミット前確認
- 変更内容のレビュー
- テストが通ることを確認
- ESLintエラーがないことを確認

### 4. Git操作
```bash
git add .
git commit -m "feature: 具体的な変更内容"
git push
```

## 重要な考慮事項
- TypeScriptの厳密な型チェックを重視
- ESLintルールに従ったコーディング
- Jestテストの維持・更新
- コミットメッセージは明確で具体的に

## アプリテスト
- iOS/Androidシミュレーターでの動作確認
- 主要機能の手動テスト
- パフォーマンス確認