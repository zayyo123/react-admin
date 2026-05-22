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
