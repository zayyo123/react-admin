/**
 * 学习提示：接口模块：集中封装前端请求方法，页面通过这些函数和后端接口通信。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { request } from '@/utils/request';

enum API {
  URL = '/log',
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getLogPage(data: Partial<BaseFormData> & PaginationData) {
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, { params: data });
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createLog(data: BaseFormData) {
  return request.post(`${API.URL}/create`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteLog(id: string) {
  return request.delete(`${API.URL}/${id}`);
}

/**
 * 批量删除
 * @param data - 请求数据
 */
export function batchDeleteLog(data: BaseFormData) {
  return request.post(`${API.URL}/batchDelete`, data);
}
