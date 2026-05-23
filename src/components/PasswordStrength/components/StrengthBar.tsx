/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
interface Props {
  strength: number;
}

const arr = new Array(5).fill(0).map((_, index) => index + 1);

function StrengthBar(props: Props) {
  const { strength } = props;

  return (
    <div className="flex items-center">
      {arr.map((item) => (
        <div
          key={item}
          className={`
            w-19%
            h-5px
            mt-5px
            mr-1%
            rounded-10px
            bg-light-900
            ${item <= strength && strength > 3 ? '!bg-green-400' : ''}
            ${item <= strength && strength === 3 ? '!bg-yellow-400' : ''}
            ${item <= strength && strength < 3 ? '!bg-red-400' : ''}
          `}
        ></div>
      ))}
    </div>
  );
}

export default StrengthBar;
