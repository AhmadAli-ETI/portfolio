import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    for i, line in enumerate(lines):
        # Zeilen 600 bis 604 sind Index 599 bis 603
        if 599 <= i <= 603:
            continue
        f.write(line)
