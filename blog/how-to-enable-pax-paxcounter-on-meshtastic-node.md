---
title: "让你的 Meshtastic 节点“看见”人群：Paxcounter 功能全攻略"
date: "2025-07-20"
description: "Paxcounter 模块，正是给 Meshtastic 加点“商业智能”的利器：通过捕捉 WiFi 和蓝牙信号，悄悄数清周围人流，不用摄像头，也不沾隐私。更妙的是，配合 Mesh 网络，实时客流就能无线同步到每个角落。无论你是做活动、商业分析，还是只是 geek 们的玩具，这篇文章手把手教你启用 Paxcounter，让你的节点不仅会传消息，还能“看人”。"
tags:
  - "ESP32"
  - "WiFi"
slug: "how-to-enable-pax-paxcounter-on-meshtastic-node"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/how-to-enable-pax-paxcounter-on-meshtastic-node/

想让你的 Meshtastic 节点具备实时人流监控的能力吗？通过集成 Paxcounter，我们可以轻松实现。

Paxcounter 是一款利用 WiFi 和蓝牙信号计数人流的工具，搭配 Meshtastic 不仅可以查看单个节点的数据，还能在整个 Mesh 网络中共享实时的场地人数，做到真正的“无线人流统计”。

> 翻译声明

> 本文翻译自 Adrelien 的文章《 [How To Enable Paxcounter On Meshtastic Node](https://adrelien.com/how-to-enable-pax-paxcounter-on-meshtastic-node/) 》。一些内容有调整，以适应 MeshCN 社区读者。

> 我自己在翻译和阅读的过程中也收获不少，Adrelien 的博客里确实有很多我之前没注意到的细节和思路。推荐大家也去看看原文，相信会对你有启发。

![如何在 Meshtastic 设备上启用 Paxcounter](https://meshcn.net/how-to-enable-pax-paxcounter-on-meshtastic-node/How-To-Enable-Paxcounter-On-Meshtastic-Node.webp)  

*图片来源：[https://www.thethingsnetwork.org/forum/u/michellamie/summary](https://www.thethingsnetwork.org/forum/u/michellamie/summary)*

本篇教程将手把手教你，如何在 Meshtastic 节点上开启 Paxcounter 功能。需要注意的是，这个功能目前只支持基于 ESP32 的开发板，比如 **Heltec V3 LoRa32**、**[Heltec Wireless Tracker](https://meshcn.net/best-lora-device-for-beginners-heltec-wireless-tracker-review/)**、**Heltec Vision Master E213 / E290 / T190**，或者[你 DIY 的 ESP32 硬件](https://meshcn.net/tags/esp32/)。

## 什么是 Paxcounter？

在正式上手之前，先来了解一下 Paxcounter 到底是干什么的。

Paxcounter 是一款简洁高效的“人流统计”工具，常用于商场、会展、公共空间等场所。它通过监听路过人群手机等设备发出的 WiFi、蓝牙信号，来估算经过的人数。不需要接入个人信息，完全匿名，保护隐私的同时，还能实时掌握人流变化。

比如，当一个人带着手机经过设备旁，Paxcounter 就会捕捉到 WiFi 或蓝牙信号的存在，并在计数器上加一。借此，就可以统计每个时段的客流量，判断区域的拥挤程度。

## Paxcounter 与 Meshtastic 的结合

当 Paxcounter 遇上 Meshtastic，这项功能就变得更强大了。每个搭载 Paxcounter 的 Meshtastic 节点，不仅可以本地统计经过的人数，还会通过 Mesh 网络把数据同步给其它节点。这样，网络中的任意节点都可以实时请求和查看其它节点的 Paxcounter 计数，形成覆盖整个区域的人流监测网络。

## Meshtastic 的设置方法

> 支持的硬件

> Paxcounter 只支持基于 ESP32 的设备，比如 **Heltec V3 LoRa32**、**Heltec Wireless Tracker**、**Heltec Vision Master E213 / E290 / T190**，或者 DIY 的 ESP32 开发板。

启用 Paxcounter 需要占用 WiFi 和蓝牙功能，因此在启用时，我们需要通过 Meshtastic App 把蓝牙和 WiFi 关闭，这样设备才能专注于 Paxcounter 的任务。此时，连接设备的方式会变成串口。

### 在 Paxcounter 设备上设置

1. 打开 Meshtastic App（本文以 iOS 版本为例）

2. 进入 **设置** 页面

3. 找到 **模块配置** 区域，进入 **Paxcounter**

4. 打开 **启用** 开关

5. 设置合适的 **更新间隔**，避免过于频繁的上传导致网络负载过重

6. 点击 **保存**

如果你是通过 **蓝牙** 连接节点：

1. 在 Meshtastic App 进入 **设置**

2. 进入 **设备** 配置区，找到 **蓝牙**

3. 打开 **禁用** 开关，关闭蓝牙

4. 点击 **保存**

如果你是通过 **WiFi** 连接节点：

1. 同样进入 Meshtastic App 的 **设置**

2. 找到 **设备** 配置中的 **网络**

3. 打开 **禁用** 开关，关闭 WiFi

4. 点击 **保存**

> 注意事项

> 务必不要关闭串口。启用 Paxcounter 后，WiFi 和蓝牙会被禁用，此时串口是你与设备通信的唯一通道。如果不小心把串口也禁用了，就相当于把自己彻底锁在门外——所有配置项都无法再修改，除非重新刷固件才能“解锁”设备。

### 在客户端设备上查看

1. 打开 Meshtastic App

2. 进入 **节点** 页面

3. 选择开启了 Paxcounter 功能的节点

4. 你会看到新出现的 “**Paxcounter**” 选项，点击即可查看数据

配置好后，Paxcounter 会按照你设定的间隔记录和上报人流数据。设置更新频率时要注意，过短的间隔可能会造成 Mesh 网络过载，建议根据场景适度调整。更多关于网络利用率的优化，可以参考 MeshCN 的《频道利用率》相关教程。

## 结语

通过本文，你已经学会了如何在 ESP32 Lora 或其他 ESP32 开发板上，配合 Meshtastic 实现 Paxcounter 功能。Paxcounter 加 Meshtastic，不仅让人流监测变得无线、实时，还保障了隐私，非常适合商业、活动甚至公共安全等场景使用。

下一步，不妨试着部署多个 Paxcounter 节点，结合 Meshtastic 的网络特性，打造属于你的人流监控 Mesh 网络吧！
