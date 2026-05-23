/**
 * 学习提示：构建配置模块：维护 Vite 插件、代理、打包、环境变量等工程化能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { PluginOption } from "vite";
import fs from "fs";
import path from "path";

/**
 * 版本更新插件
 * 用于生成和更新项目的版本信息
 */
export const versionUpdatePlugin = (): PluginOption => {
  /* 存储输出目录路径 */
  let outDir = "";

  return {
    /* 插件名称 */
    name: "version-update",
    /* 配置解析完成后的回调 */
    configResolved(resolvedConfig) {
      /* 获取构建输出目录，默认为 dist */
      outDir = resolvedConfig?.build?.outDir || "dist";
    },
    /* 构建完成时的回调 */
    closeBundle() {
      /* 使用当前时间戳作为版本号 */
      const content = JSON.stringify({ version: new Date().getTime() });
      /* 定义版本信息文件路径 */
      const filePath = path.join(outDir, "version.json");

      /* 如果输出目录不存在则创建 */
      if (outDir && !fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      /* 将版本信息写入文件 */
      fs.writeFileSync(filePath, content, "utf-8");
    },
  };
};
