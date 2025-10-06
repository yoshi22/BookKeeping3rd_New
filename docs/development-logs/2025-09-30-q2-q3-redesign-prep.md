# 2025-09-30 第2問・第3問再設計準備ログ

## 実施概要
- ChatGPT調査結果をもとに CBT 形式へ寄せるための準備作業を実施。
- 設問テンプレート仕様とモック UI ワイヤフレームを整備。
- answer_template 生成スクリプトへ `allowed_accounts` / `layout_variant` など新フィールドを追加する PoC を実装。

## 変更ファイル
- `docs/engineering/ledger-trial-template-spec-2025-09.md`
  - テンプレート種別、JSON スキーマ、UI 指針を整理し `template_type` / `layout_variant` / `allowed_accounts` などの定義を明記。
- `docs/engineering/wireframes/2025-09-30-ledger-trial-wireframes.md`
  - Q_L_015・Q_T_001 を例に CBT 風レイアウトをテキストワイヤフレームで記載（ヘッダー、入力ペイン、メモタブ構成）。
- `scripts/data/generate-questions-master.ts`
  - `question-accounts-mapping-generated.ts` を参照し問題 ID ごとの `allowed_accounts` を抽出するヘルパーを追加。
  - Ledger/Trial 向けテンプレートメタ定義を作成し、`template_type` / `layout_variant` / `columns` / `rows` / `guidance` を answer_template に埋め込む PoC を実装。

## 今後のタスク
1. 実データ（`master-questions.ts`）への段階的適用と既存回答履歴との互換性検証。
2. UI 実装着手前に Figma プロトタイプで配色・インタラクションを確認。
3. answer_template 更新に伴う評価ロジック（`answer-service`）の影響分析とテスト整備。

## 参考
- `docs/feedback/2025-09-23-beta-feedback.md`
- 競合アプリ（パブロフ簿記、スタディング、CPAラーニング）の CBT 画面構成（ChatGPT 調査メモ）
