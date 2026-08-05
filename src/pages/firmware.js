import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCard,
  MrCTA,
  IconRoute,
  IconRadio,
  IconBattery,
  IconCpu,
} from '@site/src/components/mr';

export default function FirmwarePage() {
  return (
    <MrPage
      title="固件系统"
      description="MeshROC 固件核心优势：分层骨干路由、射频本土化优化、电源系统重写、全套自研外设驱动。"
    >
      <MrHeader
        eyebrow="Firmware"
        title="MeshROC 固件系统"
        lead="独立固件分支，在保持 Meshtastic 协议兼容的同时，从路由、射频、电源、驱动四个层面进行深度重构。"
      />

      <MrSection
        eyebrow="01 · 路由系统"
        title="路由系统大幅领先原版"
        lead="原版 Meshtastic 采用洪泛广播，节点数量上升后极易出现广播风暴与信道拥堵。MeshROC 引入分层骨干路由机制从根本上解决该问题。"
      >
        <div className="mr-grid mr-grid--3">
          <MrCard
            icon={IconRoute}
            title="分层骨干路由机制"
            desc="骨干节点负责转发，终端节点保持静默，大幅降低无效重复广播。"
          />
          <MrCard
            icon={IconRoute}
            title="防广播风暴"
            desc="从机制层面抑制洪泛扩散，避免高密度节点场景下的信道拥堵。"
          />
          <MrCard
            icon={IconRoute}
            title="自适应跳数择优"
            desc="依据信噪比动态选择最优路径，自适应调整跳数上限。"
          />
        </div>
      </MrSection>

      <MrSection
        eyebrow="02 · 射频系统"
        eyebrowOrange
        title="射频系统中国本土化优化"
        lead="针对国内频段法规与山地地形特点，重新设计射频参数与信道接入策略。"
      >
        <div className="mr-grid mr-grid--4">
          <MrCard
            icon={IconRadio}
            orange
            title="470–490MHz"
            desc="标准国内免费频段本地化适配，合规免许可使用。"
          />
          <MrCard
            icon={IconRadio}
            orange
            title="山地 NLOS 优化"
            desc="非视距地形下的链路预算与调制策略专项优化。"
          />
          <MrCard
            icon={IconRadio}
            orange
            title="动态功率调节"
            desc="按链路质量自动调整发射功率，兼顾覆盖与功耗。"
          />
          <MrCard
            icon={IconRadio}
            orange
            title="LBT / CAD 增强"
            desc="发送前信道侦听与冲突检测增强，降低碰撞概率。"
          />
        </div>
      </MrSection>

      <MrSection
        eyebrow="03 · 电源系统"
        title="电源系统重写"
        lead="解决原版长期存在的休眠丢包与发送中断问题，让节点真正具备长期无人值守能力。"
      >
        <div className="mr-grid mr-grid--2">
          <MrCard
            icon={IconBattery}
            title="休眠丢包与发送中断修复"
            desc="重写休眠唤醒时序与发送状态机，确保深度省电下不漏收关键报文、不中断正在进行的发送。"
          />
          <MrCard
            icon={IconBattery}
            title="太阳能智能策略"
            desc="根据光照与电池状态动态调整占空比与发射策略，保证阴雨天气下的续航底线。"
          />
          <MrCard
            icon={IconBattery}
            title="大功率发射噪声抑制"
            desc="针对 30dBm 大功率发射引入的电源噪声进行抑制，避免拉低系统稳定性。"
          />
          <MrCard
            icon={IconBattery}
            title="ADC 防抖滤波"
            desc="电池电压采样加入防抖滤波，解决发射瞬间 ADC 读数跳变导致的误判。"
          />
        </div>
      </MrSection>

      <MrSection
        eyebrow="04 · 外设驱动"
        eyebrowOrange
        title="全套自研外设驱动"
        lead="所有驱动专为 MeshROC 自研 PCB 适配，而非通用开发板的移植版本。"
      >
        <div className="mr-grid mr-grid--4">
          <MrCard
            icon={IconCpu}
            title="SPI 屏幕抗干扰驱动"
            desc="规避 USB 引脚冲突，解决大功率发射时屏幕花屏与死机问题。"
          />
          <MrCard
            icon={IconCpu}
            title="键盘中断唤醒系统"
            desc="实体键盘经 PCF8574 扩展，支持中断唤醒，休眠下按键即响应。"
          />
          <MrCard
            icon={IconCpu}
            title="GNSS 高精度定位"
            desc="定位模块适配与冷启动优化，位置广播更快更准。"
          />
          <MrCard
            icon={IconCpu}
            title="温湿度与电压监测"
            desc="AHT20 温湿度与电池 ADC 完整适配，遥测数据随报文上报。"
          />
        </div>
      </MrSection>

      <MrSection eyebrow="兼容性承诺" title="始终与 Meshtastic 互通">
        <div className="mr-card">
          <p className="mr-p">
            无论固件如何优化，MeshROC 始终保持与标准 Meshtastic 协议的 100%
            互通：文本消息、位置信息、传感器遥测数据均可与全球任意标准 Meshtastic 设备互传。
          </p>
          <p className="mr-p">
            这意味着你可以把 MeshROC 节点直接加入现有 Meshtastic
            网络，无需替换任何已有设备，即可获得骨干路由与本土化射频带来的增益。
          </p>
        </div>
      </MrSection>

      <MrCTA
        title="下载固件开始使用"
        desc="获取预编译固件与刷写工具，或查阅文档中心的完整配置说明。"
        actions={[
          { label: '下载固件', to: '/download' },
          { label: '文档中心', to: '/docs-center', variant: 'mr-btn--ghost' },
          { label: '技术特性', to: '/features', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
