import React from 'react';
import { MrPage, MrHeader, MrSection } from '@site/src/components/mr';

export default function VisionPage() {
  return (
    <MrPage
      title="远景规划"
      description="MeshROC 远景规划：发展路线、里程碑与长期愿景。"
    >
      <MrHeader
        eyebrow="Roadmap"
        title="远景规划"
        lead="本页面用于规划 MeshROC 的发展路线与里程碑，内容整理中，敬请期待后续更新。"
      />

      <MrSection eyebrow="Coming Soon" title="内容整理中">
        <p className="mr-p">
          这里是「远景规划」的占位页面。你可以在 <code>src/pages/vision.js</code>
          中直接补充内容，或将其改造为文档式的长期规划清单。后续可在此列出版本路线、
          关键特性、社区目标等。
        </p>
      </MrSection>
    </MrPage>
  );
}
