/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ButtonProps } from 'antd';
import { Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';

interface Props extends ButtonProps {
  isLoading?: boolean;
  btnType?: 'delete' | 'batchDelete';
  name?: string;
  customizeTitle?: string;
  isIcon?: boolean;
  handleDelete: () => void;
}

function DeleteBtn(props: Props) {
  const {
    isLoading,
    loading,
    isIcon,
    customizeTitle,
    name,
    btnType = 'delete',
    className,
    handleDelete,
  } = props;
  const { t } = useTranslation();

  // 清除自定义属性
  const params: Partial<Props> = { ...props };
  delete params.isIcon;
  delete params.isLoading;
  delete params.btnType;
  delete params.handleDelete;

  return (
    <Popconfirm
      title={t('public.kindTips')}
      description={t(
        btnType === 'delete' ? 'public.deleteConfirmMessage' : 'public.batchDeleteConfirmMessage',
        { name: name ? ` ${name} ` : '' },
      )}
      onConfirm={handleDelete}
    >
      <Button
        danger
        type="primary"
        {...params}
        className={`${className} small-btn`}
        icon={params?.icon || (isIcon && <DeleteOutlined />)}
        loading={!!isLoading || loading}
      >
        {customizeTitle || btnType === 'delete' ? t('public.delete') : t('public.batchDelete')}
      </Button>
    </Popconfirm>
  );
}

export default DeleteBtn;
