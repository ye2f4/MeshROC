---
title: "MeshCore 入门第一课：从一条视频读懂它怎么工作"
date: "2026-03-18"
description: "这篇文章带你从零理解 MeshCore 的基本工作方式：设备角色、首包泛洪与后续直连、Room Server 的意义，以及它和 Meshtastic 在入门层面的关键差异。按 The Comms Channel 的《There's a newcomer to the Mesh world》视频内容翻译整理。"
tags:
  - "MeshCore"
  - "The-Comms-Channel"
slug: "meshcore-newcomer-intro-from-comms-channel"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshcore-newcomer-intro-from-comms-channel/

如果你已经关注 MeshCN 一段时间，大概率对 The Comms Channel 不陌生。MeshCN 社区创立之初，很多初步摸索都靠这位博主的视频。

这次我们也开始一个新的 MeshCore 系列翻译整理：按 *The Comms Channel* 的视频顺序持续更新，视频会同步转载到 B 站，并配套中文字幕汉化。

> 翻译声明

> 本文基于 *The Comms Channel* 视频《[There’s a newcomer to the Mesh world](https://www.youtube.com/watch?v=iaFltojJrAc)》内容翻译整理。这是本系列第 1 篇，重点是入门概览，不是深度对比评测。

MeshCore 的目标和 Meshtastic 很接近，都是围绕低成本 LoRa 硬件，做一个开源、加密、离网可用的文本通信网络，不依赖蜂窝网络或 Wi-Fi。

区别在于，MeshCore 在空口流量控制、节点可见性和消息路径收敛上，更强调尽量减少无效广播，把空口资源留给真正要发送的消息。

原 YouTube 视频受国内网络环境影响，对国内读者不方便观看。因此，我已搬运到 [Bilibili](https://www.bilibili.com/video/BV1MpwQzjEna/)，并在下方嵌入播放器。

已翻译中文字幕且添加到视频里，看的时候记得打开哦~

## 一个标准 MeshCore 配置，实际由什么组成

按视频里的描述，一个典型 MeshCore 使用链路很直白: 手机 App 通过蓝牙连到节点设备，节点再通过 LoRa 和周围设备通信。对已经在用 Meshtastic 的朋友来说，门槛相对低，因为很多现有硬件本来就能刷 MeshCore。

短距离蓝牙负责手机和节点之间的本地连接；LoRa 负责节点与节点之间的远距离链路。你在手机里点发送，消息先走蓝牙到节点，再由节点发到 LoRa 空口。

视频里提到 MeshCore 的三种常见固件形态，分别对应三种使用目标。Companion 固件是最常见的个人终端形态，配合手机 App 收发消息。Repeater 固件适合放在山地、高点或天线条件好的位置，负责转发消息、延展覆盖。Room Server 固件更像有记忆的留言房间，重点不是实时来回对话，而是让用户离线后回来还能读到期间留在房间里的内容。

很多人刚接触 Room Server 时会把它当普通群聊机器人，但视频给的定位更接近留言信箱。也就是说，它解决的是错过在线时段还能补看内容，而不是替代你所有实时私聊场景。

## MeshCore 如何让网络更安静

Meshtastic 用户很容易感受到一个差异: 在 Meshtastic 里，节点会周期性对外广播我在这里；而 MeshCore 选择把这件事做得更克制。

在 MeshCore 中，普通设备默认不会频繁自动宣告自身存在。你需要手动发一次 advert（可理解为亮相广播）告诉网络你上线了。这样做的目的，是降低空口里无业务广播的占比，提高消息真正投递时的可靠性。

视频还给了一个具体参数: 如果设备运行的是 Repeater 或 Room Server 固件，advert 可以自动发送，但频率很低。默认是每 12 小时一次，并且可调范围是 3 到 48 小时。MeshCore 的设计就是把广播变成低频、可控、和角色绑定的行为。

## MeshCore 路由原理：先泛洪

第一次私信发送时，MeshCore 采用 flood routing（泛洪路由）。也就是消息先被范围内中继尽可能扩散，一级一级转发，直到有节点能把包送到目标。这个阶段会比较吵，因为同时参与转发的节点多，空口里会出现明显的并发通信。

但 MeshCore 的关键不在泛洪，而在泛洪之后立刻收敛。视频里明确说，首次泛洪过程中，中继会记录消息经过的路径；路径信息随后传到目标端。目标一旦知道回程最有效路径，回复就不再重复泛洪，而是走 direct path（直连路径）回去。

从这个时刻开始，双方后续消息都尽量沿这条更干净的路径走。结果是网络流量明显下降，通信效率和稳定性同时提升。

视频还给了失败回退机制: 如果这条直连路径上的某一跳失效，比如某个中继离线，消息会投递失败。连续失败三次后，系统会自动退回泛洪重新找路；找到可用路径后，再切回直连模式继续通信。

## 它和 Meshtastic 的关系，视频是怎么说的

The Comms Channel 在视频里没有回避对比，但态度很克制。他明确提到: Meshtastic 在 2.6 版本里已经有 next hop routing（下一跳路由）这类能力，所以私信逐步收敛路径并不是 MeshCore 独有概念。

MeshCore 在这条视频里强调的差异点是另一件事: 如果你已经知道要走哪条路径，可以在 App 里手动指定，跳过首次泛洪。这在业余无线电语境下很容易理解，类似你预先指定报文经过哪些中继路径。

这意味着 MeshCore 给了高级用户更强的路径控制手段，但也意味着你需要更清楚地理解网络拓扑，才能把这个功能用好。对入门用户来说，先让自动机制跑起来，再考虑手动路径，会更稳妥。

当聊天对象从一个人变成分散在大范围的一群人时，无论 MeshCore 还是 Meshtastic，公共房间消息本质上都离不开泛洪。原因很现实，目标是一个分布式群体，不是单一终点，几乎不可能靠一条固定直连路径覆盖所有接收方。

Room Server 在这里扮演的是延时可读的组织层，而不是神奇路由器。用户需要登录房间或通过 ACL（访问控制列表）获得权限。每个 Room Server 还带密码，默认密码可以保持 `hello` 作为公开入口，也可以改成自定义密码进行访问限制。

还有一个很有价值的工程点: 视频提到 Room Server 在底层仍复用直连路径逻辑。也就是说，前面讲的路径收敛收益，在 Room Server 场景同样能用上。

## 结语

如果你是刚接触 LoRa Mesh 的新手，这条视频最友好的地方是把概念讲得足够直白，尤其是 Companion、Repeater、Room Server 三种固件角色，以及 advert、flood routing、direct path 这些核心词之间的关系。先把理论搞懂，后面的部署、参数、设备选择就会轻松很多。

这篇是系列第 1 篇。如果你已经理解了 MeshCore 的基本工作方式，建议继续读系列第二篇：[《MeshCore 入门第二课：为什么我们正从 Meshtastic 切换到 MeshCore》](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/)。那一篇会接着看多个美国社区为什么开始认真从 Meshtastic 转向 MeshCore。

## 参考

- The Comms Channel: [There’s a newcomer to the Mesh world](https://www.youtube.com/watch?v=iaFltojJrAc)
