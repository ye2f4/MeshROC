---
title: "在 Unraid 的 Docker 上部署 PotatoMesh 及相关服务"
date: "2026-02-15"
description: "在 Unraid 上通过 Docker 部署 PotatoMesh Web 与 Python 摄取器的步骤：镜像、网络、环境变量、设备映射与调试。"
tags:
  - "Meshtastic"
  - "Docker"
  - "PotatoMesh"
  - "Unraid"
slug: "deploy-potatomesh-on-unraid-docker"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/deploy-potatomesh-on-unraid-docker/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。谢谢 *群里大佬* 的耐心整理和无私分享。

> 编者注

> 惭愧惭愧，*群里大佬* 去年九月多已经写了这篇文章，但是一直忙于其他时间，没有时间整理发布，现在终于有时间整理发布，希望对大家有所帮助。

PotatoMesh 是一款“开箱可用”的 Meshtastic 可视化面板：打开浏览器就能看到节点列表、地图、邻居关系、消息与遥测，不需要搭建 MQTT，纯 LoRa 数据即可展示。它自带：

- Web 仪表盘：聊天窗口 + 地图视图，显示节点、邻居、消息、遥测与新节点提示。

- API：提供 GET/POST 接口，便于自定义应用或脚本接入。

- Python 摄取器：把本地 Meshtastic 节点（串口/TCP/BLE）采集的数据推送到 Web 端。

- 支持在多台节点间汇聚数据，让社区共享一张“全景网图”。

目前，社区群友主要使用群晖（Synology）、威联通（QNAP）、Unraid 、和飞牛（fnOS）的 NAS 系统。其中，Unraid 是一个按盘位收费的家用 NAS 系统，本文以 Unraid 为例进行讲解。

下方是把 PotatoMesh（Web + Python 摄取器）部署到 Unraid NAS 上的 Docker 的具体步骤。

## 一、部署 PotatoMesh Web

### 下载镜像

在 Unraid NAS 系统的 Docker 标签页中，点击“添加容器”，选择“自定义 URL”，输入 PotatoMesh Web 镜像地址：`ghcr.io/l5yth/potato-mesh-web-linux-amd64:latest`。

### 网络配置

- 默认主机网络：PotatoMesh 默认使用主机网络，无需端口映射。在 Unraid 的“网络类型”中选择 host，确保容器直接共享主机网络栈。

- 桥接网络（可选）：如需桥接，自行映射端口。

### 环境变量（根据需求调整默认值）

在 Unraid 的“环境变量”部分添加：

```
SITE_NAME=Meshtastic Berlin
DEFAULT_CHANNEL=
#MediumFast

DEFAULT_FREQUENCY=868MHz
MAP_CENTER_LAT=52.502889
MAP_CENTER_LON=13.404194 
# 地图中心点经纬度

MAX_NODE_DISTANCE_KM=137
MATRIX_ROOM=
#meshtastic-berlin:matrix.org

API_TOKEN=1eb140fd-cab4-40be-b862-41c607762246  
# 替换为自定义 Token
```

## 二、部署 Python 摄取器

在 Unraid NAS 系统的 Docker 标签页中，点击“添加容器”，选择“自定义 URL”，输入 PotatoMesh ingestor 镜像地址：`ghcr.io/l5yth/potato-mesh-ingestor-linux-amd64:latest`。

### 环境变量与配置

在 Unraid 的“环境变量”中添加：

```
POTATOMESH_INSTANCE=http://<Unraid_IP>:41447  
# 替换为 Unraid 主机 IP

API_TOKEN=1eb140fd-cab4-40be-b862-41c607762246 
# 与 PotatoMesh Web 中设置的相同

MESH_SERIAL=/dev/ttyACM0  
# 或远程设备 IP（如 192.168.1.20:4403）

DEBUG=1
```

### 设备映射（串口场景）

若通过串口连接 Meshtastic 节点，在 Unraid 的“设备映射”中添加：

- 主机设备：`/dev/ttyACM0`

- 容器设备：`/dev/ttyACM0`

## 三、验证与调试

- 检查服务状态：访问 `http://&lt;IP>:41447`，确认 Web 应用界面加载正常。

- 查看容器日志：在 Unraid 的“日志”标签页检查是否有错误（如端口冲突、依赖缺失）。

- Python 摄取器调试：若数据未上传，检查 `mesh.sh` 的日志输出，确认串口或 TCP 连接正常。
