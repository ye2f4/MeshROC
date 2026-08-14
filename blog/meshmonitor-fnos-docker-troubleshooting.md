---
title: "飞牛 NAS 部署 MeshMonitor 完整踩坑记录：从 .env、国内镜像到 Docker 网络"
date: "2026-07-18"
description: "在飞牛 fnOS 的 Docker 中部署 MeshMonitor 时，可能会遇到 .env 缺失、GHCR 拉取缓慢、容器正常但局域网打不开、Host 模式端口与 CORS 不匹配等问题。本文从标准配置开始，完整记录诊断过程和最终可用方案。"
tags:
  - "Meshtastic"
  - "Docker"
  - "MeshMonitor"
  - "fnOS"
slug: "meshmonitor-fnos-docker-troubleshooting"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshmonitor-fnos-docker-troubleshooting/

## TL;DR

如果你只想先把 MeshMonitor 在飞牛 NAS 上跑起来，可以先记住下面几件事：

- Compose 写了 `env_file: .env`，项目目录里就必须真的存在 `.env`；不想单独维护文件，就删掉 `env_file`，直接使用 `environment`。

- 官方镜像是 `ghcr.io/yeraze/meshmonitor:latest`。国内网络拉取很慢时，改成使用南京大学镜像源。

- 正常情况下应该优先使用 Docker Bridge，并映射 `8080:3001`。这也是 MeshMonitor 官方文档推荐的方式。

- 如果容器内访问 `3001` 正常、NAS 本机访问映射端口也正常，但同一局域网里的电脑和手机都超时，问题很可能出在 NAS 的 Docker Bridge 入站转发路径，而不是 MeshMonitor 本身。

- 本文测试的飞牛 fnOS 环境最终通过 `network_mode: host` 绕过了 Bridge 转发问题。

- Host 模式下 `ports` 映射无效，浏览器要访问应用实际监听的端口。本次镜像实际监听 `3001`，所以最终地址是 `http://NAS-IP:3001`。

- `ALLOWED_ORIGINS` 必须与浏览器地址完全一致，包括协议、IP 和端口。

- 首次登录账号通常是 `admin`，密码是 `changeme`，登录后务必立即修改。

在粘贴最终配置之前，先找出两个地址：

1. **Meshtastic 节点的内网 IP**：示例中是 `192.168.0.246`；

2. **飞牛 NAS 的内网 IP**：示例中是 `192.168.0.200`。

**先找 Meshtastic 节点的内网 IP**

首先确认 Meshtastic 节点已经连接到家里的 Wi-Fi。只有节点和飞牛 NAS 处于能够互相访问的局域网中，MeshMonitor 才能通过 TCP `4403` 连接节点。

很多带屏幕的 Meshtastic 节点会直接显示当前 Wi-Fi IP，例如：

```
192.168.0.246
```

如果屏幕没有显示，可以登录路由器后台，打开 `已连接设备`、`DHCP 客户端` 或 `终端列表`，寻找名称类似下面的设备：

```
esp32s3...
meshtastic...
```

不同固件和硬件显示的名称可能不同，也可能只显示 MAC 地址。拿到疑似 IP 后，可以从 NAS 测试节点的 Meshtastic TCP 端口：

```
nc -vz 192.168.0.246 4403
```

如果显示连接成功，这个地址通常就是正确的节点 IP。找到后，将配置中的：

```
-
 
MESHTASTIC_NODE_IP=192.168.0.246
```

改成：

```
-
 
MESHTASTIC_NODE_IP=你的节点IP
```

例如节点实际是 `192.168.1.88`，就写：

```
-
 
MESHTASTIC_NODE_IP=192.168.1.88
```

建议在路由器中给节点设置 DHCP 静态租约或固定地址，避免路由器重启后 IP 改变。MeshMonitor 4.0 之后，这个环境变量主要用于第一次启动时创建初始 Source；如果数据卷中已经有 Source，应进入 `Dashboard → Sources` 修改节点 IP。

**再找飞牛 NAS 的内网 IP**

示例中的 `192.168.0.200` 是飞牛 NAS 自己的局域网 IP，不是 Meshtastic 节点 IP。你现在用浏览器打开飞牛后台时，地址栏中的 IP 通常就是它。例如飞牛后台地址是：

```
http://192.168.1.50:5666
```

那么飞牛 NAS 的内网 IP 就是：

```
192.168.1.50
```

也可以在飞牛的 `设置 → 网络设置` 或路由器的设备列表中查找。建议同样为 NAS 设置固定地址，否则地址变化后书签和 `ALLOWED_ORIGINS` 都要跟着修改。

拿到 NAS IP 后，需要替换 `ALLOWED_ORIGINS` 和浏览器访问地址。端口取决于下面选择的网络模式：

- 默认 Bridge 模式使用 `8080`；

- 遇到本文同类故障而改用 Host 模式时，使用 `3001`。

以 NAS IP `192.168.1.50` 为例，Bridge 模式写成：

```
-
 
ALLOWED_ORIGINS=http://192.168.1.50:8080,http://localhost:8080
```

浏览器访问：

```
http://192.168.1.50:8080
```

如果改用 Host 模式，则写成：

```
-
 
ALLOWED_ORIGINS=http://192.168.1.50:3001,http://localhost:3001
```

浏览器访问：

```
http://192.168.1.50:3001
```

`localhost` 可以原样保留，不要把它改成 Meshtastic 节点 IP。

**先用默认 Bridge 配置，遇到同类故障再改 Host**

假设你的实际网络信息是：

- 飞牛 NAS：`192.168.1.50`

- Meshtastic 节点：`192.168.1.88`

请先使用下面的默认 Bridge 配置。绝大多数用户用这一份就能正常运行：

```
services:

  
meshmonitor:

    
image:
 
ghcr.nju.edu.cn/yeraze/meshmonitor:latest

    
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
 
TZ=Asia/Shanghai

      
-
 
MESHTASTIC_NODE_IP=192.168.1.88

      
-
 
ALLOWED_ORIGINS=http://192.168.1.50:8080,http://localhost:8080



volumes:

  
meshmonitor-data:

    
driver:
 
local
```

部署完成后访问：

```
http://192.168.1.50:8080
```

如果这份配置能够打开页面，就保持 Bridge 模式，不需要继续修改网络设置。

只有遇到和本文相同的情况，才改用下面的 Host 配置：容器内 `3001` 正常、NAS 本机访问正常，但同一局域网里的电脑和手机访问 `8080` 都超时。

```
services:

  
meshmonitor:

    
image:
 
ghcr.nju.edu.cn/yeraze/meshmonitor:latest

    
container_name:
 
meshmonitor

    
network_mode:
 
host

    
restart:
 
unless-stopped

    
volumes:

      
-
 
meshmonitor-data:/data

    
environment:

      
-
 
TZ=Asia/Shanghai

      
-
 
MESHTASTIC_NODE_IP=192.168.1.88

      
-
 
ALLOWED_ORIGINS=http://192.168.1.50:3001,http://localhost:3001



volumes:

  
meshmonitor-data:

    
driver:
 
local
```

Host 模式部署完成后访问：

```
http://192.168.1.50:3001
```

两份配置不能混用：

- Bridge 模式保留 `ports`，访问端口和 `ALLOWED_ORIGINS` 都使用 `8080`；

- Host 模式删除整个 `ports`，加入 `network_mode: host`，访问端口和 `ALLOWED_ORIGINS` 都使用 `3001`；

- `MESHTASTIC_NODE_IP=` 后面始终填写 Meshtastic 节点 IP；

- `ALLOWED_ORIGINS` 和浏览器地址始终填写飞牛 NAS IP；

- `localhost`、容器名称和数据卷名称可以原样保留。

本文实际使用的飞牛 NAS IP 是 `192.168.0.200`，Meshtastic 节点 IP 是 `192.168.0.246`。最终因为 Bridge 转发异常改成了 Host 模式，所以访问地址是 `http://192.168.0.200:3001`。

上面的南京大学镜像地址 `ghcr.nju.edu.cn/yeraze/meshmonitor:latest` 是第三方代理示例，并非 MeshMonitor 官方镜像仓库，强烈建议国内读者使用，默认的 GitHub 源对国内网络不友好，下载非常慢。如果你的网络可以正常访问 GHCR，再考虑换回 `ghcr.io/yeraze/meshmonitor:latest`。

## 部署环境与准备

这次排障使用的环境如下：

- NAS：飞牛 fnOS，排障时版本为 `1.2.0203`

- NAS 局域网 IP：`192.168.0.200`

- Meshtastic 节点 IP：`192.168.0.246`

- Meshtastic TCP 端口：`4403`

- MeshMonitor：Docker Compose 部署

- 目标：让局域网中的电脑和手机都能打开 MeshMonitor

IP 地址只是示例。你的 NAS 可能是 `192.168.1.10`，节点可能是 `192.168.1.20`，替换时不要照抄。

**处理 `.env` 文件不存在的报错**

最开始遇到的报错是：

```
env file /vol1/1000/Docker/meshmonitor/.env not found:
stat /vol1/1000/Docker/meshmonitor/.env: no such file or directory
```

原因很直接：Compose 中写了下面这一行：

```
env_file:
 
.env
```

这会要求 Docker Compose 到 Compose 文件所在目录读取 `.env`，但对应目录里并没有这个文件，所以 Compose 在创建容器前就会停止。

有两种正确处理方式。

**方案 A：不用单独的 `.env`（我的做法）**

删除：

```
env_file:
 
.env
```

把配置直接写在：

```
environment:

  
-
 
TZ=Asia/Shanghai

  
-
 
MESHTASTIC_NODE_IP=192.168.0.246
```

这种方式对刚接触飞牛 Docker 的用户更直观，所有配置都在同一个页面里。

**方案 B：真的创建 `.env`**

如果你使用 MeshMonitor 官方的 Compose 配置生成器，或者希望把变量单独存放，就在报错指向的项目目录中创建 `.env`：

```
TZ=Asia/Shanghai
MESHTASTIC_NODE_IP=192.168.0.246
ALLOWED_ORIGINS=http://192.168.0.200:8080
```

然后在 Compose 中保留：

```
env_file:
 
.env
```

不要只在 Compose 编辑器里写 `env_file: .env`，却忘了在文件管理器中创建文件。

**解决 GHCR 在国内拉取很慢的问题**

MeshMonitor 官方镜像地址是：

```
image:
 
ghcr.io/yeraze/meshmonitor:latest
```

国内网络访问 GitHub Container Registry 时，可能出现速度很慢、长时间卡住或超时。本文测试时改用南京大学的 GHCR 代理后，镜像很快就拉取完成：

```
image:
 
ghcr.nju.edu.cn/yeraze/meshmonitor:latest
```

## 先从标准 Bridge 配置开始

不是每台飞牛 NAS 都会遇到本文后面的网络问题。正常情况下，应该先使用前面给出的 Bridge YAML，这也是 MeshMonitor 官方推荐的方案。

这里的含义是：

- MeshMonitor 在容器内部监听 `3001`；

- Docker 将 NAS 的 `8080` 转发到容器的 `3001`；

- 浏览器访问 `http://192.168.0.200:8080`；

- 数据保存在 Docker 卷 `meshmonitor-data` 中，重建容器不会自动清空数据。

Docker 官方文档说明，Bridge 容器的端口默认不能直接从宿主机外访问；配置 `8080:3001` 后，Docker 会创建对应的端口发布和防火墙规则。

如果这一配置能直接打开页面，就不需要改成 Host 模式。Bridge 的网络隔离更清晰，也更容易只暴露需要的端口。

## 容器正常但局域网打不开：完整排障

大部分群友和读者经过前面的设置都能直接打开页面。我这次没有那么幸运，最后需要改成 Host 模式才能成功。

这次最费时间的地方，是飞牛界面显示容器正在运行，但浏览器访问：

```
http://192.168.0.200:8080
```

一直超时。

这时候不要反复删除、重装容器。应该把问题拆成四层：

1. 应用进程有没有启动；

2. 容器内部有没有监听端口；

3. Docker 有没有建立端口映射；

4. 局域网流量能不能穿过 NAS 防火墙和 Docker 转发链。

**检查 Docker 端口映射**

```
sudo docker inspect meshmonitor --format 
'{{json .NetworkSettings.Ports}}'
```

正常的 Bridge 输出类似：

```
{
  
"3001/tcp"
: [
    {
"HostIp"
:
"0.0.0.0"
,
"HostPort"
:
"8080"
},
    {
"HostIp"
:
"::"
,
"HostPort"
:
"8080"
}
  ]
}
```

这只能证明 Docker 记录了映射，不能单独证明远端访问已经成功。

**检查容器内部监听端口**

MeshMonitor 镜像中可能没有 `ss`，可以用 `netstat`：

```
sudo docker 
exec
 meshmonitor sh -lc 
'ss -lntp || netstat -lntp'
```

本次看到的关键输出是：

```
tcp  0  0  :::3001  :::*  LISTEN
```

这说明 MeshMonitor Web 服务已经启动，并监听所有地址的 `3001`。

**从容器内部请求应用**

```
sudo docker 
exec
 meshmonitor sh -lc \
  
'wget -S -O /dev/null http://127.0.0.1:3001 2>&1'
```

如果返回 `HTTP/1.1 200 OK`，应用本身是健康的。

**从 NAS 本机请求发布端口**

```
curl -I --max-time 5 http://127.0.0.1:8080
curl -I --max-time 5 http://192.168.0.200:8080
```

本次两条命令都返回了 `200 OK`，说明：

- MeshMonitor 正常；

- 容器内部端口正常；

- Docker 的本机端口发布正常；

- NAS 自己通过局域网 IP 访问也正常。

但同一局域网中的 Mac 和手机仍然超时。这一步非常关键，因为它排除了浏览器缓存、Mac 代理和单一客户端故障。

**检查 Docker NAT 和转发规则**

```
sudo iptables -t nat -S DOCKER | grep -E 
'8080|4404'

sudo iptables -nvL FORWARD --line-numbers
sudo iptables -nvL DOCKER-USER --line-numbers
sudo iptables -nvL DOCKER --line-numbers
```

本次能够看到 `8080` 被 DNAT 到 `172.18.0.2:3001`，`DOCKER` 链也确实有数据包命中 `3001` 的 ACCEPT 规则。

换句话说，请求已经到达 Docker 转发规则，但局域网客户端没有完成连接。即使继续在飞牛防火墙中放行 `8080`、`3001` 和 `4404`，问题仍然存在。

这里需要谨慎描述：我们确认的是这台设备、这个 fnOS 版本上的实际现象，并没有据此断言所有飞牛 NAS 都存在同一个缺陷。由于系统没有预装 `tcpdump`，本次没有继续追到最终丢包位置。

**排除 Mac、代理和 Tailscale 的影响**

排障过程中，Mac 同时运行过代理和 Tailscale，因此很容易先怀疑代理或路由冲突。

我们依次做了以下测试：

- 关闭 Mac 上的 Clash Verge；

- 关闭 Mac 上的 Tailscale；

- 关闭 NAS 上的 Tailscale；

- 强制从 Mac 的局域网地址访问；

- 换同一 Wi-Fi 下的手机访问。

结果电脑和手机都无法访问，而 NAS 本机可以返回 200。因此，这次问题不在某一台客户端，也不应该继续围绕浏览器插件或系统代理打转。

排障时最好遵循这个顺序：先换设备，再关代理，最后才修改 Docker 网络。这样可以避免因为一个偶然现象，把 Compose 改得越来越复杂。

### 最终方案：使用 Host 网络绕过 Bridge 转发

最终使用：

```
network_mode:
 
host
```

Host 模式下，容器共享 NAS 的网络命名空间，不再拥有独立的 Bridge IP，也不再经过 `8080:3001` 这种 NAT 端口映射。

Docker 官方文档明确说明：Host 模式下 `ports`、`-p` 和 `--publish` 都会被忽略。因此 Compose 中必须删除整个 `ports` 部分，并使用前面给出的 Host YAML。不要只加入 `network_mode: host`，却继续沿用 Bridge 配置中的 `ports` 和 `8080`。

飞牛防火墙至少需要允许可信局域网访问 TCP `3001`。保存配置、重新创建容器后，可以检查：

```
sudo docker 
exec
 meshmonitor sh -lc 
'netstat -lntp'
```

本次部署实际看到：

```
tcp  0  0  :::3001  :::*  LISTEN
```

于是正确访问地址是：

```
http://192.168.0.200:3001
```

电脑和手机此时都能正常打开页面。

## Host 模式下的端口与来源配置

**设置了 `PORT=8080`，实际仍监听 `3001`**

MeshMonitor 配置文档把 `PORT` 列为可选环境变量，默认值是 `3001`。但在这次使用的镜像和部署环境中，即使写了：

```
-
 
PORT=8080
```

`netstat` 仍显示服务监听 `3001`，访问 NAS 的 `8080` 会立即返回连接被拒绝。

这里不要凭配置猜端口，要以容器中的实际监听结果为准：

```
sudo docker 
exec
 meshmonitor sh -lc 
'netstat -lntp'
```

为了减少歧义，最终配置删除了无效的 `PORT=8080`，直接使用应用实际监听的 `3001`。

如果你一定要保留 `http://NAS-IP:8080`，可以在飞牛中配置反向代理：

```
192.168.0.200:8080  →  127.0.0.1:3001
```

此时还要把 `http://192.168.0.200:8080` 加入 `ALLOWED_ORIGINS`。如果只是家庭局域网使用，直接访问 `3001` 更简单。

**正确设置 `ALLOWED_ORIGINS`**

MeshMonitor 会检查浏览器请求来源。下面三个来源彼此不同：

```
http://localhost:3001
http://192.168.0.200:3001
http://192.168.0.200:8080
```

协议、主机名或端口只要有一个不同，就属于不同 Origin。

局域网通过 NAS IP 和 `3001` 访问时，应写：

```
-
 
ALLOWED_ORIGINS=http://192.168.0.200:3001,http://localhost:3001
```

不要为了省事长期使用：

```
-
 
ALLOWED_ORIGINS=*
```

通配符适合短时间定位 CORS 问题，不适合长期部署。

如果页面能打开，但登录、接口请求或 WebSocket 异常，也要重新检查这里，而不是只检查端口。

## Host 模式的代价和安全注意事项

Host 模式解决了这次飞牛 Bridge 转发异常，但它不是没有代价。

**网络隔离更弱**

容器直接共享 NAS 网络。容器里所有监听 `0.0.0.0` 或 `::` 的服务，都可能直接出现在 NAS 的端口上。

本次使用 `netstat` 时，除了 MeshMonitor 的 `3001`，还观察到内部 Python/Apprise 服务监听 `8000`。请根据实际功能检查端口，不要只关注 `3001`：

```
sudo docker 
exec
 meshmonitor sh -lc 
'netstat -lntp'
```

防火墙来源 IP 最好限制为可信局域网，而不是无条件允许所有来源。

**端口冲突会直接导致启动失败**

如果 NAS 上已经有其他服务占用 `3001` 或 `8000`，Host 模式下 MeshMonitor 无法再次绑定同一端口。部署前可以检查：

```
sudo netstat -lntp | grep -E 
':3001|:8000'
```

**不要直接暴露到互联网**

家庭局域网部署可以使用 HTTP，但不要直接在路由器上把 `3001` 映射到公网。需要公网访问时，优先使用 VPN，或者按照 MeshMonitor 官方生产部署说明配置 HTTPS 反向代理、强随机 `SESSION_SECRET`、`TRUST_PROXY=true`、`COOKIE_SECURE=true`，并把 `ALLOWED_ORIGINS` 精确设置为 HTTPS 域名。

**立即修改默认密码**

首次启动通常会创建：

```
用户名：admin
密码：changeme
```

页面打开后第一件事不是研究地图，而是修改管理员密码。

## 更新、备份与排障清单

本文配置使用命名卷：

```
volumes:

  
-
 
meshmonitor-data:/data
```

这意味着重建容器时数据仍保留，但删除 Docker 卷会丢失数据库。更新前可以先检查卷并备份数据。

常规更新命令是：

```
docker compose pull
docker compose up -d
```

如果使用国内镜像代理，更新后发现版本没有变化，可能是代理尚未同步。此时切回官方 GHCR 拉取，或者使用明确版本号核对。

更新完成后建议重新检查：

```
sudo docker logs --tail 100 meshmonitor
sudo docker 
exec
 meshmonitor sh -lc 
'netstat -lntp'
```

**一份可以照着走的排障清单**

以后再遇到容器在运行但页面打不开的情况，可以按下面顺序检查：

1. Compose 是否因为 `.env` 不存在或 YAML 缩进错误而根本没有创建容器；

2. `docker ps` 中容器是否持续运行，而不是反复重启；

3. `docker logs --tail 200 meshmonitor` 是否有启动错误；

4. 容器内是否真的监听 `3001`；

5. 容器内请求 `127.0.0.1:3001` 是否返回 200；

6. Bridge 模式下，`docker inspect` 是否存在 `8080:3001` 映射；

7. NAS 本机访问 `127.0.0.1:8080` 是否成功；

8. NAS 本机访问 `NAS-IP:8080` 是否成功；

9. 同一局域网中的另一台电脑和手机是否都失败；

10. 飞牛防火墙是否放行了实际访问端口；

11. Bridge 转发仍异常时，再考虑 Host 模式；

12. Host 模式下删除 `ports`，以 `netstat` 看到的实际端口为准；

13. 把实际浏览器地址完整写入 `ALLOWED_ORIGINS`；

14. 页面打开后，再单独排查 Meshtastic 节点的 `4403` 连接。

这套顺序的重点是：每一步只验证一层。不要在还没确认应用是否监听时就反复修改防火墙，也不要因为浏览器打不开，就立即断定镜像启动失败。

## 结语

这次折腾最容易误导人的地方，是每一层看起来都接近正常：镜像终于下载好了，容器显示正在运行，应用返回 200，Docker 的 DNAT 规则存在，防火墙规则也生效，但局域网设备就是打不开。

真正有用的不是记住某一条神奇命令，而是把路径拆开：

```
浏览器 → NAS 防火墙 → Docker 端口发布 → 容器监听 → MeshMonitor → Meshtastic 节点:4403
```

本文环境最终通过 Host 网络绕开了 Bridge 转发问题，并以应用实际监听的 `3001` 对外提供服务。其他飞牛用户如果 Bridge 配置可以正常工作，继续使用官方推荐方案即可；只有在证据表明容器和 NAS 本机都正常、但所有局域网客户端都失败时，才值得切换 Host 模式。

相关资料：

- [MeshMonitor 官方入门文档](https://meshmonitor.org/getting-started)

- [MeshMonitor 配置说明](https://meshmonitor.org/configuration/index.html)

- [MeshMonitor GitHub 仓库](https://github.com/Yeraze/meshmonitor)

- [Docker 官方：Host network driver](https://docs.docker.com/engine/network/drivers/host/)

- [Docker 官方：Port publishing and mapping](https://docs.docker.com/engine/network/port-publishing/)

- [MeshCN：用 MeshMonitor 把整张网一眼看穿](https://meshcn.net/meshmonitor-docker-tutorial/)
