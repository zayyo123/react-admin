/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useShallow } from 'zustand/shallow';

/**
 * 退出登录 Hook。
 * 退出不只是删除 token，还要清空用户、菜单、页签、页面缓存等状态，避免下一个用户看到上一个用户的数据。
 */
export const useLogout = () => {
  const [, , removeToken] = useToken();
  const aliveRef = usePublicStore(useShallow((state) => state.aliveRef));
  const { closeAllTab, setActiveKey } = useTabsStore((state) => state);
  const setPermissions = useUserStore((state) => state.setPermissions);
  const setMenuList = useMenuStore((state) => state.setMenuList);
  const clearInfo = useUserStore((state) => state.clearInfo);
  const navigate = useNavigate();
  const location = useLocation();

  /** 退出登录 */
  const handleLogout = () => {
    // 清空用户信息和权限，页面会根据权限变化隐藏受保护内容。
    clearInfo();
    // 清空页签和当前激活 key，避免重新登录后残留旧页面标签。
    closeAllTab();
    setActiveKey('');
    // 清空菜单和权限数据，重新登录后由 Layout 再次请求。
    setMenuList([]);
    setPermissions([]);
    // 删除本地 token，路由守卫会把用户带回登录页。
    removeToken();
    // 清除 keepalive 缓存，防止缓存页面保留旧用户状态。
    aliveRef.current?.destroyAll();
    navigate(`/login?redirect=${location.pathname}${location.search}`);
  };

  return [handleLogout] as const;
};
