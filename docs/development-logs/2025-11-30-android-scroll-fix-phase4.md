# Android正答表示画面スクロール問題の修正（第4弾）

## 日時

2025-11-30

## 問題

「詳しく見る」ボタンをクリックしないと「次の問題へ」ボタンが表示されない（Android実機）

## これまでの修正履歴と効果なし

| 弾    | 修正内容                                       | 結果        |
| ----- | ---------------------------------------------- | ----------- |
| 第1弾 | ScrollViewネスト解消                           | ❌ 効果なし |
| 第2弾 | panelContent flex:1削除                        | ❌ 効果なし |
| 第3弾 | contentContainerStyle, nestedScrollEnabled追加 | ❌ 効果なし |

## 根本原因の再分析

### 現在のコンポーネント階層（修正前）

```
Modal (presentationStyle="pageSheet")
└── View (container) [flex: 1]
    ├── View (header) - 固定
    ├── ScrollView (content) [flex: 1]
    │   └── UnifiedExplanation
    └── View (actionButtons) ← ボタンはScrollViewの【外】
```

### 核心的な問題

**「次の問題へ」ボタンはScrollViewの外に配置されている**

理論上、このボタンは常に画面下部に固定表示されるはずだが、Androidでは表示されない。

これは**Android特有のModal + Flex レイアウト計算バグ**であり、ScrollView内部の修正では解決不可能。

### なぜ「詳しく見る」を押すと表示されるのか

state更新 → 再レンダリング → レイアウト再計算がトリガーされ、その時点でFlexレイアウトが正しく計算される。

## 修正方針（第4弾）

**ボタンをScrollViewの内部に移動する**

これにより、ボタンは常にスクロールコンテンツの末尾に配置され、スクロールして確実に到達可能になる。

## 修正内容

### ファイル: `src/components/AnswerResultDialog.tsx`

#### 修正箇所1: JSX構造の変更

**修正前の構造:**

```tsx
<View style={styles.container}>
  <View style={styles.header}>...</View>
  <ScrollView style={styles.content}>
    <UnifiedExplanation ... />
  </ScrollView>
  <View style={styles.actionButtons}>  {/* ScrollViewの外 */}
    <TouchableOpacity>次の問題へ</TouchableOpacity>
  </View>
</View>
```

**修正後の構造:**

```tsx
<View style={styles.container}>
  <View style={styles.header}>...</View>
  <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
    <UnifiedExplanation ... />
    {/* ボタンをScrollView内に移動 */}
    <View style={styles.actionButtons}>
      <TouchableOpacity>次の問題へ</TouchableOpacity>
    </View>
  </ScrollView>
</View>
```

#### 修正箇所2: スタイル調整

```typescript
contentContainer: {
  paddingTop: 10,
  paddingBottom: 0,  // ボタンが内部に入ったのでpaddingBottom削除
},
```

## 修正の技術的根拠

1. **確実性**: ボタンがScrollView内にあれば、スクロールで必ず到達可能
2. **Android互換性**: Flex計算の問題を回避
3. **シンプルさ**: 複雑なレイアウト調整不要
4. **一貫性**: iOS/Android両方で同じ動作を保証

## ビルド情報

- versionCode: 8
- versionName: 1.0.9
- Build ID: f9a57c9c-8cbc-4de7-b855-9bc3ea36093f

## 検証手順

1. Android実機でアプリを起動
2. 問題に解答
3. 正答表示ダイアログが表示される
4. スクロールして「次の問題へ」ボタンが見えることを確認
5. ボタンをタップして次の問題に進めることを確認

## 修正されたファイル

1. `src/components/AnswerResultDialog.tsx`
   - actionButtonsをScrollView内に移動
   - contentContainerのpaddingBottom削除

2. `android/app/build.gradle`
   - versionCode: 7 → 8
   - versionName: "1.0.8" → "1.0.9"
