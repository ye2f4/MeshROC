import React from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';

// 离网通信首页（原 /off-grid 页面，提升为站点主页）
export default function OffGridHome() {
  const t = (...a) => {
    const [o, v] = a;
    if (typeof o === 'string') return translate({ id: o }, v);
    const vals = v ?? o?.values ?? (o?.count !== undefined ? { count: o.count } : undefined);
    return translate(o, vals);
  };

  // 内联 SVG 图标组件
  const Icon = ({ path, size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );

  const ICONS = {
    signal: <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />,
    network: (
      <>
        <rect x="9" y="2" width="6" height="6" rx="1" />
        <rect x="2" y="16" width="6" height="6" rx="1" />
        <rect x="16" y="16" width="6" height="6" rx="1" />
        <path d="M12 8v4M12 12H5v4M12 12h7v4" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    battery: (
      <>
        <rect x="2" y="7" width="16" height="10" rx="2" />
        <path d="M22 11v2" />
      </>
    ),
    node: <path d="M5 12h14M12 5v14M5 12a7 7 0 0 0 14 0 7 7 0 0 0-14 0" />,
    radio: (
      <>
        <path d="M4.9 4.9a2 2 0 0 0 0 2.8l12.4 12.4a2 2 0 0 0 2.8 0" />
        <path d="M9 9l6 6" />
        <path d="M2 12c4-4 8-4 12 0M10 14c1.5-1.5 3.5-1.5 5 0" />
      </>
    ),
    compass: <path d="m16.24 7.76-1.7 6.05-6.05 1.7 1.7-6.05 6.05-1.7zM12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />,
    book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  };

  const features = [
    {
      icon: ICONS.signal,
      title: t({ id: 'offgrid.f1.title', message: '去中心化中继' }),
      desc: t({ id: 'offgrid.f1.desc', message: '无需基站与互联网，节点之间自动组网、自动中继，信号盲区也能互通消息。' }),
      tags: ['Meshtastic', 'LoRa', '自组网'],
    },
    {
      icon: ICONS.network,
      title: t({ id: 'offgrid.f2.title', message: '离线消息通道' }),
      desc: t({ id: 'offgrid.f2.desc', message: '断网环境下保持通信能力，文字、位置、传感器数据照常收发，关键时刻不掉链子。' }),
      tags: ['加密通道', '长续航'],
    },
    {
      icon: ICONS.shield,
      title: t({ id: 'offgrid.f3.title', message: '端到端加密' }),
      desc: t({ id: 'offgrid.f3.desc', message: '默认启用 AES-128 加密，通信内容仅限网内成员可读，隐私不依赖中心服务器。' }),
      tags: ['AES-128', '零信任'],
    },
    {
      icon: ICONS.battery,
      title: t({ id: 'offgrid.f4.title', message: '超低功耗' }),
      desc: t({ id: 'offgrid.f4.desc', message: '基于 LoRa 的极低发射功耗，一节电池可支撑数天到数周，适合野外与应急场景。' }),
      tags: ['节电', '野外'],
    },
    {
      icon: ICONS.node,
      title: t({ id: 'offgrid.f5.title', message: '弹性拓扑' }),
      desc: t({ id: 'offgrid.f5.desc', message: '任意节点可随时加入或离开，网络自愈、无需配置，规模从两人到上千节点皆宜。' }),
      tags: ['自愈', '即插即用'],
    },
    {
      icon: ICONS.radio,
      title: t({ id: 'offgrid.f6.title', message: '硬件开放' }),
      desc: t({ id: 'offgrid.f6.desc', message: '兼容 ESP32 / nRF 等常见开发板，固件开源，固件、协议、原理图全部可查可改。' }),
      tags: ['开源', 'ESP32'],
    },
  ];

  const scenarios = [
    {
      icon: ICONS.compass,
      title: t({ id: 'offgrid.s1.title', message: '户外与救援' }),
      desc: t({ id: 'offgrid.s1.desc', message: '徒步、登山、灾备现场，队员之间保持位置共享与消息互通，不依赖手机信号。' }),
    },
    {
      icon: ICONS.book,
      title: t({ id: 'offgrid.s2.title', message: '学习与实验' }),
      desc: t({ id: 'offgrid.s2.desc', message: '从一块开发板开始，理解LoRa、Mesh网络与低功耗通信的真实运作，动手即懂。' }),
    },
    {
      icon: ICONS.network,
      title: t({ id: 'offgrid.s3.title', message: '社区与活动' }),
      desc: t({ id: 'offgrid.s3.desc', message: '线下聚会、展会、临时营地，快速搭建一张只属于在场人员的私有通信网。' }),
    },
  ];

  return (
    <Layout
      title={t({ id: 'offgrid.meta.title', message: '离网通信 · MeshROC' })}
      description={t({ id: 'offgrid.meta.desc', message: '基于 Meshtastic 的去中心化、离线、加密自组网通信实验场。' })}
    >
      <main className="off-grid">
        <div className="off-grid__wrap">
          <section className="off-grid__hero">
            <span className="off-grid__badge">
              <Icon path={ICONS.signal} size={14} />
              {t({ id: 'offgrid.badge', message: 'OFF-GRID · 离网通信' })}
            </span>
            <h1 className="off-grid__title">
              {t({ id: 'offgrid.hero.title', message: '当网络消失，通信不该消失' })}
            </h1>
            <p className="off-grid__subtitle">
              {t({ id: 'offgrid.hero.subtitle', message: 'MeshROC 是一个基于 Meshtastic 的离网通信实验场：去中心化、离线可用、端到端加密。把消息交还给网络本身，而不是某一台服务器。' })}
            </p>
          </section>

          <section className="off-grid__grid">
            {features.map((f, i) => (
              <article
                key={i}
                className={
                  'off-grid__card' +
                  (f.tags.length === 0 && i === features.length - 1 ? ' off-grid__card--wide' : '')
                }
              >
                <div className="off-grid__card-icon">
                  <Icon path={f.icon} />
                </div>
                <h3 className="off-grid__card-title">{f.title}</h3>
                <p className="off-grid__card-desc">{f.desc}</p>
                <div className="off-grid__card-tags">
                  {f.tags.map((tag, j) => (
                    <span key={j} className="off-grid__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="off-grid__grid" style={{ marginTop: '1.25rem' }}>
            {scenarios.map((s, i) => (
              <article key={i} className="off-grid__card">
                <div className="off-grid__card-icon">
                  <Icon path={s.icon} />
                </div>
                <h3 className="off-grid__card-title">{s.title}</h3>
                <p className="off-grid__card-desc">{s.desc}</p>
              </article>
            ))}
          </section>

          <section className="off-grid__cta">
            <h2 className="off-grid__cta-title">
              {t({ id: 'offgrid.cta.title', message: '从一块开发板开始' })}
            </h2>
            <p className="off-grid__cta-desc">
              {t({ id: 'offgrid.cta.desc', message: '查阅 Meshtastic 文档，选一块 ESP32 + LoRa 板子，刷上开源固件，你的第一张离网 mesh 网络就上线了。' })}
            </p>
            <a
              className="off-grid__btn"
              href="https://meshtastic.org/docs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon path={ICONS.book} size={18} />
              {t({ id: 'offgrid.cta.btn', message: '阅读 Meshtastic 文档' })}
            </a>
          </section>

          <p className="off-grid__note">
            {t({ id: 'offgrid.note', message: 'MeshROC · 离网通信实验场 · 基于 Meshtastic 开源项目构建' })}
          </p>
        </div>
      </main>
    </Layout>
  );
}
