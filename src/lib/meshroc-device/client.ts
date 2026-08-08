/**
 * MeshROC 设备客户端（"我的形式"）。
 *
 * 设计对标 Meshtastic SDK 的 DeviceClient / Transport / EventBus 三段式：
 *   - framing.ts  ≈ Transport（连接 + 帧收发）
 *   - 本文件       ≈ DeviceClient（连接管理 + 协议语义 + 事件总线）
 *   - hooks.ts     ≈ @meshtastic/sdk-react 的 useDevice 等 hooks
 *
 * 关键差异：零外部依赖，协议细节完全可控，且面向 MeshROC 的"全国地貌模板"做了封装。
 */

import { encodeToRadio, decodeFromRadio, openWebSerial, type SerialHandle } from './framing';
import {
  PortNum, RegionCode, ModemPreset, Priority, BROADCAST_ADDR,
  decodeMessage, encodeMessage,
} from './protobuf';

export type ClientStatus = 'idle' | 'connecting' | 'connected' | 'ready' | 'error';

export interface ChatMessage {
  id?: number;
  from: number;
  to: number;
  text: string;
  channel: number;
  time: number;
}

type Listener = (payload: any) => void;

/** 全国地貌射频模板 —— 与官网"面向全国地形气候"九类环境一一对应。 */
export interface EnvTemplate {
  id: number;
  name: string;
  modemPreset: number;
  hopLimit: number;
  txPower: number;
}

export const ENV_TEMPLATES: EnvTemplate[] = [
  { id: 0, name: '华北山地',       modemPreset: ModemPreset.LONG_SLOW,      hopLimit: 5, txPower: 30 },
  { id: 1, name: '东北林区',       modemPreset: ModemPreset.LONG_FAST,      hopLimit: 4, txPower: 27 },
  { id: 2, name: '南方多雨山林',   modemPreset: ModemPreset.LONG_FAST,      hopLimit: 4, txPower: 27 },
  { id: 3, name: '东南沿海丘陵',   modemPreset: ModemPreset.LONG_FAST,      hopLimit: 4, txPower: 27 },
  { id: 4, name: '西北荒漠戈壁',   modemPreset: ModemPreset.VERY_LONG_SLOW, hopLimit: 7, txPower: 30 },
  { id: 5, name: '青藏高原',       modemPreset: ModemPreset.LONG_SLOW,      hopLimit: 5, txPower: 30 },
  { id: 6, name: '盆地河谷',       modemPreset: ModemPreset.LONG_FAST,      hopLimit: 4, txPower: 27 },
  { id: 7, name: '城中村高楼遮挡', modemPreset: ModemPreset.SHORT_FAST,     hopLimit: 3, txPower: 20 },
  { id: 8, name: '工业区电磁复杂', modemPreset: ModemPreset.SHORT_FAST,     hopLimit: 3, txPower: 20 },
];

export class MeshROCDeviceClient {
  private handle: SerialHandle | null = null;
  private myNodeNum = 0;
  private wantConfigId = 0;
  private currentConfig: Record<string, any> | null = null;
  private listeners: Record<string, Listener[]> = {};

  status: ClientStatus = 'idle';

  on(event: string, cb: Listener): () => void {
    (this.listeners[event] ||= []).push(cb);
    return () => this.off(event, cb);
  }
  off(event: string, cb: Listener) {
    this.listeners[event] = (this.listeners[event] || []).filter((l) => l !== cb);
  }
  private emit(event: string, payload?: any) {
    (this.listeners[event] || []).forEach((l) => l(payload));
  }
  private setStatus(s: ClientStatus) {
    this.status = s;
    this.emit('status', s);
  }

  async connect(): Promise<void> {
    this.setStatus('connecting');
    try {
      this.handle = await openWebSerial((bytes) => this.handleFrame(bytes));
      this.wantConfigId = (Math.random() * 0xffffffff) >>> 0;
      this.send({ want_config_id: this.wantConfigId });
      this.setStatus('connected');
    } catch (e: any) {
      this.setStatus('error');
      this.emit('error', e?.message || String(e));
      throw e;
    }
  }

  private send(obj: Record<string, any>) {
    if (!this.handle) return;
    this.handle.write(encodeToRadio(obj));
  }

  private handleFrame(bytes: Uint8Array) {
    const fr = decodeFromRadio(bytes);
    if (fr.my_info) {
      this.myNodeNum = fr.my_info.my_node_num;
      this.emit('myInfo', fr.my_info);
      // 已拿到本机编号 → 请求设备元数据（固件版本、硬件型号等）
      this.send({ packet: this.adminPacket({ get_device_metadata_request: true }) });
    }
    if (fr.node_info) this.emit('node', fr.node_info);
    if (fr.config) { this.currentConfig = fr.config; this.emit('config', fr.config); }
    if (fr.channel) this.emit('channel', fr.channel);
    if (fr.metadata) this.emit('metadata', fr.metadata);
    if (fr.log_record) this.emit('log', fr.log_record.message);
    if (fr.rebooted) this.emit('rebooted');
    if (fr.config_complete_id !== undefined && fr.config_complete_id === this.wantConfigId) {
      this.setStatus('ready');
      this.emit('complete');
    }
    if (fr.packet) this.handlePacket(fr.packet);
  }

  private handlePacket(packet: any) {
    const decoded = packet.decoded;
    if (!decoded) return;
    if (decoded.portnum === PortNum.ADMIN_APP) {
      // admin 应答内嵌在 payload 里
      const admin = decodeMessage('AdminMessage', decoded.payload);
      if (admin.get_owner_response) this.emit('owner', admin.get_owner_response);
      if (admin.get_channel_response) this.emit('channel', admin.get_channel_response);
      if (admin.get_device_metadata_response) this.emit('metadata', admin.get_device_metadata_response);
      if (admin.get_config_response) { this.currentConfig = admin.get_config_response; this.emit('config', admin.get_config_response); }
      return;
    }
    if (decoded.portnum === PortNum.TEXT_MESSAGE_APP) {
      const text = new TextDecoder().decode(decoded.payload || new Uint8Array());
      const msg: ChatMessage = {
        id: packet.id,
        from: packet.from,
        to: packet.to,
        text,
        channel: packet.channel,
        time: Date.now(),
      };
      this.emit('message', msg);
    }
  }

  private adminPacket(payload: Record<string, any>, wantResponse = true): Record<string, any> {
    return {
      to: this.myNodeNum,
      channel: 0,
      priority: Priority.RELIABLE,
      decoded: {
        portnum: PortNum.ADMIN_APP,
        want_response: wantResponse,
        request_id: (Math.random() * 0xffffffff) >>> 0,
        payload: encodeMessage('AdminMessage', payload),
      },
    };
  }

  /* ---------------- 对外 API ---------------- */

  sendText(text: string, to: number = BROADCAST_ADDR, channel = 0) {
    this.send({
      packet: {
        to, channel,
        priority: Priority.DEFAULT,
        want_ack: false,
        decoded: {
          portnum: PortNum.TEXT_MESSAGE_APP,
          payload: new TextEncoder().encode(text),
          want_response: false,
        },
      },
    });
  }

  setOwner(longName: string, shortName = '') {
    this.send({ packet: this.adminPacket({ set_owner: { long_name: longName, short_name: shortName } }) });
  }

  setChannelName(index: number, name: string) {
    this.send({ packet: this.adminPacket({ set_channel: { index, settings: { name } } }) });
  }

  /** 直接下发 LoRaConfig 片段。固件按 has_* 标志合并，因此只发 lora 即可，不会清零其它配置段。 */
  setLoRa(partial: Record<string, any>) {
    const lora = { ...(this.currentConfig?.lora || {}), ...partial };
    this.send({ packet: this.adminPacket({ begin_edit_settings: true }) });
    this.send({ packet: this.adminPacket({ set_config: { lora } }) });
    this.send({ packet: this.adminPacket({ commit_edit_settings: true }) });
  }

  /** 一键套用"全国地貌射频模板"：统一国内 CN 频段 + 对应 modem 预设 / 跳数 / 功率。 */
  applyEnvTemplate(id: number) {
    const tpl = ENV_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    this.setLoRa({
      region: RegionCode.CN,
      use_preset: true,
      modem_preset: tpl.modemPreset,
      hop_limit: tpl.hopLimit,
      tx_power: tpl.txPower,
    });
  }

  requestOwner() {
    this.send({ packet: this.adminPacket({ get_owner_request: true }) });
  }
  requestChannel(index = 0) {
    this.send({ packet: this.adminPacket({ get_channel_request: index }) });
  }

  async disconnect() {
    try { this.send({ disconnect: true }); } catch { /* noop */ }
    if (this.handle) await this.handle.close();
    this.handle = null;
    this.setStatus('idle');
  }
}
