import {
  setLocalInfo, // 用于设置本地存储信息的函数
  getLocalInfo, // 用于获取本地存储信息的函数
  removeLocalInfo, // 用于删除本地存储信息的函数
} from "@south/utils";
// 从配置文件中导入 TOKEN 常量，这是存储 token 的键名
import { TOKEN } from "@/utils/config";

/**
 * token存取方法
 * 这是一个自定义 Hook，用于管理应用中的认证令牌(token)
 *
 * 使用示例：
 * const [getToken, setToken, removeToken] = useToken();
 * const currentToken = getToken();
 * setToken('new-auth-token');
 * removeToken();
 */
export function useToken() {
  /**
   * 获取token
   * 这个函数从本地存储中获取 token
   */
  const getToken = () => {
    // 使用 getLocalInfo 函数获取存储的 token
    // 泛型参数 <string> 表明返回值类型为字符串
    // 如果 token 不存在，则返回空字符串作为默认值
    return getLocalInfo<string>(TOKEN) || "";
  };

  /**
   * 设置token
   * 这个函数用于将 token 保存到本地存储
   * @param value token值 - 要保存的 token 字符串
   */
  const setToken = (value: string) => {
    // 使用 setLocalInfo 函数将 token 保存到本地存储
    // TOKEN 是键名，value 是要保存的值
    setLocalInfo(TOKEN, value);
  };

  /**
   * 删除token
   * 这个函数用于从本地存储中删除 token，通常在用户登出时调用
   */
  const removeToken = () => {
    // 使用 removeLocalInfo 函数从本地存储中删除指定键名的数据
    removeLocalInfo(TOKEN);
  };

  // 返回一个包含三个函数的数组：获取、设置和删除 token 的函数
  // as const 断言确保返回的是一个元组类型，而不是普通数组
  // 这样在解构时可以保持正确的类型信息
  return [getToken, setToken, removeToken] as const;
}
