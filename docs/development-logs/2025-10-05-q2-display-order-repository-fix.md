# Q2問題の表示順序修正 - Repositoryソートフラグ対応

**日時**: 2025年10月5日
**作業者**: Claude Code
**カテゴリ**: バグ修正・コード改善

## 問題の概要

### ユーザー報告

「依然としてアプリ上の表示順が修正されていません」

前回の修正（question_orderデータ更新、359個の余分なカンマ削除）後も、Q2問題が依然として間違った順序で表示される問題が継続していた。

#### 期待される動作

- Q2問題の表示順: **V（用語）→ L（勘定記入）→ B（補助簿）**
- 問題ID順: Q2_V_001-030 → Q2_L_001-020 → Q2_B_001-020

#### 実際の動作

- アプリ上の表示順: **B（補助簿）→ L（勘定記入）→ V（用語）**（アルファベット順）

## 根本原因分析

### 調査結果

1. **データベースには正しい値が格納されている** ✅
   - ログ確認: `["Q2_V_001:1", "Q2_B_001:51", "Q2_L_001:31"]`
   - question_order値: V=1-30, L=31-50, B=51-70

2. **QuestionRepositoryのソートロジックに2つのパターンが存在**

   ```typescript
   // question-repository.ts (lines 76-84)
   if (options.useProblemsStrategyOrder) {
     sql += " ORDER BY section_number ASC, question_order ASC"; // ✅ 正しい
   } else {
     sql += " ORDER BY id ASC"; // ❌ アルファベット順 (B→L→V)
   }
   ```

3. **`useProblemsStrategyOrder`フラグが一部のコードパスで欠けていた**

### 問題箇所の特定

#### ✅ 正しく実装されているコードパス

**app/(tabs)/learning/category/[categoryId].tsx (lines 247-249)**

```typescript
const categoryQuestions = await questionRepository.findByCategory(
  categoryId as QuestionCategory,
  { useProblemsStrategyOrder: true }, // ✅ フラグあり
);
```

**app/(tabs)/learning/question/[id].tsx (lines 116-118)**

```typescript
questions = await questionRepository.findByCategory(
  categoryId as any,
  { useProblemsStrategyOrder: true }, // ✅ フラグあり
);
```

#### ❌ 問題のあるコードパス（修正前）

**app/(tabs)/learning/question/[id].tsx (lines 125-138)**

```typescript
// 修正前（❌ フラグなし）
const allQuestions = await Promise.all([
  questionRepository.findByCategory("journal"), // フラグなし
  questionRepository.findByCategory("ledger"), // フラグなし
  questionRepository.findByCategory("trial_balance"), // フラグなし
]);
questions = allQuestions.flat().sort((a, b) => a.id.localeCompare(b.id)); // ID順ソート
```

**問題点:**

1. `useProblemsStrategyOrder`フラグを渡していない
2. 最後に`id.localeCompare()`でID順に再ソート（アルファベット順）

## 修正内容

### 修正1: findByCategoryへのフラグ追加

**ファイル**: `app/(tabs)/learning/question/[id].tsx`
**行**: 125-133

```typescript
// 修正後（✅ フラグ追加）
const allQuestions = await Promise.all([
  questionRepository.findByCategory("journal", {
    useProblemsStrategyOrder: true,
  }), // 仕訳問題（250問）
  questionRepository.findByCategory("ledger", {
    useProblemsStrategyOrder: true,
  }), // 帳簿問題（40問）
  questionRepository.findByCategory("trial_balance", {
    useProblemsStrategyOrder: true,
  }), // 試算表問題（12問）
]);
```

### 修正2: ソート基準の変更（ID → question_order）

**ファイル**: `app/(tabs)/learning/question/[id].tsx`
**行**: 136-144

```typescript
// 修正前
questions = allQuestions.flat().sort((a, b) => a.id.localeCompare(b.id));

// 修正後（✅ question_orderベースのソート）
questions = allQuestions.flat().sort((a, b) => {
  // section_number → question_order の順でソート
  if (a.section_number !== b.section_number) {
    return a.section_number - b.section_number;
  }
  return a.question_order - b.question_order;
});
```

**ソート優先度:**

1. `section_number` 昇順（Q1→Q2→Q3）
2. `question_order` 昇順（各セクション内で1→2→3...）

## 修正の影響範囲

### 影響を受けるユーザーフロー

1. **全問題順次進行モード** ✅ 修正
   - 学習タブ → 「全問題を順次進行」
   - Q2問題が正しい順序（V→L→B）で表示

2. **カテゴリ別学習モード** ✅ 修正済み（元々正しい）
   - 学習タブ → カテゴリ選択 → 問題一覧
   - 既に`useProblemsStrategyOrder: true`実装済み

### 影響を受けないフロー

- 復習タブ（優先度順）
- 模試（ランダム出題）
- 統計画面

## テスト結果

### 自動検証

```bash
# TypeScriptコンパイル確認
npx tsc --noEmit  # エラーなし ✅

# ESLint確認
npm run lint  # エラーなし ✅

# 完全品質チェック
npm run check:quick  # PASS ✅
```

### 実機検証（iOSシミュレーター）

**デバイス**: iPhone 16 Pro (iOS 18.5)
**ビルド**: 成功（0エラー、3警告）
**実行結果**:

```
LOG  [DEBUG] Q2問題のquestion_order値: ["Q2_V_001:1", "Q2_B_001:51", "Q2_L_001:31", "Q2_V_002:2", "Q2_L_002:32"]
LOG  [DEBUG] 既存データあり: count= 370 forceUpdate= false needsUpdate= false
LOG  [QuestionDisplay] レンダリング判定: Q2_V_001 {"answerTemplateType": "vocabulary", "shouldUseVocabularyForm": true}
```

**確認事項:**

- ✅ Q2問題の最初が`Q2_V_001`（用語問題）
- ✅ question_order値が正しい（V:1-30, L:31-50, B:51-70）
- ✅ forceUpdate=falseでユーザーデータ保護

## 技術的詳細

### QuestionRepositoryのソートロジック

**ファイル**: `src/data/repositories/question-repository.ts`
**行**: 48-103

```typescript
public async findByCategory(
  category: QuestionCategory,
  options: {
    difficulty?: QuestionDifficulty;
    limit?: number;
    randomize?: boolean;
    excludeIds?: string[];
    useProblemsStrategyOrder?: boolean;  // ← オプショナルフラグ
  } = {},
): Promise<Question[]> {
  let sql = "SELECT * FROM questions WHERE category_id = ?";

  // ... フィルタリングロジック ...

  // ソート順序の決定
  if (options.randomize) {
    sql += " ORDER BY RANDOM()";
  } else if (options.useProblemsStrategyOrder) {
    sql += " ORDER BY section_number ASC, question_order ASC";  // ✅ 正しい順序
  } else {
    sql += " ORDER BY id ASC";  // ❌ アルファベット順（デフォルト）
  }

  // ... 実行ロジック ...
}
```

**フラグの意味:**

- `true`: `section_number` → `question_order` でソート（数値順）
- `false` or `undefined`: `id` でソート（アルファベット順）

### なぜID順ソートだと間違った順序になるのか

**Q2問題のID一覧:**

```
Q2_B_001, Q2_B_002, ..., Q2_B_020  (補助簿: B = Auxiliary_Book)
Q2_L_001, Q2_L_002, ..., Q2_L_020  (勘定記入: L = Ledger)
Q2_V_001, Q2_V_002, ..., Q2_V_030  (用語: V = Vocabulary)
```

**アルファベット順（`id ASC`）:**

- B < L < V の順で並ぶ
- 結果: B→L→V（間違った順序）

**question_order順（`question_order ASC`）:**

- V: 1-30, L: 31-50, B: 51-70
- 結果: V→L→B（正しい順序）

## 再発防止策

### コード規約の追加

1. **QuestionRepository使用時のガイドライン**
   - Q2（帳簿）カテゴリの取得には必ず`useProblemsStrategyOrder: true`を指定
   - 全問題順次進行モードでは必ずフラグを渡す
   - カテゴリ別学習モードでは必ずフラグを渡す

2. **コードレビューチェックリスト**
   - [ ] `findByCategory`呼び出し時に適切なソートフラグを指定しているか
   - [ ] Q2問題が関与する場合、`useProblemsStrategyOrder: true`が指定されているか
   - [ ] ソート処理が重複していないか（Repository + Application層の二重ソート）

### テスト追加候補

```typescript
// 統合テスト例（提案）
describe("QuestionRepository - Q2問題の順序", () => {
  it("useProblemsStrategyOrder=trueの場合、V→L→B順で返す", async () => {
    const questions = await questionRepository.findByCategory("ledger", {
      useProblemsStrategyOrder: true,
    });

    expect(questions[0].id).toBe("Q2_V_001");
    expect(questions[30].id).toBe("Q2_L_001");
    expect(questions[50].id).toBe("Q2_B_001");
  });

  it("useProblemsStrategyOrder=falseの場合、B→L→V順で返す", async () => {
    const questions = await questionRepository.findByCategory("ledger", {
      useProblemsStrategyOrder: false,
    });

    expect(questions[0].id).toBe("Q2_B_001");
  });
});
```

## 関連ドキュメント

- `docs/development-logs/2025-10-05-q2-syntax-error-fix.md` - 359個の余分なカンマ削除
- `docs/development-logs/2025-10-05-q2-question-order-fix.md` - question_order値の更新
- `docs/engineering/problemsStrategy.md` - 問題順序の設計思想

## まとめ

### 修正前

- データベース: 正しいquestion_order値 ✅
- コード: `useProblemsStrategyOrder`フラグ未指定 ❌
- 表示順序: B→L→V（アルファベット順）❌

### 修正後

- データベース: 正しいquestion_order値 ✅
- コード: `useProblemsStrategyOrder: true`を全箇所で指定 ✅
- 表示順序: V→L→B（question_order順）✅

### 技術的教訓

1. **データの正しさとロジックの正しさは別**
   - データベースに正しい値があっても、取得時のソート指定が間違っていれば正しい結果は得られない

2. **オプショナルフラグの危険性**
   - デフォルト動作が期待と異なる場合、フラグの指定忘れが致命的なバグになる
   - 重要な動作は明示的にフラグを要求する設計が望ましい

3. **段階的なソート処理の問題**
   - Repository層でソート → Application層で再ソートは、意図しない結果を生む
   - ソート責任の一元化が重要

---

**修正完了日時**: 2025年10月5日
**ステータス**: ✅ 完了・検証済み
**影響範囲**: 全問題順次進行モード（学習タブ）
**ユーザー影響**: なし（修正のみ）
