/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ApiFn, BaseFormList } from '#/form';
import type { TFunction } from 'i18next';
import { getPartnerDemo } from '@/servers/platform/partner';

// 搜索数据
export const searchList = (t: TFunction): BaseFormList[] => [
  {
    label: t('public.date'),
    name: 'pay_date',
    component: 'RangePicker',
    componentProps: {
      allowClear: false,
    },
  },
  {
    label: t('dashboard.gameID'),
    name: 'game_ids',
    wrapperWidth: 200,
    component: 'GameSelect',
  },
  {
    label: t('dashboard.cooperativeCompany'),
    name: 'partners',
    wrapperWidth: 200,
    component: 'ApiSelect',
    componentProps: {
      api: getPartnerDemo as ApiFn,
      params: [
        '/platform/partner',
        {
          isAll: true,
        },
      ],
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
];
