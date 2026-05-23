/**
 * 学习提示：后台布局模块：负责菜单、顶部栏、页签、内容区、页面缓存和响应式布局。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useState } from 'react';
import { Dropdown } from 'antd';
import { Icon } from '@iconify/react';
import { useDropdownMenu } from '../hooks/useDropdownMenu';

interface Props {
  activeKey: string;
  handleRefresh: (activeKey: string) => void;
}

function TabOptions(props: Props) {
  const { activeKey, handleRefresh } = props;
  const [isOpen, setOpen] = useState(false);

  /**
   * 菜单显示变化
   * @param open - 显示值
   */
  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  // 下拉菜单
  const dropdownMenuParams = { activeKey, onOpenChange, handleRefresh };
  const [items, onClick] = useDropdownMenu(dropdownMenuParams);

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: items(),
        onClick: (e) => onClick(e.key),
      }}
      onOpenChange={onOpenChange}
    >
      <Icon
        className={`
          flex
          items-center
          justify-center
          text-lg
          cursor-pointer
          transition-all
          transform
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}
        icon="ant-design:down-outlined"
      />
    </Dropdown>
  );
}

export default TabOptions;
