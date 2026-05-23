/**
 * 学习提示：构建配置模块：维护 Vite 插件、代理、打包、环境变量等工程化能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
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
      // console.timeEnd('\n模块转义完成时间')
    },
    /* 在服务器关闭时被调用，输出总耗时 */
    closeBundle: () => {
      console.timeEnd("打包时间");
    },
  };
};
