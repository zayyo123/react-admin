/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Button, Upload, type UploadProps } from 'antd';

function BaseUpload(props: UploadProps) {
  const { t } = useTranslation();
  const [getToken] = useToken();
  const token = getToken();

  return (
    <Upload {...props} headers={{ ...props?.headers, Authorization: `Bearer ${token}` }}>
      <Button>{t('public.uploadFile')}</Button>
    </Upload>
  );
}

export default BaseUpload;
