import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import { useLocation } from '@docusaurus/router';

// 全屏应用页（刷写器、站点规划器）隐藏页脚，保持沉浸体验
const HIDDEN_ROUTES = ['/flash', '/site-planner'];

export default function Footer(props) {
  const { pathname } = useLocation();
  const hidden = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + '/'),
  );
  if (hidden) return null;
  return <OriginalFooter {...props} />;
}
