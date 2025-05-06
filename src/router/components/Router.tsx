/**
 * router/components/Router.tsx
 *
 * 这个文件定义了应用的路由配置和路由组件。
 * 主要功能包括：
 * 1. 自动导入页面组件
 * 2. 配置路由结构
 * 3. 处理路由切换时的进度条显示
 * 4. 渲染路由内容
 */

// 导入类型定义
import type { RouteObject } from "react-router-dom"; // 路由对象类型
import type { DefaultComponent } from "@loadable/component"; // 默认组件类型

// 导入React核心Hook
import { useEffect } from "react";

// 导入路由工具函数，用于处理动态导入的页面组件
import { handleRoutes } from "../utils/helper";

// 导入路由相关Hook
import { useLocation, useRoutes } from "react-router-dom";

// 导入页面组件
import Login from "@/pages/login"; // 登录页面
import Forget from "@/pages/forget"; // 忘记密码页面
import NotFound from "@/pages/404"; // 404页面

// 导入进度条库
import nprogress from "nprogress";

// 导入路由守卫组件，用于权限控制
import Guards from "./Guards";

/**
 * 定义页面文件类型
 * Record<string, () => Promise<DefaultComponent<unknown>>> 表示一个对象，
 * 键是字符串，值是返回Promise的函数，Promise解析为默认组件
 */
type PageFiles = Record<string, () => Promise<DefaultComponent<unknown>>>;

/**
 * 使用Vite的import.meta.glob动态导入所有页面组件
 * 这会在构建时自动导入pages目录下的所有.tsx文件
 * 每个导入的文件都会被转换为一个懒加载的函数
 */
const pages = import.meta.glob("../../pages/**/*.tsx") as PageFiles;

/**
 * 处理路由配置
 * 使用handleRoutes函数将动态导入的页面组件转换为路由配置
 */
const layouts = handleRoutes(pages);

/**
 * 定义应用的主路由配置
 * 包含登录、忘记密码、主应用（带权限守卫）和404页面
 */
const newRoutes: RouteObject[] = [
  {
    path: "login", // 登录路径
    element: <Login />, // 登录组件
  },
  {
    path: "forget", // 忘记密码路径
    element: <Forget />, // 忘记密码组件
  },
  {
    path: "", // 根路径（空字符串）
    element: <Guards />, // 使用Guards组件进行权限控制
    children: layouts, // 嵌套子路由，包含所有自动导入的页面
  },
  {
    path: "*", // 通配符路径，匹配所有未定义的路由
    element: <NotFound />, // 404页面组件
  },
];

/**
 * 路由组件
 * 负责渲染路由内容和处理路由切换时的进度条
 */
function App() {
  // 获取当前路由位置
  const location = useLocation();

  /**
   * 初始化进度条
   * 组件挂载时启动进度条
   */
  useEffect(() => {
    nprogress.start();
  }, []);

  /**
   * 处理路由变化时的进度条
   * 当路由变化时，完成当前进度条并在下一次变化前重新启动
   */
  useEffect(() => {
    // 当路由加载完成时，结束进度条显示
    nprogress.done();

    // 返回清理函数，在组件卸载或下一次effect执行前调用
    return () => {
      // 当路由即将变化时，重新启动进度条
      nprogress.start();
    };
  }, [location]); // 依赖location，当路由变化时重新执行

  // 使用useRoutes钩子渲染路由，根据当前URL匹配相应的路由配置
  return <>{useRoutes(newRoutes)}</>;
}

// 导出路由组件
export default App;
