# 簿記3級「確実復習」アプリ — Claude Design ブリーフ

## アプリ概要

**アプリ名**: 簿記3級「確実復習」  
**プラットフォーム**: iOS / Android (React Native + Expo)  
**主要ユーザー**: 簿記3級を受験しようとしている学習者（初学者〜再挑戦者）  
**コアバリュー**: 間違えた問題だけを反復する「確実復習」で、スキマ時間に合格力を高める

---

## 画面構成（現在の実装）

### タブナビゲーション（4タブ）

| タブ   | 画面                            | 主な機能                                                     |
| ------ | ------------------------------- | ------------------------------------------------------------ |
| ホーム | `app/(tabs)/index.tsx`          | ヒーローカード + 3つのクイックアクション（学習・復習・統計） |
| 学習   | `app/(tabs)/learning/index.tsx` | カテゴリ選択（第1問/第2問/第3問 + 全問順次進行）             |
| 復習   | `app/(tabs)/review/index.tsx`   | 復習リスト + 統計タブ切り替え                                |
| 設定   | `app/(tabs)/settings.tsx`       | テーマ切り替え・データベースリセット                         |

### 問題フロー

```
学習/復習タブ
  → カテゴリ選択 or 全問選択
    → 問題画面 app/(tabs)/learning/question/[id].tsx
      → AnswerResultDialog（正誤表示 + 解説）
        → 次の問題 or セッション結果画面
```

### 問題タイプ（3種類）

- **仕訳問題** (第1問): 借方・貸方の勘定科目 + 金額を入力（262問）
- **補助簿・帳簿問題** (第2問): 帳簿への転記・選択 (26問)
- **試算表・決算書** (第3問): 財務表の空欄を記入 (8問)

---

## 現在のデザインシステム

### カラーパレット

#### ブランドカラー（ライトモード）

```
Primary (ティール):
  #2F8795  ← メインアクション、アクティブタブ、ヒーローカード背景
  #3FADBB  ← プライマリライト
  #276F7B  ← プライマリダーク

Secondary (コーラル):
  #E15A3D  ← 二次アクション、バッジ、アクセント
  #EB6A55  ← セカンダリライト
  #C74A31  ← セカンダリダーク

Background:
  #FCFCFC  ← 画面背景
  #F7F3F0  ← セカンダリ背景
  #FFFFFF  ← サーフェス（カード）
  #FFF0EB  ← カード背景（コーラル薄め）

Text:
  #212121  ← プライマリテキスト
  #9B9590  ← セカンダリテキスト
  #CFC8C4  ← ディセーブルドテキスト

Status:
  #2F8F80  ← 成功（正解）
  #D6453D  ← エラー（不正解）
  #E6A75A  ← 警告
  #3FADBB  ← インフォ
```

#### ダークモードも完全対応済み（darkColors）

### タイポグラフィ

- **最小フォントサイズ**: 14px（WCAG対応）
- **基準サイズ**: 18px
- **フォント**: iOS = Hiragino UD Sans、Android = Noto Sans JP
- **等幅数字**: tabular-nums（金額表示用）

```
h1: 40px / 700
h2: 32px / 600
h3: 28px / 600  ← ヒーローカードタイトル
h4: 24px / 600
h5: 20px / 600
h6: 18px / 600  ← メニュータイトル
body1: 18px / 400  ← 問題文
body2: 16px / 400  ← 説明文
caption: 14px / 400  ← メタ情報
button: 16px / 600
buttonLarge: 18px / 600
```

### スペーシング（4pxベース）

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
2xl: 24px
3xl: 32px
4xl: 40px
5xl: 48px
6xl: 64px
```

### シャドウ

- small: elevation 2 / opacity 0.10
- medium: elevation 4 / opacity 0.15
- large: elevation 8 / opacity 0.20

---

## 主要コンポーネント一覧

### UI基盤

- `src/components/ui/Button.tsx` — variant: primary/secondary/outline/ghost/danger × size: small/medium/large
- `src/components/ui/Card.tsx` — サーフェスカード
- `src/components/ui/NumericPad.tsx` — 金額入力用テンキー（モーダル）
- `src/components/ui/Typography.tsx` — テキストコンポーネント

### 問題入力フォーム

- `src/components/unified/JournalEntryForm.tsx` — 仕訳入力（借方・貸方ドロップダウン + 金額）
- `src/components/unified/UnifiedAccountSelector.tsx` — 勘定科目選択（動的フィルタリング、10-15個に絞り込み）
- `src/components/cbt/TrialBalanceForm.tsx` — 試算表入力
- `src/components/cbt/CBTJournalEntryForm.tsx` — CBT仕訳入力

### フィードバック

- `src/components/AnswerResultDialog.tsx` — 解答結果モーダル（正誤 + 解説 + 次の問題ボタン）
- `src/components/unified/UnifiedExplanation.tsx` — 解説表示（折りたたみ対応）
- `src/components/session/SessionResultScreen.tsx` — セッション終了後のスコア画面

### レイアウト

- `src/components/layout/ResponsiveLayout.tsx` — Screen/Container/Flex/Row
- `src/hooks/useTabletLayout.ts` — ResponsiveContainer/ResponsiveGrid/OrientationAwareView

---

## 現在の画面詳細（各画面の構造）

### 1. ホーム画面

```
┌─────────────────────────────┐
│  [ヒーローカード - ティール背景]    │
│  🎓 アイコン                    │
│  簿記3級「確実復習」              │
│  間違えた問題を記録しながら...     │
│  [学習370問 / 復習リスト自動更新]  │
├─────────────────────────────┤
│  [学習モード] カードボタン         │
│  [重点復習]  カードボタン         │
│  [統計・進捗] カードボタン         │
└─────────────────────────────┘
各ボタン: アイコン + タイトル + 説明文
```

### 2. 学習画面

```
┌─────────────────────────────┐
│  学習モード（タイトル）            │
│  段階的学習で簿記3級を完全攻略     │
├─────────────────────────────┤
│  [全問題順次進行カード]            │
│  コーラル色 / 302問完全制覇モード  │
├─────────────────────────────┤
│  [第1問 - 仕訳問題]   45点       │
│  プログレスバー付き               │
├─────────────────────────────┤
│  [第2問 - 補助簿・帳簿] 20点     │
│  プログレスバー付き               │
├─────────────────────────────┤
│  [第3問 - 決算書作成] 35点       │
│  プログレスバー付き               │
└─────────────────────────────┘
```

### 3. 復習画面（2タブ）

```
[復習タブ] / [統計タブ]

復習タブ:
  - 復習対象件数 表示
  - [重点復習 (未克服)] ボタン
  - [全て復習] ボタン
  - カテゴリ別弱点セクション
  - CircularProgress付きの統計

統計タブ:
  - 全体正答率（サークルグラフ）
  - カテゴリ別進捗
  - 復習状況サマリー
```

### 4. 問題画面（仕訳問題の例）

```
┌─────────────────────────────┐
│  ← 戻る   Q_J_001    第1問  │
│  問題文テキスト                │
│  （例：商品100円を現金で売り上げた）│
├─────────────────────────────┤
│  仕訳入力フォーム              │
│  借方: [勘定科目▼] [金額入力]   │
│  貸方: [勘定科目▼] [金額入力]   │
│  [+ 借方追加] [+ 貸方追加]      │
├─────────────────────────────┤
│  [解答する] (プライマリボタン)   │
└─────────────────────────────┘
```

### 5. 解答結果ダイアログ（モーダル）

```
┌─────────────────────────────┐
│  ✅ 正解！ / ❌ 不正解          │
│  ─────────────────────────  │
│  正しい解答:                   │
│  借方: 現金 100               │
│  貸方: 売上 100               │
│  ─────────────────────────  │
│  [解説を見る ▼]               │
│  解説テキスト...               │
├─────────────────────────────┤
│  [次の問題へ] [閉じる]          │
└─────────────────────────────┘
```

---

## 技術制約

- **完全オフライン**: ネットワークリクエスト不可
- **ローカルDB**: SQLite（expo-sqlite）
- **React Native**: StyleSheet.create() のみ（CSS不可）
- **日本語UI必須**
- **iOS HIG準拠**: 最小タッチターゲット 44×44px
- **ダークモード対応済み**: ThemeContextでテーマ切り替え

---

## デザイン改善の要望

### 現状の課題

1. **ホーム画面の情報密度が低い**
   - ヒーローカードは視覚的に良いが、学習進捗が全く見えない
   - クイックアクションボタンが3つあるが全て横並びで優先度が分からない

2. **学習画面のカード情報が煩雑**
   - カード内にテキストが多すぎる（examInfo, details, progressなど）
   - 絵文字（📚🎯⏱）を多用しており統一感がない

3. **問題画面のレイアウトが単調**
   - 問題文と入力フォームの視覚的な区切りが弱い
   - 進捗（何問目か）が分かりにくい

4. **解答結果ダイアログの視覚フィードバックが弱い**
   - 正解・不正解の視覚的インパクトが不十分
   - 解説の開閉アニメーションが地味

5. **復習画面の動線が分かりにくい**
   - 「重点復習」と「全て復習」の違いがUIで伝わりにくい
   - 統計タブとの2タブ構成が見づらい

### 改善したい方向性

- **モチベーション維持**: 学習継続を促す視覚的なフィードバック強化
- **情報の優先度明確化**: 今すぐやるべきことが一目で分かるUI
- **問題画面の没入感**: 学習に集中できる、邪魔のないレイアウト
- **達成感の演出**: 正解時のアニメーション・スコア表示の改善
- **一貫したデザイン言語**: 絵文字依存をやめ、アイコンシステムで統一

---

## ファイルパス参照

```
src/theme/
  colors.ts       ← カラーパレット定義（brandColors, lightColors, darkColors）
  typography.ts   ← タイポグラフィ定義（fontSizes, typography variants）
  spacing.ts      ← スペーシング定義（spacing, componentSpacing）
  icons.tsx       ← AppIconコンポーネント

src/components/
  ui/Button.tsx          ← ボタンコンポーネント（5バリアント）
  ui/Card.tsx            ← カードコンポーネント
  ui/NumericPad.tsx      ← テンキーモーダル
  AnswerResultDialog.tsx ← 解答結果ダイアログ
  unified/JournalEntryForm.tsx    ← 仕訳入力フォーム
  unified/UnifiedAccountSelector.tsx ← 勘定科目選択

app/(tabs)/
  index.tsx          ← ホーム画面
  learning/index.tsx ← 学習画面
  review/index.tsx   ← 復習画面
  settings.tsx       ← 設定画面
  learning/question/[id].tsx ← 問題画面（学習）
  review/question/[id].tsx   ← 問題画面（復習）

src/context/ThemeContext.tsx  ← テーマ管理（useTheme, useThemedStyles）
```
