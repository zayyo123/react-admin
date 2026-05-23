/**
 * 学习提示：路由模块：负责把页面组件组织成浏览器可访问的路由，并处理登录态守卫。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { RouteObject } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { handleRoutes } from '../utils/helper';
import { useRoutes } from 'react-router-dom';
import Login from '@/pages/login';
import Forget from '@/pages/forget';
import NotFound from '@/pages/404';
import Guards from './Guards';

type PageFiles = Record<string, () => Promise<any>>;
// Vite 在构建时收集 pages 下所有页面文件，后续由 helper 转成实际路由。
const pages = import.meta.glob('../../pages/**/*.tsx', { eager: false }) as PageFiles;

// 在浏览器空闲时预加载常用组件，路径相对当前 router/components 目录。
const components = import.meta.glob('../../components/**/*.tsx', { eager: false }) as PageFiles;

// 预加载的路由集合
const preloadedRoutes = new Set<string>();
// 预加载的组件集合
const preloadedComponents = new Set<string>();

function App() {
  // 预加载路由和组件，把非关键加载挪到浏览器空闲阶段，降低页面首次交互压力。
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleCallbackId = (requestIdleCallback as any)(() => {
        Object.entries(pages).forEach(([path]) => {
          if (preloadedRoutes.has(path)) return;
          preloadedRoutes.add(path);
          pages[path]().catch(() => {
            console.error('预加载路由错误：', path);
          });
        });

        Object.entries(components).forEach(([path]) => {
          if (preloadedComponents.has(path)) return;
          preloadedComponents.add(path);
          components[path]().catch(() => {
            console.error('预加载组件错误：', path);
          });
        });
      });

      return () => {
        if ('cancelIdleCallback' in window) {
          (cancelIdleCallback as any)(idleCallbackId);
        }
      };
    }
  }, []);

  // 缓存路由配置，避免 App 组件重渲染时重复生成路由对象。
  const routes = useMemo(() => {
    const layouts = handleRoutes(pages);
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
    return newRoutes;
  }, []);

  return <>{useRoutes(routes)}</>;
}

export default App;
