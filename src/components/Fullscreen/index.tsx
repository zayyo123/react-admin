/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Tooltip } from 'antd';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from '@/hooks/useFullscreen';

/**
 * @description: 全屏组件
 */
function Fullscreen() {
  const { t } = useTranslation();
  const [isFullscreen, toggleFullscreen] = useFullscreen();

  return (
    <Tooltip title={isFullscreen ? t('public.exitFullscreen') : t('public.fullScreen')}>
      <div
        className="flex items-center justify-center text-lg mr-3 cursor-pointer"
        onClick={toggleFullscreen}
      >
        <Icon
          icon="gridicons-fullscreen-exit"
          style={{ display: isFullscreen ? 'block' : 'none' }}
        />
        <Icon icon="gridicons-fullscreen" style={{ display: !isFullscreen ? 'block' : 'none' }} />
      </div>
    </Tooltip>
  );
}

export default Fullscreen;
