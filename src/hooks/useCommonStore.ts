/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useMenuStore, usePublicStore, useTabsStore, useUserStore } from '@/stores';
import { useShallow } from 'zustand/react/shallow';

/**
 * 获取常用的全局状态数据。
 * 这个 Hook 像一个“状态聚合器”：把 user/menu/tabs/public 里页面常用的字段集中返回，
 * 业务组件就不用分别调用多个 store。使用 useShallow 可以减少不必要的重新渲染。
 */
export const useCommonStore = () => {
  // 用户相关状态：权限、用户 id、角色、用户名，常用于权限判断和页面展示。
  const userStore = useUserStore(
    useShallow((state) => ({
      permissions: state.permissions,
      userId: state.userInfo.id,
      roles: state.userInfo.roles,
      username: state.userInfo.username,
    })),
  );

  // 页签相关状态：当前面包屑、已打开页签、是否最大化内容区。
  const tabsStore = useTabsStore(
    useShallow((state) => ({
      isMaximize: state.isMaximize,
      nav: state.nav,
      tabs: state.tabs,
    })),
  );

  // 菜单相关状态：侧边栏展开/收起、移动端状态、当前选中菜单和菜单树。
  const menuStore = useMenuStore(
    useShallow((state) => ({
      isCollapsed: state.isCollapsed,
      isPhone: state.isPhone,
      openKeys: state.openKeys,
      selectedKeys: state.selectedKeys,
      menuList: state.menuList,
    })),
  );

  // 公共状态：主题、刷新标记、全屏状态等和具体业务无关的全局 UI 状态。
  const publicStore = usePublicStore(
    useShallow((state) => ({
      isRefresh: state.isRefresh,
      isFullscreen: state.isFullscreen,
      theme: state.theme,
    })),
  );

  // 合并返回，让调用方可以一次性解构所需字段，例如 const { theme, permissions } = useCommonStore()。
  return {
    ...userStore,
    ...tabsStore,
    ...menuStore,
    ...publicStore,
  } as const;
};
