import type { PluginOption } from "vite";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";

/**
 * 自动导入处理
 * 配置自动导入规则，减少手动导入的代码量
 */
export const autoImportPlugin = (): PluginOption => {
  return AutoImport({
    /* 配置需要自动导入的目录 */
    dirs: [
      "src/hooks/**" /* 自动导入所有 hooks */,
      "src/components/**" /* 自动导入所有组件 */,
      "src/stores/**" /* 自动导入所有状态管理 */,
      "types/**" /* 自动导入所有类型定义 */,
      "src/utils/permissions.ts" /* 自动导入权限工具 */,
      "src/utils/config.ts" /* 自动导入配置工具 */,
    ],
    /* 配置需要自动导入的库 */
    imports: [
      "react" /* 自动导入 React */,
      "react-router" /* 自动导入 React Router */,
      "react-router-dom" /* 自动导入 React Router DOM */,
      "react-i18next" /* 自动导入国际化 */,
      { from: "react", imports: ["FC"], type: true } /* 自动导入 React 类型 */,
    ],
    /* 生成类型声明文件 */
    dts: "types/autoImports.d.ts",
    /* 匹配的文件类型 */
    include: [/\.[tj]sx?$/],
    /* 自定义解析器 */
    resolvers: [
      (name) => {
        /* 处理 @/ 开头的路径别名 */
        if (name.startsWith("@/")) {
          return {
            from: name.replace("@/", path.resolve(__dirname, "src/") + "/"),
          };
        }
      },
    ],
  });
};
