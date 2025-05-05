/*
 Guards.tsx 文件定义了一个路由守卫组件，主要功能包括：
权限控制：检查用户是否已登录（有token），未登录时自动重定向到登录页面，并保存当前路径用于登录后跳回。
页面加载进度条：使用 nprogress 库在页面加载和路由切换时显示顶部进度条，提升用户体验。
条件渲染：根据不同的路由状态和登录状态，决定渲染不同的内容：
已登录用户访问登录页：直接渲染嵌套路由内容
已登录用户访问其他页面：渲染带布局的页面内容
这个组件通常会被放置在路由配置的顶层，作为一个包装器来控制所有需要权限的路由，确保未登录用户无法访问受保护的页面。
*/

import { useEffect } from 'react';
// 导入自定义钩子useToken，用于获取和管理认证令牌
import { useToken } from '@/hooks/useToken';
// useLocation: 获取当前路由位置信息
// useNavigate: 用于编程式导航
// useOutlet: 用于渲染嵌套路由的组件
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
// 导入nprogress库，用于显示页面加载进度条
import nprogress from 'nprogress';
import Layout from '@/layouts';

// Guards组件：路由守卫组件，负责权限控制和页面过渡效果
function Guards() {
  // 使用useToken钩子获取token操作函数，解构出getToken函数
  const [getToken] = useToken();
  // 获取嵌套路由渲染的组件
  const outlet = useOutlet();
  // 获取导航函数，用于路由跳转
  const navigate = useNavigate();
  // 获取当前路由位置信息（路径、查询参数等）
  const location = useLocation();
  // 调用getToken函数获取当前存储的token
  const token = getToken();

  // 顶部进度条- 组件挂载时启动进度条
  useEffect(() => {
    // 启动进度条
    nprogress.start();
  }, []);

  // 路由变化时处理进度条
  useEffect(() => {
    // 当路由加载完成时，结束进度条显示
    nprogress.done();
    // 返回清理函数，在组件卸载或下一次effect执行前调用
    return () => {
      nprogress.start();
    };
  }, [location]);

  // 权限控制逻辑
  useEffect(() => {
    // 无权限退出：当不在登录页且没有token时，重定向到登录页
    if (location.pathname !== '/login' && !token) {
      // 构建重定向参数，保存当前路径，便于登录后跳回
      const param =
        location.pathname?.length > 1 ? `?redirect=${location.pathname}${location.search}` : '';
      // 导航到登录页，并携带重定向参数
      navigate(`/login${param}`);
    }
  }, [location, navigate, token]);

  /** 渲染页面- 根据不同条件渲染不同内容  */
  const renderPage = () => {
    // 如果有token且当前在登录页，直接渲染嵌套路由内容
    // 这种情况通常是已登录用户访问登录页，可能会自动跳转到其他页面
    if (token && location.pathname === '/login') {
      return <div>{outlet}</div>;
    }
    // 其他情况（已登录且不在登录页），渲染带布局的页面
    return <Layout />;
  };
  // 组件最终渲染结果，调用renderPage函数决定渲染内容
  return <>{renderPage()}</>;
}

export default Guards;
