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
  routes: Record<string, () => Promise<DefaultComponent<unknown>>>
): RouteObject[] {
  const layouts: RouteObject[] = []; // layout内部组件

  for (const key in routes) {
    // 是否在排除名单中
    const isExclude = handleRouterExclude(key);
    // 如果isExclude为true，则跳过本次循环
    if (isExclude) continue;

    // 获取路由页面
    const path = getRouterPage(key);
    // 如果路径是登录页面，则跳过
    if (path === '/login') continue;

    // 加载路由组件
    const ComponentNode = loadable(routes[key], {
      // 设置加载时的占位符
      fallback: (
        //组件创建一个加载骨架屏
        <Skeleton
          active
          className='p-30px'
          paragraph={{ rows: 10 }}
        />
      )
    });

    layouts.push({
      path,
      element: <ComponentNode />
    });
  }

  return layouts;
}

// 预处理正则表达式，避免重复创建
const ROUTER_EXCLUDE_REGEX = new RegExp(
  ROUTER_EXCLUDE.map(item => (!item.includes('.') ? `/${item}/` : item)).join('|'),
  'i'
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
  // 将所有的左方括号 [ 替换为冒号 :
  path = path.replace(/\[/g, ':');
  // 将所有的右方括号 ] 删除
  path = path.replace(/\]/g, '');

  return path;
};

/**
 * 获取路由路径
 * @param path - 路径
 */
function getRouterPage(path: string): string {
  // 获取路径位数
  const pageIndex = path.indexOf('pages') + 5;
  // 文件后缀位数
  const lastIndex = path.lastIndexOf('.');
  // 去除pages和文件后缀，获取真实的文件路径
  let result = path.substring(pageIndex, lastIndex);

  // 如果是首页则直接返回/
  if (result === '/index') return '/';

  // 当一个路径以 "index" 结尾时（如 /user/index），通常在 Web 应用中会简化为 /user/。这段代码就是实现这种简化：
  // 如果结尾是index则去除
  if (result.includes('index')) {
    // 获取result中最后一个'index'的索引，并加5
    const indexIdx = result.lastIndexOf('index') + 5;
    // 如果最后一个'index'的索引等于result的长度
    if (indexIdx === result.length) {
      // 将result截取到倒数第6个字符之前
      result = result.substring(0, result.length - 6);
    }
  }

  // 如果是动态参数路由
  if (result.includes('[') && result.includes(']')) {
    result = handleRouterDynamic(result);
  }

  return result;
}
