---
title: "GAT562 增加波轮开关完整改装指南（适用于预设消息快捷发送）"
date: "2025-06-28"
description: "一台 GAT562，原本只能一个按钮一个按钮地发消息？这未免也太“老派”了点。如果你也曾在树下、屋顶、野外，用它发送过一句“收到”，那你肯定会想要更高效、更丝滑的操作体验。这次，我们为 GAT562 加装拨轮开关，实现预设消息的滚动选择与一键发送。从硬件焊接、外壳改造，到软件配置与功能验证，每一步都有实拍详解。改完之后，你的 GAT562 就像拥有了对讲机的灵魂，消息发起来，真叫一个“顺手”。准备"
tags:
  - "GAT562"
  - "nRF52"
  - "DIY"
slug: "gat562-rotary-switch-upgrade-for-preset-messages"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/

> 这篇教程由社区 [微信群](https://meshcn.net/contact) 成员 *群里大佬* 提供，感谢他的耐心整理。

GAT562 是 [国内首款适配 LoRa 中国频段、开箱即用的 Meshtastic 设备](https://meshcn.net/GAT-IOT-handheld-review/)。之前社区写了 [多篇相关教程](https://meshcn.net/tags/GAT562/) 去介绍 GAT562 的玩法。

其默认结构已经支持按钮控制，但如果你希望像使用对讲机一样，通过波轮快速滚动并选择预设消息发送，这篇教程将教你如何为 GAT562 增加一个波轮（拨轮）开关，并进行硬件焊接与软件配置，完整实现改装。

> 拨轮编码器的原理是什么？🔍

> 旋转编码器（Rotary Encoder）是一种用于检测旋转角度、方向和位移的电气元件。最常见的类型是增量式旋转编码器，它通过两个输出引脚（称为 A 相与 B 相）产生交错的方波信号。

> 当用户转动旋钮时：

> - A 相与 B 相会产生一系列高低电平的变化（称为“脉冲”）；

> - 这两个信号相位之间有时间差（称为相位差或 90 度相移）；

> - 根据 A 相与 B 相信号变化的顺序，系统可判断旋钮是顺时针（CW）还是逆时针（CCW）旋转；

> - 每移动一格都会生成一组交错信号，主控芯片据此统计转动步数；

> - 多数编码器还带有一个按钮开关，用户可按压确认操作（中按）。

> 这种结构最大的优点是结构简单、响应快速、支持无限旋转，非常适合用作菜单滚动、参数调节或本教程中的预设消息选择控制器。

> 你也可以这么理解：

> 想象你在房间里安了两个感应器：小A 和小B。每当有人转动旋钮，就像有人从你家门口走过，小A 和小B 会依次喊：“有人经过啦！”

> - 如果小A先喊、小B后喊，你就知道那人是从左往右走（顺时针）；

> - 如果小B先喊、小A再喊，那就是从右往左走（逆时针）。

> 你听懂了他们的“喊话节奏”，就能判断方向，甚至还能数出“走了几步”。

> 而拨轮上的按钮就像是这个人敲门告诉你：“我选好了，开门吧！”。

> 这就是拨轮（旋转编码器）工作的基本逻辑。

## 所需材料与工具清单

- GAT562 Mesh Trial Tracker 一台

- 拨轮编码器（常见型号：WS-003DB）一个

- 漆包线若干

- 电烙铁及焊锡

- 十字螺丝刀

- 美工刀

![所需材料](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/tools-required-gat562-rotary-switch.webp)

![电烙铁](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/soldering-iron-tools-required-gat562-rotary-switch.webp)

## 一、硬件改装步骤

### 1. 焊接准备：连接漆包线至编码器

使用电烙铁将三根漆包线分别焊接至编码器的 引脚1、3、4。注意焊点应平整牢固，避免短路。建议在焊接前使用万用表确认引脚定义，通常如下：

- 引脚 1：编码器 A 相

- 引脚 3：编码器 B 相

- 引脚 4：按钮（中按）

![编码器引脚焊接](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/rotary-encoder-wiring-1-2-3-4.webp)

![编码器引脚定义](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/rotary-encoder-wiring-schematic-gat562.webp)

### 2. 拆解设备外壳

使用十字螺丝刀，卸下 GAT562 背部的固定螺丝，分离上盖与底壳。请小心操作，避免拉扯排线或损伤内部结构。

![拆解设备外壳](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/gat562-remove-case-view.webp)

### 3. 外壳改造以安装波轮

使用美工刀，按需修剪设备外壳：

- 上盖中央适度开孔，以容纳拨轮头部露出；

- 底壳内部削平以腾出安装拨轮的位置。

![外壳改造以安装波轮](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/remove-gat562-case-clap-clamp-shell.webp)

建议多次少量修剪，避免一次削太多造成结构损坏。

### 4. 刮出 IO 引脚铜皮

参考拨轮开关所需焊点位置，在主板对应区域使用美工刀轻轻刮除阻焊层，露出裸铜焊盘。

![刮出 IO 引脚铜皮](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/gat562-remove-bronze-layer.webp)

⚠️ 注意：操作需轻柔，以免伤及 PCB 导线或造成短路。

### 5. 焊接拨轮到主板

将拨轮编码器的三根漆包线焊接至 GAT562 主板背面的指定焊点。具体引脚定义如下：

- A 相（旋转）连接至 P0.26：用于检测拨轮的一个相位信号；

- B 相（旋转）连接至 P0.28：与 A 相组合判断旋转方向；

- 中按按钮连接至 P0.04：用于识别用户按下拨轮的操作；

- 公共地线（GND）连接至铜皮：为编码器提供参考地电位。

![焊接拨轮到主板引脚铜盘上](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/gat562-gpio-pins-under-bronze-layer-edit-p0-26-28-04.webp)

请确保：

- 焊接前已确认每个引脚功能，使用万用表测量有助于避免误接；

- 漆包线焊点牢固，焊锡充分包裹铜皮，避免虚焊或短路；

- 所有导线整理平整，避免干涉外壳闭合。

焊接完成后，即可进入 APP 中绑定 GPIO 并配置预设消息的环节。

## 二、APP 软件设置

拨轮连接完成后，我们还需要在 Meshtastic APP 中进行预设消息功能配置。

打开 GAT562 电源，使用 Meshtastic APP 连接该设备。

![预设消息配置界面](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/meshtastic-android-app-canned-message-screenshot.webp)

依次点击「设备配置」→「预设消息」。

![预设消息配置界面-详情](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/meshtastic-android-app-canned-message-screenshot-configure-gpio-rotary-encoder.webp)

| 设置项名称 | 当前值 | 类型 | 描述说明 |
| --- | --- | --- | --- |
| 启用预设消息 | ✅ 已启用 | 开关 | 开启后可使用“预设消息”功能，允许用户定义一组常用语句，通过旋钮快速选择并发送，适用于紧急通联、高频指令等场景。 |
| 启用旋转编码器 #1 | ✅ 已启用 | 开关 | 启用第一个旋转编码器（拨轮）的输入支持。适配社区常见硬件（如 WS-003DB 编码器），用于实现消息列表的滚动和选择操作。 |
| GPIO A 相引脚 | 26 | 数值 | 接旋转编码器的 A 相输出。A 相与 B 相组合判断旋转方向（顺时针或逆时针），建议使用具备中断功能的 GPIO。 |
| GPIO B 相引脚 | 28 | 数值 | 接旋转编码器的 B 相输出。与 A 相配合解析拨轮方向，用于切换上一个或下一个预设消息。 |
| GPIO 按键引脚 | 4 | 数值 | 接旋转编码器的按键（中按）输出。按下拨轮时可触发“发送消息”或“确认选择”等操作。 |
| 按下时生成输入事件 | SELECT | 下拉选项 | 指定按键事件触发的操作，这里设置为 SELECT，通常代表“选择 / 发送”当前高亮的预设消息。 |
| 顺时针（CW）生成输入事件 | UP | 下拉选项 | 拨轮顺时针旋转时的输入行为。设为 UP 即向上移动消息选项列表，用于切换上一条预设内容。 |
| 逆时针（CCW）生成输入事件 | DOWN | 下拉选项 | 拨轮逆时针旋转时的输入行为。设为 DOWN，即向下切换消息，用于选择下一条预设内容。 |
| 再次设定 CW 行为（可能为兼容设置） | UP | 下拉选项 | 与上方 CW 行为相同，可看作备用或重复项（某些版本 UI 中存在）。值保持一致即可。 |
| 再次设定 CCW 行为（可能为兼容设置） | DOWN | 下拉选项 | 与上方 CCW 行为相同，值保持一致即可。建议与实际编码器方向一致，避免操作混乱。 |
| 启用 Up/Down/Select 输入 | ✅ 已启用 | 开关 | 开启后，系统会识别拨轮滚动与点击事件，驱动绑定的 UP / DOWN / SELECT 行为，控制预设消息选择和发送。 |
| 消息列表内容 | Hi\|Hello\|Yes\|No\|OK\|Go | 文本字段 | 设置所有预设消息内容，以英文半角竖线分隔。拨轮滚动可在这些消息中切换，按下后发送当前选中的内容。最多支持 200 字符。 |

在界面中添加若干条常用消息（如 “收到”、“前方塌方”、“一起集合”），每条消息可绑定至拨轮的滚动顺序与确认发送动作。

将预设消息控制绑定至刚刚连接的 GPIO 引脚（即拨轮编码器的旋转和按下功能）。配置好后点击「保存」。

## 三、收尾组装与测试

1. 将上盖盖回并旋紧所有螺丝；

2. 重启 GAT562 并滑动拨轮进行测试；

3. 滚动可切换消息，按下可发送对应预设内容。

![测试拨轮功能](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/gat562-canned-message-with-rotary-encoder-final-pic.webp)

至此，你已完成 GAT562 的拨轮改装！现在可以像对讲机一样，更高效地发送常用消息，提升通联效率。

## 四、鸣谢与后记

特别感谢来自 *武汉 - Wilson* 的首次改装尝试与分享，让这个方案得以传播和优化。Wilson 是真正的极客玩家，不但改装了 GAT562，还开发了专门给 Meshtastic 设备使用的专用 OTA iOS 和 Android 应用 App。后续我们会写新的文章介绍他的实用 App——MTools BLE。

欢迎更多社区玩家基于 GAT562 尝试不同玩法，也欢迎将你的创意分享到 [meshcn.net 社区博客](https://meshcn.net)。
