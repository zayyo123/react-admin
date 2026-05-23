/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { Input, Tooltip, type InputProps } from 'antd';

function IconInput(props: InputProps) {
  const { value, onChange } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <Input
        {...props}
        value={value}
        onChange={(e) => {
          onChange?.(e);
        }}
      />

      <div
        className="w-30px h-30px ml-10px flex items-center justify-center b b-#d9d9d9 rd-6px"
        style={
          !value
            ? {
                backgroundImage:
                  'repeating-linear-gradient(-45deg, #ececec, #ececec 2px, transparent 2px, transparent 5px)',
              }
            : {}
        }
      >
        <Icon icon={value as string} className="text-16px" />
      </div>

      <Tooltip title={t('systems:menu.helpIcon')}>
        <div
          className="pl-10px pr-2px cursor-pointer"
          onClick={() => window.open('https://icon-sets.iconify.design', '_blank')}
        >
          <QuestionCircleOutlined />
        </div>
      </Tooltip>
    </div>
  );
}

export default IconInput;
