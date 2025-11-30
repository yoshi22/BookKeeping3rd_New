# Android正答表示画面スクロール問題（第6弾）

## 日時
- 2025-11-30

## 事象
- Androidで解説モーダルを開いた直後、ScrollViewがタッチを受け付けず、「詳しく見る」を押して再描画されるまでスクロールできない。
- 「次の問題へ」ボタンもScrollView末尾にあるため到達できず、UXが破綻していた。

## 原因
- `Modal`コンポーネント（`presentationStyle="pageSheet"`）をAndroidでもそのまま使用していた。
- Androidでは`Modal`が別ウィンドウとして描画されるため、初期レイアウトの`ScrollView`が正しく測距できず、タッチイベントもブロックされる状況に陥っていた。
- 「詳しく見る」トグルで子コンポーネントのstateが変わると再度レイアウトが走るため、そのタイミングでようやくスクロールが有効化されていた。

## 対応
1. `src/components/AnswerResultDialog.tsx`
   - **Android専用オーバーレイを実装**: `Modal`を使わず、`StyleSheet.absoluteFillObject`で全画面に被せるシートを描画。
   - **BackHandler対応**: `Modal`を外したため、ハードウェア戻るボタンをフックし、解説ダイアログを閉じる挙動を維持。
   - **タップ検知**: バックドロップを`TouchableWithoutFeedback`でラップし、外側タップで閉じるUXを追加。
   - **UI調整**: Androidシート用の角丸・影スタイルを追加し、既存の`container`スタイルはプラットフォーム別（iOS=pageSheet, Android=overlay）に分岐。
   - 既存の`ScrollView`再マウントロジック（`scrollVersion`）は保持し、初期タッチ不具合の保険として継続。

## 検証
- `npm run lint`（既存の`WebDriverAgent`や`scripts/fixes`配下に起因するLintエラーが多量に残っているため失敗／変更箇所では新規エラーなし）。
- Androidエミュレータで、モーダルを開いた直後からスクロール可能になり、「次の問題へ」ボタンへも即座に到達できることを手動確認予定。

## 残課題
- `Modal`を利用する他画面で同様の問題がないか確認。
- 旧来から存在するLintエラー群（WebDriverAgentテスト、scripts配下のパーサエラーなど）を段階的に解消する必要あり。
