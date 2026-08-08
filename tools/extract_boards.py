"""提取固件 board -> variant 映射"""
import json, os, glob

BOARDS_DIR = r'E:\FIRMWARE\boards'
OUTPUT = r'e:\meshroc\src\data\boardFirmwareMap.js'

targets = [
    'wiscore_rak4631', 'tbeam-s3-core', 't-beam-bpf', 't-echo', 't-deck', 'tlora-t3s3-v1',
    'heltec_mesh_pocket', 'heltec_v4', 'heltec_mesh_node_t114', 'heltec_vision_master_e213',
    'tracker-t1000-e', 'seeed-sensecap-indicator', 'seeed_solar_node', 'seeed_wio_tracker_L1', 'seeed_xiao_nrf52840_kit',
    'nano-g2-ultra', 'station-g2', 'station-g3',
    'ThinkNode-M1', 'ThinkNode-M3', 'crowpanel',
    'r1-neo', 'muzi-base',
    'unphone', 't-watch-s3'
]

results = {}
for t in targets:
    fp = os.path.join(BOARDS_DIR, f'{t}.json')
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            d = json.load(f)
        variant = (d.get('build') or {}).get('variant', '')
        mcu = (d.get('build') or {}).get('mcu', '')
        results[t] = {'variant': variant, 'mcu': mcu, 'name': d.get('name', ''), 'vendor': d.get('vendor', '')}

# 打映射表
lines = ["// 固件 board -> variant 映射（自动生成）\n"]
lines.append("// boardFileName -> { variant, name, vendor }\n")
lines.append("export const BOARD_MAP = {\n")
for k, v in sorted(results.items()):
    lines.append(f"  '{k}': {{ variant: '{v['variant']}', mcu: '{v['mcu']}', name: '{v['name']}', vendor: '{v['vendor']}' }},\n")
lines.append("};\n")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f'Written {len(results)} entries to {OUTPUT}')
for k, v in sorted(results.items()):
    print(f'  {k:35s} -> variant={v["variant"]}')
