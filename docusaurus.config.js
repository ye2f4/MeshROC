// @ts-check
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteData = JSON.parse(
  readFileSync(join(__dirname, 'src/data/siteData.json'), 'utf-8')
);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: siteData.siteTitle,
  tagline: siteData.branding.tagline,
  favicon: siteData.branding.favicon,

  url: siteData.siteUrl,
  baseUrl: siteData.basePath || '/',

  organizationName: siteData.organizationName,
  projectName: 'MeshROC',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        sitemap: false,
        // 仅保留 pages（/off-grid 页面作为主页）
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
          include: ['**/*.{js,jsx,ts,tsx}'],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: siteData.navbarConfig.hideOnScroll,
        title: siteData.siteTitle,
        logo: siteData.branding.logoSrc
          ? { alt: siteData.branding.logoAlt, src: siteData.branding.logoSrc }
          : undefined,
        items: siteData.navbarConfig.items,
      },
      footer: {
        style: siteData.footerConfig.style,
        links: siteData.footerConfig.links,
        copyright: [
          siteData.siteTitle + ' © ' + new Date().getFullYear(),
          siteData.footerConfig.beian
            ? `<a class="footer__beian-link" href="${siteData.footerConfig.beian.href}" target="_blank" rel="noopener noreferrer">${siteData.footerConfig.beian.label}</a>`
            : '',
        ]
          .filter(Boolean)
          .join('<br/>'),
      },
    }),
};

export default config;
