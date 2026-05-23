/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
interface Options {
  ArrowUp?: () => void;
  ArrowDown?: () => void;
  ArrowLeft?: () => void;
  ArrowRight?: () => void;
  Enter?: () => void;
}

/**
 * 键盘按键事件
 * @param options
 */
export function useKeyStroke(options: Options) {
  /**
   * 点击按键
   * @param even - 按键事件
   */
  const onKeyDown = (even: KeyboardEvent) => {
    switch (even.key) {
      // 上
      case 'ArrowUp':
        options.ArrowUp?.();
        break;

      // 下
      case 'ArrowDown':
        options.ArrowDown?.();
        break;

      // 左
      case 'ArrowLeft':
        options.ArrowLeft?.();
        break;

      // 右
      case 'ArrowRight':
        options.ArrowRight?.();
        break;

      // 回车
      case 'Enter':
        options.Enter?.();
        break;

      default:
        break;
    }
  };

  return [onKeyDown] as const;
}
