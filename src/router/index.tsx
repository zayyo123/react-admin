/**
 * 学习提示：路由模块：负责把页面组件组织成浏览器可访问的路由，并处理登录态守卫。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useEffect, useMemo } from 'react';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { HashRouter as Router } from 'react-router-dom';
import nprogress from 'nprogress';
import RouterPage from './components/Router';
import StaticMessage from '@south/message';

// antd
import { theme, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

// 禁止进度条添加loading
nprogress.configure({ showSpinner: false });

// antd主题
const { defaultAlgorithm, darkAlgorithm } = theme;

import { useCommonStore } from '@/hooks/useCommonStore';

function Page() {
  const { i18n } = useTranslation();
  const { theme } = useCommonStore();

  // 获取当前语言
  const currentLanguage = i18n.language;

  // 根据语言选择对应的 locale
  const locale = useMemo(() => {
    return currentLanguage === 'en' ? enUS : zhCN;
  }, [currentLanguage]);

  useEffect(() => {
    // 关闭loading
    const firstElement = document.getElementById('first');
    if (firstElement && firstElement.style?.display !== 'none') {
      firstElement.style.display = 'none';
    }
  }, []);

  // 缓存 ConfigProvider 的 theme 配置
  const themeConfig = useMemo(
    () => ({
      algorithm: [theme === 'dark' ? darkAlgorithm : defaultAlgorithm],
    }),
    [theme],
  );

  return (
    <Router>
      <ConfigProvider locale={locale} theme={themeConfig}>
        <App>
          <StaticMessage />
          <RouterPage />
        </App>
      </ConfigProvider>
    </Router>
  );
}

export default Page;
