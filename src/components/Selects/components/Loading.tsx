/**
 * 学习提示：下拉选择组件模块：统一普通下拉、树形下拉和接口驱动下拉的使用方式。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Spin } from 'antd';

function Loading() {
  return (
    <div className="absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2 text-center">
      <Spin spinning={true} />
    </div>
  );
}

export default Loading;
