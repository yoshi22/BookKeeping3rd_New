# Android正答表示画面スクロール問題の修正計画（第3弾）

## 日時

2025-11-30

## 問題

「詳しく見る」ボタンをクリックしないと「次の問題へ」ボタンまでスクロールできない（Android実機）

## 調査結果

### コンポーネント階層

```
Modal (AnswerResultDialog.tsx)
└── View (container) [flex: 1]
    ├── View (header) - 固定ヘッダー
    ├── ScrollView (content) [flex: 1] ← 問題箇所
    │   └── UnifiedExplanation (mode="panel")
    │       └── View (panelContainer)
    │           └── View (panelContent) [空オブジェクト]
    │               └── View (scrollContent)
    └── View (actionButtons) - 「次の問題へ」ボタン
```

### 根本原因

**Android特有のScrollView contentSize計算問題**

1. ScrollViewの`contentContainerStyle`が未設定
2. ネストされたコンポーネント内の高さが正しく測定されていない
3. Androidではレイアウト計算が厳密で、contentSizeが正確でないとスクロール不可と判定
4. 「詳しく見る」押下でstate更新→再レンダリング→レイアウト再計算がトリガーされ、その時点でスクロール可能になる

### なぜ「詳しく見る」を押すとスクロールできるようになるのか

1. ボタン押下 → `detailsExpanded` state が true に変更
2. 隠れていたコンテンツが表示される
3. React による re-render → コンポーネント木の再構築
4. **この際に、React Native の レイアウト計算が再度実行される**
5. ScrollView が新しい contentSize を再計算する
6. この時点で、ScrollView が「スクロール可能」と判定される

つまり、詳細内容そのものではなく、**state 更新 → re-render による layout recalculation** がトリガーになっている。

## 修正内容

### ファイル1: `src/components/AnswerResultDialog.tsx`

#### 修正箇所1: Line 157 - ScrollViewにプロパティ追加

**現在:**

```tsx
<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
```

**修正後:**

```tsx
<ScrollView
  style={styles.content}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.contentContainer}
  nestedScrollEnabled={true}
>
```

#### 修正箇所2: Line 304-307 - スタイル定義追加

**現在:**

```typescript
content: {
  flex: 1,
  paddingTop: 10,
},
```

**修正後:**

```typescript
content: {
  flex: 1,
},
contentContainer: {
  paddingTop: 10,
  paddingBottom: 20,
  flexGrow: 1,
},
```

### ファイル2: `src/components/unified/UnifiedExplanation.tsx`

#### 修正箇所: Line 442-445 - panelContentスタイル

**現在:**

```typescript
panelContent: {
  // flex: 1を削除してコンテンツの自然な高さを尊重
  // 親のScrollViewが高さ計算を担当
},
```

**修正後:**

```typescript
panelContent: {
  // Android向け: 明示的な高さ計算指定
  flexShrink: 0,
},
```

## 修正の技術的根拠

| プロパティ              | 目的                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `contentContainerStyle` | ScrollView内部コンテンツの配置を制御。`flexGrow: 1`でコンテンツが最小でも親を埋めるようにする |
| `nestedScrollEnabled`   | Android専用。ネストされたスクロールビューを許可                                               |
| `paddingBottom: 20`     | スクロール検出のためのバッファ領域を確保                                                      |
| `flexShrink: 0`         | コンテンツが圧縮されないよう保護                                                              |

## 検証手順

1. Android実機でアプリを起動
2. 問題に解答（不正解）
3. 正答表示ダイアログが表示される
4. **「詳しく見る」をクリックせずに**スクロールできるか確認
5. 「次の問題へ」ボタンが見えるまでスクロールできるか確認

## 影響範囲

- AnswerResultDialog（正答表示ダイアログ）
- UnifiedExplanation（解説パネル）

## 関連情報

- 前回修正（第1弾）: `docs/development-logs/2025-11-30-android-scroll-fix.md` - ScrollViewネスト問題の解消
- 前回修正（第2弾）: `docs/development-logs/2025-11-30-android-scroll-fix-phase2.md` - flex:1削除

## 実装状況

✅ 実装完了（2025-11-30）

### 修正されたファイル

1. `src/components/AnswerResultDialog.tsx`
   - ScrollViewに`contentContainerStyle`と`nestedScrollEnabled`を追加
   - `contentContainer`スタイルを新規追加

2. `src/components/unified/UnifiedExplanation.tsx`
   - `panelContent`に`flexShrink: 0`を追加

3. `android/app/build.gradle`
   - versionCode: 7
   - versionName: 1.0.8

## ビルド情報

- versionCode: 7
- versionName: 1.0.8
- EASビルド開始済み
