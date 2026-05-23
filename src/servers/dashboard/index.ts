/**
 * 学习提示：接口模块：集中封装前端请求方法，页面通过这些函数和后端接口通信。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { request } from '@/utils/request';

/**
 * 获取数据总览数据
 * @param data - 请求数据
 */
export function getDataTrends(data: object) {
  return request.get('/dashboard', { params: data });
}
