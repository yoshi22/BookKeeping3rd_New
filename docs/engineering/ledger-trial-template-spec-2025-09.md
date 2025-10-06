# 第2問・第3問 Answer Template 拡張仕様（2025-09-30）

## 目的
- `ledger_account` / `trial_balance` 問題で CBT 風の固定レイアウトを再現。
- 問題ごとに必要な勘定科目・列定義を明示して UI の冗長さを削減。
- 将来の機能（手書きメモ、段階ガイド）と整合するデータ形式を提供。

## テンプレート種別
| template_type | 対象 | 主な列セット | 備考 |
| --- | --- | --- | --- |
| `general_ledger` | 総勘定元帳記入（Q_L_001-010） | `date`, `description`, `debit`, `credit`, `balance` | 行数固定（最大10）＋残高自動計算 |
| `subsidiary_ledger` | 補助簿（仕入帳・売上帳など Q_L_011-020） | `date`, `description`, `amount`, `balance` | 帳簿種別に応じて `amount` 列ラベルを切替 |
| `voucher` | 3伝票/5伝票（Q_L_021-030） | `date`, `voucherType`, `description`, `debit`, `credit` | `voucherType` は選択肢固定 |
| `ledger_mcq` | 理論・選択問題（Q_L_031-040） | `questionText`, `choices[]` | 既存 `choice` テンプレの再利用を推奨 |
| `trial_balance_simple` | 合計残高試算表（Q_T_001-004, 009-012） | `accountName`, `debit`, `credit` | 合計行は UI 側で付与 |
| `trial_balance_extended` | 八桁精算表（Q_T_005-008） | `accountName`, `trialDebit`, `trialCredit`, `adjustDebit`, `adjustCredit`, `balanceDebit`, `balanceCredit` | 列幅を CBT 風に固定 |

## JSON スキーマ（抜粋）
```jsonc
{
  "template_type": "general_ledger",
  "layout_variant": "ledger_A",
  "allowed_accounts": ["現金", "売掛金", "売上", "現金過不足"],
  "rows": [
    {
      "row_id": "r1",
      "label": "前月繰越",
      "locked": true,
      "default_values": {"date": "4/1", "description": "前月繰越", "debit": 0, "credit": 0}
    },
    {
      "row_id": "r2",
      "label": "取引1",
      "locked": false
    }
  ],
  "columns": [
    {"key": "date", "label": "日付", "input": "text", "width": 80},
    {"key": "description", "label": "摘要", "input": "dropdown", "options_ref": "allowed_accounts", "width": 160},
    {"key": "debit", "label": "借方", "input": "currency", "width": 120},
    {"key": "credit", "label": "貸方", "input": "currency", "width": 120},
    {"key": "balance", "label": "残高", "input": "computed", "formula": "prev + debit - credit", "width": 120}
  ],
  "guidance": [
    {"stage": 1, "title": "取引確認", "body": "問題文の取引明細を確認し、日付順に整理します。"},
    {"stage": 2, "title": "転記", "body": "借方・貸方を入力すると残高が自動更新されます。"},
    {"stage": 3, "title": "残高検証", "body": "合計残高を確認し、現金過不足を調整します。"}
  ]
}
```

### フィールド説明
- `template_type`: UI レンダリングコンポーネントの選択キー。
- `layout_variant`: 同一テンプレ内のバリアント識別。UI は列幅・背景色などを切替。
- `allowed_accounts`: 摘要ドロップダウンに表示する勘定科目の配列。`options_ref` と連携。
- `rows`: 初期行構成。`locked` 行は削除不可、`default_values` で初期表示。
- `columns`: 列定義。`input` は `text`/`dropdown`/`currency`/`computed` を想定。
- `guidance`: 段階表示する学習ガイド。UI で折りたたみ。

## UI レンダリング指針
1. `columns` 順にヘッダーを描画し、`width` をベースに `FlatList` や `RecyclerListView` で固定幅テーブルを生成。
2. `dropdown` 列はモーダルではなくインライン `ActionSheetIOS` / `BottomSheet` ベースで 1タップ選択を目指す。
3. `computed` 列は入力不可とし、自動計算結果を即時表示。算式は `formula` を簡易パーサーで評価。
4. 行追加ボタンは `rows` で `locked=false` の行数を上限管理し、未使用行は常時グレーアウト表示。

## バリデーション
- 合計整合: `trial_balance_*` は借方合計=貸方合計、`balance` 列が 0 以外の場合警告。
- 必須行: `rows` で `locked=true` の行が空欄の場合は警告。
- 摘要制限: `allowed_accounts` 以外の手入力は不可（自由記述は `options_ref` に `custom:true` を追加して許可）。

## マイグレーション方針
1. 既存 `answer_template_json` を抽出し、問題毎に `template_type` を設定するスクリプトを実装（PoC は `scripts/data/update-question-structure.ts` を拡張）。
2. `question-accounts-mapping-generated.ts` から `allowed_accounts` を取得し JSON に埋め込み。
3. 8桁精算表（Q_T_005-008）は `layout_variant: "trial_v2"` を付与し、UI 側で列を増設。
4. 過去回答履歴は JSON マージ戦略（古い回答 → 新テンプレの該当列へマッピング）を整理。

## 今後の検討
- `guidance` を `learning-stage` と統合し、学習履歴に応じた開閉状態を保持。
- `template_type` の enum を TypeScript (`src/types/models.ts`) に追加し、型安全性を確保。
- `allowed_accounts` の翻訳キー化（多言語対応）。
