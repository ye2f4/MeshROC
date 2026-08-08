import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

// 设备 SDK 使用 Web Serial，仅能在浏览器环境运行；用 BrowserOnly + 懒加载避免 SSG 报错。
const MeshROCClientApp = React.lazy(() => import('@/components/client/MeshROCClientApp'));

export default function ClientPage() {
  return (
    <Layout
      title="网络客户端 · MeshROC"
      description="浏览器内 MeshROC 设备客户端：连接、配置射频、管理节点、收发消息，兼容 Meshtastic 固件。"
    >
      <BrowserOnly
        fallback={
          <div className="container">
            <p style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
              加载中…
            </p>
          </div>
        }
      >
        {() => (
          <React.Suspense
            fallback={
              <div className="container">
                <p style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                  加载中…
                </p>
              </div>
            }
          >
            <MeshROCClientApp />
          </React.Suspense>
        )}
      </BrowserOnly>
    </Layout>
  );
}
