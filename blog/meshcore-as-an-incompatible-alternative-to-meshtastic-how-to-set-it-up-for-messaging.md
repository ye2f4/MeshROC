---
title: "MeshCore 入门：另一种离网消息网络的可能性"
date: "2025-10-27"
description: "在 LoRa 自组网的世界里，Meshtastic 几乎是“默认答案”。但最近出了个新项目——MeshCore，正悄悄地在全球各地生根发芽。它不兼容 Meshtastic，却又能在完全离线的环境下传递加密消息；它既是一个 C++ Mesh 网络库，也是可直接刷入 Heltec、GAT562 等设备的固件。不同于 Meshtastic 那种占用过高的洪泛网络，MeshCore 更克制、更安静，也更可"
tags:
  - "MeshCore"
slug: "meshcore-as-an-incompatible-alternative-to-meshtastic-how-to-set-it-up-for-messaging"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshcore-as-an-incompatible-alternative-to-meshtastic-how-to-set-it-up-for-messaging/

> 翻译声明

> 本文翻译自捷克 Petr Šrámek 的文章《 [MeshCore as an (incompatible) alternative to Meshtastic? How to set it up for messaging?](https://chiptron.eu/meshcore-as-an-incompatible-alternative-to-meshtastic-how-to-set-it-up-for-messaging/) 》。

在捷克共和国，MeshCore 作为流行离网文字通信系统 Meshtastic 的一种替代方案，正变得越来越受欢迎——那你所在的国家呢？捷克社区迅速形成并扩展了 MeshCore 网络的覆盖范围，该网络基于支持 LoRa 的无线电设备运行。

本文将带你了解 MeshCore 的工作原理、与 Meshtastic 的区别、支持的硬件，以及如何配置。

## 什么是 MeshCore

与 Meshtastic 类似，MeshCore 也使用同样频段的 LoRa 无线电模块。从这一点来看，MeshCore 与 Meshtastic 是相同的。

MeshCore 的目标是在无网络环境下实现可靠的信息传输——它不依赖任何服务器。凭借这一点，MeshCore 很快成为一个被广泛讨论的替代方案，它与更知名的 Meshtastic 在许多方面相似，但也存在显著差异。

## MeshCore 的工作原理

MeshCore 既是一个 C++ 的网状网络库，也是一套可直接烧录到设备上的固件（例如 Heltec、RAK Wireless 等）。

搭载 MeshCore Companion 固件的设备可以：

- 发送与接收加密文字消息，无需中央服务器或互联网；

- 建立一个 mesh 网络，每个中继节点都可以转发消息至其他节点——这就是所谓的 多跳路由（multi-hop routing）；

- MeshCore 支持手动路由（固定路径）与自动路由。用户可根据需求对网络数据流进行更精确控制，使网络更加“安静”（减少状态广播）；

- “MeshCore 的第一条私信会以 Flood 方式发送；一旦消息成功传递，系统会记住路径，后续消息仅沿该路径发送。如果失败，再次以 Flood 方式重发。”

- Meshtastic 虽使用 [受控洪泛（managed flooding）](https://meshcn.net/why-meshtastic-uses-managed-flood-routing/) 并以 TTL（生存时间）限制消息传播，但仍常被批评为“网络噪声大”；

- MeshCore 的功耗较低，非常适合太阳能或电池供电设备。能耗表现取决于所用硬件。

![Meshcore 天线](https://chiptron.eu/wp-content/uploads/2025/07/meshcore.webp)

## MeshCore 相比 Meshtastic 的优劣势

优势：

- 更高的灵活性：由于开放的库架构，开发者可以创建特定网络方案，将 MeshCore 集成至更复杂系统中；

- 改进的路由机制：支持手动设置消息路径或使用固定路径，从而在复杂网络拓扑中获得更稳定的传输；

- 更低的网络拥塞：状态消息更少，适合大型或能耗受限的网络；

- 商业许可友好：MeshCore 采用 MIT 开源许可，允许商业闭源项目使用。

劣势：

- 社区规模较小：使用者少，缺少丰富的教程与论坛支持；

- 节点角色由固件定义：无法在不重新刷固件的情况下动态改变节点角色；

- 网络密度较低：由于与 Meshtastic 网络不兼容，在部分地区节点较少；

- 缺乏 MQTT 与互联网扩展特性：MeshCore 专注于纯离线网状通信，不提供 Meshtastic 所具备的网络桥接功能。

值得注意的是，两者虽使用相同频段，但互不兼容。

## 支持的硬件

与 Meshtastic 类似，MeshCore 支持几十种设备，可用于测试和搭建本地网络。

常见支持设备包括：

- Liligo：T-Deck、T-Beam、LoRa32 等；

- Heltec：Lora32 V2/V3、T114、Wireless ePaper 等；

- RAK Wireless：RAK WisBlock / WisMesh（RAK4631 模组）；

- Seeed Studio：XIAO C3、C6、S3、nRF52 等；

- RP2040 平台：Raspberry Pi Pico + WaveShare SX1262 扩展板。

- 支持的设备里，还包含了当前 MeshCN 社区里最火热的 [GAT562](https://meshcn.net/GAT-IOT-handheld-review/) —— GAT-IOT 的 Meshtastic 手持设备；

- 以及 LoRa mesh 社区自制的 [FakeTec 节点 —— 一款开源、超低成本的 nRF52 LoRa 板卡](https://meshcn.net/what-is-fakeTec-opensource-diy-meshtastic-project/)，其外形与 Heltec V3 兼容，只需少量焊接即可完成组装。FakeTec 最早在 GitHub 开源后，被 MeshCN 社区玩家广泛采用，用于打造太阳能节点、超长待机节点等实验项目。凭借约 30 元人民币的总体成本和极低功耗，它几乎成为国内 DIY 玩家入门 Meshtastic / MeshCore 的第一个节点。

其中基于 nRF52（如 RAK4631）的方案功耗最低。

## 示例配置

原文内容：捷克社区目前使用的推荐参数

捷克社区目前使用的推荐参数如下：

![Meshcore 在捷克的推荐配置](https://chiptron.eu/wp-content/uploads/2025/07/meshcore_cr_nastaveni.webp)

| 参数 | 值 |
| --- | --- |
| 频率 | 869.525 MHz |
| 带宽 | 62.5 kHz |
| 扩频因子（SF） | 7 |
| 编码率（CR） | 5 |
| 发射功率 | 22 dBm |

要注意的是，这不是 MeshCN 在中国推荐的配置，在中国我们推荐使用 470 MHz 频段。

以下参数由 MeshCN 社区里的 MeshCore 资深玩家 *深圳-狐狸先生* 推荐，已在多地进行过测试：

| 参数 | 值 |
| --- | --- |
| 频率 | 495.200 MHz |
| 带宽 | 125 kHz |
| 扩频因子（SF） | 9 |
| 编码率（CR） | 5 |

该配置兼顾通信距离与消息可靠性，适合中国地区使用 470 MHz 频段的 Heltec、GAT562、RAK4631 等设备。

## 烧录示例（以 Heltec LoRa V3.1 为例）

> ⚠️ 警告：带外接天线接口的设备在未连接天线时严禁通电或发射，否则可能损坏射频芯片。

![MeshCore 在线烧录工具](https://chiptron.eu/wp-content/uploads/2025/07/img-20250727-wa00321850466681668814235-1340x781-1.webp)  

MeshCore 在线烧录工具

将设备通过 USB-C 连接电脑，访问 [https://flasher.meshcore.co.uk/](https://flasher.meshcore.co.uk/)，选择支持的设备（如 Heltec LoRa V3.1），选择通信方式（USB、蓝牙等），然后点击 FLASH 按钮。固件烧录完成后，系统会提示通过蓝牙与手机应用配对。

在手机端 MeshCore 应用中输入设备屏幕上显示的 PIN 码进行连接。

![蓝牙配对失败界面](https://chiptron.eu/wp-content/uploads/2025/07/meshcore_bluetooth_wrong_pin.webp)

蓝牙配对失败界面

若出现错误提示（如上图），可在手机蓝牙设置中“忽略设备”，然后重新配对。注意 PIN 并非固定的 123456，而是设备 OLED 屏上显示的动态生成 PIN。

## 参考链接

项目主页：[https://meshcore.co.uk/](https://meshcore.co.uk/)  

固件烧录网页：[https://flasher.meshcore.co.uk/](https://flasher.meshcore.co.uk/)  

Wiki：[https://github.com/ripplebiz/MeshCore/blob/main/docs/faq.md](https://github.com/ripplebiz/MeshCore/blob/main/docs/faq.md)

## App 截图

![路径追踪](https://chiptron.eu/wp-content/uploads/2025/07/img_20250728_002224_8572202735909629805194-315x654-1.webp)  

路径追踪

![节点可见的其他客户端](https://chiptron.eu/wp-content/uploads/2025/07/img_20250728_002244_684347442449667477236-317x654-1.webp)  

节点可见的其他客户端

![消息记录](https://chiptron.eu/wp-content/uploads/2025/07/img_20250728_002424_2515803300749807136047-316x654-1.webp)  

消息记录

![节点可见的其他客户端（详情）](https://chiptron.eu/wp-content/uploads/2025/07/img_20250728_002429_9938584647272029917089-494x654-1.webp)  

节点可见的其他客户端（详情）
