/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { HTMLAttributes } from 'react';

function BaseCard(props: HTMLAttributes<unknown>) {
  const { children, className } = props;

  return (
    <div
      {...props}
      id="card"
      className={`
        h-full
        box-border
        overflow-auto
        relative
        box-border
        px-5
        py-3
        rounded-3
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default BaseCard;
