---
title: "MeshSense：Meshtastic 桌面端 FAQ"
date: "2025-01-04"
description: "MeshSense 的 FAQ 中文版，涵盖功能介绍、系统要求、连接方法、设置选项以及实时演示等内容，帮助用户快速上手并深入了解这款 Meshtastic 桌面客户端。"
slug: "meshtastic-desktop-client-meshsense-faq"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-desktop-client-meshsense-faq/

以下内容是对 MeshSense 官网常见问题解答（FAQ）的中文翻译，旨在方便 MeshCN 中文社区的读者了解这款 Meshtastic 第三方 PC 桌面端的功能和使用方法。

英文原文可在此链接查看：[MeshSense FAQ](https://affirmatech.com/meshsense/faq)。

若翻译与原文存在出入，请以英文原文为准。希望这篇翻译能帮助大家更好地了解和使用 MeshSense！

在开始阅读 FAQ 前，推荐大家先浏览 Meshtastic 中文社区最近发布的关联文章：《[MeshSense：填补 Meshtastic 桌面端空白的利器](https://meshcn.net/meshtastic-desktop-client-meshsense-introduction/)》。这篇文章详细介绍了 MeshSense 的核心功能和使用场景，配合本 FAQ 能帮助你更全面地了解这款工具。

## 什么是 MeshSense？

MeshSense 是一款开源的电脑应用程序，可监控、映射并图形化显示你所在区域 Meshtastic 网络的关键数据，包括已连接节点、信号报告、Traceroute 信息等！它通过蓝牙或 WiFi 与 Meshtastic 节点直接连接，持续提供评估网络健康状况所需的所有信息。

## MeshSense 是开源的吗？

是的，MeshSense 的源代码可以在 GitHub 上找到：[点击这里](https://github.com/Affirmatech/MeshSense)。

## 有 MeshSense 的使用手册吗？

目前 MeshSense 没有详细的使用手册。但多数用户发现它非常直观，通过简单尝试以及以下常见问题解答，你可以快速上手。

## 系统要求是什么？

MeshSense 支持以下平台：

- Windows（X64）

- Linux（X64）

- Mac（arm64）

## 我在哪里可以下载 MeshSense？

你可以通过 [这个链接](https://affirmatech.com/meshsense) 下载并安装 MeshSense。

## 是否可以看到 MeshSense 的实时演示？

可以！你可以访问 [演示节点](https://affirmatech.com/meshsense/FJP1/)，它安装在 70 英尺高的树上，实时展示节点活动、信号报告、位置、跳数、Traceroute 等数据。如果地图暂时无法显示，请稍等片刻，系统会自动重新连接。

## 如何将我的节点连接到 MeshSense？

你可以通过蓝牙或 WiFi 将节点连接到 MeshSense：

- 蓝牙：节点会出现在蓝牙设备列表中。你可能需要先在操作系统中将其添加为已识别设备。点击设备名称并选择 连接。详细操作请参阅 [蓝牙连接指南](https://affirmatech.com/meshsense/bluetooth)。

- WiFi：将节点加入本地网络，在设备 IP 字段中输入其 IP 地址，然后点击 连接。仅在节点要求时启用 TLS 选项。

## 节点名称旁的图标有什么作用？

- 🔍：显示节点的原始 JSON 信息。

- ↯：向选定节点发送 Traceroute 请求。

- 🌐：将地图居中于选定节点。

- 📡：请求节点位置数据。

## 如何发送消息？

在左下方的下拉列表中选择频道或节点，输入消息后按 Enter 键或点击 发送 按钮。

## 可以为接收消息设置声音提醒吗？

可以。你可以在 设置 菜单中启用或禁用接收消息的声音提醒。

## 接收的数据包会显示多长时间？

数据包会保存到日志大小限制（默认为 500 条）超出为止。你可以在 设置 菜单中调整这一限制。

## MeshSense 多久发送一次自动 Traceroute 请求？

MeshSense 会在以下情况下发送 Traceroute 请求：

1. 自动 Traceroute 功能已启用。

2. 缺少 Traceroute 数据或跳数发生变化。

3. 自上次请求以来已过 15 分钟（默认值）。

Traceroute 数据会在关闭程序时被清除。你可以在 设置 菜单中禁用或限制自动 Traceroute 的频率。

## 设置 菜单有哪些选项？

点击齿轮图标 ⚙ 访问 设置 菜单，选项包括：

- 日志大小限制：设置 RAM 中保留的数据包数量。

- 消息前缀/后缀：在消息前后添加自定义文本。

- 自动 Traceroute 请求：启用/禁用自动 Traceroute。

- Traceroute 频率限制：设置 Traceroute 请求的时间间隔。

- 节点不活动超时时间：定义隐藏不活跃节点的时间。

- 远程连接：允许远程设备发送消息。

- 启动时自动连接：在启动时自动连接节点。

- 远程访问地址：允许其他设备访问 MeshSense。

- 特权/客户端访问密钥：设置远程操作的密钥。

## 可以在没有图形界面的服务器上运行 MeshSense 吗？

可以。从 1.0.15 版本开始，你可以使用 `--headless` 参数运行 MeshSense，无需图形界面。

## 黑白颜色并带问号的节点是什么？

这些节点没有位置数据，通过 Traceroute 平均计算距离已知节点的距离推断得出。

## 我如何为 MeshSense 的开发贡献力量？

> 译者注：这是原文的捐赠链接，和 MeshCN 社区无关。

感谢你的支持！你的贡献将帮助我们改进 MeshSense。[点击这里捐赠](https://purchase.affirmatech.com/?productId=MeshSenseDonation)。
