---
title: "MeshCN 周五点名：2026 年 2 月 6 日签到记录（晚了下班）"
date: "2026-02-06"
description: "本周点名由 HAYS-MQTTastic（HAYM）担任主控。因为下班较晚，签到从 21:50 左右才正式拉开，但现场节奏依旧很快：温州、北京、苏州、南宁、上海、武汉、济南等地友台接连上台，TinyLora、GAT562、Heltec V3、Femtofox、t-echo、T-Beam Supreme 等设备同场报到。签到过程中还顺带处理了 rangetest 误开的问题，并同步了 TinyLor"
slug: "2026-02-06-weekly-friday-meshcn-meshtastic-roll-call-check-in"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/2026-02-06-weekly-friday-meshcn-meshtastic-roll-call-check-in/

这周五的 MeshCN 点名，不是八点准时开场，而是更接近日常工作状态的一晚。

2026 年 2 月 6 日（周五）晚上 21:50 左右，主控 *HAYS-MQTTastic（HAYM）* 在频道里先打了个招呼，确认大家是否能互相收发消息。等链路确认没问题后，他说自己是刚下班到家，签到会晚一点开始。短短几句「咕咕嘎嘎」，把现场气氛先热起来了。

21:50 一到，格式重新贴出，点名正式开始：

```
地名 呼号/昵称 设备XXX 上台签到！
```

第一波签到来得很快。浙江温州 BD1DNA 带着 TinyLora 拿下头筹，还是新台第一次上来报到；北京 BG1RHJ、江苏苏州 BA4RUU、广西 BG7QXG、北京 BD1BCX、上海 Sickle 等友台几乎连成一串，把频道瞬间刷成了全国接龙。

中段也有很典型的周五夜间现场感。有人刚拿到设备、边试边问，有人遇到 rangetest 开关灰掉的问题，频道里马上有人提醒这会导致持续发包和频繁震动，主控也及时喊话先把 rangetest 关掉，避免影响其他人正常使用。点名活动的意义一直不只是报个到，也是每周一次快速互助和网络体检。

## 当晚动态：TinyLora-C3 V3 已开源过审

签到进行到后半段时，*武汉-yaoyao* 确认 TinyLora-C3 V3 已从工厂回板，在嘉立创开源广场项目已过审。项目沿用 0805 阻容并采用模组方案，复刻和焊接门槛相对友好。

![TinyLoRa-C3 V3 嘉立创开源广场项目页截图](https://meshcn.net/2026-02-06-weekly-friday-meshcn-meshtastic-roll-call-check-in/tinylora-c3-v3-jlc-oshwhub-page-screenshot.png)

这版项目已发布到嘉立创开源广场：  

[kangyuzhe/tinylora-c3-v3-kai-yuan](https://oshwhub.com/kangyuzhe/tinylora-c3-v3-kai-yuan) 。可以直接使用项目里的 BOM、gerber 文件进行 DIY 采购和生产。

同时，闲鱼端也已同步上架（关键词：TinyLoRa-C3 V3）。我看到商品选项里还能选外壳、天线、传感器等配件，非常适合喜欢直接买成品的朋友。

对正在选板或准备 DIY 节点的朋友来说，这一条算是当晚最实用的附加信息。

## 2026 年 2 月 6 日 MeshCN 点名记录

下面按当晚主控回复的编号整理，共 19 条：

```
20260206 MeshCN 点名记录
1. 浙江温州，BD1DNA，TinyLora，新台第一次签到
2. 北京 BG1RHJ GAT562 签到
3. 江苏苏州 BA4RUU 设备Meshtiny 上台签到
4. 广西南宁 BG7QXG 设备NRF52 上台签到
5. 北京 BD1BCX 设备 Heltec V3 签到
6. 上海 Sickle  设备 Femtofox  上台签到
7. 浙江嘉兴 f251 设备t-echo 上台签到
8. 武汉-yaoyao 设备TinyLora-C3 V3 上台签到
9. 山东济南   34C4  M5stack adv 上台签到
10. Beijing At
11. 北京 Artesia 设备T-Beam Supreme 上台签到！
12. 四川乐山  嘉州 樱花派  签到
13. 广东汕头_萤雪_设备_gat562 mesh watch_签到-PSM
14. 广东汕头 lunnes 樱花派 签到
15. 广东汕头 lunnes meshmonitor——V3 签到
16. 广西南宁   STORM  设备NRF52上台签到
17. 广东汕头 lunnes c1 签到
18. 湖南邵阳-BG7FEB，使用设备Heltec V3，上台签到
19. QTH黑龙江大庆
```

这周签到人数比前两次少一些，现场也有人提到这个体感。HAYM 的判断很直接：这次预告不算充分，很多人可能错过了开场时间。这个反馈挺重要，后面我们会继续把点名预告提前同步到群里，尽量让想上台的朋友都能赶上。

如果你这次在频道里潜水看完了，下周可以直接复制下面这句发出来：

```
地名 呼号/昵称 设备XXX 上台签到！
```

你发出的不只是一条消息，也是一个在线节点在说：我在，设备在，链路也在。
