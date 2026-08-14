---
title: "换上你自己的卫星图、街道图：Meshtastic 安卓自定义瓦片源全攻略"
date: "2025-11-08"
description: "想让 Meshtastic 地图更顺眼？这篇手把手教你换上自己的卫星图或街道图，从版本号到 URL 模板全流程讲透，一次搞定不跑偏。"
slug: "meshtastic-android-custom-map-tile-sources-step-by-step-tutorial"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-android-custom-map-tile-sources-step-by-step-tutorial/

> 投稿来自 [MeshCN 社区微信群组](https://meshcn.net/contact) 成员 *群里大佬*。  

> 

> 群里大佬是 MeshCN 社区贡献最多的作者之一，也是少数能把复杂设置讲到人人都能懂的高手，让许多新人少走弯路。感谢他一直以来的耐心整理与无私分享——这已经是他第七次为大家带来干货满满的教程了。

想把 Meshtastic 地图换成更清晰的卫星影像，或是更符合本地使用习惯的街道图？应用内其实支持添加「自定义瓦片源」。下面用一口气读懂的方式，把从版本要求到保存切换的全过程讲清楚，配合全程截图，照做就能成功。

## 开始之前：确认版本与渠道

首先要确保你使用的是 Google Play 版 Meshtastic 版本 v2.7.2 (29319153) 。

目前只有 Google Play 渠道的版本支持自定义图源功能。

如果你的安装来源不是谷歌商店，或版本号对不上 `v2.7.2 (29319153)`，请先更新或更换为兼容版本。

![检查 Meshtastic 安卓应用版本 v2.7.2 (29319153)](https://meshcn.net/meshtastic-android-custom-map-tile-sources-step-by-step-tutorial/step1-check-app-version.webp)

## 打开「管理自定义瓦片源」的入口

进入应用后，先来到地图页面。

底部导航栏中间是地图图标，点它会在页面上方弹出一个包含五个按钮的控制条，依次是朝向、设置、地图、图层（layers）和定位。

这里需要点中间的「地图」，随后会出现一个列表，其中就能看到「管理自定义瓦片源」。进入该项，即可开始添加或管理你的图源。

![进入管理入口的操作动线](https://meshcn.net/meshtastic-android-custom-map-tile-sources-step-by-step-tutorial/steps2-4-open-manage-tiles.webp)

## 新增一个图源

进入「管理自定义瓦片源」后，页面底部会有一个长条的「添加自定义瓦片源」按钮，点一下就能进入创建表单。

这个页面也会罗列你之前添加过的图源。想切换显示哪套地图，只需在这里点选对应的图源即可。

例如（截图中已添加的可选图源）：

- 高德矢量底图不准

- 高德卫星

- arcgis（World_Imagery）

- 谷歌火星

- guge

![添加按钮位置示意](https://meshcn.net/meshtastic-android-custom-map-tile-sources-step-by-step-tutorial/step5-add-custom-source-button.webp)

## 填写名称与 URL 模板

接下来需要给图源起个便于识别的名字，并填写「URL 模板」。名称随意但建议贴合图源特性，例如「ArcGIS 卫星（WGS84）」或「ArcGIS 街道（WGS84）」，以后切换时一眼就能分辨。

关键在于 **URL 必须符合瓦片模板规范**，并且 **目前仅支持 WGS84 坐标系** 的瓦片服务；应用本身不做坐标系转换，如果你填的是 GCJ-02 或其他坐标系，地图可能会错位或空白。

![填写图源信息](https://meshcn.net/meshtastic-android-custom-map-tile-sources-step-by-step-tutorial/step6-enter-tile-source-details.webp)

> 科普小课堂：什么是 WGS84 坐标系？

> 很多中国用户在设置地图图源时，看到「仅支持 WGS84 坐标系」这句话可能会有点懵。简单来说，WGS84 是全球通用的 GPS 坐标系统，它定义了地球的形状、中心点和经纬度计算方式，是 Google Earth、OpenStreetMap 等国际地图所采用的标准。手机 GPS 芯片输出的位置数据，本质上就是 WGS84 坐标。

> 但在中国大陆的网络地图（如高德、腾讯、百度）中，国家规定采用另一套经过加密偏移的坐标体系——GCJ-02（俗称「火星坐标系」），百度地图甚至在 GCJ-02 的基础上又多做了一层偏移，称为 BD-09。因此，当你直接把高德或百度的图源链接填入 Meshtastic 时，地图会出现明显错位。这并不是 Meshtastic 的 bug，而是坐标基准不同造成的。

> 简而言之：

> WGS84 = 国际标准 GPS 坐标；  

> 

> GCJ-02 = 中国大陆专用偏移坐标；  

> 

> BD-09 = 百度进一步偏移的坐标。

如果你希望 Meshtastic 地图显示正确，请务必选择支持 WGS84 坐标系 的瓦片图源，例如 ArcGIS 卫星或街道地图。这样，节点位置才能与 GPS 设备输出的经纬度完全对应，不会出现「漂移」或「跑偏」的问题。

下面给出两组可直接使用的示例（均为 WGS84）：

ArcGIS 卫星影像：

```
https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.webp
```

ArcGIS 街道：

```
https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.webp
```

保存之后回到前面的「地图」列表即可切换到新添加的图源；地图视图会立刻应用你选择的瓦片服务。

## 使用中的几个要点

完成添加后，日常切换就回到「地图」列表里点选即可。

如果发现地图没有加载成功，通常是三类问题：

1.

其一，图源不属于 WGS84 坐标系；

2.

其二，URL 模板未正确包含 `\{z\}/\{x\}/\{y\}` 占位符或路径有误；

3.

其三，网络访问受限导致请求失败。这里就不方便详细展开了。

逐项排查，问题基本都能定位。

## 结语

到这里，你已经学会在 Meshtastic 安卓端添加并切换自定义瓦片图源。

记住两个核心点就不会踩坑：**版本渠道要对**（Google Play 的 v2.7.2（29319153）），以及 **图源坐标系要选 WGS84**。

设置好之后，无论是查看越野地形还是城市微道路网，都能找到更顺手的底图。
