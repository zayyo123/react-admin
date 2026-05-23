/**
 * 学习提示：表格组件模块：封装 Ant Design Table 的列配置、筛选、拖拽、虚拟滚动和文本展示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { Dispatch } from 'react';
import { createContext } from 'react';
import { TableAction } from './reducer';

interface ScrollContextProps {
  dispatch?: Dispatch<TableAction>;
  renderLen: number;
  start: number;
  offsetStart: number;
  rowHeight: number;
  totalLen: number;
}

export const ScrollContext = createContext<ScrollContextProps>({
  dispatch: undefined,
  renderLen: 1,
  start: 0,
  offsetStart: 0,
  rowHeight: 46,
  totalLen: 0,
});
