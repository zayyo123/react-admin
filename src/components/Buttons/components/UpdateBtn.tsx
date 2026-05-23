/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  isLoading?: boolean;
}

function UpdateBtn(props: Props) {
  const { isLoading, loading, className } = props;
  const { t } = useTranslation();

  // 清除自定义属性
  const params: Partial<Props> = { ...props };
  delete params.isLoading;

  return (
    <Button
      type="primary"
      {...params}
      className={`${className} small-btn`}
      loading={!!isLoading || loading}
    >
      {t('public.edit')}
    </Button>
  );
}

export default UpdateBtn;
