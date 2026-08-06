import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCard,
  MrCTA,
  IconUsers,
  IconRadio,
  IconMountain,
  IconCpu,
  IconRoute,
  IconShield,
  IconFileText,
  IconNetwork,
} from '@site/src/components/mr';

const MEANINGS = [
  {
    icon: IconUsers,
    title: '互联之域 · Mesh Realm Of Connection',
    sub: '社区 / 网站名称',
    desc: '这是「我们」——一群由硬件开发者、户外爱好者与应急通信志愿者组成的开源社区。我们共建知识、共享节点、一起把离线通信网络织得更大。',
    tags: ['社区', '网站名', '一群人'],
  },
  {
    icon: IconRadio,
    orange: true,
    title: 'MeshROC · Mesh Radio-Optimized Communications',
    sub: '系统名称',
    desc: '这是社区构建并维护的开源系统——一套兼容 Meshtastic 协议的离线无线 Mesh 组网硬件与固件。它是「我们做出的东西」，而不是社区本身。',
    tags: ['系统', '硬件 + 固件', '技术产物'],
  },
];

const WHO = [
  {
    icon: IconMountain,
    title: '山地实测',
    desc: '北京山地远距离链路实测，积累真实地形下的覆盖与可达数据。',
  },
  {
    icon: IconCpu,
    title: '自研硬件迭代',
    desc: '在立创开源平台持续迭代自研 PCB，入库星火计划，开放给所有人打样。',
  },
  {
    icon: IconRoute,
    title: '固件路由优化',
    desc: '社区共同打磨分层骨干路由、电源与射频策略，解决真实环境的痛点。',
  },
  {
    icon: IconShield,
    title: '应急通信交流',
    desc: '面向断网、灾备与户外场景，分享部署经验与应急通信方案。',
  },
  {
    icon: IconFileText,
    title: '开源资料共建',
    desc: '文档、教程、案例由社区成员共同撰写与维护，新手也能快速上手。',
  },
  {
    icon: IconNetwork,
    title: '节点互助',
    desc: '成员之间共享节点、互换配件、协同排查，一个人跑不通的链路大家一起跑。',
  },
];

const DIFFS = [
  { dim: '路由机制', meshroc: '分层骨干路由，骨干节点负责转发', others: '洪泛广播，全员转发' },
  { dim: '信道拥堵', meshroc: '从机制上抑制广播风暴', others: '高密度下易爆信道拥堵' },
  { dim: '射频频段', meshroc: '470–490MHz 国内免费频段', others: '868/915MHz 国内未开放' },
  { dim: '山地覆盖', meshroc: 'NLOS 链路预算专项优化', others: '通用地形，无本土优化' },
  { dim: '休眠丢包', meshroc: '电源系统重写，休眠不漏收', others: '已知休眠丢包与发送中断' },
  { dim: '外设驱动', meshroc: '全套自研 PCB 专属驱动', others: '通用开发板移植' },
  { dim: '太阳能', meshroc: '30dBm 太阳能骨干节点', others: '无对应工业级方案' },
  { dim: '本地化', meshroc: '中文文档 + 国内频段合规', others: '以海外社区为主' },
];

export default function AboutPage() {
  return (
    <MrPage
      title="关于我们"
      description="互联之域（Mesh Realm Of Connection）是一个开源 LoRa Mesh 社区，构建并维护 MeshROC（Mesh Radio-Optimized Communications）离线无线组网系统，兼容 Meshtastic 协议。"
    >
      <div className="mr-logo">
        <img src="/img/logo.svg" alt="互联之域 MeshROC" />
      </div>

      <MrHeader
        eyebrow="About 互联之域"
        title="互联之域 · 开源 LoRa Mesh 社区"
        lead="互联之域（Mesh Realm Of Connection）是由硬件开发者、户外爱好者与应急通信志愿者共同运营的开源社区。我们构建并维护 MeshROC 系统（Mesh Radio-Optimized Communications）——一套兼容 Meshtastic 协议的离线无线 Mesh 组网系统。"
      />

      <MrSection
        eyebrow="先说清楚"
        title="MeshROC 的两层含义"
        lead="社区和系统不是同一件事，请不要把两者混为一谈："
      >
        <div className="mr-grid mr-grid--2">
          {MEANINGS.map((m) => (
            <MrCard
              key={m.title}
              icon={m.icon}
              orange={m.orange}
              title={m.title}
              desc={`【${m.sub}】${m.desc}`}
              tags={m.tags}
            />
          ))}
        </div>
      </MrSection>

      <MrSection
        eyebrow="我们是谁"
        title="一群把离线网络织起来的人"
        lead="互联之域不是某个厂牌，而是一群自愿聚在一起、用业余时间把离线通信做得更好的人。"
      >
        <div className="mr-grid mr-grid--3">
          {WHO.map((w) => (
            <MrCard key={w.title} icon={w.icon} title={w.title} desc={w.desc} />
          ))}
        </div>
      </MrSection>

      <MrSection
        eyebrow="与 Meshtastic 的关系"
        title="我们是 Meshtastic 生态的一部分"
        lead="MeshROC 不是另起炉灶的竞品，而是在 Meshtastic 协议之上，由中文社区补充本土化能力的兼容分支。"
      >
        <div className="mr-card">
          <p className="mr-p">
            Meshtastic 是一个优秀的开源项目，MeshROC
            的固件构建于其之上，并遵循同样的 GPL-3.0
            协议，保持与全球任意标准 Meshtastic 设备的 100% 互通：文本、位置、遥测数据可互传。
          </p>
          <p className="mr-p">
            社区额外做的事，是面向国内频段法规、山地地形与应急场景做本土化优化，并设计自研硬件。你可以把
            MeshROC 节点直接加入现有 Meshtastic 网络，无需替换任何已有设备。
          </p>
          <p className="mr-p">
            我们鼓励成员同时参与上游 Meshtastic 社区，把中文地区的经验回馈给整个生态。
          </p>
        </div>
      </MrSection>

      <MrSection
        eyebrow="社区工程成果"
        title="我们在技术上做了什么"
        lead="下面这些是社区成员在 Meshtastic 基础上补充的差异点，属于技术说明而非商业宣传。"
      >
        <div className="mr-table-wrap">
          <table className="mr-table">
            <thead>
              <tr>
                <th>维度</th>
                <th className="mr-table__up">互联之域 / MeshROC</th>
                <th>原版 / 通用方案</th>
              </tr>
            </thead>
            <tbody>
              {DIFFS.map((d) => (
                <tr key={d.dim}>
                  <td>{d.dim}</td>
                  <td className="mr-table__up">{d.meshroc}</td>
                  <td className="mr-table__yes">{d.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MrSection>

      <MrSection
        eyebrow="License"
        title="开源协议说明"
        lead="不同部分适用不同协议，请按组件区分，避免授权混乱。"
      >
        <div className="mr-grid mr-grid--3">
          <div className="mr-card">
            <h3 className="mr-h3">固件 · GPL-3.0</h3>
            <p className="mr-card__desc">
              MeshROC 固件构建于 Meshtastic 之上，遵循 GPL-3.0 协议，与上游保持完全互通。修改后分发同样须以 GPL-3.0 开源。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">硬件 · 开源硬件</h3>
            <p className="mr-card__desc">
              自研 PCB 设计以开源硬件协议在立创开源平台发布，入库星火计划，任何人都可克隆工程自行打样。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">文档 / 官网 · MIT</h3>
            <p className="mr-card__desc">
              本站文档与官网源码以 MIT 协议开源，欢迎引用、转载与二次创作，请保留出处。
            </p>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="加入互联之域"
        desc="无论你是写固件、画板子、跑山地实测，还是只想在多雨断网的周末有张能用的网——这里都欢迎你。一起把离线网络织得更大。"
        actions={[
          { label: '加入社区', href: 'https://github.com/ye2f4/MeshROC', variant: 'mr-btn--primary' },
          { label: '查看固件源码', href: 'https://github.com/ye2f4/MeshROC', variant: 'mr-btn--ghost' },
          { label: '下载中心', to: '/download', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
