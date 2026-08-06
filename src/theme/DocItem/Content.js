import React from 'react';
import OriginalDocItemContent from '@theme-original/DocItem/Content';
import DocCommentSection from '@site/src/components/DocCommentSection';
import { useLocation } from '@docusaurus/router';

// 为每篇文档文章注入评论区（复用 my-forum 评论组件）。
// 用 pathname 作为 key，切换文档时重新挂载以加载对应文章评论。
export default function DocItemContent(props) {
  const location = useLocation();
  return (
    <>
      <OriginalDocItemContent {...props} />
      <DocCommentSection key={location.pathname} />
    </>
  );
}
