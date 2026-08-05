import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconSun,
  IconServer,
  IconSmartphone,
  IconThermometer,
} from '@site/src/components/mr';

const PRODUCTS = [
  {
    icon: IconSun,
    name: 'MeshROC Backbone',
    cn: '山顶太阳能骨干节点',
    badge: '骨干枢纽',
    desc: '部署于山地制高点的大功率中继节点，是整张 Mesh 网络的多跳路由核心。',
    specs: [
      '大功率 30dBm LoRa 远距离中继',
      '太阳能 CN3791 自主供电，无需市电',
      '山地制高点覆盖 / 城市远距离中继',
      '多跳路由核心枢纽，承担骨干转发',
    ],
    tags: ['30dBm', 'CN3791 太阳能', '骨干路由'],
  },
  {
    icon: IconServer,
    name: 'MeshROC Gateway',
    cn: 'POE 城市基站',
    badge: '7×24 在线',
    desc: '面向城市楼宇的固定基站节点，通过有线网口把 Mesh 网络接入内网与互联网。',
    specs: [
      'ESP32-S3 + W5500 有线网口',
      'POE 供电，7×24 小时稳定运行',
      '城市楼宇固定节点部署',
      '内网数据转发与网关桥接',
    ],
    tags: ['ESP32-S3', 'W5500', 'POE 供电'],
  },
  {
    icon: IconSmartphone,
    name: 'MeshROC Walk',
    cn: '手持终端',
    badge: '主力产品',
    desc: '面向户外徒步与应急通信的单兵手持终端，实体键盘 + 高清屏幕，脱离手机独立使用。',
    specs: [
      'ESP32-S3 主控',
      '实体 7 键键盘 + PCF8574 IO 扩展',
      'ST7789 高清屏幕',
      'AHT20 温湿度 + 电池 ADC 检测',
      '户外徒步、应急通信单兵终端',
    ],
    tags: ['ESP32-S3', 'ST7789', 'PCF8574', 'AHT20'],
  },
  {
    icon: IconThermometer,
    name: 'MeshROC Sensor',
    cn: '低功耗传感终端',
    badge: '超低功耗',
    desc: '面向野外无人值守场景的传感采集节点，长时间电池供电运行。',
    specs: [
      'ESP32-C3 超低功耗主控',
      '野外环境监测与数据采集',
      '资产追踪与位置回传',
      '深度休眠 + 防丢包唤醒机制',
    ],
    tags: ['ESP32-C3', '低功耗', '环境监测'],
  },
];

export default function HardwarePage() {
  return (
    <MrPage
      title="硬件产品"
      description="MeshROC 全套自研开源硬件产品线：Backbone 骨干节点、Gateway 城市基站、Walk 手持终端、Sensor 传感终端。"
    >
      <MrHeader
        eyebrow="Hardware"
        title="MeshROC 官方硬件产品线"
        lead="四大系列全部自研设计，立创开源、星火计划入库，覆盖从山顶骨干到单兵终端的完整组网需求。"
      />

      <MrSection>
        <div className="mr-grid mr-grid--2">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="mr-card mr-product">
              <div className="mr-product__head">
                <div className="mr-card__icon" style={{ marginBottom: 0 }}>
                  <p.icon size={22} />
                </div>
                <div>
                  <h3 className="mr-product__name">
                    {p.name}
                    <span className="mr-product__cn">{p.cn}</span>
                  </h3>
                </div>
                <span className="mr-product__badge">{p.badge}</span>
              </div>
              <p className="mr-card__desc">{p.desc}</p>
              <ul className="mr-card__list">
                {p.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="mr-tags">
                {p.tags.map((tg) => (
                  <span key={tg} className="mr-tag mr-tag--cyan">
                    {tg}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </MrSection>

      <MrSection
        eyebrow="选型建议"
        eyebrowOrange
        title="该选哪一款？"
        lead="按部署场景选择节点类型，通常一张健康的网络由骨干 + 基站 + 终端共同构成。"
      >
        <div className="mr-table-wrap">
          <table className="mr-table">
            <thead>
              <tr>
                <th>型号</th>
                <th>典型场景</th>
                <th>供电方式</th>
                <th>网络角色</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backbone</td>
                <td>山顶 / 制高点长期部署</td>
                <td>太阳能自供电</td>
                <td className="mr-table__up">骨干中继</td>
              </tr>
              <tr>
                <td>Gateway</td>
                <td>城市楼宇固定接入</td>
                <td>POE 有线供电</td>
                <td className="mr-table__up">网关桥接</td>
              </tr>
              <tr>
                <td>Walk</td>
                <td>户外徒步 / 应急单兵</td>
                <td>内置电池</td>
                <td className="mr-table__yes">手持终端</td>
              </tr>
              <tr>
                <td>Sensor</td>
                <td>野外无人值守采集</td>
                <td>电池长续航</td>
                <td className="mr-table__yes">传感终端</td>
              </tr>
            </tbody>
          </table>
        </div>
      </MrSection>

      <MrSection eyebrow="开源说明" title="全部开源，可自行打样">
        <div className="mr-grid mr-grid--3">
          <div className="mr-card">
            <h3 className="mr-h3">立创开源</h3>
            <p className="mr-card__desc">
              全部硬件原理图与 PCB 已在立创开源平台公开，可直接克隆工程并打样制作。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">星火计划入库</h3>
            <p className="mr-card__desc">
              项目已入库星火计划，硬件设计经过审核，具备完整的工程文件与说明文档。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">MIT License</h3>
            <p className="mr-card__desc">
              所有硬件与固件均以 MIT 协议开源，允许自由使用、修改与商业化衍生。
            </p>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="获取硬件工程文件"
        desc="在下载中心获取 PCB 工程、3D 外壳模型与预编译固件，或先了解固件系统的能力。"
        actions={[
          { label: '前往下载中心', to: '/download' },
          { label: '固件系统', to: '/firmware', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
