// @ts-check
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const require = createRequire(import.meta.url);
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
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: false,
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          // 转载自 MeshCN 社区的文章，按日期倒序展示
          postsPerPage: 12,
          blogTitle: '博客 · MeshCN 转载',
          blogDescription: 'MeshCN（Meshtastic 中国社区）精选文章转载，涵盖教程、评测、公告与案例。',
          showReadingTime: true,
        },
        sitemap: false,
        // 仅保留 pages（/off-grid 页面作为主页）
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
          include: ['**/*.{js,jsx,ts,tsx}'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    // 说明：曾用 @docusaurus/plugin-client-redirects 把 /docs 重定向到 /docs-hub。
    // 该插件只在生产构建生效（dev 下 /docs 仍 404），且本地常缺该依赖导致 dev 起不来。
    // 现已改为提供真实的文档首页 docs/docs-home.mdx（slug: /）→ /docs 直接可访问，
    // 故移除该插件；若要恢复重定向，注意 from 不能与已存在路由冲突。
    // 注入 Tailwind / PostCSS 与 `@/` 路径别名（复用 meshtastic 布局体系所需）
    function meshrocBuildPlugin() {
      return {
        name: 'meshroc-build-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(
            require('tailwindcss'),
            require('autoprefixer')
          );
          return postcssOptions;
        },
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@': resolve(__dirname, './src'),
              },
            },
          };
        },
      };
    },
    // 本地全文搜索（复用 my-forum 同款 @easyops-cn/docusaurus-search-local）
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['zh', 'en'],
        highlightSearchTermsOnTargetPage: true,
      },
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
        // 品牌区改用 logotext.webp（图标+文字组合图），不再单独显示 title 文字
        title: undefined,
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
