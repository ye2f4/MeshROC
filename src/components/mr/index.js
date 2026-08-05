import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

/* =========================================================
   MeshROC 官网共用组件与图标
   注意：不涉及 navbar / footer，Layout 由 Docusaurus 官方渲染
   ========================================================= */

/* ---------- 内联 lucide 风格图标 ---------- */
const Svg = ({ children, size = 24, className = '', ...rest }) => (
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

export const IconRadio = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2" />
    <path d="M4.93 19.07a10 10 0 0 1 0-14.14M19.07 4.93a10 10 0 0 1 0 14.14M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48" />
  </Svg>
);
export const IconMountain = (p) => (
  <Svg {...p}>
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </Svg>
);
export const IconCpu = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </Svg>
);
export const IconSun = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Svg>
);
export const IconNetwork = (p) => (
  <Svg {...p}>
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8" />
  </Svg>
);
export const IconServer = (p) => (
  <Svg {...p}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <path d="M6 6h.01M6 18h.01" />
  </Svg>
);
export const IconSmartphone = (p) => (
  <Svg {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
  </Svg>
);
export const IconThermometer = (p) => (
  <Svg {...p}>
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </Svg>
);
export const IconBattery = (p) => (
  <Svg {...p}>
    <rect x="2" y="7" width="16" height="10" rx="2" />
    <path d="M22 11v2" />
    <path d="M6 11v2M10 11v2" />
  </Svg>
);
export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </Svg>
);
export const IconRoute = (p) => (
  <Svg {...p}>
    <circle cx="6" cy="19" r="3" />
    <circle cx="18" cy="5" r="3" />
    <path d="M9 19h5a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h5" />
  </Svg>
);
export const IconZap = (p) => (
  <Svg {...p}>
    <path d="M4 14h7l-1 8 10-12h-7l1-8z" />
  </Svg>
);
export const IconDownload = (p) => (
  <Svg {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);
export const IconFileText = (p) => (
  <Svg {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </Svg>
);
export const IconUsers = (p) => (
  <Svg {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
export const IconGithub = (p) => (
  <Svg {...p}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </Svg>
);
export const IconArrowRight = (p) => (
  <Svg {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);
export const IconBox = (p) => (
  <Svg {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Svg>
);
export const IconLayers = (p) => (
  <Svg {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </Svg>
);
export const IconSatellite = (p) => (
  <Svg {...p}>
    <path d="M13 7 9 3 5 7l4 4" />
    <path d="m17 11 4 4-4 4-4-4" />
    <path d="m8 12 4 4" />
    <path d="m16 8-4-4" />
    <path d="M9 21a6 6 0 0 0-6-6" />
  </Svg>
);
export const IconCode = (p) => (
  <Svg {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </Svg>
);
export const IconHelp = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </Svg>
);

/* ---------- 页面外壳 ---------- */
export function MrPage({ title, description, children }) {
  return (
    <Layout title={title} description={description}>
      <div className="mr-page">
        <div className="mr-wrap">{children}</div>
      </div>
    </Layout>
  );
}

/* ---------- 页头 ---------- */
export function MrHeader({ eyebrow, title, lead, center = true }) {
  return (
    <header className={`mr-section__head${center ? ' mr-section__head--center' : ''}`}>
      {eyebrow && <div className="mr-eyebrow">{eyebrow}</div>}
      <h1 className="mr-h2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
        {title}
      </h1>
      {lead && <p className="mr-lead">{lead}</p>}
    </header>
  );
}

/* ---------- 区块 ---------- */
export function MrSection({ eyebrow, eyebrowOrange, title, lead, center = false, children }) {
  return (
    <section className="mr-section">
      {(eyebrow || title || lead) && (
        <div className={`mr-section__head${center ? ' mr-section__head--center' : ''}`}>
          {eyebrow && (
            <div className={`mr-eyebrow${eyebrowOrange ? ' mr-eyebrow--orange' : ''}`}>{eyebrow}</div>
          )}
          {title && <h2 className="mr-h2">{title}</h2>}
          {lead && <p className="mr-lead">{lead}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------- 图标卡片 ---------- */
export function MrCard({ icon: Icon, orange, title, desc, list, tags }) {
  return (
    <article className="mr-card">
      {Icon && (
        <div className={`mr-card__icon${orange ? ' mr-card__icon--orange' : ''}`}>
          <Icon size={22} />
        </div>
      )}
      <h3 className="mr-h3">{title}</h3>
      {desc && <p className="mr-card__desc">{desc}</p>}
      {list && (
        <ul className="mr-card__list">
          {list.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
      {tags && (
        <div className="mr-tags">
          {tags.map((tg) => (
            <span key={tg} className="mr-tag mr-tag--cyan">
              {tg}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/* ---------- 底部 CTA ---------- */
export function MrCTA({ title, desc, actions = [] }) {
  return (
    <section className="mr-cta">
      <h2 className="mr-cta__title">{title}</h2>
      {desc && <p className="mr-cta__desc">{desc}</p>}
      <div className="mr-cta__actions">
        {actions.map((a) =>
          a.href ? (
            <a
              key={a.label}
              className={`mr-btn ${a.variant || 'mr-btn--primary'}`}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {a.label}
            </a>
          ) : (
            <Link key={a.label} className={`mr-btn ${a.variant || 'mr-btn--primary'}`} to={a.to}>
              {a.label}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
