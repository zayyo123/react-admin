/**
 * 学习提示：后台布局模块：负责菜单、顶部栏、页签、内容区、页面缓存和响应式布局。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Tooltip } from 'antd';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface Props {
  isRefresh: boolean;
  onClick: () => void;
}

function TabRefresh(props: Props) {
  const { t } = useTranslation();
  const { isRefresh, onClick } = props;

  return (
    <Tooltip title={t('public.reload')} placement="bottom">
      <Icon
        className={`
          change
          flex
          items-center
          justify-center
          text-lg
          cursor-pointer
          ${isRefresh ? 'animate-spin pointer-events-none' : ''}
        `}
        onClick={() => onClick()}
        icon="ant-design:reload-outlined"
      />
    </Tooltip>
  );
}

export default TabRefresh;
