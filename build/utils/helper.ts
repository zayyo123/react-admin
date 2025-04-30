/* 环境配置类型定义 */
type EnvConfigs = Record<string, string>;

/* Vite 环境变量接口定义 */
interface ViteEnv {
  VITE_SERVER_PORT: number /* 服务器端口号 */;
  VITE_PROXY: [string, string][] /* 代理配置数组 */;
}

/**
 * 处理转化环境变量
 * 将字符串类型的环境变量转换为正确的类型
 * @param envConfigs - 环境变量配置对象
 */
export function handleEnv(envConfigs: EnvConfigs): ViteEnv {
  /* 解构获取需要的环境变量 */
  const { VITE_SERVER_PORT, VITE_PROXY } = envConfigs;

  /* 解析代理配置，将单引号替换为双引号以符合 JSON 格式 */
  const proxy: [string, string][] = VITE_PROXY
    ? JSON.parse(VITE_PROXY.replace(/'/g, '"'))
    : [];

  /* 返回处理后的环境变量配置 */
  const res: ViteEnv = {
    VITE_SERVER_PORT:
      Number(VITE_SERVER_PORT) || 8080 /* 转换为数字，默认 8080 */,
    VITE_PROXY: proxy /* 代理配置 */,
  };

  return res;
}

/**
 * JS 模块分包处理
 * 用于处理 node_modules 中的模块分包
 * @param id - 模块标识符
 */
export function splitJSModules(id: string) {
  /* 处理 pnpm 包管理器的情况 */
  const pnpmName = id.includes(".pnpm") ? ".pnpm/" : "";
  const fileName = `node_modules/${pnpmName}`;

  /* 提取模块名称 */
  const result = id.split(fileName)[1].split("/")[0].toString();

  return result;
}
