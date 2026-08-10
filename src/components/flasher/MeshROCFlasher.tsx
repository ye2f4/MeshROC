/**
 * MeshROCFlasher — 由 Meshtastic web-flasher (Nuxt/Vue) 移植而来的 React/TSX 刷写器。
 *
 * 重新实现（非内联挂载）以便直接集成进 Docusaurus，无 iframe、无外部引用。
 * 刷写沿用原实现的 esptool-js + Web Serial；固件清单数据源保持可配置（见 FLASHER_CONFIG）。
 *
 * 注意：
 *  - Web Serial / esptool 仅在浏览器中可用，相关依赖用动态 import 在事件回调里加载，避免 SSG 报错。
 *  - 本期实现 ESP32 / ESP8266（esptool）的完整刷写 + 串口监视；NRF52 / STM32 给出下载与说明。
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import '@/css/flasher.css';

/* ------------------------------------------------------------------ *
 * 可配置数据源（rebrand 重点：把下面三项指向 MeshROC 自有固件主机即可）
 * ------------------------------------------------------------------ */
const FLASHER_CONFIG = {
  /** 设备硬件清单（离线兜底在 /data/hardware-list.json） */
  deviceApi: 'https://api.meshtastic.org/resource/deviceHardware',
  deviceFallback: '/data/hardware-list.json',
  /** 固件版本列表（上游返回 releases.stable/beta/dev[].id） */
  firmwareListApi: 'https://api.meshtastic.org/github/firmware/list',
  /** 离线固件版本清单兜底 */
  firmwareListFallback: '/data/firmware-list.json',
  /** 固件目录基址：<base><cleanVersion>/ 下含 firmware-<board>-<cleanVersion>.mt.json 与各 bin */
  firmwareBase: 'https://raw.githubusercontent.com/meshtastic/meshtastic.github.io/master/firmware-',
};

/** 去掉版本号前的 v 前缀（v2.7.26.abc → 2.7.26.abc） */
const cleanVersion = (v: string) => (v || '').replace(/^v/, '');

/* ---------------------------- 类型 ---------------------------- */
interface Hardware {
  name: string;
  target?: string;
  hwModel?: number;
  espChip?: string | null;
  nrfChip?: string | null;
  variantToFriendlyName?: Record<string, string>;
}

interface DeviceHardware {
  hwModel?: number;
  hwModelSlug?: string;
  supportLevel?: 'stable' | 'beta' | 'dev' | string;
  ownership?: string;
  hardware: Hardware;
}

/** 上游版本列表：releases.stable/beta/dev 均为 { id, title }[] */
interface FirmwareListResponse {
  releases?: {
    stable?: { id: string; title?: string }[];
    beta?: { id: string; title?: string }[];
    dev?: { id: string; title?: string }[];
  };
}

/** 发布清单（firmware-<cleanVersion>.json）：只列 board，不含 bin */
interface ReleaseTarget {
  board: string;
  platform: string;
}
interface ReleaseManifest {
  version: string;
  targets: ReleaseTarget[];
}

/** 单个 board 的目标清单（firmware-<board>-<cleanVersion>.mt.json）：含真实 bin 与分区表 */
interface TargetManifestFile {
  name: string;
  md5?: string;
  bytes?: number;
  part_name?: string;
}
interface Partition {
  name: string;
  type: string;
  subtype: string;
  offset: string;
  size: string;
  flags: string;
}
interface TargetManifest {
  version?: string;
  files: TargetManifestFile[];
  part: Partition[];
  [k: string]: any;
}

/* ---------------------------- 工具 ---------------------------- */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PLATFORM_LABEL: Record<string, string> = {
  esp32: 'ESP32',
  esp32c3: 'ESP32-C3',
  esp32s3: 'ESP32-S3',
  esp8266: 'ESP8266',
  nrf52: 'nRF52',
  nrf52840: 'nRF52840',
  stm32: 'STM32',
};

function platformOf(d: DeviceHardware): 'esp' | 'nrf' | 'stm32' | 'other' {
  const h = d?.hardware || ({} as Hardware);
  if (h.espChip) return 'esp';
  if (h.nrfChip) return 'nrf';
  const t = (h.target || '').toLowerCase();
  if (t.includes('nrf')) return 'nrf';
  if (t.includes('stm32')) return 'stm32';
  return 'other';
}

/** 把离线硬件清单条目（displayName/platformioTarget/architecture）归一化为组件统一的 DeviceHardware 结构 */
function normalizeDevice(o: any): DeviceHardware {
  if (o && o.hardware) return o as DeviceHardware;
  const arch = (o?.architecture || '').toLowerCase();
  const espChip = arch === 'esp32' || arch === 'esp8266' ? arch : undefined;
  const nrfChip = arch.startsWith('nrf') ? arch : undefined;
  return {
    hwModel: o?.hwModel,
    hwModelSlug: o?.hwModelSlug,
    supportLevel: o?.supportLevel,
    hardware: {
      name: o?.displayName || o?.hwModelSlug || `设备 ${o?.hwModel ?? ''}`,
      target: o?.platformioTarget,
      espChip,
      nrfChip,
    },
  };
}

/** 从上游 releases 结构收集去重、降序的版本号列表 */
function collectVersions(data?: FirmwareListResponse): string[] {
  const r = data?.releases;
  if (!r) return [];
  const ids = [...(r.stable || []), ...(r.beta || []), ...(r.dev || [])].map((x) => x.id);
  return [...new Set(ids)].sort().reverse();
}

/* ---------------------------- 组件 ---------------------------- */
export default function MeshROCFlasher() {
  const [devices, setDevices] = useState<DeviceHardware[]>([]);
  const [deviceErr, setDeviceErr] = useState<string>('');
  const [selected, setSelected] = useState<DeviceHardware | null>(null);

  const [versions, setVersions] = useState<string[]>([]);
  const [versionErr, setVersionErr] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  const [manifest, setManifest] = useState<TargetManifest | null>(null);
  const [manifestErr, setManifestErr] = useState<string>('');

  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const flashTermRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const workerRef = useRef<{ cancel: () => void } | null>(null);

  const appendLog = useCallback((line: string) => {
    setLog((prev) => [...prev, line]);
  }, []);

  /* 设备清单 */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(FLASHER_CONFIG.deviceApi, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const list: DeviceHardware[] = (Array.isArray(data) ? data : (data.devices ?? [])).map(normalizeDevice);
        list.sort((a, b) => (a.hardware?.name || '').localeCompare(b.hardware?.name || ''));
        setDevices(list);
      } catch (e) {
        // 离线兜底
        try {
          const res = await fetch(FLASHER_CONFIG.deviceFallback, { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (cancelled) return;
          const list: DeviceHardware[] = (Array.isArray(data) ? data : (data.devices ?? [])).map(normalizeDevice);
          list.sort((a, b) => (a.hardware?.name || '').localeCompare(b.hardware?.name || ''));
          setDevices(list);
          setDeviceErr('（使用离线设备清单）');
        } catch (e2) {
          if (!cancelled) setDeviceErr('无法加载设备清单，请检查网络或离线清单。');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 版本列表 */
  useEffect(() => {
    let cancelled = false;
    const loadFrom = async (url: string): Promise<string[]> => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FirmwareListResponse = await res.json();
      return collectVersions(data);
    };
    (async () => {
      try {
        const vers = await loadFrom(FLASHER_CONFIG.firmwareListApi);
        if (cancelled) return;
        if (vers.length) {
          setVersions(vers);
          return;
        }
        throw new Error('empty');
      } catch (e) {
        // 离线兜底
        try {
          const vers = await loadFrom(FLASHER_CONFIG.firmwareListFallback);
          if (cancelled) return;
          if (vers.length) {
            setVersions(vers);
            setVersionErr('（使用离线固件版本清单）');
            return;
          }
          throw new Error('empty');
        } catch (e2) {
          if (!cancelled) setVersionErr('无法加载固件版本列表（离线清单也不可用）。');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 选中版本 + 设备后，加载该 board 的目标清单（含真实 bin 与分区表） */
  useEffect(() => {
    if (!version || !selected?.hardware?.target || platformOf(selected) !== 'esp') {
      setManifest(null);
      setManifestErr('');
      return;
    }
    let cancelled = false;
    setManifestErr('');
    setManifest(null);
    (async () => {
      try {
        const clean = cleanVersion(version);
        const board = selected.hardware.target as string;
        const url = `${FLASHER_CONFIG.firmwareBase}${clean}/firmware-${board}-${clean}.mt.json`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: TargetManifest = await res.json();
        if (!cancelled) setManifest(data);
      } catch (e) {
        if (!cancelled)
          setManifestErr(
            `无法加载 ${selected?.hardware?.target} 的分区清单（该设备/版本可能无浏览器刷写支持，或网络受限）。`,
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version, selected]);

  /* 刷写日志终端 */
  useEffect(() => {
    let term: any;
    let cancelled = false;
    (async () => {
      if (!flashTermRef.current) return;
      const { Terminal } = await import('@xterm/xterm');
      await import('@xterm/xterm/css/xterm.css');
      if (cancelled) return;
      term = new Terminal({
        fontSize: 13,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        theme: { background: '#0b0f17', foreground: '#d7e3d8' },
        convertEol: true,
      });
      term.open(flashTermRef.current);
      termRef.current = term;
    })();
    return () => {
      cancelled = true;
      term?.dispose?.();
      termRef.current = null;
    };
  }, []);

  const tWrite = (s: string) => {
    try {
      termRef.current?.write?.(s);
    } catch {
      /* noop */
    }
  };

  const onFlash = async () => {
    if (!selected || !manifest) return;
    const platform = platformOf(selected);
    if (platform !== 'esp') {
      appendLog('该平台（NRF/STM32）暂不支持浏览器内刷写，请使用 UF2 / DFU 方式或下载固件后用本地工具刷写。');
      return;
    }
    setBusy(true);
    setDone(false);
    setProgress(0);
    setPhase('连接设备…');
    appendLog('> 正在请求串口权限…');
    try {
      const { ESPLoader, Transport } = await import('esptool-js');
      // @ts-ignore - 浏览器全局
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      const transport = new Transport(port, true);
      const espLoader = new ESPLoader({ transport, baudrate: 115200, terminal: termRef.current });

      setPhase('识别芯片…');
      await espLoader.main();
      const chip = (espLoader as any).chipName || 'ESP';
      appendLog(`> 已连接：${chip}`);

      setPhase('加速…');
      try {
        await espLoader.changeBaudrate(921600);
      } catch {
        /* keep 115200 */
      }

      const clean = cleanVersion(version);
      const firmwareBaseUrl = `${FLASHER_CONFIG.firmwareBase}${clean}/`;
      const partByName: Record<string, Partition> = Object.fromEntries(
        (manifest.part || []).map((p) => [p.name, p]),
      );
      const fileArray = (manifest.files || [])
        .map((f) => {
          const part = partByName[f.part_name || ''] || (manifest.part || [])[0];
          const address = part ? parseInt(part.offset, 16) : 0;
          return { path: firmwareBaseUrl + f.name, address };
        })
        .filter((f) => f.path && !Number.isNaN(f.address))
        .sort((a, b) => a.address - b.address);
      const flashOptions = {
        fileArray,
        flashSize: 'keep',
        eraseAll: false,
        flashMode: 'keep',
        flashFreq: 'keep',
        deviceManufacturer: 'MeshROC',
        reportProgress: (fileIndex: number, written: number, total: number) => {
          const pct = total > 0 ? Math.round((written / total) * 100) : 0;
          setProgress(pct);
          setPhase(`写入固件 ${pct}%`);
        },
      };

      setPhase('写入固件…');
      appendLog('> 开始写入固件，请勿断开设备…');
      await espLoader.writeFlash(flashOptions);

      appendLog('\n> 固件刷写完成！正在重启设备…');
      try {
        transport.setRTS(true);
        await sleep(100);
        transport.setRTS(false);
        await sleep(100);
        transport.disconnect();
      } catch {
        /* noop */
      }
      setDone(true);
      setPhase('完成');
      setProgress(100);
    } catch (e: any) {
      appendLog(`\n! 刷写失败：${e?.message || e}`);
      setPhase('失败');
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------- 渲染 ---------------------------- */
  return (
    <div className="mr-flasher">
      <header className="mr-flasher__head">
        <img src="/img/logotext.webp" alt="互联之域 MeshROC" className="mr-flasher__logo" />
        <div>
          <h1 className="mr-flasher__title">MeshROC 固件刷写器</h1>
          <p className="mr-flasher__sub">兼容 Meshtastic 固件的浏览器内刷写工具 · 无需安装驱动</p>
        </div>
      </header>

      <div className="mr-flasher__grid">
        {/* 设备选择 */}
        <section className="mr-flasher__card">
          <h2 className="mr-flasher__h2">1 · 选择设备</h2>
          {deviceErr && <p className="mr-flasher__note">{deviceErr}</p>}
          {devices.length === 0 ? (
            <p className="mr-flasher__muted">加载设备清单中…</p>
          ) : (
            <div className="mr-flasher__list">
              {devices.map((d, i) => {
                const plat = platformOf(d);
                const active = selected === d;
                return (
                  <button
                    key={`${d.hardware?.name}-${i}`}
                    className={`mr-flasher__item ${active ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelected(d);
                      setDone(false);
                    }}
                  >
                    <span className="mr-flasher__item-name">{d.hardware?.name || '未知设备'}</span>
                    <span className="mr-flasher__badge">
                      {PLATFORM_LABEL[(d.hardware as any)?.espChip || (d.hardware as any)?.nrfChip || ''] || plat}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 固件选择 */}
        <section className="mr-flasher__card">
          <h2 className="mr-flasher__h2">2 · 选择固件版本</h2>
          {versionErr && <p className="mr-flasher__note">{versionErr}</p>}
          {versions.length === 0 ? (
            <p className="mr-flasher__muted">加载版本列表…</p>
          ) : (
            <select
              className="mr-flasher__select"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              <option value="">— 请选择版本 —</option>
              {versions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}

          {manifestErr && <p className="mr-flasher__note">{manifestErr}</p>}
          {selected && platformOf(selected) !== 'esp' && (
            <p className="mr-flasher__note">
              该平台（NRF / STM32）暂不支持浏览器内刷写，请使用 UF2 / DFU 方式。
            </p>
          )}
          {manifest && (
            <div className="mr-flasher__manifest">
              <p className="mr-flasher__muted">共 {manifest.files.length} 个分区文件已就绪</p>
            </div>
          )}

          <button
            className="mr-flasher__flash"
            disabled={!selected || !manifest || busy}
            onClick={onFlash}
          >
            {busy ? phase : '开始刷写'}
          </button>

          {(busy || done || progress > 0) && (
            <div className="mr-flasher__progress">
              <div className="mr-flasher__bar" style={{ width: `${progress}%` }} />
            </div>
          )}
        </section>
      </div>

      {/* 刷写日志 */}
      <section className="mr-flasher__card mr-flasher__term-card">
        <h2 className="mr-flasher__h2">刷写日志</h2>
        <div ref={flashTermRef} className="mr-flasher__term" />
        {log.length > 0 && (
          <pre className="mr-flasher__log">
            {log.join('\n')}
          </pre>
        )}
      </section>

      <SerialMonitor />
    </div>
  );
}

/* ---------------------- 串口监视器（独立 xterm） ---------------------- */
function SerialMonitor() {
  const [connected, setConnected] = useState(false);
  const [buffer, setBuffer] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const lockedRef = useRef(false);
  const lastLenRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!containerRef.current) return;
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      await import('@xterm/xterm/css/xterm.css');
      if (cancelled) return;
      const term = new Terminal({
        fontSize: 13,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        theme: { background: '#0b0f17', foreground: '#d7e3d8' },
        convertEol: true,
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      try {
        fit.fit();
      } catch {
        /* noop */
      }
      termRef.current = term;
    })();
    const onResize = () => {
      try {
        termRef.current?.fit?.();
      } catch {
        /* noop */
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      termRef.current?.dispose?.();
      termRef.current = null;
    };
  }, []);

  // 新数据写入 xterm
  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    const raw = buffer.join('');
    if (raw.length < lastLenRef.current) {
      term.clear();
      lastLenRef.current = 0;
    }
    const added = raw.slice(lastLenRef.current);
    if (added) term.write(added);
    lastLenRef.current = raw.length;
  }, [buffer]);

  const readLoop = async (port: any, reader: any) => {
    const decoder = new TextDecoder();
    lockedRef.current = true;
    while (lockedRef.current) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const decoded = decoder.decode(value, { stream: true });
        const normalized = decoded.replace(/\r/g, '');
        setBuffer((prev) => {
          if (normalized.includes('\n')) {
            const parts = normalized.split('\n');
            let next = [...prev];
            parts.forEach((line, idx) => {
              if (idx === 0) {
                next[next.length - 1] = (next[next.length - 1] || '') + line;
              } else {
                next.push(line);
              }
            });
            return next;
          }
          const last = next_line(prev);
          return [...prev.slice(0, -1), last + normalized];
        });
      }
      await new Promise((r) => setTimeout(r, 5));
    }
  };

  const connect = async () => {
    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort({});
      await port.open({ baudRate: 115200 });
      portRef.current = port;
      setConnected(true);
      const reader = port.readable.getReader();
      readerRef.current = reader;
      readLoop(port, reader);
    } catch (e: any) {
      setBuffer((p) => [...p, `! 连接失败：${e?.message || e}`]);
    }
  };

  const disconnect = () => {
    lockedRef.current = false;
    try {
      readerRef.current?.cancel?.();
      portRef.current?.forget?.();
    } catch {
      /* noop */
    }
    setConnected(false);
  };

  const clear = () => {
    setBuffer([]);
    lastLenRef.current = 0;
    try {
      termRef.current?.clear?.();
    } catch {
      /* noop */
    }
  };

  const copy = () => navigator.clipboard?.writeText(buffer.join('\n'));

  const save = () => {
    const blob = new Blob([buffer.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meshroc-log-${new Date().toISOString().replace(/:/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mr-flasher__card mr-flasher__term-card">
      <div className="mr-flasher__monitor-head">
        <h2 className="mr-flasher__h2">串口监视器</h2>
        <div className="mr-flasher__monitor-actions">
          <button className="mr-flasher__mini" title="清空" onClick={clear}>清空</button>
          <button className="mr-flasher__mini" title="复制" onClick={copy}>复制</button>
          <button className="mr-flasher__mini" title="保存" onClick={save}>保存</button>
          {connected ? (
            <button className="mr-flasher__mini is-danger" onClick={disconnect}>断开</button>
          ) : (
            <button className="mr-flasher__mini is-ok" onClick={connect}>连接</button>
          )}
        </div>
      </div>
      <div ref={containerRef} className="mr-flasher__term" />
    </section>
  );
}

function next_line(prev: string[]): string {
  if (prev.length === 0) return '';
  return prev[prev.length - 1] || '';
}
