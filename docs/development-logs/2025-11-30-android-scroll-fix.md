# Android正答表示画面スクロール問題の修正

## 日時

2025-11-30

## 問題概要

内部テスト版でAndroid実機確認時、正答表示画面（AnswerResultDialog）でスクロールできない問題が発生。

## 原因

**ScrollViewのネスト問題**

React Nativeでは、同じ方向にスクロールするネストされたScrollViewは正常に動作しない。

### 問題のコード構造

```
AnswerResultDialog.tsx
└── ScrollView (157行目)
    └── UnifiedExplanation.tsx
        └── ScrollView (256行目) ← ネストされたScrollView
```

`AnswerResultDialog`内の`ScrollView`と、`UnifiedExplanation`コンポーネント内の`ScrollView`がネストされていた。

## 修正内容

### 修正ファイル

- `src/components/unified/UnifiedExplanation.tsx`

### 修正方針

`UnifiedExplanation`の`renderExplanationContent`関数を修正し、表示モードに応じてラッパーコンポーネントを切り替える：

- **panelモード**: `View`を使用（親のScrollViewに委譲）
- **modalモード**: `ScrollView`を使用（独自スクロール）

### 修正コード

```typescript
// 修正前
const renderExplanationContent = () => (
  <ScrollView style={styles.scrollContent} ...>
    ...
  </ScrollView>
);

// 修正後
const renderExplanationContent = (useScrollView: boolean = false) => {
  const ContentWrapper = useScrollView ? ScrollView : View;
  // ...
  return (
    <ContentWrapper {...wrapperProps}>
      ...
    </ContentWrapper>
  );
};
```

### 呼び出し側の修正

```typescript
// panelモード（親にScrollViewあり）
{
  renderExplanationContent(false);
}

// modalモード（独自ScrollView必要）
{
  renderExplanationContent(true);
}
```

## 影響範囲

- 学習画面の正答表示ダイアログ
- 復習画面の正答表示ダイアログ
- 模試の解説表示（modalモード）

## 検証

- TypeScript型チェック: 既存のテストエラー以外に新規エラーなし
- 修正後、Android実機でスクロール可能になることを確認予定

## 関連情報

- Google Play内部テスト配信: Version code 3
- targetSdkVersion: 35に更新済み
