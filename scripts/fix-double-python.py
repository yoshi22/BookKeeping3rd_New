#!/usr/bin/env python3

import re

# Read the file
with open('src/data/master-questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix answer_template_json double definitions
# Pattern: after "maxEntries":5} there's unescaped "type": followed by ledger_entry template
pattern1 = r'("maxEntries":5\})"type":\\\"ledger_entry\\\"[^}]*\\\"maxEntries\\\":10\}'
content = re.sub(pattern1, r'\1', content)

# Fix tags_json double definitions  
# Pattern: after "examSection":1} there's unescaped "subcategory": followed by duplicate tags
pattern2 = r'("examSection":1\})"subcategory":\\\"[^}]*\\\"examSection\\\":1\}'
content = re.sub(pattern2, r'\1', content)

# Write the file back
with open('src/data/master-questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ JSON二重定義を修正しました！")