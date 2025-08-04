# コードスタイル・規約

## TypeScript規約
- **厳密な型チェック**: strict: true
- **型定義**: src/types/ ディレクトリに集約
- **インターフェース**: PascalCase命名
- **型エクスポート**: 明示的な型エクスポート推奨

## ファイル・ディレクトリ命名
- **コンポーネント**: PascalCase (例: QuestionDisplay.tsx)
- **フック**: camelCase with use prefix (例: useQuestionNavigation.ts)
- **サービス**: kebab-case (例: answer-service.ts)
- **型定義**: kebab-case (例: database.ts, models.ts)

## コンポーネント設計
- **関数コンポーネント**: React FCを使用
- **Props型定義**: 明示的なProps interfaceを定義
- **エクスポート**: named exportとdefault export併用
- **スタイル**: StyleSheet.create()を使用

## アーキテクチャパターン
- **Repository Pattern**: データアクセス層の抽象化
- **Service Layer**: ビジネスロジックの分離
- **Custom Hooks**: ロジックの再利用可能化
- **Context Pattern**: グローバル状態管理

## ESLint設定
- TypeScript対応ルール
- React Native最適化
- 未使用変数・インポートの警告
- コンソール出力制限（本番）