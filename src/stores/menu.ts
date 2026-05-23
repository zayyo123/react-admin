/**
 * 学习提示：Zustand 状态模块：负责保存跨组件共享的数据，例如用户、菜单、主题和页签。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SideMenu } from '#/public';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MenuState {
  isPhone: boolean; // 当前是否为移动端布局
  isCollapsed: boolean; // 左侧菜单是否收起
  selectedKeys: string; // 菜单选中值
  openKeys: string[]; // 菜单展开项
  menuList: SideMenu[]; // 菜单列表数据
  toggleCollapsed: (isCollapsed: boolean) => void;
  togglePhone: (isPhone: boolean) => void;
  setSelectedKeys: (selectedKeys: string) => void;
  setOpenKeys: (openKeys: string[]) => void;
  setMenuList: (menuList: SideMenu[]) => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      // 初始状态：桌面端、菜单展开，默认选中 dashboard。
      isPhone: false,
      isCollapsed: false,
      selectedKeys: 'dashboard', // 菜单选中值
      openKeys: ['Dashboard'], // 菜单展开项
      menuList: [], // 菜单列表数据
      // Zustand 的 set 会合并对象；这里只更新对应字段，不会影响其他状态。
      toggleCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
      togglePhone: (isPhone: boolean) => set({ isPhone }),
      setSelectedKeys: (selectedKeys: string) => set({ selectedKeys }),
      setOpenKeys: (openKeys: string[]) => set({ openKeys }),
      setMenuList: (menuList: SideMenu[]) => set({ menuList }),
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
      name: 'menuStore',
    },
  ),
);
