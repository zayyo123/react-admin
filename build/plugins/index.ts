/* 导入 Vite 插件类型定义 */
import type { PluginOption } from "vite";
/* 导入打包分析插件，用于可视化分析打包结果 */
import { visualizer } from "rollup-plugin-visualizer";
/* 导入构建时间统计插件 */
import { timePlugin } from "./time";
/* 导入自动导入插件 */
import { autoImportPlugin } from "./autoImport";
/* 导入版本更新插件 */
import { versionUpdatePlugin } from "./version";
import react from "@vitejs/plugin-react-swc";
/* 导入浏览器兼容性插件，用于支持旧版浏览器 */
import legacy from "@vitejs/plugin-legacy";
import unocss from "unocss/vite";
/* 导入 Gzip 压缩插件 */
import viteCompression from "vite-plugin-compression";

/* 创建 Vite 插件配置 */
export function createVitePlugins() {
  /* 定义插件数组 */
  const vitePlugins: PluginOption[] = [
    // 这是 @vitejs/plugin-react-swc 插件
    // 使用 SWC 编译器替代 Babel，提供更快的编译速度
    // 支持 React 的 JSX 语法转换
    // 提供 React 的热更新（HMR）功能
    // 自动处理 React 的刷新和错误提示
    react(),
    /* 添加 UnoCSS 原子化 CSS 支持 */
    // 允许使用类似 Tailwind CSS 的原子类
    // 按需生成 CSS，减少最终打包体积
    // 提供即时预览功能
    // 支持自定义原子类规则
    // 可以显著提高 CSS 开发效率
    unocss(),
    /* versionUpdatePlugin 添加版本控制插件 */
    // 用于管理项目的版本号
    // 可以自动更新 package.json 中的版本
    // 支持版本号的自动递增
    // 可以在构建时自动更新版本信息
    // 帮助追踪项目的版本变更
    versionUpdatePlugin(),
    /* 添加自动导入插件 */
    // 自动导入常用的组件和函数
    // 减少手动导入的代码量
    // 可以配置自动导入的规则
    // 支持按需导入，避免不必要的代码打包
    // 提高开发效率，减少重复代码
    autoImportPlugin(),
  ];

  /* 生产环境特定配置 */
  if (process.env.NODE_ENV === "production") {
    /* 添加打包分析插件 */
    visualizer({
      gzipSize: true /* 显示 Gzip 压缩后的大小 */,
      brotliSize: true /* 显示 Brotli 压缩后的大小 */,
    }),
      /* 添加浏览器兼容性支持 */
      legacy({
        targets: [
          "Android > 39" /* 支持 Android 4.0 以上 */,
          "Chrome >= 60" /* 支持 Chrome 60 以上 */,
          "Safari >= 10.1" /* 支持 Safari 10.1 以上 */,
          "iOS >= 10.3" /* 支持 iOS 10.3 以上 */,
          "Firefox >= 54" /* 支持 Firefox 54 以上 */,
          "Edge >= 15" /* 支持 Edge 15 以上 */,
        ],
        //这是 @vitejs/plugin-legacy 插件的一个配置项,为旧版浏览器提供对 async/await 语法的支持,支持生成器函数（Generator Functions）,支持生成器函数（Generator Functions）,支持异步迭代器（Async Iterators）,确保在旧版浏览器中也能正常运行使用这些现代 JavaScript 特性的代码
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
      //自定义的构建时间统计插件
      timePlugin(),
      /* 添加 Gzip 压缩插件 */
      vitePlugins.push(viteCompression());
  }

  /* 返回配置好的插件数组 */
  return vitePlugins;
}
