import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconDownload,
  IconCpu,
  IconBox,
  IconFileText,
  IconCode,
  IconGithub,
} from '@site/src/components/mr';

const GITHUB = 'https://github.com/MeshROC';

const GROUPS = [
  {
    title: '固件下载',
    eyebrow: 'Firmware',
    icon: IconCpu,
    items: [
      {
        name: 'MeshROC Walk 固件',
        meta: 'ESP32-S3 · 手持终端 · 预编译 bin',
        action: '获取',
        href: `${GITHUB}`,
      },
      {
        name: 'MeshROC Backbone 固件',
        meta: 'ESP32-S3 · 太阳能骨干节点 · 预编译 bin',
        action: '获取',
        href: `${GITHUB}`,
      },
      {
        name: 'MeshROC Gateway 固件',
        meta: 'ESP32-S3 + W5500 · POE 城市基站 · 预编译 bin',
        action: '获取',
        href: `${GITHUB}`,
      },
      {
        name: 'MeshROC Sensor 固件',
        meta: 'ESP32-C3 · 低功耗传感终端 · 预编译 bin',
        action: '获取',
        href: `${GITHUB}`,
      },
    ],
  },
  {
    title: 'PCB 工程文件',
    eyebrow: 'Hardware',
    icon: IconBox,
    items: [
      {
        name: '全系列原理图与 PCB 工程',
        meta: '立创 EDA 工程 · 星火计划入库 · 可直接克隆打样',
        action: '立创开源',
        href: 'https://oshwhub.com/',
      },
      {
        name: 'BOM 物料清单',
        meta: '四款硬件完整元器件清单与选型说明',
        action: '查看',
        href: `${GITHUB}`,
      },
    ],
  },
  {
    title: '3D 外壳模型',
    eyebrow: '3D Model',
    icon: IconBox,
    items: [
      {
        name: 'Walk 手持终端外壳',
        meta: 'STL / STEP · 适配 3D 打印',
        action: '下载',
        href: `${GITHUB}`,
      },
      {
        name: 'Backbone 户外防水外壳',
        meta: 'STL / STEP · 含太阳能板支架',
        action: '下载',
        href: `${GITHUB}`,
      },
    ],
  },
  {
    title: '使用手册',
    eyebrow: 'Manual',
    icon: IconFileText,
    items: [
      {
        name: '快速上手指南',
        meta: '从刷写固件到建立第一条链路',
        action: '阅读',
        to: '/docs-center',
      },
      {
        name: '组网部署手册',
        meta: '骨干 / 基站 / 终端的完整部署流程',
        action: '阅读',
        to: '/docs-center',
      },
    ],
  },
  {
    title: '源码仓库',
    eyebrow: 'Source',
    icon: IconCode,
    items: [
      {
        name: 'MeshROC 固件源码',
        meta: 'MIT License · 欢迎 PR 与 Issue',
        action: 'GitHub',
        href: GITHUB,
      },
      {
        name: 'MeshROC 官网源码',
        meta: 'Docusaurus 站点源码',
        action: 'GitHub',
        href: GITHUB,
      },
    ],
  },
];

function Row({ it }) {
  const isExternal = Boolean(it.href);
  return (
    <div className="mr-dl__row">
      <div className="mr-dl__icon">
        <IconDownload size={18} />
      </div>
      <div className="mr-dl__main">
        <p className="mr-dl__name">{it.name}</p>
        <p className="mr-dl__meta">{it.meta}</p>
      </div>
      <a
        className="mr-dl__action"
        href={isExternal ? it.href : it.to}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {it.action}
      </a>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <MrPage
      title="下载中心"
      description="MeshROC 下载中心：固件、PCB 工程文件、3D 外壳模型、使用手册与源码仓库。"
    >
      <MrHeader
        eyebrow="Download"
        title="下载中心"
        lead="固件、硬件工程、外壳模型与文档一站获取。全部内容以 MIT 协议开源。"
      />

      {GROUPS.map((g) => (
        <MrSection key={g.title} eyebrow={g.eyebrow} title={g.title}>
          <div className="mr-dl">
            {g.items.map((it) => (
              <Row key={it.name} it={it} />
            ))}
          </div>
        </MrSection>
      ))}

      <MrSection eyebrow="刷写提示" eyebrowOrange title="刷写前请注意">
        <div className="mr-grid mr-grid--3">
          <div className="mr-card">
            <h3 className="mr-h3">选对型号</h3>
            <p className="mr-card__desc">
              Walk / Backbone / Gateway 均为 ESP32-S3，Sensor 为 ESP32-C3，刷错芯片架构会导致无法启动。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">使用 Chrome 内核浏览器</h3>
            <p className="mr-card__desc">
              网页刷写依赖 WebSerial，请使用 Chrome / Edge 等 Chromium 内核浏览器，且需 HTTPS 环境。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">首次刷写建议全擦除</h3>
            <p className="mr-card__desc">
              从其他固件迁移到 MeshROC 时，建议先执行全片擦除再刷写，避免残留配置导致异常。
            </p>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="遇到问题？"
        desc="查阅帮助中心的详细说明，或到社区提问，也欢迎直接在 GitHub 提 Issue。"
        actions={[
          { label: '帮助中心', to: '/docs-center' },
          { label: 'GitHub', href: GITHUB, variant: 'mr-btn--ghost' },
          { label: '联系我们', to: '/contact', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
