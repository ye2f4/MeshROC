---
title: "M5Stack ADV 的最后一块拼图：来自社区的 480MHz LoRa 模组"
date: "2026-03-20"
description: "对于不少 Meshtastic 玩家来说，M5Stack ADV 一直是一台几乎完美的随身节点：它有屏幕、有键盘、足够便携，也有着出众的工业设计。但在国内常用的 470–510 MHz 组网环境下，这台设备始终差了关键一步。480 MHz LoRa CAP 模组正在补上这块最后的拼图，不仅让 ADV 真正融入中国本地频段生态，也带来了更强的信号读数与更灵活的功耗控制。"
tags:
  - "M5Stack"
  - "ADV"
slug: "adv-cap-lora-480mhz-cn470"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/adv-cap-lora-480mhz-cn470/

在过去很长一段时间里，MeshCN 社区里其实有不少人都对 M5Stack ADV 心动过。它有屏幕、有实体键盘、足够便携，还有一种很少见的极客式工业设计美感。很多人第一次看到实机时，几乎都会产生同一个念头：这台设备真的很好看。

*下面这组 ADV 实机照片由群友 中山-dovechan 拍摄*

![ADV 实机近景：消息界面特写](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-message-screen-closeup.webp)

但真正准备下单时，问题也随之而来。ADV 原生只提供 868 MHz LoRa 模组，而国内 Meshtastic 社区最常见的组网频段是 470–510 MHz。理论上可以通过修改参数让设备先跑起来，但在不匹配的射频条件下，信号质量往往会明显下降，实际参与组网的体验也会大打折扣。

![ADV 实机：本体与 LoRa CAP 侧视图](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-with-lora-cap-side-view.webp)

于是，一种颇为微妙的状态长期存在于社区之中。很多人喜欢 ADV，也认可它的设计与形态，却因为频段问题选择暂时停手，把购买计划一再往后推。

![ADV 实机：消息界面正面视图](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-message-screen-front.webp)

直到这块来自社区开发者的 480 MHz LoRa CAP 模组出现，这种犹豫才终于有了一个明确的终点。对于那些曾经观望的人来说，现在或许才是可以真正放心剁手的时刻。

![ADV 实机：外接电子纸显示节点与状态](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-epaper-node-list-status.webp)

有见及此，群友 *深圳-陈喜发* 设计了 ADV CAP LoRa 480MHz 模组，让 ADV 支持 470-510 MHz，完美解决过去 ADV 的唯一缺点。

## 功能和表现

这个 480 模组的有两大重要功能。

第一个自然是前文所说的带来对中国频率的支持，这对于一个以无线电为主题的社区来说尤其重要。

第二点，则是具备了 GNSS/GPS 开关，当你不需要定位功能的时候，你能直接硬件关掉 GPS，从而大幅降低功耗。

![ADV CAP LoRa 480MHz 模组实物](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cap-480mhz-module-board.webp)

可能大家会疑惑，为什么这组信号对比不是拿 868 原装模组在 868 频段的最佳状态，去和 480 模组在 480 频段做跨频段比较？

| 对比项（同为 CN480 使用场景） | ADV CAP 868MHz | ADV CAP 480MHz |
| --- | --- | --- |
| 原稿截图 |  |  |
| 近距离接收读数 | -45 dBm | -15 dBm |

原因很简单，当前中国社区节点的频率都在 480 频段（准确来说是 478.875 Mhz）。群里的 ADV 用户为了和群友联通，他们所做的就是把原装 868 MHz 设备地区改到 `CN` （中国），也就是 480 MHz 频率。

所以这组数据回答反映的是，在同样要接入 `CN480` 网络的前提下，原装 868 模组和 480 模组谁更适合当前社区的实际使用。它反映的是实际组网可用性，并非各自芯片在原生目标频段下的理论上限。

这个第三方 480 MHz 模块相比原版 868 MHz 模块，多了一个非常实用的设计，就是手动 GPS 断电开关。在多数 mesh 设备中，GNSS 模块一直都是主要的耗电来源之一，只要持续处于定位尝试状态，就会对续航产生明显影响。

这个功能的价值，在室内使用场景下会变得尤为突出。比如当你把 ADV CAP 带进室内时，其实并不需要设备进行定位，但 mesh 设备不像手机那样可以依靠基站、蓝牙或 WiFi 去推算大致位置，而是会不断尝试重新锁定 GNSS 卫星信号。在卫星信号受阻的环境中，这种反复搜索的过程往往是最耗电的状态之一。因此，能够通过硬件一键关闭 GNSS 供电，就成为一个非常直接且有效的省电手段。

下面这组功耗读数，分别对应三种状态：

- ADV CAP 868 MHz 在默认开启 GPS 时的电流表现

- ADV CAP 480 MHz 手动开启 GPS 时的电流

- ADV CAP 480 MHz 手动关闭 GPS 后的待机电流

| 对比项 | ADV CAP 868MHz（GPS 默认开启） | ADV CAP 480MHz（GPS 开启） | ADV CAP 480MHz（GPS 关闭） |
| --- | --- | --- | --- |
|  |  |  |  |
| 电流读数 | 75.85 mA | 57.48 mA | 2.688 mA |

根据 深圳-陈喜发 的测算，在日常使用场景中手动关闭 GPS 供电，理论上可以带来约 60 小时的续航提升。

当然，这个数字仍然属于开发者侧的推算值，真实续航表现还需要更多用家在实际网络环境中长期使用后才能逐步验证。

后续如果社区里有新的实测数据，我们也会继续补充更新。

## 3D 外壳

如果你在 MeshCN 微信群里，你自然知道群里有一个建模大佬 *南京-Tonas*，他的设计功力深厚，精品频出。

![ADV 配件 3D 外壳爆炸图（南京-Tonas 设计）](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-3d-case-exploded-view-by-tonas.webp)

这一次，他为这个第三方的 480 MHz LoRa CAP 模组设计了专属外壳。

推荐打印参数为 0.2mm 层高、2 层墙、15% 填充，预计打印需时约 50 分钟。

![ADV 配件 3D 外壳装配指引图（南京-Tonas 设计）](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-3d-case-assembly-guide-by-tonas.webp)

在 3D 打印完这个外壳后，第一步是放入 PCB 到外壳里，接着对准放入 GPS 开关，尤其注意缺口的方向；接着盖上后盖，拧入 3 颗 M2 x 6mm 螺丝就大功告成了。

这个外壳已经发布到拓竹社区，链接如下：  

[M5Stack ADV LoRa 470 版本外壳（MakerWorld）](https://makerworld.com.cn/zh/models/2286381-m5stack-adv-lora-470-ban-ben-wai-ke)

如果这个设计对你有帮助，也欢迎顺手点个赞、加个收藏；如果你手上有助力券，也可以顺手支持一下 Tonas。

![ADV 配件 3D 外壳实机正面视图](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-3d-case-front-view.webp)

![ADV 配件 3D 外壳实机背面视图](https://meshcn.net/adv-cap-lora-480mhz-cn470/adv-cardputer-3d-case-rear-view.webp)

## 购买信息

目前可通过模块作者在闲鱼发布的商品链接购买：  

[闲鱼平台｜M5 CARPUTER ADV 第三方 480MHz LoRa CAP 模组](https://m.tb.cn/h.iTicQ4u?tk=l076UzHFHlU)

需要注意，这个产品本身不自带外壳，外壳需要自行 3D 打印。

## 结语

从更大的使用场景来看，这类硬件层面的优化，意义其实并不仅仅体现在单台设备的续航数字上。随着国内 Meshtastic 网络逐渐从点对点试玩，进入到跨区、跨城的真实通联阶段，设备是否能够稳定工作更长时间，正在变得越来越重要。

尤其是在当前组网进展较快的大湾区与杭州湾地区，越来越多群友开始尝试使用便携节点参与长时间在线的城市级链路测试。在这种背景下，支持国内 470/480 频段的 ADV 模组，不仅让设备真正具备参与网络的能力，也让它有机会成为跨城链路中的一环。

目前，大湾区已经实现 RF 打通的城市包括深圳、广州、东莞、中山、佛山、珠海、澳门、肇庆与惠州。而在杭州湾一带，杭州、绍兴、苏州、湖州与上海之间的同城及跨城网络，也正在逐步形成规模。

对于很多 ADV 玩家，以及因为 ADV 不支持 470 MHz 而选择观望不买的玩家，这块来自社区的 480 MHz 模组，某种程度上也意味着他们终于可以把这台设备真正带入国内的 mesh 网络之中。

目前，信号和功耗数据都来源自模块的开发者 *深圳-陈喜发*。后续如果社区里有群友分享实测数据，我们会再更新这篇文章。

> 2026-03-26 更新

> 第一批群友实测已经单独整理成文，有兴趣的话可以继续看《[ADV 470 模组的第一批实测来了](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/)》，里面能更直观看到原装模块切到 `CN470` 后，与 470 模组之间的实际信号差距。
