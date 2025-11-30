# Android正答表示画面スクロール問題の修正（第2弾）

## 日時

2025-11-30

## 問題概要

前回の修正（ScrollViewネスト問題の解消）後も、正答表示画面で「詳しく見る」ボタンをクリックしないとスクロールできない問題が継続。

## 根本原因

**`panelContent`スタイルの`flex: 1`設定**

### なぜ問題なのか

1. `panelContent`に`flex: 1`があると、親の利用可能スペースを全て占有
2. 内部コンテンツがFlexbox計算で圧縮される
3. 親のScrollViewが「スクロール不要」と判断
4. 「詳しく見る」展開時にコンテンツが増えて初めてスクロール可能になる

## 修正内容

### 修正ファイル

- `src/components/unified/UnifiedExplanation.tsx`

### 修正箇所: Line 442-445

**修正前:**

```typescript
panelContent: {
  // maxHeightを削除して親コンテナに合わせて自動拡張
  flex: 1,
},
```

**修正後:**

```typescript
panelContent: {
  // flex: 1を削除してコンテンツの自然な高さを尊重
  // 親のScrollViewが高さ計算を担当
},
```

## 技術的背景

### React NativeのFlexboxとScrollView

- `flex: 1`は親コンテナの残りスペースを全て占有する
- ScrollView内で`flex: 1`を使うと、コンテンツが圧縮されスクロール不要と判断される
- コンテンツの自然な高さを尊重するには、`flex`を削除して高さを`auto`にする必要がある

### 前回修正との関係

前回の修正（2025-11-30-android-scroll-fix.md）では、ネストされたScrollViewの問題を解消：

- panelモード: Viewを使用（親のScrollViewに委譲）
- modalモード: ScrollViewを使用（独自スクロール）

今回の修正は、その上で残っていたFlexboxレイアウトの問題を解消。

## 影響範囲

- 学習画面の正答表示ダイアログ
- 復習画面の正答表示ダイアログ

## 期待される効果

- 初期状態（アコーディオン展開前）からスクロール可能
- 親のScrollViewが正しくコンテンツ高さを計算
- iOS/Android両方で正常動作

## 検証手順

1. アプリを再起動
2. 問題に解答して正答表示画面を表示
3. 「詳しく見る」をクリックせずにスクロールできるか確認
4. iOS/Android両方で動作確認

## 関連情報

- 前回修正: `docs/development-logs/2025-11-30-android-scroll-fix.md`
- Google Play内部テスト配信: Version code 5 → 修正後は6に更新予定
