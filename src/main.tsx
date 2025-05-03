import ReactDOM from "react-dom/client";
import Router from "./router";
import "@/assets/css/public.less";
import "@/assets/fonts/font.less";

/* 导入样式相关 */
/* 导入 Ant Design 的样式提供者组件，用于兼容低版本浏览器 */
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
/* 导入原子化 CSS 框架 */
import "uno.css";
/* 导入进度条样式 */
import "nprogress/nprogress.css";
/* 导入滚动条样式 */
import "@/assets/css/scrollbar.less";
/* 导入主题颜色样式 */
import "@/assets/css/theme-color.less";

/* 导入国际化配置 */
import "./locales/config";

/* 导入 Ant Design 相关 */
/* 导入 React 19 的补丁 */
import "@ant-design/v5-patch-for-react-19";
import "@/assets/css/antd.less";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
/* 设置 dayjs 使用中文 */
dayjs.locale("zh-cn");

/* 创建 React 应用根节点并渲染 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  /* 使用 StyleProvider 包装应用，提供样式支持 */
  <StyleProvider
    /* 设置样式自定义优先级为高 */
    hashPriority="high"
    /* 使用旧版逻辑属性转换器 */
    transformers={[legacyLogicalPropertiesTransformer]}
  >
    {/* 渲染路由组件 */}
    <Router />
  </StyleProvider>
);

/* 关闭加载动画 */
/* 获取加载动画元素 */
const firstElement = document.getElementById("first");
/* 如果加载动画存在且未隐藏，则隐藏它 */
if (firstElement && firstElement.style?.display !== "none") {
  firstElement.style.display = "none";
}
