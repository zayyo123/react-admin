import { defineConfig, loadEnv } from "vite";
import { handleEnv } from "./build/utils/helper";
import { createProxy } from "./build/vite/proxy";
import { createVitePlugins } from "./build/plugins";
import { buildOptions } from "./build/vite/build";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /* 获取当前工作目录 */
  const root = process.cwd();
  /* 加载环境变量 */
  const env = loadEnv(mode, root);
  /* 处理环境变量 */
  const viteEnv = handleEnv(env);
  /* 解构获取服务器端口和代理配置 */
  const { VITE_SERVER_PORT, VITE_PROXY } = viteEnv;

  return {
    /* 配置 Vite 插件 */
    plugins: createVitePlugins(),
    /* 配置路径别名 */
    resolve: {
      alias: {
        "@": "/src" /* 将 @ 映射到 src 目录 */,
        "#": "/types" /* 将 # 映射到 types 目录 */,
      },
    },
    /* 配置 CSS 预处理器 */
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true /* 启用 JavaScript 表达式 */,
          charset: false /* 禁用字符集声明 */,
        },
      },
    },
    /* 开发服务器配置 */
    server: {
      open: true /* 自动打开浏览器 */,
      port: VITE_SERVER_PORT /* 设置服务器端口 */,
      /* 配置代理，处理跨域请求 */
      proxy: createProxy(VITE_PROXY),
    },
    /* 构建配置 */
    build: buildOptions(),
  };
});
