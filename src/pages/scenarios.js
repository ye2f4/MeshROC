import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconMountain,
  IconShield,
  IconNetwork,
  IconSatellite,
  IconUsers,
  IconThermometer,
} from '@site/src/components/mr';

const SCENES = [
  {
    icon: IconMountain,
    title: '户外徒步无信号通信',
    desc: '深山、峡谷、林区等运营商信号盲区，队伍成员之间保持文本与位置共享。',
    points: ['队友实时位置广播', '掉队自动告警', '无需任何基础设施'],
    tag: 'Walk 手持终端',
  },
  {
    icon: IconShield,
    title: '灾害应急通信',
    desc: '地震、洪水、台风导致基站瘫痪时，快速搭建临时通信网络维持指挥链路。',
    points: ['断网环境自组网', '救援队协同调度', '现场位置态势回传'],
    tag: 'Backbone + Walk',
  },
  {
    icon: IconNetwork,
    title: '城市 Mesh 网络建设',
    desc: '在城市楼宇部署固定基站，形成覆盖城区的公共 Mesh 骨干网络。',
    points: ['POE 供电 7×24 在线', '楼宇制高点中继', '接入内网与互联网'],
    tag: 'Gateway 城市基站',
  },
  {
    icon: IconSatellite,
    title: '山地远距离组网',
    desc: '利用山顶太阳能骨干节点实现跨山谷、跨区域的远距离多跳链路。',
    points: ['30dBm 大功率中继', 'NLOS 非视距优化', '太阳能长期自持'],
    tag: 'Backbone 骨干节点',
  },
  {
    icon: IconUsers,
    title: '业余无线电爱好者组网',
    desc: 'HAM 玩家搭建实验性 Mesh 网络，探索 LoRa 长距离传播与路由机制。',
    points: ['470MHz 免费频段', '完全开源可魔改', '与全球 Meshtastic 互通'],
    tag: '全系列',
  },
  {
    icon: IconThermometer,
    title: '野外传感数据采集',
    desc: '无人值守区域的环境监测、资产追踪与遥测数据长期回传。',
    points: ['ESP32-C3 超低功耗', '深度休眠不丢包', '温湿度 / 位置遥测'],
    tag: 'Sensor 传感终端',
  },
];

export default function ScenariosPage() {
  return (
    <MrPage
      title="应用场景"
      description="MeshROC 应用场景：户外徒步、灾害应急、城市 Mesh、山地远距离组网、HAM 爱好者、野外传感采集。"
    >
      <MrHeader
        eyebrow="Use Cases"
        title="应用场景"
        lead="从荒野徒步到城市应急，MeshROC 面向一切没有基础设施、或基础设施不可靠的通信需求。"
      />

      <MrSection>
        <div className="mr-grid mr-grid--3">
          {SCENES.map((s) => (
            <article key={s.title} className="mr-card">
              <div className="mr-card__icon">
                <s.icon size={22} />
              </div>
              <h3 className="mr-h3">{s.title}</h3>
              <p className="mr-card__desc">{s.desc}</p>
              <ul className="mr-card__list">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="mr-tags">
                <span className="mr-tag mr-tag--orange">推荐：{s.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </MrSection>

      <MrSection
        eyebrow="组网建议"
        eyebrowOrange
        title="一张健康网络的典型构成"
        lead="骨干负责覆盖、基站负责接入、终端负责使用，三者配合才能发挥分层路由的最大价值。"
      >
        <div className="mr-steps">
          <div className="mr-step">
            <h3 className="mr-h3">第一步 · 选定制高点</h3>
            <p className="mr-p">
              在覆盖区域内选择 1–3 个山顶或高层楼顶，部署 Backbone
              太阳能骨干节点，构成网络主干。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">第二步 · 建立接入点</h3>
            <p className="mr-p">
              在有市电与网线的位置部署 Gateway 城市基站，把 Mesh
              网络桥接到内网，便于远程监控与数据留存。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">第三步 · 分发终端</h3>
            <p className="mr-p">
              为队伍成员配发 Walk 手持终端，在无人值守点位布设 Sensor
              传感终端，完成整网闭环。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">第四步 · 调优验证</h3>
            <p className="mr-p">
              通过遥测数据观察各链路信噪比与跳数，按需调整骨干节点位置与发射功率。
            </p>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="有具体场景需求？"
        desc="到社区提出你的部署场景，与其他玩家一起讨论最优组网方案。"
        actions={[
          { label: '加入社区', to: '/community' },
          { label: '查看硬件', to: '/hardware', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
