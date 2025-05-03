import { useEffect } from "react";
/* 导入 Ant Design 的 App 组件 */
import { App } from "antd";
/* 导入国际化翻译钩子 */
import { useTranslation } from "react-i18next";
/* 导入 React Router 的 HashRouter 组件 */
import { HashRouter as Router } from "react-router-dom";
/* 导入进度条库 */
import nprogress from "nprogress";
/* 导入路由页面组件 */
import RouterPage from "./components/Router";
/* 导入静态消息组件 */
import StaticMessage from "@south/message"; // keepalive
// keepalive
import { AliveScope } from "react-activation";

/* 导入 Ant Design 相关 */
/* 导入主题和配置提供者组件 */
import { theme, ConfigProvider } from "antd";
/* 导入中文语言包 */
import zhCN from "antd/es/locale/zh_CN";
/* 导入英文语言包 */
import enUS from "antd/es/locale/en_US";

/* 配置进度条，禁用加载动画 */
nprogress.configure({ showSpinner: false });

/* 导入 Ant Design 主题算法 */
const { defaultAlgorithm, darkAlgorithm } = theme;

/* 导入通用状态 Hook */
import { useCommonStore } from "@/hooks/useCommonStore";

/* 定义页面组件 */
function Page() {
  /* 获取国际化相关 */
  const { i18n } = useTranslation();
  /* 获取主题状态 */
  const { theme } = useCommonStore();
  /* 获取当前语言 */
  const currentLanguage = i18n.language;

  /* 组件挂载时执行 */
  useEffect(() => {
    /* 关闭加载动画 */
    const firstElement = document.getElementById("first");
    if (firstElement && firstElement.style?.display !== "none") {
      firstElement.style.display = "none";
    }
  }, []);

  /* 渲染页面 */
  return (
    /* 使用 HashRouter 作为路由容器 */
    <Router>
      {/* 配置 Ant Design 的全局配置 */}
      <ConfigProvider
        /* 根据当前语言设置本地化 */
        locale={currentLanguage === "en" ? enUS : zhCN}
        /* 配置主题 */
        theme={{
          /* 根据主题模式选择算法 */
          algorithm: [theme === "dark" ? darkAlgorithm : defaultAlgorithm],
        }}
      >
        {/* 使用 App 组件包裹应用 */}
        <App>
          {/* 渲染静态消息组件 */}
          <StaticMessage />
          {/* 使用 AliveScope 实现组件缓存 */}
          <AliveScope>
            {/* 渲染路由页面 */}
            <RouterPage />
          </AliveScope>
        </App>
      </ConfigProvider>
    </Router>
  );
}

/* 导出页面组件 */
export default Page;
