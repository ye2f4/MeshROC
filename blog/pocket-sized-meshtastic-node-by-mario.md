---
title: "小到极致，大有可为：Mario 分享口袋版 Meshtastic 节点设计"
date: "2025-04-26"
description: "在这个动辄大而全的时代，或许你很难想象，一块巴掌大小的 PCB，也能承载起 mesh 通信的梦想。来自 MeshCN 社区的群友 Mario，用他的巧思与极客精神，打造出一款口袋级的 Meshtastic 节点。这不仅是一场个人的 DIY 实践，更是一份无私分享的礼物。"
tags:
  - "fakeTec"
  - "DIY"
  - "Pro-Micro"
slug: "pocket-sized-meshtastic-node-by-mario"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/pocket-sized-meshtastic-node-by-mario/

如果你曾经来到 MeshCN 社区微信群逛一圈，就会发现这里的人才密度堪称惊人：PCB 硬件高手、嵌入式软件专家、极客、LoRa 大厂工程师齐聚一堂，每个人都有两把刷子，动手能力也普遍惊人。

更重要的是，这里的氛围尤其鼓励创新，哪怕只是灵光一现的小 idea，也总能引来大家纷纷点赞、鼓励，甚至马上有人要组队开坑，准备“众筹”打板试验。

这种良好的社区氛围，或许正是大家热爱 MeshCN 的重要原因之一。

最近，来自上海的群友 *Mario* 又带来了一个让整个社区眼前一亮的新作品：一块极小巧、极精致的 Meshtastic 通信 PCB。

![](https://meshcn.net/pocket-sized-meshtastic-node-by-mario/pcb-assembled-pocket-size-meshtastic-pro-micro-landscape.webp)

说起来 Mario 的这个设计，灵感源自 [此前在社区大受欢迎的 FakeTec](https://meshcn.net/what-is-fakeTec-opensource-diy-meshtastic-project/)。FakeTec 提供了一个思路：通过直接焊接市面上成熟的 nRF52 Pro Micro 开发板，极大降低 DIY 门槛，让 Meshtastic 节点的组装变得更简单，也更经济。

Mario 的设计延续了这种思路，同样选择了直接将现成的 Pro Micro 开发板焊接到 PCB 上。这样一来，DIY 的难度和成本迅速下降，只需购买通用的 Pro Micro 模块即可，无需额外花费精力去定制复杂的主控电路。

但与 FakeTec 不同的是，Mario 的 PCB 将空间利用率提升到了一个新的高度。

在原先 FakeTec 的设计中，nRF52 Pro Micro 开发板和 LoRa 模块在同一面挨在一起，呈水平布局。

而在 Mario 的 PCB 巧妙地利用了 PCB 的两面，不浪费任何空间，把原本二维的思考，变成了三维的布局。

![](https://meshcn.net/pocket-sized-meshtastic-node-by-mario/pcba-not-assembled-pocket-size-meshtastic-pro-micro.webp)

在正面，他巧妙地布局了 nRF52 Pro Micro 开发板，让 Type-C 充电接口和主控芯片有条不紊地集中在一面。

而在 PCB 背面，他则安排了对 Meshtastic 节点最关键的 LoRa 模块（RA-01S），并细致地布置了两个必不可少的物理按键：RST 复位键和 USR 用户键。这样一来，整个板子两面都被充分利用，小巧且功能丰富，带来了极佳的便携体验。

在以下照片中，你能清晰看到 Mario（图里左 PCB）相比原先 fakeTec（图里右 PCB）是巨大的，缩减接近一半的大小。

![](https://meshcn.net/pocket-sized-meshtastic-node-by-mario/size-comparison-mario-vs-faketec.webp)

更贴心的是，Mario 还在这块极小的 PCB 上集成了一颗震动马达。当节点在 Mesh 网络中收到新消息时，板载的震动马达便会轻微振动提示。这意味着，即便你将这个 Meshtastic 节点随手塞进裤袋或背包，也依然不会错过任何重要消息。无论你是在嘈杂的户外活动现场，还是安静的图书馆，震动提示都能恰到好处地通知你。

## 你也想试下这块超小型 Meshtastic 节点吗？

更令人钦佩的是，Mario 不仅自己设计、打板、测试，还选择了将这块 PCB 的 Gerber 文件无私分享给社区所有成员——真正做到了“一个人设计，万人受益”。

只要你也对这款超小型 Meshtastic 节点感兴趣，无需自己从零画板、对接工厂、反复验证，只需下载 Mario 提供的 Gerber 文件压缩包，上传到像嘉立创（JLCPCB）这样的 PCB 生产平台，下单生产，坐等两三天快递送货上门，你就能拥有属于自己的专属小节点。

这正是 MeshCN 社区魅力的最佳写照：不仅是交流和讨论的地方，更是一个“说干就干、共享成果、造福群友”的极客乐园。在这里，每一个优秀的想法，都有机会被打磨成真正可用的工具，而每一个愿意分享的人，都能激励更多人投身到 Meshtastic 的世界中去。

如果你已经迫不及待想要动手，不妨点击下方链接，获取 Mario 精心打磨的 Gerber 文件，开启你的 DIY 之旅：

👉 [点击这里跳转 Mario 的 Meshtastic PCB 开源项目主页](https://oshwhub.com/shenye894/meshtastic-mini)

如果在打板、焊接过程中遇到任何问题，放心，我们 [MeshCN 微信群](https://meshcn.net/contact/) 里的小伙伴一定会热心解答，毕竟——这里就是这么一个互帮互助、鼓励创新的地方。
