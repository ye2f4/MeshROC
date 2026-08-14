---
title: "如何为 GAT562 烧录或更新 Meshtastic 固件"
date: "2025-05-08"
description: "GAT562 是一款内置电池、天线和屏幕的成品 Meshtastic 手持设备，本文将介绍如何通过 UF2 固件文件，为这款基于 nRF52 的设备更新或烧录 Meshtastic 固件，适合新手用户快速上手。"
tags:
  - "GAT562"
  - "Meshtastic"
  - "nRF52"
slug: "GAT-IOT-handheld-flash-meshtastic-firmware"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/GAT-IOT-handheld-flash-meshtastic-firmware/

GAT562 Mesh Trial Tracker 是一款真正意义上的「开箱即用」Meshtastic 手持设备，成为目前国内最适合新手用户的 Meshtastic 成品设备之一。

它是目前少有支持 LoRa 主流频段的成品 Meshtastic 手持设备，分为两个频段版本（SKU）：

- 低频版本（LF）：支持 433 MHz - 510 MHz，适用于中国市场，是目前国内 Meshtastic 用户最推荐的频段选择。

- 高频版本（HF）：支持 860 MHz - 925 MHz，适用于欧洲、美洲、澳大利亚等海外地区。

这两个版本基本覆盖了全球主要 LoRa 频段，包括：

| 频段 | 地区 / 用途 |
| --- | --- |
| 433 MHz | 中国、欧洲、部分亚洲地区 |
| 470 MHz | 中国 LoRa 频段 |
| 868 MHz | 欧洲 LoRa 主用频段 |
| 915 MHz | 北美（美国、加拿大）、澳大利亚、新西兰等地区使用 |

换句话说，不论你身处国内还是海外，GAT562 都具备良好的适配性，能够满足全球 Meshtastic 用户的频段需求。

![GAT562 开箱即用的 Meshtastic 手持 nRF52 设备海报](https://meshcn.net/GAT-IOT-handheld-review/Meshtastic-handheld-GAT562-Mesh-Trial-Tracker-GAT-IOT-poster.webp)

👉 点此阅读评测：[《抢先体验：第一款国内 LoRa 主流频段的开箱即用 Meshtastic 手持设备》](https://meshcn.net/GAT-IOT-handheld-review/)

如果你已经拿到这款设备，想体验 Meshtastic 固件的最新特性，或者后续官方发布了新版本固件，想手动进行更新，那么本教程将一步步指导你完成烧录操作。

不同于传统的 ESP32 烧录流程，GAT562 基于 Nordic 的 nRF52 芯片，支持通过 UF2 文件实现简单易用的拖拽式固件更新方式，过程类似于「拷贝文件到 U 盘」这么简单。

## ⚠️ 前置说明

当前 GAT562 的独立设备型号尚未正式纳入 Meshtastic 官方固件列表。因此，在烧录时，我们可以选择与 GAT562 硬件配置一致的设备型号——RAK4631。两者均基于 nRF52 系列芯片，并具有兼容的屏幕与引脚定义。

目前，我也在贡献开源代码，为 GAT562 的固件适配做准备。如果未来正式纳入固件支持设备列表，本文将会第一时间更新。

## 🧰 准备工作

烧录 GAT562 之前，请准备好以下工具和设备：

1. 一台安装了 Windows/macOS/Linux 操作系统的电脑

2. 一根支持数据传输的 USB Type-C 数据线

3. 一枚 GAT562 设备

4. 使用 Chrome 浏览器打开 [Meshtastic Flasher 在线烧录工具](https://flasher.meshtastic.org/)

5. （可选）一根回形针、卡针或牙签，用于按压隐藏的 Reset 按钮

## 🔌 步骤一：连接 GAT562 到电脑

将 USB Type-C 数据线插入 GAT562 底部的充电口，另一端连接到电脑。

注意：请务必使用支持数据传输的线缆。某些充电专用线只能供电，无法完成后续烧录步骤。

## 🔍 步骤二：进入 Bootloader 模式

GAT562 使用的是 nRF52 MCU，支持 UF2 格式的固件升级方式。要想进行烧录，必须先让设备进入 Bootloader 模式。

你可以按以下方式操作：

1. 在 USB Type-C 接口右侧，有一个很小的隐藏圆孔。

2. 使用卡针或回形针插入该孔，快速 双击 内部的 Reset 按钮（不是长按！是短时间内点按两次）。

3. 成功后，设备会进入 Bootloader 模式，并作为一个可移动磁盘出现在你的电脑上。

在 Windows/macOS/Linux 系统中，你会看到一个类似 “GAT562BOOT” 或 “RAK4631BOOT” 的磁盘卷标。打开它，你将看到以下文件：

- `CURRENT.UF2`

- `INFO_UF2.TXT`

- `INDEX.HTM`

## 🌐 步骤三：访问 Meshtastic 在线烧录工具

打开 Chrome 浏览器，访问：

👉 [https://flasher.meshtastic.org/](https://flasher.meshtastic.org/)

你会看到一个简洁的页面，提供以下选项：

- 选择设备型号（Device）

- 选择固件版本（Stable 或 Beta）

- 下载固件（Download）

- 使用 Web Serial 烧录（适用于 ESP32）

- 手动下载 UF2 文件（适用于 nRF52）

## 📥 步骤四：选择 RAK4631 并下载 UF2 固件

在页面中选择设备型号为 RAK4631（与 GAT562 相兼容），然后点击下载按钮。

选择最新的 Stable 版本（通常推荐），点击下载即可。下载的文件名类似如下格式：

```

firmware-rak4631-2.3.1-1dca8bd.uf2
```

你无需解压，保留这个 `.uf2` 文件即可。

## 🗂 步骤五：拷贝 UF2 到设备磁盘

将下载好的 `.uf2` 文件直接拖动或复制粘贴到步骤二中出现的 “GAT562BOOT” 或 “RAK4631BOOT” 磁盘中。

在拷贝文件接近完成时，系统可能会提示「磁盘不可用」或「设备被移除」，这属于正常现象！

原因是 GAT562 在收到 UF2 文件后，会立刻重启并退出 Bootloader 模式，开始运行新固件。这时，U 盘设备会自动从电脑中移除，不需要人为干预。

## ✅ 步骤六：确认是否烧录成功

设备重启后，你将看到 GAT562 的屏幕亮起，并加载 Meshtastic UI。

此时请留意：

- 屏幕右上角会显示当前固件版本号（例如 `2.3.1`）

- 版本号与刚刚烧录的 UF2 文件一致，表示升级成功

- 可以使用 Meshtastic App（手机蓝牙）连接，进行参数设置和网络配置

> 固件烧录后重要设置：屏幕显示异常的解决办法

> GAT562 使用的是 1.3 英寸 OLED 屏幕，但由于目前使用了 Meshtastic RAK4631 的固件，默认的屏幕驱动设置为 「Auto Detect（自动识别）」，会出现像素错位的问题：屏幕最右侧一列像素被挪到了最左边。

> 这个问题不会影响设备功能，但会影响显示美观。解决办法很简单：

> 1. 打开 Meshtastic App（安卓或 iOS）

> 2. 点击右上角设备图标，进入设置页面

> 3. 找到 `Display Driver（屏幕驱动）` 设置项

> 4. 将默认的 `Auto Detect` 手动修改为 `oled_ssd1306`

> 5. 应用设置并重启设备

> 修改后，屏幕显示将恢复正常。

## 🧩 常见问题解答

### Q1：GAT562 没有出现在我的电脑中，怎么办？

请确认以下几点：

- 是否使用了支持数据传输的 USB 数据线？

- 是否正确 双击 Reset 按钮（不要长按）？

- 是否设备电量充足？（建议边充电边操作）

- 是否操作系统对可移动磁盘有权限限制？（可尝试换台电脑）

### Q2：拷贝 UF2 后弹出磁盘错误？

这不是错误，而是预期行为。因为设备在接收到新固件后，会自动重启并退出 Bootloader 模式，电脑系统会将其识别为「意外弹出」，但这是正常过程。

### Q3：烧录后设备黑屏？

请确认是否下载了适配的固件文件（RAK4631），且操作正确。黑屏可能是以下几种原因：

- 烧录过程中断电

- 使用了错误的 UF2 文件

- 拷贝过程未完成即拔出设备

可重新进入 Bootloader 模式，再次烧录。

## 🎉 恭喜！你已经成功为 GAT562 烧录 Meshtastic 固件

GAT562 作为一款定位于「成品」设备的 Meshtastic 手持终端，其烧录流程也尽可能地优化简化——相比 ESP32 需要串口驱动、烧录器和命令行工具，nRF52 的 UF2 模式几乎做到了「零门槛」：只需双击、拖文件，即可完成升级。

未来我们也会持续跟进 GAT562 在 Meshtastic 固件的适配进展，一旦官方加入独立型号支持，我们将更新本文，指导用户正确选择 GAT562 固件型号进行烧录。

如果你在使用 GAT562 过程中遇到问题，欢迎加入 [MeshCN 微信交流群](https://meshcn.net/contact/)，和我们三百多位社区用户一起讨论与分享。

截至 2025 年 5 月，GAT562 Mesh Trial Tracker 的官方 GitHub 仓库 GAT-IOT 也公开了硬件原理图与 PCB gerber 生产文件，感兴趣的玩家可访问 [GAT562 项目页](https://github.com/quhyhao/GAT562)，尝试自行 DIY 或为后续二次开发做准备。
