/**
 * 学习提示：下拉选择组件模块：统一普通下拉、树形下拉和接口驱动下拉的使用方式。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import BaseSelect from './BaseSelect';
import BaseTreeSelect from './BaseTreeSelect';
import ApiSelect from './ApiSelect';
import ApiTreeSelect from './ApiTreeSelect';
import ApiPageSelect from './ApiPageSelect';

export const MAX_TAG_COUNT = 'responsive'; // 最多显示多少个标签，responsive：自适应

export { BaseSelect, BaseTreeSelect, ApiSelect, ApiTreeSelect, ApiPageSelect };
export type * from './types';
