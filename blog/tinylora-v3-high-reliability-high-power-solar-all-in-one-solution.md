---
title: "【硬核】基于 TinyLora V3 的高可靠大功率太阳能一体机整体方案"
date: "2026-03-28"
description: "这是一套面向长期户外部署的 TinyLora V3 太阳能一体机方案，从物料选择、外壳加工、焊接装配到安装方式，完整整理了作者的实战做法。"
tags:
  - "DIY"
  - "TinyLora"
slug: "tinylora-v3-high-reliability-high-power-solar-all-in-one-solution"
---

> 本文转载自 MeshCN（Meshtastic 中国社区），原文链接：https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/

> 这篇方案由 [MeshCN 社区微信群](https://meshcn.net/contact) 成员 *群里大佬* 与 *群里大佬* 共同整理，感谢他们把完整的实做过程分享出来。

如果你在 MeshCN 微信群里，肯定听过群里大佬的大名。几乎每一个新进群的群友，都会被其他群友推荐使用群里大佬的 TinyLora 作为第一个入门设备。以往大家玩 TinyLora，通常都是怎么简单怎么来，先把设备跑起来、先连上网、先体验到 Meshtastic 的基本乐趣。

今天这篇文章想介绍的，就不是最省事的用法了，而是看看怎么把 TinyLora 玩出花样，把它进一步折腾成一个防水、专业、适合长期户外部署的太阳能节点。

如果你想做一台真正能长期挂在户外的 Meshtastic 节点，那么光把开发板塞进盒子里通常还不够。天线、供电、外壳强度、防水、安装方式，这几个环节只要有一处处理得不够稳，设备就很难在室外环境里长时间正常工作。

这篇文章整理的是一套基于 TinyLora V3 的高可靠大功率太阳能一体机方案。原始资料本身已经把关键步骤都记录下来了，但更像是一份现场施工记录。这里我在不减少信息量的前提下，把整套流程重新整理成更适合阅读和照着做的版本，方便后来者直接参考。

## 1. 物料清单

先看整套方案里实际用到的物料。这里既包括核心电子部分，也包括外壳、紧固件和安装配件。做这类户外一体机时，很多人会把注意力都放在开发板和太阳能板上，但真正决定成品稳定性的，往往反而是这些看起来不起眼的小零件。

![物料全家福](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/01-materials-overview.webp)

| 名称 | 价格 |
| --- | --- |
| 温湿度版 tinylora_v3 开发板 | 114 |
| 立创开源 tinylora_v3 白 piao 电路板 | 0 |
| 12W 多晶带线/支架/接线盒/转换器太阳能板 | 15 |
| dyson 拆机魔力 18650 防冻电池（-40 度可用） | 1.8 |
| 470-510Mhz 玻璃钢天线 | 25 |
| SMA 内螺内针转 N 母转接头 | 2.5 |
| SMA 内螺内针转外螺内孔 0.08m 转接线 | 3.12 |
| 422995mm 铝合金外壳 | 5.6 |
| 250mm 防水箱抱箍横杆 | 2.5 |
| 20mm R 型电缆固定夹 | 0.47 |
| 58.57.4mm T 型护线圈 | 0.1 |
| M320mm 固定铜柱4 | 1 |
| M2.36mm 螺丝8 | 0.08 |

## 2. 制作过程

整套制作过程可以理解为四件事：先把开发板固定起来，再把铝合金外壳加工到合适尺寸，然后完成供电与天线连接，最后再把整机固定到太阳能板组件上。顺着这个思路往下看，步骤会更清楚。

> 注意个人防护

> 操作电动工具时会有碎屑飞溅并伴有粉尘污染，务必佩戴护目镜、手套和口罩操作！

### 外壳与主板定位

先从开发板本体开始。第一步是把 4 条固定铜柱拧紧到开发板上，注意要预先在螺柱涂螺丝胶，防止后续出现共轴旋转的问题。这个小动作看起来不起眼，但后面反复拆装、试位、拧紧时会省掉很多麻烦。

![安装固定铜柱](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/02-mainboard-with-standoffs-and-threadlocker.webp)

接下来处理铝合金外壳挡板固定用的翻边。原做法是沿折弯的边线切割，转速不宜太高，也不要试图一次切透，而是从右至左轻轻多次切割，深度超过一般厚度之后停止，再用虎钳一点点沿边线掰掉。这样做的目的，是尽量减少变形并让切口更可控。

![切除挡板翻边](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/03-cutting-front-and-rear-panel-flanges.webp)

翻边处理完以后，将开发板 SMA 接口边缘用记号笔涂黑。这个记号不是装饰，而是为了后续试装时在挡板内壁留下准确的开孔参考。

![SMA 接口边缘做标记](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/04-marking-sma-position-on-board.webp)

随后把开发板对齐中间位置，缓慢推入只装前挡板的假组外壳中，直到推不动为止。拉出开发板后，前挡板内壁就会出现一圈清晰的开孔标记，后面的钻孔位置就靠它来确定。

![将开发板推入外壳试位](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/05-test-fit-board-into-enclosure.webp)

![前挡板留下的开孔标记](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/06-sma-hole-mark-left-on-front-panel.webp)

确认好位置之后，用电钻安装 6mm 钻头对准标记处开孔。实际操作时建议先低速打出凹坑定位，再高速打出通孔，这样不容易跑偏。

![为 SMA 接口开孔](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/07-drilling-front-panel-sma-hole.webp)

孔位打好后，再对加工完的前后挡板使用砂轮机打磨抛光，包括开的通孔边缘，以及之前切除翻边后留下的边缘。到这里，前后挡板的加工就基本告一段落了。

![挡板边缘打磨抛光](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/08-grinding-and-polishing-panels.webp)

![前后挡板加工完成效果](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/09-finished-front-and-rear-panels.webp)

接下来处理上盖。先用开发板比对外壳上盖，预留出 SMA 接口边缘厚度并做标记；然后拿白 piao 的电路板上边缘对齐这个厚度标记，再把它移到外壳上盖板中间位置，在电路板四个螺丝孔内做标记。这样做的好处是，即使不直接拿主板去反复比划，也能比较准确地把安装孔定位出来。

![在上盖上预留 SMA 接口位置](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/10-marking-sma-clearance-on-top-cover.webp)

![用空电路板标出四个螺丝孔](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/11-marking-top-cover-mounting-holes-with-pcb.webp)

有了定位点之后，用电钻安装 3.5mm 钻头，对电路板螺丝孔标记处开孔。完成后再检查一次孔位与边缘距离，确认没有偏差过大。

![为固定螺丝开孔](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/12-drilling-top-cover-mounting-holes.webp)

![上盖开孔完成效果](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/13-finished-top-cover-holes.webp)

### 走线、焊接与壳体装配

外壳孔位全部处理好以后，就可以开始处理供电走线。先把 T 型护线圈穿过后挡板开孔，这个零件的作用是避免线材直接与金属边缘摩擦。

![安装 T 型护线圈](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/14-installing-t-grommet-on-rear-panel.webp)

然后把太阳能板原装电源线从接线盒起算，量出 25cm 后剪断并剥线，再把电源线穿过 T 型护线圈，并在内部打一节，防止外部受力时把线直接拉脱。

![裁剪太阳能板电源线](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/15-cutting-solar-panel-power-cable-to-length.webp)

![电源线穿线并打节防拉脱](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/16-routing-cable-through-grommet-and-tying-knot.webp)

线材固定好后，用电烙铁在开发板 MPPT 焊盘处焊接电源线正极，在 GND 焊盘处焊接电源线负极。这里极性不要搞错，焊完以后也建议先做一次目视检查，再继续下一步。

![在开发板上焊接电源线](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/17-soldering-power-cable-to-mppt-and-gnd.webp)

焊接完成后先拧紧后挡板，再把开发板的 SMA 接口穿过前挡板过孔，装上固定弹簧垫片与螺母并拧紧前挡板。到这里，主板就已经被比较稳固地固定在壳体内部了。

![拧紧后挡板](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/18-tightening-rear-panel-after-soldering.webp)

![固定前挡板与 SMA 接口](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/19-fixing-front-panel-and-sma-connector.webp)

随后把 SMA 内螺内针转外螺内孔转接线拧紧到开发板 SMA 接口上。这里原作者特别提醒了一句：天线一定要先接再装电池，防止烧毁开发板 LoRa 模组，这一点务必要照做。

![连接 SMA 转接线](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/20-connecting-sma-pigtail-to-enclosure.webp)

接下来安装 18650 电池到电池座，极性一定不要装反，装反必烧。确认电池方向无误后，再用环氧密封胶沿着外壳上盖双侧接缝打胶，注意不要打太多，只需要确保接缝位置有连续的密封层即可。

![安装 18650 电池](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/21-installing-18650-cell-into-battery-holder.webp)

![沿上盖接缝打环氧密封胶](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/22-applying-epoxy-sealant-along-top-cover-seam.webp)

打胶完成后，把外壳上盖盖上，并拧紧用于固定电路板的螺丝。到这里，一体机主机部分基本就成型了。

![盖上上盖并锁紧螺丝](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/23-closing-top-cover-and-fastening-screws.webp)

### 固定到太阳能板组件

主机装好以后，剩下的工作就是把它和太阳能板、天线、安装横杆组合起来。先用切割机沿着外壳底部第一道槽，在后挡板双侧开槽，给横杆卡位预留结构。

![在外壳底部开槽](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/24-cutting-side-slots-for-crossbar-mount.webp)

随后将主机本体对准横杆凹槽滑入并卡紧。这里的配合精度比较重要，所以前面外壳加工阶段做得越准，后面这一步越轻松。

![主机滑入横杆凹槽](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/25-sliding-main-unit-into-crossbar-slot.webp)

主机卡入横杆后，用电钻安装台阶钻头，比对横杆与太阳能板铝合金边框边缘交叉处，在双侧开孔，穿过螺丝将横杆结实固定在太阳能板铝合金边框底部。同时，也别忘了在太阳能板铝合金边框底边开排水孔，给长期户外使用留出排水通道。

![横杆固定到太阳能板边框](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/26-drilling-crossbar-to-solar-frame-mounting-holes.webp)

接着把太阳能板支架的手拧螺丝拆掉，让天线穿过固定夹，固定夹再穿过螺杆并重新拧紧手拧螺丝。这样天线就能与整套支架结构结合在一起。

![利用固定夹安装天线](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/27-clamping-antenna-to-solar-panel-bracket.webp)

最后，把 SMA 内螺内针转 N 母转接头安装到天线末端，再用 SMA 内螺内针转外螺内孔转接线连接天线末端。确认所有接口都已经拧紧后，就可以撕掉保护膜，整机正式投运。

![安装 SMA 转 N 母转接头](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/28-installing-n-female-adapter-on-antenna-end.webp)

![连接天线末端转接线](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/29-connecting-sma-pigtail-to-antenna-adapter.webp)

![整机完成并投运](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/30-peeling-protective-film-before-deployment.webp)

## 3. 整体外观

前面的步骤看下来会比较碎，到了这一步就能直接看到整机形态。正面和背面的完成效果如下，从结构上可以看出，这套方案的重点就是把主机、供电和安装结构尽量做成一个整体，减少户外长期使用时的松动风险。

3.1 正面视图

![整机正面视图](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/31-finished-unit-front-view.webp)

3.2 背面视图

![整机背面视图](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/32-finished-unit-rear-view.webp)

3.3 防水测试

从作者给出的实拍资料来看，这套外壳方案也专门做了防水验证。图片之外，目录里还保留了原始防水测试视频，可以直接内嵌查看。

## 4. 安装方式

设备做好只是第一步，真正上墙、上杆、长期挂在户外，安全问题比装机本身更重要。尤其是楼顶、外墙这类位置，一旦安装方式不当，风险远比通信效果差要严重得多。

> FBI WARRING

> 严禁以任何方式安装到楼顶避雷线等危险的位置！

> 严禁以任何方式安装到不牢靠易损的基体之上！

> 登高 1.5m 以上作业必须使用安全带！

> 炮钉枪有一定危险性，务必看清说明书，佩戴护目镜、手套按照规范正确操作！

如果是墙壁安装，原方案的做法是直接使用图中的炮钉枪，打两颗钉贯穿太阳能板支架，将其固定到混凝土基体上即可。这种方式简单直接，但前提是基层足够牢固，而且施工者对工具有基本经验。

![墙壁安装方式](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/33-wall-mount-nail-gun-example.webp)

如果不适合打钉，也可以选择抱箍安装。项目使用的防水箱抱箍横杆本身就支持抱箍方式，购买如图的抱箍后穿过横杆专用过孔拉紧即可；如果有条件，太阳能板支架再增加一道固定会更稳妥。

![抱箍安装方式](https://meshcn.net/tinylora-v3-high-reliability-high-power-solar-all-in-one-solution/34-hose-clamp-mount-example.webp)

## 5. 脑洞展望

作者最后还留了一个很有意思的想法：横杆有一侧其实还能继续安装设备，闲置着多少有点可惜，而且目前整体重心也并不是完全对称。既然已经做到了这一步，不妨继续脑洞大开，看看能不能顺手再加一点别的功能，比如装个风扇辅助控制温度，或者围绕这根横杆继续扩展别的传感、供电或固定结构。

本文作者：群里大佬 × 群里大佬
