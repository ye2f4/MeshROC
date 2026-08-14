---
title: "零焊接也能玩 Meshtastic：用闲置的 ESP32/nRF52 开发板搭建 LoRa 节点"
date: "2025-09-08"
description: "想体验 Meshtastic，却又不想折腾电烙铁？其实，你抽屉里那块吃灰已久的 ESP32 或 nRF52 开发板，就足够开启一段低成本的探索。只需不到二十块钱，再加上几根杜邦线和一个 LoRa 模块，你就能拼出一台能跑起来的 Meshtastic 节点。它不需要打样 PCB，不需要焊接，甚至不用准备外壳。"
tags:
  - "nRF52"
  - "ESP32"
  - "DIY"
  - "LR30"
slug: "diy-node-without-soldering"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/diy-node-without-soldering/

> 这篇教程由 MeshCN 社区 [微信群](https://meshcn.net/contact) 成员 *群里大佬* 提供，感谢他的耐心整理。

如果你想花费较小的成本体验 Meshtastic，上个月由 MeshCN 微信群里的活跃群友 *武汉-YaoYao* 发起的 [TinyLora 项目](https://meshcn.net/tinylora-open-source-lora-module/) 以及更早之前开源的 [Faketec 项目](https://meshcn.net/what-is-faketec-opensource-diy-meshtastic-project/) 会是你的优秀选择。

但是，如果爱折腾的你已经拥有一块 ESP32 系列或 nRF52840 开发板，那么你只需要不到 20 元即可开启探索 Meshtastic 的奇妙旅程——甚至不需要打开你的焊接工具。

## 准备工作

在一切开始之前，从收纳箱里找出一块（或直接在电商平台订购一块）基于 ESP32/nRF52840 的开发板，下表描述了哪些 MCU 可以使用。如果没有合适的开发板，也可以直接购买一片 ESP32-S3 SuperMini 或 nRF52840 ProMicro。

| MCU 型号 | 特点 |
| --- | --- |
| ESP32 | 初代 ESP32 型号，拥有数量尚可的 GPIO。比较旧的 MCU，资源有限，运行 HTTPS 服务存在限制 |
| ESP32-S3 | Heltec V3 同款 MCU，性能澎湃，GPIO 丰富，但代价是它的高耗电高发热量 |
| ESP32-C3 | TinyLora 同款 MCU，GPIO 偏少，但相对于 ESP32-S3 略微省电 |
| ESP32-C6 | 拥有比 ESP32-C3 更多的 GPIO，以及 2.4G 和 WiFi6 连接能力，当前 Meshtastic 固件无法驱动蓝牙和 Web Server，不建议使用 |
| nRF52840 | Faketec 同款 MCU，拥有最低的耗电量以及丰富的 GPIO，但价格较贵且 Flash 闪存资源吃紧 |

同时，还需要一个 LoRa 模块将数据包发送到空中，基于 SX1262 的大夏龙雀的 [DX-LR30-433M22SP模块](https://item.taobao.com/item.htm?id=920673909514) 预先焊接好了排针，所以即使我们没有焊接设备也能将 LoRa 模块和 MCU 连接起来。

LoRa 模块通常直接由开发板的 3.3V 引脚供电即可。如果遇到反复重启等异常，请参考文末的 [常见问题与调试技巧](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)。

当然，我们还得取得一根合适的天线，这里选择由 [MeshCN 社区微信群友](https://meshcn.net/contact/) *深圳-jinsu* 推荐的[胶棒天线](https://item.taobao.com/item.htm?id=598454033526)。

最后只需要一些接触良好的短母对母杜邦线即可开始旅程，考虑到空间占用和 SPI 信号质量，杜邦线自然是越短越好。如出现“无连接”提示，请参考文末的 [常见问题与调试技巧](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)。

上述四样物品应该不会花费你超过 20 元（如果购买新的开发板可能花费 30 元），如果价格超过这个数目本文可能已经过时，请选择其他模块。

## 开始组装

准备好你的开发板后，将它连接至计算机，打开 [Meshtastic 在线烧录网站（flasher.meshtastic.org）](https://flasher.meshtastic.org/)；选择“Select Target Device”。

![在烧录网站选择 MCU 型号](https://meshcn.net/diy-node-without-soldering/select-mcu-compressed.webp)  

*在烧录网站选择 MCU 型号*

在右侧的按钮中选择你的 MCU 型号，选中后在下方的设备列表里逐个尝试刷入，直到找到一个稳定不重启的固件。如果刷机后遇到循环重启，请参考文末的 [常见问题与调试技巧](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)。

一旦找到一个合适的固件，接下来你需要在 [Meshtastic 固件的 GitHub 源码库](https://github.com/meshtastic/firmware/tree/master/variants/) 中搜索你固件的设备名，找到记录设备编译信息的 platformio.ini 同文件夹下的 variants.h（位于 `firmware/variants/&lt;你想刷入的固件的设备名>/variants.h`），查找文件中的内容是否包含：

- `#define USE_SX1262`

- `#define SX126X_DIO2_AS_RF_SWITCH`  

如果文件中包含 `#define SX126X_DIO3_TCXO_VOLTAGE`，文件内容还应当包含：

- `#define TCXO_OPTIONAL`

若其中的内容有不符合，请**重新寻找**一个可在开发板上正常运行并符合上述条件的设备固件。

找到合适的设备固件后，请确认 variants 文件中已正确声明使用 SX1262 模块。如果你在不同频段使用模块，请参考文末“常见问题与调试技巧”。

找到合适的设备固件后，我们需要使用杜邦线将 LoRa 模块和开发板连接起来。

![一个典型的 variants 文件内容](https://meshcn.net/diy-node-without-soldering/variant-sample.webp)  

*一个典型的 variants 文件内容*

别看上面那坨 `#define` 宏定义密密麻麻，其实这是类似一份接线说明书。固件要想和 LoRa 模块说话，就得先知道：用哪颗芯片、哪些引脚、走什么总线。我们一条条拆开来聊。

```
// LoRa chips


#
define
 USE_LLCC68


#
define
 USE_SX1262


#
define
 USE_SX1268
```

这几行就是告诉固件：我可能会用到哪些 LoRa 芯片。实际搭建里，我们选的 DX-LR30 模块是 SX1262，另外两行可以理解成“备用选项”。

```
// SPI


#
define
 LORA_SCK 10


#
define
 LORA_MISO 6


#
define
 LORA_MOSI 7


#
define
 LORA_CS 8
```

这部分是 SPI 总线，负责数据收发：

- SCK 就是时钟，敲节拍用的。

- MISO 是模块发出的数据，MCU 来接。

- MOSI 则反过来，MCU 说话，模块来听。

- CS 是片选开关，拉低它就表示“现在轮到你了”。

```
// LoRa


#
define
 LORA_DIO0 RADIOLIB_NC    
// NC


#
define
 LORA_DIO1 3              
// IRQ


#
define
 LORA_DIO2 RADIOLIB_NC    
// Attached internally to rfswitch.


#
define
 LORA_BUSY 4


#
define
 LORA_RESET 5
```

这几行是 LoRa 模块的功能脚：

- DIO0 和 DIO2 在这里没用到，干脆写成 NC（Not Connected）。

- DIO1 接到 GPIO3，是 中断脚，用来提醒 MCU 有新消息来了。

- BUSY（GPIO4）就像忙碌灯，亮着的时候别打扰它。

- RESET（GPIO5）顾名思义，就是复位。

```
#
define
 SX126X_CS    LORA_CS


#
define
 SX126X_DIO1  LORA_DIO1


#
define
 SX126X_BUSY  LORA_BUSY


#
define
 SX126X_RESET LORA_RESET


#
define
 SX126X_DIO2_AS_RF_SWITCH
```

这里相当于做个映射，把上面定义的通用名字和 SX1262 芯片的实际脚位对上。最后那行 `SX126X_DIO2_AS_RF_SWITCH` 很关键，它声明 DIO2 要拿来做收发切换。这就是为什么文章里提醒要用杜邦线短接 DIO2 和 TXEN。

```
#
define
 SX126X_DIO3_TCXO_VOLTAGE 1.8 
// reserved for HT-RA62


#
define
 TCXO_OPTIONAL 
// make it so that the firmware can try both TCXO and XTAL
```

最后两行跟晶振有关。如果你的模块带的是温补晶振（TCXO），就需要额外供电，这里写了 1.8V。`TCXO_OPTIONAL` 的作用是保险，让固件能同时兼容 TCXO 和普通晶振（XTAL）。像我们手上的 DX-LR30 是 XTAL，就算不接 TCXO 也能正常跑。

![文中提到的模块的引脚定义](https://meshcn.net/diy-node-without-soldering/lora-module-pinout-compressed.webp)  

*文中提到的模块的引脚定义*

断开计算机与开发板的连接，用杜邦线按 variants 文件中的内容依据下表连接 LoRa 模块和开发板。

| 开发板端引脚 | LoRa 模块端引脚 |
| --- | --- |
| LORA_SCK | SCK |
| LORA_MISO | MISO |
| LORA_MOSI | MOSI |
| LORA_CS | NSS |
| LORA_DIO1（也可能叫IRQ） | DIO1 |
| LORA_BUSY | BUSY |
| LORA_RESET | NRST |
| LORA_RXEN | RXEN |

将 LoRa 模块端引脚连接到 `#define` 后面的数字上的引脚，开发板引脚命名大同小异，主要以下划线后的文字为主。例如按上图 variants 文件配置，应该将开发板上的8号引脚（LORA_CS）连接到模块端的 NSS 引脚。

开发板到 LoRa 模块的连线完成后，使用杜邦线短接 LoRa 模块上的 DIO2 引脚与 TXEN 引脚。

完成杜邦线连接后，检查各引脚连接是否正确，检查完毕后将模块 VCC 引脚连接至开发板 3.3 V 输出引脚，将 GND 引脚连接至开发板空闲的 GND 引脚。注意不要接反。

关于 LORA_RXEN 等额外引脚，请参考文末的 [常见问题与调试技巧](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)。

## 上电测试

将天线拧至模块的天线接口上，确认天线已拧紧后将开发板连接至计算机。

> 切记：先天线，后开机

> 上电前一定要先拧紧天线，再连接电源，否则可能损坏设备。

接下来迅速打开网页上的“open serial monitor”功能（或使用 VSCode 自带的串口监视器），观察串口输出。

![LoRa 正常工作时的串口输出](https://meshcn.net/diy-node-without-soldering/serial-output.webp)  

*LoRa 正常工作时的串口输出*

对于本文中提到的模块，如果串口没有输出“SX1262 init success”，或出现“NOTE! Record critical error 3 at src/main.cpp”，请断开电源并检查连接是否正确、牢固以及杜邦线长度和质量。

完成这些检查后打开手机上的 Meshtastic 应用程序找到“Meshtastic ****”（四位字母/数字）并连接，默认连接密码应该是 123456，同时串口也会显示连接密码。连接后配置 LoRa 区域并尝试在 0 号频道发送消息，如果没有出现“无连接”（“No Interface”），你的 Meshtastic 终端就完成了组装调试，接下来请参考本站教程探索 Meshtastic 并[加入 MeshCN 社区群](https://meshcn.net/contact/)获得更多帮助。

## 使用

你可以简单地使用一个自封袋作为设备的外壳。由于没有电池，户外使用可能需要随身携带一个充电宝为它供电。

![最终效果——正面](https://meshcn.net/diy-node-without-soldering/final-portrait-compressed.webp)  

*最终效果——正面*

![最终效果——侧面](https://meshcn.net/diy-node-without-soldering/final-side-view-compressed.webp)  

*最终效果——侧面*

![我使用了一些强力双面胶将模块粘在开发板上](https://meshcn.net/diy-node-without-soldering/final-compressed.webp)  

*我使用了一些强力双面胶将模块粘在开发板上*

当然，你也可以根据 variants 文件的描述增加显示屏和旋钮开关，如下图所示。

![散装节点，不太可能带出门使用](https://meshcn.net/diy-node-without-soldering/final-with-screen-compressed.webp)  

*散装节点，不太可能带出门使用*

## 在你体验一段时间以后

如果你决定购买/制作一台专用的 Meshtastic 设备，在得到新设备后，你可以：

1. 简单地拆除旧设备上的杜邦线将开发板和 LoRa 模块用于其他项目。

2. 保留旧设备，将其作为家中的 [MQTT 中继节点](https://meshcn.net/how-to-connect-to-messhost-third-party-china-mqtt-server) 或 [作为 bot 提供自动应答服务](https://github.com/hayschan/outdoorMeshBot)。

注意：每台 Meshtastic 设备拥有不同的 Node Hex，你无法继承迁移旧节点的 Node Hex 至新节点。

期待在社区里见到你的身影，mesh on！

## 常见问题与调试技巧

在正文中我们多次提到“请参考文末常见问题”。本章节就是对这些常见坑和调试经验的汇总。

### 1. 上电顺序与天线

供电前一定要先连接天线，再为模块上电。务必注意，供电前一定要先连接天线，否则可能会损坏设备。

### 2. 供电能力与“无故重启”

LoRa 模块通常由开发板板载降压芯片输出的 3.3 V 供电，这一般不会造成问题。

但如果发现板载降压芯片的供电能力无法支撑 LoRa 模块运行，可能会出现“无故重启”等症状。一旦出现此类表现，请立即断开电源并排查供电能力（例如换用更稳的 5 V→3.3 V 稳压、独立供电或更低发射功率等）。

### 3. 杜邦线长度/接触问题导致“无连接”

不良或过长的杜邦线会阻碍 MCU 与 LoRa 模块的数据交换，常见表现是发送消息时出现“无连接”（“no interface”）。

遇到此类情况，请先确认杜邦线已稳固插紧或直接更换全新杜邦线。经验建议：长度不超过约 10 cm 的全新杜邦线通常更可靠，而且成本极低（约 2 元），花这点小钱能节省大量调试时间。

### 4. 固件选择引发的循环重启/无法识别 LoRa

本教程在“选择目标设备并刷入固件”这一步，实质上是借用为其他设备构建的固件。由于不同设备的引脚布局差异，有时“用户按钮”相关引脚在你的开发板上被下拉，从而导致循环重启。另外，不同的 LoRa 芯片/晶振与其设置也可能让 Meshtastic 无法正确识别模块。

排错建议：

- 优先尝试带 DIY 标签 的固件（通常包含更多 LoRa 芯片与晶振的支持，兼容性更好）。

- 具备 Arduino 基础的读者，可以考虑自行编译固件以匹配自己的连线与模块配置。

- 通过网页的 “open serial monitor” 功能观察启动日志，快速判断是否陷入循环重启或初始化失败。

### 5. 频段与晶振：XTAL vs TCXO 的选择

本文所用模块基于 SX1262，且为普通晶振（XTAL）。因此在 variants 中需要声明使用该类型模块。鉴于中国 LoRa 工作频段在 470–510 MHz，普通晶振带来的频漂通常影响不大（本文所述模块在该频段表现正常，包括长报文）。

如果需要在欧美频率（868/915 MHz）下使用，建议选择带 TCXO（温补晶振）的模块，以获得更好的频率稳定度；这类场景不建议直接套用本教程的 XTAL 做法。

### 6. LORA_RXEN 引脚要不要接？

若 variants/接线表中存在 `LORA_RXEN`（或相近命名）引脚，实际搭建时可以不连接该引脚；若 variants 中没有该引脚定义，则完全无需理会它，不必强行接线。
