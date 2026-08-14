---
title: "来自深圳-派派的新品：Sakura Pi Pocket Namiji 上线"
date: "2026-01-20"
description: "在 MeshCN 群里，大家每天都在聊方案、聊参数；深圳-派派这次就端上来一块新板子：Sakura Pi Pocket Namiji，一个面向 470MHz 的口袋化 Meshtastic 底板，支持 E22 30/33dBm，配备 AHT20 温湿度传感器，Type-C PD 充电与调试接口一并给齐，更关键的是在 ESP32-C3 这条高功耗赛道上用 dcdc 降压把功耗压到 13mA，同时还保"
tags:
  - "ESP32"
slug: "new-device-sakura-pi-pocket-namiji"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/new-device-sakura-pi-pocket-namiji/

如果你有在 [MeshCN 微信群](https://meshcn.net/contact) 聊天，那你肯定会注意到一个非常活跃的群友—— *深圳-派派* 。和群里很多大佬一样，他是一个既懂嵌入式开发，又懂无线电的狠人。

今天，我们介绍下他最近开发的一个新玩意—— Sakura Pi Pocket Namiji。据我得到的内幕消息，这个设备的名字是来自于：

- [Sakura Pi](https://github.com/Sakura-Pi) 是 *深圳-派派* 和志同道合的朋友一起创建的兴趣小组

- Pocket 是他的小型化系列

- Namiji 是日语里大浪的意思。难道是说「浪花淘尽，唯有 *派派* 屹立不倒」？🐕

![Sakura Pi Pocket Namiji PCB 正面](https://meshcn.net/new-device-sakura-pi-pocket-namiji/sakura-pi-pocket-namiji-board-antenna.webp)

Pocket Namiji 的 MCU 采用了 ESP32-C3。众所周知，ESP32 的芯片相比 nRF52 和 RP4020，功耗要大很多。这次，派派通过 [特殊的优化](#%E4%BD%8E%E5%8A%9F%E8%80%97%E8%AE%BE%E8%AE%A1)，成功把功耗降低到 13 mA。

关于 LoRa 方面，设备支持 Ebyte（亿佰特）E22 LoRa 模块的两种型号：分别是 30S 和 33S，也就是 30dBm 和 33dBm 的功率。频率自然要选用中国国内群友最常使用的 470MHz 频段。LoRa 模块的型号全称为 E22-400M30S 或 E22-400M33S。

设备还配备了 AHT20 温湿度传感器，可以采集环境温度和湿度数据。

![Sakura Pi Pocket Namiji PCB 正反面与 Ebyte E22 模块](https://meshcn.net/new-device-sakura-pi-pocket-namiji/sakura-pi-pocket-namiji-pcb-front-back-ebyte-e22-400m33s.webp)

在板子上，你能看到自带了 Type-C 接口。它支持快充 PD 12V 协议进行 USB 充电。除了可以作为供电口，还可以作为串口（UART），用于调试、烧录和升级固件。

在 Type-C 接口的左侧，有一个 2P 的电源端子。这个端子用于外部供电，支持 3-16V 的电压输入。

细心留意的话，在 ESP32-C3 的左侧，还有一个 4P 的端子，分别是 3.3V、GND、RX、TX。这个端子按照设计者的说法，是作为日后添加 GNSS 模块预留的。

![Sakura Pi Pocket Namiji PCB 尺寸与孔位标注图](https://meshcn.net/new-device-sakura-pi-pocket-namiji/sakura-pi-pocket-namiji-pcb-dimensions.png)

PCB 上带有两个 M2.5 的螺丝孔，方便固定在 3D 打印的外壳或支架。两个螺丝孔间距 59 mm，听说还能选配 59mm 螺丝孔间距的南桥散热器，帮助更好地散热。

*2026-02-05 更新*：樱花派 Pocket Namiji 有 3D 打印的外壳设计了。  

这是官方自行设计的，相信尺寸和孔位都会完美契合。外壳使用四颗螺丝固定，大小为 60 mm x 50 mm x 30 mm。外壳侧面带有开孔，方便插入电源线、Type-C 数据线等。

![Sakura Pi Pocket Namiji 3D 打印的外壳设计](https://meshcn.net/new-device-sakura-pi-pocket-namiji/sakura-pi-pocket-namiji-3d-print-enclosure.webp)

在外壳正面上本部分，设计了一处长条形，方便用户贴上 10 mm x 30 mm 尺寸的标签贴纸。用作节点名称、序列号等信息的标识。用户可以发挥想象力，设计出自己喜欢的样式。

## 低功耗设计

在 MeshCN 群里，很多人入门用的都是 *武汉-YaoYao* 的 [TinyLoRa](https://meshcn.net/tinylora-open-source-lora-module/) ，它和 Pocket Namiji 一样选了 ESP32-C3。大家对 ESP32-C3 的省电经验通常很直接，把蓝牙关掉，电流立刻能降下来。代价也同样明显，手机 app 不再能连接节点，后续只能通过无线电下发 Meshtastic 的 admin 命令来修改配置。

深圳-派派这次没有沿用关闭蓝牙的思路，而是走了更硬核的工程路线。他用一套 dcdc 降压方案把功耗压到 13 mA，同时保留蓝牙广播功能，这意味着你依然可以用手机 app 去配置和管理节点，而不用在省电和易用之间做取舍。

这套低功耗做法已经公开在 GitHub 上，分支名是 `esp32_lowerPower`，地址为 [https://github.com/ssp97/meshtastic_fw/tree/esp32_lowerPower](https://github.com/ssp97/meshtastic_fw/tree/esp32_lowerPower) 。

他之前在 esp32c3（MCU）+ 大夏22s（LoRa 模块）的组合上做过实测，截图里显示电压 4.9V、电流 13.2 mA，对应功耗约 65.9 mW。

![ esp32c3（MCU）+ 大夏22s （LoRa 模块） ](https://meshcn.net/new-device-sakura-pi-pocket-namiji/esp32c3-lower-power-consumption-data-screenshot.webp)

## 获取设备

如果你关心的问题是能不能买到，那答案是可以，而且派派为了让这件事更确定，直接把生产线搬回了家。他重金上了一台贴片机，用来备货 Sakura Pi Pocket Namiji。下面这段视频就是贴片机在生产的现场记录，你能直观看到它从元器件到成品板的整个节奏。

![24 块 Sakura Pi Pocket Namiji 成品板堆叠](https://meshcn.net/new-device-sakura-pi-pocket-namiji/sakura-pi-pocket-namiji-24pcs-pcba-stack.webp)

目前购买渠道主要在闲鱼。有兴趣的读者可以 **[直接访问派派的闲鱼账号 甜城欢乐的萝卜](https://www.goofish.com/personal?userId=744540236)，查看库存和上架情况。

> 2026-02-05 更新：Namiji 开源啦！

> 派派已经把樱花派 Pocket Namiji 开源到了 GitHub 和嘉立创开源广场 OSHWHub 仓库。在 Namiji 的 GitHub 仓库和 OSHWHub 仓库中，你可以找到设计图、BOM、3D模型等文件。

> GitHub 仓库地址为 [Sakura-Pi/SakuraPi-Pocket-Namiji](https://github.com/Sakura-Pi/SakuraPi-Pocket-Namiji)。  

> 

> OSHWHub 仓库地址为 [sakurapi/sakurapi-pocket-namiji](https://oshwhub.com/sakurapi/sakurapi-pocket-namiji)。

> 喜欢 DIY 的读者可以下载设计图、BOM、3D 模型、优化好的固件等文件，自己动手生产 PCB、焊锡和调试。不喜欢 DIY 或者愿意直接购买现成的读者，可以去 [派派的樱花派闲鱼产品页面](https://m.tb.cn/h.7NqHkMG?tk=SdA8Ufu15F2) 购买。

为了方便你快速确认这块板子到底提供了哪些关键能力，我把核心参数整理成一张表：

| 类别 | 参数项 | 规格 / 说明 |
| --- | --- | --- |
| 核心 | MCU | ESP32-C3 |
| 无线 | LoRa 模块 | 兼容 Ebyte（亿佰特）E22：30S / 33S |
| 无线 | 发射功率 | 30S：30 dBm；33S：33 dBm |
| 无线 | 频段 | 470 MHz（国内常用频段） |
| 传感器 | 温湿度传感器 | AHT20，可采集环境温度和湿度数据 |
| 功耗 | 低功耗表现 | 约 13 mA（dcdc 降压低功耗方案；文中有实测截图示例） |
| 供电/充电 | USB | Type-C，支持 PD 12V 快充输入，同时可作为串口用于调试 / 升级 |
| 供电/输入 | 外部供电端子 | 2P 端子，支持 3–16V 输入 |
| 扩展 | GNSS 预留接口 | 4P：3.3V / GND / RX / TX（预留给 GNSS 模块） |
| 结构 | 安装孔 | 2 × M2.5 螺丝孔 |
| 结构 | 孔距 | 59 mm（便于固定外壳/支架；可选配 59mm 孔距的南桥散热器） |

关键链接：

- [Sakura Pi Pocket Namiji 作者深圳-派派的闲鱼页面](https://www.goofish.com/personal?userId=744540236)

- `esp32_lowerPower`[低功耗优化代码分支](https://github.com/ssp97/meshtastic_fw/tree/esp32_lowerPower)

- 未来文档站点：[docs.sakurapi.org](https://docs.sakurapi.org)

- GitHub 仓库：[Sakura-Pi/SakuraPi-Pocket-Namiji](https://github.com/Sakura-Pi/SakuraPi-Pocket-Namiji)

- 嘉立创开源广场 OSHWHub 仓库：[sakurapi/sakurapi-pocket-namiji](https://oshwhub.com/sakurapi/sakurapi-pocket-namiji)

如果你对这块板子的定位、供电方式、以及低功耗实现细节有疑问，欢迎加入 MeshCN 微信群，和群友一起讨论。
