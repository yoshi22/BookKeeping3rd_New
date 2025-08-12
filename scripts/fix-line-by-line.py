#!/usr/bin/env python3

# Read the file
with open('src/data/master-questions.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Process each line
for i in range(len(lines)):
    line = lines[i]
    
    # Fix answer_template_json lines
    if '"answer_template_json":' in line and '"maxEntries":5}"type":' in line:
        # Find where the correct JSON ends and remove everything after
        end_pos = line.find('"maxEntries":5}') + len('"maxEntries":5}')
        # Find the closing quote for the JSON string field
        remaining = line[end_pos:]
        if '"type":' in remaining:
            # Remove the bad part
            bad_start = remaining.find('"type":')
            # Find where the field should end (look for the next ", at the end)
            field_end = remaining.rfind('",')
            if field_end > bad_start:
                # Keep only the good part
                lines[i] = line[:end_pos] + '",\n'
                print(f"Fixed line {i+1}")
    
    # Fix tags_json lines  
    if '"tags_json":' in line and '"examSection":1}"subcategory":' in line:
        # Find where the correct JSON ends
        end_pos = line.find('"examSection":1}') + len('"examSection":1}')
        # Find the closing quote for the JSON string field
        remaining = line[end_pos:]
        if '"subcategory":' in remaining:
            # Remove the bad part
            bad_start = remaining.find('"subcategory":')
            # Find where the field should end
            field_end = remaining.rfind('",')
            if field_end > bad_start:
                # Keep only the good part
                lines[i] = line[:end_pos] + '",\n'
                print(f"Fixed tags line {i+1}")

# Write the file back
with open('src/data/master-questions.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n✅ Line-by-line修正完了！")