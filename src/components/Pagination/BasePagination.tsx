/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';

function BasePagination(props: PaginationProps) {
  const { t } = useTranslation();

  /**
   * 显示总数
   * @param total - 总数
   */
  const showTotal = (total?: number): string => {
    return t('public.totalNum', { num: total || 0 });
  };

  return (
    <div
      id="pagination"
      className={`
        w-full
        flex
        items-center
        justify-end
        min-h-40px
        box-border
        z-999
      `}
    >
      <Pagination showSizeChanger showQuickJumper size="small" showTotal={showTotal} {...props} />
    </div>
  );
}

export default BasePagination;
