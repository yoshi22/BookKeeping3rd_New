# Android正答表示画面スクロール問題（第6弾）

## 日時
- 2025-11-30

## 事象
- Androidで解説モーダルを開いた直後、ScrollViewのタッチが無効化され、「詳しく見る」を押すまでスクロールできず「次の問題へ」ボタンにも到達できない。

## 原因
- `presentationStyle="pageSheet"`付き`Modal`をAndroidでも使用していたため、モーダルがOSネイティブの別ウィンドウとして扱われ、初期描画時のレイアウト計算とタッチディスパッチが不安定になっていた。
- その結果、`ScrollView`がcontentSizeを0扱いし、タッチが忽然と無視される。内部stateを変更して再描画するとスクロール可能になる現象が発生。

## 対応
1. `Modal`をAndroidでは使用せず、`StyleSheet.absoluteFillObject`で自前のオーバーレイを描画。
   - 背景タップで閉じる`TouchableWithoutFeedback`を追加。
   - 角丸のボトムシート風View（`androidSheet`）に解説コンテンツを配置し、heightを`screenHeight * 0.92`に制限。
2. `BackHandler`でハードウェア戻るボタンをフックし、従来通り閉じられるようにした。
3. iOSは従来通り`Modal pageSheet`を継続しつつ、共通の`renderDialogContent`で中身を描画。
4. 既存の`InteractionManager.runAfterInteractions`による`ScrollView`再マウント（`scrollVersion`）は保険として維持。

## 変更ファイル
- `src/components/AnswerResultDialog.tsx`
  - Android専用オーバーレイ、BackHandler、TouchableWithoutFeedback、スタイル分岐を追加。
  - ScrollView本体は共通化し、Androidでは常に初期描画からスクロール可能に。

## 検証
- `npm run lint`
  - 既存のWebDriverAgentテストや`scripts/fixes/*.js`に起因するLintエラーが残っており、コマンドは失敗（今回の変更による新規エラーはなし）。
- 実機/エミュレータでモーダルを開いた直後からスクロールでき、「次の問題へ」ボタンにもタップで到達できることを手動確認予定。

## 今後
- Android実機での最終確認後、同様のModalを使う他画面で同問題がないか洗い出す。
- 既存のLintエラー群（WebDriverAgentやscripts配下）を段階的に整理し、CIを安定化させる。
