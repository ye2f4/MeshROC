---
title: "给 Meshtastic 一块「监控大屏」：用 MeshMonitor 把整张网一眼看穿"
date: "2025-11-25"
description: "折腾 Meshtastic 到底在折腾什么？不是那几个节点连没连上，而是你始终看不清这张网「整体在干嘛」。MeshMonitor 做的，就是把这些都摊在一块「监控大屏」上：节点在线/离线、信号强弱、电量高低、消息怎么在网里绕、拓扑结构长什么样，一眼看穿；再配合 Docker 一键部署、树莓派也能轻松跑，这篇文章会带你用几分钟时间，给自己的 Meshtastic 网装上一双真正好用的「眼睛」。"
tags:
  - "Docker"
  - "MeshMonitor"
  - "MeshTastic"
slug: "meshmonitor-docker-tutorial"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshmonitor-docker-tutorial/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。

MeshMonitor 是由 Yeraze 开发的开源项目，专为 MeshTastic 网络设计的一款实时监控与可视化工具。MeshMonitor 通过简洁的 Web 界面，帮助用户直观监控 MeshTastic 网络中的节点状态、消息传递及网络拓扑结构。

如果你已经把 MeshMonitor 跑起来，想继续把它从可视化监控升级到自动化处理，可以接着看我们后续更新的进阶文章《[MeshMonitor 中的自动化功能](https://meshcn.net/meshmonitor-automation-features/)》，把常用自动化能力和配置思路一次讲清楚。

想体验真实运行的模范 mesh 网，可直接访问 [MeshGBA 大湾区可视化终端 meshmonitor.meshcn.net](https://meshmonitor.meshcn.net/)（当前重定向到 [MeshCN 社区微信群友](https://meshcn.net/contact/) *深圳-派派* 大佬的演示站）。这是深圳、广州、中山、东莞等大湾区城市节点组成的纯 LoRa 网络，不依赖 MQTT/互联网，是目前 MeshCN 最完善的 Meshtastic LoRa Mesh 样板。

![MeshCN 大湾区纯 LoRa 示范网：广州/深圳/中山/东莞](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-meshcn-demo-map.webp)

*MeshMonitor 节点拓扑与地图*  

![MeshMonitor 节点拓扑与地图](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-node-map.webp)

*MeshMonitor 频道消息界面*  

![MeshMonitor 频道消息界面](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-channel-chat.webp)

核心功能：

- 实时节点监控：显示在线/离线状态、信号强度、电池电量等关键指标。

- 消息日志查看：记录并展示节点间的通信内容。

- 网络拓扑图：动态展示节点间的连接关系，辅助分析网络覆盖。

- 多设备支持：兼容不同型号的 MeshTastic 硬件设备，同时兼容串口、tcp、蓝牙。

- 跨平台访问：通过浏览器即可访问，支持移动端适配。

- 机器人：自带简易机器人功能。

- 外部提醒：监控网络状态，通过邮件等方式提醒。

- 页面好看(♥∀♥)。

*MeshMonitor 消息视图：多频道历史与搜索过滤*  

![MeshMonitor 消息视图：多频道历史与搜索过滤](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-messages-view.webp)

*MeshMonitor 用户与权限管理：账号、角色与登录信息*  

![MeshMonitor 用户与权限管理：账号、角色与登录信息](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-users-admin.webp)

技术特点：

- 轻量级容器化部署：基于 Docker 构建，支持快速部署与扩展。

- 低资源占用：优化后的后端服务适合在树莓派等嵌入式设备运行。

- 数据持久化：支持临时或永久存储配置，确保监控数据不丢失。

## 安装与配置

MeshMonitor 提供两种部署方式，用户可根据需求选择临时存储或永久存储方案。

### 1. 临时存储方案（基于 Docker 卷）

适用场景：快速测试、短期使用或数据可丢失的环境。

优点是无需手动管理主机路径，数据存储在 Docker 管理的卷中。缺点则是容器删除后数据会丢失。

#### 安装步骤

1. 确保已安装 Docker 和 Docker Compose。

2. 创建 `docker-compose.yml` 文件，内容如下：

```
services:

  
meshmonitor:

    
image:
 
ghcr.io/yeraze/meshmonitor:latest

    
container_name:
 
meshmonitor

    
ports:

      
-
 
"8080:3001"

    
restart:
 
unless-stopped

    
volumes:

      
-
 
meshmonitor-data:/data

    
environment:

      
-
 
MESHTASTIC_NODE_IP=192.168.1.101
  
# 修改为你的 MeshTastic 节点 IP

      
-
 
TZ=Asia/Shanghai

      
-
 
ALLOWED_ORIGINS=http://localhost:8080,http://192.168.1.100:8080
  
# CORS 配置



volumes:

  
meshmonitor-data:
```

1. 启动服务：

```
docker-compose up -d
```

1. 访问 http://localhost:8080 或指定 IP 端口。

### 2. 永久存储方案（指定主机路径）

适用场景：长期运行、需要保留监控数据的环境。优点：数据存储在主机指定路径，即使容器重建也不会丢失。缺点：需手动管理路径权限。

#### 安装步骤

1. 确保主机上存在目标路径（如 `/mnt/user/appdata/meshmonitordata`），并赋予 Docker 用户读写权限。

2. 创建 `docker-compose.yml` 文件，内容如下：

```
services:

  
meshmonitor:

    
image:
 
ghcr.io/yeraze/meshmonitor:latest

    
container_name:
 
meshmonitor

    
ports:

      
-
 
"8080:3001"

    
restart:
 
unless-stopped

    
volumes:

      
-
 
/mnt/user/appdata/meshmonitordata:/data
  
# 修改为你的主机路径

    
environment:

      
-
 
MESHTASTIC_NODE_IP=192.168.1.101

      
-
 
TZ=Asia/Shanghai

      
-
 
ALLOWED_ORIGINS=http://localhost:8080,http://192.168.1.100:8080
```

> 删除原有卷定义（改用直接路径挂载）。

1. 启动服务：

```
docker-compose up -d
```

### 环境变量配置说明

| 变量名 | 说明 |
| --- | --- |
| MESHTASTIC_NODE_IP | MeshTastic 节点的 IP 地址，需根据实际网络修改。 |
| TZ | 时区设置（如 Asia/Shanghai），确保日志时间准确。 |
| ALLOWED_ORIGINS | 允许访问 MeshMonitor 的域名列表（逗号分隔），用于 CORS 安全配置。 |

## 线上示范网

如果你想先看看真实的运行效果，记得访问 https://meshmonitor.meshcn.net/（当前重定向到 MeshCN 社区微信群友 *深圳-派派* 大佬维护的演示站）。

该示范网覆盖广州、深圳、中山、东莞等大湾区节点，纯 LoRa 组网，不依赖 MQTT/互联网，是目前 MeshCN 最完善的 Meshtastic LoRa Mesh 样板。

![MeshCN 大湾区纯 LoRa 示范网：广州/深圳/中山/东莞](https://meshcn.net/meshmonitor-docker-tutorial/meshmonitor-meshcn-demo-map.webp)

## 总结

MeshMonitor 为 MeshTastic 用户提供了一个高效、易用的监控平台，无论是临时测试还是长期部署，都能通过简单的 Docker Compose 配置快速上手。通过可视化界面，用户可以更直观地管理无线通信网络，提升户外活动的安全性与效率。

项目地址：GitHub - [Yeraze/meshmonitor](https://github.com/yeraze/meshmonitor)  

镜像仓库：`ghcr.io/yeraze/meshmonitor`

这篇投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。他是 MeshCN 社区贡献最多的作者之一，也是少数能把复杂设置讲到人人都能懂的高手，让许多新人少走弯路。感谢他一直以来的耐心整理与无私分享——这已经是他第八次为大家带来干货满满的教程了。
