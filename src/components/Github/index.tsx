/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Tooltip } from 'antd';
import { Icon } from '@iconify/react';

function Github() {
  /** 跳转Github */
  const goGithub = () => {
    window.open('https://github.com/southliu/react-admin');
  };

  return (
    <Tooltip title="Github">
      <div onClick={goGithub}>
        <Icon
          className="flex items-center justify-center text-lg mr-3 cursor-pointer"
          icon="mdi:github"
        />
      </div>
    </Tooltip>
  );
}

export default Github;
