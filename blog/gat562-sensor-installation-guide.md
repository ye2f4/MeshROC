---
title: "给 GAT562 加点料：一文掌握 I2C 温湿度传感器安装"
date: "2025-07-17"
description: "想给 GAT562 加装温湿度传感器，却苦于没有一步到位的中文教程？本篇文章来自社区作者 深圳南山-jinsu，详尽介绍了从选购 BME280、SHTC3 等传感器，到小心翼翼的焊接技巧，再到后盖打孔和软件配置的完整流程。不仅手把手教你物理安装，还贴心提醒再水化修复误焊传感器的妙招。搭配丰富的实拍图，读完这篇，你也能轻松为 GAT562 解锁环境遥测功能。"
tags:
  - "GAT562"
slug: "gat562-sensor-installation-guide"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/gat562-sensor-installation-guide/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。谢谢 *群里大佬* 的耐心整理和无私分享。

想给 GAT562 加装温湿度传感器，却苦于没有一步到位的中文教程？本篇文章由 *群里大佬* 详尽介绍了从选购 BME280、SHTC3 等 I2C 传感器，到小心翼翼的焊接技巧，再到后盖打孔和软件配置的完整流程。

如果你对 GAT562 的更多玩法感兴趣，比如固件升级、硬件改装，或者配套的太阳能解决方案，欢迎参考以下相关文章：

- [《如何为 GAT562 烧录或更新 Meshtastic 固件》](https://meshcn.net/GAT-IOT-handheld-flash-meshtastic-firmware/)

- [《GAT562 增加波轮开关完整改装指南（适用于预设消息快捷发送）》](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/)

- [《太阳能 Meshtastic 节点再进化：这个太阳能盒子亲测能让组装更轻松》](https://meshcn.net/easy-meshtastic-solar-node-build-keepteen-d5-review/)

> 什么是 I2C 以及 Meshtastic 支持的 I2C 传感器

> I2C（Inter-Integrated Circuit） 是一种非常常见的串行通信协议，由飞利浦在上世纪八十年代发明，广泛用于在微控制器与各种传感器之间通信。它的特点是：只需两根信号线（SDA 数据线和 SCL 时钟线），就可以同时连接多个传感器或外设，且不占用太多引脚资源。每个 I2C 设备都有自己的唯一地址，通过地址区分通信对象，理论上可以挂载多达 128 个设备。

> 在 Meshtastic 生态中，I2C 的应用非常重要。通过 I2C 接口，你可以给设备（比如 GAT562）外挂各种类型的传感器，扩展更多的环境感知与遥测功能。Meshtastic 固件已经内置了大量 I2C 传感器的支持，类型覆盖：

> - 环境监测类（温度、湿度、气压）

> - 光照与紫外线检测

> - 空气质量与颗粒物（PM1.0 / 2.5 / 10）

> - 功率与电压电流监测

> - 健康与生理指标（心率、血氧、体温、非接触体温）

> - 其他传感器：微波雷达，接近感应；24位 ADC，常用于称重；辐射检测；风速、风向、气压等；雨量

> 通过 I2C，这些传感器可以同时接入同一个 Meshtastic 设备，只需占用两根线，极大简化了接线与安装工作。固件会自动扫描和识别连接的传感器，用户只需在 Meshtastic App 里开启相应功能，即可实时在设备和网络上获取环境、健康等多项数据。

> 如果你希望为 GAT562 增加温湿度、气压或空气质量的遥测功能，只需选择合适的 I2C 传感器，焊接连接，再在软件上激活即可，非常方便。

*群里大佬* 不仅手把手教你物理安装，还贴心提醒再水化修复误焊传感器的妙招。搭配丰富的实拍图，读完这篇，你也能轻松为 GAT562 解锁环境遥测功能。

## 安装教程

### 1. 传感器选择

| 传感器 | 测量种类 | 价格 | 特点 |
| --- | --- | --- | --- |
| bme280 | 气压、温度、湿度 | 10-11元 | 稍贵 |
| bmp280 | 气压、温度 | 1-2元 | 无湿度 |
| bme680 | VOC、温度、湿度、气压 | 30元 | 死贵，但有 VOC，按需购买 |
| ath20 + bmp280 | 气压、温度、湿度 | 2-3元 | 功耗稍高（两个传感器组合） |
| SHTC3 | 温度、湿度 | 7元 | 无气压 |

价格仅供参考，请以实际购买价格为准。

温湿度传感器在焊接过程中容易因高温损坏，比如 bme280，建议焊接温度控制在 300 度、3 秒以内。

如果焊接后湿度数值不准确，可以通过**再水化**处理：放在温度 25 度、湿度大于 40% 的环境中 5 天以上。

> 什么是再水化？

> 再水化（Rehydration）是一种针对湿度传感器的修复手段，尤其是 BME280、SHTC3 这类电容式湿敏传感器。当传感器经历高温焊接后，内部的湿敏材料会失去水分，导致湿度读数失准甚至失效。此时可以通过再水化来“唤醒”传感器。

> 具体做法是：将传感器放置在25°C 左右、相对湿度 40% 以上的环境中静置至少 5 天。在此过程中，传感器内部的湿敏层逐渐重新吸收水分，恢复其对湿度变化的感知能力。

> 但需注意，再水化并不能修复已经被高温永久损坏的传感器。如果温度读数也异常，那通常是彻底焊坏了，建议直接更换。

如果温度数值仍不准确，基本可以判断传感器已损坏，需要更换。

建议对焊接不自信的朋友多买几个备用（我就焊坏了三个 bme280…）。

### 2. 焊接

![GAT562 正面图](https://meshcn.net/gat562-sensor-installation-guide/gat562-front-view.webp)  

*gat562 正面图*

传感器通过 I2C 连接到设备。打开后盖的四颗螺丝，可以看到用于连接屏幕的四个焊点，屏幕是通过 I2C 连接的。

由于 I2C 接口可以并联最多 128 个设备，因此直接将传感器焊接到屏幕的焊点即可。

![GAT562 背面焊点示意图](https://meshcn.net/gat562-sensor-installation-guide/gat562-back-solder-points.webp)  

*gat562 背面焊点示意图*

将传感器的焊点与 gat562 对应焊点用导线连接，并将其固定在 gat562 电路板上。  

（用不留残胶的胶带将传感器探头贴住，防止助焊剂烟雾损伤探头。）

如下图所示：

![GAT562 传感器焊接示意图](https://meshcn.net/gat562-sensor-installation-guide/gat562-sensor-soldering-example.webp)

部分传感器如 ath20 + bmp280 高度较高，可以在焊点处剪断，以降低整体高度。

![GAT562 高传感器处理](https://meshcn.net/gat562-sensor-installation-guide/gat562-tall-sensor-handling.webp)

### 3. 打洞

在后盖上方打孔，方便空气流通。

> 安装注意事项

> - 建议尽量多打几个孔，否则外部环境变化时，传感器反应会延迟。

> - 可以在孔上贴防水透气膜。

> - **警告！打孔时小心，不要误伤电池！**

![GAT562 后盖打孔](https://meshcn.net/gat562-sensor-installation-guide/gat562-back-cover-drilling.webp)

### 4. 测试（以安卓为例）

手机 App 连接设备后，点击齿轮图标，滑动到**模块设定**，找到**遥测选项**，  

开启**环境计量模块**，同时开启**屏幕显示环境指标**。

![Meshtastic 安卓端遥测设置](https://meshcn.net/gat562-sensor-installation-guide/meshtastic-android-telemetry-settings.webp)

![Meshtastic 遥测效果](https://meshcn.net/gat562-sensor-installation-guide/meshtastic-telemetry-effect.webp)

*效果图*

如果你对 GAT562 的硬件改装感兴趣，除了安装传感器，还可以为它加装波轮开关，配合预设消息快捷发送，操作体验秒变“对讲机”。   [点击查看 GAT562 增加波轮开关完整改装指南](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/)

## 附录

Meshtastic 官方支持的传感器名单：  

[https://meshtastic.org/docs/configuration/module/telemetry/](https://meshtastic.org/docs/configuration/module/telemetry/)
