# 問題一覧表示の改善 - タグ表示への変更

**実施日時**: 2025年8月7日 10:15  
**実施者**: Claude Code  
**状態**: ✅ 完了

## 📋 変更概要

問題一覧画面（カテゴリ詳細画面）で、問題文の最初の一部を表示する代わりに、問題のタグ（分類情報）を表示するように変更しました。

## 🎯 変更目的

1. **視認性の向上**: 問題の種類が一目でわかる
2. **分類の明確化**: サブカテゴリ、パターン、キーワードを表示
3. **選択しやすさ**: タグによって問題の内容を素早く判断可能

## 🔧 変更内容

### 1. ファイル修正

**`/app/category/[categoryId].tsx`**

#### 変更前の動作

- `generateQuestionTitle()` 関数で問題文から最初の15文字を抽出して表示
- 問題文の内容から推測してタイトルを生成

#### 変更後の動作

- `generateQuestionTags()` 関数でタグ情報から表示用ラベルを生成
- 最大3つのタグを表示（サブカテゴリ、パターン、キーワード）

### 2. 具体的な変更点

```typescript
// 新しく追加した関数
const generateQuestionTags = (question: Question): string[] => {
  const tags = JSON.parse(question.tags_json || "{}");
  const tagLabels: string[] = [];

  // サブカテゴリのラベル追加
  // パターンのラベル追加
  // キーワードから主要なものを追加

  return tagLabels.slice(0, 3); // 最大3つまで
};
```

### 3. UIコンポーネントの変更

```tsx
// 変更前
<Text style={styles.questionTitle}>
  {generateQuestionTitle(question)}
</Text>

// 変更後
<View style={styles.tagContainer}>
  {generateQuestionTags(question).map((tag, index) => (
    <View key={index} style={styles.tagBadge}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  ))}
</View>
```

### 4. スタイル追加

```typescript
tagContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  flex: 1,
  gap: 4,
  marginRight: 8,
},
tagBadge: {
  backgroundColor: "#f0f0f0",
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderWidth: 1,
  borderColor: "#e0e0e0",
},
tagText: {
  fontSize: 11,
  color: "#666",
  fontWeight: "600",
},
```

## 📊 表示されるタグの種類

### 仕訳問題（journal）

- **サブカテゴリ**: 現金・預金、商品売買、債権・債務、給与・税金、固定資産、決算整理
- **パターン**: 現金過不足、掛け売上、減価償却など
- **キーワード**: 取引の主要な要素

### 帳簿問題（ledger）

- **サブカテゴリ**: 総勘定元帳、補助簿、伝票、理論・選択
- **パターン**: 記入方法や処理パターン
- **キーワード**: 帳簿の種類や処理内容

### 試算表問題（trial_balance）

- **サブカテゴリ**: 財務諸表、精算表、試算表
- **パターン**: 作成方法や決算処理
- **キーワード**: 作成する書類の種類

## ✅ 動作確認項目

- [x] タグが正しく表示されること
- [x] 最大3つまでのタグ制限が機能すること
- [x] タグがない問題でもエラーが発生しないこと
- [x] レイアウトが崩れないこと
- [x] 難易度バッジと並んで表示されること

## 🚀 利点

1. **学習効率の向上**: 問題の種類が一目で判別可能
2. **選択の容易さ**: 苦手分野や重点的に学習したい分野を素早く選択
3. **体系的な理解**: 問題の分類体系が視覚的に理解できる

## 📝 注意事項

- 既存の問題データ（302問）すべてにタグ情報が含まれているため、追加のデータ修正は不要
- タグ情報は`tags_json`フィールドにJSON形式で保存されている
- 今後問題を追加する際は、適切なタグ情報を含めることが重要

---

**完了時刻**: 2025年8月7日 10:15 JST  
**影響範囲**: カテゴリ詳細画面の問題一覧表示のみ
