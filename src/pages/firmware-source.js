import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconCpu,
  IconDownload,
  IconFileText,
} from '@site/src/components/mr';
import { VENDORS } from '@site/src/data/thirdPartyDevices';

// 固件 board 文件名（PlatformIO 构建目标 = build_pio env）
// 映射来源：E:\FIRMWARE\boards\*.json → filename（不含 .json）
const DEVICE_FW_MAP = {
  // RAK 全系列公用 RAK4631 核心
  'WisMesh Pocket V2':        { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Pocket Mini':      { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Tag':              { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Tap':              { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Board ONE':        { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh 1W Booster':       { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Repeater':         { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Repeater Mini':    { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh Ethernet Gateway': { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  'WisMesh WiFi Gateway':     { board: 'wiscore_rak4631', mcu: 'nRF52840' },
  // LILYGO
  'T-Beam S3-Core':    { board: 'tbeam-s3-core', mcu: 'ESP32-S3' },
  'T-Beam SUPREME':    { board: 't-beam-bpf', mcu: 'ESP32-S3' },
  'T-Echo':            { board: 't-echo', mcu: 'nRF52840' },
  'T-Deck':            { board: 't-deck', mcu: 'ESP32-S3' },
  'LoRa32 T3-S3':      { board: 'tlora-t3s3-v1', mcu: 'ESP32-S3' },
  // HELTEC
  'MeshPocket':          { board: 'heltec_mesh_pocket', mcu: 'nRF52840' },
  'LoRa32 V4':           { board: 'heltec_v4', mcu: 'ESP32' },
  'Mesh Node T114':      { board: 'heltec_mesh_node_t114', mcu: 'nRF52840' },
  'Vision Master E213':  { board: 'heltec_vision_master_e213', mcu: 'ESP32-S3' },
  // Seeed
  'Card Tracker T1000-E':   { board: 'tracker-t1000-e', mcu: 'nRF52840' },
  'SenseCAP Indicator':     { board: 'seeed-sensecap-indicator', mcu: 'ESP32-S3' },
  'SenseCAP Solar Node':    { board: 'seeed_solar_node', mcu: 'nRF52840' },
  'Wio Tracker L1':         { board: 'seeed_wio_tracker_L1', mcu: 'nRF52840' },
  'XIAO + Wio-SX1262':      { board: 'seeed_xiao_nrf52840_kit', mcu: 'nRF52840' },
  // B&Q
  'Nano G2 Ultra':  { board: 'nano-g2-ultra', mcu: 'nRF52840' },
  'Station G2':     { board: 'station-g2', mcu: 'ESP32-S3' },
  // Elecrow
  'ThinkNode M1': { board: 'ThinkNode-M1', mcu: 'nRF52840' },
  'ThinkNode M3': { board: 'ThinkNode-M3', mcu: 'nRF52840' },
  'CrowPanel':     { board: 'crowpanel', mcu: 'ESP32-S3' },
  // muzi works
  'R1 Neo':    { board: 'r1-neo', mcu: 'nRF52840' },
  'BASE Uno':  { board: 'muzi-base', mcu: 'nRF52840' },
  // Community
  'unPhone':     { board: 'unphone', mcu: 'ESP32-S3' },
  'T-Watch S3':  { board: 't-watch-s3', mcu: 'ESP32-S3' },
  // 自研四大平台（暂无固件 board）
  'MeshROC Backbone': { board: null, mcu: null },
  'MeshROC Gateway':  { board: null, mcu: null },
  'MeshROC Walk':     { board: null, mcu: null },
  'MeshROC Sensor':   { board: null, mcu: null },
};

const GITHUB = 'https://github.com/ye2f4/MeshROC';
const FW_SRC_ZIP = '/firmware/meshroc-firmware-source.zip'; // 用户手动放置

export default function FirmwareSourcePage() {
  return (
    <MrPage
      title="固件源码"
      description="MeshROC 固件源码下载：按设备分列的 PlatformIO 工程，完整包含库依赖，解压即可编译。"
    >
      <MrHeader
        eyebrow="Firmware Source"
        title="固件源码"
        lead="基于 Meshtastic 主线 fork 的独立分支，GPL-3.0 许可。每个设备有独立的 PlatformIO 构建目标（env），共用同一份源代码树。"
      />

      {/* 快速开始 */}
      <MrSection eyebrow="快速开始" title="一份源码，多设备编译">
        <div className="mr-card">
          <div className="mr-grid mr-grid--3" style={{ gap: '0.75rem' }}>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.78rem', fontWeight: 700, color: 'hsl(var(--orange))', margin: '0 0 0.4rem' }}>1</p>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                下载 <code style={{ background: 'hsl(var(--muted))', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.84rem' }}>meshroc-firmware-source.zip</code> 并解压到本地。
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.78rem', fontWeight: 700, color: 'hsl(var(--orange))', margin: '0 0 0.4rem' }}>2</p>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                安装 <a href="https://platformio.org/" target="_blank" rel="noopener noreferrer">PlatformIO IDE</a> 或命令行 <code style={{ background: 'hsl(var(--muted))', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.84rem' }}>pio</code>。
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.78rem', fontWeight: 700, color: 'hsl(var(--orange))', margin: '0 0 0.4rem' }}>3</p>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                在项目目录下执行 <code style={{ background: 'hsl(var(--muted))', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.84rem' }}>pio run -e {'<board>'}</code>，首次编译会自动下载库依赖。
              </p>
            </div>
          </div>
        </div>
      </MrSection>

      {/* 源码下载 */}
      <MrSection eyebrow="Download" eyebrowOrange title="下载完整固件源码">
        <div className="mr-grid mr-grid--2">
          <a
            href={FW_SRC_ZIP}
            className="mr-card mr-card--link"
            style={{ borderColor: 'hsl(var(--orange) / 0.4)', background: 'linear-gradient(135deg, hsl(var(--orange) / 0.06), transparent 60%)' }}
          >
            <div className="mr-card__icon mr-card__icon--orange">
              <IconDownload size={22} />
            </div>
            <h3 className="mr-h3">meshroc-firmware-source.zip</h3>
            <p className="mr-card__desc">
              完整固件源码、所有 board 定义、全部 variant 配置与库依赖声明。解压后即 PlatformIO 工程，支持约 75 款设备编译。
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', background: 'hsl(var(--muted))', borderRadius: '999px', padding: '0.16rem 0.55rem' }}>GPL-3.0</span>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', background: 'hsl(var(--muted))', borderRadius: '999px', padding: '0.16rem 0.55rem' }}>PlatformIO</span>
              <span style={{ fontFamily: 'var(--font-mono,monospace)', fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', background: 'hsl(var(--muted))', borderRadius: '999px', padding: '0.16rem 0.55rem' }}>~75 boards</span>
            </div>
            <span className="mr-card__more">下载源码包 ↓</span>
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-card mr-card--link"
          >
            <div className="mr-card__icon">
              <IconFileText size={22} />
            </div>
            <h3 className="mr-h3">GitHub 仓库</h3>
            <p className="mr-card__desc">
              也可直接 clone Git 仓库获取最新源码。欢迎提交 Issue、Pull Request 或参与文档翻译。
            </p>
            <span className="mr-card__more">前往 GitHub ↗</span>
          </a>
        </div>
      </MrSection>

      {/* 按厂商分组的设备固件列表 */}
      <MrSection eyebrow="Device List" title="设备编译目标一览">
        <p className="mr-p" style={{ margin: '0 0 1.5rem' }}>
          以下为所有已支持的设备及其固件构建目标名。下载源码后在项目根目录执行 <code style={{ background: 'hsl(var(--muted))', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.84rem' }}>pio run -e {'<board>'}</code> 即可编译。
        </p>

        {VENDORS.map((v) => {
          const hasDevices = v.devices.some((d) => DEVICE_FW_MAP[d.name]?.board);
          if (!hasDevices) return null;
          return (
            <div key={v.name} style={{ marginBottom: '2rem' }} className="mr-vendor">
              <div className="mr-vendor__head">
                <h3 className="mr-vendor__name">{v.name}</h3>
                <p className="mr-vendor__note">{v.note}</p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '0.75rem',
              }}>
                {v.devices.map((d) => {
                  const fw = DEVICE_FW_MAP[d.name];
                  if (!fw || !fw.board) return null;
                  return (
                    <div key={d.name} style={{
                      borderRadius: 'var(--radius)',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                      padding: '0.9rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'hsl(var(--btn-primary) / 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <IconCpu size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{d.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.15rem 0 0', fontFamily: 'var(--font-mono,monospace)' }}>
                          pio run -e <span style={{ color: 'hsl(var(--orange))', fontWeight: 700 }}>{fw.board}</span>
                        </p>
                      </div>
                      <div style={{
                        flexShrink: 0,
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono,monospace)',
                        fontWeight: 600,
                        color: 'hsl(var(--muted-foreground))',
                        background: 'hsl(var(--muted))',
                        borderRadius: '999px',
                        padding: '0.15rem 0.5rem',
                      }}>
                        {fw.mcu}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 自研设备（暂无固件目标） */}
        <div className="mr-vendor" style={{ opacity: 0.7 }}>
          <div className="mr-vendor__head">
            <h3 className="mr-vendor__name">MeshROC 自研平台</h3>
            <p className="mr-vendor__note">固件开发中，板级定义即将加入</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '0.75rem',
          }}>
            {['MeshROC Backbone', 'MeshROC Gateway', 'MeshROC Walk', 'MeshROC Sensor'].map((name) => (
              <div key={name} style={{
                borderRadius: 'var(--radius)',
                border: '1px dashed hsl(var(--border))',
                background: 'hsl(var(--muted) / 0.3)',
                padding: '0.9rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'hsl(var(--muted))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IconCpu size={18} style={{ opacity: 0.4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.15rem 0 0' }}>
                    开发中
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="预编译固件" eyebrowOrange title="获取编译好的固件">
        <p className="mr-p">
          如果你只想刷写设备而不需要自行编译，请前往下载中心获取预编译的 .bin 固件文件，配合网页刷写器一键烧录。
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <a href="/download" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.3rem',
            borderRadius: 'var(--radius)',
            border: '1px solid hsl(var(--btn-primary) / 0.4)',
            background: 'hsl(var(--btn-primary))',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            <IconDownload size={18} /> 下载中心
          </a>
          <a href="/flash" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.3rem',
            borderRadius: 'var(--radius)',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>
            <IconCpu size={18} /> 网页刷写器
          </a>
        </div>
      </MrSection>

      <MrCTA
        title="参与固件开发"
        desc="欢迎为 MeshROC 固件贡献代码、文档或 board 定义。访问 GitHub 仓库提交 Issue 或 Pull Request。"
        actions={[
          { label: 'GitHub 仓库', href: GITHUB },
          { label: '固件系统概览', to: '/firmware', variant: 'mr-btn--ghost' },
          { label: '加入社区', to: '/community', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
