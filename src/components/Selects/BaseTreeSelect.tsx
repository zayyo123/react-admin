/**
 * 学习提示：下拉选择组件模块：统一普通下拉、树形下拉和接口驱动下拉的使用方式。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { TreeSelect, type TreeSelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { MAX_TAG_COUNT } from './index';

function BaseTreeSelect(props: TreeSelectProps) {
  const { treeData } = props;
  const { t } = useTranslation();

  const currentTreeData =
    treeData?.map((item) => {
      // 如果数组不是对象，则拼接数组
      if (typeof item !== 'object') {
        return { label: item, value: item };
      }
      return item;
    }) || [];

  return (
    <TreeSelect
      allowClear
      showSearch
      maxTagCount={MAX_TAG_COUNT}
      treeNodeFilterProp={props?.fieldNames?.label || 'label'}
      placeholder={t('public.inputPleaseSelect')}
      {...props}
      treeData={currentTreeData}
    />
  );
}

export default BaseTreeSelect;
