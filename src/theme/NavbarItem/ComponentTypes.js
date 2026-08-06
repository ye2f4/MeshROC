// 注册自定义导航栏项：将 `custom-<Name>` 映射到 src/theme/NavbarItem/<Name> 组件。
// Docusaurus 3.x 的 ComponentTypes 是静态内置映射，不含 custom-* 类型，必须在此自行注册。
import DefaultComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import UserMenu from './UserMenu';
import ChatButton from './ChatButton';

export default {
  ...DefaultComponentTypes,
  'custom-UserMenu': UserMenu,
  'custom-ChatButton': ChatButton,
};
