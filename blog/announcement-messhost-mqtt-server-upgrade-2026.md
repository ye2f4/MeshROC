---
title: "【公告】杭州-朱哲完成 MESS.HOST MQTT 服务器升级"
date: "2026-02-23"
description: "农历新年假期期间，杭州-朱哲完成了 MESS.HOST MQTT 服务升级：Broker 从 Mosquitto 切到 EMQX，服务器从 1 核 2G 升到 2 核 2G，带宽也有明显提升。"
tags:
  - "MQTT"
slug: "announcement-messhost-mqtt-server-upgrade-2026"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/announcement-messhost-mqtt-server-upgrade-2026/

这是一篇简短公告，也是一篇感谢帖。

过去很长一段时间，国内群友做 MQTT 互联时，基本都绕不开 *杭州-朱哲* 维护的中国境内 MQTT 服务器，至少九成群友都用过 `mqtt.mess.host`。朱哲大佬之前写的《[连接 MQTT 服务器掉线？快试国内的第三方 Meshtastic MQTT 服务器](https://meshcn.net/how-to-connect-to-messhost-third-party-china-mqtt-server/)》也一直是很多新朋友进群后的必读文之一。MeshCN [每周五晚上八点的签到活动](https://meshcn.net/tags/%E7%AD%BE%E5%88%B0/)，也是在朱哲大佬的 MQTT 服务器上举行。

这次农历新年假期里，朱哲把 MQTT 服务做了一轮升级：

1. MQTT Broker 从之前的 Mosquitto 切换到了 EMQX。

2. 服务器配置从 1 核 2G 升级到 2 核 2G，带宽也从过去大约 1-2 Mbps 提升到约 4-6 Mbps。

3. 新的套餐带有每月 300G 流量上限，不过按 MQTT 这类消息负载的特点，正常使用下对流量和带宽的压力都不算大。

接下来一段时间，流量会逐步切到新 MQTT 服务器上。如果你已经在用 MESS.HOST，通常不需要额外改动配置；如果切换期间遇到偶发连接异常，直接在 [MeshCN 微信交流群](https://meshcn.net/contact) 里反馈即可，我们会一起跟进。

另外，朱哲也提到后续会评估加入黑名单能力，用来处理少数滥用服务的情况，尽量把公共资源留给正常通信的群友。

再次感谢朱哲长期维护这套基础设施。很多人每天在频道里那句看似普通的问候「咕咕嘎嘎」，背后其实都离不开这些群友默默的投入。
