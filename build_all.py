# Generator script for LibreExcel Excel 365 Pro Suite
import os

print('Ready to generate files')

def write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote {filepath}')
