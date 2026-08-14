---
title: "ADV 470 模组的第一批实测来了"
date: "2026-03-26"
description: "上一篇我们聊的是 M5Stack Carputer ADV 终于补上了 470MHz 这块关键拼图，而这几天更让人兴奋的，是它开始从支持走向上手。对已经买了 ADV 的群友来说，这块模组终于让设备可以顺利切进国内常用频段；对那些一直喜欢 ADV、却因为没有 470 支持而迟迟没下单的人来说，现在也终于到了可以认真考虑入手的时候。"
tags:
  - "M5Stack"
  - "ADV"
  - "CN470"
  - "LoRa"
slug: "adv-cap-lora-480mhz-cn470-first-field-reports"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/

上一篇介绍《[M5Stack ADV 的最后一块拼图：来自社区的 480MHz LoRa 模组](https://meshcn.net/adv-cap-lora-480mhz-cn470/)》发出去之后，群里这两天经常出现 ADV 的照片，新的模块大家都已经到手。

![ADV 消息界面近景](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-cardputer-message-screen-closeup.webp)

这块 470/480 MHz 模组给已经买了 M5Stack Cardputer ADV 的用户一条真正顺畅的路。以前大家喜欢 ADV，很多时候是先喜欢上它的外形和交互，再回过头来卡在频段这件事上。只要你人在国内，想和群友稳定通信，原装频率不匹配就始终是个绕不开的问题。

现在事情终于简单了很多，换上 470/480 模组，接入 `CN470`，就能更自然地加入大家已经在用的 Meshtastic 和 Meshcore 网络里。

但如果只把这件事理解为老用户终于有升级配件了，那其实还低估了它的价值。过去很多人第一次看到 ADV 外观时就已经心动了，只是想到买回来却没法在国内常用频段里好好玩，热情往往也就停在了购物车里。

自从这个 480 MHz 模块推出后，已经有好几个群友因此马上下单了 ADV。

接下来先看看群友 *西安-BI9ABS* 的分享。

![470 模组本体与外壳部件](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-470-module-board-with-enclosure-parts.webp)

这组图里的外壳，是 [微信群](https://meshcn.net/contact/) 群友 *西安-BI9ABS* 打印出来的。他选了绿色材料，整体看起来很醒目，也很适合 ADV 这类本来就带点玩具感和随身设备气质的小机器。

![470 模组外壳顶视图](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-470-module-green-enclosure-top-view.webp)

更有意思的是，BI9ABS 不是直接原样打印 [Tonas 大佬的模型](https://meshcn.net/adv-cap-lora-480mhz-cn470/#3D-%E5%A4%96%E5%A3%B3)，而是在原本模型基础上稍微加了一点自己的个性化设计，把自己的呼号融进了外壳表面。

这里用到了 3D 打印机的多色打印功能，所以外壳本身就直接带着呼号，不需要后贴标签。呼号部分选了黄色，和绿色外壳放在一起很协调。黄色本来就是绿色的邻近色，视觉上既显眼，又不会突兀。

![装上 470 模组后的 ADV](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-with-470-cap-and-green-case.webp)

## 群友 上海-cx 的信号对比

在看信号对比之前，有一个前提一定要先说清楚。

这组测试里，双方模块都设置成了 `CN470` 的 LoRa 频段参数来做对比。这样做并不是因为 ADV 原装模块最适合这个频段，恰恰相反，原装模块出售时对应的就是 `8xx-9xx MHz` 使用场景，无论是模块本身、配套天线，还是 PA（功率放大器）的设计目标，都不是给 `CN470` 准备的。

所以如果单纯从原装模块的最佳工作状态来说，这当然不是它最舒服的频段，也不是它最公平的理论上限。

但问题在于，今天中国社区里大家日常要接入的，就是 `CN470` 网络。很多已经买了 ADV 的群友，为了能和群友通信，实际做法本来就是把原装模块也切到 `CN470` 去用。

这组测试真正想回答的，也正是在同样要接入 `CN470` 的现实前提下，原装模块和 470 模组各自表现会怎样，而不是比较它们在各自最佳频段下谁更强。

在下面这组信号对比里，*上海-cx* 使用的是 Heltec LoRa32 V3 和 M5Stack Cardputer ADV，两边都烧录了 Meshtastic 原装固件。

这里的角色分工也需要说明一下：ADV 是发送端，Heltec V3 是接收端，手机连接的是 Heltec V3，所以截图里看到的 `RSSI` 和 `SNR`，都是 Heltec V3 接收到 ADV 发来的消息时所记录的信号读数。

测试一共做了两轮，分别是：

1. ADV 和 Heltec V3 放在近距离

2. ADV 和 Heltec V3 相隔 5 米、途中还有桌子等家具遮挡。

两轮测试的目的都一样，不是看原装模块在最佳频段下能跑到什么上限，而是看它们在同样切到 `CN470` 之后，实际接入国内常用网络时会出现什么差别。

第一轮是近距离对比。根据 *上海-cx* 提供的说明，这组测试里 Heltec V3 作为接收端，放在 ADV 上方几厘米外。

![原装模块与 470 模组的近距离 RSSI 对比](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-original-vs-470-module-rssi-comparison-minus79-vs-minus10dbm.webp)

当 ADV 换上新的 470 第三方模块发射时，手机连接 Heltec V3 后显示的接收读数是 `SNR 7.00 dB`、`RSSI -10 dBm`。

当 ADV 使用原厂模块发射时，对应读数是 `SNR 6.00 dB`、`RSSI -79 dBm`。

这说明即便把环境因素尽量压低，只看一个很近的收发条件，专门为 `CN470` 准备的模组和把原装模块硬切到 `CN470` 去用，仍然会拉开非常明显的差距。

第二轮是带遮挡的 5 米测试。根据 *上海-cx* 提供的记录，ADV 作为发送端，Heltec V3 作为接收端，两者相隔约 5 米，中间还有桌子等家具遮挡。

![原装模块与 470 模组的 RSSI 对比——相隔 5 米，途中还有桌子等家具遮挡](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/adv-original-vs-470-module-rssi-comparison-5m-with-furniture-obstruction.webp)

在这组带遮挡的 5 米测试里，当 ADV 使用原装模块并切到 `CN470` 发射时，Heltec V3 端测得 `SNR 5.50 dB`、`RSSI -80 dBm`。

当 ADV 换成第三方 470 模组发射时，Heltec V3 端测得 `SNR 6.25 dB`、`RSSI -30 dBm`。这个差距已经很明显了。

即便不是远距离场景，只是把设备拉开一点距离，再加上室内常见遮挡，原装模块在 `CN470` 下的吃亏就已经开始体现出来。

### 信号对比数据汇总

近距离测试：

| 模块 | 指标 | 数值 |
| --- | --- | --- |
| 原装 ADV 模块切到 CN470 | SNR | 6.00 dB |
| 470 模组 | SNR | 7.00 dB |
| 原装 ADV 模块切到 CN470 | RSSI | -79 dBm |
| 470 模组 | RSSI | -10 dBm |

5 米带家具遮挡测试：

| 模块 | 指标 | 数值 |
| --- | --- | --- |
| 原装 ADV 模块切到 CN470 | SNR | 5.50 dB |
| 470 模组 | SNR | 6.25 dB |
| 原装 ADV 模块切到 CN470 | RSSI | -80 dBm |
| 470 模组 | RSSI | -30 dBm |

这两轮测试放在一起看，已经足够说明，在同样要进入 `CN470` 使用场景的前提下，专门为这个频段准备的 470 模组，和把原装 `8xx-9xx MHz` 模块强行切到 `CN470` 去勉强使用，确实信号差距很大。

## 对 ADV 意味着什么

后面如果群里还有更多不同环境下的截图和反馈，这篇文章还会继续补充。

到那时，我们也许能更完整地看到，这块 470 模组到底会把 ADV 带到一个高度上。

如果你还没看的话，务必读一下这篇《[M5Stack ADV 的最后一块拼图：来自社区的 480MHz LoRa 模组](https://meshcn.net/adv-cap-lora-480mhz-cn470/)》。里面把这块模块的来历、设计思路、功耗表现和 3D 外壳等信息写得更完整，和这篇实测记录一起看，会更容易理解这块 470 模组为什么对 M5Stack 的 ADV 如此重要。

最后顺手放一张群友 *dovechan* 的 ADV 美图。这张和 470 模组本身无关，而是他对 M5Stack ADV 机身做了金属化处理后的实拍，单看外观就已经很有质感。

![dovechan 金属化处理后的 M5Stack ADV 机身](https://meshcn.net/adv-cap-lora-480mhz-cn470-first-field-reports/dovechan-m5stack-adv-metalic-body-enclosure.webp)
