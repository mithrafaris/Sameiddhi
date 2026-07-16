import os
import re

directories = ['app', 'components', 'lib', 'scripts']
files_to_check = ['README.md']

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    new_content = content.replace('Preethika', 'Samriddhi')
    new_content = new_content.replace('preethika', 'samriddhi')
    new_content = new_content.replace('PREETHIKA', 'SAMRIDDHI')

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.css', '.md')):
                replace_in_file(os.path.join(root, file))

for f in files_to_check:
    if os.path.exists(f):
        replace_in_file(f)
