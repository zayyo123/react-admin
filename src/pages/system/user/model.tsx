/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { TFunction } from 'i18next';
import { MENU_STATUS } from '@/utils/constants';
import { getUserPage } from '@/servers/system/user';
import { getRoleList } from '@/servers/system/role';

const otherSearch: BaseSearchList[] = [];

// 这里故意生成较多搜索项，用来演示 BaseSearch 的折叠/展开能力。
for (let i = 0; i < 32; i++) {
  otherSearch.push({
    label: `名称${i + 1}`,
    name: `label${i + 1}`,
    component: 'Input',
    componentProps: {
      maxLength: 200,
    },
  });
}

/**
 * 搜索表单配置。
 * BaseSearch 会读取这个数组，把每一项转换成 Form.Item 和对应控件。
 * 对初学者来说，可以把它理解成“用 JSON/对象描述表单长什么样”。
 */
export const searchList = (t: TFunction): BaseSearchList[] => [
  {
    label: t('login.username'),
    name: 'username',
    component: 'ApiPageSelect',
    componentProps: {
      // ApiPageSelect 会在下拉时调用接口，并从返回结果里取 items 作为选项列表。
      api: getUserPage as ApiFn,
      apiResultKey: 'items',
      fieldNames: { label: 'username', value: 'username' },
      params: {
        page: 1,
        pageSize: 10,
      },
    },
  },
  {
    label: t('system.email'),
    name: 'email',
    component: 'Input',
  },
  {
    label: t('system.phone'),
    name: 'phone',
    component: 'Input',
  },
  ...otherSearch,
];

/**
 * 表格列配置。
 * BaseTable 会读取这个数组，把每一项转换成 Antd Table 的列。
 * dataIndex 对应接口返回数据里的字段名，render 可以自定义单元格内容。
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (t: TFunction, optionRender: TableOptions<object>): TableColumn[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: t('login.username'),
      dataIndex: 'username',
      width: 100,
      fixed: 'left',
    },
    {
      title: t('public.name'),
      dataIndex: 'name',
      width: 100,
    },
    {
      title: t('system.state'),
      dataIndex: 'status',
      width: 80,
      // enum 交给 BaseTable 统一处理，状态值会被映射成可读文案/标签。
      enum: MENU_STATUS(t),
    },
    {
      title: t('system.role'),
      dataIndex: 'rolesName',
      width: 200,
    },
    {
      title: t('system.phone'),
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: t('system.email'),
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: 200,
    },
    {
      title: t('public.operate'),
      dataIndex: 'operate',
      width: 240,
      fixed: 'right',
      // 操作列把按钮渲染函数交给页面主文件，因为按钮权限和事件都依赖页面状态。
      render: (value: unknown, record: object) => optionRender(value, record),
    },
  ];
};

/**
 * 新增/编辑表单配置。
 * 同一套配置同时服务新增和编辑：isCreate 为 true 时展示密码并校验，编辑时隐藏密码。
 */
export const createList = (t: TFunction, isCreate: boolean): BaseFormList[] => [
  {
    label: t('login.username'),
    name: 'username',
    rules: FORM_REQUIRED,
    component: 'Input',
  },
  {
    label: t('login.password'),
    name: 'password',
    // 编辑用户通常不在此处修改密码，所以编辑模式下隐藏密码项。
    hidden: !isCreate,
    rules: isCreate ? FORM_REQUIRED : undefined,
    component: 'InputPassword',
  },
  {
    label: t('public.name'),
    name: 'name',
    rules: FORM_REQUIRED,
    component: 'Input',
  },
  {
    label: t('system.role'),
    name: 'roleIds',
    rules: FORM_REQUIRED,
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      // 角色下拉通过接口获取，fieldNames 负责把后端字段映射为 Select 需要的 label/value。
      api: getRoleList,
      fieldNames: { label: 'name', value: 'id' },
    },
  },
  {
    label: t('system.state'),
    name: 'status',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: MENU_STATUS(t),
    },
  },
  {
    label: t('system.phone'),
    name: 'phone',
    rules: [{ pattern: /^1[3456789]\d{9}$/, message: t('login.phoneNumberError') }],
    component: 'Input',
  },
  {
    label: t('system.email'),
    name: 'email',
    rules: [{ type: 'email' }],
    component: 'Input',
  },
];
