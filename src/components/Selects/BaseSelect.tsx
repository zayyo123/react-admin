/**
 * 学习提示：下拉选择组件模块：统一普通下拉、树形下拉和接口驱动下拉的使用方式。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Select, type SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { MAX_TAG_COUNT } from './index';

/**
 * @description: 基础下拉组件
 */
function BaseSelect(props: SelectProps) {
  const { options } = props;
  const { t } = useTranslation();

  const currentOptions =
    options?.map((item) => {
      // 如果数组不是对象，则拼接数组
      if (typeof item !== 'object') {
        return { label: item, value: item };
      }
      return item;
    }) || [];

  return (
    <Select
      allowClear
      showSearch
      maxTagCount={MAX_TAG_COUNT}
      placeholder={t('public.inputPleaseSelect')}
      optionFilterProp={props?.fieldNames?.label || 'label'}
      {...props}
      options={currentOptions}
    />
  );
}

export default BaseSelect;
