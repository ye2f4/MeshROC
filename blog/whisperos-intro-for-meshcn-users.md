---
title: "从「能打字」到「好打字」：WhisperOS 把 MeshCore 手持设备的输入体验往前推了一步"
date: "2026-02-21"
description: "如果你最近在群里频繁看到 WhisperOS，又还没完整梳理过它到底能做什么，这篇文章会给你一份清晰的功能导览：它和 MeshCore 的关系、免费版边界、Premium 进阶能力、Haikou Web Client 的定位，以及最新版本演进节奏。"
tags:
  - "MeshCore"
  - "WhisperOS"
slug: "whisperos-intro-for-meshcn-users"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/whisperos-intro-for-meshcn-users/

如果你一直在看 MeshCN 近几个月的文章，应该会对 *上海-农药* 这个名字不陌生。2025 年 9 月，我们写过 《[再见乱码，欢迎汉字：Meshtastic 的 CJK 中文字符适配来了](https://meshcn.net/meshtastic-cjk-display-breakthrough)》，当时聊的是 *农药* 大佬把 CJK 显示适配带到设备端；到了 2025 年 11 月，《[用摇杆也能「飞快打字」：MeshCore 新联想输入上手小记](https://meshcn.net/predictive-pinyin-input-experience)》 又把焦点放在联想输入，解决了小屏设备能打字但很痛苦的老问题。

*设备实拍：Seeed Studio Wio Tracker L1 Pro*  

![WhisperOS 中英文预测输入界面对比](https://meshcn.net/whisperos-intro-for-meshcn-users/meshtastic-predictive-input-cn-en-side-by-side.webp)

这两篇内容连起来看，其实已经能看出一个很清晰的方向: *农药* 不是在做单点功能，而是持续把手持设备上的文字输入交互体验一步一步往前推。WhisperOS 则是这条演化线进一步系统化后的结果。

WhisperOS 建立在 MeshCore 通讯底层之上，把日常使用的细节做了针对性改进，尤其是中文和多语言输入、手持设备上的交互效率，以及一些更贴近本地用户习惯的功能细节，尽量把小屏加按键或摇杆这套交互做得更顺手。

*设备实拍：武汉-Wilson 的 [Meshtiny](https://meshtiny.com/)*  

![WhisperOS 设备实拍 Meshtiny 手持小设备](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-device-meshtiny-rf-screen-desktop-standing.webp)

从产品模式看，它目前是免费基础功能加付费进阶功能的路线。在 FAQ 也能看到作者直言 WhisperOS 是一个私有的商业项目，并非开源项目。如果你关心的是没付费能不能用，答案是: 基础固件免费，已经够大多数用户日常使用。

设备支持范围覆盖以下常见手持机型：

- FoBE Quill

- GAT562

- Heltec T114

- Heltec V3/V4

- MeshTiny

- ProMicro

- RAK4631

- Wio Tracker L1

*设备实拍：Seeed Studio Wio Tracker L1 Pro。拍摄：中山-dove*  

![WhisperOS 设备实拍 Wio Tracker L1 Pro 斜侧视角](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-device-wio-tracker-l1-pro-rf-screen-angle-shot.webp)  

![WhisperOS 设备实拍 Wio Tracker L1 Pro 手持近景](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-device-wio-tracker-l1-pro-rf-screen-handheld-closeup.webp)

对已经在玩 Meshtastic 或者 MeshCore 的群友来说，你几乎有八成概率已经拥有其中至少一款设备。

从实际界面看，WhisperOS 在小屏设备上的信息密度和可读性是它的一大特点。下面这几张 UI 截图可以直观看到首页状态、英文预测输入和射频页面的展示方式。

![WhisperOS 射频界面绿色主题](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-ui-radio-screen-green-theme.png)

## Whisper OS Premium: 9.90 美元买到的是什么

仅仅是 2026 年前 30 天，已经有四个新版本推出了。这其中既有免费版的功能增强，也有 Premium 版的新功能。

```
%%{init: {"theme":"neutral","themeVariables":{
  "primaryColor":"#ffffff",
  "primaryTextColor":"#000000",
  "primaryBorderColor":"#000000",
  "lineColor":"#000000",
  "secondaryColor":"#ffffff",
  "tertiaryColor":"#ffffff"
}}}%%
timeline
    title WhisperOS 固件更新日志

    section 1 月 9 日
        v1.2.3 : 全用户开放 虚拟键盘输入
               : 伴侣应用可自定义 快捷回复（最多 15 条） 每条最多 31 字符
               : 新增安静模式 可关闭通知音 和 LED 提醒

    section 1 月 12 日
        v1.2.4 : BLE 设备名限制为 字母 / 数字 / 连字符
               : 预设消息长度提升到 每条最多 63 字符
               : 快捷消息支持 非英文语言
               : 菜单元素加入 细微圆角 界面更清爽

    section 1 月 14 日
        v1.2.5 : 新增摩斯电码输入 含声音反馈 适合按键较少设备
               : 消息界面支持 更大字号 提升可读性
               : 扩展语言支持

    section 2 月 1 日
        v1.3.0.beta : 修复节点名称 在界面重叠
                    : 修复消息数量 在消息页重叠
                    : 升级到最新 MeshCore 库
                    : Heltec v3 / v4 续航提升约 20%
                    : 新增设备支持 PICO C3 M5Stack Cardputer ADV （含实体键盘）
                    : 新增 Zen 模式 关闭屏幕 仅点击唤醒
                    : 频道静音功能（开发中） 可静音指定频道
                    : 优化 T114 的 GPS 功能
                    : 联系人自动淘汰（开发中） 联系人满 350 时 自动删除最旧非收藏
                    : 子菜单导航时 抑制弹窗 减少干扰
                    : 新增 GPS 坐标 匿名化选项
                    : 新增实时 噪声底查看
                    : Radio 与 GPS 页面 布局和视觉优化
```

![WhisperOS 首页消息与 BLE 状态界面](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-ui-home-messages-ble-status.png)  

![WhisperOS 英文预测输入界面](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-ui-predictive-keyboard-english.png)  

![WhisperOS 射频状态界面 CN470 495.2MHz](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-ui-radio-status-cn470-495_2mhz.png)

Whisper OS Premium 价格为 9 块 9 美刀。付费后，会得到以下四种功能:

1. 智能输入套件（英文/中文预测、拼音词组建议、CJK 虚拟键盘、联想补全）

2. 高级省电（典型场景 72+ 小时，含空闲检测与快速唤醒）

3. 摩斯密码输入

4. GPS 隐私控制

这些能力有设备适配差异，比如省电增强重点是本身电老虎的 Heltec V3/V4，输入套件则重点覆盖 Wio Tracker L1、GAT562 变种和 Meshtiny。

如果你主要用基础消息收发、偶尔配置参数，免费版完全够用了；如果你长期依赖设备本身来进行打字，或者要长续航抑或是拼音智能联想的能力，那升级到 Premium 会更合适。

## 如何烧录 WhisperOS

线刷前先做一件事: 备份设备配置。刷入新固件后，配置有概率被重置；如果勾选擦除设备，设备内已有数据会被清空，包含设备身份信息。

官方线刷入口是 [WhisperOS 官网烧录器页面](https://ssaprus.works/flasher)。这个页面同时支持 ESP32 和 nRF52。

> 大陆访问提示

> 根据群友反馈，并和 WhisperOS 作者确认（截至 2026 年 3 月 3 日），官网已在 Cloudflare 侧开启对中国大陆 IP 的访问限制。因此在大陆网络下访问官网、烧录页面或 Premium 固件购买入口时，可能会看到 Cloudflare 的禁止访问提示。

> 如果你需要访问烧录页面或付费高级版固件入口，可以先“走路”到其他地区 IP（例如香港 IP），通常就能正常访问。

### 蓝牙 OTA 无线烧录

相比拿个数据线插入电脑进行线刷，很多群友更喜欢用蓝牙 OTA 进行固件更新。这种方法的好处是整个更新过程都是无线的。

而要使用蓝牙 OTA，最方便的方法是下载 *武汉-Wilson* 专门开发给 Meshtastic、MeshCore、WhisperOS 的蓝牙 OTA 应用 MTools BLE。

MTools BLE 下载方式：

- iOS 用户：`MTools BLE`[App Store 里下载  应用](https://apps.apple.com/us/app/mtools-ble/id1531345398?l=zh-Hans-CN)

- Android 用户：`MTools BLE`[Google Play 里下载  应用](https://play.google.com/store/apps/details?id=com.mtoolstec.mtoolsLite&hl=zh-CN)

![MTools BLE 中的 WhisperOS 固件仓库页面](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-mtools-ble-ota-firmware-repository-screenshot.webp)

蓝牙 OTA 的功能仅限于 nRF52 作为 MCU 的设备，如 [Meshtiny](https://meshtiny.com/)、[GAT562](https://meshcn.net/GAT-IOT-handheld-review)、[Seeed Studio Wio Tracker L1](https://www.seeedstudio.com/Wio-Tracker-L1-Pro-p-6454.html) 等。

如果用的是 ESP32 作为 MCU 的设备，则只能线刷，需要使用 WhisperOS 的官方烧录页面 flasher 进行烧录。

### 线刷（USB 数据线烧录）

开始前，请准备：

1. 稳定的数据线，避免只充电不传输的数据线。

2. 刷机期间不要断开设备，不要让电脑休眠。

3. 确认设备 MCU 类型，是 ESP32 还是 nRF52。

![WhisperOS nRF52 线刷页面 固件选择与 DFU 入口](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-flasher-nrf52-firmware-select-dfu-flash.webp)

#### ESP32 线刷步骤

1. 打开 flasher 页面并选择固件版本。

2. 设备类型选择 ESP32。

3. 首次刷机使用 merged 固件文件，后续升级可不使用 merged。

4. 首次刷机建议勾选 Erase device（清除设备数据），清理旧数据后再写入。

5. 点击 Flash Device（烧录设备），并在浏览器中授权串口访问。

6. 等待烧录完成，中途不要断开线缆。

7. 烧录结束后按设备 RST 按键重启进入新固件。

#### nRF52 线刷步骤

对于 nRF52，首刷和后续升级要分开看。首刷前必须先擦除设备，再刷目标固件。

1. 首次刷机先刷擦除包。

2. 大多数 nRF52 设备刷 `FLASH_ERASE_nrf52_softdevice_v6.zip`。

3. Wio Seeed L1 与 Quill nRF52840 Mesh 刷 `FLASH_ERASE_nrf52_softdevice_v7.zip`。

4. 擦除完成后，再回到固件选择页面选择 WhisperOS 目标版本。

5. 设备类型选择 nRF52，或手动上传对应 `.zip` 固件。

6. 点击 Enter DFU Mode，按提示选择设备。

7. 点击 Flash Device 开始烧录。

8. 等待完成，中途不要断开线缆或关闭页面。

## 结语

如果你已经熟悉 Meshtastic，但又想体验另一种以 MeshCore 为底层、并且对中文输入和小屏交互更友好的系统，WhisperOS 绝对值得一试。

![WhisperOS 射频界面蓝色主题](https://meshcn.net/whisperos-intro-for-meshcn-users/whisperos-ui-radio-screen-blue-theme.png)

我建议你先刷免费版跑一段时间，把各种基础功能都摸透了，再决定是否购入 Premium。

## 参考入口

- 官网: [ssaprus.works](https://ssaprus.works/)

- Haikou Web Client: [ssaprus.works/haikou](https://ssaprus.works/haikou)

- FAQ: [ssaprus.works/faq](https://ssaprus.works/faq)

- Changelogs: [ssaprus.works/changelogs](https://ssaprus.works/changelogs)

- Whisper OS Premium: [ko-fi.com/s/a1a5872133](https://ko-fi.com/s/a1a5872133)

- WhisperOS 官网烧录器页面: [ssaprus.works/flasher](https://ssaprus.works/flasher)

- MTools BLE: [MTools BLE 下载页面](https://ssaprus.works/mtools-ble)
