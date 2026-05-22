import type { RouteObject } from 'react-router-dom';
import type { DefaultComponent } from '@loadable/component';
import { useEffect } from 'react';
import { handleRoutes } from '../utils/helper';
import { useLocation, useRoutes } from 'react-router-dom';
import Login from '@/pages/login';
import Forget from '@/pages/forget';
import NotFound from '@/pages/404';
import nprogress from 'nprogress';
import Guards from './Guards';

type PageFiles = Record<string, () => Promise<DefaultComponent<unknown>>>;
// Vite 在构建时收集 pages 下所有页面文件，后续由 helper 转成实际路由。
const pages = import.meta.glob('../../pages/**/*.tsx') as PageFiles;
const layouts = handleRoutes(pages);

/** 基础路由表：公开页面手动声明，后台页面由 pages 目录自动生成。 */
const newRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'forget',
    element: <Forget />,
  },
  {
    path: '',
    element: <Guards />,
    children: layouts,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

function App() {
  const location = useLocation();

  // 首次挂载时启动顶部进度条，路由切换完成后在下方 effect 中结束。
  useEffect(() => {
    nprogress.start();
  }, []);

  // 每次路由变化完成后关闭进度条，并在下一次变化前重新启动。
  useEffect(() => {
    nprogress.done();

    return () => {
      nprogress.start();
    };
  }, [location]);

  return <>{useRoutes(newRoutes)}</>;
}

export default App;
