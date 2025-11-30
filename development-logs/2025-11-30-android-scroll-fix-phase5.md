# Android正答表示画面スクロール問題（第5弾）

## 日時
- 2025-11-30

## 目的
- Android実機で「詳しく見る」を押すまで解説モーダルがスクロールできず、「次の問題へ」ボタンにも到達できない既知の不具合を根本対応する。
- 2025-11-30付の既存ログ（phase1〜phase4）でScrollViewネスト、flex指定、contentContainerStyleなどを順に修正したが再現が解消されていないため、描画タイミングの観点から再設計する。

## 現状整理
- `AnswerResultDialog`の`ScrollView`は`Modal`表示直後にマウントされるが、Androidでは`Modal`のアニメーション完了前にレイアウト計算が走る。
- その状態で`contentSize`が0扱いとなり、`ScrollView`がスクロール不可と判定される。
- 「詳しく見る」を押すと`UnifiedExplanation`内部stateが変更→再レンダリングが走り、ここで初めて`contentSize`が再計算されるためスクロールが生き返る。

## 対応方針
- Android表示時は`Modal`アニメーション完了後に`ScrollView`を再マウントし、必ず最新の`contentSize`を取得させる。
- 併せて`contentContainerStyle`に`flexGrow`と余白を与え、初期レイアウトで高さが0認定されないよう保険を掛ける。

## 変更内容
1. `src/components/AnswerResultDialog.tsx`
   - `InteractionManager.runAfterInteractions`で`ScrollView`キーを更新し、モーダル表示直後に強制リマウントするAndroid専用ロジックを追加。
   - `questionId`単位でキーを管理し、問題切り替え時にも初期スクロール状態を確実にリセット。
   - `keyboardShouldPersistTaps="handled"`を付与し、最下部ボタンへのアクセス性を改善。
   - `contentContainerStyle`へ`flexGrow: 1`と`paddingBottom: 32`を追加、`container`に`minHeight: screenHeight`を設定して高さ計算を安定化。
   - デバッグログは`__DEV__`ガード内に移し、本番ビルドに不要なログが出ないよう整理。

## 動作確認
- `npm run lint`
  - 実行環境全体で既存のLintエラーが大量に残っているためコマンドは失敗。
  - 代表的な失敗要因:
    - `WebDriverAgent/test/**/*` 系ファイルで `describe`/`it` グローバル未定義 (`no-undef`).
    - `scripts/fixes/*.js` などのスクリプトに構文エラー (`Parsing error: Expression expected`).
    - `src/data/account-categories.ts` の重複キーなど、今回触れていない部分の既知警告。
  - 上記は既存課題として残し、本修正では`AnswerResultDialog.tsx`のビルドエラーが無いことのみ確認。

## 今後のフォロー
- 実機（特にPixel系）で「詳しく見る」を押さなくても即座にスクロールできるかを再検証する。
- 可能であれば`WebDriverAgent`や`scripts`配下のLintエラーの恒久対応も別タスクで進める。
