---
title: "折腾了 20 台设备后，我终于搞懂了 Meshtastic 的续航秘密"
date: "2025-03-11"
description: "本着实测为王的原则，折腾了 20 多台 Meshtastic 设备，试图搞清楚影响续航的真正因素。Light Sleep 省电模式到底有多香？不同的 MCU 真的会影响待机时间？700mAh 和 3000mAh 的电池差距到底有多大？一系列扎实的实验数据，带你深入了解 Meshtastic 续航的全部真相。"
tags:
  - "nRF52"
  - "Heltec"
  - "ESP32"
  - "T114"
slug: "meshtastic-battery-runtime-tests"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-battery-runtime-tests/

社区成员 HarukiToreda 最近进行了一项[重要实验](https://harukitoreda.github.io/Meshtastic-Experiments/Battery-Runtime-Tests)，他测试了多款设备在运行 Meshtastic 固件时的续航和功耗，并详尽记录了数据。这项研究对于所有 Meshtastic 设备的使用者来说，都是极具参考价值的参考资料。

在此基础上，我对数据进行了重新整理和分析，使其更加直观易读，并添加了注释，以帮助读者更好地理解测试结果。

在前两个实验中，测试设备主要是常见的 Meshtastic 开发板。根据所搭载的 MCU，这些开发板大致可分为两类：一类使用 ESP32/ESP32-S3，另一类则采用 nRF52。

使用 ESP32 或 ESP32-S3 的测试设备：

- Heltec ESP32 V2、V3.1、V3.2（一般称为 Heltec LoRa32 V2/V3，简称 Heltec V2/V3）

- Heltec Wireless Paper

- Heltec Wireless Stick Light

- Heltec Wireless Tracker

- Heltec Vision Master E213

- Heltec Vision Master E290

- Lilygo T-Deck

使用 nRF52 的测试设备：

- Heltec T114

- RAK19007（RAK4631）

- RAK19003（RAK4631）

- Seeed Studio T1000E

在最后一个测试中，测试设备为 Standalone 的 Meshtastic 设备。在 Meshtastic 领域，Standalone Device（独自运行的设备）是指无需依赖智能手机或电脑，即可独立运行 Meshtastic 并完成消息发送、接收和网络管理等功能的设备。

这类设备通常集成 LoRa 通信模块，允许用户直接在 Meshtastic 网络中进行通信，同时配备输入方式（如物理按键或全键盘） 以及显示屏幕（如 OLED、LCD 或 e-Ink 电子墨水屏），用于操作和查看消息。

Standalone 设备一般具备内置电池供电，确保在户外或应急环境中能够长时间运行。此外，一些设备还集成了 GPS 模块以实现位置共享，或带有蜂鸣器、振动马达以提供通知提醒。

常见的独立设备包括 Lilygo T-Deck、Hel-Txt、Nrf-Txt、Meshenger，它们的核心特点是能够完全脱离手机，在 Meshtastic 网络中独立发送、接收和管理消息，适用于户外探险、应急通信、战术通信等场景。

## 实验 1 - 默认设置下的续航表现

### 实验条件

- 固件版本: 2.5.7

- 工作模式: 客户端模式

- 屏幕超时: 60 秒

- 节能模式（Power Savemode）: 关闭

- 频率: 906 MHz

- 蓝牙: 持续连接到 Android 手机

适用场景：移动节点 / 远程节点

### 续航对比表

| 设备型号 | MCU | 700mAh | 1100mAh | 2000mAh | 3000mAh |
| --- | --- | --- | --- | --- | --- |
| Heltec ESP32 V2 | ESP32 |  | 21 小时 | 41 小时 | 60 小时 |
| Heltec ESP32 V3.1 | ESP32 |  | 10 小时 | 21 小时 | 30 小时 |
| Heltec ESP32 V3.2 | ESP32 |  | 10 小时 |  |  |
| Wireless Paper | ESP32 |  | 9 小时 | 20 小时 | 30 小时 |
| Wireless Stick Light | ESP32 |  | 10 小时 | 20 小时 |  |
| Heltec Wireless Tracker | ESP32 |  | 9 小时 | 13 小时 | 19 小时 |
| Vision Master E213 | ESP32 |  |  | 19 小时 |  |
| Vision Master E290 | ESP32 |  |  |  |  |
| Lilygo T-Deck | ESP32 |  | 10 小时 | 18 小时 | 26 小时 |
| Heltec T114 (GPS 关) | nRF52 |  | 104 小时 | 220 小时 |  |
| Heltec T114 (GPS 开) | nRF52 |  | 62 小时 | 119 小时 | 215 小时 |
| RAK19007 (RAK4631) | nRF52 |  | 154 小时 | 307 小时 | 442 小时 |
| RAK19003 (RAK4631) | nRF52 |  | 156 小时 |  | 453 小时 |
| T1000E (GPS 关) | nRF52 | 64 小时 | - | - | - |
| T1000E (GPS 开) | nRF52 | 51 小时 | - | - | - |

## 实验 2 - 移动节点/远程节点的最佳省电模式

### 实验条件

- 固件版本: 2.3.17

- 工作模式: 客户端模式

- 屏幕超时: 60 秒

- 节能模式[[1]](#fn1): 开启（ESP32 设备会在没有流量时进入 Light Sleep 模式）

- 蓝牙等待时间[[2]](#fn2): 10 秒

- Light Sleep 持续时间[[3]](#fn3): 1800 秒（30 分钟）

- 频率: 906 MHz

- 蓝牙: 持续连接到 Android 手机

适用场景：移动节点 / 远程节点

### 续航对比表

| 设备型号 | MCU | 1100mAh | 2000mAh | 3000mAh |
| --- | --- | --- | --- | --- |
| Heltec ESP32 V2 | ESP32 | 30 小时 | 74 小时 | 119 小时 |
| Heltec ESP32 V3.1 | ESP32 | 19 小时 | 44 小时 | 80 小时 |
| Heltec ESP32 V3.2 | ESP32 | 61 小时 |  | 156 小时 |
| Wireless Paper | ESP32 | 51 小时 |  | 173 小时 |
| Wireless Stick Light | ESP32 |  |  |  |
| Heltec Wireless Tracker | ESP32 |  |  |  |
| Vision Master E213 | ESP32 |  |  |  |
| Vision Master E290 | ESP32 |  |  | 156 小时 |
| Lilygo T-Deck | ESP32 | 21 小时 | 35 小时 | 54 小时 |
| Heltec T114 (GPS 关) | nRF52 |  |  |  |
| Heltec T114 (GPS 开) | nRF52 |  |  |  |
| RAK19007 (RAK4631) | nRF52 |  |  | 442 小时 |
| RAK19003 (RAK4631) | nRF52 |  |  | 453 小时 |
| T1000E (GPS 关) | nRF52 | - | - | - |
| T1000E (GPS 开) | nRF52 | - | - | - |

## 实验 3 - 独自运行的节点设备-最佳省电模式

测试设备为 Standalone 的 Meshtastic 设备。在 Meshtastic 领域，Standalone Device（独自运行的设备）是指无需依赖智能手机或电脑，即可独立运行 Meshtastic 并完成消息发送、接收和网络管理等功能的设备。

这类设备通常配备输入方式（如物理按键或全键盘） 以及显示屏幕（如 OLED、LCD 或 e-Ink 电子墨水屏），用于独自发信息和查看消息。此外，Standalone 设备一般具备内置电池供电，确保在户外或应急环境中能够长时间运行。一些设备还集成了 GPS 模块以实现位置共享，或带有蜂鸣器、振动马达以提供通知提醒。

常见的独立设备包括 Lilygo T-Deck、Hel-Txt、Nrf-Txt、Meshenger，它们的核心特点是能够完全脱离手机，在 Meshtastic 网络中独立发送、接收和管理消息，适用于户外探险、应急通信、战术通信等场景。

### 实验条件

- 固件版本: 2.3.12

- 工作模式: 客户端模式

- 屏幕超时: 60 秒

- 节能模式[[1:1]](#fn1): 开启（ESP32 设备会在没有流量时进入 Light Sleep 模式）

- Light Sleep[[3:1]](#fn3) 持续时间: 1800 秒（30 分钟）

- 频率: 906 MHz

- 蓝牙: 持续连接到 Android 手机

- 已经安装 [CardKB I2C 键盘](https://meshcn.net/how-to-add-keyboard-to-your-meshtastic-node/)，T-Deck 则自带黑莓样式键盘。

适用场景：脱离手机独自运行节点

### 续航对比表

| 设备型号 | 开发板 | MCU | 4000mAh |
| --- | --- | --- | --- |
| Hel-txt (GPS 关) | Heltec LoRa32 V3 | ESP32 | 264 小时 |
| Hel-txt (GPS 开) | Heltec LoRa32 V3 | ESP32 | 108 小时 |
| Nrf-txt (GPS 关) | Heltec T114 | nRF52 | 276 小时 |
| Nrf-txt (GPS 开) | Heltec T114 | nRF52 | 198 小时 |
| Meshenger (GPS 关) |  | nRF52 | 166 小时 |
| Meshenger (GPS 开) |  | nRF52 | 175 小时 |
| Lilygo T-Deck |  | ESP32 | 71 小时 |

## 结论

从以上三组实验中可以发现，芯片平台差异对 Meshtastic 设备的续航影响最为显著。

nRF52 芯片平台（如 Heltec T114、RAK19007、RAK19003 以及 Seeed T1000E 等）普遍比 ESP32/ESP32-S3 平台（如 Heltec V2/V3 系列、Lilygo T-Deck 等）拥有更低的待机和工作功耗。在默认设置的相同电池容量下，nRF52 平台往往能够轻松实现数天至一周以上的续航，而使用 ESP32/ESP32-S3 的设备通常只能维持几十小时的续航时间。

如果设备需要更长的离线运行，或在应急通信场景里需要尽量延长使用周期，nRF52 平台会更具优势。这说明在硬件选型上，选择低功耗 MCU 是提升续航最直接的手段。

从功耗管理策略的角度看，实验 2 和实验 3 的测试进一步证明了睡眠模式对续航影响极为关键。

以开启 Light Sleep 为例，同样是 ESP32 平台的设备，在启用省电模式后，其可运行时间从仅有十几到数十个小时跃升至上百小时。nRF52 平台在默认模式下本就功耗较低，若再进一步配合省电模式，也可以获得数百小时的续航表现。

因此，合理设置省电参数（如 Light Sleep 的持续时间、蓝牙等待时长、屏幕超时等）是第二个提升续航的关键。应当尽量避免频繁唤醒和不必要的功耗支出，让设备保持在低功耗状态的时间越长越好。

GPS 功能是很多 Meshtastic 设备的亮点，但从实验数据可见，其耗电量并不容小觑。无论是 Heltec T114（从 GPS 关闭时的百余小时续航到 GPS 开启时的几十小时）、还是独立设备 Hel-txt、Nrf-txt（从 264 小时或 276 小时降到一百余小时），GPS 的持续运行都会带来明显的耗电增加。

为此，用户需要根据实际场景决定是否保持 GPS 常开。如果对地理位置信息并无特别需求，可以直接关闭 GPS；若必须不间断记录位置信息，也可尝试降低刷新频率或采用间歇工作模式。这样既能保证某种程度的定位需求，又能减少对电能的消耗。

在大幅提升 Meshtastic 设备续航时，应该先聚焦于选择更低功耗的 MCU 平台（如 nRF52 系列），随后在固件中开启并优化省电模式，将 GPS、屏幕、蓝牙连接以及其他外设做尽量按需的开启或关闭，最后再考虑通过增加电池容量来将省电策略的收益进一步放大。

这套组合拳在实验数据中被反复验证，尤其是在移动节点、远程节点和完全脱离手机的独立节点场景中，都有显著的续航改进。在实际使用中，如果能针对具体的应用需求和环境限制进行针对性的省电设置，大多数 Meshtastic 设备都可以比默认设置时获得数倍的续航提升。

再次感谢 HarukiToreda 进行这项实验，并欢迎大家访问他的原文进行更详细的阅读：[Battery Runtime Tests](https://harukitoreda.github.io/Meshtastic-Experiments/Battery-Runtime-Tests)。

---

1.

请注意，RAK 设备无法支持此模式。节能模式的目的是延长电池寿命，它通过在 ESP32 设备上启用 Light Sleep（轻度睡眠）模式来实现这一点。当网状网络中没有流量时，设备将进入 Light Sleep。节点在 Light Sleep 状态下仍会转发任何数据包，并在处理完成后继续睡眠。当网状网络中有活动、按下按键或达到设定的睡眠时间时，节点会从 Light Sleep 状态中唤醒。在 Light Sleep 模式下，蓝牙会进入睡眠模式，使节点的电流消耗极低。但是，在此模式下，你将无法使用应用程序更改设置。当节点醒来后，它会自动重新连接应用程序，并通知用户是否收到新的消息。在此时，你可以更改设置。 [↩︎](#fnref1) [↩︎](#fnref1:1)

2.

如果节点在此时间段内接收到数据包，它会保持唤醒状态，以便手机有足够的时间重新连接。 [↩︎](#fnref2)

3.

此设置决定了 Light Sleep（轻度睡眠）模式的持续时间，这样你可以根据需求，设定在何时重新连接远程节点，以便更改设备设置。 [↩︎](#fnref3) [↩︎](#fnref3:1)
