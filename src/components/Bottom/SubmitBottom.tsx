/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ReactNode } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface Props {
  goBack: () => void;
  handleSubmit: () => void;
  isLoading?: boolean;
  children?: ReactNode;
}

function SubmitBottom(props: Props) {
  const { t } = useTranslation();
  const { goBack, handleSubmit, isLoading, children } = props;

  return (
    <div
      className={`
        w-full
        bg
        fixed
        flex
        justify-end
        left-0
        right-0
        bottom-0
        py-5px
        px-30px
        box-border
        shadow
        shadow-gray-500
    `}
    >
      {children}

      <Button className="mr-10px" danger onClick={goBack}>
        {t('public.back')}
      </Button>
      <Button loading={!!isLoading} type="primary" onClick={handleSubmit}>
        {t('public.submit')}
      </Button>
    </div>
  );
}

export default SubmitBottom;
