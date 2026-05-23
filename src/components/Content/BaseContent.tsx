/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ReactNode } from 'react';
import Forbidden from '@/pages/403';

interface Props {
  isPermission?: boolean;
  children: ReactNode;
}

function BaseContent(props: Props) {
  const { isPermission, children } = props;

  return (
    <>
      {isPermission !== false && (
        <div id="content" className="p-10px">
          {children}
        </div>
      )}
      {isPermission === false && (
        <div className="h-full p-10px box-border overflow-auto">
          <Forbidden />
        </div>
      )}
    </>
  );
}

export default BaseContent;
