---
title: "樱花派 Pocket Namiji 开源了：README 已给齐固件、原理图和 3D 外壳"
date: "2026-03-14"
description: "2026-02-05 起，樱花派 Pocket Namiji 已正式开源。现在不仅能在 GitHub README 拿到固件、原理图 PDF 和 3D 外壳模型，这块板子也已经同时支持 Meshtastic 与 MeshCore。想直接上手可买成品，想自己折腾也有完整资源可走。"
tags:
  - "Meshtastic"
  - "ESP32"
  - "MeshCore"
  - "SakuraPi"
slug: "sakurapi-pocket-namiji-open-source-announcement"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/

如果你之前已经看过前一篇《[来自深圳-派派的新品：Sakura Pi Pocket Namiji 上线](https://meshcn.net/new-device-sakura-pi-pocket-namiji/)》，那这篇可以直接理解成它的 follow up。

前一篇主要讲的是这块板子的定位、硬件设计和低功耗思路。

而这次真正值得补上的，是它的开源资料、文档入口、结构文件，以及可以直接下载和上手的固件资源。

![Sakura Pi Pocket Namiji 板卡实拍](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakura-pi-pocket-namiji-board-antenna.webp)

如果你只是想快速把节点跑起来，一丁点也不想折腾焊接和打板，可以直接去闲鱼买成品。派派的闲鱼账号是 [甜城欢乐的萝卜](https://www.goofish.com/personal?userId=744540236)。

![Sakura Pi Pocket Namiji 闲鱼商品页截图](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakurapi-pocket-namiji-xianyu-page.webp)

但如果你更在意动手折腾的乐趣，那这次是真的值得关注：樱花派 Pocket Namiji 已经把各种关键资源整理得很完整了。

![Sakura Pi Pocket Namiji resources 下载页截图](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakurapi-pocket-namiji-resources-page-updated.webp)

这次 [公开的资源](https://docs.sakurapi.org/article/sakurapi-pocket-namiji/resources) 包括：

- Meshtastic 适配固件源代码

- MeshCore 适配固件源代码

- BoM 物料清单

- 硬件原理图 PDF

- 芯片与 LoRa 模组数据手册

- 板卡 3D 模型与外壳模型（可自行 3D 打印）

- 预编译固件下载

- [嘉立创开源广场 OSHWHub](https://oshwhub.com/sakurapi/sakurapi-pocket-namiji) 上的开源硬件资料

![Sakura Pi Pocket Namiji PCB 正反面与 Ebyte E22 模块](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakura-pi-pocket-namiji-pcb-front-back-ebyte-e22-400m33s.webp)

项目本体还是那块熟悉的小尺寸底板：ESP32-C3 + E22 30S/33S 方案、470MHz、Type-C 供电与调试、3-16V 外部供电输入。

你可以在里面找到固件相关入口、原理图 PDF、以及 3D 模型下载信息。

对想自己做壳子的读者来说，这一点非常省事：拿到模型就能直接按自己的场景去拓竹进行 3D 打印外壳，不用再自己从零测尺寸开模。

![Sakura Pi Pocket Namiji 3D 打印外壳](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakura-pi-pocket-namiji-3d-print-enclosure.webp)

原理图、iBOM、芯片手册、模组手册这些东西，现在也都已经摆在同一个地方了。

![Sakura Pi Pocket Namiji 原理图首页预览](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakura-pi-pocket-namiji-schematic-preview.webp)

结构件这块也补得很全，板卡模型、外壳模型、预编译固件都已经放出来了。你要改外壳、做支架、核对孔位，或者只是想先把固件刷起来试试，现在都比一月那会儿顺手得多。

如果你更习惯先看页面再决定要不要动手，那也可以先翻一眼 GitHub 和 [嘉立创开源广场 OSHWHub](https://oshwhub.com/sakurapi/sakurapi-pocket-namiji) 这两个入口。

![Sakura Pi Pocket Namiji GitHub 仓库页面截图](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakurapi-pocket-namiji-github-repository-page-screenshot.webp)

![Sakura Pi Pocket Namiji OSHWHub 项目页截图](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakurapi-pocket-namiji-oshwhub-project-page-screenshot.webp)

另外，这块板子现在两边都能玩。你本来就在用 Meshtastic，那就继续走 Meshtastic；如果你最近在看 MeshCore，也可以顺手试过去。对同一块硬件来说，这一点还是挺省事的。

Namiji 之前被大家关注，一个关键点就是 ESP32-C3 方案下的功耗表现。派派不是简单靠关蓝牙来降电流，而是用 dcdc 降压路线把功耗压下去，同时尽量保留手机侧使用体验。这个思路现在放在开源语境下更有意义，因为你可以拿着现成资料对照看：到底哪些是硬件路径，哪些是固件路径，后续做二次开发时也更容易定位问题。

![esp32c3 + E22 低功耗实测截图](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/esp32c3-lower-power-consumption-data-screenshot.webp)

对想做太阳能节点、固定中继节点的人来说，低功耗不是锦上添花，而是决定维护频率和长期稳定性的核心指标。现在这部分也有公开参考材料，门槛比之前低了不少。

![Sakura Pi Pocket Namiji 成品板堆叠](https://meshcn.net/sakurapi-pocket-namiji-open-source-announcement/sakura-pi-pocket-namiji-24pcs-pcba-stack.webp)

你如果已经按这套资料复刻了板子，或者把 3D 外壳打印并装起来了，欢迎把实装过程和踩坑点分享出来到 [MeshCN 微信群或者 QQ 群里](https://meshcn.net/contact/)。
