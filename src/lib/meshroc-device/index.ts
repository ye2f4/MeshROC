/**
 * MeshROC 设备 SDK —— 统一出口（"我的形式"）。
 *
 * 分层：
 *   protobuf.ts  协议编解码（schema 驱动，零依赖）
 *   framing.ts   线帧封装 + Web Serial 传输
 *   client.ts    设备客户端（连接 / 协议语义 / 事件总线 / 全国地貌模板）
 *   hooks.ts     React hooks（对标 @meshtastic/sdk-react）
 */

export * from './protobuf';
export * from './framing';
export * from './client';
export * from './hooks';
