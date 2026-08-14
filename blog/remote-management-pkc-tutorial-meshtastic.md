---
title: "【超越蓝牙、WiFi、串口】使用 Meshtastic mesh 网络远程管理节点"
date: "2025-04-18"
description: "如果你以为 Meshtastic 的设置方式只能靠蓝牙、WiFi 或者串口，那你可能有点 out 了。现在只需要用一对密钥就能实现远程设置，本文将手把手带你上手，带你解锁 Meshtastic 远程控制的新方法。"
slug: "remote-management-pkc-tutorial-meshtastic"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/remote-management-pkc-tutorial-meshtastic/

> 投稿来自 [社区群](https://meshcn.net/contact) 成员 *群里大佬*。谢谢作者的耐心整理和无私分享。

本文面向熟悉了一部分 Meshtastic 操作的入门用户。操作有风险，请养成备份的好习惯。

除了蓝牙、WiFi、串口，Meshtastic 还能通过 Mesh 网络远程管理节点。2.5 固件版本引入了 PKC(Public Key Cryptography) 密钥机制，可以很方便的远程管理节点。在这之前远程管理只能通过创建 `Admin` Channel 来实现。

## PKC 基础知识

PKC（公开密钥加密）为现代计算机安全体系的核心内容，此处仅浅显地简单说明。详情请搜索：非对称加密/公开密钥加密

> PKC 是什么？先听一个故事 ✉️🔐

> 想象一下，有一个叫小明的人，他住在一个数字城市里。他希望别人能给他寄信，但又不希望其他人偷看到信里的秘密。于是他想了个办法：

> 小明在自己家门口装了一个特殊信箱：

> - 这个信箱的投信口对所有人开放，大家都能把信丢进去；

> - 但是这个信箱只有小明自己能打开，因为只有他手上有那把唯一的钥匙。

> 这个信箱就像是小明的“公钥”，任何人都可以用它来“投信”（加密消息），但只有拥有对应钥匙（私钥）的小明才能打开（解密）。

> 于是：

> - 小红想给小明写封只有他能看的信？用小明家的信箱投进去就行了！

> - 小明收到后，用他的私钥打开信箱，读到小红的信，安全又私密。

> 后来，小明还发现了这个系统的另一个用途：

> 有一天他发了一份重要通知，怕别人说不是他写的，于是他用自己的钥匙在信上盖了一个只有他才能盖的章。

> 大家收到信后，看到这个特殊的章，可以用小明家的信箱（公钥）一验证，发现确实是小明盖的，这就是“数字签名”。

> 于是，小明的这个“信箱系统”成了数字城市的标准配置，大家都安装了：

> - 公钥 = 放在门口的信箱，谁都能用；

> - 私钥 = 自己藏好的钥匙，谁也看不到。

> 这就是 PKC：公开密钥加密（Public Key Cryptography）的原理！

在 PKC 体系下，一个人拥有一对密钥，分为公钥（Public Key）和私钥（Private Key）。公钥顾名思义可以公开，而私钥则是永不公开的秘密信息。使用数学生成出的一对公私钥之间存在紧密联系，安全性由现代密码学进行保证。私钥具有唯一性，可以通过私钥生成出公钥；反之使用公钥无法推导出私钥。

假设 A 公开了他的公钥：

- 大家如果想要向他秘密地发送消息，可以使用 A 的公钥进行加密，而解密只能使用 A 的私钥。由于私钥未公开，只有 A 可以解密大家发给他的消息。（加密）

- A 可以使用私钥对消息或文件进行签名，证明出自他自己。大家可以使用 A 的公钥来验证签名是否出自 A 之手。（签名）

## Meshtastic PKC

2.4 版本及以前的 Meshtastic 会使用收件人预公开的 PSK 进行私聊（DM）加密。在 2.5 版本以后，由于 PKC 的加入，需要强身份验证的功能会使用 PKC 进行加密或身份验证，具体如下

| 功能 | 加密方式 | 说明 |
| --- | --- | --- |
| Channel 频道聊天 | PSK | 鉴于频道的公开/半公开性，PKC 群聊并不适合 |
| DM 私聊 | PKC | 加密内容、签名消息 |
| Remote Management 远程管理 | PKC | 验证身份、加密指令内容 |

在本文涉及的远程管理部分，Meshtastic 使用 Ed25519 椭圆曲线算法交换临时生成的 PSK 进行通讯，为了防止重放攻击还引入了 Session。

## 使用 PKC 管理远程节点

本文以 iOS Meshtastic App 为例。

操作很简单，一句话就是：将控制端的公钥，存储在被控端。

### 控制端

进入 Settings ➡️ Security，长按复制 Public Key。

![Meshtastic-Security-Config-Public-Key-公钥](https://meshcn.net/remote-management-pkc-tutorial-meshtastic/Meshtastic-Security-Config-Public-Key-%E5%85%AC%E9%92%A5.png)

### 被控端

进入 Settings ➡️ Security，将复制的 Public Key 粘贴到 Primary Admin Key，然后保存。

此处一共有三个槽位（Primary、Secondary、Tertiary），可最多接受三个节点的控制。

### 远程控制

在控制端，打开 Settings ➡️ App Settings，开启 Administration，然后回到上一级 Settings 目录。

此时会多了一个可以选择节点的列表，在这里选择被控端即可。

![Meshtastic-Remote-Management-Admin-Channel](https://meshcn.net/remote-management-pkc-tutorial-meshtastic/Meshtastic-Remote-Management-Admin-Channel.png)

开始连接时软件会进行协商，远程控制就绪之后节点名会变成小字。

![Meshtastic-Remote-Management-Admin-Channel-Node](https://meshcn.net/remote-management-pkc-tutorial-meshtastic/Meshtastic-Remote-Management-Admin-Channel-Node.png)

随后就可以通过 Mesh 网络管理节点了。
