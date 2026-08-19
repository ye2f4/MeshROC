import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  MrBuildCard,
  IconSun,
  IconServer,
  IconSmartphone,
  IconThermometer,
} from '@site/src/components/mr';
import { VENDORS } from '@site/src/data/thirdPartyDevices';

/* =========================================================
   MeshROC 硬件作品墙
   统一采用 Build Gallery（作品墙）卡片格式展示：
   官方自研产品线 + 社区第三方兼容设备。
   ========================================================= */

/* ---------- 官方自研产品线（作品墙卡片数据） ---------- */
const PRODUCTS = [
  {
    type: '骨干枢纽',
    typeTone: 'orange',
    badge: '官方自研',
    badgeSelf: true,
    status: 'developing',
    name: 'MeshROC Backbone',
    cn: '山顶太阳能骨干节点',
    vendor: 'MeshROC 官方',
    summary: '部署于山地制高点的大功率中继节点，是整张 Mesh 网络的多跳路由核心。',
    icon: IconSun,
    mediaTag: 'Backbone',
    specs: [
      { label: '发射功率', value: '30dBm 大功率' },
      { label: '供电方式', value: 'CN3791 太阳能自主供电' },
      { label: '网络角色', value: '骨干中继 / 多跳路由核心' },
      { label: '部署场景', value: '山地制高点 / 城市远距离中继' },
    ],
    tags: ['30dBm', 'CN3791 太阳能', '骨干路由'],
    bottom: '开发中 · 开源打样',
  },
  {
    type: '城市基站',
    typeTone: 'cyan',
    badge: '官方自研',
    badgeSelf: true,
    status: 'developing',
    name: 'MeshROC Gateway',
    cn: 'POE 城市基站',
    vendor: 'MeshROC 官方',
    summary: '面向城市楼宇的固定基站节点，通过有线网口把 Mesh 网络接入内网与互联网。',
    icon: IconServer,
    mediaTag: 'Gateway',
    specs: [
      { label: '主控', value: 'ESP32-S3 + W5500' },
      { label: '供电方式', value: 'POE 供电，7×24 稳定运行' },
      { label: '网络角色', value: '网关桥接 / 内网转发' },
      { label: '部署场景', value: '城市楼宇固定节点' },
    ],
    tags: ['ESP32-S3', 'W5500', 'POE 供电'],
    bottom: '开发中 · 开源打样',
  },
  {
    type: '手持终端',
    typeTone: 'blue',
    badge: '官方自研',
    badgeSelf: true,
    status: 'developing',
    name: 'MeshROC Walk',
    cn: '手持终端',
    vendor: 'MeshROC 官方',
    summary: '面向户外徒步与应急通信的单兵手持终端，实体键盘 + 高清屏幕，脱离手机独立使用。',
    icon: IconSmartphone,
    mediaTag: 'Walk',
    specs: [
      { label: '主控', value: 'ESP32-S3' },
      { label: '交互', value: '实体 7 键键盘 + PCF8574 IO 扩展' },
      { label: '屏幕', value: 'ST7789 高清屏幕' },
      { label: '传感', value: 'AHT20 温湿度 + 电池 ADC 检测' },
      { label: '部署场景', value: '户外徒步、应急通信单兵终端' },
    ],
    tags: ['ESP32-S3', 'ST7789', 'PCF8574', 'AHT20'],
    bottom: '主力产品 · 开发中',
  },
  {
    type: '传感终端',
    typeTone: 'green',
    badge: '官方自研',
    badgeSelf: true,
    status: 'developing',
    name: 'MeshROC Sensor',
    cn: '低功耗传感终端',
    vendor: 'MeshROC 官方',
    summary: '面向野外无人值守场景的传感采集节点，长时间电池供电运行。',
    icon: IconThermometer,
    mediaTag: 'Sensor',
    specs: [
      { label: '主控', value: 'ESP32-C3 超低功耗' },
      { label: '网络角色', value: '传感采集 / 资产追踪' },
      { label: '供电方式', value: '电池长续航' },
      { label: '特性', value: '深度休眠 + 防丢包唤醒' },
    ],
    tags: ['ESP32-C3', '低功耗', '环境监测'],
    bottom: '开发中 · 开源打样',
  },
];

/* ---------- 第三方兼容设备 → 作品墙卡片映射 ---------- */
// 根据设备名称/标签推断类型与色调，保持数据源单一（不重复手写字段）。
function typeInfo(d) {
  const name = d.name.toLowerCase();
  const tags = (d.tags || []).join(' ').toLowerCase();
  if (name.includes('gateway') || name.includes('repeater') || name.includes('中继')) {
    return { type: '网关 / 中继', tone: 'orange' };
  }
  if (tags.includes('太阳能') || name.includes('solar')) {
    return { type: '太阳能节点', tone: 'green' };
  }
  if (name.includes('watch') || name.includes('pocket') || name.includes('tag') || name.includes('tracker')) {
    return { type: '手持 / 便携', tone: 'blue' };
  }
  if (name.includes('base') || name.includes('pico') || name.includes('thinknode')) {
    return { type: '开发板 / 底座', tone: 'cyan' };
  }
  if (name.includes('panel') || name.includes('hmi') || name.includes('watch')) {
    return { type: '终端', tone: 'blue' };
  }
  return { type: '节点', tone: 'cyan' };
}

const THIRD_PARTY = VENDORS.flatMap((v) =>
  v.devices.map((d) => {
    const t = typeInfo(d);
    return {
      type: t.type,
      typeTone: t.tone,
      badge: v.name,
      status: d.status,
      name: d.name,
      vendor: v.name,
      summary: d.desc,
      img: d.img,
      tags: d.tags || [],
      fwBoard: d.fwBoard,
      bottom: d.status === 'supported' ? '可运行 MeshROC 固件' : '适配中 · 即将支持',
    };
  })
);

const ALL_BUILDS = [...PRODUCTS, ...THIRD_PARTY];

export default function HardwarePage() {
  return (
    <MrPage
      title="硬件产品"
      description="MeshROC 硬件作品墙：官方自研产品线 + 社区第三方兼容设备，统一以作品墙卡片格式展示。"
    >
      <MrHeader
        eyebrow="Hardware"
        title="MeshROC 硬件作品墙"
        lead="官方四大系列自研设计 + 社区大量第三方兼容设备，统一以作品墙卡片呈现。立创开源、星火计划入库，覆盖从山顶骨干到单兵终端的完整组网需求。"
      />

      <MrSection eyebrow="全部硬件" title="硬件作品墙">
        <div className="mr-grid mr-grid--3 mr-buildwall">
          {ALL_BUILDS.map((b, i) => (
            <MrBuildCard key={`${b.name}-${i}`} {...b} />
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
            <h3 className="mr-h3">开源硬件 · GPL-3.0 固件</h3>
            <p className="mr-card__desc">
              硬件设计以开源硬件协议在立创开源发布、星火计划入库，可自行打样；固件构建于 Meshtastic 之上，遵循 GPL-3.0 协议。
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
