---
title: "用 30 元 DIY 一个 Meshtastic 太阳能节点"
date: "2025-07-23"
description: "本文详细介绍如何以极低成本组建一个可用的Meshtastic太阳能节点，包括选材、组装和测试全过程。通过合理的器件选择和DIY方法，单个节点成本可控制在30元左右。"
tags:
  - "DIY"
slug: "diy-30-yuan-meshtastic-solar-node"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/diy-30-yuan-meshtastic-solar-node/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。谢谢 *群里大佬* 的耐心整理和无私分享。

Meshtastic 受困于自身物理限制，想要组建一个信号较好的通信网络就需要在高处放置节点。然而将节点放置在高处，例如山顶或者是楼顶通常意味着有一定的丢失风险。

因此如何将太阳能节点的价格尽量降低便成了增加户外节点的一个重要问题。本文将讲述如何组建一个低价但可用的太阳能节点。

![太阳能路灯示例](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/solar-street-lights-advertisement.webp)

## 选材

太阳能节点可以简易的分为三部分：470MHz 天线、太阳能储能装置以及 Meshtastic 设备。

### 太阳能储能装置

在拼多多搜索太阳能路灯，选取带按钮的款式。大概价格在8元左右。如遇到清仓价格大概在 4 元范围内。选取时注意建议选择太阳能板功率在 0.5W 及以上，电池容量在 1000mAh 以上的款式。

> **注：** 经过测试和计算，0.5W 太阳能板配合"标称" 1500mAh 的三无电池至少能撑过连续五天的阴雨天，这个数据不尽正确，欢迎各位大佬测试指正。

![太阳能储能装置](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/solar-panel-disassembled.webp)

![Faketec PCB](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/faketec-pcb-board.webp)

![FaketecYuri PCB](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/faketecyuri-pcb-board.webp)

![天线配件](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/antenna-accessories.webp)

### Meshtastic设备

这里是成本计算的重点，因为 Meshtastic 设备的价格一般都是大头。

本节有两条路线可选：

1. Faketec

2. FaketecYuri（推荐）

如果你只想最低成本、功能极简，Faketec 足够。

如果你希望一次到位，集成太阳能充电、GPS、蜂鸣器等外设、兼容更多 LoRa 模块，推荐选 FaketecYuri。

为了尽量节省设备价格，我们需要灵活的通过一些"白嫖"的手段，并且减少不必要的元器件，主打一个能用就行。

#### Faketec方案

项目详情：GitHub [gargomoma/fakeTec_pcb](https://github.com/gargomoma/fakeTec_pcb)

> 编者注

> PCB 为啥是 0 元？并不是厂家白送，而是 嘉立创常年发放打样优惠券。

> 另外，欢迎进社区微信群组，群友会第一时间互相提醒哪里有券、怎么薅、有哪些坑要避。

| 名称 | 价格 | 来源 |
| --- | --- | --- |
| 电路板 | 0 | 嘉立创白嫖 |
| Ht-ra62/ra-01s | 21/15.3 | 淘宝 |
| ProMicro nRF52840 | 12.4 | 淘宝 |

Meshtastic 节点最低成本：15.3 + 12.4 = 27.7 元

#### FaketecYuri方案（推荐）

> 编者注

> Yuri Su 基于 Faketec 改进而来，兼容更多不同品牌的 LoRa 模块，一块 PCB 覆盖几乎市面上能“薅样片”的所有模块。

项目详情：GitHub [Yurisu/meshtastic-faketecyuri](https://github.com/Yurisu/meshtastic-faketecyuri)

| 名称 | 价格 | 来源 |
| --- | --- | --- |
| 电路板 | 0 | 嘉立创 |
| Ht-ra62 | 21 | 淘宝 |
| 或Ra-01s | 15.3 | 淘宝 |
| 或E22-400M22S | 25.8 | 淘宝 |
| 或E22-400MM22S | 6.24 | 淘宝拿样价（两个店铺共能拿4块） |
| 或SX1268ZTR4(433MHz) | 12.8 | 淘宝拿样价（共两块） |
| ProMicro nRF52840 | 12.4 | 淘宝 |

HT-RA62、Ra-01s、E22-400M22S、SX1268ZTR4(433MHz) 都是 LoRa 模块，可以根据价格和需求，任选其一。

Meshtastic 节点最低成本：6.24 + 12.4 = 18.64 元

> **注：** 感谢 [社区微信群](https://meshcn.net/contact) 内大佬 *广州-yuri_su* 开源的PCB。

### 天线

| 名称 | 价格 | 来源 |
| --- | --- | --- |
| IPEX外螺内孔转SMA一代 | 1.6 | 淘宝 |
| 天线 | 2 | LoRa 433MHz天线470M无线数传315M 510MHz全向高增益外置胶棒SMA-淘宝 |

## 成本计算

如果选用 FaketecYuri + E22-400MM22S（拿样价）+ nRF52840 + 拼多多 8 元太阳能灯（如果太阳能板功率及电池达标也可以选择更便宜的清仓货），那么一台设备的价格可以低至 **31.24元** 甚至更低！

## 组装

### 刷固件

Faktec方案或者FaketecYuri方案二选一，把固件刷入到开发板上，具体参考 《T114 杀手？焊武帝 35 块 DIY nRF52 Meshtastic 节点》文章的[刷固件-烧录过程章节](https://meshcn.net/meshtastic-diy-nrf52840-lora-sx1262-setup/#%E4%B8%89%E3%80%81%E5%88%B7%E5%9B%BA%E4%BB%B6-%E7%83%A7%E5%BD%95%E8%BF%87%E7%A8%8B)

### 焊接组装

将LoRa模块与nRF开发板焊接到电路板上，将太阳能灯的按钮从太阳能电路板拆下，焊接到reset焊点上。（此处以Faktec为例）

![组装过程](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/assembly-process.webp)

### 安装天线

在太阳能灯外壳上打孔，固定IPEX转SMA一代转接线，并拧上天线。

### 最终组装

拆掉太阳能灯的灯板，接上天线，并将Meshtastic设备连接到电池正负极。做好绝缘，将所有东西塞进灯壳里。

### 密封

用胶水密封。

![焊接过程](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/soldering-process.webp)

## 测试与使用

通常情况下Meshtastic设备此时已经开机，如未开机，按一下太阳能灯上的按钮。

至此，一个低廉的Meshtastic太阳能节点已经组装完毕，**建议在放置到楼顶或山上前先在阳台测试是否正常工作**。

> **提示：** 据广州-yuri_su大佬测试，不同品牌的节点在远距离通信没有相同节点稳定，因此推荐使用尽量使用同一品牌的模块组网。

## 商业化替代方案

如果想要直接购买开箱即用的成品 Meshtastic 太阳能节点的话，目前市面上功能完善而且最便宜的是加特物联的 GAT562 Mesh Solar Relay，其使用的 0.5W 太阳能板与 800mAh 电池足以满足非极端情况下的电量需求，而且预先内置最新的稳定版 Meshtastic。

![最终成品](https://meshcn.net/diy-30-yuan-meshtastic-solar-node/final-completed-product.webp)

GAT562 Mesh Solar Relay包含地钉与多向支架，方便在户外或楼顶的安装使用。

## 参考资料

- https://meshtastic.org/docs/community/enclosures/rak/harbor-breeze-solar-hack/

- https://github.com/gargomoma/fakeTec_pcb

- https://github.com/Yurisu/meshtastic-faketecyuri
