# 2025-08-20 難易度表示ロジック修正による250問表示問題解決

## 概要

BookKeeping3rdアプリにおいて、シミュレーター上で仕訳問題が204問しか表示されず、期待される250問に満たない問題を発見・修正。根本原因は難易度レベル4-5の問題（46問）がUI表示ロジックで除外されていたことが判明。

## 問題の詳細

### 症状

- **期待値**: 仕訳問題250問がアプリに表示される
- **実際**: 204問のみ表示（基礎39問、標準45問、応用120問）
- **不足**: 46問（難易度4-5の問題）が表示されていない

### 根本原因

難易度レベルのマッピング不整合:

#### 修正前（誤った設定）

```typescript
// src/hooks/useScreenReaderOptimization.tsx
const difficultyNames: Record<number, string> = {
  1: "基礎",
  2: "標準", // ❌ 基礎に含めるべき
  3: "応用", // ❌ 標準にするべき
  4: "上級", // ❌ UIに表示されない
  5: "最上級", // ❌ UIに表示されない
};

// app/(tabs)/learning/category/[categoryId].tsx
const difficultyOptions = [
  { level: 1, name: "基礎" }, // レベル1のみ
  { level: 2, name: "標準" }, // レベル2のみ
  { level: 3, name: "応用" }, // レベル3のみ
  // レベル4-5は表示オプションなし
];
```

#### 修正後（正しい設定）

```typescript
// src/hooks/useScreenReaderOptimization.tsx
const difficultyNames: Record<number, string> = {
  1: "基礎",
  2: "基礎", // ✅ 基礎レベル
  3: "標準", // ✅ 標準レベル
  4: "応用", // ✅ 応用レベル
  5: "応用", // ✅ 応用レベル
};

// app/(tabs)/learning/category/[categoryId].tsx
const difficultyOptions = [
  { levels: [1, 2], name: "基礎" }, // ✅ レベル1-2
  { levels: [3], name: "標準" }, // ✅ レベル3
  { levels: [4, 5], name: "応用" }, // ✅ レベル4-5
];
```

## 修正内容

### 1. useScreenReaderOptimization.tsx の修正

**ファイル**: `src/hooks/useScreenReaderOptimization.tsx`
**行数**: 160-166

**変更内容**:

- 難易度2を「標準」から「基礎」に変更
- 難易度3を「応用」から「標準」に変更
- 難易度4を「上級」から「応用」に変更
- 難易度5を「最上級」から「応用」に変更

```typescript
const difficultyNames: Record<number, string> = {
  1: "基礎",
  2: "基礎", // 修正: 標準 → 基礎
  3: "標準", // 修正: 応用 → 標準
  4: "応用", // 修正: 上級 → 応用
  5: "応用", // 修正: 最上級 → 応用
};
```

### 2. learning/category/[categoryId].tsx の修正

**ファイル**: `app/(tabs)/learning/category/[categoryId].tsx`

**主な変更点**:

1. **難易度オプション構造の変更**:

   ```typescript
   // 修正前: 単一レベル
   { level: 1, name: "基礎" }

   // 修正後: レベル配列
   { levels: [1, 2], name: "基礎" }
   ```

2. **フィルター処理の更新**:

   ```typescript
   // 修正前
   const toggleDifficultyFilter = (level: QuestionDifficulty) => {
     // 単一レベル処理
   };

   // 修正後
   const toggleDifficultyFilter = (levelGroup: QuestionDifficulty[]) => {
     // レベルグループ処理
   };
   ```

3. **UI表示の更新**:
   - 説明テキストを「基本的な問題・基礎レベル (難易度1-2)」形式に変更
   - アイコンと色の調整

### 3. データベースバージョンの更新

**ファイル**: `src/data/migrations/index.ts`
**行数**: 96

```typescript
const SAMPLE_DATA_VERSION = "2025-08-20-display-logic-fix";
```

表示ロジック修正を反映するためバージョンを更新。

## 検証結果

### 修正前の状態

- 基礎: 39問（難易度1のみ）
- 標準: 45問（難易度2のみ）
- 応用: 120問（難易度3のみ）
- **合計: 204問**（46問不足）

### 修正後の状態

- 基礎: 84問（難易度1-2：39+45問）
- 標準: 120問（難易度3）
- 応用: 46問（難易度4-5）
- **合計: 250問**（完全）

### 分布比率

- 基礎: 84/250 = 33.6%（目標30%に近い）
- 標準: 120/250 = 48.0%（目標50%達成）
- 応用: 46/250 = 18.4%（目標20%に近い）

## 技術的な学び

### 問題発見の手法

1. **verify-difficulty-classification.js**スクリプトによる分析
2. データファイルと表示ロジックの詳細比較
3. 複数のマッピングパターンの検証

### 解決アプローチ

1. UI階層構造の理解（useScreenReaderOptimization ← categoryId画面）
2. データ構造とUI表示の分離（レベル→グループのマッピング）
3. 段階的修正（ファイル間の依存関係を考慮）

### TypeScript型安全性

修正中に型エラーが発生したが、以下で解決:

```typescript
// 修正前: level プロパティ
option.level;

// 修正後: levels 配列プロパティ
option.levels;
```

## 影響範囲

### 直接的な影響

- **学習画面**: 46問の追加問題が表示される
- **復習システム**: 新しく学習可能になった問題の復習データ作成
- **統計計算**: より正確な難易度別進捗の算出

### 間接的な影響

- **ユーザー体験**: より充実した問題セットでの学習
- **学習効果**: 段階的難易度上昇による効果的な習得
- **データ整合性**: 設計された問題配分との一致

## リスク管理

### 対策済みリスク

1. **ユーザーデータ保護**: `forceUpdate = false`でデータ削除を防止
2. **段階的展開**: UIロジック修正後のテスト確認
3. **型安全性**: TypeScriptコンパイラーによる検証

### 残存リスク（軽微）

1. **復習優先度算出**: 新規追加問題の初期優先度設定
2. **統計キャッシュ**: 既存キャッシュの無効化が必要な可能性

## 実行手順

1. **バックアップ作成**: 修正前状態の保存
2. **ロジック修正**: useScreenReaderOptimization.tsx
3. **UI更新**: category/[categoryId].tsx
4. **バージョン更新**: migrations/index.ts
5. **動作確認**: シミュレーターで250問表示確認
6. **コミット・プッシュ**: 変更の永続化

## 関連ファイル

### 修正ファイル

- `src/hooks/useScreenReaderOptimization.tsx`
- `app/(tabs)/learning/category/[categoryId].tsx`
- `src/data/migrations/index.ts`

### 検証スクリプト

- `scripts/fixes/verify-difficulty-classification.js`

### 関連ドキュメント

- [2025-08-20 JSON形式エラー分析](./2025-08-20-json-format-issue-analysis.md)
- [problemsStrategy.md](../product/problemsStrategy.md)

## 今後の改善案

### 短期的改善

1. **テストケース追加**: 難易度分類ロジックの自動テスト
2. **設定値外部化**: ハードコードされたマッピングの設定ファイル化
3. **ログ強化**: 表示ロジック処理の詳細ログ

### 長期的改善

1. **設計パターン統一**: データモデルとUI表示の分離強化
2. **検証自動化**: CI/CDでの問題数整合性チェック
3. **ドキュメント整備**: アーキテクチャ決定記録（ADR）の作成

## 作業者・日時

- **実行者**: Claude Code
- **作業日**: 2025-08-20
- **作業時間**: 約2時間
- **状態**: 完了、検証済み

## 成果

✅ **250問完全表示達成**  
✅ **適切な難易度分布実現**  
✅ **ユーザーデータ保護**  
✅ **型安全性維持**  
✅ **動作確認完了**

この修正により、BookKeeping3rdアプリの問題表示機能が設計仕様通りに動作することを確認しました。
