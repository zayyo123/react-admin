/**
 * 学习提示：接口模块：集中封装前端请求方法，页面通过这些函数和后端接口通信。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { LoginResult } from '@/pages/login/model';
import { request } from '@/utils/request';
import { PermissionResult } from './role';

enum API {
  // 统一维护模块接口前缀，下面所有用户接口都基于这个前缀拼接。
  URL = '/system/user',
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getUserPage(data: Partial<BaseFormData> & PaginationData) {
  // get 请求的查询参数放在 params 中，axios 会自动拼到 URL 后面。
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, { params: data });
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getUserById(id: string) {
  // 详情接口返回单个用户数据，通常用于编辑弹窗回显。
  return request.get<BaseFormData>(`${API.URL}/detail?id=${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createUser(data: BaseFormData) {
  // 新增通常使用 post，把表单数据放到请求体中。
  return request.post(`${API.URL}/create`, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateUser(id: string, data: BaseFormData) {
  // 修改通常使用 put，并把要修改的资源 id 放在路径里。
  return request.put(`${API.URL}/update/${id}`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteUser(id: string) {
  // 删除单条数据，页面调用前一般会通过 DeleteBtn 做二次确认。
  return request.delete(`${API.URL}/${id}`);
}

/**
 * 批量删除
 * @param data - 请求数据
 */
export function batchDeleteUser(data: BaseFormData) {
  // 批量删除一般传 ids 数组，由后端一次性处理。
  return request.post(`${API.URL}/batchDelete`, data);
}

/**
 * 获取权限列表
 * @param data - 搜索数据
 */
export function getUserPermission(data: object) {
  return request.get<PermissionResult>(`${API.URL}/authorize`, { params: data });
}

/**
 * 保存用户权限
 * @param data - 权限数据
 */
export function saveUserPermission(data: object) {
  return request.put(`${API.URL}/authorize/save`, data);
}

/**
 * 获取用户刷新权限
 * @param data - 请求数据
 */
export function getUserRefreshPermissions(data: object) {
  // 登录后或刷新页面时重新拉取用户信息和权限，Layout 会把结果写入 user store。
  return request.get<LoginResult>(`${API.URL}/refreshPermissions`, { params: data });
}
