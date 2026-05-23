/**
 * 学习提示：国际化模块：维护中文、英文等多语言文案，页面通过 t(key) 读取。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { initReactI18next } from 'react-i18next';
import { getZhLang, getEnLang, getZhLangNamespaces, getEnLangNamespaces } from './utils/helper';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      zh: {
        translation: getZhLang(),
        ...getZhLangNamespaces(),
      },
      en: {
        translation: getEnLang(),
        ...getEnLangNamespaces(),
      },
    },
  });

export default i18n;
