/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { changeMenuState } from '@/servers/system/menu';
import { message, Popconfirm, Switch } from 'antd';
import { useState } from 'react';

// 当前行数据
interface RowData {
  id: string;
  label: string;
  labelEn: string;
}

interface Props {
  value: number;
  record: object;
}

function StateSwitch(props: Props) {
  const { value, record } = props;
  const { id, label, labelEn } = record as RowData;
  const { t, i18n } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [messageApi, contextHolder] = message.useMessage();

  const onChange = async () => {
    const value = localValue ? 0 : 1;
    const params = { id, state: value };

    try {
      setLoading(true);
      const { code, message } = await changeMenuState(params);
      if (Number(code) === 200) {
        messageApi.success({
          content: message || t('public.successfulOperation'),
          key: 'success',
        });
        setLocalValue(value);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title={t('systems:menu.changeState')}
        description={t('systems:menu.changeStateMsg', {
          name: i18n.language === 'zh' ? label : labelEn,
          state: value ? t('public.hide') : t('public.show'),
        })}
        onConfirm={onChange}
      >
        <Switch
          checked={!!localValue}
          loading={isLoading}
          checkedChildren={t('public.show')}
          unCheckedChildren={t('public.hide')}
        />
      </Popconfirm>
    </>
  );
}

export default StateSwitch;
