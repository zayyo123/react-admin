/**
 * 学习提示：后台布局模块：负责菜单、顶部栏、页签、内容区、页面缓存和响应式布局。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useToken } from '@/hooks/useToken';
import { useCallback, useEffect, useMemo, useState, memo, useDeferredValue, Suspense } from 'react';
import { useOutlet } from 'react-router-dom';
import { Skeleton, message } from 'antd';
import { debounce } from 'lodash';
import { useShallow } from 'zustand/shallow';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { versionCheck } from './utils/helper';
import { getMenuList } from '@/servers/system/menu';
import { useMenuStore, useUserStore } from '@/stores';
import { getUserRefreshPermissions } from '@/servers/system/user';
import { KeepAlive, useKeepAliveRef } from 'keepalive-for-react';
import { useCommonStore } from '@/hooks/useCommonStore';
import nprogress from 'nprogress';
import Menu from './components/Menu';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Forbidden from '@/pages/403';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './index.module.less';

/**
 * 后台主布局。
 * 负责拉取权限/菜单、维护响应式布局，并用 keepalive-for-react 缓存业务页面。
 */
function Layout() {
  const [getToken] = useToken();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const token = getToken();
  const outlet = useOutlet();
  const keepaliveRef = useKeepAliveRef();
  const [isLoading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const setAliveRef = usePublicStore(useShallow((state) => state.setAliveRef));
  const aliveRef = usePublicStore(useShallow((state) => state.aliveRef));
  const { setPermissions, setUserInfo } = useUserStore(
    useShallow((state) => ({
      setPermissions: state.setPermissions,
      setUserInfo: state.setUserInfo,
    })),
  );
  const { menuList, setMenuList, toggleCollapsed, togglePhone } = useMenuStore(
    useShallow((state) => ({
      menuList: state.menuList,
      setMenuList: state.setMenuList,
      toggleCollapsed: state.toggleCollapsed,
      togglePhone: state.togglePhone,
    })),
  );

  const { permissions, userId, isMaximize, isCollapsed, isPhone } = useCommonStore();

  // 延迟非关键路由更新，降低页面切换时对交互响应的影响。
  const deferredPathname = useDeferredValue(pathname);

  /** 当前路由的 KeepAlive 缓存 key。 */
  const currentCacheKey = useMemo(() => {
    return deferredPathname;
  }, [deferredPathname]);

  // 只在 ref 初始化时写入 store，避免每次渲染都触发全局状态更新。
  useEffect(() => {
    if (keepaliveRef.current && !aliveRef.current) {
      setAliveRef(keepaliveRef);
    }
  }, [keepaliveRef.current]);

  /** 获取用户信息和权限，权限列表会同时决定菜单可见性和页面访问能力。 */
  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getUserRefreshPermissions({ refresh_cache: false });
      if (Number(code) !== 200) return;
      const { user, permissions } = data;
      setUserInfo(user);
      setPermissions(permissions);
    } catch (err) {
      console.error('获取用户数据失败:', err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 获取后端菜单数据，菜单结构会驱动左侧导航和路由入口展示。 */
  const getMenuData = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getMenuList();
      if (Number(code) !== 200) return;
      setMenuList(data || []);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 首次进入或刷新页面时，只有本地存在 token 但 store 尚未恢复用户信息才重新请求。
    if (token && !userId) {
      getUserInfo();
      getMenuData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 路由切换时结束进度条，并检查静态资源版本，发现新版本后提示用户刷新页面。
  useEffect(() => {
    nprogress?.done?.();

    requestAnimationFrame(() => {
      versionCheck(t, messageApi);
    });

    return () => {
      nprogress?.start?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /** 根据窗口宽度同步移动端状态，小屏下默认收起侧边菜单。 */
  const handleIsPhone = useCallback(
    debounce(() => {
      const isPhone = window.innerWidth <= 768;
      // 手机首次进来收缩菜单
      if (isPhone) toggleCollapsed(true);
      togglePhone(isPhone);
    }, 500),
    [toggleCollapsed, togglePhone],
  );

  // 监听窗口变化，保证桌面端和移动端切换时布局状态及时更新。
  useEffect(() => {
    handleIsPhone();
    window.addEventListener('resize', handleIsPhone);

    return () => {
      window.removeEventListener('resize', handleIsPhone);
      handleIsPhone.cancel(); // 清理 debounce 函数
    };
  }, [handleIsPhone]);

  // 缓存布局类名，避免布局容器在状态更新时重复做字符串计算。
  const headerClassName = useMemo(
    () =>
      `
        border-bottom
        transition-all
        z-15
        ${styles.header}
        ${isCollapsed ? styles['header-close-menu'] : ''}
        ${isMaximize ? styles['header-none'] : ''}
        ${isPhone ? `!left-0 z-999` : ''}
      `,
    [isCollapsed, isMaximize, isPhone],
  );

  const contentClassName = useMemo(
    () =>
      `
        overflow-auto
        transition-all
        ${styles.con}
        ${isMaximize ? styles['con-maximize'] : ''}
        ${isCollapsed ? styles['con-close-menu'] : ''}
        ${isPhone ? `!left-0 !w-full` : ''}
      `,
    [isMaximize, isCollapsed, isPhone],
  );

  return (
    <div id="layout">
      {contextHolder}
      {permissions.length > 0 && menuList.length > 0 && <Menu />}

      <div className={styles.layout_right}>
        <div id="header" className={headerClassName}>
          <Header />
          {permissions.length > 0 && menuList.length > 0 && <Tabs aliveRef={keepaliveRef} />}
        </div>
        <div id="layout-content" className={contentClassName}>
          {isLoading && permissions.length === 0 && (
            <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />
          )}
          {!isLoading && permissions.length === 0 && <Forbidden />}
          <KeepAlive aliveRef={keepaliveRef} activeCacheKey={currentCacheKey} max={10}>
            {permissions.length > 0 && (
              // 业务页面统一走异常边界和 KeepAlive；最多缓存10个页面，避免长期使用后内存持续增长。
              <motion.div
                key={deferredPathname}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="p-30px">
                        <Skeleton active paragraph={{ rows: 10 }} />
                      </div>
                    }
                  >
                    {outlet}
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}
          </KeepAlive>
        </div>
      </div>
    </div>
  );
}

export default memo(Layout);
