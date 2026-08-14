---
title: "5 分钟让 MeshSense 跑起来：Docker Compose 一键部署全攻略"
date: "2025-09-29"
description: "想用 Docker Compose 5 分钟把 Meshsense 跑起来？这篇手把手教程不给废话，直接奉上一份可复制的 `docker-compose.yml`；照着做，启动后浏览器登录即用。"
tags:
  - "Meshsense"
  - "Docker"
slug: "deploy-meshsense-with-docker"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/deploy-meshsense-with-docker/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。谢谢 *群里大佬* 的耐心整理和无私分享。

把 MeshSense 常驻在一台服务器上，随时用浏览器查看 Meshtastic 网络拓扑、收发与信号质量，听起来是个很简单的事情。

但现实里，端口占用、镜像架构不匹配、`ACCESS_KEY` 放哪儿、数据目录怎么弄，这些细节很容易把一次简单部署拖成一整晚的折腾。

你不需要先成为 Docker 专家，也不必为环境差异焦虑——跟着 *群里大佬* 写的步骤完成安装、启动，最终在 `http://&lt;主机IP>:5920` 登录即可。

> 什么是 Docker？

> 想象一下你开了一家餐厅，厨房每天都要准备食材、调酱料、调火候。可是，每次新来的厨师都要重新摸索，结果味道总是对不上。

> 后来你发现了预制菜——中央厨房提前把菜切好、调料配好、酱汁封装好，送到各地门店。门店只需要加热一下，就能端上桌，而且每次味道都一样。

> Docker 的原理就和预制菜一样。

> 在软件世界里，不同电脑的系统环境、依赖版本都可能不一样，导致“我电脑能跑，你电脑跑不了”。

> Docker 就像是“程序的预制菜工厂”：它把程序和运行所需的环境、依赖、配置统统打包好，做成一个“镜像”。别人只要拿到这个镜像，就能立刻“加热”运行，不用再配环境。

> - Docker 镜像（Image）就像是预制菜的冷冻包；

> - Docker 容器（Container）是把冷冻包加热后端上桌的菜；

> - Docker Compose 则是套餐菜单，一条命令就能上齐主菜、配菜和汤。

> 一句话总结：  

> 

> Docker 就是让程序像预制菜一样，打包好、拿到哪都能马上上桌。

### MeshSense 是什么？

在开始部署前，先快速回顾一下 MeshSense。

MeshSense 是一款开源的 Meshtastic 桌面客户端（Windows / Linux / Mac）。它可监控、映射并图形化展示 Meshtastic 网络的关键信息：节点拓扑、信号报告（SNR/RSSI）、跳数、位置、Traceroute、消息收发等；支持通过蓝牙或 Wi‑Fi 直接连接节点。

除图形界面外，MeshSense 还支持无界面（Headless）模式与远程访问（通过 `ACCESS_KEY` 控制权限），因此非常适合以 Docker 方式常驻在服务器上运行，随时用浏览器查看网络状态并进行操作。

想进一步了解功能与使用场景，可参考我们 MeshCN 过往发布的这两篇文章：

- 《[MeshSense：填补 Meshtastic 桌面端空白的利器](https://meshcn.net/meshtastic-desktop-client-meshsense-introduction/)》

- 《[MeshSense：Meshtastic 桌面端 FAQ](https://meshcn.net/meshtastic-desktop-client-meshsense-faq/)》

![MeshSense 消息界面：Meshtastic 频道选择与消息列表](https://meshcn.net/deploy-meshsense-with-docker/meshtastic-desktop-client-meshsense-messages.webp)

![MeshSense 设置界面：Meshtastic 日志限制、自动 Traceroute、远程访问等选项](https://meshcn.net/deploy-meshsense-with-docker/meshtastic-desktop-client-meshsense-node-settings.webp)

![MeshSense 节点详情：Meshtastic 节点 JSON 信息、位置与硬件](https://meshcn.net/deploy-meshsense-with-docker/meshtastic-desktop-client-meshsense-node-detail.webp)

![MeshSense 信号面板：Meshtastic 节点 SNR 与 RSSI 指标展示](https://meshcn.net/deploy-meshsense-with-docker/meshtastic-desktop-client-meshsense-node-snr-rssi.webp)

### 1. 环境准备

#### 1.1 安装 Docker 和 Docker Compose

**Linux**（Ubuntu/Debian）：

```
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl 
enable
 --now docker
```

**macOS**：通过 Docker Desktop 安装。  

**Windows**：通过 WSL2 + Docker Desktop 安装。

#### 1.2 验证安装

```
docker --version
docker-compose --version
```

### 2. 创建 Docker Compose 文件

#### 2.1 新建项目目录

```
mkdir meshsense-project && 
cd
 meshsense-project
```

#### 2.2 编写 `docker-compose.yml`

使用以下内容创建文件（复制到项目目录）：

```
services:

  
meshsense:

    
image:
 
ghcr.io/roperscrossroads/meshsense-docker-arm64:main

    
container_name:
 
meshsense

    
ports:

      
-
 
"5920:5920"

    
environment:

      
-
 
PORT=5920

      
-
 
HOST=0.0.0.0

      
-
 
ACCESS_KEY=password
  
# 默认值可以自行修改

      
-
 
DISPLAY=:99

    
cap_add:

      
-
 
NET_ADMIN

    
volumes:

      
-
 
meshsense-data:/home/mesh/.meshsense

      
-
 
/run/dbus:/run/dbus:ro
  
# 仅Linux需要

    
restart:
 
unless-stopped

    
user:
 
"1000:1000"

    
labels:

      
project:
 
meshsense

    
# 仅当需要手动指定平台时取消注释（通常不需要）

    
# platform: linux/arm64  # 或 linux/amd64



volumes:

  
meshsense-data:
 
# 定义持久化存储的，如果不清楚直接不管就OK
```

### 3. 配置修改

#### 3.1 修改默认访问密钥

编辑 `docker-compose.yml`，修改 `ACCESS_KEY` 为强密码：

```
environment:

  
-
 
ACCESS_KEY=YourStrongPassword123!
```

#### 3.2 指定平台架构（可选）

如果主机与容器架构不匹配（如 x86 主机运行 arm64 镜像），取消注释以下行：

```
platform:
 
linux/arm64
```

#### 3.3 调整端口映射（可选）

若端口 `5920` 被占用，修改为其他端口（如 `8080:5920`）：

```
ports:

  
-
 
"8080:5920"
```

### 4. 启动服务

#### 4.1 启动容器

```
docker-compose up -d
```

`-d` 表示后台运行。

#### 4.2 验证状态

```
docker-compose ps
docker logs meshsense 
# 查看日志
```

正常输出应显示 `meshsense running on port 5920`。

### 5. 访问服务

#### 5.1 Web 界面

浏览器访问：`http://&lt;主机IP>:5920`  

输入 `ACCESS_KEY` 配置的密码登录。
