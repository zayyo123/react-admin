/**
 * 学习提示：工具模块：存放项目通用函数、常量、配置、性能和监控相关辅助能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
/**
 * 是否是方法
 * @param val - 参数
 */
export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

/**
 * 是否是数字
 * @param obj - 值
 */
export function isNumber(obj: unknown): boolean {
  return typeof obj === 'number' && isFinite(obj);
}

/**
 * 是否是URL
 * @param path - 路径
 */
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

/**
 * 是否是NULL
 * @param value - 值
 */
export function isNull(value: unknown): boolean {
  return value === null;
}
