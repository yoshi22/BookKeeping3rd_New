# Q2問題の表示順序修正 - INSERT文カラム欠落問題の根本解決

**日時**: 2025年10月5日
**作業者**: Claude Code
**カテゴリ**: データ修正・根本原因修正

## 問題の経緯

### ユーザー報告

「現在のアプリでは依然として順番が修正されていません」

### これまでの対応（すべて効果なし）

1. **2025-10-05 v1**: `question_order`の値を更新（V:1-30, L:31-50, B:51-70）
2. **2025-10-05 v2**: `useProblemsStrategyOrder`フラグを追加
3. **2025-10-05 v3-debug**: デバッグログ追加、キャッシュ問題の認識
4. **2025-10-05 final**: Expoキャッシュクリア、forceUpdate=true実行

### 根本原因の発見

**Approach 3（根本原因分析）を実施:**

1. シミュレーターで「全問題順次進行」を開始
2. [DEBUG-Q2-APP]ログを確認したところ、**question_orderがすべてnullになっていることを発見**:

   ```
   LOG  [DEBUG-Q2-APP] ソート後のQ2順序: Q2_V_001(null), Q2_B_001(null), Q2_L_001(null), ...
   ```

3. データベース挿入時のログでは正しい値が表示されていた:

   ```
   LOG  [DEBUG] Q2問題のquestion_order値: ["Q2_V_001:1", "Q2_B_001:51", "Q2_L_001:31", ...]
   ```

4. `migrations/index.ts`のINSERT文を確認したところ、**question_orderカラムが含まれていないことを発見**:
   ```sql
   INSERT INTO questions (
     id, category_id, question_text, answer_template_json,
     correct_answer_json, explanation, difficulty, tags_json,
     created_at, updated_at
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ```

## 根本原因の詳細分析

### なぜこの問題が発生したか

1. **migration 003**でquestion_orderカラムがテーブルに追加された
2. **migration 004**で既存データに対してquestion_order値を設定するUPDATE文が実行された
3. しかし、**migrations/index.tsのloadSampleData()関数**では、新規データを挿入する際にquestion_orderカラムを指定していなかった
4. そのため、新規挿入されたデータのquestion_orderはすべてNULLになっていた

### なぜ以前の修正が効果がなかったか

**過去3回の修正の共通点:**

- すべて`master-questions.ts`のquestion_order値を修正していた
- しかし、INSERT文でそのカラムを使っていなかったため、修正しても効果がなかった

**誤解を招いたログ出力:**

```
LOG  [DEBUG] Q2問題のquestion_order値: ["Q2_V_001:1", "Q2_B_001:51", "Q2_L_001:31", ...]
```

- このログは`master-questions.ts`のJavaScriptオブジェクトの値を表示していた
- データベースに実際に挿入された値ではなかった
- そのため、「データは正しいのになぜ動かないのか」という誤った推測をしてしまった

### なぜ気づくのが遅れたか

1. **[DEBUG-Q2-REPO]ログが出力されなかった**
   - リポジトリ層でデータベースから取得した値を確認するログ
   - このログが出力されていれば、question_orderがnullになっていることに早く気づけた

2. **[DEBUG-Q2-APP]ログで初めて気づいた**
   - アプリ側のソート後のログで`Q2_V_001(null)`という表示を見て、初めてquestion_orderがnullになっていることに気づいた

3. **データベーススキーマとINSERT文の整合性チェック不足**
   - migration 003でカラムが追加されたのに、INSERT文が更新されていなかった
   - この不整合に気づくべきだった

## 修正内容

### Step 1: INSERT文の修正

**ファイル**: `src/data/migrations/index.ts` (298-302行目)

**修正前:**

```typescript
await databaseService.executeSql(
  `INSERT INTO questions (
    id, category_id, question_text, answer_template_json,
    correct_answer_json, explanation, difficulty, tags_json,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    question.id,
    question.category_id,
    question.question_text,
    question.answer_template_json,
    question.correct_answer_json,
    question.explanation,
    question.difficulty,
    question.tags_json,
    question.created_at,
    question.updated_at,
  ],
);
```

**修正後:**

```typescript
await databaseService.executeSql(
  `INSERT INTO questions (
    id, category_id, question_text, answer_template_json,
    correct_answer_json, explanation, difficulty, tags_json,
    created_at, updated_at, question_order, section_number, subcategory, pattern_type
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    question.id,
    question.category_id,
    question.question_text,
    question.answer_template_json,
    question.correct_answer_json,
    question.explanation,
    question.difficulty,
    question.tags_json,
    question.created_at,
    question.updated_at,
    question.question_order, // ✅ 追加
    question.section_number, // ✅ 追加
    question.subcategory, // ✅ 追加
    question.pattern_type, // ✅ 追加
  ],
);
```

### Step 2: データバージョン更新

**ファイル**: `src/data/migrations/index.ts` (140行目)

```typescript
const SAMPLE_DATA_VERSION = "2025-10-05-q2-insert-fix";
```

### Step 3: 一時的なforceUpdate設定

**ファイル**: `src/data/migrations/index.ts` (143行目)

```typescript
const forceUpdate = true; // 🔍 一時的にtrue（INSERT文修正による再投入）
```

### Step 4: Expoキャッシュクリアとビルド

```bash
pkill -f "expo start"                # 既存プロセス停止
npx expo start --clear               # キャッシュ完全削除
npx expo run:ios --device "UUID"     # iOSビルド・起動
```

### Step 5: forceUpdateの復元

**ファイル**: `src/data/migrations/index.ts` (143行目)

```typescript
const forceUpdate = false; // ✅ 通常はfalse（ユーザーデータ保護）
```

## 技術的詳細

### INSERT文とmigrationの関係

**正常な開発フロー:**

1. migrationでカラムを追加（migration 003）
2. 既存データに値を設定（migration 004）
3. **新規データ挿入時にもカラムを指定** ← これが欠けていた

**今回の問題:**

- migration 004は既存データに対してのみUPDATE文を実行
- 新規データ挿入時（loadSampleData）では、INSERT文にカラムが含まれていなかった
- そのため、新規データのquestion_orderはNULLのまま挿入された

### ORDER BY句の挙動

```sql
SELECT * FROM questions
WHERE category_id = 'ledger'
ORDER BY section_number ASC, question_order ASC
```

- question_orderがNULLの場合、SQLiteではNULL値が最初にソートされる
- しかし、すべての行がNULLの場合、元の挿入順序（id順）でソートされる
- master-questions.tsの配列順序がV→B→L→V→L...となっていたため、その順序で表示されていた

### デバッグログの重要性

**効果的だったログ:**

```typescript
// app/(tabs)/learning/question/[id].tsx (150行目)
console.log(
  "[DEBUG-Q2-APP] ソート後のQ2順序:",
  q2Questions.map((q) => `${q.id}(${q.question_order})`).join(", "),
);
```

このログで`Q2_V_001(null)`という表示を見て、初めて問題の本質に気づいた。

**出力されなかったログ:**

```typescript
// src/data/repositories/question-repository.ts (98-106行目)
logger.debug(`[DEBUG-Q2-REPO] ledgerカテゴリ取得結果: ${first10.join(", ")}`);
```

このログが出力されていれば、もっと早く気づけた可能性がある。

## 修正により改善される動作

### 修正前の挙動

1. データベースのquestion_orderがすべてNULL
2. ORDER BY question_order ASCが機能しない
3. master-questions.tsの配列順序（V→B→L→V→L...）で表示される
4. ユーザーには「Q2_B_001（補助簿問題）」から開始される

### 修正後の挙動（期待値）

1. データベースのquestion_orderに正しい値が格納（V:1-30, L:31-50, B:51-70）
2. ORDER BY question_order ASCが正常に機能
3. Q2_V_001→Q2_V_002→...→Q2_V_030→Q2_L_001→...→Q2_B_020の順序で表示
4. ユーザーには「Q2_V_001（用語問題）」から開始される

## 影響範囲

### 修正により改善される機能

- **学習タブ - 全問題順次進行**: Q2問題が正しい順序（V→L→B）で表示
- **学習タブ - カテゴリ別学習**: Q2問題が正しい順序で表示
- **すべての問題**: question_order, section_number, subcategory, pattern_typeが正しく格納される

### 影響を受けない機能

- 復習タブ（優先度順）
- 模試（ランダム出題）
- 統計画面
- 既存の学習履歴・復習データ（forceUpdate=trueで一時的に削除されるが、通常運用では保護される）

## データバージョン履歴

- `2025-08-17-description` - 問題説明文更新
- `2025-10-04-q2-q3-category-fix` - Q2・Q3カテゴリ修正
- `2025-10-05-fix-trailing-commas` - 359個の余分なカンマ削除
- `2025-10-05-q2-question-order-fix` - Q2問題の並び順修正（v1、question_order値更新）
- `2025-10-05-q2-order-fix-v2` - キャッシュ問題による再修正（v2）
- `2025-10-05-q2-order-fix-v3-debug` - デバッグログ追加（v3）
- `2025-10-05-q2-order-final` - 最終対応完了（効果なし）
- **`2025-10-05-q2-insert-fix`** - **INSERT文カラム欠落問題の根本解決（本修正）**

## 重要な教訓

### データベーススキーマとINSERT文の整合性

1. **migrationでカラムを追加したら、必ずINSERT文も更新する**
2. **master-questions.tsのフィールドとINSERT文のカラムを一致させる**
3. **新規カラム追加時のチェックリスト:**
   - [ ] migrationファイルでALTER TABLE実行
   - [ ] 既存データに値を設定するUPDATE文実行
   - [ ] **loadSampleData()のINSERT文にカラムを追加** ← 今回欠けていた
   - [ ] TypeScript型定義の更新
   - [ ] テスト実行

### デバッグログの設計

1. **データベース挿入時のログ**: master-questions.tsのJavaScript値（誤解を招く可能性）
2. **データベース取得時のログ**: 実際にDBから取得した値（真実）
3. **アプリ側のログ**: 最終的に表示される値（ユーザー体験）

すべてのレイヤーでログを出力し、整合性を確認することが重要。

### 段階的デバッグアプローチの重要性

**Approach 3（根本原因分析）の有効性:**

1. データの流れを順番に追跡（master-questions.ts → INSERT → DB → SELECT → アプリ）
2. 各段階でのログ確認
3. ケースA/B/Cの分類による問題の絞り込み

このアプローチにより、「なぜ以前の修正が効かなかったか」を正確に理解できた。

### 絶対に避けるべきこと

- ❌ migrationでカラム追加後、INSERT文を更新しない
- ❌ ログ出力を見て「データは正しい」と早合点する
- ❌ データベース取得時のログなしで判断する
- ❌ 同じ修正（master-questions.ts値の更新）を繰り返す

## 完了確認

- [x] INSERT文にquestion_order等4カラムを追加
- [x] データバージョン更新（2025-10-05-q2-insert-fix）
- [x] Expoキャッシュクリア実行
- [x] iOSアプリビルド・起動
- [x] forceUpdate=false復元完了
- [x] 開発ログ作成完了

---

**作業完了日時**: 2025年10月5日
**ステータス**: ✅ 完了・検証待ち
**影響範囲**: 全370問のquestion_order, section_number, subcategory, pattern_type
**根本原因**: migrations/index.tsのINSERT文にquestion_orderカラムが欠落
**修正方法**: INSERT文に4カラム（question_order, section_number, subcategory, pattern_type）を追加

## 次のステップ（ユーザー確認用）

### アプリでの確認手順

1. **学習タブ**を開く
2. **「全問題を順次進行」**を選択
3. Q2問題の最初が **Q2_V_001（用語問題）** であることを確認
4. 問題を進めて、**Q2_V_030 → Q2_L_001 → ... → Q2_B_020** の順序を確認

### 期待される表示順序

- **1-30問目**: Q2_V_001-030（用語問題）
- **31-50問目**: Q2_L_001-020（勘定記入問題）
- **51-70問目**: Q2_B_001-020（補助簿記入問題）

**確認方法（技術的）:**

Expoサーバーのログで以下を確認：

```
LOG  [DEBUG-Q2-APP] ソート後のQ2順序: Q2_V_001(1), Q2_V_002(2), Q2_V_003(3), ...
```

`(null)`ではなく`(1), (2), (3), ...`となっていれば成功。
