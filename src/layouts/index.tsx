import { useToken } from '@/hooks/useToken';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useOutlet } from 'react-router-dom';
import { Skeleton, message } from 'antd';
import { Icon } from '@iconify/react';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';
import { versionCheck } from './utils/helper';
import { getMenuList } from '@/servers/system/menu';
import { useMenuStore, useUserStore } from '@/stores';
import { getPermissions } from '@/servers/permissions';
import { useCommonStore } from '@/hooks/useCommonStore';
import KeepAlive from 'react-activation';
import Menu from './components/Menu';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Forbidden from '@/pages/403';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './index.module.less';

/**
 * 后台主布局。
 * 负责拉取用户权限/菜单、维护响应式菜单状态，并包裹业务页面的缓存和异常边界。
 */
function Layout() {
  const [getToken] = useToken();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const token = getToken();
  const outlet = useOutlet();
  const [isLoading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { setPermissions, setUserInfo } = useUserStore((state) => state);
  const { setMenuList, toggleCollapsed, togglePhone } = useMenuStore((state) => state);

  const { permissions, userId, isMaximize, isCollapsed, isPhone, isRefresh } = useCommonStore();

  /** 获取用户信息和权限，权限列表会同时决定菜单可见性和页面访问能力。 */
  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getPermissions({ refresh_cache: false });
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
  }, [getUserInfo, getMenuData, token, userId]);

  // 路由切换时检查静态资源版本，发现新版本后提示用户刷新页面。
  useEffect(() => {
    versionCheck(t, messageApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /** 根据窗口宽度同步移动端状态，小屏下默认收起侧边菜单。 */
  const handleIsPhone = debounce(() => {
    const isPhone = window.innerWidth <= 768;
    // 手机首次进来收缩菜单
    if (isPhone) toggleCollapsed(true);
    togglePhone(isPhone);
  }, 500);

  // 监听窗口变化，保证桌面端和移动端切换时布局状态及时更新。
  useEffect(() => {
    handleIsPhone();
    window.addEventListener('resize', handleIsPhone);

    return () => {
      window.removeEventListener('resize', handleIsPhone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="layout">
      {contextHolder}
      <Menu />
      <div className={styles.layout_right}>
        <div
          id="header"
          className={`
            border-bottom
            transition-all
            ${styles.header}
            ${isCollapsed ? styles['header-close-menu'] : ''}
            ${isMaximize ? styles['header-none'] : ''}
            ${isPhone ? `!left-0 z-999` : ''}
          `}
        >
          <Header />
          <Tabs />
        </div>
        <div
          id="layout-content"
          className={`
            overflow-auto
            transition-all
            ${styles.con}
            ${isMaximize ? styles['con-maximize'] : ''}
            ${isCollapsed ? styles['con-close-menu'] : ''}
            ${isPhone ? `!left-0 !w-full` : ''}
          `}
        >
          {isLoading && permissions.length === 0 && (
            <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />
          )}
          {!isLoading && permissions.length === 0 && <Forbidden />}
          {isRefresh && (
            <div
              className={`
              absolute
              left-50%
              top-50%
              -rotate-x-50%
              -rotate-y-50%
            `}
            >
              <Icon className="text-40px animate-spin" icon="ri:loader-2-fill" />
            </div>
          )}
          {permissions.length > 0 && (
            <ErrorBoundary key={pathname}>
              {/* 业务页面统一走异常边界和 KeepAlive；限制最多缓存10个页面，避免长期使用后内存持续增长。 */}
              <KeepAlive id={pathname} name={pathname} max={10} strategy="LRU">
                <div
                  className={`
                  content-transition
                `}
                >
                  <Suspense
                    fallback={
                      <div className="p-30px">
                        <Skeleton active paragraph={{ rows: 10 }} />
                      </div>
                    }
                  >
                    {outlet}
                  </Suspense>
                </div>
              </KeepAlive>
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
