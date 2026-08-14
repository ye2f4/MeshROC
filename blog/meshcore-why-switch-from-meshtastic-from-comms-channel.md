---
title: "MeshCore 入门第二课：为什么我们正从 Meshtastic 切换到 MeshCore"
date: "2026-03-27"
description: "从波士顿、南加州到太平洋西北，越来越多用过 Meshtastic 的社区开始认真转向 MeshCore。这篇文章按原视频顺序，梳理他们为什么切换，以及两者各自更适合什么场景。"
tags:
  - "Meshtastic"
  - "MeshCore"
  - "The-Comms-Channel"
slug: "meshcore-why-switch-from-meshtastic-from-comms-channel"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/

如果你还没看系列第一篇，可以先读《[MeshCore 入门第一课：新手第一次接触 MeshCore 时，最需要先知道什么？](https://meshcn.net/meshcore-newcomer-intro-from-comms-channel/)》。看完再回来读这一篇，前后会更连贯。

如果你已经看完上一篇，大概率会自然想到一个问题：MeshCore 听起来确实有点意思，但它真的好到值得大家花时间和精力，把已经在用的 Meshtastic 网络切过去吗？

这正是 *The Comms Channel* 这条视频想回答的问题。

> 翻译声明

> 本文基于 *The Comms Channel* 于 2025 年 12 月 6 日发布的视频《[Why we’re switching from Meshtastic to MeshCore](https://www.youtube.com/watch?v=guDoKGs02Us)》内容直接翻译整理。这是本系列第 2 篇。

原 YouTube 视频受国内网络环境影响，对国内读者不方便观看。因此，我已搬运到 [Bilibili](https://www.bilibili.com/video/BV1s2XsBkEjf/)。已翻译中文字幕且添加到视频里，看的时候记得打开字幕和 4K 画质哦~

视频一开头，作者就提到一个很真实的现象：每次他做 Meshtastic 视频，评论区里总会有人留言，让他去看看 MeshCore，并且强调 MeshCore 更好。

但问题在于，MeshCore 真的比 Meshtastic 更好吗？真的已经有人愿意投入这么多时间和精力，把自己的 Mesh 网络切换到 MeshCore 吗？

为了弄清楚这件事，作者决定认真看看大家到底在吵什么。好消息是，MeshCore 可以运行在很多和 Meshtastic 相同的硬件上，所以把它刷到自己手头越来越多的 LoRa 设备上，并不算困难。

但有一个大问题：作者所在的地区目前只有他一个 MeshCore 用户，周围其他人都还在用 Meshtastic。

他说，自己当然也可以做一条比较基础的对比视频，比如单纯展示两个平台的 App、固件、配置方式之类的差异，但他想做得更多一点。一方面，这是为了给观众一个尽可能好的对比；另一方面，他自己也确实很好奇。

于是他决定去找真实世界的数据，方法就是联系那些同时使用过 Meshtastic 和 MeshCore 的社区，直接听他们说体验。

作者也知道，MeshCore 和 Meshtastic 这个话题很容易变成站队，有人会变成站 Meshtastic，也有人会变成站 MeshCore。所以他特地联系了美国多个不同地区的 Mesh 社区，希望尽量拿到更广泛的样本。

网上有一个叫 MeshCore Analyzer 的工具。通过这个工具可以看到，美国当时主要有三个区域在使用 MeshCore，分别是 Boston（美国马萨诸塞州波士顿）、Southern California（美国加州南部）和 Pacific Northwest（美国太平洋西北地区）。

![MeshCore Analyzer 上显示的美国活跃区域分布](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/meshcore-analyzer-us-regions.webp)

因为 Meshtastic 出现得更早，而 MeshCore 更新，所以这些已经活跃起来的 MeshCore 网络，很可能两边都用过。每个区域也都有自己的 Discord 服务器。于是作者给他们都发了同样一条消息，说明自己在 Tennessee（美国田纳西州），当地现在只有 Meshtastic，然后请他们分享一下自己使用这两个平台的体验。

## 美国波士顿社区

第一站是波士顿一带的 Mesh 社区。

第一位回复的用户希望匿名。他提到，自己对 MeshCore 的路由方式有很好的使用结果，而且即使跳数很多，群组消息依然相当可用。

另一位同样希望匿名的成员，给出了更长一点的反馈。他说，当然，他们一开始和其他人一样，先从 Meshtastic 开始。刚开始看着地图上不断冒出节点，确实很有意思，但大家很快意识到，实际上一旦超过两跳，就很难真正给别人发消息了。

很多人会接受这个现实，觉得这就是硬件的限制，是大家必须接受的事情。作者也说，这一点和他自己对 Meshtastic 的体验很接近：发消息一直都是时灵时不灵，所以他过去也只是把它当成硬件和 900MHz ISM 频段本身的限制。

但这位用户继续说，自己其实并不满意这种情况。于是他开始深入研究，后来发现了 MeshCore。他开始告诉别人去试着切换，慢慢就带动了当地 MeshCore 社区的增长。

他提到，切换之后，他们很快看到了一个非常明显的变化：消息投递能力有了惊人的提升。他自己现在距离 Boston 大约 30 到 40 英里，依然可以可靠地和整个网络里的人通信。他发出的消息经常会跑 5 到 6 跳，也没有问题。用他的话说，这种差别简直是白天和黑夜。

![波士顿社区成员关于 MeshCore 多跳消息投递能力的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/boston-community-feedback.webp)

他说，变化大到他们甚至已经开始为了好玩做跨州连接。他们很快要和 New York（美国纽约州）合并，未来还计划扩展到 Connecticut（美国康涅狄格州）和 Rhode Island（美国罗得岛州）。在他看来，这是 MeshCore 才让这件事变得可能。

第一位匿名用户后面也补了一句很重要的话。他说，必须承认，和 Meshtastic 相比，MeshCore 的固件和软件现在仍然在成长中，还没那么成熟；但底层的路由工作方式带来的差异，确实是白天和黑夜。

他说，在 MeshCore 里建设一个中继站，会让人非常明确地感觉到，整个 Mesh 网络真的被扩展了。就像前面那位用户说的那样，当你把覆盖进一步往外推时，凡是能够连上这个中继的人，也就等于连上了整个 Mesh。只要部署起来，它基本就是会工作。

## 美国南加州社区

美国第二个比较大的 MeshCore 社区，是 West Coast Mesh（美国西海岸 Mesh），也就是覆盖 Los Angeles（美国加州洛杉矶）和 San Diego（美国加州圣迭戈）一带的 Southern California（南加州）社区。这里的 Mesh 社区正在快速增长。

第一位回复的用户也选择匿名。他的看法是，这两个平台确实适合不同的用途，而且当地至少有一半成员，是从 Meshtastic 转过来的。

很快，另一位同样匿名的 West Coast Mesh 成员也给出了自己的体验。他说，自己算是用了很久 Meshtastic 的老用户，而且现在依然是 Meshtastic 的爱好者。

但他在 Southern California 的使用中，看到自己的跳数不断被消耗，消息始终出不了自己所在的那个小区域。他还提到，当地 900MHz ISM 频段非常活跃，在默认的 LongFast、甚至 MediumSlow 这些参数下，较大的数据包和较长、较低速的 chirp 会彼此碰撞。

而 MeshCore 协议因为包更小、整体 chatter 更少、默认参数也更快更低速率，所以看起来更能处理这些问题，最后给人的感觉就是：消息通信终于像是真的能用了。

![南加州社区成员关于包更小、空口更安静的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/socal-protocol-feedback.webp)

不过他也强调，这并不是说 MeshCore 就一定更好。它离完美还很远，而且随着他们当地网络继续扩大，将来一定也会碰到它自己的上限。所以不能简单地下结论说 MeshCore 一定全面优于 Meshtastic。

但他认为，至少在当前阶段，特别是对于城市环境下、以聊天为核心的使用场景，MeshCore 提供了一个很有价值的方向，让人看到什么样的协议可能会更有性能优势。

第一位匿名用户也补充说，大体上可以这样理解：MeshCore 没那么 ad hoc，它更依赖已经建立好的地点和中继站；但在面对一个用户数量很多、分布范围很大的网络时，它会稳健得多。

![南加州社区成员关于 MeshCore 更依赖固定中继网络的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/socal-established-network-feedback.webp)

视频前面提到，作者经常在 Meshtastic 视频下看到有人留言推荐 MeshCore。而这些留言里，有一位正好就是 West Coast Mesh 社区的成员。

这位用户说，自己以前也是 Meshtastic 用户，但由于网络拥堵，消息根本发不出去。他原本希望用 Meshtastic 和自己的女儿做离网通信，但结果并不理想。于是他转向了 MeshCore。在 Crest Liner 中继装起来之后，他现在发消息和收消息都没有问题。

![West Coast Mesh 成员提到 Crest Liner 中继部署后的体验截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/crestliner-repeater-feedback.webp)

他说，当地网络真的发展得很快。他还记得以前那里可能只有三台中继，而现在再看看，已经完全不是那个规模了。

第一位匿名用户随后又补了一点。他说，Meshtastic 一旦堵起来，虽然在局部小范围内依然不错，但一旦用户数超过 30，就会变得太难管理、太笨重。反过来，MeshCore 的稳定性反而让他们可以把更多精力放在硬件、固件、各种设备组合、部署方式等开发工作上。用他的话说，这是社区在很短时间里完成的一次非常值得称赞的集体努力。

## Pacific Northwest 社区怎么说

接下来，作者联系了美国最大的 MeshCore 网络，也就是 Seattle（美国华盛顿州西雅图）一带的社区。这个网络的范围从 Vancouver, British Columbia（加拿大不列颠哥伦比亚省温哥华），一直延伸到 Eugene, Oregon（美国俄勒冈州尤金）。

因为规模太大，它实际上有两个 Discord 服务器：Puget Mesh（美国西雅图和普吉特湾一带的社区）和 Cascadia Mesh（美国太平洋西北地区的跨州社区）。

第一条回复来自 Cascadia Mesh 里的 Awall。他说，这种差别几乎很难形容。自己过去用 Meshtastic 时，他和朋友们明明把节点都架起来了，彼此之间也只隔着几英里，却完全无法通信。糟糕的私信路径和不理想的 flood 算法，让他们那个高密度网络几乎无法使用。

所以在去年晚些时候，他们认真转向了 MeshCore。那时候当地还一台 MeshCore 中继都没有。他们先在 West Portland（美国俄勒冈州波特兰西部）做出了一张网络，之后就再也没有回头。用他的话说，现在消息通信几乎接近完美。如今他们已经做出了一张从 Eugene 延伸到 Vancouver 的 Mesh。

很快，另一位 Cascadia Mesh 成员 Brian 也补充了自己的体验。他说，MeshCore 的路由是可配置的，因此在某种程度上是可预测、可追踪的。对他来说，这意味着他能够知道，或者自己配置，数据包会沿着什么路径到达收件人，而不是完全交给系统猜。

他还特别提到，MeshCore 不受 7 跳限制。Meshtastic 的 7 跳上限可能意味着，消息可以勉强到达城另一头的对方，但回信却回不来。

不过 Brian 也没有简单说哪一个绝对更好。他说，如果自己是和朋友们去一个没有信号的地方露营，那么他反而会更倾向于 Meshtastic，因为那种情况下，私信不需要依赖专门部署的基础设施中继，而可以直接在 Companion 节点之间处理。

他说，两边都有各自的强项，但他最终会选择那个真正能工作的系统；而且当它不工作的时候，自己还拥有路由管理工具来修正问题，也有诊断工具来理解问题。

作者随后又收到了 Puget Mesh Discord 里一位名叫 Sizian 的成员反馈。他说，在他们那里，Meshtastic 基本上只是勉强能用，即使列表上能看到几百个节点也没什么意义。真正从他们部署出一个高质量中继的那一天开始，MeshCore 才变得非常可用、可靠，而且增长速度也很快。

他直说，他们过去几乎从来没办法在 Meshtastic 上真正维持一段对话；而到了 MeshCore 上，公共频道里则一直有持续不断的聊天。

![Pacific Northwest 社区成员关于 MeshCore 公共频道持续有聊天的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/pnw-public-channel-feedback.webp)

在他看来，Meshtastic 最大的问题，是它的 managed flood 方式几乎注定会让某些数据包在某个地方掉进黑洞。

![Pacific Northwest 社区成员直说 managed flood 容易把数据包丢进黑洞的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/managed-flood-black-hole-proof.webp)

## 视频里是怎么解释两者差异的

作者接着说，两者在路由方式上的差异，是必须单独拿出来讲的重点。

按视频里的说法，Meshtastic 使用的是 managed flood routing（受控洪泛路由，也就是尽量控制谁来转发、何时转发，而不是让所有节点无脑一起转发），也就是节点会等待看看别的节点是否已经在转发消息，然后再根据信号强度优先考虑距离更远的节点，同时也会优先让 router 和 repeater 这类角色承担更多责任。

这套机制在纸面上听起来很好，在一个完美世界里，可能也确实更优雅。但现实里会有太多变量影响这种路由方式。正如前面 Sizian 提到的那样，它很容易制造出黑洞，消息包就这样消失了。整个系统在大范围地理空间里扩展时，表现并不好。

MeshCore 则采取了另一种更简单的办法：pure flood routing。MeshCore 的中继不会尝试做那么多管理。只要它听到了消息，它就重新广播。

作者也承认，这当然会更吵。但代价换来的结果是：消息能过去。

他说，自己联系到的这些 Mesh 社区，几乎都说了同样的话：对于跨越大范围区域的消息通信，MeshCore 就是能工作。

## 作者自己远程体验后的感受

视频后面还提到，西雅图大型 Mesh 网络里有一位叫 Uncle Lit 的成员，给作者提供了一台装有 MeshCore Windows 客户端的远程 Windows 虚拟机，让他可以亲眼看看他们的网络是怎么运作的。

![作者远程连接到 Seattle 西雅图网络时看到的 MeshCore 频道列表界面](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/seattle-remote-client-channels.webp)

作者说，他亲眼看到了真实成功的聊天正在发生，而这件事在他自己 Tennessee 的 Meshtastic 使用经历里，一直都是时灵时不灵。

他探索了节点地图，跑了当地中继的多跳路径追踪，甚至还亲自把自己的消息打进了这张网络。

![作者远程查看 Seattle 西雅图网络时的节点地图界面](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/seattle-node-map.webp)

![作者远程查看 Seattle 西雅图网络时的多跳路径追踪界面](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/seattle-trace-path.webp)

而 Cascadia Mesh 在 Discord 里还有一套监控系统。成员 N0EJ 跟踪到了作者的消息，并确认这条消息打到了 Oregon 的 McMinnville（美国俄勒冈州麦克明维尔）监控点。视频里说，这个点距离西雅图大约 170 英里，而作者的消息正是从西雅图发出的。

![Discord 监控里确认消息成功抵达 McMinnville 监测点的截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/mcminnville-monitor-proof.webp)

## 最后的结论并不是谁彻底赢了

综合这些社区的反馈后，作者认为，大家的总体共识已经比较清楚了：如果是在一个跨越城市、甚至跨越大片地理区域的大型网络里来回发消息，MeshCore 的表现要好得多。

但另一方面，Meshtastic 对于小型、移动中的群体依然更合适，因为每个节点本身都会参与转发。

作者还提到，这个结论也能从 Texas（美国得州）的 Austin Mesh 社区那篇详细对比文章里得到印证。视频里说，Austin Mesh 当时虽然还处在 MeshCore 部署的早期阶段，但增长很快。因为他们写了一篇质量很高的对比文章，所以作者也去问了他们的感受。

![Austin Mesh 关于 Meshtastic 和 MeshCore 的对比页面截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/austin-mesh-comparison-page.webp)

![Austin Mesh 对 Meshtastic 和 MeshCore 的 TL;DR 总结截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/austin-comparison-eli5.webp)

一位叫 Nick 的成员回复说，自己对 MeshCore 的体验非常正面。他原本是一个早期怀疑者，后来却成了支持者。他说，以自己长期玩的经验来看，MeshCore 在长链路上的稳定性，至少和 Meshtastic LongFast 一样，甚至更好，但符号速率却快得多。它把优先级放在消息通信上，而不是遥测上。App 在不同设备之间也更一致，客户端和固件协议里还内建了不少功能，让测试和排障比 Meshtastic 容易得多。

另一位叫 Captain 的成员则说，Meshtastic 会更吸引那些希望一上手就立刻看到一些东西的新用户；而 MeshCore 更适合那些真正只是想通过 Mesh 和朋友稳定聊天，但过去在 Meshtastic 上一直觉得断断续续的人。

他也补了一句很关键的话：Meshtastic 大概还是最适合小型 ad hoc 网络；而 MeshCore 更适合已经建立起来的网络。

![Austin Mesh 成员关于小型 ad hoc 网络与已建网络适配性的反馈截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/captain-small-adhoc-vs-established.webp)

Captain 还转发了 Omaha（美国内布拉斯加州奥马哈）的 Astro Bob 之前发给他们的一条消息。Astro Bob 也提到，自己那边对 MeshCore 的测试结果是积极的。后来当作者联系他，询问能否分享截图时，他又补充说，他们在 Omaha 的测试非常成功。

![Omaha 社区成员补充说当地 MeshCore 测试非常成功的截图](https://meshcn.net/meshcore-why-switch-from-meshtastic-from-comms-channel/omaha-positive-feedback.webp)

于是作者总结说，他们已经听到了来自波士顿、南加州、Pacific Northwest、Austin，以及 Omaha 的反馈，而大家给出的共识其实已经很清晰：对于大规模部署，MeshCore 的表现更好。

当然，作者也说，自己不可能在这条视频里联系到每一个社区。如果你同时使用过两个平台，他也欢迎大家继续在评论区分享自己的体验。

## 作者最后怎么选

视频最后，作者感谢了那些回复他的各地社区成员，并说自己会把他们的 Discord 服务器、网站以及其他想让观众知道的信息，整理进视频简介里。这些社区对任何想了解 MeshCore 的人来说，都是很有价值的资源。

然后他回到了一个观众最关心的问题：那他自己会不会彻底放弃 Meshtastic，全面切换到 MeshCore？

他的答案是：不会完全放弃。

他说，像前面讲过的那样，在移动场景里，他肯定还会继续使用 Meshtastic；但如果是他最初希望 Meshtastic 实现的那种 home-to-home 离网通信场景，他会毫不犹豫地切到 MeshCore。

接着，作者也借这个视频向当地观众发出邀请。他说，自己所在的 Tennessee 那一带当时还完全没有 MeshCore 覆盖，所以现在正好是最早一批参与者塑造当地 MeshCore 网络的机会。

他们需要中继站点、志愿者和早期采用者，特别是在 Chattanooga（美国田纳西州查塔努加）到 Knoxville（美国田纳西州诺克斯维尔）这一带。只要有人参与，他们就能像前面提到的那些社区一样，建设出一个更大、更强、更可靠的 MeshCore 网络。

为了协调这件事，他们已经在 Discord 上建立了 10 mesh 频道，也在 Telegram 上建了 10 mesh 群组。视频里说，这些链接都会放在简介里；如果观众是在电视上看视频，还可以直接扫描屏幕上的二维码。即便你不用 Discord 或 Telegram，也可以通过电子邮件联系他们。

最后，作者按 YouTube 视频的惯例做了收尾：如果这条视频有帮助，欢迎点赞、订阅，也别忘了看看视频简介里那些社区资源链接。

## 结语

如果只看这一条视频给出的信息，那么它想表达的核心其实很直接：MeshCore 不一定在所有场景里都全面胜出，但在大范围、多人参与、依赖固定中继骨架的消息网络里，它确实让很多已经用过 Meshtastic 的社区，感受到了非常明显的差别。

而 Meshtastic 也没有因此失去价值。对于临时、小规模、移动式的 ad hoc 通信，它依然很有吸引力。

这篇是系列第 2 篇。下一篇我们继续按原视频顺序，整理后面的 MeshCore 内容。

## 参考

- The Comms Channel: [Why we’re switching from Meshtastic to MeshCore](https://www.youtube.com/watch?v=guDoKGs02Us)
