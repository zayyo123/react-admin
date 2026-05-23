/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SearchModalProps } from './components/SearchModal';
import { useRef } from 'react';
import { Tooltip } from 'antd';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import SearchModal from './components/SearchModal';

/**
 * @description: 全局搜索菜单组件
 */
function GlobalSearch() {
  const { t } = useTranslation();
  const modalRef = useRef<SearchModalProps>(null);

  /** 切换显示 */
  const toggle = () => {
    modalRef.current?.toggle();
  };

  return (
    <>
      <Tooltip title={t('public.search')}>
        <Icon
          className="flex items-center justify-center text-lg mr-3 cursor-pointer"
          icon="uil-search"
          onClick={toggle}
        />
      </Tooltip>

      <SearchModal modalRef={modalRef} />
    </>
  );
}

export default GlobalSearch;
