/**
 * 学习提示：菜单模块：定义静态菜单数据和菜单转换工具，配合后端菜单生成导航。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SideMenu } from '#/public';
import { demo } from './demo';

/**
 * 弃用，改为动态菜单获取，如果需要静态菜单将/src/hooks/useCommonStore.ts中的useCommonStore中的menuList改为defaultMenus
 * import { defaultMenus } from '@/menus';
 * // 菜单数据
 * const menuList = defaultMenus;
 */
export const defaultMenus: SideMenu[] = [
  {
    label: '仪表盘',
    labelEn: 'Dashboard',
    icon: 'la:tachometer-alt',
    key: '/dashboard',
    rule: '/dashboard',
  },
  ...(demo as SideMenu[]),
];
