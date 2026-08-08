"""检查 variant 目录存在性"""
import os

variants = ['ELECROW-ThinkNode-M1','ELECROW-ThinkNode-M3','ESP32-S3-WROOM-1-N16R8',
    'heltec_mesh_node_t114','heltec_mesh_pocket','heltec_v4','heltec_vision_master_e213',
    'muzi-base','nano-g2-ultra','r1-neo','esp32s3','seeed_solar_node',
    'seeed_wio_tracker_L1','seeed_xiao_nrf52840_kit','station-g2','station-g3',
    't-beam-bpf','t-deck','t-echo','t-watch-s3','tbeam-s3-core','tlora-t3s3-v1',
    'Seeed_T1000-E','unphone','WisCore_RAK4631_Board']

base = r'E:\FIRMWARE\variants'
for v in sorted(variants):
    found = []
    for platform in os.listdir(base):
        pdir = os.path.join(base, platform)
        if not os.path.isdir(pdir):
            continue
        for root, dirs, files in os.walk(pdir):
            if os.path.basename(root) == v:
                rel = os.path.relpath(root, base)
                found.append(rel)
    if found:
        print(f'{v:40s} -> {found[0]}')
    else:
        print(f'{v:40s} -> NOT FOUND')
