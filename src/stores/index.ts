/**
 * 学习提示：Zustand 状态模块：负责保存跨组件共享的数据，例如用户、菜单、主题和页签。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useTabsStore } from '@/stores/tabs';
import { useUserStore } from '@/stores/user';
import { usePublicStore } from './public';
import { useMenuStore } from './menu';

export { useTabsStore, useUserStore, usePublicStore, useMenuStore };
