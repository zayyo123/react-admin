/**
 * 学习提示：工具模块：存放项目通用函数、常量、配置、性能和监控相关辅助能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
/**
 * 检测是否有指定按钮/功能权限。
 * 后端返回的 permissions 是字符串权限码列表，页面按钮、表格操作列等细粒度权限都可以复用该方法。
 * @param value - 检测值
 * @param permissions - 权限
 */
export const checkPermission = (value: string, permissions: string[]): boolean => {
  // 空权限列表直接判定无权限，避免未加载完成时误把按钮展示出来。
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(value);
};
