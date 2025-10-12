#!/usr/bin/env python3
"""
Q3問題の並び替えスクリプト (Python版)

現在の順序: Q3_TB_001 → Q3_CTB_001 → Q3_FS_001 → Q3_TB_002 → ...
目標の順序: Q3_TB_001～020 → Q3_CTB_001～015 → Q3_FS_001～015
"""

import re
import sys
from pathlib import Path

MASTER_QUESTIONS_PATH = Path(__file__).parent.parent.parent / 'src' / 'data' / 'master-questions.ts'

def extract_question_objects(content):
    """問題オブジェクトをすべて抽出する"""
    # 問題オブジェクトのパターン: `{` で始まり `},` で終わる（または最後の `}`）
    # id フィールドを含む

    # 各問題を検出するための正規表現
    pattern = r'(\{\s*id:\s*"(Q3_[A-Z]+_\d+)".*?\},?)'

    questions = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Q3問題のID行を検出
        if 'id: "Q3_TB_' in line or 'id: "Q3_CTB_' in line or 'id: "Q3_FS_' in line:
            match = re.search(r'id: "(Q3_[A-Z]+_\d+)"', line)
            if match:
                question_id = match.group(1)

                # 前の行から `{` を探す
                start_line = i - 1
                while start_line >= 0 and not lines[start_line].strip():
                    start_line -= 1

                if lines[start_line].strip() == '{':
                    # ブレースをカウントして終了行を見つける
                    brace_count = 0
                    end_line = None

                    for j in range(start_line, len(lines)):
                        for char in lines[j]:
                            if char == '{':
                                brace_count += 1
                            elif char == '}':
                                brace_count -= 1

                        if brace_count == 0:
                            end_line = j
                            break

                    if end_line is not None:
                        question_lines = lines[start_line:end_line + 1]
                        questions.append({
                            'id': question_id,
                            'start_line': start_line,
                            'end_line': end_line,
                            'lines': question_lines
                        })
                        i = end_line + 1
                        continue

        i += 1

    return questions

def main():
    print("Q3問題の並び替えを開始します (Python版)...\n")

    # ファイルを読み込む
    content = MASTER_QUESTIONS_PATH.read_text(encoding='utf-8')
    lines = content.split('\n')

    print(f"ファイル読み込み完了: {len(lines)}行\n")

    # Q3問題を抽出
    questions = extract_question_objects(content)

    print(f"Q3問題を{len(questions)}問検出しました:\n")

    # カテゴリ別に分類
    tb_questions = [q for q in questions if q['id'].startswith('Q3_TB_')]
    ctb_questions = [q for q in questions if q['id'].startswith('Q3_CTB_')]
    fs_questions = [q for q in questions if q['id'].startswith('Q3_FS_')]

    print(f"- Q3_TB (試算表穴埋め): {len(tb_questions)}問")
    print(f"- Q3_CTB (合計試算表): {len(ctb_questions)}問")
    print(f"- Q3_FS (財務諸表): {len(fs_questions)}問\n")

    # 各カテゴリ内でIDでソート
    tb_questions.sort(key=lambda q: q['id'])
    ctb_questions.sort(key=lambda q: q['id'])
    fs_questions.sort(key=lambda q: q['id'])

    # TB → CTB → FS の順に結合
    reordered_questions = tb_questions + ctb_questions + fs_questions

    print("並び替え後の順序:")
    print(f"1-20: {', '.join([q['id'] for q in reordered_questions[0:20]])}")
    print(f"21-35: {', '.join([q['id'] for q in reordered_questions[20:35]])}")
    print(f"36-50: {', '.join([q['id'] for q in reordered_questions[35:50]])}\n")

    # 元のファイルでの最初と最後のQ3問題の位置を特定
    first_q3_line = questions[0]['start_line']
    last_q3_line = questions[-1]['end_line']

    print(f"元のファイルでのQ3問題範囲: {first_q3_line}行 ～ {last_q3_line}行\n")

    # 新しいコンテンツを構築
    before_q3 = lines[:first_q3_line]
    after_q3 = lines[last_q3_line + 1:]

    reordered_lines = []
    for q in reordered_questions:
        reordered_lines.extend(q['lines'])

    new_lines = before_q3 + reordered_lines + after_q3
    new_content = '\n'.join(new_lines)

    # ファイルに書き戻す
    MASTER_QUESTIONS_PATH.write_text(new_content, encoding='utf-8')

    print("✅ Q3問題の並び替えが完了しました！")
    print(f"ファイル: {MASTER_QUESTIONS_PATH}\n")

    # 検証: Q3問題の数が変わっていないことを確認
    new_content_check = MASTER_QUESTIONS_PATH.read_text(encoding='utf-8')
    new_lines_check = new_content_check.split('\n')
    new_q3_count = sum(1 for line in new_lines_check if 'id: "Q3_TB_' in line or 'id: "Q3_CTB_' in line or 'id: "Q3_FS_' in line)

    print(f"検証: Q3問題数 {len(questions)} → {new_q3_count}")

    if new_q3_count == len(questions):
        print("✅ 問題数が一致しています\n")
        return 0
    else:
        print("❌ 警告: 問題数が変わっています！\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
