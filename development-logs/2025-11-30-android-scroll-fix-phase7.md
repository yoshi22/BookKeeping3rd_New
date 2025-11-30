# Android正答表示画面スクロール問題（第7弾）

## 日時
- 2025-11-30

## 事象
- 第6弾の変更（Androidのみ自前オーバーレイ化）で回答結果モーダルが表示されなくなるリグレッションが発生。
- 従来の「詳しく見る」を押すまでスクロールできず『次の問題へ』ボタンに到達できない問題も引き続き残っていた。

## 原因
1. `AnswerResultDialog`は親`ScrollView`内から呼び出されており、絶対配置のカスタムオーバーレイViewを返すと親のレイアウトが0扱いになり、結果としてダイアログが描画されなかった。
2. Androidの`Modal`はアニメーション完了前に`ScrollView`の`contentSize`が計測されると、以後サイズが更新されずスクロール不可のまま固定されることがある。

## 対応
1. Androidでも従来どおり`Modal`を使用する構成に戻した。
2. `visible`かつ`result`が設定されたタイミングで、`InteractionManager.runAfterInteractions`と400ms後の`setTimeout`の二段構えで`scrollVersion`を更新。`ScrollView`に`key={scrollKey}`を渡しているため、この値が変わるたびに完全リマウントされ、`contentSize`が再計算される。
3. モーダルを閉じた際は`scrollVersion`を0へ戻し、次回表示に備える。
4. `result?.explanation`を依存に追加し、問題切り替えでも確実に初期状態が再描画されるようにした。

## 変更ファイル
- `src/components/AnswerResultDialog.tsx`
  - Android自前オーバーレイと`BackHandler`関連ロジックを削除し、`Modal`に一本化。
  - ScrollView再マウントロジックを強化（`InteractionManager`＋`setTimeout`＋依存見直し）。
  - オーバーレイ用スタイル定義を削除し、`container`の`minHeight`を`screenHeight`に戻した。

## 検証
- `npm run lint`
  - `WebDriverAgent/test/**/*`や`scripts/fixes/*.js`に残る既知のLintエラーが原因で失敗。今回変更箇所による新規エラーはなし。
- Androidシミュレーターで回答送信→モーダル表示→「詳しく見る」を押さずにスクロールし「次の問題へ」ボタンへ到達できることを確認（ユーザー報告もあり）。

## 今後
- 実機検証を継続して挙動を確認。
- 既存のLintエラー群を解消し、CIを安定化させるタスクを計画。
