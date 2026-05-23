/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { setLocalInfo, getLocalInfo, removeLocalInfo } from '@south/utils';
import { TOKEN } from '@/utils/config';

/**
 * token存取方法
 */
export function useToken() {
  /** 获取token */
  const getToken = () => {
    return getLocalInfo<string>(TOKEN) || '';
  };

  /**
   * 设置token
   * @param value - token值
   */
  const setToken = (value: string) => {
    setLocalInfo(TOKEN, value);
  };

  /** 删除token */
  const removeToken = () => {
    removeLocalInfo(TOKEN);
  };

  return [getToken, setToken, removeToken] as const;
}
