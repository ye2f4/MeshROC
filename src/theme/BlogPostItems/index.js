import React from 'react';
import Link from '@docusaurus/Link';

// 由标题生成稳定的色相，让每张卡片封面有区分度又都在品牌色域内
function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 360;
  }
  return h;
}

function formatDate(date) {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return '';
  }
}

// 覆盖默认博客列表渲染：以「封面 + 标题 + 作者 + 简介」圆角卡片网格呈现
export default function BlogPostItems({items}) {
  return (
    <div className="blog-card-grid">
      {items.map(({content}) => {
        const m = content.metadata || {};
        const title = m.title || '';
        const description = m.description || '';
        const permalink = m.permalink || '#';
        const authors = m.authors || [];
        const authorName =
          authors.length > 0
            ? authors
                .map((a) => a.name)
                .filter(Boolean)
                .join('、')
            : 'MeshCN 转载';
        const tags = m.tags || [];
        const coverTag = (tags[0] && tags[0].label) || 'MeshCN';
        const hue = hashHue(title || permalink);
        const gradient = `linear-gradient(135deg, hsl(${hue} 62% 42%), hsl(${(hue + 38) % 360} 70% 56%))`;
        return (
          <article className="blog-card" key={permalink}>
            <Link
              to={permalink}
              className="blog-card__cover"
              style={{background: gradient}}>
              <span className="blog-card__cover-tag">{coverTag}</span>
            </Link>
            <div className="blog-card__body">
              <Link to={permalink} className="blog-card__title" title={title}>
                {title}
              </Link>
              <p className="blog-card__excerpt">{description}</p>
              <div className="blog-card__meta">
                <span className="blog-card__author">{authorName}</span>
                <span className="blog-card__date">{formatDate(m.date)}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
