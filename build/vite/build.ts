import type { BuildOptions } from "vite";
import { splitJSModules } from "../utils/helper";

/**
 * 构建配置选项
 * 配置生产环境下的构建参数
 */
export function buildOptions(): BuildOptions {
  return {
    /* 设置文件大小警告阈值，超过 1000KB 才显示警告 */
    chunkSizeWarningLimit: 1000,
    /* 设置 sourcemap 生成规则，非生产环境才生成 sourcemap */
    sourcemap: process.env.NODE_ENV !== "production",
    /* 使用 terser 进行代码压缩 */
    minify: "terser",
    /* terser 压缩配置 */
    terserOptions: {
      compress: {
        /* 生产环境移除 console 输出 */
        drop_console: true,
        /* 生产环境移除 debugger 语句 */
        drop_debugger: true,
      },
    },
    /* Rollup 打包配置 */
    rollupOptions: {
      output: {
        /* 代码分割后的文件命名规则 */
        chunkFileNames: "assets/js/[name].[hash].js",
        /* 入口文件的命名规则 */
        entryFileNames: "assets/js/[name].[hash].js",
        /* 静态资源的命名规则 */
        assetFileNames: "assets/[ext]/[name].[hash].[ext]",
        /* 自定义代码分割规则 */
        manualChunks(id) {
          /* 处理 node_modules 中的模块 */
          if (id.includes("node_modules")) {
            /* 使用 splitJSModules 函数进行模块分包 */
            return splitJSModules(id);
          }
        },
      },
    },
  };
}
