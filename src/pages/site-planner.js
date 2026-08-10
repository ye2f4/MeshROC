import React, { useEffect, useRef, useState } from 'react';
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
const IconExternalLink = (p) => <Svg {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Svg>;

// 站点规划器为本地构建产物，部署在 static/planner/ 下。
// 此处直接将构建产物挂载进当前页面 DOM（无 iframe、无外部域引用）：
// 读取 /planner/index.html，注入样式与入口脚本，由 Vue 应用挂载到 #app。
//
// 源码在 e:/meshtastic-site-planner（已全面改为 MeshROC 品牌），其 vite.config.ts
// 的构建基址已固定为绝对路径 '/planner/'，因此 index.html 与运行时按
// import.meta.env.BASE_URL 加载的资源（colormaps 色阶图、图标）在本页（/site-planner）
// 内联挂载时也能正确解析——无需再对构建产物打补丁。下面对 './' 的改写仅作兜底。
// 注意：不能把构建放到 static/site-planner/，以免与本页路由 /site-planner 撞车。
const PLANNER_INDEX = '/planner/index.html';

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

export default function SitePlannerPage() {
  const mountRef = useRef(null);
  const didInit = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [mountErr, setMountErr] = useState('');

  // 把 /planner 构建产物挂载进当前页面 DOM（无 iframe、无外部域）
  useEffect(() => {
    if (didInit.current) return; // 防止 StrictMode 双调用导致重复挂载两个 #app
    didInit.current = true;
    const mount = mountRef.current;
    if (!mount) return;
    // 去重：移除可能残留的挂载点 / 入口脚本
    const prevApp = mount.querySelector('#app');
    if (prevApp) prevApp.remove();
    const prevScript = document.querySelector('script[data-planner-entry]');
    if (prevScript) prevScript.remove();

    (async () => {
      try {
        const res = await fetch(PLANNER_INDEX, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // 挂载点
        const app = document.createElement('div');
        app.id = 'app';
        app.style.height = '100%';
        mount.appendChild(app);

        // 注入样式表（改写相对路径为 /planner/）
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
          const href = (l.getAttribute('href') || '').replace(/^\.\//, '/planner/');
          if (!href || document.querySelector(`link[href="${href}"]`)) return;
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          document.head.appendChild(link);
        });

        // 注入入口模块脚本
        const entry = doc.querySelector('script[type="module"]');
        const src = entry ? (entry.getAttribute('src') || '').replace(/^\.\//, '/planner/') : '';
        if (src && !document.querySelector(`script[data-planner-entry="${src}"]`)) {
          const s = document.createElement('script');
          s.type = 'module';
          s.src = src;
          s.setAttribute('data-planner-entry', src);
          document.body.appendChild(s);
        }
        setMounted(true);
      } catch (e) {
        setMountErr('规划器加载失败，请刷新重试。');
      }
    })();
  }, []);

  return (
    <Layout
      title={t({ id: 'sitePlanner.metaTitle', message: '站点规划器 | MeshROC' })}
      description={t({ id: 'sitePlanner.metaDesc', message: '使用 ITM / Longley-Rice 模型在浏览器本地预测 MeshROC 无线电覆盖范围的规划工具。' })}
    >
      <main className="container" style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
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

        <div
          ref={mountRef}
          className="site-planner-mount"
          style={{
            width: '100%',
            height: 'min(82vh, 880px)',
            borderRadius: 'var(--radius)',
            border: '1px solid hsl(var(--border))',
            overflow: 'hidden',
            background: '#0f1017',
            position: 'relative',
          }}
        >
          {!mounted && !mountErr && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa', fontSize: '0.9rem' }}>
              正在加载规划器…
            </div>
          )}
          {mountErr && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f88', fontSize: '0.9rem' }}>
              {mountErr}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.82rem', color: 'hsl(var(--muted-foreground))' }}>
          {t({ id: 'sitePlanner.note', message: '覆盖预测为理论模型估算，实际通信受环境、天线与设备影响。' })}
        </p>
      </main>
    </Layout>
  );
}
