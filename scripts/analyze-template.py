#!/usr/bin/env python3

import json
import re

with open('src/data/master-questions.ts', 'r') as f:
    content = f.read()

# Q_T_001の部分を探す
pattern = r'"id":\s*"Q_T_001"[^}]*?"answer_template_json":\s*"([^"]*?)"[^}]*?"correct_answer_json"'
match = re.search(pattern, content)

if match:
    template_str = match.group(1)
    print(f'Template length: {len(template_str)}')
    
    # maxEntriesの位置を探す
    idx = template_str.find('maxEntries')
    if idx > -1:
        print(f'maxEntries found at position: {idx}')
        print(f'Content around maxEntries: ...{template_str[idx-20:idx+100]}...')
    
    # 重複の確認
    if '}"type' in template_str:
        print('Duplicate template detected!')
        idx2 = template_str.find('}"type')
        if idx2 > -1:
            print(f'Duplicate starts at position: {idx2}')
            print(f'Content: ...{template_str[idx2-10:idx2+50]}...')
            
            # 正しい終了位置
            correct_end = template_str.find('maxEntries\\":30}')
            if correct_end > -1:
                print(f'\nCorrect ending should be at position: {correct_end + 17}')
                print(f'Extra content starts at: {correct_end + 17}')
                print(f'Extra content: {template_str[correct_end + 17:correct_end + 67]}...')