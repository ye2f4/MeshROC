import React from 'react';
import SearchBar from '@theme/SearchBar';

// 汉堡菜单（移动端侧栏）只保留搜索框，隐藏所有导航项
export default function NavbarMobilePrimaryMenu() {
  return (
    <ul className="menu__list">
      <li className="menu__list-item">
        <SearchBar />
      </li>
    </ul>
  );
}
