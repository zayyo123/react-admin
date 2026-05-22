import type { PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { timePlugin } from './time';
import { autoImportPlugin } from './autoImport';
import { versionUpdatePlugin } from './version';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import unocss from 'unocss/vite';
import viteCompression from 'vite-plugin-compression';

/** 创建 Vite 插件配置，按环境组合基础插件和生产构建插件。 */
export function createVitePlugins() {
  const vitePlugins: PluginOption[] = [
    react(),
    // UnoCSS 按需生成原子化样式，减少手写样式和最终 CSS 体积。
    unocss(),
    // 构建时写入版本信息，配合前端版本检测提示用户刷新。
    versionUpdatePlugin(),
    // 自动导入常用 API 和组件，降低业务文件中的重复 import。
    autoImportPlugin(),
  ];

  if (process.env.NODE_ENV === 'production') {
    vitePlugins.push(
      // 生成构建产物分析报告，方便定位包体积问题。
      visualizer({
        gzipSize: true,
        brotliSize: true,
      }),
      // 为旧版浏览器补齐必要 polyfill，避免线上兼容性问题。
      legacy({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      // 输出构建耗时，便于观察构建性能变化。
      timePlugin(),
      // 生成 gzip 资源，减少静态资源传输体积。
      viteCompression(),
    );
  }

  return vitePlugins;
}
