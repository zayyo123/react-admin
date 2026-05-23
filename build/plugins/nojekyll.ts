/**
 * 学习提示：构建配置模块：维护 Vite 插件、代理、打包、环境变量等工程化能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { PluginOption } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * 打包完后生成 .nojekyll 空文件
 * Github Pages 默认基于 Jekyll 构建，会忽略下划线开头的文件
 * https://github.com/southliu/south-admin-react/issues/276
 */
export const nojekyllPlugin = (): PluginOption => {
  return {
    name: 'vite-create-nojekyll',
    // 在服务器关闭时被调用
    closeBundle: () => {
      console.timeEnd('打包时间');

      // 构建完成后在 dist 目录创建 .nojekyll 文件
      const distPath = path.resolve(process.cwd(), 'dist');
      const noJekyllPath = path.join(distPath, '.nojekyll');

      try {
        fs.writeFileSync(noJekyllPath, '');
        console.log('生成.nojekyll成功');
      } catch (error) {
        console.error('生成.nojekyll失败:', error);
      }
    },
  };
};
