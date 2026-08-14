---
title: "Meshtastic 2.7 预览版登场：BaseUI 全新界面上线！支持更多输入方式，TFT 统一大升级！"
date: "2025-06-29"
description: "你还在用旧版 Meshtastic UI 那套朴素风吗？是时候迎接一场视觉与交互的全面进化了！Meshtastic 2.7 带来了期待已久的 BaseUI —— 这不仅是一次命名升级，更是四年来最大规模的界面重构。全新菜单栏、预设消息快捷入口、时区设置、收藏节点、数字时钟……甚至还有 Linux 摇杆支持和 MUI/BaseUI 一键切换，处处都透着为用户而生的用心。是时候点亮那块小小的屏幕，试试"
tags:
  - "OLED"
slug: "meshtastic-2-7-preview"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-2-7-preview/

没想到，Meshtastic 的更新速度这么快，距离上次我们 [翻译 Meshtastic 2.6 版本](https://meshcn.net/meshtastic-2-6-preview/) 才过了半年，2.7 版本就发布了。上次 2.6 版本里，引入了 MUI 和新的路由算法。

这次 2.7 版本，引入了新的 OLED UI BaseUI 和 Linux 摇杆支持，还统一了 TFT 屏幕的显示效果。

以下是社区成员 *深圳-Zero* 对 [Wio Tracker L1 Pro](https://meshcn.net/seeed-studio-wio-tracker-L1-hands-on/) 运行 BaseUI 的演示视频。

*深圳-Zero* 同时也策划了 MeshCN 社区举办 [首个线下活动](https://meshcn.net/meshtastic-china-meshcn-first-workshop-by-seeed-studio-2025/)，在 6 月 14 日于深圳完满结束，期间出席了五十位社区成员，气氛热烈。我后续会把当天的花絮照片和活动经过整理成一篇文章，让没能参加的读者也能感受一下现场的氛围。

目前，社区群里有很多大佬一直在推动 BaseUI 对 GAT562 的适配。甚至有大佬把 OLED/TFT 上显示中文的问题，也全都解决了。如果你想追踪最新的进展，可以加入我们 [Meshtastic 中文社区](https://meshcn.net/contact/) 的微信群和 QQ 群。

以下内容则翻译自 Meshtastic 官方博客文章《Meshtastic 2.7 Preview: UI Overhaul - Introducing BaseUI! + New Input Support + TFT Unification》。有兴趣的读者可以阅读 [原文](https://meshtastic.org/blog/meshtastic-2-7-preview/)。

## Meshtastic 2.7 预览版登场：BaseUI 全新界面上线！支持更多输入方式，TFT 统一大升级！

Meshtastic 2.7 预览版已经正式发布！这不仅是过去四年来对默认界面的**最大一次改造**，我们还正式为它取了个新名字：**BaseUI**！  

从界面视觉到使用逻辑，我们彻底重新设计、打磨、统一。新版 BaseUI 更直观、更强大、功能更多样，而且在不同的屏幕和设备上都能流畅使用。  

除此之外，还有更多惊喜：Linux 原生摇杆支持、TFT 屏幕支持 UI 自由切换，全部都安排上了！

## 什么是“预览版”？

就像过去的技术预览一样，2.7 目前还没有进入正式稳定版阶段。我们提前发布，是希望收集你们的使用反馈，发现隐藏的问题，进一步完善后再发布最终版。

**如果你是动手达人、早期测试者，或者只是单纯想抢先体验——现在就刷机试试，欢迎回来告诉我们你的感受！**

## 2.7 有哪些新变化？

### ✨ BaseUI 登场！名字 + 界面，双双焕新！

过去几年，我们在 OLED 或基础 TFT 屏上的默认 UI 一直没名字。大家都习惯叫它“那个 UI”……

但随着 MUI（Meshtastic UI）、InkHUD 等更强大界面的兴起，再加上这次大改版，是时候给它一个响亮的名字了：

**BaseUI**，全新的基础用户界面，焕然登场！

这不仅仅是“起个名”而已——新的 BaseUI 从底层重新设计，体验上也做了大量优化：

- 更直觉的操作逻辑

- 更丰富的独立功能

- 适配更多设备的分辨率和输入方式

即使是最基础的 T-Beam 或 Heltec 模块，现在也能享受“焕然一新”的 UI 体验！

#### 部分亮点功能包括：

- **直接在设备上设置地区和时区**，再也不用靠手机 App。

- **数字时钟显示**，支持 12/24 小时制。

- **收藏节点快捷入口**，常用联系人一目了然。

- **底部自动隐藏菜单栏 + 快捷操作菜单**，每个界面都能快速操作最常用的功能：

| 页面 | 快捷菜单功能 |
| --- | --- |
| 主页 | 休眠屏幕、发送预设消息 |
| 消息 | 删除最新消息、使用预设消息快速回复 |
| 定位 | 启用/禁用 GPS |
| LoRa | 一键切换 LoRa 区域（开机初始化也支持设定） |
| 系统 | 启用/禁用提示音，设定是否仅限通知或系统事件 |
| 时钟 | 设定时区（提供最常见选项列表） |
| 收藏 | 向收藏节点快速发送预设消息 |

看看全新 BaseUI 的动态演示吧！

👏 特别感谢这次参与 BaseUI 设计和开发的贡献者：[@JasonP](https://github.com/xaositek)、[@HarukiToreda](https://github.com/xaositek)、[@tropho](https://github.com/tropho23)、[@jp-bennett](https://github.com/jp-bennett)、[@thebentern](https://github.com/thebentern)。

### 🎮 Linux 摇杆支持来了！

用 Linux 设备跑 Meshtastic？现在，你可以直接用摇杆控制 UI！

这是为 [Waveshare 1.44" LCD HAT](https://www.waveshare.com/1.44inch-lcd-hat.htm) 设计的功能，但理论上兼容其他带摇杆的帽子（HAT 模块）。  

配合 BaseUI，用摇杆上下左右点选菜单，体验就像用手柄一样丝滑。

### 🔄 UI 可切换：MUI 与 BaseUI 随时互换！

有 TFT 屏的设备用户有福了——现在可以在 BaseUI 与 MUI 之间**随时切换**，不需要刷不同的固件了！

例如：

- MUI 虽然视觉炫酷，但不支持蓝牙连接 App；

- 你可以临时切换回 BaseUI，使用手机 App 调整配置，再切回 MUI。

想用哪个界面，由你决定！

### 🔐 密钥验证功能上线

现在，设备之间可以进行“密钥验证”啦！  

你只需在设备上选择另一个节点，发起验证流程，双方将看到一个 6 位数的验证码，在 App 中输入后，两个设备都会显示确认提示。  

这可以验证：你们正在用各自的密钥安全通信。

未来版本可能会加入“设备之间重新分发密钥”的功能。

目前该功能已在固件中加入初步支持，未来客户端也会加入 UI 配合。

## 如何刷入 2.7 预览版？

只需打开 [Meshtastic Web Flasher](https://flasher.meshtastic.org/)，在 “Preview” 区域找到 2.7 预览版，即可在线刷写。

⚠️ 注意：**预览版可能需要设备完全清除数据，请记得提前备份配置和密钥！**

## 帮我们一起打磨它！

不论你是在用经典 T-Beam、触屏设备，还是跑在树莓派上的 Linux 版——我们都很期待你的体验反馈！

- 哪些功能你喜欢？

- 哪些地方还有 Bug？

- 有没有什么你希望在正式版中看到的改进？

欢迎加入 [Discord 群](https://discord.com/invite/ktMAKGBnBs) 或 Reddit 社区 [r/meshtastic](https://www.reddit.com/r/meshtastic/)，一起参与 Meshtastic 2.7 的最后打磨！

如果你已经跃跃欲试，别犹豫——现在就刷起来，体验这个焕然一新的 Meshtastic 世界吧！🚀
