import React from 'react';
import Link from '@docusaurus/Link';
import {
  MrPage,
  MrHeader,
  MrSection,
  IconFileText,
  IconLayers,
} from '@site/src/components/mr';

export default function DocsHubPage() {
  return (
    <MrPage
      title="文档中心"
      description="MeshROC 文档中心：浏览文章与远景规划。"
    >
      <MrHeader
        eyebrow="Docs"
        title="文档中心"
        lead="把资料分成两类：已经成稿的文章，与正在酝酿的远景规划。"
      />

      <MrSection eyebrow="Categories" title="浏览文档">
        <div className="mr-grid mr-grid--2">
          <Link to="/docs-hub" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconFileText size={22} />
            </div>
            <h3 className="mr-h3">文章</h3>
            <p className="mr-card__desc">
              已整理的技术文档与使用指南：快速上手、组网、固件刷写、硬件与配置等。
            </p>
            <span className="mr-card__more">进入文章 →</span>
          </Link>

          <Link to="/vision" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconLayers size={22} />
            </div>
            <h3 className="mr-h3">远景规划</h3>
            <p className="mr-card__desc">
              发展路线、里程碑与长期愿景，内容持续补充中。
            </p>
            <span className="mr-card__more">查看规划 →</span>
          </Link>
        </div>
      </MrSection>
    </MrPage>
  );
}
