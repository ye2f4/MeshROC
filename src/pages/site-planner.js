import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';

// Docusaurus 3.x 无 useTranslate hook，用 translate 函数式 API 包装成一致的 t()
const t = (...args) => {
  const [opts, values] = args;
  if (typeof opts === 'string') return translate({ id: opts }, values);
  const vals = values ?? opts?.values ?? (opts?.count !== undefined ? { count: opts.count } : undefined);
  return translate(opts, vals);
};

/* ---------- 内联图标（复刻 lucide 形状，避免引入缺失依赖） ---------- */
const Svg = ({ children, className = '', size = 24, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);
const IconRadio = (p) => <Svg {...p}><circle cx="12" cy="12" r="2" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14M19.07 4.93a10 10 0 0 1 0 14.14M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48" /></Svg>;
const IconMap = (p) => <Svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></Svg>;
const IconX = (p) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>;
const IconExternalLink = (p) => <Svg {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Svg>;

// 站点规划器为本地构建产物，部署在 static/site-planner/ 下
const PLANNER_URL = '/site-planner/index.html';

// 卡片式功能说明
const FEATURES = [
  {
    icon: IconMap,
    title: '地图选址',
    desc: '拖动绿色图钉或用「在地图上放置」设定发射机，支持吸附到附近最高点。',
  },
  {
    icon: IconRadio,
    title: '本地仿真',
    desc: '基于 ITM / Longley-Rice 模型在浏览器内预测覆盖，无需上传任何数据。',
  },
  {
    icon: IconExternalLink,
    title: '导出与分享',
    desc: '一键导出 GeoJSON 覆盖图层，或生成可分享的配置链接。',
  },
];

const PlannerDialog = ({ onClose }) => (
    <div
      className="site-planner-dialog-mask"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}
    >
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'relative',
        width: 'min(76rem, 100%)',
        height: 'min(90vh, 940px)',
        maxHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius)',
        border: '1px solid hsl(var(--border))',
        background: 'hsl(var(--popover))',
        color: 'hsl(var(--popover-foreground))',
        overflow: 'hidden',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.25rem', borderBottom: '1px solid hsl(var(--border))' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{t({ id: 'sitePlanner.dialog.title', message: 'MeshROC 站点规划器' })}</h2>
          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.2rem' }}>
            {t({ id: 'sitePlanner.dialog.sub', message: '设置发射机与无线电参数，运行仿真即可在地图上看到覆盖预测' })}
          </div>
        </div>
        <button onClick={onClose} aria-label={t({ id: 'sitePlanner.dialog.close', message: '关闭' })} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', padding: 4 }}>
          <IconX size={22} />
        </button>
      </div>

      <iframe
        src={PLANNER_URL}
        title="MeshROC Site Planner"
        loading="lazy"
        allow="bluetooth; usb; geolocation"
        style={{ flex: 1, width: '100%', border: 'none', background: '#0f1017' }}
      />
    </div>
  </div>
);

export default function SitePlannerPage() {
  const [open, setOpen] = useState(false);

  // 锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <Layout
      title={t({ id: 'sitePlanner.metaTitle', message: '站点规划器 | MeshROC' })}
      description={t({ id: 'sitePlanner.metaDesc', message: '使用 ITM / Longley-Rice 模型在浏览器本地预测 MeshROC 无线电覆盖范围的规划工具。' })}
    >
      <main className="container" style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'hsl(var(--btn-primary))', fontWeight: 600, fontSize: '0.85rem',
            background: 'hsl(var(--btn-primary) / 0.12)', padding: '0.35rem 0.85rem', borderRadius: '999px',
          }}>
            <IconRadio size={16} /> 工具
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '1rem 0 0.6rem', lineHeight: 1.15 }}>
            {t({ id: 'sitePlanner.title', message: 'MeshROC 站点规划器' })}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'hsl(var(--muted-foreground))', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.6 }}>
            {t({ id: 'sitePlanner.intro', message: '基于 ITM / Longley-Rice 传播模型，在浏览器本地预测无线电覆盖范围。所有地形与计算都在你的设备上完成，不上传任何数据。' })}
          </p>
          <div style={{ marginTop: '1.75rem' }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                background: 'hsl(var(--btn-primary))', color: 'hsl(var(--btn-primary-foreground))',
                border: 'none', borderRadius: 'var(--radius)', padding: '0.8rem 1.6rem',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 8px 24px hsl(var(--btn-primary) / 0.35)',
              }}
            >
              <IconMap size={18} /> {t({ id: 'sitePlanner.open', message: '打开规划器' })}
            </button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {FEATURES.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.title} style={{
                borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))', padding: '1.5rem',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 12, marginBottom: '1rem',
                  background: 'hsl(var(--btn-primary) / 0.12)', color: 'hsl(var(--btn-primary))',
                }}>
                  <FIcon size={22} />
                </span>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </section>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.82rem', color: 'hsl(var(--muted-foreground))' }}>
          {t({ id: 'sitePlanner.note', message: '覆盖预测为理论模型估算，实际通信受环境、天线与设备影响。' })}
        </p>
      </main>

      {open && <PlannerDialog onClose={() => setOpen(false)} />}
    </Layout>
  );
}
