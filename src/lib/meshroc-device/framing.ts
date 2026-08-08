/**
 * 线帧封装 + Web Serial 传输层（"我的形式"）。
 *
 * 帧格式（与 MeshROC / Meshtastic 固件 StreamAPI 完全一致）：
 *   [ START1(0x94) | START2(0xC3) | lenHi | lenLo | <protobuf payload> ]
 * 无转义、无停止符；protobuf 自解释，按长度截取即可。
 */

import { decodeMessage, encodeMessage } from './protobuf';

const START1 = 0x94;
const START2 = 0xc3;

/** 把一段 protobuf 载荷包成完整串口帧。 */
export function frameToRadio(payload: Uint8Array): Uint8Array {
  const out = new Uint8Array(payload.length + 4);
  out[0] = START1;
  out[1] = START2;
  out[2] = (payload.length >> 8) & 0xff;
  out[3] = payload.length & 0xff;
  out.set(payload, 4);
  return out;
}

export function encodeToRadio(obj: Record<string, any>): Uint8Array {
  return frameToRadio(encodeMessage('ToRadio', obj));
}

/** 流式扫描器：不断喂入串口字节，吐出完整的 FromRadio 载荷。 */
export class FrameScanner {
  private buf = new Uint8Array(0);

  push(chunk: Uint8Array): Uint8Array[] {
    const merged = new Uint8Array(this.buf.length + chunk.length);
    merged.set(this.buf, 0);
    merged.set(chunk, this.buf.length);
    this.buf = merged;

    const out: Uint8Array[] = [];
    let i = 0;
    while (i + 4 <= this.buf.length) {
      if (this.buf[i] === START1 && this.buf[i + 1] === START2) {
        const len = (this.buf[i + 2] << 8) | this.buf[i + 3];
        if (i + 4 + len <= this.buf.length) {
          out.push(this.buf.slice(i + 4, i + 4 + len));
          i += 4 + len;
          continue;
        }
      }
      i++;
    }
    this.buf = this.buf.slice(i);
    return out;
  }
}

export interface SerialHandle {
  write: (bytes: Uint8Array) => Promise<void>;
  close: () => Promise<void>;
}

function getSerial(): any {
  // navigator.serial 在部分 TS 配置下无类型，运行时以 any 处理
  return (navigator as any).serial;
}

/**
 * 打开 Web Serial 连接，持续读取并回调每个 FromRadio 载荷。
 * 需要 HTTPS 或 localhost，且浏览器支持 Web Serial（Chrome / Edge 桌面版）。
 */
export async function openWebSerial(onFrame: (bytes: Uint8Array) => void): Promise<SerialHandle> {
  const serial = getSerial();
  if (!serial) {
    throw new Error('当前浏览器不支持 Web Serial（请使用 Chrome / Edge 桌面版，并通过 https 或 localhost 访问）。');
  }
  const port = await serial.requestPort();
  await port.open({ baudRate: 115200 });

  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();
  const scanner = new FrameScanner();

  let closed = false;
  (async () => {
    try {
      while (!closed) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value && value.length) {
          for (const frame of scanner.push(value)) {
            try {
              onFrame(frame);
            } catch (e) {
              // 单帧解析失败不应中断整个流
              console.warn('[MeshROC] 解析 FromRadio 失败', e);
            }
          }
        }
      }
    } catch (e) {
      // reader 被 cancel 时抛出，正常现象
    }
  })();

  return {
    async write(bytes: Uint8Array) {
      await writer.write(bytes);
    },
    async close() {
      closed = true;
      try { await reader.cancel(); } catch { /* noop */ }
      try { writer.releaseLock(); } catch { /* noop */ }
      try { await port.close(); } catch { /* noop */ }
    },
  };
}

/** 便捷方法：直接把 FromRadio 载荷解码为对象。 */
export function decodeFromRadio(bytes: Uint8Array): Record<string, any> {
  return decodeMessage('FromRadio', bytes);
}
