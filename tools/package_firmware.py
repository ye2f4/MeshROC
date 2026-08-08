"""
打包 MeshROC 固件源码为完整 PlatformIO 工程 ZIP。

用法：python tools/package_firmware.py
输出：static/firmware/meshroc-firmware-source.zip

排除项：.pio/, .git/, bin/（编译产物），.gitignore, __pycache__/
"""
import os
import sys
import zipfile
from pathlib import Path

FIRMWARE_DIR = Path(r'E:\FIRMWARE')
OUTPUT_DIR = Path(r'e:\meshroc\static\firmware')
OUTPUT_NAME = 'meshroc-firmware-source.zip'

EXCLUDE = {
    '.pio',
    '.git',
    'bin',           # 预编译固件不打包在源码中
    '__pycache__',
    '.gitignore',
    '.vscode',
    'node_modules',
}

EXCLUDE_SUFFIX = {'.pyc', '.pyo', '.pyd', '.DS_Store', 'Thumbs.db'}

def should_include(root_parts, filename):
    """检查文件/目录是否应包含在 ZIP 中"""
    if filename in EXCLUDE:
        return False
    # 检查路径中是否包含排除目录
    for part in root_parts:
        if part in EXCLUDE:
            return False
    suffix = os.path.splitext(filename)[1].lower()
    if suffix in EXCLUDE_SUFFIX:
        return False
    return True

def pack():
    output = OUTPUT_DIR / OUTPUT_NAME
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    counts = {'dirs': 0, 'files': 0}
    
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, dirs, files in os.walk(FIRMWARE_DIR):
            # 过滤目录
            dirs[:] = [d for d in dirs if d not in EXCLUDE]
            
            rel = os.path.relpath(root, FIRMWARE_DIR)
            parts = rel.split(os.sep) if rel != '.' else []
            
            for f in files:
                if not should_include(parts, f):
                    continue
                fp = os.path.join(root, f)
                arcname = os.path.join(rel, f) if rel != '.' else f
                arcname = arcname.replace('\\', '/')  # ZIP 统一用 /
                zf.write(fp, arcname)
                counts['files'] += 1
            counts['dirs'] += 1
    
    size_mb = os.path.getsize(output) / (1024 * 1024)
    print(f'Packed: {output}')
    print(f'Size: {size_mb:.1f} MB')
    print(f'Dirs: {counts["dirs"]}, Files: {counts["files"]}')
    return output

if __name__ == '__main__':
    pack()
