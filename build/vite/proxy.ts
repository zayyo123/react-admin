import type { ProxyOptions } from "vite";

/* 定义代理配置列表类型，格式为 [源路径, 目标路径] 的数组 */
type ProxyList = [string, string][];

/* 定义代理目标列表类型，键为字符串，值为代理配置选项 */
type ProxyTargetList = Record<string, ProxyOptions>;

/**
 * 创建跨域代理配置
 * 用于配置开发环境的代理服务器，解决跨域问题
 * @param list - 代理配置列表，格式为 [源路径, 目标路径] 的二维数组
 */
export function createProxy(list: ProxyList = []) {
  /* 创建代理配置对象 */
  const res: ProxyTargetList = {};

  /* 遍历代理配置列表 */
  for (const [prefix, target] of list) {
    /* 配置单个代理规则，使用 ^ 确保精确匹配 */
    res[`^${prefix}`] = {
      /* 设置目标服务器地址 */
      target,
      /* 启用跨域支持，改变请求头中的 host 为目标地址 */
      changeOrigin: true,
      /* 重写请求路径，移除匹配的前缀 */
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
    };
  }

  /* 返回完整的代理配置 */
  return res;
}
