/**
 * 学习提示：表格组件模块：封装 Ant Design Table 的列配置、筛选、拖拽、虚拟滚动和文本展示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { useContext } from 'react';
import { ScrollContext } from '../utils/state';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

function VirtualWrapper(props: Props): ReactNode {
  const { children, ...restProps } = props;
  const { renderLen, start, offsetStart } = useContext(ScrollContext);
  let tempNode = null;

  if (children && children !== null) {
    const contents = (children as ReactNode[])?.[1];

    if (Array.isArray(contents) && contents.length) {
      tempNode = [
        (children as ReactNode[])?.[0],
        contents.slice(start, start + renderLen).map((item) => {
          if (Array.isArray(item)) {
            // 兼容antd v4.3.5 --- rc-table 7.8.1及以下
            return item[0];
          }
          // 处理antd ^v4.4.0  --- rc-table ^7.8.2
          return item;
        }),
      ];
    } else {
      tempNode = children;
    }
  }

  return (
    <tbody {...restProps} style={{ transform: `translateY(-${offsetStart}px)` }}>
      {tempNode}
    </tbody>
  );
}

export default VirtualWrapper;
