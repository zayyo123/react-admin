/**
 * 学习提示：表格组件模块：封装 Ant Design Table 的列配置、筛选、拖拽、虚拟滚动和文本展示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
export interface InitTableState {
  rowHeight: number;
  curScrollTop: number;
  scrollHeight: number;
  tableScrollY: number;
  total: number;
}

export interface TableAction extends Partial<InitTableState> {
  type: 'changeScroll' | 'reset';
}

/**
 * 状态管理reducer
 * @param state - 初始化值
 * @param action - 触发值
 */
export function reducer(state: InitTableState, action: TableAction) {
  switch (action.type) {
    // 监听滚动变化
    case 'changeScroll':
      let curScrollTop = action.curScrollTop || 0;
      let scrollHeight = action.scrollHeight || 0;
      const tableScrollY = action.tableScrollY || 0;

      // 处理scrollHeight小于0的情况
      if (scrollHeight <= 0) scrollHeight = 0;

      // 更新可滚动区高度
      if (scrollHeight !== 0 && tableScrollY === state.tableScrollY) {
        scrollHeight = state.scrollHeight;
      }

      // 更新当前滚动高度
      if (state.scrollHeight && curScrollTop > state.scrollHeight) {
        curScrollTop = state.scrollHeight;
      }

      return {
        ...state,
        curScrollTop,
        scrollHeight,
        tableScrollY,
      };

    // 重置
    case 'reset':
      return {
        ...state,
        curScrollTop: 0,
        scrollHeight: 0,
      };

    default:
      throw new Error('表格：未知错误类型!');
  }
}
