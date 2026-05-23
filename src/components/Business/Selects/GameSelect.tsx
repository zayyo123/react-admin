/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { SelectProps } from 'antd';
import { getGames } from '@/servers/platform/game';
import { ApiSelect } from '@/components/Selects';

/**
 * @description: 游戏下拉组件
 */
function GameSelect(props: SelectProps) {
  return (
    <>
      <ApiSelect
        {...props}
        mode="multiple"
        api={getGames}
        fieldNames={{ label: 'name', value: 'id' }}
      />
    </>
  );
}

export default GameSelect;
