#!/usr/bin/env python3

# Read the file
with open('src/data/master-questions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# The problematic string that appears after maxEntries:5}
bad_template = '"type":\\"ledger_entry\\",\\"fields\\":[{\\"name\\":\\"date\\",\\"label\\":\\"日付\\",\\"type\\":\\"text\\",\\"required\\":true,\\"placeholder\\":\\"例: 10/5\\"},{\\"name\\":\\"description\\",\\"label\\":\\"摘要\\",\\"type\\":\\"text\\",\\"required\\":true,\\"placeholder\\":\\"例: 現金売上\\"},{\\"name\\":\\"debit_amount\\",\\"label\\":\\"借方金額\\",\\"type\\":\\"number\\",\\"required\\":false,\\"format\\":\\"currency\\"},{\\"name\\":\\"credit_amount\\",\\"label\\":\\"貸方金額\\",\\"type\\":\\"number\\",\\"required\\":false,\\"format\\":\\"currency\\"},{\\"name\\":\\"balance\\",\\"label\\":\\"残高\\",\\"type\\":\\"number\\",\\"required\\":true,\\"format\\":\\"currency\\"}],\\"allowMultipleEntries\\":true,\\"maxEntries\\":10}'

# Replace the bad template with nothing
content = content.replace(bad_template, '')

# Similarly for tags_json
bad_tags = '"subcategory":\\"cash_deposit\\",\\"pattern\\":\\"現金過不足\\",\\"accounts\\":[\\"現金\\",\\"現金過不足\\"],\\"keywords\\":[\\"現金実査\\",\\"実際有高\\",\\"帳簿残高\\"],\\"examSection\\":1}'
content = content.replace(bad_tags, '')

# Write the file back
with open('src/data/master-questions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ JSON二重定義を完全に修正しました！")