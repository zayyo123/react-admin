/**
 * 学习提示：菜单模块：定义静态菜单数据和菜单转换工具，配合后端菜单生成导航。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SideMenu } from '#/public';

export const demo: SideMenu[] = [
  {
    label: '组件',
    labelEn: 'Components',
    key: '/demo',
    icon: 'fluent:box-20-regular',
    children: [
      {
        label: '剪切板',
        labelEn: 'Copy',
        key: '/demo/copy',
        rule: '/demo/copy',
      },
      {
        label: '水印',
        labelEn: 'Watermark',
        key: '/demo/watermark',
        rule: '/demo/watermark',
      },
      {
        label: '虚拟滚动',
        labelEn: 'Virtual Scroll',
        key: '/demo/virtualScroll',
        rule: '/demo/virtualScroll',
      },
      {
        label: '富文本',
        labelEn: 'Editor',
        key: '/demo/editor',
        rule: '/demo/editor',
      },
      {
        label: '层级1',
        labelEn: 'Level1',
        key: '/demo/level1',
        children: [
          {
            label: '层级2',
            labelEn: 'Level2',
            key: '/demo/level1/level2',
            children: [
              {
                label: '层级3',
                labelEn: 'Level3',
                key: '/demo/level1/level2/level3',
                rule: '/demo/watermark',
              },
            ],
          },
        ],
      },
    ],
  },
];
