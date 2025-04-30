import type { PluginOption } from "vite";

/**
 * 显示打包时间插件
 * 用于统计和显示构建过程的耗时
 */
export const timePlugin = (): PluginOption => {
  return {
    /* 插件名称 */
    name: "vite-build-time",
    /* 插件执行时机，pre 表示在其他插件之前执行 */
    enforce: "pre",
    /* 只在构建时应用此插件 */
    apply: "build",
    /* 构建开始时记录时间 */
    buildStart: () => {
      console.time("打包时间");
    },
    /* 构建结束时记录时间 */
    buildEnd: () => {
      // console.timeEnd('\n模块转义完成时间')
    },
    /* 在服务器关闭时被调用，输出总耗时 */
    closeBundle: () => {
      console.timeEnd("打包时间");
    },
  };
};
