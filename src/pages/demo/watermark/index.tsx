/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWatermark } from '@/hooks/useWatermark';
import { checkPermission } from '@/utils/permissions';
import { useCommonStore } from '@/hooks/useCommonStore';
import BaseContent from '@/components/Content/BaseContent';

function Watermark() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const [Watermark, RemoveWatermark] = useWatermark();
  const isPermission = checkPermission('/demo/watermark', permissions);

  const openWatermark = () => {
    Watermark({
      content: t('content.watermark'),
      height: 300,
      width: 350,
      rotate: -20,
      color: '#000',
      fontSize: 30,
      opacity: 0.07,
    });
  };

  const hidWatermark = () => {
    RemoveWatermark();
  };

  return (
    <BaseContent isPermission={isPermission}>
      <div className="p-30px bg">
        <Button onClick={openWatermark}>{t('content.openWatermark')}</Button>
        <Button danger onClick={hidWatermark}>
          {t('content.hideWatermark')}
        </Button>
      </div>
    </BaseContent>
  );
}

export default Watermark;
