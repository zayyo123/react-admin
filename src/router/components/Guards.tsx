import { useEffect } from 'react';
import { useToken } from '@/hooks/useToken';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import nprogress from 'nprogress';
import Layout from '@/layouts';

/**
 * 路由守卫。
 * 统一处理登录校验、未登录重定向和页面切换进度条。
 */
function Guards() {
  const [getToken] = useToken();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  useEffect(() => {
    nprogress.start();

    // 未登录访问受保护页面时跳转登录页，并记录原始路径用于登录后回跳。
    if (location.pathname !== '/login' && !token) {
      const param =
        location.pathname?.length > 1 ? `?redirect=${location.pathname}${location.search}` : '';
      navigate(`/login${param}`);
    }

    nprogress.done();

    return () => {
      nprogress.start();
    };
  }, [location, navigate, token]);

  /** 已登录用户访问登录页时直接渲染子页面，其余受保护页面进入后台主布局。 */
  const renderPage = () => {
    if (token && location.pathname === '/login') {
      return <div>{outlet}</div>;
    }

    return <Layout />;
  };

  return <>{renderPage()}</>;
}

export default Guards;
