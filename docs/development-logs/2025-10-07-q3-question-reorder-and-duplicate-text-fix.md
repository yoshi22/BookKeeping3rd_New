# Q3問題の並び替え & 問題文重複表示の修正

**日時**: 2025-10-07
**担当**: Claude Code
**ステータス**: 完了

---

## 📋 概要

第3問（Q3問題）の表示順序をインターリーブ方式からカテゴリグループ方式に変更し、併せて問題文が2回表示される不具合を修正しました。

---

## 🎯 作業内容

### 1. Q3問題の並び替え

#### 問題の背景

- **ユーザー要望**: 第3問の問題が種類ごとにバラバラに表示されており、学習しづらい
- **元の順序**: Q3_TB_001 → Q3_CTB_001 → Q3_FS_001 → Q3_TB_002 → Q3_CTB_002 → ... （インターリーブ方式）
- **要望の順序**: Q3_TB_001～020 → Q3_CTB_001～015 → Q3_FS_001～015 （カテゴリグループ方式）

#### 実施手順

**1.1 バックアップ作成**

```bash
# master-questions.ts のバックアップ
cp src/data/master-questions.ts src/data/master-questions.ts.backup-1759795134
```

**1.2 並び替えスクリプト作成（JavaScript版 - 失敗）**

`scripts/data/reorder-q3-questions.js` を作成しましたが、ブレースカウントロジックの問題で50問中1問しか検出できず失敗。

**エラー原因**: TypeScriptオブジェクト内のJSON文字列に含まれるブレースを正しくカウントできなかった。

**1.3 並び替えスクリプト作成（Python版 - 成功）**

`scripts/data/reorder-q3-questions.py` を作成し、成功。

**主要ロジック**:

```python
def extract_question_objects(content):
    """問題オブジェクトをすべて抽出する"""
    questions = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Q3問題のID行を検出
        if 'id: "Q3_TB_' in line or 'id: "Q3_CTB_' in line or 'id: "Q3_FS_' in line:
            match = re.search(r'id: "(Q3_[A-Z]+_\d+)"', line)
            if match:
                question_id = match.group(1)

                # ブレースカウントで問題オブジェクトの範囲を特定
                # ...

                questions.append({
                    'id': question_id,
                    'start_line': start_line,
                    'end_line': end_line,
                    'lines': question_lines
                })

# カテゴリ別にソート
tb_questions.sort(key=lambda q: q['id'])
ctb_questions.sort(key=lambda q: q['id'])
fs_questions.sort(key=lambda q: q['id'])

# TB → CTB → FS の順に結合
reordered_questions = tb_questions + ctb_questions + fs_questions
```

**実行結果**:

```
Q3問題を50問検出しました:
- Q3_TB (試算表穴埋め): 20問
- Q3_CTB (合計試算表): 15問
- Q3_FS (財務諸表): 15問

並び替え後の順序:
1-20: Q3_TB_001, Q3_TB_002, ..., Q3_TB_020
21-35: Q3_CTB_001, Q3_CTB_002, ..., Q3_CTB_015
36-50: Q3_FS_001, Q3_FS_002, ..., Q3_FS_015

検証: Q3問題数 50 → 50
✅ 問題数が一致しています
```

**1.4 TypeScript構文検証**

```bash
npx tsc --noEmit
# → エラーなし（既存のテストファイルエラーのみ）
```

**1.5 データバージョン更新**

`src/data/migrations/index.ts`:

```typescript
// Line 142
const SAMPLE_DATA_VERSION = "2025-10-07-q3-category-order";

// Line 145（一時的）
const forceUpdate = true; // ⚠️ Q3問題順序変更のため一時的にtrue
```

**1.6 シミュレーターでの検証**

ログで確認:

```
LOG  [DEBUG] Q3問題数: 50 最初の3問: ["Q3_TB_001", "Q3_TB_002", "Q3_TB_003"]
```

✅ 並び替え成功を確認

**1.7 forceUpdate復元**

検証完了後、ユーザーデータ保護のため復元:

```typescript
// Line 145
const forceUpdate = false; // ✅ Q3問題順序変更完了、ユーザーデータ保護のためfalseに復元
```

### 2. 問題文重複表示の修正

#### 問題の背景

- **ユーザー報告**: 第3問で問題文が2回表示される
- **原因**: QuestionDisplayコンポーネントとQ3問題フォームの両方で問題文を表示していた

#### 調査結果

**問題箇所の特定**:

1. `QuestionDisplay.tsx` (lines 755-764): QuestionTextコンポーネントで問題文を表示
2. `FillInTrialBalanceForm.tsx` (lines 240-243): フォーム内で問題文を表示
3. `FillInComprehensiveTrialBalanceForm.tsx` (lines 199-201): フォーム内で問題文を表示
4. `FillInFinancialStatementForm.tsx` (lines 202-204): フォーム内で問題文を表示

**条件分岐の問題**:

```tsx
// 修正前（lines 755-757）
{!shouldUseVocabularyForm &&
  !shouldUseFillInLedgerForm &&
  !shouldUseAuxiliaryBookForm && (
    <QuestionText ... />
  )}
```

VocabularyForm、FillInLedgerForm、AuxiliaryBookFormは除外されていたが、Q3問題フォームは除外されていなかった。

#### 修正内容

**ファイル**: `/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/QuestionDisplay.tsx`
**行**: 754-767

**修正前**:

```tsx
{
  /* 問題文 - VocabularyForm, FillInLedgerForm, AuxiliaryBookFormは自己完結型なので除外 */
}
{
  !shouldUseVocabularyForm &&
    !shouldUseFillInLedgerForm &&
    !shouldUseAuxiliaryBookForm && (
      <QuestionText
        key={`question-text-${questionId}`}
        questionText={questionText}
        questionId={questionId}
        difficulty={difficulty}
      />
    );
}
```

**修正後**:

```tsx
{
  /* 問題文 - VocabularyForm, FillInLedgerForm, AuxiliaryBookForm, Q3問題フォームは自己完結型なので除外 */
}
{
  !shouldUseVocabularyForm &&
    !shouldUseFillInLedgerForm &&
    !shouldUseAuxiliaryBookForm &&
    !shouldUseFillInTrialBalanceForm &&
    !shouldUseFillInComprehensiveTrialBalanceForm &&
    !shouldUseFillInFinancialStatementForm && (
      <QuestionText
        key={`question-text-${questionId}`}
        questionText={questionText}
        questionId={questionId}
        difficulty={difficulty}
      />
    );
}
```

**変更内容**:

- `!shouldUseFillInTrialBalanceForm` を追加（試算表穴埋め問題）
- `!shouldUseFillInComprehensiveTrialBalanceForm` を追加（合計試算表問題）
- `!shouldUseFillInFinancialStatementForm` を追加（財務諸表問題）

---

## 📊 影響範囲

### 変更されたファイル

1. **`src/data/master-questions.ts`**
   - Q3問題（50問）の順序を変更
   - 行範囲: 5326-6165（約850行）

2. **`src/data/migrations/index.ts`**
   - データバージョン更新: `"2025-10-07-q3-category-order"`
   - forceUpdate一時変更 → 復元

3. **`src/components/QuestionDisplay.tsx`**
   - 問題文表示条件の修正（lines 754-767）

4. **新規作成**:
   - `scripts/data/reorder-q3-questions.py` - 並び替えスクリプト（成功版）
   - `scripts/data/reorder-q3-questions.js` - 並び替えスクリプト（失敗版、参考用）

### 影響を受ける機能

1. **学習タブ - 第3問カテゴリ**
   - 問題の表示順序がカテゴリごとにグループ化
   - 問題文の重複表示が解消

2. **復習タブ - 第3問**
   - 問題の表示順序がカテゴリごとにグループ化
   - 問題文の重複表示が解消

---

## ✅ 検証結果

### データ整合性検証

**問題数確認**:

```bash
# Q3_TB問題数
grep -c 'id: "Q3_TB_' src/data/master-questions.ts
# → 20

# Q3_CTB問題数
grep -c 'id: "Q3_CTB_' src/data/master-questions.ts
# → 15

# Q3_FS問題数
grep -c 'id: "Q3_FS_' src/data/master-questions.ts
# → 15

# 合計
# → 50問（変更なし）
```

### シミュレーター検証

**確認項目**:

- ✅ Q3_TB_001から順次表示されることを確認
- ✅ 問題文が1回のみ表示されることを確認
- ✅ データベース移行が正常完了
- ✅ 全50問が正しい順序で保存

**ログ確認**:

```
LOG  [DEBUG] Q3問題数: 50 最初の3問: ["Q3_TB_001", "Q3_TB_002", "Q3_TB_003"]
LOG  [DEBUG] DB挿入後のカテゴリ別件数: [{"category_id": "trial_balance", "count": 50}]
```

---

## 🔧 技術的課題と解決策

### 課題1: JavaScript版スクリプトの失敗

**問題**: ブレースカウントロジックがJSON文字列内のブレースを誤って処理

**解決策**: Python版スクリプトで改良されたパース処理を実装

- 行ごとのブレースカウント
- ID行からのバックトラック検索
- より堅牢なエラーハンドリング

### 課題2: 問題文重複の根本原因

**問題**: 自己完結型フォームの概念が不完全

**解決策**:

- Q3問題フォームも自己完結型として扱うように条件分岐を修正
- コメントで明確に除外理由を記載

---

## 📝 今後の対応

### 推奨事項

1. **並び替えスクリプトの保守**
   - Python版スクリプトを正式版として保持
   - JavaScript版は削除または参考資料として保管

2. **自己完結型フォームの定義明確化**
   - 問題文を自分で表示するフォームのリストをドキュメント化
   - 新規フォーム追加時のチェックリスト作成

3. **データバージョン管理**
   - forceUpdate使用時は必ず開発ログに記録
   - 検証完了後の復元を忘れないこと

### 注意事項

⚠️ **forceUpdateフラグの取り扱い**

- 一時的に `true` に設定する際は、必ずコメントに理由と復元タスクを記載
- 検証完了後は必ず `false` に戻す
- このフラグが `true` のままだとユーザーの学習履歴が削除される

---

## 📚 関連ファイル

### スクリプト

- `scripts/data/reorder-q3-questions.py` - Q3問題並び替え（成功版）
- `scripts/data/reorder-q3-questions.js` - Q3問題並び替え（失敗版、参考用）

### バックアップ

- `src/data/master-questions.ts.backup-1759795134` - 並び替え前のバックアップ

### 修正箇所

- `src/data/master-questions.ts` (lines 5326-6165) - Q3問題の並び替え
- `src/data/migrations/index.ts` (line 142, 145) - データバージョン更新
- `src/components/QuestionDisplay.tsx` (lines 754-767) - 問題文重複修正

---

## 🎯 成果

### ユーザー体験の改善

1. **学習効率の向上**
   - カテゴリごとにまとまった学習が可能
   - 試算表問題（Q3_TB）を集中的に学習できる

2. **UI/UXの改善**
   - 問題文の重複表示が解消
   - 画面のスクロール量が削減

3. **データ品質の維持**
   - 全50問の整合性を保持
   - 問題内容の変更なし

### 変更前後の比較

**変更前（インターリーブ方式）**:

```
Q3_TB_001 → Q3_CTB_001 → Q3_FS_001 →
Q3_TB_002 → Q3_CTB_002 → Q3_FS_002 → ...
```

**変更後（カテゴリグループ方式）**:

```
Q3_TB_001 → Q3_TB_002 → ... → Q3_TB_020 →
Q3_CTB_001 → Q3_CTB_002 → ... → Q3_CTB_015 →
Q3_FS_001 → Q3_FS_002 → ... → Q3_FS_015
```

---

**作業完了日時**: 2025-10-07
**検証ステータス**: ✅ 完了
**本番反映**: 即座に反映（forceUpdate復元済み）
