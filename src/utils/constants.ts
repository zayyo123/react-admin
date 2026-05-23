/**
 * 学习提示：工具模块：存放项目通用函数、常量、配置、性能和监控相关辅助能力。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { TFunction } from 'i18next';
import { DefaultOptionType } from 'antd/es/select';

/**
 * @description: 公用常量
 */

/**
 * 颜色
 */
export enum colors {
  success = '#87d068',
  primary = '#409EFF',
  warning = '#E6A23C',
  danger = '#f50',
  info = '#909399',
  magenta = 'magenta',
  red = 'red',
  volcano = 'volcano',
  orange = 'orange',
  gold = 'gold',
  lime = 'lime',
  green = 'green',
  cyan = 'cyan',
  blue = 'blue',
  geekblue = 'geekblue',
  purple = 'purple',
}

export interface Constant extends Omit<DefaultOptionType, 'children'> {
  value: string | number;
  label: string;
  type?: EnumShowType;
  color?: colors;
  children?: Constant[];
}

/**
 * 开启状态
 */
export const OPEN_CLOSE = (t: TFunction): Constant[] => [
  { label: t('public.open'), value: 1, color: colors.green, type: 'tag' },
  { label: t('public.close'), value: 0, color: colors.red, type: 'tag' },
];

/**
 * 菜单状态
 */
export const MENU_STATUS = (t: TFunction): Constant[] => [
  { label: t('public.show'), value: 1, color: colors.green, type: 'tag' },
  { label: t('public.hide'), value: 0, color: colors.red, type: 'tag' },
];

/**
 * 菜单类型
 */
export const MENU_TYPES = (t: TFunction): Constant[] => [
  { label: t('systems:menu.catalog'), value: 1, type: 'tag', color: colors.green },
  { label: t('systems:menu.menu'), value: 2, type: 'tag', color: colors.blue },
  { label: t('systems:menu.button'), value: 3, type: 'tag', color: colors.cyan },
];

/**
 * 菜单作用类型
 */
export const MENU_ACTIONS = (t: TFunction): Constant[] => [
  { value: 'create', label: t('system.create') },
  { value: 'update', label: t('system.update') },
  { value: 'delete', label: t('system.delete') },
  { value: 'detail', label: t('system.detail') },
  { value: 'export', label: t('system.export') },
  { value: 'status', label: t('system.status') },
];
