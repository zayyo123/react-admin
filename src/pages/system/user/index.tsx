/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { Key, TableRowSelection } from 'antd/es/table/interface';
import { type FormInstance, Button, Form, message } from 'antd';
import { useMemo, useCallback } from 'react';
import { useEffectOnActive } from 'keepalive-for-react';
import { createList, searchList, tableColumns } from './model';
import {
  batchDeleteUser,
  createUser,
  deleteUser,
  getUserById,
  getUserPage,
  updateUser,
} from '@/servers/system/user';
import PermissionDrawer from './components/PermissionDrawer';

// 表格操作列只会用到当前行的 id 和 username，所以这里单独声明一个窄类型，避免整行数据都写成 any。
interface RowData {
  id: string;
  username: string;
}

// 新增用户时的表单默认值。编辑时会被接口返回的数据覆盖。
const initCreate = {
  status: 1,
};

/**
 * 用户管理页面。
 * 这是学习后台 CRUD 的推荐入口：它完整展示了搜索、分页、表格、多选、权限按钮、
 * 新增/编辑弹窗、删除、批量删除和权限抽屉这些中后台常见交互。
 */
function Page() {
  const { t } = useTranslation();
  // ref 用来从父组件手动触发 BaseForm 内部的 submit，这在弹窗底部按钮提交表单时很常见。
  const createFormRef = useRef<FormInstance>(null);
  const [messageApi, contextHolder] = message.useMessage();
  // isFetch 是一个“触发器状态”：搜索或分页先更新参数，再把它设为 true，由 useEffect 统一请求数据。
  const [isFetch, setFetch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState(ADD_TITLE(t));
  // createId 为空表示新增，有值表示编辑。后面提交时也用它判断调用 createUser 还是 updateUser。
  const [createId, setCreateId] = useState('');
  const [createData, setCreateData] = useState<BaseFormData>(initCreate);
  // 搜索参数、分页参数和表格数据是列表页最核心的三类状态。
  const [searchData, setSearchData] = useState<BaseFormData>({});
  const [page, setPage] = useState(INIT_PAGINATION.page);
  const [pageSize, setPageSize] = useState(INIT_PAGINATION.pageSize);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<BaseFormData[]>([]);
  const [promiseId, setPromiseId] = useState('');
  const [isPromiseOpen, setPromiseOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [handleSetSearchParams] = useSearchUrlParams(searchForm);

  const { permissions } = useCommonStore();

  // 权限前缀。后端返回的权限码和这里拼出来的字符串匹配时，页面按钮才会展示。
  const permissionPrefix = '/authority/user';

  // 页面权限集中计算，JSX 中只关心 true/false，避免到处散落权限字符串。
  const pagePermission: PagePermission = {
    page: checkPermission(permissionPrefix, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions),
    permission: checkPermission(`${permissionPrefix}/authority`, permissions),
  };

  /** 获取表格数据 */
  const getPage = useCallback(async () => {
    // 请求参数由搜索条件 + 当前分页组成，这是列表页最常见的数据请求形态。
    const params = { ...searchData, page, pageSize };

    try {
      setLoading(true);
      const { code, data } = await getUserPage(params);
      if (Number(code) !== 200) return;
      const { items, total } = data;
      setTotal(total || 0);
      setTableData(items || []);
    } finally {
      setFetch(false);
      setLoading(false);
    }
  }, [page, pageSize, searchData]);

  // 搜索、分页等操作会先更新 state，再通过 isFetch 触发请求，保证请求拿到的是最新参数。
  useEffect(() => {
    if (isFetch) getPage();
  }, [getPage, isFetch]);

  // 首次进入自动加载接口数据；没有页面权限时不请求列表，避免无权限用户看到数据。
  useEffect(() => {
    if (pagePermission.page) getPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagePermission.page]);

  // keepalive 页面重新激活时刷新列表，适合后台页签切回来后同步最新数据。
  useEffectOnActive(() => {
    getPage();
  }, []);

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: BaseFormData) => {
    // 搜索通常回到第一页，否则用户可能停留在一个新条件下不存在的页码。
    setPage(1);
    setSearchData(values);
    // 把搜索条件写入 URL，刷新页面或复制链接时可以恢复当前搜索。
    handleSetSearchParams(values);
    setFetch(true);
  };

  /** 开启权限 */
  const openPermission = async (id: string) => {
    setPromiseId(id);
    setPromiseOpen(true);
  };

  /** 关闭权限 */
  const closePermission = () => {
    setPromiseOpen(false);
  };

  /** 点击新增 */
  const onCreate = () => {
    // 新增时清空编辑 id，并恢复默认表单数据。
    setCreateOpen(true);
    setCreateTitle(ADD_TITLE(t));
    setCreateId('');
    setCreateData(initCreate);
  };

  /**
   * 点击编辑
   * @param id - 唯一值
   */
  const onUpdate = async (id: string) => {
    try {
      // 编辑时先打开弹窗给用户反馈，再请求详情数据填充表单。
      setCreateOpen(true);
      setCreateTitle(EDIT_TITLE(t, id));
      setCreateId(id);
      setCreateLoading(true);
      const { code, data } = await getUserById(id);
      if (Number(code) !== 200) return;
      setCreateData(data);
    } finally {
      setCreateLoading(false);
    }
  };

  /** 表格提交 */
  const createSubmit = () => {
    // 弹窗确认按钮不在 Form 内部，所以通过 ref 调用表单 submit。
    createFormRef.current?.submit();
  };

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false);
  };

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: BaseFormData) => {
    try {
      setCreateLoading(true);
      // createId 有值就是编辑，没有值就是新增，两个动作共用一个弹窗和一套表单。
      const functions = () => (createId ? updateUser(createId, values) : createUser(values));
      const { code, message } = await functions();
      if (Number(code) !== 200) return;
      messageApi.success(message || t('public.successfulOperation'));
      setCreateOpen(false);
      getPage();
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * 点击删除
   * @param id - 唯一值
   */
  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const { code, message } = await deleteUser(id);
      if (Number(code) === 200) {
        messageApi.success(message || t('public.successfullyDeleted'));
        getPage();
      }
    } finally {
      setLoading(false);
    }
  };

  /** 处理批量删除 */
  const handleBatchDelete = async () => {
    try {
      // 批量操作前必须先检查是否有勾选项，否则会发出无意义的接口请求。
      if (!selectedRowKeys.length) {
        return messageApi.warning({
          content: t('public.tableSelectWarning'),
          key: 'pleaseSelect',
        });
      }
      setLoading(true);
      const params = { ids: selectedRowKeys };
      const { code, message } = await batchDeleteUser(params);
      if (Number(code) === 200) {
        messageApi.success(message || t('public.successfullyDeleted'));
        getPage();
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (page: number, pageSize: number) => {
    // 分页组件只负责改页码和每页条数，真正请求仍交给 isFetch 触发器统一处理。
    setPage(page);
    setPageSize(pageSize);
    setFetch(true);
  };

  /**
   * 监听表格多选变化
   * @param newSelectedRowKeys - 勾选值
   */
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    // Antd Table 多选只需要维护 selectedRowKeys，删除时把这组 key 发给后端。
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** 表格多选  */
  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  const optionRender = useCallback(
    (_: unknown, record: object) => {
      return (
        <div className="flex flex-wrap gap-5px">
          {/* 操作列按钮都受权限控制：没有权限时按钮不渲染，而不是只禁用。 */}
          {pagePermission.permission === true && (
            <Button className="small-btn" onClick={() => openPermission((record as RowData).id)}>
              {t('system.permissions')}
            </Button>
          )}
          {pagePermission.update === true && (
            <UpdateBtn onClick={() => onUpdate((record as RowData).id)} />
          )}
          {pagePermission.delete === true && (
            <DeleteBtn
              name={(record as RowData).username}
              handleDelete={() => onDelete((record as RowData).id)}
            />
          )}
        </div>
      );
    },
    [
      pagePermission.permission,
      pagePermission.update,
      pagePermission.delete,
      t,
      openPermission,
      onUpdate,
      onDelete,
    ],
  );

  // 缓存列配置。语言或操作列渲染函数变化时才重新生成 columns，避免表格无意义重渲染。
  const columns = useMemo(() => tableColumns(t, optionRender), [t, optionRender]);

  /** 左侧渲染 */
  const leftContentRender = (
    <DeleteBtn
      isIcon
      isLoading={isLoading}
      btnType="batchDelete"
      handleDelete={handleBatchDelete}
    />
  );

  return (
    <BaseContent isPermission={pagePermission.page}>
      {contextHolder}
      <BaseCard>
        <BaseSearch
          list={searchList(t)}
          searchForm={searchForm}
          data={searchData}
          type="grid"
          isLoading={isLoading}
          handleFinish={onSearch}
        />
      </BaseCard>

      <BaseCard className="mt-10px">
        <BaseTable
          isLoading={isLoading}
          isCreate={pagePermission.create}
          columns={columns}
          dataSource={tableData}
          rowSelection={rowSelection}
          leftContent={leftContentRender}
          rightContent={<div>（搜索将参数放入url）</div>}
          getPage={getPage}
          onCreate={onCreate}
        />

        <BasePagination
          disabled={isLoading}
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onChangePagination}
        />
      </BaseCard>

      <BaseModal
        title={createTitle}
        open={isCreateOpen}
        confirmLoading={isCreateLoading}
        onOk={createSubmit}
        onCancel={closeCreate}
      >
        <BaseForm
          form={form}
          ref={createFormRef}
          list={createList(t, !createId)}
          labelCol={{ span: 4 }}
          data={createData}
          handleFinish={handleCreate}
        />
      </BaseModal>

      <PermissionDrawer isOpen={isPromiseOpen} id={promiseId} onClose={closePermission} />
    </BaseContent>
  );
}

export default Page;
