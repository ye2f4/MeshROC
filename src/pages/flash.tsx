import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import MeshROCFlasher from '@/components/flasher/MeshROCFlasher';

export default function FlashPage(): JSX.Element {
  return (
    <Layout title="固件刷写器" description="MeshROC 浏览器内固件刷写工具">
      <main className="mr-page">
        <BrowserOnly fallback={<div className="mr-loading">正在加载刷写器…</div>}>
          {() => <MeshROCFlasher />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
