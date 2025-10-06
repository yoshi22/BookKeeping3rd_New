#!/usr/bin/env python3
"""
Q2問題のquestion_order値を1-70連番に修正（Python版）
"""

import re
import shutil
from pathlib import Path
from datetime import datetime

MASTER_FILE = Path("src/data/master-questions.ts")

print("📝 Q2問題のquestion_order値を修正中...\n")

# ファイルを読み込み
content = MASTER_FILE.read_text(encoding="utf-8")

# すべてのQ2問題を抽出
pattern = r'\{\s*id:\s*"(Q2_[VBL]_\d+)",[\s\S]*?question_order:\s*(\d+),'

matches = re.findall(pattern, content)

print(f"✅ {len(matches)}個のQ2問題を検出\n")

# IDとcurrent question_orderのペア
q2_questions = []
for question_id, current_order in matches:
    q2_questions.append({
        'id': question_id,
        'current_order': int(current_order)
    })

# ID順にソート（B < L < V、各グループ内は数値順）
def sort_key(q):
    parts = q['id'].split('_')
    type_char = parts[1]  # B, L, or V
    number = int(parts[2])

    # B=0, L=1, V=2の順番
    type_order = {'B': 0, 'L': 1, 'V': 2}
    return (type_order.get(type_char, 3), number)

q2_questions.sort(key=sort_key)

# 新しいorder値を割り当て
order_mapping = {}
for index, q in enumerate(q2_questions, start=1):
    order_mapping[q['id']] = {
        'old_order': q['current_order'],
        'new_order': index
    }

# マッピング表示
print("📊 順序調整マッピング（最初の10問）:")
for i, q in enumerate(q2_questions[:10], start=1):
    mapping = order_mapping[q['id']]
    print(f"   {i:2d}. {q['id']}: order {mapping['old_order']} → {mapping['new_order']}")

print("\n📊 順序調整マッピング（最後の10問）:")
for i, q in enumerate(q2_questions[-10:], start=len(q2_questions)-9):
    mapping = order_mapping[q['id']]
    print(f"   {mapping['new_order']:2d}. {q['id']}: order {mapping['old_order']} → {mapping['new_order']}")

# バックアップ作成
timestamp = int(datetime.now().timestamp())
backup_path = MASTER_FILE.with_suffix(f".ts.backup-{timestamp}")
shutil.copy2(MASTER_FILE, backup_path)
print(f"\n✅ バックアップ作成: {backup_path.name}\n")

# 置換実行
print("🔧 question_order値を更新中...")
updated_content = content
changed_count = 0

for question_id, mapping in order_mapping.items():
    old_order = mapping['old_order']
    new_order = mapping['new_order']

    if old_order != new_order:
        # 該当問題のquestion_order行を置換
        # パターン: id: "Q2_xxx" の直後（数行以内）にある question_order: X, を探して置換
        pattern = rf'(id:\s*"{re.escape(question_id)}",[\s\S]{{0,300}}?question_order:\s*){old_order}(,)'
        replacement = rf'\g<1>{new_order}\g<2>'

        new_content, count = re.subn(pattern, replacement, updated_content, count=1)
        if count > 0:
            updated_content = new_content
            changed_count += 1

# ファイルを書き込み
MASTER_FILE.write_text(updated_content, encoding="utf-8")

print(f"✅ question_order値の更新完了")
print(f"   - 変更された問題数: {changed_count}/{len(q2_questions)}問")
print(f"   - 新しいorder範囲: 1 〜 {len(q2_questions)}\n")

# 検証
print("🔍 更新結果を検証中...")
verification_content = MASTER_FILE.read_text(encoding="utf-8")
verification_errors = 0

for question_id, mapping in order_mapping.items():
    pattern = rf'id:\s*"{re.escape(question_id)}",[\s\S]{{0,300}}?question_order:\s*(\d+)'
    match = re.search(pattern, verification_content)

    if match:
        actual_order = int(match.group(1))
        expected_order = mapping['new_order']

        if actual_order != expected_order:
            print(f"⚠️  {question_id}: 期待値 {expected_order}, 実際 {actual_order}")
            verification_errors += 1
    else:
        print(f"⚠️  {question_id}: question_order値が見つかりません")
        verification_errors += 1

if verification_errors == 0:
    print("✅ 検証完了: すべての問題のorder値が正しく更新されました\n")
else:
    print(f"❌ 検証エラー: {verification_errors}個の問題に不整合があります\n")
    exit(1)

print("📊 Phase 3完了: question_order値の1-70連番調整が完了しました")
print("次: Expoサーバーを再起動してアプリで動作確認してください")
