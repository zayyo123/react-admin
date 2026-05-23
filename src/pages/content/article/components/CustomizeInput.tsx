/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { InputProps } from 'antd';
import { Input } from 'antd';

/**
 * 自定义输入
 */
function CustomizeInput(props: InputProps) {
  const { t } = useTranslation();

  return (
    <>
      <Input {...props} placeholder={t('public.inputPleaseEnter')} />
      <div className="mb-5px text-red">{t('content.sensitiveInfo')}</div>
    </>
  );
}

export default CustomizeInput;
