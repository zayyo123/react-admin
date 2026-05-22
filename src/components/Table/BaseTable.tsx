import type { ResizeCallbackData } from 'react-resizable';
import type { ColumnsType } from 'antd/es/table';
import type { EnumShowType, TableColumn } from '#/public';
import { type TableProps, Table, Button, message, Tag } from 'antd';
import { useMemo, useState, useEffect, useRef, useCallback, memo, type ReactNode } from 'react';
import { useFiler } from './hooks/useFiler';
import { useTranslation } from 'react-i18next';
import { EMPTY_VALUE } from '@/utils/config';
import { useCommonStore } from '@/hooks/useCommonStore';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { getTableHeight, handleRowHeight, filterTableColumns } from './utils/helper';
import ResizableTitle from './components/ResizableTitle';
import useVirtualTable from './hooks/useVirtual';
import TableFilter from './components/TableFilter';
import EllipsisText from './components/EllipsisText';
import './index.less';

type Components = TableProps<object>['components'];

/**
 * 项目通用表格组件。
 * 在 Ant Design Table 基础上统一封装：顶部操作栏、列显隐/排序、列宽拖拽、枚举映射、
 * 文本省略、移动端固定列降级以及可选虚拟滚动。业务页面只需要关注 columns/dataSource/getPage。
 */
interface Props extends Omit<TableProps<object>, 'bordered'> {
  isLoading?: boolean; // 是否加载
  isBordered?: boolean; // 是否开启边框
  isZebra?: boolean; // 是否开启斑马线
  isVirtual?: boolean; // 是否开启虚拟滚动
  isOperate?: boolean; // 是否开启顶部操作栏
  isAuthHeight?: boolean; // 是否自动计算高度
  isCreate?: boolean; // 是否显示新增按钮
  scrollX?: number; // 横向滚动宽度，不传时由表格内容决定
  scrollY?: number; // 纵向滚动高度，不传且开启 isAuthHeight 时自动计算
  leftContent?: ReactNode; // 左侧额外内容
  rightContent?: ReactNode; // 右侧额外内容
  getPage?: () => void; // 刷新/重新获取表格数据
  onCreate?: () => void; // 新增按钮点击回调
}

function BaseTable(props: Props) {
  const {
    isLoading,
    isVirtual,
    isCreate,
    isZebra = true,
    isBordered = true,
    isOperate = true,
    isAuthHeight,
    scrollX,
    scrollY,
    rowClassName,
    size,
    leftContent,
    rightContent,
    getPage,
    onCreate,
  } = props;
  const { t } = useTranslation();
  const { isPhone } = useCommonStore();
  const [handleFilterTable] = useFiler();
  const [columns, setColumns] = useState(filterTableColumns(props.columns as TableColumn[]));
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableFilters, setTableFilters] = useState<string[]>([]);
  const [sortList, setSortList] = useState<string[]>([]);
  const rows = tableRef.current?.querySelectorAll('.ant-table-row');

  // 清除 BaseTable 自定义属性，只把 Antd Table 能识别的参数继续向下传递。
  const params: Partial<Props> = { ...props };
  delete params.isLoading;
  delete params.isVirtual;
  delete params.isCreate;
  delete params.isZebra;
  delete params.isAuthHeight;
  delete params.isBordered;
  delete params.isOperate;
  delete params.scrollX;
  delete params.scrollY;
  delete params.leftContent;
  delete params.rightContent;
  delete params.getPage;
  delete params.onCreate;

  useEffect(() => {
    // 初始化列配置和列过滤器的可选项。列显隐、排序列表共用同一批 dataIndex。
    const newColumns = filterTableColumns(props.columns as TableColumn[]);
    const columnKeys = newColumns?.map((col) => col.dataIndex).filter(Boolean) as string[];
    setColumns(newColumns);
    setTableFilters(columnKeys);
    setSortList(columnKeys);
  }, []);

  // 添加新增缺少方法警告
  if (isCreate && !onCreate) {
    message.warning(t('public.createMethodWarning'));
  }

  // 添加分页缺少方法警告
  if (isOperate && !getPage) {
    message.warning(t('public.getPageWarning'));
  }

  // 表格高度
  const tableHeight = getTableHeight(tableRef.current);

  /**
   * 获取勾选表格数据
   * @param checks - 勾选
   */
  const getTableChecks = (checks: string[], newSortList: string[]) => {
    setTableFilters(checks);
    setSortList(newSortList);
  };

  /**
   * 处理拖拽
   * @param index - 下标
   */
  const handleResize = useCallback(
    (index: number) => {
      return (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        const newColumns = [...columns];
        newColumns[index] = {
          ...newColumns[index],
          width: size.width,
        };
        setColumns(newColumns);
      };
    },
    [columns],
  );

  // 合并最终表格列配置：这里集中处理列显隐、列宽拖拽、枚举显示、文本省略等横切能力。
  const mergedColumns = useMemo(() => {
    const newColumns = handleFilterTable(columns, tableFilters, sortList);
    if (!newColumns) return [];
    const result = newColumns.map((col, index) => ({
      ...col,
      ellipsis: col.ellipsis ?? true,
      // 手机端去除列固定，除非设置了isKeepFixed
      fixed: col?.fixed && !(isPhone && !(col as TableColumn)?.isKeepFixed) ? col.fixed : false,
      onHeaderCell: (column: object, i: number) => ({
        ...col?.onHeaderCell?.(column, i),
        width: col.width,
        onResize: handleResize(index),
      }),
      onCell: (data: object, index?: number) => {
        return {
          ...col?.onCell?.(data, index),
          style: {
            ...col?.onCell?.(data, index)?.style,
            maxWidth: col.width,
            width: col.width,
          },
        };
      },
      render: (value: unknown, record: object, index: number) => {
        const renderContent = col?.render?.(value, record, index);
        let showValue: ReactNode | string = renderContent as ReactNode;
        let showType: EnumShowType = 'text';
        let color: string | undefined = undefined;
        let isStringArr = false; // 是否是字符串数组
        const enumList = (col as TableColumn)?.enum;

        if (enumList && typeof enumList === 'object') {
          // enum 支持数组和对象两种写法：数组可额外配置颜色/展示类型，对象适合简单字典。
          if (Array.isArray(enumList)) {
            for (let i = 0; i < enumList?.length; i++) {
              const item = enumList[i];
              if (String(item.value) === String(showValue)) {
                showValue = item.label;
                color = item.color;
                showType = item?.type || 'text';
                break;
              }
            }
          } else {
            for (const key in enumList) {
              if (key === String(showValue)) {
                showValue = enumList[key] as string;
                break;
              }
            }
          }
        }

        // 如果是字符串数组则用逗号分隔
        if (Array.isArray(showValue)) {
          isStringArr = showValue?.every((item) => typeof item === 'string');
          if (isStringArr) showValue = showValue?.join(', ') || EMPTY_VALUE;
        }

        // 原始值、枚举值和字符串数组走统一省略/标签逻辑；ReactNode 则交还给业务 render 自行控制。
        if (!['object', 'function'].includes(typeof renderContent) || isStringArr) {
          const textContent = String(showValue ?? EMPTY_VALUE);

          // 如果显示类型为标签
          if (showType === 'tag') {
            return <Tag color={color}>{textContent}</Tag>;
          }

          // 超出不省略则换行
          if (col.ellipsis !== undefined && !col.ellipsis) {
            return <span className="break-all break-words whitespace-pre-wrap">{textContent}</span>;
          }

          return (
            <EllipsisText
              width={col.width}
              text={textContent}
              color={color}
              className="break-all"
            />
          );
        }

        return renderContent;
      },
    }));

    return result;
  }, [columns, tableFilters, sortList, isPhone, size, handleFilterTable]);

  // 虚拟滚动所需的尺寸数据。行高优先读取真实 DOM，首屏无数据时再用表格尺寸兜底。
  const virtualOptions = useVirtualTable({
    height: tableHeight, // 设置可视高度
    rowHeight: rows?.[0]?.clientHeight || handleRowHeight(size),
    total: props.dataSource?.length || 0,
  });

  // 虚拟滚动组件
  const virtualComponents = useMemo(() => {
    return {
      header: {
        cell: ResizableTitle,
      },
      body: {
        wrapper: virtualOptions.body.wrapper,
      },
      table: virtualOptions.table,
    } as Components;
  }, [virtualOptions]);

  // 只带拖拽功能组件
  const components: Components = isVirtual
    ? virtualComponents
    : {
        header: {
          cell: ResizableTitle,
        },
      };

  // 滚动配置统一在封装层处理，业务页面无需重复计算自适应高度。
  const scroll = {
    ...props.scroll,
    x: scrollX ?? 'max-content',
    y: scrollY ?? (isAuthHeight ? tableHeight : undefined),
  };

  /**
   * 处理行内样式
   */
  const handleRowClassName: TableProps<object>['rowClassName'] = (
    record: object,
    index: number,
    indent: number,
  ) => {
    const className =
      typeof rowClassName === 'string' ? rowClassName : rowClassName?.(record, index, indent);

    return `${className || ''}`;
  };

  return (
    <div
      id="table"
      className={`
        overflow-auto
        ${isBordered !== false ? 'bordered' : ''}
        ${isZebra !== false ? 'zebra' : ''}
      `}
    >
      {isOperate && (
        <div className="flex justify-between !mb-10px">
          <div className="flex flex-wrap items-center gap-6px">
            {!!isCreate && (
              <Button
                type="primary"
                className="small-btn"
                icon={<PlusOutlined />}
                onClick={onCreate}
              >
                {t('public.create')}
              </Button>
            )}
            {leftContent}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-6px">
            {rightContent ? <div>{rightContent}</div> : undefined}

            <Button
              className="small-btn"
              icon={<RedoOutlined className="transform rotate-270" disabled={!!isLoading} />}
              onClick={getPage}
            >
              {t('public.refresh')}
            </Button>

            <TableFilter
              columns={columns}
              cacheColumns={props.columns}
              getTableChecks={getTableChecks}
            />
          </div>
        </div>
      )}
      <div ref={tableRef}>
        <Table
          size="small"
          rowKey="id"
          pagination={false}
          loading={isLoading}
          {...params}
          rowClassName={handleRowClassName}
          style={{
            borderRadius: 10,
            borderRight: '1px solid rgba(0, 0, 0, .05)',
            borderBottom: '1px solid rgba(0, 0, 0, .05)',
            overflow: 'auto',
            ...props.style,
          }}
          bordered={isBordered !== false}
          scroll={scroll}
          components={components}
          columns={mergedColumns as ColumnsType<object>}
        />
      </div>
    </div>
  );
}

export default memo(BaseTable, (prevProps, nextProps) => {
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.dataSource === nextProps.dataSource &&
    prevProps.columns === nextProps.columns
  );
});
