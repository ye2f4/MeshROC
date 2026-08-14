---
title: "坑人的 Ubuntu：我的 MeshSense 折腾记"
date: "2026-06-01"
description: "在 Windows 10 + WSL2 Ubuntu 24.04 上部署 MeshSense，本以为 Docker Compose 一把梭，结果 systemd、systemctl、Docker daemon 和 iptables 连环拦路。社区读者 YE2F4 记录了一次从崩溃到成功的 MeshSense 折腾记。"
tags:
  - "Docker"
  - "MeshSense"
  - "Ubuntu"
  - "WSL2"
slug: "meshsense-ubuntu-wsl-docker-deployment-troubleshooting"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/

> 投稿来自 MeshCN 社区读者 *群里大佬*。谢谢作者把这次 Ubuntu / WSL2 / Docker 的完整踩坑过程整理出来。MeshCN 在尽量保留原文语气的基础上，仅做了标题层级、代码块、图片说明和少量技术注释整理。

![Ubuntu 与 Linux](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/ubuntu-linux-cover.webp)

## 写在前面

在《[5 分钟让 MeshSense 跑起来：Docker Compose 一键部署全攻略](https://meshcn.net/deploy-meshsense-with-docker/)》里，我们写过：

> 把 MeshSense 常驻在一台服务器上，随时用浏览器查看 Meshtastic 网络拓扑、收发与信号质量，听起来是个很简单的事情。但现实里，端口占用、镜像架构不匹配、`ACCESS_KEY` 放哪儿、数据目录怎么弄，这些细节很容易把一次简单部署拖成一整晚的折腾。

> 你不需要先成为 Docker 专家，也不必为环境差异焦虑——跟着 *群里大佬* 写的步骤完成安装、启动，最终在 `http://&lt;主机IP>:5920` 登录即可。

![MeshSense 首次运行后的网页界面](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/meshsense-dashboard-first-run.webp)

如果你也认为这样做是一件轻松的事情，那么不妨来看看我与 Ubuntu 斗智斗勇的——欢（技）乐（术）故（事）事（故）。

## 前言

本文作为一篇教程，详细记录了我在部署 MeshSense 时踩过的各种坑，旨在帮助更多用户简单、便捷、一遍成功地完成部署。

![Ubuntu 安装过程中的提示界面](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/ubuntu-what-is-upcoming.webp)

## 一、系统配置

| 项目 | 配置 |
| --- | --- |
| CPU | i5-10210U |
| 运行内存 | 8GB LPDDR4 |
| 存储 | 1TB SSD + 9TB HDD |
| 操作系统 | Windows 10 22H2 |
| Linux 环境 | WSL2 - Ubuntu 24.04（已更换清华源） |

## 二、暴风雨前的宁静

准备好后，二话不说直接开整。（请看 VCR）

### 1.1 安装 Docker 和 Docker Compose

Linux（Ubuntu/Debian）：

```
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl 
enable
 --now docker
```

![执行 systemctl enable --now docker 后出现 systemd 错误](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/systemctl-enable-docker-systemd-error.webp)

翻译：系统未使用 systemd 作为初始化系统（PID 1）启动。无法操作。

连接总线失败：主机已关闭。

简单地说，就是——我的上司不是这个人！

噔、噔、咚！什么情况？堂堂一个大 Ubuntu 竟然没有 systemd？可笑！看我来搞定！

> 编者注：WSL2 里的 systemd

> 这类报错通常不是 Ubuntu 没装 systemd，而是当前环境没有把 systemd 作为 PID 1 启动。Windows + WSL2 用户如果想省心运行 Docker，通常有三条路线：使用 Docker Desktop 的 WSL 集成、启用 WSL 的 systemd 支持，或者像本文后面这样改用 `service docker start` 启动 Docker 服务。

> 本文保留作者的完整踩坑过程，方便遇到同类报错的读者对照排查。

## 三、与 systemctl 的抗衡

### Round One：安……安上了？

气得我立马 `apt`：

```
apt install systemd -y
```

![安装 systemd 时提示已经安装](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/apt-install-systemd-already-installed.webp)

什么？已经有了？

一定是我打开方式不正确。

```
apt install systemctl -y
```

嘿，您猜怎么着？

![安装 systemctl 时提示缺少依赖](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/apt-install-systemctl-missing-dependencies.webp)

少依赖！

```
apt install systemd-sysv -y
```

本以为这次可以万事大吉了，结果……

![安装 systemd-sysv 后的终端输出](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/apt-install-systemd-sysv-installed.webp)

安……安上了？

### Round Two：铁拳出击！

三次受挫，气得我直接上狠活——`aptitude`。

`aptitude` 是一个用于管理 Debian GNU/Linux 系统及其衍生版的 APT 包管理工具。它提供了命令行和全屏文本界面两种操作模式，主要功能包括软件包安装、升级和卸载，并能自动处理依赖关系。

```
aptitude install systemctl -y
```

（Tips：记住红圈里的那个，一会儿会考。）

![使用 aptitude 安装 systemctl](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/aptitude-install-systemctl.webp)

Emm……这次看起来好多了！

再来！

```
systemctl 
enable
 --now docker
```

不是，哥们，你……

![再次执行 systemctl enable --now docker 后仍然失败](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/systemctl-enable-docker-still-fails.webp)

算了，跳过！

## 四、焊死的窗户

> 上帝为你关上一扇门的同时，会为你打开一扇窗。

> ——《The Bible》

### 1.2 验证安装

```
docker --version
docker-compose --version
```

![验证 Docker 和 Docker Compose 版本](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/docker-version-compose-version.webp)

成果喜人！

### 2.1 新建项目目录

```
mkdir meshsense-project

cd
 meshsense-project
```

### 2.2 编写 `docker-compose.yml`

使用以下内容创建文件，复制到项目目录：

![MeshSense 的 docker-compose.yml 配置内容](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/docker-compose-yml.webp)

高端的代码，往往只需要简单的编辑工具。

### 3. 配置修改（可选）

由于只是临时测试，所以很多部分没有修改。自己掂量着来。

### 4.1 启动容器

```
docker-compose up -d
```

`-d` 表示后台运行。

> 上帝为你关上一扇门的同时，会为你焊死那扇为你打开的窗。

> ——《The Bubble》

```
docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))
```

翻译：获取服务器 API 版本时出错：连接中止，没有此类文件或目录。

上网查找才知道，这是因为 Docker 没有启动。

但是，网上给出的启动方法是：

```
systemctl start docker
```

可是别忘了，与 `systemctl` 的战争还未结束！

## 五、再一次出发

既然显示已安装，那就卸载重装大法！

```
apt remove systemctl
```

![apt remove systemctl 时提示未安装](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/apt-remove-systemctl-not-installed.webp)

好好好，现在又说我未安装？我倒要看看你是不是在跟我躲猫猫。

```
systemctl --version
```

![systemctl version 显示 systemd 已存在](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/systemctl-version-systemd-present.webp)

很明显，`systemctl` 命令可以使用，而且也正确安装了 systemd，只不过它没有运行罢了。

无妨，启动一下即可。

## 六、systemctl，启动！

先看看掌管你系统的上司是谁：

```
ps -p 1 -o comm=
```

![PID 1 显示为 init](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/pid-one-init.webp)

是 `init`。

都 6025 年了，这种原始的启动方式怎么还会出现在 24.04 上？

更新一下配置看看？

```
sudo update-initramfs -u
```

事实证明，然并卵。

但是，更新完以后还是有一些变化。

还记得那扇焊死的窗吗？它变成了：

```
docker.errors.DockerException: error while fetching server API version: ('connection aborted.', connectionrefusederror(111, 'connection refused'))
```

翻译：获取服务器 API 版本时出错：连接中止，连接被拒绝。

这就像是窗户上泼了 502，再加几把挂锁。

![作者配图：崩溃现场](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/frustration-meme.webp)

气得我呀：

```
apt remove systemctl
apt remove systemd
apt remove systemd-sysv
aptitude remove systemctl
aptitude remove systemd
aptitude remove systemd-sysv
```

嘿，您再猜猜怎么着？

![卸载 systemd-sysv 时的终端输出](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/apt-remove-systemd-sysv.webp)

正事不干，安一堆 NTP，真是服了。

![作者配图：累了](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/tired-meme.webp)

## 七、退一步海阔天空

为什么不能就着它的意愿来呢？

既然上司是 `init`，那么为什么不用属于它的命令呢？

`systemctl` 有自己的命令，`init` 也有！

```
service
```

再次尝试启动 Docker：

```
service start docker
```

![service start docker 命令格式错误](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/service-start-docker-error.webp)

吔！淦！怎么回事？

（此处省略 35 次重复操作……）

后来查资料得知，正确的命令格式是：

```
service docker start
```

输入，然后：

Enter！

## 八、上帝啊，以后用劲小一点！

![service docker start 成功启动 Docker](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/service-docker-start-success.webp)

哈哈！成啦！

（此时的天堂）

![作者配图：此时的天堂](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/heaven-meme.webp)

（你猜他为啥看你？）

因为你高兴得太早了！

![Docker iptables 报错](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/docker-iptables-error.webp)

> 你努力地挖坑，想从地下逃离困住你的地方。

> 上帝用大石头重重地把你刚挖好的坑堵上了。

> ——《The Bundle》

但是，他没有注意到，这一下把门锁震掉了。

经过不懈的摸索和努力，终于找到了解决办法：

```
touch /etc/fstab
update-alternatives --
set
 iptables /usr/sbin/iptables-legacy
update-alternatives --
set
 ip6tables /usr/sbin/ip6tables-legacy
```

执行，再试一次。

![切换 iptables legacy 后再次尝试](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/iptables-legacy-fix.webp)

What can I say？

![作者配图：What can I say](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/what-can-i-say-meme.webp)

## 九、胜利，就在眼前

（踹门，踹门，踹门！）

### 4.1 启动容器

```
docker-compose up -d
```

`-d` 表示后台运行。

![docker-compose up -d 成功启动 MeshSense 容器](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/docker-compose-up-success.webp)

别看这幅图简单，这可是靠运气和耐心的。建议准备科学与魔法。

最后，见证时刻的奇迹！

```
docker-compose ps
docker logs meshsense
```

（门开了！）

![查看 MeshSense 容器状态和日志](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/docker-compose-ps-logs.webp)

我滴任务，完~成~辣~！Hiahiahia……

## 写在最后

在《[折腾太阳能节点的奇妙旅程](https://meshcn.net/meshtastic-solar-node-case-wrong-18650-21700-battery/)》里，我们曾经写过：

> 相信对他来说，DIY 虽然累，但能看着自己的设备稳稳运行，那种成就感是无可替代的。他的故事是 Meshtastic DIY 的一个缩影，它告诉我们：DIY 不仅仅是动手实践，更是一场充满未知的冒险。虽然可能会遇到各种问题，但只要坚持下去，总能找到解决的办法。

虽然经历了很多挫折，情绪几近崩溃，完成时也已经很晚了，但是看着屏幕上跳动的数据，我还是感到无比欣慰。

有志者事竟成，破釜沉舟，百二秦关终属楚。

苦心人天不负，卧薪尝胆，三千越甲可吞吴。

码海沉浮志未销，孤灯夜战，三千日夜终破局。

系统鏖兵心犹烈，百策苦研，九九难关自通途。

希望社区的广大网友也能不畏艰难，一往无前，迎风而上，勇攀高峰！

![MeshSense 最终运行界面](https://meshcn.net/meshsense-ubuntu-wsl-docker-deployment-troubleshooting/meshsense-final-dashboard.webp)

Ps：终于看见 1RHJ 了！

吐槽：OpenStreetMap 为什么总是加载不出来呢……
