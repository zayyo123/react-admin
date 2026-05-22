import type { RouteObject } from 'react-router-dom';
import type { DefaultComponent } from '@loadable/component';
import { Skeleton } from 'antd';
import { ROUTER_EXCLUDE } from './config';
import loadable from '@loadable/component';

/**
 * 路由添加layout
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
 * 处理路由
 * @param routes - 路由数据
 */
export function handleRoutes(
  routes: Record<string, () => Promise<DefaultComponent<unknown>>>,
): RouteObject[] {
  const layouts: RouteObject[] = []; // layout内部组件

  for (const key in routes) {
    // 排除组件、模型等非页面文件，避免被误注册成可访问路由。
    const isExclude = handleRouterExclude(key);
    if (isExclude) continue;

    const path = getRouterPage(key);
    if (path === '/login') continue;

    const ComponentNode = loadable(routes[key], {
      fallback: <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />,
    });

    layouts.push({
      path,
      element: <ComponentNode />,
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

  return result;
}
