---
title: "让山脉当高速公路：Zero-Cost Hops 把骨干转发变成免费里程"
date: "2025-12-13"
description: "如果你把 Meshtastic 的山顶节点当成高速公路，很多看似玄学的远距离通信都会突然变得好理解：高海拔、视距好的骨干路由负责把消息跑远，而真正吃跳数的，反而是从室内手持到屋顶、再从远端落回室内的匝道与市区路段。Zero-Cost Hops 做的事，就是让你在这段山脊高速上尽量不扣 hop，把有限的 7 跳留给最难的第一公里与最后一公里。本文用两组场景和清晰的生效条件，带你把收藏路由器从一个看起"
slug: "zero-cost-hops-favorite-routers"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/zero-cost-hops-favorite-routers/

> 以下内容翻译自 Meshtastic 官方博客文章《Zero-Cost Hops for Favorite Routers》。有兴趣的读者可以阅读 [原文](https://meshtastic.org/blog/zero-cost-hops-favorite-routers/)。

如果消息能只用一跳就穿越你整张网的基础设施骨干，会怎么样？  

如果你能只靠 LoRa 把相隔 600 英里的两座城市连起来，而且 hop 还绰绰有余，会怎么样？  

如果你选了一个更快的预设（preset），但它需要消耗两倍的 hop 才能把消息送到朋友那里，而你的 hop 又不够用，会怎么样？

这正是 **Zero-Cost Hops（零成本跳数）** 能为你的 mesh 解锁的能力。

![一张诡异但好笑的跳房子图片，格子里写着多个 3 和 4](https://meshcn.net/zero-cost-hops-favorite-routers/zero_cost_hopscotch.webp)

## TL;DR

这个功能通过在被收藏的路由器之间保留剩余 hop，来提升消息的可达范围。

## 为什么这很重要？

- 像 `SHORT_FAST` 和 `SHORT_TURBO` 这类更快的预设，会用通信距离换取速度。在高密度的城市部署里，这意味着你可能很快就把 7 个 hop 用光。

- **Zero-Cost Hops** 会把部署得当的基础设施路由器骨干网在 hop 计数上压缩成接近一跳，从而把更多 hop 留给第一公里与最后一公里。

- 对管理得当的网络而言，这甚至可以在仍然遵守 7 hop 上限的前提下，实现跨城市、甚至跨国家的通信。

- 它还能避免 `CLIENT_BASE` 变成一个数据包的最后一跳，从而减少消息死在屋顶、进不了室内节点的情况。

## 什么时候 Zero-Cost Hops 会生效？

当且仅当以下条件 **全部满足** 时，这一次转发会保留 hop（也就是不消耗 hop）：

1. 节点角色是 `ROUTER`、`ROUTER_LATE` 或 `CLIENT_BASE`。

2. 这不是该数据包的第一跳。

3. 上一个转发节点（previous relay）在你的 *favorites（收藏）* 列表里，**并且**它的角色是 `ROUTER` 或 `ROUTER_LATE`。

只要这三条里漏掉任何一条，hop 计数就会像平常一样递减。

## 它不会影响什么？

- `CLIENT_BASE` 的重播（rebroadcast）规则完全不变。`CLIENT_BASE` 的逻辑依赖 `from` / `to`，而 Zero-Cost Hops 依赖的是 `relay_node`。

- 把某个路由器加入收藏，**不会**让 `CLIENT_BASE` 节点因此去重播所有数据包。

- 最大 hop 上限仍然是 7。

## 收藏是如何被识别与实现的？

为了让 protobuf 体积更小、内存使用更高效，节点会把 **relay_node** 与你的收藏列表进行匹配，并验证该节点属于基础设施节点。

由于 `relay_node` 只有 8 bit 可用，因此确实存在发生碰撞（collision）的概率。

- 任意一个收藏项与某个随机节点发生碰撞是可能的，而且收藏越多，概率越高。

- 但就算发生碰撞，也必须碰撞的那个节点刚好在该路由器的无线覆盖范围内，才会产生影响。

- 去重（deduplication）机制会避免形成环路。

- 这种意外碰撞很少见，而且通常无害。

在一个示例环境里，碰撞概率如下：

| 节点总数 | 路由器数量（占总数 3%） | 覆盖范围内的收藏路由器（占路由器 20%） | 碰撞概率 |
| --- | --- | --- | --- |
| 10 | 0.3（≈1） | 1 | ~0.4% |
| 50 | 1.5（≈2） | 1 | ~0.4% |
| 100 | 3 | 1 | ~0.4% |
| 200 | 6 | 2 | ~0.8% |
| 400 | 12 | 3 | ~1.2% |
| 800 | 24 | 5 | ~2.0% |
| 1000 | 30 | 6 | ~2.3% |

*注：节点总数是整个网络规模；碰撞概率的计算基于覆盖范围内的收藏路由器数量，而不是把所有节点直接除以 256。比如当网络里有 1000 个节点、覆盖范围内有 6 个收藏路由器时，某个随机 `relay_node` 恰好匹配到覆盖范围内某个收藏项的概率大约是 2.3%。*

在这里，发生碰撞的概率依然是比较低的。

## 两个快速示例场景

### 1）城市（市中心）简化示例

**设置**

- 路由器 **R1** 与 **R2** 使用 `ROUTER` 角色，并且互相收藏。

- 发送方使用 `CLIENT` 角色，想和隔壁城镇的朋友聊天。

**路径**

```
CLIENT → R1 → R2 → CLIENT
```

**Hop 路由**（最大 hop 从 4 开始）

| Hop | 动作 | 计数变化 | 剩余 Hop |
| --- | --- | --- | --- |
| CLIENT → R1 | 正常 | –1 | 3 |
| R1 → R2 | 零成本 | 0 | 3 |
| R2 → CLIENT | 正常 | –1 | 2 |

**结果：** R1 与 R2 之间省下了 1 个 hop，从而在需要时能多留出一个 hop 作为余量。

### 2）家庭基站 + 山顶骨干链路

**设置**

- 屋顶节点使用 `CLIENT_BASE` 角色，并且收藏了本地的 `ROUTER` 节点。

- 每一个山顶节点使用 `ROUTER` 角色，并且彼此互相收藏。

- 其他所有节点都使用 `CLIENT` 角色。

**Hop 路由**（最大 hop 从 7 开始）

| Hop | 路径 | 动作 | 计数变化 | 剩余 Hop |
| --- | --- | --- | --- | --- |
| 1 | 手持 CLIENT → 屋顶 CLIENT_BASE | 正常 | –1 | 6 |
| 2 | 屋顶 CLIENT_BASE → 山顶 ROUTER | 正常 | –1 | 5 |
| 3 | 山顶 ROUTER → 中途 ROUTER | 零成本 | 0 | 5 |
| 4 | 中途 ROUTER → 远端 ROUTER | 零成本 | 0 | 5 |
| 5 | 远端 ROUTER → 远端 CLIENT_BASE | 零成本 | 0 | 5 |
| 6 | 远端 CLIENT_BASE → 前哨 CLIENT | 正常 | –1 | 4 |
| 7 | 前哨 CLIENT → 朋友的朋友 CLIENT | 正常 | –1 | 3 |
| 8 | 朋友的朋友 CLIENT → 朋友 CLIENT | 正常 | –1 | 2 |

这展示了在协议 hop 上限仍为 7 的情况下，依靠零成本 hop 实际上可以走得更远。

## 如何把它用起来？

1.

**有意识地分配角色**

- 高海拔山顶站点用 `ROUTER`。

- 用 `ROUTER_LATE` 去补齐空缺。

- 家里用 `CLIENT_BASE`；把你的手持设备加入收藏。

2.

**精心维护你的收藏列表**  

让所有基础设施路由器节点彼此互相收藏，并把它们添加到你屋顶的 `CLIENT_BASE` 节点收藏列表中。

3.

**测试与追踪**  

在收藏前后各跑一次 traceroute，观察 hop 如何凭空消失。

> 如果带宽允许，把所有路由器都互相收藏来设计你的网络。这样可以尽可能把 hop 留给网络边缘那些风景式绕行的路由路径。

## 现有的安全机制仍然有效

- Early / default / late 的转发时序机制仍然照常工作。

- 数据包去重（deduplication）机制仍然如预期般生效。

- 这个功能在高处节点上影响最大，因此在管理得当的网络中，被滥用的可能性不高。

## 常见问题（FAQ）

**我能把 hop 上限提高到 7 以上吗？**  

不行，仍然是 7。你只是让每一次 hop 的里程效率更高了。

**这不会把 mesh 洪泛到崩溃吗？**  

对管理得当的网络来说，不太可能。

**我需要改固件吗？**  

普通客户端不需要。只有 `ROUTER`、`ROUTER_LATE` 和 `CLIENT_BASE` 节点需要升级到至少 2.7.11 才能支持这个功能。

**`CLIENT_BASE` 算基础设施节点吗？**  

对于来自被收藏路由器的入站流量来说，是的。这样可以避免消息死在屋顶、到不了室内节点。

**traceroute 还能用吗？**  

零成本 hop 对 traceroute 没有影响，除了 traceroute 本身仍然限制在 7 hop。

### 真实世界示例

在 Bay Mesh 网络里，Tahoe 与 San Luis Obispo 之间有超过 700 个节点。只要路由器布局得当，就有可能让消息跨越 300 多英里——在给定地形与距离条件下，这是只有借助零成本 hop 才能在纯 LoRa 上实现的。

通过由 [bayme.sh](https://meshview.bayme.sh/) 托管的 [Meshview](https://github.com/pablorevilla-meshtastic/meshview)，你可以看到零成本 hop 在旧金山、San Luis Obispo 与 Tahoe 之间的实际效果。

![零成本 hop 的 Meshview 视图](https://meshcn.net/zero-cost-hops-favorite-routers/zero_cost_meshview-8d36c09a1f576738b3174749ee02d06f.webp)

## 准备好开始实验了吗？

挑选两到三个关键的基础设施节点，让它们彼此互相收藏。你会看到路由器之间转发时 hop 不再被消耗。对你屋顶的 `CLIENT_BASE` 节点也做同样的设置，你会比以前收到更多消息。

祝你 mesh 玩得开心。愿你的朋友永远都在通信范围内。
