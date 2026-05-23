/**
 * 学习提示：表格组件模块：封装 Ant Design Table 的列配置、筛选、拖拽、虚拟滚动和文本展示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { type TableProps } from 'antd';
import { useState } from 'react';

export function useFiler() {
  const [isLock, setLock] = useState(true);

  /**
   * 隐藏表格未勾选数据
   * @param columns - 表格数据
   * @param checks - 勾选
   * @param sortList - 勾选顺序
   */
  const handleFilterTable = (
    columns: TableProps['columns'],
    checks: string[],
    sortList: string[],
  ) => {
    if (!checks?.length || !columns?.length) return [];
    if (isLock) {
      setLock(false);
      return columns || [];
    }

    // 顺序调整为勾选顺序
    columns.sort((a, b) => {
      const aIndex = sortList.indexOf((a as { dataIndex: string }).dataIndex);
      const bIndex = sortList.indexOf((b as { dataIndex: string }).dataIndex);
      return aIndex - bIndex;
    });

    for (let i = 0; i < columns?.length; i++) {
      const item = columns[i] as { dataIndex: string; hidden: boolean };
      item.hidden = !checks.includes(item.dataIndex);
    }

    return columns;
  };

  return [handleFilterTable] as const;
}
