/**
 * 学习提示：应用入口文件：负责引入全局样式、初始化运行环境，并把 React 应用挂载到浏览器 DOM。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import ReactDOM from 'react-dom/client';
import Router from './router';
import '@/assets/css/public.less';
import '@/assets/fonts/font.less';

// 样式
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'; // 兼容低版本浏览器
import 'uno.css';
import 'nprogress/nprogress.css';
import '@/assets/css/scrollbar.less';
import '@/assets/css/theme-color.less';

// 国际化i18n
import './locales/config';

// antd
import '@/assets/css/antd.less';

// 时间设为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

// 性能监控
import { initPerformanceMonitoring } from '@/utils/performance';
import { initSentry } from '@/utils/sentry';

/**
 * 全局错误兜底。
 *
 * 这里放在 React 渲染之前同步执行，原因是：
 * 1. 有些异步错误可能发生在 React 组件树挂载之前；
 * 2. unhandledrejection 默认可能在控制台产生噪音，甚至被某些运行环境当作致命错误；
 * 3. 这里先统一阻止默认行为并打印日志，真正的错误上报延迟交给 Sentry 初始化后处理。
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    console.error('Unhandled promise rejection:', event.reason);
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.message);
  });
}

/**
 * 优先渲染主应用。
 *
 * Sentry、性能监控这类非首屏必需功能会放到后面延迟初始化，
 * 避免监控 SDK 初始化影响用户看到页面的速度。
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
    <Router />
  </StyleProvider>,
);

/**
 * 关闭 index.html 中的首屏 loading。
 *
 * first 节点由静态 HTML 提供，React 应用挂载后就可以隐藏，
 * 避免用户看到加载动画覆盖真实页面。
 */
const firstElement = document.getElementById('first');
if (firstElement && firstElement.style?.display !== 'none') {
  firstElement.style.display = 'none';
}

/**
 * 延迟初始化非关键服务。
 *
 * requestIdleCallback 会等浏览器空闲时再执行，适合放性能统计、错误上报等非关键逻辑。
 * 如果浏览器不支持，则退化为 setTimeout，保证功能仍然会被初始化。
 */
const deferredInit = () => {
  // 初始化性能监控
  initPerformanceMonitoring();

  // 初始化 Sentry (需要在 .env 中配置 VITE_SENTRY_DSN)
  initSentry();
};

// 检查是否支持 requestIdleCallback
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => deferredInit());
} else {
  // 降级方案：使用 setTimeout 延迟执行
  setTimeout(deferredInit, 0);
}
