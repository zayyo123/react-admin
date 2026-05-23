/**
 * 学习提示：构建配置模块：维护 Vite 插件、代理、打包、环境变量等工程化能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { PluginOption } from 'vite';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';

/**
 * 自动导入处理
 * 配置自动导入规则，减少手动导入的代码量
 */
export const autoImportPlugin = (): PluginOption => {
  return AutoImport({
    // 配置需要自动导入的目录，业务文件可以直接使用这些导出的 hooks、组件和类型。
    dirs: [
      'src/hooks/**',
      'src/components/**',
      'src/stores/**',
      'types/**',
      'src/utils/permissions.ts',
      'src/utils/config.ts',
    ],
    imports: [
      'react',
      'react-router',
      'react-router-dom',
      'react-i18next',
      { from: 'react', imports: ['FC'], type: true },
    ],
    // 该声明文件会被 tsc 读取，不能从仓库中删除。
    dts: 'types/autoImports.d.ts',
    include: [/\.[tj]sx?$/],
    resolvers: [
      (name) => {
        if (name.startsWith('@/')) {
          return {
            from: name.replace('@/', path.resolve(__dirname, 'src/') + '/'),
          };
        }
      },
    ],
  });
};
