/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import BaseContent from '@/components/Content/BaseContent';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';
import { useTranslation } from 'react-i18next';

function Page() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission('/demo/level', permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <div className="m-30px">{t('content.threeTierStructure')}</div>
    </BaseContent>
  );
}

export default Page;
