---
title: "利用 Meshtastic 的串口功能做二次开发"
date: "2025-07-23"
description: "在很多人还停留在“Meshtastic 就是个开源对讲机”的刻板印象时，实际上，它的串口模块早已悄悄为二次开发铺好了路。无论你想用 ESP32 做个土味私有云，还是拉个 4G DTU 把深山老林的 LoRa 数据灌进企业云平台，串口永远是那扇不张扬却通向一切可能的门。"
slug: "meshtastic-serial-application-guide"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-serial-application-guide/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。谢谢 *群里大佬* 的耐心整理和无私分享。

串口是嵌入式应用十分广泛的接口，朴实无华而博大精深，是“普通话”接口，同样在 Meshtastic 中也不能缺席。

> 编者注：二次开发、4G 与行业应用的可能性

> Meshtastic 的串口模块，不仅是一个基础通信接口，更是为二次开发敞开的重要窗口。通过串口，开发者可以根据自身项目需求，开发属于自己的用途，比如远程监测、报警联动或本地传感器数据上报等。这种能力极大扩展了 Meshtastic 不止是“对讲”或“消息广播”的应用边界。

> 特别是结合 4G 网络透传的场景，串口让 Meshtastic 与 4G DTU 或 4G 路由器直接连接，形成“LoRa Mesh + 蜂窝网络 + 互联网”的数据通路。如此一来，不但实现了异地数据同步，还可让本地的 Mesh 数据被传到云端或远程服务器，支持各种企业物联网平台的对接，如 MQTT、HTTP API 等。

> 如果你是开发者，打算在 Meshtastic 上开发自己的用途，如定制私有云管理、接入企业信息系统，PROTO 模式尤为适合。通过它暴露的 Protobuf 接口，可以全程掌控 Mesh 网络内部的节点信息、消息流与控制指令，真正做到深度集成与自定义开发。

> 当然，连接 4G DTU 时需注意串口的波特率、电平兼容（通常是 TTL 3.3V），以及确认 DTU 是否支持透传（Transparent Mode），而非仅限 Modbus 等工业协议。

## 1. Meshtastic 官网中 Serial Module 的使用

Meshtastic [关于 Serial 串口使用的官方文档](https://meshtastic.org/docs/configuration/module/serial/) 有这样描述：

> 该接口模块用于与你的 Meshtastic 通话和控制它的串口，可以设置成不同模式，应用于不同场景。

有以下模式：

-

**SIMPLE 模式**：需要起一条“serial”频道，其实就是要专门去解码。不去管它。

-

**PROTO 模式**：在此串口启用 Protobuf Client API 接口，下文有 Meshtatic-Arduino 的应用简介。

-

**TEXTMSG 模式**：重点来了。将允许您通过串行端口向 Meshtastic 设备发送字符串，该字符串将作为文本消息广播到无线侧默认频道。反过来，从 Mesh 无线侧收到的任何文本消息都将发送到串行端口，消息格式如下：

```
<Short Name>: <text>
```

-

**其它模式**：都是小众模式，不用去管它。

从以上模式来看，重点关注 **PROTO** 和 **TEXTMSG** 模式。

## 2. 采用 TEXTMSG 模式 与 ESP32 通过串口互发消息

官网也有几个案例，以下是与 MCU 互通的应用。

### 连线方式

MT2 通过串口与 ESP32 连接，RX、TX 交叉连接。如果是独立供电，必须共 GND，十分重要，否则消息发不出去。

![ESP32与Meshtastic串口连接示意图](https://meshcn.net/meshtastic-serial-application-guide/meshtastic-esp32-serial-connection.png)

### 如何配置

MT1 一侧只要与 MT2 可以互通，不用特殊配置。MT2 的 Serial module 配置如下：

-

Serial Enabled 打开

-

配置 RX/TX，当然也不限以下两个例子的引脚

-

波特率选择 9600

-

模式选择：TEXTMSG

-

**GAT562** （RX=P.24、TX=P.10）

![GAT562 配置示意图](https://meshcn.net/meshtastic-serial-application-guide/gat562-serial-config.webp)

- **HELTEC Wireless Stick Lite**

![HELTEC Wireless Stick Lite 配置示意图](https://meshcn.net/meshtastic-serial-application-guide/heltec-wireless-stick-lite-serial-config.webp)

### 使用

可以使用 APP 通过蓝牙连接 MT1，向缺省频道发送消息，在 ESP32 会收到：

```
MT1的短名：XXXXXX
```

反之，从 ESP32 也可以发送消息，在 APP 上收到：

```
MT2的短名：YYYYY
```

MT2 在缺省频道发送消息，ESP32 不能收到，“雌雄一体”就应该收不到。

以下是一个案例——山里的雨量计回传：

![雨量计回传案例1](https://meshcn.net/meshtastic-serial-application-guide/rainfall-sensor-example-1.webp)  

![雨量计回传案例2](https://meshcn.net/meshtastic-serial-application-guide/rainfall-sensor-example-2.webp)

## 3. 其他应用

### 制作 Meshtastic 4G 透传网关

其实很简单，把 ESP32 换成 4G DTU，在 DTU 一侧配置 TCP/MQTT/HTTP 参数，即可实现消息透传。两个模块加上配套电源 160 元左右即可拿下，比厂家价格低很多。

### 打通两段 Mesh

用一个 ESP32 将两个不同频点的 Mesh 使用多串口连接起来，实现不依赖 MQTT 的消息互通。

### 聊天室

在以上图中 MT1 一侧通过串口也连接一个 ESP32，两个 ESP32 同时起小型聊天室，可以甩开 APP 直接在手机浏览器中进行文字聊天也很有趣。

## 4. 存在的问题

### 设备短名缺陷

短名不够人性化，为便于处理，建议使用 JSON 格式消息内容，如：

```
{
  
"deviceId"
:
"1234abcd"
,
  
"status"
:
"OK"

}
```

### 应用消息单一

仅限于通过串口互发的消息。Detection Sensor app、Position app 之类的设备自身产生的消息都不能在串口读取，在这点上，与 MQTT+JSON 模式有很大差距。但日常中消息透传也是最常用的。

### PROTO 模式不尽人意

打开 Meshtastic-Arduino 的库文件看了一下，好像只有两个功能，即讨要节点清单和收发 text 消息。其它消息类同样不支持。
