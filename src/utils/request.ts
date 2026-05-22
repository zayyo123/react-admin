import { TOKEN } from '@/utils/config';
import { creteRequest } from '@south/request';

/**
 * 项目级请求实例。
 *
 * 开发环境走 `/api`，再由 Vite dev server 的 proxy 转发到真实后端；
 * 非开发环境直接读取 `.env.*` 中的 `VITE_BASE_URL`，用于部署后的真实接口地址。
 */
const prefixUrl = import.meta.env.VITE_BASE_URL as string;
const baseURL = process.env.NODE_ENV !== 'development' ? prefixUrl : '/api';

/**
 * 创建带 token 注入、响应拦截、重复请求取消能力的请求实例。
 * TOKEN 是本地缓存中保存登录令牌的 key，请求包内部会用它读取并拼接认证信息。
 */
export const request = creteRequest(baseURL, TOKEN);

// 创建多个请求
// export const newRequest = creteRequest('/test', TOKEN);

/**
 * 取消指定请求。
 *
 * 常用于页面卸载、切换查询条件或关闭弹窗时，主动终止仍在进行的请求，
 * 避免旧请求返回后覆盖新页面状态。
 *
 * @param url - 请求唯一标识，支持单个或多个
 */
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url);
};

/**
 * 取消当前请求实例中的全部请求。
 *
 * 适合退出登录、刷新权限、离开大模块等场景，避免无效请求继续占用网络和更新状态。
 */
export const cancelAllRequest = () => {
  return request.cancelAllRequest();
};
