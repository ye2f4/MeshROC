/**
 * MeshROC 设备桥接单例（网页端统一入口）。
 *
 * 用途：让主页留言板（MessageBoard）等组件能订阅本地串口电台
 * （经 Web Serial 直连的 MeshROCDeviceClient）的实时消息，而不必各自
 * 持有 client 实例。与云端 Supabase 留言互补：云端是"论坛"，本地电台是
 * "实时 LoRa 频道"。
 *
 * 注意：本模块不主动 connect()，连接需用户显式触发（Web Serial 必须用户手势
 * 授权），由各 UI 的"连接电台"按钮调用 connectMeshROC()。
 */

import { MeshROCDeviceClient, type ChatMessage } from './client';

/** 全局唯一设备客户端实例 */
export const meshROCClient = new MeshROCDeviceClient();

export function isMeshROCConnected(): boolean {
  return meshROCClient.status === 'ready' || meshROCClient.status === 'connected';
}

/** 用户手势触发：连接本地串口电台（弹浏览器 USB 授权）。 */
export async function connectMeshROC(): Promise<void> {
  if (isMeshROCConnected()) return;
  await meshROCClient.connect();
}

/**
 * 固件 channel index → 主页留言板 post_id 后缀映射。
 * Meshtastic 默认：0=primary(LongFast)，1=secondary(MediumFast)。
 * 与 src/pages/index.js 的 CHANNELS 定义保持一致。
 */
export function channelToGuestbookSuffix(channel: number): string {
  switch (channel) {
    case 1:
      return 'mediumfast';
    case 0:
    default:
      return 'longfast';
  }
}

export type { ChatMessage };
