/**
 * 学习提示：后台布局模块：负责菜单、顶部栏、页签、内容区、页面缓存和响应式布局。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Icon } from '@iconify/react';
import { useCommonStore } from '@/hooks/useCommonStore';
import { useTabsStore } from '@/stores';

function TabMaximize() {
  // 是否窗口最大化
  const { isMaximize } = useCommonStore();
  const toggleMaximize = useTabsStore((state) => state.toggleMaximize);

  /** 点击最大化/最小化 */
  const onClick = () => {
    toggleMaximize(!isMaximize);
  };

  return (
    <div className="text-lg cursor-pointer">
      <Icon
        style={{ display: isMaximize ? 'block' : 'none' }}
        icon="ant-design:compress-outlined"
        onClick={onClick}
      />

      <Icon
        style={{ display: !isMaximize ? 'block' : 'none' }}
        icon="ant-design:expand-outlined"
        onClick={onClick}
      />
    </div>
  );
}

export default TabMaximize;
