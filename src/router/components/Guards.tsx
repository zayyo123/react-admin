/**
 * 学习提示：路由模块：负责把页面组件组织成浏览器可访问的路由，并处理登录态守卫。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useEffect, useState, useMemo, useRef, lazy, Suspense } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message } from '@south/message';
import { getLocalInfo } from '@south/utils';
import { TOKEN } from '@/utils/config';
import { Spin } from 'antd';

// 懒加载 Layout 组件，减少首屏加载体积
const Layout = lazy(() => import('@/layouts'));

// 同步方式获取token
function getTokenSync() {
  try {
    return getLocalInfo<string>(TOKEN) || '';
  } catch {
    return '';
  }
}

/**
 * 路由守卫。
 * 同步读取 token，统一处理登录态重定向，并懒加载后台主布局以减少首屏负担。
 */
function Guards() {
  const { t } = useTranslation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const location = useLocation();

  // 同步检查权限，避免异步读取登录态造成页面短暂闪动。
  const { token, isValid, shouldRedirect, redirectPath } = useMemo(() => {
    const token = getTokenSync();
    const isLoginRoute = location.pathname === '/login';

    // 已登录用户访问登录页时，优先回到 redirect 参数指定页面。
    if (token && isLoginRoute) {
      const redirect = new URLSearchParams(location.search).get('redirect');
      return {
        token,
        isValid: false,
        shouldRedirect: true,
        redirectPath: redirect || '/',
      };
    }

    // 未登录访问受保护页面时跳转登录页，并记录原始路径用于登录后回跳。
    if (!token && !isLoginRoute) {
      const param =
        location.pathname?.length > 1 ? `?redirect=${location.pathname}${location.search}` : '';
      return {
        token,
        isValid: false,
        shouldRedirect: true,
        redirectPath: `/login${param}`,
      };
    }

    // 登录页未登录、或受保护页面已登录，都可以正常渲染。
    return { token, isValid: !!token || isLoginRoute, shouldRedirect: false, redirectPath: '' };
  }, [location.pathname, location.search]);

  const [redirected, setRedirected] = useState(false);
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    // 防止 React 重渲染期间重复触发同一次重定向。
    if (shouldRedirect && !isRedirectingRef.current) {
      isRedirectingRef.current = true;

      navigate(redirectPath, { replace: true });
      setRedirected(true);

      // 未登录跳转登录页时给用户明确提示。
      if (redirectPath.startsWith('/login') && location.pathname !== '/') {
        message.warning({
          content: t('public.noLoginVisit'),
          key: 'noLoginVisit',
        });
      }

      // 延迟释放重定向锁，确保路由切换完成。
      const timer = setTimeout(() => {
        isRedirectingRef.current = false;
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [shouldRedirect, redirectPath, navigate, location.pathname, t]);

  // 重定向期间只展示轻量 loading，避免旧页面继续闪现。
  if (shouldRedirect || redirected) {
    return (
      <div className="absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2 text-center">
        <Spin spinning={true} />
      </div>
    );
  }

  // 缓存 Layout 节点，只在登录态变化时重新计算。
  const layoutElement = useMemo(() => {
    if (isValid && token) {
      return (
        <Suspense
          fallback={
            <div className="absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2 text-center">
              <Spin spinning={true} />
            </div>
          }
        >
          <Layout />
        </Suspense>
      );
    }
    return null;
  }, [token, isValid]);

  // 已登录用户进入登录页时仍渲染 outlet，便于登录页内部处理回跳逻辑。
  if (location.pathname === '/login' && token) {
    return <div>{outlet}</div>;
  }

  if (layoutElement) {
    return layoutElement;
  }

  return <div>{outlet}</div>;
}

export default Guards;
