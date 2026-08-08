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
  { dim: '起源', meshroc: '中文社区，为国内多样地形与户外需求打造', mesh: '海外开源社区，面向全球业余户外爱好者', meshcore: '海外项目，主打远距离骨干中继' },
  { dim: '网络架构', meshroc: '自适应混合路由 + 全国地貌射频模板', mesh: '受控洪泛，TTL 上限 7，适合 3–5 跳', meshcore: '距离矢量路由 + 离线消息节点，最大 64 跳' },
  { dim: '射频调控', meshroc: '常驻链路探测，多地貌模板自动切换扩频/带宽/功率', mesh: '多为手动配置，缺自动调控', meshcore: '仅手动功率档位，无链路质量闭环' },
  { dim: '休眠 / 功耗', meshroc: '休眠同步帧统一唤醒，太阳能节点大幅省电', mesh: '休眠简陋，易错过广播', meshcore: '可发休眠通告，但中继优先级固化' },
  { dim: '离线消息', meshroc: '分布式缓存，可指派多处中继', mesh: '原生不支持，需 LXMF 插件', meshcore: '单一 Room‑Server 缓存' },
  { dim: '应急调度', meshroc: '告警/求救/位置最高优先级，区域广播面向防灾指挥', mesh: '通用消息，无调度语义', meshcore: '消息类型固定，无分级应答' },
  { dim: '加密安全', meshroc: 'AES‑256‑GCM，加密 + 完整性校验一体', mesh: 'AES‑256‑CTR，缺完整性校验', meshcore: 'CTR，原生无校验字段' },
  { dim: '电源 / 国产硬件', meshroc: '深度适配 IP5326 / MAX17055 / 4G 网关', mesh: '协议层不管控电源芯片', meshcore: '仅读基础电压，国产外设支持有限' },
  { dim: '全国地貌适配', meshroc: '9 类环境专项优化（山地/林区/沿海/戈壁/高原…）', mesh: '面向欧美旷野，无国内专项', meshcore: '面向海外开阔地，无多地貌预设' },
  { dim: '角色扩展', meshroc: '节点角色动态，可新增专属报文类型', mesh: '插件生态臃肿，定制成本高', meshcore: '终端/中继/存储三类固化' },
];

export default function AboutPage() {
  return (
    <MrPage
      title="关于我们"
      description="互联之域（Mesh Realm Of Connection）是一个开源 LoRa Mesh 社区，构建并维护 MeshROC（Mesh Radio-Optimized Communications）离线无线组网系统，兼容 Meshtastic 协议。"
    >
      <div className="mr-logo">
        <img src="/img/logo.png" alt="互联之域 MeshROC" />
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
        lead="下面这些是 MeshROC 在 Meshtastic 基础上补充的本土化差异，并与同为海外项目的 MeshCore 横向对比。完整逐条技术差异见《MeshROC 与 Meshtastic / MeshCore 全面对比》。"
      >
        <div className="mr-table-wrap">
          <table className="mr-table">
            <thead>
              <tr>
                <th>维度</th>
                <th className="mr-table__up">MeshROC（本土优化）</th>
                <th>Meshtastic</th>
                <th>MeshCore</th>
              </tr>
            </thead>
            <tbody>
              {DIFFS.map((d) => (
                <tr key={d.dim}>
                  <td>{d.dim}</td>
                  <td className="mr-table__up">{d.meshroc}</td>
                  <td>{d.mesh}</td>
                  <td>{d.meshcore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MrSection>

      <MrSection
        eyebrow="全国通用"
        title="面向全国地形气候而生"
        lead="MeshROC 的射频模板、电源策略与路由算法按国内真实地况调校，而非照搬海外旷野默认配置。换省只需切换环境模板，无需改动底层源码。"
      >
        <div className="mr-grid mr-grid--3">
          {[
            { icon: IconMountain, title: '华北山地 / 西南深山', desc: '依靠山顶中继搭建远距离通信链路，覆盖山谷与盲区。' },
            { icon: IconMountain, title: '东北林区', desc: '射频模板适配春夏密林遮挡，以及秋冬落叶后信号通透的季节变化。' },
            { icon: IconMountain, title: '南方多雨山林', desc: '潮湿环境射频配置抵抗雨水与盐雾带来的信号损耗。' },
            { icon: IconMountain, title: '东南沿海丘陵', desc: '高湿度专项参数，规避盐雾腐蚀导致的链路劣化。' },
            { icon: IconMountain, title: '西北荒漠戈壁', desc: '降低报文重传次数，节约太阳能节点电量。' },
            { icon: IconMountain, title: '青藏高原', desc: '低温低气压下调整扩频因子与前导码长度。' },
            { icon: IconMountain, title: '盆地 / 河谷', desc: '河谷峡谷独立射频模板，抑制多径反射与遮挡。' },
            { icon: IconMountain, title: '城中村 / 高楼遮挡', desc: '自动启用时隙信道避让，规避楼宇峡谷干扰。' },
            { icon: IconMountain, title: '工业区电磁复杂', desc: '依电磁环境启停时隙，规避工业设备与民用无线电干扰。' },
          ].map((l) => (
            <MrCard key={l.title} icon={l.icon} title={l.title} desc={l.desc} />
          ))}
        </div>
        <p className="mr-p" style={{ marginTop: '1.25rem' }}>
          想看逐项技术差异，请阅读 <a href="/docs/comparison">MeshROC 与 Meshtastic / MeshCore 全面对比</a>。
        </p>
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
