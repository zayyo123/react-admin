/**
 * 学习提示：下拉选择组件模块：统一普通下拉、树形下拉和接口驱动下拉的使用方式。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SelectProps, TreeSelectProps } from 'antd';
import type { ServerResult } from '@south/request';

export type ApiFn = (params?: object | unknown[]) => Promise<ServerResult<unknown>>;

// api参数
interface ApiParam {
  api?: ApiFn;
  params?: object | unknown[];
  apiResultKey?: string;
}

// 带分页的api参数
interface ApiPageParam extends Omit<ApiParam, 'params'> {
  pageKey?: string;
  pageSizeKey?: string;
  queryKey?: string;
  page?: number;
  pageSize?: number;
  params?: object & {
    [key: string]: number;
  };
}

export type ApiSelectProps = ApiParam & SelectProps;

export type ApiTreeSelectProps = ApiParam & TreeSelectProps;

export type ApiPageSelectProps = ApiPageParam & SelectProps;
