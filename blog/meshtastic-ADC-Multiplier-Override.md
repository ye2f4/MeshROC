---
title: "破解 🔌 充电假象！Meshtastic 电池电压校准全指南"
date: "2025-04-19"
description: "你的 Meshtastic 设备明明是电池供电，屏幕上却莫名其妙地出现了充电🔌图标？别慌，这不是玄学，而是 ADC 采样的电压超标，导致设备误判供电模式。想要精准显示电池电压，关键在于校准 ADC 系数。本指南将深入解析 ADC 采样的原理，带你一步步手动校准，让 Meshtastic 设备准确识别供电方式，彻底告别「假充电」困扰！"
tags:
  - "ADC"
slug: "meshtastic-ADC-Multiplier-Override"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/meshtastic-ADC-Multiplier-Override/

在使用 Meshtastic 设备时，你可能会遇到一个奇怪的问题：即使设备使用的是电池供电，它仍然显示电源插头（🔌充电）图标，误以为正在使用外部电源/充电头。这一问题通常是由于 ADC 采样的电压超过了 4.2V，导致设备错误地判断其供电状态。

解决这一问题的关键是调整 ADC 系数（ADC Multiplier），确保设备正确计算电池电压。本教程将详细介绍：

- ADC 系数的工作原理

- 如何手动校准 ADC 系数

- 不同 Meshtastic 设备的默认 ADC 系数

- 如何调整 ADC 系数以解决误判外部供电的问题

在深入探讨如何校准 ADC 系数之前，我们需要先了解 ADC（模数转换器）的工作原理，以及为什么 Meshtastic 设备需要进行电压修正。

> ADC（Analog-to-Digital Converter，模数转换器）是一种将模拟电压信号转换为数字信号的组件。在 Meshtastic 设备中，电池的电压是一个模拟信号，而设备的 MCU（微控制单元）无法直接读取该电压值。因此，ADC 会将这个电压转换成 MCU 可以理解的数字数据。

然而，嵌入式 MCU （如 nRF52、ESP32）处理的电压范围通常是 0-3.3V 或 0-1.1V，但锂电池的电压范围通常在 3.0V 至 4.2V 之间，远远超出 MCU 自带的 ADC 直接测量范围。如果直接连接电池，可能会导致 ADC 过载，甚至损坏芯片。

因此，设备设计时通常会在 ADC 输入端加入一个电阻分压电路来降低电池电压，使其落入 MCU 可测量的范围。

从数学上来说，这是一个映射关系，把 3.0V-4.2V 的电压范围映射到 0-3.3V 或 0-1.1V 的电压范围。

## 电阻分压如何影响 ADC 采样

![电池电压分压电路示意图。来自 MicroChip 官网](https://meshcn.net/meshtastic-ADC-Multiplier-Override/adc_battery_voltage_divider.webp)

分压电路的核心原理是通过两个电阻 R1 和 R2 将电池电压 $V_\{BAT\}$ 按比例分压，使得 ADC 读取到的电压 $V_\{ADC\}$ 处于安全范围。其计算公式如下：

$$  

V_\{ADC\} = V_\{BAT\} \times \frac\{R_2\}\{R_1 + R_2\}  

$$

其中：

- $V_\{BAT\}$ 是电池的实际电压；

- $V_\{ADC\}$ 是 ADC 读取的电压；

- $R_1$ 和 $R_2$ 是设备上用于分压的电阻。

由于每个 Meshtastic 设备型号的 R1 和 R2 可能不同，导致 ADC 读取到的电压与实际电池电压之间存在一个固定的比例关系。因此，为了让软件能够准确计算出真实的电池电压，我们需要一个 ADC 系数（ADC Multiplier） 来修正这个比例关系。

为了让 Meshtastic 设备能够正确计算电池电压，固件会使用一个系数 $ M $ 来修正 ADC 读取值，使其恢复到真实的电池电压：

$$  

V_\{计算出的电池电压\} = V_\{ADC\} \times M  

$$

其中：

- $V_\{计算出的电池电压\}$ 是计算出的电池电压；

- $V_\{ADC\}$ 是 ADC 实际测量到的电压；

- $M$（ADC 系数）是一个校正系数，取决于设备的分压电阻比值。

不同设备的分压电阻不同，因此 ADC 系数的默认值在不同设备上可能会有所不同。如果设备默认的 ADC 系数不准确，就会导致错误的电池电压计算，从而影响供电模式的判断。

在理想情况下，所有设备出厂时都会有一个合理的 ADC 系数。然而，在实际使用中，以下因素可能导致 ADC 系数不准确：

1. 硬件设计的公差

2. 固件默认值不适配特定设备：Meshtastic 适配了多种不同的硬件，固件的默认 ADC 系数可能并不适用于你的设备。

3. DIY 设备（如 fakeTec）需要根据实际使用的分压电阻参数来更改 ADC 系数

因此，为了确保 Meshtastic 设备能准确计算电池电压，我们可以手动调整 ADC 系数，使其符合设备的真实情况。

## Meshtastic 设备的 ADC 校准流程

在 Meshtastic 设备上，电池电压是通过 ADC（模数转换器）读取并计算的。然而，由于不同设备的硬件设计存在差异，默认的 ADC 系数可能不适用于所有设备。如果 ADC 系数设置不正确，设备计算出的电池电压就会出现误差，从而导致错误的供电模式判断（例如，设备可能错误地认为正在使用外部电源）。

因此，我们需要手动校准 ADC 系数（multiplier），使其符合设备的实际情况。校准的基本流程包括 测量电池真实电压、查看设备计算的电池电压、，并将新值写入设备。下面我们将详细讲解每个步骤，并提供具体的操作方法。

### 校准前的准备

在进行 ADC 校准之前，需要做好充分的准备，以确保校准过程准确可靠。以下是校准前需要准备的事项：

第一，确保设备使用的是电池供电，而不是 USB 供电。在校准过程中，设备必须完全依赖电池供电，而不能连接 USB 线或外部电源。连接 USB 供电可能会影响 ADC 采样值，从而导致校准数据不准确。因此，在校准前，务必拔掉 USB 线，并确保设备仅通过电池供电运行。

第二，需要使用一块充满电的电池。理论上，锂电池在完全充满时，电压应该在 4.2V ±1% 之间。使用一块充满电的电池可以提供一个已知的稳定电压参考，避免由于电池电量变化导致的电压波动影响校准结果。因此，建议在校准前先将电池充满，并在测量时保证设备已经断开充电器。

第三，准备一台万用表，这将用来测量电池的电压值。

第四，开始前，请先记录当前设备的 ADC 系数，以便进行比较和调整。不同设备的默认 ADC 系数可能有所不同，因此，我们需要先查询当前的 ADC 系数，并记录它的初始值。

### 读取当前 ADC 系数

ADC 系数是设备用于计算电池电压的关键参数，不同型号的设备可能使用不同的默认值。以下是一些常见 Meshtastic 设备的默认 ADC 系数：

| 设备型号 | 默认 ADC 系数 |
| --- | --- |
| chatter2 | 5.0 |
| diy | 1.85 |
| esp32-s3-pico | 3.1 |
| heltec_v1 & v2 | 3.2 |
| heltec_v3 & wsl_v3 | 4.9 |
| heltec_wireless_paper | 2.0 |
| nano-g1-explorer | 2.0 |
| rak4631 | 1.73 |
| tlora_t3s3_v1 | 2.11 |

如果设备的默认 ADC 系数不适合你的设备，可能会导致计算出的电池电压不准确，从而影响供电模式的判断。

#### 方法 1：使用 Meshtastic 应用查询

1. 打开 Meshtastic App（适用于 Android 和 iOS）。

2. 进入 设备配置（Radio Configuration）。

3. 找到 电源（Power） 选项。

4. 在 ADC Multiplier Override 选项下，可以看到当前设备使用的 ADC 系数。

#### 方法 2：使用 CLI 查询

如果你使用的是 Meshtastic 命令行工具（CLI），可以输入以下命令查询当前的 ADC 系数：

```
meshtastic --get power.adc_multiplier_override
```

终端会返回类似的结果：

```
power.adc_multiplier_override = 3.2
```

这表示当前设备的 ADC 系数是 3.2。请记录这个值，以便在后续步骤中进行调整。

### 读取设备计算出的电池电压

在 Meshtastic 设备中，你可以使用 App 或 CLI 查询当前设备计算出的电池电压，并与万用表测得的实际电池电压进行对比。

#### 方法 1：使用 Meshtastic App 查询

1. 打开 Meshtastic App。

2. 进入 设备状态（Device Info） 页面。

3. 查找 电池电压（Battery Voltage）。

4. 例如，如果显示：

```
Battery Voltage: 3.82V
```

这表示设备当前计算出的电池电压是 3.82V。

#### 方法 2：使用 CLI 查询

如果你使用的是命令行工具（CLI），可以输入以下命令：

```
meshtastic --get power.battery_voltage
```

终端可能返回：

```
power.battery_voltage = 3.82
```

这表示设备当前认为电池电压是 3.82V。请记录这个值，我们将在下一步使用它来计算新的 ADC 系数。

### 计算新的 ADC 系数

在 Meshtastic 设备上，ADC 系数（ADC Multiplier）决定了电池电压的计算精度。如果设备计算出的电池电压与实际测量值存在误差，就需要调整 ADC 系数，使其更加准确。我们可以使用两种方法进行计算：

1. Meshtastic 官方提供的 ADC 计算器（推荐），适合新手，不需要手动计算。

2. 手动计算 ADC 系数，适合高级用户，可在无网络环境下操作。

#### 方法 1：使用 Meshtastic ADC 计算器（推荐）

Meshtastic 提供了一个 ADC 计算器，可以自动计算新的 ADC 系数。这个方法简单易用，适合大多数用户。校准步骤如下：

##### 步骤 1：充满电池

首先，将电池完全充满。根据设备不同，充满电的状态指示方式可能不同，但充满电时电压应为 4.2V ±1%。请确保设备已充满电后再进行校准。

##### 步骤 2：检查设备显示的电池电量百分比

在 Meshtastic App 或设备屏幕上，找到 Battery Charge Percent（电池电量百分比），通常会显示类似：

```
B 3.82V 60%
```

其中，60% 就是电池电量百分比，当前计算出的电池电压是 3.82V。

如果电池电量百分比未显示，说明设备当前的 Operative ADC Multiplier 系数过高，需要降低它的数值（推荐每次降低 0.1），直到设备能正确显示电池百分比。

##### 步骤 3：输入数据到 ADC 计算器

1. 打开 Meshtastic 官方 ADC 计算器：  

[Meshtastic Power Configuration - Calibration Process](https://meshtastic.org/docs/configuration/radio/power/#calibration-process-attribution)

2. 在电池电量百分比输入设备显示的电池电量百分比（例如 60%）。

3. 在 Current ADC Multiplier 输入设备当前使用的 ADC 系数（例如 5.0）。

4. 点击 Calculate 按钮，计算器会自动计算新的 Operative ADC Multiplier，并在 Calculated New Operative ADC Multiplier 处显示新数值（例如 5.42）。

5. 记下计算出的新 ADC 系数，后续我们会将其应用到设备，以确保电池电压计算准确。

#### 方法 2：手动计算 ADC 系数

如果无法使用 ADC 计算器，你也可以手动计算新的 ADC 系数。步骤如下：

##### 收集数据

1. 使用万用表测量电池的真实电压（例如 4.2V）。

2. 查看设备计算出的电池电压（例如 3.82V）。

3. 记录当前设备的 ADC 系数（例如 3.2）。

##### 使用公式计算新的 ADC 系数

$$  

\text\{新系数\} = \text\{当前 ADC 系数\} \times \frac\{\text\{真实电池电压\}\}\{\text\{设备计算的电压\}\}  

$$

将数据代入：  

$$  

\text\{新 ADC 系数\} = 3.2 \times \frac\{4.2\}\{3.82\}  

$$

$$  

\text\{新 ADC 系数\} = 3.52  

$$

对于大多数用户，推荐使用 Meshtastic ADC 计算器，因为它简单直观，不需要手动计算。如果你更喜欢理解计算过程，可以使用手动方法。

### 设置新的 ADC 系数

#### 方法 1：在 Meshtastic App 中修改

1. 打开 Meshtastic App。

2. 进入 设备配置（Radio Configuration）。

3. 选择 电源（Power） 选项。

4. 找到 ADC Multiplier Override。

5. 输入新的 ADC 系数（例如 3.52）。

6. 保存设置并重启设备。

#### 方法 2：使用 CLI 设置

输入以下命令将新的 ADC 系数应用到设备：

```
meshtastic --
set
 power.adc_multiplier_override 3.52
```

然后重启设备：

```
meshtastic --reboot
```

设备重启后，新的 ADC 系数将生效。
