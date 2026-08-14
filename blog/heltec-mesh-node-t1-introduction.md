---
title: "把 LoRa、GNSS 和 IMU 塞进卡片里：Heltec Mesh Node T1 上手"
date: "2026-06-29"
description: "Heltec Mesh Node T1 把 LoRa、定位、IMU 和小屏幕装进卡片大小的机身里。它不只是一个能收发消息的节点，更像是一台可以随身挂着的位置终端。"
tags:
  - "Meshtastic"
  - "nRF52"
  - "Heltec"
  - "MeshCore"
slug: "heltec-mesh-node-t1-introduction"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/heltec-mesh-node-t1-introduction/

Heltec 这次出的 Mesh Node T1，是一台卡片式位置终端，把低功耗 MCU、LoRa、GNSS、姿态传感器、蜂鸣器和显示屏都塞进了一块很薄的机身里。

![Heltec Mesh Node T1 手持实拍，能很直观看到它的卡片尺寸](https://meshcn.net/heltec-mesh-node-t1-introduction/user-front-hand.webp)

官方把它放在位置感知、轻量导航和随身标签这一类场景里。核心硬件是 nRF52840 + SX1262，外加 UC6580 GNSS、9 轴 IMU、蜂鸣器和 0.96 英寸 TFT 屏。除了 Meshtastic 和 MeshCore，Heltec 还把它放进了自家的 F&T 体系，说明它不是只给某个协议预留的板子。

![Heltec 官方正面渲染图，前面是屏幕和地形纹理背板](https://meshcn.net/heltec-mesh-node-t1-introduction/official-front.webp)

> 设备不支持中国大陆频率

> Mesh Node T1 当前只适合 863-928 MHz 频段。国内群友常用的是 470-510 MHz（CN470），这台机器不是为这个频段准备的。

> 如果你在国内，可以定期在 [社区群里](https://meshcn.net/contact/) 艾特 Heltec 的工作人员，表达对 470-510MHz 频率的期待。这样，Heltec 才会把适配国内频率提上优先级。

## 关键规格

| 项目 | 规格 |
| --- | --- |
| MCU | nRF52840 |
| LoRa 芯片 | SX1262 |
| GNSS | UC6580 |
| 9 轴 IMU | MMC5983MA + ICM-42607-P |
| 屏幕 | 0.96 英寸 TFT LCD |
| 电池 | 1850 mAh |
| 睡眠电流 | 11 µA |
| 尺寸 | 85.18 x 55.18 x 9.50 mm |
| 重量 | 53 g |
| 供电 | 5V USB-C |
| 防护 | IP67（官方页面后续会统一按 IP65 口径更新） |
| 频段 | 863-870 MHz / 902-928 MHz |

我问了 Heltec 的章玉川产品经理，实际防水等级是 IP67。对外文案会统一按 IP65 口径更新。按保守口径看，它更适合雨天、灰尘和日常户外，但也别把它当成拿去长期泡水的设备。

这类设备如果超过 100 克，随身带着就开始有点累赘了；T1 的 53 克则是另一种状态，53 克大概就是一颗鸡蛋的重量。

![实测重量，电子秤显示 53.0 g](https://meshcn.net/heltec-mesh-node-t1-introduction/user-scale.webp)

官方尺寸图也印证了这个方向：85.18 x 55.18 x 9.50 mm，宽度接近一张标准卡片，但厚度明显比真正的卡片更像一台完整硬件终端，握在手里有明显存在感。

![Heltec 官方尺寸图](https://meshcn.net/heltec-mesh-node-t1-introduction/official-dimension.webp)

背面没有太多花活，重点就是电源键和两颗侧键。对这种设备来说，按键比外观更像消费电子重要得多，因为它大概率会在手机不方便掏出来的时候被调用。

![Heltec 官方背面图，电源键和侧键位置很清楚](https://meshcn.net/heltec-mesh-node-t1-introduction/official-back.webp)

![手持背面实拍，能看出电源键和机身厚度](https://meshcn.net/heltec-mesh-node-t1-introduction/user-back-hand.webp)

官方把接口、按钮、LED 和挂绳孔都画得很直白。

![Heltec 官方布局图，能看到屏幕、按键、挂绳孔和顶部 USB-C](https://meshcn.net/heltec-mesh-node-t1-introduction/official-layout.webp)

这台机器没有把功能堆得太多，而是把功能和重量之间做了很好的平衡。

GNSS 负责定位，9 轴 IMU 负责姿态和方向，TFT 屏负责把这些信息直接显示出来，蜂鸣器则负责在你没盯屏幕的时候提醒你。官方原生固件还把 peer search 和 map track 这类功能摆了进去，所以它的思路很明显：这不是单纯聊天节点，而是一个更偏位置感知的随身终端。

![Heltec 官方的导航/罗盘演示图，能看到方向和距离信息](https://meshcn.net/heltec-mesh-node-t1-introduction/official-navigation.webp)

官方还拿了水下图来展示防护能力，实际防护等级是 IP67。对外口径会统一按 IP65 去写，理解上可以把它看成防尘、防短时浸水、户外可用，但别把它当成拿去长期泡水的东西。

![Heltec 官方防水演示图](https://meshcn.net/heltec-mesh-node-t1-introduction/official-waterproof.webp)

便携性上，它更像一个可以随身挂着的标签机，而不是放口袋里就忘了的超轻终端。挂到背包肩带上之后，形态就很清楚了：它不是拿来长时间握在手里操作的，而是拿来持续告诉你自己在哪儿、队友在哪儿的。

![挂到背包肩带上的实拍，随身携带感很强](https://meshcn.net/heltec-mesh-node-t1-introduction/user-backpack.webp)

## 不支持国内频率

Heltec Meshnode T1 当前能选的版本只有 863-870 MHz 和 902-928 MHz。换句话说，它面向的是海外常见的 868/915 体系，不是国内群友最常用的 470-510 MHz。

如果你在国内，可以定期在群里艾特 Heltec 的工作人员，表达对 470-510MHz 频率的期待。这样，Heltec 才会把适配国内频率提上优先级。

## 结语

Mesh Node T1 不是一台给所有 Meshtastic 用户准备的通用机器。它更像 Heltec 在海外频段上做的一次高集成尝试，把低功耗、定位、姿态、提示和显示全部收拢进一块卡片里。

如果你手里本来就在跑 868/915 体系，或者你想做的是位置标签、轻量导航、运动/搜寻类节点，这台机器很完整。要是你主要在国内玩 CN470，那就先别被它的卡片外形带跑了，频段才是第一判断条件。

另外，从 Heltec 官方表述看，它还留了 Arduino 自定义开发的入口，所以如果你想做私有协议、特殊定位逻辑或自定义提示流程，这块硬件也不是完全锁死的成品机。

## 素材来源

文中使用的 Heltec 官方素材均来源于 [heltec.org](https://heltec.org/project/mesh-node-t1/) 的 Mesh Node T1 项目页，并已获得 Heltec 章玉川产品经理同意使用。
