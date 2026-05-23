/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { InputProps } from 'antd';
import { Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useClipboard } from '@/hooks/useClipboard';

const { Search } = Input;

function CopyInput(props: InputProps) {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isCopied, error, copyText] = useClipboard();

  useEffect(() => {
    if (isCopied && !error) {
      messageApi.success({ content: t('public.copySuccessfully'), key: 'copy' });
    }

    if (error) {
      messageApi.warning({ content: error || t('public.copyFailed'), key: 'copy' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCopied, error]);

  /**
   * 处理复制
   * @param value - 复制内容
   */
  const handleCopy = (value: string) => {
    if (!value) return messageApi.warning({ content: t('public.inputPleaseEnter'), key: 'copy' });
    try {
      copyText(value);
    } catch (e) {
      console.error(e);
      messageApi.warning({ content: t('public.copyFailed'), key: 'copy' });
    }
  };

  return (
    <>
      {contextHolder}
      <Search
        {...props}
        placeholder={t('public.inputPleaseEnter')}
        enterButton={t('public.copy')}
        onSearch={handleCopy}
      />
    </>
  );
}

export default CopyInput;
