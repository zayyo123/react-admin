/**
 * 学习提示：内部请求包：基于 axios 封装统一请求实例、拦截器和重复请求取消。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { AxiosResponse, InternalAxiosRequestConfig, CreateAxiosDefaults, Cancel } from 'axios';

export interface RequestCancel extends Cancel {
  data: object;
  response: {
    status: number;
    data: {
      code?: number;
      message?: string;
    };
  };
}

export interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: RequestCancel) => void;
  // 响应拦截
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: RequestCancel) => void;
}

// 自定义传入的参数
export interface CreateRequestConfig<T = AxiosResponse> extends CreateAxiosDefaults {
  interceptors?: RequestInterceptors<T>;
}

// 接口响应数据
export interface ServerResult<T = unknown> {
  code: number;
  message?: string;
  data: T;
}
