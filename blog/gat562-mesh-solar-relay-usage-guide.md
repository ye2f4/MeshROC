---
title: "GAT562 Mesh Solar Relay 使用介绍"
date: "2025-08-12"
description: "GAT562 Mesh Solar Relay 太阳能中继器完整使用指南，包括开机配置、APP连接、ADC系数设置、GPS定位设置以及户外安装等详细步骤。适合新手用户快速上手。"
tags:
  - "GAT562"
slug: "gat562-mesh-solar-relay-usage-guide"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/gat562-mesh-solar-relay-usage-guide/

> 本文由群里大佬投稿，感谢他的详细使用说明和图片资料。

感谢选择 GAT562 Mesh Solar Relay 产品！本文将详细介绍该太阳能中继器的完整使用方法，帮助您快速上手并正确部署设备。

GAT562 系列产品有多个型号，包括手持设备和太阳能中继器。如果您对 GAT562 手持设备感兴趣，可以参考我们的 [GAT562 Mesh Trial Tracker 详细评测](https://meshcn.net/GAT-IOT-handheld-review/)，了解这款开箱即用设备的完整体验。

## 开箱检查

收到产品后请检查包装内容，确保配件齐全：

1. 中继终端

2. 支架

3. 地插

4. 扎带

![GAT562 包装内容](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/gat562-package-contents.webp)

## 设备开机

首先需要开启设备：

1. 将终端背面的按钮按下去使终端开机

2. 如不确定开机状态，可将硅胶按键抠出来查看按键是否按下

3. 确认后将硅胶按键重新装回原位

![GAT562 开机按钮位置](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/gat562-power-button.webp)

## APP 连接配置

### 1. 下载与连接

使用手机下载 **Meshtastic** APP（可在应用市场中搜索下载），然后按照以下步骤连接：

1. 打开 Meshtastic APP

2. 搜索蓝牙热点

3. 输入配对密码：**123456**（默认密码）

4. 等待连接成功

|  |  |  |
| --- | --- | --- |
|  |  |  |
| 1. 搜索蓝牙设备 | 2. 输入配对密码 123456 | 3. 成功连接设备 |

![电源配置界面](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/meshtastic-app-power-config.webp)

### 2. 电池 ADC 系数设置

这是一个重要的配置步骤，确保电池电量显示准确：

1. 点击**设备配置**

2. 点击**电源**

3. 输入 **ADC 系数为 1.75**

4. 点击**传送**

5. 终端将自动重启生效

![ADC 系数设置步骤](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/meshtastic-app-adc-settings.webp)

### 3. 设置终端固定位置

为了确保位置信息准确，需要手动设置设备的 GPS 坐标：

1. 点击**设备配置**

2. 点击**定位**

3. 输入需要放置位置的**经纬度与高度**

4. 点击**传送**

5. 终端将自动重启生效

|  |  |
| --- | --- |
|  |  |
| 定位配置界面 | GPS 坐标设置 |

## 户外安装部署

### 安装要求

完成以上设置后，需要将设备安装到户外：

1. 将太阳能板直接卡到终端背面卡槽内

2. 将地插与支架对插固定好

3. **务必安装到户外露天位置**，确保太阳能板能够接收充足阳光

> 重要提醒

> 内置电池容量为 800mAh，仅太阳能供电情况下约能使用 80 小时左右。**必须安装在露天位置**，否则电池将很快耗尽，仅靠太阳能充电很难充满。

### 安装角度建议

![GAT562 户外安装示例](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/gat562-outdoor-installation.webp)

**重要安装要点：**

1. **倾斜角度**：务必将终端倾斜 30-40 度左右安装

2. **排水设计**：倾斜安装可确保下雨时雨水顺着斜度流下

3. **防水加强**：如有条件建议将外壳打胶一圈，提升防水等级

## 维护与固件更新

### 充电与固件更新

如出现电池电量耗尽或需要更新固件，需要拆开外壳进行操作：

#### 接线说明

使用 USB 线焊接到排针孔上进行充电或固件更新：

- **R (红线)**：接 5V

- **W (白线)**：接 DN

- **G (绿线)**：接 DP

- **B (黑线)**：接 GND

- **TP**：RESET（复位测试点）

![GAT562 接线示意图](https://meshcn.net/gat562-mesh-solar-relay-usage-guide/gat562-wiring-diagram.webp)

#### 固件更新步骤

1. 按照上述接线方法连接设备

2. 将数据线连接到电脑

3. 使用镊子一端接 GND，一端接测试点

4. 连续短接两下，电脑将出现盘符

5. 将需要更新的固件复制粘贴到盘符里

6. 等待完成后自动重启生效

如需更新固件，详细步骤请参考：[如何为 GAT562 烧录或更新 Meshtastic 固件](https://meshcn.net/GAT-IOT-handheld-flash-meshtastic-firmware/)。

## 高级功能

GAT562 设备支持多种扩展功能。如果您希望让设备发挥更大作用，可以考虑以下改装：

### 环境遥测功能

如果您希望 GAT562 不仅作为中继器，还能监测安装环境的温湿度等数据，可以为其添加传感器。详细安装方法请参考：[给 GAT562 加点料：一文掌握 I2C 温湿度传感器安装](https://meshcn.net/gat562-sensor-installation-guide/)。

### 快捷消息功能

对于需要频繁发送特定消息的场景，可以为设备增加旋转编码器，实现预设消息的快速选择和发送。具体改装步骤见：[GAT562 增加波轮开关完整改装指南](https://meshcn.net/gat562-rotary-switch-upgrade-for-preset-messages/)。

### 串口二次开发

GAT562 还支持通过串口进行二次开发，可以连接其他传感器或控制设备。相关开发方法可参考：[利用 Meshtastic 的串口功能做二次开发](https://meshcn.net/meshtastic-serial-application-guide/)。

## 相关链接

- [Meshtastic 网页配置](https://client.meshtastic.org/)

- [Meshtastic 固件升级](https://flasher.meshtastic.org/)

## 总结

GAT562 Mesh Solar Relay 是一款优秀的太阳能中继设备，通过正确的配置和安装，能够为您的 Meshtastic 网络提供稳定的中继服务。记住关键要点：

1. 正确设置 ADC 系数和 GPS 位置

2. 必须安装在露天位置确保太阳能充电

3. 倾斜 30-40 度安装以防积水

4. 定期检查设备状态和电池电量

希望本指南能帮助您顺利部署和使用 GAT562 设备！如果您还没有手持设备与中继器配合使用，建议了解一下 [GAT562 Mesh Trial Tracker 详细评测](https://meshcn.net/GAT-IOT-handheld-review/)，这款手持设备与太阳能中继器是很好的搭配组合。
