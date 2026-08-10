import React from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import { useLocation } from '@docusaurus/router';

// 全屏应用页（刷写器、站点规划器）隐藏顶部导航栏，避免与页面自身标题重复
const HIDDEN_ROUTES = ['/flash', '/site-planner'];

export default function Navbar(props) {
  const { pathname } = useLocation();
  const hidden = HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + '/'),
  );
  if (hidden) return null;
  return <OriginalNavbar {...props} />;
}
