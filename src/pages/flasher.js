import React from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';

// Docusaurus 3.x 无 useTranslate hook，用 translate 函数式 API 包装成一致的 t()
const t = (...args) => {
  const [opts, values] = args;
  if (typeof opts === 'string') return translate({ id: opts }, values);
  const vals = values ?? opts?.values ?? (opts?.count !== undefined ? { count: opts.count } : undefined);
  return translate(opts, vals);
};

// 固件刷写器为本地构建产物，部署在 static/flasher/ 下
const FLASHER_URL = '/flasher/index.html';

export default function FlasherPage() {
  return (
    <Layout
      title={t({ id: 'flasher.metaTitle', message: '固件刷写器 | MeshROC' })}
      description={t({ id: 'flasher.metaDesc', message: 'MeshROC 固件刷写器：连接设备、选择固件、一键烧录，兼容 Meshtastic 协议。' })}
    >
      <div style={{ height: 'calc(100vh - var(--ifm-navbar-height))', marginTop: 'var(--ifm-navbar-height)' }}>
        <iframe
          src={FLASHER_URL}
          title="MeshROC 固件刷写器"
          loading="lazy"
          allow="usb; bluetooth; serial"
          style={{ width: '100%', height: '100%', border: 'none', background: '#0f1017', display: 'block' }}
        />
      </div>
    </Layout>
  );
}
