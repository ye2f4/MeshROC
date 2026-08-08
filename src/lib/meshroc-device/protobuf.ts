/**
 * MeshROC 设备线协议 —— 极简、零依赖的 protobuf 编解码器（"我的形式"）。
 *
 * 设计原则：schema 驱动，仅实现 Web 客户端需要的那部分消息。
 * 所有 field tag / enum 值均来自 MeshROC（Meshtastic 分支）固件生成的 nanopb 头文件，
 * 与该固件 100% 兼容（Option B：兼容 Meshtastic 的互通帧格式）。
 *
 * 日后扩展：在 SCHEMAS 里追加消息/字段即可，无需引入外部 SDK。
 */

export type FieldType =
  | 'varint' | 'uint32' | 'uint64' | 'int32' | 'int64' | 'sint32' | 'sint64'
  | 'bool' | 'enum'
  | 'fixed32' | 'fixed64' | 'float' | 'double'
  | 'bytes' | 'string' | 'message';

export interface FieldDef {
  n: number;
  t: FieldType;
  name: string;
  msg?: string;
  repeated?: boolean;
}

export type Schema = Record<string, FieldDef[]>;

function wireType(t: FieldType): number {
  switch (t) {
    case 'varint': case 'uint32': case 'uint64': case 'int32': case 'int64':
    case 'sint32': case 'sint64': case 'bool': case 'enum':
      return 0;
    case 'fixed64': case 'double':
      return 1;
    case 'bytes': case 'string': case 'message':
      return 2;
    case 'fixed32': case 'float':
      return 5;
  }
  return 0;
}

function varintBytes(value: number | bigint): number[] {
  let v = BigInt(value);
  if (v < 0n) v = v & ((1n << 64n) - 1n);
  const out: number[] = [];
  while (true) {
    if ((v & ~0x7fn) === 0n) { out.push(Number(v & 0x7fn)); break; }
    out.push(Number((v & 0x7fn) | 0x80n));
    v >>= 7n;
  }
  return out;
}

function zigzag32(v: number): bigint {
  return BigInt((v << 1) ^ (v >> 31)) & 0xffffffffn;
}
function zigzag64(v: number): bigint {
  const b = BigInt(v);
  return ((b << 1n) ^ (b >> 63n)) & ((1n << 64n) - 1n);
}
function fromSigned(v: number, bits: number): number {
  const half = 1 << (bits - 1);
  return v >= half ? v - (1 << bits) : v;
}

export function encodeMessage(name: string, obj: Record<string, any>): Uint8Array {
  const schema = SCHEMAS[name];
  if (!schema) throw new Error(`Unknown schema: ${name}`);
  const out: number[] = [];
  for (const f of schema) {
    const val = obj ? obj[f.name] : undefined;
    if (val === undefined || val === null) continue;
    if (f.repeated) {
      if (!Array.isArray(val)) continue;
      for (const item of val) encodeField(f, item, out);
    } else {
      encodeField(f, val, out);
    }
  }
  return Uint8Array.from(out);
}

function encodeField(f: FieldDef, val: any, out: number[]) {
  const wt = wireType(f.t);
  const tag = (f.n << 3) | wt;
  out.push(...varintBytes(tag));
  switch (f.t) {
    case 'varint': case 'uint32': case 'uint64': case 'int32': case 'int64': case 'enum':
      out.push(...varintBytes(val)); break;
    case 'sint32': out.push(...varintBytes(zigzag32(val))); break;
    case 'sint64': out.push(...varintBytes(zigzag64(val))); break;
    case 'bool': out.push(...varintBytes(val ? 1 : 0)); break;
    case 'bytes': {
      const b = val instanceof Uint8Array ? val : new Uint8Array(val);
      out.push(...varintBytes(b.length)); out.push(...b); break;
    }
    case 'string': {
      const enc = new TextEncoder().encode(val);
      out.push(...varintBytes(enc.length)); out.push(...enc); break;
    }
    case 'message': {
      const inner = encodeMessage(f.msg!, val);
      out.push(...varintBytes(inner.length)); out.push(...inner); break;
    }
    case 'fixed32': case 'float': {
      const buf = new ArrayBuffer(4); const dv = new DataView(buf);
      if (f.t === 'float') dv.setFloat32(0, val, true); else dv.setUint32(0, val >>> 0, true);
      out.push(...new Uint8Array(buf)); break;
    }
    case 'fixed64': case 'double': {
      const buf = new ArrayBuffer(8); const dv = new DataView(buf);
      if (f.t === 'double') dv.setFloat64(0, val, true); else dv.setBigUint64(0, BigInt(val), true);
      out.push(...new Uint8Array(buf)); break;
    }
  }
}

export function decodeMessage(name: string, bytes: Uint8Array): Record<string, any> {
  const schema = SCHEMAS[name];
  const obj: Record<string, any> = {};
  let i = 0;
  const len = bytes.length;
  while (i < len) {
    let tagShift = 0n; let tag = 0n;
    while (i < len) {
      const b = bytes[i++];
      tag |= BigInt(b & 0x7f) << tagShift;
      if ((b & 0x80) === 0) break;
      tagShift += 7n;
    }
    const fieldNum = Number(tag >> 3n);
    const wt = Number(tag & 7n);
    const f = schema ? schema.find((x) => x.n === fieldNum) : undefined;
    if (!f) { i = skip(wt, bytes, i); continue; }
    const r = readValue(f, wt, bytes, i);
    i = r.next;
    if (f.repeated) { (obj[f.name] ||= []).push(r.value); }
    else obj[f.name] = r.value;
  }
  return obj;
}

function readVarint(bytes: Uint8Array, i: number): { v: bigint; next: number } {
  let v = 0n; let shift = 0n; let pos = i;
  while (pos < bytes.length) {
    const b = bytes[pos++];
    v |= BigInt(b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7n;
  }
  return { v, next: pos };
}

function readValue(f: FieldDef, wt: number, bytes: Uint8Array, i: number) {
  if (wt === 0) {
    const { v, next } = readVarint(bytes, i);
    let num = Number(v);
    if (f.t === 'int32') num = fromSigned(num, 32);
    else if (f.t === 'int64' || f.t === 'sint64') num = fromSigned(num, 64);
    return { value: f.t === 'bool' ? v !== 0n : num, next };
  }
  if (wt === 1) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset + i, 8);
    const value = f.t === 'double' ? dv.getFloat64(0, true) : Number(dv.getBigUint64(0, true));
    return { value, next: i + 8 };
  }
  if (wt === 5) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset + i, 4);
    const value = f.t === 'float' ? dv.getFloat32(0, true) : dv.getUint32(0, true);
    return { value, next: i + 4 };
  }
  // length-delimited
  const { v: lenBig, next } = readVarint(bytes, i);
  const l = Number(lenBig);
  const slice = bytes.slice(next, next + l);
  let value: any;
  if (f.t === 'string') value = new TextDecoder().decode(slice);
  else if (f.t === 'message') value = decodeMessage(f.msg!, slice);
  else value = slice;
  return { value, next: next + l };
}

function skip(wt: number, bytes: Uint8Array, i: number): number {
  if (wt === 0) return readVarint(bytes, i).next;
  if (wt === 1) return i + 8;
  if (wt === 5) return i + 4;
  const { next } = readVarint(bytes, i);
  return next + Number(readVarint(bytes, next).v);
}

/* =========================================================
 * 消息 Schema（tag 取自固件 generated/meshtastic/*.pb.h）
 * ======================================================= */
export const SCHEMAS: Schema = {
  ToRadio: [
    { n: 1, t: 'message', name: 'packet', msg: 'MeshPacket' },
    { n: 3, t: 'uint32', name: 'want_config_id' },
    { n: 4, t: 'bool', name: 'disconnect' },
    { n: 7, t: 'bool', name: 'heartbeat' },
  ],
  FromRadio: [
    { n: 1, t: 'uint32', name: 'id' },
    { n: 2, t: 'message', name: 'packet', msg: 'MeshPacket' },
    { n: 3, t: 'message', name: 'my_info', msg: 'MyNodeInfo' },
    { n: 4, t: 'message', name: 'node_info', msg: 'NodeInfo' },
    { n: 5, t: 'message', name: 'config', msg: 'Config' },
    { n: 6, t: 'message', name: 'log_record', msg: 'LogRecord' },
    { n: 7, t: 'uint32', name: 'config_complete_id' },
    { n: 8, t: 'bool', name: 'rebooted' },
    { n: 10, t: 'message', name: 'channel', msg: 'Channel' },
    { n: 13, t: 'message', name: 'metadata', msg: 'DeviceMetadata' },
  ],
  MeshPacket: [
    { n: 1, t: 'uint32', name: 'from' },
    { n: 2, t: 'uint32', name: 'to' },
    { n: 3, t: 'uint32', name: 'channel' },
    { n: 4, t: 'message', name: 'decoded', msg: 'Data' },
    { n: 5, t: 'bytes', name: 'encrypted' },
    { n: 6, t: 'uint32', name: 'id' },
    { n: 7, t: 'uint32', name: 'rx_time' },
    { n: 8, t: 'float', name: 'rx_snr' },
    { n: 9, t: 'uint32', name: 'hop_limit' },
    { n: 10, t: 'bool', name: 'want_ack' },
    { n: 11, t: 'enum', name: 'priority' },
    { n: 12, t: 'int32', name: 'rx_rssi' },
    { n: 13, t: 'bool', name: 'delayed' },
    { n: 14, t: 'bool', name: 'via_mqtt' },
    { n: 15, t: 'uint32', name: 'hop_start' },
  ],
  Data: [
    { n: 1, t: 'enum', name: 'portnum' },
    { n: 2, t: 'bytes', name: 'payload' },
    { n: 3, t: 'bool', name: 'want_response' },
    { n: 4, t: 'uint32', name: 'dest' },
    { n: 5, t: 'uint32', name: 'source' },
    { n: 6, t: 'uint32', name: 'request_id' },
    { n: 8, t: 'string', name: 'emoji' },
    { n: 9, t: 'uint32', name: 'bitfield' },
  ],
  User: [
    { n: 1, t: 'string', name: 'id' },
    { n: 2, t: 'string', name: 'long_name' },
    { n: 3, t: 'string', name: 'short_name' },
    { n: 4, t: 'bytes', name: 'macaddr' },
    { n: 5, t: 'enum', name: 'hw_model' },
    { n: 6, t: 'bool', name: 'is_licensed' },
    { n: 7, t: 'enum', name: 'role' },
  ],
  Position: [
    { n: 1, t: 'int32', name: 'latitude_i' },
    { n: 2, t: 'int32', name: 'longitude_i' },
    { n: 3, t: 'int32', name: 'altitude' },
    { n: 4, t: 'fixed32', name: 'time' },
    { n: 5, t: 'uint32', name: 'location_source' },
    { n: 6, t: 'uint32', name: 'timestamp' },
    { n: 8, t: 'int32', name: 'altitude_hae' },
    { n: 10, t: 'uint32', name: 'PDOP' },
    { n: 15, t: 'fixed32', name: 'timestamp_millis' },
  ],
  NodeInfo: [
    { n: 1, t: 'uint32', name: 'num' },
    { n: 2, t: 'message', name: 'user', msg: 'User' },
    { n: 3, t: 'message', name: 'position', msg: 'Position' },
    { n: 4, t: 'float', name: 'snr' },
    { n: 5, t: 'uint32', name: 'last_heard' },
    { n: 6, t: 'message', name: 'device_metrics', msg: 'DeviceMetrics' },
    { n: 7, t: 'uint32', name: 'channel' },
    { n: 9, t: 'uint32', name: 'hops_away' },
  ],
  DeviceMetrics: [
    { n: 1, t: 'uint32', name: 'battery_level' },
    { n: 2, t: 'float', name: 'voltage' },
    { n: 3, t: 'float', name: 'channel_utilization' },
    { n: 4, t: 'float', name: 'air_util_tx' },
    { n: 5, t: 'uint32', name: 'uptime_seconds' },
  ],
  MyNodeInfo: [
    { n: 1, t: 'uint32', name: 'my_node_num' },
    { n: 8, t: 'uint32', name: 'reboot_count' },
    { n: 11, t: 'uint32', name: 'min_app_version' },
    { n: 12, t: 'string', name: 'device_id' },
    { n: 13, t: 'uint32', name: 'max_channels' },
    { n: 14, t: 'string', name: 'firmware_edition' },
    { n: 15, t: 'uint32', name: 'nodedb_count' },
  ],
  DeviceMetadata: [
    { n: 1, t: 'string', name: 'firmware_version' },
    { n: 2, t: 'uint32', name: 'device_state_version' },
    { n: 3, t: 'bool', name: 'canShutdown' },
    { n: 4, t: 'bool', name: 'hasWifi' },
    { n: 5, t: 'bool', name: 'hasBluetooth' },
    { n: 7, t: 'enum', name: 'role' },
    { n: 8, t: 'uint32', name: 'position_flags' },
    { n: 9, t: 'enum', name: 'hw_model' },
    { n: 11, t: 'bool', name: 'hasPKC' },
    { n: 13, t: 'string', name: 'firmware_build_date' },
    { n: 14, t: 'bool', name: 'has_xeddsa' },
  ],
  Routing: [
    { n: 1, t: 'uint32', name: 'route_request' },
    { n: 2, t: 'uint32', name: 'route_reply' },
    { n: 3, t: 'enum', name: 'error_reason' },
  ],
  LogRecord: [
    { n: 1, t: 'string', name: 'message' },
    { n: 2, t: 'uint32', name: 'time' },
    { n: 3, t: 'uint32', name: 'source' },
    { n: 4, t: 'uint32', name: 'level' },
  ],
  Channel: [
    { n: 1, t: 'uint32', name: 'index' },
    { n: 2, t: 'message', name: 'settings', msg: 'ChannelSettings' },
    { n: 3, t: 'enum', name: 'role' },
  ],
  ChannelSettings: [
    { n: 1, t: 'uint32', name: 'channel_num' },
    { n: 2, t: 'bytes', name: 'psk' },
    { n: 3, t: 'string', name: 'name' },
    { n: 4, t: 'string', name: 'id' },
    { n: 5, t: 'bool', name: 'uplink_enabled' },
    { n: 6, t: 'bool', name: 'downlink_enabled' },
  ],
  AdminMessage: [
    { n: 1, t: 'uint32', name: 'get_channel_request' },
    { n: 2, t: 'message', name: 'get_channel_response', msg: 'Channel' },
    { n: 3, t: 'bool', name: 'get_owner_request' },
    { n: 4, t: 'message', name: 'get_owner_response', msg: 'User' },
    { n: 5, t: 'uint32', name: 'get_config_request' },
    { n: 6, t: 'message', name: 'get_config_response', msg: 'Config' },
    { n: 12, t: 'bool', name: 'get_device_metadata_request' },
    { n: 13, t: 'message', name: 'get_device_metadata_response', msg: 'DeviceMetadata' },
    { n: 32, t: 'message', name: 'set_owner', msg: 'User' },
    { n: 33, t: 'message', name: 'set_channel', msg: 'Channel' },
    { n: 34, t: 'message', name: 'set_config', msg: 'Config' },
    { n: 64, t: 'bool', name: 'begin_edit_settings' },
    { n: 65, t: 'bool', name: 'commit_edit_settings' },
  ],
  Config: [
    { n: 1, t: 'message', name: 'device', msg: 'DeviceConfig' },
    { n: 6, t: 'message', name: 'lora', msg: 'LoRaConfig' },
  ],
  DeviceConfig: [
    { n: 1, t: 'enum', name: 'role' },
    { n: 2, t: 'bool', name: 'serial_enabled' },
    { n: 4, t: 'bool', name: 'gps_enabled' },
  ],
  LoRaConfig: [
    { n: 1, t: 'bool', name: 'use_preset' },
    { n: 2, t: 'enum', name: 'modem_preset' },
    { n: 3, t: 'uint32', name: 'bandwidth' },
    { n: 4, t: 'uint32', name: 'spread_factor' },
    { n: 5, t: 'uint32', name: 'coding_rate' },
    { n: 7, t: 'enum', name: 'region' },
    { n: 8, t: 'uint32', name: 'hop_limit' },
    { n: 9, t: 'bool', name: 'tx_enabled' },
    { n: 10, t: 'uint32', name: 'tx_power' },
    { n: 11, t: 'uint32', name: 'channel_num' },
  ],
  ModuleConfig: [
    { n: 1, t: 'message', name: 'mqtt', msg: 'bytes' },
  ],
  QueueStatus: [
    { n: 1, t: 'uint32', name: 'res' },
    { n: 2, t: 'uint32', name: 'free' },
  ],
};

/* =========================================================
 * 枚举（与固件 protobuf 枚举值一致）
 * ======================================================= */
export const PortNum = {
  UNKNOWN: 0,
  TEXT_MESSAGE_APP: 1,
  POSITION_APP: 3,
  NODEINFO_APP: 4,
  ROUTING_APP: 5,
  ADMIN_APP: 6,
  MAP_REPORT_APP: 8,
  TELEMETRY_APP: 10,
} as const;

export const RegionCode = {
  UNSET: 0, US: 1, EU_433: 2, EU_868: 3, CN: 4, JP: 5, ANZ: 6, KR: 7, TW: 8,
  RU: 9, IN: 10, NZ_865: 11, TH: 12, LORA_24: 13, UA_433: 14, UA_868: 15,
} as const;

export const ModemPreset = {
  LONG_FAST: 0, LONG_SLOW: 1, VERY_LONG_SLOW: 2, MEDIUM_SLOW: 3, MEDIUM_FAST: 4,
  SHORT_SLOW: 5, SHORT_FAST: 6, LONG_MODERATE: 7, SHORT_TURBO: 8, LONG_TURBO: 9,
  LITE_FAST: 10, LITE_SLOW: 11, NARROW_FAST: 12, NARROW_SLOW: 13,
} as const;

export const Priority = {
  MIN: 0, BACKGROUND: 10, DEFAULT: 64, RELIABLE: 70, ACK: 120, MAX: 255,
} as const;

export const ChannelRole = { PRIMARY: 0, SECONDARY: 1, DISABLED: 2 } as const;

export const BROADCAST_ADDR = 0xffffffff;

const HW_MODELS: Record<number, string> = {
  0: 'UNSET', 1: 'TLORA_V2', 2: 'TLORA_V1', 3: 'TLORA_V2_1_1P6', 6: 'TBEAM', 7: 'HELTEC_V2_0',
  8: 'TBEAM_V0P7', 10: 'RAK4631', 11: 'HELTEC_V2_1', 12: 'HELTEC_V1', 13: 'LILYGO_TLG_ANT',
  14: 'RAK11200', 15: 'NANO_G1', 16: 'TLORA_V1_1P3', 17: 'RAK11310', 18: 'NANO_G1_EXPLORER',
  19: 'STATION_G2', 20: 'RPI_PICO', 21: 'HELTEC_V3', 22: 'HELTEC_WSL_V3', 23: 'WM1110_DEVKIT',
  24: 'RAK_WISBLOCK', 25: 'NRF52840DK', 26: 'PPR', 27: 'GENIEBLOCKS', 28: 'NRF52840_PCA10059',
  29: 'DR_DEV', 30: 'M5STACK', 31: 'HELTEC_WIRELESS_TRACKER', 32: 'HELTEC_WIRELESS_PAPER',
  33: 'TECHO', 34: 'TRACKER_T1000_E', 35: 'RAK12500', 36: 'NANO_G1_8', 37: 'SENSELORA_RP2040',
  38: 'SENSELORA_S3', 39: 'CANARYONE', 41: 'NRF52_UNKNOWN', 42: 'PORTDUINO', 43: 'ANDROID_SIM',
  44: 'DIY_V1', 45: 'NRF52833DK', 46: 'BETAFPV_2400_TX', 47: 'BETAFPV_900_NANO_TX',
  48: 'RPI_PICO2', 49: 'HELTEC_V3_1', 50: 'HELTEC_WIRELESS_TRACKER_V1_1', 51: 'PRIVATE_HW',
  255: 'PRIVATE_HW',
};

export function hwModelName(n?: number): string {
  if (n === undefined || n === null) return '未知';
  return HW_MODELS[n] || `HW#${n}`;
}
