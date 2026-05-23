/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import styles from '../index.module.less';

function SearchFooter() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center text-dark-50">
      <span className="mr-14px flex items-center">
        <Icon
          className={`${styles.icon} text-20px p-2px mr-5px`}
          icon="ant-design:enter-outlined"
        />
        <span>{t('public.confirm')}</span>
      </span>
      <span className="mr-14px flex items-center">
        <Icon className={`${styles.icon} text-20px p-2px mr-5px`} icon="mdi-arrow-up-thin" />
        <Icon className={`${styles.icon} text-20px p-2px mr-5px`} icon="mdi-arrow-down-thin" />
        <span>{t('public.switch')}</span>
      </span>
      <span className="flex items-center">
        <Icon className={`${styles.icon} text-20px p-2px mr-5px`} icon="mdi:keyboard-esc" />
        <span>{t('public.close')}</span>
      </span>
    </div>
  );
}

export default SearchFooter;
