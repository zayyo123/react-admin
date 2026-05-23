/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { List, type RowComponentProps } from 'react-window';
import { useCommonStore } from '@/hooks/useCommonStore';

function VirtualList() {
  const { theme } = useCommonStore();

  const names = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => `Name ${i + 1}`);
  }, []);

  function RowComponent({
    index,
    names,
    style,
  }: RowComponentProps<{
    names: string[];
  }>) {
    return (
      <div
        className={`flex items-center justify-between px-10px box-border ${theme === 'dark' && index % 2 ? '!bg-#141414' : ''}`}
        style={style}
      >
        {names[index]}
        <div className="text-slate-500 text-xs">{`${index + 1} of ${names.length}`}</div>
      </div>
    );
  }

  return <List rowCount={10000} rowHeight={35} rowComponent={RowComponent} rowProps={{ names }} />;
}

export default VirtualList;
