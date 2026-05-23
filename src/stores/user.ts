/**
 * 学习提示：Zustand 状态模块：负责保存跨组件共享的数据，例如用户、菜单、主题和页签。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserInfo {
  // 后端用户主键，0 表示当前没有有效登录用户。
  id: number;
  // 登录用户名，通常用于顶部用户信息展示。
  username: string;
  // 用户邮箱，按后端返回保存。
  email: string;
  // 用户手机号，按后端返回保存。
  phone: string;
  // 用户绑定的角色 id 列表，配合权限/菜单接口判断可访问范围。
  roles: number[];
}

interface UserState {
  // 当前用户拥有的权限标识列表，页面和按钮级权限判断会依赖它。
  permissions: string[];
  // 当前登录用户的基础信息。
  userInfo: UserInfo;
  // 写入权限列表，通常在登录后或刷新权限接口返回后调用。
  setPermissions: (permissions: string[]) => void;
  // 写入用户信息，通常和 setPermissions 一起更新。
  setUserInfo: (userInfo: UserInfo) => void;
  // 清理用户信息，退出登录时调用。
  clearInfo: () => void;
}

/**
 * 用户状态仓库。
 *
 * 这里不做持久化，刷新页面后会由 Layout 根据 token 重新请求用户信息和权限。
 * 这样可以避免角色权限被后端修改后，前端长期使用过期权限。
 */
export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      permissions: [],
      userInfo: {
        id: 0,
        username: '',
        email: '',
        phone: '',
        roles: [],
      },
      /** 设置用户权限列表 */
      setPermissions: (permissions) => set({ permissions }),
      /** 设置用户基础信息 */
      setUserInfo: (userInfo) => set({ userInfo }),
      /** 清除用户基础信息，权限列表会在重新登录/刷新权限时重新写入 */
      clearInfo: () =>
        set({
          userInfo: { id: 0, username: '', email: '', phone: '', roles: [] },
        }),
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
      name: 'userStore',
    },
  ),
);
