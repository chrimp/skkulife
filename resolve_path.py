import os

path = "./templates"

for _, _, files in os.walk(path):
    for file in files:
        if file.endswith(".html"):
            print(file)
            file_path = os.path.join(path, file)
            with open(file_path, 'r', encoding="utf-8") as f:
                content = f.read()
            content = content.replace('/html/static', '/static')
            with open(file_path, 'w', encoding="utf-8") as f:
                f.write(content)