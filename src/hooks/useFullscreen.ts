/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { usePublicStore } from '@/stores/public';
import { useCommonStore } from './useCommonStore';

export function useFullscreen() {
  const { isFullscreen } = useCommonStore();
  const setFullscreen = usePublicStore((state) => state.setFullscreen);

  /** 切换全屏 */
  const toggleFullscreen = () => {
    // 全屏
    if (!isFullscreen && document.documentElement?.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
      return true;
    }
    // 退出全屏
    if (isFullscreen && document?.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
      return true;
    }
  };

  return [isFullscreen, toggleFullscreen] as const;
}
