/**
 * MeshROC 设备 React Hooks（"我的形式"）。
 *
 * 对标 @meshtastic/sdk-react 的 useDevice / useDeviceHardware 等 hooks，
 * 但实现完全自研：用轻量事件总线驱动 React state，无需引入外部 SDK。
 *
 * 用法：
 *   const client = useMeshROCClient();
 *   client.connect();                 // 弹出串口选择、建立连接
 *   client.sendText('你好');           // 发送文本
 *   client.applyEnvTemplate(4);        // 套用"西北荒漠戈壁"射频模板
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { MeshROCDeviceClient, ENV_TEMPLATES, type ChatMessage, type ClientStatus } from './client';
import { hwModelName } from './protobuf';

export function useMeshROCClient() {
  const clientRef = useRef<MeshROCDeviceClient | null>(null);
  if (!clientRef.current) clientRef.current = new MeshROCDeviceClient();
  const client = clientRef.current;

  const [status, setStatus] = useState<ClientStatus>('idle');
  const [myInfo, setMyInfo] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [owner, setOwnerState] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const offs = [
      client.on('status', setStatus),
      client.on('myInfo', setMyInfo),
      client.on('owner', setOwnerState),
      client.on('config', setConfig),
      client.on('metadata', setMetadata),
      client.on('node', (n: any) =>
        setNodes((prev) => {
          const i = prev.findIndex((x) => x.num === n.num);
          const c = [...prev];
          if (i >= 0) c[i] = n; else c.push(n);
          return c;
        }),
      ),
      client.on('channel', (c: any) =>
        setChannels((prev) => {
          const i = prev.findIndex((x) => x.index === c.index);
          const a = [...prev];
          if (i >= 0) a[i] = c; else a.push(c);
          return a;
        }),
      ),
      client.on('message', (m: ChatMessage) => setMessages((prev) => [...prev, m].slice(-200))),
      client.on('log', (l: string) => setLogs((prev) => [...prev, l].slice(-100))),
      client.on('error', setError),
    ];
    return () => offs.forEach((off) => off());
  }, [client]);

  const connect = useCallback(() => {
    setError(null);
    client.connect().catch((e: any) => setError(e?.message || String(e)));
  }, [client]);

  const disconnect = useCallback(() => client.disconnect(), [client]);
  const sendText = useCallback((t: string, to?: number) => client.sendText(t, to), [client]);
  const setOwner = useCallback((l: string, s = '') => client.setOwner(l, s), [client]);
  const setChannelName = useCallback((i: number, n: string) => client.setChannelName(i, n), [client]);
  const applyEnvTemplate = useCallback((id: number) => client.applyEnvTemplate(id), [client]);
  const requestOwner = useCallback(() => client.requestOwner(), [client]);

  return {
    status, myInfo, nodes, channels, metadata, config, messages, logs, owner, error,
    connect, disconnect, sendText, setOwner, setChannelName, applyEnvTemplate, requestOwner,
    envTemplates: ENV_TEMPLATES,
    hwModelName,
  };
}
