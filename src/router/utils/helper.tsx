/**
 * 学习提示：路由模块：负责把页面组件组织成浏览器可访问的路由，并处理登录态守卫。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTER_EXCLUDE } from './config';

/**
 * 路由添加 layout。
 * 当前项目中登录页、找回密码页等独立页面不进入后台 Layout，其余业务页面由 Guards/Layout 统一包裹。
 * @param routes - 路由数据
 */
export function layoutRoutes(routes: RouteObject[]): RouteObject[] {
  const layouts: RouteObject[] = []; // layout内部组件

  for (let i = 0; i < routes.length; i++) {
    const { path } = routes[i];
    // 路径为登录页不添加layouts
    if (path !== 'login') {
      layouts.push(routes[i]);
    }
  }

  return layouts;
}

/**
 * 处理自动路由。
 * Vite 的 import.meta.glob 会返回页面文件路径和动态 import 函数，本方法负责把文件路径转换成
 * react-router 可识别的 RouteObject。新增页面时通常只需要在 pages 下建文件，不必手动维护路由表。
 * @param routes - 路由数据
 */
export function handleRoutes(routes: Record<string, () => Promise<any>>): RouteObject[] {
  const layouts: RouteObject[] = []; // layout内部组件

  for (const key in routes) {
    // 排除组件、模型等非页面文件，避免被误注册成可访问路由。
    const isExclude = handleRouterExclude(key);
    if (isExclude) continue;

    const path = getRouterPage(key);
    if (path === '/login') continue;

    // 使用 React.lazy 包装动态导入的组件，业务页面按路由分包加载。
    const LazyComponent = lazy(async () => {
      const module = await routes[key]();
      // 处理不同的模块导出格式
      const Component = module?.default || module;
      return {
        default: Component,
      };
    });

    layouts.push({
      path,
      element: <LazyComponent />,
    });
  }

  return layouts;
}

// 预处理排除规则，避免每次遍历页面文件时重复创建正则。
const ROUTER_EXCLUDE_REGEX = new RegExp(
  ROUTER_EXCLUDE.map((item) => (!item.includes('.') ? `/${item}/` : item)).join('|'),
  'i',
);

/**
 * 匹配路由是否在排查名单中
 * @param path - 路径
 */
function handleRouterExclude(path: string): boolean {
  // ROUTER_EXCLUDE 可配置 components、model 等目录/文件，避免它们被错误暴露成页面地址。
  return ROUTER_EXCLUDE_REGEX.test(path);
}

/**
 * 处理动态参数路由
 * @param path - 路由
 */
const handleRouterDynamic = (path: string): string => {
  // 约定 [id].tsx 这类文件映射为 react-router 的 :id 动态参数。
  path = path.replace(/\[/g, ':');
  path = path.replace(/\]/g, '');

  return path;
};

/**
 * 获取路由路径
 * @param path - 路径
 */
function getRouterPage(path: string): string {
  // 截取 pages 之后、文件后缀之前的部分作为路由路径来源。
  const pageIndex = path.indexOf('pages') + 5;
  const lastIndex = path.lastIndexOf('.');
  let result = path.substring(pageIndex, lastIndex);

  // pages/index.tsx 映射为根路径。
  if (result === '/index') return '/';

  // 目录下的 index.tsx 映射为目录路径，例如 /system/user/index.tsx -> /system/user。
  if (result.includes('index')) {
    const indexIdx = result.lastIndexOf('index') + 5;
    if (indexIdx === result.length) {
      result = result.substring(0, result.length - 6);
    }
  }

  // 如果是动态参数路由
  if (result.includes('[') && result.includes(']')) {
    result = handleRouterDynamic(result);
  }

  // 返回值会直接作为浏览器访问路径，例如 pages/system/user/index.tsx -> /system/user。
  return result;
}
