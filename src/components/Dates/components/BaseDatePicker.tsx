/**
 * 学习提示：日期组件模块：统一 DatePicker/TimePicker 的格式、默认属性和表单提交转换。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { Dayjs } from 'dayjs';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import { string2Dayjs } from '../utils/helper';

function BaseDatePicker(props: DatePickerProps) {
  const { value } = props;
  const params = { ...props };

  // 如果值不是dayjs类型则进行转换
  if (value) params.value = string2Dayjs(value as Dayjs);

  return <DatePicker {...params} />;
}

export default BaseDatePicker;
