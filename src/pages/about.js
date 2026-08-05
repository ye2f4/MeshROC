import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCard,
  MrCTA,
  IconMountain,
  IconRadio,
  IconShield,
  IconRoute,
  IconCpu,
  IconZap,
} from '@site/src/components/mr';

const DIFFS = [
  {
    icon: IconRoute,
    title: '分层骨干路由系统',
    desc: '骨干节点转发、终端节点静默，从机制上解决原版洪泛广播风暴与信道拥堵问题。',
  },
  {
    icon: IconMountain,
    title: '山地 NLOS 远距离优化',
    desc: '针对非视距山地地形做链路预算与调制策略优化，显著提升复杂地形下的可达率。',
  },
  {
    icon: IconZap,
    title: '太阳能智能电源管理',
    desc: 'CN3791 太阳能充电 + 自研休眠策略，解决原版休眠丢包、发送中断等长期缺陷。',
  },
  {
    icon: IconRadio,
    title: '国产 470MHz 频段适配',
    desc: '标准 470–490MHz 国内免费频段本地化适配，合规且免许可使用。',
  },
  {
    icon: IconCpu,
    title: '自研 ESP32-S3 外设驱动',
    desc: '全套外设驱动专为自研 PCB 适配，规避 USB 引脚冲突等硬件级问题。',
  },
  {
    icon: IconShield,
    title: '抗射频干扰系统',
    desc: '解决 LoRa 大功率发射干扰屏幕与 ADC 采样的问题，保障强发射下的系统稳定。',
  },
];

export default function AboutPage() {
  return (
    <MrPage
      title="关于我们"
      description="MeshROC（Mesh Realm Of Connection）互联之域离线无线组网系统 —— 完全开源、自研优化、兼容 Meshtastic 协议的 LoRa-Mesh 生态。"
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <img
          src="/img/logo.webp"
          alt="MeshROC"
          width={96}
          height={96}
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 24px hsl(var(--btn-primary) / 0.3)' }}
        />
      </div>

      <MrHeader
        eyebrow="About MeshROC"
        title="互联之域离线无线组网系统"
        lead="MeshROC 是一套完全开源、自研优化、兼容 Meshtastic 协议，面向中国山地 / 城市应急通信的 LoRa-Mesh 离线无线组网硬件与固件生态系统。"
      />

      <MrSection eyebrow="项目定位" title="我们在做什么">
        <div className="mr-grid mr-grid--2">
          <div className="mr-card">
            <h3 className="mr-h3">项目性质</h3>
            <ul className="mr-card__list">
              <li>开源硬件 + 开源固件，MIT License</li>
              <li>向下 100% 兼容 Meshtastic 协议</li>
              <li>在 Meshtastic 基础上做结构性、路由、电源、射频与硬件适配的深度优化</li>
              <li>独立自研硬件体系、独立固件分支、独立社区生态</li>
            </ul>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">官方释义</h3>
            <p className="mr-p">
              <strong>MeshROC</strong> = <strong>Mesh Realm Of Connection</strong>
              ，中文官方释义为「互联之域离线无线组网系统」。
            </p>
            <p className="mr-p">
              项目专为山地远距离、城市复杂遮挡、应急断网三类真实场景而生，强调在没有任何基础设施的条件下依然保持可靠通信。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--cyan">开源硬件</span>
              <span className="mr-tag mr-tag--cyan">开源固件</span>
              <span className="mr-tag mr-tag--orange">MIT License</span>
            </div>
          </div>
        </div>
      </MrSection>

      <MrSection
        eyebrow="与 Meshtastic 的关系"
        eyebrowOrange
        title="基于 Meshtastic，但不是简单二次开发"
        lead="MeshROC 基于 Meshtastic 协议生态构建，保留完整协议互通性，同时解决原版长期存在的缺陷，并构建专属国产硬件体系。"
      >
        <div className="mr-grid mr-grid--2">
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconRadio size={22} />
            </div>
            <h3 className="mr-h3">完全兼容</h3>
            <p className="mr-card__desc">
              所有 MeshROC 设备可与全球标准 Meshtastic 设备互相通信、互传位置、文本与传感器数据，无需任何额外网关或转换。
            </p>
          </div>
          <div className="mr-card">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconZap size={22} />
            </div>
            <h3 className="mr-h3">显著升级</h3>
            <p className="mr-card__desc">
              在保持兼容的前提下，MeshROC 在路由、射频、电源、驱动四个维度实现了大量原版不具备的独有优化。
            </p>
          </div>
        </div>

        <div className="mr-table-wrap" style={{ marginTop: '1.15rem' }}>
          <table className="mr-table">
            <thead>
              <tr>
                <th>能力维度</th>
                <th>标准 Meshtastic</th>
                <th>MeshROC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>协议互通</td>
                <td>原生支持</td>
                <td className="mr-table__yes">100% 兼容</td>
              </tr>
              <tr>
                <td>路由机制</td>
                <td>洪泛广播，易拥堵</td>
                <td className="mr-table__up">分层骨干路由，防广播风暴</td>
              </tr>
              <tr>
                <td>频段适配</td>
                <td>通用国际频段</td>
                <td className="mr-table__up">470–490MHz 国内免费频段本地化</td>
              </tr>
              <tr>
                <td>山地 NLOS</td>
                <td>无针对性优化</td>
                <td className="mr-table__up">非视距远距离专项优化</td>
              </tr>
              <tr>
                <td>电源管理</td>
                <td>休眠存在丢包 / 发送中断</td>
                <td className="mr-table__up">电源系统重写 + 太阳能智能策略</td>
              </tr>
              <tr>
                <td>射频抗扰</td>
                <td>大功率发射干扰屏幕 / ADC</td>
                <td className="mr-table__up">抗射频干扰系统 + ADC 防抖滤波</td>
              </tr>
              <tr>
                <td>硬件体系</td>
                <td>第三方通用开发板</td>
                <td className="mr-table__up">自研 PCB，立创开源 · 星火计划入库</td>
              </tr>
            </tbody>
          </table>
        </div>
      </MrSection>

      <MrSection eyebrow="核心差异化" title="八项独有优化">
        <div className="mr-grid mr-grid--3">
          {DIFFS.map((d) => (
            <MrCard key={d.title} icon={d.icon} title={d.title} desc={d.desc} />
          ))}
          <MrCard
            icon={IconShield}
            orange
            title="低功耗休眠防丢包"
            desc="重写休眠唤醒时序，保证节点在深度省电状态下依然不漏收关键报文。"
          />
          <MrCard
            icon={IconCpu}
            orange
            title="自定义报文智能解析"
            desc="支持自定义报文格式的智能解析与自动控制联动，可扩展到遥测与远程执行场景。"
          />
        </div>
      </MrSection>

      <MrSection eyebrow="对外官方定位" center>
        <div className="mr-card" style={{ textAlign: 'center', alignItems: 'center' }}>
          <p
            className="mr-h3"
            style={{ fontSize: '1.15rem', lineHeight: 1.7, margin: 0 }}
          >
            MeshROC = Meshtastic-Compatible + China-Regional Optimized +
            Hardware-Tailored Professional Mesh System
          </p>
        </div>
      </MrSection>

      <MrCTA
        title="想深入了解技术细节？"
        desc="查看硬件产品线与固件系统的完整技术说明，或直接加入社区参与共建。"
        actions={[
          { label: '查看硬件产品', to: '/hardware' },
          { label: '固件系统', to: '/firmware', variant: 'mr-btn--ghost' },
          { label: '加入社区', to: '/community', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
