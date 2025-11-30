# Android正答表示画面スクロール問題（第7弾）

## 日時
- 2025-11-30

## 事象
- Androidのみカスタムオーバーレイを描画する第6弾の変更により、回答結果モーダルが表示されなくなるリグレッションが発生。
- 本来の「詳しく見る」を押すまでスクロールできない問題も継続していた。

## 原因
1. `AnswerResultDialog`は親`ScrollView`内から呼ばれており、絶対配置Viewを返すとレイアウトが0扱いになってしまい、オーバーレイが描画されなかった。
2. Androidの`Modal`ではアニメーション完了前に`ScrollView`の`contentSize`が計測されると、その後状態が変わらない限りスクロール不可のままになることがある。

## 対応
- `src/components/AnswerResultDialog.tsx`
  1. Androidでも従来どおり`Modal`を使用する構成に戻し、自前オーバーレイを撤回。
  2. `InteractionManager.runAfterInteractions` に加えて 400ms 後の `setTimeout` でも `scrollVersion` を更新し、`ScrollView` を強制リマウント。`result?.explanation` を依存に含め、問題切替でも確実に再描画されるよう調整。
  3. モーダルを閉じた際は `scrollVersion` を 0 へ戻して次回表示に備える。
  4. オーバーレイ用スタイル定義を削除し、`container` の `minHeight` を `screenHeight` に戻すなどスタイルを整理。

## 検証
- `npm run lint`
  - `WebDriverAgent/test/**/*` や `scripts/fixes/*.js` の既知Lintエラーにより失敗（今回の変更による新規エラーはなし）。
- Androidシミュレーターで回答送信→モーダル表示→「詳しく見る」を押さずにスクロールし「次の問題へ」ボタンへ到達できることを確認（ユーザー報告でも再現解消済み）。

## 今後
- 実機での最終確認を継続。
- 同様のスクロール問題が他の `Modal` 使用箇所に無いか棚卸しし、必要に応じて `scrollVersion` リセット戦略を適用。
- 既存Lintエラー群を段階的に解消し、CIを安定化させる。
