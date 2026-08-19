---
sidebar_position: 5
---

# 网络客户端：API 与 Hook 原理分析（我的形式）

本文把可借鉴的开源参考（Meshtastic/web、MeshCore 三件套）的**设备连接 API / Hook 设计**逐层拆解，
并说明 MeshROC 如何用**完全自研、零依赖**的「我的形式」SDK 实现同等能力，供日后开发复用。

> 兼容性前提：MeshROC 固件是 Meshtastic 分支，序列配置协议与上游**帧格式、字段 tag、枚举值完全一致**
> （已在固件 `src/mesh/generated/meshtastic/*.pb.h` 与 `StreamAPI.cpp` 中核实）。因此网络客户端沿用标准
> 协议即可互通，新增的「全国地貌模板」也只是对标准 `LoRaConfig` 的封装，不破坏混合组网。

## 1. 参考来源与可借鉴点

### 1.1 Meshtastic/web + `@meshtastic/js` SDK
- **三段式架构**：
  - `Transport`（实现 `SerialTransport` / `IpcTransport` / `BluetoothTransport` / `HttpTransport`）——只负责收发字节。
  - `DeviceClient` —— 维护连接、收发 `ToRadio`/`FromRadio`、解析 `MeshPacket`、暴露命令方法（`setOwner`、`setChannel`、`sendText`…）。
  - `EventBus`（基于 `mitt` 或自研事件中心）——把 `myInfo` / `node` / `config` / `packet` / `log` 等事件广播给 UI。
- **消息编解码**：依赖 `@meshtastic/protobufs`（由 `.proto` 自动生成的 TS 类），`DeviceClient` 直接 `ToRadio.create({...})`。
- **React 层 `@meshtastic/sdk-react`**：用 `useDevice()` 返回 `DeviceClient` 实例，再用 `useDeviceHardware()`、`useNode(num)`、
  `useConfig()`、`useChannels()` 等细粒度 hooks 订阅事件总线并驱动组件重渲染。

**可借鉴**：连接/协议/事件三层分离 + hooks 化订阅。这正是 MeshROC SDK 的分层依据。

### 1.2 MeshCore `config.meshcore.io`
- 极简路线：`SerialCLI` / `SerialConsole` 类，经 **Web Serial** 向设备发 AT 风格文本命令（`get_CONFIG`、`set_...`），
  设备回显文本，前端用正则/行解析回填表单。
- 前端是 **Vue 3 SPA**，组件直接持有串口句柄。

**可借鉴**：Web Serial 的连接范式（`<u>navigator.serial.requestPort()</u>` → `port.open({baudRate})` →
`getReader()/getWriter()`）。MeshCore 走「文本行协议」，而我们走「protobuf 流协议」，所以只借鉴其
*连接骨架*，不借鉴其协议本身（MeshROC 固件讲的是 Meshtastic 协议）。

### 1.3 MeshCore `map.meshcore.io` / `flasher.meshcore.io`
- `map`：Leaflet 地图 + 订阅设备 GPS `Position` 回传，叠加节点标点。
- `flasher`：浏览器内 esptool 烧录（与 MeshROC 的 `/flash` 同源思路）。

**可借鉴**：地图叠加、GPS 回传订阅——可日后在 `/client` 右侧加一个 `Position` 地图面板复刻。

## 2. MeshROC「我的形式」SDK 架构

源码位于 `src/lib/meshroc-device/`，四层，零外部依赖：

```
protobuf.ts   协议编解码（schema 驱动，仅实现需要的消息）
framing.ts    线帧封装 + Web Serial 传输（FrameScanner + openWebSerial）
client.ts     设备客户端（连接 / 协议语义 / 事件总线 / 全国地貌模板）
hooks.ts      React hooks（对标 @meshtastic/sdk-react 的 useDevice 系列）
index.ts      统一出口
```

### 2.1 帧格式（与固件一致）
```
[ 0x94 | 0xC3 | lenHi | lenLo | <protobuf 载荷> ]
```
`framing.ts` 的 `FrameScanner` 持续喂入串口字节，按起始符定位、按长度截取，吐出完整 `FromRadio` 载荷。

### 2.2 协议语义要点
- 上线即发 `ToRadio{want_config_id: <随机>}` → 设备回灌 `my_info` / `node_info` / `config` / `channel` /
  `metadata`，最后回 `FromRadio{config_complete_id}` 表示就绪。
- **配置/管理走 Admin 通道**：任何 `set_*` / `get_*` 都是「发给本机（`to = my_node_num`）的 `MeshPacket`，
  `portnum = ADMIN_APP(6)`，payload = `AdminMessage` protobuf」。设备应答同样内嵌在 `AdminMessage` 里。
  例：`set_owner` = `AdminMessage{set_owner: User{long_name, short_name}}`；`set_channel` = `AdminMessage{set_channel: Channel{...}}`。
- 文本消息：`MeshPacket{to, channel, decoded: Data{portnum: TEXT_MESSAGE_APP, payload: bytes}}`。

### 2.3 事件总线（对标 EventBus / useDevice）
`MeshROCDeviceClient` 内置 `on(event, cb)` / `emit(event, payload)`，事件名：
`status` / `myInfo` / `node` / `config` / `channel` / `metadata` / `owner` / `message` / `log` / `complete` / `error`。
`hooks.ts` 的 `useMeshROCClient()` 把这些事件映射成 React state，组件只消费 state——与
`useDeviceHardware()` / `useNode()` 的「订阅即重渲染」理念一致，但实现完全自研。

## 3. 全国地貌模板 → `LoRaConfig` 映射

`client.ts` 的 `ENV_TEMPLATES` 与官网「面向全国地形气候」九类环境一一对应；`applyEnvTemplate(id)` 统一下发
`region = CN(4)` 并套用对应 `modem_preset` / `hop_limit` / `tx_power`。该能力**只用到标准 `set_config(LoRaConfig)`**，
固件（Meshtastic 分支）原生支持，无需改协议。

| 地貌 | modem_preset | hop_limit | tx_power |
| --- | --- | --- | --- |
| 华北山地 | LONG_SLOW | 5 | 30 |
| 东北林区 | LONG_FAST | 4 | 27 |
| 南方多雨山林 | LONG_FAST | 4 | 27 |
| 东南沿海丘陵 | LONG_FAST | 4 | 27 |
| 西北荒漠戈壁 | VERY_LONG_SLOW | 7 | 30 |
| 青藏高原 | LONG_SLOW | 5 | 30 |
| 盆地河谷 | LONG_FAST | 4 | 27 |
| 城中村高楼遮挡 | SHORT_FAST | 3 | 20 |
| 工业区电磁复杂 | SHORT_FAST | 3 | 20 |

> 实际数值可在 `ENV_TEMPLATES` 中按实测算迭代；这属于「可配置、不破架构」的范畴。

## 4. 固件适配说明（firmware 侧）

MeshROC 固件本就是 Meshtastic 分支，其 USB CDC 已默认暴露上述序列配置 API（`StreamAPI` 帧格式已核实），
**因此网络客户端开箱即用，固件无需为「互通」做任何改动**。

若日后要把官网强调的「国产电源芯片 / 深度射频优化」也做成网页可调，方向是：
在固件侧新增 `AdminMessage` 字段（或在 `LoRaConfig` 外挂一个 `meshroc` 子消息）承载
IP5326/MAX17055 遥测与「环境模板编号」，Web 客户端 `set_config` 时一并下发。该扩展独立于现有互通协议，
可渐进合入。当前 `/client` 已用标准字段把「环境模板」落地，固件自动按对应 `LoRaConfig` 工作。

### 4.1 反转重构后的自研接口（过渡说明）

> 与本文「沿用标准协议」互补，而非替代。详见 [优化路线图](/roadmap) 与固件仓库 `docs/meshroc-preservation-contract.md` §12。

固件正进行内核反转重构，将在保留上述标准 protobuf 通道的**同时**，新增自研 REST 通道
`/api/v1/meshroc/*`（返回 JSON，与原版 protobuf 端点协议隔离），承载自研资产运维：

- `GET /api/v1/meshroc/config` / `PUT /api/v1/meshroc/config` —— 读写 `MeshROCConfig`（自研角色、RAP 参数、GATEWAY 桥接）
- `GET /api/v1/meshroc/role` —— 读本机角色与转发判据
- `GET /api/v1/meshroc/rap/topology` / `rap/routes` —— RAP 归属表与定向路由表
- `GET /api/v1/meshroc/gateway/status` / `POST .../gateway/reconnect` —— GATEWAY 桥接状态与重连

标准通道（Meshtastic APP 蓝牙/GATT、`/api/v1/*`）继续保留以保证 100% 兼容；自研通道**只增不改**原版行为。
本文 §2~§3 的 SDK 仍适用于标准通道；自研通道将由 `src/lib/meshroc-device/` 增加一层 JSON client 对接。

## 5. 日后扩展点（备用清单）

- **新增报文类型**：在 `protobuf.ts` 的 `SCHEMAS` 追加消息/字段即可（如火灾告警、水文遥测），`client.ts` 增加对应 `sendXxx`。
- **蓝牙 / 网络传输**：在 `framing.ts` 增加 `openBluetooth()` / `openHttp()` 实现 `SerialHandle` 接口，上层无需改动。
- **地图面板**：订阅 `node_info.position`，用 Leaflet 复刻 MeshCore `map` 的节点标点。
- **更多配置 UI**：`FromRadio.config` 已含 `device` / `lora` 子消息，按需在前端表单展开。
- **固件专属遥测**：如上节，扩展 `AdminMessage` 后在此 SDK增加 `requestMeshROCStats()`。

> 设计原则：协议细节全部收敛在 `src/lib/meshroc-device/`，页面只依赖 `useMeshROCClient()` 暴露的
> `connect / sendText / setOwner / setChannelName / applyEnvTemplate / nodes / messages / metadata …`，
> 与具体传输实现解耦。
