// 这个文件定义了公共类型，主要作用包括：
// 基础数据类型：
// 定义了数组、空值等基础数据类型
// 包括 ArrayData、EmptyData 等
// 接口响应类型：
// 定义了分页接口的响应类型（PageServerResult）
// 定义了分页数据的类型（PaginationData）
// 菜单类型：
// 定义了侧边菜单的类型（SideMenu）
// 包括菜单项、图标、权限等配置
// 权限类型：
// 定义了页面权限的类型（PagePermission）
// 包括增删改查等操作权限
// 表格相关类型：
// 定义了表格列的类型（TableColumn）
// 定义了表格配置的类型（BaseTableProps）
// 定义了表格操作的类型（TableOptions）


import type { ReactNode } from 'react';
import type { TableProps } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ItemType } from 'antd/es/menu/interface';

// 数组
export type ArrayData = string[] | number[] | boolean[]

// 空值
export type EmptyData = null | undefined

// 分页接口响应数据
export interface PageServerResult<T = unknown> {
  items: T,
  total: number
}

// 分页表格响应数据
export interface PaginationData {
  page?: number;
  pageSize?: number;
}

// 侧边菜单
export interface SideMenu extends Omit<ItemType, 'children' | 'label' | 'icon'> {
  label: string;
  labelZh?: string;
  labelEn: string;
  key: string;
  icon?: React.ReactNode | string;
  rule?: string; // 路由权限
  nav?: string[]; // 面包屑路径
  children?: SideMenu[];
}

// 页面权限
export interface PagePermission {
  page?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  [key: string]: boolean | undefined;
}

// 表格列表枚举
export interface ColumnsEnum {
  label: string;
  value: unknown;
  color?: string;
}

// 表格列数据
export interface TableColumn<T = object> extends ColumnType<T> {
  enum?: ColumnsEnum[] | Record<string, unknown>;
  children?: TableColumn<T>[];
  isKeepFixed?: boolean; // 手机端默认关闭fixed，该属性开启fixed
}

// 表格参数
export interface BaseTableProps extends Omit<TableProps, 'columns' | 'rowKey'> {
  rowKey?: string;
  columns: TableColumn[];
}

// 表格操作
export type TableOptions<T = object> = (value: unknown, record: T, index?: number) => ReactNode;
