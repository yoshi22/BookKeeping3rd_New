# 解説パネル折りたたみ機能復旧と復習対象自動追加 - 2025年8月23日

## 問題の概要

正答表示修正後に、解説パネルの折りたたみ機能が失われてしまい、常に展開された状態になっていた。また、ユーザーが解説を覗き見した場合に復習対象として自動追加する機能が不足していた。

## 要求仕様

1. **折りたたみ機能復旧**: 解説パネルのデフォルト状態を折りたたみに変更
2. **復習対象自動追加**: 解説を展開した問題を自動的に復習対象に追加
3. **学習効果向上**: 自信がない問題、間違えた問題、解説を覗き見した問題の復習促進

## 実装内容

### 1. UnifiedExplanation.tsx の拡張

**ファイル**: `src/components/unified/UnifiedExplanation.tsx`

#### 新規プロパティ追加

```typescript
export interface UnifiedExplanationProps {
  // 既存プロパティ...

  // 新規追加
  onExpand?: (expanded: boolean) => void;
  questionId?: string;
}
```

#### 展開状態管理の実装

```typescript
const [isExpanded, setIsExpanded] = useState(defaultExpanded);
const [hasBeenExpanded, setHasBeenExpanded] = useState(defaultExpanded);

// 展開処理で初回展開時のコールバック実行
if (
  newExpanded &&
  !hasBeenExpanded &&
  onExpand &&
  sessionMode !== "mock_exam"
) {
  setHasBeenExpanded(true);
  onExpand(true);
}
```

#### デフォルト展開設定の変更

- `defaultExpanded = false` に変更（折りたたみ状態がデフォルト）
- `expandable = true` に設定（折りたたみ機能を有効化）

### 2. QuestionDisplay.tsx の修正

**ファイル**: `src/components/QuestionDisplay.tsx`

#### 復習サービス統合

```typescript
import { reviewService } from "../services/review-service";

const handleExplanationExpand = useCallback(
  async (expanded: boolean) => {
    if (expanded && sessionType !== "mock_exam" && questionId) {
      try {
        await reviewService.forceAddToReview(questionId, "解説を見た");
      } catch (error) {
        logger.warn(`[QuestionDisplay] 復習対象追加エラー: ${error}`);
      }
    }
  },
  [questionId, sessionType],
);
```

#### UnifiedExplanation プロパティ設定

```typescript
<UnifiedExplanation
  // 既存プロパティ...
  expandable={true}
  defaultExpanded={false}
  onExpand={handleExplanationExpand}
  questionId={questionId}
/>
```

### 3. 学習モード別の動作制御

#### 対象セッション

- **学習モード**: 解説展開時に復習対象追加
- **復習モード**: 解説展開時に復習対象追加
- **模試モード**: 復習対象追加を無効化（試験環境維持）

#### ユーザー体験の最適化

- **初回展開のみ**: 復習対象追加は最初の展開時のみ実行
- **重複回避**: 同じ問題の複数回展開でも重複追加しない
- **エラー処理**: 復習対象追加失敗時もUI動作に影響しない

## 修正後の動作フロー

### 1. 学習画面での操作

```
1. 問題表示時: 解説パネルは折りたたまれた状態「解説 ▼」
2. 解説タップ: パネルが展開し詳細な解説を表示
3. 自動処理: 初回展開時に自動的に復習対象へ追加
4. 再タップ: パネルが折りたたまれる（復習対象への再追加なし）
```

### 2. 復習タブでの確認

```
1. 復習タブアクセス: 解説を見た問題が「復習対象」に表示
2. 優先度管理: 既存の復習アルゴリズムで優先度設定
3. 学習促進: 効果的な反復学習をサポート
```

## テスト結果

### ✅ 機能動作確認

#### 折りたたみ機能

- **初期状態**: 解説パネルが正常に折りたたまれて表示
- **展開操作**: タップで詳細解説が正常に表示される
- **折りたたみ操作**: 再タップで正常に折りたたまれる
- **UIアニメーション**: スムーズな展開・折りたたみアニメーション

#### 復習対象自動追加

- **学習モード**: 解説展開時に自動追加される
- **復習タブ確認**: 「復習対象 3」として正常にカウント表示
- **重複回避**: 同一問題の再展開で重複追加されない
- **模試モード除外**: 模試では復習対象追加が実行されない

#### セッション別動作

- **学習セッション**: 復習対象追加機能が動作
- **復習セッション**: 復習対象追加機能が動作
- **模試セッション**: 復習対象追加機能が無効化

## 技術的詳細

### 状態管理パターン

```typescript
// 展開状態の二重管理
const [isExpanded, setIsExpanded] = useState(false); // 現在の状態
const [hasBeenExpanded, setHasBeenExpanded] = useState(false); // 初回展開フラグ
```

### コールバック最適化

```typescript
// useCallback による依存関係最適化
const handleExplanationExpand = useCallback(
  async (expanded: boolean) => {
    /* 処理 */
  },
  [questionId, sessionType], // 依存配列で再レンダリング制御
);
```

### エラー処理戦略

```typescript
// 非同期処理のエラーハンドリング
try {
  await reviewService.forceAddToReview(questionId, "解説を見た");
} catch (error) {
  logger.warn(`復習対象追加エラー: ${error}`); // ログ出力のみでUI継続
}
```

## 影響範囲

### 対象ファイル

- `src/components/unified/UnifiedExplanation.tsx` - 折りたたみ機能実装
- `src/components/QuestionDisplay.tsx` - 復習対象追加処理

### 機能範囲

- **学習画面**: 全問題タイプ（仕訳・帳簿・試算表）
- **復習画面**: 復習対象問題での解説表示
- **復習システム**: 自動追加による学習効率向上

## 学習効果への貢献

### 1. 学習行動の可視化

- 解説を覗き見した問題の自動記録
- 学習者の「不安な問題」の客観的把握
- 復習優先度の適切な設定

### 2. 反復学習の促進

- 解説確認問題の効率的な復習
- 間違えた問題との統合管理
- 記憶定着率の向上

### 3. 学習体験の向上

- 手動での復習追加作業の削減
- 直感的なUI操作（タップで展開/折りたたみ）
- 学習モード別の適切な動作制御

## 将来の拡張可能性

### 1. 詳細分析機能

- 解説閲覧パターンの分析
- 弱点分野の自動特定
- パーソナライズド学習推奨

### 2. 学習効率指標

- 解説依存度の測定
- 理解度向上の可視化
- 学習進捗の詳細追跡

### 3. UI/UX改善

- 展開アニメーションの高度化
- 解説内容のプレビュー機能
- スマートな折りたたみ制御

## 注意事項

- **模試モード**: 復習対象追加を意図的に無効化（試験環境の純粋性維持）
- **パフォーマンス**: 復習対象追加処理は非同期で実行（UI反応性確保）
- **データ整合性**: 既存の復習アルゴリズムとの完全互換性
- **エラー耐性**: 復習対象追加失敗時もメイン機能に影響なし

## まとめ

解説パネルの折りたたみ機能復旧により、すっきりとしたUI表示を実現。同時に、解説を確認した問題の自動復習対象追加により、学習者の「不安な問題」を効果的に復習サイクルに組み込む仕組みを構築。これにより、より効率的で効果的な学習体験を提供できるようになった。
