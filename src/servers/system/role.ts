/**
 * 学习提示：接口模块：集中封装前端请求方法，页面通过这些函数和后端接口通信。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { Key, ReactNode } from 'react';
import type { DataNode } from 'antd/es/tree';
import { request } from '@/utils/request';

enum API {
  URL = '/system/role',
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getRolePage(data: Partial<BaseFormData> & PaginationData) {
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, { params: data });
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getRoleById(id: string) {
  return request.get<BaseFormData>(`${API.URL}/detail?id=${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createRole(data: BaseFormData) {
  return request.post(`${API.URL}/create`, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateRole(id: string, data: BaseFormData) {
  return request.put(`${API.URL}/update/${id}`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteRole(id: string) {
  return request.delete(`${API.URL}/${id}`);
}

/**
 * 批量删除
 * @param data - 请求数据
 */
export function batchDeleteRole(data: BaseFormData) {
  return request.post(`${API.URL}/batchDelete`, data);
}

/** 获取全部角色 */
export function getRoleList() {
  return request.get<BaseFormData[]>(`${API.URL}/list`);
}

/**
 * 获取权限列表
 * @param data - 搜索数据
 */
export interface PermissionData extends DataNode {
  icon: string | ReactNode;
  type: number;
  children?: PermissionData[];
}
export interface PermissionResult {
  treeData: PermissionData[];
  defaultCheckedKeys: Key[];
}
export function getRolePermission(data: object) {
  return request.get<PermissionResult>(`${API.URL}/authorize`, { params: data });
}
